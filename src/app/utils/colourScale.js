import { scaleThreshold } from 'd3-scale';

export function palette(min, max) {
  const d = (max - min) / 22;
  return scaleThreshold()
    .range([
      '#ffffe0',
      '#e2fae1',
      '#cff2e0',
      '#c0eade',
      '#b3e0db',
      '#a7d7d9',
      '#9dced6',
      '#93c4d2',
      '#89bacf',
      '#80b1cc',
      '#77a7c8',
      '#6f9ec5',
      '#6694c1',
      '#5e8bbd',
      '#5681b9',
      '#4e78b5',
      '#456fb1',
      '#3c66ad',
      '#325da9',
      '#2754a5',
      '#194ba1',
      '#00429d',
    ])
    .domain([
      min + d * 1,
      min + d * 2,
      min + d * 3,
      min + d * 4,
      min + d * 5,
      min + d * 6,
      min + d * 7,
      min + d * 8,
      min + d * 9,
      min + d * 10,
      min + d * 11,
      min + d * 12,
      min + d * 13,
      min + d * 14,
      min + d * 15,
      min + d * 16,
      min + d * 17,
      min + d * 18,
      min + d * 19,
      min + d * 20,
      min + d * 21,
    ]);
}
