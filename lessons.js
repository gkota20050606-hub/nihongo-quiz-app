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
    title: "Lesson 1: Self-Introduction",
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
      },
      {
        type: "vocab",
        prompt: "にほんじん",
        answer: "Japanese person",
        options: ["Japanese person", "American person", "Chinese person", "Korean person"]
      },
      {
        type: "vocab",
        prompt: "アメリカじん",
        answer: "American person",
        options: ["American person", "Japanese person", "Chinese person", "Korean person"]
      },
      {
        type: "vocab",
        prompt: "ちゅうごくじん",
        answer: "Chinese person",
        options: ["Chinese person", "Japanese person", "American person", "Korean person"]
      },
      {
        type: "vocab",
        prompt: "いしゃ",
        answer: "doctor",
        options: ["doctor", "teacher", "student", "company employee"]
      },
      {
        type: "vocab",
        prompt: "かいしゃ",
        answer: "company",
        options: ["company", "university", "school", "job"]
      },
      {
        type: "vocab",
        prompt: "だいがく",
        answer: "university",
        options: ["university", "high school", "company", "job"]
      },
      {
        type: "vocab",
        prompt: "だいがくせい",
        answer: "university student",
        options: ["university student", "high school student", "teacher", "doctor"]
      },
      {
        type: "vocab",
        prompt: "こうこうせい",
        answer: "high school student",
        options: ["high school student", "university student", "teacher", "student"]
      },
      {
        type: "vocab",
        prompt: "しごと",
        answer: "job",
        options: ["job", "name", "student", "company"]
      },
      {
        type: "vocab",
        prompt: "とし",
        answer: "year",
        options: ["year", "job", "university", "name"]
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
        "When talking about yourself, use the pattern “わたしは○○です” (I am ___).",
        "Names, occupations, and age can all be expressed with “です” (e.g. わたしはがくせいです “I am a student” / じゅうはっさいです “I am 18 years old”).",
        "To ask someone else, use “あなたは○○ですか” (Are you ___?).",
        "To make a question, just add “か” to the end of the sentence — the word order doesn't change."
      ]
    }
  },
  {
    id: "likes_dislikes",
    order: 2,
    title: "Lesson 2: Likes and Dislikes",
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
      },
      {
        type: "vocab",
        prompt: "おんがく",
        answer: "music",
        options: ["music", "movie", "sports", "song"]
      },
      {
        type: "vocab",
        prompt: "えいが",
        answer: "movie",
        options: ["movie", "music", "sports", "song"]
      },
      {
        type: "vocab",
        prompt: "スポーツ",
        answer: "sports",
        options: ["sports", "music", "movie", "dance"]
      },
      {
        type: "vocab",
        prompt: "うた",
        answer: "song",
        options: ["song", "music", "movie", "sports"]
      },
      {
        type: "vocab",
        prompt: "りょこう",
        answer: "travel",
        options: ["travel", "sports", "movie", "music"]
      },
      {
        type: "vocab",
        prompt: "どくしょ",
        answer: "reading",
        options: ["reading", "cooking", "driving", "travel"]
      },
      {
        type: "vocab",
        prompt: "うんてん",
        answer: "driving",
        options: ["driving", "cooking", "reading", "travel"]
      },
      {
        type: "vocab",
        prompt: "やきゅう",
        answer: "baseball",
        options: ["baseball", "tennis", "soccer", "sports"]
      },
      {
        type: "vocab",
        prompt: "テニス",
        answer: "tennis",
        options: ["tennis", "baseball", "soccer", "sports"]
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
        "Use “が” with すき (like), きらい (dislike), とくい (good at), and にがて (not good at) — e.g. すしがすきです “I like sushi.”",
        "In English, “like” takes a direct object, but in Japanese the particle is “が”, not “を”.",
        "とくい means “good at” (can do it well), and にがて means “not good at” (can't do it well).",
        "You can ask about someone's preferences with “なにがすきですか” (What do you like?)."
      ]
    }
  },
  {
    id: "impression_adjectives",
    order: 3,
    title: "Lesson 3: Describing Things (Adjectives)",
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
      },
      {
        type: "vocab",
        prompt: "やすい",
        answer: "cheap",
        options: ["cheap", "expensive", "delicious", "convenient"]
      },
      {
        type: "vocab",
        prompt: "おもしろい",
        answer: "interesting",
        options: ["interesting", "boring", "difficult", "simple"]
      },
      {
        type: "vocab",
        prompt: "つまらない",
        answer: "boring",
        options: ["boring", "interesting", "fun", "pretty"]
      },
      {
        type: "vocab",
        prompt: "あたらしい",
        answer: "new",
        options: ["new", "old", "spacious", "narrow"]
      },
      {
        type: "vocab",
        prompt: "ふるい",
        answer: "old",
        options: ["old", "new", "spacious", "narrow"]
      },
      {
        type: "vocab",
        prompt: "にぎやか",
        answer: "lively",
        options: ["lively", "quiet", "boring", "simple"]
      },
      {
        type: "vocab",
        prompt: "ひろい",
        answer: "spacious",
        options: ["spacious", "narrow", "new", "old"]
      },
      {
        type: "vocab",
        prompt: "せまい",
        answer: "narrow",
        options: ["narrow", "spacious", "new", "old"]
      },
      {
        type: "vocab",
        prompt: "かんたん",
        answer: "simple",
        options: ["simple", "difficult", "interesting", "boring"]
      },
      {
        type: "vocab",
        prompt: "むずかしい",
        answer: "difficult",
        options: ["difficult", "simple", "interesting", "boring"]
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
        "To give an impression or opinion, use the pattern “これ／それ／あれは○○です” (This/That/That over there is ___).",
        "これ = something close to the speaker, それ = something close to the listener, あれ = something far from both.",
        "Adjectives (like きれい “pretty” or べんり “convenient”) go directly before “です”.",
        "To make a question, just add “か” to the end of the sentence."
      ]
    }
  },
  {
    id: "yes_no_questions",
    order: 4,
    title: "Lesson 4: Yes/No Questions",
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
      },
      {
        type: "vocab",
        prompt: "かばん",
        answer: "bag",
        options: ["bag", "book", "notebook", "pen"]
      },
      {
        type: "vocab",
        prompt: "ノート",
        answer: "notebook",
        options: ["notebook", "book", "pen", "newspaper"]
      },
      {
        type: "vocab",
        prompt: "ペン",
        answer: "pen",
        options: ["pen", "notebook", "bag", "umbrella"]
      },
      {
        type: "vocab",
        prompt: "とけい",
        answer: "clock",
        options: ["clock", "umbrella", "wallet", "magazine"]
      },
      {
        type: "vocab",
        prompt: "かさ",
        answer: "umbrella",
        options: ["umbrella", "clock", "wallet", "pen"]
      },
      {
        type: "vocab",
        prompt: "さいふ",
        answer: "wallet",
        options: ["wallet", "umbrella", "clock", "bag"]
      },
      {
        type: "vocab",
        prompt: "しんぶん",
        answer: "newspaper",
        options: ["newspaper", "magazine", "book", "notebook"]
      },
      {
        type: "vocab",
        prompt: "ざっし",
        answer: "magazine",
        options: ["magazine", "newspaper", "book", "notebook"]
      },
      {
        type: "vocab",
        prompt: "つくえ",
        answer: "desk",
        options: ["desk", "chair", "bag", "clock"]
      },
      {
        type: "vocab",
        prompt: "いす",
        answer: "chair",
        options: ["chair", "desk", "bag", "clock"]
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
        "You can make a yes/no question just by adding “か” to the end of the sentence.",
        "When answering, “はい、そうです” (Yes, that's right) and “いいえ、ちがいます” (No, that's wrong) are handy.",
        "“そうです” means “that's right,” and “ちがいます” means “that's not right / that's different.”",
        "Word order doesn't change in questions either — unlike English, there's no inversion."
      ]
    }
  },
  {
    id: "negation",
    order: 5,
    title: "Lesson 5: Negation",
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
      },
      {
        type: "vocab",
        prompt: "あたたかい",
        answer: "warm",
        options: ["warm", "cool", "hot", "cold"]
      },
      {
        type: "vocab",
        prompt: "すずしい",
        answer: "cool",
        options: ["cool", "warm", "hot", "cold"]
      },
      {
        type: "vocab",
        prompt: "やさしい",
        answer: "easy",
        options: ["easy", "difficult", "busy", "strong"]
      },
      {
        type: "vocab",
        prompt: "いそがしい",
        answer: "busy",
        options: ["busy", "easy", "fast", "slow"]
      },
      {
        type: "vocab",
        prompt: "はやい",
        answer: "fast",
        options: ["fast", "slow", "busy", "strong"]
      },
      {
        type: "vocab",
        prompt: "おそい",
        answer: "slow",
        options: ["slow", "fast", "busy", "weak"]
      },
      {
        type: "vocab",
        prompt: "つよい",
        answer: "strong",
        options: ["strong", "weak", "fast", "slow"]
      },
      {
        type: "vocab",
        prompt: "よわい",
        answer: "weak",
        options: ["weak", "strong", "fast", "slow"]
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
        "To make an i-adjective negative, change the final “い” to “くない” (たかい → たかくない, “expensive” → “not expensive”).",
        "“たかくないです” is a polite way of saying the same thing as “高くありません” (is not expensive).",
        "Na-adjectives and nouns are negated with “じゃないです” (e.g. がくせいじゃないです “is not a student”) — this will be covered in the next lesson.",
        "Adding “です” after “くない” makes it polite."
      ]
    }
  },
  {
    id: "third_person",
    order: 6,
    title: "Lesson 6: Statements, Questions & Negation (Third Person)",
    questions: [
      {
        type: "reorder",
        words: ["かれは", "がくせいです"],
        translation: "He is a student."
      },
      {
        type: "reorder",
        words: ["かのじょは", "せんせいですか"],
        translation: "Is she a teacher?"
      },
      {
        type: "reorder",
        words: ["かれは", "がくせいじゃないです"],
        translation: "He is not a student."
      },
      {
        type: "vocab",
        prompt: "かれ",
        answer: "he",
        options: ["he", "she", "they", "everyone"]
      },
      {
        type: "vocab",
        prompt: "かのじょ",
        answer: "she",
        options: ["she", "he", "they", "two people"]
      },
      {
        type: "vocab",
        prompt: "かれら",
        answer: "they",
        options: ["they", "he", "she", "everyone"]
      },
      {
        type: "vocab",
        prompt: "ふたり",
        answer: "two people",
        options: ["two people", "everyone", "he", "she"]
      },
      {
        type: "vocab",
        prompt: "みんな",
        answer: "everyone",
        options: ["everyone", "two people", "they", "he"]
      },
      {
        type: "vocab",
        prompt: "ともだち",
        answer: "friend",
        options: ["friend", "family", "adult", "child"]
      },
      {
        type: "vocab",
        prompt: "かぞく",
        answer: "family",
        options: ["family", "friend", "adult", "child"]
      },
      {
        type: "vocab",
        prompt: "おとこのひと",
        answer: "man",
        options: ["man", "woman", "boy", "girl"]
      },
      {
        type: "vocab",
        prompt: "おんなのひと",
        answer: "woman",
        options: ["woman", "man", "boy", "girl"]
      },
      {
        type: "vocab",
        prompt: "こども",
        answer: "child",
        options: ["child", "adult", "friend", "family"]
      },
      {
        type: "vocab",
        prompt: "わたしたち",
        answer: "we",
        options: ["we", "they", "you all", "everyone"]
      },
      {
        type: "vocab",
        prompt: "あなたたち",
        answer: "you all",
        options: ["you all", "we", "they", "everyone"]
      },
      {
        type: "vocab",
        prompt: "おとな",
        answer: "adult",
        options: ["adult", "child", "friend", "family"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Is he a student?",
          words: ["かれは", "がくせいですか"],
          answer: "かれは がくせいですか",
          reply: "はい、そうです。"
        },
        {
          english: "Is she a teacher?",
          words: ["かのじょは", "せんせいですか"],
          answer: "かのじょは せんせいですか",
          reply: "いいえ、ちがいます。"
        },
        {
          english: "He is not a company employee.",
          answer: "かれは かいしゃいんじゃないです",
          reply: "そうですね。"
        },
        {
          english: "Are they students?",
          answer: "かれらは がくせいですか",
          reply: "はい、そうです。"
        }
      ]
    },
    summary: {
      points: [
        "The grammar with “です” is the same even for third person (かれ “he,” かのじょ “she,” かれら “they”).",
        "Na-adjectives and nouns are negated with “じゃないです” (がくせいじゃないです “is not a student”).",
        "Use “くないです” to negate i-adjectives and “じゃないです” to negate nouns — the two are different.",
        "Here too, you make a question just by adding “か” to the end of the sentence."
      ]
    }
  },
  {
    id: "question_words",
    order: 7,
    title: "Lesson 7: Question Words",
    questions: [
      {
        type: "particle",
        before: "なに",
        after: "すきですか",
        answer: "が",
        options: ["が", "を", "に", "で"],
        translation: "What do you like?"
      },
      {
        type: "reorder",
        words: ["それは", "なんですか"],
        translation: "What is that?"
      },
      {
        type: "reorder",
        words: ["かれは", "だれですか"],
        translation: "Who is he?"
      },
      {
        type: "reorder",
        words: ["がっこうは", "どこですか"],
        translation: "Where is the school?"
      },
      {
        type: "vocab",
        prompt: "なに",
        answer: "what",
        options: ["what", "who", "where", "when"]
      },
      {
        type: "vocab",
        prompt: "だれ",
        answer: "who",
        options: ["who", "what", "where", "which one"]
      },
      {
        type: "vocab",
        prompt: "どこ",
        answer: "where",
        options: ["where", "who", "when", "what"]
      },
      {
        type: "vocab",
        prompt: "いつ",
        answer: "when",
        options: ["when", "where", "who", "which one"]
      },
      {
        type: "vocab",
        prompt: "どれ",
        answer: "which one",
        options: ["which one", "when", "where", "what"]
      },
      {
        type: "vocab",
        prompt: "どうして",
        answer: "why",
        options: ["why", "how", "which", "what kind of"]
      },
      {
        type: "vocab",
        prompt: "どう",
        answer: "how",
        options: ["how", "why", "which", "what kind of"]
      },
      {
        type: "vocab",
        prompt: "どの",
        answer: "which",
        options: ["which", "how", "why", "how many"]
      },
      {
        type: "vocab",
        prompt: "どちら",
        answer: "which one",
        options: ["which one", "how", "why", "what kind of"]
      },
      {
        type: "vocab",
        prompt: "いくつ",
        answer: "how many",
        options: ["how many", "how much", "which", "why"]
      },
      {
        type: "vocab",
        prompt: "どんな",
        answer: "what kind of",
        options: ["what kind of", "why", "how", "which"]
      },
      {
        type: "vocab",
        prompt: "なんにん",
        answer: "how many people",
        options: ["how many people", "how many", "who", "which"]
      },
      {
        type: "vocab",
        prompt: "いくら",
        answer: "how much",
        options: ["how much", "how many", "which", "why"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "What is this?",
          words: ["これは", "なんですか"],
          answer: "これは なんですか",
          reply: "ほんです。"
        },
        {
          english: "Where is the school?",
          words: ["がっこうは", "どこですか"],
          answer: "がっこうは どこですか",
          reply: "あそこです。"
        },
        {
          english: "Who is he?",
          answer: "かれは だれですか",
          reply: "せんせいです。"
        },
        {
          english: "When is the test?",
          answer: "テストは いつですか",
          reply: "あしたです。"
        }
      ]
    },
    summary: {
      points: [
        "Question words like なに (what), だれ (who), どこ (where), and いつ (when) let you ask more detailed questions.",
        "Even when using a question word, you still need “か” at the end of the sentence.",
        "Put the question word where the information you're asking about would go (それは［なに］ですか “What is that?”).",
        "Use “だれ” for people, “なに” for things, “どこ” for places, and “いつ” for times."
      ]
    }
  },
  {
    id: "time_weekday",
    order: 8,
    title: "Lesson 8: Time & Days of the Week",
    questions: [
      {
        type: "particle",
        before: "しちじ",
        after: "おきます",
        answer: "に",
        options: ["に", "で", "を", "へ"],
        translation: "I get up at 7."
      },
      {
        type: "reorder",
        words: ["いまは", "なんじですか"],
        translation: "What time is it now?"
      },
      {
        type: "reorder",
        words: ["きょうは", "なんようびですか"],
        translation: "What day is today?"
      },
      {
        type: "reorder",
        words: ["あしたは", "げつようびです"],
        translation: "Tomorrow is Monday."
      },
      {
        type: "vocab",
        prompt: "いま",
        answer: "now",
        options: ["now", "today", "tomorrow", "what time"]
      },
      {
        type: "vocab",
        prompt: "きょう",
        answer: "today",
        options: ["today", "now", "tomorrow", "what day"]
      },
      {
        type: "vocab",
        prompt: "あした",
        answer: "tomorrow",
        options: ["tomorrow", "today", "now", "what time"]
      },
      {
        type: "vocab",
        prompt: "なんじ",
        answer: "what time",
        options: ["what time", "what day", "now", "today"]
      },
      {
        type: "vocab",
        prompt: "なんようび",
        answer: "what day of the week",
        options: ["what day of the week", "what time", "tomorrow", "now"]
      },
      {
        type: "vocab",
        prompt: "げつようび",
        answer: "Monday",
        options: ["Monday", "Tuesday", "Wednesday", "Sunday"]
      },
      {
        type: "vocab",
        prompt: "かようび",
        answer: "Tuesday",
        options: ["Tuesday", "Monday", "Wednesday", "Thursday"]
      },
      {
        type: "vocab",
        prompt: "すいようび",
        answer: "Wednesday",
        options: ["Wednesday", "Tuesday", "Thursday", "Friday"]
      },
      {
        type: "vocab",
        prompt: "もくようび",
        answer: "Thursday",
        options: ["Thursday", "Wednesday", "Friday", "Saturday"]
      },
      {
        type: "vocab",
        prompt: "きんようび",
        answer: "Friday",
        options: ["Friday", "Thursday", "Saturday", "Sunday"]
      },
      {
        type: "vocab",
        prompt: "どようび",
        answer: "Saturday",
        options: ["Saturday", "Friday", "Sunday", "Monday"]
      },
      {
        type: "vocab",
        prompt: "にちようび",
        answer: "Sunday",
        options: ["Sunday", "Saturday", "Monday", "Tuesday"]
      },
      {
        type: "vocab",
        prompt: "きのう",
        answer: "yesterday",
        options: ["yesterday", "today", "tomorrow", "every day"]
      },
      {
        type: "vocab",
        prompt: "まいにち",
        answer: "every day",
        options: ["every day", "yesterday", "today", "tomorrow"]
      },
      {
        type: "vocab",
        prompt: "ごぜん",
        answer: "morning (AM)",
        options: ["morning (AM)", "afternoon (PM)", "yesterday", "tomorrow"]
      },
      {
        type: "vocab",
        prompt: "ごご",
        answer: "afternoon (PM)",
        options: ["afternoon (PM)", "morning (AM)", "yesterday", "tomorrow"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "What time is it now?",
          words: ["いまは", "なんじですか"],
          answer: "いまは なんじですか",
          reply: "しちじです。"
        },
        {
          english: "What day is today?",
          words: ["きょうは", "なんようびですか"],
          answer: "きょうは なんようびですか",
          reply: "げつようびです。"
        },
        {
          english: "What time do you get up?",
          answer: "なんじに おきますか",
          reply: "しちじに おきます。"
        },
        {
          english: "Is tomorrow Sunday?",
          answer: "あしたは にちようびですか",
          reply: "いいえ、ちがいます。"
        }
      ]
    },
    summary: {
      points: [
        "To ask the time, say “いまなんじですか” (What time is it now?).",
        "To ask the day of the week, say “きょうはなんようびですか” (What day is today?).",
        "Use the particle “に” with clock times (しちじにおきます “I get up at 7 o'clock”).",
        "It's handy to memorize the days of the week (げつようび Monday through にちようび Sunday)."
      ]
    }
  },
  {
    id: "prices",
    order: 9,
    title: "Lesson 9: Prices",
    questions: [
      {
        type: "particle",
        before: "ぜんぶ",
        after: "せんえんです",
        answer: "で",
        options: ["で", "に", "を", "が"],
        translation: "It's 1000 yen in total."
      },
      {
        type: "reorder",
        words: ["これは", "いくらですか"],
        translation: "How much is this?"
      },
      {
        type: "reorder",
        words: ["これは", "ひゃくえんです"],
        translation: "This is 100 yen."
      },
      {
        type: "reorder",
        words: ["ぜんぶで", "せんえんです"],
        translation: "It's 1000 yen in total."
      },
      {
        type: "vocab",
        prompt: "いくら",
        answer: "how much",
        options: ["how much", "yen", "cheap", "expensive"]
      },
      {
        type: "vocab",
        prompt: "えん",
        answer: "yen",
        options: ["yen", "how much", "cheap", "in total"]
      },
      {
        type: "vocab",
        prompt: "やすい",
        answer: "cheap",
        options: ["cheap", "expensive", "how much", "yen"]
      },
      {
        type: "vocab",
        prompt: "たかい",
        answer: "expensive",
        options: ["expensive", "cheap", "yen", "in total"]
      },
      {
        type: "vocab",
        prompt: "ぜんぶで",
        answer: "in total",
        options: ["in total", "how much", "cheap", "yen"]
      },
      {
        type: "vocab",
        prompt: "おかね",
        answer: "money",
        options: ["money", "shop", "card", "cash"]
      },
      {
        type: "vocab",
        prompt: "みせ",
        answer: "shop",
        options: ["shop", "money", "card", "receipt"]
      },
      {
        type: "vocab",
        prompt: "カード",
        answer: "card",
        options: ["card", "cash", "money", "receipt"]
      },
      {
        type: "vocab",
        prompt: "げんきん",
        answer: "cash",
        options: ["cash", "card", "money", "receipt"]
      },
      {
        type: "vocab",
        prompt: "レシート",
        answer: "receipt",
        options: ["receipt", "card", "cash", "money"]
      },
      {
        type: "vocab",
        prompt: "ひゃく",
        answer: "hundred",
        options: ["hundred", "thousand", "ten thousand", "yen"]
      },
      {
        type: "vocab",
        prompt: "せん",
        answer: "thousand",
        options: ["thousand", "hundred", "ten thousand", "yen"]
      },
      {
        type: "vocab",
        prompt: "まん",
        answer: "ten thousand",
        options: ["ten thousand", "thousand", "hundred", "yen"]
      },
      {
        type: "vocab",
        prompt: "むりょう",
        answer: "free of charge",
        options: ["free of charge", "expensive", "cheap", "in total"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "How much is this?",
          words: ["これは", "いくらですか"],
          answer: "これは いくらですか",
          reply: "ひゃくえんです。"
        },
        {
          english: "Is this expensive?",
          words: ["これは", "たかいですか"],
          answer: "これは たかいですか",
          reply: "いいえ、やすいです。"
        },
        {
          english: "How much is that bag?",
          answer: "そのかばんは いくらですか",
          reply: "さんぜんえんです。"
        },
        {
          english: "How much is it in total?",
          answer: "ぜんぶで いくらですか",
          reply: "ごせんえんです。"
        }
      ]
    },
    summary: {
      points: [
        "To ask a price, say “これはいくらですか” (How much is this?).",
        "The unit of currency is “えん” (yen).",
        "“ぜんぶで” (in total) is used when asking or stating a total amount.",
        "You can also comment on a price with “たかい” (expensive) or “やすい” (cheap)."
      ]
    }
  },
  {
    id: "basic_particles",
    order: 10,
    title: "Lesson 10: Particles (を・が・は・で・に)",
    questions: [
      {
        type: "particle",
        before: "ごはん",
        after: "たべます",
        answer: "を",
        options: ["を", "に", "で", "と"],
        translation: "I eat rice."
      },
      {
        type: "particle",
        before: "がっこう",
        after: "いきます",
        answer: "に",
        options: ["に", "を", "で", "と"],
        translation: "I go to school."
      },
      {
        type: "particle",
        before: "いえ",
        after: "べんきょうします",
        answer: "で",
        options: ["で", "に", "を", "と"],
        translation: "I study at home."
      },
      {
        type: "particle",
        before: "ともだち",
        after: "はなします",
        answer: "と",
        options: ["と", "に", "で", "を"],
        translation: "I talk with a friend."
      },
      {
        type: "reorder",
        words: ["ほんを", "よみます"],
        translation: "I read a book."
      },
      {
        type: "reorder",
        words: ["でんしゃで", "いきます"],
        translation: "I go by train."
      },
      {
        type: "reorder",
        words: ["ともだちに", "あいます"],
        translation: "I meet a friend."
      },
      {
        type: "vocab",
        prompt: "たべます",
        answer: "eat",
        options: ["eat", "read", "buy", "talk"]
      },
      {
        type: "vocab",
        prompt: "よみます",
        answer: "read",
        options: ["read", "eat", "meet", "buy"]
      },
      {
        type: "vocab",
        prompt: "かいます",
        answer: "buy",
        options: ["buy", "eat", "read", "meet"]
      },
      {
        type: "vocab",
        prompt: "あいます",
        answer: "meet",
        options: ["meet", "buy", "talk", "eat"]
      },
      {
        type: "vocab",
        prompt: "はなします",
        answer: "talk",
        options: ["talk", "meet", "read", "buy"]
      },
      {
        type: "vocab",
        prompt: "みます",
        answer: "see",
        options: ["see", "listen", "write", "drink"]
      },
      {
        type: "vocab",
        prompt: "ききます",
        answer: "listen",
        options: ["listen", "see", "write", "drink"]
      },
      {
        type: "vocab",
        prompt: "かきます",
        answer: "write",
        options: ["write", "see", "listen", "read"]
      },
      {
        type: "vocab",
        prompt: "のみます",
        answer: "drink",
        options: ["drink", "eat", "see", "listen"]
      },
      {
        type: "vocab",
        prompt: "いきます",
        answer: "go",
        options: ["go", "return", "do", "sleep"]
      },
      {
        type: "vocab",
        prompt: "します",
        answer: "do",
        options: ["do", "go", "sleep", "get up"]
      },
      {
        type: "vocab",
        prompt: "ねます",
        answer: "sleep",
        options: ["sleep", "get up", "do", "go"]
      },
      {
        type: "vocab",
        prompt: "おきます",
        answer: "get up",
        options: ["get up", "sleep", "do", "return"]
      },
      {
        type: "vocab",
        prompt: "かえります",
        answer: "return",
        options: ["return", "go", "get up", "sleep"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "What do you eat?",
          words: ["なにを", "たべますか"],
          answer: "なにを たべますか",
          reply: "ごはんを たべます。"
        },
        {
          english: "Who do you talk with?",
          words: ["だれと", "はなしますか"],
          answer: "だれと はなしますか",
          reply: "ともだちと はなします。"
        },
        {
          english: "What do you read?",
          answer: "なにを よみますか",
          reply: "ほんを よみます。"
        },
        {
          english: "Do you meet a friend?",
          answer: "ともだちに あいますか",
          reply: "はい、あいます。"
        }
      ]
    },
    summary: {
      points: [
        "“を” marks the direct object of an action (ごはんをたべる “eat rice”).",
        "“に” marks a destination or the person you interact with (がっこうにいく “go to school,” ともだちにあう “meet a friend”).",
        "“で” marks a location of action or a means (いえでべんきょうする “study at home,” でんしゃでいく “go by train”).",
        "“と” marks the person you do something together with (ともだちとはなす “talk with a friend”)."
      ]
    }
  },
  {
    id: "existence_things",
    order: 11,
    title: "Lesson 11: Existence (Things)",
    questions: [
      {
        type: "particle",
        before: "いす",
        after: "あります",
        answer: "が",
        options: ["が", "に", "を", "で"],
        translation: "There is a chair."
      },
      {
        type: "particle",
        before: "はこのなか",
        after: "ペンがあります",
        answer: "に",
        options: ["に", "で", "が", "を"],
        translation: "There is a pen inside the box."
      },
      {
        type: "reorder",
        words: ["つくえの", "うえに", "ほんが", "あります"],
        translation: "There is a book on the desk."
      },
      {
        type: "reorder",
        words: ["はこの", "なかに", "ペンが", "あります"],
        translation: "There is a pen inside the box."
      },
      {
        type: "reorder",
        words: ["いすが", "あります"],
        translation: "There is a chair."
      },
      {
        type: "vocab",
        prompt: "つくえ",
        answer: "desk",
        options: ["desk", "chair", "box", "on top of"]
      },
      {
        type: "vocab",
        prompt: "いす",
        answer: "chair",
        options: ["chair", "desk", "box", "inside"]
      },
      {
        type: "vocab",
        prompt: "はこ",
        answer: "box",
        options: ["box", "desk", "chair", "on top of"]
      },
      {
        type: "vocab",
        prompt: "うえ",
        answer: "on top of",
        options: ["on top of", "inside", "box", "desk"]
      },
      {
        type: "vocab",
        prompt: "なか",
        answer: "inside",
        options: ["inside", "on top of", "box", "chair"]
      },
      {
        type: "vocab",
        prompt: "した",
        answer: "under",
        options: ["under", "on top of", "next to", "behind"]
      },
      {
        type: "vocab",
        prompt: "よこ",
        answer: "next to",
        options: ["next to", "under", "in front of", "behind"]
      },
      {
        type: "vocab",
        prompt: "まえ",
        answer: "in front of",
        options: ["in front of", "behind", "under", "next to"]
      },
      {
        type: "vocab",
        prompt: "うしろ",
        answer: "behind",
        options: ["behind", "in front of", "under", "next to"]
      },
      {
        type: "vocab",
        prompt: "ちかく",
        answer: "near",
        options: ["near", "between", "behind", "under"]
      },
      {
        type: "vocab",
        prompt: "あいだ",
        answer: "between",
        options: ["between", "near", "in front of", "behind"]
      },
      {
        type: "vocab",
        prompt: "まど",
        answer: "window",
        options: ["window", "door", "table", "bookshelf"]
      },
      {
        type: "vocab",
        prompt: "ドア",
        answer: "door",
        options: ["door", "window", "table", "bookshelf"]
      },
      {
        type: "vocab",
        prompt: "テーブル",
        answer: "table",
        options: ["table", "bookshelf", "window", "door"]
      },
      {
        type: "vocab",
        prompt: "ほんだな",
        answer: "bookshelf",
        options: ["bookshelf", "table", "window", "door"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Is there a book on the desk?",
          words: ["つくえのうえに", "ほんが", "ありますか"],
          answer: "つくえのうえに ほんが ありますか",
          reply: "はい、あります。"
        },
        {
          english: "What is inside the box?",
          words: ["はこのなかに", "なにが", "ありますか"],
          answer: "はこのなかに なにが ありますか",
          reply: "ペンが あります。"
        },
        {
          english: "Is there a chair?",
          answer: "いすが ありますか",
          reply: "はい、あります。"
        },
        {
          english: "Is there a bag on the desk?",
          answer: "つくえのうえに かばんが ありますか",
          reply: "いいえ、ありません。"
        }
      ]
    },
    summary: {
      points: [
        "The existence of things is expressed with “～があります” (there is/are ___).",
        "Location is shown with “～に” (つくえのうえに “on the desk,” はこのなかに “inside the box”).",
        "This is often combined with position words like “うえ” (on top of) and “なか” (inside).",
        "The negative form is “ありません” (there isn't/aren't)."
      ]
    }
  },
  {
    id: "existence_beings",
    order: 12,
    title: "Lesson 12: Existence (People & Animals)",
    questions: [
      {
        type: "particle",
        before: "こうえん",
        after: "いぬがいます",
        answer: "に",
        options: ["に", "で", "が", "を"],
        translation: "There is a dog in the park."
      },
      {
        type: "particle",
        before: "いぬ",
        after: "います",
        answer: "が",
        options: ["が", "に", "を", "で"],
        translation: "There is a dog."
      },
      {
        type: "reorder",
        words: ["いえに", "ねこが", "います"],
        translation: "There is a cat at home."
      },
      {
        type: "reorder",
        words: ["こうえんに", "いぬが", "います"],
        translation: "There is a dog in the park."
      },
      {
        type: "reorder",
        words: ["がっこうに", "こどもが", "います"],
        translation: "There are children at school."
      },
      {
        type: "vocab",
        prompt: "ねこ",
        answer: "cat",
        options: ["cat", "dog", "bird", "child"]
      },
      {
        type: "vocab",
        prompt: "いぬ",
        answer: "dog",
        options: ["dog", "cat", "bird", "family"]
      },
      {
        type: "vocab",
        prompt: "とり",
        answer: "bird",
        options: ["bird", "dog", "cat", "child"]
      },
      {
        type: "vocab",
        prompt: "こども",
        answer: "child",
        options: ["child", "family", "bird", "cat"]
      },
      {
        type: "vocab",
        prompt: "かぞく",
        answer: "family",
        options: ["family", "child", "dog", "cat"]
      },
      {
        type: "vocab",
        prompt: "うま",
        answer: "horse",
        options: ["horse", "rabbit", "insect", "fish"]
      },
      {
        type: "vocab",
        prompt: "うさぎ",
        answer: "rabbit",
        options: ["rabbit", "horse", "insect", "fish"]
      },
      {
        type: "vocab",
        prompt: "むし",
        answer: "insect",
        options: ["insect", "horse", "rabbit", "fish"]
      },
      {
        type: "vocab",
        prompt: "さかな",
        answer: "fish",
        options: ["fish", "insect", "horse", "rabbit"]
      },
      {
        type: "vocab",
        prompt: "あかちゃん",
        answer: "baby",
        options: ["baby", "child", "boy", "girl"]
      },
      {
        type: "vocab",
        prompt: "おとこのこ",
        answer: "boy",
        options: ["boy", "girl", "baby", "child"]
      },
      {
        type: "vocab",
        prompt: "おんなのこ",
        answer: "girl",
        options: ["girl", "boy", "baby", "child"]
      },
      {
        type: "vocab",
        prompt: "ペット",
        answer: "pet",
        options: ["pet", "family", "child", "insect"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Is there a cat at home?",
          words: ["いえに", "ねこが", "いますか"],
          answer: "いえに ねこが いますか",
          reply: "はい、います。"
        },
        {
          english: "Who is in the family?",
          words: ["かぞくに", "だれが", "いますか"],
          answer: "かぞくに だれが いますか",
          reply: "こどもが います。"
        },
        {
          english: "Is there a dog in the park?",
          answer: "こうえんに いぬが いますか",
          reply: "はい、います。"
        },
        {
          english: "Are there children at school?",
          answer: "がっこうに こどもが いますか",
          reply: "はい、います。"
        }
      ]
    },
    summary: {
      points: [
        "The existence of people and living creatures is expressed with “～がいます” (things use “あります” instead).",
        "Location is shown with “～に” (いえに “at home,” こうえんに “in the park”).",
        "It helps to remember: “あります” = things, “います” = people/living creatures.",
        "You can ask who's there with the question “だれがいますか” (Who is there?)."
      ]
    }
  },
  {
    id: "adjective_modifier",
    order: 13,
    title: "Lesson 13: Adjectives Modifying Nouns",
    questions: [
      {
        type: "reorder",
        words: ["これは", "たかい", "ほんです"],
        translation: "This is an expensive book."
      },
      {
        type: "reorder",
        words: ["あれは", "しずかな", "へやです"],
        translation: "That is a quiet room."
      },
      {
        type: "reorder",
        words: ["それは", "おおきい", "かばんです"],
        translation: "That is a big bag."
      },
      {
        type: "vocab",
        prompt: "おおきい",
        answer: "big",
        options: ["big", "small", "quiet", "room"]
      },
      {
        type: "vocab",
        prompt: "ちいさい",
        answer: "small",
        options: ["small", "big", "quiet", "person"]
      },
      {
        type: "vocab",
        prompt: "しずか",
        answer: "quiet",
        options: ["quiet", "big", "small", "room"]
      },
      {
        type: "vocab",
        prompt: "へや",
        answer: "room",
        options: ["room", "person", "big", "quiet"]
      },
      {
        type: "vocab",
        prompt: "ひと",
        answer: "person",
        options: ["person", "room", "small", "big"]
      },
      {
        type: "vocab",
        prompt: "いい",
        answer: "good",
        options: ["good", "bad", "long", "short"]
      },
      {
        type: "vocab",
        prompt: "わるい",
        answer: "bad",
        options: ["bad", "good", "long", "short"]
      },
      {
        type: "vocab",
        prompt: "ながい",
        answer: "long",
        options: ["long", "short", "bright", "dark"]
      },
      {
        type: "vocab",
        prompt: "みじかい",
        answer: "short",
        options: ["short", "long", "bright", "dark"]
      },
      {
        type: "vocab",
        prompt: "あかるい",
        answer: "bright",
        options: ["bright", "dark", "long", "short"]
      },
      {
        type: "vocab",
        prompt: "くらい",
        answer: "dark",
        options: ["dark", "bright", "long", "short"]
      },
      {
        type: "vocab",
        prompt: "しんせつ",
        answer: "kind",
        options: ["kind", "energetic", "quiet", "bad"]
      },
      {
        type: "vocab",
        prompt: "げんき",
        answer: "energetic",
        options: ["energetic", "kind", "quiet", "bad"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "This is an expensive book.",
          words: ["これは", "たかい", "ほんです"],
          answer: "これは たかい ほんです",
          reply: "そうですね。"
        },
        {
          english: "That is a quiet room.",
          words: ["あれは", "しずかな", "へやです"],
          answer: "あれは しずかな へやです",
          reply: "はい、しずかです。"
        },
        {
          english: "Is this a big bag?",
          answer: "これは おおきい かばんですか",
          reply: "いいえ、ちいさいです。"
        },
        {
          english: "Is he a quiet person?",
          answer: "かれは しずかな ひとですか",
          reply: "はい、そうです。"
        }
      ]
    },
    summary: {
      points: [
        "I-adjectives can go directly before a noun as they are (たかいほん “an expensive book”).",
        "Na-adjectives need “な” before a noun (しずかなへや “a quiet room”).",
        "Notice how the form changes, e.g. “きれいです” → “きれいなひと” (a pretty person).",
        "Using this pattern lets you describe nouns in more detail."
      ]
    }
  }
];
