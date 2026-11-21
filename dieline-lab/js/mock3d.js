/* mock3d.js — product mockups generated from each template's own dimensions (same values as the dieline).
   o = {brand, lc, fit, bg}. Artwork slot 0 = main face, slot 1 = second face (back / side). */
const PM_W=800,PM_H=560;
const A2=o=>ARTS[2]?{im:ARTS[2],fit:o.fit}:null,A1n=o=>ARTS[1]?{im:ARTS[1],fit:o.fit}:null;
const A0=o=>ARTS[0]?{im:ARTS[0],fit:o.fit}:null,A1=o=>ARTS[1]?{im:ARTS[1],fit:o.fit}:ARTS[0]?{im:ARTS[0],fit:'logo'}:null;
const stOf=o=>({c:o.lc,w:1.4});
/* front-view helper: fit a w×h mm object into the canvas */
const fit2=(w,h,m=70)=>{const k=Math.min((PM_W-2*m)/w,(PM_H-2*m)/h);return{k,x:(PM_W-w*k)/2,y:(PM_H-h*k)/2}};
function clipArt(pathD,bx,by,bw,bh,o,i=0,fill){const id='pc'+(CLIPN++),im=ARTS[i]||(i?ARTS[0]:null);return`<clipPath id="${id}"><path d="${pathD}"/></clipPath><path d="${pathD}" fill="${fill||o.brand}"/>`+(im?imgIn(bx,by,bw,bh,im,i&&!ARTS[i]?'logo':o.fit,id):'')+`<path d="${pathD}" fill="none" stroke="${o.lc}" stroke-width="1.4" stroke-linejoin="round"/>`}
const slab=(iso,x,y,L,W,t,o,art,base)=>isoBox(iso,x,y,0,L,W,t,base||'#ffffff',stOf(o),{top:art});
const PM={
bcard(v,o){const{w,h}=v,t=Math.max(.8,w/110),c=[[0,0,0],[w*1.4,0,0],[0,h*1.55,0],[w*1.4,h*1.55,t]],{iso}=fitIso(c,PM_W,PM_H,80);
 return slab(iso,w*.4,0,w,h,t,o,A1(o),o.brand)+slab(iso,0,h*.55,w,h,t,o,A0(o),'#ffffff')},
letterhead(v,o){const{w,h}=v,{iso}=fitIso([[0,0,0],[w*1.25,0,0],[0,h*1.15,0],[w*1.25,h*1.15,0]],PM_W,PM_H,50);return slab(iso,w*.25,0,w,h,.4,o,A1(o))+slab(iso,0,h*.15,w,h,.4,o,A0(o))},
flat(v,o){const{w,h}=v,{iso}=fitIso([[0,0,0],[w,0,0],[0,h,0],[w,h,1]],PM_W,PM_H,70);return slab(iso,0,0,w,h,Math.max(.4,w/300),o,A0(o),o.brand)},
greeting(v,o){const side=v.fold==='side',w=v.w,h=v.h,{iso}=fitIso([[0,0,h],[w,0,h],[-w*.2,-w*.8,0],[w,0,0],[0,w*.2,0]],PM_W,PM_H,70);
 const back=`<polygon points="${pts([iso(0,0,h),iso(-w*.15,-w*.78,h),iso(-w*.15,-w*.78,0),iso(0,0,0)])}" fill="${mix(o.brand,'#000000',.2)}" stroke="${o.lc}" stroke-width="1.4"/>`;
 return back+face(iso(0,0,h),iso(w,0,h),iso(0,0,0),w,h,o.brand,stOf(o),A0(o))},
leaflet(v,o){const n=v.type==='gate'?3:+v.n,pw=v.w/n,h=v.h,a=28*Math.PI/180;let P=[[0,0]];for(let i=0;i<n;i++){const d=i%2?-1:1,q=P[i];P.push([q[0]+pw*Math.cos(a),q[1]+d*pw*Math.sin(a)])}
 const{iso}=fitIso([...P.map(p=>[p[0],p[1],0]),...P.map(p=>[p[0],p[1],h])],PM_W,PM_H,70);
 const faces=P.slice(0,-1).map((p,i)=>({i,d:p[0]+p[1]+P[i+1][0]+P[i+1][1]})).sort((a,b)=>a.d-b.d);
 return faces.map(({i})=>{const p=P[i],q=P[i+1];return face(iso(p[0],p[1],h),iso(q[0],q[1],h),iso(p[0],p[1],0),pw,h,i%2?mix(o.brand,'#ffffff',.25):o.brand,stOf(o),i===0?A0(o):null)}).join('')},
envelope(v,o){const W=v.style==='wallet'?v.long:v.short,H=v.style==='wallet'?v.short:v.long,{iso}=fitIso([[0,0,0],[W*1.3,0,0],[0,H*1.45,0],[W*1.3,H*1.45,1]],PM_W,PM_H,60);
 const fl=v.flap==='pointed'?[[0,0],[W/2,H*.55],[W,0]]:v.flap==='curved'?Array.from({length:21},(_,i)=>[W*i/20,H*.42*Math.sin(Math.PI*i/20)]):[[0,0],[8,H*.38],[W-8,H*.38],[W,0]];
 const back=slab(iso,W*.3,0,W,H,.8,o,null,mix(o.brand,'#ffffff',.1))+`<polyline points="${pts(fl.map(p=>iso(W*.3+p[0],p[1],.8)))}" fill="none" stroke="${o.lc}" stroke-width="1.4"/><polyline points="${pts([iso(W*.3,H,.8),iso(W*.3+W*.5,H*.5,.8),iso(W*1.3,H,.8)])}" fill="none" stroke="${o.lc}" stroke-width="1"/>`;
 return back+slab(iso,0,H*.45,W,H,.8,o,ARTS[0]?{im:ARTS[0],fit:'logo'}:null,'#ffffff')},
folder(v,o){const{pw,ph}=v,t=Math.max(2,v.sp+1.5),{iso}=fitIso([[0,0,0],[pw+18,0,0],[0,ph,0],[pw+18,ph,t]],PM_W,PM_H,60);return slab(iso,16,8,210,297,.4,o,null)+isoBox(iso,0,0,0,pw,ph,t,o.brand,stOf(o),{top:A0(o)})},
casewrap(v,o){const sp=v.binding==='softcover'?v.pages/2*v.cal+.5:v.pages/2*v.cal+2*v.bt+2,w=v.w+(v.binding==='softcover'?0:3),h=v.h+(v.binding==='softcover'?0:6),{iso}=fitIso([[0,0,0],[w,0,0],[0,sp,0],[w,sp,h]],PM_W,PM_H,70);
 let s=isoBox(iso,0,0,0,w,sp,h,o.brand,stOf(o),{front:A0(o)},{front:1,side:0,top:0});s+=face(iso(w,sp,h),iso(w,0,h),iso(w,sp,0),sp,h,'#ffffff',stOf(o));s+=face(iso(0,0,h),iso(w,0,h),iso(0,sp,h),w,sp,'#ffffff',stOf(o));
 for(let i=1;i<6;i++){const y=sp*i/6;s+=`<polyline points="${pts([iso(w,y,h-1),iso(w,y,1)])}" stroke="${o.lc}" stroke-opacity=".25" stroke-width="1" fill="none"/>`}return s},
tuck(v,o){const{L,W,H}=v,{iso}=fitIso([[0,0,0],[L,0,0],[0,W,0],[L,W,H],[0,0,H]],PM_W,PM_H,80);let s=isoBox(iso,0,0,0,L,W,H,o.brand,stOf(o),{front:A0(o),side:A1(o),top:A2(o)});
 s+=`<polyline points="${pts([iso(0,W-W*.92,H),iso(L,W-W*.92,H)])}" stroke="${o.lc}" stroke-width="1" fill="none"/>`;return s},
rsc(v,o){const{L,W,H}=v,{iso}=fitIso([[0,0,0],[L,0,0],[0,W,0],[L,W,H],[0,0,H]],PM_W,PM_H,80),base=o.brand===SG.red?'#C9A27A':o.brand;let s=isoBox(iso,0,0,0,L,W,H,base,stOf(o),{front:ARTS[0]?{im:ARTS[0],fit:'logo'}:null,side:A1n(o),top:A2(o)});
 s+=`<polyline points="${pts([iso(0,W/2,H),iso(L,W/2,H)])}" stroke="${o.lc}" stroke-width="1.2" fill="none"/>`+face(iso(0,W/2-W*.08,H),iso(L,W/2-W*.08,H),iso(0,W/2+W*.08,H),L,W*.16,mix(base,'#ffffff',.35),{c:o.lc,w:.8});return s},
mailer(v,o){const{L,W,H}=v,{iso}=fitIso([[0,0,0],[L,0,0],[0,W,0],[L,W,H],[0,0,H]],PM_W,PM_H,80);let s=isoBox(iso,0,0,0,L,W,H,o.brand,stOf(o),{top:A0(o),side:A1(o),front:A2(o)});
 s+=`<polyline points="${pts([iso(0,W,H*.72),iso(L,W,H*.72),iso(L,0,H*.72)])}" stroke="${o.lc}" stroke-width="1" fill="none"/>`;return s},
tray(v,o){const{L,W,H}=v,lh=v.lh,g=H*.55,{iso}=fitIso([[0,0,0],[L+3,0,0],[0,W+3,0],[L,W,H+g+lh]],PM_W,PM_H,70);return isoBox(iso,1.5,1.5,0,L,W,H,mix(o.brand,'#ffffff',.55),stOf(o),{})+isoBox(iso,0,0,H+g,L+3,W+3,lh,o.brand,stOf(o),{top:A0(o),front:ARTS[1]?{im:ARTS[1],fit:o.fit}:null})},
sleeve(v,o){const{L,H,S:Sw}=v,D=Sw*1.6,a=(D-Sw)/2,{iso}=fitIso([[0,0,0],[L,0,0],[0,D,0],[L,D,H]],PM_W,PM_H,80);let s=isoBox(iso,0,0,0,L,D,H,'#ffffff',stOf(o),{});
 s+=face(iso(0,a,H+1),iso(L+1,a,H+1),iso(0,a+Sw,H+1),L+1,Sw,o.brand,stOf(o),A0(o))+face(iso(L+1,a+Sw,H+1),iso(L+1,a,H+1),iso(L+1,a+Sw,0),Sw,H+1,mix(o.brand,'#000000',.16),stOf(o));return s},
pillow(v,o){const{L,W,D}=v,f=fit2(L+2*D,W),k=f.k,x=f.x+D*k,y=f.y,w=L*k,h=W*k,d=D*k;const p=`M${x} ${y}L${x+w} ${y}Q${x+w+d*2} ${y+h/2} ${x+w} ${y+h}L${x} ${y+h}Q${x-d*2} ${y+h/2} ${x} ${y}Z`;
 return clipArt(p,x,y,w,h,o)+`<path d="M${x} ${y}Q${x+d*1.2} ${y+h/2} ${x} ${y+h}M${x+w} ${y}Q${x+w-d*1.2} ${y+h/2} ${x+w} ${y+h}" fill="none" stroke="${o.lc}" stroke-width="1.2"/>`},
bag(v,o){const{W,G,H}=v,{iso}=fitIso([[0,0,0],[W,0,0],[0,G,0],[W,G,H*1.35]],PM_W,PM_H,60);let s=`<polygon points="${pts([iso(0,0,H),iso(W,0,H),iso(W,G,H),iso(0,G,H)])}" fill="${mix(o.brand,'#000000',.45)}"/>`;
 const hd=(x0,y)=>{const a=iso(x0,y,H),b=iso(x0+W*.36,y,H),c=iso(x0+W*.18,y,H*1.3);return`<path d="M${a[0]} ${a[1]}Q${c[0]} ${c[1]-(b[1]-a[1])} ${b[0]} ${b[1]}" fill="none" stroke="${o.lc}" stroke-width="3"/>`};
 s+=hd(W*.32,G*.35);s+=isoBox(iso,0,0,0,W,G,H,o.brand,stOf(o),{front:A0(o),side:A1n(o)},{front:1,side:1,top:0});s+=hd(W*.32,G);
 const m=iso(W,G/2,H),b2=iso(W,G/2,H*.18),l=iso(W,G,H*.08),r=iso(W,0,H*.08);s+=`<polyline points="${pts([m,b2])}" stroke="${o.lc}" stroke-width="1" fill="none"/><polyline points="${pts([l,b2,r])}" stroke="${o.lc}" stroke-width="1" fill="none"/>`;return s},
label(v,o){const D=v.D,h=v.h,jar=h/D<.95,Hc=jar?h*1.5:h*2.4,f=fit2(D*1.3,Hc+(jar?D*.18:D*.9)),k=f.k,cx=PM_W/2,w=D*k,top=f.y,yb=top+(Hc+(jar?D*.18:D*.9))*k;let s='';
 if(jar){const ly=top+D*.18*k;s+=`<rect x="${cx-w*.47}" y="${top}" width="${w*.94}" height="${D*.18*k}" fill="${SG.ink}"/>`;s+=`<path d="M${cx-w/2} ${ly}H${cx+w/2}V${yb}H${cx-w/2}Z" fill="#ffffff" fill-opacity=".9" stroke="${o.lc}" stroke-width="1.4"/>`;
  const by=ly+(Hc-h)/2*k;s+=clipArt(`M${cx-w/2} ${by}H${cx+w/2}V${by+h*k}H${cx-w/2}Z`,cx-Math.PI*w/2,by,Math.PI*w,h*k,o)}
 else{const nk=D*.9*k,neck=w*.36,body=top+nk;s+=`<rect x="${cx-neck*.6}" y="${top}" width="${neck*1.2}" height="${nk*.28}" fill="${SG.ink}"/><path d="M${cx-neck/2} ${top+nk*.28}V${top+nk*.55}Q${cx-w/2} ${body} ${cx-w/2} ${body+nk*.4}V${yb}H${cx+w/2}V${body+nk*.4}Q${cx+w/2} ${body} ${cx+neck/2} ${top+nk*.55}V${top+nk*.28}Z" fill="#ffffff" stroke="${o.lc}" stroke-width="1.4"/>`;
  const by=body+nk*.4+((yb-body-nk*.4)-h*k)/2;s+=clipArt(`M${cx-w/2} ${by}H${cx+w/2}V${by+h*k}H${cx-w/2}Z`,cx-Math.PI*w/2,by,Math.PI*w,h*k,o)}
 return s+`<rect x="${cx-w*.36}" y="${top+(jar?D*.2:D*1.2)*k}" width="${w*.07}" height="${(Hc-D*.4)*k}" fill="#ffffff" fill-opacity=".5"/>`},
cupwrap(v,o){const{Dt,Db,h}=v,f=fit2(Dt*1.1,h*1.12),k=f.k,cx=PM_W/2,t=f.y+h*.06*k,b=t+h*k,wt=Dt*k,wb=Db*k,p=`M${cx-wt/2} ${t}L${cx+wt/2} ${t}L${cx+wb/2} ${b}L${cx-wb/2} ${b}Z`;
 return clipArt(p,cx-Math.PI*wt/2,t,Math.PI*wt,h*k,o)+`<rect x="${cx-wt/2-4}" y="${t-6}" width="${wt+8}" height="7" fill="#ffffff" stroke="${o.lc}" stroke-width="1.4"/>`},
pouch(v,o){const{W,H}=v,sg=v.type==='standup',f=fit2(W,H),k=f.k,x=f.x,y=f.y,w=W*k,h=H*k,r=sg?w*.12:0,p=`M${x} ${y}H${x+w}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}Z`;
 return clipArt(p,x,y,w,h,o)+`<path d="M${x} ${y+v.top*k}H${x+w}" stroke="${o.lc}" stroke-width="1" stroke-opacity=".6"/>${v.zip?`<path d="M${x} ${y+(v.top+18)*k}H${x+w}" stroke="${o.lc}" stroke-width="1.2" stroke-dasharray="4 3"/>`:''}`},
tag(v,o){const{w,h,r}=v,f=fit2(w,h*1.5),k=f.k,x=f.x,y=f.y+h*.5*k,W=w*k,H=h*k,R=r*k,p=v.corner==='chamfer'?`M${x} ${y+R}L${x+R} ${y}H${x+W-R}L${x+W} ${y+R}V${y+H}H${x}Z`:`M${x} ${y}H${x+W}V${y+H}H${x}Z`;
 const hx=x+W/2,hy=y+10*k;return`<path d="M${hx} ${hy}C${hx-W*.6} ${y-H*.5} ${hx+W*.5} ${y-H*.45} ${hx+W*.15} ${y-H*.05}" fill="none" stroke="${o.lc}" stroke-width="1.6"/>`+clipArt(p,x,y,W,H,o)+`<circle cx="${hx}" cy="${hy}" r="${v.hole/2*k}" fill="#ffffff" stroke="${o.lc}" stroke-width="1.2"/>`},
sticker(v,o){const w=v.w,h=v.shape==='circle'?v.w:v.h,f=fit2(w,h),k=f.k,x=f.x,y=f.y,W=w*k,H=h*k;const p=v.shape==='rounded'?`M${x+v.r*k} ${y}H${x+W-v.r*k}Q${x+W} ${y} ${x+W} ${y+v.r*k}V${y+H-v.r*k}Q${x+W} ${y+H} ${x+W-v.r*k} ${y+H}H${x+v.r*k}Q${x} ${y+H} ${x} ${y+H-v.r*k}V${y+v.r*k}Q${x} ${y} ${x+v.r*k} ${y}Z`:`M${x} ${y+H/2}A${W/2} ${H/2} 0 1 0 ${x+W} ${y+H/2}A${W/2} ${H/2} 0 1 0 ${x} ${y+H/2}Z`;return clipArt(p,x,y,W,H,o)},
doorhanger(v,o){const{w,h,d,hy}=v,f=fit2(w*2.2,h*1.08),k=f.k,x=(PM_W-w*k)/2,y=f.y+h*.04*k,W=w*k,H=h*k;let s=`<rect x="${x-W*.55}" y="0" width="${W*2.1}" height="${PM_H}" fill="${SG.grey}"/><circle cx="${x+W/2}" cy="${y+hy*k}" r="${d*.32*k}" fill="${SG.line}" stroke="${o.lc}" stroke-width="1.2"/>`;
 const p=`M${x} ${y}H${x+W}V${y+H}H${x}Z M${x+W/2+d/2*k} ${y+hy*k}A${d/2*k} ${d/2*k} 0 1 0 ${x+W/2-d/2*k} ${y+hy*k}A${d/2*k} ${d/2*k} 0 1 0 ${x+W/2+d/2*k} ${y+hy*k}Z`;
 const id='dh'+(CLIPN++);return s+`<clipPath id="${id}"><path d="${p}" clip-rule="evenodd"/></clipPath><path d="${p}" fill="${o.brand}" fill-rule="evenodd"/>`+(ARTS[0]?imgIn(x,y+(hy+d/2+6)*k,W,H-(hy+d/2+6)*k,ARTS[0],o.fit,id):'')+`<path d="${p}" fill="none" fill-rule="evenodd" stroke="${o.lc}" stroke-width="1.4"/>`},
tabletent(v,o){const{w,h,b}=v,zt=Math.sqrt(Math.max(1,h*h-(b/2)**2)),{iso}=fitIso([[0,-b/2,0],[w,-b/2,0],[0,b/2,0],[w,b/2,0],[0,0,zt],[w,0,zt]],PM_W,PM_H,80);
 return face(iso(0,0,zt),iso(w,0,zt),iso(0,b/2,0),w,h,o.brand,stOf(o),A0(o))+`<polygon points="${pts([iso(w,0,zt),iso(w,b/2,0),iso(w,-b/2,0)])}" fill="${mix(o.brand,'#000000',.18)}" stroke="${o.lc}" stroke-width="1.4"/>`},
custom(v,o){const ws=v.panels.map(p=>p.w),L=ws[0]||60,W=ws[1]||40,H=v.H,{iso}=fitIso([[0,0,0],[L,0,0],[0,W,0],[L,W,H]],PM_W,PM_H,80);return isoBox(iso,0,0,0,L,W,H,o.brand,stOf(o),{front:A0(o),side:A1(o),top:A2(o)})},
};
function productSvg(g,v,o,ex){CLIPN=0;const f=PM[g];if(!f)return'';return SVGW([PM_W,PM_H],`<g>${f(v,o)}</g>`,ex&&o.bg==='none'?null:'#ffffff')}
/* Product scenes — one setting per product type, built around the item's own mockup and dimensions. */
const SCENE_ENV=c=>'auto';
const NP=(g,v,o,x,y,w)=>`<svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(w*.7).toFixed(1)}" viewBox="0 0 ${PM_W} ${PM_H}">${PM[g](v,o)}</svg>`;
const onBase=(g,v,o,cx,base,w)=>NP(g,v,o,cx-w/2,base-.6*w,w);
function flatPiece(x,y,w,h,rot,fill,o,art,fit){const id='fl'+(CLIPN++);return`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})"><clipPath id="${id}"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}"/></clipPath><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${fill}"/>${art?imgIn(-w/2,-h/2,w,h,art,fit||'logo',id):''}<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="none" stroke="${o.lc}" stroke-width="1.2"/></g>`}
const bars=(x,y,w,n,gap=14,c=SG.line)=>Array.from({length:n},(_,i)=>`<rect x="${x}" y="${y+i*gap}" width="${w*(i%3===2?.6:1)}" height="4" fill="${c}"/>`).join('');
const pen=(x,y,rot,len=240)=>`<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="0" y="-5" width="${len}" height="10" fill="${SG.ink}"/><path d="M${len} -5L${len+22} 0L${len} 5Z" fill="${SG.muted}"/><rect x="18" y="-7" width="46" height="4" fill="${SG.muted}"/></g>`;
const cupTop=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${SG.line}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r*.72}" fill="#6b4a36"/><path d="M${x+r} ${y-8}h${r*.45}a10 10 0 0 1 0 16h${-r*.45}" fill="none" stroke="${SG.line}" stroke-width="6"/>`;
const leaf=(x,y,s)=>`<g transform="translate(${x} ${y})" fill="#9db39a"><ellipse rx="${s}" ry="${s*.45}" transform="rotate(-30)"/><ellipse rx="${s}" ry="${s*.45}" transform="rotate(40) translate(${s*.6} ${-s*.3})"/><ellipse rx="${s*.8}" ry="${s*.38}" transform="rotate(110) translate(${s*.5} 0)"/></g>`;
const wallFloor=(gy,wall=SG.grey2,floor=SG.grey)=>`<rect width="800" height="${gy}" fill="${wall}"/><rect y="${gy}" width="800" height="${560-gy}" fill="${floor}"/><path d="M0 ${gy}H800" stroke="${SG.ink}" stroke-width="1.2"/>`;
const shelf=(y)=>`<rect x="0" y="${y}" width="800" height="14" fill="#fff" stroke="${SG.ink}" stroke-width="1.2"/><rect x="0" y="${y+14}" width="800" height="${560-y-14}" fill="${SG.grey}"/>`;
const SCN={
bcard(v,o){const k=Math.min(3.1,260/Math.max(v.w,v.h)),w=v.w*k,h=v.h*k,lg=ARTS[0];let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`+cupTop(660,120,58)+leaf(110,110,46);
 for(let i=3;i>0;i--)s+=flatPiece(250+i*3,330-i*3,w,h,-10,'#fff',o,null);s+=flatPiece(250,330,w,h,-10,'#fff',o,lg);s+=flatPiece(520,320,w,h,9,o.brand,o,ARTS[1]||lg);return s+pen(380,470,-6,250)},
letterhead(v,o){const k=Math.min(1.45,470/v.h),w=v.w*k,h=v.h*k;let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`+leaf(720,90,50);
 s+=flatPiece(560,360,220*1.45,110*1.45,8,'#fff',o,ARTS[0]);const id='lh'+(CLIPN++);
 s+=`<g transform="translate(330 285) rotate(-4)"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="#fff" stroke="${o.lc}" stroke-width="1.2"/>${ARTS[0]?`<image href="${ARTS[0]}" xlink:href="${ARTS[0]}" x="${-w/2+18}" y="${-h/2+16}" width="${w*.28}" height="${h*.08}" preserveAspectRatio="xMinYMid meet"/>`:`<rect x="${-w/2+18}" y="${-h/2+18}" width="${w*.18}" height="${h*.035}" fill="${o.brand}"/>`}${bars(-w/2+18,-h/2+h*.25,w*.75,9,h*.035)}<rect x="${-w/2}" y="${h/2-h*.025}" width="${w}" height="${h*.025}" fill="${o.brand}"/></g>`;
 return s+flatPiece(610,150,85*2,55*2,-12,o.brand,o,ARTS[0])+pen(470,500,-3,220)},
flat(v,o){const big=Math.max(v.w,v.h)>420;if(big){const gy=470,hp=1750,k=360/Math.max(v.h,hp*.9),w=v.w*k,h=v.h*k,x=400-w/2,y=Math.max(30,gy-160-h);
  return wallFloor(gy)+`<rect x="${x-10}" y="${y-10}" width="${w+20}" height="${h+20}" fill="${SG.ink}"/>`+artBox(x,y,w,h,0,{brand:o.brand,fit:o.fit==='logo'?'meet':o.fit},'',null)+human(Math.min(700,x+w+40),gy,hp*k,SG.line)}
 const k=Math.min(2.6,380/Math.max(v.w,v.h)),w=v.w*k,h=v.h*k;return`<rect width="800" height="560" fill="${SG.grey2}"/>`+flatPiece(430,300,w,h,7,'#fff',o,ARTS[1]||null)+flatPiece(370,270,w,h,-5,o.brand,o,ARTS[0],o.fit)+leaf(90,470,44)+pen(560,500,-8,190)},
greeting(v,o){const gy=440;return wallFloor(gy,SG.grey2,'#fff')+onBase('greeting',v,o,360,gy+20,430)+flatPiece(600,490,190,120,-6,mix(o.brand,'#ffffff',.6),o,null)+`<rect x="640" y="${gy-120}" width="38" height="120" fill="#fff" stroke="${SG.line}" stroke-width="2"/>`+leaf(660,gy-140,26)},
leaflet(v,o){const gy=450;return wallFloor(gy,SG.grey2,'#fff')+onBase('leaflet',v,o,380,gy+30,520)+`<rect x="660" y="${gy-90}" width="70" height="90" fill="#fff" stroke="${SG.line}" stroke-width="2"/><path d="M730 ${gy-70}q24 0 24 22q0 22-24 22" fill="none" stroke="${SG.line}" stroke-width="6"/>`},
envelope(v,o){const W=v.style==='wallet'?v.long:v.short,H=v.style==='wallet'?v.short:v.long,k=Math.min(1.6,320/W),w=W*k,h=H*k;let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`+leaf(90,90,44);
 s+=`<g transform="translate(300 250) rotate(-8)"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${o.brand}" stroke="${o.lc}" stroke-width="1.2"/><path d="M${-w/2} ${-h/2}L0 ${h*.1}L${w/2} ${-h/2}" fill="none" stroke="${o.lc}" stroke-width="1.2"/><path d="M${-w/2} ${h/2}L${-w*.1} ${0}M${w/2} ${h/2}L${w*.1} 0" fill="none" stroke="${o.lc}" stroke-opacity=".4"/></g>`;
 s+=flatPiece(500,370,w,h,6,'#fff',o,null)+`<g transform="translate(500 370) rotate(6)">${ARTS[0]?`<image href="${ARTS[0]}" xlink:href="${ARTS[0]}" x="${-w/2+14}" y="${-h/2+12}" width="${w*.25}" height="${h*.2}" preserveAspectRatio="xMinYMid meet"/>`:`<rect x="${-w/2+14}" y="${-h/2+14}" width="${w*.18}" height="${h*.08}" fill="${o.brand}"/>`}<rect x="${w/2-50}" y="${-h/2+12}" width="34" height="40" fill="none" stroke="${SG.line}" stroke-width="2"/>${bars(-w*.05,h*.05,w*.4,3,14)}</g>`;return s+pen(160,500,-4,200)},
folder(v,o){const k=Math.min(1.5,440/v.ph),w=v.pw*k,h=v.ph*k;let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`;
 s+=flatPiece(470,300,210*k,297*k,10,'#fff',o,null)+`<g transform="translate(470 300) rotate(10)">${bars(-90,-120,180,8,16)}</g>`+flatPiece(340,285,w,h,-6,o.brand,o,ARTS[0]);return s+pen(560,505,-10,200)+leaf(700,100,46)},
casewrap(v,o){const k=Math.min(1.9,430/v.h),w=v.w*k,h=v.h*k;let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`+cupTop(660,140,55);
 s+=flatPiece(430,300,w,h,9,mix(o.brand,'#000000',.25),o,null)+flatPiece(330,290,w,h,-5,o.brand,o,ARTS[0])+`<g transform="translate(330 290) rotate(-5)"><rect x="${w/2-26}" y="${-h/2}" width="8" height="${h}" fill="${SG.ink}" fill-opacity=".85"/></g>`;return s+pen(560,480,-75,210)},
tuck(v,o){const y=430;let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`+shelf(y);[180,400,620].forEach((x,i)=>s+=onBase('tuck',v,o,x,y+(i===1?40:30),i===1?460:400));return s+`<rect x="360" y="${y+2}" width="80" height="22" fill="#fff" stroke="${SG.ink}"/><rect x="368" y="${y+9}" width="40" height="4" fill="${SG.muted}"/>`},
custom(v,o){return SCN.tuck.call(null,v,o).replace(/PM/g,'PM')},
rsc(v,o){const gy=470;let s=wallFloor(gy)+`<rect x="180" y="${gy-26}" width="440" height="26" fill="#c9a27a" stroke="${SG.ink}"/><rect x="200" y="${gy-26}" width="30" height="26" fill="#a9825a"/><rect x="385" y="${gy-26}" width="30" height="26" fill="#a9825a"/><rect x="570" y="${gy-26}" width="30" height="26" fill="#a9825a"/>`;
 s+=onBase('rsc',v,o,300,gy-26+40,300)+onBase('rsc',v,o,500,gy-26+40,300)+onBase('rsc',v,o,400,gy-26+40-190,300);return s},
mailer(v,o){const gy=460;return wallFloor(gy)+`<rect x="560" y="60" width="200" height="${gy-60}" fill="#fff" stroke="${SG.ink}"/><rect x="580" y="80" width="160" height="${gy-100}" fill="none" stroke="${SG.line}" stroke-width="2"/><circle cx="590" cy="${gy-200}" r="7" fill="${SG.ink}"/><rect x="420" y="${gy}" width="300" height="34" fill="${SG.line}"/>`+onBase('mailer',v,o,330,gy+60,420)},
tray(v,o){const gy=430;return wallFloor(gy,SG.grey2,'#fff')+onBase('tray',v,o,380,gy+60,460)+`<path d="M600 ${gy+60}q30-40 70-10q-40 30-70 10z" fill="${o.brand}" fill-opacity=".6"/>`+leaf(110,gy-30,40)},
sleeve(v,o){const gy=430;return wallFloor(gy,SG.grey2,'#fff')+onBase('sleeve',v,o,380,gy+60,460)+leaf(680,gy-40,40)},
pillow(v,o){let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`;s+=NP('pillow',v,o,190,150,440)+`<g transform="rotate(-12 400 300)">${NP('pillow',v,o,140,60,400)}</g>`;return s+leaf(680,460,46)},
bag(v,o){const gy=480;return wallFloor(gy,SG.grey2,SG.grey)+`<rect x="560" y="120" width="170" height="${gy-120}" fill="#fff" stroke="${SG.ink}"/><path d="M560 200H730M560 300H730" stroke="${SG.line}" stroke-width="3"/>`+onBase('bag',v,o,320,gy+55,470)+leaf(100,gy-20,36)},
label(v,o){const y=440;let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`+shelf(y);[200,400,600].forEach((x,i)=>s+=onBase('label',v,o,x,y+(i===1?10:5),i===1?470:420));return s},
cupwrap(v,o){const y=420;let s=`<rect width="800" height="560" fill="${SG.grey2}"/><rect x="460" y="50" width="280" height="170" fill="${SG.ink}"/>${bars(490,90,200,6,18,'#6E6E73')}<rect x="60" y="${y-200}" width="150" height="200" fill="${SG.line}"/><rect x="85" y="${y-150}" width="100" height="70" fill="${SG.muted}"/><rect x="0" y="${y}" width="800" height="${560-y}" fill="${SG.ink}"/><rect x="0" y="${y}" width="800" height="12" fill="#3a3a3c"/>`;
 return s+onBase('cupwrap',v,o,390,y+70,360)+onBase('cupwrap',v,o,590,y+60,260)},
pouch(v,o){const y=430;let s=`<rect width="800" height="560" fill="${SG.grey2}"/><rect x="0" y="${y}" width="800" height="${560-y}" fill="#fff"/><path d="M0 ${y}H800" stroke="${SG.ink}"/><rect x="620" y="${y-140}" width="90" height="140" fill="#fff" stroke="${SG.line}" stroke-width="2"/><rect x="615" y="${y-158}" width="100" height="20" fill="${SG.line}"/>`;
 return s+onBase('pouch',v,o,260,y+60,330)+onBase('pouch',v,o,420,y+75,380)},
tag(v,o){let s=`<rect width="800" height="560" fill="${SG.grey2}"/><path d="M400 20V60M320 110L400 60L480 110" fill="none" stroke="${SG.ink}" stroke-width="5"/><path d="M220 120L320 100Q400 140 480 100L580 120L640 230L590 260L560 230V560H240V230L210 260L160 230Z" fill="#fff" stroke="${o.lc}" stroke-width="1.4"/><path d="M320 100Q400 160 480 100" fill="none" stroke="${o.lc}" stroke-width="1.4"/>`;
 return s+`<path d="M470 120Q520 160 540 200" fill="none" stroke="${SG.ink}" stroke-width="1.6"/>`+NP('tag',v,o,420,150,300)},
sticker(v,o){let s=`<rect width="800" height="560" fill="${SG.grey2}"/><rect x="150" y="80" width="460" height="320" rx="0" fill="#3a3a3c"/><rect x="150" y="400" width="460" height="16" fill="${SG.muted}"/>`;
 return s+NP('sticker',v,o,250,120,260)+`<g transform="rotate(14 640 440)">${NP('sticker',v,o,560,380,180)}</g>`},
doorhanger(v,o){const P=PM.doorhanger(v,o).replace(/^<rect[^>]*>/,'');return`<rect width="800" height="560" fill="${SG.grey2}"/><rect x="210" y="20" width="380" height="540" fill="#fff" stroke="${SG.ink}"/><rect x="226" y="36" width="348" height="524" fill="none" stroke="${SG.line}" stroke-width="2"/><rect x="360" y="60" width="80" height="30" fill="${SG.ink}"/>`+`<svg x="100" y="40" width="600" height="420" viewBox="0 0 ${PM_W} ${PM_H}">${P}</svg>`},
tabletent(v,o){const y=400;let s=`<rect width="800" height="560" fill="${SG.grey2}"/><rect x="0" y="${y}" width="800" height="${560-y}" fill="#fff"/><path d="M0 ${y}H800" stroke="${SG.ink}"/><ellipse cx="610" cy="${y+60}" rx="130" ry="26" fill="#fff" stroke="${SG.line}" stroke-width="3"/><path d="M160 ${y-110}h50l-8 70h-34z" fill="none" stroke="${SG.line}" stroke-width="3"/><path d="M185 ${y-40}v40M165 ${y}h40" stroke="${SG.line}" stroke-width="3"/>`;
 return s+onBase('tabletent',v,o,390,y+75,500)},
};
SCN.custom=(v,o)=>{const y=430;let s=`<rect width="800" height="560" fill="${SG.grey2}"/>`+shelf(y);[250,550].forEach(x=>s+=onBase('custom',v,o,x,y+30,420));return s};
function sceneSvg(g,v,o,env,ex){CLIPN=0;const f=SCN[g];const body=f?f(v,o):`<rect width="800" height="560" fill="${SG.grey2}"/>`+(PM[g]?NP(g,v,o,100,40,600):'');return SVGW([PM_W,PM_H],body,ex&&o.bg==='none'?null:'#ffffff')}
