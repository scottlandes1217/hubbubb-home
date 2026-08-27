var vs=Object.defineProperty;var xs=(l,t,e)=>t in l?vs(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var It=(l,t,e)=>xs(l,typeof t!="symbol"?t+"":t,e);var Ht=globalThis,Lt=Ht.ShadowRoot&&(Ht.ShadyCSS===void 0||Ht.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Zt=Symbol(),Ie=new WeakMap,ft=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Zt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Lt&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Ie.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ie.set(e,t))}return t}toString(){return this.cssText}},He=l=>new ft(typeof l=="string"?l:l+"",void 0,Zt),te=(l,...t)=>{let e=l.length===1?l[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+l[n+1],l[0]);return new ft(e,l,Zt)},Le=(l,t)=>{if(Lt)l.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Ht.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,l.appendChild(s)}},ee=Lt?l=>l:l=>l instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return He(e)})(l):l;var{is:ys,defineProperty:ws,getOwnPropertyDescriptor:$s,getOwnPropertyNames:ks,getOwnPropertySymbols:Ms,getPrototypeOf:Ss}=Object,G=globalThis,Ue=G.trustedTypes,As=Ue?Ue.emptyScript:"",Es=G.reactiveElementPolyfillSupport,_t=(l,t)=>l,se={toAttribute(l,t){switch(t){case Boolean:l=l?As:null;break;case Object:case Array:l=l==null?l:JSON.stringify(l)}return l},fromAttribute(l,t){let e=l;switch(t){case Boolean:e=l!==null;break;case Number:e=l===null?null:Number(l);break;case Object:case Array:try{e=JSON.parse(l)}catch{e=null}}return e}},qe=(l,t)=>!ys(l,t),Ne={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:qe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);var W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ne){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ws(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=$s(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let r=i?.call(this);n?.call(this,o),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ne}static _$Ei(){if(this.hasOwnProperty(_t("elementProperties")))return;let t=Ss(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_t("properties"))){let e=this.properties,s=[...ks(e),...Ms(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(ee(i))}else t!==void 0&&e.push(ee(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Le(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:se).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:se;this._$Em=i;let r=o.fromAttribute(e,n.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??(s=o.getPropertyOptions(t)),!((s.hasChanged??qe)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,r=this[i];o!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,n,r)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[_t("elementProperties")]=new Map,W[_t("finalized")]=new Map,Es?.({ReactiveElement:W}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.1.2");var bt=globalThis,De=l=>l,Ut=bt.trustedTypes,Be=Ut?Ut.createPolicy("lit-html",{createHTML:l=>l}):void 0,Ge="$lit$",X=`lit$${Math.random().toFixed(9).slice(2)}$`,Xe="?"+X,Ts=`<${Xe}>`,tt=document,mt=()=>tt.createComment(""),vt=l=>l===null||typeof l!="object"&&typeof l!="function",he=Array.isArray,Cs=l=>he(l)||typeof l?.[Symbol.iterator]=="function",ie=`[ 	
\f\r]`,gt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,We=/>/g,Y=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,Ke=/"/g,Je=/^(?:script|style|textarea|title)$/i,ce=l=>(t,...e)=>({_$litType$:l,strings:t,values:e}),y=ce(1),Js=ce(2),Ys=ce(3),et=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Qe=new WeakMap,Z=tt.createTreeWalker(tt,129);function Ye(l,t){if(!he(l)||!l.hasOwnProperty("raw"))throw Error("invalid template strings array");return Be!==void 0?Be.createHTML(t):t}var Ps=(l,t)=>{let e=l.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=gt;for(let r=0;r<e;r++){let a=l[r],c,p,d=-1,u=0;for(;u<a.length&&(o.lastIndex=u,p=o.exec(a),p!==null);)u=o.lastIndex,o===gt?p[1]==="!--"?o=Ve:p[1]!==void 0?o=We:p[2]!==void 0?(Je.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=Y):p[3]!==void 0&&(o=Y):o===Y?p[0]===">"?(o=i??gt,d=-1):p[1]===void 0?d=-2:(d=o.lastIndex-p[2].length,c=p[1],o=p[3]===void 0?Y:p[3]==='"'?Ke:Fe):o===Ke||o===Fe?o=Y:o===Ve||o===We?o=gt:(o=Y,i=void 0);let _=o===Y&&l[r+1].startsWith("/>")?" ":"";n+=o===gt?a+Ts:d>=0?(s.push(c),a.slice(0,d)+Ge+a.slice(d)+X+_):a+X+(d===-2?r:_)}return[Ye(l,n+(l[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},xt=class l{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,r=t.length-1,a=this.parts,[c,p]=Ps(t,e);if(this.el=l.createElement(c,s),Z.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=Z.nextNode())!==null&&a.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(Ge)){let u=p[o++],_=i.getAttribute(d).split(X),b=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:b[2],strings:_,ctor:b[1]==="."?oe:b[1]==="?"?re:b[1]==="@"?ae:ot}),i.removeAttribute(d)}else d.startsWith(X)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(Je.test(i.tagName)){let d=i.textContent.split(X),u=d.length-1;if(u>0){i.textContent=Ut?Ut.emptyScript:"";for(let _=0;_<u;_++)i.append(d[_],mt()),Z.nextNode(),a.push({type:2,index:++n});i.append(d[u],mt())}}}else if(i.nodeType===8)if(i.data===Xe)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(X,d+1))!==-1;)a.push({type:7,index:n}),d+=X.length-1}n++}}static createElement(t,e){let s=tt.createElement("template");return s.innerHTML=t,s}};function nt(l,t,e=l,s){if(t===et)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=vt(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(l),i._$AT(l,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=nt(l,i._$AS(l,t.values),i,s)),t}var ne=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??tt).importNode(e,!0);Z.currentNode=i;let n=Z.nextNode(),o=0,r=0,a=s[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new yt(n,n.nextSibling,this,t):a.type===1?c=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(c=new le(n,this,t)),this._$AV.push(c),a=s[++r]}o!==a?.index&&(n=Z.nextNode(),o++)}return Z.currentNode=tt,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},yt=class l{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),vt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Cs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(tt.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=xt.createElement(Ye(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new ne(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Qe.get(t.strings);return e===void 0&&Qe.set(t.strings,e=new xt(t)),e}k(t){he(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new l(this.O(mt()),this.O(mt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=De(t).nextSibling;De(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ot=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=x}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=nt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{let r=t,a,c;for(t=n[0],a=0;a<n.length-1;a++)c=nt(this,r[s+a],e,a),c===et&&(c=this._$AH[a]),o||(o=!vt(c)||c!==this._$AH[a]),c===x?t=x:t!==x&&(t+=(c??"")+n[a+1]),this._$AH[a]=c}o&&!i&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},oe=class extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},re=class extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},ae=class extends ot{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??x)===et)return;let s=this._$AH,i=t===x&&s!==x||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==x&&(s===x||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},le=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}};var js=bt.litHtmlPolyfillSupport;js?.(xt,yt),(bt.litHtmlVersions??(bt.litHtmlVersions=[])).push("3.3.3");var Ze=(l,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new yt(t.insertBefore(mt(),n),n,void 0,e??{})}return i._$AI(l),i};var wt=globalThis,F=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ze(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return et}};F._$litElement$=!0,F.finalized=!0,wt.litElementHydrateSupport?.({LitElement:F});var zs=wt.litElementPolyfillSupport;zs?.({LitElement:F});(wt.litElementVersions??(wt.litElementVersions=[])).push("4.2.2");function ts(l,t,e){let s=Math.max(1,Math.round(t/e)),i=new Float32Array(Math.ceil(l.length/s)),n=1e-6;for(let o=0,r=0;o<l.length;o+=s,r++){let a=Math.min(l.length,o+s),c=0;for(let d=o;d<a;d++)c+=l[d]*l[d];let p=Math.sqrt(c/(a-o));i[r]=p,p>n&&(n=p)}for(let o=0;o<i.length;o++)i[o]=Math.min(1,i[o]/n);return i}function es(l,t=2){for(let e=0;e<t;e++)for(let s=0;s<l.length;s++){let i=l[s];if(!(!i.held||i.pop>=0))for(let n=s+1;n<l.length;n++){let o=l[n];if(!o.held||o.pop>=0)continue;let r=o.x-i.x,a=o.y-i.y,c=Math.hypot(r,a);c<.001&&(r=.1,a=0,c=.1);let p=i.r+o.r,d=r/c,u=a/c;if(c<p){let _=(p-c)*.5;i.x-=d*_,i.y-=u*_,o.x+=d*_,o.y+=u*_}else if(c<p*1.5){let _=(c-p)*.06;i.x+=d*_,i.y+=u*_,o.x-=d*_,o.y-=u*_}}}return l}function ss(l,t,e,s){for(let i of l){if(!i.held||i.pop>=0)continue;let n=i.x-t,o=i.y-e,r=Math.hypot(n,o);r<.001&&(n=1,o=0,r=1);let a=s+i.r;if(r<a){let c=n/r,p=o/r;i.x=t+c*a,i.y=e+p*a;let d=i.vx*c+i.vy*p;d<0&&(i.vx-=d*c,i.vy-=d*p)}}return l}function is(l,t,e,s){for(let i of l){if(!i.held||i.pop>=0||!i.anchor)continue;let n=i.x-t,o=i.y-e,r=Math.hypot(n,o);r<.001&&(n=1,o=0,r=1);let a=n/r,c=o/r,p=s+i.r;i.x=t+a*p,i.y=e+c*p;let d=i.vx*a+i.vy*c;i.vx-=d*a,i.vy-=d*c}return l}function ns(l,t,e){let s=Math.PI*2;if(!l.length)return{angle:0,gap:s};let i=l.map(r=>Math.atan2(r.y-e,r.x-t)).sort((r,a)=>r-a),n=-1,o=0;for(let r=0;r<i.length;r++){let a=i[r],p=(r+1<i.length?i[r+1]:i[0]+s)-a;p>n&&(n=p,o=a+p/2)}return{angle:o,gap:n}}function os(l,t){let{dt:e,rate:s,maxRatio:i,maxR:n,rand:o=Math.random}=t,r=0;for(let a=0;a<l.length;a++){let c=l[a];if(!(!c.held||c.pop>=0||c.gone))for(let p=a+1;p<l.length;p++){let d=l[p];if(!d.held||d.pop>=0||d.gone||Math.hypot(d.x-c.x,d.y-c.y)>c.r+d.r+1||(c.r>=d.r?c.r/d.r:d.r/c.r)>i)continue;let b=Math.sqrt(c.r*c.r+d.r*d.r);if(b>n||o()>s*e)continue;let g=c.r>=d.r?c:d,w=g===c?d:c,C=g.r*g.r,k=w.r*w.r,v=C+k;if(g.x=(g.x*C+w.x*k)/v,g.y=(g.y*C+w.y*k)/v,g.vx=(g.vx*C+w.vx*k)/v,g.vy=(g.vy*C+w.vy*k)/v,g.r=b,g.full=b,w.gone=!0,r++,g!==c)break}}if(r)for(let a=l.length-1;a>=0;a--)l[a].gone&&l.splice(a,1);return r}var Rs="4.11.1",qt="assist_satellite",Os=["idle","listening","processing","responding"],de={size:240,background:"dark",particles:0,particle_size:1,follow_media_player:!0,audio_offset:0,idle_color:"#2e9df5",listening_color:"#00ff88",processing_color:"#ffaa33",responding_color:"#00e5ff",offline_color:"#4a5560",build_entity:"",build_dashboard:"",build_page:!1,build_return:"/",build_projects:[],animation:"hubbubb",assistant_name:"Assistant",panel_height:0,panel_fullscreen:!1,panel_bg:"",panel_border:"",panel_text:"",terminal_bg:"",terminal_text:"",honeycomb:!0,tap_message:"Yes?",announce_entity:"",messages_entity:""},rs=(l,t)=>{let e=Math.round(t*ps);return e<0||e>=l.length?0:l[e]},$t=16,ps=50,as={idle:"idle_color",listening:"listening_color",processing:"processing_color",responding:"responding_color"},ls={idle:{swirl:.95,bright:1.75,radius:0,amp:1,turb:.4,sweep:0,speech:0},listening:{swirl:1.8,bright:1.8,radius:-.012,amp:1.15,turb:.6,sweep:.35,speech:0},processing:{swirl:.95,bright:1.5,radius:0,amp:1,turb:.3,sweep:1,speech:0},responding:{swirl:1.5,bright:1.55,radius:.006,amp:1.15,turb:1,sweep:.12,speech:1},offline:{swirl:.3,bright:.4,radius:-.012,amp:.5,turb:.15,sweep:0,speech:0}},Is=new Set(["tool","out","err","screen","cmd"]),Hs=l=>/^\$ /.test(l)?"l-cmd":/^\+/.test(l)?"l-add":/^- /.test(l)||/^--- /.test(l)?"l-del":/\b(error|errno|failed|failure|fatal|traceback|exception|refused|denied|not found|no such)\b/i.test(l)?"l-err":/\b(warn|warning|deprecat\w+|skipped)\b/i.test(l)?"l-warn":/^(Edit|Write|Read|Grep|Glob|Agent|Task|WebFetch|WebSearch|TodoWrite|Skill)\b/.test(l)?"l-tool":"",Ls=/`([^`\n]+)`|\*\*([^*\n]+)\*\*/g,pe=(l,t,e)=>l.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),Us={1:"can't reach Home Assistant",2:"invalid authentication",3:"connection lost \u2014 reconnecting",4:"no Home Assistant host",5:"https/http mismatch"};var gi=Math.PI/180,st=(l,t,e)=>Math.min(e,Math.max(t,l)),ue=l=>Math.round(l*100)/100,_e=l=>{let t=l>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}},Ns=l=>{let t=(1+Math.sqrt(5))/2,e=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(([a,c,p])=>{let d=Math.hypot(a,c,p);return[a/d,c/d,p/d]}),s=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=new Map,n=(a,c)=>{let p=a<c?`${a}_${c}`:`${c}_${a}`,d=i.get(p);if(d!==void 0)return d;let[u,_,b]=e[a],[g,w,C]=e[c],k=(u+g)/2,v=(_+w)/2,H=(b+C)/2,T=Math.hypot(k,v,H);return e.push([k/T,v/T,H/T]),i.set(p,e.length-1),e.length-1};for(let a=0;a<l;a++){let c=[];for(let[p,d,u]of s){let _=n(p,d),b=n(d,u),g=n(u,p);c.push([p,_,g],[d,b,_],[u,g,b],[_,b,g])}s=c}let o=new Set,r=[];for(let a of s)for(let c=0;c<3;c++){let p=a[c],d=a[(c+1)%3],u=p<d?p*1e5+d:d*1e5+p;o.has(u)||(o.add(u),r.push(p,d))}return{verts:e,edges:r}},fe=Ns(3),qs=(()=>{let l=_e(11073),t=fe.verts.length,e=[];for(let s=0;s<16;s++)e.push({v:Math.floor(l()*t),tw:.5+l()*1.6,ph:l()*6.28});return e})(),rt=96,hs=.55,cs=.45,Nt=[{r:.625,amp:.068,thick:.007,rev:-.8,share:.21,glow:.72},{r:.655,amp:.075,thick:.008,rev:-.8,share:.21,glow:.85},{r:.845,amp:.082,thick:.009,rev:1,share:.3,glow:1.2},{r:.875,amp:.09,thick:.008,rev:1,share:.28,glow:1.4}],at=128,Ds=(()=>{let l=_e(51729),t=[];for(let e=0;e<5;e++)t.push({a:l()*Math.PI*2,w:(.08+l()*.22)*(e%2?-1:1),sg:.2+l()*.3,h:.6+l()*.7,f:.25+l()*.6,ph:l()*Math.PI*2});return t})(),us=(()=>{let t=Math.sqrt(3)*5,e=(s,i)=>{let n="";for(let o=0;o<6;o++){let r=o*60*Math.PI/180;n+=`${o===0?"M":"L"}${ue(s+5*Math.cos(r))} ${ue(i+5*Math.sin(r))}`}return n+"Z"};return[e(0,0),e(3*5,0),e(0,t),e(3*5,t),e(1.5*5,t/2)].join("")})(),lt={w:15,h:ue(Math.sqrt(3)*5)},Bs=l=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${lt.w}" height="${lt.h}" viewBox="0 0 ${lt.w} ${lt.h}"><path d="${us}" fill="none" stroke="${l}" stroke-width="0.35"/></svg>`)+'")',ds=l=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(l).trim());if(t){let s=t[1];s.length===3&&(s=s.split("").map(n=>n+n).join(""));let i=parseInt(s,16);return[i>>16&255,i>>8&255,i&255]}let e=/rgba?\(([^)]+)\)/i.exec(String(l));if(e){let s=e[1].split(",").map(i=>parseFloat(i));return[s[0]|0,s[1]|0,s[2]|0]}return[53,224,255]},kt=class extends F{set hass(t){if(this._hass=t,!this._config)return;let e=t?.states?.[this._config.entity],s=e?e.state:"unavailable",i=this._state;if(s!==this._state&&(this._state=s),this._config.build_entity){let d=t?.states?.[this._config.build_entity]?.state==="on";this._config.build_page?(this._entityOn&&!d&&this._navigate(this._config.build_return),this._entityOn=d):d!==this._build&&this._setBuild(d,!1)}let n=t?.states?.[this._config.announce_entity],o=n?n.state==="on":null;o!==this._announce&&(this._announce=o);let r=t?.states?.[this._config.messages_entity],a=r?r.state==="on":null;a!==this._messages&&(this._messages=a);let c=this._config.follow_media_player?this._resolveMediaPlayer(t):null,p=c?t?.states?.[c]?.state:void 0;p!==this._mp&&(this._mp=p),this._audioSync(c?t?.states?.[c]:null),this._state==="responding"&&i!=="responding"&&this._grabTtsUrl(),this._sessTimer||(this._sessTimer=setInterval(()=>this._pollSessions(),12e3),this._pollSessions())}_trackDone(t){this._unread||(this._unread=new Set(this._recall("unread",24*3600*1e3)||[]),this._wasBusy=new Map);let e=new Set;for(let s of t){e.add(s.id);let i=this._build&&this._sel===s.id;s.busy||i?this._unread.delete(s.id):this._wasBusy.get(s.id)&&this._unread.add(s.id),this._wasBusy.set(s.id,!!s.busy),s.done=this._unread.has(s.id)}for(let s of[...this._unread])e.has(s)||this._unread.delete(s);for(let s of[...this._wasBusy.keys()])e.has(s)||this._wasBusy.delete(s);return this._store("unread",[...this._unread]),t}async _pollSessions(){if(!(this._build||this._onScreen===!1||!this._hass))try{let t=await this._api("agent_status");this._sessions=this._trackDone(t.sessions||[]),t.projects&&(this._projects=t.projects)}catch{}}_resolveMediaPlayer(t){if(this._config.media_player)return this._config.media_player;if(this._mpResolved!==void 0)return this._mpResolved;let e=null,s=t?.entities?.[this._config.entity]?.device_id;if(s&&t.entities){for(let i in t.entities)if(i.startsWith("media_player.")&&t.entities[i].device_id===s){e=i;break}}if(!e){let n=`media_player.${this._config.entity.split(".")[1].replace(/_assist_satellite$/,"")}_media_player`;t?.states?.[n]&&(e=n)}return this._mpResolved=e,e}_effectiveState(){if(this._voiceState)return this._voiceState==="responding"&&this._envEl&&!this._envEl.currentTime?"processing":this._voiceState;let t=Os.includes(this._state)?this._state:"offline",e=this._speechRaw(t);return this._speaking(e)?"responding":e||t==="responding"?"processing":t}_speechRaw(t){let e=this._mp;return e==="playing"?t!=="listening":e==="idle"||e==="paused"?!1:t==="responding"}_speaking(t){let e=Math.max(0,-(Number(this._config.audio_offset)||0));if(!e)return t;let s=performance.now()/1e3;return t!==this._spkRaw&&(this._spkRaw=t,this._spkAt=s),s-(this._spkAt??-1e9)<e?!t:t}get hass(){return this._hass}get _name(){return this._config?.assistant_name||"Assistant"}setConfig(t){if(!t||!t.entity)throw new Error("hubbubb-ring-card: you need to define an `entity`");if(t.entity.split(".")[0]!==qt)throw new Error(`hubbubb-ring-card: entity must be in the ${qt} domain`);this._config={...de,...t},this._particles=null,this._mpResolved=void 0,t.build_page&&this._setBuild(!0,!1),this._hass&&(this.hass=this._hass)}getCardSize(){return Math.max(2,Math.ceil(Number(this._config?.size??240)/50))}getGridOptions(){return{rows:Math.max(2,Math.ceil(Number(this._config?.size??240)/56)),columns:12,min_rows:2,min_columns:6}}_cardVars(t){let e=this._config,s=n=>Number(n)>0?`${Number(n)}px`:"",i={"--jr-size":`${Number(e.size)}px`,"--jr-color":t,"--jr-panel-h":e.panel_height==="fill"?"100%":s(e.panel_height),"--jr-panel-bg":e.panel_bg,"--jr-panel-border":e.panel_border,"--jr-panel-text":e.panel_text,"--jr-term-bg":e.terminal_bg,"--jr-term-text":e.terminal_text};return Object.entries(i).filter(([,n])=>n).map(([n,o])=>`${n}:${o}`).join(";")}static getConfigElement(){return document.createElement("hubbubb-ring-card-editor")}static getStubConfig(t){let e=Object.keys(t?.states??{}),s=r=>e.find(a=>a.startsWith("switch.")&&a.endsWith(r))??"",i=s("_build_mode"),o=i.slice(7,-11).split("_").filter(Boolean).map(r=>r[0].toUpperCase()+r.slice(1)).join(" ");return{type:"custom:hubbubb-ring-card",entity:e.find(r=>r.split(".")[0]===qt)??"",...o&&{assistant_name:o},...i&&{build_entity:i},...s("_agent_announcements")&&{announce_entity:s("_agent_announcements")},...s("_message_watch")&&{messages_entity:s("_message_watch")}}}connectedCallback(){super.connectedCallback(),this._onVisibility=()=>this._pump(),document.addEventListener?.("visibilitychange",this._onVisibility),this._onHide=()=>{this._saveDraft(),this._saveQueue()},window.addEventListener?.("pagehide",this._onHide),this._restoreQueue(),this._build&&this._setBuild(!0,!1)}disconnectedCallback(){super.disconnectedCallback(),this._saveDraft(),this._saveQueue(),this._lockScroll(!1),document.removeEventListener?.("visibilitychange",this._onVisibility),window.removeEventListener?.("pagehide",this._onHide),this._stop(),this._stopPolling(),this._stopLocalVoice(),clearInterval(this._sessTimer),this._sessTimer=null,this._io?.disconnect(),this._ro?.disconnect(),this._io=this._ro=null,this._canvas=null,this._ctx=null}_navigate(t){!t||location.pathname.startsWith(t.split("?")[0])||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")))}_toggleAnnounce(){this._toggleHelper(this._config.announce_entity,"_announce",`${this._name} finishes: spoken on the puck`,`${this._name} finishes: phone only`)}_toggleMessages(){this._toggleHelper(this._config.messages_entity,"_messages","Hubbubb messages: read out as they arrive","Hubbubb messages: quiet")}_toggleHelper(t,e,s,i){let n=this[e]===!0;this[e]=!n,this._hass.callService("homeassistant",n?"turn_off":"turn_on",{entity_id:t}),this._toast(n?i:s)}_setBuild(t,e=!0){if(e&&this._config.build_entity&&this._hass&&this._hass.callService("homeassistant",t?"turn_on":"turn_off",{entity_id:this._config.build_entity}),this._config.build_dashboard){let s=this._build;this._build=t,t&&(e||s===!1)&&this._navigate(this._config.build_dashboard);return}if(this._config.build_page&&!t){this._navigate(this._config.build_return);return}this._build=t,t?(this._err="",this._poll(),this._startPolling(),!this._vvHandler&&window.visualViewport&&(this._vvHandler=()=>this._vvSync(),window.visualViewport.addEventListener("resize",this._vvHandler),window.visualViewport.addEventListener("scroll",this._vvHandler)),this._vvSync(),this._lockScroll(!0)):(this._stopPolling(),this._lockScroll(!1),this._sel=null,this._msgs=null,this._ask=null,this._activity=null,this._confirmKill=null,this._picking=!1,this._details=!1,this._swipe=null,this._vvHandler&&window.visualViewport&&(window.visualViewport.removeEventListener("resize",this._vvHandler),window.visualViewport.removeEventListener("scroll",this._vvHandler),this._vvHandler=null))}_lockScroll(t){if(!this._config?.build_page)return;let e=document.documentElement,s=document.body;s&&(t?(this._prevOverflow===void 0&&(this._prevOverflow=s.style.overflow,this._prevOverscroll=e.style.overscrollBehavior,this._prevHtmlOverflow=e.style.overflow),s.style.overflow="hidden",e.style.overflow="hidden",e.style.overscrollBehavior="none"):this._prevOverflow!==void 0&&(s.style.overflow=this._prevOverflow,e.style.overflow=this._prevHtmlOverflow,e.style.overscrollBehavior=this._prevOverscroll,this._prevOverflow=this._prevOverscroll=void 0,this._prevHtmlOverflow=void 0))}_syncCorner(t){window.innerWidth!==this._vvW&&(this._vvW=window.innerWidth,this._vvMax=t),this._vvMax=Math.max(this._vvMax||0,t);let e=t>=this._vvMax-4;this.style.setProperty("--jr-botr",e?"56px":"16px")}_vvSync(){let t=window.visualViewport;if(!t)return;let e=Math.round(t.height),s=Math.round(t.offsetTop),i=e!==this._vvH;i&&(this._vvH=e,this.style.setProperty("--jr-vvh",`${e}px`),this._syncCorner(e)),(i||this._vvT==null)&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`),i&&this._settlePin());let n=this._vvPrev==null?0:Math.abs(e-this._vvPrev),o=this._vvPrev==null;if(this._vvPrev=e,!o&&n<12)return;let r=this._growCap();r!==this._lastCap&&(this._lastCap=r,this._autoGrow(this._composerEl())),this._stick&&requestAnimationFrame(()=>{let a=this.renderRoot?.querySelector(".log");a&&(a.scrollTop=a.scrollHeight)})}_settlePin(){clearTimeout(this._settleA),clearTimeout(this._settleB);let t=()=>{this._unscroll();let e=window.visualViewport;if(!e)return;let s=Math.round(e.offsetTop);s!==this._vvT&&(this._vvT=s,this.style.setProperty("--jr-vvt",`${s}px`))};requestAnimationFrame(t),this._settleA=setTimeout(t,200),this._settleB=setTimeout(t,500)}_unscroll(){if(!this._build)return;window.scrollTo(0,0),document.scrollingElement&&(document.scrollingElement.scrollTop=0);let t=this.parentNode;for(;t;)t.scrollTop>0&&(t.scrollTop=0),t=t.parentNode||t.host}_startPolling(){let t=this._sel?1200:2500;this._pollTimer&&this._pollMs===t||(this._pollTimer&&clearInterval(this._pollTimer),this._pollMs=t,this._pollTimer=setInterval(()=>this._poll(),t))}_stopPolling(){this._pollTimer&&clearInterval(this._pollTimer),this._pollTimer=null,this._pollMs=null}_errText(t){return typeof t=="number"?Us[t]||`websocket error ${t}`:String(t?.message||t)}async _api(t,e={}){let s=await this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:t,service_data:e,return_response:!0}),i=s?.response?.content;if(typeof i=="string")try{i=JSON.parse(i)}catch{}let n=s?.response?.status??0;if(n<200||n>=300||i?.ok===!1)throw new Error(i?.detail||i?.error||`HTTP ${n}`);return i||{}}async _poll(){if(!(!this._build||!this._hass)){if(this._polling){this._pollAgain=!0;return}this._polling=!0;try{let t=await this._api("agent_status");if(this._sessions=this._trackDone(t.sessions||[]),this._projects=t.projects||[],this._sel&&!this._sessions.some(e=>e.id===this._sel))this._sel=null,this._msgs=null,this._store("sel",null);else if(!this._sel&&!this._restored){this._restored=!0;let e=this._recall("sel",12*3600*1e3);e&&this._sessions.some(s=>s.id===e)&&this._select(e)}if(this._sel){let e=await this._api("agent_transcript",{id:this._sel,have:this._msgs==null?0:this._tbytes||0});this._tbytes=e.bytes||0;let s=e.messages;s!=null&&!this._sameMsgs(s,this._msgs)&&(this._msgs=s),this._activity=e.activity||null;let i=e.ask?JSON.stringify(e.ask.options.map(n=>n.label)):null;if(i!==this._askSig&&(this._askSig=i,this._askSent=null),this._ask=e.ask||null,this._queue?.length){let n=new Set((this._msgs||[]).filter(r=>r.role==="user").map(r=>this._collapse(r.text))),o=this._queue.length;this._queue=this._queue.filter(r=>r.state!=="sent"||!n.has(this._collapse(r.text))&&Date.now()-r.at<6e5),this._queue.length!==o&&this._saveQueue()}}this._err=""}catch(t){this._err=this._errText(t)}if(this._polling=!1,this._pollAgain)return this._pollAgain=!1,this._poll();this._drainQueue()}}_drainQueue(){if(!this._sel||this._pending)return;let t=(this._queue||[]).filter(s=>s.id===this._sel);if(t.some(s=>s.state==="sent"))return;let e=t.find(s=>s.state==="held");e&&((this._sessions||[]).find(s=>s.id===this._sel)?.busy||this._dispatch(e))}_select(t){if(this._sel&&this._sel!==t&&this._saveDraft(),this._sel=t,this._restored=!0,t&&this._unread?.delete(t)){this._store("unread",[...this._unread]);let e=(this._sessions||[]).find(s=>s.id===t);e&&(e.done=!1)}this._store("sel",t||null),this._msgs=null,this._ask=null,this._askSent=null,this._askSig=void 0,this._activity=null,this._startPolling(),this._confirmKill=null,this._details=!1,this._swipe=null,this._stick=!0,this._poll(),t&&this._api("agent_target_window",{id:t}).catch(()=>{})}_store(t,e){try{let s=`jrc:${t}`;e==null?localStorage.removeItem(s):localStorage.setItem(s,JSON.stringify({v:e,at:Date.now()}))}catch{}}_recall(t,e){try{let s=localStorage.getItem(`jrc:${t}`);if(!s)return null;let{v:i,at:n}=JSON.parse(s);return!n||Date.now()-n>e?(localStorage.removeItem(`jrc:${t}`),null):i}catch{return null}}_body(t){if(Is.has(t.role))return t.text.split(`
`).map(i=>y`<div class="${Hs(i)}">${i||" "}</div>`);if(t.role!=="assistant")return t.text;let e=[],s=0;for(let i of t.text.matchAll(Ls))i.index>s&&e.push(t.text.slice(s,i.index)),e.push(i[1]?y`<code>${i[1]}</code>`:y`<b>${i[2]}</b>`),s=i.index+i[0].length;return e.push(t.text.slice(s)),e}_sameMsgs(t,e){if(!t||!e||t.length!==e.length)return!1;let s=t[t.length-1],i=e[e.length-1];return s?.role===i?.role&&s?.text===i?.text}_collapse(t){return t.split(/\s+/).join(" ")}_composerEl(){return this.renderRoot?.querySelector(".composer textarea")}_growCap(){let t=this._vvH||window.visualViewport?.height||window.innerHeight;return Math.max(56,Math.min(190,Math.round(t*.32)))}_autoGrow(t){if(!t)return;let e=t.style.height,s=t.scrollTop;t.style.height="auto";let i=Math.min(t.scrollHeight,this._growCap())+"px";return t.style.height=i,t.scrollTop!==s&&(t.scrollTop=s),i!==e}_saveDraft(t=this._sel){if(!t)return;let e=this._composerEl();e&&this._store(`draft:${t}`,e.value||null),this._store(`files:${t}`,this._files?.length?this._files:null)}_restoreDraft(){if(!this._sel)return;this._files=this._recall(`files:${this._sel}`,12*3600*1e3)||[];let t=this._composerEl();if(!t||t.value)return;let e=this._recall(`draft:${this._sel}`,12*3600*1e3);e&&(t.value=e,this._autoGrow(t))}_saveQueue(){let t=(this._queue||[]).filter(e=>e.state==="held");this._store("queue",t.length?t:null)}_restoreQueue(){let t=this._recall("queue",216e5);Array.isArray(t)&&t.length&&(this._queue=t.map(e=>({...e,state:"held"})))}async _send(t){t.preventDefault();let e=this._composerEl(),s=e?.value.trim(),i=this._files||[];if(!s&&!i.length||this._sel==null)return;let n=[...i.map(r=>r.path),s].filter(Boolean).join(" ");e.value="",e.style.height="",this._files=[],this._saveDraft();let o={id:this._sel,text:n,at:Date.now(),state:"held"};this._queue=[...this._queue||[],o],this._saveQueue(),this._stick=!0,(this._sessions||[]).find(r=>r.id===this._sel)?.busy||this._dispatch(o)}async _dispatch(t){if(!this._pending){this._pending=!0,t.state="sent",this._queue=[...this._queue],this._saveQueue();try{await this._api("agent_prompt_direct",{id:t.id,text:t.text}),this._err=""}catch(e){this._err=this._errText(e),t.state="held",this._queue=[...this._queue],this._saveQueue()}this._pending=!1,this._poll()}}_editQueued(t){let e=this._composerEl();e&&(e.value=e.value.trim()?`${e.value.trim()} ${t.text}`:t.text,this._dropQueued(t),e.focus(),this._autoGrow(e),this._saveDraft())}_dropQueued(t){this._queue=(this._queue||[]).filter(e=>e!==t),this._saveQueue()}async _attach(t){let e=[...t.target.files||[]];return t.target.value="",this._ingest(e)}async _ingest(t){if(!(!t.length||!this._sel)){this._uploading=!0;for(let e of t)try{let{name:s,data:i}=await this._encodeFile(e),n=await this._api("agent_upload",{name:s,data:i});if(!n?.path)throw new Error(n?.detail||"upload refused");this._files=[...this._files||[],{name:e.name,path:n.path}],this._err=""}catch(s){this._err=`${e.name}: ${this._errText(s)}`}this._uploading=!1,this._saveDraft()}}_encodeFile(t){let e=i=>new Promise((n,o)=>{let r=new FileReader;r.onerror=()=>o(new Error("could not read that file")),r.onload=()=>n(String(r.result).split(",")[1]||""),r.readAsDataURL(i)});if(!t.type.startsWith("image/"))return e(t).then(i=>({name:t.name,data:i}));let s=1568;return new Promise((i,n)=>{let o=new Image,r=URL.createObjectURL(t);o.onerror=()=>{URL.revokeObjectURL(r),e(t).then(a=>i({name:t.name,data:a}),n)},o.onload=()=>{URL.revokeObjectURL(r);let a=Math.min(1,s/Math.max(o.width,o.height));if(a===1&&t.size<9e5)return e(t).then(p=>i({name:t.name,data:p}),n);let c=document.createElement("canvas");c.width=Math.round(o.width*a),c.height=Math.round(o.height*a),c.getContext("2d").drawImage(o,0,0,c.width,c.height),c.toBlob(p=>{if(!p)return n(new Error("could not encode that image"));let d=t.name.replace(/\.[^.]+$/,"")+".jpg";e(p).then(u=>i({name:d,data:u}),n)},"image/jpeg",.85)},o.src=r})}_dropFile(t){this._files=(this._files||[]).filter(e=>e!==t),this._saveDraft()}async _sendKey(t){if(this._sel){this._askSent=t;try{await this._api("agent_key",{id:this._sel,key:t}),this._err=""}catch(e){this._err=this._errText(e),this._askSent=null;return}this._poll()}}async _killSession(t){if(t){if(this._confirmKill!==t){this._confirmKill=t,clearTimeout(this._confirmT),this._confirmT=setTimeout(()=>this._confirmKill=null,4e3);return}clearTimeout(this._confirmT),this._confirmKill=null;try{await this._api("agent_kill",{id:t}),this._swipe=null,this._store(`draft:${t}`,null),this._queue=(this._queue||[]).filter(e=>e.id!==t),this._saveQueue(),this._sel===t&&(this._sel=null,this._msgs=null,this._store("sel",null)),this._poll()}catch(e){this._err=this._errText(e)}}}_rowTap(t){if(this._swipe===t){this._swipe=null,this._confirmKill=null;return}if(this._swipe){this._swipe=null,this._confirmKill=null;return}this._swiped||this._select(t)}_swipeStart(t,e){let s=t.touches?.[0];s&&(this._sx=s.clientX,this._sy=s.clientY,this._swiped=!1)}_swipeMove(t,e){let s=t.touches?.[0];if(!s||this._sx==null)return;let i=s.clientX-this._sx,n=s.clientY-this._sy;Math.abs(n)>Math.abs(i)||(i<-12?(this._swiped=!0,this._swipe!==e&&(this._swipe=e)):i>12&&this._swipe===e&&(this._swiped=!0,this._swipe=null,this._confirmKill=null))}_swipeEnd(){this._sx=this._sy=null,setTimeout(()=>this._swiped=!1,50)}async _newSession(t){this._picking=!1,this._pending=!0;try{await this._api("agent_start_session",{project:t}),this._err="";for(let e=0;e<20;e++){await this._poll();let s=(this._sessions||[]).find(i=>i.target);if(s){this._select(s.id);break}await new Promise(i=>setTimeout(i,600))}}catch(e){this._err=this._errText(e)}this._pending=!1}_openAssist(){let t=this._hass?.auth?.external;if(t?.config?.hasAssist){t.fireMessage({type:"assist/show"});return}pe(this,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>customElements.whenDefined("ha-voice-command-dialog"),dialogParams:{pipeline_id:"last_used",start_listening:!0}})}_wakePuck(){let t;try{t=this._hass?.callService("assist_satellite","start_conversation",{entity_id:this._config.entity,start_message:this._config.tap_message,preannounce:!1},void 0,!1)}catch{return this._openAssist()}Promise.resolve(t).catch(()=>this._openAssist())}async _startLocalVoice(t="converse"){if(this._voice)return!0;let e;try{e=await navigator.mediaDevices.getUserMedia({audio:!0})}catch{return"microphone permission denied"}let s=window.AudioContext||window.webkitAudioContext,i;try{i=new s({sampleRate:16e3})}catch{i=new s}let n=null;t==="converse"&&(n=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="),n.play().catch(()=>{}));let o=this._voice={mode:t,stream:e,ctx:i,audio:n,proc:null,src:null,handlerId:null,unsub:null};t==="converse"?this._voiceState="listening":this._dictating=!0;let r=this._recall("conv",5*60*1e3);try{o.unsub=await this._hass.connection.subscribeMessage(p=>this._voiceEvent(p),{type:"assist_pipeline/run",start_stage:"stt",end_stage:t==="dictate"?"stt":"tts",input:{sample_rate:i.sampleRate},...r?{conversation_id:r}:{}})}catch{return this._stopLocalVoice(),"assist pipeline refused the run"}let a=o.src=i.createMediaStreamSource(e),c=o.proc=i.createScriptProcessor(2048,1,1);return c.onaudioprocess=p=>{if(o.handlerId==null)return;let d=p.inputBuffer.getChannelData(0),u=new Uint8Array(1+d.length*2);u[0]=o.handlerId;let _=new DataView(u.buffer,1);for(let b=0;b<d.length;b++){let g=Math.max(-1,Math.min(1,d[b]));_.setInt16(b*2,g<0?g*32768:g*32767,!0)}try{this._hass.connection.socket.send(u)}catch{}},a.connect(c),c.connect(i.destination),!0}_voiceEvent(t){let e=this._voice;if(e)switch(t.type){case"run-start":e.handlerId=t.data?.runner_data?.stt_binary_handler_id??null;break;case"intent-end":{let s=t.data?.intent_output?.conversation_id;s&&this._store("conv",s);break}case"stt-end":if(e.mode==="dictate"){let s=t.data?.stt_output?.text||"",i=this.renderRoot?.querySelector(".composer textarea");i&&s&&(i.value=(i.value?i.value.trim()+" ":"")+s,i.focus()),s||this._toast("Didn't catch that."),this._stopLocalVoice()}else this._closeMic(),this._voiceState="processing";break;case"tts-end":{let s=t.data?.tts_output?.url;if(!s)return this._stopLocalVoice();this._voiceState="responding",e.audio.onended=()=>this._stopLocalVoice(),e.audio.onerror=()=>this._stopLocalVoice(),this._envEl=e.audio,this._envUrl=s,this._env=null,this._decodeAudio(s),e.audio.src=s,e.audio.play().catch(()=>this._stopLocalVoice());break}case"error":e.mode==="dictate"&&this._toast("Didn't catch that."),this._stopLocalVoice();break;case"run-end":this._voiceState!=="responding"&&this._stopLocalVoice();break}}_closeMic(){let t=this._voice;t&&(t.proc?.disconnect(),t.src?.disconnect(),t.stream?.getTracks().forEach(e=>e.stop()),t.ctx?.close().catch(()=>{}),t.proc=t.src=null)}_stopLocalVoice(){let t=this._voice;if(t){this._closeMic(),this._dictating=!1;try{t.audio?.pause()}catch{}try{t.unsub?.()}catch{}this._voice=null,this._voiceState=null,this._envEl=null,this._env=null,this._envUrl=null}}_toast(t){pe(this,"hass-notification",{message:t})}get _canMic(){return!!(window.isSecureContext&&navigator.mediaDevices?.getUserMedia)}async _composerMic(){if(this._voice)return this._voice.mode==="dictate"?this._endSpeech():this._stopLocalVoice();if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){this._toast("Voice input needs the https (Nabu Casa) URL.");return}let t=await this._startLocalVoice("dictate");t!==!0&&this._toast(`Couldn't start voice input (${t}).`)}_endSpeech(){let t=this._voice;if(!t||t.handlerId==null)return this._stopLocalVoice();t.proc?.disconnect(),t.src?.disconnect(),t.mode==="converse"&&(this._voiceState="processing");try{this._hass.connection.socket.send(new Uint8Array([t.handlerId]))}catch{this._stopLocalVoice()}}async _ringTap(){if(this._voice)return this._voiceState==="listening"?this._endSpeech():this._stopLocalVoice();if(this._effectiveState()==="responding"){let e=this._resolveMediaPlayer(this._hass);if(e){this._hass.callService("media_player","media_stop",{entity_id:e});return}}if(!window.isSecureContext){this._wakePuck();return}if(!navigator.mediaDevices?.getUserMedia){this._toast(`This browser exposes no microphone \u2014 waking ${this._name} instead.`),this._wakePuck();return}let t=await this._startLocalVoice();t!==!0&&(this._toast(`Couldn't use this device's mic (${t}) \u2014 waking ${this._name} instead.`),this._wakePuck())}firstUpdated(){this._setupCanvas()}updated(t){if(this._setupCanvas(),t.has("_sel")&&this._sel&&this._restoreDraft(),t.has("_msgs")&&this._stick){let e=this.renderRoot.querySelector(".log");e&&(e.scrollTop=e.scrollHeight)}}_setupCanvas(){let t=this.renderRoot?.querySelector("canvas");if(!t){this._stop(),this._canvas=null;return}if(t!==this._canvas){this._canvas=t;try{this._ctx=t.getContext("2d")}catch{this._ctx=null}if(!this._ctx)return;this._t=0,this._waveT=0,this._churnT=0,this._peaks=Ds.map(e=>({...e})),this._spin=0,this._head=0,this._speech={t:0,next:0,env:0,count:0,syl:null,pulses:[],spikes:[]},this._cur={...ls.idle},this._rgb=ds(this._config?.idle_color??"#3db4c8"),this._observe()}this._ctx&&(this._measure(),this._pump())}_observe(){typeof ResizeObserver<"u"&&(this._ro?.disconnect(),this._ro=new ResizeObserver(()=>this._measure()),this._ro.observe(this._canvas)),typeof IntersectionObserver<"u"?(this._io?.disconnect(),this._io=new IntersectionObserver(t=>{this._onScreen=t.some(e=>e.isIntersecting),this._pump()}),this._io.observe(this._canvas)):this._onScreen=!0}_measure(){let t=this._canvas;if(!t||!this._ctx)return;let e=t.clientWidth||Number(this._config?.size)||240,s=t.clientHeight||e,i=(this._perf?.q??1)<.75?1:2,n=st(window.devicePixelRatio||1,1,i);this._w===e&&this._h===s&&this._dpr===n&&this._particles||(this._w=e,this._h=s,this._dpr=n,t.width=Math.round(e*n),t.height=Math.round(s*n),this._ctx.setTransform(n,0,0,n,0,0),this._buildField())}_buildField(){let t=Number(this._config?.particles)||0,e=st(Math.round((this._w||240)*32),9e3,2e4),s=t>0?st(t,0,8e3):e,i=Math.max(400,Math.round(s*(this._perf?.q??1))),n=_e(24301),o=new Array(i),r=0,a=Math.round(i*Nt[0].share);for(let c=0;c<i;c++){a--<=0&&r<Nt.length-1&&(r++,a=Math.round(i*Nt[r].share));let p=(n()+n()-1)*(n()<.04?4:1),d=(n()+n()-1)*1.05;o[c]={ri:r,lon:n()*Math.PI*2,sinLat:Math.sin(d),cosLat:Math.cos(d),off:p,drift:(n()-.5)*.13,tw:.5+n()*2,ph:n()*Math.PI*2,bobA:.1+n()*.25,bobW:.25+n()*.85,bobP:n()*Math.PI*2,wobA:.006+n()*.02,wobW:.4+n()*1.2,wobP:n()*Math.PI*2,lf:5+n()*7,lt:n()*12,sz:n()<.03?2.1+n()*1.1:.8+n()*.85,halo:n()<.05,br:n()<.04?1:.45+n()*.55}}this._particles=o}_audioSync(t){if(!t||t.state!=="playing"){this._env=null,this._envUrl=null;return}let e=t.attributes||{},s=String(e.media_content_id||""),i=/^https?:\/\//.test(s)||s.startsWith("/")?s:null,n=Date.parse(e.media_position_updated_at||t.last_changed||"");this._envAt=Number.isFinite(n)?n:Date.now(),this._envPos=Number(e.media_position)||0,!(!i||i===this._envUrl)&&(this._envUrl=i,this._env=null,i&&!(Number(e.media_duration)>60)&&this._decodeAudio(i))}async _pipelineId(t){if(this._pipeId!==void 0)return this._pipeId;this._pipeId=null;let e=await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline/list"}),s=await t.connection.sendMessagePromise({type:"assist_pipeline/device/list"}),i=t.entities?.[this._config.entity]?.device_id,n=s?.find(c=>c.device_id===i)?.pipeline_entity,o=n?t.states?.[n]?.state:null,r=e?.pipelines||[],a=r.find(c=>c.name===o)||r.find(c=>c.id===e?.preferred_pipeline);return this._pipeId=a?.id||null,this._pipeId}async _grabTtsUrl(){let t=this._hass;if(!(!t?.connection||this._grabbing)){this._grabbing=!0;try{let e=await this._pipelineId(t);if(!e)return;for(let s=0;s<3;s++){let n=((await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/list",pipeline_id:e}))?.pipeline_runs||[]).reduce((o,r)=>!o||r.timestamp>o.timestamp?r:o,null);if(n&&Date.now()-Date.parse(n.timestamp)<6e4){let r=(await t.connection.sendMessagePromise({type:"assist_pipeline/pipeline_debug/get",pipeline_id:e,pipeline_run_id:n.pipeline_run_id}))?.events||[];for(let a=r.length-1;a>=0;a--){let c=r[a]?.type==="tts-end"&&r[a]?.data?.tts_output?.url;if(c){this._envUrl=c,this._env=null,await this._decodeAudio(c);return}}}await new Promise(o=>setTimeout(o,250))}}catch{this._pipeId=void 0}finally{this._grabbing=!1}}}async _decodeAudio(t){try{let e=await(await fetch(t)).arrayBuffer(),s=window.AudioContext||window.webkitAudioContext;if(!s)return;let n=await(this._actx||(this._actx=new s)).decodeAudioData(e);if(t!==this._envUrl)return;this._env=ts(n.getChannelData(0),n.sampleRate,ps)}catch{this._env=null}}_audioLevel(){let t=this._env,e=this._envEl;if(e)return e.currentTime?t?rs(t,e.currentTime):null:0;if(!t||this._mp!=="playing")return null;let s=this._envPos+(Date.now()-this._envAt)/1e3+(Number(this._config.audio_offset)||0);return rs(t,s)}_sylShapes(t,e){let s=this._speech;s.pulses.push({born:s.t,amp:t}),s.pulses.length>6&&s.pulses.shift();let i=Math.random()*6.283185;s.spikes.push({a:i,sg:.1+Math.random()*.08,h:.06+t*.06,born:s.t,dur:.12+Math.random()*.08},{a:i+(Math.random()-.5)*.6,sg:.22+Math.random()*.18,h:.04+t*.05,born:s.t+.04,dur:e*(.9+Math.random()*.4)}),s.spikes.length>14&&s.spikes.splice(0,s.spikes.length-14)}_speechTick(t){let e=this._speech;e.t+=t;let s=this._audioLevel();if(s!=null){s>.2&&s>(e.last||0)*1.4&&(e.count++,e.syl={start:e.t,dur:.22,peak:s,f:5+s*4},this._sylShapes(s,.22)),e.last=s,e.live=!0;let r=s>e.env?.05:.14;e.env+=(s-e.env)*(1-Math.exp(-t/r)),e.env>1&&(e.env=1);return}if(e.live=!1,e.t>=e.next){let r=.22+Math.random()*.26,a=.5+Math.random()*.5;e.syl={start:e.t,dur:r,peak:a,f:5+Math.random()*4},e.count++;let c=.02+Math.random()*.05;e.count%(5+Math.floor(Math.random()*6))===0&&(c+=.14+Math.random()*.26),e.next=e.t+r+c,this._sylShapes(a,r)}let i=0,n=e.syl;if(n){let r=(e.t-n.start)/n.dur;r>=0&&r<=1&&(i=n.peak*1.2*(.5-.5*Math.cos(2*Math.PI*r)))}let o=i>e.env?.22:.5;e.env+=(i-e.env)*(1-Math.exp(-t/o)),e.env>1&&(e.env=1)}_pulseTable(t){let e=this._ptab||(this._ptab=new Float32Array(rt));if(e.fill(0),t<.01)return e;let s=this._speech;for(let i of s.pulses){let n=s.t-i.born;if(n>2.4)continue;let o=.58+n*.26,r=i.amp*Math.exp(-n/1)*t;for(let a=0;a<rt;a++){let c=hs+a/(rt-1)*cs-o;e[a]+=r*Math.exp(-(c*c)/.0055)}}return e}_peakTable(t,e,s){let i=this._ktab||(this._ktab=new Float32Array(at));i.fill(0);let n=this._t,o=.05*e.amp+.08*s;for(let a of this._peaks){a.a+=t*a.w*(.6+e.swirl);let c=.35+.65*(.5+.5*Math.sin(n*a.f+a.ph)),p=a.h*c*o;if(p<.002)continue;let d=a.sg*(1-.4*s),u=2*d*d;for(let _=0;_<at;_++){let b=_/at*6.283185-a.a;b=(b%6.283185+6.283185)%6.283185,b>3.141593&&(b-=6.283185),i[_]+=p*Math.exp(-(b*b)/u)}}let r=this._speech;for(let a=r.spikes.length-1;a>=0;a--){let c=r.spikes[a],p=r.t-c.born;if(p>c.dur+.3){r.spikes.splice(a,1);continue}if(p<0)continue;let d=p<.12?p/.12:1,u=p>c.dur?Math.exp(-(p-c.dur)/.3):1,_=c.h*d*u*e.speech;if(_<.003)continue;let b=2*c.sg*c.sg;for(let g=0;g<at;g++){let w=g/at*6.283185-c.a;w=(w%6.283185+6.283185)%6.283185,w>3.141593&&(w-=6.283185),i[g]+=_*Math.exp(-(w*w)/b)}}return i}_sprite(t,e,s){let i=t<<16|e<<8|s;if(this._sprKey===i)return this._spr;let n=this._spr||(this._spr=document.createElement("canvas"));n.width=n.height=32;let o=n.getContext("2d");o.clearRect(0,0,32,32);let r=o.createRadialGradient(16,16,0,16,16,16);return r.addColorStop(0,`rgba(${t},${e},${s},0.75)`),r.addColorStop(.4,`rgba(${t},${e},${s},0.3)`),r.addColorStop(1,`rgba(${t},${e},${s},0)`),o.fillStyle=r,o.fillRect(0,0,32,32),this._sprKey=i,n}_segTick(t){if(this._segRot===void 0&&(this._segRot=-Math.PI/2),this._segRot+=t*.019,this._segWave=(this._segWave||0)+t*.5,this._sessions==null)return this._ambientTick(t);let e=this._segMap||(this._segMap=new Map),s=1-Math.exp(-t/.7),i=new Set;for(let n of this._sessions){i.add(n.id);let o=e.get(n.id);o||(o={size:.02,fill:Math.random(),pulse:Math.random()*6.28,rgb:[46,157,245],gone:!1},e.set(n.id,o)),o.weight=Math.max(.8,Math.log10((n.bytes||0)+1e4)-3.2),o.busy=!!n.busy,o.done=!!n.done,o.gone=!1}for(let[n,o]of e){if(i.has(n)||(o.gone=!0),o.size+=((o.gone?0:o.weight)-o.size)*s,o.gone&&o.size<.03){e.delete(n);continue}o.pulse+=t*(o.busy?2.4:.9),o.busy&&(o.fill=(o.fill+t*.3)%1);let r=o.done?[40,226,138]:[46,157,245];for(let a=0;a<3;a++)o.rgb[a]+=(r[a]-o.rgb[a])*s}}_segBand(t){let e=Math.abs(-Math.sin(t)-Math.sin(this._segWave||0));return e>1?0:.5+.5*Math.cos(e*Math.PI)}_wash(t,e,s,i,n,o,r,a){let c=Math.max(2,Math.min(12,Math.ceil((r-o)/.1))),p=(r-o)/c;for(let d=0;d<c;d++){let u=o+d*p,_=Math.min(r,u+p);t.globalAlpha=a*(.5+1.15*this._segBand(u+p/2)),t.beginPath(),t.arc(e,s,n,u,_),t.arc(e,s,i,_,u,!0),t.closePath(),t.fill()}}_drawSegs(t,e,s,i,n,o,r){if(this._sessions==null)return this._drawAmbientSegs(t,e,s,i,n,o,r);let a=6.283185,c=i*.475,p=i*.655,d=(g,w,C,k)=>{t.beginPath(),t.arc(e,s,k,g,w),t.arc(e,s,C,w,g,!0),t.closePath()},u=this._segMap,_=0;if(u)for(let g of u.values())_+=g.size;if(!u||!u.size||_<=0){t.fillStyle=`rgb(${n},${o},${r})`,t.globalAlpha=.05,d(0,a,c,p),t.fill(),t.globalAlpha=1;return}let b=this._segRot;for(let g of u.values()){let w=g.size/_*a,C=Math.min(.035,w),k=b+C/2,v=b+w-C/2;b+=w;let H=v-k;if(!(H<.004)&&(t.fillStyle=`rgb(${Math.round(g.rgb[0])},${Math.round(g.rgb[1])},${Math.round(g.rgb[2])})`,this._wash(t,e,s,c,p,k,v,(g.busy?.22:.1)+(g.done?.07:0)),g.busy)){let T=Math.max(.1,H*.35),E=k+g.fill*H,N=14;for(let M=0;M<N;M++){let L=E-M*T/N,R=Math.max(k,L-T/N);if(L<=k)break;t.globalAlpha=.3*Math.pow(1-M/N,1.6),d(R,L,c,p),t.fill()}}}t.globalAlpha=1}_ambientTick(t){let e=this._segs;if(!e){e=this._segs=[],this._segRot=-Math.PI/2;for(let n=0;n<22;n++){let o=Math.random()<.75;e.push({size:.5+Math.random()*1.4,fill:o?1:Math.random()*.7,rate:.12+Math.random()*.3,state:o?"done":"load",doneT:Math.random()*9})}}let s=0,i=0;for(let n of e)n.state==="grow"?s++:n.state==="die"&&i++;if(!s&&e.length<26&&Math.random()<t*.5&&e.splice(Math.floor(Math.random()*(e.length+1)),0,{size:.02,target:.5+Math.random()*1.4,fill:0,rate:.12+Math.random()*.3,state:"grow",doneT:0}),i<2&&e.length>16){let n=null;for(let o of e)o.state==="done"&&o.doneT>8&&(!n||o.doneT>n.doneT)&&(n=o);n&&Math.random()<t*.25&&(n.state="die")}for(let n=e.length-1;n>=0;n--){let o=e[n];o.state==="grow"?(o.size+=t*.5,o.size>=o.target&&(o.size=o.target,o.state="load")):o.state==="load"?(o.fill+=t*o.rate,o.fill>=1&&(o.fill=1,o.state="done",o.doneT=0)):o.state==="done"?o.doneT+=t:(o.size-=t*.12,o.fill=Math.max(0,o.fill-t*.25),o.size<=.02&&e.splice(n,1))}}_drawAmbientSegs(t,e,s,i,n,o,r){let a=this._segs;if(!a||!a.length)return;let c=0;for(let k of a)c+=k.size;if(c<=0)return;let p=i*.475,d=i*.655,u=n*.5+74|0,_=o*.72+48|0,b=r*.8+82|0;t.fillStyle=`rgb(${u},${_},${b})`;let g=(k,v,H,T)=>{t.beginPath(),t.arc(e,s,T,k,v),t.arc(e,s,H,v,k,!0),t.closePath()},w=6.283185,C=this._segRot;for(let k=0;k<a.length;k++){let v=a[k],H=v.size/c*w,T=Math.min(.028,H),E=C+T/2,N=C+H-T/2;C+=H;let M=N-E;if(!(M<.004)&&(this._wash(t,e,s,p,d,E,N,.13),v.fill>.01)){let L=v.state==="done"?.14+.2*Math.exp(-v.doneT/2.2):.34;this._wash(t,e,s,p,d,E,E+M*v.fill,L*.8)}}t.globalAlpha=1}_pump(){this._ctx&&this.isConnected&&this._onScreen!==!1&&!document.hidden?this._start():this._stop()}_start(){if(this._raf)return;this._last=performance.now();let t=e=>{this._raf=requestAnimationFrame(t);let s=e-this._last,i=Math.min(.05,s/1e3);this._last=e,this._perfTick(s),this._draw(i)};this._raf=requestAnimationFrame(t)}_perfTick(t){if(t<=0||t>250)return;let e=this._perf||(this._perf={q:1,acc:0,n:0,hold:40});if(e.hold>0){e.hold--;return}if(e.acc+=t,++e.n<45)return;let s=e.acc/e.n;e.acc=0,e.n=0,s>26&&e.q>.2?this._setQuality(Math.max(.2,e.q*.65)):s<14&&e.q<1&&this._setQuality(Math.min(1,e.q*1.2))}_setQuality(t){let e=this._perf;t!==e.q&&(e.q=t,e.hold=40,this._particles=null,this._measure())}_stop(){this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_targets(){let t=this._effectiveState(),e=t==="offline"?this._config.offline_color:this._config[as[t]];return{energy:ls[t],rgb:ds(e)}}_nearestAnchor(t,e,s){let i=s,n=s?Math.hypot(t.x-s.x,t.y-s.y)-s.r*.35:1/0;for(let o of e){let r=Math.hypot(t.x-o.x,t.y-o.y);r<n&&(n=r,i=o)}return i}_bubbleField(t){let e=t*.42;return{core:e,R:e,newR:()=>t*(.03+Math.pow(Math.random(),1.6)*.028),minAnchor:t*.058,maxR:t*.13}}_spawnBubble(t,e,s,i,n){let o=i??Math.random()*Math.PI*2,r=n??t.newR(),a=t.core+r;return{x:e+Math.cos(o)*a,y:s+Math.sin(o)*a,vx:0,vy:0,r:0,full:r,anchor:r>=t.minAnchor,host:null,held:!0,pop:-1,life:0,roll:Math.random()<.5?-1:1,wob:Math.random()*Math.PI*2}}_drawBubbles(t){let e=this._ctx,s=this._w,i=this._h;if(!s||!i)return;let n=s/2,o=i/2,r=Math.min(s,i)/2,{energy:a,rgb:c}=this._targets(),p=1-Math.exp(-t/.55),d=1-Math.exp(-t/.16),u=this._cur;for(let h of Object.keys(a)){let m=h==="speech"&&a[h]<u[h]?d:p;u[h]+=(a[h]-u[h])*m}for(let h=0;h<3;h++)this._rgb[h]+=(c[h]-this._rgb[h])*p;let _=Math.round(this._rgb[0]),b=Math.round(this._rgb[1]),g=Math.round(this._rgb[2]);a.speech>.5&&this._speech.env<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),u.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*p;let w=this._speech,C=.5+.5*Math.sin(w.t*.5+.8*Math.sin(w.t*.21)),k=w.live?.88:.62,v=(k*w.env+(1-k)*C)*u.speech;this._t+=t;let H=u.swirl/1.8,T=Number(this._config.particle_size)||1,E=this._bubbleField(r),N=Math.max(6,Math.round(22*T));if(this._bub&&this._bubHalf&&this._bubHalf!==r){let h=r/this._bubHalf;for(let m of this._bub)m.x=n+(m.x-n)*h,m.y=o+(m.y-o)*h,m.r*=h,m.full*=h,m.vx*=h,m.vy*=h,m.popR&&(m.popR*=h);this._bubHalf=r}if(!this._bub){this._bubHalf=r,this._bub=[];for(let h=0;h<N;h++){let m=E.newR()*(1+Math.random()*2.2),$=this._spawnBubble(E,n,o,h/N*Math.PI*2,Math.min(m,E.maxR));$.r=$.full,$.anchor=$.r>=E.minAnchor,this._bub.push($)}this._release=0}let M=this._bub;for(let h of M)h.held&&h.pop<0&&(h.anchor=h.r>=E.minAnchor);let L=M.filter(h=>h.anchor&&h.held&&h.pop<0),R=E.core*(1+v*.09+Math.sin(this._t*.7)*.012);for(this._release+=v*t*3.2;this._release>=1;){this._release-=1;let h=M.filter(O=>O.held&&!O.anchor&&O.pop<0&&O.r>O.full*.6),m=h.length>2?h:M.filter(O=>O.held&&O.pop<0&&O.r>O.full*.6);if(m.length<3)break;let $=m[Math.floor(Math.random()*m.length)];$.host=null,$.held=!1,$.life=0;let S=Math.hypot($.x-n,$.y-o)||1,j=($.x-n)/S,P=($.y-o)/S,U=r*(.5+Math.random()*.5);$.vx=j*U-P*r*.12,$.vy=P*U+j*r*.12}let ht=r*(.16+H*.32);for(let h of M){if(h.wob+=t*1.3,h.pop>=0){h.pop+=t;continue}if(h.held){if(h.r+=(h.full-h.r)*(1-Math.exp(-t/.45)),h.anchor){let $=Math.hypot(h.x-n,h.y-o)||1,S=(h.x-n)/$,j=(h.y-o)/$,U=(R+h.r-$)*8;h.vx+=(S*U-j*ht)*t,h.vy+=(j*U+S*ht)*t}else{!h.host||!h.host.held||h.host.pop>=0?h.host=this._nearestAnchor(h,L,null):h.host=this._nearestAnchor(h,L,h.host);let $=h.host;if($){let S=h.x-$.x,j=h.y-$.y,P=Math.hypot(S,j);P<.001&&(S=.1,j=0,P=.1);let U=S/P,O=j/P,At=($.r+h.r-P)*9,Et=r*.22*h.roll;h.vx+=(U*At-O*Et)*t,h.vy+=(O*At+U*Et)*t}else{let S=Math.hypot(h.x-n,h.y-o)||1;h.vx+=(h.x-n)/S*(E.R-S)*5*t,h.vy+=(h.y-o)/S*(E.R-S)*5*t}}let m=Math.exp(-t*(h.anchor?3.4:4.6));h.vx*=m,h.vy*=m}else h.life+=t,h.vy-=r*.16*t,h.vx*=Math.exp(-t*.5),h.vy*=Math.exp(-t*.5),h.r*=Math.exp(-t*.22),(h.life>1.5+Math.random()*.6||h.x<-r||h.x>s+r||h.y<-r)&&(h.pop=0,h.popR=h.r);h.x+=h.vx*t,h.y+=h.vy*t}es(M,2),ss(M,n,o,R),is(M,n,o,R),os(M,{dt:t,rate:1.3+H*.9,maxRatio:2.1,maxR:E.maxR});for(let h of M)h.held&&h.pop<0&&h.r>=E.maxR*.995&&(h.held=!1,h.pop=0,h.popR=h.r);for(let h=M.length-1;h>=0;h--)M[h].pop>.34&&M.splice(h,1);let Mt=0;for(;Mt++<4;){let h=M.filter(P=>P.held&&P.pop<0);if(h.length>=N)break;let m=h.filter(P=>P.anchor),{angle:$,gap:S}=ns(m,n,o),j=Math.sin(Math.min(S,Math.PI)/2)*E.core;if(m.length>1&&j<E.minAnchor*1.1)break;M.push(this._spawnBubble(E,n,o,$))}e.clearRect(0,0,s,i),e.globalCompositeOperation="lighter";let it=e.createRadialGradient(n-R*.3,o-R*.35,R*.08,n,o,R),St=.34+v*.22;it.addColorStop(0,`rgba(${Math.min(255,_+80)},${Math.min(255,b+80)},${Math.min(255,g+65)},${St})`),it.addColorStop(.6,`rgba(${_},${b},${g},${St*.55})`),it.addColorStop(1,`rgba(${_},${b},${g},0)`),e.fillStyle=it,e.beginPath(),e.arc(n,o,R,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${_},${b},${g},${.3+v*.28})`,e.lineWidth=Math.max(.8,R*.018),e.beginPath(),e.arc(n,o,R*.985,0,Math.PI*2),e.stroke(),e.fillStyle=`rgba(255,255,255,${.13+v*.12})`,e.beginPath(),e.arc(n-R*.36,o-R*.4,R*.14,0,Math.PI*2),e.fill();let ct=M.slice().sort((h,m)=>m.r-h.r);for(let h of ct){if(h.pop>=0){let P=h.pop/.34,U=(h.popR||h.r)*(1+P*1.5);e.strokeStyle=`rgba(${_},${b},${g},${(1-P)*.55})`,e.lineWidth=Math.max(.7,(h.popR||h.r)*.16*(1-P)),e.beginPath(),e.arc(h.x,h.y,U,0,Math.PI*2),e.stroke();continue}let m=h.r*(1+Math.sin(h.wob)*.02);if(m<.6)continue;let $=h.held?1:Math.max(0,1-h.life/2.1),S=(.5+v*.28)*$,j=e.createRadialGradient(h.x-m*.3,h.y-m*.35,m*.1,h.x,h.y,m);j.addColorStop(0,`rgba(${Math.min(255,_+95)},${Math.min(255,b+95)},${Math.min(255,g+75)},${S})`),j.addColorStop(.55,`rgba(${_},${b},${g},${S*.7})`),j.addColorStop(1,`rgba(${_},${b},${g},0)`),e.fillStyle=j,e.beginPath(),e.arc(h.x,h.y,m,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(${_},${b},${g},${(.26+v*.16)*$})`,e.lineWidth=Math.max(.5,m*.045),e.beginPath(),e.arc(h.x,h.y,m*.97,0,Math.PI*2),e.stroke(),m>3&&(e.fillStyle=`rgba(255,255,255,${(.26+v*.2)*$})`,e.beginPath(),e.arc(h.x-m*.34,h.y-m*.38,m*.17,0,Math.PI*2),e.fill())}e.globalCompositeOperation="source-over"}_draw(t){let e=this._ctx;if(!e)return;if(this._config.animation!=="jarvis-v1")return this._drawBubbles(t);if(!this._particles)return;let s=this._w,i=this._h,n=s/2,o=i/2,r=Math.min(s,i)/2,{energy:a,rgb:c}=this._targets(),p=1-Math.exp(-t/.55),d=1-Math.exp(-t/.16),u=this._cur;for(let f of Object.keys(a)){let A=f==="speech"&&a[f]<u[f]?d:p;u[f]+=(a[f]-u[f])*A}for(let f=0;f<3;f++)this._rgb[f]+=(c[f]-this._rgb[f])*p;let _=Math.round(this._rgb[0]),b=Math.round(this._rgb[1]),g=Math.round(this._rgb[2]);this._t+=t,this._waveT+=t*(.5+u.swirl*.9),this._spin+=t*(.09+u.swirl*.05),this._head+=t*(1.1+u.swirl*1.4),a.speech>.5&&this._cur.speech<.05&&(this._speech.next=this._speech.t,this._speech.pulses.length=0),u.speech>.005?this._speechTick(t):this._speech.env+=(0-this._speech.env)*p;let w=this._speech,C=.5+.5*Math.sin(w.t*.5+.8*Math.sin(w.t*.21)),k=w.live?.88:.62,v=(k*w.env+(1-k)*C)*u.speech,H=this._speech.syl?this._speech.syl.f:11;this._churnT+=t*(.55+u.swirl*.85+v*.7),this._waveT+=t*v*.8;let T=this._churnT,E=this._pulseTable(u.speech),N=this._peakTable(t,u,v);e.clearRect(0,0,s,i);let M=this._t,L=this._waveT,R=this._spin*.6,ht=.955,Mt=.296,it=.72+.28*Math.sin(M*.21+1.3)*Math.sin(M*.093+4.1),St=.012*Math.sin(M*.16+.7),ct=r*.38*1.16,h=r*.38*.7,m=ct*ct,$=ct-h,S=.92,j=.075;e.fillStyle=`rgb(${_},${b},${g})`;let P=this._sprite(_,b,g),U=this._bins||(this._bins=[]);for(let f=0;f<$t;f++)U[f]=new Path2D;let O=this._perf?.q??1,ge=1+(1-O)*.6,At=O>=.5,Et=(Number(this._config.particle_size)||1)*st(r/220,.75,1.8)*(1+(1-O)*.35);for(let f of this._particles){let A=Nt[f.ri],z=f.lon+R*A.rev+f.drift*T+f.wobA*(1+v*1)*(Math.sin(T*f.wobW+f.wobP)+.6*Math.sin(T*f.wobW*2.3+f.wobP*2.1)),q=Math.cos(z),J=Math.sin(z),Kt=f.cosLat*q,B=f.sinLat,Tt=f.cosLat*J,fs=.45*Math.sin(5*z-L*1.4+B*2.3)+.3*Math.sin(8*z+L*1.05-B*3.1)+.3*Math.sin((Kt*.9+B*.32+Tt*.28)*3.1+L*.9)+.2*Math.sin(13*z-L*2.1+B*1.8),_s=.45*Math.cos(5*z-L*1.4+B*2.3)+.3*Math.cos(8*z+L*1.05-B*3.1),we=.5+.5*Math.sin(z-T*(.5+f.ri*.13)+f.ri*2.1),K=it*(.45+1.3*we*we)*(u.turb+v*.6);K>1.1&&(K=1.1);let gs=Math.sin((Kt*.7-B*.6+Tt*.4)*7.3+L*1.8),Ct=fs*(.4+K)+gs*.38*K,$e=f.off+f.bobA*(.7+.6*K)*(Math.sin(T*f.bobW+f.bobP)+.55*Math.sin(T*f.bobW*2.7+f.bobP*1.9)),Qt=1-Math.min(1,Math.abs($e)),ke=u.amp*(1+v*.4),V=A.r+u.radius+St+v*.015+A.amp*ke*Ct+$e*A.thick;Ct>.75&&(V+=(Ct-.75)*.04*K);let dt=Kt,pt=B*ht-Tt*Mt,bs=B*Mt+Tt*ht,Pt=Math.sqrt(dt*dt+pt*pt)||1e-4,Me=Math.atan2(pt,dt),Gt=Me*.15915494%1;Gt<0&&(Gt+=1);let Xt=N[Gt*at|0];V+=Xt*(.35+.65*Qt);let jt=(M+f.lt)%f.lf;jt/=f.lf,V+=(jt-.5)*.008;let Jt=6*jt*(1-jt);Jt>1&&(Jt=1);let ms=.24+.76*Qt*Qt,Q=f.br*A.glow*ms*Jt*(.55+.45*Math.abs(Math.sin(M*f.tw*.6+f.ph)))*u.bright;Q*=.68+.32*Math.sin(z*2.7+T*.45+f.ph*3);let Yt=Pt*Pt;if(Q*=.09+1.6*Yt*Yt*Yt,Q*=.62+.5*Math.max(0,Ct),Q*=.85+.3*K,Q*=1+Xt*(4+v*6),u.sweep>.01){let I=(Me-this._head)%6.283185;I<0&&(I+=6.283185),I>3.141593&&(I-=6.283185),Q*=1+Math.exp(-(I*I)/.25)*u.sweep*2.4}let zt=0;if(u.speech>.01){let I=(V-hs)/cs*(rt-1);I=I<0?0:I>rt-1?rt-1:I|0,zt=E[I],V+=zt*.07,Q*=1+zt*1.1+v*.7}V>S&&(V=S+j*Math.tanh((V-S)/j));let Se=V*r,Ae=bs*.5+.5,Ee=f.sz*Et*(.78+.32*Ae)*(1+v*.25+zt*.5+Xt*(.8+v*2)),Te=r*A.amp*ke*_s*(.5+K*.45),Rt=Se*dt-pt/Pt*Te,Ot=Se*pt+dt/Pt*Te,ut=1,Ce=Rt*Rt+Ot*Ot;if(Ce<m){if(ut=(Math.sqrt(Ce)-h)/$,ut<.02)continue;ut*=ut}let Pe=st(Q*ge*(.45+.65*Ae)*ut,0,1);if(f.halo&&At){let I=Ee*8;e.globalAlpha=Pe*.22,e.drawImage(P,n+Rt-I/2,o+Ot-I/2,I,I)}let je=Ee*.56,ze=n+Rt,Re=o+Ot,Oe=U[Math.min($t-1,Pe*$t|0)];Oe.moveTo(ze+je,Re),Oe.arc(ze,Re,je,0,6.283185)}for(let f=0;f<$t;f++)e.globalAlpha=(f+.5)/$t,e.fill(U[f]);e.globalAlpha=1,this._segTick(t),this._drawSegs(e,n,o,r,_,b,g);let Bt=r*.38,be=Math.cos(this._spin),me=Math.sin(this._spin),ve=Math.cos(.35),xe=Math.sin(.35),ye=fe.verts,Vt=ye.length;(!this._proj||this._proj.length!==Vt*3)&&(this._proj=new Float64Array(Vt*3));let D=this._proj;for(let f=0;f<Vt;f++){let A=ye[f],z=A[0]*be+A[2]*me,q=-A[0]*me+A[2]*be,J=A[1]*ve-q*xe;D[f*3]=n+z*Bt,D[f*3+1]=o-J*Bt,D[f*3+2]=A[1]*xe+q*ve}e.save(),e.beginPath(),e.arc(n,o,Bt,0,Math.PI*2),e.clip();let Wt=fe.edges,Ft=st(u.bright*(1+v*.45),.3,1.9);for(let f=0;f<2;f++){let A=f===1;e.beginPath();for(let z=0;z<Wt.length;z+=2){let q=Wt[z]*3,J=Wt[z+1]*3;D[q+2]+D[J+2]>0===A&&(e.moveTo(D[q],D[q+1]),e.lineTo(D[J],D[J+1]))}e.strokeStyle=A?`rgba(220,246,255,${.4*Ft})`:`rgba(${_},${b},${g},${.13*Ft})`,e.lineWidth=Math.max(.35,r*(A?.0032:.0024)),e.stroke()}e.fillStyle="rgba(235,252,255,1)";for(let f of qs){let A=f.v*3;if(D[A+2]<=.15)continue;let z=Math.pow(Math.abs(Math.sin(M*f.tw+f.ph)),6)*Ft;if(z<.04)continue;e.globalAlpha=st(z,0,1);let q=Math.max(1,r*.008);e.fillRect(D[A]-q/2,D[A+1]-q/2,q,q)}e.globalAlpha=1,e.restore()}_fmtElapsed(t){if(t==null)return"";let e=Math.floor(t/60);return e<1?`${Math.floor(t)}s`:e<60?`${e}m`:`${Math.floor(e/60)}h ${e%60}m`}_chipProjects(){let t=n=>n.replace(/\b\w/g,o=>o.toUpperCase()),e=n=>typeof n=="string"?{project:n,label:t(n)}:n,s=this._config.build_projects,i=this._projects||[];return Array.isArray(s)&&s.length?s.map(e).filter(n=>!i.length||i.includes(n.project)):i.map(e)}_renderList(){let t=this._sessions;return y`
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
      ${this._picking?y`<div class="chips">
            ${this._chipProjects().map(e=>y`<button class="chip" @click=${()=>this._newSession(e.project)}>
                ${e.label}
              </button>`)}
          </div>`:x}
      <div class="list">
        ${t==null?y`<div class="dim pad">Scanning…</div>`:t.length===0?y`<div class="dim pad">No sessions running.</div>`:t.map(e=>y`
                  <div class="rowwrap ${this._swipe===e.id?"open":""}">
                    <button
                      class="rowkill"
                      data-ai="swipe-end-session"
                      @click=${()=>this._killSession(e.id)}
                    >${this._confirmKill===e.id?"Sure?":"End"}</button>
                    <button
                      class="row"
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
                          ${e.busy?y`<span class="rtime">${this._fmtElapsed(e.elapsed)}</span>`:x}
                        </span>
                        ${e.last_message?y`<span class="rsnip">${e.last_message}</span>`:x}
                        <span class="rmeta">
                          <span class="pill">${e.project}</span>
                          ${e.label!==e.project?y`<span class="pill alt">${e.label.replace(`${e.project}, `,"")}</span>`:x}
                        </span>
                      </span>
                      <span class="chev">›</span>
                    </button>
                  </div>
                `)}
      </div>
    `}_renderSession(){let t=(this._sessions||[]).find(e=>e.id===this._sel);return y`
      <div class="phead">
        <button class="hbtn" data-ai="close-session-view" @click=${()=>this._select(null)}>‹</button>
        <button
          class="ptitle tappable"
          data-ai="session-details"
          title="What is this session?"
          @click=${()=>this._details=!this._details}
        >
          ${t?.title||t?.label||"session"}
          ${t?.busy?y`<span class="livedot"></span> working ${this._fmtElapsed(t.elapsed)}`:x}
          <span class="caret">${this._details?"\u25B4":"\u25BE"}</span>
        </button>
        <button
          class="hbtn danger ${this._confirmKill===this._sel?"armed":""}"
          data-ai="end-session"
          @click=${()=>this._killSession(this._sel)}
        >${this._confirmKill===this._sel?"Confirm?":"End"}</button>
      </div>
      ${this._details?y`<div class="details">
            <div class="drow">
              <span class="dkey">Project</span>
              <span class="pill">${t?.project||"unknown"}</span>
              ${t?.label&&t.label!==t.project?y`<span class="pill alt">${t.label.replace(`${t.project}, `,"")}</span>`:x}
            </div>
            <div class="drow col">
              <span class="dkey">You opened with</span>
              <span class="dfirst">${t?.first_message||"Nothing recorded yet."}</span>
            </div>
          </div>`:x}
      <div
        class="log"
        @scroll=${e=>{let s=e.target;this._stick=s.scrollHeight-s.scrollTop-s.clientHeight<40}}
      >
        ${this._msgs==null?y`<div class="dim pad">Loading transcript…</div>`:this._msgs.length===0?y`<div class="dim pad">Nothing here yet.</div>`:this._msgs.map(e=>y`<div class="msg ${e.role}">${this._body(e)}</div>`)}
        ${this._activity&&t?.busy?y`<div class="activity">${this._activity}</div>`:x}
        ${this._ask?y`<div class="askbox ${this._askSent?"answered":""}">
              ${this._ask.text?y`<div class="asktext">${this._ask.text}</div>`:x}
              ${this._ask.options.map(e=>y`<button
                  class="askopt ${this._askSent===e.key?"picked":""}"
                  data-ai="pick-option"
                  ?disabled=${!!this._askSent}
                  @click=${()=>this._sendKey(e.key)}
                >
                  <span class="asknum">${e.key}</span>
                  <span class="asklabel">${e.label}</span>
                  ${this._askSent===e.key?y`<span class="asktick">✓</span>`:x}
                </button>`)}
              <div class="askrow">
                ${this._askSent?y`<span class="dim">sending…</span>`:x}
                <button class="askmini" @click=${()=>this._sendKey("Enter")}>⏎ confirm</button>
                <button class="askmini" @click=${()=>this._sendKey("Escape")}>esc</button>
              </div>
            </div>`:x}
        ${(this._queue||[]).filter(e=>e.id===this._sel).map(e=>y`<div class="qitem ${e.state}">
              <button
                class="qtext"
                data-ai="edit-queued"
                ?disabled=${e.state==="sent"}
                title=${e.state==="held"?"Tap to edit":""}
                @click=${()=>e.state==="held"&&this._editQueued(e)}
              >${e.text}</button>
              <div class="qbar">
                <span class="qtag">
                  ${e.state==="sent"?"sending\u2026":t?.busy?"queued \xB7 sends when this turn ends":"queued"}
                </span>
                ${e.state==="held"?y`
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
        @dragover=${e=>{[...e.dataTransfer?.types||[]].includes("Files")&&(e.preventDefault(),e.dataTransfer.dropEffect="copy",this._dragging=!0)}}
        @dragleave=${e=>{e.currentTarget.contains(e.relatedTarget)||(this._dragging=!1)}}
        @drop=${e=>{e.preventDefault(),this._dragging=!1,this._ingest([...e.dataTransfer?.files||[]])}}
      >
        ${(this._files||[]).length||this._uploading?y`<div class="atts">
              ${(this._files||[]).map(e=>y`<span class="att">
                  <span class="attname">${e.name}</span>
                  <button
                    class="attx"
                    title="Remove"
                    @click=${()=>this._dropFile(e)}
                  >✕</button>
                </span>`)}
              ${this._uploading?y`<span class="att pendingatt">sending…</span>`:x}
            </div>`:x}
        <div
          class="cbox"
          @pointerdown=${e=>{e.target.closest("button, input, textarea")||(e.preventDefault(),this._composerEl()?.focus())}}
        >
        <div class="cbtns">
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
            @click=${()=>this.renderRoot.querySelector(".filepick")?.click()}
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
        <textarea
          data-ai="compose-prompt"
          rows="2"
          placeholder="Message ${this._name}…"
          autocomplete="off"
          ?disabled=${this._pending}
          @keydown=${e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this._send(e))}}
          @focus=${()=>this._settlePin()}
          @input=${e=>{this._autoGrow(e.target),this._saveDraft()}}
        ></textarea>
        </div>
      </form>
    `}render(){if(!this._config)return x;if(!this._hass?.states?.[this._config.entity])return y`
        <ha-card>
          <div class="missing">
            Entity <code>${this._config.entity}</code> not found
          </div>
        </ha-card>
      `;let e=this._effectiveState(),s=e==="offline"?this._config.offline_color:this._config[as[e]],i=!!this._build,n=this._announce??null,o=this._messages??null;return y`
      <ha-card
        class="bg-${this._config.background}${this._config.honeycomb===!1?"":" comb"}${e==="offline"?" dim":""}"
        style=${this._config.honeycomb===!1?"":`--jr-comb:${Bs(s)}`}
      >
        <div
          class="wrap state-${e} ${i&&!this._config.build_dashboard?"build":""} ${this._config.build_page?"page":""} ${i&&this._config.panel_fullscreen&&!this._config.build_dashboard?"over":""}"
          style=${this._cardVars(s)}
        >
          <button
            class="mode ${i?"on":""}"
            data-ai="toggle-build-mode"
            title="Build mode"
            @click=${()=>this._setBuild(!i)}
          >
            <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
          ${n===null?x:y`<button
                class="mode speaker ${n?"on":""}"
                data-ai="toggle-agent-announcements"
                title=${n?`${this._name} finishes out loud - tap to send to your phone instead`:`${this._name} finishes go to your phone - tap to hear them here`}
                @click=${this._toggleAnnounce}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4v-5z"
                    fill=${n?"currentColor":"none"}
                  />
                  <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" fill="none" />
                  <path d="M18 7a7 7 0 0 1 0 10" fill="none" />
                </svg>
              </button>`}
          ${o===null?x:y`<button
                class="mode bell ${o?"on":""}"
                data-ai="toggle-hubbubb-messages"
                title=${o?"New Hubbubb messages are read out here - tap to go quiet":"Hubbubb messages stay quiet - tap to hear new ones here"}
                @click=${this._toggleMessages}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 2.5h15L18 15z"
                    fill=${o?"currentColor":"none"}
                  />
                  <path d="M10 19a2 2 0 0 0 4 0" fill="none" />
                </svg>
              </button>`}
          ${i&&!this._config.build_dashboard?y`<div class="panel">
                ${this._sel?this._renderSession():this._renderList()}
                ${this._err?y`<div class="perr">${this._err}</div>`:x}
              </div>`:x}
          <div class="ring ${this._config.animation==="jarvis-v1"?"":"bubbles"}" data-ai="activate-assistant" @click=${this._ringTap}>
            <canvas></canvas>
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
                  width=${lt.w}
                  height=${lt.h}
                  patternUnits="userSpaceOnUse"
                >
                  <path d=${us} class="hex" />
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
        </div>
      </ha-card>
    `}};It(kt,"properties",{_config:{state:!0},_state:{state:!0},_mp:{state:!0},_build:{state:!0},_sessions:{state:!0},_projects:{state:!0},_sel:{state:!0},_msgs:{state:!0},_ask:{state:!0},_askSent:{state:!0},_activity:{state:!0},_queue:{state:!0},_swipe:{state:!0},_details:{state:!0},_files:{state:!0},_dragging:{state:!0},_uploading:{state:!0},_err:{state:!0},_confirmKill:{state:!0},_picking:{state:!0},_pending:{state:!0},_voiceState:{state:!0},_announce:{state:!0},_messages:{state:!0},_dictating:{state:!0}}),It(kt,"styles",te`
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
      backdrop-filter: blur(3px);
    }
    .wrap.build .ring {
      order: 1;
      width: clamp(90px, 24%, 170px);
      align-self: center;
      flex: none;
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
      flex-direction: column;
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
      padding: 8px 4px;
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
    .askbox {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid rgba(255, 170, 51, 0.45);
      background: rgba(255, 170, 51, 0.06);
      padding: 10px;
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
      .wrap.build .ring {
        display: none;
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
  `);var Vs=[{name:"entity",required:!0,selector:{entity:{domain:qt}}},{name:"animation",selector:{select:{mode:"dropdown",options:[{value:"hubbubb",label:"Hubbubb - ring and bubbles"},{value:"jarvis-v1",label:"Jarvis v1 - segments and motes"}]}}},{name:"assistant_name",selector:{text:{}}},{name:"size",selector:{number:{min:80,max:600,step:10,mode:"slider"}}},{name:"background",selector:{select:{mode:"dropdown",options:[{value:"dark",label:"Deep space (dark)"},{value:"card",label:"Normal card background"},{value:"transparent",label:"Transparent"}]}}},{name:"honeycomb",selector:{boolean:{}}},{name:"tap_message",selector:{text:{}}},{name:"",type:"expandable",title:"Toggles",icon:"mdi:toggle-switch-outline",schema:[{name:"build_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"announce_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"messages_entity",selector:{entity:{domain:["switch","input_boolean"]}}}]},{name:"",type:"expandable",title:"Build panel",icon:"mdi:hexagon-multiple-outline",schema:[{name:"panel_fullscreen",selector:{boolean:{}}},{name:"panel_height",selector:{number:{min:0,max:1400,step:20,mode:"box"}}},{name:"build_dashboard",selector:{text:{}}},{name:"build_page",selector:{boolean:{}}},{name:"build_return",selector:{text:{}}}]},{name:"",type:"expandable",title:"Ring colours",icon:"mdi:palette",schema:[{name:"idle_color",selector:{text:{}}},{name:"listening_color",selector:{text:{}}},{name:"processing_color",selector:{text:{}}},{name:"responding_color",selector:{text:{}}},{name:"offline_color",selector:{text:{}}}]},{name:"",type:"expandable",title:"Panel colours",icon:"mdi:console",schema:[{name:"panel_bg",selector:{text:{}}},{name:"panel_border",selector:{text:{}}},{name:"panel_text",selector:{text:{}}},{name:"terminal_bg",selector:{text:{}}},{name:"terminal_text",selector:{text:{}}}]},{name:"",type:"expandable",title:"Advanced",icon:"mdi:tune",schema:[{name:"follow_media_player",selector:{boolean:{}}},{name:"audio_offset",selector:{number:{min:-2,max:2,step:.05,mode:"box"}}},{name:"media_player",selector:{entity:{domain:"media_player"}}},{name:"particle_size",selector:{number:{min:.3,max:3,step:.1,mode:"slider"}}},{name:"particles",selector:{number:{min:0,max:4e3,step:20,mode:"box"}}}]}],Ws={entity:"Assist satellite",animation:"Animation",assistant_name:"Assistant name",size:"Ring size (px)",background:"Card background",honeycomb:"Honeycomb background",follow_media_player:"Animate while the device is playing audio",audio_offset:"Audio sync offset (seconds)",media_player:"Speaker entity (blank = same device)",tap_message:"Spoken reply when the ring is tapped",particles:"Particle count, Jarvis v1 (0 = auto)",particle_size:"How many bubbles (1 = about 22)",build_entity:"Build mode toggle",announce_entity:"Agent announcement toggle",messages_entity:"Hubbubb message toggle",panel_fullscreen:"Full screen (floats over the dashboard)",panel_height:"Panel height in px (0 = match the ring)",build_dashboard:"Open this dashboard instead",build_page:"This card IS the build dashboard",build_return:"Exit goes back to",idle_color:"Idle",listening_color:"Listening",processing_color:"Processing",responding_color:"Responding",offline_color:"Unavailable",panel_bg:"Panel background",panel_border:"Panel border",panel_text:"Panel text",terminal_bg:"Terminal background",terminal_text:"Terminal text"},Dt=class extends F{setConfig(t){this._config={...de,...t}}render(){return this._config?y`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Vs}
        .computeLabel=${t=>Ws[t.name]??t.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:x}_valueChanged(t){t.stopPropagation();let e={...t.detail.value};for(let[s,i]of Object.entries(de))e[s]===i&&delete e[s];delete e.name,delete e.show_state,pe(this,"config-changed",{config:e})}};It(Dt,"properties",{hass:{},_config:{state:!0}});customElements.define("hubbubb-ring-card",kt);customElements.define("hubbubb-ring-card-editor",Dt);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-ring-card",name:"Hubbubb Ring",description:"Animated glowing ring that reacts to an Assist satellite's state.",preview:!0});console.info(`%c HUBBUBB-RING-CARD %c v${Rs} `,"color:#0b1620;background:#35e0ff;font-weight:700","color:#35e0ff;background:#0b1620");
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
