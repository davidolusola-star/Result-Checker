// Preloader Handler
(function() {
  const preloader = document.querySelector('.preloader');
  
  // Minimum display time (prevents flash on fast connections)
  const MIN_DISPLAY_TIME = 1000; // 1 second
  const startTime = Date.now();

  function hidePreloader() {
    if (!preloader) return;

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      // Add fade out animation
      preloader.style.transition = 'opacity 0.5s ease-out, visibility 0.5s';
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.remove();
        }
      }, 500);
    }, remaining);
  }

  // Hide preloader when page is fully loaded
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  // Fallback: force hide after 5 seconds
  setTimeout(() => {
    if (preloader && preloader.parentNode) {
      hidePreloader();
    }
  }, 5000);
})();

// greeting prompt
   function showGreeting() {
    let currenthour = new Date().getHours();
    let greeting;

    if (currenthour >= 0 && currenthour < 12) {
        greeting = 'Good Morning';
    } else if (currenthour >= 12 && currenthour < 16) {
        greeting = 'Good Afternoon';
    } else if (currenthour >= 16 && currenthour < 23) {
        greeting = 'Good Evening';
    } else {
        greeting = 'Good Night';
    }

    let name = prompt('Enter your name:');
    if (!name) name = 'Guest';

    const greetDiv = document.getElementById('greeting');
    greetDiv.innerText = `${greeting}, ${name}!`;

    // Step 1: Fade in greeting
    greetDiv.classList.add('show');

    // Step 2: Keep greeting visible for 10 seconds, then fade out
    setTimeout(() => {
        greetDiv.classList.remove('show');
        greetDiv.classList.add('hide');
    }, 10000);

    // Step 3: Optional – clear greeting after fade-out
    setTimeout(() => {
        greetDiv.innerText = '';
    }, 12000);
}

showGreeting();
// greeting end
