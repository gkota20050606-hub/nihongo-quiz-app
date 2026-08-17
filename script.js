/* 日本語れんしゅうアプリ ゲームエンジン */

const els = {
  screenSelect: document.getElementById("screen-select"),
  screenQuiz: document.getElementById("screen-quiz"),
  screenResult: document.getElementById("screen-result"),
  lessonList: document.getElementById("lesson-list"),
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
  backToSelectButton: document.getElementById("backToSelectButton"),
  sfxHit: document.getElementById("sfxHit"),
  sfxMiss: document.getElementById("sfxMiss"),
};

const TYPE_LABEL = {
  particle: "じょし | 助詞をえらぼう",
  reorder: "ならびかえ",
  vocab: "たんごクイズ",
};

// 問題タイプごとの基本ポイント（ならびかえは少し難しいので高め）
const BASE_POINTS = {
  particle: 10,
  vocab: 10,
  reorder: 15,
};

// れんぞく正解ボーナス：2連続目から (streak-1)*5 pt 加算
const STREAK_BONUS_PER_STEP = 5;

let state = {
  lesson: null,
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
  els.screenSelect.classList.toggle("hidden", name !== "select");
  els.screenQuiz.classList.toggle("hidden", name !== "quiz");
  els.screenResult.classList.toggle("hidden", name !== "result");
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

/* ---------------- レッスン選択 ---------------- */

function renderLessonList() {
  els.lessonList.innerHTML = "";

  if (typeof LESSONS === "undefined" || LESSONS.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "まだレッスンがありません。スライドの写真を送ってレッスンを作ってもらおう。";
    els.lessonList.appendChild(empty);
    return;
  }

  LESSONS.forEach((lesson) => {
    const card = document.createElement("div");
    card.className = "lesson-card";
    card.innerHTML = `
      <div class="lesson-card-info">
        <h3>${lesson.title}</h3>
        <p>${lesson.questions.length}問</p>
      </div>
      <button class="lesson-start-button">はじめる</button>
    `;
    card.querySelector(".lesson-start-button").addEventListener("click", () => startLesson(lesson));
    els.lessonList.appendChild(card);
  });
}

function startLesson(lesson) {
  const wrapped = lesson.questions.map((q, i) => ({ uid: i, question: q, isRetry: false }));

  state.lesson = lesson;
  state.queue = shuffle(wrapped);
  state.current = null;
  state.consumed = 0;
  state.points = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.redeemedCount = 0;
  state.wrongOnceIds = new Set();
  state.wrongList = [];

  showScreen("quiz");
  renderQuestion();
}

/* ---------------- クイズ描画 ---------------- */

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
    <div class="vocab-hint">この言葉の意味は?</div>
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
    <div class="reorder-instruction">正しい順番にタップしよう</div>
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
      parts.push("2倍ボーナス！");
      state.redeemedCount++;
    }

    state.points += earned;
    bonusText = parts.join("　");

    let popupEmoji = "";
    if (streakBonus > 0) popupEmoji += "🔥".repeat(Math.min(state.streak - 1, 4));
    if (item.isRetry) popupEmoji += (popupEmoji ? " " : "") + "⚡✨";
    if (popupEmoji) spawnEmojiPopup(popupEmoji, item.isRetry ? "popup-double" : "popup-streak");
  } else {
    state.streak = 0;
    els.questionArea.classList.add("shake");

    if (!state.wrongOnceIds.has(item.uid)) {
      state.wrongOnceIds.add(item.uid);
      const insertAt = Math.min(state.queue.length, 2 + Math.floor(Math.random() * 3));
      state.queue.splice(insertAt, 0, { uid: item.uid, question: q, isRetry: true });
      bonusText = "ざんねん…もう一回チャレンジできるよ！せいかいで2倍ポイント";
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
  els.feedbackText.textContent = isCorrect ? "せいかい! 🎉" : "ざんねん...";
  els.feedbackBonus.textContent = bonusText;
  els.feedbackTranslation.textContent = q.translation ? q.translation : "";

  const isLast = state.queue.length === 0;
  els.nextButton.textContent = isLast ? "けっかを見る →" : "つぎへ →";
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
  if (confirm("れんしゅうをやめてレッスン選択にもどりますか?")) {
    showScreen("select");
  }
});

function finishLesson() {
  els.progressFill.style.width = "100%";

  const total = state.lesson.questions.length;
  const mastered = total - state.wrongList.length;
  const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);

  els.resultScoreText.textContent = `${mastered} / ${total} せいかい`;
  els.resultPoints.textContent = state.points;
  els.resultBestStreak.textContent = state.bestStreak;
  els.resultRedeemed.textContent = state.redeemedCount;

  if (pct === 100) {
    els.resultEmoji.textContent = "🏆";
    els.resultMessage.textContent = "パーフェクト！かんぺきだね！";
  } else if (pct >= 80) {
    els.resultEmoji.textContent = "🎉";
    els.resultMessage.textContent = "すごい！よくできました！";
  } else if (pct >= 50) {
    els.resultEmoji.textContent = "💪";
    els.resultMessage.textContent = "いいかんじ！もう少し練習しよう。";
  } else {
    els.resultEmoji.textContent = "🌱";
    els.resultMessage.textContent = "だいじょうぶ！もう一度チャレンジしてみよう。";
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
        <div class="review-item-answer">正解: ${item.correctAnswerDisplay}${item.userAnswerDisplay ? ` (あなたの答え: ${item.userAnswerDisplay})` : ""}</div>
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
  startLesson(state.lesson);
});

els.backToSelectButton.addEventListener("click", () => {
  showScreen("select");
});

/* ---------------- 初期化 ---------------- */

renderLessonList();
showScreen("select");
