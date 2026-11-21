/* draw.js — shared drawing kit for mockups and boards, in the Mohamed Sherif style: Noto Sans Arabic, ink/grey, one red focus, radius 0, no shadows or gradients. */
const SG={red:'#FB2203',redT:'#D01A00',ink:'#111111',body:'#424245',muted:'#6E6E73',grey:'#F5F5F7',grey2:'#E8E8ED',line:'#D2D2D7'};
const SGF="'Noto Sans Arabic','Noto Sans',Arial,sans-serif";
const FF=`font-family="${SGF}"`;
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const mix=(a,b,t)=>{const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16)),A=h(a),B=h(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const lum=hex=>{const c=[1,3,5].map(i=>parseInt(hex.substr(i,2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const onCol=hex=>lum(hex)>.36?SG.ink:'#ffffff';
const uFmt=(mm,u)=>u==='in'?(+(mm/25.4).toFixed(mm/25.4<24?1:0))+'″':u==='cm'?(+(mm/10).toFixed(1))+' cm':u==='m'?(+(mm/1000).toFixed(2))+' m':Math.round(mm)+' mm';
const isAr=t=>/[؀-ۿ]/.test(t);
function txt(x,y,t,o={}){t=String(t);const ar=isAr(t);return`<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" font-size="${o.s||16}"${o.w?` font-weight="${o.w}"`:''} fill="${o.c||SG.ink}"${o.a?` text-anchor="${o.a}"`:''}${o.ls&&!ar?` letter-spacing="${o.ls}"`:''}${ar?' direction="rtl"':''}${o.tr?` transform="${o.tr}"`:''} ${FF}>${esc(o.up&&!ar?t.toUpperCase():t)}</text>`}
function dimV(x,y0,y1,label,c=SG.muted){const m=(y0+y1)/2;return`<path d="M${x} ${y0}V${y1}M${x-6} ${y0}h12M${x-6} ${y1}h12" stroke="${c}" stroke-width="1.2" fill="none"/>`+txt(0,0,label,{s:14,c,a:'middle',tr:`translate(${(x-10).toFixed(1)} ${m.toFixed(1)}) rotate(-90)`})}
function dimH(y,x0,x1,label,c=SG.muted,up=false){return`<path d="M${x0} ${y}H${x1}M${x0} ${y-6}v12M${x1} ${y-6}v12" stroke="${c}" stroke-width="1.2" fill="none"/>`+txt((x0+x1)/2,up?y-10:y+20,label,{s:14,c,a:'middle'})}
/* Scale figure: x = left edge, gy = ground, h = height in px. */
function human(x,gy,h,col=SG.line,child=false){const P=(a,b)=>`${(x+a*h).toFixed(1)} ${(gy-h+b*h).toFixed(1)}`,hr=child?.085:.065,hy=child?.09:.065;
 return`<circle cx="${(x+.18*h).toFixed(1)}" cy="${(gy-h+hy*h).toFixed(1)}" r="${(hr*h).toFixed(1)}" fill="${col}"/><path d="M${P(.06,hy*2+.025)}Q${P(.18,hy*2)} ${P(.3,hy*2+.025)}L${P(.34,.52)}L${P(.29,.53)}L${P(.27,.34)}L${P(.27,.995)}L${P(.195,.995)}L${P(.185,.6)}L${P(.175,.995)}L${P(.1,.995)}L${P(.1,.34)}L${P(.08,.53)}L${P(.03,.52)}Z" fill="${col}"/>`}
function callout(n,x,y,tx,ty){return(tx!=null?`<path d="M${x} ${y}L${tx} ${ty}" stroke="${SG.ink}" stroke-width="1"/><rect x="${tx-3}" y="${ty-3}" width="6" height="6" fill="${SG.ink}"/>`:'')+`<rect x="${x-15}" y="${y-15}" width="30" height="30" fill="${SG.ink}"/>`+txt(x,y+5.5,n,{s:15,w:600,c:'#fff',a:'middle'})}
let CLIPN=0;
function imgIn(x,y,w,h,im,fit,clip){if(fit==='logo'){const s=Math.min(w,h)*.55;return`<image href="${im}" xlink:href="${im}" x="${(x+(w-s)/2).toFixed(2)}" y="${(y+(h-s)/2).toFixed(2)}" width="${s.toFixed(2)}" height="${s.toFixed(2)}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clip})"/>`}
 return`<image href="${im}" xlink:href="${im}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid ${fit==='meet'?'meet':'slice'}" clip-path="url(#${clip})"/>`}
/* Flat artwork slot: uploaded artwork or a labelled brand-colour placeholder. */
function artBox(x,y,w,h,i,o,label,stroke){const id='ab'+(CLIPN++),im=ARTS[i]||(i>0?ARTS[0]:null),R=`x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"`;
 let s=`<clipPath id="${id}"><rect ${R}/></clipPath><rect ${R} fill="${o.brand}"/>`;if(im)s+=imgIn(x,y,w,h,im,o.fit||'slice',id);else if(label!==false)s+=txt(x+w/2,y+h/2+5,label||('Artwork '+(i+1)),{s:Math.max(10,Math.min(w,h)*.09),w:600,c:onCol(o.brand),a:'middle'});
 if(stroke)s+=`<rect ${R} fill="none" stroke="${stroke}" stroke-width="1"/>`;return s}
/* Isometric projection (30°). iso(x,y,z) in mm → screen px. */
const C30=Math.cos(Math.PI/6);
const isoF=(O,k)=>(x,y,z)=>[O[0]+(x-y)*C30*k,O[1]+(x+y)*.5*k-z*k];
const pts=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
function fitIso(corners,W,H,m,X0=0,Y0=0){const ax=i=>[Math.min(...corners.map(c=>c[i])),Math.max(...corners.map(c=>c[i]))],[X,Y,Z]=[ax(0),ax(1),ax(2)],all=[];X.forEach(x=>Y.forEach(y=>Z.forEach(z=>all.push([x,y,z]))));const u=isoF([0,0],1),P=all.map(c=>u(...c)),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),bx=[Math.min(...xs),Math.max(...xs)],by=[Math.min(...ys),Math.max(...ys)];
 const k=Math.min((W-2*m)/(bx[1]-bx[0]||1),(H-2*m)/(by[1]-by[0]||1));return{iso:isoF([X0+W/2-k*(bx[0]+bx[1])/2,Y0+H/2-k*(by[0]+by[1])/2],k),k}}
/* Parallelogram face P0 → Px (width w mm) / Py (height h mm), optional artwork mapped by affine transform. */
function face(P0,Px,Py,w,h,fill,st,art){const P3=[Px[0]+Py[0]-P0[0],Px[1]+Py[1]-P0[1]],poly=pts([P0,Px,P3,Py]);let s=`<polygon points="${poly}" fill="${fill}"/>`;
 if(art&&art.im){const a=(Px[0]-P0[0])/w,b=(Px[1]-P0[1])/w,c=(Py[0]-P0[0])/h,d=(Py[1]-P0[1])/h,id='fc'+(CLIPN++);s+=`<g transform="matrix(${[a,b,c,d,P0[0],P0[1]].map(v=>+v.toFixed(5)).join(' ')})"><clipPath id="${id}"><rect width="${w}" height="${h}"/></clipPath>${imgIn(0,0,w,h,art.im,art.fit,id)}</g>`}
 return s+`<polygon points="${poly}" fill="none" stroke="${st.c}" stroke-width="${st.w}" stroke-linejoin="round"/>`}
/* Isometric cuboid at (x0,y0,z0): faces top / front (y=y0+W) / side (x=x0+L). arts = {top,front,side}. */
function isoBox(iso,x0,y0,z0,L,W,H,base,st,arts={},show={top:1,front:1,side:1}){const p=(x,y,z)=>iso(x0+x,y0+y,z0+z);let s='';
 if(show.front)s+=face(p(0,W,H),p(L,W,H),p(0,W,0),L,H,base,st,arts.front);
 if(show.side)s+=face(p(L,W,H),p(L,0,H),p(L,W,0),W,H,mix(base,'#000000',.16),st,arts.side);
 if(show.top)s+=face(p(0,0,H),p(L,0,H),p(0,W,H),L,W,mix(base,'#ffffff',.14),st,arts.top);return s}
const SVGW=(vb,body,bg='#fff')=>`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${vb[0]} ${vb[1]}" width="${vb[0]}" height="${vb[1]}">${bg?`<rect width="${vb[0]}" height="${vb[1]}" fill="${bg}"/>`:''}${body}</svg>`;
