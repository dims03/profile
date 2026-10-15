import { useEffect, useRef, useState, type PointerEvent } from 'react';
import portrait from '../assets/cartoon.webp';
import portraitSmall from '../assets/cartoon-640.webp';
import portraitXray from '../assets/cartoon-xray-anatomy.webp';

const scannerMedia = '(min-width: 640px) and (hover: hover) and (pointer: fine)';

export default function PortraitScanner() {
  const surface = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const alphaMap = useRef<Uint8ClampedArray | null>(null);
  const frame = useRef(0);
  const cursor = useRef({ x: 0, y: 0 });
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(scannerMedia);
    const stop = () => { surface.current?.removeAttribute('data-scanning'); };
    media.addEventListener('change', stop);
    return () => {
      media.removeEventListener('change', stop);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  function scan(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || failed || !window.matchMedia(scannerMedia).matches) return;
    const element = surface.current;
    const source = image.current;
    if (!element || !source?.complete || !source.naturalWidth) return;

    if (!alphaMap.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 192;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      try {
        context.drawImage(source, 0, 0, 128, 192);
        alphaMap.current = context.getImageData(0, 0, 128, 192).data;
      } catch {
        return;
      }
    }

    const bounds = element.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const column = Math.min(127, Math.max(0, Math.floor(x / bounds.width * 128)));
    const row = Math.min(191, Math.max(0, Math.floor(y / bounds.height * 192)));
    const onCharacter = alphaMap.current[(row * 128 + column) * 4 + 3] > 64;
    element.dataset.scanning = String(onCharacter);
    if (!onCharacter) return;

    if (!requested) setRequested(true);
    cursor.current = { x, y };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty('--scan-x', `${cursor.current.x}px`);
      element.style.setProperty('--scan-y', `${cursor.current.y}px`);
      frame.current = 0;
    });
  }

  function stop() {
    surface.current?.removeAttribute('data-scanning');
  }

  return (
    <div ref={surface} className="cartoon-figure portrait-scanner" data-ready={ready && !failed} onPointerMove={scan} onPointerLeave={stop} onPointerCancel={stop}>
      <img
        ref={image}
        src={portrait}
        srcSet={`${portraitSmall} 640w, ${portrait} 1024w`}
        sizes="(max-width: 639px) and (max-height: 700px) max(100px, calc(66.67dvh - 266.67px)), (max-width: 639px) max(100px, calc(66.67dvh - 330.67px)), (max-width: 1023px) 45vw, 58vh"
        alt="Cartoon portrait of Dimas Prayogi"
        className="portrait-original"
        width={1024}
        height={1536}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        onLoad={() => { alphaMap.current = null; }}
      />
      {requested && !failed && (
        <div className="portrait-anatomy" aria-hidden="true" style={{ maskImage: `url("${image.current?.currentSrc || portraitSmall}")`, WebkitMaskImage: `url("${image.current?.currentSrc || portraitSmall}")` }}>
          <img src={portraitXray} className="portrait-xray" alt="" width={1024} height={1536} decoding="async" draggable={false} onLoad={() => setReady(true)} onError={() => { setFailed(true); stop(); }} />
        </div>
      )}
      <div className="scanner-lens" aria-hidden="true"><span>X-ray view</span></div>
    </div>
  );
}
