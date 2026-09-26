// Traditional Chinese for Taiwan (zh-TW) for My Bowling Journey.
//
// English -> Chinese, in the same shape as ko-KR.js. `exact` is whole
// text; `patterns` are texts built in code, {0} {1}... being the values
// (see src/i18n/engine.js). An empty string means "looked at, not text a
// person reads" and is skipped. "lang": "zh" gives the Taiwanese number,
// time and spacing rules (chineseNumbers, chinesePunctuation): a
// half-width space between Chinese and Latin letters or digits is added
// at runtime, so entries need not carry it.
//
// Edit entries here directly. After adding English text to the app, run
//   node scripts/i18n_extract.cjs --missing
// to list what still needs an entry here and in the other catalogs.
// Terminology and style: src/i18n/glossary-zh-TW.md and src/i18n/style-zh-TW.md.
export const ZH_TW = {
"lang": "zh",
"exact": {
"Group": "群組",
"Ungrouped": "未分組",
"Coverstock": "球皮",
"Core": "球心",
"Weight (lb)": "重量（lb）",
"Diff": "Diff",
"Int. Diff (asymmetric only)": "中間 Diff（僅限非對稱球心）",
"Layout System": "鑽孔配置系統",
"Add": "新增",
"'s balls to start logging shots.": "的球，就能開始記錄投球。",
"Active": "使用中",
"Archive": "封存",
"Done": "完成",
"Details": "詳細資料",
"Remove": "移除",
"Cancel": "取消",
"No games logged with it yet": "還沒有用這顆球記錄任何一局",
"No layout recorded": "未記錄鑽孔配置",
"Specs": "規格",
"Layout": "鑽孔配置",
"Throwing it again": "再次使用",
"No longer throwing this ball? Archiving takes it out of your arsenal and bags and keeps every shot you logged with it.": "不再用這顆球了嗎？封存後，它會從你的球具庫和球袋中移除，但你用它記錄的每一球都會保留。",
"Archive this ball": "封存這顆球",
"Specs Removed": "規格已移除",
"Other bowlers reported the shared specs for": "其他球友回報這顆球的共享規格有誤，已經移除：",
"as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "。球還在你這裡——有空時再重新輸入它的資料就好。",
"Got it": "知道了",
"Group by": "分組方式",
"Your groups": "你的群組",
"Delete": "刪除",
"New group, e.g. Dry lanes": "新群組，例如：乾路",
"To put a ball in a group, open the ball and pick the group under its specs.": "要把球放進群組，請打開那顆球，在規格下方選擇群組。",
"Enter the code from your email.": "請輸入電子郵件中的驗證碼。",
"Couldn't delete the account. Try again, or email support@mybowlingjourney.com.": "無法刪除帳號。請再試一次，或寄信到 support@mybowlingjourney.com。",
"The server didn't confirm the deletion. Nothing has been removed — email support@mybowlingjourney.com.": "伺服器沒有確認刪除。沒有任何資料被刪除——請寄信到 support@mybowlingjourney.com。",
"Couldn't reach the server. Nothing has been deleted.": "無法連線到伺服器。沒有任何資料被刪除。",
"Not signed in or name is empty": "尚未登入，或名稱是空白的",
"unknown reason": "原因不明",
"useAuth must be used inside <AuthProvider>": "",
"That code did not work. Check it came through in one piece.": "這個代碼無法使用。請確認你收到的是完整的代碼。",
"Your badges": "你的徽章",
"Your open bowling badges": "你的自由打徽章",
"of": "/",
"Bowl a league night, a tournament or a practice session to start.": "打一次聯賽、比賽或練習就開始了。",
"Bowl a night with the group and the first one is yours.": "和朋友們打一次球，第一枚就是你的。",
"Every one of them.": "一枚不漏，全部到手。",
"Every one of them. Including the ones nobody wants.": "一枚不漏，全部到手。連沒人想要的那幾枚也是。",
"Some come from one good night, some take a season.": "有的打得好一次就能拿到，有的要花上一整個賽季。",
"Not all of them are about bowling well — some are about showing up, and one or two you'd rather not have.": "不是每一枚都看你打得好不好——有些只要常來打就有，還有一兩枚你大概寧願不要。",
"Share my badges": "分享我的徽章",
"The collection": "徽章收藏",
"All": "全部",
"Earned": "已獲得",
"None yet.": "還沒有。",
"None yet. Bowl a night with the group and the first one is yours.": "還沒有。和朋友們打一次球，第一枚就是你的。",
"Nothing left. You have all of them.": "一枚也不剩了。你已經全部到手。",
"Someone sent you your badges?": "有人把你的徽章傳給你了嗎？",
"Paste the code from their message and your nights come across. Doing it twice is harmless — nothing doubles up.": "貼上對方訊息裡的代碼，你打球的紀錄就會匯過來。重複貼上也沒關係——不會重複計算。",
"Paste the code": "貼上代碼",
"Load": "載入",
"Edit Bag": "編輯球袋",
"New Bag": "新球袋",
"Name": "名稱",
"e.g. Short pattern, 6 ball limit": "例如：短油型，限帶 6 顆球",
"Type": "類型",
"Balls Allowed": "可帶球數",
"The total the tournament allows. Leave blank for no limit.": "比賽允許攜帶的總數。沒有限制就留空。",
"e.g. 6": "例如：6",
"Plan to include a plastic": "預計帶一顆塑膠球",
"A note for your own planning — it doesn't change the limit above.": "給你自己規劃用的備註——不會改變上方的限制。",
"Save Bag": "儲存球袋",
"Give the bag a name to save it.": "請幫球袋取個名稱才能儲存。",
"Add a bag": "新增球袋",
"What you carry to league differs from what you carry to a tournament — and tournaments often cap how many balls you may bring, so you can keep several.": "打聯賽帶的球和打比賽帶的不一樣——而且比賽常會限制能帶幾顆球，所以你可以建立好幾個球袋。",
"+ League Bag": "+ 聯賽球袋",
"+ Tournament Bag": "+ 比賽球袋",
"More bags": "更多球袋",
"The free plan covers": "免費方案提供",
"league bag and": "個聯賽球袋和",
"tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.": "個比賽球袋。額外的球袋（例如短油型比賽球袋、運動油型球袋）屬於付費方案。你已經裝好的球都不會消失。",
"Bags": "球袋",
"No bags yet. Add one above.": "還沒有球袋。請在上方新增。",
"ball": "顆球",
"· plastic planned": "· 預計帶一顆塑膠球",
"Edit": "編輯",
"Keep": "保留",
"🔒 Pro — kept exactly as packed, and back the moment you subscribe.": "🔒 Pro——會照你裝好的樣子完整保留，一訂閱就立刻回來。",
"Full — remove a ball before adding another.": "已滿——要先拿出一顆球才能再放。",
"Empty. Add balls from below.": "空的。請從下方加入球。",
"Add Balls to a Bag": "把球放進球袋",
"Every ball is packed. Practice always shows every ball regardless.": "每顆球都已放進球袋。練習時一律會顯示所有的球。",
"· not in any bag": "· 不在任何球袋中",
"Community Specs": "社群規格",
"Nobody has shared specs for this ball yet. If you've filled yours in, you can share them so other bowlers don't have to type them.": "還沒有人分享這顆球的規格。如果你已經填好自己的，可以分享出來，其他球友就不必自己輸入。",
"Share My Specs": "分享我的規格",
"Yours": "你的",
"No details recorded": "沒有記錄規格",
"Showing the": "目前顯示",
"lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.": "lb 的數值——RG 和差值會隨重量不同，而這顆球公布了不只一種重量的數值。",
"No published numbers for": "沒有專門針對",
"lb specifically — showing the reference weight instead.": "lb 公布的數值——改為顯示參考重量的數值。",
"more": "個",
"to": "至",
"Applied": "已套用",
"Use These": "使用這組",
"✓ Looks right": "✓ 沒錯",
"Looks right": "沒錯",
"✓ Wrong": "✓ 有誤",
"Wrong": "有誤",
"Update Shared": "更新共享規格",
"Locked — enough bowlers have confirmed these that they can't be edited.": "已鎖定——已有足夠多的球友確認這組規格，無法再編輯。",
"Voting closed.": "投票已結束。",
"Share Mine Instead": "改為分享我的規格",
"Ball path": "球路",
"First balls at a full rack only": "只計算 10 支球瓶全立時的第一球",
"what a strike ball is for.": "這正是攻擊球的用途。",
"Add a ball (e.g. Storm Phaze II)": "新增一顆球（例如 Storm Phaze II）",
"From other bowlers": "來自其他球友",
"Specs entered by other bowlers, not manufacturer data — check them after adding.": "這些規格是其他球友輸入的，不是廠商資料——新增後請再確認一次。",
"Strike % through the night": "當天全倒率走勢",
"How each ball carried as the lanes went, first games to last.": "隨著球道狀況改變，每顆球從前幾局到最後幾局的帶瓶表現。",
"Ball": "球",
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than": "每個數字都是全倒率。粗體代表該階段領先；差距小到可能只是運氣時，就不會有粗體。琥珀色的數字背後不到",
"shots behind it, so treat it as preliminary. A dash means no shots at all.": "球，請當作初步參考。橫線表示完全沒有投球。",
"Rubbing the lamp…": "正在擦神燈…",
"Reading your numbers…": "正在看你的數字…",
"Working out what they mean…": "正在想這些數字代表什麼…",
"Still going — it is a fair question…": "還在想——這問題值得好好想想…",
"You've used all": "你今天已經用完全部",
"today.": "了。",
"is back tomorrow.": "明天會回來。",
"The Stats screens cover the usual numbers.": "「統計」頁面涵蓋一般常見的數字。",
"is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.": "負責回答那些頁面答不了的問題——問問你自己打球的狀況，她會從你記錄的資料裡找出答案。如果需要你還沒記錄的項目，她會告訴你該開始記錄什麼。",
"Ask about your bowling…": "問問關於你打球的事…",
"Ask": "提問",
"That": "這個回答",
"Tour": "",
"Journey": "旅程",
"Home": "首頁",
"BadgeCollection": "",
"TeamManagement": "",
"Friends": "好友",
"StatsView": "",
"ImportScorecard": "",
"Settings": "設定",
"Profile": "個人檔案",
"TrendsView": "",
"CoachingView": "",
"InsightsView": "",
"A team with that name already exists in this league.": "這個聯賽已經有同名的球隊了。",
"Could not clear the sync markers on this device. Nothing was changed.": "無法清除這台裝置上的同步標記。沒有做任何變更。",
"Only the bowler who added this league can combine it. Ask them, or join the shared league from a team code.": "只有新增這個聯賽的球友可以合併。請找對方處理，或用球隊代碼參加共享聯賽。",
"Couldn't combine them just now. Nothing was changed — try again in a moment.": "目前無法合併。沒有做任何變更——請稍後再試。",
"You already have a league with that name. Rename yours first, then join this one.": "你已經有同名的聯賽了。請先把你的聯賽改名，再參加這個聯賽。",
"Couldn't join that league just now. Check your connection and try again.": "目前無法參加這個聯賽。請檢查網路連線後再試一次。",
"A league with that name already exists.": "已經有同名的聯賽了。",
"Pick a bowler first.": "請先選擇球友。",
"Give the ball a name.": "請替這顆球取個名稱。",
"Location is needed to find nearby centers. Allow location access, or add the center by name.": "需要位置資訊才能找到附近的保齡球館。請允許存取位置，或直接輸入名稱新增球館。",
"Couldn't search for centers right now. You can add the center by name instead.": "目前無法搜尋保齡球館。你可以改用名稱新增球館。",
"this team": "這支球隊",
"That request was already answered, or couldn't be reached. Refreshing.": "這個請求已經回覆過，或無法連線。正在重新整理。",
"the team": "球隊",
"They": "這位球友",
"your team": "球隊",
"Couldn't join that team just now — try again in a moment.": "目前無法加入這支球隊——請稍後再試。",
"Someone": "有人",
"Couldn't make a code just now — check your connection and try again.": "目前無法產生代碼——請檢查網路連線後再試一次。",
"That code doesn't look right — it's 8 characters.": "代碼好像不對——代碼是 8 個字元。",
"That code is not valid.": "代碼無效。",
"That doesn't look like a team code.": "這看起來不像球隊代碼。",
"Couldn't check that code — you may be offline. You can enter it later in Settings.": "無法確認代碼——你可能已離線。之後可以在「設定」中輸入。",
"Give the tournament a name first — it's on the Set up tab.": "請先替比賽取個名稱——在「準備」分頁。",
"Weak 10": "軟 10 號瓶",
"Ringing 10": "顫動的 10 號瓶",
"Other Leave": "其他殘瓶",
"9 Pin No-Tap": "9 瓶算全倒",
"Yes": "是",
"Not a valid backup file": "不是有效的備份檔案",
"No shots logged yet for this night": "這次打球還沒有記錄任何投球",
"The lamp flickered and went quiet. Try again in a few minutes.": "神燈閃了幾下就沒動靜了。請過幾分鐘再試一次。",
"Brooklyn had no answer for that.": "Brooklyn 對這個問題沒有答案。",
"open bowling": "",
"Sunday": "週日",
"Monday": "週一",
"Tuesday": "週二",
"Wednesday": "週三",
"Thursday": "週四",
"Friday": "週五",
"Saturday": "週六",
"Couldn't get your insights right now. Try again in a few minutes.": "目前無法取得你的分析。請過幾分鐘再試。",
"Bowl": "打球",
"Standings": "排名",
"Setup": "準備",
"Stats": "統計",
"Improve": "進步",
"History": "紀錄",
"House Shot": "館內油型",
"Back": "返回",
"Inbox": "通知",
"Coach": "教練",
"Help": "說明",
"Results": "結果",
"Import scorecard": "匯入計分表",
"My Bowling Journey Pro": "My Bowling Journey Pro",
"⟳ Backing up": "⟳ 備份中",
"Import": "匯入",
"You're all set": "一切就緒",
"We know you're keen to get started — so we won't hold you up for long. We'd just like to show you around first.": "我們知道你迫不及待想開始——不會耽誤你太久，只是想先帶你看看。",
"And remember, you can document as much or as little as you want. The more you tell us, the more we can give back.": "還有，要記錄多少都隨你。你告訴我們越多，我們能回饋給你的就越多。",
"Begin": "開始",
"No thanks — I'll take the tour later from the settings menu": "不用了——我之後再從設定選單看導覽",
"Close": "關閉",
"change is": "項變更",
"changes are": "項變更",
"saved on this phone. Nothing is lost.": "已儲存在這支手機上。沒有任何遺失。",
"Trying…": "重試中…",
"Try again now": "立即重試",
"Loading…": "載入中…",
"🧑‍🏫 Coach": "🧑‍🏫 教練",
"🎯 Start a practice drill": "🎯 開始練習項目",
"Competitive": "競賽",
"Open bowling": "自由打",
"a team": "球隊",
"A bowler": "有位球友",
"Joining lets teammates see your scores and yours theirs.": "加入後，你和隊友可以互相看到彼此的分數。",
"Anyone on the team can answer.": "球隊裡任何人都可以處理。",
"Join": "加入",
"Approve": "核准",
"No thanks": "不用了",
"Decline": "拒絕",
"Nothing Waiting": "沒有待處理的項目",
"Requests, coach tasks and scores to confirm show up here.": "需要確認的申請、教練指派的任務和分數會顯示在這裡。",
"Balls": "球",
"League": "聯賽",
"Team": "球隊",
"waiting for you": "項等你處理",
"1px solid transparent": "",
"Practice": "練習",
"Tournament": "比賽",
"🏆 Won it": "🏆 冠軍",
"🥈 Runner-up": "🥈 亞軍",
"🏅 Top five": "🏅 前五名",
"💰 Cashed": "💰 進入獎金名次",
"✅ Made the cut": "✅ 晉級",
"QUALIFYING": "資格賽",
"total ·": "（總分）·",
"average ·": "（平均）·",
"high": "（最高）",
"vs the cut": "（距晉級線）",
"MATCH PLAY": "對戰賽",
"match": "場",
"with bonus": "（含獎勵分）",
"STEPLADDER": "階梯賽",
"step": "關",
"won": "贏",
"Nothing logged yet. Once you've bowled a night or two, this shows the shape of a month — which weeks you bowled and which you missed.": "還沒有任何紀錄。打過一兩次之後，這裡會呈現一個月的全貌——哪幾週有打、哪幾週沒打。",
"Earlier month": "上個月",
"Later month": "下個月",
"Nothing bowled this month": "這個月沒有打球紀錄",
"Bowling": "自由打",
"series ·": "（系列總分）·",
"% strikes": "% 全倒",
"Delete this night?": "要刪除這次紀錄嗎？",
"game": "局",
"and every frame logged with them. This cannot be undone.": "和其中記錄的每一格都會刪除，且無法復原。",
"Yes, delete it": "是，刪除",
"Keep it": "保留",
"Delete this night": "刪除這次紀錄",
"Nobody here yet. Add people to your scoresheet on the Bowl tab and they'll show up once you've bowled a night together.": "目前還沒有人。在「打球」分頁的計分表中加入一起打的人，你們一起打過一次後，他們就會出現在這裡。",
"Everyone you've bowled with, by average.": "所有和你一起打過球的人，依平均排序。",
"Add someone to compare against.": "加入其他人來比較看看吧。",
"Share standings": "分享排名",
"night": "次",
"best": "最高",
"win": "次獲勝",
"See all my badges ›": "查看我所有的徽章 ›",
"Change": "變更",
"Pins": "置瓶機",
"Which lanes are free fall? Everything else counts as string.": "哪些球道是自由落瓶式？其餘都算繩索式。",
"e.g. 1-8, 15, 16": "例如：1-8, 15, 16",
"Until these are set, this house stays out of the free fall vs string comparison.": "設定之前，這間球館不會列入自由落瓶式與繩索式的比較。",
"Bowling Center": "保齡球館",
"Where do you usually practice? Setting it lets you compare how you score house to house.": "你通常在哪裡練習？設定後就能比較你在不同球館的分數。",
"Where do you usually bowl for fun? Setting it lets you compare how you score house to house.": "你通常在哪裡自由打？設定後就能比較你在不同球館的分數。",
"this league": "這個聯賽",
"Search by name, e.g. Arsenal Bowl": "用名稱搜尋，例如 Arsenal Bowl",
"Searching…": "搜尋中…",
"No centers found nearby. You can add it by name below.": "附近找不到球館。你可以在下方用名稱新增。",
"This list": "這份清單",
"check the name and address before you rely on it": "使用前請先確認名稱和地址",
"mi": "英里",
"Can't find it? Add by name": "找不到嗎？用名稱新增",
"Center name": "球館名稱",
"Target:": "目標：",
"reached": "實際",
"short)": "之差)",
"Due": "期限",
"Worked on it": "練過了",
"What did you get to?": "你達到多少？",
"Anything to tell your coach?": "有什麼想跟教練說的嗎？",
"Save": "儲存",
"Reopen": "重新開啟",
"Give the task a title.": "請輸入任務標題。",
"What should they work on?": "要練習什麼？",
"Detail (optional)": "詳細說明（選填）",
"Measurable target (optional)": "可量化的目標（選填）",
"No target": "不設目標",
"Target": "目標",
"Assign": "指派",
"Nothing here yet. Both of you can write, and you both see everything.": "目前還沒有內容。你們兩個人都可以留言，也都看得到所有內容。",
"You": "你",
"Add a note…": "新增筆記…",
"Post": "送出",
"Coaching": "指導",
"Working with a coach — shared goals, drills they set you, and notes back and forth — is part of the paid plan. Everything you have logged is untouched, and any coach already linked to you stays linked.": "和教練一起練習——共同目標、教練指派的練習項目，以及雙方往來的筆記——屬於付費方案。你記錄的所有資料都不會變動，已經連結的教練也會保持連結。",
"Your bowlers": "我的球員",
"Everyone at a glance — what they're working on, how far along, and when you next see them.": "所有人一目了然——正在練什麼、進度到哪裡，以及下次什麼時候上課。",
"+ Add a bowler": "+ 新增球員",
"no session set": "尚未安排課程",
"Nothing assigned yet.": "尚未指派任務。",
"— no result logged yet.": "——尚未記錄結果。",
"Bowls": "下次聯賽：",
"on": "，",
"View": "檢視",
"I'm bowling": "我在打球",
"I'm coaching": "我在指導",
"Showing the bowlers you coach.": "正在顯示你指導的球友。",
"Showing your own game. Switch to see the people you coach.": "正在顯示你自己的成績。切換後可以查看你指導的球友。",
"Requests": "邀請",
"Someone wants to connect.": "有人想和你連結。",
"wants to be your": "想成為你的",
"Accept": "接受",
"Waiting On Them": "等待對方回覆",
"— asked to be your": "——已申請成為你的",
"Nobody yet. Make a code and read it to them — they enter it on their own phone, and from then on you'll see their sessions, set tasks and track progress here.": "還沒有人。建立一組代碼唸給對方聽——對方在自己的手機上輸入後，你就能在這裡看到對方的打球紀錄、指派任務並追蹤進度。",
"Your Bowlers": "我的球員",
"Your Coaches": "我的教練",
"Nobody connected yet.": "還沒有連結任何人。",
"Connect with someone": "與他人連結",
"Read this to the bowler you're coaching.": "把這組代碼唸給你指導的球友聽。",
"Read this to your coach.": "把這組代碼唸給你的教練聽。",
"Works once, for the next 7 days.": "只能使用一次，7 天內有效。",
"They coach me": "對方指導我",
"I coach them": "我指導對方",
"Create a code": "建立代碼",
"They enter it on their own phone and you": "對方在自己的手機上輸入後，你們",
"re connected — no searching for each other by name.": "就完成連結了——不用互相搜尋名字。",
"Got a code?": "有代碼嗎？",
"ABCD-2345": "ABCD-2345",
"Coaching code": "指導代碼",
"Connect": "連結",
"Connected. They": "已連結。",
"re in the list above.": "對方會出現在上方清單中。",
"Pick something to work on": "選一個要加強的項目",
"Set this goal": "設定這個目標",
"They'll see it on their Improve tab in bowling terms, and it tracks itself as they bowl.": "對方會在「進步」分頁上看到以保齡球用語呈現的目標，打球時進度會自動追蹤。",
"Clear": "清除",
"Where and when, e.g. 6pm lanes 9-10 at Sunset": "地點和時間，例如：下午 6 點，Sunset 保齡球館第 9-10 道",
"Shows on your roster above. Leave it blank if you work session to session.": "會顯示在上方的「我的球員」清單中。如果你都是一次一次約課，這裡留空即可。",
"Nothing bowled yet. Their scores appear here once they save a session.": "還沒有打球紀錄。對方儲存一次打球紀錄後，分數就會顯示在這裡。",
"Average": "平均",
"High": "最高分",
"Nights": "打球次數",
"From": "根據",
"shots": "球",
"Strike": "全倒",
"Spare": "補中",
"Single Pin": "單瓶補中",
"Split": "技術球",
"Misses:": "未補中：",
"Recent": "最近",
"+ Assign a task": "+ 指派任務",
"No tasks yet — set one above and it'll show in their inbox.": "還沒有任務——在上方設定一個，就會出現在對方的「通知」中。",
"Done & Attempted": "已完成和已嘗試",
"Notes": "筆記",
"Both of you can read and write here.": "你們兩個人都可以在這裡閱讀和書寫。",
"End coaching relationship": "結束指導關係",
"Plastic": "塑膠",
"Just Bowling": "自由打",
"Imported": "匯入紀錄",
"Ion Max Solid": "Ion Max Solid",
"Ion Max Pearl": "Ion Max Pearl",
"Phaze II Solid": "Phaze II Solid",
"Phaze II Pearl": "Phaze II Pearl",
"Harsh Reality Pearl": "Harsh Reality Pearl",
"Road Warrior Pearl": "Road Warrior Pearl",
"Equinox Pearl": "Equinox Pearl",
"Box": "出廠狀態",
"Polish": "拋光",
"Lane Shine": "球道磨亮",
"Weak 7": "軟 7 號瓶",
"Ringing 7": "顫動的 7 號瓶",
"Half Pocket": "半 Pocket",
"Trip 4": "Trip 4",
"Kick 10": "Kick 10",
"Acceptable": "尚可",
"Fast": "太快",
"Slow": "太慢",
"Too early": "太早轉彎",
"Too late": "太晚轉彎",
"Too round": "弧線太圓",
"Too sharp": "轉彎太銳利",
"Roll out": "後段沒力",
"Poor carry": "帶瓶不佳",
"No miss room": "沒有容錯空間",
"Lane transition": "油況變化",
"Surface worn": "表面磨損",
"Perfect game": "300 分滿分局",
"300. Nothing left to take off it.": "300 分。已經沒有可以再挑剔的地方了。",
"Honor series": "榮譽系列",
"New personal best game": "個人單局新高",
"New personal best series": "個人系列新高",
"Won it": "冠軍",
"Top five": "前五名",
"Cashed": "進入獎金名次",
"Made the cut": "晉級",
"Didn't cash": "未進入獎金名次",
"strike rate": "全倒率",
"spare conversion": "補中率",
"ten pin conversion": "10 號瓶補中率",
"split conversion": "技術球補中率",
"single-pin conversion": "單瓶補中率",
"corner-pin conversion": "角瓶補中率",
"open frames per game": "每局失誤數",
"average by game": "各局次的平均",
"score spread": "分數落差",
"most common leave": "最常見的殘瓶",
"Nothing in that link.": "這個連結裡沒有任何資料。",
"that night": "那次的紀錄",
"No limit": "無上限",
"Official": "官方",
"Unconfirmed": "未確認",
"Community approved": "社群認可",
"Verified": "已驗證",
"Disputed": "有爭議",
"Manufacturer specifications.": "廠商規格。",
"Reported as incorrect. These specs have been removed.": "已被回報為錯誤，這些規格已移除。",
"Entered by another bowler and not yet confirmed. Check before trusting it.": "由其他球友輸入，尚未確認。採用前請先查證。",
"Fresh": "前段",
"Transition": "中段",
"Late": "後段",
"Strong - Smooth": "強 - 平順",
"Strong - Sharp": "強 - 銳利",
"Benchmark - Smooth": "基準 - 平順",
"Benchmark - Sharp": "基準 - 銳利",
"Weak - Smooth": "弱 - 平順",
"Weak - Sharp": "弱 - 銳利",
"Urethane": "聚氨酯",
"Solid": "實心",
"Pearl": "珍珠",
"Hybrid": "混合",
"Symmetric": "對稱",
"Asymmetric": "非對稱",
"All Balls": "所有球",
"Not specified": "未指定",
"Compare yourself with a teammate. Log a night with more than one bowler.": "跟隊友比一比。請記錄一次有兩位以上球友一起打的紀錄。",
"Your team's best games and series. Needs team-mates with logged scores.": "球隊的單局最高分和系列最高分。需要隊友也記錄分數。",
"Your high game and high series. Fills in once you have a game logged.": "你的單局最高分和系列最高分。記錄一局後就會顯示。",
"Win-loss record. Record match results on a league night.": "勝負紀錄。請在聯賽日記錄對戰結果。",
"Points won each week. Record match results on a league night.": "每週拿到的積分。請在聯賽日記錄對戰結果。",
"How handicap changes results. Set a book average for the roster.": "讓分如何改變結果。請為隊員名單設定官方平均。",
"Team averages ranked. Add bowlers to your team.": "球隊平均排名。請把球友加入你的球隊。",
"Wins against higher-average teams. Record match results.": "贏過平均更高球隊的場次。請記錄對戰結果。",
"Games decided by a handful of pins. Record match results.": "只差幾分就分出勝負的局。請記錄對戰結果。",
"Team totals by night. Needs team-mates with logged scores.": "每次打球的球隊總分。需要隊友也記錄分數。",
"Averages by house. Bowl at more than one center.": "各保齡球館的平均。到兩間以上的保齡球館打球後就會顯示。",
"Strike percentage by part of the night, ball against ball. Log which ball you threw on each shot.": "依當天打球的不同階段，比較各顆球的全倒率。請記錄每一球用的是哪顆球。",
"Your line, drawn on the lane. Log start board and arrows on your shots.": "畫在球道上的你的出球路線。請在每一球記錄起始板位和箭頭。",
"Each ball's numbers. Log which ball you threw on each shot.": "每顆球的統計。請記錄每一球用的是哪顆球。",
"What makes you switch balls. Record a ball-change reason.": "讓你換球的原因。請記錄換球原因。",
"Frames without an open. Log a full night frame by frame.": "沒有失誤的格。請逐格記錄完整的一次打球。",
"How you bowl early against late in a game. Log shots by frame.": "你在一局前段和後段的表現比較。請逐格記錄每一球。",
"Pins on the first ball. Log shots frame by frame.": "第一球擊倒的瓶數。請逐格記錄每一球。",
"How often the corner pin stands. Log your leaves.": "角瓶留下來的頻率。請記錄你的殘瓶。",
"Single-pin conversion. Log your leaves and whether you made them.": "單瓶補中率。請記錄你的殘瓶，以及有沒有補中。",
"Splits and conversions. Log your leaves.": "技術球和把技術球補掉的比率。請記錄你的殘瓶。",
"Who missed the lone 5. Log your leaves.": "單獨留下的 5 號瓶是誰沒補到。請記錄你的殘瓶。",
"Makeable leaves you missed. Log your leaves.": "本來補得到卻沒補中的殘瓶。請記錄你的殘瓶。",
"Longest run of strikes. Log a full night frame by frame.": "最長連續全倒。請逐格記錄完整的一次打球。",
"Where your misses go. Record a miss direction on bad shots.": "你沒打好的球都偏向哪裡。請在沒打好的球記錄偏離方向。",
"How your release holds up. Record release quality on your shots.": "你的出手穩不穩定。請在每一球記錄出手品質。",
"Flush against lucky strikes. Record how each strike carried.": "正中 Pocket 的全倒和幸運全倒的比較。請記錄每次全倒的帶瓶情況。",
"Your average as it moves. Log a few more nights.": "你的平均變化。請再記錄幾次。",
"What you would average with every spare. Log your leaves.": "如果每個補中都補到，你的平均會是多少。請記錄你的殘瓶。",
"Where you are heading. Log a few more nights.": "你接下來的走向。請再記錄幾次。",
"How much your scores swing. Log a few more nights.": "你的分數起伏有多大。請再記錄幾次。",
"The shape of your scores. Log a few more nights.": "你的分數分布。請再記錄幾次。",
"This season against last. Finish a season, then start another.": "這個賽季和上個賽季的比較。請先結束一個賽季，再開始新賽季。",
"First, second and third game. Log a few full nights.": "第 1、2、3 局的比較。請完整記錄幾次打球的每一局。",
"What you won and paid in. Turn on side games and record a night.": "你贏得的獎金和投入金額。請開啟場邊彩池，並記錄一次打球的成績。",
"3-6-9 and jackpot. Turn on side games and record a night.": "3-6-9 和累積彩池。請開啟場邊彩池，並記錄一次打球的成績。",
"Your season at a glance. Log a night.": "一眼看懂你的賽季。請記錄一次打球的成績。",
"First night": "第一次打球",
"Bowled a night with the group.": "和大家一起打了一次球。",
"Regular": "常客",
"Five nights in.": "打滿 5 次了。",
"Fixture": "固定班底",
"Fifteen nights. You live here now.": "打滿 15 次了。你現在住這裡了。",
"Marathon": "馬拉松",
"Six games in one night.": "一次打球就打了 6 局。",
"Triple figures": "三位數",
"Broke 100.": "突破 100 分。",
"One fifty": "150 分",
"Broke 150.": "突破 150 分。",
"Two hundred": "200 分",
"Broke 200. That's a real game.": "突破 200 分。這才叫真正的一局。",
"Five hundred": "500 系列",
"A 500 series across three games.": "3 局系列總分達到 500 分。",
"Night winner": "當天贏家",
"Won a night outright.": "單獨拿下當天第一，沒有同分。",
"Repeat champion": "常勝軍",
"Won three nights.": "3 次拿下當天第一。",
"Clean sweep": "全拿",
"Won every game in a night.": "同一天的每一局都贏。",
"Giant killer": "以小搏大",
"Beat someone averaging 30 more than you.": "打敗平均比你高 30 分以上的對手。",
"Comeback": "捲土重來",
"Improved 40 pins between games in a night.": "同一次打球中，下一局比上一局多了 40 分。",
"Metronome": "節拍器",
"Three games within 10 pins of each other.": "三局分數彼此相差都在 10 分以內。",
"New best": "新紀錄",
"Beat your own high game.": "打破你自己的單局最高分。",
"Climbing": "步步高升",
"Your average went up over five nights.": "你的平均在五次打球中持續上升。",
"Rough night": "不順的一天",
"Everyone has one. Under 70.": "每個人都有過。低於 70 分。",
"Photo finish": "一分之差",
"Won or lost a night by a single pin.": "當天以 1 分之差贏了或輸了。",
"Wooden spoon": "墊底獎",
"Finished last. Someone has to.": "最後一名。總得有人墊底。",
"Back to back": "連兩局",
"Two 150+ games in a row.": "連續兩局 150 分以上。",
"Rollercoaster": "雲霄飛車",
"100 pins between your best and worst game in one night.": "同一次打球中，最高局和最低局相差 100 分。",
"Scorekeeper": "記分員",
"Kept score for four or more people.": "幫 4 人以上記錄分數。",
"Pins set by machine, fall freely.": "球瓶由機器排好，自由倒下。",
"Pins on strings, pulled back up.": "球瓶綁著繩子，會被拉回原位。",
"Mixed house": "混合式",
"Some lanes string, some free fall.": "部分球道是繩索式，部分是自由落瓶式。",
"7 Pin": "7 號瓶",
"10 Pin": "10 號瓶",
"Bowled your first league night.": "打完你的第一個聯賽日。",
"Old guard": "老將",
"Three full seasons in the same league.": "在同一個聯賽打滿 3 個賽季。",
"Sub covered": "替補上陣",
"Bowled as a sub for another team.": "以替補身分幫其他球隊出賽。",
"New high game": "新單局最高分",
"New high series": "新系列最高分",
"Beat your own high series.": "打破自己的系列最高分。",
"Book buster": "官方平均殺手",
"A game 40+ pins over your book average.": "單局比官方平均高出 40 分以上。",
"In the pocket": "穩定發揮",
"Three games in a night within 5 pins of your average.": "同一天的 3 局都在平均上下 5 分以內。",
"Heater": "手感發燙",
"Three straight games above your average.": "連續 3 局高於平均。",
"Cold night, warm finish": "先冷後熱",
"Opened below average, closed above it.": "開局低於平均，收尾高於平均。",
"Raised book average": "官方平均提升",
"Your average is 5+ pins above last season's book.": "你的平均比上個賽季的官方平均高 5 分以上。",
"Clean": "零失誤",
"No open frames all night.": "當天沒有任何失誤格。",
"Sharp shooter": "神射手",
"Converted three or more splits in a night.": "同一天把 3 個以上的技術球補掉。",
"Carried it": "關鍵功臣",
"Your score was the difference in a match your team won.": "球隊獲勝的對戰中，你的分數是勝負關鍵。",
"Held the line": "堅守防線",
"Bowled above your average in a match your team lost.": "球隊落敗的對戰中，你仍打出高於平均的分數。",
"Team high game": "球隊單局最高分",
"Set your team's high game for the night.": "打出當天球隊的單局最高分。",
"Team high series": "球隊系列最高分",
"Set your team's high series for the night.": "打出當天球隊的系列最高分。",
"Executioner": "劊子手",
"Helped hang a teammate 30 times.": "在全隊只剩一位隊友沒全倒的格中打出全倒，累計 30 次。",
"Won a side game.": "贏了一次場邊彩池。",
"Money bags": "荷包滿滿",
"Locked in": "定案",
"Your book average was confirmed at season end.": "賽季結束時，你的官方平均已確認。",
"Twelve strikes. The one you'll be telling people about.": "12 個全倒。會讓你逢人就說的那一局。",
"800 series": "800 系列",
"An 800 series. USBC honor score.": "系列總分 800 分。USBC 榮譽分數。",
"First tournament": "第一次比賽",
"Logged your first tournament.": "記錄了你的第一場比賽。",
"Survived to the next round.": "撐過這一輪，晉級下一輪。",
"Finished in the top five.": "打進前五名。",
"Won the whole thing": "一路贏到底",
"First place.": "冠軍。",
"Ramping up": "漸入佳境",
"Three or more straight games, each higher than the last.": "連續 3 局以上，每一局都比前一局高分。",
"Strong finish": "強勢收尾",
"Last game 50+ pins above the average of the rest.": "最後一局比其他局的平均高出 50 分以上。",
"Cashed a side pot": "拿下彩池",
"Won a side pot at an event.": "在比賽中贏得彩池。",
"Squeaked in": "驚險晉級",
"Made the cut by 10 pins or fewer.": "以 10 分以內的差距通過晉級線。",
"First drill": "第一個練習項目",
"Logged your first drill.": "記錄了你的第一個練習項目。",
"Repeat customer": "回頭客",
"Same target, five separate sessions.": "同一個目標，分成 5 次不同的練習。",
"Trending up": "穩定上升",
"Conversion rate rose across five weeks.": "成功率連續 5 週上升。",
"Century": "百次挑戰",
"100 attempts at one target.": "同一個目標嘗試 100 次。",
"Graduated": "畢業",
"80%+ on a target, over at least 20 attempts.": "在一個目標上達到 80% 以上（至少 20 次嘗試）。",
"Drilled two different targets in one session.": "一次練習中練了兩個不同的目標。",
"Burned the midnight oil": "挑燈夜戰",
"A practice session of 50+ deliveries.": "一次練習投了 50 球以上。",
"That file is empty.": "這個檔案是空的。",
"game 1": "第 1 局",
"game 2": "第 2 局",
"game 3": "第 3 局",
"no scores on that row": "這一列沒有分數",
"a game is blank between two scores": "兩個分數之間有一局是空白",
"Nothing in that file could be imported.": "這個檔案裡沒有任何可以匯入的內容。",
"4 Pin": "4 號瓶",
"6 Pin": "6 號瓶",
"2 Pin": "2 號瓶",
"3 Pin": "3 號瓶",
"3-6-10 (bucket-ish)": "3-6-10（類似 Bucket）",
"2-4-5 (bucket)": "2-4-5（Bucket）",
"Strike Ball (pocket hits)": "攻擊球（打進 Pocket）",
"Pocket": "Pocket",
"Custom": "自訂",
"Failing row contains (*)": "",
"No errors recorded.": "",
"Couldn't connect. Check your signal and try again.": "無法連線。請檢查訊號後再試一次。",
"Your sign-in has expired. Sign out and back in, then try again.": "你的登入已過期。請登出後重新登入，再試一次。",
"Something went wrong. Try again in a few minutes.": "發生錯誤。請過幾分鐘再試一次。",
"Why do I keep leaving the 10?": "為什麼我老是留下 10 號瓶？",
"Which ball carries best for me?": "哪顆球對我來說帶瓶最好？",
"Do I fade late in a set?": "我打到系列後半段會掉分嗎？",
"Back tomorrow": "明天再來",
"Games logged": "",
"Strike percentage": "",
"Spare percentage": "",
"Single-pin spare percentage": "",
"Split conversion percentage": "",
"Open frames per game": "每局失誤格數",
"Corner pin spare percentage": "",
"Most-used ball": "",
"Balls in the bag": "",
"Best game by position in the set": "",
"Times left hung by teammates": "",
"Times helped hang a teammate": "",
"Team average game total": "",
"Team points won this season": "",
"Team record": "",
"Average over the last five nights": "",
"Score spread, lower is steadier": "",
"Book average": "",
"Nights logged": "",
"Most common leave": "最常見的殘瓶",
"Ten pin conversion": "",
"Strike rate by ball": "",
"Average by centre": "",
"Drill conversion": "",
"frames 1-3": "",
"frames 4-7": "",
"frames 8-10": "",
"By ball": "",
"By game of the night": "",
"By lane of the pair": "",
"By part of the game": "",
"By oil pattern": "",
"By kind of night": "",
"By centre": "",
"By release": "",
"By where it missed": "",
"By ball speed": "",
"By rev rate": "",
"By lane": "",
"By frame": "",
"By surface": "",
"By game and lane of the pair": "",
"By ball and oil pattern": "",
"By ball and game": "",
"By ball and lane of the pair": "",
"Your running average across all games in the current view.": "目前畫面中所有局的累計平均。",
"Your best single game.": "你的單局最高分。",
"Your best series total.": "你的系列最高總分。",
"Share of first balls that strike.": "第一球打出全倒的比例。",
"spare attempts": "補中機會",
"Non-split spare conversion.": "不含技術球的補中率。",
"Single Pin Spare %": "單瓶補中率",
"single-pin attempts": "單瓶補中機會",
"Conversion on leaves of exactly one pin.": "只剩一支球瓶時的補中率。",
"10 Pin Spare %": "10 號瓶補中率",
"10 pin attempts": "10 號瓶補中機會",
"Conversion on a lone corner pin (including weak and ringing ones).": "只剩一支角瓶時的補中率（包括軟的和顫動的角瓶）。",
"Frames closed with a strike or a spare.": "以全倒或補中收掉的格。",
"7 pin": "7 號瓶",
"single-pin spares": "單瓶補中機會",
"keep clean": "保持無失誤",
"to collect, and they're not all about bowling well:": "枚徽章可以收集，而且不全是靠打得好：",
"Start a session": "開始記錄",
"new night": "開始新的一次",
"league night": "聯賽日",
"On the Bowl tab, pick where you're bowling — practice, league, tournament or just bowling. For league, choose which league and the date. The app remembers your usual night, so on a regular Tuesday it sets itself up.": "在「打球」分頁選擇要打什麼——練習、聯賽、比賽或自由打。如果是聯賽，選擇哪個聯賽和日期。App 會記住你平常打聯賽的日子，所以一般的星期二會自動設定好。",
"Frame tracking vs game tracking": "逐格記錄與只記分數",
"Frame tracking records every ball — pins left, ball used, release. That's what powers spare stats, the scoresheet and ball comparisons. Scores only takes three numbers a night. You can switch any time, and start a night one way and finish the other: unlock the score boxes to type totals even mid-game.": "逐格記錄會記下每一球——殘瓶、使用的球、出手方式。補中統計、計分表和球的比較都靠這些資料。「只記分數」每次只要輸入三個數字。你隨時可以切換，也可以用一種方式開始、另一種方式結束：解鎖分數欄，就算打到一半也能輸入總分。",
"The ten-frame scoresheet": "10 格計分表",
"edit frame": "編輯格",
"running score": "累計分數",
"On frame tracking, the ten frames sit between the frame picker and the result buttons. It fills in as you bowl. Tap any frame to edit it. Tapping an empty frame while editing cancels the edit; tapping the next frame when your shot is complete saves it.": "使用逐格記錄時，10 格計分表會顯示在格選擇器和結果按鈕之間，隨著你打球逐步填入。點任一格即可編輯。編輯時點空白的格會取消編輯；這一球輸入完成後點下一格則會儲存。",
"Delete a shot": "刪除一球",
"wrong frame": "格記錯了",
"Tap the frame on the scoresheet to open it, then either press Delete this shot, or deselect the result — clearing what happened deletes the frame. Both ask you to confirm, because it can't be undone.": "在計分表上點該格打開它，然後按「刪除」，或取消選取結果——清除這一球的結果就會刪除該格。兩種方式都會請你確認，因為無法復原。",
"Prebowl for a future week": "預打之後某一週",
"miss next week": "下週缺席",
"Bowling next week's league games early? Turn on Prebowling in Tonight's Session. The games are filed under the date they count for, not the day you threw them — so you can prebowl and bowl tonight's league on the same night without one overwriting the other.": "要提早打下週的聯賽局數嗎？在「今天的聯賽」中點「為之後某一週預打？」。這些局會歸在它們計分的日期，而不是你實際打的那天——所以同一天預打又打今天的聯賽，也不會互相覆蓋。",
"Side games and buy-ins": "場邊彩池與報名費",
"side pot": "彩池",
"high game": "單局最高分",
"buy in": "報名費",
"money games": "獎金彩池",
"Buy-ins are saved per league — enter them once and they apply every week. Each night, tap the pots you're actually in; sitting one out costs you nothing. Hide pots your house doesn't run in Settings.": "報名費依聯賽儲存——輸入一次，每週都會套用。每次打球時，點選你實際參加的彩池；沒參加的不用花錢。你的球館沒有的彩池，可以在「設定」中隱藏。",
"Import a scorecard photo": "匯入計分表照片",
"Press Import in the header. Say whether it's practice, league or a tournament, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving.": "按下頁首的「匯入」。選擇是練習、聯賽還是比賽，挑好球隊和日期，再加入計分螢幕的照片。App 會讀取各局和每一格，儲存前再由你把每一欄對應到一位球友。",
"Send teammates their scores": "把分數傳給隊友",
"share scores": "分享分數",
"frame data": "逐格資料",
"Any column you map to a teammate is sent to them to confirm. They get the frame-by-frame data too, not just totals — once they accept, it lands in their shot history marked as imported.": "你指定給隊友的每一欄，都會傳給對方確認。對方收到的不只總分，還有逐格資料——對方接受後，就會加入他的投球紀錄，並標示為匯入。",
"Compare yourself to someone": "跟別人比較",
"head to head": "一對一",
"team average": "球隊平均",
"On the Stats tab, use Compare To. You can compare against a bowler on your device, a friend, or your team's average. Teammates are added as friends automatically, so they're there without sending a request.": "在「統計」分頁使用「比較對象」。你可以跟這台裝置上的球友、好友或球隊平均比較。隊友會自動加為好友，不用送出邀請就會出現在清單中。",
"Trends over time": "長期趨勢",
"over time": "長期",
"per ball": "每顆球",
"Switch to Trends on the Stats tab to see a metric plotted over time. Filter by ball to see how one piece of equipment is performing — that works on game scores too, if you record which ball bowled which game.": "在「統計」分頁切換到「趨勢」，就能看到某項指標隨時間變化的圖表。依球篩選，可以看某一顆球的表現——如果你有記錄每一局用哪顆球，局分數也能這樣看。",
"Set a goal": "設定目標",
"On the Improve tab, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "在「進步」分頁按「+ 新增目標」，選擇要加強的項目——平均、全倒率、補中率等等。進度會隨著你打球更新。",
"Practice drills": "練習項目",
"spare shooting": "補中練習",
"Start a drill from the Improve tab. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "從「進步」分頁開始一個練習項目。選一個目標——某種特定的補中，或某個球瓶組合——App 就會記錄這次練習的成功和失手次數。",
"A coach sees every bowler they work with on one roster: what each is working on, how far along, and when the next session is. Tasks are set per bowler, and the bowler sees them on their Improve tab.": "教練可以在同一份名單上看到所有指導中的球員：每個人在練什麼、進度到哪裡、下次課程在什麼時候。任務是針對每位球員分別設定的，球員會在自己的「進步」分頁看到。",
"add league": "新增聯賽",
"On the Setup tab, under League, add a league with its name, center and season dates. Season dates let the app prompt you to update your book average when the season ends.": "在「準備」分頁的「聯賽」下，輸入名稱、保齡球館和賽季日期來新增聯賽。有了賽季日期，App 就能在賽季結束時提醒你更新官方平均。",
"Add a team and its roster": "新增球隊和隊員名單",
"not signed up": "尚未註冊",
"hasn't joined": "尚未加入",
"email required": "需要電子郵件",
"bowling order": "出場順序",
"add a teammate": "新增隊友",
"Teams live under their league on the Setup tab — add a league under League, then add your team under Team. Open the team to set the bowling order and add each teammate by name and email. The email is required: it's what connects them to their spot when they sign up. Teammates who haven't joined yet still work — you can log their scores straight away, and everything you've recorded is waiting for them when they accept the invite.": "球隊放在「準備」分頁的所屬聯賽底下——先在「聯賽」新增聯賽，再到「球隊」新增你的球隊。打開球隊可以設定出場順序，並用名字和電子郵件逐一新增隊友。電子郵件是必填的：隊友註冊時，就是靠它連結到名單上屬於自己的位置。還沒加入的隊友照樣可以使用——你可以馬上記錄他們的分數，等他們接受邀請時，你記錄的一切都已經在那裡等著他們。",
"Your ball arsenal": "你的球具庫",
"Add your balls on the Setup tab, under Balls, with layout and surface. Balls you log shots with feed the per-ball stats and the trend filters. Bags, the next tab over, let you group what you actually carry.": "在「準備」分頁的「球」底下新增你的球，並填上鑽孔配置和表面處理。記錄投球時用到的球，會納入每顆球的統計和趨勢篩選。隔壁的「球袋」分頁可以把你實際會帶的球分組。",
"add friend": "加好友",
"Search for someone by name and send a request. Teammates are added automatically. Friends can compare stats with each other. There's also a QR code here for handing someone the app link.": "用名字搜尋對方並送出邀請。隊友會自動加入。好友之間可以互相比較統計。這裡還有 QR Code，方便把 App 連結傳給別人。",
"Your name and profile": "你的名字和個人檔案",
"two handed": "雙手",
"book average": "官方平均",
"Set your display name — that's what teammates see. Also here: handedness, book average, home centers, and scorecard names, which are the other spellings of your name that appear on a printed scorecard so imports match you correctly.": "設定你的顯示名稱——隊友看到的就是這個名字。這裡也可以設定慣用手、官方平均、常去的球館和計分表上的名字；計分表上的名字是你的名字在列印計分表上的其他寫法，讓匯入時能正確對應到你。",
"Your history": "你的紀錄",
"Every night you've bowled and every shot you've logged. Filter by team or result. You only see your own — teammates keep theirs.": "你打過的每一次、記錄過的每一球都在這裡。可以依球隊或結果篩選。你只看得到自己的——隊友的紀錄由他們自己保管。",
"Honor scores, personal bests and badges": "榮譽分數、個人最佳和徽章",
"perfect game": "滿分局",
"honor score": "榮譽分數",
"personal best": "個人最佳",
"high series": "系列最高分",
"A 300 game or an 800 series is called out automatically. So is beating your own best game or series — set your all-time bests in your profile so it has something to beat from day one. At a tournament you can record how you finished, and a win gets its own badge. All of them can be shared.": "打出 300 分的一局或 800 分的系列時，App 會自動標示出來。刷新自己的單局或系列最高分也一樣——在個人檔案裡設定你的歷來最佳成績，從第一天起就有目標可以挑戰。參加比賽時可以記錄最後的名次，拿下冠軍還有專屬徽章。這些全都可以分享。",
"Adding a teammate without their email": "沒有電子郵件也能新增隊友",
"signup code": "註冊代碼",
"team code": "球隊代碼",
"invite code": "邀請碼",
"no email": "沒有電子郵件",
"don't have their email": "不知道電子郵件",
"text them": "傳簡訊",
"When you add a teammate, tick \"I don't have their email\" and you'll get a short code to text them. They enter it when they sign up and land straight on that roster spot, with everything you've already logged under their name.": "新增隊友時，選擇「用簡訊傳代碼」，就會拿到一組簡短的代碼，可以用簡訊傳給對方。對方註冊時輸入這組代碼，就會直接進到名單上的那個位置，你已經用他名字記錄的一切也都會跟著過去。",
"Split conversion by type": "各類技術球的補中率",
"baby split": "Baby Split",
"big four": "Big Four",
"greek church": "Greek Church",
"which splits": "哪種技術球",
"Splits are broken out by type, not lumped into one number — the 4-7-10 and the 3-10 are different problems. The Stats tab shows how often you leave each one and how often you convert it, with the well-known ones named.": "技術球會依類型分開統計，不會混成一個數字——4-7-10 和 3-10 是完全不同的難題。「統計」分頁會顯示每種技術球你留下的頻率和補掉的頻率，有名的技術球還會標上名稱。",
"Changing how the app looks": "變更 App 外觀",
"App appearance in Settings. Glow is the default — rock'n'bowl green on warm black — and there are several others if you'd rather something calmer.": "在「設定」的「外觀主題」裡。預設是「螢光」——暖黑色底配上保齡球館夜場燈光般的綠色——如果想要沉穩一點，還有好幾種可以選。",
"Recording how a tournament finished": "記錄比賽的最後名次",
"made the cut": "晉級",
"runner up": "亞軍",
"how did i do": "我的名次",
"At the end of a tournament, say how it finished — won it, runner-up, top five, cashed, or made the cut. The app can't work this out from your scores, since it doesn't know what anyone else shot. A win becomes a badge you can share.": "比賽結束時，記錄最後的成績——冠軍、亞軍、前五名、進入獎金名次或晉級。App 無法從你的分數推算出來，因為它不知道其他人打了多少。拿下冠軍會變成可以分享的徽章。",
"who won": "誰贏了",
"just bowling": "自由打",
"who's best": "誰最強",
"Everyone you've added to an Open bowling scoresheet turns up in the Standings, ordered by average, with how many games they've bowled, their best single game, and the badges they've earned. It builds up over time, so the more nights you log the more there is to argue about.": "你加進自由打計分表的每個人，都會出現在「排名」中，依平均排序，並顯示打了幾局、單局最高分和獲得的徽章。資料會隨時間累積，所以記錄的次數越多，能拿來鬥嘴的就越多。",
"Where did everything go?": "東西都跑去哪了？",
"where is": "在哪裡",
"no stats": "沒有統計",
"no history": "沒有紀錄",
"tabs missing": "分頁不見了",
"wrong mode": "選錯模式",
"went back": "恢復原狀",
"If you picked Open bowling, the app hides everything that mode doesn't use — History, Stats, Improve and Gear. Nothing is deleted; it's all still there. Go to the Bowl tab, find the card at the top showing what you're bowling, tap Change, and pick Practice, League or Tournament. Everything comes straight back.": "如果你選了「自由打」，App 會隱藏這個模式用不到的東西——「紀錄」、「統計」、「進步」和「裝備」。沒有東西被刪除，全部都還在。到「打球」分頁，找到最上方顯示你正在打什麼的卡片，點「變更」，再選「練習」、「聯賽」或「比賽」。所有東西都會馬上回來。",
"Entering scores for the group": "幫整組人輸入分數",
"add someone": "新增人員",
"who's bowling": "記錄對象",
"Names down the side, games across the top. Tap a cell and type the final score for that game — totals add themselves. Add whoever's on the lane with the box underneath and they become a row; they don't need the app or an account. Bowl more than a few games and the scores slide across while the names stay put.": "名字排在左側，局數排在上方。點一格並輸入那一局的最終分數——總分會自動加總。用下方的輸入框把球道上的人加進來，他們就會變成一列；他們不需要 App 或帳號。打超過幾局後，分數會橫向滑動，名字則固定不動。",
"The badges you can earn": "可以獲得的徽章",
"how do i get": "怎麼獲得",
"Tips: rolling a better ball": "小技巧：把球打得更好",
"how to bowl": "怎麼打保齡球",
"help me bowl": "教我打保齡球",
"new to bowling": "保齡球新手",
"Pick a ball you can hold comfortably — too heavy and you'll throw it with your arm instead of letting it swing. Aim at the arrows on the lane, not the pins: they're much closer, so they're far easier to hit consistently. Let your arm swing like a pendulum rather than pushing, and try to finish with your hand up where you were aiming. Most beginners improve more from rolling the same ball the same way twice than from anything else.": "挑一顆你能舒服拿住的球——太重的話，你會用手臂硬丟，而不是讓它自然擺盪。瞄準球道上的箭頭，而不是球瓶：箭頭近得多，更容易穩定地打中。讓手臂像鐘擺一樣擺動，不要用推的，並試著在出手後把手舉向你瞄準的方向。對大多數新手來說，最能進步的就是能用同樣的方式把同一顆球丟出兩次。",
"Tips: picking up spares": "小技巧：補中",
"corner pin": "角瓶",
"second ball": "第二球",
"pick up": "補瓶",
"Spares are where casual scores are won. If pins are left on the right, move your feet LEFT and aim across the lane at them; if they're on the left, move right. It feels backwards and it works. For a single pin, aim at the arrow closest to it rather than staring at the pin. Converting even half your spares will do more for your score than any strike will.": "自由打的分數，勝負就在補中。殘瓶在右邊，就把腳往「左」移，斜穿球道瞄準它們；殘瓶在左邊，就往右移。感覺是反的，但真的有效。單瓶殘瓶時，別盯著球瓶看，改瞄離它最近的箭頭。就算只把一半的補中機會補掉，對分數的幫助也比任何一次全倒都大。",
"Tips: how scoring actually works": "小技巧：計分到底怎麼算",
"how does scoring work": "怎麼計分",
"what is a turkey": "什麼是火雞",
"Ten frames, two balls each. All ten pins on the first ball is a strike, and you get the next two balls added on top. Knocking them all down across both balls is a spare, and you get the next one ball added. That's why strikes are worth chasing — a good game is mostly about not leaving gaps rather than striking every frame. Three strikes in a row is a turkey. A perfect game is 300.": "一局 10 格，每格兩球。第一球就擊倒全部 10 支球瓶是全倒，會再加上接下來兩球的分數。兩球加起來全部擊倒是補中，會再加上接下來一球的分數。所以全倒很值得追求——不過打出好分數，重點多半在於不留失誤，而不是每格都全倒。連續三次全倒叫火雞。300 分是滿分局。",
"Tips: making the night better": "小技巧：讓這次打球更好玩",
"night out": "出去打球",
"what to do": "要做什麼",
"first time": "第一次",
"Bowl in the same order each game so it stays easy to follow. Ask for bumpers if anyone's small — nobody minds and it keeps everyone in it. Lighter balls are usually on the racks nearest the lanes. If someone's having a rough game, remember there's a badge for it. Rented shoes are meant to slide, so don't fight it on the approach.": "每局都照同樣的順序打，比較容易跟上。如果有小朋友，可以請球館放護欄——沒人會介意，大家都能一起玩。比較輕的球通常放在最靠近球道的球架上。如果有人這局打得不順，記得有一枚徽章就是為這種時候準備的。租來的球鞋本來就設計成會滑，在助走道上別跟它硬拚。",
"Syncing and offline use": "同步與離線使用",
"Everything is saved on your phone first and uploaded when there's a connection, so you can log a whole night on bad alley wifi. If something can't upload, the app says so and keeps retrying — nothing is lost.": "所有資料都會先存在你的手機上，有網路時再上傳，所以就算球館 Wi-Fi 很差，也能記錄一整次打球。如果有資料無法上傳，App 會告訴你並持續重試——不會有任何遺失。",
"Appearance and settings": "外觀與設定",
"Change the theme in Settings, along with which stats cards you see, which side games are shown, and whether frame tracking fields like ball speed and rev rate appear.": "你可以在「設定」中變更主題，也能選擇要顯示哪些統計卡片、要顯示哪些場邊彩池，以及是否顯示球速、轉速等逐格記錄欄位。",
"Importing": "匯入",
"Improving": "進步",
"Leagues, teams and gear": "聯賽、球隊和裝備",
"Your profile": "你的個人檔案",
"Good to know": "實用資訊",
"no record": "找不到紀錄",
"own scores": "自己的分數",
"the bowler has already responded": "球友本人已經回覆了",
"only a teammate with verified scores of their own can correct this": "只有自己的分數已確認的隊友才能修正",
"wait until the next session has finished": "請等下一次打球結束",
"bowler did not respond before the next session ended": "球友本人在下一次打球結束前沒有回覆",
"no corrected scores supplied": "沒有提供修正後的分數",
"Confirmed by the bowler.": "球友本人已確認。",
"Corrected by the bowler.": "球友本人已修正。",
"Rejected — these scores need to be entered again.": "已拒絕——這些分數需要重新輸入。",
"Already logged by the bowler — nothing to confirm.": "球友本人已經記錄過了——不需要確認。",
"From an imported scorecard, not yet confirmed.": "來自匯入的計分表，尚未確認。",
"Scores to check": "待確認的分數",
"A teammate imported these from a scorecard photo. They already count — confirming marks them checked.": "這些是隊友從計分表照片匯入的分數。它們已經計入——確認後會標示為已檢查。",
"A night needs re-entering": "有一次打球需要重新輸入",
"You said these weren't yours, so they've stopped counting.": "你表示這些不是你的分數，所以已不再計入。",
"Nobody confirmed these and a session has since finished. You can correct them.": "這些分數沒有人確認，而且在那之後又已經打完一次了。你可以修正它們。",
"Accept or decline on the Coach tab.": "請在「教練」分頁接受或拒絕。",
"Work your coach has set for you.": "教練為你安排的練習任務。",
"They've marked work done or reported how far they got.": "他們已把任務標為完成，或回報了進度。",
"Accept or decline on the Social tab.": "請在「好友」分頁接受或拒絕。",
"Joining lets teammates import your scores from a scorecard photo.": "加入後，隊友就能從計分表照片匯入你的分數。",
"Anyone on the team can approve it on the Team tab.": "球隊裡任何人都能在「球隊」分頁核准。",
"Book average needs updating": "官方平均需要更新",
"A league season has finished.": "有個聯賽賽季已經結束。",
"Other bowlers voted them down. Check and resubmit if you think they were right.": "其他球友投票否決了。如果你認為規格正確，請檢查後重新提交。",
"Strike rate": "全倒率",
"Spare conversion": "補中率",
"Corner pin conversion": "角瓶補中率",
"Trend over time": "長期趨勢",
"Game-by-game fade": "逐局下滑",
"Consistency": "穩定度",
"Form vs book average": "近期狀態與官方平均",
"Single-pin spares": "單瓶補中",
"Single corner pin spares": "單一角瓶補中",
"Average by game (1st, 2nd, 3rd)": "各局平均（第 1、2、3 局）",
"Score spread": "分數落差",
"Ball comparison": "球的比較",
"Center-by-center averages": "各保齡球館平均",
"Drill results": "練習項目結果",
"Oil pattern averages": "各油型平均",
"Overall": "總評",
"How it finished": "最後結果",
"Broke 50": "突破 50 分",
"Broke 75": "突破 75 分",
"First 100 game": "第一次 100 分局",
"Broke 125": "突破 125 分",
"First 150 game": "第一次 150 分局",
"Broke 175": "突破 175 分",
"First 200 game": "第一次 200 分局",
"Broke 225": "突破 225 分",
"First 250 game": "第一次 250 分局",
"Broke 275": "突破 275 分",
"First 200 series": "第一次 200 分系列",
"First 300 series": "第一次 300 分系列",
"First 400 series": "第一次 400 分系列",
"First 500 series": "第一次 500 分系列",
"First 600 series": "第一次 600 分系列",
"First 800 series": "第一次 800 分系列",
"First night logged": "第一次記錄打球",
"Five nights in": "第 5 次打球",
"Ten nights in": "第 10 次打球",
"Twenty-five nights": "累計 25 次",
"Fifty nights": "累計 50 次",
"A hundred nights": "累計 100 次",
"First strike": "第一次全倒",
"First spare": "第一次補中",
"Two strikes in a row": "連續 2 次全倒",
"First turkey": "第一次火雞",
"Four in a row": "連續 4 次全倒",
"Five in a row": "連續 5 次全倒",
"Converted a split": "把技術球補掉",
"Converted the big four": "把 Big Four 補掉",
"First cash": "第一次進入獎金名次",
"House": "館內油型",
"a tournament": "比賽",
"just for fun": "自由打",
"Not enough history yet — you'll be asked once a day until a pattern shows up.": "紀錄還不夠多——在看出規律之前，每天都會問你一次。",
"Dual Angle": "Dual Angle（雙角度）",
"VLS (Pin Buffer)": "VLS（Pin Buffer）",
"2LS (Two-Handed)": "2LS（雙手）",
"Drilling Angle": "鑽孔角度",
"VAL Angle": "VAL 角度",
"Pin Buffer": "Pin Buffer 距離",
"Not a number": "不是數字",
"You're the last member, so the team will be left empty.": "你是最後一位隊員，退出後球隊就沒有人了。",
"Your past scores and averages stay.": "你過去的分數和平均都會保留。",
"Standard scoring.": "一般計分。",
"Nine on the first ball counts as a strike.": "第一球擊倒 9 瓶就算全倒。",
"ball speed": "",
"rev rate": "",
"axis rotation": "",
"axis tilt": "",
"heel setting": "",
"sole setting": "",
"board at the arrows": "",
"where it missed": "",
"where the ball missed": "",
"the board you actually hit": "",
"Won every match.": "每場都贏。",
"Wolf": "Wolf",
"Cheetah": "Cheetah",
"Bat": "Bat",
"Viper": "Viper",
"Bear": "Bear",
"Chameleon": "Chameleon",
"Scorpion": "Scorpion",
"Dragon": "Dragon",
"Shark": "Shark",
"Badger": "Badger",
"PBA Animal": "PBA Animal",
"Sport": "運動油型",
"Frame tracking": "逐格記錄",
"Game tracking": "只記分數",
"Every frame — strikes, spare conversions, open frames and how each ball carried.": "記錄每一格——全倒、補中、失誤，以及每一球的帶瓶情況。",
"The final score for each game. Fast, and still tracks averages and trends.": "只記每局的最終分數。快速，而且仍會追蹤平均和趨勢。",
"Season Record": "賽季戰績",
"Hung": "唯一沒全倒",
"Shots / Strike % / Spare %": "投球數 / 全倒率 / 補中率",
"My Records": "我的紀錄",
"Clean Frames": "無失誤格",
"Ten Pin Leaves": "10 號瓶殘瓶",
"Single Pin Spares": "單瓶補中",
"Hand Up": "殘 5 號瓶",
"Longest Strike Streak": "最長連續全倒",
"Strike % Through the Night": "當天全倒率走勢",
"Ball vs Ball": "球與球比較",
"A practice session": "練習",
"A league night": "聯賽日",
"A tournament": "比賽",
"There's no wrong answer. Each one just changes which screens you see, and you can switch at any time from the Bowl tab or Settings.": "沒有錯誤答案。你的選擇只會改變你看到哪些畫面，而且隨時都可以在「打球」分頁或「設定」中切換。",
"For working on your game. Drills, frame tracking and every detail field are available, and practice scores stay out of your league averages.": "用來磨練球技。可以使用練習項目、逐格記錄和所有細節欄位，而且練習分數不會計入你的聯賽平均。",
"For your weekly team night. Your team roster and standings are available, along with side games.": "用於每週的球隊聯賽日。可以使用球隊的隊員名單和排名，還有場邊彩池。",
"For higher-stakes competition. Blocks, squads, side pots, brackets, match play and the cut line are all available.": "用於競爭更激烈的比賽。輪次、梯次、彩池、對戰籤表、對戰賽和晉級線都可以使用。",
"For a fun activity. You get the scoresheet, standings and badges — all other views are hidden, not deleted, to keep it quick and simple.": "輕鬆玩玩用。你會有計分表、排名和徽章——其他畫面都會隱藏（不會刪除），讓操作快速又簡單。",
"no sessions logged": "尚無聯賽紀錄",
"PRODID:-//Bowling Tracker//EN": "",
"Retired": "已退役",
"This fill ball count may not be reliably read from the scorecard image -- please verify the pin count manually before saving.": "計分表圖片上這個加球的瓶數可能讀得不準確——儲存前請手動確認瓶數。",
"so a game may be missing from the photo": "所以照片可能少拍了一局",
"so one of the game scores was probably misread": "所以可能有一局的分數讀錯了",
"so a frame was probably misread": "所以可能有一格讀錯了",
"so the total was probably misread": "所以總分可能讀錯了",
"Keeping the book for the team? Add your teammates and log their shots too.": "幫球隊記分嗎？加入你的隊友，也一起記錄他們的投球。",
"Practising with someone? Add them to compare sessions afterwards. Their scores stay on this device.": "和別人一起練習嗎？加入對方，之後就能比較練習內容。對方的分數只會存在這台裝置上。",
"Bowling with others? Add them to keep everyone's score. Their scores stay on this device.": "和別人一起打球嗎？加入他們，就能記錄每個人的分數。他們的分數只會存在這台裝置上。",
"on target": "命中目標",
"board must be a number": "板數必須是數字",
"Winner": "贏家",
"Best Single Game": "單局最佳",
"— that's a real game.": "——這才是像樣的一局。",
"Biggest Comeback": "最大逆轉",
"Ran Out Of Steam": "後繼無力",
"Most Consistent": "最穩定",
"Pick the date these games count for.": "選擇這些局要計入的日期。",
"That's today — prebowled games count for a future date.": "那是今天——預打的局要計入之後的日期。",
"That date has passed. Prebowled games count for an upcoming session.": "那個日期已經過了。預打的局要計入之後的聯賽日。",
"You already have a session on that date. Saving would overwrite it.": "你在那個日期已經有紀錄了。儲存會覆寫原本的紀錄。",
"Bowled": "成績",
"Practice session": "練習",
"Just for fun": "自由打",
"system-ui, sans-serif": "",
"Clean card — no open frames": "每局都無失誤——沒有任何失誤格",
"No nights bowled yet.": "還沒有打球紀錄。",
"WON IT": "奪冠",
"TOP FIVE": "前五名",
"MADE THE CUT": "晉級",
"Bracket": "對戰籤表",
"Eliminator": "淘汰賽",
"Side Pot": "彩池",
"Optional": "自選彩池",
"Big four": "Big Four",
"Greek church": "Greek Church",
"Baby split": "Baby Split",
"Bucket split": "Bucket",
"Casual": "自由打",
"stat unlocks": "項統計可解鎖",
"stats unlock": "項統計可解鎖",
"use frame tracking": "改用逐格記錄",
"note which ball bowled each game": "記下每局用的是哪顆球",
"Rates": "比率",
"Records": "最佳紀錄",
"Single pins": "單瓶",
"Other leaves": "其他殘瓶",
"First ball": "第一球",
"Ladder under way.": "階梯賽進行中。",
"Waiting for a better connection": "正在等待較穩定的網路連線",
"Your scores are saved on this phone and will upload on their own.": "你的分數已儲存在這支手機上，之後會自動上傳。",
"Something was already saved": "有資料已經儲存過了",
"This looks like a duplicate of something already in the cloud. Your scores are safe — this copy just isn't needed.": "這筆資料似乎和雲端上已有的重複了。你的分數很安全——只是不需要這份副本。",
"Not allowed to save this": "沒有儲存權限",
"The app doesn't have permission to save this. Nothing is lost on this phone, but it can't reach the cloud until this is fixed.": "App 沒有儲存這筆資料的權限。這支手機上的資料都還在，但在問題修正之前無法上傳到雲端。",
"This didn't save correctly": "這筆資料沒有正確儲存",
"Something about this entry doesn't fit what the cloud expects. Your scores are still on this phone.": "這筆紀錄有些內容不符合雲端要求的格式。你的分數仍保存在這支手機上。",
"Couldn't upload yet": "還無法上傳",
"Your scores are saved on this phone. The app keeps trying in the background.": "你的分數已儲存在這支手機上。App 會在背景持續重試。",
"Maple and amber, like the house lights are down": "楓木與琥珀色，像球館燈光調暗時",
"Classic": "經典",
"Slate and blue, the original look": "石板灰與藍，最初的樣子",
"Glow": "螢光",
"Rock'n'bowl green on warm black": "暖黑底配螢光保齡球綠",
"Deep plum with a pink flash": "深梅紫，點綴一抹亮粉",
"Pin deck": "球瓶區",
"High contrast, red pin stripe": "高對比，球瓶紅條紋",
"Daylight": "日光",
"Bright house, maple accents": "明亮球館，楓木點綴",
"Scoresheet": "計分表",
"Cream paper, ruled-line blue and split red": "米白紙張，格線藍配技術球紅",
"Chalk": "粉筆",
"Cool white, quiet blue": "冷白色，沉靜藍",
"Keeping score": "記分",
"Home is where a night gets logged. Pick what you're doing from the rows at the top — league, practice, a tournament, just bowling — and the card opens underneath. Enter three game scores, or go ball by ball and record every leave.": "「首頁」是記錄每次打球的地方。從上方幾列選擇你要打的——聯賽、練習、比賽、自由打——下方就會打開卡片。輸入三局分數，或逐球記錄每一個殘瓶。",
"Your gear": "你的裝備",
"Setup starts with your arsenal. On Balls, add a ball, record its layout, surface and specs, and on Bags sort them so tonight's four are one tap away.": "「準備」從你的球具庫開始。在「球」新增一顆球，記錄它的鑽孔配置、表面處理和規格；在「球袋」整理好，今天要用的四顆球點一下就能帶出來。",
"Leagues and teams": "聯賽和球隊",
"Setup is also where a league gets set up, under League, and a roster filled in, under Team. Scores file against a league, so that's the one thing worth doing first — a team can wait until you want to compare.": "聯賽也是在「準備」裡設定，在「聯賽」底下；隊員名單則在「球隊」底下填寫。分數是依聯賽歸檔的，所以這是唯一值得先做的事——球隊可以等你想比較時再建立。",
"Stats and trends": "統計和趨勢",
"Stats breaks your bowling down by ball, by game, by center and by team. The Trends chip charts any of it over time, and the eye on any card hides it.": "「統計」會依球、依局、依球館和依球隊分析你的打球。「趨勢」標籤可以把任何一項畫成隨時間變化的圖表，點卡片上的眼睛圖示則可以隱藏它。",
"Your journey": "你的旅程",
"Your road so far: every first, dated, and how close you are to the next one — a few pins from a 700 series, say. Badges collect beside them.": "你一路走來的足跡：每一個「第一次」都附上日期，還有離下一個還差多少——例如離 700 分系列只差幾分。徽章就收集在旁邊。",
"Calendar and journal": "行事曆和日誌",
"History keeps every night you've bowled, on a calendar you can scroll back through. The journal gathers every note you've written — on a shot, a drill, a pattern or the end of a night — and you can search them, or filter by kind and date range.": "「紀錄」會保存你每一次打球的結果，可以在行事曆上往回捲動查看。日誌收集你寫過的每一則筆記——關於某一球、某個練習項目、某種油型，或當天打完的心得——你可以搜尋，或依類型和日期範圍篩選。",
"That's enough for now": "先看到這裡",
"You know your way around. If you want more, the settings menu has the rest — keeping score, bowling a tournament, what the AI does, stats, and coaching.": "你已經熟悉操作了。想了解更多，設定選單裡還有其他導覽——記分、打比賽、AI 能做什麼、統計和指導。",
"By game": "按局記錄",
"The quickest way in. Type the score for each game and you're done — three numbers, a night logged. Your average, highs and trends all work from this alone.": "最快的上手方式。輸入每一局的分數就完成了——三個數字，今天就記錄好了。你的平均、最高分和趨勢，光靠這些就能算出來。",
"A strike": "全倒",
"Going ball by ball, tap Strike and the frame is finished — no pins to pick. Add how it hit if you want it: flush, high, light, a messenger, a Brooklyn.": "逐球記錄時，點「全倒」，這一格就完成了——不用選球瓶。想記下擊球情況也可以加上：正中 Pocket、打厚、打薄、飛瓶、反邊。",
"A spare": "補中",
"Tap the pins you left standing, then answer Spare Made. Yes closes the frame. The pins you tap are what feeds your leave and conversion numbers later.": "點選還站著的球瓶，再回答「是否補中」。選「是」就完成這一格。你點選的球瓶，之後就是殘瓶和補中率統計的資料來源。",
"An open frame": "失誤格",
"Same start — tap what was standing — then answer No, and tap which of those pins you knocked down. None of them? Just save. The app works out the count.": "開頭一樣——點選還站著的球瓶——然後回答「否」，再點選其中你擊倒的球瓶。一支都沒倒？直接儲存就好。App 會自己算出瓶數。",
"How the night went": "今天打得如何",
"The Results chip closes the session: games, series, how it compared to your average, and anything you won. Tap it when you're done and the night is filed.": "「結果」標籤會為這次打球收尾：各局分數、系列總分、與你平均相比的表現，以及贏得的獎金。打完點一下，今天的紀錄就歸檔了。",
"Setting up an event": "設定比賽",
"Pick Tournament on Home and Set up asks what the event is: its name and center, then Style, Scoring and Format. Those three are separate questions, so any mix works — a Baker squad can be handicapped and 9 pin no-tap at once. A handicap event then asks for your pins per game.": "在「首頁」選「比賽」，「準備」會問你這是什麼比賽：名稱和保齡球館，接著是「比賽形式」、「計分方式」和「賽制」。這三項是分開的問題，可以任意組合——Baker 賽制的梯次也可以同時採用讓分和 9 瓶算全倒。如果是讓分比賽，接著會問你每局的讓分。",
"Add a block for each day or squad and they become tabs under Scoring. Enter the cut as it's posted — plus or minus against a 200 average — and the app tells you where you stand against it, carrying your earlier blocks in once there's more than one.": "每一天或每個梯次各新增一個輪次，它們會成為「輸入分數」下的分頁。依公告輸入晉級線——以 200 平均為基準的正負分——App 就會告訴你目前和晉級線相比的位置；輪次超過一個時，還會把前面輪次的成績一起算進去。",
"Making the cut": "晉級",
"The app never asks whether you made it: the margin already says. What it can't work out is what came next, so each block asks what you qualified for — match play, a stepladder, or neither — and gives you a button straight to it.": "App 從不會問你有沒有晉級：分差早就告訴你了。它無法得知的是接下來的賽程，所以每個輪次都會問你晉級到哪裡——對戰賽、階梯賽，或都沒有——並提供一個直接前往的按鈕。",
"Each match is your score against an opponent's, with bonus pins for a win or a tie. In a handicap event there's a box for your opponent's handicap too.": "每場對戰都是你的分數對上對手的分數，贏球或和局可得獎勵分。在讓分比賽中，也有一欄可以輸入對手的讓分。",
"The stepladder": "階梯賽",
"Sudden death, so no bonus pins — the higher score advances. Enter your seed and each opponent's, and the app works out where you finished from how far you climbed. Beat the one seed and it says you won it.": "一局定勝負，所以沒有獎勵分——分數高的晉級。輸入你和每位對手的種子順位，App 會依你往上打了幾關算出你的最終名次。打敗第 1 種子，就會顯示你奪冠。",
"How the event went": "比賽打得如何",
"Results recaps the whole event broken out by phase, with your brackets and side pots and what they paid. End tournament and view results saves everything on its way there. The Nightcap reads the night back to you, and the share button hands the lot to whoever asks how you did.": "「結果」會依階段回顧整場比賽，包含你的對戰籤表、彩池和各自的獎金。按「結束比賽並查看結果」會在前往結果頁時儲存所有資料。Nightcap 會幫你回顧今天，分享按鈕則能把整份結果傳給任何問你打得如何的人。",
"Photograph the scorecard": "拍下計分表",
"Import, in the header, takes a picture of the monitor or a printed sheet. Every bowler on it, every frame it can read — no typing. It asks what you're importing, so you don't have to set the night up first.": "頁首的「匯入」可以拍下計分螢幕或列印的計分表。上面的每位球友、每一格讀得到的資料都會匯入——完全不用打字。它會問你要匯入什麼，所以不必先建立今天的打球紀錄。",
"Improve reads your own history and tells you what it finds — which ball is carrying, where a spare is leaking, what changed this month. Each one says how confident it is, and while the sample is still small it says so rather than letting you act on a pattern that is really just noise.": "「進步」會讀取你自己的紀錄，告訴你它發現了什麼——哪顆球帶瓶好、哪種補中一直漏掉、這個月有什麼變化。每一項都會說明有多確定；樣本還少的時候也會直說，免得你根據其實只是雜訊的模式採取行動。",
"The Nightcap": "Nightcap",
"On a league or tournament Results screen, the Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Log the night ball by ball and it pours itself once the night is saved.": "在聯賽或比賽的「結果」畫面，Nightcap 會幫你回顧今天——殘瓶都落在哪裡、失誤讓你丟了多少分、哪顆球帶瓶最好。逐球記錄今天的打球，儲存後 Nightcap 就會自動為你斟上一杯。",
"Ask Brooklyn": "問 Brooklyn",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. Her lamp sits in the header on every screen, so you never have to go looking. Three wishes a day.": "「統計」畫面提供常用的數字。Brooklyn 負責回答那些畫面答不了的問題——用平常說話的方式問關於你自己打球的事，她會根據你記錄的資料找出答案。如果需要你還沒記錄的項目，她會告訴你該開始記錄什麼。她的神燈就在每個畫面的頂端，不用特地去找。每天可以許三個願望。",
"Linking up": "建立連結",
"Improve has a Coach button. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "「進步」分頁有「教練」按鈕。先選好方向——對方指導我，還是我指導對方——然後產生代碼。把這 8 個字元念給對方聽，對方在自己的手機上輸入後，你們就連結了。",
"Both sides, one screen": "兩種身分，一個畫面",
"If you do both, the View chips flip between them: I'm bowling shows what your own coach has sent you, I'm coaching shows your bowlers. A coach sees their pupils' scores without having to add them as a friend, and either of you can end it from your own phone.": "如果兩種身分都有，可以用「檢視」標籤切換：「我在打球」顯示你的教練傳給你的內容，「我在指導」顯示你指導的球員。教練不用加對方為好友就能看到球員的分數，任何一方也都可以在自己的手機上結束連結。",
"Reading a bowler": "解讀球員狀況",
"Pick a bowler and you get their recent nights and how their shots break down — strikes, spares, the leaves that keep coming back — with the number of shots it's built on shown beside it, so you know how much to trust it.": "選一位球員，就能看到他最近幾次打球和投球的細部分析——全倒、補中、一再出現的殘瓶——旁邊還會標出這些數字是根據幾球算出的，讓你知道可以信任到什麼程度。",
"Setting work": "指派任務",
"A task is something to go and do, with an optional measurable target and a due date — convert 60% of your single-pin spares, say. Leave the target off for anything that isn't a number.": "任務就是要實際去做的事，可以設定可量化的目標（選填）和截止日期——例如單瓶補中率達到 60%。不是數字的任務，目標就留空。",
"Answering back": "回報結果",
"The bowler marks it done, or records an attempt with the number they actually reached and a note about how it went. Either way it comes back to the coach, so the next thing you set is based on what happened rather than what was asked for.": "球員可以把任務標記為完成，或記錄一次嘗試，填上實際達到的數字和過程備註。不論哪種都會回傳給教練，讓你下一次指派的任務是根據實際結果，而不是當初的要求。",
"Break it down": "細部分析",
"The chips across the top slice the same numbers different ways — yours, your team's, by ball, by game, by center.": "上方的標籤能用不同方式切分同樣的數字——你的、球隊的、依球、依局、依球館。",
"Compare": "比較",
"Put yourself beside a teammate, or against the team as a whole. Same measures, same scale.": "把自己和一位隊友並排比較，或和整支球隊比。同樣的指標，同樣的刻度。",
"When there isn't much data yet": "資料還不多的時候",
"Nothing is locked — every card shows its numbers. But a number built on a handful of shots moves more with luck than with you, so until there's enough behind it the card is faded and says how many more shots it needs to be reliable.": "沒有任何東西被鎖住——每張卡片都會顯示數字。但只根據幾球算出的數字，受運氣影響比受你影響更大，所以在累積足夠資料之前，卡片會變淡，並告訴你還需要幾球才可靠。",
"The trend graph": "趨勢圖",
"Pick the measure, the ball and the league from the three dropdowns, then choose how far back to look — a number of games, a number of days, or two dates. Every game, or one point per night.": "從三個下拉選單選擇指標、球和聯賽，再決定要往回看多久——幾局、幾天，或兩個日期之間。可以每局一個點，或每次打球一個點。",
"Look around": "四處看看",
"What's behind each tab": "每個分頁有什麼",
"By game, or ball by ball": "按局記錄，或逐球記錄",
"Bowling a tournament": "打比賽",
"Blocks, the cut, match play, the ladder": "輪次、晉級線、對戰賽、階梯賽",
"What the AI does": "AI 能做什麼",
"Scorecards, insights, Nightcap, Brooklyn": "計分表、分析、Nightcap、Brooklyn",
"Breakdowns, comparing, trends": "細部分析、比較、趨勢",
"Linking up, tasks, what comes back": "建立連結、任務、回報結果",
"Your pins, as bowled.": "你實際擊倒的瓶數。",
"Pins added to every game.": "每局都加上讓分。",
"You bowl the whole game.": "整局都由你自己打。",
"You and a partner alternate frames.": "你和搭檔輪流打每一格。",
"I start": "我先打",
"Partner starts": "搭檔先打",
"you and your partner": "你和搭檔",
"Your own frames still count toward strikes, spares and how each ball carried.": "你自己打的格仍會計入全倒、補中和每顆球的帶瓶統計。",
"Average score per night.": "每次打球的平均分數。",
"Best Game": "單局最高分",
"Your best single game each night.": "每次打球中你的單局最高分。",
"Series Total": "系列總分",
"Total pins each night.": "每次打球的總擊倒瓶數。",
"First game each night.": "每次打球的第 1 局。",
"Second game each night.": "每次打球的第 2 局。",
"Third game each night.": "每次打球的第 3 局。",
"Share of first balls that struck, per night.": "每次打球中，第一球全倒的比例。",
"Non-split spare conversion, per night.": "每次打球中，非技術球殘瓶的補中率。",
"Conversion on a lone corner pin, per night.": "每次打球中，只剩單一角瓶時的補中率。",
"Frames closed with a strike or spare, per night.": "每次打球中，以全倒或補中完成的格數。",
"No clear direction — the movement here is within normal night-to-night variation.": "沒有明顯趨勢——這裡的起伏仍在每次打球之間的正常變動範圍內。",
"Days": "天數",
"the start": "最初",
"Drill": "練習項目",
"Name it (optional)": "名稱（選填）",
"Pins (optional)": "球瓶（選填）",
"No ball recorded": "未記錄用球",
"· last time": "· 上次",
"✓ Made": "✓ 成功",
"✗ Missed": "✗ 失敗",
"Undo last": "復原上一球",
"Shot notes — what worked on this drill…": "投球筆記——這個練習項目中有效的做法…",
"✓ Drill Saved": "✓ 練習項目已儲存",
"Throw a few first": "先投幾球吧",
"+ Start another drill": "+ 開始另一個練習項目",
"Saved tonight": "今天已儲存",
"This screen hit a problem": "這個畫面發生問題",
"Your data is safe — nothing was lost. The rest of the app still works, so you can switch to another tab.": "你的資料很安全，沒有遺失任何東西。App 的其他部分仍可正常使用，你可以切換到其他分頁。",
"Try again": "再試一次",
"Copy details": "複製詳細資訊",
"Unknown": "未知",
"Loading friends…": "正在載入好友…",
"Add a Friend": "新增好友",
"Search by name…": "依名字搜尋…",
"No one found with that name.": "找不到這個名字的使用者。",
"Share Sign-In Link": "分享登入連結",
"A quick way to hand someone the app link — scanning this just opens the sign-in screen. It doesn't log anyone in as anyone; each person still enters their own email.": "快速把 App 連結交給別人的方法——掃描後只會開啟登入畫面，不會讓任何人以別人的身分登入；每個人仍需輸入自己的電子郵件。",
"QR code to sign-in page": "前往登入頁面的 QR Code",
"Sent": "已送出",
"No friends yet — search above to add someone.": "還沒有好友——在上方搜尋來新增好友。",
"⚠️ Your games aren't attributed to your account": "⚠️ 你的分數紀錄沒有歸入你的帳號",
"Your account's display name doesn't match the bowler name your sessions are logged under. Set your name in Teams to fix this.": "你帳號的顯示名稱和打球紀錄使用的球友名稱不一致。在「球隊」中設定你的名字即可修正。",
"✓ reached": "✓ 已達成",
"Not enough data yet —": "資料還不夠——",
"before this is worth reporting.": "才有參考價值。",
"Nothing logged for this yet.": "這一項還沒有紀錄。",
"Now:": "目前：",
"Target met": "已達標",
"Pick a statistic first.": "請先選擇統計項目。",
"Enter a number.": "請輸入數字。",
"Goals": "目標",
"Set a target for a statistic you're working on and track progress against it.": "替你正在加強的統計項目設定目標，並追蹤進度。",
"+ Add a goal": "+ 新增目標",
"You've set a goal for every statistic available.": "你已經替所有可用的統計項目都設定了目標。",
"Statistic": "統計項目",
"Choose one…": "請選擇…",
"Needs": "需要累積",
"before progress is shown.": "才會顯示進度。",
"Google signed in but didn't return an ID token. This usually means": "Google 已登入，但沒有傳回 ID 權杖。這通常表示",
"the sign-in wasn't configured for online mode.": "登入沒有設定為線上模式。",
"Couldn't sign in with Google. Check your connection and try again.": "無法使用 Google 登入。請檢查網路連線後再試一次。",
"Menu": "選單",
"Search help…": "搜尋說明…",
"Search help": "搜尋說明",
"Search": "搜尋",
"Name, hand, style, home centers": "名字、慣用手、打法、常去的球館",
"Theme, stats cards, account": "主題、統計卡片、帳號",
"Search help — try 'buy-in' or 'prebowl'": "搜尋說明——試試「報名費」或「預打」",
"Show me around the app again": "再帶我看一次 App 導覽",
"Nothing matched \"": "找不到符合「",
"\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".": "」的結果。試試 App 裡會出現的字詞——「補中」、「球隊」、「球」、「匯入」。",
"This season": "本賽季",
"Your career": "生涯紀錄",
"League season": "聯賽賽季",
"Between seasons": "休賽期間",
"All league play": "所有聯賽",
"this season": "本賽季",
"No games yet": "還沒有打過任何一局",
"Your bowling": "我的保齡球",
"League average": "聯賽平均",
"High game": "單局最高分",
"High series": "系列最高分",
"Open full statistics": "查看完整統計",
"My Bowling Journey": "My Bowling Journey",
"Your milestones and progress": "你的里程碑與進度",
"Latest milestone": "最新里程碑",
"milestone": "里程碑",
"so far": "（至今累計）",
"Next ·": "下一個 ·",
"Progress to next milestone": "距離下一個里程碑的進度",
"Your bowling story starts here.": "你的保齡球故事從這裡開始。",
"What are you doing today?": "今天要做什麼？",
"Latest ·": "最新 ·",
"That file could not be read.": "無法讀取這個檔案。",
"Import cancelled. Nothing was saved.": "已取消匯入，沒有儲存任何內容。",
"Nothing to import.": "沒有可匯入的內容。",
"Import scores from a file": "從檔案匯入分數",
"A CSV with four columns:": "CSV 檔需有四欄：",
". Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.": "。日期格式如 2026-09-17，分數為 0 到 300 的整數，每次可以有一到三局。",
"Import into": "匯入至",
"Imported (no league)": "匯入紀錄（無聯賽）",
"Leave it as Imported if these nights don't belong to a league you track.": "如果這些紀錄不屬於你正在記錄的聯賽，就維持「匯入紀錄」。",
"What would import": "將匯入的內容",
"row": "列",
"skipped": "已略過",
"Rows that can't be imported": "無法匯入的列",
"Row": "列",
"and": "還有",
"you already have": "已有紀錄",
"Replace those nights": "取代這幾次的紀錄",
"Keep mine, import the other": "保留我的，匯入其他",
"Cancel the import": "取消匯入",
"Importing…": "匯入中…",
"Imported from a teammate's scorecard photo. These are already counting — confirming just marks them checked.": "從隊友的計分表照片匯入。這些分數已經計入——確認只是把它們標記為已核對。",
"Scores read": "讀取到的分數",
"Frame-by-frame data included for": "含逐格資料：",
"— confirming adds it to your shot history.": "——確認後會加入你的投球紀錄。",
"These are right": "分數正確",
"Fix them": "修正",
"What were they actually?": "實際分數是多少？",
"Save corrections": "儲存修正",
"None of these are mine": "這些都不是我的",
"Needs You": "待你處理",
"Open ›": "開啟 ›",
"You were added to the roster as": "你已被加入隊員名單：",
"a member": "一般隊員",
". Teammates will be able to import your scores from a scorecard photo — you still confirm them.": "。之後隊友可以從計分表照片匯入你的分數——但仍需由你確認。",
"Joining…": "加入中…",
"Join team": "加入球隊",
"Invitation": "邀請",
"Invitations": "邀請",
"Scores To Check": "待確認的分數",
"imported by a teammate.": "的分數由隊友匯入。",
"Needs Re-entering": "需要重新輸入",
"You said these weren't yours, so they've stopped counting. Enter them on the Log tab when you have them.": "你說這些不是你的分數，所以它們已不再計入。等你知道分數後，請到「打球」分頁輸入。",
"Waiting On Teammates": "等待隊友確認",
"These haven't been confirmed and a session has since finished. You can correct them if you know the real scores.": "這些分數還沒確認，而且在那之後又已經打完一次了。如果你知道實際分數，可以自行修正。",
"Correct these": "修正分數",
"Couldn't read that scorecard right now. Try again in a few minutes, or enter the scores by hand.": "目前無法讀取這張計分表。請過幾分鐘再試，或手動輸入分數。",
"No": "否",
"Which pins did the second ball knock down?": "第二球打倒了哪幾支球瓶？",
"this frame": "支（這一格合計）",
"Game": "局",
"No frame-by-frame detail on this scorecard — importing the game score only.": "這張計分表沒有逐格明細——只匯入這局的分數。",
"Score": "分數",
"That isn't a possible game score — type the real one.": "一局不可能出現這個分數——請輸入實際分數。",
"fill ball": "個加球",
"below couldn't be reliably read from the image -- please double-check the pin count.": "（見下方）無法從圖片中準確讀取——請再確認一次擊倒瓶數。",
"Tap a frame to fix what was read.": "點一下某一格，修正讀取的內容。",
"· fill ball — pick a result": "· 加球：請選擇結果",
"What are you importing?": "要匯入什麼？",
"Which team?": "哪一支球隊？",
"No teams yet — add one under a league in Team, then import.": "還沒有球隊——先到「球隊」的聯賽底下新增一支，再來匯入。",
"Which tournament?": "哪一場比賽？",
"No tournaments yet — start one on the Bowl tab first.": "還沒有比賽——請先在「打球」分頁開始一場比賽。",
"Filed as practice — no league or team needed.": "會存為練習——不需要聯賽或球隊。",
"Date": "日期",
"Couldn't read one of the selected images.": "有一張選取的圖片無法讀取。",
"Couldn't read the selected images.": "無法讀取選取的圖片。",
"The import took too long and was stopped. Try one image at a time.": "匯入花太久時間，已經停止。請一次試一張圖片。",
"a Lite model cannot be trusted with pin identities": "",
"frames did not match the printed total": "",
"saw frame detail but read none": "",
"read no frames": "",
"no response": "",
"timed out": "",
"no frames": "",
", mismatched": "",
"The scorecard reader is busy right now — this happens at peak times and usually clears within a few minutes.": "計分表辨識服務目前忙碌中——尖峰時段會發生這種情況，通常幾分鐘內就會恢復。",
"Read Frames": "讀取各格",
"Read Scores": "讀取分數",
"The scorecard reader's daily allowance is used up. It resets on Google's clock, so this usually means tomorrow — scores typed in by hand save normally in the meantime.": "計分表辨識的每日額度已經用完。額度依 Google 的時間重置，所以通常要等到明天——這段期間手動輸入的分數仍可正常儲存。",
"The scorecard reader is briefly over its rate limit. Wait about a minute and try again — nothing is lost.": "計分表辨識暫時超過使用頻率上限。請等大約一分鐘再試——不會遺失任何資料。",
"The scorecard reader isn't available right now. Scores typed in by hand save normally in the meantime.": "計分表辨識目前無法使用。這段期間手動輸入的分數仍可正常儲存。",
"Couldn't reach the scorecard reader. Check your signal, or try one image at a time —": "無法連線到計分表辨識服務。請檢查訊號，或一次只試一張圖片——",
"a large photo can take too long to send.": "大張照片可能要傳很久。",
"No games could be read from the image(s). Try a clearer screenshot.": "無法從圖片讀出任何一局。請換一張更清楚的截圖試試。",
"Found games but couldn't read any scores or frame detail. Try a clearer screenshot.": "有找到局數，但讀不出任何分數或逐格內容。請換一張更清楚的截圖試試。",
"Frames you already have will be skipped, so nothing gets double-counted. Anything new on this card still comes in. Continue?": "已有的格會略過，不會重複計算；這張計分表上的新內容仍會匯入。要繼續嗎？",
"Nothing was mapped to you on this card.": "這張計分表上沒有對應到你的紀錄。",
"What's on the card?": "計分表上有什麼？",
"Game scores": "每局分數",
"Frame by frame": "逐格",
"Reads each game's score. Fastest. If the card turns out to show frames, they get read too.": "讀取每一局的分數，速度最快。如果計分表其實有逐格內容，也會一併讀取。",
"Reads every ball and the pins it left. Slower, and leaves can come back wrong — you'll see each frame as a scoresheet to fix before saving.": "讀取每一球和它留下的殘瓶。速度較慢，殘瓶也可能讀錯——儲存前會把每一格顯示成計分表，讓你修正。",
"Scorecard Screenshot": "計分表截圖",
"Clear all": "清除全部",
"image": "張圖片",
"Nothing's broken — just busy": "沒有故障——只是目前比較忙",
"Reading the scorecard…": "正在讀取計分表…",
"This can take a minute or two — every frame is read individually.": "可能需要一兩分鐘——每一格都會逐一讀取。",
"Keep this screen open until it finishes.": "完成前請停留在這個畫面。",
"Who's who": "確認球友",
"bowler": "位球友",
"read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.": "已從計分表讀出。儲存前請逐一確認——配錯人會把一個人的分數寫進另一個人的紀錄。",
"frame tracking": "逐格記錄",
"scores only": "只記分數",
"no detail": "無詳細資料",
"series": "系列",
"· combined from": "· 由",
"images": "張圖片合併",
"Games add to": "各局加總為",
"but the card's scratch series is": "，但計分表上的不讓分系列總分是",
". One of the games was misread — check the card.": "分。其中一局讀錯了——請核對計分表。",
"Skip this bowler": "略過這位球友",
"Add \"": "將「",
"\" as a new bowler": "」新增為新球友",
"More than one bowler matches this name equally — pick the right one.": "有不只一位球友和這個名字同樣相符——請選出正確的人。",
"Matched on the alias \"": "已依別名比對：「",
"Roster order": "隊員名單順序",
"The card's order doesn't match your team roster. Names still matched correctly — but if the roster is wrong, position hints will be wrong for every future import.": "計分表上的順序和你的隊員名單不一致。名字仍然都比對正確——但如果名單有誤，之後每次匯入的出場順序提示都會出錯。",
"Card order:": "計分表順序：",
"Continue": "繼續",
"Start Over": "重新開始",
"nothing was mapped to you on this card.": "這張計分表上沒有對應到你的分數。",
"check the games below — some came through frame by frame, some as scores only. Correct anything that's wrong, then save.": "請檢查下方各局——有些是逐格讀取，有些只讀到分數。有錯的地方就修正，然後儲存。",
"Where this goes": "存到哪裡",
"This scorecard": "這張計分表",
"check the numbers against the card before saving": "儲存前請把數字和計分表核對一遍",
"Also sending to teammates": "也會傳送給隊友",
"These go to": "這些分數會傳給",
"this bowler": "這位球友",
"these bowlers": "這些球友",
"to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.": "確認。分數會立即計入——確認只是把它們標記為已核對。傳送前請修正讀錯的地方。",
"read as \"": "辨識為「",
"couldn't be read — type the real score, or clear the box if they didn't bowl it.": "無法讀取——請輸入實際分數；如果這位球友沒打這局，就把欄位清空。",
"Series": "系列總分",
"· card printed": "· 計分表上為",
"Saving…": "儲存中…",
"Pick a result for the fill ball first": "請先選擇加球的結果",
"Fix the flagged scores first": "請先修正標記的分數",
"Looks Good — Save": "沒問題，儲存",
"Moderate": "普通",
"Tentative": "初步",
"What This Is Based On": "分析依據",
"games. Only statistics with enough data to be meaningful are analysed.": "局。只分析資料量足以得出有意義結果的統計。",
"Ball comparisons unlock as each ball builds up its own sample. They need more than overall stats because comparing two percentages doubles the uncertainty.": "每顆球累積到足夠的樣本後，就會開放球與球之間的比較。比較兩個百分比會讓不確定性加倍，所以需要的資料比整體統計更多。",
"You're close on": "即將解鎖：",
"— a couple more nights and it unlocks.": "——再打兩三次就會開放。",
"Insights": "分析",
"Select a bowler on the Log tab first. Insights are about one bowler's game, not everyone's combined.": "請先在「打球」分頁選擇球友。分析針對的是一位球友的表現，不是所有人的合計。",
"to go.": "才能開始分析。",
"Insights need at least": "分析至少需要",
"games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.": "局。局數不夠時，每次打球的數字起伏太大，說不出什麼可靠的結論——你會看到聽起來很有把握、其實只是雜訊的規律。",
"You have": "你有",
"games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.": "局紀錄。目前還沒有任何項目的資料足以做出可靠的分析——以下是最接近的項目。",
"Based on": "目前根據",
"games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.": "局的資料。記錄越多，分析就越準確——打幾次只能看出端倪，打完一個賽季才有足以採取行動的依據。",
"New since last time:": "上次之後新增：",
"Dismiss": "關閉",
"Looks at your logged statistics and reports what stands out. It only uses numbers with enough data behind them, and it reports patterns rather than telling you how to bowl.": "查看你記錄的統計，指出特別突出的地方。只採用背後有足夠資料的數字，而且只呈現趨勢，不會告訴你該怎麼打。",
"Analysing…": "分析中…",
"Analyse My Game": "分析我的表現",
"Try Again": "再試一次",
"Worth Paying Attention To": "值得留意的地方",
"Written by AI from the stats you've logged. It can be wrong, and it can sound confident while being wrong — treat it as a starting point for a conversation, not an instruction.": "由 AI 根據你記錄的統計撰寫。內容可能有誤，而且可能說得頭頭是道卻是錯的——請把它當作討論的起點，而不是指示。",
"You're working with": "你目前跟著",
"a coach": "一位教練",
"— worth talking this through with them before changing anything. They can see what these numbers can't.": "練球——做任何調整之前，值得先和教練好好討論。這些數字看不到的，教練看得到。",
"Run Again": "重新分析",
"Night": "打球日",
"Pattern": "油型",
"Shot": "投球",
"Nothing written yet. Notes you add to a shot, a drill or the end of a night all collect here, so you can look back at what you were working on and what you said about it.": "還沒有寫下任何內容。你在投球、練習項目或打球結束時加上的筆記都會集中在這裡，方便你回顧當時在練什麼，以及你對它的想法。",
"Search your notes…": "搜尋筆記…",
"Filters": "篩選條件",
"Filter": "篩選",
"Kind": "類型",
"Dates": "日期",
"From date": "開始日期",
"To date": "結束日期",
"in that range": "在這個期間內",
"Nothing written in that range.": "這個期間內沒有寫下任何內容。",
"The road starts with your first night": "旅程從你第一次打球開始",
"Badges": "徽章",
"pins down": "擊倒瓶數",
"Up next": "下一個目標",
"Your bowling milestones, newest first": "你的保齡球里程碑，最新的在前",
"LATEST": "最新",
"Your road starts here": "你的旅程從這裡開始",
"Log a night and your first milestones land on the road with the date you did them — first strike, first spare, first 100.": "記錄一次打球，你的第一批里程碑就會連同達成日期出現在旅程上——第一個全倒、第一個補中、第一次 100 分。",
"The road so far": "目前的旅程",
"newest first": "最新的在前",
"What you've collected along the way": "一路上的收穫",
"Your active league": "你使用中的聯賽",
"The free plan follows this league.": "免費方案只記錄這個聯賽。",
"Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.": "切換聯賽或打一個以上的聯賽是 Pro 的功能——訂閱後，你記錄的所有內容都會回來。",
"Get Pro": "升級 Pro",
"That league is still syncing. Give it a moment and try again.": "這個聯賽還在同步中，請稍候再試一次。",
"Your active league is already chosen. Switching leagues is part of Pro.": "你已經選定使用中的聯賽。切換聯賽是 Pro 的功能。",
"Could not save that just now. Your leagues are untouched — try again in a minute.": "目前無法儲存。你的聯賽都沒有變動——請過一分鐘再試一次。",
"Choose your active league": "選擇要使用的聯賽",
"A free account follows one league. Pick the one you want to keep bowling with — you choose once, and switching later is part of Pro. The rest are paused, not deleted, and everything you have logged comes back when you subscribe.": "免費帳號只能記錄一個聯賽。選擇你想繼續打的聯賽——只能選一次，之後要切換是 Pro 的功能。其他聯賽會暫停，不會刪除；訂閱後，你記錄的所有內容都會回來。",
"Active league": "使用中的聯賽",
"Paused:": "已暫停：",
". Practice and Just Bowling stay open either way.": "。無論如何，練習和自由打都可以照常使用。",
"Keep this league": "保留這個聯賽",
"Saved.": "已儲存。",
"is your active league.": "是你使用中的聯賽。",
"more ▾": "更多 ▾",
"Oil pattern": "油型",
"Which nights": "選擇打球日",
"Every night": "全部日期",
"Avg": "平均",
"vs your": "對比整體平均",
"overall": "分",
"g": "局",
"breakpoint": "轉折點",
"Averaged over the night": "當天整體平均",
"Show my usual line": "顯示我平常的路線",
"Follow the transition": "跟著油況變化看",
"Position through the block": "在這組局數中的位置",
"fresh oil": "剛上油",
"end of the block": "打到最後",
"Show all": "顯示全部",
"Hide all": "隱藏全部",
"Nothing on the lane — turn a ball back on.": "球道上沒有顯示任何球——請重新開啟一顆球。",
"on this night": "（當天）",
"Solid while it skids, dashed once it turns — where it turns comes from the oil pattern rather than from anything you logged.": "球還在滑行時是實線，開始轉彎後是虛線——轉彎的位置取決於油型，而不是你記錄的任何資料。",
"no pins": "沒有球瓶",
"Rank leaves by": "殘瓶排序方式",
"Top missed": "最常沒補中",
"Top made": "最常補中",
"Everything else": "其他",
"Show more": "顯示更多",
"Collapse all": "全部收合",
"Me": "我",
"Partner": "搭檔",
"Nightcap": "Nightcap",
"isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "在 Baker 賽制的日子不開放——計分格屬於兩人搭檔，不屬於單一球友。",
"Points Won": "獲得積分",
"Tap to cycle: not marked → won → lost.": "點一下切換：未標記 → 贏 → 輸。",
"Pinfall": "擊倒瓶數",
"of 4 points": "/4 積分",
"Side Games": "場邊彩池",
"in": "投入",
"Tonight": "今天",
"G": "G",
"If every makeable spare had been made": "如果能補的都補中了",
"Theory": "理論",
"Theory Series": "理論系列",
"pins left on the lane": "瓶留在球道上",
"✓ Converted every makeable spare": "✓ 能補的都補中了",
"actual vs": "分是實際分數，理論上可達",
"possible)": "分)",
"Quarter game": "25 美分局",
"Dollar game": "1 美元局",
"3-6-9 (whole night)": "3-6-9（當天全程）",
"Side games tonight": "今天的場邊彩池",
"Tap the ones you're in. Buy-ins are saved for": "點選你有參加的項目。報名費會記在",
"— you won't need to enter them again.": "——之後不用再輸入。",
"Buy-in per game": "每局報名費",
"not playing": "不參加",
"paid in": "投入金額",
"Highest game in the league takes it — enter what you won, if anything.": "由聯賽當天單局最高分的人拿下——如果你有贏，請輸入金額。",
"All nine struck — you took it": "指定的九格全倒——你拿下了彩池",
", and the tenth carried for the jackpot": "，第 10 格也全倒，連累積彩池一起拿下",
"Pot": "彩池",
"Jackpot": "累積彩池",
"won tonight": "今天贏得的獎金",
"✓ Winnings Saved": "✓ 獎金已儲存",
"Save Winnings": "儲存獎金",
"Strike %": "全倒率",
"Spare %": "補中率",
"10 Pins": "10 號瓶殘瓶",
"Weak 10s": "軟 10 號瓶",
"Ringing 10s": "顫動的 10 號瓶",
"Other 10s": "其他 10 號瓶",
"Splits": "技術球",
"Converted": "補中率",
"Balls used": "使用的球",
"Release Quality": "出手品質",
"Good": "好",
"Bad": "差",
"Misses": "偏差",
"Running Averages": "累計平均",
"Composite": "綜合",
"Share tonight": "分享今天的成績",
"Set up": "準備",
"Scoring": "輸入分數",
"Side games": "場邊彩池",
"Games": "局數",
"Tonight's Session": "今天的聯賽",
"✓ Prebowling": "✓ 預打",
"Prebowling for a future week?": "為之後某一週預打？",
"Opponent": "對手",
"Opponent (e.g. Team Name)": "對手（例如：隊名）",
"Handicap": "讓分",
"Starting Lane": "起始球道",
"e.g. 8": "例如：8",
"Lanes": "球道",
"Official Pattern": "官方油型",
"Length (ft)": "長度（ft）",
"Volume (mL)": "油量（mL）",
"Ratio (e.g. 3:1)": "比例（例如：3:1）",
"Lane Conditions": "球道狀況",
"This league usually runs": "這個聯賽通常使用的油型是",
". Anything you set here is for tonight only.": "。在這裡設定的內容只適用於今天。",
"Start Scoring": "開始輸入分數",
"Cancel League": "取消今天的聯賽",
"This deletes tonight's shots, game scores and match points for": "這會刪除今天的投球、各局分數和對戰積分，對象：",
", clears the setup, and takes you back to Home. This cannot be undone.": "，同時清除今天的設定並回到首頁。此動作無法復原。",
"Keep bowling": "繼續打",
"Delete and exit": "刪除並離開",
"Enter Game Scores": "輸入各局分數",
"Which bag tonight?": "今天用哪個球袋？",
"All my balls": "我所有的球",
"frames say": "計分格算出",
"Ball…": "球…",
"Surface…": "表面處理…",
"Delete game": "要刪除第",
"? This removes the score": "局嗎？這會刪除分數",
"and every frame logged for it": "以及這局記錄的所有格",
". It can't be undone.": "。此動作無法復原。",
"+ Add game": "+ 新增一局",
"Want to see which spares are costing you?": "想知道哪些補中機會讓你丟分嗎？",
"You've logged a few nights on game tracking. Tracking one game frame by frame turns those into spare conversion, carry and leave patterns. You can switch back whenever you like.": "你已經用只記分數的方式記錄了幾次。只要把一局逐格記錄下來，這些資料就能變成補中率、帶瓶和殘瓶模式的分析。你隨時都可以改回來。",
"Try it for a game": "試一局看看",
"We love leagues too! 🎳": "我們也愛聯賽！🎳",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet — you can add one whenever you like, and tonight's scores will join it.": "新增你參加的聯賽，就能馬上開始輸入分數。現在還不需要球隊——你隨時都可以新增，今天的分數也會一起加進去。",
"Add my league": "新增我的聯賽",
"Show me how first": "先教我怎麼用",
"Want these to count for your team?": "要把這些分數算進球隊嗎？",
"Your scores are saved and yours either way. Joining your team — or making one if it's not there yet — puts them on the team sheet as well: standings, side pots and everyone's averages in one place. Everything you've already logged in this league comes with you.": "無論選哪一個，你的分數都會儲存，也都屬於你。加入你的球隊——還沒有的話就建立一個——分數也會列在球隊的計分表上：排名、彩池和每個人的平均都在同一個地方。你在這個聯賽已經記錄的所有內容也會一起帶過去。",
"Add or join my team": "新增或加入我的球隊",
"Not now": "以後再說",
"Scores above are enough. Frames below add shot and ball data.": "上面的分數就夠了。在下方逐格記錄，可以再加上投球和用球資料。",
"Shot Context": "投球資訊",
"10th Frame": "第 10 格",
"No bowler selected": "未選擇球友",
"— pick a league above": "——請在上方選擇聯賽",
"Series so far": "目前系列總分",
"Frame": "格",
"Ball in 10th": "第 10 格的球次",
"Lane": "球道",
"✏️ Edit the 10th — which ball?": "✏️ 修改第 10 格——要改哪一球？",
"Fill": "加球",
"✏️ Editing Shot": "✏️ 正在編輯投球",
"Keeping score for": "記錄對象",
"✓ Also scoring for others": "✓ 也幫其他人記分",
"Also scoring for others": "也幫其他人記分",
"Add someone bowling with you": "新增和你一起打的人",
"No teammates on this league's roster yet — add them on the Social tab.": "這個聯賽的隊員名單上還沒有隊友——請到「好友」分頁新增。",
"Result": "結果",
"Required": "必填",
"everything else is optional": "其他都是選填",
"Other": "其他",
"Pins Standing": "剩下的球瓶",
"Gutter": "洗溝",
"9 Pin No-Tap → scored as Strike": "9 瓶 No-Tap → 記為全倒",
"Leave:": "殘瓶：",
"· First ball:": "· 第一球：",
"Strike Description": "全倒類型",
"Spare Made": "是否補中",
"Which pins did you knock down?": "你擊倒了哪些球瓶？",
"Tap the ones that fell. None of them? Just save the shot.": "點選倒下的球瓶。一支都沒倒？直接儲存這一球就好。",
"That's every pin — we'll save this as a spare.": "全部球瓶都倒了——會記為補中。",
"First ball:": "第一球：",
"Second ball:": "第二球：",
"Done picking pins — show the rest of the form": "球瓶選好了——顯示表單其餘欄位",
"Clear everyone's game 1 scores?": "要清除所有人第 1 局的分數嗎？",
"Later games move down one.": "之後的局會往前遞補一局。",
"Scores": "分數",
"Just the final score for each game. Totals add themselves.": "只要填每局的最後分數，總分會自動計算。",
"BOWLER": "球友",
"Total": "總分",
"Clear game 1 scores": "清除第 1 局分數",
"TOTAL": "總分",
"+ Add a game": "+ 新增一局",
"Cancel Open Bowling": "取消自由打",
"This deletes tonight's open bowling scores for everyone on the sheet and takes you back to Home. This cannot be undone.": "這會刪除計分表上所有人今天的自由打分數，並回到首頁。此動作無法復原。",
"Ball Change Reason": "換球原因",
"Switched from": "從",
"— why?": "——為什麼換？",
"Optional below this line": "以下為選填",
"Accessory details": "其他細節",
"tap to open": "點一下展開",
"— pick a ball —": "— 選擇球 —",
"Surface": "表面處理",
"Line": "路線",
"Stand": "站位",
"board #": "板號",
"Hit": "實際通過",
"Breakpoint": "轉折點",
"On target": "命中目標",
"board": "板，偏",
"of target": "（相對目標）",
"Release": "出手",
"Speed": "球速",
"Rev rate": "轉速",
"Axis rot.": "軸心旋轉",
"Axis tilt": "軸心傾斜",
"Shoes": "球鞋",
"Heel #": "鞋跟編號",
"Sole #": "鞋底編號",
"Execution": "動作執行",
"repeat(2, minmax(0, 1fr))": "",
"minmax(0, 1fr)": "",
"Miss": "偏差",
"Tap the pins you left standing.": "點選還站著的球瓶。",
"Answer \"Spare Made\" above to save.": "請先回答上方是否補中，才能儲存。",
"Nothing logged yet tonight. Shoot a game or run a drill and it lands here.": "今天還沒有任何紀錄。打一局或做個練習項目，就會出現在這裡。",
"average": "平均",
"strikes": "全倒",
"spares": "補中",
"clean": "無失誤",
"first balls struck": "（第一球全倒）",
"Best carry tonight:": "今天帶瓶最好的球：",
"over": "/",
"first balls": "第一球",
"Session Notes": "今天的筆記",
"How the night went, what to try next time…": "今天打得如何、下次想試什麼…",
"Cancel Practice": "取消練習",
"This deletes today's practice shots and game scores for": "這會刪除今天的練習投球和各局分數，對象：",
"and takes you back to Home. This cannot be undone.": "，並回到首頁。此動作無法復原。",
"Keep practicing": "繼續練習",
"✓ Updated": "✓ 已更新",
"✓ Saved": "✓ 已儲存",
"Update": "更新",
"Save Shot": "儲存投球",
"Open Bowling": "自由打",
"Enter a score first": "請先輸入分數",
"Session": "這次打球",
"That sign-in link didn't work — it may have expired. Send yourself a new one.": "這個登入連結無法使用，可能已經過期。請重新寄一封新的連結給自己。",
"Couldn't finish signing in. Check your connection and try the link again.": "無法完成登入。請檢查網路連線，再重新開啟連結。",
"Couldn't pour the nightcap just then. Tap to try again.": "剛剛沒能倒出 Nightcap。點一下再試一次。",
"No signal for this one. It'll still be here when you're back online.": "目前沒有網路。等你恢復連線，這裡的內容還會在。",
"That nightcap came back in a shape the app couldn't read. Tap to try again.": "這次的 Nightcap 回傳格式無法讀取。點一下再試一次。",
"Nightcap 🥃": "Nightcap 🥃",
"Try tracking frame data next week and we'll have a Nightcap together.": "下週試著記錄每一格的資料，我們再一起喝杯 Nightcap。",
"There are": "共有",
"things worth saying about tonight.": "件今天值得一提的事。",
"The Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Part of the paid plan.": "Nightcap 會幫你回顧今天——殘瓶都落在哪裡、失誤讓你丟了多少分、哪顆球帶瓶最好。付費方案功能。",
"Pour another": "再來一杯",
"things were true about tonight. Here are the two or three worth hearing.": "件關於今天的事實，以下挑出最值得一聽的兩三件。",
"Pour the nightcap": "倒一杯 Nightcap",
"Reading back the night…": "正在回顧今天…",
"first balls across": "次第一球，共",
"— tonight only.": "——只看今天。",
"Pattern name": "油型名稱",
"Couldn't search for centers right now.": "目前無法搜尋保齡球館。",
"Welcome to": "歡迎使用",
"Who's bowling?": "誰要打球？",
"Your name goes on your scores and is how teammates find you. The rest sets up the stats correctly — all changeable later.": "你的名字會顯示在分數上，隊友也靠它找到你。其他設定是為了讓統計正確——之後都可以更改。",
"Your name": "你的名字",
"Which hand?": "慣用哪隻手？",
"Right": "右",
"Left": "左",
"Style": "比賽形式",
"One-handed": "單手",
"Two-handed": "雙手",
"Where do you bowl?": "你在哪裡打球？",
"(optional)": "（選填）",
"Search for a center": "搜尋保齡球館",
"Just a first name is fine.": "只填名字就可以了。",
"Got a team code from your captain?": "有隊長給你的球隊代碼嗎？",
"Team code": "球隊代碼",
"ABCD-EFGH": "ABCD-EFGH",
"Puts you straight onto your team, with anything they've already logged for you.": "直接加入你的球隊，隊友已經幫你記錄的資料也會一起帶入。",
"Do you coach other bowlers?": "你有在指導其他球友嗎？",
"Turns on the roster for tracking who you coach.": "開啟後可用球員名單追蹤你指導的球友。",
"Start Bowling": "開始打球",
"‹ Back to History": "‹ 返回紀錄",
"No game scores were saved for this night, so there are no results to show.": "這天沒有儲存任何一局的分數，所以沒有結果可以顯示。",
"Suggested new book average:": "建議的新官方平均：",
"Change the number below if this doesn't match your full season.": "如果這和你整個賽季的成績不符，請修改下方的數字。",
"Update to": "更新為",
"Not Now": "以後再說",
"Add a bowler on the Log tab first — profiles are per bowler.": "請先在「打球」分頁新增球友——每位球友都有自己的個人檔案。",
"Your Name": "你的名字",
"(not set)": "（未設定）",
"Scorecard Names": "計分表上的名字",
"None": "無",
"How your name shows up on the screens at your center — \"R. Nadon\", \"RYAN N\", a nickname. Adding these lets a scorecard photo find you instead of asking every time.": "你的名字在球館計分螢幕上的顯示方式——例如「R. Nadon」、「RYAN N」或綽號。加上這些名字後，掃描計分表照片時就能自動找到你，不必每次都問。",
"e.g. R. Nadon": "例如：R. Nadon",
"This is what teammates see when they search for you or view the roster — it defaults to your email prefix until you set it.": "這是隊友搜尋你或查看隊員名單時看到的名字——在你設定之前，預設為電子郵件 @ 前面的部分。",
", backup": "，反曲球",
"Handedness": "慣用手",
"A lefty's corner pin is the 7, not the 10 — this flips the result chips on the Log tab to match.": "左手球友的角瓶是 7 號瓶，不是 10 號瓶——這個設定會讓「打球」分頁的結果按鈕跟著左右翻轉。",
"Right-handed": "右手",
"Left-handed": "左手",
"Strike ball": "攻擊球",
"A backup ball goes out to the": "反曲球會先往",
"and hooks back, so your corner pin is the": "邊出去再勾回來，所以你的角瓶是",
"and your pocket is the": "號瓶，Pocket 在",
". Turning this on flips every leave, split and lane drawing to match — you are still": "號瓶之間。開啟後，所有殘瓶、技術球和球道圖都會跟著左右翻轉——但凡是標示慣用手的地方，你仍然是",
"-handed everywhere it says so.": "手。",
"I throw a backup ball": "我打反曲球",
"Delivery": "投球",
"Two-handed and no-thumb players are who the 2LS drilling layout system is built for.": "2LS 鑽孔配置系統就是為雙手和不插拇指的球友設計的。",
"Two-handed / no thumb": "雙手 / 不插拇指",
"Drift (boards)": "橫移（板）",
"Boards between where you start and where you slide, counting toward the middle.": "從起步位置到滑步停下位置之間的板數，往球道中間方向計算。",
"Lateral offset (boards)": "出球側距（板）",
"How far outside your slide the ball lays down. Usually 4 to 8 one-handed, less two-handed.": "球落在滑步腳外側多遠的地方。單手通常是 4 到 8 板，雙手會少一些。",
"Not coaching": "沒有指導",
"Turn this on if you coach other bowlers. It adds a view that shows their tasks and notes instead of your own game.": "如果你有指導其他球友，請開啟這個設定。會新增一個畫面，顯示他們的任務和筆記，而不是你自己的表現。",
"I bowl": "我打球",
"I coach": "我當教練",
"Your league": "你的聯賽",
"season wrapped up": "賽季已結束",
"Not enough games logged here yet to suggest a new number": "這裡記錄的局數還不夠，無法建議新的數字",
". You can still update it yourself below, or skip for now.": "。你仍然可以在下方自行更新，或先略過。",
"Skip — I'll update it myself": "略過——我自己更新",
"Book Average": "官方平均",
"Not set": "未設定",
"A static number from last season — the app never changes this on its own. When a league's season ends, you'll be prompted here to update it, with a suggested number you can accept or override.": "上個賽季的固定數字——App 不會自行更改。聯賽賽季結束時，這裡會提醒你更新，並提供建議數字讓你採用或自行修改。",
"e.g. 213": "例如：213",
"over how many games": "計算局數",
"Season (e.g. 2025-26 Winter)": "賽季（例如：2025-26 冬季）",
"Your best ever": "你的歷史最佳",
"Including before you started using the app. We'll tell you when you beat them.": "包含開始使用 App 之前的成績。你打破紀錄時，我們會告訴你。",
"Home Centers": "常去的球館",
"None yet": "還沒有",
"The houses this bowler plays regularly. Looked up so they match the same centers your leagues use.": "這位球友經常打球的球館。會先搜尋再加入，才能和你的聯賽使用的球館對應起來。",
"+ Add a Center": "+ 新增球館",
"Teams & Leagues": "球隊和聯賽",
"Not on a team": "沒有球隊",
"Taken from the roster on the Social tab — change it there and it updates here.": "取自「好友」分頁的隊員名單——在那裡修改後，這裡也會更新。",
"Not on any team yet.": "你還沒有加入任何球隊。",
"Add a ball": "新增球",
"Arsenal": "球具庫",
"Balls and their drilling layouts.": "球和它們的鑽孔配置。",
"Has a plastic ball ✓": "已有塑膠球 ✓",
"Add a plastic ball": "新增塑膠球",
"Could not start checkout. Please try again in a moment.": "無法開始結帳。請稍後再試一次。",
"Could not start checkout.": "無法開始結帳。",
"Could not open the subscription manager. Please try again.": "無法開啟訂閱管理頁面。請再試一次。",
"Your payment is pending. Pro unlocks once Google Play finishes processing it.": "你的付款正在處理中。Google Play 處理完成後，就會解鎖 Pro。",
"The purchase wasn't completed. You haven't been charged.": "購買沒有完成，你沒有被收費。",
"That purchase is already linked to another account.": "這筆購買已經綁定到其他帳號。",
"no ok in response": "",
"Your purchase went through, but we couldn't confirm it just yet. Pro will unlock shortly --": "你已完成購買，但我們暫時還無法確認。Pro 很快就會解鎖——",
"reopen the app in a few minutes. You won't be charged twice.": "請過幾分鐘再重新開啟 App。你不會被重複收費。",
"Pick a plan first.": "請先選擇方案。",
"Something went wrong starting that. Please try again.": "啟動時發生問題。請再試一次。",
"Trip 6": "Trip 6",
"Kick 7": "Kick 7",
"Free fall ·": "自由落瓶式 ·",
"String ·": "繩索式 ·",
"same": "相同",
"on string": "（繩索式）",
"splits excluded": "不含技術球",
"Messengers": "飛瓶",
"share of strikes": "佔全倒的比例",
"Splits left": "留下技術球",
"share of first balls": "佔第一球的比例",
"-pin left": "號瓶殘留：",
"% of first balls": "%（以第一球計）",
"What's left standing on each. Darker means left more often.": "各種方式下留在球道上的球瓶。顏色越深，代表越常殘留。",
"Free fall": "自由落瓶式",
"String": "繩索式",
"Biggest change on string": "繩索式變化最大的殘瓶",
"described": "次已描述",
"How your strikes carried, from the ones you described.": "根據你描述過的全倒，看看你的全倒是怎麼帶瓶的。",
"Numbers": "數值",
"Leaves": "殘瓶",
"Strikes": "全倒",
"Free Fall vs String": "自由落瓶式 vs 繩索式",
"Free fall vs string view": "自由落瓶式 vs 繩索式檢視",
"(prefers-reduced-motion: reduce)": "",
", not bowled": "，尚未投球",
"Tap any frame to edit": "點任一格即可編輯",
"All teams": "所有球隊",
"Session History": "打球紀錄",
"0 sessions": "0 次",
"Nothing saved yet. Finish a night with \"Save & Finish\" on its Results tab and it lands here.": "還沒有儲存任何紀錄。在當天的「結果」分頁儲存並結束這次打球，紀錄就會出現在這裡。",
"ten pins": "10 號瓶",
"% spares": "% 補中",
"splits": "次技術球",
"More": "筆",
"avg": "平均",
"How It Went 🎳": "今天打得如何 🎳",
"pins between": "瓶，共",
"pins first to last": "瓶（第一名與最後一名的差距）",
"Practice Recap": "練習回顧",
"Best": "最佳",
"Spread": "分數落差",
"vs Avg": "與平均比",
"Bowling With": "一起打的球友",
"Compared on average — you didn't all bowl the same number of games.": "以平均比較——大家打的局數不一樣。",
"Drill Recap": "練習項目回顧",
"· may move": "· 可能變動",
"Head To Head": "一對一",
"You —": "你 —",
", may move": "，可能變動",
"attempts": "次",
"Not enough attempts on one side to call a difference.": "有一方的次數太少，還看不出差異。",
"They also worked (nothing of yours to compare against):": "對方也練了這些（你沒有可比較的紀錄）：",
"Share this": "分享",
"Share the night": "分享今天的成績",
"End Open Bowling": "結束自由打",
"Share this practice": "分享這次練習",
"Change tonight's setup": "變更今天的設定",
"Tonight's setup": "今天的設定",
"Collapse": "收合",
"Bowling today?": "今天要打球嗎？",
"Change either answer, then tap Done.": "兩個答案都可以更改，改好後點「完成」。",
"Two quick questions and the app sets itself up for tonight.": "回答兩個簡單問題，App 就會為今天的打球做好設定。",
"You can change this any time.": "隨時都可以更改。",
"How much detail?": "要記錄多詳細？",
"Tester mode on — Diagnostics is now in Settings.": "測試人員模式已開啟——「設定」裡現在會出現「診斷資訊」。",
"Tester mode off.": "測試人員模式已關閉。",
"turn off": "關閉",
"turn on": "開啟",
"Other bowlers have a “": "其他球友也有名為「",
"” too": "」的聯賽",
"If it's the same league, combine yours with it. Your games and teams move across, and you'll see each other's teams.": "如果是同一個聯賽，就把你的聯賽和它合併。你的每局分數和球隊會一起移過去，你們也能看到彼此的球隊。",
"No bowling center set": "未設定保齡球館",
"· you're already in it": "· 你已參加",
"Combine": "合併",
"” is already here": "」已有人建立",
"Is one of these your league? Joining it puts you in the same league as the bowlers already there, so you can find their teams and they can find yours.": "這裡面有你的聯賽嗎？參加後，你會和已在其中的球友同屬一個聯賽，彼此都能找到對方的球隊。",
"None of these — create mine": "都不是——建立我的聯賽",
"Unlock My Bowling Journey Pro": "解鎖 My Bowling Journey Pro",
"Unlimited leagues, full stats, and more.": "聯賽數量不限、完整統計等更多功能。",
"Manage subscription": "管理訂閱",
"See Pro": "查看 Pro",
"Sessions": "依日期",
"Season": "賽季",
"Calendar": "行事曆",
"Journal": "日誌",
"Shared": "已分享",
"Copied to clipboard": "已複製到剪貼簿",
"High Game": "單局最高分",
"High Series": "系列最高分",
"200+ Games": "200+ 局",
"Net": "淨輸贏",
"Share Summary": "分享摘要",
"No sessions yet for this bowler and league.": "這位球友在這個聯賽還沒有紀錄。",
"Walkthroughs": "使用導覽",
"Watch any of these again, any time.": "隨時都能再看一次。",
"Watch": "觀看",
"App appearance": "外觀主題",
"Each one takes its colour from a different part of the house. Dark ones for a dim centre, light ones for a bright room or daytime.": "每個主題的顏色都取自保齡球館的不同角落。深色適合燈光昏暗的球館，淺色適合明亮的室內或白天。",
"Dark": "深色",
"Light": "打薄",
"Add a league": "新增聯賽",
"Add a league, rename one, set its center and season dates, or hide one you're not bowling any more.": "新增聯賽、重新命名、設定球館和賽季日期，或隱藏你不再參加的聯賽。",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet.": "新增你參加的聯賽，就能馬上開始輸入分數。現在還不需要球隊。",
"More leagues": "更多聯賽",
"The free plan covers one league. Bowling a second one — a summer league, or Tuesday and Thursday — is part of the paid plan. Nothing you have already logged goes anywhere.": "免費方案包含 1 個聯賽。要打第二個聯賽——例如夏季聯賽，或週二、週四各一個——需要付費方案。你已記錄的資料都不會消失。",
"League name, e.g. Tuesday Night Mixed": "聯賽名稱，例如：週二混合聯賽",
"Rename": "重新命名",
"Date range (optional)": "日期範圍（選填）",
"Season dates": "賽季日期",
"Nine on the first ball counts as a strike. Those are kept separate from your regular strike percentage, but still count toward how your ball carries.": "第一球擊倒 9 瓶就算全倒。這些全倒會和你一般的全倒率分開計算，但仍會計入球的帶瓶表現。",
"Usual lane condition": "平常的球道狀況",
"Used for any night you don't record a pattern for. Leave the name blank if this league rotates.": "沒有記錄油型的那幾次都會套用這個油型。如果這個聯賽的油型會輪換，名稱請留白。",
"Hidden — show again": "已隱藏——重新顯示",
"Hide this league": "隱藏這個聯賽",
"Won't appear when logging. Past scores still count toward your averages.": "記錄時不會出現。過去的分數仍會計入你的平均。",
"Add weekly reminder": "新增每週提醒",
"team": "支球隊",
"in this league": "參加這個聯賽",
"· yours": "· 你的球隊",
"Asked": "已申請",
"Ask to join": "申請加入",
"Leave team": "退出球隊",
"More teams": "更多球隊",
"The free plan covers one team. Your scores keep counting for the team you are already on.": "免費方案只能加入一支球隊。你的分數會繼續計入目前所屬的球隊。",
"Add a team": "新增球隊",
"Your scores in this league will join it — including nights you have already logged.": "你在這個聯賽的分數會併入這支球隊——包括你已經記錄過的那幾次。",
"Add a team to this league": "為這個聯賽新增球隊",
"Leagues": "聯賽",
"Shown": "顯示",
"Hidden": "隱藏",
"Poker, 3-6-9, and High Game Pot tracking cards on the Log and Data tabs.": "在「打球」和「統計」分頁顯示撲克、3-6-9 和單局最高分彩池的記錄卡。",
"Which pots does your house run?": "你常去的保齡球館有哪些彩池？",
"Export": "匯出",
"Your data, as spreadsheets. Sessions is one row per night; shots is one row per delivery.": "把你的資料匯出成試算表。「打球紀錄 CSV」每次打球一列；「投球紀錄 CSV」每次投球一列。",
"Sessions CSV": "打球紀錄 CSV",
"Shots CSV": "投球紀錄 CSV",
"Import scores": "匯入分數",
"Backup & Restore": "備份與還原",
"No data yet": "還沒有資料",
"Save a copy of everything — shots, sessions, bowlers, arsenals, and match results — so your season is safe no matter what. If you ever open this app and your history looks empty, restore it here.": "把所有資料——投球、打球紀錄、球友、球具庫和對戰結果——都存一份副本，不管發生什麼事，你的賽季紀錄都很安全。如果哪天打開 App 發現紀錄是空的，就在這裡還原。",
"Open Backup & Restore": "開啟「備份與還原」",
"Backup downloaded.": "已下載備份。",
"Download Backup": "下載備份",
"If the download doesn't work in this environment, copy the text below instead and save it somewhere safe.": "如果在這個環境中無法下載，請改為複製下方的文字，存放在安全的地方。",
"To restore, paste a backup below and tap Restore. This adds anything missing — it won't erase what's already here.": "要還原的話，請在下方貼上備份，再點「還原這份備份」。這只會新增缺少的資料，不會清除現有的內容。",
"Paste backup JSON here…": "在這裡貼上備份 JSON…",
"Restore This Backup": "還原這份備份",
"Refresh from the Cloud": "從雲端重新整理",
"Use this if something you know you bowled is missing here": "如果你確定打過的紀錄在這裡找不到，就用這個功能",
"— a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "——例如某次打球一直沒出現、在另一支手機上輸入的分數，或是明明一直在打，統計卻不再變動。",
"To open fast, this app normally downloads only what has changed since it last checked. Once in a while a phone can lose its place and stop asking for something — usually after bowling somewhere with no signal, or when the same account is used on two devices. Your shots are safe in the cloud the whole time; this phone just is not asking for them.": "為了快速開啟，這個 App 平常只會下載上次檢查後有變動的內容。偶爾手機會搞不清楚上次下載到哪裡，而不再要求某些資料——通常是在沒有訊號的地方打球之後，或同一個帳號在兩台裝置上使用時。你的投球資料一直安全地存在雲端，只是這支手機沒有去要而已。",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app.": "這會先把還在等待儲存的內容送出，接著從頭重新下載你的完整紀錄，並重新載入 App。",
"Nothing is deleted": "不會刪除任何資料",
", and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": "，你記錄過的內容也不會遺失。這會比平常開啟時消耗更多網路流量，賽季較長時也可能需要一點時間，建議連上 Wi-Fi 再使用。",
"change": "項變更",
"still waiting to save.": "還在等待儲存。",
"It": "這項變更",
"will be sent first.": "會優先送出。",
"Refreshing…": "重新整理中…",
"Account": "帳號",
"Signed in": "已登入",
"Signed in as": "登入身分：",
"this device": "這台裝置",
"Sign out of this account?": "要登出這個帳號嗎？",
"Could not sign out. Check your connection and try again.": "無法登出。請檢查網路連線後再試一次。",
"Sign out": "登出",
"About & Legal": "關於與法律資訊",
"Privacy Policy": "隱私權政策",
"Terms of Service": "服務條款",
"Delete your account": "刪除帳號",
"Questions, or want your data deleted?": "有問題，或想刪除你的資料嗎？請寫信到",
"support@mybowlingjourney.com": "support@mybowlingjourney.com",
"is published by My Bowling Journey LLC.": "由 My Bowling Journey LLC 發行。",
"Web version": "網頁版",
"Diagnostics": "診斷資訊",
"Nothing logged": "沒有任何紀錄",
"What went wrong on this phone, and why — failed saves, sync errors, imports that fell back. Copy it and paste it to whoever asked.": "這支手機上出了什麼問題、原因是什麼——儲存失敗、同步錯誤、改用備用方式完成的匯入。複製後貼給向你要這份資料的人。",
"Copied": "已複製",
"Couldn't copy on this device": "這個裝置無法複製",
"Copy log": "複製紀錄",
"Tester mode. Tap the \"published by\" line in About & Legal seven times to turn it off.": "測試人員模式。要關閉的話，請在「關於與法律資訊」中點按標示發行者的那一行 7 次。",
"Danger Zone": "危險區域",
"Clear All Data": "清除所有資料",
"Removes your bowling history including your shots, match results and lane notes. Your account, profile, arsenal and teams are unaffected.": "刪除你的保齡球紀錄，包括每一球、對戰結果和球道筆記。你的帳號、個人檔案、球具庫和球隊不受影響。",
"This deletes every logged shot, session, match result (opponents, handicaps, win/loss), and lane condition note. This can't be undone. Consider downloading a backup above first.": "這會刪除所有已記錄的每一球、每次打球、對戰結果（對手、讓分、勝負）和球道狀況筆記。此動作無法復原。建議先在上方下載備份。",
"Yes, Delete Everything": "是，全部刪除",
"Delete My Account": "刪除帳號",
"Removes your account and everything in it, permanently.": "永久刪除你的帳號和其中的所有資料。",
"This deletes your account and": "這會刪除你的帳號和",
"everything attached to it": "與帳號相關的所有資料",
"— every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "——包括每一球和每次打球、你的個人檔案和名字、球具庫、目標，以及你在任何球隊中的位置。你將無法再登入，我們也無法復原。",
"Leagues and teams you created are kept only if other bowlers are still using them, so nobody loses a league they're bowling in. Any that nobody else is in go with everything else.": "你建立的聯賽和球隊，只有在還有其他球友使用時才會保留，這樣就不會有人失去正在打的聯賽。沒有其他人在內的聯賽和球隊，會跟其他資料一起刪除。",
"Want a copy first? Use": "想先留一份副本嗎？動手前，請先使用上方的",
"above before you do this.": "。",
"to confirm": "以確認",
"Couldn't delete the account.": "無法刪除帳號。",
"Deleting…": "刪除中…",
"Permanently Delete": "永久刪除",
"Test account — everything unlocked": "測試帳號——已解鎖所有功能",
"Ending — you keep Pro until the period you paid for runs out": "即將結束——在已付費的期間結束前，你仍可使用 Pro",
"There's a problem with your payment method": "你的付款方式有問題",
"You're subscribed": "已訂閱",
"Share": "分享",
"Trend": "趨勢",
"Preparing…": "準備中…",
"Copied — paste it anywhere": "已複製——可貼到任何地方",
"Couldn't share on this device": "這個裝置無法分享",
"Share card": "分享卡片",
"Press and hold the card to save or share it.": "長按卡片即可儲存或分享。",
"Copy text": "複製文字",
"Wrong email or password.": "電子郵件或密碼錯誤。",
"Couldn't sign in.": "無法登入。",
"Couldn't send the code. Try again.": "無法傳送驗證碼，請再試一次。",
"That code didn't work. Check it, or send a new one.": "這組驗證碼無效。請再確認一次，或重新傳送一組。",
"Couldn't verify that code.": "無法驗證這組驗證碼。",
"Sign in to log your own games and see the team's stats.": "登入後就能記錄自己的每一局，並查看球隊統計。",
"Email": "電子郵件",
"Password": "密碼",
"Signing in…": "登入中…",
"Sign In": "登入",
"Check your email": "請查收電子郵件",
"We sent a": "我們已將",
"-digit code to": "位數驗證碼寄到",
"The same email has a sign-in link in it, if you'd rather tap that.": "同一封電子郵件裡也有登入連結，想直接點連結也可以。",
"The code lasts an hour.": "驗證碼一小時內有效。",
"Use a different email": "改用其他電子郵件",
"Opening Google…": "正在開啟 Google…",
"Continue with Google": "使用 Google 繼續",
"or": "或",
"Sending…": "傳送中…",
"Email Me a Code": "用電子郵件寄驗證碼給我",
"No password needed — we'll email you a code.": "不需要密碼——我們會用電子郵件寄驗證碼給你。",
"Knockdown": "擊倒瓶數",
"Pick a league above": "請在上方選擇聯賽",
"Nothing to count yet": "還沒有可統計的資料",
"Log a few frames and this fills in — strike rate, spares, ten pins, and how each ball is carrying.": "記錄幾格之後，這裡就會出現資料——全倒率、補中、10 號瓶，以及每顆球的帶瓶表現。",
"Viewing": "檢視對象",
"(you)": "（你）",
"Teams": "球隊",
"Compare To": "比較對象",
"Nobody to compare against yet. Add a friend, or set up your team — teammates are added as friends automatically.": "還沒有可以比較的對象。新增好友，或設定你的球隊——隊友會自動加為好友。",
"Manage friends": "管理好友",
"Add a friend": "新增好友",
"Clean Frame %": "無失誤格率",
"Split Rate": "技術球率",
"10-Pin Spare %": "10 號瓶補中率",
"Single-Pin Spare %": "單瓶補中率",
"First-Ball Avg": "第一球平均",
"Leave Avg": "未全倒第一球平均",
"Head-to-Head": "一對一",
"Every rate stat side by side against": "並排比較每項比率統計，對象：",
", instead of hunting through separate cards. Split Rate is the one metric here where lower is better.": "，不用在各張卡片之間翻找。技術球率是這裡唯一越低越好的指標。",
"Team Records": "球隊紀錄",
"to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.": "即可查看——單局和系列最高分需要一份明確的隊員名單，因為把人數不同的球隊合在一起，會對人數較多的一方不公平。",
"Season record": "賽季戰績",
"points won": "獲得積分",
"points (": "積分（以局計",
"games,": "，以擊倒瓶數計",
"pinfall)": "）",
"Weekly Points": "每週積分",
"Points won each week, out of 4 — Season Record only shows the running total, never when those points actually came. Shows momentum: a hot streak or a slump.": "每週獲得的積分（滿分 4 分）——「賽季戰績」只顯示累計總數，看不出這些積分實際是什麼時候拿到的。這裡看得出氣勢：是手感正熱，還是陷入低潮。",
"Points won": "獲得積分",
"Handicap Impact": "讓分影響",
"to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.": "即可查看——「球隊」必須指一份明確的隊員名單，而不是把好幾個聯賽的比賽混在一起。",
"Points-won rate split by handicap size — shows whether the team does better closer to scratch or with a bigger handicap cushion.": "依讓分多寡區分的積分獲得率——看看球隊是在接近不讓分時打得比較好，還是在讓分緩衝較大時比較好。",
"Points won %": "積分獲得率",
"Team Leaderboard": "球隊排行榜",
"% stk": "% 全倒",
"Giant Killer": "以小搏大",
"to see this — it needs a specific roster to know who's on top.": "即可查看——需要一份明確的隊員名單，才知道誰領先。",
"No comparisons yet — the first week just sets the baseline average for everyone. Once a second week is logged, that week's giant (whoever had the best average entering it) gets challenged and this fills in.": "還沒有比較結果——第一週只是替所有人訂出基準平均。記錄第二週之後，當週的巨人（進入該週時平均最高的人）就會接受挑戰，這裡也會開始有內容。",
"% of games each bowler beat that week's reigning giant, game-by-game — the giant is whoever had the highest average entering that week, based only on weeks before it (never that week's own results). The very first week ever logged sets the baseline with no giant to challenge yet; the hunt starts week two. Locked in per week — if the title changes hands later, earlier weeks stay compared against whoever actually held it at the time. \"Weeks on top\" counts how many weeks they themselves held the title.": "每位球友逐局擊敗當週衛冕巨人的局數比例——巨人是進入該週時平均最高的人，只根據之前幾週計算（絕不採用該週本身的成績）。有史以來記錄的第一週只訂出基準，還沒有巨人可以挑戰；獵巨人從第二週開始。結果每週固定下來——就算之後頭銜易主，先前各週仍維持和當時實際持有頭銜的人比較。「週居首」是他們自己持有頭銜的週數。",
"wk": "週",
"on top": "居首",
"games": "局",
"🎣 Hung": "🎣 被晾著",
"to see this — it needs a specific roster to know who else was bowling that frame.": "即可查看——需要一份明確的隊員名單，才知道那一格還有誰在打。",
"Nobody's been hung yet — every strike in this data has had at least one teammate join in, or company on the miss.": "還沒有人被晾著——這些資料裡的每次全倒，都至少有一位隊友跟著全倒，要不然就是有人陪著一起沒打到。",
"Every teammate struck that frame except them. The wall of shame.": "那一格隊友全都全倒，就只有這位球友沒有。丟臉排行榜。",
"Team Series": "球隊系列總分",
"Team Total": "球隊總分",
"Tu": "週二",
"Th": "週四",
"Clean frames": "無失誤格",
"of frames closed out": "的計分格沒有失誤",
"Frame Position": "各格表現",
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where": "依格數而不是依局數拆開來看——看看每次打球時，是否有某個固定時段（熱身、油況變化、第 9 格算分數分心的時候），",
"tends to leave pins, regardless of which game it is.": "特別容易留下殘瓶，不管是第幾局。",
"Weighted quality score, strict priority order: strike beats every spare, a non-split spare beats every split spare, and within each of those a leave with fewer pins standing scores higher — an open frame always scores lowest, ranked by total pinfall.": "加權品質分數，優先順序嚴格：全倒勝過任何補中，非技術球的補中勝過任何技術球的補中，而在各類之中，留下的球瓶越少分數越高——失誤格永遠最低，並依總擊倒瓶數排序。",
"⚠️ Only": "⚠️ 目前只記錄了",
"logged — each frame number needs at least": "——每一格至少要有",
"to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.": "局，才能分辨真正的模式和雜訊。在那之前，請把這當作預覽，而不是結論。",
"Weakest": "最弱",
"Strongest": "最強",
"Weakest:": "最弱：",
") · Strongest:": ") · 最強：",
"Every frame is even on this metric — no standout weak spot.": "這項指標上每一格都一樣——沒有特別弱的地方。",
"First-Ball Average": "第一球平均",
"Average pins on every fresh-rack delivery — every frame's first ball, plus any 10th-frame bonus ball thrown at a full reset rack — strikes counted as 10. The standard metric, comparable to LaneTalk and other scoring apps.": "每次面對滿瓶投球的平均擊倒瓶數——包括每一格的第一球，以及第 10 格在球瓶重新排滿後投出的加球——全倒算 10 瓶。這是標準指標，可以和 LaneTalk 等其他計分 App 比較。",
"pins per fresh rack": "每次滿瓶投球的擊倒瓶數",
"vs": "vs",
"Leave Average": "未全倒時的第一球平均",
"Same fresh-rack deliveries, but only the ones that weren't a strike — isolates how good the leave is on a miss, separate from strike rate.": "同樣是滿瓶投球，但只看沒有全倒的那些——撇開全倒率，單獨看出沒全倒時留下的殘瓶好不好補。",
"pins when you don't strike": "沒全倒時的擊倒瓶數",
"Ten pins": "10 號瓶",
"of your ten pins converted": "的 10 號瓶有補中",
"Ten-pin leave rate": "10 號瓶殘留率",
"Single pin spares": "單瓶補中",
"of splits converted": "的技術球被補掉",
"Split rate": "技術球率",
"✋ Hand Up": "✋ 舉手",
"to see who owes a round.": "，就能看到誰該請大家喝一輪。",
"Nobody's missed a lone 5 yet. Hands stay down.": "還沒有人漏補單獨的 5 號瓶。大家的手都還放著。",
"Lone 5-pins missed. Each one owes a drink to everyone with a hand up.": "單獨剩下 5 號瓶卻沒補中的次數。每漏一次，就要請每位舉手的人喝一杯。",
"Bowler": "球友",
"5s missed": "漏補 5 號瓶",
"Non-Split Leaves": "非技術球殘瓶",
"Every recurring leave that isn't a split — how often it happens and how often it gets converted.": "所有經常出現、但不是技術球的殘瓶——出現的頻率，以及補中的頻率。",
"Longest strike streak": "最長連續全倒",
"in a row": "連續",
"Consecutive strikes, carrying across games within the same night.": "連續全倒次數，同一天內的各局會接續計算。",
"By Ball": "依球",
"Miss Distribution": "偏差分布",
"Ball Change Triggers": "換球原因",
"Strike Quality": "全倒品質",
"Top number is the average bowler's score. \"Team\" below it is what the whole team scores together that game.": "上方數字是球隊每人平均分數。下方的「球隊」是全隊在該局的合計分數。",
"Combined spans all leagues, so there's no single team to compare it against — pick a specific bowler under \"Compare To\", or select a specific league above.": "綜合資料涵蓋所有聯賽，所以沒有單一球隊可以比較——請在「比較對象」選擇特定球友，或在上方選擇特定聯賽。",
"Theoretical Average": "理論平均",
"What the average would be if every makeable spare (not a split, not a washout) had been made — including a theoretical 10th-frame fill ball, estimated from each game's own recent first-ball average at that point.": "假設每個能補的殘瓶（不含技術球和 Washout）都補中時的平均——也包括理論上的第 10 格加球，依每局到當時為止的近期第一球平均來估算。",
"if you'd made every makeable spare": "如果每個能補的殘瓶都補中",
"This Season vs Last": "本賽季 vs 上賽季",
"Level": "持平",
"Progress to Next Milestone": "距離下一個里程碑的進度",
"Tracked in 5-pin steps": "以每 5 分為一級追蹤",
"— the team's average bowler": "（以球隊每人平均計算）",
"% to": "%，目標",
"Next Session (": "下次打球（",
"Games)": "局）",
"You're averaging": "目前平均",
"across": "，共",
"games. Here's what the next set does to it.": "局。以下是下一個系列對平均的影響。",
"Gaining a full point isn't reachable in one set at this average.": "以目前的平均，打一個系列無法讓平均整整提高 1 分。",
"No set this session can drop the average a full point.": "這次打球不管系列打幾分，平均都不會整整下降 1 分。",
"Score Consistency": "分數穩定度",
"How steady their game scores are night to night, independent of the average itself. Lower is steadier.": "每次打球的單局分數有多穩定，與平均本身無關。數值越低越穩定。",
"How steady the team's combined game totals are night to night — not each bowler's individual scores. Lower is steadier.": "球隊每局合計分數在每次打球之間有多穩定——不是每位球友的個人分數。數值越低越穩定。",
"pins either side of your average": "分，平均上下的浮動幅度",
"team games": "局（球隊合計）",
"Score Distribution": "分數分布",
"The actual shape behind the std. dev. above — tightly bunched around the average, or a long tail of bad nights dragging it down.": "上方標準差背後的實際分布——是緊密集中在平均附近，還是有一長串失常的幾次把平均往下拉。",
"Game-by-Game Averages": "各局平均",
"Composite average at each position in the night, across the whole season — shows whether": "整個賽季中，依當天第幾局計算的綜合平均——看出",
"the team is": "球隊",
"bowling better early, middle, or late.": "在前段、中段還是後段打得比較好。",
"\"Team\" is what the whole team scores together at that position.": "「球隊」是全隊在該局的合計分數。",
"Team:": "球隊：",
"Poker": "撲克",
"High Game Pot": "單局最高分彩池",
"Team Side Games": "球隊場邊彩池",
"Season totals across every side game — what came in, what it cost to play, and what actually stuck.": "所有場邊彩池的賽季合計——贏了多少、花了多少報名費，以及實際留下多少。",
"won this season": "本賽季贏得",
"By Game": "項目",
"Buy-in": "報名費",
"Won": "贏得的獎金",
"3-6-9 Tracker": "3-6-9 追蹤",
"Strike frames 3, 6, and 9 of every game (games 1, 2, and 3 -- all 9 strikes) to win the pot for the night. Also throw a full turkey in game 3's 10th frame to additionally earn the jackpot.": "在每一局的第 3、6、9 格都打出全倒（第 1、2、3 局，共 9 個全倒），就能贏得當天的彩池。如果第 3 局的第 10 格再打出完整的火雞，還能另外拿下累積彩池。",
"won on 3-6-9": "3-6-9 贏得的獎金",
"By Bowling Center": "依保齡球館",
"How you score house to house. Only leagues with a center set are included — set them under Team.": "你在各家保齡球館的分數表現。只包含已設定球館的聯賽——請在「球隊」中設定。",
"Comparison": "比較",
"Comparing two things — bowlers, balls, houses, patterns or seasons — is part of the paid plan. Everything about your own game stays free.": "比較兩個對象——球友、球、球館、油型或賽季——屬於付費方案功能。和你自己打球有關的一切都維持免費。",
"this card": "這張卡片",
"Not yet": "還沒有",
"Unhide Stat Cards (": "顯示隱藏的統計卡（",
"Something went wrong.": "發生錯誤。",
"You're on Pro": "你正在使用 Pro",
"Thanks for subscribing. Everything is unlocked.": "感謝你的訂閱，所有功能都已解鎖。",
"Manage or cancel any time in the Play Store app, under Subscriptions.": "你隨時可以在 Play 商店應用程式的「訂閱項目」中管理或取消訂閱。",
"Your subscription is ending": "你的訂閱即將結束",
"You are subscribed": "你已訂閱",
"when the period you paid for runs out": "在你已付費的期間結束時",
"Everything is unlocked.": "所有功能都已解鎖。",
"Manage or cancel your subscription in the Play Store app, under Subscriptions.": "你可以在 Play 商店應用程式的「訂閱項目」中管理或取消訂閱。",
"Opening…": "開啟中…",
"Resume subscription": "恢復訂閱",
"Test account.": "測試帳號。",
"Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "無論付款狀態如何，所有功能都已為你解鎖。你仍然可以在下方購買，測試結帳流程。",
"Your scores, spares and ball numbers stay free, always. Pro is for the comparisons — and for the parts that think about your night for you.": "你的分數、補中和每顆球的統計永遠免費。Pro 是為了比較功能——以及那些會替你分析今天打球狀況的功能。",
"Every league and team you bowl in": "你參加的所有聯賽和球隊",
"(free keeps": "（免費方案可保留",
"Ball against ball, house against house, pattern against pattern": "球與球、球館與球館、油型與油型的比較",
"Head to head with friends and teammates": "和好友、隊友一對一比較",
"This season against last": "本賽季與上賽季比較",
"Nightcap, Insights, Brooklyn and coaching": "Nightcap、分析、Brooklyn 和指導",
"Scorecard import": "匯入計分表",
"Choose a plan": "選擇方案",
"Yearly ·": "年繳 ·",
"Monthly ·": "月繳 ·",
"Your": "你的",
"-day free trial starts today. When it ends, the": "天免費試用今天開始。結束後，",
"plan starts at": "方案開始計費，價格為",
"and renews on its own until you cancel.": "，之後會自動續訂，直到你取消為止。",
"The": "你選的",
"plan is": "方案的價格為",
". Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": "。Google Play 會在你確認前顯示免費試用是否適用於你的帳號，之後會自動續訂，直到你取消為止。",
"You have already had the free trial, so the": "你已經用過免費試用，因此",
"plan starts today at": "方案今天開始，費用為",
"Cancel any time": "隨時都可以取消：",
"in the Play Store app under Subscriptions": "在 Play 商店應用程式的「訂閱項目」中操作",
"from the link in your receipt": "透過收據裡的連結操作",
"— you keep Pro until the end of the period you have paid for.": "——在你已付費的期間結束前，都能繼續使用 Pro。",
"If you stop, nothing you have logged is deleted. One league stays active and the rest are paused until you come back.": "即使停止訂閱，你記錄的資料也都不會被刪除。會保留一個聯賽繼續使用，其他聯賽則暫停，直到你回來。",
"Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.": "",
"Create a .env file at the project root — see supabaseClient.js for the format.": "",
"(no match)": "",
"Tuesday House Shot": "週二館內油型",
"Thursday House Shot": "週四館內油型",
"Too many tries. Wait a little and try again.": "嘗試次數太多。請稍候再試一次。",
"Couldn't join just now. Check your connection and try again.": "目前無法加入。請檢查網路連線後再試一次。",
"That code didn't match a team. Check it with whoever sent it.": "這個代碼找不到對應的球隊。請向傳給你的人確認。",
"Couldn't do that just now. It may already have been answered — pull down to refresh.": "目前無法完成。可能已經有人回覆了——請下拉重新整理。",
"Couldn't send that just now. Check your connection and try again.": "目前無法傳送。請檢查網路連線後再試一次。",
"Make a new code? The old one stops working, so anyone you sent it to will need the new one.": "要產生新代碼嗎？舊代碼會失效，所以你傳過代碼的人都需要新的代碼。",
"There's already a pending invite for that email on this team.": "這支球隊已經有一筆寄給這個電子郵件、尚待回覆的邀請。",
"Add an email, or tick “I don’t have their email” to get a code you can text them. Either way they need a way to claim this spot themselves.": "請輸入電子郵件，或勾選「用簡訊傳代碼」取得可以傳給對方的代碼。無論哪種方式，對方都需要能自己認領這個位置。",
"That doesn't look like an email address.": "這看起來不像電子郵件地址。",
"Loading teams…": "正在載入球隊…",
"Couldn't load your teams. You may be offline.": "無法載入你的球隊。你可能已離線。",
"Waiting to join your team": "等待加入你的球隊",
"wants to join": "申請加入",
"+ Add team": "+ 新增球隊",
"A team belongs to a league. Add your league on the League tab first, then come back here.": "球隊隸屬於聯賽。請先在「聯賽」分頁新增你的聯賽，再回到這裡。",
"OK": "確定",
"New team": "新球隊",
"Pick the league this team bowls in": "選擇這支球隊參加的聯賽",
"Team name": "球隊名稱",
"e.g. Split Happens": "例如：Split Happens",
"Create team": "建立球隊",
"Join a team": "加入球隊",
"You're invited to": "你受邀加入",
"Got a team code from a teammate? Enter it here.": "隊友給了你球隊代碼嗎？請在這裡輸入。",
"ABCD-1234": "ABCD-1234",
"No code? Find your team in your league and ask to join. Anyone on the team can approve you.": "沒有代碼？在你的聯賽裡找到你的球隊並申請加入。球隊裡任何人都可以核准你。",
"Pick a league": "選擇聯賽",
"Looking…": "搜尋中…",
"No teams in this league yet. You can make one with Add team.": "這個聯賽還沒有球隊。你可以用「+ 新增球隊」建立一支。",
"Your team": "你的球隊",
"Asked to join": "已申請加入",
"— waiting for someone on the team to approve.": "——等待球隊成員核准。",
"Withdraw": "撤回",
"No teams yet. Tap Add team, or add one under a league on the League tab.": "還沒有球隊。點「+ 新增球隊」，或在「聯賽」分頁的聯賽底下新增。",
"Team Name": "球隊名稱",
"Team code — text it to teammates so they can join": "球隊代碼——用簡訊傳給隊友，他們就能加入",
"Copy": "複製",
"Make a new code; the old one stops working": "產生新代碼；舊代碼會失效",
"New": "換新",
"Roster / Bowling Order": "隊員名單 / 出場順序",
"Just you so far — add teammates below, or leave it and come back to it. Your scores count either way.": "目前只有你——可以在下方新增隊友，或先略過、之後再回來設定。不論如何，你的分數都會計入。",
"Bowling hand — tap to switch": "投球用手——點一下切換",
"Sub — tap to toggle": "替補——點一下切換",
"Sub ✓": "替補 ✓",
"Sub": "替補",
"invited · not signed in yet": "已邀請 · 尚未登入",
"placeholder · no email on file": "預留位置 · 尚無電子郵件",
"— invited, waiting for them to accept": "——已邀請，等待對方接受",
"Add Someone Not Signed Up Yet": "新增尚未註冊的人",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with their email, they're linked the moment they sign in with that exact address; with a code, you get one to text them and they enter it when they sign up.": "現在就在隊員名單上保留他的位置——即使他還沒有帳號，你也能馬上透過「記錄對象」用他的名字記錄分數。無論哪種方式，都由他本人認領這個位置，而你記錄的所有內容都已經在那裡：用電子郵件的話，他用這個地址登入的那一刻就會連結；用代碼的話，你會拿到一組代碼，用簡訊傳給他，他註冊時輸入即可。",
"Their name": "對方的名字",
"I have their email": "我有對方的電子郵件",
"Text them a code": "用簡訊傳代碼",
"Their email": "對方的電子郵件",
"They will get a code to enter when they sign up. It links them to this spot the same way an email invite does.": "對方註冊時會輸入一組代碼。這組代碼會把對方連結到這個位置，效果和電子郵件邀請一樣。",
"Add to Roster": "加到隊員名單",
"Skip": "略過",
"Start bowling": "開始打球",
"Next": "下一步",
"Your history:": "你的紀錄：",
"avg over": "平均，共",
"Low": "最低",
"Untitled": "未命名",
"no date": "無日期",
"· made cut": "· 晉級",
"· missed cut": "· 未晉級",
"Oil Pattern": "油型",
"e.g. Krypton, or type your own": "例如：Krypton，或自行輸入",
"+ Save \"": "+ 儲存「",
"\" for next time": "」供下次使用",
"Length, ratio, and volume are optional — fill in whatever you know.": "長度、比例和油量都可以不填——知道多少填多少。",
"Feet": "英尺",
"Ratio e.g. 3:1": "比例（例如：3:1）",
"Squad Details": "梯次資訊",
"Remove Day": "刪除這一天",
"Start Time": "開始時間",
"Squad": "梯次",
"e.g. A": "例如：A",
"Block #": "輪次編號",
"e.g. 2": "例如：2",
"Go to scoring": "前往輸入分數",
"Pins vs 200 avg": "相對平均 200 的分差",
"(all blocks so far)": "（目前所有輪次）",
"Go to": "前往",
"match play": "對戰賽",
"the stepladder": "階梯賽",
"This block": "這一輪",
"s frames are logged under": "的計分格記錄在",
", not": "，而不是",
"Move them to": "移到",
"+ Game": "+ 新增一局",
"Tournaments usually move pairs after every game, so each game gets its own.": "比賽通常每打完一局就換一組球道，所以每一局都有自己的球道欄位。",
"Pair": "球道",
"Day Notes": "當日筆記",
"Transition, ball reaction, what worked…": "油況變化、球的反應、哪些打法有效……",
"Brackets & Side Pots": "對戰籤表和彩池",
"Tracked separately from the main entry, so you can see which of these actually pay for themselves.": "和主要報名費分開記錄，讓你看出其中哪些真的能回本。",
"Label (optional)": "名稱（選填）",
"Entries": "報名數",
"won in brackets": "對戰籤表贏得的獎金",
"The head-to-head block after the cut. Bonus pins vary by tournament — set them to whatever this event uses.": "晉級後的一對一對戰輪。獎勵分依比賽而異——請依這場比賽的規定設定。",
"Date bowled": "打球日期",
"Bonus per win": "每場勝利獎勵分",
"Bonus per tie": "每場和局獎勵分",
"Match": "場次",
"by": "相差",
"Track frames": "逐格記錄",
"Opp hcp": "對手讓分",
"+ Add Match": "+ 新增對戰",
"Go to the stepladder": "前往階梯賽",
"Sudden death, no bonus pins. Enter the seeds and the app works out where you finished.": "一局定勝負，沒有獎勵分。輸入種子順位，App 會算出你的最終名次。",
"e.g. 3": "例如：3",
"Step": "關卡",
"+ Add Step": "+ 新增一關",
"Steps": "關卡戰績",
"nothing further": "無",
"How it went": "比賽回顧",
"With handicap": "含讓分",
"Block": "輪次",
"average over": "平均，共",
"Bonus": "獎勵分",
"pins vs opponents": "分（與對手相比）",
"Best: match": "最大勝場：場次",
"Worst: match": "最大敗場：場次",
"On to": "下一階段：",
"Share this tournament": "分享這場比賽",
"is saved to your history. Bowling another block of it, or starting a new tournament?": "已儲存到你的紀錄。要再打這場比賽的另一輪，還是開始新的比賽？",
"Another block": "再打一輪",
"New tournament": "新比賽",
"e.g. Spring Masters": "例如：Spring Masters",
"e.g. Bowlero Pittsburgh": "例如：Bowlero Pittsburgh",
"Handicap per game": "每局讓分",
"e.g. 40": "例如：40",
"Bowling with": "搭檔",
"Partner's name": "搭檔姓名",
"Who bowls frame 1": "誰打第 1 格",
"You bowl frames": "你負責的格：",
"every game": "（每局）",
"in game 1, then you swap each game": "（第 1 局，之後每局輪換）",
". The score stays out of your average since you did not bowl it alone, but your own frames still count.": "。這局不是你獨自打的，所以分數不計入你的平均，但你自己打的格仍會列入統計。",
"Alternate who leads off each game": "每局輪換先打的人",
"+ Add Another Day or Block": "+ 新增另一天或另一輪",
"Cancel Tournament": "取消比賽",
"This deletes": "這會刪除",
"this tournament": "這場比賽",
"— every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "——包括為它輸入的每一輪、每一球、分數和對戰籤表——並回到首頁。此動作無法復原。",
"Brackets and side pots": "對戰籤表和彩池",
"Working out brackets and side pots as you go is part of the paid plan. Side games in league stay free.": "隨打隨算對戰籤表和彩池是付費方案的功能。聯賽中的場邊彩池仍然免費。",
"How did it finish?": "最後結果如何？",
"The stepladder says": "依階梯賽結果應為",
"Anything worth remembering about it?": "有什麼值得記下來的嗎？",
"Entry & Winnings": "報名費和獎金",
"The tournament payout only. Bracket and side pot winnings go on the Brackets tab.": "這裡只填比賽本身的獎金。對戰籤表和彩池的獎金請到「對戰籤表」分頁填寫。",
"Tournament buy in": "比賽報名費",
"Tournament winnings": "比賽獎金",
"Brackets buy in": "對戰籤表報名費",
"Brackets winnings": "對戰籤表獎金",
"net": "（淨輸贏）",
"Tournament Notes": "比賽筆記",
"Overall takeaways…": "整體心得…",
"✓ Tournament Saved": "✓ 比賽已儲存",
"Save & Finish Tournament": "儲存並結束比賽",
"Close this tournament and start a new one? It stays in your history.": "要關閉這場比賽並開始新的比賽嗎？它會保留在你的紀錄中。",
"Yes, close it": "是，關閉",
"Keep working on it": "繼續編輯",
"Close tournament": "關閉比賽",
"Side pot": "彩池",
"Money": "收支",
"Tournament Total": "比賽總分",
"All Days": "所有天數",
"scratch ·": "（不讓分）·",
"handicap pins": "（讓分）",
"← still standing": "← 還沒倒的球瓶",
"Pins standing": "剩下的球瓶",
"Spare made?": "補中了嗎？",
"← tap what fell": "← 點選倒下的球瓶",
"Average over the last 13 games": "最近 13 局的平均",
"Game 1": "第 1 局",
"Scores, or every ball": "只記分數，或記每一球",
"Arsenal · 3 balls": "球具庫 · 3 顆球",
"47% strikes · 54% spares": "全倒 47% · 補中 54%",
"15lb · RG 2.5 / Diff 0.05": "15 lb · RG 2.5 / Diff 0.05",
"45% strikes · 61% spares": "全倒 45% · 補中 61%",
"15lb · RG 2.57 / Diff 0.046": "15 lb · RG 2.57 / Diff 0.046",
"45% strikes · 67% spares": "全倒 45% · 補中 67%",
"15lb · RG 2.49 / Diff 0.05": "15 lb · RG 2.49 / Diff 0.05",
"Layouts, surface, specs": "鑽孔配置、表面處理、規格",
"Split Happens": "Split Happens",
"Tuesday House Shot · 4 bowlers": "週二館內油型 · 4 人",
"1. You": "1. 你",
"2. Rob": "2. Rob",
"3. Kim": "3. Kim",
"4. Dee": "4. Dee",
"A league first, a team later": "先有聯賽，再有球隊",
"Mine": "我的",
"Trends": "趨勢",
"Center": "球館",
"On the road since Jul 9": "自 7 月 9 日踏上旅程",
"First 700 series": "第一次 700 分系列",
"4 pins short · best 696": "還差 4 分 · 最佳 696",
"September": "9 月",
"10 Sep": "9 月 10 日",
"Lanes broke down early. Moved left 3 and it came back.": "油很早就被打散了。往左移 3 板就回來了。",
"Settings › Walkthroughs": "設定 › 使用導覽",
"Tonight's scores": "今天的分數",
"Game 2": "第 2 局",
"Game 3": "第 3 局",
"Three numbers and you're done": "輸入三個數字就完成",
"Frame 4 · Ball 1": "第 4 格 · 第一球",
"Other leave": "其他殘瓶",
"How it hit": "擊中方式",
"Flush": "正中 Pocket",
"Messenger": "飛瓶",
"Frame over — no pins to pick": "這一格已結束——沒有球瓶可選",
"Frame 5 · left standing": "第 5 格 · 殘瓶",
"Tap the pins, then answer": "先點選球瓶，再回答",
"Frame 6 · left standing": "第 6 格 · 殘瓶",
"None fell? Just save": "一瓶都沒倒？直接儲存",
"vs average": "與平均相比",
"Brackets": "對戰籤表",
"Standard": "標準",
"Baker": "Baker 賽制",
"Scratch": "不讓分",
"Format": "賽制",
"10 pin": "10 號瓶",
"9 pin no-tap": "9 瓶算全倒",
"Mix them however the event runs": "依比賽規則自由搭配",
"Qualifying": "資格賽",
"Match Play": "對戰賽",
"Stepladder": "階梯賽",
"Day 1": "第 1 天",
"Day 2": "第 2 天",
"Cut": "晉級線",
"1812 of 1750 across 8 games (all blocks so far).": "8 局累計 1812 分，晉級線 1750（目前為止所有輪次）。",
"Where you stand, updated every game": "你目前的位置，每局更新",
"Qualified for": "晉級至",
"Match play": "對戰賽",
"N/A": "無",
"Go to match play": "前往對戰賽",
"The margin already said you made it": "分差早就告訴你晉級了",
"Match 1": "第 1 場",
"WIN": "勝",
"by 23": "相差 23 分",
"Track frames (G1)": "逐格記錄（第 1 局）",
"Them": "對手",
"Game 1 again — qualifying doesn't follow you here": "又從第 1 局開始——資格賽的分數不會帶過來",
"Record": "戰績",
"Bonus pins": "獎勵分",
"Your seed": "你的種子順位",
"Step 2": "第 2 關",
"LOSS": "敗",
"by 11": "相差 11 分",
"Seed": "種子順位",
"2nd": "",
"Finished": "最終名次",
"Won one step, then out to the 2 seed.": "贏了 1 關，接著輸給第 2 種子。",
"Worked out from your seed — never asked": "依你的種子順位自動算出——不必另外輸入",
"8 games": "8 局",
"Every phase, and what it paid": "每個階段，以及各自的獎金",
"Choose file": "選擇檔案",
"What changed": "有什麼變化",
"Your Bionic is carrying 8% better than the Phaze II on this pattern — 61% against 53% over 94 first balls.": "在這個油型上，你的 Bionic 帶瓶率比 Phaze II 高 8%——在 94 次第一球中是 61% 對 53%。",
"10 pin conversion": "10 號瓶補中率",
"18 more": "還差 18 次",
"Six of your eight opens were single-pin leaves — the 10 alone cost you 27 pins. The Bionic carried everything in game three; it was the one you finished on.": "你 8 次失誤中有 6 次是單瓶殘瓶——光是 10 號瓶就讓你少了 27 分。第 3 局用 Bionic 的球全都有帶瓶，最後也是用它打完的。",
"Ryan's night": "Ryan 今天的成績",
"Her lamp, on every screen": "她的神燈，在每個畫面上",
"Brooklyn": "Brooklyn",
"2 wishes left today": "今天還剩 2 個願望",
"Which ball should I start on next week?": "下週我該先用哪顆球？",
"On a 37-foot pattern you've struck more with the Bionic every time out. Start there.": "在 37 ft 的油型上，你每次用 Bionic 打出的全倒都比較多。就從它開始吧。",
"Read this to the bowler": "把這組代碼唸給球友聽",
"7KPQ-2M4R": "7KPQ-2M4R",
"Works once, for the next 7 days": "只能使用一次，7 天內有效",
"Works once, on their phone": "只能在對方手機上使用一次",
"I": "我在",
"m bowling": "打球",
"m coaching": "指導",
"Dana Reyes": "Dana Reyes",
"Sam Ortiz": "Sam Ortiz",
"A dot means they answered something": "圓點代表這位球友有回覆",
"From 412 shots": "依據 412 球",
"18 Mar · Tuesday Classic": "3 月 18 日 · 週二經典聯賽",
"11 Mar · Tuesday Classic": "3 月 11 日 · 週二經典聯賽",
"How much data it": "旁邊會標出這是根據多少資料",
"s built on, beside it": "算出來的",
"New task": "新任務",
"Metric": "指標",
"Leave the target off if it isn": "目標不是數字的話",
"t a number": "，就留空",
"Open": "未完成",
"Clean up the single-pin spares": "把單瓶補中練穩",
"Target 60%": "目標 60%",
"due 1 Apr": "4 月 1 日到期",
"Reached 58% so far": "目前達到 58%",
"Mark done": "標為完成",
"Record attempt": "記錄嘗試",
"What came back, not just what was asked": "看得到回報的結果，不只是交代的內容",
"By ball · strike rate": "依球 · 全倒率",
"Bionic": "Bionic",
"Phaze II": "Phaze II",
"Zen Master": "Zen Master",
"You vs Split Happens": "你 vs Split Happens",
"Rob": "Rob",
"Team average": "球隊平均",
"Same measure, same scale": "同樣的指標，同樣的刻度",
"Ball · strike rate": "球 · 全倒率",
"61% · 94 shots": "61% · 94 球",
"47% · 8 more shots needed": "47% · 還需要 8 球",
"Questions it can answer": "它能回答的問題",
"Which ball carries best?": "哪顆球帶瓶最好？",
"Where is a spare leaking?": "哪種補中老是漏掉？",
"Do I fall off in game three?": "我是不是到第 3 局就掉分？",
"Jan": "1 月",
"Mar": "3 月",
"Last 90 days": "最近 90 天",
"Showing 13 of 40 games": "顯示 40 局中的 13 局",
"All balls": "全部的球",
"Only games and shots recorded with this ball. Games with no ball noted are left out.": "只顯示用這顆球記錄的局和投球。沒有記錄用球的局不列入。",
"across every league": "（所有聯賽）",
"averaging": "平均",
"· high": "· 最高",
", low": "、最低",
". The spread is": "。分數落差",
"pins — that's what a nightly average hides.": "分——這正是每次的平均看不出來的地方。",
"Show": "顯示範圍",
"Last": "最近",
"days": "天",
"This one needs frame tracking. You're on game tracking, so there's nothing to plot here yet.": "這項需要逐格記錄。你目前選的是只記分數，所以這裡還沒有可以畫的資料。",
"Need at least 2 nights logged before there's a line to draw.": "至少要記錄 2 次打球，才畫得出趨勢線。",
"Per game": "每局",
"Per night": "每次",
"Every game": "每一局",
"Share this trend": "分享這個趨勢",
"Nights here average": "這裡每次平均只有",
"attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.": "次嘗試，樣本偏少——即使你的打法完全沒變，個別的點也會大幅起伏。",
"Latest": "最新",
"Free trial —": "免費試用——",
"left": "",
"Your subscription starts when the trial ends.": "你的訂閱將在免費試用結束時開始。",
"Thanks for bowling with us": "謝謝你和我們一起打球",
"You are on the monthly plan. The yearly plan works out cheaper — switch any time.": "你目前使用月繳方案。年繳方案算下來更划算——隨時都能切換。",
"See the yearly plan": "查看年繳方案",
"'Archivo', system-ui, -apple-system, sans-serif": "",
"'Roboto Condensed', 'Archivo', system-ui, sans-serif": "",
"This": "這段內容",
"check it against what you saw on the lane": "請和你在球道上實際看到的情況對照一下",
"was": "是",
"by AI. It can be confidently wrong —": "AI 產生的內容，可能說得頭頭是道卻是錯的——",
"Other bowlers reported the shared specs for ⟨0⟩ as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "其他球友回報 ⟨0⟩ 的共享規格有誤，所以已經移除。球還在你這裡——有空時再重新輸入它的資料就好。",
"best ⟨0⟩": "最高 ⟨0⟩",
"Now: ⟨0⟩": "目前：⟨0⟩",
"Which pins did the second ball knock down? ⟨0⟩ this frame": "第二球打倒了哪幾支球瓶？這一格共 ⟨0⟩ 支",
"⟨0⟩ isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "⟨0⟩ 在 Baker 賽制的日子不開放——計分格屬於兩人搭檔，不屬於單一球友。",
"This league usually runs ⟨0⟩. Anything you set here is for tonight only.": "這個聯賽通常使用的油型是⟨0⟩。在這裡設定的內容只適用於今天。",
"This deletes tonight's shots, game scores and match points for ⟨0⟩ in ⟨1⟩, clears the setup, and takes you back to Home. This cannot be undone.": "這會刪除⟨0⟩在⟨1⟩今天的投球、各局分數和對戰積分，清除今天的設定，並回到首頁。此動作無法復原。",
"First ball: ⟨0⟩": "第一球：⟨0⟩",
"Second ball: ⟨0⟩": "第二球：⟨0⟩",
"Done⟨0⟩": "完成⟨0⟩",
"This deletes today's practice shots and game scores for ⟨0⟩ and takes you back to Home. This cannot be undone.": "這會刪除⟨0⟩今天的練習投球和各局分數，並回到首頁。此動作無法復原。",
"Where do you bowl? ⟨0⟩": "你在哪裡打球？⟨0⟩",
"⟨0⟩ — a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "⟨0⟩——例如某次打球一直沒出現、在另一支手機上輸入的分數，或是明明一直在打，統計卻不再變動。",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app. ⟨0⟩, and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": "這會先把還在等待儲存的內容送出，接著從頭重新下載你的完整紀錄，並重新載入 App。⟨0⟩，你記錄過的內容也不會遺失。這會比平常開啟時消耗更多網路流量，賽季較長時也可能需要一點時間，建議連上 Wi-Fi 再使用。",
"Questions, or want your data deleted? ⟨0⟩": "有問題，或想刪除你的資料嗎？請寫信到 ⟨0⟩",
"This deletes your account and ⟨0⟩ — every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "這會刪除你的帳號和⟨0⟩——包括每一球和每次打球、你的個人檔案和名字、球具庫、目標，以及你在任何球隊中的位置。你將無法再登入，我們也無法復原。",
"Want a copy first? Use ⟨0⟩ above before you do this.": "想先留一份副本嗎？動手前，請先使用上方的⟨0⟩。",
"Type ⟨0⟩ to confirm": "輸入 ⟨0⟩ 以確認",
"The same email has a sign-in link in it, if you'd rather tap that.⟨0⟩The code lasts an hour.": "同一封電子郵件裡也有登入連結，想直接點連結也可以。⟨0⟩驗證碼一小時內有效。",
"⟨0⟩or⟨1⟩": "⟨0⟩或⟨1⟩",
"⟨0⟩ Weakest": "⟨0⟩ 最弱",
"⟨0⟩ Strongest": "⟨0⟩ 最強",
"⟨0⟩ Everything else": "⟨0⟩ 其他",
"⟨0⟩ Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "⟨0⟩ 無論付款狀態如何，所有功能都已為你解鎖。你仍然可以在下方購買，測試結帳流程。",
"Every league and team you bowl in ⟨0⟩": "你參加的所有聯賽和球隊 ⟨0⟩",
"⟨0⟩ is saved to your history. Bowling another block of it, or starting a new tournament?": "⟨0⟩ 已儲存到你的紀錄。要再打這場比賽的另一輪，還是開始新的比賽？",
"⟨0⟩Alternate who leads off each game": "⟨0⟩每局輪換先打的人",
"This deletes ⟨0⟩ — every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "這會刪除 ⟨0⟩——包括為它輸入的每一輪、每一球、分數和對戰籤表——並回到首頁。此動作無法復原。",
"⟨0⟩Import": "⟨0⟩匯入",
"Match 1 ⟨0⟩⟨1⟩": "第 1 場 ⟨0⟩⟨1⟩",
"Step 2 ⟨0⟩⟨1⟩": "第 2 關 ⟨0⟩⟨1⟩",
"Which ball carries best?⟨0⟩Where is a spare leaking?⟨1⟩Do I fall off in game three?": "哪顆球帶瓶最好？⟨0⟩哪種補中老是漏掉？⟨1⟩我是不是到第 3 局就掉分？",
"up": "增加",
"down": "減少",
"they": "球隊",
"they're": "這位球友",
"year": "年",
"month": "月",
"yearly": "年繳",
"monthly": "月繳",
"frames": "格",
"nights": "次",
"now": "現在",
"mixed": "混合",
"unnamed": "未命名",
"(me)": "（我）",
"That was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "這是 AI 寫的。它可能說得頭頭是道卻是錯的——請和你在球道上看到的情況核對。",
"This scorecard was read by AI. It can be confidently wrong — check the numbers against the card before saving.": "這張計分表是 AI 讀取的。它可能說得頭頭是道卻是錯的——儲存前請把數字和計分表核對一遍。",
"This list was found by AI. It can be confidently wrong — check the name and address before you rely on it.": "這份清單是 AI 找到的。它可能說得頭頭是道卻是錯的——使用前請先確認名稱和地址。",
"⟨0⟩ wants to be your coach.": "⟨0⟩ 想以教練身分與你連結。",
"⟨0⟩ wants to be your bowler.": "⟨0⟩ 想以球友身分與你連結。",
"Automatic": "自動",
"Automatic · ⟨0⟩": "自動 · ⟨0⟩",
"Automatic follows your phone's language. Changing it restarts the app.": "「自動」會跟隨手機的語言設定。變更語言會重新啟動 App。",
"theme::Light": "淺色",
"theme::Dark": "深色",
"hit::High": "打厚",
"hit::Light": "打薄",
"hit::Brooklyn": "反邊",
"confidence::Clear": "明確",
"Analysis came back empty. Try again.": "分析結果是空的。請再試一次。",
"Analysis came back malformed. Try again.": "分析結果的格式有誤。請再試一次。",
"Couldn't generate insights right now.": "目前無法產生分析。",
"Insights aren't configured on the server.": "伺服器尚未設定分析功能。",
"Insights is part of the paid plan.": "分析屬於付費方案。",
"Not enough data yet to analyse.": "資料還不夠，無法分析。",
"You've used this quite a lot in the last hour. Give it a little while and try again.": "你在過去一小時內用了不少次。請稍等一下再試。",
"Ask me something.": "問我點什麼吧。",
"Brooklyn only answers on the paid plan.": "Brooklyn 只在付費方案中回答問題。",
"Sign in first.": "請先登入。",
"That's a lot. Try asking me one thing.": "一次問太多了。試著一次只問我一件事。",
"The lamp is cold. Try again later.": "神燈冷掉了。請稍後再試。",
"The lamp went quiet. Try again in a moment.": "神燈沒有動靜了。請稍後再試一次。",
"You've used all three today. The lamp recharges tomorrow.": "你今天三個願望都用完了。神燈明天會重新充能。",
"Subscriptions are not available yet.": "目前還無法訂閱。",
"That plan is not available right now.": "這個方案目前無法使用。",
"Too many attempts. Try again shortly.": "嘗試次數太多。請稍後再試。",
"You already have a subscription.": "你已經有訂閱了。",
"Could not open the subscription manager.": "無法開啟訂閱管理頁面。",
"No Stripe subscription found for this account.": "找不到這個帳號的 Stripe 訂閱。",
"Subscription management is not available yet.": "目前還無法管理訂閱。",
"Account deletion isn't configured on the server. Email support@mybowlingjourney.com and we'll do it by hand.": "伺服器尚未設定刪除帳號功能。請寄信到 support@mybowlingjourney.com，我們會手動幫你處理。",
"Account deletion isn't configured on the server.": "伺服器尚未設定刪除帳號功能。",
"Couldn't delete the account just then. Try again, or email support@mybowlingjourney.com.": "目前無法刪除帳號。請再試一次，或寄信到 support@mybowlingjourney.com。",
"Not authenticated.": "尚未登入。",
"Not authenticated": "尚未登入",
"A location is needed to search nearby centers.": "需要位置資訊才能搜尋附近的保齡球館。",
"Location search isn't configured on the server.": "伺服器尚未設定位置搜尋功能。",
"One of the images is too large. Try a smaller photo.": "其中一張圖片太大。請改用較小的照片。",
"One of the images was empty or malformed.": "其中一張圖片是空的或已損毀。",
"Scorecard import is part of the paid plan.": "計分表匯入屬於付費方案。",
"The import service can't check its limits right now. Try again shortly.": "匯入服務目前無法確認使用上限。請稍後再試。",
"The scorecard reader isn't available right now.": "計分表讀取功能目前無法使用。",
"Those images come to too much to send at once. Try fewer at a time.": "這些圖片加起來太大，無法一次傳送。請分批少傳幾張。",
"Too many images in one request (max 6)": "一次傳送的圖片太多（最多 6 張）",
"You've imported a lot in the last hour. Give it a little while and try again.": "你在過去一小時內匯入了很多次。請稍等一下再試。",
"No images provided": "沒有提供圖片",
"Nightcap isn't configured on the server.": "伺服器尚未設定 Nightcap。",
"Not enough logged tonight for a nightcap.": "今天記錄的內容還不夠調一杯 Nightcap。",
"That's a few nightcaps in one hour. Give it a little while and try again.": "一小時內已經喝了好幾杯 Nightcap。請稍等一下再試。",
"The Nightcap is part of the paid plan.": "Nightcap 屬於付費方案。",
"The nightcap came back empty. Tap to try again.": "這杯 Nightcap 是空的。點一下再試一次。",
"The nightcap came back malformed. Tap to try again.": "這次的 Nightcap 回傳格式無法讀取。點一下再試一次。",
"The nightcap came back thin. Tap to try again.": "這杯 Nightcap 太淡了。點一下再試一次。",
"The nightcap took too long. Tap to try again.": "這杯 Nightcap 調太久了。點一下再試一次。",
"Could not record that purchase.": "無法記錄這筆購買。",
"Could not verify that purchase.": "無法驗證這筆購買。",
"Purchases are not available yet.": "目前還無法購買。",
"That purchase could not be verified.": "這筆購買無法通過驗證。",
"My Groups": "我的群組",
"none here": "無投球",
"At a glance": "總覽",
"Spares": "補中",
"Language · Langue": "Language · Idioma · Langue · 言語 · 언어 · 語言",
"Français (Canada)": "Français (Canada)",
"English": "English",
"1 Apr": "4月1日",
"18 Mar 2026": "2026年3月18日",
"22 Mar": "3月22日",
"Tue": "週二",
"✓ High game": "✓ 單局最高分",
"✓ Quarter game": "✓ 25 美分局",
"✓ Dollar game": "✓ 1 美元局",
"✓ 3-6-9 (whole night)": "✓ 3-6-9（當天全程）",
"Free fall against string pins. Set the rack type on two centers — or on one mixed house, with its free-fall lanes.": "比較自由落瓶式和繩索式。請在兩間球館設定置瓶機類型——或在一間混合式球館設定它的自由落瓶式球道。",
"Right-handed, backup": "右手，反曲球",
"Left-handed, backup": "左手，反曲球",
"milestones": "里程碑",
"Spring Masters": "春季大師賽",
"Changing the language": "變更語言",
"Language · Langue in Settings. Automatic follows your phone's language, or pick Français (Canada) or English. The app restarts in the language you pick.": "在「設定」的「Language · Idioma · Langue · 言語 · 언어 · 語言」中切換。「自動」會跟隨手機的語言，也可以選擇 Français (Canada) 或 English。App 會以你選擇的語言重新啟動。",
"Quarter $": "25 美分（$）",
"Dollar $": "1 美元（$）",
"left lane": "",
"right lane": "",
"left handed": "左手",
"Automatic ·": "自動 ·",
"Suivi de quilles": "Suivi de quilles",
"End League & View Results": "結束聯賽並查看結果",
"End Practice & View Results": "結束練習並查看結果",
"End Tournament & View Results": "結束比賽並查看結果",
"End Open Bowling & View Results": "結束自由打並查看結果",
"End Session & View Results": "結束這次打球並查看結果",
"Save & Finish League": "儲存並結束聯賽",
"Save & Finish Practice": "儲存並結束練習",
"Save & Finish Open Bowling": "儲存並結束自由打",
"Save & Finish Session": "儲存並結束這次打球",
"10-pin": "10 號瓶",
"degrees": "度",
"rpm": "rpm",
"mph": "mph",
"hand::R": "右",
"hand::L": "左",
"title::Inbox": "通知",
"title::Import scorecard": "匯入計分表",
"tab::Clean frames": "無失誤格",
"tab::Other leaves": "其他殘瓶",
"tab::First ball": "第一球",
"tab::10-pin": "10 號瓶",
"tab::Stepladder": "階梯賽",
"converted": "補中",
"G1": "G1",
"G2": "G2",
"G3": "G3",
"G4": "G4",
"G5": "G5",
"G6": "G6",
"Two-sided": "雙管齊下",
"Runner-up": "亞軍",
"Pin-to-PAP": "Pin 到 PAP 距離",
"Pin-to-COG": "Pin 到 COG 距離",
"placeholder::Score": "分數",
"— choose a ball —": "— 選擇一顆球 —",
"field::Rev rate": "轉速",
"field::Breakpoint": "轉折點",
"field::Axis rot.": "軸心旋轉",
"field::Axis tilt": "軸心傾斜",
"field::Sole #": "鞋底編號",
"field::Heel #": "鞋跟編號",
"tile::High game": "單局最高分",
"tile::High series": "系列最高分",
"pin::1 pin": "1 號瓶",
"pin::2 pin": "2 號瓶",
"pin::3 pin": "3 號瓶",
"pin::4 pin": "4 號瓶",
"pin::5 pin": "5 號瓶",
"pin::6 pin": "6 號瓶",
"pin::7 pin": "7 號瓶",
"pin::8 pin": "8 號瓶",
"pin::9 pin": "9 號瓶",
"pin::10 pin": "10 號瓶",
"badges::All": "全部",
"tile::League average": "聯賽平均",
"All nights": "所有打球日",
"placeholder::board #": "板號",
"placeholder::degrees": "度",
"Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": "Google Play 會在你確認前顯示免費試用是否適用於你的帳號，之後會自動續訂，直到你取消為止。",
"Pro": "Pro",
"Reading your question…": "正在讀你的問題…",
"questions today. Ask again tomorrow.": "",
"Brooklyn couldn't answer that right now. Try again in a few minutes.": "Brooklyn 目前無法回答。請過幾分鐘再試。",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She has her own card at the top of Improve. Three questions a day.": "「統計」畫面涵蓋一般常見的數字。Brooklyn 負責回答那些數字回答不了的問題——用平常說話的方式問你自己的打球狀況，她會根據你記錄的內容找出答案。如果需要你還沒記錄的資料，她會告訴你該開始記錄什麼。她在「進步」最上方有自己的卡片。每天可以問三個問題。",
"2 questions left today": "今天還能問 2 題",
"Brooklyn isn't available right now. Try again later.": "Brooklyn 現在無法使用，請稍後再試。",
"You've used all three questions today. Ask again tomorrow.": "你今天的三個問題都用完了。明天再來問吧。",
"Brooklyn couldn't answer that. Try again in a moment.": "Brooklyn 沒辦法回答這個問題。請稍後再試一次。",
"Brooklyn took too long to answer. Try again.": "Brooklyn 回答太久了。請再試一次。",
"AI": "AI",
"tab::AI": "AI",
"On the Improve tab, open Goals, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "在「進步」分頁打開「目標」，按「+ 新增目標」，再選擇要加強的項目——平均、全倒率、補中率等。進度會隨著你打球更新。",
"Start a drill from the Goals tab on Improve. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "在「進步」的「目標」分頁開始練習項目。選一個目標——某種補中，或某個球瓶組合——App 會記錄這次練習的成功和失敗次數。",
"Improve has a Coach tab. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "「進步」裡有「教練」分頁。選好指導方向——「對方指導我」或「我指導對方」——然後產生一組代碼。把這八個字元唸給對方聽，對方在自己的手機上輸入，你們就連結好了。",
"+6%": "",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She's on the AI tab of Improve, below Insights. Three questions a day.": "「統計」畫面涵蓋常見的數字。Brooklyn 則負責回答那些畫面答不了的問題——用平常的話問你自己打球的狀況，她會從你記錄的資料中找出答案。如果需要你還沒記錄的資料，她會告訴你該開始記錄什麼。她在「進步」的「AI」分頁，「分析」下方。每天可以問三個問題。",
"no reading": "",
"more than one bowler": "",
"not a card with drawn racks": "",
"Press Import in the header. Say whether it's practice or league, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving. Tournaments aren't imported: log them live on Bowl, where squads, blocks, match play and stepladder are all tracked.": "按頁首的「匯入」。選擇是練習還是聯賽，挑選球隊和日期，然後加入計分螢幕的照片。App 會讀出局數和每一格，儲存前你要指定每一欄是哪位球友的。比賽不能匯入：請在「打球」即時記錄，梯次、輪次、對戰賽和階梯賽都會記錄下來。",
"⚠️ Check the flagged ball below — it couldn't be reliably read from the image.": "⚠️ 請檢查下方標記的這一球——無法從圖片中準確讀取。",
"⚠️ Check the flagged balls below — they couldn't be reliably read from the image.": "⚠️ 請檢查下方標記的各球——無法從圖片中準確讀取。",
"This frame couldn't be read from the image.": "無法從圖片讀取這一格。",
"▾ Hide frames": "▾ 收合各格",
"▸ Check frames": "▸ 檢查各格",
"✓ This is right": "✓ 沒錯",
"Waiting for an app update to finish": "正在等待 App 更新完成",
"The cloud isn't ready for this yet. Nothing is lost on this phone; it will upload once the update is complete.": "雲端還沒準備好接收這筆資料。這支手機上的資料都還在，更新完成後就會上傳。",
"queued behind an earlier write for this row": "正在等待這筆資料先前的變更完成",
"The free plan covers one team, and you're already on one. Upgrade to Pro to add another?": "免費方案只能加入一支球隊，而你已經在一支球隊裡了。要升級 Pro 來新增球隊嗎？",
"Sign in with this link?": "要用這個連結登入嗎？",
"Text": "傳簡訊",
"Your home centers": "你常去的球館",
"Somewhere else?": "其他地方？",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with a code, you get one to text them and they enter it when they sign up; with their email, they're linked the moment they sign in with that exact address.": "現在就先在隊員名單上替對方保留位置——還不需要帳號，你就能馬上透過「記錄對象」用對方的名字記錄分數。不論用哪種方式，對方都會自己認領這個位置，而你記錄的一切都已經在那裡：用代碼的話，你會拿到一組代碼用簡訊傳給對方，對方註冊時輸入；用電子郵件的話，對方用同一個電子郵件地址登入時就會自動連結。",
"Filled in from your note — check it's the right game.": "已根據你的備註填入——請確認是不是正確的那一局。",
"(pending)": "（待確認）",
"Couldn't tell which league this night belongs to. Reload the app and try again.": "無法判斷這次打球屬於哪個聯賽。請重新載入 App 後再試一次。",
"Couldn't change your name without a connection. Try again when you're back online.": "沒有網路連線，無法變更名稱。恢復連線後再試一次。",
"Couldn't change your name. Try again in a moment.": "無法變更名稱。請稍後再試。",
"No spare ball. A plastic ball goes straight at corner pins without hooking.": "沒有補中球。塑膠球不會轉彎，能直直打向角瓶。",
"it can't": "無法放上圖表",
"they can't": "無法放上圖表",
"Nothing strong enough for heavy oil or a fresh pattern.": "沒有夠強的球能應付重油或剛上好的油型。",
"Nothing weak enough for dry lanes or late in a block when the lanes burn up.": "沒有夠弱的球能應付乾球道，或是一輪打到後段、球道油被打乾的時候。",
"No ball with a sharp, angular back end for when you need it to turn the corner.": "沒有後段反應銳利、角度大的球，在你需要球大轉彎時派得上用場。",
"No smooth, controllable ball for when the back end is too strong.": "後段反應太強時，沒有平順、好控制的球可用。",
"Bag": "球袋",
"The Caddie couldn't answer just then. Tap to try again.": "Caddie 剛才無法回答。點一下再試一次。",
"Arsenal analysis": "球具庫分析",
"Add your balls on the Balls tab, with their cover and core, and this maps where each one sits and what your bag is missing.": "在「球」分頁新增你的球，並填入球皮和球心，這裡就會標出每顆球的位置，以及你的球袋還缺什麼。",
"Compare bags": "比較球袋",
"Where each ball sits, from its cover, surface, core and layout — cover and surface count most, because they're what touches the lane. Positions are estimates from specs; your scores show what actually worked.": "每顆球的位置是依球皮、表面、球心和鑽孔配置推算的——球皮和表面最重要，因為它們是接觸球道的部分。位置只是根據規格的估算；實際上哪顆球有效，要看你的分數。",
"First bag": "第一個球袋",
"Second bag": "第二個球袋",
"No ball here has the specs this chart needs yet.": "這裡還沒有球具備這張圖需要的規格。",
"◯ in both": "◯ 兩個球袋都有",
"⟨0⟩ Solid": "⟨0⟩ 實心",
"⟨0⟩ Hybrid": "⟨0⟩ 混合",
"⟨0⟩ Pearl": "⟨0⟩ 珍珠",
"● Faded: specs incomplete": "● 顏色較淡：規格不完整",
"Bags side by side": "球袋並排比較",
"Strength": "強度",
"Length": "長度",
"Back end": "後段",
"No ball is in both bags.": "沒有球同時在兩個球袋裡。",
"A wider range means the bag covers more conditions.": "範圍越廣，代表這個球袋能應付越多種球道狀況。",
"Your balls": "你的球",
"This bag is empty.": "這個球袋是空的。",
"What the arsenal is missing": "球具庫還缺什麼",
"What this bag is missing": "這個球袋還缺什麼",
"Nothing obvious — it covers strong to weak, smooth to sharp, and has a spare ball.": "沒有明顯缺口——從強到弱、從平順到銳利都有，也有補中球。",
"From the catalog:": "型錄中可考慮：",
"The Caddie": "Caddie",
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.": "Caddie 會看過你整個球袋——哪顆球適合哪種球道狀況、哪個球袋配得好、該添購什麼、什麼可以留在家。這是付費方案的功能。",
"See the plan": "查看方案",
"🏌️ The Caddie": "🏌️ Caddie",
"Asks which of these two bags is built for what.": "問問這兩個球袋各自適合什麼狀況。",
"Reads the whole arsenal: each ball's job, your bags, and what to add or leave home.": "看過整個球具庫：每顆球的用途、你的球袋，以及該添購什麼、什麼可以留在家。",
"The Caddie is looking over the bag…": "Caddie 正在看你的球袋…",
"Ask the Caddie": "問 Caddie",
"Add cover and core to at least one ball first.": "請先為至少一顆球填入球皮和球心。",
"Spare ball": "補中球",
"Scores well": "分數不錯",
"Below average": "低於平均",
"Not placed — add cover and core": "尚未定位——請填入球皮和球心",
"games ·": "局 ·",
"No specs entered": "未輸入規格",
"Surface:": "表面處理：",
"not recorded": "未記錄",
"(reading it as out of the box)": "（視為出廠狀態）",
"Layout:": "鑽孔配置：",
"· Length": "· 長度",
"· Back end": "· 後段",
"games at": "局，平均",
"By part of the night:": "各階段：",
"No games logged with it yet.": "還沒有用這顆球記錄任何一局。",
"Each ball's job": "每顆球的用途",
"Gaps": "缺口",
"Next in the bag:": "下一顆可添購：",
"Leave at home:": "留在家：",
"The Caddie's read": "Caddie 的分析",
"it's working from specs and your logged games, not from watching you throw": "它是根據規格和你記錄的比賽判斷，並沒有看你實際投球",
"Ask again": "再問一次",
"ArsenalAnalysis": "ArsenalAnalysis",
"Weak": "弱",
"Benchmark": "基準",
"Strong": "強",
"Early": "早",
"Mid-lane": "中段",
"Long": "長",
"Smooth": "平順",
"Controlled": "穩定",
"Sharp": "銳利",
"Light oil / late in the block": "少油 / 後段",
"Medium oil": "中油",
"Heavy oil / fresh": "重油 / 新油",
"Length × Back end": "長度 × 後段",
"Where each ball starts to hook, and how it turns. Bigger dots are stronger balls.": "每顆球開始轉彎的位置和轉彎的方式。圓點越大，代表球越強。",
"Length × Strength": "長度 × 強度",
"The ladder: strongest at the top for fresh or heavy oil, weakest at the bottom for dry lanes and late in the block.": "球具階梯：最上面最強，適合新油或重油；最下面最弱，適合乾路和打到後段的時候。",
"RG × Differential": "RG × 差值",
"Low RG (revs early)": "低 RG（較早起轉）",
"High RG (revs late)": "高 RG（較晚起轉）",
"Low diff (less flare)": "低差值（球痕擴散較小）",
"High diff (more flare)": "高差值（球痕擴散較大）",
"The core alone, as the maker's numbers. Bigger dots are more asymmetric.": "只看球心本身，依廠商公布的數值。圓點越大，代表越不對稱。",
"Compare your bags, and ask the Caddie": "比較你的球袋，並問問 Caddie",
"Where each ball sits, what scores, what's missing": "每顆球的定位、哪顆球分數好、還缺什麼",
"Ball against ball": "球與球比較",
"Your read-back after every night — you've poured one.": "每次打完後的回顧——你已經倒了 1 杯。",
"A photo of the scorecard instead of typing every game.": "拍一張計分表照片，不必每局手動輸入。",
"Head to head": "一對一",
"Your numbers against your teammates', and the team leaderboard.": "你和隊友的數字比較，以及球隊排行榜。",
"Comparing your numbers with your friends'.": "和好友比較你的數字。",
"House against house": "球館對球館",
"Your season side by side with the one before.": "本賽季和上個賽季並排比較。",
"Tracking what you put in and won at tournaments.": "記錄你在比賽投入的金額和贏得的獎金。",
"Your coach's tasks, notes and view of your numbers.": "教練給你的任務、筆記，以及教練眼中你的數字。",
"Your 60 days of Pro are up.": "你的 60 天 Pro 已經到期。",
"Every game, shot and night you've logged — nothing is deleted": "你記錄過的每一局、每一球和每次打球——都不會刪除",
"Your own stats: strikes, spares, splits, leaves and each ball's numbers": "你自己的統計：全倒、補中、技術球、殘瓶和每顆球的數字",
"One league, one team, a league bag and a tournament bag": "1 個聯賽、1 支球隊、1 個聯賽球袋和 1 個比賽球袋",
"Badges, your journey and the calendar": "徽章、你的旅程和行事曆",
"Your Pro trial has ended": "你的 Pro 免費試用已結束",
"What you've been using that Basic doesn't include:": "你一直在用、但 Basic 不包含的功能：",
"Keep Pro ·": "繼續使用 Pro ·",
"/month": "/月",
"Or": "或",
"/year": "/年",
"Basic is free, and keeps:": "Basic 免費，並保留：",
"Continue with Basic": "繼續使用 Basic",
"No card is on file, so nothing is charged when the trial ends — you move to Basic unless you choose Pro.": "你沒有登記任何信用卡，所以試用結束時不會扣款——除非你選擇 Pro，否則會自動轉為 Basic。",
"You against a teammate. Needs frames for you and at least one teammate in this league.": "你和隊友的對決。需要你和這個聯賽中至少一位隊友的逐格紀錄。",
"Teammate": "隊友",
"This league only. Split Rate is the one where lower is better.": "僅限此聯賽。技術球率是唯一越低越好的項目。",
"All leagues": "所有聯賽",
"Language · Idioma · Langue": "",
"Nightcap, Insights, Brooklyn, the Caddie and coaching": "Nightcap、分析、Brooklyn、Caddie 和指導",
"You cancelled, so this ends when the period you paid for runs out. Everything stays unlocked until then, and you can start it again any time before it ends.": "你已取消訂閱，因此會在已付費的期間結束時終止。在那之前所有功能都維持解鎖，結束前也隨時可以重新訂閱。",
"window::All": "全部",
"tab::Season": "賽季",
"tab::Calendar": "行事曆",
"tab::Journey": "旅程",
"picker::Every night": "全部日期",
"field::Scoring": "計分方式",
"tab::Side games": "場邊彩池",
"Language · Idioma · Langue in Settings. Automatic follows your phone's language, or pick English, Español or Français. The app restarts in the language you pick.": "在「設定」的「Language · Idioma · Langue · 言語 · 언어 · 語言」中切換。「自動」會跟隨手機的語言，你也可以選擇 English、Español 或 Français。App 會以你選的語言重新啟動。",
"Español": "",
"Français": "",
"The Caddie's read was written by AI. It can be confidently wrong — it's working from specs and your logged games, not from watching you throw.": "Caddie 的分析是 AI 寫的，可能說得頭頭是道卻是錯的——它是根據球的規格和你記錄的各局來判斷，並沒有看到你實際出手。",
"This was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "這是 AI 寫的，可能說得頭頭是道卻是錯的——請和你在球道上實際看到的情況對照一下。",
"✓ Session Saved": "✓ 這次打球已儲存",
"▼ How much data it’s built on, beside it": "▼ 旁邊會標出這是根據多少資料算出來的",
"▼ Leave the target off if it isn’t a number": "▼ 目標不是數字的話，就留空",
"Composite average at each position in the night, across the whole season — shows whether they're bowling better early, middle, or late.": "整個賽季中，依當天第幾局分別計算的綜合平均——可以看出這位球友是在前段、中段還是後段打得比較好。",
"⟨0⟩ Urethane": "⟨0⟩ 聚氨酯",
"Language · Idioma · Langue · 言語": "",
"日本語": "",
"Language · Idioma · Langue · 言語 in Settings. Automatic follows your phone's language, or pick English, Español, Français or 日本語. The app restarts in the language you pick.": "在「設定」的「Language · Idioma · Langue · 言語 · 언어 · 語言」中切換。「自動」會跟隨手機的語言，你也可以選擇 English、Español、Français 或日本語。App 會以你選的語言重新啟動。",
"Bowled.": "已打完。",
"tab::Center": "球館",
"placeholder::Handicap": "讓分",
"tab::Handicap": "讓分",
"window::Games": "局數",
"field::Delivery": "出手方式",
"tile::Strikes": "全倒率",
"field::Target": "瞄準點",
"milestone::Next ·": "下一個目標 ·",
"newly::.": "。",
"Japan": "",
"Singapore": "",
"Language · Idioma · Langue · 言語 · 언어": "",
"Language · Idioma · Langue · 言語 · 언어 in Settings. Automatic follows your phone's language, or pick English, Español, Français, 日本語 or 한국어. The app restarts in the language you pick.": "在「設定」的「Language · Idioma · Langue · 言語 · 언어 · 語言」中切換。「自動」會跟隨手機的語言，你也可以選擇 English、Español、Français、日本語或 한국어。App 會以你選的語言重新啟動。",
"Split Happens — Tuesday House Shot": "Split Happens — 週二館內油型",
"league": "聯賽",
"hand::Right": "右手",
"hand::Left": "左手",
"confidence::Not yet": "樣本還不夠",
"Frames where every teammate struck but one. Log your teammates' frames on a league night.": "隊友全都打出全倒、只有一人沒打出的格。請在聯賽日記錄隊友的每一格。",
"tonight ·": "（今天）·",
"Cost": "費用",
"Hongkong": "",
"AED 18.99": "",
"AED 189.99": "",
"KD 1.500": "",
"KD 15.000": "",
"Language · Idioma · Langue · 言語 · 언어 · 語言": "Language · Idioma · Langue · 言語 · 언어 · 語言",
"Language · Idioma · Langue · 言語 · 언어 · 語言 in Settings. Automatic follows your phone's language, or pick English, Español, Français, 日本語, 한국어 or 繁體中文. The app restarts in the language you pick.": "在「設定」的「Language · Idioma · Langue · 言語 · 언어 · 語言」中切換。「自動」會跟隨手機的語言，你也可以選擇 English、Español、Français、日本語、한국어或繁體中文。App 會以你選的語言重新啟動。",
"aria-label::Practice. For working on your game. Drills, frame tracking and every detail field are available, and practice scores stay out of your league averages.": "練習：用來磨練球技。可以使用練習項目、逐格記錄和所有細節欄位，而且練習分數不會計入你的聯賽平均。",
"aria-label::League. For your weekly team night. Your team roster and standings are available, along with side games.": "聯賽：用於每週的球隊聯賽日。可以使用球隊的隊員名單和排名，還有場邊彩池。",
"aria-label::Tournament. For higher-stakes competition. Blocks, squads, side pots, brackets, match play and the cut line are all available.": "比賽：用於競爭更激烈的比賽。輪次、梯次、彩池、對戰籤表、對戰賽和晉級線都可以使用。",
"aria-label::Open bowling. For a fun activity. You get the scoresheet, standings and badges — all other views are hidden, not deleted, to keep it quick and simple.": "自由打：輕鬆玩玩用。你會有計分表、排名和徽章——其他畫面都會隱藏（不會刪除），讓操作快速又簡單。",
"format::10 pin": "一般計分",
"result::Ringing 10": "顫 10 號瓶",
"result::Ringing 7": "顫 7 號瓶",
"badges::Cashed": "贏得彩池",
"tile::Games": "各局分數"
},
"patterns": [
[
"Add {0}'s balls to start logging shots.",
"新增 {0} 的球，就能開始記錄投球。"
],
[
"{0}% spares",
"補中率 {0}%"
],
[
"Remove {0}",
"移除 {0}"
],
[
"Delete \"{0}\"? Its balls become ungrouped.",
"要刪除「{0}」嗎？裡面的球會變成未分組。"
],
[
"Name change hasn't reached the cloud yet ({0}) — teammates won't be able to find you until it syncs.",
"名稱變更還沒同步到雲端（{0}）——同步完成前，隊友找不到你。"
],
[
"Saved on this device, but hasn't reached the cloud yet ({0}) — it may not carry over to another device yet.",
"已儲存在這台裝置上，但還沒同步到雲端（{0}）——暫時可能還不會出現在其他裝置上。"
],
[
"of {0}",
"/{0}"
],
[
"Earned {0}",
"已獲得 {0}"
],
[
"Left {0}",
"未獲得 {0}"
],
[
"The free plan covers {0} league bag and {1} tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.",
"免費方案提供 {0} 個聯賽球袋和 {1} 個比賽球袋。額外的球袋（例如短油型比賽球袋、運動油型球袋）屬於付費方案。你已經裝好的球都不會消失。"
],
[
"{0} · {1}{2} ball{3:s}{4}",
"{0} · {1}{2} 顆球{4}"
],
[
"{0} ball{1:s} not packed in any bag. Practice always shows every ball regardless.",
"有 {0} 顆球沒有放進任何球袋。練習時一律會顯示所有的球。"
],
[
"Showing the {0}lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.",
"目前顯示 {0} lb 的數值——RG 和差值會隨重量不同，而這顆球公布了不只一種重量的數值。"
],
[
"No published numbers for {0}lb specifically — showing the reference weight instead.",
"沒有專門針對 {0} lb 公布的數值——改為顯示參考重量的數值。"
],
[
"First balls at a full rack only {0} what a strike ball is for.",
"只計算 10 支球瓶全立時的第一球{0}這正是攻擊球的用途。"
],
[
"{0} shots — too few to rely on",
"只有 {0} 球，樣本太少，還不能參考"
],
[
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than {0} shots behind it, so treat it as preliminary. A dash means no shots at all.",
"每個數字都是全倒率。粗體代表該階段領先；差距小到可能只是運氣時，就不會有粗體。琥珀色的數字背後不到 {0} 球，請當作初步參考。橫線表示完全沒有投球。"
],
[
"{0} went quiet. Try again in a moment.",
"{0} 沒有回應。請稍後再試。"
],
[
"Couldn't reach {0}. Try again in a moment.",
"無法連線到 {0}。請稍後再試。"
],
[
"Ask {0}, the bowling genie",
"問問保齡球精靈 {0}"
],
[
"You've used all {0} today. {1} is back tomorrow.",
"你今天已經用完全部 {0} 了。{1} 明天會回來。"
],
[
"The Stats screens cover the usual numbers. {0} is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.",
"「統計」頁面涵蓋一般常見的數字。{0} 負責回答那些頁面答不了的問題——問問你自己打球的狀況，她會從你記錄的資料裡找出答案。如果需要你還沒記錄的項目，她會告訴你該開始記錄什麼。"
],
[
"You're on {0} in this league. Making {1} puts you on its roster and takes you off {2}'s. Your scores stay yours.",
"你在這個聯賽屬於 {0}。建立 {1} 會讓你加入它的隊員名單，並從 {2} 的名單中移除。你的分數還是你的。"
],
[
"Couldn't find \"{0}\" in the cloud — this team was created on this device only and won't be visible to teammates. Try again once you're back online.",
"在雲端找不到「{0}」——這支球隊只在這台裝置上建立，隊友看不到。恢復連線後請再試一次。"
],
[
"\"{0}\" was created locally but couldn't reach the cloud yet ({1}). It'll keep retrying in the background.",
"「{0}」已在這台裝置上建立，但還無法同步到雲端（{1}）。系統會在背景持續重試。"
],
[
"Combine your \"{0}\" with the shared one{1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"要把你的「{0}」和共享的同名聯賽{1}合併嗎？你的局數、球隊和聯賽設定都會移過去，你也會看到那裡已有的球隊。這個動作無法復原。"
],
[
"\"{0}\" was saved on this device only and hasn't reached the cloud yet — it won't be visible to teammates or usable for creating a team until it syncs. It'll keep retrying in the background if you're offline; check back if this persists.",
"「{0}」只儲存在這台裝置上，還沒同步到雲端——同步完成前，隊友看不到，也不能用來建立球隊。如果你離線，系統會在背景持續重試；如果一直是這樣，請稍後再回來看看。"
],
[
"You already have a league called \"{0}\". Pick a different name.",
"你已經有名為「{0}」的聯賽了。請換個名稱。"
],
[
"\"{0}\" was renamed on this device only and hasn't reached the cloud yet. It'll keep retrying in the background if you're offline; check back if this persists.",
"「{0}」只在這台裝置上改了名稱，還沒同步到雲端。如果你離線，系統會在背景持續重試；如果一直是這樣，請稍後再回來看看。"
],
[
"You're not on {0} as {1}, so there's nothing to leave.",
"你並未以 {1} 的身分加入 {0}，所以沒有球隊可以退出。"
],
[
"spec|{0}",
""
],
[
"bgroup|{0}",
""
],
[
"bag|{0}",
""
],
[
"layout|{0}",
""
],
[
"You're on {0} in this league. Joining {1} takes you off {2}'s roster. Your scores stay yours.",
"你在這個聯賽屬於 {0}。加入 {1} 後，你會從 {2} 的隊員名單中移除。你的分數還是你的。"
],
[
"You're on {0}.",
"你已加入 {0}。"
],
[
"{0} {1} on {2} now.",
"{0} 現在已加入 {2}。"
],
[
"You're on {0} in this league. If {1} approve{2:s} you, you'll be taken off {3}'s roster. Your scores stay yours.",
"你在這個聯賽屬於 {0}。如果 {1} 核准你的申請，你會從 {3} 的隊員名單中移除。你的分數還是你的。"
],
[
"This replaces your request to join {0}.",
"這會取代你之前申請加入 {0} 的請求。"
],
[
"You've joined {0}. It'll show under Social.",
"你已加入 {0}。可以在「好友」中看到。"
],
[
"This tournament is {0}’s. Switch bowler to save it.",
"這場比賽屬於 {0}。請切換球友後再儲存。"
],
[
"profile|{0}",
""
],
[
"These leagues were restored on this device only and haven't reached the cloud yet: {0}. They'll keep retrying in the background if you're offline.",
"以下聯賽只在這台裝置上還原，還沒同步到雲端：{0}。如果你離線，系統會在背景持續重試。"
],
[
"manual|{0}|{1}|{2}",
""
],
[
"game {0}: {1}",
""
],
[
"{0} {1}% over {2}",
""
],
[
"· Ball {0}",
"· 第 {0} 球"
],
[
"{0} changes backing up",
"{0} 項變更正在備份"
],
[
"Inbox, {0} waiting",
"通知，{0} 則待處理"
],
[
"✓ {0} {1} saved on this phone. Nothing is lost.",
"✓ {0} 項變更已儲存在這支手機上。沒有任何遺失。"
],
[
"mbj-app-content mbj-view-{0}",
""
],
[
"🧑‍🏫 Coach{0}",
"🧑‍🏫 教練{0}"
],
[
"Invitation to join {0}",
"邀請你加入 {0}"
],
[
"{0} wants to join {1}",
"{0} 申請加入 {1}"
],
[
"Joining takes you off {0}.",
"加入後，你會離開{0}。"
],
[
"Approving moves them off {0}.",
"核准後，這位球友會離開{0}。"
],
[
"📥 {0} waiting for you",
"📥 {0} 項等你處理"
],
[
"{0} total · {1} average · {2} high{3}{4}",
"總分 {0} · 平均 {1} · 最高 {2}{3}{4}"
],
[
"({0} scratch + {1} hcp)",
"（不讓分 {0} + 讓分 {1}）"
],
[
"{0}{1} vs the cut",
"{0}距晉級線 {1}"
],
[
"{0}-{1}{2}{3}{4} match{5:s}{6}{7}{8} with bonus",
"{4} 場對戰 {0}-{1}{2}{6}{7}含獎勵分 {8}"
],
[
"· {0} average",
"· 平均 {0}"
],
[
"{0}{1} of {2} step{3:s} won{4}",
"{0}{2} 關中贏了 {1} 關{4}"
],
[
"{0} seed ·",
"{0} 種子 ·"
],
[
"· finished {0}",
"· 最終拿下{0}"
],
[
"{0} night{1:s} · {2} games · {3} average · {4} high",
"{0} 次 · {2} 局 · 平均 {3} · 最高 {4}"
],
[
"1.5px solid {0}",
""
],
[
"Open results for {0}",
"開啟 {0} 的結果"
],
[
"{0} series · {1} average · {2} high",
"系列總分 {0} · 平均 {1} · 最高 {2}"
],
[
"{0}% strikes{1}{2}",
"全倒率 {0}%{1}{2}"
],
[
"· {0}% spares",
"· 補中率 {0}%"
],
[
"· {0} split{1:s}",
"· 技術球 {0} 次"
],
[
"Delete this night? {0} game{1:s} and every frame logged with them. This cannot be undone.",
"要刪除這次紀錄嗎？{0} 局和其中記錄的每一格都會刪除，且無法復原。"
],
[
"Everyone you've bowled with, by average. {0}",
"所有和你一起打過球的人，依平均排序。{0}"
],
[
"{0} game{1:s}",
"{0} 局"
],
[
"{0} night{1:s}",
"{0} 次"
],
[
"{0} win{1:s}",
"{0} 次獲勝"
],
[
"Send {0} their badges",
"把徽章傳給 {0}"
],
[
"Free fall on {0}.",
"{0} 號球道是自由落瓶式。"
],
[
"Where does {0} bowl? Set once per season — it lets you compare how you score house to house.",
"{0}在哪間球館打？每個賽季設定一次就好——這樣就能比較你在不同球館的分數。"
],
[
"{0} mi",
"{0} 英里"
],
[
"Target: {0}{1} {2}{3}",
"目標：{2} {0}{1}{3}"
],
[
"reached {0}{1}",
"實際 {0}{1}"
],
[
"Due {0}",
"期限：{0}"
],
[
"(+{0} more)",
"（還有 {0} 項）"
],
[
"Target {0}{1} — no result logged yet.",
"目標 {0}{1}——尚未記錄結果。"
],
[
"Bowls {0} on {1}",
"下次聯賽：{0}，{1}"
],
[
"{0} — asked to be your {1}",
"{0}——已申請成為你的{1}"
],
[
"They enter it on their own phone and you{0}re connected — no searching for each other by name.",
"對方在自己的手機上輸入後，你們就完成連結了——不用互相搜尋名字。"
],
[
"Connected. They{0}re in the list above.",
"已連結，對方會出現在上方清單中。"
],
[
"Goal for {0}",
"{0} 的目標"
],
[
"Next session with {0}",
"與 {0} 的下次課程"
],
[
"{0}'s Game",
"{0} 的表現"
],
[
"From {0} shots",
"根據 {0} 球"
],
[
"Misses: {0}",
"未補中：{0}"
],
[
"Tasks — {0}",
"任務 — {0}"
],
[
"{0}. An 800 series is an 800 series.",
"{0} 分。800 分的系列，就是 800 分的系列。"
],
[
"{0}, beating your {1} by {2}.",
"{0} 分，比你先前的 {1} 分多了 {2} 分。"
],
[
"your {0} drill",
"你的 {0} 練習項目"
],
[
"Mentions {0}, which you haven't logged enough of yet — treat that part as a guess.",
"提到了{0}，但你這方面的紀錄還不夠——這部分請當作推測參考。"
],
[
"{0} added. {1} you already had.",
"已新增 {0}紀錄。{1}原本就有了。"
],
[
"You already had {0}.",
"{0}已經有了。"
],
[
"all {0} of those nights",
"這 {0} 次的紀錄全都"
],
[
"Manufacturer specifications. Source: {0}",
"廠商規格。來源：{0}"
],
[
"Verified by {0} bowlers. Locked from edits.",
"已由 {0} 位球友驗證。已鎖定，無法編輯。"
],
[
"Entered by another bowler and confirmed by {0}. Not manufacturer data.",
"由其他球友輸入，已有 {0} 人確認。不是廠商資料。"
],
[
"RG {0}",
"RG {0}"
],
[
"Diff {0}",
"Diff {0}"
],
[
"Int {0}",
"中間差值 {0}"
],
[
"Earned in {0} only",
"只能在{0}中獲得"
],
[
"Earned in {0} or {1}",
"可在{0}或{1}中獲得"
],
[
"date must look like 2026-09-17, got \"{0}\"",
"日期格式必須像 2026-09-17，目前是「{0}」"
],
[
"no such date: {0}",
"沒有這個日期：{0}"
],
[
"date looks wrong: {0}",
"日期看起來不對：{0}"
],
[
"date is in the future: {0}",
"日期是未來的日子：{0}"
],
[
"{0} must be a whole number, got \"{1}\"",
"{0}必須是整數，目前是「{1}」"
],
[
"The header row needs these columns: {0}.",
"標題列需要這些欄位：{0}。"
],
[
"That file has {0} rows. The limit is {1}.",
"這個檔案有 {0} 列，上限是 {1} 列。"
],
[
"{0} appears twice in this file",
"{0} 在這個檔案裡出現兩次"
],
[
"{0} — diagnostics",
""
],
[
"Ask {0} something. She's got your whole history in here.",
"問 {0} 點什麼吧。你的所有紀錄她都掌握了。"
],
[
"That's a lot. Try asking {0} one thing.",
"一次問太多了。試著只問 {0} 一件事。"
],
[
"{0} only knows bowling. That one's free — ask her something else.",
"{0} 只懂保齡球。這題不扣次數——問她別的吧。"
],
[
"the {0} leave",
""
],
[
"Tracking {0} would show why.",
""
],
[
"Why {0} happens: not enough yet ({1} of {2} shots needed).{3}",
""
],
[
"{0} {1}{2} when left vs {3}{4} otherwise",
""
],
[
"leaveCauses, {0} ({1} shots): {2}",
""
],
[
"sp{0}%",
""
],
[
"spl{0}%",
""
],
[
"{0}-{1}mph",
""
],
[
"{0}-{1}rpm",
""
],
[
"Breakdowns of logged shots. Key: fb = first balls, X = strike %, sp = non-split spare conversion %, spl = split % of first balls. Slices under {0} first balls are left out; a missing slice means too little data, not zero.",
""
],
[
"{0} pin{1:s} a game to go.",
"每局還差 {0} 分就達標。"
],
[
"Beat your best by {0} pin{1:s}.",
"要比你的單局最高分再多 {0} 分。"
],
[
"Beat your best series by {0} pin{1:s}.",
"要比你的系列最高分再多 {0} 分。"
],
[
"Keep {0} of your next {1} {2} clean",
"接下來 {1} {2}中，要有 {0} 格沒有失誤"
],
[
"{0}{1} {2} of your next {3} {4}",
"接下來 {3} 次{4}，要成功 {2} 次"
],
[
"{0} — {1} more than you are now.",
"{0}——比你現在多 {1} 次。"
],
[
"Corrected by {0}.",
"由 {0} 修正。"
],
[
"Game {0}: you logged {1}, the photo reads {2}. Yours is kept unless you change it.",
"第 {0} 局：你記錄的是 {1} 分，照片讀到的是 {2} 分。除非你修改，否則會保留你的分數。"
],
[
"game {0} ({1} vs {2})",
"第 {0} 局（你記錄 {1} 分，照片 {2} 分）"
],
[
"These disagree with what you logged — {0}. Yours are kept unless you change them.",
"這些跟你記錄的不一樣——{0}。除非你修改，否則會保留你的分數。"
],
[
"{0} nights of scores to check",
"{0} 次打球的分數待確認"
],
[
"{0} nights need re-entering",
"有 {0} 次打球需要重新輸入"
],
[
"{0} teammate score{1:s} unconfirmed",
"{0} 筆隊友分數尚未確認"
],
[
"{0} wants to be your {1}",
"{0} 想以{1}身分與你連結"
],
[
"{0} task{1:s} from your coach",
"教練給你的 {0} 項任務"
],
[
"{0} task update{1:s} from your bowlers",
"我的球員傳來 {0} 則任務更新"
],
[
"{0} sent a friend request",
"{0} 送出了好友邀請"
],
[
"{0}Accept or decline on the Team tab.",
"{0}請在「球隊」分頁接受或拒絕。"
],
[
"{0} has finished its season.",
"{0} 的賽季已經結束。"
],
[
"Your specs for {0} were rejected",
"你提交的 {0} 規格被駁回了"
],
[
"Game {0}, frame {1}",
"第 {0} 局第 {1} 格"
],
[
"{0} pin{1:s} away",
"還差 {0} 分"
],
[
"Best {0}",
"最高 {0} 分"
],
[
"Milestones up to a {0} average",
"平均 {0} 分以內的里程碑"
],
[
"{0} pin{1:s} short · best {2}",
"還差 {0} 分 · 最高 {2} 分"
],
[
"{0}, and {1}",
"{0}和{1}"
],
[
"You usually bowl {0}. The app sets itself up for you on those days instead of asking.",
"你通常在{0}打球。那幾天 App 會直接幫你設定好，不會再問你。"
],
[
"Min {0}{1}",
"最小 {0}{1}"
],
[
"Max {0}{1}",
"最大 {0}{1}"
],
[
"Leave {0}?",
"要退出 {0} 嗎？"
],
[
"You'll no longer be part of {0}.",
"你將不再是 {0} 的成員。"
],
[
"You'll still be on {0} in {1}.",
"在 {1} 中，你仍是 {0} 的一員。"
],
[
"Your teammates ({0}) will see you've left.",
"你的隊友（{0}）會看到你已退出。"
],
[
"Won every match, by {0} pins on average.",
"每場都贏，平均贏 {0} 分。"
],
[
"Lost every match, but all of them by under {0} pins.",
"每場都輸，但每場都輸不到 {0} 分。"
],
[
"Lost every match, by {0} pins on average.",
"每場都輸，平均輸 {0} 分。"
],
[
"won by {0} on average",
"贏的場次平均贏 {0} 分"
],
[
"lost by {0}",
"輸的場次平均輸 {0} 分"
],
[
"{0} of {1} came down to under {2} pins.",
"{1} 場中有 {0} 場差距不到 {2} 分。"
],
[
"Official {0} PBA specs.",
"{0} 年 PBA 官方規格。"
],
[
"Not on the {0} sheet — check patternlibrary.kegel.net if you bowled it.",
"不在 {0} 年的規格表上——如果你打過這個油型，請到 patternlibrary.kegel.net 查詢。"
],
[
"{0} · {1} · specs not entered yet",
"{0} · {1} 年 · 尚未輸入規格"
],
[
"fewer than {0} games in {1}",
"{1} 的局數不到 {0} 局"
],
[
"{0} average across {1} games",
"依 {0} 的 {1} 局計算平均"
],
[
"no league reached {0} games, and the combined total didn't either",
"沒有任何聯賽達到 {0} 局，全部合計也沒有"
],
[
"{0} average across {1} games (your strongest league)",
"依 {0} 的 {1} 局計算平均（你表現最好的聯賽）"
],
[
"LOCATION:{0}",
""
],
[
"UID:bowling-{0}-{1}",
""
],
[
"DTSTART:{0}",
""
],
[
"DTEND:{0}",
""
],
[
"RRULE:FREQ=WEEKLY;BYDAY={0}",
""
],
[
"SUMMARY:{0}",
""
],
[
"TRIGGER:-PT{0}M",
""
],
[
"DESCRIPTION:{0} in {1} minutes",
"DESCRIPTION:{0} 將在 {1} 分鐘後開始"
],
[
"Retired {0}",
"{0} 退役"
],
[
"{0} · nothing logged with it",
"{0} · 沒有用這顆球的紀錄"
],
[
"{0} · {1}, too few to compare",
"{0} · {1}，太少，無法比較"
],
[
"{0} · {1} · {2}% strikes",
"{0} · {1} · 全倒率 {2}%"
],
[
"{0} couldn't be read and were left out. A clearer photo would get more — what's below is still safe to save.",
"{0} 無法辨識，已略過。照片更清楚的話可以讀到更多——下面的內容仍可放心儲存。"
],
[
"The series says {0} but the {1} games add up to {2} — {3}. Check before saving.",
"系列總分寫的是 {0}，但 {1} 局加起來是 {2}——{3}。儲存前請確認。"
],
[
"The card says {0} but the frames add up to {1} — {2}. Check before saving.",
"計分表寫的是 {0}，但各格加起來是 {1}——{2}。儲存前請確認。"
],
[
"board must be {0} to {1}",
"板數必須介於 {0} 到 {1}"
],
[
"{0} night{1:s} · {2} game{3:s}",
"{0} 次 · {2} 局"
],
[
"Average {0}",
"平均 {0}"
],
[
"High game {0}{1}",
"單局最高分 {0}{1}"
],
[
"· High series {0}",
"· 系列最高分 {0}"
],
[
"{0} game{1:s} over 200",
"超過 200 分的有 {0} 局"
],
[
"{0}% strikes · {1}% spares",
"全倒率 {0}% · 補中率 {1}%"
],
[
"{0}{1} on the season",
"本賽季 {0}{1}"
],
[
"{0} – now",
"{0} – 至今"
],
[
"{0} games against {1}",
"本賽季 {0} 局，上個賽季 {1} 局"
],
[
"Your average is the same as last season — {0}.",
"你的平均和上個賽季一樣——{0}。"
],
[
"Your average is {0} {1} {2} on last season — {3}.",
"你的平均比上個賽季{0}了 {1} 分——{3}。"
],
[
"{0} One of those seasons is short, so treat it lightly.",
"{0}其中一季的局數較少，參考就好。"
],
[
"Tied at {0} — nobody's settling this tonight.",
"{0} 分平手——今天分不出勝負。"
],
[
"{0}, by just {1}. That was close.",
"{0} 分，只贏 {1} 分。好險！"
],
[
"{0}, won by {1}.",
"{0} 分，贏了 {1} 分。"
],
[
"Jumped {0} pins between games.",
"局與局之間進步了 {0} 分。"
],
[
"Dropped {0} pins between games.",
"局與局之間掉了 {0} 分。"
],
[
"Every game within {0} pins.",
"每局分差都在 {0} 分以內。"
],
[
"{0} average over {1} game{2:s}",
"{1} 局平均 {0}"
],
[
"{0} — {1} above your average.",
"{0}——比你的平均高 {1} 分。"
],
[
"{0} — {1} below your average.",
"{0}——比你的平均低 {1} 分。"
],
[
"{0} — right on your average.",
"{0}——剛好是你的平均。"
],
[
"{0} of {1} across {2} drill{3:s}",
"{2} 個練習項目共 {0}/{1}"
],
[
"{0} {1} for {2}{3}{4}: {5}.",
"{0}{3}{4}：{2} 局共 {1} 分（{5}）。"
],
[
"Badge{0:s} earned: {1}",
"獲得徽章：{1}"
],
[
"Tracked with {0} — {1}",
"使用 {0} 記錄——{1}"
],
[
"{0}-game series",
"{0} 局系列"
],
[
"{0}+{1} more",
"{0}還有 {1} 個"
],
[
"+{0} more",
"還有 {0} 個"
],
[
"Won {0} in side pots",
"在場邊彩池贏得 {0}"
],
[
"Hit my goal: {0}",
"達成目標：{0}"
],
[
"New personal best series — beat {0}",
"系列總分刷新個人最佳——超越 {0}"
],
[
"New personal best game — beat {0}",
"單局刷新個人最佳——超越 {0}"
],
[
"{0} clean game{1:s}",
"無失誤局 {0} 局"
],
[
"{0} pins over my average",
"比我的平均高 {0} 分"
],
[
"{0} Tracked with {1} — {2}",
"{0} 使用 {1} 記錄——{2}"
],
[
"{0} games — averaging {1}, high {2}, low {3}.",
"{0} 局——平均 {1}，最高 {2}，最低 {3}。"
],
[
"{0} has earned {1}{2} badge{3:s}",
"{0} 已獲得 {1}{2} 枚徽章"
],
[
"{0} earned a badge tonight",
"{0} 今天獲得了一枚徽章"
],
[
"{0} earned {1} badges tonight",
"{0} 今天獲得了 {1} 枚徽章"
],
[
"Keep them: {0}",
"留作紀念：{0}"
],
[
"Standings Tracked with {0} — {1}",
"排名 使用 {0} 記錄——{1}"
],
[
"Qualifying: {0} across {1} game{2:s}",
"資格賽：{1} 局共 {0} 分"
],
[
"Made the cut by {0}",
"以 {0} 分之差晉級"
],
[
"Missed the cut by {0}",
"以 {0} 分之差未能晉級"
],
[
", {0} with bonus",
"，含獎勵分共 {0} 分"
],
[
"Match play: {0}{1}",
"對戰賽：{0}{1}"
],
[
"from the {0} seed",
"（從{0}出發）"
],
[
"Won the stepladder{0}",
"階梯賽奪冠{0}"
],
[
"Stepladder: {0}{1}",
"階梯賽：{0}{1}"
],
[
"Stepladder: {0} of {1} steps won{2}",
"階梯賽：{1} 關中贏了 {0} 關{2}"
],
[
"Up {0} on the day",
"當天贏了 {0}"
],
[
"Down {0} on the day",
"當天輸了 {0}"
],
[
"{0} game{1:s} · {2} average",
"{0} 局 · 平均 {2}"
],
[
"{0} {1} if you {2}",
"{2}，就能解鎖 {0} 項統計"
],
[
"{0}. Either on its own is fine.",
"{0}。只做其中一項也可以。"
],
[
"Won the stepladder{0}.",
"贏得階梯賽冠軍{0}。"
],
[
"— {0} straight",
"——連贏 {0} 關"
],
[
"to the {0} seed",
"，輸給{0}"
],
[
"Finished {0}{1}.",
"以{0}作收{1}。"
],
[
"you and {0}",
"你和 {0}"
],
[
"Baker: {0} bowled this together, so the score stays out of your average.",
"Baker 賽制：{0}一起打這局，所以這個分數不計入你的平均。"
],
[
"{0} more night{1:s} needed before a direction means anything.",
"還需要再打 {0} 次，才能判斷趨勢。"
],
[
"Trending {0} about {1}{2} across this stretch.",
"這段期間大約{0}了 {1}{2}。"
],
[
"Last {0} — showing {1} of {2} {3}",
"最近 {0} 局——顯示 {2} {3}中的 {1} {3}"
],
[
"Last {0} days — showing {1} of {2} {3}",
"最近 {0} 天——顯示 {2} {3}中的 {1} {3}"
],
[
"{0} to {1} — showing {2} of {3} {4}",
"{0} 至 {1}——顯示 {3} {4}中的 {2} {4}"
],
[
"{0} of {1} {2}{3}",
""
],
[
"{0}· last time {1}%",
"{0}· 上次 {1}%"
],
[
"Save Drill ({0} attempts)",
"儲存練習項目（{0} 次）"
],
[
"Remove {0} as a friend?",
"要將 {0} 從好友中移除嗎？"
],
[
"Not enough data yet — {0} more {1} before this is worth reporting.",
"資料還不夠——{1}數還差 {0}，才有參考價值。"
],
[
"{0} to go",
"還差 {0}"
],
[
"{0} targets run from {1} to {2}.",
"{0}的目標範圍是 {1} 到 {2}。"
],
[
"Target{0}",
"目標{0}"
],
[
"retrying after: {0}",
""
],
[
"Nothing matched \"{0}\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".",
"找不到符合「{0}」的結果。試試 App 裡會出現的字詞——「補中」、「球隊」、「球」、「匯入」。"
],
[
"{0} games logged",
"已記錄 {0} 局"
],
[
"· {0} seasons",
"· {0} 個賽季"
],
[
"{0} badges earned",
"已獲得 {0} 枚徽章"
],
[
"{0} · {1} milestone{2:s} so far",
"{0} · 已達成 {1} 個里程碑"
],
[
"Next · {0}",
"下一個 · {0}"
],
[
"Imported {0} night{1:s}.",
"已匯入 {0} 次紀錄。"
],
[
"That didn't save: {0}",
"無法儲存：{0}"
],
[
"A CSV with four columns: {0}. Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.",
"CSV 檔需有四欄：{0}。日期格式如 2026-09-17，分數為 0 到 300 的整數，每次可以有一到三局。"
],
[
"{0} row{1:s} skipped",
"已略過 {0} 列"
],
[
"Row {0}",
"第 {0} 列"
],
[
"and {0} more",
"還有 {0} 列"
],
[
"{0} night{1:s} you already have",
"{0} 次已有紀錄"
],
[
", and {0} more",
"，還有 {0} 次"
],
[
"Keep mine, import the other {0}",
"保留我的，匯入其他 {0} 次"
],
[
"Import {0} night{1:s}",
"匯入 {0} 次"
],
[
"Frame-by-frame data included for {0}{1}{2} — confirming adds it to your shot history.",
"包含 {0} 局的逐格資料——確認後會加入你的投球紀錄。"
],
[
"Join {0}?",
"要加入 {0} 嗎？"
],
[
"You were added to the roster as {0}{1}. Teammates will be able to import your scores from a scorecard photo — you still confirm them.",
"你已以 {0} 的身分加入隊員名單{1}。之後隊友可以從計分表照片匯入你的分數——但仍需由你確認。"
],
[
", position {0}",
"，出場順序第 {0} 位"
],
[
"Team {0}",
"球隊{0}"
],
[
"{0} night{1:s} imported by a teammate.",
"隊友匯入了 {0} 次的分數。"
],
[
"{0}-{1} open",
"{0}-{1} 失誤"
],
[
"Spare: {0}",
"補中：{0}"
],
[
"Game {0}{1}",
"第 {0} 局{1}"
],
[
"⚠️ {0} fill ball{1:s} below couldn't be reliably read from the image -- please double-check the pin count.",
"⚠️ 下方有 {0} 個加球無法從圖片中準確讀取——請再確認一次擊倒瓶數。"
],
[
"Frame {0}{1}{2}",
"第 {0} 格{1}{2}"
],
[
"These images come to about {0}MB, which is too much to send at once. Remove one and try again — images are sent at full quality, so fewer is better than smaller.",
"這些圖片合計約 {0}MB，一次傳送太大了。請移除一張再試——圖片會以原始畫質傳送，所以張數少比檔案小更有用。"
],
[
"retried on {0}",
""
],
[
"(Already retried {0} time{1:s}.)",
"（已重試 {0} 次。）"
],
[
"Your images are still selected, so just tap {0} again in a minute.{1}",
"你的圖片仍保持選取，過一分鐘再點一次「{0}」就好。{1}"
],
[
"bowlerCount={0}",
""
],
[
"hasFrameDetail={0}",
""
],
[
"extracted {0} game(s)",
""
],
[
"-> {0} bowler(s) -> {1} for review",
""
],
[
"Shots already exist for Game {0} on {1}.",
"{1} 的第 {0} 局已有投球紀錄。"
],
[
"{0} game score{1:s}",
"{0} 局分數"
],
[
"Sent {0} their scores to confirm.",
"已將分數傳給 {0} 確認。"
],
[
"Imported {0}{1} -- check the Results, then save the night.",
"已匯入 {0}{1}——請先檢查「結果」，再儲存這次的紀錄。"
],
[
"Scorecard Screenshot{0:s}",
"計分表截圖"
],
[
"Scorecard {0}",
"計分表 {0}"
],
[
"Remove scorecard {0}",
"移除計分表 {0}"
],
[
"Clear all {0} image{1:s}",
"清除全部 {0} 張圖片"
],
[
"{0} images ({1}MB, full quality) — reading these can take a few minutes.",
"{0} 張圖片（{1}MB，原始畫質）——讀取可能需要幾分鐘。"
],
[
"Reading a scorecard can take a minute or two. ({0}MB, full quality.)",
"讀取一張計分表可能需要一兩分鐘。（{0}MB，原始畫質。）"
],
[
"Working through {0} images. This can take a few minutes — every frame is read individually.",
"正在處理 {0} 張圖片，可能需要幾分鐘——每一格都會逐一讀取。"
],
[
"{0} bowler{1:s} read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.",
"從計分表讀出 {0} 位球友。儲存前請逐一確認——配錯人會把一個人的分數寫進另一個人的紀錄。"
],
[
"Column {0}",
"第 {0} 欄"
],
[
"{0} game{1:s} · {2}{3}{4}",
"{0} 局 · {2}{3}{4}"
],
[
"Games add to {0} but the card's scratch series is {1}. One of the games was misread — check the card.",
"各局加總為 {0}，但計分表上的不讓分系列總分是 {1}。有一局讀錯了——請核對計分表。"
],
[
"Add \"{0}\" as a new bowler",
"將「{0}」新增為新球友"
],
[
"Closest match: {0}",
"最相符：{0}"
],
[
"Matched on the alias \"{0}\".",
"已依別名「{0}」比對。"
],
[
"Card order: {0}",
"計分表順序：{0}"
],
[
"check the {0} below, correct anything that's wrong, then save.",
"請檢查下方的 {0}，有錯的地方就修正，然後儲存。"
],
[
"{0} game scores",
"{0} 局分數"
],
[
"These go to {0} to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.",
"這些分數會傳給{0}確認。分數會立即計入——確認只是把它們標記為已核對。傳送前請修正讀錯的地方。"
],
[
"read as \"{0}\"",
"辨識為「{0}」"
],
[
"Game{0:s} {1} couldn't be read — type the real score, or clear the box if they didn't bowl it.",
"第 {1} 局無法讀取——請輸入實際分數；如果這位球友沒打這局，就把欄位清空。"
],
[
"Series {0}{1}",
"系列總分 {0}{1}"
],
[
"· card printed {0}",
"· 計分表上為 {0}"
],
[
"Save & Send To {0} Teammate{1:s}",
"儲存並傳送給 {0} 位隊友"
],
[
"{0} games. Only statistics with enough data to be meaningful are analysed.",
"{0} 局。只分析資料量足以得出有意義結果的統計。"
],
[
"{0} of {1} · ~{2} more {3}",
"{0}/{1} · 約再 {2} 局"
],
[
"You're close on {0} — a couple more nights and it unlocks.",
"{0} 即將解鎖——再打兩三次就會開放。"
],
[
"{0} more {1} to go.",
"再打 {0} 局就能開始分析。"
],
[
"Insights need at least {0} games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.",
"分析至少需要 {0} 局。局數不夠時，每次打球的數字起伏太大，說不出什麼可靠的結論——你會看到聽起來很有把握、其實只是雜訊的規律。"
],
[
"You have {0} games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.",
"你已記錄 {0} 局。目前還沒有任何項目的資料足以做出可靠的分析——以下是最接近的項目。"
],
[
"{0} more {1}",
"還差 {0}（{1}）"
],
[
"Based on {0} games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.",
"目前根據 {0} 局的資料。記錄越多，分析就越準確——打幾次只能看出端倪，打完一個賽季才有足以採取行動的依據。"
],
[
"You're working with {0} — worth talking this through with them before changing anything. They can see what these numbers can't.",
"你目前跟著 {0} 練球——做任何調整之前，值得先和教練好好討論。這些數字看不到的，教練看得到。"
],
[
"· {0} of {1}",
"· {0}/{1}"
],
[
"Nothing matches “{0}”{1}.",
"{1}沒有符合「{0}」的內容。"
],
[
"On the road since {0}",
"自 {0}起踏上旅程"
],
[
"{0} Badges",
"{0} 徽章"
],
[
"The free plan follows this league.{0} Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.",
"免費方案只記錄這個聯賽。{0}切換聯賽或打一個以上的聯賽是 Pro 的功能——訂閱後，你記錄的所有內容都會回來。"
],
[
"Paused: {0}.",
"已暫停：{0}。"
],
[
"Paused: {0}. Practice and Just Bowling stay open either way.",
"已暫停：{0}。無論如何，練習和自由打都可以照常使用。"
],
[
"Saved. {0} is your active league.",
"已儲存。{0} 是你使用中的聯賽。"
],
[
"{0} · {1} games",
"{0} · {1} 局"
],
[
"vs your {0} overall{1}{2} game{3:s}",
"對比整體平均 {0} 分{1}{2} 局"
],
[
"{0} {1} more",
"{0} 還有 {1} 項"
],
[
"Lane diagram, {0} of {1} balls shown",
"球道示意圖，顯示 {1} 顆球中的 {0} 顆"
],
[
"breakpoint {0}′",
"轉折點 {0}′"
],
[
"{0} shots around {1}",
"{1}前後共 {0} 球"
],
[
", across {0} nights",
"，共 {0} 次"
],
[
"{0} made of {1}",
"{1} 次中補中 {0} 次"
],
[
"{0} missed of {1}",
"{1} 次中沒補中 {0} 次"
],
[
"Show all {0}",
"顯示全部 {0} 項"
],
[
"{0} of 4 points",
"{0}/4 積分"
],
[
"{0} — tonight",
"{0}——今天的成績"
],
[
"{0}'s night",
"{0} 今天的成績"
],
[
"G{0} Theory",
"G{0} 理論"
],
[
"▼ {0} pins left on the lane",
"▼ {0} 瓶留在球道上"
],
[
"({0} actual vs {1} possible)",
"（實際 {0} 分，理論上可達 {1} 分）"
],
[
"Tap the ones you're in. Buy-ins are saved for {0} — you won't need to enter them again.",
"點選你有參加的項目。報名費會記在 {0}——之後不用再輸入。"
],
[
"{0} game{1:s} tonight · {2} paid in",
"今天 {0} 局 · 投入金額 {2}"
],
[
"All nine struck — you took it{0}.",
"指定的九格全倒——你拿下了彩池{0}。"
],
[
"{0} paid in — {1} {2} on the night.",
"投入金額 {0}——今天淨額{1} {2}。"
],
[
"Counts for {0}. Bowled today — change the date above if that's the wrong week.",
"計入 {0}。實際打球日是今天——如果週次不對，請在上方更改日期。"
],
[
"Lanes {0} & {1}",
"第 {0}、{1} 球道"
],
[
"Lane {0}",
"第 {0} 球道"
],
[
"Pattern name (e.g. {0})",
"油型名稱（例如：{0}）"
],
[
"Game {0} score",
"第 {0} 局分數"
],
[
"{0} frames say {1}",
"{0} 計分格算出 {1}"
],
[
"Frames say {0} — tap to use them",
"計分格算出 {0} 分——點一下改用這個分數"
],
[
"Delete game {0}",
"刪除第 {0} 局"
],
[
"Game {0} surface",
"第 {0} 局表面處理"
],
[
"Delete game {0}? This removes the score{1}. It can't be undone.",
"要刪除第 {0} 局嗎？這會刪除分數{1}，且無法復原。"
],
[
"Shot Context{0}",
"投球資訊{0}"
],
[
"10th Frame{0}",
"第 10 格{0}"
],
[
"Ball {0}",
"第 {0} 球"
],
[
"frame {0}{1} of game {2}",
"第 {2} 局第 {0} 格{1}"
],
[
", ball {0}",
"的第 {0} 球"
],
[
"Delete {0}? This cannot be undone.",
"要刪除{0}嗎？此動作無法復原。"
],
[
"Clearing the result deletes {0}. Delete it?",
"清除結果會刪除{0}。要刪除嗎？"
],
[
"Leave: {0}{1}",
"殘瓶：{0}{1}"
],
[
"· First ball: {0}",
"· 第一球：{0}"
],
[
"Delete game {0} for everyone?{1}",
"要刪除所有人的第 {0} 局嗎？{1}"
],
[
"{0}, game {1}",
"{0}，第 {1} 局"
],
[
"Switched from {0} to {1} — why?",
"從 {0} 換成 {1}——為什麼換？"
],
[
"Line{0}",
"路線{0}"
],
[
"· Lane {0}",
"· 第 {0} 球道"
],
[
"{0} board{1:s} {2} of target",
"比目標偏{2} {0} 板"
],
[
"{0} of {1} first balls struck{2}{3}{4}",
"{1} 次第一球中打出 {0} 次全倒{2}{3}。"
],
[
", {0} of {1} spares made",
"，{1} 次補中機會補中 {0} 次"
],
[
", {0} split{1:s}",
"，{0} 次技術球"
],
[
"Best carry tonight: {0} {1} {2}%{3}over {4} first balls",
"今天帶瓶最好的球：{0} {1} {2}%{3}（{4} 次第一球）"
],
[
"✓ {0} Saved",
"✓ {0}已儲存"
],
[
"Save & Finish {0}",
"儲存並結束{0}"
],
[
"End {0} & View Results",
"結束{0}並查看結果"
],
[
"nightcap:{0}|{1}|{2}|{3}",
""
],
[
"There are {0} things worth saying about tonight.",
"今天有 {0} 件值得一提的事。"
],
[
"{0} things were true about tonight. Here are the two or three worth hearing.",
"今天的紀錄裡有 {0} 件事實，以下挑出最值得一聽的兩三件。"
],
[
"{0} first balls across {1} game{2:s}{3}",
"{1} 局共 {0} 次第一球{3}"
],
[
", against {0} earlier nights in this league.",
"，並與這個聯賽先前 {0} 次的紀錄比較。"
],
[
"Your current book average is {0}.",
"你目前的官方平均是 {0}。"
],
[
"Update to {0}",
"更新為 {0}"
],
[
"{0}-handed{1} · {2}",
"{0}手{1} · {2}"
],
[
"A backup ball goes out to the {0} and hooks back, so your corner pin is the {1} and your pocket is the {2}. Turning this on flips every leave, split and lane drawing to match — you are still{3}-handed everywhere it says so.",
"反曲球會先往{0}邊出去再勾回來，所以你的角瓶是 {1} 號瓶，Pocket 在 {2} 號瓶之間。開啟後，所有殘瓶、技術球和球道圖都會跟著左右翻轉——但凡是標示慣用手的地方，你仍然是{3}手。"
],
[
"Normal {0}-hand hook",
"一般{0}手曲球"
],
[
"{0} season wrapped up",
"{0} 的賽季已結束"
],
[
"Not enough games logged here yet to suggest a new number{0}. You can still update it yourself below, or skip for now.",
"這裡記錄的局數還不夠，無法建議新的數字{0}。你仍然可以在下方自行更新，或先略過。"
],
[
"{0}Free fall · {1} game{2:s}",
"{0}自由落瓶式 · {1} 局"
],
[
"{0}String · {1} game{2:s}",
"{0}繩索式 · {1} 局"
],
[
"{0}{1}{2} on string",
"繩索式 {0}{1}{2}"
],
[
"{0}-pins left",
"留下 {0} 號瓶"
],
[
"{0}: how often each pin was left standing",
"{0}：每支球瓶殘留的頻率"
],
[
"{0}-pin left {1}% of first balls",
"{0} 號瓶殘留：第一球的 {1}%"
],
[
"{0}{1} described",
"{0}已描述 {1} 次"
],
[
"{0}% strikes ·",
"全倒率 {0}% ·"
],
[
"((100% - {0}px) / {1})",
""
],
[
", running {0}",
"，累計 {0} 分"
],
[
"· ball {0}",
"· 第 {0} 球"
],
[
"Showing {0} of {1}, newest first.",
"顯示 {1} 次中的 {0} 次，最新的在前。"
],
[
"{0} ten pins",
"10 號瓶殘瓶 {0} 次"
],
[
"{0} splits",
"技術球 {0} 次"
],
[
"Load {0} More",
"再載入 {0} 筆"
],
[
"{0} avg",
"平均 {0}"
],
[
"{0} pins between {1} bowler{2:s}{3}",
"{1} 位球友共擊倒 {0} 瓶{3}"
],
[
"{0}{1} on my average",
"比我的平均 {0}{1}"
],
[
"{0} more to {1} tester mode",
"再點 {0} 下即可{1}測試人員模式"
],
[
"Other bowlers have a “{0}” too",
"其他球友也有名為「{0}」的聯賽"
],
[
"“{0}” is already here",
"「{0}」已有人建立"
],
[
"{0} to {1} · {2} night{3:s}, {4} game{5:s}",
"{0} 至 {1} · {2} 次，{4} 局"
],
[
"Usually {0}s",
"通常在{0}"
],
[
"Bowls on {0}s",
"固定在{0}打球"
],
[
"{0} team{1:s} in this league",
"這個聯賽有 {0} 支球隊"
],
[
"sessions-{0}.csv",
"打球紀錄-{0}.csv"
],
[
"shots-{0}.csv",
"投球紀錄-{0}.csv"
],
[
"bowling-backup-{0}.json",
"保齡球備份-{0}.json"
],
[
"You have {0} change{1:s} still waiting to save. {2} will be sent first.",
"你有 {0} 項變更還在等待儲存，{0|這項變更|這些變更}會優先送出。"
],
[
"Signed in as {0}.",
"登入身分：{0}。"
],
[
"{0} change{1:s} {2} not reached the cloud yet.",
"有 {0} 項變更尚未同步到雲端。"
],
[
"Signing out now may lose {0}. Sign out anyway?",
"現在登出可能會遺失這些變更。仍要登出嗎？"
],
[
"{0} is published by My Bowling Journey LLC.",
"{0} 由 My Bowling Journey LLC 發行。"
],
[
"Version {0}",
"版本 {0}"
],
[
"{0} day{1:s} left in your trial",
"試用期還剩 {0} 天"
],
[
"mbj-share-{0}.png",
""
],
[
"Share {0}",
"分享「{0}」"
],
[
"{0} Team",
"{0} 球隊"
],
[
"Select {0} above",
"請在上方選擇{0}"
],
[
"Select {0} or {1} above",
"請在上方選擇{0}或{1}"
],
[
"{0} (you)",
"{0}（你）"
],
[
"Every rate stat side by side against {0}, instead of hunting through separate cards. Split Rate is the one metric here where lower is better.",
"把每項比率統計和{0}並排比較，不用在各張卡片之間翻找。技術球率是這裡唯一越低越好的指標。"
],
[
"{0} to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.",
"{0}即可查看——單局和系列最高分需要一份明確的隊員名單，因為把人數不同的球隊合在一起，會對人數較多的一方不公平。"
],
[
"{0}'s Records",
"{0} 的最佳紀錄"
],
[
", game {0}",
"，第 {0} 局"
],
[
"{0} season record",
"{0} 賽季戰績"
],
[
"{0}-{1} on games, {2}-{3} on pinfall.",
"以局計 {0}-{1}，以擊倒瓶數計 {2}-{3}。"
],
[
"{0}: {1}/{2} points ({3}-{4} games, {5}-{6} pinfall)",
"{0}：{1}/{2} 積分（以局計 {3}-{4}，以擊倒瓶數計 {5}-{6}）"
],
[
"{0} to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.",
"{0}即可查看——「球隊」必須指一份明確的隊員名單，而不是把好幾個聯賽的比賽混在一起。"
],
[
"Smaller handicap (avg {0})",
"讓分較少（平均 {0}）"
],
[
"Larger handicap (avg {0})",
"讓分較多（平均 {0}）"
],
[
"{0}% stk",
"全倒 {0}%"
],
[
"{0} shots",
"{0} 球"
],
[
"{0} to see this — it needs a specific roster to know who's on top.",
"{0}即可查看——需要一份明確的隊員名單，才知道誰領先。"
],
[
"{0}wk{1:s} on top",
"{0} 週居首"
],
[
"{0}/{1} games",
"{0}/{1} 局"
],
[
"{0} to see this — it needs a specific roster to know who else was bowling that frame.",
"{0}即可查看——需要一份明確的隊員名單，才知道那一格還有誰在打。"
],
[
"{0} of {1} frames with no open.",
"{1} 格中有 {0} 格沒有失誤。"
],
[
"Frames {0}",
"第 {0} 格"
],
[
"Frame {0}",
"第 {0} 格"
],
[
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where {0} tends to leave pins, regardless of which game it is.",
"依格數而不是依局數拆開來看——看看每次打球時，是否有某個固定時段（熱身、油況變化、第 9 格算分數分心的時候），{0}特別容易留下殘瓶，不管是第幾局。"
],
[
"⚠️ Only {0} game{1:s} logged — each frame number needs at least {2} to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.",
"⚠️ 目前只記錄了 {0} 局——每一格至少要有 {2} 局，才能分辨真正的模式和雜訊。在那之前，請把這當作預覽，而不是結論。"
],
[
"Frame {0} (n={1})",
"第 {0} 格（n={1}）"
],
[
"Weakest: {0} ({1}) · Strongest: {2} ({3})",
"最弱：{0}（{1}）· 最強：{2}（{3}）"
],
[
"{0} {1} vs {2}",
"{0} {1} vs {2}"
],
[
"Across {0} fresh racks.",
"共 {0} 次滿瓶投球。"
],
[
"Across {0} non-strike balls.",
"共 {0} 球沒有全倒。"
],
[
"{0} of {1} made. You leave a ten on {2}% of first balls.",
"{1} 次中補中 {0} 次。你的第一球有 {2}% 會留下 10 號瓶。"
],
[
"{0} of {1} made. Any leave with exactly one pin standing — 7, 4, 8, 10, or any other.",
"{1} 次中補中 {0} 次。只剩一支球瓶的殘瓶都算在內——7、4、8、10 號瓶或其他任何一支。"
],
[
"{0} split{1:s} left, {2}% of your first balls.",
"留下 {0} 次技術球，占你第一球的 {2}%。"
],
[
"{0} to see who owes a round.",
"{0}，就能看到誰該請大家喝一輪。"
],
[
"{0} more shots needed",
"還需要 {0} 球"
],
[
"Strike {0}%",
"全倒 {0}%"
],
[
"1st ball {0}",
"第一球 {0}"
],
[
"Split {0}%",
"技術球 {0}%"
],
[
"Across {0} games.",
"共 {0} 局。"
],
[
"Tracked in 5-pin steps{0}.",
"以每 5 分為一級追蹤{0}。"
],
[
"({0}% to {1})",
"（{0}%，目標 {1}）"
],
[
"Next Session ({0} Games)",
"下次打球（{0} 局）"
],
[
"You're averaging {0} across {1} games. Here's what the next set does to it.",
"目前平均 {0}，共 {1} 局。以下是下一個系列對平均的影響。"
],
[
"To reach {0}",
"要達到 {0}"
],
[
"Drops to {0} at or below",
"總分不高於此數即降至 {0}"
],
[
"under {0}/game",
"每局低於 {0}"
],
[
"Across {0} {1}, ranging {2}–{3}.",
"共 {0} {1}，範圍 {2}–{3}。"
],
[
"Composite average at each position in the night, across the whole season — shows whether {0} bowling better early, middle, or late.{1}",
"整個賽季中，依當天第幾局計算的綜合平均——看出{0}在前段、中段還是後段打得比較好。{1}"
],
[
"Game {0}",
"第 {0} 局"
],
[
"Team: {0}",
"球隊：{0}"
],
[
"{0} paid in — {1} {2} overall.",
"投入金額 {0}——累計{1} {2}。"
],
[
"{0} win{1:s} and {2} jackpot{3:s}.",
"贏得彩池 {0} 次，累積彩池 {2} 次。"
],
[
"{0} games",
"{0} 局"
],
[
"High {0}",
"最高 {0}"
],
[
"Unhide Stat Cards ({0})",
"顯示隱藏的統計卡（{0}）"
],
[
"{0}{1}Manage or cancel any time in the Play Store app, under Subscriptions.",
"{0}{1}你隨時可以在 Play 商店應用程式的「訂閱項目」中管理或取消訂閱。"
],
[
"Your {0}-day free trial has started, and everything is unlocked.",
"你的 {0} 天免費試用已經開始，所有功能都已解鎖。"
],
[
"You cancelled, so this ends{0}. Everything stays unlocked until then, and you can start it again any time before it ends.",
"你已取消訂閱，因此會在{0}結束。在那之前所有功能都維持解鎖，結束前也隨時可以重新訂閱。"
],
[
"(free keeps {0})",
"（免費方案限 {0} 個）"
],
[
"Yearly · {0}",
"年繳 · {0}"
],
[
"Monthly · {0}",
"月繳 · {0}"
],
[
"Start your {0}-day free trial",
"開始 {0} 天免費試用"
],
[
"Subscribe · {0}/{1}",
"訂閱 · {0}/{1}"
],
[
"{0}{1}Cancel any time{2}{3}— you keep Pro until the end of the period you have paid for.",
"{0}{1}隨時都能取消（{2}）{3}——在你已付費的期間結束前，都能繼續使用 Pro。"
],
[
"Hint: {0}",
"提示：{0}"
],
[
"Details: {0}",
"詳細資訊：{0}"
],
[
"mbj.statsTab.{0}",
""
],
[
".{0} > div { border: none !important; background: transparent !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; } .{1} > div > div:first-child[style*=\"letter-spacing: 0.01em\"] { display: none; }",
""
],
[
"You're on {0} in {1}. Joining {2} takes you off {3}'s roster. Your scores stay yours.",
"你目前在 {1} 的 {0}。加入 {2} 後，你會離開 {3} 的隊員名單。你的分數仍然屬於你。"
],
[
"You're on {0}{1}.{2}",
"你已加入 {0}{1}。{2}"
],
[
"You're off {0}.",
"你已離開 {0}。"
],
[
"You're on {0} in this league. If {1} approves you, you'll be taken off {2}'s roster. Your scores stay yours.",
"你目前在這個聯賽的 {0}。如果 {1} 核准你，你會離開 {2} 的隊員名單。你的分數仍然屬於你。"
],
[
"Delete \"{0}\"? This removes the team and its roster, but does not delete any bowler accounts.",
"要刪除「{0}」嗎？這會移除球隊和隊員名單，但不會刪除任何球友的帳號。"
],
[
"{0}approving moves them off {1}",
"{0}核准後，對方會離開 {1}"
],
[
"You're invited to {0}",
"你受邀加入 {0}"
],
[
"Asked to join {0} — waiting for someone on the team to approve.",
"已申請加入 {0}——等待球隊成員核准。"
],
[
"Join our team on {0} — sign up and enter code {1}",
"來 {0} 加入我們的球隊——註冊後輸入代碼 {1}"
],
[
"{0} — invited, waiting for them to accept",
"{0}——已邀請，等待對方接受"
],
[
"{0}/{1} cuts",
"晉級 {0}/{1} 次"
],
[
"{0} Your history: {1} avg over {2} game{3:s}{4}",
"{0} 你的紀錄：{2} 局平均 {1}{4}"
],
[
"+ Save \"{0}\" for next time",
"+ 儲存「{0}」供下次使用"
],
[
"Day {0}",
"第 {0} 天"
],
[
"Go to scoring{0} {1}",
"前往輸入分數{0} {1}"
],
[
"g{0}:no-score",
""
],
[
"g{0}:already",
""
],
[
"{0} of {1}{2}{3} game{4:s}{5}.",
"{3} 局累計 {0} 分，晉級線 {1}{5}。"
],
[
"Go to {0} {1}",
"前往{0} {1}"
],
[
"This block{0}s frames are logged under {1}, not {2}.",
"這一輪的計分格記錄在 {1}，而不是 {2}。"
],
[
"Move them to {0}",
"移到 {0}"
],
[
"Remove game {0}",
"移除第 {0} 局"
],
[
"With hcp ({0}g)",
"含讓分（{0} 局）"
],
[
"Total ({0}g)",
"總分（{0} 局）"
],
[
"{0} Brackets & Side Pots",
"{0} 對戰籤表和彩池"
],
[
"{0} paid in — {1} {2} on side action.",
"投入金額 {0}——場邊彩池{1} {2}。"
],
[
"{0} Match Play",
"{0} 對戰賽"
],
[
"Match {0}{1}{2}",
"第 {0} 場{1}{2}"
],
[
"by {0}",
"相差 {0} 分"
],
[
"Go to the stepladder {0}",
"前往階梯賽 {0}"
],
[
"{0} Stepladder",
"{0} 階梯賽"
],
[
"Step {0}{1}{2}",
"第 {0} 關{1}{2}"
],
[
"Squad {0}",
"梯次 {0}"
],
[
"Block {0}",
"第 {0} 輪"
],
[
"{0} average over {1} game{2:s}{3}{4}",
"{1} 局平均 {0}{3}{4}"
],
[
"· on to {0}",
"· 下一階段：{0}"
],
[
"Match {0}{1}",
"第 {0} 場{1}"
],
[
"{0} average over {1} match{2:s}{3}{4}",
"{1} 場平均 {0}{3}{4}"
],
[
"· {0} scratch",
"· 不讓分 {0}"
],
[
"Best: match {0} by {1}{2}",
"最大勝場：第 {0} 場{2}，贏 {1} 分"
],
[
"Worst: match {0} by {1}{2}",
"最大敗場：第 {0} 場{2}，輸 {1} 分"
],
[
"On to {0}.",
"下一階段：{0}。"
],
[
"Seeded {0}.",
"你是{0}種子。"
],
[
"You bowl frames {0}{1}. The score stays out of your average since you did not bowl it alone, but your own frames still count.",
"你負責第 {0} 格{1}。這局不是你獨自打的，所以分數不計入你的平均，但你自己打的格仍會列入統計。"
],
[
"The stepladder says {0} — {1}",
"依階梯賽結果應為{0}——{1}"
],
[
"{0}{1} net",
"淨輸贏 {0}{1}"
],
[
"({0} game{1:s})",
"（{0} 局）"
],
[
"{0} scratch · {1} handicap pins",
"不讓分 {0} · 讓分 {1} 分"
],
[
"0.5px solid {0}",
""
],
[
"Go to match play {0}",
"前往對戰賽 {0}"
],
[
"I{0}m bowling",
"我在打球"
],
[
"I{0}m coaching",
"我在指導"
],
[
"{0} Sam Ortiz",
"{0} Sam Ortiz"
],
[
"How much data it{0}s built on, beside it",
"旁邊會標出這是根據多少資料算出來的"
],
[
"Leave the target off if it isn{0}t a number",
"目標不是數字的話，就留空"
],
[
"Target 60% {0} due 1 Apr",
"目標 60% {0} 4 月 1 日到期"
],
[
"{0} games{1} ·{2}averaging {3} · high {4}, low {5}. The spread is {6} pins — that's what a nightly average hides.",
"{0} 局{1} ·{2}平均 {3} · 最高 {4}、最低 {5}。分數落差 {6} 分——這正是每次的平均看不出來的地方。"
],
[
"Last {0}",
"最近 {0} 局"
],
[
"Last {0} days",
"最近 {0} 天"
],
[
"Nights here average {0} attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.",
"這裡每次平均只有 {0} 次嘗試，樣本偏少——即使你的打法完全沒變，個別的點也會大幅起伏。"
],
[
"Free trial — {0} {1} left",
"免費試用——剩下 {0} 天"
],
[
"Your subscription starts {0}.",
"你的訂閱將於 {0} 開始。"
],
[
"You are on the monthly plan. The yearly plan is {0} and works out cheaper — switch any time.",
"你目前使用月繳方案。年繳方案只要 {0}，算下來更划算——隨時都能切換。"
],
[
"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Crect width='34' height='34' rx='9' fill='{0}' fill-opacity='0.13'/%3E%3Cpath d='M11 14l6 6 6-6' fill='none' stroke='{1}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
""
],
[
"Pin {0}",
"{0} 號瓶"
],
[
"{0} was {1} by AI. It can be confidently wrong — {2}.",
"{0}是 AI 產生的內容，可能說得頭頭是道卻是錯的——{2}。"
],
[
"⟨0⟩ wants to be your {0}.",
"⟨0⟩ 想以{0}身分與你連結。"
],
[
"Avg {0} ⟨0⟩ · {1}g",
"平均 {0} ⟨0⟩ · {1} 局"
],
[
"{0} won⟨0⟩{1} in",
"贏得 {0}⟨0⟩投入 {1}"
],
[
"Suggested new book average: ⟨0⟩ — {0}.{1} Change the number below if this doesn't match your full season.",
"建議的新官方平均：⟨0⟩——{0}。{1}如果這和你整個賽季的成績不符，請修改下方的數字。"
],
[
"{0} avg ⟨0⟩",
"平均 {0} ⟨0⟩"
],
[
"You — {0}/{1} ⟨0⟩",
"你 — {0}/{1} ⟨0⟩"
],
[
"{0} — {1}{2} attempts ⟨0⟩",
"{0} — {1}{2} 次 ⟨0⟩"
],
[
"{0} — {1}, {2} attempts ⟨0⟩",
"{0} — {1}，{2} 次 ⟨0⟩"
],
[
"We sent a {0}-digit code to ⟨0⟩.",
"我們已將 {0} 位數驗證碼寄到 ⟨0⟩。"
],
[
"⟨0⟩ wants to join {0}",
"⟨0⟩ 申請加入 {0}"
],
[
"Cost {0} · ⟨0⟩",
"費用 {0} · ⟨0⟩"
],
[
"{0}% strikes",
"全倒率 {0}%"
],
[
"{0} described",
"已描述 {0} 次"
],
[
"The analysis service didn't respond properly ({0}). This is usually temporary — tap Try Again.",
"分析服務沒有正常回應（{0}）。這通常是暫時的——請點「再試一次」。"
],
[
"The lamp went quiet. Try again in a moment. (ref {0})",
"神燈沒反應了。請稍後再試一次。（參考編號 {0}）"
],
[
"Location search failed ({0}).",
"位置搜尋失敗（{0}）。"
],
[
"Unsupported image type: {0}",
"不支援的圖片格式：{0}"
],
[
"Couldn't pour the nightcap ({0}). Tap to try again.",
"沒能倒出 Nightcap（{0}）。點一下再試一次。"
],
[
"{0} {1} left today",
"今天還能問 {0} 題"
],
[
"{0} league{1:s}",
"{0} 個聯賽"
],
[
"{0} ball{1:s}",
"{0} 顆球"
],
[
"{0} bowler",
"{0} 人"
],
[
"{0} bowlers",
"{0} 人"
],
[
"{0} set",
"已設定 {0} 間"
],
[
"{0} available",
"{0} 個可用"
],
[
"{0} times",
"{0} 次"
],
[
"{0} view",
"{0}分頁"
],
[
"{0}: playing",
"{0}：參加"
],
[
"{0}: not playing",
"{0}：不參加"
],
[
"Frame {0}, {1}, running {2}",
"第 {0} 格，{1}，累計 {2} 分"
],
[
"Frame {0}, not bowled",
"第 {0} 格，尚未投球"
],
[
"Frame {0}, not bowled, running {1}",
"第 {0} 格，尚未投球，累計 {1} 分"
],
[
"Frame {0}, {1}",
"第 {0} 格，{1}"
],
[
"{0} pin{1:s} short",
"還差 {0} 分"
],
[
"best {0}",
"最佳 {0}"
],
[
"{0} of {1}",
"{0}/{1}"
],
[
"— {0}, {1}",
"— {0}，{1}"
],
[
"{0} series",
"系列 {0}"
],
[
"{0}: {1} series",
"{0}：系列 {1}"
],
[
"Delete {0}",
"刪除 {0}"
],
[
"nightcap:{0}|{1}|{2}|{3}{4}",
""
],
[
"{0} of {1} attempts",
"{0}/{1} 次"
],
[
"{0} of {1} attempt",
"{0}/{1} 次"
],
[
"{0} of {1} balls",
"{0}/{1} 顆球"
],
[
"{0} of {1} nights",
"{1} 次中 {0} 次"
],
[
"{0} of {1} games",
"{0}/{1} 局"
],
[
"{0}-{1} standing",
"剩下 {0}-{1} 號瓶"
],
[
"{0} standing",
"剩下 {0} 號瓶"
],
[
"▲ {0} more",
"▲ 還有 {0} 項"
],
[
"▼ {0} more",
"▼ 還有 {0} 項"
],
[
"{0} bag",
"{0} 個球袋"
],
[
"{0} bags",
"{0} 個球袋"
],
[
"{0} pin",
"{0} 號瓶"
],
[
"e.g. {0}",
"例如：{0}"
],
[
"{0}% converted",
"補中率 {0}%"
],
[
"Trending up about {0} pins across this stretch.",
"這段期間約上升了 {0} 分。"
],
[
"Trending down about {0} pins across this stretch.",
"這段期間約下降了 {0} 分。"
],
[
"Trending up about {0} points across this stretch.",
"這段期間約上升了 {0} 個百分點。"
],
[
"Trending down about {0} points across this stretch.",
"這段期間約下降了 {0} 個百分點。"
],
[
"Trending up about {0} across this stretch.",
"這段期間約上升了 {0}。"
],
[
"Trending down about {0} across this stretch.",
"這段期間約下降了 {0}。"
],
[
"{0} paid in — up {1} on the night.",
"投入金額 {0}——今天贏 {1}。"
],
[
"{0} paid in — down {1} on the night.",
"投入金額 {0}——今天輸 {1}。"
],
[
"{0} paid in — up {1} overall.",
"投入金額 {0}——累計贏 {1}。"
],
[
"{0} paid in — down {1} overall.",
"投入金額 {0}——累計輸 {1}。"
],
[
"{0} paid in — up {1} on side action.",
"投入金額 {0}——彩池和籤表贏 {1}。"
],
[
"{0} paid in — down {1} on side action.",
"投入金額 {0}——彩池和籤表輸 {1}。"
],
[
"Hide {0}",
"隱藏「{0}」"
],
[
"10-Pin {0}%",
"10 號瓶 {0}%"
],
[
"{0}% {1} pin",
"殘留 {1} 號瓶 {0}%"
],
[
"{0} (me)",
"{0}（我）"
],
[
"{0} ({1}g)",
"{0}（{1} 局）"
],
[
"Left: {0}",
"左：{0}"
],
[
"Right: {0}",
"右：{0}"
],
[
"Fast: {0}",
"太快：{0}"
],
[
"Slow: {0}",
"太慢：{0}"
],
[
"Execution: {0}",
"動作執行：{0}"
],
[
"Earned · {0}",
"已獲得 · {0}"
],
[
"Open results for {0} night, {1}",
"開啟 {1} 的結果"
],
[
"Game {0} ball",
"第 {0} 局用球"
],
[
"{0} max",
"最高可達 {0}"
],
[
"Your {0}-day free trial starts today. When it ends, the {1} plan starts at {2} and renews on its own until you cancel.",
"你的 {0} 天免費試用從今天開始。試用結束後，{1} 方案會以 {2} 開始計費，並自動續訂，直到你取消為止。"
],
[
"The {0} plan is {1}. Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.",
"{0} 方案為 {1}。確認之前，Google Play 會顯示你的帳號是否適用免費試用；之後會自動續訂，直到你取消為止。"
],
[
"The {0} plan is {1}.",
"{0} 方案為 {1}。"
],
[
"You have already had the free trial, so the {0} plan starts today at {1} and renews on its own until you cancel.",
"你已經用過免費試用，因此 {0} 方案會從今天開始以 {1} 計費，並自動續訂，直到你取消為止。"
],
[
"Ask {0}",
"問問 {0}"
],
[
"You've used all {0} questions today. Ask again tomorrow.",
"你今天的 {0} 個問題都用完了。明天再來問吧。"
],
[
"Ask {0} a question",
"向 {0} 提問"
],
[
"Brooklyn couldn't answer that. Try again in a moment. (ref {0})",
"Brooklyn 無法回答這個問題。請稍後再試一次。（參考編號 {0}）"
],
[
"Coach · {0}",
"教練 · {0}"
],
[
"{0} strips for {1} games",
""
],
[
"▸ Check frames · {0} flagged",
"▸ 檢查各格 · {0} 處待確認"
],
[
"image {0} matched no bowler",
""
],
[
"({0} settled by the printed total)",
""
],
[
"That sign-in link is for {0}, not the account you're signed in to. Sign out first if you meant to switch.",
"這個登入連結是給 {0} 用的，不是你目前登入的帳號。如果你想切換帳號，請先登出。"
],
[
"Sign in as {0}?",
"要以 {0} 登入嗎？"
],
[
"{0} (pending)",
"{0}（待確認）"
],
[
"rotate(-90 10 {0})",
"rotate(-90 10 {0})"
],
[
"{0}: no cover or core entered yet, so {1} be placed.",
"{0}：還沒輸入球皮或球心，所以無法放上圖表。"
],
[
"A big step down from {0} to {1}: a condition between them has no ball.",
"從 {0} 到 {1} 強度落差很大：介於兩者之間的球道狀況沒有球可用。"
],
[
"{0} and {1} sit almost on top of each other. They do the same job.",
"{0} 和 {1} 幾乎重疊，用途相同。"
],
[
"{0} A wider range means the bag covers more conditions.",
"{0}範圍越廣，代表這個球袋能應付越多種球道狀況。"
],
[
"In both bags: {0}.",
"兩個球袋都有：{0}。"
],
[
"In {0}",
"{0} 裡的球"
],
[
"From the catalog: {0}",
"型錄中可考慮：{0}"
],
[
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.{0}",
"Caddie 會看過你整個球袋——哪顆球適合哪種球道狀況、哪個球袋配得好、該添購什麼、什麼可以留在家。這是付費方案的功能。{0}"
],
[
"Reads {0}: what it's built for and what it's missing.",
"看過 {0}：它適合什麼狀況、還缺什麼。"
],
[
"{0} games · {1} avg{2}{3}{4}",
"{0} 局 · 平均 {1}{2}{3}{4}"
],
[
"· best {0}",
"· {0}最佳"
],
[
"· {0}% strikes",
"· 全倒率 {0}%"
],
[
"Surface: {0}{1}{2}Layout: {3}",
"表面處理：{0}{1}{2}鑽孔配置：{3}"
],
[
"Strength {0} · Length {1} · Back end {2}⟨0⟩",
"強度 {0} · 長度 {1} · 後段 {2}⟨0⟩"
],
[
"{0} games at {1}{2}.{3}",
"{0} 局平均 {1}{2}。{3}"
],
[
", against your {0} overall",
"，你的整體平均為 {0}"
],
[
"By part of the night: {0}.",
"各階段：{0}。"
],
[
"All {0} of your leagues",
"你的全部 {0} 個聯賽"
],
[
"Basic keeps {0} league active. The others are paused — nothing is deleted, and they come back when you do.",
"Basic 只保留 {0} 個聯賽為啟用狀態。其他的會暫停——不會刪除任何東西，等你回來，它們也會跟著回來。"
],
[
"All {0} of your teams",
"你的全部 {0} 支球隊"
],
[
"Basic keeps {0}.",
"Basic 保留 {0} 支。"
],
[
"Which of your {0} balls carries best, and how each one holds up from the first game to the last.",
"你的 {0} 顆球中哪一顆帶瓶最好，以及每一顆從第一局到最後一局能維持多好的表現。"
],
[
"Your read-back after every night — you've poured {0}.",
"每次打完後的回顧——你已經倒了 {0} 杯。"
],
[
"Answers about your own game — you've asked {0} question{1:s}.",
"關於你自己打法的解答——你已經問了 {0} 個問題。"
],
[
"The deep read of your game — you've run it {0} time{1:s}.",
"深入分析你的表現——你已經用了 {0} 次。"
],
[
"Your arsenal and bags, read ball by ball — {0} read{1:s} so far.",
"逐顆分析你的球具庫和球袋——目前已分析 {0} 次。"
],
[
"All {0} of your bags",
"你全部 {0} 個球袋"
],
[
"Basic keeps {0} league bag and {1} tournament bag.",
"Basic 只保留 {0} 個聯賽球袋和 {1} 個比賽球袋。"
],
[
"How you score at each of the {0} centers you've bowled.",
"你在打過的 {0} 間保齡球館各自的分數表現。"
],
[
"for {0}/month",
"（每月 {0}）"
],
[
"You've logged {0} games with your {1}!",
"你已經用 {1} 記錄了 {0} 局！"
],
[
"To keep seeing how it stacks up against the rest of your bag — which ball carries, and when — keep Pro{0}.",
"想繼續看它和球袋裡其他球比起來如何——哪顆球帶瓶好、什麼時候好——就繼續使用 Pro{0}。"
],
[
"You've poured {0} Nightcaps!",
"你已經倒了 {0} 杯 Nightcap！"
],
[
"To keep getting one after every night, keep Pro{0}.",
"想在每次打完後繼續收到一杯，就繼續使用 Pro{0}。"
],
[
"You're tracking {0} leagues!",
"你正在記錄 {0} 個聯賽！"
],
[
"To keep all of them active, keep Pro{0}.",
"想讓它們全部保持啟用，就繼續使用 Pro{0}。"
],
[
"You've logged {0} games in your first 60 days!",
"你在最初 60 天內記錄了 {0} 局！"
],
[
"To keep the comparisons and the AI reads of your game, keep Pro{0}.",
"想繼續使用比較功能和 AI 對你打法的分析，就繼續使用 Pro{0}。"
],
[
"Keep everything unlocked{0}, or carry on with Basic — your scores and stats stay free.",
"保留所有已解鎖的功能{0}，或繼續使用 Basic——你的分數和統計仍然免費。"
],
[
"Your Pro trial ends in {0} day{1:s}",
"你的 Pro 免費試用將在 {0} 天後結束"
],
[
"Keep Pro · {0}/month",
"繼續使用 Pro · {0}/月"
],
[
"Or {0}/year",
"或 {0}/年"
],
[
"Pro trial — {0} day{1:s} left. No card on file; nothing is charged when it ends.",
"Pro 試用——還剩 {0} 天。你沒有綁定信用卡，試用結束時不會收費。"
],
[
"Thanks for subscribing. Everything is unlocked.{0}Manage or cancel any time in the Play Store app, under Subscriptions.",
"感謝你的訂閱，所有功能都已解鎖。{0}你隨時可以在 Play 商店應用程式的「訂閱項目」中管理或取消訂閱。"
],
[
"You have Pro free for {0} more day{1:s}. Subscribing now starts billing today; you can also wait, and we'll ask when your trial ends.",
"你的 Pro 免費試用還剩 {0} 天。現在訂閱會從今天開始計費；你也可以先等等，試用結束時我們會再問你。"
],
[
"⟨0⟩ {0} · {1} shots",
"⟨0⟩ {0} · {1} 球"
],
[
"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{0}\" height=\"{1}\">",
""
],
[
"<foreignObject x=\"0\" y=\"0\" width=\"100%\" height=\"100%\">{0}</foreignObject></svg>",
""
],
[
"data:image/svg+xml;charset=utf-8,{0}",
""
],
[
"You cancelled, so this ends on {0}. Everything stays unlocked until then, and you can start it again any time before it ends.",
"你已取消訂閱，因此會在 {0} 結束。在那之前所有功能都維持解鎖，結束前也隨時可以重新訂閱。"
],
[
"Finished {0}.",
"最終拿下{0}。"
],
[
"Finished {0} to the {1} seed.",
"輸給{1}種子，最終拿下{0}。"
],
[
"Finished {0} to {1}.",
"輸給 {1}，最終拿下{0}。"
],
[
"{0} step{1:s} won, still climbing.",
"已贏 {0} 關，還在往上爬。"
],
[
"{0} board{1:s} left of target",
"比目標偏左 {0} 板"
],
[
"{0} board{1:s} right of target",
"比目標偏右 {0} 板"
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.",
"{0} 已獲得 {1}{2} 枚徽章——{4}。"
],
[
"{0} earned a badge tonight — {1}.",
"{0} 今天獲得了一枚徽章——{1}。"
],
[
"{0} earned {1} badges tonight — {2}.",
"{0} 今天獲得了 {1} 枚徽章——{2}。"
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.\n\nKeep them: {5}",
"{0} 已獲得 {1}{2} 枚徽章——{4}。\n\n保留徽章：{5}"
],
[
"{0} earned a badge tonight — {1}.\n\nKeep them: {2}",
"{0} 今天獲得了一枚徽章——{1}。\n\n保留徽章：{2}"
],
[
"{0} earned {1} badges tonight — {2}.\n\nKeep them: {3}",
"{0} 今天獲得了 {1} 枚徽章——{2}。\n\n保留徽章：{3}"
],
[
"{0}-{1} over {2} match{3:s} · {4} with bonus",
"{2} 場戰績 {0}-{1} · 含獎勵分 {4}"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} with bonus",
"{3} 場戰績 {0}-{1}-{2} · 含獎勵分 {5}"
],
[
"{0}-{1} over {2} match{3:s} · {4} average · {5} with bonus",
"{2} 場戰績 {0}-{1} · 平均 {4} · 含獎勵分 {5}"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} average · {6} with bonus",
"{3} 場戰績 {0}-{1}-{2} · 平均 {5} · 含獎勵分 {6}"
],
[
"{0} seed · {1} of {2} step{3:s} won · finished {4}",
"{0} 種子 · {2} 關中贏了 {1} 關 · 最終拿下{4}"
],
[
"{0} seed · {1} of {2} step{3:s} won",
"{0} 種子 · {2} 關中贏了 {1} 關"
],
[
"{0} of {1} step{2:s} won · finished {3}",
"{1} 關中贏了 {0} 關 · 最終拿下{3}"
],
[
"Your average is up {0} pin{1:s} on last season — {2}.",
"你的平均比上個賽季提高了 {0} 分——{2}。"
],
[
"Your average is down {0} pin{1:s} on last season — {2}.",
"你的平均比上個賽季下降了 {0} 分——{2}。"
],
[
"{0} bowled {1} for {2} at {3} on {4}: {5}.",
"{0} {4}在 {3} 打了 {2} 局，總分 {1}：{5}。"
],
[
"{0} bowled {1} for {2} at {3}: {4}.",
"{0} 在 {3} 打了 {2} 局，總分 {1}：{4}。"
],
[
"{0} bowled {1} for {2} on {3}: {4}.",
"{0} {3}打了 {2} 局，總分 {1}：{4}。"
],
[
"{0} bowled {1} for {2}: {3}.",
"{0} 打了 {2} 局，總分 {1}：{3}。"
],
[
"{0} bowled a {1} at {2} on {3}.",
"{0} {3}在 {2} 打出 {1} 分。"
],
[
"{0} bowled a {1} at {2}.",
"{0} 在 {2} 打出 {1} 分。"
],
[
"{0} bowled a {1} on {2}.",
"{0} {2}打出 {1} 分。"
],
[
"{0} bowled a {1}.",
"{0} 打出 {1} 分。"
],
[
"Bowled {0} for {1} at {2} on {3}: {4}.",
"{3}在 {2} 打了 {1} 局，總分 {0}：{4}。"
],
[
"Bowled {0} for {1} at {2}: {3}.",
"在 {2} 打了 {1} 局，總分 {0}：{3}。"
],
[
"Bowled {0} for {1} on {2}: {3}.",
"{2}打了 {1} 局，總分 {0}：{3}。"
],
[
"Bowled {0} for {1}: {2}.",
"打了 {1} 局，總分 {0}：{2}。"
],
[
"Bowled a {0} at {1} on {2}.",
"{2}在 {1} 打出 {0} 分。"
],
[
"Bowled a {0} at {1}.",
"在 {1} 打出 {0} 分。"
],
[
"Bowled a {0} on {1}.",
"{1}打出 {0} 分。"
],
[
"Bowled a {0}.",
"打出 {0} 分。"
],
[
"{0} bowled at {1} on {2}.",
"{0} {2}在 {1} 打球。"
],
[
"{0} bowled at {1}.",
"{0} 在 {1} 打球。"
],
[
"{0} bowled on {1}.",
"{0} {1}去打球。"
],
[
"{0} bowled.",
"{0} 去打球了。"
],
[
"Bowled at {0} on {1}.",
"{1}在 {0} 打球。"
],
[
"Bowled at {0}.",
"在 {0} 打球。"
],
[
"Bowled on {0}.",
"{0}去打球。"
],
[
"{0} games in {1} · averaging {2} · high {3}, low {4}. The spread is {5} pins — that's what a nightly average hides.",
"{1} 共 {0} 局 · 平均 {2} · 最高 {3}，最低 {4}。分數落差達 {5} 分——只看每次打球的平均，就看不出這一點。"
],
[
"Combine your \"{0}\" with the shared one at {1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"要把你的「{0}」和 {1} 的共享聯賽合併嗎？你的局數、球隊和聯賽設定都會移過去，你也會看到那裡已有的球隊。這個動作無法復原。"
],
[
"{0}st to {1}",
"輸給 {1}，第 {0} 名"
],
[
"{0}nd to {1}",
"輸給 {1}，第 {0} 名"
],
[
"{0}rd to {1}",
"輸給 {1}，第 {0} 名"
],
[
"{0}th to {1}",
"輸給 {1}，第 {0} 名"
],
[
"Seeded {0}. {1}",
"你是{0}種子。{1}"
],
[
"Stepladder: {0} from the {1} seed",
"階梯賽：從{1}種子出發，拿下{0}"
],
[
"Stepladder: {0}",
"階梯賽：{0}"
],
[
"Match play: {0}, {1} with bonus",
"對戰賽：{0}，含獎勵分 {1}"
],
[
"{0} wants to be your coach",
"{0} 想成為你的教練"
],
[
"{0} wants to be your bowler",
"{0} 想成為你的球員"
],
[
"{0}. {1}{2} — {3} avg, {4} games",
""
],
[
"{0}. {1} — {2} avg, {3} games",
"{0}. {1}——平均 {2}，{3} 局"
],
[
"{0} pins first to last",
"第一名和最後一名相差 {0} 分"
],
[
"{0} more nights",
"還差 {0} 次"
],
[
"{0} more games",
"還差 {0} 局"
],
[
"{0} more first balls",
"還差 {0} 個第一球"
],
[
"{0} more spare attempts",
"還差 {0} 次補中機會"
],
[
"{0} more attempts",
"還差 {0} 次嘗試"
],
[
"A bowler wants to join {0}",
"有位球友想加入 {0}"
],
[
"The {0} plan starts today at {1} and renews on its own until you cancel.",
"{0} 方案從今天開始，費用為 {1}，並會自動續訂，直到你取消為止。"
],
[
"{0:m} game",
"每局 {0} 彩池"
],
[
"{0} won in side games, all-time.",
"場邊彩池累計贏得 {0}。"
],
[
"Poker Winnings ({0})",
"撲克獎金（{0}）"
],
[
"High Game Pot ({0})",
"單局最高分彩池（{0}）"
],
[
"3-6-9 Winnings ({0})",
"3-6-9 獎金（{0}）"
],
[
"{0} Each",
"每份（{0}）"
],
[
"Tournament buy in {0}",
"比賽報名費（{0}）"
],
[
"Tournament winnings {0}",
"比賽獎金（{0}）"
],
[
"Won {0}",
"贏得的獎金（{0}）"
]
],
"fragments": [
"\" as a new bowler",
"\" for next time",
"\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".",
"% of first balls",
"% spares",
"% stk",
"% strikes",
"% to",
"'s balls to start logging shots.",
"(free keeps",
"(you)",
") · Strongest:",
"+ Save \"",
", and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.",
", clears the setup, and takes you back to Home. This cannot be undone.",
", instead of hunting through separate cards. Split Rate is the one metric here where lower is better.",
", low",
", not",
"-day free trial starts today. When it ends, the",
"-digit code to",
"-handed everywhere it says so.",
"-pin left",
". Anything you set here is for tonight only.",
". Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.",
". Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.",
". It can't be undone.",
". One of the games was misread — check the card.",
". Practice and Just Bowling stay open either way.",
". Teammates will be able to import your scores from a scorecard photo — you still confirm them.",
". The score stays out of your average since you did not bowl it alone, but your own frames still count.",
". The spread is",
". Turning this on flips every leave, split and lane drawing to match — you are still",
". You can still update it yourself below, or skip for now.",
"10th Frame",
"? This removes the score",
"A CSV with four columns:",
"A backup ball goes out to the",
"Add \"",
"All nine struck — you took it",
"Alternate who leads off each game",
"Asked to join",
"Based on",
"Best carry tonight:",
"Best: match",
"Bowls",
"Brackets & Side Pots",
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where",
"Cancel any time",
"Card order:",
"Change the number below if this doesn't match your full season.",
"Clear all",
"Composite average at each position in the night, across the whole season — shows whether",
"Connected. They",
"Cost",
"Delete game",
"Delete this night?",
"Do I fall off in game three?",
"Every league and team you bowl in",
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than",
"Every rate stat side by side against",
"Everyone you've bowled with, by average.",
"Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.",
"First ball:",
"First balls at a full rack only",
"Frame-by-frame data included for",
"Free fall ·",
"Free trial —",
"From",
"G",
"Games add to",
"Games)",
"Go to",
"Go to match play",
"Go to scoring",
"Go to the stepladder",
"How much data it",
"I",
"Insights need at least",
"Keep mine, import the other",
"Last",
"Leave the target off if it isn",
"Leave:",
"Line",
"Manage or cancel any time in the Play Store app, under Subscriptions.",
"Match",
"Match 1",
"Matched on the alias \"",
"Misses:",
"Monthly ·",
"More",
"Move them to",
"Needs",
"Next Session (",
"Next ·",
"Nights here average",
"No published numbers for",
"Not enough data yet —",
"Not enough games logged here yet to suggest a new number",
"Nothing matched \"",
"Now:",
"On to",
"Other bowlers have a “",
"Other bowlers reported the shared specs for",
"Paused:",
"Questions, or want your data deleted?",
"Row",
"Saved.",
"Second ball:",
"Shot Context",
"Showing the",
"Signed in as",
"Solid while it skids, dashed once it turns — where it turns comes from the oil pattern rather than from anything you logged.",
"Step",
"Step 2",
"String ·",
"Strongest",
"Suggested new book average:",
"Switched from",
"Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.",
"Tap the ones you're in. Buy-ins are saved for",
"Target 60%",
"Target:",
"Team:",
"The",
"The Stats screens cover the usual numbers.",
"The code lasts an hour.",
"The free plan covers",
"The free plan follows this league.",
"The same email has a sign-in link in it, if you'd rather tap that.",
"The stepladder says",
"Theory",
"These go to",
"They enter it on their own phone and you",
"This block",
"This deletes",
"This deletes today's practice shots and game scores for",
"This deletes tonight's shots, game scores and match points for",
"This deletes your account and",
"This league usually runs",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app.",
"Tracked in 5-pin steps",
"Unhide Stat Cards (",
"Update to",
"Want a copy first? Use",
"We sent a",
"Weakest",
"Weakest:",
"Where do you bowl?",
"Where is a spare leaking?",
"Which ball carries best?",
"Which pins did the second ball knock down?",
"Worst: match",
"Yearly ·",
"You bowl frames",
"You have",
"You have already had the free trial, so the",
"You were added to the roster as",
"You —",
"You're averaging",
"You're close on",
"You're invited to",
"You're working with",
"You've used all",
"Your",
"Your history:",
"above before you do this.",
"across",
"actual vs",
"and",
"and every frame logged with them. This cannot be undone.",
"and hooks back, so your corner pin is the",
"and renews on its own until you cancel.",
"and takes you back to Home. This cannot be undone.",
"and your pocket is the",
"as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.",
"attempts",
"attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.",
"average over",
"average ·",
"averaging",
"avg",
"avg over",
"ball",
"before progress is shown.",
"before this is worth reporting.",
"below couldn't be reliably read from the image -- please double-check the pin count.",
"board",
"bowler",
"bowling better early, middle, or late.",
"breakpoint",
"but the card's scratch series is",
"by",
"by AI. It can be confidently wrong —",
"change",
"couldn't be read — type the real score, or clear the box if they didn't bowl it.",
"days",
"described",
"due 1 Apr",
"fill ball",
"first balls across",
"first balls struck",
"frames say",
"g",
"game",
"games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.",
"games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.",
"games,",
"games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.",
"games. Here's what the next set does to it.",
"games. Only statistics with enough data to be meaningful are analysed.",
"handicap pins",
"high",
"image",
"images",
"imported by a teammate.",
"in",
"in this league",
"is back tomorrow.",
"is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.",
"is published by My Bowling Journey LLC.",
"is saved to your history. Bowling another block of it, or starting a new tournament?",
"is your active league.",
"isn't poured on a Baker night — the frames belong to the pair, not to one bowler.",
"lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.",
"lb specifically — showing the reference weight instead.",
"league bag and",
"logged — each frame number needs at least",
"m bowling",
"m coaching",
"match",
"mi",
"more",
"net",
"night",
"of",
"of 4 points",
"of target",
"on",
"on string",
"on top",
"or",
"over",
"overall",
"paid in",
"pinfall)",
"pins between",
"pins first to last",
"pins left on the lane",
"pins vs opponents",
"pins — that's what a nightly average hides.",
"plan is",
"plan starts at",
"plan starts today at",
"points (",
"possible)",
"re connected — no searching for each other by name.",
"re in the list above.",
"reached",
"read as \"",
"read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.",
"row",
"s built on, beside it",
"s frames are logged under",
"saved on this phone. Nothing is lost.",
"scratch ·",
"season wrapped up",
"series ·",
"short)",
"shots",
"shots behind it, so treat it as preliminary. A dash means no shots at all.",
"skipped",
"so far",
"splits",
"step",
"still waiting to save.",
"t a number",
"team",
"tends to leave pins, regardless of which game it is.",
"things were true about tonight. Here are the two or three worth hearing.",
"things worth saying about tonight.",
"this frame",
"to confirm",
"to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.",
"to go.",
"to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.",
"to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.",
"to see this — it needs a specific roster to know who else was bowling that frame.",
"to see this — it needs a specific roster to know who's on top.",
"to see who owes a round.",
"to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.",
"today.",
"tonight ·",
"total ·",
"tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.",
"vs the cut",
"vs your",
"waiting for you",
"wants to be your",
"wants to join",
"was",
"what a strike ball is for.",
"will be sent first.",
"win",
"with bonus",
"wk",
"won",
"you already have",
"· First ball:",
"· card printed",
"· combined from",
"· high",
"· last time",
"— a couple more nights and it unlocks.",
"— a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.",
"— asked to be your",
"— confirming adds it to your shot history.",
"— every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.",
"— every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.",
"— invited, waiting for them to accept",
"— no result logged yet.",
"— waiting for someone on the team to approve.",
"— why?",
"— worth talking this through with them before changing anything. They can see what these numbers can't.",
"— you keep Pro until the end of the period you have paid for.",
"— you won't need to enter them again.",
"” is already here",
"” too",
"⚠️ Only",
"🧑‍🏫 Coach"
]
};
