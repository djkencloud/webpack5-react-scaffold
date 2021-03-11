export function getScroll() {
  return window.pageYOffset;
}

export function getWidth() {
  return window.innerWidth;
}

export function getHeight() {
  return window.innerHeight;
}

export function isRetina() {
  const mediaQuery =
    '(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)';
  if (window.devicePixelRatio > 1) {
    return true;
  }
  return window.matchMedia && window.matchMedia(mediaQuery).matches;
}

// function arguments match first 5 variable assignments
/* eslint-disable */
export function formatMoney(n, p, s, t, d) {
  let number = n || 0;
  const places = !isNaN((p = Math.abs(p))) ? p : 0;
  const symbol = s !== undefined ? s : '$';
  const thousand = t || ',';
  const decimal = d || '.';
  const negative = number < 0 ? '-' : '';
  const i =
    parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + '';
  let j = (j = i.length) > 3 ? j % 3 : 0;

  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : '')
  );
}
/* eslint-enable */

export function getQueryStrings(qs) {
  // remove any preceding url and split
  const querystring = qs.substring(qs.indexOf('?') + 1).split('&');
  const params = {};
  let pair;
  const d = decodeURIComponent;

  // march and parse
  for (let i = querystring.length - 1; i >= 0; i -= 1) {
    pair = querystring[i].split('=');
    params[d(pair[0])] = d(pair[1]);
  }

  return params;
}

export function getTimeFromSeconds(seconds) {
  let hh = 0;
  let mm = 0;
  let ss = 0;
  let t = '';

  if (seconds > 0) {
    // Multiply by 1000 because Date() requires miliseconds
    const date = new Date(seconds * 1000);
    hh = date.getUTCHours();
    mm = date.getUTCMinutes();
    ss = date.getSeconds();
  }

  // Make sure there are two-digits
  /* eslint-disable */
  if (hh != 0) {
    if (hh < 10) {
      t += '0' + hh + ':';
    } else {
      t += hh + ':';
    }
  }
  if (mm < 10) {
    t += '0' + mm + ':';
  } else {
    t += mm + ':';
  }
  if (ss < 10) {
    t += '0' + ss;
  } else {
    t += ss;
  }

  return t;
  /* eslint-enable */
}

// returns a random number
export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// creates an array of random numbers that add up to 100
// useful for testing percentage values that
export function createRandomNumbers(num) {
  const arr = [];
  const result = [];
  for (let i = 0; i < num - 1; i += 1) {
    arr.push(randomIntFromInterval(1, 99));
  }
  arr.push(0, 100);
  arr.sort((a, b) => {
    return a - b;
  });
  for (let i = 0; i < num; i += 1) {
    result.push(arr[i + 1] - arr[i]);
  }
  return result;
}

export function numberWithCommas(x) {
  // return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  return x.toLocaleString();
}

export function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// degrees to radians
export function radians(deg) {
  return (deg * Math.PI) / 180;
}

// radians to degrees
export function degrees(rad) {
  return (rad * 180) / Math.PI;
}

export function isIE() {
  const ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // IE 12 / Spartan
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge (IE 12+)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

// does browser use intersectoin observer - probably cna't rely on this yet
export function isIntersectionObserver() {
  return (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  );
}

// generate random boolean
export function getRandomBoolean() {
  return Math.random() >= 0.5;
}

// is provided date a weekday.
export function isWeekday(date) {
  return date.getDay() % 6 !== 0;
}
/* 
console.log(isWeekday(new Date(2021, 0, 11)));
// Result: true (Monday)
console.log(isWeekday(new Date(2021, 0, 10)));
// Result: false (Sunday)
*/

// Is Browser tab in view
export function isBrowserTabInView() {
  return document.hidden;
}

// Is number odd or even
export function isEven(num) {
  return num % 2 === 0;
}

// Get time from date
export function timeFromDate(date) {
  return date.toTimeString().slice(0, 8);
}

// Number to fixed decimal point
export function toFixed(n, fixed) {
  return ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed); // eslint-disable-line
}
/*
// Examples
toFixed(25.198726354, 1);       // 25.1
toFixed(25.198726354, 2);       // 25.19
toFixed(25.198726354, 3);       // 25.198
toFixed(25.198726354, 4);       // 25.1987
toFixed(25.198726354, 5);       // 25.19872
toFixed(25.198726354, 6);       // 25.198726
*/

// check if an element is in focus
export function elementIsInFocus(el) {
  return el === document.activeElement;
}

// check if the current user has touch events supported
export function touchSupported() {
  return (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
  );
}

// check if device is an apppple machine
export function isAppleDevice() {
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}
