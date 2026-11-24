/* =====================================================================
   VENIAA SHOOTS: BOOKING SETTINGS
   These are the only lines you normally need to change.
   ===================================================================== */
var CONFIG = {
  /* 1. The WhatsApp number customers can chat with.
        Digits only, with the country code (91 for India). */
  whatsapp: '919063185111',

  /* 2. Automatic WhatsApp alert to YOU for every enquiry (free CallMeBot service).
        phone:  your WhatsApp number with + and country code.
        apikey: the key CallMeBot sends you. Paste it between the quotes.
        While apikey is empty, no automatic alert is sent. */
  alert: { phone: '+919063185111', apikey: '' },

  /* 3. Google Form (optional): keeps a record of every enquiry in Google Sheets.
        Fill in the entry IDs from your form's pre-filled link. */
  formAction: 'https://docs.google.com/forms/d/12ePqIW_ziS6oWql8KowPTZNM98LtVs-v2MrVj0rn7bY/formResponse',
  entries: { name:'', phone:'', email:'', type:'', details:'', state:'', city:'', venue:'', date:'', callTime:'' },

  /* 4. Email button: opens a new email to this address, with the subject and a short message already written. */
  email: 'veniaashoots@gmail.com',
  emailSubject: 'Shoot enquiry for Veniaa Shoots',
  emailBody: 'Hi Veniaa Shoots,\n\nI would like to book a shoot.\n\nName:\nPhone:\nType of shoot (event, brand or creator):\nDate:\nCity and venue:\n\nThank you'
};

/* Email buttons: on phones open the mail app (Gmail, Mail); on computers open Gmail's "New message" window in a new tab. */
(function(){
  var to=CONFIG.email, su=encodeURIComponent(CONFIG.emailSubject), body=encodeURIComponent(CONFIG.emailBody);
  var mobile=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  var gmail='https://mail.google.com/mail/?view=cm&fs=1&to='+to+'&su='+su+'&body='+body;
  var mailto='mailto:'+to+'?subject='+su+'&body='+body;
  function setup(){
    document.querySelectorAll('.mail-link').forEach(function(a){
      if(mobile){ a.href=mailto; a.removeAttribute('target'); }
      else { a.href=gmail; a.target='_blank'; }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup); else setup();
})();

/* Opening logo screen: shows for about 2.4 seconds after the logo loads, then lifts away.
   Tap anywhere or press Skip to close it early. */
(function(){
  var intro=document.getElementById('intro'), d=document.documentElement; if(!intro) return;
  var closed=false;
  function close(){
    if(closed) return; closed=true;
    intro.classList.add('out'); d.classList.remove('intro-lock');
    setTimeout(function(){ intro.classList.add('gone'); },1100);
  }
  var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait=still?1200:2400, logo=intro.querySelector('img');
  function start(){ setTimeout(close,wait); }
  if(!logo||logo.complete) start(); else { logo.addEventListener('load',start); logo.addEventListener('error',close); }
  setTimeout(close,4500);
  intro.addEventListener('click',close);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'||e.key==='Enter'||e.key===' ') close(); },{once:true});
})();
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);};
function flash(btn,text){ if(!btn) return; var o=btn.dataset.label||btn.textContent; btn.dataset.label=o; btn.textContent=text; clearTimeout(btn._t); btn._t=setTimeout(function(){btn.textContent=o;},1600); }
function copyText(text,btn,fallbackEl){
  var p; try{ p=navigator.clipboard.writeText(text); }catch(e){ p=Promise.reject(e); }
  p.then(function(){ flash(btn,'Copied'); },function(){
    if(fallbackEl){ try{ if(fallbackEl.select) fallbackEl.select(); else { var r=document.createRange(); r.selectNodeContents(fallbackEl); var s=getSelection(); s.removeAllRanges(); s.addRange(r);} }catch(e){} }
    flash(btn,'Selected, now copy');
  });
}

document.addEventListener('click',function(ev){
  var a=ev.target.closest('[data-go]'); if(!a) return;
  var el=document.getElementById(a.dataset.go); if(!el) return;
  ev.preventDefault();
  el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});
if($('#copyHandle')) $('#copyHandle').addEventListener('click',function(){ copyText('@veniaa.shoots',this,$('#handleText')); });

/* Book Now button: hide it while the booking form itself is on screen. */
(function(){
  var b=document.getElementById('book'); if(!b||!('IntersectionObserver' in window)) return;
  new IntersectionObserver(function(es){ document.documentElement.classList.toggle('book-in',es[0].isIntersecting); },{threshold:.15}).observe(b);
})();

/* Numbers band: counts up from 0 each time it scrolls into view. */
(function(){
  var band=document.getElementById('stats'); if(!band) return;
  var nums=[].slice.call(band.querySelectorAll('.count'));
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(el,v){ var d=+el.dataset.dec||0; var t=v.toFixed(d); if(el.dataset.comma) t=Math.round(v).toLocaleString('en-IN'); el.textContent=t; }
  function run(){
    var t0=null, dur=1800;
    function step(t){ if(t0===null) t0=t; var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,4);
      nums.forEach(function(el){ fmt(el,(+el.dataset.to)*e); }); if(p<1) band._raf=requestAnimationFrame(step); }
    cancelAnimationFrame(band._raf); band._raf=requestAnimationFrame(step);
  }
  if(still||!('IntersectionObserver' in window)){ band.classList.add('in'); return; }
  band.classList.add('anim'); nums.forEach(function(el){ fmt(el,0); });
  new IntersectionObserver(function(es){ es.forEach(function(e){
    if(e.isIntersecting){ band.classList.add('in'); run(); }
    else if(e.boundingClientRect.top>0||e.intersectionRatio===0){ band.classList.remove('in'); cancelAnimationFrame(band._raf); nums.forEach(function(el){ fmt(el,0); }); }
  }); },{threshold:.35}).observe(band);
})();

/* Hero background video: picks the phone or computer version, fades in once playing, pauses when off screen. */
(function(){
  var v=document.getElementById('heroBg'); if(!v) return;
  var phone=matchMedia('(max-width:760px)').matches;
  if(phone){ v.poster=v.dataset.posterMobile; }
  v.src=phone?v.dataset.srcMobile:v.dataset.src;
  v.muted=true; v.defaultMuted=true;
  v.addEventListener('playing',function(){ v.classList.add('on'); });
  function play(){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  play();
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ if(es[0].isIntersecting) play(); else v.pause(); }).observe(v.parentElement);
  }
})();

/* Scroll progress line at the top of the page. */
(function(){
  var bar=document.getElementById('scrollBar'); if(!bar) return; var ticking=false;
  function upd(){ var h=document.documentElement, max=h.scrollHeight-h.clientHeight; bar.style.transform='scaleX('+(max>0?Math.min(1,h.scrollTop/max):0)+')'; ticking=false; }
  addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(upd); } },{passive:true});
  addEventListener('resize',upd); upd();
})();

/* How it works timeline: the line fills with scroll and lights each step as it arrives. */
(function(){
  var tl=document.getElementById('timeline'); if(!tl) return;
  var steps=[].slice.call(tl.querySelectorAll('.step')), n=steps.length, ticking=false;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ tl.style.setProperty('--p',1); steps.forEach(function(s){ s.classList.add('lit'); }); return; }
  function upd(){
    ticking=false;
    var r=tl.getBoundingClientRect(), vh=innerHeight;
    var p=(vh*0.85-r.top)/Math.max(vh*0.5,r.height*0.85); p=Math.max(0,Math.min(1,p));
    tl.style.setProperty('--p',p.toFixed(4));
    steps.forEach(function(s,i){ s.classList.toggle('lit',p>=(n>1?i/(n-1):0)-0.001&&p>0.02); });
  }
  addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(upd); } },{passive:true});
  addEventListener('resize',upd); upd();
})();

/* Package tabs: Basic, Events and Weddings each show their own cards. */
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.pk-tab')); if(!tabs.length) return;
  function pick(t,focus){
    tabs.forEach(function(x){ var on=x===t; x.setAttribute('aria-selected',on); x.tabIndex=on?0:-1; document.getElementById(x.getAttribute('aria-controls')).hidden=!on; });
    if(focus) t.focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){ pick(t); });
    t.addEventListener('keydown',function(e){ var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0; if(d){ e.preventDefault(); pick(tabs[(i+d+tabs.length)%tabs.length],true); } });
  });
})();

/* Booking form progress: the bar, the percentage and the three step ticks fill in as fields are completed. */
(function(){
  var f=$('#bookForm'); if(!f||!$('#bkBar')) return;
  function v(id){ var e=$('#'+id); return e&&!e.closest('[hidden]')?String(e.value||'').trim():''; }
  var tests={
    name:function(){ return v('bk-name').length>=2; },
    phone:function(){ return v('bk-phone').replace(/\D/g,'').length>=7; },
    email:function(){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('bk-email')); },
    type:function(){ return !!f.querySelector('input[name="type"]:checked'); },
    details:function(){ return v('bk-details').length>=3; },
    date:function(){ return !!v('bk-date'); },
    state:function(){ return !!v('bk-state'); },
    city:function(){ return v('bk-city').length>=2; },
    venue:function(){ return v('bk-venue').length>=2; }
  };
  var groups=[['name','phone'],['type'],['date','state','city','venue']];
  function update(){
    var done=0,total=0;
    groups.forEach(function(g,i){
      var ok=g.filter(function(k){ return tests[k](); }).length; done+=ok; total+=g.length;
      var full=ok===g.length; $('#bkS'+(i+1)).classList.toggle('done',full); $('#bkL'+(i+1)).classList.toggle('done',full);
    });
    var pct=Math.round(done/total*100);
    $('#bkBar').style.width=pct+'%'; $('#bkPct').textContent=pct===100?'Ready to send':pct+'% done';
  }
  f.addEventListener('input',update); f.addEventListener('change',update);
  document.addEventListener('click',function(e){ if(e.target.closest('[data-pack]')) setTimeout(update,50); });
  f.addEventListener('reset',function(){ setTimeout(update,0); });
  update();
})();


/* ---------- booking: form ---------- */
(function(){
  /* We cover Andhra Pradesh and Telangana. The state list is in index.html (search bk-state). */
  var form=$('#bookForm'), stateSel=$('#bk-state'), code=$('#bk-code'), phone=$('#bk-phone');
  var d=new Date(); try{ $('#bk-date').min=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }catch(e){}
  /* phone: digits only, shown as 98765 43210 for Indian numbers */
  function digits(){ return phone.value.replace(/\D/g,''); }
  phone.addEventListener('input',function(){
    var x=digits().slice(0,code.value==='+91'?10:14);
    phone.value=code.value==='+91'&&x.length>5?x.slice(0,5)+' '+x.slice(5):x;
  });
  code.addEventListener('change',function(){ phone.dispatchEvent(new Event('input')); });
  function val(id){ return ($('#'+id).value||'').trim(); }
  function pack(){ var r=form.querySelector('input[name="type"]:checked'); return r?r.value:''; }
  /* checks, in the order the fields appear */
  var checks=[
    ['name',function(){ return val('bk-name').length>=2; },'Enter your full name.'],
    ['phone',function(){ var x=digits(); return code.value==='+91'?/^[6-9]\d{9}$/.test(x):/^\d{6,14}$/.test(x); },function(){ return code.value==='+91'?'Enter a 10-digit mobile number.':'Enter a valid phone number.'; }],
    ['email',function(){ var e=val('bk-email'); return !e||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); },'Check the email, like name@gmail.com, or leave it empty.'],
    ['type',function(){ return !!pack(); },'Choose a package.'],
    ['date',function(){ var v=val('bk-date'); return !!v&&(!$('#bk-date').min||v>=$('#bk-date').min); },'Pick the date of your shoot.'],
    ['state',function(){ return !!stateSel.value; },'Choose your state.'],
    ['city',function(){ return val('bk-city').length>=2; },'Enter your city.'],
    ['venue',function(){ return val('bk-venue').length>=2; },'Enter the venue or area.']
  ];
  function fieldOf(k){ var e=$('#bk-'+k+'-err'); return e&&e.closest('.fld'); }
  function clearErr(k){ var e=$('#bk-'+k+'-err'); if(e){ e.textContent=''; var f=fieldOf(k); if(f) f.classList.remove('invalid'); } }
  function validate(){
    var first=null;
    checks.forEach(function(c){
      var ok=c[1](), e=$('#bk-'+c[0]+'-err'), f=fieldOf(c[0]);
      e.textContent=ok?'':(typeof c[2]==='function'?c[2]():c[2]);
      f.classList.toggle('invalid',!ok);
      if(!ok&&!first) first=c[0];
    });
    if(first){
      var target=first==='type'?form.querySelector('input[name="type"]'):first==='state'?stateSel:$('#bk-'+first);
      fieldOf(first).scrollIntoView({block:'center',behavior:'smooth'});
      setTimeout(function(){ try{ target.focus({preventScroll:true}); }catch(e){} },300);
    }
    return !first;
  }
  ['name','phone','email','details','date','city','venue'].forEach(function(k){ var el=$('#bk-'+k); el.addEventListener('input',function(){ clearErr(k); }); el.addEventListener('change',function(){ clearErr(k); }); });
  stateSel.addEventListener('change',function(){ clearErr('state'); });
  form.querySelectorAll('input[name="type"]').forEach(function(r){ r.addEventListener('change',function(){ clearErr('type'); }); });
  function read(){
    var date=val('bk-date'), m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date), x=digits();
    return { name:val('bk-name'), phone:code.value+' '+(code.value==='+91'&&x.length===10?x.slice(0,5)+' '+x.slice(5):x), email:val('bk-email'), type:pack(), details:val('bk-details'),
      state:val('bk-state'), city:val('bk-city'), venue:val('bk-venue'),
      date:m?new Date(+m[1],+m[2]-1,+m[3]).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}):date, callTime:val('bk-call') };
  }
  function compose(v){
    var L=['New booking enquiry for Veniaa Shoots','Name: '+v.name,'Phone: '+v.phone];
    if(v.email) L.push('Email: '+v.email);
    L.push('Package: '+v.type,'Date: '+v.date,'Location: '+[v.venue,v.city,v.state].filter(Boolean).join(', '));
    if(v.callTime) L.push('Best time to call: '+v.callTime);
    if(v.details) L.push('Details: '+v.details);
    return L.join('\n');
  }
  function sheetReady(){ return !!CONFIG.formAction&&Object.keys(CONFIG.entries).every(function(k){ return /^entry\.\d+$/.test(CONFIG.entries[k]); }); }
  /* Sends data in the background in a way that survives leaving the page. */
  function beacon(url,body){
    try{ if(navigator.sendBeacon&&navigator.sendBeacon(url,body)) return true; }catch(e){}
    try{ fetch(url,{method:'POST',mode:'no-cors',keepalive:true,body:body}); return true; }catch(e){ return false; }
  }
  function sendToSheet(v){
    if(!sheetReady()) return false;
    var body=new URLSearchParams(); Object.keys(CONFIG.entries).forEach(function(k){ body.append(CONFIG.entries[k],v[k]||''); });
    return beacon(CONFIG.formAction,body);
  }
  function sendAlert(msg){
    var c=CONFIG.alert;
    if(!c||!c.apikey||!/^\+?\d{10,15}$/.test(c.phone)) return false;
    return beacon('https://api.callmebot.com/whatsapp.php?phone='+encodeURIComponent(c.phone)+'&text='+encodeURIComponent(msg)+'&apikey='+encodeURIComponent(c.apikey));
  }
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    if(val('bk-website')) return;
    if(!validate()) return;
    var v=read(), msg=compose(v), wa=/^\d{10,15}$/.test(CONFIG.whatsapp)?CONFIG.whatsapp:'';
    var waUrl=wa?'https://wa.me/'+wa+'?text='+encodeURIComponent(msg):'';
    /* 1. Open WhatsApp straight away, while the tap still counts as the customer's action. */
    var win=null;
    if(waUrl){ try{ win=window.open(waUrl,'_blank'); if(win) win.opener=null; }catch(e){ win=null; } }
    /* 2. Save the enquiry to the Google Form and send the automatic alert, if they are set up. */
    sendToSheet(v); sendAlert(msg);
    /* 3. Show the confirmation on the website. */
    var link=$('#waLink');
    $('#resultMsg').textContent=msg;
    $('#waRow').hidden=!wa; $('#igLink').hidden=!!wa;
    if(wa){ link.href=waUrl; link.textContent='Open WhatsApp'; link.className='btn wa primary'; }
    $('#resultTitle').textContent=wa?'Opening WhatsApp':'Your enquiry is ready';
    $('#resultLine').textContent=wa
      ?'Your booking details are typed in WhatsApp. Tap Send there to confirm your enquiry. If WhatsApp did not open, tap the button below.'
      :'Copy these details and send them to @veniaa.shoots on Instagram and we will confirm your slot.';
    form.hidden=true; $('#bookResult').hidden=false; $('#resultTitle').focus();
    /* 4. If the browser blocked the new tab, go to WhatsApp in this tab instead. */
    if(waUrl&&!win) setTimeout(function(){ window.location.href=waUrl; },700);
  });
  $('#copyMsg').addEventListener('click',function(){ copyText($('#resultMsg').textContent,this,$('#resultMsg')); });
  $('#newReq').addEventListener('click',function(){ form.reset(); syncRegion(); checks.forEach(function(c){ clearErr(c[0]); }); form.hidden=false; $('#bookResult').hidden=true; });
})();


/* ---------- motion and navigation ---------- */
(function(){
  var root=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, hasIO='IntersectionObserver' in window;
  var SEL='.sec-head,.kind,.step,.work,.pack,.why-card,.quote,.faq-item,.book-side,.sheet,.sample-note,.cam-points li,.iphone-copy > .btn';
  if(hasIO&&!reduce){
    root.classList.add('js');
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -6% 0px',threshold:.06});
    [].slice.call(document.querySelectorAll(SEL)).forEach(function(el){
      var i=[].slice.call(el.parentNode.children).filter(function(c){ return c.matches(SEL); }).indexOf(el);
      el.style.setProperty('--d',(Math.min(i,5)*0.07)+'s'); el.classList.add('reveal'); io.observe(el);
    });
  }
  var links=[].slice.call(document.querySelectorAll('.nav-links a[data-go]'));
  if(hasIO){
    var spy=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) links.forEach(function(a){ a.setAttribute('aria-current',String(a.dataset.go===e.target.id)); }); }); },{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(a){ var sec=document.getElementById(a.dataset.go); if(sec) spy.observe(sec); });
  }
  var nav=$('.nav'), mb=$('#menuBtn');
  mb.addEventListener('click',function(){ mb.setAttribute('aria-expanded',String(nav.classList.toggle('open'))); });
  nav.addEventListener('click',function(e){ if(e.target.closest('.nav-links a')){ nav.classList.remove('open'); mb.setAttribute('aria-expanded','false'); } });
  var mcta=$('#mcta'), seen={hero:true,book:false};
  if(hasIO){
    var c=new IntersectionObserver(function(es){ es.forEach(function(e){ seen[e.target.dataset.spy]=e.isIntersecting; }); mcta.hidden=seen.hero||seen.book; document.documentElement.classList.toggle('mcta-on',!mcta.hidden); });
    var hc=$('.hero-cta'), bk=$('#book'); hc.dataset.spy='hero'; bk.dataset.spy='book'; c.observe(hc); c.observe(bk);
  }
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-pack]'); if(b){ var r=document.querySelector('#bookForm input[name="type"][value="'+b.dataset.pack+'"]'); if(r){ r.checked=true; r.dispatchEvent(new Event('change')); } } });
})();

/* ---------- site: hero reel frames (real reels + running timecode) ---------- */
(function(){
  var frames=[].slice.call(document.querySelectorAll('.hero .reel'));
  var items=frames.map(function(el){
    var tc=el.querySelector('.tc'), m=/(\d+):(\d+):(\d+):(\d+)/.exec(tc.textContent), v=el.querySelector('video');
    if(v){ v.muted=true; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
    return {tc:tc,v:v,base:(+m[2]*60+ +m[3])*24+ +m[4]};
  });
  var t0=performance.now(), pad=function(n){ return String(n).padStart(2,'0'); }, on=true;
  function tick(){
    if(!on) return;
    var t=(performance.now()-t0)/1000;
    items.forEach(function(it){ var f=it.base+Math.floor(t*24); it.tc.textContent='00:'+pad(Math.floor(f/1440)%60)+':'+pad(Math.floor(f/24)%60)+':'+pad(f%24); });
    setTimeout(tick,1000/12);
  }
  tick();
  var hero=document.querySelector('.hero');
  if(hero&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      var vis=es[0].isIntersecting;
      items.forEach(function(it){ if(!it.v) return; if(vis){ var p=it.v.play(); if(p&&p.catch) p.catch(function(){}); } else it.v.pause(); });
      if(vis&&!on){ on=true; tick(); } else if(!vis) on=false;
    }).observe(hero);
  }
})();

})();

/* ---------- big logo at the end of the page: letters rise each time it comes into view ---------- */
(function(){
  var g=document.getElementById('footGiant'); if(!g||!('IntersectionObserver' in window)) return;
  g.classList.add('anim');
  new IntersectionObserver(function(es){ es.forEach(function(e){ g.classList.toggle('in',e.isIntersecting); }); },{threshold:0.25}).observe(g);
})();

/* ---------- hero headline: split into words for the reveal animation ---------- */
(function(){
  var h=document.querySelector('.hero h1'); if(!h) return;
  var i=0;
  h.setAttribute('aria-label',h.textContent.replace(/\s+/g,' ').trim());
  (function split(node){
    [].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){
          if(!part) return;
          if(/^\s+$/.test(part)){ frag.append(document.createTextNode(' ')); return; }
          var w=document.createElement('span'), wi=document.createElement('span');
          w.className='w'; w.setAttribute('aria-hidden','true');
          wi.className='wi'; wi.style.setProperty('--i',i++); wi.textContent=part;
          w.append(wi); frag.append(w);
        });
        n.replaceWith(frag);
      } else if(n.nodeType===1) split(n);
    });
  })(h);
  h.style.setProperty('--n',i);
  h.classList.add('split');
})();

/* ---------- Shot on iPhone: the reel plays inside the phone while it is on screen ---------- */
(function(){
  var stage=document.getElementById('phoneStage'); if(!stage) return;
  var v=stage.querySelector('video');
  function play(){ if(!v.getAttribute('src')) v.src=v.dataset.src; v.muted=true; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ if(es[0].isIntersecting) play(); else v.pause(); },{rootMargin:'200px 0px'}).observe(stage);
  } else play();
})();

/* ---------- founder card ----------
   Each big letter is sized to its exact place on the card (measured from the design),
   then the card plays its build-up animation once when it scrolls into view. */
(function(){
  var card=document.querySelector('.fcard'); if(!card) return;
  var cv=document.createElement('canvas').getContext('2d');
  function fit(){
    [].slice.call(card.querySelectorAll('.fc-l text')).forEach(function(t){
      var b=t.dataset.box.split(' ').map(Number), cs=getComputedStyle(t);
      cv.font=cs.fontWeight+' 200px '+cs.fontFamily;
      var m=cv.measureText(t.textContent);
      var L=m.actualBoundingBoxLeft||0, R=m.actualBoundingBoxRight||m.width, A=m.actualBoundingBoxAscent||150, D=m.actualBoundingBoxDescent||0;
      var sx=b[2]/(L+R), sy=b[3]/(A+D);
      t.setAttribute('x',0); t.setAttribute('y',0);
      t.setAttribute('transform','translate('+(b[0]+L*sx).toFixed(2)+','+(b[1]+A*sy).toFixed(2)+') scale('+sx.toFixed(4)+','+sy.toFixed(4)+')');
    });
  }
  fit();
  if(document.fonts){ if(document.fonts.ready) document.fonts.ready.then(fit); if(document.fonts.load) document.fonts.load('200px Anton').then(fit,function(){}); }
  var sec=card.closest('.founder-sec');
  [].slice.call(sec.querySelectorAll('.founder-copy>*')).forEach(function(el,k){ el.style.setProperty('--k',k); });
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
  card.classList.add('anim'); sec.classList.add('anim');
  var playing=false;
  function play(){ if(playing) return; playing=true; card.classList.remove('play'); sec.classList.remove('play'); void card.offsetWidth; card.classList.add('play'); sec.classList.add('play'); }
  function reset(){ if(!playing) return; playing=false; card.classList.remove('play'); sec.classList.remove('play'); }
  /* play each time at least a third of the card is on screen; reset once it has fully left */
  new IntersectionObserver(function(es){ es.forEach(function(e){
    if(e.isIntersecting&&e.intersectionRatio>=.3) play(); else if(!e.isIntersecting) reset();
  }); },{threshold:[0,.3]}).observe(card);
  /* gentle depth while scrolling */
  var ticking=false;
  function depth(){ ticking=false; var r=card.getBoundingClientRect(), vh=innerHeight; if(r.bottom<0||r.top>vh) return;
    var p=((r.top+r.height/2)-vh/2)/(vh/2+r.height/2); card.style.setProperty('--par',Math.max(-1,Math.min(1,p)).toFixed(3)); }
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(depth); } },{passive:true});
  depth();
  /* slight tilt that follows the mouse on computers */
  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
    card.addEventListener('pointermove',function(e){ var r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--tx',(x*10).toFixed(2)+'deg'); card.style.setProperty('--ty',(-y*8).toFixed(2)+'deg'); });
    card.addEventListener('pointerleave',function(){ card.style.setProperty('--tx','0deg'); card.style.setProperty('--ty','0deg'); });
  }
})();

/* ---------- Recent work: reel rail and player ----------
   Each card plays its 8-second silent loop (data-preview) while it is on screen.
   Tapping a card opens the full video (data-video) with sound, with previous and next.
   If a card has no data-preview, the full video is used for the loop as well. */
(function(){
  var rail=document.getElementById('workRail'); if(!rail) return;
  var cards=[].slice.call(rail.querySelectorAll('.work')), n=cards.length, cur=-1, visible=new Set();
  /* A copy of every card goes after the originals, so the rail can keep moving in an endless loop. */
  var clones=cards.map(function(c){ var k=c.cloneNode(true); k.setAttribute('aria-hidden','true'); k.tabIndex=-1; k.classList.remove('live'); k.dataset.clone='1'; rail.appendChild(k); return k; });
  var all=cards.concat(clones);
  var lb=document.getElementById('lightbox'), lbv=document.getElementById('lbVideo');
  var smooth=matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
  function attach(c){
    if(c._v||c._bad) return c._v;
    var v=document.createElement('video'), bar=c.querySelector('.work-progress i');
    v.muted=true; v.defaultMuted=true; v.setAttribute('muted','');
    v.loop=true; v.playsInline=true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
    v.preload='auto';
    ['loadeddata','canplay','playing'].forEach(function(ev){ v.addEventListener(ev,function(){ c.classList.add('live'); }); });
    v.addEventListener('timeupdate',function(){ if(v.duration&&bar) bar.style.transform='scaleX('+(v.currentTime/v.duration).toFixed(3)+')'; });
    v.addEventListener('error',function(){ c._bad=true; v.remove(); c._v=null; c.classList.remove('live'); });
    v.src=c.dataset.preview||c.dataset.video;
    c.querySelector('.work-cover').after(v);
    c._v=v; return v;
  }
  function play(c){ if(!lb.hidden) return; var v=attach(c); if(v){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } }
  function pause(c){ if(c._v) c._v.pause(); }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){
      if(e.isIntersecting&&e.intersectionRatio>=.5){ visible.add(e.target); play(e.target); }
      else { visible.delete(e.target); pause(e.target); }
    }); },{threshold:[0,.5,1]});
    all.forEach(function(c){ io.observe(c); });
  } else all.forEach(play);
  document.addEventListener('visibilitychange',function(){ if(!document.hidden) visible.forEach(play); });

  /* rail arrows, counter and position bar */
  var prev=document.getElementById('railPrev'), next=document.getElementById('railNext'), now=document.getElementById('railNow'), rbar=document.getElementById('railBar'), ctrl=document.getElementById('railCtrl');
  function step(){ return cards[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(rail).columnGap)||16); }
  function loopW(){ return clones[0].offsetLeft-cards[0].offsetLeft; }   /* width of one full set of reels */
  function page(dir){
    var s=step(), L=loopW(), by=dir*s*Math.max(1,Math.floor((rail.clientWidth+4)/s));
    if(dir<0&&rail.scrollLeft+by<0) rail.scrollLeft+=L;
    if(dir>0&&rail.scrollLeft>=L) rail.scrollLeft-=L;
    rail.scrollBy({left:by,behavior:smooth}); hold(6000);
  }
  prev.addEventListener('click',function(){ page(-1); });
  next.addEventListener('click',function(){ page(1); });
  function sync(){
    var L=loopW(); if(L<=0) return;
    if(rail.scrollLeft>=L+1&&!(auto&&auto.on)) { rail.scrollLeft-=L; if(auto) auto.pos=rail.scrollLeft; }
    var share=Math.min(1,rail.clientWidth/L), x=(rail.scrollLeft%L)/L;
    rbar.style.width=(share*100)+'%';
    rbar.style.transform='translateX('+(x/share*100)+'%)';
    now.textContent=String((Math.round(rail.scrollLeft/step())%n)+1).padStart(2,'0');
  }
  rail.addEventListener('scroll',sync,{passive:true}); window.addEventListener('resize',sync); sync();

  /* Slow automatic scroll, right to left, so visitors see every reel without touching anything.
     It pauses while someone hovers, touches, swipes or uses the arrows, and starts again a few seconds later.
     SPEED is in pixels per second. */
  var SPEED=matchMedia('(max-width:760px)').matches?30:38;
  var auto={on:false,pos:0,last:0,until:0,inView:false,hover:false};
  function hold(ms){ auto.until=Date.now()+(ms||4000); rail.classList.remove('auto-run'); }
  function tick(t){
    var can=auto.inView&&!auto.hover&&lb.hidden&&!document.hidden&&Date.now()>auto.until;
    if(can){
      if(!auto.on){ auto.on=true; auto.pos=rail.scrollLeft; rail.classList.add('auto-run'); auto.last=t; }
      var dt=Math.min(64,t-auto.last); auto.last=t;
      var L=loopW(); auto.pos+=SPEED*dt/1000; if(auto.pos>=L) auto.pos-=L;
      rail.scrollLeft=auto.pos;
    } else if(auto.on){ auto.on=false; rail.classList.remove('auto-run'); }
    requestAnimationFrame(tick);
  }
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){ auto.inView=es[0].isIntersecting; },{threshold:.35}).observe(rail);
    rail.addEventListener('mouseenter',function(){ auto.hover=true; });
    rail.addEventListener('mouseleave',function(){ auto.hover=false; hold(1200); });
    ['touchstart','pointerdown','wheel','keydown','focusin'].forEach(function(ev){ rail.addEventListener(ev,function(){ hold(4500); },{passive:true}); });
    rail.addEventListener('touchend',function(){ hold(3500); },{passive:true});
    requestAnimationFrame(tick);
  }

  /* full-screen player */
  function open(i){
    cur=(i+n)%n; var c=cards[cur];
    all.forEach(pause);
    lbv.src=c.dataset.video; lbv.poster=c.querySelector('.work-cover').src; lbv.muted=false;
    document.getElementById('lbTitle').textContent=c.querySelector('.work-cap b').textContent;
    document.getElementById('lbKind').textContent=c.querySelector('.work-kind').textContent;
    document.getElementById('lbCount').textContent=(cur+1)+' / '+n;
    if(lb.hidden){ lb.hidden=false; document.body.style.overflow='hidden'; document.getElementById('lbClose').focus(); }
    var p=lbv.play(); if(p&&p.catch) p.catch(function(){});
  }
  function close(){
    if(lb.hidden) return;
    lbv.pause(); lbv.removeAttribute('src'); lbv.load();
    lb.hidden=true; document.body.style.overflow='';
    var c=cards[cur];
    if(c){ rail.scrollTo({left:c.offsetLeft-cards[0].offsetLeft,behavior:'auto'}); c.focus({preventScroll:true}); }
    visible.forEach(play);
  }
  all.forEach(function(c,i){ c.addEventListener('click',function(e){ e.preventDefault(); open(i%n); }); });
  document.getElementById('lbPrev').addEventListener('click',function(){ open(cur-1); });
  document.getElementById('lbNext').addEventListener('click',function(){ open(cur+1); });
  document.getElementById('lbClose').addEventListener('click',close);
  lbv.addEventListener('ended',function(){ open(cur+1); });
  lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
  document.addEventListener('keydown',function(e){
    if(lb.hidden) return;
    if(e.key==='Escape') close(); else if(e.key==='ArrowLeft') open(cur-1); else if(e.key==='ArrowRight') open(cur+1);
  });
  var tx=null;
  lb.addEventListener('touchstart',function(e){ tx=e.touches[0].clientX; },{passive:true});
  lb.addEventListener('touchend',function(e){ if(tx===null) return; var dx=e.changedTouches[0].clientX-tx; tx=null; if(Math.abs(dx)>70) open(cur+(dx<0?1:-1)); },{passive:true});
})();


/* ---------- light / dark mode switch (light is the default; the choice is remembered) ---------- */
(function(){
  var d=document.documentElement, b=document.getElementById('themeBtn'), meta=document.querySelector('meta[name="theme-color"]');
  if(!b) return;
  function apply(t){
    if(t==='light') d.setAttribute('data-theme','light'); else d.removeAttribute('data-theme');
    b.setAttribute('aria-checked', t==='light' ? 'false' : 'true');
    if(meta) meta.setAttribute('content', t==='light' ? '#F3F7F6' : '#061415');
  }
  apply(d.getAttribute('data-theme')==='light' ? 'light' : 'dark');
  /* Switching: the new mode spreads out in a circle from the toggle (Chrome, Edge, Safari 18+).
     Other browsers get a smooth colour fade instead. */
  var busy=false;
  b.addEventListener('click',function(){
    if(busy) return;
    var t=d.getAttribute('data-theme')==='light' ? 'dark' : 'light';
    try{ localStorage.setItem('vs-theme',t); }catch(e){}
    var reduce=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!document.startViewTransition || reduce){
      d.classList.add('theme-anim'); apply(t);
      setTimeout(function(){ d.classList.remove('theme-anim'); },500);
      return;
    }
    var r=b.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2;
    var end=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    busy=true; d.classList.add('vt-theme');
    var vt=document.startViewTransition(function(){ apply(t); });
    vt.ready.then(function(){
      d.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+end+'px at '+x+'px '+y+'px)']},
        {duration:750,easing:'cubic-bezier(.65,0,.35,1)',pseudoElement:'::view-transition-new(root)'});
    }).catch(function(){});
    vt.finished.finally(function(){ busy=false; d.classList.remove('vt-theme'); });
  });
})();


/* ---------- cookie notice: remembers "all" or "essential" on this device ----------
   No tracking runs today. If analytics is ever added, load it only when window.vsConsent()==='all'. */
(function(){
  var KEY='vs-consent', box=document.getElementById('ck'); if(!box) return;
  function get(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function set(v){ try{ localStorage.setItem(KEY,v); }catch(e){} box.hidden=true; }
  window.vsConsent=get;
  function show(){ box.hidden=false; }
  if(!get()) setTimeout(show, document.documentElement.classList.contains('intro-lock') ? 3200 : 900);
  document.getElementById('ckAccept').addEventListener('click',function(){ set('all'); });
  document.getElementById('ckEssential').addEventListener('click',function(){ set('essential'); });
  var re=document.getElementById('ckReopen'); if(re) re.addEventListener('click',show);
})();
