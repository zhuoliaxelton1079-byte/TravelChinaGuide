/* ========================================
   Midnight Atlas — China Study Abroad Guide
   ======================================== */

const checklistUrl = "data/action-checklist.json";
const phrasesUrl = "data/phrases.json";
const checklistKey = "china-study-checklist-v1";

const checklistContainer = document.getElementById("checklist-container");
const resetButton = document.getElementById("reset-checklist");

const chineseEl = document.getElementById("phrase-chinese");
const pinyinEl = document.getElementById("phrase-pinyin");
const englishEl = document.getElementById("phrase-english");
const prevBtn = document.getElementById("prev-phrase");
const nextBtn = document.getElementById("next-phrase");

let phraseIndex = 0;
let phrases = [];

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const panels = document.querySelectorAll('.panel');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  panels.forEach((panel, i) => {
    panel.style.transitionDelay = `${i * 60}ms`;
    observer.observe(panel);
  });
}

/* --- Active Nav Tracking --- */
function initNavTracking() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  const links = nav.querySelectorAll('a[href^="#"]');
  const sections = Array.from(links).map(link => {
    const id = link.getAttribute('href').slice(1);
    return { link, section: document.getElementById(id) };
  }).filter(item => item.section);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = sections.find(s => s.section === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { threshold: 0.15, rootMargin: '-80px 0px -55% 0px' });

  sections.forEach(({ section }) => observer.observe(section));
}

/* --- Checklist --- */
function getSavedChecklistState() {
  try {
    const raw = localStorage.getItem(checklistKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChecklistState(state) {
  localStorage.setItem(checklistKey, JSON.stringify(state));
}

function updateGroupProgress(card, group, state) {
  const bar = card.querySelector('.group-progress-bar');
  if (!bar) return;
  const total = group.items.length;
  const checked = group.items.filter(item => state[`${group.category}::${item}`]).length;
  bar.style.width = `${(checked / total) * 100}%`;
}

function renderChecklist(groups) {
  const state = getSavedChecklistState();
  checklistContainer.innerHTML = "";

  groups.forEach((group) => {
    const card = document.createElement("section");
    card.className = "checklist-group";

    const heading = document.createElement("h3");
    heading.textContent = group.category;
    card.appendChild(heading);

    const progress = document.createElement("div");
    progress.className = "group-progress";
    const progressBar = document.createElement("div");
    progressBar.className = "group-progress-bar";
    progress.appendChild(progressBar);
    card.appendChild(progress);

    group.items.forEach((item) => {
      const id = `${group.category}::${item}`;
      const row = document.createElement("label");
      row.className = "check-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(state[id]);
      checkbox.addEventListener("change", (event) => {
        state[id] = event.target.checked;
        saveChecklistState(state);
        updateGroupProgress(card, group, state);
      });

      const text = document.createElement("span");
      text.textContent = item;

      row.appendChild(checkbox);
      row.appendChild(text);
      card.appendChild(row);
    });

    checklistContainer.appendChild(card);
    updateGroupProgress(card, group, state);
  });
}

/* --- Phrase Cards --- */
function showPhrase(index) {
  if (!phrases.length) {
    chineseEl.textContent = "No phrase data loaded.";
    pinyinEl.textContent = "";
    englishEl.textContent = "";
    return;
  }

  const phrase = phrases[index];
  chineseEl.textContent = phrase.chinese;
  pinyinEl.textContent = phrase.pinyin;
  englishEl.textContent = phrase.english;
}

async function loadChecklist() {
  try {
    const response = await fetch(checklistUrl);
    const data = await response.json();
    renderChecklist(data);
  } catch {
    checklistContainer.innerHTML = "<p>Checklist failed to load. Refresh and try again.</p>";
  }
}

async function loadPhrases() {
  try {
    const response = await fetch(phrasesUrl);
    phrases = await response.json();
    phraseIndex = 0;
    showPhrase(phraseIndex);
  } catch {
    chineseEl.textContent = "Phrase data failed to load.";
    pinyinEl.textContent = "";
    englishEl.textContent = "";
  }
}

/* --- Event Listeners --- */
prevBtn.addEventListener("click", () => {
  if (!phrases.length) return;
  phraseIndex = (phraseIndex - 1 + phrases.length) % phrases.length;
  showPhrase(phraseIndex);
});

nextBtn.addEventListener("click", () => {
  if (!phrases.length) return;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  showPhrase(phraseIndex);
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(checklistKey);
  loadChecklist();
});

/* --- Init --- */
initScrollReveal();
initNavTracking();
loadChecklist();
loadPhrases();
