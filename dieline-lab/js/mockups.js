/* mockups.js — Mode B: physical application illustrations (orthographic, one line style). ARTS = uploaded artwork slots shared with boards. */
let ARTS=[];
const MK={
billboard:{name:'Billboard',sub:'Two-leg roadside',z:[[88,98,624,210]],spec:'Common face 12 × 4 m (≈3:1). Supply vector, or raster at 1:10 scale (1200×400 mm) at 150 dpi. Confirm size with the media owner.',
 d:(T,w)=>[`<path d="M30 500H770"/><rect x="226" y="320" width="20" height="180" ${T}/><rect x="554" y="320" width="20" height="180" ${T}/><path d="M246 350L554 470M554 350L246 470"/><rect x="76" y="86" width="648" height="234" rx="3" fill="#fff"/><rect x="104" y="320" width="592" height="8" ${T}/>${[180,330,470,620].map(x=>`<path d="M${x} 328v12h14"/><rect x="${x+12}" y="336" width="24" height="9" rx="2" fill="#fff"/>`).join('')}`]},
tee:{name:'T-billboard',sub:'Unipole, single column',z:[[112,100,576,188]],spec:'Unipole / T structure, common 12 × 4 m or 14 × 4 m. Artwork ratio about 3:1.',
 d:T=>[`<path d="M30 500H770"/><rect x="386" y="300" width="28" height="196" ${T}/><rect x="346" y="490" width="108" height="10" ${T}/><rect x="300" y="300" width="200" height="10" ${T}/><rect x="100" y="88" width="600" height="212" rx="3" fill="#fff"/>${[220,400,580].map(x=>`<path d="M${x} 88v-16h14"/><rect x="${x+12}" y="62" width="24" height="9" rx="2" fill="#fff"/>`).join('')}`]},
mupi:{name:'Street lightbox',sub:'MUPI / small billboard',z:[[296,78,208,304]],spec:'MUPI 1.20 × 1.76 m, visible area ≈ 1.16 × 1.71 m. Design at 1:10 (116×171 mm), 300 dpi.',
 d:T=>[`<path d="M30 500H770"/><rect x="318" y="410" width="12" height="86" ${T}/><rect x="470" y="410" width="12" height="86" ${T}/><rect x="300" y="494" width="200" height="6" ${T}/><rect x="276" y="56" width="248" height="10" rx="4" ${T}/><rect x="282" y="64" width="236" height="346" rx="10" fill="#fff"/>`]},
van:{name:'Van livery',sub:'Side panel branding',z:[[104,196,436,170,6]],spec:'Panel van cargo side. Measure the real vehicle before production; send vinyl artwork as vector at 1:10.',
 d:(T,w,lc)=>[`<path d="M40 478H760"/><path d="M80 432V196Q80 172 104 172H556Q586 172 604 194L690 300Q710 322 710 352V418Q710 432 696 432Z" fill="#fff"/><path d="M572 192H598L664 296H572Z" ${T}/><path d="M560 180V420"/><rect x="574" y="312" width="22" height="6" rx="3"/><path d="M694 330h12v16h-12z" fill="#fff"/><path d="M598 238h-12v26h12"/><rect x="660" y="414" width="58" height="18" rx="6" ${T}/><rect x="70" y="414" width="30" height="18" rx="5" ${T}/>`,
  [220,600].map(x=>`<circle cx="${x}" cy="432" r="56" fill="#fff"/><circle cx="${x}" cy="432" r="46" fill="${lc}" fill-opacity=".85"/><circle cx="${x}" cy="432" r="18" fill="#fff"/>`).join('')]},
laptop:{name:'Laptop',sub:'Screen 16:10',z:[[212,100,376,235]],spec:'Screen 16:10 — export screens at 2560×1600 or 1440×900.',
 d:T=>[`<ellipse cx="400" cy="414" rx="300" ry="8" ${T}/><rect x="196" y="84" width="408" height="262" rx="14" ${T}/><path d="M150 346H650L690 392Q692 402 680 402H120Q108 402 110 392Z" fill="#fff"/><path d="M360 346v5q0 4 4 4h72q4 0 4-4v-5"/>`,`<circle cx="400" cy="92" r="2.5"/>`]},
monitor:{name:'Desktop monitor',sub:'Screen 16:9',z:[[150,78,500,281]],spec:'Screen 16:9 — export at 1920×1080 or 3840×2160.',
 d:T=>[`<rect x="136" y="64" width="528" height="324" rx="10" ${T}/><path d="M376 388L366 450H434L424 388" fill="#fff"/><rect x="300" y="450" width="200" height="14" rx="7" fill="#fff"/>`]},
phone:{name:'Smartphone',sub:'Screen ≈ 9:19.5',z:[[314,60,172,390,26]],spec:'Modern phone ≈ 9:19.5 — design screens at 390×844 pt (1179×2556 px @3x).',
 d:(T,w,lc)=>[`<rect x="304" y="50" width="192" height="410" rx="34" ${T}/><path d="M300 150v34M300 196v34M500 170v52"/>`,`<rect x="370" y="72" width="60" height="16" rx="8" fill="${lc}"/>`]},
door:{name:'Door signage',sub:'Wall plate + glass vinyl',z:[[592,222,134,84,2],[300,120,190,150]],spec:'Wall plate commonly 300×200 mm (acrylic with stand-offs). Door glass: frosted vinyl, keep 50 mm from frame.',
 d:T=>[`<path d="M30 500H770"/><rect x="250" y="70" width="290" height="430" ${T}/><rect x="264" y="84" width="262" height="416" fill="#fff"/><rect x="292" y="112" width="206" height="166" rx="2"/><rect x="490" y="296" width="10" height="64" rx="5"/><rect x="584" y="214" width="150" height="100" rx="4" fill="#fff"/>`,`${[[592,222],[726,222],[592,306],[726,306]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#fff"/>`).join('')}`]},
store:{name:'Storefront',sub:'Fascia, blade sign, window',z:[[112,120,576,70],[722,122,56,56,28],[500,250,170,60]],spec:'Fascia ratio depends on the shop; measure on site. Blade sign commonly Ø 500–600 mm double-sided.',
 d:T=>[`<path d="M30 500H770"/><rect x="80" y="60" width="640" height="440" fill="#fff"/><rect x="72" y="52" width="656" height="12" ${T}/><rect x="100" y="110" width="600" height="90" ${T}/><rect x="110" y="230" width="230" height="270"/><rect x="360" y="230" width="100" height="270" ${T}/><rect x="440" y="350" width="6" height="40" rx="3"/><rect x="480" y="230" width="210" height="270"/><path d="M720 150h30"/>`]},
rollup:{name:'Roll-up banner',sub:'Pull-up stand',z:[[315,70,170,400]],spec:'Standard 85 × 200 cm visible; add 10 cm at the bottom for the cassette.',
 d:T=>[`<path d="M30 500H770"/><rect x="310" y="62" width="180" height="8" rx="3" ${T}/><path d="M300 470H500V488Q500 494 494 494H306Q300 494 300 488Z" fill="#fff"/><path d="M318 494l-10 6M482 494l10 6"/>`]},
tote:{name:'Tote bag',sub:'Screen-print area',z:[[310,260,180,180]],spec:'Cotton tote 38 × 42 cm; typical print area 25 × 25 cm, max 2–3 spot colours for screen print.',
 d:(T,w,lc)=>[`<path d="M335 214V142Q335 104 371 104H429Q465 104 465 142V214" stroke-width="${w*6}" stroke-opacity=".85"/><path d="M250 210H550L566 488H234Z" fill="#fff"/><path d="M252 230H548"/>`]},
};

function mockSvg(id,o,ex){const m=MK[id],lc=o.lc,lw=+o.lw,T=`fill="${lc}" fill-opacity=".08"`,[under,over='']=m.d(T,lw,lc);let df='',zs='';
 m.z.forEach(([x,y,w,h,r=0],i)=>{const R=`x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"`;df+=`<clipPath id="c${id}${i}"><rect ${R}/></clipPath>`;zs+=`<rect ${R} fill="${o.zc}"/>`;
  const im=ARTS[i]||ARTS[0];if(im)zs+=`<image href="${im}" xlink:href="${im}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid ${o.fit}" clip-path="url(#c${id}${i})"/>`;
  else if(o.lab){const q=w/h,fs=Math.max(9,Math.min(w,h)*.13);zs+=`<text x="${x+w/2}" y="${y+h/2+fs*.35}" font-family="${SGF}" font-size="${fs.toFixed(1)}" font-weight="600" text-anchor="middle" fill="${lc}" fill-opacity=".5">${m.z.length>1?'ABC'[i]+' · ':''}${q>=1?q.toFixed(2)+':1':'1:'+(1/q).toFixed(2)}</text>`}
  zs+=`<rect ${R} fill="none" stroke="${lc}" stroke-width="${lw}"/>`});
 const A=`fill="none" stroke="${lc}" stroke-width="${lw}" stroke-linejoin="round" stroke-linecap="round"`;
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${ex?'width="1600" height="1120" ':''}viewBox="0 0 800 560">${!ex||o.bg==='white'?'<rect width="800" height="560" fill="#fff"/>':''}<defs>${df}</defs><g id="ILLUSTRATION" ${A}>${under}</g><g id="ARTWORK">${zs}</g><g id="DETAIL" ${A}>${over}</g></svg>`}


/* Scene illustrations added in v3 — apparel, promo, vehicles, devices, environmental. */
Object.assign(MK,{
tshirt:{name:'T-shirt',sub:'Chest print area',z:[[328,165,144,190]],spec:'Adult T-shirt: typical chest print up to 300 × 400 mm; left-chest logo 80–100 mm wide.',
 d:T=>[`<path d="M260 120L332 94Q400 132 468 94L540 120L622 200L566 252L530 222V482H270V222L234 252L178 200Z" fill="#fff"/><path d="M332 94Q400 152 468 94" fill="none"/><path d="M270 222L284 150M530 222L516 150"/>`]},
hoodie:{name:'Hoodie',sub:'Chest print, kangaroo pocket',z:[[335,215,130,105]],spec:'Hoodie chest print up to 280 × 280 mm, above the pocket.',
 d:T=>[`<path d="M250 165L322 130Q300 60 400 52Q500 60 478 130L550 165L630 330L572 360L540 300V490H260V300L228 360L170 330Z" fill="#fff"/><path d="M322 130Q400 175 478 130" fill="none"/><path d="M330 395H470L490 470H310Z" ${T}/><path d="M385 150V215M415 150V215"/>`]},
cap:{name:'Cap',sub:'Front panel embroidery',z:[[332,205,136,88,6]],spec:'Front panel embroidery up to 110 × 55 mm; keep 10 mm from the seams.',
 d:T=>[`<path d="M245 335Q245 150 400 144Q555 150 555 335Z" fill="#fff"/><path d="M400 144V335M320 158Q300 240 305 335M480 158Q500 240 495 335"/><path d="M212 335Q400 302 588 335Q604 384 400 376Q196 384 212 335Z" ${T}/><circle cx="400" cy="144" r="9" fill="#fff"/>`]},
mug:{name:'Ceramic mug',sub:'Wrap print',z:[[302,198,176,196]],spec:'11 oz mug: print area ≈ 200 × 90 mm wrap; leave 15 mm behind the handle.',
 d:T=>[`<path d="M500 210Q600 210 600 300Q600 390 500 390" fill="none" stroke-width="22" stroke-opacity=".12"/><path d="M500 210Q590 210 590 300Q590 390 500 390"/><rect x="282" y="160" width="220" height="290" rx="14" fill="#fff"/><path d="M282 186H502"/>`]},
tumbler:{name:'Tumbler / bottle',sub:'Wrap print',z:[[352,195,96,200]],spec:'Insulated tumbler 500 ml: print area ≈ 200 × 120 mm wrap.',
 d:T=>[`<rect x="322" y="92" width="156" height="30" rx="4" ${T}/><path d="M330 122H470L456 470Q456 482 444 482H356Q344 482 344 470Z" fill="#fff"/>`]},
umbrella:{name:'Umbrella',sub:'Canopy panel print',z:[[318,172,164,92]],spec:'Panel print on one or more canopy segments; each segment is a triangle — ask the supplier for its template.',
 d:T=>[`<path d="M160 300Q400 30 640 300Q600 280 560 300Q520 278 480 300Q440 278 400 300Q360 278 320 300Q280 278 240 300Q200 280 160 300Z" fill="#fff"/><path d="M400 96V300M400 96L240 300M400 96L560 300M400 96L320 300M400 96L480 300" stroke-opacity=".35"/><path d="M400 300V468Q400 500 430 500Q458 500 458 474"/>`]},
lanyard:{name:'Lanyard & badge',sub:'Strap + card holder',z:[[343,322,114,142]],spec:'Strap 20 mm × 900 mm repeat; CR80 card 86 × 54 mm in a portrait holder.',
 d:T=>[`<path d="M318 30L388 290M482 30L412 290" stroke-width="12" stroke-opacity=".9"/><rect x="384" y="282" width="32" height="18" ${T}/><rect x="330" y="300" width="140" height="176" rx="6" fill="#fff"/><rect x="380" y="306" width="40" height="8" rx="4" ${T}/>`]},
apron:{name:'Apron',sub:'Chest print',z:[[332,248,136,118]],spec:'Bib apron: chest print up to 250 × 200 mm.',
 d:T=>[`<path d="M340 90Q400 20 460 90" fill="none"/><path d="M335 90H465L478 205L560 232L540 500H260L240 232L322 205Z" fill="#fff"/><path d="M240 232L150 250M560 232L650 250"/><rect x="330" y="400" width="140" height="58" ${T}/>`]},
sedan:{name:'Sedan car',sub:'Door graphics',z:[[300,318,236,62,4]],spec:'Door panels: measure the real car; supply vector at 1:10.',
 d:(T,w,lc)=>[`<path d="M40 420H760"/><path d="M70 380Q80 330 150 320L250 300Q300 228 380 224H520Q584 230 632 300L702 314Q736 326 736 370V396H70Z" fill="#fff"/><path d="M300 296Q330 246 384 244H440V296ZM452 244H516Q556 248 588 296H452Z" ${T}/><path d="M446 300V392"/>`,[195,600].map(x=>`<circle cx="${x}" cy="396" r="54" fill="#fff"/><circle cx="${x}" cy="396" r="44" fill="${lc}" fill-opacity=".85"/><circle cx="${x}" cy="396" r="16" fill="#fff"/>`).join('')]},
truck:{name:'Box truck',sub:'Box side panel',z:[[92,148,406,224]],spec:'Box body side, typical 4.2–6 m; confirm rivet lines with the body builder.',
 d:(T,w,lc)=>[`<path d="M40 456H760"/><rect x="70" y="128" width="450" height="282" fill="#fff"/><path d="M520 410V210H640Q672 210 690 250L722 330V410Z" fill="#fff"/><path d="M548 228H630Q650 228 664 260L680 300H548Z" ${T}/>`,[160,430,640].map(x=>`<circle cx="${x}" cy="410" r="48" fill="#fff"/><circle cx="${x}" cy="410" r="38" fill="${lc}" fill-opacity=".85"/><circle cx="${x}" cy="410" r="14" fill="#fff"/>`).join('')]},
scooter:{name:'Delivery motorcycle',sub:'Delivery box',z:[[152,182,166,136]],spec:'Delivery box sides ≈ 450 × 400 mm each; print as vinyl.',
 d:(T,w,lc)=>[`<path d="M40 470H760"/><rect x="140" y="170" width="190" height="160" fill="#fff"/><path d="M230 330H500L560 250H610M500 330L470 250H380"/><path d="M590 250L640 180H680" />`,[230,560].map(x=>`<circle cx="${x}" cy="415" r="55" fill="#fff"/><circle cx="${x}" cy="415" r="44" fill="${lc}" fill-opacity=".85"/><circle cx="${x}" cy="415" r="14" fill="#fff"/>`).join('')]},
tablet:{name:'Tablet',sub:'Landscape screen',z:[[170,128,460,304]],spec:'Tablet ≈ 4:3 to 3:2 — export screens at 2388 × 1668 (11″).',
 d:T=>[`<rect x="150" y="108" width="500" height="344" rx="24" ${T}/>`,`<circle cx="640" cy="280" r="3"/>`]},
watch:{name:'Smartwatch',sub:'Watch face',z:[[338,188,124,164,26]],spec:'Watch faces ≈ 396 × 484 px (45 mm); keep content inside the rounded safe area.',
 d:T=>[`<rect x="356" y="40" width="88" height="480" rx="10" ${T}/><rect x="320" y="170" width="160" height="200" rx="44" fill="#fff"/><rect x="480" y="230" width="12" height="40" rx="4" ${T}/>`]},
featherflag:{name:'Feather flag',sub:'Event / forecourt flag',z:[[408,96,104,360]],spec:'Feather flags 2.5–5 m; the curved shape is set by the pole kit — use the supplier template.',
 d:T=>[`<path d="M300 500H500M400 500V70Q520 60 545 150"/><path d="M400 76Q520 66 540 150L522 468H400Z" fill="#fff"/>`]},
aframe:{name:'A-frame sign',sub:'Pavement board',z:[[318,142,164,290]],spec:'A1 pavement board: visible 594 × 841 mm per side.',
 d:T=>[`<path d="M40 500H760"/><path d="M300 500L340 100H460L500 500"/><rect x="306" y="128" width="188" height="318" fill="#fff"/>`]},
totem:{name:'Totem / pylon',sub:'Freestanding sign',z:[[345,82,110,300]],spec:'Indoor totems 1.8–2.2 m; outdoor pylons 3–8 m. Design on the grid in the Boards tab.',
 d:T=>[`<path d="M40 500H760"/><rect x="330" y="62" width="140" height="430" fill="#fff"/><rect x="318" y="488" width="164" height="12" ${T}/><rect x="345" y="398" width="110" height="74" ${T}/>`]},
reception:{name:'Reception wall',sub:'Wall logo + desk front',z:[[250,108,300,104],[232,372,336,76]],spec:'Wall logo usually 1.2–2.4 m wide, centred 1.8–2.2 m from the floor; desk front 1100 mm high.',
 d:T=>[`<rect x="60" y="40" width="680" height="460" ${T}/><path d="M60 500H740"/><rect x="180" y="330" width="440" height="170" fill="#fff"/><rect x="170" y="318" width="460" height="14" fill="#fff"/>`]},
backdrop:{name:'Event backdrop',sub:'Press wall / step-and-repeat',z:[[132,72,536,384]],spec:'Common 3 × 2.25 m; logo repeat 300–400 mm. Leave the bottom 300 mm clear of logos (hidden by people).',
 d:T=>[`<path d="M40 500H760"/><rect x="120" y="60" width="560" height="408" fill="#fff"/><path d="M140 468V500M660 468V500M110 500H170M630 500H690"/>`]},
});
