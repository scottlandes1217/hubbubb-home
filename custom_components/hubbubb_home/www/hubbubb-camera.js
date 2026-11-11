var It=Object.defineProperty,Gt=Object.defineProperties;var Wt=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var ut=Object.prototype.hasOwnProperty,pt=Object.prototype.propertyIsEnumerable;var V=(r,t,e)=>t in r?It(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,p=(r,t)=>{for(var e in t||(t={}))ut.call(t,e)&&V(r,e,t[e]);if(D)for(var e of D(t))pt.call(t,e)&&V(r,e,t[e]);return r},_=(r,t)=>Gt(r,Wt(t));var mt=(r,t)=>{var e={};for(var s in r)ut.call(r,s)&&t.indexOf(s)<0&&(e[s]=r[s]);if(r!=null&&D)for(var s of D(r))t.indexOf(s)<0&&pt.call(r,s)&&(e[s]=r[s]);return e};var q=(r,t,e)=>V(r,typeof t!="symbol"?t+"":t,e);var F=globalThis,I=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),_t=new WeakMap,z=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(I&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=_t.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&_t.set(e,t))}return t}toString(){return this.cssText}},gt=r=>new z(typeof r=="string"?r:r+"",void 0,Y),X=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new z(e,r,Y)},ft=(r,t)=>{if(I)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=F.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},K=I?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return gt(e)})(r):r;var{is:Bt,defineProperty:Jt,getOwnPropertyDescriptor:Vt,getOwnPropertyNames:qt,getOwnPropertySymbols:Yt,getPrototypeOf:Xt}=Object,v=globalThis,bt=v.trustedTypes,Kt=bt?bt.emptyScript:"",Z=v.reactiveElementPolyfillSupport,M=(r,t)=>r,Q={toAttribute(r,t){switch(t){case Boolean:r=r?Kt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch(s){e=null}}return e}},xt=(r,t)=>!Bt(r,t),vt={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:xt},$t,yt;($t=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(yt=v.litPropertyMetadata)!=null||(v.litPropertyMetadata=new WeakMap);var b=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Jt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var a;let{get:i,set:o}=(a=Vt(this.prototype,t))!=null?a:{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let l=i==null?void 0:i.call(this);o==null||o.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:vt}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let t=Xt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let e=this.properties,s=[...qt(e),...Yt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(K(i))}else t!==void 0&&e.push(K(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return ft(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let a=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Q).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){var o,a,n;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let l=s.getPropertyOptions(i),h=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Q;this._$Em=i;let u=h.fromAttribute(e,l.type);this[i]=(n=u!=null?u:(a=this._$Ej)==null?void 0:a.get(i))!=null?n:u,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){var a,n;if(t!==void 0){let l=this.constructor;if(i===!1&&(o=this[t]),s!=null||(s=l.getPropertyOptions(t)),!(((a=s.hasChanged)!=null?a:xt)(o,e)||s.useDefault&&s.reflect&&o===((n=this._$Ej)==null?void 0:n.get(t))&&!this.hasAttribute(l._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},a){var n,l,h;s&&!((n=this._$Ej)!=null?n:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(l=a!=null?a:e)!=null?l:this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((h=this._$Eq)!=null?h:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[a,n]of this._$Ep)this[a]=n;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[a,n]of o){let{wrapped:l}=n,h=this[a];l!==!0||this._$AL.has(a)||h===void 0||this.C(a,void 0,n,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(o=>{var a;return(a=o.hostUpdate)==null?void 0:a.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},wt;b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[M("elementProperties")]=new Map,b[M("finalized")]=new Map,Z==null||Z({ReactiveElement:b}),((wt=v.reactiveElementVersions)!=null?wt:v.reactiveElementVersions=[]).push("2.1.2");var P=globalThis,kt=r=>r,G=P.trustedTypes,St=G?G.createPolicy("lit-html",{createHTML:r=>r}):void 0,jt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Pt="?"+$,Zt=`<${Pt}>`,k=document,N=()=>k.createComment(""),O=r=>r===null||typeof r!="object"&&typeof r!="function",nt=Array.isArray,Qt=r=>nt(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",tt=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,At=/-->/g,Et=/>/g,w=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Tt=/'/g,Ct=/"/g,Nt=/^(?:script|style|textarea|title)$/i,lt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),c=lt(1),ge=lt(2),fe=lt(3),S=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),zt=new WeakMap,x=k.createTreeWalker(k,129);function Ot(r,t){if(!nt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(t):t}var te=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",a=j;for(let n=0;n<e;n++){let l=r[n],h,u,m=-1,g=0;for(;g<l.length&&(a.lastIndex=g,u=a.exec(l),u!==null);)g=a.lastIndex,a===j?u[1]==="!--"?a=At:u[1]!==void 0?a=Et:u[2]!==void 0?(Nt.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=w):u[3]!==void 0&&(a=w):a===w?u[0]===">"?(a=i!=null?i:j,m=-1):u[1]===void 0?m=-2:(m=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?w:u[3]==='"'?Ct:Tt):a===Ct||a===Tt?a=w:a===At||a===Et?a=j:(a=w,i=void 0);let f=a===w&&r[n+1].startsWith("/>")?" ":"";o+=a===j?l+Zt:m>=0?(s.push(h),l.slice(0,m)+jt+l.slice(m)+$+f):l+$+(m===-2?n:f)}return[Ot(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},R=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,a=0,n=t.length-1,l=this.parts,[h,u]=te(t,e);if(this.el=r.createElement(h,s),x.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=x.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(jt)){let g=u[a++],f=i.getAttribute(m).split($),U=/([.?@])?(.*)/.exec(g);l.push({type:1,index:o,name:U[2],strings:f,ctor:U[1]==="."?it:U[1]==="?"?at:U[1]==="@"?ot:T}),i.removeAttribute(m)}else m.startsWith($)&&(l.push({type:6,index:o}),i.removeAttribute(m));if(Nt.test(i.tagName)){let m=i.textContent.split($),g=m.length-1;if(g>0){i.textContent=G?G.emptyScript:"";for(let f=0;f<g;f++)i.append(m[f],N()),x.nextNode(),l.push({type:2,index:++o});i.append(m[g],N())}}}else if(i.nodeType===8)if(i.data===Pt)l.push({type:2,index:o});else{let m=-1;for(;(m=i.data.indexOf($,m+1))!==-1;)l.push({type:7,index:o}),m+=$.length-1}o++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};function E(r,t,e=r,s){var a,n,l;if(t===S)return t;let i=s!==void 0?(a=e._$Co)==null?void 0:a[s]:e._$Cl,o=O(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((n=i==null?void 0:i._$AO)==null||n.call(i,!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?((l=e._$Co)!=null?l:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=E(r,i._$AS(r,t.values),i,s)),t}var st=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var h;let{el:{content:e},parts:s}=this._$AD,i=((h=t==null?void 0:t.creationScope)!=null?h:k).importNode(e,!0);x.currentNode=i;let o=x.nextNode(),a=0,n=0,l=s[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new L(o,o.nextSibling,this,t):l.type===1?u=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(u=new rt(o,this,t)),this._$AV.push(u),l=s[++n]}a!==(l==null?void 0:l.index)&&(o=x.nextNode(),a++)}return x.currentNode=k,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},L=class r{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var o;this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),O(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=R.createElement(Ot(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{let a=new st(i,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(t){let e=zt.get(t.strings);return e===void 0&&zt.set(t.strings,e=new R(t)),e}k(t){nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(N()),this.O(N()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=kt(t).nextSibling;kt(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){let o=this.strings,a=!1;if(o===void 0)t=E(this,t,e,0),a=!O(t)||t!==this._$AH&&t!==S,a&&(this._$AH=t);else{let n=t,l,h;for(t=o[0],l=0;l<o.length-1;l++)h=E(this,n[s+l],e,l),h===S&&(h=this._$AH[l]),a||(a=!O(h)||h!==this._$AH[l]),h===d?t=d:t!==d&&(t+=(h!=null?h:"")+o[l+1]),this._$AH[l]=h}a&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},it=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},at=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},ot=class extends T{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var a;if((t=(a=E(this,t,e,0))!=null?a:d)===S)return;let s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var et=P.litHtmlPolyfillSupport,Mt;et==null||et(R,L),((Mt=P.litHtmlVersions)!=null?Mt:P.litHtmlVersions=[]).push("3.3.3");var Rt=(r,t,e)=>{var o,a;let s=(o=e==null?void 0:e.renderBefore)!=null?o:t,i=s._$litPart$;if(i===void 0){let n=(a=e==null?void 0:e.renderBefore)!=null?a:null;s._$litPart$=i=new L(t.insertBefore(N(),n),n,void 0,e!=null?e:{})}return i._$AI(r),i};var A=globalThis,y=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return S}},Lt;y._$litElement$=!0,y.finalized=!0,(Lt=A.litElementHydrateSupport)==null||Lt.call(A,{LitElement:y});var ht=A.litElementPolyfillSupport;ht==null||ht({LitElement:y});var Ht;((Ht=A.litElementVersions)!=null?Ht:A.litElementVersions=[]).push("4.2.2");var ee=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-camera ${ee}`);var se=[["live","Live","mdi:cctv"],["gestures","Gestures","mdi:hand-wave"],["people","People","mdi:account-multiple"],["things","Things","mdi:package-variant-closed"],["jarvis","Jarvis","mdi:account-voice"],["tuning","Tuning","mdi:tune-variant"]],W=[["gestureMatch","Gesture match strictness","How close a hand must be to the gestures you taught it. Lower is stricter (fewer accidents); raise it if taught gestures are missed.",.01],["framingFill","Framing","How tightly auto-zoom frames one person: how much of the frame their upper body fills. 0.7 is waist up, 1.0 chest up, 1.4\u20131.6 head and shoulders. Lower shows more of the room.",.05],["zoomMax","Auto-zoom limit","The furthest auto-zoom will zoom in, from 1\xD7 (never) to 4\xD7. Pinching or scrolling the live view zooms by hand, past this limit.",.1],["holdSeconds","Hold time","Seconds a gesture must be held before it counts. Longer means fewer accidents.",.1],["handConfidence","Hand clarity","How clearly every finger must be seen. Higher ignores hands holding a phone or petting the dog.",.05],["lookTurn","Looking at the camera","How far your face may turn from the camera and still count as looking (0 = straight at it, 0.5 = side-on). Works with your head tilted, lying down. Raise it if you're refused while looking at the camera; lower it if glancing at your phone counts.",.01],["patrolSeconds","Room watch: seconds per stop","With Follow off the camera watches the whole room, wide, stopping at each part of it for this long (and staying while anyone is mid-gesture).",1],["petMatch","Pet match strictness","How closely an animal must look like a pet you showed it. Lower is stricter; raise it if your pet shows as just \u201Cdog\u201D or \u201Ccat\u201D.",.02],["followGain","Following speed","How quickly the camera turns to keep you centred. Higher is snappier; too high and it wobbles.",.05],["gestureReach","Gesture height","A hand counts as raised when its wrist is above its elbow, or when it is no more than this many face-heights below your chin. Raise it if chest-height gestures are missed; lower it if a phone or keyboard sets gestures off.",.1],["faceTouch","Touching your face","How much of a hand must be on your face (cheek, mouth, chin, forehead) to pause gestures, whatever shape it makes. Lower pauses sooner \u2014 lower it if resting a hand on your face still fires gestures; raise it if gestures held near your face are blocked.",.05],["hairReach","Head zone: above the face","Hands this far above your face (hair) pause gestures, in face-heights.",.1],["chinReach","Head zone: below the chin","Hands this far below your chin (eating, drinking) pause gestures, in face-heights.",.1],["steadiness","Hold-still tolerance","How still a hand must be for a gesture to count. Lower is stricter.",.05],["faceMatchThreshold","Face match strictness","Lower is stricter. Raise it if you're not recognized; lower it if people get mixed up.",.02],["searchDegrees","Search width","Degrees either side of the last sighting to search, until the room is learned.",1],["searchTilt","Search tilt","Degrees up (+) or down (\u2212) to search at, until the room is learned.",1]],ie=(r=[])=>{var e,s;let t=((e=r[0])!=null?e:.5)+((s=r[2])!=null?s:0)/2;return t<.36?"on the left":t>.64?"on the right":"in the middle"},ct=[["exposure","Exposure","Brighter or darker, in stops. In a dim room brighter also means grainier."],["brightness","Brightness","Lifts or lowers the whole picture after exposure."],["contrast","Contrast","Difference between light and dark."],["sharpness","Sharpness","Edge sharpening. Higher looks crisper but sharpens grain too."],["white_balance","Colour temperature","Kelvin: lower is cooler (bluer), higher warmer. Moving it turns automatic white balance off."]],ae=r=>r?r>=2500?`ISO ${r}: the room is too dark for this camera - more light on faces will help far more than any slider.`:r>=1e3?`ISO ${r}: dim. More light would make it noticeably cleaner.`:`ISO ${r}: plenty of light.`:"",Ut=r=>{let t=(r||"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,40).replace(/_+$/,"");return t?`custom_${t}`:null},oe=(r=[],t={},e=null,s=[])=>{let i=[...Object.keys(t||{}),e==null?void 0:e.gesture].filter(a=>a==null?void 0:a.startsWith("custom_")),o=[...new Set(i)].sort().map(a=>{let n=a.slice(7).replace(/_/g," "),l=s.includes(a)||(e==null?void 0:e.gesture)===a&&!!e.motion;return{id:a,title:n[0].toUpperCase()+n.slice(1),how:l?"Your own motion":"Your own gesture",icon:l?"mdi:gesture-swipe":"mdi:hand-wave",custom:!0,motion:l}});return[...r,...o]},Ft=(r=[])=>{let t=o=>({start:r.slice(o*24,o*24+3),end:r.slice(o*24+21,o*24+24)});if(r.length===48){let[o,a]=[t(0),t(1)];return a.end[0]-o.end[0]>a.start[0]-o.start[0]?"hands apart":"hands together"}let[e,s,i]=t(0).end;return Math.abs(i)>=.5*Math.hypot(e,s)?i<0?"twist left":"twist right":Math.abs(e)>Math.abs(s)?e>0?"swipe left":"swipe right":s>0?"swipe up":"swipe down"},re=(r=[])=>{let t=r.map(Ft),e=t.reduce((o,a)=>_(p({},o),{[a]:(o[a]||0)+1}),{}),[s,i]=Object.entries(e).sort((o,a)=>a[1]-o[1])[0]||[];return i>r.length/2?t.map(o=>o!==s):t.map(()=>!1)},ne=r=>{let t=Array.isArray(r)?r:[];return t.length?t.map(s=>{var n,l;let i=s.action||s.service||s.choose&&"choose"||s.delay&&"delay"||s.event&&"event"||"";if(i==="hubbubb_home.mac_screen_sharing")return(n=s.data)!=null&&n.on?"Start Mac screen mirroring":"Stop Mac screen mirroring";let o={close_window:"Close the front window",full_screen:"Toggle full screen",mission_control:"Mission Control",spotlight:"Spotlight"};if(i==="hubbubb_home.agent_screen_input"&&o[(l=s.data)==null?void 0:l.action])return o[s.data.action];if(!i.includes("."))return i?i[0].toUpperCase()+i.slice(1):"Step";let[,a]=i.split(".");return a.replace(/_/g," ").replace(/^./,h=>h.toUpperCase())}).join(", "):"Does nothing yet"},Dt=(r,t=Date.now()/1e3)=>{if(!r)return"";let e=Math.max(0,t-r);return e<45?"just now":e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} days ago`},C=r=>{var t,e,s,i;return{enabled:(t=r==null?void 0:r.enabled)!=null?t:!0,repeat:(e=r==null?void 0:r.repeat)!=null?e:!1,people:(s=r==null?void 0:r.people)!=null?s:[],actions:(i=r==null?void 0:r.actions)!=null?i:[]}},le=(r,t)=>JSON.stringify(r)!==JSON.stringify(C(t)),J=[["listening","Listening","mdi:ear-hearing"],["thinking","Thinking","mdi:head-cog-outline"],["speaking","Speaking","mdi:account-voice"]],B=(r={})=>{var t,e,s,i,o,a,n;return p({move:(t=r.move)!=null?t:!0,satellites:(e=r.satellites)!=null?e:[],strength:(s=r.strength)!=null?s:.6,lights:(i=r.lights)!=null?i:!1,light_entities:(o=r.light_entities)!=null?o:[],brightness:(a=r.brightness)!=null?a:80,pause_while:(n=r.pause_while)!=null?n:""},Object.fromEntries(J.map(([l])=>{var h,u;return[`${l}_color`,(u=(h=r.colors)==null?void 0:h[l])!=null?u:null]})))},dt=r=>{let n=r,{listening_color:t,thinking_color:e,speaking_color:s,pause_while:i}=n,o=mt(n,["listening_color","thinking_color","speaking_color","pause_while"]),a=Object.fromEntries([["listening",t],["thinking",e],["speaking",s]].filter(([,l])=>Array.isArray(l)));return p(_(p({},o),{pause_while:i||null}),Object.keys(a).length?{colors:a}:{})},he,ce=()=>he||(he=(async()=>{var e,s,i;if(customElements.get("ha-form")&&customElements.get("ha-selector"))return;let r=await((e=window.loadCardHelpers)==null?void 0:e.call(window)),t=await(r==null?void 0:r.createCardElement({type:"entities",entities:[]}));await((i=(s=t==null?void 0:t.constructor)==null?void 0:s.getConfigElement)==null?void 0:i.call(s)),await customElements.whenDefined("ha-form")})()),H=class extends y{constructor(){super(),this._tab=(()=>{try{return localStorage.getItem("hubbubb-camera-tab")||"live"}catch(t){return"live"}})(),this._state=null,this._err="",this._busy=!1,this._gestures=null,this._open=null,this._form=null,this._flash=null,this._items=null,this._enrollName="",this._newGesture="",this._newMotion=!1,this._pets=null,this._petForm={name:"",kind:"dog",spot:"",result:""},this._confirm=null,this._ask={q:"",answer:null,busy:!1},this._teach={name:"",where:"",result:null,busy:!1},this._formReady=!1,this._viewKey=0,this._jarvis=null,this._jarvisForm=null}connectedCallback(){super.connectedCallback(),ce().then(()=>this._formReady=!0).catch(()=>this._formReady=!0),this._onVisible=()=>document.visibilityState==="visible"&&this._poll(),document.addEventListener("visibilitychange",this._onVisible),this._unsub=this.hass.connection.subscribeEvents(t=>this._fired(t.data),"hubbubb_home_gesture"),this._poll(),this._loadGestures()}disconnectedCallback(){var t;clearTimeout(this._timer),document.removeEventListener("visibilitychange",this._onVisible),(t=this._unsub)==null||t.then(e=>e()).catch(()=>{}),super.disconnectedCallback()}async _call(t,e={},s=!0){let i=await this.hass.callWS(p({type:"call_service",domain:"hubbubb_home",service:t,service_data:e},s?{return_response:!0}:{}));return(i==null?void 0:i.response)||{}}async _try(t){this._busy=!0,this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}finally{this._busy=!1}}async _poll(){var s,i,o,a;if(clearTimeout(this._timer),document.visibilityState!=="visible"||!this.isConnected)return;let t=(s=this._state)==null?void 0:s.connected;try{this._state=await this._call("camera_state"),t===!1&&this._state.connected&&this._viewKey++,this._err.startsWith("The camera")&&(this._err="")}catch(n){this._state={connected:!1,status:(n==null?void 0:n.message)||String(n)}}this._tab==="jarvis"&&this._loadJarvis(!1),this._tab==="tuning"&&!this._picture&&this._loadPicture(),(this._tab==="people"||this._tab==="live"&&!this._pets)&&(this._pets=await this._call("camera_pets").catch(()=>this._pets));let e=["live","people","jarvis"].includes(this._tab)||((i=this._state)==null?void 0:i.enrolling)||((a=(o=this._state)==null?void 0:o.gestures)==null?void 0:a.teaching);this._timer=setTimeout(()=>this._poll(),e?1500:6e3)}async _loadGestures(){let t=await this._try(()=>this._call("gestures_get"));t&&(this._gestures=t)}async _loadJarvis(t){try{this._jarvis=await this._call("jarvis_presence_get"),(t||!this._jarvisForm)&&(this._jarvisForm=B(this._jarvis.config))}catch(e){this._err=(e==null?void 0:e.message)||String(e)}}async _loadItems(){let t=await this._try(()=>this._call("camera_items"));t&&(this._items=t.items||[])}_fired(t){t.held||(this._flash=t,clearTimeout(this._flashTimer),this._flashTimer=setTimeout(()=>this._flash=null,2500),this._gestures&&(this._gestures=_(p({},this._gestures),{last:_(p({},t),{ts:Date.now()/1e3})})))}_go(t){this._tab=t,this._confirm=null;try{localStorage.setItem("hubbubb-camera-tab",t)}catch(e){}t==="things"&&!this._items&&this._loadItems(),t==="jarvis"&&this._loadJarvis(!0),t==="tuning"&&this._loadPicture(),this._poll()}get _cameraEntity(){var t;return(t=Object.values(this.hass.entities||{}).find(e=>e.platform==="hubbubb_home"&&e.entity_id.startsWith("camera.")))==null?void 0:t.entity_id}async _settings(t){let e=await this._try(()=>this._call("camera_settings",t));e&&(this._state=e)}render(){var e,s,i;let t=this._state;return c`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Camera</div>
        <span class="pill ${t!=null&&t.connected?"ok":"off"}">
          <span class="dot"></span>${t===null?"Connecting\u2026":t.connected?"Connected":"Offline"}
        </span>
      </div>
      <nav class="tabs" role="tablist">
        ${se.map(([o,a,n])=>c`<button role="tab" aria-selected=${this._tab===o} class=${this._tab===o?"on":""} @click=${()=>this._go(o)}>
            <ha-icon .icon=${n}></ha-icon><span>${a}</span>
          </button>`)}
      </nav>
      ${this._err?c`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:d}
      ${t&&!t.connected&&t.status?c`<div class="notice"><ha-icon icon="mdi:lan-disconnect"></ha-icon><div><b>The camera isn't reachable.</b><br />${t.status}<br /><span class="muted">It runs as Hubbubb Local Camera on the Mac and starts at login.</span></div></div>`:d}
      <main>
        ${(i=(s=(e={live:()=>this._renderLive(),gestures:()=>this._renderGestures(),people:()=>this._renderPeople(),things:()=>this._renderThings(),jarvis:()=>this._renderJarvis(),tuning:()=>this._renderTuning()})[this._tab])==null?void 0:s.call(e))!=null?i:d}
      </main>
    `}_renderView(t=!1){var i,o;let e=this._cameraEntity,s=e&&((o=(i=this.hass.states[e])==null?void 0:i.attributes)==null?void 0:o.access_token);return!e||!s?c`<div class="view empty ${t?"small":""}">No live view yet.</div>`:c`<div class="view steer ${t?"small":""}"
        title="Drag to move the camera · pinch or scroll to zoom · click someone to follow them"
        @pointerdown=${this._pointerDown} @pointermove=${this._pointerMove} @pointerup=${this._pointerUp}
        @pointercancel=${a=>this._pointerUp(a,!0)} @wheel=${this._wheel}>
      <img
        alt="Live camera view" draggable="false"
        src=${`/api/camera_proxy_stream/${e}?token=${s}&v=${this._viewKey}`}
        @error=${()=>{clearTimeout(this._retry),this._retry=setTimeout(()=>this._viewKey++,2e3)}}
      />
      ${this._flash?c`<div class="toast"><ha-icon .icon=${this._iconFor(this._flash.gesture)}></ha-icon>${this._titleFor(this._flash.gesture)}${this._flash.person?c` · ${this._flash.person}`:d}</div>`:d}
    </div>`}_pointerDown(t){let e=t.currentTarget.querySelector("img");if(!(!e||t.button)){if(t.currentTarget.setPointerCapture(t.pointerId),(this._touches||(this._touches=new Map)).set(t.pointerId,{x:t.clientX,y:t.clientY}),this._touches.size===2){this._drag=null,this._pinch={span:this._span(),zoom:this._zoomNow()};return}this._drag={x:t.clientX,y:t.clientY,sentX:t.clientX,sentY:t.clientY,moved:!1,last:0,rect:e.getBoundingClientRect()}}}_pointerMove(t){var s;if((s=this._touches)!=null&&s.has(t.pointerId)&&this._touches.set(t.pointerId,{x:t.clientX,y:t.clientY}),this._pinch){this._touches.size===2&&this._zoomTo(this._pinch.zoom*this._span()/this._pinch.span);return}let e=this._drag;!e||!e.moved&&Math.hypot(t.clientX-e.x,t.clientY-e.y)<8||(e.moved=!0,Date.now()-e.last>150&&this._sendDrag(t))}_span(){let[t,e]=[...this._touches.values()];return Math.max(1,Math.hypot(t.x-e.x,t.y-e.y))}_zoomNow(){var t,e,s,i,o,a,n;return(n=(a=(s=this._zoomGoal)!=null?s:(e=(t=this._state)==null?void 0:t.hardware)==null?void 0:e.zoom_actual)!=null?a:(o=(i=this._state)==null?void 0:i.settings)==null?void 0:o.zoom)!=null?n:1}_wheel(t){t.preventDefault(),this._zoomTo(this._zoomNow()*Math.exp(-t.deltaY*(t.ctrlKey?.01:.002)))}_zoomTo(t){if(this._zoomGoal=Math.round(Math.max(1,Math.min(4,t))*20)/20,this._zoomTimer)return;let e=()=>{let s=this._zoomGoal;s!==this._zoomSent?(this._zoomSent=s,this._settings({zoom:s}),this._zoomTimer=setTimeout(e,150)):(this._zoomTimer=null,clearTimeout(this._zoomIdle),this._zoomIdle=setTimeout(()=>this._zoomGoal=this._zoomSent=void 0,1e3))};e()}_pointerUp(t,e=!1){var i,o;if((i=this._touches)==null||i.delete(t.pointerId),this._pinch){(o=this._touches)!=null&&o.size||(this._pinch=null);return}let s=this._drag;if(!s||e)return void(this._drag=null);if(s.moved)this._sendDrag(t);else{let a=(t.clientX-s.rect.left)/s.rect.width,n=(t.clientY-s.rect.top)/s.rect.height;a>=0&&a<=1&&n>=0&&n<=1&&this._call("camera_focus",{x:a,y:n}).then(()=>this._poll()).catch(l=>this._err=(l==null?void 0:l.message)||String(l))}this._drag=null}_sendDrag(t){let e=this._drag,s=a=>Math.max(-1,Math.min(1,a)),i=s((t.clientX-e.sentX)/e.rect.width),o=s((t.clientY-e.sentY)/e.rect.height);!i&&!o||(Object.assign(e,{sentX:t.clientX,sentY:t.clientY,last:Date.now()}),this._call("camera_drag",{dx:i,dy:o}).catch(a=>this._err=(a==null?void 0:a.message)||String(a)))}_titleFor(t){var e;return((e=this._catalog.find(s=>s.id===t))==null?void 0:e.title)||t}get _catalog(){var e,s;let t=((e=this._state)==null?void 0:e.gestures)||{};return oe((s=this._gestures)==null?void 0:s.catalog,t.taught,t.teaching,t.motions)}_iconFor(t){var e;return((e=this._catalog.find(s=>s.id===t))==null?void 0:e.icon)||"mdi:hand-wave"}_renderLive(){var o,a;let t=this._state||{},e=t.settings||{},s=t.people||[],i=t.animals||[];return c`
      <div class="live">
        <div>
          ${this._renderView()}
          <div class="status">${t.status||""}</div>
        </div>
        <div class="side">
          <section class="card">
            <h3>In view</h3>
            <div class="chips">
              ${s.map(n=>c`<span class="chip person"><ha-icon icon="mdi:account"></ha-icon>${n}</span>`)}
              ${i.map(n=>c`<span class="chip animal"><ha-icon icon="mdi:paw"></ha-icon>${n}</span>`)}
              ${!s.length&&!i.length?c`<span class="muted">Nobody recognized</span>`:d}
            </div>
            ${this._renderAnimalNaming(t)}
          </section>
          <section class="card">
            <h3>Camera</h3>
            <p class="muted">Drag the picture to move the camera; pinch or scroll to zoom. Click a person or animal to follow just them.</p>
            <div class="pan">
              <button ?disabled=${this._busy} title="Drops this direction from the room map and the room watch, for good"
                @click=${()=>this._neverHere()}>${this._confirm==="never"?"Really never look here?":c`<ha-icon icon="mdi:eye-off"></ha-icon> Never look here`}</button>
            </div>
            ${t.focus?c`<div class="pan"><button @click=${()=>this._try(()=>this._call("camera_focus",{})).then(()=>this._poll())}><ha-icon icon="mdi:account-group"></ha-icon> Follow everyone again</button></div>`:d}
            ${this._formReady?c`<ha-form
                  .hass=${this.hass}
                  .data=${{follow:e.follow,auto_zoom:e.auto_zoom,zoom:(o=e.zoom)!=null?o:1,zoomMax:(a=e.zoomMax)!=null?a:4}}
                  .schema=${[{name:"follow",selector:{boolean:{}}},{name:"auto_zoom",selector:{boolean:{}}},e.auto_zoom?{name:"zoomMax",selector:{number:{min:1,max:4,step:.1,mode:"slider",unit_of_measurement:"\xD7"}}}:{name:"zoom",selector:{number:{min:1,max:4,step:.1,mode:"slider"}}}]}
                  .computeLabel=${n=>({follow:"Follow people",auto_zoom:"Zoom to fit automatically",zoom:"Zoom",zoomMax:"Zoom in no further than"})[n.name]}
                  @value-changed=${n=>this._settingsFrom(n.detail.value,e)}
                ></ha-form>`:d}
          </section>
          <section class="card">
            <h3>Ask the camera</h3>
            <form class="inline" @submit=${n=>{n.preventDefault(),this._askCamera()}}>
              <input placeholder="Where are my keys?" .value=${this._ask.q} @input=${n=>this._ask=_(p({},this._ask),{q:n.target.value})} />
              <button class="primary" ?disabled=${this._ask.busy||!this._ask.q.trim()}>${this._ask.busy?"Looking\u2026":"Ask"}</button>
            </form>
            ${this._ask.answer?c`<p class="answer">${this._ask.answer}</p>`:d}
          </section>
        </div>
      </div>
    `}_settingsFrom(t,e){let s={};for(let i of["follow","auto_zoom","zoom","zoomMax"])t[i]!==void 0&&t[i]!==e[i]&&(s[i]=t[i]);Object.keys(s).length&&this._settings(s)}async _askCamera(){this._ask=_(p({},this._ask),{busy:!0,answer:null});try{let t=await this._call("camera_look",{question:this._ask.q.trim()}),e=!t.found&&t.last_seen?` Last seen ${t.last_seen}`:"";this._ask=_(p({},this._ask),{busy:!1,answer:(t.answer||t.error||"No answer.")+e})}catch(t){this._ask=_(p({},this._ask),{busy:!1,answer:(t==null?void 0:t.message)||String(t)})}}_renderGestures(){var e,s,i,o;let t=this._gestures;return t?c`
      <p class="intro">Look at the camera and hold a gesture steady at chest height for about a second. Assign each one any Home Assistant actions — the same editor automations use. Hands at the keyboard, near your face, or while you look elsewhere never count.</p>
      <section class="card">
        <ha-formfield label="Gestures on — turn off for meetings or when talking with your hands">
          <ha-switch .checked=${t.on!==!1} ?disabled=${this._busy} @change=${a=>this._gesturesOn(a.target.checked)}></ha-switch>
        </ha-formfield>
      </section>
      <div class="gestures ${t.on===!1?"disabled":""}">
        ${this._catalog.map(a=>this._renderGesture(a,t.gestures[a.id]))}
      </div>
      <section class="card">
        <h3>New gesture</h3>
        <p class="muted small">A <b>shape</b> is a hand held still (peace sign); pick one that isn't close to another gesture. A <b>motion</b> is a movement — a swipe, two hands opening, turning a knob — with one hand or both; you'll record it a few times, one at a time.</p>
        <form class="inline wrap" @submit=${a=>{a.preventDefault(),this._createGesture()}}>
          <input placeholder=${this._newMotion?"Name, e.g. Swipe left":"Name, e.g. Peace sign"} .value=${this._newGesture} @input=${a=>this._newGesture=a.target.value} />
          <select .value=${this._newMotion?"motion":"shape"} @change=${a=>this._newMotion=a.target.value==="motion"}>
            <option value="shape">Shape</option>
            <option value="motion">Motion</option>
          </select>
          <button class="primary" ?disabled=${this._busy||!!((s=(e=this._state)==null?void 0:e.gestures)!=null&&s.teaching)||!Ut(this._newGesture)}>Teach it</button>
          ${(o=(i=this._state)==null?void 0:i.gestures)!=null&&o.teaching?c`<button type="button" @click=${()=>this._try(()=>this._call("camera_gesture_teach",{gesture:this._state.gestures.teaching.gesture,cancel:!0})).then(()=>this._poll())}>Stop teaching</button>`:d}
        </form>
      </section>
    `:c`<div class="empty">Loading gestures…</div>`}async _createGesture(){var e,s;let t=Ut(this._newGesture);t&&(await this._try(()=>this._call("camera_gesture_teach",{gesture:t,motion:this._newMotion})),this._newGesture="",this._open=t,this._form=C((s=(e=this._gestures)==null?void 0:e.gestures)==null?void 0:s[t]),this._poll())}async _gesturesOn(t){await this._try(()=>this._call("gestures_enable",{on:t},!1)),this._loadGestures()}_renderGesture(t,e){var l,h,u,m,g,f;let s=this._open===t.id,i=s?this._form:C(e),o=((l=this._flash)==null?void 0:l.gesture)===t.id,a=(m=(u=(h=this._state)==null?void 0:h.gestures)==null?void 0:u.taught)==null?void 0:m[t.id],n=((g=this._gestures.last)==null?void 0:g.gesture)===t.id?this._gestures.last:null;return c`
      <section class="card gesture ${s?"open":""} ${o?"lit":""} ${i.enabled?"":"disabled"}">
        <button class="ghead" aria-expanded=${s} @click=${()=>this._toggleGesture(t.id,e)}>
          <span class="gicon"><ha-icon .icon=${t.icon}></ha-icon></span>
          <span class="gtext">
            <span class="name">${t.title} <span class="badge ${a?"on":""}">${a?"Taught":t.custom?"Not taught yet":"Built-in shape"}</span></span>
            <span class="muted">${t.how}</span>
            <span class="summary">${i.enabled?ne(e==null?void 0:e.actions):"Turned off"}${e!=null&&e.repeat?" \xB7 repeats while held":""}${(f=e==null?void 0:e.people)!=null&&f.length?` \xB7 only ${e.people.join(", ")}`:""}</span>
          </span>
          ${n?c`<span class="muted when">${n.person?`${n.person}, `:""}${Dt(n.ts)}</span>`:d}
          <ha-icon class="chev" icon=${s?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${s?this._renderGestureEditor(t):d}
      </section>
    `}_toggleGesture(t,e){if(this._open===t){this._open=null,this._form=null;return}this._open=t,this._form=C(e)}_renderTeach(t){var o,a,n,l;let e=((o=this._state)==null?void 0:o.gestures)||{},s=e.teaching,i=(a=e.taught)==null?void 0:a[t.id];return(s==null?void 0:s.gesture)===t.id?c`<div class="teach-box">
        <div class="teach-row">
          <div class="teach-view">${this._renderView(!0)}</div>
          <div>
            <div class="name">Teaching ${t.title}…</div>
            ${s.motion?d:c`<div class="progress"><div style=${`width:${Math.round(100*s.samples/s.target)}%`}></div></div>`}
            <p class="muted">${((n=this._state)==null?void 0:n.status)||""}</p>
            <p class="muted small">${s.motion?c`Look at the camera and do ${t.title.toLowerCase()} once, the way you'll do it for real, then drop your hand. It records just that one.`:c`Look at the camera, hold ${t.title.toLowerCase()} at chest height, and move it around a little — closer, further, tilted — so it learns your hand from every angle.`}</p>
            <button @click=${()=>this._try(()=>this._call("camera_gesture_teach",{gesture:t.id,cancel:!0})).then(()=>this._poll())}>Stop teaching</button>
          </div>
        </div>
      </div>`:t.motion?this._renderMotionSamples(t,((l=e.motion_samples)==null?void 0:l[t.id])||[],s):c`<div class="teach-box">
      <div class="teach-row-inline">
        <div class="grow">
          <div class="name">${i?`Taught from your hand (${i} samples)`:"Using the built-in shape"}</div>
          <div class="muted small">${i?"Re-teach it if it's being missed or mistaken for another gesture.":"Teach it your way of doing it \u2014 it takes 3 seconds and makes it far more reliable."}</div>
        </div>
        <button class="primary" ?disabled=${this._busy||!!s} @click=${()=>this._try(()=>this._call("camera_gesture_teach",{gesture:t.id,motion:!!t.motion})).then(()=>this._poll())}>${i?"Re-teach":"Teach it"}</button>
        ${i?c`<button ?disabled=${this._busy||!!s} @click=${()=>this._forgetTeach(t.id)}>${this._confirm===`g:${t.id}`?"Really forget?":"Forget"}</button>`:d}
      </div>
    </div>`}_renderMotionSamples(t,e,s){let i=re(e);return c`<div class="teach-box">
      <div class="teach-row-inline">
        <div class="grow">
          <div class="name">${e.length?`Taught from your hand (${e.length} sample${e.length===1?"":"s"})`:"Not taught yet"}</div>
          <div class="muted small">Record it one at a time; 3 to 5 good ones is plenty. Delete any that don't look like the others.</div>
        </div>
        <button class="primary" ?disabled=${this._busy||!!s} @click=${()=>this._try(()=>this._call("camera_gesture_teach",{gesture:t.id,motion:!0})).then(()=>this._poll())}>Record one</button>
        ${e.length?c`<button ?disabled=${this._busy||!!s} @click=${()=>this._forgetTeach(t.id)}>${this._confirm===`g:${t.id}`?"Really forget all?":"Forget all"}</button>`:d}
      </div>
      ${e.length?c`<div class="chips samples">${e.map((o,a)=>c`<span class="sample ${i[a]?"odd":""}">
        ${a+1}. ${Ft(o)}${i[a]?c` <b>· unlike the others</b>`:d}
        <button class="x" title="Delete this sample" aria-label=${`Delete sample ${a+1}`} ?disabled=${this._busy} @click=${()=>this._forgetSample(t.id,a)}>×</button>
      </span>`)}</div>`:d}
    </div>`}async _forgetSample(t,e){await this._try(()=>this._call("camera_gesture_forget",{gesture:t,sample:e})),this._poll()}async _forgetTeach(t){if(this._confirm!==`g:${t}`)return this._confirm=`g:${t}`;this._confirm=null,await this._try(()=>this._call("camera_gesture_forget",{gesture:t})),this._poll()}_renderGestureEditor(t){var o;let e=(((o=this._state)==null?void 0:o.enrolled)||[]).map(a=>a.name),s=this._gestures.gestures[t.id],i=le(this._form,s);return this._formReady?c`
      <div class="editor">
        ${this._renderTeach(t)}
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${[{name:"enabled",selector:{boolean:{}}},{name:"repeat",selector:{boolean:{}}},...e.length?[{name:"people",selector:{select:{multiple:!0,mode:"list",options:e.map(a=>({value:a,label:a}))}}}]:[]]}
          .computeLabel=${a=>({enabled:"On",repeat:"Repeat while held",people:"Only for these people"})[a.name]}
          .computeHelper=${a=>({repeat:"Runs again every \u2153 second while you hold it \u2014 for things like volume.",people:"Leave all unticked to let anyone use it."})[a.name]}
          @value-changed=${a=>this._form=p(p({},this._form),a.detail.value)}
        ></ha-form>
        <h4>Then do</h4>
        <ha-form
          .hass=${this.hass}
          .data=${{actions:this._form.actions}}
          .schema=${[{name:"actions",selector:{action:{}}}]}
          .computeLabel=${()=>""}
          @value-changed=${a=>this._form=_(p({},this._form),{actions:a.detail.value.actions||[]})}
        ></ha-form>
        <p class="muted small">Actions can use <code>{{ person }}</code> — who made the gesture, if recognized.</p>
        <div class="actions">
          <button class="primary" ?disabled=${this._busy||!i} @click=${()=>this._saveGesture(t.id)}>${i?"Save":"Saved"}</button>
          <button ?disabled=${this._busy||!this._form.actions.length} @click=${()=>this._testGesture(t.id,i)}>Test</button>
          ${i?c`<button ?disabled=${this._busy} @click=${()=>this._form=C(s)}>Undo changes</button>`:d}
        </div>
      </div>
    `:c`<div class="empty">Loading the editor…</div>`}async _saveGesture(t){let e=await this._try(()=>this._call("gesture_save",p({gesture:t},this._form)));e&&(this._gestures=_(p({},this._gestures),{gestures:_(p({},this._gestures.gestures),{[t]:e.saved})}),this._form=C(e.saved))}async _testGesture(t,e){e&&await this._saveGesture(t),!this._err&&await this._try(()=>this._call("gesture_test",{gesture:t},!1))}_renderPeople(){let t=this._state||{},e=t.enrolled||[],s=t.enrolling;return c`
      <div class="two">
        <section class="card">
          <h3>Who the camera knows</h3>
          ${e.length?e.map(i=>c`<div class="row">
                  <ha-icon icon="mdi:account-circle"></ha-icon>
                  <div class="grow"><div class="name">${i.name}</div><div class="muted">${i.samples} face samples${(t.people||[]).includes(i.name)?" \xB7 in view now":""}</div></div>
                  <button ?disabled=${this._busy||s} @click=${()=>this._enroll(i.name)}>Re-enroll</button>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetPerson(i.name)}>${this._confirm===`p:${i.name}`?"Really forget?":"Forget"}</button>
                </div>`):c`<p class="muted">Nobody yet. Enroll each person once so the camera — and Jarvis — knows who's who.</p>`}
          <h3>Enroll someone</h3>
          ${s?c`<div class="enrolling">
                <div class="name">Enrolling ${s.name}…</div>
                <div class="progress"><div style=${`width:${Math.round(100*s.samples/s.target)}%`}></div></div>
                <p class="muted">${t.status}</p>
              </div>`:c`<form class="inline" @submit=${i=>{i.preventDefault(),this._enroll(this._enrollName.trim())}}>
                <input placeholder="Their name, as Jarvis should say it" .value=${this._enrollName} @input=${i=>this._enrollName=i.target.value} />
                <button class="primary" ?disabled=${this._busy||!this._enrollName.trim()}>Start</button>
              </form>
              <ol class="steps">
                <li>Only that person in view, facing the camera, a few steps away.</li>
                <li>Press Start and slowly turn the head left, right, up and down.</li>
                <li>Done in a few seconds. Face samples stay on the Mac.</li>
              </ol>`}
        </section>
        <div>${this._renderView(!0)}<div class="status">${t.status||""}</div></div>
      </div>
      ${this._renderPets()}
    `}_renderPets(){var n,l;let t=this._pets||{},e=Object.entries(t.pets||{}),s=Object.keys(t.spots||{}),i=t.pets_at||{},o=((n=this._state)==null?void 0:n.animals)||[],a=this._petForm;return c`
      <section class="card">
        <h3>Pets</h3>
        <p class="muted">Name your pet, then mark the door they wait at. When they wait there a while, Jarvis tells you they may need to go out.</p>
        ${e.map(([h,u])=>{var m,g;return c`<div class="row">
            <ha-icon icon=${u==="cat"?"mdi:cat":"mdi:dog"}></ha-icon>
            <div class="grow"><div class="name">${h}</div><div class="muted">${u}${(g=(m=this._pets)==null?void 0:m.by_sight)!=null&&g[h]?" \xB7 known by sight":""}${i[h]?` \xB7 at the ${i[h]} now`:o.includes(h)?" \xB7 in view now":""}</div></div>
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._petSave({name:h,forget:!0},`pet:${h}`)}>${this._confirm===`pet:${h}`?"Really forget?":"Forget"}</button>
          </div>`})}
        <form class="inline wrap" @submit=${h=>{h.preventDefault(),this._petSave({name:a.name.trim(),kind:a.kind})}}>
          <input placeholder="Pet's name, e.g. Vader" .value=${a.name} @input=${h=>this._petForm=_(p({},a),{name:h.target.value})} />
          <select .value=${a.kind} @change=${h=>this._petForm=_(p({},a),{kind:h.target.value})}>
            <option value="dog">Dog</option><option value="cat">Cat</option>
          </select>
          <button class="primary" ?disabled=${this._busy||!a.name.trim()}>Add pet</button>
        </form>
        <h3>Doors they wait at</h3>
        ${s.map(h=>c`<div class="row">
            <ha-icon icon="mdi:door"></ha-icon>
            <div class="grow"><div class="name">${h}</div></div>
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._petSpot({name:h,forget:!0},`spot:${h}`)}>${this._confirm===`spot:${h}`?"Really forget?":"Forget"}</button>
          </div>`)}
        <form class="inline wrap" @submit=${h=>{h.preventDefault(),this._petSpot({name:a.spot.trim()})}}>
          <input placeholder="Spot name, e.g. back door" .value=${a.spot} @input=${h=>this._petForm=_(p({},a),{spot:h.target.value})} />
          <button class="primary" ?disabled=${this._busy||!a.spot.trim()}>Mark where my pet is now</button>
        </form>
        <p class="muted">Do this while your pet stands at the door, in the camera's view.</p>
        ${a.result?c`<p class="answer">${a.result}</p>`:d}
        <label class="inline">Tell me after
          <input type="number" min="0.5" max="60" step="0.5" style="width:5em" .value=${String((l=t.wait_minutes)!=null?l:3)}
            @change=${h=>this._petSave({wait_minutes:Number(h.target.value)})} />
          minutes at a door</label>
      </section>
    `}async _petSave(t,e){if(e&&this._confirm!==e)return this._confirm=e;this._confirm=null;let s=await this._try(()=>this._call("camera_pets_save",t));s&&(this._pets=s,t.kind&&(this._petForm=_(p({},this._petForm),{name:""})))}async _petSpot(t,e){if(e&&this._confirm!==e)return this._confirm=e;this._confirm=null;let s=await this._try(()=>this._call("camera_pet_spot",t));s&&(this._petForm=_(p({},this._petForm),{spot:s.marked?"":this._petForm.spot,result:s.error||(s.marked?`Marked "${s.marked}" where ${s.by} is.`:"")}),this._pets=await this._call("camera_pets").catch(()=>this._pets))}async _enroll(t){if(!t)return;await this._try(()=>this._call("camera_enroll",{name:t}))&&(this._enrollName="",this._poll())}async _forgetPerson(t){if(this._confirm!==`p:${t}`)return this._confirm=`p:${t}`;this._confirm=null,await this._try(()=>this._call("camera_forget_person",{name:t})),this._poll()}_renderThings(){let t=this._teach;return c`
      <section class="card teach">
        <h3>Teach it something</h3>
        <p class="muted">Hold the thing up to the camera and name it — or say where it is. Next time you ask Jarvis where it is, the camera knows what to look for. You can also just say "Jarvis, this is my …" while holding it.</p>
        <form class="inline wrap" @submit=${e=>{e.preventDefault(),this._learn()}}>
          <input placeholder="Name, e.g. AirPods case" .value=${t.name} @input=${e=>this._teach=_(p({},t),{name:e.target.value})} />
          <input placeholder="Where (optional), e.g. on the shelf by the door" .value=${t.where} @input=${e=>this._teach=_(p({},t),{where:e.target.value})} />
          <button class="primary" ?disabled=${t.busy||!t.name.trim()}>${t.busy?"Looking\u2026":"Teach"}</button>
        </form>
        ${t.result?c`<p class="answer">${t.result}</p>`:d}
      </section>
      ${this._items===null?c`<div class="empty">Loading…</div>`:this._items.length?c`<div class="items">
              ${this._items.map(e=>c`<section class="card item">
                  ${e.photo?c`<img alt=${e.name} src=${`data:image/jpeg;base64,${e.photo}`} />`:c`<div class="noimg"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`}
                  <div class="name">${e.name}</div>
                  <div class="muted">${e.description}</div>
                  <div class="seen">${e.last_seen_at?c`<ha-icon icon="mdi:map-marker-outline"></ha-icon>${Dt(e.last_seen_at)}: ${e.last_seen}`:c`<span class="muted">Not spotted yet</span>`}</div>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetItem(e.name)}>${this._confirm===`i:${e.name}`?"Really forget?":"Forget"}</button>
                </section>`)}
            </div>`:c`<div class="empty">Nothing taught yet.</div>`}
    `}async _learn(){let t=this._teach;this._teach=_(p({},t),{busy:!0,result:null});try{let e=await this._call("camera_learn",{name:t.name.trim(),hint:t.where.trim()});this._teach=e.learned?{name:"",where:"",busy:!1,result:`Got it \u2014 ${e.learned}: ${e.looks_like}`}:_(p({},t),{busy:!1,result:e.error||"It couldn't make that out."}),e.learned&&this._loadItems()}catch(e){this._teach=_(p({},t),{busy:!1,result:(e==null?void 0:e.message)||String(e)})}}async _forgetItem(t){if(this._confirm!==`i:${t}`)return this._confirm=`i:${t}`;this._confirm=null,await this._try(()=>this._call("camera_forget_item",{name:t})),this._loadItems()}_renderJarvis(){let t=this._jarvis,e=this._jarvisForm;if(!t||!e||!this._formReady)return c`<div class="empty">Loading…</div>`;let s=JSON.stringify(dt(e))!==JSON.stringify(dt(B(t.config))),i=J.find(([o])=>o===t.mood);return c`
      <p class="intro">While Jarvis listens, thinks and talks through your Voice puck, the camera can move like it's paying attention, and lights can glow to show what it's doing. Both go back to normal when Jarvis is done.</p>
      <div class="two">
        <section class="card">
          <h3>Now</h3>
          <div class="mood ${t.mood}">
            <ha-icon .icon=${(i==null?void 0:i[2])||"mdi:sleep"}></ha-icon>
            <span>${i?i[1]:"Idle"}</span>
          </div>
          <h3>Preview</h3>
          <div class="actions">
            ${J.map(([o,a,n])=>c`<button ?disabled=${this._busy||s} title=${s?"Save first":""} @click=${()=>this._try(()=>this._call("jarvis_presence_test",{mood:o},!1))}><ha-icon .icon=${n}></ha-icon> ${a}</button>`)}
          </div>
          <p class="muted small">Plays for 4 seconds, then puts the camera and lights back.</p>
        </section>
        <section class="card">
          <h3>Camera movement</h3>
          <ha-form
            .hass=${this.hass}
            .data=${e}
            .schema=${[{name:"move",selector:{boolean:{}}},...e.move?[{name:"strength",selector:{number:{min:.1,max:1,step:.05,mode:"slider"}}}]:[],{name:"satellites",selector:{entity:{domain:"assist_satellite",multiple:!0}}}]}
            .computeLabel=${o=>({move:"Move the camera while Jarvis talks",strength:"How much it moves",satellites:"Which pucks"})[o.name]}
            .computeHelper=${o=>({strength:"A perk-up when listening, a glance while thinking, gentle nods while speaking.",satellites:"Leave empty to follow every voice puck."})[o.name]}
            @value-changed=${o=>this._jarvisForm=p(p({},this._jarvisForm),o.detail.value)}
          ></ha-form>
          <h3>Lights</h3>
          <ha-form
            .hass=${this.hass}
            .data=${e}
            .schema=${[{name:"lights",selector:{boolean:{}}},...e.lights?[{name:"light_entities",selector:{entity:{domain:"light",multiple:!0}}},{name:"brightness",selector:{number:{min:1,max:100,step:1,mode:"slider",unit_of_measurement:"%"}}},...J.map(([o])=>({name:`${o}_color`,selector:{color_rgb:{}}})),{name:"pause_while",selector:{entity:{}}}]:[]]}
            .computeLabel=${o=>({lights:"Tint lights while Jarvis talks",light_entities:"Which lights",brightness:"Brightness",listening_color:"Listening colour",thinking_color:"Thinking colour",speaking_color:"Speaking colour",pause_while:"Leave the lights alone while this is on"})[o.name]}
            .computeHelper=${o=>({light_entities:"Coloured lights near the TV work best, like the Hue Play bars.",pause_while:"For example the Sync Box's light sync, which owns those lights while it runs."})[o.name]}
            @value-changed=${o=>this._jarvisForm=p(p({},this._jarvisForm),o.detail.value)}
          ></ha-form>
          <div class="actions">
            <button class="primary" ?disabled=${this._busy||!s} @click=${()=>this._saveJarvis()}>${s?"Save":"Saved"}</button>
            ${s?c`<button ?disabled=${this._busy} @click=${()=>this._jarvisForm=B(t.config)}>Undo changes</button>`:d}
          </div>
        </section>
      </div>
    `}async _saveJarvis(){let t=await this._try(()=>this._call("jarvis_presence_save",dt(this._jarvisForm)));t&&(this._jarvis=_(p({},this._jarvis),{config:t.config}),this._jarvisForm=B(t.config))}_renderTuning(){var a,n;let t=this._state||{},e=t.settings||{},s=t.knobs||{},i=t.room||{},o=p({require_looking:e.require_looking},Object.fromEntries(W.map(([l])=>[l,e[l]])));return c`
      <div class="two">
        <section class="card">
          <h3>Tuning</h3>
          ${this._formReady&&Object.keys(s).length?c`<ha-form
                .hass=${this.hass}
                .data=${o}
                .schema=${[{name:"require_looking",selector:{boolean:{}}},...W.filter(([l])=>s[l]).map(([l,,,h])=>({name:l,selector:{number:{min:s[l].min,max:s[l].max,step:h,mode:"slider"}}}))]}
                .computeLabel=${l=>{var h;return l.name==="require_looking"?"Only when looking at the camera":(h=W.find(([u])=>u===l.name))==null?void 0:h[1]}}
                .computeHelper=${l=>{var h;return l.name==="require_looking"?"Gestures only count while the person faces the camera. The live view marks them \u201Clooking\u201D.":(h=W.find(([u])=>u===l.name))==null?void 0:h[2]}}
                @value-changed=${l=>this._knobs(l.detail.value,o)}
              ></ha-form>
              <div class="actions">
                <button ?disabled=${this._busy} @click=${()=>this._settings(p({require_looking:!0},Object.fromEntries(Object.entries(s).map(([l,h])=>[l,h.default]))))}>Reset to defaults</button>
              </div>`:c`<div class="empty">Waiting for the camera…</div>`}
        </section>
        <section class="card">
          <h3>Picture</h3>
          ${this._renderPicture()}
        </section>
        <section class="card">
          <h3>Room map</h3>
          ${i.learned?c`<p>The camera has learned where people spend time: <b>${Math.round(i.low)}° to ${Math.round(i.high)}°</b> of pan, from ${i.sightings} sightings. Searches stay inside that span, skipping walls, corners and the back of the TV.</p>`:c`<p>Still learning where people spend time: ${(a=i.sightings)!=null?a:0} of ${(n=i.needed)!=null?n:30} sightings. Until then it searches around where it last saw someone.</p>`}
          <div class="actions">
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._resetRoom()}>${this._confirm==="room"?"Really relearn?":"Relearn the room"}</button>
          </div>
          <p class="muted small">Relearn after moving the camera or the furniture.</p>
          ${(i.never||[]).length?c`<p>Never looks at: ${i.never.map(([l,h])=>`${Math.round(l)}\xB0 to ${Math.round(h)}\xB0`).join(", ")}.</p>
                <div class="actions"><button ?disabled=${this._busy} @click=${()=>this._try(()=>this._call("camera_room_never",{clear:!0})).then(()=>this._poll())}>Look everywhere again</button></div>`:c`<p class="muted small">Pointing at a window or a shelf nobody uses? Press <b>Never look here</b> on the Live tab while it's looking there.</p>`}
        </section>
      </div>
    `}async _loadPicture(){this._picture=await this._call("camera_picture").catch(()=>null)}_renderAnimalNaming(t){var a;let e=t.pet_learning;if(e)return c`<div class="teach-box">
        <div class="name">Learning what ${e.name} looks like… ${e.samples}/${e.target}</div>
        <div class="progress"><div style=${`width:${Math.round(100*e.samples/e.target)}%`}></div></div>
        <p class="muted small">Keep ${e.name} in view; moving around helps.</p>
        <button @click=${()=>this._try(()=>this._call("camera_pet_learn",{cancel:!0})).then(()=>this._poll())}>Stop</button>
      </div>`;let s=t.animal_boxes||[];if(!s.length)return d;let i=Object.keys(((a=this._pets)==null?void 0:a.pets)||{}),o=this._naming;return c`${s.map((n,l)=>c`<div class="row">
      <ha-icon icon=${n.kind==="cat"?"mdi:cat":"mdi:dog"}></ha-icon>
      <div class="grow"><div class="name">${n.name}</div><div class="muted small">${ie(n.box)} · Vision says ${n.kind}</div></div>
      ${(o==null?void 0:o.index)===l?c`<form class="inline wrap" @submit=${h=>{h.preventDefault(),this._learnPet(n)}}>
            <select .value=${o.name} @change=${h=>this._naming=_(p({},o),{name:h.target.value})}>
              ${i.map(h=>c`<option value=${h}>${h}</option>`)}
              <option value="">Someone new…</option>
            </select>
            ${o.name?d:c`<input placeholder="Name" .value=${o.newName} @input=${h=>this._naming=_(p({},o),{newName:h.target.value})} />
              <select .value=${o.kind} @change=${h=>this._naming=_(p({},o),{kind:h.target.value})}><option value="dog">Dog</option><option value="cat">Cat</option></select>`}
            <button class="primary" ?disabled=${this._busy||!(o.name||o.newName.trim())}>Learn</button>
            <button type="button" @click=${()=>this._naming=null}>Cancel</button>
          </form>`:c`<button ?disabled=${this._busy} @click=${()=>this._naming={index:l,name:i[0]||"",newName:"",kind:n.kind==="cat"?"cat":"dog"}}>This is…</button>`}
    </div>`)}`}async _learnPet(t){var o,a;let e=this._naming,s=e.name||e.newName.trim(),i=e.name?((a=(o=this._pets)==null?void 0:o.pets)==null?void 0:a[e.name])||"dog":e.kind;await this._try(()=>this._call("camera_pet_learn",{name:s,kind:i,box:t.box})),this._naming=null,this._poll()}_renderPicture(){var o,a;let t=this._picture;if(!t)return c`<div class="empty">Waiting for the camera…</div>`;let e=ct.filter(([n])=>t[n]&&t[n].max>t[n].min),s=Object.fromEntries(e.map(([n])=>[n,t[n].value])),i=((o=t.white_balance_auto)==null?void 0:o.value)===1;return c`
      <p class="muted small">${ae(Math.round(((a=t.iso)==null?void 0:a.value)||0))}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${e.map(([n])=>({name:n,selector:{number:{min:t[n].min,max:t[n].max,step:t[n].step,mode:"slider"}}}))}
        .computeLabel=${n=>{var l;return(l=ct.find(([h])=>h===n.name))==null?void 0:l[1]}}
        .computeHelper=${n=>{var l;return(l=ct.find(([h])=>h===n.name))==null?void 0:l[2]}}
        @value-changed=${n=>this._pictureChanged(n.detail.value,s)}
      ></ha-form>
      <div class="actions">
        <button ?disabled=${this._busy||i} @click=${()=>this._setPicture({white_balance_auto:1})}>${i?"White balance is automatic":"Automatic white balance"}</button>
        <button ?disabled=${this._busy} @click=${()=>this._setPicture({exposure:0,brightness:50,contrast:50,sharpness:50,white_balance_auto:1})}>Reset picture</button>
      </div>`}_pictureChanged(t,e){let s=Object.fromEntries(Object.entries(t).filter(([i,o])=>o!==void 0&&o!==e[i]));clearTimeout(this._pictureTimer),this._pictureTimer=setTimeout(()=>Object.keys(s).length&&this._setPicture(s),400)}async _setPicture(t){let e=await this._try(()=>this._call("camera_picture_set",t));e&&(this._picture=e)}_knobs(t,e){let s=Object.fromEntries(Object.entries(t).filter(([i,o])=>o!==void 0&&o!==e[i]));clearTimeout(this._knobTimer),Object.keys(s).length&&(this._knobTimer=setTimeout(()=>this._settings(s),300))}async _neverHere(){if(this._confirm!=="never")return this._confirm="never";this._confirm=null,await this._try(()=>this._call("camera_room_never",{})),this._poll()}async _resetRoom(){if(this._confirm!=="room")return this._confirm="room";this._confirm=null,await this._try(()=>this._call("camera_room_reset")),this._poll()}};q(H,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_tab:{state:!0},_state:{state:!0},_err:{state:!0},_busy:{state:!0},_gestures:{state:!0},_open:{state:!0},_form:{state:!0},_flash:{state:!0},_items:{state:!0},_enrollName:{state:!0},_newGesture:{state:!0},_newMotion:{state:!0},_confirm:{state:!0},_ask:{state:!0},_teach:{state:!0},_picture:{state:!0},_naming:{state:!0},_formReady:{state:!0},_viewKey:{state:!0},_jarvis:{state:!0},_jarvisForm:{state:!0},_pets:{state:!0},_petForm:{state:!0}}),q(H,"styles",X`
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-size: 14px;
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 56px;
      padding: 0 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      position: sticky;
      top: 0;
      z-index: 3;
    }
    .title { font-size: 20px; font-weight: 400; flex: 1; }
    .pill { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; padding: 4px 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.16); }
    .pill .dot { width: 8px; height: 8px; border-radius: 50%; background: #9e9e9e; }
    .pill.ok .dot { background: var(--success-color, #43a047); }
    .pill.off .dot { background: var(--error-color, #db4437); }
    .tabs {
      display: flex;
      gap: 4px;
      padding: 0 12px;
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      position: sticky;
      top: 56px;
      z-index: 2;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 12px 14px;
      border: 0;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      cursor: pointer;
      white-space: nowrap;
    }
    .tabs button.on { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .tabs ha-icon { --mdc-icon-size: 20px; }
    main { padding: 16px; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }
    .err, .notice {
      margin: 12px 16px 0;
      padding: 10px 14px;
      border-radius: 8px;
    }
    .err {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.14);
      color: var(--error-color, #db4437);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .err .x { opacity: 0.7; font-size: 12px; white-space: nowrap; }
    .notice { display: flex; gap: 12px; align-items: flex-start; background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.14); max-width: 1168px; margin-left: auto; margin-right: auto; }
    .card {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color);
      padding: 16px 20px;
      box-sizing: border-box;
    }
    h3 { margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--secondary-text-color); font-weight: 500; }
    h3:not(:first-child) { margin-top: 24px; }
    h4 { margin: 16px 0 4px; font-size: 14px; font-weight: 500; }
    .muted { color: var(--secondary-text-color); }
    .small { font-size: 12px; }
    .name { font-weight: 500; }
    .empty { color: var(--secondary-text-color); padding: 32px 12px; text-align: center; }
    .intro { color: var(--secondary-text-color); margin: 0 0 16px; max-width: 70ch; line-height: 1.5; }

    .live { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 16px; align-items: start; }
    .two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .side { display: grid; gap: 16px; }
    @media (max-width: 900px) {
      .live, .two { grid-template-columns: minmax(0, 1fr); }
      main { padding: 12px; }
    }
    .view { position: relative; aspect-ratio: 16 / 9; background: #000; border-radius: var(--ha-card-border-radius, 12px); overflow: hidden; }
    .view img { width: 100%; height: 100%; object-fit: contain; display: block; user-select: none; }
    .view.steer { cursor: grab; touch-action: none; }
    .view.steer:active { cursor: grabbing; }
    .view.empty { display: flex; align-items: center; justify-content: center; color: #bbb; padding: 0; }
    .status { color: var(--secondary-text-color); padding: 8px 4px 0; min-height: 20px; }
    .toast {
      position: absolute;
      left: 50%;
      top: 16px;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 999px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 500;
      animation: pop 160ms ease-out;
    }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, -6px); } }
    @media (prefers-reduced-motion: reduce) { .toast { animation: none; } }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .samples { margin-top: 10px; }
    .sample { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; padding: 2px 4px 2px 10px; border-radius: 999px; background: var(--secondary-background-color); }
    .sample.odd { outline: 1px solid var(--warning-color, #ffa600); }
    .sample .x { border: 0; background: none; color: inherit; font-size: 16px; line-height: 1; padding: 4px 8px; min-width: 32px; min-height: 32px; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px 4px 8px; border-radius: 999px; background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14); }
    .chip.animal { background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.18); }
    .chip ha-icon { --mdc-icon-size: 18px; }
    .pan { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 8px; }
    .round {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .round:hover { border-color: var(--primary-color); color: var(--primary-color); }

    input, select {
      flex: 1;
      min-width: 0;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    input:focus-visible, button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .inline { display: flex; gap: 8px; }
    .inline.wrap { flex-wrap: wrap; }
    .inline.wrap input { flex: 1 1 220px; }
    .inline.wrap select { flex: 0 0 auto; }
    button {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.danger { color: var(--error-color, #db4437); }
    button:disabled { opacity: 0.5; cursor: default; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    .answer { margin: 12px 0 0; padding: 10px 12px; border-radius: 8px; background: var(--primary-background-color); line-height: 1.5; }

    .gestures { display: grid; gap: 12px; }
    .gestures.disabled { opacity: 0.5; }
    .gesture { padding: 0; transition: border-color 160ms; }
    .gesture.lit { border-color: var(--primary-color); box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color, 3, 169, 244), 0.3); }
    .gesture.disabled .gicon { opacity: 0.4; }
    .ghead {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border: 0;
      background: none;
      text-align: left;
      border-radius: inherit;
    }
    .gicon {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
      color: var(--primary-color);
    }
    .gtext { flex: 1; min-width: 0; display: grid; gap: 2px; }
    .summary { font-size: 13px; }
    .when { font-size: 12px; white-space: nowrap; }
    .chev { color: var(--secondary-text-color); }
    .badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; margin-left: 6px; background: var(--divider-color); color: var(--secondary-text-color); vertical-align: 1px; }
    .badge.on { background: rgba(var(--rgb-success-color, 67, 160, 71), 0.18); color: var(--success-color, #43a047); }
    .teach-box { margin-bottom: 12px; padding: 12px; border-radius: 10px; background: var(--primary-background-color); }
    .teach-row { display: grid; grid-template-columns: minmax(0, 260px) minmax(0, 1fr); gap: 16px; align-items: start; }
    .teach-row-inline { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    @media (max-width: 600px) { .teach-row { grid-template-columns: minmax(0, 1fr); } }
    .editor { padding: 0 16px 16px; border-top: 1px solid var(--divider-color); padding-top: 12px; }
    code { font-size: 12px; background: var(--primary-background-color); padding: 1px 4px; border-radius: 4px; }

    .row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--divider-color); }
    .row:last-of-type { border-bottom: 0; }
    .row ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 32px; }
    .grow { flex: 1; min-width: 0; }
    .steps { color: var(--secondary-text-color); padding-left: 20px; line-height: 1.7; margin: 12px 0 0; }
    .progress { height: 8px; border-radius: 4px; background: var(--divider-color); overflow: hidden; margin: 8px 0; }
    .progress div { height: 100%; background: var(--primary-color); transition: width 300ms; }
    .view.small { max-width: 100%; }

    .mood { display: inline-flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 500; padding: 10px 16px; border-radius: 12px; background: var(--primary-background-color); }
    .mood ha-icon { --mdc-icon-size: 28px; color: var(--secondary-text-color); }
    .mood.listening ha-icon { color: rgb(0, 120, 255); }
    .mood.thinking ha-icon { color: rgb(255, 150, 0); }
    .mood.speaking ha-icon { color: rgb(0, 200, 180); }
    .actions button ha-icon { --mdc-icon-size: 18px; vertical-align: -3px; }
    .teach { margin-bottom: 16px; }
    .teach p { margin: 0 0 12px; line-height: 1.5; }
    .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .item { display: grid; gap: 6px; align-content: start; }
    .item img, .item .noimg { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; background: var(--primary-background-color); }
    .item .noimg { display: flex; align-items: center; justify-content: center; color: var(--secondary-text-color); }
    .item .seen { font-size: 13px; display: flex; gap: 4px; align-items: flex-start; }
    .item .seen ha-icon { --mdc-icon-size: 16px; flex: none; margin-top: 1px; }
    .item button { justify-self: start; margin-top: 4px; }
  `);customElements.define("hubbubb-camera",H);export{W as KNOBS,ct as PICTURE,Dt as ago,le as changed,Ut as customGestureId,oe as gestureCatalog,C as gestureForm,dt as jarvisConfig,B as jarvisForm,ae as lightNote,Ft as motionLabel,re as oddSamples,ne as summarizeActions,ie as whereInView};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
