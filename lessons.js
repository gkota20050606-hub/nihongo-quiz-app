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
 * ------------------------------------------------------------
 */

const LESSONS = [
  {
    id: "ni_de_sample",
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
    ]
  }
];
