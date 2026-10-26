var Ue=Object.defineProperty,De=Object.defineProperties;var Fe=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var de=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var V=(r,e,t)=>e in r?Ue(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,u=(r,e)=>{for(var t in e||(e={}))de.call(e,t)&&V(r,t,e[t]);if(D)for(var t of D(e))pe.call(e,t)&&V(r,t,e[t]);return r},g=(r,e)=>De(r,Fe(e));var ue=(r,e)=>{var t={};for(var s in r)de.call(r,s)&&e.indexOf(s)<0&&(t[s]=r[s]);if(r!=null&&D)for(var s of D(r))e.indexOf(s)<0&&pe.call(r,s)&&(t[s]=r[s]);return t};var W=(r,e,t)=>V(r,typeof e!="symbol"?e+"":e,t);var F=globalThis,I=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),me=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(I&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=me.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&me.set(t,e))}return e}toString(){return this.cssText}},ge=r=>new T(typeof r=="string"?r:r+"",void 0,K),Z=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new T(t,r,K)},_e=(r,e)=>{if(I)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=F.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},X=I?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ge(t)})(r):r;var{is:Ie,defineProperty:Je,getOwnPropertyDescriptor:qe,getOwnPropertyNames:Ge,getOwnPropertySymbols:Be,getPrototypeOf:Ve}=Object,b=globalThis,fe=b.trustedTypes,We=fe?fe.emptyScript:"",Y=b.reactiveElementPolyfillSupport,j=(r,e)=>r,Q={toAttribute(r,e){switch(e){case Boolean:r=r?We:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch(s){t=null}}return t}},xe=(r,e)=>!Ie(r,e),ve={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:xe},be,$e;(be=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),($e=b.litPropertyMetadata)!=null||(b.litPropertyMetadata=new WeakMap);var f=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ve){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Je(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){var o;let{get:i,set:a}=(o=qe(this.prototype,e))!=null?o:{get(){return this[t]},set(l){this[t]=l}};return{get:i,set(l){let n=i==null?void 0:i.call(this);a==null||a.call(this,l),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:ve}static _$Ei(){if(this.hasOwnProperty(j("elementProperties")))return;let e=Ve(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(j("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(j("properties"))){let t=this.properties,s=[...Ge(t),...Be(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(X(i))}else e!==void 0&&t.push(X(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return _e(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var a;let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let o=(((a=s.converter)==null?void 0:a.toAttribute)!==void 0?s.converter:Q).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){var a,o,l;let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((a=n.converter)==null?void 0:a.fromAttribute)!==void 0?n.converter:Q;this._$Em=i;let d=c.fromAttribute(t,n.type);this[i]=(l=d!=null?d:(o=this._$Ej)==null?void 0:o.get(i))!=null?l:d,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){var o,l;if(e!==void 0){let n=this.constructor;if(i===!1&&(a=this[e]),s!=null||(s=n.getPropertyOptions(e)),!(((o=s.hasChanged)!=null?o:xe)(a,t)||s.useDefault&&s.reflect&&a===((l=this._$Ej)==null?void 0:l.get(e))&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){var l,n,c;s&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(n=o!=null?o:t)!=null?n:this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&((c=this._$Eq)!=null?c:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,l]of this._$Ep)this[o]=l;this._$Ep=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[o,l]of a){let{wrapped:n}=l,c=this[o];n!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,l,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(a=>{var o;return(o=a.hostUpdate)==null?void 0:o.call(a)}),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},ye;f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[j("elementProperties")]=new Map,f[j("finalized")]=new Map,Y==null||Y({ReactiveElement:f}),((ye=b.reactiveElementVersions)!=null?ye:b.reactiveElementVersions=[]).push("2.1.2");var O=globalThis,we=r=>r,J=O.trustedTypes,ke=J?J.createPolicy("lit-html",{createHTML:r=>r}):void 0,Pe="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Oe="?"+$,Ke=`<${Oe}>`,k=document,R=()=>k.createComment(""),H=r=>r===null||typeof r!="object"&&typeof r!="function",ne=Array.isArray,Ze=r=>ne(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",ee=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ae=/-->/g,Se=/>/g,x=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ee=/'/g,Ce=/"/g,Re=/^(?:script|style|textarea|title)$/i,le=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),h=le(1),ht=le(2),ct=le(3),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Te=new WeakMap,w=k.createTreeWalker(k,129);function He(r,e){if(!ne(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ke!==void 0?ke.createHTML(e):e}var Xe=(r,e)=>{let t=r.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",o=P;for(let l=0;l<t;l++){let n=r[l],c,d,m=-1,_=0;for(;_<n.length&&(o.lastIndex=_,d=o.exec(n),d!==null);)_=o.lastIndex,o===P?d[1]==="!--"?o=Ae:d[1]!==void 0?o=Se:d[2]!==void 0?(Re.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=x):d[3]!==void 0&&(o=x):o===x?d[0]===">"?(o=i!=null?i:P,m=-1):d[1]===void 0?m=-2:(m=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?x:d[3]==='"'?Ce:Ee):o===Ce||o===Ee?o=x:o===Ae||o===Se?o=P:(o=x,i=void 0);let v=o===x&&r[l+1].startsWith("/>")?" ":"";a+=o===P?n+Ke:m>=0?(s.push(c),n.slice(0,m)+Pe+n.slice(m)+$+v):n+$+(m===-2?l:v)}return[He(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},N=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0,l=e.length-1,n=this.parts,[c,d]=Xe(e,t);if(this.el=r.createElement(c,s),w.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=w.nextNode())!==null&&n.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(Pe)){let _=d[o++],v=i.getAttribute(m).split($),U=/([.?@])?(.*)/.exec(_);n.push({type:1,index:a,name:U[2],strings:v,ctor:U[1]==="."?ie:U[1]==="?"?re:U[1]==="@"?ae:C}),i.removeAttribute(m)}else m.startsWith($)&&(n.push({type:6,index:a}),i.removeAttribute(m));if(Re.test(i.tagName)){let m=i.textContent.split($),_=m.length-1;if(_>0){i.textContent=J?J.emptyScript:"";for(let v=0;v<_;v++)i.append(m[v],R()),w.nextNode(),n.push({type:2,index:++a});i.append(m[_],R())}}}else if(i.nodeType===8)if(i.data===Oe)n.push({type:2,index:a});else{let m=-1;for(;(m=i.data.indexOf($,m+1))!==-1;)n.push({type:7,index:a}),m+=$.length-1}a++}}static createElement(e,t){let s=k.createElement("template");return s.innerHTML=e,s}};function E(r,e,t=r,s){var o,l,n;if(e===A)return e;let i=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl,a=H(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==a&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?((n=t._$Co)!=null?n:t._$Co=[])[s]=i:t._$Cl=i),i!==void 0&&(e=E(r,i._$AS(r,e.values),i,s)),e}var se=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var c;let{el:{content:t},parts:s}=this._$AD,i=((c=e==null?void 0:e.creationScope)!=null?c:k).importNode(t,!0);w.currentNode=i;let a=w.nextNode(),o=0,l=0,n=s[0];for(;n!==void 0;){if(o===n.index){let d;n.type===2?d=new L(a,a.nextSibling,this,e):n.type===1?d=new n.ctor(a,n.name,n.strings,this,e):n.type===6&&(d=new oe(a,this,e)),this._$AV.push(d),n=s[++l]}o!==(n==null?void 0:n.index)&&(a=w.nextNode(),o++)}return w.currentNode=k,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},L=class r{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,i){var a;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(a=i==null?void 0:i.isConnected)!=null?a:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),H(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ze(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){var a;let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=N.createElement(He(s.h,s.h[0]),this.options)),s);if(((a=this._$AH)==null?void 0:a._$AD)===i)this._$AH.p(t);else{let o=new se(i,this),l=o.u(this.options);o.p(t),this.T(l),this._$AH=o}}_$AC(e){let t=Te.get(e.strings);return t===void 0&&Te.set(e.strings,t=new N(e)),t}k(e){ne(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new r(this.O(R()),this.O(R()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){let i=we(e).nextSibling;we(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,i){let a=this.strings,o=!1;if(a===void 0)e=E(this,e,t,0),o=!H(e)||e!==this._$AH&&e!==A,o&&(this._$AH=e);else{let l=e,n,c;for(e=a[0],n=0;n<a.length-1;n++)c=E(this,l[s+n],t,n),c===A&&(c=this._$AH[n]),o||(o=!H(c)||c!==this._$AH[n]),c===p?e=p:e!==p&&(e+=(c!=null?c:"")+a[n+1]),this._$AH[n]=c}o&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},ie=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},re=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},ae=class extends C{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){var o;if((e=(o=E(this,e,t,0))!=null?o:p)===A)return;let s=this._$AH,i=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}},oe=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var te=O.litHtmlPolyfillSupport,je;te==null||te(N,L),((je=O.litHtmlVersions)!=null?je:O.litHtmlVersions=[]).push("3.3.3");var Ne=(r,e,t)=>{var a,o;let s=(a=t==null?void 0:t.renderBefore)!=null?a:e,i=s._$litPart$;if(i===void 0){let l=(o=t==null?void 0:t.renderBefore)!=null?o:null;s._$litPart$=i=new L(e.insertBefore(R(),l),l,void 0,t!=null?t:{})}return i._$AI(r),i};var S=globalThis,y=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;let e=super.createRenderRoot();return(s=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return A}},Le;y._$litElement$=!0,y.finalized=!0,(Le=S.litElementHydrateSupport)==null||Le.call(S,{LitElement:y});var he=S.litElementPolyfillSupport;he==null||he({LitElement:y});var ze;((ze=S.litElementVersions)!=null?ze:S.litElementVersions=[]).push("4.2.2");var Ye=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-camera ${Ye}`);var Qe=[["live","Live","mdi:cctv"],["gestures","Gestures","mdi:hand-wave"],["people","People","mdi:account-multiple"],["things","Things","mdi:package-variant-closed"],["jarvis","Jarvis","mdi:account-voice"],["tuning","Tuning","mdi:tune-variant"]],q=[["holdSeconds","Hold time","Seconds a gesture must be held before it counts. Longer means fewer accidents.",.1],["handConfidence","Hand clarity","How clearly every finger must be seen. Higher ignores hands holding a phone or petting the dog.",.05],["lookAngle","Looking-at-camera angle","How far your head may turn from the camera (degrees) and still count as looking at it.",1],["followGain","Following speed","How quickly the camera turns to keep you centred. Higher is snappier; too high and it wobbles.",.05],["gestureReach","Gesture height","How far below your chin a hand still counts, in face-heights. Lower it if typing sets gestures off.",.1],["hairReach","Head zone: above the face","Hands this far above your face (hair) pause gestures, in face-heights.",.1],["chinReach","Head zone: below the chin","Hands this far below your chin (eating, drinking) pause gestures, in face-heights.",.1],["steadiness","Hold-still tolerance","How still a hand must be for a gesture to count. Lower is stricter.",.05],["faceMatchThreshold","Face match strictness","Lower is stricter. Raise it if you're not recognized; lower it if people get mixed up.",.02],["searchDegrees","Search width","Degrees either side of the last sighting to search, until the room is learned.",1],["searchTilt","Search tilt","Degrees up (+) or down (\u2212) to search at, until the room is learned.",1]],et=r=>{let e=Array.isArray(r)?r:[];return e.length?e.map(s=>{var o;let i=s.action||s.service||s.choose&&"choose"||s.delay&&"delay"||s.event&&"event"||"";if(i==="hubbubb_home.mac_screen_sharing")return(o=s.data)!=null&&o.on?"Start Mac screen mirroring":"Stop Mac screen mirroring";if(!i.includes("."))return i?i[0].toUpperCase()+i.slice(1):"Step";let[,a]=i.split(".");return a.replace(/_/g," ").replace(/^./,l=>l.toUpperCase())}).join(", "):"Does nothing yet"},Me=(r,e=Date.now()/1e3)=>{if(!r)return"";let t=Math.max(0,e-r);return t<45?"just now":t<3600?`${Math.round(t/60)} min ago`:t<86400?`${Math.round(t/3600)} h ago`:`${Math.round(t/86400)} days ago`},z=r=>{var e,t,s,i;return{enabled:(e=r==null?void 0:r.enabled)!=null?e:!0,repeat:(t=r==null?void 0:r.repeat)!=null?t:!1,people:(s=r==null?void 0:r.people)!=null?s:[],actions:(i=r==null?void 0:r.actions)!=null?i:[]}},tt=(r,e)=>JSON.stringify(r)!==JSON.stringify(z(e)),B=[["listening","Listening","mdi:ear-hearing"],["thinking","Thinking","mdi:head-cog-outline"],["speaking","Speaking","mdi:account-voice"]],G=(r={})=>{var e,t,s,i,a,o,l;return u({move:(e=r.move)!=null?e:!0,satellites:(t=r.satellites)!=null?t:[],strength:(s=r.strength)!=null?s:.6,lights:(i=r.lights)!=null?i:!1,light_entities:(a=r.light_entities)!=null?a:[],brightness:(o=r.brightness)!=null?o:80,pause_while:(l=r.pause_while)!=null?l:""},Object.fromEntries(B.map(([n])=>{var c,d;return[`${n}_color`,(d=(c=r.colors)==null?void 0:c[n])!=null?d:null]})))},ce=r=>{let l=r,{listening_color:e,thinking_color:t,speaking_color:s,pause_while:i}=l,a=ue(l,["listening_color","thinking_color","speaking_color","pause_while"]),o=Object.fromEntries([["listening",e],["thinking",t],["speaking",s]].filter(([,n])=>Array.isArray(n)));return u(g(u({},a),{pause_while:i||null}),Object.keys(o).length?{colors:o}:{})},st,it=()=>st||(st=(async()=>{var t,s,i;if(customElements.get("ha-form")&&customElements.get("ha-selector"))return;let r=await((t=window.loadCardHelpers)==null?void 0:t.call(window)),e=await(r==null?void 0:r.createCardElement({type:"entities",entities:[]}));await((i=(s=e==null?void 0:e.constructor)==null?void 0:s.getConfigElement)==null?void 0:i.call(s)),await customElements.whenDefined("ha-form")})()),M=class extends y{constructor(){super(),this._tab=(()=>{try{return localStorage.getItem("hubbubb-camera-tab")||"live"}catch(e){return"live"}})(),this._state=null,this._err="",this._busy=!1,this._gestures=null,this._open=null,this._form=null,this._flash=null,this._items=null,this._enrollName="",this._confirm=null,this._ask={q:"",answer:null,busy:!1},this._teach={name:"",where:"",result:null,busy:!1},this._formReady=!1,this._viewKey=0,this._jarvis=null,this._jarvisForm=null}connectedCallback(){super.connectedCallback(),it().then(()=>this._formReady=!0).catch(()=>this._formReady=!0),this._onVisible=()=>document.visibilityState==="visible"&&this._poll(),document.addEventListener("visibilitychange",this._onVisible),this._unsub=this.hass.connection.subscribeEvents(e=>this._fired(e.data),"hubbubb_home_gesture"),this._poll(),this._loadGestures()}disconnectedCallback(){var e;clearTimeout(this._timer),document.removeEventListener("visibilitychange",this._onVisible),(e=this._unsub)==null||e.then(t=>t()).catch(()=>{}),super.disconnectedCallback()}async _call(e,t={},s=!0){let i=await this.hass.callWS(u({type:"call_service",domain:"hubbubb_home",service:e,service_data:t},s?{return_response:!0}:{}));return(i==null?void 0:i.response)||{}}async _try(e){this._busy=!0,this._err="";try{return await e()}catch(t){this._err=(t==null?void 0:t.message)||String(t);return}finally{this._busy=!1}}async _poll(){var s,i;if(clearTimeout(this._timer),document.visibilityState!=="visible"||!this.isConnected)return;let e=(s=this._state)==null?void 0:s.connected;try{this._state=await this._call("camera_state"),e===!1&&this._state.connected&&this._viewKey++,this._err.startsWith("The camera")&&(this._err="")}catch(a){this._state={connected:!1,status:(a==null?void 0:a.message)||String(a)}}this._tab==="jarvis"&&this._loadJarvis(!1);let t=["live","people","jarvis"].includes(this._tab)||((i=this._state)==null?void 0:i.enrolling);this._timer=setTimeout(()=>this._poll(),t?1500:6e3)}async _loadGestures(){let e=await this._try(()=>this._call("gestures_get"));e&&(this._gestures=e)}async _loadJarvis(e){try{this._jarvis=await this._call("jarvis_presence_get"),(e||!this._jarvisForm)&&(this._jarvisForm=G(this._jarvis.config))}catch(t){this._err=(t==null?void 0:t.message)||String(t)}}async _loadItems(){let e=await this._try(()=>this._call("camera_items"));e&&(this._items=e.items||[])}_fired(e){e.held||(this._flash=e,clearTimeout(this._flashTimer),this._flashTimer=setTimeout(()=>this._flash=null,2500),this._gestures&&(this._gestures=g(u({},this._gestures),{last:g(u({},e),{ts:Date.now()/1e3})})))}_go(e){this._tab=e,this._confirm=null;try{localStorage.setItem("hubbubb-camera-tab",e)}catch(t){}e==="things"&&!this._items&&this._loadItems(),e==="jarvis"&&this._loadJarvis(!0),this._poll()}get _cameraEntity(){var e;return(e=Object.values(this.hass.entities||{}).find(t=>t.platform==="hubbubb_home"&&t.entity_id.startsWith("camera.")))==null?void 0:e.entity_id}async _settings(e){let t=await this._try(()=>this._call("camera_settings",e));t&&(this._state=t)}render(){var t,s,i;let e=this._state;return h`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Camera</div>
        <span class="pill ${e!=null&&e.connected?"ok":"off"}">
          <span class="dot"></span>${e===null?"Connecting\u2026":e.connected?"Connected":"Offline"}
        </span>
      </div>
      <nav class="tabs" role="tablist">
        ${Qe.map(([a,o,l])=>h`<button role="tab" aria-selected=${this._tab===a} class=${this._tab===a?"on":""} @click=${()=>this._go(a)}>
            <ha-icon .icon=${l}></ha-icon><span>${o}</span>
          </button>`)}
      </nav>
      ${this._err?h`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:p}
      ${e&&!e.connected&&e.status?h`<div class="notice"><ha-icon icon="mdi:lan-disconnect"></ha-icon><div><b>The camera isn't reachable.</b><br />${e.status}<br /><span class="muted">It runs as Hubbubb Local Camera on the Mac and starts at login.</span></div></div>`:p}
      <main>
        ${(i=(s=(t={live:()=>this._renderLive(),gestures:()=>this._renderGestures(),people:()=>this._renderPeople(),things:()=>this._renderThings(),jarvis:()=>this._renderJarvis(),tuning:()=>this._renderTuning()})[this._tab])==null?void 0:s.call(t))!=null?i:p}
      </main>
    `}_renderView(e=!1){var i,a;let t=this._cameraEntity,s=t&&((a=(i=this.hass.states[t])==null?void 0:i.attributes)==null?void 0:a.access_token);return!t||!s?h`<div class="view empty ${e?"small":""}">No live view yet.</div>`:h`<div class="view ${e?"small":""}">
      <img
        alt="Live camera view"
        src=${`/api/camera_proxy_stream/${t}?token=${s}&v=${this._viewKey}`}
        @error=${()=>{clearTimeout(this._retry),this._retry=setTimeout(()=>this._viewKey++,2e3)}}
      />
      ${this._flash?h`<div class="toast"><ha-icon .icon=${this._iconFor(this._flash.gesture)}></ha-icon>${this._titleFor(this._flash.gesture)}${this._flash.person?h` · ${this._flash.person}`:p}</div>`:p}
    </div>`}_titleFor(e){var t,s,i;return((i=(s=(t=this._gestures)==null?void 0:t.catalog)==null?void 0:s.find(a=>a.id===e))==null?void 0:i.title)||e}_iconFor(e){var t,s,i;return((i=(s=(t=this._gestures)==null?void 0:t.catalog)==null?void 0:s.find(a=>a.id===e))==null?void 0:i.icon)||"mdi:hand-wave"}_renderLive(){var a;let e=this._state||{},t=e.settings||{},s=e.people||[],i=e.animals||[];return h`
      <div class="live">
        <div>
          ${this._renderView()}
          <div class="status">${e.status||""}</div>
        </div>
        <div class="side">
          <section class="card">
            <h3>In view</h3>
            <div class="chips">
              ${s.map(o=>h`<span class="chip person"><ha-icon icon="mdi:account"></ha-icon>${o}</span>`)}
              ${i.map(o=>h`<span class="chip animal"><ha-icon icon="mdi:paw"></ha-icon>${o}</span>`)}
              ${!s.length&&!i.length?h`<span class="muted">Nobody recognized</span>`:p}
            </div>
          </section>
          <section class="card">
            <h3>Camera</h3>
            <div class="pan">
              <button class="round" title="Pan left" aria-label="Pan left" @click=${()=>this._try(()=>this._call("camera_pan",{direction:-1}))}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
              <span class="muted">Pan</span>
              <button class="round" title="Pan right" aria-label="Pan right" @click=${()=>this._try(()=>this._call("camera_pan",{direction:1}))}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
            </div>
            ${this._formReady?h`<ha-form
                  .hass=${this.hass}
                  .data=${{follow:t.follow,auto_zoom:t.auto_zoom,zoom:(a=t.zoom)!=null?a:1}}
                  .schema=${[{name:"follow",selector:{boolean:{}}},{name:"auto_zoom",selector:{boolean:{}}},...t.auto_zoom?[]:[{name:"zoom",selector:{number:{min:1,max:4,step:.1,mode:"slider"}}}]]}
                  .computeLabel=${o=>({follow:"Follow people",auto_zoom:"Zoom to fit automatically",zoom:"Zoom"})[o.name]}
                  @value-changed=${o=>this._settingsFrom(o.detail.value,t)}
                ></ha-form>`:p}
          </section>
          <section class="card">
            <h3>Ask the camera</h3>
            <form class="inline" @submit=${o=>{o.preventDefault(),this._askCamera()}}>
              <input placeholder="Where are my keys?" .value=${this._ask.q} @input=${o=>this._ask=g(u({},this._ask),{q:o.target.value})} />
              <button class="primary" ?disabled=${this._ask.busy||!this._ask.q.trim()}>${this._ask.busy?"Looking\u2026":"Ask"}</button>
            </form>
            ${this._ask.answer?h`<p class="answer">${this._ask.answer}</p>`:p}
          </section>
        </div>
      </div>
    `}_settingsFrom(e,t){let s={};for(let i of["follow","auto_zoom","zoom"])e[i]!==void 0&&e[i]!==t[i]&&(s[i]=e[i]);Object.keys(s).length&&this._settings(s)}async _askCamera(){this._ask=g(u({},this._ask),{busy:!0,answer:null});try{let e=await this._call("camera_look",{question:this._ask.q.trim()}),t=!e.found&&e.last_seen?` Last seen ${e.last_seen}`:"";this._ask=g(u({},this._ask),{busy:!1,answer:(e.answer||e.error||"No answer.")+t})}catch(e){this._ask=g(u({},this._ask),{busy:!1,answer:(e==null?void 0:e.message)||String(e)})}}_renderGestures(){let e=this._gestures;return e?h`
      <p class="intro">Look at the camera and hold a gesture steady at chest height for about a second. Assign each one any Home Assistant actions — the same editor automations use. Hands at the keyboard, near your face, or while you look elsewhere never count.</p>
      <div class="gestures">
        ${e.catalog.map(t=>this._renderGesture(t,e.gestures[t.id]))}
      </div>
    `:h`<div class="empty">Loading gestures…</div>`}_renderGesture(e,t){var l,n,c;let s=this._open===e.id,i=s?this._form:z(t),a=((l=this._flash)==null?void 0:l.gesture)===e.id,o=((n=this._gestures.last)==null?void 0:n.gesture)===e.id?this._gestures.last:null;return h`
      <section class="card gesture ${s?"open":""} ${a?"lit":""} ${i.enabled?"":"disabled"}">
        <button class="ghead" aria-expanded=${s} @click=${()=>this._toggleGesture(e.id,t)}>
          <span class="gicon"><ha-icon .icon=${e.icon}></ha-icon></span>
          <span class="gtext">
            <span class="name">${e.title}</span>
            <span class="muted">${e.how}</span>
            <span class="summary">${i.enabled?et(t==null?void 0:t.actions):"Turned off"}${t!=null&&t.repeat?" \xB7 repeats while held":""}${(c=t==null?void 0:t.people)!=null&&c.length?` \xB7 only ${t.people.join(", ")}`:""}</span>
          </span>
          ${o?h`<span class="muted when">${o.person?`${o.person}, `:""}${Me(o.ts)}</span>`:p}
          <ha-icon class="chev" icon=${s?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${s?this._renderGestureEditor(e):p}
      </section>
    `}_toggleGesture(e,t){if(this._open===e){this._open=null,this._form=null;return}this._open=e,this._form=z(t)}_renderGestureEditor(e){var a;let t=(((a=this._state)==null?void 0:a.enrolled)||[]).map(o=>o.name),s=this._gestures.gestures[e.id],i=tt(this._form,s);return this._formReady?h`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${[{name:"enabled",selector:{boolean:{}}},{name:"repeat",selector:{boolean:{}}},...t.length?[{name:"people",selector:{select:{multiple:!0,mode:"list",options:t.map(o=>({value:o,label:o}))}}}]:[]]}
          .computeLabel=${o=>({enabled:"On",repeat:"Repeat while held",people:"Only for these people"})[o.name]}
          .computeHelper=${o=>({repeat:"Runs again every \u2153 second while you hold it \u2014 for things like volume.",people:"Leave all unticked to let anyone use it."})[o.name]}
          @value-changed=${o=>this._form=u(u({},this._form),o.detail.value)}
        ></ha-form>
        <h4>Then do</h4>
        <ha-form
          .hass=${this.hass}
          .data=${{actions:this._form.actions}}
          .schema=${[{name:"actions",selector:{action:{}}}]}
          .computeLabel=${()=>""}
          @value-changed=${o=>this._form=g(u({},this._form),{actions:o.detail.value.actions||[]})}
        ></ha-form>
        <p class="muted small">Actions can use <code>{{ person }}</code> — who made the gesture, if recognized.</p>
        <div class="actions">
          <button class="primary" ?disabled=${this._busy||!i} @click=${()=>this._saveGesture(e.id)}>${i?"Save":"Saved"}</button>
          <button ?disabled=${this._busy||!this._form.actions.length} @click=${()=>this._testGesture(e.id,i)}>Test</button>
          ${i?h`<button ?disabled=${this._busy} @click=${()=>this._form=z(s)}>Undo changes</button>`:p}
        </div>
      </div>
    `:h`<div class="empty">Loading the editor…</div>`}async _saveGesture(e){let t=await this._try(()=>this._call("gesture_save",u({gesture:e},this._form)));t&&(this._gestures=g(u({},this._gestures),{gestures:g(u({},this._gestures.gestures),{[e]:t.saved})}),this._form=z(t.saved))}async _testGesture(e,t){t&&await this._saveGesture(e),!this._err&&await this._try(()=>this._call("gesture_test",{gesture:e},!1))}_renderPeople(){let e=this._state||{},t=e.enrolled||[],s=e.enrolling;return h`
      <div class="two">
        <section class="card">
          <h3>Who the camera knows</h3>
          ${t.length?t.map(i=>h`<div class="row">
                  <ha-icon icon="mdi:account-circle"></ha-icon>
                  <div class="grow"><div class="name">${i.name}</div><div class="muted">${i.samples} face samples${(e.people||[]).includes(i.name)?" \xB7 in view now":""}</div></div>
                  <button ?disabled=${this._busy||s} @click=${()=>this._enroll(i.name)}>Re-enroll</button>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetPerson(i.name)}>${this._confirm===`p:${i.name}`?"Really forget?":"Forget"}</button>
                </div>`):h`<p class="muted">Nobody yet. Enroll each person once so the camera — and Jarvis — knows who's who.</p>`}
          <h3>Enroll someone</h3>
          ${s?h`<div class="enrolling">
                <div class="name">Enrolling ${s.name}…</div>
                <div class="progress"><div style=${`width:${Math.round(100*s.samples/s.target)}%`}></div></div>
                <p class="muted">${e.status}</p>
              </div>`:h`<form class="inline" @submit=${i=>{i.preventDefault(),this._enroll(this._enrollName.trim())}}>
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
    `}async _enroll(e){if(!e)return;await this._try(()=>this._call("camera_enroll",{name:e}))&&(this._enrollName="",this._poll())}async _forgetPerson(e){if(this._confirm!==`p:${e}`)return this._confirm=`p:${e}`;this._confirm=null,await this._try(()=>this._call("camera_forget_person",{name:e})),this._poll()}_renderThings(){let e=this._teach;return h`
      <section class="card teach">
        <h3>Teach it something</h3>
        <p class="muted">Hold the thing up to the camera and name it — or say where it is. Next time you ask Jarvis where it is, the camera knows what to look for. You can also just say "Jarvis, this is my …" while holding it.</p>
        <form class="inline wrap" @submit=${t=>{t.preventDefault(),this._learn()}}>
          <input placeholder="Name, e.g. AirPods case" .value=${e.name} @input=${t=>this._teach=g(u({},e),{name:t.target.value})} />
          <input placeholder="Where (optional), e.g. on the shelf by the door" .value=${e.where} @input=${t=>this._teach=g(u({},e),{where:t.target.value})} />
          <button class="primary" ?disabled=${e.busy||!e.name.trim()}>${e.busy?"Looking\u2026":"Teach"}</button>
        </form>
        ${e.result?h`<p class="answer">${e.result}</p>`:p}
      </section>
      ${this._items===null?h`<div class="empty">Loading…</div>`:this._items.length?h`<div class="items">
              ${this._items.map(t=>h`<section class="card item">
                  ${t.photo?h`<img alt=${t.name} src=${`data:image/jpeg;base64,${t.photo}`} />`:h`<div class="noimg"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`}
                  <div class="name">${t.name}</div>
                  <div class="muted">${t.description}</div>
                  <div class="seen">${t.last_seen_at?h`<ha-icon icon="mdi:map-marker-outline"></ha-icon>${Me(t.last_seen_at)}: ${t.last_seen}`:h`<span class="muted">Not spotted yet</span>`}</div>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetItem(t.name)}>${this._confirm===`i:${t.name}`?"Really forget?":"Forget"}</button>
                </section>`)}
            </div>`:h`<div class="empty">Nothing taught yet.</div>`}
    `}async _learn(){let e=this._teach;this._teach=g(u({},e),{busy:!0,result:null});try{let t=await this._call("camera_learn",{name:e.name.trim(),hint:e.where.trim()});this._teach=t.learned?{name:"",where:"",busy:!1,result:`Got it \u2014 ${t.learned}: ${t.looks_like}`}:g(u({},e),{busy:!1,result:t.error||"It couldn't make that out."}),t.learned&&this._loadItems()}catch(t){this._teach=g(u({},e),{busy:!1,result:(t==null?void 0:t.message)||String(t)})}}async _forgetItem(e){if(this._confirm!==`i:${e}`)return this._confirm=`i:${e}`;this._confirm=null,await this._try(()=>this._call("camera_forget_item",{name:e})),this._loadItems()}_renderJarvis(){let e=this._jarvis,t=this._jarvisForm;if(!e||!t||!this._formReady)return h`<div class="empty">Loading…</div>`;let s=JSON.stringify(ce(t))!==JSON.stringify(ce(G(e.config))),i=B.find(([a])=>a===e.mood);return h`
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
            ${B.map(([a,o,l])=>h`<button ?disabled=${this._busy||s} title=${s?"Save first":""} @click=${()=>this._try(()=>this._call("jarvis_presence_test",{mood:a},!1))}><ha-icon .icon=${l}></ha-icon> ${o}</button>`)}
          </div>
          <p class="muted small">Plays for 4 seconds, then puts the camera and lights back.</p>
        </section>
        <section class="card">
          <h3>Camera movement</h3>
          <ha-form
            .hass=${this.hass}
            .data=${t}
            .schema=${[{name:"move",selector:{boolean:{}}},...t.move?[{name:"strength",selector:{number:{min:.1,max:1,step:.05,mode:"slider"}}}]:[],{name:"satellites",selector:{entity:{domain:"assist_satellite",multiple:!0}}}]}
            .computeLabel=${a=>({move:"Move the camera while Jarvis talks",strength:"How much it moves",satellites:"Which pucks"})[a.name]}
            .computeHelper=${a=>({strength:"A perk-up when listening, a glance while thinking, gentle nods while speaking.",satellites:"Leave empty to follow every voice puck."})[a.name]}
            @value-changed=${a=>this._jarvisForm=u(u({},this._jarvisForm),a.detail.value)}
          ></ha-form>
          <h3>Lights</h3>
          <ha-form
            .hass=${this.hass}
            .data=${t}
            .schema=${[{name:"lights",selector:{boolean:{}}},...t.lights?[{name:"light_entities",selector:{entity:{domain:"light",multiple:!0}}},{name:"brightness",selector:{number:{min:1,max:100,step:1,mode:"slider",unit_of_measurement:"%"}}},...B.map(([a])=>({name:`${a}_color`,selector:{color_rgb:{}}})),{name:"pause_while",selector:{entity:{}}}]:[]]}
            .computeLabel=${a=>({lights:"Tint lights while Jarvis talks",light_entities:"Which lights",brightness:"Brightness",listening_color:"Listening colour",thinking_color:"Thinking colour",speaking_color:"Speaking colour",pause_while:"Leave the lights alone while this is on"})[a.name]}
            .computeHelper=${a=>({light_entities:"Coloured lights near the TV work best, like the Hue Play bars.",pause_while:"For example the Sync Box's light sync, which owns those lights while it runs."})[a.name]}
            @value-changed=${a=>this._jarvisForm=u(u({},this._jarvisForm),a.detail.value)}
          ></ha-form>
          <div class="actions">
            <button class="primary" ?disabled=${this._busy||!s} @click=${()=>this._saveJarvis()}>${s?"Save":"Saved"}</button>
            ${s?h`<button ?disabled=${this._busy} @click=${()=>this._jarvisForm=G(e.config)}>Undo changes</button>`:p}
          </div>
        </section>
      </div>
    `}async _saveJarvis(){let e=await this._try(()=>this._call("jarvis_presence_save",ce(this._jarvisForm)));e&&(this._jarvis=g(u({},this._jarvis),{config:e.config}),this._jarvisForm=G(e.config))}_renderTuning(){var o,l;let e=this._state||{},t=e.settings||{},s=e.knobs||{},i=e.room||{},a=u({require_looking:t.require_looking},Object.fromEntries(q.map(([n])=>[n,t[n]])));return h`
      <div class="two">
        <section class="card">
          <h3>Tuning</h3>
          ${this._formReady&&Object.keys(s).length?h`<ha-form
                .hass=${this.hass}
                .data=${a}
                .schema=${[{name:"require_looking",selector:{boolean:{}}},...q.filter(([n])=>s[n]).map(([n,,,c])=>({name:n,selector:{number:{min:s[n].min,max:s[n].max,step:c,mode:"slider"}}}))]}
                .computeLabel=${n=>{var c;return n.name==="require_looking"?"Only when looking at the camera":(c=q.find(([d])=>d===n.name))==null?void 0:c[1]}}
                .computeHelper=${n=>{var c;return n.name==="require_looking"?"Gestures only count while the person faces the camera. The live view marks them \u201Clooking\u201D.":(c=q.find(([d])=>d===n.name))==null?void 0:c[2]}}
                @value-changed=${n=>this._knobs(n.detail.value,a)}
              ></ha-form>
              <div class="actions">
                <button ?disabled=${this._busy} @click=${()=>this._settings(u({require_looking:!0},Object.fromEntries(Object.entries(s).map(([n,c])=>[n,c.default]))))}>Reset to defaults</button>
              </div>`:h`<div class="empty">Waiting for the camera…</div>`}
        </section>
        <section class="card">
          <h3>Room map</h3>
          ${i.learned?h`<p>The camera has learned where people spend time: <b>${Math.round(i.low)}° to ${Math.round(i.high)}°</b> of pan, from ${i.sightings} sightings. Searches stay inside that span, skipping walls, corners and the back of the TV.</p>`:h`<p>Still learning where people spend time: ${(o=i.sightings)!=null?o:0} of ${(l=i.needed)!=null?l:30} sightings. Until then it searches around where it last saw someone.</p>`}
          <div class="actions">
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._resetRoom()}>${this._confirm==="room"?"Really relearn?":"Relearn the room"}</button>
          </div>
          <p class="muted small">Relearn after moving the camera or the furniture.</p>
        </section>
      </div>
    `}_knobs(e,t){let s=Object.fromEntries(Object.entries(e).filter(([i,a])=>a!==void 0&&a!==t[i]));clearTimeout(this._knobTimer),Object.keys(s).length&&(this._knobTimer=setTimeout(()=>this._settings(s),300))}async _resetRoom(){if(this._confirm!=="room")return this._confirm="room";this._confirm=null,await this._try(()=>this._call("camera_room_reset")),this._poll()}};W(M,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_tab:{state:!0},_state:{state:!0},_err:{state:!0},_busy:{state:!0},_gestures:{state:!0},_open:{state:!0},_form:{state:!0},_flash:{state:!0},_items:{state:!0},_enrollName:{state:!0},_confirm:{state:!0},_ask:{state:!0},_teach:{state:!0},_formReady:{state:!0},_viewKey:{state:!0},_jarvis:{state:!0},_jarvisForm:{state:!0}}),W(M,"styles",Z`
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
    .view img { width: 100%; height: 100%; object-fit: contain; display: block; }
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
  `);customElements.define("hubbubb-camera",M);export{q as KNOBS,Me as ago,tt as changed,z as gestureForm,ce as jarvisConfig,G as jarvisForm,et as summarizeActions};
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
