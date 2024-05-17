/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../utils/ajax";

const countrySelectOptionList = [
  {
    label: "All Eurovision entrants",
    flag: "",
    value: "All",
  },
  {
    label: "Albania",
    flag: "al.svg",
    value: "Albania",
  },
  {
    label: "Andorra",
    flag: "ad.svg",
    value: "Andorra",
  },
  {
    label: "Armenia",
    flag: "am.svg",
    value: "Armenia",
  },
  {
    label: "Australia",
    flag: "au.svg",
    value: "Australia",
  },
  {
    label: "Austria",
    flag: "at.svg",
    value: "Austria",
  },
  {
    label: "Azerbaijan",
    flag: "az.svg",
    value: "Azerbaijan",
  },
  {
    label: "Belarus",
    flag: "by.svg",
    value: "Belarus",
  },
  {
    label: "Belgium",
    flag: "be.svg",
    value: "Belgium",
  },
  {
    label: "Bosnia & Herzegovina",
    flag: "ba.svg",
    value: "Bosnia & Herzegovina",
  },
  {
    label: "Bulgaria",
    flag: "bg.svg",
    value: "Bulgaria",
  },
  {
    label: "Croatia",
    flag: "hr.svg",
    value: "Croatia",
  },
  {
    label: "Cyprus",
    flag: "cy.svg",
    value: "Cyprus",
  },
  {
    label: "Czech Republic",
    flag: "cz.svg",
    value: "Czech Republic",
  },
  {
    label: "Czechia",
    flag: "cz.svg",
    value: "Czechia",
  },
  {
    label: "Denmark",
    flag: "dk.svg",
    value: "Denmark",
  },
  {
    label: "Estonia",
    flag: "ee.svg",
    value: "Estonia",
  },
  {
    label: "Finland",
    flag: "fi.svg",
    value: "Finland",
  },
  {
    label: "France",
    flag: "fr.svg",
    value: "France",
  },
  {
    label: "Georgia",
    flag: "ge.svg",
    value: "Georgia",
  },
  {
    label: "Germany",
    flag: "de.svg",
    value: "Germany",
  },
  {
    label: "Greece",
    flag: "gr.svg",
    value: "Greece",
  },
  {
    label: "Hungary",
    flag: "hu.svg",
    value: "Hungary",
  },
  {
    label: "Iceland",
    flag: "is.svg",
    value: "Iceland",
  },
  {
    label: "Ireland",
    flag: "ie.svg",
    value: "Ireland",
  },
  {
    label: "Israel",
    flag: "il.svg",
    value: "Israel",
  },
  {
    label: "Italy",
    flag: "it.svg",
    value: "Italy",
  },
  {
    label: "Latvia",
    flag: "lv.svg",
    value: "Latvia",
  },
  {
    label: "Lithuania",
    flag: "lt.svg",
    value: "Lithuania",
  },
  {
    label: "Luxembourg",
    flag: "lu.svg",
    value: "Luxembourg",
  },
  {
    label: "Malta",
    flag: "mt.svg",
    value: "Malta",
  },
  {
    label: "Moldova",
    flag: "md.svg",
    value: "Moldova",
  },
  {
    label: "Monaco",
    flag: "mc.svg",
    value: "Monaco",
  },
  {
    label: "Montenegro",
    flag: "me.svg",
    value: "Montenegro",
  },
  {
    label: "Morocco",
    flag: "ma.svg",
    value: "Morocco",
  },
  {
    label: "Netherlands",
    flag: "nl.svg",
    value: "Netherlands",
  },
  {
    label: "North Macedonia",
    flag: "mk.svg",
    value: "North Macedonia",
  },
  {
    label: "Norway",
    flag: "no.svg",
    value: "Norway",
  },
  {
    label: "Poland",
    flag: "pl.svg",
    value: "Poland",
  },
  {
    label: "Portugal",
    flag: "pt.svg",
    value: "Portugal",
  },
  {
    label: "Romania",
    flag: "ro.svg",
    value: "Romania",
  },
  {
    label: "Russia",
    flag: "ru.svg",
    value: "Russia",
  },
  {
    label: "San Marino",
    flag: "sm.svg",
    value: "San Marino",
  },
  {
    label: "Serbia",
    flag: "rs.svg",
    value: "Serbia",
  },
  {
    label: "Serbia & Montenegro",
    flag: "circle_serbia_montenegro.svg",
    value: "Serbia & Montenegro",
  },
  {
    label: "Slovakia",
    flag: "sk.svg",
    value: "Slovakia",
  },
  {
    label: "Slovenia",
    flag: "si.svg",
    value: "Slovenia",
  },
  {
    label: "Spain",
    flag: "es.svg",
    value: "Spain",
  },
  {
    label: "Sweden",
    flag: "se.svg",
    value: "Sweden",
  },
  {
    label: "Switzerland",
    flag: "ch.svg",
    value: "Switzerland",
  },
  {
    label: "Türkiye",
    flag: "tr.svg",
    value: "Turkey",
  },
  {
    label: "Ukraine",
    flag: "ua.svg",
    value: "Ukraine",
  },
  {
    label: "United Kingdom",
    flag: "gb.svg",
    value: "United Kingdom",
  },
  {
    label: "Yugoslavia",
    flag: "circle_yugoslavia.svg",
    value: "Yugoslavia",
  },
];

function getData(height) {
  return new Promise((resolve) => {
    get(`data/data.json`).then((e) => {
      resolve(JSON.parse(e));
    });
  });
}

// Create Thunk
export const fetchData = createAsyncThunk("fetchData", async (thunkAPI) => {
  const d = await getData();
  return d;
});

// Slice
const data = createSlice({
  name: "data",
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
