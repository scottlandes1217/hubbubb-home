var Zt=Object.defineProperty,Qt=Object.defineProperties;var te=Object.getOwnPropertyDescriptors;var yt=Object.getOwnPropertySymbols;var ee=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var tt=(r,t,e)=>t in r?Zt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,et=(r,t)=>{for(var e in t||(t={}))ee.call(t,e)&&tt(r,e,t[e]);if(yt)for(var e of yt(t))se.call(t,e)&&tt(r,e,t[e]);return r},$t=(r,t)=>Qt(r,te(t));var st=(r,t,e)=>tt(r,typeof t!="symbol"?t+"":t,e);var F=globalThis,Z=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,it=Symbol(),wt=new WeakMap,B=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==it)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Z&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=wt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&wt.set(e,t))}return t}toString(){return this.cssText}},At=r=>new B(typeof r=="string"?r:r+"",void 0,it),rt=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new B(e,r,it)},kt=(r,t)=>{if(Z)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=F.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ot=Z?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return At(e)})(r):r;var{is:ie,defineProperty:re,getOwnPropertyDescriptor:oe,getOwnPropertyNames:ne,getOwnPropertySymbols:ae,getPrototypeOf:le}=Object,M=globalThis,St=M.trustedTypes,he=St?St.emptyScript:"",nt=M.reactiveElementPolyfillSupport,W=(r,t)=>r,at={toAttribute(r,t){switch(t){case Boolean:r=r?he:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch(s){e=null}}return e}},jt=(r,t)=>!ie(r,t),Et={attribute:!0,type:String,converter:at,reflect:!1,useDefault:!1,hasChanged:jt},Mt,Ct;(Mt=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(Ct=M.litPropertyMetadata)!=null||(M.litPropertyMetadata=new WeakMap);var E=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Et){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&re(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var o;let{get:i,set:n}=(o=oe(this.prototype,t))!=null?o:{get(){return this[e]},set(l){this[e]=l}};return{get:i,set(l){let a=i==null?void 0:i.call(this);n==null||n.call(this,l),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:Et}static _$Ei(){if(this.hasOwnProperty(W("elementProperties")))return;let t=le(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(W("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(W("properties"))){let e=this.properties,s=[...ne(e),...ae(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(ot(i))}else t!==void 0&&e.push(ot(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return kt(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:at).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n,o,l;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),d=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:at;this._$Em=i;let h=d.fromAttribute(e,a.type);this[i]=(l=h!=null?h:(o=this._$Ej)==null?void 0:o.get(i))!=null?l:h,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){var o,l;if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),s!=null||(s=a.getPropertyOptions(t)),!(((o=s.hasChanged)!=null?o:jt)(n,e)||s.useDefault&&s.reflect&&n===((l=this._$Ej)==null?void 0:l.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){var l,a,d;s&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=o!=null?o:e)!=null?a:this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((d=this._$Eq)!=null?d:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,l]of this._$Ep)this[o]=l;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,l]of n){let{wrapped:a}=l,d=this[o];a!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,l,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},Pt;E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[W("elementProperties")]=new Map,E[W("finalized")]=new Map,nt==null||nt({ReactiveElement:E}),((Pt=M.reactiveElementVersions)!=null?Pt:M.reactiveElementVersions=[]).push("2.1.2");var Y=globalThis,zt=r=>r,Q=Y.trustedTypes,Nt=Q?Q.createPolicy("lit-html",{createHTML:r=>r}):void 0,Lt="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,It="?"+C,de=`<${It}>`,T=document,V=()=>T.createComment(""),K=r=>r===null||typeof r!="object"&&typeof r!="function",_t=Array.isArray,ce=r=>_t(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",lt=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Tt=/-->/g,Ut=/>/g,z=RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ot=/'/g,Rt=/"/g,Bt=/^(?:script|style|textarea|title)$/i,ft=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),c=ft(1),O=ft(2),we=ft(3),U=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Ht=new WeakMap,N=T.createTreeWalker(T,129);function Wt(r,t){if(!_t(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Nt!==void 0?Nt.createHTML(t):t}var pe=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=q;for(let l=0;l<e;l++){let a=r[l],d,h,p=-1,v=0;for(;v<a.length&&(o.lastIndex=v,h=o.exec(a),h!==null);)v=o.lastIndex,o===q?h[1]==="!--"?o=Tt:h[1]!==void 0?o=Ut:h[2]!==void 0?(Bt.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=z):h[3]!==void 0&&(o=z):o===z?h[0]===">"?(o=i!=null?i:q,p=-1):h[1]===void 0?p=-2:(p=o.lastIndex-h[2].length,d=h[1],o=h[3]===void 0?z:h[3]==='"'?Rt:Ot):o===Rt||o===Ot?o=z:o===Tt||o===Ut?o=q:(o=z,i=void 0);let A=o===z&&r[l+1].startsWith("/>")?" ":"";n+=o===q?a+de:p>=0?(s.push(d),a.slice(0,p)+Lt+a.slice(p)+C+A):a+C+(p===-2?l:A)}return[Wt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},X=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,l=t.length-1,a=this.parts,[d,h]=pe(t,e);if(this.el=r.createElement(d,s),N.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=N.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Lt)){let v=h[o++],A=i.getAttribute(p).split(C),k=/([.?@])?(.*)/.exec(v);a.push({type:1,index:n,name:k[2],strings:A,ctor:k[1]==="."?ct:k[1]==="?"?pt:k[1]==="@"?ut:I}),i.removeAttribute(p)}else p.startsWith(C)&&(a.push({type:6,index:n}),i.removeAttribute(p));if(Bt.test(i.tagName)){let p=i.textContent.split(C),v=p.length-1;if(v>0){i.textContent=Q?Q.emptyScript:"";for(let A=0;A<v;A++)i.append(p[A],V()),N.nextNode(),a.push({type:2,index:++n});i.append(p[v],V())}}}else if(i.nodeType===8)if(i.data===It)a.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(C,p+1))!==-1;)a.push({type:7,index:n}),p+=C.length-1}n++}}static createElement(t,e){let s=T.createElement("template");return s.innerHTML=t,s}};function L(r,t,e=r,s){var o,l,a;if(t===U)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl,n=K(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=L(r,i._$AS(r,t.values),i,s)),t}var dt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var d;let{el:{content:e},parts:s}=this._$AD,i=((d=t==null?void 0:t.creationScope)!=null?d:T).importNode(e,!0);N.currentNode=i;let n=N.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new G(n,n.nextSibling,this,t):a.type===1?h=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(h=new gt(n,this,t)),this._$AV.push(h),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=T,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},G=class r{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var n;this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(n=i==null?void 0:i.isConnected)!=null?n:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=L(this,t,e),K(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==U&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ce(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&K(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){var n;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=X.createElement(Wt(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{let o=new dt(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ht.get(t.strings);return e===void 0&&Ht.set(t.strings,e=new X(t)),e}k(t){_t(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(V()),this.O(V()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=zt(t).nextSibling;zt(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=L(this,t,e,0),o=!K(t)||t!==this._$AH&&t!==U,o&&(this._$AH=t);else{let l=t,a,d;for(t=n[0],a=0;a<n.length-1;a++)d=L(this,l[s+a],e,a),d===U&&(d=this._$AH[a]),o||(o=!K(d)||d!==this._$AH[a]),d===u?t=u:t!==u&&(t+=(d!=null?d:"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},ct=class extends I{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},pt=class extends I{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},ut=class extends I{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){var o;if((t=(o=L(this,t,e,0))!=null?o:u)===U)return;let s=this._$AH,i=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==u&&(s===u||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},gt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){L(this,t)}};var ht=Y.litHtmlPolyfillSupport,Dt;ht==null||ht(X,G),((Dt=Y.litHtmlVersions)!=null?Dt:Y.litHtmlVersions=[]).push("3.3.3");var qt=(r,t,e)=>{var n,o;let s=(n=e==null?void 0:e.renderBefore)!=null?n:t,i=s._$litPart$;if(i===void 0){let l=(o=e==null?void 0:e.renderBefore)!=null?o:null;s._$litPart$=i=new G(t.insertBefore(V(),l),l,void 0,e!=null?e:{})}return i._$AI(r),i};var R=globalThis,P=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return U}},Yt;P._$litElement$=!0,P.finalized=!0,(Yt=R.litElementHydrateSupport)==null||Yt.call(R,{LitElement:P});var mt=R.litElementPolyfillSupport;mt==null||mt({LitElement:P});var Vt;((Vt=R.litElementVersions)!=null?Vt:R.litElementVersions=[]).push("4.2.2");var Xt=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-fleet ${Xt}`);var ue=r=>{let t={};for(let e of r||[])(t[e.feature]=t[e.feature]||[]).push(e);return t},Gt=r=>{if(r==null)return"";let t=Math.max(0,Math.round(r));return t<60?`${t}s`:`${Math.floor(t/60)}m ${t%60}s`},Kt=r=>r.alive?r.busy?`working ${Gt(r.elapsed)}`:r.edits&&r.edits.length?"idle \xB7 reported":"idle":"offline",ge=r=>(r||[]).filter(t=>t.alive).length,_e=r=>({user:"u",assistant:"a",tool:"t",out:"o",err:"e",think:"k",cmd:"c",screen:"s"})[r]||"o",j=1200,H=760,fe=(r,t,e=300)=>{let s=r.length,i={};if(r.forEach((_,f)=>{let g=f/Math.max(s,1)*Math.PI*2-Math.PI/2;i[_.id]={x:j/2+Math.cos(g)*j*.36,y:H/2+Math.sin(g)*H*.36}}),s<2)return i;let n=(t||[]).filter(([_,f])=>i[_]&&i[f]&&_!==f),o=Math.sqrt(j*H/s)*.9,l=j/8;for(let _=0;_<e;_++){let f={};for(let g of r)f[g.id]={x:0,y:0};for(let g=0;g<s;g++)for(let m=g+1;m<s;m++){let b=i[r[g].id],y=i[r[m].id],x=b.x-y.x,S=b.y-y.y,w=Math.hypot(x,S)||.01,$=o*o/w;x/=w,S/=w,f[r[g].id].x+=x*$,f[r[g].id].y+=S*$,f[r[m].id].x-=x*$,f[r[m].id].y-=S*$}for(let[g,m]of n){let b=i[g],y=i[m],x=b.x-y.x,S=b.y-y.y,w=Math.hypot(x,S)||.01,$=w*w/o;x/=w,S/=w,f[g].x-=x*$,f[g].y-=S*$,f[m].x+=x*$,f[m].y+=S*$}for(let g of r){let m=i[g.id],b=f[g.id];b.x+=(j/2-m.x)*.05,b.y+=(H/2-m.y)*.05;let y=Math.hypot(b.x,b.y)||.01,x=Math.min(y,l);m.x+=b.x/y*x,m.y+=b.y/y*x}l=Math.max(l*.96,1)}let a=r.map(_=>i[_.id].x),d=r.map(_=>i[_.id].y),h=Math.min(...a),p=Math.max(...a),v=Math.min(...d),A=Math.max(...d),k=110,D=70,Jt=(j-2*k)/Math.max(p-h,1),Ft=(H-2*D)/Math.max(A-v,1);for(let _ of r)i[_.id]={x:k+(i[_.id].x-h)*Jt,y:D+(i[_.id].y-v)*Ft};let bt=150;for(let _=0;_<40;_++){let f=!1;for(let g=0;g<s;g++)for(let m=g+1;m<s;m++){let b=i[r[g].id],y=i[r[m].id],x=y.x-b.x,S=y.y-b.y,w=Math.hypot(x,S)||.01;if(w>=bt)continue;let $=(bt-w)/2,vt=x/w,xt=S/w;b.x-=vt*$,b.y-=xt*$,y.x+=vt*$,y.y+=xt*$,f=!0}for(let g of r)i[g.id].x=Math.min(j-k,Math.max(k,i[g.id].x)),i[g.id].y=Math.min(H-D,Math.max(D,i[g.id].y));if(!f)break}return i},me=r=>{let t=String(r||"");if(t.length<=14)return[t];let e=t.indexOf(" & ")>=0?t.indexOf(" & ")+2:t.lastIndexOf(" ",16);return e>0?[t.slice(0,e).trim(),t.slice(e).trim()]:[t]},J=class extends P{constructor(){super(),this._projects=null,this._project=null,this._fleet=null,this._open=null,this._trans=null,this._drag=null,this._armed=!1,this._hover=null,this._err="",this._busy=!1,this._ship=!1,this._msg="",this._order="",this._mission="",this._deploying=null,this._have=0,this._shipNote=""}connectedCallback(){super.connectedCallback(),this._loadProjects(),this._timer=setInterval(()=>this._tick(),3e3),this._ttimer=setInterval(()=>this._pollTranscript(),2e3)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._timer),clearInterval(this._ttimer)}async _api(t,e={}){var o,l,a;let s=await this.hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=(o=s==null?void 0:s.response)==null?void 0:o.content;if(typeof i=="string")try{i=JSON.parse(i)}catch(d){}let n=(a=(l=s==null?void 0:s.response)==null?void 0:l.status)!=null?a:0;if(n<200||n>=300||(i==null?void 0:i.ok)===!1)throw new Error((i==null?void 0:i.detail)||(i==null?void 0:i.error)||`HTTP ${n}`);return i||{}}async _try(t){this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}}async _loadProjects(){let t=await this._try(()=>this._api("agent_fleet"));t&&(this._projects=t.projects||[])}async _tick(){if(this.hass)if(this._project){if(this._polling)return;this._polling=!0;try{let t=await this._api("agent_fleet",{project:this._project});this._fleet=t,this._err.startsWith("companion")&&(this._err="")}catch(t){this._err=(t==null?void 0:t.message)||String(t)}finally{this._polling=!1}}else this._loadProjects()}async _pollTranscript(){if(!(!this._open||!this.hass||this._tpolling)){this._tpolling=!0;try{let t=await this._api("agent_transcript",{id:this._open,have:String(this._have)});t.messages?(this._trans={messages:t.messages,activity:t.activity,ask:t.ask},this._have=t.bytes||0,this.updateComplete.then(()=>{var s;let e=(s=this.shadowRoot)==null?void 0:s.querySelector(".log");e&&(e.scrollTop=e.scrollHeight)})):this._trans&&(this._trans=$t(et({},this._trans),{activity:t.activity,ask:t.ask}))}catch(t){}finally{this._tpolling=!1}}}_enter(t){this._project=t,this._fleet=null,this._open=null,this._ship=!1,this._tick()}_leave(){this._project=null,this._fleet=null,this._open=null,this._loadProjects()}_openAgent(t){this._open=t,this._trans=null,this._have=0,this._order="",this._pollTranscript()}async _deploy(t){var i,n;if(this._deploying)return;this._armed=!1,this._deploying=t;let e=(this._mission||"").trim(),s=await this._try(()=>this._api("agent_fleet_act",et({action:"drop",project:this._project,feature:t},e?{mission:e}:{})));if(this._deploying=null,s){this._mission="";let o=(i=this.shadowRoot)==null?void 0:i.querySelector(".mission input");o&&(o.value=""),await this._tick(),(n=s.agent)!=null&&n.id&&this._openAgent(s.agent.id)}}_nodeAt(t,e){var i;let s=(i=this.shadowRoot)==null?void 0:i.elementFromPoint(t,e);return s?s.closest(".node"):null}_dragStart(t){if(!this._deploying){t.preventDefault();try{t.currentTarget.setPointerCapture(t.pointerId)}catch(e){}this._drag={x:t.clientX,y:t.clientY,moved:!1}}}_dragMove(t){if(!this._drag)return;let e=this._drag.moved||Math.hypot(t.clientX-this._drag.x,t.clientY-this._drag.y)>6;this._drag={x:t.clientX,y:t.clientY,moved:e};let s=e?this._nodeAt(t.clientX,t.clientY):null;this._hover=s?s.dataset.id:null}_dragEnd(t){if(!this._drag)return;let{moved:e}=this._drag,s=e?this._nodeAt(t.clientX,t.clientY):null;this._drag=null,this._hover=null,s?this._deploy(s.dataset.id):e||(this._armed=!this._armed)}_nodeTap(t){this._armed&&this._deploy(t.id)}async _sendOrder(){var s;let t=(this._order||"").trim();if(!t||!this._open)return;this._busy=!0;let e=await this._try(()=>this._api("agent_fleet_act",{action:"task",id:this._open,text:t}));if(this._busy=!1,e){this._order="";let i=(s=this.shadowRoot)==null?void 0:s.querySelector(".orders textarea");i&&(i.value=""),this._pollTranscript()}}async _answer(t){await this._try(()=>this._api("agent_key",{id:this._open,key:t})),this._pollTranscript()}async _recall(){this._open&&(this._busy=!0,await this._try(()=>this._api("agent_fleet_act",{action:"recall",id:this._open})),this._busy=!1,this._open=null,this._tick())}async _commit(t){var i;let e=(this._msg||"").trim();if(!e){this._err="a commit needs a message";return}this._busy=!0,this._shipNote="";let s=await this._try(()=>this._api("agent_fleet_act",{action:"commit",project:this._project,message:e}));if(s){this._shipNote=s.detail||"committed",this._msg="";let n=(i=this.shadowRoot)==null?void 0:i.querySelector(".shipbox input");n&&(n.value=""),t&&await this._push()}this._busy=!1,this._tick()}async _push(){this._busy=!0;let t=await this._try(()=>this._api("agent_fleet_act",{action:"push",project:this._project}));t&&(this._shipNote=t.detail||"pushed"),this._busy=!1,this._tick()}render(){var s;let t=this._fleet,e=(t==null?void 0:t.git)||{};return c`
      <div class="wrap">
        <div class="bar">
          ${this.narrow?c`<div class="menu"><ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button></div>`:u}
          <h1>
            Fleet
            ${this._project?c`<small>/ ${this._project}</small>`:u}
          </h1>
          ${this._project?c`
                <button @click=${this._leave}>◂ Projects</button>
                <span class="spacer"></span>
                <span class="pill">agents <b>${ge(t==null?void 0:t.agents)}</b></span>
                <span class="pill">branch <b>${e.branch||"\u2026"}</b></span>
                <span class="pill ${e.changed?"warn":""}">
                  changed <b>${(s=e.changed)!=null?s:"\u2026"}</b>${e.ahead?c` · ahead <b>${e.ahead}</b>`:u}
                </span>
                <button class=${e.changed?"go":""} @click=${()=>this._ship=!this._ship}>
                  ${this._ship?"Close":"Ship"}
                </button>
              `:c`<span class="spacer"></span><span class="pill">${Xt}</span>`}
        </div>
        ${this._err?c`<div class="err">${this._err}</div>`:u}
        ${this._project?this._renderStage(t):this._renderProjects()}
      </div>
      ${this._drag&&this._drag.moved?c`<div class="ghost" style="left:${this._drag.x}px;top:${this._drag.y}px"></div>`:u}
    `}_renderProjects(){return this._projects?this._projects.length?c`<div class="projects">
      ${this._projects.map(t=>c`
          <div class="proj" @click=${()=>this._enter(t.name)}>
            <h2>${t.name}</h2>
            <div class="path">${t.path.replace(/^\/Users\/[^/]+/,"~")}</div>
            ${t.agents?c`<div class="n">● ${t.agents} live</div>`:u}
          </div>
        `)}
    </div>`:c`<div class="empty">no git projects in the voice allowlist</div>`:c`<div class="empty">scanning…</div>`}_renderStage(t){var n;let e=ue(t==null?void 0:t.agents),s=(n=t==null?void 0:t.agents)==null?void 0:n.find(o=>o.id===this._open),i=!!this._open;return c`
      <div class="stage">
        <div class="left" ?hidden=${i&&this.narrow}>
          <div class="map">
            ${t?this._renderWeb(t,e):c`<div class="empty">mapping ${this._project}…</div>`}
          </div>
          ${this._renderBay()}
        </div>
        ${i?c`<div class="drawer ${this.narrow?"full":""}">${this._renderDrawer(s)}</div>`:u}
        ${this._ship?this._renderShip((t==null?void 0:t.git)||{}):u}
      </div>
    `}_positions(t){let e=t.features.map(s=>s.id).join(",")+"|"+(t.links||[]).length;return this._layoutKey!==e&&(this._layoutKey=e,this._layout=fe(t.features,t.links||[])),this._layout}_renderWeb(t,e){let s=this._positions(t),i=t.features,n=o=>{let l=e[o]||[];return{live:l.length>0,busy:l.some(a=>a.busy)}};return O`
      <svg viewBox="0 0 ${j} ${H}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowmag" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        ${(t.links||[]).map(([o,l])=>{let a=s[o],d=s[l];if(!a||!d)return u;let h=n(o),p=n(l),v=h.busy||p.busy?"edge busy":h.live||p.live?"edge live":"edge";return O`<line class=${v} x1=${a.x} y1=${a.y} x2=${d.x} y2=${d.y} />`})}
        ${i.map(o=>this._renderNode(o,e[o.id]||[],s[o.id]))}
      </svg>
    `}_renderNode(t,e,s){let i=e.some(a=>a.busy),n=["node",e.length?"live":"",i?"busy":"",this._hover===t.id||this._deploying===t.id?"target":"",this._armed?"armed":""].join(" "),o=me(t.name),l=22+Math.min(e.length,4)*2;return O`
      <g class=${n} data-id=${t.id} transform="translate(${s.x} ${s.y})" @click=${()=>this._nodeTap(t)}>
        <title>${t.blurb||t.name}</title>
        <circle class="halo" r=${l+6} />
        <circle class="hub" r=${l} />
        <circle class="core" r=${this._deploying===t.id?9:5} />
        ${o.map((a,d)=>O`<text y=${l+15+d*13}>${a}</text>`)}
        ${this._deploying===t.id?O`<text class="sub" y=${-l-8}>deploying…</text>`:e.map((a,d)=>{var k;let h=-Math.PI/2+(d-(e.length-1)/2)*1.1,p=l+24,v=Math.cos(h)*p,A=Math.sin(h)*p;return O`
                <g class="agent ${a.busy?"busy":""} ${a.alive?"":"off"}"
                   transform="translate(${v} ${A})"
                   @click=${D=>{D.stopPropagation(),this._openAgent(a.id)}}>
                  <title>${a.callsign}: ${Kt(a)}</title>
                  <circle r="12" fill="transparent" />
                  <circle class="eye" r="5" />
                  <text y="-9">${a.callsign}${(k=a.edits)!=null&&k.length?" "+a.edits.length:""}</text>
                </g>`})}
      </g>
    `}_renderBay(){return c`
      <div class="bay">
        <div class="label">Agent<br />bay</div>
        <div
          class="sprite ${this._armed?"armed":""}"
          @pointerdown=${this._dragStart}
          @pointermove=${this._dragMove}
          @pointerup=${this._dragEnd}
          @pointercancel=${()=>{this._drag=null,this._hover=null}}
        >
          ⬢
        </div>
        <div class="hint">
          ${this._deploying?c`<span class="deploying">opening a session…</span>`:this._armed?c`<b>armed</b> — tap a feature to deploy`:c`<b>drag</b> onto a feature to deploy an agent<br />default mission: hunt bugs, suggest features`}
        </div>
        <label class="mission">
          <input
            placeholder="custom mission (optional)"
            .value=${this._mission||""}
            @input=${t=>this._mission=t.target.value}
          />
        </label>
      </div>
    `}_renderDrawer(t){var n,o,l,a,d;if(!t)return c`<div class="head"><h2>signal lost</h2><button class="x" @click=${()=>this._open=null}>✕</button></div>`;let e=(n=this._fleet)==null?void 0:n.features.find(h=>h.id===t.feature),s=this._trans,i=t.busy?(s==null?void 0:s.activity)||`working for ${Gt(t.elapsed)}`:t.alive?"idle \u2014 awaiting orders":"offline";return c`
      <div class="head">
        <h2>${t.callsign}</h2>
        <div class="sub">${(e==null?void 0:e.name)||t.feature}<br />${t.id}</div>
        <button class="x" @click=${()=>this._open=null}>✕</button>
      </div>
      <div class="stat">
        <span class="pill ${t.busy?"warn":""}">${Kt(t)}</span>
        <span class="pill">edits <b>${((o=t.edits)==null?void 0:o.length)||0}</b></span>
        <button class="hot" ?disabled=${this._busy} @click=${this._recall}>Recall</button>
      </div>
      <div class="sec">
        <h4>Working on</h4>
        <div class="now">${i}</div>
      </div>
      <div class="sec">
        <h4>Done · files touched</h4>
        ${(l=t.edits)!=null&&l.length?c`<ul>${t.edits.map(h=>c`<li>${h}</li>`)}</ul>`:c`<div class="mission">nothing written yet</div>`}
      </div>
      <div class="sec">
        <h4>Mission</h4>
        <div class="mission">${t.mission}</div>
      </div>
      <div class="log">
        ${s?s.messages.map(h=>c`<div class="row ${_e(h.role)}">${h.text}</div>`):c`<div class="empty">reading transcript…</div>`}
        ${(d=(a=s==null?void 0:s.ask)==null?void 0:a.options)!=null&&d.length?c`<div class="orders" style="border:0;padding:0">
              ${s.ask.options.map(h=>c`<button @click=${()=>this._answer(String(h.key))}>${h.key} · ${h.label}</button>`)}
            </div>`:u}
      </div>
      <div class="orders">
        <textarea
          placeholder="orders for ${t.callsign}…"
          .value=${this._order}
          @input=${h=>this._order=h.target.value}
          @keydown=${h=>{h.key==="Enter"&&!h.shiftKey&&(h.preventDefault(),this._sendOrder())}}
        ></textarea>
        <button class="go" ?disabled=${this._busy||!(this._order||"").trim()} @click=${this._sendOrder}>Send</button>
      </div>
    `}_renderShip(t){var e;return c`
      <div class="shipbox">
        <h3>Ship · ${t.branch||"?"}</h3>
        ${t.error?c`<div class="err">${t.error}</div>`:u}
        <div class="mission">${t.last_commit||""}</div>
        <div class="files">
          ${(e=t.files)!=null&&e.length?t.files.map(s=>c`<div>${s}</div>`):c`<div style="opacity:.6">working tree clean</div>`}
        </div>
        <input
          placeholder="commit message"
          .value=${this._msg}
          @input=${s=>this._msg=s.target.value}
          @keydown=${s=>{s.key==="Enter"&&this._commit(!1)}}
        />
        <div class="btns">
          <button ?disabled=${this._busy||!t.changed} @click=${()=>this._commit(!1)}>Commit</button>
          <button class="go" ?disabled=${this._busy||!t.changed} @click=${()=>this._commit(!0)}>Commit &amp; push</button>
          <button ?disabled=${this._busy||!t.ahead} @click=${this._push}>Push${t.ahead?` (${t.ahead})`:""}</button>
        </div>
        ${this._shipNote?c`<div class="ok">${this._shipNote}</div>`:u}
      </div>
    `}};st(J,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_projects:{state:!0},_project:{state:!0},_fleet:{state:!0},_open:{state:!0},_trans:{state:!0},_drag:{state:!0},_armed:{state:!0},_hover:{state:!0},_err:{state:!0},_busy:{state:!0},_ship:{state:!0},_msg:{state:!0},_order:{state:!0},_deploying:{state:!0},_shipNote:{state:!0}}),st(J,"styles",rt`
    :host {
      --bg: #050912;
      --bg2: #0a1220;
      --line: rgba(0, 229, 255, 0.18);
      --cyan: #00e5ff;
      --mag: #ff2fd6;
      --amber: #ffb020;
      --green: #3dff9a;
      --red: #ff4d6d;
      --ink: #d8f4ff;
      --dim: #6f8ba3;
      --mono: "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
      display: block;
      height: 100vh;
      height: 100dvh;
      color: var(--ink);
      font: 14px/1.4 var(--mono);
      background: radial-gradient(ellipse at 50% -20%, #0c2a44 0%, var(--bg) 55%);
      overflow: hidden;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      box-sizing: border-box;
    }
    :host::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image: linear-gradient(var(--line) 1px, transparent 1px),
        linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(ellipse at center, #000 30%, transparent 85%);
      -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 85%);
    }
    :host::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.18) 0 2px, transparent 2px 4px);
      z-index: 5;
      opacity: 0.6;
    }
    * { box-sizing: border-box; }
    button {
      font: inherit;
      color: var(--cyan);
      background: rgba(0, 229, 255, 0.06);
      border: 1px solid var(--line);
      padding: 6px 12px;
      cursor: pointer;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 12px;
      transition: background 0.15s, box-shadow 0.15s;
    }
    button:hover { background: rgba(0, 229, 255, 0.14); box-shadow: 0 0 12px rgba(0, 229, 255, 0.25); }
    button:disabled { opacity: 0.4; cursor: default; box-shadow: none; }
    button.hot { color: var(--mag); border-color: rgba(255, 47, 214, 0.4); background: rgba(255, 47, 214, 0.08); }
    button.hot:hover { box-shadow: 0 0 12px rgba(255, 47, 214, 0.35); }
    button.go { color: #061a10; background: var(--green); border-color: var(--green); font-weight: 700; }
    button.go:hover { box-shadow: 0 0 16px rgba(61, 255, 154, 0.5); }
    input, textarea {
      font: inherit;
      color: var(--ink);
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--line);
      padding: 8px 10px;
      width: 100%;
      outline: none;
    }
    input:focus, textarea:focus { border-color: var(--cyan); box-shadow: 0 0 8px rgba(0, 229, 255, 0.25); }
    .wrap { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }

    /* top bar */
    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      padding-top: calc(10px + env(safe-area-inset-top, 0px));
      border-bottom: 1px solid var(--line);
      background: rgba(5, 9, 18, 0.7);
      backdrop-filter: blur(6px);
      flex-wrap: wrap;
    }
    .bar .menu { display: flex; align-items: center; }
    .bar h1 {
      margin: 0;
      font-size: 15px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--cyan);
      text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
      white-space: nowrap;
    }
    .bar h1 small { color: var(--dim); letter-spacing: 0.1em; font-size: 11px; margin-left: 8px; }
    .bar .spacer { flex: 1; }
    .pill {
      padding: 4px 10px;
      border: 1px solid var(--line);
      font-size: 11px;
      letter-spacing: 0.08em;
      color: var(--dim);
      white-space: nowrap;
    }
    .pill b { color: var(--ink); font-weight: 600; }
    .pill.warn { border-color: rgba(255, 176, 32, 0.5); color: var(--amber); }
    .pill.warn b { color: var(--amber); }
    .err {
      color: var(--red);
      font-size: 12px;
      padding: 6px 16px;
      border-bottom: 1px solid rgba(255, 77, 109, 0.3);
      background: rgba(255, 77, 109, 0.08);
    }

    /* project picker */
    .projects {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      padding: 24px 16px;
      align-content: start;
      overflow: auto;
    }
    .proj {
      border: 1px solid var(--line);
      background: linear-gradient(160deg, rgba(0, 229, 255, 0.07), rgba(0, 0, 0, 0.3));
      padding: 18px;
      cursor: pointer;
      position: relative;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .proj:hover { transform: translateY(-2px); box-shadow: 0 0 24px rgba(0, 229, 255, 0.25); border-color: var(--cyan); }
    .proj h2 { margin: 0 0 6px; font-size: 18px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cyan); }
    .proj .path { color: var(--dim); font-size: 11px; word-break: break-all; }
    .proj .n { position: absolute; top: 10px; right: 12px; color: var(--green); font-size: 12px; }
    .proj::before { content: "▸"; position: absolute; right: 12px; bottom: 10px; color: var(--dim); }

    /* map */
    .stage { flex: 1; display: flex; min-height: 0; position: relative; }
    .left { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 0; }
    .left[hidden] { display: none; }
    .map { flex: 1; min-height: 0; position: relative; }
    .map svg { width: 100%; height: 100%; display: block; }
    .edge { stroke: rgba(0, 229, 255, 0.22); stroke-width: 1.5; }
    .edge.live { stroke: rgba(61, 255, 154, 0.55); stroke-width: 2; }
    .edge.busy { stroke: var(--amber); stroke-dasharray: 6 8; animation: flow 1.2s linear infinite; }
    @keyframes flow { to { stroke-dashoffset: -28; } }
    .node { cursor: pointer; }
    .node .hub { fill: rgba(10, 18, 32, 0.95); stroke: rgba(0, 229, 255, 0.5); stroke-width: 1.5; transition: stroke 0.15s, r 0.15s; }
    .node .halo { fill: none; stroke: var(--cyan); stroke-width: 1; opacity: 0.25; }
    .node:hover .hub, .node.target .hub { stroke: var(--cyan); filter: url(#glow); }
    .node.live .hub { stroke: var(--green); }
    .node.live .halo { stroke: var(--green); opacity: 0.4; }
    .node.busy .halo { animation: ring 2.2s ease-out infinite; }
    .node.target .hub, .node.armed:hover .hub { stroke: var(--mag); stroke-width: 3; filter: url(#glowmag); }
    .node.target .halo { stroke: var(--mag); opacity: 0.8; }
    @keyframes ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.9); opacity: 0; } }
    .node .halo { transform-box: fill-box; transform-origin: center; }
    .node .core { fill: var(--cyan); opacity: 0.8; }
    .node.live .core { fill: var(--green); }
    .node text { fill: var(--ink); font: 600 12px var(--mono); letter-spacing: 0.06em; text-transform: uppercase; text-anchor: middle; pointer-events: none; }
    .node .sub { fill: var(--dim); font-size: 9px; font-weight: 400; text-transform: none; letter-spacing: 0; }
    .agent { cursor: pointer; }
    .agent .eye { fill: var(--green); filter: url(#glow); }
    .agent.busy .eye { fill: var(--amber); animation: blink 0.9s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    .agent.off .eye { fill: var(--dim); filter: none; }
    .agent text { fill: var(--green); font: 9px var(--mono); text-anchor: middle; letter-spacing: 0.08em; text-transform: uppercase; pointer-events: none; }
    .agent.busy text { fill: var(--amber); }
    .agent.off text { fill: var(--dim); }
    .agent:hover .eye { r: 7; }
    /* agent bay */
    .bay {
      flex: none;
      padding: 10px 16px;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      border-top: 1px solid var(--line);
      background: linear-gradient(0deg, rgba(5, 9, 18, 0.98), rgba(5, 9, 18, 0.8));
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .bay .label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); }
    .sprite {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid var(--mag);
      background: radial-gradient(circle at 35% 30%, #ff9de9, var(--mag) 45%, #4a0a3f 100%);
      box-shadow: 0 0 18px rgba(255, 47, 214, 0.6), inset 0 0 12px rgba(0, 0, 0, 0.5);
      cursor: grab;
      touch-action: none;
      display: grid;
      place-items: center;
      color: #fff;
      font-size: 20px;
      animation: hover 2.6s ease-in-out infinite;
      flex: none;
    }
    .sprite.armed { box-shadow: 0 0 0 4px rgba(255, 47, 214, 0.4), 0 0 30px rgba(255, 47, 214, 0.9); animation: none; }
    .sprite:active { cursor: grabbing; }
    @keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .ghost {
      position: fixed;
      width: 56px;
      height: 56px;
      margin: -28px 0 0 -28px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #ff9de9, var(--mag) 45%, #4a0a3f 100%);
      box-shadow: 0 0 24px rgba(255, 47, 214, 0.8);
      pointer-events: none;
      z-index: 50;
    }
    .bay .hint { font-size: 11px; color: var(--dim); line-height: 1.4; }
    .bay .hint b { color: var(--mag); }
    .bay .mission { flex: 1; min-width: 160px; }
    .bay .mission input { font-size: 12px; }
    .deploying { color: var(--mag); font-size: 12px; animation: blink 1s infinite; }

    /* agent drawer */
    .drawer {
      width: min(520px, 100%);
      border-left: 1px solid var(--line);
      background: rgba(5, 9, 18, 0.96);
      display: flex;
      flex-direction: column;
      min-height: 0;
      z-index: 4;
    }
    .drawer.full { position: absolute; inset: 0; width: 100%; }
    .drawer .head { padding: 12px 14px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 10px; }
    .drawer .head h2 { margin: 0; font-size: 15px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--green); text-shadow: 0 0 10px rgba(61, 255, 154, 0.5); }
    .drawer .head .sub { font-size: 11px; color: var(--dim); }
    .drawer .head .x { margin-left: auto; }
    .stat { display: flex; gap: 8px; padding: 8px 14px; flex-wrap: wrap; border-bottom: 1px solid var(--line); }
    .sec { padding: 10px 14px; border-bottom: 1px solid var(--line); }
    .sec h4 { margin: 0 0 6px; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); }
    .sec ul { margin: 0; padding: 0; list-style: none; font-size: 12px; }
    .sec li { padding: 2px 0; color: var(--ink); word-break: break-all; }
    .sec li::before { content: "◆ "; color: var(--green); }
    .sec .now { color: var(--amber); font-size: 12px; }
    .sec .mission { color: var(--dim); font-size: 11px; white-space: pre-wrap; }
    .log { flex: 1; overflow: auto; padding: 8px 14px; font-size: 12px; min-height: 120px; }
    .row { margin: 0 0 8px; white-space: pre-wrap; word-break: break-word; padding-left: 10px; border-left: 2px solid transparent; }
    .row.u { border-color: var(--mag); color: var(--ink); }
    .row.a { border-color: var(--green); }
    .row.t { border-color: var(--cyan); color: var(--cyan); opacity: 0.85; font-size: 11px; }
    .row.o, .row.s { color: var(--dim); font-size: 11px; max-height: 120px; overflow: hidden; }
    .row.e { color: var(--red); font-size: 11px; }
    .row.k { color: var(--dim); font-style: italic; font-size: 11px; }
    .row.c { color: var(--amber); font-size: 11px; }
    .orders { padding: 10px 14px; padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--line); display: flex; gap: 8px; flex-wrap: wrap; }
    .orders textarea { flex: 1 1 200px; min-height: 44px; resize: vertical; }

    /* ship panel */
    .shipbox {
      position: absolute;
      top: 0; right: 0;
      width: min(420px, 100%);
      max-height: 100%;
      overflow: auto;
      background: rgba(5, 9, 18, 0.97);
      border-left: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      padding: 14px;
      z-index: 6;
    }
    .shipbox h3 { margin: 0 0 8px; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cyan); }
    .shipbox .files { font-size: 11px; color: var(--dim); max-height: 200px; overflow: auto; margin: 8px 0; }
    .shipbox .files div::before { content: "± "; color: var(--amber); }
    .shipbox .btns { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
    .shipbox .ok { color: var(--green); font-size: 12px; margin-top: 8px; }
    .empty { color: var(--dim); font-size: 12px; padding: 24px; text-align: center; }
  `);customElements.define("hubbubb-fleet",J);export{H,j as W,Kt as agentState,ue as byFeature,Gt as fmtElapsed,fe as layout,ge as liveCount,_e as roleClass,me as splitName};
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
