document.documentElement.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(pointer: fine)');
const profile = document.querySelector('.floating-profile');
// Animate semantic text blocks without splitting words or duplicating accessible text.
document.querySelectorAll('.hero-copy > *, .section-heading > *, .project-copy > h3, .project-copy > p, .timeline article h3, .timeline article h4, .timeline article p, .certificate > h3, .certificate > p, .contact-intro > h3, .contact-intro > p, .contact-card > h3, .contact-card > p, footer > p, footer > h2').forEach((el) => {
  el.classList.add('text-reveal');
  const siblings = [...el.parentElement.children];
  el.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(el) * 45, 180) + 'ms');
});
document.querySelectorAll('.bento, .projects, .cert-grid, .contact-grid').forEach(group => {
  [...group.children].forEach((el,i) => el.style.setProperty('--reveal-delay', (i % 2) * 90 + 'ms'));
});
const revealTargets = document.querySelectorAll('.reveal, .text-reveal');
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting || reduced.matches) entry.target.classList.add('in-view');
  else if (entry.boundingClientRect.top >= innerHeight - 40 || entry.boundingClientRect.bottom <= 0) entry.target.classList.remove('in-view');
}), {threshold:0, rootMargin:'0px 0px -40px 0px'});
revealTargets.forEach(el => reveal.observe(el));
document.addEventListener('focusin',e => {
  let el=e.target;
  while(el instanceof Element){
    if(el.matches('.reveal, .text-reveal')) el.classList.add('in-view');
    el=el.parentElement;
  }
});
reduced.addEventListener('change',()=>{if(reduced.matches)revealTargets.forEach(el=>el.classList.add('in-view'));});
const signature = document.querySelector('.signature');
new IntersectionObserver(entries => entries.forEach(e => signature.classList.toggle('drawn',e.isIntersecting)),{threshold:.6}).observe(signature);
const nav = [...document.querySelectorAll('.dock a')];
const sections = nav.map(a=>document.querySelector(a.getAttribute('href')));
let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  profile.classList.toggle('visible',scrollY>350);
  let current = -1;
  sections.forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight*.45) current=i;});
  nav.forEach((a,i)=>{a.classList.toggle('active',i===current);if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
addEventListener('scroll',()=>{cursor.style.opacity='0';if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});
updateScroll();
const theme = document.querySelector('#theme');
theme.addEventListener('click',()=>{
  const dark=document.body.classList.toggle('dark');
  theme.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
});
const note=document.querySelector('#note');
note.closest('.note-card').addEventListener('click',()=>{
  const open=note.getAttribute('aria-expanded')!=='true';
  note.setAttribute('aria-expanded',String(open));
  note.setAttribute('aria-label',open?'Close note':'Grab a little inspiration');
  document.querySelector('#note-message').hidden=!open;
  note.closest('.note-card').classList.toggle('open',open);
});
const hello=document.querySelector('#hello');
const greetings=['Hello','नमस्ते','Hola','你好','Bonjour'];
let greeting=0;
setInterval(()=>{
  if(reduced.matches||document.hidden||scrollY>650)return;
  hello.classList.add('changing');
  setTimeout(()=>{hello.textContent=greetings[++greeting%greetings.length];hello.classList.remove('changing');},200);
},3200);
const cursor=document.querySelector('#cursor');
let pointerX=-100,pointerY=-100,cursorFrame=0;
function paintCursor(){cursorFrame=0;cursor.style.transform='translate3d('+pointerX+'px,'+pointerY+'px,0) translate(-50%,-50%)';}
addEventListener('pointermove',e=>{
  if(!fine.matches||e.pointerType==='touch')return;
  pointerX=e.clientX;pointerY=e.clientY;
  const target=e.target.closest('[data-cursor]');
  cursor.textContent=target?.dataset.cursor||'';
  cursor.classList.toggle('labeled',Boolean(target));
  cursor.style.opacity='1';
  if(!cursorFrame)cursorFrame=requestAnimationFrame(paintCursor);
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>cursor.style.opacity='0');
const card=document.querySelector('.id-card');
const strap=document.querySelector('#strap');
const shadow=document.querySelector('.strap-shadow');
let x=0,y=0,vx=0,vy=0,dragging=false,startX=0,startY=0,originX=0,originY=0,moved=false,frame=0,last=0;
function renderCard(){
  card.style.transform='translate('+x+'px,'+y+'px) rotate('+x*.08+'deg)';
  const d='M180 -40 C'+(180-x*.12)+' 50 '+(180+x*.75)+' '+(95+y)+' '+(180+x)+' '+(178+y);
  strap.setAttribute('d',d);shadow.setAttribute('d',d);
}
function settle(time){
  frame=0;
  if(dragging)return;
  const dt=Math.min((time-(last||time-16))/16.667,2);last=time;
  if(reduced.matches){x=y=vx=vy=0;renderCard();return;}
  vx=(vx-x*.055*dt)*Math.pow(.88,dt);vy=(vy-y*.07*dt)*Math.pow(.85,dt);
  x+=vx*dt;y+=vy*dt;
  renderCard();
  if(Math.abs(x)+Math.abs(y)+Math.abs(vx)+Math.abs(vy)>.08)frame=requestAnimationFrame(settle);
  else{x=y=vx=vy=0;renderCard();last=0;}
}
function spring(){if(!frame){last=0;frame=requestAnimationFrame(settle);}}
card.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  dragging=true;moved=false;startX=e.clientX;startY=e.clientY;originX=x;originY=y;
  cancelAnimationFrame(frame);frame=0;card.setPointerCapture(e.pointerId);
});
card.addEventListener('pointermove',e=>{
  if(!dragging)return;
  const scale=card.closest('.badge-stage').getBoundingClientRect().width/360;
  const nx=Math.max(-100,Math.min(100,originX+(e.clientX-startX)/scale));
  const ny=Math.max(-90,Math.min(65,originY+(e.clientY-startY)/scale));
  vx=(nx-x)*.4;vy=(ny-y)*.4;x=nx;y=ny;
  moved=moved||Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY)>5;
  renderCard();
});
function release(){if(!dragging)return;dragging=false;spring();}
card.addEventListener('pointerup',release);card.addEventListener('pointercancel',release);card.addEventListener('lostpointercapture',release);
card.addEventListener('click',()=>{if(!moved)card.classList.toggle('flipped');});
card.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
    e.preventDefault();if(e.key==='ArrowLeft')vx-=12;if(e.key==='ArrowRight')vx+=12;if(e.key==='ArrowUp')vy-=8;if(e.key==='ArrowDown')vy+=8;spring();
  }
});
reduced.addEventListener('change',()=>{if(reduced.matches){x=y=vx=vy=0;renderCard();}});

const activityCard=document.querySelector('.activity-card');
const stackPause=document.querySelector('.stack-pause');
new IntersectionObserver(entries=>entries.forEach(e=>activityCard.classList.toggle('is-active',e.isIntersecting))).observe(activityCard);
stackPause.addEventListener('click',()=>{
  const paused=activityCard.classList.toggle('paused');
  stackPause.setAttribute('aria-pressed',String(paused));
  stackPause.setAttribute('aria-label',paused?'Play technology animation':'Pause technology animation');
  stackPause.title=paused?'Play technology animation':'Pause technology animation';
  stackPause.firstElementChild.textContent=paused?'▶':'Ⅱ';
});
