/* core.js — geometry primitives, units, line standards. All geometry is in millimetres. */
const DEG=Math.PI/180;
const fmt=n=>String(Math.round(n*10)/10);
const arc=(cx,cy,r,a0,a1,n=10)=>{const p=[];for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*DEG;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}return p};
const arcRad=(r,a0,a1,n=48)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return[r*Math.cos(a),r*Math.sin(a)]});
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const rr=(x,y,w,h,r)=>{r=Math.min(r||0,w/2,h/2);if(r<=.01)return rect(x,y,w,h);return[...arc(x+r,y+r,r,180,270),...arc(x+w-r,y+r,r,270,360),...arc(x+w-r,y+h-r,r,0,90),...arc(x+r,y+h-r,r,90,180)]};
const circ=(cx,cy,r,n=40)=>arc(cx,cy,r,0,360,n).slice(0,-1);
const ell=(cx,cy,rx,ry,n=72)=>Array.from({length:n},(_,i)=>[cx+rx*Math.cos(i/n*2*Math.PI),cy+ry*Math.sin(i/n*2*Math.PI)]);
const ln=(x1,y1,x2,y2)=>[[x1,y1],[x2,y2]];
const bulge=(xa,xb,y,D,dir,n=24)=>{const c=xb-xa,R=(c*c/4+D*D)/(2*D),m=(xa+xb)/2;return Array.from({length:n+1},(_,i)=>{const x=xa+c*i/n;return[x,y+dir*(D-R+Math.sqrt(Math.max(0,R*R-(x-m)**2)))]})};
const P=(p,c=true)=>({p,c});
/* A shape holds one array per technical layer. guides = non-production helper lines (INFO layer only). */
const S=()=>({cut:[],crease:[],perf:[],glue:[],bleed:[],safe:[],reg:[],guides:[],band:[],bw:0,labels:[]});
const dedupe=p=>p.filter((q,i)=>!i||Math.hypot(q[0]-p[i-1][0],q[1]-p[i-1][1])>.01);

/* Units — everything is stored in mm; inputs and annotations convert on display. */
const UNITS={mm:1,cm:10,in:25.4,pt:25.4/72};
let UNIT='mm';
const toU=mm=>mm/UNITS[UNIT];
const fromU=v=>v*UNITS[UNIT];
const fmtU=mm=>{const v=toU(mm),d=UNIT==='mm'||UNIT==='pt'?1:UNIT==='cm'?2:3;return String(+v.toFixed(d))};
const lenTxt=mm=>`${fmtU(mm)} ${UNIT}`;

/* Line standards (Master prompt §6). Spot names are used in the PDF/EPS separations and by the Illustrator script. */
const LINES={
 cut:   {name:'Cut',        col:'#E30613',spot:'Dieline-Cut',    cmyk:[0,1,1,0]},
 crease:{name:'Crease / fold',col:'#0072CE',spot:'Dieline-Crease',cmyk:[1,.5,0,0],dash:[3,1.5]},
 perf:  {name:'Perforation',col:'#00A651',spot:'Dieline-Perf',   cmyk:[.8,0,1,0],dash:[1,1]},
 glue:  {name:'Glue',       col:'#E6007E',spot:'Dieline-Glue',   cmyk:[0,1,0,0]},
 bleed: {name:'Bleed',      col:'#F39200',spot:'Dieline-Bleed',  cmyk:[0,.5,1,0]},
 safe:  {name:'Safe area',  col:'#00AEEF',spot:'Dieline-Safe',   cmyk:[1,0,0,0],dash:[1.5,1]},
 reg:   {name:'Crop & registration',col:'#000000',spot:'All',cmyk:[1,1,1,1]},
 info:  {name:'Dimensions & notes',col:'#5B6066'},
};
const BAND='#FDDCB0';
const LAYER_KEYS=['cut','crease','perf','glue','bleed','safe','reg','info'];

const bb=paths=>{const a=[1e9,1e9,-1e9,-1e9];paths.forEach(q=>q.p.forEach(([x,y])=>{a[0]=Math.min(a[0],x);a[1]=Math.min(a[1],y);a[2]=Math.max(a[2],x);a[3]=Math.max(a[3],y)}));return a};
function frame(s){const cb=bb(s.cut);let fb=s.bleed.length?bb([...s.cut,...s.bleed]):[...cb];if(s.band.length)fb=[cb[0]-s.bw,cb[1]-s.bw,cb[2]+s.bw,cb[3]+s.bw];
 if(s.reg.length){const r=bb(s.reg);fb=[Math.min(fb[0],r[0]),Math.min(fb[1],r[1]),Math.max(fb[2],r[2]),Math.max(fb[3],r[3])]}
 const w=cb[2]-cb[0],h=cb[3]-cb[1],m=Math.max(16,Math.max(w,h)*.1),fs=Math.max(2.6,Math.max(w,h)/48),lg=fs*5;
 return{cb,fb,w,h,m,fs,lg,vx:fb[0]-m,vy:fb[1]-m,VW:fb[2]-fb[0]+2*m,VH:fb[3]-fb[1]+2*m+lg}}
/* Crop + centre marks around a rectangular trim, outside the bleed. */
function cropMarks(s,b){const c=bb(s.cut),o=Math.max(b,3)+2,L=5;const[x0,y0,x1,y1]=c;
 [[x0,y0,-1,-1],[x1,y0,1,-1],[x0,y1,-1,1],[x1,y1,1,1]].forEach(([x,y,dx,dy])=>{s.reg.push(P(ln(x+dx*o,y,x+dx*(o+L),y),false));s.reg.push(P(ln(x,y+dy*o,x,y+dy*(o+L)),false))});
 const mx=(x0+x1)/2,my=(y0+y1)/2;[[mx,y0-o,mx,y0-o-L],[mx,y1+o,mx,y1+o+L],[x0-o,my,x0-o-L,my],[x1+o,my,x1+o+L,my]].forEach(q=>s.reg.push(P(ln(...q),false)))}
/* Self-intersection test for the main cut outline (validation). */
function selfCross(p){const n=p.length,X=(a,b,c,d)=>{const o=(p1,p2,p3)=>Math.sign((p2[0]-p1[0])*(p3[1]-p1[1])-(p2[1]-p1[1])*(p3[0]-p1[0]));return o(a,b,c)*o(a,b,d)<0&&o(c,d,a)*o(c,d,b)<0};
 for(let i=0;i<n;i++)for(let j=i+2;j<n;j++){if(i===0&&j===n-1)continue;if(X(p[i],p[(i+1)%n],p[j],p[(j+1)%n]))return true}return false}
