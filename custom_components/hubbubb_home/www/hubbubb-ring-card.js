var ni=Object.defineProperty,ri=Object.defineProperties;var ai=Object.getOwnPropertyDescriptors;var rs=Object.getOwnPropertySymbols;var li=Object.prototype.hasOwnProperty,hi=Object.prototype.propertyIsEnumerable;var ke=(c,t,e)=>t in c?ni(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e,N=(c,t)=>{for(var e in t||(t={}))li.call(t,e)&&ke(c,e,t[e]);if(rs)for(var e of rs(t))hi.call(t,e)&&ke(c,e,t[e]);return c},gt=(c,t)=>ri(c,ai(t));var Nt=(c,t,e)=>ke(c,typeof t!="symbol"?t+"":t,e);var re=globalThis,ae=re.ShadowRoot&&(re.ShadyCSS===void 0||re.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Me=Symbol(),as=new WeakMap,qt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ae&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=as.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&as.set(e,t))}return t}toString(){return this.cssText}},ls=c=>new qt(typeof c=="string"?c:c+"",void 0,Me),Ae=(c,...t)=>{let e=c.length===1?c[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+c[o+1],c[0]);return new qt(e,c,Me)},hs=(c,t)=>{if(ae)c.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=re.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,c.appendChild(s)}},Se=ae?c=>c:c=>c instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ls(e)})(c):c;var{is:ci,defineProperty:di,getOwnPropertyDescriptor:pi,getOwnPropertyNames:ui,getOwnPropertySymbols:fi,getPrototypeOf:gi}=Object,_t=globalThis,cs=_t.trustedTypes,_i=cs?cs.emptyScript:"",Te=_t.reactiveElementPolyfillSupport,Wt=(c,t)=>c,Ee={toAttribute(c,t){switch(t){case Boolean:c=c?_i:null;break;case Object:case Array:c=c==null?c:JSON.stringify(c)}return c},fromAttribute(c,t){let e=c;switch(t){case Boolean:e=c!==null;break;case Number:e=c===null?null:Number(c);break;case Object:case Array:try{e=JSON.parse(c)}catch(s){e=null}}return e}},gs=(c,t)=>!ci(c,t),ds={attribute:!0,type:String,converter:Ee,reflect:!1,useDefault:!1,hasChanged:gs},ps,us;(ps=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(us=_t.litPropertyMetadata)!=null||(_t.litPropertyMetadata=new WeakMap);var ht=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ds){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&di(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var n;let{get:i,set:o}=(n=pi(this.prototype,t))!=null?n:{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let a=i==null?void 0:i.call(this);o==null||o.call(this,r),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:ds}static _$Ei(){if(this.hasOwnProperty(Wt("elementProperties")))return;let t=gi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Wt("properties"))){let e=this.properties,s=[...ui(e),...fi(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Se(i))}else t!==void 0&&e.push(Se(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return hs(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Ee).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var o,n,r;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)==null?void 0:o.fromAttribute)!==void 0?a.converter:Ee;this._$Em=i;let h=l.fromAttribute(e,a.type);this[i]=(r=h!=null?h:(n=this._$Ej)==null?void 0:n.get(i))!=null?r:h,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){var n,r;if(t!==void 0){let a=this.constructor;if(i===!1&&(o=this[t]),s!=null||(s=a.getPropertyOptions(t)),!(((n=s.hasChanged)!=null?n:gs)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){var r,a,l;s&&!((r=this._$Ej)!=null?r:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=n!=null?n:e)!=null?a:this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,r]of o){let{wrapped:a}=r,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,r,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},fs;ht.elementStyles=[],ht.shadowRootOptions={mode:"open"},ht[Wt("elementProperties")]=new Map,ht[Wt("finalized")]=new Map,Te==null||Te({ReactiveElement:ht}),((fs=_t.reactiveElementVersions)!=null?fs:_t.reactiveElementVersions=[]).push("2.1.2");var Vt=globalThis,_s=c=>c,le=Vt.trustedTypes,ms=le?le.createPolicy("lit-html",{createHTML:c=>c}):void 0,Pe="$lit$",ct=`lit$${Math.random().toFixed(9).slice(2)}$`,Re="?"+ct,mi=`<${Re}>`,wt=document,Kt=()=>wt.createComment(""),Qt=c=>c===null||typeof c!="object"&&typeof c!="function",ze=Array.isArray,ks=c=>ze(c)||typeof(c==null?void 0:c[Symbol.iterator])=="function",Ce=`[ 	
\f\r]`,Ft=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bs=/-->/g,vs=/>/g,bt=RegExp(`>|${Ce}(?:([^\\s"'>=/]+)(${Ce}*=${Ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ws=/'/g,ys=/"/g,Ms=/^(?:script|style|textarea|title)$/i,Ie=c=>(t,...e)=>({_$litType$:c,strings:t,values:e}),v=Ie(1),Ct=Ie(2),Bi=Ie(3),tt=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),xs=new WeakMap,vt=wt.createTreeWalker(wt,129);function As(c,t){if(!ze(c)||!c.hasOwnProperty("raw"))throw Error("invalid template strings array");return ms!==void 0?ms.createHTML(t):t}var Ss=(c,t)=>{let e=c.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=Ft;for(let r=0;r<e;r++){let a=c[r],l,h,p=-1,u=0;for(;u<a.length&&(n.lastIndex=u,h=n.exec(a),h!==null);)u=n.lastIndex,n===Ft?h[1]==="!--"?n=bs:h[1]!==void 0?n=vs:h[2]!==void 0?(Ms.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=bt):h[3]!==void 0&&(n=bt):n===bt?h[0]===">"?(n=i!=null?i:Ft,p=-1):h[1]===void 0?p=-2:(p=n.lastIndex-h[2].length,l=h[1],n=h[3]===void 0?bt:h[3]==='"'?ys:ws):n===ys||n===ws?n=bt:n===bs||n===vs?n=Ft:(n=bt,i=void 0);let f=n===bt&&c[r+1].startsWith("/>")?" ":"";o+=n===Ft?a+mi:p>=0?(s.push(l),a.slice(0,p)+Pe+a.slice(p)+ct+f):a+ct+(p===-2?r:f)}return[As(c,o+(c[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Gt=class c{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,r=t.length-1,a=this.parts,[l,h]=Ss(t,e);if(this.el=c.createElement(l,s),vt.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=vt.nextNode())!==null&&a.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Pe)){let u=h[n++],f=i.getAttribute(p).split(ct),g=/([.?@])?(.*)/.exec(u);a.push({type:1,index:o,name:g[2],strings:f,ctor:g[1]==="."?ce:g[1]==="?"?de:g[1]==="@"?pe:xt}),i.removeAttribute(p)}else p.startsWith(ct)&&(a.push({type:6,index:o}),i.removeAttribute(p));if(Ms.test(i.tagName)){let p=i.textContent.split(ct),u=p.length-1;if(u>0){i.textContent=le?le.emptyScript:"";for(let f=0;f<u;f++)i.append(p[f],Kt()),vt.nextNode(),a.push({type:2,index:++o});i.append(p[u],Kt())}}}else if(i.nodeType===8)if(i.data===Re)a.push({type:2,index:o});else{let p=-1;for(;(p=i.data.indexOf(ct,p+1))!==-1;)a.push({type:7,index:o}),p+=ct.length-1}o++}}static createElement(t,e){let s=wt.createElement("template");return s.innerHTML=t,s}};function yt(c,t,e=c,s){var n,r,a;if(t===tt)return t;let i=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl,o=Qt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((r=i==null?void 0:i._$AO)==null||r.call(i,!1),o===void 0?i=void 0:(i=new o(c),i._$AT(c,e,s)),s!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=yt(c,i._$AS(c,t.values),i,s)),t}var he=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var l;let{el:{content:e},parts:s}=this._$AD,i=((l=t==null?void 0:t.creationScope)!=null?l:wt).importNode(e,!0);vt.currentNode=i;let o=vt.nextNode(),n=0,r=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new Et(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new ue(o,this,t)),this._$AV.push(h),a=s[++r]}n!==(a==null?void 0:a.index)&&(o=vt.nextNode(),n++)}return vt.currentNode=wt,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Et=class c{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var o;this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=yt(this,t,e),Qt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ks(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&Qt(this._$AH)?this._$AA.nextSibling.data=t:this.T(wt.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Gt.createElement(As(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{let n=new he(i,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=xs.get(t.strings);return e===void 0&&xs.set(t.strings,e=new Gt(t)),e}k(t){ze(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new c(this.O(Kt()),this.O(Kt()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=_s(t).nextSibling;_s(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},xt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=x}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=yt(this,t,e,0),n=!Qt(t)||t!==this._$AH&&t!==tt,n&&(this._$AH=t);else{let r=t,a,l;for(t=o[0],a=0;a<o.length-1;a++)l=yt(this,r[s+a],e,a),l===tt&&(l=this._$AH[a]),n||(n=!Qt(l)||l!==this._$AH[a]),l===x?t=x:t!==x&&(t+=(l!=null?l:"")+o[a+1]),this._$AH[a]=l}n&&!i&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},ce=class extends xt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},de=class extends xt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},pe=class extends xt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var n;if((t=(n=yt(this,t,e,0))!=null?n:x)===tt)return;let s=this._$AH,i=t===x&&s!==x||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==x&&(s===x||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},ue=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){yt(this,t)}},Ts={M:Pe,P:ct,A:Re,C:1,L:Ss,R:he,D:ks,V:yt,I:Et,H:xt,N:de,U:pe,B:ce,F:ue},je=Vt.litHtmlPolyfillSupport,$s;je==null||je(Gt,Et),(($s=Vt.litHtmlVersions)!=null?$s:Vt.litHtmlVersions=[]).push("3.3.3");var Es=(c,t,e)=>{var o,n;let s=(o=e==null?void 0:e.renderBefore)!=null?o:t,i=s._$litPart$;if(i===void 0){let r=(n=e==null?void 0:e.renderBefore)!=null?n:null;s._$litPart$=i=new Et(t.insertBefore(Kt(),r),r,void 0,e!=null?e:{})}return i._$AI(c),i};var $t=globalThis,dt=class extends ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Es(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}},Cs;dt._$litElement$=!0,dt.finalized=!0,(Cs=$t.litElementHydrateSupport)==null||Cs.call($t,{LitElement:dt});var Oe=$t.litElementPolyfillSupport;Oe==null||Oe({LitElement:dt});var js;((js=$t.litElementVersions)!=null?js:$t.litElementVersions=[]).push("4.2.2");var kt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ps=c=>(...t)=>({_$litDirective$:c,values:t}),fe=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Zi}=Ts;var Rs=c=>c.strings===void 0;var bi={},zs=(c,t=bi)=>c._$AH=t;var Le=Ps(class extends fe{constructor(c){if(super(c),c.type!==kt.PROPERTY&&c.type!==kt.ATTRIBUTE&&c.type!==kt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Rs(c))throw Error("`live` bindings can only contain a single expression")}render(c){return c}update(c,[t]){if(t===tt||t===x)return t;let e=c.element,s=c.name;if(c.type===kt.PROPERTY){if(t===e[s])return tt}else if(c.type===kt.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(s))return tt}else if(c.type===kt.ATTRIBUTE&&e.getAttribute(s)===t+"")return tt;return zs(c),t}});function Is(c,t,e){let s=Math.max(1,Math.round(t/e)),i=new Float32Array(Math.ceil(c.length/s)),o=1e-6;for(let n=0,r=0;n<c.length;n+=s,r++){let a=Math.min(c.length,n+s),l=0;for(let p=n;p<a;p++)l+=c[p]*c[p];let h=Math.sqrt(l/(a-n));i[r]=h,h>o&&(o=h)}for(let n=0;n<i.length;n++)i[n]=Math.min(1,i[n]/o);return i}function Os(c,t){let e=c/t,s=0,i=0;return o=>{let n=o.length,r=new Int16Array(Math.max(0,Math.ceil((n-s)/e))),a=0;for(;s<n;s+=e){let l=Math.floor(s),h=l<0?i:o[l],p=l+1<n?o[l+1]:h,u=Math.max(-1,Math.min(1,h+(p-h)*(s-l)));r[a++]=u<0?u*32768:u*32767}return s-=n,i=n?o[n-1]:i,a===r.length?r:r.subarray(0,a)}}var vi=/(^|[^\w:/@.~-])((?:~|\.{1,2})?\/[\w.@~-]+(?:\/[\w.@~-]+)*|[\w.@-]+(?:\/[\w.@-]+)+\.\w+)(:\d+)?/g;function Be(c){let t=[],e=0;for(let s of c.matchAll(vi)){let i=s[2],o=s[3]||"",n=s.index+s[1].length;for(;/[.,;]$/.test(i);)i=i.slice(0,-1);n>e&&t.push(c.slice(e,n)),t.push({path:i,line:o}),e=n+i.length+o.length}return e<c.length&&t.push(c.slice(e)),t}function Ue(c){return Be(c.replace(/\[Image #\d+\]/g," ")).filter(t=>typeof t=="string").join(" ").split(/\s+/).join(" ").trim().slice(0,200)}function He(c,t=2,e=1,s=.06,i=1.04){for(let o=0;o<t;o++)for(let n=0;n<c.length;n++){let r=c[n];if(!(!r.held||r.pop>=0))for(let a=n+1;a<c.length;a++){let l=c[a];if(!l.held||l.pop>=0)continue;let h=l.x-r.x,p=l.y-r.y,u=Math.hypot(h,p);u<.001&&(h=.1,p=0,u=.1);let f=r.r+l.r,g=h/u,b=p/u;if(u<f){let _=(f-u)*.5*e;r.x-=g*_,r.y-=b*_,l.x+=g*_,l.y+=b*_}else if(s>0&&u>f*i&&u<f*1.5){let _=(u-f)*s;r.x+=g*_,r.y+=b*_,l.x-=g*_,l.y-=b*_}}}return c}function De(c,t,e,s){for(let i of c){if(!i.held||i.pop>=0)continue;let o=i.x-t,n=i.y-e,r=Math.hypot(o,n);r<.001&&(o=1,n=0,r=1);let a=s+i.r;if(r<a){let l=o/r,h=n/r;i.x=t+l*a,i.y=e+h*a;let p=i.vx*l+i.vy*h;p<0&&(i.vx-=p*l,i.vy-=p*h)}}return c}function Ne(c,t,e,s,i=1){for(let o of c){if(!o.held||o.pop>=0||!o.anchor)continue;let n=o.x-t,r=o.y-e,a=Math.hypot(n,r);a<.001&&(n=1,r=0,a=1);let l=n/a,h=r/a,p=s+o.r;o.x+=(t+l*p-o.x)*i,o.y+=(e+h*p-o.y)*i;let u=o.vx*l+o.vy*h;o.vx-=u*l,o.vy-=u*h}return c}function Ls(c,t,e){let s=Math.PI*2;if(!c.length)return{angle:0,gap:s};let i=c.map(r=>Math.atan2(r.y-e,r.x-t)).sort((r,a)=>r-a),o=-1,n=0;for(let r=0;r<i.length;r++){let a=i[r],h=(r+1<i.length?i[r+1]:i[0]+s)-a;h>o&&(o=h,n=a+h/2)}return{angle:n,gap:o}}function Bs(c,t){let{dt:e,rate:s,maxRatio:i,maxR:o,sizeBias:n=0,rand:r=Math.random}=t,a=0;for(let l=0;l<c.length;l++){let h=c[l];if(!(!h.held||h.pop>=0||h.gone))for(let p=l+1;p<c.length;p++){let u=c[p];if(!u.held||u.pop>=0||u.gone||Math.hypot(u.x-h.x,u.y-h.y)>h.r+u.r+1||(h.r>=u.r?h.r/u.r:u.r/h.r)>i)continue;let b=Math.sqrt(h.r*h.r+u.r*u.r);if(b>o)continue;let _=Math.min(h.r,u.r),M=n?Math.pow(Math.min(1,_/o),1/n):1;if(r()>s*M*e)continue;let m=h.r>=u.r?h:u,w=m===h?u:h,k=m.r*m.r,y=w.r*w.r,$=k+y;if(m.x=(m.x*k+w.x*y)/$,m.y=(m.y*k+w.y*y)/$,m.vx=(m.vx*k+w.vx*y)/$,m.vy=(m.vy*k+w.vy*y)/$,m.r=b,m.full=b,m.age=0,w.gone=!0,a++,m!==h)break}}if(a)for(let l=c.length-1;l>=0;l--)c[l].gone&&c.splice(l,1);return a}function qe(c,t,e,s,i=2,o=1){let n=c.filter(r=>r.held&&!(r.pop>=0)&&r.anchor);if(n.length<2)return c;for(let r=0;r<i;r++)for(let a=0;a<n.length;a++)for(let l=a+1;l<n.length;l++){let h=n[a],p=n[l],u=s+h.r,f=s+p.r,g=Math.atan2(h.y-e,h.x-t),b=Math.atan2(p.y-e,p.x-t),_=b-g;for(;_>Math.PI;)_-=Math.PI*2;for(;_<-Math.PI;)_+=Math.PI*2;let M=Math.sqrt(u*u+f*f-2*u*f*Math.cos(_)),m=h.r+p.r;if(M>=m)continue;let w=(u+f)/2,k=(m-M)/w*.5*o,y=_>=0?1:-1,$=g-y*k,T=b+y*k;h.x=t+Math.cos($)*u,h.y=e+Math.sin($)*u,p.x=t+Math.cos(T)*f,p.y=e+Math.sin(T)*f}return c}function Us(c,t){let{dt:e,maxR:s,rand:i=Math.random}=t,o=c.r/s;if(c.r>=s*.995||c.age>c.span*(.55+1.7*o))return!0;let n=o>.7?.5*Math.pow(o,6):0;return n>0&&i()<n*e}var Qs=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-ring-card ${Qs}`);var wi="4.12.0",_e="assist_satellite",yi=["idle","listening","processing","responding"],We={size:240,background:"dark",particles:0,particle_size:1,follow_media_player:!0,audio_offset:0,idle_color:"#2e9df5",listening_color:"#00ff88",processing_color:"#ffaa33",responding_color:"#00e5ff",offline_color:"#4a5560",build_entity:"",build_scope:"device",build_dashboard:"",build_page:!1,build_return:"/",build_projects:[],animation:"hubbubb",assistant_name:"Assistant",panel_height:0,panel_fullscreen:!1,panel_bg:"",panel_border:"",panel_text:"",terminal_bg:"",terminal_text:"",honeycomb:!0,tap_message:"Yes?",dock:!0,calendar_path:"/calendar",intro_message:"",todos:!0,todo_entities:[],announce_entity:"",messages_entity:""},Hs=(c,t)=>{let e=Math.round(t*Gs);return e<0||e>=c.length?0:c[e]},mt=16,Gs=50,Ds={idle:"idle_color",listening:"listening_color",processing:"processing_color",responding:"responding_color"},Ns={idle:{swirl:.95,bright:1.75,radius:0,amp:1,turb:.4,sweep:0,speech:0},listening:{swirl:1.8,bright:1.8,radius:-.012,amp:1.15,turb:.6,sweep:.35,speech:0},processing:{swirl:.95,bright:1.5,radius:0,amp:1,turb:.3,sweep:1,speech:0},responding:{swirl:1.5,bright:1.55,radius:.006,amp:1.15,turb:1,sweep:.12,speech:1},offline:{swirl:.3,bright:.4,radius:-.012,amp:.5,turb:.15,sweep:0,speech:0}},xi=new Set(["tool","out","err","screen","cmd"]),$i=c=>/^\$ /.test(c)?"l-cmd":/^\+/.test(c)?"l-add":/^- /.test(c)||/^--- /.test(c)?"l-del":/\b(error|errno|failed|failure|fatal|traceback|exception|refused|denied|not found|no such)\b/i.test(c)?"l-err":/\b(warn|warning|deprecat\w+|skipped)\b/i.test(c)?"l-warn":/^(Edit|Write|Read|Grep|Glob|Agent|Task|WebFetch|WebSearch|TodoWrite|Skill)\b/.test(c)?"l-tool":"",ki=/`([^`\n]+)`|\*\*([^*\n]+)\*\*/g,Fe=(c,t,e)=>c.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),Mi={1:"can't reach Home Assistant",2:"invalid authentication",3:"connection lost \u2014 reconnecting",4:"no Home Assistant host",5:"https/http mismatch"};var mo=Math.PI/180,F=(c,t,e)=>Math.min(e,Math.max(t,c)),Ve=c=>Math.round(c*100)/100,Ot=c=>{let t=c>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},Ai=c=>{let t=(1+Math.sqrt(5))/2,e=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(([a,l,h])=>{let p=Math.hypot(a,l,h);return[a/p,l/p,h/p]}),s=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=new Map,o=(a,l)=>{let h=a<l?`${a}_${l}`:`${l}_${a}`,p=i.get(h);if(p!==void 0)return p;let[u,f,g]=e[a],[b,_,M]=e[l],m=(u+b)/2,w=(f+_)/2,k=(g+M)/2,y=Math.hypot(m,w,k);return e.push([m/y,w/y,k/y]),i.set(h,e.length-1),e.length-1};for(let a=0;a<c;a++){let l=[];for(let[h,p,u]of s){let f=o(h,p),g=o(p,u),b=o(u,h);l.push([h,f,b],[p,g,f],[u,b,g],[f,g,b])}s=l}let n=new Set,r=[];for(let a of s)for(let l=0;l<3;l++){let h=a[l],p=a[(l+1)%3],u=h<p?h*1e5+p:p*1e5+h;n.has(u)||(n.add(u),r.push(h,p))}return{verts:e,edges:r}},Ke=Ai(3),Si=(()=>{let c=Ot(11073),t=Ke.verts.length,e=[];for(let s=0;s<16;s++)e.push({v:Math.floor(c()*t),tw:.5+c()*1.6,ph:c()*6.28});return e})(),jt=96,qs=.55,Ws=.45,ge=[{r:.625,amp:.068,thick:.007,rev:-.8,share:.21,glow:.72},{r:.655,amp:.075,thick:.008,rev:-.8,share:.21,glow:.85},{r:.845,amp:.082,thick:.009,rev:1,share:.3,glow:1.2},{r:.875,amp:.09,thick:.008,rev:1,share:.28,glow:1.4}],pt=[{r:.91,w:.06,share:.42,dir:1,rows:11},{r:.872,w:.045,share:.36,dir:-1,rows:9},{r:.8,w:.012,share:.22,dir:1,rows:3}],it=256,Pt=[{k:2,a:.5},{k:3,a:.35},{k:4,a:.22},{k:5,a:.14},{k:7,a:.1},{k:9,a:.07}],Rt=[{m:1,a:.6},{m:2,a:.45},{m:3,a:.3}],Yt={dot:.5,reactor:1.1,burst:3.5,word:4.7,hold:5.7,gone:6.3,end:6.9},zt=128,Ti=(()=>{let c=Ot(51729),t=[];for(let e=0;e<5;e++)t.push({a:c()*Math.PI*2,w:(.08+c()*.22)*(e%2?-1:1),sg:.2+c()*.3,h:.6+c()*.7,f:.25+c()*.6,ph:c()*Math.PI*2});return t})(),Ys=(()=>{let t=Math.sqrt(3)*5,e=(s,i)=>{let o="";for(let n=0;n<6;n++){let r=n*60*Math.PI/180;o+=`${n===0?"M":"L"}${Ve(s+5*Math.cos(r))} ${Ve(i+5*Math.sin(r))}`}return o+"Z"};return[e(0,0),e(3*5,0),e(0,t),e(3*5,t),e(1.5*5,t/2)].join("")})(),Lt={w:15,h:Ve(Math.sqrt(3)*5)},Fs=.62,Vs=3e3,Ei=1e12,Ci=c=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${Lt.w}" height="${Lt.h}" viewBox="0 0 ${Lt.w} ${Lt.h}"><path d="${Ys}" fill="none" stroke="${c}" stroke-width="0.35"/></svg>`)+'")',Ks=c=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c).trim());if(t){let s=t[1];s.length===3&&(s=s.split("").map(o=>o+o).join(""));let i=parseInt(s,16);return[i>>16&255,i>>8&255,i&255]}let e=/rgba?\(([^)]+)\)/i.exec(String(c));if(e){let s=e[1].split(",").map(i=>parseFloat(i));return[s[0]|0,s[1]|0,s[2]|0]}return[53,224,255]},It=class extends dt{set hass(t){var p,u,f,g,b,_,M,m;if(this._hass=t,!this._config)return;this._linked||(this._linked=!0,this._openLinked());let e=(p=t==null?void 0:t.states)==null?void 0:p[this._config.entity],s=e?e.state:"unavailable",i=this._state;if(s!==this._state&&(this._state=s),this._config.build_entity&&this._config.build_scope==="global"){let w=((f=(u=t==null?void 0:t.states)==null?void 0:u[this._config.build_entity])==null?void 0:f.state)==="on";this._config.build_page?(this._entityOn&&!w&&this._navigate(this._config.build_return),this._entityOn=w):w!==this._build&&this._setBuild(w,!1)}this._listenForSpeech(t),this._watchTodos(t);let o=(g=t==null?void 0:t.states)==null?void 0:g[this._config.announce_entity],n=o?o.state==="on":null;n!==this._announce&&(this._announce=n);let r=(b=t==null?void 0:t.states)==null?void 0:b[this._config.messages_entity],a=r?r.state==="on":null;a!==this._messages&&(this._messages=a);let l=this._config.follow_media_player?this._resolveMediaPlayer(t):null,h=l?(M=(_=t==null?void 0:t.states)==null?void 0:_[l])==null?void 0:M.state:void 0;h!==this._mp&&(this._mp=h),this._audioSync(l?(m=t==null?void 0:t.states)==null?void 0:m[l]:null),this._state==="responding"&&i!=="responding"&&this._grabTtsUrl(),this._sessTimer||(this._sessTimer=setInterval(()=>this._pollSessions(),12e3),this._pollSessions())}_trackDone(t){this._unread||(this._unread=new Set(this._recall("unread",24*3600*1e3)||[]),this._wasBusy=new Map);let e=new Set;for(let i of t){e.add(i.id);let o=this._build&&this._sel===i.id;i.busy||o?this._unread.delete(i.id):this._wasBusy.get(i.id)&&this._unread.add(i.id),this._wasBusy.set(i.id,!!i.busy),i.done=this._unread.has(i.id)}for(let i of[...this._unread])e.has(i)||this._unread.delete(i);for(let i of[...this._wasBusy.keys()])e.has(i)||this._wasBusy.delete(i);let s=[...this._unread].sort().join(",");return s!==this._unreadKey&&(this._unreadKey=s,this._store("unread",[...this._unread])),t}_settle(t,e){JSON.stringify(e)!==JSON.stringify(this[t])&&(this[t]=e)}async _pollSessions(){if(!(this._build||this._onScreen===!1||!this._hass))try{let t=await this._api("agent_status");this._settle("_sessions",this._trackDone(t.sessions||[])),t.projects&&this._settle("_projects",t.projects)}catch(t){}}_resolveMediaPlayer(t){var i,o,n;if(this._config.media_player)return this._config.media_player;if(this._mpResolved!==void 0)return this._mpResolved;let e=null,s=(o=(i=t==null?void 0:t.entities)==null?void 0:i[this._config.entity])==null?void 0:o.device_id;if(s&&t.entities){for(let r in t.entities)if(r.startsWith("media_player.")&&t.entities[r].device_id===s){e=r;break}}if(!e){let a=`media_player.${this._config.entity.split(".")[1].replace(/_assist_satellite$/,"")}_media_player`;(n=t==null?void 0:t.states)!=null&&n[a]&&(e=a)}return this._mpResolved=e,e}_effectiveState(){if(this._voiceState)return this._voiceState==="responding"&&this._envEl&&!this._envEl.currentTime?"processing":this._voiceState;let t=yi.includes(this._state)?this._state:"offline",e=this._speechRaw(t);return this._speaking(e)?"responding":e||t==="responding"?"processing":t}_speechRaw(t){let e=this._mp;return e==="playing"?t!=="listening":e==="idle"||e==="paused"?!1:t==="responding"}_speaking(t){var i;let e=Math.max(0,-(Number(this._config.audio_offset)||0));if(!e)return t;let s=performance.now()/1e3;return t!==this._spkRaw&&(this._spkRaw=t,this._spkAt=s),s-((i=this._spkAt)!=null?i:-1e9)<e?!t:t}get hass(){return this._hass}get _name(){var t;return((t=this._config)==null?void 0:t.assistant_name)||"Assistant"}setConfig(t){if(!t||!t.entity)throw new Error("hubbubb-ring-card: you need to define an `entity`");if(t.entity.split(".")[0]!==_e)throw new Error(`hubbubb-ring-card: entity must be in the ${_e} domain`);this._config=N(N({},We),t),this._particles=null,this._mpResolved=void 0,t.build_page&&this._setBuild(!0,!1),this._hass&&(this.hass=this._hass)}getCardSize(){var t,e;return Math.max(2,Math.ceil(Number((e=(t=this._config)==null?void 0:t.size)!=null?e:240)/50))}getGridOptions(){return{rows:"auto",columns:12,min_rows:2,min_columns:6}}_cardVars(t){let e=this._config,s=o=>Number(o)>0?`${Number(o)}px`:"",i={"--jr-size":`${Number(e.size)}px`,"--jr-color":t,"--jr-panel-h":e.panel_height==="fill"?"100%":s(e.panel_height),"--jr-panel-bg":e.panel_bg,"--jr-panel-border":e.panel_border,"--jr-panel-text":e.panel_text,"--jr-term-bg":e.terminal_bg,"--jr-term-text":e.terminal_text};return Object.entries(i).filter(([,o])=>o).map(([o,n])=>`${o}:${n}`).join(";")}static getConfigElement(){return document.createElement("hubbubb-ring-card-editor")}static getStubConfig(t){var r,a;let e=Object.keys((r=t==null?void 0:t.states)!=null?r:{}),s=l=>{var h;return(h=e.find(p=>p.startsWith("switch.")&&p.endsWith(l)))!=null?h:""},i=s("_build_mode"),n=i.slice(7,-11).split("_").filter(Boolean).map(l=>l[0].toUpperCase()+l.slice(1)).join(" ");return N(N(N(N({type:"custom:hubbubb-ring-card",entity:(a=e.find(l=>l.split(".")[0]===_e))!=null?a:""},n&&{assistant_name:n}),i&&{build_entity:i}),s("_agent_announcements")&&{announce_entity:s("_agent_announcements")}),s("_message_watch")&&{messages_entity:s("_message_watch")})}connectedCallback(){var t,e,s,i,o;super.connectedCallback(),this._onVisibility=()=>this._pump(),(t=document.addEventListener)==null||t.call(document,"visibilitychange",this._onVisibility),this._onHide=()=>{this._saveDraft(),this._saveQueue()},(e=window.addEventListener)==null||e.call(window,"pagehide",this._onHide),this._onFirstTap=()=>this._unlockSpeech(),(s=this.addEventListener)==null||s.call(this,"pointerdown",this._onFirstTap,{once:!0}),this._onActivity=()=>this._lastTouch=Date.now(),(i=window.addEventListener)==null||i.call(window,"pointerdown",this._onActivity,!0),(o=window.addEventListener)==null||o.call(window,"keydown",this._onActivity,!0),this._restoreQueue(),this._build&&this._setBuild(!0,!1)}disconnectedCallback(){var t,e,s,i,o,n,r;for(let a of this._speechUnsubs||[])try{a()}catch(l){}this._speechUnsubs=[],this._speechSub=!1,this._onActivity&&((t=window.removeEventListener)==null||t.call(window,"pointerdown",this._onActivity,!0),(e=window.removeEventListener)==null||e.call(window,"keydown",this._onActivity,!0),this._onActivity=null),this._onFirstTap&&((s=this.removeEventListener)==null||s.call(this,"pointerdown",this._onFirstTap),this._onFirstTap=null),super.disconnectedCallback(),this._saveDraft(),this._saveQueue(),this._lockScroll(!1),(i=document.removeEventListener)==null||i.call(document,"visibilitychange",this._onVisibility),(o=window.removeEventListener)==null||o.call(window,"pagehide",this._onHide),this._stop(),this._stopPolling(),this._stopLocalVoice(),clearInterval(this._sessTimer),this._sessTimer=null,(n=this._io)==null||n.disconnect(),(r=this._ro)==null||r.disconnect(),this._io=this._ro=null,this._canvas=null,this._ctx=null}_navigate(t){!t||location.pathname.startsWith(t.split("?")[0])||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")))}_listenForSpeech(t){if(this._speechSub||!(t!=null&&t.connection))return;this._speechSub=!0;let e=i=>i.then(o=>(this._speechUnsubs||(this._speechUnsubs=[])).push(o)).catch(()=>{for(let o of this._speechUnsubs||[])try{o()}catch(n){}this._speechUnsubs=[],this._speechSub=!1}),s=i=>{var r,a;let o=(r=i==null?void 0:i.data)==null?void 0:r.message,n=(a=i==null?void 0:i.data)==null?void 0:a.device;if(o){if(n){n===this._deviceId()&&this._speakHere(o);return}this._electAndSpeak(o)}};e(t.connection.subscribeEvents(s,"hubbubb_home_message")),e(t.connection.subscribeEvents(s,"jarvis_claude_message")),e(t.connection.subscribeEvents(i=>{let o=gt(N({},(i==null?void 0:i.data)||{}),{at:Date.now()}),n=this._claims||(this._claims=[]);for(n.push(o);n.length&&n[0].at<o.at-Vs;)n.shift()},"hubbubb_home_claim"))}_deviceId(){if(this._device)return this._device;let t=()=>Math.random().toString(36).slice(2,12);try{this._device=localStorage.getItem("jrc:device")||t(),localStorage.setItem("jrc:device",this._device)}catch(e){this._device=t()}return this._device}async _electAndSpeak(t){let e={idle:this._lastTouch?Date.now()-this._lastTouch:Ei,tie:Math.random()};try{await this._hass.connection.sendMessagePromise({type:"fire_event",event_type:"hubbubb_home_claim",event_data:e})}catch(n){return this._speakHere(t)}await new Promise(n=>setTimeout(n,1200));let s=Date.now()-Vs;(this._claims||[]).filter(n=>n.at>=s).reduce((n,r)=>r.idle<n.idle||r.idle===n.idle&&r.tie<n.tie?r:n,e).tie===e.tie&&this._speakHere(t)}_unlockSpeech(){if(this._speechAudio)return;let t=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");t.play().catch(()=>{}),this._speechAudio=t}async _speakHere(t){let e=this._hass;if(!(!e||!t))try{if(!this._ttsCfg){let r=await e.callWS({type:"assist_pipeline/pipeline/list"}),a=(r==null?void 0:r.pipelines)||[],l=a.find(h=>h.id===r.preferred_pipeline)||a[0];if(!(l!=null&&l.tts_engine))return;this._ttsCfg={engine_id:l.tts_engine,language:l.tts_language,voice:l.tts_voice}}let s=this._ttsCfg,i=await e.callApi("POST","tts_get_url",N({engine_id:s.engine_id,message:t,language:s.language},s.voice?{options:{voice:s.voice}}:{})),o=(i==null?void 0:i.url)||(i==null?void 0:i.path);if(!o)return;let n=this._speechAudio||(this._speechAudio=new Audio);this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null);try{let a=await(await fetch(o)).arrayBuffer();this._speechBlob=URL.createObjectURL(new Blob([a],{type:"audio/mpeg"})),n.src=this._speechBlob}catch(r){n.src=o}n.onended=()=>{this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null)},await n.play().catch(()=>{this._toast("Tap anywhere to let it speak here.")})}catch(s){}}_toggleAnnounce(){this._toggleHelper(this._config.announce_entity,"_announce",`${this._name} finishes: spoken on the puck`,`${this._name} finishes: phone only`)}_toggleMessages(){this._toggleHelper(this._config.messages_entity,"_messages","Hubbubb messages: read out as they arrive","Hubbubb messages: quiet")}_toggleHelper(t,e,s,i){let o=this[e]===!0;this[e]=!o,this._hass.callService("homeassistant",o?"turn_off":"turn_on",{entity_id:t}),this._toast(o?i:s)}_setBuild(t,e=!0){if(e&&this._config.build_entity&&this._hass&&this._config.build_scope==="global"&&this._hass.callService("homeassistant",t?"turn_on":"turn_off",{entity_id:this._config.build_entity}),this._config.build_dashboard){let s=this._build;this._build=t,t&&(e||s===!1)&&this._navigate(this._config.build_dashboard);return}if(this._config.build_page&&!t){this._navigate(this._config.build_return);return}this._build=t,t?(this._err="",this._sideW=this._recall("sidew",365*864e5)||0,this._loadModels(),this._poll(!0),this._startPolling(),!this._vvHandler&&window.visualViewport&&(this._vvHandler=()=>this._vvSync(),window.visualViewport.addEventListener("resize",this._vvHandler),window.visualViewport.addEventListener("scroll",this._vvHandler)),this._vvSync(),this._lockScroll(!0)):(this._stopPolling(),this._lockScroll(!1),this._sel=null,this._msgs=null,this._ask=null,this._activity=null,this._screen=null,this._suggestion=null,this._suggestion=null,this._permission=null,this._confirmKill=null,this._picking=!1,this._details=!1,this._view=null,this._swipe=null,this._vvHandler&&window.visualViewport&&(window.visualViewport.removeEventListener("resize",this._vvHandler),window.visualViewport.removeEventListener("scroll",this._vvHandler),this._vvHandler=null))}_lockScroll(t){var i;if(!((i=this._config)!=null&&i.build_page))return;let e=document.documentElement,s=document.body;s&&(t?(this._prevOverflow===void 0&&(this._prevOverflow=s.style.overflow,this._prevOverscroll=e.style.overscrollBehavior,this._prevHtmlOverflow=e.style.overflow),s.style.overflow="hidden",e.style.overflow="hidden",e.style.overscrollBehavior="none"):this._prevOverflow!==void 0&&(s.style.overflow=this._prevOverflow,e.style.overflow=this._prevHtmlOverflow,e.style.overscrollBehavior=this._prevOverscroll,this._prevOverflow=this._prevOverscroll=void 0,this._prevHtmlOverflow=void 0))}_syncCorner(t){window.innerWidth!==this._vvW&&(this._vvW=window.innerWidth,this._vvMax=t),this._vvMax=Math.max(this._vvMax||0,t);let e=t>=this._vvMax-4;this.style.setProperty("--jr-botr",e?"56px":"16px")}_vvSync(){let t=window.visualViewport;if(!t)return;let e=Math.round(t.height),s=Math.round(t.offsetTop),i=e!==this._vvH;i&&(this._vvH=e,this.style.setProperty("--jr-vvh",`${e}px`),this._syncCorner(e)),(i||this._vvT==null)&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`),i&&this._settlePin());let o=this._vvPrev==null?0:Math.abs(e-this._vvPrev),n=this._vvPrev==null;if(this._vvPrev=e,!n&&o<12)return;let r=this._growCap();r!==this._lastCap&&(this._lastCap=r,this._autoGrow(this._composerEl())),this._stick&&this._toBottom()}_settlePin(){clearTimeout(this._settleA),clearTimeout(this._settleB);let t=()=>{this._unscroll();let e=window.visualViewport;if(!e)return;let s=Math.round(e.offsetTop);s!==this._vvT&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`))};requestAnimationFrame(t),this._settleA=setTimeout(t,200),this._settleB=setTimeout(t,500)}_unscroll(){if(!this._build)return;window.scrollTo(0,0),document.scrollingElement&&(document.scrollingElement.scrollTop=0);let t=this.parentNode;for(;t;)t.scrollTop>0&&(t.scrollTop=0),t=t.parentNode||t.host}_startPolling(){let t=this._sel?600:1500;this._pollTimer&&this._pollMs===t||(this._pollTimer&&clearInterval(this._pollTimer),this._pollMs=t,this._pollTimer=setInterval(()=>this._poll(),t))}_stopPolling(){this._pollTimer&&clearInterval(this._pollTimer),this._pollTimer=null,this._pollMs=null}_errText(t){return typeof t=="number"?Mi[t]||`websocket error ${t}`:String((t==null?void 0:t.message)||t)}async _api(t,e={}){var n,r,a;let s=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=(n=s==null?void 0:s.response)==null?void 0:n.content;if(typeof i=="string")try{i=JSON.parse(i)}catch(l){}let o=(a=(r=s==null?void 0:s.response)==null?void 0:r.status)!=null?a:0;if(o<200||o>=300||(i==null?void 0:i.ok)===!1)throw new Error((i==null?void 0:i.detail)||(i==null?void 0:i.error)||`HTTP ${o}`);return i||{}}async _poll(t=!1){var e;if(!(!this._build||!this._hass)){if(this._polling){this._pollAgain=!0;return}this._polling=!0;try{let s=this._sel;this._tick=(this._tick||0)+1;let i=t||this._tick%5===1,[o,n]=await Promise.all([i?this._api("agent_status"):null,s?this._api("agent_transcript",{id:s,have:this._msgs==null?0:this._tbytes||0}):null]);if(o){if(this._settle("_sessions",this._trackDone(o.sessions||[])),this._settle("_projects",o.projects||[]),this._sel&&!this._sessions.some(a=>a.id===this._sel))this._sel=null,this._msgs=null,this._store("sel",null);else if(!this._sel&&!this._restored){this._restored=!0;let a=this._recall("sel",12*3600*1e3);a&&this._sessions.some(l=>l.id===a)&&this._select(a)}}let r=s&&s===this._sel?n:null;if(this._sel&&!r&&(r=await this._api("agent_transcript",{id:this._sel,have:this._msgs==null?0:this._tbytes||0})),this._sel&&r){let a=r;this._tbytes=a.bytes||0;let l=a.messages;l!=null&&!this._sameMsgs(l,this._msgs)&&(this._msgs=l),this._activity=a.activity||null,this._screen=a.screen||null,this._suggestion=a.suggestion||null,this._permission=a.permission||null;let h=a.ask?JSON.stringify(a.ask.options.map(p=>p.label)):null;if(h!==this._askSig&&(this._askSig=h,this._askSent=null),this._settle("_ask",a.ask||null),this._ask&&this._ask.multi&&(this._askSent=null),(e=this._queue)!=null&&e.length){let p=(this._msgs||[]).filter(g=>g.role==="user").map(g=>Ue(g.text)),u=g=>{let b=Ue(g.text);return b&&p.includes(b)},f=this._queue.length;this._queue=this._queue.filter(g=>g.state!=="sent"||!u(g)&&Date.now()-g.at<12e4),this._queue.length!==f&&this._saveQueue()}}this._err=""}catch(s){this._err=this._errText(s)}if(this._polling=!1,this._pollAgain)return this._pollAgain=!1,this._poll();this._drainQueue()}}_drainQueue(){var s;if(!this._sel||this._pending)return;let t=(this._queue||[]).filter(i=>i.id===this._sel);if(t.some(i=>i.state==="sent"))return;let e=t.find(i=>i.state==="held");e&&((s=(this._sessions||[]).find(i=>i.id===this._sel))!=null&&s.busy||this._dispatch(e))}_select(t){var e;if(this._sel&&this._sel!==t&&this._saveDraft(),this._sel=t,this._restored=!0,t&&((e=this._unread)!=null&&e.delete(t))){this._store("unread",[...this._unread]);let s=(this._sessions||[]).find(i=>i.id===t);s&&(s.done=!1)}this._store("sel",t||null),this._msgs=null,this._ask=null,this._askSent=null,this._askSig=void 0,this._activity=null,this._screen=null,this._suggestion=null,this._permission=null,this._model=null,this._startPolling(),this._confirmKill=null,this._details=!1,this._swipe=null,this._stick=!0,this._poll(!0),t&&this._api("agent_target_window",{id:t}).catch(()=>{})}_store(t,e){try{let s=`jrc:${t}`;e==null?localStorage.removeItem(s):localStorage.setItem(s,JSON.stringify({v:e,at:Date.now()}))}catch(s){}}_gripDown(t){let e=this.renderRoot.querySelector(".side");if(!e)return;t.preventDefault();let s=t.currentTarget,i=t.clientX,o=e.getBoundingClientRect().width,n=this.renderRoot.querySelector(".panel").clientWidth*.6,r=l=>{this._sideW=Math.round(Math.min(n,Math.max(140,o+l.clientX-i)))},a=()=>{s.removeEventListener("pointermove",r),s.removeEventListener("pointerup",a),s.removeEventListener("pointercancel",a),this._store("sidew",this._sideW)};s.setPointerCapture(t.pointerId),s.addEventListener("pointermove",r),s.addEventListener("pointerup",a),s.addEventListener("pointercancel",a)}_recall(t,e){try{let s=localStorage.getItem(`jrc:${t}`);if(!s)return null;let{v:i,at:o}=JSON.parse(s);return!o||Date.now()-o>e?(localStorage.removeItem(`jrc:${t}`),null):i}catch(s){return null}}_body(t){var o;let e=`${t.role}\0${t.text}`,s=(o=this._bodyCache)==null?void 0:o.get(e);if(s)return s;let i=this._bodyParse(t);return this._bodyCache||(this._bodyCache=new Map),this._bodyCache.size>400&&this._bodyCache.delete(this._bodyCache.keys().next().value),this._bodyCache.set(e,i),i}_bodyParse(t){if(xi.has(t.role))return t.text.split(`
`).map(i=>v`<div class="${$i(i)}">${i||" "}</div>`);if(t.role!=="assistant")return t.text;let e=[],s=0;for(let i of t.text.matchAll(ki))i.index>s&&e.push(this._linkPaths(t.text.slice(s,i.index))),e.push(i[1]?v`<code>${this._linkPaths(i[1])}</code>`:v`<b>${i[2]}</b>`),s=i.index+i[0].length;return e.push(this._linkPaths(t.text.slice(s))),e}_linkPaths(t){return Be(t).map(e=>typeof e=="string"?e:v`<a
            class="flink"
            href="#"
            data-ai="open-file"
            @click=${s=>{s.preventDefault(),this._openFile(e.path,e.line)}}
          >${e.path}${e.line}</a>`)}async _openFile(t,e){var i;let s=e?parseInt(e.slice(1),10):0;this._view={path:t,line:s,loading:!0};try{let o=await this._api("agent_file",{id:this._sel||"",path:t});this._view=gt(N({},o),{path:o.path||t,line:s})}catch(o){this._view={path:t,line:s,error:this._errText(o)};return}await this.updateComplete,(i=this.renderRoot.querySelector(".vline.hit"))==null||i.scrollIntoView({block:"center"})}_renderViewer(){let t=this._view,e=t.path.replace(/\/$/,"").split("/").pop()||t.path;return v`
      <div class="phead">
        <span class="ptitle" title=${t.path}>${e}${t.line?`:${t.line}`:""}</span>
        <button class="hbtn" data-ai="close-file" @click=${()=>this._view=null}>✕</button>
      </div>
      <div class="vpath">${t.path}</div>
      <div class="vbody">
        ${t.loading?v`<div class="dim pad">Loading…</div>`:t.error?v`<div class="dim pad">${t.error}</div>`:t.image?v`<img class="vimg" src=${t.image} alt=${e} />`:t.dir?t.dir.map(s=>v`<a
                      class="flink vent"
                      href="#"
                      @click=${i=>{i.preventDefault(),this._openFile(`${t.path}/${s}`,"")}}
                    >${s}</a>`):v`<pre class="vtext">${(t.text||"").split(`
`).map((s,i)=>v`<div class="vline ${i+1===t.line?"hit":""}"><span class="vno">${i+1}</span>${s||" "}</div>`)}</pre>`}
        ${t.truncated?v`<div class="dim pad">Showing the first 512 KB.</div>`:x}
      </div>
    `}_sameMsgs(t,e){if(!t||!e||t.length!==e.length)return!1;let s=t[t.length-1],i=e[e.length-1];return(s==null?void 0:s.role)===(i==null?void 0:i.role)&&(s==null?void 0:s.text)===(i==null?void 0:i.text)}_toBottom(){let t=0,e=()=>{var i,o;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((o=s.lastElementChild)==null||o.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll()),++t<6&&requestAnimationFrame(e)};requestAnimationFrame(e),clearTimeout(this._bottomT),this._bottomT=setTimeout(()=>{var i,o;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((o=s.lastElementChild)==null||o.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll())},250)}_composerEl(){var t;return(t=this.renderRoot)==null?void 0:t.querySelector(".composer textarea")}_growCap(){var e;let t=this._vvH||((e=window.visualViewport)==null?void 0:e.height)||window.innerHeight;return Math.max(56,Math.min(190,Math.round(t*.32)))}_autoGrow(t){if(!t)return;let e=t.style.height,s=t.scrollTop;t.style.height="auto";let i=Math.min(t.scrollHeight,this._growCap())+"px";return t.style.height=i,t.scrollTop!==s&&(t.scrollTop=s),i!==e}_draftSoon(){clearTimeout(this._draftT),this._draftT=setTimeout(()=>this._saveDraft(),400)}_saveDraft(t=this._sel){var s;if(clearTimeout(this._draftT),!t)return;let e=this._composerEl();e&&this._store(`draft:${t}`,e.value||null),this._store(`files:${t}`,(s=this._files)!=null&&s.length?this._files:null)}_restoreDraft(){if(!this._sel)return;this._files=this._recall(`files:${this._sel}`,12*3600*1e3)||[];let t=this._composerEl();if(!t||t.value)return;let e=this._recall(`draft:${this._sel}`,12*3600*1e3);e&&(t.value=e,this._autoGrow(t))}_saveQueue(){let t=(this._queue||[]).filter(e=>e.state==="held");this._store("queue",t.length?t:null)}_restoreQueue(){let t=this._recall("queue",216e5);Array.isArray(t)&&t.length&&(this._queue=t.map(e=>gt(N({},e),{state:"held"})))}async _send(t){var r;t.preventDefault();let e=this._composerEl(),s=e==null?void 0:e.value.trim(),i=this._files||[];if(!s&&!i.length||this._sel==null)return;let o=[...i.map(a=>a.path),s].filter(Boolean).join(" ");e.value="",e.style.height="",this._files=[],this._saveDraft();let n={id:this._sel,text:o,at:Date.now(),state:"held"};this._queue=[...this._queue||[],n],this._saveQueue(),this._stick=!0,(r=(this._sessions||[]).find(a=>a.id===this._sel))!=null&&r.busy||this._dispatch(n)}async _dispatch(t){if(!this._pending){this._pending=!0,t.state="sent",t.at=Date.now(),this._queue=[...this._queue],this._saveQueue();try{await this._api("agent_prompt_direct",{id:t.id,text:t.text,device:this._deviceId()}),t.delivered=!0,this._queue=[...this._queue],this._err=""}catch(e){this._err=this._errText(e),t.state="held",this._queue=[...this._queue],this._saveQueue()}this._pending=!1,this._poll(!0)}}_editQueued(t){let e=this._composerEl();e&&(e.value=e.value.trim()?`${e.value.trim()} ${t.text}`:t.text,this._dropQueued(t),e.focus(),this._autoGrow(e),this._saveDraft())}_dropQueued(t){this._queue=(this._queue||[]).filter(e=>e!==t),this._saveQueue()}async _attach(t){let e=[...t.target.files||[]];return t.target.value="",this._ingest(e)}async _ingest(t){if(!(!t.length||!this._sel)){this._uploading=!0;for(let e of t)try{let{name:s,data:i}=await this._encodeFile(e),o=await this._api("agent_upload",{name:s,data:i});if(!(o!=null&&o.path))throw new Error((o==null?void 0:o.detail)||"upload refused");this._files=[...this._files||[],{name:e.name,path:o.path}],this._err=""}catch(s){this._err=`${e.name}: ${this._errText(s)}`}this._uploading=!1,this._saveDraft()}}_encodeFile(t){let e=i=>new Promise((o,n)=>{let r=new FileReader;r.onerror=()=>n(new Error("could not read that file")),r.onload=()=>o(String(r.result).split(",")[1]||""),r.readAsDataURL(i)});if(!t.type.startsWith("image/"))return e(t).then(i=>({name:t.name,data:i}));let s=1568;return new Promise((i,o)=>{let n=new Image,r=URL.createObjectURL(t);n.onerror=()=>{URL.revokeObjectURL(r),e(t).then(a=>i({name:t.name,data:a}),o)},n.onload=()=>{URL.revokeObjectURL(r);let a=Math.min(1,s/Math.max(n.width,n.height));if(a===1&&t.size<9e5)return e(t).then(h=>i({name:t.name,data:h}),o);let l=document.createElement("canvas");l.width=Math.round(n.width*a),l.height=Math.round(n.height*a),l.getContext("2d").drawImage(n,0,0,l.width,l.height),l.toBlob(h=>{if(!h)return o(new Error("could not encode that image"));let p=t.name.replace(/\.[^.]+$/,"")+".jpg";e(h).then(u=>i({name:p,data:u}),o)},"image/jpeg",.85)},n.src=r})}_dropFile(t){this._files=(this._files||[]).filter(e=>e!==t),this._saveDraft()}_renderAsk(t){let e=!!t.multi,s=!e&&!!this._askSent;return v`<div class="askbox ${s?"answered":""}">
      ${t.header||t.total>1||e?v`<div class="askhead">
            ${t.header?v`<span class="askchip">${t.header}</span>`:x}
            ${t.total>1?v`<span class="askstep">Question ${t.index} of ${t.total}</span>`:x}
            ${e?v`<span class="askmulti">Pick any</span>`:x}
          </div>`:x}
      ${t.text?v`<div class="asktext">${t.text}</div>`:x}
      <div class="askopts">
        ${t.options.map(i=>v`<button
            class="askopt ${this._askSent===i.key?"picked":""} ${i.on?"on":""}"
            data-ai="pick-option"
            ?disabled=${s}
            @click=${()=>this._sendKey(i.key,{keepOpen:e})}
          >
            <span class="asknum">${e?i.on?"\u2611":"\u2610":i.key}</span>
            <span class="asklabel"
              >${i.label}
              ${i.desc?v`<span class="askdesc">${i.desc}</span>`:x}</span
            >
            ${!e&&this._askSent===i.key?v`<span class="asktick">✓</span>`:x}
          </button>`)}
      </div>
      <div class="askrow">
        ${s?v`<span class="dim">sending…</span>`:x}
        ${e?v`<button class="asksubmit" data-ai="submit-answer"
                   @click=${()=>this._sendKey("Enter")}>Submit</button>`:x}
        <button class="askmini" @click=${()=>this._sendKey("Escape")}>esc</button>
      </div>
    </div>`}async _sendKey(t,{keepOpen:e=!1}={}){if(this._sel){e||(this._askSent=t);try{await this._api("agent_key",{id:this._sel,key:t}),this._err=""}catch(s){this._err=this._errText(s),this._askSent=null;return}this._poll()}}async _setModel(t){if(!this._sel||this._modelBusy||!t)return;let e=this._model;this._model=t,this._modelBusy=t;try{await this._api("agent_model",{id:this._sel,model:t}),this._err=""}catch(s){this._model=e,this._err=this._errText(s)}this._modelBusy=null,this._poll()}async _setPermission(t){if(!(!this._sel||this._modelBusy||!t)){this._modelBusy="perm";try{let e=await this._api("agent_permission",{id:this._sel,mode:t}),s=e&&(e.mode||e.detail);s&&(this._permission=s),this._err=""}catch(e){this._err=this._errText(e)}this._modelBusy=null,this._poll()}}_renderRunControls(){let t=this._models||[],e=(this._sessions||[]).find(n=>n.id===this._sel),s=this._permission||"",i=(e==null?void 0:e.modes)||this._modes||["auto","manual","accept edits","plan"],o=this._model||(e==null?void 0:e.model)||"";return v`<div class="runbar">
      <select
        class="runsel ${this._modelBusy&&this._modelBusy!=="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy||!t.length}
        data-ai="pick-model"
        title="Model for this session"
        .value=${Le(o)}
        @change=${n=>this._setModel(n.target.value)}
      >
        <option value="" disabled>${t.length?"Model":"\u2026"}</option>
        ${t.map(n=>v`<option value=${n.id}>${n.id==="local"?"Local":n.name}</option>`)}
      </select>
      <select
        class="runsel perm mode-${(s||"unknown").replace(/\s+/g,"-")} ${this._modelBusy==="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy}
        data-ai="pick-permission"
        title="Permission mode"
        .value=${Le(s)}
        @change=${n=>this._setPermission(n.target.value)}
      >
        <option value="" disabled>mode ?</option>
        ${i.map(n=>v`<option value=${n}>${n}</option>`)}
      </select>
      ${e!=null&&e.busy?v`<button
            type="button"
            class="hbtn stop"
            data-ai="interrupt-turn"
            title="Interrupt this turn (sends Escape)"
            @click=${()=>this._sendKey("Escape",{keepOpen:!0})}
          >Stop</button>`:x}
    </div>`}async _loadModels(){if(!this._models)try{let t=await this._api("agent_models");this._models=t.models||[],this._modes=t.modes||null}catch(t){}}async _killSession(t){if(t){if(this._confirmKill!==t){this._confirmKill=t,clearTimeout(this._confirmT),this._confirmT=setTimeout(()=>this._confirmKill=null,4e3);return}clearTimeout(this._confirmT),this._confirmKill=null;try{await this._api("agent_kill",{id:t}),this._swipe=null,this._store(`draft:${t}`,null),this._queue=(this._queue||[]).filter(e=>e.id!==t),this._saveQueue(),this._sel===t&&(this._sel=null,this._msgs=null,this._store("sel",null)),this._poll(!0)}catch(e){this._err=this._errText(e)}}}_rowTap(t){if(this._swipe===t){this._swipe=null,this._confirmKill=null;return}if(this._swipe){this._swipe=null,this._confirmKill=null;return}this._swiped||this._select(t)}_swipeStart(t,e){var i;let s=(i=t.touches)==null?void 0:i[0];s&&(this._sx=s.clientX,this._sy=s.clientY,this._swiped=!1)}_swipeMove(t,e){var n;let s=(n=t.touches)==null?void 0:n[0];if(!s||this._sx==null)return;let i=s.clientX-this._sx,o=s.clientY-this._sy;Math.abs(o)>Math.abs(i)||(i<-12?(this._swiped=!0,this._swipe!==e&&(this._swipe=e)):i>12&&this._swipe===e&&(this._swiped=!0,this._swipe=null,this._confirmKill=null))}_swipeEnd(){this._sx=this._sy=null,setTimeout(()=>this._swiped=!1,50)}async _newSession(t){this._picking=!1,this._pending=!0;try{let e=await this._api("agent_start_session",{project:t});this._err="",await this._awaitSession(e==null?void 0:e.id)}catch(e){this._err=this._errText(e)}this._pending=!1}async _awaitSession(t){for(let e=0;e<20;e++){await this._poll(!0);let s=(this._sessions||[]).find(i=>t?i.id===t:i.target);if(s)return this._select(s.id),!0;await new Promise(i=>setTimeout(i,600))}return!1}_syncUrl(){var s,i;if((s=this._config)!=null&&s.build_dashboard||(i=this._config)!=null&&i.build_page)return;let t=location.pathname.replace(/\/session\/[^/]+$/,""),e=this._build&&this._sel?`${t}/session/${encodeURIComponent(this._sel)}`:t;e!==location.pathname&&history.replaceState(history.state,"",e+location.search)}_openLinked(){let t=location.pathname.match(/\/session\/([^/]+)$/);t&&(this._restored=!0,this._build||this._setBuild(!0,!1),this._awaitSession(decodeURIComponent(t[1])))}_openAssist(){var e,s,i;let t=(s=(e=this._hass)==null?void 0:e.auth)==null?void 0:s.external;if((i=t==null?void 0:t.config)!=null&&i.hasAssist){t.fireMessage({type:"assist/show"});return}Fe(this,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>customElements.whenDefined("ha-voice-command-dialog"),dialogParams:{pipeline_id:"last_used",start_listening:!0}})}_wakePuck(){var e;let t;try{t=(e=this._hass)==null?void 0:e.callService("assist_satellite","start_conversation",{entity_id:this._config.entity,start_message:this._config.tap_message,preannounce:!1},void 0,!1)}catch(s){return this._openAssist()}Promise.resolve(t).catch(()=>this._openAssist())}async _openMic(){try{let e=(await navigator.mediaDevices.enumerateDevices()).find(s=>s.kind==="audioinput"&&s.label&&!/iphone|ipad|continuity/i.test(s.label));if(e)return await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:e.deviceId}}})}catch(t){}return navigator.mediaDevices.getUserMedia({audio:!0})}async _startLocalVoice(t="converse"){if(this._voice||this._micOpening)return!0;this._micOpening=!0,t==="converse"?this._voiceState="listening":this._dictating=!0;let e;try{e=await this._openMic()}catch(u){return this._voiceState=null,this._dictating=!1,"microphone permission denied"}finally{this._micOpening=!1}let s=e.getAudioTracks()[0];s&&(s.onended=()=>{var u;((u=this._voice)==null?void 0:u.stream)===e&&(this._toast("The microphone disconnected."),this._stopLocalVoice())});let i=window.AudioContext||window.webkitAudioContext,o=new i,n=null;t==="converse"&&(n=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="),n.play().catch(()=>{}));let r=this._voice={mode:t,stream:e,ctx:o,audio:n,proc:null,src:null,handlerId:null,unsub:null},a=this._recall("conv",5*60*1e3);try{r.unsub=await this._hass.connection.subscribeMessage(u=>this._voiceEvent(u),N({type:"assist_pipeline/run",start_stage:"stt",end_stage:t==="dictate"?"stt":"tts",input:{sample_rate:16e3}},a?{conversation_id:a}:{}))}catch(u){return this._stopLocalVoice(),"assist pipeline refused the run"}let l=r.src=o.createMediaStreamSource(e),h=r.proc=o.createScriptProcessor(2048,1,1),p=Os(o.sampleRate,16e3);return h.onaudioprocess=u=>{if(r.handlerId==null)return;let f=p(u.inputBuffer.getChannelData(0)),g=new Uint8Array(1+f.length*2);g[0]=r.handlerId;let b=new DataView(g.buffer,1);for(let _=0;_<f.length;_++)b.setInt16(_*2,f[_],!0);try{this._hass.connection.socket.send(g)}catch(_){}},l.connect(h),h.connect(o.destination),!0}_voiceEvent(t){var s,i,o,n,r,a,l,h,p,u;let e=this._voice;if(e)switch(t.type){case"run-start":e.handlerId=(o=(i=(s=t.data)==null?void 0:s.runner_data)==null?void 0:i.stt_binary_handler_id)!=null?o:null;break;case"intent-end":{let f=(r=(n=t.data)==null?void 0:n.intent_output)==null?void 0:r.conversation_id;f&&this._store("conv",f);break}case"stt-end":if(e.mode==="dictate"){let f=((l=(a=t.data)==null?void 0:a.stt_output)==null?void 0:l.text)||"",g=(h=this.renderRoot)==null?void 0:h.querySelector(".composer textarea");g&&f&&(g.value=(g.value?g.value.trim()+" ":"")+f,g.focus()),f||this._toast("Didn't catch that."),this._stopLocalVoice()}else this._closeMic(),this._voiceState="processing";break;case"tts-end":{let f=(u=(p=t.data)==null?void 0:p.tts_output)==null?void 0:u.url;if(!f)return this._stopLocalVoice();this._voiceState="responding",e.audio.onended=()=>this._stopLocalVoice(),e.audio.onerror=()=>this._stopLocalVoice(),this._envEl=e.audio,this._envUrl=f,this._env=null,this._decodeAudio(f),e.audio.src=f,e.audio.play().catch(()=>this._stopLocalVoice());break}case"error":e.mode==="dictate"&&this._toast("Didn't catch that."),this._stopLocalVoice();break;case"run-end":this._voiceState!=="responding"&&this._stopLocalVoice();break}}_closeMic(){var e,s,i,o;let t=this._voice;t&&((e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),(i=t.stream)==null||i.getTracks().forEach(n=>n.stop()),(o=t.ctx)==null||o.close().catch(()=>{}),t.proc=t.src=null)}_stopLocalVoice(){var e,s;let t=this._voice;if(t){this._closeMic(),this._dictating=!1;try{(e=t.audio)==null||e.pause()}catch(i){}try{(s=t.unsub)==null||s.call(t)}catch(i){}this._voice=null,this._voiceState=null,this._envEl=null,this._env=null,this._envUrl=null}}_toast(t){Fe(this,"hass-notification",{message:t})}get _canMic(){var t;return!!(window.isSecureContext&&((t=navigator.mediaDevices)!=null&&t.getUserMedia))}async _composerMic(){var e;if(this._voice)return this._voice.mode==="dictate"?this._endSpeech():this._stopLocalVoice();if(!window.isSecureContext||!((e=navigator.mediaDevices)!=null&&e.getUserMedia)){this._toast("Voice input needs the https (Nabu Casa) URL.");return}let t=await this._startLocalVoice("dictate");t!==!0&&this._toast(`Couldn't start voice input (${t}).`)}_endSpeech(){var e,s;let t=this._voice;if(!t||t.handlerId==null)return this._stopLocalVoice();(e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),t.mode==="converse"&&(this._voiceState="processing");try{this._hass.connection.socket.send(new Uint8Array([t.handlerId]))}catch(i){this._stopLocalVoice()}}async _ringTap(){var e;if(this._voice)return this._voiceState==="listening"?this._endSpeech():this._stopLocalVoice();if(this._effectiveState()==="responding"){let s=this._resolveMediaPlayer(this._hass);if(s){this._hass.callService("media_player","media_stop",{entity_id:s});return}}if(!window.isSecureContext){this._wakePuck();return}if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia)){this._toast(`This browser exposes no microphone \u2014 waking ${this._name} instead.`),this._wakePuck();return}let t=await this._startLocalVoice();t!==!0&&(this._toast(`Couldn't use this device's mic (${t}) \u2014 waking ${this._name} instead.`),this._wakePuck())}firstUpdated(){this._setupCanvas()}updated(t){this._setupCanvas(),(t.has("_sel")||t.has("_build"))&&this._syncUrl(),t.has("_sel")&&this._sel&&this._restoreDraft(),t.has("_msgs")&&this._stick&&this._toBottom()}_setupCanvas(){var e,s,i;let t=(e=this.renderRoot)==null?void 0:e.querySelector("canvas");if(!t){this._stop(),this._canvas=null;return}if(t!==this._canvas){this._canvas=t;try{this._ctx=t.getContext("2d")}catch(o){this._ctx=null}if(!this._ctx)return;this._t=0,this._waveT=0,this._churnT=0,this._peaks=Ti.map(o=>N({},o)),this._spin=0,this._head=0,this._speech={t:0,next:0,env:0,count:0,syl:null,pulses:[],spikes:[]},this._cur=N({},Ns.idle),this._rgb=Ks((i=(s=this._config)==null?void 0:s.idle_color)!=null?i:"#3db4c8"),this._observe()}this._ctx&&(this._measure(),this._pump())}_observe(){var t,e;typeof ResizeObserver!="undefined"&&((t=this._ro)==null||t.disconnect(),this._ro=new ResizeObserver(()=>this._measure()),this._ro.observe(this._canvas)),typeof IntersectionObserver!="undefined"?((e=this._io)==null||e.disconnect(),this._io=new IntersectionObserver(s=>{this._onScreen=s.some(i=>i.isIntersecting),this._pump()}),this._io.observe(this._canvas)):this._onScreen=!0}_measure(){var r,a,l;let t=this._canvas;if(!t||!this._ctx)return;let e=t.clientWidth||Number((r=this._config)==null?void 0:r.size)||240,s=t.clientHeight||e;((l=(a=this._perf)==null?void 0:a.q)!=null?l:1)<.75&&(this._lowDpr=!0);let i=this._lowDpr?1:2,o=F(window.devicePixelRatio||1,1,i);if(this._w===e&&this._h===s&&this._dpr===o&&this._particles)return;let n=!this._particles||this._w!==e;this._w=e,this._h=s,this._dpr=o,t.width=Math.round(e*o),t.height=Math.round(s*o),this._ctx.setTransform(o,0,0,o,0,0),n&&this._buildField()}_buildField(){var r,a;if(((r=this._config)==null?void 0:r.animation)==="jarvis-im3")return this._buildSheetField();let t=Number((a=this._config)==null?void 0:a.particles)||0,e=F(Math.round((this._w||240)*32),9e3,2e4),s=t>0?F(t,0,8e3):e,i=Math.max(400,s),o=Ot(24301),n=new Array(i);for(let l=0;l<i;l++){let h=l*.6180339887%1,p=0;for(let g=ge[0].share;p<ge.length-1&&h>=g;)g+=ge[++p].share;let u=(o()+o()-1)*(o()<.04?4:1),f=(o()+o()-1)*1.05;n[l]={ri:p,lon:o()*Math.PI*2,sinLat:Math.sin(f),cosLat:Math.cos(f),off:u,drift:(o()-.5)*.13,tw:.5+o()*2,ph:o()*Math.PI*2,bobA:.1+o()*.25,bobW:.25+o()*.85,bobP:o()*Math.PI*2,wobA:.006+o()*.02,wobW:.4+o()*1.2,wobP:o()*Math.PI*2,lf:5+o()*7,lt:o()*12,sz:o()<.03?2.1+o()*1.1:.8+o()*.85,halo:o()<.05,br:o()<.04?1:.45+o()*.55}}this._particles=n}_buildSheetField(){var n;let t=Number((n=this._config)==null?void 0:n.particles)||0,e=F(Math.round((this._w||240)*55),12e3,26e3),s=Math.max(400,t>0?F(t,0,26e3):e),i=Ot(6718),o=new Array(s);for(let r=0;r<s;r++){let a=r*.6180339887%1,l=0;for(let f=pt[0].share;l<pt.length-1&&a>=f;)f+=pt[++l].share;let h=pt[l].rows,p=Math.floor(i()*h),u=h>1?-1+2*p/(h-1):0;u+=(i()-.5)*.025,i()<.01&&(u*=1.3+i()*.6),o[r]={si:l,th:i()*Math.PI*2,v:u,n:i()-.5,dr:(i()-.5)*.04,tw:.4+i()*1.8,ph:i()*Math.PI*2,sz:.45+i()*.4,br:i()<.05?1:.4+i()*.5}}this._particles=o}_sheetTables(t,e,s){if(!this._sheetState){let l=Ot(30689);this._sheetState=pt.map(()=>({lp:Pt.map(()=>l()*6.283),lw:Pt.map(()=>(.35+l()*.8)*(l()<.5?-1:1)),tp:Rt.map(()=>l()*6.283),tw:Rt.map(()=>(.3+l()*.9)*(l()<.5?-1:1)),rc:new Float32Array(it),cw:new Float32Array(it)}))}let i=Math.min(1.4,e*1.8+s),o=t*(.12+i*1.9),n=.006+i*.075,r=.25+i*1.8,a=.006*Math.sin(this._t*.35);for(let l=0;l<pt.length;l++){let h=pt[l],p=this._sheetState[l];for(let g=0;g<Pt.length;g++)p.lp[g]+=p.lw[g]*o;for(let g=0;g<Rt.length;g++)p.tp[g]+=p.tw[g]*o;let u=n*(l===2?.55:1),f=r*(l===2?.4:1);for(let g=0;g<it;g++){let b=g/it*6.283185,_=0;for(let m=0;m<Pt.length;m++)_+=Pt[m].a*Math.sin(Pt[m].k*b+p.lp[m]);let M=0;for(let m=0;m<Rt.length;m++)M+=Rt[m].a*Math.sin(Rt[m].m*b+p.tp[m]);p.rc[g]=h.r+a+i*.012+u*_,p.cw[g]=h.w*(1+i*.35)*Math.cos(M*f)}}return this._sheetState}_audioSync(t){if(!t||t.state!=="playing"){this._env=null,this._envUrl=null;return}let e=t.attributes||{},s=String(e.media_content_id||""),i=/^https?:\/\//.test(s)||s.startsWith("/")?s:null,o=Date.parse(e.media_position_updated_at||t.last_changed||"");this._envAt=Number.isFinite(o)?o:Date.now(),this._envPos=Number(e.media_position)||0,!(!i||i===this._envUrl)&&(this._envUrl=i,this._env=null,i&&!(Number(e.media_duration)>60)&&this._decodeAudio(i))}async _pipelineId(t){var l,h,p,u,f;if(this._pipeId!==void 0)return this._pipeId;this._pipeId=null;let e=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline/list"}),s=await t.connection.sendMessagePromise({type:"assist_pipeline/device/list"}),i=(h=(l=t.entities)==null?void 0:l[this._config.entity])==null?void 0:h.device_id,o=(p=s==null?void 0:s.find(g=>g.device_id===i))==null?void 0:p.pipeline_entity,n=o?(f=(u=t.states)==null?void 0:u[o])==null?void 0:f.state:null,r=(e==null?void 0:e.pipelines)||[],a=r.find(g=>g.name===n)||r.find(g=>g.id===(e==null?void 0:e.preferred_pipeline));return this._pipeId=(a==null?void 0:a.id)||null,this._pipeId}async _grabTtsUrl(){var e,s,i,o;let t=this._hass;if(!(!(t!=null&&t.connection)||this._grabbing)){this._grabbing=!0;try{let n=await this._pipelineId(t);if(!n)return;for(let r=0;r<3;r++){let a=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/list",pipeline_id:n}),l=((a==null?void 0:a.pipeline_runs)||[]).reduce((h,p)=>!h||p.timestamp>h.timestamp?p:h,null);if(l&&Date.now()-Date.parse(l.timestamp)<6e4){let h=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/get",pipeline_id:n,pipeline_run_id:l.pipeline_run_id}),p=(h==null?void 0:h.events)||[];for(let u=p.length-1;u>=0;u--){let f=((e=p[u])==null?void 0:e.type)==="tts-end"&&((o=(i=(s=p[u])==null?void 0:s.data)==null?void 0:i.tts_output)==null?void 0:o.url);if(f){this._envUrl=f,this._env=null,await this._decodeAudio(f);return}}}await new Promise(h=>setTimeout(h,250))}}catch(n){this._pipeId=void 0}finally{this._grabbing=!1}}}async _decodeAudio(t){try{let e=await(await fetch(t)).arrayBuffer(),s=window.AudioContext||window.webkitAudioContext;if(!s)return;let o=await(this._actx||(this._actx=new s)).decodeAudioData(e);if(t!==this._envUrl)return;this._env=Is(o.getChannelData(0),o.sampleRate,Gs)}catch(e){this._env=null}}_audioLevel(){let t=this._env,e=this._envEl;if(e)return e.currentTime?t?Hs(t,e.currentTime):null:0;if(!t||this._mp!=="playing")return null;let s=this._envPos+(Date.now()-this._envAt)/1e3+(Number(this._config.audio_offset)||0);return Hs(t,s)}_sylShapes(t,e){let s=this._speech;s.pulses.push({born:s.t,amp:t}),s.pulses.length>6&&s.pulses.shift();let i=Math.random()*6.283185;s.spikes.push({a:i,sg:.1+Math.random()*.08,h:.06+t*.06,born:s.t,dur:.12+Math.random()*.08},{a:i+(Math.random()-.5)*.6,sg:.22+Math.random()*.18,h:.04+t*.05,born:s.t+.04,dur:e*(.9+Math.random()*.4)}),s.spikes.length>14&&s.spikes.splice(0,s.spikes.length-14)}_speechTick(t){let e=this._speech;e.t+=t;let s=this._audioLevel();if(s!=null){s>.2&&s>(e.last||0)*1.4&&(e.count++,e.syl={start:e.t,dur:.22,peak:s,f:5+s*4},this._sylShapes(s,.22)),e.last=s,e.live=!0;let r=s>e.env?.05:.14;e.env+=(s-e.env)*(1-Math.exp(-t/r)),e.env>1&&(e.env=1);return}if(e.live=!1,e.t>=e.next){let r=.22+Math.random()*.26,a=.5+Math.random()*.5;e.syl={start:e.t,dur:r,peak:a,f:5+Math.random()*4},e.count++;let l=.02+Math.random()*.05;e.count%(5+Math.floor(Math.random()*6))===0&&(l+=.14+Math.random()*.26),e.next=e.t+r+l,this._sylShapes(a,r)}let i=0,o=e.syl;if(o){let r=(e.t-o.start)/o.dur;r>=0&&r<=1&&(i=o.peak*1.2*(.5-.5*Math.cos(2*Math.PI*r)))}let n=i>e.env?.22:.5;e.env+=(i-e.env)*(1-Math.exp(-t/n)),e.env>1&&(e.env=1)}_pulseTable(t){let e=this._ptab||(this._ptab=new Float32Array(jt));if(e.fill(0),t<.01)return e;let s=this._speech;for(let i of s.pulses){let o=s.t-i.born;if(o>2.4)continue;let n=.58+o*.26,r=i.amp*Math.exp(-o/1)*t;for(let a=0;a<jt;a++){let l=qs+a/(jt-1)*Ws-n;e[a]+=r*Math.exp(-(l*l)/.0055)}}return e}_peakTable(t,e,s){let i=this._ktab||(this._ktab=new Float32Array(zt));i.fill(0);let o=this._t,n=.05*e.amp+.08*s;for(let a of this._peaks){a.a+=t*a.w*(.6+e.swirl);let l=.35+.65*(.5+.5*Math.sin(o*a.f+a.ph)),h=a.h*l*n;if(h<.002)continue;let p=a.sg*(1-.4*s),u=2*p*p;for(let f=0;f<zt;f++){let g=f/zt*6.283185-a.a;g=(g%6.283185+6.283185)%6.283185,g>3.141593&&(g-=6.283185),i[f]+=h*Math.exp(-(g*g)/u)}}let r=this._speech;for(let a=r.spikes.length-1;a>=0;a--){let l=r.spikes[a],h=r.t-l.born;if(h>l.dur+.3){r.spikes.splice(a,1);continue}if(h<0)continue;let p=h<.12?h/.12:1,u=h>l.dur?Math.exp(-(h-l.dur)/.3):1,f=l.h*p*u*e.speech;if(f<.003)continue;let g=2*l.sg*l.sg;for(let b=0;b<zt;b++){let _=b/zt*6.283185-l.a;_=(_%6.283185+6.283185)%6.283185,_>3.141593&&(_-=6.283185),i[b]+=f*Math.exp(-(_*_)/g)}}return i}_sprite(t,e,s){let i=t<<16|e<<8|s;if(this._sprKey===i)return this._spr;let o=this._spr||(this._spr=document.createElement("canvas"));o.width=o.height=32;let n=o.getContext("2d");n.clearRect(0,0,32,32);let r=n.createRadialGradient(16,16,0,16,16,16);return r.addColorStop(0,`rgba(${t},${e},${s},0.75)`),r.addColorStop(.4,`rgba(${t},${e},${s},0.3)`),r.addColorStop(1,`rgba(${t},${e},${s},0)`),n.fillStyle=r,n.fillRect(0,0,32,32),this._sprKey=i,o}_segTick(t){var o;if(this._segRot===void 0&&(this._segRot=-Math.PI/2),this._segRot+=t*.019,this._segWave=(this._segWave||0)+t*.5,this._sessions==null)return this._ambientTick(t);let e=this._segMap||(this._segMap=new Map),s=1-Math.exp(-t/.7),i=new Set;for(let n of this._sessions){i.add(n.id);let r=e.get(n.id);r||(r={size:.02,fill:Math.random(),pulse:Math.random()*6.28,rgb:[46,157,245],gone:!1},e.set(n.id,r));let a=n.context_max?F(n.context/n.context_max,0,1):null;r.weight=a!=null?.6+a*3:Math.max(.8,Math.log10((n.bytes||0)+1e4)-3.2),r.fracT=a!=null?a:1,r.frac===void 0&&(r.frac=0),r.busy=!!n.busy,r.done=!!n.done,r.gone=!1}for(let[n,r]of e){if(i.has(n)||(r.gone=!0),r.size+=((r.gone?0:r.weight)-r.size)*s,r.frac+=((r.gone?0:(o=r.fracT)!=null?o:1)-r.frac)*s,r.gone&&r.size<.03){e.delete(n);continue}r.pulse+=t*(r.busy?2.4:.9),r.busy&&(r.fill=(r.fill+t*.3)%1);let a=r.done?[40,226,138]:[46,157,245];for(let l=0;l<3;l++)r.rgb[l]+=(a[l]-r.rgb[l])*s}}_segBand(t){let e=Math.abs(-Math.sin(t)-Math.sin(this._segWave||0));return e>1?0:.5+.5*Math.cos(e*Math.PI)}_wash(t,e,s,i,o,n,r,a){let l=Math.max(2,Math.min(12,Math.ceil((r-n)/.1))),h=(r-n)/l;for(let p=0;p<l;p++){let u=n+p*h,f=Math.min(r,u+h);t.globalAlpha=a*(.5+1.15*this._segBand(u+h/2)),t.beginPath(),t.arc(e,s,o,u,f),t.arc(e,s,i,f,u,!0),t.closePath(),t.fill()}}_drawSegs(t,e,s,i,o,n,r){var b;if(this._sessions==null)return this._drawAmbientSegs(t,e,s,i,o,n,r);let a=6.283185,l=i*.475,h=i*.655,p=(_,M,m,w)=>{t.beginPath(),t.arc(e,s,w,_,M),t.arc(e,s,m,M,_,!0),t.closePath()},u=this._segMap,f=0;if(u)for(let _ of u.values())f+=_.size;if(!u||!u.size||f<=0){t.fillStyle=`rgb(${o},${n},${r})`,t.globalAlpha=.05,p(0,a,l,h),t.fill(),t.globalAlpha=1;return}let g=this._segRot;for(let _ of u.values()){let M=_.size/f*a,m=Math.min(.035,M),w=g+m/2,k=g+M-m/2;g+=M;let y=k-w;if(y<.004)continue;t.fillStyle=`rgb(${Math.round(_.rgb[0])},${Math.round(_.rgb[1])},${Math.round(_.rgb[2])})`,t.globalAlpha=.035,p(w,k,l,h),t.fill();let $=l+(h-l)*(.18+.82*F((b=_.frac)!=null?b:1,0,1));if(this._wash(t,e,s,l,$,w,k,(_.busy?.22:.1)+(_.done?.07:0)),_.busy){let T=Math.max(.1,y*.35),A=w+_.fill*y,O=14;for(let E=0;E<O;E++){let C=A-E*T/O,S=Math.max(w,C-T/O);if(C<=w)break;t.globalAlpha=.3*Math.pow(1-E/O,1.6),p(S,C,l,$),t.fill()}}}t.globalAlpha=1}_ambientTick(t){let e=this._segs;if(!e){e=this._segs=[],this._segRot=-Math.PI/2;for(let o=0;o<22;o++){let n=Math.random()<.75;e.push({size:.5+Math.random()*1.4,fill:n?1:Math.random()*.7,rate:.12+Math.random()*.3,state:n?"done":"load",doneT:Math.random()*9})}}let s=0,i=0;for(let o of e)o.state==="grow"?s++:o.state==="die"&&i++;if(!s&&e.length<26&&Math.random()<t*.5&&e.splice(Math.floor(Math.random()*(e.length+1)),0,{size:.02,target:.5+Math.random()*1.4,fill:0,rate:.12+Math.random()*.3,state:"grow",doneT:0}),i<2&&e.length>16){let o=null;for(let n of e)n.state==="done"&&n.doneT>8&&(!o||n.doneT>o.doneT)&&(o=n);o&&Math.random()<t*.25&&(o.state="die")}for(let o=e.length-1;o>=0;o--){let n=e[o];n.state==="grow"?(n.size+=t*.5,n.size>=n.target&&(n.size=n.target,n.state="load")):n.state==="load"?(n.fill+=t*n.rate,n.fill>=1&&(n.fill=1,n.state="done",n.doneT=0)):n.state==="done"?n.doneT+=t:(n.size-=t*.12,n.fill=Math.max(0,n.fill-t*.25),n.size<=.02&&e.splice(o,1))}}_drawAmbientSegs(t,e,s,i,o,n,r){let a=this._segs;if(!a||!a.length)return;let l=0;for(let m of a)l+=m.size;if(l<=0)return;let h=i*.475,p=i*.655,u=o*.5+74|0,f=n*.72+48|0,g=r*.8+82|0;t.fillStyle=`rgb(${u},${f},${g})`;let b=(m,w,k,y)=>{t.beginPath(),t.arc(e,s,y,m,w),t.arc(e,s,k,w,m,!0),t.closePath()},_=6.283185,M=this._segRot;for(let m=0;m<a.length;m++){let w=a[m],k=w.size/l*_,y=Math.min(.028,k),$=M+y/2,T=M+k-y/2;M+=k;let A=T-$;if(!(A<.004)&&(this._wash(t,e,s,h,p,$,T,.13),w.fill>.01)){let O=w.state==="done"?.14+.2*Math.exp(-w.doneT/2.2):.34;this._wash(t,e,s,h,p,$,$+A*w.fill,O*.8)}}t.globalAlpha=1}_pump(){this._ctx&&this.isConnected&&this._onScreen!==!1&&!document.hidden?this._start():this._stop()}_start(){if(this._raf)return;this._last=performance.now();let t=e=>{this._raf=requestAnimationFrame(t);let s=e-this._last,i=Math.min(.05,s/1e3);this._last=e,this._perfTick(s),this._draw(i)};this._raf=requestAnimationFrame(t)}_perfTick(t){if(t<=0||t>250)return;let e=this._perf||(this._perf={q:1,acc:0,n:0,hold:40});if(e.hold>0){e.hold--;return}if(e.acc+=t,++e.n<45)return;let s=e.acc/e.n;e.acc=0,e.n=0,s>26&&e.q>.2?this._setQuality(Math.max(.2,e.q*.65)):s<14&&e.q<1&&this._setQuality(Math.min(1,e.q*1.2))}_setQuality(t){let e=this._perf;t!==e.q&&(e.q=t,e.hold=40,this._measure())}_stop(){this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_targets(){let t=this._effectiveState(),e=t==="offline"?this._config.offline_color:this._config[Ds[t]];return{energy:Ns[t],rgb:Ks(e)}}_nearestAnchor(t,e,s){let i=s,o=s?Math.hypot(t.x-s.x,t.y-s.y)-s.r*.35:1/0;for(let n of e){let r=Math.hypot(t.x-n.x,t.y-n.y);r<o&&(o=r,i=n)}return i}_bubbleField(t){let e=t*.42;return{core:e,R:e,newR:()=>t*(.03+Math.pow(Math.random(),1.6)*.028),minAnchor:t*.058,maxR:t*.13}}_spawnBubble(t,e,s,i,o){let n=i!=null?i:Math.random()*Math.PI*2,r=o!=null?o:t.newR(),a=t.core+r;return{x:e+Math.cos(n)*a,y:s+Math.sin(n)*a,vx:0,vy:0,r:0,full:r,anchor:r>=t.minAnchor,host:null,held:!0,pop:-1,life:0,roll:Math.random()<.5?-1:1,wob:Math.random()*Math.PI*2,age:0,span:45+Math.random()*70}}_drawBubbles(t){var K,J,Q,et,Mt,At,St;let e=this._ctx,s=this._w,i=this._h;if(!s||!i)return;let o=s/2,n=i/2,r=Math.min(s,i)/2,{energy:a,rgb:l}=this._targets(),h=1-Math.exp(-t/.55),p=1-Math.exp(-t/.16),u=this._cur;for(let d of Object.keys(a)){let z=d==="speech"&&a[d]<u[d]?p:h;u[d]+=(a[d]-u[d])*z}for(let d=0;d<3;d++)this._rgb[d]+=(l[d]-this._rgb[d])*h;let f=Math.round(this._rgb[0]),g=Math.round(this._rgb[1]),b=Math.round(this._rgb[2]);a.speech>.5&&this._speech.env<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),u.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*h;let _=this._speech,M=.5+.5*Math.sin(_.t*.5+.8*Math.sin(_.t*.21)),m=_.live?.88:.62,w=(m*_.env+(1-m)*M)*u.speech;this._t+=t;let k=u.swirl/1.8,y=Number(this._config.particle_size)||1,$=this._bubbleField(r),T=Math.max(6,Math.round(18*y));if(this._bub&&this._bubHalf&&this._bubHalf!==r){let d=r/this._bubHalf;for(let z of this._bub)z.x=o+(z.x-o)*d,z.y=n+(z.y-n)*d,z.r*=d,z.full*=d,z.vx*=d,z.vy*=d,z.popR&&(z.popR*=d);this._bubHalf=r}if(!this._bub){this._bubHalf=r,this._bub=[];for(let d=0;d<T;d++){let z=Math.min($.newR()*(1+Math.random()*2.2),$.maxR),j=this._spawnBubble($,o,n,d/T*Math.PI*2,z);j.r=j.full,j.anchor=j.r>=$.minAnchor,j.age=Math.random()*j.span,this._bub.push(j)}for(let d=0;d<100;d++)He(this._bub,2),De(this._bub,o,n,$.core),Ne(this._bub,o,n,$.core),qe(this._bub,o,n,$.core,2);for(let d of this._bub)d.vx=0,d.vy=0;this._release=0}let A=this._bub;for(let d of A)d.held&&d.pop<0&&(d.anchor=d.r>=$.minAnchor);let O=A.filter(d=>d.anchor&&d.held&&d.pop<0),E=$.core*(1+w*.07+Math.sin(this._t*.22)*.005);for(this._release+=w*t*3.2;this._release>=1;){this._release-=1;let d=A.filter(I=>I.held&&!I.anchor&&I.pop<0&&I.r>I.full*.6),z=d.length>2?d:A.filter(I=>I.held&&I.pop<0&&I.r>I.full*.6);if(z.length<3)break;let j=z[Math.floor(Math.random()*z.length)];j.host=null,j.held=!1,j.life=0;let Z=Math.hypot(j.x-o,j.y-n)||1,V=(j.x-o)/Z,H=(j.y-n)/Z,B=r*(.5+Math.random()*.5);j.vx=V*B-H*r*.12,j.vy=H*B+V*r*.12}let C=r*(.045+k*.11);for(let d of A){d.wob+=t*1.3;let z=(K=d.dx)!=null?K:d.x,j=(J=d.dy)!=null?J:d.y;if(d.pop>=0){d.pop+=t;continue}if(d.held){if(d.r+=(d.full-d.r)*(1-Math.exp(-t/2)),d.anchor){let B=Math.hypot(d.x-o,d.y-n)||1,I=(d.x-o)/B,W=(d.y-n)/B,st=(E+d.r-B)*5;d.vx+=(I*st-W*C)*t,d.vy+=(W*st+I*C)*t}else{!d.host||!d.host.held||d.host.pop>=0?d.host=this._nearestAnchor(d,O,null):d.host=this._nearestAnchor(d,O,d.host);let B=d.host;if(B){let I=d.x-B.x,W=d.y-B.y,G=Math.hypot(I,W);G<.001&&(I=.1,W=0,G=.1);let st=I/G,Tt=W/G,ot=(B.r+d.r-G)*6,nt=r*.055*d.roll;d.vx+=(st*ot-Tt*nt)*t,d.vy+=(Tt*ot+st*nt)*t}else{let I=Math.hypot(d.x-o,d.y-n)||1,W=E+d.r;d.vx+=(d.x-o)/I*(W-I)*5*t,d.vy+=(d.y-n)/I*(W-I)*5*t}}let H=Math.exp(-t*(d.anchor?5.5:6.5));d.vx*=H,d.vy*=H}else d.life+=t,d.vy-=r*.85*t,d.vx*=Math.exp(-t*.9),d.r*=Math.exp(-t*.16),(d.life>1+Math.random()*.4||d.x<-r||d.x>s+r||d.y<-r)&&(d.pop=0,d.popR=d.r);let Z=r*(d.held?.22:1.4),V=Math.hypot(d.vx,d.vy);V>Z&&(d.vx=d.vx/V*Z,d.vy=d.vy/V*Z),d.x+=d.vx*t,d.y+=d.vy*t}He(A,2),De(A,o,n,E),Ne(A,o,n,E),qe(A,o,n,E,2);let S=1-Math.exp(-t/.11);for(let d of A)d.dx===void 0?(d.dx=d.x,d.dy=d.y,d.dr=d.r):(d.dx+=(d.x-d.dx)*S,d.dy+=(d.y-d.dy)*S,d.dr+=(d.r-d.dr)*S);Bs(A,{dt:t,rate:.2+k*.15,sizeBias:3,maxRatio:2.1,maxR:$.maxR});for(let d of A)!d.held||d.pop>=0||(d.age+=t*(1+k*.5),Us(d,{dt:t,maxR:$.maxR})&&(d.held=!1,d.pop=0,d.popR=d.r));for(let d=A.length-1;d>=0;d--)A[d].pop>Fs&&A.splice(d,1);let R=0;for(;R++<1;){let d=A.filter(B=>B.held&&B.pop<0),z=d.filter(B=>Math.hypot(B.x-o,B.y-n)<=E+B.r*1.7),{angle:j,gap:Z}=Ls(z,o,n),V=Math.sin(Math.min(Z,Math.PI)/2)*E;if(z.length>1&&V<$.newR()*1.4)break;let H=V>$.minAnchor*1.5;if(d.length>=T&&!H||d.length>=T*1.7)break;A.push(this._spawnBubble($,o,n,j))}e.clearRect(0,0,s,i),e.globalCompositeOperation="lighter";let L=e.createRadialGradient(o-E*.3,n-E*.35,E*.08,o,n,E),U=.34+w*.22;L.addColorStop(0,`rgba(${Math.min(255,f+80)},${Math.min(255,g+80)},${Math.min(255,b+65)},${U})`),L.addColorStop(.6,`rgba(${f},${g},${b},${U*.55})`),L.addColorStop(1,`rgba(${f},${g},${b},0)`),e.fillStyle=L,e.beginPath(),e.arc(o,n,E,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${g},${b},${.3+w*.28})`,e.lineWidth=Math.max(.8,E*.018),e.beginPath(),e.arc(o,n,E*.985,0,Math.PI*2),e.stroke(),e.fillStyle=`rgba(255,255,255,${.13+w*.12})`,e.beginPath(),e.arc(o-E*.36,n-E*.4,E*.14,0,Math.PI*2),e.fill();let q=A.slice().sort((d,z)=>z.r-d.r);for(let d of q){let z=(Q=d.dx)!=null?Q:d.x,j=(et=d.dy)!=null?et:d.y;if(d.pop>=0){let G=Math.min(1,d.pop/Fs),st=d.popR||d.r,Tt=1-Math.pow(1-G,2),Xt=Math.pow(1-G,1.7);if(G<.55){let ot=st*(1-G*.12),nt=e.createRadialGradient(z-ot*.3,j-ot*.35,ot*.1,z,j,ot),Jt=.34*Math.pow(1-G/.55,1.4);nt.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,g+95)},${Math.min(255,b+75)},${Jt})`),nt.addColorStop(1,`rgba(${f},${g},${b},0)`),e.fillStyle=nt,e.beginPath(),e.arc(z,j,ot,0,Math.PI*2),e.fill()}e.strokeStyle=`rgba(${f},${g},${b},${Xt*.3})`,e.lineWidth=Math.max(.4,st*.035*(1-G*.6)),e.beginPath(),e.arc(z,j,st*(1+Tt*.22),0,Math.PI*2),e.stroke();continue}let Z=(Mt=d.dx)!=null?Mt:d.x,V=(At=d.dy)!=null?At:d.y,H=((St=d.dr)!=null?St:d.r)*(1+Math.sin(d.wob)*.015);if(H<.6)continue;let B=d.held?1:Math.max(0,1-d.life/2.1),I=(.5+w*.28)*B,W=e.createRadialGradient(Z-H*.3,V-H*.35,H*.1,Z,V,H);W.addColorStop(0,`rgba(${Math.min(255,f+95)},${Math.min(255,g+95)},${Math.min(255,b+75)},${I})`),W.addColorStop(.55,`rgba(${f},${g},${b},${I*.7})`),W.addColorStop(1,`rgba(${f},${g},${b},0)`),e.fillStyle=W,e.beginPath(),e.arc(Z,V,H,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${f},${g},${b},${(.26+w*.16)*B})`,e.lineWidth=Math.max(.5,H*.045),e.beginPath(),e.arc(Z,V,H*.97,0,Math.PI*2),e.stroke(),H>3&&(e.fillStyle=`rgba(255,255,255,${(.26+w*.2)*B})`,e.beginPath(),e.arc(Z-H*.34,V-H*.38,H*.17,0,Math.PI*2),e.fill())}e.globalCompositeOperation="source-over"}_draw(t){var Jt,Qe,Ge,Ye;let e=this._ctx;if(!e)return;let s=this._config.animation==="jarvis-im3";if(!s&&this._config.animation!=="jarvis-v1")return this._drawBubbles(t);if(!this._particles)return;let i=this._w,o=this._h,n=i/2,r=o/2,a=Math.min(i,o)/2,{energy:l,rgb:h}=this._targets(),p=1-Math.exp(-t/.55),u=1-Math.exp(-t/.16),f=this._cur;for(let D of Object.keys(l)){let P=D==="speech"&&l[D]<f[D]?u:p;f[D]+=(l[D]-f[D])*P}for(let D=0;D<3;D++)this._rgb[D]+=(h[D]-this._rgb[D])*p;let g=Math.round(this._rgb[0]),b=Math.round(this._rgb[1]),_=Math.round(this._rgb[2]);this._t+=t,this._waveT+=t*(.5+f.swirl*.9),this._spin+=t*(.09+f.swirl*.05),this._head+=t*(1.1+f.swirl*1.4),l.speech>.5&&this._cur.speech<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),f.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*p;let M=this._speech,m=.5+.5*Math.sin(M.t*.5+.8*Math.sin(M.t*.21)),w=M.live?.88:.62,k=(w*M.env+(1-w)*m)*f.speech,y=this._speech.syl?this._speech.syl.f:11;this._churnT+=t*(.55+f.swirl*.85+k*.7),this._waveT+=t*k*.8;let $=this._churnT,T=this._pulseTable(f.speech),A=this._peakTable(t,f,k),O=.003+k*.065,E=this._waveT;if(e.clearRect(0,0,i,o),s)return this._drawIm3(t,e,n,r,a,f,k,g,b,_);let C=this._bootScale(t);C!==1&&(e.save(),e.translate(n,r),e.scale(C,C),e.translate(-n,-r));let S=this._t,R=this._waveT,L=this._spin*.6,U=.955,q=.296,K=.72+.28*Math.sin(S*.21+1.3)*Math.sin(S*.093+4.1),J=.012*Math.sin(S*.16+.7),Q=a*.38*1.16,et=a*.38*.7,Mt=Q*Q,At=Q-et,St=.92,d=.075;e.fillStyle=`rgb(${g},${b},${_})`;let z=this._sprite(g,b,_),j=this._particles,Z=Math.min(j.length,Math.max(400,Math.round(j.length*((Qe=(Jt=this._perf)==null?void 0:Jt.q)!=null?Qe:1))));(!this._mx||this._mx.length<j.length)&&(this._mx=new Float32Array(j.length),this._my=new Float32Array(j.length),this._mr=new Float32Array(j.length),this._mb=new Uint8Array(j.length));let V=this._mx,H=this._my,B=this._mr,I=this._mb,W=0,G=(Ye=(Ge=this._perf)==null?void 0:Ge.q)!=null?Ye:1,st=1+(1-G)*.6,Tt=G>=.5,Xt=(Number(this._config.particle_size)||1)*F(a/220,.75,1.8)*(1+(1-G)*.35);for(let D=0;D<Z;D++){let P=j[D],Y=ge[P.ri],at=P.lon+L*Y.rev+P.drift*$+P.wobA*(1+k*1)*(Math.sin($*P.wobW+P.wobP)+.6*Math.sin($*P.wobW*2.3+P.wobP*2.1)),Xs=Math.cos(at),Js=Math.sin(at),be=P.cosLat*Xs,lt=P.sinLat,Zt=P.cosLat*Js,Zs=.45*Math.sin(5*at-R*1.4+lt*2.3)+.3*Math.sin(8*at+R*1.05-lt*3.1)+.3*Math.sin((be*.9+lt*.32+Zt*.28)*3.1+R*.9)+.2*Math.sin(13*at-R*2.1+lt*1.8),ti=.45*Math.cos(5*at-R*1.4+lt*2.3)+.3*Math.cos(8*at+R*1.05-lt*3.1),Xe=.5+.5*Math.sin(at-$*(.5+P.ri*.13)+P.ri*2.1),ut=K*(.45+1.3*Xe*Xe)*(f.turb+k*.6);ut>1.1&&(ut=1.1);let ei=Math.sin((be*.7-lt*.6+Zt*.4)*7.3+R*1.8),te=Zs*(.4+ut)+ei*.38*ut,Je=P.off+P.bobA*(.7+.6*ut)*(Math.sin($*P.bobW+P.bobP)+.55*Math.sin($*P.bobW*2.7+P.bobP*1.9)),ve=1-Math.min(1,Math.abs(Je)),Ze=f.amp*(1+k*.4),rt=Y.r+f.radius+J+k*.015+Y.amp*Ze*te+Je*Y.thick;te>.75&&(rt+=(te-.75)*.04*ut);let Bt=be,Ut=lt*U-Zt*q,si=lt*q+Zt*U,ee=Math.sqrt(Bt*Bt+Ut*Ut)||1e-4,Ht=Math.atan2(Ut,Bt),we=Ht*.15915494%1;we<0&&(we+=1);let ye=A[we*zt|0];rt+=ye*(.35+.65*ve),rt+=O*(Y.rev<0?.75:1)*(.5*Math.sin(2*Ht+E*.9)+.35*Math.sin(3*Ht-E*1.3+1.7)+.2*Math.sin(5*Ht+E*2.1+.4));let se=(S+P.lt)%P.lf;se/=P.lf,rt+=(se-.5)*.008;let xe=6*se*(1-se);xe>1&&(xe=1);let ii=.24+.76*ve*ve,ft=P.br*Y.glow*ii*xe*(.55+.45*Math.abs(Math.sin(S*P.tw*.6+P.ph)))*f.bright;ft*=.68+.32*Math.sin(at*2.7+$*.45+P.ph*3);let $e=ee*ee;if(ft*=.09+1.6*$e*$e*$e,ft*=.62+.5*Math.max(0,te),ft*=.85+.3*ut,ft*=1+ye*(4+k*6),f.sweep>.01){let X=(Ht-this._head)%6.283185;X<0&&(X+=6.283185),X>3.141593&&(X-=6.283185),ft*=1+Math.exp(-(X*X)/.25)*f.sweep*2.4}let ie=0;if(f.speech>.01){let X=(rt-qs)/Ws*(jt-1);X=X<0?0:X>jt-1?jt-1:X|0,ie=T[X],rt+=ie*.07,ft*=1+ie*1.1+k*.7}rt>St&&(rt=St+d*Math.tanh((rt-St)/d));let ts=rt*a,es=si*.5+.5,ss=P.sz*Xt*(.78+.32*es)*(1+k*.25+ie*.5+ye*(.8+k*2)),is=a*Y.amp*Ze*ti*(.5+ut*.45),oe=ts*Bt-Ut/ee*is,ne=ts*Ut+Bt/ee*is,Dt=1,os=oe*oe+ne*ne;if(os<Mt){if(Dt=(Math.sqrt(os)-et)/At,Dt<.02)continue;Dt*=Dt}let ns=F(ft*st*(.45+.65*es)*Dt,0,1);if(P.halo&&Tt){let X=ss*8;e.globalAlpha=ns*.22,e.drawImage(z,n+oe-X/2,r+ne-X/2,X,X)}let oi=ss*.56;V[W]=n+oe,H[W]=r+ne,B[W]=oi,I[W++]=Math.min(mt-1,ns*mt|0)}for(let D=0;D<mt;D++){e.beginPath();let P=!1;for(let Y=0;Y<W;Y++)I[Y]===D&&(e.moveTo(V[Y]+B[Y],H[Y]),e.arc(V[Y],H[Y],B[Y],0,6.283185),P=!0);P&&(e.globalAlpha=(D+.5)/mt,e.fill())}e.globalAlpha=1,this._segTick(t),this._drawSegs(e,n,r,a,g,b,_);let ot=a*.38*(1+k*.05),nt=F(f.bright*(1+k*.45),.3,1.9);this._drawGlobe(e,n,r,ot,a,nt,`rgba(220,246,255,${.4*nt})`,`rgba(${g},${b},${_},${.13*nt})`),C!==1&&e.restore()}_drawGlobe(t,e,s,i,o,n,r,a){let l=this._t,h=Math.cos(this._spin),p=Math.sin(this._spin),u=Math.cos(.35),f=Math.sin(.35),g=Ke.verts,b=g.length;(!this._proj||this._proj.length!==b*3)&&(this._proj=new Float64Array(b*3));let _=this._proj;for(let m=0;m<b;m++){let w=g[m],k=w[0]*h+w[2]*p,y=-w[0]*p+w[2]*h,$=w[1]*u-y*f;_[m*3]=e+k*i,_[m*3+1]=s-$*i,_[m*3+2]=w[1]*f+y*u}t.save(),t.beginPath(),t.arc(e,s,i,0,Math.PI*2),t.clip();let M=Ke.edges;for(let m=0;m<2;m++){let w=m===1;t.beginPath();for(let k=0;k<M.length;k+=2){let y=M[k]*3,$=M[k+1]*3;_[y+2]+_[$+2]>0===w&&(t.moveTo(_[y],_[y+1]),t.lineTo(_[$],_[$+1]))}t.strokeStyle=w?r:a,t.lineWidth=Math.max(.35,o*(w?.0032:.0024)),t.stroke()}t.fillStyle="rgba(235,252,255,1)";for(let m of Si){let w=m.v*3;if(_[w+2]<=.15)continue;let k=Math.pow(Math.abs(Math.sin(l*m.tw+m.ph)),6)*n;if(k<.04)continue;t.globalAlpha=F(k,0,1);let y=Math.max(1,o*.008);t.fillRect(_[w]-y/2,_[w+1]-y/2,y,y)}t.globalAlpha=1,t.restore()}_drawIm3(t,e,s,i,o,n,r,a,l,h){let p=this._t,u=this._im3Boot(t),f=this._sheetTables(t,r,u.burst);if(u.ring>0){e.save(),e.globalAlpha=u.ring,u.scale!==1&&(e.translate(s,i),e.scale(u.scale,u.scale),e.translate(-s,-i)),this._drawSheetDots(e,s,i,o,n,f,a,l,h),e.globalAlpha=u.ring,this._drawIm3Rings(e,s,i,o,a,l,h,t);let g=o*.3*(1+r*.04),b=F(n.bright*(1+r*.35),.3,1.9),_=M=>Math.round(M+(255-M)*.35);this._drawGlobe(e,s,i,g,o,b*.5,`rgba(${_(a)},${_(l)},${_(h)},${.15*b})`,`rgba(${a},${l},${h},${.045*b})`),e.globalAlpha=u.ring,e.strokeStyle=`rgba(${a},${l},${h},0.55)`,e.lineWidth=Math.max(.8,o*.006),e.beginPath(),e.arc(s,i,g*1.03,0,6.283185),e.stroke(),e.restore()}u.phase&&this._drawIm3Boot(e,s,i,o,u,a,l,h,p)}_drawSheetDots(t,e,s,i,o,n,r,a,l){var T,A,O,E;let h=this._particles;if(!h)return;let p=Math.min(h.length,Math.max(400,Math.round(h.length*((A=(T=this._perf)==null?void 0:T.q)!=null?A:1))));(!this._mx||this._mx.length<h.length)&&(this._mx=new Float32Array(h.length),this._my=new Float32Array(h.length),this._mr=new Float32Array(h.length),this._mb=new Uint8Array(h.length));let u=this._mx,f=this._my,g=this._mr,b=this._mb,_=this._t,M=this._spin*.35,m=(E=(O=this._perf)==null?void 0:O.q)!=null?E:1,w=(Number(this._config.particle_size)||1)*F(i/200,.7,1.8)*(1+(1-m)*.4),k=o.bright/1.6*(1+(1-m)*.7),y=0;for(let C=0;C<p;C++){let S=h[C],R=pt[S.si],L=n[S.si],U=S.th+M*R.dir+S.dr*_,q=U*.15915494%1;q<0&&(q+=1);let K=q*it|0,Q=(L.rc[K]+S.v*L.cw[K]+S.n*.004+.002*Math.sin(_*S.tw+S.ph))*i;u[y]=e+Q*Math.cos(U),f[y]=s+Q*Math.sin(U),g[y]=S.sz*w*.8;let et=Math.abs(S.v),Mt=et>.9&&et<1.1?1.6:1,At=S.br*k*Mt*(S.si===2?.9:.62)*(.75+.25*Math.sin(_*S.tw*.7+S.ph));b[y++]=Math.min(mt-1,F(At,0,1)*mt|0)}let $=t.globalAlpha;t.globalCompositeOperation="lighter",t.fillStyle=`rgb(${r},${a},${l})`,t.globalAlpha=$*.07;for(let C=0;C<2;C++){let S=n[C],R=pt[C].dir;t.beginPath();for(let L=0;L<=it;L++){let U=L%it,q=U/it*6.283185+M*R,K=(S.rc[U]+Math.abs(S.cw[U]))*i;L?t.lineTo(e+K*Math.cos(q),s+K*Math.sin(q)):t.moveTo(e+K*Math.cos(q),s+K*Math.sin(q))}for(let L=it;L>=0;L--){let U=L%it,q=U/it*6.283185+M*R,K=(S.rc[U]-Math.abs(S.cw[U]))*i;t.lineTo(e+K*Math.cos(q),s+K*Math.sin(q))}t.fill("evenodd")}for(let C=0;C<mt;C++){t.beginPath();let S=!1;for(let R=0;R<y;R++)b[R]===C&&(t.moveTo(u[R]+g[R],f[R]),t.arc(u[R],f[R],g[R],0,6.283185),S=!0);S&&(t.globalAlpha=$*((C+.5)/mt),t.fill())}t.globalCompositeOperation="source-over",t.globalAlpha=$}_drawIm3Rings(t,e,s,i,o,n,r,a){var M;let l=t.globalAlpha,h=`rgb(${o},${n},${r})`;t.strokeStyle=h,t.lineWidth=Math.max(.6,i*.003);for(let[m,w]of[[.4,.16],[.47,.08],[.66,.1]])t.globalAlpha=l*w,t.beginPath(),t.arc(e,s,i*m,0,6.283185),t.stroke();let p=i*.56,u=-this._spin*.5;t.globalAlpha=l*.06,t.lineWidth=Math.max(1,i*.008),t.beginPath();for(let m=0;m<24;m++){let w=u+m*.2618;t.moveTo(e+p*Math.cos(w),s+p*Math.sin(w)),t.arc(e,s,p,w,w+.13)}t.stroke(),this._segTick(a);let f=this._segMap;if(!f||!f.size){t.globalAlpha=l;return}let g=0;for(let m of f.values())g+=m.size;if(g<=0){t.globalAlpha=l;return}let b=i*.6,_=this._segRot;t.lineCap="round";for(let m of f.values()){let w=m.size/g*6.283185,k=Math.min(.06,w*.3),y=_+k/2,$=_+w-k/2;if(_+=w,$-y<.004)continue;let T=`rgb(${Math.round(m.rgb[0])},${Math.round(m.rgb[1])},${Math.round(m.rgb[2])})`;t.strokeStyle=T,t.lineWidth=Math.max(1,i*.006),t.globalAlpha=l*.18,t.beginPath(),t.arc(e,s,b,y,$),t.stroke();let A=F((M=m.frac)!=null?M:1,0,1);t.lineWidth=Math.max(1.4,i*.011),t.globalAlpha=l*(m.busy?.75:.45),t.beginPath(),t.arc(e,s,b,y,y+($-y)*Math.max(.04,A)),t.stroke()}t.lineCap="butt",t.strokeStyle=h,t.globalAlpha=l}_im3Boot(t){let e=this._boot,s=Yt;if(!e)return{ring:1,scale:1,burst:0,phase:null};let i=e.t+=t,o=n=>1-(1-n)*(1-n)*(1-n);if(i<s.dot){let n=i/s.dot;return{ring:1-n*.4,scale:1-.98*n*n,burst:0,phase:null}}if(i<s.reactor)return{ring:0,scale:.02,burst:0,phase:"dot",t:i};if(i<s.burst)return{ring:0,scale:.02,burst:0,phase:"reactor",u:(i-s.reactor)/(s.burst-s.reactor),t:i};if(i<s.end){let n=F((i-s.burst)/(s.word-s.burst),0,1),r=n<1?.3+.7*(1+2.70158*(n-1)**3+1.70158*(n-1)**2):1,a=1.2*(1-o(F((i-s.burst)/(s.hold-s.burst),0,1)));return{ring:F((i-s.burst)/.3,0,1),scale:r,burst:a,phase:i>=s.word?"word":"burst",t:i}}return this._boot=null,{ring:1,scale:1,burst:0,phase:null}}_drawIm3Boot(t,e,s,i,o,n,r,a,l){let h=Yt,p=f=>`rgba(${n},${r},${a},${f})`,u=f=>`rgba(${Math.round(n+(255-n)*.5)},${Math.round(r+(255-r)*.5)},${Math.round(a+(255-a)*.5)},${f})`;if(t.save(),o.phase==="dot"){let f=.55+.45*Math.abs(Math.sin((o.t-h.dot)*18));t.fillStyle=u(f),t.beginPath(),t.arc(e,s,Math.max(1.6,i*.012),0,6.283185),t.fill(),t.fillStyle=p(.5*f),t.fillRect(e-i*.07,s+i*.55,i*.14,Math.max(1,i*.006))}else o.phase==="reactor"?this._drawReactor(t,e,s,i,o.u,p,u):o.phase==="burst"&&o.t<h.burst+.35?(t.globalAlpha=1-(o.t-h.burst)/.35,this._drawReactor(t,e,s,i,1,p,u)):o.phase==="word"&&this._drawWordmark(t,e,s,i,o.t-h.word,n,r,a);t.restore()}_drawReactor(t,e,s,i,o,n,r){let l=1-(1-Math.min(1,o/.88))**2,h=i*.2,p=t.globalAlpha,u=40;t.lineWidth=Math.max(2,i*.05);for(let y=0;y<u;y++){let $=-1.5708+y/u*6.283185,T=y/u<l;t.strokeStyle=T?r(.95):n(.12),t.beginPath(),t.arc(e,s,h,$+.02,$+6.283185/u-.03),t.stroke()}t.lineWidth=Math.max(1,i*.006),t.strokeStyle=n(.7);for(let y of[.72,1.32])t.beginPath(),t.arc(e,s,h*y,0,6.283185),t.stroke();let f=t.createRadialGradient(e,s,0,e,s,h*.7);f.addColorStop(0,r(.25+.75*l)),f.addColorStop(1,n(0)),t.fillStyle=f,t.beginPath(),t.arc(e,s,h*.7,0,6.283185),t.fill(),t.strokeStyle=r(.5+.5*l),t.lineWidth=Math.max(1,i*.009),t.beginPath();for(let y=0;y<3;y++){let $=1.5708+y*6.283185/3,T=e+h*.42*Math.cos($),A=s+h*.42*Math.sin($);y?t.lineTo(T,A):t.moveTo(T,A)}t.closePath(),t.stroke();let g=i*1.25,b=i*.13,_=e-g/2,M=s+i*.5;t.globalAlpha=p,t.strokeStyle=n(.55),t.lineWidth=1,t.strokeRect(_,M,g,b),t.fillStyle=n(.1),t.fillRect(_,M,g*l,b);let m=Math.max(9,b*.52);t.font=`600 ${m}px "Avenir Next", "Segoe UI", Roboto, sans-serif`,t.textBaseline="middle",t.fillStyle=r(.95),t.textAlign="left",t.fillText("POWER LEVEL",_+b*.4,M+b/2),t.textAlign="right",t.fillText(`${(l*100).toFixed(1)}%`,_+g-b*.4,M+b/2);let w=_+b*.4+t.measureText("POWER LEVEL").width+m*.5,k=_+g-b*.4-t.measureText("100.0%").width-m*.5;t.fillStyle=n(.6);for(let y=w;y<k;y+=m*.45)t.fillRect(y,M+b*.62,1.2,1.2);t.textAlign="start"}_drawWordmark(t,e,s,i,o,n,r,a){let l=Yt,h=(this._name||"JARVIS").toUpperCase();if(!this._wm||this._wm.half!==i||this._wm.name!==h){let T=Math.round(i*.3),A=document.createElement("canvas");A.width=Math.round(i*1.9),A.height=Math.round(T*1.5);let O=A.getContext("2d");O.fillStyle="#fff",O.font=`italic 900 ${T}px "Arial Black", "Helvetica Neue", Arial, sans-serif`,O.textAlign="center",O.textBaseline="middle",O.setTransform(1,0,-.18,1,T*.13,0);let E=O.measureText(h).width;E>A.width*.92&&(O.font=`italic 900 ${Math.round(T*A.width*.92/E)}px "Arial Black", "Helvetica Neue", Arial, sans-serif`),O.fillText(h,A.width/2,A.height/2);let C=O.getImageData(0,0,A.width,A.height).data,S=Math.max(2,Math.round(i/75)),R=[];for(let J=0;J<A.height;J+=S)for(let Q=0;Q<A.width;Q+=S)C[(J*A.width+Q)*4+3]>140&&R.push(Q-A.width/2,J-A.height/2);let L=Ot(935),U=R.length/2,q=new Float32Array(U*2),K=new Float32Array(U);for(let J=0;J<U;J++){let Q=L()*6.283185,et=i*(.82+L()*.14);q[J*2]=et*Math.cos(Q),q[J*2+1]=et*Math.sin(Q),K[J]=L()}this._wm={half:i,name:h,pts:Float32Array.from(R),from:q,seed:K,w:A.width}}let{pts:p,from:u,seed:f,w:g}=this._wm,b=f.length,_=l.hold-l.word,M=l.gone-l.word,m=l.end-l.word,w=Math.round(n+(255-n)*.45),k=Math.round(r+(255-r)*.45),y=Math.round(a+(255-a)*.45);t.globalCompositeOperation="lighter",t.fillStyle=`rgb(${w},${k},${y})`;let $=Math.max(1,i/130);for(let T=0;T<b;T++){let A=p[T*2],O=p[T*2+1],E=(A/g+.5)*_*.55+f[T]*.12,C=F((o-E)/(_*.42),0,1);C=1-(1-C)**3;let S=u[T*2]+(A-u[T*2])*C,R=u[T*2+1]+(O-u[T*2+1])*C,L=.15+.7*C;if(C>.98&&o<M&&Math.random()<.015&&(S+=(Math.random()-.5)*i*.08),o>M){let U=F((o-M)/(m-M),0,1);S+=S/(Math.abs(S)+1)*U*i*.25*(.4+f[T]),R+=(f[T]-.5)*U*i*.2,L*=1-U}L<.02||(t.globalAlpha=L,t.fillRect(e+S-$/2,s+R-$/2,$,$))}t.globalCompositeOperation="source-over",t.globalAlpha=1}_bootScale(t){let e=this._boot;if(!e)return 1;let s=e.t+=t;if(s<.6)return 1-.98*(s/.6)**2;if(s<1.1)return .02+.012*Math.abs(Math.sin((s-.6)*22));if(s<2.6){let i=(s-1.1)/1.5-1;return .02+.98*(1+2.70158*i*i*i+1.70158*i*i)}return this._boot=null,1}_intro(){if(this._booting)return;this._boot={t:0},this._booting=!0,clearTimeout(this._bootTimer);let t=this._config.animation==="jarvis-im3";this._bootTimer=setTimeout(()=>this._booting=!1,t?Yt.end*1e3:6500);let e=this._name,s=this._config.intro_message||`Allow me to introduce myself. I am ${e}, a virtual artificial intelligence, and I'm here to assist you with a variety of tasks as best I can, 24 hours a day, 7 days a week. Importing all preferences from home interface. Systems are now fully operational.`;setTimeout(()=>{var i;Promise.resolve((i=this._hass)==null?void 0:i.callService("assist_satellite","announce",{entity_id:this._config.entity,message:s,preannounce:!1})).catch(()=>this._toast(`${e} could not speak the introduction.`))},t?Yt.burst*1e3:900)}async _openSheet(t){var e,s,i;this._sheet={kind:t,items:null,q:""};try{let o=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t==="memories"?"memory_list":"skills",service_data:{},return_response:!0});if(((e=this._sheet)==null?void 0:e.kind)!==t)return;this._sheet=gt(N({},this._sheet),{items:((s=o==null?void 0:o.response)==null?void 0:s[t])||[]})}catch(o){((i=this._sheet)==null?void 0:i.kind)===t&&(this._sheet=gt(N({},this._sheet),{items:[],err:this._errText(o)}))}}_renderSheet(){let t=this._sheet,e=t.q.trim().toLowerCase(),s=o=>o.replace(/_/g," ").replace(/^\w/,n=>n.toUpperCase()),i=(t.items||[]).filter(o=>!e||`${o.text||""} ${o.name||""} ${o.description||""}`.toLowerCase().includes(e));return v`<div class="sheet" @click=${o=>o.target===o.currentTarget&&(this._sheet=null)}>
      <div class="sheet-box">
        <div class="sheet-head">
          <span>${t.kind==="memories"?"Memories":`What ${this._name} can do`}</span>
          <button class="sheet-x" title="Close" @click=${()=>this._sheet=null}>×</button>
        </div>
        <input
          type="search"
          placeholder="Filter"
          .value=${t.q}
          @input=${o=>this._sheet=gt(N({},this._sheet),{q:o.target.value})}
        />
        <div class="sheet-list">
          ${t.items==null?v`<div class="dim pad">Loading…</div>`:t.err?v`<div class="perr">${t.err}</div>`:i.length?i.map(o=>t.kind==="memories"?v`<div class="sheet-row">${o.text}${o.person?v`<em>${o.person}</em>`:x}</div>`:v`<div class="sheet-row"><b>${s(o.name)}</b>${o.description.split(". ")[0].replace(/\.?$/,".")}</div>`):v`<div class="dim pad">Nothing here.</div>`}
        </div>
        ${t.kind==="skills"?v`<div class="dim pad small">Plus everything Home Assistant exposes to ${this._name}: lights, media, climate, scenes and scripts.</div>`:x}
      </div>
    </div>`}_todoIds(t){let e=this._config.todo_entities;return Array.isArray(e)&&e.length?e:Object.keys((t==null?void 0:t.states)||{}).filter(s=>s.startsWith("todo.")).sort()}_watchTodos(t){if(this._config.todos===!1||this._config.build_page)return;let e=this._todoIds(t),s=e.map(i=>{var o;return`${i}=${(o=t.states[i])==null?void 0:o.state}`}).join("|");s!==this._todoSig&&(this._todoSig=s,this._loadTodos(e))}async _loadTodos(t){let e=await Promise.all(t.map(async s=>{var n;let i=this._hass.states[s],o=((n=i==null?void 0:i.attributes)==null?void 0:n.friendly_name)||s;if(!i||i.state==="unavailable")return{id:s,name:o,items:[],off:!0};try{let r=await this._hass.callWS({type:"todo/item/list",entity_id:s});return{id:s,name:o,items:((r==null?void 0:r.items)||[]).filter(a=>a.status!=="completed")}}catch(r){return{id:s,name:o,items:[],err:this._errText(r)}}}));this._todos=e}async _todoDone(t,e){this._todos=this._todos.map(s=>s.id===t.id?gt(N({},s),{items:s.items.filter(i=>i.uid!==e.uid)}):s);try{await this._hass.callService("todo","update_item",{item:e.uid,status:"completed"},{entity_id:t.id})}catch(s){this._toast(`Could not tick off ${e.summary}.`),this._todoSig=null,this._watchTodos(this._hass)}}_renderTodos(t){var e;return t||this._config.todos===!1||this._config.build_page||!((e=this._todos)!=null&&e.length)?x:v`<section class="todos">
      ${this._todos.map(s=>v`<div class="todo">
          <div class="phead">
            <span class="ptitle">${s.name}</span>
            ${s.off||s.err?x:v`<span class="tcount">${s.items.length}</span>`}
          </div>
          ${s.off?v`<div class="dim">Unavailable</div>`:s.err?v`<div class="perr">${s.err}</div>`:s.items.length?s.items.map(i=>v`<button class="titem" title="Tick off" @click=${()=>this._todoDone(s,i)}>
                  <span class="tbox"></span><span class="ttext">${i.summary}</span>
                </button>`):v`<div class="dim">Nothing on the list.</div>`}
        </div>`)}
    </section>`}_renderDock(t){if(t||this._config.dock===!1||this._config.build_page)return x;let e=s=>v`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${s}</svg>`;return v`<nav class="dock">
      <button title="Calendar" @click=${()=>this._navigate(this._config.calendar_path)}>
        ${e(Ct`<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2"/>`)}
        <span>Calendar</span>
      </button>
      <button title="Memories" @click=${()=>this._openSheet("memories")}>
        ${e(Ct`<path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 4.5 3 3 0 0 0 6 .5V6.5a2.5 2.5 0 0 0-3-2z"/><path d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 4.5 3 3 0 0 1-6 .5"/><path d="M12 9h-1.5M12 13H9.5M12 9h1.5M12 13h2.5"/>`)}
        <span>Memory</span>
      </button>
      <button class="power ${this._booting?"on":""}" title="Start-up and introduction" @click=${this._intro}>
        ${e(Ct`<path d="M12 3.5v7"/><path d="M7.2 6.6a7 7 0 1 0 9.6 0"/>`)}
      </button>
      <button title="Skills" @click=${()=>this._openSheet("skills")}>
        ${e(Ct`<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>`)}
        <span>Skills</span>
      </button>
      <button title="Build mode" data-ai="toggle-build-mode" @click=${()=>this._setBuild(!0)}>
        ${e(Ct`<path d="M12 2.6c-4 0-7 2.5-7 6.5v4.3c0 2.1.8 4 2.2 5.4L9.6 21h4.8l2.4-2.2c1.4-1.4 2.2-3.3 2.2-5.4V9.1c0-4-3-6.5-7-6.5z"/><path d="M7.3 11.1l3.4 1M16.7 11.1l-3.4 1"/><path d="M12 2.8v4.4M9.8 17.2h4.4M7.4 14.2l2.3 1.6M16.6 14.2l-2.3 1.6"/>`)}
        <span>Build</span>
      </button>
    </nav>`}_fmtElapsed(t){if(t==null)return"";let e=Math.floor(t/60);return e<1?`${Math.floor(t)}s`:e<60?`${e}m`:`${Math.floor(e/60)}h ${e%60}m`}_chipProjects(){let t=o=>o.replace(/\b\w/g,n=>n.toUpperCase()),e=o=>typeof o=="string"?{project:o,label:t(o)}:o,s=this._config.build_projects,i=this._projects||[];return Array.isArray(s)&&s.length?s.map(e).filter(o=>!i.length||i.includes(o.project)):i.map(e)}_renderList(){let t=this._sessions;return v`
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
      ${this._picking?v`<div class="chips">
            ${this._chipProjects().map(e=>v`<button class="chip" @click=${()=>this._newSession(e.project)}>
                ${e.label}
              </button>`)}
          </div>`:x}
      <div class="list">
        ${t==null?v`<div class="dim pad">Scanning…</div>`:t.length===0?v`<div class="dim pad">No sessions running.</div>`:t.map(e=>v`
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
                        title=${e.done?"finished \u2014 not opened yet":x}
                      ></span>
                      <span class="rmain">
                        <span class="rlabel">
                          ${e.title||e.label}
                          ${e.busy?v`<span class="rtime">${this._fmtElapsed(e.elapsed)}</span>`:x}
                        </span>
                        ${e.last_message?v`<span class="rsnip">${e.last_message}</span>`:x}
                        <span class="rmeta">
                          <span class="pill">${e.project}</span>
                          ${e.label!==e.project?v`<span class="pill alt">${e.label.replace(`${e.project}, `,"")}</span>`:x}
                          ${e.model?v`<span class="pill alt">${this._modelName(e)}</span>`:x}
                        </span>
                      </span>
                      <span class="chev">›</span>
                    </button>
                  </div>
                `)}
      </div>
    `}_modelName(t){if((t==null?void 0:t.model)==="local")return"Local";let e=(this._models||[]).find(s=>s.id===(t==null?void 0:t.model));return((e==null?void 0:e.name)||(t==null?void 0:t.model)||"Claude").replace(/^Claude /,"")}_renderHello(t){let e=(t==null?void 0:t.model)==="local",s=this._modelName(t);return v`<div class="hello">
      <div class="hello-ring"><span></span><span></span><span></span></div>
      <div class="hello-name">${e?this._name:"Claude"}</div>
      <div class="hello-sub">
        ${e?"Local":`Cloud \xB7 ${s}`}${t!=null&&t.project?v` · ${t.project}`:x}
      </div>
      <div class="hello-ready">Ready when you are</div>
    </div>`}_useSuggestion(){let t=this._composerEl();!t||!this._suggestion||(t.value=this._suggestion,this._autoGrow(t),this._draftSoon(),t.focus(),t.setSelectionRange(t.value.length,t.value.length))}_renderSession(){let t=(this._sessions||[]).find(e=>e.id===this._sel);return v`
      <div class="phead">
        <button class="hbtn back" data-ai="close-session-view" @click=${()=>this._select(null)}>‹</button>
        <button
          class="ptitle tappable"
          data-ai="session-details"
          title="What is this session?"
          @click=${()=>this._details=!this._details}
        >
          ${(t==null?void 0:t.title)||(t==null?void 0:t.label)||"session"}
          ${t!=null&&t.busy?v`<span class="livedot"></span> working ${this._fmtElapsed(t.elapsed)}`:x}
          <span class="caret">${this._details?"\u25B4":"\u25BE"}</span>
        </button>
        <button
          class="hbtn danger ${this._confirmKill===this._sel?"armed":""}"
          data-ai="end-session"
          @click=${()=>this._killSession(this._sel)}
        >${this._confirmKill===this._sel?"Confirm?":"End"}</button>
      </div>
      ${this._details?v`<div class="details">
            <div class="drow">
              <span class="dkey">Project</span>
              <span class="pill">${(t==null?void 0:t.project)||"unknown"}</span>
              ${t!=null&&t.label&&t.label!==t.project?v`<span class="pill alt">${t.label.replace(`${t.project}, `,"")}</span>`:x}
            </div>
            <div class="drow col">
              <span class="dkey">You opened with</span>
              <span class="dfirst">${(t==null?void 0:t.first_message)||"Nothing recorded yet."}</span>
            </div>
          </div>`:x}
      <div
        class="log"
        @scroll=${e=>{let s=e.target;this._stick=s.scrollHeight-s.scrollTop-s.clientHeight<40}}
      >
        ${this._msgs==null?v`<div class="dim pad">Loading transcript…</div>`:this._msgs.every(e=>e.role==="screen")?this._renderHello(t):this._msgs.map(e=>v`<div class="msg ${e.role}">${this._body(e)}</div>`)}
        ${t!=null&&t.busy?this._activity?v`<div class="activity">${this._activity}</div>`:this._screen?v`<pre class="activity screen-tail" title="No spinner on screen - this is the terminal as it stands">${this._screen}</pre>`:x:x}
        ${this._ask?this._renderAsk(this._ask):x}
        ${(this._queue||[]).filter(e=>e.id===this._sel).map(e=>v`<div class="qitem ${e.state}">
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
                ${e.state==="held"?v`
                      <button class="qbtn" @click=${()=>this._editQueued(e)}>edit</button>
                      <button class="qbtn" @click=${()=>this._dispatch(e)}>send now</button>
                      <button class="qbtn del" @click=${()=>this._dropQueued(e)}>✕</button>
                    `:x}
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
        ${(this._files||[]).length||this._uploading?v`<div class="atts">
              ${(this._files||[]).map(e=>v`<span class="att">
                  <span class="attname">${e.name}</span>
                  <button
                    class="attx"
                    title="Remove"
                    @click=${()=>this._dropFile(e)}
                  >✕</button>
                </span>`)}
              ${this._uploading?v`<span class="att pendingatt">sending…</span>`:x}
            </div>`:x}
        <div
          class="cbox"
          @pointerdown=${e=>{var s;e.target.closest("button, input, textarea, select")||(e.preventDefault(),(s=this._composerEl())==null||s.focus())}}
        >
        <div class="cbtns">
          ${this._sel?this._renderRunControls():x}
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
        ${this._suggestion?v`<button
              type="button"
              class="suggest"
              data-ai="use-suggestion"
              title="Claude Code's suggested reply - tap, or press Tab in an empty box"
              @click=${()=>this._useSuggestion()}
            ><span class="suggest-key">⇥</span>${this._suggestion}</button>`:x}
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
    `}render(){var r,a,l,h;if(!this._config)return x;if(!((a=(r=this._hass)==null?void 0:r.states)==null?void 0:a[this._config.entity]))return v`
        <ha-card>
          <div class="missing">
            Entity <code>${this._config.entity}</code> not found
          </div>
        </ha-card>
      `;let e=this._effectiveState(),s=e==="offline"?this._config.offline_color:this._config[Ds[e]],i=!!this._build,o=(l=this._announce)!=null?l:null,n=(h=this._messages)!=null?h:null;return v`
      <ha-card
        class="bg-${this._config.background}${this._config.honeycomb===!1?"":" comb"}${e==="offline"?" dim":""}${this._config.animation==="jarvis-im3"?" im3":""}"
        style=${this._config.honeycomb===!1?"":`--jr-comb:${Ci(s)}`}
      >
        <div
          class="wrap state-${e} ${i&&!this._config.build_dashboard?"build":""} ${this._config.build_page?"page":""} ${i&&this._config.panel_fullscreen&&!this._config.build_dashboard?"over":""}"
          style=${this._cardVars(s)}
        >
          ${this._config.dock===!1||i||this._config.build_page?v`<button
            class="mode ${i?"on":""}"
            data-ai="toggle-build-mode"
            title="Build mode"
            @click=${()=>this._setBuild(!i)}
          >
            <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>`:x}
          ${o===null?x:v`<button
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
          ${n===null?x:v`<button
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
          ${i&&!this._config.build_dashboard?v`<div class="panel ${this._sel?"open":""} ${this._view?"view":""}">
                <div class="side" style=${this._sideW?`flex-basis:${this._sideW}px`:""}>${this._renderList()}</div>
                <div class="grip" title="Drag to resize" @pointerdown=${this._gripDown}></div>
                <div class="main">
                  ${this._sel?this._renderSession():v`<div class="dim pad empty">Pick a session, or start a new one.</div>`}
                  ${this._err?v`<div class="perr">${this._err}</div>`:x}
                </div>
                ${this._view?v`<div class="viewer">${this._renderViewer()}</div>`:x}
              </div>`:x}
          <div class="ring ${this._config.animation==="jarvis-v1"?"":"bubbles"} ${this._booting?"booting":""}" data-ai="activate-assistant" @click=${this._ringTap}>
            <canvas></canvas>
            ${this._booting&&this._config.animation!=="jarvis-im3"?v`<div class="wordmark" aria-hidden="true">${this._name.toUpperCase()}<small>All systems online</small></div>`:x}
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
                  width=${Lt.w}
                  height=${Lt.h}
                  patternUnits="userSpaceOnUse"
                >
                  <path d=${Ys} class="hex" />
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
          ${this._renderTodos(i)}
          ${this._sheet?this._renderSheet():x}
        </div>
      </ha-card>
    `}};Nt(It,"build",Qs),Nt(It,"properties",{_config:{state:!0},_todos:{state:!0},_state:{state:!0},_mp:{state:!0},_build:{state:!0},_sessions:{state:!0},_projects:{state:!0},_sel:{state:!0},_msgs:{state:!0},_ask:{state:!0},_askSent:{state:!0},_activity:{state:!0},_screen:{state:!0},_permission:{state:!0},_modelBusy:{state:!0},_models:{state:!0},_suggestion:{state:!0},_modes:{state:!0},_model:{state:!0},_queue:{state:!0},_swipe:{state:!0},_details:{state:!0},_view:{state:!0},_sideW:{state:!0},_files:{state:!0},_dragging:{state:!0},_uploading:{state:!0},_err:{state:!0},_confirmKill:{state:!0},_picking:{state:!0},_pending:{state:!0},_voiceState:{state:!0},_announce:{state:!0},_messages:{state:!0},_dictating:{state:!0},_booting:{state:!0},_sheet:{state:!0}}),Nt(It,"styles",Ae`
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
        linear-gradient(160deg, rgba(10, 24, 32, 0.92), rgba(4, 10, 14, 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(53, 154, 210, 0.35));
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(46, 157, 245, 0.08);
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
      line-height: 1;
    }
    .dock button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      min-width: 0;
      padding: 7px 2px 6px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: none;
      color: var(--jr-panel-text, #bfe3f5);
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
      background: rgba(46, 157, 245, 0.12);
      border-color: rgba(53, 154, 210, 0.4);
      box-shadow: 0 0 10px rgba(46, 157, 245, 0.25);
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
      border: 1px solid var(--jr-panel-border, rgba(53, 154, 210, 0.45));
      background: radial-gradient(circle at 50% 40%, rgba(16, 40, 48, 0.98), rgba(3, 8, 11, 0.98));
      box-shadow: 0 0 0 4px rgba(3, 8, 11, 0.9), 0 0 16px rgba(46, 157, 245, 0.25), inset 0 0 14px rgba(46, 157, 245, 0.15);
      opacity: 1;
    }
    .dock button.power svg {
      width: 100%;
      height: 100%;
    }
    .dock button.power:hover,
    .dock button.power.on {
      border-color: var(--jr-color);
      box-shadow: 0 0 0 4px rgba(3, 8, 11, 0.9), 0 0 22px var(--jr-color), inset 0 0 16px rgba(46, 157, 245, 0.25);
      background: radial-gradient(circle at 50% 40%, rgba(16, 40, 48, 0.98), rgba(3, 8, 11, 0.98));
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
      background: rgba(46, 157, 245, 0.1);
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
  `);var ji=[{name:"entity",required:!0,selector:{entity:{domain:_e}}},{name:"animation",selector:{select:{mode:"dropdown",options:[{value:"hubbubb",label:"Hubbubb - ring and bubbles"},{value:"jarvis-v1",label:"Jarvis v1 - segments and motes"},{value:"jarvis-im3",label:"Jarvis IM3 - folding film, as in the film"}]}}},{name:"assistant_name",selector:{text:{}}},{name:"size",selector:{number:{min:80,max:600,step:10,mode:"slider"}}},{name:"background",selector:{select:{mode:"dropdown",options:[{value:"dark",label:"Deep space (dark)"},{value:"card",label:"Normal card background"},{value:"transparent",label:"Transparent"}]}}},{name:"honeycomb",selector:{boolean:{}}},{name:"todos",selector:{boolean:{}}},{name:"todo_entities",selector:{entity:{domain:"todo",multiple:!0}}},{name:"tap_message",selector:{text:{}}},{name:"",type:"expandable",title:"Toggles",icon:"mdi:toggle-switch-outline",schema:[{name:"build_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"announce_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"messages_entity",selector:{entity:{domain:["switch","input_boolean"]}}}]},{name:"",type:"expandable",title:"Build panel",icon:"mdi:hexagon-multiple-outline",schema:[{name:"panel_fullscreen",selector:{boolean:{}}},{name:"panel_height",selector:{number:{min:0,max:1400,step:20,mode:"box"}}},{name:"build_projects",selector:{text:{multiple:!0}}},{name:"build_dashboard",selector:{text:{}}},{name:"build_page",selector:{boolean:{}}},{name:"build_return",selector:{text:{}}}]},{name:"",type:"expandable",title:"Ring colours",icon:"mdi:palette",schema:[{name:"idle_color",selector:{text:{}}},{name:"listening_color",selector:{text:{}}},{name:"processing_color",selector:{text:{}}},{name:"responding_color",selector:{text:{}}},{name:"offline_color",selector:{text:{}}}]},{name:"",type:"expandable",title:"Panel colours",icon:"mdi:console",schema:[{name:"panel_bg",selector:{text:{}}},{name:"panel_border",selector:{text:{}}},{name:"panel_text",selector:{text:{}}},{name:"terminal_bg",selector:{text:{}}},{name:"terminal_text",selector:{text:{}}}]},{name:"",type:"expandable",title:"Advanced",icon:"mdi:tune",schema:[{name:"follow_media_player",selector:{boolean:{}}},{name:"audio_offset",selector:{number:{min:-2,max:2,step:.05,mode:"box"}}},{name:"media_player",selector:{entity:{domain:"media_player"}}},{name:"particle_size",selector:{number:{min:.3,max:3,step:.1,mode:"slider"}}},{name:"particles",selector:{number:{min:0,max:4e3,step:20,mode:"box"}}}]}],Pi={entity:"Assist satellite",animation:"Animation",assistant_name:"Assistant name",size:"Ring size (px)",background:"Card background",honeycomb:"Honeycomb background",todos:"To-do lists on the main screen",todo_entities:"Which to-do lists (empty = all)",follow_media_player:"Animate while the device is playing audio",audio_offset:"Audio sync offset (seconds)",media_player:"Speaker entity (blank = same device)",tap_message:"Spoken reply when the ring is tapped",particles:"Particle count, Jarvis v1 (0 = auto)",particle_size:"How many bubbles (1 = about 22)",build_entity:"Build mode toggle",announce_entity:"Agent announcement toggle",messages_entity:"Hubbubb message toggle",panel_fullscreen:"Full screen (floats over the dashboard)",panel_height:"Panel height in px (0 = match the ring)",build_projects:"Projects offered by + New (blank = all the companion has)",build_dashboard:"Open this dashboard instead",build_page:"This card IS the build dashboard",build_return:"Exit goes back to",idle_color:"Idle",listening_color:"Listening",processing_color:"Processing",responding_color:"Responding",offline_color:"Unavailable",panel_bg:"Panel background",panel_border:"Panel border",panel_text:"Panel text",terminal_bg:"Terminal background",terminal_text:"Terminal text"},me=class extends dt{setConfig(t){this._config=N(N({},We),t)}render(){return this._config?v`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ji}
        .computeLabel=${t=>{var e;return(e=Pi[t.name])!=null?e:t.name}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:x}_valueChanged(t){t.stopPropagation();let e=N({},t.detail.value);for(let[s,i]of Object.entries(We))e[s]===i&&delete e[s];delete e.name,delete e.show_state,Fe(this,"config-changed",{config:e})}};Nt(me,"properties",{hass:{},_config:{state:!0}});customElements.define("hubbubb-ring-card",It);customElements.define("hubbubb-ring-card-editor",me);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-ring-card",name:"Hubbubb Ring",description:"Animated glowing ring that reacts to an Assist satellite's state.",preview:!0});console.info(`%c HUBBUBB-RING-CARD %c v${wi} `,"color:#0b1620;background:#35e0ff;font-weight:700","color:#35e0ff;background:#0b1620");
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
