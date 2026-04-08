const checklistUrl = "data/packing-checklist.json";
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

function renderChecklist(groups) {
  const state = getSavedChecklistState();
  checklistContainer.innerHTML = "";

  groups.forEach((group) => {
    const card = document.createElement("section");
    card.className = "checklist-group";

    const heading = document.createElement("h3");
    heading.textContent = group.category;
    card.appendChild(heading);

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
      });

      const text = document.createElement("span");
      text.textContent = item;

      row.appendChild(checkbox);
      row.appendChild(text);
      card.appendChild(row);
    });

    checklistContainer.appendChild(card);
  });
}

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

loadChecklist();
loadPhrases();
