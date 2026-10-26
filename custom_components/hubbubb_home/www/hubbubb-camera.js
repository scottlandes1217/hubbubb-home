var Ne=Object.defineProperty,ze=Object.defineProperties;var He=Object.getOwnPropertyDescriptors;var ne=Object.getOwnPropertySymbols;var Ue=Object.prototype.hasOwnProperty,Me=Object.prototype.propertyIsEnumerable;var F=(r,e,t)=>e in r?Ne(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,m=(r,e)=>{for(var t in e||(e={}))Ue.call(e,t)&&F(r,t,e[t]);if(ne)for(var t of ne(e))Me.call(e,t)&&F(r,t,e[t]);return r},_=(r,e)=>ze(r,He(e));var V=(r,e,t)=>F(r,typeof e!="symbol"?e+"":e,t);var D=globalThis,I=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),le=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(I&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=le.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&le.set(t,e))}return e}toString(){return this.cssText}},ce=r=>new T(typeof r=="string"?r:r+"",void 0,W),q=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new T(t,r,W)},he=(r,e)=>{if(I)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},K=I?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ce(t)})(r):r;var{is:Le,defineProperty:je,getOwnPropertyDescriptor:De,getOwnPropertyNames:Ie,getOwnPropertySymbols:Ge,getPrototypeOf:Be}=Object,$=globalThis,de=$.trustedTypes,Fe=de?de.emptyScript:"",J=$.reactiveElementPolyfillSupport,P=(r,e)=>r,Z={toAttribute(r,e){switch(e){case Boolean:r=r?Fe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch(s){t=null}}return t}},ge=(r,e)=>!Le(r,e),pe={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:ge},ue,me;(ue=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(me=$.litPropertyMetadata)!=null||($.litPropertyMetadata=new WeakMap);var f=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=pe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&je(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){var a;let{get:i,set:o}=(a=De(this.prototype,e))!=null?a:{get(){return this[t]},set(l){this[t]=l}};return{get:i,set(l){let n=i==null?void 0:i.call(this);o==null||o.call(this,l),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:pe}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let e=Be(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let t=this.properties,s=[...Ie(t),...Ge(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(K(i))}else e!==void 0&&t.push(K(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return he(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var o;let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Z).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){var o,a,l;let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),h=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:Z;this._$Em=i;let p=h.fromAttribute(t,n.type);this[i]=(l=p!=null?p:(a=this._$Ej)==null?void 0:a.get(i))!=null?l:p,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){var a,l;if(e!==void 0){let n=this.constructor;if(i===!1&&(o=this[e]),s!=null||(s=n.getPropertyOptions(e)),!(((a=s.hasChanged)!=null?a:ge)(o,t)||s.useDefault&&s.reflect&&o===((l=this._$Ej)==null?void 0:l.get(e))&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},a){var l,n,h;s&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(n=a!=null?a:t)!=null?n:this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&((h=this._$Eq)!=null?h:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[a,l]of this._$Ep)this[a]=l;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[a,l]of o){let{wrapped:n}=l,h=this[a];n!==!0||this._$AL.has(a)||h===void 0||this.C(a,void 0,l,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(o=>{var a;return(a=o.hostUpdate)==null?void 0:a.call(o)}),this.update(t)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},_e;f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[P("elementProperties")]=new Map,f[P("finalized")]=new Map,J==null||J({ReactiveElement:f}),((_e=$.reactiveElementVersions)!=null?_e:$.reactiveElementVersions=[]).push("2.1.2");var O=globalThis,fe=r=>r,G=O.trustedTypes,be=G?G.createPolicy("lit-html",{createHTML:r=>r}):void 0,ke="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,Se="?"+v,Ve=`<${Se}>`,A=document,N=()=>A.createComment(""),z=r=>r===null||typeof r!="object"&&typeof r!="function",re=Array.isArray,We=r=>re(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",X=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$e=/-->/g,ve=/>/g,x=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ye=/'/g,xe=/"/g,Ee=/^(?:script|style|textarea|title)$/i,ae=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),c=ae(1),at=ae(2),ot=ae(3),k=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),we=new WeakMap,w=A.createTreeWalker(A,129);function Ce(r,e){if(!re(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return be!==void 0?be.createHTML(e):e}var qe=(r,e)=>{let t=r.length-1,s=[],i,o=e===2?"<svg>":e===3?"<math>":"",a=R;for(let l=0;l<t;l++){let n=r[l],h,p,u=-1,g=0;for(;g<n.length&&(a.lastIndex=g,p=a.exec(n),p!==null);)g=a.lastIndex,a===R?p[1]==="!--"?a=$e:p[1]!==void 0?a=ve:p[2]!==void 0?(Ee.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=x):p[3]!==void 0&&(a=x):a===x?p[0]===">"?(a=i!=null?i:R,u=-1):p[1]===void 0?u=-2:(u=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?x:p[3]==='"'?xe:ye):a===xe||a===ye?a=x:a===$e||a===ve?a=R:(a=x,i=void 0);let b=a===x&&r[l+1].startsWith("/>")?" ":"";o+=a===R?n+Ve:u>=0?(s.push(h),n.slice(0,u)+ke+n.slice(u)+v+b):n+v+(u===-2?l:b)}return[Ce(r,o+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},H=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,a=0,l=e.length-1,n=this.parts,[h,p]=qe(e,t);if(this.el=r.createElement(h,s),w.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=w.nextNode())!==null&&n.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(ke)){let g=p[a++],b=i.getAttribute(u).split(v),j=/([.?@])?(.*)/.exec(g);n.push({type:1,index:o,name:j[2],strings:b,ctor:j[1]==="."?ee:j[1]==="?"?te:j[1]==="@"?se:C}),i.removeAttribute(u)}else u.startsWith(v)&&(n.push({type:6,index:o}),i.removeAttribute(u));if(Ee.test(i.tagName)){let u=i.textContent.split(v),g=u.length-1;if(g>0){i.textContent=G?G.emptyScript:"";for(let b=0;b<g;b++)i.append(u[b],N()),w.nextNode(),n.push({type:2,index:++o});i.append(u[g],N())}}}else if(i.nodeType===8)if(i.data===Se)n.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(v,u+1))!==-1;)n.push({type:7,index:o}),u+=v.length-1}o++}}static createElement(e,t){let s=A.createElement("template");return s.innerHTML=e,s}};function E(r,e,t=r,s){var a,l,n;if(e===k)return e;let i=s!==void 0?(a=t._$Co)==null?void 0:a[s]:t._$Cl,o=z(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,t,s)),s!==void 0?((n=t._$Co)!=null?n:t._$Co=[])[s]=i:t._$Cl=i),i!==void 0&&(e=E(r,i._$AS(r,e.values),i,s)),e}var Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var h;let{el:{content:t},parts:s}=this._$AD,i=((h=e==null?void 0:e.creationScope)!=null?h:A).importNode(t,!0);w.currentNode=i;let o=w.nextNode(),a=0,l=0,n=s[0];for(;n!==void 0;){if(a===n.index){let p;n.type===2?p=new U(o,o.nextSibling,this,e):n.type===1?p=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(p=new ie(o,this,e)),this._$AV.push(p),n=s[++l]}a!==(n==null?void 0:n.index)&&(o=w.nextNode(),a++)}return w.currentNode=A,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},U=class r{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,i){var o;this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),z(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==k&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):We(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){var o;let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=H.createElement(Ce(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(t);else{let a=new Q(i,this),l=a.u(this.options);a.p(t),this.T(l),this._$AH=a}}_$AC(e){let t=we.get(e.strings);return t===void 0&&we.set(e.strings,t=new H(e)),t}k(e){re(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let o of e)i===t.length?t.push(s=new r(this.O(N()),this.O(N()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){let i=fe(e).nextSibling;fe(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,i){let o=this.strings,a=!1;if(o===void 0)e=E(this,e,t,0),a=!z(e)||e!==this._$AH&&e!==k,a&&(this._$AH=e);else{let l=e,n,h;for(e=o[0],n=0;n<o.length-1;n++)h=E(this,l[s+n],t,n),h===k&&(h=this._$AH[n]),a||(a=!z(h)||h!==this._$AH[n]),h===d?e=d:e!==d&&(e+=(h!=null?h:"")+o[n+1]),this._$AH[n]=h}a&&!i&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},ee=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},te=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},se=class extends C{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){var a;if((e=(a=E(this,e,t,0))!=null?a:d)===k)return;let s=this._$AH,i=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}},ie=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var Y=O.litHtmlPolyfillSupport,Ae;Y==null||Y(H,U),((Ae=O.litHtmlVersions)!=null?Ae:O.litHtmlVersions=[]).push("3.3.3");var Te=(r,e,t)=>{var o,a;let s=(o=t==null?void 0:t.renderBefore)!=null?o:e,i=s._$litPart$;if(i===void 0){let l=(a=t==null?void 0:t.renderBefore)!=null?a:null;s._$litPart$=i=new U(e.insertBefore(N(),l),l,void 0,t!=null?t:{})}return i._$AI(r),i};var S=globalThis,y=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;let e=super.createRenderRoot();return(s=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Te(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return k}},Pe;y._$litElement$=!0,y.finalized=!0,(Pe=S.litElementHydrateSupport)==null||Pe.call(S,{LitElement:y});var oe=S.litElementPolyfillSupport;oe==null||oe({LitElement:y});var Re;((Re=S.litElementVersions)!=null?Re:S.litElementVersions=[]).push("4.2.2");var Ke=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-camera ${Ke}`);var Je=[["live","Live","mdi:cctv"],["gestures","Gestures","mdi:hand-wave"],["people","People","mdi:account-multiple"],["things","Things","mdi:package-variant-closed"],["tuning","Tuning","mdi:tune-variant"]],B=[["followGain","Following speed","How quickly the camera turns to keep you centred. Higher is snappier; too high and it wobbles.",.05],["gestureReach","Gesture height","How far below your chin a hand still counts, in face-heights. Lower it if typing sets gestures off.",.1],["hairReach","Head zone: above the face","Hands this far above your face (hair) pause gestures, in face-heights.",.1],["chinReach","Head zone: below the chin","Hands this far below your chin (eating, drinking) pause gestures, in face-heights.",.1],["steadiness","Hold-still tolerance","How still a hand must be for a gesture to count. Lower is stricter.",.05],["faceMatchThreshold","Face match strictness","Lower is stricter. Raise it if you're not recognized; lower it if people get mixed up.",.02],["searchDegrees","Search width","Degrees either side of the last sighting to search, until the room is learned.",1],["searchTilt","Search tilt","Degrees up (+) or down (\u2212) to search at, until the room is learned.",1]],Ze=r=>{let e=Array.isArray(r)?r:[];return e.length?e.map(s=>{var a;let i=s.action||s.service||s.choose&&"choose"||s.delay&&"delay"||s.event&&"event"||"";if(i==="hubbubb_home.mac_screen_sharing")return(a=s.data)!=null&&a.on?"Start Mac screen mirroring":"Stop Mac screen mirroring";if(!i.includes("."))return i?i[0].toUpperCase()+i.slice(1):"Step";let[,o]=i.split(".");return o.replace(/_/g," ").replace(/^./,l=>l.toUpperCase())}).join(", "):"Does nothing yet"},Oe=(r,e=Date.now()/1e3)=>{if(!r)return"";let t=Math.max(0,e-r);return t<45?"just now":t<3600?`${Math.round(t/60)} min ago`:t<86400?`${Math.round(t/3600)} h ago`:`${Math.round(t/86400)} days ago`},M=r=>{var e,t,s,i;return{enabled:(e=r==null?void 0:r.enabled)!=null?e:!0,repeat:(t=r==null?void 0:r.repeat)!=null?t:!1,people:(s=r==null?void 0:r.people)!=null?s:[],actions:(i=r==null?void 0:r.actions)!=null?i:[]}},Xe=(r,e)=>JSON.stringify(r)!==JSON.stringify(M(e)),Ye,Qe=()=>Ye||(Ye=(async()=>{var t,s,i;if(customElements.get("ha-form")&&customElements.get("ha-selector"))return;let r=await((t=window.loadCardHelpers)==null?void 0:t.call(window)),e=await(r==null?void 0:r.createCardElement({type:"entities",entities:[]}));await((i=(s=e==null?void 0:e.constructor)==null?void 0:s.getConfigElement)==null?void 0:i.call(s)),await customElements.whenDefined("ha-form")})()),L=class extends y{constructor(){super(),this._tab=(()=>{try{return localStorage.getItem("hubbubb-camera-tab")||"live"}catch(e){return"live"}})(),this._state=null,this._err="",this._busy=!1,this._gestures=null,this._open=null,this._form=null,this._flash=null,this._items=null,this._enrollName="",this._confirm=null,this._ask={q:"",answer:null,busy:!1},this._teach={name:"",where:"",result:null,busy:!1},this._formReady=!1,this._viewKey=0}connectedCallback(){super.connectedCallback(),Qe().then(()=>this._formReady=!0).catch(()=>this._formReady=!0),this._onVisible=()=>document.visibilityState==="visible"&&this._poll(),document.addEventListener("visibilitychange",this._onVisible),this._unsub=this.hass.connection.subscribeEvents(e=>this._fired(e.data),"hubbubb_home_gesture"),this._poll(),this._loadGestures()}disconnectedCallback(){var e;clearTimeout(this._timer),document.removeEventListener("visibilitychange",this._onVisible),(e=this._unsub)==null||e.then(t=>t()).catch(()=>{}),super.disconnectedCallback()}async _call(e,t={},s=!0){let i=await this.hass.callWS(m({type:"call_service",domain:"hubbubb_home",service:e,service_data:t},s?{return_response:!0}:{}));return(i==null?void 0:i.response)||{}}async _try(e){this._busy=!0,this._err="";try{return await e()}catch(t){this._err=(t==null?void 0:t.message)||String(t);return}finally{this._busy=!1}}async _poll(){var s,i;if(clearTimeout(this._timer),document.visibilityState!=="visible"||!this.isConnected)return;let e=(s=this._state)==null?void 0:s.connected;try{this._state=await this._call("camera_state"),e===!1&&this._state.connected&&this._viewKey++,this._err.startsWith("The camera")&&(this._err="")}catch(o){this._state={connected:!1,status:(o==null?void 0:o.message)||String(o)}}let t=["live","people"].includes(this._tab)||((i=this._state)==null?void 0:i.enrolling);this._timer=setTimeout(()=>this._poll(),t?1500:6e3)}async _loadGestures(){let e=await this._try(()=>this._call("gestures_get"));e&&(this._gestures=e)}async _loadItems(){let e=await this._try(()=>this._call("camera_items"));e&&(this._items=e.items||[])}_fired(e){e.held||(this._flash=e,clearTimeout(this._flashTimer),this._flashTimer=setTimeout(()=>this._flash=null,2500),this._gestures&&(this._gestures=_(m({},this._gestures),{last:_(m({},e),{ts:Date.now()/1e3})})))}_go(e){this._tab=e,this._confirm=null;try{localStorage.setItem("hubbubb-camera-tab",e)}catch(t){}e==="things"&&!this._items&&this._loadItems(),this._poll()}get _cameraEntity(){var e;return(e=Object.values(this.hass.entities||{}).find(t=>t.platform==="hubbubb_home"&&t.entity_id.startsWith("camera.")))==null?void 0:e.entity_id}async _settings(e){let t=await this._try(()=>this._call("camera_settings",e));t&&(this._state=t)}render(){var t,s,i;let e=this._state;return c`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Camera</div>
        <span class="pill ${e!=null&&e.connected?"ok":"off"}">
          <span class="dot"></span>${e===null?"Connecting\u2026":e.connected?"Connected":"Offline"}
        </span>
      </div>
      <nav class="tabs" role="tablist">
        ${Je.map(([o,a,l])=>c`<button role="tab" aria-selected=${this._tab===o} class=${this._tab===o?"on":""} @click=${()=>this._go(o)}>
            <ha-icon .icon=${l}></ha-icon><span>${a}</span>
          </button>`)}
      </nav>
      ${this._err?c`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:d}
      ${e&&!e.connected&&e.status?c`<div class="notice"><ha-icon icon="mdi:lan-disconnect"></ha-icon><div><b>The camera isn't reachable.</b><br />${e.status}<br /><span class="muted">It runs as Hubbubb Local Camera on the Mac and starts at login.</span></div></div>`:d}
      <main>
        ${(i=(s=(t={live:()=>this._renderLive(),gestures:()=>this._renderGestures(),people:()=>this._renderPeople(),things:()=>this._renderThings(),tuning:()=>this._renderTuning()})[this._tab])==null?void 0:s.call(t))!=null?i:d}
      </main>
    `}_renderView(e=!1){var i,o;let t=this._cameraEntity,s=t&&((o=(i=this.hass.states[t])==null?void 0:i.attributes)==null?void 0:o.access_token);return!t||!s?c`<div class="view empty ${e?"small":""}">No live view yet.</div>`:c`<div class="view ${e?"small":""}">
      <img
        alt="Live camera view"
        src=${`/api/camera_proxy_stream/${t}?token=${s}&v=${this._viewKey}`}
        @error=${()=>{clearTimeout(this._retry),this._retry=setTimeout(()=>this._viewKey++,2e3)}}
      />
      ${this._flash?c`<div class="toast"><ha-icon .icon=${this._iconFor(this._flash.gesture)}></ha-icon>${this._titleFor(this._flash.gesture)}${this._flash.person?c` · ${this._flash.person}`:d}</div>`:d}
    </div>`}_titleFor(e){var t,s,i;return((i=(s=(t=this._gestures)==null?void 0:t.catalog)==null?void 0:s.find(o=>o.id===e))==null?void 0:i.title)||e}_iconFor(e){var t,s,i;return((i=(s=(t=this._gestures)==null?void 0:t.catalog)==null?void 0:s.find(o=>o.id===e))==null?void 0:i.icon)||"mdi:hand-wave"}_renderLive(){var o;let e=this._state||{},t=e.settings||{},s=e.people||[],i=e.animals||[];return c`
      <div class="live">
        <div>
          ${this._renderView()}
          <div class="status">${e.status||""}</div>
        </div>
        <div class="side">
          <section class="card">
            <h3>In view</h3>
            <div class="chips">
              ${s.map(a=>c`<span class="chip person"><ha-icon icon="mdi:account"></ha-icon>${a}</span>`)}
              ${i.map(a=>c`<span class="chip animal"><ha-icon icon="mdi:paw"></ha-icon>${a}</span>`)}
              ${!s.length&&!i.length?c`<span class="muted">Nobody recognized</span>`:d}
            </div>
          </section>
          <section class="card">
            <h3>Camera</h3>
            <div class="pan">
              <button class="round" title="Pan left" aria-label="Pan left" @click=${()=>this._try(()=>this._call("camera_pan",{direction:-1}))}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
              <span class="muted">Pan</span>
              <button class="round" title="Pan right" aria-label="Pan right" @click=${()=>this._try(()=>this._call("camera_pan",{direction:1}))}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
            </div>
            ${this._formReady?c`<ha-form
                  .hass=${this.hass}
                  .data=${{follow:t.follow,auto_zoom:t.auto_zoom,zoom:(o=t.zoom)!=null?o:1}}
                  .schema=${[{name:"follow",selector:{boolean:{}}},{name:"auto_zoom",selector:{boolean:{}}},...t.auto_zoom?[]:[{name:"zoom",selector:{number:{min:1,max:4,step:.1,mode:"slider"}}}]]}
                  .computeLabel=${a=>({follow:"Follow people",auto_zoom:"Zoom to fit automatically",zoom:"Zoom"})[a.name]}
                  @value-changed=${a=>this._settingsFrom(a.detail.value,t)}
                ></ha-form>`:d}
          </section>
          <section class="card">
            <h3>Ask the camera</h3>
            <form class="inline" @submit=${a=>{a.preventDefault(),this._askCamera()}}>
              <input placeholder="Where are my keys?" .value=${this._ask.q} @input=${a=>this._ask=_(m({},this._ask),{q:a.target.value})} />
              <button class="primary" ?disabled=${this._ask.busy||!this._ask.q.trim()}>${this._ask.busy?"Looking\u2026":"Ask"}</button>
            </form>
            ${this._ask.answer?c`<p class="answer">${this._ask.answer}</p>`:d}
          </section>
        </div>
      </div>
    `}_settingsFrom(e,t){let s={};for(let i of["follow","auto_zoom","zoom"])e[i]!==void 0&&e[i]!==t[i]&&(s[i]=e[i]);Object.keys(s).length&&this._settings(s)}async _askCamera(){this._ask=_(m({},this._ask),{busy:!0,answer:null});try{let e=await this._call("camera_look",{question:this._ask.q.trim()}),t=!e.found&&e.last_seen?` Last seen ${e.last_seen}`:"";this._ask=_(m({},this._ask),{busy:!1,answer:(e.answer||e.error||"No answer.")+t})}catch(e){this._ask=_(m({},this._ask),{busy:!1,answer:(e==null?void 0:e.message)||String(e)})}}_renderGestures(){let e=this._gestures;return e?c`
      <p class="intro">Hold a gesture steady at chest height or above for about a second. Assign each one any Home Assistant actions — the same editor automations use. Hands at the keyboard or near your face never count.</p>
      <div class="gestures">
        ${e.catalog.map(t=>this._renderGesture(t,e.gestures[t.id]))}
      </div>
    `:c`<div class="empty">Loading gestures…</div>`}_renderGesture(e,t){var l,n,h;let s=this._open===e.id,i=s?this._form:M(t),o=((l=this._flash)==null?void 0:l.gesture)===e.id,a=((n=this._gestures.last)==null?void 0:n.gesture)===e.id?this._gestures.last:null;return c`
      <section class="card gesture ${s?"open":""} ${o?"lit":""} ${i.enabled?"":"disabled"}">
        <button class="ghead" aria-expanded=${s} @click=${()=>this._toggleGesture(e.id,t)}>
          <span class="gicon"><ha-icon .icon=${e.icon}></ha-icon></span>
          <span class="gtext">
            <span class="name">${e.title}</span>
            <span class="muted">${e.how}</span>
            <span class="summary">${i.enabled?Ze(t==null?void 0:t.actions):"Turned off"}${t!=null&&t.repeat?" \xB7 repeats while held":""}${(h=t==null?void 0:t.people)!=null&&h.length?` \xB7 only ${t.people.join(", ")}`:""}</span>
          </span>
          ${a?c`<span class="muted when">${a.person?`${a.person}, `:""}${Oe(a.ts)}</span>`:d}
          <ha-icon class="chev" icon=${s?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${s?this._renderGestureEditor(e):d}
      </section>
    `}_toggleGesture(e,t){if(this._open===e){this._open=null,this._form=null;return}this._open=e,this._form=M(t)}_renderGestureEditor(e){var o;let t=(((o=this._state)==null?void 0:o.enrolled)||[]).map(a=>a.name),s=this._gestures.gestures[e.id],i=Xe(this._form,s);return this._formReady?c`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${[{name:"enabled",selector:{boolean:{}}},{name:"repeat",selector:{boolean:{}}},...t.length?[{name:"people",selector:{select:{multiple:!0,mode:"list",options:t.map(a=>({value:a,label:a}))}}}]:[]]}
          .computeLabel=${a=>({enabled:"On",repeat:"Repeat while held",people:"Only for these people"})[a.name]}
          .computeHelper=${a=>({repeat:"Runs again every \u2153 second while you hold it \u2014 for things like volume.",people:"Leave all unticked to let anyone use it."})[a.name]}
          @value-changed=${a=>this._form=m(m({},this._form),a.detail.value)}
        ></ha-form>
        <h4>Then do</h4>
        <ha-form
          .hass=${this.hass}
          .data=${{actions:this._form.actions}}
          .schema=${[{name:"actions",selector:{action:{}}}]}
          .computeLabel=${()=>""}
          @value-changed=${a=>this._form=_(m({},this._form),{actions:a.detail.value.actions||[]})}
        ></ha-form>
        <p class="muted small">Actions can use <code>{{ person }}</code> — who made the gesture, if recognized.</p>
        <div class="actions">
          <button class="primary" ?disabled=${this._busy||!i} @click=${()=>this._saveGesture(e.id)}>${i?"Save":"Saved"}</button>
          <button ?disabled=${this._busy||!this._form.actions.length} @click=${()=>this._testGesture(e.id,i)}>Test</button>
          ${i?c`<button ?disabled=${this._busy} @click=${()=>this._form=M(s)}>Undo changes</button>`:d}
        </div>
      </div>
    `:c`<div class="empty">Loading the editor…</div>`}async _saveGesture(e){let t=await this._try(()=>this._call("gesture_save",m({gesture:e},this._form)));t&&(this._gestures=_(m({},this._gestures),{gestures:_(m({},this._gestures.gestures),{[e]:t.saved})}),this._form=M(t.saved))}async _testGesture(e,t){t&&await this._saveGesture(e),!this._err&&await this._try(()=>this._call("gesture_test",{gesture:e},!1))}_renderPeople(){let e=this._state||{},t=e.enrolled||[],s=e.enrolling;return c`
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
    `}async _enroll(e){if(!e)return;await this._try(()=>this._call("camera_enroll",{name:e}))&&(this._enrollName="",this._poll())}async _forgetPerson(e){if(this._confirm!==`p:${e}`)return this._confirm=`p:${e}`;this._confirm=null,await this._try(()=>this._call("camera_forget_person",{name:e})),this._poll()}_renderThings(){let e=this._teach;return c`
      <section class="card teach">
        <h3>Teach it something</h3>
        <p class="muted">Hold the thing up to the camera and name it — or say where it is. Next time you ask Jarvis where it is, the camera knows what to look for. You can also just say "Jarvis, this is my …" while holding it.</p>
        <form class="inline wrap" @submit=${t=>{t.preventDefault(),this._learn()}}>
          <input placeholder="Name, e.g. AirPods case" .value=${e.name} @input=${t=>this._teach=_(m({},e),{name:t.target.value})} />
          <input placeholder="Where (optional), e.g. on the shelf by the door" .value=${e.where} @input=${t=>this._teach=_(m({},e),{where:t.target.value})} />
          <button class="primary" ?disabled=${e.busy||!e.name.trim()}>${e.busy?"Looking\u2026":"Teach"}</button>
        </form>
        ${e.result?c`<p class="answer">${e.result}</p>`:d}
      </section>
      ${this._items===null?c`<div class="empty">Loading…</div>`:this._items.length?c`<div class="items">
              ${this._items.map(t=>c`<section class="card item">
                  ${t.photo?c`<img alt=${t.name} src=${`data:image/jpeg;base64,${t.photo}`} />`:c`<div class="noimg"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`}
                  <div class="name">${t.name}</div>
                  <div class="muted">${t.description}</div>
                  <div class="seen">${t.last_seen_at?c`<ha-icon icon="mdi:map-marker-outline"></ha-icon>${Oe(t.last_seen_at)}: ${t.last_seen}`:c`<span class="muted">Not spotted yet</span>`}</div>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetItem(t.name)}>${this._confirm===`i:${t.name}`?"Really forget?":"Forget"}</button>
                </section>`)}
            </div>`:c`<div class="empty">Nothing taught yet.</div>`}
    `}async _learn(){let e=this._teach;this._teach=_(m({},e),{busy:!0,result:null});try{let t=await this._call("camera_learn",{name:e.name.trim(),hint:e.where.trim()});this._teach=t.learned?{name:"",where:"",busy:!1,result:`Got it \u2014 ${t.learned}: ${t.looks_like}`}:_(m({},e),{busy:!1,result:t.error||"It couldn't make that out."}),t.learned&&this._loadItems()}catch(t){this._teach=_(m({},e),{busy:!1,result:(t==null?void 0:t.message)||String(t)})}}async _forgetItem(e){if(this._confirm!==`i:${e}`)return this._confirm=`i:${e}`;this._confirm=null,await this._try(()=>this._call("camera_forget_item",{name:e})),this._loadItems()}_renderTuning(){var a,l;let e=this._state||{},t=e.settings||{},s=e.knobs||{},i=e.room||{},o=Object.fromEntries(B.map(([n])=>[n,t[n]]));return c`
      <div class="two">
        <section class="card">
          <h3>Tuning</h3>
          ${this._formReady&&Object.keys(s).length?c`<ha-form
                .hass=${this.hass}
                .data=${o}
                .schema=${B.filter(([n])=>s[n]).map(([n,,,h])=>({name:n,selector:{number:{min:s[n].min,max:s[n].max,step:h,mode:"slider"}}}))}
                .computeLabel=${n=>{var h;return(h=B.find(([p])=>p===n.name))==null?void 0:h[1]}}
                .computeHelper=${n=>{var h;return(h=B.find(([p])=>p===n.name))==null?void 0:h[2]}}
                @value-changed=${n=>this._knobs(n.detail.value,o)}
              ></ha-form>
              <div class="actions">
                <button ?disabled=${this._busy} @click=${()=>this._settings(Object.fromEntries(Object.entries(s).map(([n,h])=>[n,h.default])))}>Reset to defaults</button>
              </div>`:c`<div class="empty">Waiting for the camera…</div>`}
        </section>
        <section class="card">
          <h3>Room map</h3>
          ${i.learned?c`<p>The camera has learned where people spend time: <b>${Math.round(i.low)}° to ${Math.round(i.high)}°</b> of pan, from ${i.sightings} sightings. Searches stay inside that span, skipping walls, corners and the back of the TV.</p>`:c`<p>Still learning where people spend time: ${(a=i.sightings)!=null?a:0} of ${(l=i.needed)!=null?l:30} sightings. Until then it searches around where it last saw someone.</p>`}
          <div class="actions">
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._resetRoom()}>${this._confirm==="room"?"Really relearn?":"Relearn the room"}</button>
          </div>
          <p class="muted small">Relearn after moving the camera or the furniture.</p>
        </section>
      </div>
    `}_knobs(e,t){let s=Object.fromEntries(Object.entries(e).filter(([i,o])=>o!==void 0&&o!==t[i]));clearTimeout(this._knobTimer),Object.keys(s).length&&(this._knobTimer=setTimeout(()=>this._settings(s),300))}async _resetRoom(){if(this._confirm!=="room")return this._confirm="room";this._confirm=null,await this._try(()=>this._call("camera_room_reset")),this._poll()}};V(L,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_tab:{state:!0},_state:{state:!0},_err:{state:!0},_busy:{state:!0},_gestures:{state:!0},_open:{state:!0},_form:{state:!0},_flash:{state:!0},_items:{state:!0},_enrollName:{state:!0},_confirm:{state:!0},_ask:{state:!0},_teach:{state:!0},_formReady:{state:!0},_viewKey:{state:!0}}),V(L,"styles",q`
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

    .teach { margin-bottom: 16px; }
    .teach p { margin: 0 0 12px; line-height: 1.5; }
    .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .item { display: grid; gap: 6px; align-content: start; }
    .item img, .item .noimg { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; background: var(--primary-background-color); }
    .item .noimg { display: flex; align-items: center; justify-content: center; color: var(--secondary-text-color); }
    .item .seen { font-size: 13px; display: flex; gap: 4px; align-items: flex-start; }
    .item .seen ha-icon { --mdc-icon-size: 16px; flex: none; margin-top: 1px; }
    .item button { justify-self: start; margin-top: 4px; }
  `);customElements.define("hubbubb-camera",L);export{B as KNOBS,Oe as ago,Xe as changed,M as gestureForm,Ze as summarizeActions};
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
