console.log('Code wrapper loaded');

// eslint-disable-next-line func-names
(function () {
  let initialized = false;

  function initCreativeScript() {
    if (initialized) return;
    const divRef = document.querySelector('#foot');
    if (!divRef || divRef.classList.contains('loaded')) return;

    console.log('Running main code');

    divRef.classList.add('loaded');

    // Your main code here...

    initialized = true;
  }

  // Try immediate init
  initCreativeScript();

  // Fallback: repeat check every 200ms up to 10s
  let count = 0;
  const interval = setInterval(() => {
    initCreativeScript();
    count += 1;
    if (count > 50) {
      clearInterval(interval);
      console.log('Interval stopped');
    }
  }, 200);

  // MutationObserver for SPAs
  const observer = new MutationObserver(() => {
    initCreativeScript();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
