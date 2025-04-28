/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { PageWrapStyles } from './pagewrapstyles';
import slices from '../../state/slices/browserUtils';

import Header from '../header';
import Content from '../content';
import Footer from '../footer';

export default function PageWrap() {
  const dispatch = useDispatch();
  const pageWrapRef = useRef();
  const { onResize, onScroll, onDarkMode, onOrientationChange } =
    slices.actions;

  // useEffect to handle the resize, scroll, orientation change and dark mode
  // events
  useEffect(() => {
    const handleResize = () => {
      dispatch(onResize());
    };

    const handleOrientationChange = () => {
      dispatch(onOrientationChange());
    };

    const handleColourSchemeChange = () => {
      dispatch(onDarkMode());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleColourSchemeChange);
  }, []);

  return (
    <PageWrapStyles ref={pageWrapRef}>
      <Header />
      <Content />
      <Footer />
    </PageWrapStyles>
  );
}
