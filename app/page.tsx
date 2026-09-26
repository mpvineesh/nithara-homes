"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Menu, X, ArrowLeft, ArrowRight, Expand, Pause, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const gallery = [
 {src:"villa-day",title:"The corner residence",description:"Sculpted lines, planted balconies, and a welcoming entrance."},
 {src:"villa-front",title:"The terrace residence",description:"A layered facade, generous glazing, and an open rooftop terrace."},
 {src:"villa-night",title:"A warmer welcome",description:"The villa exterior, illuminated at dusk."},
 {src:"living",title:"Space to come together",description:"A light-filled living space with room for everyday moments."},
 {src:"kitchen",title:"At the heart of home",description:"Connected dining and kitchen spaces, made for shared moments."},
 {src:"bedroom",title:"Your own quiet corner",description:"A restful bedroom with warm textures and soft natural light."},
 {src:"double-height",title:"A new perspective",description:"Double-height spaces that connect the home with light and air."},
 {src:"staircase",title:"Considered at every turn",description:"A sculptural staircase with warm materials and clean lines."},
];
const heroSlides=[
 {src:"hero",alt:"Contemporary Nithara villas with white facades, warm wood finishes and planted balconies",caption:"Your everyday. Elevated.",label:"DESIGNED AROUND YOU"},
 {src:"streetscape",alt:"A streetscape of contemporary Nithara villa exteriors",caption:"A fresh perspective on home.",label:"ROOM FOR POSSIBILITY"},
 {src:"living",alt:"A warm, light-filled Nithara villa living room",caption:"Beautiful moments begin here.",label:"THE ART OF EVERYDAY LIVING"},
];
const rooms=[{key:"living",name:"Living spaces",index:3},{key:"kitchen",name:"Kitchen & dining",index:4},{key:"bedroom",name:"Private retreats",index:5}];
const imageSrc=(name:string)=>`${process.env.NEXT_PUBLIC_BASE_PATH??""}/images/${name}.jpg`;

function RollingLabel({ children }: { children: string }) {
 return <span className="rolling-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}
function MotionHeading({ lines }: { lines: string[] }) {
 let index=0;
 return <>{lines.map((line,lineIndex)=><span className="heading-line" key={lineIndex}>{line.split(" ").map(word=><span className="word-mask" key={index}><span className="word-reveal" style={{animationDelay:`${index++ * 65}ms`}}>{word}</span></span>)}</span>)}</>;
}

function Brand(){return <a href="#home" className="brand" aria-label="Nithara Homes home"><span className="brand-mark">n<span>h</span></span><span>NITHARA<small>H O M E S</small></span></a>}
export default function Home(){
 const [menu,setMenu]=useState(false);
 const [slide,setSlide]=useState(0);
 const [photo,setPhoto]=useState<number|null>(null);
 const rootRef=useRef<HTMLElement>(null);
 const [motionPaused,setMotionPaused]=useState(false);
 const [reducedMotion,setReducedMotion]=useState(false);
 const [featureEngaged,setFeatureEngaged]=useState(false);
 const [heroVisible,setHeroVisible]=useState(true);
 const motionOff=motionPaused||reducedMotion;
 useEffect(()=>{
  const preference=window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync=()=>setReducedMotion(preference.matches);
  sync(); preference.addEventListener("change",sync);
  return ()=>preference.removeEventListener("change",sync);
 },[]);
 useEffect(()=>{
  const root=rootRef.current;
  if(!root)return;
  const items=root.querySelectorAll<HTMLElement>(".reveal > *, .project-card, .design-notes > div, .closing-content");
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add("motion-visible");observer.unobserve(entry.target)}
  }),{threshold:0.08,rootMargin:"0px 0px -35px 0px"});
  items.forEach((item,index)=>{
   item.classList.add("motion-target");
   item.style.setProperty("--reveal-delay",`${index%3*90}ms`);
   observer.observe(item);
  });
  const hero=root.querySelector(".hero");
  const heroObserver=new IntersectionObserver(([entry])=>setHeroVisible(entry.isIntersecting));
  if(hero)heroObserver.observe(hero);
  return ()=>{observer.disconnect();heroObserver.disconnect()};
 },[]);
 useEffect(()=>{
  if(motionOff||featureEngaged||!heroVisible||photo!==null)return;
  const timer=window.setInterval(()=>{if(!document.hidden)setSlide(current=>(current+1)%heroSlides.length)},6500);
  return ()=>window.clearInterval(timer);
 },[slide,motionOff,featureEngaged,heroVisible,photo]);
 useEffect(()=>{
  const root=rootRef.current;
  if(!root)return;
  const hero=root.querySelector<HTMLElement>(".hero");
  const closing=root.querySelector<HTMLElement>(".closing");
  let frame=0;
  const paint=()=>{
   frame=0;
   const mobile=window.innerWidth<761;
   const heroOffset=hero?Math.min(Math.max(-hero.getBoundingClientRect().top,0),hero.offsetHeight):0;
   root.style.setProperty("--hero-drift",`${motionOff||mobile?0:heroOffset*.18}px`);
   if(closing){const rect=closing.getBoundingClientRect();root.style.setProperty("--closing-drift",`${motionOff||mobile?0:Math.max(-55,Math.min(55,(window.innerHeight/2-rect.top-rect.height/2)*.12))}px`)}
  };
  const requestPaint=()=>{if(!frame)frame=requestAnimationFrame(paint)};
  paint();
  if(!motionOff){window.addEventListener("scroll",requestPaint,{passive:true});window.addEventListener("resize",requestPaint)}
  return ()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",requestPaint);window.removeEventListener("resize",requestPaint)};
 },[motionOff]);
 const nextPhoto=(direction:number)=>setPhoto(current=>current===null?null:(current+direction+gallery.length)%gallery.length);
 return <main id="home" ref={rootRef} data-motion-paused={motionOff}><a className="skip-link" href="#projects">Skip to homes</a>
  <header className="header"><Brand/><nav aria-label="Main navigation" className={menu?'navigation is-open':'navigation'}><a href="#home" onClick={()=>setMenu(false)}>Home</a><a href="#about" onClick={()=>setMenu(false)}>Our story</a><a href="#projects" onClick={()=>setMenu(false)}>Our homes</a><a href="#interiors" onClick={()=>setMenu(false)}>The details</a></nav><a className="nav-cta" href="#projects"><RollingLabel>Find your home</RollingLabel><ArrowUpRight size={17}/></a><button className="menu-toggle" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
  <section className="hero" aria-labelledby="hero-title">
    <img className="hero-background" src={imageSrc("hero")} alt="Contemporary Nithara villas with landscaped balconies and warm exterior lighting" fetchPriority="high"/>
   <div className="hero-grid" aria-hidden="true"/>
   <div className="hero-content"><div className="hero-copy"><p className="eyebrow">Thoughtfully built. Beautifully lived.</p><h1 id="hero-title"><MotionHeading lines={["Designing homes","for a fuller life."]}/></h1><div className="hero-bottom"><a className="pill" href="#projects"><RollingLabel>Explore our homes</RollingLabel><span className="pill-icon"><ArrowUpRight size={18}/></span></a><p>Contemporary villas, considered details, and space to be yourself. Discover a home designed around the way you want to live.</p></div></div>
    <aside className="feature-card" aria-label="Featured spaces" onMouseEnter={()=>setFeatureEngaged(true)} onMouseLeave={event=>setFeatureEngaged(event.currentTarget.contains(document.activeElement))} onFocusCapture={()=>setFeatureEngaged(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setFeatureEngaged(false)}}><div key={slide} className="feature-caption"><h2>{heroSlides[slide].caption}</h2><p>{heroSlides[slide].label==='DESIGNED AROUND YOU'?'Thoughtful architecture. A personal touch.':slide===1?'A place to grow. A place to belong.':'Warm interiors, made for real life.'}</p></div><button className="feature-image" onClick={()=>setPhoto(slide===2?3:slide)} aria-label="View featured residence"><img key={slide} src={imageSrc(slide===0?'villa-day':slide===1?'villa-front':'living')} alt={heroSlides[slide].alt}/><Expand size={18}/></button><div className="feature-controls"><div className="slide-dots">{heroSlides.map((_,i)=><button key={i} aria-label={`Show featured image ${i+1}`} aria-pressed={slide===i} className={slide===i?'active':''} onClick={()=>setSlide(i)}/>)}</div><div><button onClick={()=>setSlide((slide+2)%3)} aria-label="Previous featured image"><ArrowLeft/></button><button onClick={()=>setSlide((slide+1)%3)} aria-label="Next featured image"><ArrowRight/></button></div></div></aside></div>
  </section>
  <section id="about" className="about section reveal"><div className="about-signature"><p className="eyebrow">The Nithara philosophy</p><p className="signature-title">Built around<br/><span>your life.</span></p><a className="text-link" href="#interiors">Discover the difference <ArrowUpRight size={20}/></a></div><div className="about-story"><h2><MotionHeading lines={["Thoughtful spaces.","Lasting connections.","A new way to feel at home."]}/></h2><p>Home is where life unfolds. The quiet mornings, the shared meals, the moments that become memories. We bring considered architecture and welcoming interiors together to make room for it all.</p></div></section>
    <section className="story-cards section reveal" aria-label="The Nithara way"><button className="story-photo" onClick={()=>setPhoto(2)} aria-label="Explore the villa at dusk"><img src={imageSrc("villa-night")} alt="Nithara villa illuminated at dusk" loading="lazy"/><span>A warmer welcome <ArrowUpRight/></span></button><div className="story-statement"><span className="mini-mark" aria-hidden="true">N.</span><h2>Distinctive homes.<br/>Everyday possibilities.</h2><p>Beautiful proportions, natural light, and thoughtful details. Architecture that feels as good as it looks.</p><a className="pill" href="#projects"><RollingLabel>Discover our homes</RollingLabel><span className="pill-icon"><ArrowUpRight size={18}/></span></a></div><button className="story-detail" onClick={()=>setPhoto(6)} aria-label="Explore double-height living"><img src={imageSrc("double-height")} alt="A double-height living room with a sculptural feature wall" loading="lazy"/><h3>Extraordinary spaces.<br/>A very personal feeling.</h3><span className="text-link">Take a closer look <ArrowUpRight size={18}/></span></button></section>
    <section className="living-section" aria-labelledby="living-title"><div className="living-inner section reveal"><div className="living-copy"><p className="eyebrow">Space for what matters</p><h2 id="living-title"><MotionHeading lines={["A little more light.","A little more room.","A lot more life."]}/></h2><div className="living-point"><span>01</span><div><h3>Open, connected living</h3><p>Generous volumes and a natural flow between rooms bring everyone a little closer.</p></div></div><div className="living-point"><span>02</span><div><h3>Your own quiet corner</h3><p>Private terraces and restful interiors offer space to pause, recharge, and simply be.</p></div></div><a className="pill dark-pill" href="#interiors"><RollingLabel>Step inside</RollingLabel><span className="pill-icon"><ArrowUpRight size={18}/></span></a></div><button className="living-image" onClick={()=>setPhoto(3)} aria-label="View the living room"><img src={imageSrc("living")} alt="An airy villa living room opening into the dining space" loading="lazy"/><span><Expand size={22}/></span></button></div></section>
    <section id="projects" className="projects section reveal"><div className="section-heading"><div><p className="eyebrow">Our villa collection</p><h2><MotionHeading lines={["Find your own","sense of belonging."]}/></h2></div><p>Contemporary architecture.<br/>A personal sense of home.</p></div><div className="project-grid"><article className="project-card"><button className="project-photo" onClick={()=>setPhoto(0)} aria-label="View the corner residence"><img src={imageSrc("villa-day")} alt="Corner villa with a private terrace and landscaped entrance" loading="lazy"/><span className="image-tag">THE VILLA COLLECTION</span><span className="photo-hint"><Expand size={16}/> View residence</span></button><div className="project-info"><div><h3>The corner residence</h3><p>Open perspectives. Thoughtful proportions.</p></div><button className="circle-link dark" onClick={()=>setPhoto(0)} aria-label="Explore the corner residence"><ArrowUpRight/></button></div></article><article className="project-card second"><button className="project-photo" onClick={()=>setPhoto(1)} aria-label="View the terrace residence"><img src={imageSrc("villa-front")} alt="Front elevation of a Nithara villa with generous balconies" loading="lazy"/><span className="image-tag">THE VILLA COLLECTION</span><span className="photo-hint"><Expand size={16}/> View residence</span></button><div className="project-info"><div><h3>The terrace residence</h3><p>Room to unwind. Space to be yourself.</p></div><button className="circle-link dark" onClick={()=>setPhoto(1)} aria-label="Explore the terrace residence"><ArrowUpRight/></button></div></article></div></section>
  <section id="interiors" className="interiors section reveal"><p className="eyebrow">Considered from the inside out</p><div className="interior-heading"><h2><MotionHeading lines={["Beautiful details.","Better everyday living."]}/></h2><p>Natural light. Warm materials. Spaces that flow.<br/>A closer look at life within a Nithara home.</p></div>
    <Tabs defaultValue="living" className="room-tabs"><TabsList className="room-tab-list" aria-label="Explore interior spaces" variant="line">{rooms.map(room=><TabsTrigger className="room-tab" value={room.key} key={room.key}>{room.name}</TabsTrigger>)}</TabsList>{rooms.map(room=><TabsContent value={room.key} key={room.key}><button className="interior-photo" onClick={()=>setPhoto(room.index)} aria-label={`Enlarge ${room.name.toLowerCase()}`}><img src={imageSrc(room.key)} alt={gallery[room.index].description} loading="lazy"/><span className="interior-photo-label">{gallery[room.index].title}<Expand size={22}/></span></button></TabsContent>)}</Tabs>
   <div className="design-notes"><div><span>01</span><h3>Light, in every corner.</h3><p>Generous windows and open volumes welcome the day into your home.</p></div><div><span>02</span><h3>Spaces that connect.</h3><p>From living to dining, a natural flow brings everyone a little closer.</p></div><div><span>03</span><h3>A moment to yourself.</h3><p>Quiet interiors and private outdoor spaces make room to slow down.</p></div></div>
  </section>
  <div className="design-marquee" aria-hidden="true"><div>Thoughtfully built. Beautifully lived. <span>✳</span> Thoughtfully built. Beautifully lived. <span>✳</span> </div></div>
    <section className="closing"><img src={imageSrc("streetscape")} alt="A tree-lined view of the Nithara villa collection" loading="lazy"/><div className="closing-content"><p className="eyebrow">A NEW PERSPECTIVE ON HOME</p><h2>The next chapter.<br/><em>Make it yours.</em></h2><a href="#projects" className="pill"><RollingLabel>Explore the collection</RollingLabel><span className="pill-icon"><ArrowUpRight size={20}/></span></a></div></section>
  <footer className="site-footer"><div className="footer-inner"><div className="footer-top"><div className="footer-brand"><Brand/><p>Thoughtful spaces.<br/> Meaningful living.</p></div><nav className="footer-navigation" aria-label="Footer navigation"><a href="#about">Our story</a><a href="#projects">Our homes</a><a href="#interiors">The details</a></nav><a href="#home" className="footer-back">Back to top <span><ArrowUpRight size={18}/></span></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Nithara Homes. All rights reserved.</p><p>Designed around life.</p></div></div></footer>
  <button className="motion-control" aria-label={motionOff?"Enable animations":"Pause animations"} aria-pressed={motionOff} disabled={reducedMotion} onClick={()=>setMotionPaused(current=>!current)}>{motionOff?<Play size={13}/>:<Pause size={13}/>}<span>{reducedMotion?"Reduced motion":motionPaused?"Play motion":"Pause motion"}</span></button>
  <Dialog open={photo!==null} onOpenChange={open=>{if(!open)setPhoto(null)}}><DialogContent className="gallery-dialog" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();nextPhoto(1)}if(event.key==='ArrowLeft'){event.preventDefault();nextPhoto(-1)}}}>
    {photo!==null&&<><div className="gallery-heading"><p className="eyebrow">THE NITHARA COLLECTION</p><DialogTitle>{gallery[photo].title}</DialogTitle><DialogDescription>{gallery[photo].description}</DialogDescription></div><img className="gallery-image" src={imageSrc(gallery[photo].src)} alt={gallery[photo].description}/><div className="gallery-controls"><button onClick={()=>nextPhoto(-1)} aria-label="Previous photo"><ArrowLeft size={20}/><span>Previous</span></button><span aria-live="polite">{String(photo+1).padStart(2,'0')} / {String(gallery.length).padStart(2,'0')}</span><button onClick={()=>nextPhoto(1)} aria-label="Next photo"><span>Next</span><ArrowRight size={20}/></button></div></>}
  </DialogContent></Dialog>
 </main>
}
