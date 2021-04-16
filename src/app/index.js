import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { Route } from 'react-router';
// import { ConnectedRouter } from 'connected-react-router';
// import { history } from './state/history';

import GlobalStyles from './global-style';
import configureStore from './state';
import { fetchData } from './state/actions/createData';
import { domListeners } from './state/actions/createBrowserUtils';

import Header from './views/header';
import Footer from './views/footer';
import Content from './views/content';

const store = configureStore();

const element = (
  <Provider store={store}>
    <GlobalStyles />
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  </Provider>
);

ReactDOM.render(element, document.getElementById('foot'));

/* Start up functions */
store.dispatch(domListeners());
store.dispatch(fetchData());

/*

Alt set up using routes



const element = (
  <Provider store={ store }>
    <div>
      <GlobalStyles />
      <ConnectedRouter history={ history }>
        <Route exact path="/" component={ Content } />
      </ConnectedRouter>
    </div>
  </Provider>
)

*/
