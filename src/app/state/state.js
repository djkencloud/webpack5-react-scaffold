import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

export const history = createHashHistory();

function configureStore(initState = {}) {
  const store = createStore(
    reducers(history), // root reducer with router state
    initState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
      ),
      applyMiddleware(thunk),
    ),
  );

  return store;
}

export default configureStore({});
