export function get(url) {
  return new Promise((resolve, reject) => {
    /* eslint-disable */
    const ajax = new XMLHttpRequest();
    /* eslint-enable */
    ajax.open('GET', url);
    ajax.onload = () => {
      if (ajax.status === 200) {
        resolve(ajax.response);
      } else {
        reject(ajax);
      }
    };
    ajax.send();
  });
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    /* eslint-disable */
    const request = new XMLHttpRequest();
    /* eslint-enable */
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    /* eslint-disable */
    request.onload = function () {
      /* eslint-enable */
      if (request.status >= 200 && request.status < 400) {
        resolve(request.responseText);
      } else {
        reject(request);
      }
    };
    /* eslint-disable */
    request.onerror = function (err) {
      /* eslint-enable */
      reject(request, err.responseText);
    };
    request.send(JSON.stringify(data));
  });
}
