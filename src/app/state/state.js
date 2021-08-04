import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';
import { history } from './history';

export default function configureStore(initState = {}) {
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
