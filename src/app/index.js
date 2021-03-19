import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { createHashHistory }  from 'history';
// import { Route } from 'react-router';
// import { ConnectedRouter } from 'connected-react-router';

import GlobalStyles from './global-style';
import store from './state';
import { fetchData } from './state/actions/createData';
import { listenResize } from './state/actions/createResize';

import Header from './views/header';
import Footer from './views/footer';
import Content from './views/content';

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
store.dispatch(listenResize());
store.dispatch(fetchData());

/*

Alt set up using routes

const history = createHashHistory();

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
