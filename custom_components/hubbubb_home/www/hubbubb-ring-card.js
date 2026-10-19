var ai=Object.defineProperty,li=Object.defineProperties;var hi=Object.getOwnPropertyDescriptors;var hs=Object.getOwnPropertySymbols;var ci=Object.prototype.hasOwnProperty,di=Object.prototype.propertyIsEnumerable;var $e=(l,t,e)=>t in l?ai(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e,L=(l,t)=>{for(var e in t||(t={}))ci.call(t,e)&&$e(l,e,t[e]);if(hs)for(var e of hs(t))di.call(t,e)&&$e(l,e,t[e]);return l},ht=(l,t)=>li(l,hi(t));var zt=(l,t,e)=>$e(l,typeof t!="symbol"?t+"":t,e);var Zt=globalThis,te=Zt.ShadowRoot&&(Zt.ShadyCSS===void 0||Zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ke=Symbol(),cs=new WeakMap,It=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ke)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(te&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=cs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&cs.set(e,t))}return t}toString(){return this.cssText}},ds=l=>new It(typeof l=="string"?l:l+"",void 0,ke),Me=(l,...t)=>{let e=l.length===1?l[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+l[n+1],l[0]);return new It(e,l,ke)},ps=(l,t)=>{if(te)l.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Zt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,l.appendChild(s)}},Ae=te?l=>l:l=>l instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ds(e)})(l):l;var{is:pi,defineProperty:ui,getOwnPropertyDescriptor:fi,getOwnPropertyNames:_i,getOwnPropertySymbols:gi,getPrototypeOf:mi}=Object,rt=globalThis,us=rt.trustedTypes,bi=us?us.emptyScript:"",Se=rt.reactiveElementPolyfillSupport,Ot=(l,t)=>l,Te={toAttribute(l,t){switch(t){case Boolean:l=l?bi:null;break;case Object:case Array:l=l==null?l:JSON.stringify(l)}return l},fromAttribute(l,t){let e=l;switch(t){case Boolean:e=l!==null;break;case Number:e=l===null?null:Number(l);break;case Object:case Array:try{e=JSON.parse(l)}catch(s){e=null}}return e}},bs=(l,t)=>!pi(l,t),fs={attribute:!0,type:String,converter:Te,reflect:!1,useDefault:!1,hasChanged:bs},_s,gs;(_s=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(gs=rt.litPropertyMetadata)!=null||(rt.litPropertyMetadata=new WeakMap);var tt=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=fs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ui(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var o;let{get:i,set:n}=(o=fi(this.prototype,t))!=null?o:{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let a=i==null?void 0:i.call(this);n==null||n.call(this,r),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:fs}static _$Ei(){if(this.hasOwnProperty(Ot("elementProperties")))return;let t=mi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ot("properties"))){let e=this.properties,s=[..._i(e),...gi(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Ae(i))}else t!==void 0&&e.push(Ae(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return ps(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Te).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n,o,r;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),h=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:Te;this._$Em=i;let d=h.fromAttribute(e,a.type);this[i]=(r=d!=null?d:(o=this._$Ej)==null?void 0:o.get(i))!=null?r:d,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){var o,r;if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),s!=null||(s=a.getPropertyOptions(t)),!(((o=s.hasChanged)!=null?o:bs)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){var r,a,h;s&&!((r=this._$Ej)!=null?r:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=o!=null?o:e)!=null?a:this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((h=this._$Eq)!=null?h:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,r]of n){let{wrapped:a}=r,h=this[o];a!==!0||this._$AL.has(o)||h===void 0||this.C(o,void 0,r,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},ms;tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[Ot("elementProperties")]=new Map,tt[Ot("finalized")]=new Map,Se==null||Se({ReactiveElement:tt}),((ms=rt.reactiveElementVersions)!=null?ms:rt.reactiveElementVersions=[]).push("2.1.2");var Bt=globalThis,vs=l=>l,ee=Bt.trustedTypes,xs=ee?ee.createPolicy("lit-html",{createHTML:l=>l}):void 0,je="$lit$",et=`lit$${Math.random().toFixed(9).slice(2)}$`,Pe="?"+et,vi=`<${Pe}>`,pt=document,Ut=()=>pt.createComment(""),Ht=l=>l===null||typeof l!="object"&&typeof l!="function",Re=Array.isArray,Ss=l=>Re(l)||typeof(l==null?void 0:l[Symbol.iterator])=="function",Ee=`[ 	
\f\r]`,Lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ys=/-->/g,ws=/>/g,ct=RegExp(`>|${Ee}(?:([^\\s"'>=/]+)(${Ee}*=${Ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$s=/'/g,ks=/"/g,Ts=/^(?:script|style|textarea|title)$/i,ze=l=>(t,...e)=>({_$litType$:l,strings:t,values:e}),g=ze(1),wt=ze(2),Hi=ze(3),Q=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ms=new WeakMap,dt=pt.createTreeWalker(pt,129);function Es(l,t){if(!Re(l)||!l.hasOwnProperty("raw"))throw Error("invalid template strings array");return xs!==void 0?xs.createHTML(t):t}var Cs=(l,t)=>{let e=l.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=Lt;for(let r=0;r<e;r++){let a=l[r],h,d,u=-1,p=0;for(;p<a.length&&(o.lastIndex=p,d=o.exec(a),d!==null);)p=o.lastIndex,o===Lt?d[1]==="!--"?o=ys:d[1]!==void 0?o=ws:d[2]!==void 0?(Ts.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=ct):d[3]!==void 0&&(o=ct):o===ct?d[0]===">"?(o=i!=null?i:Lt,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,h=d[1],o=d[3]===void 0?ct:d[3]==='"'?ks:$s):o===ks||o===$s?o=ct:o===ys||o===ws?o=Lt:(o=ct,i=void 0);let f=o===ct&&l[r+1].startsWith("/>")?" ":"";n+=o===Lt?a+vi:u>=0?(s.push(h),a.slice(0,u)+je+a.slice(u)+et+f):a+et+(u===-2?r:f)}return[Es(l,n+(l[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Dt=class l{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,r=t.length-1,a=this.parts,[h,d]=Cs(t,e);if(this.el=l.createElement(h,s),dt.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=dt.nextNode())!==null&&a.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(je)){let p=d[o++],f=i.getAttribute(u).split(et),_=/([.?@])?(.*)/.exec(p);a.push({type:1,index:n,name:_[2],strings:f,ctor:_[1]==="."?ie:_[1]==="?"?ne:_[1]==="@"?oe:ft}),i.removeAttribute(u)}else u.startsWith(et)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ts.test(i.tagName)){let u=i.textContent.split(et),p=u.length-1;if(p>0){i.textContent=ee?ee.emptyScript:"";for(let f=0;f<p;f++)i.append(u[f],Ut()),dt.nextNode(),a.push({type:2,index:++n});i.append(u[p],Ut())}}}else if(i.nodeType===8)if(i.data===Pe)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(et,u+1))!==-1;)a.push({type:7,index:n}),u+=et.length-1}n++}}static createElement(t,e){let s=pt.createElement("template");return s.innerHTML=t,s}};function ut(l,t,e=l,s){var o,r,a;if(t===Q)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl,n=Ht(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((r=i==null?void 0:i._$AO)==null||r.call(i,!1),n===void 0?i=void 0:(i=new n(l),i._$AT(l,e,s)),s!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=ut(l,i._$AS(l,t.values),i,s)),t}var se=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var h;let{el:{content:e},parts:s}=this._$AD,i=((h=t==null?void 0:t.creationScope)!=null?h:pt).importNode(e,!0);dt.currentNode=i;let n=dt.nextNode(),o=0,r=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new yt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new re(n,this,t)),this._$AV.push(d),a=s[++r]}o!==(a==null?void 0:a.index)&&(n=dt.nextNode(),o++)}return dt.currentNode=pt,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},yt=class l{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var n;this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(n=i==null?void 0:i.isConnected)!=null?n:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ut(this,t,e),Ht(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ss(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&Ht(this._$AH)?this._$AA.nextSibling.data=t:this.T(pt.createTextNode(t)),this._$AH=t}$(t){var n;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Dt.createElement(Es(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{let o=new se(i,this),r=o.u(this.options);o.p(e),this.T(r),this._$AH=o}}_$AC(t){let e=Ms.get(t.strings);return e===void 0&&Ms.set(t.strings,e=new Dt(t)),e}k(t){Re(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new l(this.O(Ut()),this.O(Ut()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=vs(t).nextSibling;vs(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},ft=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=ut(this,t,e,0),o=!Ht(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{let r=t,a,h;for(t=n[0],a=0;a<n.length-1;a++)h=ut(this,r[s+a],e,a),h===Q&&(h=this._$AH[a]),o||(o=!Ht(h)||h!==this._$AH[a]),h===b?t=b:t!==b&&(t+=(h!=null?h:"")+n[a+1]),this._$AH[a]=h}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},ie=class extends ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},ne=class extends ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},oe=class extends ft{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){var o;if((t=(o=ut(this,t,e,0))!=null?o:b)===Q)return;let s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},re=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ut(this,t)}},js={M:je,P:et,A:Pe,C:1,L:Cs,R:se,D:Ss,V:ut,I:yt,H:ft,N:ne,U:oe,B:ie,F:re},Ce=Bt.litHtmlPolyfillSupport,As;Ce==null||Ce(Dt,yt),((As=Bt.litHtmlVersions)!=null?As:Bt.litHtmlVersions=[]).push("3.3.3");var Ps=(l,t,e)=>{var n,o;let s=(n=e==null?void 0:e.renderBefore)!=null?n:t,i=s._$litPart$;if(i===void 0){let r=(o=e==null?void 0:e.renderBefore)!=null?o:null;s._$litPart$=i=new yt(t.insertBefore(Ut(),r),r,void 0,e!=null?e:{})}return i._$AI(l),i};var _t=globalThis,st=class extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ps(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Q}},Rs;st._$litElement$=!0,st.finalized=!0,(Rs=_t.litElementHydrateSupport)==null||Rs.call(_t,{LitElement:st});var Ie=_t.litElementPolyfillSupport;Ie==null||Ie({LitElement:st});var zs;((zs=_t.litElementVersions)!=null?zs:_t.litElementVersions=[]).push("4.2.2");var gt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Is=l=>(...t)=>({_$litDirective$:l,values:t}),ae=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:en}=js;var Os=l=>l.strings===void 0;var xi={},Ls=(l,t=xi)=>l._$AH=t;var Oe=Is(class extends ae{constructor(l){if(super(l),l.type!==gt.PROPERTY&&l.type!==gt.ATTRIBUTE&&l.type!==gt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Os(l))throw Error("`live` bindings can only contain a single expression")}render(l){return l}update(l,[t]){if(t===Q||t===b)return t;let e=l.element,s=l.name;if(l.type===gt.PROPERTY){if(t===e[s])return Q}else if(l.type===gt.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(s))return Q}else if(l.type===gt.ATTRIBUTE&&e.getAttribute(s)===t+"")return Q;return Ls(l),t}});function Bs(l,t,e){let s=Math.max(1,Math.round(t/e)),i=new Float32Array(Math.ceil(l.length/s)),n=1e-6;for(let o=0,r=0;o<l.length;o+=s,r++){let a=Math.min(l.length,o+s),h=0;for(let u=o;u<a;u++)h+=l[u]*l[u];let d=Math.sqrt(h/(a-o));i[r]=d,d>n&&(n=d)}for(let o=0;o<i.length;o++)i[o]=Math.min(1,i[o]/n);return i}function Us(l,t){let e=l/t,s=0,i=0;return n=>{let o=n.length,r=new Int16Array(Math.max(0,Math.ceil((o-s)/e))),a=0;for(;s<o;s+=e){let h=Math.floor(s),d=h<0?i:n[h],u=h+1<o?n[h+1]:d,p=Math.max(-1,Math.min(1,d+(u-d)*(s-h)));r[a++]=p<0?p*32768:p*32767}return s-=o,i=o?n[o-1]:i,a===r.length?r:r.subarray(0,a)}}var yi=/(^|[^\w:/@.~-])((?:~|\.{1,2})?\/[\w.@~-]+(?:\/[\w.@~-]+)*|[\w.@-]+(?:\/[\w.@-]+)+\.\w+)(:\d+)?/g;function Le(l){let t=[],e=0;for(let s of l.matchAll(yi)){let i=s[2],n=s[3]||"",o=s.index+s[1].length;for(;/[.,;]$/.test(i);)i=i.slice(0,-1);o>e&&t.push(l.slice(e,o)),t.push({path:i,line:n}),e=o+i.length+n.length}return e<l.length&&t.push(l.slice(e)),t}function Be(l){return Le(l.replace(/\[Image #\d+\]/g," ")).filter(t=>typeof t=="string").join(" ").split(/\s+/).join(" ").trim().slice(0,200)}function Ue(l,t=2,e=1,s=.06,i=1.04){for(let n=0;n<t;n++)for(let o=0;o<l.length;o++){let r=l[o];if(!(!r.held||r.pop>=0))for(let a=o+1;a<l.length;a++){let h=l[a];if(!h.held||h.pop>=0)continue;let d=h.x-r.x,u=h.y-r.y,p=Math.hypot(d,u);p<.001&&(d=.1,u=0,p=.1);let f=r.r+h.r,_=d/p,x=u/p;if(p<f){let m=(f-p)*.5*e;r.x-=_*m,r.y-=x*m,h.x+=_*m,h.y+=x*m}else if(s>0&&p>f*i&&p<f*1.5){let m=(p-f)*s;r.x+=_*m,r.y+=x*m,h.x-=_*m,h.y-=x*m}}}return l}function He(l,t,e,s){for(let i of l){if(!i.held||i.pop>=0)continue;let n=i.x-t,o=i.y-e,r=Math.hypot(n,o);r<.001&&(n=1,o=0,r=1);let a=s+i.r;if(r<a){let h=n/r,d=o/r;i.x=t+h*a,i.y=e+d*a;let u=i.vx*h+i.vy*d;u<0&&(i.vx-=u*h,i.vy-=u*d)}}return l}function De(l,t,e,s,i=1){for(let n of l){if(!n.held||n.pop>=0||!n.anchor)continue;let o=n.x-t,r=n.y-e,a=Math.hypot(o,r);a<.001&&(o=1,r=0,a=1);let h=o/a,d=r/a,u=s+n.r;n.x+=(t+h*u-n.x)*i,n.y+=(e+d*u-n.y)*i;let p=n.vx*h+n.vy*d;n.vx-=p*h,n.vy-=p*d}return l}function Hs(l,t,e){let s=Math.PI*2;if(!l.length)return{angle:0,gap:s};let i=l.map(r=>Math.atan2(r.y-e,r.x-t)).sort((r,a)=>r-a),n=-1,o=0;for(let r=0;r<i.length;r++){let a=i[r],d=(r+1<i.length?i[r+1]:i[0]+s)-a;d>n&&(n=d,o=a+d/2)}return{angle:o,gap:n}}function Ds(l,t){let{dt:e,rate:s,maxRatio:i,maxR:n,sizeBias:o=0,rand:r=Math.random}=t,a=0;for(let h=0;h<l.length;h++){let d=l[h];if(!(!d.held||d.pop>=0||d.gone))for(let u=h+1;u<l.length;u++){let p=l[u];if(!p.held||p.pop>=0||p.gone||Math.hypot(p.x-d.x,p.y-d.y)>d.r+p.r+1||(d.r>=p.r?d.r/p.r:p.r/d.r)>i)continue;let x=Math.sqrt(d.r*d.r+p.r*p.r);if(x>n)continue;let m=Math.min(d.r,p.r),I=o?Math.pow(Math.min(1,m/n),1/o):1;if(r()>s*I*e)continue;let w=d.r>=p.r?d:p,v=w===d?p:d,j=w.r*w.r,A=v.r*v.r,M=j+A;if(w.x=(w.x*j+v.x*A)/M,w.y=(w.y*j+v.y*A)/M,w.vx=(w.vx*j+v.vx*A)/M,w.vy=(w.vy*j+v.vy*A)/M,w.r=x,w.full=x,w.age=0,v.gone=!0,a++,w!==d)break}}if(a)for(let h=l.length-1;h>=0;h--)l[h].gone&&l.splice(h,1);return a}function Ne(l,t,e,s,i=2,n=1){let o=l.filter(r=>r.held&&!(r.pop>=0)&&r.anchor);if(o.length<2)return l;for(let r=0;r<i;r++)for(let a=0;a<o.length;a++)for(let h=a+1;h<o.length;h++){let d=o[a],u=o[h],p=s+d.r,f=s+u.r,_=Math.atan2(d.y-e,d.x-t),x=Math.atan2(u.y-e,u.x-t),m=x-_;for(;m>Math.PI;)m-=Math.PI*2;for(;m<-Math.PI;)m+=Math.PI*2;let I=Math.sqrt(p*p+f*f-2*p*f*Math.cos(m)),w=d.r+u.r;if(I>=w)continue;let v=(p+f)/2,j=(w-I)/v*.5*n,A=m>=0?1:-1,M=_-A*j,N=x+A*j;d.x=t+Math.cos(M)*p,d.y=e+Math.sin(M)*p,u.x=t+Math.cos(N)*f,u.y=e+Math.sin(N)*f}return l}function Ns(l,t){let{dt:e,maxR:s,rand:i=Math.random}=t,n=l.r/s;if(l.r>=s*.995||l.age>l.span*(.55+1.7*n))return!0;let o=n>.7?.5*Math.pow(n,6):0;return o>0&&i()<o*e}var Xs=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-ring-card ${Xs}`);var wi="4.11.1",ce="assist_satellite",$i=["idle","listening","processing","responding"],qe={size:240,background:"dark",particles:0,particle_size:1,follow_media_player:!0,audio_offset:0,idle_color:"#2e9df5",listening_color:"#00ff88",processing_color:"#ffaa33",responding_color:"#00e5ff",offline_color:"#4a5560",build_entity:"",build_scope:"device",build_dashboard:"",build_page:!1,build_return:"/",build_projects:[],animation:"hubbubb",assistant_name:"Assistant",panel_height:0,panel_fullscreen:!1,panel_bg:"",panel_border:"",panel_text:"",terminal_bg:"",terminal_text:"",honeycomb:!0,tap_message:"Yes?",dock:!0,calendar_path:"/calendar",intro_message:"",announce_entity:"",messages_entity:""},qs=(l,t)=>{let e=Math.round(t*Js);return e<0||e>=l.length?0:l[e]},le=16,Js=50,Vs={idle:"idle_color",listening:"listening_color",processing:"processing_color",responding:"responding_color"},Fs={idle:{swirl:.95,bright:1.75,radius:0,amp:1,turb:.4,sweep:0,speech:0},listening:{swirl:1.8,bright:1.8,radius:-.012,amp:1.15,turb:.6,sweep:.35,speech:0},processing:{swirl:.95,bright:1.5,radius:0,amp:1,turb:.3,sweep:1,speech:0},responding:{swirl:1.5,bright:1.55,radius:.006,amp:1.15,turb:1,sweep:.12,speech:1},offline:{swirl:.3,bright:.4,radius:-.012,amp:.5,turb:.15,sweep:0,speech:0}},ki=new Set(["tool","out","err","screen","cmd"]),Mi=l=>/^\$ /.test(l)?"l-cmd":/^\+/.test(l)?"l-add":/^- /.test(l)||/^--- /.test(l)?"l-del":/\b(error|errno|failed|failure|fatal|traceback|exception|refused|denied|not found|no such)\b/i.test(l)?"l-err":/\b(warn|warning|deprecat\w+|skipped)\b/i.test(l)?"l-warn":/^(Edit|Write|Read|Grep|Glob|Agent|Task|WebFetch|WebSearch|TodoWrite|Skill)\b/.test(l)?"l-tool":"",Ai=/`([^`\n]+)`|\*\*([^*\n]+)\*\*/g,Ve=(l,t,e)=>l.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),Si={1:"can't reach Home Assistant",2:"invalid authentication",3:"connection lost \u2014 reconnecting",4:"no Home Assistant host",5:"https/http mismatch"};var vn=Math.PI/180,it=(l,t,e)=>Math.min(e,Math.max(t,l)),Fe=l=>Math.round(l*100)/100,Ke=l=>{let t=l>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},Ti=l=>{let t=(1+Math.sqrt(5))/2,e=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(([a,h,d])=>{let u=Math.hypot(a,h,d);return[a/u,h/u,d/u]}),s=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=new Map,n=(a,h)=>{let d=a<h?`${a}_${h}`:`${h}_${a}`,u=i.get(d);if(u!==void 0)return u;let[p,f,_]=e[a],[x,m,I]=e[h],w=(p+x)/2,v=(f+m)/2,j=(_+I)/2,A=Math.hypot(w,v,j);return e.push([w/A,v/A,j/A]),i.set(d,e.length-1),e.length-1};for(let a=0;a<l;a++){let h=[];for(let[d,u,p]of s){let f=n(d,u),_=n(u,p),x=n(p,d);h.push([d,f,x],[u,_,f],[p,x,_],[f,_,x])}s=h}let o=new Set,r=[];for(let a of s)for(let h=0;h<3;h++){let d=a[h],u=a[(h+1)%3],p=d<u?d*1e5+u:u*1e5+d;o.has(p)||(o.add(p),r.push(d,u))}return{verts:e,edges:r}},We=Ti(3),Ei=(()=>{let l=Ke(11073),t=We.verts.length,e=[];for(let s=0;s<16;s++)e.push({v:Math.floor(l()*t),tw:.5+l()*1.6,ph:l()*6.28});return e})(),$t=96,Ws=.55,Ks=.45,he=[{r:.625,amp:.068,thick:.007,rev:-.8,share:.21,glow:.72},{r:.655,amp:.075,thick:.008,rev:-.8,share:.21,glow:.85},{r:.845,amp:.082,thick:.009,rev:1,share:.3,glow:1.2},{r:.875,amp:.09,thick:.008,rev:1,share:.28,glow:1.4}],kt=128,Ci=(()=>{let l=Ke(51729),t=[];for(let e=0;e<5;e++)t.push({a:l()*Math.PI*2,w:(.08+l()*.22)*(e%2?-1:1),sg:.2+l()*.3,h:.6+l()*.7,f:.25+l()*.6,ph:l()*Math.PI*2});return t})(),Zs=(()=>{let t=Math.sqrt(3)*5,e=(s,i)=>{let n="";for(let o=0;o<6;o++){let r=o*60*Math.PI/180;n+=`${o===0?"M":"L"}${Fe(s+5*Math.cos(r))} ${Fe(i+5*Math.sin(r))}`}return n+"Z"};return[e(0,0),e(3*5,0),e(0,t),e(3*5,t),e(1.5*5,t/2)].join("")})(),At={w:15,h:Fe(Math.sqrt(3)*5)},Qs=.62,Gs=3e3,ji=1e12,Pi=l=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${At.w}" height="${At.h}" viewBox="0 0 ${At.w} ${At.h}"><path d="${Zs}" fill="none" stroke="${l}" stroke-width="0.35"/></svg>`)+'")',Ys=l=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(l).trim());if(t){let s=t[1];s.length===3&&(s=s.split("").map(n=>n+n).join(""));let i=parseInt(s,16);return[i>>16&255,i>>8&255,i&255]}let e=/rgba?\(([^)]+)\)/i.exec(String(l));if(e){let s=e[1].split(",").map(i=>parseFloat(i));return[s[0]|0,s[1]|0,s[2]|0]}return[53,224,255]},Mt=class extends st{set hass(t){var u,p,f,_,x,m,I,w;if(this._hass=t,!this._config)return;this._linked||(this._linked=!0,this._openLinked());let e=(u=t==null?void 0:t.states)==null?void 0:u[this._config.entity],s=e?e.state:"unavailable",i=this._state;if(s!==this._state&&(this._state=s),this._config.build_entity&&this._config.build_scope==="global"){let v=((f=(p=t==null?void 0:t.states)==null?void 0:p[this._config.build_entity])==null?void 0:f.state)==="on";this._config.build_page?(this._entityOn&&!v&&this._navigate(this._config.build_return),this._entityOn=v):v!==this._build&&this._setBuild(v,!1)}this._listenForSpeech(t);let n=(_=t==null?void 0:t.states)==null?void 0:_[this._config.announce_entity],o=n?n.state==="on":null;o!==this._announce&&(this._announce=o);let r=(x=t==null?void 0:t.states)==null?void 0:x[this._config.messages_entity],a=r?r.state==="on":null;a!==this._messages&&(this._messages=a);let h=this._config.follow_media_player?this._resolveMediaPlayer(t):null,d=h?(I=(m=t==null?void 0:t.states)==null?void 0:m[h])==null?void 0:I.state:void 0;d!==this._mp&&(this._mp=d),this._audioSync(h?(w=t==null?void 0:t.states)==null?void 0:w[h]:null),this._state==="responding"&&i!=="responding"&&this._grabTtsUrl(),this._sessTimer||(this._sessTimer=setInterval(()=>this._pollSessions(),12e3),this._pollSessions())}_trackDone(t){this._unread||(this._unread=new Set(this._recall("unread",24*3600*1e3)||[]),this._wasBusy=new Map);let e=new Set;for(let i of t){e.add(i.id);let n=this._build&&this._sel===i.id;i.busy||n?this._unread.delete(i.id):this._wasBusy.get(i.id)&&this._unread.add(i.id),this._wasBusy.set(i.id,!!i.busy),i.done=this._unread.has(i.id)}for(let i of[...this._unread])e.has(i)||this._unread.delete(i);for(let i of[...this._wasBusy.keys()])e.has(i)||this._wasBusy.delete(i);let s=[...this._unread].sort().join(",");return s!==this._unreadKey&&(this._unreadKey=s,this._store("unread",[...this._unread])),t}_settle(t,e){JSON.stringify(e)!==JSON.stringify(this[t])&&(this[t]=e)}async _pollSessions(){if(!(this._build||this._onScreen===!1||!this._hass))try{let t=await this._api("agent_status");this._settle("_sessions",this._trackDone(t.sessions||[])),t.projects&&this._settle("_projects",t.projects)}catch(t){}}_resolveMediaPlayer(t){var i,n,o;if(this._config.media_player)return this._config.media_player;if(this._mpResolved!==void 0)return this._mpResolved;let e=null,s=(n=(i=t==null?void 0:t.entities)==null?void 0:i[this._config.entity])==null?void 0:n.device_id;if(s&&t.entities){for(let r in t.entities)if(r.startsWith("media_player.")&&t.entities[r].device_id===s){e=r;break}}if(!e){let a=`media_player.${this._config.entity.split(".")[1].replace(/_assist_satellite$/,"")}_media_player`;(o=t==null?void 0:t.states)!=null&&o[a]&&(e=a)}return this._mpResolved=e,e}_effectiveState(){if(this._voiceState)return this._voiceState==="responding"&&this._envEl&&!this._envEl.currentTime?"processing":this._voiceState;let t=$i.includes(this._state)?this._state:"offline",e=this._speechRaw(t);return this._speaking(e)?"responding":e||t==="responding"?"processing":t}_speechRaw(t){let e=this._mp;return e==="playing"?t!=="listening":e==="idle"||e==="paused"?!1:t==="responding"}_speaking(t){var i;let e=Math.max(0,-(Number(this._config.audio_offset)||0));if(!e)return t;let s=performance.now()/1e3;return t!==this._spkRaw&&(this._spkRaw=t,this._spkAt=s),s-((i=this._spkAt)!=null?i:-1e9)<e?!t:t}get hass(){return this._hass}get _name(){var t;return((t=this._config)==null?void 0:t.assistant_name)||"Assistant"}setConfig(t){if(!t||!t.entity)throw new Error("hubbubb-ring-card: you need to define an `entity`");if(t.entity.split(".")[0]!==ce)throw new Error(`hubbubb-ring-card: entity must be in the ${ce} domain`);this._config=L(L({},qe),t),this._particles=null,this._mpResolved=void 0,t.build_page&&this._setBuild(!0,!1),this._hass&&(this.hass=this._hass)}getCardSize(){var t,e;return Math.max(2,Math.ceil(Number((e=(t=this._config)==null?void 0:t.size)!=null?e:240)/50))}getGridOptions(){return{rows:"auto",columns:12,min_rows:2,min_columns:6}}_cardVars(t){let e=this._config,s=n=>Number(n)>0?`${Number(n)}px`:"",i={"--jr-size":`${Number(e.size)}px`,"--jr-color":t,"--jr-panel-h":e.panel_height==="fill"?"100%":s(e.panel_height),"--jr-panel-bg":e.panel_bg,"--jr-panel-border":e.panel_border,"--jr-panel-text":e.panel_text,"--jr-term-bg":e.terminal_bg,"--jr-term-text":e.terminal_text};return Object.entries(i).filter(([,n])=>n).map(([n,o])=>`${n}:${o}`).join(";")}static getConfigElement(){return document.createElement("hubbubb-ring-card-editor")}static getStubConfig(t){var r,a;let e=Object.keys((r=t==null?void 0:t.states)!=null?r:{}),s=h=>{var d;return(d=e.find(u=>u.startsWith("switch.")&&u.endsWith(h)))!=null?d:""},i=s("_build_mode"),o=i.slice(7,-11).split("_").filter(Boolean).map(h=>h[0].toUpperCase()+h.slice(1)).join(" ");return L(L(L(L({type:"custom:hubbubb-ring-card",entity:(a=e.find(h=>h.split(".")[0]===ce))!=null?a:""},o&&{assistant_name:o}),i&&{build_entity:i}),s("_agent_announcements")&&{announce_entity:s("_agent_announcements")}),s("_message_watch")&&{messages_entity:s("_message_watch")})}connectedCallback(){var t,e,s,i,n;super.connectedCallback(),this._onVisibility=()=>this._pump(),(t=document.addEventListener)==null||t.call(document,"visibilitychange",this._onVisibility),this._onHide=()=>{this._saveDraft(),this._saveQueue()},(e=window.addEventListener)==null||e.call(window,"pagehide",this._onHide),this._onFirstTap=()=>this._unlockSpeech(),(s=this.addEventListener)==null||s.call(this,"pointerdown",this._onFirstTap,{once:!0}),this._onActivity=()=>this._lastTouch=Date.now(),(i=window.addEventListener)==null||i.call(window,"pointerdown",this._onActivity,!0),(n=window.addEventListener)==null||n.call(window,"keydown",this._onActivity,!0),this._restoreQueue(),this._build&&this._setBuild(!0,!1)}disconnectedCallback(){var t,e,s,i,n,o,r;for(let a of this._speechUnsubs||[])try{a()}catch(h){}this._speechUnsubs=[],this._speechSub=!1,this._onActivity&&((t=window.removeEventListener)==null||t.call(window,"pointerdown",this._onActivity,!0),(e=window.removeEventListener)==null||e.call(window,"keydown",this._onActivity,!0),this._onActivity=null),this._onFirstTap&&((s=this.removeEventListener)==null||s.call(this,"pointerdown",this._onFirstTap),this._onFirstTap=null),super.disconnectedCallback(),this._saveDraft(),this._saveQueue(),this._lockScroll(!1),(i=document.removeEventListener)==null||i.call(document,"visibilitychange",this._onVisibility),(n=window.removeEventListener)==null||n.call(window,"pagehide",this._onHide),this._stop(),this._stopPolling(),this._stopLocalVoice(),clearInterval(this._sessTimer),this._sessTimer=null,(o=this._io)==null||o.disconnect(),(r=this._ro)==null||r.disconnect(),this._io=this._ro=null,this._canvas=null,this._ctx=null}_navigate(t){!t||location.pathname.startsWith(t.split("?")[0])||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")))}_listenForSpeech(t){if(this._speechSub||!(t!=null&&t.connection))return;this._speechSub=!0;let e=i=>i.then(n=>(this._speechUnsubs||(this._speechUnsubs=[])).push(n)).catch(()=>{for(let n of this._speechUnsubs||[])try{n()}catch(o){}this._speechUnsubs=[],this._speechSub=!1}),s=i=>{var r,a;let n=(r=i==null?void 0:i.data)==null?void 0:r.message,o=(a=i==null?void 0:i.data)==null?void 0:a.device;if(n){if(o){o===this._deviceId()&&this._speakHere(n);return}this._electAndSpeak(n)}};e(t.connection.subscribeEvents(s,"hubbubb_home_message")),e(t.connection.subscribeEvents(s,"jarvis_claude_message")),e(t.connection.subscribeEvents(i=>{let n=ht(L({},(i==null?void 0:i.data)||{}),{at:Date.now()}),o=this._claims||(this._claims=[]);for(o.push(n);o.length&&o[0].at<n.at-Gs;)o.shift()},"hubbubb_home_claim"))}_deviceId(){if(this._device)return this._device;let t=()=>Math.random().toString(36).slice(2,12);try{this._device=localStorage.getItem("jrc:device")||t(),localStorage.setItem("jrc:device",this._device)}catch(e){this._device=t()}return this._device}async _electAndSpeak(t){let e={idle:this._lastTouch?Date.now()-this._lastTouch:ji,tie:Math.random()};try{await this._hass.connection.sendMessagePromise({type:"fire_event",event_type:"hubbubb_home_claim",event_data:e})}catch(o){return this._speakHere(t)}await new Promise(o=>setTimeout(o,1200));let s=Date.now()-Gs;(this._claims||[]).filter(o=>o.at>=s).reduce((o,r)=>r.idle<o.idle||r.idle===o.idle&&r.tie<o.tie?r:o,e).tie===e.tie&&this._speakHere(t)}_unlockSpeech(){if(this._speechAudio)return;let t=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");t.play().catch(()=>{}),this._speechAudio=t}async _speakHere(t){let e=this._hass;if(!(!e||!t))try{if(!this._ttsCfg){let r=await e.callWS({type:"assist_pipeline/pipeline/list"}),a=(r==null?void 0:r.pipelines)||[],h=a.find(d=>d.id===r.preferred_pipeline)||a[0];if(!(h!=null&&h.tts_engine))return;this._ttsCfg={engine_id:h.tts_engine,language:h.tts_language,voice:h.tts_voice}}let s=this._ttsCfg,i=await e.callApi("POST","tts_get_url",L({engine_id:s.engine_id,message:t,language:s.language},s.voice?{options:{voice:s.voice}}:{})),n=(i==null?void 0:i.url)||(i==null?void 0:i.path);if(!n)return;let o=this._speechAudio||(this._speechAudio=new Audio);this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null);try{let a=await(await fetch(n)).arrayBuffer();this._speechBlob=URL.createObjectURL(new Blob([a],{type:"audio/mpeg"})),o.src=this._speechBlob}catch(r){o.src=n}o.onended=()=>{this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null)},await o.play().catch(()=>{this._toast("Tap anywhere to let it speak here.")})}catch(s){}}_toggleAnnounce(){this._toggleHelper(this._config.announce_entity,"_announce",`${this._name} finishes: spoken on the puck`,`${this._name} finishes: phone only`)}_toggleMessages(){this._toggleHelper(this._config.messages_entity,"_messages","Hubbubb messages: read out as they arrive","Hubbubb messages: quiet")}_toggleHelper(t,e,s,i){let n=this[e]===!0;this[e]=!n,this._hass.callService("homeassistant",n?"turn_off":"turn_on",{entity_id:t}),this._toast(n?i:s)}_setBuild(t,e=!0){if(e&&this._config.build_entity&&this._hass&&this._config.build_scope==="global"&&this._hass.callService("homeassistant",t?"turn_on":"turn_off",{entity_id:this._config.build_entity}),this._config.build_dashboard){let s=this._build;this._build=t,t&&(e||s===!1)&&this._navigate(this._config.build_dashboard);return}if(this._config.build_page&&!t){this._navigate(this._config.build_return);return}this._build=t,t?(this._err="",this._sideW=this._recall("sidew",365*864e5)||0,this._loadModels(),this._poll(!0),this._startPolling(),!this._vvHandler&&window.visualViewport&&(this._vvHandler=()=>this._vvSync(),window.visualViewport.addEventListener("resize",this._vvHandler),window.visualViewport.addEventListener("scroll",this._vvHandler)),this._vvSync(),this._lockScroll(!0)):(this._stopPolling(),this._lockScroll(!1),this._sel=null,this._msgs=null,this._ask=null,this._activity=null,this._screen=null,this._suggestion=null,this._suggestion=null,this._permission=null,this._confirmKill=null,this._picking=!1,this._details=!1,this._view=null,this._swipe=null,this._vvHandler&&window.visualViewport&&(window.visualViewport.removeEventListener("resize",this._vvHandler),window.visualViewport.removeEventListener("scroll",this._vvHandler),this._vvHandler=null))}_lockScroll(t){var i;if(!((i=this._config)!=null&&i.build_page))return;let e=document.documentElement,s=document.body;s&&(t?(this._prevOverflow===void 0&&(this._prevOverflow=s.style.overflow,this._prevOverscroll=e.style.overscrollBehavior,this._prevHtmlOverflow=e.style.overflow),s.style.overflow="hidden",e.style.overflow="hidden",e.style.overscrollBehavior="none"):this._prevOverflow!==void 0&&(s.style.overflow=this._prevOverflow,e.style.overflow=this._prevHtmlOverflow,e.style.overscrollBehavior=this._prevOverscroll,this._prevOverflow=this._prevOverscroll=void 0,this._prevHtmlOverflow=void 0))}_syncCorner(t){window.innerWidth!==this._vvW&&(this._vvW=window.innerWidth,this._vvMax=t),this._vvMax=Math.max(this._vvMax||0,t);let e=t>=this._vvMax-4;this.style.setProperty("--jr-botr",e?"56px":"16px")}_vvSync(){let t=window.visualViewport;if(!t)return;let e=Math.round(t.height),s=Math.round(t.offsetTop),i=e!==this._vvH;i&&(this._vvH=e,this.style.setProperty("--jr-vvh",`${e}px`),this._syncCorner(e)),(i||this._vvT==null)&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`),i&&this._settlePin());let n=this._vvPrev==null?0:Math.abs(e-this._vvPrev),o=this._vvPrev==null;if(this._vvPrev=e,!o&&n<12)return;let r=this._growCap();r!==this._lastCap&&(this._lastCap=r,this._autoGrow(this._composerEl())),this._stick&&this._toBottom()}_settlePin(){clearTimeout(this._settleA),clearTimeout(this._settleB);let t=()=>{this._unscroll();let e=window.visualViewport;if(!e)return;let s=Math.round(e.offsetTop);s!==this._vvT&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`))};requestAnimationFrame(t),this._settleA=setTimeout(t,200),this._settleB=setTimeout(t,500)}_unscroll(){if(!this._build)return;window.scrollTo(0,0),document.scrollingElement&&(document.scrollingElement.scrollTop=0);let t=this.parentNode;for(;t;)t.scrollTop>0&&(t.scrollTop=0),t=t.parentNode||t.host}_startPolling(){let t=this._sel?600:1500;this._pollTimer&&this._pollMs===t||(this._pollTimer&&clearInterval(this._pollTimer),this._pollMs=t,this._pollTimer=setInterval(()=>this._poll(),t))}_stopPolling(){this._pollTimer&&clearInterval(this._pollTimer),this._pollTimer=null,this._pollMs=null}_errText(t){return typeof t=="number"?Si[t]||`websocket error ${t}`:String((t==null?void 0:t.message)||t)}async _api(t,e={}){var o,r,a;let s=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=(o=s==null?void 0:s.response)==null?void 0:o.content;if(typeof i=="string")try{i=JSON.parse(i)}catch(h){}let n=(a=(r=s==null?void 0:s.response)==null?void 0:r.status)!=null?a:0;if(n<200||n>=300||(i==null?void 0:i.ok)===!1)throw new Error((i==null?void 0:i.detail)||(i==null?void 0:i.error)||`HTTP ${n}`);return i||{}}async _poll(t=!1){var e;if(!(!this._build||!this._hass)){if(this._polling){this._pollAgain=!0;return}this._polling=!0;try{let s=this._sel;this._tick=(this._tick||0)+1;let i=t||this._tick%5===1,[n,o]=await Promise.all([i?this._api("agent_status"):null,s?this._api("agent_transcript",{id:s,have:this._msgs==null?0:this._tbytes||0}):null]);if(n){if(this._settle("_sessions",this._trackDone(n.sessions||[])),this._settle("_projects",n.projects||[]),this._sel&&!this._sessions.some(a=>a.id===this._sel))this._sel=null,this._msgs=null,this._store("sel",null);else if(!this._sel&&!this._restored){this._restored=!0;let a=this._recall("sel",12*3600*1e3);a&&this._sessions.some(h=>h.id===a)&&this._select(a)}}let r=s&&s===this._sel?o:null;if(this._sel&&!r&&(r=await this._api("agent_transcript",{id:this._sel,have:this._msgs==null?0:this._tbytes||0})),this._sel&&r){let a=r;this._tbytes=a.bytes||0;let h=a.messages;h!=null&&!this._sameMsgs(h,this._msgs)&&(this._msgs=h),this._activity=a.activity||null,this._screen=a.screen||null,this._suggestion=a.suggestion||null,this._permission=a.permission||null;let d=a.ask?JSON.stringify(a.ask.options.map(u=>u.label)):null;if(d!==this._askSig&&(this._askSig=d,this._askSent=null),this._settle("_ask",a.ask||null),this._ask&&this._ask.multi&&(this._askSent=null),(e=this._queue)!=null&&e.length){let u=(this._msgs||[]).filter(_=>_.role==="user").map(_=>Be(_.text)),p=_=>{let x=Be(_.text);return x&&u.includes(x)},f=this._queue.length;this._queue=this._queue.filter(_=>_.state!=="sent"||!p(_)&&Date.now()-_.at<12e4),this._queue.length!==f&&this._saveQueue()}}this._err=""}catch(s){this._err=this._errText(s)}if(this._polling=!1,this._pollAgain)return this._pollAgain=!1,this._poll();this._drainQueue()}}_drainQueue(){var s;if(!this._sel||this._pending)return;let t=(this._queue||[]).filter(i=>i.id===this._sel);if(t.some(i=>i.state==="sent"))return;let e=t.find(i=>i.state==="held");e&&((s=(this._sessions||[]).find(i=>i.id===this._sel))!=null&&s.busy||this._dispatch(e))}_select(t){var e;if(this._sel&&this._sel!==t&&this._saveDraft(),this._sel=t,this._restored=!0,t&&((e=this._unread)!=null&&e.delete(t))){this._store("unread",[...this._unread]);let s=(this._sessions||[]).find(i=>i.id===t);s&&(s.done=!1)}this._store("sel",t||null),this._msgs=null,this._ask=null,this._askSent=null,this._askSig=void 0,this._activity=null,this._screen=null,this._suggestion=null,this._permission=null,this._model=null,this._startPolling(),this._confirmKill=null,this._details=!1,this._swipe=null,this._stick=!0,this._poll(!0),t&&this._api("agent_target_window",{id:t}).catch(()=>{})}_store(t,e){try{let s=`jrc:${t}`;e==null?localStorage.removeItem(s):localStorage.setItem(s,JSON.stringify({v:e,at:Date.now()}))}catch(s){}}_gripDown(t){let e=this.renderRoot.querySelector(".side");if(!e)return;t.preventDefault();let s=t.currentTarget,i=t.clientX,n=e.getBoundingClientRect().width,o=this.renderRoot.querySelector(".panel").clientWidth*.6,r=h=>{this._sideW=Math.round(Math.min(o,Math.max(140,n+h.clientX-i)))},a=()=>{s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",a),s.removeEventListener("pointercancel",a),this._store("sidew",this._sideW)};s.setPointerCapture(t.pointerId),s.addEventListener("pointermove",r),s.addEventListener("pointerup",a),s.addEventListener("pointercancel",a)}_recall(t,e){try{let s=localStorage.getItem(`jrc:${t}`);if(!s)return null;let{v:i,at:n}=JSON.parse(s);return!n||Date.now()-n>e?(localStorage.removeItem(`jrc:${t}`),null):i}catch(s){return null}}_body(t){var n;let e=`${t.role}\0${t.text}`,s=(n=this._bodyCache)==null?void 0:n.get(e);if(s)return s;let i=this._bodyParse(t);return this._bodyCache||(this._bodyCache=new Map),this._bodyCache.size>400&&this._bodyCache.delete(this._bodyCache.keys().next().value),this._bodyCache.set(e,i),i}_bodyParse(t){if(ki.has(t.role))return t.text.split(`
`).map(i=>g`<div class="${Mi(i)}">${i||" "}</div>`);if(t.role!=="assistant")return t.text;let e=[],s=0;for(let i of t.text.matchAll(Ai))i.index>s&&e.push(this._linkPaths(t.text.slice(s,i.index))),e.push(i[1]?g`<code>${this._linkPaths(i[1])}</code>`:g`<b>${i[2]}</b>`),s=i.index+i[0].length;return e.push(this._linkPaths(t.text.slice(s))),e}_linkPaths(t){return Le(t).map(e=>typeof e=="string"?e:g`<a
            class="flink"
            href="#"
            data-ai="open-file"
            @click=${s=>{s.preventDefault(),this._openFile(e.path,e.line)}}
          >${e.path}${e.line}</a>`)}async _openFile(t,e){var i;let s=e?parseInt(e.slice(1),10):0;this._view={path:t,line:s,loading:!0};try{let n=await this._api("agent_file",{id:this._sel||"",path:t});this._view=ht(L({},n),{path:n.path||t,line:s})}catch(n){this._view={path:t,line:s,error:this._errText(n)};return}await this.updateComplete,(i=this.renderRoot.querySelector(".vline.hit"))==null||i.scrollIntoView({block:"center"})}_renderViewer(){let t=this._view,e=t.path.replace(/\/$/,"").split("/").pop()||t.path;return g`
      <div class="phead">
        <span class="ptitle" title=${t.path}>${e}${t.line?`:${t.line}`:""}</span>
        <button class="hbtn" data-ai="close-file" @click=${()=>this._view=null}>✕</button>
      </div>
      <div class="vpath">${t.path}</div>
      <div class="vbody">
        ${t.loading?g`<div class="dim pad">Loading…</div>`:t.error?g`<div class="dim pad">${t.error}</div>`:t.image?g`<img class="vimg" src=${t.image} alt=${e} />`:t.dir?t.dir.map(s=>g`<a
                      class="flink vent"
                      href="#"
                      @click=${i=>{i.preventDefault(),this._openFile(`${t.path}/${s}`,"")}}
                    >${s}</a>`):g`<pre class="vtext">${(t.text||"").split(`
`).map((s,i)=>g`<div class="vline ${i+1===t.line?"hit":""}"><span class="vno">${i+1}</span>${s||" "}</div>`)}</pre>`}
        ${t.truncated?g`<div class="dim pad">Showing the first 512 KB.</div>`:b}
      </div>
    `}_sameMsgs(t,e){if(!t||!e||t.length!==e.length)return!1;let s=t[t.length-1],i=e[e.length-1];return(s==null?void 0:s.role)===(i==null?void 0:i.role)&&(s==null?void 0:s.text)===(i==null?void 0:i.text)}_toBottom(){let t=0,e=()=>{var i,n;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((n=s.lastElementChild)==null||n.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll()),++t<6&&requestAnimationFrame(e)};requestAnimationFrame(e),clearTimeout(this._bottomT),this._bottomT=setTimeout(()=>{var i,n;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((n=s.lastElementChild)==null||n.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll())},250)}_composerEl(){var t;return(t=this.renderRoot)==null?void 0:t.querySelector(".composer textarea")}_growCap(){var e;let t=this._vvH||((e=window.visualViewport)==null?void 0:e.height)||window.innerHeight;return Math.max(56,Math.min(190,Math.round(t*.32)))}_autoGrow(t){if(!t)return;let e=t.style.height,s=t.scrollTop;t.style.height="auto";let i=Math.min(t.scrollHeight,this._growCap())+"px";return t.style.height=i,t.scrollTop!==s&&(t.scrollTop=s),i!==e}_draftSoon(){clearTimeout(this._draftT),this._draftT=setTimeout(()=>this._saveDraft(),400)}_saveDraft(t=this._sel){var s;if(clearTimeout(this._draftT),!t)return;let e=this._composerEl();e&&this._store(`draft:${t}`,e.value||null),this._store(`files:${t}`,(s=this._files)!=null&&s.length?this._files:null)}_restoreDraft(){if(!this._sel)return;this._files=this._recall(`files:${this._sel}`,12*3600*1e3)||[];let t=this._composerEl();if(!t||t.value)return;let e=this._recall(`draft:${this._sel}`,12*3600*1e3);e&&(t.value=e,this._autoGrow(t))}_saveQueue(){let t=(this._queue||[]).filter(e=>e.state==="held");this._store("queue",t.length?t:null)}_restoreQueue(){let t=this._recall("queue",216e5);Array.isArray(t)&&t.length&&(this._queue=t.map(e=>ht(L({},e),{state:"held"})))}async _send(t){var r;t.preventDefault();let e=this._composerEl(),s=e==null?void 0:e.value.trim(),i=this._files||[];if(!s&&!i.length||this._sel==null)return;let n=[...i.map(a=>a.path),s].filter(Boolean).join(" ");e.value="",e.style.height="",this._files=[],this._saveDraft();let o={id:this._sel,text:n,at:Date.now(),state:"held"};this._queue=[...this._queue||[],o],this._saveQueue(),this._stick=!0,(r=(this._sessions||[]).find(a=>a.id===this._sel))!=null&&r.busy||this._dispatch(o)}async _dispatch(t){if(!this._pending){this._pending=!0,t.state="sent",t.at=Date.now(),this._queue=[...this._queue],this._saveQueue();try{await this._api("agent_prompt_direct",{id:t.id,text:t.text,device:this._deviceId()}),t.delivered=!0,this._queue=[...this._queue],this._err=""}catch(e){this._err=this._errText(e),t.state="held",this._queue=[...this._queue],this._saveQueue()}this._pending=!1,this._poll(!0)}}_editQueued(t){let e=this._composerEl();e&&(e.value=e.value.trim()?`${e.value.trim()} ${t.text}`:t.text,this._dropQueued(t),e.focus(),this._autoGrow(e),this._saveDraft())}_dropQueued(t){this._queue=(this._queue||[]).filter(e=>e!==t),this._saveQueue()}async _attach(t){let e=[...t.target.files||[]];return t.target.value="",this._ingest(e)}async _ingest(t){if(!(!t.length||!this._sel)){this._uploading=!0;for(let e of t)try{let{name:s,data:i}=await this._encodeFile(e),n=await this._api("agent_upload",{name:s,data:i});if(!(n!=null&&n.path))throw new Error((n==null?void 0:n.detail)||"upload refused");this._files=[...this._files||[],{name:e.name,path:n.path}],this._err=""}catch(s){this._err=`${e.name}: ${this._errText(s)}`}this._uploading=!1,this._saveDraft()}}_encodeFile(t){let e=i=>new Promise((n,o)=>{let r=new FileReader;r.onerror=()=>o(new Error("could not read that file")),r.onload=()=>n(String(r.result).split(",")[1]||""),r.readAsDataURL(i)});if(!t.type.startsWith("image/"))return e(t).then(i=>({name:t.name,data:i}));let s=1568;return new Promise((i,n)=>{let o=new Image,r=URL.createObjectURL(t);o.onerror=()=>{URL.revokeObjectURL(r),e(t).then(a=>i({name:t.name,data:a}),n)},o.onload=()=>{URL.revokeObjectURL(r);let a=Math.min(1,s/Math.max(o.width,o.height));if(a===1&&t.size<9e5)return e(t).then(d=>i({name:t.name,data:d}),n);let h=document.createElement("canvas");h.width=Math.round(o.width*a),h.height=Math.round(o.height*a),h.getContext("2d").drawImage(o,0,0,h.width,h.height),h.toBlob(d=>{if(!d)return n(new Error("could not encode that image"));let u=t.name.replace(/\.[^.]+$/,"")+".jpg";e(d).then(p=>i({name:u,data:p}),n)},"image/jpeg",.85)},o.src=r})}_dropFile(t){this._files=(this._files||[]).filter(e=>e!==t),this._saveDraft()}_renderAsk(t){let e=!!t.multi,s=!e&&!!this._askSent;return g`<div class="askbox ${s?"answered":""}">
      ${t.header||t.total>1||e?g`<div class="askhead">
            ${t.header?g`<span class="askchip">${t.header}</span>`:b}
            ${t.total>1?g`<span class="askstep">Question ${t.index} of ${t.total}</span>`:b}
            ${e?g`<span class="askmulti">Pick any</span>`:b}
          </div>`:b}
      ${t.text?g`<div class="asktext">${t.text}</div>`:b}
      <div class="askopts">
        ${t.options.map(i=>g`<button
            class="askopt ${this._askSent===i.key?"picked":""} ${i.on?"on":""}"
            data-ai="pick-option"
            ?disabled=${s}
            @click=${()=>this._sendKey(i.key,{keepOpen:e})}
          >
            <span class="asknum">${e?i.on?"\u2611":"\u2610":i.key}</span>
            <span class="asklabel"
              >${i.label}
              ${i.desc?g`<span class="askdesc">${i.desc}</span>`:b}</span
            >
            ${!e&&this._askSent===i.key?g`<span class="asktick">✓</span>`:b}
          </button>`)}
      </div>
      <div class="askrow">
        ${s?g`<span class="dim">sending…</span>`:b}
        ${e?g`<button class="asksubmit" data-ai="submit-answer"
                   @click=${()=>this._sendKey("Enter")}>Submit</button>`:b}
        <button class="askmini" @click=${()=>this._sendKey("Escape")}>esc</button>
      </div>
    </div>`}async _sendKey(t,{keepOpen:e=!1}={}){if(this._sel){e||(this._askSent=t);try{await this._api("agent_key",{id:this._sel,key:t}),this._err=""}catch(s){this._err=this._errText(s),this._askSent=null;return}this._poll()}}async _setModel(t){if(!this._sel||this._modelBusy||!t)return;let e=this._model;this._model=t,this._modelBusy=t;try{await this._api("agent_model",{id:this._sel,model:t}),this._err=""}catch(s){this._model=e,this._err=this._errText(s)}this._modelBusy=null,this._poll()}async _setPermission(t){if(!(!this._sel||this._modelBusy||!t)){this._modelBusy="perm";try{let e=await this._api("agent_permission",{id:this._sel,mode:t}),s=e&&(e.mode||e.detail);s&&(this._permission=s),this._err=""}catch(e){this._err=this._errText(e)}this._modelBusy=null,this._poll()}}_renderRunControls(){let t=this._models||[],e=(this._sessions||[]).find(o=>o.id===this._sel),s=this._permission||"",i=(e==null?void 0:e.modes)||this._modes||["auto","manual","accept edits","plan"],n=this._model||(e==null?void 0:e.model)||"";return g`<div class="runbar">
      <select
        class="runsel ${this._modelBusy&&this._modelBusy!=="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy||!t.length}
        data-ai="pick-model"
        title="Model for this session"
        .value=${Oe(n)}
        @change=${o=>this._setModel(o.target.value)}
      >
        <option value="" disabled>${t.length?"Model":"\u2026"}</option>
        ${t.map(o=>g`<option value=${o.id}>${o.id==="local"?"Local":o.name}</option>`)}
      </select>
      <select
        class="runsel perm mode-${(s||"unknown").replace(/\s+/g,"-")} ${this._modelBusy==="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy}
        data-ai="pick-permission"
        title="Permission mode"
        .value=${Oe(s)}
        @change=${o=>this._setPermission(o.target.value)}
      >
        <option value="" disabled>mode ?</option>
        ${i.map(o=>g`<option value=${o}>${o}</option>`)}
      </select>
      ${e!=null&&e.busy?g`<button
            type="button"
            class="hbtn stop"
            data-ai="interrupt-turn"
            title="Interrupt this turn (sends Escape)"
            @click=${()=>this._sendKey("Escape",{keepOpen:!0})}
          >Stop</button>`:b}
    </div>`}async _loadModels(){if(!this._models)try{let t=await this._api("agent_models");this._models=t.models||[],this._modes=t.modes||null}catch(t){}}async _killSession(t){if(t){if(this._confirmKill!==t){this._confirmKill=t,clearTimeout(this._confirmT),this._confirmT=setTimeout(()=>this._confirmKill=null,4e3);return}clearTimeout(this._confirmT),this._confirmKill=null;try{await this._api("agent_kill",{id:t}),this._swipe=null,this._store(`draft:${t}`,null),this._queue=(this._queue||[]).filter(e=>e.id!==t),this._saveQueue(),this._sel===t&&(this._sel=null,this._msgs=null,this._store("sel",null)),this._poll(!0)}catch(e){this._err=this._errText(e)}}}_rowTap(t){if(this._swipe===t){this._swipe=null,this._confirmKill=null;return}if(this._swipe){this._swipe=null,this._confirmKill=null;return}this._swiped||this._select(t)}_swipeStart(t,e){var i;let s=(i=t.touches)==null?void 0:i[0];s&&(this._sx=s.clientX,this._sy=s.clientY,this._swiped=!1)}_swipeMove(t,e){var o;let s=(o=t.touches)==null?void 0:o[0];if(!s||this._sx==null)return;let i=s.clientX-this._sx,n=s.clientY-this._sy;Math.abs(n)>Math.abs(i)||(i<-12?(this._swiped=!0,this._swipe!==e&&(this._swipe=e)):i>12&&this._swipe===e&&(this._swiped=!0,this._swipe=null,this._confirmKill=null))}_swipeEnd(){this._sx=this._sy=null,setTimeout(()=>this._swiped=!1,50)}async _newSession(t){this._picking=!1,this._pending=!0;try{let e=await this._api("agent_start_session",{project:t});this._err="",await this._awaitSession(e==null?void 0:e.id)}catch(e){this._err=this._errText(e)}this._pending=!1}async _awaitSession(t){for(let e=0;e<20;e++){await this._poll(!0);let s=(this._sessions||[]).find(i=>t?i.id===t:i.target);if(s)return this._select(s.id),!0;await new Promise(i=>setTimeout(i,600))}return!1}_syncUrl(){var s,i;if((s=this._config)!=null&&s.build_dashboard||(i=this._config)!=null&&i.build_page)return;let t=location.pathname.replace(/\/session\/[^/]+$/,""),e=this._build&&this._sel?`${t}/session/${encodeURIComponent(this._sel)}`:t;e!==location.pathname&&history.replaceState(history.state,"",e+location.search)}_openLinked(){let t=location.pathname.match(/\/session\/([^/]+)$/);t&&(this._restored=!0,this._build||this._setBuild(!0,!1),this._awaitSession(decodeURIComponent(t[1])))}_openAssist(){var e,s,i;let t=(s=(e=this._hass)==null?void 0:e.auth)==null?void 0:s.external;if((i=t==null?void 0:t.config)!=null&&i.hasAssist){t.fireMessage({type:"assist/show"});return}Ve(this,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>customElements.whenDefined("ha-voice-command-dialog"),dialogParams:{pipeline_id:"last_used",start_listening:!0}})}_wakePuck(){var e;let t;try{t=(e=this._hass)==null?void 0:e.callService("assist_satellite","start_conversation",{entity_id:this._config.entity,start_message:this._config.tap_message,preannounce:!1},void 0,!1)}catch(s){return this._openAssist()}Promise.resolve(t).catch(()=>this._openAssist())}async _openMic(){try{let e=(await navigator.mediaDevices.enumerateDevices()).find(s=>s.kind==="audioinput"&&s.label&&!/iphone|ipad|continuity/i.test(s.label));if(e)return await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:e.deviceId}}})}catch(t){}return navigator.mediaDevices.getUserMedia({audio:!0})}async _startLocalVoice(t="converse"){if(this._voice||this._micOpening)return!0;this._micOpening=!0,t==="converse"?this._voiceState="listening":this._dictating=!0;let e;try{e=await this._openMic()}catch(p){return this._voiceState=null,this._dictating=!1,"microphone permission denied"}finally{this._micOpening=!1}let s=e.getAudioTracks()[0];s&&(s.onended=()=>{var p;((p=this._voice)==null?void 0:p.stream)===e&&(this._toast("The microphone disconnected."),this._stopLocalVoice())});let i=window.AudioContext||window.webkitAudioContext,n=new i,o=null;t==="converse"&&(o=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="),o.play().catch(()=>{}));let r=this._voice={mode:t,stream:e,ctx:n,audio:o,proc:null,src:null,handlerId:null,unsub:null},a=this._recall("conv",5*60*1e3);try{r.unsub=await this._hass.connection.subscribeMessage(p=>this._voiceEvent(p),L({type:"assist_pipeline/run",start_stage:"stt",end_stage:t==="dictate"?"stt":"tts",input:{sample_rate:16e3}},a?{conversation_id:a}:{}))}catch(p){return this._stopLocalVoice(),"assist pipeline refused the run"}let h=r.src=n.createMediaStreamSource(e),d=r.proc=n.createScriptProcessor(2048,1,1),u=Us(n.sampleRate,16e3);return d.onaudioprocess=p=>{if(r.handlerId==null)return;let f=u(p.inputBuffer.getChannelData(0)),_=new Uint8Array(1+f.length*2);_[0]=r.handlerId;let x=new DataView(_.buffer,1);for(let m=0;m<f.length;m++)x.setInt16(m*2,f[m],!0);try{this._hass.connection.socket.send(_)}catch(m){}},h.connect(d),d.connect(n.destination),!0}_voiceEvent(t){var s,i,n,o,r,a,h,d,u,p;let e=this._voice;if(e)switch(t.type){case"run-start":e.handlerId=(n=(i=(s=t.data)==null?void 0:s.runner_data)==null?void 0:i.stt_binary_handler_id)!=null?n:null;break;case"intent-end":{let f=(r=(o=t.data)==null?void 0:o.intent_output)==null?void 0:r.conversation_id;f&&this._store("conv",f);break}case"stt-end":if(e.mode==="dictate"){let f=((h=(a=t.data)==null?void 0:a.stt_output)==null?void 0:h.text)||"",_=(d=this.renderRoot)==null?void 0:d.querySelector(".composer textarea");_&&f&&(_.value=(_.value?_.value.trim()+" ":"")+f,_.focus()),f||this._toast("Didn't catch that."),this._stopLocalVoice()}else this._closeMic(),this._voiceState="processing";break;case"tts-end":{let f=(p=(u=t.data)==null?void 0:u.tts_output)==null?void 0:p.url;if(!f)return this._stopLocalVoice();this._voiceState="responding",e.audio.onended=()=>this._stopLocalVoice(),e.audio.onerror=()=>this._stopLocalVoice(),this._envEl=e.audio,this._envUrl=f,this._env=null,this._decodeAudio(f),e.audio.src=f,e.audio.play().catch(()=>this._stopLocalVoice());break}case"error":e.mode==="dictate"&&this._toast("Didn't catch that."),this._stopLocalVoice();break;case"run-end":this._voiceState!=="responding"&&this._stopLocalVoice();break}}_closeMic(){var e,s,i,n;let t=this._voice;t&&((e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),(i=t.stream)==null||i.getTracks().forEach(o=>o.stop()),(n=t.ctx)==null||n.close().catch(()=>{}),t.proc=t.src=null)}_stopLocalVoice(){var e,s;let t=this._voice;if(t){this._closeMic(),this._dictating=!1;try{(e=t.audio)==null||e.pause()}catch(i){}try{(s=t.unsub)==null||s.call(t)}catch(i){}this._voice=null,this._voiceState=null,this._envEl=null,this._env=null,this._envUrl=null}}_toast(t){Ve(this,"hass-notification",{message:t})}get _canMic(){var t;return!!(window.isSecureContext&&((t=navigator.mediaDevices)!=null&&t.getUserMedia))}async _composerMic(){var e;if(this._voice)return this._voice.mode==="dictate"?this._endSpeech():this._stopLocalVoice();if(!window.isSecureContext||!((e=navigator.mediaDevices)!=null&&e.getUserMedia)){this._toast("Voice input needs the https (Nabu Casa) URL.");return}let t=await this._startLocalVoice("dictate");t!==!0&&this._toast(`Couldn't start voice input (${t}).`)}_endSpeech(){var e,s;let t=this._voice;if(!t||t.handlerId==null)return this._stopLocalVoice();(e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),t.mode==="converse"&&(this._voiceState="processing");try{this._hass.connection.socket.send(new Uint8Array([t.handlerId]))}catch(i){this._stopLocalVoice()}}async _ringTap(){var e;if(this._voice)return this._voiceState==="listening"?this._endSpeech():this._stopLocalVoice();if(this._effectiveState()==="responding"){let s=this._resolveMediaPlayer(this._hass);if(s){this._hass.callService("media_player","media_stop",{entity_id:s});return}}if(!window.isSecureContext){this._wakePuck();return}if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia)){this._toast(`This browser exposes no microphone \u2014 waking ${this._name} instead.`),this._wakePuck();return}let t=await this._startLocalVoice();t!==!0&&(this._toast(`Couldn't use this device's mic (${t}) \u2014 waking ${this._name} instead.`),this._wakePuck())}firstUpdated(){this._setupCanvas()}updated(t){this._setupCanvas(),(t.has("_sel")||t.has("_build"))&&this._syncUrl(),t.has("_sel")&&this._sel&&this._restoreDraft(),t.has("_msgs")&&this._stick&&this._toBottom()}_setupCanvas(){var e,s,i;let t=(e=this.renderRoot)==null?void 0:e.querySelector("canvas");if(!t){this._stop(),this._canvas=null;return}if(t!==this._canvas){this._canvas=t;try{this._ctx=t.getContext("2d")}catch(n){this._ctx=null}if(!this._ctx)return;this._t=0,this._waveT=0,this._churnT=0,this._peaks=Ci.map(n=>L({},n)),this._spin=0,this._head=0,this._speech={t:0,next:0,env:0,count:0,syl:null,pulses:[],spikes:[]},this._cur=L({},Fs.idle),this._rgb=Ys((i=(s=this._config)==null?void 0:s.idle_color)!=null?i:"#3db4c8"),this._observe()}this._ctx&&(this._measure(),this._pump())}_observe(){var t,e;typeof ResizeObserver!="undefined"&&((t=this._ro)==null||t.disconnect(),this._ro=new ResizeObserver(()=>this._measure()),this._ro.observe(this._canvas)),typeof IntersectionObserver!="undefined"?((e=this._io)==null||e.disconnect(),this._io=new IntersectionObserver(s=>{this._onScreen=s.some(i=>i.isIntersecting),this._pump()}),this._io.observe(this._canvas)):this._onScreen=!0}_measure(){var r,a,h;let t=this._canvas;if(!t||!this._ctx)return;let e=t.clientWidth||Number((r=this._config)==null?void 0:r.size)||240,s=t.clientHeight||e;((h=(a=this._perf)==null?void 0:a.q)!=null?h:1)<.75&&(this._lowDpr=!0);let i=this._lowDpr?1:2,n=it(window.devicePixelRatio||1,1,i);if(this._w===e&&this._h===s&&this._dpr===n&&this._particles)return;let o=!this._particles||this._w!==e;this._w=e,this._h=s,this._dpr=n,t.width=Math.round(e*n),t.height=Math.round(s*n),this._ctx.setTransform(n,0,0,n,0,0),o&&this._buildField()}_buildField(){var r;let t=Number((r=this._config)==null?void 0:r.particles)||0,e=it(Math.round((this._w||240)*32),9e3,2e4),s=t>0?it(t,0,8e3):e,i=Math.max(400,s),n=Ke(24301),o=new Array(i);for(let a=0;a<i;a++){let h=a*.6180339887%1,d=0;for(let f=he[0].share;d<he.length-1&&h>=f;)f+=he[++d].share;let u=(n()+n()-1)*(n()<.04?4:1),p=(n()+n()-1)*1.05;o[a]={ri:d,lon:n()*Math.PI*2,sinLat:Math.sin(p),cosLat:Math.cos(p),off:u,drift:(n()-.5)*.13,tw:.5+n()*2,ph:n()*Math.PI*2,bobA:.1+n()*.25,bobW:.25+n()*.85,bobP:n()*Math.PI*2,wobA:.006+n()*.02,wobW:.4+n()*1.2,wobP:n()*Math.PI*2,lf:5+n()*7,lt:n()*12,sz:n()<.03?2.1+n()*1.1:.8+n()*.85,halo:n()<.05,br:n()<.04?1:.45+n()*.55}}this._particles=o}_audioSync(t){if(!t||t.state!=="playing"){this._env=null,this._envUrl=null;return}let e=t.attributes||{},s=String(e.media_content_id||""),i=/^https?:\/\//.test(s)||s.startsWith("/")?s:null,n=Date.parse(e.media_position_updated_at||t.last_changed||"");this._envAt=Number.isFinite(n)?n:Date.now(),this._envPos=Number(e.media_position)||0,!(!i||i===this._envUrl)&&(this._envUrl=i,this._env=null,i&&!(Number(e.media_duration)>60)&&this._decodeAudio(i))}async _pipelineId(t){var h,d,u,p,f;if(this._pipeId!==void 0)return this._pipeId;this._pipeId=null;let e=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline/list"}),s=await t.connection.sendMessagePromise({type:"assist_pipeline/device/list"}),i=(d=(h=t.entities)==null?void 0:h[this._config.entity])==null?void 0:d.device_id,n=(u=s==null?void 0:s.find(_=>_.device_id===i))==null?void 0:u.pipeline_entity,o=n?(f=(p=t.states)==null?void 0:p[n])==null?void 0:f.state:null,r=(e==null?void 0:e.pipelines)||[],a=r.find(_=>_.name===o)||r.find(_=>_.id===(e==null?void 0:e.preferred_pipeline));return this._pipeId=(a==null?void 0:a.id)||null,this._pipeId}async _grabTtsUrl(){var e,s,i,n;let t=this._hass;if(!(!(t!=null&&t.connection)||this._grabbing)){this._grabbing=!0;try{let o=await this._pipelineId(t);if(!o)return;for(let r=0;r<3;r++){let a=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/list",pipeline_id:o}),h=((a==null?void 0:a.pipeline_runs)||[]).reduce((d,u)=>!d||u.timestamp>d.timestamp?u:d,null);if(h&&Date.now()-Date.parse(h.timestamp)<6e4){let d=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/get",pipeline_id:o,pipeline_run_id:h.pipeline_run_id}),u=(d==null?void 0:d.events)||[];for(let p=u.length-1;p>=0;p--){let f=((e=u[p])==null?void 0:e.type)==="tts-end"&&((n=(i=(s=u[p])==null?void 0:s.data)==null?void 0:i.tts_output)==null?void 0:n.url);if(f){this._envUrl=f,this._env=null,await this._decodeAudio(f);return}}}await new Promise(d=>setTimeout(d,250))}}catch(o){this._pipeId=void 0}finally{this._grabbing=!1}}}async _decodeAudio(t){try{let e=await(await fetch(t)).arrayBuffer(),s=window.AudioContext||window.webkitAudioContext;if(!s)return;let n=await(this._actx||(this._actx=new s)).decodeAudioData(e);if(t!==this._envUrl)return;this._env=Bs(n.getChannelData(0),n.sampleRate,Js)}catch(e){this._env=null}}_audioLevel(){let t=this._env,e=this._envEl;if(e)return e.currentTime?t?qs(t,e.currentTime):null:0;if(!t||this._mp!=="playing")return null;let s=this._envPos+(Date.now()-this._envAt)/1e3+(Number(this._config.audio_offset)||0);return qs(t,s)}_sylShapes(t,e){let s=this._speech;s.pulses.push({born:s.t,amp:t}),s.pulses.length>6&&s.pulses.shift();let i=Math.random()*6.283185;s.spikes.push({a:i,sg:.1+Math.random()*.08,h:.06+t*.06,born:s.t,dur:.12+Math.random()*.08},{a:i+(Math.random()-.5)*.6,sg:.22+Math.random()*.18,h:.04+t*.05,born:s.t+.04,dur:e*(.9+Math.random()*.4)}),s.spikes.length>14&&s.spikes.splice(0,s.spikes.length-14)}_speechTick(t){let e=this._speech;e.t+=t;let s=this._audioLevel();if(s!=null){s>.2&&s>(e.last||0)*1.4&&(e.count++,e.syl={start:e.t,dur:.22,peak:s,f:5+s*4},this._sylShapes(s,.22)),e.last=s,e.live=!0;let r=s>e.env?.05:.14;e.env+=(s-e.env)*(1-Math.exp(-t/r)),e.env>1&&(e.env=1);return}if(e.live=!1,e.t>=e.next){let r=.22+Math.random()*.26,a=.5+Math.random()*.5;e.syl={start:e.t,dur:r,peak:a,f:5+Math.random()*4},e.count++;let h=.02+Math.random()*.05;e.count%(5+Math.floor(Math.random()*6))===0&&(h+=.14+Math.random()*.26),e.next=e.t+r+h,this._sylShapes(a,r)}let i=0,n=e.syl;if(n){let r=(e.t-n.start)/n.dur;r>=0&&r<=1&&(i=n.peak*1.2*(.5-.5*Math.cos(2*Math.PI*r)))}let o=i>e.env?.22:.5;e.env+=(i-e.env)*(1-Math.exp(-t/o)),e.env>1&&(e.env=1)}_pulseTable(t){let e=this._ptab||(this._ptab=new Float32Array($t));if(e.fill(0),t<.01)return e;let s=this._speech;for(let i of s.pulses){let n=s.t-i.born;if(n>2.4)continue;let o=.58+n*.26,r=i.amp*Math.exp(-n/1)*t;for(let a=0;a<$t;a++){let h=Ws+a/($t-1)*Ks-o;e[a]+=r*Math.exp(-(h*h)/.0055)}}return e}_peakTable(t,e,s){let i=this._ktab||(this._ktab=new Float32Array(kt));i.fill(0);let n=this._t,o=.05*e.amp+.08*s;for(let a of this._peaks){a.a+=t*a.w*(.6+e.swirl);let h=.35+.65*(.5+.5*Math.sin(n*a.f+a.ph)),d=a.h*h*o;if(d<.002)continue;let u=a.sg*(1-.4*s),p=2*u*u;for(let f=0;f<kt;f++){let _=f/kt*6.283185-a.a;_=(_%6.283185+6.283185)%6.283185,_>3.141593&&(_-=6.283185),i[f]+=d*Math.exp(-(_*_)/p)}}let r=this._speech;for(let a=r.spikes.length-1;a>=0;a--){let h=r.spikes[a],d=r.t-h.born;if(d>h.dur+.3){r.spikes.splice(a,1);continue}if(d<0)continue;let u=d<.12?d/.12:1,p=d>h.dur?Math.exp(-(d-h.dur)/.3):1,f=h.h*u*p*e.speech;if(f<.003)continue;let _=2*h.sg*h.sg;for(let x=0;x<kt;x++){let m=x/kt*6.283185-h.a;m=(m%6.283185+6.283185)%6.283185,m>3.141593&&(m-=6.283185),i[x]+=f*Math.exp(-(m*m)/_)}}return i}_sprite(t,e,s){let i=t<<16|e<<8|s;if(this._sprKey===i)return this._spr;let n=this._spr||(this._spr=document.createElement("canvas"));n.width=n.height=32;let o=n.getContext("2d");o.clearRect(0,0,32,32);let r=o.createRadialGradient(16,16,0,16,16,16);return r.addColorStop(0,`rgba(${t},${e},${s},0.75)`),r.addColorStop(.4,`rgba(${t},${e},${s},0.3)`),r.addColorStop(1,`rgba(${t},${e},${s},0)`),o.fillStyle=r,o.fillRect(0,0,32,32),this._sprKey=i,n}_segTick(t){var n;if(this._segRot===void 0&&(this._segRot=-Math.PI/2),this._segRot+=t*.019,this._segWave=(this._segWave||0)+t*.5,this._sessions==null)return this._ambientTick(t);let e=this._segMap||(this._segMap=new Map),s=1-Math.exp(-t/.7),i=new Set;for(let o of this._sessions){i.add(o.id);let r=e.get(o.id);r||(r={size:.02,fill:Math.random(),pulse:Math.random()*6.28,rgb:[46,157,245],gone:!1},e.set(o.id,r));let a=o.context_max?it(o.context/o.context_max,0,1):null;r.weight=a!=null?.6+a*3:Math.max(.8,Math.log10((o.bytes||0)+1e4)-3.2),r.fracT=a!=null?a:1,r.frac===void 0&&(r.frac=0),r.busy=!!o.busy,r.done=!!o.done,r.gone=!1}for(let[o,r]of e){if(i.has(o)||(r.gone=!0),r.size+=((r.gone?0:r.weight)-r.size)*s,r.frac+=((r.gone?0:(n=r.fracT)!=null?n:1)-r.frac)*s,r.gone&&r.size<.03){e.delete(o);continue}r.pulse+=t*(r.busy?2.4:.9),r.busy&&(r.fill=(r.fill+t*.3)%1);let a=r.done?[40,226,138]:[46,157,245];for(let h=0;h<3;h++)r.rgb[h]+=(a[h]-r.rgb[h])*s}}_segBand(t){let e=Math.abs(-Math.sin(t)-Math.sin(this._segWave||0));return e>1?0:.5+.5*Math.cos(e*Math.PI)}_wash(t,e,s,i,n,o,r,a){let h=Math.max(2,Math.min(12,Math.ceil((r-o)/.1))),d=(r-o)/h;for(let u=0;u<h;u++){let p=o+u*d,f=Math.min(r,p+d);t.globalAlpha=a*(.5+1.15*this._segBand(p+d/2)),t.beginPath(),t.arc(e,s,n,p,f),t.arc(e,s,i,f,p,!0),t.closePath(),t.fill()}}_drawSegs(t,e,s,i,n,o,r){var x;if(this._sessions==null)return this._drawAmbientSegs(t,e,s,i,n,o,r);let a=6.283185,h=i*.475,d=i*.655,u=(m,I,w,v)=>{t.beginPath(),t.arc(e,s,v,m,I),t.arc(e,s,w,I,m,!0),t.closePath()},p=this._segMap,f=0;if(p)for(let m of p.values())f+=m.size;if(!p||!p.size||f<=0){t.fillStyle=`rgb(${n},${o},${r})`,t.globalAlpha=.05,u(0,a,h,d),t.fill(),t.globalAlpha=1;return}let _=this._segRot;for(let m of p.values()){let I=m.size/f*a,w=Math.min(.035,I),v=_+w/2,j=_+I-w/2;_+=I;let A=j-v;if(A<.004)continue;t.fillStyle=`rgb(${Math.round(m.rgb[0])},${Math.round(m.rgb[1])},${Math.round(m.rgb[2])})`,t.globalAlpha=.035,u(v,j,h,d),t.fill();let M=h+(d-h)*(.18+.82*it((x=m.frac)!=null?x:1,0,1));if(this._wash(t,e,s,h,M,v,j,(m.busy?.22:.1)+(m.done?.07:0)),m.busy){let N=Math.max(.1,A*.35),P=v+m.fill*A,V=14;for(let T=0;T<V;T++){let F=P-T*N/V,W=Math.max(v,F-N/V);if(F<=v)break;t.globalAlpha=.3*Math.pow(1-T/V,1.6),u(W,F,h,M),t.fill()}}}t.globalAlpha=1}_ambientTick(t){let e=this._segs;if(!e){e=this._segs=[],this._segRot=-Math.PI/2;for(let n=0;n<22;n++){let o=Math.random()<.75;e.push({size:.5+Math.random()*1.4,fill:o?1:Math.random()*.7,rate:.12+Math.random()*.3,state:o?"done":"load",doneT:Math.random()*9})}}let s=0,i=0;for(let n of e)n.state==="grow"?s++:n.state==="die"&&i++;if(!s&&e.length<26&&Math.random()<t*.5&&e.splice(Math.floor(Math.random()*(e.length+1)),0,{size:.02,target:.5+Math.random()*1.4,fill:0,rate:.12+Math.random()*.3,state:"grow",doneT:0}),i<2&&e.length>16){let n=null;for(let o of e)o.state==="done"&&o.doneT>8&&(!n||o.doneT>n.doneT)&&(n=o);n&&Math.random()<t*.25&&(n.state="die")}for(let n=e.length-1;n>=0;n--){let o=e[n];o.state==="grow"?(o.size+=t*.5,o.size>=o.target&&(o.size=o.target,o.state="load")):o.state==="load"?(o.fill+=t*o.rate,o.fill>=1&&(o.fill=1,o.state="done",o.doneT=0)):o.state==="done"?o.doneT+=t:(o.size-=t*.12,o.fill=Math.max(0,o.fill-t*.25),o.size<=.02&&e.splice(n,1))}}_drawAmbientSegs(t,e,s,i,n,o,r){let a=this._segs;if(!a||!a.length)return;let h=0;for(let w of a)h+=w.size;if(h<=0)return;let d=i*.475,u=i*.655,p=n*.5+74|0,f=o*.72+48|0,_=r*.8+82|0;t.fillStyle=`rgb(${p},${f},${_})`;let x=(w,v,j,A)=>{t.beginPath(),t.arc(e,s,A,w,v),t.arc(e,s,j,v,w,!0),t.closePath()},m=6.283185,I=this._segRot;for(let w=0;w<a.length;w++){let v=a[w],j=v.size/h*m,A=Math.min(.028,j),M=I+A/2,N=I+j-A/2;I+=j;let P=N-M;if(!(P<.004)&&(this._wash(t,e,s,d,u,M,N,.13),v.fill>.01)){let V=v.state==="done"?.14+.2*Math.exp(-v.doneT/2.2):.34;this._wash(t,e,s,d,u,M,M+P*v.fill,V*.8)}}t.globalAlpha=1}_pump(){this._ctx&&this.isConnected&&this._onScreen!==!1&&!document.hidden?this._start():this._stop()}_start(){if(this._raf)return;this._last=performance.now();let t=e=>{this._raf=requestAnimationFrame(t);let s=e-this._last,i=Math.min(.05,s/1e3);this._last=e,this._perfTick(s),this._draw(i)};this._raf=requestAnimationFrame(t)}_perfTick(t){if(t<=0||t>250)return;let e=this._perf||(this._perf={q:1,acc:0,n:0,hold:40});if(e.hold>0){e.hold--;return}if(e.acc+=t,++e.n<45)return;let s=e.acc/e.n;e.acc=0,e.n=0,s>26&&e.q>.2?this._setQuality(Math.max(.2,e.q*.65)):s<14&&e.q<1&&this._setQuality(Math.min(1,e.q*1.2))}_setQuality(t){let e=this._perf;t!==e.q&&(e.q=t,e.hold=40,this._measure())}_stop(){this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_targets(){let t=this._effectiveState(),e=t==="offline"?this._config.offline_color:this._config[Vs[t]];return{energy:Fs[t],rgb:Ys(e)}}_nearestAnchor(t,e,s){let i=s,n=s?Math.hypot(t.x-s.x,t.y-s.y)-s.r*.35:1/0;for(let o of e){let r=Math.hypot(t.x-o.x,t.y-o.y);r<n&&(n=r,i=o)}return i}_bubbleField(t){let e=t*.42;return{core:e,R:e,newR:()=>t*(.03+Math.pow(Math.random(),1.6)*.028),minAnchor:t*.058,maxR:t*.13}}_spawnBubble(t,e,s,i,n){let o=i!=null?i:Math.random()*Math.PI*2,r=n!=null?n:t.newR(),a=t.core+r;return{x:e+Math.cos(o)*a,y:s+Math.sin(o)*a,vx:0,vy:0,r:0,full:r,anchor:r>=t.minAnchor,host:null,held:!0,pop:-1,life:0,roll:Math.random()<.5?-1:1,wob:Math.random()*Math.PI*2,age:0,span:45+Math.random()*70}}_drawBubbles(t){var Nt,mt,Tt,qt,Vt,bt,Et;let e=this._ctx,s=this._w,i=this._h;if(!s||!i)return;let n=s/2,o=i/2,r=Math.min(s,i)/2,{energy:a,rgb:h}=this._targets(),d=1-Math.exp(-t/.55),u=1-Math.exp(-t/.16),p=this._cur;for(let c of Object.keys(a)){let $=c==="speech"&&a[c]<p[c]?u:d;p[c]+=(a[c]-p[c])*$}for(let c=0;c<3;c++)this._rgb[c]+=(h[c]-this._rgb[c])*d;let f=Math.round(this._rgb[0]),_=Math.round(this._rgb[1]),x=Math.round(this._rgb[2]);a.speech>.5&&this._speech.env<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),p.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*d;let m=this._speech,I=.5+.5*Math.sin(m.t*.5+.8*Math.sin(m.t*.21)),w=m.live?.88:.62,v=(w*m.env+(1-w)*I)*p.speech;this._t+=t;let j=p.swirl/1.8,A=Number(this._config.particle_size)||1,M=this._bubbleField(r),N=Math.max(6,Math.round(18*A));if(this._bub&&this._bubHalf&&this._bubHalf!==r){let c=r/this._bubHalf;for(let $ of this._bub)$.x=n+($.x-n)*c,$.y=o+($.y-o)*c,$.r*=c,$.full*=c,$.vx*=c,$.vy*=c,$.popR&&($.popR*=c);this._bubHalf=r}if(!this._bub){this._bubHalf=r,this._bub=[];for(let c=0;c<N;c++){let $=Math.min(M.newR()*(1+Math.random()*2.2),M.maxR),E=this._spawnBubble(M,n,o,c/N*Math.PI*2,$);E.r=E.full,E.anchor=E.r>=M.minAnchor,E.age=Math.random()*E.span,this._bub.push(E)}for(let c=0;c<100;c++)Ue(this._bub,2),He(this._bub,n,o,M.core),De(this._bub,n,o,M.core),Ne(this._bub,n,o,M.core,2);for(let c of this._bub)c.vx=0,c.vy=0;this._release=0}let P=this._bub;for(let c of P)c.held&&c.pop<0&&(c.anchor=c.r>=M.minAnchor);let V=P.filter(c=>c.anchor&&c.held&&c.pop<0),T=M.core*(1+v*.07+Math.sin(this._t*.22)*.005);for(this._release+=v*t*3.2;this._release>=1;){this._release-=1;let c=P.filter(S=>S.held&&!S.anchor&&S.pop<0&&S.r>S.full*.6),$=c.length>2?c:P.filter(S=>S.held&&S.pop<0&&S.r>S.full*.6);if($.length<3)break;let E=$[Math.floor(Math.random()*$.length)];E.host=null,E.held=!1,E.life=0;let U=Math.hypot(E.x-n,E.y-o)||1,B=(E.x-n)/U,R=(E.y-o)/U,z=r*(.5+Math.random()*.5);E.vx=B*z-R*r*.12,E.vy=R*z+B*r*.12}let F=r*(.045+j*.11);for(let c of P){c.wob+=t*1.3;let $=(Nt=c.dx)!=null?Nt:c.x,E=(mt=c.dy)!=null?mt:c.y;if(c.pop>=0){c.pop+=t;continue}if(c.held){if(c.r+=(c.full-c.r)*(1-Math.exp(-t/2)),c.anchor){let z=Math.hypot(c.x-n,c.y-o)||1,S=(c.x-n)/z,H=(c.y-o)/z,G=(T+c.r-z)*5;c.vx+=(S*G-H*F)*t,c.vy+=(H*G+S*F)*t}else{!c.host||!c.host.held||c.host.pop>=0?c.host=this._nearestAnchor(c,V,null):c.host=this._nearestAnchor(c,V,c.host);let z=c.host;if(z){let S=c.x-z.x,H=c.y-z.y,q=Math.hypot(S,H);q<.001&&(S=.1,H=0,q=.1);let G=S/q,vt=H/q,Y=(z.r+c.r-q)*6,J=r*.055*c.roll;c.vx+=(G*Y-vt*J)*t,c.vy+=(vt*Y+G*J)*t}else{let S=Math.hypot(c.x-n,c.y-o)||1,H=T+c.r;c.vx+=(c.x-n)/S*(H-S)*5*t,c.vy+=(c.y-o)/S*(H-S)*5*t}}let R=Math.exp(-t*(c.anchor?5.5:6.5));c.vx*=R,c.vy*=R}else c.life+=t,c.vy-=r*.85*t,c.vx*=Math.exp(-t*.9),c.r*=Math.exp(-t*.16),(c.life>1+Math.random()*.4||c.x<-r||c.x>s+r||c.y<-r)&&(c.pop=0,c.popR=c.r);let U=r*(c.held?.22:1.4),B=Math.hypot(c.vx,c.vy);B>U&&(c.vx=c.vx/B*U,c.vy=c.vy/B*U),c.x+=c.vx*t,c.y+=c.vy*t}Ue(P,2),He(P,n,o,T),De(P,n,o,T),Ne(P,n,o,T,2);let W=1-Math.exp(-t/.11);for(let c of P)c.dx===void 0?(c.dx=c.x,c.dy=c.y,c.dr=c.r):(c.dx+=(c.x-c.dx)*W,c.dy+=(c.y-c.dy)*W,c.dr+=(c.r-c.dr)*W);Ds(P,{dt:t,rate:.2+j*.15,sizeBias:3,maxRatio:2.1,maxR:M.maxR});for(let c of P)!c.held||c.pop>=0||(c.age+=t*(1+j*.5),Ns(c,{dt:t,maxR:M.maxR})&&(c.held=!1,c.pop=0,c.popR=c.r));for(let c=P.length-1;c>=0;c--)P[c].pop>Qs&&P.splice(c,1);let pe=0;for(;pe++<1;){let c=P.filter(z=>z.held&&z.pop<0),$=c.filter(z=>Math.hypot(z.x-n,z.y-o)<=T+z.r*1.7),{angle:E,gap:U}=Hs($,n,o),B=Math.sin(Math.min(U,Math.PI)/2)*T;if($.length>1&&B<M.newR()*1.4)break;let R=B>M.minAnchor*1.5;if(c.length>=N&&!R||c.length>=N*1.7)break;P.push(this._spawnBubble(M,n,o,E))}e.clearRect(0,0,s,i),e.globalCompositeOperation="lighter";let at=e.createRadialGradient(n-T*.3,o-T*.35,T*.08,n,o,T),St=.34+v*.22;at.addColorStop(0,`rgba(${Math.min(255,f+80)},${Math.min(255,_+80)},${Math.min(255,x+65)},${St})`),at.addColorStop(.6,`rgba(${f},${_},${x},${St*.55})`),at.addColorStop(1,`rgba(${f},${_},${x},0)`),e.fillStyle=at,e.beginPath(),e.arc(n,o,T,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${_},${x},${.3+v*.28})`,e.lineWidth=Math.max(.8,T*.018),e.beginPath(),e.arc(n,o,T*.985,0,Math.PI*2),e.stroke(),e.fillStyle=`rgba(255,255,255,${.13+v*.12})`,e.beginPath(),e.arc(n-T*.36,o-T*.4,T*.14,0,Math.PI*2),e.fill();let ue=P.slice().sort((c,$)=>$.r-c.r);for(let c of ue){let $=(Tt=c.dx)!=null?Tt:c.x,E=(qt=c.dy)!=null?qt:c.y;if(c.pop>=0){let q=Math.min(1,c.pop/Qs),G=c.popR||c.r,vt=1-Math.pow(1-q,2),xt=Math.pow(1-q,1.7);if(q<.55){let Y=G*(1-q*.12),J=e.createRadialGradient($-Y*.3,E-Y*.35,Y*.1,$,E,Y),Ft=.34*Math.pow(1-q/.55,1.4);J.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,_+95)},${Math.min(255,x+75)},${Ft})`),J.addColorStop(1,`rgba(${f},${_},${x},0)`),e.fillStyle=J,e.beginPath(),e.arc($,E,Y,0,Math.PI*2),e.fill()}e.strokeStyle=`rgba(${f},${_},${x},${xt*.3})`,e.lineWidth=Math.max(.4,G*.035*(1-q*.6)),e.beginPath(),e.arc($,E,G*(1+vt*.22),0,Math.PI*2),e.stroke();continue}let U=(Vt=c.dx)!=null?Vt:c.x,B=(bt=c.dy)!=null?bt:c.y,R=((Et=c.dr)!=null?Et:c.r)*(1+Math.sin(c.wob)*.015);if(R<.6)continue;let z=c.held?1:Math.max(0,1-c.life/2.1),S=(.5+v*.28)*z,H=e.createRadialGradient(U-R*.3,B-R*.35,R*.1,U,B,R);H.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,_+95)},${Math.min(255,x+75)},${S})`),H.addColorStop(.55,`rgba(${f},${_},${x},${S*.7})`),H.addColorStop(1,`rgba(${f},${_},${x},0)`),e.fillStyle=H,e.beginPath(),e.arc(U,B,R,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${_},${x},${(.26+v*.16)*z})`,e.lineWidth=Math.max(.5,R*.045),e.beginPath(),e.arc(U,B,R*.97,0,Math.PI*2),e.stroke(),R>3&&(e.fillStyle=`rgba(255,255,255,${(.26+v*.2)*z})`,e.beginPath(),e.arc(U-R*.34,B-R*.38,R*.17,0,Math.PI*2),e.fill())}e.globalCompositeOperation="source-over"}_draw(t){var Ye,Xe,Je,Ze;let e=this._ctx;if(!e)return;if(this._config.animation!=="jarvis-v1")return this._drawBubbles(t);if(!this._particles)return;let s=this._w,i=this._h,n=s/2,o=i/2,r=Math.min(s,i)/2,{energy:a,rgb:h}=this._targets(),d=1-Math.exp(-t/.55),u=1-Math.exp(-t/.16),p=this._cur;for(let k of Object.keys(a)){let y=k==="speech"&&a[k]<p[k]?u:d;p[k]+=(a[k]-p[k])*y}for(let k=0;k<3;k++)this._rgb[k]+=(h[k]-this._rgb[k])*d;let f=Math.round(this._rgb[0]),_=Math.round(this._rgb[1]),x=Math.round(this._rgb[2]);this._t+=t,this._waveT+=t*(.5+p.swirl*.9),this._spin+=t*(.09+p.swirl*.05),this._head+=t*(1.1+p.swirl*1.4),a.speech>.5&&this._cur.speech<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),p.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*d;let m=this._speech,I=.5+.5*Math.sin(m.t*.5+.8*Math.sin(m.t*.21)),w=m.live?.88:.62,v=(w*m.env+(1-w)*I)*p.speech,j=this._speech.syl?this._speech.syl.f:11;this._churnT+=t*(.55+p.swirl*.85+v*.7),this._waveT+=t*v*.8;let A=this._churnT,M=this._pulseTable(p.speech),N=this._peakTable(t,p,v),P=.003+v*.065,V=this._waveT;e.clearRect(0,0,s,i);let T=this._bootScale(t);T!==1&&(e.save(),e.translate(n,o),e.scale(T,T),e.translate(-n,-o));let F=this._t,W=this._waveT,pe=this._spin*.6,at=.955,St=.296,ue=.72+.28*Math.sin(F*.21+1.3)*Math.sin(F*.093+4.1),Nt=.012*Math.sin(F*.16+.7),mt=r*.38*1.16,Tt=r*.38*.7,qt=mt*mt,Vt=mt-Tt,bt=.92,Et=.075;e.fillStyle=`rgb(${f},${_},${x})`;let c=this._sprite(f,_,x),$=this._particles,E=Math.min($.length,Math.max(400,Math.round($.length*((Xe=(Ye=this._perf)==null?void 0:Ye.q)!=null?Xe:1))));(!this._mx||this._mx.length<$.length)&&(this._mx=new Float32Array($.length),this._my=new Float32Array($.length),this._mr=new Float32Array($.length),this._mb=new Uint8Array($.length));let U=this._mx,B=this._my,R=this._mr,z=this._mb,S=0,H=(Ze=(Je=this._perf)==null?void 0:Je.q)!=null?Ze:1,q=1+(1-H)*.6,G=H>=.5,vt=(Number(this._config.particle_size)||1)*it(r/220,.75,1.8)*(1+(1-H)*.35);for(let k=0;k<E;k++){let y=$[k],C=he[y.ri],O=y.lon+pe*C.rev+y.drift*A+y.wobA*(1+v*1)*(Math.sin(A*y.wobW+y.wobP)+.6*Math.sin(A*y.wobW*2.3+y.wobP*2.1)),lt=Math.cos(O),ti=Math.sin(O),me=y.cosLat*lt,Z=y.sinLat,Wt=y.cosLat*ti,ei=.45*Math.sin(5*O-W*1.4+Z*2.3)+.3*Math.sin(8*O+W*1.05-Z*3.1)+.3*Math.sin((me*.9+Z*.32+Wt*.28)*3.1+W*.9)+.2*Math.sin(13*O-W*2.1+Z*1.8),si=.45*Math.cos(5*O-W*1.4+Z*2.3)+.3*Math.cos(8*O+W*1.05-Z*3.1),ts=.5+.5*Math.sin(O-A*(.5+y.ri*.13)+y.ri*2.1),nt=ue*(.45+1.3*ts*ts)*(p.turb+v*.6);nt>1.1&&(nt=1.1);let ii=Math.sin((me*.7-Z*.6+Wt*.4)*7.3+W*1.8),Kt=ei*(.4+nt)+ii*.38*nt,es=y.off+y.bobA*(.7+.6*nt)*(Math.sin(A*y.bobW+y.bobP)+.55*Math.sin(A*y.bobW*2.7+y.bobP*1.9)),be=1-Math.min(1,Math.abs(es)),ss=p.amp*(1+v*.4),X=C.r+p.radius+Nt+v*.015+C.amp*ss*Kt+es*C.thick;Kt>.75&&(X+=(Kt-.75)*.04*nt);let Ct=me,jt=Z*at-Wt*St,ni=Z*St+Wt*at,Qt=Math.sqrt(Ct*Ct+jt*jt)||1e-4,Pt=Math.atan2(jt,Ct),ve=Pt*.15915494%1;ve<0&&(ve+=1);let xe=N[ve*kt|0];X+=xe*(.35+.65*be),X+=P*(C.rev<0?.75:1)*(.5*Math.sin(2*Pt+V*.9)+.35*Math.sin(3*Pt-V*1.3+1.7)+.2*Math.sin(5*Pt+V*2.1+.4));let Gt=(F+y.lt)%y.lf;Gt/=y.lf,X+=(Gt-.5)*.008;let ye=6*Gt*(1-Gt);ye>1&&(ye=1);let oi=.24+.76*be*be,ot=y.br*C.glow*oi*ye*(.55+.45*Math.abs(Math.sin(F*y.tw*.6+y.ph)))*p.bright;ot*=.68+.32*Math.sin(O*2.7+A*.45+y.ph*3);let we=Qt*Qt;if(ot*=.09+1.6*we*we*we,ot*=.62+.5*Math.max(0,Kt),ot*=.85+.3*nt,ot*=1+xe*(4+v*6),p.sweep>.01){let D=(Pt-this._head)%6.283185;D<0&&(D+=6.283185),D>3.141593&&(D-=6.283185),ot*=1+Math.exp(-(D*D)/.25)*p.sweep*2.4}let Yt=0;if(p.speech>.01){let D=(X-Ws)/Ks*($t-1);D=D<0?0:D>$t-1?$t-1:D|0,Yt=M[D],X+=Yt*.07,ot*=1+Yt*1.1+v*.7}X>bt&&(X=bt+Et*Math.tanh((X-bt)/Et));let is=X*r,ns=ni*.5+.5,os=y.sz*vt*(.78+.32*ns)*(1+v*.25+Yt*.5+xe*(.8+v*2)),rs=r*C.amp*ss*si*(.5+nt*.45),Xt=is*Ct-jt/Qt*rs,Jt=is*jt+Ct/Qt*rs,Rt=1,as=Xt*Xt+Jt*Jt;if(as<qt){if(Rt=(Math.sqrt(as)-Tt)/Vt,Rt<.02)continue;Rt*=Rt}let ls=it(ot*q*(.45+.65*ns)*Rt,0,1);if(y.halo&&G){let D=os*8;e.globalAlpha=ls*.22,e.drawImage(c,n+Xt-D/2,o+Jt-D/2,D,D)}let ri=os*.56;U[S]=n+Xt,B[S]=o+Jt,R[S]=ri,z[S++]=Math.min(le-1,ls*le|0)}for(let k=0;k<le;k++){e.beginPath();let y=!1;for(let C=0;C<S;C++)z[C]===k&&(e.moveTo(U[C]+R[C],B[C]),e.arc(U[C],B[C],R[C],0,6.283185),y=!0);y&&(e.globalAlpha=(k+.5)/le,e.fill())}e.globalAlpha=1,this._segTick(t),this._drawSegs(e,n,o,r,f,_,x);let xt=r*.38*(1+v*.05),Y=Math.cos(this._spin),J=Math.sin(this._spin),Ft=Math.cos(.35),Qe=Math.sin(.35),Ge=We.verts,fe=Ge.length;(!this._proj||this._proj.length!==fe*3)&&(this._proj=new Float64Array(fe*3));let K=this._proj;for(let k=0;k<fe;k++){let y=Ge[k],C=y[0]*Y+y[2]*J,O=-y[0]*J+y[2]*Y,lt=y[1]*Ft-O*Qe;K[k*3]=n+C*xt,K[k*3+1]=o-lt*xt,K[k*3+2]=y[1]*Qe+O*Ft}e.save(),e.beginPath(),e.arc(n,o,xt,0,Math.PI*2),e.clip();let _e=We.edges,ge=it(p.bright*(1+v*.45),.3,1.9);for(let k=0;k<2;k++){let y=k===1;e.beginPath();for(let C=0;C<_e.length;C+=2){let O=_e[C]*3,lt=_e[C+1]*3;K[O+2]+K[lt+2]>0===y&&(e.moveTo(K[O],K[O+1]),e.lineTo(K[lt],K[lt+1]))}e.strokeStyle=y?`rgba(220,246,255,${.4*ge})`:`rgba(${f},${_},${x},${.13*ge})`,e.lineWidth=Math.max(.35,r*(y?.0032:.0024)),e.stroke()}e.fillStyle="rgba(235,252,255,1)";for(let k of Ei){let y=k.v*3;if(K[y+2]<=.15)continue;let C=Math.pow(Math.abs(Math.sin(F*k.tw+k.ph)),6)*ge;if(C<.04)continue;e.globalAlpha=it(C,0,1);let O=Math.max(1,r*.008);e.fillRect(K[y]-O/2,K[y+1]-O/2,O,O)}e.globalAlpha=1,e.restore(),T!==1&&e.restore()}_bootScale(t){let e=this._boot;if(!e)return 1;let s=e.t+=t;if(s<.6)return 1-.98*(s/.6)**2;if(s<1.1)return .02+.012*Math.abs(Math.sin((s-.6)*22));if(s<2.6){let i=(s-1.1)/1.5-1;return .02+.98*(1+2.70158*i*i*i+1.70158*i*i)}return this._boot=null,1}_intro(){if(this._booting)return;this._boot={t:0},this._booting=!0,clearTimeout(this._bootTimer),this._bootTimer=setTimeout(()=>this._booting=!1,6500);let t=this._name,e=this._config.intro_message||`Allow me to introduce myself. I am ${t}, the virtual intelligence that runs this house, here to help with whatever you need, at any hour of the day. Your preferences are loaded. All systems are online.`;setTimeout(()=>{var s;Promise.resolve((s=this._hass)==null?void 0:s.callService("assist_satellite","announce",{entity_id:this._config.entity,message:e,preannounce:!1})).catch(()=>this._toast(`${t} could not speak the introduction.`))},900)}async _openSheet(t){var e,s,i;this._sheet={kind:t,items:null,q:""};try{let n=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t==="memories"?"memory_list":"skills",service_data:{},return_response:!0});if(((e=this._sheet)==null?void 0:e.kind)!==t)return;this._sheet=ht(L({},this._sheet),{items:((s=n==null?void 0:n.response)==null?void 0:s[t])||[]})}catch(n){((i=this._sheet)==null?void 0:i.kind)===t&&(this._sheet=ht(L({},this._sheet),{items:[],err:this._errText(n)}))}}_renderSheet(){let t=this._sheet,e=t.q.trim().toLowerCase(),s=n=>n.replace(/_/g," ").replace(/^\w/,o=>o.toUpperCase()),i=(t.items||[]).filter(n=>!e||`${n.text||""} ${n.name||""} ${n.description||""}`.toLowerCase().includes(e));return g`<div class="sheet" @click=${n=>n.target===n.currentTarget&&(this._sheet=null)}>
      <div class="sheet-box">
        <div class="sheet-head">
          <span>${t.kind==="memories"?"Memories":`What ${this._name} can do`}</span>
          <button class="sheet-x" title="Close" @click=${()=>this._sheet=null}>×</button>
        </div>
        <input
          type="search"
          placeholder="Filter"
          .value=${t.q}
          @input=${n=>this._sheet=ht(L({},this._sheet),{q:n.target.value})}
        />
        <div class="sheet-list">
          ${t.items==null?g`<div class="dim pad">Loading…</div>`:t.err?g`<div class="perr">${t.err}</div>`:i.length?i.map(n=>t.kind==="memories"?g`<div class="sheet-row">${n.text}${n.person?g`<em>${n.person}</em>`:b}</div>`:g`<div class="sheet-row"><b>${s(n.name)}</b>${n.description.split(". ")[0].replace(/\.?$/,".")}</div>`):g`<div class="dim pad">Nothing here.</div>`}
        </div>
        ${t.kind==="skills"?g`<div class="dim pad small">Plus everything Home Assistant exposes to ${this._name}: lights, media, climate, scenes and scripts.</div>`:b}
      </div>
    </div>`}_renderDock(t){if(t||this._config.dock===!1||this._config.build_page)return b;let e=s=>g`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${s}</svg>`;return g`<nav class="dock">
      <button title="Calendar" @click=${()=>this._navigate(this._config.calendar_path)}>
        ${e(wt`<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2"/>`)}
      </button>
      <button title="Memories" @click=${()=>this._openSheet("memories")}>
        ${e(wt`<path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 4.5 3 3 0 0 0 6 .5V6.5a2.5 2.5 0 0 0-3-2z"/><path d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 4.5 3 3 0 0 1-6 .5"/><path d="M12 9h-1.5M12 13H9.5M12 9h1.5M12 13h2.5"/>`)}
      </button>
      <button class="power ${this._booting?"on":""}" title="Start-up and introduction" @click=${this._intro}>
        ${e(wt`<path d="M12 3.5v7"/><path d="M7.2 6.6a7 7 0 1 0 9.6 0"/>`)}
      </button>
      <button title="Skills" @click=${()=>this._openSheet("skills")}>
        ${e(wt`<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>`)}
      </button>
      <button title="Build mode" data-ai="toggle-build-mode" @click=${()=>this._setBuild(!0)}>
        ${e(wt`<path d="M12 2.6c-4 0-7 2.5-7 6.5v4.3c0 2.1.8 4 2.2 5.4L9.6 21h4.8l2.4-2.2c1.4-1.4 2.2-3.3 2.2-5.4V9.1c0-4-3-6.5-7-6.5z"/><path d="M7.3 11.1l3.4 1M16.7 11.1l-3.4 1"/><path d="M12 2.8v4.4M9.8 17.2h4.4M7.4 14.2l2.3 1.6M16.6 14.2l-2.3 1.6"/>`)}
      </button>
    </nav>`}_fmtElapsed(t){if(t==null)return"";let e=Math.floor(t/60);return e<1?`${Math.floor(t)}s`:e<60?`${e}m`:`${Math.floor(e/60)}h ${e%60}m`}_chipProjects(){let t=n=>n.replace(/\b\w/g,o=>o.toUpperCase()),e=n=>typeof n=="string"?{project:n,label:t(n)}:n,s=this._config.build_projects,i=this._projects||[];return Array.isArray(s)&&s.length?s.map(e).filter(n=>!i.length||i.includes(n.project)):i.map(e)}_renderList(){let t=this._sessions;return g`
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
      ${this._picking?g`<div class="chips">
            ${this._chipProjects().map(e=>g`<button class="chip" @click=${()=>this._newSession(e.project)}>
                ${e.label}
              </button>`)}
          </div>`:b}
      <div class="list">
        ${t==null?g`<div class="dim pad">Scanning…</div>`:t.length===0?g`<div class="dim pad">No sessions running.</div>`:t.map(e=>g`
                  <div class="rowwrap ${this._swipe===e.id?"open":""}">
                    <button
                      class="rowkill"
                      data-ai="swipe-end-session"
                      @click=${()=>this._killSession(e.id)}
                    >${this._confirmKill===e.id?"Sure?":"End"}</button>
                    <button
                      class="row ${this._sel===e.id?"sel":""}"
                      data-ai="open-session"
                      @click=${()=>this._rowTap(e.id)}
                      @touchstart=${s=>this._swipeStart(s,e.id)}
                      @touchmove=${s=>this._swipeMove(s,e.id)}
                      @touchend=${()=>this._swipeEnd(e.id)}
                      @touchcancel=${()=>this._swipeEnd(e.id)}
                    >
                      <span
                        class="dot ${e.busy?"busy":e.done?"done":"idle"}"
                        title=${e.done?"finished \u2014 not opened yet":b}
                      ></span>
                      <span class="rmain">
                        <span class="rlabel">
                          ${e.title||e.label}
                          ${e.busy?g`<span class="rtime">${this._fmtElapsed(e.elapsed)}</span>`:b}
                        </span>
                        ${e.last_message?g`<span class="rsnip">${e.last_message}</span>`:b}
                        <span class="rmeta">
                          <span class="pill">${e.project}</span>
                          ${e.label!==e.project?g`<span class="pill alt">${e.label.replace(`${e.project}, `,"")}</span>`:b}
                          ${e.model?g`<span class="pill alt">${this._modelName(e)}</span>`:b}
                        </span>
                      </span>
                      <span class="chev">›</span>
                    </button>
                  </div>
                `)}
      </div>
    `}_modelName(t){if((t==null?void 0:t.model)==="local")return"Local";let e=(this._models||[]).find(s=>s.id===(t==null?void 0:t.model));return((e==null?void 0:e.name)||(t==null?void 0:t.model)||"Claude").replace(/^Claude /,"")}_renderHello(t){let e=(t==null?void 0:t.model)==="local",s=this._modelName(t);return g`<div class="hello">
      <div class="hello-ring"><span></span><span></span><span></span></div>
      <div class="hello-name">${e?this._name:"Claude"}</div>
      <div class="hello-sub">
        ${e?"Local":`Cloud \xB7 ${s}`}${t!=null&&t.project?g` · ${t.project}`:b}
      </div>
      <div class="hello-ready">Ready when you are</div>
    </div>`}_useSuggestion(){let t=this._composerEl();!t||!this._suggestion||(t.value=this._suggestion,this._autoGrow(t),this._draftSoon(),t.focus(),t.setSelectionRange(t.value.length,t.value.length))}_renderSession(){let t=(this._sessions||[]).find(e=>e.id===this._sel);return g`
      <div class="phead">
        <button class="hbtn back" data-ai="close-session-view" @click=${()=>this._select(null)}>‹</button>
        <button
          class="ptitle tappable"
          data-ai="session-details"
          title="What is this session?"
          @click=${()=>this._details=!this._details}
        >
          ${(t==null?void 0:t.title)||(t==null?void 0:t.label)||"session"}
          ${t!=null&&t.busy?g`<span class="livedot"></span> working ${this._fmtElapsed(t.elapsed)}`:b}
          <span class="caret">${this._details?"\u25B4":"\u25BE"}</span>
        </button>
        <button
          class="hbtn danger ${this._confirmKill===this._sel?"armed":""}"
          data-ai="end-session"
          @click=${()=>this._killSession(this._sel)}
        >${this._confirmKill===this._sel?"Confirm?":"End"}</button>
      </div>
      ${this._details?g`<div class="details">
            <div class="drow">
              <span class="dkey">Project</span>
              <span class="pill">${(t==null?void 0:t.project)||"unknown"}</span>
              ${t!=null&&t.label&&t.label!==t.project?g`<span class="pill alt">${t.label.replace(`${t.project}, `,"")}</span>`:b}
            </div>
            <div class="drow col">
              <span class="dkey">You opened with</span>
              <span class="dfirst">${(t==null?void 0:t.first_message)||"Nothing recorded yet."}</span>
            </div>
          </div>`:b}
      <div
        class="log"
        @scroll=${e=>{let s=e.target;this._stick=s.scrollHeight-s.scrollTop-s.clientHeight<40}}
      >
        ${this._msgs==null?g`<div class="dim pad">Loading transcript…</div>`:this._msgs.every(e=>e.role==="screen")?this._renderHello(t):this._msgs.map(e=>g`<div class="msg ${e.role}">${this._body(e)}</div>`)}
        ${t!=null&&t.busy?this._activity?g`<div class="activity">${this._activity}</div>`:this._screen?g`<pre class="activity screen-tail" title="No spinner on screen - this is the terminal as it stands">${this._screen}</pre>`:b:b}
        ${this._ask?this._renderAsk(this._ask):b}
        ${(this._queue||[]).filter(e=>e.id===this._sel).map(e=>g`<div class="qitem ${e.state}">
              <button
                class="qtext"
                data-ai="edit-queued"
                ?disabled=${e.state==="sent"}
                title=${e.state==="held"?"Tap to edit":""}
                @click=${()=>e.state==="held"&&this._editQueued(e)}
              >${e.text}</button>
              <div class="qbar">
                <span class="qtag">
                  ${e.state==="sent"?e.delivered?"sent \u2713":"sending\u2026":t!=null&&t.busy?"queued \xB7 sends when this turn ends":"queued"}
                </span>
                ${e.state==="held"?g`
                      <button class="qbtn" @click=${()=>this._editQueued(e)}>edit</button>
                      <button class="qbtn" @click=${()=>this._dispatch(e)}>send now</button>
                      <button class="qbtn del" @click=${()=>this._dropQueued(e)}>✕</button>
                    `:b}
              </div>
            </div>`)}
      </div>
      <form
        class="composer ${this._dragging?"drag":""}"
        @submit=${this._send}
        @dragover=${e=>{var s;[...((s=e.dataTransfer)==null?void 0:s.types)||[]].includes("Files")&&(e.preventDefault(),e.dataTransfer.dropEffect="copy",this._dragging=!0)}}
        @dragleave=${e=>{e.currentTarget.contains(e.relatedTarget)||(this._dragging=!1)}}
        @drop=${e=>{var s;e.preventDefault(),this._dragging=!1,this._ingest([...((s=e.dataTransfer)==null?void 0:s.files)||[]])}}
      >
        ${(this._files||[]).length||this._uploading?g`<div class="atts">
              ${(this._files||[]).map(e=>g`<span class="att">
                  <span class="attname">${e.name}</span>
                  <button
                    class="attx"
                    title="Remove"
                    @click=${()=>this._dropFile(e)}
                  >✕</button>
                </span>`)}
              ${this._uploading?g`<span class="att pendingatt">sending…</span>`:b}
            </div>`:b}
        <div
          class="cbox"
          @pointerdown=${e=>{var s;e.target.closest("button, input, textarea, select")||(e.preventDefault(),(s=this._composerEl())==null||s.focus())}}
        >
        <div class="cbtns">
          ${this._sel?this._renderRunControls():b}
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
            @click=${()=>{var e;return(e=this.renderRoot.querySelector(".filepick"))==null?void 0:e.click()}}
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
        ${this._suggestion?g`<button
              type="button"
              class="suggest"
              data-ai="use-suggestion"
              title="Claude Code's suggested reply - tap, or press Tab in an empty box"
              @click=${()=>this._useSuggestion()}
            ><span class="suggest-key">⇥</span>${this._suggestion}</button>`:b}
        <textarea
          data-ai="compose-prompt"
          rows="2"
          placeholder="Message ${this._name}…"
          autocomplete="off"
          ?disabled=${this._pending}
          @keydown=${e=>{if(e.key==="Tab"&&!e.shiftKey&&this._suggestion&&!e.target.value){e.preventDefault(),this._useSuggestion();return}e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this._send(e))}}
          @focus=${()=>this._settlePin()}
          @input=${e=>{this._autoGrow(e.target),this._draftSoon()}}
        ></textarea>
        </div>
      </form>
    `}render(){var r,a,h,d;if(!this._config)return b;if(!((a=(r=this._hass)==null?void 0:r.states)==null?void 0:a[this._config.entity]))return g`
        <ha-card>
          <div class="missing">
            Entity <code>${this._config.entity}</code> not found
          </div>
        </ha-card>
      `;let e=this._effectiveState(),s=e==="offline"?this._config.offline_color:this._config[Vs[e]],i=!!this._build,n=(h=this._announce)!=null?h:null,o=(d=this._messages)!=null?d:null;return g`
      <ha-card
        class="bg-${this._config.background}${this._config.honeycomb===!1?"":" comb"}${e==="offline"?" dim":""}"
        style=${this._config.honeycomb===!1?"":`--jr-comb:${Pi(s)}`}
      >
        <div
          class="wrap state-${e} ${i&&!this._config.build_dashboard?"build":""} ${this._config.build_page?"page":""} ${i&&this._config.panel_fullscreen&&!this._config.build_dashboard?"over":""}"
          style=${this._cardVars(s)}
        >
          ${this._config.dock===!1||i||this._config.build_page?g`<button
            class="mode ${i?"on":""}"
            data-ai="toggle-build-mode"
            title="Build mode"
            @click=${()=>this._setBuild(!i)}
          >
            <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>`:b}
          ${n===null?b:g`<button
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
          ${o===null?b:g`<button
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
          ${i&&!this._config.build_dashboard?g`<div class="panel ${this._sel?"open":""} ${this._view?"view":""}">
                <div class="side" style=${this._sideW?`flex-basis:${this._sideW}px`:""}>${this._renderList()}</div>
                <div class="grip" title="Drag to resize" @pointerdown=${this._gripDown}></div>
                <div class="main">
                  ${this._sel?this._renderSession():g`<div class="dim pad empty">Pick a session, or start a new one.</div>`}
                  ${this._err?g`<div class="perr">${this._err}</div>`:b}
                </div>
                ${this._view?g`<div class="viewer">${this._renderViewer()}</div>`:b}
              </div>`:b}
          <div class="ring ${this._config.animation==="jarvis-v1"?"":"bubbles"} ${this._booting?"booting":""}" data-ai="activate-assistant" @click=${this._ringTap}>
            <canvas></canvas>
            ${this._booting?g`<div class="wordmark" aria-hidden="true">${this._name.toUpperCase()}<small>All systems online</small></div>`:b}
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
                  width=${At.w}
                  height=${At.h}
                  patternUnits="userSpaceOnUse"
                >
                  <path d=${Zs} class="hex" />
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
          ${this._renderDock(i)}
          ${this._sheet?this._renderSheet():b}
        </div>
      </ha-card>
    `}};zt(Mt,"build",Xs),zt(Mt,"properties",{_config:{state:!0},_state:{state:!0},_mp:{state:!0},_build:{state:!0},_sessions:{state:!0},_projects:{state:!0},_sel:{state:!0},_msgs:{state:!0},_ask:{state:!0},_askSent:{state:!0},_activity:{state:!0},_screen:{state:!0},_permission:{state:!0},_modelBusy:{state:!0},_models:{state:!0},_suggestion:{state:!0},_modes:{state:!0},_model:{state:!0},_queue:{state:!0},_swipe:{state:!0},_details:{state:!0},_view:{state:!0},_sideW:{state:!0},_files:{state:!0},_dragging:{state:!0},_uploading:{state:!0},_err:{state:!0},_confirmKill:{state:!0},_picking:{state:!0},_pending:{state:!0},_voiceState:{state:!0},_announce:{state:!0},_messages:{state:!0},_dictating:{state:!0},_booting:{state:!0},_sheet:{state:!0}}),zt(Mt,"styles",Me`
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

    /* ---------------- start-up ---------------- */
    /* Same curve as _bootScale, so the SVG honeycomb and rims fold into the
       point and bloom back out with the canvas. */
    .ring.booting svg {
      animation: jrBoot 2.6s linear both;
      transform-origin: 50% 50%;
    }
    @keyframes jrBoot {
      0% { transform: scale(1); }
      23% { transform: scale(0.02); opacity: 0.4; }
      42% { transform: scale(0.03); opacity: 1; }
      78% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
    .ring.booting canvas {
      animation: jrFlash 2.6s ease-out both;
    }
    @keyframes jrFlash {
      0%, 40% { filter: none; }
      55% { filter: brightness(2.2); }
      100% { filter: none; }
    }
    .wordmark {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      color: var(--jr-color);
      font: italic 800 calc(var(--jr-size, 240px) * 0.12) / 1 "Eurostile", "Orbitron", "Arial Black", system-ui, sans-serif;
      letter-spacing: 0.06em;
      text-shadow: 0 0 12px var(--jr-color), 0 0 2px #fff;
      animation: jrWord 6.5s linear both;
    }
    /* pushed clear of the globe, onto the dim plate band, to stay legible */
    .wordmark small {
      position: absolute;
      top: 73%;
      font: 600 calc(var(--jr-size, 240px) * 0.03) / 1 system-ui, sans-serif;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      text-shadow: 0 0 6px var(--jr-color);
      opacity: 0;
      animation: jrFade 6.5s linear both;
    }
    /* letters sweep in left to right on the bloom, hold, then dissolve */
    @keyframes jrWord {
      0%, 22% { clip-path: inset(0 100% 0 0); opacity: 1; }
      40% { clip-path: inset(0 0 0 0); opacity: 1; }
      84% { clip-path: inset(0 0 0 0); opacity: 1; filter: blur(0); }
      100% { clip-path: inset(0 0 0 0); opacity: 0; filter: blur(4px); }
    }
    @keyframes jrFade {
      0%, 48% { opacity: 0; }
      56%, 84% { opacity: 0.85; }
      100% { opacity: 0; }
    }

    /* ---------------- dock ---------------- */
    .dock {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: clamp(10px, 4vw, 28px);
      width: 100%;
      padding: 10px 0 12px;
      line-height: 0;
    }
    /* the thin rail the buttons sit on */
    .dock::before {
      content: "";
      position: absolute;
      left: 8%;
      right: 8%;
      top: 50%;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--jr-color), transparent);
      opacity: 0.25;
    }
    .dock button {
      position: relative;
      width: 42px;
      height: 42px;
      padding: 9px;
      border-radius: 50%;
      border: 1px solid var(--jr-color);
      background: rgba(3, 7, 9, 0.85);
      color: var(--jr-color);
      opacity: 0.6;
      cursor: pointer;
      transition: opacity 0.2s, box-shadow 0.2s, transform 0.12s;
      -webkit-tap-highlight-color: transparent;
    }
    .dock button:hover,
    .dock button.on {
      opacity: 1;
      box-shadow: 0 0 10px var(--jr-color);
    }
    .dock button:active {
      transform: scale(0.94);
    }
    .dock button.power {
      width: 54px;
      height: 54px;
      padding: 12px;
    }
    .dock svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* ---------------- memories / skills sheet ---------------- */
    .sheet {
      position: absolute;
      inset: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      line-height: 1.4;
    }
    .sheet-box {
      display: flex;
      flex-direction: column;
      width: min(440px, calc(100% - 32px));
      max-height: calc(100% - 32px);
      background: #061014;
      border: 1px solid var(--jr-color);
      border-radius: 12px;
      box-shadow: 0 0 24px rgba(0, 0, 0, 0.6);
      color: #d6eef2;
      overflow: hidden;
    }
    .sheet-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px 6px;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--jr-color);
    }
    .sheet-x {
      background: none;
      border: none;
      color: inherit;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      padding: 4px 6px;
    }
    .sheet input {
      margin: 4px 14px 8px;
      padding: 7px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.05);
      color: inherit;
      font: inherit;
    }
    .sheet-list {
      overflow-y: auto;
      padding: 0 14px 10px;
      font-size: 14px;
    }
    .sheet-row {
      padding: 8px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.07);
    }
    .sheet-row b {
      display: block;
      color: var(--jr-color);
      font-weight: 600;
    }
    .sheet-row em {
      margin-left: 8px;
      font-size: 11px;
      font-style: normal;
      opacity: 0.6;
    }
    .sheet .small {
      font-size: 12px;
      padding: 8px 14px 12px;
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
      /* No backdrop-filter here, ever: a filtered element becomes the
         containing block for fixed descendants, so the phone rules that pin
         .panel to the visual viewport measured from THIS box instead - the
         panel started below the header but kept full-viewport height, and
         the composer hung 56px off the bottom of the screen. The background
         is 97% opaque; the blur was invisible anyway. */
    }
    /* Build mode is a console: sessions on the left, the conversation in the
       middle, a file the reply pointed at on the right. The ring sits it out —
       it was decoration that cost a quarter of the width. */
    .wrap.build .ring {
      display: none;
    }
    .side,
    .main,
    .viewer {
      display: flex;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
    }
    .side {
      flex: 0 0 clamp(180px, 28%, 280px);
    }
    .grip {
      flex: none;
      width: 6px;
      margin: 0 9px 0 9px;
      border-left: 1px solid rgba(53, 154, 210, 0.3);
      cursor: col-resize;
      touch-action: none;
      transition: border-color 0.2s;
    }
    .grip:hover,
    .grip:active {
      border-color: var(--jr-color);
    }
    .main {
      flex: 1;
    }
    .main .hbtn.back {
      display: none;
    }
    .empty {
      margin: auto;
      text-align: center;
    }
    .viewer {
      flex: 0 0 min(44%, 600px);
      padding-left: 12px;
      margin-left: 12px;
      border-left: 1px solid rgba(53, 154, 210, 0.3);
    }
    .flink {
      color: var(--jr-color);
      text-decoration: underline dotted;
      text-underline-offset: 2px;
      cursor: pointer;
    }
    .vpath {
      flex: none;
      font-size: 11px;
      color: rgba(160, 200, 220, 0.55);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      direction: rtl;
      text-align: left;
      padding-bottom: 6px;
    }
    .vbody {
      flex: 1;
      min-height: 0;
      overflow: auto;
      user-select: text;
      -webkit-user-select: text;
    }
    .vtext {
      margin: 0;
      font: 12px/1.5 ui-monospace, Menlo, Consolas, monospace;
      white-space: pre;
      min-width: max-content;
    }
    .vline {
      display: flex;
    }
    .vline.hit {
      background: rgba(46, 157, 245, 0.18);
    }
    .vno {
      flex: none;
      width: 3.5em;
      padding-right: 1em;
      text-align: right;
      color: rgba(160, 200, 220, 0.4);
      user-select: none;
      -webkit-user-select: none;
    }
    .vimg {
      display: block;
      max-width: 100%;
      height: auto;
    }
    .vent {
      display: block;
      padding: 3px 0;
      font-size: 13px;
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
      flex-direction: row;
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
      padding: 8px 4px 8px 14px;
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
    /* After .rowwrap .row: that rule paints an opaque swipe backdrop over
       the row, so the selected state has to outrank it or it never shows. */
    .rowwrap .row.sel {
      background: linear-gradient(160deg, #143247 0%, #0d2334 100%);
      box-shadow: inset 3px 0 0 var(--jr-color);
      color: #fff;
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
    .suggest {
      align-self: flex-start;
      max-width: 100%;
      margin: 4px 8px 0;
      padding: 4px 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px dashed var(--jr-color);
      border-radius: 999px;
      background: transparent;
      color: inherit;
      opacity: 0.7;
      font: inherit;
      font-size: 13px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      transition: opacity 150ms ease, transform 150ms ease;
    }
    .suggest:hover {
      opacity: 1;
    }
    .suggest:active {
      transform: scale(0.97);
    }
    .suggest-key {
      color: var(--jr-color);
      font-size: 12px;
    }
    .hello {
      margin: auto;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
      line-height: 1.3;
      animation: jr-hello-in 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .hello-ring {
      position: relative;
      width: 96px;
      height: 96px;
      margin-bottom: 14px;
    }
    .hello-ring span {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid var(--jr-color);
    }
    .hello-ring span:nth-child(1) {
      inset: 0;
      opacity: 0.35;
      border-style: dashed;
      animation: jr-hello-spin 24s linear infinite;
    }
    .hello-ring span:nth-child(2) {
      inset: 14px;
      opacity: 0.7;
      border-color: var(--jr-color) transparent;
      animation: jr-hello-spin 9s linear infinite reverse;
    }
    .hello-ring span:nth-child(3) {
      inset: 32px;
      background: var(--jr-color);
      box-shadow: 0 0 18px var(--jr-color), 0 0 42px var(--jr-color);
      animation: jr-rim 4s ease-in-out infinite;
    }
    .hello-name {
      font-size: 30px;
      font-weight: 300;
      letter-spacing: 0.42em;
      margin-right: -0.42em; /* letter-spacing trails the last glyph */
      text-transform: uppercase;
      color: var(--jr-color);
      text-shadow: 0 0 14px var(--jr-color);
    }
    .hello-sub {
      font-size: 13px;
      opacity: 0.75;
      font-variant-numeric: tabular-nums;
    }
    .hello-ready {
      font-size: 12px;
      opacity: 0.45;
      letter-spacing: 0.08em;
    }
    @keyframes jr-hello-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes jr-hello-in {
      from {
        opacity: 0;
        transform: translateY(6px) scale(0.98);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hello,
      .hello-ring span {
        animation: none;
      }
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
    /* On a narrow phone the selects give way; the buttons never do. */
    .cbtns > .hbtn {
      flex: 0 0 auto;
    }
    /* Sits inside the composer's button row, left of attach, with a beat of
       air before the attach/mic/send cluster so the two groups read apart.
       One line always: the selects shrink and ellipsize on a phone rather
       than wrapping under each other and pushing the input down. */
    .runbar {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: nowrap;
      min-width: 0;
      margin-right: 10px;
    }
    .hbtn.stop {
      border-color: rgba(255, 92, 92, 0.6);
      color: #ff9d9d;
      flex: 0 0 auto;
    }
    .hbtn.stop:hover {
      border-color: #ff5c5c;
      color: #ffc4c4;
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
      max-width: 26vw;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
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
    .screen-tail {
      align-self: stretch;
      margin: 0;
      padding: 8px 10px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      border-left: 2px solid rgba(160, 200, 220, 0.35);
      background: rgba(0, 0, 0, 0.25);
      animation: none;
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
      .panel {
        flex-direction: column;
      }
      .side,
      .main,
      .viewer {
        flex: 1;
        padding: 0;
        margin: 0;
        border: none;
      }
      .grip,
      .panel.open .side,
      .panel.view .side,
      .panel:not(.open) .main,
      .panel.view .main {
        display: none;
      }
      .main .hbtn.back {
        display: block;
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
  `);var Ri=[{name:"entity",required:!0,selector:{entity:{domain:ce}}},{name:"animation",selector:{select:{mode:"dropdown",options:[{value:"hubbubb",label:"Hubbubb - ring and bubbles"},{value:"jarvis-v1",label:"Jarvis v1 - segments and motes"}]}}},{name:"assistant_name",selector:{text:{}}},{name:"size",selector:{number:{min:80,max:600,step:10,mode:"slider"}}},{name:"background",selector:{select:{mode:"dropdown",options:[{value:"dark",label:"Deep space (dark)"},{value:"card",label:"Normal card background"},{value:"transparent",label:"Transparent"}]}}},{name:"honeycomb",selector:{boolean:{}}},{name:"tap_message",selector:{text:{}}},{name:"",type:"expandable",title:"Toggles",icon:"mdi:toggle-switch-outline",schema:[{name:"build_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"announce_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"messages_entity",selector:{entity:{domain:["switch","input_boolean"]}}}]},{name:"",type:"expandable",title:"Build panel",icon:"mdi:hexagon-multiple-outline",schema:[{name:"panel_fullscreen",selector:{boolean:{}}},{name:"panel_height",selector:{number:{min:0,max:1400,step:20,mode:"box"}}},{name:"build_projects",selector:{text:{multiple:!0}}},{name:"build_dashboard",selector:{text:{}}},{name:"build_page",selector:{boolean:{}}},{name:"build_return",selector:{text:{}}}]},{name:"",type:"expandable",title:"Ring colours",icon:"mdi:palette",schema:[{name:"idle_color",selector:{text:{}}},{name:"listening_color",selector:{text:{}}},{name:"processing_color",selector:{text:{}}},{name:"responding_color",selector:{text:{}}},{name:"offline_color",selector:{text:{}}}]},{name:"",type:"expandable",title:"Panel colours",icon:"mdi:console",schema:[{name:"panel_bg",selector:{text:{}}},{name:"panel_border",selector:{text:{}}},{name:"panel_text",selector:{text:{}}},{name:"terminal_bg",selector:{text:{}}},{name:"terminal_text",selector:{text:{}}}]},{name:"",type:"expandable",title:"Advanced",icon:"mdi:tune",schema:[{name:"follow_media_player",selector:{boolean:{}}},{name:"audio_offset",selector:{number:{min:-2,max:2,step:.05,mode:"box"}}},{name:"media_player",selector:{entity:{domain:"media_player"}}},{name:"particle_size",selector:{number:{min:.3,max:3,step:.1,mode:"slider"}}},{name:"particles",selector:{number:{min:0,max:4e3,step:20,mode:"box"}}}]}],zi={entity:"Assist satellite",animation:"Animation",assistant_name:"Assistant name",size:"Ring size (px)",background:"Card background",honeycomb:"Honeycomb background",follow_media_player:"Animate while the device is playing audio",audio_offset:"Audio sync offset (seconds)",media_player:"Speaker entity (blank = same device)",tap_message:"Spoken reply when the ring is tapped",particles:"Particle count, Jarvis v1 (0 = auto)",particle_size:"How many bubbles (1 = about 22)",build_entity:"Build mode toggle",announce_entity:"Agent announcement toggle",messages_entity:"Hubbubb message toggle",panel_fullscreen:"Full screen (floats over the dashboard)",panel_height:"Panel height in px (0 = match the ring)",build_projects:"Projects offered by + New (blank = all the companion has)",build_dashboard:"Open this dashboard instead",build_page:"This card IS the build dashboard",build_return:"Exit goes back to",idle_color:"Idle",listening_color:"Listening",processing_color:"Processing",responding_color:"Responding",offline_color:"Unavailable",panel_bg:"Panel background",panel_border:"Panel border",panel_text:"Panel text",terminal_bg:"Terminal background",terminal_text:"Terminal text"},de=class extends st{setConfig(t){this._config=L(L({},qe),t)}render(){return this._config?g`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Ri}
        .computeLabel=${t=>{var e;return(e=zi[t.name])!=null?e:t.name}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:b}_valueChanged(t){t.stopPropagation();let e=L({},t.detail.value);for(let[s,i]of Object.entries(qe))e[s]===i&&delete e[s];delete e.name,delete e.show_state,Ve(this,"config-changed",{config:e})}};zt(de,"properties",{hass:{},_config:{state:!0}});customElements.define("hubbubb-ring-card",Mt);customElements.define("hubbubb-ring-card-editor",de);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-ring-card",name:"Hubbubb Ring",description:"Animated glowing ring that reacts to an Assist satellite's state.",preview:!0});console.info(`%c HUBBUBB-RING-CARD %c v${wi} `,"color:#0b1620;background:#35e0ff;font-weight:700","color:#35e0ff;background:#0b1620");
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
