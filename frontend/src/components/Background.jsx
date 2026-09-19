import { useEffect, useMemo, useRef } from 'react';
export default function Background({ effects }) {
  const cursor = useRef(null);
  const stars = useMemo(() => {
    let seed = 59;
    const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    return Array.from({ length: 85 }, (_, index) => ({ left: `${random() * 100}%`, top: `${random() * 100}%`, width: index % 9 === 0 ? 2 : 1, height: index % 9 === 0 ? 2 : 1, '--star-alpha': .18 + random() * .55, '--star-delay': `${-random() * 12}s` }));
  }, []);
  useEffect(() => {
    if (effects !== 'full' || !matchMedia('(pointer: fine)').matches) return;
    let frame = 0, x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    function paint() {
      x += (tx - x) * .12; y += (ty - y) * .12;
      cursor.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = Math.abs(x - tx) + Math.abs(y - ty) > .5 ? requestAnimationFrame(paint) : 0;
    }
    const move = event => { tx = event.clientX; ty = event.clientY; cursor.current.style.opacity = '1'; if (!frame) frame = requestAnimationFrame(paint); };
    const leave = () => { cursor.current.style.opacity = '0'; };
    addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(frame); removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); };
  }, [effects]);
  return <div className="universe" aria-hidden="true"><div className="nebula nebula--dev"/><div className="nebula nebula--industry"/><div className="starfield"><div className="star-drift">{stars.map((style, i) => <i className="star" key={i} style={style}/>)}</div></div><div className="cursor-light" ref={cursor}/></div>;
}
