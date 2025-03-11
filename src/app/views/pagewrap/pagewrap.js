/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { PageWrapStyles } from './pagewrapstyles';
import slices from '../../state/slices/browserUtilsIframe';

import Header from '../header';
import Content from '../content';
import Footer from '../footer';

// Threshold list for the intersection observer, change the numSteps
// depending on the levels of visibility you want to track
function buildThresholdList() {
  const thresholds = [];
  const numSteps = 10; // num steps
  for (let i = 1.0; i <= numSteps; i += 1) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }
  thresholds.push(0);
  return thresholds;
}

export default function PageWrap() {
  const dispatch = useDispatch();
  const pageWrapRef = useRef();
  const {
    onResize,
    onScroll,
    onDarkMode,
    onOrientationChange,
    setIntersection,
    setParentUpdate,
  } = slices.actions;

  // useEffect to handle the resize, scroll, orientation change and dark mode
  // events
  useEffect(() => {
    const handleResize = () => {
      dispatch(onResize());
    };

    const handleScroll = () => {
      dispatch(onScroll());
    };

    const handleOrientationChange = () => {
      dispatch(onOrientationChange());
    };

    const handleColourSchemeChange = () => {
      dispatch(onDarkMode());
    };

    // Handle messages from the iframe, check it's waht we want...
    function handleIframeUpdate(event) {
      // console.log('Received message:', event);
      // Optionally, check event.origin for security
      if (event && event.data && typeof event.data === 'string') {
        const message = event.data;
        if (message.includes('iframeUpdate')) {
          const jsonStart = message.indexOf('{');
          if (jsonStart !== -1) {
            // Extract the JSON substring
            const jsonString = message.substring(jsonStart);
            try {
              const parsedData = JSON.parse(jsonString);
              dispatch(setParentUpdate(parsedData));
              // console.log(parsedData);
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          } else {
            console.error('JSON curly bracket not found in the string');
          }
        }
      }
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('message', handleIframeUpdate);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleColourSchemeChange);
  }, []);

  // intersection observer code
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Dispatch the intersection status (true if at least 10% visible)
        // console.log(entry, entry.boundingClientRect);
        dispatch(
          setIntersection({
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: {
              x: entry.boundingClientRect.x,
              y: entry.boundingClientRect.y,
              width: entry.boundingClientRect.width,
              height: entry.boundingClientRect.height,
            },
          }),
        );
      },
      { threshold: buildThresholdList() },
    );

    observer.observe(pageWrapRef.current);
  }, []);

  return (
    <PageWrapStyles ref={pageWrapRef}>
      <Header />
      <Content />
      <Footer />
    </PageWrapStyles>
  );
}
