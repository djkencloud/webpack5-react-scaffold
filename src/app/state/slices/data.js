/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../utils/ajax';

function getData(height) {
  return new Promise((resolve) => {
    get(`data/data.json`).then((e) => {
      resolve(JSON.parse(e));
    });
  });
}

// Create Thunk
export const fetchData = createAsyncThunk('fetchData', async (thunkAPI) => {
  const d = await getData();
  return d;
});

// Slice
const data = createSlice({
  name: 'data',
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
  },
});

export default data;
