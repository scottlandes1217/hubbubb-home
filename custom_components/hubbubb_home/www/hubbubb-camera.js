var Ut=Object.defineProperty,Ft=Object.defineProperties;var Dt=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var dt=Object.prototype.hasOwnProperty,pt=Object.prototype.propertyIsEnumerable;var V=(a,t,e)=>t in a?Ut(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e,u=(a,t)=>{for(var e in t||(t={}))dt.call(t,e)&&V(a,e,t[e]);if(F)for(var e of F(t))pt.call(t,e)&&V(a,e,t[e]);return a},g=(a,t)=>Ft(a,Dt(t));var ut=(a,t)=>{var e={};for(var s in a)dt.call(a,s)&&t.indexOf(s)<0&&(e[s]=a[s]);if(a!=null&&F)for(var s of F(a))t.indexOf(s)<0&&pt.call(a,s)&&(e[s]=a[s]);return e};var W=(a,t,e)=>V(a,typeof t!="symbol"?t+"":t,e);var D=globalThis,I=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),mt=new WeakMap,z=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(I&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=mt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&mt.set(e,t))}return t}toString(){return this.cssText}},gt=a=>new z(typeof a=="string"?a:a+"",void 0,Y),X=(a,...t)=>{let e=a.length===1?a[0]:t.reduce((s,i,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[o+1],a[0]);return new z(e,a,Y)},_t=(a,t)=>{if(I)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,a.appendChild(s)}},K=I?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return gt(e)})(a):a;var{is:It,defineProperty:Gt,getOwnPropertyDescriptor:Jt,getOwnPropertyNames:qt,getOwnPropertySymbols:Bt,getPrototypeOf:Vt}=Object,b=globalThis,ft=b.trustedTypes,Wt=ft?ft.emptyScript:"",Z=b.reactiveElementPolyfillSupport,C=(a,t)=>a,Q={toAttribute(a,t){switch(t){case Boolean:a=a?Wt:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch(s){e=null}}return e}},wt=(a,t)=>!It(a,t),vt={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:wt},bt,$t;(bt=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),($t=b.litPropertyMetadata)!=null||(b.litPropertyMetadata=new WeakMap);var v=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Gt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var r;let{get:i,set:o}=(r=Jt(this.prototype,t))!=null?r:{get(){return this[e]},set(l){this[e]=l}};return{get:i,set(l){let n=i==null?void 0:i.call(this);o==null||o.call(this,l),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:vt}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=Vt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,s=[...qt(e),...Bt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(K(i))}else t!==void 0&&e.push(K(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Q).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){var o,r,l;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),h=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:Q;this._$Em=i;let d=h.fromAttribute(e,n.type);this[i]=(l=d!=null?d:(r=this._$Ej)==null?void 0:r.get(i))!=null?l:d,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){var r,l;if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s!=null||(s=n.getPropertyOptions(t)),!(((r=s.hasChanged)!=null?r:wt)(o,e)||s.useDefault&&s.reflect&&o===((l=this._$Ej)==null?void 0:l.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){var l,n,h;s&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(n=r!=null?r:e)!=null?n:this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((h=this._$Eq)!=null?h:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,l]of this._$Ep)this[r]=l;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[r,l]of o){let{wrapped:n}=l,h=this[r];n!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,l,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(o=>{var r;return(r=o.hostUpdate)==null?void 0:r.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},yt;v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[C("elementProperties")]=new Map,v[C("finalized")]=new Map,Z==null||Z({ReactiveElement:v}),((yt=b.reactiveElementVersions)!=null?yt:b.reactiveElementVersions=[]).push("2.1.2");var M=globalThis,xt=a=>a,G=M.trustedTypes,kt=G?G.createPolicy("lit-html",{createHTML:a=>a}):void 0,jt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Mt="?"+$,Yt=`<${Mt}>`,k=document,P=()=>k.createComment(""),O=a=>a===null||typeof a!="object"&&typeof a!="function",nt=Array.isArray,Xt=a=>nt(a)||typeof(a==null?void 0:a[Symbol.iterator])=="function",tt=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,At=/-->/g,St=/>/g,w=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Et=/'/g,Tt=/"/g,Pt=/^(?:script|style|textarea|title)$/i,lt=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),c=lt(1),he=lt(2),ce=lt(3),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),zt=new WeakMap,x=k.createTreeWalker(k,129);function Ot(a,t){if(!nt(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return kt!==void 0?kt.createHTML(t):t}var Kt=(a,t)=>{let e=a.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",r=j;for(let l=0;l<e;l++){let n=a[l],h,d,m=-1,_=0;for(;_<n.length&&(r.lastIndex=_,d=r.exec(n),d!==null);)_=r.lastIndex,r===j?d[1]==="!--"?r=At:d[1]!==void 0?r=St:d[2]!==void 0?(Pt.test(d[2])&&(i=RegExp("</"+d[2],"g")),r=w):d[3]!==void 0&&(r=w):r===w?d[0]===">"?(r=i!=null?i:j,m=-1):d[1]===void 0?m=-2:(m=r.lastIndex-d[2].length,h=d[1],r=d[3]===void 0?w:d[3]==='"'?Tt:Et):r===Tt||r===Et?r=w:r===At||r===St?r=j:(r=w,i=void 0);let f=r===w&&a[l+1].startsWith("/>")?" ":"";o+=r===j?n+Yt:m>=0?(s.push(h),n.slice(0,m)+jt+n.slice(m)+$+f):n+$+(m===-2?l:f)}return[Ot(a,o+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},R=class a{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0,l=t.length-1,n=this.parts,[h,d]=Kt(t,e);if(this.el=a.createElement(h,s),x.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=x.nextNode())!==null&&n.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(jt)){let _=d[r++],f=i.getAttribute(m).split($),U=/([.?@])?(.*)/.exec(_);n.push({type:1,index:o,name:U[2],strings:f,ctor:U[1]==="."?it:U[1]==="?"?rt:U[1]==="@"?at:T}),i.removeAttribute(m)}else m.startsWith($)&&(n.push({type:6,index:o}),i.removeAttribute(m));if(Pt.test(i.tagName)){let m=i.textContent.split($),_=m.length-1;if(_>0){i.textContent=G?G.emptyScript:"";for(let f=0;f<_;f++)i.append(m[f],P()),x.nextNode(),n.push({type:2,index:++o});i.append(m[_],P())}}}else if(i.nodeType===8)if(i.data===Mt)n.push({type:2,index:o});else{let m=-1;for(;(m=i.data.indexOf($,m+1))!==-1;)n.push({type:7,index:o}),m+=$.length-1}o++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};function E(a,t,e=a,s){var r,l,n;if(t===A)return t;let i=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl,o=O(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),o===void 0?i=void 0:(i=new o(a),i._$AT(a,e,s)),s!==void 0?((n=e._$Co)!=null?n:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=E(a,i._$AS(a,t.values),i,s)),t}var st=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var h;let{el:{content:e},parts:s}=this._$AD,i=((h=t==null?void 0:t.creationScope)!=null?h:k).importNode(e,!0);x.currentNode=i;let o=x.nextNode(),r=0,l=0,n=s[0];for(;n!==void 0;){if(r===n.index){let d;n.type===2?d=new N(o,o.nextSibling,this,t):n.type===1?d=new n.ctor(o,n.name,n.strings,this,t):n.type===6&&(d=new ot(o,this,t)),this._$AV.push(d),n=s[++l]}r!==(n==null?void 0:n.index)&&(o=x.nextNode(),r++)}return x.currentNode=k,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},N=class a{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var o;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),O(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=R.createElement(Ot(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{let r=new st(i,this),l=r.u(this.options);r.p(e),this.T(l),this._$AH=r}}_$AC(t){let e=zt.get(t.strings);return e===void 0&&zt.set(t.strings,e=new R(t)),e}k(t){nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new a(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=xt(t).nextSibling;xt(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let o=this.strings,r=!1;if(o===void 0)t=E(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==A,r&&(this._$AH=t);else{let l=t,n,h;for(t=o[0],n=0;n<o.length-1;n++)h=E(this,l[s+n],e,n),h===A&&(h=this._$AH[n]),r||(r=!O(h)||h!==this._$AH[n]),h===p?t=p:t!==p&&(t+=(h!=null?h:"")+o[n+1]),this._$AH[n]=h}r&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},it=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},rt=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},at=class extends T{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var r;if((t=(r=E(this,t,e,0))!=null?r:p)===A)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},ot=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var et=M.litHtmlPolyfillSupport,Ct;et==null||et(R,N),((Ct=M.litHtmlVersions)!=null?Ct:M.litHtmlVersions=[]).push("3.3.3");var Rt=(a,t,e)=>{var o,r;let s=(o=e==null?void 0:e.renderBefore)!=null?o:t,i=s._$litPart$;if(i===void 0){let l=(r=e==null?void 0:e.renderBefore)!=null?r:null;s._$litPart$=i=new N(t.insertBefore(P(),l),l,void 0,e!=null?e:{})}return i._$AI(a),i};var S=globalThis,y=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return A}},Nt;y._$litElement$=!0,y.finalized=!0,(Nt=S.litElementHydrateSupport)==null||Nt.call(S,{LitElement:y});var ht=S.litElementPolyfillSupport;ht==null||ht({LitElement:y});var Ht;((Ht=S.litElementVersions)!=null?Ht:S.litElementVersions=[]).push("4.2.2");var Zt=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-camera ${Zt}`);var Qt=[["live","Live","mdi:cctv"],["gestures","Gestures","mdi:hand-wave"],["people","People","mdi:account-multiple"],["things","Things","mdi:package-variant-closed"],["jarvis","Jarvis","mdi:account-voice"],["tuning","Tuning","mdi:tune-variant"]],J=[["gestureMatch","Gesture match strictness","How close a hand must be to the gestures you taught it. Lower is stricter (fewer accidents); raise it if taught gestures are missed.",.01],["framingFill","Framing","How tightly auto-zoom frames one person: how much of the frame their upper body fills. 0.7 is waist up, 1.0 chest up, 1.4\u20131.6 head and shoulders. Lower shows more of the room.",.05],["zoomMax","Auto-zoom limit","The furthest auto-zoom will zoom in, from 1\xD7 (never) to 4\xD7. Pinching or scrolling the live view zooms by hand, past this limit.",.1],["holdSeconds","Hold time","Seconds a gesture must be held before it counts. Longer means fewer accidents.",.1],["handConfidence","Hand clarity","How clearly every finger must be seen. Higher ignores hands holding a phone or petting the dog.",.05],["lookTurn","Looking at the camera","How far your face may turn from the camera and still count as looking (0 = straight at it, 0.5 = side-on). Works with your head tilted, lying down. Raise it if you're refused while looking at the camera; lower it if glancing at your phone counts.",.01],["followGain","Following speed","How quickly the camera turns to keep you centred. Higher is snappier; too high and it wobbles.",.05],["gestureReach","Gesture height","A hand counts as raised when its wrist is above its elbow, or when it is no more than this many face-heights below your chin. Raise it if chest-height gestures are missed; lower it if a phone or keyboard sets gestures off.",.1],["hairReach","Head zone: above the face","Hands this far above your face (hair) pause gestures, in face-heights.",.1],["chinReach","Head zone: below the chin","Hands this far below your chin (eating, drinking) pause gestures, in face-heights.",.1],["steadiness","Hold-still tolerance","How still a hand must be for a gesture to count. Lower is stricter.",.05],["faceMatchThreshold","Face match strictness","Lower is stricter. Raise it if you're not recognized; lower it if people get mixed up.",.02],["searchDegrees","Search width","Degrees either side of the last sighting to search, until the room is learned.",1],["searchTilt","Search tilt","Degrees up (+) or down (\u2212) to search at, until the room is learned.",1]],te=a=>{let t=Array.isArray(a)?a:[];return t.length?t.map(s=>{var r;let i=s.action||s.service||s.choose&&"choose"||s.delay&&"delay"||s.event&&"event"||"";if(i==="hubbubb_home.mac_screen_sharing")return(r=s.data)!=null&&r.on?"Start Mac screen mirroring":"Stop Mac screen mirroring";if(!i.includes("."))return i?i[0].toUpperCase()+i.slice(1):"Step";let[,o]=i.split(".");return o.replace(/_/g," ").replace(/^./,l=>l.toUpperCase())}).join(", "):"Does nothing yet"},Lt=(a,t=Date.now()/1e3)=>{if(!a)return"";let e=Math.max(0,t-a);return e<45?"just now":e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} days ago`},H=a=>{var t,e,s,i;return{enabled:(t=a==null?void 0:a.enabled)!=null?t:!0,repeat:(e=a==null?void 0:a.repeat)!=null?e:!1,people:(s=a==null?void 0:a.people)!=null?s:[],actions:(i=a==null?void 0:a.actions)!=null?i:[]}},ee=(a,t)=>JSON.stringify(a)!==JSON.stringify(H(t)),B=[["listening","Listening","mdi:ear-hearing"],["thinking","Thinking","mdi:head-cog-outline"],["speaking","Speaking","mdi:account-voice"]],q=(a={})=>{var t,e,s,i,o,r,l;return u({move:(t=a.move)!=null?t:!0,satellites:(e=a.satellites)!=null?e:[],strength:(s=a.strength)!=null?s:.6,lights:(i=a.lights)!=null?i:!1,light_entities:(o=a.light_entities)!=null?o:[],brightness:(r=a.brightness)!=null?r:80,pause_while:(l=a.pause_while)!=null?l:""},Object.fromEntries(B.map(([n])=>{var h,d;return[`${n}_color`,(d=(h=a.colors)==null?void 0:h[n])!=null?d:null]})))},ct=a=>{let l=a,{listening_color:t,thinking_color:e,speaking_color:s,pause_while:i}=l,o=ut(l,["listening_color","thinking_color","speaking_color","pause_while"]),r=Object.fromEntries([["listening",t],["thinking",e],["speaking",s]].filter(([,n])=>Array.isArray(n)));return u(g(u({},o),{pause_while:i||null}),Object.keys(r).length?{colors:r}:{})},se,ie=()=>se||(se=(async()=>{var e,s,i;if(customElements.get("ha-form")&&customElements.get("ha-selector"))return;let a=await((e=window.loadCardHelpers)==null?void 0:e.call(window)),t=await(a==null?void 0:a.createCardElement({type:"entities",entities:[]}));await((i=(s=t==null?void 0:t.constructor)==null?void 0:s.getConfigElement)==null?void 0:i.call(s)),await customElements.whenDefined("ha-form")})()),L=class extends y{constructor(){super(),this._tab=(()=>{try{return localStorage.getItem("hubbubb-camera-tab")||"live"}catch(t){return"live"}})(),this._state=null,this._err="",this._busy=!1,this._gestures=null,this._open=null,this._form=null,this._flash=null,this._items=null,this._enrollName="",this._pets=null,this._petForm={name:"",kind:"dog",spot:"",result:""},this._confirm=null,this._ask={q:"",answer:null,busy:!1},this._teach={name:"",where:"",result:null,busy:!1},this._formReady=!1,this._viewKey=0,this._jarvis=null,this._jarvisForm=null}connectedCallback(){super.connectedCallback(),ie().then(()=>this._formReady=!0).catch(()=>this._formReady=!0),this._onVisible=()=>document.visibilityState==="visible"&&this._poll(),document.addEventListener("visibilitychange",this._onVisible),this._unsub=this.hass.connection.subscribeEvents(t=>this._fired(t.data),"hubbubb_home_gesture"),this._poll(),this._loadGestures()}disconnectedCallback(){var t;clearTimeout(this._timer),document.removeEventListener("visibilitychange",this._onVisible),(t=this._unsub)==null||t.then(e=>e()).catch(()=>{}),super.disconnectedCallback()}async _call(t,e={},s=!0){let i=await this.hass.callWS(u({type:"call_service",domain:"hubbubb_home",service:t,service_data:e},s?{return_response:!0}:{}));return(i==null?void 0:i.response)||{}}async _try(t){this._busy=!0,this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}finally{this._busy=!1}}async _poll(){var s,i,o,r;if(clearTimeout(this._timer),document.visibilityState!=="visible"||!this.isConnected)return;let t=(s=this._state)==null?void 0:s.connected;try{this._state=await this._call("camera_state"),t===!1&&this._state.connected&&this._viewKey++,this._err.startsWith("The camera")&&(this._err="")}catch(l){this._state={connected:!1,status:(l==null?void 0:l.message)||String(l)}}this._tab==="jarvis"&&this._loadJarvis(!1),this._tab==="people"&&(this._pets=await this._call("camera_pets").catch(()=>this._pets));let e=["live","people","jarvis"].includes(this._tab)||((i=this._state)==null?void 0:i.enrolling)||((r=(o=this._state)==null?void 0:o.gestures)==null?void 0:r.teaching);this._timer=setTimeout(()=>this._poll(),e?1500:6e3)}async _loadGestures(){let t=await this._try(()=>this._call("gestures_get"));t&&(this._gestures=t)}async _loadJarvis(t){try{this._jarvis=await this._call("jarvis_presence_get"),(t||!this._jarvisForm)&&(this._jarvisForm=q(this._jarvis.config))}catch(e){this._err=(e==null?void 0:e.message)||String(e)}}async _loadItems(){let t=await this._try(()=>this._call("camera_items"));t&&(this._items=t.items||[])}_fired(t){t.held||(this._flash=t,clearTimeout(this._flashTimer),this._flashTimer=setTimeout(()=>this._flash=null,2500),this._gestures&&(this._gestures=g(u({},this._gestures),{last:g(u({},t),{ts:Date.now()/1e3})})))}_go(t){this._tab=t,this._confirm=null;try{localStorage.setItem("hubbubb-camera-tab",t)}catch(e){}t==="things"&&!this._items&&this._loadItems(),t==="jarvis"&&this._loadJarvis(!0),this._poll()}get _cameraEntity(){var t;return(t=Object.values(this.hass.entities||{}).find(e=>e.platform==="hubbubb_home"&&e.entity_id.startsWith("camera.")))==null?void 0:t.entity_id}async _settings(t){let e=await this._try(()=>this._call("camera_settings",t));e&&(this._state=e)}render(){var e,s,i;let t=this._state;return c`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Camera</div>
        <span class="pill ${t!=null&&t.connected?"ok":"off"}">
          <span class="dot"></span>${t===null?"Connecting\u2026":t.connected?"Connected":"Offline"}
        </span>
      </div>
      <nav class="tabs" role="tablist">
        ${Qt.map(([o,r,l])=>c`<button role="tab" aria-selected=${this._tab===o} class=${this._tab===o?"on":""} @click=${()=>this._go(o)}>
            <ha-icon .icon=${l}></ha-icon><span>${r}</span>
          </button>`)}
      </nav>
      ${this._err?c`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:p}
      ${t&&!t.connected&&t.status?c`<div class="notice"><ha-icon icon="mdi:lan-disconnect"></ha-icon><div><b>The camera isn't reachable.</b><br />${t.status}<br /><span class="muted">It runs as Hubbubb Local Camera on the Mac and starts at login.</span></div></div>`:p}
      <main>
        ${(i=(s=(e={live:()=>this._renderLive(),gestures:()=>this._renderGestures(),people:()=>this._renderPeople(),things:()=>this._renderThings(),jarvis:()=>this._renderJarvis(),tuning:()=>this._renderTuning()})[this._tab])==null?void 0:s.call(e))!=null?i:p}
      </main>
    `}_renderView(t=!1){var i,o;let e=this._cameraEntity,s=e&&((o=(i=this.hass.states[e])==null?void 0:i.attributes)==null?void 0:o.access_token);return!e||!s?c`<div class="view empty ${t?"small":""}">No live view yet.</div>`:c`<div class="view steer ${t?"small":""}"
        title="Drag to move the camera · pinch or scroll to zoom · click someone to follow them"
        @pointerdown=${this._pointerDown} @pointermove=${this._pointerMove} @pointerup=${this._pointerUp}
        @pointercancel=${r=>this._pointerUp(r,!0)} @wheel=${this._wheel}>
      <img
        alt="Live camera view" draggable="false"
        src=${`/api/camera_proxy_stream/${e}?token=${s}&v=${this._viewKey}`}
        @error=${()=>{clearTimeout(this._retry),this._retry=setTimeout(()=>this._viewKey++,2e3)}}
      />
      ${this._flash?c`<div class="toast"><ha-icon .icon=${this._iconFor(this._flash.gesture)}></ha-icon>${this._titleFor(this._flash.gesture)}${this._flash.person?c` · ${this._flash.person}`:p}</div>`:p}
    </div>`}_pointerDown(t){let e=t.currentTarget.querySelector("img");if(!(!e||t.button)){if(t.currentTarget.setPointerCapture(t.pointerId),(this._touches||(this._touches=new Map)).set(t.pointerId,{x:t.clientX,y:t.clientY}),this._touches.size===2){this._drag=null,this._pinch={span:this._span(),zoom:this._zoomNow()};return}this._drag={x:t.clientX,y:t.clientY,sentX:t.clientX,sentY:t.clientY,moved:!1,last:0,rect:e.getBoundingClientRect()}}}_pointerMove(t){var s;if((s=this._touches)!=null&&s.has(t.pointerId)&&this._touches.set(t.pointerId,{x:t.clientX,y:t.clientY}),this._pinch){this._touches.size===2&&this._zoomTo(this._pinch.zoom*this._span()/this._pinch.span);return}let e=this._drag;!e||!e.moved&&Math.hypot(t.clientX-e.x,t.clientY-e.y)<8||(e.moved=!0,Date.now()-e.last>150&&this._sendDrag(t))}_span(){let[t,e]=[...this._touches.values()];return Math.max(1,Math.hypot(t.x-e.x,t.y-e.y))}_zoomNow(){var t,e,s,i,o,r,l;return(l=(r=(s=this._zoomGoal)!=null?s:(e=(t=this._state)==null?void 0:t.hardware)==null?void 0:e.zoom_actual)!=null?r:(o=(i=this._state)==null?void 0:i.settings)==null?void 0:o.zoom)!=null?l:1}_wheel(t){t.preventDefault(),this._zoomTo(this._zoomNow()*Math.exp(-t.deltaY*(t.ctrlKey?.01:.002)))}_zoomTo(t){if(this._zoomGoal=Math.round(Math.max(1,Math.min(4,t))*20)/20,this._zoomTimer)return;let e=()=>{let s=this._zoomGoal;s!==this._zoomSent?(this._zoomSent=s,this._settings({zoom:s}),this._zoomTimer=setTimeout(e,150)):(this._zoomTimer=null,clearTimeout(this._zoomIdle),this._zoomIdle=setTimeout(()=>this._zoomGoal=this._zoomSent=void 0,1e3))};e()}_pointerUp(t,e=!1){var i,o;if((i=this._touches)==null||i.delete(t.pointerId),this._pinch){(o=this._touches)!=null&&o.size||(this._pinch=null);return}let s=this._drag;if(!s||e)return void(this._drag=null);if(s.moved)this._sendDrag(t);else{let r=(t.clientX-s.rect.left)/s.rect.width,l=(t.clientY-s.rect.top)/s.rect.height;r>=0&&r<=1&&l>=0&&l<=1&&this._call("camera_focus",{x:r,y:l}).then(()=>this._poll()).catch(n=>this._err=(n==null?void 0:n.message)||String(n))}this._drag=null}_sendDrag(t){let e=this._drag,s=r=>Math.max(-1,Math.min(1,r)),i=s((t.clientX-e.sentX)/e.rect.width),o=s((t.clientY-e.sentY)/e.rect.height);!i&&!o||(Object.assign(e,{sentX:t.clientX,sentY:t.clientY,last:Date.now()}),this._call("camera_drag",{dx:i,dy:o}).catch(r=>this._err=(r==null?void 0:r.message)||String(r)))}_titleFor(t){var e,s,i;return((i=(s=(e=this._gestures)==null?void 0:e.catalog)==null?void 0:s.find(o=>o.id===t))==null?void 0:i.title)||t}_iconFor(t){var e,s,i;return((i=(s=(e=this._gestures)==null?void 0:e.catalog)==null?void 0:s.find(o=>o.id===t))==null?void 0:i.icon)||"mdi:hand-wave"}_renderLive(){var o,r;let t=this._state||{},e=t.settings||{},s=t.people||[],i=t.animals||[];return c`
      <div class="live">
        <div>
          ${this._renderView()}
          <div class="status">${t.status||""}</div>
        </div>
        <div class="side">
          <section class="card">
            <h3>In view</h3>
            <div class="chips">
              ${s.map(l=>c`<span class="chip person"><ha-icon icon="mdi:account"></ha-icon>${l}</span>`)}
              ${i.map(l=>c`<span class="chip animal"><ha-icon icon="mdi:paw"></ha-icon>${l}</span>`)}
              ${!s.length&&!i.length?c`<span class="muted">Nobody recognized</span>`:p}
            </div>
          </section>
          <section class="card">
            <h3>Camera</h3>
            <p class="muted">Drag the picture to move the camera; pinch or scroll to zoom. Click a person or animal to follow just them.</p>
            ${t.focus?c`<div class="pan"><button @click=${()=>this._try(()=>this._call("camera_focus",{})).then(()=>this._poll())}><ha-icon icon="mdi:account-group"></ha-icon> Follow everyone again</button></div>`:p}
            ${this._formReady?c`<ha-form
                  .hass=${this.hass}
                  .data=${{follow:e.follow,auto_zoom:e.auto_zoom,zoom:(o=e.zoom)!=null?o:1,zoomMax:(r=e.zoomMax)!=null?r:4}}
                  .schema=${[{name:"follow",selector:{boolean:{}}},{name:"auto_zoom",selector:{boolean:{}}},e.auto_zoom?{name:"zoomMax",selector:{number:{min:1,max:4,step:.1,mode:"slider",unit_of_measurement:"\xD7"}}}:{name:"zoom",selector:{number:{min:1,max:4,step:.1,mode:"slider"}}}]}
                  .computeLabel=${l=>({follow:"Follow people",auto_zoom:"Zoom to fit automatically",zoom:"Zoom",zoomMax:"Zoom in no further than"})[l.name]}
                  @value-changed=${l=>this._settingsFrom(l.detail.value,e)}
                ></ha-form>`:p}
          </section>
          <section class="card">
            <h3>Ask the camera</h3>
            <form class="inline" @submit=${l=>{l.preventDefault(),this._askCamera()}}>
              <input placeholder="Where are my keys?" .value=${this._ask.q} @input=${l=>this._ask=g(u({},this._ask),{q:l.target.value})} />
              <button class="primary" ?disabled=${this._ask.busy||!this._ask.q.trim()}>${this._ask.busy?"Looking\u2026":"Ask"}</button>
            </form>
            ${this._ask.answer?c`<p class="answer">${this._ask.answer}</p>`:p}
          </section>
        </div>
      </div>
    `}_settingsFrom(t,e){let s={};for(let i of["follow","auto_zoom","zoom","zoomMax"])t[i]!==void 0&&t[i]!==e[i]&&(s[i]=t[i]);Object.keys(s).length&&this._settings(s)}async _askCamera(){this._ask=g(u({},this._ask),{busy:!0,answer:null});try{let t=await this._call("camera_look",{question:this._ask.q.trim()}),e=!t.found&&t.last_seen?` Last seen ${t.last_seen}`:"";this._ask=g(u({},this._ask),{busy:!1,answer:(t.answer||t.error||"No answer.")+e})}catch(t){this._ask=g(u({},this._ask),{busy:!1,answer:(t==null?void 0:t.message)||String(t)})}}_renderGestures(){let t=this._gestures;return t?c`
      <p class="intro">Look at the camera and hold a gesture steady at chest height for about a second. Assign each one any Home Assistant actions — the same editor automations use. Hands at the keyboard, near your face, or while you look elsewhere never count.</p>
      <section class="card">
        <ha-formfield label="Gestures on — turn off for meetings or when talking with your hands">
          <ha-switch .checked=${t.on!==!1} ?disabled=${this._busy} @change=${e=>this._gesturesOn(e.target.checked)}></ha-switch>
        </ha-formfield>
      </section>
      <div class="gestures ${t.on===!1?"disabled":""}">
        ${t.catalog.map(e=>this._renderGesture(e,t.gestures[e.id]))}
      </div>
    `:c`<div class="empty">Loading gestures…</div>`}async _gesturesOn(t){await this._try(()=>this._call("gestures_enable",{on:t},!1)),this._loadGestures()}_renderGesture(t,e){var n,h,d,m,_,f;let s=this._open===t.id,i=s?this._form:H(e),o=((n=this._flash)==null?void 0:n.gesture)===t.id,r=(m=(d=(h=this._state)==null?void 0:h.gestures)==null?void 0:d.taught)==null?void 0:m[t.id],l=((_=this._gestures.last)==null?void 0:_.gesture)===t.id?this._gestures.last:null;return c`
      <section class="card gesture ${s?"open":""} ${o?"lit":""} ${i.enabled?"":"disabled"}">
        <button class="ghead" aria-expanded=${s} @click=${()=>this._toggleGesture(t.id,e)}>
          <span class="gicon"><ha-icon .icon=${t.icon}></ha-icon></span>
          <span class="gtext">
            <span class="name">${t.title} <span class="badge ${r?"on":""}">${r?"Taught":"Built-in shape"}</span></span>
            <span class="muted">${t.how}</span>
            <span class="summary">${i.enabled?te(e==null?void 0:e.actions):"Turned off"}${e!=null&&e.repeat?" \xB7 repeats while held":""}${(f=e==null?void 0:e.people)!=null&&f.length?` \xB7 only ${e.people.join(", ")}`:""}</span>
          </span>
          ${l?c`<span class="muted when">${l.person?`${l.person}, `:""}${Lt(l.ts)}</span>`:p}
          <ha-icon class="chev" icon=${s?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${s?this._renderGestureEditor(t):p}
      </section>
    `}_toggleGesture(t,e){if(this._open===t){this._open=null,this._form=null;return}this._open=t,this._form=H(e)}_renderTeach(t){var o,r,l;let e=((o=this._state)==null?void 0:o.gestures)||{},s=e.teaching,i=(r=e.taught)==null?void 0:r[t.id];return(s==null?void 0:s.gesture)===t.id?c`<div class="teach-box">
        <div class="teach-row">
          <div class="teach-view">${this._renderView(!0)}</div>
          <div>
            <div class="name">Teaching ${t.title}…</div>
            <div class="progress"><div style=${`width:${Math.round(100*s.samples/s.target)}%`}></div></div>
            <p class="muted">${((l=this._state)==null?void 0:l.status)||""}</p>
            <p class="muted small">Look at the camera, hold ${t.title.toLowerCase()} at chest height, and move it around a little — closer, further, tilted — so it learns your hand from every angle.</p>
          </div>
        </div>
      </div>`:c`<div class="teach-box">
      <div class="teach-row-inline">
        <div class="grow">
          <div class="name">${i?`Taught from your hand (${i} samples)`:"Using the built-in shape"}</div>
          <div class="muted small">${i?"Re-teach it if it's being missed or mistaken for another gesture.":"Teach it your way of doing it \u2014 it takes 3 seconds and makes it far more reliable."}</div>
        </div>
        <button class="primary" ?disabled=${this._busy||!!s} @click=${()=>this._try(()=>this._call("camera_gesture_teach",{gesture:t.id})).then(()=>this._poll())}>${i?"Re-teach":"Teach it"}</button>
        ${i?c`<button ?disabled=${this._busy||!!s} @click=${()=>this._forgetTeach(t.id)}>${this._confirm===`g:${t.id}`?"Really forget?":"Forget"}</button>`:p}
      </div>
    </div>`}async _forgetTeach(t){if(this._confirm!==`g:${t}`)return this._confirm=`g:${t}`;this._confirm=null,await this._try(()=>this._call("camera_gesture_forget",{gesture:t})),this._poll()}_renderGestureEditor(t){var o;let e=(((o=this._state)==null?void 0:o.enrolled)||[]).map(r=>r.name),s=this._gestures.gestures[t.id],i=ee(this._form,s);return this._formReady?c`
      <div class="editor">
        ${this._renderTeach(t)}
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${[{name:"enabled",selector:{boolean:{}}},{name:"repeat",selector:{boolean:{}}},...e.length?[{name:"people",selector:{select:{multiple:!0,mode:"list",options:e.map(r=>({value:r,label:r}))}}}]:[]]}
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
          <button class="primary" ?disabled=${this._busy||!i} @click=${()=>this._saveGesture(t.id)}>${i?"Save":"Saved"}</button>
          <button ?disabled=${this._busy||!this._form.actions.length} @click=${()=>this._testGesture(t.id,i)}>Test</button>
          ${i?c`<button ?disabled=${this._busy} @click=${()=>this._form=H(s)}>Undo changes</button>`:p}
        </div>
      </div>
    `:c`<div class="empty">Loading the editor…</div>`}async _saveGesture(t){let e=await this._try(()=>this._call("gesture_save",u({gesture:t},this._form)));e&&(this._gestures=g(u({},this._gestures),{gestures:g(u({},this._gestures.gestures),{[t]:e.saved})}),this._form=H(e.saved))}async _testGesture(t,e){e&&await this._saveGesture(t),!this._err&&await this._try(()=>this._call("gesture_test",{gesture:t},!1))}_renderPeople(){let t=this._state||{},e=t.enrolled||[],s=t.enrolling;return c`
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
    `}_renderPets(){var l,n;let t=this._pets||{},e=Object.entries(t.pets||{}),s=Object.keys(t.spots||{}),i=t.pets_at||{},o=((l=this._state)==null?void 0:l.animals)||[],r=this._petForm;return c`
      <section class="card">
        <h3>Pets</h3>
        <p class="muted">Name your pet, then mark the door they wait at. When they wait there a while, Jarvis tells you they may need to go out.</p>
        ${e.map(([h,d])=>c`<div class="row">
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
          <input type="number" min="0.5" max="60" step="0.5" style="width:5em" .value=${String((n=t.wait_minutes)!=null?n:3)}
            @change=${h=>this._petSave({wait_minutes:Number(h.target.value)})} />
          minutes at a door</label>
      </section>
    `}async _petSave(t,e){if(e&&this._confirm!==e)return this._confirm=e;this._confirm=null;let s=await this._try(()=>this._call("camera_pets_save",t));s&&(this._pets=s,t.kind&&(this._petForm=g(u({},this._petForm),{name:""})))}async _petSpot(t,e){if(e&&this._confirm!==e)return this._confirm=e;this._confirm=null;let s=await this._try(()=>this._call("camera_pet_spot",t));s&&(this._petForm=g(u({},this._petForm),{spot:s.marked?"":this._petForm.spot,result:s.error||(s.marked?`Marked "${s.marked}" where ${s.by} is.`:"")}),this._pets=await this._call("camera_pets").catch(()=>this._pets))}async _enroll(t){if(!t)return;await this._try(()=>this._call("camera_enroll",{name:t}))&&(this._enrollName="",this._poll())}async _forgetPerson(t){if(this._confirm!==`p:${t}`)return this._confirm=`p:${t}`;this._confirm=null,await this._try(()=>this._call("camera_forget_person",{name:t})),this._poll()}_renderThings(){let t=this._teach;return c`
      <section class="card teach">
        <h3>Teach it something</h3>
        <p class="muted">Hold the thing up to the camera and name it — or say where it is. Next time you ask Jarvis where it is, the camera knows what to look for. You can also just say "Jarvis, this is my …" while holding it.</p>
        <form class="inline wrap" @submit=${e=>{e.preventDefault(),this._learn()}}>
          <input placeholder="Name, e.g. AirPods case" .value=${t.name} @input=${e=>this._teach=g(u({},t),{name:e.target.value})} />
          <input placeholder="Where (optional), e.g. on the shelf by the door" .value=${t.where} @input=${e=>this._teach=g(u({},t),{where:e.target.value})} />
          <button class="primary" ?disabled=${t.busy||!t.name.trim()}>${t.busy?"Looking\u2026":"Teach"}</button>
        </form>
        ${t.result?c`<p class="answer">${t.result}</p>`:p}
      </section>
      ${this._items===null?c`<div class="empty">Loading…</div>`:this._items.length?c`<div class="items">
              ${this._items.map(e=>c`<section class="card item">
                  ${e.photo?c`<img alt=${e.name} src=${`data:image/jpeg;base64,${e.photo}`} />`:c`<div class="noimg"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`}
                  <div class="name">${e.name}</div>
                  <div class="muted">${e.description}</div>
                  <div class="seen">${e.last_seen_at?c`<ha-icon icon="mdi:map-marker-outline"></ha-icon>${Lt(e.last_seen_at)}: ${e.last_seen}`:c`<span class="muted">Not spotted yet</span>`}</div>
                  <button class="danger" ?disabled=${this._busy} @click=${()=>this._forgetItem(e.name)}>${this._confirm===`i:${e.name}`?"Really forget?":"Forget"}</button>
                </section>`)}
            </div>`:c`<div class="empty">Nothing taught yet.</div>`}
    `}async _learn(){let t=this._teach;this._teach=g(u({},t),{busy:!0,result:null});try{let e=await this._call("camera_learn",{name:t.name.trim(),hint:t.where.trim()});this._teach=e.learned?{name:"",where:"",busy:!1,result:`Got it \u2014 ${e.learned}: ${e.looks_like}`}:g(u({},t),{busy:!1,result:e.error||"It couldn't make that out."}),e.learned&&this._loadItems()}catch(e){this._teach=g(u({},t),{busy:!1,result:(e==null?void 0:e.message)||String(e)})}}async _forgetItem(t){if(this._confirm!==`i:${t}`)return this._confirm=`i:${t}`;this._confirm=null,await this._try(()=>this._call("camera_forget_item",{name:t})),this._loadItems()}_renderJarvis(){let t=this._jarvis,e=this._jarvisForm;if(!t||!e||!this._formReady)return c`<div class="empty">Loading…</div>`;let s=JSON.stringify(ct(e))!==JSON.stringify(ct(q(t.config))),i=B.find(([o])=>o===t.mood);return c`
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
            ${B.map(([o,r,l])=>c`<button ?disabled=${this._busy||s} title=${s?"Save first":""} @click=${()=>this._try(()=>this._call("jarvis_presence_test",{mood:o},!1))}><ha-icon .icon=${l}></ha-icon> ${r}</button>`)}
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
            @value-changed=${o=>this._jarvisForm=u(u({},this._jarvisForm),o.detail.value)}
          ></ha-form>
          <h3>Lights</h3>
          <ha-form
            .hass=${this.hass}
            .data=${e}
            .schema=${[{name:"lights",selector:{boolean:{}}},...e.lights?[{name:"light_entities",selector:{entity:{domain:"light",multiple:!0}}},{name:"brightness",selector:{number:{min:1,max:100,step:1,mode:"slider",unit_of_measurement:"%"}}},...B.map(([o])=>({name:`${o}_color`,selector:{color_rgb:{}}})),{name:"pause_while",selector:{entity:{}}}]:[]]}
            .computeLabel=${o=>({lights:"Tint lights while Jarvis talks",light_entities:"Which lights",brightness:"Brightness",listening_color:"Listening colour",thinking_color:"Thinking colour",speaking_color:"Speaking colour",pause_while:"Leave the lights alone while this is on"})[o.name]}
            .computeHelper=${o=>({light_entities:"Coloured lights near the TV work best, like the Hue Play bars.",pause_while:"For example the Sync Box's light sync, which owns those lights while it runs."})[o.name]}
            @value-changed=${o=>this._jarvisForm=u(u({},this._jarvisForm),o.detail.value)}
          ></ha-form>
          <div class="actions">
            <button class="primary" ?disabled=${this._busy||!s} @click=${()=>this._saveJarvis()}>${s?"Save":"Saved"}</button>
            ${s?c`<button ?disabled=${this._busy} @click=${()=>this._jarvisForm=q(t.config)}>Undo changes</button>`:p}
          </div>
        </section>
      </div>
    `}async _saveJarvis(){let t=await this._try(()=>this._call("jarvis_presence_save",ct(this._jarvisForm)));t&&(this._jarvis=g(u({},this._jarvis),{config:t.config}),this._jarvisForm=q(t.config))}_renderTuning(){var r,l;let t=this._state||{},e=t.settings||{},s=t.knobs||{},i=t.room||{},o=u({require_looking:e.require_looking},Object.fromEntries(J.map(([n])=>[n,e[n]])));return c`
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
    `}_knobs(t,e){let s=Object.fromEntries(Object.entries(t).filter(([i,o])=>o!==void 0&&o!==e[i]));clearTimeout(this._knobTimer),Object.keys(s).length&&(this._knobTimer=setTimeout(()=>this._settings(s),300))}async _resetRoom(){if(this._confirm!=="room")return this._confirm="room";this._confirm=null,await this._try(()=>this._call("camera_room_reset")),this._poll()}};W(L,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_tab:{state:!0},_state:{state:!0},_err:{state:!0},_busy:{state:!0},_gestures:{state:!0},_open:{state:!0},_form:{state:!0},_flash:{state:!0},_items:{state:!0},_enrollName:{state:!0},_confirm:{state:!0},_ask:{state:!0},_teach:{state:!0},_formReady:{state:!0},_viewKey:{state:!0},_jarvis:{state:!0},_jarvisForm:{state:!0},_pets:{state:!0},_petForm:{state:!0}}),W(L,"styles",X`
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
  `);customElements.define("hubbubb-camera",L);export{J as KNOBS,Lt as ago,ee as changed,H as gestureForm,ct as jarvisConfig,q as jarvisForm,te as summarizeActions};
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
