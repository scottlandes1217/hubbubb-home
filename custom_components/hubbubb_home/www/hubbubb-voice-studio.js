var jt=Object.defineProperty,Wt=Object.defineProperties;var qt=Object.getOwnPropertyDescriptors;var ct=Object.getOwnPropertySymbols;var Ft=Object.prototype.hasOwnProperty,Vt=Object.prototype.propertyIsEnumerable;var V=(r,t,e)=>t in r?jt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,b=(r,t)=>{for(var e in t||(t={}))Ft.call(t,e)&&V(r,e,t[e]);if(ct)for(var e of ct(t))Vt.call(t,e)&&V(r,e,t[e]);return r},I=(r,t)=>Wt(r,qt(t));var B=(r,t,e)=>V(r,typeof t!="symbol"?t+"":t,e);var K=globalThis,j=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),dt=new WeakMap,L=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(j&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=dt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&dt.set(e,t))}return t}toString(){return this.cssText}},pt=r=>new L(typeof r=="string"?r:r+"",void 0,J),G=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[o+1],r[0]);return new L(e,r,J)},ut=(r,t)=>{if(j)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=K.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},Z=j?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return pt(e)})(r):r;var{is:Jt,defineProperty:Gt,getOwnPropertyDescriptor:Zt,getOwnPropertyNames:Qt,getOwnPropertySymbols:Xt,getPrototypeOf:Yt}=Object,m=globalThis,_t=m.trustedTypes,te=_t?_t.emptyScript:"",Q=m.reactiveElementPolyfillSupport,O=(r,t)=>r,X={toAttribute(r,t){switch(t){case Boolean:r=r?te:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch(i){e=null}}return e}},mt=(r,t)=>!Jt(r,t),ft={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:mt},gt,$t;(gt=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),($t=m.litPropertyMetadata)!=null||(m.litPropertyMetadata=new WeakMap);var g=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ft){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Gt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){var n;let{get:s,set:o}=(n=Zt(this.prototype,t))!=null?n:{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let l=s==null?void 0:s.call(this);o==null||o.call(this,a),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:ft}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,i=[...Qt(e),...Xt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(Z(s))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,i;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return ut(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostConnected)==null?void 0:s.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){var o;let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:X).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){var o,n,a;let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let l=i.getPropertyOptions(s),d=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:X;this._$Em=s;let p=d.fromAttribute(e,l.type);this[s]=(a=p!=null?p:(n=this._$Ej)==null?void 0:n.get(s))!=null?a:p,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){var n,a;if(t!==void 0){let l=this.constructor;if(s===!1&&(o=this[t]),i!=null||(i=l.getPropertyOptions(t)),!(((n=i.hasChanged)!=null?n:mt)(o,e)||i.useDefault&&i.reflect&&o===((a=this._$Ej)==null?void 0:a.get(t))&&!this.hasAttribute(l._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){var a,l,d;i&&!((a=this._$Ej)!=null?a:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(l=n!=null?n:e)!=null?l:this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&((d=this._$Eq)!=null?d:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i,s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((i=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,a]of o){let{wrapped:l}=a,d=this[n];l!==!0||this._$AL.has(n)||d===void 0||this.C(n,void 0,a,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},bt;g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[O("elementProperties")]=new Map,g[O("finalized")]=new Map,Q==null||Q({ReactiveElement:g}),((bt=m.reactiveElementVersions)!=null?bt:m.reactiveElementVersions=[]).push("2.1.2");var R=globalThis,yt=r=>r,W=R.trustedTypes,vt=W?W.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ct="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,Pt="?"+y,ee=`<${Pt}>`,k=document,U=()=>k.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",ot=Array.isArray,ie=r=>ot(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Y=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,wt=/>/g,x=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),kt=/'/g,At=/"/g,Tt=/^(?:script|style|textarea|title)$/i,at=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),c=at(1),$e=at(2),be=at(3),A=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),St=new WeakMap,w=k.createTreeWalker(k,129);function Lt(r,t){if(!ot(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return vt!==void 0?vt.createHTML(t):t}var se=(r,t)=>{let e=r.length-1,i=[],s,o=t===2?"<svg>":t===3?"<math>":"",n=N;for(let a=0;a<e;a++){let l=r[a],d,p,u=-1,f=0;for(;f<l.length&&(n.lastIndex=f,p=n.exec(l),p!==null);)f=n.lastIndex,n===N?p[1]==="!--"?n=xt:p[1]!==void 0?n=wt:p[2]!==void 0?(Tt.test(p[2])&&(s=RegExp("</"+p[2],"g")),n=x):p[3]!==void 0&&(n=x):n===x?p[0]===">"?(n=s!=null?s:N,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,d=p[1],n=p[3]===void 0?x:p[3]==='"'?At:kt):n===At||n===kt?n=x:n===xt||n===wt?n=N:(n=x,s=void 0);let $=n===x&&r[a+1].startsWith("/>")?" ":"";o+=n===N?l+ee:u>=0?(i.push(d),l.slice(0,u)+Ct+l.slice(u)+y+$):l+y+(u===-2?a:$)}return[Lt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},H=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0,a=t.length-1,l=this.parts,[d,p]=se(t,e);if(this.el=r.createElement(d,i),w.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=w.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(Ct)){let f=p[n++],$=s.getAttribute(u).split(y),D=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:D[2],strings:$,ctor:D[1]==="."?it:D[1]==="?"?st:D[1]==="@"?rt:C}),s.removeAttribute(u)}else u.startsWith(y)&&(l.push({type:6,index:o}),s.removeAttribute(u));if(Tt.test(s.tagName)){let u=s.textContent.split(y),f=u.length-1;if(f>0){s.textContent=W?W.emptyScript:"";for(let $=0;$<f;$++)s.append(u[$],U()),w.nextNode(),l.push({type:2,index:++o});s.append(u[f],U())}}}else if(s.nodeType===8)if(s.data===Pt)l.push({type:2,index:o});else{let u=-1;for(;(u=s.data.indexOf(y,u+1))!==-1;)l.push({type:7,index:o}),u+=y.length-1}o++}}static createElement(t,e){let i=k.createElement("template");return i.innerHTML=t,i}};function E(r,t,e=r,i){var n,a,l;if(t===A)return t;let s=i!==void 0?(n=e._$Co)==null?void 0:n[i]:e._$Cl,o=M(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),o===void 0?s=void 0:(s=new o(r),s._$AT(r,e,i)),i!==void 0?((l=e._$Co)!=null?l:e._$Co=[])[i]=s:e._$Cl=s),s!==void 0&&(t=E(r,s._$AS(r,t.values),s,i)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var d;let{el:{content:e},parts:i}=this._$AD,s=((d=t==null?void 0:t.creationScope)!=null?d:k).importNode(e,!0);w.currentNode=s;let o=w.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let p;l.type===2?p=new z(o,o.nextSibling,this,t):l.type===1?p=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(p=new nt(o,this,t)),this._$AV.push(p),l=i[++a]}n!==(l==null?void 0:l.index)&&(o=w.nextNode(),n++)}return w.currentNode=k,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},z=class r{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,i,s){var o;this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(o=s==null?void 0:s.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),M(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ie(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=H.createElement(Lt(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(e);else{let n=new et(s,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=St.get(t.strings);return e===void 0&&St.set(t.strings,e=new H(t)),e}k(t){ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let o of t)s===e.length?e.push(i=new r(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t!==this._$AB;){let s=yt(t).nextSibling;yt(t).remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}_$AI(t,e=this,i,s){let o=this.strings,n=!1;if(o===void 0)t=E(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{let a=t,l,d;for(t=o[0],l=0;l<o.length-1;l++)d=E(this,a[i+l],e,l),d===A&&(d=this._$AH[l]),n||(n=!M(d)||d!==this._$AH[l]),d===h?t=h:t!==h&&(t+=(d!=null?d:"")+o[l+1]),this._$AH[l]=d}n&&!s&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},it=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},st=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},rt=class extends C{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var n;if((t=(n=E(this,t,e,0))!=null?n:h)===A)return;let i=this._$AH,s=t===h&&i!==h||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==h&&(i===h||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)==null?void 0:e.host)!=null?i:this.element,t):this._$AH.handleEvent(t)}},nt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var tt=R.litHtmlPolyfillSupport,Et;tt==null||tt(H,z),((Et=R.litHtmlVersions)!=null?Et:R.litHtmlVersions=[]).push("3.3.3");var Ot=(r,t,e)=>{var o,n;let i=(o=e==null?void 0:e.renderBefore)!=null?o:t,s=i._$litPart$;if(s===void 0){let a=(n=e==null?void 0:e.renderBefore)!=null?n:null;i._$litPart$=s=new z(t.insertBefore(U(),a),a,void 0,e!=null?e:{})}return s._$AI(r),s};var S=globalThis,v=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,i;let t=super.createRenderRoot();return(i=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ot(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return A}},Nt;v._$litElement$=!0,v.finalized=!0,(Nt=S.litElementHydrateSupport)==null||Nt.call(S,{LitElement:v});var lt=S.litElementPolyfillSupport;lt==null||lt({LitElement:v});var Rt;((Rt=S.litElementVersions)!=null?Rt:S.litElementVersions=[]).push("4.2.2");var Bt=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-voice-studio ${Bt}`);var Kt="/api/hubbubb_home/voice/",ht="/api/hubbubb_home/people/links",q=[{id:"wake",name:"Wake word",hint:"the phrase, said the way you say it"},{id:"ambient",name:"Room noise",hint:"what it must not wake to"},{id:"voice",name:"Voice",hint:"a person, for speaker matching"}],T=encodeURIComponent,re=(r={})=>{let t=Object.entries(r).filter(([,e])=>e!=null&&e!=="").map(([e,i])=>`${T(e)}=${T(i)}`).join("&");return t?`?${t}`:""},_={status:()=>["GET","record/status"],start:(r,t)=>["POST","record/start",{kind:r,label:t}],stop:()=>["POST","record/stop"],clips:r=>["GET",`clips${re(r)}`],deleteClip:r=>["DELETE",`clips/${T(r)}`],refile:(r,t)=>["POST",`clips/${T(r)}`,t],people:()=>["GET","people"],enroll:(r,t)=>["POST","people/enroll",{person:r,clips:t}],deletePerson:r=>["POST","people/delete",{person:r}],train:r=>["POST","train",{phrase:r}],trainStatus:()=>["GET","train/status"],links:()=>["GET",ht],link:(r,t,e)=>["POST",ht,{person:r,client_id:t,client_secret:e}],unlink:r=>["DELETE",`${ht}/${T(r)}`]},ne=r=>`${Kt}clips/${T(r)}/audio`;function Ut(r,t){let e=typeof t=="string"?t:"";try{let i=typeof t=="string"?JSON.parse(t):t;e=(i==null?void 0:i.message)||(i==null?void 0:i.error)||(i==null?void 0:i.detail)||""}catch(i){}return e=(e||"").trim(),e||(e=r===503?"the voice service is not reachable":`request failed (${r})`),e}var F=r=>{if(typeof r=="number")return r<1e12?r*1e3:r;let t=Date.parse(r);return Number.isFinite(t)?t:0};function Mt(r,{kind:t,label:e,since:i}={}){return(r||[]).filter(s=>!t||s.kind===t).filter(s=>!e||s.label===e).filter(s=>!i||F(s.created)>=i).sort((s,o)=>F(o.created)-F(s.created))}function oe(r,t){let e=new Map;for(let[i,s]of Object.entries(r||{}))e.set(i.toLowerCase(),{name:i,samples:s,link:null});for(let[i,s]of Object.entries(t||{})){let o=i.toLowerCase(),n=e.get(o)||{name:i,samples:0,link:null};n.link=s!=null&&s.linked?{linked:!0,hint:s.client_id_hint||""}:{linked:!1},e.set(o,n)}return[...e.values()].sort((i,s)=>i.name.localeCompare(s.name,void 0,{sensitivity:"base"}))}function Ht(r,t){let e=new Map;for(let i of r||[])t&&i.kind!==t||i.label&&e.set(i.label,(e.get(i.label)||0)+1);return[...e.entries()].sort((i,s)=>s[1]-i[1]||i[0].localeCompare(s[0])).map(([i])=>i)}var zt=r=>{let t=Number(r);return!Number.isFinite(t)||t<=0?0:Math.round(Math.min(1,Math.sqrt(t))*100)},ae=.002;function le(r,t=ae,e=6){return!r||r.length<e?!1:r.slice(-e).every(i=>!(Number(i)>t))}function he(r){r=Math.max(0,Math.floor(Number(r)||0));let t=Math.floor(r/3600),e=Math.floor(r%3600/60),i=r%60,s=t?String(e).padStart(2,"0"):String(e);return(t?`${t}:${s}:`:`${e}:`)+String(i).padStart(2,"0")}var Dt=r=>{let t=String(r||"").trim().split(/\s+/).filter(Boolean);return t.length>=1&&t.length<=4&&t.every(e=>/^[a-z]+$/i.test(e))};function ce({fetchBytes:r,audio:t,urls:e=URL,onstate:i=()=>{}}){let s=null,o=null,n=()=>{s&&e.revokeObjectURL(s),s=null,o=null};return t.onended=()=>{n(),i(null)},{async play(a){t.pause(),n();let l=await r(a);n(),s=e.createObjectURL(l),o=a,t.src=s,i(a);try{await t.play()}catch(d){throw n(),i(null),d}},stop(){t.pause(),n(),i(null)},dispose(){t.pause(),t.onended=null,n()},get playing(){return o}}}var It=500,de=6e4,P=class extends v{constructor(){super(),this._status=null,this._levels=[],this._elapsed=0,this._clips=[],this._people={},this._links=null,this._linking="",this._linkId="",this._linkSecret="",this._linkErr="",this._train=null,this._kind="wake",this._label="",this._fKind="",this._fLabel="",this._sel=new Set,this._err="",this._busy=!1,this._playing=null,this._since=0,this._refileKind="",this._refileLabel="",this._enrolTo="",this._phrase="",this._armed=!1,this._loaded=!1}connectedCallback(){super.connectedCallback(),this._player=ce({audio:new Audio,fetchBytes:t=>this._fetchAudio(t),onstate:t=>this._playing=t}),this._load()}disconnectedCallback(){var t;super.disconnectedCallback(),this._stopPolling(),clearInterval(this._trainTimer),this._trainTimer=null,(t=this._player)==null||t.dispose(),this._player=null}async _api([t,e,i]){var l,d,p,u;let s={method:t,headers:i?{"Content-Type":"application/json"}:{},body:i?JSON.stringify(i):void 0},o=e.startsWith("/")?e:Kt+e,n=(l=this.hass)!=null&&l.fetchWithAuth?await this.hass.fetchWithAuth(o,s):await fetch(o,I(b({},s),{headers:I(b({},s.headers),{Authorization:`Bearer ${(u=(p=(d=this.hass)==null?void 0:d.auth)==null?void 0:p.data)==null?void 0:u.access_token}`})})),a=await n.text();if(!n.ok)throw new Error(Ut(n.status,a));try{return a?JSON.parse(a):null}catch(f){return null}}async _fetchAudio(t){var o,n,a,l;let e=ne(t),i=(o=this.hass)!=null&&o.fetchWithAuth?await this.hass.fetchWithAuth(e):await fetch(e,{headers:{Authorization:`Bearer ${(l=(a=(n=this.hass)==null?void 0:n.auth)==null?void 0:a.data)==null?void 0:l.access_token}`}});if(!i.ok)throw new Error(Ut(i.status,await i.text()));let s=await i.arrayBuffer();return new Blob([s],{type:i.headers.get("content-type")||"audio/wav"})}async _try(t){this._busy=!0,this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}finally{this._busy=!1}}async _load(){await this._try(async()=>{let t=await this._api(_.status());this._applyStatus(t),t!=null&&t.recording&&(this._kind=t.kind||this._kind,this._label=t.label||this._label,this._since=this._since||Date.now(),this._startPolling())}),this._loaded=!0,await Promise.all([this._loadClips(),this._loadPeople(),this._loadLinks(),this._loadTrain()])}async _loadClips(){let t=await this._try(()=>this._api(_.clips(this._fKind?{kind:this._fKind}:{})));Array.isArray(t)?this._clips=t:t&&Array.isArray(t.clips)&&(this._clips=t.clips)}async _loadPeople(){let t=await this._try(()=>this._api(_.people()));t&&typeof t=="object"&&(this._people=t)}async _loadLinks(){try{let t=await this._api(_.links());this._links=(t==null?void 0:t.people)||{}}catch(t){this._links=null}}async _loadTrain(){let t=await this._try(()=>this._api(_.trainStatus()));t&&(this._train=t);let e=!!(t!=null&&t.running);e&&!this._trainTimer?this._trainTimer=setInterval(()=>this._loadTrain(),de):!e&&this._trainTimer&&(clearInterval(this._trainTimer),this._trainTimer=null)}_applyStatus(t){this._status=t||{recording:!1},t!=null&&t.recording?(this._levels=[...this._levels.slice(-11),Number(t.level)||0],this._elapsed=t.seconds!=null?Number(t.seconds):t.started?Date.now()/1e3-Number(t.started):this._elapsed+It/1e3):(this._levels=[],this._elapsed=0)}_startPolling(){this._poll||(this._poll=setInterval(async()=>{try{let t=await this._api(_.status());this._applyStatus(t),t!=null&&t.recording||this._recordingEnded()}catch(t){this._err=(t==null?void 0:t.message)||String(t),this._stopPolling(),this._status={recording:!1}}},It))}_stopPolling(){clearInterval(this._poll),this._poll=null}_recordingEnded(){this._stopPolling(),this._levels=[],this._fKind=this._kind,this._fLabel="",this._loadClips()}async _toggleRecord(){var i;if((i=this._status)!=null&&i.recording){await this._try(()=>this._api(_.stop())),this._status={recording:!1},this._recordingEnded();return}let t=this._label.trim();if(!t){this._err=this._kind==="voice"?"whose voice is this?":"give the recording a label first";return}let e=await this._try(()=>this._api(_.start(this._kind,t)));e!==void 0&&(this._since=Date.now(),this._levels=[],this._elapsed=0,this._status=b({recording:!0,kind:this._kind,label:t},e||{}),this._startPolling())}async _delete(t){var e;t.length&&((e=this._player)==null||e.stop(),await this._try(async()=>{for(let i of t)await this._api(_.deleteClip(i)),this._clips=this._clips.filter(s=>s.id!==i),this._sel.delete(i)}),this._sel=new Set(this._sel))}async _refile(){let t=[...this._sel],e={};this._refileKind&&(e.kind=this._refileKind),this._refileLabel.trim()&&(e.label=this._refileLabel.trim()),!(!t.length||!Object.keys(e).length)&&(await this._try(async()=>{for(let i of t)await this._api(_.refile(i,e)),this._clips=this._clips.map(s=>s.id===i?b(b({},s),e):s)}),this._sel=new Set,this._refileLabel="",this._fKind&&e.kind&&e.kind!==this._fKind&&this._loadClips())}async _enrol(){let t=this._enrolTo.trim(),e=[...this._sel].filter(s=>{var o;return((o=this._clips.find(n=>n.id===s))==null?void 0:o.kind)==="voice"});!t||!e.length||await this._try(()=>this._api(_.enroll(t,e)))===void 0||(this._sel=new Set,this._loadPeople())}async _deletePerson(t){if(!confirm(`Forget ${t}'s voice? Their enrolled samples go too.`))return;let e=await this._try(()=>this._api(_.deletePerson(t)));e&&typeof e=="object"?this._people=e:this._loadPeople()}_openLink(t){this._linking=t,this._linkId="",this._linkSecret="",this._linkErr=""}async _link(){let t=this._linking,e=this._linkId.trim();if(!(!t||!e||!this._linkSecret)){this._busy=!0,this._linkErr="";try{let i=await this._api(_.link(t,e,this._linkSecret));this._links=I(b({},this._links||{}),{[i.person]:{linked:!0,client_id_hint:i.client_id_hint}}),this._linking=""}catch(i){this._linkErr=(i==null?void 0:i.message)||String(i)}finally{this._linkSecret="",this._busy=!1}}}async _unlink(t){if(!confirm(`Unlink ${t} from Hubbubb? The house stops acting as them there.`)||!await this._try(()=>this._api(_.unlink(t))))return;let i=b({},this._links||{});for(let s of Object.keys(i))s.toLowerCase()===t.toLowerCase()&&(i[s]={linked:!1});this._links=i}async _train(){var i;let t=this._phrase.trim();if(!this._armed||!Dt(t)||(i=this._train)!=null&&i.running)return;let e=await this._try(()=>this._api(_.train(t)));this._armed=!1,e&&(this._train=e),this._loadTrain()}_play(t){if(this._playing===t)return this._player.stop();this._player.play(t).catch(e=>this._err=(e==null?void 0:e.message)||String(e))}_toggleSel(t,e){let i=new Set(this._sel);e?i.add(t):i.delete(t),this._sel=i}_setFilterKind(t){this._fKind=t,this._fLabel="",this._sel=new Set,this._loadClips()}render(){var e;let t=!!((e=this._status)!=null&&e.recording);return c`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Voice studio</div>
      </div>
      ${this._err?c`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:h}
      <div class="cols">
        <div class="col side">
          ${this._renderRecord(t)}
          ${this._renderPeople()}
          ${this._renderTrain()}
        </div>
        <div class="col main">
          ${this._since?this._renderList("Just recorded",Mt(this._clips,{since:this._since}),!0):h}
          ${this._renderLibrary()}
        </div>
      </div>
    `}_renderRecord(t){var n;let e=Object.keys(this._people),i=this._kind==="voice"?e:Ht(this._clips,this._kind),s=t&&le(this._levels),o=this._levels[this._levels.length-1]||0;return c`
      <ha-card class="card">
        <div class="h">Record</div>
        <div class="seg">
          ${q.map(a=>c`<button
              class="segb ${this._kind===a.id?"on":""}"
              ?disabled=${t}
              @click=${()=>{this._kind=a.id,this._label=""}}
            >${a.name}</button>`)}
        </div>
        <div class="hint">${(n=q.find(a=>a.id===this._kind))==null?void 0:n.hint}</div>
        <input
          class="input"
          list="vs-labels"
          .value=${this._label}
          ?disabled=${t}
          placeholder=${this._kind==="wake"?"wake phrase, e.g. hey jarvis":this._kind==="voice"?"who is speaking":"what it is, e.g. dishwasher"}
          @input=${a=>this._label=a.target.value}
        />
        <datalist id="vs-labels">${i.map(a=>c`<option value=${a}></option>`)}</datalist>
        <button class="big ${t?"stop":"start"}" ?disabled=${this._busy||!this._loaded} @click=${this._toggleRecord}>
          ${t?"Stop":"Start recording"}
        </button>
        ${t?c`
              <div class="live">
                <span class="elapsed">${he(this._elapsed)}</span>
                <span class="what">${this._status.kind} · ${this._status.label}</span>
              </div>
              <div class="meter ${s?"dead":""}"><div class="fill" style="width:${zt(o)}%"></div></div>
              ${s?c`<div class="warn">Nothing is coming from the microphone. Check it before you carry on.</div>`:c`<div class="hint">Level ${zt(o)}%</div>`}
            `:h}
      </ha-card>
    `}_renderLibrary(){let t=Ht(this._clips,this._fKind),e=Mt(this._clips,{kind:this._fKind,label:this._fLabel});return c`
      <ha-card class="card">
        <div class="h">Library <span class="count">${e.length}</span></div>
        <div class="chips">
          <button class="chip ${this._fKind?"":"on"}" @click=${()=>this._setFilterKind("")}>All</button>
          ${q.map(i=>c`<button class="chip ${this._fKind===i.id?"on":""}" @click=${()=>this._setFilterKind(i.id)}>${i.name}</button>`)}
        </div>
        ${t.length?c`<div class="chips">
              ${t.map(i=>c`<button
                  class="chip ${this._fLabel===i?"on":""}"
                  @click=${()=>this._fLabel=this._fLabel===i?"":i}
                >${i}</button>`)}
            </div>`:h}
        ${this._renderSelBar(e)}
        ${e.length?e.map(i=>this._renderRow(i)):c`<div class="empty">${this._loaded?"Nothing here yet. Record something.":"Loading\u2026"}</div>`}
      </ha-card>
    `}_renderList(t,e,i){return i&&!e.length?h:c`
      <ha-card class="card">
        <div class="h">${t} <span class="count">${e.length}</span></div>
        ${e.map(s=>this._renderRow(s))}
      </ha-card>
    `}_renderSelBar(t){let e=this._sel.size,i=t.length&&t.every(n=>this._sel.has(n.id)),s=e&&[...this._sel].every(n=>{var a;return((a=this._clips.find(l=>l.id===n))==null?void 0:a.kind)==="voice"}),o=Object.keys(this._people);return c`
      <div class="selbar">
        <label class="sel-all">
          <input type="checkbox" .checked=${!!i} ?disabled=${!t.length}
            @change=${n=>this._sel=n.target.checked?new Set([...this._sel,...t.map(a=>a.id)]):new Set} />
          ${e?`${e} selected`:"Select all"}
        </label>
        ${e?c`
              <button class="btn danger" ?disabled=${this._busy} @click=${()=>this._delete([...this._sel])}>Delete ${e}</button>
              <span class="grp">
                <select class="input sm" .value=${this._refileKind} @change=${n=>this._refileKind=n.target.value}>
                  <option value="">keep kind</option>
                  ${q.map(n=>c`<option value=${n.id}>${n.name}</option>`)}
                </select>
                <input class="input sm" placeholder="new label" .value=${this._refileLabel} @input=${n=>this._refileLabel=n.target.value} />
                <button class="btn" ?disabled=${this._busy||!this._refileKind&&!this._refileLabel.trim()} @click=${this._refile}>Re-file</button>
              </span>
              ${s?c`<span class="grp">
                    <input class="input sm" list="vs-people" placeholder="enrol into…" .value=${this._enrolTo} @input=${n=>this._enrolTo=n.target.value} />
                    <datalist id="vs-people">${o.map(n=>c`<option value=${n}></option>`)}</datalist>
                    <button class="btn" ?disabled=${this._busy||!this._enrolTo.trim()} @click=${this._enrol}>Enrol</button>
                  </span>`:h}
            `:h}
      </div>
    `}_renderRow(t){let e=this._sel.has(t.id),i=this._playing===t.id,s=F(t.created);return c`
      <div class="row ${e?"on":""}">
        <input type="checkbox" .checked=${e} @change=${o=>this._toggleSel(t.id,o.target.checked)} />
        <div class="body" @click=${()=>this._toggleSel(t.id,!e)}>
          <div class="text ${t.transcript?"":"none"}">${t.transcript||"no transcript"}</div>
          <div class="meta">
            ${t.kind} · ${t.label} · ${Number(t.seconds||0).toFixed(1)}s
            ${s?c` · ${new Date(s).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}`:h}
          </div>
        </div>
        <button class="btn icon" title=${i?"Stop":"Play"} @click=${()=>this._play(t.id)}>${i?"\u25A0":"\u25B6"}</button>
        <button class="btn icon danger" title="Delete" ?disabled=${this._busy} @click=${()=>this._delete([t.id])}>✕</button>
      </div>
    `}_renderPeople(){var i,s;let t=oe(this._people,this._links),e=!!((s=(i=this.hass)==null?void 0:i.user)!=null&&s.is_admin);return c`
      <ha-card class="card">
        <div class="h">People</div>
        ${t.length?t.map(o=>this._renderPerson(o,e)):c`<div class="empty">Nobody enrolled. Record "Voice" clips, select them, and enrol.</div>`}
      </ha-card>
    `}_renderPerson({name:t,samples:e,link:i},s){let o=s&&this._linking===t,n=i?i.linked?`Hubbubb: linked \xB7 ${i.hint}`:"Hubbubb: not linked":h;return c`<div class="row">
        <div class="body">
          <div class="text">${t}</div>
          <div class="meta">${e?`${e} sample${e===1?"":"s"}`:"no voice samples"}${i?c` · ${n}`:h}</div>
        </div>
        ${s&&i&&!o?i.linked?c`<button class="btn" ?disabled=${this._busy} @click=${()=>this._unlink(t)}>Unlink</button>`:c`<button class="btn" ?disabled=${this._busy} @click=${()=>this._openLink(t)}>Link</button>`:h}
        ${e?c`<button class="btn icon danger" title="Forget" ?disabled=${this._busy} @click=${()=>this._deletePerson(t)}>✕</button>`:h}
      </div>
      ${o?c`<div class="linkform">
            <div class="hint">${t}'s own Hubbubb API client. The pair is checked against Hubbubb before it is kept; the secret is never shown again.</div>
            <input class="input" placeholder="client id" autocomplete="off" .value=${this._linkId} @input=${a=>this._linkId=a.target.value} />
            <input class="input" type="password" placeholder="client secret" autocomplete="new-password" .value=${this._linkSecret} @input=${a=>this._linkSecret=a.target.value} />
            ${this._linkErr?c`<div class="warn">${this._linkErr}</div>`:h}
            <div class="chips">
              <button class="btn" ?disabled=${this._busy||!this._linkId.trim()||!this._linkSecret} @click=${()=>this._link()}>${this._busy?"Checking\u2026":"Verify and link"}</button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._openLink("")}>Cancel</button>
            </div>
          </div>`:h}`}_renderTrain(){let t=this._train||{},e=!!t.running,i=this._phrase||(this._kind==="wake"?this._label:""),s=e?`Training "${t.phrase}" since ${t.started?new Date(Number(t.started)*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"earlier"}. The house will say when it is done.`:t.phrase?`Last run: "${t.phrase}" ${t.ok?"finished and is ready to load onto a puck":`failed (see ${t.out||"the log"})`}.`:"No training run yet.";return c`
      <ha-card class="card">
        <div class="h">Train wake word</div>
        <div class="hint">${s}</div>
        <input class="input" placeholder="phrase, one to four words" .value=${i} ?disabled=${e}
          @input=${o=>this._phrase=o.target.value} />
        <label class="arm">
          <input type="checkbox" .checked=${this._armed} ?disabled=${e} @change=${o=>this._armed=o.target.checked} />
          <span>This takes hours and ties up the Mac. Start it now.</span>
        </label>
        <button class="btn wide" ?disabled=${e||!this._armed||!Dt(i)||this._busy}
          @click=${()=>{this._phrase=i,this._train()}}>
          ${e?"Training\u2026":"Train"}
        </button>
      </ha-card>
    `}};B(P,"build",Bt),B(P,"properties",{hass:{attribute:!1,hasChanged:()=>!1},narrow:{type:Boolean},panel:{},route:{},_status:{state:!0},_levels:{state:!0},_elapsed:{state:!0},_clips:{state:!0},_people:{state:!0},_links:{state:!0},_linking:{state:!0},_linkId:{state:!0},_linkSecret:{state:!0},_linkErr:{state:!0},_train:{state:!0},_kind:{state:!0},_label:{state:!0},_fKind:{state:!0},_fLabel:{state:!0},_sel:{state:!0},_err:{state:!0},_busy:{state:!0},_playing:{state:!0},_since:{state:!0},_refileKind:{state:!0},_refileLabel:{state:!0},_enrolTo:{state:!0},_phrase:{state:!0},_armed:{state:!0},_loaded:{state:!0}}),B(P,"styles",G`
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
      z-index: 2;
    }
    .title {
      font-size: 20px;
      font-weight: 400;
    }
    .err {
      margin: 12px 16px 0;
      padding: 10px 14px;
      border-radius: 8px;
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.14);
      color: var(--error-color, #db4437);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .err .x {
      opacity: 0.7;
      font-size: 12px;
      white-space: nowrap;
    }
    .cols {
      display: grid;
      grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
      gap: 16px;
      padding: 16px;
      max-width: 1280px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    @media (max-width: 760px) {
      .cols {
        grid-template-columns: minmax(0, 1fr);
        padding: 12px;
      }
    }
    .col {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    .card {
      padding: 14px 16px;
    }
    .h {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .count {
      font-weight: 400;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .hint,
    .empty {
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.4;
      margin: 6px 0;
    }
    .empty {
      padding: 12px 0 4px;
    }
    .seg {
      display: flex;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      overflow: hidden;
    }
    .segb {
      flex: 1;
      min-height: 44px;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .segb + .segb {
      border-left: 1px solid var(--divider-color);
    }
    .segb.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .input {
      width: 100%;
      box-sizing: border-box;
      min-height: 44px;
      margin: 8px 0;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .input.sm {
      width: auto;
      min-height: 36px;
      margin: 0;
      flex: 1 1 110px;
      min-width: 0;
    }
    .big {
      width: 100%;
      min-height: 64px;
      border: none;
      border-radius: 12px;
      font: inherit;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
    }
    .big.stop {
      background: var(--error-color, #db4437);
    }
    .big:disabled,
    .btn:disabled,
    .segb:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .live {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 12px;
    }
    .elapsed {
      font-size: 28px;
      font-variant-numeric: tabular-nums;
    }
    .what {
      color: var(--secondary-text-color);
      font-size: 13px;
      text-transform: capitalize;
    }
    .meter {
      height: 14px;
      border-radius: 7px;
      background: var(--divider-color);
      overflow: hidden;
      margin-top: 8px;
    }
    .meter .fill {
      height: 100%;
      background: var(--primary-color);
      transition: width 0.25s linear;
    }
    .meter.dead {
      outline: 2px solid var(--error-color, #db4437);
    }
    .warn {
      margin-top: 8px;
      color: var(--error-color, #db4437);
      font-weight: 500;
      line-height: 1.4;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .chip,
    .btn {
      border: none;
      border-radius: 16px;
      min-height: 36px;
      padding: 6px 14px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color);
    }
    .chip.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.danger {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
      color: var(--error-color, #db4437);
    }
    .btn.icon {
      min-width: 44px;
      min-height: 44px;
      padding: 0;
      border-radius: 22px;
      font-size: 16px;
    }
    .btn.wide {
      width: 100%;
      min-height: 44px;
    }
    .selbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      min-height: 44px;
    }
    .sel-all {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
      min-height: 36px;
    }
    .grp {
      display: flex;
      gap: 6px;
      align-items: center;
      flex: 1 1 260px;
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin: 0;
      flex: none;
      accent-color: var(--primary-color);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      min-height: 52px;
    }
    .row + .row {
      border-top: 1px solid var(--divider-color);
    }
    .row.on {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
    }
    .body {
      flex: 1;
      min-width: 0;
      cursor: pointer;
    }
    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .text.none {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .meta {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-top: 2px;
    }
    .linkform {
      padding: 4px 0 10px;
      border-top: 1px dashed var(--divider-color);
    }
    .linkform + .row {
      border-top: 1px solid var(--divider-color);
    }
    .arm {
      display: flex;
      gap: 10px;
      align-items: center;
      margin: 8px 0 10px;
      line-height: 1.4;
      cursor: pointer;
    }
  `);customElements.define("hubbubb-voice-studio",P);export{Kt as API_BASE,ae as DEAD_FLOOR,q as KINDS,ht as LINKS_PATH,_ as api,ne as audioPath,F as clipTime,le as deadMic,Ut as errMessage,Mt as filterClips,he as fmtElapsed,Ht as labelsOf,ce as makePlayer,zt as meterPct,oe as peopleRows,Dt as validPhrase};
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
