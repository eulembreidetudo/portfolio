(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const entry = document.querySelector('#entry');
  const enterButton = document.querySelector('#enterButton');
  const audio = document.querySelector('#bgMusic');
  const audioToggle = document.querySelector('#audioToggle');
  const progressBar = document.querySelector('.scroll-progress span');
  const cursorLight = document.querySelector('.cursor-light');
  const skills = Array.from(document.querySelectorAll('.skill'));
  const activeSkill = document.querySelector('#activeSkill');
  const activeSkillText = document.querySelector('#activeSkillText');
  const activeSkillIcon = document.querySelector('#activeSkillIcon');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const copyDiscord = document.querySelector('#copyDiscord');
  const copyStatus = document.querySelector('#copyStatus');
  const year = document.querySelector('#year');
  const typingWord = document.querySelector('#typingWord');

  let started = false;
  let rafId = null;
  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  year.textContent = new Date().getFullYear();

  const skillIcons = {
    javascript: '<i class="devicon-javascript-plain"></i>',
    html: '<i class="devicon-html5-plain"></i>',
    css: '<i class="devicon-css3-plain"></i>',
    tailwind: '<i class="devicon-tailwindcss-original"></i>',
    node: '<i class="devicon-nodejs-plain"></i>',
    luau: '<span class="custom-skill-icon">Lu</span>',
    cplusplus: '<i class="devicon-cplusplus-plain"></i>',
    vite: '<i class="devicon-vitejs-plain"></i>',
    react: '<i class="devicon-react-original"></i>',
    python: '<i class="devicon-python-plain"></i>'
  };

  function setMusicState(isOn) {
    document.body.classList.toggle('music-on', isOn);
    audioToggle.setAttribute('aria-pressed', String(isOn));
    audioToggle.setAttribute('aria-label', isOn ? 'Pause music' : 'Play music');
  }

  async function startMusic() {
    audio.volume = 1;
    try {
      await audio.play();
      setMusicState(true);
    } catch (error) {
      setMusicState(false);
      console.warn('Music could not start. Make sure sounds/and-i-love-her.mp3 exists and the site is running on HTTPS or localhost.', error);
    }
  }

  function enterSite() {
    if (started) return;
    started = true;
    entry.classList.add('is-hidden');
    document.body.classList.add('has-entered');
    startMusic();
    window.setTimeout(() => entry.remove(), 1000);
  }

  enterButton.addEventListener('click', enterSite);

  audioToggle.addEventListener('click', async () => {
    if (audio.paused) {
      await startMusic();
    } else {
      audio.pause();
      setMusicState(false);
    }
  });

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max <= 0 ? 0 : (window.scrollY / max) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  if (!prefersReducedMotion) {
    window.addEventListener('pointermove', (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(() => {
          const x = `${(pointer.x / window.innerWidth) * 100}%`;
          const y = `${(pointer.y / window.innerHeight) * 100}%`;
          document.documentElement.style.setProperty('--mx', x);
          document.documentElement.style.setProperty('--my', y);
          if (cursorLight) {
            cursorLight.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
          }
          rafId = null;
        });
      }
    }, { passive: true });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entryItem) => {
      if (entryItem.isIntersecting) {
        entryItem.target.classList.add('is-visible');
        revealObserver.unobserve(entryItem.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  function chooseSkill(button) {
    skills.forEach((skill) => skill.classList.toggle('active', skill === button));
    activeSkill.textContent = button.dataset.title;
    activeSkillText.textContent = button.dataset.text;
    activeSkillIcon.innerHTML = skillIcons[button.dataset.icon] || '';
  }

  skills.forEach((button) => {
    button.addEventListener('mouseenter', () => chooseSkill(button));
    button.addEventListener('focus', () => chooseSkill(button));
    button.addEventListener('click', () => chooseSkill(button));
  });

  projectCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--px', `${x}%`);
      card.style.setProperty('--py', `${y}%`);
    }, { passive: true });
  });

  copyDiscord.addEventListener('click', async () => {
    const username = 'ufgg';
    try {
      await navigator.clipboard.writeText(username);
      copyStatus.textContent = 'Copied';
      copyDiscord.classList.add('copied');
      window.setTimeout(() => {
        copyStatus.textContent = 'Copy';
        copyDiscord.classList.remove('copied');
      }, 1500);
    } catch (error) {
      copyStatus.textContent = username;
      console.warn('Automatic copy was not available.', error);
    }
  });

  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.09}px, ${y * 0.12}px)`;
      });

      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });
  }

  if (typingWord) {
    const word = 'rakan';
    let index = 0;
    let deleting = false;

    const tick = () => {
      if (prefersReducedMotion) {
        typingWord.textContent = word;
        return;
      }

      typingWord.textContent = deleting ? word.slice(0, index--) : word.slice(0, index++);

      if (!deleting && index > word.length) {
        deleting = true;
        window.setTimeout(tick, 950);
        return;
      }

      if (deleting && index < 0) {
        deleting = false;
        index = 0;
        window.setTimeout(tick, 350);
        return;
      }

      window.setTimeout(tick, deleting ? 95 : 150);
    };

    tick();
  }
})();
