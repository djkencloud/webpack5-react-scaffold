import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import browserUtils from './slices/browserUtils';
import data from './slices/data';

const reducer = combineReducers({
  browserUtils: browserUtils.reducer,
  data: data.reducer,
});

const store = configureStore({
  reducer,
});

export default store;
