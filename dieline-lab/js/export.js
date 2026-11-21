/* export.js — one geometry, many outputs: SVG preview/export, PDF + EPS with named spot separations, DXF (CUT/CREASE/PERF/GLUE), ZIP, Illustrator layer script, validation report. */
const labTxt=t=>t.replace(/#([\d.]+)/g,(m,n)=>lenTxt(+n));
const dp=q=>'M'+q.p.map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join('L')+(q.c?'Z':'');
function build(genId,v){const it=IT[genId];const s=it.gen(v);if(it.flat){const b=v.bleed||0;cropMarks(s,b)}return s}

function svgOf(s,o={}){const LT=n=>s.px?Math.round(n)+' px':lenTxt(n);const f=frame(s),on=o.on||{},ex=!!o.exp,mini=!!o.mini,sw=ex?'0.25':(mini?'1':'1.25'),ve=ex?'':' vector-effect="non-scaling-stroke"';
 const pd=a=>a.map(dp).join(''),G=(id,body)=>body?`<g id="${id}">${body}</g>`:'',dash=k=>LINES[k].dash?` stroke-dasharray="${ex?LINES[k].dash.join(' '):LINES[k].dash.map(x=>x*2.6).join(' ')}"`:'';
 const Lk=(k,arr,extra='')=>on[k]&&arr.length?G(k.toUpperCase(),`<path d="${pd(arr)}" fill="none" stroke="${LINES[k].col}" stroke-width="${sw}"${dash(k)}${ve}${extra}/>`):'';
 let g='';
 if(s.band.length&&on.bleed&&!mini)g+=G('BLEED_ZONE',`<path d="${pd(s.band)}" fill="none" stroke="${BAND}" stroke-width="${2*s.bw}" stroke-linejoin="miter"/>`);
 if(!ex)g+=`<path d="${pd(s.cut.filter(q=>q.c))}" fill="#fff" fill-rule="evenodd"/>`;
 if(ex)g+='<g id="ARTWORK"/>';
 if(on.glue&&s.glue.length)g+=G('GLUE',`<path d="${pd(s.glue)}" fill="url(#hatch)" stroke="${LINES.glue.col}" stroke-width="${sw}"${ve}/>`);
 if(!mini){g+=Lk('bleed',s.bleed)+Lk('safe',s.safe)+Lk('reg',s.reg)}
 g+=Lk('perf',s.perf)+Lk('crease',s.crease)+Lk('cut',s.cut);
 if(on.info&&!mini){const fs=f.fs,c=f.cb,yt=f.fb[1]-f.m*.42,xl=f.fb[0]-f.m*.42,t=fs*.5,dc=LINES.info.col;
  let i='';if(s.guides.length)i+=`<path d="${pd(s.guides)}" fill="none" stroke="${LINES.info.col}" stroke-width="${sw}" stroke-dasharray="${ex?'.6 .6':'2 3'}"${ve}/>`;
  i+=`<path d="M${c[0]} ${yt}H${c[2]}M${c[0]} ${yt-t}v${2*t}M${c[2]} ${yt-t}v${2*t}M${xl} ${c[1]}V${c[3]}M${xl-t} ${c[1]}h${2*t}M${xl-t} ${c[3]}h${2*t}" stroke="${dc}" stroke-width="${sw}" fill="none"${ve}/>`;
  i+=`<g font-family="${SGF}" text-anchor="middle"><text fill="${dc}" x="${(c[0]+c[2])/2}" y="${yt-fs*.5}" font-size="${fs}">${LT(f.w)}</text><text fill="${dc}" transform="translate(${xl-fs*.5} ${(c[1]+c[3])/2}) rotate(-90)" font-size="${fs}">${LT(f.h)}</text>`;
  s.labels.forEach(([x,y,tx,k=1])=>i+=`<text x="${x.toFixed(2)}" y="${(y+fs*.35*k).toFixed(2)}" font-size="${(fs*k).toFixed(2)}" font-weight="600" fill="${LINES.info.col}">${labTxt(tx)}</text>`);
  i+='</g>';g+=G('INFO',i);
  let ly=f.fb[3]+f.m*.55;const used=LAYER_KEYS.filter(k=>k!=='info'&&on[k]&&(s[k]||[]).length);let lx=f.fb[0],lg='';
  used.forEach(k=>{const L=LINES[k],nm=s.px&&k==='cut'?'Canvas edge':L.name,wd=fs*(3.2+nm.length*.5);if(lx+wd>f.fb[0]+Math.max(f.fb[2]-f.fb[0],fs*30)&&lx>f.fb[0]){lx=f.fb[0];ly+=fs*1.7}lg+=`<path d="M${lx} ${ly}h${fs*2.2}" stroke="${L.col}" stroke-width="${ex?.35:1.6}"${L.dash?` stroke-dasharray="${L.dash.map(x=>x*(ex?1:2.6)).join(' ')}"`:''}${ve}/><text x="${lx+fs*2.6}" y="${ly+fs*.35}" font-size="${fs*.8}" fill="${dc}" font-family="${SGF}">${esc(nm)}</text>`;lx+=wd});
  g+=G('NOTES',lg)}
 const hatch=`<defs><pattern id="hatch" width="${mini?6:3}" height="${mini?6:3}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V${mini?6:3}" stroke="${LINES.glue.col}" stroke-width="${mini?1.2:.4}"/></pattern></defs>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" ${ex?`width="${f.VW.toFixed(2)}${s.px?'px':'mm'}" height="${f.VH.toFixed(2)}${s.px?'px':'mm'}" `:''}viewBox="${f.vx.toFixed(2)} ${f.vy.toFixed(2)} ${f.VW.toFixed(2)} ${f.VH.toFixed(2)}"${ex?'':' preserveAspectRatio="xMidYMid meet"'}>${ex?`<title>${esc(o.title||'Dieline')}</title><desc>Dieline Lab · 1:1 · mm · layers: ARTWORK, BLEED, SAFE, REG, GLUE, PERF, CREASE, CUT, INFO, NOTES</desc>`:''}${hatch}${g}</svg>`}

/* Vector ops shared by PDF and EPS. Spot colours = Separation colour spaces with CMYK alternates; technical lines overprint. */
function vecOps(s,on,kind){const f=frame(s),k=72/25.4,X=x=>((x-f.vx)*k).toFixed(2),Y=y=>((f.vy+f.VH-y)*k).toFixed(2),pdf=kind==='pdf';
 const M=pdf?{m:'m',l:'l',h:'h',S:'S',f:'f',B:'B',w:'w',q:'q',Q:'Q'}:{m:'moveto',l:'lineto',h:'closepath',S:'stroke',f:'fill',B:'gsave fill grestore stroke',w:'setlinewidth',q:'gsave',Q:'grestore'};
 const path=a=>a.map(q=>q.p.map((p,i)=>`${X(p[0])} ${Y(p[1])} ${i?M.l:M.m}`).join('\n')+(q.c?' '+M.h:'')).join('\n');
 const spot=(key,tint=1,fill=false)=>pdf?`/CS_${key} ${fill?'cs':'CS'} ${tint} ${fill?'scn':'SCN'}`:`/CS_${key} setcolorspace ${tint} setcolor`;
 const dash=d=>d?(pdf?`[${d.map(x=>(x*k).toFixed(2)).join(' ')}] 0 d`:`[${d.map(x=>(x*k).toFixed(2)).join(' ')}] 0 setdash`):(pdf?'[] 0 d':'[] 0 setdash');
 const sw=(.25*k).toFixed(3),ov=pdf?'/GSop gs':'true setoverprint';let c=pdf?'1 J 1 j\n':'1 setlinecap 1 setlinejoin\n';const used=new Set();
 const stroke=(key,arr,d)=>{if(!on[key]||!arr.length)return;used.add(key);c+=`${M.q} ${ov} ${spot(key)} ${sw} ${M.w} ${dash(d)}\n${path(arr)}\n${M.S} ${M.Q}\n`};
 if(on.bleed&&s.band.length){used.add('bleed');c+=`${M.q} ${ov} ${spot('bleed',.3)} ${(2*s.bw*k).toFixed(2)} ${M.w} ${pdf?'0 j':'0 setlinejoin'}\n${path(s.band)}\n${M.S} ${M.Q}\n`}
 if(on.glue&&s.glue.length){used.add('glue');c+=`${M.q} ${ov} ${spot('glue',.2,true)} ${spot('glue')} ${sw} ${M.w}\n${path(s.glue)}\n${M.B} ${M.Q}\n`}
 stroke('bleed',s.bleed);stroke('safe',s.safe,LINES.safe.dash);stroke('reg',s.reg);stroke('perf',s.perf,LINES.perf.dash);stroke('crease',s.crease,LINES.crease.dash);stroke('cut',s.cut);
 if(on.info){const fs=f.fs*k,cb=f.cb,yt=f.fb[1]-f.m*.42,xl=f.fb[0]-f.m*.42,e=t=>t.replace(/×/g,'x').replace(/°/g,' deg').replace(/[’‘]/g,"'").replace(/[()\\]/g,'\\$&').replace(/[^\x20-\x7e]/g,'');
  const gray=pdf?'0.36 g 0.36 G':'0.36 setgray';c+=`${M.q} ${gray} ${sw} ${M.w} ${X(cb[0])} ${Y(yt)} ${M.m} ${X(cb[2])} ${Y(yt)} ${M.l} ${X(xl)} ${Y(cb[1])} ${M.m} ${X(xl)} ${Y(cb[3])} ${M.l} ${M.S}\n`;
  if(s.guides.length)c+=`${dash([.6,.6])} ${path(s.guides)} ${M.S} ${dash()}\n`;
  const tx=(x,y,t,sz)=>{t=e(t);const x0=(+X(x)-t.length*sz*.27).toFixed(2);return pdf?`BT /F1 ${sz.toFixed(2)} Tf ${x0} ${Y(y)} Td (${t}) Tj ET\n`:`/Helvetica findfont ${sz.toFixed(2)} scalefont setfont ${x0} ${Y(y)} moveto (${t}) show\n`};
  c+=tx((cb[0]+cb[2])/2,yt-f.fs*.5,lenTxt(f.w),fs);const ht=e(lenTxt(f.h));
  c+=pdf?`BT /F1 ${fs.toFixed(2)} Tf 0 1 -1 0 ${X(xl-f.fs*.5)} ${(+Y((cb[1]+cb[3])/2)-ht.length*fs*.27).toFixed(2)} Tm (${ht}) Tj ET\n`:`gsave ${X(xl-f.fs*.5)} ${(+Y((cb[1]+cb[3])/2)-ht.length*fs*.27).toFixed(2)} translate 90 rotate /Helvetica findfont ${fs.toFixed(2)} scalefont setfont 0 0 moveto (${ht}) show grestore\n`;
  s.labels.forEach(([x,y,t,m=1])=>c+=tx(x,y+f.fs*.35*m,labTxt(t),fs*m));
  const txL=(x,y,t,sz)=>{t=e(t);return pdf?`BT /F1 ${sz.toFixed(2)} Tf ${X(x)} ${Y(y)} Td (${t}) Tj ET\n`:`/Helvetica findfont ${sz.toFixed(2)} scalefont setfont ${X(x)} ${Y(y)} moveto (${t}) show\n`};const pos=[];{let lx=f.fb[0],ly=f.fb[3]+f.m*.55;[...used].forEach(key=>{const wd=f.fs*(4.2+(LINES[key].name.length+LINES[key].spot.length+3)*.47);if(lx+wd>f.fb[0]+Math.max(f.fb[2]-f.fb[0],f.fs*40)&&lx>f.fb[0]){lx=f.fb[0];ly+=f.fs*1.7}pos.push([key,lx,ly]);lx+=wd})}
  pos.forEach(([key,lx,ly])=>c+=txL(lx+f.fs*3.1,ly+f.fs*.35,LINES[key].name+' ('+LINES[key].spot+')',fs*.8));c+=`${M.Q}\n`;
  pos.forEach(([key,lx,ly])=>{c+=`${M.q} ${spot(key)} ${(.35*k).toFixed(2)} ${M.w} ${dash(LINES[key].dash)} ${X(lx)} ${Y(ly)} ${M.m} ${X(lx+f.fs*2.6)} ${Y(ly)} ${M.l} ${M.S} ${M.Q}\n`})}
 return{c,f,k,X,Y,used:[...LAYER_KEYS.filter(x=>x!=='info'),'cut']}}
function pdfOf(s,on,meta={}){const{c,f,k,X,Y}=vecOps(s,on,'pdf');
 const W=(f.VW*k).toFixed(2),H=(f.VH*k).toFixed(2),tb=[X(f.cb[0]),Y(f.cb[3]),X(f.cb[2]),Y(f.cb[1])].join(' ');
 const keys=LAYER_KEYS.filter(x=>x!=='info'),csObj=7;
 const cs=keys.map((key,i)=>{const L=LINES[key];return`/CS_${key} ${csObj+i} 0 R`}).join(' ');
 const ob=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /TrimBox [${tb}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> /ExtGState << /GSop 6 0 R >> /ColorSpace << ${cs} >> >> >>`,
  `<< /Length ${c.length} >>\nstream\n${c}endstream`,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /ExtGState /OP true /op true /OPM 1 >>',
  ...keys.map(key=>{const L=LINES[key],n=L.spot==='All'?'/All':'/'+L.spot;return`[/Separation ${n} /DeviceCMYK << /FunctionType 2 /Domain [0 1] /C0 [0 0 0 0] /C1 [${L.cmyk.join(' ')}] /N 1 >>]`}),
  `<< /Title (${(meta.title||'Dieline').replace(/[()\\]/g,'').replace(/[^\x20-\x7e]/g,'')}) /Creator (Dieline Lab) /Subject (1:1 dieline, mm) /Producer (Dieline Lab) >>`];
 let out='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';const off=[];ob.forEach((o,i)=>{off.push(out.length);out+=`${i+1} 0 obj\n${o}\nendobj\n`});const xr=out.length;
 out+=`xref\n0 ${ob.length+1}\n0000000000 65535 f \n`+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${ob.length+1} /Root 1 0 R /Info ${ob.length} 0 R >>\nstartxref\n${xr}\n%%EOF`;
 const u=new Uint8Array(out.length);for(let i=0;i<out.length;i++)u[i]=out.charCodeAt(i)&255;return u}
function epsOf(s,on,meta={}){const{c,f,k}=vecOps(s,on,'eps');const W=Math.ceil(f.VW*k),H=Math.ceil(f.VH*k);
 const defs=LAYER_KEYS.filter(x=>x!=='info').map(key=>{const L=LINES[key],[C,M,Y,K]=L.cmyk;return`/CS_${key} [/Separation (${L.spot}) /DeviceCMYK {dup ${C} mul exch dup ${M} mul exch dup ${Y} mul exch ${K} mul}] def`}).join('\n');
 return`%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${W} ${H}\n%%HiResBoundingBox: 0 0 ${(f.VW*k).toFixed(2)} ${(f.VH*k).toFixed(2)}\n%%Title: ${(meta.title||'Dieline').replace(/[^\x20-\x7e]/g,'')}\n%%Creator: Dieline Lab\n%%DocumentCustomColors: ${LAYER_KEYS.filter(x=>x!=='info'&&x!=='reg').map(x=>'('+LINES[x].spot+')').join(' ')}\n%%EndComments\n${defs}\n${c}showpage\n%%EOF\n`}
function dxfOf(s){let e='';const L=(ly,cl,a,b)=>{e+=`0\nLINE\n8\n${ly}\n62\n${cl}\n10\n${a[0].toFixed(3)}\n20\n${(-a[1]).toFixed(3)}\n30\n0\n11\n${b[0].toFixed(3)}\n21\n${(-b[1]).toFixed(3)}\n31\n0\n`};
 const emit=(arr,ly,cl)=>arr.forEach(q=>{const p=q.p;for(let i=1;i<p.length;i++)L(ly,cl,p[i-1],p[i]);if(q.c&&p.length>2)L(ly,cl,p[p.length-1],p[0])});
 emit(s.cut,'CUT',1);emit(s.crease,'CREASE',5);emit(s.perf,'PERF',3);emit(s.glue,'GLUE',6);
 return `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n4\n${[['CUT',1],['CREASE',5],['PERF',3],['GLUE',6]].map(([n,c])=>`0\nLAYER\n2\n${n}\n70\n0\n62\n${c}\n6\nCONTINUOUS\n`).join('')}0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${e}0\nENDSEC\n0\nEOF\n`}
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function zip(files){const en=new TextEncoder(),parts=[],cen=[];let off=0;
 files.forEach(f=>{const nm=en.encode(f.name),dt=typeof f.data==='string'?en.encode(f.data):f.data,cr=crc(dt),l=new DataView(new ArrayBuffer(30)),c=new DataView(new ArrayBuffer(46));
  l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint16(12,0x21,true);l.setUint32(14,cr,true);l.setUint32(18,dt.length,true);l.setUint32(22,dt.length,true);l.setUint16(26,nm.length,true);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,0x21,true);c.setUint32(16,cr,true);c.setUint32(20,dt.length,true);c.setUint32(24,dt.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
  parts.push(new Uint8Array(l.buffer),nm,dt);cen.push(new Uint8Array(c.buffer),nm);off+=30+nm.length+dt.length});
 const cs=cen.reduce((a,b)=>a+b.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
 return new Blob([...parts,...cen,new Uint8Array(e.buffer)])}

/* Validation (Master prompt §15). Returns [level, message]; level ok | info | warn | err. */
function validate(genId,v,s){const it=IT[genId],W=[];
 (it.params||[]).forEach(p=>{if((p[2]==='n'||p[2]==='c')&&!(+v[p[0]]>=0))W.push(['err',p[1]+' is missing or negative'])});
 if(!s){W.push(['err','Geometry could not be generated from these values']);return W}
 const f=frame(s);if(!(f.w>0&&f.h>0)||!isFinite(f.w))W.push(['err','Template has no size']);
 const outer=s.cut.filter(q=>q.c).sort((a,b)=>{const A=bb([a]),B=bb([b]);return(B[2]-B[0])*(B[3]-B[1])-(A[2]-A[0])*(A[3]-A[1])});
 if(!outer.length)W.push(['err','No closed cut outline']);else if(selfCross(outer[0].p))W.push(['err','Cut outline crosses itself: check the dimensions']);
 if(it.kind==='A'&&!s.crease.length)W.push(['err','Structural template has no crease lines']);
 if('bleed' in v&&it.kind!=='C'&&v.bleed<2&&!(s.band.length&&s.bw>=2))W.push(['warn','Bleed under 2 mm: most printers ask for 3 mm']);
 const fw=f.fb[2]-f.fb[0],fh=f.fb[3]-f.fb[1];if(Math.max(fw,fh)>1000||Math.min(fw,fh)>700)W.push(['warn','Larger than a 70×100 cm sheet: needs large-format or tiling']);
 if(it.check)it.check(v,s,W);
 if(!W.some(x=>x[0]==='err'||x[0]==='warn'))W.unshift(['ok','Geometry checks passed: closed outline, positive sizes, fits 70×100']);
 if(it.kind==='A')W.push(['info','Structural template (Beta): confirm board, grain direction and tolerances with your converter before production.']);
 if(it.kind==='C')W.push(['info','Surface template: measure the real container; manufacturer blanks take priority.']);
 return W}
const reportTxt=(title,genId,v,s,W,prod)=>{const f=frame(s),it=IT[genId];return`DIELINE LAB — VALIDATION REPORT\n${title}\nGenerator: ${it.name} (${{A:'structural dieline',B:'flat print template',C:'surface / wrap template'}[it.kind]})\nGenerated: ${new Date().toISOString().slice(0,16).replace('T',' ')}\nFlat size: ${fmt(f.w)} × ${fmt(f.h)} mm (trim)\n\nPARAMETERS (structure)\n${(it.params||[]).map(p=>`  ${p[1]}: ${p[2]==='n'?fmt(+v[p[0]])+' mm':p[2]==='b'?(v[p[0]]?'yes':'no'):v[p[0]]}`).join('\n')||'  custom panels: '+JSON.stringify(v.panels)}\n\nPRODUCTION NOTES (artwork / finishing — do not change geometry)\n  Material: ${prod.mat}\n  Weight: ${prod.gsm} gsm\n  Lamination: ${prod.lam}\n  Finishes: ${prod.fin||'none'}\n  Print: ${prod.sides}\n\nCHECKS\n${W.map(([l,m])=>`  [${l.toUpperCase()}] ${m}`).join('\n')}\n\nThis template is mathematically generated. It is not factory-approved until a physical sample from your converter is signed off.\n`};

/* Illustrator script: turns the SVG's named groups into locked layers with spot swatches + overprint, then offers Save As .ai.
   Untested in Illustrator from here — see README. */
const JSX=`// Dieline Lab — Illustrator layer setup. File › Scripts › Other Script… with the exported .svg open.
#target illustrator
(function(){
 if(app.documents.length===0){alert('Open the exported dieline SVG first.');return;}
 var doc=app.activeDocument;
 var SPEC={CUT:[0,100,100,0,'Dieline-Cut'],CREASE:[100,50,0,0,'Dieline-Crease'],PERF:[80,0,100,0,'Dieline-Perf'],GLUE:[0,100,0,0,'Dieline-Glue'],BLEED:[0,50,100,0,'Dieline-Bleed'],BLEED_ZONE:[0,15,30,0,'Dieline-Bleed'],SAFE:[100,0,0,0,'Dieline-Safe'],REG:null,INFO:null,NOTES:null};
 var ORDER=['NOTES','INFO','REG','BLEED_ZONE','BLEED','SAFE','GLUE','PERF','CREASE','CUT'];
 function spot(name,c){for(var i=0;i<doc.spots.length;i++){if(doc.spots[i].name===name)return doc.spots[i];}var s=doc.spots.add();s.name=name;var k=new CMYKColor();k.cyan=c[0];k.magenta=c[1];k.yellow=c[2];k.black=c[3];s.color=k;s.colorType=ColorModel.SPOT;return s;}
 function findGroup(name){for(var i=0;i<doc.groupItems.length;i++){if(doc.groupItems[i].name===name)return doc.groupItems[i];}return null;}
 function recolor(it,sc){if(it.typename==='GroupItem'){for(var i=0;i<it.pageItems.length;i++)recolor(it.pageItems[i],sc);}else if(it.typename==='CompoundPathItem'){for(var j=0;j<it.pathItems.length;j++)recolor(it.pathItems[j],sc);}else if(it.typename==='PathItem'&&it.stroked){it.strokeColor=sc;it.strokeOverprint=true;}}
 var art=doc.layers.add();art.name='ARTWORK';
 var made=[];
 for(var j=0;j<ORDER.length;j++){var nm=ORDER[j],g=findGroup(nm);if(!g)continue;var L=doc.layers.add();L.name=nm;g.move(L,ElementPlacement.PLACEATBEGINNING);var sp=SPEC[nm];if(sp){var sc=new SpotColor();sc.spot=spot(sp[4],sp);sc.tint=100;recolor(g,sc);}made.push(L);}
 var a=findGroup('ARTWORK');if(a)a.move(art,ElementPlacement.PLACEATBEGINNING);
 for(var m=0;m<made.length;m++)made[m].locked=true;
 for(var n=doc.layers.length-1;n>=0;n--){var ly=doc.layers[n];if(ly.pageItems.length===0&&ly.name!=='ARTWORK'&&!ly.locked){try{ly.remove();}catch(e){}}}
 if(confirm('Layers ready: technical layers are locked above ARTWORK.\\nSave a copy as a native .ai file next to this one?')){var f=doc.fullName;var out=new File(f.parent+'/'+decodeURI(f.name).replace(/\\.(svg|pdf|eps)$/i,'')+'.ai');doc.saveAs(out,new IllustratorSaveOptions());}
})();
`;
