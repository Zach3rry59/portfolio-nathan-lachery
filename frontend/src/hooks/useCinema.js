import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { clamp, remapProgress, scenePose, wheelProgress } from './navigation.js';
import { initialScene } from '../../../shared/public-pages.js';

export function useCinema(ids, full, stageRef) {
  const [active, setActive] = useState('home');
  const state = useRef({ ids, value: 0, target: 0, raf: 0, last: 0, announced: '' });
  const fullRef = useRef(full);
  fullRef.current = full;
  const renderRef = useRef(() => {});
  const runRef = useRef(() => {});
  const idsKey = ids.join('|');

  useLayoutEffect(() => {
    const timeline = state.current;
    const nextIds = idsKey.split('|');
    timeline.value = remapProgress(timeline.value, timeline.ids, nextIds);
    timeline.target = remapProgress(timeline.target, timeline.ids, nextIds);
    timeline.ids = nextIds;
    const elements = nextIds.map(id => stageRef.current.querySelector(`[data-scene="${id}"]`));
    const bar = document.querySelector('#progress');
    const track = document.querySelector('#timeline-range');
    function render() {
      const index = Math.round(timeline.value);
      const id = timeline.ids[index];
      elements.forEach((element, i) => {
        if (!element) return;
        const distance = i - timeline.value;
        const pose = scenePose(distance, fullRef.current);
        element.style.opacity = pose.opacity;
        element.style.transform = pose.transform;
        element.style.visibility = pose.opacity > 0 ? 'visible' : 'hidden';
        element.style.pointerEvents = i === index ? 'auto' : 'none';
        element.inert = i !== index;
        element.setAttribute('aria-hidden', String(i !== index));
      });
      if (bar) bar.style.transform = `scaleX(${timeline.value / Math.max(1, timeline.ids.length - 1)})`;
      if (track && document.activeElement !== track) track.value = timeline.value;
      stageRef.current.dataset.progress = timeline.value.toFixed(4);
      stageRef.current.dataset.activeScene = id;
      if (timeline.announced !== id) {
        timeline.announced = id;
        setActive(id);
        // Remove focus from a departing scene so keyboard users never remain in inert content.
        const focusedScene = document.activeElement?.closest('[data-scene]');
        if (focusedScene && focusedScene.dataset.scene !== id) stageRef.current.focus({ preventScroll: true });
      }
    }
    function tick(time) {
      const delta = Math.min(50, timeline.last ? time - timeline.last : 16);
      timeline.last = time;
      timeline.value = fullRef.current ? timeline.value + (timeline.target - timeline.value) * (1 - Math.exp(-delta / 90)) : timeline.target;
      if (Math.abs(timeline.target - timeline.value) < .0002) timeline.value = timeline.target;
      render();
      if (timeline.value !== timeline.target) timeline.raf = requestAnimationFrame(tick);
      else { timeline.raf = 0; timeline.last = 0; }
    }
    renderRef.current = render;
    runRef.current = () => { if (!timeline.raf) timeline.raf = requestAnimationFrame(tick); };
    render();
    if (timeline.value !== timeline.target) runRef.current();
    return () => { cancelAnimationFrame(timeline.raf); timeline.raf = 0; timeline.last = 0; };
  }, [idsKey, stageRef]);

  const seek = useCallback(value => {
    const timeline = state.current;
    timeline.target = clamp(value, 0, timeline.ids.length - 1);
    runRef.current();
  }, []);
  const navigate = useCallback((id, updateHistory = true) => {
    const index = state.current.ids.indexOf(id);
    if (index < 0) return;
    seek(index);
    if (updateHistory) history.pushState(null, '', `#${id}`);
  }, [seek]);
  const step = useCallback(direction => seek(clamp(Math.round(state.current.target) + direction, 0, state.current.ids.length - 1)), [seek]);

  useLayoutEffect(() => { renderRef.current(); runRef.current(); }, [full]);
  useLayoutEffect(() => {
    document.body.classList.add('cinematic');
    history.scrollRestoration = 'manual';
    scrollTo({ top: 0, behavior: 'instant' });
    const editable = target => target.closest('input, textarea, select, [contenteditable="true"], dialog');
    function wheel(event) {
      if (event.ctrlKey || editable(event.target)) return;
      // Only an explicitly scrollable reading area can consume native scrolling on short screens.
      const reader = event.target.closest('.scene-reader');
      if (reader && reader.scrollHeight > reader.clientHeight + 2 && (innerWidth <= 800 || innerHeight < 650 || reader.querySelector('details[open]'))) {
        const canRead = event.deltaY > 0 ? reader.scrollTop + reader.clientHeight < reader.scrollHeight - 2 : reader.scrollTop > 2;
        if (canRead) return;
      }
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      seek(wheelProgress(state.current.target, delta, state.current.ids.length));
    }
    function keyboard(event) {
      if (event.defaultPrevented || editable(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target.closest('button, a, summary') && [' ', 'Enter'].includes(event.key)) return;
      if (['ArrowUp','PageUp','ArrowRight'].includes(event.key)) { event.preventDefault(); step(1); }
      if (['ArrowDown','PageDown','ArrowLeft'].includes(event.key)) { event.preventDefault(); step(-1); }
      if (event.key === 'Home') { event.preventDefault(); seek(0); }
      if (event.key === 'End') { event.preventDefault(); seek(state.current.ids.length - 1); }
    }
    let previousY = null;
    function touchStart(event) { if (event.touches.length === 1 && !editable(event.target) && !event.target.closest('a,button,summary,.project-carousel')) previousY = event.touches[0].clientY; }
    function touchMove(event) {
      if (previousY === null || event.touches.length !== 1) return;
      const reader = event.target.closest('.scene-reader');
      if (reader && reader.scrollHeight > reader.clientHeight + 2) return;
      event.preventDefault();
      const currentY = event.touches[0].clientY;
      seek(state.current.target + (previousY - currentY) / 440);
      previousY = currentY;
    }
    const touchEnd = () => { previousY = null; };
    const back = () => navigate(location.hash.slice(1) || initialScene(location.pathname), false);
    addEventListener('wheel', wheel, { passive: false });
    addEventListener('keydown', keyboard);
    stageRef.current.addEventListener('touchstart', touchStart, { passive: true });
    const stage = stageRef.current;
    stage.addEventListener('touchmove', touchMove, { passive: false });
    stage.addEventListener('touchend', touchEnd);
    stage.addEventListener('touchcancel', touchEnd);
    addEventListener('popstate', back);
    back();
    return () => { document.body.classList.remove('cinematic'); removeEventListener('wheel', wheel); removeEventListener('keydown', keyboard); removeEventListener('popstate', back); stage.removeEventListener('touchstart', touchStart); stage.removeEventListener('touchmove', touchMove); stage.removeEventListener('touchend', touchEnd); stage.removeEventListener('touchcancel', touchEnd); };
  }, [navigate, seek, step, stageRef]);
  return { active, navigate, step, seek };
}
