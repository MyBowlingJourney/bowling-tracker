# Style guide: My Bowling Journey → Traditional Chinese, Taiwan (zh-TW)

This is the interface of a ten-pin bowling statistics app for league, club and tournament bowlers in Taiwan. No native speaker reviews it before release, so accuracy matters most: the same meaning as the English, natural Taiwanese Mandarin as Taiwanese apps write it, the bowling words Taiwanese bowlers actually use, and correct Traditional characters and punctuation.

## Where translations live

`zh-TW.js` holds every entry, in the same shape as `ko-KR.js`:

- **Patterns:** texts built in code. `{0}`, `{1}`... are the values code inserts, and `{1:s}` on the English side marks an English plural ending.
- **Inline elements:** text with inline elements (bold, links) uses `⟨0⟩`, `⟨1⟩`... for each element, and they must stay **in the same order** in Chinese. If Chinese word order makes that impossible, rephrase until the order works; never swap the tokens.
- **Empty string:** means the text is not read by a person.

## Characters

- **Traditional characters as used in Taiwan** (臺灣正體). Never Simplified characters, never Hong Kong–only forms or Cantonese words.
  - Taiwan forms: 裡 (not 裏), 著 (not 着), 台 is fine in 台灣 / 台北, 群組, 帳號, 設定, 資料, 檔案, 網路, 訊息, 軟體, 影片, 預設, 登入.
  - Not mainland words: 設定 (not 設置), 帳號 (not 賬戶), 資料 (not 數據 for "data" in UI), 網路 (not 網絡), 訊息 (not 信息), 預設 (not 默認), 支援 (not 支持 for "support a feature"), 品質 (not 質量), 螢幕 (not 屏幕), 影片 (not 視頻), 程式 (not 程序).

## Placeholders

- **Values that carry meaning:** keep every placeholder that carries a number, a name or a score. You may **reorder** them as Chinese needs.
- **No plurals:** Chinese does not mark them. **Drop** English plural endings (`{1:s}`, `game{1}`) and English words inserted by code for number agreement (`"is" : "are"`, `"team" : "teams"`), and write one form. `{0|a|b}` is rarely needed.
- **Measure words:** a number takes its measure word: 3 局, 5 格, 2 支球瓶 / 2 瓶, 4 人, 3 次, 10 球 (deliveries), 2 天, 6 顆球 (bowling balls).
- Never invent a placeholder index that is not in the English, and put nothing else in curly braces.

## Spacing and punctuation

- **Full-width punctuation** in Chinese sentences: ，。：；！？「」『』（）、…… — and never a space before or after it.
- **A half-width space between Chinese characters and Latin letters or digits**, as Taiwanese Google and Apple software write: 「3 局」「Pro 方案」「第 10 格」「平均 198.4 分」. No space between a digit and %, $, NT$, ° or a unit abbreviation written as a symbol: 54%、NT$170、15 lb (space before lb, as with any Latin word).
- After a placeholder that holds a number or a name, write the space: `{0} 局`, `和 {0} 一起`. The runtime removes a space that ends up next to full-width punctuation.
- Quoted UI labels use 「…」: 在「設定」中.
- Lists use 、 and the last item takes 和: 全倒、補中和失誤.

## Numbers, money, time

- **Numbers** as English writes them: 198.4, 1,250, 54%. Do not change digits.
- **Money:** `$`, `NT$`, `₩`, `¥` stay directly before their number or placeholder, `%` directly after, no space.
- **What the runtime converts:**
  - "7:30 PM" becomes "下午 7:30", "9:00 AM" becomes "上午 9:00".
  - An ordinal from code ("3rd") becomes "第 3 名", a finishing place. Word patterns so that a place reads well ("finished {0}" → "最後排名{0}", which the runtime makes "最後排名第 3 名" — prefer "以{0}作收" / "拿下{0}" so it reads "拿下第 3 名"). Where an ordinal is not a place ("3rd game"), write "第 3 局" in the pattern around it.
  - "2nd seed" / "{0} seed" becomes "第 2 種子".

## Voice and style

- **Friendly and polite, second person 你** — the way Taiwanese consumer apps talk (你已儲存、要刪除嗎？、無法…). The legal pages (privacy, terms) use 您; the app never does.
- **Labels** (buttons, tabs, chips, headers) are short: 儲存、刪除、分享、取消、關閉、開始、完成、編輯、新增.
- Sentences end with 。 or ！ sparingly; questions with ？.
- **Tone:** keep the English's tone, with a little dry humour in badge names. Do not add or remove information.
- **Length:** Chinese is usually shorter than English. Keep buttons and tabs to two to four characters where you can.
- Keep emoji, arrows, bullets (·, •, —, →) and line structure as in the English.

## Do not translate

- **Names:** My Bowling Journey (the app), Pro and Basic (the plans), **Brooklyn** (the in-app assistant's name), **Nightcap** (a feature name), **Caddie** (a feature name).
- **Services, brands and patterns:** Google, Google Play, Stripe, Link, USBC, ball and manufacturer names (Storm, Hammer, Phaze II...), oil pattern names (Viper, Shark...).
- **Scoresheet marks and pins:** X, /, -, F stay as they are, and so do pin numbers and combinations (7-10, 2-4-5-8).
- **Units and ball specs:** lb, ft, mL, RG, Diff and PAP stay as they are.

## App vocabulary (use exactly)

| English | Chinese |
|---|---|
| Home (tab) | 首頁 |
| Bowl (tab) | 打球 |
| Stats (tab) | 統計 |
| History (tab) | 紀錄 |
| Setup (tab) | 準備 |
| Improve (tab) | 進步 |
| Settings | 設定 |
| Inbox | 通知 |
| Help | 說明 |
| Insights (AI feature) | 分析 |
| Journey (milestones) | 旅程 |
| Badges | 徽章 |
| Friends / Social | 好友 |
| Team (tab) | 球隊 |
| Gear (tab) | 裝備 |
| Coach / Coaching | 教練 / 指導 |
| your bowlers (coach's view) | 我的球員 |
| Side Games | 場邊彩池 |
| Brackets | 對戰籤表 |
| Just Bowling / Open bowling / Casual | 自由打 |
| Practice | 練習 |
| League | 聯賽 |
| Tournament | 比賽 |
| Scores only | 只記分數 |
| Subscribe / subscription | 訂閱 |
| Free trial | 免費試用 |
| Sign in / sign out | 登入 / 登出 |
| Import (scorecard) | 匯入 |
| Share | 分享 |
| Log / record | 記錄 |
| Bag(s) | 球袋 |
| Ball(s) | 球 (a bowling ball: 保齡球 / 球; measure word 顆) |
| Arsenal | 球具庫 |
| Night / tonight (league or tournament) | 今天 ("tonight" = 今天, not 今晚 — leagues are not always at night); session (practice) = 這次練習 |
| Delete my account | 刪除帳號 |
| teammate | 隊友 |
| Prebowling | 預打 |
| account | 帳號 |
| plan (subscription) | 方案 |

## Bowling terminology (see glossary-zh-TW.md)

| English | Chinese |
|---|---|
| bowling (the sport) | 保齡球 |
| bowler | 球友 (a player in general), 選手 (in competition) |
| bowling center | 保齡球館 |
| strike | 全倒 |
| spare | 補中 |
| split | 技術球 |
| convert a spare / convert a split | 補中 / 把技術球補掉 |
| gutter | 洗溝 |
| frame / 10th frame | 格 (計分格) / 第 10 格 |
| open frame | 失誤 (失誤格) |
| clean frame | 沒有失誤的一格 |
| game / series | 局 / 系列（總分） |
| score / scoresheet | 分數 / 計分表 |
| pinfall | 擊倒瓶數 |
| mark | 記號（全倒或補中） |
| double / turkey | Double / 火雞 |
| perfect game / clean game (no open frames) | 300 分滿分局 / 無失誤局 |
| first ball / second ball | 第一球 / 第二球 |
| fill ball | 加球 |
| foul / foul line | 犯規 / 犯規線 |
| pin / headpin | 球瓶 / 1 號瓶 |
| pocket | Pocket（1、3 號瓶之間） — short: Pocket |
| leave | 殘瓶 |
| single-pin spare | 單瓶補中 |
| corner pin / 10 pin | 角瓶 / 10 號瓶 |
| ringing 10 / weak 10 | 顫動的 10 號瓶（ringing 10） / 軟 10 號瓶（weak 10） |
| 7-10 split / big four / greek church / baby split / washout / bucket | 7-10 技術球 / Big Four / Greek Church / Baby Split / Washout / Bucket（名稱保留英文） |
| messenger | 飛瓶 |
| light hit / high hit | 打薄 / 打厚 |
| Brooklyn (crossover hit) | 反邊（Brooklyn） — never confuse with the assistant, who is always Brooklyn |
| carry | 帶瓶 |
| lane | 球道 |
| approach / arrows / dots / boards | 助走道 / 箭頭 / 圓點 / 板 (第 10 板) |
| breakpoint | 轉折點 |
| oil pattern / lane condition | 油型 / 球道狀況 |
| house shot / sport shot | 館內油型 / 運動油型 |
| transition / carrydown / breakdown | 油況變化 / 油被帶到後段 / 油被打散 |
| ball / strike ball / spare ball | 球 / 攻擊球 / 補中球 |
| coverstock / core | 球皮 / 球心 |
| solid / pearl / hybrid / urethane / plastic | 實心 / 珍珠 / 混合 / 聚氨酯 / 塑膠 |
| symmetric / asymmetric | 對稱 / 非對稱 |
| RG / differential / intermediate differential | RG / 差值 / 中間差值 |
| layout / PAP | 鑽孔配置 / PAP |
| drilling / finger holes / thumb hole | 鑽孔 / 指孔 / 拇指孔 |
| release / hook | 出手 / 曲球 (to hook: 轉彎) |
| straight ball | 直球 |
| rev rate / ball speed | 轉速 / 球速 |
| axis rotation / axis tilt | 軸心旋轉 / 軸心傾斜 |
| one-handed / two-handed | 單手 / 雙手 |
| right-handed / left-handed | 右手 / 左手 |
| stroker / cranker / tweener | 穩定型（stroker） / 高轉速型（cranker） / 中間型（tweener） |
| league / team / roster | 聯賽 / 球隊 / 隊員名單 |
| sub | 替補 |
| captain | 隊長 |
| bowling order | 出場順序 |
| handicap / scratch | 讓分 / 不讓分 |
| average / book average | 平均 / 官方平均 |
| high game / high series | 單局最高分 / 系列最高分 |
| standings / points | 排名 / 積分 |
| match play / head-to-head | 對戰賽 / 一對一 |
| position round | 排位賽 |
| absent / blind / vacancy | 缺席 / 缺席補分 (blind) / 空缺 |
| baker format | Baker 賽制 |
| league night / season | 聯賽日 / 賽季 |
| tournament / qualifying / cut | 比賽 / 資格賽 / 晉級線 |
| stepladder / squad / seed | 階梯賽 / 梯次 / 種子 |
| cashed | 進入獎金名次 |
| bonus pins | 獎勵分 |
| side pot / jackpot | 彩池 / 累積彩池 |
| buy-in / entry fee / winnings | 報名費 / 報名費 / 獎金 |
| drill (exercise) | 練習項目 |
| score spread | 分數落差 |

## Leave empty ("")

- **Text no one reads:** CSS values, keys, code identifiers, regexes, calendar rules, debug and log lines, and developer errors.
- **Instructions and data sent to the AI model.** But translate anything in those files that the bowler could see.
- **Help search keywords are NOT empty.** Give the Chinese words a Taiwanese bowler would type.
- **Same as Korean:** where the Korean entry is empty, the Chinese entry is empty too.

## Fragments

A `fragment` is a piece of a sentence that React renders around other elements or values. Chinese word order differs from English, so:

- Translate each piece so the pieces, **read in the English order**, still make natural Chinese. When "Delete ⟨0⟩?" is split into fragments, choose wording like "刪除：" + name + "？" rather than a sentence that needs the name somewhere else.
- Look at the source to see which pieces sit next to each other.
- Do not leave English.

## Context entries

A key like `theme::Light` is used where one English word needs a different Chinese word on one screen. Translate for that context.

## Quality bar

Before writing your file, re-read every translation and check:

- The meaning is the same as the English.
- The Chinese is natural Taiwanese usage, not translationese: 你 in the app, Traditional characters in Taiwan forms, no mainland vocabulary, full-width punctuation, a half-width space between Chinese and Latin/digits.
- Glossary terms are used.
- Placeholders are intact, with measure words where a number is inserted.
- ⟨n⟩ tokens are in order.
- No English is left (except the names above).
