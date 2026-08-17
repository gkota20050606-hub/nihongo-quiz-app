/*
 * れんしゅう問題データ
 * ------------------------------------------------------------
 * 新しいレッスンを追加するときは、この配列 LESSONS に
 * 1つのレッスンオブジェクトを追加するだけでOK。
 *
 * 問題タイプ (type) は3種類:
 *
 * 1. "particle" 助詞を当てはめる（選択肢）
 *    { type: "particle", before: "がっこう", after: "いく",
 *      answer: "に", options: ["に","で","を","へ"],
 *      translation: "I go to school." }
 *    -> 文章は before + [空欄] + after の形で表示される。
 *       answer は options に必ず含めること。
 *
 * 2. "reorder" 単語カードを正しい順番に並べる
 *    { type: "reorder", words: ["がっこう","に","いく"],
 *      translation: "I go to school." }
 *    -> words の並び順が「正解の順番」。表示時はシャッフルされる。
 *
 * 3. "vocab" 単語の意味を当てる（選択肢）
 *    { type: "vocab", prompt: "がっこう", answer: "school",
 *      options: ["school","train","go","get up"] }
 *    -> answer は options に必ず含めること。
 *
 * questions とは別に、レッスンに "conversation" を追加すると
 * ホーム画面に「かいわテスト」が出る（無ければグレーアウト表示）:
 *
 *   conversation: {
 *     rounds: [
 *       { english: "What time do you get up?",
 *         words: ["なんじに", "おきますか"],   // あれば単語ならびかえ（前半用）
 *         answer: "なんじに おきますか",        // words が無ければ直接ひらがな入力（後半用）
 *         reply: "しちじに おきます。" },        // 答えた後に表示される返事（省略可）
 *       ...
 *     ]
 *   }
 *
 * ラウンドは配列の順番どおりに出題される（シャッフルしない）。
 * 前半のラウンドに words を付けて足場（スキャフォールド）を作り、
 * 後半は words を省略して自由入力にすると、だんだんヒントが減っていく
 * 構成になる。入力チェックは空白や句読点(。/？など)を無視した比較。
 *
 * order: そのレッスンが全体の何回目かを表す番号（1始まり）。
 * students.js の unlockedUpTo とこの番号を比べて、生徒に表示する
 * レッスンを絞り込む。
 *
 * summary: ホーム画面の「ようてん整理」に表示する、読むだけの
 * 要点リスト（クイズではない）。無ければそのボタンはグレーアウトする。
 *   summary: { points: ["...", "...", ...] }
 * ------------------------------------------------------------
 */

const LESSONS = [
  {
    id: "ni_de_sample",
    order: 1,
    title: "「に」と「で」のつかいかた",
    questions: [
      {
        type: "particle",
        before: "がっこう",
        after: "いく",
        answer: "に",
        options: ["に", "で", "を", "へ"],
        translation: "I go to school."
      },
      {
        type: "particle",
        before: "でんしゃ",
        after: "いく",
        answer: "で",
        options: ["で", "に", "を", "へ"],
        translation: "I go by train."
      },
      {
        type: "particle",
        before: "しちじ",
        after: "おきる",
        answer: "に",
        options: ["に", "で", "を", "から"],
        translation: "I get up at 7 o'clock."
      },
      {
        type: "reorder",
        words: ["がっこう", "に", "いく"],
        translation: "I go to school."
      },
      {
        type: "reorder",
        words: ["でんしゃ", "で", "いく"],
        translation: "I go by train."
      },
      {
        type: "reorder",
        words: ["しちじ", "に", "おきる"],
        translation: "I get up at 7 o'clock."
      },
      {
        type: "vocab",
        prompt: "がっこう",
        answer: "school",
        options: ["school", "train", "go", "get up"]
      },
      {
        type: "vocab",
        prompt: "でんしゃ",
        answer: "train",
        options: ["train", "school", "seven o'clock", "get up"]
      },
      {
        type: "vocab",
        prompt: "いく",
        answer: "go",
        options: ["go", "get up", "school", "train"]
      },
      {
        type: "vocab",
        prompt: "おきる",
        answer: "get up",
        options: ["get up", "go", "train", "school"]
      },
      {
        type: "vocab",
        prompt: "しちじ",
        answer: "seven o'clock",
        options: ["seven o'clock", "school", "train", "go"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "What time do you get up?",
          words: ["なんじに", "おきますか"],
          answer: "なんじに おきますか",
          reply: "しちじに おきます。"
        },
        {
          english: "What time do you go to school?",
          words: ["なんじに", "がっこうに", "いきますか"],
          answer: "なんじに がっこうに いきますか",
          reply: "はちじに いきます。"
        },
        {
          english: "Do you go to school by train?",
          answer: "でんしゃで がっこうに いきますか",
          reply: "はい、でんしゃで いきます。"
        },
        {
          english: "Do you get up at seven?",
          answer: "しちじに おきますか",
          reply: "はい、しちじに おきます。"
        }
      ]
    },
    summary: {
      points: [
        "「に」は場所の到達点・時間を表す：がっこうに いく／しちじに おきる",
        "「で」は手段・場所を表す：でんしゃで いく",
        "どちらも「いく・おきる」のような動作の前で使う助詞",
        "「に」＝行き先・時刻、「で」＝手段、と覚えると区別しやすい"
      ]
    }
  }
];
