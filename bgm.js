/*
 * レトロ風チップチューンBGM（Web Audio APIでその場で音を合成）
 * ------------------------------------------------------------
 * 音源ファイルを一切使わず、矩形波(リード)・三角波(ベース)だけで
 * ループ旋律を組み立てている。著作権の心配がなく、ファイルサイズも
 * 増えない。ブラウザの自動再生制限があるので、ユーザーが画面のどこか
 * を最初にタップ/クリックした瞬間に再生を開始する（script.js側で配線）。
 * ------------------------------------------------------------
 */

const ChiptuneBGM = (() => {
  let ctx = null;
  let masterGain = null;
  let isPlaying = false;
  let muted = localStorage.getItem("nihongo_quiz_bgm_muted") === "1";
  let nextNoteTime = 0;
  let currentStep = 0;
  let timerId = null;

  const TEMPO = 128; // BPM
  const STEP_DUR = 60 / TEMPO / 2; // 8分音符ぶんの秒数

  const NOTE = {
    A3: 220.0, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0,
    A4: 440.0, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
    rest: null,
  };

  // Aマイナーペンタトニック風のRPG風リード旋律（32ステップでループ）
  const LEAD = [
    "E4", "rest", "G4", "A4", "rest", "G4", "E4", "rest",
    "D4", "rest", "E4", "G4", "rest", "E4", "D4", "rest",
    "A4", "rest", "C5", "D5", "rest", "C5", "A4", "rest",
    "G4", "rest", "A4", "C5", "rest", "A4", "G4", "rest",
  ];

  const BASS = [
    "A3", "rest", "A3", "rest", "E4", "rest", "E4", "rest",
    "D4", "rest", "D4", "rest", "A3", "rest", "A3", "rest",
    "A3", "rest", "A3", "rest", "E4", "rest", "E4", "rest",
    "D4", "rest", "E4", "rest", "A3", "rest", "rest", "rest",
  ];

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = muted ? 0 : 0.16;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  function playNote(freq, time, dur, type, gainValue) {
    if (!freq) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainValue, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  function scheduler() {
    while (nextNoteTime < ctx.currentTime + 0.15) {
      playNote(NOTE[LEAD[currentStep % LEAD.length]], nextNoteTime, STEP_DUR * 0.9, "square", 0.08);
      playNote(NOTE[BASS[currentStep % BASS.length]], nextNoteTime, STEP_DUR * 0.9, "triangle", 0.12);
      nextNoteTime += STEP_DUR;
      currentStep++;
    }
    timerId = setTimeout(scheduler, 50);
  }

  function start() {
    if (!ensureContext() || isPlaying) return;
    isPlaying = true;
    nextNoteTime = ctx.currentTime + 0.05;
    currentStep = 0;
    scheduler();
  }

  // 画面から離れた／閉じたときに音を止める。スケジューラを完全に止めて
  // AudioContextもsuspendするので、ミュートと違って本当に鳴らなくなる。
  function pause() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    isPlaying = false;
    if (ctx && ctx.state === "running") ctx.suspend();
  }

  function resume() {
    if (muted || isPlaying) return;
    start();
  }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem("nihongo_quiz_bgm_muted", muted ? "1" : "0");
    if (masterGain && ctx) {
      masterGain.gain.setTargetAtTime(muted ? 0 : 0.16, ctx.currentTime, 0.05);
    }
    return muted;
  }

  function isMuted() {
    return muted;
  }

  // タブが非表示になった瞬間に止め、戻ってきたら（ミュートしていなければ）再開する。
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  });

  // タブを閉じる／リロードするときも確実に止める。
  window.addEventListener("pagehide", pause);

  return { start, toggleMute, isMuted };
})();
