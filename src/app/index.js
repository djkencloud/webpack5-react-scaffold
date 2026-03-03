import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import GlobalStyles from './global-style';

import { fetchData } from './state/slices/data';

import PageWrap from './views/pagewrap';
import store from './state/store';
import { setUpBrowserListeners } from './state/slices/browserUtils';

const container = document.getElementById('foot');
const root = createRoot(container);

const element = (
  <Provider store={store}>
    <GlobalStyles />
    <PageWrap />
  </Provider>
);

root.render(element);

/* Initial data fetch */
setUpBrowserListeners(store.dispatch);
store.dispatch(fetchData());
