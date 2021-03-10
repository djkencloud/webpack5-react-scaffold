import { line, curveMonotoneX, area } from 'd3-shape';
import { scaleTime, scaleLinear, scaleBand, scaleSqrt } from 'd3-scale';
import { axisBottom, axisLeft, axisRight } from 'd3-axis';
import { timeParse, timeFormat } from 'd3-time-format';
import { timeDays } from 'd3-time';
import { select } from 'd3-selection';
import { extent, max, min } from 'd3-array';
import { csvParse } from 'd3-dsv';

export default {
  line,
  area,
  curveMonotoneX,
  scaleTime,
  scaleLinear,
  scaleBand,
  scaleSqrt,
  axisBottom,
  axisLeft,
  axisRight,
  timeParse,
  timeFormat,
  timeDays,
  select,
  extent,
  min,
  max,
  csvParse,
};

// use
// import d3 from './d3Importer.js';
