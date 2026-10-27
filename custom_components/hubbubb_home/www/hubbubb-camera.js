var Ue=Object.defineProperty,Fe=Object.defineProperties;var De=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var de=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var V=(a,e,t)=>e in a?Ue(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,u=(a,e)=>{for(var t in e||(e={}))de.call(e,t)&&V(a,t,e[t]);if(F)for(var t of F(e))pe.call(e,t)&&V(a,t,e[t]);return a},g=(a,e)=>Fe(a,De(e));var ue=(a,e)=>{var t={};for(var s in a)de.call(a,s)&&e.indexOf(s)<0&&(t[s]=a[s]);if(a!=null&&F)for(var s of F(a))e.indexOf(s)<0&&pe.call(a,s)&&(t[s]=a[s]);return t};var W=(a,e,t)=>V(a,typeof e!="symbol"?e+"":e,t);var D=globalThis,I=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),me=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(I&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=me.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&me.set(t,e))}return e}toString(){return this.cssText}},ge=a=>new T(typeof a=="string"?a:a+"",void 0,X),Y=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((s,i,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[o+1],a[0]);return new T(t,a,X)},_e=(a,e)=>{if(I)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,a.appendChild(s)}},K=I?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ge(t)})(a):a;var{is:Ie,defineProperty:Ge,getOwnPropertyDescriptor:Je,getOwnPropertyNames:qe,getOwnPropertySymbols:Be,getPrototypeOf:Ve}=Object,b=globalThis,fe=b.trustedTypes,We=fe?fe.emptyScript:"",Z=b.reactiveElementPolyfillSupport,j=(a,e)=>a,Q={toAttribute(a,e){switch(e){case Boolean:a=a?We:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch(s){t=null}}return t}},we=(a,e)=>!Ie(a,e),ve={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:we},be,$e;(be=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),($e=b.litPropertyMetadata)!=null||(b.litPropertyMetadata=new WeakMap);var v=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ve){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ge(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){var r;let{get:i,set:o}=(r=Je(this.prototype,e))!=null?r:{get(){return this[t]},set(l){this[t]=l}};return{get:i,set(l){let n=i==null?void 0:i.call(this);o==null||o.call(this,l),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:ve}static _$Ei(){if(this.hasOwnProperty(j("elementProperties")))return;let e=Ve(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(j("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(j("properties"))){let t=this.properties,s=[...qe(t),...Be(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(K(i))}else e!==void 0&&t.push(K(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return _e(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var o;let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Q).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){var o,r,l;let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),h=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:Q;this._$Em=i;let d=h.fromAttribute(t,n.type);this[i]=(l=d!=null?d:(r=this._$Ej)==null?void 0:r.get(i))!=null?l:d,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){var r,l;if(e!==void 0){let n=this.constructor;if(i===!1&&(o=this[e]),s!=null||(s=n.getPropertyOptions(e)),!(((r=s.hasChanged)!=null?r:we)(o,t)||s.useDefault&&s.reflect&&o===((l=this._$Ej)==null?void 0:l.get(e))&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},r){var l,n,h;s&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(n=r!=null?r:t)!=null?n:this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&((h=this._$Eq)!=null?h:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,l]of this._$Ep)this[r]=l;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[r,l]of o){let{wrapped:n}=l,h=this[r];n!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,l,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(o=>{var r;return(r=o.hostUpdate)==null?void 0:r.call(o)}),this.update(t)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},ye;v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[j("elementProperties")]=new Map,v[j("finalized")]=new Map,Z==null||Z({ReactiveElement:v}),((ye=b.reactiveElementVersions)!=null?ye:b.reactiveElementVersions=[]).push("2.1.2");var P=globalThis,xe=a=>a,G=P.trustedTypes,ke=G?G.createPolicy("lit-html",{createHTML:a=>a}):void 0,Oe="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Pe="?"+$,Xe=`<${Pe}>`,k=document,R=()=>k.createComment(""),H=a=>a===null||typeof a!="object"&&typeof a!="function",ne=Array.isArray,Ye=a=>ne(a)||typeof(a==null?void 0:a[Symbol.iterator])=="function",ee=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ae=/-->/g,Se=/>/g,w=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ee=/'/g,Ce=/"/g,Re=/^(?:script|style|textarea|title)$/i,le=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),c=le(1),ht=le(2),ct=le(3),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Te=new WeakMap,x=k.createTreeWalker(k,129);function He(a,e){if(!ne(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return ke!==void 0?ke.createHTML(e):e}var Ke=(a,e)=>{let t=a.length-1,s=[],i,o=e===2?"<svg>":e===3?"<math>":"",r=O;for(let l=0;l<t;l++){let n=a[l],h,d,m=-1,_=0;for(;_<n.length&&(r.lastIndex=_,d=r.exec(n),d!==null);)_=r.lastIndex,r===O?d[1]==="!--"?r=Ae:d[1]!==void 0?r=Se:d[2]!==void 0?(Re.test(d[2])&&(i=RegExp("</"+d[2],"g")),r=w):d[3]!==void 0&&(r=w):r===w?d[0]===">"?(r=i!=null?i:O,m=-1):d[1]===void 0?m=-2:(m=r.lastIndex-d[2].length,h=d[1],r=d[3]===void 0?w:d[3]==='"'?Ce:Ee):r===Ce||r===Ee?r=w:r===Ae||r===Se?r=O:(r=w,i=void 0);let f=r===w&&a[l+1].startsWith("/>")?" ":"";o+=r===O?n+Xe:m>=0?(s.push(h),n.slice(0,m)+Oe+n.slice(m)+$+f):n+$+(m===-2?l:f)}return[He(a,o+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},M=class a{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,r=0,l=e.length-1,n=this.parts,[h,d]=Ke(e,t);if(this.el=a.createElement(h,s),x.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=x.nextNode())!==null&&n.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(Oe)){let _=d[r++],f=i.getAttribute(m).split($),U=/([.?@])?(.*)/.exec(_);n.push({type:1,index:o,name:U[2],strings:f,ctor:U[1]==="."?ie:U[1]==="?"?re:U[1]==="@"?ae:C}),i.removeAttribute(m)}else m.startsWith($)&&(n.push({type:6,index:o}),i.removeAttribute(m));if(Re.test(i.tagName)){let m=i.textContent.split($),_=m.length-1;if(_>0){i.textContent=G?G.emptyScript:"";for(let f=0;f<_;f++)i.append(m[f],R()),x.nextNode(),n.push({type:2,index:++o});i.append(m[_],R())}}}else if(i.nodeType===8)if(i.data===Pe)n.push({type:2,index:o});else{let m=-1;for(;(m=i.data.indexOf($,m+1))!==-1;)n.push({type:7,index:o}),m+=$.length-1}o++}}static createElement(e,t){let s=k.createElement("template");return s.innerHTML=e,s}};function E(a,e,t=a,s){var r,l,n;if(e===A)return e;let i=s!==void 0?(r=t._$Co)==null?void 0:r[s]:t._$Cl,o=H(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),o===void 0?i=void 0:(i=new o(a),i._$AT(a,t,s)),s!==void 0?((n=t._$Co)!=null?n:t._$Co=[])[s]=i:t._$Cl=i),i!==void 0&&(e=E(a,i._$AS(a,e.values),i,s)),e}var se=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var h;let{el:{content:t},parts:s}=this._$AD,i=((h=e==null?void 0:e.creationScope)!=null?h:k).importNode(t,!0);x.currentNode=i;let o=x.nextNode(),r=0,l=0,n=s[0];for(;n!==void 0;){if(r===n.index){let d;n.type===2?d=new L(o,o.nextSibling,this,e):n.type===1?d=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(d=new oe(o,this,e)),this._$AV.push(d),n=s[++l]}r!==(n==null?void 0:n.index)&&(o=x.nextNode(),r++)}return x.currentNode=k,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},L=class a{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,i){var o;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),H(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ye(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){var o;let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=M.createElement(He(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(t);else{let r=new se(i,this),l=r.u(this.options);r.p(t),this.T(l),this._$AH=r}}_$AC(e){let t=Te.get(e.strings);return t===void 0&&Te.set(e.strings,t=new M(e)),t}k(e){ne(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let o of e)i===t.length?t.push(s=new a(this.O(R()),this.O(R()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){let i=xe(e).nextSibling;xe(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,i){let o=this.strings,r=!1;if(o===void 0)e=E(this,e,t,0),r=!H(e)||e!==this._$AH&&e!==A,r&&(this._$AH=e);else{let l=e,n,h;for(e=o[0],n=0;n<o.length-1;n++)h=E(this,l[s+n],t,n),h===A&&(h=this._$AH[n]),r||(r=!H(h)||h!==this._$AH[n]),h===p?e=p:e!==p&&(e+=(h!=null?h:"")+o[n+1]),this._$AH[n]=h}r&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},ie=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},re=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},ae=class extends C{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){var r;if((e=(r=E(this,e,t,0))!=null?r:p)===A)return;let s=this._$AH,i=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}},oe=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var te=P.litHtmlPolyfillSupport,je;te==null||te(M,L),((je=P.litHtmlVersions)!=null?je:P.litHtmlVersions=[]).push("3.3.3");var Me=(a,e,t)=>{var o,r;let s=(o=t==null?void 0:t.renderBefore)!=null?o:e,i=s._$litPart$;if(i===void 0){let l=(r=t==null?void 0:t.renderBefore)!=null?r:null;s._$litPart$=i=new L(e.insertBefore(R(),l),l,void 0,t!=null?t:{})}return i._$AI(a),i};var S=globalThis,y=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;let e=super.createRenderRoot();return(s=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Me(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return A}},Le;y._$litElement$=!0,y.finalized=!0,(Le=S.litElementHydrateSupport)==null||Le.call(S,{LitElement:y});var he=S.litElementPolyfillSupport;he==null||he({LitElement:y});var Ne;((Ne=S.litElementVersions)!=null?Ne:S.litElementVersions=[]).push("4.2.2");var Ze=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-camera ${Ze}`);var Qe=[["live","Live","mdi:cctv"],["gestures","Gestures","mdi:hand-wave"],["people","People","mdi:account-multiple"],["things","Things","mdi:package-variant-closed"],["jarvis","Jarvis","mdi:account-voice"],["tuning","Tuning","mdi:tune-variant"]],J=[["gestureMatch","Gesture match strictness","How close a hand must be to the gestures you taught it. Lower is stricter (fewer accidents); raise it if taught gestures are missed.",.01],["framingFill","Framing","How much of the frame one person's upper body fills when auto-zoom is on. Lower shows more of the room; the face never fills more than a quarter.",.05],["holdSeconds","Hold time","Seconds a gesture must be held before it counts. Longer means fewer accidents.",.1],["handConfidence","Hand clarity","How clearly every finger must be seen. Higher ignores hands holding a phone or petting the dog.",.05],["lookTurn","Looking at the camera","How far your face may turn from the camera and still count as looking (0 = straight at it, 0.5 = side-on). Works with your head tilted, lying down. Raise it if you're refused while looking at the camera; lower it if glancing at your phone counts.",.01],["followGain","Following speed","How quickly the camera turns to keep you centred. Higher is snappier; too high and it wobbles.",.05],["gestureReach","Gesture height","A hand counts as raised when its wrist is above its elbow, or when it is no more than this many face-heights below your chin. Raise it if chest-height gestures are missed; lower it if a phone or keyboard sets gestures off.",.1],["hairReach","Head zone: above the face","Hands this far above your face (hair) pause gestures, in face-heights.",.1],["chinReach","Head zone: below the chin","Hands this far below your chin (eating, drinking) pause gestures, in face-heights.",.1],["steadiness","Hold-still tolerance","How still a hand must be for a gesture to count. Lower is stricter.",.05],["faceMatchThreshold","Face match strictness","Lower is stricter. Raise it if you're not recognized; lower it if people get mixed up.",.02],["searchDegrees","Search width","Degrees either side of the last sighting to search, until the room is learned.",1],["searchTilt","Search tilt","Degrees up (+) or down (\u2212) to search at, until the room is learned.",1]],et=a=>{let e=Array.isArray(a)?a:[];return e.length?e.map(s=>{var r;let i=s.action||s.service||s.choose&&"choose"||s.delay&&"delay"||s.event&&"event"||"";if(i==="hubbubb_home.mac_screen_sharing")return(r=s.data)!=null&&r.on?"Start Mac screen mirroring":"Stop Mac screen mirroring";if(!i.includes("."))return i?i[0].toUpperCase()+i.slice(1):"Step";let[,o]=i.split(".");return o.replace(/_/g," ").replace(/^./,l=>l.toUpperCase())}).join(", "):"Does nothing yet"},ze=(a,e=Date.now()/1e3)=>{if(!a)return"";let t=Math.max(0,e-a);return t<45?"just now":t<3600?`${Math.round(t/60)} min ago`:t<86400?`${Math.round(t/3600)} h ago`:`${Math.round(t/86400)} days ago`},N=a=>{var e,t,s,i;return{enabled:(e=a==null?void 0:a.enabled)!=null?e:!0,repeat:(t=a==null?void 0:a.repeat)!=null?t:!1,people:(s=a==null?void 0:a.people)!=null?s:[],actions:(i=a==null?void 0:a.actions)!=null?i:[]}},tt=(a,e)=>JSON.stringify(a)!==JSON.stringify(N(e)),B=[["listening","Listening","mdi:ear-hearing"],["thinking","Thinking","mdi:head-cog-outline"],["speaking","Speaking","mdi:account-voice"]],q=(a={})=>{var e,t,s,i,o,r,l;return u({move:(e=a.move)!=null?e:!0,satellites:(t=a.satellites)!=null?t:[],strength:(s=a.strength)!=null?s:.6,lights:(i=a.lights)!=null?i:!1,light_entities:(o=a.light_entities)!=null?o:[],brightness:(r=a.brightness)!=null?r:80,pause_while:(l=a.pause_while)!=null?l:""},Object.fromEntries(B.map(([n])=>{var h,d;return[`${n}_color`,(d=(h=a.colors)==null?void 0:h[n])!=null?d:null]})))},ce=a=>{let l=a,{listening_color:e,thinking_color:t,speaking_color:s,pause_while:i}=l,o=ue(l,["listening_color","thinking_color","speaking_color","pause_while"]),r=Object.fromEntries([["listening",e],["thinking",t],["speaking",s]].filter(([,n])=>Array.isArray(n)));return u(g(u({},o),{pause_while:i||null}),Object.keys(r).length?{colors:r}:{})},st,it=()=>st||(st=(async()=>{var t,s,i;if(customElements.get("ha-form")&&customElements.get("ha-selector"))return;let a=await((t=window.loadCardHelpers)==null?void 0:t.call(window)),e=await(a==null?void 0:a.createCardElement({type:"entities",entities:[]}));await((i=(s=e==null?void 0:e.constructor)==null?void 0:s.getConfigElement)==null?void 0:i.call(s)),await customElements.whenDefined("ha-form")})()),z=class extends y{constructor(){super(),this._tab=(()=>{try{return localStorage.getItem("hubbubb-camera-tab")||"live"}catch(e){return"live"}})(),this._state=null,this._err="",this._busy=!1,this._gestures=null,this._open=null,this._form=null,this._flash=null,this._items=null,this._enrollName="",this._pets=null,this._petForm={name:"",kind:"dog",spot:"",result:""},this._confirm=null,this._ask={q:"",answer:null,busy:!1},this._teach={name:"",where:"",result:null,busy:!1},this._formReady=!1,this._viewKey=0,this._jarvis=null,this._jarvisForm=null}connectedCallback(){super.connectedCallback(),it().then(()=>this._formReady=!0).catch(()=>this._formReady=!0),this._onVisible=()=>document.visibilityState==="visible"&&this._poll(),document.addEventListener("visibilitychange",this._onVisible),this._unsub=this.hass.connection.subscribeEvents(e=>this._fired(e.data),"hubbubb_home_gesture"),this._poll(),this._loadGestures()}disconnectedCallback(){var e;clearTimeout(this._timer),document.removeEventListener("visibilitychange",this._onVisible),(e=this._unsub)==null||e.then(t=>t()).catch(()=>{}),super.disconnectedCallback()}async _call(e,t={},s=!0){let i=await this.hass.callWS(u({type:"call_service",domain:"hubbubb_home",service:e,service_data:t},s?{return_response:!0}:{}));return(i==null?void 0:i.response)||{}}async _try(e){this._busy=!0,this._err="";try{return await e()}catch(t){this._err=(t==null?void 0:t.message)||String(t);return}finally{this._busy=!1}}async _poll(){var s,i,o,r;if(clearTimeout(this._timer),document.visibilityState!=="visible"||!this.isConnected)return;let e=(s=this._state)==null?void 0:s.connected;try{this._state=await this._call("camera_state"),e===!1&&this._state.connected&&this._viewKey++,this._err.startsWith("The camera")&&(this._err="")}catch(l){this._state={connected:!1,status:(l==null?void 0:l.message)||String(l)}}this._tab==="jarvis"&&this._loadJarvis(!1),this._tab==="people"&&(this._pets=await this._call("camera_pets").catch(()=>this._pets));let t=["live","people","jarvis"].includes(this._tab)||((i=this._state)==null?void 0:i.enrolling)||((r=(o=this._state)==null?void 0:o.gestures)==null?void 0:r.teaching);this._timer=setTimeout(()=>this._poll(),t?1500:6e3)}async _loadGestures(){let e=await this._try(()=>this._call("gestures_get"));e&&(this._gestures=e)}async _loadJarvis(e){try{this._jarvis=await this._call("jarvis_presence_get"),(e||!this._jarvisForm)&&(this._jarvisForm=q(this._jarvis.config))}catch(t){this._err=(t==null?void 0:t.message)||String(t)}}async _loadItems(){let e=await this._try(()=>this._call("camera_items"));e&&(this._items=e.items||[])}_fired(e){e.held||(this._flash=e,clearTimeout(this._flashTimer),this._flashTimer=setTimeout(()=>this._flash=null,2500),this._gestures&&(this._gestures=g(u({},this._gestures),{last:g(u({},e),{ts:Date.now()/1e3})})))}_go(e){this._tab=e,this._confirm=null;try{localStorage.setItem("hubbubb-camera-tab",e)}catch(t){}e==="things"&&!this._items&&this._loadItems(),e==="jarvis"&&this._loadJarvis(!0),this._poll()}get _cameraEntity(){var e;return(e=Object.values(this.hass.entities||{}).find(t=>t.platform==="hubbubb_home"&&t.entity_id.startsWith("camera.")))==null?void 0:e.entity_id}async _settings(e){let t=await this._try(()=>this._call("camera_settings",e));t&&(this._state=t)}render(){var t,s,i;let e=this._state;return c`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Camera</div>
        <span class="pill ${e!=null&&e.connected?"ok":"off"}">
          <span class="dot"></span>${e===null?"Connecting\u2026":e.connected?"Connected":"Offline"}
        </span>
      </div>
      <nav class="tabs" role="tablist">
        ${Qe.map(([o,r,l])=>c`<button role="tab" aria-selected=${this._tab===o} class=${this._tab===o?"on":""} @click=${()=>this._go(o)}>
            <ha-icon .icon=${l}></ha-icon><span>${r}</span>
          </button>`)}
      </nav>
      ${this._err?c`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:p}
      ${e&&!e.connected&&e.status?c`<div class="notice"><ha-icon icon="mdi:lan-disconnect"></ha-icon><div><b>The camera isn't reachable.</b><br />${e.status}<br /><span class="muted">It runs as Hubbubb Local Camera on the Mac and starts at login.</span></div></div>`:p}
      <main>
        ${(i=(s=(t={live:()=>this._renderLive(),gestures:()=>this._renderGestures(),people:()=>this._renderPeople(),things:()=>this._renderThings(),jarvis:()=>this._renderJarvis(),tuning:()=>this._renderTuning()})[this._tab])==null?void 0:s.call(t))!=null?i:p}
      </main>
    `}_renderView(e=!1){var i,o;let t=this._cameraEntity,s=t&&((o=(i=this.hass.states[t])==null?void 0:i.attributes)==null?void 0:o.access_token);return!t||!s?c`<div class="view empty ${e?"small":""}">No live view yet.</div>`:c`<div class="view steer ${e?"small":""}"
        title="Drag to move the camera · click someone to follow them"
        @pointerdown=${this._pointerDown} @pointermove=${this._pointerMove} @pointerup=${this._pointerUp} @pointercancel=${()=>this._drag=null}>
      <img
        alt="Live camera view" draggable="false"
        src=${`/api/camera_proxy_stream/${t}?token=${s}&v=${this._viewKey}`}
        @error=${()=>{clearTimeout(this._retry),this._retry=setTimeout(()=>this._viewKey++,2e3)}}
      />
      ${this._flash?c`<div class="toast"><ha-icon .icon=${this._iconFor(this._flash.gesture)}></ha-icon>${this._titleFor(this._flash.gesture)}${this._flash.person?c` · ${this._flash.person}`:p}</div>`:p}
    </div>`}_pointerDown(e){let t=e.currentTarget.querySelector("img");!t||e.button||(e.currentTarget.setPointerCapture(e.pointerId),this._drag={x:e.clientX,y:e.clientY,sentX:e.clientX,sentY:e.clientY,moved:!1,last:0,rect:t.getBoundingClientRect()})}_pointerMove(e){let t=this._drag;!t||!t.moved&&Math.hypot(e.clientX-t.x,e.clientY-t.y)<8||(t.moved=!0,Date.now()-t.last>150&&this._sendDrag(e))}_pointerUp(e){let t=this._drag;if(t){if(t.moved)this._sendDrag(e);else{let s=(e.clientX-t.rect.left)/t.rect.width,i=(e.clientY-t.rect.top)/t.rect.height;s>=0&&s<=1&&i>=0&&i<=1&&this._call("camera_focus",{x:s,y:i}).then(()=>this._poll()).catch(o=>this._err=(o==null?void 0:o.message)||String(o))}this._drag=null}}_sendDrag(e){let t=this._drag,s=r=>Math.max(-1,Math.min(1,r)),i=s((e.clientX-t.sentX)/t.rect.width),o=s((e.clientY-t.sentY)/t.rect.height);!i&&!o||(Object.assign(t,{sentX:e.clientX,sentY:e.clientY,last:Date.now()}),this._call("camera_drag",{dx:i,dy:o}).catch(r=>this._err=(r==null?void 0:r.message)||String(r)))}_titleFor(e){var t,s,i;return((i=(s=(t=this._gestures)==null?void 0:t.catalog)==null?void 0:s.find(o=>o.id===e))==null?void 0:i.title)||e}_iconFor(e){var t,s,i;return((i=(s=(t=this._gestures)==null?void 0:t.catalog)==null?void 0:s.find(o=>o.id===e))==null?void 0:i.icon)||"mdi:hand-wave"}_renderLive(){var o;let e=this._state||{},t=e.settings||{},s=e.people||[],i=e.animals||[];return c`
      <div class="live">
        <div>
          ${this._renderView()}
          <div class="status">${e.status||""}</div>
        </div>
        <div class="side">
          <section class="card">
            <h3>In view</h3>
            <div class="chips">
              ${s.map(r=>c`<span class="chip person"><ha-icon icon="mdi:account"></ha-icon>${r}</span>`)}
              ${i.map(r=>c`<span class="chip animal"><ha-icon icon="mdi:paw"></ha-icon>${r}</span>`)}
              ${!s.length&&!i.length?c`<span class="muted">Nobody recognized</span>`:p}
            </div>
          </section>
          <section class="card">
            <h3>Camera</h3>
            <p class="muted">Drag the picture to move the camera. Click a person or animal to follow just them.</p>
            ${e.focus?c`<div class="pan"><button @click=${()=>this._try(()=>this._call("camera_focus",{})).then(()=>this._poll())}><ha-icon icon="mdi:account-group"></ha-icon> Follow everyone again</button></div>`:p}
            ${this._formReady?c`<ha-form
                  .hass=${this.hass}
                  .data=${{follow:t.follow,auto_zoom:t.auto_zoom,zoom:(o=t.zoom)!=null?o:1}}
                  .schema=${[{name:"follow",selector:{boolean:{}}},{name:"auto_zoom",selector:{boolean:{}}},...t.auto_zoom?[]:[{name:"zoom",selector:{number:{min:1,max:4,step:.1,mode:"slider"}}}]]}
                  .computeLabel=${r=>({follow:"Follow people",auto_zoom:"Zoom to fit automatically",zoom:"Zoom"})[r.name]}
                  @value-changed=${r=>this._settingsFrom(r.detail.value,t)}
                ></ha-form>`:p}
          </section>
          <section class="card">
            <h3>Ask the camera</h3>
            <form class="inline" @submit=${r=>{r.preventDefault(),this._askCamera()}}>
              <input placeholder="Where are my keys?" .value=${this._ask.q} @input=${r=>this._ask=g(u({},this._ask),{q:r.target.value})} />
              <button class="primary" ?disabled=${this._ask.busy||!this._ask.q.trim()}>${this._ask.busy?"Looking\u2026":"Ask"}</button>
            </form>
            ${this._ask.answer?c`<p class="answer">${this._ask.answer}</p>`:p}
          </section>
        </div>
      </div>
    `}_settingsFrom(e,t){let s={};for(let i of["follow","auto_zoom","zoom"])e[i]!==void 0&&e[i]!==t[i]&&(s[i]=e[i]);Object.keys(s).length&&this._settings(s)}async _askCamera(){this._ask=g(u({},this._ask),{busy:!0,answer:null});try{let e=await this._call("camera_look",{question:this._ask.q.trim()}),t=!e.found&&e.last_seen?` Last seen ${e.last_seen}`:"";this._ask=g(u({},this._ask),{busy:!1,answer:(e.answer||e.error||"No answer.")+t})}catch(e){this._ask=g(u({},this._ask),{busy:!1,answer:(e==null?void 0:e.message)||String(e)})}}_renderGestures(){let e=this._gestures;return e?c`
      <p class="intro">Look at the camera and hold a gesture steady at chest height for about a second. Assign each one any Home Assistant actions — the same editor automations use. Hands at the keyboard, near your face, or while you look elsewhere never count.</p>
      <section class="card">
        <ha-formfield label="Gestures on — turn off for meetings or when talking with your hands">
          <ha-switch .checked=${e.on!==!1} ?disabled=${this._busy} @change=${t=>this._gesturesOn(t.target.checked)}></ha-switch>
        </ha-formfield>
      </section>
      <div class="gestures ${e.on===!1?"disabled":""}">
        ${e.catalog.map(t=>this._renderGesture(t,e.gestures[t.id]))}
      </div>
    `:c`<div class="empty">Loading gestures…</div>`}async _gesturesOn(e){await this._try(()=>this._call("gestures_enable",{on:e},!1)),this._loadGestures()}_renderGesture(e,t){var n,h,d,m,_,f;let s=this._open===e.id,i=s?this._form:N(t),o=((n=this._flash)==null?void 0:n.gesture)===e.id,r=(m=(d=(h=this._state)==null?void 0:h.gestures)==null?void 0:d.taught)==null?void 0:m[e.id],l=((_=this._gestures.last)==null?void 0:_.gesture)===e.id?this._gestures.last:null;return c`
      <section class="card gesture ${s?"open":""} ${o?"lit":""} ${i.enabled?"":"disabled"}">
        <button class="ghead" aria-expanded=${s} @click=${()=>this._toggleGesture(e.id,t)}>
          <span class="gicon"><ha-icon .icon=${e.icon}></ha-icon></span>
          <span class="gtext">
            <span class="name">${e.title} <span class="badge ${r?"on":""}">${r?"Taught":"Built-in shape"}</span></span>
            <span class="muted">${e.how}</span>
            <span class="summary">${i.enabled?et(t==null?void 0:t.actions):"Turned off"}${t!=null&&t.repeat?" \xB7 repeats while held":""}${(f=t==null?void 0:t.people)!=null&&f.length?` \xB7 only ${t.people.join(", ")}`:""}</span>
          </span>
          ${l?c`<span class="muted when">${l.person?`${l.person}, `:""}${ze(l.ts)}</span>`:p}
          <ha-icon class="chev" icon=${s?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${s?this._renderGestureEditor(e):p}
      </section>
    `}_toggleGesture(e,t){if(this._open===e){this._open=null,this._form=null;return}this._open=e,this._form=N(t)}_renderTeach(e){var o,r,l;let t=((o=this._state)==null?void 0:o.gestures)||{},s=t.teaching,i=(r=t.taught)==null?void 0:r[e.id];return(s==null?void 0:s.gesture)===e.id?c`<div class="teach-box">
        <div class="teach-row">
          <div class="teach-view">${this._renderView(!0)}</div>
          <div>
            <div class="name">Teaching ${e.title}…</div>
            <div class="progress"><div style=${`width:${Math.round(100*s.samples/s.target)}%`}></div></div>
            <p class="muted">${((l=this._state)==null?void 0:l.status)||""}</p>
            <p class="muted small">Look at the camera, hold ${e.title.toLowerCase()} at chest height, and move it around a little — closer, further, tilted — so it learns your hand from every angle.</p>
          </div>
        </div>
      </div>`:c`<div class="teach-box">
      <div class="teach-row-inline">
        <div class="grow">
          <div class="name">${i?`Taught from your hand (${i} samples)`:"Using the built-in shape"}</div>
          <div class="muted small">${i?"Re-teach it if it's being missed or mistaken for another gesture.":"Teach it your way of doing it \u2014 it takes 3 seconds and makes it far more reliable."}</div>
        </div>
        <button class="primary" ?disabled=${this._busy||!!s} @click=${()=>this._try(()=>this._call("camera_gesture_teach",{gesture:e.id})).then(()=>this._poll())}>${i?"Re-teach":"Teach it"}</button>
        ${i?c`<button ?disabled=${this._busy||!!s} @click=${()=>this._forgetTeach(e.id)}>${this._confirm===`g:${e.id}`?"Really forget?":"Forget"}</button>`:p}
      </div>
    </div>`}async _forgetTeach(e){if(this._confirm!==`g:${e}`)return this._confirm=`g:${e}`;this._confirm=null,await this._try(()=>this._call("camera_gesture_forget",{gesture:e})),this._poll()}_renderGestureEditor(e){var o;let t=(((o=this._state)==null?void 0:o.enrolled)||[]).map(r=>r.name),s=this._gestures.gestures[e.id],i=tt(this._form,s);return this._formReady?c`
      <div class="editor">
        ${this._renderTeach(e)}
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${[{name:"enabled",selector:{boolean:{}}},{name:"repeat",selector:{boolean:{}}},...t.length?[{name:"people",selector:{select:{multiple:!0,mode:"list",options:t.map(r=>({value:r,label:r}))}}}]:[]]}
          .computeLabel=${r=>({enabled:"On",repeat:"Repeat while held",people:"Only for these people"})[r.name]}
          .computeHelper=${r=>({repeat:"Runs again every \u2153 second while you hold it \u2014 for things like volume.",people:"Leave all unticked to let anyone use it."})[r.name]}
          @value-changed=${r=>this._form=u(u({},this._form),r.detail.value)}
        ></ha-form>
        <h4>Then do</h4>
        <ha-form
          .hass=${this.hass}
          .data=${{actions:this._form.actions}}
          .schema=${[{name:"actions",selector:{action:{}}}]}
          .computeLabel=${()=>""}
          @value-changed=${r=>this._form=g(u({},this._form),{actions:r.detail.value.actions||[]})}
        ></ha-form>
        <p class="muted small">Actions can use <code>{{ person }}</code> — who made the gesture, if recognized.</p>
        <div class="actions">
          <button class="primary" ?disabled=${this._busy||!i} @click=${()=>this._saveGesture(e.id)}>${i?"Save":"Saved"}</button>
          <button ?disabled=${this._busy||!this._form.actions.length} @click=${()=>this._testGesture(e.id,i)}>Test</button>
          ${i?c`<button ?disabled=${this._busy} @click=${()=>this._form=N(s)}>Undo changes</button>`:p}
        </div>
      </div>
    `:c`<div class="empty">Loading the editor…</div>`}async _saveGesture(e){let t=await this._try(()=>this._call("gesture_save",u({gesture:e},this._form)));t&&(this._gestures=g(u({},this._gestures),{gestures:g(u({},this._gestures.gestures),{[e]:t.saved})}),this._form=N(t.saved))}async _testGesture(e,t){t&&await this._saveGesture(e),!this._err&&await this._try(()=>this._call("gesture_test",{gesture:e},!1))}_renderPeople(){let e=this._state||{},t=e.enrolled||[],s=e.enrolling;return c`
      <div class="two">
        <section class="card">
          <h3>Who the camera knows</h3>
          ${t.length?t.map(i=>c`<div class="row">
                  <ha-icon icon="mdi:account-circle"></ha-icon>
                  <div class="grow"><div class="name">${i.name}</div><div class="muted">${i.samples} face samples${(e.people||[]).includes(i.name)?" \xB7 in view now":""}</div></div>
                  <button ?disabled=${this._busy||s} @click=${()=>this._enroll(i.name)}>Re-enroll</button>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetPerson(i.name)}>${this._confirm===`p:${i.name}`?"Really forget?":"Forget"}</button>
                </div>`):c`<p class="muted">Nobody yet. Enroll each person once so the camera — and Jarvis — knows who's who.</p>`}
          <h3>Enroll someone</h3>
          ${s?c`<div class="enrolling">
                <div class="name">Enrolling ${s.name}…</div>
                <div class="progress"><div style=${`width:${Math.round(100*s.samples/s.target)}%`}></div></div>
                <p class="muted">${e.status}</p>
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
        <div>${this._renderView(!0)}<div class="status">${e.status||""}</div></div>
      </div>
      ${this._renderPets()}
    `}_renderPets(){var l,n;let e=this._pets||{},t=Object.entries(e.pets||{}),s=Object.keys(e.spots||{}),i=e.pets_at||{},o=((l=this._state)==null?void 0:l.animals)||[],r=this._petForm;return c`
      <section class="card">
        <h3>Pets</h3>
        <p class="muted">Name your pet, then mark the door they wait at. When they wait there a while, Jarvis tells you they may need to go out.</p>
        ${t.map(([h,d])=>c`<div class="row">
            <ha-icon icon=${d==="cat"?"mdi:cat":"mdi:dog"}></ha-icon>
            <div class="grow"><div class="name">${h}</div><div class="muted">${d}${i[h]?` \xB7 at the ${i[h]} now`:o.includes(h)?" \xB7 in view now":""}</div></div>
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._petSave({name:h,forget:!0},`pet:${h}`)}>${this._confirm===`pet:${h}`?"Really forget?":"Forget"}</button>
          </div>`)}
        <form class="inline wrap" @submit=${h=>{h.preventDefault(),this._petSave({name:r.name.trim(),kind:r.kind})}}>
          <input placeholder="Pet's name, e.g. Vader" .value=${r.name} @input=${h=>this._petForm=g(u({},r),{name:h.target.value})} />
          <select .value=${r.kind} @change=${h=>this._petForm=g(u({},r),{kind:h.target.value})}>
            <option value="dog">Dog</option><option value="cat">Cat</option>
          </select>
          <button class="primary" ?disabled=${this._busy||!r.name.trim()}>Add pet</button>
        </form>
        <h3>Doors they wait at</h3>
        ${s.map(h=>c`<div class="row">
            <ha-icon icon="mdi:door"></ha-icon>
            <div class="grow"><div class="name">${h}</div></div>
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._petSpot({name:h,forget:!0},`spot:${h}`)}>${this._confirm===`spot:${h}`?"Really forget?":"Forget"}</button>
          </div>`)}
        <form class="inline wrap" @submit=${h=>{h.preventDefault(),this._petSpot({name:r.spot.trim()})}}>
          <input placeholder="Spot name, e.g. back door" .value=${r.spot} @input=${h=>this._petForm=g(u({},r),{spot:h.target.value})} />
          <button class="primary" ?disabled=${this._busy||!r.spot.trim()}>Mark where my pet is now</button>
        </form>
        <p class="muted">Do this while your pet stands at the door, in the camera's view.</p>
        ${r.result?c`<p class="answer">${r.result}</p>`:p}
        <label class="inline">Tell me after
          <input type="number" min="0.5" max="60" step="0.5" style="width:5em" .value=${String((n=e.wait_minutes)!=null?n:3)}
            @change=${h=>this._petSave({wait_minutes:Number(h.target.value)})} />
          minutes at a door</label>
      </section>
    `}async _petSave(e,t){if(t&&this._confirm!==t)return this._confirm=t;this._confirm=null;let s=await this._try(()=>this._call("camera_pets_save",e));s&&(this._pets=s,e.kind&&(this._petForm=g(u({},this._petForm),{name:""})))}async _petSpot(e,t){if(t&&this._confirm!==t)return this._confirm=t;this._confirm=null;let s=await this._try(()=>this._call("camera_pet_spot",e));s&&(this._petForm=g(u({},this._petForm),{spot:s.marked?"":this._petForm.spot,result:s.error||(s.marked?`Marked "${s.marked}" where ${s.by} is.`:"")}),this._pets=await this._call("camera_pets").catch(()=>this._pets))}async _enroll(e){if(!e)return;await this._try(()=>this._call("camera_enroll",{name:e}))&&(this._enrollName="",this._poll())}async _forgetPerson(e){if(this._confirm!==`p:${e}`)return this._confirm=`p:${e}`;this._confirm=null,await this._try(()=>this._call("camera_forget_person",{name:e})),this._poll()}_renderThings(){let e=this._teach;return c`
      <section class="card teach">
        <h3>Teach it something</h3>
        <p class="muted">Hold the thing up to the camera and name it — or say where it is. Next time you ask Jarvis where it is, the camera knows what to look for. You can also just say "Jarvis, this is my …" while holding it.</p>
        <form class="inline wrap" @submit=${t=>{t.preventDefault(),this._learn()}}>
          <input placeholder="Name, e.g. AirPods case" .value=${e.name} @input=${t=>this._teach=g(u({},e),{name:t.target.value})} />
          <input placeholder="Where (optional), e.g. on the shelf by the door" .value=${e.where} @input=${t=>this._teach=g(u({},e),{where:t.target.value})} />
          <button class="primary" ?disabled=${e.busy||!e.name.trim()}>${e.busy?"Looking\u2026":"Teach"}</button>
        </form>
        ${e.result?c`<p class="answer">${e.result}</p>`:p}
      </section>
      ${this._items===null?c`<div class="empty">Loading…</div>`:this._items.length?c`<div class="items">
              ${this._items.map(t=>c`<section class="card item">
                  ${t.photo?c`<img alt=${t.name} src=${`data:image/jpeg;base64,${t.photo}`} />`:c`<div class="noimg"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`}
                  <div class="name">${t.name}</div>
                  <div class="muted">${t.description}</div>
                  <div class="seen">${t.last_seen_at?c`<ha-icon icon="mdi:map-marker-outline"></ha-icon>${ze(t.last_seen_at)}: ${t.last_seen}`:c`<span class="muted">Not spotted yet</span>`}</div>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetItem(t.name)}>${this._confirm===`i:${t.name}`?"Really forget?":"Forget"}</button>
                </section>`)}
            </div>`:c`<div class="empty">Nothing taught yet.</div>`}
    `}async _learn(){let e=this._teach;this._teach=g(u({},e),{busy:!0,result:null});try{let t=await this._call("camera_learn",{name:e.name.trim(),hint:e.where.trim()});this._teach=t.learned?{name:"",where:"",busy:!1,result:`Got it \u2014 ${t.learned}: ${t.looks_like}`}:g(u({},e),{busy:!1,result:t.error||"It couldn't make that out."}),t.learned&&this._loadItems()}catch(t){this._teach=g(u({},e),{busy:!1,result:(t==null?void 0:t.message)||String(t)})}}async _forgetItem(e){if(this._confirm!==`i:${e}`)return this._confirm=`i:${e}`;this._confirm=null,await this._try(()=>this._call("camera_forget_item",{name:e})),this._loadItems()}_renderJarvis(){let e=this._jarvis,t=this._jarvisForm;if(!e||!t||!this._formReady)return c`<div class="empty">Loading…</div>`;let s=JSON.stringify(ce(t))!==JSON.stringify(ce(q(e.config))),i=B.find(([o])=>o===e.mood);return c`
      <p class="intro">While Jarvis listens, thinks and talks through your Voice puck, the camera can move like it's paying attention, and lights can glow to show what it's doing. Both go back to normal when Jarvis is done.</p>
      <div class="two">
        <section class="card">
          <h3>Now</h3>
          <div class="mood ${e.mood}">
            <ha-icon .icon=${(i==null?void 0:i[2])||"mdi:sleep"}></ha-icon>
            <span>${i?i[1]:"Idle"}</span>
          </div>
          <h3>Preview</h3>
          <div class="actions">
            ${B.map(([o,r,l])=>c`<button ?disabled=${this._busy||s} title=${s?"Save first":""} @click=${()=>this._try(()=>this._call("jarvis_presence_test",{mood:o},!1))}><ha-icon .icon=${l}></ha-icon> ${r}</button>`)}
          </div>
          <p class="muted small">Plays for 4 seconds, then puts the camera and lights back.</p>
        </section>
        <section class="card">
          <h3>Camera movement</h3>
          <ha-form
            .hass=${this.hass}
            .data=${t}
            .schema=${[{name:"move",selector:{boolean:{}}},...t.move?[{name:"strength",selector:{number:{min:.1,max:1,step:.05,mode:"slider"}}}]:[],{name:"satellites",selector:{entity:{domain:"assist_satellite",multiple:!0}}}]}
            .computeLabel=${o=>({move:"Move the camera while Jarvis talks",strength:"How much it moves",satellites:"Which pucks"})[o.name]}
            .computeHelper=${o=>({strength:"A perk-up when listening, a glance while thinking, gentle nods while speaking.",satellites:"Leave empty to follow every voice puck."})[o.name]}
            @value-changed=${o=>this._jarvisForm=u(u({},this._jarvisForm),o.detail.value)}
          ></ha-form>
          <h3>Lights</h3>
          <ha-form
            .hass=${this.hass}
            .data=${t}
            .schema=${[{name:"lights",selector:{boolean:{}}},...t.lights?[{name:"light_entities",selector:{entity:{domain:"light",multiple:!0}}},{name:"brightness",selector:{number:{min:1,max:100,step:1,mode:"slider",unit_of_measurement:"%"}}},...B.map(([o])=>({name:`${o}_color`,selector:{color_rgb:{}}})),{name:"pause_while",selector:{entity:{}}}]:[]]}
            .computeLabel=${o=>({lights:"Tint lights while Jarvis talks",light_entities:"Which lights",brightness:"Brightness",listening_color:"Listening colour",thinking_color:"Thinking colour",speaking_color:"Speaking colour",pause_while:"Leave the lights alone while this is on"})[o.name]}
            .computeHelper=${o=>({light_entities:"Coloured lights near the TV work best, like the Hue Play bars.",pause_while:"For example the Sync Box's light sync, which owns those lights while it runs."})[o.name]}
            @value-changed=${o=>this._jarvisForm=u(u({},this._jarvisForm),o.detail.value)}
          ></ha-form>
          <div class="actions">
            <button class="primary" ?disabled=${this._busy||!s} @click=${()=>this._saveJarvis()}>${s?"Save":"Saved"}</button>
            ${s?c`<button ?disabled=${this._busy} @click=${()=>this._jarvisForm=q(e.config)}>Undo changes</button>`:p}
          </div>
        </section>
      </div>
    `}async _saveJarvis(){let e=await this._try(()=>this._call("jarvis_presence_save",ce(this._jarvisForm)));e&&(this._jarvis=g(u({},this._jarvis),{config:e.config}),this._jarvisForm=q(e.config))}_renderTuning(){var r,l;let e=this._state||{},t=e.settings||{},s=e.knobs||{},i=e.room||{},o=u({require_looking:t.require_looking},Object.fromEntries(J.map(([n])=>[n,t[n]])));return c`
      <div class="two">
        <section class="card">
          <h3>Tuning</h3>
          ${this._formReady&&Object.keys(s).length?c`<ha-form
                .hass=${this.hass}
                .data=${o}
                .schema=${[{name:"require_looking",selector:{boolean:{}}},...J.filter(([n])=>s[n]).map(([n,,,h])=>({name:n,selector:{number:{min:s[n].min,max:s[n].max,step:h,mode:"slider"}}}))]}
                .computeLabel=${n=>{var h;return n.name==="require_looking"?"Only when looking at the camera":(h=J.find(([d])=>d===n.name))==null?void 0:h[1]}}
                .computeHelper=${n=>{var h;return n.name==="require_looking"?"Gestures only count while the person faces the camera. The live view marks them \u201Clooking\u201D.":(h=J.find(([d])=>d===n.name))==null?void 0:h[2]}}
                @value-changed=${n=>this._knobs(n.detail.value,o)}
              ></ha-form>
              <div class="actions">
                <button ?disabled=${this._busy} @click=${()=>this._settings(u({require_looking:!0},Object.fromEntries(Object.entries(s).map(([n,h])=>[n,h.default]))))}>Reset to defaults</button>
              </div>`:c`<div class="empty">Waiting for the camera…</div>`}
        </section>
        <section class="card">
          <h3>Room map</h3>
          ${i.learned?c`<p>The camera has learned where people spend time: <b>${Math.round(i.low)}° to ${Math.round(i.high)}°</b> of pan, from ${i.sightings} sightings. Searches stay inside that span, skipping walls, corners and the back of the TV.</p>`:c`<p>Still learning where people spend time: ${(r=i.sightings)!=null?r:0} of ${(l=i.needed)!=null?l:30} sightings. Until then it searches around where it last saw someone.</p>`}
          <div class="actions">
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._resetRoom()}>${this._confirm==="room"?"Really relearn?":"Relearn the room"}</button>
          </div>
          <p class="muted small">Relearn after moving the camera or the furniture.</p>
        </section>
      </div>
    `}_knobs(e,t){let s=Object.fromEntries(Object.entries(e).filter(([i,o])=>o!==void 0&&o!==t[i]));clearTimeout(this._knobTimer),Object.keys(s).length&&(this._knobTimer=setTimeout(()=>this._settings(s),300))}async _resetRoom(){if(this._confirm!=="room")return this._confirm="room";this._confirm=null,await this._try(()=>this._call("camera_room_reset")),this._poll()}};W(z,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_tab:{state:!0},_state:{state:!0},_err:{state:!0},_busy:{state:!0},_gestures:{state:!0},_open:{state:!0},_form:{state:!0},_flash:{state:!0},_items:{state:!0},_enrollName:{state:!0},_confirm:{state:!0},_ask:{state:!0},_teach:{state:!0},_formReady:{state:!0},_viewKey:{state:!0},_jarvis:{state:!0},_jarvisForm:{state:!0},_pets:{state:!0},_petForm:{state:!0}}),W(z,"styles",Y`
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

    input {
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
  `);customElements.define("hubbubb-camera",z);export{J as KNOBS,ze as ago,tt as changed,N as gestureForm,ce as jarvisConfig,q as jarvisForm,et as summarizeActions};
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
