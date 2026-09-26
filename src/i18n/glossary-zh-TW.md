# Ten-pin bowling glossary: English to Traditional Chinese, Taiwan (zh-TW)

Taiwanese bowlers mix Chinese terms with English ones: scoreboards and players say 全倒, 補中, 洗溝 and 火雞, but also "Double" and "Pocket", and they name splits in English (Big Four, Greek Church). The full term table is in `style-zh-TW.md`. This file records the sources and the choices that were not obvious.

## Sources

- [東吳大學體育室：運動小教室－保齡球篇](https://web-ch.scu.edu.tw/physical/web_page/1491) is the source for:
  - 全倒 / 全中 (strike), 補中 (spare), 溝球 / 洗溝 (gutter), 失誤 (a frame left open after two balls), 火雞 (turkey), 球瓶 (pin), 球道 (lane), and the approach described as 助走用的走道.
- [維基百科（台灣正體）：保齡球](https://zh.wikipedia.org/zh-tw/%E4%BF%9D%E9%BD%A1%E7%90%83) uses 計分格 (frame), 局 (game), 犯規 / 犯規線 (foul / foul line), 失誤 (open frame).
- [中華奧林匹克委員會：保齡球](https://www.tpenoc.net/sport/bowling/) uses 計分格 and 局, and strike / spare as 全倒（全中）/ 補中.
- [體育運動大辭典（國立臺灣師範大學）：技術球（保齡球） split](https://sportspedia.perdc.ntnu.edu.tw/content.php?wid=2066) is the national sports dictionary's entry for **技術球** = split. [flyingbowling 規則指南](https://zh-tw.flyingbowling.com/blog/bowling-rules-scoring-the-ultimate-novice-to-pro-guide.html) uses the same term, plus 早安雞 / 海底雞 for turkeys at the start / end of a game.
- [金融財子：保齡球推薦](https://tyaward.com.tw/%E7%94%A2%E5%93%81%E8%A9%95%E5%83%B9/%E9%81%8B%E5%8B%95%E7%94%A8%E5%93%81/%E5%85%B6%E4%BB%96%E9%81%8B%E5%8B%95%E7%94%A8%E5%93%81/%E4%BF%9D%E9%BD%A1%E7%90%83/%E4%BF%9D%E9%BD%A1%E7%90%83%E6%8E%A8%E8%96%A6/) and [凡凡的開箱筆記：保齡球推薦](https://fanfan-select.pixnet.net/blog/posts/884269047225660138) use: 曲球 (hook), 直球 (straight ball), 飛碟球 (the spinner / "UFO" style), 球心 (core), 對稱 / 非對稱 (symmetric / asymmetric core), RG 值, 差值 (differential), 球皮 (coverstock), 反應性球皮 (reactive), 殘瓶 (leave), 指孔 (finger holes), 開孔 / 鑽孔 (drilling), 乾路 (dry lanes), 主力攻擊球 (strike ball).

## Decisions

| Term | Chosen | Why |
|---|---|---|
| strike | **全倒** | Used by every source; 全中 is the same thing and also understood. |
| split | **技術球** | The national sports dictionary's term. |
| open frame | **失誤** | Used by the university page and Wikipedia; "失誤格" where a noun for the frame is clearer. |
| leave | **殘瓶** | Used by Taiwanese buyer's guides for the pins left after the first ball. |
| double | **Double** | Taiwanese bowlers and scoreboards say it in English; there is no settled Chinese word. |
| pocket | **Pocket** | Kept in English, glossed once as 1、3 號瓶之間 where the meaning is not obvious. |
| spare ball | **補中球** | Plain and self-explanatory; 解球 is pro-shop jargon. |
| strike ball | **攻擊球** | From 主力攻擊球. |
| tournament | **比賽** | The everyday word; 錦標賽 is kept for a named championship. |
| open bowling / casual | **自由打** | Bowling outside a league or tournament. |
| arsenal | **球具庫** | A bowler's set of balls. |
| inbox | **通知** | The app's inbox holds notices and messages, not email. |
| bowler | **球友** | How Taiwanese bowlers address each other; 選手 in competition. |
| you | **你** in the app, **您** on the legal pages | Taiwanese consumer apps use 你. |

## Descriptive choices (no settled Taiwanese term found)

These are plain descriptions, chosen because no source above gave a common Taiwanese term. A native reviewer should check them first:

- messenger 飛瓶, carry 帶瓶, light hit / high hit 打薄 / 打厚, ringing 10 / weak 10, Brooklyn (crossover hit) 反邊.
- stroker / cranker / tweener: 穩定型 / 高轉速型 / 中間型, each with the English in brackets the first time it appears on a screen.
- transition / carrydown / breakdown: 油況變化 / 油被帶到後段 / 油被打散.
- side pot 彩池, brackets 對戰籤表.

## Numbers and time

- Taiwan writes numbers as the English app does (198.4, 1,250, 54%), so they stay as they are. New Taiwan dollars are written NT$170.
- The runtime (`chineseNumbers` in `engine.js`) only rewrites:
  - 12-hour times to "下午 7:30" / "上午 9:00".
  - English ordinals to places ("第 3 名"), and seeds to "第 2 種子".
- `chinesePunctuation` removes spaces next to full-width punctuation and doubled spaces.
