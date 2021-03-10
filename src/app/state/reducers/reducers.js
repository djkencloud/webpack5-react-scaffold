import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import resize from './resize';
import data from './data';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    resize,
    data,
  });

export default createRootReducer;
