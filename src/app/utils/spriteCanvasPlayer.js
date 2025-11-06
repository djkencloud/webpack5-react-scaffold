/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import React, { useRef, useEffect, useState } from 'react';

/**
 * SpriteCanvasPlayer
 * ------------------------------------------------------------
 * Lightweight sprite-sheet animation player using a <canvas>.
 *
 * Designed for TexturePacker-style JSON (or similar) where a single
 * image (atlas) contains all frames, and JSON describes the x/y/w/h
 * of each frame under `frames`.
 *
 * Core ideas:
 *  - We draw a sub-rectangle of the sprite image onto the canvas
 *    for each frame: ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
 *  - We scale frames to fill the canvas while preserving the frame
 *    aspect ratio via CSS `aspect-ratio` + high-DPI backing store.
 *  - We start playback when the component is at least 50% visible
 *    (IntersectionObserver), then pause/stop when it leaves view.
 *  - We keep memory usage in check and clean up listeners on unmount.
 *
 * Props
 * ------------------------------------------------------------
 *  jsonUrl: string
 *    URL to the frame data (e.g., TexturePacker JSON). Expected shape:
 *    {
 *      frames: {
 *        "frame_0001": { frame: { x, y, w, h }, ... },
 *        "frame_0002": { frame: { x, y, w, h }, ... },
 *        ...
 *      },
 *      meta: { ... }
 *    }
 *    NOTE: This component uses Object.values(spriteJson.frames) in the
 *    natural order provided by the JSON. Ensure your keys are emitted in
 *    frame order (most packers do), or adapt to a sorted order if needed.
 *
 *  imageUrl: string
 *    URL to the sprite sheet image (PNG/WEBP/JPEG). Must match the JSON.
 *
 *  frameRate?: number = 12
 *    Frames per second base timing used to compute frame delay.
 *
 *  playbackSpeed?: number = 1
 *    Multiplier applied to frame delay. With the current implementation
 *    (setTimeout), the effective delay is: (1000 / frameRate) * playbackSpeed
 *    – so values > 1 slow down playback; values < 1 speed it up.
 *    If you prefer the inverse (2 = 2x faster), flip the math in draw loop.
 *
 *  repeat?: boolean = false
 *    Whether to loop when the last frame is reached.
 *
 * Example
 * ------------------------------------------------------------
 * <SpriteCanvasPlayer
 *   jsonUrl="https://d11zrgpbhs014a.cloudfront.net/assets/sbs50/sprites/Intro_Boat_v2.json"
 *   imageUrl="https://d11zrgpbhs014a.cloudfront.net/assets/sbs50/sprites/Intro_Boat_v2.webp"
 *   frameRate={12}
 *   playbackSpeed={2}
 *   repeat
 * />
 */

// Small utility: debounce a function to avoid running on every resize tick
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export default function SpriteCanvasPlayer({
  jsonUrl,
  imageUrl,
  frameRate = 12,
  playbackSpeed = 1,
  repeat = false,
}) {
  // DOM refs
  const canvasRef = useRef(null); // the drawable surface
  const containerRef = useRef(null); // used for size + intersection observation

  // Resource refs
  const imageRef = useRef(null); // loaded Image element for the atlas

  // Playback state refs (refs so they don't retrigger effects)
  const frameRef = useRef(0); // current frame index (for redraw on resize)
  const hasPlayedRef = useRef(false); // ensures one-shot play when not repeating

  // React state for rendering/size
  const [aspectRatio, setAspectRatio] = useState(null); // CSS aspect-ratio string like "1920 / 1080"
  const [spriteJson, setSpriteJson] = useState(null); // parsed JSON data
  const [imageLoaded, setImageLoaded] = useState(false); // image load flag

  // 1) Load sprite JSON ------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    fetch(jsonUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSpriteJson(data);
      })
      .catch((err) => console.error('Failed to load sprite JSON:', err));
    return () => {
      cancelled = true;
    };
  }, [jsonUrl]);

  // 2) Preload image ---------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (!cancelled) setImageLoaded(true);
    };
    img.onerror = (err) => console.error('Failed to load sprite image:', err);
    imageRef.current = img;
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  // 3) Wire up canvas, sizing, and playback ---------------------------------
  useEffect(() => {
    if (!spriteJson || !imageLoaded) return; // wait until both are ready

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Frames array from JSON. Assumes proper order in JSON output.
    const framesArray = Object.values(spriteJson.frames || {});
    if (!framesArray.length) {
      console.warn('Sprite JSON contains no frames. Aborting.');
      return;
    }

    // Derive a consistent aspect ratio from the first frame's dimensions.
    const frameW = framesArray[0].frame.w;
    const frameH = framesArray[0].frame.h;
    const aspect = frameW / frameH;
    setAspectRatio(`${frameW} / ${frameH}`);

    // Helper: update canvas size to match container width while respecting
    // devicePixelRatio for crisp rendering on HiDPI screens.
    const updateCanvasSize = () => {
      const containerWidth = containerRef.current.offsetWidth;
      const displayWidth = containerWidth; // fill container width
      const displayHeight = displayWidth / aspect; // preserve frame aspect
      const pixelRatio = window.devicePixelRatio || 1;

      // Backing store size (physical pixels)
      canvas.width = Math.max(1, Math.round(displayWidth * pixelRatio));
      canvas.height = Math.max(1, Math.round(displayHeight * pixelRatio));

      // CSS size (CSS pixels)
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      // Optional approach: scale drawing context instead of scaling drawImage
      // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      // If we've already drawn at least one frame, redraw the last one so the
      // canvas doesn't appear blank after a resize.
      if (hasPlayedRef.current && frameRef.current >= 0) {
        const lastIndex = Math.min(frameRef.current, framesArray.length - 1);
        const { x, y, w, h } = framesArray[lastIndex].frame;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          imageRef.current,
          x,
          y,
          w,
          h,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      }
    };

    const debouncedResize = debounce(updateCanvasSize, 200);
    window.addEventListener('resize', debouncedResize);
    updateCanvasSize(); // initial sizing pass

    // Playback loop using setTimeout for frame pacing. You can swap this to
    // requestAnimationFrame for smoother timing and then accumulate deltas
    // against (1000 / frameRate) for more precise control if desired.
    let timeoutId = null;

    const startPlayback = () => {
      // Reset when (re)starting
      hasPlayedRef.current = true;
      frameRef.current = 0;
      let frame = 0;

      const drawFrame = () => {
        const img = imageRef.current;
        const { x, y, w, h } = framesArray[frame].frame;

        // Clear + draw current frame scaled to the full canvas size.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);

        // Advance frame index for next tick
        frameRef.current = frame;
        frame += 1;

        // Continue until end (and loop if `repeat`)
        if (frame < framesArray.length) {
          timeoutId = setTimeout(drawFrame, (1000 / frameRate) * playbackSpeed);
        } else if (repeat) {
          frame = 0;
          timeoutId = setTimeout(drawFrame, (1000 / frameRate) * playbackSpeed);
        }
      };

      // If repeat=false, we add a tiny initial delay so the browser can
      // finish any pending layout work when the section scrolls into view.
      const initialDelayMs = repeat ? 0 : 200;
      timeoutId = setTimeout(drawFrame, initialDelayMs);
    };

    // Start/stop based on intersection (50% visible threshold)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldPlay =
          entry.isIntersecting && (!hasPlayedRef.current || repeat);
        if (shouldPlay) {
          if (timeoutId) clearTimeout(timeoutId); // clear any lingering timers
          startPlayback();
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    // Cleanup listeners and timers on unmount or when deps change
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', debouncedResize);
    };
  }, [spriteJson, imageLoaded, frameRate, playbackSpeed, repeat]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          // CSS aspect-ratio ensures the canvas box maintains the correct shape
          // while we adjust the backing store for HiDPI in JS above.
          aspectRatio: aspectRatio || '16 / 9',
        }}
      />
    </div>
  );
}
