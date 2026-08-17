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
    title: "第1回 自己紹介",
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
    title: "第2回 好き嫌い",
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
    title: "第3回 感想形容詞",
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
    title: "第4回 疑問（Yes/No）",
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
    title: "第5回 否定",
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
  },
  {
    id: "third_person",
    order: 6,
    title: "第6回 断定・疑問・否定（三人称）",
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
        "三人称（かれ・かのじょ・かれら）でも「です」の文法は同じ",
        "な形容詞・名詞の否定は「じゃないです」（がくせいじゃないです）",
        "い形容詞の否定は「くないです」、名詞の否定は「じゃないです」で使い分ける",
        "疑問文はここでも文末に「か」をつけるだけ"
      ]
    }
  },
  {
    id: "question_words",
    order: 7,
    title: "第7回 疑問詞",
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
        "「なに・だれ・どこ・いつ」などの疑問詞を使って詳しく質問できる",
        "疑問詞を使うときも文末の「か」は必要",
        "疑問詞は聞きたい情報の場所に入れる（それは［なに］ですか）",
        "「だれ」は人、「なに」はもの、「どこ」は場所、「いつ」は時間を聞くときに使う"
      ]
    }
  },
  {
    id: "time_weekday",
    order: 8,
    title: "第8回 時間・曜日",
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
        "時間を聞くときは「いまなんじですか」",
        "曜日を聞くときは「きょうはなんようびですか」",
        "時刻には助詞「に」を使う（しちじにおきます）",
        "曜日（げつようび〜にちようび）は覚えておくと便利"
      ]
    }
  },
  {
    id: "prices",
    order: 9,
    title: "第9回 値段",
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
        "値段を聞くときは「これはいくらですか」",
        "お金の単位は「えん」",
        "「ぜんぶで」は合計金額を聞く・言うときに使う",
        "「たかい・やすい」で値段の感想も言える"
      ]
    }
  },
  {
    id: "basic_particles",
    order: 10,
    title: "第10回 助詞（を・が・は・で・に）",
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
        "「を」は動作の対象（ごはんをたべる）",
        "「に」は行き先・相手（がっこうにいく、ともだちにあう）",
        "「で」は場所・手段（いえでべんきょうする、でんしゃでいく）",
        "「と」は一緒にする相手（ともだちとはなす）"
      ]
    }
  },
  {
    id: "existence_things",
    order: 11,
    title: "第11回 所在・存在（もの）",
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
        "ものの存在は「～があります」で表す",
        "場所は「～に」で示す（つくえのうえに、はこのなかに）",
        "「うえ」「なか」などの位置ことばと組み合わせてよく使う",
        "否定は「ありません」"
      ]
    }
  },
  {
    id: "existence_beings",
    order: 12,
    title: "第12回 所在・存在（人・生物）",
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
        "人や生き物の存在は「～がいます」で表す（ものは「あります」）",
        "場所は「～に」で示す（いえに、こうえんに）",
        "「あります」＝もの、「います」＝人・生き物、と覚えるとよい",
        "疑問文「だれがいますか」で誰がいるか聞ける"
      ]
    }
  },
  {
    id: "adjective_modifier",
    order: 13,
    title: "第13回 形容詞・形容動詞（名詞修飾）",
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
        "い形容詞は名詞の前にそのまま置ける（たかいほん）",
        "な形容詞は名詞の前で「な」が必要（しずかなへや）",
        "「きれいです」→「きれいなひと」のように形が変わることに注意",
        "この形を使うと、名詞をより詳しく説明できるようになる"
      ]
    }
  },
  {
    id: "verb_groups",
    order: 14,
    title: "第14回 動詞の活用（グループ）",
    questions: [
      {
        type: "vocab",
        prompt: "のむ",
        answer: "godan verb (u-verb)",
        options: ["godan verb (u-verb)", "ichidan verb (ru-verb)", "irregular verb", "na-adjective"]
      },
      {
        type: "vocab",
        prompt: "たべる",
        answer: "ichidan verb (ru-verb)",
        options: ["ichidan verb (ru-verb)", "godan verb (u-verb)", "irregular verb", "na-adjective"]
      },
      {
        type: "vocab",
        prompt: "する",
        answer: "irregular verb",
        options: ["irregular verb", "godan verb (u-verb)", "ichidan verb (ru-verb)", "na-adjective"]
      },
      {
        type: "vocab",
        prompt: "かく",
        answer: "godan verb (u-verb)",
        options: ["godan verb (u-verb)", "ichidan verb (ru-verb)", "irregular verb", "na-adjective"]
      },
      {
        type: "vocab",
        prompt: "みる",
        answer: "ichidan verb (ru-verb)",
        options: ["ichidan verb (ru-verb)", "godan verb (u-verb)", "irregular verb", "na-adjective"]
      },
      {
        type: "vocab",
        prompt: "くる",
        answer: "irregular verb",
        options: ["irregular verb", "godan verb (u-verb)", "ichidan verb (ru-verb)", "na-adjective"]
      },
      {
        type: "reorder",
        words: ["コーヒーを", "のみます"],
        translation: "I drink coffee."
      },
      {
        type: "reorder",
        words: ["テレビを", "みます"],
        translation: "I watch TV."
      },
      {
        type: "reorder",
        words: ["しゅくだいを", "します"],
        translation: "I do homework."
      }
    ],
    conversation: {
      rounds: [
        {
          english: "What do you drink?",
          words: ["なにを", "のみますか"],
          answer: "なにを のみますか",
          reply: "コーヒーを のみます。"
        },
        {
          english: "What do you watch?",
          words: ["なにを", "みますか"],
          answer: "なにを みますか",
          reply: "テレビを みます。"
        },
        {
          english: "Do you do homework?",
          answer: "しゅくだいを しますか",
          reply: "はい、します。"
        },
        {
          english: "Does he come to school?",
          answer: "かれは がっこうに きますか",
          reply: "はい、きます。"
        }
      ]
    },
    summary: {
      points: [
        "日本語の動詞は「五段動詞（u-verb）」「一段動詞（ru-verb）」「不規則動詞」の3グループに分かれる",
        "五段動詞の例：のむ、かく、はなす（辞書形がuの音で終わる）",
        "一段動詞の例：たべる、みる（辞書形がiまたはeの音＋るで終わる）",
        "不規則動詞は「する」「くる」の2つだけ"
      ]
    }
  },
  {
    id: "verb_forms_basic",
    order: 15,
    title: "第15回 動詞の活用形（基礎）",
    questions: [
      {
        type: "vocab",
        prompt: "たべる",
        answer: "たべます",
        options: ["たべます", "のみます", "みます", "します"]
      },
      {
        type: "vocab",
        prompt: "のむ",
        answer: "のみます",
        options: ["のみます", "たべます", "みます", "かきます"]
      },
      {
        type: "vocab",
        prompt: "かく",
        answer: "かきます",
        options: ["かきます", "のみます", "たべます", "みます"]
      },
      {
        type: "vocab",
        prompt: "みる",
        answer: "みます",
        options: ["みます", "のみます", "たべます", "かきます"]
      },
      {
        type: "vocab",
        prompt: "する",
        answer: "します",
        options: ["します", "のみます", "たべます", "みます"]
      },
      {
        type: "reorder",
        words: ["あさ", "ごはんを", "たべます"],
        translation: "I eat breakfast in the morning."
      },
      {
        type: "reorder",
        words: ["よる", "テレビを", "みます"],
        translation: "I watch TV at night."
      },
      {
        type: "reorder",
        words: ["まいにち", "べんきょうします"],
        translation: "I study every day."
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Do you eat breakfast?",
          words: ["あさごはんを", "たべますか"],
          answer: "あさごはんを たべますか",
          reply: "はい、たべます。"
        },
        {
          english: "Do you study every day?",
          words: ["まいにち", "べんきょうしますか"],
          answer: "まいにち べんきょうしますか",
          reply: "はい、します。"
        },
        {
          english: "Do you watch TV at night?",
          answer: "よる テレビを みますか",
          reply: "はい、みます。"
        },
        {
          english: "What do you write?",
          answer: "なにを かきますか",
          reply: "てがみを かきます。"
        }
      ]
    },
    summary: {
      points: [
        "動詞には「辞書形」「ます形」「て形」「た形」「ない形」などの活用形がある",
        "辞書形はそのまま覚える形（たべる、のむ）、ます形は丁寧な言い方（たべます、のみます）",
        "これらの活用形に色々な表現をつなげることで、幅広い言い方ができるようになる",
        "次のレッスンから、それぞれの活用形の使い方を順番に見ていく"
      ]
    }
  },
  {
    id: "masu_form_attach",
    order: 16,
    title: "第16回 ます形＋たい／ませんか",
    questions: [
      {
        type: "reorder",
        words: ["にほんに", "いきたいです"],
        translation: "I want to go to Japan."
      },
      {
        type: "reorder",
        words: ["コーヒーを", "のみたいです"],
        translation: "I want to drink coffee."
      },
      {
        type: "reorder",
        words: ["いっしょに", "えいがを", "みませんか"],
        translation: "Won't you watch a movie together?"
      },
      {
        type: "vocab",
        prompt: "おんせん",
        answer: "hot spring",
        options: ["hot spring", "travel", "movie", "cafe"]
      },
      {
        type: "vocab",
        prompt: "りょこう",
        answer: "travel",
        options: ["travel", "hot spring", "movie", "together"]
      },
      {
        type: "vocab",
        prompt: "えいが",
        answer: "movie",
        options: ["movie", "travel", "cafe", "hot spring"]
      },
      {
        type: "vocab",
        prompt: "カフェ",
        answer: "cafe",
        options: ["cafe", "movie", "travel", "together"]
      },
      {
        type: "vocab",
        prompt: "いっしょに",
        answer: "together",
        options: ["together", "cafe", "movie", "hot spring"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Where do you want to go?",
          words: ["どこに", "いきたいですか"],
          answer: "どこに いきたいですか",
          reply: "にほんに いきたいです。"
        },
        {
          english: "What do you want to eat?",
          words: ["なにを", "たべたいですか"],
          answer: "なにを たべたいですか",
          reply: "すしを たべたいです。"
        },
        {
          english: "Won't you drink coffee together?",
          answer: "いっしょに コーヒーを のみませんか",
          reply: "はい、いいですね。"
        },
        {
          english: "Do you want to travel?",
          answer: "りょこうを したいですか",
          reply: "はい、したいです。"
        }
      ]
    },
    summary: {
      points: [
        "「ます形＋たいです」で「～したい」という気持ちを言える（のみたいです）",
        "「ます形＋ませんか」で相手を誘うことができる（みませんか）",
        "「たい」は自分の気持ちを言うときに使う（他人には別の言い方を使う）",
        "誘うときは「いっしょに～ませんか」がよく使われる"
      ]
    }
  },
  {
    id: "te_form_attach",
    order: 17,
    title: "第17回 て形＋てもいい／ている／てはいけない",
    questions: [
      {
        type: "reorder",
        words: ["しゃしんを", "とっても", "いいですか"],
        translation: "May I take a photo?"
      },
      {
        type: "reorder",
        words: ["まどを", "あけても", "いいですか"],
        translation: "May I open the window?"
      },
      {
        type: "reorder",
        words: ["ここで", "はしっては", "いけません"],
        translation: "You must not run here."
      },
      {
        type: "vocab",
        prompt: "しゃしん",
        answer: "photo",
        options: ["photo", "window", "door", "light"]
      },
      {
        type: "vocab",
        prompt: "まど",
        answer: "window",
        options: ["window", "photo", "door", "okay"]
      },
      {
        type: "vocab",
        prompt: "ドア",
        answer: "door",
        options: ["door", "window", "light", "photo"]
      },
      {
        type: "vocab",
        prompt: "でんき",
        answer: "light",
        options: ["light", "door", "window", "okay"]
      },
      {
        type: "vocab",
        prompt: "だいじょうぶ",
        answer: "okay/fine",
        options: ["okay/fine", "light", "photo", "door"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "May I take a photo?",
          words: ["しゃしんを", "とっても", "いいですか"],
          answer: "しゃしんを とっても いいですか",
          reply: "はい、どうぞ。"
        },
        {
          english: "May I open the window?",
          words: ["まどを", "あけても", "いいですか"],
          answer: "まどを あけても いいですか",
          reply: "はい、だいじょうぶです。"
        },
        {
          english: "Are you studying now?",
          answer: "いま べんきょうしていますか",
          reply: "はい、しています。"
        },
        {
          english: "You must not run here.",
          answer: "ここで はしっては いけません",
          reply: "はい、わかりました。"
        }
      ]
    },
    summary: {
      points: [
        "「て形＋もいいですか」で許可を求められる（とってもいいですか）",
        "「て形＋いる」で今していることを表す（べんきょうしています）",
        "「て形＋はいけません」で禁止を表す（はしってはいけません）",
        "て形は動詞によって形が変わるので、よく使う動詞から覚えるとよい"
      ]
    }
  },
  {
    id: "ta_form_attach",
    order: 18,
    title: "第18回 た形＋たことがある／たほうがいい",
    questions: [
      {
        type: "reorder",
        words: ["にほんに", "いったことが", "あります"],
        translation: "I have been to Japan."
      },
      {
        type: "reorder",
        words: ["すしを", "たべたことが", "あります"],
        translation: "I have eaten sushi."
      },
      {
        type: "reorder",
        words: ["びょういんに", "いったほうが", "いいです"],
        translation: "You should go to the hospital."
      },
      {
        type: "vocab",
        prompt: "けいけん",
        answer: "experience",
        options: ["experience", "advice", "hospital", "medicine"]
      },
      {
        type: "vocab",
        prompt: "りゅうがく",
        answer: "studying abroad",
        options: ["studying abroad", "experience", "advice", "hospital"]
      },
      {
        type: "vocab",
        prompt: "アドバイス",
        answer: "advice",
        options: ["advice", "experience", "medicine", "hospital"]
      },
      {
        type: "vocab",
        prompt: "びょういん",
        answer: "hospital",
        options: ["hospital", "medicine", "advice", "experience"]
      },
      {
        type: "vocab",
        prompt: "くすり",
        answer: "medicine",
        options: ["medicine", "hospital", "experience", "advice"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Have you been to Japan?",
          words: ["にほんに", "いったことが", "ありますか"],
          answer: "にほんに いったことが ありますか",
          reply: "はい、あります。"
        },
        {
          english: "Have you eaten natto?",
          words: ["なっとうを", "たべたことが", "ありますか"],
          answer: "なっとうを たべたことが ありますか",
          reply: "いいえ、ありません。"
        },
        {
          english: "You should take medicine.",
          answer: "くすりを のんだほうが いいです",
          reply: "はい、そうします。"
        },
        {
          english: "You should go to the hospital.",
          answer: "びょういんに いったほうが いいです",
          reply: "わかりました。"
        }
      ]
    },
    summary: {
      points: [
        "「た形＋ことがあります」で過去の経験を言える（いったことがあります）",
        "「た形＋ほうがいいです」でアドバイスができる（いったほうがいいです）",
        "経験がないときは「た形＋ことがありません」",
        "た形は「て形」と同じ変化のルールを使う（たべて→たべた）"
      ]
    }
  },
  {
    id: "nai_form_attach",
    order: 19,
    title: "第19回 ない形＋なくてはいけない",
    questions: [
      {
        type: "reorder",
        words: ["しゅくだいを", "しなくては", "いけません"],
        translation: "I must do homework."
      },
      {
        type: "reorder",
        words: ["はやく", "おきなくては", "いけません"],
        translation: "I must wake up early."
      },
      {
        type: "reorder",
        words: ["やくそくを", "まもらなくては", "いけません"],
        translation: "I must keep the promise."
      },
      {
        type: "vocab",
        prompt: "しゅくだい",
        answer: "homework",
        options: ["homework", "promise", "work/job", "early"]
      },
      {
        type: "vocab",
        prompt: "やくそく",
        answer: "promise",
        options: ["promise", "homework", "work/job", "keep/protect"]
      },
      {
        type: "vocab",
        prompt: "しごと",
        answer: "work/job",
        options: ["work/job", "promise", "homework", "early"]
      },
      {
        type: "vocab",
        prompt: "はやく",
        answer: "early",
        options: ["early", "work/job", "promise", "keep/protect"]
      },
      {
        type: "vocab",
        prompt: "まもります",
        answer: "keep/protect",
        options: ["keep/protect", "early", "homework", "work/job"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Must you do homework?",
          words: ["しゅくだいを", "しなくては", "いけませんか"],
          answer: "しゅくだいを しなくては いけませんか",
          reply: "はい、しなくては いけません。"
        },
        {
          english: "Must you wake up early?",
          words: ["はやく", "おきなくては", "いけませんか"],
          answer: "はやく おきなくては いけませんか",
          reply: "はい、そうです。"
        },
        {
          english: "Must you go to work?",
          answer: "しごとに いかなくては いけませんか",
          reply: "はい、いかなくては いけません。"
        },
        {
          english: "Must you keep the promise?",
          answer: "やくそくを まもらなくては いけませんか",
          reply: "もちろんです。"
        }
      ]
    },
    summary: {
      points: [
        "「ない形＋くてはいけません」で「～しなければならない」という義務を表す",
        "ない形は動詞ごとにルールがある（する→しない、おきる→おきない、まもる→まもらない）",
        "「なくてはいけません」は少し硬い言い方（会話では「なきゃ」もよく使われる）",
        "義務を表す表現は約束やルールを話すときによく使う"
      ]
    }
  },
  {
    id: "dictionary_form_attach",
    order: 20,
    title: "第20回 辞書形＋ことができる／と思う／つもりだ／らしい",
    questions: [
      {
        type: "reorder",
        words: ["にほんごを", "はなすことが", "できます"],
        translation: "I can speak Japanese."
      },
      {
        type: "reorder",
        words: ["あした", "あめが", "ふると", "おもいます"],
        translation: "I think it will rain tomorrow."
      },
      {
        type: "reorder",
        words: ["らいねん", "にほんに", "いくつもりです"],
        translation: "I plan to go to Japan next year."
      },
      {
        type: "reorder",
        words: ["かれは", "やさしいらしいです"],
        translation: "I heard he is kind."
      },
      {
        type: "vocab",
        prompt: "あめ",
        answer: "rain",
        options: ["rain", "next year", "kind", "plan"]
      },
      {
        type: "vocab",
        prompt: "らいねん",
        answer: "next year",
        options: ["next year", "rain", "kind", "rumor"]
      },
      {
        type: "vocab",
        prompt: "やさしい",
        answer: "kind",
        options: ["kind", "rain", "plan", "next year"]
      },
      {
        type: "vocab",
        prompt: "けいかく",
        answer: "plan",
        options: ["plan", "kind", "rumor", "rain"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Can you speak Japanese?",
          words: ["にほんごを", "はなすことが", "できますか"],
          answer: "にほんごを はなすことが できますか",
          reply: "はい、すこし できます。"
        },
        {
          english: "Do you think it will rain tomorrow?",
          words: ["あした", "あめが", "ふるとおもいますか"],
          answer: "あした あめが ふるとおもいますか",
          reply: "はい、そうおもいます。"
        },
        {
          english: "Do you plan to go to Japan?",
          answer: "にほんに いくつもりですか",
          reply: "はい、そのつもりです。"
        },
        {
          english: "I heard he is kind.",
          answer: "かれは やさしいらしいです",
          reply: "そうなんですね。"
        }
      ]
    },
    summary: {
      points: [
        "「辞書形＋ことができる」で可能を表す（はなすことができます）",
        "「辞書形＋と思う」で自分の考えを言う（ふるとおもいます）",
        "「辞書形＋つもりだ」で予定・意志を言う（いくつもりです）",
        "「辞書形＋らしい」で聞いた情報・推測を言う（やさしいらしいです）"
      ]
    }
  },
  {
    id: "adjective_nominalize",
    order: 21,
    title: "第21回 形容詞・形容動詞（さ名詞化）",
    questions: [
      {
        type: "reorder",
        words: ["ふじさんの", "たかさは", "ゆうめいです"],
        translation: "Mt. Fuji's height is famous."
      },
      {
        type: "reorder",
        words: ["にほんごの", "むずかしさが", "わかりました"],
        translation: "I understood the difficulty of Japanese."
      },
      {
        type: "reorder",
        words: ["このアプリの", "べんりさが", "すきです"],
        translation: "I like this app's convenience."
      },
      {
        type: "vocab",
        prompt: "たかさ",
        answer: "height",
        options: ["height", "difficulty", "size", "convenience"]
      },
      {
        type: "vocab",
        prompt: "むずかしさ",
        answer: "difficulty",
        options: ["difficulty", "height", "size", "funness"]
      },
      {
        type: "vocab",
        prompt: "おおきさ",
        answer: "size",
        options: ["size", "difficulty", "height", "convenience"]
      },
      {
        type: "vocab",
        prompt: "べんりさ",
        answer: "convenience",
        options: ["convenience", "size", "funness", "difficulty"]
      },
      {
        type: "vocab",
        prompt: "たのしさ",
        answer: "funness/enjoyment",
        options: ["funness/enjoyment", "convenience", "height", "size"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Do you understand the difficulty of Japanese?",
          words: ["にほんごの", "むずかしさが", "わかりますか"],
          answer: "にほんごの むずかしさが わかりますか",
          reply: "はい、わかります。"
        },
        {
          english: "Do you like this app's convenience?",
          words: ["このアプリの", "べんりさが", "すきですか"],
          answer: "このアプリの べんりさが すきですか",
          reply: "はい、すきです。"
        },
        {
          english: "Is Mt. Fuji's height famous?",
          answer: "ふじさんの たかさは ゆうめいですか",
          reply: "はい、ゆうめいです。"
        },
        {
          english: "Do you know this room's size?",
          answer: "このへやの おおきさを しっていますか",
          reply: "いいえ、しりません。"
        }
      ]
    },
    summary: {
      points: [
        "形容詞の語幹に「さ」をつけると名詞になる（たかい→たかさ、むずかしい→むずかしさ）",
        "「さ」をつけることで、程度や性質を名詞として話せるようになる",
        "な形容詞も同じルールが使える（べんり→べんりさ）",
        "この形は「〜が好き」「〜がわかる」などと組み合わせてよく使われる"
      ]
    }
  },
  {
    id: "potential_form",
    order: 22,
    title: "第22回 可能形",
    questions: [
      {
        type: "vocab",
        prompt: "はなす",
        answer: "はなせる",
        options: ["はなせる", "たべられる", "いける", "のめる"]
      },
      {
        type: "vocab",
        prompt: "たべる",
        answer: "たべられる",
        options: ["たべられる", "はなせる", "いける", "のめる"]
      },
      {
        type: "vocab",
        prompt: "いく",
        answer: "いける",
        options: ["いける", "たべられる", "はなせる", "のめる"]
      },
      {
        type: "vocab",
        prompt: "のむ",
        answer: "のめる",
        options: ["のめる", "いける", "たべられる", "はなせる"]
      },
      {
        type: "reorder",
        words: ["にほんごが", "はなせます"],
        translation: "I can speak Japanese."
      },
      {
        type: "reorder",
        words: ["きょうは", "いけます"],
        translation: "I can go today."
      },
      {
        type: "reorder",
        words: ["おさけが", "のめません"],
        translation: "I cannot drink alcohol."
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Can you speak Japanese?",
          words: ["にほんごが", "はなせますか"],
          answer: "にほんごが はなせますか",
          reply: "はい、はなせます。"
        },
        {
          english: "Can you go today?",
          words: ["きょうは", "いけますか"],
          answer: "きょうは いけますか",
          reply: "はい、いけます。"
        },
        {
          english: "Can you drink alcohol?",
          answer: "おさけが のめますか",
          reply: "いいえ、のめません。"
        },
        {
          english: "Can you eat natto?",
          answer: "なっとうが たべられますか",
          reply: "はい、たべられます。"
        }
      ]
    },
    summary: {
      points: [
        "可能形は「〜することができる」を1語で言える形（はなす→はなせる）",
        "五段動詞は「う→える」に変える（のむ→のめる、はなす→はなせる）",
        "一段動詞は「る→られる」に変える（たべる→たべられる）",
        "可能形の対象には「が」を使う（にほんごがはなせます）"
      ]
    }
  },
  {
    id: "happy",
    order: 23,
    title: "第23回 うれしい",
    questions: [
      {
        type: "reorder",
        words: ["プレゼントを", "もらって", "うれしいです"],
        translation: "I'm happy to receive a present."
      },
      {
        type: "reorder",
        words: ["テストに", "ごうかくして", "うれしいです"],
        translation: "I'm happy to pass the test."
      },
      {
        type: "reorder",
        words: ["あなたに", "あえて", "うれしいです"],
        translation: "I'm happy to meet you."
      },
      {
        type: "vocab",
        prompt: "プレゼント",
        answer: "present",
        options: ["present", "birthday", "passing (an exam)", "marriage"]
      },
      {
        type: "vocab",
        prompt: "たんじょうび",
        answer: "birthday",
        options: ["birthday", "present", "success", "marriage"]
      },
      {
        type: "vocab",
        prompt: "ごうかく",
        answer: "passing (an exam)",
        options: ["passing (an exam)", "birthday", "present", "success"]
      },
      {
        type: "vocab",
        prompt: "けっこん",
        answer: "marriage",
        options: ["marriage", "passing (an exam)", "present", "success"]
      },
      {
        type: "vocab",
        prompt: "せいこう",
        answer: "success",
        options: ["success", "marriage", "birthday", "present"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Are you happy to receive a present?",
          words: ["プレゼントを", "もらって", "うれしいですか"],
          answer: "プレゼントを もらって うれしいですか",
          reply: "はい、うれしいです。"
        },
        {
          english: "Are you happy today?",
          words: ["きょう", "うれしいですか"],
          answer: "きょう うれしいですか",
          reply: "はい、とても うれしいです。"
        },
        {
          english: "Are you happy to pass the test?",
          answer: "テストに ごうかくして うれしいですか",
          reply: "はい、うれしいです。"
        },
        {
          english: "Are you happy to meet him?",
          answer: "かれに あえて うれしいですか",
          reply: "はい、うれしいです。"
        }
      ]
    },
    summary: {
      points: [
        "感情の理由は「て形＋うれしいです」で表す（もらってうれしいです）",
        "て形は「〜して、その結果」という意味合いを持つ",
        "「うれしい」はポジティブな出来事に使う",
        "同じパターンで他の感情表現にも応用できる（このあとのレッスンで練習）"
      ]
    }
  },
  {
    id: "troubled",
    order: 24,
    title: "第24回 困る",
    questions: [
      {
        type: "reorder",
        words: ["さいふを", "なくして", "こまります"],
        translation: "I'm in trouble because I lost my wallet."
      },
      {
        type: "reorder",
        words: ["かぎが", "なくて", "こまります"],
        translation: "I'm in trouble because I don't have my key."
      },
      {
        type: "reorder",
        words: ["でんわが", "こしょうして", "こまります"],
        translation: "I'm in trouble because my phone broke."
      },
      {
        type: "vocab",
        prompt: "さいふ",
        answer: "wallet",
        options: ["wallet", "key", "phone", "breakdown"]
      },
      {
        type: "vocab",
        prompt: "かぎ",
        answer: "key",
        options: ["key", "wallet", "phone", "lose"]
      },
      {
        type: "vocab",
        prompt: "でんわ",
        answer: "phone",
        options: ["phone", "key", "wallet", "breakdown"]
      },
      {
        type: "vocab",
        prompt: "なくす",
        answer: "lose",
        options: ["lose", "phone", "key", "breakdown"]
      },
      {
        type: "vocab",
        prompt: "こしょう",
        answer: "breakdown",
        options: ["breakdown", "lose", "wallet", "key"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Are you in trouble because you lost your wallet?",
          words: ["さいふを", "なくして", "こまりますか"],
          answer: "さいふを なくして こまりますか",
          reply: "はい、こまります。"
        },
        {
          english: "Are you in trouble because you don't have a key?",
          words: ["かぎが", "なくて", "こまりますか"],
          answer: "かぎが なくて こまりますか",
          reply: "はい、とても こまります。"
        },
        {
          english: "Are you in trouble because your phone broke?",
          answer: "でんわが こしょうして こまりますか",
          reply: "はい、こまります。"
        },
        {
          english: "What troubles you?",
          answer: "なにに こまりますか",
          reply: "じかんが なくて こまります。"
        }
      ]
    },
    summary: {
      points: [
        "困った理由は「て形＋こまります」で表す（なくしてこまります）",
        "「ない」の て形は「なくて」になる（かぎがなくて）",
        "ネガティブな出来事の理由を言うときによく使うパターン",
        "「うれしい」のときと同じ「て形＋感情」の形"
      ]
    }
  },
  {
    id: "sad",
    order: 25,
    title: "第25回 悲しい",
    questions: [
      {
        type: "reorder",
        words: ["ともだちと", "わかれて", "かなしいです"],
        translation: "I'm sad because I parted with my friend."
      },
      {
        type: "reorder",
        words: ["ペットが", "いなくなって", "かなしいです"],
        translation: "I'm sad because my pet is gone."
      },
      {
        type: "reorder",
        words: ["さようならを", "いって", "かなしいです"],
        translation: "I'm sad to say goodbye."
      },
      {
        type: "vocab",
        prompt: "わかれる",
        answer: "part ways",
        options: ["part ways", "disappear", "cry", "pet"]
      },
      {
        type: "vocab",
        prompt: "ペット",
        answer: "pet",
        options: ["pet", "part ways", "disappear", "goodbye"]
      },
      {
        type: "vocab",
        prompt: "いなくなる",
        answer: "to be gone",
        options: ["to be gone", "pet", "part ways", "cry"]
      },
      {
        type: "vocab",
        prompt: "さようなら",
        answer: "goodbye",
        options: ["goodbye", "to be gone", "pet", "cry"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Are you sad because you parted with your friend?",
          words: ["ともだちと", "わかれて", "かなしいですか"],
          answer: "ともだちと わかれて かなしいですか",
          reply: "はい、かなしいです。"
        },
        {
          english: "Are you sad your pet is gone?",
          words: ["ペットが", "いなくなって", "かなしいですか"],
          answer: "ペットが いなくなって かなしいですか",
          reply: "はい、とても かなしいです。"
        },
        {
          english: "Are you sad to say goodbye?",
          answer: "さようならを いって かなしいですか",
          reply: "はい、かなしいです。"
        },
        {
          english: "Why are you sad?",
          answer: "どうして かなしいですか",
          reply: "ともだちと わかれたからです。"
        }
      ]
    },
    summary: {
      points: [
        "悲しい理由も「て形＋かなしいです」で表す",
        "「わかれる」「いなくなる」など別れ・喪失に関することばとよく使う",
        "「どうして」で理由を聞くことができる",
        "これまでと同じ「て形＋感情表現」のパターン"
      ]
    }
  },
  {
    id: "worried",
    order: 26,
    title: "第26回 心配",
    questions: [
      {
        type: "reorder",
        words: ["たいふうが", "きて", "しんぱいです"],
        translation: "I'm worried because a typhoon is coming."
      },
      {
        type: "reorder",
        words: ["けんこうが", "しんぱいです"],
        translation: "I'm worried about (my) health."
      },
      {
        type: "reorder",
        words: ["しけんの", "けっかが", "しんぱいです"],
        translation: "I'm worried about the exam results."
      },
      {
        type: "vocab",
        prompt: "てんき",
        answer: "weather",
        options: ["weather", "typhoon", "health", "exam"]
      },
      {
        type: "vocab",
        prompt: "たいふう",
        answer: "typhoon",
        options: ["typhoon", "weather", "health", "safety"]
      },
      {
        type: "vocab",
        prompt: "けんこう",
        answer: "health",
        options: ["health", "typhoon", "exam", "safety"]
      },
      {
        type: "vocab",
        prompt: "しけん",
        answer: "exam",
        options: ["exam", "health", "weather", "safety"]
      },
      {
        type: "vocab",
        prompt: "あんぜん",
        answer: "safety",
        options: ["safety", "exam", "typhoon", "health"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Are you worried about the typhoon?",
          words: ["たいふうが", "きて", "しんぱいですか"],
          answer: "たいふうが きて しんぱいですか",
          reply: "はい、しんぱいです。"
        },
        {
          english: "Are you worried about your health?",
          words: ["けんこうが", "しんぱいですか"],
          answer: "けんこうが しんぱいですか",
          reply: "はい、しんぱいです。"
        },
        {
          english: "Are you worried about the exam results?",
          answer: "しけんの けっかが しんぱいですか",
          reply: "はい、とても しんぱいです。"
        },
        {
          english: "Are you worried about safety?",
          answer: "あんぜんが しんぱいですか",
          reply: "いいえ、だいじょうぶです。"
        }
      ]
    },
    summary: {
      points: [
        "心配な理由は「て形＋しんぱいです」、または「〜がしんぱいです」で表す",
        "天気・健康・試験結果など、これから起こることへの不安によく使う",
        "「だいじょうぶです」で安心させる返事ができる",
        "感情表現はすべて似たパターンで作れることに気づいたはず"
      ]
    }
  },
  {
    id: "relieved",
    order: 27,
    title: "第27回 安心",
    questions: [
      {
        type: "reorder",
        words: ["れんらくが", "きて", "あんしんしました"],
        translation: "I felt relieved when the message came."
      },
      {
        type: "reorder",
        words: ["ぶじに", "ついて", "あんしんしました"],
        translation: "I felt relieved that they arrived safely."
      },
      {
        type: "reorder",
        words: ["てんすうが", "よくて", "あんしんしました"],
        translation: "I felt relieved the score was good."
      },
      {
        type: "vocab",
        prompt: "れんらく",
        answer: "contact/message",
        options: ["contact/message", "safe", "score", "typhoon"]
      },
      {
        type: "vocab",
        prompt: "ぶじ",
        answer: "safe/unharmed",
        options: ["safe/unharmed", "contact/message", "score", "exam"]
      },
      {
        type: "vocab",
        prompt: "てんすう",
        answer: "score",
        options: ["score", "safe/unharmed", "contact/message", "typhoon"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Did you feel relieved the message came?",
          words: ["れんらくが", "きて", "あんしんしましたか"],
          answer: "れんらくが きて あんしんしましたか",
          reply: "はい、あんしんしました。"
        },
        {
          english: "Did you feel relieved they arrived safely?",
          words: ["ぶじに", "ついて", "あんしんしましたか"],
          answer: "ぶじに ついて あんしんしましたか",
          reply: "はい、あんしんしました。"
        },
        {
          english: "Did you feel relieved the score was good?",
          answer: "てんすうが よくて あんしんしましたか",
          reply: "はい、あんしんしました。"
        },
        {
          english: "Are you relieved now?",
          answer: "いま あんしんしていますか",
          reply: "はい、あんしんしています。"
        }
      ]
    },
    summary: {
      points: [
        "安心した理由は「て形＋あんしんしました」で表す",
        "「あんしんしました」は過去形（すでに安心した気持ち）",
        "「あんしんしています」なら今も安心している状態",
        "心配→安心、という流れの会話でよく使われる"
      ]
    }
  },
  {
    id: "surprised",
    order: 28,
    title: "第28回 びっくり",
    questions: [
      {
        type: "reorder",
        words: ["おおきい", "おとが", "して", "びっくりしました"],
        translation: "I was surprised by the loud sound."
      },
      {
        type: "reorder",
        words: ["ニュースを", "きいて", "びっくりしました"],
        translation: "I was surprised to hear the news."
      },
      {
        type: "reorder",
        words: ["かかくが", "たかくて", "びっくりしました"],
        translation: "I was surprised the price was expensive."
      },
      {
        type: "vocab",
        prompt: "おと",
        answer: "sound",
        options: ["sound", "news", "price", "surprise"]
      },
      {
        type: "vocab",
        prompt: "ニュース",
        answer: "news",
        options: ["news", "sound", "price", "earthquake"]
      },
      {
        type: "vocab",
        prompt: "かかく",
        answer: "price",
        options: ["price", "sound", "news", "surprise"]
      },
      {
        type: "vocab",
        prompt: "じしん",
        answer: "earthquake",
        options: ["earthquake", "price", "news", "sound"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Were you surprised by the loud sound?",
          words: ["おおきいおとが して", "びっくりしましたか"],
          answer: "おおきいおとが して びっくりしましたか",
          reply: "はい、びっくりしました。"
        },
        {
          english: "Were you surprised to hear the news?",
          words: ["ニュースを", "きいて", "びっくりしましたか"],
          answer: "ニュースを きいて びっくりしましたか",
          reply: "はい、とても びっくりしました。"
        },
        {
          english: "Were you surprised the price was expensive?",
          answer: "かかくが たかくて びっくりしましたか",
          reply: "はい、びっくりしました。"
        },
        {
          english: "Were you surprised by the earthquake?",
          answer: "じしんに びっくりしましたか",
          reply: "はい、びっくりしました。"
        }
      ]
    },
    summary: {
      points: [
        "驚いた理由も「て形＋びっくりしました」で表す",
        "「〜にびっくりする」の形もよく使われる（じしんにびっくりする）",
        "音・ニュース・値段など、予想外の出来事に使う",
        "これも過去形「びっくりしました」がよく使われる"
      ]
    }
  },
  {
    id: "disappointed",
    order: 29,
    title: "第29回 残念",
    questions: [
      {
        type: "reorder",
        words: ["りょこうが", "ちゅうしになって", "ざんねんです"],
        translation: "It's a shame the trip was cancelled."
      },
      {
        type: "reorder",
        words: ["しあいに", "まけて", "ざんねんです"],
        translation: "It's a shame we lost the match."
      },
      {
        type: "reorder",
        words: ["てんきが", "わるくて", "ざんねんです"],
        translation: "It's a shame the weather is bad."
      },
      {
        type: "vocab",
        prompt: "ちゅうし",
        answer: "cancellation",
        options: ["cancellation", "match", "travel", "weather"]
      },
      {
        type: "vocab",
        prompt: "しあい",
        answer: "match/game",
        options: ["match/game", "cancellation", "travel", "loss"]
      },
      {
        type: "vocab",
        prompt: "まけ",
        answer: "loss (sports)",
        options: ["loss (sports)", "match/game", "cancellation", "weather"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Is it a shame the trip was cancelled?",
          words: ["りょこうが", "ちゅうしになって", "ざんねんですか"],
          answer: "りょこうが ちゅうしになって ざんねんですか",
          reply: "はい、ざんねんです。"
        },
        {
          english: "Is it a shame you lost the match?",
          words: ["しあいに", "まけて", "ざんねんですか"],
          answer: "しあいに まけて ざんねんですか",
          reply: "はい、ざんねんです。"
        },
        {
          english: "Is it a shame the weather is bad?",
          answer: "てんきが わるくて ざんねんですか",
          reply: "はい、ほんとうに ざんねんです。"
        },
        {
          english: "Was the trip cancelled?",
          answer: "りょこうは ちゅうしに なりましたか",
          reply: "はい、なりました。"
        }
      ]
    },
    summary: {
      points: [
        "残念な理由も「て形＋ざんねんです」で表す",
        "中止・負け・悪い天気など、期待外れの出来事によく使う",
        "「なります」（〜になる）は状態の変化を表す動詞",
        "感情表現のパターンは全部同じ形でできることを確認しよう"
      ]
    }
  },
  {
    id: "tired",
    order: 30,
    title: "第30回 疲れる",
    questions: [
      {
        type: "reorder",
        words: ["うんどうを", "して", "つかれました"],
        translation: "I got tired from exercising."
      },
      {
        type: "reorder",
        words: ["ざんぎょうを", "して", "つかれました"],
        translation: "I got tired from working overtime."
      },
      {
        type: "reorder",
        words: ["やまに", "のぼって", "つかれました"],
        translation: "I got tired from climbing the mountain."
      },
      {
        type: "vocab",
        prompt: "うんどう",
        answer: "exercise",
        options: ["exercise", "overtime work", "mountain", "travel"]
      },
      {
        type: "vocab",
        prompt: "ざんぎょう",
        answer: "overtime work",
        options: ["overtime work", "exercise", "mountain", "study"]
      },
      {
        type: "vocab",
        prompt: "やま",
        answer: "mountain",
        options: ["mountain", "overtime work", "exercise", "travel"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Did you get tired from exercising?",
          words: ["うんどうを", "して", "つかれましたか"],
          answer: "うんどうを して つかれましたか",
          reply: "はい、つかれました。"
        },
        {
          english: "Did you get tired from working overtime?",
          words: ["ざんぎょうを", "して", "つかれましたか"],
          answer: "ざんぎょうを して つかれましたか",
          reply: "はい、とても つかれました。"
        },
        {
          english: "Did you get tired from climbing the mountain?",
          answer: "やまに のぼって つかれましたか",
          reply: "はい、つかれました。"
        },
        {
          english: "Are you tired now?",
          answer: "いま つかれていますか",
          reply: "はい、すこし つかれています。"
        }
      ]
    },
    summary: {
      points: [
        "疲れた理由は「て形＋つかれました」で表す",
        "運動・仕事・登山など、体力を使う活動によく使う",
        "「つかれています」なら今も疲れている状態が続いていることを表す",
        "③のレッスンで「て形＋感情」のパターンを一通り練習した"
      ]
    }
  },
  {
    id: "past_tense",
    order: 31,
    title: "第31回 過去形",
    questions: [
      {
        type: "reorder",
        words: ["きのう", "ほんを", "よみました"],
        translation: "Yesterday I read a book."
      },
      {
        type: "reorder",
        words: ["せんしゅう", "がっこうを", "やすみました"],
        translation: "Last week I was absent from school."
      },
      {
        type: "reorder",
        words: ["きのうは", "あめでした"],
        translation: "Yesterday was rainy."
      },
      {
        type: "vocab",
        prompt: "きのう",
        answer: "yesterday",
        options: ["yesterday", "last week", "the day before yesterday", "long ago"]
      },
      {
        type: "vocab",
        prompt: "せんしゅう",
        answer: "last week",
        options: ["last week", "yesterday", "long ago", "a moment ago"]
      },
      {
        type: "vocab",
        prompt: "おととい",
        answer: "the day before yesterday",
        options: ["the day before yesterday", "last week", "yesterday", "long ago"]
      },
      {
        type: "vocab",
        prompt: "むかし",
        answer: "long ago",
        options: ["long ago", "the day before yesterday", "a moment ago", "yesterday"]
      },
      {
        type: "vocab",
        prompt: "さっき",
        answer: "a moment ago",
        options: ["a moment ago", "long ago", "last week", "yesterday"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Did you read a book yesterday?",
          words: ["きのう", "ほんを", "よみましたか"],
          answer: "きのう ほんを よみましたか",
          reply: "はい、よみました。"
        },
        {
          english: "Was yesterday rainy?",
          words: ["きのうは", "あめでしたか"],
          answer: "きのうは あめでしたか",
          reply: "いいえ、はれでした。"
        },
        {
          english: "Were you absent from school last week?",
          answer: "せんしゅう がっこうを やすみましたか",
          reply: "はい、やすみました。"
        },
        {
          english: "Was it cold the day before yesterday?",
          answer: "おとといは さむかったですか",
          reply: "はい、さむかったです。"
        }
      ]
    },
    summary: {
      points: [
        "動詞の過去形は「ました」（よみます→よみました）",
        "「です」の過去形は「でした」（あめです→あめでした）",
        "い形容詞の過去形は「かった」（さむい→さむかった）",
        "「きのう」「せんしゅう」など時間ことばと一緒によく使う"
      ]
    }
  },
  {
    id: "future_tense",
    order: 32,
    title: "第32回 未来形",
    questions: [
      {
        type: "reorder",
        words: ["らいしゅう", "にほんに", "いきます"],
        translation: "Next week I will go to Japan."
      },
      {
        type: "reorder",
        words: ["あした", "たぶん", "あめでしょう"],
        translation: "Tomorrow it will probably rain."
      },
      {
        type: "reorder",
        words: ["もうすぐ", "はるに", "なるでしょう"],
        translation: "Spring will probably come soon."
      },
      {
        type: "vocab",
        prompt: "らいしゅう",
        answer: "next week",
        options: ["next week", "next month", "probably", "surely"]
      },
      {
        type: "vocab",
        prompt: "らいげつ",
        answer: "next month",
        options: ["next month", "next week", "probably", "spring"]
      },
      {
        type: "vocab",
        prompt: "たぶん",
        answer: "probably",
        options: ["probably", "surely", "next week", "spring"]
      },
      {
        type: "vocab",
        prompt: "きっと",
        answer: "surely",
        options: ["surely", "probably", "next month", "spring"]
      },
      {
        type: "vocab",
        prompt: "はる",
        answer: "spring",
        options: ["spring", "surely", "probably", "next week"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Will you go to Japan next week?",
          words: ["らいしゅう", "にほんに", "いきますか"],
          answer: "らいしゅう にほんに いきますか",
          reply: "はい、いきます。"
        },
        {
          english: "Will it probably rain tomorrow?",
          words: ["あした", "たぶん", "あめでしょうか"],
          answer: "あした たぶん あめでしょうか",
          reply: "はい、たぶん そうです。"
        },
        {
          english: "Will spring come soon?",
          answer: "もうすぐ はるに なるでしょうか",
          reply: "はい、きっと そうです。"
        },
        {
          english: "Will you surely come next month?",
          answer: "らいげつ きっと きますか",
          reply: "はい、きっと きます。"
        }
      ]
    },
    summary: {
      points: [
        "未来のことは、現在形（辞書形／ます形）でそのまま表せる",
        "推量には「でしょう」をよく使う（あめでしょう）",
        "「たぶん」「きっと」などのことばで確信の度合いを調整できる",
        "「らいしゅう」「らいげつ」など未来を表す時間ことばと組み合わせる"
      ]
    }
  },
  {
    id: "conditional",
    order: 33,
    title: "第33回 条件",
    questions: [
      {
        type: "reorder",
        words: ["ボタンを", "おすと", "ドアが", "あきます"],
        translation: "If you press the button, the door opens."
      },
      {
        type: "reorder",
        words: ["あめが", "ふったら", "いえに", "います"],
        translation: "If it rains, I'll stay home."
      },
      {
        type: "reorder",
        words: ["じかんが", "あれば", "てつだいます"],
        translation: "If I have time, I'll help."
      },
      {
        type: "vocab",
        prompt: "みぎ",
        answer: "right",
        options: ["right", "left", "straight", "turn"]
      },
      {
        type: "vocab",
        prompt: "ひだり",
        answer: "left",
        options: ["left", "right", "straight", "button"]
      },
      {
        type: "vocab",
        prompt: "まっすぐ",
        answer: "straight",
        options: ["straight", "left", "right", "turn"]
      },
      {
        type: "vocab",
        prompt: "まがる",
        answer: "turn",
        options: ["turn", "straight", "left", "right"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Does the door open if you press the button?",
          words: ["ボタンを", "おすと", "ドアが あきますか"],
          answer: "ボタンを おすと ドアが あきますか",
          reply: "はい、あきます。"
        },
        {
          english: "If it rains, will you stay home?",
          words: ["あめが", "ふったら", "いえに いますか"],
          answer: "あめが ふったら いえに いますか",
          reply: "はい、いえに います。"
        },
        {
          english: "If you have time, will you help?",
          answer: "じかんが あれば てつだいますか",
          reply: "はい、てつだいます。"
        },
        {
          english: "If you turn right, is the station there?",
          answer: "みぎに まがったら えきが ありますか",
          reply: "はい、あります。"
        }
      ]
    },
    summary: {
      points: [
        "条件表現には「と」「たら」「ば」「なら」がある",
        "「と」は自動的な結果（ボタンをおすとあきます）",
        "「たら」は日常会話でよく使う一般的な条件（ふったら〜）",
        "「ば」はやや書きことば的、「なら」は相手の話を受けて条件を出すときに使う"
      ]
    }
  },
  {
    id: "reason",
    order: 34,
    title: "第34回 理由",
    questions: [
      {
        type: "reorder",
        words: ["かぜを", "ひいたから", "やすみます"],
        translation: "Because I have a cold, I'll take the day off."
      },
      {
        type: "reorder",
        words: ["いそがしいので", "いけません"],
        translation: "Because I'm busy, I can't go."
      },
      {
        type: "reorder",
        words: ["ねつが", "あるから", "びょういんに", "いきます"],
        translation: "Because I have a fever, I'll go to the hospital."
      },
      {
        type: "vocab",
        prompt: "かぜ",
        answer: "cold (illness)",
        options: ["cold (illness)", "fever", "busy", "day off"]
      },
      {
        type: "vocab",
        prompt: "ねつ",
        answer: "fever",
        options: ["fever", "cold (illness)", "busy", "circumstance"]
      },
      {
        type: "vocab",
        prompt: "いそがしい",
        answer: "busy",
        options: ["busy", "fever", "day off", "cold (illness)"]
      },
      {
        type: "vocab",
        prompt: "やすみ",
        answer: "day off",
        options: ["day off", "busy", "fever", "circumstance"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Will you take the day off because you have a cold?",
          words: ["かぜを", "ひいたから", "やすみますか"],
          answer: "かぜを ひいたから やすみますか",
          reply: "はい、やすみます。"
        },
        {
          english: "Can't you go because you're busy?",
          words: ["いそがしいので", "いけませんか"],
          answer: "いそがしいので いけませんか",
          reply: "はい、いけません。"
        },
        {
          english: "Will you go to the hospital because you have a fever?",
          answer: "ねつが あるから びょういんに いきますか",
          reply: "はい、いきます。"
        },
        {
          english: "Why are you absent?",
          answer: "どうして やすみますか",
          reply: "かぜを ひいたからです。"
        }
      ]
    },
    summary: {
      points: [
        "理由は「から」または「ので」で表す",
        "「から」は主観的・話し言葉らしい理由づけ",
        "「ので」はやや丁寧・客観的な理由づけ",
        "「どうして〜ですか」に「〜からです」で答えられる"
      ]
    }
  },
  {
    id: "comparison",
    order: 35,
    title: "第35回 比較表現",
    questions: [
      {
        type: "reorder",
        words: ["コーヒーの", "ほうが", "すきです"],
        translation: "I like coffee more."
      },
      {
        type: "reorder",
        words: ["なつが", "いちばん", "すきです"],
        translation: "I like summer the most."
      },
      {
        type: "reorder",
        words: ["どちらが", "すきですか"],
        translation: "Which do you like (of the two)?"
      },
      {
        type: "vocab",
        prompt: "ほう",
        answer: "side/direction (for comparison)",
        options: ["side/direction (for comparison)", "the most", "which (of two)", "compare"]
      },
      {
        type: "vocab",
        prompt: "いちばん",
        answer: "the most",
        options: ["the most", "side/direction (for comparison)", "which (of two)", "compare"]
      },
      {
        type: "vocab",
        prompt: "どちら",
        answer: "which (of two)",
        options: ["which (of two)", "the most", "compare", "side/direction (for comparison)"]
      },
      {
        type: "vocab",
        prompt: "くらべる",
        answer: "compare",
        options: ["compare", "which (of two)", "the most", "side/direction (for comparison)"]
      }
    ],
    conversation: {
      rounds: [
        {
          english: "Do you like coffee more?",
          words: ["コーヒーの", "ほうが", "すきですか"],
          answer: "コーヒーの ほうが すきですか",
          reply: "はい、コーヒーの ほうが すきです。"
        },
        {
          english: "Which do you like?",
          words: ["どちらが", "すきですか"],
          answer: "どちらが すきですか",
          reply: "こちらが すきです。"
        },
        {
          english: "Do you like summer the most?",
          answer: "なつが いちばん すきですか",
          reply: "はい、いちばん すきです。"
        },
        {
          english: "Is Japanese more difficult than English?",
          answer: "にほんごは えいごより むずかしいですか",
          reply: "はい、すこし むずかしいです。"
        }
      ]
    },
    summary: {
      points: [
        "2つを比べるときは「AのほうがBよりすきです」の形を使う",
        "「どちらが〜ですか」で2つのうちどちらか聞ける",
        "3つ以上の中で一番のものは「いちばん〜」で表す",
        "「より」は「〜と比べて」という意味の比較の助詞"
      ]
    }
  }
];
