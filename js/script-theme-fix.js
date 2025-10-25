// Theme button + copy-email enhancement merged into one file.
// Loaded with `defer` from index.html so DOM is available.
document.addEventListener('DOMContentLoaded', () => {
  //
  // THEME TOGGLE LOGIC (external icon <img> show/hide)
  //
  const themeBtn = document.getElementById('toggleTheme');
  const sunIcon = themeBtn ? themeBtn.querySelector('.icon-sun') : null;
  const moonIcon = themeBtn ? themeBtn.querySelector('.icon-moon') : null;

  function showOnly(iconToShow) {
    if (sunIcon) {
      if (iconToShow === 'sun') { sunIcon.classList.remove('hidden'); sunIcon.style.display = ''; sunIcon.setAttribute('aria-hidden','false'); }
      else { sunIcon.classList.add('hidden'); sunIcon.style.display = 'none'; sunIcon.setAttribute('aria-hidden','true'); }
    }
    if (moonIcon) {
      if (iconToShow === 'moon') { moonIcon.classList.remove('hidden'); moonIcon.style.display = ''; moonIcon.setAttribute('aria-hidden','false'); }
      else { moonIcon.classList.add('hidden'); moonIcon.style.display = 'none'; moonIcon.setAttribute('aria-hidden','true'); }
    }
  }

  function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', isDark ? 'Dark mode (click to switch to light)' : 'Light mode (click to switch to dark)');
    }
    // Per request: when dark theme is active we show the sun; when light theme active we show moon
    showOnly(isDark ? 'sun' : 'moon');
    localStorage.setItem('aihero-dark', isDark ? '1' : '0');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nowDark = !document.body.classList.contains('dark');
      applyTheme(nowDark);
    });
  }

  // initial state
  const saved = localStorage.getItem('aihero-dark');
  applyTheme(saved === '1');

  //
  // COPY-EMAIL BUTTON ENHANCEMENT
  //
  // Clipboard helper and UI feedback: copies the email, shows success state (green + check icon), restores text.
  const CHECK_SVG = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  document.querySelectorAll('.copy-email').forEach(btn => {
    if (btn.dataset.copyHandlerAttached === '1') return; // avoid duplicate handlers
    btn.dataset.copyHandlerAttached = '1';

    const textEl = btn.querySelector('.ce-text');
    const iconEl = btn.querySelector('.ce-icon');
    const originalText = textEl ? textEl.textContent : (btn.textContent || 'Copy');
    const originalIconHtml = iconEl ? iconEl.innerHTML : '';

    async function doCopy(email) {
      if (!email) return Promise.reject(new Error('No email provided'));
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(email);
      }
      // fallback using input selection
      const input = document.createElement('input');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      input.value = email;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(input);
        return Promise.resolve();
      } catch (err) {
        document.body.removeChild(input);
        return Promise.reject(err);
      }
    }

    function showSuccess() {
      btn.classList.add('success');
      btn.setAttribute('aria-live', 'polite');
      if (textEl) textEl.textContent = 'Copied';
      if (iconEl) iconEl.innerHTML = CHECK_SVG;
      clearTimeout(btn._copyTimeout);
      btn._copyTimeout = setTimeout(() => {
        btn.classList.remove('success');
        if (textEl) textEl.textContent = originalText;
        if (iconEl) iconEl.innerHTML = originalIconHtml;
      }, 1600);
    }

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.dataset.email || btn.getAttribute('data-email') || '';
      if (!email) return;
      try {
        await doCopy(email);
        showSuccess();
      } catch (err) {
        // visual shake on failure and fallback to prompt
        try {
          btn.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' }
          ], { duration: 300, easing: 'ease' });
        } catch (e) {}
        try { window.prompt('Copy this email address', email); } catch (_) {}
      }
    });
  });

});