"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, ArrowUpRight, ArrowDown, Menu, X, ArrowLeft, ArrowRight, Expand, Pause, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Team details and portraits supplied by Nitara Estates.
const teamMembers = [
 {name:"Pramod Das",role:"Co-founder & Managing Director",initials:"PD",photo:"team-pramod-closeup",bio:"Bringing a clear vision and a personal approach to every home we create."},
 {name:"Anil BM",role:"Head of Architecture",initials:"AB",photo:null,bio:"Connecting natural light, thoughtful proportions, and the rhythms of everyday life."},
 {name:"Lohith Shetty",role:"Marketing lead",initials:"LS",photo:"team-lohith",bio:"The visionary artist and growth strategist leading our marketing universe. Equal parts analytical wizard and creative storyteller."},
 {name:"Kalyani Agarwal",role:"Legal Advisor",initials:"KA",photo:"team-kalyani",bio:"Dedicated to protecting your investments, she provides expert legal guidance on complex property transactions and zoning laws to ensure your real estate ventures are secure and legally sound."},
];
// Original illustrative quotes retained as requested; not verified customer reviews.
const testimonials = [
 {quote:"From the first walkthrough, we could picture our life here. The light, the layout, the little details — everything felt thoughtfully considered.",name:"Rudramurthy K",detail:"Homeowner Story",initials:"RK",photo:"customer-rudramurthy"},
 {quote:"What stood out was the personal attention. Every question was welcomed, and we felt involved at each step of choosing our home.",name:"Sandeep Kuttiprath",detail:"Homeowner Story",initials:"SK",photo:"customer-sandeep"},
 {quote:"We wanted a home with room for family time and quiet moments. These spaces bring those two things together beautifully.",name:"Pritty & Vipin Thomas",detail:"Homeowner Story",initials:"PV",photo:"customer-vipin"},
];

const gallery = [
 {src:"villa-day",title:"The corner residence",description:"Sculpted lines, planted balconies, and a welcoming entrance."},
 {src:"villa-front",title:"The terrace residence",description:"A layered facade, generous glazing, and an open rooftop terrace."},
 {src:"villa-night",title:"A warmer welcome",description:"The villa exterior, illuminated at dusk."},
 {src:"living",title:"Space to come together",description:"A light-filled living space with room for everyday moments."},
 {src:"kitchen",title:"At the heart of home",description:"Connected dining and kitchen spaces, made for shared moments."},
 {src:"bedroom",title:"Your own quiet corner",description:"A restful bedroom with warm textures and soft natural light."},
 {src:"double-height",title:"A new perspective",description:"Double-height spaces that connect the home with light and air."},
 {src:"staircase",title:"Considered at every turn",description:"A sculptural staircase with warm materials and clean lines."},
 {src:"floor-ground",title:"Ground floor plan",description:"Ground floor layout showing parking, living and dining spaces, kitchen, and guest bedroom."},
 {src:"floor-first",title:"First floor plan",description:"First floor layout showing bedrooms, dressing space, bathrooms, and the open-to-below area."},
 {src:"floor-second",title:"Second floor plan",description:"Second floor layout showing the terrace and stair access."},
];
const heroSlides=[
 {src:"hero",alt:"Contemporary Nitara Estates villas with white facades, warm wood finishes and planted balconies",caption:"Your everyday. Elevated.",label:"DESIGNED AROUND YOU"},
 {src:"streetscape",alt:"A streetscape of contemporary Nitara Estates villa exteriors",caption:"A fresh perspective on home.",label:"ROOM FOR POSSIBILITY"},
 {src:"living",alt:"A warm, light-filled Nitara Estates villa living room",caption:"Beautiful moments begin here.",label:"THE ART OF EVERYDAY LIVING"},
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

function BrandLogo(){return <span className="estate-brand"><svg className="brand-artwork" viewBox="460 565 660 900" width="84" height="112" role="img" aria-label="Nitara — Beyond Bricks"><image href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/brand-logo-new.png`} width="1417" height="2020"/></svg></span>}
function Brand(){return <a href="#home" className="brand" aria-label="Nitara Estates home"><BrandLogo/></a>}
export default function Home(){
 const [menu,setMenu]=useState(false);
 const [headerCompact,setHeaderCompact]=useState(false);
 useEffect(()=>{
  const updateHeader=()=>setHeaderCompact(current=>window.scrollY>100?true:window.scrollY<40?false:current);
  updateHeader();
  window.addEventListener("scroll",updateHeader,{passive:true});
  return ()=>window.removeEventListener("scroll",updateHeader);
 },[]);
 const [testimonial,setTestimonial]=useState(0);
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
  <header className={headerCompact?"header header-compact":"header"}><Brand/><nav aria-label="Main navigation" className={menu?'navigation is-open':'navigation'}><a href="#home" onClick={()=>setMenu(false)}>Home</a><a href="#about" onClick={()=>setMenu(false)}>Our stories</a><a href="#projects" onClick={()=>setMenu(false)}>Our homes</a><a href="#interiors" onClick={()=>setMenu(false)}>The details</a><a href="#team" onClick={()=>setMenu(false)}>Our team</a><a href="#testimonials" onClick={()=>setMenu(false)}>Testimonials</a></nav><a className="nav-cta" href="#projects"><RollingLabel>Find your home</RollingLabel><ArrowUpRight size={17}/></a><button className="menu-toggle" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
  <section className="hero" aria-labelledby="hero-title">
    <img className="hero-background" src={imageSrc("hero")} alt="Contemporary Nitara Estates villas with landscaped balconies and warm exterior lighting" fetchPriority="high"/>
   <div className="hero-grid" aria-hidden="true"/>
   <div className="hero-content"><div className="hero-copy"><p className="eyebrow">Thoughtfully built. Beautifully lived.</p><h1 id="hero-title"><MotionHeading lines={["Designing homes","for a fuller life."]}/></h1><div className="hero-bottom"><a className="pill" href="#projects"><RollingLabel>Explore our homes</RollingLabel><span className="pill-icon"><ArrowUpRight size={18}/></span></a><p>Contemporary villas, considered details, and space to be yourself. Discover a home designed around the way you want to live.</p></div></div>
    <aside className="feature-card" aria-label="Featured spaces" onMouseEnter={()=>setFeatureEngaged(true)} onMouseLeave={event=>setFeatureEngaged(event.currentTarget.contains(document.activeElement))} onFocusCapture={()=>setFeatureEngaged(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setFeatureEngaged(false)}}><div key={slide} className="feature-caption"><h2>{heroSlides[slide].caption}</h2><p>{heroSlides[slide].label==='DESIGNED AROUND YOU'?'Thoughtful architecture. A personal touch.':slide===1?'A place to grow. A place to belong.':'Warm interiors, made for real life.'}</p></div><button className="feature-image" onClick={()=>setPhoto(slide===2?3:slide)} aria-label="View featured residence"><img key={slide} src={imageSrc(slide===0?'villa-day':slide===1?'villa-front':'living')} alt={heroSlides[slide].alt}/><Expand size={18}/></button><div className="feature-controls"><div className="slide-dots">{heroSlides.map((_,i)=><button key={i} aria-label={`Show featured image ${i+1}`} aria-pressed={slide===i} className={slide===i?'active':''} onClick={()=>setSlide(i)}/>)}</div><div><button onClick={()=>setSlide((slide+2)%3)} aria-label="Previous featured image"><ArrowLeft/></button><button onClick={()=>setSlide((slide+1)%3)} aria-label="Next featured image"><ArrowRight/></button></div></div></aside></div>
  </section>
  <section id="about" className="about section reveal"><div className="about-signature"><p className="eyebrow">The Nitara Estates philosophy</p><p className="signature-title">Built around<br/><span>your life.</span></p><a className="text-link" href="#interiors">Discover the difference <ArrowUpRight size={20}/></a></div><div className="about-story"><h2><MotionHeading lines={["Thoughtful spaces.","Lasting connections.","A new way to feel at home."]}/></h2><p>Nitara Estates is a Bengaluru-based real estate development and construction company specializing in luxury gated communities, premium independent villas, and townships. Backed by over 20 years of industry experience, the company is committed to delivering high-quality homes with a focus on integrity, transparency, sustainability, and modern design.</p><p>Its flagship project, Nitara Nest Premium Villa near Muthanallur, Sarjapur Road, offers premium 3, 3.5, 4, and 4.5 BHK villas featuring contemporary architecture, premium finishes, smart security systems, spacious layouts, and thoughtfully integrated green elements.</p></div></section>
    <section className="story-cards section reveal" aria-label="The Nitara Estates way"><button className="story-photo" onClick={()=>setPhoto(2)} aria-label="Explore the villa at dusk"><img src={imageSrc("villa-night")} alt="Nitara Estates villa illuminated at dusk" loading="lazy"/><span>A warmer welcome <ArrowUpRight/></span></button><div className="story-statement"><div className="statement-logo"><BrandLogo/></div><h2>Distinctive homes.<br/>Everyday possibilities.</h2><p>Beautiful proportions, natural light, and thoughtful details. Architecture that feels as good as it looks.</p><a className="pill" href="#projects"><RollingLabel>Discover our homes</RollingLabel><span className="pill-icon"><ArrowUpRight size={18}/></span></a></div><button className="story-detail" onClick={()=>setPhoto(6)} aria-label="Explore double-height living"><img src={imageSrc("double-height")} alt="A double-height living room with a sculptural feature wall" loading="lazy"/><h3>Extraordinary spaces.<br/>A very personal feeling.</h3><span className="text-link">Take a closer look <ArrowUpRight size={18}/></span></button></section>
    <section className="living-section" aria-labelledby="living-title"><div className="living-inner section reveal"><div className="living-copy"><p className="eyebrow">Space for what matters</p><h2 id="living-title"><MotionHeading lines={["A little more light.","A little more room.","A lot more life."]}/></h2><div className="living-point"><span>01</span><div><h3>Open, connected living</h3><p>Generous volumes and a natural flow between rooms bring everyone a little closer.</p></div></div><div className="living-point"><span>02</span><div><h3>Your own quiet corner</h3><p>Private terraces and restful interiors offer space to pause, recharge, and simply be.</p></div></div><a className="pill dark-pill" href="#interiors"><RollingLabel>Step inside</RollingLabel><span className="pill-icon"><ArrowUpRight size={18}/></span></a></div><button className="living-image" onClick={()=>setPhoto(3)} aria-label="View the living room"><img src={imageSrc("living")} alt="An airy villa living room opening into the dining space" loading="lazy"/><span><Expand size={22}/></span></button></div></section>
    <section id="projects" className="projects section reveal"><div className="section-heading"><div><p className="eyebrow">Nitara Nest · A Nitara Estates community</p><h2><MotionHeading lines={["Find your own","sense of belonging."]}/></h2></div><p>Contemporary architecture.<br/>A personal sense of home.</p></div><div className="project-overview"><div><h3>Nitara Nest</h3><p>Nitara Nest is a premium residential villa community developed by Nitara Estates in Ali Bommasandra, Karnataka, near Bengaluru’s growing Sarjapur–Muthanallur zone. Designed for homebuyers and investors, it brings upscale villas together with nature-integrated community living.</p><p>The project is BMRDA-approved.</p></div><dl className="project-facts"><div><dt>Villa configurations</dt><dd>3, 3.5, 4 &amp; 4.5 BHK</dd></div><div><dt>Location</dt><dd>Ali Bommasandra, Karnataka</dd></div><div><dt>Community</dt><dd>Premium gated villa development</dd></div></dl></div><div className="project-highlights"><article><h3>Space for family life</h3><p>Luxury villas with spacious configurations and contemporary architectural elevations.</p></article><article><h3>Closer to nature</h3><p>A tranquil setting with fresh air and proximity to a peaceful local lake.</p></article><article><h3>Everyday comforts</h3><p>Thoughtfully planned neighbourhood amenities tailored for family living.</p></article><article><h3>A connected location</h3><p>Situated near Bengaluru’s growing Sarjapur–Muthanallur corridor.</p></article></div><div className="project-grid"><article className="project-card"><button className="project-photo" onClick={()=>setPhoto(0)} aria-label="View the corner residence"><img src={imageSrc("villa-day")} alt="Corner villa with a private terrace and landscaped entrance" loading="lazy"/><span className="image-tag">THE VILLA COLLECTION</span><span className="photo-hint"><Expand size={16}/> View residence</span></button><div className="project-info"><div><h3>The corner residence</h3><p>Open perspectives. Thoughtful proportions.</p></div><button className="circle-link dark" onClick={()=>setPhoto(0)} aria-label="Explore the corner residence"><ArrowUpRight/></button></div></article><article className="project-card second"><button className="project-photo" onClick={()=>setPhoto(1)} aria-label="View the terrace residence"><img src={imageSrc("villa-front")} alt="Front elevation of a Nitara Estates villa with generous balconies" loading="lazy"/><span className="image-tag">THE VILLA COLLECTION</span><span className="photo-hint"><Expand size={16}/> View residence</span></button><div className="project-info"><div><h3>The terrace residence</h3><p>Room to unwind. Space to be yourself.</p></div><button className="circle-link dark" onClick={()=>setPhoto(1)} aria-label="Explore the terrace residence"><ArrowUpRight/></button></div></article></div></section>
  <section id="interiors" className="interiors section reveal"><p className="eyebrow">Considered from the inside out</p><div className="interior-heading"><h2><MotionHeading lines={["Beautiful details.","Better everyday living."]}/></h2><p>Natural light. Warm materials. Spaces that flow.<br/>A closer look at life within a Nitara Estates home.</p></div>
    <Tabs defaultValue="living" className="room-tabs"><TabsList className="room-tab-list" aria-label="Explore interior spaces" variant="line">{rooms.map(room=><TabsTrigger className="room-tab" value={room.key} key={room.key}>{room.name}</TabsTrigger>)}</TabsList>{rooms.map(room=><TabsContent value={room.key} key={room.key}><button className="interior-photo" onClick={()=>setPhoto(room.index)} aria-label={`Enlarge ${room.name.toLowerCase()}`}><img src={imageSrc(room.key)} alt={gallery[room.index].description} loading="lazy"/><span className="interior-photo-label">{gallery[room.index].title}<Expand size={22}/></span></button></TabsContent>)}</Tabs>
   <div className="design-notes"><div><span>01</span><h3>Light, in every corner.</h3><p>Generous windows and open volumes welcome the day into your home.</p></div><div><span>02</span><h3>Spaces that connect.</h3><p>From living to dining, a natural flow brings everyone a little closer.</p></div><div><span>03</span><h3>A moment to yourself.</h3><p>Quiet interiors and private outdoor spaces make room to slow down.</p></div></div>
  </section>
  <section id="team" className="team-section section reveal" aria-labelledby="team-title">
   <div className="section-heading"><div><p className="eyebrow">Our team</p><h2 id="team-title"><MotionHeading lines={["Good homes begin","with good people."]}/></h2></div><p>A shared vision. A personal commitment.<br/>Meet the people behind the spaces.</p></div>
   <div className="team-grid">{teamMembers.map((member,index)=><article className="team-card" key={member.name}><div className="team-card-top">{member.photo?<img className={`team-portrait ${member.photo}`} src={imageSrc(member.photo)} alt={member.name} width={112} height={112} loading="lazy"/>:<span className="team-initials" aria-hidden="true">{member.initials}</span>}<span className="team-number">0{index+1}</span></div><p className="team-role">{member.role}</p><h3>{member.name}</h3>{member.bio&&<p className="team-bio">{member.bio}</p>}</article>)}</div>

  </section>
  <section id="testimonials" className="testimonials-section" aria-labelledby="testimonials-title"><div className="testimonials-inner section reveal">
   <div className="testimonial-intro"><p className="eyebrow">Testimonials</p><h2 id="testimonials-title">A home is personal.<br/>So is the experience.</h2><p>The moments that turn a new address into a place to belong.</p></div>
   <div className="testimonial-panel"><span className="quote-mark" aria-hidden="true">“</span><div className="testimonial-story" key={testimonial} aria-live="polite" aria-atomic="true"><blockquote>{testimonials[testimonial].quote}</blockquote><div className="testimonial-person"><img className="customer-photo" src={imageSrc(testimonials[testimonial].photo)} alt={testimonials[testimonial].name} width={120} height={150} loading="lazy"/><div><h3>{testimonials[testimonial].name}</h3><p>{testimonials[testimonial].detail}</p></div></div></div><div className="testimonial-controls"><span>{String(testimonial+1).padStart(2,"0")} <span>/ 03</span></span><div><button aria-label="Previous testimonial" onClick={()=>setTestimonial((testimonial+testimonials.length-1)%testimonials.length)}><ArrowLeft size={20}/></button><button aria-label="Next testimonial" onClick={()=>setTestimonial((testimonial+1)%testimonials.length)}><ArrowRight size={20}/></button></div></div></div>
  </div></section>
  <div className="design-marquee" aria-hidden="true"><div>Thoughtfully built. Beautifully lived. <span>✳</span> Thoughtfully built. Beautifully lived. <span>✳</span> </div></div>
    <section className="closing"><img src={imageSrc("streetscape")} alt="A tree-lined view of the Nitara Estates villa collection" loading="lazy"/><div className="closing-content"><p className="eyebrow">A NEW PERSPECTIVE ON HOME</p><h2>The next chapter.<br/><em>Make it yours.</em></h2><a href="#projects" className="pill"><RollingLabel>Explore the collection</RollingLabel><span className="pill-icon"><ArrowUpRight size={20}/></span></a></div></section>

  <footer className="site-footer"><div className="footer-inner"><div className="footer-top"><div className="footer-brand"><Brand/><p>Thoughtful spaces.<br/> Meaningful living.</p></div><nav className="footer-navigation" aria-label="Footer navigation"><a href="#about">Our stories</a><a href="#projects">Our homes</a><a href="#interiors">The details</a><a href="#team">Our team</a><a href="#testimonials">Testimonials</a></nav><a href="#home" className="footer-back">Back to top <span><ArrowUpRight size={18}/></span></a></div><div className="footer-location"><div className="office-address"><h3>Office address</h3><address>NITARA ESTATES &amp; SPACES LLP<br/>No. 954, 7th Cross, 2nd Block,<br/>BSK 1st Stage, Bangalore–560050</address></div><section className="footer-contact" aria-labelledby="contact-title"><div><p className="eyebrow">LET’S TALK</p><h2 id="contact-title">For more details, call</h2></div><div className="contact-numbers"><a href="tel:+919845479444">+91 98454 79444 <Phone size={18} aria-hidden="true"/></a><a href="tel:+919902015536">+91 99020 15536 <Phone size={18} aria-hidden="true"/></a></div></section><figure className="location-qr"><div className="qr-heading"><span>NITARA NEST</span><h3>Check us out on Google</h3><p>Find our location and explore reviews.</p></div><img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/location-qr-nov09.png`} alt="Scan the QR code to find Nitara Nest on Google" width={166} height={165} loading="lazy"/><figcaption>Scan with your phone’s camera</figcaption></figure></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Nitara Estates. All rights reserved.</p><p>Designed around life.</p></div></div></footer>
  <a className="whatsapp-float" href="https://wa.me/919845479444?text=Hi%2C%20I%E2%80%99m%20interested%20in%20Nitara%20Nest%20villas.%20Could%20you%20please%20share%20more%20details%20and%20help%20me%20arrange%20a%20site%20visit%3F" target="_blank" rel="noopener noreferrer" aria-label="Chat with Nitara Estates on WhatsApp" title="Chat with us on WhatsApp"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.98L0 24l6.23-1.63a11.94 11.94 0 0 0 5.81 1.48h.01C18.64 23.85 24 18.49 24 11.9c0-3.19-1.24-6.18-3.48-8.42ZM12.05 21.83a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.7.97.99-3.61-.23-.37a9.9 9.9 0 0 1-1.52-5.28c0-5.48 4.46-9.94 9.95-9.94 2.66 0 5.15 1.04 7.03 2.92a9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.46 9.87-10.03 9.87Zm5.46-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.3 1.27.48 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg></a>
  <button className="motion-control" aria-label={motionOff?"Enable animations":"Pause animations"} aria-pressed={motionOff} disabled={reducedMotion} onClick={()=>setMotionPaused(current=>!current)}>{motionOff?<Play size={13}/>:<Pause size={13}/>}<span>{reducedMotion?"Reduced motion":motionPaused?"Play motion":"Pause motion"}</span></button>
  <Dialog open={photo!==null} onOpenChange={open=>{if(!open)setPhoto(null)}}><DialogContent className="gallery-dialog" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();nextPhoto(1)}if(event.key==='ArrowLeft'){event.preventDefault();nextPhoto(-1)}}}>
    {photo!==null&&<><div className="gallery-heading"><p className="eyebrow">THE NITARA ESTATES COLLECTION</p><DialogTitle>{gallery[photo].title}</DialogTitle><DialogDescription>{gallery[photo].description}</DialogDescription></div><nav className="floor-plan-nav" aria-label="Residence floor plans"><span>Floor plans</span>{gallery.map((item,index)=>item.src.startsWith("floor-")?<button key={item.src} onClick={()=>setPhoto(index)} aria-pressed={photo===index}>{item.title.replace(" plan","")}</button>:null)}</nav><img className="gallery-image" src={imageSrc(gallery[photo].src)} alt={gallery[photo].description}/>{gallery[photo].src.startsWith("floor-")&&<a className="floor-original" href={imageSrc(gallery[photo].src)} target="_blank" rel="noopener noreferrer">Open full-size floor plan <ArrowUpRight size={16}/></a>}<div className="gallery-controls"><button onClick={()=>nextPhoto(-1)} aria-label="Previous photo"><ArrowLeft size={20}/><span>Previous</span></button><span aria-live="polite">{String(photo+1).padStart(2,'0')} / {String(gallery.length).padStart(2,'0')}</span><button onClick={()=>nextPhoto(1)} aria-label="Next photo"><span>Next</span><ArrowRight size={20}/></button></div></>}
  </DialogContent></Dialog>
 </main>
}
