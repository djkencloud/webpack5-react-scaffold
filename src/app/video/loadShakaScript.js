/**
 * loadShakaScript()
 * ------------------------------------------------------------
 * Dynamically loads the Shaka Player library only once, and returns
 * a Promise that resolves with the global `window.shaka` object.
 *
 * Why:
 * - Prevents multiple downloads of the same script.
 * - Ensures that even if multiple components call this at once,
 *   only one script is added and all calls resolve once it's ready.
 * - Provides graceful error handling if the load fails.
 *
 * Original source:
 * https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.12.3/shaka-player.compiled.min.js
 */
const loadShakaScript = () => {
  return new Promise((resolve, reject) => {
    // ✅ If the script has already been loaded, return immediately.
    if (window.shaka) {
      resolve(window.shaka);
      return;
    }

    // ✅ Check if a script element for Shaka is already being added.
    const existingScript = document.querySelector(
      'script[src="https://d11zrgpbhs014a.cloudfront.net/assets/data/shaka-player.compiled.min.js"]',
    );

    if (existingScript) {
      // If another component already started loading it, hook into its events.
      existingScript.addEventListener('load', () => resolve(window.shaka));
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Shaka Player script')),
      );
      return;
    }

    // ✅ Otherwise, create and append a new script element.
    const script = document.createElement('script');
    script.src =
      'https://d11zrgpbhs014a.cloudfront.net/assets/data/shaka-player.compiled.min.js';
    script.async = true;

    // When loaded, resolve with the global shaka object.
    script.onload = () => resolve(window.shaka);

    // If something goes wrong (e.g., network failure), reject the promise.
    script.onerror = () =>
      reject(new Error('Failed to load Shaka Player script'));

    // Append to DOM to begin loading.
    document.body.appendChild(script);
  });
};

export default loadShakaScript;
