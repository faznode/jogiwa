// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
 * Throwaway verification (Phase 2). Replays two REAL Pons V2 curve buys on a
 * Robinhood Chain fork and checks that (a) the live contract reproduces the
 * on-chain event outputs and (b) our independently written formula matches
 * them to the wei.
 *
 * Real transactions:
 *   launch+buy1: 0x97625bc7aecd155186d2338a9e03f9a07258cbec764cf62304aeab8a4b248acd (block 96128863)
 *   buy2       : 0x3cfff78a0dad88c4c1367de62b9fb929d286eb14ee0af98997a77f31ee83b691 (block 96128869, ts 1792778128)
 *
 * Run:
 *   forge test --fork-url https://rpc.mainnet.chain.robinhood.com --fork-block-number 96128868 -vv
 */

interface Vm {
    function warp(uint256) external;
    function deal(address, uint256) external;
    function prank(address) external;
    function roll(uint256) external;
}

interface IPonsV2Curve {
    function buy(uint256 quoteIn, uint256 minTokensOut, address recipient) external payable returns (uint256);
    function getReserves() external view returns (uint256 quoteReserve_, uint256 tokenReserve_);
    function currentSnipeTaxBps(address recipient) external view returns (uint256);
    function feeBps() external view returns (uint256);
    function creatorTaxBps() external view returns (uint256);
    function phantomQuote() external view returns (uint256);
    function graduationThreshold() external view returns (uint256);
    function reservedTokens() external view returns (uint256);
    function launchSupply() external view returns (uint256);
    function trackedQuote() external view returns (uint256);
    function trackedTokens() external view returns (uint256);
    function quoteFeeBalance() external view returns (uint256);
    function creatorTaxBalance() external view returns (uint256);
}

contract PonsV2CurveReplayTest {
    Vm constant vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
    IPonsV2Curve constant curve = IPonsV2Curve(0xb9c425Ff3706E17b061FdA39bb9062999be542f9);

    uint256 constant BP = 10_000;
    // on-chain CurveBuy event values for buy2
    address constant BUYER2 = 0x610DE2b5Fe686748cEAa6c5f1Cb45f3AA9672208;
    uint256 constant QUOTE_IN2 = 0xb1a2bc2ec50000; // 0.05 ETH
    uint256 constant TOKENS_OUT2 = 0x158629d59b4fe7a4f05c7f;
    uint256 constant FEE_PLUS_SNIPE2 = 0xcc11602be6000;
    uint256 constant TAX2 = 0x38d7ea4c68000;
    uint256 constant TS2 = 1792778128;
    uint256 constant LAUNCHED_AT = 1792778127;

    // on-chain CurveBuy event values for buy1 (atomic launch buy, snipe-exempt)
    uint256 constant QUOTE_IN1 = 1e16;
    uint256 constant TOKENS_OUT1 = 0x4bfa205309e4d775ecc23;

    /// Our own re-derivation of the curve: constant product with fee legs off the quote side.
    function formulaBuy(uint256 spent, uint256 qRes, uint256 tRes, uint256 feeBps, uint256 taxBps, uint256 snipeBps)
        internal
        pure
        returns (uint256 tokensOut, uint256 fee, uint256 tax, uint256 snipe)
    {
        fee = (spent * feeBps) / BP;
        tax = (spent * taxBps) / BP;
        snipe = (spent * snipeBps) / BP;
        uint256 net = spent - fee - tax - snipe;
        tokensOut = (net * tRes) / (qRes + net);
    }

    function snipeBpsAt(uint256 startBps, uint256 windowSecs, uint256 elapsed) internal pure returns (uint256) {
        if (elapsed >= windowSecs) return 0;
        return startBps >> ((elapsed * 14) / windowSecs);
    }

    function test_reservedTokensMatchesDerivation() public view {
        uint256 s = curve.launchSupply();
        uint256 q0 = curve.phantomQuote();
        uint256 g = curve.graduationThreshold();
        uint256 expected = (s * q0) / (q0 + g); // Math.mulDiv floor
        require(curve.reservedTokens() == expected, "reservedTokens != S*Q0/(Q0+G)");
        require(expected == 285714285714285714285714285, "reserved constant drift");
    }

    function test_buy1_formulaMatchesOnchainEvent() public view {
        // Pre-state of buy1 is the launch state: Q0 virtual, full supply, no fees.
        (uint256 out, uint256 fee, uint256 tax,) =
            formulaBuy(QUOTE_IN1, curve.phantomQuote(), curve.launchSupply(), curve.feeBps(), curve.creatorTaxBps(), 0);
        require(out == TOKENS_OUT1, "buy1 tokensOut mismatch");
        require(fee == 1e14 && tax == 2e14, "buy1 fee/tax mismatch");
    }

    function test_buy2_forkReplayMatchesOnchainEvent() public {
        // Fork is pinned at block 96128868 (state immediately before buy2).
        vm.warp(TS2);
        uint256 snipeBps = curve.currentSnipeTaxBps(BUYER2);
        require(snipeBps == snipeBpsAt(9_900, 3, TS2 - LAUNCHED_AT), "snipe decay formula mismatch");
        require(snipeBps == 618, "expected 9900>>4 = 618 bps at t+1s");

        (uint256 qRes, uint256 tRes) = curve.getReserves();
        (uint256 out, uint256 fee, uint256 tax, uint256 snipe) =
            formulaBuy(QUOTE_IN2, qRes, tRes, curve.feeBps(), curve.creatorTaxBps(), snipeBps);
        require(out == TOKENS_OUT2, "formula tokensOut != event");
        require(fee + snipe == FEE_PLUS_SNIPE2, "formula fee+snipe != event");
        require(tax == TAX2, "formula tax != event");

        // Live contract replay on the fork
        vm.deal(BUYER2, 1 ether);
        vm.prank(BUYER2);
        uint256 got = curve.buy{value: QUOTE_IN2}(QUOTE_IN2, 0, BUYER2);
        require(got == TOKENS_OUT2, "fork replay tokensOut != event");
    }
}
