import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import GlobalStyles from './global-style';

import { fetchData } from './state/slices/data';
import slices from './state/slices/browserUtils';

import Header from './views/header';
import Content from './views/content';
import Footer from './views/footer';

import store from './state/store';

const container = document.getElementById('foot');
const root = createRoot(container);

const element = (
  <Provider store={store}>
    <GlobalStyles />
    <div className="page-wrap">
      <Header />
      <Content />
      <Footer />
    </div>
  </Provider>
);

root.render(element);

/* Start up - listen for changes */
const { onResize, onDarkMode, onOrientationChange } = slices.actions;

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', () => store.dispatch(onDarkMode()));

window.addEventListener('resize', () => {
  store.dispatch(onResize());
  store.dispatch(onOrientationChange());
});

window.addEventListener('orientationchange', () => {
  store.dispatch(onResize());
  store.dispatch(onOrientationChange());
});

/* Initial data fetch */
store.dispatch(fetchData());
