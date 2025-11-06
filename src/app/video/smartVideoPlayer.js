/* eslint-disable no-empty */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/media-has-caption */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
// If you already have these utilities in your codebase, keep the imports below.
// Otherwise, replace with your own helpers or inline logic.
import loadShakaScript from './loadShakaScript';
import { isInIOSWebView } from '../utils/functions';
/**
 * SmartVideoPlayer
 * -------------------------------------------------------------
 * A reusable video component that:
 *  - Selects 9x16 or 16x9 sources based on viewport (or a forced orientation).
 *  - Plays DASH via Shaka when available; falls back to MP4.
 *  - Autoplays when sufficiently visible (IntersectionObserver) and pauses when out of view.
 *  - Gracefully degrades on iOS WebViews by rendering a poster image.
 *  - Exposes imperative methods: play(), pause(), seek(seconds), getVideo() via ref.
 *
 * Props
 * -------------------------------------------------------------
 *  // Source sets (provide whichever you have; component will pick the right one)
 *  dashSrc16x9?: string
 *  dashSrc9x16?: string
 *  mp4Src16x9?: string
 *  mp4Src9x16?: string
 *  poster16x9?: string
 *  poster9x16?: string
 *
 *  // Behaviour
 *  preferOrientation?: "auto" | "16x9" | "9x16"   (default: "auto")
 *  aspectThreshold?: number                          (default: 0.75; w/h below means "verticalish")
 *  useShaka?: boolean                                (default: true)
 *  intersectionThreshold?: number                    (default: 0.4)
 *  playWhenInView?: boolean                          (default: true)
 *  loop?: boolean                                    (default: true)
 *  muted?: boolean                                   (default: true)
 *  preload?: "auto" | "metadata" | "none"        (default: "auto")
 *  controls?: boolean                                (default: false)
 *  playsInline?: boolean                             (default: true)
 *  shakaConfig?: object                              (passed to player.configure)
 *  className?: string
 *  style?: React.CSSProperties
 *
 *  // iOS WebView handling
 *  renderPosterInIOSWebView?: boolean                (default: true)
 *
 *  // Events
 *  onReady?: (ctx: { player: any | null; video: HTMLVideoElement | null; orientation: "16x9" | "9x16" }) => void
 *  onError?: (error: any) => void
 *
 * Usage example:
 * -------------------------------------------------------------
 * <SmartVideoPlayer
 *   dashSrc9x16={"/path/to/9x16.mpd"}
 *   mp4Src9x16={"/path/to/9x16_legacy.mp4"}
 *   poster9x16={"/path/to/9x16.png"}
 *   dashSrc16x9={"/path/to/16x9.mpd"}
 *   mp4Src16x9={"/path/to/16x9_legacy.mp4"}
 *   poster16x9={"/path/to/16x9.png"}
 *   className="header-video"
 * />
 */

const SmartVideoPlayer = forwardRef(function SmartVideoPlayer(
  {
    // sources
    dashSrc16x9,
    dashSrc9x16,
    mp4Src16x9,
    mp4Src9x16,
    poster16x9,
    poster9x16,
    // behaviour
    preferOrientation = 'auto',
    aspectThreshold = 0.75,
    useShaka = true,
    intersectionThreshold = 0.4,
    playWhenInView = true,
    loop = true,
    muted = true,
    preload = 'auto',
    controls = false,
    playsInline = true,
    shakaConfig,
    className,
    style,
    // iOS WebView handling
    renderPosterInIOSWebView = true,
    // events
    onReady,
    onError,
  },
  ref,
) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [orientation, setOrientation] = useState('16x9'); // "16x9" | "9x16"
  const isWebView = isInIOSWebView();

  // Decide orientation on mount + resize (only in auto mode)
  useEffect(() => {
    if (preferOrientation !== 'auto') {
      setOrientation(preferOrientation === '9x16' ? '9x16' : '16x9');
      return;
    }
    const decide = () => {
      const ratio = window.innerWidth / window.innerHeight; // w/h
      setOrientation(ratio < aspectThreshold ? '9x16' : '16x9');
    };
    decide();
    let t = null;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(decide, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, [preferOrientation, aspectThreshold]);

  // Build chosen sources & poster
  const chosen = useMemo(() => {
    if (orientation === '9x16') {
      return {
        dash: dashSrc9x16 || null,
        mp4: mp4Src9x16 || mp4Src16x9 || null, // fall back to any mp4 if needed
        poster: poster9x16 || poster16x9 || undefined,
      };
    }
    return {
      dash: dashSrc16x9 || null,
      mp4: mp4Src16x9 || mp4Src9x16 || null,
      poster: poster16x9 || poster9x16 || undefined,
    };
  }, [
    orientation,
    dashSrc16x9,
    dashSrc9x16,
    mp4Src16x9,
    mp4Src9x16,
    poster16x9,
    poster9x16,
  ]);

  // Load source (Shaka -> DASH; else MP4)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS WebView poster-only mode
    if (renderPosterInIOSWebView && isWebView) {
      if (onReady) onReady({ player: null, video, orientation });
      return () => {};
    }

    let destroyed = false;

    async function setup() {
      try {
        if (useShaka && chosen.dash) {
          const shaka = await loadShakaScript();
          if (!destroyed && shaka?.Player?.isBrowserSupported()) {
            const player = new shaka.Player(video);
            playerRef.current = player;
            if (shakaConfig) player.configure(shakaConfig);
            await player.load(chosen.dash);
            if (onReady) onReady({ player, video, orientation });
            return;
          }
        }
        // Fallback to MP4
        if (!destroyed && chosen.mp4) {
          playerRef.current = null; // not using shaka
          video.src = chosen.mp4;
          if (onReady) onReady({ player: null, video, orientation });
        }
      } catch (err) {
        playerRef.current = null;
        // final fallback to mp4 if available
        if (chosen.mp4) {
          video.src = chosen.mp4;
        }
        if (onError) onError(err);
      }
    }

    setup();

    return () => {
      destroyed = true;
      // Tear down Shaka
      try {
        if (playerRef.current && playerRef.current.destroy) {
          playerRef.current.destroy();
        }
      } catch (_) {}
      playerRef.current = null;
      // Unset the video src to release memory on route changes
      if (video) {
        try {
          video.pause();
          video.removeAttribute('src');
          video.load();
        } catch (_) {}
      }
    };
  }, [
    chosen,
    useShaka,
    shakaConfig,
    onReady,
    onError,
    isWebView,
    renderPosterInIOSWebView,
    orientation,
  ]);

  // Visibility-based autoplay/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playWhenInView || (renderPosterInIOSWebView && isWebView))
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: intersectionThreshold },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [
    playWhenInView,
    intersectionThreshold,
    isWebView,
    renderPosterInIOSWebView,
  ]);

  // Expose basic controls via ref
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (seconds) => {
      if (videoRef.current) videoRef.current.currentTime = seconds || 0;
    },
    getVideo: () => videoRef.current,
    getPlayer: () => playerRef.current,
  }));

  // Simple orientation classes (use CSS aspect-ratio; no external styling lib required)
  const ratioClass =
    orientation === '9x16' ? 'svp-ratio-9x16' : 'svp-ratio-16x9';

  // Minimal CSS (scoped via class names). Tailor to your codebase or swap for styled-components.
  const baseStyles = `
  .svp-wrapper { position: relative; width: 100%; display: block; }
  .svp-wrapper .svp-video, .svp-wrapper .svp-poster { width: 100%; height: 100%; object-fit: cover; display: block; }
  .svp-wrapper .svp-poster--empty { background: #000; width: 100%; height: 100%; }
  /* Use CSS aspect-ratio to maintain the frame; falls back gracefully on very old browsers */
  .svp-wrapper.svp-ratio-16x9 { aspect-ratio: 16 / 9; }
  .svp-wrapper.svp-ratio-9x16 { aspect-ratio: 9 / 16; }
  `;

  if (renderPosterInIOSWebView && isWebView) {
    return (
      <div
        className={`svp-wrapper ${ratioClass} ${className || ''}`}
        style={style}
      >
        {chosen.poster ? (
          <img className="svp-poster" src={chosen.poster} alt="Video poster" />
        ) : (
          <div className="svp-poster svp-poster--empty" />
        )}
        <style>{baseStyles}</style>
      </div>
    );
  }

  return (
    <div
      className={`svp-wrapper ${ratioClass} ${className || ''}`}
      style={style}
    >
      <video
        ref={videoRef}
        className="svp-video"
        muted={muted}
        playsInline={playsInline}
        loop={loop}
        preload={preload}
        controls={controls}
        poster={chosen.poster}
      />
      <style>{baseStyles}</style>
    </div>
  );
});

export default SmartVideoPlayer;
