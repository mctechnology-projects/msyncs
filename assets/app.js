/* ===== helpers ===== */
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

/* ===== mobile nav ===== */
const mobileToggle = $('#mobileToggle');
const mobileMenu = $('#mobileMenu');
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        const open = mobileMenu.hasAttribute('hidden') ? false : true;
        if (open) {
            mobileMenu.setAttribute('hidden', '');
            mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
            mobileMenu.removeAttribute('hidden');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
    });
    // close menu on link click
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
        mobileMenu.setAttribute('hidden', '');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }));
}

/* ===== theme toggle ===== */
const themeToggle = $('#themeToggle');
const userPref = localStorage.getItem('msyncs-theme');
if (userPref === 'dark') document.body.classList.add('theme-dark');
if (userPref === 'light') document.body.classList.remove('theme-dark');

themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    const isDark = document.body.classList.contains('theme-dark');
    localStorage.setItem('msyncs-theme', isDark ? 'dark' : 'light');
});

/* ===== footer year ===== */
$('#year').textContent = new Date().getFullYear();

/* ===== intersection-based reveal ===== */
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

$$('.reveal').forEach(el => io.observe(el));

/* ===== contact form (simple validation + mailto fallback) ===== */
const form = $('#contactForm');
const hint = $('#formHint');

function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    if (!name || !email || !message) {
        hint.textContent = 'Bitte alle Felder ausfüllen.';
        return;
    }
    if (!validateEmail(email)) {
        hint.textContent = 'Bitte eine gültige E-Mail angeben.';
        return;
    }

    hint.textContent = 'Öffne E-Mail-Client…';
    const subject = encodeURIComponent('Kontakt über msyncs.de');
    const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`);
    window.location.href = `mailto:hi@msyncs.de?subject=${subject}&body=${body}`;

    // Optional: Formular nach einer Sekunde zurücksetzen
    setTimeout(() => { form.reset(); hint.textContent = 'Danke!'; }, 800);
});

/* ===== active nav highlight on scroll ===== */
const sections = ['about','focus','projects','stack','contact'].map(id => ({ id, el: document.getElementById(id) }));
const navLinks = $$('.nav-links a[href^="#"]');
const mobileLinks = $$('#mobileMenu a[href^="#"]');

window.addEventListener('scroll', () => {
    const pos = window.scrollY + 120;
    let activeId = null;
    sections.forEach(s => {
        if (!s.el) return;
        if (pos >= s.el.offsetTop && pos < s.el.offsetTop + s.el.offsetHeight) activeId = s.id;
    });
        [...navLinks, ...mobileLinks].forEach(a => {
            const match = a.getAttribute('href').slice(1) === activeId;
            a.style.opacity = match ? '1' : '';
            a.style.textDecoration = match ? 'underline' : 'none';
        });
}, { passive: true });
