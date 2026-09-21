import { useEffect, useRef, useState } from 'react';
import ProjectCard from './ProjectCard.jsx';
import ProjectDetail from './ProjectDetail.jsx';
import { wrapProject, swipeDirection } from './carousel.js';
import '../styles/carousel.css';
export default function ProjectCarousel({ projects }) {
  const [index, setIndex] = useState(0), [transition, setTransition] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [detail, setDetail] = useState(null);
  const stage = useRef(null), suppressClick = useRef(false);
  const gesture = useRef(null), locked = useRef(false), timer = useRef(null);
  const current = wrapProject(index, projects.length);
  const multiple = projects.length > 1;
  useEffect(() => () => clearTimeout(timer.current), []);
  function move(direction, offset = 0) {
    if (!multiple || locked.current) return;
    locked.current = true;
    const full = document.body.dataset.fx === 'full';
    setTransition(full ? { previous:projects[current], direction, offset } : null);
    setIndex(wrapProject(current + direction, projects.length));
    setDragX(0);
    timer.current = setTimeout(() => { setTransition(null); locked.current = false; }, full ? 560 : 0);
  }
  function pointerDown(event) {
    suppressClick.current = false;
    if (locked.current || event.button !== 0 || event.target.closest('a,button,input,summary,details')) return;
    gesture.current = { id:event.pointerId, x:event.clientX, y:event.clientY, dx:0, dy:0, width:event.currentTarget.clientWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event) {
    const point = gesture.current;
    if (!point || point.id !== event.pointerId) return;
    point.dx = event.clientX-point.x; point.dy = event.clientY-point.y;
    if (Math.hypot(point.dx, point.dy) > 8) suppressClick.current = true;
    if (multiple && Math.abs(point.dx) > Math.abs(point.dy) * 1.3) setDragX(Math.max(-180,Math.min(180,point.dx * .45)));
  }
  function openDetail() {
    if (!locked.current && !suppressClick.current) setDetail({ project:projects[current], returnFocus:stage.current.querySelector('.project-open') });
  }
  function pointerUp(event) {
    const point = gesture.current;
    if (!point || point.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const direction = swipeDirection(point.dx, point.dy, point.width);
    if (direction) move(direction, dragX); else setDragX(0);
  }
  return <section className="project-carousel" data-carousel-count={projects.length} data-project-index={current} aria-label="Projets" aria-roledescription={multiple ? 'carousel' : undefined} tabIndex={multiple ? 0 : undefined}
    onKeyDown={event => { if (multiple && ['ArrowLeft','ArrowRight'].includes(event.key) && !event.target.closest('input,textarea,select')) { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
    <div ref={stage} className="carousel-stage" data-dragging={dragX !== 0} style={{ '--direction':transition?.direction || 1, '--from-x':`${transition?.offset || 0}px` }}
      onClick={event => { if (!event.target.closest('a,button,input,summary,details')) openDetail(); }}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { gesture.current=null; suppressClick.current=true; setDragX(0); }} onDragStart={event=>event.preventDefault()}>
      {transition && <div className="carousel-panel carousel-exit" aria-hidden="true" inert><ProjectCard project={transition.previous}/></div>}
      <div key={projects[current].id} className={`carousel-panel carousel-current${transition ? ' carousel-enter' : ''}`} style={dragX ? { transform:`translate3d(${dragX}px,0,-12px) scale(.995)` } : undefined}>
        <ProjectCard project={projects[current]} onOpen={() => { suppressClick.current=false; openDetail(); }}/>
      </div>
    </div>
    {multiple && <div className="carousel-controls"><button aria-label="Projet précédent" onClick={()=>move(-1)}>←</button><span className="mono" role="status" aria-live="polite">{String(current+1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</span><button aria-label="Projet suivant" onClick={()=>move(1)}>→</button></div>}
    {detail && <ProjectDetail {...detail} onClose={() => setDetail(null)}/>}
  </section>;
}
