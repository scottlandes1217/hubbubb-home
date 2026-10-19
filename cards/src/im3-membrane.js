/* Two translucent, displaced spherical skins. No wireframe or particle rows:
 * the silhouette and bright folds come from the surface's viewing angle.
 * Kept in a separate WebGL canvas so the existing globe, sessions and intro
 * remain on the card's 2D canvas. Uses WebGL 1, with a Canvas fallback in
 * the card when unavailable. */
export const SHELL_RADII = [0.90, 0.78];

// CPU equivalent of surface() below, for devices without WebGL. Latitude is
// actual depth on a sphere, not a width coordinate on a flat annulus.
export function membranePoint(angle, latitude, time, voice, shell, out) {
  const a=angle,b=latitude,t=time,k=Math.max(0,Math.min(1.2,voice));
  const broad=Math.sin(a*3+t*.51)*.46 + Math.sin(a*5-t*.37+1.8)*.27 + Math.sin(a*7+t*.26)*.17;
  const fold=Math.sin(a*5+b*13+Math.sin(a*3-b*4+t*.7)*1.6-t*.8+shell*2.1);
  const fold2=Math.sin(a*9-b*19+t*.6+shell*1.3);
  const depth=Math.abs(Math.sin(b));
  const u=Math.max(0,Math.min(1,(depth-.18)/.37));
  const rim=1-u*u*(3-2*u);
  const pressure=.3+.7*Math.pow(.5+.5*Math.sin(a*2+t*.9),2);
  const motion=k*rim*pressure, ambient=.2+.8*rim;
  const r=SHELL_RADII[shell]+(.006*ambient+motion*.045)*broad
    +(.006*ambient+motion*.022)*fold+(.002*ambient+motion*.006)*fold2;
  const cb=Math.cos(b);
  out[0]=r*cb*Math.cos(a);out[1]=r*cb*Math.sin(a);out[2]=r*Math.sin(b);
  return out;
}

const VERTEX = `
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
  float r = uRadius + (.006*ambient+motion*.045)*broad
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
}`;

const FRAGMENT = `
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
}`;

export function createMembrane() {
  const canvas = document.createElement('canvas');
  let gl;
  try {
    gl = canvas.getContext('webgl', {alpha:true, premultipliedAlpha:true,
      antialias:true, depth:false, stencil:false, preserveDrawingBuffer:false});
  } catch { return null; }
  if (!gl) return null;
  const shaders = [], buffers = [];
  let program;
  const dispose = () => {
    for (const b of buffers) gl.deleteBuffer(b);
    for (const s of shaders) gl.deleteShader(s);
    if (program) gl.deleteProgram(program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
  try {
    program=gl.createProgram();
    // Preserve smooth time/noise after hours on a wall display. Older GPUs
    // without fragment highp can still use the same shader at mediump.
    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision > 0 ? 'highp' : 'mediump';
    for (const [type,source] of [[gl.VERTEX_SHADER,VERTEX],[gl.FRAGMENT_SHADER,FRAGMENT]]) {
      const shader=gl.createShader(type); shaders.push(shader);
      gl.shaderSource(shader,source.replace(/mediump/g,precision)); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program,shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const cols=256, rows=96, uv=[], indices=[];
    for (let y=0;y<=rows;y++) for (let x=0;x<=cols;x++)
      uv.push(x/cols*Math.PI*2,(y/rows-.5)*Math.PI);
    for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) {
      const a=y*(cols+1)+x,b=a+cols+1;
      indices.push(a,b,a+1,a+1,b,b+1);
    }
    const vertices=gl.createBuffer(); buffers.push(vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER,vertices); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uv),gl.STATIC_DRAW);
    const at=gl.getAttribLocation(program,'aUV');
    gl.enableVertexAttribArray(at); gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
    const elements=gl.createBuffer(); buffers.push(elements);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,elements); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    const uniforms={};
    for (const name of ['uTime','uVoice','uRadius','uShell','uBright','uColor'])
      uniforms[name]=gl.getUniformLocation(program,name);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE,gl.ONE);
    let lost=false;
    canvas.addEventListener('webglcontextlost',()=>{lost=true;});
    return {
      canvas, dispose,
      draw(size,time,voice,bright,color) {
        if (lost || gl.isContextLost()) return false;
        if (canvas.width!==size) {canvas.width=canvas.height=size;gl.viewport(0,0,size,size);}
        gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uniforms.uTime,time);
        gl.uniform1f(uniforms.uVoice,Math.max(0,Math.min(1.2,voice)));
        gl.uniform1f(uniforms.uBright,bright);
        gl.uniform3fv(uniforms.uColor,color);
        for (let shell=0;shell<2;shell++) {
          gl.uniform1f(uniforms.uRadius,SHELL_RADII[shell]);
          gl.uniform1f(uniforms.uShell,shell);
          gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
        }
        return true;
      },
    };
  } catch (error) {
    dispose();
    console.warn('Jarvis membrane renderer unavailable; using canvas surface',error);
    return null;
  }
}
