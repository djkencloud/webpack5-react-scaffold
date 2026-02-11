import { configureStore } from '@reduxjs/toolkit';

import browserUtils from './slices/browserUtils';
import data from './slices/data';

const store = configureStore({
  reducer: {
    browserUtils: browserUtils.reducer,
    data: data.reducer,
  },
});

console.log('browserUtils import:', browserUtils);
console.log('browserUtils.reducer:', browserUtils?.reducer);

console.log('data import:', data);
console.log('data.reducer:', data?.reducer);

export default store;
