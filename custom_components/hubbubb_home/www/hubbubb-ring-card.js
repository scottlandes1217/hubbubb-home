var ai=Object.defineProperty,li=Object.defineProperties;var hi=Object.getOwnPropertyDescriptors;var ls=Object.getOwnPropertySymbols;var ci=Object.prototype.hasOwnProperty,di=Object.prototype.propertyIsEnumerable;var Ae=(c,t,e)=>t in c?ai(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e,U=(c,t)=>{for(var e in t||(t={}))ci.call(t,e)&&Ae(c,e,t[e]);if(ls)for(var e of ls(t))di.call(t,e)&&Ae(c,e,t[e]);return c},it=(c,t)=>li(c,hi(t));var Ht=(c,t,e)=>Ae(c,typeof t!="symbol"?t+"":t,e);var ne=globalThis,re=ne.ShadowRoot&&(ne.ShadyCSS===void 0||ne.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Se=Symbol(),hs=new WeakMap,Nt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(re&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=hs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&hs.set(e,t))}return t}toString(){return this.cssText}},cs=c=>new Nt(typeof c=="string"?c:c+"",void 0,Se),Te=(c,...t)=>{let e=c.length===1?c[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+c[o+1],c[0]);return new Nt(e,c,Se)},ds=(c,t)=>{if(re)c.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=ne.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,c.appendChild(s)}},je=re?c=>c:c=>c instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return cs(e)})(c):c;var{is:pi,defineProperty:ui,getOwnPropertyDescriptor:fi,getOwnPropertyNames:gi,getOwnPropertySymbols:_i,getPrototypeOf:mi}=Object,_t=globalThis,ps=_t.trustedTypes,bi=ps?ps.emptyScript:"",Ee=_t.reactiveElementPolyfillSupport,Dt=(c,t)=>c,Ce={toAttribute(c,t){switch(t){case Boolean:c=c?bi:null;break;case Object:case Array:c=c==null?c:JSON.stringify(c)}return c},fromAttribute(c,t){let e=c;switch(t){case Boolean:e=c!==null;break;case Number:e=c===null?null:Number(c);break;case Object:case Array:try{e=JSON.parse(c)}catch(s){e=null}}return e}},ms=(c,t)=>!pi(c,t),us={attribute:!0,type:String,converter:Ce,reflect:!1,useDefault:!1,hasChanged:ms},fs,gs;(fs=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(gs=_t.litPropertyMetadata)!=null||(_t.litPropertyMetadata=new WeakMap);var dt=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=us){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ui(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var n;let{get:i,set:o}=(n=fi(this.prototype,t))!=null?n:{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let a=i==null?void 0:i.call(this);o==null||o.call(this,r),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:us}static _$Ei(){if(this.hasOwnProperty(Dt("elementProperties")))return;let t=mi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Dt("properties"))){let e=this.properties,s=[...gi(e),..._i(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(je(i))}else t!==void 0&&e.push(je(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return ds(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Ce).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var o,n,r;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)==null?void 0:o.fromAttribute)!==void 0?a.converter:Ce;this._$Em=i;let h=l.fromAttribute(e,a.type);this[i]=(r=h!=null?h:(n=this._$Ej)==null?void 0:n.get(i))!=null?r:h,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){var n,r;if(t!==void 0){let a=this.constructor;if(i===!1&&(o=this[t]),s!=null||(s=a.getPropertyOptions(t)),!(((n=s.hasChanged)!=null?n:ms)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){var r,a,l;s&&!((r=this._$Ej)!=null?r:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=n!=null?n:e)!=null?a:this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,r]of o){let{wrapped:a}=r,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,r,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},_s;dt.elementStyles=[],dt.shadowRootOptions={mode:"open"},dt[Dt("elementProperties")]=new Map,dt[Dt("finalized")]=new Map,Ee==null||Ee({ReactiveElement:dt}),((_s=_t.reactiveElementVersions)!=null?_s:_t.reactiveElementVersions=[]).push("2.1.2");var Ft=globalThis,bs=c=>c,ae=Ft.trustedTypes,vs=ae?ae.createPolicy("lit-html",{createHTML:c=>c}):void 0,Ie="$lit$",pt=`lit$${Math.random().toFixed(9).slice(2)}$`,ze="?"+pt,vi=`<${ze}>`,wt=document,Wt=()=>wt.createComment(""),Vt=c=>c===null||typeof c!="object"&&typeof c!="function",Oe=Array.isArray,As=c=>Oe(c)||typeof(c==null?void 0:c[Symbol.iterator])=="function",Pe=`[ 	
\f\r]`,qt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ws=/-->/g,ys=/>/g,bt=RegExp(`>|${Pe}(?:([^\\s"'>=/]+)(${Pe}*=${Pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xs=/'/g,$s=/"/g,Ss=/^(?:script|style|textarea|title)$/i,Be=c=>(t,...e)=>({_$litType$:c,strings:t,values:e}),w=Be(1),Et=Be(2),qi=Be(3),tt=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),ks=new WeakMap,vt=wt.createTreeWalker(wt,129);function Ts(c,t){if(!Oe(c)||!c.hasOwnProperty("raw"))throw Error("invalid template strings array");return vs!==void 0?vs.createHTML(t):t}var js=(c,t)=>{let e=c.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=qt;for(let r=0;r<e;r++){let a=c[r],l,h,p=-1,d=0;for(;d<a.length&&(n.lastIndex=d,h=n.exec(a),h!==null);)d=n.lastIndex,n===qt?h[1]==="!--"?n=ws:h[1]!==void 0?n=ys:h[2]!==void 0?(Ss.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=bt):h[3]!==void 0&&(n=bt):n===bt?h[0]===">"?(n=i!=null?i:qt,p=-1):h[1]===void 0?p=-2:(p=n.lastIndex-h[2].length,l=h[1],n=h[3]===void 0?bt:h[3]==='"'?$s:xs):n===$s||n===xs?n=bt:n===ws||n===ys?n=qt:(n=bt,i=void 0);let f=n===bt&&c[r+1].startsWith("/>")?" ":"";o+=n===qt?a+vi:p>=0?(s.push(l),a.slice(0,p)+Ie+a.slice(p)+pt+f):a+pt+(p===-2?r:f)}return[Ts(c,o+(c[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Kt=class c{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,r=t.length-1,a=this.parts,[l,h]=js(t,e);if(this.el=c.createElement(l,s),vt.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=vt.nextNode())!==null&&a.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Ie)){let d=h[n++],f=i.getAttribute(p).split(pt),_=/([.?@])?(.*)/.exec(d);a.push({type:1,index:o,name:_[2],strings:f,ctor:_[1]==="."?he:_[1]==="?"?ce:_[1]==="@"?de:xt}),i.removeAttribute(p)}else p.startsWith(pt)&&(a.push({type:6,index:o}),i.removeAttribute(p));if(Ss.test(i.tagName)){let p=i.textContent.split(pt),d=p.length-1;if(d>0){i.textContent=ae?ae.emptyScript:"";for(let f=0;f<d;f++)i.append(p[f],Wt()),vt.nextNode(),a.push({type:2,index:++o});i.append(p[d],Wt())}}}else if(i.nodeType===8)if(i.data===ze)a.push({type:2,index:o});else{let p=-1;for(;(p=i.data.indexOf(pt,p+1))!==-1;)a.push({type:7,index:o}),p+=pt.length-1}o++}}static createElement(t,e){let s=wt.createElement("template");return s.innerHTML=t,s}};function yt(c,t,e=c,s){var n,r,a;if(t===tt)return t;let i=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl,o=Vt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((r=i==null?void 0:i._$AO)==null||r.call(i,!1),o===void 0?i=void 0:(i=new o(c),i._$AT(c,e,s)),s!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=yt(c,i._$AS(c,t.values),i,s)),t}var le=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var l;let{el:{content:e},parts:s}=this._$AD,i=((l=t==null?void 0:t.creationScope)!=null?l:wt).importNode(e,!0);vt.currentNode=i;let o=vt.nextNode(),n=0,r=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new jt(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new pe(o,this,t)),this._$AV.push(h),a=s[++r]}n!==(a==null?void 0:a.index)&&(o=vt.nextNode(),n++)}return vt.currentNode=wt,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},jt=class c{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=yt(this,t,e),Vt(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):As(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&Vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(wt.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Kt.createElement(Ts(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{let n=new le(i,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=ks.get(t.strings);return e===void 0&&ks.set(t.strings,e=new Kt(t)),e}k(t){Oe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new c(this.O(Wt()),this.O(Wt()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=bs(t).nextSibling;bs(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},xt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=yt(this,t,e,0),n=!Vt(t)||t!==this._$AH&&t!==tt,n&&(this._$AH=t);else{let r=t,a,l;for(t=o[0],a=0;a<o.length-1;a++)l=yt(this,r[s+a],e,a),l===tt&&(l=this._$AH[a]),n||(n=!Vt(l)||l!==this._$AH[a]),l===A?t=A:t!==A&&(t+=(l!=null?l:"")+o[a+1]),this._$AH[a]=l}n&&!i&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},he=class extends xt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}},ce=class extends xt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}},de=class extends xt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var n;if((t=(n=yt(this,t,e,0))!=null?n:A)===tt)return;let s=this._$AH,i=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==A&&(s===A||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},pe=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){yt(this,t)}},Es={M:Ie,P:pt,A:ze,C:1,L:js,R:le,D:As,V:yt,I:jt,H:xt,N:ce,U:de,B:he,F:pe},Re=Ft.litHtmlPolyfillSupport,Ms;Re==null||Re(Kt,jt),((Ms=Ft.litHtmlVersions)!=null?Ms:Ft.litHtmlVersions=[]).push("3.3.3");var Cs=(c,t,e)=>{var o,n;let s=(o=e==null?void 0:e.renderBefore)!=null?o:t,i=s._$litPart$;if(i===void 0){let r=(n=e==null?void 0:e.renderBefore)!=null?n:null;s._$litPart$=i=new jt(t.insertBefore(Wt(),r),r,void 0,e!=null?e:{})}return i._$AI(c),i};var $t=globalThis,ut=class extends dt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Cs(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}},Ps;ut._$litElement$=!0,ut.finalized=!0,(Ps=$t.litElementHydrateSupport)==null||Ps.call($t,{LitElement:ut});var Le=$t.litElementPolyfillSupport;Le==null||Le({LitElement:ut});var Rs;((Rs=$t.litElementVersions)!=null?Rs:$t.litElementVersions=[]).push("4.2.2");var kt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ue=c=>(...t)=>({_$litDirective$:c,values:t}),Ct=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:oo}=Es;var Is=c=>c.strings===void 0;var wi={},fe=(c,t=wi)=>c._$AH=t;var zs=ue(class extends Ct{constructor(){super(...arguments),this.key=A}render(c,t){return this.key=c,t}update(c,[t,e]){return t!==this.key&&(fe(c),this.key=t),e}});var Ue=ue(class extends Ct{constructor(c){if(super(c),c.type!==kt.PROPERTY&&c.type!==kt.ATTRIBUTE&&c.type!==kt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Is(c))throw Error("`live` bindings can only contain a single expression")}render(c){return c}update(c,[t]){if(t===tt||t===A)return t;let e=c.element,s=c.name;if(c.type===kt.PROPERTY){if(t===e[s])return tt}else if(c.type===kt.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(s))return tt}else if(c.type===kt.ATTRIBUTE&&e.getAttribute(s)===t+"")return tt;return fe(c),t}});function Os(c,t,e){let s=Math.max(1,Math.round(t/e)),i=new Float32Array(Math.ceil(c.length/s)),o=1e-6;for(let n=0,r=0;n<c.length;n+=s,r++){let a=Math.min(c.length,n+s),l=0;for(let p=n;p<a;p++)l+=c[p]*c[p];let h=Math.sqrt(l/(a-n));i[r]=h,h>o&&(o=h)}for(let n=0;n<i.length;n++)i[n]=Math.min(1,i[n]/o);return i}function Bs(c,t){let e=c/t,s=0,i=0;return o=>{let n=o.length,r=new Int16Array(Math.max(0,Math.ceil((n-s)/e))),a=0;for(;s<n;s+=e){let l=Math.floor(s),h=l<0?i:o[l],p=l+1<n?o[l+1]:h,d=Math.max(-1,Math.min(1,h+(p-h)*(s-l)));r[a++]=d<0?d*32768:d*32767}return s-=n,i=n?o[n-1]:i,a===r.length?r:r.subarray(0,a)}}var yi=/(^|[^\w:/@.~-])((?:~|\.{1,2})?\/[\w.@~-]+(?:\/[\w.@~-]+)*|[\w.@-]+(?:\/[\w.@-]+)+\.\w+)(:\d+)?/g;function He(c){let t=[],e=0;for(let s of c.matchAll(yi)){let i=s[2],o=s[3]||"",n=s.index+s[1].length;for(;/[.,;]$/.test(i);)i=i.slice(0,-1);n>e&&t.push(c.slice(e,n)),t.push({path:i,line:o}),e=n+i.length+o.length}return e<c.length&&t.push(c.slice(e)),t}function Ne(c){return He(c.replace(/\[Image #\d+\]/g," ")).filter(t=>typeof t=="string").join(" ").split(/\s+/).join(" ").trim().slice(0,200)}function De(c,t=2,e=1,s=.06,i=1.04){for(let o=0;o<t;o++)for(let n=0;n<c.length;n++){let r=c[n];if(!(!r.held||r.pop>=0))for(let a=n+1;a<c.length;a++){let l=c[a];if(!l.held||l.pop>=0)continue;let h=l.x-r.x,p=l.y-r.y,d=Math.hypot(h,p);d<.001&&(h=.1,p=0,d=.1);let f=r.r+l.r,_=h/d,b=p/d;if(d<f){let g=(f-d)*.5*e;r.x-=_*g,r.y-=b*g,l.x+=_*g,l.y+=b*g}else if(s>0&&d>f*i&&d<f*1.5){let g=(d-f)*s;r.x+=_*g,r.y+=b*g,l.x-=_*g,l.y-=b*g}}}return c}function qe(c,t,e,s){for(let i of c){if(!i.held||i.pop>=0)continue;let o=i.x-t,n=i.y-e,r=Math.hypot(o,n);r<.001&&(o=1,n=0,r=1);let a=s+i.r;if(r<a){let l=o/r,h=n/r;i.x=t+l*a,i.y=e+h*a;let p=i.vx*l+i.vy*h;p<0&&(i.vx-=p*l,i.vy-=p*h)}}return c}function Fe(c,t,e,s,i=1){for(let o of c){if(!o.held||o.pop>=0||!o.anchor)continue;let n=o.x-t,r=o.y-e,a=Math.hypot(n,r);a<.001&&(n=1,r=0,a=1);let l=n/a,h=r/a,p=s+o.r;o.x+=(t+l*p-o.x)*i,o.y+=(e+h*p-o.y)*i;let d=o.vx*l+o.vy*h;o.vx-=d*l,o.vy-=d*h}return c}function Ls(c,t,e){let s=Math.PI*2;if(!c.length)return{angle:0,gap:s};let i=c.map(r=>Math.atan2(r.y-e,r.x-t)).sort((r,a)=>r-a),o=-1,n=0;for(let r=0;r<i.length;r++){let a=i[r],h=(r+1<i.length?i[r+1]:i[0]+s)-a;h>o&&(o=h,n=a+h/2)}return{angle:n,gap:o}}function Us(c,t){let{dt:e,rate:s,maxRatio:i,maxR:o,sizeBias:n=0,rand:r=Math.random}=t,a=0;for(let l=0;l<c.length;l++){let h=c[l];if(!(!h.held||h.pop>=0||h.gone))for(let p=l+1;p<c.length;p++){let d=c[p];if(!d.held||d.pop>=0||d.gone||Math.hypot(d.x-h.x,d.y-h.y)>h.r+d.r+1||(h.r>=d.r?h.r/d.r:d.r/h.r)>i)continue;let b=Math.sqrt(h.r*h.r+d.r*d.r);if(b>o)continue;let g=Math.min(h.r,d.r),y=n?Math.pow(Math.min(1,g/o),1/n):1;if(r()>s*y*e)continue;let m=h.r>=d.r?h:d,v=m===h?d:h,$=m.r*m.r,k=v.r*v.r,x=$+k;if(m.x=(m.x*$+v.x*k)/x,m.y=(m.y*$+v.y*k)/x,m.vx=(m.vx*$+v.vx*k)/x,m.vy=(m.vy*$+v.vy*k)/x,m.r=b,m.full=b,m.age=0,v.gone=!0,a++,m!==h)break}}if(a)for(let l=c.length-1;l>=0;l--)c[l].gone&&c.splice(l,1);return a}function We(c,t,e,s,i=2,o=1){let n=c.filter(r=>r.held&&!(r.pop>=0)&&r.anchor);if(n.length<2)return c;for(let r=0;r<i;r++)for(let a=0;a<n.length;a++)for(let l=a+1;l<n.length;l++){let h=n[a],p=n[l],d=s+h.r,f=s+p.r,_=Math.atan2(h.y-e,h.x-t),b=Math.atan2(p.y-e,p.x-t),g=b-_;for(;g>Math.PI;)g-=Math.PI*2;for(;g<-Math.PI;)g+=Math.PI*2;let y=Math.sqrt(d*d+f*f-2*d*f*Math.cos(g)),m=h.r+p.r;if(y>=m)continue;let v=(d+f)/2,$=(m-y)/v*.5*o,k=g>=0?1:-1,x=_-k*$,S=b+k*$;h.x=t+Math.cos(x)*d,h.y=e+Math.sin(x)*d,p.x=t+Math.cos(S)*f,p.y=e+Math.sin(S)*f}return c}function Hs(c,t){let{dt:e,maxR:s,rand:i=Math.random}=t,o=c.r/s;if(c.r>=s*.995||c.age>c.span*(.55+1.7*o))return!0;let n=o>.7?.5*Math.pow(o,6):0;return n>0&&i()<n*e}var Ys=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-ring-card ${Ys}`);var xi="4.16.0",be="assist_satellite",$i=["idle","listening","processing","responding"],Ve={size:240,background:"dark",particles:0,particle_size:1,follow_media_player:!0,audio_offset:0,idle_color:"#2e9df5",listening_color:"#00ff88",processing_color:"#ffaa33",responding_color:"#00e5ff",offline_color:"#4a5560",build_entity:"",build_scope:"device",build_dashboard:"",build_page:!1,build_return:"/",build_projects:[],animation:"hubbubb",assistant_name:"Assistant",panel_height:0,panel_fullscreen:!1,panel_bg:"",panel_border:"",panel_text:"",terminal_bg:"",terminal_text:"",honeycomb:!0,tap_message:"Yes?",dock:!0,calendar_path:"/calendar",review_path:"/jarvis-review",review_entity:"sensor.jarvis_review",intro_message:"",todos:!0,todo_entities:[],todo_exclude:[],announce_entity:"",messages_entity:""},Ns=(c,t)=>{let e=Math.round(t*Xs);return e<0||e>=c.length?0:c[e]},mt=16,Xs=50,Ds={idle:"idle_color",listening:"listening_color",processing:"processing_color",responding:"responding_color"},qs={idle:{swirl:.95,bright:1.75,radius:0,amp:1,turb:.4,sweep:0,speech:0},listening:{swirl:1.8,bright:1.8,radius:-.012,amp:1.15,turb:.6,sweep:.35,speech:0},processing:{swirl:.95,bright:1.5,radius:0,amp:1,turb:.3,sweep:1,speech:0},responding:{swirl:1.5,bright:1.55,radius:.006,amp:1.15,turb:1,sweep:.12,speech:1},offline:{swirl:.3,bright:.4,radius:-.012,amp:.5,turb:.15,sweep:0,speech:0}},ki=new Set(["tool","out","err","screen","cmd"]),Mi=c=>/^\$ /.test(c)?"l-cmd":/^\+/.test(c)?"l-add":/^- /.test(c)||/^--- /.test(c)?"l-del":/\b(error|errno|failed|failure|fatal|traceback|exception|refused|denied|not found|no such)\b/i.test(c)?"l-err":/\b(warn|warning|deprecat\w+|skipped)\b/i.test(c)?"l-warn":/^(Edit|Write|Read|Grep|Glob|Agent|Task|WebFetch|WebSearch|TodoWrite|Skill)\b/.test(c)?"l-tool":"",Ai=/`([^`\n]+)`|\*\*([^*\n]+)\*\*/g,Ke=(c,t,e)=>c.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),Si={1:"can't reach Home Assistant",2:"invalid authentication",3:"connection lost \u2014 reconnecting",4:"no Home Assistant host",5:"https/http mismatch"};var Eo=Math.PI/180,H=(c,t,e)=>Math.min(e,Math.max(t,c)),Qe=c=>Math.round(c*100)/100,Gt=c=>{let t=c>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},Ti=c=>{let t=(1+Math.sqrt(5))/2,e=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(([a,l,h])=>{let p=Math.hypot(a,l,h);return[a/p,l/p,h/p]}),s=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=new Map,o=(a,l)=>{let h=a<l?`${a}_${l}`:`${l}_${a}`,p=i.get(h);if(p!==void 0)return p;let[d,f,_]=e[a],[b,g,y]=e[l],m=(d+b)/2,v=(f+g)/2,$=(_+y)/2,k=Math.hypot(m,v,$);return e.push([m/k,v/k,$/k]),i.set(h,e.length-1),e.length-1};for(let a=0;a<c;a++){let l=[];for(let[h,p,d]of s){let f=o(h,p),_=o(p,d),b=o(d,h);l.push([h,f,b],[p,_,f],[d,b,_],[f,_,b])}s=l}let n=new Set,r=[];for(let a of s)for(let l=0;l<3;l++){let h=a[l],p=a[(l+1)%3],d=h<p?h*1e5+p:p*1e5+h;n.has(d)||(n.add(d),r.push(h,p))}return{verts:e,edges:r}},Ge=Ti(3),ji=(()=>{let c=Gt(11073),t=Ge.verts.length,e=[];for(let s=0;s<16;s++)e.push({v:Math.floor(c()*t),tw:.5+c()*1.6,ph:c()*6.28});return e})(),Pt=96,Fs=.55,Ws=.45,ge=[{r:.625,amp:.068,thick:.007,rev:-.8,share:.21,glow:.72},{r:.655,amp:.075,thick:.008,rev:-.8,share:.21,glow:.85},{r:.845,amp:.082,thick:.009,rev:1,share:.3,glow:1.2},{r:.875,amp:.09,thick:.008,rev:1,share:.28,glow:1.4}],lt=[{r:.905,w:.06,share:.5,dir:1,rows:9},{r:.83,w:.022,share:.35,dir:-1,rows:5},{r:.795,w:.004,share:.15,dir:1,rows:2}],J=360,_e=[3,4,5,6,7,9,11,13],me=[1,2,3,4,5,7],Vs=900,Qt={fold:.4,burst:.9,settle:2.4,word:2.6,wordHold:3.8,wordGone:4.6,wordEnd:5,icons:5.3,iconStep:.75,clock:9.3,clockEnd:12,imp:12.2,impEnd:15,down:18.4,dot:18.8,reactor:19.2,back:21.6,end:25},Ei=[[.9,"Allow me to introduce myself."],[2.6,"I am {name}, a virtual artificial intelligence,"],[5.3,"and I'm here to assist you with a variety of tasks as best I can,"],[9.3,"24 hours a day, 7 days a week."],[12.2,"Importing all preferences from home interface."],[16,"Systems are now fully operational."],[22,"Let me know how I can assist."]],Ci=.35,Pi=1.2,Rt=128,Ri=(()=>{let c=Gt(51729),t=[];for(let e=0;e<5;e++)t.push({a:c()*Math.PI*2,w:(.08+c()*.22)*(e%2?-1:1),sg:.2+c()*.3,h:.6+c()*.7,f:.25+c()*.6,ph:c()*Math.PI*2});return t})(),Js=(()=>{let t=Math.sqrt(3)*5,e=(s,i)=>{let o="";for(let n=0;n<6;n++){let r=n*60*Math.PI/180;o+=`${n===0?"M":"L"}${Qe(s+5*Math.cos(r))} ${Qe(i+5*Math.sin(r))}`}return o+"Z"};return[e(0,0),e(3*5,0),e(0,t),e(3*5,t),e(1.5*5,t/2)].join("")})(),zt={w:15,h:Qe(Math.sqrt(3)*5)},Ks=.62,Qs=3e3,Ii=1e12,zi=c=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${zt.w}" height="${zt.h}" viewBox="0 0 ${zt.w} ${zt.h}"><path d="${Js}" fill="none" stroke="${c}" stroke-width="0.35"/></svg>`)+'")',Gs=c=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c).trim());if(t){let s=t[1];s.length===3&&(s=s.split("").map(o=>o+o).join(""));let i=parseInt(s,16);return[i>>16&255,i>>8&255,i&255]}let e=/rgba?\(([^)]+)\)/i.exec(String(c));if(e){let s=e[1].split(",").map(i=>parseFloat(i));return[s[0]|0,s[1]|0,s[2]|0]}return[53,224,255]},It=class extends ut{set hass(t){var p,d,f,_,b,g,y,m,v;if(this._hass=t,!this._config)return;this._linked||(this._linked=!0,this._openLinked());let e=(p=t==null?void 0:t.states)==null?void 0:p[this._config.entity],s=e?e.state:"unavailable",i=this._state;if(s!==this._state&&(this._state=s),this._config.build_entity&&this._config.build_scope==="global"){let $=((f=(d=t==null?void 0:t.states)==null?void 0:d[this._config.build_entity])==null?void 0:f.state)==="on";this._config.build_page?(this._entityOn&&!$&&this._navigate(this._config.build_return),this._entityOn=$):$!==this._build&&this._setBuild($,!1)}this._listenForSpeech(t),this._watchTodos(t),this._reviewEl&&((_=this._sheet)==null?void 0:_.kind)==="review"&&(this._reviewEl.hass=t);let o=(b=t==null?void 0:t.states)==null?void 0:b[this._config.announce_entity],n=o?o.state==="on":null;n!==this._announce&&(this._announce=n);let r=(g=t==null?void 0:t.states)==null?void 0:g[this._config.messages_entity],a=r?r.state==="on":null;a!==this._messages&&(this._messages=a);let l=this._config.follow_media_player?this._resolveMediaPlayer(t):null,h=l?(m=(y=t==null?void 0:t.states)==null?void 0:y[l])==null?void 0:m.state:void 0;h!==this._mp&&(this._mp=h),this._audioSync(l?(v=t==null?void 0:t.states)==null?void 0:v[l]:null),this._state==="responding"&&i!=="responding"&&this._grabTtsUrl(),this._sessTimer||(this._sessTimer=setInterval(()=>this._pollSessions(),12e3),this._pollSessions())}_trackDone(t){this._unread||(this._unread=new Set(this._recall("unread",24*3600*1e3)||[]),this._wasBusy=new Map);let e=new Set;for(let i of t){e.add(i.id);let o=this._build&&this._sel===i.id;i.busy||o?this._unread.delete(i.id):this._wasBusy.get(i.id)&&this._unread.add(i.id),this._wasBusy.set(i.id,!!i.busy),i.done=this._unread.has(i.id)}for(let i of[...this._unread])e.has(i)||this._unread.delete(i);for(let i of[...this._wasBusy.keys()])e.has(i)||this._wasBusy.delete(i);let s=[...this._unread].sort().join(",");return s!==this._unreadKey&&(this._unreadKey=s,this._store("unread",[...this._unread])),t}_settle(t,e){JSON.stringify(e)!==JSON.stringify(this[t])&&(this[t]=e)}async _pollSessions(){if(!(this._build||this._onScreen===!1||!this._hass))try{let t=await this._api("agent_status");this._settle("_sessions",this._trackDone(t.sessions||[])),t.projects&&this._settle("_projects",t.projects)}catch(t){}}_resolveMediaPlayer(t){var i,o,n;if(this._config.media_player)return this._config.media_player;if(this._mpResolved!==void 0)return this._mpResolved;let e=null,s=(o=(i=t==null?void 0:t.entities)==null?void 0:i[this._config.entity])==null?void 0:o.device_id;if(s&&t.entities){for(let r in t.entities)if(r.startsWith("media_player.")&&t.entities[r].device_id===s){e=r;break}}if(!e){let a=`media_player.${this._config.entity.split(".")[1].replace(/_assist_satellite$/,"")}_media_player`;(n=t==null?void 0:t.states)!=null&&n[a]&&(e=a)}return this._mpResolved=e,e}_effectiveState(){if(this._voiceState)return this._voiceState==="responding"&&this._envEl&&!this._envEl.currentTime?"processing":this._voiceState;let t=$i.includes(this._state)?this._state:"offline",e=this._speechRaw(t);return this._speaking(e)?"responding":e||t==="responding"?"processing":t}_speechRaw(t){let e=this._mp;return e==="playing"?t!=="listening":e==="idle"||e==="paused"?!1:t==="responding"}_speaking(t){var i;let e=Math.max(0,-(Number(this._config.audio_offset)||0));if(!e)return t;let s=performance.now()/1e3;return t!==this._spkRaw&&(this._spkRaw=t,this._spkAt=s),s-((i=this._spkAt)!=null?i:-1e9)<e?!t:t}get hass(){return this._hass}get _name(){var t;return((t=this._config)==null?void 0:t.assistant_name)||"Assistant"}setConfig(t){if(!t||!t.entity)throw new Error("hubbubb-ring-card: you need to define an `entity`");if(t.entity.split(".")[0]!==be)throw new Error(`hubbubb-ring-card: entity must be in the ${be} domain`);this._config=U(U({},Ve),t),this._particles=null,this._mpResolved=void 0,t.build_page&&this._setBuild(!0,!1),this._hass&&(this.hass=this._hass)}getCardSize(){var t,e;return Math.max(2,Math.ceil(Number((e=(t=this._config)==null?void 0:t.size)!=null?e:240)/50))}getGridOptions(){return{rows:"auto",columns:12,min_rows:2,min_columns:6}}_cardVars(t){let e=this._config,s=o=>Number(o)>0?`${Number(o)}px`:"",i={"--jr-size":`${Number(e.size)}px`,"--jr-color":t,"--jr-panel-h":e.panel_height==="fill"?"100%":s(e.panel_height),"--jr-panel-bg":e.panel_bg,"--jr-panel-border":e.panel_border,"--jr-panel-text":e.panel_text,"--jr-term-bg":e.terminal_bg,"--jr-term-text":e.terminal_text};return Object.entries(i).filter(([,o])=>o).map(([o,n])=>`${o}:${n}`).join(";")}static getConfigElement(){return document.createElement("hubbubb-ring-card-editor")}static getStubConfig(t){var r,a;let e=Object.keys((r=t==null?void 0:t.states)!=null?r:{}),s=l=>{var h;return(h=e.find(p=>p.startsWith("switch.")&&p.endsWith(l)))!=null?h:""},i=s("_build_mode"),n=i.slice(7,-11).split("_").filter(Boolean).map(l=>l[0].toUpperCase()+l.slice(1)).join(" ");return U(U(U(U({type:"custom:hubbubb-ring-card",entity:(a=e.find(l=>l.split(".")[0]===be))!=null?a:""},n&&{assistant_name:n}),i&&{build_entity:i}),s("_agent_announcements")&&{announce_entity:s("_agent_announcements")}),s("_message_watch")&&{messages_entity:s("_message_watch")})}connectedCallback(){var t,e,s,i,o;super.connectedCallback(),this._onVisibility=()=>this._pump(),(t=document.addEventListener)==null||t.call(document,"visibilitychange",this._onVisibility),this._onHide=()=>{this._saveDraft(),this._saveQueue()},(e=window.addEventListener)==null||e.call(window,"pagehide",this._onHide),this._onFirstTap=()=>this._unlockSpeech(),(s=this.addEventListener)==null||s.call(this,"pointerdown",this._onFirstTap,{once:!0}),this._onActivity=()=>this._lastTouch=Date.now(),(i=window.addEventListener)==null||i.call(window,"pointerdown",this._onActivity,!0),(o=window.addEventListener)==null||o.call(window,"keydown",this._onActivity,!0),this._restoreQueue(),this._build&&this._setBuild(!0,!1)}disconnectedCallback(){var t,e,s,i,o,n,r;for(let a of this._speechUnsubs||[])try{a()}catch(l){}this._speechUnsubs=[],this._speechSub=!1,this._onActivity&&((t=window.removeEventListener)==null||t.call(window,"pointerdown",this._onActivity,!0),(e=window.removeEventListener)==null||e.call(window,"keydown",this._onActivity,!0),this._onActivity=null),this._onFirstTap&&((s=this.removeEventListener)==null||s.call(this,"pointerdown",this._onFirstTap),this._onFirstTap=null),super.disconnectedCallback(),this._saveDraft(),this._saveQueue(),this._lockScroll(!1),(i=document.removeEventListener)==null||i.call(document,"visibilitychange",this._onVisibility),(o=window.removeEventListener)==null||o.call(window,"pagehide",this._onHide),this._stop(),this._stopPolling(),this._stopLocalVoice(),clearInterval(this._sessTimer),this._sessTimer=null,(n=this._io)==null||n.disconnect(),(r=this._ro)==null||r.disconnect(),this._io=this._ro=null,this._canvas=null,this._ctx=null}_navigate(t){!t||location.pathname.startsWith(t.split("?")[0])||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")))}_listenForSpeech(t){if(this._speechSub||!(t!=null&&t.connection))return;this._speechSub=!0;let e=i=>i.then(o=>(this._speechUnsubs||(this._speechUnsubs=[])).push(o)).catch(()=>{for(let o of this._speechUnsubs||[])try{o()}catch(n){}this._speechUnsubs=[],this._speechSub=!1}),s=i=>{var r,a;let o=(r=i==null?void 0:i.data)==null?void 0:r.message,n=(a=i==null?void 0:i.data)==null?void 0:a.device;if(o){if(n){n===this._deviceId()&&this._speakHere(o);return}this._electAndSpeak(o)}};e(t.connection.subscribeEvents(s,"hubbubb_home_message")),e(t.connection.subscribeEvents(s,"jarvis_claude_message")),e(t.connection.subscribeEvents(i=>{let o=it(U({},(i==null?void 0:i.data)||{}),{at:Date.now()}),n=this._claims||(this._claims=[]);for(n.push(o);n.length&&n[0].at<o.at-Qs;)n.shift()},"hubbubb_home_claim"))}_deviceId(){if(this._device)return this._device;let t=()=>Math.random().toString(36).slice(2,12);try{this._device=localStorage.getItem("jrc:device")||t(),localStorage.setItem("jrc:device",this._device)}catch(e){this._device=t()}return this._device}async _electAndSpeak(t){let e={idle:this._lastTouch?Date.now()-this._lastTouch:Ii,tie:Math.random()};try{await this._hass.connection.sendMessagePromise({type:"fire_event",event_type:"hubbubb_home_claim",event_data:e})}catch(n){return this._speakHere(t)}await new Promise(n=>setTimeout(n,1200));let s=Date.now()-Qs;(this._claims||[]).filter(n=>n.at>=s).reduce((n,r)=>r.idle<n.idle||r.idle===n.idle&&r.tie<n.tie?r:n,e).tie===e.tie&&this._speakHere(t)}_unlockSpeech(){if(this._speechAudio)return;let t=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");t.play().catch(()=>{}),this._speechAudio=t}async _ttsUrl(t){let e=this._hass;if(!this._ttsCfg){let o=await e.callWS({type:"assist_pipeline/pipeline/list"}),n=(o==null?void 0:o.pipelines)||[],r=n.find(a=>a.id===o.preferred_pipeline)||n[0];if(!(r!=null&&r.tts_engine))return null;this._ttsCfg={engine_id:r.tts_engine,language:r.tts_language,voice:r.tts_voice}}let s=this._ttsCfg,i=await e.callApi("POST","tts_get_url",U({engine_id:s.engine_id,message:t,language:s.language},s.voice?{options:{voice:s.voice}}:{}));return(i==null?void 0:i.path)||(i==null?void 0:i.url)||null}async _speakHere(t){if(!(!this._hass||!t))try{let s=await this._ttsUrl(t);if(!s)return;let i=this._speechAudio||(this._speechAudio=new Audio);this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null);try{let n=await(await fetch(s)).arrayBuffer();this._speechBlob=URL.createObjectURL(new Blob([n],{type:"audio/mpeg"})),i.src=this._speechBlob}catch(o){i.src=s}i.onended=()=>{this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null)},await i.play().catch(()=>{this._toast("Tap anywhere to let it speak here.")})}catch(s){}}_toggleAnnounce(){this._toggleHelper(this._config.announce_entity,"_announce",`${this._name} finishes: spoken on the puck`,`${this._name} finishes: phone only`)}_toggleMessages(){this._toggleHelper(this._config.messages_entity,"_messages","Hubbubb messages: read out as they arrive","Hubbubb messages: quiet")}_toggleHelper(t,e,s,i){let o=this[e]===!0;this[e]=!o,this._hass.callService("homeassistant",o?"turn_off":"turn_on",{entity_id:t}),this._toast(o?i:s)}_setBuild(t,e=!0){if(e&&this._config.build_entity&&this._hass&&this._config.build_scope==="global"&&this._hass.callService("homeassistant",t?"turn_on":"turn_off",{entity_id:this._config.build_entity}),this._config.build_dashboard){let s=this._build;this._build=t,t&&(e||s===!1)&&this._navigate(this._config.build_dashboard);return}if(this._config.build_page&&!t){this._navigate(this._config.build_return);return}this._build=t,t?(this._err="",this._sideW=this._recall("sidew",365*864e5)||0,this._loadModels(),this._poll(!0),this._startPolling(),!this._vvHandler&&window.visualViewport&&(this._vvHandler=()=>this._vvSync(),window.visualViewport.addEventListener("resize",this._vvHandler),window.visualViewport.addEventListener("scroll",this._vvHandler)),this._vvSync(),this._lockScroll(!0)):(this._stopPolling(),this._lockScroll(!1),this._sel=null,this._msgs=null,this._ask=null,this._activity=null,this._screen=null,this._suggestion=null,this._suggestion=null,this._permission=null,this._confirmKill=null,this._picking=!1,this._details=!1,this._view=null,this._swipe=null,this._vvHandler&&window.visualViewport&&(window.visualViewport.removeEventListener("resize",this._vvHandler),window.visualViewport.removeEventListener("scroll",this._vvHandler),this._vvHandler=null))}_lockScroll(t){var i;if(!((i=this._config)!=null&&i.build_page))return;let e=document.documentElement,s=document.body;s&&(t?(this._prevOverflow===void 0&&(this._prevOverflow=s.style.overflow,this._prevOverscroll=e.style.overscrollBehavior,this._prevHtmlOverflow=e.style.overflow),s.style.overflow="hidden",e.style.overflow="hidden",e.style.overscrollBehavior="none"):this._prevOverflow!==void 0&&(s.style.overflow=this._prevOverflow,e.style.overflow=this._prevHtmlOverflow,e.style.overscrollBehavior=this._prevOverscroll,this._prevOverflow=this._prevOverscroll=void 0,this._prevHtmlOverflow=void 0))}_syncCorner(t){window.innerWidth!==this._vvW&&(this._vvW=window.innerWidth,this._vvMax=t),this._vvMax=Math.max(this._vvMax||0,t);let e=t>=this._vvMax-4;this.style.setProperty("--jr-botr",e?"56px":"16px")}_vvSync(){let t=window.visualViewport;if(!t)return;let e=Math.round(t.height),s=Math.round(t.offsetTop),i=e!==this._vvH;i&&(this._vvH=e,this.style.setProperty("--jr-vvh",`${e}px`),this._syncCorner(e)),(i||this._vvT==null)&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`),i&&this._settlePin());let o=this._vvPrev==null?0:Math.abs(e-this._vvPrev),n=this._vvPrev==null;if(this._vvPrev=e,!n&&o<12)return;let r=this._growCap();r!==this._lastCap&&(this._lastCap=r,this._autoGrow(this._composerEl())),this._stick&&this._toBottom()}_settlePin(){clearTimeout(this._settleA),clearTimeout(this._settleB);let t=()=>{this._unscroll();let e=window.visualViewport;if(!e)return;let s=Math.round(e.offsetTop);s!==this._vvT&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`))};requestAnimationFrame(t),this._settleA=setTimeout(t,200),this._settleB=setTimeout(t,500)}_unscroll(){if(!this._build)return;window.scrollTo(0,0),document.scrollingElement&&(document.scrollingElement.scrollTop=0);let t=this.parentNode;for(;t;)t.scrollTop>0&&(t.scrollTop=0),t=t.parentNode||t.host}_startPolling(){let t=this._sel?600:1500;this._pollTimer&&this._pollMs===t||(this._pollTimer&&clearInterval(this._pollTimer),this._pollMs=t,this._pollTimer=setInterval(()=>this._poll(),t))}_stopPolling(){this._pollTimer&&clearInterval(this._pollTimer),this._pollTimer=null,this._pollMs=null}_errText(t){return typeof t=="number"?Si[t]||`websocket error ${t}`:String((t==null?void 0:t.message)||t)}async _api(t,e={}){var n,r,a;let s=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=(n=s==null?void 0:s.response)==null?void 0:n.content;if(typeof i=="string")try{i=JSON.parse(i)}catch(l){}let o=(a=(r=s==null?void 0:s.response)==null?void 0:r.status)!=null?a:0;if(o<200||o>=300||(i==null?void 0:i.ok)===!1)throw new Error((i==null?void 0:i.detail)||(i==null?void 0:i.error)||`HTTP ${o}`);return i||{}}async _poll(t=!1){var e;if(!(!this._build||!this._hass)){if(this._polling){this._pollAgain=!0;return}this._polling=!0;try{let s=this._sel;this._tick=(this._tick||0)+1;let i=t||this._tick%5===1,[o,n]=await Promise.all([i?this._api("agent_status"):null,s?this._api("agent_transcript",{id:s,have:this._msgs==null?0:this._tbytes||0}):null]);if(o){if(this._settle("_sessions",this._trackDone(o.sessions||[])),this._settle("_projects",o.projects||[]),this._sel&&!this._sessions.some(a=>a.id===this._sel))this._sel=null,this._msgs=null,this._store("sel",null);else if(!this._sel&&!this._restored){this._restored=!0;let a=this._recall("sel",12*3600*1e3);a&&this._sessions.some(l=>l.id===a)&&this._select(a)}}let r=s&&s===this._sel?n:null;if(this._sel&&!r&&(r=await this._api("agent_transcript",{id:this._sel,have:this._msgs==null?0:this._tbytes||0})),this._sel&&r){let a=r;this._tbytes=a.bytes||0;let l=a.messages;l!=null&&!this._sameMsgs(l,this._msgs)&&(this._msgs=l),this._activity=a.activity||null,this._screen=a.screen||null,this._suggestion=a.suggestion||null,this._permission=a.permission||null;let h=a.ask?JSON.stringify(a.ask.options.map(p=>p.label)):null;if(h!==this._askSig&&(this._askSig=h,this._askSent=null),this._settle("_ask",a.ask||null),this._ask&&this._ask.multi&&(this._askSent=null),(e=this._queue)!=null&&e.length){let p=(this._msgs||[]).filter(_=>_.role==="user").map(_=>Ne(_.text)),d=_=>{let b=Ne(_.text);return b&&p.includes(b)},f=this._queue.length;this._queue=this._queue.filter(_=>_.state!=="sent"||!d(_)&&Date.now()-_.at<12e4),this._queue.length!==f&&this._saveQueue()}}this._err=""}catch(s){this._err=this._errText(s)}if(this._polling=!1,this._pollAgain)return this._pollAgain=!1,this._poll();this._drainQueue()}}_drainQueue(){var s;if(!this._sel||this._pending)return;let t=(this._queue||[]).filter(i=>i.id===this._sel);if(t.some(i=>i.state==="sent"))return;let e=t.find(i=>i.state==="held");e&&((s=(this._sessions||[]).find(i=>i.id===this._sel))!=null&&s.busy||this._dispatch(e))}_select(t){var e;if(this._sel&&this._sel!==t&&this._saveDraft(),this._sel=t,this._restored=!0,t&&((e=this._unread)!=null&&e.delete(t))){this._store("unread",[...this._unread]);let s=(this._sessions||[]).find(i=>i.id===t);s&&(s.done=!1)}this._store("sel",t||null),this._msgs=null,this._ask=null,this._askSent=null,this._askSig=void 0,this._activity=null,this._screen=null,this._suggestion=null,this._permission=null,this._model=null,this._startPolling(),this._confirmKill=null,this._details=!1,this._swipe=null,this._stick=!0,this._poll(!0),t&&this._api("agent_target_window",{id:t}).catch(()=>{})}_store(t,e){try{let s=`jrc:${t}`;e==null?localStorage.removeItem(s):localStorage.setItem(s,JSON.stringify({v:e,at:Date.now()}))}catch(s){}}_gripDown(t){let e=this.renderRoot.querySelector(".side");if(!e)return;t.preventDefault();let s=t.currentTarget,i=t.clientX,o=e.getBoundingClientRect().width,n=this.renderRoot.querySelector(".panel").clientWidth*.6,r=l=>{this._sideW=Math.round(Math.min(n,Math.max(140,o+l.clientX-i)))},a=()=>{s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",a),s.removeEventListener("pointercancel",a),this._store("sidew",this._sideW)};s.setPointerCapture(t.pointerId),s.addEventListener("pointermove",r),s.addEventListener("pointerup",a),s.addEventListener("pointercancel",a)}_recall(t,e){try{let s=localStorage.getItem(`jrc:${t}`);if(!s)return null;let{v:i,at:o}=JSON.parse(s);return!o||Date.now()-o>e?(localStorage.removeItem(`jrc:${t}`),null):i}catch(s){return null}}_body(t){var o;let e=`${t.role}\0${t.text}`,s=(o=this._bodyCache)==null?void 0:o.get(e);if(s)return s;let i=this._bodyParse(t);return this._bodyCache||(this._bodyCache=new Map),this._bodyCache.size>400&&this._bodyCache.delete(this._bodyCache.keys().next().value),this._bodyCache.set(e,i),i}_bodyParse(t){if(ki.has(t.role))return t.text.split(`
`).map(i=>w`<div class="${Mi(i)}">${i||" "}</div>`);if(t.role!=="assistant")return t.text;let e=[],s=0;for(let i of t.text.matchAll(Ai))i.index>s&&e.push(this._linkPaths(t.text.slice(s,i.index))),e.push(i[1]?w`<code>${this._linkPaths(i[1])}</code>`:w`<b>${i[2]}</b>`),s=i.index+i[0].length;return e.push(this._linkPaths(t.text.slice(s))),e}_linkPaths(t){return He(t).map(e=>typeof e=="string"?e:w`<a
            class="flink"
            href="#"
            data-ai="open-file"
            @click=${s=>{s.preventDefault(),this._openFile(e.path,e.line)}}
          >${e.path}${e.line}</a>`)}async _openFile(t,e){var i;let s=e?parseInt(e.slice(1),10):0;this._view={path:t,line:s,loading:!0};try{let o=await this._api("agent_file",{id:this._sel||"",path:t});this._view=it(U({},o),{path:o.path||t,line:s})}catch(o){this._view={path:t,line:s,error:this._errText(o)};return}await this.updateComplete,(i=this.renderRoot.querySelector(".vline.hit"))==null||i.scrollIntoView({block:"center"})}_renderViewer(){let t=this._view,e=t.path.replace(/\/$/,"").split("/").pop()||t.path;return w`
      <div class="phead">
        <span class="ptitle" title=${t.path}>${e}${t.line?`:${t.line}`:""}</span>
        <button class="hbtn" data-ai="close-file" @click=${()=>this._view=null}>✕</button>
      </div>
      <div class="vpath">${t.path}</div>
      <div class="vbody">
        ${t.loading?w`<div class="dim pad">Loading…</div>`:t.error?w`<div class="dim pad">${t.error}</div>`:t.image?w`<img class="vimg" src=${t.image} alt=${e} />`:t.dir?t.dir.map(s=>w`<a
                      class="flink vent"
                      href="#"
                      @click=${i=>{i.preventDefault(),this._openFile(`${t.path}/${s}`,"")}}
                    >${s}</a>`):w`<pre class="vtext">${(t.text||"").split(`
`).map((s,i)=>w`<div class="vline ${i+1===t.line?"hit":""}"><span class="vno">${i+1}</span>${s||" "}</div>`)}</pre>`}
        ${t.truncated?w`<div class="dim pad">Showing the first 512 KB.</div>`:A}
      </div>
    `}_sameMsgs(t,e){if(!t||!e||t.length!==e.length)return!1;let s=t[t.length-1],i=e[e.length-1];return(s==null?void 0:s.role)===(i==null?void 0:i.role)&&(s==null?void 0:s.text)===(i==null?void 0:i.text)}_toBottom(){let t=0,e=()=>{var i,o;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((o=s.lastElementChild)==null||o.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll()),++t<6&&requestAnimationFrame(e)};requestAnimationFrame(e),clearTimeout(this._bottomT),this._bottomT=setTimeout(()=>{var i,o;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((o=s.lastElementChild)==null||o.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll())},250)}_composerEl(){var t;return(t=this.renderRoot)==null?void 0:t.querySelector(".composer textarea")}_growCap(){var e;let t=this._vvH||((e=window.visualViewport)==null?void 0:e.height)||window.innerHeight;return Math.max(56,Math.min(190,Math.round(t*.32)))}_autoGrow(t){if(!t)return;let e=t.style.height,s=t.scrollTop;t.style.height="auto";let i=Math.min(t.scrollHeight,this._growCap())+"px";return t.style.height=i,t.scrollTop!==s&&(t.scrollTop=s),i!==e}_draftSoon(){clearTimeout(this._draftT),this._draftT=setTimeout(()=>this._saveDraft(),400)}_saveDraft(t=this._sel){var s;if(clearTimeout(this._draftT),!t)return;let e=this._composerEl();e&&this._store(`draft:${t}`,e.value||null),this._store(`files:${t}`,(s=this._files)!=null&&s.length?this._files:null)}_restoreDraft(){if(!this._sel)return;this._files=this._recall(`files:${this._sel}`,12*3600*1e3)||[];let t=this._composerEl();if(!t||t.value)return;let e=this._recall(`draft:${this._sel}`,12*3600*1e3);e&&(t.value=e,this._autoGrow(t))}_saveQueue(){let t=(this._queue||[]).filter(e=>e.state==="held");this._store("queue",t.length?t:null)}_restoreQueue(){let t=this._recall("queue",216e5);Array.isArray(t)&&t.length&&(this._queue=t.map(e=>it(U({},e),{state:"held"})))}async _send(t){var r;t.preventDefault();let e=this._composerEl(),s=e==null?void 0:e.value.trim(),i=this._files||[];if(!s&&!i.length||this._sel==null)return;let o=[...i.map(a=>a.path),s].filter(Boolean).join(" ");e.value="",e.style.height="",this._files=[],this._saveDraft();let n={id:this._sel,text:o,at:Date.now(),state:"held"};this._queue=[...this._queue||[],n],this._saveQueue(),this._stick=!0,(r=(this._sessions||[]).find(a=>a.id===this._sel))!=null&&r.busy||this._dispatch(n)}async _dispatch(t){if(!this._pending){this._pending=!0,t.state="sent",t.at=Date.now(),this._queue=[...this._queue],this._saveQueue();try{await this._api("agent_prompt_direct",{id:t.id,text:t.text,device:this._deviceId()}),t.delivered=!0,this._queue=[...this._queue],this._err=""}catch(e){this._err=this._errText(e),t.state="held",this._queue=[...this._queue],this._saveQueue()}this._pending=!1,this._poll(!0)}}_editQueued(t){let e=this._composerEl();e&&(e.value=e.value.trim()?`${e.value.trim()} ${t.text}`:t.text,this._dropQueued(t),e.focus(),this._autoGrow(e),this._saveDraft())}_dropQueued(t){this._queue=(this._queue||[]).filter(e=>e!==t),this._saveQueue()}async _attach(t){let e=[...t.target.files||[]];return t.target.value="",this._ingest(e)}async _ingest(t){if(!(!t.length||!this._sel)){this._uploading=!0;for(let e of t)try{let{name:s,data:i}=await this._encodeFile(e),o=await this._api("agent_upload",{name:s,data:i});if(!(o!=null&&o.path))throw new Error((o==null?void 0:o.detail)||"upload refused");this._files=[...this._files||[],{name:e.name,path:o.path}],this._err=""}catch(s){this._err=`${e.name}: ${this._errText(s)}`}this._uploading=!1,this._saveDraft()}}_encodeFile(t){let e=i=>new Promise((o,n)=>{let r=new FileReader;r.onerror=()=>n(new Error("could not read that file")),r.onload=()=>o(String(r.result).split(",")[1]||""),r.readAsDataURL(i)});if(!t.type.startsWith("image/"))return e(t).then(i=>({name:t.name,data:i}));let s=1568;return new Promise((i,o)=>{let n=new Image,r=URL.createObjectURL(t);n.onerror=()=>{URL.revokeObjectURL(r),e(t).then(a=>i({name:t.name,data:a}),o)},n.onload=()=>{URL.revokeObjectURL(r);let a=Math.min(1,s/Math.max(n.width,n.height));if(a===1&&t.size<9e5)return e(t).then(h=>i({name:t.name,data:h}),o);let l=document.createElement("canvas");l.width=Math.round(n.width*a),l.height=Math.round(n.height*a),l.getContext("2d").drawImage(n,0,0,l.width,l.height),l.toBlob(h=>{if(!h)return o(new Error("could not encode that image"));let p=t.name.replace(/\.[^.]+$/,"")+".jpg";e(h).then(d=>i({name:p,data:d}),o)},"image/jpeg",.85)},n.src=r})}_dropFile(t){this._files=(this._files||[]).filter(e=>e!==t),this._saveDraft()}_renderAsk(t){let e=!!t.multi,s=!e&&!!this._askSent;return w`<div class="askbox ${s?"answered":""}">
      ${t.header||t.total>1||e?w`<div class="askhead">
            ${t.header?w`<span class="askchip">${t.header}</span>`:A}
            ${t.total>1?w`<span class="askstep">Question ${t.index} of ${t.total}</span>`:A}
            ${e?w`<span class="askmulti">Pick any</span>`:A}
          </div>`:A}
      ${t.text?w`<div class="asktext">${t.text}</div>`:A}
      <div class="askopts">
        ${t.options.map(i=>w`<button
            class="askopt ${this._askSent===i.key?"picked":""} ${i.on?"on":""}"
            data-ai="pick-option"
            ?disabled=${s}
            @click=${()=>this._sendKey(i.key,{keepOpen:e})}
          >
            <span class="asknum">${e?i.on?"\u2611":"\u2610":i.key}</span>
            <span class="asklabel"
              >${i.label}
              ${i.desc?w`<span class="askdesc">${i.desc}</span>`:A}</span
            >
            ${!e&&this._askSent===i.key?w`<span class="asktick">✓</span>`:A}
          </button>`)}
      </div>
      <div class="askrow">
        ${s?w`<span class="dim">sending…</span>`:A}
        ${e?w`<button class="asksubmit" data-ai="submit-answer"
                   @click=${()=>this._sendKey("Enter")}>Submit</button>`:A}
        <button class="askmini" @click=${()=>this._sendKey("Escape")}>esc</button>
      </div>
    </div>`}async _sendKey(t,{keepOpen:e=!1}={}){if(this._sel){e||(this._askSent=t);try{await this._api("agent_key",{id:this._sel,key:t}),this._err=""}catch(s){this._err=this._errText(s),this._askSent=null;return}this._poll()}}async _setModel(t){if(!this._sel||this._modelBusy||!t)return;let e=this._model;this._model=t,this._modelBusy=t;try{await this._api("agent_model",{id:this._sel,model:t}),this._err=""}catch(s){this._model=e,this._err=this._errText(s)}this._modelBusy=null,this._poll()}async _setPermission(t){if(!(!this._sel||this._modelBusy||!t)){this._modelBusy="perm";try{let e=await this._api("agent_permission",{id:this._sel,mode:t}),s=e&&(e.mode||e.detail);s&&(this._permission=s),this._err=""}catch(e){this._err=this._errText(e)}this._modelBusy=null,this._poll()}}_renderRunControls(){let t=this._models||[],e=(this._sessions||[]).find(n=>n.id===this._sel),s=this._permission||"",i=(e==null?void 0:e.modes)||this._modes||["auto","manual","accept edits","plan"],o=this._model||(e==null?void 0:e.model)||"";return w`<div class="runbar">
      <select
        class="runsel ${this._modelBusy&&this._modelBusy!=="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy||!t.length}
        data-ai="pick-model"
        title="Model for this session"
        .value=${Ue(o)}
        @change=${n=>this._setModel(n.target.value)}
      >
        <option value="" disabled>${t.length?"Model":"\u2026"}</option>
        ${t.map(n=>w`<option value=${n.id}>${n.id==="local"?"Local":n.name}</option>`)}
      </select>
      <select
        class="runsel perm mode-${(s||"unknown").replace(/\s+/g,"-")} ${this._modelBusy==="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy}
        data-ai="pick-permission"
        title="Permission mode"
        .value=${Ue(s)}
        @change=${n=>this._setPermission(n.target.value)}
      >
        <option value="" disabled>mode ?</option>
        ${i.map(n=>w`<option value=${n}>${n}</option>`)}
      </select>
      ${e!=null&&e.busy?w`<button
            type="button"
            class="hbtn stop"
            data-ai="interrupt-turn"
            title="Interrupt this turn (sends Escape)"
            @click=${()=>this._sendKey("Escape",{keepOpen:!0})}
          >Stop</button>`:A}
    </div>`}async _loadModels(){if(!this._models)try{let t=await this._api("agent_models");this._models=t.models||[],this._modes=t.modes||null}catch(t){}}async _killSession(t){if(t){if(this._confirmKill!==t){this._confirmKill=t,clearTimeout(this._confirmT),this._confirmT=setTimeout(()=>this._confirmKill=null,4e3);return}clearTimeout(this._confirmT),this._confirmKill=null;try{await this._api("agent_kill",{id:t}),this._swipe=null,this._store(`draft:${t}`,null),this._queue=(this._queue||[]).filter(e=>e.id!==t),this._saveQueue(),this._sel===t&&(this._sel=null,this._msgs=null,this._store("sel",null)),this._poll(!0)}catch(e){this._err=this._errText(e)}}}_rowTap(t){if(this._swipe===t){this._swipe=null,this._confirmKill=null;return}if(this._swipe){this._swipe=null,this._confirmKill=null;return}this._swiped||this._select(t)}_swipeStart(t,e){var i;let s=(i=t.touches)==null?void 0:i[0];s&&(this._sx=s.clientX,this._sy=s.clientY,this._swiped=!1)}_swipeMove(t,e){var n;let s=(n=t.touches)==null?void 0:n[0];if(!s||this._sx==null)return;let i=s.clientX-this._sx,o=s.clientY-this._sy;Math.abs(o)>Math.abs(i)||(i<-12?(this._swiped=!0,this._swipe!==e&&(this._swipe=e)):i>12&&this._swipe===e&&(this._swiped=!0,this._swipe=null,this._confirmKill=null))}_swipeEnd(){this._sx=this._sy=null,setTimeout(()=>this._swiped=!1,50)}async _newSession(t){this._picking=!1,this._pending=!0;try{let e=await this._api("agent_start_session",{project:t});this._err="",await this._awaitSession(e==null?void 0:e.id)}catch(e){this._err=this._errText(e)}this._pending=!1}async _awaitSession(t){for(let e=0;e<20;e++){await this._poll(!0);let s=(this._sessions||[]).find(i=>t?i.id===t:i.target);if(s)return this._select(s.id),!0;await new Promise(i=>setTimeout(i,600))}return!1}_syncUrl(){var s,i;if((s=this._config)!=null&&s.build_dashboard||(i=this._config)!=null&&i.build_page)return;let t=location.pathname.replace(/\/session\/[^/]+$/,""),e=this._build&&this._sel?`${t}/session/${encodeURIComponent(this._sel)}`:t;e!==location.pathname&&history.replaceState(history.state,"",e+location.search)}_openLinked(){let t=location.pathname.match(/\/session\/([^/]+)$/);t&&(this._restored=!0,this._build||this._setBuild(!0,!1),this._awaitSession(decodeURIComponent(t[1])))}_openAssist(){var e,s,i;let t=(s=(e=this._hass)==null?void 0:e.auth)==null?void 0:s.external;if((i=t==null?void 0:t.config)!=null&&i.hasAssist){t.fireMessage({type:"assist/show"});return}Ke(this,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>customElements.whenDefined("ha-voice-command-dialog"),dialogParams:{pipeline_id:"last_used",start_listening:!0}})}_wakePuck(){var e;let t;try{t=(e=this._hass)==null?void 0:e.callService("assist_satellite","start_conversation",{entity_id:this._config.entity,start_message:this._config.tap_message,preannounce:!1},void 0,!1)}catch(s){return this._openAssist()}Promise.resolve(t).catch(()=>this._openAssist())}async _openMic(){try{let e=(await navigator.mediaDevices.enumerateDevices()).find(s=>s.kind==="audioinput"&&s.label&&!/iphone|ipad|continuity/i.test(s.label));if(e)return await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:e.deviceId}}})}catch(t){}return navigator.mediaDevices.getUserMedia({audio:!0})}async _startLocalVoice(t="converse"){if(this._voice||this._micOpening)return!0;this._micOpening=!0,t==="converse"?this._voiceState="listening":this._dictating=!0;let e;try{e=await this._openMic()}catch(d){return this._voiceState=null,this._dictating=!1,"microphone permission denied"}finally{this._micOpening=!1}let s=e.getAudioTracks()[0];s&&(s.onended=()=>{var d;((d=this._voice)==null?void 0:d.stream)===e&&(this._toast("The microphone disconnected."),this._stopLocalVoice())});let i=window.AudioContext||window.webkitAudioContext,o=new i,n=null;t==="converse"&&(n=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="),n.play().catch(()=>{}));let r=this._voice={mode:t,stream:e,ctx:o,audio:n,proc:null,src:null,handlerId:null,unsub:null},a=this._recall("conv",5*60*1e3);try{r.unsub=await this._hass.connection.subscribeMessage(d=>this._voiceEvent(d),U({type:"assist_pipeline/run",start_stage:"stt",end_stage:t==="dictate"?"stt":"tts",input:{sample_rate:16e3}},a?{conversation_id:a}:{}))}catch(d){return this._stopLocalVoice(),"assist pipeline refused the run"}let l=r.src=o.createMediaStreamSource(e),h=r.proc=o.createScriptProcessor(2048,1,1),p=Bs(o.sampleRate,16e3);return h.onaudioprocess=d=>{if(r.handlerId==null)return;let f=p(d.inputBuffer.getChannelData(0)),_=new Uint8Array(1+f.length*2);_[0]=r.handlerId;let b=new DataView(_.buffer,1);for(let g=0;g<f.length;g++)b.setInt16(g*2,f[g],!0);try{this._hass.connection.socket.send(_)}catch(g){}},l.connect(h),h.connect(o.destination),!0}_voiceEvent(t){var s,i,o,n,r,a,l,h,p,d;let e=this._voice;if(e)switch(t.type){case"run-start":e.handlerId=(o=(i=(s=t.data)==null?void 0:s.runner_data)==null?void 0:i.stt_binary_handler_id)!=null?o:null;break;case"intent-end":{let f=(r=(n=t.data)==null?void 0:n.intent_output)==null?void 0:r.conversation_id;f&&this._store("conv",f);break}case"stt-end":if(e.mode==="dictate"){let f=((l=(a=t.data)==null?void 0:a.stt_output)==null?void 0:l.text)||"",_=(h=this.renderRoot)==null?void 0:h.querySelector(".composer textarea");_&&f&&(_.value=(_.value?_.value.trim()+" ":"")+f,_.focus()),f||this._toast("Didn't catch that."),this._stopLocalVoice()}else this._closeMic(),this._voiceState="processing";break;case"tts-end":{let f=(d=(p=t.data)==null?void 0:p.tts_output)==null?void 0:d.url;if(!f)return this._stopLocalVoice();this._voiceState="responding",e.audio.onended=()=>this._stopLocalVoice(),e.audio.onerror=()=>this._stopLocalVoice(),this._envEl=e.audio,this._envUrl=f,this._env=null,this._decodeAudio(f),e.audio.src=f,e.audio.play().catch(()=>this._stopLocalVoice());break}case"error":e.mode==="dictate"&&this._toast("Didn't catch that."),this._stopLocalVoice();break;case"run-end":this._voiceState!=="responding"&&this._stopLocalVoice();break}}_closeMic(){var e,s,i,o;let t=this._voice;t&&((e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),(i=t.stream)==null||i.getTracks().forEach(n=>n.stop()),(o=t.ctx)==null||o.close().catch(()=>{}),t.proc=t.src=null)}_stopLocalVoice(){var e,s;let t=this._voice;if(t){this._closeMic(),this._dictating=!1;try{(e=t.audio)==null||e.pause()}catch(i){}try{(s=t.unsub)==null||s.call(t)}catch(i){}this._voice=null,this._voiceState=null,this._envEl=null,this._env=null,this._envUrl=null}}_toast(t){Ke(this,"hass-notification",{message:t})}get _canMic(){var t;return!!(window.isSecureContext&&((t=navigator.mediaDevices)!=null&&t.getUserMedia))}async _composerMic(){var e;if(this._voice)return this._voice.mode==="dictate"?this._endSpeech():this._stopLocalVoice();if(!window.isSecureContext||!((e=navigator.mediaDevices)!=null&&e.getUserMedia)){this._toast("Voice input needs the https (Nabu Casa) URL.");return}let t=await this._startLocalVoice("dictate");t!==!0&&this._toast(`Couldn't start voice input (${t}).`)}_endSpeech(){var e,s;let t=this._voice;if(!t||t.handlerId==null)return this._stopLocalVoice();(e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),t.mode==="converse"&&(this._voiceState="processing");try{this._hass.connection.socket.send(new Uint8Array([t.handlerId]))}catch(i){this._stopLocalVoice()}}async _ringTap(){var i,o,n,r,a;if(this._voice)return this._voiceState==="listening"?this._endSpeech():this._stopLocalVoice();if(this._effectiveState()==="responding"){let l=this._resolveMediaPlayer(this._hass);if(l){this._hass.callService("media_player","media_stop",{entity_id:l});return}}let t=(r=(n=(o=(i=this._hass)==null?void 0:i.auth)==null?void 0:o.external)==null?void 0:n.config)==null?void 0:r.hasAssist,e=l=>{if(t)return this._toast(`${l} - listening through the app instead.`),this._openAssist();this._toast(`${l} - waking ${this._name} instead.`),this._wakePuck()};if(!window.isSecureContext)return e("No microphone on a plain-http page");if(!((a=navigator.mediaDevices)!=null&&a.getUserMedia))return e("This browser exposes no microphone");let s=await this._startLocalVoice();s!==!0&&e(`Couldn't use this device's mic (${s})`)}firstUpdated(){this._setupCanvas()}updated(t){this._setupCanvas(),(t.has("_sel")||t.has("_build"))&&this._syncUrl(),t.has("_sel")&&this._sel&&this._restoreDraft(),t.has("_msgs")&&this._stick&&this._toBottom()}_setupCanvas(){var e,s,i;let t=(e=this.renderRoot)==null?void 0:e.querySelector("canvas");if(!t){this._stop(),this._canvas=null;return}if(t!==this._canvas){this._canvas=t;try{this._ctx=t.getContext("2d")}catch(o){this._ctx=null}if(!this._ctx)return;this._t=0,this._waveT=0,this._churnT=0,this._peaks=Ri.map(o=>U({},o)),this._spin=0,this._head=0,this._speech={t:0,next:0,env:0,count:0,syl:null,pulses:[],spikes:[]},this._cur=U({},qs.idle),this._rgb=Gs((i=(s=this._config)==null?void 0:s.idle_color)!=null?i:"#3db4c8"),this._observe()}this._ctx&&(this._measure(),this._pump())}_observe(){var t,e;typeof ResizeObserver!="undefined"&&((t=this._ro)==null||t.disconnect(),this._ro=new ResizeObserver(()=>this._measure()),this._ro.observe(this._canvas)),typeof IntersectionObserver!="undefined"?((e=this._io)==null||e.disconnect(),this._io=new IntersectionObserver(s=>{this._onScreen=s.some(i=>i.isIntersecting),this._pump()}),this._io.observe(this._canvas)):this._onScreen=!0}_measure(){var r,a,l;let t=this._canvas;if(!t||!this._ctx)return;let e=t.clientWidth||Number((r=this._config)==null?void 0:r.size)||240,s=t.clientHeight||e;((l=(a=this._perf)==null?void 0:a.q)!=null?l:1)<.75&&(this._lowDpr=!0);let i=this._lowDpr?1:2,o=H(window.devicePixelRatio||1,1,i);if(this._w===e&&this._h===s&&this._dpr===o&&this._particles)return;let n=!this._particles||this._w!==e;this._w=e,this._h=s,this._dpr=o,t.width=Math.round(e*o),t.height=Math.round(s*o),this._ctx.setTransform(o,0,0,o,0,0),n&&this._buildField()}_buildField(){var r,a;if(((r=this._config)==null?void 0:r.animation)==="jarvis-im3")return this._buildSheetField();let t=Number((a=this._config)==null?void 0:a.particles)||0,e=H(Math.round((this._w||240)*32),9e3,2e4),s=t>0?H(t,0,8e3):e,i=Math.max(400,s),o=Gt(24301),n=new Array(i);for(let l=0;l<i;l++){let h=l*.6180339887%1,p=0;for(let _=ge[0].share;p<ge.length-1&&h>=_;)_+=ge[++p].share;let d=(o()+o()-1)*(o()<.04?4:1),f=(o()+o()-1)*1.05;n[l]={ri:p,lon:o()*Math.PI*2,sinLat:Math.sin(f),cosLat:Math.cos(f),off:d,drift:(o()-.5)*.13,tw:.5+o()*2,ph:o()*Math.PI*2,bobA:.1+o()*.25,bobW:.25+o()*.85,bobP:o()*Math.PI*2,wobA:.006+o()*.02,wobW:.4+o()*1.2,wobP:o()*Math.PI*2,lf:5+o()*7,lt:o()*12,sz:o()<.03?2.1+o()*1.1:.8+o()*.85,halo:o()<.05,br:o()<.04?1:.45+o()*.55}}this._particles=n}_buildSheetField(){var n;let t=Number((n=this._config)==null?void 0:n.particles)||0,e=H(Math.round((this._w||240)*28),5e3,12e3),s=Math.max(400,t>0?H(t,0,26e3):e),i=Gt(6718),o=new Array(s);for(let r=0;r<s;r++){let a=r*.6180339887%1,l=0;for(let f=lt[0].share;l<lt.length-1&&a>=f;)f+=lt[++l].share;let h=lt[l].rows,p=Math.floor(i()*h),d=h>1?-1+2*p/(h-1):0;d+=(i()-.5)*.025,i()<.02&&(d*=1.1+i()*.4),o[r]={si:l,th:Math.floor(i()*Vs)/Vs*Math.PI*2,v:d,n:i()-.5,dr:0,tw:.4+i()*1.8,ph:i()*Math.PI*2,sz:.45+i()*.4,br:i()<.05?1:.4+i()*.5}}this._particles=o}_sheetTables(t,e,s){let i=Math.random,o=()=>({jag:(()=>{let g=new Float32Array(J);for(let m=0;m<J;m++)g[m]=i()*2-1;let y=new Float32Array(J);for(let m=0;m<J;m++)y[m]=(g[(m+J-2)%J]+2*g[(m+J-1)%J]+3*g[m]+2*g[(m+1)%J]+g[(m+2)%J])/9;return Array.from(y)})(),la:_e.map(g=>(i()*2-1)*(.4+i()*.6)/Math.sqrt(g)),lp:_e.map(()=>i()*6.283),ta:me.map(g=>(i()*2-1)*(.5+i()*.5)/Math.sqrt(g)),tp:me.map(()=>i()*6.283)}),n=g=>{let y=g.m>=1?1:g.m*g.m*(3-2*g.m),m=v=>g.a[v].map(($,k)=>$+(g.b[v][k]-$)*y);return{jag:m("jag"),la:m("la"),lp:m("lp"),ta:m("ta"),tp:m("tp")}};this._sheetState||(this._sheetState=lt.map(()=>{let g=o();return{a:g,b:g,m:1,rc:new Float32Array(J),cw:new Float32Array(J)}}),this._crumple=0,this._reseed=0);let r=this._speech,a=0;if(r&&e.speech>.05){if(r.live)a=r.env;else if(r.syl){let g=(r.t-r.syl.start)/r.syl.dur;g>=0&&g<=1&&(a=r.syl.peak*Math.pow(Math.sin(Math.PI*g),.6))}a*=e.speech*1.25}a=Math.max(a,s);let l=a>this._crumple?.08:.2;if(this._crumple+=(a-this._crumple)*(1-Math.exp(-t/l)),this._flowT=(this._flowT||0)+t*(.25+this._crumple*2.2),this._reseed-=t,this._crumple>.15&&this._reseed<=0){for(let g of this._sheetState)g.a=n(g),g.b=o(),g.m=0;this._reseed=.22+i()*.12}let h=Math.min(1.2,this._crumple),p=.003+h*.045,d=.12+h*1.5,f=this._flowT,_=.005*Math.sin(this._t*.35),b=this._t*.15;for(let g=0;g<lt.length;g++){let y=lt[g],m=this._sheetState[g];m.m=Math.min(1,m.m+t/.2);let v=n(m),$=p*(g===2?.5:1),k=d*(g===2?.35:1);for(let x=0;x<J;x++){let S=x/J*6.283185,M=0,E=g===1?-1:1;for(let T=0;T<_e.length;T++)M+=v.la[T]*Math.sin(_e[T]*S+v.lp[T]+E*f*(1+.15*T));let j=.25*Math.sin(2*S+b+g);for(let T=0;T<me.length;T++)j+=v.ta[T]*Math.sin(me[T]*S+v.tp[T]-E*f*(.8+.2*T));m.rc[x]=y.r+_+h*.008+$*M+v.jag[x]*h*.006,m.cw[x]=y.w*(1+h*.3)*Math.cos(j*k)}}return this._sheetState}_audioSync(t){if(!t||t.state!=="playing"){this._env=null,this._envUrl=null;return}let e=t.attributes||{},s=String(e.media_content_id||""),i=/^https?:\/\//.test(s)||s.startsWith("/")?s:null,o=Date.parse(e.media_position_updated_at||t.last_changed||"");this._envAt=Number.isFinite(o)?o:Date.now(),this._envPos=Number(e.media_position)||0,!(!i||i===this._envUrl)&&(this._envUrl=i,this._env=null,i&&!(Number(e.media_duration)>60)&&this._decodeAudio(i))}async _pipelineId(t){var l,h,p,d,f;if(this._pipeId!==void 0)return this._pipeId;this._pipeId=null;let e=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline/list"}),s=await t.connection.sendMessagePromise({type:"assist_pipeline/device/list"}),i=(h=(l=t.entities)==null?void 0:l[this._config.entity])==null?void 0:h.device_id,o=(p=s==null?void 0:s.find(_=>_.device_id===i))==null?void 0:p.pipeline_entity,n=o?(f=(d=t.states)==null?void 0:d[o])==null?void 0:f.state:null,r=(e==null?void 0:e.pipelines)||[],a=r.find(_=>_.name===n)||r.find(_=>_.id===(e==null?void 0:e.preferred_pipeline));return this._pipeId=(a==null?void 0:a.id)||null,this._pipeId}async _grabTtsUrl(){var e,s,i,o;let t=this._hass;if(!(!(t!=null&&t.connection)||this._grabbing)){this._grabbing=!0;try{let n=await this._pipelineId(t);if(!n)return;for(let r=0;r<3;r++){let a=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/list",pipeline_id:n}),l=((a==null?void 0:a.pipeline_runs)||[]).reduce((h,p)=>!h||p.timestamp>h.timestamp?p:h,null);if(l&&Date.now()-Date.parse(l.timestamp)<6e4){let h=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/get",pipeline_id:n,pipeline_run_id:l.pipeline_run_id}),p=(h==null?void 0:h.events)||[];for(let d=p.length-1;d>=0;d--){let f=((e=p[d])==null?void 0:e.type)==="tts-end"&&((o=(i=(s=p[d])==null?void 0:s.data)==null?void 0:i.tts_output)==null?void 0:o.url);if(f){this._envUrl=f,this._env=null,await this._decodeAudio(f);return}}}await new Promise(h=>setTimeout(h,250))}}catch(n){this._pipeId=void 0}finally{this._grabbing=!1}}}async _decodeAudio(t){try{let e=await(await fetch(t)).arrayBuffer(),s=window.AudioContext||window.webkitAudioContext;if(!s)return;let o=await(this._actx||(this._actx=new s)).decodeAudioData(e);if(t!==this._envUrl)return;this._env=Os(o.getChannelData(0),o.sampleRate,Xs)}catch(e){this._env=null}}_audioLevel(){let t=this._env,e=this._envEl;if(e)return e.currentTime?t?Ns(t,e.currentTime):null:0;if(!t||this._mp!=="playing")return null;let s=this._envPos+(Date.now()-this._envAt)/1e3+(Number(this._config.audio_offset)||0);return Ns(t,s)}_sylShapes(t,e){let s=this._speech;s.pulses.push({born:s.t,amp:t}),s.pulses.length>6&&s.pulses.shift();let i=Math.random()*6.283185;s.spikes.push({a:i,sg:.1+Math.random()*.08,h:.06+t*.06,born:s.t,dur:.12+Math.random()*.08},{a:i+(Math.random()-.5)*.6,sg:.22+Math.random()*.18,h:.04+t*.05,born:s.t+.04,dur:e*(.9+Math.random()*.4)}),s.spikes.length>14&&s.spikes.splice(0,s.spikes.length-14)}_speechTick(t){let e=this._speech;e.t+=t;let s=this._audioLevel();if(s!=null){s>.2&&s>(e.last||0)*1.4&&(e.count++,e.syl={start:e.t,dur:.22,peak:s,f:5+s*4},this._sylShapes(s,.22)),e.last=s,e.live=!0;let r=s>e.env?.05:.14;e.env+=(s-e.env)*(1-Math.exp(-t/r)),e.env>1&&(e.env=1);return}if(e.live=!1,e.t>=e.next){let r=.22+Math.random()*.26,a=.5+Math.random()*.5;e.syl={start:e.t,dur:r,peak:a,f:5+Math.random()*4},e.count++;let l=.02+Math.random()*.05;e.count%(5+Math.floor(Math.random()*6))===0&&(l+=.14+Math.random()*.26),e.next=e.t+r+l,this._sylShapes(a,r)}let i=0,o=e.syl;if(o){let r=(e.t-o.start)/o.dur;r>=0&&r<=1&&(i=o.peak*1.2*(.5-.5*Math.cos(2*Math.PI*r)))}let n=i>e.env?.22:.5;e.env+=(i-e.env)*(1-Math.exp(-t/n)),e.env>1&&(e.env=1)}_pulseTable(t){let e=this._ptab||(this._ptab=new Float32Array(Pt));if(e.fill(0),t<.01)return e;let s=this._speech;for(let i of s.pulses){let o=s.t-i.born;if(o>2.4)continue;let n=.58+o*.26,r=i.amp*Math.exp(-o/1)*t;for(let a=0;a<Pt;a++){let l=Fs+a/(Pt-1)*Ws-n;e[a]+=r*Math.exp(-(l*l)/.0055)}}return e}_peakTable(t,e,s){let i=this._ktab||(this._ktab=new Float32Array(Rt));i.fill(0);let o=this._t,n=.05*e.amp+.08*s;for(let a of this._peaks){a.a+=t*a.w*(.6+e.swirl);let l=.35+.65*(.5+.5*Math.sin(o*a.f+a.ph)),h=a.h*l*n;if(h<.002)continue;let p=a.sg*(1-.4*s),d=2*p*p;for(let f=0;f<Rt;f++){let _=f/Rt*6.283185-a.a;_=(_%6.283185+6.283185)%6.283185,_>3.141593&&(_-=6.283185),i[f]+=h*Math.exp(-(_*_)/d)}}let r=this._speech;for(let a=r.spikes.length-1;a>=0;a--){let l=r.spikes[a],h=r.t-l.born;if(h>l.dur+.3){r.spikes.splice(a,1);continue}if(h<0)continue;let p=h<.12?h/.12:1,d=h>l.dur?Math.exp(-(h-l.dur)/.3):1,f=l.h*p*d*e.speech;if(f<.003)continue;let _=2*l.sg*l.sg;for(let b=0;b<Rt;b++){let g=b/Rt*6.283185-l.a;g=(g%6.283185+6.283185)%6.283185,g>3.141593&&(g-=6.283185),i[b]+=f*Math.exp(-(g*g)/_)}}return i}_sprite(t,e,s){let i=t<<16|e<<8|s;if(this._sprKey===i)return this._spr;let o=this._spr||(this._spr=document.createElement("canvas"));o.width=o.height=32;let n=o.getContext("2d");n.clearRect(0,0,32,32);let r=n.createRadialGradient(16,16,0,16,16,16);return r.addColorStop(0,`rgba(${t},${e},${s},0.75)`),r.addColorStop(.4,`rgba(${t},${e},${s},0.3)`),r.addColorStop(1,`rgba(${t},${e},${s},0)`),n.fillStyle=r,n.fillRect(0,0,32,32),this._sprKey=i,o}_segTick(t){var o;if(this._segRot===void 0&&(this._segRot=-Math.PI/2),this._segRot+=t*.019,this._segWave=(this._segWave||0)+t*.5,this._sessions==null)return this._ambientTick(t);let e=this._segMap||(this._segMap=new Map),s=1-Math.exp(-t/.7),i=new Set;for(let n of this._sessions){i.add(n.id);let r=e.get(n.id);r||(r={size:.02,fill:Math.random(),pulse:Math.random()*6.28,rgb:[46,157,245],gone:!1},e.set(n.id,r));let a=n.context_max?H(n.context/n.context_max,0,1):null;r.weight=a!=null?.6+a*3:Math.max(.8,Math.log10((n.bytes||0)+1e4)-3.2),r.fracT=a!=null?a:1,r.frac===void 0&&(r.frac=0),r.busy=!!n.busy,r.done=!!n.done,r.gone=!1}for(let[n,r]of e){if(i.has(n)||(r.gone=!0),r.size+=((r.gone?0:r.weight)-r.size)*s,r.frac+=((r.gone?0:(o=r.fracT)!=null?o:1)-r.frac)*s,r.gone&&r.size<.03){e.delete(n);continue}r.pulse+=t*(r.busy?2.4:.9),r.busy&&(r.fill=(r.fill+t*.3)%1);let a=r.done?[40,226,138]:[46,157,245];for(let l=0;l<3;l++)r.rgb[l]+=(a[l]-r.rgb[l])*s}}_segBand(t){let e=Math.abs(-Math.sin(t)-Math.sin(this._segWave||0));return e>1?0:.5+.5*Math.cos(e*Math.PI)}_wash(t,e,s,i,o,n,r,a){let l=Math.max(2,Math.min(12,Math.ceil((r-n)/.1))),h=(r-n)/l;for(let p=0;p<l;p++){let d=n+p*h,f=Math.min(r,d+h);t.globalAlpha=a*(.5+1.15*this._segBand(d+h/2)),t.beginPath(),t.arc(e,s,o,d,f),t.arc(e,s,i,f,d,!0),t.closePath(),t.fill()}}_drawSegs(t,e,s,i,o,n,r){var b;if(this._sessions==null)return this._drawAmbientSegs(t,e,s,i,o,n,r);let a=6.283185,l=i*.475,h=i*.655,p=(g,y,m,v)=>{t.beginPath(),t.arc(e,s,v,g,y),t.arc(e,s,m,y,g,!0),t.closePath()},d=this._segMap,f=0;if(d)for(let g of d.values())f+=g.size;if(!d||!d.size||f<=0){t.fillStyle=`rgb(${o},${n},${r})`,t.globalAlpha=.05,p(0,a,l,h),t.fill(),t.globalAlpha=1;return}let _=this._segRot;for(let g of d.values()){let y=g.size/f*a,m=Math.min(.035,y),v=_+m/2,$=_+y-m/2;_+=y;let k=$-v;if(k<.004)continue;t.fillStyle=`rgb(${Math.round(g.rgb[0])},${Math.round(g.rgb[1])},${Math.round(g.rgb[2])})`,t.globalAlpha=.035,p(v,$,l,h),t.fill();let x=l+(h-l)*(.18+.82*H((b=g.frac)!=null?b:1,0,1));if(this._wash(t,e,s,l,x,v,$,(g.busy?.22:.1)+(g.done?.07:0)),g.busy){let S=Math.max(.1,k*.35),M=v+g.fill*k,E=14;for(let j=0;j<E;j++){let T=M-j*S/E,C=Math.max(v,T-S/E);if(T<=v)break;t.globalAlpha=.3*Math.pow(1-j/E,1.6),p(C,T,l,x),t.fill()}}}t.globalAlpha=1}_ambientTick(t){let e=this._segs;if(!e){e=this._segs=[],this._segRot=-Math.PI/2;for(let o=0;o<22;o++){let n=Math.random()<.75;e.push({size:.5+Math.random()*1.4,fill:n?1:Math.random()*.7,rate:.12+Math.random()*.3,state:n?"done":"load",doneT:Math.random()*9})}}let s=0,i=0;for(let o of e)o.state==="grow"?s++:o.state==="die"&&i++;if(!s&&e.length<26&&Math.random()<t*.5&&e.splice(Math.floor(Math.random()*(e.length+1)),0,{size:.02,target:.5+Math.random()*1.4,fill:0,rate:.12+Math.random()*.3,state:"grow",doneT:0}),i<2&&e.length>16){let o=null;for(let n of e)n.state==="done"&&n.doneT>8&&(!o||n.doneT>o.doneT)&&(o=n);o&&Math.random()<t*.25&&(o.state="die")}for(let o=e.length-1;o>=0;o--){let n=e[o];n.state==="grow"?(n.size+=t*.5,n.size>=n.target&&(n.size=n.target,n.state="load")):n.state==="load"?(n.fill+=t*n.rate,n.fill>=1&&(n.fill=1,n.state="done",n.doneT=0)):n.state==="done"?n.doneT+=t:(n.size-=t*.12,n.fill=Math.max(0,n.fill-t*.25),n.size<=.02&&e.splice(o,1))}}_drawAmbientSegs(t,e,s,i,o,n,r){let a=this._segs;if(!a||!a.length)return;let l=0;for(let m of a)l+=m.size;if(l<=0)return;let h=i*.475,p=i*.655,d=o*.5+74|0,f=n*.72+48|0,_=r*.8+82|0;t.fillStyle=`rgb(${d},${f},${_})`;let b=(m,v,$,k)=>{t.beginPath(),t.arc(e,s,k,m,v),t.arc(e,s,$,v,m,!0),t.closePath()},g=6.283185,y=this._segRot;for(let m=0;m<a.length;m++){let v=a[m],$=v.size/l*g,k=Math.min(.028,$),x=y+k/2,S=y+$-k/2;y+=$;let M=S-x;if(!(M<.004)&&(this._wash(t,e,s,h,p,x,S,.13),v.fill>.01)){let E=v.state==="done"?.14+.2*Math.exp(-v.doneT/2.2):.34;this._wash(t,e,s,h,p,x,x+M*v.fill,E*.8)}}t.globalAlpha=1}_pump(){this._ctx&&this.isConnected&&this._onScreen!==!1&&!document.hidden?this._start():this._stop()}_start(){if(this._raf)return;this._last=performance.now();let t=e=>{this._raf=requestAnimationFrame(t);let s=e-this._last,i=Math.min(.05,s/1e3);this._last=e,this._perfTick(s),this._draw(i)};this._raf=requestAnimationFrame(t)}_perfTick(t){if(t<=0||t>250)return;let e=this._perf||(this._perf={q:1,acc:0,n:0,hold:40});if(e.hold>0){e.hold--;return}if(e.acc+=t,++e.n<45)return;let s=e.acc/e.n;e.acc=0,e.n=0,s>26&&e.q>.2?this._setQuality(Math.max(.2,e.q*.65)):s<14&&e.q<1&&this._setQuality(Math.min(1,e.q*1.2))}_setQuality(t){let e=this._perf;t!==e.q&&(e.q=t,e.hold=40,this._measure())}_stop(){this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_targets(){let t=this._effectiveState(),e=t==="offline"?this._config.offline_color:this._config[Ds[t]];return{energy:qs[t],rgb:Gs(e)}}_nearestAnchor(t,e,s){let i=s,o=s?Math.hypot(t.x-s.x,t.y-s.y)-s.r*.35:1/0;for(let n of e){let r=Math.hypot(t.x-n.x,t.y-n.y);r<o&&(o=r,i=n)}return i}_bubbleField(t){let e=t*.42;return{core:e,R:e,newR:()=>t*(.03+Math.pow(Math.random(),1.6)*.028),minAnchor:t*.058,maxR:t*.13}}_spawnBubble(t,e,s,i,o){let n=i!=null?i:Math.random()*Math.PI*2,r=o!=null?o:t.newR(),a=t.core+r;return{x:e+Math.cos(n)*a,y:s+Math.sin(n)*a,vx:0,vy:0,r:0,full:r,anchor:r>=t.minAnchor,host:null,held:!0,pop:-1,life:0,roll:Math.random()<.5?-1:1,wob:Math.random()*Math.PI*2,age:0,span:45+Math.random()*70}}_drawBubbles(t){var ot,Y,V,et,Mt,At,St;let e=this._ctx,s=this._w,i=this._h;if(!s||!i)return;let o=s/2,n=i/2,r=Math.min(s,i)/2,{energy:a,rgb:l}=this._targets(),h=1-Math.exp(-t/.55),p=1-Math.exp(-t/.16),d=this._cur;for(let u of Object.keys(a)){let z=u==="speech"&&a[u]<d[u]?p:h;d[u]+=(a[u]-d[u])*z}for(let u=0;u<3;u++)this._rgb[u]+=(l[u]-this._rgb[u])*h;let f=Math.round(this._rgb[0]),_=Math.round(this._rgb[1]),b=Math.round(this._rgb[2]);a.speech>.5&&this._speech.env<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),d.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*h;let g=this._speech,y=.5+.5*Math.sin(g.t*.5+.8*Math.sin(g.t*.21)),m=g.live?.88:.62,v=(m*g.env+(1-m)*y)*d.speech;this._t+=t;let $=d.swirl/1.8,k=Number(this._config.particle_size)||1,x=this._bubbleField(r),S=Math.max(6,Math.round(18*k));if(this._bub&&this._bubHalf&&this._bubHalf!==r){let u=r/this._bubHalf;for(let z of this._bub)z.x=o+(z.x-o)*u,z.y=n+(z.y-n)*u,z.r*=u,z.full*=u,z.vx*=u,z.vy*=u,z.popR&&(z.popR*=u);this._bubHalf=r}if(!this._bub){this._bubHalf=r,this._bub=[];for(let u=0;u<S;u++){let z=Math.min(x.newR()*(1+Math.random()*2.2),x.maxR),P=this._spawnBubble(x,o,n,u/S*Math.PI*2,z);P.r=P.full,P.anchor=P.r>=x.minAnchor,P.age=Math.random()*P.span,this._bub.push(P)}for(let u=0;u<100;u++)De(this._bub,2),qe(this._bub,o,n,x.core),Fe(this._bub,o,n,x.core),We(this._bub,o,n,x.core,2);for(let u of this._bub)u.vx=0,u.vy=0;this._release=0}let M=this._bub;for(let u of M)u.held&&u.pop<0&&(u.anchor=u.r>=x.minAnchor);let E=M.filter(u=>u.anchor&&u.held&&u.pop<0),j=x.core*(1+v*.07+Math.sin(this._t*.22)*.005);for(this._release+=v*t*3.2;this._release>=1;){this._release-=1;let u=M.filter(O=>O.held&&!O.anchor&&O.pop<0&&O.r>O.full*.6),z=u.length>2?u:M.filter(O=>O.held&&O.pop<0&&O.r>O.full*.6);if(z.length<3)break;let P=z[Math.floor(Math.random()*z.length)];P.host=null,P.held=!1,P.life=0;let X=Math.hypot(P.x-o,P.y-n)||1,W=(P.x-o)/X,L=(P.y-n)/X,B=r*(.5+Math.random()*.5);P.vx=W*B-L*r*.12,P.vy=L*B+W*r*.12}let T=r*(.045+$*.11);for(let u of M){u.wob+=t*1.3;let z=(ot=u.dx)!=null?ot:u.x,P=(Y=u.dy)!=null?Y:u.y;if(u.pop>=0){u.pop+=t;continue}if(u.held){if(u.r+=(u.full-u.r)*(1-Math.exp(-t/2)),u.anchor){let B=Math.hypot(u.x-o,u.y-n)||1,O=(u.x-o)/B,F=(u.y-n)/B,st=(j+u.r-B)*5;u.vx+=(O*st-F*T)*t,u.vy+=(F*st+O*T)*t}else{!u.host||!u.host.held||u.host.pop>=0?u.host=this._nearestAnchor(u,E,null):u.host=this._nearestAnchor(u,E,u.host);let B=u.host;if(B){let O=u.x-B.x,F=u.y-B.y,K=Math.hypot(O,F);K<.001&&(O=.1,F=0,K=.1);let st=O/K,Tt=F/K,nt=(B.r+u.r-K)*6,rt=r*.055*u.roll;u.vx+=(st*nt-Tt*rt)*t,u.vy+=(Tt*nt+st*rt)*t}else{let O=Math.hypot(u.x-o,u.y-n)||1,F=j+u.r;u.vx+=(u.x-o)/O*(F-O)*5*t,u.vy+=(u.y-n)/O*(F-O)*5*t}}let L=Math.exp(-t*(u.anchor?5.5:6.5));u.vx*=L,u.vy*=L}else u.life+=t,u.vy-=r*.85*t,u.vx*=Math.exp(-t*.9),u.r*=Math.exp(-t*.16),(u.life>1+Math.random()*.4||u.x<-r||u.x>s+r||u.y<-r)&&(u.pop=0,u.popR=u.r);let X=r*(u.held?.22:1.4),W=Math.hypot(u.vx,u.vy);W>X&&(u.vx=u.vx/W*X,u.vy=u.vy/W*X),u.x+=u.vx*t,u.y+=u.vy*t}De(M,2),qe(M,o,n,j),Fe(M,o,n,j),We(M,o,n,j,2);let C=1-Math.exp(-t/.11);for(let u of M)u.dx===void 0?(u.dx=u.x,u.dy=u.y,u.dr=u.r):(u.dx+=(u.x-u.dx)*C,u.dy+=(u.y-u.dy)*C,u.dr+=(u.r-u.dr)*C);Us(M,{dt:t,rate:.2+$*.15,sizeBias:3,maxRatio:2.1,maxR:x.maxR});for(let u of M)!u.held||u.pop>=0||(u.age+=t*(1+$*.5),Hs(u,{dt:t,maxR:x.maxR})&&(u.held=!1,u.pop=0,u.popR=u.r));for(let u=M.length-1;u>=0;u--)M[u].pop>Ks&&M.splice(u,1);let I=0;for(;I++<1;){let u=M.filter(B=>B.held&&B.pop<0),z=u.filter(B=>Math.hypot(B.x-o,B.y-n)<=j+B.r*1.7),{angle:P,gap:X}=Ls(z,o,n),W=Math.sin(Math.min(X,Math.PI)/2)*j;if(z.length>1&&W<x.newR()*1.4)break;let L=W>x.minAnchor*1.5;if(u.length>=S&&!L||u.length>=S*1.7)break;M.push(this._spawnBubble(x,o,n,P))}e.clearRect(0,0,s,i),e.globalCompositeOperation="lighter";let D=e.createRadialGradient(o-j*.3,n-j*.35,j*.08,o,n,j),q=.34+v*.22;D.addColorStop(0,`rgba(${Math.min(255,f+80)},${Math.min(255,_+80)},${Math.min(255,b+65)},${q})`),D.addColorStop(.6,`rgba(${f},${_},${b},${q*.55})`),D.addColorStop(1,`rgba(${f},${_},${b},0)`),e.fillStyle=D,e.beginPath(),e.arc(o,n,j,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${_},${b},${.3+v*.28})`,e.lineWidth=Math.max(.8,j*.018),e.beginPath(),e.arc(o,n,j*.985,0,Math.PI*2),e.stroke(),e.fillStyle=`rgba(255,255,255,${.13+v*.12})`,e.beginPath(),e.arc(o-j*.36,n-j*.4,j*.14,0,Math.PI*2),e.fill();let Z=M.slice().sort((u,z)=>z.r-u.r);for(let u of Z){let z=(V=u.dx)!=null?V:u.x,P=(et=u.dy)!=null?et:u.y;if(u.pop>=0){let K=Math.min(1,u.pop/Ks),st=u.popR||u.r,Tt=1-Math.pow(1-K,2),Yt=Math.pow(1-K,1.7);if(K<.55){let nt=st*(1-K*.12),rt=e.createRadialGradient(z-nt*.3,P-nt*.35,nt*.1,z,P,nt),Xt=.34*Math.pow(1-K/.55,1.4);rt.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,_+95)},${Math.min(255,b+75)},${Xt})`),rt.addColorStop(1,`rgba(${f},${_},${b},0)`),e.fillStyle=rt,e.beginPath(),e.arc(z,P,nt,0,Math.PI*2),e.fill()}e.strokeStyle=`rgba(${f},${_},${b},${Yt*.3})`,e.lineWidth=Math.max(.4,st*.035*(1-K*.6)),e.beginPath(),e.arc(z,P,st*(1+Tt*.22),0,Math.PI*2),e.stroke();continue}let X=(Mt=u.dx)!=null?Mt:u.x,W=(At=u.dy)!=null?At:u.y,L=((St=u.dr)!=null?St:u.r)*(1+Math.sin(u.wob)*.015);if(L<.6)continue;let B=u.held?1:Math.max(0,1-u.life/2.1),O=(.5+v*.28)*B,F=e.createRadialGradient(X-L*.3,W-L*.35,L*.1,X,W,L);F.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,_+95)},${Math.min(255,b+75)},${O})`),F.addColorStop(.55,`rgba(${f},${_},${b},${O*.7})`),F.addColorStop(1,`rgba(${f},${_},${b},0)`),e.fillStyle=F,e.beginPath(),e.arc(X,W,L,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${_},${b},${(.26+v*.16)*B})`,e.lineWidth=Math.max(.5,L*.045),e.beginPath(),e.arc(X,W,L*.97,0,Math.PI*2),e.stroke(),L>3&&(e.fillStyle=`rgba(255,255,255,${(.26+v*.2)*B})`,e.beginPath(),e.arc(X-L*.34,W-L*.38,L*.17,0,Math.PI*2),e.fill())}e.globalCompositeOperation="source-over"}_draw(t){var Xt,Ye,Xe,Je;let e=this._ctx;if(!e)return;let s=this._config.animation==="jarvis-im3";if(!s&&this._config.animation!=="jarvis-v1")return this._drawBubbles(t);if(!this._particles)return;let i=this._w,o=this._h,n=i/2,r=o/2,a=Math.min(i,o)/2,{energy:l,rgb:h}=this._targets(),p=1-Math.exp(-t/.55),d=1-Math.exp(-t/.16),f=this._cur;for(let N of Object.keys(l)){let R=N==="speech"&&l[N]<f[N]?d:p;f[N]+=(l[N]-f[N])*R}for(let N=0;N<3;N++)this._rgb[N]+=(h[N]-this._rgb[N])*p;let _=Math.round(this._rgb[0]),b=Math.round(this._rgb[1]),g=Math.round(this._rgb[2]);this._t+=t,this._waveT+=t*(.5+f.swirl*.9),this._spin+=t*(.09+f.swirl*.05),this._head+=t*(1.1+f.swirl*1.4),l.speech>.5&&this._cur.speech<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),f.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*p;let y=this._speech,m=.5+.5*Math.sin(y.t*.5+.8*Math.sin(y.t*.21)),v=y.live?.88:.62,$=(v*y.env+(1-v)*m)*f.speech,k=this._speech.syl?this._speech.syl.f:11;this._churnT+=t*(.55+f.swirl*.85+$*.7),this._waveT+=t*$*.8;let x=this._churnT,S=this._pulseTable(f.speech),M=this._peakTable(t,f,$),E=.003+$*.065,j=this._waveT;if(e.clearRect(0,0,i,o),s)return this._drawIm3(t,e,n,r,a,f,$,_,b,g);let T=this._bootScale(t);T!==1&&(e.save(),e.translate(n,r),e.scale(T,T),e.translate(-n,-r));let C=this._t,I=this._waveT,D=this._spin*.6,q=.955,Z=.296,ot=.72+.28*Math.sin(C*.21+1.3)*Math.sin(C*.093+4.1),Y=.012*Math.sin(C*.16+.7),V=a*.38*1.16,et=a*.38*.7,Mt=V*V,At=V-et,St=.92,u=.075;e.fillStyle=`rgb(${_},${b},${g})`;let z=this._sprite(_,b,g),P=this._particles,X=Math.min(P.length,Math.max(400,Math.round(P.length*((Ye=(Xt=this._perf)==null?void 0:Xt.q)!=null?Ye:1))));(!this._mx||this._mx.length<P.length)&&(this._mx=new Float32Array(P.length),this._my=new Float32Array(P.length),this._mr=new Float32Array(P.length),this._mb=new Uint8Array(P.length));let W=this._mx,L=this._my,B=this._mr,O=this._mb,F=0,K=(Je=(Xe=this._perf)==null?void 0:Xe.q)!=null?Je:1,st=1+(1-K)*.6,Tt=K>=.5,Yt=(Number(this._config.particle_size)||1)*H(a/220,.75,1.8)*(1+(1-K)*.35);for(let N=0;N<X;N++){let R=P[N],Q=ge[R.ri],ht=R.lon+D*Q.rev+R.drift*x+R.wobA*(1+$*1)*(Math.sin(x*R.wobW+R.wobP)+.6*Math.sin(x*R.wobW*2.3+R.wobP*2.1)),Zs=Math.cos(ht),ti=Math.sin(ht),we=R.cosLat*Zs,ct=R.sinLat,Jt=R.cosLat*ti,ei=.45*Math.sin(5*ht-I*1.4+ct*2.3)+.3*Math.sin(8*ht+I*1.05-ct*3.1)+.3*Math.sin((we*.9+ct*.32+Jt*.28)*3.1+I*.9)+.2*Math.sin(13*ht-I*2.1+ct*1.8),si=.45*Math.cos(5*ht-I*1.4+ct*2.3)+.3*Math.cos(8*ht+I*1.05-ct*3.1),Ze=.5+.5*Math.sin(ht-x*(.5+R.ri*.13)+R.ri*2.1),ft=ot*(.45+1.3*Ze*Ze)*(f.turb+$*.6);ft>1.1&&(ft=1.1);let ii=Math.sin((we*.7-ct*.6+Jt*.4)*7.3+I*1.8),Zt=ei*(.4+ft)+ii*.38*ft,ts=R.off+R.bobA*(.7+.6*ft)*(Math.sin(x*R.bobW+R.bobP)+.55*Math.sin(x*R.bobW*2.7+R.bobP*1.9)),ye=1-Math.min(1,Math.abs(ts)),es=f.amp*(1+$*.4),at=Q.r+f.radius+Y+$*.015+Q.amp*es*Zt+ts*Q.thick;Zt>.75&&(at+=(Zt-.75)*.04*ft);let Ot=we,Bt=ct*q-Jt*Z,oi=ct*Z+Jt*q,te=Math.sqrt(Ot*Ot+Bt*Bt)||1e-4,Lt=Math.atan2(Bt,Ot),xe=Lt*.15915494%1;xe<0&&(xe+=1);let $e=M[xe*Rt|0];at+=$e*(.35+.65*ye),at+=E*(Q.rev<0?.75:1)*(.5*Math.sin(2*Lt+j*.9)+.35*Math.sin(3*Lt-j*1.3+1.7)+.2*Math.sin(5*Lt+j*2.1+.4));let ee=(C+R.lt)%R.lf;ee/=R.lf,at+=(ee-.5)*.008;let ke=6*ee*(1-ee);ke>1&&(ke=1);let ni=.24+.76*ye*ye,gt=R.br*Q.glow*ni*ke*(.55+.45*Math.abs(Math.sin(C*R.tw*.6+R.ph)))*f.bright;gt*=.68+.32*Math.sin(ht*2.7+x*.45+R.ph*3);let Me=te*te;if(gt*=.09+1.6*Me*Me*Me,gt*=.62+.5*Math.max(0,Zt),gt*=.85+.3*ft,gt*=1+$e*(4+$*6),f.sweep>.01){let G=(Lt-this._head)%6.283185;G<0&&(G+=6.283185),G>3.141593&&(G-=6.283185),gt*=1+Math.exp(-(G*G)/.25)*f.sweep*2.4}let se=0;if(f.speech>.01){let G=(at-Fs)/Ws*(Pt-1);G=G<0?0:G>Pt-1?Pt-1:G|0,se=S[G],at+=se*.07,gt*=1+se*1.1+$*.7}at>St&&(at=St+u*Math.tanh((at-St)/u));let ss=at*a,is=oi*.5+.5,os=R.sz*Yt*(.78+.32*is)*(1+$*.25+se*.5+$e*(.8+$*2)),ns=a*Q.amp*es*si*(.5+ft*.45),ie=ss*Ot-Bt/te*ns,oe=ss*Bt+Ot/te*ns,Ut=1,rs=ie*ie+oe*oe;if(rs<Mt){if(Ut=(Math.sqrt(rs)-et)/At,Ut<.02)continue;Ut*=Ut}let as=H(gt*st*(.45+.65*is)*Ut,0,1);if(R.halo&&Tt){let G=os*8;e.globalAlpha=as*.22,e.drawImage(z,n+ie-G/2,r+oe-G/2,G,G)}let ri=os*.56;W[F]=n+ie,L[F]=r+oe,B[F]=ri,O[F++]=Math.min(mt-1,as*mt|0)}for(let N=0;N<mt;N++){e.beginPath();let R=!1;for(let Q=0;Q<F;Q++)O[Q]===N&&(e.moveTo(W[Q]+B[Q],L[Q]),e.arc(W[Q],L[Q],B[Q],0,6.283185),R=!0);R&&(e.globalAlpha=(N+.5)/mt,e.fill())}e.globalAlpha=1,this._segTick(t),this._drawSegs(e,n,r,a,_,b,g);let nt=a*.38*(1+$*.05),rt=H(f.bright*(1+$*.45),.3,1.9);this._drawGlobe(e,n,r,nt,a,rt,`rgba(220,246,255,${.4*rt})`,`rgba(${_},${b},${g},${.13*rt})`),T!==1&&e.restore()}_drawGlobe(t,e,s,i,o,n,r,a){let l=this._t,h=Math.cos(this._spin),p=Math.sin(this._spin),d=Math.cos(.35),f=Math.sin(.35),_=Ge.verts,b=_.length;(!this._proj||this._proj.length!==b*3)&&(this._proj=new Float64Array(b*3));let g=this._proj;for(let m=0;m<b;m++){let v=_[m],$=v[0]*h+v[2]*p,k=-v[0]*p+v[2]*h,x=v[1]*d-k*f;g[m*3]=e+$*i,g[m*3+1]=s-x*i,g[m*3+2]=v[1]*f+k*d}t.save(),t.beginPath(),t.arc(e,s,i,0,Math.PI*2),t.clip();let y=Ge.edges;for(let m=0;m<2;m++){let v=m===1;t.beginPath();for(let $=0;$<y.length;$+=2){let k=y[$]*3,x=y[$+1]*3;g[k+2]+g[x+2]>0===v&&(t.moveTo(g[k],g[k+1]),t.lineTo(g[x],g[x+1]))}t.strokeStyle=v?r:a,t.lineWidth=Math.max(.35,o*(v?.0032:.0024)),t.stroke()}t.fillStyle="rgba(235,252,255,1)";for(let m of ji){let v=m.v*3;if(g[v+2]<=.15)continue;let $=Math.pow(Math.abs(Math.sin(l*m.tw+m.ph)),6)*n;if($<.04)continue;t.globalAlpha=H($,0,1);let k=Math.max(1,o*.008);t.fillRect(g[v]-k/2,g[v+1]-k/2,k,k)}t.globalAlpha=1,t.restore()}_drawIm3(t,e,s,i,o,n,r,a,l,h){let p=this._t,d=this._im3Boot(t),f=this._sheetTables(t,n,d.burst);if(d.ring>0){e.save(),e.globalAlpha=d.ring,d.scale!==1&&(e.translate(s,i),e.scale(d.scale,d.scale),e.translate(-s,-i)),this._drawSheetFilm(e,s,i,o,n,f,a,l,h),this._drawSheetDots(e,s,i,o,n,f,a,l,h),e.globalAlpha=d.ring,this._drawIm3Rings(e,s,i,o,a,l,h,t);let _=o*.29*(1+r*.04),b=H(n.bright*(1+r*.35),.3,1.9)*d.globe,g=y=>Math.round(y+(255-y)*.35);this._drawGlobe(e,s,i,_,o,b*.5,`rgba(${g(a)},${g(l)},${g(h)},${.15*b})`,`rgba(${a},${l},${h},${.045*b})`),e.globalAlpha=d.ring*d.globe,e.strokeStyle=`rgba(${a},${l},${h},0.55)`,e.lineWidth=Math.max(.8,o*.006),e.beginPath(),e.arc(s,i,_*1.03,0,6.283185),e.stroke(),e.restore()}d.phase&&this._drawIm3Boot(e,s,i,o,d,a,l,h,p)}_drawSheetDots(t,e,s,i,o,n,r,a,l){var S,M,E,j;let h=this._particles;if(!h)return;let p=Math.min(h.length,Math.max(400,Math.round(h.length*((M=(S=this._perf)==null?void 0:S.q)!=null?M:1))));(!this._mx||this._mx.length<h.length)&&(this._mx=new Float32Array(h.length),this._my=new Float32Array(h.length),this._mr=new Float32Array(h.length),this._mb=new Uint8Array(h.length));let d=this._mx,f=this._my,_=this._mr,b=this._mb,g=this._t,y=this._spin*.35,m=(j=(E=this._perf)==null?void 0:E.q)!=null?j:1,v=(Number(this._config.particle_size)||1)*H(i/200,.7,1.8)*(1+(1-m)*.4),$=o.bright/1.6*(1+(1-m)*.7),k=0;for(let T=0;T<p;T++){let C=h[T],I=lt[C.si],D=n[C.si],q=C.th+y*I.dir+C.dr*g,Z=q*.15915494%1;Z<0&&(Z+=1);let ot=Z*J|0,V=(D.rc[ot]+C.v*D.cw[ot]+C.n*.005+.002*Math.sin(g*C.tw+C.ph))*i;d[k]=e+V*Math.cos(q),f[k]=s+V*Math.sin(q),_[k]=C.sz*v*.8;let et=Math.abs(C.v),Mt=et>.9&&et<1.1?1.6:1,At=C.br*$*Mt*(C.si===2?.4:.42)*(.75+.25*Math.sin(g*C.tw*.7+C.ph));b[k++]=Math.min(mt-1,H(At,0,1)*mt|0)}let x=t.globalAlpha;t.globalCompositeOperation="lighter",t.fillStyle=`rgb(${r},${a},${l})`;for(let T=0;T<mt;T++){t.beginPath();let C=!1;for(let I=0;I<k;I++)b[I]===T&&(t.moveTo(d[I]+_[I],f[I]),t.arc(d[I],f[I],_[I],0,6.283185),C=!0);C&&(t.globalAlpha=x*((T+.5)/mt),t.fill())}t.globalCompositeOperation="source-over",t.globalAlpha=x}_drawSheetFilm(t,e,s,i,o,n,r,a,l){let h=t.globalAlpha,p=this._spin*.35,d=J,f=10,_=o.bright/1.6;(!this._fcos||this._fcos.length!==d+1)&&(this._fcos=new Float32Array(d+1),this._fsin=new Float32Array(d+1)),t.globalCompositeOperation="lighter",t.fillStyle=`rgb(${r},${a},${l})`,t.strokeStyle=`rgb(${r},${a},${l})`;for(let b=0;b<lt.length;b++){let g=lt[b],y=n[b],m=p*g.dir,v=this._fcos,$=this._fsin;for(let x=0;x<=d;x++){let S=x/d*6.283185+m;v[x]=Math.cos(S),$[x]=Math.sin(S)}for(let x=0;x<f;x++){t.beginPath();let S=!1;for(let M=0;M<d;M++){let E=M,j=(M+1)%d,C=.03+.11/(Math.abs(y.cw[E])/g.w+.18);if(C>.9&&(C=.9),Math.min(f-1,C/.9*f|0)!==x)continue;let I=(y.rc[E]-y.cw[E])*i,D=(y.rc[E]+y.cw[E])*i,q=(y.rc[j]+y.cw[j])*i,Z=(y.rc[j]-y.cw[j])*i;t.moveTo(e+I*v[M],s+I*$[M]),t.lineTo(e+D*v[M],s+D*$[M]),t.lineTo(e+q*v[M+1],s+q*$[M+1]),t.lineTo(e+Z*v[M+1],s+Z*$[M+1]),t.closePath(),S=!0}S&&(t.globalAlpha=h*_*(x+.5)*(.9/f)*(b===2?.5:.55),t.fill())}let k=g.rows;t.lineWidth=Math.max(.5,i*.0028);for(let x=0;x<k;x++){let S=k>1?-1+2*x/(k-1):0,M=x===0||x===k-1;t.globalAlpha=h*_*(M?.32:.06)*(b===2?1.2:1),t.beginPath();for(let E=0;E<=d;E++){let j=E%d,T=(y.rc[j]+S*y.cw[j])*i;E?t.lineTo(e+T*v[E],s+T*$[E]):t.moveTo(e+T*v[E],s+T*$[E])}t.stroke()}}t.globalCompositeOperation="source-over",t.globalAlpha=h}_drawIm3Rings(t,e,s,i,o,n,r,a){var y;let l=t.globalAlpha,h=`rgb(${o},${n},${r})`;t.strokeStyle=h,t.lineWidth=Math.max(.6,i*.003);for(let[m,v]of[[.4,.16],[.47,.08],[.66,.1]])t.globalAlpha=l*v,t.beginPath(),t.arc(e,s,i*m,0,6.283185),t.stroke();let p=i*.56,d=-this._spin*.5;t.globalAlpha=l*.06,t.lineWidth=Math.max(1,i*.008),t.beginPath();for(let m=0;m<24;m++){let v=d+m*.2618;t.moveTo(e+p*Math.cos(v),s+p*Math.sin(v)),t.arc(e,s,p,v,v+.13)}t.stroke(),this._segTick(a);let f=this._segMap;if(!f||!f.size){t.globalAlpha=l;return}let _=0;for(let m of f.values())_+=m.size;if(_<=0){t.globalAlpha=l;return}let b=i*.6,g=this._segRot;t.lineCap="round";for(let m of f.values()){let v=m.size/_*6.283185,$=Math.min(.06,v*.3),k=g+$/2,x=g+v-$/2;if(g+=v,x-k<.004)continue;let S=`rgb(${Math.round(m.rgb[0])},${Math.round(m.rgb[1])},${Math.round(m.rgb[2])})`;t.strokeStyle=S,t.lineWidth=Math.max(1,i*.006),t.globalAlpha=l*.18,t.beginPath(),t.arc(e,s,b,k,x),t.stroke();let M=H((y=m.frac)!=null?y:1,0,1);t.lineWidth=Math.max(1.4,i*.011),t.globalAlpha=l*(m.busy?.75:.45),t.beginPath(),t.arc(e,s,b,k,k+(x-k)*Math.max(.04,M)),t.stroke()}t.lineCap="butt",t.strokeStyle=h,t.globalAlpha=l}_im3Boot(t){let e=this._boot,s=Qt;if(!e)return{ring:1,scale:1,burst:0,globe:1,phase:null};let i=e.t+=t,o=l=>1-(1-l)**3,n=l=>{let h=H((i-l)/.28,0,1);return{ring:.3+.7*h,scale:.45+.55*o(h),burst:1.2*(1-o(H((i-l)/(s.settle-s.burst),0,1)))}},r=(l,h)=>H(Math.min(i-l,h-i)/.2,0,1),a=1-Math.max(r(s.icons-.1,s.icons+5*s.iconStep),r(s.clock,s.clockEnd),r(s.imp,s.impEnd));if(i<s.fold){let l=i/s.fold;return{ring:1-l*.5,scale:1-.98*l*l,burst:0,globe:1,phase:null}}if(i<s.burst)return{ring:0,scale:1,burst:0,globe:1,phase:null};if(i<s.down){let l=n(s.burst),h=null,p=0;return i>=s.word&&i<s.wordEnd?h="word":i>=s.clock&&i<s.clockEnd?(h="clock",p=(i-s.clock)/(s.clockEnd-s.clock)):i>=s.imp&&i<s.impEnd&&(h="import",p=(i-s.imp)/(s.impEnd-s.imp)),it(U({},l),{globe:a,phase:h,u:p,t:i})}if(i<s.dot){let l=(i-s.down)/(s.dot-s.down);return{ring:1-l*.5,scale:1-.98*l*l,burst:0,globe:1,phase:null}}if(i<s.reactor)return{ring:0,scale:1,burst:0,globe:1,phase:"dot",t:i};if(i<s.back)return{ring:0,scale:1,burst:0,globe:1,phase:"reactor",u:(i-s.reactor)/(s.back-s.reactor),t:i};if(i<s.end){let l=n(s.back);return it(U({},l),{burst:l.burst*.6,globe:1,phase:i<s.back+.35?"reactorOut":null,t:i})}return this._boot=null,{ring:1,scale:1,burst:0,globe:1,phase:null}}_drawIm3Boot(t,e,s,i,o,n,r,a,l){let h=Qt,p=f=>`rgba(${n},${r},${a},${f})`,d=f=>`rgba(${Math.round(n+(255-n)*.5)},${Math.round(r+(255-r)*.5)},${Math.round(a+(255-a)*.5)},${f})`;if(t.save(),o.phase==="dot"){let f=.55+.45*Math.abs(Math.sin((o.t-h.dot)*18));t.fillStyle=d(f),t.beginPath(),t.arc(e,s,Math.max(1.6,i*.012),0,6.283185),t.fill(),t.fillStyle=p(.5*f),t.fillRect(e-i*.07,s+i*.55,i*.14,Math.max(1,i*.006))}else o.phase==="reactor"?this._drawReactor(t,e,s,i,o.u,p,d):o.phase==="reactorOut"?(t.globalAlpha=1-(o.t-h.back)/.35,this._drawReactor(t,e,s,i,1,p,d)):o.phase==="word"?this._drawWordmark(t,e,s,i,o.t-h.word,n,r,a):o.phase==="clock"?this._drawIm3Clock(t,e,s,i,o.u,p,d):o.phase==="import"&&this._drawIm3Import(t,e,s,i,o.u,p,d);t.restore()}_drawIm3Clock(t,e,s,i,o,n,r){let a=H(Math.min(o/.08,(1-o)/.08),0,1);t.globalAlpha=a;let l=i*.5;t.strokeStyle="rgba(235,250,255,0.75)",t.lineWidth=Math.max(1,i*.007),t.beginPath(),t.arc(e,s,l,0,6.283185),t.stroke(),t.strokeStyle="rgba(235,250,255,0.4)",t.lineWidth=Math.max(1,i*.004);let h=-1.5708+o*9;t.beginPath(),t.arc(e,s,l*1.07,h,h+4.2),t.stroke(),t.strokeStyle=n(.45),t.beginPath(),t.moveTo(e-l*1.25,s),t.lineTo(e-l*.92,s),t.moveTo(e+l*.92,s),t.lineTo(e+l*1.25,s),t.stroke();let p=new Date,d=p.getHours(),f=d<12?"AM":"PM";d=d%12||12;let _=`${d}:${String(p.getMinutes()).padStart(2,"0")}`,b=`:${String(p.getSeconds()).padStart(2,"0")}`;if(o<.25){let y=m=>Math.floor(Math.random()*m);(!this._tumble||performance.now()-this._tumble.at>70)&&(this._tumble={at:performance.now(),hm:`${y(12)+1}:${y(6)}${y(10)}`,ss:`:${y(6)}${y(10)}`}),_=this._tumble.hm,b=this._tumble.ss}let g=i*.27;t.fillStyle="rgba(240,252,255,0.95)",t.textBaseline="middle",t.textAlign="right",t.font=`200 ${g}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillText(_,e+i*.2,s),t.textAlign="left",t.font=`500 ${g*.3}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillText(f,e+i*.23,s-g*.2),t.fillText(b,e+i*.23,s+g*.2),t.textAlign="start",t.globalAlpha=1}_drawIm3Import(t,e,s,i,o,n,r){let a=H(Math.min(o/.08,(1-o)/.08),0,1),h=1-(1-H(o/.85,0,1))**2;t.globalAlpha=a,t.lineWidth=Math.max(1.5,i*.012),t.strokeStyle=n(.15),t.beginPath(),t.arc(e,s,i*.5,0,6.283185),t.stroke(),t.strokeStyle=r(.9),t.beginPath(),t.arc(e,s,i*.5,-1.5708,-1.5708+h*6.283185),t.stroke(),t.fillStyle=r(.95),t.textAlign="center",t.textBaseline="middle",t.font=`200 ${i*.2}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillText(`${Math.round(h*100)}%`,e,s+i*.04),t.font=`600 ${i*.045}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillStyle=n(.85),t.fillText(h<1?"IMPORTING PREFERENCES":"PREFERENCES LOADED",e,s-i*.16),t.textAlign="start",t.globalAlpha=1}_drawReactor(t,e,s,i,o,n,r){let l=1-(1-Math.min(1,o/.88))**2,h=i*.2,p=t.globalAlpha,d=40;t.lineWidth=Math.max(2,i*.05);for(let k=0;k<d;k++){let x=-1.5708+k/d*6.283185,S=k/d<l;t.strokeStyle=S?r(.95):n(.12),t.beginPath(),t.arc(e,s,h,x+.02,x+6.283185/d-.03),t.stroke()}t.lineWidth=Math.max(1,i*.006),t.strokeStyle=n(.7);for(let k of[.72,1.32])t.beginPath(),t.arc(e,s,h*k,0,6.283185),t.stroke();let f=t.createRadialGradient(e,s,0,e,s,h*.7);f.addColorStop(0,r(.25+.75*l)),f.addColorStop(1,n(0)),t.fillStyle=f,t.beginPath(),t.arc(e,s,h*.7,0,6.283185),t.fill(),t.strokeStyle=r(.5+.5*l),t.lineWidth=Math.max(1,i*.009),t.beginPath();for(let k=0;k<3;k++){let x=1.5708+k*6.283185/3,S=e+h*.42*Math.cos(x),M=s+h*.42*Math.sin(x);k?t.lineTo(S,M):t.moveTo(S,M)}t.closePath(),t.stroke();let _=i*1.25,b=i*.13,g=e-_/2,y=s+i*.5;t.globalAlpha=p,t.strokeStyle=n(.55),t.lineWidth=1,t.strokeRect(g,y,_,b),t.fillStyle=n(.1),t.fillRect(g,y,_*l,b);let m=Math.max(9,b*.52);t.font=`600 ${m}px "Avenir Next", "Segoe UI", Roboto, sans-serif`,t.textBaseline="middle",t.fillStyle=r(.95),t.textAlign="left",t.fillText("POWER LEVEL",g+b*.4,y+b/2),t.textAlign="right",t.fillText(`${(l*100).toFixed(1)}%`,g+_-b*.4,y+b/2);let v=g+b*.4+t.measureText("POWER LEVEL").width+m*.5,$=g+_-b*.4-t.measureText("100.0%").width-m*.5;t.fillStyle=n(.6);for(let k=v;k<$;k+=m*.45)t.fillRect(k,y+b*.62,1.2,1.2);t.textAlign="start"}_drawWordmark(t,e,s,i,o,n,r,a){let l=Qt,h=(this._name||"JARVIS").toUpperCase();if(!this._wm||this._wm.half!==i||this._wm.name!==h){let S=Math.round(i*.3),M=document.createElement("canvas");M.width=Math.round(i*1.9),M.height=Math.round(S*1.5);let E=M.getContext("2d");E.fillStyle="#fff",E.font=`italic 900 ${S}px "Arial Black", "Helvetica Neue", Arial, sans-serif`,E.textAlign="center",E.textBaseline="middle",E.setTransform(1,0,-.18,1,S*.13,0);let j=E.measureText(h).width;j>M.width*.92&&(E.font=`italic 900 ${Math.round(S*M.width*.92/j)}px "Arial Black", "Helvetica Neue", Arial, sans-serif`),E.fillText(h,M.width/2,M.height/2);let T=E.getImageData(0,0,M.width,M.height).data,C=Math.max(2,Math.round(i/75)),I=[];for(let Y=0;Y<M.height;Y+=C)for(let V=0;V<M.width;V+=C)T[(Y*M.width+V)*4+3]>140&&I.push(V-M.width/2,Y-M.height/2);let D=Gt(935),q=I.length/2,Z=new Float32Array(q*2),ot=new Float32Array(q);for(let Y=0;Y<q;Y++){let V=Math.PI+(D()-.5)*1.4,et=i*(.82+D()*.14);Z[Y*2]=et*Math.cos(V),Z[Y*2+1]=et*Math.sin(V),ot[Y]=D()}this._wm={half:i,name:h,pts:Float32Array.from(I),from:Z,seed:ot,w:M.width}}let{pts:p,from:d,seed:f,w:_}=this._wm,b=f.length,g=l.wordHold-l.word,y=l.wordGone-l.word,m=l.wordEnd-l.word,v=Math.round(n+(255-n)*.45),$=Math.round(r+(255-r)*.45),k=Math.round(a+(255-a)*.45);t.globalCompositeOperation="lighter",t.fillStyle=`rgb(${v},${$},${k})`;let x=Math.max(1,i/130);for(let S=0;S<b;S++){let M=p[S*2],E=p[S*2+1],j=(M/_+.5)*g*.55+f[S]*.12,T=H((o-j)/(g*.42),0,1);T=1-(1-T)**3;let C=d[S*2]+(M-d[S*2])*T,I=d[S*2+1]+(E-d[S*2+1])*T,D=.15+.7*T;if(T>.98&&o<y&&Math.random()<.015&&(C+=(Math.random()-.5)*i*.08),o>y){let q=H((o-y)/(m-y),0,1);C+=C/(Math.abs(C)+1)*q*i*.25*(.4+f[S]),I+=(f[S]-.5)*q*i*.2,D*=1-q}D<.02||(t.globalAlpha=D,t.fillRect(e+C-x/2,s+I-x/2,x,x))}t.globalCompositeOperation="source-over",t.globalAlpha=1}_bootScale(t){let e=this._boot;if(!e)return 1;let s=e.t+=t;if(s<.6)return 1-.98*(s/.6)**2;if(s<1.1)return .02+.012*Math.abs(Math.sin((s-.6)*22));if(s<2.6){let i=(s-1.1)/1.5-1;return .02+.98*(1+2.70158*i*i*i+1.70158*i*i)}return this._boot=null,1}_intro(){if(this._booting)return;this._boot={t:0},this._booting=!0,clearTimeout(this._bootTimer);let t=this._config.animation==="jarvis-im3",e=this._introRun={};this._bootTimer=setTimeout(()=>{this._booting=!1,this._landed=null},t?Qt.end*1e3:6500);let s=this._name,i=h=>{var p;return Promise.resolve((p=this._hass)==null?void 0:p.callService("assist_satellite","announce",{entity_id:this._config.entity,message:h,preannounce:!1}))};if(!t){let h=this._config.intro_message||`Allow me to introduce myself. I am ${s}, a virtual artificial intelligence, and I'm here to assist you with a variety of tasks as best I can, 24 hours a day, 7 days a week. Importing all preferences from home interface. Systems are now fully operational.`;setTimeout(()=>i(h).catch(()=>this._toast(`${s} could not speak the introduction.`)),900);return}this._landed=new Set;let o=Qt;for(let h=0;h<5;h++)setTimeout(()=>this._flyIcon(h,e),(o.icons+h*o.iconStep)*1e3);let n=this._config.intro_message?[[o.burst,this._config.intro_message]]:Ei.map(([h,p])=>[h,p.replace("{name}",s)]),r=this._speechAudio||(this._speechAudio=new Audio);r.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=",r.play().catch(()=>{});let a=this._hasSpeaker().then(h=>{if(!h)return this._toast("Speaking on the puck: this screen has no speaker."),null;let p=n.map(([,d])=>this._fetchSpeech(d));return p.forEach(d=>d.catch(()=>{})),p}),l=performance.now();(async()=>{let h=await a,p=0;for(let d=0;d<n.length;d++){let[f,_]=n[d],b=/^Systems are now/.test(_)?Pi:Ci,g=Math.max(f*1e3,p+b*1e3)-(performance.now()-l);if(g>0&&await new Promise(y=>setTimeout(y,g)),this._introRun!==e)return;if(h)try{await this._playHere(r,await h[d],e),p=performance.now()-l;continue}catch(y){h=null,this._toast(`Speaking on the puck: this screen could not play it (${(y==null?void 0:y.name)||(y==null?void 0:y.message)||"error"}).`)}try{await i(_),p=performance.now()-l}catch(y){this._toast(`${s} could not speak the introduction.`);return}}})()}async _hasSpeaker(){var e,s;let t=navigator.userAgent;if(!/Chrome/.test(t)||/Android|Mobile/.test(t))return!0;try{let i=await((s=(e=navigator.mediaDevices)==null?void 0:e.enumerateDevices)==null?void 0:s.call(e));return!i||i.some(o=>o.kind==="audiooutput")}catch(i){return!0}}async _fetchSpeech(t){let e=await this._ttsUrl(t);if(!e)throw new Error("no voice");let s=await(await fetch(e)).arrayBuffer();return URL.createObjectURL(new Blob([s],{type:"audio/mpeg"}))}async _playHere(t,e,s){this._envEl=t,this._envUrl=e,this._env=null,this._decodeAudio(e),this._voiceState="responding";try{await new Promise((i,o)=>{t.onended=i,t.onerror=()=>o(new Error("playback")),t.src=e,t.play().catch(o)})}finally{URL.revokeObjectURL(e),this._envEl===t&&(this._envEl=null,this._env=null,this._voice||(this._voiceState=null))}}_flyIcon(t,e){let s=()=>{this._landed&&(this._landed=new Set([...this._landed,t]))};if(this._introRun!==e)return;let i=this.shadowRoot,o=i==null?void 0:i.querySelector(".wrap"),n=i==null?void 0:i.querySelector(".ring"),r=i==null?void 0:i.querySelectorAll(".dock button")[t],a=r==null?void 0:r.querySelector("svg");if(!o||!n||!a||!o.animate)return s();let l=o.getBoundingClientRect(),h=n.getBoundingClientRect(),p=a.getBoundingClientRect(),d=30,f=document.createElement("div");f.className="flyicon",f.innerHTML=a.outerHTML;let _=h.left+h.width/2-l.left-d/2,b=h.top+h.height/2-l.top-d/2;f.style.left=`${_}px`,f.style.top=`${b}px`,o.appendChild(f);let g=h.width*.36/d,y=p.width/d,m=p.left+p.width/2-l.left-d/2-_,v=p.top+p.height/2-l.top-d/2-b,$=f.animate([{transform:`translate(0,0) scale(${g*.55})`,opacity:0,offset:0},{transform:`translate(0,0) scale(${g})`,opacity:1,offset:.14},{transform:`translate(0,0) scale(${g})`,opacity:1,offset:.6},{transform:`translate(${m}px,${v}px) scale(${y})`,opacity:1,offset:1}],{duration:900,easing:"cubic-bezier(0.55, 0, 0.3, 1)",fill:"forwards"});$.onfinish=()=>{f.remove(),s()}}async _openSheet(t){var e,s,i;this._sheet={kind:t,items:null,q:""};try{let o=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t==="memories"?"memory_list":"skills",service_data:{},return_response:!0});if(((e=this._sheet)==null?void 0:e.kind)!==t)return;this._sheet=it(U({},this._sheet),{items:((s=o==null?void 0:o.response)==null?void 0:s[t])||[]})}catch(o){((i=this._sheet)==null?void 0:i.kind)===t&&(this._sheet=it(U({},this._sheet),{items:[],err:this._errText(o)}))}}_renderSheet(){let t=this._sheet,e=t.q.trim().toLowerCase(),s=o=>o.replace(/_/g," ").replace(/^\w/,n=>n.toUpperCase()),i=(t.items||[]).filter(o=>!e||`${o.text||""} ${o.name||""} ${o.description||""}`.toLowerCase().includes(e));return w`<div class="sheet ${t.kind}" @click=${o=>o.target===o.currentTarget&&(this._sheet=null)}>
      <div class="sheet-box">
        <div class="sheet-head">
          <span>${t.kind==="memories"?"Memories":t.kind==="todos"?"To-do lists":t.kind==="review"?"Nightly review":`What ${this._name} can do`}</span>
          <button class="sheet-x" title="Close" @click=${()=>this._sheet=null}>×</button>
        </div>
        ${t.kind==="review"?w`<div class="sheet-list review-host">${this._reviewBox}</div>`:t.kind==="todos"?w`<div class="sheet-list">${this._renderTodos()}</div>`:w`        <input
          type="search"
          placeholder="Filter"
          .value=${t.q}
          @input=${o=>this._sheet=it(U({},this._sheet),{q:o.target.value})}
        />
        <div class="sheet-list">
          ${t.items==null?w`<div class="dim pad">Loading…</div>`:t.err?w`<div class="perr">${t.err}</div>`:i.length?i.map(o=>t.kind==="memories"?w`<div class="sheet-row">${o.text}${o.person?w`<em>${o.person}</em>`:A}</div>`:w`<div class="sheet-row"><b>${s(o.name)}</b>${o.description.split(". ")[0].replace(/\.?$/,".")}</div>`):w`<div class="dim pad">Nothing here.</div>`}
        </div>
        ${t.kind==="skills"?w`<div class="dim pad small">Plus everything Home Assistant exposes to ${this._name}: lights, media, climate, scenes and scripts.</div>`:A}
`}
      </div>
    </div>`}_todoIds(t){let e=this._config.todo_entities;if(Array.isArray(e)&&e.length)return e;let s=new Set(this._config.todo_exclude||[]);return Object.keys((t==null?void 0:t.states)||{}).filter(i=>i.startsWith("todo.")&&!s.has(i)).sort()}async _todoCreate(t){var i;t.preventDefault();let e=t.target.querySelector("input"),s=e.value.trim();if(s){e.disabled=!0;try{let o=await this._hass.callApi("POST","config/config_entries/flow",{handler:"local_todo"}),n=await this._hass.callApi("POST",`config/config_entries/flow/${o.flow_id}`,{todo_list_name:s});if((n==null?void 0:n.type)!=="create_entry")throw new Error((n==null?void 0:n.reason)||((i=n==null?void 0:n.errors)==null?void 0:i.base)||"not created");e.value="",this._toast(`${s} list created.`)}catch(o){this._toast(`Couldn't create ${s}: ${this._errText(o)}`)}finally{e.disabled=!1}}}_watchTodos(t){if(this._config.todos===!1||this._config.build_page)return;let e=this._todoIds(t),s=e.map(i=>{var o;return`${i}=${(o=t.states[i])==null?void 0:o.state}`}).join("|");s!==this._todoSig&&(this._todoSig=s,this._loadTodos(e))}async _loadTodos(t){let e=await Promise.all(t.map(async s=>{var n;let i=this._hass.states[s],o=((n=i==null?void 0:i.attributes)==null?void 0:n.friendly_name)||s;if(!i||i.state==="unavailable")return{id:s,name:o,items:[],off:!0};try{let r=await this._hass.callWS({type:"todo/item/list",entity_id:s});return{id:s,name:o,items:((r==null?void 0:r.items)||[]).filter(a=>a.status!=="completed")}}catch(r){return{id:s,name:o,items:[],err:this._errText(r)}}}));this._todos=e}async _todoAdd(t,e){t.preventDefault();let s=t.target.querySelector("input"),i=s.value.trim();if(i){s.value="",this._todos=this._todos.map(o=>o.id===e.id?it(U({},o),{items:[...o.items,{uid:`new-${Date.now()}`,summary:i}]}):o);try{await this._hass.callService("todo","add_item",{item:i},{entity_id:e.id})}catch(o){this._toast(`Could not add ${i} to ${e.name}.`),this._todoSig=null,this._watchTodos(this._hass)}}}async _todoDone(t,e){this._todos=this._todos.map(s=>s.id===t.id?it(U({},s),{items:s.items.filter(i=>i.uid!==e.uid)}):s);try{await this._hass.callService("todo","update_item",{item:e.uid,status:"completed"},{entity_id:t.id})}catch(s){this._toast(`Could not tick off ${e.summary}.`),this._todoSig=null,this._watchTodos(this._hass)}}_openReview(){if(!customElements.get("hubbubb-review-card"))return this._navigate(this._config.review_path);this._reviewEl||(this._reviewEl=document.createElement("hubbubb-review-card"),this._reviewEl.setConfig({type:"custom:hubbubb-review-card",entity:this._config.review_entity}),this._reviewBox=document.createElement("div"),this._reviewBox.attachShadow({mode:"open"}).appendChild(this._reviewEl)),this._reviewEl.hass=this._hass,this._sheet={kind:"review",items:[],q:""}}_openTodos(){this._todoSig=null,this._watchTodos(this._hass),this._sheet={kind:"todos",items:[],q:""}}_renderTodos(){if(!this._todos)return w`<div class="dim pad">Loading…</div>`;let t=w`<form class="tadd tnew" @submit=${e=>this._todoCreate(e)}>
      <input type="text" placeholder="New list…" enterkeyhint="done" />
      <button type="submit" title="Create list">+</button>
    </form>`;return this._todos.length?w`${this._renderTodoLists()}${t}`:w`<div class="dim pad">No to-do lists yet.</div>${t}`}_renderTodoLists(){return w`<section class="todos">
      ${this._todos.map(t=>w`<div class="todo">
          <div class="phead">
            <span class="ptitle">${t.name}</span>
            ${t.off||t.err?A:w`<span class="tcount">${t.items.length}</span>`}
          </div>
          ${t.off?w`<div class="dim">Unavailable</div>`:t.err?w`<div class="perr">${t.err}</div>`:w`${t.items.length?t.items.map(e=>w`<button class="titem" title="Tick off" @click=${()=>this._todoDone(t,e)}>
                      <span class="tbox"></span><span class="ttext">${e.summary}</span>
                    </button>`):w`<div class="dim">Nothing on the list.</div>`}
                <form class="tadd" @submit=${e=>this._todoAdd(e,t)}>
                  <input type="text" placeholder="Add to ${t.name}…" enterkeyhint="done" />
                  <button type="submit" title="Add">+</button>
                </form>`}
        </div>`)}
    </section>`}_renderDock(t){var o;if(t||this._config.dock===!1||this._config.build_page)return A;let e=n=>w`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${n}</svg>`,s=n=>this._landed&&!this._landed.has(n)?"pending":"",i=((o=this._todos)==null?void 0:o.reduce((n,r)=>{var a;return n+(((a=r.items)==null?void 0:a.length)||0)},0))||0;return w`<nav class="dock">
      <button class=${s(0)} title="Calendar" @click=${()=>this._navigate(this._config.calendar_path)}>
        ${e(Et`<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2"/>`)}
        <span>Calendar</span>
      </button>
      <button class=${s(1)} title="To-do lists" @click=${()=>this._openTodos()}>
        ${e(Et`<path d="M10 6.5h10.5M10 12h10.5M10 17.5h10.5"/><path d="M3.5 6.5l1.6 1.6 2.9-3.2M3.5 12l1.6 1.6 2.9-3.2"/><rect x="3.8" y="16" width="3.2" height="3.2" rx="0.6"/>`)}
        ${i&&!s(1)?zs(i,w`<b class="badge">${i}</b>`):A}
        <span>To-do</span>
      </button>
      <button class="power ${this._booting?"on":""} ${s(2)}" title="Start-up and introduction" @click=${this._intro}>
        ${e(Et`<path d="M12 3.5v7"/><path d="M7.2 6.6a7 7 0 1 0 9.6 0"/>`)}
      </button>
      <button class=${s(3)} title="Jarvis Review" @click=${()=>this._openReview()}>
        ${e(Et`<path d="M11 20.5H6.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H14l4 4v3"/><path d="M14 3.5v4h4"/><circle cx="15.5" cy="15.5" r="3"/><path d="M17.7 17.7l2.6 2.6"/><path d="M7.5 8.5h3M7.5 12h4"/>`)}
        <span>Review</span>
      </button>
      <button class=${s(4)} title="Build mode" data-ai="toggle-build-mode" @click=${()=>this._setBuild(!0)}>
        ${e(Et`<path d="M12 2.6c-4 0-7 2.5-7 6.5v4.3c0 2.1.8 4 2.2 5.4L9.6 21h4.8l2.4-2.2c1.4-1.4 2.2-3.3 2.2-5.4V9.1c0-4-3-6.5-7-6.5z"/><path d="M7.3 11.1l3.4 1M16.7 11.1l-3.4 1"/><path d="M12 2.8v4.4M9.8 17.2h4.4M7.4 14.2l2.3 1.6M16.6 14.2l-2.3 1.6"/>`)}
        <span>Build</span>
      </button>
    </nav>`}_fmtElapsed(t){if(t==null)return"";let e=Math.floor(t/60);return e<1?`${Math.floor(t)}s`:e<60?`${e}m`:`${Math.floor(e/60)}h ${e%60}m`}_chipProjects(){let t=o=>o.replace(/\b\w/g,n=>n.toUpperCase()),e=o=>typeof o=="string"?{project:o,label:t(o)}:o,s=this._config.build_projects,i=this._projects||[];return Array.isArray(s)&&s.length?s.map(e).filter(o=>!i.length||i.includes(o.project)):i.map(e)}_renderList(){let t=this._sessions;return w`
      <div class="phead">
        <button class="hbtn back" data-ai="toggle-build-mode" title="Back" @click=${()=>this._setBuild(!1)}>‹</button>
        <span class="ptitle">${this._name} Agents</span>
        <button
          class="hbtn"
          data-ai="create-session"
          @click=${()=>this._picking=!this._picking}
        >+ New</button>
      </div>
      ${this._picking?w`<div class="chips">
            ${this._chipProjects().map(e=>w`<button class="chip" @click=${()=>this._newSession(e.project)}>
                ${e.label}
              </button>`)}
          </div>`:A}
      <div class="list">
        ${t==null?w`<div class="dim pad">Scanning…</div>`:t.length===0?w`<div class="dim pad">No sessions running.</div>`:t.map(e=>w`
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
                        title=${e.done?"finished \u2014 not opened yet":A}
                      ></span>
                      <span class="rmain">
                        <span class="rlabel">
                          ${e.title||e.label}
                          ${e.busy?w`<span class="rtime">${this._fmtElapsed(e.elapsed)}</span>`:A}
                        </span>
                        ${e.last_message?w`<span class="rsnip">${e.last_message}</span>`:A}
                        <span class="rmeta">
                          <span class="pill">${e.project}</span>
                          ${e.label!==e.project?w`<span class="pill alt">${e.label.replace(`${e.project}, `,"")}</span>`:A}
                          ${e.model?w`<span class="pill alt">${this._modelName(e)}</span>`:A}
                        </span>
                      </span>
                      <span class="chev">›</span>
                    </button>
                  </div>
                `)}
      </div>
    `}_modelName(t){if((t==null?void 0:t.model)==="local")return"Local";let e=(this._models||[]).find(s=>s.id===(t==null?void 0:t.model));return((e==null?void 0:e.name)||(t==null?void 0:t.model)||"Claude").replace(/^Claude /,"")}_renderHello(t){let e=(t==null?void 0:t.model)==="local",s=this._modelName(t);return w`<div class="hello">
      <div class="hello-ring"><span></span><span></span><span></span></div>
      <div class="hello-name">${e?this._name:"Claude"}</div>
      <div class="hello-sub">
        ${e?"Local":`Cloud \xB7 ${s}`}${t!=null&&t.project?w` · ${t.project}`:A}
      </div>
      <div class="hello-ready">Ready when you are</div>
    </div>`}_useSuggestion(){let t=this._composerEl();!t||!this._suggestion||(t.value=this._suggestion,this._autoGrow(t),this._draftSoon(),t.focus(),t.setSelectionRange(t.value.length,t.value.length))}_renderSession(){let t=(this._sessions||[]).find(e=>e.id===this._sel);return w`
      <div class="phead">
        <button class="hbtn back" data-ai="close-session-view" @click=${()=>this._select(null)}>‹</button>
        <button
          class="ptitle tappable"
          data-ai="session-details"
          title="What is this session?"
          @click=${()=>this._details=!this._details}
        >
          ${(t==null?void 0:t.title)||(t==null?void 0:t.label)||"session"}
          ${t!=null&&t.busy?w`<span class="livedot"></span> working ${this._fmtElapsed(t.elapsed)}`:A}
          <span class="caret">${this._details?"\u25B4":"\u25BE"}</span>
        </button>
        <button
          class="hbtn danger ${this._confirmKill===this._sel?"armed":""}"
          data-ai="end-session"
          @click=${()=>this._killSession(this._sel)}
        >${this._confirmKill===this._sel?"Confirm?":"End"}</button>
      </div>
      ${this._details?w`<div class="details">
            <div class="drow">
              <span class="dkey">Project</span>
              <span class="pill">${(t==null?void 0:t.project)||"unknown"}</span>
              ${t!=null&&t.label&&t.label!==t.project?w`<span class="pill alt">${t.label.replace(`${t.project}, `,"")}</span>`:A}
            </div>
            <div class="drow col">
              <span class="dkey">You opened with</span>
              <span class="dfirst">${(t==null?void 0:t.first_message)||"Nothing recorded yet."}</span>
            </div>
          </div>`:A}
      <div
        class="log"
        @scroll=${e=>{let s=e.target;this._stick=s.scrollHeight-s.scrollTop-s.clientHeight<40}}
      >
        ${this._msgs==null?w`<div class="dim pad">Loading transcript…</div>`:this._msgs.every(e=>e.role==="screen")?this._renderHello(t):this._msgs.map(e=>w`<div class="msg ${e.role}">${this._body(e)}</div>`)}
        ${t!=null&&t.busy?this._activity?w`<div class="activity">${this._activity}</div>`:this._screen?w`<pre class="activity screen-tail" title="No spinner on screen - this is the terminal as it stands">${this._screen}</pre>`:A:A}
        ${this._ask?this._renderAsk(this._ask):A}
        ${(this._queue||[]).filter(e=>e.id===this._sel).map(e=>w`<div class="qitem ${e.state}">
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
                ${e.state==="held"?w`
                      <button class="qbtn" @click=${()=>this._editQueued(e)}>edit</button>
                      <button class="qbtn" @click=${()=>this._dispatch(e)}>send now</button>
                      <button class="qbtn del" @click=${()=>this._dropQueued(e)}>✕</button>
                    `:A}
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
        ${(this._files||[]).length||this._uploading?w`<div class="atts">
              ${(this._files||[]).map(e=>w`<span class="att">
                  <span class="attname">${e.name}</span>
                  <button
                    class="attx"
                    title="Remove"
                    @click=${()=>this._dropFile(e)}
                  >✕</button>
                </span>`)}
              ${this._uploading?w`<span class="att pendingatt">sending…</span>`:A}
            </div>`:A}
        <div
          class="cbox"
          @pointerdown=${e=>{var s;e.target.closest("button, input, textarea, select")||(e.preventDefault(),(s=this._composerEl())==null||s.focus())}}
        >
        <div class="cbtns">
          ${this._sel?this._renderRunControls():A}
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
        ${this._suggestion?w`<button
              type="button"
              class="suggest"
              data-ai="use-suggestion"
              title="Claude Code's suggested reply - tap, or press Tab in an empty box"
              @click=${()=>this._useSuggestion()}
            ><span class="suggest-key">⇥</span>${this._suggestion}</button>`:A}
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
    `}render(){var r,a,l,h;if(!this._config)return A;if(!((a=(r=this._hass)==null?void 0:r.states)==null?void 0:a[this._config.entity]))return w`
        <ha-card>
          <div class="missing">
            Entity <code>${this._config.entity}</code> not found
          </div>
        </ha-card>
      `;let e=this._effectiveState(),s=e==="offline"?this._config.offline_color:this._config[Ds[e]],i=!!this._build,o=(l=this._announce)!=null?l:null,n=(h=this._messages)!=null?h:null;return w`
      <ha-card
        class="bg-${this._config.background}${this._config.honeycomb===!1?"":" comb"}${e==="offline"?" dim":""}${this._config.animation==="jarvis-im3"?" im3":""}"
        style=${this._config.honeycomb===!1?"":`--jr-comb:${zi(s)}`}
      >
        <div
          class="wrap state-${e} ${i&&!this._config.build_dashboard?"build":""} ${this._config.build_page?"page":""} ${i&&this._config.panel_fullscreen&&!this._config.build_dashboard?"over":""}"
          style=${this._cardVars(s)}
        >
          ${this._config.dock===!1||i||this._config.build_page?w`<button
            class="mode ${i?"on":""}"
            data-ai="toggle-build-mode"
            title=${i?"Back":"Build mode"}
            @click=${()=>this._setBuild(!i)}
          >
            ${i?w`<span class="mode-back">‹</span>`:w`<svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>`}
          </button>`:A}
          ${o===null?A:w`<button
                class="mode speaker ${o?"on":""}"
                data-ai="toggle-agent-announcements"
                title=${o?`${this._name} finishes out loud - tap to send to your phone instead`:`${this._name} finishes go to your phone - tap to hear them here`}
                @click=${this._toggleAnnounce}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4v-5z"
                    fill=${o?"currentColor":"none"}
                  />
                  <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" fill="none" />
                  <path d="M18 7a7 7 0 0 1 0 10" fill="none" />
                </svg>
              </button>`}
          ${n===null?A:w`<button
                class="mode bell ${n?"on":""}"
                data-ai="toggle-hubbubb-messages"
                title=${n?"New Hubbubb messages are read out here - tap to go quiet":"Hubbubb messages stay quiet - tap to hear new ones here"}
                @click=${this._toggleMessages}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 2.5h15L18 15z"
                    fill=${n?"currentColor":"none"}
                  />
                  <path d="M10 19a2 2 0 0 0 4 0" fill="none" />
                </svg>
              </button>`}
          ${i&&!this._config.build_dashboard?w`<div class="panel ${this._sel?"open":""} ${this._view?"view":""}">
                <div class="side" style=${this._sideW?`flex-basis:${this._sideW}px`:""}>${this._renderList()}</div>
                <div class="grip" title="Drag to resize" @pointerdown=${this._gripDown}></div>
                <div class="main">
                  ${this._sel?this._renderSession():w`<div class="dim pad empty">Pick a session, or start a new one.</div>`}
                  ${this._err?w`<div class="perr">${this._err}</div>`:A}
                </div>
                ${this._view?w`<div class="viewer">${this._renderViewer()}</div>`:A}
              </div>`:A}
          <div class="ring ${this._config.animation==="jarvis-v1"?"":"bubbles"} ${this._booting?"booting":""}" data-ai="activate-assistant" @click=${this._ringTap}>
            <canvas></canvas>
            ${this._booting&&this._config.animation!=="jarvis-im3"?w`<div class="wordmark" aria-hidden="true">${this._name.toUpperCase()}<small>All systems online</small></div>`:A}
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
                  width=${zt.w}
                  height=${zt.h}
                  patternUnits="userSpaceOnUse"
                >
                  <path d=${Js} class="hex" />
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
          ${this._sheet?this._renderSheet():A}
        </div>
      </ha-card>
    `}};Ht(It,"build",Ys),Ht(It,"properties",{_config:{state:!0},_todos:{state:!0},_state:{state:!0},_mp:{state:!0},_build:{state:!0},_sessions:{state:!0},_projects:{state:!0},_sel:{state:!0},_msgs:{state:!0},_ask:{state:!0},_askSent:{state:!0},_activity:{state:!0},_screen:{state:!0},_permission:{state:!0},_modelBusy:{state:!0},_models:{state:!0},_suggestion:{state:!0},_modes:{state:!0},_model:{state:!0},_queue:{state:!0},_swipe:{state:!0},_details:{state:!0},_view:{state:!0},_sideW:{state:!0},_files:{state:!0},_dragging:{state:!0},_uploading:{state:!0},_err:{state:!0},_confirmKill:{state:!0},_picking:{state:!0},_pending:{state:!0},_voiceState:{state:!0},_announce:{state:!0},_messages:{state:!0},_dictating:{state:!0},_booting:{state:!0},_landed:{state:!0},_sheet:{state:!0}}),Ht(It,"styles",Te`
    :host {
      display: block;
      /* The build-mode chrome's palette as channels, so a whole look can
         retint it: line = borders, glow = fills and shadows, glass = panel
         background, ink = text. */
      --jr-line: 53, 154, 210;
      --jr-glow: 46, 157, 245;
      --jr-glass-a: 10, 24, 32;
      --jr-glass-b: 4, 10, 14;
    }
    /* jarvis-im3 is teal throughout, the build windows included. */
    ha-card.im3 {
      --jr-line: 63, 200, 190;
      --jr-glow: 70, 220, 205;
      --jr-glass-a: 6, 26, 26;
      --jr-glass-b: 2, 10, 10;
      --jr-ink: #cdf3ee;
      --jr-ink-2: #b6ece5;
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
    /* jarvis-im3: the film's backdrop - a soft column of light behind the
       ring, near-black either side, and the honeycomb only in faint patches. */
    ha-card.bg-dark.im3 {
      background:
        radial-gradient(ellipse 30% 58% at 50% 42%, rgba(16, 92, 88, 0.5), rgba(6, 44, 42, 0.22) 55%, transparent 100%),
        linear-gradient(90deg, #000 0%, #01100f 32%, #021a19 50%, #01100f 68%, #000 100%);
    }
    ha-card.im3.comb::before {
      opacity: 0.09;
      -webkit-mask-image: radial-gradient(circle at 12% 78%, #000 0, transparent 24%),
        radial-gradient(circle at 88% 22%, #000 0, transparent 16%);
      mask-image: radial-gradient(circle at 12% 78%, #000 0, transparent 24%),
        radial-gradient(circle at 88% 22%, #000 0, transparent 16%);
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
    /* The film's tab bar, dressed as a build-mode panel: same glass, border,
       inset glow and tracked capitals, with the power button standing proud
       of the bar in the middle. */
    .dock {
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, 1fr) 76px repeat(2, 1fr);
      align-items: center;
      box-sizing: border-box;
      width: min(100% - 24px, 520px);
      margin: 26px auto 10px;
      padding: 6px 8px;
      background: var(
        --jr-panel-bg,
        linear-gradient(160deg, rgba(var(--jr-glass-a), 0.92), rgba(var(--jr-glass-b), 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.35));
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(var(--jr-glow), 0.08);
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
      line-height: 1;
    }
    .dock button {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      min-width: 0;
      padding: 7px 2px 6px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: none;
      color: var(--jr-panel-text, var(--jr-ink-2, #bfe3f5));
      opacity: 0.78;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
      -webkit-tap-highlight-color: transparent;
    }
    .dock button span {
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    @media (max-width: 420px) {
      .dock {
        grid-template-columns: repeat(2, 1fr) 68px repeat(2, 1fr);
        padding: 6px 4px;
      }
      .dock button span {
        font-size: 8.5px;
        letter-spacing: 0.08em;
      }
    }
    .dock button svg {
      position: static; /* the ring's svg rule pins svgs absolutely */
      width: 22px;
      height: 22px;
      display: block;
      color: var(--jr-color);
    }
    .dock button:hover,
    .dock button:focus-visible {
      opacity: 1;
      background: rgba(var(--jr-glow), 0.12);
      border-color: rgba(var(--jr-line), 0.4);
      box-shadow: 0 0 10px rgba(var(--jr-glow), 0.25);
      outline: none;
    }
    .dock button:active {
      transform: scale(0.96);
    }
    .dock button.power {
      justify-self: center;
      width: 64px;
      height: 64px;
      margin-top: -34px;
      padding: 15px;
      border-radius: 50%;
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.45));
      background: radial-gradient(circle at 50% 40%, rgba(16, 40, 48, 0.98), rgba(3, 8, 11, 0.98));
      box-shadow: 0 0 0 4px rgba(3, 8, 11, 0.9), 0 0 16px rgba(var(--jr-glow), 0.25), inset 0 0 14px rgba(var(--jr-glow), 0.15);
      opacity: 1;
    }
    .dock button.power svg {
      width: 100%;
      height: 100%;
    }
    .dock button.power:hover,
    .dock button.power.on {
      border-color: var(--jr-color);
      box-shadow: 0 0 0 4px rgba(3, 8, 11, 0.9), 0 0 22px var(--jr-color), inset 0 0 16px rgba(var(--jr-glow), 0.25);
      background: radial-gradient(circle at 50% 40%, rgba(16, 40, 48, 0.98), rgba(3, 8, 11, 0.98));
    }

    /* start-up: empty slots until each icon drops in */
    .dock button svg,
    .dock button span {
      transition: opacity 0.25s;
    }
    .dock button.pending svg,
    .dock button.pending span {
      opacity: 0;
    }
    /* the open-item count rides on the icon's corner, so it never widens
       the label - the label is what has to fit on a phone */
    .badge {
      animation: jrBadge 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      position: absolute;
      top: 3px;
      left: calc(50% + 5px);
      min-width: 14px;
      height: 14px;
      box-sizing: border-box;
      padding: 0 4px;
      border-radius: 7px;
      background: var(--jr-color);
      color: #021010;
      font-size: 9px;
      font-weight: 700;
      line-height: 14px;
      text-align: center;
    }
    @keyframes jrBadge {
      0% { transform: scale(0); opacity: 0; }
      60% { opacity: 1; box-shadow: 0 0 12px var(--jr-color); }
      100% { transform: scale(1); box-shadow: 0 0 0 transparent; }
    }
    .flyicon {
      position: absolute;
      width: 30px;
      height: 30px;
      z-index: 4;
      pointer-events: none;
      color: var(--jr-color);
      transform-origin: 50% 50%;
      filter: drop-shadow(0 0 2px var(--jr-color)) drop-shadow(0 0 8px var(--jr-color));
    }
    .flyicon svg {
      position: static;
      width: 100%;
      height: 100%;
      stroke-width: 1.7;
    }

    /* ---------------- to-do lists ---------------- */
    .todos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
      box-sizing: border-box;
      width: min(100% - 24px, 520px);
      margin: 0 auto 14px;
    }
    .todo {
      background: var(
        --jr-panel-bg,
        linear-gradient(160deg, rgba(var(--jr-glass-a), 0.92), rgba(var(--jr-glass-b), 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.35));
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(var(--jr-glow), 0.08);
      padding: 10px 12px;
      color: var(--jr-panel-text, var(--jr-ink, #cfe9f7));
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
      line-height: 1.4;
      text-align: left;
      min-width: 0;
    }
    .todo .dim {
      font-size: 12.5px;
    }
    .tcount {
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--jr-color);
      opacity: 0.8;
    }
    .titem {
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      padding: 5px 4px;
      border: none;
      border-radius: 4px;
      background: none;
      color: inherit;
      font: inherit;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }
    .titem:hover {
      background: rgba(var(--jr-glow), 0.1);
    }
    .tbox {
      flex: none;
      width: 11px;
      height: 11px;
      border: 1px solid var(--jr-color);
      border-radius: 2px;
      opacity: 0.8;
    }
    .titem:hover .tbox {
      box-shadow: 0 0 6px var(--jr-color);
    }
    .ttext {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .tadd {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    .tnew {
      width: min(100% - 24px, 520px);
      margin: 4px auto 14px;
      box-sizing: border-box;
    }
    .tadd input {
      flex: 1;
      min-width: 0;
      margin: 0;
      padding: 7px 10px;
      border-radius: 6px;
      border: 1px solid rgba(var(--jr-line), 0.35);
      background: rgba(var(--jr-glow), 0.06);
      color: inherit;
      font: inherit;
      font-size: 16px; /* under 16px iOS zooms the page on focus */
    }
    .tadd input:focus {
      outline: none;
      border-color: var(--jr-color);
    }
    .tadd button {
      flex: none;
      width: 36px;
      border-radius: 6px;
      border: 1px solid rgba(var(--jr-line), 0.45);
      background: rgba(var(--jr-glow), 0.12);
      color: var(--jr-color);
      font-size: 18px;
      cursor: pointer;
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
    /* the review is long: a full-screen pop-up, closed back to the ring */
    .sheet.review {
      position: fixed;
      z-index: 9;
      /* below the phone's status bar and notch and HA's own header, so the
         close button is reachable */
      padding: calc(env(safe-area-inset-top, 0px) + 64px) 12px calc(env(safe-area-inset-bottom, 0px) + 12px);
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.72);
    }
    .sheet.review .sheet-box {
      width: min(920px, 100%);
      height: 100%;
      max-height: none;
    }
    .review-host {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    .sheet-box {
      display: flex;
      flex-direction: column;
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
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
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      margin: -10px -10px -10px 0;
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
      border-left: 1px solid rgba(var(--jr-line), 0.3);
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
      border-left: 1px solid rgba(var(--jr-line), 0.3);
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
      background: rgba(var(--jr-glow), 0.18);
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
    .mode-back {
      display: block;
      font-size: 24px;
      line-height: 20px;
      text-align: center;
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
        linear-gradient(160deg, rgba(var(--jr-glass-a), 0.92), rgba(var(--jr-glass-b), 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.35));
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(var(--jr-glow), 0.08);
      padding: 10px 12px;
      color: var(--jr-panel-text, var(--jr-ink, #cfe9f7));
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
      border-bottom: 1px solid rgba(var(--jr-line), 0.3);
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
      text-shadow: 0 0 8px rgba(var(--jr-glow), 0.5);
    }
    .hbtn {
      flex: none;
      background: rgba(var(--jr-glow), 0.06);
      border: 1px solid rgba(var(--jr-line), 0.45);
      color: var(--jr-ink-2, #bfe3f5);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 10px;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .hbtn:hover {
      background: rgba(var(--jr-glow), 0.18);
      box-shadow: 0 0 10px rgba(var(--jr-glow), 0.35);
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
      border: 1px solid rgba(var(--jr-line), 0.4);
      border-radius: 4px;
      color: var(--jr-ink-2, #b8dff2);
      font-size: 11.5px;
      padding: 4px 10px;
      cursor: pointer;
      font-family: inherit;
      letter-spacing: 0.05em;
    }
    .chip:hover {
      background: rgba(var(--jr-glow), 0.15);
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
      border-bottom: 1px solid rgba(var(--jr-line), 0.14);
      padding: 8px 4px 8px 14px;
      cursor: pointer;
      color: inherit;
      font-family: inherit;
      text-align: left;
    }
    .row:hover {
      background: rgba(var(--jr-glow), 0.08);
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
      background: rgba(var(--jr-glow), 0.12);
      border: 1px solid rgba(var(--jr-line), 0.35);
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
      background: rgba(var(--jr-glow), 0.06);
      border: 1px solid rgba(var(--jr-line), 0.28);
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
      scrollbar-color: rgba(var(--jr-line), 0.4) transparent;
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
      background: rgba(var(--jr-glow), 0.12);
      border: 1px solid rgba(var(--jr-line), 0.25);
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
      border: 1px solid rgba(var(--jr-line), 0.18);
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
      border-left: 2px solid rgba(var(--jr-line), 0.35);
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
      background: rgba(var(--jr-glow), 0.13);
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
      border-top: 1px solid rgba(var(--jr-line), 0.3);
    }
    /* The box owns the border and background; the textarea and the button row
       stack inside it. The buttons used to be positioned over the textarea,
       which meant long text scrolled underneath and hid them — a row of their
       own cannot be covered. */
    .cbox {
      display: flex;
      flex-direction: column;
      background: rgba(0, 10, 16, 0.6);
      border: 1px solid rgba(var(--jr-line), 0.4);
      border-radius: 6px;
      overflow: hidden;
    }
    .cbox:focus-within,
    .composer.drag .cbox {
      border-color: var(--jr-color);
      box-shadow: 0 0 10px rgba(var(--jr-glow), 0.35);
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
      border-color: rgba(var(--jr-glow), 0.7);
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
      border-color: rgba(var(--jr-glow), 0.55);
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
      background: rgba(var(--jr-glow), 0.12);
      border: 1px solid rgba(var(--jr-line), 0.35);
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
      background: rgba(var(--jr-line), 0.07);
      border-left: 2px solid rgba(var(--jr-line), 0.4);
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
      border-color: rgba(var(--jr-line), 0.35);
      background: rgba(var(--jr-glow), 0.1);
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
      background: rgba(var(--jr-glow), 0.18);
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
      border: 1px solid rgba(var(--jr-line), 0.4);
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
      border: 1px solid rgba(var(--jr-line), 0.3);
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
  `);var Oi=[{name:"entity",required:!0,selector:{entity:{domain:be}}},{name:"animation",selector:{select:{mode:"dropdown",options:[{value:"hubbubb",label:"Hubbubb - ring and bubbles"},{value:"jarvis-v1",label:"Jarvis v1 - segments and motes"},{value:"jarvis-im3",label:"Jarvis IM3 - folding film, as in the film"}]}}},{name:"assistant_name",selector:{text:{}}},{name:"size",selector:{number:{min:80,max:600,step:10,mode:"slider"}}},{name:"background",selector:{select:{mode:"dropdown",options:[{value:"dark",label:"Deep space (dark)"},{value:"card",label:"Normal card background"},{value:"transparent",label:"Transparent"}]}}},{name:"honeycomb",selector:{boolean:{}}},{name:"todos",selector:{boolean:{}}},{name:"todo_entities",selector:{entity:{domain:"todo",multiple:!0}}},{name:"todo_exclude",selector:{entity:{domain:"todo",multiple:!0}}},{name:"tap_message",selector:{text:{}}},{name:"",type:"expandable",title:"Toggles",icon:"mdi:toggle-switch-outline",schema:[{name:"build_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"announce_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"messages_entity",selector:{entity:{domain:["switch","input_boolean"]}}}]},{name:"",type:"expandable",title:"Build panel",icon:"mdi:hexagon-multiple-outline",schema:[{name:"panel_fullscreen",selector:{boolean:{}}},{name:"panel_height",selector:{number:{min:0,max:1400,step:20,mode:"box"}}},{name:"build_projects",selector:{text:{multiple:!0}}},{name:"build_dashboard",selector:{text:{}}},{name:"build_page",selector:{boolean:{}}},{name:"build_return",selector:{text:{}}}]},{name:"",type:"expandable",title:"Ring colours",icon:"mdi:palette",schema:[{name:"idle_color",selector:{text:{}}},{name:"listening_color",selector:{text:{}}},{name:"processing_color",selector:{text:{}}},{name:"responding_color",selector:{text:{}}},{name:"offline_color",selector:{text:{}}}]},{name:"",type:"expandable",title:"Panel colours",icon:"mdi:console",schema:[{name:"panel_bg",selector:{text:{}}},{name:"panel_border",selector:{text:{}}},{name:"panel_text",selector:{text:{}}},{name:"terminal_bg",selector:{text:{}}},{name:"terminal_text",selector:{text:{}}}]},{name:"",type:"expandable",title:"Advanced",icon:"mdi:tune",schema:[{name:"follow_media_player",selector:{boolean:{}}},{name:"audio_offset",selector:{number:{min:-2,max:2,step:.05,mode:"box"}}},{name:"media_player",selector:{entity:{domain:"media_player"}}},{name:"particle_size",selector:{number:{min:.3,max:3,step:.1,mode:"slider"}}},{name:"particles",selector:{number:{min:0,max:4e3,step:20,mode:"box"}}}]}],Bi={entity:"Assist satellite",animation:"Animation",assistant_name:"Assistant name",size:"Ring size (px)",background:"Card background",honeycomb:"Honeycomb background",todos:"To-do button in the dock",todo_entities:"Which to-do lists (empty = all)",todo_exclude:"Lists to leave out",follow_media_player:"Animate while the device is playing audio",audio_offset:"Audio sync offset (seconds)",media_player:"Speaker entity (blank = same device)",tap_message:"Spoken reply when the ring is tapped",particles:"Particle count, Jarvis v1 (0 = auto)",particle_size:"How many bubbles (1 = about 22)",build_entity:"Build mode toggle",announce_entity:"Agent announcement toggle",messages_entity:"Hubbubb message toggle",panel_fullscreen:"Full screen (floats over the dashboard)",panel_height:"Panel height in px (0 = match the ring)",build_projects:"Projects offered by + New (blank = all the companion has)",build_dashboard:"Open this dashboard instead",build_page:"This card IS the build dashboard",build_return:"Exit goes back to",idle_color:"Idle",listening_color:"Listening",processing_color:"Processing",responding_color:"Responding",offline_color:"Unavailable",panel_bg:"Panel background",panel_border:"Panel border",panel_text:"Panel text",terminal_bg:"Terminal background",terminal_text:"Terminal text"},ve=class extends ut{setConfig(t){this._config=U(U({},Ve),t)}render(){return this._config?w`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Oi}
        .computeLabel=${t=>{var e;return(e=Bi[t.name])!=null?e:t.name}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:A}_valueChanged(t){t.stopPropagation();let e=U({},t.detail.value);for(let[s,i]of Object.entries(Ve))e[s]===i&&delete e[s];delete e.name,delete e.show_state,Ke(this,"config-changed",{config:e})}};Ht(ve,"properties",{hass:{},_config:{state:!0}});customElements.define("hubbubb-ring-card",It);customElements.define("hubbubb-ring-card-editor",ve);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-ring-card",name:"Hubbubb Ring",description:"Animated glowing ring that reacts to an Assist satellite's state.",preview:!0});console.info(`%c HUBBUBB-RING-CARD %c v${xi} `,"color:#0b1620;background:#35e0ff;font-weight:700","color:#35e0ff;background:#0b1620");
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

lit-html/directives/keyed.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
