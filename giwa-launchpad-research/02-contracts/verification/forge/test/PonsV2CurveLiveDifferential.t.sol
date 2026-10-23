// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
 * Throwaway verification (Phase 2). Live-fork differential test: forks the
 * CURRENT Robinhood Chain head (public RPC is not an archive node), reads the
 * live reserves of a real Pons V2 curve, computes our re-derived formula, then
 * executes a real buy against the live bytecode and checks both agree to the wei.
 * Also checks sell() round trip pricing and the graduation allocation identity.
 *
 * Run:
 *   forge test --match-contract LiveDifferential --fork-url https://rpc.mainnet.chain.robinhood.com -vv
 */

interface Vm {
    function deal(address, uint256) external;
    function prank(address) external;
    function startPrank(address) external;
    function stopPrank() external;
}

interface IERC20Min {
    function approve(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

interface IPonsV2Curve {
    function buy(uint256 quoteIn, uint256 minTokensOut, address recipient) external payable returns (uint256);
    function sell(uint256 tokensIn, uint256 minQuoteOut, address recipient) external returns (uint256);
    function getReserves() external view returns (uint256 quoteReserve_, uint256 tokenReserve_);
    function currentSnipeTaxBps(address recipient) external view returns (uint256);
    function feeBps() external view returns (uint256);
    function creatorTaxBps() external view returns (uint256);
    function phantomQuote() external view returns (uint256);
    function graduationThreshold() external view returns (uint256);
    function reservedTokens() external view returns (uint256);
    function launchSupply() external view returns (uint256);
    function sellableTokens() external view returns (uint256);
    function token() external view returns (address);
    function graduated() external view returns (bool);
}

contract PonsV2CurveLiveDifferentialTest {
    Vm constant vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
    // Curve of the launch at tx 0x97625bc7… (token 0x65b101d4…). Still on-curve at research time.
    IPonsV2Curve constant curve = IPonsV2Curve(0xb9c425Ff3706E17b061FdA39bb9062999be542f9);
    uint256 constant BP = 10_000;
    address constant TRADER = address(0xBEeF0000000000000000000000000000000000bE);

    function formulaBuy(uint256 spent, uint256 qRes, uint256 tRes, uint256 feeBps, uint256 taxBps, uint256 snipeBps)
        internal
        pure
        returns (uint256 tokensOut)
    {
        uint256 net = spent - (spent * feeBps) / BP - (spent * taxBps) / BP - (spent * snipeBps) / BP;
        tokensOut = (net * tRes) / (qRes + net);
    }

    function formulaSell(uint256 tokensIn, uint256 qRes, uint256 tRes, uint256 feeBps, uint256 taxBps)
        internal
        pure
        returns (uint256 quoteOut)
    {
        uint256 gross = (tokensIn * qRes) / (tRes + tokensIn);
        quoteOut = gross - (gross * feeBps) / BP - (gross * taxBps) / BP;
    }

    function test_graduationAllocationIdentity() public view {
        uint256 s = curve.launchSupply();
        uint256 q0 = curve.phantomQuote();
        uint256 g = curve.graduationThreshold();
        uint256 reserved = (s * q0) / (q0 + g);
        require(curve.reservedTokens() == reserved, "reserved != S*Q0/(Q0+G)");
        // Terminal curve price (Q0+G)/reserved equals the pool seed price G/poolTokens
        uint256 poolTokens = (reserved * g) / (g + q0);
        // cross-multiplied equality up to rounding of poolTokens
        uint256 lhs = (q0 + g) * poolTokens; // price_curve * poolTokens * reserved / reserved
        uint256 rhs = g * reserved;
        require(lhs <= rhs && rhs - lhs < (q0 + g), "pool seed price != terminal curve price");
    }

    function test_liveBuyMatchesFormula() public {
        require(!curve.graduated(), "curve already graduated; pick another launch");
        uint256 spend = 0.01 ether;
        (uint256 qRes, uint256 tRes) = curve.getReserves();
        uint256 snipe = curve.currentSnipeTaxBps(TRADER); // 0 once the 3s window passed
        uint256 expected = formulaBuy(spend, qRes, tRes, curve.feeBps(), curve.creatorTaxBps(), snipe);
        require(expected <= curve.sellableTokens(), "test buy would clamp; shrink spend");

        vm.deal(TRADER, 1 ether);
        vm.prank(TRADER);
        uint256 got = curve.buy{value: spend}(spend, 0, TRADER);
        require(got == expected, "live buy != formula");
        require(IERC20Min(curve.token()).balanceOf(TRADER) == got, "balance != tokensOut");
    }

    function test_liveSellMatchesFormula() public {
        require(!curve.graduated(), "curve already graduated; pick another launch");
        vm.deal(TRADER, 1 ether);
        vm.startPrank(TRADER);
        uint256 bought = curve.buy{value: 0.01 ether}(0.01 ether, 0, TRADER);
        (uint256 qRes, uint256 tRes) = curve.getReserves();
        uint256 expected = formulaSell(bought, qRes, tRes, curve.feeBps(), curve.creatorTaxBps());
        IERC20Min(curve.token()).approve(address(curve), bought);
        uint256 got = curve.sell(bought, 0, TRADER);
        vm.stopPrank();
        require(got == expected, "live sell != formula");
        // Round trip loses exactly the fee legs twice (plus price impact) - sanity bound
        require(got < 0.01 ether, "sell returned more than spent");
    }
}
