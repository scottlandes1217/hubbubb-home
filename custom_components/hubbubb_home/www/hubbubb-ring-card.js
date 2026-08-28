var js=Object.defineProperty;var Rs=(r,t,e)=>t in r?js(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var Mt=(r,t,e)=>Rs(r,typeof t!="symbol"?t+"":t,e);var Vt=globalThis,Ft=Vt.ShadowRoot&&(Vt.ShadyCSS===void 0||Vt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),Fe=new WeakMap,At=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ft&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Fe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Fe.set(e,t))}return t}toString(){return this.cssText}},We=r=>new At(typeof r=="string"?r:r+"",void 0,pe),ue=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new At(e,r,pe)},Qe=(r,t)=>{if(Ft)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Vt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},fe=Ft?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return We(e)})(r):r;var{is:zs,defineProperty:Os,getOwnPropertyDescriptor:Is,getOwnPropertyNames:Bs,getOwnPropertySymbols:Ls,getPrototypeOf:Us}=Object,st=globalThis,Ke=st.trustedTypes,Hs=Ke?Ke.emptyScript:"",Ns=st.reactiveElementPolyfillSupport,St=(r,t)=>r,_e={toAttribute(r,t){switch(t){case Boolean:r=r?Hs:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Ye=(r,t)=>!zs(r,t),Ge={attribute:!0,type:String,converter:_e,reflect:!1,useDefault:!1,hasChanged:Ye};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),st.litPropertyMetadata??(st.litPropertyMetadata=new WeakMap);var J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ge){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Os(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=Is(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let a=i?.call(this);n?.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ge}static _$Ei(){if(this.hasOwnProperty(St("elementProperties")))return;let t=Us(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(St("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(St("properties"))){let e=this.properties,s=[...Bs(e),...Ls(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(fe(i))}else t!==void 0&&e.push(fe(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:_e).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:_e;this._$Em=i;let a=o.fromAttribute(e,n.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??(s=o.getPropertyOptions(t)),!((s.hasChanged??Ye)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[St("elementProperties")]=new Map,J[St("finalized")]=new Map,Ns?.({ReactiveElement:J}),(st.reactiveElementVersions??(st.reactiveElementVersions=[])).push("2.1.2");var Et=globalThis,Je=r=>r,Wt=Et.trustedTypes,Xe=Wt?Wt.createPolicy("lit-html",{createHTML:r=>r}):void 0,me="$lit$",X=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+X,Ds=`<${be}>`,rt=document,Ct=()=>rt.createComment(""),Pt=r=>r===null||typeof r!="object"&&typeof r!="function",ve=Array.isArray,ns=r=>ve(r)||typeof r?.[Symbol.iterator]=="function",ge=`[ 	
\f\r]`,Tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ze=/-->/g,ts=/>/g,ot=RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),es=/'/g,ss=/"/g,os=/^(?:script|style|textarea|title)$/i,xe=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),x=xe(1),hi=xe(2),ci=xe(3),W=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),is=new WeakMap,at=rt.createTreeWalker(rt,129);function as(r,t){if(!ve(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xe!==void 0?Xe.createHTML(t):t}var rs=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=Tt;for(let a=0;a<e;a++){let h=r[a],c,d,u=-1,p=0;for(;p<h.length&&(o.lastIndex=p,d=o.exec(h),d!==null);)p=o.lastIndex,o===Tt?d[1]==="!--"?o=Ze:d[1]!==void 0?o=ts:d[2]!==void 0?(os.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=ot):d[3]!==void 0&&(o=ot):o===ot?d[0]===">"?(o=i??Tt,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?ot:d[3]==='"'?ss:es):o===ss||o===es?o=ot:o===Ze||o===ts?o=Tt:(o=ot,i=void 0);let f=o===ot&&r[a+1].startsWith("/>")?" ":"";n+=o===Tt?h+Ds:u>=0?(s.push(c),h.slice(0,u)+me+h.slice(u)+X+f):h+X+(u===-2?a:f)}return[as(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},jt=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,a=t.length-1,h=this.parts,[c,d]=rs(t,e);if(this.el=r.createElement(c,s),at.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=at.nextNode())!==null&&h.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(me)){let p=d[o++],f=i.getAttribute(u).split(X),m=/([.?@])?(.*)/.exec(p);h.push({type:1,index:n,name:m[2],strings:f,ctor:m[1]==="."?Kt:m[1]==="?"?Gt:m[1]==="@"?Yt:ht}),i.removeAttribute(u)}else u.startsWith(X)&&(h.push({type:6,index:n}),i.removeAttribute(u));if(os.test(i.tagName)){let u=i.textContent.split(X),p=u.length-1;if(p>0){i.textContent=Wt?Wt.emptyScript:"";for(let f=0;f<p;f++)i.append(u[f],Ct()),at.nextNode(),h.push({type:2,index:++n});i.append(u[p],Ct())}}}else if(i.nodeType===8)if(i.data===be)h.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(X,u+1))!==-1;)h.push({type:7,index:n}),u+=X.length-1}n++}}static createElement(t,e){let s=rt.createElement("template");return s.innerHTML=t,s}};function lt(r,t,e=r,s){if(t===W)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=Pt(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=lt(r,i._$AS(r,t.values),i,s)),t}var Qt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??rt).importNode(e,!0);at.currentNode=i;let n=at.nextNode(),o=0,a=0,h=s[0];for(;h!==void 0;){if(o===h.index){let c;h.type===2?c=new _t(n,n.nextSibling,this,t):h.type===1?c=new h.ctor(n,h.name,h.strings,this,t):h.type===6&&(c=new Jt(n,this,t)),this._$AV.push(c),h=s[++a]}o!==h?.index&&(n=at.nextNode(),o++)}return at.currentNode=rt,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},_t=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),Pt(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==W&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ns(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&Pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(rt.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=jt.createElement(as(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new Qt(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=is.get(t.strings);return e===void 0&&is.set(t.strings,e=new jt(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(Ct()),this.O(Ct()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=Je(t).nextSibling;Je(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=lt(this,t,e,0),o=!Pt(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{let a=t,h,c;for(t=n[0],h=0;h<n.length-1;h++)c=lt(this,a[s+h],e,h),c===W&&(c=this._$AH[h]),o||(o=!Pt(c)||c!==this._$AH[h]),c===v?t=v:t!==v&&(t+=(c??"")+n[h+1]),this._$AH[h]=c}o&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Kt=class extends ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},Gt=class extends ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},Yt=class extends ht{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??v)===W)return;let s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Jt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}},ls={M:me,P:X,A:be,C:1,L:rs,R:Qt,D:ns,V:lt,I:_t,H:ht,N:Gt,U:Yt,B:Kt,F:Jt},qs=Et.litHtmlPolyfillSupport;qs?.(jt,_t),(Et.litHtmlVersions??(Et.litHtmlVersions=[])).push("3.3.3");var hs=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new _t(t.insertBefore(Ct(),n),n,void 0,e??{})}return i._$AI(r),i};var Rt=globalThis,Z=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=hs(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};Z._$litElement$=!0,Z.finalized=!0,Rt.litElementHydrateSupport?.({LitElement:Z});var Vs=Rt.litElementPolyfillSupport;Vs?.({LitElement:Z});(Rt.litElementVersions??(Rt.litElementVersions=[])).push("4.2.2");var ct={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},cs=r=>(...t)=>({_$litDirective$:r,values:t}),Xt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Mi}=ls;var ds=r=>r.strings===void 0;var Fs={},ps=(r,t=Fs)=>r._$AH=t;var ye=cs(class extends Xt{constructor(r){if(super(r),r.type!==ct.PROPERTY&&r.type!==ct.ATTRIBUTE&&r.type!==ct.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ds(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(r,[t]){if(t===W||t===v)return t;let e=r.element,s=r.name;if(r.type===ct.PROPERTY){if(t===e[s])return W}else if(r.type===ct.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(s))return W}else if(r.type===ct.ATTRIBUTE&&e.getAttribute(s)===t+"")return W;return ps(r),t}});function us(r,t,e){let s=Math.max(1,Math.round(t/e)),i=new Float32Array(Math.ceil(r.length/s)),n=1e-6;for(let o=0,a=0;o<r.length;o+=s,a++){let h=Math.min(r.length,o+s),c=0;for(let u=o;u<h;u++)c+=r[u]*r[u];let d=Math.sqrt(c/(h-o));i[a]=d,d>n&&(n=d)}for(let o=0;o<i.length;o++)i[o]=Math.min(1,i[o]/n);return i}function we(r,t=2,e=1,s=.06,i=1.04){for(let n=0;n<t;n++)for(let o=0;o<r.length;o++){let a=r[o];if(!(!a.held||a.pop>=0))for(let h=o+1;h<r.length;h++){let c=r[h];if(!c.held||c.pop>=0)continue;let d=c.x-a.x,u=c.y-a.y,p=Math.hypot(d,u);p<.001&&(d=.1,u=0,p=.1);let f=a.r+c.r,m=d/p,g=u/p;if(p<f){let b=(f-p)*.5*e;a.x-=m*b,a.y-=g*b,c.x+=m*b,c.y+=g*b}else if(s>0&&p>f*i&&p<f*1.5){let b=(p-f)*s;a.x+=m*b,a.y+=g*b,c.x-=m*b,c.y-=g*b}}}return r}function $e(r,t,e,s){for(let i of r){if(!i.held||i.pop>=0)continue;let n=i.x-t,o=i.y-e,a=Math.hypot(n,o);a<.001&&(n=1,o=0,a=1);let h=s+i.r;if(a<h){let c=n/a,d=o/a;i.x=t+c*h,i.y=e+d*h;let u=i.vx*c+i.vy*d;u<0&&(i.vx-=u*c,i.vy-=u*d)}}return r}function ke(r,t,e,s,i=1){for(let n of r){if(!n.held||n.pop>=0||!n.anchor)continue;let o=n.x-t,a=n.y-e,h=Math.hypot(o,a);h<.001&&(o=1,a=0,h=1);let c=o/h,d=a/h,u=s+n.r;n.x+=(t+c*u-n.x)*i,n.y+=(e+d*u-n.y)*i;let p=n.vx*c+n.vy*d;n.vx-=p*c,n.vy-=p*d}return r}function fs(r,t,e){let s=Math.PI*2;if(!r.length)return{angle:0,gap:s};let i=r.map(a=>Math.atan2(a.y-e,a.x-t)).sort((a,h)=>a-h),n=-1,o=0;for(let a=0;a<i.length;a++){let h=i[a],d=(a+1<i.length?i[a+1]:i[0]+s)-h;d>n&&(n=d,o=h+d/2)}return{angle:o,gap:n}}function _s(r,t){let{dt:e,rate:s,maxRatio:i,maxR:n,sizeBias:o=0,rand:a=Math.random}=t,h=0;for(let c=0;c<r.length;c++){let d=r[c];if(!(!d.held||d.pop>=0||d.gone))for(let u=c+1;u<r.length;u++){let p=r[u];if(!p.held||p.pop>=0||p.gone||Math.hypot(p.x-d.x,p.y-d.y)>d.r+p.r+1||(d.r>=p.r?d.r/p.r:p.r/d.r)>i)continue;let g=Math.sqrt(d.r*d.r+p.r*p.r);if(g>n)continue;let b=Math.min(d.r,p.r),z=o?Math.pow(Math.min(1,b/n),1/o):1;if(a()>s*z*e)continue;let w=d.r>=p.r?d:p,y=w===d?p:d,E=w.r*w.r,A=y.r*y.r,k=E+A;if(w.x=(w.x*E+y.x*A)/k,w.y=(w.y*E+y.y*A)/k,w.vx=(w.vx*E+y.vx*A)/k,w.vy=(w.vy*E+y.vy*A)/k,w.r=g,w.full=g,w.age=0,y.gone=!0,h++,w!==d)break}}if(h)for(let c=r.length-1;c>=0;c--)r[c].gone&&r.splice(c,1);return h}function Me(r,t,e,s,i=2,n=1){let o=r.filter(a=>a.held&&!(a.pop>=0)&&a.anchor);if(o.length<2)return r;for(let a=0;a<i;a++)for(let h=0;h<o.length;h++)for(let c=h+1;c<o.length;c++){let d=o[h],u=o[c],p=s+d.r,f=s+u.r,m=Math.atan2(d.y-e,d.x-t),g=Math.atan2(u.y-e,u.x-t),b=g-m;for(;b>Math.PI;)b-=Math.PI*2;for(;b<-Math.PI;)b+=Math.PI*2;let z=Math.sqrt(p*p+f*f-2*p*f*Math.cos(b)),w=d.r+u.r;if(z>=w)continue;let y=(p+f)/2,E=(w-z)/y*.5*n,A=b>=0?1:-1,k=m-A*E,I=g+A*E;d.x=t+Math.cos(k)*p,d.y=e+Math.sin(k)*p,u.x=t+Math.cos(I)*f,u.y=e+Math.sin(I)*f}return r}function gs(r,t){let{dt:e,maxR:s,rand:i=Math.random}=t,n=r.r/s;if(r.r>=s*.995||r.age>r.span*(.55+1.7*n))return!0;let o=n>.7?.5*Math.pow(n,6):0;return o>0&&i()<o*e}var ks=((import.meta.url||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-ring-card ${ks}`);var Ws="4.11.1",te="assist_satellite",Qs=["idle","listening","processing","responding"],Ae={size:240,background:"dark",particles:0,particle_size:1,follow_media_player:!0,audio_offset:0,idle_color:"#2e9df5",listening_color:"#00ff88",processing_color:"#ffaa33",responding_color:"#00e5ff",offline_color:"#4a5560",build_entity:"",build_scope:"device",build_dashboard:"",build_page:!1,build_return:"/",build_projects:[],animation:"hubbubb",assistant_name:"Assistant",panel_height:0,panel_fullscreen:!1,panel_bg:"",panel_border:"",panel_text:"",terminal_bg:"",terminal_text:"",honeycomb:!0,tap_message:"Yes?",announce_entity:"",messages_entity:""},ms=(r,t)=>{let e=Math.round(t*Ms);return e<0||e>=r.length?0:r[e]},zt=16,Ms=50,bs={idle:"idle_color",listening:"listening_color",processing:"processing_color",responding:"responding_color"},vs={idle:{swirl:.95,bright:1.75,radius:0,amp:1,turb:.4,sweep:0,speech:0},listening:{swirl:1.8,bright:1.8,radius:-.012,amp:1.15,turb:.6,sweep:.35,speech:0},processing:{swirl:.95,bright:1.5,radius:0,amp:1,turb:.3,sweep:1,speech:0},responding:{swirl:1.5,bright:1.55,radius:.006,amp:1.15,turb:1,sweep:.12,speech:1},offline:{swirl:.3,bright:.4,radius:-.012,amp:.5,turb:.15,sweep:0,speech:0}},Ks=new Set(["tool","out","err","screen","cmd"]),Gs=r=>/^\$ /.test(r)?"l-cmd":/^\+/.test(r)?"l-add":/^- /.test(r)||/^--- /.test(r)?"l-del":/\b(error|errno|failed|failure|fatal|traceback|exception|refused|denied|not found|no such)\b/i.test(r)?"l-err":/\b(warn|warning|deprecat\w+|skipped)\b/i.test(r)?"l-warn":/^(Edit|Write|Read|Grep|Glob|Agent|Task|WebFetch|WebSearch|TodoWrite|Skill)\b/.test(r)?"l-tool":"",Ys=/`([^`\n]+)`|\*\*([^*\n]+)\*\*/g,Se=(r,t,e)=>r.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),Js={1:"can't reach Home Assistant",2:"invalid authentication",3:"connection lost \u2014 reconnecting",4:"no Home Assistant host",5:"https/http mismatch"};var Hi=Math.PI/180,dt=(r,t,e)=>Math.min(e,Math.max(t,r)),Te=r=>Math.round(r*100)/100,Ce=r=>{let t=r>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},Xs=r=>{let t=(1+Math.sqrt(5))/2,e=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(([h,c,d])=>{let u=Math.hypot(h,c,d);return[h/u,c/u,d/u]}),s=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=new Map,n=(h,c)=>{let d=h<c?`${h}_${c}`:`${c}_${h}`,u=i.get(d);if(u!==void 0)return u;let[p,f,m]=e[h],[g,b,z]=e[c],w=(p+g)/2,y=(f+b)/2,E=(m+z)/2,A=Math.hypot(w,y,E);return e.push([w/A,y/A,E/A]),i.set(d,e.length-1),e.length-1};for(let h=0;h<r;h++){let c=[];for(let[d,u,p]of s){let f=n(d,u),m=n(u,p),g=n(p,d);c.push([d,f,g],[u,m,f],[p,g,m],[f,m,g])}s=c}let o=new Set,a=[];for(let h of s)for(let c=0;c<3;c++){let d=h[c],u=h[(c+1)%3],p=d<u?d*1e5+u:u*1e5+d;o.has(p)||(o.add(p),a.push(d,u))}return{verts:e,edges:a}},Ee=Xs(3),Zs=(()=>{let r=Ce(11073),t=Ee.verts.length,e=[];for(let s=0;s<16;s++)e.push({v:Math.floor(r()*t),tw:.5+r()*1.6,ph:r()*6.28});return e})(),gt=96,xs=.55,ys=.45,Zt=[{r:.625,amp:.068,thick:.007,rev:-.8,share:.21,glow:.72},{r:.655,amp:.075,thick:.008,rev:-.8,share:.21,glow:.85},{r:.845,amp:.082,thick:.009,rev:1,share:.3,glow:1.2},{r:.875,amp:.09,thick:.008,rev:1,share:.28,glow:1.4}],mt=128,ti=(()=>{let r=Ce(51729),t=[];for(let e=0;e<5;e++)t.push({a:r()*Math.PI*2,w:(.08+r()*.22)*(e%2?-1:1),sg:.2+r()*.3,h:.6+r()*.7,f:.25+r()*.6,ph:r()*Math.PI*2});return t})(),As=(()=>{let t=Math.sqrt(3)*5,e=(s,i)=>{let n="";for(let o=0;o<6;o++){let a=o*60*Math.PI/180;n+=`${o===0?"M":"L"}${Te(s+5*Math.cos(a))} ${Te(i+5*Math.sin(a))}`}return n+"Z"};return[e(0,0),e(3*5,0),e(0,t),e(3*5,t),e(1.5*5,t/2)].join("")})(),vt={w:15,h:Te(Math.sqrt(3)*5)},ws=.62,ei=r=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${vt.w}" height="${vt.h}" viewBox="0 0 ${vt.w} ${vt.h}"><path d="${As}" fill="none" stroke="${r}" stroke-width="0.35"/></svg>`)+'")',$s=r=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(r).trim());if(t){let s=t[1];s.length===3&&(s=s.split("").map(n=>n+n).join(""));let i=parseInt(s,16);return[i>>16&255,i>>8&255,i&255]}let e=/rgba?\(([^)]+)\)/i.exec(String(r));if(e){let s=e[1].split(",").map(i=>parseFloat(i));return[s[0]|0,s[1]|0,s[2]|0]}return[53,224,255]},bt=class extends Z{set hass(t){if(this._hass=t,!this._config)return;let e=t?.states?.[this._config.entity],s=e?e.state:"unavailable",i=this._state;if(s!==this._state&&(this._state=s),this._config.build_entity&&this._config.build_scope==="global"){let u=t?.states?.[this._config.build_entity]?.state==="on";this._config.build_page?(this._entityOn&&!u&&this._navigate(this._config.build_return),this._entityOn=u):u!==this._build&&this._setBuild(u,!1)}this._listenForSpeech(t);let n=t?.states?.[this._config.announce_entity],o=n?n.state==="on":null;o!==this._announce&&(this._announce=o);let a=t?.states?.[this._config.messages_entity],h=a?a.state==="on":null;h!==this._messages&&(this._messages=h);let c=this._config.follow_media_player?this._resolveMediaPlayer(t):null,d=c?t?.states?.[c]?.state:void 0;d!==this._mp&&(this._mp=d),this._audioSync(c?t?.states?.[c]:null),this._state==="responding"&&i!=="responding"&&this._grabTtsUrl(),this._sessTimer||(this._sessTimer=setInterval(()=>this._pollSessions(),12e3),this._pollSessions())}_trackDone(t){this._unread||(this._unread=new Set(this._recall("unread",24*3600*1e3)||[]),this._wasBusy=new Map);let e=new Set;for(let i of t){e.add(i.id);let n=this._build&&this._sel===i.id;i.busy||n?this._unread.delete(i.id):this._wasBusy.get(i.id)&&this._unread.add(i.id),this._wasBusy.set(i.id,!!i.busy),i.done=this._unread.has(i.id)}for(let i of[...this._unread])e.has(i)||this._unread.delete(i);for(let i of[...this._wasBusy.keys()])e.has(i)||this._wasBusy.delete(i);let s=[...this._unread].sort().join(",");return s!==this._unreadKey&&(this._unreadKey=s,this._store("unread",[...this._unread])),t}_settle(t,e){JSON.stringify(e)!==JSON.stringify(this[t])&&(this[t]=e)}async _pollSessions(){if(!(this._build||this._onScreen===!1||!this._hass))try{let t=await this._api("agent_status");this._settle("_sessions",this._trackDone(t.sessions||[])),t.projects&&this._settle("_projects",t.projects)}catch{}}_resolveMediaPlayer(t){if(this._config.media_player)return this._config.media_player;if(this._mpResolved!==void 0)return this._mpResolved;let e=null,s=t?.entities?.[this._config.entity]?.device_id;if(s&&t.entities){for(let i in t.entities)if(i.startsWith("media_player.")&&t.entities[i].device_id===s){e=i;break}}if(!e){let n=`media_player.${this._config.entity.split(".")[1].replace(/_assist_satellite$/,"")}_media_player`;t?.states?.[n]&&(e=n)}return this._mpResolved=e,e}_effectiveState(){if(this._voiceState)return this._voiceState==="responding"&&this._envEl&&!this._envEl.currentTime?"processing":this._voiceState;let t=Qs.includes(this._state)?this._state:"offline",e=this._speechRaw(t);return this._speaking(e)?"responding":e||t==="responding"?"processing":t}_speechRaw(t){let e=this._mp;return e==="playing"?t!=="listening":e==="idle"||e==="paused"?!1:t==="responding"}_speaking(t){let e=Math.max(0,-(Number(this._config.audio_offset)||0));if(!e)return t;let s=performance.now()/1e3;return t!==this._spkRaw&&(this._spkRaw=t,this._spkAt=s),s-(this._spkAt??-1e9)<e?!t:t}get hass(){return this._hass}get _name(){return this._config?.assistant_name||"Assistant"}setConfig(t){if(!t||!t.entity)throw new Error("hubbubb-ring-card: you need to define an `entity`");if(t.entity.split(".")[0]!==te)throw new Error(`hubbubb-ring-card: entity must be in the ${te} domain`);this._config={...Ae,...t},this._particles=null,this._mpResolved=void 0,t.build_page&&this._setBuild(!0,!1),this._hass&&(this.hass=this._hass)}getCardSize(){return Math.max(2,Math.ceil(Number(this._config?.size??240)/50))}getGridOptions(){return{rows:"auto",columns:12,min_rows:2,min_columns:6}}_cardVars(t){let e=this._config,s=n=>Number(n)>0?`${Number(n)}px`:"",i={"--jr-size":`${Number(e.size)}px`,"--jr-color":t,"--jr-panel-h":e.panel_height==="fill"?"100%":s(e.panel_height),"--jr-panel-bg":e.panel_bg,"--jr-panel-border":e.panel_border,"--jr-panel-text":e.panel_text,"--jr-term-bg":e.terminal_bg,"--jr-term-text":e.terminal_text};return Object.entries(i).filter(([,n])=>n).map(([n,o])=>`${n}:${o}`).join(";")}static getConfigElement(){return document.createElement("hubbubb-ring-card-editor")}static getStubConfig(t){let e=Object.keys(t?.states??{}),s=a=>e.find(h=>h.startsWith("switch.")&&h.endsWith(a))??"",i=s("_build_mode"),o=i.slice(7,-11).split("_").filter(Boolean).map(a=>a[0].toUpperCase()+a.slice(1)).join(" ");return{type:"custom:hubbubb-ring-card",entity:e.find(a=>a.split(".")[0]===te)??"",...o&&{assistant_name:o},...i&&{build_entity:i},...s("_agent_announcements")&&{announce_entity:s("_agent_announcements")},...s("_message_watch")&&{messages_entity:s("_message_watch")}}}connectedCallback(){super.connectedCallback(),this._onVisibility=()=>this._pump(),document.addEventListener?.("visibilitychange",this._onVisibility),this._onHide=()=>{this._saveDraft(),this._saveQueue()},window.addEventListener?.("pagehide",this._onHide),this._onFirstTap=()=>this._unlockSpeech(),this.addEventListener?.("pointerdown",this._onFirstTap,{once:!0}),this._onActivity=()=>this._lastTouch=Date.now(),window.addEventListener?.("pointerdown",this._onActivity,!0),window.addEventListener?.("keydown",this._onActivity,!0),this._restoreQueue(),this._build&&this._setBuild(!0,!1)}disconnectedCallback(){if(this._speechUnsub){try{this._speechUnsub()}catch{}this._speechUnsub=null,this._speechSub=!1}if(this._claimUnsub){try{this._claimUnsub()}catch{}this._claimUnsub=null}this._onActivity&&(window.removeEventListener?.("pointerdown",this._onActivity,!0),window.removeEventListener?.("keydown",this._onActivity,!0),this._onActivity=null),this._onFirstTap&&(this.removeEventListener?.("pointerdown",this._onFirstTap),this._onFirstTap=null),super.disconnectedCallback(),this._saveDraft(),this._saveQueue(),this._lockScroll(!1),document.removeEventListener?.("visibilitychange",this._onVisibility),window.removeEventListener?.("pagehide",this._onHide),this._stop(),this._stopPolling(),this._stopLocalVoice(),clearInterval(this._sessTimer),this._sessTimer=null,this._io?.disconnect(),this._ro?.disconnect(),this._io=this._ro=null,this._canvas=null,this._ctx=null}_navigate(t){!t||location.pathname.startsWith(t.split("?")[0])||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")))}_listenForSpeech(t){this._speechSub||!t?.connection||(this._speechSub=!0,t.connection.subscribeEvents(e=>{let s=e?.data?.message;s&&this._electAndSpeak(s)},"jarvis_claude_message").then(e=>this._speechUnsub=e).catch(()=>this._speechSub=!1),t.connection.subscribeEvents(e=>{this._claims?.push(e?.data||{})},"jarvis_claude_claim").then(e=>this._claimUnsub=e).catch(()=>{}))}async _electAndSpeak(t){let e={idle:Date.now()-(this._lastTouch||0),tie:Math.random()};this._claims=[];try{await this._hass.connection.sendMessagePromise({type:"fire_event",event_type:"jarvis_claude_claim",event_data:e})}catch{return this._claims=null,this._speakHere(t)}await new Promise(n=>setTimeout(n,400));let s=this._claims||[];this._claims=null,s.reduce((n,o)=>o.idle<n.idle||o.idle===n.idle&&o.tie<n.tie?o:n,e).tie===e.tie&&this._speakHere(t)}_unlockSpeech(){if(this._speechAudio)return;let t=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");t.play().catch(()=>{}),this._speechAudio=t}async _speakHere(t){let e=this._hass;if(!(!e||!t))try{if(!this._ttsCfg){let a=await e.callWS({type:"assist_pipeline/pipeline/list"}),h=a?.pipelines||[],c=h.find(d=>d.id===a.preferred_pipeline)||h[0];if(!c?.tts_engine)return;this._ttsCfg={engine_id:c.tts_engine,language:c.tts_language,voice:c.tts_voice}}let s=this._ttsCfg,i=await e.callApi("POST","tts_get_url",{engine_id:s.engine_id,message:t,language:s.language,...s.voice?{options:{voice:s.voice}}:{}}),n=i?.url||i?.path;if(!n)return;let o=this._speechAudio||(this._speechAudio=new Audio);this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null);try{let h=await(await fetch(n)).arrayBuffer();this._speechBlob=URL.createObjectURL(new Blob([h],{type:"audio/mpeg"})),o.src=this._speechBlob}catch{o.src=n}o.onended=()=>{this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null)},await o.play().catch(()=>{this._toast("Tap anywhere to let it speak here.")})}catch{}}_toggleAnnounce(){this._toggleHelper(this._config.announce_entity,"_announce",`${this._name} finishes: spoken on the puck`,`${this._name} finishes: phone only`)}_toggleMessages(){this._toggleHelper(this._config.messages_entity,"_messages","Hubbubb messages: read out as they arrive","Hubbubb messages: quiet")}_toggleHelper(t,e,s,i){let n=this[e]===!0;this[e]=!n,this._hass.callService("homeassistant",n?"turn_off":"turn_on",{entity_id:t}),this._toast(n?i:s)}_setBuild(t,e=!0){if(e&&this._config.build_entity&&this._hass&&this._config.build_scope==="global"&&this._hass.callService("homeassistant",t?"turn_on":"turn_off",{entity_id:this._config.build_entity}),this._config.build_dashboard){let s=this._build;this._build=t,t&&(e||s===!1)&&this._navigate(this._config.build_dashboard);return}if(this._config.build_page&&!t){this._navigate(this._config.build_return);return}this._build=t,t?(this._err="",this._loadModels(),this._poll(!0),this._startPolling(),!this._vvHandler&&window.visualViewport&&(this._vvHandler=()=>this._vvSync(),window.visualViewport.addEventListener("resize",this._vvHandler),window.visualViewport.addEventListener("scroll",this._vvHandler)),this._vvSync(),this._lockScroll(!0)):(this._stopPolling(),this._lockScroll(!1),this._sel=null,this._msgs=null,this._ask=null,this._activity=null,this._permission=null,this._confirmKill=null,this._picking=!1,this._details=!1,this._swipe=null,this._vvHandler&&window.visualViewport&&(window.visualViewport.removeEventListener("resize",this._vvHandler),window.visualViewport.removeEventListener("scroll",this._vvHandler),this._vvHandler=null))}_lockScroll(t){if(!this._config?.build_page)return;let e=document.documentElement,s=document.body;s&&(t?(this._prevOverflow===void 0&&(this._prevOverflow=s.style.overflow,this._prevOverscroll=e.style.overscrollBehavior,this._prevHtmlOverflow=e.style.overflow),s.style.overflow="hidden",e.style.overflow="hidden",e.style.overscrollBehavior="none"):this._prevOverflow!==void 0&&(s.style.overflow=this._prevOverflow,e.style.overflow=this._prevHtmlOverflow,e.style.overscrollBehavior=this._prevOverscroll,this._prevOverflow=this._prevOverscroll=void 0,this._prevHtmlOverflow=void 0))}_syncCorner(t){window.innerWidth!==this._vvW&&(this._vvW=window.innerWidth,this._vvMax=t),this._vvMax=Math.max(this._vvMax||0,t);let e=t>=this._vvMax-4;this.style.setProperty("--jr-botr",e?"56px":"16px")}_vvSync(){let t=window.visualViewport;if(!t)return;let e=Math.round(t.height),s=Math.round(t.offsetTop),i=e!==this._vvH;i&&(this._vvH=e,this.style.setProperty("--jr-vvh",`${e}px`),this._syncCorner(e)),(i||this._vvT==null)&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`),i&&this._settlePin());let n=this._vvPrev==null?0:Math.abs(e-this._vvPrev),o=this._vvPrev==null;if(this._vvPrev=e,!o&&n<12)return;let a=this._growCap();a!==this._lastCap&&(this._lastCap=a,this._autoGrow(this._composerEl())),this._stick&&this._toBottom()}_settlePin(){clearTimeout(this._settleA),clearTimeout(this._settleB);let t=()=>{this._unscroll();let e=window.visualViewport;if(!e)return;let s=Math.round(e.offsetTop);s!==this._vvT&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`))};requestAnimationFrame(t),this._settleA=setTimeout(t,200),this._settleB=setTimeout(t,500)}_unscroll(){if(!this._build)return;window.scrollTo(0,0),document.scrollingElement&&(document.scrollingElement.scrollTop=0);let t=this.parentNode;for(;t;)t.scrollTop>0&&(t.scrollTop=0),t=t.parentNode||t.host}_startPolling(){let t=this._sel?600:1500;this._pollTimer&&this._pollMs===t||(this._pollTimer&&clearInterval(this._pollTimer),this._pollMs=t,this._pollTimer=setInterval(()=>this._poll(),t))}_stopPolling(){this._pollTimer&&clearInterval(this._pollTimer),this._pollTimer=null,this._pollMs=null}_errText(t){return typeof t=="number"?Js[t]||`websocket error ${t}`:String(t?.message||t)}async _api(t,e={}){let s=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=s?.response?.content;if(typeof i=="string")try{i=JSON.parse(i)}catch{}let n=s?.response?.status??0;if(n<200||n>=300||i?.ok===!1)throw new Error(i?.detail||i?.error||`HTTP ${n}`);return i||{}}async _poll(t=!1){if(!(!this._build||!this._hass)){if(this._polling){this._pollAgain=!0;return}this._polling=!0;try{let e=this._sel;this._tick=(this._tick||0)+1;let s=t||this._tick%5===1,[i,n]=await Promise.all([s?this._api("agent_status"):null,e?this._api("agent_transcript",{id:e,have:this._msgs==null?0:this._tbytes||0}):null]);if(i){if(this._settle("_sessions",this._trackDone(i.sessions||[])),this._settle("_projects",i.projects||[]),this._sel&&!this._sessions.some(a=>a.id===this._sel))this._sel=null,this._msgs=null,this._store("sel",null);else if(!this._sel&&!this._restored){this._restored=!0;let a=this._recall("sel",12*3600*1e3);a&&this._sessions.some(h=>h.id===a)&&this._select(a)}}let o=e&&e===this._sel?n:null;if(this._sel&&!o&&(o=await this._api("agent_transcript",{id:this._sel,have:this._msgs==null?0:this._tbytes||0})),this._sel&&o){let a=o;this._tbytes=a.bytes||0;let h=a.messages;h!=null&&!this._sameMsgs(h,this._msgs)&&(this._msgs=h),this._activity=a.activity||null,this._permission=a.permission||null;let c=a.ask?JSON.stringify(a.ask.options.map(d=>d.label)):null;if(c!==this._askSig&&(this._askSig=c,this._askSent=null),this._settle("_ask",a.ask||null),this._ask&&this._ask.multi&&(this._askSent=null),this._queue?.length){let d=new Set((this._msgs||[]).filter(p=>p.role==="user").map(p=>this._collapse(p.text))),u=this._queue.length;this._queue=this._queue.filter(p=>p.state!=="sent"||!d.has(this._collapse(p.text))&&Date.now()-p.at<6e5),this._queue.length!==u&&this._saveQueue()}}this._err=""}catch(e){this._err=this._errText(e)}if(this._polling=!1,this._pollAgain)return this._pollAgain=!1,this._poll();this._drainQueue()}}_drainQueue(){if(!this._sel||this._pending)return;let t=(this._queue||[]).filter(s=>s.id===this._sel);if(t.some(s=>s.state==="sent"))return;let e=t.find(s=>s.state==="held");e&&((this._sessions||[]).find(s=>s.id===this._sel)?.busy||this._dispatch(e))}_select(t){if(this._sel&&this._sel!==t&&this._saveDraft(),this._sel=t,this._restored=!0,t&&this._unread?.delete(t)){this._store("unread",[...this._unread]);let e=(this._sessions||[]).find(s=>s.id===t);e&&(e.done=!1)}this._store("sel",t||null),this._msgs=null,this._ask=null,this._askSent=null,this._askSig=void 0,this._activity=null,this._permission=null,this._startPolling(),this._confirmKill=null,this._details=!1,this._swipe=null,this._stick=!0,this._poll(!0),t&&this._api("agent_target_window",{id:t}).catch(()=>{})}_store(t,e){try{let s=`jrc:${t}`;e==null?localStorage.removeItem(s):localStorage.setItem(s,JSON.stringify({v:e,at:Date.now()}))}catch{}}_recall(t,e){try{let s=localStorage.getItem(`jrc:${t}`);if(!s)return null;let{v:i,at:n}=JSON.parse(s);return!n||Date.now()-n>e?(localStorage.removeItem(`jrc:${t}`),null):i}catch{return null}}_body(t){let e=`${t.role}\0${t.text}`,s=this._bodyCache?.get(e);if(s)return s;let i=this._bodyParse(t);return this._bodyCache||(this._bodyCache=new Map),this._bodyCache.size>400&&this._bodyCache.delete(this._bodyCache.keys().next().value),this._bodyCache.set(e,i),i}_bodyParse(t){if(Ks.has(t.role))return t.text.split(`
`).map(i=>x`<div class="${Gs(i)}">${i||" "}</div>`);if(t.role!=="assistant")return t.text;let e=[],s=0;for(let i of t.text.matchAll(Ys))i.index>s&&e.push(t.text.slice(s,i.index)),e.push(i[1]?x`<code>${i[1]}</code>`:x`<b>${i[2]}</b>`),s=i.index+i[0].length;return e.push(t.text.slice(s)),e}_sameMsgs(t,e){if(!t||!e||t.length!==e.length)return!1;let s=t[t.length-1],i=e[e.length-1];return s?.role===i?.role&&s?.text===i?.text}_collapse(t){return t.split(/\s+/).join(" ")}_toBottom(){let t=0,e=()=>{let s=this.renderRoot?.querySelector(".log");s&&(s.lastElementChild?.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll()),++t<6&&requestAnimationFrame(e)};requestAnimationFrame(e),clearTimeout(this._bottomT),this._bottomT=setTimeout(()=>{let s=this.renderRoot?.querySelector(".log");s&&(s.lastElementChild?.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll())},250)}_composerEl(){return this.renderRoot?.querySelector(".composer textarea")}_growCap(){let t=this._vvH||window.visualViewport?.height||window.innerHeight;return Math.max(56,Math.min(190,Math.round(t*.32)))}_autoGrow(t){if(!t)return;let e=t.style.height,s=t.scrollTop;t.style.height="auto";let i=Math.min(t.scrollHeight,this._growCap())+"px";return t.style.height=i,t.scrollTop!==s&&(t.scrollTop=s),i!==e}_draftSoon(){clearTimeout(this._draftT),this._draftT=setTimeout(()=>this._saveDraft(),400)}_saveDraft(t=this._sel){if(clearTimeout(this._draftT),!t)return;let e=this._composerEl();e&&this._store(`draft:${t}`,e.value||null),this._store(`files:${t}`,this._files?.length?this._files:null)}_restoreDraft(){if(!this._sel)return;this._files=this._recall(`files:${this._sel}`,12*3600*1e3)||[];let t=this._composerEl();if(!t||t.value)return;let e=this._recall(`draft:${this._sel}`,12*3600*1e3);e&&(t.value=e,this._autoGrow(t))}_saveQueue(){let t=(this._queue||[]).filter(e=>e.state==="held");this._store("queue",t.length?t:null)}_restoreQueue(){let t=this._recall("queue",216e5);Array.isArray(t)&&t.length&&(this._queue=t.map(e=>({...e,state:"held"})))}async _send(t){t.preventDefault();let e=this._composerEl(),s=e?.value.trim(),i=this._files||[];if(!s&&!i.length||this._sel==null)return;let n=[...i.map(a=>a.path),s].filter(Boolean).join(" ");e.value="",e.style.height="",this._files=[],this._saveDraft();let o={id:this._sel,text:n,at:Date.now(),state:"held"};this._queue=[...this._queue||[],o],this._saveQueue(),this._stick=!0,(this._sessions||[]).find(a=>a.id===this._sel)?.busy||this._dispatch(o)}async _dispatch(t){if(!this._pending){this._pending=!0,t.state="sent",this._queue=[...this._queue],this._saveQueue();try{await this._api("agent_prompt_direct",{id:t.id,text:t.text}),this._err=""}catch(e){this._err=this._errText(e),t.state="held",this._queue=[...this._queue],this._saveQueue()}this._pending=!1,this._poll(!0)}}_editQueued(t){let e=this._composerEl();e&&(e.value=e.value.trim()?`${e.value.trim()} ${t.text}`:t.text,this._dropQueued(t),e.focus(),this._autoGrow(e),this._saveDraft())}_dropQueued(t){this._queue=(this._queue||[]).filter(e=>e!==t),this._saveQueue()}async _attach(t){let e=[...t.target.files||[]];return t.target.value="",this._ingest(e)}async _ingest(t){if(!(!t.length||!this._sel)){this._uploading=!0;for(let e of t)try{let{name:s,data:i}=await this._encodeFile(e),n=await this._api("agent_upload",{name:s,data:i});if(!n?.path)throw new Error(n?.detail||"upload refused");this._files=[...this._files||[],{name:e.name,path:n.path}],this._err=""}catch(s){this._err=`${e.name}: ${this._errText(s)}`}this._uploading=!1,this._saveDraft()}}_encodeFile(t){let e=i=>new Promise((n,o)=>{let a=new FileReader;a.onerror=()=>o(new Error("could not read that file")),a.onload=()=>n(String(a.result).split(",")[1]||""),a.readAsDataURL(i)});if(!t.type.startsWith("image/"))return e(t).then(i=>({name:t.name,data:i}));let s=1568;return new Promise((i,n)=>{let o=new Image,a=URL.createObjectURL(t);o.onerror=()=>{URL.revokeObjectURL(a),e(t).then(h=>i({name:t.name,data:h}),n)},o.onload=()=>{URL.revokeObjectURL(a);let h=Math.min(1,s/Math.max(o.width,o.height));if(h===1&&t.size<9e5)return e(t).then(d=>i({name:t.name,data:d}),n);let c=document.createElement("canvas");c.width=Math.round(o.width*h),c.height=Math.round(o.height*h),c.getContext("2d").drawImage(o,0,0,c.width,c.height),c.toBlob(d=>{if(!d)return n(new Error("could not encode that image"));let u=t.name.replace(/\.[^.]+$/,"")+".jpg";e(d).then(p=>i({name:u,data:p}),n)},"image/jpeg",.85)},o.src=a})}_dropFile(t){this._files=(this._files||[]).filter(e=>e!==t),this._saveDraft()}_renderAsk(t){let e=!!t.multi,s=!e&&!!this._askSent;return x`<div class="askbox ${s?"answered":""}">
      ${t.header||t.total>1||e?x`<div class="askhead">
            ${t.header?x`<span class="askchip">${t.header}</span>`:v}
            ${t.total>1?x`<span class="askstep">Question ${t.index} of ${t.total}</span>`:v}
            ${e?x`<span class="askmulti">Pick any</span>`:v}
          </div>`:v}
      ${t.text?x`<div class="asktext">${t.text}</div>`:v}
      <div class="askopts">
        ${t.options.map(i=>x`<button
            class="askopt ${this._askSent===i.key?"picked":""} ${i.on?"on":""}"
            data-ai="pick-option"
            ?disabled=${s}
            @click=${()=>this._sendKey(i.key,{keepOpen:e})}
          >
            <span class="asknum">${e?i.on?"\u2611":"\u2610":i.key}</span>
            <span class="asklabel"
              >${i.label}
              ${i.desc?x`<span class="askdesc">${i.desc}</span>`:v}</span
            >
            ${!e&&this._askSent===i.key?x`<span class="asktick">✓</span>`:v}
          </button>`)}
      </div>
      <div class="askrow">
        ${s?x`<span class="dim">sending…</span>`:v}
        ${e?x`<button class="asksubmit" data-ai="submit-answer"
                   @click=${()=>this._sendKey("Enter")}>Submit</button>`:v}
        <button class="askmini" @click=${()=>this._sendKey("Escape")}>esc</button>
      </div>
    </div>`}async _sendKey(t,{keepOpen:e=!1}={}){if(this._sel){e||(this._askSent=t);try{await this._api("agent_key",{id:this._sel,key:t}),this._err=""}catch(s){this._err=this._errText(s),this._askSent=null;return}this._poll()}}async _setModel(t){if(!this._sel||this._modelBusy||!t)return;let e=this._model;this._model=t,this._modelBusy=t;try{await this._api("agent_model",{id:this._sel,model:t}),this._err=""}catch(s){this._model=e,this._err=this._errText(s)}this._modelBusy=null,this._poll()}async _setPermission(t){if(!(!this._sel||this._modelBusy||!t)){this._modelBusy="perm";try{let e=await this._api("agent_permission",{id:this._sel,mode:t}),s=e&&(e.mode||e.detail);s&&(this._permission=s),this._err=""}catch(e){this._err=this._errText(e)}this._modelBusy=null,this._poll()}}_renderRunControls(){let t=this._models||[],e=this._permission||"",s=(this._sessions||[]).find(i=>i.id===this._sel)?.modes||this._modes||["auto","manual","accept edits","plan"];return x`<div class="runbar">
      <select
        class="runsel ${this._modelBusy&&this._modelBusy!=="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy||!t.length}
        data-ai="pick-model"
        title="Model for this session"
        .value=${ye(this._model||"")}
        @change=${i=>this._setModel(i.target.value)}
      >
        <option value="" disabled>${t.length?"Model":"\u2026"}</option>
        ${t.map(i=>x`<option value=${i.id}>${i.name}</option>`)}
      </select>
      <select
        class="runsel perm mode-${(e||"unknown").replace(/\s+/g,"-")} ${this._modelBusy==="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy}
        data-ai="pick-permission"
        title="Permission mode"
        .value=${ye(e)}
        @change=${i=>this._setPermission(i.target.value)}
      >
        <option value="" disabled>mode ?</option>
        ${s.map(i=>x`<option value=${i}>${i}</option>`)}
      </select>
    </div>`}async _loadModels(){if(!this._models)try{let t=await this._api("agent_models");this._models=t.models||[],this._modes=t.modes||null}catch{}}async _killSession(t){if(t){if(this._confirmKill!==t){this._confirmKill=t,clearTimeout(this._confirmT),this._confirmT=setTimeout(()=>this._confirmKill=null,4e3);return}clearTimeout(this._confirmT),this._confirmKill=null;try{await this._api("agent_kill",{id:t}),this._swipe=null,this._store(`draft:${t}`,null),this._queue=(this._queue||[]).filter(e=>e.id!==t),this._saveQueue(),this._sel===t&&(this._sel=null,this._msgs=null,this._store("sel",null)),this._poll(!0)}catch(e){this._err=this._errText(e)}}}_rowTap(t){if(this._swipe===t){this._swipe=null,this._confirmKill=null;return}if(this._swipe){this._swipe=null,this._confirmKill=null;return}this._swiped||this._select(t)}_swipeStart(t,e){let s=t.touches?.[0];s&&(this._sx=s.clientX,this._sy=s.clientY,this._swiped=!1)}_swipeMove(t,e){let s=t.touches?.[0];if(!s||this._sx==null)return;let i=s.clientX-this._sx,n=s.clientY-this._sy;Math.abs(n)>Math.abs(i)||(i<-12?(this._swiped=!0,this._swipe!==e&&(this._swipe=e)):i>12&&this._swipe===e&&(this._swiped=!0,this._swipe=null,this._confirmKill=null))}_swipeEnd(){this._sx=this._sy=null,setTimeout(()=>this._swiped=!1,50)}async _newSession(t){this._picking=!1,this._pending=!0;try{let e=await this._api("agent_start_session",{project:t});this._err="";let s=e?.id;for(let i=0;i<20;i++){await this._poll(!0);let n=(this._sessions||[]).find(o=>s?o.id===s:o.target);if(n){this._select(n.id);break}await new Promise(o=>setTimeout(o,600))}}catch(e){this._err=this._errText(e)}this._pending=!1}_openAssist(){let t=this._hass?.auth?.external;if(t?.config?.hasAssist){t.fireMessage({type:"assist/show"});return}Se(this,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>customElements.whenDefined("ha-voice-command-dialog"),dialogParams:{pipeline_id:"last_used",start_listening:!0}})}_wakePuck(){let t;try{t=this._hass?.callService("assist_satellite","start_conversation",{entity_id:this._config.entity,start_message:this._config.tap_message,preannounce:!1},void 0,!1)}catch{return this._openAssist()}Promise.resolve(t).catch(()=>this._openAssist())}async _openMic(){try{let e=(await navigator.mediaDevices.enumerateDevices()).find(s=>s.kind==="audioinput"&&s.label&&!/iphone|ipad|continuity/i.test(s.label));if(e)return await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:e.deviceId}}})}catch{}return navigator.mediaDevices.getUserMedia({audio:!0})}async _startLocalVoice(t="converse"){if(this._voice||this._micOpening)return!0;this._micOpening=!0,t==="converse"?this._voiceState="listening":this._dictating=!0;let e;try{e=await this._openMic()}catch{return this._voiceState=null,this._dictating=!1,"microphone permission denied"}finally{this._micOpening=!1}let s=e.getAudioTracks()[0];s&&(s.onended=()=>{this._voice?.stream===e&&(this._toast("The microphone disconnected."),this._stopLocalVoice())});let i=window.AudioContext||window.webkitAudioContext,n;try{n=new i({sampleRate:16e3})}catch{n=new i}let o=null;t==="converse"&&(o=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="),o.play().catch(()=>{}));let a=this._voice={mode:t,stream:e,ctx:n,audio:o,proc:null,src:null,handlerId:null,unsub:null},h=this._recall("conv",5*60*1e3);try{a.unsub=await this._hass.connection.subscribeMessage(u=>this._voiceEvent(u),{type:"assist_pipeline/run",start_stage:"stt",end_stage:t==="dictate"?"stt":"tts",input:{sample_rate:n.sampleRate},...h?{conversation_id:h}:{}})}catch{return this._stopLocalVoice(),"assist pipeline refused the run"}let c=a.src=n.createMediaStreamSource(e),d=a.proc=n.createScriptProcessor(2048,1,1);return d.onaudioprocess=u=>{if(a.handlerId==null)return;let p=u.inputBuffer.getChannelData(0),f=new Uint8Array(1+p.length*2);f[0]=a.handlerId;let m=new DataView(f.buffer,1);for(let g=0;g<p.length;g++){let b=Math.max(-1,Math.min(1,p[g]));m.setInt16(g*2,b<0?b*32768:b*32767,!0)}try{this._hass.connection.socket.send(f)}catch{}},c.connect(d),d.connect(n.destination),!0}_voiceEvent(t){let e=this._voice;if(e)switch(t.type){case"run-start":e.handlerId=t.data?.runner_data?.stt_binary_handler_id??null;break;case"intent-end":{let s=t.data?.intent_output?.conversation_id;s&&this._store("conv",s);break}case"stt-end":if(e.mode==="dictate"){let s=t.data?.stt_output?.text||"",i=this.renderRoot?.querySelector(".composer textarea");i&&s&&(i.value=(i.value?i.value.trim()+" ":"")+s,i.focus()),s||this._toast("Didn't catch that."),this._stopLocalVoice()}else this._closeMic(),this._voiceState="processing";break;case"tts-end":{let s=t.data?.tts_output?.url;if(!s)return this._stopLocalVoice();this._voiceState="responding",e.audio.onended=()=>this._stopLocalVoice(),e.audio.onerror=()=>this._stopLocalVoice(),this._envEl=e.audio,this._envUrl=s,this._env=null,this._decodeAudio(s),e.audio.src=s,e.audio.play().catch(()=>this._stopLocalVoice());break}case"error":e.mode==="dictate"&&this._toast("Didn't catch that."),this._stopLocalVoice();break;case"run-end":this._voiceState!=="responding"&&this._stopLocalVoice();break}}_closeMic(){let t=this._voice;t&&(t.proc?.disconnect(),t.src?.disconnect(),t.stream?.getTracks().forEach(e=>e.stop()),t.ctx?.close().catch(()=>{}),t.proc=t.src=null)}_stopLocalVoice(){let t=this._voice;if(t){this._closeMic(),this._dictating=!1;try{t.audio?.pause()}catch{}try{t.unsub?.()}catch{}this._voice=null,this._voiceState=null,this._envEl=null,this._env=null,this._envUrl=null}}_toast(t){Se(this,"hass-notification",{message:t})}get _canMic(){return!!(window.isSecureContext&&navigator.mediaDevices?.getUserMedia)}async _composerMic(){if(this._voice)return this._voice.mode==="dictate"?this._endSpeech():this._stopLocalVoice();if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){this._toast("Voice input needs the https (Nabu Casa) URL.");return}let t=await this._startLocalVoice("dictate");t!==!0&&this._toast(`Couldn't start voice input (${t}).`)}_endSpeech(){let t=this._voice;if(!t||t.handlerId==null)return this._stopLocalVoice();t.proc?.disconnect(),t.src?.disconnect(),t.mode==="converse"&&(this._voiceState="processing");try{this._hass.connection.socket.send(new Uint8Array([t.handlerId]))}catch{this._stopLocalVoice()}}async _ringTap(){if(this._voice)return this._voiceState==="listening"?this._endSpeech():this._stopLocalVoice();if(this._effectiveState()==="responding"){let e=this._resolveMediaPlayer(this._hass);if(e){this._hass.callService("media_player","media_stop",{entity_id:e});return}}if(!window.isSecureContext){this._wakePuck();return}if(!navigator.mediaDevices?.getUserMedia){this._toast(`This browser exposes no microphone \u2014 waking ${this._name} instead.`),this._wakePuck();return}let t=await this._startLocalVoice();t!==!0&&(this._toast(`Couldn't use this device's mic (${t}) \u2014 waking ${this._name} instead.`),this._wakePuck())}firstUpdated(){this._setupCanvas()}updated(t){this._setupCanvas(),t.has("_sel")&&this._sel&&this._restoreDraft(),t.has("_msgs")&&this._stick&&this._toBottom()}_setupCanvas(){let t=this.renderRoot?.querySelector("canvas");if(!t){this._stop(),this._canvas=null;return}if(t!==this._canvas){this._canvas=t;try{this._ctx=t.getContext("2d")}catch{this._ctx=null}if(!this._ctx)return;this._t=0,this._waveT=0,this._churnT=0,this._peaks=ti.map(e=>({...e})),this._spin=0,this._head=0,this._speech={t:0,next:0,env:0,count:0,syl:null,pulses:[],spikes:[]},this._cur={...vs.idle},this._rgb=$s(this._config?.idle_color??"#3db4c8"),this._observe()}this._ctx&&(this._measure(),this._pump())}_observe(){typeof ResizeObserver<"u"&&(this._ro?.disconnect(),this._ro=new ResizeObserver(()=>this._measure()),this._ro.observe(this._canvas)),typeof IntersectionObserver<"u"?(this._io?.disconnect(),this._io=new IntersectionObserver(t=>{this._onScreen=t.some(e=>e.isIntersecting),this._pump()}),this._io.observe(this._canvas)):this._onScreen=!0}_measure(){let t=this._canvas;if(!t||!this._ctx)return;let e=t.clientWidth||Number(this._config?.size)||240,s=t.clientHeight||e,i=(this._perf?.q??1)<.75?1:2,n=dt(window.devicePixelRatio||1,1,i);this._w===e&&this._h===s&&this._dpr===n&&this._particles||(this._w=e,this._h=s,this._dpr=n,t.width=Math.round(e*n),t.height=Math.round(s*n),this._ctx.setTransform(n,0,0,n,0,0),this._buildField())}_buildField(){let t=Number(this._config?.particles)||0,e=dt(Math.round((this._w||240)*32),9e3,2e4),s=t>0?dt(t,0,8e3):e,i=Math.max(400,Math.round(s*(this._perf?.q??1))),n=Ce(24301),o=new Array(i),a=0,h=Math.round(i*Zt[0].share);for(let c=0;c<i;c++){h--<=0&&a<Zt.length-1&&(a++,h=Math.round(i*Zt[a].share));let d=(n()+n()-1)*(n()<.04?4:1),u=(n()+n()-1)*1.05;o[c]={ri:a,lon:n()*Math.PI*2,sinLat:Math.sin(u),cosLat:Math.cos(u),off:d,drift:(n()-.5)*.13,tw:.5+n()*2,ph:n()*Math.PI*2,bobA:.1+n()*.25,bobW:.25+n()*.85,bobP:n()*Math.PI*2,wobA:.006+n()*.02,wobW:.4+n()*1.2,wobP:n()*Math.PI*2,lf:5+n()*7,lt:n()*12,sz:n()<.03?2.1+n()*1.1:.8+n()*.85,halo:n()<.05,br:n()<.04?1:.45+n()*.55}}this._particles=o}_audioSync(t){if(!t||t.state!=="playing"){this._env=null,this._envUrl=null;return}let e=t.attributes||{},s=String(e.media_content_id||""),i=/^https?:\/\//.test(s)||s.startsWith("/")?s:null,n=Date.parse(e.media_position_updated_at||t.last_changed||"");this._envAt=Number.isFinite(n)?n:Date.now(),this._envPos=Number(e.media_position)||0,!(!i||i===this._envUrl)&&(this._envUrl=i,this._env=null,i&&!(Number(e.media_duration)>60)&&this._decodeAudio(i))}async _pipelineId(t){if(this._pipeId!==void 0)return this._pipeId;this._pipeId=null;let e=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline/list"}),s=await t.connection.sendMessagePromise({type:"assist_pipeline/device/list"}),i=t.entities?.[this._config.entity]?.device_id,n=s?.find(c=>c.device_id===i)?.pipeline_entity,o=n?t.states?.[n]?.state:null,a=e?.pipelines||[],h=a.find(c=>c.name===o)||a.find(c=>c.id===e?.preferred_pipeline);return this._pipeId=h?.id||null,this._pipeId}async _grabTtsUrl(){let t=this._hass;if(!(!t?.connection||this._grabbing)){this._grabbing=!0;try{let e=await this._pipelineId(t);if(!e)return;for(let s=0;s<3;s++){let n=((await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/list",pipeline_id:e}))?.pipeline_runs||[]).reduce((o,a)=>!o||a.timestamp>o.timestamp?a:o,null);if(n&&Date.now()-Date.parse(n.timestamp)<6e4){let a=(await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/get",pipeline_id:e,pipeline_run_id:n.pipeline_run_id}))?.events||[];for(let h=a.length-1;h>=0;h--){let c=a[h]?.type==="tts-end"&&a[h]?.data?.tts_output?.url;if(c){this._envUrl=c,this._env=null,await this._decodeAudio(c);return}}}await new Promise(o=>setTimeout(o,250))}}catch{this._pipeId=void 0}finally{this._grabbing=!1}}}async _decodeAudio(t){try{let e=await(await fetch(t)).arrayBuffer(),s=window.AudioContext||window.webkitAudioContext;if(!s)return;let n=await(this._actx||(this._actx=new s)).decodeAudioData(e);if(t!==this._envUrl)return;this._env=us(n.getChannelData(0),n.sampleRate,Ms)}catch{this._env=null}}_audioLevel(){let t=this._env,e=this._envEl;if(e)return e.currentTime?t?ms(t,e.currentTime):null:0;if(!t||this._mp!=="playing")return null;let s=this._envPos+(Date.now()-this._envAt)/1e3+(Number(this._config.audio_offset)||0);return ms(t,s)}_sylShapes(t,e){let s=this._speech;s.pulses.push({born:s.t,amp:t}),s.pulses.length>6&&s.pulses.shift();let i=Math.random()*6.283185;s.spikes.push({a:i,sg:.1+Math.random()*.08,h:.06+t*.06,born:s.t,dur:.12+Math.random()*.08},{a:i+(Math.random()-.5)*.6,sg:.22+Math.random()*.18,h:.04+t*.05,born:s.t+.04,dur:e*(.9+Math.random()*.4)}),s.spikes.length>14&&s.spikes.splice(0,s.spikes.length-14)}_speechTick(t){let e=this._speech;e.t+=t;let s=this._audioLevel();if(s!=null){s>.2&&s>(e.last||0)*1.4&&(e.count++,e.syl={start:e.t,dur:.22,peak:s,f:5+s*4},this._sylShapes(s,.22)),e.last=s,e.live=!0;let a=s>e.env?.05:.14;e.env+=(s-e.env)*(1-Math.exp(-t/a)),e.env>1&&(e.env=1);return}if(e.live=!1,e.t>=e.next){let a=.22+Math.random()*.26,h=.5+Math.random()*.5;e.syl={start:e.t,dur:a,peak:h,f:5+Math.random()*4},e.count++;let c=.02+Math.random()*.05;e.count%(5+Math.floor(Math.random()*6))===0&&(c+=.14+Math.random()*.26),e.next=e.t+a+c,this._sylShapes(h,a)}let i=0,n=e.syl;if(n){let a=(e.t-n.start)/n.dur;a>=0&&a<=1&&(i=n.peak*1.2*(.5-.5*Math.cos(2*Math.PI*a)))}let o=i>e.env?.22:.5;e.env+=(i-e.env)*(1-Math.exp(-t/o)),e.env>1&&(e.env=1)}_pulseTable(t){let e=this._ptab||(this._ptab=new Float32Array(gt));if(e.fill(0),t<.01)return e;let s=this._speech;for(let i of s.pulses){let n=s.t-i.born;if(n>2.4)continue;let o=.58+n*.26,a=i.amp*Math.exp(-n/1)*t;for(let h=0;h<gt;h++){let c=xs+h/(gt-1)*ys-o;e[h]+=a*Math.exp(-(c*c)/.0055)}}return e}_peakTable(t,e,s){let i=this._ktab||(this._ktab=new Float32Array(mt));i.fill(0);let n=this._t,o=.05*e.amp+.08*s;for(let h of this._peaks){h.a+=t*h.w*(.6+e.swirl);let c=.35+.65*(.5+.5*Math.sin(n*h.f+h.ph)),d=h.h*c*o;if(d<.002)continue;let u=h.sg*(1-.4*s),p=2*u*u;for(let f=0;f<mt;f++){let m=f/mt*6.283185-h.a;m=(m%6.283185+6.283185)%6.283185,m>3.141593&&(m-=6.283185),i[f]+=d*Math.exp(-(m*m)/p)}}let a=this._speech;for(let h=a.spikes.length-1;h>=0;h--){let c=a.spikes[h],d=a.t-c.born;if(d>c.dur+.3){a.spikes.splice(h,1);continue}if(d<0)continue;let u=d<.12?d/.12:1,p=d>c.dur?Math.exp(-(d-c.dur)/.3):1,f=c.h*u*p*e.speech;if(f<.003)continue;let m=2*c.sg*c.sg;for(let g=0;g<mt;g++){let b=g/mt*6.283185-c.a;b=(b%6.283185+6.283185)%6.283185,b>3.141593&&(b-=6.283185),i[g]+=f*Math.exp(-(b*b)/m)}}return i}_sprite(t,e,s){let i=t<<16|e<<8|s;if(this._sprKey===i)return this._spr;let n=this._spr||(this._spr=document.createElement("canvas"));n.width=n.height=32;let o=n.getContext("2d");o.clearRect(0,0,32,32);let a=o.createRadialGradient(16,16,0,16,16,16);return a.addColorStop(0,`rgba(${t},${e},${s},0.75)`),a.addColorStop(.4,`rgba(${t},${e},${s},0.3)`),a.addColorStop(1,`rgba(${t},${e},${s},0)`),o.fillStyle=a,o.fillRect(0,0,32,32),this._sprKey=i,n}_segTick(t){if(this._segRot===void 0&&(this._segRot=-Math.PI/2),this._segRot+=t*.019,this._segWave=(this._segWave||0)+t*.5,this._sessions==null)return this._ambientTick(t);let e=this._segMap||(this._segMap=new Map),s=1-Math.exp(-t/.7),i=new Set;for(let n of this._sessions){i.add(n.id);let o=e.get(n.id);o||(o={size:.02,fill:Math.random(),pulse:Math.random()*6.28,rgb:[46,157,245],gone:!1},e.set(n.id,o)),o.weight=Math.max(.8,Math.log10((n.bytes||0)+1e4)-3.2),o.busy=!!n.busy,o.done=!!n.done,o.gone=!1}for(let[n,o]of e){if(i.has(n)||(o.gone=!0),o.size+=((o.gone?0:o.weight)-o.size)*s,o.gone&&o.size<.03){e.delete(n);continue}o.pulse+=t*(o.busy?2.4:.9),o.busy&&(o.fill=(o.fill+t*.3)%1);let a=o.done?[40,226,138]:[46,157,245];for(let h=0;h<3;h++)o.rgb[h]+=(a[h]-o.rgb[h])*s}}_segBand(t){let e=Math.abs(-Math.sin(t)-Math.sin(this._segWave||0));return e>1?0:.5+.5*Math.cos(e*Math.PI)}_wash(t,e,s,i,n,o,a,h){let c=Math.max(2,Math.min(12,Math.ceil((a-o)/.1))),d=(a-o)/c;for(let u=0;u<c;u++){let p=o+u*d,f=Math.min(a,p+d);t.globalAlpha=h*(.5+1.15*this._segBand(p+d/2)),t.beginPath(),t.arc(e,s,n,p,f),t.arc(e,s,i,f,p,!0),t.closePath(),t.fill()}}_drawSegs(t,e,s,i,n,o,a){if(this._sessions==null)return this._drawAmbientSegs(t,e,s,i,n,o,a);let h=6.283185,c=i*.475,d=i*.655,u=(g,b,z,w)=>{t.beginPath(),t.arc(e,s,w,g,b),t.arc(e,s,z,b,g,!0),t.closePath()},p=this._segMap,f=0;if(p)for(let g of p.values())f+=g.size;if(!p||!p.size||f<=0){t.fillStyle=`rgb(${n},${o},${a})`,t.globalAlpha=.05,u(0,h,c,d),t.fill(),t.globalAlpha=1;return}let m=this._segRot;for(let g of p.values()){let b=g.size/f*h,z=Math.min(.035,b),w=m+z/2,y=m+b-z/2;m+=b;let E=y-w;if(!(E<.004)&&(t.fillStyle=`rgb(${Math.round(g.rgb[0])},${Math.round(g.rgb[1])},${Math.round(g.rgb[2])})`,this._wash(t,e,s,c,d,w,y,(g.busy?.22:.1)+(g.done?.07:0)),g.busy)){let A=Math.max(.1,E*.35),k=w+g.fill*E,I=14;for(let $=0;$<I;$++){let H=k-$*A/I,R=Math.max(w,H-A/I);if(H<=w)break;t.globalAlpha=.3*Math.pow(1-$/I,1.6),u(R,H,c,d),t.fill()}}}t.globalAlpha=1}_ambientTick(t){let e=this._segs;if(!e){e=this._segs=[],this._segRot=-Math.PI/2;for(let n=0;n<22;n++){let o=Math.random()<.75;e.push({size:.5+Math.random()*1.4,fill:o?1:Math.random()*.7,rate:.12+Math.random()*.3,state:o?"done":"load",doneT:Math.random()*9})}}let s=0,i=0;for(let n of e)n.state==="grow"?s++:n.state==="die"&&i++;if(!s&&e.length<26&&Math.random()<t*.5&&e.splice(Math.floor(Math.random()*(e.length+1)),0,{size:.02,target:.5+Math.random()*1.4,fill:0,rate:.12+Math.random()*.3,state:"grow",doneT:0}),i<2&&e.length>16){let n=null;for(let o of e)o.state==="done"&&o.doneT>8&&(!n||o.doneT>n.doneT)&&(n=o);n&&Math.random()<t*.25&&(n.state="die")}for(let n=e.length-1;n>=0;n--){let o=e[n];o.state==="grow"?(o.size+=t*.5,o.size>=o.target&&(o.size=o.target,o.state="load")):o.state==="load"?(o.fill+=t*o.rate,o.fill>=1&&(o.fill=1,o.state="done",o.doneT=0)):o.state==="done"?o.doneT+=t:(o.size-=t*.12,o.fill=Math.max(0,o.fill-t*.25),o.size<=.02&&e.splice(n,1))}}_drawAmbientSegs(t,e,s,i,n,o,a){let h=this._segs;if(!h||!h.length)return;let c=0;for(let w of h)c+=w.size;if(c<=0)return;let d=i*.475,u=i*.655,p=n*.5+74|0,f=o*.72+48|0,m=a*.8+82|0;t.fillStyle=`rgb(${p},${f},${m})`;let g=(w,y,E,A)=>{t.beginPath(),t.arc(e,s,A,w,y),t.arc(e,s,E,y,w,!0),t.closePath()},b=6.283185,z=this._segRot;for(let w=0;w<h.length;w++){let y=h[w],E=y.size/c*b,A=Math.min(.028,E),k=z+A/2,I=z+E-A/2;z+=E;let $=I-k;if(!($<.004)&&(this._wash(t,e,s,d,u,k,I,.13),y.fill>.01)){let H=y.state==="done"?.14+.2*Math.exp(-y.doneT/2.2):.34;this._wash(t,e,s,d,u,k,k+$*y.fill,H*.8)}}t.globalAlpha=1}_pump(){this._ctx&&this.isConnected&&this._onScreen!==!1&&!document.hidden?this._start():this._stop()}_start(){if(this._raf)return;this._last=performance.now();let t=e=>{this._raf=requestAnimationFrame(t);let s=e-this._last,i=Math.min(.05,s/1e3);this._last=e,this._perfTick(s),this._draw(i)};this._raf=requestAnimationFrame(t)}_perfTick(t){if(t<=0||t>250)return;let e=this._perf||(this._perf={q:1,acc:0,n:0,hold:40});if(e.hold>0){e.hold--;return}if(e.acc+=t,++e.n<45)return;let s=e.acc/e.n;e.acc=0,e.n=0,s>26&&e.q>.2?this._setQuality(Math.max(.2,e.q*.65)):s<14&&e.q<1&&this._setQuality(Math.min(1,e.q*1.2))}_setQuality(t){let e=this._perf;t!==e.q&&(e.q=t,e.hold=40,this._particles=null,this._measure())}_stop(){this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_targets(){let t=this._effectiveState(),e=t==="offline"?this._config.offline_color:this._config[bs[t]];return{energy:vs[t],rgb:$s(e)}}_nearestAnchor(t,e,s){let i=s,n=s?Math.hypot(t.x-s.x,t.y-s.y)-s.r*.35:1/0;for(let o of e){let a=Math.hypot(t.x-o.x,t.y-o.y);a<n&&(n=a,i=o)}return i}_bubbleField(t){let e=t*.42;return{core:e,R:e,newR:()=>t*(.03+Math.pow(Math.random(),1.6)*.028),minAnchor:t*.058,maxR:t*.13}}_spawnBubble(t,e,s,i,n){let o=i??Math.random()*Math.PI*2,a=n??t.newR(),h=t.core+a;return{x:e+Math.cos(o)*h,y:s+Math.sin(o)*h,vx:0,vy:0,r:0,full:a,anchor:a>=t.minAnchor,host:null,held:!0,pop:-1,life:0,roll:Math.random()<.5?-1:1,wob:Math.random()*Math.PI*2,age:0,span:45+Math.random()*70}}_drawBubbles(t){let e=this._ctx,s=this._w,i=this._h;if(!s||!i)return;let n=s/2,o=i/2,a=Math.min(s,i)/2,{energy:h,rgb:c}=this._targets(),d=1-Math.exp(-t/.55),u=1-Math.exp(-t/.16),p=this._cur;for(let l of Object.keys(h)){let M=l==="speech"&&h[l]<p[l]?u:d;p[l]+=(h[l]-p[l])*M}for(let l=0;l<3;l++)this._rgb[l]+=(c[l]-this._rgb[l])*d;let f=Math.round(this._rgb[0]),m=Math.round(this._rgb[1]),g=Math.round(this._rgb[2]);h.speech>.5&&this._speech.env<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),p.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*d;let b=this._speech,z=.5+.5*Math.sin(b.t*.5+.8*Math.sin(b.t*.21)),w=b.live?.88:.62,y=(w*b.env+(1-w)*z)*p.speech;this._t+=t;let E=p.swirl/1.8,A=Number(this._config.particle_size)||1,k=this._bubbleField(a),I=Math.max(6,Math.round(18*A));if(this._bub&&this._bubHalf&&this._bubHalf!==a){let l=a/this._bubHalf;for(let M of this._bub)M.x=n+(M.x-n)*l,M.y=o+(M.y-o)*l,M.r*=l,M.full*=l,M.vx*=l,M.vy*=l,M.popR&&(M.popR*=l);this._bubHalf=a}if(!this._bub){this._bubHalf=a,this._bub=[];for(let l=0;l<I;l++){let M=Math.min(k.newR()*(1+Math.random()*2.2),k.maxR),S=this._spawnBubble(k,n,o,l/I*Math.PI*2,M);S.r=S.full,S.anchor=S.r>=k.minAnchor,S.age=Math.random()*S.span,this._bub.push(S)}for(let l=0;l<100;l++)we(this._bub,2),$e(this._bub,n,o,k.core),ke(this._bub,n,o,k.core),Me(this._bub,n,o,k.core,2);for(let l of this._bub)l.vx=0,l.vy=0;this._release=0}let $=this._bub;for(let l of $)l.held&&l.pop<0&&(l.anchor=l.r>=k.minAnchor);let H=$.filter(l=>l.anchor&&l.held&&l.pop<0),R=k.core*(1+y*.07+Math.sin(this._t*.22)*.005);for(this._release+=y*t*3.2;this._release>=1;){this._release-=1;let l=$.filter(T=>T.held&&!T.anchor&&T.pop<0&&T.r>T.full*.6),M=l.length>2?l:$.filter(T=>T.held&&T.pop<0&&T.r>T.full*.6);if(M.length<3)break;let S=M[Math.floor(Math.random()*M.length)];S.host=null,S.held=!1,S.life=0;let B=Math.hypot(S.x-n,S.y-o)||1,L=(S.x-n)/B,P=(S.y-o)/B,C=a*(.5+Math.random()*.5);S.vx=L*C-P*a*.12,S.vy=P*C+L*a*.12}let xt=a*(.045+E*.11);for(let l of $){l.wob+=t*1.3;let M=l.dx??l.x,S=l.dy??l.y;if(l.pop>=0){l.pop+=t;continue}if(l.held){if(l.r+=(l.full-l.r)*(1-Math.exp(-t/2)),l.anchor){let C=Math.hypot(l.x-n,l.y-o)||1,T=(l.x-n)/C,N=(l.y-o)/C,q=(R+l.r-C)*5;l.vx+=(T*q-N*xt)*t,l.vy+=(N*q+T*xt)*t}else{!l.host||!l.host.held||l.host.pop>=0?l.host=this._nearestAnchor(l,H,null):l.host=this._nearestAnchor(l,H,l.host);let C=l.host;if(C){let T=l.x-C.x,N=l.y-C.y,D=Math.hypot(T,N);D<.001&&(T=.1,N=0,D=.1);let q=T/D,it=N/D,Q=(C.r+l.r-D)*6,K=a*.055*l.roll;l.vx+=(q*Q-it*K)*t,l.vy+=(it*Q+q*K)*t}else{let T=Math.hypot(l.x-n,l.y-o)||1,N=R+l.r;l.vx+=(l.x-n)/T*(N-T)*5*t,l.vy+=(l.y-o)/T*(N-T)*5*t}}let P=Math.exp(-t*(l.anchor?5.5:6.5));l.vx*=P,l.vy*=P}else l.life+=t,l.vy-=a*.85*t,l.vx*=Math.exp(-t*.9),l.r*=Math.exp(-t*.16),(l.life>1+Math.random()*.4||l.x<-a||l.x>s+a||l.y<-a)&&(l.pop=0,l.popR=l.r);let B=a*(l.held?.22:1.4),L=Math.hypot(l.vx,l.vy);L>B&&(l.vx=l.vx/L*B,l.vy=l.vy/L*B),l.x+=l.vx*t,l.y+=l.vy*t}we($,2),$e($,n,o,R),ke($,n,o,R),Me($,n,o,R,2);let pt=1-Math.exp(-t/.11);for(let l of $)l.dx===void 0?(l.dx=l.x,l.dy=l.y,l.dr=l.r):(l.dx+=(l.x-l.dx)*pt,l.dy+=(l.y-l.dy)*pt,l.dr+=(l.r-l.dr)*pt);_s($,{dt:t,rate:.2+E*.15,sizeBias:3,maxRatio:2.1,maxR:k.maxR});for(let l of $)!l.held||l.pop>=0||(l.age+=t*(1+E*.5),gs(l,{dt:t,maxR:k.maxR})&&(l.held=!1,l.pop=0,l.popR=l.r));for(let l=$.length-1;l>=0;l--)$[l].pop>ws&&$.splice(l,1);let se=0;for(;se++<1;){let l=$.filter(C=>C.held&&C.pop<0),M=l.filter(C=>Math.hypot(C.x-n,C.y-o)<=R+C.r*1.7),{angle:S,gap:B}=fs(M,n,o),L=Math.sin(Math.min(B,Math.PI)/2)*R;if(M.length>1&&L<k.newR()*1.4)break;let P=L>k.minAnchor*1.5;if(l.length>=I&&!P||l.length>=I*1.7)break;$.push(this._spawnBubble(k,n,o,S))}e.clearRect(0,0,s,i),e.globalCompositeOperation="lighter";let ut=e.createRadialGradient(n-R*.3,o-R*.35,R*.08,n,o,R),ft=.34+y*.22;ut.addColorStop(0,`rgba(${Math.min(255,f+80)},${Math.min(255,m+80)},${Math.min(255,g+65)},${ft})`),ut.addColorStop(.6,`rgba(${f},${m},${g},${ft*.55})`),ut.addColorStop(1,`rgba(${f},${m},${g},0)`),e.fillStyle=ut,e.beginPath(),e.arc(n,o,R,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${m},${g},${.3+y*.28})`,e.lineWidth=Math.max(.8,R*.018),e.beginPath(),e.arc(n,o,R*.985,0,Math.PI*2),e.stroke(),e.fillStyle=`rgba(255,255,255,${.13+y*.12})`,e.beginPath(),e.arc(n-R*.36,o-R*.4,R*.14,0,Math.PI*2),e.fill();let Ot=$.slice().sort((l,M)=>M.r-l.r);for(let l of Ot){let M=l.dx??l.x,S=l.dy??l.y;if(l.pop>=0){let D=Math.min(1,l.pop/ws),q=l.popR||l.r,it=1-Math.pow(1-D,2),yt=Math.pow(1-D,1.7);if(D<.55){let Q=q*(1-D*.12),K=e.createRadialGradient(M-Q*.3,S-Q*.35,Q*.1,M,S,Q),It=.34*Math.pow(1-D/.55,1.4);K.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,m+95)},${Math.min(255,g+75)},${It})`),K.addColorStop(1,`rgba(${f},${m},${g},0)`),e.fillStyle=K,e.beginPath(),e.arc(M,S,Q,0,Math.PI*2),e.fill()}e.strokeStyle=`rgba(${f},${m},${g},${yt*.3})`,e.lineWidth=Math.max(.4,q*.035*(1-D*.6)),e.beginPath(),e.arc(M,S,q*(1+it*.22),0,Math.PI*2),e.stroke();continue}let B=l.dx??l.x,L=l.dy??l.y,P=(l.dr??l.r)*(1+Math.sin(l.wob)*.015);if(P<.6)continue;let C=l.held?1:Math.max(0,1-l.life/2.1),T=(.5+y*.28)*C,N=e.createRadialGradient(B-P*.3,L-P*.35,P*.1,B,L,P);N.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,m+95)},${Math.min(255,g+75)},${T})`),N.addColorStop(.55,`rgba(${f},${m},${g},${T*.7})`),N.addColorStop(1,`rgba(${f},${m},${g},0)`),e.fillStyle=N,e.beginPath(),e.arc(B,L,P,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${m},${g},${(.26+y*.16)*C})`,e.lineWidth=Math.max(.5,P*.045),e.beginPath(),e.arc(B,L,P*.97,0,Math.PI*2),e.stroke(),P>3&&(e.fillStyle=`rgba(255,255,255,${(.26+y*.2)*C})`,e.beginPath(),e.arc(B-P*.34,L-P*.38,P*.17,0,Math.PI*2),e.fill())}e.globalCompositeOperation="source-over"}_draw(t){let e=this._ctx;if(!e)return;if(this._config.animation!=="jarvis-v1")return this._drawBubbles(t);if(!this._particles)return;let s=this._w,i=this._h,n=s/2,o=i/2,a=Math.min(s,i)/2,{energy:h,rgb:c}=this._targets(),d=1-Math.exp(-t/.55),u=1-Math.exp(-t/.16),p=this._cur;for(let _ of Object.keys(h)){let j=_==="speech"&&h[_]<p[_]?u:d;p[_]+=(h[_]-p[_])*j}for(let _=0;_<3;_++)this._rgb[_]+=(c[_]-this._rgb[_])*d;let f=Math.round(this._rgb[0]),m=Math.round(this._rgb[1]),g=Math.round(this._rgb[2]);this._t+=t,this._waveT+=t*(.5+p.swirl*.9),this._spin+=t*(.09+p.swirl*.05),this._head+=t*(1.1+p.swirl*1.4),h.speech>.5&&this._cur.speech<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),p.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*d;let b=this._speech,z=.5+.5*Math.sin(b.t*.5+.8*Math.sin(b.t*.21)),w=b.live?.88:.62,y=(w*b.env+(1-w)*z)*p.speech,E=this._speech.syl?this._speech.syl.f:11;this._churnT+=t*(.55+p.swirl*.85+y*.7),this._waveT+=t*y*.8;let A=this._churnT,k=this._pulseTable(p.speech),I=this._peakTable(t,p,y);e.clearRect(0,0,s,i);let $=this._t,H=this._waveT,R=this._spin*.6,xt=.955,pt=.296,se=.72+.28*Math.sin($*.21+1.3)*Math.sin($*.093+4.1),ut=.012*Math.sin($*.16+.7),ft=a*.38*1.16,Ot=a*.38*.7,l=ft*ft,M=ft-Ot,S=.92,B=.075;e.fillStyle=`rgb(${f},${m},${g})`;let L=this._sprite(f,m,g),P=this._bins||(this._bins=[]);for(let _=0;_<zt;_++)P[_]=new Path2D;let C=this._perf?.q??1,T=1+(1-C)*.6,N=C>=.5,D=(Number(this._config.particle_size)||1)*dt(a/220,.75,1.8)*(1+(1-C)*.35);for(let _ of this._particles){let j=Zt[_.ri],O=_.lon+R*j.rev+_.drift*A+_.wobA*(1+y*1)*(Math.sin(A*_.wobW+_.wobP)+.6*Math.sin(A*_.wobW*2.3+_.wobP*2.1)),V=Math.cos(O),nt=Math.sin(O),ae=_.cosLat*V,G=_.sinLat,Bt=_.cosLat*nt,Ss=.45*Math.sin(5*O-H*1.4+G*2.3)+.3*Math.sin(8*O+H*1.05-G*3.1)+.3*Math.sin((ae*.9+G*.32+Bt*.28)*3.1+H*.9)+.2*Math.sin(13*O-H*2.1+G*1.8),Ts=.45*Math.cos(5*O-H*1.4+G*2.3)+.3*Math.cos(8*O+H*1.05-G*3.1),Pe=.5+.5*Math.sin(O-A*(.5+_.ri*.13)+_.ri*2.1),tt=se*(.45+1.3*Pe*Pe)*(p.turb+y*.6);tt>1.1&&(tt=1.1);let Es=Math.sin((ae*.7-G*.6+Bt*.4)*7.3+H*1.8),Lt=Ss*(.4+tt)+Es*.38*tt,je=_.off+_.bobA*(.7+.6*tt)*(Math.sin(A*_.bobW+_.bobP)+.55*Math.sin(A*_.bobW*2.7+_.bobP*1.9)),re=1-Math.min(1,Math.abs(je)),Re=p.amp*(1+y*.4),Y=j.r+p.radius+ut+y*.015+j.amp*Re*Lt+je*j.thick;Lt>.75&&(Y+=(Lt-.75)*.04*tt);let wt=ae,$t=G*xt-Bt*pt,Cs=G*pt+Bt*xt,Ut=Math.sqrt(wt*wt+$t*$t)||1e-4,ze=Math.atan2($t,wt),le=ze*.15915494%1;le<0&&(le+=1);let he=I[le*mt|0];Y+=he*(.35+.65*re);let Ht=($+_.lt)%_.lf;Ht/=_.lf,Y+=(Ht-.5)*.008;let ce=6*Ht*(1-Ht);ce>1&&(ce=1);let Ps=.24+.76*re*re,et=_.br*j.glow*Ps*ce*(.55+.45*Math.abs(Math.sin($*_.tw*.6+_.ph)))*p.bright;et*=.68+.32*Math.sin(O*2.7+A*.45+_.ph*3);let de=Ut*Ut;if(et*=.09+1.6*de*de*de,et*=.62+.5*Math.max(0,Lt),et*=.85+.3*tt,et*=1+he*(4+y*6),p.sweep>.01){let U=(ze-this._head)%6.283185;U<0&&(U+=6.283185),U>3.141593&&(U-=6.283185),et*=1+Math.exp(-(U*U)/.25)*p.sweep*2.4}let Nt=0;if(p.speech>.01){let U=(Y-xs)/ys*(gt-1);U=U<0?0:U>gt-1?gt-1:U|0,Nt=k[U],Y+=Nt*.07,et*=1+Nt*1.1+y*.7}Y>S&&(Y=S+B*Math.tanh((Y-S)/B));let Oe=Y*a,Ie=Cs*.5+.5,Be=_.sz*D*(.78+.32*Ie)*(1+y*.25+Nt*.5+he*(.8+y*2)),Le=a*j.amp*Re*Ts*(.5+tt*.45),Dt=Oe*wt-$t/Ut*Le,qt=Oe*$t+wt/Ut*Le,kt=1,Ue=Dt*Dt+qt*qt;if(Ue<l){if(kt=(Math.sqrt(Ue)-Ot)/M,kt<.02)continue;kt*=kt}let He=dt(et*T*(.45+.65*Ie)*kt,0,1);if(_.halo&&N){let U=Be*8;e.globalAlpha=He*.22,e.drawImage(L,n+Dt-U/2,o+qt-U/2,U,U)}let Ne=Be*.56,De=n+Dt,qe=o+qt,Ve=P[Math.min(zt-1,He*zt|0)];Ve.moveTo(De+Ne,qe),Ve.arc(De,qe,Ne,0,6.283185)}for(let _=0;_<zt;_++)e.globalAlpha=(_+.5)/zt,e.fill(P[_]);e.globalAlpha=1,this._segTick(t),this._drawSegs(e,n,o,a,f,m,g);let q=a*.38,it=Math.cos(this._spin),yt=Math.sin(this._spin),Q=Math.cos(.35),K=Math.sin(.35),It=Ee.verts,ie=It.length;(!this._proj||this._proj.length!==ie*3)&&(this._proj=new Float64Array(ie*3));let F=this._proj;for(let _=0;_<ie;_++){let j=It[_],O=j[0]*it+j[2]*yt,V=-j[0]*yt+j[2]*it,nt=j[1]*Q-V*K;F[_*3]=n+O*q,F[_*3+1]=o-nt*q,F[_*3+2]=j[1]*K+V*Q}e.save(),e.beginPath(),e.arc(n,o,q,0,Math.PI*2),e.clip();let ne=Ee.edges,oe=dt(p.bright*(1+y*.45),.3,1.9);for(let _=0;_<2;_++){let j=_===1;e.beginPath();for(let O=0;O<ne.length;O+=2){let V=ne[O]*3,nt=ne[O+1]*3;F[V+2]+F[nt+2]>0===j&&(e.moveTo(F[V],F[V+1]),e.lineTo(F[nt],F[nt+1]))}e.strokeStyle=j?`rgba(220,246,255,${.4*oe})`:`rgba(${f},${m},${g},${.13*oe})`,e.lineWidth=Math.max(.35,a*(j?.0032:.0024)),e.stroke()}e.fillStyle="rgba(235,252,255,1)";for(let _ of Zs){let j=_.v*3;if(F[j+2]<=.15)continue;let O=Math.pow(Math.abs(Math.sin($*_.tw+_.ph)),6)*oe;if(O<.04)continue;e.globalAlpha=dt(O,0,1);let V=Math.max(1,a*.008);e.fillRect(F[j]-V/2,F[j+1]-V/2,V,V)}e.globalAlpha=1,e.restore()}_fmtElapsed(t){if(t==null)return"";let e=Math.floor(t/60);return e<1?`${Math.floor(t)}s`:e<60?`${e}m`:`${Math.floor(e/60)}h ${e%60}m`}_chipProjects(){let t=n=>n.replace(/\b\w/g,o=>o.toUpperCase()),e=n=>typeof n=="string"?{project:n,label:t(n)}:n,s=this._config.build_projects,i=this._projects||[];return Array.isArray(s)&&s.length?s.map(e).filter(n=>!i.length||i.includes(n.project)):i.map(e)}_renderList(){let t=this._sessions;return x`
      <div class="phead">
        <button
          class="hbtn hex"
          data-ai="toggle-build-mode"
          title="Exit build mode"
          @click=${()=>this._setBuild(!1)}
        >
          <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <span class="ptitle">${this._name} Agents</span>
        <button
          class="hbtn"
          data-ai="create-session"
          @click=${()=>this._picking=!this._picking}
        >+ New</button>
      </div>
      ${this._picking?x`<div class="chips">
            ${this._chipProjects().map(e=>x`<button class="chip" @click=${()=>this._newSession(e.project)}>
                ${e.label}
              </button>`)}
          </div>`:v}
      <div class="list">
        ${t==null?x`<div class="dim pad">Scanning…</div>`:t.length===0?x`<div class="dim pad">No sessions running.</div>`:t.map(e=>x`
                  <div class="rowwrap ${this._swipe===e.id?"open":""}">
                    <button
                      class="rowkill"
                      data-ai="swipe-end-session"
                      @click=${()=>this._killSession(e.id)}
                    >${this._confirmKill===e.id?"Sure?":"End"}</button>
                    <button
                      class="row"
                      data-ai="open-session"
                      @click=${()=>this._rowTap(e.id)}
                      @touchstart=${s=>this._swipeStart(s,e.id)}
                      @touchmove=${s=>this._swipeMove(s,e.id)}
                      @touchend=${()=>this._swipeEnd(e.id)}
                      @touchcancel=${()=>this._swipeEnd(e.id)}
                    >
                      <span
                        class="dot ${e.busy?"busy":e.done?"done":"idle"}"
                        title=${e.done?"finished \u2014 not opened yet":v}
                      ></span>
                      <span class="rmain">
                        <span class="rlabel">
                          ${e.title||e.label}
                          ${e.busy?x`<span class="rtime">${this._fmtElapsed(e.elapsed)}</span>`:v}
                        </span>
                        ${e.last_message?x`<span class="rsnip">${e.last_message}</span>`:v}
                        <span class="rmeta">
                          <span class="pill">${e.project}</span>
                          ${e.label!==e.project?x`<span class="pill alt">${e.label.replace(`${e.project}, `,"")}</span>`:v}
                        </span>
                      </span>
                      <span class="chev">›</span>
                    </button>
                  </div>
                `)}
      </div>
    `}_renderSession(){let t=(this._sessions||[]).find(e=>e.id===this._sel);return x`
      <div class="phead">
        <button class="hbtn" data-ai="close-session-view" @click=${()=>this._select(null)}>‹</button>
        <button
          class="ptitle tappable"
          data-ai="session-details"
          title="What is this session?"
          @click=${()=>this._details=!this._details}
        >
          ${t?.title||t?.label||"session"}
          ${t?.busy?x`<span class="livedot"></span> working ${this._fmtElapsed(t.elapsed)}`:v}
          <span class="caret">${this._details?"\u25B4":"\u25BE"}</span>
        </button>
        <button
          class="hbtn danger ${this._confirmKill===this._sel?"armed":""}"
          data-ai="end-session"
          @click=${()=>this._killSession(this._sel)}
        >${this._confirmKill===this._sel?"Confirm?":"End"}</button>
      </div>
      ${this._details?x`<div class="details">
            <div class="drow">
              <span class="dkey">Project</span>
              <span class="pill">${t?.project||"unknown"}</span>
              ${t?.label&&t.label!==t.project?x`<span class="pill alt">${t.label.replace(`${t.project}, `,"")}</span>`:v}
            </div>
            <div class="drow col">
              <span class="dkey">You opened with</span>
              <span class="dfirst">${t?.first_message||"Nothing recorded yet."}</span>
            </div>
          </div>`:v}
      <div
        class="log"
        @scroll=${e=>{let s=e.target;this._stick=s.scrollHeight-s.scrollTop-s.clientHeight<40}}
      >
        ${this._msgs==null?x`<div class="dim pad">Loading transcript…</div>`:this._msgs.length===0?x`<div class="dim pad">Nothing here yet.</div>`:this._msgs.map(e=>x`<div class="msg ${e.role}">${this._body(e)}</div>`)}
        ${this._activity&&t?.busy?x`<div class="activity">${this._activity}</div>`:v}
        ${this._ask?this._renderAsk(this._ask):v}
        ${(this._queue||[]).filter(e=>e.id===this._sel).map(e=>x`<div class="qitem ${e.state}">
              <button
                class="qtext"
                data-ai="edit-queued"
                ?disabled=${e.state==="sent"}
                title=${e.state==="held"?"Tap to edit":""}
                @click=${()=>e.state==="held"&&this._editQueued(e)}
              >${e.text}</button>
              <div class="qbar">
                <span class="qtag">
                  ${e.state==="sent"?"sending\u2026":t?.busy?"queued \xB7 sends when this turn ends":"queued"}
                </span>
                ${e.state==="held"?x`
                      <button class="qbtn" @click=${()=>this._editQueued(e)}>edit</button>
                      <button class="qbtn" @click=${()=>this._dispatch(e)}>send now</button>
                      <button class="qbtn del" @click=${()=>this._dropQueued(e)}>✕</button>
                    `:v}
              </div>
            </div>`)}
      </div>
      <form
        class="composer ${this._dragging?"drag":""}"
        @submit=${this._send}
        @dragover=${e=>{[...e.dataTransfer?.types||[]].includes("Files")&&(e.preventDefault(),e.dataTransfer.dropEffect="copy",this._dragging=!0)}}
        @dragleave=${e=>{e.currentTarget.contains(e.relatedTarget)||(this._dragging=!1)}}
        @drop=${e=>{e.preventDefault(),this._dragging=!1,this._ingest([...e.dataTransfer?.files||[]])}}
      >
        ${(this._files||[]).length||this._uploading?x`<div class="atts">
              ${(this._files||[]).map(e=>x`<span class="att">
                  <span class="attname">${e.name}</span>
                  <button
                    class="attx"
                    title="Remove"
                    @click=${()=>this._dropFile(e)}
                  >✕</button>
                </span>`)}
              ${this._uploading?x`<span class="att pendingatt">sending…</span>`:v}
            </div>`:v}
        <div
          class="cbox"
          @pointerdown=${e=>{e.target.closest("button, input, textarea, select")||(e.preventDefault(),this._composerEl()?.focus())}}
        >
        <div class="cbtns">
          ${this._sel?this._renderRunControls():v}
          <input
            class="filepick"
            type="file"
            multiple
            accept="image/*,.txt,.md,.log,.json,.csv,.yaml,.yml,.pdf"
            @change=${this._attach}
          />
          <button
            type="button"
            class="hbtn clip"
            data-ai="attach-file"
            title="Attach a file or screenshot"
            ?disabled=${this._uploading}
            @click=${()=>this.renderRoot.querySelector(".filepick")?.click()}
          >
            <svg viewBox="0 0 24 24"><path d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3l8-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button
            type="button"
            class="hbtn mic ${this._dictating?"rec":""} ${this._canMic?"":"off"}"
            data-ai="dictate-prompt"
            title=${this._canMic?"Dictate":"Dictation needs the https (Nabu Casa) address"}
            @click=${this._composerMic}
          >
            <svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          <button class="hbtn send" data-ai="send-prompt" ?disabled=${this._pending}>
            ${this._pending?"\u2026":"Send"}
          </button>
        </div>
        <textarea
          data-ai="compose-prompt"
          rows="2"
          placeholder="Message ${this._name}…"
          autocomplete="off"
          ?disabled=${this._pending}
          @keydown=${e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this._send(e))}}
          @focus=${()=>this._settlePin()}
          @input=${e=>{this._autoGrow(e.target),this._draftSoon()}}
        ></textarea>
        </div>
      </form>
    `}render(){if(!this._config)return v;if(!this._hass?.states?.[this._config.entity])return x`
        <ha-card>
          <div class="missing">
            Entity <code>${this._config.entity}</code> not found
          </div>
        </ha-card>
      `;let e=this._effectiveState(),s=e==="offline"?this._config.offline_color:this._config[bs[e]],i=!!this._build,n=this._announce??null,o=this._messages??null;return x`
      <ha-card
        class="bg-${this._config.background}${this._config.honeycomb===!1?"":" comb"}${e==="offline"?" dim":""}"
        style=${this._config.honeycomb===!1?"":`--jr-comb:${ei(s)}`}
      >
        <div
          class="wrap state-${e} ${i&&!this._config.build_dashboard?"build":""} ${this._config.build_page?"page":""} ${i&&this._config.panel_fullscreen&&!this._config.build_dashboard?"over":""}"
          style=${this._cardVars(s)}
        >
          <button
            class="mode ${i?"on":""}"
            data-ai="toggle-build-mode"
            title="Build mode"
            @click=${()=>this._setBuild(!i)}
          >
            <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
          ${n===null?v:x`<button
                class="mode speaker ${n?"on":""}"
                data-ai="toggle-agent-announcements"
                title=${n?`${this._name} finishes out loud - tap to send to your phone instead`:`${this._name} finishes go to your phone - tap to hear them here`}
                @click=${this._toggleAnnounce}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4v-5z"
                    fill=${n?"currentColor":"none"}
                  />
                  <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" fill="none" />
                  <path d="M18 7a7 7 0 0 1 0 10" fill="none" />
                </svg>
              </button>`}
          ${o===null?v:x`<button
                class="mode bell ${o?"on":""}"
                data-ai="toggle-hubbubb-messages"
                title=${o?"New Hubbubb messages are read out here - tap to go quiet":"Hubbubb messages stay quiet - tap to hear new ones here"}
                @click=${this._toggleMessages}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 2.5h15L18 15z"
                    fill=${o?"currentColor":"none"}
                  />
                  <path d="M10 19a2 2 0 0 0 4 0" fill="none" />
                </svg>
              </button>`}
          ${i&&!this._config.build_dashboard?x`<div class="panel">
                ${this._sel?this._renderSession():this._renderList()}
                ${this._err?x`<div class="perr">${this._err}</div>`:v}
              </div>`:v}
          <div class="ring ${this._config.animation==="jarvis-v1"?"":"bubbles"}" data-ai="activate-assistant" @click=${this._ringTap}>
            <canvas></canvas>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <radialGradient id="jrCore">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="0.4" />
                  <stop offset="45%" stop-color="currentColor" stop-opacity="0.09" />
                  <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="jrSphere">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="0.26" />
                  <stop offset="100%" stop-color="currentColor" stop-opacity="0.05" />
                </radialGradient>
                <pattern
                  id="jrHex"
                  width=${vt.w}
                  height=${vt.h}
                  patternUnits="userSpaceOnUse"
                >
                  <path d=${As} class="hex" />
                </pattern>
                <radialGradient id="jrHexFade">
                  <stop offset="0%" stop-color="#fff" />
                  <stop offset="78%" stop-color="#fff" />
                  <stop offset="100%" stop-color="#000" />
                </radialGradient>
                <mask id="jrHexMask">
                  <circle cx="100" cy="100" r="124" fill="url(#jrHexFade)" />
                  <circle cx="100" cy="100" r="40" fill="#000" />
                </mask>
              </defs>

              <circle class="core" cx="100" cy="100" r="92" fill="url(#jrCore)" />

              <g class="scene">
                <g class="honeycomb" mask="url(#jrHexMask)">
                  <rect x="0" y="0" width="200" height="200" fill="url(#jrHex)" />
                </g>

                <circle class="sphere-fill" cx="100" cy="100" r="38" fill="url(#jrSphere)" />
                <circle class="rim" cx="100" cy="100" r="38" />
                <circle class="rim-outer" cx="100" cy="100" r="40.5" />
              </g>
            </svg>
          </div>
        </div>
      </ha-card>
    `}};Mt(bt,"build",ks),Mt(bt,"properties",{_config:{state:!0},_state:{state:!0},_mp:{state:!0},_build:{state:!0},_sessions:{state:!0},_projects:{state:!0},_sel:{state:!0},_msgs:{state:!0},_ask:{state:!0},_askSent:{state:!0},_activity:{state:!0},_permission:{state:!0},_modelBusy:{state:!0},_models:{state:!0},_modes:{state:!0},_model:{state:!0},_queue:{state:!0},_swipe:{state:!0},_details:{state:!0},_files:{state:!0},_dragging:{state:!0},_uploading:{state:!0},_err:{state:!0},_confirmKill:{state:!0},_picking:{state:!0},_pending:{state:!0},_voiceState:{state:!0},_announce:{state:!0},_messages:{state:!0},_dictating:{state:!0}}),Mt(bt,"styles",ue`
    :host {
      display: block;
    }
    ha-card {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      overflow: hidden;
      line-height: 0;
    }
    ha-card.bg-dark {
      background: radial-gradient(circle at 50% 45%, #0a181c 0%, #030709 72%);
      border: none;
    }
    /* Full-bleed honeycomb. A pseudo-element rather than a background on the
       card, so the card keeps its own gradient underneath and the pattern can
       be faded independently of it. */
    ha-card.comb::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: var(--jr-comb);
      background-repeat: repeat;
      opacity: 0.055;
      pointer-events: none;
      transition: opacity 900ms ease;
    }
    ha-card.comb.dim::before {
      opacity: 0.02;
    }
    ha-card {
      position: relative;
    }
    ha-card.bg-transparent {
      background: none;
      border: none;
      box-shadow: none;
    }
    .missing {
      padding: 16px;
      color: var(--error-color, #db4437);
      text-align: center;
      line-height: 1.4;
    }
    .wrap {
      position: relative;
      /* Docking is three things moving at once - the ring shrinking, the row
         reflowing, the panel arriving. They share one curve and one duration
         so it reads as a single movement rather than three that happen to
         overlap. flex-direction cannot be transitioned, so the panel covers
         that instant with its own entrance. */
      transition: height 380ms cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 100%;
      width: 100%;
    }
    .ring.bubbles svg {
      display: none;
    }
    .ring {
      position: relative;
      width: var(--jr-size, 240px);
      max-width: 100%;
      aspect-ratio: 1 / 1;
      cursor: pointer;
      transition: width 380ms cubic-bezier(0.22, 1, 0.36, 1);
      -webkit-tap-highlight-color: transparent;
    }
    .ring:active {
      filter: brightness(1.25);
    }

    /* ---------------- build mode ---------------- */
    .wrap.build {
      flex-direction: row;
      align-items: stretch;
      gap: 12px;
      padding: 12px;
      box-sizing: border-box;
      height: var(--jr-panel-h, clamp(280px, var(--jr-size), 480px));
    }
    /* The dedicated build dashboard fills the view. Sized off the VISIBLE
       viewport, not dvh: dvh ignores the keyboard, so the page stayed taller
       than the screen and the browser scrolled the header away to reach the
       composer. --jr-vvh shrinks with the keyboard, so the page always fits
       and there is never anything to scroll. */
    .wrap.build.page {
      /* HA's header is the only thing above the panel view — read its own
         variable instead of guessing, or the leftover shows as a black bar
         under the card. */
      height: calc(100vh - var(--header-height, 56px));
      height: calc(var(--jr-vvh, 100dvh) - var(--header-height, 56px));
    }
    /* Fullscreen build mode. Fixed, not absolute: the panel should cover the
       dashboard, and an absolutely positioned child is still trapped inside
       whatever grid cell the card was given. */
    :host(.jr-over) {
      position: fixed;
      inset: 0;
      z-index: 8;
    }
    .wrap.build.over {
      position: fixed;
      inset: var(--header-height, 56px) 0 0 0;
      height: auto;
      z-index: 8;
      background: var(--jr-panel-bg, rgba(3, 7, 9, 0.97));
      backdrop-filter: blur(3px);
    }
    .wrap.build .ring {
      order: 1;
      width: clamp(90px, 24%, 170px);
      align-self: center;
      flex: none;
    }
    .mode {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 3;
      width: 32px;
      height: 32px;
      padding: 5px;
      background: none;
      border: none;
      color: var(--jr-color);
      opacity: 0.45;
      cursor: pointer;
      transition: opacity 0.3s, filter 0.3s;
    }
    .mode:hover {
      opacity: 0.9;
    }
    .mode.on {
      opacity: 1;
      filter: drop-shadow(0 0 6px var(--jr-color));
    }
    .mode svg {
      position: static;
      width: 100%;
      height: 100%;
    }
    /* Opposite corner from the build hexagon: the speaker on the edge where
       the bell used to sit, the Hubbubb bell tucked inboard of it. Solid when
       that channel speaks here, hollow when it does not - .mode/.mode.on
       supply the rest. */
    .mode.speaker {
      left: auto;
      right: 8px;
    }
    .mode.bell {
      left: auto;
      right: 44px;
    }
    /* fill is set as a presentation attribute on the path, which still takes
       part in the cascade - so the swap eases instead of snapping. */
    .mode.speaker svg path,
    .mode.bell svg path {
      transition: fill 0.25s;
    }

    /* Conditionally rendered, so there is no "before" state to transition
       from - a mount animation is the only thing that can play here. */
    @keyframes jr-panel-in {
      from {
        opacity: 0;
        transform: translateX(22px) scale(0.985);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .wrap.build .panel {
      animation: jr-panel-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @media (prefers-reduced-motion: reduce) {
      .wrap,
      .ring {
        transition: none;
      }
      .wrap.build .panel {
        animation: none;
      }
    }
    .panel {
      order: 2;
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      background: var(
        --jr-panel-bg,
        linear-gradient(160deg, rgba(10, 24, 32, 0.92), rgba(4, 10, 14, 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(53, 154, 210, 0.35));
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(46, 157, 245, 0.08);
      padding: 10px 12px;
      color: var(--jr-panel-text, #cfe9f7);
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
      line-height: 1.4;
      text-align: left;
      overscroll-behavior: contain;
    }
    .phead {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(53, 154, 210, 0.3);
      flex: none;
    }
    .ptitle {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--jr-color);
      text-shadow: 0 0 8px rgba(46, 157, 245, 0.5);
    }
    .hbtn {
      flex: none;
      background: rgba(46, 157, 245, 0.06);
      border: 1px solid rgba(53, 154, 210, 0.45);
      color: #bfe3f5;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 10px;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .hbtn:hover {
      background: rgba(46, 157, 245, 0.18);
      box-shadow: 0 0 10px rgba(46, 157, 245, 0.35);
    }
    .hbtn.danger {
      border-color: rgba(255, 90, 100, 0.5);
      color: #ffb3b8;
    }
    .hbtn.danger.armed {
      background: rgba(255, 70, 80, 0.25);
      box-shadow: 0 0 10px rgba(255, 70, 80, 0.5);
      color: #fff;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-bottom: 8px;
      flex: none;
    }
    .chip {
      background: none;
      border: 1px solid rgba(53, 154, 210, 0.4);
      border-radius: 4px;
      color: #b8dff2;
      font-size: 11.5px;
      padding: 4px 10px;
      cursor: pointer;
      font-family: inherit;
      letter-spacing: 0.05em;
    }
    .chip:hover {
      background: rgba(46, 157, 245, 0.15);
    }
    .list {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(53, 154, 210, 0.14);
      padding: 8px 4px;
      cursor: pointer;
      color: inherit;
      font-family: inherit;
      text-align: left;
    }
    .row:hover {
      background: rgba(46, 157, 245, 0.08);
    }
    .dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .dot.idle {
      background: var(--jr-color);
      box-shadow: 0 0 6px var(--jr-color);
    }
    /* same meaning as a green plate on the ring: finished, not opened yet */
    .dot.done {
      background: #28e28a;
      box-shadow: 0 0 8px #28e28a;
    }
    .dot.busy {
      background: #ffaa33;
      box-shadow: 0 0 8px #ffaa33;
      animation: jr-blink 1.1s ease-in-out infinite;
    }
    .livedot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ffaa33;
      box-shadow: 0 0 8px #ffaa33;
      animation: jr-blink 1.1s ease-in-out infinite;
      margin: 0 2px 0 6px;
      vertical-align: middle;
    }
    @keyframes jr-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }
    .rmain {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .rlabel {
      font-size: 13px;
      letter-spacing: 0.04em;
      color: #e4f4fd;
    }
    .rtime {
      font-size: 10px;
      color: #ffaa33;
      letter-spacing: 0.1em;
      margin-left: 8px;
    }
    .rsnip {
      font-size: 11px;
      color: rgba(160, 200, 220, 0.55);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rmeta {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin-top: 3px;
    }
    .pill {
      font-size: 9.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--jr-color);
      background: rgba(46, 157, 245, 0.12);
      border: 1px solid rgba(53, 154, 210, 0.35);
      border-radius: 999px;
      padding: 2px 8px;
      white-space: nowrap;
    }
    .pill.alt {
      color: #ffc477;
      background: rgba(255, 170, 51, 0.1);
      border-color: rgba(255, 170, 51, 0.35);
    }

    /* Swipe left to reveal End. The kill button sits underneath and the row
       slides off it. */
    .rowwrap {
      position: relative;
      overflow: hidden;
    }
    .rowwrap .row {
      position: relative;
      z-index: 1;
      background: linear-gradient(160deg, #0b1a22 0%, #070f15 100%);
      transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
      touch-action: pan-y;
    }
    .rowwrap.open .row {
      transform: translateX(-84px);
    }
    .rowkill {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 84px;
      border: none;
      background: rgba(255, 70, 80, 0.22);
      color: #ff8a92;
      font-family: inherit;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
    }
    .rowkill:hover {
      background: rgba(255, 70, 80, 0.32);
    }

    /* Tap the title for what this session actually is. */
    .ptitle.tappable {
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      padding: 0;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--jr-color);
    }
    .caret {
      font-size: 9px;
      opacity: 0.7;
      margin-left: 4px;
    }
    .details {
      flex: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 8px;
      padding: 9px 10px;
      background: rgba(46, 157, 245, 0.06);
      border: 1px solid rgba(53, 154, 210, 0.28);
      border-radius: 8px;
    }
    .drow {
      display: flex;
      align-items: center;
      gap: 7px;
      flex-wrap: wrap;
    }
    .drow.col {
      flex-direction: column;
      align-items: flex-start;
      gap: 3px;
    }
    .dkey {
      font-size: 9.5px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(160, 200, 220, 0.6);
    }
    .dfirst {
      font-size: 12px;
      line-height: 1.45;
      color: #d6edf9;
      max-height: 5.9em;
      overflow-y: auto;
    }
    .chev {
      flex: none;
      color: rgba(120, 180, 215, 0.5);
      font-size: 16px;
    }
    .log {
      contain: layout;
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 2px 2px 8px;
      scrollbar-width: thin;
      scrollbar-color: rgba(53, 154, 210, 0.4) transparent;
      overscroll-behavior: contain;
    }
    /* The page around us (the companion app's webview especially) turns
       selection off to feel native. The conversation is text worth copying. */
    .log,
    .msg {
      user-select: text;
      -webkit-user-select: text;
      -webkit-touch-callout: default;
    }
    .msg {
      max-width: 94%;
      font-size: 14.5px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      /* A full transcript is ~110 messages and, because every line of tool
         output is its own div, ~840 elements of pre-wrap text. Laying all of
         that out is what made opening build mode stall and what every forced
         reflow while typing had to repeat — the composer's auto-grow measures
         itself on each keystroke, and that measurement is only cheap if the
         log above it is not in the same layout pass. Off-screen messages now
         skip layout and paint entirely, and the auto keyword keeps each
         one's real height once rendered, so scrolling does not jump. */
      content-visibility: auto;
      contain-intrinsic-size: auto 44px;
    }
    .msg.assistant {
      align-self: flex-start;
      border-left: 2px solid var(--jr-color);
      padding-left: 9px;
      color: #d6edf9;
    }
    .msg.user {
      align-self: flex-end;
      background: rgba(46, 157, 245, 0.12);
      border: 1px solid rgba(53, 154, 210, 0.25);
      padding: 5px 9px;
      color: #a8d8f0;
    }
    .msg.screen {
      max-width: 100%;
      font-family: "SF Mono", Menlo, Consolas, "Cascadia Mono", monospace;
      color: var(--jr-term-text, inherit);
      font-size: 11.5px;
      opacity: 0.85;
      background: rgba(0, 0, 0, 0.35);
      padding: 8px;
      border: 1px solid rgba(53, 154, 210, 0.18);
    }
    /* Everything the terminal shows: what Claude thought, every tool call
       and every result. Tools and their output are full-width mono blocks —
       they are terminal output, not a chat bubble. */
    .msg.think {
      align-self: flex-start;
      font-style: italic;
      font-size: 13px;
      color: rgba(178, 160, 220, 0.8);
      border-left: 2px solid rgba(150, 120, 220, 0.45);
      padding-left: 9px;
    }
    .msg.tool,
    .msg.out,
    .msg.err {
      align-self: stretch;
      max-width: 100%;
      font-family: "SF Mono", Menlo, Consolas, "Cascadia Mono", monospace;
      color: var(--jr-term-text, inherit);
      font-size: 11.5px;
      line-height: 1.45;
      padding: 5px 8px;
      background: rgba(0, 0, 0, 0.32);
      border-left: 2px solid rgba(53, 154, 210, 0.35);
      color: #9fb4c4;
    }
    .msg.tool {
      border-left-color: rgba(126, 231, 135, 0.55);
      color: #cfe6d6;
    }
    .msg.err {
      border-left-color: rgba(255, 123, 114, 0.7);
      background: rgba(255, 60, 60, 0.07);
      color: #ffb3ae;
    }
    /* Line colouring, shared by every mono block. */
    .l-cmd {
      color: #7ee787;
    }
    .l-add {
      color: #7ee787;
    }
    .l-del {
      color: #ff7b72;
    }
    .l-err {
      color: #ff9d95;
    }
    .l-warn {
      color: #e3b341;
    }
    .l-tool {
      color: #ffd9a0;
    }
    .msg code {
      font-family: "SF Mono", Menlo, Consolas, "Cascadia Mono", monospace;
      color: var(--jr-term-text, inherit);
      font-size: 0.92em;
      color: #8fd0ff;
      background: rgba(46, 157, 245, 0.13);
      border-radius: 3px;
      padding: 0 3px;
    }
    .msg b {
      color: #ffffff;
      font-weight: 600;
    }
    .composer {
      display: block;
      flex: none;
      padding-top: 8px;
      border-top: 1px solid rgba(53, 154, 210, 0.3);
    }
    /* The box owns the border and background; the textarea and the button row
       stack inside it. The buttons used to be positioned over the textarea,
       which meant long text scrolled underneath and hid them — a row of their
       own cannot be covered. */
    .cbox {
      display: flex;
      flex-direction: column;
      background: rgba(0, 10, 16, 0.6);
      border: 1px solid rgba(53, 154, 210, 0.4);
      border-radius: 6px;
      overflow: hidden;
    }
    .cbox:focus-within,
    .composer.drag .cbox {
      border-color: var(--jr-color);
      box-shadow: 0 0 10px rgba(46, 157, 245, 0.35);
    }
    .composer.drag .cbox {
      border-style: dashed;
    }
    .composer textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      background: none;
      border: none;
      color: #e4f4fd;
      font-family: inherit;
      font-size: 13px;
      line-height: 1.4;
      /* The textarea is now the bottom of the box, so its last line is what
         the rounded bottom corners would clip. Scale the gap off the same
         variable that sets that radius. */
      padding: 2px 10px max(8px, calc(var(--jr-botr, 16px) * 0.3));
      outline: none;
      resize: none;
      /* Mirrors _growCap(): never more than a third of the visible viewport,
         so the send row stays on screen when the keyboard is up. */
      max-height: min(190px, calc(var(--jr-vvh, 100dvh) * 0.32));
      overflow-y: auto;
      scrollbar-width: thin;
    }
    /* Buttons along the top of the box, input underneath. The top corners are
       a plain 6px, so nothing up here has a curve to dodge — the clearance
       that used to live on this row now belongs to the textarea below. */
    .cbtns {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      padding: 6px 6px 2px;
    }
    /* Sits inside the composer's button row, immediately left of attach, so the
       whole row reads as one group at the right-hand end. */
    .runbar {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .runsel {
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      border-radius: 999px;
      padding: 2px 22px 2px 10px;
      font-size: 10px;
      letter-spacing: 0.05em;
      cursor: pointer;
      /* The native arrow is a different size and colour on every platform, so
         it is drawn here instead — the select still opens the OS picker. */
      appearance: none;
      -webkit-appearance: none;
      background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
        linear-gradient(135deg, currentColor 50%, transparent 50%);
      background-position: right 9px center, right 5px center;
      background-size: 4px 4px, 4px 4px;
      background-repeat: no-repeat;
      max-width: 46vw;
      text-overflow: ellipsis;
    }
    /* The list itself is drawn by the OS, which uses the page's colours, not
       the chip's — without this the options are dark text on dark. */
    .runsel option {
      background: #16181d;
      color: #e8eaed;
    }
    .runsel:hover:not(:disabled) {
      border-color: rgba(46, 157, 245, 0.7);
      color: #cfe9ff;
    }
    .runsel:disabled {
      opacity: 0.45;
      cursor: default;
    }
    .runsel.busy {
      border-color: #ffaa33;
      color: #ffaa33;
    }
    /* The permission picker is the one place a wrong assumption is expensive,
       so it is colour-coded by how much it lets through. */
    .runsel.perm {
      text-transform: lowercase;
    }
    .runsel.mode-manual {
      border-color: rgba(46, 157, 245, 0.55);
      color: #9fd4ff;
    }
    .runsel.mode-auto {
      border-color: rgba(255, 140, 60, 0.65);
      color: #ffb37a;
    }
    .runsel.mode-plan {
      border-color: rgba(126, 231, 199, 0.6);
      color: #7ee7c7;
    }
    .runsel.mode-accept-edits {
      border-color: rgba(255, 170, 51, 0.6);
      color: #ffcc80;
    }
    .runsel.mode-bypass {
      border-color: rgba(255, 92, 92, 0.7);
      color: #ff9d9d;
    }
    .filepick {
      display: none;
    }
    .hbtn.clip {
      padding: 3px 8px;
      display: inline-flex;
      align-items: center;
    }
    .hbtn.clip svg {
      position: static;
      width: 18px;
      height: 18px;
      color: var(--jr-color);
      display: block;
    }
    .hbtn.clip[disabled] {
      opacity: 0.45;
    }
    .atts {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-bottom: 7px;
    }
    .att {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      font-size: 11px;
      color: #d6edf9;
      background: rgba(46, 157, 245, 0.12);
      border: 1px solid rgba(53, 154, 210, 0.35);
      border-radius: 999px;
      padding: 3px 5px 3px 10px;
    }
    .attname {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 190px;
    }
    .attx {
      flex: none;
      background: none;
      border: none;
      color: #ff8a92;
      font-family: inherit;
      font-size: 11px;
      line-height: 1;
      padding: 2px 4px;
      cursor: pointer;
    }
    .pendingatt {
      color: #ffaa33;
      border-color: rgba(255, 170, 51, 0.4);
      background: rgba(255, 170, 51, 0.1);
      padding-right: 10px;
      animation: jr-blink 1.4s ease-in-out infinite;
    }
    .msg.cmd {
      align-self: center;
      max-width: 100%;
      font-family: "SF Mono", Menlo, Consolas, "Cascadia Mono", monospace;
      color: var(--jr-term-text, inherit);
      font-size: 11.5px;
      line-height: 1.5;
      color: rgba(150, 195, 220, 0.75);
      background: rgba(53, 154, 210, 0.07);
      border-left: 2px solid rgba(53, 154, 210, 0.4);
      padding: 4px 9px;
    }

    /* Queued: still ours, not yet Claude's. Editable until it goes out. */
    .qitem {
      align-self: flex-end;
      max-width: 94%;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: rgba(255, 170, 51, 0.07);
      border: 1px dashed rgba(255, 170, 51, 0.5);
      border-radius: 8px;
      padding: 7px 9px;
    }
    .qitem.sent {
      border-style: solid;
      border-color: rgba(53, 154, 210, 0.35);
      background: rgba(46, 157, 245, 0.1);
      opacity: 0.75;
    }
    .qtext {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      text-align: left;
      font-family: inherit;
      font-size: 12.5px;
      line-height: 1.4;
      color: #f0dcbe;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      cursor: pointer;
    }
    .qitem.sent .qtext {
      color: #a8d8f0;
      cursor: default;
    }
    .qbar {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .qtag {
      flex: 1;
      min-width: 0;
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #ffaa33;
    }
    .qitem.sent .qtag {
      color: rgba(160, 200, 220, 0.7);
      animation: jr-blink 1.4s ease-in-out infinite;
    }
    .qbtn {
      flex: none;
      background: none;
      border: 1px solid rgba(255, 170, 51, 0.4);
      color: #ffc477;
      font-family: inherit;
      font-size: 10px;
      padding: 3px 7px;
      border-radius: 4px;
      cursor: pointer;
    }
    .qbtn:hover {
      border-color: #ffaa33;
      background: rgba(255, 170, 51, 0.12);
    }
    .qbtn.del {
      border-color: rgba(255, 120, 130, 0.4);
      color: #ff8a92;
    }
    .activity {
      align-self: flex-start;
      font-family: "SF Mono", Menlo, Consolas, "Cascadia Mono", monospace;
      color: var(--jr-term-text, inherit);
      font-size: 11px;
      color: rgba(160, 200, 220, 0.7);
      animation: jr-blink 1.6s ease-in-out infinite;
    }
    .askbox {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid rgba(255, 170, 51, 0.45);
      /* Opaque: it sits ON TOP of the transcript rather than in the flow. */
      background: #241d12;
      padding: 10px;
      /* Pinned to the bottom of the log. A question you have to scroll to find
         gets missed, and a long multi-select used to push its own Submit button
         below the fold - the button was there and unreachable. The box always
         fits; the option list scrolls inside it. */
      position: sticky;
      bottom: 0;
      z-index: 3;
      max-height: 62%;
      box-shadow: 0 -10px 22px rgba(0, 0, 0, 0.55);
    }
    .askopts {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      /* Its own column, or the options shrink-wrap their text and the list
         comes out ragged down the right edge. */
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .askopts .askopt {
      align-self: stretch;
      width: 100%;
    }
    .askhead {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .askchip {
      font-size: 9px;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(46, 157, 245, 0.18);
      color: #9fd4ff;
    }
    .askstep,
    .askmulti {
      font-size: 10px;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.45);
    }
    .askmulti {
      color: #7ee7c7;
    }
    .askdesc {
      display: block;
      margin-top: 2px;
      font-size: 10px;
      line-height: 1.35;
      color: rgba(255, 255, 255, 0.55);
      white-space: normal;
    }
    .askopt.on {
      border-color: rgba(0, 229, 255, 0.55);
      background: rgba(0, 229, 255, 0.1);
    }
    .asksubmit {
      margin-left: auto;
      border: 0;
      border-radius: 7px;
      padding: 5px 14px;
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: #04121b;
      background: #00e5ff;
      cursor: pointer;
    }
    .asksubmit:hover {
      filter: brightness(1.1);
    }
    .asktext {
      font-size: 12px;
      color: #ffd9a0;
      white-space: pre-wrap;
    }
    .askopt {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;
      background: rgba(0, 10, 16, 0.6);
      border: 1px solid rgba(53, 154, 210, 0.4);
      color: #e4f4fd;
      font-family: inherit;
      font-size: 12.5px;
      padding: 8px 10px;
      cursor: pointer;
    }
    .askopt:hover:not([disabled]) {
      border-color: var(--jr-color);
    }
    .askopt[disabled] {
      opacity: 0.4;
      cursor: default;
    }
    .askopt.picked {
      opacity: 1;
      border-color: #ffaa33;
      background: rgba(255, 170, 51, 0.14);
      color: #ffd9a0;
    }
    .asklabel {
      flex: 1;
      min-width: 0;
    }
    .asktick {
      flex: none;
      color: #ffaa33;
    }
    .asknum {
      flex: none;
      color: #ffaa33;
      font-size: 11px;
    }
    .askrow {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }
    .askrow .dim {
      margin-right: auto;
      font-size: 10px;
      animation: jr-blink 1.4s ease-in-out infinite;
    }
    .askmini {
      background: none;
      border: 1px solid rgba(53, 154, 210, 0.3);
      color: rgba(160, 200, 220, 0.7);
      font-family: inherit;
      font-size: 11px;
      padding: 3px 8px;
      cursor: pointer;
    }
    /* In build mode the toggle lives in the panel header, not floating. */
    .wrap.build .mode {
      display: none;
    }
    .hbtn.hex {
      padding: 3px 7px;
    }
    .hbtn.hex svg,
    .hbtn.mic svg {
      position: static;
      width: 18px;
      height: 18px;
      color: var(--jr-color);
      display: block;
    }
    /* Shown everywhere, not just on phones — dictating into a session is just
       as useful from a laptop or a tablet. */
    .hbtn.mic {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
    }
    /* The browser only grants microphone access in a secure context, so over
       the plain-http LAN address it cannot work at all. Dim rather than hide,
       and let the click explain why. */
    .hbtn.mic.off svg {
      color: rgba(160, 200, 220, 0.5);
    }
    .hbtn.mic.off {
      opacity: 0.55;
    }
    .hbtn.mic.rec {
      border-color: rgba(255, 90, 100, 0.7);
      background: rgba(255, 70, 80, 0.12);
    }
    .hbtn.mic.rec svg {
      color: #ff5a64;
      animation: jr-blink 1s ease-in-out infinite;
    }

    /* Phones: build mode is a full-screen overlay pinned to the visual
       viewport — the keyboard shrinks it instead of scrolling the dashboard,
       so the composer always sits right on top of the keyboard. */
    @media (max-width: 620px) {
      .wrap.build .ring {
        display: none;
      }
      .wrap.build {
        /* inline build mode: the fixed overlay below is the real UI */
        height: 140px;
      }
      .wrap.build .panel {
        /* opaque: the HA header must not ghost through the overlay */
        background: linear-gradient(160deg, #0b1a22 0%, #05090d 100%);
      }
      /* home dashboard: the ring owns the first screenful */
      .wrap:not(.build) {
        min-height: calc(100vh - 150px);
        min-height: calc(100dvh - 150px);
        justify-content: center;
      }
      .wrap.build:not(.page) .panel {
        position: fixed;
        /* Flush to the sides, inset vertically by the safe area. There is no
           CSS env() for the display's corner radius — safe-area-inset-* are
           the only device metrics exposed — but Apple's insets already ACCOUNT
           for the rounded corners, so the top and bottom edges land where the
           screen is straight. That is why the corners stopped being clipped:
           the panel no longer reaches into the curve, rather than trying to
           guess a radius that matches it. In portrait the left/right insets
           are 0, so the sides sit truly flush with no gap. */
        left: env(safe-area-inset-left, 0px);
        right: env(safe-area-inset-right, 0px);
        top: calc(var(--jr-vvt, 0px) + env(safe-area-inset-top, 0px));
        /* Runs all the way to the bottom of the visible viewport: with the
           keyboard up that is the keyboard's top edge, so the composer sits
           flush against it. Subtracting the bottom safe-area inset here left a
           dead band under the message box instead. */
        height: calc(var(--jr-vvh, 100dvh) - env(safe-area-inset-top, 0px));
        /* or the padding is added to the height and the composer ends up
           below the fold, behind the keyboard */
        box-sizing: border-box;
        z-index: 20;
        /* Cosmetic now, not corner-clearance: both horizontal edges are
           already outside the curve, so a modest radius is enough. */
        border-radius: 18px 18px var(--jr-botr, 56px) var(--jr-botr, 56px);
        /* Tight at the bottom: the composer is the last thing in the panel and
           a full 12px under it read as dead space. The sides and top keep
           their breathing room. */
        padding: 12px 14px 10px;
      }
      /* The dedicated build page: no overlay tricks — the panel is a normal
         element sized to exactly fill the screen below HA's header, so the
         page has nothing to scroll and nothing to cut off. */
      .wrap.build.page {
        height: calc(100vh - 56px);
        height: calc(var(--jr-vvh, 100dvh) - 56px);
        padding: 8px;
      }
      /* Pinned to the visible viewport, exactly like the overlay above. On a
         phone this is the only thing that survives iOS: whatever the browser
         scrolls to chase the focused input, the panel still sits over the
         visible area with the composer directly above the keyboard. Sizing
         alone was not enough — the page kept the scroll iOS gave it and left a
         screen of nothing above the keyboard. */
      .wrap.build.page .panel {
        position: fixed;
        /* Flush to the sides, inset vertically by the safe area. There is no
           CSS env() for the display's corner radius — safe-area-inset-* are
           the only device metrics exposed — but Apple's insets already ACCOUNT
           for the rounded corners, so the top and bottom edges land where the
           screen is straight. That is why the corners stopped being clipped:
           the panel no longer reaches into the curve, rather than trying to
           guess a radius that matches it. In portrait the left/right insets
           are 0, so the sides sit truly flush with no gap. */
        left: env(safe-area-inset-left, 0px);
        right: env(safe-area-inset-right, 0px);
        top: calc(var(--jr-vvt, 0px) + env(safe-area-inset-top, 0px));
        /* Runs all the way to the bottom of the visible viewport: with the
           keyboard up that is the keyboard's top edge, so the composer sits
           flush against it. Subtracting the bottom safe-area inset here left a
           dead band under the message box instead. */
        height: calc(var(--jr-vvh, 100dvh) - env(safe-area-inset-top, 0px));
        box-sizing: border-box;
        z-index: 20;
        /* Cosmetic now, not corner-clearance: both horizontal edges are
           already outside the curve, so a modest radius is enough. */
        border-radius: 18px 18px var(--jr-botr, 56px) var(--jr-botr, 56px);
        /* Tight at the bottom: the composer is the last thing in the panel and
           a full 12px under it read as dead space. The sides and top keep
           their breathing room. */
        padding: 12px 14px 10px;
      }
      .composer textarea {
        font-size: 16px; /* anything smaller makes iOS zoom the page */
      }
      /* The message box is the last thing in the panel, so its bottom corners
         sit inside the panel's. Follow that curve, minus the panel's side
         padding, or a 56px panel corner wraps around a 6px box corner and the
         gap between them looks like a mistake. */
      .cbox {
        border-radius: 6px 6px
          max(6px, calc(var(--jr-botr, 16px) - 14px))
          max(6px, calc(var(--jr-botr, 16px) - 14px));
      }
    }

    .dim {
      color: rgba(160, 200, 220, 0.55);
      font-size: 12px;
    }
    .pad {
      padding: 10px 4px;
    }
    .perr {
      flex: none;
      color: #ff8a92;
      font-size: 11px;
      padding-top: 6px;
    }
    canvas,
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    svg {
      overflow: visible;
      color: var(--jr-color);
      transition: color 900ms ease;
      pointer-events: none;
    }
    circle,
    path,
    rect,
    g {
      transform-origin: 100px 100px;
      transform-box: view-box;
    }
    circle {
      fill: none;
      stroke: currentColor;
    }

    .core {
      stroke: none;
      opacity: 0.5;
      animation: jr-breathe 7s ease-in-out infinite;
      transition: opacity 900ms ease;
    }
    .scene {
      opacity: var(--jr-scene, 0.78);
      transition: opacity 900ms ease;
    }

    .hex {
      fill: none;
      stroke: currentColor;
      stroke-width: 0.35;
    }
    .honeycomb {
      opacity: 0.2;
    }

    .sphere-fill {
      stroke: none;
    }
    .rim {
      stroke: #eafaff;
      stroke-width: 1.7;
      opacity: 0.92;
    }
    .rim-outer {
      stroke: #eafaff;
      stroke-width: 0.6;
      opacity: 0.4;
      animation: jr-rim 7s ease-in-out infinite;
    }

    .state-idle {
      --jr-scene: 0.72;
    }
    .state-listening {
      --jr-scene: 1;
    }
    .state-processing {
      --jr-scene: 0.95;
    }
    .state-responding {
      --jr-scene: 0.95;
    }
    .state-offline {
      --jr-scene: 0.25;
    }
    .state-offline .core {
      opacity: 0.06;
    }
    .state-listening .core {
      opacity: 0.9;
    }
    .state-processing .core,
    .state-responding .core {
      opacity: 0.75;
    }

    @keyframes jr-breathe {
      0%,
      100% {
        transform: scale(0.99);
      }
      50% {
        transform: scale(1.015);
      }
    }
    @keyframes jr-rim {
      0%,
      100% {
        opacity: 0.22;
      }
      50% {
        opacity: 0.65;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .core,
      .rim-outer {
        animation-duration: 24s;
      }
    }
  `);var si=[{name:"entity",required:!0,selector:{entity:{domain:te}}},{name:"animation",selector:{select:{mode:"dropdown",options:[{value:"hubbubb",label:"Hubbubb - ring and bubbles"},{value:"jarvis-v1",label:"Jarvis v1 - segments and motes"}]}}},{name:"assistant_name",selector:{text:{}}},{name:"size",selector:{number:{min:80,max:600,step:10,mode:"slider"}}},{name:"background",selector:{select:{mode:"dropdown",options:[{value:"dark",label:"Deep space (dark)"},{value:"card",label:"Normal card background"},{value:"transparent",label:"Transparent"}]}}},{name:"honeycomb",selector:{boolean:{}}},{name:"tap_message",selector:{text:{}}},{name:"",type:"expandable",title:"Toggles",icon:"mdi:toggle-switch-outline",schema:[{name:"build_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"announce_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"messages_entity",selector:{entity:{domain:["switch","input_boolean"]}}}]},{name:"",type:"expandable",title:"Build panel",icon:"mdi:hexagon-multiple-outline",schema:[{name:"panel_fullscreen",selector:{boolean:{}}},{name:"panel_height",selector:{number:{min:0,max:1400,step:20,mode:"box"}}},{name:"build_dashboard",selector:{text:{}}},{name:"build_page",selector:{boolean:{}}},{name:"build_return",selector:{text:{}}}]},{name:"",type:"expandable",title:"Ring colours",icon:"mdi:palette",schema:[{name:"idle_color",selector:{text:{}}},{name:"listening_color",selector:{text:{}}},{name:"processing_color",selector:{text:{}}},{name:"responding_color",selector:{text:{}}},{name:"offline_color",selector:{text:{}}}]},{name:"",type:"expandable",title:"Panel colours",icon:"mdi:console",schema:[{name:"panel_bg",selector:{text:{}}},{name:"panel_border",selector:{text:{}}},{name:"panel_text",selector:{text:{}}},{name:"terminal_bg",selector:{text:{}}},{name:"terminal_text",selector:{text:{}}}]},{name:"",type:"expandable",title:"Advanced",icon:"mdi:tune",schema:[{name:"follow_media_player",selector:{boolean:{}}},{name:"audio_offset",selector:{number:{min:-2,max:2,step:.05,mode:"box"}}},{name:"media_player",selector:{entity:{domain:"media_player"}}},{name:"particle_size",selector:{number:{min:.3,max:3,step:.1,mode:"slider"}}},{name:"particles",selector:{number:{min:0,max:4e3,step:20,mode:"box"}}}]}],ii={entity:"Assist satellite",animation:"Animation",assistant_name:"Assistant name",size:"Ring size (px)",background:"Card background",honeycomb:"Honeycomb background",follow_media_player:"Animate while the device is playing audio",audio_offset:"Audio sync offset (seconds)",media_player:"Speaker entity (blank = same device)",tap_message:"Spoken reply when the ring is tapped",particles:"Particle count, Jarvis v1 (0 = auto)",particle_size:"How many bubbles (1 = about 22)",build_entity:"Build mode toggle",announce_entity:"Agent announcement toggle",messages_entity:"Hubbubb message toggle",panel_fullscreen:"Full screen (floats over the dashboard)",panel_height:"Panel height in px (0 = match the ring)",build_dashboard:"Open this dashboard instead",build_page:"This card IS the build dashboard",build_return:"Exit goes back to",idle_color:"Idle",listening_color:"Listening",processing_color:"Processing",responding_color:"Responding",offline_color:"Unavailable",panel_bg:"Panel background",panel_border:"Panel border",panel_text:"Panel text",terminal_bg:"Terminal background",terminal_text:"Terminal text"},ee=class extends Z{setConfig(t){this._config={...Ae,...t}}render(){return this._config?x`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${si}
        .computeLabel=${t=>ii[t.name]??t.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:v}_valueChanged(t){t.stopPropagation();let e={...t.detail.value};for(let[s,i]of Object.entries(Ae))e[s]===i&&delete e[s];delete e.name,delete e.show_state,Se(this,"config-changed",{config:e})}};Mt(ee,"properties",{hass:{},_config:{state:!0}});customElements.define("hubbubb-ring-card",bt);customElements.define("hubbubb-ring-card-editor",ee);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-ring-card",name:"Hubbubb Ring",description:"Animated glowing ring that reacts to an Assist satellite's state.",preview:!0});console.info(`%c HUBBUBB-RING-CARD %c v${Ws} `,"color:#0b1620;background:#35e0ff;font-weight:700","color:#35e0ff;background:#0b1620");
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

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
