/* 日本語れんしゅうアプリ ゲームエンジン */

const els = {
  screenStudentSelect: document.getElementById("screen-student-select"),
  screenSelect: document.getElementById("screen-select"),
  screenHome: document.getElementById("screen-home"),
  screenQuiz: document.getElementById("screen-quiz"),
  screenResult: document.getElementById("screen-result"),
  screenConversation: document.getElementById("screen-conversation"),
  screenSummary: document.getElementById("screen-summary"),

  studentList: document.getElementById("studentList"),
  selectGreeting: document.getElementById("selectGreeting"),
  levelBadge: document.getElementById("levelBadge"),
  levelBarFill: document.getElementById("levelBarFill"),
  levelXpText: document.getElementById("levelXpText"),
  studentProgressFill: document.getElementById("studentProgressFill"),
  studentProgressText: document.getElementById("studentProgressText"),
  reviewButton: document.getElementById("reviewButton"),
  reviewCount: document.getElementById("reviewCount"),
  switchStudentButton: document.getElementById("switchStudentButton"),

  lessonList: document.getElementById("lesson-list"),

  homeBackButton: document.getElementById("homeBackButton"),
  homeLessonTitle: document.getElementById("homeLessonTitle"),
  homeLessonCrown: document.getElementById("homeLessonCrown"),
  modeVocabButton: document.getElementById("modeVocabButton"),
  modeVocabCount: document.getElementById("modeVocabCount"),
  modeVocabCrown: document.getElementById("modeVocabCrown"),
  modeGrammarButton: document.getElementById("modeGrammarButton"),
  modeGrammarCount: document.getElementById("modeGrammarCount"),
  modeGrammarCrown: document.getElementById("modeGrammarCrown"),
  modeConversationButton: document.getElementById("modeConversationButton"),
  modeConversationCount: document.getElementById("modeConversationCount"),
  modeConversationCrown: document.getElementById("modeConversationCrown"),
  modeSummaryButton: document.getElementById("modeSummaryButton"),
  modeSummaryCount: document.getElementById("modeSummaryCount"),

  summaryBackButton: document.getElementById("summaryBackButton"),
  summaryLessonTitle: document.getElementById("summaryLessonTitle"),
  summarySubtitle: document.getElementById("summarySubtitle"),
  summaryContent: document.getElementById("summaryContent"),
  summaryQuizActions: document.getElementById("summaryQuizActions"),
  summaryStartQuizButton: document.getElementById("summaryStartQuizButton"),

  progressFill: document.getElementById("progressFill"),
  scoreBadge: document.getElementById("scoreBadge"),
  streakBadge: document.getElementById("streakBadge"),
  streakCount: document.getElementById("streakCount"),
  questionTypeBadge: document.getElementById("questionTypeBadge"),
  retryRibbon: document.getElementById("retryRibbon"),
  questionArea: document.getElementById("questionArea"),
  optionsArea: document.getElementById("optionsArea"),
  feedbackBanner: document.getElementById("feedbackBanner"),
  feedbackText: document.getElementById("feedbackText"),
  feedbackBonus: document.getElementById("feedbackBonus"),
  feedbackTranslation: document.getElementById("feedbackTranslation"),
  nextButton: document.getElementById("nextButton"),
  quitButton: document.getElementById("quitButton"),

  resultEmoji: document.getElementById("resultEmoji"),
  resultScoreText: document.getElementById("resultScoreText"),
  resultMessage: document.getElementById("resultMessage"),
  resultPoints: document.getElementById("resultPoints"),
  resultBestStreak: document.getElementById("resultBestStreak"),
  resultRedeemed: document.getElementById("resultRedeemed"),
  reviewSection: document.getElementById("reviewSection"),
  reviewList: document.getElementById("reviewList"),
  retryButton: document.getElementById("retryButton"),
  backToHomeButton: document.getElementById("backToHomeButton"),

  convQuitButton: document.getElementById("convQuitButton"),
  convProgressFill: document.getElementById("convProgressFill"),
  convRoundBadge: document.getElementById("convRoundBadge"),
  convPlayArea: document.getElementById("convPlayArea"),
  convEnglishPrompt: document.getElementById("convEnglishPrompt"),
  convBuildArea: document.getElementById("convBuildArea"),
  convOptionsArea: document.getElementById("convOptionsArea"),
  convTypeArea: document.getElementById("convTypeArea"),
  convTextInput: document.getElementById("convTextInput"),
  convSubmitButton: document.getElementById("convSubmitButton"),
  convFeedback: document.getElementById("convFeedback"),
  convFeedbackText: document.getElementById("convFeedbackText"),
  convCorrectAnswer: document.getElementById("convCorrectAnswer"),
  convReplyBubble: document.getElementById("convReplyBubble"),
  convNextButton: document.getElementById("convNextButton"),
  convSummary: document.getElementById("convSummary"),
  convSummaryEmoji: document.getElementById("convSummaryEmoji"),
  convSummaryScore: document.getElementById("convSummaryScore"),
  convSummaryMessage: document.getElementById("convSummaryMessage"),
  convReviewSection: document.getElementById("convReviewSection"),
  convReviewList: document.getElementById("convReviewList"),
  convRetryButton: document.getElementById("convRetryButton"),
  convHomeButton: document.getElementById("convHomeButton"),

  sfxHit: document.getElementById("sfxHit"),
  sfxMiss: document.getElementById("sfxMiss"),
};

const TYPE_LABEL = {
  particle: "Grammar | Choose the particle",
  reorder: "Word Order",
  vocab: "Vocabulary Quiz",
};

// 問題タイプごとの基本ポイント（ならびかえは少し難しいので高め）
const BASE_POINTS = {
  particle: 10,
  vocab: 10,
  reorder: 15,
};

// れんぞく正解ボーナス：2連続目から (streak-1)*5 pt 加算
const STREAK_BONUS_PER_STEP = 5;

const GRAMMAR_TYPES = ["particle", "reorder"];

let state = {
  homeLesson: null, // いまホーム画面を開いているレッスン
  lesson: null,
  mode: "normal", // "normal" | "review"（ふくしゅうモードかどうかで戻り先などが変わる）
  modeKey: null, // "vocab" | "grammar"（王冠判定・達成記録に使う）
  modeQuestions: null, // このモードで出題する問題（元の配列。retry時の再利用に使う）
  queue: [], // まだ出題していない問題: {uid, question, isRetry}
  current: null, // いま表示している問題
  consumed: 0, // これまでに出題した数（今の問題を含む）
  points: 0,
  streak: 0,
  bestStreak: 0,
  redeemedCount: 0, // 2倍ポイントで克服した問題の数
  wrongOnceIds: null, // Set: 一度間違えたuid（再挑戦済みかどうかの判定用）
  wrongList: [], // 再挑戦しても最終的に間違えた問題（けっか画面のレビュー用）
  answered: false,
  reorder: null, // { slots: [...], bank: [...] }
  pendingQuiz: null, // { questions, modeKey } — 解説ページの後にはじめる問題（もんだいをとくボタン用）
};

let convState = {
  lesson: null,
  rounds: [],
  index: 0,
  correctCount: 0,
  wrongRounds: [],
  reorder: null,
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(name) {
  els.screenStudentSelect.classList.toggle("hidden", name !== "student-select");
  els.screenSelect.classList.toggle("hidden", name !== "select");
  els.screenHome.classList.toggle("hidden", name !== "home");
  els.screenQuiz.classList.toggle("hidden", name !== "quiz");
  els.screenResult.classList.toggle("hidden", name !== "result");
  els.screenConversation.classList.toggle("hidden", name !== "conversation");
  els.screenSummary.classList.toggle("hidden", name !== "summary");
}

function playSound(ok) {
  const audio = ok ? els.sfxHit : els.sfxMiss;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {}
}

function spawnEmojiPopup(text, extraClass) {
  const popup = document.createElement("div");
  popup.className = "emoji-popup" + (extraClass ? " " + extraClass : "");
  popup.textContent = text;
  popup.addEventListener("animationend", () => popup.remove());
  els.questionArea.appendChild(popup);
}

/* ---------------- なまえ選択・生徒ごとの解禁管理 ---------------- */

const CURRENT_STUDENT_KEY = "nihongo_quiz_student_id";
let currentStudent = null;

function getStudentById(id) {
  return (typeof STUDENTS !== "undefined" ? STUDENTS : []).find((s) => s.id === id) || null;
}

function renderStudentList() {
  els.studentList.innerHTML = "";

  if (typeof STUDENTS === "undefined" || STUDENTS.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No students registered yet.";
    els.studentList.appendChild(empty);
    return;
  }

  STUDENTS.forEach((student) => {
    const card = document.createElement("div");
    card.className = "lesson-card";
    card.innerHTML = `
      <div class="lesson-card-info">
        <h3>${student.name}</h3>
      </div>
      <div class="lesson-start-button">Select ›</div>
    `;
    card.addEventListener("click", () => chooseStudent(student));
    els.studentList.appendChild(card);
  });
}

function chooseStudent(student) {
  currentStudent = student;
  localStorage.setItem(CURRENT_STUDENT_KEY, student.id);
  currentProgress = loadProgress(student.id);
  renderLessonSelectScreen();
  showScreen("select");
}

els.switchStudentButton.addEventListener("click", () => {
  localStorage.removeItem(CURRENT_STUDENT_KEY);
  currentStudent = null;
  currentProgress = null;
  renderStudentList();
  showScreen("student-select");
});

/* ---------------- 生徒ごとの永続データ（レベル・ふくしゅうリスト） ----------------
 * 授業外でも復習できるように、間違えた問題は生徒ごとにブラウザへ保存しておく。
 * 「ふくしゅう」で正解すると通常より多くのXP/ポイントが入り、リストから消える。
 * サーバーを使わず localStorage だけで完結させている（[[feedback-quiz-app-publishing]]
 * の方針どおり、静的サイトのまま拡張する形）。
 */

const LEVEL_XP_STEP = 200; // このXPごとにレベルが1つ上がる
// GAME_MODES: 「すべてのゲーム」を判定するときに数えるモード（ようてん整理はクイズではないので含めない）
const GAME_MODES = ["vocab", "grammar", "conversation"];
let currentProgress = null; // { totalXP, mistakes: [...], mastery: { [lessonId]: {vocab,grammar,conversation} } }

function progressKey(studentId) {
  return "nihongo_quiz_progress_" + studentId;
}

function loadProgress(studentId) {
  try {
    const raw = localStorage.getItem(progressKey(studentId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.mistakes)) {
        if (!parsed.mastery) parsed.mastery = {};
        return parsed;
      }
    }
  } catch (e) {}
  return { totalXP: 0, mistakes: [], mastery: {} };
}

function saveProgress() {
  if (!currentStudent || !currentProgress) return;
  localStorage.setItem(progressKey(currentStudent.id), JSON.stringify(currentProgress));
}

function computeLevel(xp) {
  const level = Math.floor(xp / LEVEL_XP_STEP) + 1;
  const xpIntoLevel = xp % LEVEL_XP_STEP;
  return { level, xpIntoLevel, xpForNextLevel: LEVEL_XP_STEP };
}

function addXP(amount) {
  if (!currentProgress || amount <= 0) return;
  currentProgress.totalXP += amount;
  saveProgress();
}

function questionSignature(lessonId, q) {
  if (q.type === "particle") return [lessonId, "particle", q.before, q.after, q.answer].join("|");
  if (q.type === "vocab") return [lessonId, "vocab", q.prompt].join("|");
  if (q.type === "reorder") return [lessonId, "reorder", q.words.join("・")].join("|");
  return [lessonId, q.type, JSON.stringify(q)].join("|");
}

function addMistake(lessonId, lessonTitle, q) {
  if (!currentProgress) return;
  const sig = questionSignature(lessonId, q);
  if (currentProgress.mistakes.some((m) => m.sig === sig)) return;
  currentProgress.mistakes.push({ sig, lessonId, lessonTitle, type: q.type, question: q });
  saveProgress();
}

function removeMistakeBySig(sig) {
  if (!currentProgress) return;
  currentProgress.mistakes = currentProgress.mistakes.filter((m) => m.sig !== sig);
  saveProgress();
}

// そのレッスンのそのモードで満点をとったら王冠がつく（ふくしゅうモードでは付けない —
// ふくしゅうは複数レッスン混合のプールなので、1レッスンの達成としては数えない）
function markMastery(lessonId, modeKey) {
  if (!currentProgress || !lessonId || !modeKey) return;
  if (!currentProgress.mastery) currentProgress.mastery = {};
  if (!currentProgress.mastery[lessonId]) currentProgress.mastery[lessonId] = {};
  if (currentProgress.mastery[lessonId][modeKey]) return;
  currentProgress.mastery[lessonId][modeKey] = true;
  saveProgress();
}

function getLessonMastery(lessonId) {
  return (currentProgress && currentProgress.mastery && currentProgress.mastery[lessonId]) || {};
}

function isLessonFullyMastered(lessonId) {
  const m = getLessonMastery(lessonId);
  return GAME_MODES.every((mode) => m[mode]);
}

/* ---------------- レッスン選択 ---------------- */

function renderLessonSelectScreen() {
  els.selectGreeting.textContent = `Hi ${currentStudent.name}, choose a lesson to practice!`;

  const { level, xpIntoLevel, xpForNextLevel } = computeLevel(currentProgress.totalXP);
  els.levelBadge.textContent = `Lv.${level}`;
  els.levelBarFill.style.width = (xpIntoLevel / xpForNextLevel) * 100 + "%";
  els.levelXpText.textContent = `${xpIntoLevel} / ${xpForNextLevel} XP`;

  const mistakeCount = currentProgress.mistakes.length;
  els.reviewCount.textContent = mistakeCount > 0 ? `${mistakeCount} to review` : "None";
  els.reviewButton.disabled = mistakeCount === 0;
  els.reviewButton.classList.toggle("mode-disabled", mistakeCount === 0);

  const total = typeof LESSONS !== "undefined" ? LESSONS.length : 0;
  const unlocked = Math.min(currentStudent.unlockedUpTo, total);
  const pct = total === 0 ? 0 : (unlocked / total) * 100;
  els.studentProgressFill.style.width = pct + "%";
  els.studentProgressText.textContent = `Progress: ${unlocked} / ${total} lessons`;

  els.lessonList.innerHTML = "";

  if (total === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No lessons yet.";
    els.lessonList.appendChild(empty);
    return;
  }

  const visibleLessons = LESSONS.filter((lesson) => (lesson.order || 1) <= currentStudent.unlockedUpTo);

  if (visibleLessons.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No lessons unlocked yet. Ask your teacher!";
    els.lessonList.appendChild(empty);
    return;
  }

  visibleLessons.forEach((lesson) => {
    const crown = isLessonFullyMastered(lesson.id) ? '<span class="lesson-card-crown">👑</span>' : "";
    const card = document.createElement("div");
    card.className = "lesson-card";
    card.innerHTML = `
      <div class="lesson-card-info">
        <h3>${lesson.title}${crown}</h3>
        <p>${lesson.questions.length} questions${lesson.conversation ? " · conversation included" : ""}</p>
      </div>
      <div class="lesson-start-button">Open ›</div>
    `;
    card.addEventListener("click", () => openHome(lesson));
    els.lessonList.appendChild(card);
  });
}

/* ---------------- レッスンホーム ---------------- */

function openHome(lesson) {
  state.homeLesson = lesson;

  const vocabCount = lesson.questions.filter((q) => q.type === "vocab").length;
  const grammarCount = lesson.questions.filter((q) => GRAMMAR_TYPES.includes(q.type)).length;
  const hasConversation = !!(lesson.conversation && lesson.conversation.rounds && lesson.conversation.rounds.length);
  const hasSummary = !!(lesson.summary && lesson.summary.points && lesson.summary.points.length);

  els.homeLessonTitle.textContent = lesson.title;
  els.modeVocabCount.textContent = `${vocabCount} questions`;
  els.modeGrammarCount.textContent = `${grammarCount} questions`;
  els.modeConversationCount.textContent = hasConversation ? `${lesson.conversation.rounds.length} rounds` : "Coming soon";
  els.modeSummaryCount.textContent = hasSummary ? `${lesson.summary.points.length} points` : "Coming soon";

  els.modeVocabButton.disabled = vocabCount === 0;
  els.modeVocabButton.classList.toggle("mode-disabled", vocabCount === 0);
  els.modeGrammarButton.disabled = grammarCount === 0;
  els.modeGrammarButton.classList.toggle("mode-disabled", grammarCount === 0);
  els.modeConversationButton.disabled = !hasConversation;
  els.modeConversationButton.classList.toggle("mode-disabled", !hasConversation);
  els.modeSummaryButton.disabled = !hasSummary;
  els.modeSummaryButton.classList.toggle("mode-disabled", !hasSummary);

  const mastery = getLessonMastery(lesson.id);
  els.modeVocabCrown.classList.toggle("hidden", !mastery.vocab);
  els.modeGrammarCrown.classList.toggle("hidden", !mastery.grammar);
  els.modeConversationCrown.classList.toggle("hidden", !mastery.conversation);
  els.homeLessonCrown.classList.toggle("hidden", !isLessonFullyMastered(lesson.id));

  showScreen("home");
}

els.homeBackButton.addEventListener("click", () => {
  renderLessonSelectScreen();
  showScreen("select");
});

els.modeSummaryButton.addEventListener("click", () => {
  state.pendingQuiz = null;
  openSummary(state.homeLesson);
});

function openSummary(lesson) {
  els.summaryLessonTitle.textContent = lesson.title;
  els.summaryContent.innerHTML = "";
  lesson.summary.points.forEach((point) => {
    const div = document.createElement("div");
    div.className = "summary-point";
    div.textContent = point;
    els.summaryContent.appendChild(div);
  });

  const isPreQuiz = !!state.pendingQuiz;
  els.summarySubtitle.classList.toggle("hidden", !isPreQuiz);
  els.summaryQuizActions.classList.toggle("hidden", !isPreQuiz);

  showScreen("summary");
}

els.summaryBackButton.addEventListener("click", () => {
  state.pendingQuiz = null;
  showScreen("home");
});

els.summaryStartQuizButton.addEventListener("click", () => {
  if (!state.pendingQuiz) return;
  const { questions, modeKey } = state.pendingQuiz;
  state.pendingQuiz = null;
  startLesson(state.homeLesson, questions, modeKey);
});

els.modeVocabButton.addEventListener("click", () => {
  const questions = state.homeLesson.questions.filter((q) => q.type === "vocab");
  const hasSummary = !!(state.homeLesson.summary && state.homeLesson.summary.points && state.homeLesson.summary.points.length);
  if (hasSummary) {
    state.pendingQuiz = { questions, modeKey: "vocab" };
    openSummary(state.homeLesson);
  } else {
    startLesson(state.homeLesson, questions, "vocab");
  }
});

els.modeGrammarButton.addEventListener("click", () => {
  const questions = state.homeLesson.questions.filter((q) => GRAMMAR_TYPES.includes(q.type));
  const hasSummary = !!(state.homeLesson.summary && state.homeLesson.summary.points && state.homeLesson.summary.points.length);
  if (hasSummary) {
    state.pendingQuiz = { questions, modeKey: "grammar" };
    openSummary(state.homeLesson);
  } else {
    startLesson(state.homeLesson, questions, "grammar");
  }
});

els.modeConversationButton.addEventListener("click", () => {
  startConversation(state.homeLesson);
});

/* ---------------- クイズ（たんご・ぶんぽう共通） ---------------- */

function startLesson(lesson, questions, modeKey) {
  const wrapped = questions.map((q, i) => ({ uid: i, question: q, isRetry: false }));

  state.lesson = lesson;
  state.mode = "normal";
  state.modeKey = modeKey || state.modeKey;
  state.modeQuestions = questions;
  state.queue = shuffle(wrapped);
  state.current = null;
  state.consumed = 0;
  state.points = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.redeemedCount = 0;
  state.wrongOnceIds = new Set();
  state.wrongList = [];

  els.backToHomeButton.textContent = "Back to Home";
  showScreen("quiz");
  renderQuestion();
}

els.reviewButton.addEventListener("click", () => {
  startReview();
});

function startReview() {
  const mistakes = currentProgress.mistakes;
  const wrapped = mistakes.map((m, i) => ({ uid: i, question: m.question, isRetry: true, sig: m.sig }));

  state.lesson = { id: "__review__", title: "Review" };
  state.homeLesson = null;
  state.mode = "review";
  state.modeQuestions = mistakes.map((m) => m.question);
  state.queue = shuffle(wrapped);
  state.current = null;
  state.consumed = 0;
  state.points = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.redeemedCount = 0;
  state.wrongOnceIds = new Set();
  state.wrongList = [];

  els.backToHomeButton.textContent = "Back to Lesson List";
  showScreen("quiz");
  renderQuestion();
}

function updateTopBar() {
  const remaining = state.queue.length;
  const totalEstimate = Math.max(state.consumed + remaining, 1);
  const doneBeforeCurrent = Math.max(state.consumed - 1, 0);
  const pct = (doneBeforeCurrent / totalEstimate) * 100;
  els.progressFill.style.width = pct + "%";
  els.scoreBadge.textContent = "⭐ " + state.points;

  if (state.streak >= 2) {
    els.streakBadge.classList.remove("hidden");
    els.streakCount.textContent = state.streak;
  } else {
    els.streakBadge.classList.add("hidden");
  }
}

function renderQuestion() {
  if (state.queue.length === 0) {
    finishLesson();
    return;
  }

  state.current = state.queue.shift();
  state.consumed++;
  state.answered = false;

  els.feedbackBanner.classList.add("hidden");
  els.questionArea.classList.remove("shake");
  updateTopBar();

  const q = state.current.question;
  els.questionTypeBadge.textContent = TYPE_LABEL[q.type];
  els.questionTypeBadge.className = "question-type-badge " + q.type;
  els.retryRibbon.classList.toggle("hidden", !state.current.isRetry);

  els.questionArea.innerHTML = "";
  els.optionsArea.innerHTML = "";
  els.optionsArea.className = "options-area";

  if (q.type === "particle") renderParticleQuestion(q);
  else if (q.type === "vocab") renderVocabQuestion(q);
  else if (q.type === "reorder") renderReorderQuestion(q);
}

function renderParticleQuestion(q) {
  els.questionArea.innerHTML = `
    <div class="sentence-line">
      <span class="sentence-word">${q.before}</span>
      <span class="blank-slot">＿＿</span>
      <span class="sentence-word">${q.after}</span>
    </div>
  `;

  const options = shuffle(q.options);
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = opt;
    btn.addEventListener("click", () => selectChoice(btn, opt, q.answer, q));
    els.optionsArea.appendChild(btn);
  });
}

function renderVocabQuestion(q) {
  els.questionArea.innerHTML = `
    <div class="vocab-prompt">${q.prompt}</div>
    <div class="vocab-hint">What does this word mean?</div>
  `;

  const options = shuffle(q.options);
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = opt;
    btn.addEventListener("click", () => selectChoice(btn, opt, q.answer, q));
    els.optionsArea.appendChild(btn);
  });
}

function renderReorderQuestion(q) {
  els.questionArea.innerHTML = `
    <div class="reorder-instruction">Tap the words in the right order</div>
    <div class="reorder-slots" id="reorderSlots"></div>
  `;
  els.optionsArea.className = "options-area reorder-bank";

  const shuffled = shuffle(q.words.map((w, i) => ({ word: w, id: i })));
  state.reorder = {
    slots: new Array(q.words.length).fill(null),
    bank: shuffled,
  };

  renderReorderSlots();
  renderReorderBank(q);
}

function renderReorderSlots() {
  const slotsEl = document.getElementById("reorderSlots");
  slotsEl.innerHTML = "";
  state.reorder.slots.forEach((filled, i) => {
    const slot = document.createElement("div");
    slot.className = "reorder-slot" + (filled ? " filled" : "");
    slot.textContent = filled ? filled.word : "";
    if (filled && !state.answered) {
      slot.addEventListener("click", () => removeFromSlot(i));
    }
    slotsEl.appendChild(slot);
  });
}

function renderReorderBank(q) {
  els.optionsArea.innerHTML = "";
  state.reorder.bank.forEach((item) => {
    const used = state.reorder.slots.some((s) => s && s.id === item.id);
    const btn = document.createElement("button");
    btn.className = "option-button word-chip" + (used ? " disabled-chip" : "");
    btn.textContent = item.word;
    btn.addEventListener("click", () => addToSlot(item, q));
    els.optionsArea.appendChild(btn);
  });
}

function addToSlot(item, q) {
  if (state.answered) return;
  const emptyIndex = state.reorder.slots.findIndex((s) => s === null);
  if (emptyIndex === -1) return;
  state.reorder.slots[emptyIndex] = item;
  renderReorderSlots();
  renderReorderBank(q);

  if (state.reorder.slots.every((s) => s !== null)) {
    checkReorderAnswer(q);
  }
}

function removeFromSlot(index) {
  if (state.answered) return;
  const q = state.current.question;
  state.reorder.slots[index] = null;
  renderReorderSlots();
  renderReorderBank(q);
}

function checkReorderAnswer(q) {
  const userOrder = state.reorder.slots.map((s) => s.word);
  const isCorrect = userOrder.join("｜") === q.words.join("｜");
  finishAnswer(isCorrect, q, userOrder.join(" "), q.words.join(" "));
}

/* ---------------- 選択式 (助詞/たんご) ---------------- */

function selectChoice(btn, chosen, correctAnswer, q) {
  if (state.answered) return;
  const isCorrect = chosen === correctAnswer;

  Array.from(els.optionsArea.children).forEach((b) => (b.disabled = true));

  if (isCorrect) {
    btn.classList.add("correct", "pop");
  } else {
    btn.classList.add("wrong");
    Array.from(els.optionsArea.children).forEach((b) => {
      if (b.textContent === correctAnswer) b.classList.add("correct");
    });
  }

  finishAnswer(isCorrect, q, chosen, correctAnswer);
}

/* ---------------- 共通の正誤処理 ---------------- */

function finishAnswer(isCorrect, q, userAnswerDisplay, correctAnswerDisplay) {
  state.answered = true;
  playSound(isCorrect);

  const item = state.current;
  let bonusText = "";

  if (isCorrect) {
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;

    const base = BASE_POINTS[q.type] || 10;
    const streakBonus = state.streak >= 2 ? (state.streak - 1) * STREAK_BONUS_PER_STEP : 0;
    let earned = base + streakBonus;

    const parts = [`+${earned}pt`];
    if (item.isRetry) {
      earned *= 2;
      parts[0] = `+${earned}pt`;
      parts.push("2x bonus!");
      state.redeemedCount++;
    }

    state.points += earned;
    bonusText = parts.join("　");
    addXP(earned);
    if (item.sig) removeMistakeBySig(item.sig);

    let popupEmoji = "";
    if (streakBonus > 0) popupEmoji += "🔥".repeat(Math.min(state.streak - 1, 4));
    if (item.isRetry) popupEmoji += (popupEmoji ? " " : "") + "⚡✨";
    if (popupEmoji) spawnEmojiPopup(popupEmoji, item.isRetry ? "popup-double" : "popup-streak");
  } else {
    state.streak = 0;
    els.questionArea.classList.add("shake");
    addMistake(state.lesson.id, state.lesson.title, q);

    if (!state.wrongOnceIds.has(item.uid)) {
      state.wrongOnceIds.add(item.uid);
      const insertAt = Math.min(state.queue.length, 2 + Math.floor(Math.random() * 3));
      const sig = item.sig || questionSignature(state.lesson.id, q);
      state.queue.splice(insertAt, 0, { uid: item.uid, question: q, isRetry: true, sig });
      bonusText = "So close... you'll get another chance! Correct = double points";
    } else {
      state.wrongList.push({
        type: q.type,
        questionDisplay: questionDisplayText(q),
        userAnswerDisplay,
        correctAnswerDisplay,
        translation: q.translation || "",
      });
    }
  }

  updateTopBar();

  els.feedbackBanner.classList.remove("hidden", "is-correct", "is-wrong");
  els.feedbackBanner.classList.add(isCorrect ? "is-correct" : "is-wrong");
  els.feedbackText.textContent = isCorrect ? "Correct! 🎉" : "Not quite...";
  els.feedbackBonus.textContent = bonusText;
  els.feedbackTranslation.textContent = q.translation ? q.translation : "";

  const isLast = state.queue.length === 0;
  els.nextButton.textContent = isLast ? "See results →" : "Next →";
}

function questionDisplayText(q) {
  if (q.type === "particle") return `${q.before} ＿＿ ${q.after}`;
  if (q.type === "vocab") return q.prompt;
  if (q.type === "reorder") return q.words.join(" / ");
  return "";
}

/* ---------------- 進行 ---------------- */

els.nextButton.addEventListener("click", () => {
  if (state.queue.length === 0) {
    finishLesson();
  } else {
    renderQuestion();
  }
});

els.quitButton.addEventListener("click", () => {
  const isReview = state.mode === "review";
  const msg = isReview ? "Quit practice and return to the lesson list?" : "Quit practice and return to home?";
  if (confirm(msg)) {
    if (isReview) {
      renderLessonSelectScreen();
      showScreen("select");
    } else {
      showScreen("home");
    }
  }
});

function finishLesson() {
  els.progressFill.style.width = "100%";

  const total = state.modeQuestions.length;
  const mastered = total - state.wrongList.length;
  const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);

  els.resultScoreText.textContent = `${mastered} / ${total} correct`;
  els.resultPoints.textContent = state.points;
  els.resultBestStreak.textContent = state.bestStreak;
  els.resultRedeemed.textContent = state.redeemedCount;

  if (pct === 100 && state.mode === "normal") {
    markMastery(state.lesson.id, state.modeKey);
  }

  if (pct === 100) {
    els.resultEmoji.textContent = "🏆";
    els.resultMessage.textContent = state.mode === "normal" ? "Perfect! 👑 Crown earned!" : "Perfect! Amazing job!";
  } else if (pct >= 80) {
    els.resultEmoji.textContent = "🎉";
    els.resultMessage.textContent = "Great job! Well done!";
  } else if (pct >= 50) {
    els.resultEmoji.textContent = "💪";
    els.resultMessage.textContent = "Nice work! Keep practicing a bit more.";
  } else {
    els.resultEmoji.textContent = "🌱";
    els.resultMessage.textContent = "That's okay! Give it another try.";
  }

  if (state.wrongList.length > 0) {
    els.reviewSection.classList.remove("hidden");
    els.reviewList.innerHTML = "";
    state.wrongList.forEach((item) => {
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `
        <div class="review-item-type">${TYPE_LABEL[item.type]}</div>
        <div class="review-item-q">${item.questionDisplay}</div>
        <div class="review-item-answer">Correct: ${item.correctAnswerDisplay}${item.userAnswerDisplay ? ` (Your answer: ${item.userAnswerDisplay})` : ""}</div>
        ${item.translation ? `<div class="review-item-translation">${item.translation}</div>` : ""}
      `;
      els.reviewList.appendChild(div);
    });
  } else {
    els.reviewSection.classList.add("hidden");
  }

  showScreen("result");
}

els.retryButton.addEventListener("click", () => {
  if (state.mode === "review") {
    startReview();
  } else {
    startLesson(state.lesson, state.modeQuestions);
  }
});

els.backToHomeButton.addEventListener("click", () => {
  if (state.mode === "review") {
    renderLessonSelectScreen();
    showScreen("select");
  } else {
    openHome(state.homeLesson);
  }
});

/* ================================================
   かいわテスト
================================================= */

function normalizeJa(s) {
  return (s || "")
    .replace(/[\s　]+/g, "")
    .replace(/[。.！!？?、,]+$/g, "")
    .trim();
}

function startConversation(lesson) {
  convState.lesson = lesson;
  convState.rounds = lesson.conversation.rounds;
  convState.index = 0;
  convState.correctCount = 0;
  convState.wrongRounds = [];

  els.convSummary.classList.add("hidden");
  els.convPlayArea.classList.remove("hidden");

  showScreen("conversation");
  renderConvRound();
}

function updateConvTopBar() {
  const total = convState.rounds.length;
  const pct = total === 0 ? 0 : (convState.index / total) * 100;
  els.convProgressFill.style.width = pct + "%";
  els.convRoundBadge.textContent = `${convState.index + 1}/${total}`;
}

function renderConvRound() {
  const round = convState.rounds[convState.index];
  updateConvTopBar();

  els.convFeedback.classList.add("hidden");
  els.convReplyBubble.classList.add("hidden");
  els.convEnglishPrompt.textContent = round.english;

  const isScaffolded = Array.isArray(round.words) && round.words.length > 0;

  els.convBuildArea.classList.toggle("hidden", !isScaffolded);
  els.convOptionsArea.classList.toggle("hidden", !isScaffolded);
  els.convTypeArea.classList.toggle("hidden", isScaffolded);

  if (isScaffolded) {
    const shuffled = shuffle(round.words.map((w, i) => ({ word: w, id: i })));
    convState.reorder = {
      slots: new Array(round.words.length).fill(null),
      bank: shuffled,
    };
    renderConvSlots(round);
    renderConvBank(round);
  } else {
    els.convTextInput.value = "";
    els.convTextInput.disabled = false;
    els.convTextInput.focus();
  }
}

function renderConvSlots(round) {
  els.convBuildArea.innerHTML = "";
  convState.reorder.slots.forEach((filled, i) => {
    const slot = document.createElement("div");
    slot.className = "reorder-slot" + (filled ? " filled" : "");
    slot.textContent = filled ? filled.word : "";
    if (filled) {
      slot.addEventListener("click", () => removeFromConvSlot(i, round));
    }
    els.convBuildArea.appendChild(slot);
  });
}

function renderConvBank(round) {
  els.convOptionsArea.innerHTML = "";
  convState.reorder.bank.forEach((item) => {
    const used = convState.reorder.slots.some((s) => s && s.id === item.id);
    const btn = document.createElement("button");
    btn.className = "option-button word-chip" + (used ? " disabled-chip" : "");
    btn.textContent = item.word;
    btn.addEventListener("click", () => addToConvSlot(item, round));
    els.convOptionsArea.appendChild(btn);
  });
}

function addToConvSlot(item, round) {
  const emptyIndex = convState.reorder.slots.findIndex((s) => s === null);
  if (emptyIndex === -1) return;
  convState.reorder.slots[emptyIndex] = item;
  renderConvSlots(round);
  renderConvBank(round);

  if (convState.reorder.slots.every((s) => s !== null)) {
    const built = convState.reorder.slots.map((s) => s.word).join("");
    checkConvAnswer(built, convState.reorder.slots.map((s) => s.word).join(" "));
  }
}

function removeFromConvSlot(index, round) {
  convState.reorder.slots[index] = null;
  renderConvSlots(round);
  renderConvBank(round);
}

els.convSubmitButton.addEventListener("click", () => {
  const val = els.convTextInput.value.trim();
  if (!val) return;
  checkConvAnswer(val, val);
});

els.convTextInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") els.convSubmitButton.click();
});

function checkConvAnswer(rawUserText, displayUserText) {
  const round = convState.rounds[convState.index];
  const isCorrect = normalizeJa(rawUserText) === normalizeJa(round.answer);

  playSound(isCorrect);
  els.convTextInput.disabled = true;

  if (isCorrect) {
    convState.correctCount++;
    addXP(10);
  } else {
    convState.wrongRounds.push({
      english: round.english,
      userAnswer: displayUserText,
      correctAnswer: round.answer,
    });
  }

  els.convFeedback.classList.remove("hidden");
  els.convFeedbackText.textContent = isCorrect ? "Correct! 🎉" : "Not quite...";
  els.convFeedbackText.style.color = isCorrect ? "var(--good)" : "var(--bad)";
  els.convCorrectAnswer.textContent = `Correct: ${round.answer}`;

  if (round.reply) {
    els.convReplyBubble.textContent = `💬 ${round.reply}`;
    els.convReplyBubble.classList.remove("hidden");
  }

  const isLast = convState.index === convState.rounds.length - 1;
  els.convNextButton.textContent = isLast ? "See results →" : "Next →";
}

els.convNextButton.addEventListener("click", () => {
  convState.index++;
  if (convState.index >= convState.rounds.length) {
    finishConversation();
  } else {
    renderConvRound();
  }
});

function finishConversation() {
  els.convProgressFill.style.width = "100%";
  els.convPlayArea.classList.add("hidden");
  els.convSummary.classList.remove("hidden");

  const total = convState.rounds.length;
  const correct = convState.correctCount;
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);

  els.convSummaryScore.textContent = `${correct} / ${total} correct`;

  if (pct === 100) {
    markMastery(convState.lesson.id, "conversation");
    els.convSummaryEmoji.textContent = "🏆";
    els.convSummaryMessage.textContent = "Perfect! 👑 Crown earned!";
  } else if (pct >= 80) {
    els.convSummaryEmoji.textContent = "🎉";
    els.convSummaryMessage.textContent = "Amazing! You asked great questions!";
  } else if (pct >= 50) {
    els.convSummaryEmoji.textContent = "💪";
    els.convSummaryMessage.textContent = "Nice work! Keep practicing a bit more.";
  } else {
    els.convSummaryEmoji.textContent = "🌱";
    els.convSummaryMessage.textContent = "That's okay! Give it another try.";
  }

  if (convState.wrongRounds.length > 0) {
    els.convReviewSection.classList.remove("hidden");
    els.convReviewList.innerHTML = "";
    convState.wrongRounds.forEach((item) => {
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `
        <div class="review-item-type">Conversation</div>
        <div class="review-item-q">${item.english}</div>
        <div class="review-item-answer">Correct: ${item.correctAnswer}${item.userAnswer ? ` (Your answer: ${item.userAnswer})` : ""}</div>
      `;
      els.convReviewList.appendChild(div);
    });
  } else {
    els.convReviewSection.classList.add("hidden");
  }
}

els.convRetryButton.addEventListener("click", () => {
  startConversation(convState.lesson);
});

els.convHomeButton.addEventListener("click", () => {
  openHome(state.homeLesson);
});

els.convQuitButton.addEventListener("click", () => {
  if (confirm("Quit practice and return to home?")) {
    openHome(state.homeLesson);
  }
});

/* ---------------- BGM ---------------- */

const bgmToggleButton = document.getElementById("bgmToggle");

function updateBgmIcon() {
  bgmToggleButton.textContent = ChiptuneBGM.isMuted() ? "🔇" : "🔊";
}

updateBgmIcon();

bgmToggleButton.addEventListener("click", () => {
  ChiptuneBGM.toggleMute();
  updateBgmIcon();
});

document.addEventListener(
  "click",
  function startBgmOnce() {
    ChiptuneBGM.start();
    document.removeEventListener("click", startBgmOnce);
  },
  { once: true }
);

/* ---------------- 初期化 ---------------- */

renderStudentList();

const savedStudentId = localStorage.getItem(CURRENT_STUDENT_KEY);
const savedStudent = savedStudentId ? getStudentById(savedStudentId) : null;

if (savedStudent) {
  currentStudent = savedStudent;
  currentProgress = loadProgress(savedStudent.id);
  renderLessonSelectScreen();
  showScreen("select");
} else {
  showScreen("student-select");
}
