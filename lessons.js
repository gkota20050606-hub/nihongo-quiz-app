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
 * レッスンを絞り込む。番号は C:\Users\LENOVO\Downloads\文法項目整理.xlsx の
 * カリキュラム順（① 基本表現 1〜9 → ② 動詞・助詞 10〜22 → ③ 感情表現
 * 23〜30 → ④ 過去形・未来形・条件・理由 31〜35）に対応させている。
 *
 * summary: ホーム画面の「ようてん整理」に表示する、読むだけの
 * 要点リスト（クイズではない）。無ければそのボタンはグレーアウトする。
 *   summary: { points: ["...", "...", ...] }
 * ------------------------------------------------------------
 * 【仮の内容について】以下の5レッスンはカリキュラムの①最初の5項目を
 * ドラフトとして入れたもの。ユーザーが確認・修正する前提の仮データ。
 * ------------------------------------------------------------
 */

const LESSONS = [
  {
    id: "self_intro",
    order: 1,
    title: "① 自己紹介",
    questions: [
      {
        type: "reorder",
        words: ["わたしは", "たなかです"],
        translation: "I am Tanaka."
      },
      {
        type: "reorder",
        words: ["わたしは", "がくせいです"],
        translation: "I am a student."
      },
      {
        type: "reorder",
        words: ["わたしは", "じゅうはっさいです"],
        translation: "I am 18 years old."
      },
      {
        type: "vocab",
        prompt: "わたし",
        answer: "I",
        options: ["I", "name", "student", "teacher"]
      },
      {
        type: "vocab",
        prompt: "なまえ",
        answer: "name",
        options: ["name", "I", "student", "company employee"]
      },
      {
        type: "vocab",
        prompt: "がくせい",
        answer: "student",
        options: ["student", "teacher", "name", "company employee"]
      },
      {
        type: "vocab",
        prompt: "せんせい",
        answer: "teacher",
        options: ["teacher", "student", "I", "name"]
      },
      {
        type: "vocab",
        prompt: "かいしゃいん",
        answer: "company employee",
        options: ["company employee", "student", "teacher", "name"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "What is your name?",
          words: ["おなまえは", "なんですか"],
          answer: "おなまえは なんですか",
          reply: "たなかです。"
        },
        {
          english: "Are you a student?",
          words: ["あなたは", "がくせいですか"],
          answer: "あなたは がくせいですか",
          reply: "はい、がくせいです。"
        },
        {
          english: "How old are you?",
          answer: "なんさいですか",
          reply: "じゅうはっさいです。"
        },
        {
          english: "Is he a company employee?",
          answer: "かれは かいしゃいんですか",
          reply: "はい、かいしゃいんです。"
        }
      ]
    },
    summary: {
      points: [
        "自分のことを話すときは「わたしは○○です」の形を使う",
        "名前・職業・年齢もすべて「です」で表せる（わたしはがくせいです／じゅうはっさいです）",
        "相手に聞くときは「あなたは○○ですか」",
        "疑問文は文末に「か」をつけるだけでよい（語順は変えない）"
      ]
    }
  },
  {
    id: "likes_dislikes",
    order: 2,
    title: "② 好き嫌い",
    questions: [
      {
        type: "particle",
        before: "コーヒー",
        after: "すきです",
        answer: "が",
        options: ["が", "を", "に", "で"],
        translation: "I like coffee."
      },
      {
        type: "particle",
        before: "サッカー",
        after: "とくいです",
        answer: "が",
        options: ["が", "を", "に", "で"],
        translation: "I'm good at soccer."
      },
      {
        type: "particle",
        before: "うんてん",
        after: "にがてです",
        answer: "が",
        options: ["が", "に", "で", "を"],
        translation: "I'm not good at driving."
      },
      {
        type: "reorder",
        words: ["わたしは", "すしが", "すきです"],
        translation: "I like sushi."
      },
      {
        type: "reorder",
        words: ["わたしは", "なっとうが", "きらいです"],
        translation: "I dislike natto."
      },
      {
        type: "reorder",
        words: ["わたしは", "りょうりが", "とくいです"],
        translation: "I'm good at cooking."
      },
      {
        type: "vocab",
        prompt: "すき",
        answer: "like",
        options: ["like", "dislike", "good at", "not good at"]
      },
      {
        type: "vocab",
        prompt: "きらい",
        answer: "dislike",
        options: ["dislike", "like", "good at", "cooking"]
      },
      {
        type: "vocab",
        prompt: "とくい",
        answer: "good at",
        options: ["good at", "not good at", "like", "dislike"]
      },
      {
        type: "vocab",
        prompt: "にがて",
        answer: "not good at",
        options: ["not good at", "good at", "like", "cooking"]
      },
      {
        type: "vocab",
        prompt: "りょうり",
        answer: "cooking",
        options: ["cooking", "driving", "soccer", "coffee"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "What do you like?",
          words: ["なにが", "すきですか"],
          answer: "なにが すきですか",
          reply: "すしが すきです。"
        },
        {
          english: "Are you good at cooking?",
          words: ["りょうりが", "とくいですか"],
          answer: "りょうりが とくいですか",
          reply: "はい、とくいです。"
        },
        {
          english: "Do you dislike natto?",
          answer: "なっとうが きらいですか",
          reply: "いいえ、すきです。"
        },
        {
          english: "What are you not good at?",
          answer: "なにが にがてですか",
          reply: "うんてんが にがてです。"
        }
      ]
    },
    summary: {
      points: [
        "好き・嫌い・得意・苦手は「が」を使う（例：すしがすきです）",
        "英語のlikeは目的語をとるが、日本語は「を」ではなく「が」になる",
        "とくい＝得意（じょうずにできる）、にがて＝苦手（うまくできない）",
        "「なにがすきですか」で相手の好みを聞ける"
      ]
    }
  },
  {
    id: "impression_adjectives",
    order: 3,
    title: "③ 感想形容詞",
    questions: [
      {
        type: "reorder",
        words: ["それは", "おいしいです"],
        translation: "That is delicious."
      },
      {
        type: "reorder",
        words: ["これは", "たのしいです"],
        translation: "This is fun."
      },
      {
        type: "reorder",
        words: ["あれは", "きれいです"],
        translation: "That (over there) is pretty."
      },
      {
        type: "reorder",
        words: ["このみせは", "べんりです"],
        translation: "This shop is convenient."
      },
      {
        type: "vocab",
        prompt: "おいしい",
        answer: "delicious",
        options: ["delicious", "fun", "pretty", "convenient"]
      },
      {
        type: "vocab",
        prompt: "たのしい",
        answer: "fun",
        options: ["fun", "delicious", "expensive", "convenient"]
      },
      {
        type: "vocab",
        prompt: "きれい",
        answer: "pretty",
        options: ["pretty", "fun", "delicious", "expensive"]
      },
      {
        type: "vocab",
        prompt: "べんり",
        answer: "convenient",
        options: ["convenient", "pretty", "fun", "expensive"]
      },
      {
        type: "vocab",
        prompt: "たかい",
        answer: "expensive",
        options: ["expensive", "convenient", "delicious", "pretty"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "How is that?",
          words: ["それは", "どうですか"],
          answer: "それは どうですか",
          reply: "とても おいしいです。"
        },
        {
          english: "Is this fun?",
          words: ["これは", "たのしいですか"],
          answer: "これは たのしいですか",
          reply: "はい、たのしいです。"
        },
        {
          english: "Is that expensive?",
          answer: "それは たかいですか",
          reply: "はい、たかいです。"
        },
        {
          english: "Is this shop pretty?",
          answer: "このみせは きれいですか",
          reply: "はい、きれいです。"
        }
      ]
    },
    summary: {
      points: [
        "感想を言うときは「これ／それ／あれは○○です」の形",
        "これ＝話し手に近いもの、それ＝聞き手に近いもの、あれ＝どちらからも遠いもの",
        "形容詞（きれい、べんり等）がそのまま「です」の前につく",
        "疑問文は文末に「か」をつけるだけ"
      ]
    }
  },
  {
    id: "yes_no_questions",
    order: 4,
    title: "④ 疑問（Yes/No）",
    questions: [
      {
        type: "reorder",
        words: ["それは", "ほんですか"],
        translation: "Is that a book?"
      },
      {
        type: "reorder",
        words: ["これは", "かばんですか"],
        translation: "Is this a bag?"
      },
      {
        type: "reorder",
        words: ["あなたは", "がくせいですか"],
        translation: "Are you a student?"
      },
      {
        type: "vocab",
        prompt: "はい",
        answer: "yes",
        options: ["yes", "no", "that's right", "that's wrong"]
      },
      {
        type: "vocab",
        prompt: "いいえ",
        answer: "no",
        options: ["no", "yes", "that's right", "book"]
      },
      {
        type: "vocab",
        prompt: "そうです",
        answer: "that's right",
        options: ["that's right", "that's wrong", "yes", "book"]
      },
      {
        type: "vocab",
        prompt: "ちがいます",
        answer: "that's wrong",
        options: ["that's wrong", "that's right", "no", "bag"]
      },
      {
        type: "vocab",
        prompt: "ほん",
        answer: "book",
        options: ["book", "bag", "yes", "no"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Is this a book?",
          words: ["これは", "ほんですか"],
          answer: "これは ほんですか",
          reply: "はい、そうです。"
        },
        {
          english: "Are you a teacher?",
          words: ["あなたは", "せんせいですか"],
          answer: "あなたは せんせいですか",
          reply: "いいえ、ちがいます。"
        },
        {
          english: "Is that a bag?",
          answer: "それは かばんですか",
          reply: "はい、そうです。"
        },
        {
          english: "Is he a company employee?",
          answer: "かれは かいしゃいんですか",
          reply: "いいえ、ちがいます。"
        }
      ]
    },
    summary: {
      points: [
        "Yes/Noの質問は文末に「か」をつけるだけで作れる",
        "答えるときは「はい、そうです」「いいえ、ちがいます」が便利",
        "「そうです」＝その通り、「ちがいます」＝違う、という意味",
        "疑問文でも語順は変わらない（英語のように倒置しない）"
      ]
    }
  },
  {
    id: "negation",
    order: 5,
    title: "⑤ 否定",
    questions: [
      {
        type: "reorder",
        words: ["これは", "たかくないです"],
        translation: "This is not expensive."
      },
      {
        type: "reorder",
        words: ["きょうは", "さむくないです"],
        translation: "It is not cold today."
      },
      {
        type: "reorder",
        words: ["にほんごは", "むずかしくないです"],
        translation: "Japanese is not difficult."
      },
      {
        type: "vocab",
        prompt: "たかい",
        answer: "expensive",
        options: ["expensive", "cheap", "hot", "cold"]
      },
      {
        type: "vocab",
        prompt: "やすい",
        answer: "cheap",
        options: ["cheap", "expensive", "difficult", "cold"]
      },
      {
        type: "vocab",
        prompt: "あつい",
        answer: "hot",
        options: ["hot", "cold", "cheap", "difficult"]
      },
      {
        type: "vocab",
        prompt: "さむい",
        answer: "cold",
        options: ["cold", "hot", "expensive", "difficult"]
      },
      {
        type: "vocab",
        prompt: "むずかしい",
        answer: "difficult",
        options: ["difficult", "cheap", "hot", "cold"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "It is not cold today.",
          words: ["きょうは", "さむくないです"],
          answer: "きょうは さむくないです",
          reply: "はい、あついです。"
        },
        {
          english: "Japanese is not difficult.",
          words: ["にほんごは", "むずかしくないです"],
          answer: "にほんごは むずかしくないです",
          reply: "そうですね。"
        },
        {
          english: "This bag is not expensive.",
          answer: "このかばんは たかくないです",
          reply: "やすいですね。"
        },
        {
          english: "This book is not expensive.",
          answer: "このほんは たかくないです",
          reply: "はい、やすいです。"
        }
      ]
    },
    summary: {
      points: [
        "い形容詞を否定するときは「い」を「くない」に変える（たかい→たかくない）",
        "「たかくないです」は「高くありません」と同じ意味の丁寧な言い方",
        "な形容詞・名詞の否定は「じゃないです」（例：がくせいじゃないです）※これは次のレッスンで扱う",
        "「くない」の後ろに「です」をつけると丁寧になる"
      ]
    }
  }
];
