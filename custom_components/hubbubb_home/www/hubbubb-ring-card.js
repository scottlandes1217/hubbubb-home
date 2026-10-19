var yi=Object.defineProperty,$i=Object.defineProperties;var ki=Object.getOwnPropertyDescriptors;var ms=Object.getOwnPropertySymbols;var Mi=Object.prototype.hasOwnProperty,Ai=Object.prototype.propertyIsEnumerable;var Ce=(h,t,e)=>t in h?yi(h,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):h[t]=e,L=(h,t)=>{for(var e in t||(t={}))Mi.call(t,e)&&Ce(h,e,t[e]);if(ms)for(var e of ms(t))Ai.call(t,e)&&Ce(h,e,t[e]);return h},J=(h,t)=>$i(h,ki(t));var ct=(h,t,e)=>Ce(h,typeof t!="symbol"?t+"":t,e);var ce=globalThis,de=ce.ShadowRoot&&(ce.ShadyCSS===void 0||ce.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),bs=new WeakMap,qt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(de&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=bs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&bs.set(e,t))}return t}toString(){return this.cssText}},vs=h=>new qt(typeof h=="string"?h:h+"",void 0,Pe),Ft=(h,...t)=>{let e=h.length===1?h[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+h[o+1],h[0]);return new qt(e,h,Pe)},ws=(h,t)=>{if(de)h.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=ce.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,h.appendChild(s)}},Re=de?h=>h:h=>h instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return vs(e)})(h):h;var{is:Si,defineProperty:Ti,getOwnPropertyDescriptor:ji,getOwnPropertyNames:Ei,getOwnPropertySymbols:Ci,getPrototypeOf:Pi}=Object,_t=globalThis,xs=_t.trustedTypes,Ri=xs?xs.emptyScript:"",Ie=_t.reactiveElementPolyfillSupport,Vt=(h,t)=>h,ze={toAttribute(h,t){switch(t){case Boolean:h=h?Ri:null;break;case Object:case Array:h=h==null?h:JSON.stringify(h)}return h},fromAttribute(h,t){let e=h;switch(t){case Boolean:e=h!==null;break;case Number:e=h===null?null:Number(h);break;case Object:case Array:try{e=JSON.parse(h)}catch(s){e=null}}return e}},As=(h,t)=>!Si(h,t),ys={attribute:!0,type:String,converter:ze,reflect:!1,useDefault:!1,hasChanged:As},$s,ks;($s=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(ks=_t.litPropertyMetadata)!=null||(_t.litPropertyMetadata=new WeakMap);var dt=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ys){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ti(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){var n;let{get:i,set:o}=(n=ji(this.prototype,t))!=null?n:{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let r=i==null?void 0:i.call(this);o==null||o.call(this,a),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:ys}static _$Ei(){if(this.hasOwnProperty(Vt("elementProperties")))return;let t=Pi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Vt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Vt("properties"))){let e=this.properties,s=[...Ei(e),...Ci(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Re(i))}else t!==void 0&&e.push(Re(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,s;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return ws(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:ze).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var o,n,a;let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),l=typeof r.converter=="function"?{fromAttribute:r.converter}:((o=r.converter)==null?void 0:o.fromAttribute)!==void 0?r.converter:ze;this._$Em=i;let c=l.fromAttribute(e,r.type);this[i]=(a=c!=null?c:(n=this._$Ej)==null?void 0:n.get(i))!=null?a:c,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){var n,a;if(t!==void 0){let r=this.constructor;if(i===!1&&(o=this[t]),s!=null||(s=r.getPropertyOptions(t)),!(((n=s.hasChanged)!=null?n:As)(o,e)||s.useDefault&&s.reflect&&o===((a=this._$Ej)==null?void 0:a.get(t))&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){var a,r,l;s&&!((a=this._$Ej)!=null?a:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(r=n!=null?n:e)!=null?r:this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,a]of o){let{wrapped:r}=a,l=this[n];r!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,a,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},Ms;dt.elementStyles=[],dt.shadowRootOptions={mode:"open"},dt[Vt("elementProperties")]=new Map,dt[Vt("finalized")]=new Map,Ie==null||Ie({ReactiveElement:dt}),((Ms=_t.reactiveElementVersions)!=null?Ms:_t.reactiveElementVersions=[]).push("2.1.2");var Kt=globalThis,Ss=h=>h,pe=Kt.trustedTypes,Ts=pe?pe.createPolicy("lit-html",{createHTML:h=>h}):void 0,De="$lit$",pt=`lit$${Math.random().toFixed(9).slice(2)}$`,Be="?"+pt,Ii=`<${Be}>`,xt=document,Gt=()=>xt.createComment(""),Qt=h=>h===null||typeof h!="object"&&typeof h!="function",Ue=Array.isArray,zs=h=>Ue(h)||typeof(h==null?void 0:h[Symbol.iterator])=="function",Le=`[ 	
\f\r]`,Wt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,js=/-->/g,Es=/>/g,vt=RegExp(`>|${Le}(?:([^\\s"'>=/]+)(${Le}*=${Le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Cs=/'/g,Ps=/"/g,Ls=/^(?:script|style|textarea|title)$/i,Ne=h=>(t,...e)=>({_$litType$:h,strings:t,values:e}),m=Ne(1),It=Ne(2),ro=Ne(3),Z=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Rs=new WeakMap,wt=xt.createTreeWalker(xt,129);function Os(h,t){if(!Ue(h)||!h.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ts!==void 0?Ts.createHTML(t):t}var Ds=(h,t)=>{let e=h.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=Wt;for(let a=0;a<e;a++){let r=h[a],l,c,d=-1,p=0;for(;p<r.length&&(n.lastIndex=p,c=n.exec(r),c!==null);)p=n.lastIndex,n===Wt?c[1]==="!--"?n=js:c[1]!==void 0?n=Es:c[2]!==void 0?(Ls.test(c[2])&&(i=RegExp("</"+c[2],"g")),n=vt):c[3]!==void 0&&(n=vt):n===vt?c[0]===">"?(n=i!=null?i:Wt,d=-1):c[1]===void 0?d=-2:(d=n.lastIndex-c[2].length,l=c[1],n=c[3]===void 0?vt:c[3]==='"'?Ps:Cs):n===Ps||n===Cs?n=vt:n===js||n===Es?n=Wt:(n=vt,i=void 0);let u=n===vt&&h[a+1].startsWith("/>")?" ":"";o+=n===Wt?r+Ii:d>=0?(s.push(l),r.slice(0,d)+De+r.slice(d)+pt+u):r+pt+(d===-2?a:u)}return[Os(h,o+(h[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Yt=class h{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,a=t.length-1,r=this.parts,[l,c]=Ds(t,e);if(this.el=h.createElement(l,s),wt.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=wt.nextNode())!==null&&r.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(De)){let p=c[n++],u=i.getAttribute(d).split(pt),g=/([.?@])?(.*)/.exec(p);r.push({type:1,index:o,name:g[2],strings:u,ctor:g[1]==="."?fe:g[1]==="?"?ge:g[1]==="@"?_e:$t}),i.removeAttribute(d)}else d.startsWith(pt)&&(r.push({type:6,index:o}),i.removeAttribute(d));if(Ls.test(i.tagName)){let d=i.textContent.split(pt),p=d.length-1;if(p>0){i.textContent=pe?pe.emptyScript:"";for(let u=0;u<p;u++)i.append(d[u],Gt()),wt.nextNode(),r.push({type:2,index:++o});i.append(d[p],Gt())}}}else if(i.nodeType===8)if(i.data===Be)r.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(pt,d+1))!==-1;)r.push({type:7,index:o}),d+=pt.length-1}o++}}static createElement(t,e){let s=xt.createElement("template");return s.innerHTML=t,s}};function yt(h,t,e=h,s){var n,a,r;if(t===Z)return t;let i=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl,o=Qt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),o===void 0?i=void 0:(i=new o(h),i._$AT(h,e,s)),s!==void 0?((r=e._$Co)!=null?r:e._$Co=[])[s]=i:e._$Cl=i),i!==void 0&&(t=yt(h,i._$AS(h,t.values),i,s)),t}var ue=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var l;let{el:{content:e},parts:s}=this._$AD,i=((l=t==null?void 0:t.creationScope)!=null?l:xt).importNode(e,!0);wt.currentNode=i;let o=wt.nextNode(),n=0,a=0,r=s[0];for(;r!==void 0;){if(n===r.index){let c;r.type===2?c=new Rt(o,o.nextSibling,this,t):r.type===1?c=new r.ctor(o,r.name,r.strings,this,t):r.type===6&&(c=new me(o,this,t)),this._$AV.push(c),r=s[++a]}n!==(r==null?void 0:r.index)&&(o=wt.nextNode(),n++)}return wt.currentNode=xt,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Rt=class h{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,s,i){var o;this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(o=i==null?void 0:i.isConnected)!=null?o:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=yt(this,t,e),Qt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&Qt(this._$AH)?this._$AA.nextSibling.data=t:this.T(xt.createTextNode(t)),this._$AH=t}$(t){var o;let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Yt.createElement(Os(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{let n=new ue(i,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=Rs.get(t.strings);return e===void 0&&Rs.set(t.strings,e=new Yt(t)),e}k(t){Ue(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new h(this.O(Gt()),this.O(Gt()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){let i=Ss(t).nextSibling;Ss(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},$t=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=yt(this,t,e,0),n=!Qt(t)||t!==this._$AH&&t!==Z,n&&(this._$AH=t);else{let a=t,r,l;for(t=o[0],r=0;r<o.length-1;r++)l=yt(this,a[s+r],e,r),l===Z&&(l=this._$AH[r]),n||(n=!Qt(l)||l!==this._$AH[r]),l===$?t=$:t!==$&&(t+=(l!=null?l:"")+o[r+1]),this._$AH[r]=l}n&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},fe=class extends $t{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},ge=class extends $t{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},_e=class extends $t{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var n;if((t=(n=yt(this,t,e,0))!=null?n:$)===Z)return;let s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;typeof this._$AH=="function"?this._$AH.call((s=(e=this.options)==null?void 0:e.host)!=null?s:this.element,t):this._$AH.handleEvent(t)}},me=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){yt(this,t)}},Bs={M:De,P:pt,A:Be,C:1,L:Ds,R:ue,D:zs,V:yt,I:Rt,H:$t,N:ge,U:_e,B:fe,F:me},Oe=Kt.litHtmlPolyfillSupport,Is;Oe==null||Oe(Yt,Rt),((Is=Kt.litHtmlVersions)!=null?Is:Kt.litHtmlVersions=[]).push("3.3.3");var Us=(h,t,e)=>{var o,n;let s=(o=e==null?void 0:e.renderBefore)!=null?o:t,i=s._$litPart$;if(i===void 0){let a=(n=e==null?void 0:e.renderBefore)!=null?n:null;s._$litPart$=i=new Rt(t.insertBefore(Gt(),a),a,void 0,e!=null?e:{})}return i._$AI(h),i};var kt=globalThis,st=class extends dt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,s;let t=super.createRenderRoot();return(s=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Us(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Z}},Ns;st._$litElement$=!0,st.finalized=!0,(Ns=kt.litElementHydrateSupport)==null||Ns.call(kt,{LitElement:st});var He=kt.litElementPolyfillSupport;He==null||He({LitElement:st});var Hs;((Hs=kt.litElementVersions)!=null?Hs:kt.litElementVersions=[]).push("4.2.2");var Mt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},be=h=>(...t)=>({_$litDirective$:h,values:t}),zt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:$o}=Bs;var qs=h=>h.strings===void 0;var zi={},ve=(h,t=zi)=>h._$AH=t;var Fs=be(class extends zt{constructor(){super(...arguments),this.key=$}render(h,t){return this.key=h,t}update(h,[t,e]){return t!==this.key&&(ve(h),this.key=t),e}});var qe=be(class extends zt{constructor(h){if(super(h),h.type!==Mt.PROPERTY&&h.type!==Mt.ATTRIBUTE&&h.type!==Mt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!qs(h))throw Error("`live` bindings can only contain a single expression")}render(h){return h}update(h,[t]){if(t===Z||t===$)return t;let e=h.element,s=h.name;if(h.type===Mt.PROPERTY){if(t===e[s])return Z}else if(h.type===Mt.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(s))return Z}else if(h.type===Mt.ATTRIBUTE&&e.getAttribute(s)===t+"")return Z;return ve(h),t}});function Vs(h,t,e){let s=Math.max(1,Math.round(t/e)),i=new Float32Array(Math.ceil(h.length/s)),o=1e-6;for(let n=0,a=0;n<h.length;n+=s,a++){let r=Math.min(h.length,n+s),l=0;for(let d=n;d<r;d++)l+=h[d]*h[d];let c=Math.sqrt(l/(r-n));i[a]=c,c>o&&(o=c)}for(let n=0;n<i.length;n++)i[n]=Math.min(1,i[n]/o);return i}function Ws(h,t){let e=h/t,s=0,i=0;return o=>{let n=o.length,a=new Int16Array(Math.max(0,Math.ceil((n-s)/e))),r=0;for(;s<n;s+=e){let l=Math.floor(s),c=l<0?i:o[l],d=l+1<n?o[l+1]:c,p=Math.max(-1,Math.min(1,c+(d-c)*(s-l)));a[r++]=p<0?p*32768:p*32767}return s-=n,i=n?o[n-1]:i,r===a.length?a:a.subarray(0,r)}}var we=[.9,.78];function Ks(h,t,e,s,i,o){let n=h,a=t,r=e,l=Math.max(0,Math.min(1.2,s)),c=Math.sin(n*3+r*.51)*.46+Math.sin(n*5-r*.37+1.8)*.27+Math.sin(n*7+r*.26)*.17,d=Math.sin(n*5+a*13+Math.sin(n*3-a*4+r*.7)*1.6-r*.8+i*2.1),p=Math.sin(n*9-a*19+r*.6+i*1.3),u=Math.abs(Math.sin(a)),g=Math.max(0,Math.min(1,(u-.18)/.37)),b=1-g*g*(3-2*g),_=.3+.7*Math.pow(.5+.5*Math.sin(n*2+r*.9),2),v=l*b*_,w=.2+.8*b,x=.012*Math.sin(n*2-r*.8)+.005*Math.sin(n*3+r*.45+i*.6),y=we[i]+b*x-v*.014+(.006*w+v*.045)*c+(.006*w+v*.022)*d+(.002*w+v*.006)*p,M=Math.cos(a);return o[0]=y*M*Math.cos(n),o[1]=y*M*Math.sin(n),o[2]=y*Math.sin(a),o}var Li=`
precision highp float;
attribute vec2 aUV;
uniform mediump float uTime, uVoice, uRadius, uShell;
varying mediump vec3 vPoint, vNormal;
vec3 surface(vec2 uv) {
  float a = uv.x, b = uv.y, t = uTime;
  float broad = sin(a*3.0+t*.51) * .46
    + sin(a*5.0-t*.37+1.8)*.27 + sin(a*7.0+t*.26)*.17;
  // Shared pressure keeps two silhouettes separate; depth-dependent folds
  // travel independently through each skin, including its rear hemisphere.
  float fold = sin(a*5.0+b*13.0+sin(a*3.0-b*4.0+t*.7)*1.6-t*.8+uShell*2.1);
  float fold2 = sin(a*9.0-b*19.0+t*.6+uShell*1.3);
  // Speech acts on the outer ~16% of the projected skin. The front/back
  // faces retain only their quiet drift, instead of crumpling with each word.
  float rim = 1.0-smoothstep(.18,.55,abs(sin(b)));
  float pressure = .3+.7*pow(.5+.5*sin(a*2.0+t*.9),2.0);
  float motion = uVoice*rim*pressure, ambient = .2+.8*rim;
  float swell = .012*sin(a*2.0-t*.8)+.005*sin(a*3.0+t*.45+uShell*.6);
  float r = uRadius + rim*swell-motion*.014 + (.006*ambient+motion*.045)*broad
    + (.006*ambient+motion*.022)*fold + (.002*ambient+motion*.006)*fold2;
  float cb = cos(b);
  return r * vec3(cb*cos(a), cb*sin(a), sin(b));
}
void main() {
  vec3 p = surface(aUV);
  vec3 da = surface(aUV+vec2(.001,0.0))-surface(aUV-vec2(.001,0.0));
  vec3 db = surface(aUV+vec2(0.0,.001))-surface(aUV-vec2(0.0,.001));
  vPoint = p;
  vNormal = normalize(cross(da,db));
  gl_Position = vec4(p.xy,0.0,1.0);
}`,Oi=`
precision mediump float;
uniform mediump float uTime, uVoice, uShell, uBright;
uniform vec3 uColor;
varying mediump vec3 vPoint, vNormal;
float hash(vec3 p) {
  p = fract(p*.1031);
  p += dot(p,p.yzx+33.33);
  return fract((p.x+p.y)*p.z);
}
float noise(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
void main() {
  vec3 p=vPoint*4.5+vec3(uShell*7.0,uTime*.12,-uTime*.18);
  float n=noise(p), n2=noise(p*2.3+vec3(n*1.8));
  float smoke=.35+.65*(n*.55+n2*.45);
  float edge=pow(1.0-abs(normalize(vNormal).z),3.8);
  float thread=pow(.5+.5*sin((n+n2*.35)*38.0+vPoint.z*18.0),12.0);
  // A little light across both faces makes these read as hollow bubbles;
  // grazing light and flowing filaments reveal the folds near the rim.
  float a=(.004 + edge*(.27+thread*.22)) * smoke;
  a += thread*.012*smoothstep(.4,.85,length(vPoint.xy));
  float grain=.65+.35*hash(floor(vPoint*650.0));
  a *= grain*uBright;
  gl_FragColor=vec4(uColor*a,a);
}`;function Gs(){var n;let h=document.createElement("canvas"),t;try{t=h.getContext("webgl",{alpha:!0,premultipliedAlpha:!0,antialias:!0,depth:!1,stencil:!1,preserveDrawingBuffer:!1})}catch(a){return null}if(!t)return null;let e=[],s=[],i,o=()=>{var a;for(let r of s)t.deleteBuffer(r);for(let r of e)t.deleteShader(r);i&&t.deleteProgram(i),(a=t.getExtension("WEBGL_lose_context"))==null||a.loseContext()};try{i=t.createProgram();let a=((n=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT))==null?void 0:n.precision)>0?"highp":"mediump";for(let[v,w]of[[t.VERTEX_SHADER,Li],[t.FRAGMENT_SHADER,Oi]]){let x=t.createShader(v);if(e.push(x),t.shaderSource(x,w.replace(/mediump/g,a)),t.compileShader(x),!t.getShaderParameter(x,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(x));t.attachShader(i,x)}if(t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(i));t.useProgram(i);let r=256,l=96,c=[],d=[];for(let v=0;v<=l;v++)for(let w=0;w<=r;w++)c.push(w/r*Math.PI*2,(v/l-.5)*Math.PI);for(let v=0;v<l;v++)for(let w=0;w<r;w++){let x=v*(r+1)+w,y=x+r+1;d.push(x,y,x+1,x+1,y,y+1)}let p=t.createBuffer();s.push(p),t.bindBuffer(t.ARRAY_BUFFER,p),t.bufferData(t.ARRAY_BUFFER,new Float32Array(c),t.STATIC_DRAW);let u=t.getAttribLocation(i,"aUV");t.enableVertexAttribArray(u),t.vertexAttribPointer(u,2,t.FLOAT,!1,0,0);let g=t.createBuffer();s.push(g),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,g),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(d),t.STATIC_DRAW);let b={};for(let v of["uTime","uVoice","uRadius","uShell","uBright","uColor"])b[v]=t.getUniformLocation(i,v);t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE);let _=!1;return h.addEventListener("webglcontextlost",()=>{_=!0}),{canvas:h,dispose:o,draw(v,w,x,y,M){if(_||t.isContextLost())return!1;h.width!==v&&(h.width=h.height=v,t.viewport(0,0,v,v)),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.uniform1f(b.uTime,w),t.uniform1f(b.uVoice,Math.max(0,Math.min(1.2,x))),t.uniform1f(b.uBright,y),t.uniform3fv(b.uColor,M);for(let k=0;k<2;k++)t.uniform1f(b.uRadius,we[k]),t.uniform1f(b.uShell,k),t.drawElements(t.TRIANGLES,d.length,t.UNSIGNED_SHORT,0);return!0}}}catch(a){return o(),console.warn("Jarvis membrane renderer unavailable; using canvas surface",a),null}}var At=52,Qs=["#38b6ff","#ff9f43","#2ed3a0","#c77dff","#ffd166","#4dd6e0","#ff6b8b"],mt=h=>new Date(h.getFullYear(),h.getMonth(),h.getDate()),it=(h,t)=>new Date(h.getFullYear(),h.getMonth(),h.getDate()+t),Ys=h=>{if(h.dateTime)return new Date(h.dateTime);let[t,e,s]=h.date.split("-").map(Number);return new Date(t,e-1,s)},We=(h,t)=>({title:h.summary||"(no title)",start:Ys(h.start),end:Ys(h.end),allDay:!h.start.dateTime,location:h.location||"",description:h.description||"",cal:t}),Fe=(h,t)=>{let e=mt(t);if(h==="day")return[e,it(e,1)];if(h==="week"){let o=it(e,-e.getDay());return[o,it(o,7)]}let s=new Date(e.getFullYear(),e.getMonth(),1),i=it(s,-s.getDay());return[i,it(i,42)]},Xs=(h,t,e)=>h==="month"?new Date(t.getFullYear(),t.getMonth()+e,1):it(t,e*(h==="week"?7:1)),Di=h=>{let t=h.slice().sort((a,r)=>a.start-r.start||r.end-a.end),e=[],s=[],i=[],o=0,n=()=>{for(let a of s)a.lanes=i.length;s=[],i=[]};for(let a of t){s.length&&a.start>=o&&n();let r=i.findIndex(c=>c<=a.start);r<0&&(r=i.length),i[r]=a.end,o=s.length?Math.max(o,+a.end):+a.end;let l=J(L({},a),{lane:r,lanes:1});s.push(l),e.push(l)}return n(),e},Ke=(h,t)=>{let e=h.filter(s=>!s.allDay).sort((s,i)=>s.start-i.start);return{current:e.filter(s=>s.start<=t&&s.end>t),next:e.find(s=>s.start>t)||null}},Js=h=>{let t=Math.max(0,Math.round(h/6e4));if(!t)return"now";let e=Math.floor(t/60);return e?`${e} h${t%60?` ${t%60} min`:""}`:`${t} min`},St=h=>h.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),Tt=h=>`--c:${h};--cb:${h}2e`,Ve=(h,t)=>h.start<it(t,1)&&h.end>t,xe={get(h,t){var e;try{return(e=JSON.parse(localStorage.getItem(h)))!=null?e:t}catch(s){return t}},set(h,t){try{localStorage.setItem(h,JSON.stringify(t))}catch(e){}}},Xt=class extends st{constructor(){super(),this._events=[],this._now=new Date,this._view=xe.get("hubbubb-calendar-view",window.innerWidth<700?"day":"week"),this._anchor=mt(this._now),this._hidden=xe.get("hubbubb-calendar-hidden",[]),this._sel=null,this._err=""}connectedCallback(){super.connectedCallback(),this._now=new Date,this._anchor=mt(this._now),this._sel=null,this._tick=setInterval(()=>{let t=this._now;this._now=new Date,mt(t)-mt(this._now)&&this._load()},3e4),this._poll=setInterval(()=>this._load(),5*6e4),this.hasUpdated&&this._load(!0)}willUpdate(t){t.has("hass")&&!t.get("hass")&&this.hass&&this._load(!0)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._tick),clearInterval(this._poll)}_calendars(){var t;return Object.keys(((t=this.hass)==null?void 0:t.states)||{}).filter(e=>e.startsWith("calendar.")).sort().map((e,s)=>({id:e,name:this.hass.states[e].attributes.friendly_name||e,color:Qs[s%Qs.length]}))}async _load(t=!1){if(!this.hass)return;let[e,s]=Fe(this._view,this._anchor),i=`start=${encodeURIComponent(e.toISOString())}&end=${encodeURIComponent(s.toISOString())}`,o=this._seq=(this._seq||0)+1,n=await Promise.allSettled(this._calendars().map(r=>this.hass.callApi("GET",`calendars/${r.id}?${i}`).then(l=>l.map(c=>We(c,r)))));if(o!==this._seq)return;let a=n.filter(r=>r.status==="rejected").length;if(this._err=a?`${a} calendar${a>1?"s":""} failed to load`:"",this._events=n.flatMap(r=>r.status==="fulfilled"?r.value:[]),t){await this.updateComplete;let r=this.renderRoot.querySelector(".scroll"),l=this._now,c=this._view==="month"?0:(l.getHours()+l.getMinutes()/60-1.5)*At;r&&(r.scrollTop=Math.max(0,c))}}_go(t,e){t!==this._view&&xe.set("hubbubb-calendar-view",t),this._view=t,this._anchor=e,this._events=[],this._load(!0)}_toggle(t){this._hidden=this._hidden.includes(t)?this._hidden.filter(e=>e!==t):[...this._hidden,t],xe.set("hubbubb-calendar-hidden",this._hidden)}_title(){let t=this._anchor;if(this._view==="month")return t.toLocaleDateString([],{month:"long",year:"numeric"});if(this._view==="day")return t.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"});let[e,s]=Fe("week",t),i=it(s,-1),o=(n,a)=>n.toLocaleDateString([],a);return e.getMonth()===i.getMonth()?`${o(e,{month:"long"})} ${e.getDate()} \u2013 ${i.getDate()}`:`${o(e,{month:"short",day:"numeric"})} \u2013 ${o(i,{month:"short",day:"numeric"})}`}render(){let t=this._now,e=this._calendars(),s=this._events.filter(l=>!this._hidden.includes(l.cal.id)),[i,o]=Fe(this._view,this._anchor),n=t>=i&&t<o,{current:a,next:r}=n?Ke(s,t):{current:[],next:null};return m`
      <div class="top">
        <div class="clock">
          <div class="time">${St(t)}</div>
          <div class="date">${t.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}</div>
        </div>
        <div class="glance">
          ${a.map(l=>m`<button class="now" style=${Tt(l.cal.color)} @click=${()=>this._sel=l}>
              <b>Now</b> ${l.title} <span>· ends in ${Js(l.end-t)}</span>
            </button>`)}
          ${r?m`<button class="next" style=${Tt(r.cal.color)} @click=${()=>this._sel=r}>
                <b>Next in ${Js(r.start-t)}</b> ${r.title} <span>· ${St(r.start)}</span>
              </button>`:a.length||!n?$:m`<div class="free">Nothing else on today</div>`}
        </div>
      </div>

      <div class="tools">
        <div class="seg">
          ${["day","week","month"].map(l=>m`<button class=${this._view===l?"on":""} @click=${()=>this._go(l,this._anchor)}>
              ${l[0].toUpperCase()+l.slice(1)}
            </button>`)}
        </div>
        <span class="navs">
          <button class="nav" aria-label="Previous" @click=${()=>this._go(this._view,Xs(this._view,this._anchor,-1))}>‹</button>
          <button class="nav ${n?"dim":""}" @click=${()=>this._go(this._view,mt(new Date))}>Today</button>
          <button class="nav" aria-label="Next" @click=${()=>this._go(this._view,Xs(this._view,this._anchor,1))}>›</button>
        </span>
        <span class="title">${this._title()}</span>
        ${this._err?m`<span class="err">${this._err}</span>`:$}
      </div>
      <div class="chips">
        ${e.map(l=>m`<button class="chip ${this._hidden.includes(l.id)?"off":""}" style=${Tt(l.color)} @click=${()=>this._toggle(l.id)}>
            ${l.name}
          </button>`)}
      </div>

      ${this._view==="month"?this._month(i,s,t):this._grid(i,o,s,t)}
      ${this._sel?this._detail(this._sel):$}
    `}_grid(t,e,s,i){let o=[];for(let r=t;r<e;r=it(r,1))o.push(r);let n=+mt(i),a=(i.getHours()+i.getMinutes()/60)*At;return m`<div class="scroll">
      <div class="heads" style="--days:${o.length}">
        <div></div>
        ${o.map(r=>m`<div class="head ${+r===n?"today":""}">
            <div class="dname">${r.toLocaleDateString([],{weekday:"short"})} <span>${r.getDate()}</span></div>
            ${s.filter(l=>l.allDay&&Ve(l,r)).map(l=>m`<button class="allday" style=${Tt(l.cal.color)} @click=${()=>this._sel=l}>${l.title}</button>`)}
          </div>`)}
      </div>
      <div class="grid" style="--days:${o.length}; height:${24*At}px">
        <div class="gutter">
          ${Array.from({length:23},(r,l)=>m`<div class="hour" style="top:${(l+1)*At}px">
            ${new Date(2e3,0,1,l+1).toLocaleTimeString([],{hour:"numeric"})}
          </div>`)}
        </div>
        ${o.map(r=>this._column(r,s,i,+r===n?a:null))}
      </div>
    </div>`}_column(t,e,s,i){let o=it(t,1),n=Di(e.filter(a=>!a.allDay&&Ve(a,t)));return m`<div class="col ${i==null?"":"today"}">
      ${n.map(a=>{let r=Math.max(a.start,t),l=Math.min(a.end,o),c=(r-t)/36e5*At,d=Math.max((l-r)/36e5*At,20);return m`<button
          class="ev ${a.end<=s?"past":""} ${a.start<=s&&a.end>s?"live":""}"
          style="${Tt(a.cal.color)}; top:${c}px; height:${d-2}px;
                 left:calc(${a.lane/a.lanes*100}% + 2px); width:calc(${100/a.lanes}% - 4px)"
          @click=${()=>this._sel=a}
        >
          <div class="t">${a.title}</div>
          ${d>34?m`<div class="w">${St(a.start)} – ${St(a.end)}</div>`:$}
        </button>`})}
      ${i==null?$:m`<div class="nowline" style="top:${i}px"></div>`}
    </div>`}_month(t,e,s){let i=+mt(s),o=this._anchor.getMonth(),n=Array.from({length:42},(a,r)=>it(t,r));return m`<div class="scroll">
      <div class="mhead">
        ${n.slice(0,7).map(a=>m`<div>${a.toLocaleDateString([],{weekday:"short"})}</div>`)}
      </div>
      <div class="month">
        ${n.map(a=>{let r=e.filter(l=>Ve(l,a)).sort((l,c)=>c.allDay-l.allDay||l.start-c.start);return m`<div
            class="cell ${a.getMonth()===o?"":"out"} ${+a===i?"today":""}"
            @click=${()=>this._go("day",a)}
          >
            <div class="num">${a.getDate()}</div>
            ${r.slice(0,3).map(l=>m`<div class="pill ${l.allDay?"all":""} ${l.end<=s?"past":""}" style=${Tt(l.cal.color)}>
                ${l.allDay?"":m`<i>${St(l.start)}</i>`}${l.title}
              </div>`)}
            ${r.length>3?m`<div class="more">+${r.length-3} more</div>`:$}
          </div>`})}
      </div>
    </div>`}_detail(t){let e=t.allDay?t.start.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"}):`${t.start.toLocaleDateString([],{weekday:"long",month:"short",day:"numeric"})}, ${St(t.start)} \u2013 ${St(t.end)}`;return m`<div class="scrim" @click=${s=>s.target===s.currentTarget&&(this._sel=null)}>
      <div class="sheet" style=${Tt(t.cal.color)}>
        <div class="stitle">${t.title}</div>
        <div class="srow">${e}</div>
        ${t.location?m`<div class="srow">${t.location}</div>`:$}
        <div class="srow cal">${t.cal.name}</div>
        ${t.description?m`<div class="desc">${t.description}</div>`:$}
        <button @click=${()=>this._sel=null}>Close</button>
      </div>
    </div>`}};ct(Xt,"properties",{hass:{attribute:!1},_events:{state:!0},_now:{state:!0},_view:{state:!0},_anchor:{state:!0},_hidden:{state:!0},_sel:{state:!0},_err:{state:!0}}),ct(Xt,"styles",Ft`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
      color: #d6eef2;
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      --acc: var(--jr-color, #2e9df5);
      --line: rgba(255, 255, 255, 0.08);
      --red: #ff4d5e;
      position: relative;
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
      text-align: left;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 4px 14px 10px;
      flex-wrap: wrap;
    }
    .clock .time {
      font-size: 38px;
      font-weight: 300;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      color: var(--acc);
      text-shadow: 0 0 14px var(--acc);
    }
    .clock .date { font-size: 12px; opacity: 0.65; margin-top: 4px; letter-spacing: 0.04em; }
    .glance { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 220px; }
    .glance > * {
      border: 1px solid var(--line);
      border-left: 3px solid var(--c, var(--line));
      background: var(--cb, transparent);
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 15px;
    }
    .glance span { opacity: 0.65; }
    .glance .now b { color: var(--red); }
    .glance .next b { color: var(--acc); }
    .glance .free { opacity: 0.6; }
    .tools {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 14px 8px;
      flex-wrap: wrap;
    }
    .seg { display: flex; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; margin-right: 6px; }
    .seg button, .nav {
      background: none;
      border: none;
      padding: 6px 14px;
      min-height: 36px;
    }
    .seg button.on {
      background: rgba(255, 255, 255, 0.06);
      color: var(--acc);
      box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
    }
    .nav { border: 1px solid var(--line); border-radius: 18px; }
    /* back / today / forward never split across lines */
    .navs { display: flex; gap: 6px; flex: none; }
    .nav.dim { opacity: 0.45; }
    .title { margin-left: 6px; font-weight: 600; letter-spacing: 0.04em; color: var(--acc); }
    .err { color: var(--red); font-size: 12px; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; padding: 0 14px 8px; }
    .chip {
      border: 1px solid var(--c);
      background: var(--cb);
      border-radius: 14px;
      padding: 2px 10px;
      font-size: 12px;
    }
    .chip.off { background: none; opacity: 0.4; text-decoration: line-through; }
    .scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border-top: 1px solid var(--line);
    }
    .heads, .grid { display: grid; grid-template-columns: 46px repeat(var(--days), minmax(0, 1fr)); }
    /* sticky inside the scroller, so the columns line up with or without a scrollbar */
    .heads {
      position: sticky;
      top: 0;
      z-index: 4;
      background: #061014;
      border-bottom: 1px solid var(--line);
    }
    .head { padding: 6px 3px; border-left: 1px solid var(--line); min-width: 0; }
    .dname { font-size: 12px; opacity: 0.6; padding: 0 3px 3px; white-space: nowrap; }
    .dname span { font-size: 18px; font-weight: 500; }
    .head.today .dname { opacity: 1; color: var(--acc); }
    .head.today .dname span { text-shadow: 0 0 10px var(--acc); }
    .allday {
      display: block;
      width: 100%;
      background: var(--cb);
      border: none;
      border-left: 3px solid var(--c);
      border-radius: 3px;
      padding: 1px 6px;
      margin-top: 2px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .grid {
      position: relative;
      background-image: linear-gradient(var(--line) 1px, transparent 1px);
      background-size: 100% ${At}px;
    }
    .gutter { position: relative; }
    .hour {
      position: absolute;
      right: 6px;
      transform: translateY(-50%);
      font-size: 10px;
      opacity: 0.5;
      white-space: nowrap;
    }
    .col { position: relative; border-left: 1px solid var(--line); min-width: 0; }
    .col.today { background: rgba(255, 255, 255, 0.025); }
    .ev {
      position: absolute;
      box-sizing: border-box;
      background: var(--cb);
      border: 1px solid transparent;
      border-left: 3px solid var(--c);
      border-radius: 4px;
      padding: 2px 6px;
      overflow: hidden;
      font-size: 12px;
      line-height: 1.3;
    }
    .ev .t { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev .w { opacity: 0.7; font-size: 11px; }
    .ev.past, .pill.past { opacity: 0.4; }
    .ev.live { border-color: var(--c); box-shadow: 0 0 10px var(--c); }
    .nowline {
      position: absolute;
      left: -5px;
      right: 0;
      height: 2px;
      background: var(--red);
      box-shadow: 0 0 8px var(--red);
      z-index: 3;
      pointer-events: none;
    }
    .nowline::before {
      content: "";
      position: absolute;
      left: 0;
      top: -4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--red);
    }
    .mhead, .month { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
    .mhead {
      position: sticky;
      top: 0;
      z-index: 2;
      background: #061014;
      font-size: 11px;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .mhead div { padding: 6px 8px; }
    .cell {
      min-height: 92px;
      border-top: 1px solid var(--line);
      border-left: 1px solid var(--line);
      padding: 4px;
      cursor: pointer;
      min-width: 0;
    }
    .cell.out { opacity: 0.35; }
    .num { font-size: 13px; padding: 0 2px 3px; }
    .cell.today { background: rgba(255, 255, 255, 0.04); box-shadow: inset 0 0 0 1px var(--acc); }
    .cell.today .num { color: var(--acc); font-weight: 700; text-shadow: 0 0 8px var(--acc); }
    .pill {
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-left: 2px solid var(--c);
      padding: 0 4px;
      margin-bottom: 2px;
    }
    .pill.all { background: var(--cb); border-radius: 2px; }
    .pill i { font-style: normal; opacity: 0.6; margin-right: 4px; }
    .more { font-size: 11px; opacity: 0.55; padding-left: 4px; }
    .scrim {
      position: absolute;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      padding: 16px;
    }
    .sheet {
      background: #061014;
      border: 1px solid var(--c);
      box-shadow: 0 0 24px rgba(0, 0, 0, 0.6), 0 0 12px var(--cb);
      border-radius: 12px;
      padding: 16px 18px;
      width: min(420px, 100%);
      max-height: 80%;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .stitle { font-size: 19px; font-weight: 600; margin-bottom: 8px; color: var(--c); }
    .srow { margin: 4px 0; }
    .srow.cal { opacity: 0.55; font-size: 12px; }
    .desc { white-space: pre-wrap; margin-top: 10px; font-size: 13px; opacity: 0.8; overflow-wrap: anywhere; }
    .sheet button {
      margin-top: 14px;
      border: 1px solid var(--acc);
      background: none;
      color: var(--acc);
      border-radius: 18px;
      padding: 6px 18px;
      min-height: 36px;
    }
    @media (max-width: 600px) {
      .clock .time { font-size: 30px; }
      /* phone: views on the left, back / today / forward on the right, the
         title on its own line under them */
      .tools { justify-content: space-between; gap: 8px; padding: 0 10px 8px; }
      .seg { margin-right: 0; }
      .seg button, .nav { padding: 6px 11px; min-height: 40px; }
      .nav[aria-label] { min-width: 40px; font-size: 18px; }
      .title { flex-basis: 100%; margin-left: 2px; }
      .top { gap: 12px; padding: 4px 10px 10px; }
      .glance { min-width: 0; }
      .chips { padding: 0 10px 8px; }
      .cell { min-height: 64px; padding: 2px; }
      .pill i { display: none; }
    }
  `);customElements.get("hubbubb-calendar")||customElements.define("hubbubb-calendar",Xt);function Zs(h){let t={pending:[],accepted:[],decided:[]};for(let s of Array.isArray(h)?h:[])s.status==="pending"?t.pending.push(s):s.status==="accepted"?t.accepted.push(s):t.decided.push(s);let e=s=>(s.last_seen||"")+(s.first_seen||"")+s.id;for(let s of Object.values(t))s.sort((i,o)=>e(i)<e(o)?1:-1);return t}var Bi=/(^|[^\w:/@.~-])((?:~|\.{1,2})?\/[\w.@~-]+(?:\/[\w.@~-]+)*|[\w.@-]+(?:\/[\w.@-]+)+\.\w+)(:\d+)?/g;function Ge(h){let t=[],e=0;for(let s of h.matchAll(Bi)){let i=s[2],o=s[3]||"",n=s.index+s[1].length;for(;/[.,;]$/.test(i);)i=i.slice(0,-1);n>e&&t.push(h.slice(e,n)),t.push({path:i,line:o}),e=n+i.length+o.length}return e<h.length&&t.push(h.slice(e)),t}function Qe(h){return Ge(h.replace(/\[Image #\d+\]/g," ")).filter(t=>typeof t=="string").join(" ").split(/\s+/).join(" ").trim().slice(0,200)}function Ye(h,t=2,e=1,s=.06,i=1.04){for(let o=0;o<t;o++)for(let n=0;n<h.length;n++){let a=h[n];if(!(!a.held||a.pop>=0))for(let r=n+1;r<h.length;r++){let l=h[r];if(!l.held||l.pop>=0)continue;let c=l.x-a.x,d=l.y-a.y,p=Math.hypot(c,d);p<.001&&(c=.1,d=0,p=.1);let u=a.r+l.r,g=c/p,b=d/p;if(p<u){let _=(u-p)*.5*e;a.x-=g*_,a.y-=b*_,l.x+=g*_,l.y+=b*_}else if(s>0&&p>u*i&&p<u*1.5){let _=(p-u)*s;a.x+=g*_,a.y+=b*_,l.x-=g*_,l.y-=b*_}}}return h}function Xe(h,t,e,s){for(let i of h){if(!i.held||i.pop>=0)continue;let o=i.x-t,n=i.y-e,a=Math.hypot(o,n);a<.001&&(o=1,n=0,a=1);let r=s+i.r;if(a<r){let l=o/a,c=n/a;i.x=t+l*r,i.y=e+c*r;let d=i.vx*l+i.vy*c;d<0&&(i.vx-=d*l,i.vy-=d*c)}}return h}function Je(h,t,e,s,i=1){for(let o of h){if(!o.held||o.pop>=0||!o.anchor)continue;let n=o.x-t,a=o.y-e,r=Math.hypot(n,a);r<.001&&(n=1,a=0,r=1);let l=n/r,c=a/r,d=s+o.r;o.x+=(t+l*d-o.x)*i,o.y+=(e+c*d-o.y)*i;let p=o.vx*l+o.vy*c;o.vx-=p*l,o.vy-=p*c}return h}function ti(h,t,e){let s=Math.PI*2;if(!h.length)return{angle:0,gap:s};let i=h.map(a=>Math.atan2(a.y-e,a.x-t)).sort((a,r)=>a-r),o=-1,n=0;for(let a=0;a<i.length;a++){let r=i[a],c=(a+1<i.length?i[a+1]:i[0]+s)-r;c>o&&(o=c,n=r+c/2)}return{angle:n,gap:o}}function ei(h,t){let{dt:e,rate:s,maxRatio:i,maxR:o,sizeBias:n=0,rand:a=Math.random}=t,r=0;for(let l=0;l<h.length;l++){let c=h[l];if(!(!c.held||c.pop>=0||c.gone))for(let d=l+1;d<h.length;d++){let p=h[d];if(!p.held||p.pop>=0||p.gone||Math.hypot(p.x-c.x,p.y-c.y)>c.r+p.r+1||(c.r>=p.r?c.r/p.r:p.r/c.r)>i)continue;let b=Math.sqrt(c.r*c.r+p.r*p.r);if(b>o)continue;let _=Math.min(c.r,p.r),v=n?Math.pow(Math.min(1,_/o),1/n):1;if(a()>s*v*e)continue;let w=c.r>=p.r?c:p,x=w===c?p:c,y=w.r*w.r,M=x.r*x.r,k=y+M;if(w.x=(w.x*y+x.x*M)/k,w.y=(w.y*y+x.y*M)/k,w.vx=(w.vx*y+x.vx*M)/k,w.vy=(w.vy*y+x.vy*M)/k,w.r=b,w.full=b,w.age=0,x.gone=!0,r++,w!==c)break}}if(r)for(let l=h.length-1;l>=0;l--)h[l].gone&&h.splice(l,1);return r}function Ze(h,t,e,s,i=2,o=1){let n=h.filter(a=>a.held&&!(a.pop>=0)&&a.anchor);if(n.length<2)return h;for(let a=0;a<i;a++)for(let r=0;r<n.length;r++)for(let l=r+1;l<n.length;l++){let c=n[r],d=n[l],p=s+c.r,u=s+d.r,g=Math.atan2(c.y-e,c.x-t),b=Math.atan2(d.y-e,d.x-t),_=b-g;for(;_>Math.PI;)_-=Math.PI*2;for(;_<-Math.PI;)_+=Math.PI*2;let v=Math.sqrt(p*p+u*u-2*p*u*Math.cos(_)),w=c.r+d.r;if(v>=w)continue;let x=(p+u)/2,y=(w-v)/x*.5*o,M=_>=0?1:-1,k=g-M*y,S=b+M*y;c.x=t+Math.cos(k)*p,c.y=e+Math.sin(k)*p,d.x=t+Math.cos(S)*u,d.y=e+Math.sin(S)*u}return h}function si(h,t){let{dt:e,maxR:s,rand:i=Math.random}=t,o=h.r/s;if(h.r>=s*.995||h.age>h.span*(.55+1.7*o))return!0;let n=o>.7?.5*Math.pow(o,6):0;return n>0&&i()<n*e}var ci=((new Error().stack||"").match(/\/(\d+\.\d+\.\d+)\//)||[])[1]||"dev";console.info(`hubbubb-ring-card ${ci}`);var di="4.21.0",$e="assist_satellite",Ui=["idle","listening","processing","responding"],es={size:240,background:"dark",particles:0,particle_size:1,follow_media_player:!0,audio_offset:0,idle_color:"#2e9df5",listening_color:"#00ff88",processing_color:"#ffaa33",responding_color:"#00e5ff",offline_color:"#4a5560",build_entity:"",build_scope:"device",build_dashboard:"",build_page:!1,build_return:"/",build_projects:[],animation:"hubbubb",assistant_name:"Assistant",panel_height:0,panel_fullscreen:!1,panel_bg:"",panel_border:"",panel_text:"",terminal_bg:"",terminal_text:"",honeycomb:!0,tap_message:"Yes?",dock:!0,review_path:"/jarvis-review",review_entity:"sensor.jarvis_review",intro_message:"",todos:!0,todo_entities:[],todo_exclude:[],announce_entity:"",messages_entity:""},ii=(h,t)=>{let e=Math.round(t*pi);return e<0||e>=h.length?0:h[e]},bt=16,pi=50,Ni={idle:"idle_color",listening:"listening_color",processing:"processing_color",responding:"responding_color"},oi={idle:{swirl:.95,bright:1.75,radius:0,amp:1,turb:.4,sweep:0,speech:0},listening:{swirl:1.8,bright:1.8,radius:-.012,amp:1.15,turb:.6,sweep:.35,speech:0},processing:{swirl:.95,bright:1.5,radius:0,amp:1,turb:.3,sweep:1,speech:0},responding:{swirl:1.5,bright:1.55,radius:.006,amp:1.15,turb:1,sweep:.12,speech:1},offline:{swirl:.3,bright:.4,radius:-.012,amp:.5,turb:.15,sweep:0,speech:0}},Hi=new Set(["tool","out","err","screen","cmd"]),qi=h=>/^\$ /.test(h)?"l-cmd":/^\+/.test(h)?"l-add":/^- /.test(h)||/^--- /.test(h)?"l-del":/\b(error|errno|failed|failure|fatal|traceback|exception|refused|denied|not found|no such)\b/i.test(h)?"l-err":/\b(warn|warning|deprecat\w+|skipped)\b/i.test(h)?"l-warn":/^(Edit|Write|Read|Grep|Glob|Agent|Task|WebFetch|WebSearch|TodoWrite|Skill)\b/.test(h)?"l-tool":"",Fi=/`([^`\n]+)`|\*\*([^*\n]+)\*\*/g,ss=(h,t,e)=>h.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),Vi={1:"can't reach Home Assistant",2:"invalid authentication",3:"connection lost \u2014 reconnecting",4:"no Home Assistant host",5:"https/http mismatch"};var sn=Math.PI/180,U=(h,t,e)=>Math.min(e,Math.max(t,h)),is=h=>Math.round(h*100)/100,Jt=h=>{let t=h>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},Wi=h=>{let t=(1+Math.sqrt(5))/2,e=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(([r,l,c])=>{let d=Math.hypot(r,l,c);return[r/d,l/d,c/d]}),s=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=new Map,o=(r,l)=>{let c=r<l?`${r}_${l}`:`${l}_${r}`,d=i.get(c);if(d!==void 0)return d;let[p,u,g]=e[r],[b,_,v]=e[l],w=(p+b)/2,x=(u+_)/2,y=(g+v)/2,M=Math.hypot(w,x,y);return e.push([w/M,x/M,y/M]),i.set(c,e.length-1),e.length-1};for(let r=0;r<h;r++){let l=[];for(let[c,d,p]of s){let u=o(c,d),g=o(d,p),b=o(p,c);l.push([c,u,b],[d,g,u],[p,b,g],[u,g,b])}s=l}let n=new Set,a=[];for(let r of s)for(let l=0;l<3;l++){let c=r[l],d=r[(l+1)%3],p=c<d?c*1e5+d:d*1e5+c;n.has(p)||(n.add(p),a.push(c,d))}return{verts:e,edges:a}},os=Wi(3),Ki=(()=>{let h=Jt(11073),t=os.verts.length,e=[];for(let s=0;s<16;s++)e.push({v:Math.floor(h()*t),tw:.5+h()*1.6,ph:h()*6.28});return e})(),Lt=96,ni=.55,ai=.45,ye=[{r:.625,amp:.068,thick:.007,rev:-.8,share:.21,glow:.72},{r:.655,amp:.075,thick:.008,rev:-.8,share:.21,glow:.85},{r:.845,amp:.082,thick:.009,rev:1,share:.3,glow:1.2},{r:.875,amp:.09,thick:.008,rev:1,share:.28,glow:1.4}],ts=we.map((h,t)=>({r:h,share:t===0?.58:.42,dir:t===0?1:-1})),jt={fold:.4,burst:.9,settle:2.4,word:2.6,wordHold:3.8,wordGone:4.6,wordEnd:5,icons:5.3,iconStep:.75,clock:9.3,clockEnd:12,imp:12.2,impEnd:15,down:18.4,dot:18.8,reactor:19.2,back:21.6,end:25},Gi=[[.9,"Allow me to introduce myself."],[2.6,"I am {name}, a virtual artificial intelligence,"],[5.3,"and I'm here to assist you with a variety of tasks as best I can,"],[9.3,"24 hours a day, 7 days a week."],[12.2,"Importing all preferences from home interface."],[16,"Systems are now fully operational."],[22,"Let me know how I can assist."]],Qi=.35,Yi=1.2,Ot=128,Xi=(()=>{let h=Jt(51729),t=[];for(let e=0;e<5;e++)t.push({a:h()*Math.PI*2,w:(.08+h()*.22)*(e%2?-1:1),sg:.2+h()*.3,h:.6+h()*.7,f:.25+h()*.6,ph:h()*Math.PI*2});return t})(),ui=(()=>{let t=Math.sqrt(3)*5,e=(s,i)=>{let o="";for(let n=0;n<6;n++){let a=n*60*Math.PI/180;o+=`${n===0?"M":"L"}${is(s+5*Math.cos(a))} ${is(i+5*Math.sin(a))}`}return o+"Z"};return[e(0,0),e(3*5,0),e(0,t),e(3*5,t),e(1.5*5,t/2)].join("")})(),Dt={w:15,h:is(Math.sqrt(3)*5)},ri=.62,li=3e3,Ji=1e12,Zi=h=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${Dt.w}" height="${Dt.h}" viewBox="0 0 ${Dt.w} ${Dt.h}"><path d="${ui}" fill="none" stroke="${h}" stroke-width="0.35"/></svg>`)+'")',hi=h=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(h).trim());if(t){let s=t[1];s.length===3&&(s=s.split("").map(o=>o+o).join(""));let i=parseInt(s,16);return[i>>16&255,i>>8&255,i&255]}let e=/rgba?\(([^)]+)\)/i.exec(String(h));if(e){let s=e[1].split(",").map(i=>parseFloat(i));return[s[0]|0,s[1]|0,s[2]|0]}return[53,224,255]},Et=class extends st{set hass(t){var d,p,u,g,b,_,v,w,x;if(this._hass=t,!this._config)return;this._linked||(this._linked=!0,this._openLinked());let e=(d=t==null?void 0:t.states)==null?void 0:d[this._config.entity],s=e?e.state:"unavailable",i=this._state;if(s!==this._state&&(this._state=s),this._config.build_entity&&this._config.build_scope==="global"){let y=((u=(p=t==null?void 0:t.states)==null?void 0:p[this._config.build_entity])==null?void 0:u.state)==="on";this._config.build_page?(this._entityOn&&!y&&this._navigate(this._config.build_return),this._entityOn=y):y!==this._build&&this._setBuild(y,!1)}this._listenForSpeech(t),this._watchTodos(t),this._reviewEl&&((g=this._sheet)==null?void 0:g.kind)==="review"&&(this._reviewEl.hass=t);let o=(b=t==null?void 0:t.states)==null?void 0:b[this._config.announce_entity],n=o?o.state==="on":null;n!==this._announce&&(this._announce=n);let a=(_=t==null?void 0:t.states)==null?void 0:_[this._config.messages_entity],r=a?a.state==="on":null;r!==this._messages&&(this._messages=r);let l=this._config.follow_media_player?this._resolveMediaPlayer(t):null,c=l?(w=(v=t==null?void 0:t.states)==null?void 0:v[l])==null?void 0:w.state:void 0;c!==this._mp&&(this._mp=c),this._audioSync(l?(x=t==null?void 0:t.states)==null?void 0:x[l]:null),this._state==="responding"&&i!=="responding"&&this._grabTtsUrl(),this._sessTimer||(this._sessTimer=setInterval(()=>{this._pollSessions(),this._nextMeeting()},12e3),this._pollSessions(),this._nextMeeting())}_trackDone(t){this._unread||(this._unread=new Set(this._recall("unread",24*3600*1e3)||[]),this._wasBusy=new Map);let e=new Set;for(let i of t){e.add(i.id);let o=this._build&&this._sel===i.id;i.busy||o?this._unread.delete(i.id):this._wasBusy.get(i.id)&&this._unread.add(i.id),this._wasBusy.set(i.id,!!i.busy),i.done=this._unread.has(i.id)}for(let i of[...this._unread])e.has(i)||this._unread.delete(i);for(let i of[...this._wasBusy.keys()])e.has(i)||this._wasBusy.delete(i);let s=[...this._unread].sort().join(",");return s!==this._unreadKey&&(this._unreadKey=s,this._store("unread",[...this._unread])),t}_settle(t,e){JSON.stringify(e)!==JSON.stringify(this[t])&&(this[t]=e)}async _pollSessions(){if(!(this._build||this._onScreen===!1||!this._hass))try{let t=await this._api("agent_status");this._settle("_sessions",this._trackDone(t.sessions||[])),t.projects&&this._settle("_projects",t.projects)}catch(t){}}async _nextMeeting(){var o;if(this._config.dock===!1||this._config.build_page||!this._hass)return;let t=new Date;if(!this._meetAt||t-this._meetAt>3e5){this._meetAt=t;let n=[];try{n=JSON.parse(localStorage.getItem("hubbubb-calendar-hidden"))||[]}catch(d){}let a=new Date(t);a.setHours(24,0,0,0);let r=`start=${encodeURIComponent(t.toISOString())}&end=${encodeURIComponent(a.toISOString())}`,l=Object.keys(this._hass.states).filter(d=>d.startsWith("calendar.")&&!n.includes(d)),c=await Promise.allSettled(l.map(d=>this._hass.callApi("GET",`calendars/${d}?${r}`).then(p=>p.map(u=>We(u,{id:d})))));this._meetNext=((o=Ke(c.flatMap(d=>d.status==="fulfilled"?d.value:[]),t).next)==null?void 0:o.start)||null}let e=this._meetNext&&this._meetNext.toDateString()===t.toDateString()?this._meetNext-t:-1,s=Math.max(1,Math.round(e/6e4)),i=e<=0?"":s<60?`${s}m`:`${Math.floor(s/60)}h${s%60?` ${s%60}m`:""}`;i!==this._meetLabel&&(this._meetLabel=i)}_resolveMediaPlayer(t){var i,o,n;if(this._config.media_player)return this._config.media_player;if(this._mpResolved!==void 0)return this._mpResolved;let e=null,s=(o=(i=t==null?void 0:t.entities)==null?void 0:i[this._config.entity])==null?void 0:o.device_id;if(s&&t.entities){for(let a in t.entities)if(a.startsWith("media_player.")&&t.entities[a].device_id===s){e=a;break}}if(!e){let r=`media_player.${this._config.entity.split(".")[1].replace(/_assist_satellite$/,"")}_media_player`;(n=t==null?void 0:t.states)!=null&&n[r]&&(e=r)}return this._mpResolved=e,e}_effectiveState(){if(this._voiceState)return this._voiceState==="responding"&&this._envEl&&!this._envEl.currentTime?"processing":this._voiceState;let t=Ui.includes(this._state)?this._state:"offline",e=this._speechRaw(t);return this._speaking(e)?"responding":e||t==="responding"?"processing":t}_speechRaw(t){let e=this._mp;return e==="playing"?t!=="listening":e==="idle"||e==="paused"?!1:t==="responding"}_speaking(t){var i;let e=Math.max(0,-(Number(this._config.audio_offset)||0));if(!e)return t;let s=performance.now()/1e3;return t!==this._spkRaw&&(this._spkRaw=t,this._spkAt=s),s-((i=this._spkAt)!=null?i:-1e9)<e?!t:t}get hass(){return this._hass}get _name(){var t;return((t=this._config)==null?void 0:t.assistant_name)||"Assistant"}setConfig(t){if(!t||!t.entity)throw new Error("hubbubb-ring-card: you need to define an `entity`");if(t.entity.split(".")[0]!==$e)throw new Error(`hubbubb-ring-card: entity must be in the ${$e} domain`);this._config=L(L({},es),t),this._particles=null,this._mpResolved=void 0,t.build_page&&this._setBuild(!0,!1),this._hass&&(this.hass=this._hass)}getCardSize(){var t,e;return Math.max(2,Math.ceil(Number((e=(t=this._config)==null?void 0:t.size)!=null?e:240)/50))}getGridOptions(){return{rows:"auto",columns:12,min_rows:2,min_columns:6}}_cardVars(t){let e=this._config,s=o=>Number(o)>0?`${Number(o)}px`:"",i={"--jr-size":`${Number(e.size)}px`,"--jr-color":t,"--jr-panel-h":e.panel_height==="fill"?"100%":s(e.panel_height),"--jr-panel-bg":e.panel_bg,"--jr-panel-border":e.panel_border,"--jr-panel-text":e.panel_text,"--jr-term-bg":e.terminal_bg,"--jr-term-text":e.terminal_text};return Object.entries(i).filter(([,o])=>o).map(([o,n])=>`${o}:${n}`).join(";")}static getConfigElement(){return document.createElement("hubbubb-ring-card-editor")}static getStubConfig(t){var a,r;let e=Object.keys((a=t==null?void 0:t.states)!=null?a:{}),s=l=>{var c;return(c=e.find(d=>d.startsWith("switch.")&&d.endsWith(l)))!=null?c:""},i=s("_build_mode"),n=i.slice(7,-11).split("_").filter(Boolean).map(l=>l[0].toUpperCase()+l.slice(1)).join(" ");return L(L(L(L({type:"custom:hubbubb-ring-card",entity:(r=e.find(l=>l.split(".")[0]===$e))!=null?r:""},n&&{assistant_name:n}),i&&{build_entity:i}),s("_agent_announcements")&&{announce_entity:s("_agent_announcements")}),s("_message_watch")&&{messages_entity:s("_message_watch")})}connectedCallback(){var t,e,s,i,o;super.connectedCallback(),this._onVisibility=()=>this._pump(),(t=document.addEventListener)==null||t.call(document,"visibilitychange",this._onVisibility),this._onHide=()=>{this._saveDraft(),this._saveQueue()},(e=window.addEventListener)==null||e.call(window,"pagehide",this._onHide),this._onFirstTap=()=>this._unlockSpeech(),(s=this.addEventListener)==null||s.call(this,"pointerdown",this._onFirstTap,{once:!0}),this._onActivity=()=>this._lastTouch=Date.now(),(i=window.addEventListener)==null||i.call(window,"pointerdown",this._onActivity,!0),(o=window.addEventListener)==null||o.call(window,"keydown",this._onActivity,!0),this._restoreQueue(),this._build&&this._setBuild(!0,!1)}disconnectedCallback(){var t,e,s,i,o,n,a,r;for(let l of this._speechUnsubs||[])try{l()}catch(c){}this._speechUnsubs=[],this._speechSub=!1,this._onActivity&&((t=window.removeEventListener)==null||t.call(window,"pointerdown",this._onActivity,!0),(e=window.removeEventListener)==null||e.call(window,"keydown",this._onActivity,!0),this._onActivity=null),this._onFirstTap&&((s=this.removeEventListener)==null||s.call(this,"pointerdown",this._onFirstTap),this._onFirstTap=null),super.disconnectedCallback(),this._saveDraft(),this._saveQueue(),this._lockScroll(!1),(i=document.removeEventListener)==null||i.call(document,"visibilitychange",this._onVisibility),(o=window.removeEventListener)==null||o.call(window,"pagehide",this._onHide),this._stop(),(n=this._membrane)==null||n.dispose(),this._membrane=void 0,this._stopIntroVisuals(),this._stopPolling(),this._stopLocalVoice(),clearInterval(this._sessTimer),this._sessTimer=null,(a=this._io)==null||a.disconnect(),(r=this._ro)==null||r.disconnect(),this._io=this._ro=null,this._canvas=null,this._ctx=null}_navigate(t){!t||location.pathname.startsWith(t.split("?")[0])||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")))}_listenForSpeech(t){if(this._speechSub||!(t!=null&&t.connection))return;this._speechSub=!0;let e=i=>i.then(o=>(this._speechUnsubs||(this._speechUnsubs=[])).push(o)).catch(()=>{for(let o of this._speechUnsubs||[])try{o()}catch(n){}this._speechUnsubs=[],this._speechSub=!1}),s=i=>{var a,r;let o=(a=i==null?void 0:i.data)==null?void 0:a.message,n=(r=i==null?void 0:i.data)==null?void 0:r.device;if(o){if(n){n===this._deviceId()&&this._speakHere(o);return}this._electAndSpeak(o)}};e(t.connection.subscribeEvents(s,"hubbubb_home_message")),e(t.connection.subscribeEvents(s,"jarvis_claude_message")),e(t.connection.subscribeEvents(i=>{let o=J(L({},(i==null?void 0:i.data)||{}),{at:Date.now()}),n=this._claims||(this._claims=[]);for(n.push(o);n.length&&n[0].at<o.at-li;)n.shift()},"hubbubb_home_claim"))}_deviceId(){if(this._device)return this._device;let t=()=>Math.random().toString(36).slice(2,12);try{this._device=localStorage.getItem("jrc:device")||t(),localStorage.setItem("jrc:device",this._device)}catch(e){this._device=t()}return this._device}async _electAndSpeak(t){let e={idle:this._lastTouch?Date.now()-this._lastTouch:Ji,tie:Math.random()};try{await this._hass.connection.sendMessagePromise({type:"fire_event",event_type:"hubbubb_home_claim",event_data:e})}catch(n){return this._speakHere(t)}await new Promise(n=>setTimeout(n,1200));let s=Date.now()-li;(this._claims||[]).filter(n=>n.at>=s).reduce((n,a)=>a.idle<n.idle||a.idle===n.idle&&a.tie<n.tie?a:n,e).tie===e.tie&&this._speakHere(t)}_unlockSpeech(){if(this._speechAudio)return;let t=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");t.play().catch(()=>{}),this._speechAudio=t}async _ttsUrl(t){let e=this._hass;if(!this._ttsCfg){let o=await e.callWS({type:"assist_pipeline/pipeline/list"}),n=(o==null?void 0:o.pipelines)||[],a=n.find(r=>r.id===o.preferred_pipeline)||n[0];if(!(a!=null&&a.tts_engine))return null;this._ttsCfg={engine_id:a.tts_engine,language:a.tts_language,voice:a.tts_voice}}let s=this._ttsCfg,i=await e.callApi("POST","tts_get_url",L({engine_id:s.engine_id,message:t,language:s.language},s.voice?{options:{voice:s.voice}}:{}));return(i==null?void 0:i.path)||(i==null?void 0:i.url)||null}async _speakHere(t){if(!(!this._hass||!t))try{let s=await this._ttsUrl(t);if(!s)return;let i=this._speechAudio||(this._speechAudio=new Audio);this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null);try{let n=await(await fetch(s)).arrayBuffer();this._speechBlob=URL.createObjectURL(new Blob([n],{type:"audio/mpeg"})),i.src=this._speechBlob,this._trackSpeech(i,this._speechBlob,n)}catch(o){this._trackSpeech(i,s),i.src=s}i.onended=i.onerror=()=>{this._releaseSpeech(i),this._speechBlob&&(URL.revokeObjectURL(this._speechBlob),this._speechBlob=null)},await i.play().catch(()=>{i.onended(),this._toast("Tap anywhere to let it speak here.")})}catch(s){}}_toggleAnnounce(){this._toggleHelper(this._config.announce_entity,"_announce",`${this._name} finishes: spoken on the puck`,`${this._name} finishes: phone only`)}_toggleMessages(){this._toggleHelper(this._config.messages_entity,"_messages","Hubbubb messages: read out as they arrive","Hubbubb messages: quiet")}_toggleHelper(t,e,s,i){let o=this[e]===!0;this[e]=!o,this._hass.callService("homeassistant",o?"turn_off":"turn_on",{entity_id:t}),this._toast(o?i:s)}_setBuild(t,e=!0){if(e&&this._config.build_entity&&this._hass&&this._config.build_scope==="global"&&this._hass.callService("homeassistant",t?"turn_on":"turn_off",{entity_id:this._config.build_entity}),this._config.build_dashboard){let s=this._build;this._build=t,t&&(e||s===!1)&&this._navigate(this._config.build_dashboard);return}if(this._config.build_page&&!t){this._navigate(this._config.build_return);return}this._build=t,t?(this._err="",this._sideW=this._recall("sidew",365*864e5)||0,this._loadModels(),this._poll(!0),this._startPolling(),!this._vvHandler&&window.visualViewport&&(this._vvHandler=()=>this._vvSync(),window.visualViewport.addEventListener("resize",this._vvHandler),window.visualViewport.addEventListener("scroll",this._vvHandler)),this._vvSync(),this._lockScroll(!0)):(this._stopPolling(),this._lockScroll(!1),this._sel=null,this._msgs=null,this._ask=null,this._activity=null,this._screen=null,this._suggestion=null,this._suggestion=null,this._permission=null,this._confirmKill=null,this._picking=!1,this._details=!1,this._view=null,this._swipe=null,this._vvHandler&&window.visualViewport&&(window.visualViewport.removeEventListener("resize",this._vvHandler),window.visualViewport.removeEventListener("scroll",this._vvHandler),this._vvHandler=null))}_lockScroll(t){var i;if(!((i=this._config)!=null&&i.build_page))return;let e=document.documentElement,s=document.body;s&&(t?(this._prevOverflow===void 0&&(this._prevOverflow=s.style.overflow,this._prevOverscroll=e.style.overscrollBehavior,this._prevHtmlOverflow=e.style.overflow),s.style.overflow="hidden",e.style.overflow="hidden",e.style.overscrollBehavior="none"):this._prevOverflow!==void 0&&(s.style.overflow=this._prevOverflow,e.style.overflow=this._prevHtmlOverflow,e.style.overscrollBehavior=this._prevOverscroll,this._prevOverflow=this._prevOverscroll=void 0,this._prevHtmlOverflow=void 0))}_syncCorner(t){window.innerWidth!==this._vvW&&(this._vvW=window.innerWidth,this._vvMax=t),this._vvMax=Math.max(this._vvMax||0,t);let e=t>=this._vvMax-4;this.style.setProperty("--jr-botr",e?"56px":"16px")}_vvSync(){let t=window.visualViewport;if(!t)return;let e=Math.round(t.height),s=Math.round(t.offsetTop),i=e!==this._vvH;i&&(this._vvH=e,this.style.setProperty("--jr-vvh",`${e}px`),this._syncCorner(e)),(i||this._vvT==null)&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`),i&&this._settlePin());let o=this._vvPrev==null?0:Math.abs(e-this._vvPrev),n=this._vvPrev==null;if(this._vvPrev=e,!n&&o<12)return;let a=this._growCap();a!==this._lastCap&&(this._lastCap=a,this._autoGrow(this._composerEl())),this._stick&&this._toBottom()}_settlePin(){clearTimeout(this._settleA),clearTimeout(this._settleB);let t=()=>{this._unscroll();let e=window.visualViewport;if(!e)return;let s=Math.round(e.offsetTop);s!==this._vvT&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`))};requestAnimationFrame(t),this._settleA=setTimeout(t,200),this._settleB=setTimeout(t,500)}_unscroll(){if(!this._build)return;window.scrollTo(0,0),document.scrollingElement&&(document.scrollingElement.scrollTop=0);let t=this.parentNode;for(;t;)t.scrollTop>0&&(t.scrollTop=0),t=t.parentNode||t.host}_startPolling(){let t=this._sel?600:1500;this._pollTimer&&this._pollMs===t||(this._pollTimer&&clearInterval(this._pollTimer),this._pollMs=t,this._pollTimer=setInterval(()=>this._poll(),t))}_stopPolling(){this._pollTimer&&clearInterval(this._pollTimer),this._pollTimer=null,this._pollMs=null}_errText(t){return typeof t=="number"?Vi[t]||`websocket error ${t}`:String((t==null?void 0:t.message)||t)}async _api(t,e={}){var n,a,r;let s=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=(n=s==null?void 0:s.response)==null?void 0:n.content;if(typeof i=="string")try{i=JSON.parse(i)}catch(l){}let o=(r=(a=s==null?void 0:s.response)==null?void 0:a.status)!=null?r:0;if(o<200||o>=300||(i==null?void 0:i.ok)===!1)throw new Error((i==null?void 0:i.detail)||(i==null?void 0:i.error)||`HTTP ${o}`);return i||{}}async _poll(t=!1){var e;if(!(!this._build||!this._hass)){if(this._loadModels(),this._polling){this._pollAgain=!0;return}this._polling=!0;try{let s=this._sel;this._tick=(this._tick||0)+1;let i=t||this._tick%5===1,[o,n]=await Promise.all([i?this._api("agent_status"):null,s?this._api("agent_transcript",{id:s,have:this._msgs==null?0:this._tbytes||0}):null]);if(o){if(this._settle("_sessions",this._trackDone(o.sessions||[])),this._settle("_projects",o.projects||[]),this._sel&&!this._sessions.some(r=>r.id===this._sel))this._sel=null,this._msgs=null,this._store("sel",null);else if(!this._sel&&!this._restored){this._restored=!0;let r=this._recall("sel",12*3600*1e3);r&&this._sessions.some(l=>l.id===r)&&this._select(r)}}let a=s&&s===this._sel?n:null;if(this._sel&&!a&&(a=await this._api("agent_transcript",{id:this._sel,have:this._msgs==null?0:this._tbytes||0})),this._sel&&a){let r=a;this._tbytes=r.bytes||0;let l=r.messages;l!=null&&!this._sameMsgs(l,this._msgs)&&(this._msgs=l),this._activity=r.activity||null,this._screen=r.screen||null,this._suggestion=r.suggestion||null,this._permission=r.permission||null;let c=r.ask?JSON.stringify(r.ask.options.map(d=>d.label)):null;if(c!==this._askSig&&(this._askSig=c,this._askSent=null),this._settle("_ask",r.ask||null),this._ask&&this._ask.multi&&(this._askSent=null),(e=this._queue)!=null&&e.length){let d=(this._msgs||[]).filter(g=>g.role==="user").map(g=>Qe(g.text)),p=g=>{let b=Qe(g.text);return b&&d.includes(b)},u=this._queue.length;this._queue=this._queue.filter(g=>g.state!=="sent"||!p(g)&&Date.now()-g.at<12e4),this._queue.length!==u&&this._saveQueue()}}this._err=""}catch(s){this._err=this._errText(s)}if(this._polling=!1,this._pollAgain)return this._pollAgain=!1,this._poll();this._drainQueue()}}_drainQueue(){var s;if(!this._sel||this._pending)return;let t=(this._queue||[]).filter(i=>i.id===this._sel);if(t.some(i=>i.state==="sent"))return;let e=t.find(i=>i.state==="held");e&&((s=(this._sessions||[]).find(i=>i.id===this._sel))!=null&&s.busy||this._dispatch(e))}_select(t){var e;if(this._sel&&this._sel!==t&&this._saveDraft(),this._sel=t,this._restored=!0,t&&((e=this._unread)!=null&&e.delete(t))){this._store("unread",[...this._unread]);let s=(this._sessions||[]).find(i=>i.id===t);s&&(s.done=!1)}this._store("sel",t||null),this._msgs=null,this._ask=null,this._askSent=null,this._askSig=void 0,this._activity=null,this._screen=null,this._suggestion=null,this._permission=null,this._model=null,this._startPolling(),this._confirmKill=null,this._details=!1,this._swipe=null,this._stick=!0,this._poll(!0),t&&this._api("agent_target_window",{id:t}).catch(()=>{})}_store(t,e){try{let s=`jrc:${t}`;e==null?localStorage.removeItem(s):localStorage.setItem(s,JSON.stringify({v:e,at:Date.now()}))}catch(s){}}_gripDown(t){let e=this.renderRoot.querySelector(".side");if(!e)return;t.preventDefault();let s=t.currentTarget,i=t.clientX,o=e.getBoundingClientRect().width,n=this.renderRoot.querySelector(".panel").clientWidth*.6,a=l=>{this._sideW=Math.round(Math.min(n,Math.max(140,o+l.clientX-i)))},r=()=>{s.removeEventListener("pointermove",a),s.removeEventListener("pointerup",r),s.removeEventListener("pointercancel",r),this._store("sidew",this._sideW)};s.setPointerCapture(t.pointerId),s.addEventListener("pointermove",a),s.addEventListener("pointerup",r),s.addEventListener("pointercancel",r)}_recall(t,e){try{let s=localStorage.getItem(`jrc:${t}`);if(!s)return null;let{v:i,at:o}=JSON.parse(s);return!o||Date.now()-o>e?(localStorage.removeItem(`jrc:${t}`),null):i}catch(s){return null}}_body(t){var o;let e=`${t.role}\0${t.text}`,s=(o=this._bodyCache)==null?void 0:o.get(e);if(s)return s;let i=this._bodyParse(t);return this._bodyCache||(this._bodyCache=new Map),this._bodyCache.size>400&&this._bodyCache.delete(this._bodyCache.keys().next().value),this._bodyCache.set(e,i),i}_bodyParse(t){if(Hi.has(t.role))return t.text.split(`
`).map(i=>m`<div class="${qi(i)}">${i||" "}</div>`);if(t.role!=="assistant")return t.text;let e=[],s=0;for(let i of t.text.matchAll(Fi))i.index>s&&e.push(this._linkPaths(t.text.slice(s,i.index))),e.push(i[1]?m`<code>${this._linkPaths(i[1])}</code>`:m`<b>${i[2]}</b>`),s=i.index+i[0].length;return e.push(this._linkPaths(t.text.slice(s))),e}_linkPaths(t){return Ge(t).map(e=>typeof e=="string"?e:m`<a
            class="flink"
            href="#"
            data-ai="open-file"
            @click=${s=>{s.preventDefault(),this._openFile(e.path,e.line)}}
          >${e.path}${e.line}</a>`)}async _openFile(t,e){var i;let s=e?parseInt(e.slice(1),10):0;this._zoom=1,this._view={path:t,line:s,loading:!0};try{let o=await this._api("agent_file",{id:this._sel||"",path:t});this._view=J(L({},o),{path:o.path||t,line:s})}catch(o){this._view={path:t,line:s,error:this._errText(o)};return}await this.updateComplete,(i=this.renderRoot.querySelector(".vline.hit"))==null||i.scrollIntoView({block:"center"})}async _openScreen(){let t=this._screenRun={},e=()=>{var s;return this._screenRun===t&&((s=this._view)==null?void 0:s.screen)&&this.isConnected};for(this._zoom=1,this._view={path:"Mac screen",screen:!0,loading:!0};e();){let s;try{s=J(L({},await this._api("agent_screen",{})),{path:"Mac screen",screen:!0})}catch(i){s={path:"Mac screen",screen:!0,error:this._errText(i)}}if(!e())break;this._view=s,await new Promise(i=>setTimeout(i,1500))}}_zoomTap(t){let e=t.currentTarget,s=e.parentElement,i=e.getBoundingClientRect(),o=(t.clientX-i.left)/i.width,n=(t.clientY-i.top)/i.height;this._zoom=(this._zoom||1)>1?1:2.5,this.updateComplete.then(()=>{s.scrollLeft=o*e.offsetWidth-s.clientWidth/2,s.scrollTop=n*e.offsetHeight-s.clientHeight/2})}_pinch(t){if(t.touches.length!==2){this._pinchFrom=null;return}t.preventDefault();let[e,s]=t.touches,i=Math.hypot(e.clientX-s.clientX,e.clientY-s.clientY);this._pinchFrom||(this._pinchFrom={d:i,z:this._zoom||1}),this._zoom=Math.min(8,Math.max(1,this._pinchFrom.z*i/this._pinchFrom.d))}_renderViewer(){let t=this._view,e=t.path.replace(/\/$/,"").split("/").pop()||t.path;return m`
      <div class="phead">
        <span class="ptitle" title=${t.path}>${e}${t.line?`:${t.line}`:""}</span>
        <button class="hbtn" data-ai="close-file" @click=${()=>this._view=null}>✕</button>
      </div>
      <div class="vpath">${t.path}</div>
      <div class="vbody">
        ${t.loading?m`<div class="dim pad">Loading…</div>`:t.error?m`<div class="dim pad">${t.error}</div>`:t.image?m`<img
                  class="vimg"
                  src=${t.image}
                  alt=${e}
                  style=${(this._zoom||1)>1?`width:${this._zoom*100}%;max-width:none`:""}
                  @click=${this._zoomTap}
                  @touchstart=${{handleEvent:s=>this._pinch(s),passive:!1}}
                  @touchmove=${{handleEvent:s=>this._pinch(s),passive:!1}}
                  @touchend=${()=>this._pinchFrom=null}
                />`:t.dir?t.dir.map(s=>m`<a
                      class="flink vent"
                      href="#"
                      @click=${i=>{i.preventDefault(),this._openFile(`${t.path}/${s}`,"")}}
                    >${s}</a>`):m`<pre class="vtext">${(t.text||"").split(`
`).map((s,i)=>m`<div class="vline ${i+1===t.line?"hit":""}"><span class="vno">${i+1}</span>${s||" "}</div>`)}</pre>`}
        ${t.truncated?m`<div class="dim pad">Showing the first 512 KB.</div>`:$}
      </div>
    `}_sameMsgs(t,e){if(!t||!e||t.length!==e.length)return!1;let s=t[t.length-1],i=e[e.length-1];return(s==null?void 0:s.role)===(i==null?void 0:i.role)&&(s==null?void 0:s.text)===(i==null?void 0:i.text)}_toBottom(){let t=0,e=()=>{var i,o;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((o=s.lastElementChild)==null||o.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll()),++t<6&&requestAnimationFrame(e)};requestAnimationFrame(e),clearTimeout(this._bottomT),this._bottomT=setTimeout(()=>{var i,o;let s=(i=this.renderRoot)==null?void 0:i.querySelector(".log");s&&((o=s.lastElementChild)==null||o.scrollIntoView({block:"end"}),s.scrollTop=s.scrollHeight,this._unscroll())},250)}_composerEl(){var t;return(t=this.renderRoot)==null?void 0:t.querySelector(".composer textarea")}_growCap(){var e;let t=this._vvH||((e=window.visualViewport)==null?void 0:e.height)||window.innerHeight;return Math.max(56,Math.min(190,Math.round(t*.32)))}_autoGrow(t){if(!t)return;let e=t.style.height,s=t.scrollTop;t.style.height="auto";let i=Math.min(t.scrollHeight,this._growCap())+"px";return t.style.height=i,t.scrollTop!==s&&(t.scrollTop=s),i!==e}_draftSoon(){clearTimeout(this._draftT),this._draftT=setTimeout(()=>this._saveDraft(),400)}_saveDraft(t=this._sel){var s;if(clearTimeout(this._draftT),!t)return;let e=this._composerEl();e&&this._store(`draft:${t}`,e.value||null),this._store(`files:${t}`,(s=this._files)!=null&&s.length?this._files:null)}_restoreDraft(){if(!this._sel)return;this._files=this._recall(`files:${this._sel}`,12*3600*1e3)||[];let t=this._composerEl();if(!t||t.value)return;let e=this._recall(`draft:${this._sel}`,12*3600*1e3);e&&(t.value=e,this._autoGrow(t))}_saveQueue(){let t=(this._queue||[]).filter(e=>e.state==="held");this._store("queue",t.length?t:null)}_restoreQueue(){let t=this._recall("queue",216e5);Array.isArray(t)&&t.length&&(this._queue=t.map(e=>J(L({},e),{state:"held"})))}async _send(t){var a;t.preventDefault();let e=this._composerEl(),s=e==null?void 0:e.value.trim(),i=this._files||[];if(!s&&!i.length||this._sel==null)return;let o=[...i.map(r=>r.path),s].filter(Boolean).join(" ");e.value="",e.style.height="",this._files=[],this._saveDraft();let n={id:this._sel,text:o,at:Date.now(),state:"held"};this._queue=[...this._queue||[],n],this._saveQueue(),this._stick=!0,(a=(this._sessions||[]).find(r=>r.id===this._sel))!=null&&a.busy||this._dispatch(n)}async _dispatch(t){if(!this._pending){this._pending=!0,t.state="sent",t.at=Date.now(),this._queue=[...this._queue],this._saveQueue();try{await this._api("agent_prompt_direct",{id:t.id,text:t.text,device:this._deviceId()}),t.delivered=!0,this._queue=[...this._queue],this._err=""}catch(e){this._err=this._errText(e),t.state="held",this._queue=[...this._queue],this._saveQueue()}this._pending=!1,this._poll(!0)}}_editQueued(t){let e=this._composerEl();e&&(e.value=e.value.trim()?`${e.value.trim()} ${t.text}`:t.text,this._dropQueued(t),e.focus(),this._autoGrow(e),this._saveDraft())}_dropQueued(t){this._queue=(this._queue||[]).filter(e=>e!==t),this._saveQueue()}async _attach(t){let e=[...t.target.files||[]];return t.target.value="",this._ingest(e)}async _ingest(t){if(!(!t.length||!this._sel)){this._uploading=!0;for(let e of t)try{let{name:s,data:i}=await this._encodeFile(e),o=await this._api("agent_upload",{name:s,data:i});if(!(o!=null&&o.path))throw new Error((o==null?void 0:o.detail)||"upload refused");this._files=[...this._files||[],{name:e.name,path:o.path}],this._err=""}catch(s){this._err=`${e.name}: ${this._errText(s)}`}this._uploading=!1,this._saveDraft()}}_encodeFile(t){let e=i=>new Promise((o,n)=>{let a=new FileReader;a.onerror=()=>n(new Error("could not read that file")),a.onload=()=>o(String(a.result).split(",")[1]||""),a.readAsDataURL(i)});if(!t.type.startsWith("image/"))return e(t).then(i=>({name:t.name,data:i}));let s=1568;return new Promise((i,o)=>{let n=new Image,a=URL.createObjectURL(t);n.onerror=()=>{URL.revokeObjectURL(a),e(t).then(r=>i({name:t.name,data:r}),o)},n.onload=()=>{URL.revokeObjectURL(a);let r=Math.min(1,s/Math.max(n.width,n.height));if(r===1&&t.size<9e5)return e(t).then(c=>i({name:t.name,data:c}),o);let l=document.createElement("canvas");l.width=Math.round(n.width*r),l.height=Math.round(n.height*r),l.getContext("2d").drawImage(n,0,0,l.width,l.height),l.toBlob(c=>{if(!c)return o(new Error("could not encode that image"));let d=t.name.replace(/\.[^.]+$/,"")+".jpg";e(c).then(p=>i({name:d,data:p}),o)},"image/jpeg",.85)},n.src=a})}_dropFile(t){this._files=(this._files||[]).filter(e=>e!==t),this._saveDraft()}_renderAsk(t){let e=!!t.multi,s=!e&&!!this._askSent;return m`<div class="askbox ${s?"answered":""}">
      ${t.header||t.total>1||e?m`<div class="askhead">
            ${t.header?m`<span class="askchip">${t.header}</span>`:$}
            ${t.total>1?m`<span class="askstep">Question ${t.index} of ${t.total}</span>`:$}
            ${e?m`<span class="askmulti">Pick any</span>`:$}
          </div>`:$}
      ${t.text?m`<div class="asktext">${t.text}</div>`:$}
      <div class="askopts">
        ${t.options.map(i=>m`<button
            class="askopt ${this._askSent===i.key?"picked":""} ${i.on?"on":""}"
            data-ai="pick-option"
            ?disabled=${s}
            @click=${()=>this._sendKey(i.key,{keepOpen:e})}
          >
            <span class="asknum">${e?i.on?"\u2611":"\u2610":i.key}</span>
            <span class="asklabel"
              >${i.label}
              ${i.desc?m`<span class="askdesc">${i.desc}</span>`:$}</span
            >
            ${!e&&this._askSent===i.key?m`<span class="asktick">✓</span>`:$}
          </button>`)}
      </div>
      <div class="askrow">
        ${s?m`<span class="dim">sending…</span>`:$}
        ${e?m`<button class="asksubmit" data-ai="submit-answer"
                   @click=${()=>this._sendKey("Enter")}>Submit</button>`:$}
        <button class="askmini" @click=${()=>this._sendKey("Escape")}>esc</button>
      </div>
    </div>`}async _sendKey(t,{keepOpen:e=!1}={}){if(this._sel){e||(this._askSent=t);try{await this._api("agent_key",{id:this._sel,key:t}),this._err=""}catch(s){this._err=this._errText(s),this._askSent=null;return}this._poll()}}async _setModel(t){if(!this._sel||this._modelBusy||!t)return;let e=this._model;this._model=t,this._modelBusy=t;try{await this._api("agent_model",{id:this._sel,model:t}),this._err=""}catch(s){this._model=e,this._err=this._errText(s)}this._modelBusy=null,this._poll()}async _setPermission(t){if(!(!this._sel||this._modelBusy||!t)){this._modelBusy="perm";try{let e=await this._api("agent_permission",{id:this._sel,mode:t}),s=e&&(e.mode||e.detail);s&&(this._permission=s),this._err=""}catch(e){this._err=this._errText(e)}this._modelBusy=null,this._poll()}}_renderRunControls(){let t=this._models||[],e=(this._sessions||[]).find(n=>n.id===this._sel),s=this._permission||"",i=(e==null?void 0:e.modes)||this._modes||["auto","manual","accept edits","plan"],o=this._model||this._latestAlias(t,e==null?void 0:e.model)||"";return m`<div class="runbar">
      <select
        class="runsel ${this._modelBusy&&this._modelBusy!=="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy||!t.length}
        data-ai="pick-model"
        title="Model for this session"
        .value=${qe(o)}
        @change=${n=>this._setModel(n.target.value)}
      >
        <option value="" disabled>${t.length?"Model":"\u2026"}</option>
        ${t.map(n=>m`<option value=${n.id}>${n.id==="local"?"Local":n.name}</option>`)}
      </select>
      <select
        class="runsel perm mode-${(s||"unknown").replace(/\s+/g,"-")} ${this._modelBusy==="perm"?"busy":""}"
        ?disabled=${!!this._modelBusy}
        data-ai="pick-permission"
        title="Permission mode"
        .value=${qe(s)}
        @change=${n=>this._setPermission(n.target.value)}
      >
        <option value="" disabled>mode ?</option>
        ${i.map(n=>m`<option value=${n}>${n}</option>`)}
      </select>
      ${e!=null&&e.busy?m`<button
            type="button"
            class="hbtn stop"
            data-ai="interrupt-turn"
            title="Stop - interrupt this turn (sends Escape)"
            aria-label="Stop"
            @click=${()=>this._sendKey("Escape",{keepOpen:!0})}
          ><i></i></button>`:$}
    </div>`}_latestAlias(t,e){var o;let s=(o=/^claude-([a-z]+)-/.exec(e||""))==null?void 0:o[1];if(!s||!t.some(n=>n.id===s))return e;let i=t.find(n=>n.id.startsWith(`claude-${s}-`));return(i==null?void 0:i.id)===e?s:e}async _loadModels(){if(!(this._models||this._modelsLoading)){this._modelsLoading=!0;try{let t=await this._api("agent_models");this._models=t.models||[],this._modes=t.modes||null}catch(t){}this._modelsLoading=!1}}async _killSession(t){if(t){if(this._confirmKill!==t){this._confirmKill=t,clearTimeout(this._confirmT),this._confirmT=setTimeout(()=>this._confirmKill=null,4e3);return}clearTimeout(this._confirmT),this._confirmKill=null;try{await this._api("agent_kill",{id:t}),this._swipe=null,this._store(`draft:${t}`,null),this._queue=(this._queue||[]).filter(e=>e.id!==t),this._saveQueue(),this._sel===t&&(this._sel=null,this._msgs=null,this._store("sel",null)),this._poll(!0)}catch(e){this._err=this._errText(e)}}}_rowTap(t){if(this._swipe===t){this._swipe=null,this._confirmKill=null;return}if(this._swipe){this._swipe=null,this._confirmKill=null;return}this._swiped||this._select(t)}_swipeStart(t,e){var i;let s=(i=t.touches)==null?void 0:i[0];s&&(this._sx=s.clientX,this._sy=s.clientY,this._swiped=!1)}_swipeMove(t,e){var n;let s=(n=t.touches)==null?void 0:n[0];if(!s||this._sx==null)return;let i=s.clientX-this._sx,o=s.clientY-this._sy;Math.abs(o)>Math.abs(i)||(i<-12?(this._swiped=!0,this._swipe!==e&&(this._swipe=e)):i>12&&this._swipe===e&&(this._swiped=!0,this._swipe=null,this._confirmKill=null))}_swipeEnd(){this._sx=this._sy=null,setTimeout(()=>this._swiped=!1,50)}async _newSession(t){this._picking=!1,this._pending=!0;try{let e=await this._api("agent_start_session",{project:t});this._err="",await this._awaitSession(e==null?void 0:e.id)}catch(e){this._err=this._errText(e)}this._pending=!1}async _awaitSession(t){for(let e=0;e<20;e++){await this._poll(!0);let s=(this._sessions||[]).find(i=>t?i.id===t:i.target);if(s)return this._select(s.id),!0;await new Promise(i=>setTimeout(i,600))}return!1}_syncUrl(){var s,i;if((s=this._config)!=null&&s.build_dashboard||(i=this._config)!=null&&i.build_page)return;let t=location.pathname.replace(/\/session\/[^/]+$/,""),e=this._build&&this._sel?`${t}/session/${encodeURIComponent(this._sel)}`:t;e!==location.pathname&&history.replaceState(history.state,"",e+location.search)}_openLinked(){let t=location.pathname.match(/\/session\/([^/]+)$/);t&&(this._restored=!0,this._build||this._setBuild(!0,!1),this._awaitSession(decodeURIComponent(t[1])))}_openAssist(){var e,s,i;let t=(s=(e=this._hass)==null?void 0:e.auth)==null?void 0:s.external;if((i=t==null?void 0:t.config)!=null&&i.hasAssist){t.fireMessage({type:"assist/show"});return}ss(this,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>customElements.whenDefined("ha-voice-command-dialog"),dialogParams:{pipeline_id:"last_used",start_listening:!0}})}_wakePuck(){var e;let t;try{t=(e=this._hass)==null?void 0:e.callService("assist_satellite","start_conversation",{entity_id:this._config.entity,start_message:this._config.tap_message,preannounce:!1},void 0,!1)}catch(s){return this._openAssist()}Promise.resolve(t).catch(()=>this._openAssist())}async _openMic(){try{let e=(await navigator.mediaDevices.enumerateDevices()).find(s=>s.kind==="audioinput"&&s.label&&!/iphone|ipad|continuity/i.test(s.label));if(e)return await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:e.deviceId}}})}catch(t){}return navigator.mediaDevices.getUserMedia({audio:!0})}async _startLocalVoice(t="converse"){if(this._voice||this._micOpening)return!0;this._micOpening=!0,t==="converse"?this._voiceState="listening":this._dictating=!0;let e;try{e=await this._openMic()}catch(p){return this._voiceState=null,this._dictating=!1,"microphone permission denied"}finally{this._micOpening=!1}let s=e.getAudioTracks()[0];s&&(s.onended=()=>{var p;((p=this._voice)==null?void 0:p.stream)===e&&(this._toast("The microphone disconnected."),this._stopLocalVoice())});let i=window.AudioContext||window.webkitAudioContext,o=new i,n=null;t==="converse"&&(n=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="),n.play().catch(()=>{}));let a=this._voice={mode:t,stream:e,ctx:o,audio:n,proc:null,src:null,handlerId:null,unsub:null},r=this._recall("conv",5*60*1e3);try{a.unsub=await this._hass.connection.subscribeMessage(p=>this._voiceEvent(p),L({type:"assist_pipeline/run",start_stage:"stt",end_stage:t==="dictate"?"stt":"tts",input:{sample_rate:16e3}},r?{conversation_id:r}:{}))}catch(p){return this._stopLocalVoice(),"assist pipeline refused the run"}let l=a.src=o.createMediaStreamSource(e),c=a.proc=o.createScriptProcessor(2048,1,1),d=Ws(o.sampleRate,16e3);return c.onaudioprocess=p=>{if(a.handlerId==null)return;let u=d(p.inputBuffer.getChannelData(0)),g=new Uint8Array(1+u.length*2);g[0]=a.handlerId;let b=new DataView(g.buffer,1);for(let _=0;_<u.length;_++)b.setInt16(_*2,u[_],!0);try{this._hass.connection.socket.send(g)}catch(_){}},l.connect(c),c.connect(o.destination),!0}_voiceEvent(t){var s,i,o,n,a,r,l,c,d,p;let e=this._voice;if(e)switch(t.type){case"run-start":e.handlerId=(o=(i=(s=t.data)==null?void 0:s.runner_data)==null?void 0:i.stt_binary_handler_id)!=null?o:null;break;case"intent-end":{let u=(a=(n=t.data)==null?void 0:n.intent_output)==null?void 0:a.conversation_id;u&&this._store("conv",u);break}case"stt-end":if(e.mode==="dictate"){let u=((l=(r=t.data)==null?void 0:r.stt_output)==null?void 0:l.text)||"",g=(c=this.renderRoot)==null?void 0:c.querySelector(".composer textarea");g&&u&&(g.value=(g.value?g.value.trim()+" ":"")+u,g.focus()),u||this._toast("Didn't catch that."),this._stopLocalVoice()}else this._closeMic(),this._voiceState="processing";break;case"tts-end":{let u=(p=(d=t.data)==null?void 0:d.tts_output)==null?void 0:p.url;if(!u)return this._stopLocalVoice();this._voiceState="responding",e.audio.onended=()=>this._stopLocalVoice(),e.audio.onerror=()=>this._stopLocalVoice(),this._trackSpeech(e.audio,u),e.audio.src=u,e.audio.play().catch(()=>this._stopLocalVoice());break}case"error":e.mode==="dictate"&&this._toast("Didn't catch that."),this._stopLocalVoice();break;case"run-end":this._voiceState!=="responding"&&this._stopLocalVoice();break}}_closeMic(){var e,s,i,o;let t=this._voice;t&&((e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),(i=t.stream)==null||i.getTracks().forEach(n=>n.stop()),(o=t.ctx)==null||o.close().catch(()=>{}),t.proc=t.src=null)}_stopLocalVoice(){var e,s;let t=this._voice;if(t){this._closeMic(),this._dictating=!1;try{(e=t.audio)==null||e.pause()}catch(i){}try{(s=t.unsub)==null||s.call(t)}catch(i){}this._voice=null,this._voiceState=null,this._envEl=null,this._env=null,this._envUrl=null}}_toast(t){ss(this,"hass-notification",{message:t})}get _canMic(){var t;return!!(window.isSecureContext&&((t=navigator.mediaDevices)!=null&&t.getUserMedia))}async _composerMic(){var e;if(this._voice)return this._voice.mode==="dictate"?this._endSpeech():this._stopLocalVoice();if(!window.isSecureContext||!((e=navigator.mediaDevices)!=null&&e.getUserMedia)){this._toast("Voice input needs the https (Nabu Casa) URL.");return}let t=await this._startLocalVoice("dictate");t!==!0&&this._toast(`Couldn't start voice input (${t}).`)}_endSpeech(){var e,s;let t=this._voice;if(!t||t.handlerId==null)return this._stopLocalVoice();(e=t.proc)==null||e.disconnect(),(s=t.src)==null||s.disconnect(),t.mode==="converse"&&(this._voiceState="processing");try{this._hass.connection.socket.send(new Uint8Array([t.handlerId]))}catch(i){this._stopLocalVoice()}}async _ringTap(){var i,o,n,a,r;if(this._voice)return this._voiceState==="listening"?this._endSpeech():this._stopLocalVoice();if(this._effectiveState()==="responding"){let l=this._resolveMediaPlayer(this._hass);if(l){this._hass.callService("media_player","media_stop",{entity_id:l});return}}let t=(a=(n=(o=(i=this._hass)==null?void 0:i.auth)==null?void 0:o.external)==null?void 0:n.config)==null?void 0:a.hasAssist,e=l=>{if(t)return this._toast(`${l} - listening through the app instead.`),this._openAssist();this._toast(`${l} - waking ${this._name} instead.`),this._wakePuck()};if(!window.isSecureContext)return e("No microphone on a plain-http page");if(!((r=navigator.mediaDevices)!=null&&r.getUserMedia))return e("This browser exposes no microphone");let s=await this._startLocalVoice();s!==!0&&e(`Couldn't use this device's mic (${s})`)}firstUpdated(){this._setupCanvas()}updated(t){this._setupCanvas(),(t.has("_sel")||t.has("_build"))&&this._syncUrl(),t.has("_sel")&&this._sel&&this._restoreDraft(),t.has("_msgs")&&this._stick&&this._toBottom()}_setupCanvas(){var e,s,i;let t=(e=this.renderRoot)==null?void 0:e.querySelector("canvas");if(!t){this._stop(),this._canvas=null;return}if(t!==this._canvas){this._canvas=t;try{this._ctx=t.getContext("2d")}catch(o){this._ctx=null}if(!this._ctx)return;this._t=0,this._waveT=0,this._churnT=0,this._peaks=Xi.map(o=>L({},o)),this._spin=0,this._head=0,this._speech={t:0,next:0,env:0,count:0,syl:null,pulses:[],spikes:[]},this._cur=L({},oi.idle),this._rgb=hi((i=(s=this._config)==null?void 0:s.idle_color)!=null?i:"#3db4c8"),this._observe()}this._ctx&&(this._measure(),this._pump())}_observe(){var t,e;typeof ResizeObserver!="undefined"&&((t=this._ro)==null||t.disconnect(),this._ro=new ResizeObserver(()=>this._measure()),this._ro.observe(this._canvas)),typeof IntersectionObserver!="undefined"?((e=this._io)==null||e.disconnect(),this._io=new IntersectionObserver(s=>{this._onScreen=s.some(i=>i.isIntersecting),this._pump()}),this._io.observe(this._canvas)):this._onScreen=!0}_measure(){var a,r,l;let t=this._canvas;if(!t||!this._ctx)return;let e=t.clientWidth||Number((a=this._config)==null?void 0:a.size)||240,s=t.clientHeight||e;((l=(r=this._perf)==null?void 0:r.q)!=null?l:1)<.75&&(this._lowDpr=!0);let i=this._lowDpr?1:2,o=U(window.devicePixelRatio||1,1,i);if(this._w===e&&this._h===s&&this._dpr===o&&this._particles)return;let n=!this._particles||this._w!==e;this._w=e,this._h=s,this._dpr=o,t.width=Math.round(e*o),t.height=Math.round(s*o),this._ctx.setTransform(o,0,0,o,0,0),n&&this._buildField()}_buildField(){var a,r;if(((a=this._config)==null?void 0:a.animation)==="jarvis-im3")return this._buildSheetField();let t=Number((r=this._config)==null?void 0:r.particles)||0,e=U(Math.round((this._w||240)*32),9e3,2e4),s=t>0?U(t,0,8e3):e,i=Math.max(400,s),o=Jt(24301),n=new Array(i);for(let l=0;l<i;l++){let c=l*.6180339887%1,d=0;for(let g=ye[0].share;d<ye.length-1&&c>=g;)g+=ye[++d].share;let p=(o()+o()-1)*(o()<.04?4:1),u=(o()+o()-1)*1.05;n[l]={ri:d,lon:o()*Math.PI*2,sinLat:Math.sin(u),cosLat:Math.cos(u),off:p,drift:(o()-.5)*.13,tw:.5+o()*2,ph:o()*Math.PI*2,bobA:.1+o()*.25,bobW:.25+o()*.85,bobP:o()*Math.PI*2,wobA:.006+o()*.02,wobW:.4+o()*1.2,wobP:o()*Math.PI*2,lf:5+o()*7,lt:o()*12,sz:o()<.03?2.1+o()*1.1:.8+o()*.85,halo:o()<.05,br:o()<.04?1:.45+o()*.55}}this._particles=n}_buildSheetField(){var o;let t=Number((o=this._config)==null?void 0:o.particles)||0,e=U(Math.round((this._w||240)*32),6e3,14e3),s=Math.max(400,t>0?U(t,0,26e3):e),i=Jt(6718);this._particles=Array.from({length:s},(n,a)=>{let r=a*.6180339887%1<ts[0].share?0:1,l=Math.sqrt(-2*Math.log(Math.max(1e-6,i())))*Math.cos(i()*Math.PI*2);return{si:r,th:i()*Math.PI*2,v:i()<.18?(i()<.5?-1:1)*(.7+i()*.25):U(l*.43,-.95,.95),dr:(.008+i()*.024)*ts[r].dir,tw:.3+i()*.7,ph:i()*Math.PI*2,life:3.5+i()*5,sz:.36+i()*.45,br:.3+i()*.6}})}_sheetPoint(t,e,s,i,o){Ks(e,s*Math.PI/2,t.time,t.voice,t.index,o);let n=o[0],a=o[1];return o[0]=n*Math.cos(i)-a*Math.sin(i),o[1]=n*Math.sin(i)+a*Math.cos(i),o}_sheetTables(t,e,s){var r;let i=(((r=this._speech)==null?void 0:r.env)||0)*e.speech,o=Math.max(s,Math.min(1,i*1.35)),n=this._crumple||0,a=o>n?.012:.045;this._crumple=n+(o-n)*(1-Math.exp(-t/a)),this._flowT=(this._flowT||0)+t*(.35+this._crumple*.65),this._sheetState||(this._sheetState=ts.map((l,c)=>({index:c})));for(let l of this._sheetState)l.time=this._flowT,l.voice=this._crumple;return this._sheetState}_audioSync(t){if(this._envEl)return;if(!t||t.state!=="playing"){(this._remotePlaying||!["processing","responding"].includes(this._state))&&(this._env=null,this._envUrl=null,this._decodePending=!1),this._remotePlaying=!1;return}this._remotePlaying=!0;let e=t.attributes||{},s=String(e.media_content_id||""),i=/^https?:\/\//.test(s)||s.startsWith("/")?s:null,o=Date.parse(e.media_position_updated_at||t.last_changed||"");this._envAt=Number.isFinite(o)?o:Date.now(),this._envPos=Number(e.media_position)||0,!(!i||i===this._envUrl)&&(this._envUrl=i,this._env=null,i&&!(Number(e.media_duration)>60)&&this._decodeAudio(i))}async _pipelineId(t){var l,c,d,p,u;if(this._pipeId!==void 0)return this._pipeId;this._pipeId=null;let e=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline/list"}),s=await t.connection.sendMessagePromise({type:"assist_pipeline/device/list"}),i=(c=(l=t.entities)==null?void 0:l[this._config.entity])==null?void 0:c.device_id,o=(d=s==null?void 0:s.find(g=>g.device_id===i))==null?void 0:d.pipeline_entity,n=o?(u=(p=t.states)==null?void 0:p[o])==null?void 0:u.state:null,a=(e==null?void 0:e.pipelines)||[],r=a.find(g=>g.name===n)||a.find(g=>g.id===(e==null?void 0:e.preferred_pipeline));return this._pipeId=(r==null?void 0:r.id)||null,this._pipeId}async _grabTtsUrl(){var e,s,i,o;let t=this._hass;if(!(!(t!=null&&t.connection)||this._grabbing||this._envEl)){this._grabbing=!0;try{let n=await this._pipelineId(t);if(!n)return;for(let a=0;a<3;a++){let r=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/list",pipeline_id:n}),l=((r==null?void 0:r.pipeline_runs)||[]).reduce((c,d)=>!c||d.timestamp>c.timestamp?d:c,null);if(l&&Date.now()-Date.parse(l.timestamp)<6e4){let c=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/get",pipeline_id:n,pipeline_run_id:l.pipeline_run_id}),d=(c==null?void 0:c.events)||[];for(let p=d.length-1;p>=0;p--){let u=((e=d[p])==null?void 0:e.type)==="tts-end"&&((o=(i=(s=d[p])==null?void 0:s.data)==null?void 0:i.tts_output)==null?void 0:o.url);if(u){if(this._envEl)return;this._envUrl=u,this._env=null,await this._decodeAudio(u);return}}}await new Promise(c=>setTimeout(c,250))}}catch(n){this._pipeId=void 0}finally{this._grabbing=!1}}}async _decodeAudio(t,e){let s=this._decodeRequest=(this._decodeRequest||0)+1,i=()=>s===this._decodeRequest&&t===this._envUrl;this._decodePending=!0;try{if(!e){let r=await fetch(t);if(!r.ok)throw new Error("audio fetch");e=await r.arrayBuffer()}let o=window.AudioContext||window.webkitAudioContext;if(!o)return;let a=await(this._actx||(this._actx=new o)).decodeAudioData(e);i()&&(this._env=Vs(a.getChannelData(0),a.sampleRate,pi))}catch(o){i()&&(this._env=null)}finally{i()&&(this._decodePending=!1)}}_trackSpeech(t,e,s){this._envEl=t,this._envUrl=e,this._env=null,this._voiceState="responding",this._decodeAudio(e,s)}_releaseSpeech(t){this._envEl===t&&(this._envEl=null,this._envUrl=null,this._env=null,this._decodePending=!1,this._decodeRequest=(this._decodeRequest||0)+1,this._voice||(this._voiceState=null))}_audioLevel(){let t=this._env,e=this._envEl;if(e)return!e.currentTime||e.paused||e.ended||e.readyState<3?0:t?ii(t,e.currentTime):this._decodePending?0:null;if(this._mp!=="playing")return null;if(!t)return this._decodePending?0:null;let s=this._envPos+(Date.now()-this._envAt)/1e3+(Number(this._config.audio_offset)||0);return ii(t,s)}_sylShapes(t,e){let s=this._speech;s.pulses.push({born:s.t,amp:t}),s.pulses.length>6&&s.pulses.shift();let i=Math.random()*6.283185;s.spikes.push({a:i,sg:.1+Math.random()*.08,h:.06+t*.06,born:s.t,dur:.12+Math.random()*.08},{a:i+(Math.random()-.5)*.6,sg:.22+Math.random()*.18,h:.04+t*.05,born:s.t+.04,dur:e*(.9+Math.random()*.4)}),s.spikes.length>14&&s.spikes.splice(0,s.spikes.length-14)}_speechTick(t){var a;let e=this._speech;e.t+=t;let s=this._audioLevel();if(s!=null){s>.16&&s-(e.last||0)>.055&&e.t-((a=e.onsetAt)!=null?a:-1)>.09&&(e.count++,e.onsetAt=e.t,e.syl={start:e.t,dur:.22,peak:s,f:5+s*4},this._sylShapes(s,.22)),e.last=s,e.live=!0;let r=this._config.animation==="jarvis-im3"?s>e.env?.012:.05:s>e.env?.05:.14;e.env+=(s-e.env)*(1-Math.exp(-t/r)),e.env>1&&(e.env=1);return}if(e.live=!1,this._config.animation==="jarvis-im3"){e.env*=Math.exp(-t/.06),e.last=0;return}if(e.t>=e.next){let r=.22+Math.random()*.26,l=.5+Math.random()*.5;e.syl={start:e.t,dur:r,peak:l,f:5+Math.random()*4},e.count++;let c=.02+Math.random()*.05;e.count%(5+Math.floor(Math.random()*6))===0&&(c+=.14+Math.random()*.26),e.next=e.t+r+c,this._sylShapes(l,r)}let i=0,o=e.syl;if(o){let r=(e.t-o.start)/o.dur;r>=0&&r<=1&&(i=o.peak*1.2*(.5-.5*Math.cos(2*Math.PI*r)))}let n=i>e.env?.22:.5;e.env+=(i-e.env)*(1-Math.exp(-t/n)),e.env>1&&(e.env=1)}_pulseTable(t){let e=this._ptab||(this._ptab=new Float32Array(Lt));if(e.fill(0),t<.01)return e;let s=this._speech;for(let i of s.pulses){let o=s.t-i.born;if(o>2.4)continue;let n=.58+o*.26,a=i.amp*Math.exp(-o/1)*t;for(let r=0;r<Lt;r++){let l=ni+r/(Lt-1)*ai-n;e[r]+=a*Math.exp(-(l*l)/.0055)}}return e}_peakTable(t,e,s){let i=this._ktab||(this._ktab=new Float32Array(Ot));i.fill(0);let o=this._t,n=.05*e.amp+.08*s;for(let r of this._peaks){r.a+=t*r.w*(.6+e.swirl);let l=.35+.65*(.5+.5*Math.sin(o*r.f+r.ph)),c=r.h*l*n;if(c<.002)continue;let d=r.sg*(1-.4*s),p=2*d*d;for(let u=0;u<Ot;u++){let g=u/Ot*6.283185-r.a;g=(g%6.283185+6.283185)%6.283185,g>3.141593&&(g-=6.283185),i[u]+=c*Math.exp(-(g*g)/p)}}let a=this._speech;for(let r=a.spikes.length-1;r>=0;r--){let l=a.spikes[r],c=a.t-l.born;if(c>l.dur+.3){a.spikes.splice(r,1);continue}if(c<0)continue;let d=c<.12?c/.12:1,p=c>l.dur?Math.exp(-(c-l.dur)/.3):1,u=l.h*d*p*e.speech;if(u<.003)continue;let g=2*l.sg*l.sg;for(let b=0;b<Ot;b++){let _=b/Ot*6.283185-l.a;_=(_%6.283185+6.283185)%6.283185,_>3.141593&&(_-=6.283185),i[b]+=u*Math.exp(-(_*_)/g)}}return i}_sprite(t,e,s){let i=t<<16|e<<8|s;if(this._sprKey===i)return this._spr;let o=this._spr||(this._spr=document.createElement("canvas"));o.width=o.height=32;let n=o.getContext("2d");n.clearRect(0,0,32,32);let a=n.createRadialGradient(16,16,0,16,16,16);return a.addColorStop(0,`rgba(${t},${e},${s},0.75)`),a.addColorStop(.4,`rgba(${t},${e},${s},0.3)`),a.addColorStop(1,`rgba(${t},${e},${s},0)`),n.fillStyle=a,n.fillRect(0,0,32,32),this._sprKey=i,o}_segTick(t){var o;if(this._segRot===void 0&&(this._segRot=-Math.PI/2),this._segRot+=t*.019,this._segWave=(this._segWave||0)+t*.5,this._sessions==null)return this._ambientTick(t);let e=this._segMap||(this._segMap=new Map),s=1-Math.exp(-t/.7),i=new Set;for(let n of this._sessions){i.add(n.id);let a=e.get(n.id);a||(a={size:.02,fill:Math.random(),pulse:Math.random()*6.28,rgb:[46,157,245],gone:!1},e.set(n.id,a));let r=n.context_max?U(n.context/n.context_max,0,1):null;a.weight=r!=null?.6+r*3:Math.max(.8,Math.log10((n.bytes||0)+1e4)-3.2),a.fracT=r!=null?r:1,a.frac===void 0&&(a.frac=0),a.busy=!!n.busy,a.done=!!n.done,a.gone=!1}for(let[n,a]of e){if(i.has(n)||(a.gone=!0),a.size+=((a.gone?0:a.weight)-a.size)*s,a.frac+=((a.gone?0:(o=a.fracT)!=null?o:1)-a.frac)*s,a.gone&&a.size<.03){e.delete(n);continue}a.pulse+=t*(a.busy?2.4:.9),a.busy&&(a.fill=(a.fill+t*.3)%1);let r=a.done?[40,226,138]:[46,157,245];for(let l=0;l<3;l++)a.rgb[l]+=(r[l]-a.rgb[l])*s}}_segBand(t){let e=Math.abs(-Math.sin(t)-Math.sin(this._segWave||0));return e>1?0:.5+.5*Math.cos(e*Math.PI)}_wash(t,e,s,i,o,n,a,r){let l=Math.max(2,Math.min(12,Math.ceil((a-n)/.1))),c=(a-n)/l;for(let d=0;d<l;d++){let p=n+d*c,u=Math.min(a,p+c);t.globalAlpha=r*(.5+1.15*this._segBand(p+c/2)),t.beginPath(),t.arc(e,s,o,p,u),t.arc(e,s,i,u,p,!0),t.closePath(),t.fill()}}_drawSegs(t,e,s,i,o,n,a){var b;if(this._sessions==null)return this._drawAmbientSegs(t,e,s,i,o,n,a);let r=6.283185,l=i*.475,c=i*.655,d=(_,v,w,x)=>{t.beginPath(),t.arc(e,s,x,_,v),t.arc(e,s,w,v,_,!0),t.closePath()},p=this._segMap,u=0;if(p)for(let _ of p.values())u+=_.size;if(!p||!p.size||u<=0){t.fillStyle=`rgb(${o},${n},${a})`,t.globalAlpha=.05,d(0,r,l,c),t.fill(),t.globalAlpha=1;return}let g=this._segRot;for(let _ of p.values()){let v=_.size/u*r,w=Math.min(.035,v),x=g+w/2,y=g+v-w/2;g+=v;let M=y-x;if(M<.004)continue;t.fillStyle=`rgb(${Math.round(_.rgb[0])},${Math.round(_.rgb[1])},${Math.round(_.rgb[2])})`,t.globalAlpha=.035,d(x,y,l,c),t.fill();let k=l+(c-l)*(.18+.82*U((b=_.frac)!=null?b:1,0,1));if(this._wash(t,e,s,l,k,x,y,(_.busy?.22:.1)+(_.done?.07:0)),_.busy){let S=Math.max(.1,M*.35),A=x+_.fill*M,O=14;for(let j=0;j<O;j++){let R=A-j*S/O,T=Math.max(x,R-S/O);if(R<=x)break;t.globalAlpha=.3*Math.pow(1-j/O,1.6),d(T,R,l,k),t.fill()}}}t.globalAlpha=1}_ambientTick(t){let e=this._segs;if(!e){e=this._segs=[],this._segRot=-Math.PI/2;for(let o=0;o<22;o++){let n=Math.random()<.75;e.push({size:.5+Math.random()*1.4,fill:n?1:Math.random()*.7,rate:.12+Math.random()*.3,state:n?"done":"load",doneT:Math.random()*9})}}let s=0,i=0;for(let o of e)o.state==="grow"?s++:o.state==="die"&&i++;if(!s&&e.length<26&&Math.random()<t*.5&&e.splice(Math.floor(Math.random()*(e.length+1)),0,{size:.02,target:.5+Math.random()*1.4,fill:0,rate:.12+Math.random()*.3,state:"grow",doneT:0}),i<2&&e.length>16){let o=null;for(let n of e)n.state==="done"&&n.doneT>8&&(!o||n.doneT>o.doneT)&&(o=n);o&&Math.random()<t*.25&&(o.state="die")}for(let o=e.length-1;o>=0;o--){let n=e[o];n.state==="grow"?(n.size+=t*.5,n.size>=n.target&&(n.size=n.target,n.state="load")):n.state==="load"?(n.fill+=t*n.rate,n.fill>=1&&(n.fill=1,n.state="done",n.doneT=0)):n.state==="done"?n.doneT+=t:(n.size-=t*.12,n.fill=Math.max(0,n.fill-t*.25),n.size<=.02&&e.splice(o,1))}}_drawAmbientSegs(t,e,s,i,o,n,a){let r=this._segs;if(!r||!r.length)return;let l=0;for(let w of r)l+=w.size;if(l<=0)return;let c=i*.475,d=i*.655,p=o*.5+74|0,u=n*.72+48|0,g=a*.8+82|0;t.fillStyle=`rgb(${p},${u},${g})`;let b=(w,x,y,M)=>{t.beginPath(),t.arc(e,s,M,w,x),t.arc(e,s,y,x,w,!0),t.closePath()},_=6.283185,v=this._segRot;for(let w=0;w<r.length;w++){let x=r[w],y=x.size/l*_,M=Math.min(.028,y),k=v+M/2,S=v+y-M/2;v+=y;let A=S-k;if(!(A<.004)&&(this._wash(t,e,s,c,d,k,S,.13),x.fill>.01)){let O=x.state==="done"?.14+.2*Math.exp(-x.doneT/2.2):.34;this._wash(t,e,s,c,d,k,k+A*x.fill,O*.8)}}t.globalAlpha=1}_pump(){this._ctx&&this.isConnected&&this._onScreen!==!1&&!document.hidden?this._start():this._stop()}_start(){if(this._raf)return;this._last=performance.now();let t=e=>{this._raf=requestAnimationFrame(t);let s=e-this._last,i=Math.min(.05,s/1e3);this._last=e,this._perfTick(s),this._draw(i)};this._raf=requestAnimationFrame(t)}_perfTick(t){if(t<=0||t>250)return;let e=this._perf||(this._perf={q:1,acc:0,n:0,hold:40});if(e.hold>0){e.hold--;return}if(e.acc+=t,++e.n<45)return;let s=e.acc/e.n;e.acc=0,e.n=0,s>26&&e.q>.2?this._setQuality(Math.max(.2,e.q*.65)):s<14&&e.q<1&&this._setQuality(Math.min(1,e.q*1.2))}_setQuality(t){let e=this._perf;t!==e.q&&(e.q=t,e.hold=40,this._measure())}_stop(){this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_targets(){let t=this._effectiveState();return{energy:oi[t],rgb:hi(this._stateColor(t))}}_stateColor(t){return t==="offline"?this._config.offline_color:this._booting?this._config.idle_color:this._config[Ni[t]]}_nearestAnchor(t,e,s){let i=s,o=s?Math.hypot(t.x-s.x,t.y-s.y)-s.r*.35:1/0;for(let n of e){let a=Math.hypot(t.x-n.x,t.y-n.y);a<o&&(o=a,i=n)}return i}_bubbleField(t){let e=t*.42;return{core:e,R:e,newR:()=>t*(.03+Math.pow(Math.random(),1.6)*.028),minAnchor:t*.058,maxR:t*.13}}_spawnBubble(t,e,s,i,o){let n=i!=null?i:Math.random()*Math.PI*2,a=o!=null?o:t.newR(),r=t.core+a;return{x:e+Math.cos(n)*r,y:s+Math.sin(n)*r,vx:0,vy:0,r:0,full:a,anchor:a>=t.minAnchor,host:null,held:!0,pop:-1,life:0,roll:Math.random()<.5?-1:1,wob:Math.random()*Math.PI*2,age:0,span:45+Math.random()*70}}_drawBubbles(t){var rt,V,W,ut,Zt,te,Ct;let e=this._ctx,s=this._w,i=this._h;if(!s||!i)return;let o=s/2,n=i/2,a=Math.min(s,i)/2,{energy:r,rgb:l}=this._targets(),c=1-Math.exp(-t/.55),d=1-Math.exp(-t/.16),p=this._cur;for(let f of Object.keys(r)){let P=f==="speech"&&r[f]<p[f]?d:c;p[f]+=(r[f]-p[f])*P}for(let f=0;f<3;f++)this._rgb[f]+=(l[f]-this._rgb[f])*c;let u=Math.round(this._rgb[0]),g=Math.round(this._rgb[1]),b=Math.round(this._rgb[2]);r.speech>.5&&this._speech.env<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),p.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*c;let _=this._speech,v=.5+.5*Math.sin(_.t*.5+.8*Math.sin(_.t*.21)),w=_.live?.88:.62,x=(w*_.env+(1-w)*v)*p.speech;this._t+=t;let y=p.swirl/1.8,M=Number(this._config.particle_size)||1,k=this._bubbleField(a),S=Math.max(6,Math.round(18*M));if(this._bub&&this._bubHalf&&this._bubHalf!==a){let f=a/this._bubHalf;for(let P of this._bub)P.x=o+(P.x-o)*f,P.y=n+(P.y-n)*f,P.r*=f,P.full*=f,P.vx*=f,P.vy*=f,P.popR&&(P.popR*=f);this._bubHalf=a}if(!this._bub){this._bubHalf=a,this._bub=[];for(let f=0;f<S;f++){let P=Math.min(k.newR()*(1+Math.random()*2.2),k.maxR),E=this._spawnBubble(k,o,n,f/S*Math.PI*2,P);E.r=E.full,E.anchor=E.r>=k.minAnchor,E.age=Math.random()*E.span,this._bub.push(E)}for(let f=0;f<100;f++)Ye(this._bub,2),Xe(this._bub,o,n,k.core),Je(this._bub,o,n,k.core),Ze(this._bub,o,n,k.core,2);for(let f of this._bub)f.vx=0,f.vy=0;this._release=0}let A=this._bub;for(let f of A)f.held&&f.pop<0&&(f.anchor=f.r>=k.minAnchor);let O=A.filter(f=>f.anchor&&f.held&&f.pop<0),j=k.core*(1+x*.07+Math.sin(this._t*.22)*.005);for(this._release+=x*t*3.2;this._release>=1;){this._release-=1;let f=A.filter(z=>z.held&&!z.anchor&&z.pop<0&&z.r>z.full*.6),P=f.length>2?f:A.filter(z=>z.held&&z.pop<0&&z.r>z.full*.6);if(P.length<3)break;let E=P[Math.floor(Math.random()*P.length)];E.host=null,E.held=!1,E.life=0;let X=Math.hypot(E.x-o,E.y-n)||1,q=(E.x-o)/X,B=(E.y-n)/X,D=a*(.5+Math.random()*.5);E.vx=q*D-B*a*.12,E.vy=B*D+q*a*.12}let R=a*(.045+y*.11);for(let f of A){f.wob+=t*1.3;let P=(rt=f.dx)!=null?rt:f.x,E=(V=f.dy)!=null?V:f.y;if(f.pop>=0){f.pop+=t;continue}if(f.held){if(f.r+=(f.full-f.r)*(1-Math.exp(-t/2)),f.anchor){let D=Math.hypot(f.x-o,f.y-n)||1,z=(f.x-o)/D,H=(f.y-n)/D,et=(j+f.r-D)*5;f.vx+=(z*et-H*R)*t,f.vy+=(H*et+z*R)*t}else{!f.host||!f.host.held||f.host.pop>=0?f.host=this._nearestAnchor(f,O,null):f.host=this._nearestAnchor(f,O,f.host);let D=f.host;if(D){let z=f.x-D.x,H=f.y-D.y,K=Math.hypot(z,H);K<.001&&(z=.1,H=0,K=.1);let et=z/K,Pt=H/K,ot=(D.r+f.r-K)*6,nt=a*.055*f.roll;f.vx+=(et*ot-Pt*nt)*t,f.vy+=(Pt*ot+et*nt)*t}else{let z=Math.hypot(f.x-o,f.y-n)||1,H=j+f.r;f.vx+=(f.x-o)/z*(H-z)*5*t,f.vy+=(f.y-n)/z*(H-z)*5*t}}let B=Math.exp(-t*(f.anchor?5.5:6.5));f.vx*=B,f.vy*=B}else f.life+=t,f.vy-=a*.85*t,f.vx*=Math.exp(-t*.9),f.r*=Math.exp(-t*.16),(f.life>1+Math.random()*.4||f.x<-a||f.x>s+a||f.y<-a)&&(f.pop=0,f.popR=f.r);let X=a*(f.held?.22:1.4),q=Math.hypot(f.vx,f.vy);q>X&&(f.vx=f.vx/q*X,f.vy=f.vy/q*X),f.x+=f.vx*t,f.y+=f.vy*t}Ye(A,2),Xe(A,o,n,j),Je(A,o,n,j),Ze(A,o,n,j,2);let T=1-Math.exp(-t/.11);for(let f of A)f.dx===void 0?(f.dx=f.x,f.dy=f.y,f.dr=f.r):(f.dx+=(f.x-f.dx)*T,f.dy+=(f.y-f.dy)*T,f.dr+=(f.r-f.dr)*T);ei(A,{dt:t,rate:.2+y*.15,sizeBias:3,maxRatio:2.1,maxR:k.maxR});for(let f of A)!f.held||f.pop>=0||(f.age+=t*(1+y*.5),si(f,{dt:t,maxR:k.maxR})&&(f.held=!1,f.pop=0,f.popR=f.r));for(let f=A.length-1;f>=0;f--)A[f].pop>ri&&A.splice(f,1);let I=0;for(;I++<1;){let f=A.filter(D=>D.held&&D.pop<0),P=f.filter(D=>Math.hypot(D.x-o,D.y-n)<=j+D.r*1.7),{angle:E,gap:X}=ti(P,o,n),q=Math.sin(Math.min(X,Math.PI)/2)*j;if(P.length>1&&q<k.newR()*1.4)break;let B=q>k.minAnchor*1.5;if(f.length>=S&&!B||f.length>=S*1.7)break;A.push(this._spawnBubble(k,o,n,E))}e.clearRect(0,0,s,i),e.globalCompositeOperation="lighter";let F=e.createRadialGradient(o-j*.3,n-j*.35,j*.08,o,n,j),Y=.34+x*.22;F.addColorStop(0,`rgba(${Math.min(255,u+80)},${Math.min(255,g+80)},${Math.min(255,b+65)},${Y})`),F.addColorStop(.6,`rgba(${u},${g},${b},${Y*.55})`),F.addColorStop(1,`rgba(${u},${g},${b},0)`),e.fillStyle=F,e.beginPath(),e.arc(o,n,j,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${u},${g},${b},${.3+x*.28})`,e.lineWidth=Math.max(.8,j*.018),e.beginPath(),e.arc(o,n,j*.985,0,Math.PI*2),e.stroke(),e.fillStyle=`rgba(255,255,255,${.13+x*.12})`,e.beginPath(),e.arc(o-j*.36,n-j*.4,j*.14,0,Math.PI*2),e.fill();let tt=A.slice().sort((f,P)=>P.r-f.r);for(let f of tt){let P=(W=f.dx)!=null?W:f.x,E=(ut=f.dy)!=null?ut:f.y;if(f.pop>=0){let K=Math.min(1,f.pop/ri),et=f.popR||f.r,Pt=1-Math.pow(1-K,2),ee=Math.pow(1-K,1.7);if(K<.55){let ot=et*(1-K*.12),nt=e.createRadialGradient(P-ot*.3,E-ot*.35,ot*.1,P,E,ot),se=.34*Math.pow(1-K/.55,1.4);nt.addColorStop(0,`rgba(${Math.min(255,u+95)},${Math.min(255,g+95)},${Math.min(255,b+75)},${se})`),nt.addColorStop(1,`rgba(${u},${g},${b},0)`),e.fillStyle=nt,e.beginPath(),e.arc(P,E,ot,0,Math.PI*2),e.fill()}e.strokeStyle=`rgba(${u},${g},${b},${ee*.3})`,e.lineWidth=Math.max(.4,et*.035*(1-K*.6)),e.beginPath(),e.arc(P,E,et*(1+Pt*.22),0,Math.PI*2),e.stroke();continue}let X=(Zt=f.dx)!=null?Zt:f.x,q=(te=f.dy)!=null?te:f.y,B=((Ct=f.dr)!=null?Ct:f.r)*(1+Math.sin(f.wob)*.015);if(B<.6)continue;let D=f.held?1:Math.max(0,1-f.life/2.1),z=(.5+x*.28)*D,H=e.createRadialGradient(X-B*.3,q-B*.35,B*.1,X,q,B);H.addColorStop(0,`rgba(${Math.min(255,u+95)},${Math.min(255,g+95)},${Math.min(255,b+75)},${z})`),H.addColorStop(.55,`rgba(${u},${g},${b},${z*.7})`),H.addColorStop(1,`rgba(${u},${g},${b},0)`),e.fillStyle=H,e.beginPath(),e.arc(X,q,B,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${u},${g},${b},${(.26+x*.16)*D})`,e.lineWidth=Math.max(.5,B*.045),e.beginPath(),e.arc(X,q,B*.97,0,Math.PI*2),e.stroke(),B>3&&(e.fillStyle=`rgba(255,255,255,${(.26+x*.2)*D})`,e.beginPath(),e.arc(X-B*.34,q-B*.38,B*.17,0,Math.PI*2),e.fill())}e.globalCompositeOperation="source-over"}_draw(t){var se,ns,as,rs;let e=this._ctx;if(!e)return;let s=this._config.animation==="jarvis-im3";if(!s&&this._config.animation!=="jarvis-v1")return this._drawBubbles(t);if(!this._particles)return;let i=this._w,o=this._h,n=i/2,a=o/2,r=Math.min(i,o)/2,{energy:l,rgb:c}=this._targets(),d=1-Math.exp(-t/.55),p=1-Math.exp(-t/.16),u=this._cur;for(let N of Object.keys(l)){let C=N==="speech"&&s?1-Math.exp(-t/(l[N]>u[N]?.025:.055)):N==="speech"&&l[N]<u[N]?p:d;u[N]+=(l[N]-u[N])*C}for(let N=0;N<3;N++)this._rgb[N]+=(c[N]-this._rgb[N])*d;let g=Math.round(this._rgb[0]),b=Math.round(this._rgb[1]),_=Math.round(this._rgb[2]);this._t+=t,this._waveT+=t*(.5+u.swirl*.9),this._spin+=t*(.09+u.swirl*.05),this._head+=t*(1.1+u.swirl*1.4),l.speech>.5&&this._cur.speech<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),u.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*d;let v=this._speech,w=.5+.5*Math.sin(v.t*.5+.8*Math.sin(v.t*.21)),x=v.live?.88:.62,y=(s?v.env:x*v.env+(1-x)*w)*u.speech,M=this._speech.syl?this._speech.syl.f:11;this._churnT+=t*(.55+u.swirl*.85+y*.7),this._waveT+=t*y*.8;let k=this._churnT,S=this._pulseTable(u.speech),A=this._peakTable(t,u,y),O=.003+y*.065,j=this._waveT;if(e.clearRect(0,0,i,o),s)return this._drawIm3(t,e,n,a,r,u,y,g,b,_);let R=this._bootScale(t);R!==1&&(e.save(),e.translate(n,a),e.scale(R,R),e.translate(-n,-a));let T=this._t,I=this._waveT,F=this._spin*.6,Y=.955,tt=.296,rt=.72+.28*Math.sin(T*.21+1.3)*Math.sin(T*.093+4.1),V=.012*Math.sin(T*.16+.7),W=r*.38*1.16,ut=r*.38*.7,Zt=W*W,te=W-ut,Ct=.92,f=.075;e.fillStyle=`rgb(${g},${b},${_})`;let P=this._sprite(g,b,_),E=this._particles,X=Math.min(E.length,Math.max(400,Math.round(E.length*((ns=(se=this._perf)==null?void 0:se.q)!=null?ns:1))));(!this._mx||this._mx.length<E.length)&&(this._mx=new Float32Array(E.length),this._my=new Float32Array(E.length),this._mr=new Float32Array(E.length),this._mb=new Uint8Array(E.length));let q=this._mx,B=this._my,D=this._mr,z=this._mb,H=0,K=(rs=(as=this._perf)==null?void 0:as.q)!=null?rs:1,et=1+(1-K)*.6,Pt=K>=.5,ee=(Number(this._config.particle_size)||1)*U(r/220,.75,1.8)*(1+(1-K)*.35);for(let N=0;N<X;N++){let C=E[N],G=ye[C.ri],lt=C.lon+F*G.rev+C.drift*k+C.wobA*(1+y*1)*(Math.sin(k*C.wobW+C.wobP)+.6*Math.sin(k*C.wobW*2.3+C.wobP*2.1)),fi=Math.cos(lt),gi=Math.sin(lt),Me=C.cosLat*fi,ht=C.sinLat,ie=C.cosLat*gi,_i=.45*Math.sin(5*lt-I*1.4+ht*2.3)+.3*Math.sin(8*lt+I*1.05-ht*3.1)+.3*Math.sin((Me*.9+ht*.32+ie*.28)*3.1+I*.9)+.2*Math.sin(13*lt-I*2.1+ht*1.8),mi=.45*Math.cos(5*lt-I*1.4+ht*2.3)+.3*Math.cos(8*lt+I*1.05-ht*3.1),ls=.5+.5*Math.sin(lt-k*(.5+C.ri*.13)+C.ri*2.1),ft=rt*(.45+1.3*ls*ls)*(u.turb+y*.6);ft>1.1&&(ft=1.1);let bi=Math.sin((Me*.7-ht*.6+ie*.4)*7.3+I*1.8),oe=_i*(.4+ft)+bi*.38*ft,hs=C.off+C.bobA*(.7+.6*ft)*(Math.sin(k*C.bobW+C.bobP)+.55*Math.sin(k*C.bobW*2.7+C.bobP*1.9)),Ae=1-Math.min(1,Math.abs(hs)),cs=u.amp*(1+y*.4),at=G.r+u.radius+V+y*.015+G.amp*cs*oe+hs*G.thick;oe>.75&&(at+=(oe-.75)*.04*ft);let Bt=Me,Ut=ht*Y-ie*tt,vi=ht*tt+ie*Y,ne=Math.sqrt(Bt*Bt+Ut*Ut)||1e-4,Nt=Math.atan2(Ut,Bt),Se=Nt*.15915494%1;Se<0&&(Se+=1);let Te=A[Se*Ot|0];at+=Te*(.35+.65*Ae),at+=O*(G.rev<0?.75:1)*(.5*Math.sin(2*Nt+j*.9)+.35*Math.sin(3*Nt-j*1.3+1.7)+.2*Math.sin(5*Nt+j*2.1+.4));let ae=(T+C.lt)%C.lf;ae/=C.lf,at+=(ae-.5)*.008;let je=6*ae*(1-ae);je>1&&(je=1);let wi=.24+.76*Ae*Ae,gt=C.br*G.glow*wi*je*(.55+.45*Math.abs(Math.sin(T*C.tw*.6+C.ph)))*u.bright;gt*=.68+.32*Math.sin(lt*2.7+k*.45+C.ph*3);let Ee=ne*ne;if(gt*=.09+1.6*Ee*Ee*Ee,gt*=.62+.5*Math.max(0,oe),gt*=.85+.3*ft,gt*=1+Te*(4+y*6),u.sweep>.01){let Q=(Nt-this._head)%6.283185;Q<0&&(Q+=6.283185),Q>3.141593&&(Q-=6.283185),gt*=1+Math.exp(-(Q*Q)/.25)*u.sweep*2.4}let re=0;if(u.speech>.01){let Q=(at-ni)/ai*(Lt-1);Q=Q<0?0:Q>Lt-1?Lt-1:Q|0,re=S[Q],at+=re*.07,gt*=1+re*1.1+y*.7}at>Ct&&(at=Ct+f*Math.tanh((at-Ct)/f));let ds=at*r,ps=vi*.5+.5,us=C.sz*ee*(.78+.32*ps)*(1+y*.25+re*.5+Te*(.8+y*2)),fs=r*G.amp*cs*mi*(.5+ft*.45),le=ds*Bt-Ut/ne*fs,he=ds*Ut+Bt/ne*fs,Ht=1,gs=le*le+he*he;if(gs<Zt){if(Ht=(Math.sqrt(gs)-ut)/te,Ht<.02)continue;Ht*=Ht}let _s=U(gt*et*(.45+.65*ps)*Ht,0,1);if(C.halo&&Pt){let Q=us*8;e.globalAlpha=_s*.22,e.drawImage(P,n+le-Q/2,a+he-Q/2,Q,Q)}let xi=us*.56;q[H]=n+le,B[H]=a+he,D[H]=xi,z[H++]=Math.min(bt-1,_s*bt|0)}for(let N=0;N<bt;N++){e.beginPath();let C=!1;for(let G=0;G<H;G++)z[G]===N&&(e.moveTo(q[G]+D[G],B[G]),e.arc(q[G],B[G],D[G],0,6.283185),C=!0);C&&(e.globalAlpha=(N+.5)/bt,e.fill())}e.globalAlpha=1,this._segTick(t),this._drawSegs(e,n,a,r,g,b,_);let ot=r*.38*(1+y*.05),nt=U(u.bright*(1+y*.45),.3,1.9);this._drawGlobe(e,n,a,ot,r,nt,`rgba(220,246,255,${.4*nt})`,`rgba(${g},${b},${_},${.13*nt})`),R!==1&&e.restore()}_drawGlobe(t,e,s,i,o,n,a,r){let l=this._t,c=Math.cos(this._spin),d=Math.sin(this._spin),p=Math.cos(.35),u=Math.sin(.35),g=os.verts,b=g.length;(!this._proj||this._proj.length!==b*3)&&(this._proj=new Float64Array(b*3));let _=this._proj;for(let w=0;w<b;w++){let x=g[w],y=x[0]*c+x[2]*d,M=-x[0]*d+x[2]*c,k=x[1]*p-M*u;_[w*3]=e+y*i,_[w*3+1]=s-k*i,_[w*3+2]=x[1]*u+M*p}t.save(),t.beginPath(),t.arc(e,s,i,0,Math.PI*2),t.clip();let v=os.edges;for(let w=0;w<2;w++){let x=w===1;t.beginPath();for(let y=0;y<v.length;y+=2){let M=v[y]*3,k=v[y+1]*3;_[M+2]+_[k+2]>0===x&&(t.moveTo(_[M],_[M+1]),t.lineTo(_[k],_[k+1]))}t.strokeStyle=x?a:r,t.lineWidth=Math.max(.35,o*(x?.0032:.0024)),t.stroke()}t.fillStyle="rgba(235,252,255,1)";for(let w of Ki){let x=w.v*3;if(_[x+2]<=.15)continue;let y=Math.pow(Math.abs(Math.sin(l*w.tw+w.ph)),6)*n;if(y<.04)continue;t.globalAlpha=U(y,0,1);let M=Math.max(1,o*.008);t.fillRect(_[x]-M/2,_[x+1]-M/2,M,M)}t.globalAlpha=1,t.restore()}_drawIm3(t,e,s,i,o,n,a,r,l,c){var g,b,_,v;let d=this._t,p=this._im3Boot(t),u=this._sheetTables(t,n,p.burst);if(p.ring>0){e.save(),e.globalAlpha=p.ring,p.scale!==1&&(e.translate(s,i),e.scale(p.scale,p.scale),e.translate(-s,-i)),this._membrane===void 0&&(this._membrane=Gs());let w=Math.min(720,Math.round(o*4*Math.max(.65,(b=(g=this._perf)==null?void 0:g.q)!=null?b:1)));(_=this._membrane)!=null&&_.draw(w,this._flowT,this._crumple,n.bright/1.6,[r/255,l/255,c/255])?(e.globalCompositeOperation="lighter",e.drawImage(this._membrane.canvas,s-o,i-o,o*2,o*2),e.globalCompositeOperation="source-over"):((v=this._membrane)==null||v.dispose(),this._membrane=null,this._drawSheetFilm(e,s,i,o,n,u,r,l,c),this._drawSheetDots(e,s,i,o,n,u,r,l,c)),e.globalAlpha=p.ring,this._drawIm3Rings(e,s,i,o,r,l,c,t);let x=o*.29*(1+a*.04),y=U(n.bright*(1+a*.35),.3,1.9)*p.globe,M=k=>Math.round(k+(255-k)*.35);this._drawGlobe(e,s,i,x,o,y*.5,`rgba(${M(r)},${M(l)},${M(c)},${.15*y})`,`rgba(${r},${l},${c},${.045*y})`),e.globalAlpha=p.ring*p.globe,e.strokeStyle=`rgba(${r},${l},${c},0.55)`,e.lineWidth=Math.max(.8,o*.006),e.beginPath(),e.arc(s,i,x*1.03,0,6.283185),e.stroke(),e.restore()}p.phase&&this._drawIm3Boot(e,s,i,o,p,r,l,c,d)}_drawSheetDots(t,e,s,i,o,n,a,r,l){var S,A,O,j;let c=this._particles;if(!c)return;let d=Math.min(c.length,Math.max(400,Math.round(c.length*((A=(S=this._perf)==null?void 0:S.q)!=null?A:1))));(!this._mx||this._mx.length<c.length)&&(this._mx=new Float32Array(c.length),this._my=new Float32Array(c.length),this._mr=new Float32Array(c.length),this._mb=new Uint8Array(c.length));let p=this._mx,u=this._my,g=this._mr,b=this._mb,_=this._t,v=(j=(O=this._perf)==null?void 0:O.q)!=null?j:1,w=(Number(this._config.particle_size)||1)*U(i/200,.7,1.8)*(1+(1-v)*.4),x=o.bright/1.6*(1+(1-v)*.7),y=0,M=this._sheetScratch||(this._sheetScratch=[0,0]);for(let R=0;R<d;R++){let T=c[R],I=n[T.si],F=T.th+_*T.dr+.018*Math.sin(_*.24+T.ph),Y=U(T.v+.12*Math.sin(F*5-_*T.tw+T.ph),-1,1);this._sheetPoint(I,F,Y,0,M),p[y]=e+M[0]*i,u[y]=s+M[1]*i,g[y]=Math.max(.22,T.sz*w*.68);let tt=Math.sin(Math.PI*((_/T.life+T.ph/(2*Math.PI))%1)),rt=.8+.2*Math.sin(F*7+_*.3+T.si),V=Math.pow(1-Math.abs(Math.sin(Y*Math.PI/2)),3),W=T.br*x*.7*(.2+.8*tt*tt)*rt*V;W<.025||(b[y++]=Math.min(bt-1,U(W,0,1)*bt|0))}let k=t.globalAlpha;t.globalCompositeOperation="lighter",t.fillStyle=`rgb(${a},${r},${l})`;for(let R=0;R<bt;R++){t.beginPath();let T=!1;for(let I=0;I<y;I++)b[I]===R&&(t.moveTo(p[I]+g[I],u[I]),t.arc(p[I],u[I],g[I],0,6.283185),T=!0);T&&(t.globalAlpha=k*((R+.5)/bt),t.fill())}t.globalCompositeOperation="source-over",t.globalAlpha=k}_drawSheetFilm(t,e,s,i,o,n,a,r,l){let c=t.globalAlpha,d=[0,0,0];t.globalCompositeOperation="lighter",t.strokeStyle=`rgb(${a},${r},${l})`;for(let p of n){let u=null;for(let g=0;g<54;g++){let b=(g/53-.5)*1.9,_=Math.pow(1-Math.abs(Math.sin(b*Math.PI/2)),2),v=[];for(let w=0;w<=180;w++){let x=w/180*Math.PI*2;this._sheetPoint(p,x,b,0,d),v.push([e+d[0]*i,s+d[1]*i])}if(u){t.beginPath(),t.moveTo(...v[0]);for(let w of v)t.lineTo(...w);for(let w=u.length-1;w>=0;w--)t.lineTo(...u[w]);t.closePath(),t.fillStyle=`rgb(${a},${r},${l})`,t.globalAlpha=c*o.bright/1.6*(.005+_*.065),t.fill()}u=v}}t.globalCompositeOperation="source-over",t.globalAlpha=c}_drawIm3Rings(t,e,s,i,o,n,a,r){var b;let l=t.globalAlpha,c=`rgb(${o},${n},${a})`;t.strokeStyle=c,t.lineWidth=Math.max(.5,i*.002);for(let[_,v]of[[.365,.07],[.56,.035]])t.globalAlpha=l*v,t.beginPath(),t.arc(e,s,i*_,0,Math.PI*2),t.stroke();this._segTick(r);let d=this._segMap;if(!d||!d.size){t.globalAlpha=l;return}let p=0;for(let _ of d.values())p+=_.size;if(p<=0){t.globalAlpha=l;return}let u=i*.465,g=this._segRot;t.lineCap="round";for(let _ of d.values()){let v=_.size/p*6.283185,w=Math.min(.16,v*.3),x=g+w/2,y=g+v-w/2;if(g+=v,y-x<.004)continue;let M=_.done?"rgb(70,220,154)":c;t.strokeStyle=M,t.lineWidth=Math.max(1,i*.006),t.globalAlpha=l*.11,t.beginPath(),t.arc(e,s,u,x,y),t.stroke();let k=U((b=_.frac)!=null?b:1,0,1);k<=0||(t.lineWidth=Math.max(1,i*.006),t.globalAlpha=l*(_.busy?.52:.3),t.beginPath(),t.arc(e,s,u,x,x+(y-x)*k),t.stroke())}t.lineCap="butt",t.strokeStyle=c,t.globalAlpha=l}_im3Boot(t){let e=this._boot,s=jt;if(!e)return{ring:1,scale:1,burst:0,globe:1,phase:null};let i=e.t+=t,o=l=>1-(1-l)**3,n=l=>{let c=U((i-l)/.28,0,1);return{ring:.3+.7*c,scale:.45+.55*o(c),burst:1.2*(1-o(U((i-l)/(s.settle-s.burst),0,1)))}},a=(l,c)=>U(Math.min(i-l,c-i)/.2,0,1),r=1-Math.max(.82*a(s.icons-.1,s.icons+5*s.iconStep),a(s.clock,s.clockEnd),a(s.imp,s.impEnd));if(i<s.fold){let l=i/s.fold;return{ring:1-l*.5,scale:1-.98*l*l,burst:0,globe:1,phase:null}}if(i<s.burst)return{ring:0,scale:1,burst:0,globe:1,phase:null};if(i<s.down){let l=n(s.burst),c=null,d=0;return i>=s.word&&i<s.wordEnd?c="word":i>=s.clock&&i<s.clockEnd?(c="clock",d=(i-s.clock)/(s.clockEnd-s.clock)):i>=s.imp&&i<s.impEnd&&(c="import",d=(i-s.imp)/(s.impEnd-s.imp)),J(L({},l),{globe:r,phase:c,u:d,t:i})}if(i<s.dot){let l=(i-s.down)/(s.dot-s.down);return{ring:1-l*.5,scale:1-.98*l*l,burst:0,globe:1,phase:null}}if(i<s.reactor)return{ring:0,scale:1,burst:0,globe:1,phase:"dot",t:i};if(i<s.back)return{ring:0,scale:1,burst:0,globe:1,phase:"reactor",u:(i-s.reactor)/(s.back-s.reactor),t:i};if(i<s.end){let l=n(s.back);return J(L({},l),{burst:l.burst*.6,globe:1,phase:i<s.back+.35?"reactorOut":null,t:i})}return this._boot=null,{ring:1,scale:1,burst:0,globe:1,phase:null}}_drawIm3Boot(t,e,s,i,o,n,a,r,l){let c=jt,d=u=>`rgba(${n},${a},${r},${u})`,p=u=>`rgba(${Math.round(n+(255-n)*.5)},${Math.round(a+(255-a)*.5)},${Math.round(r+(255-r)*.5)},${u})`;if(t.save(),o.phase==="dot"){let u=.55+.45*Math.abs(Math.sin((o.t-c.dot)*18));t.fillStyle=p(u),t.beginPath(),t.arc(e,s,Math.max(1.6,i*.012),0,6.283185),t.fill(),t.fillStyle=d(.5*u),t.fillRect(e-i*.07,s+i*.55,i*.14,Math.max(1,i*.006))}else o.phase==="reactor"?this._drawReactor(t,e,s,i,o.u,d,p):o.phase==="reactorOut"?(t.globalAlpha=1-(o.t-c.back)/.35,this._drawReactor(t,e,s,i,1,d,p)):o.phase==="word"?this._drawWordmark(t,e,s,i,o.t-c.word,n,a,r):o.phase==="clock"?this._drawIm3Clock(t,e,s,i,o.u,d,p):o.phase==="import"&&this._drawIm3Import(t,e,s,i,o.u,d,p);t.restore()}_drawIm3Clock(t,e,s,i,o,n,a){let r=U(Math.min(o/.08,(1-o)/.08),0,1);t.globalAlpha=r;let l=i*.5;t.strokeStyle="rgba(235,250,255,0.75)",t.lineWidth=Math.max(1,i*.007),t.beginPath(),t.arc(e,s,l,0,6.283185),t.stroke(),t.strokeStyle="rgba(235,250,255,0.4)",t.lineWidth=Math.max(1,i*.004);let c=-1.5708+o*9;t.beginPath(),t.arc(e,s,l*1.07,c,c+4.2),t.stroke(),t.strokeStyle=n(.45),t.beginPath(),t.moveTo(e-l*1.25,s),t.lineTo(e-l*.92,s),t.moveTo(e+l*.92,s),t.lineTo(e+l*1.25,s),t.stroke();let d=new Date,p=d.getHours(),u=p<12?"AM":"PM";p=p%12||12;let g=`${p}:${String(d.getMinutes()).padStart(2,"0")}`,b=`:${String(d.getSeconds()).padStart(2,"0")}`;if(o<.25){let v=w=>Math.floor(Math.random()*w);(!this._tumble||performance.now()-this._tumble.at>70)&&(this._tumble={at:performance.now(),hm:`${v(12)+1}:${v(6)}${v(10)}`,ss:`:${v(6)}${v(10)}`}),g=this._tumble.hm,b=this._tumble.ss}let _=i*.27;t.fillStyle="rgba(240,252,255,0.95)",t.textBaseline="middle",t.textAlign="right",t.font=`200 ${_}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillText(g,e+i*.2,s),t.textAlign="left",t.font=`500 ${_*.3}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillText(u,e+i*.23,s-_*.2),t.fillText(b,e+i*.23,s+_*.2),t.textAlign="start",t.globalAlpha=1}_drawIm3Import(t,e,s,i,o,n,a){let r=U(Math.min(o/.08,(1-o)/.08),0,1),c=1-(1-U(o/.85,0,1))**2;t.globalAlpha=r,t.lineWidth=Math.max(1.5,i*.012),t.strokeStyle=n(.15),t.beginPath(),t.arc(e,s,i*.5,0,6.283185),t.stroke(),t.strokeStyle=a(.9),t.beginPath(),t.arc(e,s,i*.5,-1.5708,-1.5708+c*6.283185),t.stroke(),t.fillStyle=a(.95),t.textAlign="center",t.textBaseline="middle",t.font=`200 ${i*.2}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillText(`${Math.round(c*100)}%`,e,s+i*.04),t.font=`600 ${i*.045}px "Avenir Next", "Helvetica Neue", Roboto, sans-serif`,t.fillStyle=n(.85),t.fillText(c<1?"IMPORTING PREFERENCES":"PREFERENCES LOADED",e,s-i*.16),t.textAlign="start",t.globalAlpha=1}_drawReactor(t,e,s,i,o,n,a){let l=1-(1-Math.min(1,o/.88))**2,c=i*.2,d=t.globalAlpha,p=40;t.lineWidth=Math.max(2,i*.05);for(let M=0;M<p;M++){let k=-1.5708+M/p*6.283185,S=M/p<l;t.strokeStyle=S?a(.95):n(.12),t.beginPath(),t.arc(e,s,c,k+.02,k+6.283185/p-.03),t.stroke()}t.lineWidth=Math.max(1,i*.006),t.strokeStyle=n(.7);for(let M of[.72,1.32])t.beginPath(),t.arc(e,s,c*M,0,6.283185),t.stroke();let u=t.createRadialGradient(e,s,0,e,s,c*.7);u.addColorStop(0,a(.25+.75*l)),u.addColorStop(1,n(0)),t.fillStyle=u,t.beginPath(),t.arc(e,s,c*.7,0,6.283185),t.fill(),t.strokeStyle=a(.5+.5*l),t.lineWidth=Math.max(1,i*.009),t.beginPath();for(let M=0;M<3;M++){let k=1.5708+M*6.283185/3,S=e+c*.42*Math.cos(k),A=s+c*.42*Math.sin(k);M?t.lineTo(S,A):t.moveTo(S,A)}t.closePath(),t.stroke();let g=i*1.25,b=i*.13,_=e-g/2,v=s+i*.5;t.globalAlpha=d,t.strokeStyle=n(.55),t.lineWidth=1,t.strokeRect(_,v,g,b),t.fillStyle=n(.1),t.fillRect(_,v,g*l,b);let w=Math.max(9,b*.52);t.font=`600 ${w}px "Avenir Next", "Segoe UI", Roboto, sans-serif`,t.textBaseline="middle",t.fillStyle=a(.95),t.textAlign="left",t.fillText("POWER LEVEL",_+b*.4,v+b/2),t.textAlign="right",t.fillText(`${(l*100).toFixed(1)}%`,_+g-b*.4,v+b/2);let x=_+b*.4+t.measureText("POWER LEVEL").width+w*.5,y=_+g-b*.4-t.measureText("100.0%").width-w*.5;t.fillStyle=n(.6);for(let M=x;M<y;M+=w*.45)t.fillRect(M,v+b*.62,1.2,1.2);t.textAlign="start"}_drawWordmark(t,e,s,i,o,n,a,r){let l=jt,c=(this._name||"JARVIS").toUpperCase();if(!this._wm||this._wm.half!==i||this._wm.name!==c){let S=Math.round(i*.3),A=document.createElement("canvas");A.width=Math.round(i*1.9),A.height=Math.round(S*1.5);let O=A.getContext("2d");O.fillStyle="#fff",O.font=`italic 900 ${S}px "Arial Black", "Helvetica Neue", Arial, sans-serif`,O.textAlign="center",O.textBaseline="middle",O.setTransform(1,0,-.18,1,S*.13,0);let j=O.measureText(c).width;j>A.width*.92&&(O.font=`italic 900 ${Math.round(S*A.width*.92/j)}px "Arial Black", "Helvetica Neue", Arial, sans-serif`),O.fillText(c,A.width/2,A.height/2);let R=O.getImageData(0,0,A.width,A.height).data,T=Math.max(2,Math.round(i/75)),I=[];for(let V=0;V<A.height;V+=T)for(let W=0;W<A.width;W+=T)R[(V*A.width+W)*4+3]>140&&I.push(W-A.width/2,V-A.height/2);let F=Jt(935),Y=I.length/2,tt=new Float32Array(Y*2),rt=new Float32Array(Y);for(let V=0;V<Y;V++){let W=Math.PI+(F()-.5)*1.4,ut=i*(.82+F()*.14);tt[V*2]=ut*Math.cos(W),tt[V*2+1]=ut*Math.sin(W),rt[V]=F()}this._wm={half:i,name:c,pts:Float32Array.from(I),from:tt,seed:rt,w:A.width}}let{pts:d,from:p,seed:u,w:g}=this._wm,b=u.length,_=l.wordHold-l.word,v=l.wordGone-l.word,w=l.wordEnd-l.word,x=Math.round(n+(255-n)*.45),y=Math.round(a+(255-a)*.45),M=Math.round(r+(255-r)*.45);t.globalCompositeOperation="lighter",t.fillStyle=`rgb(${x},${y},${M})`;let k=Math.max(1,i/130);for(let S=0;S<b;S++){let A=d[S*2],O=d[S*2+1],j=(A/g+.5)*_*.55+u[S]*.12,R=U((o-j)/(_*.42),0,1);R=1-(1-R)**3;let T=p[S*2]+(A-p[S*2])*R,I=p[S*2+1]+(O-p[S*2+1])*R,F=.15+.7*R;if(R>.98&&o<v&&Math.random()<.015&&(T+=(Math.random()-.5)*i*.08),o>v){let Y=U((o-v)/(w-v),0,1);T+=T/(Math.abs(T)+1)*Y*i*.25*(.4+u[S]),I+=(u[S]-.5)*Y*i*.2,F*=1-Y}F<.02||(t.globalAlpha=F,t.fillRect(e+T-k/2,s+I-k/2,k,k))}t.globalCompositeOperation="source-over",t.globalAlpha=1}_bootScale(t){let e=this._boot;if(!e)return 1;let s=e.t+=t;if(s<.6)return 1-.98*(s/.6)**2;if(s<1.1)return .02+.012*Math.abs(Math.sin((s-.6)*22));if(s<2.6){let i=(s-1.1)/1.5-1;return .02+.98*(1+2.70158*i*i*i+1.70158*i*i)}return this._boot=null,1}_stopIntroVisuals(){var t;this._introRun=null,clearTimeout(this._bootTimer);for(let e of this._introIconTimers||[])clearTimeout(e);this._introIconTimers=[];for(let e of this._introOverlays||[]){for(let s of((t=e.getAnimations)==null?void 0:t.call(e,{subtree:!0}))||[])s.cancel();e.remove()}this._introOverlays=new Set,this._boot=null,this._booting=!1,this._landed=null}_startIntroVisuals(){this._stopIntroVisuals(),this._boot={t:0},this._booting=!0;let t=this._introRun={},e=this._config.animation==="jarvis-im3";return e&&(this._landed=new Set,this._introIconTimers=Array.from({length:5},(s,i)=>setTimeout(()=>this._flyIcon(i,t),(jt.icons+i*jt.iconStep)*1e3))),this._bootTimer=setTimeout(()=>{this._introRun===t&&(this._booting=!1,this._landed=null)},e?jt.end*1e3:6500),t}_intro(){if(this._booting)return;let t=this._startIntroVisuals(),e=this._config.animation==="jarvis-im3",s=this._name,i=c=>{var d;return Promise.resolve((d=this._hass)==null?void 0:d.callService("assist_satellite","announce",{entity_id:this._config.entity,message:c,preannounce:!1}))};if(!e){let c=this._config.intro_message||`Allow me to introduce myself. I am ${s}, a virtual artificial intelligence, and I'm here to assist you with a variety of tasks as best I can, 24 hours a day, 7 days a week. Importing all preferences from home interface. Systems are now fully operational.`;setTimeout(()=>i(c).catch(()=>this._toast(`${s} could not speak the introduction.`)),900);return}let o=jt,n=this._config.intro_message?[[o.burst,this._config.intro_message]]:Gi.map(([c,d])=>[c,d.replace("{name}",s)]),a=this._speechAudio||(this._speechAudio=new Audio);a.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=",a.play().catch(()=>{});let r=this._hasSpeaker().then(c=>{if(!c)return this._toast("Speaking on the puck: this screen has no speaker."),null;let d=n.map(([,p])=>this._fetchSpeech(p));return d.forEach(p=>p.catch(()=>{})),d}),l=performance.now();(async()=>{let c=await r,d=0;for(let p=0;p<n.length;p++){let[u,g]=n[p],b=/^Systems are now/.test(g)?Yi:Qi,_=Math.max(u*1e3,d+b*1e3)-(performance.now()-l);if(_>0&&await new Promise(v=>setTimeout(v,_)),this._introRun!==t)return;if(c)try{await this._playHere(a,await c[p],t),d=performance.now()-l;continue}catch(v){c=null,this._toast(`Speaking on the puck: this screen could not play it (${(v==null?void 0:v.name)||(v==null?void 0:v.message)||"error"}).`)}try{await i(g),d=performance.now()-l}catch(v){this._toast(`${s} could not speak the introduction.`);return}}})()}async _hasSpeaker(){var e,s;let t=navigator.userAgent;if(!/Chrome/.test(t)||/Android|Mobile/.test(t))return!0;try{let i=await((s=(e=navigator.mediaDevices)==null?void 0:e.enumerateDevices)==null?void 0:s.call(e));return!i||i.some(o=>o.kind==="audiooutput")}catch(i){return!0}}async _fetchSpeech(t){let e=await this._ttsUrl(t);if(!e)throw new Error("no voice");let s=await(await fetch(e)).arrayBuffer();return URL.createObjectURL(new Blob([s],{type:"audio/mpeg"}))}async _playHere(t,e,s){this._trackSpeech(t,e);try{await new Promise((i,o)=>{t.onended=i,t.onerror=()=>o(new Error("playback")),t.src=e,t.play().catch(o)})}finally{URL.revokeObjectURL(e),this._releaseSpeech(t)}}_flyIcon(t,e){let s=()=>{this._introRun===e&&this._landed&&(this._landed=new Set([...this._landed,t]))};if(this._introRun!==e)return;let i=this.shadowRoot,o=i==null?void 0:i.querySelector(".wrap"),n=i==null?void 0:i.querySelector(".ring"),a=i==null?void 0:i.querySelectorAll(".dock button")[t],r=a==null?void 0:a.querySelector("svg");if(!o||!n||!r||!o.animate)return s();let l=o.getBoundingClientRect(),c=n.getBoundingClientRect(),d=r.getBoundingClientRect(),p=40,u=document.createElement("div");u.className="flyicon",u.setAttribute("aria-hidden","true"),u.innerHTML=`<svg class="fly-halo" viewBox="0 0 40 40" fill="none" stroke="currentColor">
      <circle cx="20" cy="20" r="18" stroke-width=".35" opacity=".5"/>
      <circle class="fly-orbit" cx="20" cy="20" r="16.5" stroke-width=".8" stroke-dasharray="24 9 12 7"/>
      <circle class="fly-orbit reverse" cx="20" cy="20" r="19.5" stroke-width=".3" stroke-dasharray="2 4"/>
      </svg><div class="fly-glyph">${r.outerHTML}</div><div class="fly-scan"></div>`;let g=c.left+c.width/2-l.left-p/2,b=c.top+c.height/2-l.top-p/2;u.style.left=`${g}px`,u.style.top=`${b}px`,o.appendChild(u),this._introOverlays||(this._introOverlays=new Set),this._introOverlays.add(u);let _=parseFloat(getComputedStyle(r).paddingLeft)||0,v=c.width*.38/p,w=(d.width-_*2)/(p*.58),x=d.left+d.width/2-l.left-p/2-g,y=d.top+d.height/2-l.top-p/2-b;for(let k of u.querySelectorAll(".fly-glyph path,.fly-glyph rect,.fly-glyph circle")){let S=k.getTotalLength();k.style.strokeDasharray=`${S}`,k.animate([{strokeDashoffset:S,opacity:0},{strokeDashoffset:0,opacity:1}],{duration:310,delay:35,easing:"ease-out",fill:"both"})}let M=u.animate([{transform:`perspective(500px) scale(${v*.65}) rotateY(-65deg)`,opacity:0,offset:0},{transform:`perspective(500px) scale(${v}) rotateY(0deg)`,opacity:1,offset:.22},{transform:`perspective(500px) scale(${v}) rotateY(0deg)`,opacity:1,offset:.43},{transform:`perspective(500px) translate(${x*.18}px,${y*.2}px) scale(${v*.8}) rotateY(62deg) rotateZ(-12deg)`,opacity:.85,offset:.64},{transform:`perspective(500px) translate(${x}px,${y}px) scale(${w}) rotateY(0deg) rotateZ(0deg)`,opacity:1,offset:1}],{duration:1050,easing:"cubic-bezier(.35,0,.2,1)",fill:"forwards"});u.querySelector(".fly-halo").animate([{opacity:0},{opacity:.85,offset:.2},{opacity:.8,offset:.58},{opacity:0}],{duration:1050,fill:"both"}),M.onfinish=()=>{u.remove(),this._introOverlays.delete(u),this._introRun===e&&(s(),a.animate([{filter:"brightness(2.5) drop-shadow(0 0 8px currentColor)",transform:"scale(1.12)"},{filter:"brightness(1)",transform:"scale(1)"}],{duration:420,easing:"ease-out"}))}}async _openSheet(t){var e,s,i;this._sheet={kind:t,items:null,q:""};try{let o=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t==="memories"?"memory_list":"skills",service_data:{},return_response:!0});if(((e=this._sheet)==null?void 0:e.kind)!==t)return;this._sheet=J(L({},this._sheet),{items:((s=o==null?void 0:o.response)==null?void 0:s[t])||[]})}catch(o){((i=this._sheet)==null?void 0:i.kind)===t&&(this._sheet=J(L({},this._sheet),{items:[],err:this._errText(o)}))}}_renderSheet(){let t=this._sheet,e=t.q.trim().toLowerCase(),s=o=>o.replace(/_/g," ").replace(/^\w/,n=>n.toUpperCase()),i=(t.items||[]).filter(o=>!e||`${o.text||""} ${o.name||""} ${o.description||""}`.toLowerCase().includes(e));return m`<div class="sheet ${t.kind}" @click=${o=>o.target===o.currentTarget&&(this._sheet=null)}>
      <div class="sheet-box">
        <div class="sheet-head">
          <span>${t.kind==="memories"?"Memories":t.kind==="todos"?"To-do lists":t.kind==="calendar"?"Calendar":t.kind==="review"?"Nightly review":`What ${this._name} can do`}</span>
          <button class="sheet-x" title="Close" @click=${()=>this._sheet=null}>×</button>
        </div>
        ${t.kind==="review"?m`<div class="sheet-list review-host">${this._reviewBox}</div>`:t.kind==="calendar"?m`<hubbubb-calendar .hass=${this._hass}></hubbubb-calendar>`:t.kind==="todos"?m`<div class="sheet-list">${this._renderTodos()}</div>`:m`        <input
          type="search"
          placeholder="Filter"
          .value=${t.q}
          @input=${o=>this._sheet=J(L({},this._sheet),{q:o.target.value})}
        />
        <div class="sheet-list">
          ${t.items==null?m`<div class="dim pad">Loading…</div>`:t.err?m`<div class="perr">${t.err}</div>`:i.length?i.map(o=>t.kind==="memories"?m`<div class="sheet-row">${o.text}${o.person?m`<em>${o.person}</em>`:$}</div>`:m`<div class="sheet-row"><b>${s(o.name)}</b>${o.description.split(". ")[0].replace(/\.?$/,".")}</div>`):m`<div class="dim pad">Nothing here.</div>`}
        </div>
        ${t.kind==="skills"?m`<div class="dim pad small">Plus everything Home Assistant exposes to ${this._name}: lights, media, climate, scenes and scripts.</div>`:$}
`}
      </div>
    </div>`}_todoIds(t){let e=this._config.todo_entities;if(Array.isArray(e)&&e.length)return e;let s=new Set(this._config.todo_exclude||[]);return Object.keys((t==null?void 0:t.states)||{}).filter(i=>{var o,n;return i.startsWith("todo.")&&!s.has(i)&&!((n=(o=t.entities)==null?void 0:o[i])!=null&&n.hidden)}).sort()}async _todoCreate(t){var i;t.preventDefault();let e=t.target.querySelector("input"),s=e.value.trim();if(s){e.disabled=!0;try{let o=await this._hass.callApi("POST","config/config_entries/flow",{handler:"local_todo"}),n=await this._hass.callApi("POST",`config/config_entries/flow/${o.flow_id}`,{todo_list_name:s});if((n==null?void 0:n.type)!=="create_entry")throw new Error((n==null?void 0:n.reason)||((i=n==null?void 0:n.errors)==null?void 0:i.base)||"not created");e.value="",this._toast(`${s} list created.`)}catch(o){this._toast(`Couldn't create ${s}: ${this._errText(o)}`)}finally{e.disabled=!1}}}_watchTodos(t){if(this._config.todos===!1||this._config.build_page)return;let e=this._todoIds(t),s=e.map(i=>{var o;return`${i}=${(o=t.states[i])==null?void 0:o.state}`}).join("|");s!==this._todoSig&&(this._todoSig=s,this._loadTodos(e))}async _loadTodos(t){let e=await Promise.all(t.map(async s=>{var n;let i=this._hass.states[s],o=((n=i==null?void 0:i.attributes)==null?void 0:n.friendly_name)||s;if(!i||i.state==="unavailable")return{id:s,name:o,items:[],off:!0};try{let a=await this._hass.callWS({type:"todo/item/list",entity_id:s});return{id:s,name:o,items:((a==null?void 0:a.items)||[]).filter(r=>r.status!=="completed")}}catch(a){return{id:s,name:o,items:[],err:this._errText(a)}}}));this._todos=e}async _todoRemove(t){if(this._confirmList!==t.id){this._confirmList=t.id,clearTimeout(this._confirmListT),this._confirmListT=setTimeout(()=>this._confirmList=null,4e3);return}this._confirmList=null;try{let e=await this._hass.callWS({type:"config/entity_registry/get",entity_id:t.id});e.platform==="local_todo"&&e.config_entry_id?(await this._hass.callApi("DELETE",`config/config_entries/entry/${e.config_entry_id}`),this._toast(`${t.name} deleted.`)):(await this._hass.callWS({type:"config/entity_registry/update",entity_id:t.id,hidden_by:"user"}),this._toast(`${t.name} hidden.`)),this._todos=this._todos.filter(s=>s.id!==t.id)}catch(e){this._toast(`Couldn't remove ${t.name}: ${this._errText(e)}`)}}async _todoAdd(t,e){t.preventDefault();let s=t.target.querySelector("input"),i=s.value.trim();if(i){s.value="",this._todos=this._todos.map(o=>o.id===e.id?J(L({},o),{items:[...o.items,{uid:`new-${Date.now()}`,summary:i}]}):o);try{await this._hass.callService("todo","add_item",{item:i},{entity_id:e.id})}catch(o){this._toast(`Could not add ${i} to ${e.name}.`),this._todoSig=null,this._watchTodos(this._hass)}}}async _todoDone(t,e){this._todos=this._todos.map(s=>s.id===t.id?J(L({},s),{items:s.items.filter(i=>i.uid!==e.uid)}):s);try{await this._hass.callService("todo","update_item",{item:e.uid,status:"completed"},{entity_id:t.id})}catch(s){this._toast(`Could not tick off ${e.summary}.`),this._todoSig=null,this._watchTodos(this._hass)}}_openCalendar(){this._sheet={kind:"calendar",items:[],q:""}}_openReview(){if(!customElements.get("hubbubb-review-card"))return this._navigate(this._config.review_path);this._reviewEl||(this._reviewEl=document.createElement("hubbubb-review-card"),this._reviewEl.setConfig({type:"custom:hubbubb-review-card",entity:this._config.review_entity}),this._reviewBox=document.createElement("div"),this._reviewBox.attachShadow({mode:"open"}).appendChild(this._reviewEl)),this._reviewEl.hass=this._hass,this._sheet={kind:"review",items:[],q:""}}_openTodos(){this._todoSig=null,this._watchTodos(this._hass),this._sheet={kind:"todos",items:[],q:""}}_renderTodos(){if(!this._todos)return m`<div class="dim pad">Loading…</div>`;let t=m`<form class="tadd tnew" @submit=${e=>this._todoCreate(e)}>
      <input type="text" placeholder="New list…" enterkeyhint="done" />
      <button type="submit" title="Create list">+</button>
    </form>`;return this._todos.length?m`${this._renderTodoLists()}${t}`:m`<div class="dim pad">No to-do lists yet.</div>${t}`}_renderTodoLists(){return m`<section class="todos">
      ${this._todos.map(t=>m`<div class="todo">
          <div class="phead">
            <span class="ptitle">${t.name}</span>
            ${t.off||t.err?$:m`<span class="tcount">${t.items.length}</span>`}
            <button
              class="hbtn danger ${this._confirmList===t.id?"armed":""}"
              title="Remove this list"
              @click=${()=>this._todoRemove(t)}
            >${this._confirmList===t.id?"Confirm?":"Remove"}</button>
          </div>
          ${t.off?m`<div class="dim">Unavailable</div>`:t.err?m`<div class="perr">${t.err}</div>`:m`${t.items.length?t.items.map(e=>m`<button class="titem" title="Tick off" @click=${()=>this._todoDone(t,e)}>
                      <span class="tbox"></span><span class="ttext">${e.summary}</span>
                    </button>`):m`<div class="dim">Nothing on the list.</div>`}
                <form class="tadd" @submit=${e=>this._todoAdd(e,t)}>
                  <input type="text" placeholder="Add to ${t.name}…" enterkeyhint="done" />
                  <button type="submit" title="Add">+</button>
                </form>`}
        </div>`)}
    </section>`}_renderDock(t){var c,d,p,u,g;if(t||this._config.dock===!1||this._config.build_page)return $;let e=b=>m`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`,s=b=>this._landed&&!this._landed.has(b)?"pending":"",i=((c=this._todos)==null?void 0:c.reduce((b,_)=>{var v;return b+(((v=_.items)==null?void 0:v.length)||0)},0))||0,o=this._sessions||[],n=o.filter(b=>b.done).length,a=Zs((g=(u=(p=(d=this._hass)==null?void 0:d.states)==null?void 0:p[this._config.review_entity])==null?void 0:u.attributes)==null?void 0:g.proposals).pending.length,r=this._meetLabel,l=(b,_,v="")=>_&&!s(b)?Fs(_,m`<b class="badge ${v}">${_}</b>`):$;return m`<nav class="dock ${this._booting&&this._config.animation==="jarvis-im3"?"assembling":""}">
      <button class=${s(0)} title=${r?`Calendar - next meeting in ${r}`:"Calendar"} aria-label="Calendar" @click=${()=>this._openCalendar()}>
        ${e(It`<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2"/>`)}
        ${l(0,r)}
      </button>
      <button class=${s(1)} title="To-do lists" aria-label="To-do lists" @click=${()=>this._openTodos()}>
        ${e(It`<path d="M10 6.5h10.5M10 12h10.5M10 17.5h10.5"/><path d="M3.5 6.5l1.6 1.6 2.9-3.2M3.5 12l1.6 1.6 2.9-3.2"/><rect x="3.8" y="16" width="3.2" height="3.2" rx="0.6"/>`)}
        ${l(1,i)}
      </button>
      <button class="power ${this._booting?"on":""} ${s(2)}" title="Start-up and introduction" aria-label="Start-up and introduction" @click=${this._intro}>
        ${e(It`<path d="M12 3.5v7"/><path d="M7.2 6.6a7 7 0 1 0 9.6 0"/>`)}
      </button>
      <button class=${s(3)} title=${a?`Nightly review - ${a} waiting`:"Nightly review"} aria-label="Nightly review" @click=${()=>this._openReview()}>
        ${e(It`<path d="M11 20.5H6.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H14l4 4v3"/><path d="M14 3.5v4h4"/><circle cx="15.5" cy="15.5" r="3"/><path d="M17.7 17.7l2.6 2.6"/><path d="M7.5 8.5h3M7.5 12h4"/>`)}
        ${l(3,a)}
      </button>
      <button
        class=${s(4)}
        title=${o.length?`Build mode - ${o.length} running${n?`, ${n} need${n>1?"":"s"} you`:""}`:"Build mode"}
        aria-label="Build mode"
        data-ai="toggle-build-mode"
        @click=${()=>this._setBuild(!0)}
      >
        ${e(It`<path d="M12 2.6c-4 0-7 2.5-7 6.5v4.3c0 2.1.8 4 2.2 5.4L9.6 21h4.8l2.4-2.2c1.4-1.4 2.2-3.3 2.2-5.4V9.1c0-4-3-6.5-7-6.5z"/><path d="M7.3 11.1l3.4 1M16.7 11.1l-3.4 1"/><path d="M12 2.8v4.4M9.8 17.2h4.4M7.4 14.2l2.3 1.6M16.6 14.2l-2.3 1.6"/>`)}
        ${l(4,o.length)}
        ${l(4,n,"alert")}
      </button>
    </nav>`}_fmtElapsed(t){if(t==null)return"";let e=Math.floor(t/60);return e<1?`${Math.floor(t)}s`:e<60?`${e}m`:`${Math.floor(e/60)}h ${e%60}m`}_chipProjects(){let t=o=>o.replace(/\b\w/g,n=>n.toUpperCase()),e=o=>typeof o=="string"?{project:o,label:t(o)}:o,s=this._config.build_projects,i=this._projects||[];return Array.isArray(s)&&s.length?s.map(e).filter(o=>!i.length||i.includes(o.project)):i.map(e)}_renderList(){let t=this._sessions;return m`
      <div class="phead">
        <button class="hbtn back" data-ai="toggle-build-mode" title="Back" @click=${()=>this._setBuild(!1)}>‹</button>
        <span class="ptitle">${this._name} Agents</span>
        <button
          class="hbtn"
          data-ai="create-session"
          @click=${()=>this._picking=!this._picking}
        >+ New</button>
      </div>
      ${this._picking?m`<div class="chips">
            ${this._chipProjects().map(e=>m`<button class="chip" @click=${()=>this._newSession(e.project)}>
                ${e.label}
              </button>`)}
          </div>`:$}
      <div class="list">
        ${t==null?m`<div class="dim pad">Scanning…</div>`:t.length===0?m`<div class="dim pad">No sessions running.</div>`:t.map(e=>m`
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
                        title=${e.done?"finished \u2014 not opened yet":$}
                      ></span>
                      <span class="rmain">
                        <span class="rlabel">
                          ${e.title||e.label}
                          ${e.busy?m`<span class="rtime">${this._fmtElapsed(e.elapsed)}</span>`:$}
                        </span>
                        ${e.last_message?m`<span class="rsnip">${e.last_message}</span>`:$}
                        <span class="rmeta">
                          <span class="pill">${e.project}</span>
                          ${e.label!==e.project?m`<span class="pill alt">${e.label.replace(`${e.project}, `,"")}</span>`:$}
                          ${e.model?m`<span class="pill alt">${this._modelName(e)}</span>`:$}
                        </span>
                      </span>
                      <span class="chev">›</span>
                    </button>
                  </div>
                `)}
      </div>
    `}_modelName(t){if((t==null?void 0:t.model)==="local")return"Local";let e=(this._models||[]).find(s=>s.id===(t==null?void 0:t.model));return((e==null?void 0:e.name)||(t==null?void 0:t.model)||"Claude").replace(/^Claude /,"")}_renderHello(t){let e=(t==null?void 0:t.model)==="local",s=this._modelName(t);return m`<div class="hello">
      <div class="hello-ring"><span></span><span></span><span></span></div>
      <div class="hello-name">${e?this._name:"Claude"}</div>
      <div class="hello-sub">
        ${e?"Local":`Cloud \xB7 ${s}`}${t!=null&&t.project?m` · ${t.project}`:$}
      </div>
      <div class="hello-ready">Ready when you are</div>
    </div>`}_useSuggestion(){let t=this._composerEl();!t||!this._suggestion||(t.value=this._suggestion,this._autoGrow(t),this._draftSoon(),t.focus(),t.setSelectionRange(t.value.length,t.value.length))}_renderSession(){let t=(this._sessions||[]).find(e=>e.id===this._sel);return m`
      <div class="phead">
        <button class="hbtn back" data-ai="close-session-view" @click=${()=>this._select(null)}>‹</button>
        <button
          class="ptitle tappable"
          data-ai="session-details"
          title="What is this session?"
          @click=${()=>this._details=!this._details}
        >
          ${(t==null?void 0:t.title)||(t==null?void 0:t.label)||"session"}
          ${t!=null&&t.busy?m`<span class="livedot"></span> working ${this._fmtElapsed(t.elapsed)}`:$}
          <span class="caret">${this._details?"\u25B4":"\u25BE"}</span>
        </button>
        <button class="hbtn" data-ai="view-mac-screen" title="See the Mac's screen" @click=${()=>this._openScreen()}>Screen</button>
        <button
          class="hbtn danger ${this._confirmKill===this._sel?"armed":""}"
          data-ai="end-session"
          @click=${()=>this._killSession(this._sel)}
        >${this._confirmKill===this._sel?"Confirm?":"End"}</button>
      </div>
      ${this._details?m`<div class="details">
            <div class="drow">
              <span class="dkey">Project</span>
              <span class="pill">${(t==null?void 0:t.project)||"unknown"}</span>
              ${t!=null&&t.label&&t.label!==t.project?m`<span class="pill alt">${t.label.replace(`${t.project}, `,"")}</span>`:$}
            </div>
            <div class="drow col">
              <span class="dkey">You opened with</span>
              <span class="dfirst">${(t==null?void 0:t.first_message)||"Nothing recorded yet."}</span>
            </div>
          </div>`:$}
      <div
        class="log"
        @scroll=${e=>{let s=e.target;this._stick=s.scrollHeight-s.scrollTop-s.clientHeight<40}}
      >
        ${this._msgs==null?m`<div class="dim pad">Loading transcript…</div>`:this._msgs.every(e=>e.role==="screen")?this._renderHello(t):this._msgs.map(e=>m`<div class="msg ${e.role}">${this._body(e)}</div>`)}
        ${t!=null&&t.busy?this._activity?m`<div class="activity">${this._activity}</div>`:this._screen?m`<pre class="activity screen-tail" title="No spinner on screen - this is the terminal as it stands">${this._screen}</pre>`:$:$}
        ${this._ask?this._renderAsk(this._ask):$}
        ${(this._queue||[]).filter(e=>e.id===this._sel).map(e=>m`<div class="qitem ${e.state}">
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
                ${e.state==="held"?m`
                      <button class="qbtn" @click=${()=>this._editQueued(e)}>edit</button>
                      <button class="qbtn" @click=${()=>this._dispatch(e)}>send now</button>
                      <button class="qbtn del" @click=${()=>this._dropQueued(e)}>✕</button>
                    `:$}
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
        ${(this._files||[]).length||this._uploading?m`<div class="atts">
              ${(this._files||[]).map(e=>m`<span class="att">
                  <span class="attname">${e.name}</span>
                  <button
                    class="attx"
                    title="Remove"
                    @click=${()=>this._dropFile(e)}
                  >✕</button>
                </span>`)}
              ${this._uploading?m`<span class="att pendingatt">sending…</span>`:$}
            </div>`:$}
        <div
          class="cbox"
          @pointerdown=${e=>{var s;e.target.closest("button, input, textarea, select")||(e.preventDefault(),(s=this._composerEl())==null||s.focus())}}
        >
        <div class="cbtns">
          ${this._sel?this._renderRunControls():$}
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
        ${this._suggestion?m`<button
              type="button"
              class="suggest"
              data-ai="use-suggestion"
              title="Claude Code's suggested reply - tap, or press Tab in an empty box"
              @click=${()=>this._useSuggestion()}
            ><span class="suggest-key">⇥</span>${this._suggestion}</button>`:$}
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
    `}render(){var a,r,l,c;if(!this._config)return $;if(!((r=(a=this._hass)==null?void 0:a.states)==null?void 0:r[this._config.entity]))return m`
        <ha-card>
          <div class="missing">
            Entity <code>${this._config.entity}</code> not found
          </div>
        </ha-card>
      `;let e=this._effectiveState(),s=this._stateColor(e),i=!!this._build,o=(l=this._announce)!=null?l:null,n=(c=this._messages)!=null?c:null;return m`
      <ha-card
        class="bg-${this._config.background}${this._config.honeycomb===!1?"":" comb"}${e==="offline"?" dim":""}${this._config.animation==="jarvis-im3"?" im3":""}"
        style=${this._config.honeycomb===!1?"":`--jr-comb:${Zi(s)}`}
      >
        <div
          class="wrap state-${e} ${i&&!this._config.build_dashboard?"build":""} ${this._config.build_page?"page":""} ${i&&this._config.panel_fullscreen&&!this._config.build_dashboard?"over":""}"
          style=${this._cardVars(s)}
        >
          ${this._config.dock===!1||i||this._config.build_page?m`<button
            class="mode ${i?"on":""}"
            data-ai="toggle-build-mode"
            title=${i?"Back":"Build mode"}
            @click=${()=>this._setBuild(!i)}
          >
            ${i?m`<span class="mode-back">‹</span>`:m`<svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>`}
          </button>`:$}
          ${o===null?$:m`<button
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
          ${n===null?$:m`<button
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
          ${i&&!this._config.build_dashboard?m`<div class="panel ${this._sel?"open":""} ${this._view?"view":""}">
                <div class="side" style=${this._sideW?`flex-basis:${this._sideW}px`:""}>${this._renderList()}</div>
                <div class="grip" title="Drag to resize" @pointerdown=${this._gripDown}></div>
                <div class="main">
                  ${this._sel?this._renderSession():m`<div class="dim pad empty">Pick a session, or start a new one.</div>`}
                  ${this._err?m`<div class="perr">${this._err}</div>`:$}
                </div>
                ${this._view?m`<div class="viewer">${this._renderViewer()}</div>`:$}
              </div>`:$}
          <div class="ring ${this._config.animation==="jarvis-v1"?"":"bubbles"} ${this._booting?"booting":""}" data-ai="activate-assistant" @click=${this._ringTap}>
            <canvas></canvas>
            ${this._booting&&this._config.animation!=="jarvis-im3"?m`<div class="wordmark" aria-hidden="true">${this._name.toUpperCase()}<small>All systems online</small></div>`:$}
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
                  width=${Dt.w}
                  height=${Dt.h}
                  patternUnits="userSpaceOnUse"
                >
                  <path d=${ui} class="hex" />
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
          ${this._sheet?this._renderSheet():$}
        </div>
      </ha-card>
    `}};ct(Et,"build",ci),ct(Et,"version",di),ct(Et,"properties",{_config:{state:!0},_todos:{state:!0},_state:{state:!0},_mp:{state:!0},_build:{state:!0},_sessions:{state:!0},_meetLabel:{state:!0},_confirmList:{state:!0},_projects:{state:!0},_sel:{state:!0},_msgs:{state:!0},_ask:{state:!0},_askSent:{state:!0},_activity:{state:!0},_screen:{state:!0},_permission:{state:!0},_modelBusy:{state:!0},_models:{state:!0},_suggestion:{state:!0},_modes:{state:!0},_model:{state:!0},_queue:{state:!0},_swipe:{state:!0},_details:{state:!0},_view:{state:!0},_zoom:{state:!0},_sideW:{state:!0},_files:{state:!0},_dragging:{state:!0},_uploading:{state:!0},_err:{state:!0},_confirmKill:{state:!0},_picking:{state:!0},_pending:{state:!0},_voiceState:{state:!0},_announce:{state:!0},_messages:{state:!0},_dictating:{state:!0},_booting:{state:!0},_landed:{state:!0},_sheet:{state:!0}}),ct(Et,"styles",Ft`
    :host {
      display: block;
      /* The build-mode chrome's palette as channels, so a whole look can
         retint it: line = borders, glow = fills and shadows, glass = panel
         background, ink = text. */
      --jr-line: 53, 154, 210;
      --jr-glow: 46, 157, 245;
      --jr-glass-a: 10, 24, 32;
      --jr-glass-b: 4, 10, 14;
    }
    /* jarvis-im3 is teal throughout, the build windows included. */
    ha-card.im3 {
      --jr-line: 63, 200, 190;
      --jr-glow: 70, 220, 205;
      --jr-glass-a: 6, 26, 26;
      --jr-glass-b: 2, 10, 10;
      --jr-ink: #cdf3ee;
      --jr-ink-2: #b6ece5;
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
    /* The film's tab bar: a thin dark strip split into cells by faint
       dividers, each glyph inside a hairline circle, no labels, and the power
       button in a double ring under a raised tab in the middle. */
    .dock {
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, 1fr) 84px repeat(2, 1fr);
      align-items: center;
      box-sizing: border-box;
      width: min(100% - 24px, 560px);
      margin: 30px auto 10px;
      padding: 4px 0;
      background: var(
        --jr-panel-bg,
        linear-gradient(180deg, rgba(var(--jr-glass-a), 0.92), rgba(var(--jr-glass-b), 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.3));
      border-radius: 4px;
      box-shadow: inset 0 0 22px rgba(var(--jr-glow), 0.07);
      line-height: 1;
    }
    /* the raised tab the power button sits under */
    .dock::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -9px;
      width: 132px;
      height: 9px;
      transform: translateX(-50%);
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.3));
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      background: rgba(var(--jr-glass-a), 0.92);
    }
    .dock button {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 0;
      height: 52px;
      padding: 0;
      border: none;
      background: none;
      color: var(--jr-color);
      opacity: 0.8;
      cursor: pointer;
      transition: opacity 0.2s, filter 0.2s;
      -webkit-tap-highlight-color: transparent;
    }
    /* faint dividers between the side cells */
    .dock button:nth-child(1)::after,
    .dock button:nth-child(4)::after {
      content: "";
      position: absolute;
      right: 0;
      top: 8px;
      bottom: 8px;
      width: 1px;
      background: rgba(var(--jr-line), 0.18);
    }
    .dock button svg {
      position: static; /* the ring's svg rule pins svgs absolutely */
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      padding: 8px;
      display: block;
      border: 1px solid rgba(var(--jr-line), 0.4);
      border-radius: 50%;
      filter: drop-shadow(0 0 3px rgba(var(--jr-glow), 0.45));
    }
    .dock button:hover,
    .dock button:focus-visible {
      opacity: 1;
      outline: none;
    }
    .dock button:hover svg,
    .dock button:focus-visible svg {
      border-color: var(--jr-color);
      box-shadow: 0 0 10px rgba(var(--jr-glow), 0.35), inset 0 0 8px rgba(var(--jr-glow), 0.2);
    }
    .dock button:active {
      transform: scale(0.96);
    }
    .dock button.power {
      justify-self: center;
      width: 66px;
      height: 66px;
      margin-top: -26px;
      border-radius: 50%;
      border: 1px solid var(--jr-color);
      background: radial-gradient(circle at 50% 40%, rgba(16, 40, 48, 0.98), rgba(3, 8, 11, 0.98));
      box-shadow: 0 0 0 4px rgba(3, 8, 11, 0.95), 0 0 0 5px rgba(var(--jr-line), 0.4),
        0 0 16px rgba(var(--jr-glow), 0.3), inset 0 0 14px rgba(var(--jr-glow), 0.18);
      opacity: 1;
    }
    .dock button.power svg {
      width: 100%;
      height: 100%;
      padding: 16px;
      border: none;
    }
    .dock button.power:hover,
    .dock button.power.on {
      box-shadow: 0 0 0 4px rgba(3, 8, 11, 0.95), 0 0 0 5px var(--jr-color),
        0 0 22px var(--jr-color), inset 0 0 16px rgba(var(--jr-glow), 0.25);
    }
    .dock button.power:hover svg {
      box-shadow: none;
    }

    /* start-up: empty slots until each icon drops in */
    .dock button svg,
    .dock button span {
      transition: opacity 0.25s;
    }
    .dock button.pending svg,
    .dock button.pending span {
      opacity: 0;
    }
    /* the open-item count rides on the icon's corner, so it never widens
       the label - the label is what has to fit on a phone */
    .badge {
      animation: jrBadge 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      position: absolute;
      top: 2px;
      left: calc(50% + 9px);
      white-space: nowrap;
      min-width: 14px;
      height: 14px;
      box-sizing: border-box;
      padding: 0 4px;
      border-radius: 7px;
      background: var(--jr-color);
      color: #021010;
      font-size: 9px;
      font-weight: 700;
      line-height: 14px;
      text-align: center;
    }
    /* needs you: the other corner, in red, and it breathes */
    .badge.alert {
      left: auto;
      right: calc(50% + 9px);
      background: #ff5a64;
      color: #fff;
      animation: jrBadge 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both, jrAlert 1.6s ease-in-out 0.5s infinite;
    }
    @keyframes jrAlert {
      50% { box-shadow: 0 0 10px #ff5a64; }
    }
    @keyframes jrBadge {
      0% { transform: scale(0); opacity: 0; }
      60% { opacity: 1; box-shadow: 0 0 12px var(--jr-color); }
      100% { transform: scale(1); box-shadow: 0 0 0 transparent; }
    }
    .dock.assembling {
      animation: jrDockArrive .6s 4.6s cubic-bezier(.2,.75,.2,1) both;
    }
    .dock.assembling button svg { transition: none; }
    @keyframes jrDockArrive {
      from { opacity: 0; transform: translateY(28px) scaleX(.72); clip-path: inset(0 46% 0 46%); }
      to { opacity: 1; transform: translateY(0) scaleX(1); clip-path: inset(-30px -20px -20px -20px); }
    }
    .flyicon {
      position: absolute;
      width: 40px;
      height: 40px;
      z-index: 4;
      pointer-events: none;
      color: var(--jr-color);
      transform-origin: 50% 50%;
      filter: drop-shadow(0 0 .25px rgba(var(--jr-line),.5));
    }
    .flyicon .fly-halo { position: absolute; inset: 0; width: 100%; height: 100%; }
    .fly-glyph { position: absolute; inset: 21%; }
    .fly-glyph svg { position: static; width: 100%; height: 100%; stroke-width: 1; }
    .fly-orbit { transform-origin: 20px 20px; animation: jrFlyOrbit 1.5s linear infinite; }
    .fly-orbit.reverse { animation-direction: reverse; animation-duration: 2.2s; }
    @keyframes jrFlyOrbit { to { transform: rotate(360deg); } }
    .fly-scan {
      position: absolute; inset: 10%; border-radius: 50%; overflow: hidden;
      background: repeating-linear-gradient(0deg, transparent 0 1.4px, rgba(var(--jr-line),.16) 1.4px 1.6px);
      animation: jrFlyScan .65s ease-out both;
    }
    @keyframes jrFlyScan {
      0% { clip-path: inset(100% 0 0); opacity: 0; }
      35% { opacity: .75; }
      100% { clip-path: inset(0); opacity: 0; }
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
        linear-gradient(160deg, rgba(var(--jr-glass-a), 0.92), rgba(var(--jr-glass-b), 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.35));
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(var(--jr-glow), 0.08);
      padding: 10px 12px;
      color: var(--jr-panel-text, var(--jr-ink, #cfe9f7));
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
      background: rgba(var(--jr-glow), 0.1);
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
    .tadd {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    .tnew {
      width: min(100% - 24px, 520px);
      margin: 4px auto 14px;
      box-sizing: border-box;
    }
    .tadd input {
      flex: 1;
      min-width: 0;
      margin: 0;
      padding: 7px 10px;
      border-radius: 6px;
      border: 1px solid rgba(var(--jr-line), 0.35);
      background: rgba(var(--jr-glow), 0.06);
      color: inherit;
      font: inherit;
      font-size: 16px; /* under 16px iOS zooms the page on focus */
    }
    .tadd input:focus {
      outline: none;
      border-color: var(--jr-color);
    }
    .tadd button {
      flex: none;
      width: 36px;
      border-radius: 6px;
      border: 1px solid rgba(var(--jr-line), 0.45);
      background: rgba(var(--jr-glow), 0.12);
      color: var(--jr-color);
      font-size: 18px;
      cursor: pointer;
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
    /* the review is long: a full-screen pop-up, closed back to the ring */
    .sheet.review,
    .sheet.calendar {
      position: fixed;
      z-index: 9;
      /* below the phone's status bar and notch and HA's own header, so the
         close button is reachable */
      padding: calc(env(safe-area-inset-top, 0px) + 64px) 12px calc(env(safe-area-inset-bottom, 0px) + 12px);
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.72);
    }
    .sheet.review .sheet-box,
    .sheet.calendar .sheet-box {
      width: min(920px, 100%);
      height: 100%;
      max-height: none;
    }
    .sheet.calendar .sheet-box {
      width: min(1200px, 100%);
    }
    /* Phones: calendar, to-do lists and review fill the screen edge to edge,
       pinned to the visible viewport like build mode's panel, instead of a
       box floating in a margin. */
    @media (max-width: 620px) {
      .sheet.review,
      .sheet.calendar,
      .sheet.todos {
        position: fixed;
        z-index: 20;
        left: env(safe-area-inset-left, 0px);
        right: env(safe-area-inset-right, 0px);
        top: calc(var(--jr-vvt, 0px) + env(safe-area-inset-top, 0px));
        bottom: auto;
        height: calc(var(--jr-vvh, 100dvh) - env(safe-area-inset-top, 0px));
        padding: 0;
        background: #061014;
      }
      .sheet.review .sheet-box,
      .sheet.calendar .sheet-box,
      .sheet.todos .sheet-box {
        width: 100%;
        height: 100%;
        max-height: none;
        border: none;
        border-radius: 18px 18px var(--jr-botr, 56px) var(--jr-botr, 56px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
        box-sizing: border-box;
      }
      .sheet.todos .sheet-list {
        flex: 1;
        min-height: 0;
      }
      .sheet .todos,
      .sheet .tnew {
        width: calc(100% - 16px);
      }
    }
    hubbubb-calendar {
      flex: 1;
      min-height: 0;
    }
    .review-host {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    .sheet-box {
      display: flex;
      flex-direction: column;
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
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
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      margin: -10px -10px -10px 0;
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
      border-left: 1px solid rgba(var(--jr-line), 0.3);
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
      border-left: 1px solid rgba(var(--jr-line), 0.3);
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
      background: rgba(var(--jr-glow), 0.18);
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
      cursor: zoom-in;
      touch-action: pan-x pan-y;
    }
    .vent {
      display: block;
      padding: 3px 0;
      font-size: 13px;
    }
    .mode-back {
      display: block;
      font-size: 24px;
      line-height: 20px;
      text-align: center;
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
        linear-gradient(160deg, rgba(var(--jr-glass-a), 0.92), rgba(var(--jr-glass-b), 0.96))
      );
      border: 1px solid var(--jr-panel-border, rgba(var(--jr-line), 0.35));
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(var(--jr-glow), 0.08);
      padding: 10px 12px;
      color: var(--jr-panel-text, var(--jr-ink, #cfe9f7));
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
      border-bottom: 1px solid rgba(var(--jr-line), 0.3);
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
      text-shadow: 0 0 8px rgba(var(--jr-glow), 0.5);
    }
    .hbtn {
      flex: none;
      background: rgba(var(--jr-glow), 0.06);
      border: 1px solid rgba(var(--jr-line), 0.45);
      color: var(--jr-ink-2, #bfe3f5);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 10px;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .hbtn:hover {
      background: rgba(var(--jr-glow), 0.18);
      box-shadow: 0 0 10px rgba(var(--jr-glow), 0.35);
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
      border: 1px solid rgba(var(--jr-line), 0.4);
      border-radius: 4px;
      color: var(--jr-ink-2, #b8dff2);
      font-size: 11.5px;
      padding: 4px 10px;
      cursor: pointer;
      font-family: inherit;
      letter-spacing: 0.05em;
    }
    .chip:hover {
      background: rgba(var(--jr-glow), 0.15);
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
      border-bottom: 1px solid rgba(var(--jr-line), 0.14);
      padding: 8px 4px 8px 14px;
      cursor: pointer;
      color: inherit;
      font-family: inherit;
      text-align: left;
    }
    .row:hover {
      background: rgba(var(--jr-glow), 0.08);
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
      background: rgba(var(--jr-glow), 0.12);
      border: 1px solid rgba(var(--jr-line), 0.35);
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
      background: rgba(var(--jr-glow), 0.06);
      border: 1px solid rgba(var(--jr-line), 0.28);
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
      scrollbar-color: rgba(var(--jr-line), 0.4) transparent;
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
      background: rgba(var(--jr-glow), 0.12);
      border: 1px solid rgba(var(--jr-line), 0.25);
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
      border: 1px solid rgba(var(--jr-line), 0.18);
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
      border-left: 2px solid rgba(var(--jr-line), 0.35);
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
      background: rgba(var(--jr-glow), 0.13);
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
      border-top: 1px solid rgba(var(--jr-line), 0.3);
    }
    /* The box owns the border and background; the textarea and the button row
       stack inside it. The buttons used to be positioned over the textarea,
       which meant long text scrolled underneath and hid them — a row of their
       own cannot be covered. */
    .cbox {
      display: flex;
      flex-direction: column;
      background: rgba(0, 10, 16, 0.6);
      border: 1px solid rgba(var(--jr-line), 0.4);
      border-radius: 6px;
      overflow: hidden;
    }
    .cbox:focus-within,
    .composer.drag .cbox {
      border-color: var(--jr-color);
      box-shadow: 0 0 10px rgba(var(--jr-glow), 0.35);
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
    /* Bare red square, no border or padding to speak of: on a phone the
       model picker needs the width more than the stop needs a frame. */
    .hbtn.stop {
      border-color: transparent;
      background: transparent;
      padding: 4px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .hbtn.stop i {
      width: 9px;
      height: 9px;
      border-radius: 2px;
      background: #ff4d4d;
    }
    .hbtn.stop:hover {
      border-color: transparent;
    }
    .hbtn.stop:hover i {
      background: #ff7070;
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
      border-color: rgba(var(--jr-glow), 0.7);
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
      border-color: rgba(var(--jr-glow), 0.55);
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
      background: rgba(var(--jr-glow), 0.12);
      border: 1px solid rgba(var(--jr-line), 0.35);
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
      background: rgba(var(--jr-line), 0.07);
      border-left: 2px solid rgba(var(--jr-line), 0.4);
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
      border-color: rgba(var(--jr-line), 0.35);
      background: rgba(var(--jr-glow), 0.1);
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
      background: rgba(var(--jr-glow), 0.18);
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
      border: 1px solid rgba(var(--jr-line), 0.4);
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
      border: 1px solid rgba(var(--jr-line), 0.3);
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
  `);var to=[{name:"entity",required:!0,selector:{entity:{domain:$e}}},{name:"animation",selector:{select:{mode:"dropdown",options:[{value:"hubbubb",label:"Hubbubb - ring and bubbles"},{value:"jarvis-v1",label:"Jarvis v1 - segments and motes"},{value:"jarvis-im3",label:"Jarvis IM3 - folding film, as in the film"}]}}},{name:"assistant_name",selector:{text:{}}},{name:"size",selector:{number:{min:80,max:600,step:10,mode:"slider"}}},{name:"background",selector:{select:{mode:"dropdown",options:[{value:"dark",label:"Deep space (dark)"},{value:"card",label:"Normal card background"},{value:"transparent",label:"Transparent"}]}}},{name:"honeycomb",selector:{boolean:{}}},{name:"todos",selector:{boolean:{}}},{name:"todo_entities",selector:{entity:{domain:"todo",multiple:!0}}},{name:"todo_exclude",selector:{entity:{domain:"todo",multiple:!0}}},{name:"tap_message",selector:{text:{}}},{name:"",type:"expandable",title:"Toggles",icon:"mdi:toggle-switch-outline",schema:[{name:"build_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"announce_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"messages_entity",selector:{entity:{domain:["switch","input_boolean"]}}}]},{name:"",type:"expandable",title:"Build panel",icon:"mdi:hexagon-multiple-outline",schema:[{name:"panel_fullscreen",selector:{boolean:{}}},{name:"panel_height",selector:{number:{min:0,max:1400,step:20,mode:"box"}}},{name:"build_projects",selector:{text:{multiple:!0}}},{name:"build_dashboard",selector:{text:{}}},{name:"build_page",selector:{boolean:{}}},{name:"build_return",selector:{text:{}}}]},{name:"",type:"expandable",title:"Ring colours",icon:"mdi:palette",schema:[{name:"idle_color",selector:{text:{}}},{name:"listening_color",selector:{text:{}}},{name:"processing_color",selector:{text:{}}},{name:"responding_color",selector:{text:{}}},{name:"offline_color",selector:{text:{}}}]},{name:"",type:"expandable",title:"Panel colours",icon:"mdi:console",schema:[{name:"panel_bg",selector:{text:{}}},{name:"panel_border",selector:{text:{}}},{name:"panel_text",selector:{text:{}}},{name:"terminal_bg",selector:{text:{}}},{name:"terminal_text",selector:{text:{}}}]},{name:"",type:"expandable",title:"Advanced",icon:"mdi:tune",schema:[{name:"follow_media_player",selector:{boolean:{}}},{name:"audio_offset",selector:{number:{min:-2,max:2,step:.05,mode:"box"}}},{name:"media_player",selector:{entity:{domain:"media_player"}}},{name:"particle_size",selector:{number:{min:.3,max:3,step:.1,mode:"slider"}}},{name:"particles",selector:{number:{min:0,max:4e3,step:20,mode:"box"}}}]}],eo={entity:"Assist satellite",animation:"Animation",assistant_name:"Assistant name",size:"Ring size (px)",background:"Card background",honeycomb:"Honeycomb background",todos:"To-do button in the dock",todo_entities:"Which to-do lists (empty = all)",todo_exclude:"Lists to leave out",follow_media_player:"Animate while the device is playing audio",audio_offset:"Audio sync offset (seconds)",media_player:"Speaker entity (blank = same device)",tap_message:"Spoken reply when the ring is tapped",particles:"Particle count, Jarvis v1 (0 = auto)",particle_size:"How many bubbles (1 = about 22)",build_entity:"Build mode toggle",announce_entity:"Agent announcement toggle",messages_entity:"Hubbubb message toggle",panel_fullscreen:"Full screen (floats over the dashboard)",panel_height:"Panel height in px (0 = match the ring)",build_projects:"Projects offered by + New (blank = all the companion has)",build_dashboard:"Open this dashboard instead",build_page:"This card IS the build dashboard",build_return:"Exit goes back to",idle_color:"Idle",listening_color:"Listening",processing_color:"Processing",responding_color:"Responding",offline_color:"Unavailable",panel_bg:"Panel background",panel_border:"Panel border",panel_text:"Panel text",terminal_bg:"Terminal background",terminal_text:"Terminal text"},ke=class extends st{setConfig(t){this._config=L(L({},es),t)}render(){return this._config?m`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${to}
        .computeLabel=${t=>{var e;return(e=eo[t.name])!=null?e:t.name}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:$}_valueChanged(t){t.stopPropagation();let e=L({},t.detail.value);for(let[s,i]of Object.entries(es))e[s]===i&&delete e[s];delete e.name,delete e.show_state,ss(this,"config-changed",{config:e})}};ct(ke,"properties",{hass:{},_config:{state:!0}});customElements.define("hubbubb-ring-card",Et);customElements.define("hubbubb-ring-card-editor",ke);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-ring-card",name:"Hubbubb Ring",description:"Animated glowing ring that reacts to an Assist satellite's state.",preview:!0});console.info(`%c HUBBUBB-RING-CARD %c v${di} `,"color:#0b1620;background:#35e0ff;font-weight:700","color:#35e0ff;background:#0b1620");
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

lit-html/directives/keyed.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
