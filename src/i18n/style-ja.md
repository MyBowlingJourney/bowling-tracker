# Japanese style guide: My Bowling Journey → Japanese (ja-JP)

This is the interface of a ten-pin bowling statistics app for league and tournament bowlers in Japan. No native speaker reviews it before release, so accuracy matters most: the same meaning as the English, natural Japanese as Japanese apps write it, the bowling words Japanese bowlers actually use (almost all katakana), and correct grammar.

## Where translations live

`ja-JP.js` holds every entry, in the same shape as `fr-CA.js`:

- **Patterns:** texts built in code. `{0}`, `{1}`... are the values code inserts, and `{1:s}` on the English side marks an English plural ending.
- **Inline elements:** text with inline elements (bold, links) uses `⟨0⟩`, `⟨1⟩`... for each element, and they must stay **in the same order** in Japanese. If Japanese word order makes that impossible, rephrase until the order works; never swap the tokens.
- **Empty string:** means the text is not read by a person.

## Placeholders

- **Values that carry meaning:** keep every placeholder that carries a number, a name or a score. You may **reorder** them as Japanese needs.
- **No plurals:** Japanese has none. **Drop** English plural endings (`{1:s}`, `game{1}`) and English words inserted by code for number agreement (`"is" : "are"`, `"team" : "teams"`), and write one form. `{0|a|b}` plural syntax is rarely needed. When two forms genuinely differ (e.g. "one" vs "several"), you may use `{0|1つ|複数}`, where the first form means exactly 1.
- **Counters:** a number usually takes a counter: 3ゲーム, 5フレーム, 2本 (pins), 4人 (people), 3回 (times), 2つ, 10投.
- Never invent a placeholder index that is not in the English, and put nothing else in curly braces.

## Numbers, money, time

- **Numbers:** Japan writes them as English does, and so does the app: 198.4, 1,250, 54%, $4.99.
  - Keep `$` directly before its number or placeholder and `%` directly after, with no space.
  - Do not change digits.
- **What the runtime converts:**
  - "7:30 PM" becomes "19:30".
  - An ordinal from code ("3rd") becomes "3位", a place. Word patterns so that a place reads well ("{0}でフィニッシュ" → "3位でフィニッシュ"). Where an ordinal is not a place (for example "3rd game"), prefer "3ゲーム目" wording in the pattern around it.

## Voice and style

- **Polite です・ます form** for sentences, as Japanese consumer apps write: friendly, clear, not stiff and not casual.
- **Labels** (buttons, tabs, chips, headers) are short nouns or verb stems: 保存, 削除, 共有, キャンセル, 閉じる.
- **Do not use あなた.** Leave the subject implied, or use 自分の / ご自身の only when it is truly needed.
- **Punctuation:** full-width 。、「」（）！？. No spaces between Japanese words. A space between Japanese and a Latin word or number is optional; follow the app's existing entries (usually no space: 3ゲーム, 平均198.4).
- **Quotes:** 「…」 for quoted UI labels.
- **Tone:** keep the English's tone, with a little dry humour in badge names. Do not add or remove information.
- **Length:** Japanese is usually shorter than English. Keep buttons and tabs short anyway.
- Keep emoji, arrows, bullets (·, •, —, →) and line structure as in the English.

## Do not translate

- **Names:** My Bowling Journey (the app), Pro (the plan), **Brooklyn** (the in-app assistant's name, kept in Latin letters, ブルックリン is the HIT), **Nightcap** (a feature name, kept in Latin letters), **Caddie** (feature name, kept in Latin letters).
- **Services, brands and patterns:** Google, Google Play, Stripe, Link, USBC, JBC, ball and manufacturer names (Storm, Hammer, Phaze II...), oil pattern names (Viper, Shark...).
- **Scoresheet marks and pins:** X, /, -, F stay as they are, and so do pin numbers and combinations (7-10, 2-4-5-8).
- **Units:** lb, ft, mL, RG, Diff and PAP stay as they are.

## App vocabulary (use exactly)

| English | Japanese |
|---|---|
| Home (tab) | ホーム |
| Bowl (tab) | 投球 |
| Stats (tab) | 成績 |
| History (tab) | 履歴 |
| Setup (tab) | 準備 |
| Improve (tab) | 上達 |
| Settings | 設定 |
| Inbox | 受信トレイ |
| Help | ヘルプ |
| Insights (AI feature) | 分析 |
| Journey (milestones) | あゆみ |
| Badges | バッジ |
| Friends / Social | フレンド |
| Team (tab) | チーム |
| Gear (tab) | 用具 |
| Coach / Coaching | コーチ |
| your bowlers (coach's view) | 指導中のボウラー |
| Side Games | サイドゲーム |
| Brackets | ブラケット |
| Just Bowling / Open bowling / Casual | フリー投球 |
| Practice | 練習 |
| League | リーグ |
| Tournament | 大会 |
| Scores only | スコアのみ |
| Subscribe / subscription | 登録する / サブスクリプション |
| Free trial | 無料トライアル |
| Sign in / sign out | ログイン / ログアウト |
| Import (scorecard) | 取り込む / 取り込み |
| Share | 共有 |
| Log / record | 記録する |
| Bag(s) | バッグ |
| Ball(s) | ボール |
| Arsenal | アーセナル |
| Night / tonight (league or tournament) | 今日 ("tonight" = 今日, not 今夜 — leagues are not always at night); session (practice) = セッション |
| Delete my account | アカウントを削除 |
| teammate | チームメイト |
| Prebowling | 事前投球 |

## Bowling terminology (see glossary-ja.md)

| English | Japanese |
|---|---|
| bowling (the sport) | ボウリング |
| bowler | ボウラー |
| bowling center | ボウリング場 |
| strike / spare / split | ストライク / スペア / スプリット |
| convert a spare | スペアを取る / スペアメイク |
| gutter | ガター |
| frame / 10th frame | フレーム / 10フレーム |
| open frame | オープンフレーム |
| clean frame | クリーンフレーム |
| game / series | ゲーム / シリーズ |
| score / scoresheet | スコア / スコアシート |
| pinfall | 倒したピン数 |
| mark | マーク |
| double / turkey | ダブル / ターキー |
| perfect game / clean game (no open frames) | パーフェクトゲーム / ノーミスゲーム |
| first ball / second ball | 1投目 / 2投目 |
| fill ball | フィルボール |
| foul / foul line | ファウル / ファウルライン |
| pin / headpin / pocket | ピン / ヘッドピン / ポケット |
| leave | 残りピン |
| single-pin spare | 1本残りのスペア |
| corner pin / 10 pin | コーナーピン / 10番ピン |
| ringing 10 / weak 10 | リンギングテン (chip: リンギング) / ウィークテン |
| 7-10 split / big four / greek church / baby split / washout / bucket | セブンテン / ビッグフォー / グリークチャーチ / ベビースプリット / ウォッシュアウト / バケット |
| messenger | メッセンジャー |
| light hit / high hit | 薄め / 厚め |
| Brooklyn (crossover hit) | ブルックリン |
| carry | キャリー |
| lane | レーン |
| approach / arrows / dots / boards | アプローチ / スパット / ドット / ボード (板目) |
| breakpoint | ブレイクポイント |
| oil pattern / lane condition | オイルパターン / レーンコンディション |
| house shot / sport shot | ハウスコンディション / スポーツコンディション |
| transition / carrydown / breakdown | トランジション / キャリーダウン / ブレイクダウン |
| ball / strike ball / spare ball | ボール / ストライクボール / スペアボール |
| coverstock / core | カバーストック / コア |
| RG / differential / layout / PAP | RG / ディファレンシャル / レイアウト / PAP |
| drilling / finger holes / thumb hole | ドリル / フィンガーホール / サムホール |
| release / hook | リリース / フック |
| rev rate / ball speed | 回転数 / 球速 |
| axis rotation / axis tilt | アクシスローテーション / アクシスティルト (narrow fields: 軸回転 / 軸傾斜) |
| one-handed / two-handed | 片手投げ / 両手投げ |
| right-handed / left-handed | 右投げ / 左投げ |
| stroker / cranker / tweener | ストローカー / クランカー / トゥイーナー |
| league / team / roster | リーグ / チーム / メンバー |
| sub | 補欠 |
| captain | キャプテン |
| bowling order | 投球順 |
| handicap / scratch | ハンディキャップ (short: ハンデ) / スクラッチ |
| average / book average | アベレージ / 公認アベレージ |
| high game / high series | ハイゲーム / ハイシリーズ |
| standings / points | 順位表 / ポイント |
| match play / head-to-head | マッチプレー / 直接対決 |
| position round | ポジションラウンド |
| absent / blind / vacancy | 欠席 / ブラインド / 欠員 |
| baker format | ベーカー方式 |
| league night / season | リーグの日 / シーズン |
| tournament / qualifying / cut | 大会 / 予選 / カット (予選通過ライン) |
| stepladder / squad / seed | ステップラダー / シフト / シード |
| cashed | 賞金圏 |
| bonus pins | ボーナスピン |
| side pot / jackpot | サイドポット / ジャックポット |
| buy-in / entry fee / winnings | 参加費 / エントリー費 / 賞金 |
| drill (exercise) | ドリル練習 |
| score spread | スコアのばらつき |

## Leave empty ("")

- **Text no one reads:** CSS values, keys, code identifiers, regexes, calendar rules, debug and log lines, and developer errors.
- **Instructions and data sent to the AI model.** But translate anything in those files that the bowler could see.
- **Help search keywords are NOT empty.** Give the Japanese words a Japanese bowler would type.
- **Same as French:** where the French entry is empty, the Japanese entry is empty too.

## Fragments

A `fragment` is a piece of a sentence that React renders around other elements or values. Japanese word order is very different from English, so:

- Translate each piece so the pieces, **read in the English order**, still make natural Japanese. For example, "Delete ⟨0⟩?" can become "⟨0⟩を削除しますか？" only if it is a single entry with tokens. When it is split into fragments, choose wording like "削除：" + name + "？".
- A particle may stand at the start of a fragment (を, の, に...).
- Look at the source to see which pieces sit next to each other.
- Do not leave English.

## Context entries

A key like `theme::Light` is used where one English word needs a different Japanese word on one screen. Translate for that context.

## Quality bar

Before writing your file, re-read every translation and check:

- The meaning is the same as the English.
- The Japanese is natural, not translationese: no あなた, and particles and counters are correct.
- Glossary terms are used.
- Placeholders are intact.
- ⟨n⟩ tokens are in order.
- No English is left (except the names above).
