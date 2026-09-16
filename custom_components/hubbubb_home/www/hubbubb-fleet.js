var Tt=Object.defineProperty,Ut=Object.defineProperties;var Nt=Object.getOwnPropertyDescriptors;var rt=Object.getOwnPropertySymbols;var Ot=Object.prototype.hasOwnProperty,Rt=Object.prototype.propertyIsEnumerable;var L=(r,t,e)=>t in r?Tt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,B=(r,t)=>{for(var e in t||(t={}))Ot.call(t,e)&&L(r,e,t[e]);if(rt)for(var e of rt(t))Rt.call(t,e)&&L(r,e,t[e]);return r},ot=(r,t)=>Ut(r,Nt(t));var I=(r,t,e)=>L(r,typeof t!="symbol"?t+"":t,e);var R=globalThis,H=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,q=Symbol(),nt=new WeakMap,E=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(H&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=nt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&nt.set(e,t))}return t}toString(){return this.cssText}},at=r=>new E(typeof r=="string"?r:r+"",void 0,q),W=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new E(e,r,q)},lt=(r,t)=>{if(H)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=R.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},V=H?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return at(e)})(r):r;var{is:Ht,defineProperty:Dt,getOwnPropertyDescriptor:Lt,getOwnPropertyNames:Bt,getOwnPropertySymbols:It,getPrototypeOf:qt}=Object,f=globalThis,ht=f.trustedTypes,Wt=ht?ht.emptyScript:"",Y=f.reactiveElementPolyfillSupport,C=(r,t)=>r,K={toAttribute(r,t){switch(t){case Boolean:r=r?Wt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch(s){e=null}}return e}},gt=(r,t)=>!Ht(r,t),pt={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:gt},dt,ct;(dt=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(ct=f.litPropertyMetadata)!=null||(f.litPropertyMetadata=new WeakMap);var _=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=pt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Dt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var n;let{get:i,set:o}=(n=Lt(this.prototype,t))!=null?n:{get(){return this[e]},set(l){this[e]=l}};return{get:i,set(l){let a=i==null?void 0:i.call(this);o==null||o.call(this,l),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:pt}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=qt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,s=[...Bt(e),...It(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(V(i))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return lt(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:K).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var o,n,l;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),c=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)==null?void 0:o.fromAttribute)!==void 0?a.converter:K;this._$Em=i;let h=c.fromAttribute(e,a.type);this[i]=(l=h!=null?h:(n=this._$Ej)==null?void 0:n.get(i))!=null?l:h,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){var n,l;if(t!==void 0){let a=this.constructor;if(i===!1&&(o=this[t]),s!=null||(s=a.getPropertyOptions(t)),!(((n=s.hasChanged)!=null?n:gt)(o,e)||s.useDefault&&s.reflect&&o===((l=this._$Ej)==null?void 0:l.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){var l,a,c;s&&!((l=this._$Ej)!=null?l:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=n!=null?n:e)!=null?a:this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((c=this._$Eq)!=null?c:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,l]of this._$Ep)this[n]=l;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,l]of o){let{wrapped:a}=l,c=this[n];a!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,l,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},ut;_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[C("elementProperties")]=new Map,_[C("finalized")]=new Map,Y==null||Y({ReactiveElement:_}),((ut=f.reactiveElementVersions)!=null?ut:f.reactiveElementVersions=[]).push("2.1.2");var j=globalThis,_t=r=>r,D=j.trustedTypes,mt=D?D.createPolicy("lit-html",{createHTML:r=>r}):void 0,wt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,At="?"+b,Vt=`<${At}>`,y=document,z=()=>y.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",et=Array.isArray,Yt=r=>et(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",X=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ft=/-->/g,bt=/>/g,x=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,xt=/"/g,kt=/^(?:script|style|textarea|title)$/i,st=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),p=st(1),se=st(2),ie=st(3),w=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),$t=new WeakMap,$=y.createTreeWalker(y,129);function St(r,t){if(!et(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return mt!==void 0?mt.createHTML(t):t}var Kt=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=P;for(let l=0;l<e;l++){let a=r[l],c,h,u=-1,g=0;for(;g<a.length&&(n.lastIndex=g,h=n.exec(a),h!==null);)g=n.lastIndex,n===P?h[1]==="!--"?n=ft:h[1]!==void 0?n=bt:h[2]!==void 0?(kt.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=x):h[3]!==void 0&&(n=x):n===x?h[0]===">"?(n=i!=null?i:P,u=-1):h[1]===void 0?u=-2:(u=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?x:h[3]==='"'?xt:vt):n===xt||n===vt?n=x:n===ft||n===bt?n=P:(n=x,i=void 0);let m=n===x&&r[l+1].startsWith("/>")?" ":"";o+=n===P?a+Vt:u>=0?(s.push(c),a.slice(0,u)+wt+a.slice(u)+b+m):a+b+(u===-2?l:m)}return[St(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},T=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[c,h]=Kt(t,e);if(this.el=r.createElement(c,s),$.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=$.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(wt)){let g=h[n++],m=i.getAttribute(u).split(b),O=/([.?@])?(.*)/.exec(g);a.push({type:1,index:o,name:O[2],strings:m,ctor:O[1]==="."?Z:O[1]==="?"?G:O[1]==="@"?Q:S}),i.removeAttribute(u)}else u.startsWith(b)&&(a.push({type:6,index:o}),i.removeAttribute(u));if(kt.test(i.tagName)){let u=i.textContent.split(b),g=u.length-1;if(g>0){i.textContent=D?D.emptyScript:"";for(let m=0;m<g;m++)i.append(u[m],z()),$.nextNode(),a.push({type:2,index:++o});i.append(u[g],z())}}}else if(i.nodeType===8)if(i.data===At)a.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(b,u+1))!==-1;)a.push({type:7,index:o}),u+=b.length-1}o++}}static createElement(t,e){let s=y.createElement("template");return s.innerHTML=t,s}};function k(r,t,e=r,s){var n,l,a;if(t===w)return t;let i=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl,o=M(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=k(r,i._$AS(r,t.values),i,s)),t}var F=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var c;let{el:{content:e},parts:s}=this._$AD,i=((c=t==null?void 0:t.creationScope)!=null?c:y).importNode(e,!0);$.currentNode=i;let o=$.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new U(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new tt(o,this,t)),this._$AV.push(h),a=s[++l]}n!==(a==null?void 0:a.index)&&(o=$.nextNode(),n++)}return $.currentNode=y,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},U=class r{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var o;this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),M(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==w&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Yt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(y.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=T.createElement(St(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{let n=new F(i,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new T(t)),e}k(t){et(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(z()),this.O(z()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=_t(t).nextSibling;_t(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=k(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==w,n&&(this._$AH=t);else{let l=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=k(this,l[s+a],e,a),c===w&&(c=this._$AH[a]),n||(n=!M(c)||c!==this._$AH[a]),c===d?t=d:t!==d&&(t+=(c!=null?c:"")+o[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},Z=class extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},G=class extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},Q=class extends S{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var n;if((t=(n=k(this,t,e,0))!=null?n:d)===w)return;let s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},tt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}};var J=j.litHtmlPolyfillSupport,yt;J==null||J(T,U),((yt=j.litHtmlVersions)!=null?yt:j.litHtmlVersions=[]).push("3.3.3");var Et=(r,t,e)=>{var o,n;let s=(o=e==null?void 0:e.renderBefore)!=null?o:t,i=s._$litPart$;if(i===void 0){let l=(n=e==null?void 0:e.renderBefore)!=null?n:null;s._$litPart$=i=new U(t.insertBefore(z(),l),l,void 0,e!=null?e:{})}return i._$AI(r),i};var A=globalThis,v=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Et(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return w}},Ct;v._$litElement$=!0,v.finalized=!0,(Ct=A.litElementHydrateSupport)==null||Ct.call(A,{LitElement:v});var it=A.litElementPolyfillSupport;it==null||it({LitElement:v});var Pt;((Pt=A.litElementVersions)!=null?Pt:A.litElementVersions=[]).push("4.2.2");var zt=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-fleet ${zt}`);var Xt=r=>{let t={};for(let e of r||[])(t[e.feature]=t[e.feature]||[]).push(e);return t},Mt=r=>{if(r==null)return"";let t=Math.max(0,Math.round(r));return t<60?`${t}s`:`${Math.floor(t/60)}m ${t%60}s`},jt=r=>r.alive?r.busy?`working ${Mt(r.elapsed)}`:r.edits&&r.edits.length?"idle \xB7 reported":"idle":"offline",Jt=r=>(r||[]).filter(t=>t.alive).length,Ft=r=>({user:"u",assistant:"a",tool:"t",out:"o",err:"e",think:"k",cmd:"c",screen:"s"})[r]||"o",N=class extends v{constructor(){super(),this._projects=null,this._project=null,this._fleet=null,this._open=null,this._trans=null,this._drag=null,this._armed=!1,this._hover=null,this._err="",this._busy=!1,this._ship=!1,this._msg="",this._order="",this._mission="",this._deploying=null,this._have=0,this._shipNote=""}connectedCallback(){super.connectedCallback(),this._loadProjects(),this._timer=setInterval(()=>this._tick(),3e3),this._ttimer=setInterval(()=>this._pollTranscript(),2e3)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._timer),clearInterval(this._ttimer)}async _api(t,e={}){var n,l,a;let s=await this.hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=(n=s==null?void 0:s.response)==null?void 0:n.content;if(typeof i=="string")try{i=JSON.parse(i)}catch(c){}let o=(a=(l=s==null?void 0:s.response)==null?void 0:l.status)!=null?a:0;if(o<200||o>=300||(i==null?void 0:i.ok)===!1)throw new Error((i==null?void 0:i.detail)||(i==null?void 0:i.error)||`HTTP ${o}`);return i||{}}async _try(t){this._err="";try{return await t()}catch(e){this._err=(e==null?void 0:e.message)||String(e);return}}async _loadProjects(){let t=await this._try(()=>this._api("agent_fleet"));t&&(this._projects=t.projects||[])}async _tick(){if(this.hass)if(this._project){if(this._polling)return;this._polling=!0;try{let t=await this._api("agent_fleet",{project:this._project});this._fleet=t,this._err.startsWith("companion")&&(this._err="")}catch(t){this._err=(t==null?void 0:t.message)||String(t)}finally{this._polling=!1}}else this._loadProjects()}async _pollTranscript(){if(!(!this._open||!this.hass||this._tpolling)){this._tpolling=!0;try{let t=await this._api("agent_transcript",{id:this._open,have:String(this._have)});t.messages?(this._trans={messages:t.messages,activity:t.activity,ask:t.ask},this._have=t.bytes||0,this.updateComplete.then(()=>{var s;let e=(s=this.shadowRoot)==null?void 0:s.querySelector(".log");e&&(e.scrollTop=e.scrollHeight)})):this._trans&&(this._trans=ot(B({},this._trans),{activity:t.activity,ask:t.ask}))}catch(t){}finally{this._tpolling=!1}}}_enter(t){this._project=t,this._fleet=null,this._open=null,this._ship=!1,this._tick()}_leave(){this._project=null,this._fleet=null,this._open=null,this._loadProjects()}_openAgent(t){this._open=t,this._trans=null,this._have=0,this._order="",this._pollTranscript()}async _deploy(t){var i,o;if(this._deploying)return;this._armed=!1,this._deploying=t;let e=(this._mission||"").trim(),s=await this._try(()=>this._api("agent_fleet_act",B({action:"drop",project:this._project,feature:t},e?{mission:e}:{})));if(this._deploying=null,s){this._mission="";let n=(i=this.shadowRoot)==null?void 0:i.querySelector(".mission input");n&&(n.value=""),await this._tick(),(o=s.agent)!=null&&o.id&&this._openAgent(s.agent.id)}}_nodeAt(t,e){var i;let s=(i=this.shadowRoot)==null?void 0:i.elementFromPoint(t,e);return s?s.closest(".node"):null}_dragStart(t){if(!this._deploying){t.preventDefault();try{t.currentTarget.setPointerCapture(t.pointerId)}catch(e){}this._drag={x:t.clientX,y:t.clientY,moved:!1}}}_dragMove(t){if(!this._drag)return;let e=this._drag.moved||Math.hypot(t.clientX-this._drag.x,t.clientY-this._drag.y)>6;this._drag={x:t.clientX,y:t.clientY,moved:e};let s=e?this._nodeAt(t.clientX,t.clientY):null;this._hover=s?s.dataset.id:null}_dragEnd(t){if(!this._drag)return;let{moved:e}=this._drag,s=e?this._nodeAt(t.clientX,t.clientY):null;this._drag=null,this._hover=null,s?this._deploy(s.dataset.id):e||(this._armed=!this._armed)}_nodeTap(t){this._armed&&this._deploy(t.id)}async _sendOrder(){var s;let t=(this._order||"").trim();if(!t||!this._open)return;this._busy=!0;let e=await this._try(()=>this._api("agent_fleet_act",{action:"task",id:this._open,text:t}));if(this._busy=!1,e){this._order="";let i=(s=this.shadowRoot)==null?void 0:s.querySelector(".orders textarea");i&&(i.value=""),this._pollTranscript()}}async _answer(t){await this._try(()=>this._api("agent_key",{id:this._open,key:t})),this._pollTranscript()}async _recall(){this._open&&(this._busy=!0,await this._try(()=>this._api("agent_fleet_act",{action:"recall",id:this._open})),this._busy=!1,this._open=null,this._tick())}async _commit(t){var i;let e=(this._msg||"").trim();if(!e){this._err="a commit needs a message";return}this._busy=!0,this._shipNote="";let s=await this._try(()=>this._api("agent_fleet_act",{action:"commit",project:this._project,message:e}));if(s){this._shipNote=s.detail||"committed",this._msg="";let o=(i=this.shadowRoot)==null?void 0:i.querySelector(".shipbox input");o&&(o.value=""),t&&await this._push()}this._busy=!1,this._tick()}async _push(){this._busy=!0;let t=await this._try(()=>this._api("agent_fleet_act",{action:"push",project:this._project}));t&&(this._shipNote=t.detail||"pushed"),this._busy=!1,this._tick()}render(){var s;let t=this._fleet,e=(t==null?void 0:t.git)||{};return p`
      <div class="wrap">
        <div class="bar">
          ${this.narrow?p`<div class="menu"><ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button></div>`:d}
          <h1>
            Fleet
            ${this._project?p`<small>/ ${this._project}</small>`:d}
          </h1>
          ${this._project?p`
                <button @click=${this._leave}>◂ Projects</button>
                <span class="spacer"></span>
                <span class="pill">agents <b>${Jt(t==null?void 0:t.agents)}</b></span>
                <span class="pill">branch <b>${e.branch||"\u2026"}</b></span>
                <span class="pill ${e.changed?"warn":""}">
                  changed <b>${(s=e.changed)!=null?s:"\u2026"}</b>${e.ahead?p` · ahead <b>${e.ahead}</b>`:d}
                </span>
                <button class=${e.changed?"go":""} @click=${()=>this._ship=!this._ship}>
                  ${this._ship?"Close":"Ship"}
                </button>
              `:p`<span class="spacer"></span><span class="pill">${zt}</span>`}
        </div>
        ${this._err?p`<div class="err">${this._err}</div>`:d}
        ${this._project?this._renderStage(t):this._renderProjects()}
      </div>
      ${this._drag&&this._drag.moved?p`<div class="ghost" style="left:${this._drag.x}px;top:${this._drag.y}px"></div>`:d}
    `}_renderProjects(){return this._projects?this._projects.length?p`<div class="projects">
      ${this._projects.map(t=>p`
          <div class="proj" @click=${()=>this._enter(t.name)}>
            <h2>${t.name}</h2>
            <div class="path">${t.path.replace(/^\/Users\/[^/]+/,"~")}</div>
            ${t.agents?p`<div class="n">● ${t.agents} live</div>`:d}
          </div>
        `)}
    </div>`:p`<div class="empty">no git projects in the voice allowlist</div>`:p`<div class="empty">scanning…</div>`}_renderStage(t){var o;let e=Xt(t==null?void 0:t.agents),s=(o=t==null?void 0:t.agents)==null?void 0:o.find(n=>n.id===this._open),i=!!this._open;return p`
      <div class="stage">
        <div class="left" ?hidden=${i&&this.narrow}>
          <div class="map">
            ${t?t.features.map(n=>this._renderNode(n,e[n.id]||[])):p`<div class="empty">mapping ${this._project}…</div>`}
          </div>
          ${this._renderBay()}
        </div>
        ${i?p`<div class="drawer ${this.narrow?"full":""}">${this._renderDrawer(s)}</div>`:d}
        ${this._ship?this._renderShip((t==null?void 0:t.git)||{}):d}
      </div>
    `}_renderNode(t,e){let s=e.some(o=>o.busy),i=["node",e.length?"live":"",s?"busy":"",this._hover===t.id||this._deploying===t.id?"target":"",this._armed?"armed":""].join(" ");return p`
      <div class=${i} data-id=${t.id} @click=${()=>this._nodeTap(t)}>
        <h3>${t.name}</h3>
        <p>${this._deploying===t.id?p`<span class="deploying">deploying…</span>`:t.blurb}</p>
        <div class="crew">
          ${e.map(o=>{var n;return p`
              <span
                class="bot ${o.busy?"busy":""} ${o.alive?"":"off"}"
                title=${jt(o)}
                @click=${l=>{l.stopPropagation(),this._openAgent(o.id)}}
              >
                <span class="eye"></span>${o.callsign}
                ${(n=o.edits)!=null&&n.length?p`<span class="n">${o.edits.length}</span>`:d}
              </span>
            `})}
        </div>
      </div>
    `}_renderBay(){return p`
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
          ${this._deploying?p`<span class="deploying">opening a session…</span>`:this._armed?p`<b>armed</b> — tap a feature to deploy`:p`<b>drag</b> onto a feature to deploy an agent<br />default mission: hunt bugs, suggest features`}
        </div>
        <label class="mission">
          <input
            placeholder="custom mission (optional)"
            .value=${this._mission||""}
            @input=${t=>this._mission=t.target.value}
          />
        </label>
      </div>
    `}_renderDrawer(t){var o,n,l,a,c;if(!t)return p`<div class="head"><h2>signal lost</h2><button class="x" @click=${()=>this._open=null}>✕</button></div>`;let e=(o=this._fleet)==null?void 0:o.features.find(h=>h.id===t.feature),s=this._trans,i=t.busy?(s==null?void 0:s.activity)||`working for ${Mt(t.elapsed)}`:t.alive?"idle \u2014 awaiting orders":"offline";return p`
      <div class="head">
        <h2>${t.callsign}</h2>
        <div class="sub">${(e==null?void 0:e.name)||t.feature}<br />${t.id}</div>
        <button class="x" @click=${()=>this._open=null}>✕</button>
      </div>
      <div class="stat">
        <span class="pill ${t.busy?"warn":""}">${jt(t)}</span>
        <span class="pill">edits <b>${((n=t.edits)==null?void 0:n.length)||0}</b></span>
        <button class="hot" ?disabled=${this._busy} @click=${this._recall}>Recall</button>
      </div>
      <div class="sec">
        <h4>Working on</h4>
        <div class="now">${i}</div>
      </div>
      <div class="sec">
        <h4>Done · files touched</h4>
        ${(l=t.edits)!=null&&l.length?p`<ul>${t.edits.map(h=>p`<li>${h}</li>`)}</ul>`:p`<div class="mission">nothing written yet</div>`}
      </div>
      <div class="sec">
        <h4>Mission</h4>
        <div class="mission">${t.mission}</div>
      </div>
      <div class="log">
        ${s?s.messages.map(h=>p`<div class="row ${Ft(h.role)}">${h.text}</div>`):p`<div class="empty">reading transcript…</div>`}
        ${(c=(a=s==null?void 0:s.ask)==null?void 0:a.options)!=null&&c.length?p`<div class="orders" style="border:0;padding:0">
              ${s.ask.options.map(h=>p`<button @click=${()=>this._answer(String(h.key))}>${h.key} · ${h.label}</button>`)}
            </div>`:d}
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
    `}_renderShip(t){var e;return p`
      <div class="shipbox">
        <h3>Ship · ${t.branch||"?"}</h3>
        ${t.error?p`<div class="err">${t.error}</div>`:d}
        <div class="mission">${t.last_commit||""}</div>
        <div class="files">
          ${(e=t.files)!=null&&e.length?t.files.map(s=>p`<div>${s}</div>`):p`<div style="opacity:.6">working tree clean</div>`}
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
        ${this._shipNote?p`<div class="ok">${this._shipNote}</div>`:d}
      </div>
    `}};I(N,"properties",{hass:{attribute:!1},narrow:{type:Boolean},_projects:{state:!0},_project:{state:!0},_fleet:{state:!0},_open:{state:!0},_trans:{state:!0},_drag:{state:!0},_armed:{state:!0},_hover:{state:!0},_err:{state:!0},_busy:{state:!0},_ship:{state:!0},_msg:{state:!0},_order:{state:!0},_deploying:{state:!0},_shipNote:{state:!0}}),I(N,"styles",W`
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
    .map {
      flex: 1;
      overflow: auto;
      padding: 18px 16px 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 14px;
      align-content: start;
    }
    .node {
      position: relative;
      min-height: 120px;
      padding: 12px 12px 34px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, rgba(10, 18, 32, 0.9), rgba(5, 9, 18, 0.9));
      clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
      transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
      cursor: pointer;
    }
    .node::after {
      content: "";
      position: absolute;
      left: 0; right: 0; top: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
      opacity: 0.35;
    }
    .node.live { border-color: rgba(61, 255, 154, 0.45); }
    .node.live::after { background: linear-gradient(90deg, transparent, var(--green), transparent); opacity: 0.8; }
    .node.busy { animation: nodepulse 2.2s ease-in-out infinite; }
    .node.target { border-color: var(--mag); box-shadow: 0 0 0 2px rgba(255, 47, 214, 0.5), 0 0 30px rgba(255, 47, 214, 0.45); transform: scale(1.03); }
    .node.armed { border-color: rgba(255, 47, 214, 0.6); box-shadow: 0 0 16px rgba(255, 47, 214, 0.25); }
    @keyframes nodepulse {
      0%, 100% { box-shadow: 0 0 6px rgba(61, 255, 154, 0.15); }
      50% { box-shadow: 0 0 22px rgba(61, 255, 154, 0.45); }
    }
    .node h3 { margin: 0 0 4px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); }
    .node p { margin: 0; font-size: 11px; color: var(--dim); line-height: 1.35; }
    .crew { position: absolute; left: 10px; right: 10px; bottom: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
    .bot {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 7px 2px 4px;
      font-size: 10px;
      letter-spacing: 0.06em;
      border: 1px solid rgba(61, 255, 154, 0.4);
      background: rgba(61, 255, 154, 0.08);
      color: var(--green);
      cursor: pointer;
      text-transform: uppercase;
    }
    .bot:hover { background: rgba(61, 255, 154, 0.2); box-shadow: 0 0 10px rgba(61, 255, 154, 0.35); }
    .bot .eye { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); }
    .bot.busy .eye { background: var(--amber); box-shadow: 0 0 8px var(--amber); animation: blink 0.9s ease-in-out infinite; }
    .bot.busy { border-color: rgba(255, 176, 32, 0.5); color: var(--amber); background: rgba(255, 176, 32, 0.08); }
    .bot.off { opacity: 0.45; border-style: dashed; }
    .bot .n { color: var(--ink); opacity: 0.7; }
    @keyframes blink { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }

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
  `);customElements.define("hubbubb-fleet",N);export{jt as agentState,Xt as byFeature,Mt as fmtElapsed,Jt as liveCount,Ft as roleClass};
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
