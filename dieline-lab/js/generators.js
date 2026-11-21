/* generators.js — parametric template families. Each family: params [key,label,type,default,options]
   type: n = length (mm, unit-converted) · c = plain number · s = select · b = checkbox.
   kind: A structural dieline · B flat print · C surface / wrap. flat:true adds crop marks.
   gen(v) returns a shape (see core.js S()). check(v,s,W) pushes extra validation lines. */
const IT={
bcard:{name:'Business card',sub:'Flat, folded, rounded, CR80',kind:'B',flat:true,
 params:[['w','Width','n',85],['h','Height','n',55],['r','Corner radius','n',0],['fold','Fold','s','none',['none','top','side']],['bleed','Bleed','n',3],['safe','Safe margin','n',4]],
 presets:{'Egypt / EU 85×55':{w:85,h:55,r:0},'Gulf 90×50':{w:90,h:50,r:0},'US 3.5×2 in':{w:88.9,h:50.8,r:0},'Japan 91×55':{w:91,h:55,r:0},'Square 65×65':{w:65,h:65,r:0},'Vertical 55×85':{w:55,h:85,r:0},'Slim 85×40':{w:85,h:40,r:0},'CR80 / ID 85.6×54':{w:85.6,h:53.98,r:3.18}},
 note:'Folded: <b>top</b> = tent fold on the long edge, <b>side</b> = book fold. Panel A is the outside front.',
 doc:'Trim = W×H (×2 when folded). Bleed and safe are offsets of the trim; rounded corners grow by the bleed.',
 gen(v){const s=S(),{w,h,r,bleed:b,safe:m}=v;let W=w,H=h;const pn=[[0,0,w,h]];
  if(v.fold==='top'){H=2*h;pn.push([0,h,w,h]);s.crease.push(P(ln(0,h,w,h),false))}
  if(v.fold==='side'){W=2*w;pn.push([w,0,w,h]);s.crease.push(P(ln(w,0,w,h),false))}
  s.cut.push(P(rr(0,0,W,H,r)));if(b>0)s.bleed.push(P(rr(-b,-b,W+2*b,H+2*b,r>0?r+b:0)));
  pn.forEach(([x,y,a,c],i)=>{if(m>0)s.safe.push(P(rect(x+m,y+m,a-2*m,c-2*m)));s.labels.push([x+a/2,y+c/2,pn.length>1?'PANEL '+'AB'[i]:'FRONT'])});return s},
 check(v,s,W){if(v.r>Math.min(v.w,v.h)/2)W.push(['err','Corner radius is larger than half the card']);if(v.safe<3)W.push(['warn','Safe margin under 3 mm: text may be trimmed'])}},
letterhead:{name:'Letterhead / A4 sheet',sub:'Letters, forms, invoices, memos',kind:'B',flat:true,
 params:[['w','Width','n',210],['h','Height','n',297],['margin','Safe margin','n',15],['folds','DIN fold + punch marks','b',true],['win','Address window guide (DIN 5008-B)','b',true],['bleed','Bleed','n',3]],
 presets:{'A4 210×297':{w:210,h:297},'US Letter':{w:215.9,h:279.4},'US Legal':{w:215.9,h:355.6},'A5 148×210':{w:148,h:210}},
 note:'Fold marks at 105 / 210 mm and the address window (20 mm left, 45 mm top, 85×45) match a DL window envelope when the letter is tri-folded.',
 doc:'Fold marks follow DIN 5008 form B on A4; other sizes fold in thirds. The window guide is a non-printing helper.',
 gen(v){const s=S(),{w,h,bleed:b,margin:m}=v;s.cut.push(P(rect(0,0,w,h)));if(b>0)s.bleed.push(P(rect(-b,-b,w+2*b,h+2*b)));s.safe.push(P(rect(m,m,w-2*m,h-2*m)));
  if(v.folds){const f=Math.abs(h-297)<1?[105,210]:[h/3,2*h/3];f.forEach(y=>{s.guides.push(P(ln(0,y,6,y),false));s.guides.push(P(ln(w-6,y,w,y),false))});s.guides.push(P(ln(0,h/2,9,h/2),false))}
  if(v.win){s.guides.push(P(rr(20,45,85,45,1)));s.labels.push([62.5,67.5,'ADDRESS WINDOW',.8])}
  s.labels.push([w/2,h*.62,'SHEET']);return s},
 check(v,s,W){if(v.win&&(v.w<120||v.h<100))W.push(['warn','Sheet is too small for a DL window address field'])}},
flat:{name:'Flat print',sub:'Slips, flyers, posters, tickets',kind:'B',flat:true,
 params:[['w','Width','n',210],['h','Height','n',99],['r','Corner radius','n',0],['perf','Tear-off stub width (0 = none)','n',0],['bleed','Bleed','n',3],['safe','Safe margin','n',5]],
 presets:{'Compliment slip DL 210×99':{w:210,h:99},'A0':{w:841,h:1189},'A1':{w:594,h:841},'A2':{w:420,h:594},'A3':{w:297,h:420},'A4':{w:210,h:297},'A5':{w:148,h:210},'A6':{w:105,h:148},'A7':{w:74,h:105},'US Letter':{w:215.9,h:279.4},'US Legal':{w:215.9,h:355.6},'US Tabloid':{w:279.4,h:431.8},'Poster 50×70 cm':{w:500,h:700},'Invitation 5×7 in':{w:127,h:178},'Bookmark 50×180':{w:50,h:180},'Event ticket + stub':{w:200,h:70,perf:50},'Coupon + stub':{w:150,h:70,perf:40}},
 note:'Any single sheet. The stub option adds a perforation line on the right for tickets, coupons and vouchers.',
 doc:'Trim = W×H. Perforation = vertical line at W − stub.',
 gen(v){const s=S(),{w,h,r,bleed:b,safe:m}=v;s.cut.push(P(rr(0,0,w,h,r)));if(b>0)s.bleed.push(P(rr(-b,-b,w+2*b,h+2*b,r>0?r+b:0)));
  const st=v.perf>0?v.perf:0;if(st){s.perf.push(P(ln(w-st,0,w-st,h),false));s.labels.push([w-st/2,h/2,'STUB',.7]);s.safe.push(P(rect(w-st+m,m,st-2*m,h-2*m)))}
  if(m>0)s.safe.push(P(rect(m,m,w-st-2*m,h-2*m)));s.labels.push([(w-st)/2,h/2,'ARTWORK']);return s},
 check(v,s,W){if(v.perf>=v.w)W.push(['err','Stub is wider than the sheet']);if(v.w>1000||v.h>1000)W.push(['info','Large format: printers usually ask for artwork at 1:10 or at 100 dpi'])}},
greeting:{name:'Folded card',sub:'Greeting, invitation, thank-you',kind:'B',flat:true,
 params:[['w','Closed width','n',105],['h','Closed height','n',148],['fold','Fold','s','side',['side','top']],['bleed','Bleed','n',3],['safe','Safe margin','n',5]],
 presets:{'A6 portrait 105×148':{w:105,h:148,fold:'side'},'A5 portrait 148×210':{w:148,h:210,fold:'side'},'5×7 in':{w:127,h:178,fold:'side'},'Square 150':{w:150,h:150,fold:'side'},'DL 99×210':{w:99,h:210,fold:'side'},'A6 tent 148×105':{w:148,h:105,fold:'top'}},
 note:'Outside spread shown. The inside spread is the same size, as page 2 of your artwork file.',
 doc:'Open size = 2W×H (side fold) or W×2H (top fold). On top-fold cards the back panel prints rotated 180°.',
 gen(v){const s=S(),{w,h,bleed:b,safe:m}=v,side=v.fold==='side',W=side?2*w:w,H=side?h:2*h;
  s.cut.push(P(rect(0,0,W,H)));if(b>0)s.bleed.push(P(rect(-b,-b,W+2*b,H+2*b)));s.crease.push(P(side?ln(w,0,w,h):ln(0,h,w,h),false));
  (side?[[0,0,'BACK'],[w,0,'FRONT']]:[[0,0,'BACK (print rotated 180)'],[0,h,'FRONT']]).forEach(([x,y,t])=>{s.safe.push(P(rect(x+m,y+m,w-2*m,h-2*m)));s.labels.push([x+w/2,y+h/2,t,t.length>8?.7:1])});return s}},
leaflet:{name:'Folded leaflet',sub:'Bi-fold, tri-fold, Z, gate',kind:'B',flat:true,
 params:[['w','Open width','n',297],['h','Height','n',210],['n','Panels','s','3',['2','3','4','5','6']],['type','Fold type','s','roll',['roll','z','gate']],['bleed','Bleed','n',3],['safe','Safe margin (per panel)','n',5]],
 presets:{'A4 tri-fold (roll)':{w:297,h:210,n:'3',type:'roll'},'A4 Z-fold':{w:297,h:210,n:'3',type:'z'},'A4 bi-fold':{w:297,h:210,n:'2',type:'z'},'A3 bi-fold':{w:420,h:297,n:'2',type:'z'},'A4 gate fold':{w:297,h:210,n:'3',type:'gate'},'DL 4-panel roll':{w:396,h:210,n:'4',type:'roll'}},
 note:'Roll fold makes the tuck-in panel 2 mm narrower so it folds flat. Gate: two outer flaps meet in the middle.',
 doc:'Roll: panel = (W+2)/n, last panel −2 mm. Z: W/n. Gate: W/4−1, W/2+2, W/4−1.',
 gen(v){const s=S(),{w,h,bleed:b,safe:m}=v;let n=+v.n,ws;
  if(v.type==='gate')ws=[w/4-1,w/2+2,w/4-1];else if(v.type==='roll'&&n>2){const q=(w+2)/n;ws=Array(n).fill(q);ws[n-1]=q-2}else ws=Array(n).fill(w/n);
  s.cut.push(P(rect(0,0,w,h)));if(b>0)s.bleed.push(P(rect(-b,-b,w+2*b,h+2*b)));let x=0;
  ws.forEach((q,i)=>{if(i)s.crease.push(P(ln(x,0,x,h),false));if(m>0)s.safe.push(P(rect(x+m,m,q-2*m,h-2*m)));s.labels.push([x+q/2,h/2,'PANEL '+(i+1)]);s.labels.push([x+q/2,h/2+Math.max(w,h)/30,'#'+q,.75]);x+=q});return s}},
envelope:{name:'Envelope',sub:'DL, C4–C6, square, wallet / pocket',kind:'A',
 params:[['style','Opening','s','wallet',['wallet','pocket']],['flap','Seal flap','s','straight',['straight','pointed','curved']],['long','Long side','n',220],['short','Short side','n',110],['flapD','Flap depth (0 = auto)','n',0],['sideW','Side flap width (0 = auto)','n',0],['botH','Bottom flap height (0 = auto)','n',0],['win','Window','b',false],['wx','Window from left','n',20],['wy','Window from bottom','n',15],['ww','Window width','n',90],['wh','Window height','n',45],['bleed','Bleed','n',3]],
 presets:{'DL 220×110':{long:220,short:110},'C6 162×114':{long:162,short:114},'C5 229×162':{long:229,short:162},'C4 324×229':{long:324,short:229},'B4 353×250':{long:353,short:250},'US #10':{long:241.3,short:104.8},'Monarch':{long:190.5,short:98.4},'A7 invitation':{long:184.2,short:133.4},'Square 155':{long:155,short:155},'Square 120':{long:120,short:120}},
 note:'Print (outside) view; flaps fold behind the front. <b>Wallet</b> opens on the long edge, <b>pocket</b> on the short edge. Window position is measured on the address face.',
 doc:'Front = W×H. Side flaps taper 6 mm at each end; bottom flap is a trapezoid at 12% inset; seal-flap gum band follows the flap edge 3 mm in.',
 gen(v){const s=S(),W=v.style==='wallet'?v.long:v.short,H=v.style==='wallet'?v.short:v.long;
  const F=v.flapD>0?v.flapD:(v.flap==='straight'?Math.max(25,H*.32):Math.min(W*.34,H*.62));
  const Sd=v.sideW>0?v.sideW:Math.min(Math.max(W*.12,14),W*.3),Bh=v.botH>0?v.botH:H*.58,y0=F;
  const dep=t=>v.flap==='straight'?F*Math.min(1,t*W/7,(1-t)*W/7):v.flap==='pointed'?F*(1-Math.abs(2*t-1)):F*Math.pow(Math.sin(Math.PI*t),.55);
  const top=v.flap==='straight'?[[0,y0],[7,0],[W-7,0],[W,y0]]:v.flap==='pointed'?[[0,y0],[W/2,0],[W,y0]]:Array.from({length:41},(_,i)=>[W*i/40,y0-dep(i/40)]);
  const o=dedupe([...top,[W+Sd,y0+6],[W+Sd,y0+H-6],[W,y0+H],[W*.88,y0+H+Bh],[W*.12,y0+H+Bh],[0,y0+H],[-Sd,y0+H-6],[-Sd,y0+6]]);
  s.cut.push(P(o));s.crease.push(P(rect(0,y0,W,H)));
  const a=[],c=[];for(let i=0;i<=30;i++){const t=.1+.8*i/30,d=dep(t);if(d<18)continue;a.push([t*W,y0-d+3]);c.unshift([t*W,y0-d+13])}
  if(a.length>2)s.glue.push(P([...a,...c]));
  s.glue.push(P([[3,y0+H+3],[W*.12+1,y0+H+Bh-3],[W*.12+9,y0+H+Bh-3],[11,y0+H+3]]));s.glue.push(P([[W-3,y0+H+3],[W*.88-1,y0+H+Bh-3],[W*.88-9,y0+H+Bh-3],[W-11,y0+H+3]]));
  if(v.win)s.cut.push(P(rr(v.wx,y0+H-v.wy-v.wh,v.ww,v.wh,2)));
  s.labels.push([W/2,y0+H*.3,'FRONT (address face)']);s.labels.push([W/2,y0-F*.35,'SEAL FLAP',.8]);s.labels.push([W/2,y0+H+Bh*.55,'BOTTOM FLAP',.8]);
  s.band.push(P(o));s.bw=v.bleed;s._W=W;s._H=H;return s},
 check(v,s,W){if(v.win&&(v.wx+v.ww>s._W-5||v.wy+v.wh>s._H-5))W.push(['err','Window does not fit inside the front panel']);if(v.flapD>s._H*.9)W.push(['warn','Seal flap deeper than 90% of the envelope height'])}},
folder:{name:'Presentation folder',sub:'A4 with pockets & card slits',kind:'A',
 params:[['pw','Panel width','n',220],['ph','Panel height','n',310],['sp','Spine (capacity)','n',5],['pk','Pocket height','n',100],['slits','Business-card slits','b',true],['bleed','Bleed','n',3]],
 presets:{'A4 folder 220×310':{pw:220,ph:310},'US Letter 9×12 in':{pw:229,ph:305},'A5 folder 160×220':{pw:160,ph:220,pk:75}},
 note:'Panels hold A4 with 5 mm clearance. Spine 0 = flat folder; 5–10 mm for thicker sets. Pocket tabs glue behind the covers.',
 doc:'Width = 2×panel + spine. Pockets fold up along the panel bottom; 12 mm tapered glue tabs on the outer edges.',
 gen(v){const s=S(),{pw,ph,sp,pk}=v,W2=2*pw+sp,g=12;
  const o=dedupe([[0,0],[W2,0],[W2,ph],[W2+g,ph+6],[W2+g,ph+pk-6],[W2,ph+pk],[pw+sp+16,ph+pk],[pw+sp+2,ph+12],[pw+sp,ph],[pw,ph],[pw-2,ph+12],[pw-16,ph+pk],[0,ph+pk],[-g,ph+pk-6],[-g,ph+6],[0,ph]]);
  s.cut.push(P(o));s.band.push(P(o));s.bw=v.bleed;
  s.crease.push(P(ln(pw,0,pw,ph),false));if(sp>0)s.crease.push(P(ln(pw+sp,0,pw+sp,ph),false));
  s.crease.push(P(ln(0,ph,pw,ph),false));s.crease.push(P(ln(pw+sp,ph,W2,ph),false));s.crease.push(P(ln(0,ph,0,ph+pk),false));s.crease.push(P(ln(W2,ph,W2,ph+pk),false));
  s.glue.push(P([[W2,ph],[W2+g,ph+6],[W2+g,ph+pk-6],[W2,ph+pk]]));s.glue.push(P([[0,ph],[-g,ph+6],[-g,ph+pk-6],[0,ph+pk]]));
  if(v.slits&&pk>=70){const cx=pw+sp+pw/2,cy=ph+pk/2-25;s.cut.push(P(ln(cx-47,cy+12,cx-33,cy-2),false));s.cut.push(P(ln(cx+47,cy+12,cx+33,cy-2),false));s.guides.push(P(rect(cx-45,cy,90,50)));s.labels.push([cx,cy+25,'CARD 90×50',.7])}
  s.labels.push([pw/2,ph/2,'BACK COVER']);s.labels.push([pw+sp+pw/2,ph/2,'FRONT COVER']);s.labels.push([pw/2,ph+pk*.55,'POCKET',.8]);return s},
 check(v,s,W){if(v.pk>v.ph*.5)W.push(['warn','Pocket is taller than half the panel']);if(v.slits&&v.pk<70)W.push(['info','Card slits need a pocket of 70 mm or more'])}},
casewrap:{name:'Book / notebook cover',sub:'Hardcover case, softcover, jacket',kind:'A',
 params:[['binding','Binding','s','hardcover',['hardcover','softcover','jacket']],['w','Trim width','n',148],['h','Trim height','n',210],['pages','Page count','c',192],['cal','Paper caliper (per sheet)','n',0.1],['bt','Board thickness','n',2.5],['sq','Squares (overhang)','n',3],['hg','Hinge gap','n',7],['ti','Turn-in','n',15],['fl','Jacket flap','n',80],['bleed','Bleed (softcover / jacket)','n',3]],
 presets:{'A5 notebook':{w:148,h:210,pages:192},'A4 notebook':{w:210,h:297,pages:160},'B5 notebook':{w:176,h:250,pages:160},'Pocket 90×140':{w:90,h:140,pages:160},'Guidelines book A4 landscape':{w:297,h:210,pages:60},'Magazine A4 softcover':{w:210,h:297,pages:48,binding:'softcover'}},
 note:'Spine is calculated from page count × caliper. Ask the bindery for the exact block thickness before final artwork.',
 doc:'Block T = pages/2 × caliper. Hardcover: board = (trim W + square − 3) × (trim H + 2 squares); case spine = T + 2×board + 2; corners mitred so the turn-in clears the board corner by ≈3 mm. Softcover spine = T + 0.5.',
 gen(v){const s=S(),{w,h,sq,hg,ti,bt}=v,T=v.pages/2*v.cal,b=v.bleed;
  if(v.binding==='softcover'){const sp=T+.5,W=2*w+sp;s.cut.push(P(rect(0,0,W,h)));s.bleed.push(P(rect(-b,-b,W+2*b,h+2*b)));[w,w+sp].forEach(x=>s.crease.push(P(ln(x,0,x,h),false)));
   s.safe.push(P(rect(5,5,w-10,h-10)));s.safe.push(P(rect(w+sp+5,5,w-10,h-10)));s.labels.push([w/2,h/2,'BACK COVER']);s.labels.push([w+sp+w/2,h/2,'FRONT COVER']);s.labels.push([w+sp/2,h*.1,'SPINE #'+sp.toFixed(2),.5]);s._sp=sp;return s}
  const bw=w+sq-3,bh=h+2*sq,S2=T+2*bt+2;
  if(v.binding==='jacket'){const pw=bw+1,sp=S2+2,f=v.fl,W=2*f+2*pw+sp,xs=[f,f+pw,f+pw+sp,f+2*pw+sp];s.cut.push(P(rect(0,0,W,bh)));s.bleed.push(P(rect(-b,-b,W+2*b,bh+2*b)));xs.forEach(x=>s.crease.push(P(ln(x,0,x,bh),false)));
   [[f/2,'FLAP'],[f+pw/2,'BACK'],[f+pw+sp/2,'SPINE'],[f+pw+sp+pw/2,'FRONT'],[W-f/2,'FLAP']].forEach(([x,t])=>s.labels.push([x,bh/2,t,t==='SPINE'?.5:.9]));s._sp=sp;return s}
  const Wt=2*ti+2*bw+2*hg+S2,Ht=2*ti+bh,c=bt*1.5+1,k=2*ti-c;
  const o=[[k,0],[Wt-k,0],[Wt,k],[Wt,Ht-k],[Wt-k,Ht],[k,Ht],[0,Ht-k],[0,k]];s.cut.push(P(o));
  s.crease.push(P(ln(ti,ti,ti,Ht-ti),false));s.crease.push(P(ln(Wt-ti,ti,Wt-ti,Ht-ti),false));s.crease.push(P(ln(ti,ti,Wt-ti,ti),false));s.crease.push(P(ln(ti,Ht-ti,Wt-ti,Ht-ti),false));
  const xb2=ti+bw+2*hg+S2;s.guides.push(P(rect(ti,ti,bw,bh)));s.guides.push(P(rect(ti+bw+hg,ti,S2,bh)));s.guides.push(P(rect(xb2,ti,bw,bh)));
  s.safe.push(P(rect(ti+6,ti+6,bw-12,bh-12)));s.safe.push(P(rect(xb2+6,ti+6,bw-12,bh-12)));
  s.labels.push([ti+bw/2,Ht/2,'BACK BOARD']);s.labels.push([xb2+bw/2,Ht/2,'FRONT BOARD']);s.labels.push([ti+bw+hg+S2/2,ti+bh*.1,'SPINE #'+S2.toFixed(2),.5]);s.labels.push([Wt/2,ti/2+1,'TURN-IN',.6]);s._sp=S2;return s},
 check(v,s,W){if(s._sp<3)W.push(['warn','Spine under 3 mm: consider saddle stitch or wire binding']);if(v.pages%4)W.push(['info','Page count is not a multiple of 4'])}},
tuck:{name:'Tuck end box',sub:'Reverse (RTE) / straight (STE)',kind:'A',
 params:[['style','Style','s','reverse',['reverse','straight']],['L','Length (front)','n',70],['W','Width (side)','n',40],['H','Height','n',120],['t','Board thickness','n',.4],['g','Glue flap','n',15]],
 presets:{'Cosmetic 40×40×120':{L:40,W:40,H:120},'Perfume 60×60×110':{L:60,W:60,H:110},'Tea / coffee 70×40×120':{L:70,W:40,H:120},'Supplement 60×60×130':{L:60,W:60,H:130},'Soap 95×35×65':{L:95,W:35,H:65},'Pharma 80×20×120':{L:80,W:20,H:120,style:'straight'}},
 note:'Enter <b>internal</b> dimensions; thickness is added to the panels. 300–350 gsm board ≈ 0.4–0.5 mm.',
 doc:'Panels glue | L+t | W+t | L+t | W+t, height H+2t. Lid depth = W, tongue = clamp(0.4W, 8, 15). Dust flap = min(0.45L, 0.75W).',
 gen(v){const s=S(),t=v.t,L=v.L+t,W=v.W+t,H=v.H+2*t,g=v.g,Tk=Math.min(15,Math.max(8,W*.4)),Dh=Math.min(L*.45,W*.75),y0=W+Tk+2,y1=y0+H;
  const ws=[L,W,L,W],nm=['FRONT','SIDE','BACK','SIDE'];let x=g;
  const pn=ws.map((q,i)=>{const p={a:x,b:x+q,i};x+=q;return p});
  pn.forEach(p=>{p.top=p.i===2?'lid':p.i%2?'dust':'';p.bot=v.style==='reverse'?(p.i===0?'lid':p.i%2?'dust':''):(p.i===2?'lid':p.i%2?'dust':'')});
  let o=[[g,y0]];pn.forEach(p=>o.push(...flapPts(p.a,p.b,p.top,y0,-1,W,Tk,Dh)));o.push([x,y1]);[...pn].reverse().forEach(p=>o.push(...flapPts(p.a,p.b,p.bot,y1,1,W,Tk,Dh).reverse()));o.push([g,y1],[0,y1-6],[0,y0+6]);
  o=dedupe(o);s.cut.push(P(o));s.band.push(P(o));s.bw=3;
  s.crease.push(P(ln(g,y0,g,y1),false));pn.slice(1).forEach(p=>s.crease.push(P(ln(p.a,y0,p.a,y1),false)));
  pn.forEach(p=>{if(p.top)s.crease.push(P(ln(p.a,y0,p.b,y0),false));if(p.bot)s.crease.push(P(ln(p.a,y1,p.b,y1),false));if(p.top==='lid'){s.crease.push(P(ln(p.a,y0-W,p.b,y0-W),false));s.labels.push([(p.a+p.b)/2,y0-W/2,'TOP TUCK',.75])}if(p.bot==='lid'){s.crease.push(P(ln(p.a,y1+W,p.b,y1+W),false));s.labels.push([(p.a+p.b)/2,y1+W/2,'BOTTOM TUCK',.75])}s.labels.push([(p.a+p.b)/2,(y0+y1)/2,nm[p.i],p.i%2?.7:1])});
  s.glue.push(P([[g,y0],[0,y0+6],[0,y1-6],[g,y1]]));return s},
 check(v,s,W){if(v.W>v.L*1.6)W.push(['info','Side is much deeper than the front: the tuck lid will be long']);if(v.H<v.W)W.push(['warn','Height is smaller than depth: consider a tray or mailer instead'])}},
rsc:{name:'Shipping carton (RSC)',sub:'Corrugated regular slotted case',kind:'A',
 params:[['L','Length','n',300],['W','Width','n',200],['H','Height','n',150],['t','Board thickness (flute)','n',3],['g','Glue / stitch flap','n',35],['slot','Slot width','n',6]],
 presets:{'Small 200×150×100':{L:200,W:150,H:100},'Medium 300×200×150':{L:300,W:200,H:150},'Large 400×300×300':{L:400,W:300,H:300,t:4},'E-commerce 350×250×100':{L:350,W:250,H:100}},
 note:'Internal dimensions. Top and bottom flaps each reach half the width so the long flaps meet in the middle. B-flute ≈ 3 mm, C ≈ 4 mm, E ≈ 1.5 mm.',
 doc:'Panels glue | L+t | W+t | L+t | W+t, body H+t, flaps (W+t)/2 + t/2, slots between flaps.',
 gen(v){const s=S(),t=v.t,L=v.L+t,W=v.W+t,H=v.H+t,g=v.g,sl=v.slot,F=W/2+t/2,y0=F,y1=F+H;
  const ws=[L,W,L,W];let x=g;const pn=ws.map(q=>{const p={a:x,b:x+q};x+=q;return p});
  const o=[[g,y0],[g,0]];pn.forEach((p,i)=>{if(i<3)o.push([p.b-sl/2,0],[p.b-sl/2,y0],[p.b+sl/2,y0],[p.b+sl/2,0]);else o.push([p.b,0],[p.b,y0])});
  o.push([x,y1],[x,y1+F]);for(let i=3;i>=0;i--){const p=pn[i];if(i>0)o.push([p.a+sl/2,y1+F],[p.a+sl/2,y1],[p.a-sl/2,y1],[p.a-sl/2,y1+F]);else o.push([g,y1+F],[g,y1])}
  o.push([0,y1-10],[0,y0+10]);s.cut.push(P(dedupe(o)));s.band.push(P(o));s.bw=3;
  pn.forEach((p,i)=>{const a=i?p.a+sl/2:p.a,b=i<3?p.b-sl/2:p.b;s.crease.push(P(ln(a,y0,b,y0),false));s.crease.push(P(ln(a,y1,b,y1),false))});
  s.crease.push(P(ln(g,y0,g,y1),false));pn.slice(1).forEach(p=>s.crease.push(P(ln(p.a,y0,p.a,y1),false)));s.glue.push(P([[g,y0],[0,y0+10],[0,y1-10],[g,y1]]));
  ['LENGTH','WIDTH','LENGTH','WIDTH'].forEach((n,i)=>{const p=pn[i];s.labels.push([(p.a+p.b)/2,(y0+y1)/2,n,i%2?.75:1]);s.labels.push([(p.a+p.b)/2,y0/2,'FLAP',.6]);s.labels.push([(p.a+p.b)/2,y1+F/2,'FLAP',.6])});return s},
 check(v,s,W){if(v.slot<v.t)W.push(['warn','Slot narrower than board thickness: flaps may bind'])}},
mailer:{name:'Mailer box',sub:'Roll-end tuck front, pizza, cake',kind:'A',
 params:[['L','Length','n',250],['W','Width (depth)','n',180],['H','Height','n',60],['t','Board thickness','n',1.5]],
 presets:{'E-commerce 250×180×60':{L:250,W:180,H:60},'Subscription 300×220×80':{L:300,W:220,H:80},'Pizza 330×330×40':{L:330,W:330,H:40},'Cake 250×250×120':{L:250,W:250,H:120,t:.6},'Donut box 250×170×70':{L:250,W:170,H:70,t:.6},'Small mailer 160×120×50':{L:160,W:120,H:50}},
 note:'Glueless one-piece box: double side walls lock into base slots, the lid tucks into the front. E-flute ≈ 1.5 mm; folding board ≈ 0.6 mm.',
 doc:'Rows: tuck (0.8H) / lid (W) / back wall (H) / base (W) / front wall (H) / inner front (H−t). Side walls H + inner H−t with lock tabs; slots in base at t from the edges.',
 gen(v){const s=S(),{L,W,H,t}=v,T=Math.min(H*.8,W*.45),ya=0,yb=T,yc=T+W,yd=yc+H,ye=yd+W,yf=ye+H,yg=yf+H-t,iw=H-t,m1=yd+W*.3,m2=yd+W*.7,tb=12;
  const R=[],Lf=[];// right side top→bottom, mirrored for left
  const side=(X,d)=>{const x=o=>X+d*o;return[[x(0),yb+2],[x(H-2),yb+10],[x(H-2),yc-6],[x(0),yc-1],[x(0),yc+2],[x(H-2),yc+H*.35],[x(H-2),yd-2],[x(2),yd-2],[x(0),yd],[x(H),yd],[x(H+iw),yd+4],[x(H+iw),m1-tb/2],[x(H+iw+4),m1-tb/2+1],[x(H+iw+4),m1+tb/2-1],[x(H+iw),m1+tb/2],[x(H+iw),m2-tb/2],[x(H+iw+4),m2-tb/2+1],[x(H+iw+4),m2+tb/2-1],[x(H+iw),m2+tb/2],[x(H+iw),ye-4],[x(H),ye],[x(0),ye]]};
  const r=side(L,1),l=side(0,-1).reverse();
  const tabs=[3*L/4,L/4];const bot=[[L,yf],[L-1,yf+1],[L-1,yg]];tabs.forEach(c=>bot.push([c+8,yg],[c+7,yg+4],[c-7,yg+4],[c-8,yg]));bot.push([1,yg],[1,yf+1],[0,yf]);
  const o=dedupe([[0,yb],[2,ya+6],[8,ya],[L-8,ya],[L-2,ya+6],[L,yb],...r,...bot,...l]);
  s.cut.push(P(o));s.band.push(P(o));s.bw=3;
  [[t,m1],[t,m2],[L-t-3,m1],[L-t-3,m2]].forEach(([x,y])=>s.cut.push(P(rect(x,y-tb/2,3,tb))));tabs.forEach(c=>s.cut.push(P(rect(c-8,ye-t-3,16,3))));
  [yb,yc,yd,ye,yf].forEach(y=>s.crease.push(P(ln(0,y,L,y),false)));
  [[yb,yc],[yc,yd],[yd,ye]].forEach(([a,b])=>{s.crease.push(P(ln(0,a,0,b),false));s.crease.push(P(ln(L,a,L,b),false))});s.crease.push(P(ln(-H,yd,-H,ye),false));s.crease.push(P(ln(L+H,yd,L+H,ye),false));
  [[yb/2,'TUCK',.7],[(yb+yc)/2,'LID',1],[(yc+yd)/2,'BACK WALL',.7],[(yd+ye)/2,'BASE',1],[(ye+yf)/2,'FRONT',.7],[(yf+yg)/2,'INNER FRONT',.6]].forEach(([y,n,k])=>s.labels.push([L/2,y,n,k]));
  s.labels.push([-H/2,(yd+ye)/2,'SIDE',.55]);s.labels.push([L+H/2,(yd+ye)/2,'SIDE',.55]);return s},
 check(v,s,W){if(v.H>v.W*.6)W.push(['warn','Tall walls for this depth: the lid tuck may not reach the front']);if(v.t>2)W.push(['info','Thick board: add extra clearance to the inner walls'])}},
tray:{name:'Tray / lid',sub:'Glued corners, two-piece box',kind:'A',
 params:[['part','Part','s','base',['base','lid']],['L','Length','n',150],['W','Width','n',100],['H','Wall height (base)','n',40],['lh','Lid height','n',30],['c','Lid clearance','n',1.5],['t','Board thickness','n',.5]],
 presets:{'Gift box 150×100×40':{L:150,W:100,H:40},'Jewellery 90×90×35':{L:90,W:90,H:35,lh:25},'Shirt box 300×220×60':{L:300,W:220,H:60,lh:40},'Shoe box 330×200×120':{L:330,W:200,H:120,lh:40},'Card box 95×60×30':{L:95,W:60,H:30,lh:20}},
 note:'Make the <b>base</b>, then switch to <b>lid</b>: it grows by thickness + clearance. Ears glue inside the short walls. For rigid boxes, this is the board layout before wrapping.',
 doc:'Base L×W (+t). Walls H. Lid = base + 2t + clearance, wall = lid height. Ears (H−2) glue inside the end walls.',
 gen(v){const s=S();let L=v.L+v.t,W=v.W+v.t,H=v.H;if(v.part==='lid'){L+=2*v.t+v.c;W+=2*v.t+v.c;H=v.lh}
  const x0=H,y0=H,e=2;
  const o=[[x0,y0-H],[x0+L,y0-H],[x0+L+H-e,y0-H+3],[x0+L+H-e,y0-1.5],[x0+L,y0],[x0+L+H,y0],[x0+L+H,y0+W],[x0+L,y0+W],[x0+L+H-e,y0+W+1.5],[x0+L+H-e,y0+W+H-3],[x0+L,y0+W+H],[x0,y0+W+H],[x0-H+e,y0+W+H-3],[x0-H+e,y0+W+1.5],[x0,y0+W],[x0-H,y0+W],[x0-H,y0],[x0,y0],[x0-H+e,y0-1.5],[x0-H+e,y0-H+3]];
  s.cut.push(P(o));s.band.push(P(o));s.bw=3;s.crease.push(P(rect(x0,y0,L,W)));
  [[x0,y0-H,x0,y0],[x0+L,y0-H,x0+L,y0],[x0,y0+W,x0,y0+W+H],[x0+L,y0+W,x0+L,y0+W+H]].forEach(q=>s.crease.push(P(ln(...q),false)));
  [[[x0,y0-H],[x0-H+e,y0-H+3],[x0-H+e,y0-1.5],[x0,y0]],[[x0+L,y0-H],[x0+L+H-e,y0-H+3],[x0+L+H-e,y0-1.5],[x0+L,y0]],[[x0,y0+W],[x0-H+e,y0+W+1.5],[x0-H+e,y0+W+H-3],[x0,y0+W+H]],[[x0+L,y0+W],[x0+L+H-e,y0+W+1.5],[x0+L+H-e,y0+W+H-3],[x0+L,y0+W+H]]].forEach(q=>s.glue.push(P(q)));
  s.labels.push([x0+L/2,y0+W/2,v.part==='lid'?'LID TOP':'BASE']);s.labels.push([x0+L/2,y0-H/2,'WALL',.7]);s.labels.push([x0+L/2,y0+W+H/2,'WALL',.7]);return s},
 check(v,s,W){if(v.part==='lid'&&v.lh>v.H)W.push(['warn','Lid is taller than the base walls'])}},
sleeve:{name:'Sleeve / belly band',sub:'Slides over a box or tray',kind:'A',
 params:[['L','Box length','n',150],['H','Box height','n',40],['S','Sleeve width','n',100],['thumb','Thumb notches','b',true],['g','Glue flap','n',15]],
 note:'Enter the outside size of the box it slides over; add ~1 mm to L and H for an easy slide.',
 doc:'Panels L | H | L | H | glue, height = sleeve width. Thumb notch r 10 at the centre of the front edges.',
 gen(v){const s=S(),{L,H,S:Sw,g}=v,r=10,cx=L/2,X=2*L+2*H;
  const top=v.thumb?[[0,0],[cx-r,0],...arc(cx,0,r,180,0,14),[cx+r,0],[X,0]]:[[0,0],[X,0]];
  const bot=v.thumb?[[X,Sw],[cx+r,Sw],...arc(cx,Sw,r,0,-180,14),[cx-r,Sw],[0,Sw]]:[[X,Sw],[0,Sw]];
  const o=dedupe([...top,[X+g,6],[X+g,Sw-6],...bot]);s.cut.push(P(o));s.band.push(P(o));s.bw=3;
  [L,L+H,2*L+H,X].forEach(x=>s.crease.push(P(ln(x,0,x,Sw),false)));s.glue.push(P([[X,0],[X+g,6],[X+g,Sw-6],[X,Sw]]));
  ['FRONT','SIDE','BACK','SIDE'].forEach((n,i)=>s.labels.push([[L/2,L+H/2,L+H+L/2,2*L+1.5*H][i],Sw/2,n,i%2?.7:1]));return s},
 check(v,s,W){if(v.thumb&&v.S<30)W.push(['warn','Sleeve too narrow for thumb notches'])}},
pillow:{name:'Pillow box',sub:'Curved ends, no glue at ends',kind:'A',
 params:[['L','Length','n',160],['W','Face width','n',90],['D','End curve depth','n',20],['g','Glue flap','n',12]],
 note:'Curve depth sets the thickness (≈ 2 × depth when closed). Curved creases need a bent scoring rule.',
 doc:'Two faces W + glue flap, length L. Ends: outward circular arcs (cut) and inward arcs (crease) of depth D.',
 gen(v){const s=S(),{L,W,D,g}=v,y0=D,y1=D+L;
  const o=dedupe([[g,y0],...bulge(g,g+W,y0,D,-1),...bulge(g+W,g+2*W,y0,D,-1),[g+2*W,y1],...bulge(g+W,g+2*W,y1,D,1).reverse(),...bulge(g,g+W,y1,D,1).reverse(),[0,y1-8],[0,y0+8]]);
  s.cut.push(P(o));s.band.push(P(o));s.bw=3;[[g,g+W],[g+W,g+2*W]].forEach(([a,b])=>{s.crease.push(P(bulge(a,b,y0,D,1),false));s.crease.push(P(bulge(a,b,y1,D,-1),false))});
  s.crease.push(P(ln(g,y0,g,y1),false));s.crease.push(P(ln(g+W,y0,g+W,y1),false));s.glue.push(P([[g,y0],[0,y0+8],[0,y1-8],[g,y1]]));
  s.labels.push([g+W/2,(y0+y1)/2,'FRONT']);s.labels.push([g+1.5*W,(y0+y1)/2,'BACK']);return s},
 check(v,s,W){if(v.D>v.W*.4)W.push(['err','Curve depth too large for the face width']);if(v.D<5)W.push(['warn','Very shallow curve: the box will barely open'])}},
bag:{name:'Paper shopping bag',sub:'Gusseted, top hem, rope holes',kind:'A',
 params:[['W','Width','n',250],['G','Gusset','n',100],['H','Height','n',320],['hem','Top hem (fold-in)','n',40],['holes','Rope holes','b',true],['hd','Hole diameter','n',5]],
 presets:{'Small 180×80×220':{W:180,G:80,H:220},'Medium 250×100×320':{W:250,G:100,H:320},'Large 320×120×420':{W:320,G:120,H:420},'Wine 100×90×360':{W:100,G:90,H:360,hem:35}},
 note:'Bottom section = gusset ÷ 2 + 15 mm overlap. The hem folds inside and reinforces the handle holes. Confirm the bottom fold with your bag converter.',
 doc:'Panels front W | gusset G | back W | gusset G | glue 20. Height hem + H + (G/2 + 15). Gusset V-creases at the bottom.',
 gen(v){const s=S(),{W,G,H,hem}=v,B=G/2+15,Ht=hem+H+B,X4=2*W+2*G,yb=hem+H;
  const o=[[0,0],[X4,0],[X4+20,6],[X4+20,Ht-6],[X4,Ht],[0,Ht]];s.cut.push(P(o));s.band.push(P(o));s.bw=3;
  [W,W+G/2,W+G,2*W+G,2*W+1.5*G,X4].forEach(x=>s.crease.push(P(ln(x,0,x,Ht),false)));[hem,yb,yb+G/2].forEach(y=>s.crease.push(P(ln(0,y,X4,y),false)));
  [W,2*W+G].forEach(xg=>{s.crease.push(P(ln(xg,yb,xg+G/2,yb+G/2),false));s.crease.push(P(ln(xg+G,yb,xg+G/2,yb+G/2),false))});
  s.glue.push(P([[X4,0],[X4+20,6],[X4+20,Ht-6],[X4,Ht]]));s.glue.push(P(rect(W+G,Ht-12,W,10)));
  if(v.holes){const d=Math.max(30,W*.18);[W/2,W+G+W/2].forEach(c=>[c-d,c+d].forEach(x=>{s.cut.push(P(circ(x,hem+25,v.hd/2,24)));s.cut.push(P(circ(x,hem-25,v.hd/2,24)))}))}
  s.labels.push([W/2,hem+H/2,'FRONT']);s.labels.push([W+G+W/2,hem+H/2,'BACK']);s.labels.push([W+G/2,hem+H/2,'GUSSET',.7]);s.labels.push([2*W+1.5*G,hem+H/2,'GUSSET',.7]);s.labels.push([W/2,hem/2,'HEM (folds in)',.65]);return s},
 check(v,s,W){if(v.G>v.W)W.push(['warn','Gusset wider than the front']);if(v.holes&&v.hem<35)W.push(['warn','Hem under 35 mm is weak for rope handles'])}},
label:{name:'Wrap label',sub:'Bottles, jars, cans, tubes',kind:'C',flat:true,
 params:[['D','Container diameter','n',70],['h','Label height','n',90],['ov','Overlap','n',10],['r','Corner radius','n',0],['bleed','Bleed','n',3],['safe','Safe margin','n',3]],
 presets:{'Jar Ø70':{D:70,h:60},'Water bottle Ø65':{D:65,h:70},'Wine Ø76':{D:76,h:100},'Can 330 ml Ø66':{D:66,h:115,ov:0},'Candle jar Ø80':{D:80,h:60}},
 note:'Length = π × diameter + overlap. Keep text out of the overlap strip. Straight-sided containers only; tapered ones need the cup/cone generator.',
 doc:'Width = πD + overlap; overlap marked as glue.',
 gen(v){const s=S(),C=Math.PI*v.D+v.ov,{h,bleed:b,safe:m}=v;s.cut.push(P(rr(0,0,C,h,v.r)));if(b>0)s.bleed.push(P(rr(-b,-b,C+2*b,h+2*b,v.r>0?v.r+b:0)));if(v.ov>0)s.glue.push(P(rect(C-v.ov,0,v.ov,h)));s.safe.push(P(rect(m,m,C-v.ov-2*m,h-2*m)));s.labels.push([(C-v.ov)/2,h/2,'FRONT']);return s},
 check(v,s,W){if(v.ov>0&&v.ov<5)W.push(['warn','Overlap under 5 mm may not hold'])}},
cupwrap:{name:'Cup / cone wrap',sub:'Paper cups, sleeves, tubs, bowls',kind:'C',
 params:[['Dt','Top (rim) diameter','n',90],['Db','Bottom diameter','n',60],['h','Wall height','n',110],['ov','Overlap','n',8],['bleed','Bleed','n',2]],
 presets:{'8 oz cup Ø80/56 × 92':{Dt:80,Db:56,h:92},'12 oz cup Ø90/60 × 110':{Dt:90,Db:60,h:110},'16 oz cup Ø90/60 × 135':{Dt:90,Db:60,h:135},'Cup sleeve Ø88/74 × 60':{Dt:88,Db:74,h:60,ov:10},'Ice-cream tub Ø118/95 × 80':{Dt:118,Db:95,h:80},'Bowl Ø150/120 × 70':{Dt:150,Db:120,h:70}},
 note:'Typical sizes only: measure your cup or ask the cup maker for its blank. The artwork follows the arc; keep text within the safe band.',
 doc:'Conic development: slant s = √(h² + ((Dt−Db)/2)²), outer radius Ro = s·Dt/(Dt−Db), inner Ri = Ro − s, sweep θ = π·Dt/Ro. Arc length at the rim = π·Dt exactly. Equal diameters fall back to a rectangle.',
 gen(v){const s=S(),{Dt,Db,h,ov}=v;
  if(Dt-Db<.5){const C=Math.PI*Dt+ov;s.cut.push(P(rect(0,0,C,h)));s.glue.push(P(rect(C-ov,0,ov,h)));s.band.push(P(rect(0,0,C,h)));s.bw=v.bleed;s.labels.push([C/2,h/2,'WRAP']);return s}
  const sl=Math.hypot(h,(Dt-Db)/2),Ro=sl*Dt/(Dt-Db),Ri=Ro-sl,th=Math.PI*Dt/Ro,oa=ov/Ro,a0=-Math.PI/2-(th+oa)/2,a1=-Math.PI/2+(th+oa)/2;
  const o=[...arcRad(Ro,a0,a1,72),...arcRad(Ri,a1,a0,72)];s.cut.push(P(o));s.band.push(P(o));s.bw=v.bleed;
  if(ov>0)s.glue.push(P([...arcRad(Ro,a1-oa,a1,8),...arcRad(Ri,a1,a1-oa,8)]));
  const m=4;s.safe.push(P([...arcRad(Ro-m,a0+m/Ro,a1-oa-m/Ro,60),...arcRad(Ri+m,a1-oa-m/Ri,a0+m/Ri,60)]));
  const mid=-Math.PI/2;s.labels.push([Math.cos(mid)*(Ro-sl*.35),Math.sin(mid)*(Ro-sl*.35),'RIM SIDE']);s.labels.push([Math.cos(mid)*(Ri+sl*.15),Math.sin(mid)*(Ri+sl*.15),'BOTTOM',.6]);
  s._info=`Ro ${fmt(Ro)} · Ri ${fmt(Ri)} · sweep ${fmt(th/DEG)}°`;return s},
 check(v,s,W){if(v.Db>v.Dt)W.push(['err','Bottom diameter is larger than the rim — swap the values']);if(v.ov<5)W.push(['warn','Overlap under 5 mm']);if(s._info)W.push(['info','Development: '+s._info])}},
pouch:{name:'Pouch layout',sub:'Flat, stand-up, pillow (flow wrap)',kind:'C',
 params:[['type','Type','s','flat',['flat','standup','pillow']],['W','Width','n',120],['H','Height','n',180],['G','Bottom gusset (stand-up)','n',70],['seal','Side seal','n',8],['top','Top seal','n',12],['zip','Zipper','b',false],['notch','Tear notches','b',true],['hang','Hang hole (euro slot)','b',false],['fin','Back seal fin (pillow)','n',10]],
 presets:{'Sachet 80×100':{type:'flat',W:80,H:100,seal:6,top:8},'Flat pouch 120×180':{type:'flat',W:120,H:180},'Stand-up 150×230+80':{type:'standup',W:150,H:230,G:80,zip:true},'Coffee stand-up 130×200+70':{type:'standup',W:130,H:200,G:70,zip:true},'Snack flow wrap 140×200':{type:'pillow',W:140,H:200,fin:12}},
 note:'Layout guide for artwork. Flexible packaging is printed on a web: the converter defines repeat, web width and exact seal widths — confirm before final artwork.',
 doc:'Flat: front | back with seal bands. Stand-up: front | back + W×G gusset folded at G/2. Pillow: one web fin | back ½ | front | back ½ | fin with end seals.',
 gen(v){const s=S(),{W,H,seal:se,top:tp}=v,gap=12,lab=(x,y,t,k=1)=>s.labels.push([x,y,t,k]);
  const panel=(x,y,name,doTop=true)=>{s.cut.push(P(rect(x,y,W,H)));s.glue.push(P(rect(x,y,se,H)));s.glue.push(P(rect(x+W-se,y,se,H)));if(doTop)s.glue.push(P(rect(x+se,y,W-2*se,tp)));
   s.safe.push(P(rect(x+se+3,y+tp+3,W-2*se-6,H-tp-se-6)));lab(x+W/2,y+H/2,name);
   if(v.notch){[[x,1],[x+W,-1]].forEach(([nx,d])=>s.cut.push(P([[nx,y+tp+6],[nx+d*4,y+tp+8],[nx,y+tp+10]],false)))}
   if(v.zip){s.guides.push(P(ln(x+se,y+tp+18,x+W-se,y+tp+18),false));lab(x+W/2,y+tp+16,'ZIPPER',.45)}
   if(v.notch)s.perf.push(P(ln(x+se,y+tp+8,x+W-se,y+tp+8),false));
   if(v.hang)s.cut.push(P(rr(x+W/2-15,y+tp/2-3.5,30,7,3.5)))};
  if(v.type==='pillow'){const f=v.fin,Wt=2*f+2*W;s.cut.push(P(rect(0,0,Wt,H)));s.glue.push(P(rect(0,0,f,H)));s.glue.push(P(rect(Wt-f,0,f,H)));s.glue.push(P(rect(f,0,2*W,tp)));s.glue.push(P(rect(f,H-tp,2*W,tp)));
   [f+W/2,f+W/2+W].forEach(x=>s.guides.push(P(ln(x,0,x,H),false)));s.safe.push(P(rect(f+W/2+4,tp+4,W-8,H-2*tp-8)));lab(f+W/2+W/2,H/2,'FRONT');lab(f+W/4,H/2,'BACK',.6);lab(f+W/2+W+W/4,H/2,'BACK',.6);lab(f/2,H/2,'FIN',.4);return s}
  panel(0,0,'FRONT');panel(W+gap,0,'BACK');s.glue.push(P(rect(se,H-se,W-2*se,se)));s.glue.push(P(rect(W+gap+se,H-se,W-2*se,se)));
  if(v.type==='standup'){const G=v.G,y=H+gap;s.cut.push(P(rect(0,y,W,G)));s.crease.push(P(ln(0,y+G/2,W,y+G/2),false));s.glue.push(P(rect(0,y,W,8)));s.glue.push(P(rect(0,y+G-8,W,8)));lab(W/2,y+G/2-4,'BOTTOM GUSSET',.55)}
  return s},
 check(v,s,W){if(v.type==='standup'&&v.G>v.H*.5)W.push(['warn','Gusset deeper than half the height']);if(v.hang&&v.top<12)W.push(['err','Top seal must be at least 12 mm for a hang hole'])}},
tag:{name:'Hang tag',sub:'Apparel & product tags',kind:'B',
 params:[['w','Width','n',50],['h','Height','n',90],['corner','Corners','s','chamfer',['chamfer','round','square']],['r','Corner size','n',8],['hole','Hole diameter','n',5],['bleed','Bleed','n',3]],
 presets:{'Apparel 50×90':{w:50,h:90},'Mini 40×60':{w:40,h:60,r:6},'Wide 90×50':{w:90,h:50},'Luggage 60×110':{w:60,h:110,hole:6}},
 note:'Hole sits 10 mm from the top edge. Bleed is drawn as a band: in Illustrator, Outline Stroke and keep the outer half (the included script does not do this step).',
 doc:'Chamfer or radius on the top corners; hole at (w/2, 10).',
 gen(v){const s=S(),{w,h,r}=v;const o=v.corner==='chamfer'?[[0,r],[r,0],[w-r,0],[w,r],[w,h],[0,h]]:rr(0,0,w,h,v.corner==='round'?r:0);s.cut.push(P(o));s.band.push(P(o));s.bw=v.bleed;if(v.hole>0)s.cut.push(P(circ(w/2,10,v.hole/2,32)));s.safe.push(P(rect(4,18,w-8,h-22)));s.labels.push([w/2,h*.6,'TAG',.8]);return s},
 check(v,s,W){if(v.hole>v.w-10)W.push(['err','Hole is too big for the tag'])}},
sticker:{name:'Sticker / seal / coaster',sub:'Circle, oval, rounded rectangle',kind:'B',
 params:[['shape','Shape','s','circle',['circle','oval','rounded']],['w','Width','n',60],['h','Height','n',40],['r','Corner radius','n',6],['bleed','Bleed','n',2]],
 presets:{'Seal Ø40':{shape:'circle',w:40},'Seal Ø60':{shape:'circle',w:60},'Coaster Ø95':{shape:'circle',w:95},'Oval 70×45':{shape:'oval',w:70,h:45},'Product label 80×50':{shape:'rounded',w:80,h:50,r:3},'Shipping label 100×150':{shape:'rounded',w:100,h:150,r:3}},
 note:'Circle uses width as diameter. Kiss-cut on sheets: tell the printer the gap between stickers (usually 3 mm).',
 doc:'Exact offsets: bleed and 3 mm safe follow the shape.',
 gen(v){const s=S(),b=v.bleed;let{w,h}=v;if(v.shape==='circle')h=w;
  if(v.shape==='rounded'){s.cut.push(P(rr(0,0,w,h,v.r)));s.bleed.push(P(rr(-b,-b,w+2*b,h+2*b,v.r+b)));s.safe.push(P(rr(3,3,w-6,h-6,Math.max(0,v.r-3))))}
  else{s.cut.push(P(ell(w/2,h/2,w/2,h/2)));s.bleed.push(P(ell(w/2,h/2,w/2+b,h/2+b)));s.safe.push(P(ell(w/2,h/2,w/2-3,h/2-3)))}
  s.labels.push([w/2,h/2,'ARTWORK',.7]);return s}},
doorhanger:{name:'Door hanger',sub:'Hotel & promotion hangers',kind:'B',
 params:[['w','Width','n',90],['h','Height','n',250],['d','Hole diameter','n',64],['hy','Hole centre from top','n',50],['slit','Side slit','b',true],['r','Corner radius','n',5],['bleed','Bleed','n',3],['safe','Safe margin','n',5]],
 presets:{'Standard 90×250':{w:90,h:250},'US 3.5×8.5 in':{w:89,h:216,d:60,hy:45},'Wide 100×280':{w:100,h:280,d:70,hy:55}},
 note:'The slit lets the hanger slip over a handle. Keep artwork below the hole.',
 doc:'Hole circle at (w/2, hy); slit leaves the hole at −30° to the right edge.',
 gen(v){const s=S(),{w,h,d,hy,r,bleed:b,safe:m}=v,R=d/2,cx=w/2;s.cut.push(P(rr(0,0,w,h,r)));if(b>0)s.bleed.push(P(rr(-b,-b,w+2*b,h+2*b,r+b)));s.cut.push(P(circ(cx,hy,R,48)));
  if(v.slit){const a=-30*DEG,x1=cx+R*Math.cos(a),y1=hy+R*Math.sin(a),y2=y1+(w-x1)*Math.tan(a);s.cut.push(P(ln(x1,y1,w,y2),false))}
  const ys=hy+R+8;s.safe.push(P(rect(m,ys,w-2*m,h-ys-m)));s.labels.push([w/2,(ys+h)/2,'ARTWORK']);return s},
 check(v,s,W){if(v.d>v.w-16)W.push(['err','Hole leaves less than 8 mm each side']);if(v.hy-v.d/2<8)W.push(['err','Hole is too close to the top edge'])}},
tabletent:{name:'Table tent',sub:'Table numbers, desk calendars',kind:'A',
 params:[['w','Face width','n',148],['h','Face height','n',105],['b','Base depth','n',40],['g','Glue tab','n',20],['bleed','Bleed','n',3]],
 presets:{'A6 face 148×105':{w:148,h:105,b:40},'DL face 210×99':{w:210,h:99,b:45},'Desk calendar 210×150':{w:210,h:150,b:60},'Table number 100×100':{w:100,h:100,b:40}},
 note:'Triangular tent: two faces meet at the top fold, the base sits under it and the tab glues inside the front.',
 doc:'Rows back H / front H / base B / glue tab G. Back face prints rotated 180°.',
 gen(v){const s=S(),{w,h,b,g}=v,o=[[0,0],[w,0],[w,2*h+b],[w-6,2*h+b+g],[6,2*h+b+g],[0,2*h+b]];s.cut.push(P(o));s.band.push(P(o));s.bw=v.bleed;[h,2*h,2*h+b].forEach(y=>s.crease.push(P(ln(0,y,w,y),false)));
  s.glue.push(P([[0,2*h+b],[w,2*h+b],[w-6,2*h+b+g],[6,2*h+b+g]]));s.safe.push(P(rect(5,5,w-10,h-10)));s.safe.push(P(rect(5,h+5,w-10,h-10)));
  s.labels.push([w/2,h/2,'BACK (print rotated 180)',.7]);s.labels.push([w/2,h*1.5,'FRONT']);s.labels.push([w/2,2*h+b/2,'BASE',.7]);return s},
 check(v,s,W){if(v.b>v.h)W.push(['warn','Base deeper than the face: the tent will be very flat'])}},
};
/* Shared flap geometry for tuck boxes and the Panel Builder. */
function flapPts(a,b,ty,y,d,Wd,Tk,Dh,F){const Y=o=>y+d*o;
 if(ty==='lid'||ty==='tuck')return[[a,y],[a,Y(Wd)],[a+2,Y(Wd+Tk-5)],[a+6,Y(Wd+Tk)],[b-6,Y(Wd+Tk)],[b-2,Y(Wd+Tk-5)],[b,Y(Wd)],[b,y]];
 if(ty==='dust')return[[a,y],[a+1.5,Y(Dh-3)],[a+5,Y(Dh)],[b-5,Y(Dh)],[b-1.5,Y(Dh-3)],[b,y]];
 if(ty==='flap')return[[a,y],[a+1.5,y],[a+1.5,Y(F)],[b-1.5,Y(F)],[b-1.5,y],[b,y]];
 if(ty==='tab')return[[a,y],[a+4,Y(12)],[b-4,Y(12)],[b,y]];
 return[[a,y],[b,y]]}
/* Panel Builder — custom structures from a strip of panels with per-edge flaps. */
IT.custom={name:'Panel Builder',sub:'Your own structure',kind:'A',params:[],builder:true,
 note:'Custom structure from panels and flaps. Save it as a template to reuse it, or copy its JSON to share it.',
 doc:'Strip of panels (widths) × height. Each panel edge takes none / tuck / dust / flap / tab. Glue flap left, right or none.',
 gen(v){const s=S(),ps=v.panels,H=v.H,g=v.glue==='none'?0:v.g,Tk=v.tongue,y0=Math.max(v.lid+Tk,v.dust,v.flapD,12)+2,y1=y0+H;
  let x=v.glue==='left'?g:0;const pn=ps.map((p,i)=>{const q={a:x,b:x+p.w,i,top:p.top,bot:p.bot};x+=p.w;return q});const xe=x;
  let o=[[pn[0].a,y0]];pn.forEach(p=>o.push(...flapPts(p.a,p.b,p.top,y0,-1,v.lid,Tk,v.dust,v.flapD)));
  if(v.glue==='right')o.push([xe,y0],[xe+g,y0+6],[xe+g,y1-6],[xe,y1]);else o.push([xe,y1]);
  [...pn].reverse().forEach(p=>o.push(...flapPts(p.a,p.b,p.bot,y1,1,v.lid,Tk,v.dust,v.flapD).reverse()));
  if(v.glue==='left')o.push([g,y1],[0,y1-6],[0,y0+6]);o=dedupe(o);s.cut.push(P(o));s.band.push(P(o));s.bw=3;
  pn.forEach((p,i)=>{if(i)s.crease.push(P(ln(p.a,y0,p.a,y1),false));if(p.top&&p.top!=='none'){s.crease.push(P(ln(p.a,y0,p.b,y0),false));if(p.top==='tuck')s.crease.push(P(ln(p.a,y0-v.lid,p.b,y0-v.lid),false))}if(p.bot&&p.bot!=='none'){s.crease.push(P(ln(p.a,y1,p.b,y1),false));if(p.bot==='tuck')s.crease.push(P(ln(p.a,y1+v.lid,p.b,y1+v.lid),false))}s.labels.push([(p.a+p.b)/2,(y0+y1)/2,'P'+(i+1)+' · #'+(p.b-p.a),.7])});
  if(v.glue==='left'){s.crease.push(P(ln(g,y0,g,y1),false));s.glue.push(P([[g,y0],[0,y0+6],[0,y1-6],[g,y1]]))}
  if(v.glue==='right'){s.crease.push(P(ln(xe,y0,xe,y1),false));s.glue.push(P([[xe,y0],[xe+g,y0+6],[xe+g,y1-6],[xe,y1]]))}
  pn.forEach(p=>['top','bot'].forEach(k=>{if(p[k]==='tab'){const y=k==='top'?y0:y1,d=k==='top'?-1:1;s.glue.push(P([[p.a,y],[p.a+4,y+d*12],[p.b-4,y+d*12],[p.b,y]]))}}));return s},
 check(v,s,W){if(!v.panels.length)W.push(['err','Add at least one panel']);if(v.panels.some(p=>!(p.w>0)))W.push(['err','Every panel needs a width above 0'])}};
const BUILDER_DEFAULT={name:'My box',H:120,glue:'left',g:15,lid:41,tongue:15,dust:30,flapD:40,panels:[{w:70,top:'none',bot:'tuck'},{w:40,top:'dust',bot:'dust'},{w:70,top:'tuck',bot:'none'},{w:40,top:'dust',bot:'dust'}]};
