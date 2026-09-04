var qt=Object.defineProperty,Vt=Object.defineProperties;var Gt=Object.getOwnPropertyDescriptors;var _t=Object.getOwnPropertySymbols;var Jt=Object.prototype.hasOwnProperty,Xt=Object.prototype.propertyIsEnumerable;var V=(n,t,e)=>t in n?qt(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,$=(n,t)=>{for(var e in t||(t={}))Jt.call(t,e)&&V(n,e,t[e]);if(_t)for(var e of _t(t))Xt.call(t,e)&&V(n,e,t[e]);return n},z=(n,t)=>Vt(n,Gt(t));var B=(n,t,e)=>V(n,typeof t!="symbol"?t+"":t,e);var j=globalThis,K=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),gt=new WeakMap,L=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(K&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=gt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&gt.set(e,t))}return t}toString(){return this.cssText}},ft=n=>new L(typeof n=="string"?n:n+"",void 0,G),J=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((i,s,o)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[o+1],n[0]);return new L(e,n,G)},bt=(n,t)=>{if(K)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=j.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},X=K?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return ft(e)})(n):n;var{is:Yt,defineProperty:Zt,getOwnPropertyDescriptor:Qt,getOwnPropertyNames:te,getOwnPropertySymbols:ee,getPrototypeOf:ie}=Object,m=globalThis,$t=m.trustedTypes,se=$t?$t.emptyScript:"",Y=m.reactiveElementPolyfillSupport,M=(n,t)=>n,Z={toAttribute(n,t){switch(t){case Boolean:n=n?se:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch(i){e=null}}return e}},xt=(n,t)=>!Yt(n,t),mt={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:xt},vt,yt;(vt=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(yt=m.litPropertyMetadata)!=null||(m.litPropertyMetadata=new WeakMap);var b=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=mt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Zt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){var r;let{get:s,set:o}=(r=Qt(this.prototype,t))!=null?r:{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let l=s==null?void 0:s.call(this);o==null||o.call(this,a),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:mt}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let t=ie(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let e=this.properties,i=[...te(e),...ee(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(X(s))}else t!==void 0&&e.push(X(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,i;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return bt(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostConnected)==null?void 0:s.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){var o;let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:Z).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){var o,r,a;let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let l=i.getPropertyOptions(s),d=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Z;this._$Em=s;let p=d.fromAttribute(e,l.type);this[s]=(a=p!=null?p:(r=this._$Ej)==null?void 0:r.get(s))!=null?a:p,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){var r,a;if(t!==void 0){let l=this.constructor;if(s===!1&&(o=this[t]),i!=null||(i=l.getPropertyOptions(t)),!(((r=i.hasChanged)!=null?r:xt)(o,e)||i.useDefault&&i.reflect&&o===((a=this._$Ej)==null?void 0:a.get(t))&&!this.hasAttribute(l._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){var a,l,d;i&&!((a=this._$Ej)!=null?a:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(l=r!=null?r:e)!=null?l:this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&((d=this._$Eq)!=null?d:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i,s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((i=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[r,a]of o){let{wrapped:l}=a,d=this[r];l!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,a,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(o=>{var r;return(r=o.hostUpdate)==null?void 0:r.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},kt;b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[M("elementProperties")]=new Map,b[M("finalized")]=new Map,Y==null||Y({ReactiveElement:b}),((kt=m.reactiveElementVersions)!=null?kt:m.reactiveElementVersions=[]).push("2.1.2");var U=globalThis,wt=n=>n,W=U.trustedTypes,St=W?W.createPolicy("lit-html",{createHTML:n=>n}):void 0,Mt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,Nt="?"+v,ne=`<${Nt}>`,w=document,O=()=>w.createComment(""),R=n=>n===null||typeof n!="object"&&typeof n!="function",ot=Array.isArray,re=n=>ot(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Q=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,At=/-->/g,Et=/>/g,k=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,Tt=/"/g,Ut=/^(?:script|style|textarea|title)$/i,at=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),h=at(1),Ce=at(2),Te=at(3),S=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Pt=new WeakMap,x=w.createTreeWalker(w,129);function Ot(n,t){if(!ot(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(t):t}var oe=(n,t)=>{let e=n.length-1,i=[],s,o=t===2?"<svg>":t===3?"<math>":"",r=N;for(let a=0;a<e;a++){let l=n[a],d,p,u=-1,g=0;for(;g<l.length&&(r.lastIndex=g,p=r.exec(l),p!==null);)g=r.lastIndex,r===N?p[1]==="!--"?r=At:p[1]!==void 0?r=Et:p[2]!==void 0?(Ut.test(p[2])&&(s=RegExp("</"+p[2],"g")),r=k):p[3]!==void 0&&(r=k):r===k?p[0]===">"?(r=s!=null?s:N,u=-1):p[1]===void 0?u=-2:(u=r.lastIndex-p[2].length,d=p[1],r=p[3]===void 0?k:p[3]==='"'?Tt:Ct):r===Tt||r===Ct?r=k:r===At||r===Et?r=N:(r=k,s=void 0);let f=r===k&&n[a+1].startsWith("/>")?" ":"";o+=r===N?l+ne:u>=0?(i.push(d),l.slice(0,u)+Mt+l.slice(u)+v+f):l+v+(u===-2?a:f)}return[Ot(n,o+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},I=class n{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0,a=t.length-1,l=this.parts,[d,p]=oe(t,e);if(this.el=n.createElement(d,i),x.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=x.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(Mt)){let g=p[r++],f=s.getAttribute(u).split(v),D=/([.?@])?(.*)/.exec(g);l.push({type:1,index:o,name:D[2],strings:f,ctor:D[1]==="."?it:D[1]==="?"?st:D[1]==="@"?nt:C}),s.removeAttribute(u)}else u.startsWith(v)&&(l.push({type:6,index:o}),s.removeAttribute(u));if(Ut.test(s.tagName)){let u=s.textContent.split(v),g=u.length-1;if(g>0){s.textContent=W?W.emptyScript:"";for(let f=0;f<g;f++)s.append(u[f],O()),x.nextNode(),l.push({type:2,index:++o});s.append(u[g],O())}}}else if(s.nodeType===8)if(s.data===Nt)l.push({type:2,index:o});else{let u=-1;for(;(u=s.data.indexOf(v,u+1))!==-1;)l.push({type:7,index:o}),u+=v.length-1}o++}}static createElement(t,e){let i=w.createElement("template");return i.innerHTML=t,i}};function E(n,t,e=n,i){var r,a,l;if(t===S)return t;let s=i!==void 0?(r=e._$Co)==null?void 0:r[i]:e._$Cl,o=R(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),o===void 0?s=void 0:(s=new o(n),s._$AT(n,e,i)),i!==void 0?((l=e._$Co)!=null?l:e._$Co=[])[i]=s:e._$Cl=s),s!==void 0&&(t=E(n,s._$AS(n,t.values),s,i)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var d;let{el:{content:e},parts:i}=this._$AD,s=((d=t==null?void 0:t.creationScope)!=null?d:w).importNode(e,!0);x.currentNode=s;let o=x.nextNode(),r=0,a=0,l=i[0];for(;l!==void 0;){if(r===l.index){let p;l.type===2?p=new H(o,o.nextSibling,this,t):l.type===1?p=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(p=new rt(o,this,t)),this._$AV.push(p),l=i[++a]}r!==(l==null?void 0:l.index)&&(o=x.nextNode(),r++)}return x.currentNode=w,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},H=class n{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,i,s){var o;this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(o=s==null?void 0:s.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),R(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):re(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=I.createElement(Ot(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(e);else{let r=new et(s,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(t){let e=Pt.get(t.strings);return e===void 0&&Pt.set(t.strings,e=new I(t)),e}k(t){ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let o of t)s===e.length?e.push(i=new n(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t!==this._$AB;){let s=wt(t).nextSibling;wt(t).remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,s){let o=this.strings,r=!1;if(o===void 0)t=E(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==S,r&&(this._$AH=t);else{let a=t,l,d;for(t=o[0],l=0;l<o.length-1;l++)d=E(this,a[i+l],e,l),d===S&&(d=this._$AH[l]),r||(r=!R(d)||d!==this._$AH[l]),d===c?t=c:t!==c&&(t+=(d!=null?d:"")+o[l+1]),this._$AH[l]=d}r&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},it=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},st=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},nt=class extends C{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var r;if((t=(r=E(this,t,e,0))!=null?r:c)===S)return;let i=this._$AH,s=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)==null?void 0:e.host)!=null?i:this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var tt=U.litHtmlPolyfillSupport,Lt;tt==null||tt(I,H),((Lt=U.litHtmlVersions)!=null?Lt:U.litHtmlVersions=[]).push("3.3.3");var Rt=(n,t,e)=>{var o,r;let i=(o=e==null?void 0:e.renderBefore)!=null?o:t,s=i._$litPart$;if(s===void 0){let a=(r=e==null?void 0:e.renderBefore)!=null?r:null;i._$litPart$=s=new H(t.insertBefore(O(),a),a,void 0,e!=null?e:{})}return s._$AI(n),s};var A=globalThis,y=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,i;let t=super.createRenderRoot();return(i=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return S}},It;y._$litElement$=!0,y.finalized=!0,(It=A.litElementHydrateSupport)==null||It.call(A,{LitElement:y});var lt=A.litElementPolyfillSupport;lt==null||lt({LitElement:y});var Ht;((Ht=A.litElementVersions)!=null?Ht:A.litElementVersions=[]).push("4.2.2");var Wt=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-voice-studio ${Wt}`);var Ft="/api/hubbubb_home/voice/",ht="/api/hubbubb_home/people/links",ae="/api/hubbubb_home/oauth/start",F=[{id:"wake",name:"Wake word",hint:"the phrase, said the way you say it"},{id:"ambient",name:"Room noise",hint:"what it must not wake to"},{id:"voice",name:"Voice",hint:"a person, for speaker matching"}],P=encodeURIComponent,ct=(n={})=>{let t=Object.entries(n).filter(([,e])=>e!=null&&e!=="").map(([e,i])=>`${P(e)}=${P(i)}`).join("&");return t?`?${t}`:""},_={status:()=>["GET","record/status"],start:(n,t)=>["POST","record/start",{kind:n,label:t}],stop:()=>["POST","record/stop"],clips:n=>["GET",`clips${ct(n)}`],deleteClip:n=>["DELETE",`clips/${P(n)}`],refile:(n,t)=>["POST",`clips/${P(n)}`,t],people:()=>["GET","people"],enroll:(n,t)=>["POST","people/enroll",{person:n,clips:t}],deletePerson:n=>["POST","people/delete",{person:n}],train:n=>["POST","train",{phrase:n}],trainStatus:()=>["GET","train/status"],upload:(n,t)=>["POST",`clips/upload${ct({kind:"voice",label:n})}`,t,"audio/wav"],links:()=>["GET",ht],link:(n,t,e)=>["POST",ht,{person:n,client_id:t,client_secret:e}],unlink:n=>["DELETE",`${ht}/${P(n)}`],signIn:n=>["GET",`${ae}${ct({person:n})}`]},le=n=>`${Ft}clips/${P(n)}/audio`;function Dt(n,t){let e=typeof t=="string"?t:"";try{let i=typeof t=="string"?JSON.parse(t):t;e=(i==null?void 0:i.message)||(i==null?void 0:i.error)||(i==null?void 0:i.detail)||""}catch(i){}return e=(e||"").trim(),e||(e=n===503?"the voice service is not reachable":`request failed (${n})`),e}var q=n=>{if(typeof n=="number")return n<1e12?n*1e3:n;let t=Date.parse(n);return Number.isFinite(t)?t:0};function zt(n,{kind:t,label:e,since:i}={}){return(n||[]).filter(s=>!t||s.kind===t).filter(s=>!e||s.label===e).filter(s=>!i||q(s.created)>=i).sort((s,o)=>q(o.created)-q(s.created))}function he(n,t){let e=new Map;for(let[i,s]of Object.entries(n||{}))e.set(i.toLowerCase(),{name:i,samples:s,link:null});for(let[i,s]of Object.entries(t||{})){let o=i.toLowerCase(),r=e.get(o)||{name:i,samples:0,link:null};r.link=s!=null&&s.linked?{linked:!0,via:s.via==="signin"?"signin":"key",hint:s.client_id_hint||"",identity:s.identity||null,needsReauth:!!s.needs_reauth}:{linked:!1},e.set(o,r)}return[...e.values()].sort((i,s)=>i.name.localeCompare(s.name,void 0,{sensitivity:"base"}))}function dt(n){if(!n)return"";if(!n.linked)return"Hubbubb: not linked";if(n.needsReauth)return"Hubbubb: sign-in lapsed, sign in again";let t=n.via==="signin"?" \xB7 signed in":n.via==="key"?" \xB7 pasted key":"";if(!n.identity)return n.via==="signin"?`Hubbubb: linked${t}`:`Hubbubb: linked \xB7 ${n.hint}`;let e=n.identity.lastIndexOf(",");return e<0?`Hubbubb: ${n.identity}${t}`:`Hubbubb: ${n.identity.slice(0,e).trim()} (${n.identity.slice(e+1).trim()})${t}`}var ce=n=>!!(n!=null&&n.linked&&n.via==="signin"&&!n.needs_reauth);function Bt(n,t){let e=new Map;for(let i of n||[])t&&i.kind!==t||i.label&&e.set(i.label,(e.get(i.label)||0)+1);return[...e.entries()].sort((i,s)=>s[1]-i[1]||i[0].localeCompare(s[0])).map(([i])=>i)}var jt=n=>{let t=Number(n);return!Number.isFinite(t)||t<=0?0:Math.round(Math.min(1,Math.sqrt(t))*100)},de=.002;function pe(n,t=de,e=6){return!n||n.length<e?!1:n.slice(-e).every(i=>!(Number(i)>t))}function ue(n){n=Math.max(0,Math.floor(Number(n)||0));let t=Math.floor(n/3600),e=Math.floor(n%3600/60),i=n%60,s=t?String(e).padStart(2,"0"):String(e);return(t?`${t}:${s}:`:`${e}:`)+String(i).padStart(2,"0")}var Kt=n=>{let t=String(n||"").trim().split(/\s+/).filter(Boolean);return t.length>=1&&t.length<=4&&t.every(e=>/^[a-z]+$/i.test(e))},ut=16e3,_e=60,ge=n=>{var t,e;return!!(n!=null&&n.isSecureContext&&typeof((e=(t=n.navigator)==null?void 0:t.mediaDevices)==null?void 0:e.getUserMedia)=="function")};function fe(n,t,e){return t?e?{source:"mac",choice:!1,text:"This device refused microphone permission, so the Mac's microphone beside the puck will be used."}:n==="mac"?{source:"mac",choice:!0,text:"The Mac's microphone beside the puck will record. You need to be in that room."}:{source:"device",choice:!0,text:"This device's microphone will record. Speak from wherever you are."}:{source:"mac",choice:!1,text:"This device cannot record over a plain http:// address, so the Mac's microphone beside the puck will be used."}}function be(n,t,e=ut){if(t===e)return n;let i=Math.floor(n.length*e/t),s=new Float32Array(i),o=t/e;for(let r=0;r<i;r++){let a=r*o,l=Math.floor(a),d=Math.min(l+1,n.length-1);s[r]=n[l]+(n[d]-n[l])*(a-l)}return s}function $e(n,t=ut){let e=n.length,i=new ArrayBuffer(44+e*2),s=new DataView(i),o=(r,a)=>{for(let l=0;l<a.length;l++)s.setUint8(r+l,a.charCodeAt(l))};o(0,"RIFF"),s.setUint32(4,36+e*2,!0),o(8,"WAVE"),o(12,"fmt "),s.setUint32(16,16,!0),s.setUint16(20,1,!0),s.setUint16(22,1,!0),s.setUint32(24,t,!0),s.setUint32(28,t*2,!0),s.setUint16(32,2,!0),s.setUint16(34,16,!0),o(36,"data"),s.setUint32(40,e*2,!0);for(let r=0;r<e;r++){let a=Math.max(-1,Math.min(1,n[r]));s.setInt16(44+r*2,a<0?a*32768:a*32767,!0)}return i}function me({fetchBytes:n,audio:t,urls:e=URL,onstate:i=()=>{}}){let s=null,o=null,r=()=>{s&&e.revokeObjectURL(s),s=null,o=null};return t.onended=()=>{r(),i(null)},{async play(a){t.pause(),r();let l=await n(a);r(),s=e.createObjectURL(l),o=a,t.src=s,i(a);try{await t.play()}catch(d){throw r(),i(null),d}},stop(){t.pause(),r(),i(null)},dispose(){t.pause(),t.onended=null,r()},get playing(){return o}}}var pt=500,ve=6e4,ye=2e3,ke=600,T=class extends y{constructor(){super(),this._status=null,this._levels=[],this._elapsed=0,this._clips=[],this._people={},this._links=null,this._linking="",this._linkId="",this._linkSecret="",this._linkErr="",this._linkNote=null,this._signin=!1,this._signing="",this._signUrl="",this._signRedirect="",this._signErr="",this._train=null,this._kind="wake",this._label="",this._fKind="",this._fLabel="",this._sel=new Set,this._err="",this._busy=!1,this._playing=null,this._since=0,this._refileKind="",this._refileLabel="",this._enrolTo="",this._phrase="",this._armed=!1,this._loaded=!1,this._source="device",this._micDenied=!1}connectedCallback(){super.connectedCallback(),this._player=me({audio:new Audio,fetchBytes:t=>this._fetchAudio(t),onstate:t=>this._playing=t}),this._load()}disconnectedCallback(){var t;super.disconnectedCallback(),this._releaseMic(),this._stopPolling(),clearInterval(this._trainTimer),this._cancelSignIn(),this._trainTimer=null,(t=this._player)==null||t.dispose(),this._player=null}async _api([t,e,i,s]){var d,p,u,g;let o={method:t,headers:i?{"Content-Type":s||"application/json"}:{},body:i?s?i:JSON.stringify(i):void 0},r=e.startsWith("/")?e:Ft+e,a=(d=this.hass)!=null&&d.fetchWithAuth?await this.hass.fetchWithAuth(r,o):await fetch(r,z($({},o),{headers:z($({},o.headers),{Authorization:`Bearer ${(g=(u=(p=this.hass)==null?void 0:p.auth)==null?void 0:u.data)==null?void 0:g.access_token}`})})),l=await a.text();if(!a.ok)throw new Error(Dt(a.status,l));try{return l?JSON.parse(l):null}catch(f){return null}}async _fetchAudio(t){var o,r,a,l;let e=le(t),i=(o=this.hass)!=null&&o.fetchWithAuth?await this.hass.fetchWithAuth(e):await fetch(e,{headers:{Authorization:`Bearer ${(l=(a=(r=this.hass)==null?void 0:r.auth)==null?void 0:a.data)==null?void 0:l.access_token}`}});if(!i.ok)throw new Error(Dt(i.status,await i.text()));let s=await i.arrayBuffer();return new Blob([s],{type:i.headers.get("content-type")||"audio/wav"})}async _try(t){this._busy=!0,this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}finally{this._busy=!1}}async _load(){await this._try(async()=>{let t=await this._api(_.status());this._applyStatus(t),t!=null&&t.recording&&(this._kind=t.kind||this._kind,this._label=t.label||this._label,this._since=this._since||Date.now(),this._startPolling())}),this._loaded=!0,await Promise.all([this._loadClips(),this._loadPeople(),this._loadLinks(),this._loadTrain()])}async _loadClips(){let t=await this._try(()=>this._api(_.clips(this._fKind?{kind:this._fKind}:{})));Array.isArray(t)?this._clips=t:t&&Array.isArray(t.clips)&&(this._clips=t.clips)}async _loadPeople(){let t=await this._try(()=>this._api(_.people()));t&&typeof t=="object"&&(this._people=t)}async _loadLinks(){try{let t=await this._api(_.links());this._links=(t==null?void 0:t.people)||{},this._signin=!!(t!=null&&t.signin)}catch(t){this._links=null,this._signin=!1}}async _loadTrain(){let t=await this._try(()=>this._api(_.trainStatus()));t&&(this._train=t);let e=!!(t!=null&&t.running);e&&!this._trainTimer?this._trainTimer=setInterval(()=>this._loadTrain(),ve):!e&&this._trainTimer&&(clearInterval(this._trainTimer),this._trainTimer=null)}_applyStatus(t){this._status=t||{recording:!1},t!=null&&t.recording?(this._levels=[...this._levels.slice(-11),Number(t.level)||0],this._elapsed=t.seconds!=null?Number(t.seconds):t.started?Date.now()/1e3-Number(t.started):this._elapsed+pt/1e3):(this._levels=[],this._elapsed=0)}_startPolling(){this._poll||(this._poll=setInterval(async()=>{try{let t=await this._api(_.status());this._applyStatus(t),t!=null&&t.recording||this._recordingEnded()}catch(t){this._err=(t==null?void 0:t.message)||String(t),this._stopPolling(),this._status={recording:!1}}},pt))}_stopPolling(){clearInterval(this._poll),this._poll=null}_recordingEnded(){this._stopPolling(),this._levels=[],this._fKind=this._kind,this._fLabel="",this._loadClips()}async _toggleRecord(){var i;if((i=this._status)!=null&&i.recording){if(this._take)return this._stopLocal();await this._try(()=>this._api(_.stop())),this._status={recording:!1},this._recordingEnded();return}let t=this._label.trim();if(!t){this._err=this._kind==="voice"?"whose voice is this?":"give the recording a label first";return}if(this._kind==="voice"&&this._mic().source==="device")return this._startLocal(t);let e=await this._try(()=>this._api(_.start(this._kind,t)));e!==void 0&&(this._since=Date.now(),this._levels=[],this._elapsed=0,this._status=$({recording:!0,kind:this._kind,label:t},e||{}),this._startPolling())}_mic(){return fe(this._source,ge(window),this._micDenied)}async _startLocal(t){let e;try{e=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1}})}catch(a){this._micDenied=!0,this._err=`This device's microphone is not available (${(a==null?void 0:a.name)||a}), so the Mac's will be used instead.`;return}let i=window.AudioContext||window.webkitAudioContext,s;try{s=new i({sampleRate:ut})}catch(a){s=new i}let o=s.createScriptProcessor(4096,1,1),r={ctx:s,stream:e,proc:o,chunks:[],samples:0,peak:0};o.onaudioprocess=a=>{let l=new Float32Array(a.inputBuffer.getChannelData(0));r.chunks.push(l),r.samples+=l.length;let d=0;for(let p=0;p<l.length;p++)d+=l[p]*l[p];r.peak=Math.max(r.peak,Math.sqrt(d/l.length)),this._take===r&&r.samples>=_e*s.sampleRate&&this._stopLocal()},s.createMediaStreamSource(e).connect(o),o.connect(s.destination),this._take=r,this._since=Date.now(),this._levels=[],this._elapsed=0,this._status={recording:!0,kind:"voice",label:t,local:!0},this._poll=setInterval(()=>{this._levels=[...this._levels.slice(-11),r.peak],r.peak=0,this._elapsed=r.samples/s.sampleRate},pt)}async _stopLocal(){var r;let t=this._take,e=(r=this._status)==null?void 0:r.label;if(this._stopPolling(),this._releaseMic(),this._status={recording:!1},!t)return;let i=new Float32Array(t.samples),s=0;for(let a of t.chunks)i.set(a,s),s+=a.length;let o=$e(be(i,t.ctx.sampleRate));await this._try(()=>this._api(_.upload(e,o))),this._recordingEnded()}_releaseMic(){let t=this._take;this._take=null,t&&(t.proc.onaudioprocess=null,t.proc.disconnect(),t.stream.getTracks().forEach(e=>e.stop()),Promise.resolve(t.ctx.close()).catch(()=>{}))}async _delete(t){var e;t.length&&((e=this._player)==null||e.stop(),await this._try(async()=>{for(let i of t)await this._api(_.deleteClip(i)),this._clips=this._clips.filter(s=>s.id!==i),this._sel.delete(i)}),this._sel=new Set(this._sel))}async _refile(){let t=[...this._sel],e={};this._refileKind&&(e.kind=this._refileKind),this._refileLabel.trim()&&(e.label=this._refileLabel.trim()),!(!t.length||!Object.keys(e).length)&&(await this._try(async()=>{for(let i of t)await this._api(_.refile(i,e)),this._clips=this._clips.map(s=>s.id===i?$($({},s),e):s)}),this._sel=new Set,this._refileLabel="",this._fKind&&e.kind&&e.kind!==this._fKind&&this._loadClips())}async _enrol(){let t=this._enrolTo.trim(),e=[...this._sel].filter(s=>{var o;return((o=this._clips.find(r=>r.id===s))==null?void 0:o.kind)==="voice"});!t||!e.length||await this._try(()=>this._api(_.enroll(t,e)))===void 0||(this._sel=new Set,this._loadPeople())}async _deletePerson(t){if(!confirm(`Forget ${t}'s voice? Their enrolled samples go too.`))return;let e=await this._try(()=>this._api(_.deletePerson(t)));e&&typeof e=="object"?this._people=e:this._loadPeople()}_openLink(t){this._linking=t,this._linkId="",this._linkSecret="",this._linkErr="",this._linkNote=null}async _link(){let t=this._linking,e=this._linkId.trim();if(!(!t||!e||!this._linkSecret)){this._busy=!0,this._linkErr="";try{let i=await this._api(_.link(t,e,this._linkSecret));this._links=z($({},this._links||{}),{[i.person]:{linked:!0,client_id_hint:i.client_id_hint,identity:i.identity||null}}),this._linking="",this._linkNote={person:i.person,text:i.identity?`Hubbubb says this credential belongs to ${dt({linked:!0,identity:i.identity}).slice(9)}. If that is not ${i.person}, unlink it.`:"Linked, but Hubbubb did not say whose credential this is. Ask it later, or unlink if unsure."}}catch(i){this._linkErr=(i==null?void 0:i.message)||String(i)}finally{this._linkSecret="",this._busy=!1}}}async _signIn(t){this._cancelSignIn();let e=window.open("about:blank","_blank");this._signing=t,this._signErr="",this._signUrl="",this._linkNote=null;let i;try{i=await this._api(_.signIn(t))}catch(s){e==null||e.close(),this._signing="",this._signErr=(s==null?void 0:s.message)||String(s);return}this._signUrl=(i==null?void 0:i.url)||"",this._signRedirect=(i==null?void 0:i.redirect_uri)||"",e&&(e.location=this._signUrl),this._signStarted=Date.now(),this._signTimer=setInterval(()=>this._checkSignIn(),ye)}async _checkSignIn(){var i;let t=this._signing;if(!t)return;await this._loadLinks();let e=(i=Object.entries(this._links||{}).find(([s])=>s.toLowerCase()===t.toLowerCase()))==null?void 0:i[1];ce(e)?(this._cancelSignIn(),this._linkNote={person:t,text:e.identity?`${t} signed in to Hubbubb as ${dt({linked:!0,identity:e.identity}).slice(9)}.`:`${t} signed in to Hubbubb, but it did not say as whom.`}):Date.now()-this._signStarted>ke*1e3&&(this._cancelSignIn(),this._signErr=`Hubbubb did not come back within ten minutes for ${t}. Press Sign in with Hubbubb to try again.`)}_cancelSignIn(){clearInterval(this._signTimer),this._signTimer=null,this._signing="",this._signUrl=""}async _unlink(t){if(!confirm(`Unlink ${t} from Hubbubb? The house stops acting as them there.`)||!await this._try(()=>this._api(_.unlink(t))))return;this._linkNote=null;let i=$({},this._links||{});for(let s of Object.keys(i))s.toLowerCase()===t.toLowerCase()&&(i[s]={linked:!1});this._links=i}async _train(){var i;let t=this._phrase.trim();if(!this._armed||!Kt(t)||(i=this._train)!=null&&i.running)return;let e=await this._try(()=>this._api(_.train(t)));this._armed=!1,e&&(this._train=e),this._loadTrain()}_play(t){if(this._playing===t)return this._player.stop();this._player.play(t).catch(e=>this._err=(e==null?void 0:e.message)||String(e))}_toggleSel(t,e){let i=new Set(this._sel);e?i.add(t):i.delete(t),this._sel=i}_setFilterKind(t){this._fKind=t,this._fLabel="",this._sel=new Set,this._loadClips()}render(){var e;let t=!!((e=this._status)!=null&&e.recording);return h`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Voice studio</div>
      </div>
      ${this._err?h`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:c}
      <div class="cols">
        <div class="col side">
          ${this._renderRecord(t)}
          ${this._renderPeople()}
          ${this._renderTrain()}
        </div>
        <div class="col main">
          ${this._since?this._renderList("Just recorded",zt(this._clips,{since:this._since}),!0):c}
          ${this._renderLibrary()}
        </div>
      </div>
    `}_renderRecord(t){var r;let e=Object.keys(this._people),i=this._kind==="voice"?e:Bt(this._clips,this._kind),s=t&&pe(this._levels),o=this._levels[this._levels.length-1]||0;return h`
      <ha-card class="card">
        <div class="h">Record</div>
        <div class="seg">
          ${F.map(a=>h`<button
              class="segb ${this._kind===a.id?"on":""}"
              ?disabled=${t}
              @click=${()=>{this._kind=a.id,this._label=""}}
            >${a.name}</button>`)}
        </div>
        <div class="hint">${(r=F.find(a=>a.id===this._kind))==null?void 0:r.hint}</div>
        ${this._kind==="voice"?this._renderMic(t):c}
        <input
          class="input"
          list="vs-labels"
          .value=${this._label}
          ?disabled=${t}
          placeholder=${this._kind==="wake"?"wake phrase, e.g. hey jarvis":this._kind==="voice"?"who is speaking":"what it is, e.g. dishwasher"}
          @input=${a=>this._label=a.target.value}
        />
        <datalist id="vs-labels">${i.map(a=>h`<option value=${a}></option>`)}</datalist>
        <button class="big ${t?"stop":"start"}" ?disabled=${this._busy||!this._loaded} @click=${this._toggleRecord}>
          ${t?"Stop":"Start recording"}
        </button>
        ${t?h`
              <div class="live">
                <span class="elapsed">${ue(this._elapsed)}</span>
                <span class="what">${this._status.kind} · ${this._status.label}${this._status.local?" \xB7 this device":""}</span>
              </div>
              <div class="meter ${s?"dead":""}"><div class="fill" style="width:${jt(o)}%"></div></div>
              ${s?h`<div class="warn">Nothing is coming from the microphone. Check it before you carry on.</div>`:h`<div class="hint">Level ${jt(o)}%</div>`}
            `:c}
      </ha-card>
    `}_renderMic(t){let e=this._mic();return h`
      ${e.choice?h`<div class="seg">
            ${[["device","This device"],["mac","The Mac by the puck"]].map(([i,s])=>h`<button class="segb ${e.source===i?"on":""}" ?disabled=${t} @click=${()=>this._source=i}>${s}</button>`)}
          </div>`:c}
      <div class="hint">${e.text}</div>
    `}_renderLibrary(){let t=Bt(this._clips,this._fKind),e=zt(this._clips,{kind:this._fKind,label:this._fLabel});return h`
      <ha-card class="card">
        <div class="h">Library <span class="count">${e.length}</span></div>
        <div class="chips">
          <button class="chip ${this._fKind?"":"on"}" @click=${()=>this._setFilterKind("")}>All</button>
          ${F.map(i=>h`<button class="chip ${this._fKind===i.id?"on":""}" @click=${()=>this._setFilterKind(i.id)}>${i.name}</button>`)}
        </div>
        ${t.length?h`<div class="chips">
              ${t.map(i=>h`<button
                  class="chip ${this._fLabel===i?"on":""}"
                  @click=${()=>this._fLabel=this._fLabel===i?"":i}
                >${i}</button>`)}
            </div>`:c}
        ${this._renderSelBar(e)}
        ${e.length?e.map(i=>this._renderRow(i)):h`<div class="empty">${this._loaded?"Nothing here yet. Record something.":"Loading\u2026"}</div>`}
      </ha-card>
    `}_renderList(t,e,i){return i&&!e.length?c:h`
      <ha-card class="card">
        <div class="h">${t} <span class="count">${e.length}</span></div>
        ${e.map(s=>this._renderRow(s))}
      </ha-card>
    `}_renderSelBar(t){let e=this._sel.size,i=t.length&&t.every(r=>this._sel.has(r.id)),s=e&&[...this._sel].every(r=>{var a;return((a=this._clips.find(l=>l.id===r))==null?void 0:a.kind)==="voice"}),o=Object.keys(this._people);return h`
      <div class="selbar">
        <label class="sel-all">
          <input type="checkbox" .checked=${!!i} ?disabled=${!t.length}
            @change=${r=>this._sel=r.target.checked?new Set([...this._sel,...t.map(a=>a.id)]):new Set} />
          ${e?`${e} selected`:"Select all"}
        </label>
        ${e?h`
              <button class="btn danger" ?disabled=${this._busy} @click=${()=>this._delete([...this._sel])}>Delete ${e}</button>
              <span class="grp">
                <select class="input sm" .value=${this._refileKind} @change=${r=>this._refileKind=r.target.value}>
                  <option value="">keep kind</option>
                  ${F.map(r=>h`<option value=${r.id}>${r.name}</option>`)}
                </select>
                <input class="input sm" placeholder="new label" .value=${this._refileLabel} @input=${r=>this._refileLabel=r.target.value} />
                <button class="btn" ?disabled=${this._busy||!this._refileKind&&!this._refileLabel.trim()} @click=${this._refile}>Re-file</button>
              </span>
              ${s?h`<span class="grp">
                    <input class="input sm" list="vs-people" placeholder="enrol into…" .value=${this._enrolTo} @input=${r=>this._enrolTo=r.target.value} />
                    <datalist id="vs-people">${o.map(r=>h`<option value=${r}></option>`)}</datalist>
                    <button class="btn" ?disabled=${this._busy||!this._enrolTo.trim()} @click=${this._enrol}>Enrol</button>
                  </span>`:c}
            `:c}
      </div>
    `}_renderRow(t){let e=this._sel.has(t.id),i=this._playing===t.id,s=q(t.created);return h`
      <div class="row ${e?"on":""}">
        <input type="checkbox" .checked=${e} @change=${o=>this._toggleSel(t.id,o.target.checked)} />
        <div class="body" @click=${()=>this._toggleSel(t.id,!e)}>
          <div class="text ${t.transcript?"":"none"}">${t.transcript||"no transcript"}</div>
          <div class="meta">
            ${t.kind} · ${t.label} · ${Number(t.seconds||0).toFixed(1)}s
            ${s?h` · ${new Date(s).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}`:c}
          </div>
        </div>
        <button class="btn icon" title=${i?"Stop":"Play"} @click=${()=>this._play(t.id)}>${i?"\u25A0":"\u25B6"}</button>
        <button class="btn icon danger" title="Delete" ?disabled=${this._busy} @click=${()=>this._delete([t.id])}>✕</button>
      </div>
    `}_renderPeople(){var i,s;let t=he(this._people,this._links),e=!!((s=(i=this.hass)==null?void 0:i.user)!=null&&s.is_admin);return h`
      <ha-card class="card">
        <div class="h">People</div>
        ${t.length?t.map(o=>this._renderPerson(o,e)):h`<div class="empty">Nobody enrolled. Record "Voice" clips, select them, and enrol.</div>`}
      </ha-card>
    `}_renderPerson({name:t,samples:e,link:i},s){var u;let o=s&&this._linking===t,r=s&&this._signing===t,a=dt(i),l=((u=this._linkNote)==null?void 0:u.person)===t?this._linkNote.text:"",d=this._signErr&&!this._signing&&this._signErr.includes(t)?this._signErr:"",p=s&&i&&this._signin&&!(i.linked&&i.via==="signin"&&!i.needsReauth);return h`<div class="row">
        <div class="body">
          <div class="text">${t}</div>
          <div class="meta">${e?`${e} sample${e===1?"":"s"}`:"no voice samples"}${i?h` · ${a}`:c}</div>
        </div>
        ${s&&i&&!o&&!r?h`${p?h`<button class="btn" ?disabled=${this._busy} @click=${()=>this._signIn(t)}>${i.needsReauth?"Sign in again":"Sign in with Hubbubb"}</button>`:c}
              ${i.linked?h`<button class="btn" ?disabled=${this._busy} @click=${()=>this._unlink(t)}>Unlink</button>`:h`<button class="btn ${this._signin?"quiet":""}" ?disabled=${this._busy} @click=${()=>this._openLink(t)}>${this._signin?"Paste a key instead":"Link"}</button>`}`:c}
        ${e?h`<button class="btn icon danger" title="Forget" ?disabled=${this._busy} @click=${()=>this._deletePerson(t)}>✕</button>`:c}
      </div>
      ${l?h`<div class="linkform"><div class="hint">${l}</div></div>`:c}
      ${d?h`<div class="linkform"><div class="warn">${d}</div></div>`:c}
      ${r?h`<div class="linkform">
            <div class="hint">Waiting for ${t} to sign in to Hubbubb in the other window…</div>
            ${this._signUrl?h`<div class="hint">If no window opened, <a href=${this._signUrl} target="_blank" rel="noopener">open the Hubbubb sign-in</a>.</div>`:c}
            ${this._signRedirect?h`<div class="hint">If Hubbubb rejects the redirect address, register <code>${this._signRedirect}</code> on the house's OAuth client.</div>`:c}
            <div class="chips">
              <button class="btn" @click=${()=>this._checkSignIn()}>Check now</button>
              <button class="btn" @click=${()=>this._cancelSignIn()}>Cancel</button>
            </div>
          </div>`:c}
      ${o?h`<div class="linkform">
            <div class="hint">${t}'s own Hubbubb API client${this._signin?" - the older way; signing in needs no key":""}. The pair is checked against Hubbubb before it is kept; the secret is never shown again.</div>
            <input class="input" placeholder="client id" autocomplete="off" .value=${this._linkId} @input=${g=>this._linkId=g.target.value} />
            <input class="input" type="password" placeholder="client secret" autocomplete="new-password" .value=${this._linkSecret} @input=${g=>this._linkSecret=g.target.value} />
            ${this._linkErr?h`<div class="warn">${this._linkErr}</div>`:c}
            <div class="chips">
              <button class="btn" ?disabled=${this._busy||!this._linkId.trim()||!this._linkSecret} @click=${()=>this._link()}>${this._busy?"Checking\u2026":"Verify and link"}</button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._openLink("")}>Cancel</button>
            </div>
          </div>`:c}`}_renderTrain(){let t=this._train||{},e=!!t.running,i=this._phrase||(this._kind==="wake"?this._label:""),s=e?`Training "${t.phrase}" since ${t.started?new Date(Number(t.started)*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"earlier"}. The house will say when it is done.`:t.phrase?`Last run: "${t.phrase}" ${t.ok?"finished and is ready to load onto a puck":`failed (see ${t.out||"the log"})`}.`:"No training run yet.";return h`
      <ha-card class="card">
        <div class="h">Train wake word</div>
        <div class="hint">${s}</div>
        <input class="input" placeholder="phrase, one to four words" .value=${i} ?disabled=${e}
          @input=${o=>this._phrase=o.target.value} />
        <label class="arm">
          <input type="checkbox" .checked=${this._armed} ?disabled=${e} @change=${o=>this._armed=o.target.checked} />
          <span>This takes hours and ties up the Mac. Start it now.</span>
        </label>
        <button class="btn wide" ?disabled=${e||!this._armed||!Kt(i)||this._busy}
          @click=${()=>{this._phrase=i,this._train()}}>
          ${e?"Training\u2026":"Train"}
        </button>
      </ha-card>
    `}};B(T,"build",Wt),B(T,"properties",{hass:{attribute:!1,hasChanged:()=>!1},narrow:{type:Boolean},panel:{},route:{},_status:{state:!0},_levels:{state:!0},_elapsed:{state:!0},_clips:{state:!0},_people:{state:!0},_links:{state:!0},_linking:{state:!0},_linkId:{state:!0},_linkSecret:{state:!0},_linkErr:{state:!0},_linkNote:{state:!0},_signin:{state:!0},_signing:{state:!0},_signUrl:{state:!0},_signRedirect:{state:!0},_signErr:{state:!0},_train:{state:!0},_kind:{state:!0},_label:{state:!0},_fKind:{state:!0},_fLabel:{state:!0},_sel:{state:!0},_err:{state:!0},_busy:{state:!0},_playing:{state:!0},_since:{state:!0},_refileKind:{state:!0},_refileLabel:{state:!0},_enrolTo:{state:!0},_phrase:{state:!0},_armed:{state:!0},_loaded:{state:!0},_source:{state:!0},_micDenied:{state:!0}}),B(T,"styles",J`
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
    /* The lesser path: there when wanted, not competing with the sign-in. */
    .btn.quiet {
      border-color: transparent;
      color: var(--secondary-text-color);
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
  `);customElements.define("hubbubb-voice-studio",T);export{Ft as API_BASE,de as DEAD_FLOOR,F as KINDS,ht as LINKS_PATH,_e as MAX_TAKE_SECONDS,ae as SIGNIN_PATH,ke as SIGNIN_SECONDS,ut as WAV_RATE,_ as api,le as audioPath,ge as canRecordHere,q as clipTime,pe as deadMic,be as downsample,$e as encodeWav,Dt as errMessage,zt as filterClips,ue as fmtElapsed,Bt as labelsOf,dt as linkText,me as makePlayer,jt as meterPct,fe as micPlan,he as peopleRows,ce as signedIn,Kt as validPhrase};
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
