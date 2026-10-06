import React, {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

const IMAGES = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=92",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1800&q=92"
];

const WORK = [
  {title:"The Last Scene", type:"Lead · Drama", image:IMAGES[1], year:"2025"},
  {title:"After Midnight", type:"Supporting · Series", image:IMAGES[2], year:"2025"},
  {title:"In Her Words", type:"Lead · Short Film", image:IMAGES[3], year:"2024"}
];

function Magnetic({children, className="", href="#contact"}) {
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;
    if(!el) return;
    const move=e=>{
      const r=el.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      el.style.setProperty("--tx",`${x*.22}px`);
      el.style.setProperty("--ty",`${y*.22}px`);
      el.style.setProperty("--sx",`${1+Math.min(Math.hypot(x,y)/900,.035)}`);
    };
    const leave=()=>{el.style.setProperty("--tx","0px");el.style.setProperty("--ty","0px");el.style.setProperty("--sx","1")};
    el.addEventListener("pointermove",move);el.addEventListener("pointerleave",leave);
    return()=>{el.removeEventListener("pointermove",move);el.removeEventListener("pointerleave",leave)};
  },[]);
  return <a ref={ref} className={`magnetic ${className}`} href={href}><span>{children}</span></a>
}

function App(){
  const [menu,setMenu]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [active,setActive]=useState(0);
  const [workOpen,setWorkOpen]=useState(null);
  const cursor=useRef(null);
  const cursorRing=useRef(null);
  const raf=useRef(0);
  const pointer=useRef({x:0,y:0,rx:0,ry:0});
  const root=useRef(null);

  useEffect(()=>{
    const t=setTimeout(()=>setLoaded(true),850);
    const reveal=()=>{
      document.querySelectorAll("[data-reveal]").forEach(el=>{
        if(el.getBoundingClientRect().top < innerHeight*.88) el.classList.add("is-in");
      });
      const max=document.documentElement.scrollHeight-innerHeight;
      document.documentElement.style.setProperty("--scroll",max?scrollY/max:0);
      const sections=[...document.querySelectorAll("section[id]")];
      const current=sections.reduce((acc,s)=>Math.abs(s.getBoundingClientRect().top-innerHeight*.28)<Math.abs(acc.getBoundingClientRect().top-innerHeight*.28)?s:acc,sections[0]);
      if(current) setActive(current.id);
    };
    const move=e=>{
      pointer.current.x=e.clientX;pointer.current.y=e.clientY;
      document.documentElement.style.setProperty("--px",`${e.clientX}px`);
      document.documentElement.style.setProperty("--py",`${e.clientY}px`);
    };
    const tick=()=>{
      pointer.current.rx+=(pointer.current.x-pointer.current.rx)*.14;
      pointer.current.ry+=(pointer.current.y-pointer.current.ry)*.14;
      if(cursor.current) cursor.current.style.transform=`translate3d(${pointer.current.rx}px,${pointer.current.ry}px,0)`;
      if(cursorRing.current) cursorRing.current.style.transform=`translate3d(${pointer.current.rx}px,${pointer.current.ry}px,0)`;
      raf.current=requestAnimationFrame(tick);
    };
    addEventListener("scroll",reveal,{passive:true});addEventListener("pointermove",move,{passive:true});
    reveal();raf.current=requestAnimationFrame(tick);
    return()=>{clearTimeout(t);removeEventListener("scroll",reveal);removeEventListener("pointermove",move);cancelAnimationFrame(raf.current)};
  },[]);

  useEffect(()=>{
    if(menu) document.body.classList.add("menu-open"); else document.body.classList.remove("menu-open");
  },[menu]);
  useEffect(()=>{
    const onKey=e=>{
      if(workOpen===null) return;
      if(e.key==="Escape") setWorkOpen(null);
      if(e.key==="ArrowRight") setWorkOpen(i=>(i+1)%WORK.length);
      if(e.key==="ArrowLeft") setWorkOpen(i=>(i-1+WORK.length)%WORK.length);
    };
    addEventListener("keydown",onKey);
    return()=>removeEventListener("keydown",onKey);
  },[workOpen]);



  const close=()=>setMenu(false);

  return <div ref={root} className={`site ${loaded?"loaded":""}`}>
    <div className="loader"><div className="loader-name">ENIOLA JACK</div><div className="loader-line"><i/></div></div>
    <div className="progress"/>
    <div ref={cursor} className="cursor"/><div ref={cursorRing} className="cursor-ring"/>

    <header className={menu?"nav nav-open":"nav"}>
      <a href="#home" className="brand" onClick={close}>EJ<span>.</span></a>
      <nav className="desktop-links">
        {["work","about","press","contact"].map(id=><a className={active===id?"active":""} href={`#${id}`} key={id}>{id}</a>)}
      </nav>
      <button className="menu-btn" onClick={()=>setMenu(!menu)} aria-label="Toggle menu"><span/><span/></button>
    </header>

    <div className={menu?"menu-layer open":"menu-layer"}>
      <div className="menu-glow"/>
      <nav>
        {["home","work","about","press","contact"].map((id,i)=><a style={{"--i":i}} href={`#${id}`} onClick={close} key={id}>{id}<sup>{String(i+1).padStart(2,"0")}</sup></a>)}
      </nav>
      <p>ACTRESS · CREATIVE · UK</p>
    </div>

    <main>
      <section id="home" className="hero">
        <div className="hero-noise"/>
        <div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/>
        <div className="hero-copy">
          <p className="eyebrow" data-reveal>ACTRESS <b>·</b> CREATIVE <b>·</b> UK</p>
          <h1 data-reveal><span>ENIOLA</span><em>JACK</em></h1>
          <div className="hero-bottom" data-reveal>
            <p>Performance built around presence, precision<br/>and the quiet space between words.</p>
            <Magnetic className="round-cta" href="#work">ENTER<br/>THE<br/>WORK <i>↘</i></Magnetic>
          </div>
        </div>
        <div className="hero-image-wrap" data-reveal>
          <div className="hero-image-reel">
            {IMAGES.map((image,i)=><div className="hero-frame" key={image} style={{"--frame":i}}><img src={image} alt={i===0 ? "Eniola Jack portrait" : "Acting portrait"} /></div>)}
          </div>
          <span className="image-caption">PORTRAIT REEL / 01—04</span>
          <div className="reel-progress"><i/><i/><i/><i/></div>
        </div>
        <div className="scroll-cue"><span>SCROLL</span><i/></div>
      </section>

      <section className="industry-strip" aria-label="Selected platforms and broadcasters">
        <div className="industry-label">ON SCREEN / SELECTED PLATFORMS</div>
        <div className="industry-track">
          <span>NETFLIX</span><span>PRIME VIDEO</span><span>CBS</span><span>BBC</span><span>HBO</span><span>SHOWTIME</span>
          <span>NETFLIX</span><span>PRIME VIDEO</span><span>CBS</span><span>BBC</span><span>HBO</span><span>SHOWTIME</span>
        </div>
      </section>

      <section className="manifesto" data-reveal>
        <div className="manifesto-kicker">THE PRACTICE</div>
        <p className="manifesto-text"><span data-reveal>A performance is not simply</span> <i data-reveal>seen.</i><br/><strong data-reveal>It is felt.</strong></p>
        <div className="manifesto-orb"/>
      </section>

      <section id="work" className="work">
        <div className="section-head" data-reveal><span>Selected work</span><small>Film · Television · Stage</small></div>
        <div className="work-intro" data-reveal><h2>Roles that<br/><i>leave a trace.</i></h2><p>Selected screen work and creative collaborations.</p></div>
        <div className="work-rail">
          {WORK.map((item,i)=><button className={`work-card card-${i}`} key={item.title} data-reveal onClick={()=>setWorkOpen(i)}>
            <div className="work-media"><img src={item.image} alt="" loading="lazy"/><div className="media-shine"/></div>
            <div className="work-meta"><span>{item.type}</span><span>{item.year}</span></div>
            <h3>{item.title}</h3><span className="work-action">Open role <b>↗</b></span>
          </button>)}
        </div>
        <div className="work-next" data-reveal>
          <button onClick={()=>setWorkOpen(0)}><span>OPEN THE REEL</span><b>↘</b></button>
          <p>Tap a role. The next story is waiting inside.</p>
        </div>
      </section>

      {workOpen!==null && <div className="work-modal" role="dialog" aria-modal="true" aria-label={WORK[workOpen].title}>
        <div className="modal-backdrop" onClick={()=>setWorkOpen(null)}/>
        <div className="modal-panel">
          <div className="modal-image"><img src={WORK[workOpen].image} alt="" /></div>
          <div className="modal-copy">
            <span>{String(workOpen+1).padStart(2,"0")} / {String(WORK.length).padStart(2,"0")}</span>
            <h2>{WORK[workOpen].title}</h2>
            <p>{WORK[workOpen].type} · {WORK[workOpen].year}</p>
            <div className="modal-actions">
              <button onClick={()=>setWorkOpen((workOpen+1)%WORK.length)}>NEXT STORY <b>↗</b></button>
              <button onClick={()=>setWorkOpen(null)}>CLOSE <b>×</b></button>
            </div>
          </div>
        </div>
      </div>}

      <section id="about" className="about">
        <div className="about-image" data-reveal><img src={IMAGES[2]} alt="Eniola Jack portrait" loading="lazy"/><span>ENIOLA / JACK</span></div>
        <div className="about-copy">
          <div className="section-head" data-reveal><span>About</span><small>Presence over performance</small></div>
          <h2 data-reveal>There is a<br/><i>world</i> inside<br/>every role.</h2>
          <p data-reveal>The work begins long before the camera rolls. Character, rhythm, silence, movement — every detail is part of the story.</p>
          <Magnetic className="text-link" href="#contact">Availability <span>↗</span></Magnetic>
        </div>
      </section>

      <section className="marquee" aria-hidden="true"><div>ACTING · STORY · CHARACTER · PRESENCE · ACTING · STORY · CHARACTER · PRESENCE · </div></section>

      <section id="press" className="press">
        <div className="section-head" data-reveal><span>Press & credits</span><small>Selected appearances</small></div>
        <div className="press-grid">
          {["Screen work","Creative collaborations","Interviews & press","Representation"].map((x,i)=><a href="#contact" data-reveal key={x}><span>{x}</span><b>↗</b><i>0{i+1}</i></a>)}
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-glow"/>
        <p data-reveal>LET'S MAKE SOMETHING WORTH WATCHING.</p>
        <a className="contact-email" href="mailto:hello@eniolajack.com" data-reveal>hello@eniolajack.com <span>↗</span></a>
        <div className="contact-foot"><span>ENIOLA JACK</span><span>ACTRESS · CREATIVE · UK</span><span>© {new Date().getFullYear()}</span></div>
      </section>
    </main>
  </div>
}

createRoot(document.getElementById("root")).render(<App/>);