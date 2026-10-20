var Nt=Object.defineProperty,Ot=Object.defineProperties;var Mt=Object.getOwnPropertyDescriptors;var ot=Object.getOwnPropertySymbols;var Rt=Object.prototype.hasOwnProperty,Tt=Object.prototype.propertyIsEnumerable;var B=(r,t,e)=>t in r?Nt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,b=(r,t)=>{for(var e in t||(t={}))Rt.call(t,e)&&B(r,e,t[e]);if(ot)for(var e of ot(t))Tt.call(t,e)&&B(r,e,t[e]);return r},y=(r,t)=>Ot(r,Mt(t));var I=(r,t,e)=>B(r,typeof t!="symbol"?t+"":t,e);var D=globalThis,j=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),nt=new WeakMap,P=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(j&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=nt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&nt.set(e,t))}return t}toString(){return this.cssText}},at=r=>new P(typeof r=="string"?r:r+"",void 0,V),W=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new P(e,r,V)},lt=(r,t)=>{if(j)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},F=j?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return at(e)})(r):r;var{is:Ht,defineProperty:Lt,getOwnPropertyDescriptor:zt,getOwnPropertyNames:Dt,getOwnPropertySymbols:jt,getPrototypeOf:qt}=Object,$=globalThis,ht=$.trustedTypes,Bt=ht?ht.emptyScript:"",K=$.reactiveElementPolyfillSupport,U=(r,t)=>r,J={toAttribute(r,t){switch(t){case Boolean:r=r?Bt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch(s){e=null}}return e}},_t=(r,t)=>!Ht(r,t),ct={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:_t},dt,pt;(dt=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(pt=$.litPropertyMetadata)!=null||($.litPropertyMetadata=new WeakMap);var f=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ct){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Lt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var o;let{get:i,set:n}=(o=zt(this.prototype,t))!=null?o:{get(){return this[e]},set(l){this[e]=l}};return{get:i,set(l){let a=i==null?void 0:i.call(this);n==null||n.call(this,l),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:ct}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let t=qt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let e=this.properties,s=[...Dt(e),...jt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(F(i))}else t!==void 0&&e.push(F(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return lt(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:J).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n,o,l;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),c=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:J;this._$Em=i;let d=c.fromAttribute(e,a.type);this[i]=(l=d!=null?d:(o=this._$Ej)==null?void 0:o.get(i))!=null?l:d,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){var o,l;if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),s!=null||(s=a.getPropertyOptions(t)),!(((o=s.hasChanged)!=null?o:_t)(n,e)||s.useDefault&&s.reflect&&n===((l=this._$Ej)==null?void 0:l.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){var l,a,c;s&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=o!=null?o:e)!=null?a:this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((c=this._$Eq)!=null?c:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,l]of this._$Ep)this[o]=l;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,l]of n){let{wrapped:a}=l,c=this[o];a!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,l,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},ut;f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[U("elementProperties")]=new Map,f[U("finalized")]=new Map,K==null||K({ReactiveElement:f}),((ut=$.reactiveElementVersions)!=null?ut:$.reactiveElementVersions=[]).push("2.1.2");var O=globalThis,ft=r=>r,q=O.trustedTypes,mt=q?q.createPolicy("lit-html",{createHTML:r=>r}):void 0,At="$lit$",g=`lit$${Math.random().toFixed(9).slice(2)}$`,wt="?"+g,It=`<${wt}>`,w=document,M=()=>w.createComment(""),R=r=>r===null||typeof r!="object"&&typeof r!="function",st=Array.isArray,Vt=r=>st(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",G=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$t=/-->/g,gt=/>/g,x=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,bt=/"/g,St=/^(?:script|style|textarea|title)$/i,it=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=it(1),ee=it(2),se=it(3),S=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),yt=new WeakMap,A=w.createTreeWalker(w,129);function Et(r,t){if(!st(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return mt!==void 0?mt.createHTML(t):t}var Wt=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=N;for(let l=0;l<e;l++){let a=r[l],c,d,p=-1,_=0;for(;_<a.length&&(o.lastIndex=_,d=o.exec(a),d!==null);)_=o.lastIndex,o===N?d[1]==="!--"?o=$t:d[1]!==void 0?o=gt:d[2]!==void 0?(St.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=x):d[3]!==void 0&&(o=x):o===x?d[0]===">"?(o=i!=null?i:N,p=-1):d[1]===void 0?p=-2:(p=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?x:d[3]==='"'?bt:vt):o===bt||o===vt?o=x:o===$t||o===gt?o=N:(o=x,i=void 0);let m=o===x&&r[l+1].startsWith("/>")?" ":"";n+=o===N?a+It:p>=0?(s.push(c),a.slice(0,p)+At+a.slice(p)+g+m):a+g+(p===-2?l:m)}return[Et(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},T=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,l=t.length-1,a=this.parts,[c,d]=Wt(t,e);if(this.el=r.createElement(c,s),A.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=A.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(At)){let _=d[o++],m=i.getAttribute(p).split(g),z=/([.?@])?(.*)/.exec(_);a.push({type:1,index:n,name:z[2],strings:m,ctor:z[1]==="."?X:z[1]==="?"?Y:z[1]==="@"?tt:C}),i.removeAttribute(p)}else p.startsWith(g)&&(a.push({type:6,index:n}),i.removeAttribute(p));if(St.test(i.tagName)){let p=i.textContent.split(g),_=p.length-1;if(_>0){i.textContent=q?q.emptyScript:"";for(let m=0;m<_;m++)i.append(p[m],M()),A.nextNode(),a.push({type:2,index:++n});i.append(p[_],M())}}}else if(i.nodeType===8)if(i.data===wt)a.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(g,p+1))!==-1;)a.push({type:7,index:n}),p+=g.length-1}n++}}static createElement(t,e){let s=w.createElement("template");return s.innerHTML=t,s}};function k(r,t,e=r,s){var o,l,a;if(t===S)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl,n=R(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=k(r,i._$AS(r,t.values),i,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var c;let{el:{content:e},parts:s}=this._$AD,i=((c=t==null?void 0:t.creationScope)!=null?c:w).importNode(e,!0);A.currentNode=i;let n=A.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new H(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new et(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=A.nextNode(),o++)}return A.currentNode=w,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},H=class r{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var n;this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(n=i==null?void 0:i.isConnected)!=null?n:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),R(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Vt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){var n;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=T.createElement(Et(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{let o=new Q(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=yt.get(t.strings);return e===void 0&&yt.set(t.strings,e=new T(t)),e}k(t){st(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(M()),this.O(M()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=ft(t).nextSibling;ft(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=k(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==S,o&&(this._$AH=t);else{let l=t,a,c;for(t=n[0],a=0;a<n.length-1;a++)c=k(this,l[s+a],e,a),c===S&&(c=this._$AH[a]),o||(o=!R(c)||c!==this._$AH[a]),c===h?t=h:t!==h&&(t+=(c!=null?c:"")+n[a+1]),this._$AH[a]=c}o&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},X=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},Y=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},tt=class extends C{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){var o;if((t=(o=k(this,t,e,0))!=null?o:h)===S)return;let s=this._$AH,i=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},et=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}};var Z=O.litHtmlPolyfillSupport,xt;Z==null||Z(T,H),((xt=O.litHtmlVersions)!=null?xt:O.litHtmlVersions=[]).push("3.3.3");var kt=(r,t,e)=>{var n,o;let s=(n=e==null?void 0:e.renderBefore)!=null?n:t,i=s._$litPart$;if(i===void 0){let l=(o=e==null?void 0:e.renderBefore)!=null?o:null;s._$litPart$=i=new H(t.insertBefore(M(),l),l,void 0,e!=null?e:{})}return i._$AI(r),i};var E=globalThis,v=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=kt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return S}},Ct;v._$litElement$=!0,v.finalized=!0,(Ct=E.litElementHydrateSupport)==null||Ct.call(E,{LitElement:v});var rt=E.litElementPolyfillSupport;rt==null||rt({LitElement:v});var Pt;((Pt=E.litElementVersions)!=null?Pt:E.litElementVersions=[]).push("4.2.2");var Ft=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-recipes ${Ft}`);var Ut=r=>String(r||"").split(`
`).map(t=>t.replace(/^\s*(?:[-*•]|\d+[.)])\s*/,"").trim()).filter(Boolean),Kt=(r,t)=>{let e=(t||"").trim().toLowerCase();return(e?r.filter(i=>i.title.toLowerCase().includes(e)||(i.ingredients||[]).some(n=>n.toLowerCase().includes(e))):r.slice()).sort((i,n)=>i.title.localeCompare(n.title))},Jt=r=>y(b({},r.id?{id:r.id}:{}),{title:(r.title||"").trim(),ingredients:Ut(r.ingredients),steps:Ut(r.steps),source:(r.source||"").trim()}),Gt=()=>({id:null,title:"",ingredients:"",steps:"",source:""}),L=class extends v{constructor(){super(),this._recipes=[],this._q="",this._sel=null,this._form=null,this._err="",this._busy=!1,this._confirm=!1,this._find=null}connectedCallback(){super.connectedCallback(),this._onVisible=()=>document.visibilityState==="visible"&&this._load(),document.addEventListener("visibilitychange",this._onVisible),this._unsub=this.hass.connection.subscribeEvents(()=>this._load(),"hubbubb_home_recipes"),this._load()}disconnectedCallback(){var t;document.removeEventListener("visibilitychange",this._onVisible),(t=this._unsub)==null||t.then(e=>e()).catch(()=>{}),super.disconnectedCallback()}async _call(t,e={}){let s=await this.hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0});return(s==null?void 0:s.response)||{}}async _try(t){this._busy=!0,this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}finally{this._busy=!1}}async _load(){let t=await this._try(()=>this._call("recipe_list"));t&&(this._recipes=t.recipes||[])}get _current(){return this._recipes.find(t=>t.id===this._sel)||null}_open(t){this._sel=t.id,this._form=null,this._find=null,this._confirm=!1}_edit(t){this._form=t?{id:t.id,title:t.title,ingredients:t.ingredients.join(`
`),steps:t.steps.join(`
`),source:t.source}:Gt(),this._find=null,this._confirm=!1}async _search(){let t=this._find.q.trim();if(!t)return;this._find=y(b({},this._find),{results:null,open:null});let e=await this._try(()=>this._call("recipe_web",{query:t}));this._find&&(this._find=y(b({},this._find),{results:(e==null?void 0:e.recipes)||[],searched:e?t:""}))}async _add(t){let{title:e,ingredients:s,steps:i,source:n}=t,o=await this._try(()=>this._call("recipe_save",{title:e,ingredients:s,steps:i,source:n}));o&&(await this._load(),this._find=null,this._sel=o.recipe.id)}async _save(){let t=Jt(this._form);if(!t.title)return this._err="Give it a title.";let e=await this._try(()=>this._call("recipe_save",t));e&&(await this._load(),this._sel=e.recipe.id,this._form=null)}async _delete(t){if(!this._confirm)return this._confirm=!0;await this._try(()=>this._call("recipe_delete",{id:t.id}))&&(this._sel=null,this._confirm=!1,await this._load())}_set(t){return e=>this._form=y(b({},this._form),{[t]:e.target.value})}render(){let t=Kt(this._recipes,this._q),e=!this.narrow||!this._current&&!this._form&&!this._find,s=!this.narrow||this._current||this._form||this._find;return u`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        ${this.narrow&&s?u`<button class="back" @click=${()=>{this._sel=null,this._form=null,this._find=null}}>‹</button>`:h}
        <div class="title">Recipes</div>
        <button class="add" ?disabled=${this._busy} @click=${()=>{this._form=null,this._find={q:"",results:[],open:null}}}>+ Add</button>
      </div>
      ${this._err?u`<div class="err" @click=${()=>this._err=""}>${this._err}<span class="x">dismiss</span></div>`:h}
      <div class="cols">
        ${e?u`<div class="col side">
              <input class="search" type="search" placeholder="Search recipes or ingredients" .value=${this._q} @input=${i=>this._q=i.target.value} />
              ${t.length?t.map(i=>u`<div class="row ${i.id===this._sel?"on":""}" @click=${()=>this._open(i)}>
                      <div class="name">${i.title}</div>
                      <div class="meta">${i.ingredients.length} ingredients · ${i.steps.length} steps</div>
                    </div>`):u`<div class="empty">${this._recipes.length?"Nothing matches.":"No recipes yet. Add one, or ask the house for a dish and say yes when it offers to save it."}</div>`}
            </div>`:h}
        ${s?u`<div class="col main">${this._find?this._renderFind():this._form?this._renderForm():this._current?this._renderRecipe(this._current):u`<div class="empty">Pick a recipe.</div>`}</div>`:h}
      </div>
    `}_renderRecipe(t){return u`
      <div class="card">
        <div class="head">
          <h2>${t.title}</h2>
          <div class="actions">
            <button ?disabled=${this._busy} @click=${()=>this._edit(t)}>Edit</button>
            <button class="danger" ?disabled=${this._busy} @click=${()=>this._delete(t)}>
              ${this._confirm?"Really delete?":"Delete"}
            </button>
          </div>
        </div>
        ${t.source?u`<div class="source">${/^https?:\/\//.test(t.source)?u`<a href=${t.source} target="_blank" rel="noopener">${t.source}</a>`:t.source}</div>`:h}
        <h3>Ingredients</h3>
        <ul>${t.ingredients.map(e=>u`<li>${e}</li>`)}</ul>
        <h3>Steps</h3>
        <ol>${t.steps.map(e=>u`<li>${e}</li>`)}</ol>
        <div class="meta">Saved ${t.created}</div>
      </div>
    `}_renderFind(){let t=this._find;return u`
      <div class="card">
        <h2>What would you like to make?</h2>
        <form class="find" @submit=${e=>{e.preventDefault(),this._search()}}>
          <input autofocus placeholder="e.g. a quick weeknight chicken curry" .value=${t.q} @input=${e=>this._find=y(b({},this._find),{q:e.target.value})} />
          <button class="primary" ?disabled=${this._busy||!t.q.trim()}>Find</button>
        </form>
        <div class="meta">or <a href="#" @click=${e=>{e.preventDefault(),this._edit(null)}}>write one in yourself</a></div>
      </div>
      ${t.results===null?u`<div class="empty">Looking for recipes…</div>`:t.results.map((e,s)=>u`
            <div class="card hit">
              ${e.image?u`<img src=${e.image} alt="" loading="lazy" referrerpolicy="no-referrer" />`:h}
              <div class="body">
                <div class="name">${e.title}</div>
                <div class="meta">${[e.site,e.time,e.serves&&`serves ${e.serves}`,e.rating&&`\u2605 ${e.rating}${e.reviews?` (${e.reviews})`:""}`].filter(Boolean).join(" \xB7 ")}</div>
                <div class="meta">${e.ingredients.length} ingredients · ${e.steps.length} steps</div>
                <div class="actions">
                  <button class="primary" ?disabled=${this._busy} @click=${()=>this._add(e)}>Add to cookbook</button>
                  <button @click=${()=>this._find=y(b({},t),{open:t.open===s?null:s})}>${t.open===s?"Hide":"Preview"}</button>
                  <a class="link" href=${e.source} target="_blank" rel="noopener">Open page</a>
                </div>
                ${t.open===s?u`<h3>Ingredients</h3><ul>${e.ingredients.map(i=>u`<li>${i}</li>`)}</ul>
                      <h3>Steps</h3><ol>${e.steps.map(i=>u`<li>${i}</li>`)}</ol>`:h}
              </div>
            </div>`)}
      ${t.searched&&t.results&&!t.results.length?u`<div class="empty">No recipes found for "${t.searched}". Try different words.</div>`:h}
    `}_renderForm(){let t=this._form;return u`
      <div class="card">
        <h2>${t.id?"Edit recipe":"New recipe"}</h2>
        <label>Title<input .value=${t.title} @input=${this._set("title")} /></label>
        <label>Source<input .value=${t.source} placeholder="URL or where it came from" @input=${this._set("source")} /></label>
        <label>Ingredients <span class="hint">one per line</span><textarea rows="8" .value=${t.ingredients} @input=${this._set("ingredients")}></textarea></label>
        <label>Steps <span class="hint">one per line</span><textarea rows="10" .value=${t.steps} @input=${this._set("steps")}></textarea></label>
        <div class="actions">
          <button class="primary" ?disabled=${this._busy} @click=${()=>this._save()}>Save</button>
          <button ?disabled=${this._busy} @click=${()=>this._form=null}>Cancel</button>
        </div>
      </div>
    `}};I(L,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_recipes:{state:!0},_q:{state:!0},_sel:{state:!0},_form:{state:!0},_err:{state:!0},_busy:{state:!0},_confirm:{state:!0},_find:{state:!0}}),I(L,"styles",W`
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
    .title { font-size: 20px; font-weight: 400; flex: 1; }
    .bar button {
      background: rgba(255, 255, 255, 0.16);
      color: inherit;
      border: 0;
      border-radius: 6px;
      padding: 6px 12px;
      font: inherit;
      cursor: pointer;
    }
    .bar .back { font-size: 22px; line-height: 1; padding: 2px 10px; }
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
    .err .x { opacity: 0.7; font-size: 12px; white-space: nowrap; }
    .cols {
      display: grid;
      grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
      gap: 16px;
      padding: 16px;
      max-width: 1100px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    @media (max-width: 760px) {
      .cols { grid-template-columns: minmax(0, 1fr); padding: 12px; }
    }
    .search {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      font: inherit;
    }
    .row {
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      background: var(--card-background-color);
      margin-bottom: 6px;
      border: 1px solid transparent;
    }
    .row:hover { border-color: var(--divider-color); }
    .row.on { border-color: var(--primary-color); }
    .name { font-weight: 500; }
    .meta { font-size: 12px; opacity: 0.65; margin-top: 2px; }
    .empty { opacity: 0.65; padding: 24px 12px; text-align: center; }
    .card {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    h2 { margin: 0 0 8px; font-size: 22px; font-weight: 500; }
    h3 { margin: 18px 0 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.7; }
    ul, ol { margin: 0; padding-left: 22px; line-height: 1.7; }
    .source { font-size: 13px; opacity: 0.8; word-break: break-all; }
    .source a { color: var(--primary-color); }
    label { display: block; margin: 10px 0 0; font-size: 13px; opacity: 0.9; }
    .hint { opacity: 0.6; }
    input, textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 4px;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    .actions { display: flex; gap: 8px; margin-top: 16px; }
    .actions button {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .actions .primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    .actions .danger { color: var(--error-color, #db4437); }
    button:disabled { opacity: 0.5; cursor: default; }
    .find { display: flex; gap: 8px; margin: 8px 0; }
    .find input { margin: 0; flex: 1; }
    .find button, .actions .link {
      padding: 8px 14px;
      border-radius: 8px;
      border: 0;
      font: inherit;
      cursor: pointer;
    }
    .find button { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .actions .link { color: var(--primary-color); text-decoration: none; align-self: center; }
    .meta a { color: var(--primary-color); }
    .hit { display: flex; gap: 16px; margin-top: 12px; align-items: flex-start; }
    .hit img { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; flex: none; }
    .hit .body { flex: 1; min-width: 0; }
    .hit .actions { flex-wrap: wrap; margin-top: 10px; }
    @media (max-width: 500px) {
      .hit { flex-direction: column; }
      .hit img { width: 100%; height: 160px; }
    }
  `);customElements.define("hubbubb-recipes",L);export{Kt as filterRecipes,Jt as formData,Ut as parseLines};
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
