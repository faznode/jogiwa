(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,910842,90344,612639,669783,108201,64077,667772,744216,569962,505676,317016,843476,516519,427159,149566,e=>{e.i(237287),e.i(972801),e.i(885873),e.i(619295),e.i(465487),e.i(590404),e.i(269311),e.i(979890),e.i(674950),e.i(107337),e.i(210149),e.i(28218),e.i(217283),e.i(904356),e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119),n=e.i(56350),a=e.i(683075),r=e.i(592279),s=e.i(960398),c=e.i(971080),l=e.i(227302),d=e.i(653157),u=e.i(411249),h=e.i(803468),p=e.i(82283),f=e.i(221728),w=e.i(811424);e.i(404041);var m=e.i(645975),g=e.i(334523),b=t;e.i(62238),e.i(359072);var y=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let v=class extends b.f{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.generateTabs();return i.c`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let e=this.platforms.map(e=>{if("browser"===e)return{label:"Browser",icon:"extension",platform:"browser"};if("mobile"===e)return{label:"Mobile",icon:"mobile",platform:"mobile"};if("qrcode"===e)return{label:"Mobile",icon:"mobile",platform:"qrcode"};if("web"===e)return{label:"Webapp",icon:"browser",platform:"web"};if("desktop"===e)return{label:"Desktop",icon:"desktop",platform:"desktop"};return{label:"Browser",icon:"extension",platform:"unsupported"}});return this.platformTabs=e.map(({platform:e})=>e),e}onTabChange(e){let t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};y([(0,o.f)({type:Array})],v.prototype,"platforms",void 0),y([(0,o.f)()],v.prototype,"onSelectPlatfrom",void 0),v=y([(0,m.f)("w3m-connecting-header")],v);var x=e.i(149454),C=e.i(218454),$=e.i(181557);let k=class extends $.f{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),d.f.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:f.f.state.view}})}async onConnectProxy(){try{this.error=!1;let{connectors:e}=x.f.state,t=e.find(e=>"ANNOUNCED"===e.type&&e.info?.rdns===this.wallet?.rdns||"INJECTED"===e.type||e.name===this.wallet?.name);if(t)await c.f.connectExternal(t,t.chain);else throw Error("w3m-connecting-wc-browser: No connector found");(!p.f.state.siwx||await C.f.isAuthenticated())&&h.f.close()}catch(e){e instanceof r.v&&e.originalName===a.Y.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?d.f.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):d.f.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};k=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-connecting-wc-browser")],k);var E=$;let S=class extends E.f{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),d.f.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:f.f.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:e,name:t}=this.wallet,{redirect:i,href:o}=l.f.formatNativeUrl(e,this.uri);c.f.setWcLinking({name:t,href:o}),c.f.setRecentWallet(this.wallet),l.f.openHref(i,"_blank")}catch{this.error=!0}}};S=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-connecting-wc-desktop")],S);var N=e.i(210087),A=e.i(360334),T=$,R=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let I=class extends T.f{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=p.f.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{N.f.onConnectMobile(this.wallet)},!this.wallet)throw Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=A.W.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(c.f.subscribeKey("wcUri",()=>{this.onHandleURI()})),d.f.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:f.f.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){c.f.setWcError(!1),this.onConnect?.()}};R([(0,n.f)()],I.prototype,"redirectDeeplink",void 0),R([(0,n.f)()],I.prototype,"redirectUniversalLink",void 0),R([(0,n.f)()],I.prototype,"target",void 0),R([(0,n.f)()],I.prototype,"preferUniversalLinks",void 0),R([(0,n.f)()],I.prototype,"isLoading",void 0),I=R([(0,m.f)("w3m-connecting-wc-mobile")],I),e.i(234051);var O=e.i(829389),P=e.i(436220),D=e.i(639403);e.i(443452),e.i(210380),e.i(732965),e.i(780313),e.i(249536),e.i(803596);var j=$;e.i(121121);var W=e.i(162611);let L=W.m`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var _=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let U=class extends j.f{constructor(){super(),this.basic=!1}firstUpdated(){this.basic||d.f.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:f.f.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(e=>e())}render(){return this.onRenderProxy(),i.c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","5","5","5"]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.wallet?this.wallet.name:void 0;c.f.setWcLinking(void 0),c.f.setRecentWallet(this.wallet);let t=D.f.state.themeVariables["--apkt-qr-color"]??D.f.state.themeVariables["--w3m-qr-color"];return i.c` <wui-qr-code
      theme=${D.f.state.themeMode}
      uri=${this.uri}
      imageSrc=${(0,O.f)(P.f.getWalletImage(this.wallet))}
      color=${(0,O.f)(t)}
      alt=${(0,O.f)(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return i.c`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};U.styles=L,_([(0,o.f)({type:Boolean})],U.prototype,"basic",void 0),U=_([(0,m.f)("w3m-connecting-wc-qrcode")],U);var z=t;e.i(956303);let B=class extends z.f{constructor(){if(super(),this.wallet=f.f.state.data?.wallet,!this.wallet)throw Error("w3m-connecting-wc-unsupported: No wallet provided");d.f.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:f.f.state.view}})}render(){return i.c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${(0,O.f)(P.f.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};B=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-connecting-wc-unsupported")],B);var F=$,M=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let V=class extends F.f{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=A.W.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(c.f.subscribeKey("wcUri",()=>{this.updateLoadingState()})),d.f.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:f.f.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:e,name:t}=this.wallet,{redirect:i,href:o}=l.f.formatUniversalUrl(e,this.uri);c.f.setWcLinking({name:t,href:o}),c.f.setRecentWallet(this.wallet),l.f.openHref(i,"_blank")}catch{this.error=!0}}};M([(0,n.f)()],V.prototype,"isLoading",void 0),V=M([(0,m.f)("w3m-connecting-wc-web")],V);let K=W.m`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var q=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let H=class extends t.f{constructor(){super(),this.wallet=f.f.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!p.f.state.siwx,this.remoteFeatures=p.f.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(p.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return p.f.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),i.c`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding&&this.displayBranding?i.c`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(e=!1){if("browser"!==this.platform&&(!p.f.state.manualWCControl||e))try{let{wcPairingExpiry:t,status:i}=c.f.state,{redirectView:o}=f.f.state.data??{};if(e||p.f.state.enableEmbedded||l.f.isPairingExpired(t)||"connecting"===i){let e=c.f.getConnections(s.f.state.activeChain),t=this.remoteFeatures?.multiWallet,i=e.length>0;await c.f.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(i&&t?(f.f.replace("ProfileWallets"),w.f.showSuccess("New Wallet Added")):o?f.f.replace(o):h.f.close())}}catch(e){if(e instanceof Error&&e.message.includes("An error occurred when attempting to switch chain")&&!p.f.state.enableNetworkSwitch&&s.f.state.activeChain){s.f.setActiveCaipNetwork(g.f.getUnsupportedNetwork(`${s.f.state.activeChain}:${s.f.state.activeCaipNetwork?.id}`)),s.f.showUnsupportedChainUI();return}e instanceof r.v&&e.originalName===a.Y.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?d.f.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):d.f.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),c.f.setWcError(!0),w.f.showError(e.message??"Connection error"),c.f.resetWcConnection(),f.f.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:e,desktop_link:t,webapp_link:i,injected:o,rdns:n}=this.wallet,a=o?.map(({injected_id:e})=>e).filter(Boolean),r=[...n?[n]:a??[]],d=!p.f.state.isUniversalProvider&&r.length,h=c.f.checkInstalled(r),f=d&&h,w=t&&!l.f.isMobile();f&&!s.f.state.noAdapters&&this.platforms.push("browser"),e&&this.platforms.push(l.f.isMobile()?"mobile":"qrcode"),i&&this.platforms.push("web"),w&&this.platforms.push("desktop");let m=u.z.isCustomDeeplinkWallet(this.wallet.id,s.f.state.activeChain);f||!d||s.f.state.noAdapters||m||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return i.c`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return i.c`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return i.c`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return i.c`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return i.c`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return i.c`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?i.c`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){let t=this.shadowRoot?.querySelector("div");t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};H.styles=K,q([(0,n.f)()],H.prototype,"platform",void 0),q([(0,n.f)()],H.prototype,"platforms",void 0),q([(0,n.f)()],H.prototype,"isSiwxEnabled",void 0),q([(0,n.f)()],H.prototype,"remoteFeatures",void 0),q([(0,o.f)({type:Boolean})],H.prototype,"displayBranding",void 0),q([(0,o.f)({type:Boolean})],H.prototype,"basic",void 0),H=q([(0,m.f)("w3m-connecting-wc-view")],H),e.s(["W3mConnectingWcView",0,H],90344);var G=t,Y=e.i(886259),X=e.i(758331);e.i(903134),e.i(212605);var J=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Q=class extends G.f{constructor(){super(),this.unsubscribe=[],this.isMobile=l.f.isMobile(),this.remoteFeatures=p.f.state.remoteFeatures,this.unsubscribe.push(p.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){let{featured:e,recommended:t}=Y.f.state,{customWallets:o}=p.f.state,n=X.f.getRecentWallets(),a=e.length||t.length||o?.length||n.length;return i.c`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${a?i.c`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return i.c`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?i.c` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};J([(0,n.f)()],Q.prototype,"isMobile",void 0),J([(0,n.f)()],Q.prototype,"remoteFeatures",void 0),Q=J([(0,m.f)("w3m-connecting-wc-basic-view")],Q),e.s(["W3mConnectingWcBasicView",0,Q],612639);var Z=t,ee=e.i(576599),et=e.i(564126);e.i(534420),e.i(746650);var ei=e.i(979484),eo=e.i(315193);let en=eo.m`
  .continue-button-container {
    width: 100%;
  }
`;var ea=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let er=class extends Z.f{constructor(){super(...arguments),this.loading=!1}render(){return i.c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{l.f.openHref(ee.f.URLS.FAQ,"_blank")}}
        >
          Learn more about names
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return i.c` <wui-flex
      flexDirection="column"
      gap="6"
      alignItems="center"
      .padding=${["0","6","0","6"]}
    >
      <wui-flex gap="3" alignItems="center" justifyContent="center">
        <wui-icon-box icon="id" size="xl" iconSize="xxl" color="default"></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="3">
        <wui-text align="center" variant="lg-medium" color="primary">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="md-regular" color="primary">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return i.c`<wui-flex
      .padding=${["0","8","0","8"]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button
        fullWidth
        .loading=${this.loading}
        size="lg"
        borderRadius="xs"
        @click=${this.handleContinue.bind(this)}
        >Choose name
      </wui-button>
    </wui-flex>`}handleContinue(){f.f.push("RegisterAccountName"),d.f.sendEvent({type:"track",event:"OPEN_ENS_FLOW",properties:{isSmartAccount:(0,et.P)(s.f.state.activeChain)===ei.P.ACCOUNT_TYPES.SMART_ACCOUNT}})}};er.styles=en,ea([(0,n.f)()],er.prototype,"loading",void 0),er=ea([(0,m.f)("w3m-choose-account-name-view")],er),e.s(["W3mChooseAccountNameView",0,er],669783);var es=t;e.i(143053);let ec=class extends es.f{constructor(){super(...arguments),this.wallet=f.f.state.data?.wallet}render(){if(!this.wallet)throw Error("w3m-downloads-view");return i.c`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?i.c`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?i.c`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?i.c`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?i.c`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(d.f.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),l.f.openHref(e.href,"_blank"))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};ec=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-downloads-view")],ec),e.s(["W3mDownloadsView",0,ec],108201);var el=t;let ed=class extends el.f{render(){return i.c`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.recommendedWalletsTemplate()}
        <w3m-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          size="sm"
          @click=${()=>{l.f.openHref("https://walletguide.walletconnect.network/","_blank")}}
        ></w3m-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){let{recommended:e,featured:t}=Y.f.state,{customWallets:o}=p.f.state;return[...t,...o??[],...e].slice(0,4).map((e,t)=>i.c`
        <w3m-list-wallet
          displayIndex=${t}
          name=${e.name??"Unknown"}
          tagVariant="accent"
          size="sm"
          imageSrc=${(0,O.f)(P.f.getWalletImage(e))}
          @click=${()=>{this.onWalletClick(e)}}
        ></w3m-list-wallet>
      `)}onWalletClick(e){d.f.sendEvent({type:"track",event:"GET_WALLET",properties:{name:e.name,walletRank:void 0,explorerId:e.id,type:"homepage"}}),l.f.openHref(e.homepage??"https://walletguide.walletconnect.network","_blank")}};ed=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-get-wallet-view")],ed),e.s(["W3mGetWalletView",0,ed],64077);var eu=t,eh=t;e.i(357650);var ep=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ef=class extends eh.f{constructor(){super(...arguments),this.data=[]}render(){return i.c`
      <wui-flex flexDirection="column" alignItems="center" gap="4">
        ${this.data.map(e=>i.c`
            <wui-flex flexDirection="column" alignItems="center" gap="5">
              <wui-flex flexDirection="row" justifyContent="center" gap="1">
                ${e.images.map(e=>i.c`<wui-visual size="sm" name=${e}></wui-visual>`)}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="1">
              <wui-text variant="md-regular" color="primary" align="center">${e.title}</wui-text>
              <wui-text variant="sm-regular" color="secondary" align="center"
                >${e.text}</wui-text
              >
            </wui-flex>
          `)}
      </wui-flex>
    `}};ep([(0,o.f)({type:Array})],ef.prototype,"data",void 0),ef=ep([(0,m.f)("w3m-help-widget")],ef);let ew=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}],em=class extends eu.f{render(){return i.c`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${ew}></w3m-help-widget>
        <wui-button variant="accent-primary" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){d.f.sendEvent({type:"track",event:"CLICK_GET_WALLET_HELP"}),f.f.push("GetWallet")}};em=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-what-is-a-wallet-view")],em),e.s(["W3mWhatIsAWalletView",0,em],667772);var eg=t,eb=e.i(455587);e.i(729084),e.i(391641);let ey=W.m`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var ev=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ex=class extends eg.f{constructor(){super(),this.unsubscribe=[],this.checked=eb.f.state.isLegalCheckboxChecked,this.unsubscribe.push(eb.f.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=p.f.state,o=p.f.state.features?.legalCheckbox,n=!!(e||t)&&!!o,a=n&&!this.checked;return i.c`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${n?["0","3","3","3"]:"3"}
        gap="2"
        class=${(0,O.f)(a?"disabled":void 0)}
      >
        <w3m-wallet-login-list tabIdx=${(0,O.f)(a?-1:void 0)}></w3m-wallet-login-list>
      </wui-flex>
    `}};ex.styles=ey,ev([(0,n.f)()],ex.prototype,"checked",void 0),ex=ev([(0,m.f)("w3m-connect-wallets-view")],ex),e.s(["W3mConnectWalletsView",0,ex],744216);var eC=t,e$=e.i(401564),ek=t,eE=e.i(459088);let eS=W.m`
  :host {
    display: block;
    width: 120px;
    height: 120px;
  }

  svg {
    width: 120px;
    height: 120px;
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: ${e=>e.colors.accent100};
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`,eN=class extends ek.f{render(){return i.c`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};eN.styles=[eE.e,eS],eN=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("wui-loading-hexagon")],eN),e.i(774339);let eA=eo.m`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`;var eT=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eR=class extends eC.f{constructor(){super(),this.network=f.f.state.data?.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw Error("w3m-network-switch-view: No network provided");this.onShowRetry();let e=this.getLabel(),t=this.getSubLabel();return i.c`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","10","5"]}
        gap="7"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${(0,O.f)(P.f.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:i.c`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="h6-regular" color="primary">${e}</wui-text>
          <wui-text align="center" variant="md-regular" color="secondary">${t}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent-primary"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){let e=x.f.getConnectorId(s.f.state.activeChain);return x.f.getAuthConnector()&&e===e$.f.CONNECTOR_ID.AUTH?"":this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet"}getLabel(){let e=x.f.getConnectorId(s.f.state.activeChain);return x.f.getAuthConnector()&&e===e$.f.CONNECTOR_ID.AUTH?`Switching to ${this.network?.name??"Unknown"} network...`:this.error?"Switch declined":"Approve in wallet"}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;let e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}async onSwitchNetwork(){try{this.error=!1,s.f.state.activeChain!==this.network?.chainNamespace&&s.f.setIsSwitchingNamespace(!0),this.network&&(await s.f.switchActiveNetwork(this.network),await C.f.isAuthenticated()&&f.f.goBack())}catch(e){this.error=!0}}};eR.styles=eA,eT([(0,n.f)()],eR.prototype,"showRetry",void 0),eT([(0,n.f)()],eR.prototype,"error",void 0),eR=eT([(0,m.f)("w3m-network-switch-view")],eR),e.s(["W3mNetworkSwitchView",0,eR],569962);var eI=t,eO=e.i(241845),eP=e.i(798852);e.i(6957);var eD=t;e.i(839009),e.i(496969);let ej=W.m`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    text-transform: capitalize;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var eW=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eL=class extends eD.f{constructor(){super(...arguments),this.imageSrc=void 0,this.name="Ethereum",this.disabled=!1}render(){return i.c`
      <button ?disabled=${this.disabled} tabindex=${(0,O.f)(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          ${this.imageTemplate()}
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}imageTemplate(){return this.imageSrc?i.c`<wui-image ?boxed=${!0} src=${this.imageSrc}></wui-image>`:i.c`<wui-image
      ?boxed=${!0}
      icon="networkPlaceholder"
      size="lg"
      iconColor="default"
    ></wui-image>`}};eL.styles=[eE.e,eE.j,ej],eW([(0,o.f)()],eL.prototype,"imageSrc",void 0),eW([(0,o.f)()],eL.prototype,"name",void 0),eW([(0,o.f)()],eL.prototype,"tabIdx",void 0),eW([(0,o.f)({type:Boolean})],eL.prototype,"disabled",void 0),eL=eW([(0,m.f)("wui-list-network")],eL);let e_=eo.m`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`;var eU=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ez=class extends eI.f{constructor(){super(),this.unsubscribe=[],this.network=s.f.state.activeCaipNetwork,this.requestedCaipNetworks=s.f.getCaipNetworks(),this.search="",this.onDebouncedSearch=l.f.debounce(e=>{this.search=e},100),this.unsubscribe.push(eO.f.subscribeNetworkImages(()=>this.requestUpdate()),s.f.subscribeKey("activeCaipNetwork",e=>this.network=e),s.f.subscribe(()=>{this.requestedCaipNetworks=s.f.getAllRequestedCaipNetworks()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${["0","3","3","3"]}
        flexDirection="column"
        gap="2"
      >
        ${this.networksTemplate()}
      </wui-flex>
    `}templateSearchInput(){return i.c`
      <wui-flex gap="2" .padding=${["0","3","3","3"]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}networksTemplate(){let e=s.f.getAllApprovedCaipNetworkIds(),t=l.f.sortRequestedNetworks(e,this.requestedCaipNetworks);return this.search?this.filteredNetworks=t?.filter(e=>e?.name?.toLowerCase().includes(this.search.toLowerCase())):this.filteredNetworks=t,this.filteredNetworks?.map(e=>i.c`
        <wui-list-network
          .selected=${this.network?.id===e.id}
          imageSrc=${(0,O.f)(P.f.getNetworkImage(e))}
          type="network"
          name=${e.name??e.id}
          @click=${()=>this.onSwitchNetwork(e)}
          .disabled=${s.f.isCaipNetworkDisabled(e)}
          data-testid=${`w3m-network-switch-${e.name??e.id}`}
        ></wui-list-network>
      `)}onSwitchNetwork(e){eP.f.onSwitchNetwork({network:e})}};ez.styles=e_,eU([(0,n.f)()],ez.prototype,"network",void 0),eU([(0,n.f)()],ez.prototype,"requestedCaipNetworks",void 0),eU([(0,n.f)()],ez.prototype,"filteredNetworks",void 0),eU([(0,n.f)()],ez.prototype,"search",void 0),ez=eU([(0,m.f)("w3m-networks-view")],ez),e.s(["W3mNetworksView",0,ez],505676);var eB=t;let eF=W.m`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-visual {
    border-radius: calc(
      ${({borderRadius:e})=>e["1"]} * 9 - ${({borderRadius:e})=>e["3"]}
    );
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(
      ${({borderRadius:e})=>e["1"]} * 9 - ${({borderRadius:e})=>e["3"]}
    );
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e["4"]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:e})=>e["01"]} ${({spacing:e})=>e["2"]};
  }

  .capitalize {
    text-transform: capitalize;
  }
`;var eM=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eV={eip155:"eth",solana:"solana",bip122:"bitcoin",polkadot:void 0},eK=class extends eB.f{constructor(){super(...arguments),this.unsubscribe=[],this.switchToChain=f.f.state.data?.switchToChain,this.caipNetwork=f.f.state.data?.network,this.activeChain=s.f.state.activeChain}firstUpdated(){this.unsubscribe.push(s.f.subscribeKey("activeChain",e=>this.activeChain=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.switchToChain?e$.f.CHAIN_NAME_MAP[this.switchToChain]:"supported";if(!this.switchToChain)return null;let t=e$.f.CHAIN_NAME_MAP[this.switchToChain];return i.c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["4","2","2","2"]}
        gap="4"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="2">
          <wui-visual
            size="md"
            name=${(0,O.f)(eV[this.switchToChain])}
          ></wui-visual>
          <wui-flex gap="2" flexDirection="column" alignItems="center">
            <wui-text
              data-testid=${`w3m-switch-active-chain-to-${t}`}
              variant="lg-regular"
              color="primary"
              align="center"
              >Switch to <span class="capitalize">${t}</span></wui-text
            >
            <wui-text variant="md-regular" color="secondary" align="center">
              Connected wallet doesn't support connecting to ${e} chain. You
              need to connect with a different wallet.
            </wui-text>
          </wui-flex>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(s.f.setIsSwitchingNamespace(!0),x.f.setFilterByNamespace(this.switchToChain),this.caipNetwork?await s.f.switchActiveNetwork(this.caipNetwork):s.f.setActiveNamespace(this.switchToChain),f.f.reset("Connect"))}};eK.styles=eF,eM([(0,o.f)()],eK.prototype,"activeChain",void 0),eK=eM([(0,m.f)("w3m-switch-active-chain-view")],eK),e.s(["W3mSwitchActiveChainView",0,eK],317016);var eq=t;let eH=[{images:["network","layers","system"],title:"The system’s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}],eG=class extends eq.f{render(){return i.c`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${eH}></w3m-help-widget>
        <wui-button
          variant="accent-primary"
          size="md"
          @click=${()=>{l.f.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};eG=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-what-is-a-network-view")],eG),e.s(["W3mWhatIsANetworkView",0,eG],843476);var eY=t;e.i(79929);let eX=eo.m`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var eJ=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eQ=class extends eY.f{constructor(){super(),this.swapUnsupportedChain=f.f.state.data?.swapUnsupportedChain,this.unsubscribe=[],this.disconnecting=!1,this.remoteFeatures=p.f.state.remoteFeatures,this.unsubscribe.push(eO.f.subscribeNetworkImages(()=>this.requestUpdate()),p.f.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${["3","5","2","5"]}
          alignItems="center"
          gap="5"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="3" gap="2"> ${this.networksTemplate()} </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="3" gap="2">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="signOut"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="md-medium" color="secondary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?i.c`
        <wui-text variant="sm-regular" color="secondary" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:i.c`
      <wui-text variant="sm-regular" color="secondary" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){let e=s.f.getAllRequestedCaipNetworks(),t=s.f.getAllApprovedCaipNetworkIds(),o=l.f.sortRequestedNetworks(t,e);return(this.swapUnsupportedChain?o.filter(e=>A.W.SWAP_SUPPORTED_NETWORKS.includes(e.caipNetworkId)):o).map(e=>i.c`
        <wui-list-network
          imageSrc=${(0,O.f)(P.f.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onSwitchNetwork(e)}
        >
        </wui-list-network>
      `)}async onDisconnect(){try{this.disconnecting=!0;let e=s.f.state.activeChain,t=c.f.getConnections(e).length>0,i=e&&x.f.state.activeConnectorIds[e],o=this.remoteFeatures?.multiWallet;await c.f.disconnect(o?{id:i,namespace:e}:{}),t&&o&&(f.f.push("ProfileWallets"),w.f.showSuccess("Wallet deleted"))}catch{d.f.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),w.f.showError("Failed to disconnect")}finally{this.disconnecting=!1}}async onSwitchNetwork(e){let t=s.f.getActiveCaipAddress(),i=s.f.getAllApprovedCaipNetworkIds(),o=(s.f.getNetworkProp("supportsAllNetworks",e.chainNamespace),f.f.state.data);t?i?.includes(e.caipNetworkId)?await s.f.switchActiveNetwork(e):f.f.push("SwitchNetwork",{...o,network:e}):t||(s.f.setActiveCaipNetwork(e),f.f.push("Connect"))}};eQ.styles=eX,eJ([(0,n.f)()],eQ.prototype,"disconnecting",void 0),eJ([(0,n.f)()],eQ.prototype,"remoteFeatures",void 0),eQ=eJ([(0,m.f)("w3m-unsupported-chain-view")],eQ),e.s(["W3mUnsupportedChainView",0,eQ],516519);var eZ=t,e0=t;e.i(912190);let e3=W.m`
  wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
  }

  /* -- Types --------------------------------------------------------- */
  wui-flex[data-type='info'] {
    color: ${({tokens:e})=>e.theme.textSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-flex[data-type='success'] {
    color: ${({tokens:e})=>e.core.textSuccess};
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] {
    color: ${({tokens:e})=>e.core.textError};
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  wui-flex[data-type='warning'] {
    color: ${({tokens:e})=>e.core.textWarning};
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  wui-flex[data-type='info'] wui-icon-box {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex[data-type='success'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  wui-flex[data-type='warning'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  wui-text {
    flex: 1;
  }
`;var e1=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let e2=class extends e0.f{constructor(){super(...arguments),this.icon="externalLink",this.text="",this.type="info"}render(){return i.c`
      <wui-flex alignItems="center" data-type=${this.type}>
        <wui-icon-box size="sm" color="inherit" icon=${this.icon}></wui-icon-box>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
      </wui-flex>
    `}};e2.styles=[eE.e,eE.j,e3],e1([(0,o.f)()],e2.prototype,"icon",void 0),e1([(0,o.f)()],e2.prototype,"text",void 0),e1([(0,o.f)()],e2.prototype,"type",void 0),e2=e1([(0,m.f)("wui-banner")],e2);let e5=eo.m`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`,e4=class extends eZ.f{constructor(){super(),this.unsubscribe=[]}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c` <wui-flex flexDirection="column" .padding=${["2","3","3","3"]} gap="2">
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=s.f.getAllRequestedCaipNetworks(),t=s.f.getAllApprovedCaipNetworkIds(),o=s.f.state.activeCaipNetwork,n=s.f.checkIfSmartAccountEnabled(),a=l.f.sortRequestedNetworks(t,e);if(n&&(0,et.P)(o?.chainNamespace)===ei.P.ACCOUNT_TYPES.SMART_ACCOUNT){if(!o)return null;a=[o]}return a.filter(e=>e.chainNamespace===o?.chainNamespace).map(e=>i.c`
        <wui-list-network
          imageSrc=${(0,O.f)(P.f.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          ?transparent=${!0}
        >
        </wui-list-network>
      `)}};e4.styles=e5,e4=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-wallet-compatible-networks-view")],e4),e.s(["W3mWalletCompatibleNetworksView",0,e4],427159);var e6=t,e8=t,e9=t;e.i(852634),e.i(864380);let e7=W.m`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    box-shadow: 0 0 0 8px ${({tokens:e})=>e.theme.borderPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    overflow: hidden;
  }

  :host([data-border-radius-full='true']) {
    border-radius: 50px;
  }

  wui-icon {
    font-size: 48px;
  }
`;var te=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tt=class extends e9.f{render(){return this.dataset.borderRadiusFull=this.borderRadiusFull?"true":"false",i.c`${this.templateVisual()}`}templateVisual(){return this.imageSrc?i.c`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:i.c`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="wallet"
    ></wui-icon>`}};tt.styles=[eE.e,e7],te([(0,o.f)()],tt.prototype,"imageSrc",void 0),te([(0,o.f)()],tt.prototype,"alt",void 0),te([(0,o.f)({type:Boolean})],tt.prototype,"borderRadiusFull",void 0),tt=te([(0,m.f)("wui-visual-thumbnail")],tt);let ti=W.m`
  :host {
    display: flex;
    justify-content: center;
    gap: ${({spacing:e})=>e["4"]};
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`,to=class extends e8.f{constructor(){super(...arguments),this.dappImageUrl=p.f.state.metadata?.icons,this.walletImageUrl=s.f.getAccountData()?.connectedWalletInfo?.icon}firstUpdated(){let e=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");e?.[0]&&this.createAnimation(e[0],"translate(18px)"),e?.[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){return i.c`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,t){e.animate([{transform:"translateX(0px)"},{transform:t}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};to.styles=ti,to=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.f)("w3m-siwx-sign-message-thumbnails")],to);var tn=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ta=class extends e6.f{constructor(){super(...arguments),this.dappName=p.f.state.metadata?.name,this.isCancelling=!1,this.isSigning=!1}render(){return i.c`
      <wui-flex justifyContent="center" .padding=${["8","0","6","0"]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex .padding=${["0","20","5","20"]} gap="3" justifyContent="space-between">
        <wui-text variant="lg-medium" align="center" color="primary"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["0","10","4","10"]} gap="3" justifyContent="space-between">
        <wui-text variant="md-regular" align="center" color="secondary"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["4","5","5","5"]} gap="3" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-secondary"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          ${this.isCancelling?"Cancelling...":"Cancel"}
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-primary"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0;try{await C.f.requestSignMessage()}catch(e){if(e instanceof Error&&e.message.includes("OTP is required")){w.f.showError({message:"Something went wrong. We need to verify your account again."}),f.f.replace("DataCapture");return}throw e}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,await C.f.cancelSignMessage().finally(()=>this.isCancelling=!1)}};tn([(0,n.f)()],ta.prototype,"isCancelling",void 0),tn([(0,n.f)()],ta.prototype,"isSigning",void 0),ta=tn([(0,m.f)("w3m-siwx-sign-message-view")],ta),e.s(["W3mSIWXSignMessageView",0,ta],149566),e.s([],910842)},237287,972801,885873,619295,269311,359072,979890,674950,107337,210149,903134,212605,391641,28218,121121,181557,217283,904356,e=>{e.i(812207);var t=e.i(108285),i=e.i(654479);e.i(374576);var o=e.i(120119),n=e.i(56350);e.i(234051);var a=e.i(829389),r=e.i(241845),s=e.i(436220),c=e.i(960398),l=e.i(227302),d=e.i(803468),u=e.i(82283);e.i(404041);var h=e.i(645975),p=t;e.i(852634),e.i(864380),e.i(383227),e.i(839009),e.i(73944);var f=e.i(459088),w=e.i(112699);e.i(221803);var m=e.i(162611);let g=m.m`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e["20"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[16]};
    height: 32px;
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: box-shadow;
  }

  button wui-flex.avatar-container {
    width: 28px;
    height: 24px;
    position: relative;

    wui-flex.network-image-container {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 12px;
      height: 12px;
    }

    wui-flex.network-image-container wui-icon {
      background: ${({tokens:e})=>e.theme.foregroundPrimary};
    }

    wui-avatar {
      width: 24px;
      min-width: 24px;
      height: 24px;
    }

    wui-icon {
      width: 12px;
      height: 12px;
    }
  }

  wui-image,
  wui-icon {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-text {
    white-space: nowrap;
  }

  button wui-flex.balance-container {
    height: 100%;
    border-radius: ${({borderRadius:e})=>e[16]};
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
    background: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:focus-visible:enabled,
  button:active:enabled {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);

    wui-flex.balance-container {
      background: ${({tokens:e})=>e.theme.foregroundTertiary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled wui-text,
  button:disabled wui-flex.avatar-container {
    opacity: 0.3;
  }
`;var b=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let y=class extends p.f{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address="",this.profileName="",this.charsStart=4,this.charsEnd=6}render(){return i.c`
      <button
        ?disabled=${this.disabled}
        class=${(0,a.f)(this.balance?void 0:"local-no-balance")}
        data-error=${(0,a.f)(this.isUnsupportedChain)}
      >
        ${this.imageTemplate()} ${this.addressTemplate()} ${this.balanceTemplate()}
      </button>
    `}imageTemplate(){let e=this.networkSrc?i.c`<wui-image src=${this.networkSrc}></wui-image>`:i.c` <wui-icon size="inherit" color="inherit" name="networkPlaceholder"></wui-icon> `;return i.c`<wui-flex class="avatar-container">
      <wui-avatar
        .imageSrc=${this.avatarSrc}
        alt=${this.address}
        address=${this.address}
      ></wui-avatar>

      <wui-flex class="network-image-container">${e}</wui-flex>
    </wui-flex>`}addressTemplate(){return i.c`<wui-text variant="md-regular" color="inherit">
      ${this.address?w.f.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"}):null}
    </wui-text>`}balanceTemplate(){if(this.balance){let e=this.loading?i.c`<wui-loading-spinner size="md" color="inherit"></wui-loading-spinner>`:i.c`<wui-text variant="md-regular" color="inherit"> ${this.balance}</wui-text>`;return i.c`<wui-flex alignItems="center" justifyContent="center" class="balance-container"
        >${e}</wui-flex
      >`}return null}};y.styles=[f.e,f.j,g],b([(0,o.f)()],y.prototype,"networkSrc",void 0),b([(0,o.f)()],y.prototype,"avatarSrc",void 0),b([(0,o.f)()],y.prototype,"balance",void 0),b([(0,o.f)({type:Boolean})],y.prototype,"isUnsupportedChain",void 0),b([(0,o.f)({type:Boolean})],y.prototype,"disabled",void 0),b([(0,o.f)({type:Boolean})],y.prototype,"loading",void 0),b([(0,o.f)()],y.prototype,"address",void 0),b([(0,o.f)()],y.prototype,"profileName",void 0),b([(0,o.f)()],y.prototype,"charsStart",void 0),b([(0,o.f)()],y.prototype,"charsEnd",void 0),y=b([(0,h.f)("wui-account-button")],y);var v=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class x extends t.f{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance="show",this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.isSupported=!!u.f.state.allowUnsupportedChain||!c.f.state.activeChain||c.f.checkIfSupportedNetwork(c.f.state.activeChain)}connectedCallback(){super.connectedCallback(),this.setAccountData(c.f.getAccountData(this.namespace)),this.setNetworkData(c.f.getNetworkData(this.namespace))}firstUpdated(){let e=this.namespace;e?this.unsubscribe.push(c.f.subscribeChainProp("accountState",e=>{this.setAccountData(e)},e),c.f.subscribeChainProp("networkState",t=>{this.setNetworkData(t),this.isSupported=c.f.checkIfSupportedNetwork(e,t?.caipNetwork?.caipNetworkId)},e)):this.unsubscribe.push(r.f.subscribeNetworkImages(()=>{this.networkImage=s.f.getNetworkImage(this.network)}),c.f.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),c.f.subscribeChainProp("accountState",e=>{this.setAccountData(e)}),c.f.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=s.f.getNetworkImage(e),this.isSupported=!e?.chainNamespace||c.f.checkIfSupportedNetwork(e?.chainNamespace),this.fetchNetworkImage(e)}))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!c.f.state.activeChain)return null;let e="show"===this.balance,t="string"!=typeof this.balanceVal,{formattedText:o}=l.f.parseBalance(this.balanceVal,this.balanceSymbol);return i.c`
      <wui-account-button
        .disabled=${!!this.disabled}
        .isUnsupportedChain=${!u.f.state.allowUnsupportedChain&&!this.isSupported}
        address=${(0,a.f)(l.f.getPlainAddress(this.caipAddress))}
        profileName=${(0,a.f)(this.profileName)}
        networkSrc=${(0,a.f)(this.networkImage)}
        avatarSrc=${(0,a.f)(this.profileImage)}
        balance=${e?o:""}
        @click=${this.onClick.bind(this)}
        data-testid=${`account-button${this.namespace?`-${this.namespace}`:""}`}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${t}
      >
      </wui-account-button>
    `}onClick(){this.isSupported||u.f.state.allowUnsupportedChain?d.f.open({namespace:this.namespace}):d.f.open({view:"UnsupportedChain"})}async fetchNetworkImage(e){e?.assets?.imageId&&(this.networkImage=await s.f.fetchNetworkImage(e?.assets?.imageId))}setAccountData(e){e&&(this.caipAddress=e.caipAddress,this.balanceVal=e.balance,this.balanceSymbol=e.balanceSymbol,this.profileName=e.profileName,this.profileImage=e.profileImage)}setNetworkData(e){e&&(this.network=e.caipNetwork,this.networkImage=s.f.getNetworkImage(e.caipNetwork))}}v([(0,o.f)({type:Boolean})],x.prototype,"disabled",void 0),v([(0,o.f)()],x.prototype,"balance",void 0),v([(0,o.f)()],x.prototype,"charsStart",void 0),v([(0,o.f)()],x.prototype,"charsEnd",void 0),v([(0,o.f)()],x.prototype,"namespace",void 0),v([(0,n.f)()],x.prototype,"caipAddress",void 0),v([(0,n.f)()],x.prototype,"balanceVal",void 0),v([(0,n.f)()],x.prototype,"balanceSymbol",void 0),v([(0,n.f)()],x.prototype,"profileName",void 0),v([(0,n.f)()],x.prototype,"profileImage",void 0),v([(0,n.f)()],x.prototype,"network",void 0),v([(0,n.f)()],x.prototype,"networkImage",void 0),v([(0,n.f)()],x.prototype,"isSupported",void 0);let C=class extends x{};C=v([(0,h.f)("w3m-account-button")],C);let $=class extends x{};$=v([(0,h.f)("appkit-account-button")],$),e.s(["AppKitAccountButton",0,$,"W3mAccountButton",0,C],237287);var k=t,E=e.i(315193);let S=E.m`
  :host {
    display: block;
    width: max-content;
  }
`;var N=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class A extends k.f{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0}firstUpdated(){this.caipAddress=this.namespace?c.f.getAccountData(this.namespace)?.caipAddress:c.f.state.activeCaipAddress,this.namespace?this.unsubscribe.push(c.f.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},this.namespace)):this.unsubscribe.push(c.f.subscribeKey("activeCaipAddress",e=>this.caipAddress=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return this.caipAddress?i.c`
          <appkit-account-button
            .disabled=${!!this.disabled}
            balance=${(0,a.f)(this.balance)}
            .charsStart=${(0,a.f)(this.charsStart)}
            .charsEnd=${(0,a.f)(this.charsEnd)}
            namespace=${(0,a.f)(this.namespace)}
          >
          </appkit-account-button>
        `:i.c`
          <appkit-connect-button
            size=${(0,a.f)(this.size)}
            label=${(0,a.f)(this.label)}
            loadingLabel=${(0,a.f)(this.loadingLabel)}
            namespace=${(0,a.f)(this.namespace)}
          ></appkit-connect-button>
        `}}A.styles=S,N([(0,o.f)({type:Boolean})],A.prototype,"disabled",void 0),N([(0,o.f)()],A.prototype,"balance",void 0),N([(0,o.f)()],A.prototype,"size",void 0),N([(0,o.f)()],A.prototype,"label",void 0),N([(0,o.f)()],A.prototype,"loadingLabel",void 0),N([(0,o.f)()],A.prototype,"charsStart",void 0),N([(0,o.f)()],A.prototype,"charsEnd",void 0),N([(0,o.f)()],A.prototype,"namespace",void 0),N([(0,n.f)()],A.prototype,"caipAddress",void 0);let T=class extends A{};T=N([(0,h.f)("w3m-button")],T);let R=class extends A{};R=N([(0,h.f)("appkit-button")],R),e.s(["AppKitButton",0,R,"W3mButton",0,T],972801);var I=t,O=t;let P=m.m`
  :host {
    position: relative;
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='sm'] {
    padding: ${({spacing:e})=>e[2]};
  }

  button[data-size='md'] {
    padding: ${({spacing:e})=>e[3]};
  }

  button[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]};
  }

  button[data-variant='primary'] {
    background: ${({tokens:e})=>e.core.backgroundAccentPrimary};
  }

  button[data-variant='secondary'] {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button:hover:enabled {
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  button:disabled {
    cursor: not-allowed;
  }

  button[data-loading='true'] {
    cursor: not-allowed;
  }

  button[data-loading='true'][data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
  }

  button[data-loading='true'][data-size='md'] {
    border-radius: ${({borderRadius:e})=>e[20]};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[4]};
  }

  button[data-loading='true'][data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[16]};
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[5]};
  }
`;var D=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let j=class extends O.f{constructor(){super(...arguments),this.size="md",this.variant="primary",this.loading=!1,this.text="Connect Wallet"}render(){return i.c`
      <button
        data-loading=${this.loading}
        data-variant=${this.variant}
        data-size=${this.size}
        ?disabled=${this.loading}
      >
        ${this.contentTemplate()}
      </button>
    `}contentTemplate(){let e={primary:"invert",secondary:"accent-primary"};return this.loading?i.c`<wui-loading-spinner
      color=${e[this.variant]}
      size=${this.size}
    ></wui-loading-spinner>`:i.c` <wui-text variant=${({lg:"lg-regular",md:"md-regular",sm:"sm-regular"})[this.size]} color=${e[this.variant]}>
        ${this.text}
      </wui-text>`}};j.styles=[f.e,f.j,P],D([(0,o.f)()],j.prototype,"size",void 0),D([(0,o.f)()],j.prototype,"variant",void 0),D([(0,o.f)({type:Boolean})],j.prototype,"loading",void 0),D([(0,o.f)()],j.prototype,"text",void 0),j=D([(0,h.f)("wui-connect-button")],j);var W=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class L extends I.f{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=d.f.state.open,this.loading=this.namespace?d.f.state.loadingNamespaceMap.get(this.namespace):d.f.state.loading,this.unsubscribe.push(d.f.subscribe(e=>{this.open=e.open,this.loading=this.namespace?e.loadingNamespaceMap.get(this.namespace):e.loading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c`
      <wui-connect-button
        size=${(0,a.f)(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${`connect-button${this.namespace?`-${this.namespace}`:""}`}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?d.f.close():this.loading||d.f.open({view:"Connect",namespace:this.namespace})}}W([(0,o.f)()],L.prototype,"size",void 0),W([(0,o.f)()],L.prototype,"label",void 0),W([(0,o.f)()],L.prototype,"loadingLabel",void 0),W([(0,o.f)()],L.prototype,"namespace",void 0),W([(0,n.f)()],L.prototype,"open",void 0),W([(0,n.f)()],L.prototype,"loading",void 0);let _=class extends L{};_=W([(0,h.f)("w3m-connect-button")],_);let U=class extends L{};U=W([(0,h.f)("appkit-connect-button")],U),e.s(["AppKitConnectButton",0,U,"W3mConnectButton",0,_],885873);var z=t,B=e.i(653157),F=t;e.i(912190);let M=m.m`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e[32]};
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]}
      ${({spacing:e})=>e[1]} ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button[data-size='sm'] > wui-icon-box,
  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-icon-box,
  button[data-size='md'] > wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-icon-box,
  button[data-size='lg'] > wui-image {
    width: 24px;
    height: 24px;
  }

  wui-image,
  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e[32]};
  }
`;var V=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let K=class extends F.f{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.size="lg"}render(){return i.c`
      <button data-size=${this.size} data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant=${({sm:"sm-regular",md:"md-regular",lg:"lg-regular"})[this.size]} color="primary">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?i.c` <wui-icon-box color="error" icon="warningCircle"></wui-icon-box> `:this.imageSrc?i.c`<wui-image src=${this.imageSrc}></wui-image>`:i.c` <wui-icon size="xl" color="default" name="networkPlaceholder"></wui-icon> `}};K.styles=[f.e,f.j,M],V([(0,o.f)()],K.prototype,"imageSrc",void 0),V([(0,o.f)({type:Boolean})],K.prototype,"isUnsupportedChain",void 0),V([(0,o.f)({type:Boolean})],K.prototype,"disabled",void 0),V([(0,o.f)()],K.prototype,"size",void 0),K=V([(0,h.f)("wui-network-button")],K);let q=E.m`
  :host {
    display: block;
    width: max-content;
  }
`;var H=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class G extends z.f{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=c.f.state.activeCaipNetwork,this.networkImage=s.f.getNetworkImage(this.network),this.caipAddress=c.f.state.activeCaipAddress,this.loading=d.f.state.loading,this.isSupported=!!u.f.state.allowUnsupportedChain||!c.f.state.activeChain||c.f.checkIfSupportedNetwork(c.f.state.activeChain),this.unsubscribe.push(r.f.subscribeNetworkImages(()=>{this.networkImage=s.f.getNetworkImage(this.network)}),c.f.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),c.f.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=s.f.getNetworkImage(e),this.isSupported=!e?.chainNamespace||c.f.checkIfSupportedNetwork(e.chainNamespace),s.f.fetchNetworkImage(e?.assets?.imageId)}),d.f.subscribeKey("loading",e=>this.loading=e))}firstUpdated(){s.f.fetchNetworkImage(this.network?.assets?.imageId)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=!this.network||c.f.checkIfSupportedNetwork(this.network.chainNamespace);return i.c`
      <wui-network-button
        .disabled=${!!(this.disabled||this.loading)}
        .isUnsupportedChain=${!u.f.state.allowUnsupportedChain&&!e}
        imageSrc=${(0,a.f)(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?this.isSupported||u.f.state.allowUnsupportedChain?this.network.name:"Switch Network":this.label?this.label:this.caipAddress?"Unknown Network":"Select Network"}onClick(){this.loading||(B.f.sendEvent({type:"track",event:"CLICK_NETWORKS"}),d.f.open({view:"Networks"}))}}G.styles=q,H([(0,o.f)({type:Boolean})],G.prototype,"disabled",void 0),H([(0,o.f)({type:String})],G.prototype,"label",void 0),H([(0,n.f)()],G.prototype,"network",void 0),H([(0,n.f)()],G.prototype,"networkImage",void 0),H([(0,n.f)()],G.prototype,"caipAddress",void 0),H([(0,n.f)()],G.prototype,"loading",void 0),H([(0,n.f)()],G.prototype,"isSupported",void 0);let Y=class extends G{};Y=H([(0,h.f)("w3m-network-button")],Y);let X=class extends G{};X=H([(0,h.f)("appkit-network-button")],X),e.s(["AppKitNetworkButton",0,X,"W3mNetworkButton",0,Y],619295);var J=t,Q=e.i(401564),Z=e.i(971080),ee=e.i(149454),et=e.i(360334),ei=e.i(221728),eo=e.i(811424);e.i(62238),e.i(907170),e.i(143053);var en=t;e.i(624947);let ea=m.m`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  wui-flex > wui-icon {
    padding: ${({spacing:e})=>e[2]};
    color: ${({tokens:e})=>e.theme.textInvert};
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    border-radius: ${({borderRadius:e})=>e[2]};
    align-items: center;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent020};
    }
  }
`;var er=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let es=class extends en.f{constructor(){super(...arguments),this.label="",this.description="",this.icon="wallet"}render(){return i.c`
      <button>
        <wui-flex gap="2" alignItems="center">
          <wui-icon weight="fill" size="lg" name=${this.icon} color="inherit"></wui-icon>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.label}</wui-text>
            <wui-text variant="md-regular" color="tertiary">${this.description}</wui-text>
          </wui-flex>
        </wui-flex>
        <wui-icon size="lg" color="accent-primary" name="chevronRight"></wui-icon>
      </button>
    `}};es.styles=[f.e,f.j,ea],er([(0,o.f)()],es.prototype,"label",void 0),er([(0,o.f)()],es.prototype,"description",void 0),er([(0,o.f)()],es.prototype,"icon",void 0),es=er([(0,h.f)("wui-notice-card")],es),e.i(249536);var ec=t,el=e.i(758331),ed=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eu=class extends ec.f{constructor(){super(),this.unsubscribe=[],this.socialProvider=el.f.getConnectedSocialProvider(),this.socialUsername=el.f.getConnectedSocialUsername(),this.namespace=c.f.state.activeChain,this.unsubscribe.push(c.f.subscribeKey("activeChain",e=>{this.namespace=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=ee.f.getConnectorId(this.namespace),t=ee.f.getAuthConnector();if(!t||e!==Q.f.CONNECTOR_ID.AUTH)return this.style.cssText="display: none",null;let o=t.provider.getEmail()??"";return o||this.socialUsername?i.c`
      <wui-list-item
        ?rounded=${!0}
        icon=${this.socialProvider??"mail"}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(o,this.socialProvider)}}
      >
        <wui-text variant="lg-regular" color="primary">${this.getAuthName(o)}</wui-text>
      </wui-list-item>
    `:(this.style.cssText="display: none",null)}onGoToUpdateEmail(e,t){t||ei.f.push("UpdateEmailWallet",{email:e,redirectView:"Account"})}getAuthName(e){return this.socialUsername?"discord"===this.socialProvider&&this.socialUsername.endsWith("0")?this.socialUsername.slice(0,-1):this.socialUsername:e.length>30?`${e.slice(0,-3)}...`:e}};ed([(0,n.f)()],eu.prototype,"namespace",void 0),eu=ed([(0,h.f)("w3m-account-auth-button")],eu);var eh=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ep=class extends J.f{constructor(){super(),this.usubscribe=[],this.networkImages=r.f.state.networkImages,this.address=c.f.getAccountData()?.address,this.profileImage=c.f.getAccountData()?.profileImage,this.profileName=c.f.getAccountData()?.profileName,this.network=c.f.state.activeCaipNetwork,this.disconnecting=!1,this.remoteFeatures=u.f.state.remoteFeatures,this.usubscribe.push(c.f.subscribeChainProp("accountState",e=>{e&&(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName)}),c.f.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}),u.f.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.usubscribe.forEach(e=>e())}render(){if(!this.address)throw Error("w3m-account-settings-view: No account provided");let e=this.networkImages[this.network?.assets?.imageId??""];return i.c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["0","5","3","5"]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${(0,a.f)(this.profileImage)}
          size="lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="1" alignItems="center" justifyContent="center">
            <wui-text variant="h5-medium" color="primary" data-testid="account-settings-address">
              ${w.f.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="default"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="4">
        <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            imageSrc=${(0,a.f)(e)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            ?fullSize=${!0}
            ?rounded=${!0}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="lg-regular" color="primary">
              ${this.network?.name??"Unknown"}
            </wui-text>
          </wui-list-item>
          ${this.smartAccountSettingsTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            ?rounded=${!0}
            icon="power"
            iconColor="error"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){let e=this.network?.chainNamespace,t=ee.f.getConnectorId(e),o=ee.f.getAuthConnector();return c.f.checkIfNamesSupported()&&o&&t===Q.f.CONNECTOR_ID.AUTH&&!this.profileName?i.c`
      <wui-list-item
        icon="id"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="lg-regular" color="primary">Choose account name </wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){let e=ee.f.getConnectorId(this.network?.chainNamespace),t=ee.f.getAuthConnector(),{origin:o}=location;return!t||e!==Q.f.CONNECTOR_ID.AUTH||o.includes(et.W.SECURE_SITE)?null:i.c`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){let e=c.f.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,i=e?.find(({id:e})=>e===this.network?.id);return t||!i}onCopyAddress(){try{this.address&&(l.f.copyToClopboard(this.address),eo.f.showSuccess("Address copied"))}catch{eo.f.showError("Failed to copy")}}smartAccountSettingsTemplate(){let e=this.network?.chainNamespace,t=c.f.checkIfSmartAccountEnabled(),o=ee.f.getConnectorId(e);return ee.f.getAuthConnector()&&o===Q.f.CONNECTOR_ID.AUTH&&t?i.c`
      <wui-list-item
        icon="user"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onSmartAccountSettings.bind(this)}
        data-testid="account-smart-account-settings-button"
      >
        <wui-text variant="lg-regular" color="primary">Smart Account Settings</wui-text>
      </wui-list-item>
    `:null}onChooseName(){ei.f.push("ChooseAccountName")}onNetworks(){this.isAllowedNetworkSwitch()&&ei.f.push("Networks")}async onDisconnect(){try{this.disconnecting=!0;let e=this.network?.chainNamespace,t=Z.f.getConnections(e).length>0,i=e&&ee.f.state.activeConnectorIds[e],o=this.remoteFeatures?.multiWallet;await Z.f.disconnect(o?{id:i,namespace:e}:{}),t&&o&&(ei.f.push("ProfileWallets"),eo.f.showSuccess("Wallet deleted"))}catch{B.f.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),eo.f.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onGoToUpgradeView(){B.f.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),ei.f.push("UpgradeEmailWallet")}onSmartAccountSettings(){ei.f.push("SmartAccountSettings")}};eh([(0,n.f)()],ep.prototype,"address",void 0),eh([(0,n.f)()],ep.prototype,"profileImage",void 0),eh([(0,n.f)()],ep.prototype,"profileName",void 0),eh([(0,n.f)()],ep.prototype,"network",void 0),eh([(0,n.f)()],ep.prototype,"disconnecting",void 0),eh([(0,n.f)()],ep.prototype,"remoteFeatures",void 0),ep=eh([(0,h.f)("w3m-account-settings-view")],ep),e.s(["W3mAccountSettingsView",0,ep],269311);var ef=t,ew=t,em=e.i(849694),eg=e.i(564126);e.i(534420),e.i(443452);var eb=t,ey=t;let ev=m.m`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:e})=>e.theme.textPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:e})=>e.theme.textPrimary};
    }
  }
`;var ex=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eC={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},e$={lg:"md",md:"sm",sm:"sm"},ek=class extends ey.f{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return i.c`
      <button data-active=${this.active}>
        ${this.icon?i.c`<wui-icon size=${e$[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${eC[this.size]}> ${this.label} </wui-text>
      </button>
    `}};ek.styles=[f.e,f.j,ev],ex([(0,o.f)()],ek.prototype,"icon",void 0),ex([(0,o.f)()],ek.prototype,"size",void 0),ex([(0,o.f)()],ek.prototype,"label",void 0),ex([(0,o.f)({type:Boolean})],ek.prototype,"active",void 0),ek=ex([(0,h.f)("wui-tab-item")],ek);let eE=m.m`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var eS=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eN=class extends eb.f{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,t)=>{let o=t===this.activeTab;return i.c`
        <wui-tab-item
          @click=${()=>this.onTabClick(t)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${o}
          data-active=${o}
          data-testid="tab-${e.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};eN.styles=[f.e,f.j,eE],eS([(0,o.f)({type:Array})],eN.prototype,"tabs",void 0),eS([(0,o.f)()],eN.prototype,"onTabChange",void 0),eS([(0,o.f)()],eN.prototype,"size",void 0),eS([(0,n.f)()],eN.prototype,"activeTab",void 0),eN=eS([(0,h.f)("wui-tabs")],eN),e.s([],359072),e.i(988016),e.i(604415);var eA=e.i(979484);let eT=m.m`
  wui-icon-link {
    margin-right: calc(${({spacing:e})=>e["8"]} * -1);
  }

  wui-notice-card {
    margin-bottom: ${({spacing:e})=>e["1"]};
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .balance-container {
    display: inline;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .symbol {
    transform: translateY(-2px);
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e["3"]};
    height: 48px;
    padding: ${({spacing:e})=>e["2"]};
    padding-right: ${({spacing:e})=>e["3"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[6]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  .account-button:hover {
    background-color: ${({tokens:e})=>e.core.glass010};
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
  }

  wui-wallet-switch {
    margin-top: ${({spacing:e})=>e["2"]};
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition:
      background-color ${({durations:e})=>e.md}
        ${({easings:e})=>e["ease-out-power-1"]},
      opacity ${({durations:e})=>e.md} ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, opacity;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #667dff;
  }
`;var eR=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eI=class extends ew.f{constructor(){super(),this.unsubscribe=[],this.caipAddress=c.f.getAccountData()?.caipAddress,this.address=l.f.getPlainAddress(c.f.getAccountData()?.caipAddress),this.profileImage=c.f.getAccountData()?.profileImage,this.profileName=c.f.getAccountData()?.profileName,this.disconnecting=!1,this.balance=c.f.getAccountData()?.balance,this.balanceSymbol=c.f.getAccountData()?.balanceSymbol,this.features=u.f.state.features,this.remoteFeatures=u.f.state.remoteFeatures,this.namespace=c.f.state.activeChain,this.activeConnectorIds=ee.f.state.activeConnectorIds,this.unsubscribe.push(c.f.subscribeChainProp("accountState",e=>{this.address=l.f.getPlainAddress(e?.caipAddress),this.caipAddress=e?.caipAddress,this.balance=e?.balance,this.balanceSymbol=e?.balanceSymbol,this.profileName=e?.profileName,this.profileImage=e?.profileImage}),u.f.subscribeKey("features",e=>this.features=e),u.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),ee.f.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),c.f.subscribeKey("activeChain",e=>this.namespace=e),c.f.subscribeKey("activeCaipNetwork",e=>{e?.chainNamespace&&(this.namespace=e?.chainNamespace)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.caipAddress||!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],t=e?ee.f.getConnectorById(e):void 0,o=s.f.getConnectorImage(t),{value:n,decimals:r,symbol:c}=l.f.parseBalance(this.balance,this.balanceSymbol);return i.c`<wui-flex
        flexDirection="column"
        .padding=${["0","5","4","5"]}
        alignItems="center"
        gap="3"
      >
        <wui-avatar
          alt=${(0,a.f)(this.caipAddress)}
          address=${(0,a.f)(l.f.getPlainAddress(this.caipAddress))}
          imageSrc=${(0,a.f)(null===this.profileImage?void 0:this.profileImage)}
          data-testid="single-account-avatar"
        ></wui-avatar>
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          imageSrc=${o}
          alt=${t?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
        <div class="balance-container">
          <wui-text variant="h3-regular" color="primary">${n}</wui-text>
          <wui-text variant="h3-regular" color="secondary">.${r}</wui-text>
          <wui-text variant="h6-medium" color="primary" class="symbol">${c}</wui-text>
        </div>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="2" .padding=${["0","3","3","3"]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          .rounded=${!0}
          icon="power"
          iconColor="error"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          .rightIcon=${!1}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=et.W.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),t=!!this.features?.receive,o=this.remoteFeatures?.onramp&&e,n=em.f.isPayWithExchangeEnabled();return o||t||n?i.c`
      <wui-list-item
        .rounded=${!0}
        data-testid="w3m-account-default-fund-wallet-button"
        iconVariant="blue"
        icon="dollar"
        ?chevron=${!0}
        @click=${this.handleClickFundWallet.bind(this)}
      >
        <wui-text variant="lg-regular" color="primary">Fund wallet</wui-text>
      </wui-list-item>
    `:null}orderedFeaturesTemplate(){return(this.features?.walletFeaturesOrder||et.W.DEFAULT_FEATURES.walletFeaturesOrder).map(e=>{switch(e){case"onramp":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}activityTemplate(){return this.namespace&&this.remoteFeatures?.activity&&et.W.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?i.c` <wui-list-item
          .rounded=${!0}
          icon="clock"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
          data-testid="w3m-account-default-activity-button"
        >
          <wui-text variant="lg-regular" color="primary">Activity</wui-text>
        </wui-list-item>`:null}swapsTemplate(){let e=this.remoteFeatures?.swaps,t=c.f.state.activeChain===Q.f.CHAIN.EVM;return e&&t?i.c`
      <wui-list-item
        .rounded=${!0}
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
        data-testid="w3m-account-default-swaps-button"
      >
        <wui-text variant="lg-regular" color="primary">Swap</wui-text>
      </wui-list-item>
    `:null}sendTemplate(){let e=this.features?.send,t=c.f.state.activeChain;if(!t)throw Error("SendController:sendTemplate - namespace is required");let o=et.W.SEND_SUPPORTED_NAMESPACES.includes(t);return e&&o?i.c`
      <wui-list-item
        .rounded=${!0}
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
        data-testid="w3m-account-default-send-button"
      >
        <wui-text variant="lg-regular" color="primary">Send</wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){let e=c.f.state.activeChain;if(!e)throw Error("AuthCardTemplate:authCardTemplate - namespace is required");let t=ee.f.getConnectorId(e),o=ee.f.getAuthConnector(),{origin:n}=location;return!o||t!==Q.f.CONNECTOR_ID.AUTH||n.includes(et.W.SECURE_SITE)?null:i.c`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleClickFundWallet(){ei.f.push("FundWallet")}handleClickSwap(){ei.f.push("Swap")}handleClickSend(){ei.f.push("WalletSend")}explorerBtnTemplate(){return c.f.getAccountData()?.addressExplorerUrl?i.c`
      <wui-button size="md" variant="accent-primary" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}onTransactions(){B.f.sendEvent({type:"track",event:"CLICK_TRANSACTIONS",properties:{isSmartAccount:(0,eg.P)(c.f.state.activeChain)===eA.P.ACCOUNT_TYPES.SMART_ACCOUNT}}),ei.f.push("Transactions")}async onDisconnect(){try{this.disconnecting=!0;let e=Z.f.getConnections(this.namespace).length>0,t=this.namespace&&ee.f.state.activeConnectorIds[this.namespace],i=this.remoteFeatures?.multiWallet;await Z.f.disconnect(i?{id:t,namespace:this.namespace}:{}),e&&i&&(ei.f.push("ProfileWallets"),eo.f.showSuccess("Wallet deleted"))}catch{B.f.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),eo.f.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onExplorer(){let e=c.f.getAccountData()?.addressExplorerUrl;e&&l.f.openHref(e,"_blank")}onGoToUpgradeView(){B.f.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),ei.f.push("UpgradeEmailWallet")}onGoToProfileWalletsView(){ei.f.push("ProfileWallets")}};eI.styles=eT,eR([(0,n.f)()],eI.prototype,"caipAddress",void 0),eR([(0,n.f)()],eI.prototype,"address",void 0),eR([(0,n.f)()],eI.prototype,"profileImage",void 0),eR([(0,n.f)()],eI.prototype,"profileName",void 0),eR([(0,n.f)()],eI.prototype,"disconnecting",void 0),eR([(0,n.f)()],eI.prototype,"balance",void 0),eR([(0,n.f)()],eI.prototype,"balanceSymbol",void 0),eR([(0,n.f)()],eI.prototype,"features",void 0),eR([(0,n.f)()],eI.prototype,"remoteFeatures",void 0),eR([(0,n.f)()],eI.prototype,"namespace",void 0),eR([(0,n.f)()],eI.prototype,"activeConnectorIds",void 0),eI=eR([(0,h.f)("w3m-account-default-widget")],eI);var eO=t,eP=e.i(770850),eD=t;let ej=m.m`
  span {
    font-weight: 500;
    font-size: 38px;
    color: ${({tokens:e})=>e.theme.textPrimary};
    line-height: 38px;
    letter-spacing: -2%;
    text-align: center;
    font-family: var(--apkt-fontFamily-regular);
  }

  .pennies {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }
`;var eW=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eL=class extends eD.f{constructor(){super(...arguments),this.dollars="0",this.pennies="00"}render(){return i.c`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};eL.styles=[f.e,ej],eW([(0,o.f)()],eL.prototype,"dollars",void 0),eW([(0,o.f)()],eL.prototype,"pennies",void 0),eL=eW([(0,h.f)("wui-balance")],eL);var e_=t;let eU=m.m`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  /* -- Variants --------------------------------------------------------- */
  :host([data-variant='fill']) {
    background-color: ${({colors:e})=>e.neutrals100};
  }

  :host([data-variant='shade']) {
    background-color: ${({colors:e})=>e.neutrals900};
  }

  :host([data-variant='fill']) > wui-text {
    color: ${({colors:e})=>e.black};
  }

  :host([data-variant='shade']) > wui-text {
    color: ${({colors:e})=>e.white};
  }

  :host([data-variant='fill']) > wui-icon {
    color: ${({colors:e})=>e.neutrals100};
  }

  :host([data-variant='shade']) > wui-icon {
    color: ${({colors:e})=>e.neutrals900};
  }

  /* -- Sizes --------------------------------------------------------- */
  :host([data-size='sm']) {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-size='md']) {
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  /* -- Placements --------------------------------------------------------- */
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
`;var ez=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eB={sm:"sm-regular",md:"md-regular"},eF=class extends e_.f{constructor(){super(...arguments),this.placement="top",this.variant="fill",this.size="md",this.message=""}render(){return this.dataset.variant=this.variant,this.dataset.size=this.size,i.c`<wui-icon data-placement=${this.placement} size="inherit" name="cursor"></wui-icon>
      <wui-text variant=${eB[this.size]}>${this.message}</wui-text>`}};eF.styles=[f.e,f.j,eU],ez([(0,o.f)()],eF.prototype,"placement",void 0),ez([(0,o.f)()],eF.prototype,"variant",void 0),ez([(0,o.f)()],eF.prototype,"size",void 0),ez([(0,o.f)()],eF.prototype,"message",void 0),eF=ez([(0,h.f)("wui-tooltip")],eF);var eM=e.i(305840),eV=t;e.i(389676);let eK=E.m`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`,eq=class extends eV.f{render(){return i.c`<w3m-activity-list page="account"></w3m-activity-list>`}};eq.styles=eK,eq=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,h.f)("w3m-account-activity-widget")],eq);var eH=t,eG=t;e.i(630352);let eY=m.m`
  :host {
    width: 100%;
  }

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({spacing:e})=>e[4]};
    padding: ${({spacing:e})=>e[4]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    max-width: 174px;
  }

  .tag-container {
    width: fit-content;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var eX=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eJ=class extends eG.f{constructor(){super(...arguments),this.icon="card",this.text="",this.description="",this.tag=void 0,this.disabled=!1}render(){return i.c`
      <button ?disabled=${this.disabled}>
        <wui-flex alignItems="center" gap="3">
          <wui-icon-box padding="2" color="secondary" icon=${this.icon} size="lg"></wui-icon-box>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.text}</wui-text>
            ${this.description?i.c`<wui-text variant="md-regular" color="secondary">
                  ${this.description}</wui-text
                >`:null}
          </wui-flex>
        </wui-flex>

        <wui-flex class="tag-container" alignItems="center" gap="1" justifyContent="flex-end">
          ${this.tag?i.c`<wui-tag tagType="main" size="sm">${this.tag}</wui-tag>`:null}
          <wui-icon size="md" name="chevronRight" color="default"></wui-icon>
        </wui-flex>
      </button>
    `}};eJ.styles=[f.e,f.j,eY],eX([(0,o.f)()],eJ.prototype,"icon",void 0),eX([(0,o.f)()],eJ.prototype,"text",void 0),eX([(0,o.f)()],eJ.prototype,"description",void 0),eX([(0,o.f)()],eJ.prototype,"tag",void 0),eX([(0,o.f)({type:Boolean})],eJ.prototype,"disabled",void 0),eJ=eX([(0,h.f)("wui-list-description")],eJ),e.i(923838);let eQ=E.m`
  :host {
    width: 100%;
  }

  wui-flex {
    width: 100%;
  }

  .contentContainer {
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }
`;var eZ=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let e0=class extends eH.f{constructor(){super(),this.unsubscribe=[],this.tokenBalance=c.f.getAccountData()?.tokenBalance,this.remoteFeatures=u.f.state.remoteFeatures,this.unsubscribe.push(c.f.subscribeChainProp("accountState",e=>{this.tokenBalance=e?.tokenBalance}),u.f.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c`${this.tokenTemplate()}`}tokenTemplate(){return this.tokenBalance&&this.tokenBalance?.length>0?i.c`<wui-flex class="contentContainer" flexDirection="column" gap="2">
        ${this.tokenItemTemplate()}
      </wui-flex>`:i.c` <wui-flex flexDirection="column">
      ${this.onRampTemplate()}
      <wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Scan the QR code and receive funds"
        icon="qrCode"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="w3m-account-receive-button"
      ></wui-list-description
    ></wui-flex>`}onRampTemplate(){return this.remoteFeatures?.onramp?i.c`<wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="w3m-account-onramp-button"
      ></wui-list-description>`:i.c``}tokenItemTemplate(){return this.tokenBalance?.map(e=>i.c`<wui-list-token
          tokenName=${e.name}
          tokenImageUrl=${e.iconUrl}
          tokenAmount=${e.quantity.numeric}
          tokenValue=${e.value}
          tokenCurrency=${e.symbol}
        ></wui-list-token>`)}onReceiveClick(){ei.f.push("WalletReceive")}onBuyClick(){B.f.sendEvent({type:"track",event:"SELECT_BUY_CRYPTO",properties:{isSmartAccount:(0,eg.P)(c.f.state.activeChain)===eA.P.ACCOUNT_TYPES.SMART_ACCOUNT}}),ei.f.push("OnRampProviders")}};e0.styles=eQ,eZ([(0,n.f)()],e0.prototype,"tokenBalance",void 0),eZ([(0,n.f)()],e0.prototype,"remoteFeatures",void 0),e0=eZ([(0,h.f)("w3m-account-tokens-widget")],e0),e.i(741611),e.i(748449);let e3=m.m`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * ${({spacing:e})=>e["4"]});
  }

  wui-promo + wui-profile-button {
    margin-top: ${({spacing:e})=>e["4"]};
  }

  wui-tabs {
    width: 100%;
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e["3"]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`;var e1=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let e2=class extends eO.f{constructor(){super(...arguments),this.unsubscribe=[],this.network=c.f.state.activeCaipNetwork,this.profileName=c.f.getAccountData()?.profileName,this.address=c.f.getAccountData()?.address,this.currentTab=c.f.getAccountData()?.currentTab,this.tokenBalance=c.f.getAccountData()?.tokenBalance,this.features=u.f.state.features,this.namespace=c.f.state.activeChain,this.activeConnectorIds=ee.f.state.activeConnectorIds,this.remoteFeatures=u.f.state.remoteFeatures}firstUpdated(){c.f.fetchTokenBalance(),this.unsubscribe.push(c.f.subscribeChainProp("accountState",e=>{e?.address?(this.address=e.address,this.profileName=e.profileName,this.currentTab=e.currentTab,this.tokenBalance=e.tokenBalance):d.f.close()}),ee.f.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),c.f.subscribeKey("activeChain",e=>this.namespace=e),c.f.subscribeKey("activeCaipNetwork",e=>this.network=e),u.f.subscribeKey("features",e=>this.features=e),u.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),clearInterval(this.watchTokenBalance)}render(){if(!this.address)throw Error("w3m-account-features-widget: No account provided");if(!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],t=e?ee.f.getConnectorById(e):void 0,{icon:o,iconSize:n}=this.getAuthData();return i.c`<wui-flex
      flexDirection="column"
      .padding=${["0","3","4","3"]}
      alignItems="center"
      gap="4"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center" gap="2">
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          icon=${o}
          iconSize=${n}
          alt=${t?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        ${this.tokenBalanceTemplate()}
      </wui-flex>
      ${this.orderedWalletFeatures()} ${this.tabsTemplate()} ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){let e=this.features?.walletFeaturesOrder||et.W.DEFAULT_FEATURES.walletFeaturesOrder;if(e.every(e=>"send"===e||"receive"===e?!this.features?.[e]:"swaps"!==e&&"onramp"!==e||!this.remoteFeatures?.[e]))return null;let t=[...new Set(e.map(e=>"receive"===e||"onramp"===e?"fund":e))];return i.c`<wui-flex gap="2">
      ${t.map(e=>{switch(e){case"fund":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}
    </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=et.W.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),t=this.features?.receive,o=this.remoteFeatures?.onramp&&e,n=em.f.isPayWithExchangeEnabled();return o||t||n?i.c`
      <w3m-tooltip-trigger text="Fund wallet">
        <wui-button
          data-testid="wallet-features-fund-wallet-button"
          @click=${this.onFundWalletClick.bind(this)}
          variant="accent-secondary"
          size="lg"
          fullWidth
        >
          <wui-icon name="dollar"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `:null}swapsTemplate(){let e=this.remoteFeatures?.swaps,t=c.f.state.activeChain===Q.f.CHAIN.EVM;return e&&t?i.c`
      <w3m-tooltip-trigger text="Swap">
        <wui-button
          fullWidth
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="recycleHorizontal"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `:null}sendTemplate(){let e=this.features?.send,t=c.f.state.activeChain,o=et.W.SEND_SUPPORTED_NAMESPACES.includes(t);return e&&o?i.c`
      <w3m-tooltip-trigger text="Send">
        <wui-button
          fullWidth
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="send"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `:null}watchSwapValues(){this.watchTokenBalance=setInterval(()=>c.f.fetchTokenBalance(e=>this.onTokenBalanceError(e)),1e4)}onTokenBalanceError(e){e instanceof Error&&e.cause instanceof Response&&e.cause.status===Q.f.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}listContentTemplate(){return 0===this.currentTab?i.c`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:1===this.currentTab?i.c`<w3m-account-activity-widget></w3m-account-activity-widget>`:i.c`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){if(this.tokenBalance&&this.tokenBalance?.length>=0){let e=l.f.calculateBalance(this.tokenBalance),{dollars:t="0",pennies:o="00"}=l.f.formatTokenBalance(e);return i.c`<wui-balance dollars=${t} pennies=${o}></wui-balance>`}return i.c`<wui-balance dollars="0" pennies="00"></wui-balance>`}tabsTemplate(){let e=eM.f.getTabsByNamespace(c.f.state.activeChain);return 0===e.length?null:i.c`<wui-tabs
      .onTabChange=${this.onTabChange.bind(this)}
      .activeTab=${this.currentTab}
      .tabs=${e}
    ></wui-tabs>`}onTabChange(e){c.f.setAccountProp("currentTab",e,this.namespace)}onFundWalletClick(){ei.f.push("FundWallet")}onSwapClick(){this.network?.caipNetworkId&&!et.W.SWAP_SUPPORTED_NETWORKS.includes(this.network?.caipNetworkId)?ei.f.push("UnsupportedChain",{swapUnsupportedChain:!0}):(B.f.sendEvent({type:"track",event:"OPEN_SWAP",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:(0,eg.P)(c.f.state.activeChain)===eA.P.ACCOUNT_TYPES.SMART_ACCOUNT}}),ei.f.push("Swap"))}getAuthData(){let e=el.f.getConnectedSocialProvider(),t=el.f.getConnectedSocialUsername(),i=ee.f.getAuthConnector(),o=i?.provider.getEmail()??"";return{name:eP.f.getAuthName({email:o,socialUsername:t,socialProvider:e}),icon:e??"mail",iconSize:e?"xl":"md"}}onGoToProfileWalletsView(){ei.f.push("ProfileWallets")}onSendClick(){B.f.sendEvent({type:"track",event:"OPEN_SEND",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:(0,eg.P)(c.f.state.activeChain)===eA.P.ACCOUNT_TYPES.SMART_ACCOUNT}}),ei.f.push("WalletSend")}};e2.styles=e3,e1([(0,n.f)()],e2.prototype,"watchTokenBalance",void 0),e1([(0,n.f)()],e2.prototype,"network",void 0),e1([(0,n.f)()],e2.prototype,"profileName",void 0),e1([(0,n.f)()],e2.prototype,"address",void 0),e1([(0,n.f)()],e2.prototype,"currentTab",void 0),e1([(0,n.f)()],e2.prototype,"tokenBalance",void 0),e1([(0,n.f)()],e2.prototype,"features",void 0),e1([(0,n.f)()],e2.prototype,"namespace",void 0),e1([(0,n.f)()],e2.prototype,"activeConnectorIds",void 0),e1([(0,n.f)()],e2.prototype,"remoteFeatures",void 0),e2=e1([(0,h.f)("w3m-account-wallet-features-widget")],e2);var e5=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let e4=class extends ef.f{constructor(){super(),this.unsubscribe=[],this.namespace=c.f.state.activeChain,this.unsubscribe.push(c.f.subscribeKey("activeChain",e=>{this.namespace=e}))}render(){if(!this.namespace)return null;let e=ee.f.getConnectorId(this.namespace),t=ee.f.getAuthConnector();return i.c`
      ${t&&e===Q.f.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return i.c`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return i.c`<w3m-account-default-widget></w3m-account-default-widget>`}};e5([(0,n.f)()],e4.prototype,"namespace",void 0),e4=e5([(0,h.f)("w3m-account-view")],e4),e.s(["W3mAccountView",0,e4],979890);var e6=t;e.i(653976);var e8=e.i(293090),e9=e.i(150576),e7=e.i(210087),te=e.i(608601),tt=t;e.i(695553),e.i(720226);let ti=m.m`
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-icon:not(.custom-icon, .icon-badge) {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    border-radius: ${({borderRadius:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:e})=>e["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var to=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tn=class extends tt.f{constructor(){super(...arguments),this.address="",this.profileName="",this.content=[],this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadge=void 0,this.iconBadgeSize="md",this.buttonVariant="neutral-primary",this.enableMoreButton=!1,this.charsStart=4,this.charsEnd=6}render(){return i.c`
      <wui-flex flexDirection="column" rowgap="2">
        ${this.topTemplate()} ${this.bottomTemplate()}
      </wui-flex>
    `}topTemplate(){return i.c`
      <wui-flex alignItems="flex-start" justifyContent="space-between">
        ${this.imageOrIconTemplate()}
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="copy"
          @click=${this.dispatchCopyEvent}
        ></wui-icon-link>
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="externalLink"
          @click=${this.dispatchExternalLinkEvent}
        ></wui-icon-link>
        ${this.enableMoreButton?i.c`<wui-icon-link
              variant="secondary"
              size="md"
              icon="threeDots"
              @click=${this.dispatchMoreButtonEvent}
              data-testid="wui-active-profile-wallet-item-more-button"
            ></wui-icon-link>`:null}
      </wui-flex>
    `}bottomTemplate(){return i.c` <wui-flex flexDirection="column">${this.contentTemplate()}</wui-flex> `}imageOrIconTemplate(){return this.icon?i.c`
        <wui-flex flexGrow="1" alignItems="center">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?i.c`<wui-icon
                  color="accent-primary"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:i.c`
      <wui-flex flexGrow="1" alignItems="center">
        <wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>
      </wui-flex>
    `}contentTemplate(){return 0===this.content.length?null:i.c`
      <wui-flex flexDirection="column" rowgap="3">
        ${this.content.map(e=>this.labelAndTagTemplate(e))}
      </wui-flex>
    `}labelAndTagTemplate({address:e,profileName:t,label:o,description:n,enableButton:a,buttonType:r,buttonLabel:s,buttonVariant:c,tagVariant:l,tagLabel:d,alignItems:u="flex-end"}){return i.c`
      <wui-flex justifyContent="space-between" alignItems=${u} columngap="1">
        <wui-flex flexDirection="column" rowgap="01">
          ${o?i.c`<wui-text variant="sm-medium" color="secondary">${o}</wui-text>`:null}

          <wui-flex alignItems="center" columngap="1">
            <wui-text variant="md-regular" color="primary">
              ${w.f.getTruncateString({string:t||e,charsStart:t?16:this.charsStart,charsEnd:t?0:this.charsEnd,truncate:t?"end":"middle"})}
            </wui-text>

            ${l&&d?i.c`<wui-tag variant=${l} size="sm">${d}</wui-tag>`:null}
          </wui-flex>

          ${n?i.c`<wui-text variant="sm-regular" color="secondary">${n}</wui-text>`:null}
        </wui-flex>

        ${a?this.buttonTemplate({buttonType:r,buttonLabel:s,buttonVariant:c}):null}
      </wui-flex>
    `}buttonTemplate({buttonType:e,buttonLabel:t,buttonVariant:o}){return i.c`
      <wui-button
        size="sm"
        variant=${o}
        @click=${"disconnect"===e?this.dispatchDisconnectEvent.bind(this):this.dispatchSwitchEvent.bind(this)}
        data-testid=${"disconnect"===e?"wui-active-profile-wallet-item-disconnect-button":"wui-active-profile-wallet-item-switch-button"}
      >
        ${t}
      </wui-button>
    `}dispatchDisconnectEvent(){this.dispatchEvent(new CustomEvent("disconnect",{bubbles:!0,composed:!0}))}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("switch",{bubbles:!0,composed:!0}))}dispatchExternalLinkEvent(){this.dispatchEvent(new CustomEvent("externalLink",{bubbles:!0,composed:!0}))}dispatchMoreButtonEvent(){this.dispatchEvent(new CustomEvent("more",{bubbles:!0,composed:!0}))}dispatchCopyEvent(){this.dispatchEvent(new CustomEvent("copy",{bubbles:!0,composed:!0}))}};tn.styles=[f.e,f.j,ti],to([(0,o.f)()],tn.prototype,"address",void 0),to([(0,o.f)()],tn.prototype,"profileName",void 0),to([(0,o.f)({type:Array})],tn.prototype,"content",void 0),to([(0,o.f)()],tn.prototype,"alt",void 0),to([(0,o.f)()],tn.prototype,"imageSrc",void 0),to([(0,o.f)()],tn.prototype,"icon",void 0),to([(0,o.f)()],tn.prototype,"iconSize",void 0),to([(0,o.f)()],tn.prototype,"iconBadge",void 0),to([(0,o.f)()],tn.prototype,"iconBadgeSize",void 0),to([(0,o.f)()],tn.prototype,"buttonVariant",void 0),to([(0,o.f)({type:Boolean})],tn.prototype,"enableMoreButton",void 0),to([(0,o.f)({type:Number})],tn.prototype,"charsStart",void 0),to([(0,o.f)({type:Number})],tn.prototype,"charsEnd",void 0),tn=to([(0,h.f)("wui-active-profile-wallet-item")],tn),e.i(746650);var ta=t;let tr=m.m`
  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  .right-icon {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:e})=>e["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var ts=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tc=class extends ta.f{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.buttonLabel="",this.buttonVariant="accent-primary",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadgeSize="md",this.rightIcon="signOut",this.rightIconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return i.c`
      <wui-flex alignItems="center" columngap="2">
        ${this.imageOrIconTemplate()} ${this.labelAndDescriptionTemplate()}
        ${this.buttonActionTemplate()}
      </wui-flex>
    `}imageOrIconTemplate(){return this.icon?i.c`
        <wui-flex alignItems="center" justifyContent="center" class="icon-box">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?i.c`<wui-icon
                  color="default"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:i.c`<wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>`}labelAndDescriptionTemplate(){return i.c`
      <wui-flex
        flexDirection="column"
        flexGrow="1"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <wui-text variant="lg-regular" color="primary">
          ${w.f.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
        </wui-text>
      </wui-flex>
    `}buttonActionTemplate(){return i.c`
      <wui-flex columngap="1" alignItems="center" justifyContent="center">
        <wui-button
          size="sm"
          variant=${this.buttonVariant}
          .loading=${this.loading}
          @click=${this.handleButtonClick}
          data-testid="wui-inactive-profile-wallet-item-button"
        >
          ${this.buttonLabel}
        </wui-button>

        <wui-icon-link
          variant="secondary"
          size="md"
          icon=${(0,a.f)(this.rightIcon)}
          class="right-icon"
          @click=${this.handleIconClick}
        ></wui-icon-link>
      </wui-flex>
    `}handleButtonClick(){this.dispatchEvent(new CustomEvent("buttonClick",{bubbles:!0,composed:!0}))}handleIconClick(){this.dispatchEvent(new CustomEvent("iconClick",{bubbles:!0,composed:!0}))}};tc.styles=[f.e,f.j,tr],ts([(0,o.f)()],tc.prototype,"address",void 0),ts([(0,o.f)()],tc.prototype,"profileName",void 0),ts([(0,o.f)()],tc.prototype,"alt",void 0),ts([(0,o.f)()],tc.prototype,"buttonLabel",void 0),ts([(0,o.f)()],tc.prototype,"buttonVariant",void 0),ts([(0,o.f)()],tc.prototype,"imageSrc",void 0),ts([(0,o.f)()],tc.prototype,"icon",void 0),ts([(0,o.f)()],tc.prototype,"iconSize",void 0),ts([(0,o.f)()],tc.prototype,"iconBadge",void 0),ts([(0,o.f)()],tc.prototype,"iconBadgeSize",void 0),ts([(0,o.f)()],tc.prototype,"rightIcon",void 0),ts([(0,o.f)()],tc.prototype,"rightIconSize",void 0),ts([(0,o.f)({type:Boolean})],tc.prototype,"loading",void 0),ts([(0,o.f)({type:Number})],tc.prototype,"charsStart",void 0),ts([(0,o.f)({type:Number})],tc.prototype,"charsEnd",void 0),tc=ts([(0,h.f)("wui-inactive-profile-wallet-item")],tc),e.i(79929);var tl=e.i(769718);let td={getAuthData(e){let t=e.connectorId===Q.f.CONNECTOR_ID.AUTH;if(!t)return{isAuth:!1,icon:void 0,iconSize:void 0,name:void 0};let i=e?.auth?.name??el.f.getConnectedSocialProvider(),o=e?.auth?.username??el.f.getConnectedSocialUsername(),n=ee.f.getAuthConnector(),a=n?.provider.getEmail()??"";return{isAuth:!0,icon:i??"mail",iconSize:i?"xl":"md",name:t?eP.f.getAuthName({email:a,socialUsername:o,socialProvider:i}):void 0}}},tu=m.m`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
  }

  .balance-amount {
    flex: 1;
  }

  .wallet-list {
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: opacity;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
      black 40px,
      black calc(100% - 40px),
      rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
    );
  }

  .active-wallets {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["4"]};
  }

  .active-wallets-box {
    height: 330px;
  }

  .empty-wallet-list-box {
    height: 400px;
  }

  .empty-box {
    width: 100%;
    padding: ${({spacing:e})=>e["4"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["4"]};
  }

  wui-separator {
    margin: ${({spacing:e})=>e["2"]} 0 ${({spacing:e})=>e["2"]} 0;
  }

  .active-connection {
    padding: ${({spacing:e})=>e["2"]};
  }

  .recent-connection {
    padding: ${({spacing:e})=>e["2"]} 0 ${({spacing:e})=>e["2"]} 0;
  }

  @media (max-width: 430px) {
    .active-wallets-box,
    .empty-wallet-list-box {
      height: auto;
      max-height: clamp(360px, 470px, 80vh);
    }
  }
`;var th=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tp=4,tf=6,tw="md",tm="lightbulb",tg=[0,1],tb={eip155:"ethereum",solana:"solana",bip122:"bitcoin",ton:"ton",tron:"tron"},ty=[{namespace:"eip155",icon:tb.eip155,label:"EVM"},{namespace:"solana",icon:tb.solana,label:"Solana"},{namespace:"bip122",icon:tb.bip122,label:"Bitcoin"},{namespace:"ton",icon:tb.ton,label:"Ton"},{namespace:"tron",icon:tb.tron,label:"Tron"}],tv={eip155:{title:"Add EVM Wallet",description:"Add your first EVM wallet"},solana:{title:"Add Solana Wallet",description:"Add your first Solana wallet"},bip122:{title:"Add Bitcoin Wallet",description:"Add your first Bitcoin wallet"},ton:{title:"Add TON Wallet",description:"Add your first TON wallet"},tron:{title:"Add TRON Wallet",description:"Add your first TRON wallet"}},tx=class extends e6.f{constructor(){super(),this.unsubscribers=[],this.currentTab=0,this.namespace=c.f.state.activeChain,this.namespaces=Array.from(c.f.state.chains.keys()),this.caipAddress=void 0,this.profileName=void 0,this.activeConnectorIds=ee.f.state.activeConnectorIds,this.lastSelectedAddress="",this.lastSelectedConnectorId="",this.isSwitching=!1,this.caipNetwork=c.f.state.activeCaipNetwork,this.user=c.f.getAccountData()?.user,this.remoteFeatures=u.f.state.remoteFeatures,this.currentTab=this.namespace?this.namespaces.indexOf(this.namespace):0,this.caipAddress=c.f.getAccountData(this.namespace)?.caipAddress,this.profileName=c.f.getAccountData(this.namespace)?.profileName,this.unsubscribers.push(Z.f.subscribeKey("connections",()=>this.onConnectionsChange()),Z.f.subscribeKey("recentConnections",()=>this.requestUpdate()),ee.f.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),c.f.subscribeKey("activeCaipNetwork",e=>this.caipNetwork=e),c.f.subscribeChainProp("accountState",e=>{this.user=e?.user}),u.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.chainListener=c.f.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName},this.namespace)}disconnectedCallback(){this.unsubscribers.forEach(e=>e()),this.resizeObserver?.disconnect(),this.removeScrollListener(),this.chainListener?.()}firstUpdated(){let e=this.shadowRoot?.querySelector(".wallet-list");if(!e)return;let t=()=>this.updateScrollOpacity(e);requestAnimationFrame(t),e.addEventListener("scroll",t),this.resizeObserver=new ResizeObserver(t),this.resizeObserver.observe(e),t()}render(){let e=this.namespace;if(!e)throw Error("Namespace is not set");return i.c`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="4">
        ${this.renderTabs()} ${this.renderHeader(e)} ${this.renderConnections(e)}
        ${this.renderAddConnectionButton(e)}
      </wui-flex>
    `}renderTabs(){let e=this.namespaces.map(e=>ty.find(t=>t.namespace===e)).filter(Boolean);return e.length>1?i.c`
        <wui-tabs
          .onTabChange=${e=>this.handleTabChange(e)}
          .activeTab=${this.currentTab}
          .tabs=${e}
        ></wui-tabs>
      `:null}renderHeader(e){let t=this.getActiveConnections(e).flatMap(({accounts:e})=>e).length+ +!!this.caipAddress;return i.c`
      <wui-flex alignItems="center" columngap="1">
        <wui-icon
          size="sm"
          name=${tb[e]??tb.eip155}
        ></wui-icon>
        <wui-text color="secondary" variant="lg-regular"
          >${t>1?"Wallets":"Wallet"}</wui-text
        >
        <wui-text
          color="primary"
          variant="lg-regular"
          class="balance-amount"
          data-testid="balance-amount"
        >
          ${t}
        </wui-text>
        <wui-link
          color="secondary"
          variant="secondary"
          @click=${()=>Z.f.disconnect({namespace:e})}
          ?disabled=${!this.hasAnyConnections(e)}
          data-testid="disconnect-all-button"
        >
          Disconnect All
        </wui-link>
      </wui-flex>
    `}renderConnections(e){let t=this.hasAnyConnections(e);return i.c`
      <wui-flex flexDirection="column" class=${(0,e8.f)({"wallet-list":!0,"active-wallets-box":t,"empty-wallet-list-box":!t})} rowgap="3">
        ${t?this.renderActiveConnections(e):this.renderEmptyState(e)}
      </wui-flex>
    `}renderActiveConnections(e){let t=this.getActiveConnections(e),o=this.activeConnectorIds[e],n=this.getPlainAddress();return i.c`
      ${n||o||t.length>0?i.c`<wui-flex
            flexDirection="column"
            .padding=${["4","0","4","0"]}
            class="active-wallets"
          >
            ${this.renderActiveProfile(e)} ${this.renderActiveConnectionsList(e)}
          </wui-flex>`:null}
      ${this.renderRecentConnections(e)}
    `}renderActiveProfile(e){let t=this.activeConnectorIds[e];if(!t)return null;let{connections:o}=e7.f.getConnectionsData(e),n=ee.f.getConnectorById(t),a=s.f.getConnectorImage(n),r=this.getPlainAddress();if(!r)return null;let c=e===Q.f.CHAIN.BITCOIN,l=td.getAuthData({connectorId:t,accounts:[]}),d=this.getActiveConnections(e).flatMap(e=>e.accounts).length>0,u=o.find(e=>e.connectorId===t),h=u?.accounts.filter(e=>!tl.f.isLowerCaseMatch(e.address,r));return i.c`
      <wui-flex flexDirection="column" .padding=${["0","4","0","4"]}>
        <wui-active-profile-wallet-item
          address=${r}
          alt=${n?.name}
          .content=${this.getProfileContent({address:r,connections:o,connectorId:t,namespace:e})}
          .charsStart=${tp}
          .charsEnd=${tf}
          .icon=${l.icon}
          .iconSize=${l.iconSize}
          .iconBadge=${this.isSmartAccount(r)?tm:void 0}
          .iconBadgeSize=${this.isSmartAccount(r)?tw:void 0}
          imageSrc=${a}
          ?enableMoreButton=${l.isAuth}
          @copy=${()=>this.handleCopyAddress(r)}
          @disconnect=${()=>this.handleDisconnect(e,t)}
          @switch=${()=>{c&&u&&h?.[0]&&this.handleSwitchWallet(u,h[0].address,e)}}
          @externalLink=${()=>this.handleExternalLink(r)}
          @more=${()=>this.handleMore()}
          data-testid="wui-active-profile-wallet-item"
        ></wui-active-profile-wallet-item>
        ${d?i.c`<wui-separator></wui-separator>`:null}
      </wui-flex>
    `}renderActiveConnectionsList(e){let t=this.getActiveConnections(e);return 0===t.length?null:i.c`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
        ${this.renderConnectionList(t,!1,e)}
      </wui-flex>
    `}renderRecentConnections(e){let{recentConnections:t}=e7.f.getConnectionsData(e);return 0===t.flatMap(e=>e.accounts).length?null:i.c`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]} rowGap="2">
        <wui-text color="secondary" variant="sm-medium" data-testid="recently-connected-text"
          >RECENTLY CONNECTED</wui-text
        >
        <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
          ${this.renderConnectionList(t,!0,e)}
        </wui-flex>
      </wui-flex>
    `}renderConnectionList(e,t,o){return e.filter(e=>e.accounts.length>0).map((e,n)=>{let a=ee.f.getConnectorById(e.connectorId),r=s.f.getConnectorImage(a)??"",c=td.getAuthData(e);return e.accounts.map((a,s)=>{let l=this.isAccountLoading(e.connectorId,a.address);return i.c`
            <wui-flex flexDirection="column">
              ${0!==n||0!==s?i.c`<wui-separator></wui-separator>`:null}
              <wui-inactive-profile-wallet-item
                address=${a.address}
                alt=${e.connectorId}
                buttonLabel=${t?"Connect":"Switch"}
                buttonVariant=${t?"neutral-secondary":"accent-secondary"}
                rightIcon=${t?"bin":"power"}
                rightIconSize="sm"
                class=${t?"recent-connection":"active-connection"}
                data-testid=${t?"recent-connection":"active-connection"}
                imageSrc=${r}
                .iconBadge=${this.isSmartAccount(a.address)?tm:void 0}
                .iconBadgeSize=${this.isSmartAccount(a.address)?tw:void 0}
                .icon=${c.icon}
                .iconSize=${c.iconSize}
                .loading=${l}
                .showBalance=${!1}
                .charsStart=${tp}
                .charsEnd=${tf}
                @buttonClick=${()=>this.handleSwitchWallet(e,a.address,o)}
                @iconClick=${()=>this.handleWalletAction({connection:e,address:a.address,isRecentConnection:t,namespace:o})}
              ></wui-inactive-profile-wallet-item>
            </wui-flex>
          `})})}renderAddConnectionButton(e){if(!this.isMultiWalletEnabled()&&this.caipAddress||!this.hasAnyConnections(e))return null;let{title:t}=this.getChainLabelInfo(e);return i.c`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="plus"
        iconSize="sm"
        ?chevron=${!0}
        @click=${()=>this.handleAddConnection(e)}
        data-testid="add-connection-button"
      >
        <wui-text variant="md-medium" color="secondary">${t}</wui-text>
      </wui-list-item>
    `}renderEmptyState(e){let{title:t,description:o}=this.getChainLabelInfo(e);return i.c`
      <wui-flex alignItems="flex-start" class="empty-template" data-testid="empty-template">
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowgap="3"
          class="empty-box"
        >
          <wui-icon-box size="xl" icon="wallet" color="secondary"></wui-icon-box>

          <wui-flex flexDirection="column" alignItems="center" justifyContent="center" gap="1">
            <wui-text color="primary" variant="lg-regular" data-testid="empty-state-text"
              >No wallet connected</wui-text
            >
            <wui-text color="secondary" variant="md-regular" data-testid="empty-state-description"
              >${o}</wui-text
            >
          </wui-flex>

          <wui-link
            @click=${()=>this.handleAddConnection(e)}
            data-testid="empty-state-button"
            icon="plus"
          >
            ${t}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}handleTabChange(e){let t=this.namespaces[e];t&&(this.chainListener?.(),this.currentTab=this.namespaces.indexOf(t),this.namespace=t,this.caipAddress=c.f.getAccountData(t)?.caipAddress,this.profileName=c.f.getAccountData(t)?.profileName,this.chainListener=c.f.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},t))}async handleSwitchWallet(e,t,i){try{this.isSwitching=!0,this.lastSelectedConnectorId=e.connectorId,this.lastSelectedAddress=t,this.caipNetwork?.chainNamespace!==i&&e?.caipNetwork&&(ee.f.setFilterByNamespace(i),await c.f.switchActiveNetwork(e?.caipNetwork)),await Z.f.switchConnection({connection:e,address:t,namespace:i,closeModalOnConnect:!1,onChange({hasSwitchedAccount:e,hasSwitchedWallet:t}){t?eo.f.showSuccess("Wallet switched"):e&&eo.f.showSuccess("Account switched")}})}catch(e){eo.f.showError("Failed to switch wallet")}finally{this.isSwitching=!1}}handleWalletAction(e){let{connection:t,address:i,isRecentConnection:o,namespace:n}=e;o?(el.f.deleteAddressFromConnection({connectorId:t.connectorId,address:i,namespace:n}),Z.f.syncStorageConnections(),eo.f.showSuccess("Wallet deleted")):this.handleDisconnect(n,t.connectorId)}async handleDisconnect(e,t){try{await Z.f.disconnect({id:t,namespace:e}),eo.f.showSuccess("Wallet disconnected")}catch{eo.f.showError("Failed to disconnect wallet")}}handleCopyAddress(e){l.f.copyToClopboard(e),eo.f.showSuccess("Address copied")}handleMore(){ei.f.push("AccountSettings")}handleExternalLink(e){let t=this.caipNetwork?.blockExplorers?.default.url;t&&l.f.openHref(`${t}/address/${e}`,"_blank")}handleAddConnection(e){ee.f.setFilterByNamespace(e),ei.f.push("Connect",{addWalletForNamespace:e})}getChainLabelInfo(e){return tv[e]??{title:"Add Wallet",description:"Add your first wallet"}}isSmartAccount(e){if(!this.namespace)return!1;let t=this.user?.accounts?.find(e=>"smartAccount"===e.type);return!!t&&!!e&&tl.f.isLowerCaseMatch(t.address,e)}getPlainAddress(){return this.caipAddress?l.f.getPlainAddress(this.caipAddress):void 0}getActiveConnections(e){let t=this.activeConnectorIds[e],{connections:i}=e7.f.getConnectionsData(e),[o]=i.filter(e=>tl.f.isLowerCaseMatch(e.connectorId,t));if(!t)return i;let n=e===Q.f.CHAIN.BITCOIN,{address:a}=this.caipAddress?e9.f.parseCaipAddress(this.caipAddress):{},r=[...a?[a]:[]];return n&&o&&(r=o.accounts.map(e=>e.address)||[]),e7.f.excludeConnectorAddressFromConnections({connectorId:t,addresses:r,connections:i})}hasAnyConnections(e){let t=this.getActiveConnections(e),{recentConnections:i}=e7.f.getConnectionsData(e);return!!this.caipAddress||t.length>0||i.length>0}isAccountLoading(e,t){return tl.f.isLowerCaseMatch(this.lastSelectedConnectorId,e)&&tl.f.isLowerCaseMatch(this.lastSelectedAddress,t)&&this.isSwitching}getProfileContent(e){let{address:t,connections:i,connectorId:o,namespace:n}=e,[a]=i.filter(e=>tl.f.isLowerCaseMatch(e.connectorId,o));if(n===Q.f.CHAIN.BITCOIN&&a?.accounts.every(e=>"string"==typeof e.type))return this.getBitcoinProfileContent(a.accounts,t);let r=td.getAuthData({connectorId:o,accounts:[]});return[{address:t,tagLabel:"Active",tagVariant:"success",enableButton:!0,profileName:this.profileName,buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary",...r.isAuth?{description:this.isSmartAccount(t)?"Smart Account":"EOA Account"}:{}}]}getBitcoinProfileContent(e,t){let i=e.length>1,o=this.getPlainAddress();return e.map(e=>{let n=tl.f.isLowerCaseMatch(e.address,o),a="PAYMENT";return"ordinal"===e.type&&(a="ORDINALS"),{address:e.address,tagLabel:tl.f.isLowerCaseMatch(e.address,t)?"Active":void 0,tagVariant:tl.f.isLowerCaseMatch(e.address,t)?"success":void 0,enableButton:!0,...i?{label:a,alignItems:"flex-end",buttonType:n?"disconnect":"switch",buttonLabel:n?"Disconnect":"Switch",buttonVariant:n?"neutral-secondary":"accent-secondary"}:{alignItems:"center",buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary"}}})}removeScrollListener(){let e=this.shadowRoot?.querySelector(".wallet-list");e&&e.removeEventListener("scroll",()=>this.handleConnectListScroll())}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(".wallet-list");e&&this.updateScrollOpacity(e)}isMultiWalletEnabled(){return!!this.remoteFeatures?.multiWallet}updateScrollOpacity(e){e.style.setProperty("--connect-scroll--top-opacity",te.f.interpolate([0,50],tg,e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",te.f.interpolate([0,50],tg,e.scrollHeight-e.scrollTop-e.offsetHeight).toString())}onConnectionsChange(){if(this.isMultiWalletEnabled()&&this.namespace){let{connections:e}=e7.f.getConnectionsData(this.namespace);0===e.length&&ei.f.reset("ProfileWallets")}this.requestUpdate()}};tx.styles=tu,th([(0,n.f)()],tx.prototype,"currentTab",void 0),th([(0,n.f)()],tx.prototype,"namespace",void 0),th([(0,n.f)()],tx.prototype,"namespaces",void 0),th([(0,n.f)()],tx.prototype,"caipAddress",void 0),th([(0,n.f)()],tx.prototype,"profileName",void 0),th([(0,n.f)()],tx.prototype,"activeConnectorIds",void 0),th([(0,n.f)()],tx.prototype,"lastSelectedAddress",void 0),th([(0,n.f)()],tx.prototype,"lastSelectedConnectorId",void 0),th([(0,n.f)()],tx.prototype,"isSwitching",void 0),th([(0,n.f)()],tx.prototype,"caipNetwork",void 0),th([(0,n.f)()],tx.prototype,"user",void 0),th([(0,n.f)()],tx.prototype,"remoteFeatures",void 0),tx=th([(0,h.f)("w3m-profile-wallets-view")],tx),e.s(["W3mProfileWalletsView",0,tx],674950);var tC=t,t$=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tk=class extends tC.f{constructor(){super(),this.unsubscribe=[],this.activeCaipNetwork=c.f.state.activeCaipNetwork,this.features=u.f.state.features,this.remoteFeatures=u.f.state.remoteFeatures,this.exchangesLoading=em.f.state.isLoading,this.exchanges=em.f.state.exchanges,this.unsubscribe.push(u.f.subscribeKey("features",e=>this.features=e),u.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),c.f.subscribeKey("activeCaipNetwork",e=>{this.activeCaipNetwork=e,this.setDefaultPaymentAsset()}),em.f.subscribeKey("isLoading",e=>this.exchangesLoading=e),em.f.subscribeKey("exchanges",e=>this.exchanges=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}async firstUpdated(){em.f.isPayWithExchangeSupported()&&(await this.setDefaultPaymentAsset(),await em.f.fetchExchanges())}render(){return i.c`
      <wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="2">
        ${this.onrampTemplate()} ${this.receiveTemplate()} ${this.depositFromExchangeTemplate()}
      </wui-flex>
    `}async setDefaultPaymentAsset(){if(!this.activeCaipNetwork)return;let e=await em.f.getAssetsForNetwork(this.activeCaipNetwork.caipNetworkId),t=e.find(e=>"USDC"===e.metadata.symbol)||e[0];t&&em.f.setPaymentAsset(t)}onrampTemplate(){if(!this.activeCaipNetwork)return null;let e=this.remoteFeatures?.onramp,t=et.W.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.activeCaipNetwork.chainNamespace);return e&&t?i.c`
      <wui-list-item
        @click=${this.onBuyCrypto.bind(this)}
        icon="card"
        data-testid="wallet-features-onramp-button"
      >
        <wui-text variant="lg-regular" color="primary">Buy crypto</wui-text>
      </wui-list-item>
    `:null}depositFromExchangeTemplate(){return this.activeCaipNetwork&&em.f.isPayWithExchangeSupported()?i.c`
      <wui-list-item
        @click=${this.onDepositFromExchange.bind(this)}
        icon="arrowBottomCircle"
        data-testid="wallet-features-deposit-from-exchange-button"
        ?loading=${this.exchangesLoading}
        ?disabled=${this.exchangesLoading||!this.exchanges.length}
      >
        <wui-text variant="lg-regular" color="primary">Deposit from exchange</wui-text>
      </wui-list-item>
    `:null}receiveTemplate(){return this.features?.receive?i.c`
      <wui-list-item
        @click=${this.onReceive.bind(this)}
        icon="qrCode"
        data-testid="wallet-features-receive-button"
      >
        <wui-text variant="lg-regular" color="primary">Receive funds</wui-text>
      </wui-list-item>
    `:null}onBuyCrypto(){ei.f.push("OnRampProviders")}onReceive(){ei.f.push("WalletReceive")}onDepositFromExchange(){em.f.reset(),ei.f.push("PayWithExchange",{redirectView:ei.f.state.data?.redirectView})}};t$([(0,n.f)()],tk.prototype,"activeCaipNetwork",void 0),t$([(0,n.f)()],tk.prototype,"features",void 0),t$([(0,n.f)()],tk.prototype,"remoteFeatures",void 0),t$([(0,n.f)()],tk.prototype,"exchangesLoading",void 0),t$([(0,n.f)()],tk.prototype,"exchanges",void 0),tk=t$([(0,h.f)("w3m-fund-wallet-view")],tk),e.s(["W3mFundWalletView",0,tk],107337);var tE=t,tS=t,tN=t;e.i(684326);var tA=e.i(765090);let tT=m.m`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({colors:e})=>e.neutrals300};
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:e})=>e.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    background-color: ${({tokens:e})=>e.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:e})=>e.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:e})=>e.theme.textTertiary};
  }
`;var tR=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tI=class extends tN.f{constructor(){super(...arguments),this.inputElementRef=(0,tA.J)(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return i.c`
      <label data-size=${this.size}>
        <input
          ${(0,tA.C)(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};tI.styles=[f.e,f.j,tT],tR([(0,o.f)({type:Boolean})],tI.prototype,"checked",void 0),tR([(0,o.f)({type:Boolean})],tI.prototype,"disabled",void 0),tR([(0,o.f)()],tI.prototype,"size",void 0),tI=tR([(0,h.f)("wui-toggle")],tI);let tO=m.m`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["3"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["4"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var tP=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tD=class extends tS.f{constructor(){super(...arguments),this.checked=!1}render(){return i.c`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};tD.styles=[f.e,f.j,tO],tP([(0,o.f)({type:Boolean})],tD.prototype,"checked",void 0),tD=tP([(0,h.f)("wui-certified-switch")],tD);var tj=t;e.i(835902);let tW=m.m`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:e})=>e[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }
`;var tL=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let t_=class extends tj.f{constructor(){super(...arguments),this.inputComponentRef=(0,tA.J)(),this.inputValue=""}render(){return i.c`
      <wui-input-text
        ${(0,tA.C)(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?i.c`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(e){this.inputValue=e.detail||""}clearValue(){let e=this.inputComponentRef.value,t=e?.inputElementRef.value;t&&(t.value="",this.inputValue="",t.focus(),t.dispatchEvent(new Event("input")))}};t_.styles=[f.e,tW],tL([(0,o.f)()],t_.prototype,"inputValue",void 0),t_=tL([(0,h.f)("wui-search-bar")],t_);var tU=t,tz=e.i(886259),tB=e.i(197730),tF=t,tM=e.i(252157);e.i(864576);let tV=m.m`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:e})=>e.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var tK=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tq=class extends tF.f{constructor(){super(...arguments),this.type="wallet"}render(){return i.c`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?i.c` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${tM.f}`:i.c`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};tq.styles=[f.e,f.j,tV],tK([(0,o.f)()],tq.prototype,"type",void 0),tq=tK([(0,h.f)("wui-card-select-loader")],tq);var tH=t;let tG=E.m`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var tY=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tX=class extends tH.f{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&w.f.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&w.f.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&w.f.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&w.f.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&w.f.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&w.f.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&w.f.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&w.f.getSpacingStyles(this.margin,3)};
    `,i.c`<slot></slot>`}};tX.styles=[f.e,tG],tY([(0,o.f)()],tX.prototype,"gridTemplateRows",void 0),tY([(0,o.f)()],tX.prototype,"gridTemplateColumns",void 0),tY([(0,o.f)()],tX.prototype,"justifyItems",void 0),tY([(0,o.f)()],tX.prototype,"alignItems",void 0),tY([(0,o.f)()],tX.prototype,"justifyContent",void 0),tY([(0,o.f)()],tX.prototype,"alignContent",void 0),tY([(0,o.f)()],tX.prototype,"columnGap",void 0),tY([(0,o.f)()],tX.prototype,"rowGap",void 0),tY([(0,o.f)()],tX.prototype,"gap",void 0),tY([(0,o.f)()],tX.prototype,"padding",void 0),tY([(0,o.f)()],tX.prototype,"margin",void 0),tX=tY([(0,h.f)("wui-grid")],tX);var tJ=t;e.i(780313),e.i(956303);let tQ=m.m`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["0"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:e})=>e["4"]}, 20px);
    transition:
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:e})=>e.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:e})=>e.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:e})=>e.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:e})=>e.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var tZ=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let t0=class extends tJ.f{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let e=this.wallet?.badge_type==="certified";return i.c`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${(0,a.f)(e?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?i.c`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return(this.visible||this.imageSrc)&&!this.imageLoading?i.c`
      <wui-wallet-image
        size="lg"
        imageSrc=${(0,a.f)(this.imageSrc)}
        name=${(0,a.f)(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `:this.shimmerTemplate()}shimmerTemplate(){return i.c`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){!this.wallet||(this.imageSrc=s.f.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await s.f.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){this.wallet&&!this.isImpressed&&(this.isImpressed=!0,B.f.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:ei.f.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};t0.styles=tQ,tZ([(0,n.f)()],t0.prototype,"visible",void 0),tZ([(0,n.f)()],t0.prototype,"imageSrc",void 0),tZ([(0,n.f)()],t0.prototype,"imageLoading",void 0),tZ([(0,n.f)()],t0.prototype,"isImpressed",void 0),tZ([(0,o.f)()],t0.prototype,"explorerId",void 0),tZ([(0,o.f)()],t0.prototype,"walletQuery",void 0),tZ([(0,o.f)()],t0.prototype,"certified",void 0),tZ([(0,o.f)()],t0.prototype,"displayIndex",void 0),tZ([(0,o.f)({type:Object})],t0.prototype,"wallet",void 0),t0=tZ([(0,h.f)("w3m-all-wallets-list-item")],t0);let t3=m.m`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-inout-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:e})=>e["4"]};
    padding-bottom: ${({spacing:e})=>e["4"]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var t1=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let t2="local-paginator",t5=class extends tU.f{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!tz.f.state.wallets.length,this.wallets=tz.f.state.wallets,this.mobileFullScreen=u.f.state.enableMobileFullScreen,this.unsubscribe.push(tz.f.subscribeKey("wallets",e=>this.wallets=e))}firstUpdated(){this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.paginationObserver?.disconnect()}render(){return i.c`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let e=this.shadowRoot?.querySelector("wui-grid");e&&(await tz.f.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,t){return[...Array(e)].map(()=>i.c`
        <wui-card-select-loader type="wallet" id=${(0,a.f)(t)}></wui-card-select-loader>
      `)}walletsTemplate(){return tB.f.getWalletConnectWallets(this.wallets).map((e,t)=>i.c`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${e.id}"
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
          explorerId=${e.id}
          certified=${"certified"===this.badge}
          displayIndex=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:e,recommended:t,featured:i,count:o,mobileFilteredOutWalletsLength:n}=tz.f.state,a=window.innerWidth<352?3:4,r=e.length+t.length,s=Math.ceil(r/a)*a-r+a;return(s-=e.length?i.length%a:0,0===o&&i.length>0)?null:0===o||[...i,...e,...t].length<o-(n??0)?this.shimmerTemplate(s,t2):null}createPaginationObserver(){let e=this.shadowRoot?.querySelector(`#${t2}`);e&&(this.paginationObserver=new IntersectionObserver(([e])=>{if(e?.isIntersecting&&!this.loading){let{page:e,count:t,wallets:i}=tz.f.state;i.length<t&&tz.f.fetchWalletsByPage({page:e+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){ee.f.selectWalletConnector(e)}};t5.styles=t3,t1([(0,n.f)()],t5.prototype,"loading",void 0),t1([(0,n.f)()],t5.prototype,"wallets",void 0),t1([(0,n.f)()],t5.prototype,"badge",void 0),t1([(0,n.f)()],t5.prototype,"mobileFullScreen",void 0),t5=t1([(0,h.f)("w3m-all-wallets-list")],t5);var t4=t;e.i(421147);let t6=E.m`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var t8=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let t9=class extends t4.f{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=u.f.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?i.c`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await tz.f.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:e}=tz.f.state,t=tB.f.markWalletsAsInstalled(e),o=tB.f.filterWalletsByWcSupport(t);return o.length?i.c`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${o.map((e,t)=>i.c`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(e)}
              .wallet=${e}
              data-testid="wallet-search-item-${e.id}"
              explorerId=${e.id}
              certified=${"certified"===this.badge}
              walletQuery=${this.query}
              displayIndex=${t}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:i.c`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){ee.f.selectWalletConnector(e)}};t9.styles=t6,t8([(0,n.f)()],t9.prototype,"loading",void 0),t8([(0,n.f)()],t9.prototype,"mobileFullScreen",void 0),t8([(0,o.f)()],t9.prototype,"query",void 0),t8([(0,o.f)()],t9.prototype,"badge",void 0),t9=t8([(0,h.f)("w3m-all-wallets-search")],t9);var t7=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ie=class extends tE.f{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=l.f.debounce(e=>{this.search=e})}render(){let e=this.search.length>=2;return i.c`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${"certified"===this.badge}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?i.c`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:i.c`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(e){e.detail?(this.badge="certified",eo.f.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return l.f.isMobile()?i.c`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){ei.f.push("ConnectingWalletConnect")}};t7([(0,n.f)()],ie.prototype,"search",void 0),t7([(0,n.f)()],ie.prototype,"badge",void 0),ie=t7([(0,h.f)("w3m-all-wallets-view")],ie),e.s(["W3mAllWalletsView",0,ie],210149);var it=t,ii=e.i(455587),io=t;let ia=m.m`
  button {
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[4]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    justify-content: center;
    align-items: center;
  }

  :host([data-size='sm']) button {
    padding: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-size='md']) button {
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button:disabled {
    opacity: 0.5;
  }
`;var ir=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let is=class extends io.f{constructor(){super(...arguments),this.text="",this.disabled=!1,this.size="lg",this.icon="copy",this.tabIdx=void 0}render(){this.dataset.size=this.size;let e=`${this.size}-regular`;return i.c`
      <button ?disabled=${this.disabled} tabindex=${(0,a.f)(this.tabIdx)}>
        <wui-icon name=${this.icon} size=${this.size} color="default"></wui-icon>
        <wui-text align="center" variant=${e} color="primary">${this.text}</wui-text>
      </button>
    `}};is.styles=[f.e,f.j,ia],ir([(0,o.f)()],is.prototype,"text",void 0),ir([(0,o.f)({type:Boolean})],is.prototype,"disabled",void 0),ir([(0,o.f)()],is.prototype,"size",void 0),ir([(0,o.f)()],is.prototype,"icon",void 0),ir([(0,o.f)()],is.prototype,"tabIdx",void 0),is=ir([(0,h.f)("wui-list-button")],is),e.i(803596);var ic=e.i(16555),il=t,id=e.i(851887);e.i(39299);var iu=e.i(535568);let ih=m.m`
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }

  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }

  wui-icon-link,
  wui-loading-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  wui-icon-link {
    right: ${({spacing:e})=>e["2"]};
  }

  wui-loading-spinner {
    right: ${({spacing:e})=>e["3"]};
  }

  wui-text {
    margin: ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["3"]}
      ${({spacing:e})=>e["0"]} ${({spacing:e})=>e["3"]};
  }
`;var ip=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let iw=class extends il.f{constructor(){super(),this.unsubscribe=[],this.formRef=(0,tA.J)(),this.email="",this.loading=!1,this.error="",this.remoteFeatures=u.f.state.remoteFeatures,this.hasExceededUsageLimit=tz.f.state.plan.hasExceededUsageLimit,this.unsubscribe.push(u.f.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}),tz.f.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.formRef.value?.addEventListener("keydown",e=>{"Enter"===e.key&&this.onSubmitEmail(e)})}render(){let e=Z.f.hasAnyConnection(Q.f.CONNECTOR_ID.AUTH);return i.c`
      <form ${(0,tA.C)(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${(0,a.f)(this.tabIdx)}
          ?disabled=${e||this.hasExceededUsageLimit}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?i.c`
          <wui-icon-link
            size="lg"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?i.c`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:null}templateError(){return this.error?i.c`<wui-text variant="sm-medium" color="error">${this.error}</wui-text>`:null}onEmailInputChange(e){this.email=e.detail.trim(),this.error=""}async onSubmitEmail(e){if(!eM.f.isValidEmail(this.email))return void id.f.open({displayMessage:iu.f.ALERT_WARNINGS.INVALID_EMAIL.displayMessage},"warning");if(!Q.f.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===c.f.state.activeChain)){let e=c.f.getFirstCaipNetworkSupportsAuthConnector();if(e)return void ei.f.push("SwitchNetwork",{network:e})}try{if(this.loading)return;this.loading=!0,e.preventDefault();let t=ee.f.getAuthConnector();if(!t)throw Error("w3m-email-login-widget: Auth connector not found");let{action:i}=await t.provider.connectEmail({email:this.email});if(B.f.sendEvent({type:"track",event:"EMAIL_SUBMITTED"}),"VERIFY_OTP"===i)B.f.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),ei.f.push("EmailVerifyOtp",{email:this.email});else if("VERIFY_DEVICE"===i)ei.f.push("EmailVerifyDevice",{email:this.email});else if("CONNECT"===i){let e=this.remoteFeatures?.multiWallet;await Z.f.connectExternal(t,c.f.state.activeChain),e?(ei.f.replace("ProfileWallets"),eo.f.showSuccess("New Wallet Added")):ei.f.replace("Account")}}catch(t){let e=l.f.parseError(t);e?.includes("Invalid email")?this.error="Invalid email. Try again.":eo.f.showError(t)}finally{this.loading=!1}}onFocusEvent(){B.f.sendEvent({type:"track",event:"EMAIL_LOGIN_SELECTED"})}};iw.styles=ih,ip([(0,o.f)()],iw.prototype,"tabIdx",void 0),ip([(0,n.f)()],iw.prototype,"email",void 0),ip([(0,n.f)()],iw.prototype,"loading",void 0),ip([(0,n.f)()],iw.prototype,"error",void 0),ip([(0,n.f)()],iw.prototype,"remoteFeatures",void 0),ip([(0,n.f)()],iw.prototype,"hasExceededUsageLimit",void 0),iw=ip([(0,h.f)("w3m-email-login-widget")],iw),e.i(729084);var im=t,ig=e.i(328182);e.i(655934);var ib=t;e.i(496969);let iy=m.m`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;var iv=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ix=class extends ib.f{constructor(){super(...arguments),this.logo="google",this.disabled=!1,this.tabIdx=void 0}render(){return i.c`
      <button ?disabled=${this.disabled} tabindex=${(0,a.f)(this.tabIdx)}>
        <wui-icon size="xxl" name=${this.logo}></wui-icon>
      </button>
    `}};ix.styles=[f.e,f.j,iy],iv([(0,o.f)()],ix.prototype,"logo",void 0),iv([(0,o.f)({type:Boolean})],ix.prototype,"disabled",void 0),iv([(0,o.f)()],ix.prototype,"tabIdx",void 0),ix=iv([(0,h.f)("wui-logo-select")],ix);var iC=e.i(542991);let i$=m.m`
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1)
      ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var ik=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let iE=class extends im.f{constructor(){super(),this.unsubscribe=[],this.walletGuide="get-started",this.tabIdx=void 0,this.connectors=ee.f.state.connectors,this.remoteFeatures=u.f.state.remoteFeatures,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.isPwaLoading=!1,this.hasExceededUsageLimit=tz.f.state.plan.hasExceededUsageLimit,this.unsubscribe.push(ee.f.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type)}),u.f.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),tz.f.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="2"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){let e="explore"===this.walletGuide,t=this.remoteFeatures?.socials;return!t&&e?(t=et.W.DEFAULT_SOCIALS,this.renderTopViewContent(t)):t?this.renderTopViewContent(t):null}renderTopViewContent(e){return 2===e.length?i.c` <wui-flex gap="2">
        ${e.slice(0,2).map(e=>i.c`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${(0,a.f)(this.tabIdx)}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
      </wui-flex>`:i.c` <wui-list-button
      data-testid=${`social-selector-${e[0]}`}
      @click=${()=>{this.onSocialClick(e[0])}}
      size="lg"
      icon=${(0,a.f)(e[0])}
      text=${`Continue with ${w.f.capitalize(e[0])}`}
      tabIdx=${(0,a.f)(this.tabIdx)}
      ?disabled=${this.isPwaLoading||this.hasConnection()}
    ></wui-list-button>`}bottomViewTemplate(){let e=this.remoteFeatures?.socials,t="explore"===this.walletGuide;return(this.authConnector&&e&&0!==e.length||!t||(e=et.W.DEFAULT_SOCIALS),!e||e.length<=2)?null:e&&e.length>6?i.c`<wui-flex gap="2">
        ${e.slice(1,5).map(e=>i.c`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${(0,a.f)(this.tabIdx)}
              ?focusable=${void 0!==this.tabIdx&&this.tabIdx>=0}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
        <wui-logo-select
          logo="more"
          tabIdx=${(0,a.f)(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
          ?disabled=${this.isPwaLoading||this.hasConnection()}
          data-testid="social-selector-more"
        ></wui-logo-select>
      </wui-flex>`:e?i.c`<wui-flex gap="2">
      ${e.slice(1,e.length).map(e=>i.c`<wui-logo-select
            data-testid=${`social-selector-${e}`}
            @click=${()=>{this.onSocialClick(e)}}
            logo=${e}
            tabIdx=${(0,a.f)(this.tabIdx)}
            ?focusable=${void 0!==this.tabIdx&&this.tabIdx>=0}
            ?disabled=${this.isPwaLoading||this.hasConnection()}
          ></wui-logo-select>`)}
    </wui-flex>`:null}onMoreSocialsClick(){ei.f.push("ConnectSocials")}async onSocialClick(e){if(this.hasExceededUsageLimit)return void ei.f.push("UsageExceeded");if(!Q.f.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===c.f.state.activeChain)){let e=c.f.getFirstCaipNetworkSupportsAuthConnector();if(e)return void ei.f.push("SwitchNetwork",{network:e})}e&&await (0,ig.f)(e)}async handlePwaFrameLoad(){if(l.f.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof iC.f&&await this.authConnector.provider.init()}catch(e){id.f.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}hasConnection(){return Z.f.hasAnyConnection(Q.f.CONNECTOR_ID.AUTH)}};iE.styles=i$,ik([(0,o.f)()],iE.prototype,"walletGuide",void 0),ik([(0,o.f)()],iE.prototype,"tabIdx",void 0),ik([(0,n.f)()],iE.prototype,"connectors",void 0),ik([(0,n.f)()],iE.prototype,"remoteFeatures",void 0),ik([(0,n.f)()],iE.prototype,"authConnector",void 0),ik([(0,n.f)()],iE.prototype,"isPwaLoading",void 0),ik([(0,n.f)()],iE.prototype,"hasExceededUsageLimit",void 0),iE=ik([(0,h.f)("w3m-social-login-widget")],iE);var iS=t,iN=t;e.i(987789);var iA=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let iT=class extends iN.f{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=ee.f.state.connectors,this.count=tz.f.state.count,this.filteredCount=tz.f.state.filteredWallets.length,this.isFetchingRecommendedWallets=tz.f.state.isFetchingRecommendedWallets,this.unsubscribe.push(ee.f.subscribeKey("connectors",e=>this.connectors=e),tz.f.subscribeKey("count",e=>this.count=e),tz.f.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),tz.f.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.find(e=>"walletConnect"===e.id),{allWallets:t}=u.f.state;if(!e||"HIDE"===t||"ONLY_MOBILE"===t&&!l.f.isMobile())return null;let o=tz.f.state.featured.length,n=this.count+o,r=n<10?n:10*Math.floor(n/10),s=this.filteredCount>0?this.filteredCount:r,c=`${s}`;this.filteredCount>0?c=`${this.filteredCount}`:s<n&&(c=`${s}+`);let d=Z.f.hasAnyConnection(Q.f.CONNECTOR_ID.WALLET_CONNECT);return i.c`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${c}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${(0,a.f)(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${d}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){B.f.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),ei.f.push("AllWallets",{redirectView:ei.f.state.data?.redirectView})}};iA([(0,o.f)()],iT.prototype,"tabIdx",void 0),iA([(0,n.f)()],iT.prototype,"connectors",void 0),iA([(0,n.f)()],iT.prototype,"count",void 0),iA([(0,n.f)()],iT.prototype,"filteredCount",void 0),iA([(0,n.f)()],iT.prototype,"isFetchingRecommendedWallets",void 0),iT=iA([(0,h.f)("w3m-all-wallets-widget")],iT),e.s([],903134);var iR=t;let iI=m.m`
  :host {
    margin-top: ${({spacing:e})=>e["1"]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1)
      ${({spacing:e})=>e["2"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var iO=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let iP=class extends iR.f{constructor(){super(),this.unsubscribe=[],this.explorerWallets=tz.f.state.explorerWallets,this.connections=Z.f.state.connections,this.connectorImages=r.f.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(Z.f.subscribeKey("connections",e=>this.connections=e),r.f.subscribeKey("connectorImages",e=>this.connectorImages=e),tz.f.subscribeKey("explorerFilteredWallets",e=>{this.explorerWallets=e?.length?e:tz.f.state.explorerWallets}),tz.f.subscribeKey("explorerWallets",e=>{this.explorerWallets?.length||(this.explorerWallets=e)})),l.f.isTelegram()&&l.f.isIos()&&(this.loadingTelegram=!Z.f.state.wcUri,this.unsubscribe.push(Z.f.subscribeKey("wcUri",e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){return eP.f.connectorList().map((e,t)=>"connector"===e.kind?this.renderConnector(e,t):this.renderWallet(e,t))}getConnectorNamespaces(e){return"walletConnect"===e.subtype?[]:"multiChain"===e.subtype?e.connector.connectors?.map(e=>e.chain)||[]:[e.connector.chain]}renderConnector(e,t){let o,n,r=e.connector,c=s.f.getConnectorImage(r)||this.connectorImages[r?.imageId??""],l=(this.connections.get(r.chain)??[]).some(e=>tl.f.isLowerCaseMatch(e.connectorId,r.id));"walletConnect"===e.subtype?(o="qr code",n="accent"):"injected"===e.subtype||"announced"===e.subtype?(o=l?"connected":"installed",n=l?"info":"success"):(o=void 0,n=void 0);let d=Z.f.hasAnyConnection(Q.f.CONNECTOR_ID.WALLET_CONNECT),u=("walletConnect"===e.subtype||"external"===e.subtype)&&d;return i.c`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${(0,a.f)(c)}
        .installed=${!0}
        name=${r.name??"Unknown"}
        .tagVariant=${n}
        tagLabel=${(0,a.f)(o)}
        data-testid=${`wallet-selector-${r.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${(0,a.f)(this.tabIdx)}
        ?disabled=${u}
        rdnsId=${(0,a.f)(r.explorerWallet?.rdns||void 0)}
        walletRank=${(0,a.f)(r.explorerWallet?.order)}
        .namespaces=${this.getConnectorNamespaces(e)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){let t=ei.f.state.data?.redirectView;if("walletConnect"===e.subtype){ee.f.setActiveConnector(e.connector),l.f.isMobile()?ei.f.push("AllWallets"):ei.f.push("ConnectingWalletConnect",{redirectView:t});return}if("multiChain"===e.subtype){ee.f.setActiveConnector(e.connector),ei.f.push("ConnectingMultiChain",{redirectView:t});return}if("injected"===e.subtype){ee.f.setActiveConnector(e.connector),ei.f.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet});return}if("announced"===e.subtype)return"walletConnect"===e.connector.id?void(l.f.isMobile()?ei.f.push("AllWallets"):ei.f.push("ConnectingWalletConnect",{redirectView:t})):(ei.f.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet}),void 0);ei.f.push("ConnectingExternal",{connector:e.connector,redirectView:t})}renderWallet(e,t){let o=e.wallet,n=s.f.getWalletImage(o),r=Z.f.hasAnyConnection(Q.f.CONNECTOR_ID.WALLET_CONNECT),c=this.loadingTelegram,l="recent"===e.subtype?"recent":void 0,d="recent"===e.subtype?"info":void 0;return i.c`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${(0,a.f)(n)}
        name=${o.name??"Unknown"}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${o.id}`}
        tabIdx=${(0,a.f)(this.tabIdx)}
        ?loading=${c}
        ?disabled=${r}
        rdnsId=${(0,a.f)(o.rdns||void 0)}
        walletRank=${(0,a.f)(o.order)}
        tagLabel=${(0,a.f)(l)}
        .tagVariant=${d}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){let t=ei.f.state.data?.redirectView,i=c.f.state.activeChain;if("featured"===e.subtype)return void ee.f.selectWalletConnector(e.wallet);if("recent"===e.subtype){if(this.loadingTelegram)return;ee.f.selectWalletConnector(e.wallet);return}if("custom"===e.subtype){if(this.loadingTelegram)return;ei.f.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t});return}if(this.loadingTelegram)return;let o=i?ee.f.getConnector({id:e.wallet.id,namespace:i}):void 0;o?ei.f.push("ConnectingExternal",{connector:o,redirectView:t}):ei.f.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t})}};iP.styles=iI,iO([(0,o.f)({type:Number})],iP.prototype,"tabIdx",void 0),iO([(0,n.f)()],iP.prototype,"explorerWallets",void 0),iO([(0,n.f)()],iP.prototype,"connections",void 0),iO([(0,n.f)()],iP.prototype,"connectorImages",void 0),iO([(0,n.f)()],iP.prototype,"loadingTelegram",void 0),iP=iO([(0,h.f)("w3m-connector-list")],iP),e.s([],212605);var iD=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ij=class extends iS.f{constructor(){super(...arguments),this.tabIdx=void 0}render(){return i.c`
      <wui-flex flexDirection="column" gap="2">
        <w3m-connector-list tabIdx=${(0,a.f)(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${(0,a.f)(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};iD([(0,o.f)()],ij.prototype,"tabIdx",void 0),ij=iD([(0,h.f)("w3m-wallet-login-list")],ij),e.s([],391641);let iW=m.m`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
    --connect-mask-image: none;
  }

  .connect {
    max-height: clamp(360px, 470px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }

  .connect::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .connect.disabled,
  .guide.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }

  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var iL=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let i_=class extends it.f{constructor(){super(),this.unsubscribe=[],this.connectors=ee.f.state.connectors,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.features=u.f.state.features,this.remoteFeatures=u.f.state.remoteFeatures,this.enableWallets=u.f.state.enableWallets,this.noAdapters=c.f.state.noAdapters,this.walletGuide="get-started",this.checked=ii.f.state.isLegalCheckboxChecked,this.isEmailEnabled=this.remoteFeatures?.email&&!c.f.state.noAdapters,this.isSocialEnabled=this.remoteFeatures?.socials&&this.remoteFeatures.socials.length>0&&!c.f.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push(ee.f.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)}),u.f.subscribeKey("features",e=>{this.features=e}),u.f.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e,this.setEmailAndSocialEnableCheck(this.noAdapters,this.remoteFeatures)}),u.f.subscribeKey("enableWallets",e=>this.enableWallets=e),c.f.subscribeKey("noAdapters",e=>this.setEmailAndSocialEnableCheck(e,this.remoteFeatures)),ii.f.subscribeKey("isLegalCheckboxChecked",e=>this.checked=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect();let e=this.shadowRoot?.querySelector(".connect");e?.removeEventListener("scroll",this.handleConnectListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(".connect");e&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),e?.addEventListener("scroll",this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleConnectListScroll()}),this.resizeObserver?.observe(e),this.handleConnectListScroll())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.f.state,o=u.f.state.features?.legalCheckbox,n=!!(e||t)&&!!o&&"get-started"===this.walletGuide&&!this.checked,a=u.f.state.enableWalletGuide,r=this.enableWallets,s=this.isSocialEnabled||this.authConnector;return i.c`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          .padding=${["0","0","4","0"]}
          class=${(0,e8.f)({connect:!0,disabled:n})}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="2"
            .padding=${s&&r&&a&&"get-started"===this.walletGuide?["0","3","0","3"]:["0","3","3","3"]}
          >
            ${this.renderConnectMethod(n?-1:void 0)}
          </wui-flex>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}reownBrandingTemplate(){return eM.f.hasFooter()||!this.remoteFeatures?.reownBranding?null:i.c`<wui-ux-by-reown></wui-ux-by-reown>`}setEmailAndSocialEnableCheck(e,t){this.isEmailEnabled=t?.email&&!e,this.isSocialEnabled=t?.socials&&t.socials.length>0&&!e,this.remoteFeatures=t,this.noAdapters=e}checkIfAuthEnabled(e){let t=e.filter(e=>e.type===ic.f.CONNECTOR_TYPE_AUTH).map(e=>e.chain);return Q.f.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(e=>t.includes(e))}renderConnectMethod(e){let t=tB.f.getConnectOrderMethod(this.features,this.connectors);return i.c`${t.map((t,o)=>{switch(t){case"email":return i.c`${this.emailTemplate(e)} ${this.separatorTemplate(o,"email")}`;case"social":return i.c`${this.socialListTemplate(e)}
          ${this.separatorTemplate(o,"social")}`;case"wallet":return i.c`${this.walletListTemplate(e)}
          ${this.separatorTemplate(o,"wallet")}`;default:return null}})}`}checkMethodEnabled(e){switch(e){case"wallet":return this.enableWallets;case"social":return this.isSocialEnabled&&this.isAuthEnabled;case"email":return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(e){let t=tB.f.getConnectOrderMethod(this.features,this.connectors)[e+1];return t?this.checkMethodEnabled(t)?t:this.checkIsThereNextMethod(e+1):void 0}separatorTemplate(e,t){let o=this.checkIsThereNextMethod(e),n="explore"===this.walletGuide;switch(t){case"wallet":return this.enableWallets&&o&&!n?i.c`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case"email":return this.isAuthEnabled&&this.isEmailEnabled&&"social"!==o&&o?i.c`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null;case"social":return this.isAuthEnabled&&this.isSocialEnabled&&"email"!==o&&o?i.c`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;default:return null}}emailTemplate(e){return this.isEmailEnabled&&this.isAuthEnabled?i.c`<w3m-email-login-widget tabIdx=${(0,a.f)(e)}></w3m-email-login-widget>`:null}socialListTemplate(e){return this.isSocialEnabled&&this.isAuthEnabled?i.c`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${(0,a.f)(e)}
    ></w3m-social-login-widget>`:null}walletListTemplate(e){let t=this.enableWallets,o=this.features?.emailShowWallets===!1,n=this.features?.collapseWallets;return t?(l.f.isTelegram()&&(l.f.isSafari()||l.f.isIos())&&Z.f.connectWalletConnect().catch(e=>({})),"explore"===this.walletGuide)?null:this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&(o||n)?i.c`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${(0,a.f)(e)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
        icon="wallet"
      ></wui-list-button>`:i.c`<w3m-wallet-login-list tabIdx=${(0,a.f)(e)}></w3m-wallet-login-list>`:null}legalCheckboxTemplate(){return"explore"===this.walletGuide?null:i.c`<w3m-legal-checkbox data-testid="w3m-legal-checkbox"></w3m-legal-checkbox>`}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(".connect");e&&(e.scrollHeight>470?(e.style.setProperty("--connect-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
          black 100px,
          black calc(100% - 100px),
          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty("--connect-scroll--top-opacity",te.f.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",te.f.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--connect-mask-image","none"),e.style.setProperty("--connect-scroll--top-opacity","0"),e.style.setProperty("--connect-scroll--bottom-opacity","0")))}onContinueWalletClick(){ei.f.push("ConnectWallets")}};i_.styles=iW,iL([(0,n.f)()],i_.prototype,"connectors",void 0),iL([(0,n.f)()],i_.prototype,"authConnector",void 0),iL([(0,n.f)()],i_.prototype,"features",void 0),iL([(0,n.f)()],i_.prototype,"remoteFeatures",void 0),iL([(0,n.f)()],i_.prototype,"enableWallets",void 0),iL([(0,n.f)()],i_.prototype,"noAdapters",void 0),iL([(0,o.f)()],i_.prototype,"walletGuide",void 0),iL([(0,n.f)()],i_.prototype,"checked",void 0),iL([(0,n.f)()],i_.prototype,"isEmailEnabled",void 0),iL([(0,n.f)()],i_.prototype,"isSocialEnabled",void 0),iL([(0,n.f)()],i_.prototype,"isAuthEnabled",void 0),i_=iL([(0,h.f)("w3m-connect-view")],i_),e.s(["W3mConnectView",0,i_],28218);var iU=e.i(683075),iz=e.i(592279),iB=t,iF=e.i(639403);e.i(210380),e.i(595157);var iM=t,iV=t;let iK=m.m`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding-left: ${({spacing:e})=>e[3]};
    padding-right: ${({spacing:e})=>e[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[6]};
  }

  wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
    min-width: 0;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  wui-button {
    flex-shrink: 0;
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var iq=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let iH=class extends iV.f{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return i.c`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};iH.styles=[f.e,f.j,iK],iq([(0,o.f)({type:Boolean})],iH.prototype,"disabled",void 0),iq([(0,o.f)()],iH.prototype,"label",void 0),iq([(0,o.f)()],iH.prototype,"buttonLabel",void 0),iH=iq([(0,h.f)("wui-cta-button")],iH);let iG=m.m`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e["5"]} ${({spacing:e})=>e["5"]};
  }
`;var iY=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let iX=class extends iM.f{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:e,app_store:t,play_store:o,chrome_store:n,homepage:a}=this.wallet,r=l.f.isMobile(),s=l.f.isIos(),c=l.f.isAndroid(),d=[t,o,a,n].filter(Boolean).length>1;return d&&!r?i.c`
        <wui-cta-button
          label=${`Don't have ${e}?`}
          buttonLabel="Get"
          @click=${()=>ei.f.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!d&&a?i.c`
        <wui-cta-button
          label=${`Don't have ${e}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:t&&s?i.c`
        <wui-cta-button
          label=${`Don't have ${e}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:o&&c?i.c`
        <wui-cta-button
          label=${`Don't have ${e}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&l.f.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&l.f.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&l.f.openHref(this.wallet.homepage,"_blank")}};iX.styles=[iG],iY([(0,o.f)({type:Object})],iX.prototype,"wallet",void 0),iX=iY([(0,h.f)("w3m-mobile-download-links")],iX),e.s([],121121);let iJ=m.m`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-wallet-image {
    width: 56px;
    height: 56px;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:e})=>e.lg};
    transition-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e["4"]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`;var iQ=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class iZ extends iB.f{constructor(){super(),this.wallet=ei.f.state.data?.wallet,this.connector=ei.f.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=s.f.getConnectorImage(this.connector)??s.f.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=Z.f.state.wcUri,this.error=Z.f.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(Z.f.subscribeKey("wcUri",e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),Z.f.subscribeKey("wcError",e=>this.error=e)),(l.f.isTelegram()||l.f.isSafari())&&l.f.isIos()&&Z.f.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),Z.f.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,t="";return this.label?t=this.label:(t=`Continue in ${this.name}`,this.error&&(t="Connection declined")),i.c`
      <wui-flex
        data-error=${(0,a.f)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${(0,a.f)(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","0","0"]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?"error":"primary"}>
            ${t}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?i.c`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?i.c`
              <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;let e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){Z.f.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let e=iF.f.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return i.c`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(l.f.copyToClopboard(this.uri),eo.f.showSuccess("Link copied"))}catch{eo.f.showError("Failed to copy")}}}iZ.styles=iJ,iQ([(0,n.f)()],iZ.prototype,"isRetrying",void 0),iQ([(0,n.f)()],iZ.prototype,"uri",void 0),iQ([(0,n.f)()],iZ.prototype,"error",void 0),iQ([(0,n.f)()],iZ.prototype,"ready",void 0),iQ([(0,n.f)()],iZ.prototype,"showRetry",void 0),iQ([(0,n.f)()],iZ.prototype,"label",void 0),iQ([(0,n.f)()],iZ.prototype,"secondaryBtnLabel",void 0),iQ([(0,n.f)()],iZ.prototype,"secondaryLabel",void 0),iQ([(0,n.f)()],iZ.prototype,"isLoading",void 0),iQ([(0,o.f)({type:Boolean})],iZ.prototype,"isMobile",void 0),iQ([(0,o.f)()],iZ.prototype,"onRetry",void 0),e.s(["f",0,iZ],181557);let i0=class extends iZ{constructor(){if(super(),this.externalViewUnsubscribe=[],this.connectionsByNamespace=Z.f.getConnections(this.connector?.chain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.remoteFeatures=u.f.state.remoteFeatures,this.currentActiveConnectorId=ee.f.state.activeConnectorIds[this.connector?.chain],!this.connector)throw Error("w3m-connecting-view: No connector provided");let e=this.connector?.chain;this.isAlreadyConnected(this.connector)&&(this.secondaryBtnLabel=void 0,this.label=`This account is already linked, change your account in ${this.connector.name}`,this.secondaryLabel=`To link a new account, open ${this.connector.name} and switch to the account you want to link`),B.f.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:ei.f.state.view}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push(ee.f.subscribeKey("activeConnectorIds",t=>{let i=t[e],o=this.remoteFeatures?.multiWallet,{redirectView:n}=ei.f.state.data??{};i!==this.currentActiveConnectorId&&(this.hasMultipleConnections&&o?(ei.f.replace("ProfileWallets"),eo.f.showSuccess("New Wallet Added")):n?ei.f.replace(n):d.f.close())}),Z.f.subscribeKey("connections",this.onConnectionsChange.bind(this)))}disconnectedCallback(){this.externalViewUnsubscribe.forEach(e=>e())}async onConnectProxy(){try{if(this.error=!1,this.connector){if(this.isAlreadyConnected(this.connector))return;(this.connector.id===Q.f.CONNECTOR_ID.COINBASE_SDK||this.connector.id===Q.f.CONNECTOR_ID.BASE_ACCOUNT)&&this.error||await Z.f.connectExternal(this.connector,this.connector.chain)}}catch(e){e instanceof iz.v&&e.originalName===iU.Y.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?B.f.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):B.f.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}onConnectionsChange(e){if(this.connector?.chain&&e.get(this.connector.chain)&&this.isAlreadyConnected(this.connector)){let t=e.get(this.connector.chain)??[],i=this.remoteFeatures?.multiWallet;if(0===t.length)ei.f.replace("Connect");else{let e=e7.f.getConnectionsByConnectorId(this.connectionsByNamespace,this.connector.id).flatMap(e=>e.accounts),o=e7.f.getConnectionsByConnectorId(t,this.connector.id).flatMap(e=>e.accounts);0===o.length?this.hasMultipleConnections&&i?(ei.f.replace("ProfileWallets"),eo.f.showSuccess("Wallet deleted")):d.f.close():!e.every(e=>o.some(t=>tl.f.isLowerCaseMatch(e.address,t.address)))&&i&&ei.f.replace("ProfileWallets")}}}isAlreadyConnected(e){return!!e&&this.connectionsByNamespace.some(t=>tl.f.isLowerCaseMatch(t.connectorId,e.id))}};i0=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([(0,h.f)("w3m-connecting-external-view")],i0),e.s(["W3mConnectingExternalView",0,i0],217283);var i3=t;let i1=E.m`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`;var i2=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let i5=class extends i3.f{constructor(){super(),this.unsubscribe=[],this.activeConnector=ee.f.state.activeConnector,this.unsubscribe.push(ee.f.subscribeKey("activeConnector",e=>this.activeConnector=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${(0,a.f)(s.f.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["0","3","0","3"]}
        >
          <wui-text variant="lg-medium" color="primary">
            Select Chain for ${this.activeConnector?.name}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","2","0"]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){return this.activeConnector?.connectors?.map((e,t)=>e.name?i.c`
            <w3m-list-wallet
              displayIndex=${t}
              imageSrc=${(0,a.f)(s.f.getChainImage(e.chain))}
              name=${Q.f.CHAIN_NAME_MAP[e.chain]}
              @click=${()=>this.onConnector(e)}
              size="sm"
              data-testid="wui-list-chain-${e.chain}"
              rdnsId=${e.explorerWallet?.rdns}
            ></w3m-list-wallet>
          `:null)}onConnector(e){let t=this.activeConnector?.connectors?.find(t=>t.chain===e.chain),i=ei.f.state.data?.redirectView;t?"walletConnect"===t.id?l.f.isMobile()?ei.f.push("AllWallets"):ei.f.push("ConnectingWalletConnect",{redirectView:i}):ei.f.push("ConnectingExternal",{connector:t,redirectView:i,wallet:this.activeConnector?.explorerWallet}):eo.f.showError("Failed to find connector")}};i5.styles=i1,i2([(0,n.f)()],i5.prototype,"activeConnector",void 0),i5=i2([(0,h.f)("w3m-connecting-multi-chain-view")],i5),e.s(["W3mConnectingMultiChainView",0,i5],904356)},334523,e=>{var t=e.i(307075),i=e.i(110163),o=e.i(401564),n=e.i(960398),a=e.i(758331),r=e.i(16555);o.f.CONNECTOR_ID.COINBASE,o.f.CONNECTOR_ID.COINBASE_SDK,o.f.CONNECTOR_ID.BASE_ACCOUNT,o.f.CONNECTOR_ID.SAFE,o.f.CONNECTOR_ID.LEDGER,o.f.CONNECTOR_ID.OKX,r.f.METMASK_CONNECTOR_NAME,r.f.TRUST_CONNECTOR_NAME,r.f.SOLFLARE_CONNECTOR_NAME,r.f.PHANTOM_CONNECTOR_NAME,r.f.COIN98_CONNECTOR_NAME,r.f.MAGIC_EDEN_CONNECTOR_NAME,r.f.BACKPACK_CONNECTOR_NAME,r.f.BITGET_CONNECTOR_NAME,r.f.FRONTIER_CONNECTOR_NAME,r.f.XVERSE_CONNECTOR_NAME,r.f.LEATHER_CONNECTOR_NAME,r.f.OKX_CONNECTOR_NAME,r.f.BINANCE_CONNECTOR_NAME;let s={1:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",42161:"3bff954d-5cb0-47a0-9a23-d20192e74600",43114:"30c46e53-e989-45fb-4549-be3bd4eb3b00",56:"93564157-2e8e-4ce7-81df-b264dbee9b00",250:"06b26297-fe0c-4733-5d6b-ffa5498aac00",10:"ab9c186a-c52f-464b-2906-ca59d760a400",137:"41d04d42-da3b-4453-8506-668cc0727900",5e3:"e86fae9b-b770-4eea-e520-150e12c81100",295:"6a97d510-cac8-4e58-c7ce-e8681b044c00",0xaa36a7:"e909ea0a-f92a-4512-c8fc-748044ea6800",84532:"a18a7ecd-e307-4360-4746-283182228e00",1301:"4eeea7ef-0014-4649-5d1d-07271a80f600",130:"2257980a-3463-48c6-cbac-a42d2a956e00",10143:"0a728e83-bacb-46db-7844-948f05434900",143:"0a728e83-bacb-46db-7844-948f05434900",100:"02b53f6a-e3d4-479e-1cb4-21178987d100",9001:"f926ff41-260d-4028-635e-91913fc28e00",324:"b310f07f-4ef7-49f3-7073-2a0a39685800",314:"5a73b3dd-af74-424e-cae0-0de859ee9400",4689:"34e68754-e536-40da-c153-6ef2e7188a00",1088:"3897a66d-40b9-4833-162f-a2c90531c900",1284:"161038da-44ae-4ec7-1208-0ea569454b00",1285:"f1d73bb6-5450-4e18-38f7-fb6484264a00",7777777:"845c60df-d429-4991-e687-91ae45791600",42220:"ab781bbc-ccc6-418d-d32d-789b15da1f00",8453:"7289c336-3981-4081-c5f4-efc26ac64a00",0x4e454152:"3ff73439-a619-4894-9262-4470c773a100",2020:"b8101fc0-9c19-4b6f-ec65-f6dfff106e00",2021:"b8101fc0-9c19-4b6f-ec65-f6dfff106e00",80094:"e329c2c9-59b0-4a02-83e4-212ff3779900",2741:"fc2427d1-5af9-4a9c-8da5-6f94627cd900",30:"fb7e1624-99e3-4c36-ea01-4cfe46c4a300",31:"2eb3d92a-3d77-42aa-87c9-190adb144800","5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp":"a1b58899-f671-4276-6a5e-56ca5bd59700","4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z":"a1b58899-f671-4276-6a5e-56ca5bd59700",EtWTRABZaYq6iMfeYKouRu166VU2xqa1:"a1b58899-f671-4276-6a5e-56ca5bd59700","000000000019d6689c085ae165831e93":"0b4838db-0161-4ffe-022d-532bf03dba00","000000000933ea01ad0ee984209779ba":"39354064-d79b-420b-065d-f980c4b78200","00000008819873e925422c1ff0f99f7c":"b3406e4a-bbfc-44fb-e3a6-89673c78b700","-239":"20f673c0-095e-49b2-07cf-eb5049dcf600","-3":"20f673c0-095e-49b2-07cf-eb5049dcf600","0x2b6653dc":"3502bb86-cc4e-420f-a387-59ea63a28b00","0x94a9059e":"3502bb86-cc4e-420f-a387-59ea63a28b00","0xcd8690dc":"3502bb86-cc4e-420f-a387-59ea63a28b00",pubnet:"",testnet:""};function c(e,t){let i=new URL("https://rpc.walletconnect.org/v1/");return i.searchParams.set("chainId",e),i.searchParams.set("projectId",t),i.toString()}o.f.CONNECTOR_ID.COINBASE,o.f.CONNECTOR_ID.COINBASE_SDK,o.f.CONNECTOR_ID.BASE_ACCOUNT,o.f.CONNECTOR_ID.SAFE,o.f.CONNECTOR_ID.LEDGER,o.f.CONNECTOR_ID.WALLET_CONNECT,o.f.CONNECTOR_ID.INJECTED,o.f.CONNECTOR_ID.INJECTED,o.f.CONNECTOR_ID.WALLET_CONNECT,o.f.CONNECTOR_ID.COINBASE,o.f.CONNECTOR_ID.COINBASE_SDK,o.f.CONNECTOR_ID.BASE_ACCOUNT,o.f.CONNECTOR_ID.LEDGER,o.f.CONNECTOR_ID.SAFE,o.f.CONNECTOR_ID.INJECTED,o.f.CONNECTOR_ID.WALLET_CONNECT,o.f.CONNECTOR_ID.EIP6963,o.f.CONNECTOR_ID.AUTH,o.f.CONNECTOR_ID.COINBASE,o.f.CONNECTOR_ID.COINBASE_SDK,o.f.CONNECTOR_ID.BASE_ACCOUNT,r.f.CONNECTOR_TYPE_AUTH;let l=["near:mainnet","solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp","eip155:1101","eip155:56","eip155:42161","eip155:7777777","eip155:59144","eip155:324","solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1","eip155:5000","solana:4sgjmw1sunhzsxgspuhpqldx6wiyjntz","eip155:80084","eip155:5003","eip155:100","eip155:8453","eip155:42220","eip155:1313161555","eip155:17000","eip155:1","eip155:300","eip155:1313161554","eip155:1329","eip155:84532","eip155:421614","eip155:11155111","eip155:8217","eip155:43114","solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z","eip155:999999999","eip155:11155420","eip155:80002","eip155:97","eip155:43113","eip155:137","eip155:10","eip155:1301","eip155:80094","eip155:80069","eip155:560048","eip155:31","eip155:2818","eip155:57054","eip155:911867","eip155:534351","eip155:1112","eip155:534352","eip155:1111","eip155:146","eip155:130","eip155:1284","eip155:30","eip155:2810","eip155:55931","bip122:000000000019d6689c085ae165831e93","bip122:000000000933ea01ad0ee984209779ba","tron:0x2b6653dc","tron:0xcd8690dc"],d={extendRpcUrlWithProjectId(e,t){let i=!1;try{i="rpc.walletconnect.org"===new URL(e).host}catch(e){i=!1}if(i){let i=new URL(e);return i.searchParams.has("projectId")||i.searchParams.set("projectId",t),i.toString()}return e},isCaipNetwork:e=>"chainNamespace"in e&&"caipNetworkId"in e,getChainNamespace(e){return this.isCaipNetwork(e)?e.chainNamespace:o.f.CHAIN.EVM},getCaipNetworkId(e){return this.isCaipNetwork(e)?e.caipNetworkId:`${o.f.CHAIN.EVM}:${e.id}`},getDefaultRpcUrl(e,t,i){let o=e.rpcUrls?.default?.http?.[0];return l.includes(t)?c(t,i):o||""},extendCaipNetwork(e,{customNetworkImageUrls:t,projectId:i,customRpcUrls:o}){let n=this.getChainNamespace(e),a=this.getCaipNetworkId(e),r=e.rpcUrls?.default?.http?.[0],c=this.getDefaultRpcUrl(e,a,i),l=e?.rpcUrls?.chainDefault?.http?.[0]||r,d=o?.[a]?.map(e=>e.url)||[],u=[...d,...c?[c]:[]],h=[...d];return l&&!h.includes(l)&&h.push(l),{...e,chainNamespace:n,caipNetworkId:a,assets:{imageId:s[e.id],imageUrl:t?.[e.id]},rpcUrls:{...e.rpcUrls,default:{http:u},chainDefault:{http:h}}}},extendCaipNetworks:(e,{customNetworkImageUrls:t,projectId:i,customRpcUrls:o})=>e.map(e=>d.extendCaipNetwork(e,{customNetworkImageUrls:t,customRpcUrls:o,projectId:i})),getViemTransport(e,o,n){let a=[];return n?.forEach(e=>{a.push((0,i.f)(e.url,e.config))}),l.includes(e.caipNetworkId)&&a.push((0,i.f)(c(e.caipNetworkId,o),{fetchOptions:{headers:{"Content-Type":"text/plain"}}})),e?.rpcUrls?.default?.http?.forEach(e=>{a.push((0,i.f)(e))}),(0,t.f)(a)},extendWagmiTransports(e,o,n){if(l.includes(e.caipNetworkId)){let a=this.getDefaultRpcUrl(e,e.caipNetworkId,o);return(0,t.f)([n,(0,i.f)(a)])}return n},getUnsupportedNetwork:e=>({id:e.split(":")[1],caipNetworkId:e,name:o.f.UNSUPPORTED_NETWORK_NAME,chainNamespace:e.split(":")[0],nativeCurrency:{name:"",decimals:0,symbol:""},rpcUrls:{default:{http:[]}}}),getCaipNetworkFromStorage(e){let t=a.f.getActiveCaipNetworkId(),i=n.f.getAllRequestedCaipNetworks(),o=Array.from(n.f.state.chains?.keys()||[]),r=t?.split(":")[0],s=!!r&&o.includes(r),c=i?.find(e=>e.caipNetworkId===t);return s&&!c&&t?this.getUnsupportedNetwork(t):c||e||i?.[0]}};e.s(["f",0,d],334523)}])})();