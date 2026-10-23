(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,851887,e=>{var t=e.i(365801),i=e.i(742710),o=e.i(401564),r=e.i(592279),a=e.i(82283);let n=(0,t.s)({message:"",variant:"info",open:!1}),s=(0,r.O)({state:n,subscribeKey:(e,t)=>(0,i.T)(n,e,t),open(e,t){let{debug:i}=a.f.state,{code:r,displayMessage:s,debugMessage:c}=e;if(s&&i&&(n.message=s,n.variant=t,n.open=!0),c){if(!o.f.IS_DEVELOPMENT)return;let e="function"==typeof c?c():c,i=r?{code:r}:void 0;"error"===t?console.error(e,i):"warning"===t?console.warn(e,i):console.info(e,i)}},warn(e,t,i){n.open=!0,n.message=e,n.variant="warning",t&&console.warn(t,i)},close(){n.open=!1,n.message="",n.variant="info"}});e.s(["f",0,s])},465487,590404,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(56350),r=e.i(221728);e.i(404041);var a=e.i(645975),n=t,s=e.i(653157);e.i(225416),e.i(550230);var c=e.i(305840),l=e.i(162611);let d=l.m`
  :host {
    display: block;
  }

  div.container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    height: auto;
    display: block;
  }

  div.container[status='hide'] {
    animation: fade-out;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: 0s;
  }

  div.container[status='show'] {
    animation: fade-in;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      filter: blur(6px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
      filter: blur(0px);
    }
    to {
      opacity: 0;
      filter: blur(6px);
    }
  }
`;var u=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let p=class extends n.f{constructor(){super(...arguments),this.resizeObserver=void 0,this.unsubscribe=[],this.status="hide",this.view=r.f.state.view}firstUpdated(){this.status=c.f.hasFooter()?"show":"hide",this.unsubscribe.push(r.f.subscribeKey("view",e=>{this.view=e,this.status=c.f.hasFooter()?"show":"hide","hide"===this.status&&document.documentElement.style.setProperty("--apkt-footer-height","0px")})),this.resizeObserver=new ResizeObserver(e=>{for(let t of e)if(t.target===this.getWrapper()){let e=`${t.contentRect.height}px`;document.documentElement.style.setProperty("--apkt-footer-height",e)}}),this.resizeObserver.observe(this.getWrapper())}render(){return i.c`
      <div class="container" status=${this.status}>${this.templatePageContainer()}</div>
    `}templatePageContainer(){return c.f.hasFooter()?i.c` ${this.templateFooter()}`:null}templateFooter(){switch(this.view){case"Networks":return this.templateNetworksFooter();case"Connect":case"ConnectWallets":case"OnRampFiatSelect":case"OnRampTokenSelect":return i.c`<w3m-legal-footer></w3m-legal-footer>`;case"OnRampProviders":return i.c`<w3m-onramp-providers-footer></w3m-onramp-providers-footer>`;default:return null}}templateNetworksFooter(){return i.c` <wui-flex
      class="footer-in"
      padding="3"
      flexDirection="column"
      gap="3"
      alignItems="center"
    >
      <wui-text variant="md-regular" color="secondary" align="center">
        Your connected wallet may not support some of the networks available for this dApp
      </wui-text>
      <wui-link @click=${this.onNetworkHelp.bind(this)}>
        <wui-icon size="sm" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
        What is a network
      </wui-link>
    </wui-flex>`}onNetworkHelp(){s.f.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),r.f.push("WhatIsANetwork")}getWrapper(){return this.shadowRoot?.querySelector("div.container")}};p.styles=[d],u([(0,o.f)()],p.prototype,"status",void 0),u([(0,o.f)()],p.prototype,"view",void 0),p=u([(0,a.f)("w3m-footer")],p),e.s(["W3mFooter",0,p],590404);let h=l.m`
  :host {
    display: block;
    width: inherit;
  }
`;var w=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let m=class extends t.f{constructor(){super(),this.unsubscribe=[],this.viewState=r.f.state.view,this.history=r.f.state.history.join(","),this.unsubscribe.push(r.f.subscribeKey("view",()=>{this.history=r.f.state.history.join(","),document.documentElement.style.setProperty("--apkt-duration-dynamic","var(--apkt-durations-lg)")}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),document.documentElement.style.setProperty("--apkt-duration-dynamic","0s")}render(){return i.c`${this.templatePageContainer()}`}templatePageContainer(){return i.c`<w3m-router-container
      history=${this.history}
      .setView=${()=>{this.viewState=r.f.state.view}}
    >
      ${this.viewTemplate(this.viewState)}
    </w3m-router-container>`}viewTemplate(e){switch(e){case"AccountSettings":return i.c`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return i.c`<w3m-account-view></w3m-account-view>`;case"AllWallets":return i.c`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return i.c`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return i.c`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return i.c`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return i.c`<w3m-connect-view></w3m-connect-view>`;case"Create":return i.c`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return i.c`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return i.c`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return i.c`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return i.c`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return i.c`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return i.c`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return i.c`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return i.c`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return i.c`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return i.c`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return i.c`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return i.c`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return i.c`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return i.c`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return i.c`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return i.c`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return i.c`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return i.c`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return i.c`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return i.c`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return i.c`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return i.c`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return i.c`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return i.c`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return i.c`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return i.c`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return i.c`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return i.c`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return i.c`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return i.c`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return i.c`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return i.c`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WalletSendConfirmed":return i.c`<w3m-send-confirmed-view></w3m-send-confirmed-view>`;case"WhatIsABuy":return i.c`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return i.c`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return i.c`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return i.c`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return i.c`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return i.c`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return i.c`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return i.c`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return i.c`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return i.c`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return i.c`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return i.c`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return i.c`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return i.c`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return i.c`<w3m-pay-loading-view></w3m-pay-loading-view>`;case"PayQuote":return i.c`<w3m-pay-quote-view></w3m-pay-quote-view>`;case"FundWallet":return i.c`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case"PayWithExchange":return i.c`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`;case"PayWithExchangeSelectAsset":return i.c`<w3m-deposit-from-exchange-select-asset-view></w3m-deposit-from-exchange-select-asset-view>`;case"UsageExceeded":return i.c`<w3m-usage-exceeded-view></w3m-usage-exceeded-view>`;case"SmartAccountSettings":return i.c`<w3m-smart-account-settings-view></w3m-smart-account-settings-view>`}}};m.styles=[h],w([(0,o.f)()],m.prototype,"viewState",void 0),w([(0,o.f)()],m.prototype,"history",void 0),m=w([(0,a.f)("w3m-router")],m),e.s(["W3mRouter",0,m],465487)},225416,803596,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(56350),r=e.i(82283);e.i(404041);var a=e.i(645975);e.i(62238),e.i(249536);var n=t;e.i(852634),e.i(839009),e.i(73944);var s=e.i(459088),c=e.i(162611);let l=c.m`
  .reown-logo {
    height: 24px;
  }

  a {
    text-decoration: none;
    cursor: pointer;
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  a:hover {
    opacity: 0.9;
  }
`,d=class extends n.f{render(){return i.c`
      <a
        data-testid="ux-branding-reown"
        href=${"https://reown.com"}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="1"
          .padding=${["01","0","3","0"]}
        >
          <wui-text variant="sm-regular" color="inherit"> UX by </wui-text>
          <wui-icon name="reown" size="inherit" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};d.styles=[s.e,s.j,l],d=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n}([(0,a.f)("wui-ux-by-reown")],d),e.s([],803596);let u=c.m`
  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: ${({spacing:e})=>e["3"]};
  }

  a {
    text-decoration: none;
    color: ${({tokens:e})=>e.core.textAccentPrimary};
    font-weight: 500;
  }
`;var p=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let h=class extends t.f{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=r.f.state.remoteFeatures,this.unsubscribe.push(r.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=r.f.state,o=r.f.state.features?.legalCheckbox;return(e||t)&&!o?i.c`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["4","3","3","3"]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `:i.c`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=r.f.state;return e&&t?"and":""}termsTemplate(){let{termsConditionsUrl:e}=r.f.state;return e?i.c`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){let{privacyPolicyUrl:e}=r.f.state;return e?i.c`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?i.c`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:i.c`<wui-ux-by-reown></wui-ux-by-reown>`:null}};h.styles=[u],p([(0,o.f)()],h.prototype,"remoteFeatures",void 0),h=p([(0,a.f)("w3m-legal-footer")],h),e.s([],225416)},550230,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479),o=e.i(960398),r=e.i(653157),a=e.i(82283),n=e.i(221728),s=e.i(564126);e.i(404041);var c=e.i(645975);e.i(62238),e.i(443452),e.i(210380),e.i(249536);var l=e.i(979484),d=e.i(315193);let u=d.m``,p=class extends t.f{render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=a.f.state;return e||t?i.c`
      <wui-flex
        .padding=${["4","3","3","3"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <wui-text color="secondary" variant="md-regular" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `:null}howDoesItWorkTemplate(){return i.c` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){r.f.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:(0,s.P)(o.f.state.activeChain)===l.P.ACCOUNT_TYPES.SMART_ACCOUNT}}),n.f.push("WhatIsABuy")}};p.styles=[u],p=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n}([(0,c.f)("w3m-onramp-providers-footer")],p),e.s([],550230)},741611,748449,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119),r=e.i(56350),a=e.i(803468),n=e.i(221728),s=e.i(365801),c=e.i(742710),l=e.i(592279);let d=(0,s.s)({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),u=(0,l.O)({state:d,subscribe:e=>(0,s.i)(d,()=>e(d)),subscribeKey:(e,t)=>(0,c.T)(d,e,t),showTooltip({message:e,triggerRect:t,variant:i}){d.open=!0,d.message=e,d.triggerRect=t,d.variant=i},hide(){d.open=!1,d.message="",d.triggerRect={width:0,height:0,top:0,left:0}}});e.i(404041);var p=e.i(645975),h=e.i(315193);let w=h.m`
  :host {
    width: 100%;
    display: block;
  }
`;var m=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let g=class extends t.f{constructor(){super(),this.unsubscribe=[],this.text="",this.open=u.state.open,this.unsubscribe.push(n.f.subscribeKey("view",()=>{u.hide()}),a.f.subscribeKey("open",e=>{e||u.hide()}),u.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),u.hide()}render(){return i.c`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return i.c`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();if(!this.open){let t=document.querySelector("w3m-modal"),i={width:e.width,height:e.height,left:e.left,top:e.top};if(t){let o=t.getBoundingClientRect();i.left=e.left-(window.innerWidth-o.width)/2,i.top=e.top-(window.innerHeight-o.height)/2}u.showTooltip({message:this.text,triggerRect:i,variant:"shade"})}}onMouseLeave(e){this.contains(e.relatedTarget)||u.hide()}};g.styles=[w],m([(0,o.f)()],g.prototype,"text",void 0),m([(0,r.f)()],g.prototype,"open",void 0),g=m([(0,p.f)("w3m-tooltip-trigger")],g),e.s([],741611);var f=t;e.i(62238),e.i(443452),e.i(249536);var v=e.i(162611);let b=v.m`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px ${({spacing:e})=>e["3"]} 10px ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: absolute;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--apkt-modal-width) - ${({spacing:e})=>e["5"]});
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var y=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let x=class extends f.f{constructor(){super(),this.unsubscribe=[],this.open=u.state.open,this.message=u.state.message,this.triggerRect=u.state.triggerRect,this.variant=u.state.variant,this.unsubscribe.push(u.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;let e=this.triggerRect.top,t=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${e}px;
    --w3m-tooltip-left: ${t}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${+!!this.open};
    `,i.c`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};x.styles=[b],y([(0,r.f)()],x.prototype,"open",void 0),y([(0,r.f)()],x.prototype,"message",void 0),y([(0,r.f)()],x.prototype,"triggerRect",void 0),y([(0,r.f)()],x.prototype,"variant",void 0),x=y([(0,p.f)("w3m-tooltip")],x),e.s([],748449)},534420,624947,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(852634),e.i(383227),e.i(839009);var r=e.i(459088),a=e.i(645975),n=e.i(162611);let s=n.m`
  :host {
    width: var(--local-width);
  }

  button {
    width: var(--local-width);
    white-space: nowrap;
    column-gap: ${({spacing:e})=>e[2]};
    transition:
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: scale, background-color, border-radius;
    cursor: pointer;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[2]};
    padding: 0 ${({spacing:e})=>e[2]};
    height: 28px;
  }

  button[data-size='md'] {
    border-radius: ${({borderRadius:e})=>e[3]};
    padding: 0 ${({spacing:e})=>e[4]};
    height: 38px;
  }

  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: 0 ${({spacing:e})=>e[5]};
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent-primary'] {
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='accent-secondary'] {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button[data-variant='neutral-primary'] {
    background-color: ${({tokens:e})=>e.theme.backgroundInvert};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='neutral-secondary'] {
    background-color: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-variant='neutral-tertiary'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-variant='error-primary'] {
    background-color: ${({tokens:e})=>e.core.textError};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='error-secondary'] {
    background-color: ${({tokens:e})=>e.core.backgroundError};
    color: ${({tokens:e})=>e.core.textError};
  }

  button[data-variant='shade'] {
    background: var(--wui-color-gray-glass-002);
    color: var(--wui-color-fg-200);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-size='sm']:focus-visible:enabled {
    border-radius: 28px;
  }

  button[data-size='md']:focus-visible:enabled {
    border-radius: 38px;
  }

  button[data-size='lg']:focus-visible:enabled {
    border-radius: 48px;
  }
  button[data-variant='shade']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button[data-size='sm']:hover:enabled {
      border-radius: 28px;
    }

    button[data-size='md']:hover:enabled {
      border-radius: 38px;
    }

    button[data-size='lg']:hover:enabled {
      border-radius: 48px;
    }

    button[data-variant='shade']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='shade']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }
  }

  button[data-size='sm']:active:enabled {
    border-radius: 28px;
  }

  button[data-size='md']:active:enabled {
    border-radius: 38px;
  }

  button[data-size='lg']:active:enabled {
    border-radius: 48px;
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    opacity: 0.3;
  }
`;var c=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let l={lg:"lg-regular-mono",md:"md-regular-mono",sm:"sm-regular-mono"},d={lg:"md",md:"md",sm:"sm"},u=class extends t.f{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="accent-primary"}render(){this.style.cssText=`
    --local-width: ${this.fullWidth?"100%":"auto"};
     `;let e=this.textVariant??l[this.size];return i.c`
      <button data-variant=${this.variant} data-size=${this.size} ?disabled=${this.disabled}>
        ${this.loadingTemplate()}
        <slot name="iconLeft"></slot>
        <wui-text variant=${e} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}loadingTemplate(){if(this.loading){let e=d[this.size],t="neutral-primary"===this.variant||"accent-primary"===this.variant?"invert":"primary";return i.c`<wui-loading-spinner color=${t} size=${e}></wui-loading-spinner>`}return null}};u.styles=[r.e,r.j,s],c([(0,o.f)()],u.prototype,"size",void 0),c([(0,o.f)({type:Boolean})],u.prototype,"disabled",void 0),c([(0,o.f)({type:Boolean})],u.prototype,"fullWidth",void 0),c([(0,o.f)({type:Boolean})],u.prototype,"loading",void 0),c([(0,o.f)()],u.prototype,"variant",void 0),c([(0,o.f)()],u.prototype,"textVariant",void 0),u=c([(0,a.f)("wui-button")],u),e.s([],624947),e.s([],534420)},907170,695553,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(852634);var r=e.i(459088),a=e.i(645975),n=e.i(162611);let s=n.m`
  button {
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-variant='accent']:hover:enabled,
  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='primary']:hover:enabled,
  button[data-variant='primary']:focus-visible,
  button[data-variant='secondary']:hover:enabled,
  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button[data-size='xs'] > wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='xs'],
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'],
  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='md'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`;var c=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let l=class extends t.f{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="default",this.variant="accent"}render(){return i.c`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${({accent:"accent-primary",primary:"inverse",secondary:"default"})[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};l.styles=[r.e,r.j,s],c([(0,o.f)()],l.prototype,"size",void 0),c([(0,o.f)({type:Boolean})],l.prototype,"disabled",void 0),c([(0,o.f)()],l.prototype,"icon",void 0),c([(0,o.f)()],l.prototype,"iconColor",void 0),c([(0,o.f)()],l.prototype,"variant",void 0),l=c([(0,a.f)("wui-icon-link")],l),e.s([],695553),e.s([],907170)},443452,e=>{e.i(852634),e.s([])},143053,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(234051);var r=e.i(829389);e.i(383227),e.i(839009);var a=e.i(459088),n=e.i(645975),s=e.i(162611);let c=s.m`
  :host {
    width: 100%;
  }

  :host([data-type='primary']) > button {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  :host([data-type='secondary']) > button {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, scale;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-image {
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  @media (hover: hover) {
    :host([data-type='primary']) > button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }

    :host([data-type='secondary']) > button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var l=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let d=class extends t.f{constructor(){super(...arguments),this.type="primary",this.imageSrc="google",this.imageSize=void 0,this.loading=!1,this.boxColor="foregroundPrimary",this.disabled=!1,this.rightIcon=!0,this.boxed=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",this.dataset.type=this.type,i.c`
      <button
        ?disabled=${!!this.loading||!!this.disabled}
        data-loading=${this.loading}
        tabindex=${(0,r.f)(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?i.c`<wui-image
        icon=${this.icon}
        iconColor=${(0,r.f)(this.iconColor)}
        ?boxed=${this.boxed}
        ?rounded=${this.rounded}
        boxColor=${this.boxColor}
      ></wui-image>`:i.c`<wui-image
      ?boxed=${this.boxed}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      size=${(0,r.f)(this.imageSize)}
      src=${this.imageSrc}
      boxColor=${this.boxColor}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?i.c`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:i.c`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};d.styles=[a.e,a.j,c],l([(0,o.f)()],d.prototype,"type",void 0),l([(0,o.f)()],d.prototype,"imageSrc",void 0),l([(0,o.f)()],d.prototype,"imageSize",void 0),l([(0,o.f)()],d.prototype,"icon",void 0),l([(0,o.f)()],d.prototype,"iconColor",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"loading",void 0),l([(0,o.f)()],d.prototype,"tabIdx",void 0),l([(0,o.f)()],d.prototype,"boxColor",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"disabled",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"rightIcon",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"boxed",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"rounded",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"fullSize",void 0),d=l([(0,n.f)("wui-list-item")],d),e.s([],143053)},987789,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(234051);var r=e.i(829389);e.i(852634),e.i(839009),e.i(912190);var a=e.i(459088),n=e.i(645975),s=t;e.i(720226);var c=e.i(162611);let l=c.m`
  :host {
    position: relative;
    border-radius: ${({borderRadius:e})=>e[2]};
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    column-gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[1]};
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: 2px;
  }
`;var d=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let u=class extends s.f{constructor(){super(...arguments),this.walletImages=[]}render(){let e=this.walletImages.length<4;return i.c`${this.walletImages.slice(0,4).map(({src:e,walletName:t})=>i.c`
          <wui-wallet-image
            size="sm"
            imageSrc=${e}
            name=${(0,r.f)(t)}
          ></wui-wallet-image>
        `)}
    ${e?[...Array(4-this.walletImages.length)].map(()=>i.c` <wui-wallet-image size="sm" name=""></wui-wallet-image>`):null} `}};u.styles=[a.e,l],d([(0,o.f)({type:Array})],u.prototype,"walletImages",void 0),u=d([(0,n.f)("wui-all-wallets-image")],u),e.i(630352);let p=c.m`
  :host {
    width: 100%;
  }

  button {
    column-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button > wui-wallet-image {
    background: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:hover:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button[data-all-wallets='true'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button[data-all-wallets='true']:hover:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button:disabled {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:disabled > wui-tag {
    background-color: ${({tokens:e})=>e.core.glass010};
    color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  wui-flex.namespace-icon {
    width: 16px;
    height: 16px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.backgroundPrimary};
    transition: box-shadow var(--apkt-durations-lg) var(--apkt-easings-ease-out-power-2);
  }

  button:hover:enabled wui-flex.namespace-icon {
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-flex.namespace-icon > wui-icon {
    width: 10px;
    height: 10px;
  }

  wui-flex.namespace-icon:not(:first-child) {
    margin-left: -4px;
  }
`;var h=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let w={eip155:"ethereum",solana:"solana",bip122:"bitcoin",polkadot:void 0,cosmos:void 0,sui:void 0,stacks:void 0,ton:"ton",tron:"tron",stellar:void 0},m=class extends t.f{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.size="md",this.tabIdx=void 0,this.namespaces=[],this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return this.dataset.size=this.size,i.c`
      <button
        ?disabled=${this.disabled}
        data-all-wallets=${this.showAllWallets}
        tabindex=${(0,r.f)(this.tabIdx)}
      >
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-flex flexDirection="column" justifyContent="center" alignItems="flex-start" gap="1">
          <wui-text variant="lg-regular" color="inherit">${this.name}</wui-text>
          ${this.templateNamespaces()}
        </wui-flex>
        ${this.templateStatus()}
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}templateNamespaces(){return this.namespaces?.length?i.c`<wui-flex alignItems="center" gap="0">
        ${this.namespaces.map((e,t)=>i.c`<wui-flex
              alignItems="center"
              justifyContent="center"
              zIndex=${(this.namespaces?.length??0)*2-t}
              class="namespace-icon"
            >
              <wui-icon
                name=${(0,r.f)(w[e])}
                size="sm"
                color="default"
              ></wui-icon>
            </wui-flex>`)}
      </wui-flex>`:null}templateAllWallets(){return this.showAllWallets&&this.imageSrc?i.c` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?i.c` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?i.c`<wui-wallet-image
        size=${(0,r.f)("sm"===this.size?"sm":"md")}
        imageSrc=${this.imageSrc}
        name=${this.name}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:i.c`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.loading?i.c`<wui-loading-spinner size="lg" color="accent-primary"></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?i.c`<wui-tag size="sm" variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:null}};m.styles=[a.e,a.j,p],h([(0,o.f)({type:Array})],m.prototype,"walletImages",void 0),h([(0,o.f)()],m.prototype,"imageSrc",void 0),h([(0,o.f)()],m.prototype,"name",void 0),h([(0,o.f)()],m.prototype,"size",void 0),h([(0,o.f)()],m.prototype,"tagLabel",void 0),h([(0,o.f)()],m.prototype,"tagVariant",void 0),h([(0,o.f)()],m.prototype,"walletIcon",void 0),h([(0,o.f)()],m.prototype,"tabIdx",void 0),h([(0,o.f)({type:Array})],m.prototype,"namespaces",void 0),h([(0,o.f)({type:Boolean})],m.prototype,"disabled",void 0),h([(0,o.f)({type:Boolean})],m.prototype,"showAllWallets",void 0),h([(0,o.f)({type:Boolean})],m.prototype,"loading",void 0),h([(0,o.f)({type:String})],m.prototype,"loadingSpinnerColor",void 0),m=h([(0,n.f)("wui-list-wallet")],m),e.s([],987789)},774339,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119),r=e.i(116275),a=e.i(252157);let n=i.V`
  <svg fill="none" viewBox="0 0 36 40">
    <path
      d="M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z"
    />
  </svg>
`;e.i(852634),e.i(864380);var s=e.i(459088),c=e.i(645975),l=e.i(162611);let d=l.m`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-round='true']) {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 100%;
    outline: 1px solid ${({tokens:e})=>e.core.glass010};
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  svg > path {
    stroke: var(--local-stroke);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`;var u=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let p=class extends t.f{constructor(){super(...arguments),this.size="md",this.name="uknown",this.networkImagesBySize={sm:n,md:a.f,lg:r.f},this.selected=!1,this.round=!1}render(){return this.round?(this.dataset.round="true",this.style.cssText=`
      --local-width: var(--apkt-spacing-10);
      --local-height: var(--apkt-spacing-10);
      --local-icon-size: var(--apkt-spacing-4);
    `):this.style.cssText=`

      --local-path: var(--apkt-path-network-${this.size});
      --local-width:  var(--apkt-width-network-${this.size});
      --local-height:  var(--apkt-height-network-${this.size});
      --local-icon-size:  var(--apkt-spacing-${({sm:"4",md:"6",lg:"10"})[this.size]});
    `,i.c`${this.templateVisual()} ${this.svgTemplate()} `}svgTemplate(){return this.round?null:this.networkImagesBySize[this.size]}templateVisual(){return this.imageSrc?i.c`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:i.c`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};p.styles=[s.e,d],u([(0,o.f)()],p.prototype,"size",void 0),u([(0,o.f)()],p.prototype,"name",void 0),u([(0,o.f)({type:Object})],p.prototype,"networkImagesBySize",void 0),u([(0,o.f)()],p.prototype,"imageSrc",void 0),u([(0,o.f)({type:Boolean})],p.prototype,"selected",void 0),u([(0,o.f)({type:Boolean})],p.prototype,"round",void 0),p=u([(0,c.f)("wui-network-image")],p),e.s([],774339)},79929,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(839009);var r=e.i(459088),a=e.i(645975),n=e.i(162611);let s=n.m`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: ${({tokens:e})=>e.theme.borderPrimary};
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 8px;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  :host([data-bg-color='primary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  :host([data-bg-color='secondary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var c=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let l=class extends t.f{constructor(){super(...arguments),this.text="",this.bgColor="primary"}render(){return this.dataset.bgColor=this.bgColor,i.c`${this.template()}`}template(){return this.text?i.c`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};l.styles=[r.e,s],c([(0,o.f)()],l.prototype,"text",void 0),c([(0,o.f)()],l.prototype,"bgColor",void 0),l=c([(0,a.f)("wui-separator")],l),e.s([],79929)},780313,e=>{e.i(864576),e.s([])},988016,e=>{e.i(630352),e.s([])},956303,e=>{e.i(720226),e.s([])},604415,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(234051);var r=e.i(829389);e.i(852634),e.i(864380),e.i(839009),e.i(73944);var a=e.i(459088),n=e.i(112699),s=e.i(645975),c=e.i(162611);let l=c.m`
  button {
    display: flex;
    align-items: center;
    height: 40px;
    padding: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[4]};
    column-gap: ${({spacing:e})=>e[1]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  wui-image,
  .icon-box {
    width: ${({spacing:e})=>e[6]};
    height: ${({spacing:e})=>e[6]};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    flex: 1;
  }

  .icon-box {
    position: relative;
  }

  .icon-box[data-active='true'] {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .circle {
    position: absolute;
    left: 16px;
    top: 15px;
    width: 8px;
    height: 8px;
    background-color: ${({tokens:e})=>e.core.textSuccess};
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 50%;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var d=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let u=class extends t.f{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.enableGreenCircle=!0,this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return i.c`
      <button>
        ${this.leftImageTemplate()} ${this.textTemplate()} ${this.rightImageTemplate()}
      </button>
    `}leftImageTemplate(){let e=this.icon?i.c`<wui-icon
          size=${(0,r.f)(this.iconSize)}
          color="default"
          name=${this.icon}
          class="icon"
        ></wui-icon>`:i.c`<wui-image src=${this.imageSrc} alt=${this.alt}></wui-image>`;return i.c`
      <wui-flex
        alignItems="center"
        justifyContent="center"
        class="icon-box"
        data-active=${!!this.icon}
      >
        ${e}
        ${this.enableGreenCircle?i.c`<wui-flex class="circle"></wui-flex>`:null}
      </wui-flex>
    `}textTemplate(){return i.c`
      <wui-text variant="lg-regular" color="primary">
        ${n.f.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
      </wui-text>
    `}rightImageTemplate(){return i.c`<wui-icon name="chevronBottom" size="sm" color="default"></wui-icon>`}};u.styles=[a.e,a.j,l],d([(0,o.f)()],u.prototype,"address",void 0),d([(0,o.f)()],u.prototype,"profileName",void 0),d([(0,o.f)()],u.prototype,"alt",void 0),d([(0,o.f)()],u.prototype,"imageSrc",void 0),d([(0,o.f)()],u.prototype,"icon",void 0),d([(0,o.f)()],u.prototype,"iconSize",void 0),d([(0,o.f)({type:Boolean})],u.prototype,"enableGreenCircle",void 0),d([(0,o.f)({type:Boolean})],u.prototype,"loading",void 0),d([(0,o.f)({type:Number})],u.prototype,"charsStart",void 0),d([(0,o.f)({type:Number})],u.prototype,"charsEnd",void 0),u=d([(0,s.f)("wui-wallet-switch")],u),e.s([],604415)},116275,e=>{e.i(812207);var t=e.i(654479);let i=t.V`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`;e.s(["f",0,i])},252157,e=>{e.i(812207);var t=e.i(654479);let i=t.V`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`;e.s(["f",0,i])},864380,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(234051);var r=e.i(829389),a=e.i(459088),n=e.i(645975),s=e.i(162611);let c=s.m`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
    user-select: none;
    user-drag: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }

  :host([data-boxed='true']) {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-boxed='true']) img {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  :host([data-full='true']) img {
    width: 100%;
    height: 100%;
  }

  :host([data-boxed='true']) wui-icon {
    width: 20px;
    height: 20px;
  }

  :host([data-icon='error']) {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }
`;var l=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let d=class extends t.f{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0,this.boxed=!1,this.rounded=!1,this.fullSize=!1}render(){let e={inherit:"inherit",xxs:"2",xs:"3",sm:"4",md:"4",mdl:"5",lg:"5",xl:"6",xxl:"7","3xl":"8","4xl":"9","5xl":"10"};return(this.style.cssText=`
      --local-width: ${this.size?`var(--apkt-spacing-${e[this.size]});`:"100%"};
      --local-height: ${this.size?`var(--apkt-spacing-${e[this.size]});`:"100%"};
      `,this.dataset.boxed=this.boxed?"true":"false",this.dataset.rounded=this.rounded?"true":"false",this.dataset.full=this.fullSize?"true":"false",this.dataset.icon=this.iconColor||"inherit",this.icon)?i.c`<wui-icon
        color=${this.iconColor||"inherit"}
        name=${this.icon}
        size="lg"
      ></wui-icon> `:this.logo?i.c`<wui-icon size="lg" color="inherit" name=${this.logo}></wui-icon> `:i.c`<img src=${(0,r.f)(this.src)} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};d.styles=[a.e,c],l([(0,o.f)()],d.prototype,"src",void 0),l([(0,o.f)()],d.prototype,"logo",void 0),l([(0,o.f)()],d.prototype,"icon",void 0),l([(0,o.f)()],d.prototype,"iconColor",void 0),l([(0,o.f)()],d.prototype,"alt",void 0),l([(0,o.f)()],d.prototype,"size",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"boxed",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"rounded",void 0),l([(0,o.f)({type:Boolean})],d.prototype,"fullSize",void 0),d=l([(0,n.f)("wui-image")],d),e.s([],864380)},383227,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119),r=e.i(162611),a=e.i(459088),n=e.i(645975),s=e.i(315193);let c=s.m`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 1.4s linear infinite;
    color: var(--local-color);
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;var l=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let d=class extends t.f{constructor(){super(...arguments),this.color="primary",this.size="lg"}render(){let e={primary:r.i.tokens.theme.textPrimary,secondary:r.i.tokens.theme.textSecondary,tertiary:r.i.tokens.theme.textTertiary,invert:r.i.tokens.theme.textInvert,error:r.i.tokens.core.textError,warning:r.i.tokens.core.textWarning,"accent-primary":r.i.tokens.core.textAccentPrimary};return this.style.cssText=`
      --local-color: ${"inherit"===this.color?"inherit":e[this.color]};
      `,this.dataset.size=this.size,i.c`<svg viewBox="0 0 16 17" fill="none">
      <path
        d="M8.75 2.65625V4.65625C8.75 4.85516 8.67098 5.04593 8.53033 5.18658C8.38968 5.32723 8.19891 5.40625 8 5.40625C7.80109 5.40625 7.61032 5.32723 7.46967 5.18658C7.32902 5.04593 7.25 4.85516 7.25 4.65625V2.65625C7.25 2.45734 7.32902 2.26657 7.46967 2.12592C7.61032 1.98527 7.80109 1.90625 8 1.90625C8.19891 1.90625 8.38968 1.98527 8.53033 2.12592C8.67098 2.26657 8.75 2.45734 8.75 2.65625ZM14 7.90625H12C11.8011 7.90625 11.6103 7.98527 11.4697 8.12592C11.329 8.26657 11.25 8.45734 11.25 8.65625C11.25 8.85516 11.329 9.04593 11.4697 9.18658C11.6103 9.32723 11.8011 9.40625 12 9.40625H14C14.1989 9.40625 14.3897 9.32723 14.5303 9.18658C14.671 9.04593 14.75 8.85516 14.75 8.65625C14.75 8.45734 14.671 8.26657 14.5303 8.12592C14.3897 7.98527 14.1989 7.90625 14 7.90625ZM11.3588 10.9544C11.289 10.8846 11.2062 10.8293 11.115 10.7915C11.0239 10.7538 10.9262 10.7343 10.8275 10.7343C10.7288 10.7343 10.6311 10.7538 10.54 10.7915C10.4488 10.8293 10.366 10.8846 10.2963 10.9544C10.2265 11.0241 10.1711 11.107 10.1334 11.1981C10.0956 11.2893 10.0762 11.387 10.0762 11.4856C10.0762 11.5843 10.0956 11.682 10.1334 11.7731C10.1711 11.8643 10.2265 11.9471 10.2963 12.0169L11.7106 13.4312C11.8515 13.5721 12.0426 13.6513 12.2419 13.6513C12.4411 13.6513 12.6322 13.5721 12.7731 13.4312C12.914 13.2904 12.9932 13.0993 12.9932 12.9C12.9932 12.7007 12.914 12.5096 12.7731 12.3687L11.3588 10.9544ZM8 11.9062C7.80109 11.9062 7.61032 11.9853 7.46967 12.1259C7.32902 12.2666 7.25 12.4573 7.25 12.6562V14.6562C7.25 14.8552 7.32902 15.0459 7.46967 15.1866C7.61032 15.3272 7.80109 15.4062 8 15.4062C8.19891 15.4062 8.38968 15.3272 8.53033 15.1866C8.67098 15.0459 8.75 14.8552 8.75 14.6562V12.6562C8.75 12.4573 8.67098 12.2666 8.53033 12.1259C8.38968 11.9853 8.19891 11.9062 8 11.9062ZM4.64125 10.9544L3.22688 12.3687C3.08598 12.5096 3.00682 12.7007 3.00682 12.9C3.00682 13.0993 3.08598 13.2904 3.22688 13.4312C3.36777 13.5721 3.55887 13.6513 3.75813 13.6513C3.95738 13.6513 4.14848 13.5721 4.28937 13.4312L5.70375 12.0169C5.84465 11.876 5.9238 11.6849 5.9238 11.4856C5.9238 11.2864 5.84465 11.0953 5.70375 10.9544C5.56285 10.8135 5.37176 10.7343 5.1725 10.7343C4.97324 10.7343 4.78215 10.8135 4.64125 10.9544ZM4.75 8.65625C4.75 8.45734 4.67098 8.26657 4.53033 8.12592C4.38968 7.98527 4.19891 7.90625 4 7.90625H2C1.80109 7.90625 1.61032 7.98527 1.46967 8.12592C1.32902 8.26657 1.25 8.45734 1.25 8.65625C1.25 8.85516 1.32902 9.04593 1.46967 9.18658C1.61032 9.32723 1.80109 9.40625 2 9.40625H4C4.19891 9.40625 4.38968 9.32723 4.53033 9.18658C4.67098 9.04593 4.75 8.85516 4.75 8.65625ZM4.2875 3.88313C4.1466 3.74223 3.95551 3.66307 3.75625 3.66307C3.55699 3.66307 3.3659 3.74223 3.225 3.88313C3.0841 4.02402 3.00495 4.21512 3.00495 4.41438C3.00495 4.61363 3.0841 4.80473 3.225 4.94562L4.64125 6.35813C4.78215 6.49902 4.97324 6.57818 5.1725 6.57818C5.37176 6.57818 5.56285 6.49902 5.70375 6.35813C5.84465 6.21723 5.9238 6.02613 5.9238 5.82688C5.9238 5.62762 5.84465 5.43652 5.70375 5.29563L4.2875 3.88313Z"
        fill="currentColor"
      />
    </svg>`}};d.styles=[a.e,c],l([(0,o.f)()],d.prototype,"color",void 0),l([(0,o.f)()],d.prototype,"size",void 0),d=l([(0,n.f)("wui-loading-spinner")],d),e.s([],383227)},864576,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119),r=e.i(645975),a=e.i(162611);let n=a.m`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundPrimary} 0%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 50%,
      ${({tokens:e})=>e.theme.foregroundPrimary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;var s=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let c=class extends t.f{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",i.c`<slot></slot>`}};c.styles=[n],s([(0,o.f)()],c.prototype,"width",void 0),s([(0,o.f)()],c.prototype,"height",void 0),s([(0,o.f)()],c.prototype,"variant",void 0),s([(0,o.f)({type:Boolean})],c.prototype,"rounded",void 0),c=s([(0,r.f)("wui-shimmer")],c),e.s([],864576)},912190,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(234051);var r=e.i(829389);e.i(852634);var a=e.i(459088),n=e.i(645975),s=e.i(162611);let c=s.m`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({borderRadius:e})=>e[2]};
    padding: ${({spacing:e})=>e[1]} !important;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: relative;
  }

  :host([data-padding='2']) {
    padding: ${({spacing:e})=>e[2]} !important;
  }

  :host:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host > wui-icon {
    z-index: 10;
  }

  /* -- Colors --------------------------------------------------- */
  :host([data-color='accent-primary']) {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  :host([data-color='accent-primary']):after {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  :host([data-color='default']),
  :host([data-color='secondary']) {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  :host([data-color='default']):after {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-color='secondary']):after {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-color='success']) {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  :host([data-color='success']):after {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  :host([data-color='error']) {
    color: ${({tokens:e})=>e.core.iconError};
  }

  :host([data-color='error']):after {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  :host([data-color='warning']) {
    color: ${({tokens:e})=>e.core.iconWarning};
  }

  :host([data-color='warning']):after {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  :host([data-color='inverse']) {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  :host([data-color='inverse']):after {
    background-color: transparent;
  }
`;var l=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let d=class extends t.f{constructor(){super(...arguments),this.icon="copy",this.size="md",this.padding="1",this.color="default"}render(){return this.dataset.padding=this.padding,this.dataset.color=this.color,i.c`
      <wui-icon size=${(0,r.f)(this.size)} name=${this.icon} color="inherit"></wui-icon>
    `}};d.styles=[a.e,a.j,c],l([(0,o.f)()],d.prototype,"icon",void 0),l([(0,o.f)()],d.prototype,"size",void 0),l([(0,o.f)()],d.prototype,"padding",void 0),l([(0,o.f)()],d.prototype,"color",void 0),d=l([(0,n.f)("wui-icon-box")],d),e.s([],912190)},720226,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119);e.i(852634),e.i(864380);var r=e.i(459088),a=e.i(645975);e.i(912190);var n=e.i(162611);let s=n.m`
  :host {
    position: relative;
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host([data-image='true']) {
    background-color: transparent;
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host([data-size='sm']) {
    width: 32px;
    height: 32px;
  }

  :host([data-size='md']) {
    width: 40px;
    height: 40px;
  }

  :host([data-size='lg']) {
    width: 56px;
    height: 56px;
  }

  :host([name='Extension'])::after {
    border: 1px solid ${({colors:e})=>e.accent010};
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid ${({colors:e})=>e.accent010};
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  wui-icon[data-parent-size='sm'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='md'] {
    width: 32px;
    height: 32px;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: 1px;
  }
`;var c=function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let l=class extends t.f{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let e="1";return"lg"===this.size?e="4":"md"===this.size?e="2":"sm"===this.size&&(e="1"),this.style.cssText=`
       --local-border-radius: var(--apkt-borderRadius-${e});
   `,this.dataset.size=this.size,this.imageSrc&&(this.dataset.image="true"),this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),i.c`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?i.c`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?i.c`<wui-icon size="md" color="default" name=${this.walletIcon}></wui-icon>`:i.c`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="wallet"
    ></wui-icon>`}};l.styles=[r.e,s],c([(0,o.f)()],l.prototype,"size",void 0),c([(0,o.f)()],l.prototype,"name",void 0),c([(0,o.f)()],l.prototype,"imageSrc",void 0),c([(0,o.f)()],l.prototype,"walletIcon",void 0),c([(0,o.f)({type:Boolean})],l.prototype,"installed",void 0),c([(0,o.f)()],l.prototype,"badgeSize",void 0),l=c([(0,a.f)("wui-wallet-image")],l),e.s([],720226)},608601,e=>{e.s(["f",0,{interpolate(e,t,i){if(2!==e.length||2!==t.length)throw Error("inputRange and outputRange must be an array of length 2");let o=e[0]||0,r=e[1]||0,a=t[0]||0,n=t[1]||0;return i<o?a:i>r?n:(n-a)/(r-o)*(i-o)+a}}])},16555,e=>{let t={METMASK_CONNECTOR_NAME:"MetaMask",TRUST_CONNECTOR_NAME:"Trust Wallet",SOLFLARE_CONNECTOR_NAME:"Solflare",PHANTOM_CONNECTOR_NAME:"Phantom",COIN98_CONNECTOR_NAME:"Coin98",MAGIC_EDEN_CONNECTOR_NAME:"Magic Eden",BACKPACK_CONNECTOR_NAME:"Backpack",BITGET_CONNECTOR_NAME:"Bitget Wallet",FRONTIER_CONNECTOR_NAME:"Frontier",XVERSE_CONNECTOR_NAME:"Xverse Wallet",LEATHER_CONNECTOR_NAME:"Leather",OKX_CONNECTOR_NAME:"OKX Wallet",BINANCE_CONNECTOR_NAME:"Binance Wallet",EIP155:e.i(401564).f.CHAIN.EVM,ADD_CHAIN_METHOD:"wallet_addEthereumChain",EIP6963_ANNOUNCE_EVENT:"eip6963:announceProvider",EIP6963_REQUEST_EVENT:"eip6963:requestProvider",CONNECTOR_RDNS_MAP:{coinbaseWallet:"com.coinbase.wallet",coinbaseWalletSDK:"com.coinbase.wallet"},CONNECTOR_TYPE_EXTERNAL:"EXTERNAL",CONNECTOR_TYPE_WALLET_CONNECT:"WALLET_CONNECT",CONNECTOR_TYPE_INJECTED:"INJECTED",CONNECTOR_TYPE_ANNOUNCED:"ANNOUNCED",CONNECTOR_TYPE_AUTH:"AUTH",CONNECTOR_TYPE_MULTI_CHAIN:"MULTI_CHAIN",CONNECTOR_TYPE_W3M_AUTH:"AUTH",getSDKVersionWarningMessage:(e,t)=>`
     @@@@@@@           @@@@@@@@@@@@@@@@@@      
   @@@@@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@   
  @@@@@@@@@@@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@  
 @@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@  
 @@@@@@@@@@@@@@@  @@@@@@@@@@@@@@   @@@@@@@@@@@ 
 @@@@@@@@@@@@@@@  @@@@@@@@@@@@@   @@@@@@@@@@@@ 
 @@@@@@@@@@@@@@@  @@@@@@@@@@@@@  @@@@@@@@@@@@@
 @@@@@@@@@@@@@@@  @@@@@@@@@@@@   @@@@@@@@@@@@@    
 @@@@@@   @@@@@@  @@@@@@@@@@@   @@@@@@@@@@@@@@    
 @@@@@@   @@@@@@  @@@@@@@@@@@  @@@@@@@@@@@@@@@ 
 @@@@@@@@@@@@@@@  @@@@@@@@@@   @@@@@@@@@@@@@@@ 
 @@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@  
  @@@@@@@@@@@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@  
   @@@@@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@   
      @@@@@            @@@@@@@@@@@@@@@@@@  
      
AppKit SDK version ${e} is outdated. Latest version is ${t}. Please update to the latest version for bug fixes and new features.
            
Changelog: https://github.com/reown-com/appkit/releases
NPM Registry: https://www.npmjs.com/package/@reown/appkit`};e.s(["f",0,t])},769718,e=>{var t=e.i(401564),i=e.i(960398),o=e.i(149454),r=e.i(758331),a=e.i(16555);let n={getCaipTokens(e){if(!e)return;let t={};return Object.entries(e).forEach(([e,i])=>{t[`${a.f.EIP155}:${e}`]=i}),t},isLowerCaseMatch:(e,t)=>e?.toLowerCase()===t?.toLowerCase(),getActiveNamespaceConnectedToAuth(){let e=i.f.state.activeChain;return t.f.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(i=>o.f.getConnectorId(i)===t.f.CONNECTOR_ID.AUTH&&i===e)},withRetry({conditionFn:e,intervalMs:t,maxRetries:i}){let o=0;return new Promise(r=>{async function a(){return(o+=1,await e())?r(!0):o>=i?r(!1):(setTimeout(a,t),null)}a()})},userChainIdToChainNamespace(e){if("number"==typeof e)return t.f.CHAIN.EVM;let[i]=e.split(":");return i},getOtherAuthNamespaces:e=>e?t.f.AUTH_CONNECTOR_SUPPORTED_CHAINS.filter(t=>t!==e):[],getConnectorStorageInfo(e,t){let i=r.f.getConnections()[t]??[];return{hasDisconnected:r.f.isConnectorDisconnected(e,t),hasConnected:i.some(t=>n.isLowerCaseMatch(t.connectorId,e))}}};e.s(["f",0,n])}])})();