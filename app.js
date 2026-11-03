(function(){
var d=document,R=matchMedia('(prefers-reduced-motion: reduce)').matches;
var head=d.querySelector('.head'),hero=d.querySelector('.hero'),barra=d.querySelector('.barra'),fala=d.querySelector('.fala');
var ticking=false;
function sc(){
  ticking=false;var y=scrollY,h=hero?hero.offsetHeight-90:-1;
  if(head&&hero)head.classList.toggle('solid',y>h);
  if(barra){var f=fala?fala.getBoundingClientRect().top<innerHeight:false;barra.classList.toggle('on',y>(hero?h*.7:160)&&!f)}
  if(words.length){
    var r=frase.getBoundingClientRect(),vh=innerHeight;
    var p=Math.min(1,Math.max(0,(vh*.86-r.top)/(r.height+vh*.28)));
    var n=p*words.length*1.12;
    for(var i=0;i<words.length;i++)words[i].style.opacity=Math.max(.2,Math.min(1,n-i));
  }
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(sc)}}
var frase=d.querySelector('[data-luz]'),words=[];
if(frase&&!R){
  var t=frase.textContent.trim().split(/\s+/);frase.innerHTML=t.map(function(w){return'<span class="w">'+w+'</span>'}).join(' ');
  words=[].slice.call(frase.querySelectorAll('.w'));
}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);sc();
var doors=[].slice.call(d.querySelectorAll('.door'));
if(R||!('IntersectionObserver'in window)){doors.forEach(function(e){e.classList.add('in','done')})}
else{
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;io.unobserve(e.target);var el=e.target;
    el.classList.add('in');setTimeout(function(){el.classList.add('done')},1350);
  })},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
  doors.forEach(function(e){var l=d.createElement('i');l.className='leaf';l.setAttribute('aria-hidden','true');e.appendChild(l);io.observe(e)});
}
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!R){
  d.querySelectorAll('.tile .door').forEach(function(e){e.addEventListener('pointermove',function(v){
    var r=e.getBoundingClientRect();e.style.setProperty('--x',(v.clientX-r.left)+'px');e.style.setProperty('--y',(v.clientY-r.top)+'px');
  })});
}
var pi=d.querySelectorAll('.panel img'),et=d.querySelectorAll('.etapa');
if(pi.length&&'IntersectionObserver'in window){
  var eo=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){var k=+e.target.dataset.i;pi.forEach(function(m,i){m.classList.toggle('on',i===k)})}
  })},{rootMargin:'-45% 0px -45% 0px'});
  et.forEach(function(e){eo.observe(e)});
}
var lb=d.querySelector('dialog.lb');
if(lb){
  var fs=[].slice.call(d.querySelectorAll('.foto')),box=lb.querySelector('.lb-v'),cap=lb.querySelector('.lb-t'),cnt=lb.querySelector('.lb-n-c'),cur=0,orig=null,xs=null;
  function show(i){
    cur=(i+fs.length)%fs.length;var f=fs[cur];
    var c=d.createElement('img');c.src=f.dataset.full;c.alt=f.dataset.cap||'';box.innerHTML='';box.appendChild(c);
    cap.textContent=f.dataset.cap||'';cnt.textContent=(cur+1)+' de '+fs.length;
  }
  fs.forEach(function(f,i){f.addEventListener('click',function(){orig=f;show(i);lb.showModal()})});
  lb.querySelector('.lb-x').onclick=function(){lb.close()};
  lb.querySelector('.lb-p').onclick=function(){show(cur-1)};
  lb.querySelector('.lb-n').onclick=function(){show(cur+1)};
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target===box)lb.close()});
  lb.addEventListener('close',function(){box.innerHTML='';if(orig)orig.focus()});
  lb.addEventListener('touchstart',function(e){xs=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(xs===null)return;var dx=e.changedTouches[0].clientX-xs;xs=null;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))});
}
})();
