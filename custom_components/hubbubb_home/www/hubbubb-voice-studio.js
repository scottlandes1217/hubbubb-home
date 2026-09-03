var Kt=Object.defineProperty,It=Object.defineProperties;var Wt=Object.getOwnPropertyDescriptors;var ht=Object.getOwnPropertySymbols;var qt=Object.prototype.hasOwnProperty,Ft=Object.prototype.propertyIsEnumerable;var F=(r,t,e)=>t in r?Kt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,k=(r,t)=>{for(var e in t||(t={}))qt.call(t,e)&&F(r,e,t[e]);if(ht)for(var e of ht(t))Ft.call(t,e)&&F(r,e,t[e]);return r},V=(r,t)=>It(r,Wt(t));var j=(r,t,e)=>F(r,typeof t!="symbol"?t+"":t,e);var B=globalThis,K=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),ct=new WeakMap,T=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(K&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=ct.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ct.set(e,t))}return t}toString(){return this.cssText}},dt=r=>new T(typeof r=="string"?r:r+"",void 0,J),G=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[o+1],r[0]);return new T(e,r,J)},pt=(r,t)=>{if(K)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=B.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},Z=K?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return dt(e)})(r):r;var{is:Vt,defineProperty:Jt,getOwnPropertyDescriptor:Gt,getOwnPropertyNames:Zt,getOwnPropertySymbols:Qt,getPrototypeOf:Xt}=Object,m=globalThis,ut=m.trustedTypes,Yt=ut?ut.emptyScript:"",Q=m.reactiveElementPolyfillSupport,O=(r,t)=>r,X={toAttribute(r,t){switch(t){case Boolean:r=r?Yt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch(i){e=null}}return e}},mt=(r,t)=>!Vt(r,t),_t={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:mt},ft,gt;(ft=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(gt=m.litPropertyMetadata)!=null||(m.litPropertyMetadata=new WeakMap);var g=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Jt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){var n;let{get:s,set:o}=(n=Gt(this.prototype,t))!=null?n:{get(){return this[e]},set(l){this[e]=l}};return{get:s,set(l){let a=s==null?void 0:s.call(this);o==null||o.call(this,l),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:_t}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Xt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,i=[...Zt(e),...Qt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(Z(s))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,i;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostConnected)==null?void 0:s.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){var o;let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:X).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){var o,n,l;let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let a=i.getPropertyOptions(s),h=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)==null?void 0:o.fromAttribute)!==void 0?a.converter:X;this._$Em=s;let c=h.fromAttribute(e,a.type);this[s]=(l=c!=null?c:(n=this._$Ej)==null?void 0:n.get(s))!=null?l:c,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){var n,l;if(t!==void 0){let a=this.constructor;if(s===!1&&(o=this[t]),i!=null||(i=a.getPropertyOptions(t)),!(((n=i.hasChanged)!=null?n:mt)(o,e)||i.useDefault&&i.reflect&&o===((l=this._$Ej)==null?void 0:l.get(t))&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){var l,a,h;i&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=n!=null?n:e)!=null?a:this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&((h=this._$Eq)!=null?h:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i,s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((i=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,l]of this._$Ep)this[n]=l;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,l]of o){let{wrapped:a}=l,h=this[n];a!==!0||this._$AL.has(n)||h===void 0||this.C(n,void 0,l,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},$t;g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[O("elementProperties")]=new Map,g[O("finalized")]=new Map,Q==null||Q({ReactiveElement:g}),(($t=m.reactiveElementVersions)!=null?$t:m.reactiveElementVersions=[]).push("2.1.2");var N=globalThis,bt=r=>r,I=N.trustedTypes,yt=I?I.createPolicy("lit-html",{createHTML:r=>r}):void 0,Et="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,Pt="?"+b,te=`<${Pt}>`,w=document,R=()=>w.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",ot=Array.isArray,ee=r=>ot(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Y=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,vt=/-->/g,xt=/>/g,v=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),wt=/'/g,At=/"/g,Ct=/^(?:script|style|textarea|title)$/i,at=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=at(1),fe=at(2),ge=at(3),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),St=new WeakMap,x=w.createTreeWalker(w,129);function Tt(r,t){if(!ot(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return yt!==void 0?yt.createHTML(t):t}var ie=(r,t)=>{let e=r.length-1,i=[],s,o=t===2?"<svg>":t===3?"<math>":"",n=L;for(let l=0;l<e;l++){let a=r[l],h,c,d=-1,f=0;for(;f<a.length&&(n.lastIndex=f,c=n.exec(a),c!==null);)f=n.lastIndex,n===L?c[1]==="!--"?n=vt:c[1]!==void 0?n=xt:c[2]!==void 0?(Ct.test(c[2])&&(s=RegExp("</"+c[2],"g")),n=v):c[3]!==void 0&&(n=v):n===v?c[0]===">"?(n=s!=null?s:L,d=-1):c[1]===void 0?d=-2:(d=n.lastIndex-c[2].length,h=c[1],n=c[3]===void 0?v:c[3]==='"'?At:wt):n===At||n===wt?n=v:n===vt||n===xt?n=L:(n=v,s=void 0);let $=n===v&&r[l+1].startsWith("/>")?" ":"";o+=n===L?a+te:d>=0?(i.push(h),a.slice(0,d)+Et+a.slice(d)+b+$):a+b+(d===-2?l:$)}return[Tt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},U=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[h,c]=ie(t,e);if(this.el=r.createElement(h,i),x.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=x.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(Et)){let f=c[n++],$=s.getAttribute(d).split(b),H=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:H[2],strings:$,ctor:H[1]==="."?it:H[1]==="?"?st:H[1]==="@"?rt:P}),s.removeAttribute(d)}else d.startsWith(b)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(Ct.test(s.tagName)){let d=s.textContent.split(b),f=d.length-1;if(f>0){s.textContent=I?I.emptyScript:"";for(let $=0;$<f;$++)s.append(d[$],R()),x.nextNode(),a.push({type:2,index:++o});s.append(d[f],R())}}}else if(s.nodeType===8)if(s.data===Pt)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(b,d+1))!==-1;)a.push({type:7,index:o}),d+=b.length-1}o++}}static createElement(t,e){let i=w.createElement("template");return i.innerHTML=t,i}};function E(r,t,e=r,i){var n,l,a;if(t===A)return t;let s=i!==void 0?(n=e._$Co)==null?void 0:n[i]:e._$Cl,o=M(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),o===void 0?s=void 0:(s=new o(r),s._$AT(r,e,i)),i!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[i]=s:e._$Cl=s),s!==void 0&&(t=E(r,s._$AS(r,t.values),s,i)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var h;let{el:{content:e},parts:i}=this._$AD,s=((h=t==null?void 0:t.creationScope)!=null?h:w).importNode(e,!0);x.currentNode=s;let o=x.nextNode(),n=0,l=0,a=i[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new z(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new nt(o,this,t)),this._$AV.push(c),a=i[++l]}n!==(a==null?void 0:a.index)&&(o=x.nextNode(),n++)}return x.currentNode=w,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},z=class r{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,i,s){var o;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(o=s==null?void 0:s.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),M(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ee(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=U.createElement(Tt(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(e);else{let n=new et(s,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=St.get(t.strings);return e===void 0&&St.set(t.strings,e=new U(t)),e}k(t){ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let o of t)s===e.length?e.push(i=new r(this.O(R()),this.O(R()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t!==this._$AB;){let s=bt(t).nextSibling;bt(t).remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(t,e=this,i,s){let o=this.strings,n=!1;if(o===void 0)t=E(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{let l=t,a,h;for(t=o[0],a=0;a<o.length-1;a++)h=E(this,l[i+a],e,a),h===A&&(h=this._$AH[a]),n||(n=!M(h)||h!==this._$AH[a]),h===p?t=p:t!==p&&(t+=(h!=null?h:"")+o[a+1]),this._$AH[a]=h}n&&!s&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},it=class extends P{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},st=class extends P{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},rt=class extends P{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var n;if((t=(n=E(this,t,e,0))!=null?n:p)===A)return;let i=this._$AH,s=t===p&&i!==p||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==p&&(i===p||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)==null?void 0:e.host)!=null?i:this.element,t):this._$AH.handleEvent(t)}},nt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var tt=N.litHtmlPolyfillSupport,kt;tt==null||tt(U,z),((kt=N.litHtmlVersions)!=null?kt:N.litHtmlVersions=[]).push("3.3.3");var Ot=(r,t,e)=>{var o,n;let i=(o=e==null?void 0:e.renderBefore)!=null?o:t,s=i._$litPart$;if(s===void 0){let l=(n=e==null?void 0:e.renderBefore)!=null?n:null;i._$litPart$=s=new z(t.insertBefore(R(),l),l,void 0,e!=null?e:{})}return s._$AI(r),s};var S=globalThis,y=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,i;let t=super.createRenderRoot();return(i=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ot(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return A}},Lt;y._$litElement$=!0,y.finalized=!0,(Lt=S.litElementHydrateSupport)==null||Lt.call(S,{LitElement:y});var lt=S.litElementPolyfillSupport;lt==null||lt({LitElement:y});var Nt;((Nt=S.litElementVersions)!=null?Nt:S.litElementVersions=[]).push("4.2.2");var jt=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-voice-studio ${jt}`);var Bt="/api/hubbubb_home/voice/",W=[{id:"wake",name:"Wake word",hint:"the phrase, said the way you say it"},{id:"ambient",name:"Room noise",hint:"what it must not wake to"},{id:"voice",name:"Voice",hint:"a person, for speaker matching"}],D=encodeURIComponent,se=(r={})=>{let t=Object.entries(r).filter(([,e])=>e!=null&&e!=="").map(([e,i])=>`${D(e)}=${D(i)}`).join("&");return t?`?${t}`:""},_={status:()=>["GET","record/status"],start:(r,t)=>["POST","record/start",{kind:r,label:t}],stop:()=>["POST","record/stop"],clips:r=>["GET",`clips${se(r)}`],deleteClip:r=>["DELETE",`clips/${D(r)}`],refile:(r,t)=>["POST",`clips/${D(r)}`,t],people:()=>["GET","people"],enroll:(r,t)=>["POST","people/enroll",{person:r,clips:t}],deletePerson:r=>["POST","people/delete",{person:r}],train:r=>["POST","train",{phrase:r}],trainStatus:()=>["GET","train/status"]},re=r=>`${Bt}clips/${D(r)}/audio`;function Rt(r,t){let e=typeof t=="string"?t:"";try{let i=typeof t=="string"?JSON.parse(t):t;e=(i==null?void 0:i.message)||(i==null?void 0:i.error)||""}catch(i){}return e=(e||"").trim(),e||(e=r===503?"the voice service is not reachable":`request failed (${r})`),e}var q=r=>{if(typeof r=="number")return r<1e12?r*1e3:r;let t=Date.parse(r);return Number.isFinite(t)?t:0};function Mt(r,{kind:t,label:e,since:i}={}){return(r||[]).filter(s=>!t||s.kind===t).filter(s=>!e||s.label===e).filter(s=>!i||q(s.created)>=i).sort((s,o)=>q(o.created)-q(s.created))}function Ut(r,t){let e=new Map;for(let i of r||[])t&&i.kind!==t||i.label&&e.set(i.label,(e.get(i.label)||0)+1);return[...e.entries()].sort((i,s)=>s[1]-i[1]||i[0].localeCompare(s[0])).map(([i])=>i)}var zt=r=>{let t=Number(r);return!Number.isFinite(t)||t<=0?0:Math.round(Math.min(1,Math.sqrt(t))*100)},ne=.002;function oe(r,t=ne,e=6){return!r||r.length<e?!1:r.slice(-e).every(i=>!(Number(i)>t))}function ae(r){r=Math.max(0,Math.floor(Number(r)||0));let t=Math.floor(r/3600),e=Math.floor(r%3600/60),i=r%60,s=t?String(e).padStart(2,"0"):String(e);return(t?`${t}:${s}:`:`${e}:`)+String(i).padStart(2,"0")}var Dt=r=>{let t=String(r||"").trim().split(/\s+/).filter(Boolean);return t.length>=1&&t.length<=4&&t.every(e=>/^[a-z]+$/i.test(e))};function le({fetchBytes:r,audio:t,urls:e=URL,onstate:i=()=>{}}){let s=null,o=null,n=()=>{s&&e.revokeObjectURL(s),s=null,o=null};return t.onended=()=>{n(),i(null)},{async play(l){t.pause(),n();let a=await r(l);n(),s=e.createObjectURL(a),o=l,t.src=s,i(l);try{await t.play()}catch(h){throw n(),i(null),h}},stop(){t.pause(),n(),i(null)},dispose(){t.pause(),t.onended=null,n()},get playing(){return o}}}var Ht=500,he=6e4,C=class extends y{constructor(){super(),this._status=null,this._levels=[],this._elapsed=0,this._clips=[],this._people={},this._train=null,this._kind="wake",this._label="",this._fKind="",this._fLabel="",this._sel=new Set,this._err="",this._busy=!1,this._playing=null,this._since=0,this._refileKind="",this._refileLabel="",this._enrolTo="",this._phrase="",this._armed=!1,this._loaded=!1}connectedCallback(){super.connectedCallback(),this._player=le({audio:new Audio,fetchBytes:t=>this._fetchAudio(t),onstate:t=>this._playing=t}),this._load()}disconnectedCallback(){var t;super.disconnectedCallback(),this._stopPolling(),clearInterval(this._trainTimer),this._trainTimer=null,(t=this._player)==null||t.dispose(),this._player=null}async _api([t,e,i]){var a,h,c,d;let s={method:t,headers:i?{"Content-Type":"application/json"}:{},body:i?JSON.stringify(i):void 0},o=Bt+e,n=(a=this.hass)!=null&&a.fetchWithAuth?await this.hass.fetchWithAuth(o,s):await fetch(o,V(k({},s),{headers:V(k({},s.headers),{Authorization:`Bearer ${(d=(c=(h=this.hass)==null?void 0:h.auth)==null?void 0:c.data)==null?void 0:d.access_token}`})})),l=await n.text();if(!n.ok)throw new Error(Rt(n.status,l));try{return l?JSON.parse(l):null}catch(f){return null}}async _fetchAudio(t){var o,n,l,a;let e=re(t),i=(o=this.hass)!=null&&o.fetchWithAuth?await this.hass.fetchWithAuth(e):await fetch(e,{headers:{Authorization:`Bearer ${(a=(l=(n=this.hass)==null?void 0:n.auth)==null?void 0:l.data)==null?void 0:a.access_token}`}});if(!i.ok)throw new Error(Rt(i.status,await i.text()));let s=await i.arrayBuffer();return new Blob([s],{type:i.headers.get("content-type")||"audio/wav"})}async _try(t){this._busy=!0,this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}finally{this._busy=!1}}async _load(){await this._try(async()=>{let t=await this._api(_.status());this._applyStatus(t),t!=null&&t.recording&&(this._kind=t.kind||this._kind,this._label=t.label||this._label,this._since=this._since||Date.now(),this._startPolling())}),this._loaded=!0,await Promise.all([this._loadClips(),this._loadPeople(),this._loadTrain()])}async _loadClips(){let t=await this._try(()=>this._api(_.clips(this._fKind?{kind:this._fKind}:{})));Array.isArray(t)?this._clips=t:t&&Array.isArray(t.clips)&&(this._clips=t.clips)}async _loadPeople(){let t=await this._try(()=>this._api(_.people()));t&&typeof t=="object"&&(this._people=t)}async _loadTrain(){let t=await this._try(()=>this._api(_.trainStatus()));t&&(this._train=t);let e=!!(t!=null&&t.running);e&&!this._trainTimer?this._trainTimer=setInterval(()=>this._loadTrain(),he):!e&&this._trainTimer&&(clearInterval(this._trainTimer),this._trainTimer=null)}_applyStatus(t){this._status=t||{recording:!1},t!=null&&t.recording?(this._levels=[...this._levels.slice(-11),Number(t.level)||0],this._elapsed=t.seconds!=null?Number(t.seconds):t.started?Date.now()/1e3-Number(t.started):this._elapsed+Ht/1e3):(this._levels=[],this._elapsed=0)}_startPolling(){this._poll||(this._poll=setInterval(async()=>{try{let t=await this._api(_.status());this._applyStatus(t),t!=null&&t.recording||this._recordingEnded()}catch(t){this._err=(t==null?void 0:t.message)||String(t),this._stopPolling(),this._status={recording:!1}}},Ht))}_stopPolling(){clearInterval(this._poll),this._poll=null}_recordingEnded(){this._stopPolling(),this._levels=[],this._fKind=this._kind,this._fLabel="",this._loadClips()}async _toggleRecord(){var i;if((i=this._status)!=null&&i.recording){await this._try(()=>this._api(_.stop())),this._status={recording:!1},this._recordingEnded();return}let t=this._label.trim();if(!t){this._err=this._kind==="voice"?"whose voice is this?":"give the recording a label first";return}let e=await this._try(()=>this._api(_.start(this._kind,t)));e!==void 0&&(this._since=Date.now(),this._levels=[],this._elapsed=0,this._status=k({recording:!0,kind:this._kind,label:t},e||{}),this._startPolling())}async _delete(t){var e;t.length&&((e=this._player)==null||e.stop(),await this._try(async()=>{for(let i of t)await this._api(_.deleteClip(i)),this._clips=this._clips.filter(s=>s.id!==i),this._sel.delete(i)}),this._sel=new Set(this._sel))}async _refile(){let t=[...this._sel],e={};this._refileKind&&(e.kind=this._refileKind),this._refileLabel.trim()&&(e.label=this._refileLabel.trim()),!(!t.length||!Object.keys(e).length)&&(await this._try(async()=>{for(let i of t)await this._api(_.refile(i,e)),this._clips=this._clips.map(s=>s.id===i?k(k({},s),e):s)}),this._sel=new Set,this._refileLabel="",this._fKind&&e.kind&&e.kind!==this._fKind&&this._loadClips())}async _enrol(){let t=this._enrolTo.trim(),e=[...this._sel].filter(s=>{var o;return((o=this._clips.find(n=>n.id===s))==null?void 0:o.kind)==="voice"});!t||!e.length||await this._try(()=>this._api(_.enroll(t,e)))===void 0||(this._sel=new Set,this._loadPeople())}async _deletePerson(t){if(!confirm(`Forget ${t}'s voice? Their enrolled samples go too.`))return;let e=await this._try(()=>this._api(_.deletePerson(t)));e&&typeof e=="object"?this._people=e:this._loadPeople()}async _train(){var i;let t=this._phrase.trim();if(!this._armed||!Dt(t)||(i=this._train)!=null&&i.running)return;let e=await this._try(()=>this._api(_.train(t)));this._armed=!1,e&&(this._train=e),this._loadTrain()}_play(t){if(this._playing===t)return this._player.stop();this._player.play(t).catch(e=>this._err=(e==null?void 0:e.message)||String(e))}_toggleSel(t,e){let i=new Set(this._sel);e?i.add(t):i.delete(t),this._sel=i}_setFilterKind(t){this._fKind=t,this._fLabel="",this._sel=new Set,this._loadClips()}render(){var e;let t=!!((e=this._status)!=null&&e.recording);return u`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Voice studio</div>
      </div>
      ${this._err?u`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:p}
      <div class="cols">
        <div class="col side">
          ${this._renderRecord(t)}
          ${this._renderPeople()}
          ${this._renderTrain()}
        </div>
        <div class="col main">
          ${this._since?this._renderList("Just recorded",Mt(this._clips,{since:this._since}),!0):p}
          ${this._renderLibrary()}
        </div>
      </div>
    `}_renderRecord(t){var n;let e=Object.keys(this._people),i=this._kind==="voice"?e:Ut(this._clips,this._kind),s=t&&oe(this._levels),o=this._levels[this._levels.length-1]||0;return u`
      <ha-card class="card">
        <div class="h">Record</div>
        <div class="seg">
          ${W.map(l=>u`<button
              class="segb ${this._kind===l.id?"on":""}"
              ?disabled=${t}
              @click=${()=>{this._kind=l.id,this._label=""}}
            >${l.name}</button>`)}
        </div>
        <div class="hint">${(n=W.find(l=>l.id===this._kind))==null?void 0:n.hint}</div>
        <input
          class="input"
          list="vs-labels"
          .value=${this._label}
          ?disabled=${t}
          placeholder=${this._kind==="wake"?"wake phrase, e.g. hey jarvis":this._kind==="voice"?"who is speaking":"what it is, e.g. dishwasher"}
          @input=${l=>this._label=l.target.value}
        />
        <datalist id="vs-labels">${i.map(l=>u`<option value=${l}></option>`)}</datalist>
        <button class="big ${t?"stop":"start"}" ?disabled=${this._busy||!this._loaded} @click=${this._toggleRecord}>
          ${t?"Stop":"Start recording"}
        </button>
        ${t?u`
              <div class="live">
                <span class="elapsed">${ae(this._elapsed)}</span>
                <span class="what">${this._status.kind} · ${this._status.label}</span>
              </div>
              <div class="meter ${s?"dead":""}"><div class="fill" style="width:${zt(o)}%"></div></div>
              ${s?u`<div class="warn">Nothing is coming from the microphone. Check it before you carry on.</div>`:u`<div class="hint">Level ${zt(o)}%</div>`}
            `:p}
      </ha-card>
    `}_renderLibrary(){let t=Ut(this._clips,this._fKind),e=Mt(this._clips,{kind:this._fKind,label:this._fLabel});return u`
      <ha-card class="card">
        <div class="h">Library <span class="count">${e.length}</span></div>
        <div class="chips">
          <button class="chip ${this._fKind?"":"on"}" @click=${()=>this._setFilterKind("")}>All</button>
          ${W.map(i=>u`<button class="chip ${this._fKind===i.id?"on":""}" @click=${()=>this._setFilterKind(i.id)}>${i.name}</button>`)}
        </div>
        ${t.length?u`<div class="chips">
              ${t.map(i=>u`<button
                  class="chip ${this._fLabel===i?"on":""}"
                  @click=${()=>this._fLabel=this._fLabel===i?"":i}
                >${i}</button>`)}
            </div>`:p}
        ${this._renderSelBar(e)}
        ${e.length?e.map(i=>this._renderRow(i)):u`<div class="empty">${this._loaded?"Nothing here yet. Record something.":"Loading\u2026"}</div>`}
      </ha-card>
    `}_renderList(t,e,i){return i&&!e.length?p:u`
      <ha-card class="card">
        <div class="h">${t} <span class="count">${e.length}</span></div>
        ${e.map(s=>this._renderRow(s))}
      </ha-card>
    `}_renderSelBar(t){let e=this._sel.size,i=t.length&&t.every(n=>this._sel.has(n.id)),s=e&&[...this._sel].every(n=>{var l;return((l=this._clips.find(a=>a.id===n))==null?void 0:l.kind)==="voice"}),o=Object.keys(this._people);return u`
      <div class="selbar">
        <label class="sel-all">
          <input type="checkbox" .checked=${!!i} ?disabled=${!t.length}
            @change=${n=>this._sel=n.target.checked?new Set([...this._sel,...t.map(l=>l.id)]):new Set} />
          ${e?`${e} selected`:"Select all"}
        </label>
        ${e?u`
              <button class="btn danger" ?disabled=${this._busy} @click=${()=>this._delete([...this._sel])}>Delete ${e}</button>
              <span class="grp">
                <select class="input sm" .value=${this._refileKind} @change=${n=>this._refileKind=n.target.value}>
                  <option value="">keep kind</option>
                  ${W.map(n=>u`<option value=${n.id}>${n.name}</option>`)}
                </select>
                <input class="input sm" placeholder="new label" .value=${this._refileLabel} @input=${n=>this._refileLabel=n.target.value} />
                <button class="btn" ?disabled=${this._busy||!this._refileKind&&!this._refileLabel.trim()} @click=${this._refile}>Re-file</button>
              </span>
              ${s?u`<span class="grp">
                    <input class="input sm" list="vs-people" placeholder="enrol into…" .value=${this._enrolTo} @input=${n=>this._enrolTo=n.target.value} />
                    <datalist id="vs-people">${o.map(n=>u`<option value=${n}></option>`)}</datalist>
                    <button class="btn" ?disabled=${this._busy||!this._enrolTo.trim()} @click=${this._enrol}>Enrol</button>
                  </span>`:p}
            `:p}
      </div>
    `}_renderRow(t){let e=this._sel.has(t.id),i=this._playing===t.id,s=q(t.created);return u`
      <div class="row ${e?"on":""}">
        <input type="checkbox" .checked=${e} @change=${o=>this._toggleSel(t.id,o.target.checked)} />
        <div class="body" @click=${()=>this._toggleSel(t.id,!e)}>
          <div class="text ${t.transcript?"":"none"}">${t.transcript||"no transcript"}</div>
          <div class="meta">
            ${t.kind} · ${t.label} · ${Number(t.seconds||0).toFixed(1)}s
            ${s?u` · ${new Date(s).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}`:p}
          </div>
        </div>
        <button class="btn icon" title=${i?"Stop":"Play"} @click=${()=>this._play(t.id)}>${i?"\u25A0":"\u25B6"}</button>
        <button class="btn icon danger" title="Delete" ?disabled=${this._busy} @click=${()=>this._delete([t.id])}>✕</button>
      </div>
    `}_renderPeople(){let t=Object.entries(this._people);return u`
      <ha-card class="card">
        <div class="h">People</div>
        ${t.length?t.map(([e,i])=>u`<div class="row">
                <div class="body">
                  <div class="text">${e}</div>
                  <div class="meta">${i} sample${i===1?"":"s"}</div>
                </div>
                <button class="btn icon danger" title="Forget" ?disabled=${this._busy} @click=${()=>this._deletePerson(e)}>✕</button>
              </div>`):u`<div class="empty">Nobody enrolled. Record "Voice" clips, select them, and enrol.</div>`}
      </ha-card>
    `}_renderTrain(){let t=this._train||{},e=!!t.running,i=this._phrase||(this._kind==="wake"?this._label:""),s=e?`Training "${t.phrase}" since ${t.started?new Date(Number(t.started)*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"earlier"}. The house will say when it is done.`:t.phrase?`Last run: "${t.phrase}" ${t.ok?"finished and is ready to load onto a puck":`failed (see ${t.out||"the log"})`}.`:"No training run yet.";return u`
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
    `}};j(C,"build",jt),j(C,"properties",{hass:{attribute:!1,hasChanged:()=>!1},narrow:{type:Boolean},panel:{},route:{},_status:{state:!0},_levels:{state:!0},_elapsed:{state:!0},_clips:{state:!0},_people:{state:!0},_train:{state:!0},_kind:{state:!0},_label:{state:!0},_fKind:{state:!0},_fLabel:{state:!0},_sel:{state:!0},_err:{state:!0},_busy:{state:!0},_playing:{state:!0},_since:{state:!0},_refileKind:{state:!0},_refileLabel:{state:!0},_enrolTo:{state:!0},_phrase:{state:!0},_armed:{state:!0},_loaded:{state:!0}}),j(C,"styles",G`
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
    .arm {
      display: flex;
      gap: 10px;
      align-items: center;
      margin: 8px 0 10px;
      line-height: 1.4;
      cursor: pointer;
    }
  `);customElements.define("hubbubb-voice-studio",C);export{Bt as API_BASE,ne as DEAD_FLOOR,W as KINDS,_ as api,re as audioPath,q as clipTime,oe as deadMic,Rt as errMessage,Mt as filterClips,ae as fmtElapsed,Ut as labelsOf,le as makePlayer,zt as meterPct,Dt as validPhrase};
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
