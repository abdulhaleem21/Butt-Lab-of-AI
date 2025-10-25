// Basic interactivity: accordion, copy email, theme toggle (icon), contact form mailto behavior
document.addEventListener('DOMContentLoaded', () => {
  // Accordion toggles
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const panel = document.getElementById(targetId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // collapse others (optional: keep exclusive)
      document.querySelectorAll('.accordion-toggle').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const p = document.getElementById(b.dataset.target);
        if (p) p.classList.add('hidden');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.remove('hidden');
      } else {
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.add('hidden');
      }
    });
  });

  // Copy email buttons
  document.querySelectorAll('.copy-email').forEach(b => {
    b.addEventListener('click', async (e) => {
      const email = b.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        const prev = b.textContent;
        b.textContent = 'Copied!';
        setTimeout(()=> b.textContent = prev, 1800);
      } catch (err) {
        // fallback
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.value = email;
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        const prev = b.textContent;
        b.textContent = 'Copied!';
        setTimeout(()=> b.textContent = prev, 1800);
      }
    });
  });

  // Theme toggle (icon)
  const themeBtn = document.getElementById('toggleTheme');
  const sunIcon = themeBtn ? themeBtn.querySelector('.icon-sun') : null;
  const moonIcon = themeBtn ? themeBtn.querySelector('.icon-moon') : null;

  function applyTheme(isDark){
    document.body.classList.toggle('dark', isDark);
    // set aria-pressed to reflect dark-mode state
    if (themeBtn) themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    // show/hide icons
    if (sunIcon) sunIcon.classList.toggle('hidden', isDark);
    if (moonIcon) moonIcon.classList.toggle('hidden', !isDark);
    localStorage.setItem('aihero-dark', isDark ? '1' : '0');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nowDark = !document.body.classList.contains('dark');
      applyTheme(nowDark);
    });
  }

  // load preferred
  applyTheme(localStorage.getItem('aihero-dark') === '1');

  // Contact form: open mail client (client-only)
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const to = 'abdul.haleem@au.edu.pk';
      let subject = 'Contact from AI-HERO Lab website';
      if (name) subject = `Message from ${name} — AI-HERO Lab site`;
      const body = [
        message || '',
        '',
        `Sender: ${name || '—'}`,
        `Sender email: ${email || '—'}`
      ].join('\n');
      // open mail client
      window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

});