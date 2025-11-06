/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import hexToRgba from 'hex-to-rgba';

/**
 * ImgWrap Component
 * ------------------------------------------------------------
 * A responsive <picture> wrapper that displays an image with an optional
 * credit/source overlay when hovered or clicked.
 *
 * Features:
 *  - Uses <picture> to support separate mobile/desktop image sources.
 *  - Dynamically sets overlay height to match the rendered image height.
 *  - Randomly chooses one of two brand colour overlays.
 *  - Displays overlay on hover/click for 4 seconds.
 *  - Reacts to window resize via Redux width listener to keep height synced.
 *
 * Props:
 *  - className: optional custom class string.
 *  - src: fallback/default image.
 *  - srcSetMobile: mobile image source for small screens.
 *  - srcSetDesktop: desktop image source for larger screens.
 *  - alt: image alt text.
 *  - align: vertical alignment (flex alignment on overlay).
 *  - justify: horizontal alignment (flex alignment on overlay).
 *  - credit: credit text shown on overlay.
 *  - loading: 'lazy' | 'eager' (passed to <img>).
 *  - source: photo source text.
 *
 * Example Usage:
 * ------------------------------------------------------------
 * <ImgWrap
 *   className="feature-img"
 *   src="/fallback.jpg"
 *   srcSetMobile="/mobile.jpg"
 *   srcSetDesktop="/desktop.jpg"
 *   alt="Example Image"
 *   credit="Photo: John Doe"
 *   source="Getty Images"
 * />
 */
export default function ImgWrap({ ...props }) {
  const {
    className,
    src,
    srcSetMobile,
    srcSetDesktop,
    alt,
    align = 'center',
    justify = 'center',
    credit = 'Not listed',
    loading = 'lazy',
    source = 'unknown',
  } = props;

  // Local state
  const [isVisible, setIsVisible] = useState(false); // whether overlay is visible
  const [overlayHeight, setOverlayHeight] = useState(); // overlay height synced to image height

  // Refs
  const imgRef = useRef(); // ref to <img> element for height measurement

  // Grab page width from Redux to trigger recalculation on resize
  const pageWdith = useSelector((state) => state.browserUtils.width);

  // Randomly select one of two overlay background colours each render
  const dataColour = Math.random() > 0.5 ? '#329cb3' : '#1a5c81';

  /**
   * showHoverData()
   * ------------------------------------------------------------
   * Called when the user hovers or clicks on the image.
   * - Displays overlay for 4 seconds.
   * - Syncs overlay height to image height during that time.
   */
  function showHoverData(e) {
    if (!isVisible) {
      setIsVisible(true);
      setTimeout(() => {
        if (imgRef.current) {
          setOverlayHeight(imgRef.current.clientHeight);
        }
        setIsVisible(false);
      }, 4000); // hide overlay after 4 seconds
    }
  }

  /**
   * onLoadData()
   * ------------------------------------------------------------
   * Syncs overlay height to image height when the image finishes loading.
   */
  function onLoadData() {
    if (imgRef.current) {
      setOverlayHeight(imgRef.current.clientHeight);
    }
  }

  /**
   * useEffect: handle window resize via Redux pageWidth
   * ------------------------------------------------------------
   * When the global width state changes (Redux browserUtils.width),
   * recalculate overlay height so it matches the resized image.
   */
  useEffect(() => {
    if (imgRef.current) {
      setOverlayHeight(imgRef.current.clientHeight);
    }
  }, [pageWdith]);

  // Base styles for <img>
  const style = {
    width: '100%',
    height: 'auto',
  };

  // Dynamic overlay style — uses rgba background + flex centering
  const backgroundColor = {
    backgroundColor: hexToRgba(dataColour, 0.9),
    alignItems: align,
    justifyContent: justify,
    height: `${overlayHeight}px`,
  };

  return (
    <div className={`imgwrap ${className}`} style={{ position: 'relative' }}>
      {/* Responsive image loading via <picture> */}
      <picture>
        <source media="(max-width: 700px)" srcSet={srcSetMobile} />
        <source media="(min-width: 701px)" srcSet={srcSetDesktop} />
        <img
          src={src}
          alt={alt}
          style={style}
          ref={imgRef}
          loading={loading}
          // Hover and click both trigger overlay reveal
          onClick={showHoverData}
          onMouseEnter={showHoverData}
          // Measure height once image loads
          onLoad={onLoadData}
        />
      </picture>

      {/* Overlay containing credit/source */}
      <div
        className={`image-overlay ${isVisible ? 'visible' : ''}`}
        style={backgroundColor}
      >
        <p>{credit}</p>
        <p>{source}</p>
      </div>
    </div>
  );
}
