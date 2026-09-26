// Japanese (ja-JP) for My Bowling Journey.
//
// English -> Japanese, in the same shape as fr-CA.js. `exact` is whole
// text; `patterns` are texts built in code, {0} {1}... being the values
// (see src/i18n/engine.js). An empty string means "looked at, not text a
// person reads" and is skipped. "lang": "ja" gives the Japanese number and
// punctuation rules.
//
// Edit entries here directly. After adding English text to the app, run
//   node scripts/i18n_extract.cjs --missing
// to list what still needs an entry here and in the other catalogs.
// Terminology and style: src/i18n/glossary-ja.md and src/i18n/style-ja.md.
export const JA_JP = {
"lang": "ja",
"exact": {
"Group": "グループ",
"Ungrouped": "グループなし",
"Coverstock": "カバーストック",
"Core": "コア",
"Weight (lb)": "重さ（lb）",
"Diff": "Diff",
"Int. Diff (asymmetric only)": "中間Diff（非対称コアのみ）",
"Layout System": "レイアウト方式",
"Add": "追加",
"'s balls to start logging shots.": "のボールを追加すると、投球を記録できます。",
"Active": "使用中",
"Archive": "アーカイブ",
"Done": "完了",
"Details": "詳細",
"Remove": "削除",
"Cancel": "キャンセル",
"No games logged with it yet": "このボールで記録したゲームはまだありません",
"No layout recorded": "レイアウト未記録",
"Specs": "スペック",
"Layout": "レイアウト",
"Throwing it again": "また使う",
"No longer throwing this ball? Archiving takes it out of your arsenal and bags and keeps every shot you logged with it.": "このボールはもう使っていませんか？アーカイブすると、アーセナルとバッグから外れますが、このボールで記録した投球はすべて残ります。",
"Archive this ball": "このボールをアーカイブ",
"Specs Removed": "スペック削除済み",
"Other bowlers reported the shared specs for": "他のボウラーから共有スペックが正しくないと報告があったため、次のボールのスペックを削除しました：",
"as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "。ボールはそのまま残っています — 時間のあるときに詳細を入力し直してください。",
"Got it": "わかりました",
"Group by": "グループ分け",
"Your groups": "マイグループ",
"Delete": "削除",
"New group, e.g. Dry lanes": "新しいグループ（例：ドライレーン）",
"To put a ball in a group, open the ball and pick the group under its specs.": "ボールをグループに入れるには、ボールを開いてスペックの下にあるグループを選びます。",
"Enter the code from your email.": "メールに届いたコードを入力してください。",
"Couldn't delete the account. Try again, or email support@mybowlingjourney.com.": "アカウントを削除できませんでした。もう一度お試しいただくか、support@mybowlingjourney.com までメールでご連絡ください。",
"The server didn't confirm the deletion. Nothing has been removed — email support@mybowlingjourney.com.": "サーバーで削除を確認できませんでした。何も削除されていません — support@mybowlingjourney.com までメールでご連絡ください。",
"Couldn't reach the server. Nothing has been deleted.": "サーバーに接続できませんでした。何も削除されていません。",
"Not signed in or name is empty": "ログインしていないか、名前が空欄です",
"unknown reason": "不明な理由",
"useAuth must be used inside <AuthProvider>": "",
"That code did not work. Check it came through in one piece.": "このコードは使えませんでした。途中で切れずに全部届いているか確認してください。",
"Your badges": "自分のバッジ",
"Your open bowling badges": "フリー投球のバッジ",
"of": "/",
"Bowl a league night, a tournament or a practice session to start.": "リーグの日、大会、練習セッションのどれかで投げるとスタートです。",
"Bowl a night with the group and the first one is yours.": "仲間と一緒に一度投げれば、最初のバッジが手に入ります。",
"Every one of them.": "全部そろいました。",
"Every one of them. Including the ones nobody wants.": "全部そろいました。誰も欲しがらないものまで。",
"Some come from one good night, some take a season.": "調子のいい1日で取れるものもあれば、1シーズンかかるものもあります。",
"Not all of them are about bowling well — some are about showing up, and one or two you'd rather not have.": "うまく投げることだけがすべてではありません — 参加するだけでもらえるものもあれば、できればもらいたくないものも1つ2つあります。",
"Share my badges": "バッジを共有",
"The collection": "コレクション",
"All": "すべて",
"Earned": "獲得",
"None yet.": "まだありません。",
"None yet. Bowl a night with the group and the first one is yours.": "まだありません。仲間と一緒に一度投げれば、最初のバッジが手に入ります。",
"Nothing left. You have all of them.": "残りはありません。全部獲得しました。",
"Someone sent you your badges?": "バッジを送ってもらいましたか？",
"Paste the code from their message and your nights come across. Doing it twice is harmless — nothing doubles up.": "メッセージにあるコードを貼り付けると、投球記録が取り込まれます。2回行っても問題ありません — 重複はしません。",
"Paste the code": "コードを貼り付け",
"Load": "読み込む",
"Edit Bag": "バッグを編集",
"New Bag": "新しいバッグ",
"Name": "名前",
"e.g. Short pattern, 6 ball limit": "例：ショートパターン、ボール6個まで",
"Type": "種類",
"Balls Allowed": "使用できるボール数",
"The total the tournament allows. Leave blank for no limit.": "大会で認められている合計数です。制限がない場合は空欄のままにしてください。",
"e.g. 6": "例：6",
"Plan to include a plastic": "プラスチックボールを入れる予定",
"A note for your own planning — it doesn't change the limit above.": "自分の計画用のメモです — 上の制限数は変わりません。",
"Save Bag": "バッグを保存",
"Give the bag a name to save it.": "保存するにはバッグに名前を付けてください。",
"Add a bag": "バッグを追加",
"What you carry to league differs from what you carry to a tournament — and tournaments often cap how many balls you may bring, so you can keep several.": "リーグに持っていくボールと大会に持っていくボールは違います — 大会では持ち込めるボールの数が制限されることも多いので、バッグを複数用意できます。",
"+ League Bag": "+ リーグ用バッグ",
"+ Tournament Bag": "+ 大会用バッグ",
"More bags": "バッグを増やす",
"The free plan covers": "無料プランで使えるのは",
"league bag and": "個のリーグ用バッグと",
"tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.": "個の大会用バッグです。追加のバッグ — ショートパターンの大会用バッグやスポーツコンディション用バッグなど — は有料プランの機能です。すでにバッグに入れたものがなくなることはありません。",
"Bags": "バッグ",
"No bags yet. Add one above.": "バッグはまだありません。上から追加してください。",
"ball": "個",
"· plastic planned": "· プラスチックボール予定",
"Edit": "編集",
"Keep": "残す",
"🔒 Pro — kept exactly as packed, and back the moment you subscribe.": "🔒 Pro — 入れた内容はそのまま保存され、登録するとすぐに戻ります。",
"Full — remove a ball before adding another.": "満杯です — ボールを追加する前に1個外してください。",
"Empty. Add balls from below.": "空です。下からボールを追加してください。",
"Add Balls to a Bag": "バッグにボールを追加",
"Every ball is packed. Practice always shows every ball regardless.": "すべてのボールがバッグに入っています。練習では常にすべてのボールが表示されます。",
"· not in any bag": "· どのバッグにも入っていません",
"Community Specs": "コミュニティのスペック",
"Nobody has shared specs for this ball yet. If you've filled yours in, you can share them so other bowlers don't have to type them.": "このボールのスペックはまだ誰も共有していません。自分のスペックを入力済みなら、共有して他のボウラーの入力の手間を省けます。",
"Share My Specs": "自分のスペックを共有",
"Yours": "自分",
"No details recorded": "詳細の記録なし",
"Showing the": "表示中：",
"lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.": "lbの数値 — RGとディファレンシャルは重さによって異なり、このボールは複数の重さの数値が公開されています。",
"No published numbers for": "この重さの公開数値はありません：",
"lb specifically — showing the reference weight instead.": "lb — 代わりに基準の重さの数値を表示しています。",
"more": "件",
"to": "〜",
"Applied": "適用済み",
"Use These": "これを使う",
"✓ Looks right": "✓ 正しい",
"Looks right": "正しい",
"✓ Wrong": "✓ 間違い",
"Wrong": "間違い",
"Update Shared": "共有を更新",
"Locked — enough bowlers have confirmed these that they can't be edited.": "ロック済み — 十分な数のボウラーが確認したため、編集できません。",
"Voting closed.": "投票は終了しました。",
"Share Mine Instead": "代わりに自分のを共有",
"Ball path": "ボールの軌道",
"First balls at a full rack only": "10本すべて立っている状態での1投目のみ",
"what a strike ball is for.": "それがストライクボールの役割です。",
"Add a ball (e.g. Storm Phaze II)": "例：Storm Phaze II",
"From other bowlers": "ほかのボウラーの登録から",
"Specs entered by other bowlers, not manufacturer data — check them after adding.": "ほかのボウラーが入力したスペックで、メーカーのデータではありません — 追加後に確認してください。",
"Strike % through the night": "その日のストライク率の推移",
"How each ball carried as the lanes went, first games to last.": "レーンの変化につれて、各ボールのキャリーがどう変わったか。最初のゲームから最後のゲームまで。",
"Ball": "ボール",
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than": "数値はすべてストライク率です。太字はその区間でトップのボールです。差が偶然の範囲内のときは、どれも太字になりません。アンバー表示の率は裏付けとなる投球が",
"shots behind it, so treat it as preliminary. A dash means no shots at all.": "投未満なので、暫定値として見てください。「—」は投球がまったくないことを表します。",
"Rubbing the lamp…": "ランプをこすっています…",
"Reading your numbers…": "数値を読んでいます…",
"Working out what they mean…": "意味を考えています…",
"Still going — it is a fair question…": "まだ考えています — なかなかいい質問なので…",
"You've used all": "本日の質問をすべて使いました",
"today.": "回分。",
"is back tomorrow.": "は明日また戻ってきます。",
"The Stats screens cover the usual numbers.": "一般的な数字は「成績」画面で確認できます。",
"is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.": "は、そこでは分からない疑問に答えます — 自分のボウリングについて質問すると、記録したデータから答えを導き出します。まだ記録していないデータが必要な場合は、何を記録し始めればよいか教えてくれます。",
"Ask about your bowling…": "ボウリングについて質問…",
"Ask": "質問",
"That": "この回答",
"Tour": "",
"Journey": "あゆみ",
"Home": "ホーム",
"BadgeCollection": "",
"TeamManagement": "",
"Friends": "フレンド",
"StatsView": "",
"ImportScorecard": "",
"Settings": "設定",
"Profile": "プロフィール",
"TrendsView": "",
"CoachingView": "",
"InsightsView": "",
"A team with that name already exists in this league.": "このリーグには同じ名前のチームがすでにあります。",
"Could not clear the sync markers on this device. Nothing was changed.": "この端末の同期マーカーを消去できませんでした。変更は何も行われていません。",
"Only the bowler who added this league can combine it. Ask them, or join the shared league from a team code.": "このリーグを統合できるのは、リーグを追加したボウラーだけです。そのボウラーに依頼するか、チームコードから共有リーグに参加してください。",
"Couldn't combine them just now. Nothing was changed — try again in a moment.": "今は統合できませんでした。変更は何も行われていません — 少し待ってから、もう一度お試しください。",
"You already have a league with that name. Rename yours first, then join this one.": "同じ名前のリーグがすでにあります。先にご自身のリーグの名前を変更してから、こちらに参加してください。",
"Couldn't join that league just now. Check your connection and try again.": "今はこのリーグに参加できませんでした。接続を確認して、もう一度お試しください。",
"A league with that name already exists.": "同じ名前のリーグがすでにあります。",
"Pick a bowler first.": "先にボウラーを選んでください。",
"Give the ball a name.": "ボールに名前を付けてください。",
"Location is needed to find nearby centers. Allow location access, or add the center by name.": "近くのボウリング場を探すには位置情報が必要です。位置情報へのアクセスを許可するか、ボウリング場を名前で追加してください。",
"Couldn't search for centers right now. You can add the center by name instead.": "今はボウリング場を検索できませんでした。代わりに、ボウリング場を名前で追加できます。",
"this team": "このチーム",
"That request was already answered, or couldn't be reached. Refreshing.": "このリクエストはすでに対応済みか、アクセスできませんでした。更新しています。",
"the team": "チーム",
"They": "そのボウラー",
"your team": "チーム",
"Couldn't join that team just now — try again in a moment.": "今はこのチームに参加できませんでした — 少し待ってから、もう一度お試しください。",
"Someone": "誰か",
"Couldn't make a code just now — check your connection and try again.": "今はコードを作成できませんでした — 接続を確認して、もう一度お試しください。",
"That code doesn't look right — it's 8 characters.": "コードが正しくないようです — コードは8文字です。",
"That code is not valid.": "このコードは無効です。",
"That doesn't look like a team code.": "チームコードではないようです。",
"Couldn't check that code — you may be offline. You can enter it later in Settings.": "コードを確認できませんでした — オフラインの可能性があります。あとで「設定」から入力できます。",
"Give the tournament a name first — it's on the Set up tab.": "先に大会名を入力してください — 「準備」タブにあります。",
"Weak 10": "ウィークテン",
"Ringing 10": "リンギング",
"Other Leave": "その他の残りピン",
"9 Pin No-Tap": "9ピンノータップ",
"Yes": "はい",
"Not a valid backup file": "有効なバックアップファイルではありません",
"No shots logged yet for this night": "この日はまだ投球が記録されていません",
"The lamp flickered and went quiet. Try again in a few minutes.": "ランプがちらついて、静かになってしまいました。数分後にもう一度お試しください。",
"Brooklyn had no answer for that.": "Brooklynはこの質問に答えられませんでした。",
"open bowling": "",
"Sunday": "日曜日",
"Monday": "月曜日",
"Tuesday": "火曜日",
"Wednesday": "水曜日",
"Thursday": "木曜日",
"Friday": "金曜日",
"Saturday": "土曜日",
"Couldn't get your insights right now. Try again in a few minutes.": "今は分析を取得できませんでした。数分後にもう一度お試しください。",
"Bowl": "投球",
"Standings": "順位表",
"Setup": "準備",
"Stats": "成績",
"Improve": "上達",
"History": "履歴",
"House Shot": "ハウスコンディション",
"Back": "戻る",
"Inbox": "受信トレイ",
"Coach": "コーチ",
"Help": "ヘルプ",
"Results": "結果",
"Import scorecard": "スコアシートを取り込む",
"My Bowling Journey Pro": "My Bowling Journey Pro",
"⟳ Backing up": "⟳ バックアップ中",
"Import": "取り込む",
"You're all set": "準備ができました",
"We know you're keen to get started — so we won't hold you up for long. We'd just like to show you around first.": "早く始めたいお気持ちはわかります — お時間はほとんど取らせません。まずはアプリをひととおりご案内させてください。",
"And remember, you can document as much or as little as you want. The more you tell us, the more we can give back.": "なお、記録する内容は多くても少なくてもかまいません。記録が多いほど、より多くの分析をお返しできます。",
"Begin": "はじめる",
"No thanks — I'll take the tour later from the settings menu": "結構です — ツアーはあとで設定メニューから見ます",
"Close": "閉じる",
"change is": "件の変更は",
"changes are": "件の変更は",
"saved on this phone. Nothing is lost.": "このスマホに保存されています。何も失われていません。",
"Trying…": "再試行中…",
"Try again now": "今すぐ再試行",
"Loading…": "読み込み中…",
"🧑‍🏫 Coach": "🧑‍🏫 コーチ",
"🎯 Start a practice drill": "🎯 ドリル練習を始める",
"Competitive": "競技",
"Open bowling": "フリー投球",
"a team": "チーム",
"A bowler": "あるボウラー",
"Joining lets teammates see your scores and yours theirs.": "参加すると、チームメイトとお互いのスコアを見られるようになります。",
"Anyone on the team can answer.": "チームの誰でも回答できます。",
"Join": "参加",
"Approve": "承認",
"No thanks": "見送る",
"Decline": "拒否",
"Nothing Waiting": "確認待ちはありません",
"Requests, coach tasks and scores to confirm show up here.": "申請、コーチからの課題、確認待ちのスコアがここに表示されます。",
"Balls": "ボール",
"League": "リーグ",
"Team": "チーム",
"waiting for you": "件の確認待ち",
"1px solid transparent": "",
"Practice": "練習",
"Tournament": "大会",
"🏆 Won it": "🏆 優勝",
"🥈 Runner-up": "🥈 準優勝",
"🏅 Top five": "🏅 トップ5",
"💰 Cashed": "💰 賞金圏入り",
"✅ Made the cut": "✅ 予選通過",
"QUALIFYING": "予選",
"total ·": "（合計）·",
"average ·": "（アベレージ）·",
"high": "（ハイゲーム）",
"vs the cut": "（カットライン比）",
"MATCH PLAY": "マッチプレー",
"match": "試合",
"with bonus": "（ボーナス込み）",
"STEPLADDER": "ステップラダー",
"step": "ステップ",
"won": "勝ち",
"Nothing logged yet. Once you've bowled a night or two, this shows the shape of a month — which weeks you bowled and which you missed.": "まだ記録がありません。1〜2日投げると、ここに1か月の様子が表示されます — 投げた週と投げなかった週がひと目でわかります。",
"Earlier month": "前の月",
"Later month": "次の月",
"Nothing bowled this month": "今月の投球はありません",
"Bowling": "フリー投球",
"series ·": "（シリーズ）·",
"% strikes": "%がストライク",
"Delete this night?": "この日の記録を削除しますか？",
"game": "ゲーム",
"and every frame logged with them. This cannot be undone.": "と、そこに記録したすべてのフレームが削除されます。元に戻すことはできません。",
"Yes, delete it": "削除する",
"Keep it": "残す",
"Delete this night": "この日の記録を削除",
"Nobody here yet. Add people to your scoresheet on the Bowl tab and they'll show up once you've bowled a night together.": "まだ誰もいません。「投球」タブのスコアシートに一緒に投げる人を追加すると、一緒に投げたあとにここに表示されます。",
"Everyone you've bowled with, by average.": "一緒に投げた全員をアベレージ順に表示しています。",
"Add someone to compare against.": "比べる相手を追加しましょう。",
"Share standings": "順位を共有",
"night": "日",
"best": "ベスト",
"win": "勝",
"See all my badges ›": "自分のバッジをすべて見る ›",
"Change": "変更",
"Pins": "ピンセッター",
"Which lanes are free fall? Everything else counts as string.": "フリーフォール式のレーンはどれですか？それ以外はすべてストリング式として扱います。",
"e.g. 1-8, 15, 16": "例：1-8, 15, 16",
"Until these are set, this house stays out of the free fall vs string comparison.": "これを設定するまで、このボウリング場はフリーフォール式とストリング式の比較から除外されます。",
"Bowling Center": "ボウリング場",
"Where do you usually practice? Setting it lets you compare how you score house to house.": "いつもどこで練習していますか？設定すると、ボウリング場ごとのスコアを比較できます。",
"Where do you usually bowl for fun? Setting it lets you compare how you score house to house.": "フリー投球はいつもどこで投げていますか？設定すると、ボウリング場ごとのスコアを比較できます。",
"this league": "このリーグ",
"Search by name, e.g. Arsenal Bowl": "名前で検索（例：Arsenal Bowl）",
"Searching…": "検索中…",
"No centers found nearby. You can add it by name below.": "近くにボウリング場が見つかりませんでした。下から名前で追加できます。",
"This list": "このリスト",
"check the name and address before you rely on it": "利用する前に名前と住所を確認してください",
"mi": "マイル",
"Can't find it? Add by name": "見つかりませんか？名前で追加",
"Center name": "ボウリング場名",
"Target:": "目標：",
"reached": "実績",
"short)": "不足)",
"Due": "期限",
"Worked on it": "取り組んだ",
"What did you get to?": "どこまでできましたか？",
"Anything to tell your coach?": "コーチに伝えたいことはありますか？",
"Save": "保存",
"Reopen": "未完了に戻す",
"Give the task a title.": "課題のタイトルを入力してください。",
"What should they work on?": "何に取り組んでもらいますか？",
"Detail (optional)": "詳細（任意）",
"Measurable target (optional)": "数値目標（任意）",
"No target": "目標なし",
"Target": "目標値",
"Assign": "割り当てる",
"Nothing here yet. Both of you can write, and you both see everything.": "まだ何もありません。お互いに書き込めて、すべての内容を2人とも見られます。",
"You": "自分",
"Add a note…": "メモを追加…",
"Post": "投稿",
"Coaching": "コーチ",
"Working with a coach — shared goals, drills they set you, and notes back and forth — is part of the paid plan. Everything you have logged is untouched, and any coach already linked to you stays linked.": "コーチとの取り組み — 共通の目標、コーチから出されるドリル練習、メモのやり取り — は有料プランの機能です。これまでに記録した内容はそのまま残り、すでにつながっているコーチとの連携も維持されます。",
"Your bowlers": "指導中のボウラー",
"Everyone at a glance — what they're working on, how far along, and when you next see them.": "全員をひと目で確認 — 取り組んでいる内容、進み具合、次回のレッスン日。",
"+ Add a bowler": "+ ボウラーを追加",
"no session set": "次回レッスン未定",
"Nothing assigned yet.": "まだ課題が割り当てられていません。",
"— no result logged yet.": "— まだ結果が記録されていません。",
"Bowls": "次回投球：",
"on": "、",
"View": "表示",
"I'm bowling": "ボウラーとして",
"I'm coaching": "コーチとして",
"Showing the bowlers you coach.": "指導中のボウラーを表示しています。",
"Showing your own game. Switch to see the people you coach.": "自分の成績を表示しています。切り替えると指導中のボウラーを確認できます。",
"Requests": "リクエスト",
"Someone wants to connect.": "つながりのリクエストが届いています。",
"wants to be your": "からのリクエスト — 役割：",
"Accept": "承認",
"Waiting On Them": "相手の返事待ち",
"— asked to be your": "— 申請中の役割：",
"Nobody yet. Make a code and read it to them — they enter it on their own phone, and from then on you'll see their sessions, set tasks and track progress here.": "まだいません。コードを作成して相手に読み上げてください — 相手のスマホで入力してもらえば、ここでその人の記録を確認したり、課題を出したり、上達の様子を追ったりできます。",
"Your Bowlers": "指導中のボウラー",
"Your Coaches": "担当コーチ",
"Nobody connected yet.": "まだ誰ともつながっていません。",
"Connect with someone": "ほかの人とつながる",
"Read this to the bowler you're coaching.": "指導するボウラーにこのコードを読み上げてください。",
"Read this to your coach.": "コーチにこのコードを読み上げてください。",
"Works once, for the next 7 days.": "1回限り有効、有効期限は7日間です。",
"They coach me": "相手がコーチ",
"I coach them": "自分がコーチ",
"Create a code": "コードを作成",
"They enter it on their own phone and you": "相手のスマホで入力すれば",
"re connected — no searching for each other by name.": "連携完了 — 名前で探し合う必要はありません。",
"Got a code?": "コードをお持ちですか？",
"ABCD-2345": "ABCD-2345",
"Coaching code": "コーチ連携コード",
"Connect": "連携",
"Connected. They": "連携しました。",
"re in the list above.": "上のリストに表示されています。",
"Pick something to work on": "取り組む項目を選択",
"Set this goal": "この目標を設定",
"They'll see it on their Improve tab in bowling terms, and it tracks itself as they bowl.": "相手の「上達」タブにボウリングの用語で表示され、投球に合わせて進捗が自動で記録されます。",
"Clear": "クリア",
"Where and when, e.g. 6pm lanes 9-10 at Sunset": "場所と日時（例：18時、Sunsetの9-10レーン）",
"Shows on your roster above. Leave it blank if you work session to session.": "上の指導中ボウラー一覧に表示されます。毎回その都度決める場合は空欄のままにしてください。",
"Nothing bowled yet. Their scores appear here once they save a session.": "まだ投球記録がありません。セッションを保存すると、ここにスコアが表示されます。",
"Average": "アベレージ",
"High": "最高",
"Nights": "投球日数",
"From": "集計対象：",
"shots": "投",
"Strike": "ストライク",
"Spare": "スペア",
"Single Pin": "1本残り",
"Split": "スプリット",
"Misses:": "ミス：",
"Recent": "最近",
"+ Assign a task": "+ 課題を出す",
"No tasks yet — set one above and it'll show in their inbox.": "まだ課題はありません — 上で設定すると相手の受信トレイに届きます。",
"Done & Attempted": "完了・挑戦済み",
"Notes": "メモ",
"Both of you can read and write here.": "ここはお互いに読み書きできます。",
"End coaching relationship": "コーチ関係を終了",
"Plastic": "プラスチック",
"Just Bowling": "フリー投球",
"Imported": "取り込み",
"Ion Max Solid": "Ion Max Solid",
"Ion Max Pearl": "Ion Max Pearl",
"Phaze II Solid": "Phaze II Solid",
"Phaze II Pearl": "Phaze II Pearl",
"Harsh Reality Pearl": "Harsh Reality Pearl",
"Road Warrior Pearl": "Road Warrior Pearl",
"Equinox Pearl": "Equinox Pearl",
"Box": "工場出荷時",
"Polish": "ポリッシュ",
"Lane Shine": "レーンシャイン",
"Weak 7": "ウィークセブン",
"Ringing 7": "リンギング",
"Half Pocket": "ハーフポケット",
"Trip 4": "4番トリップ",
"Kick 10": "10番キック",
"Acceptable": "まずまず",
"Fast": "速すぎ",
"Slow": "遅すぎ",
"Too early": "曲がりが早すぎる",
"Too late": "曲がりが遅すぎる",
"Too round": "動きが丸すぎる",
"Too sharp": "動きが鋭すぎる",
"Roll out": "ロールアウト",
"Poor carry": "キャリー不足",
"No miss room": "ミスの許容幅なし",
"Lane transition": "レーンのトランジション",
"Surface worn": "表面の摩耗",
"Perfect game": "パーフェクトゲーム",
"300. Nothing left to take off it.": "300。これ以上はありません。",
"Honor series": "オナーシリーズ",
"New personal best game": "自己ベストゲーム更新",
"New personal best series": "自己ベストシリーズ更新",
"Won it": "優勝",
"Top five": "トップ5",
"Cashed": "賞金圏入り",
"Made the cut": "予選通過",
"Didn't cash": "賞金圏外",
"strike rate": "ストライク率",
"spare conversion": "スペアメイク率",
"ten pin conversion": "10番ピンのメイク率",
"split conversion": "スプリットのメイク率",
"single-pin conversion": "1本残りのスペアメイク率",
"corner-pin conversion": "コーナーピンのメイク率",
"open frames per game": "1ゲームあたりのオープンフレーム数",
"average by game": "ゲーム順別のアベレージ",
"score spread": "スコアのばらつき",
"most common leave": "最も多い残りピン",
"Nothing in that link.": "このリンクには何も含まれていません。",
"that night": "その日は",
"No limit": "無制限",
"Official": "公式",
"Unconfirmed": "未確認",
"Community approved": "コミュニティ承認済み",
"Verified": "検証済み",
"Disputed": "異議あり",
"Manufacturer specifications.": "メーカー公表スペック。",
"Reported as incorrect. These specs have been removed.": "誤りとして報告されました。このスペックは削除されています。",
"Entered by another bowler and not yet confirmed. Check before trusting it.": "他のボウラーが入力したもので、まだ確認されていません。参考にする前に確認してください。",
"Fresh": "序盤",
"Transition": "中盤",
"Late": "終盤",
"Strong - Smooth": "強め - スムーズ",
"Strong - Sharp": "強め - シャープ",
"Benchmark - Smooth": "ベンチマーク - スムーズ",
"Benchmark - Sharp": "ベンチマーク - シャープ",
"Weak - Smooth": "弱め - スムーズ",
"Weak - Sharp": "弱め - シャープ",
"Urethane": "ウレタン",
"Solid": "ソリッド",
"Pearl": "パール",
"Hybrid": "ハイブリッド",
"Symmetric": "対称",
"Asymmetric": "非対称",
"All Balls": "すべてのボール",
"Not specified": "未指定",
"Compare yourself with a teammate. Log a night with more than one bowler.": "チームメイトと比べてみましょう。2人以上のボウラーが投げた日を記録してください。",
"Your team's best games and series. Needs team-mates with logged scores.": "チームのハイゲームとハイシリーズです。スコアを記録したチームメイトが必要です。",
"Your high game and high series. Fills in once you have a game logged.": "自分のハイゲームとハイシリーズです。1ゲーム記録すると表示されます。",
"Win-loss record. Record match results on a league night.": "勝敗記録です。リーグの日に試合結果を記録してください。",
"Points won each week. Record match results on a league night.": "毎週獲得したポイントです。リーグの日に試合結果を記録してください。",
"How handicap changes results. Set a book average for the roster.": "ハンディキャップで結果がどう変わるかです。メンバーの公認アベレージを設定してください。",
"Team averages ranked. Add bowlers to your team.": "チーム内のアベレージ順位です。チームにボウラーを追加してください。",
"Wins against higher-average teams. Record match results.": "アベレージが上のチームに対する勝利です。試合結果を記録してください。",
"Games decided by a handful of pins. Record match results.": "数ピン差で決まったゲームです。試合結果を記録してください。",
"Team totals by night. Needs team-mates with logged scores.": "日ごとのチーム合計です。スコアを記録したチームメイトが必要です。",
"Averages by house. Bowl at more than one center.": "ボウリング場ごとのアベレージです。複数のボウリング場で投げてください。",
"Strike percentage by part of the night, ball against ball. Log which ball you threw on each shot.": "その日の時間帯ごとのストライク率を、ボール同士で比較します。各投球でどのボールを投げたかを記録してください。",
"Your line, drawn on the lane. Log start board and arrows on your shots.": "自分のラインをレーン上に描きます。投球ごとに立ち位置のボードとスパットを記録してください。",
"Each ball's numbers. Log which ball you threw on each shot.": "ボールごとの数値です。各投球でどのボールを投げたかを記録してください。",
"What makes you switch balls. Record a ball-change reason.": "ボールを替えるきっかけです。ボール交換の理由を記録してください。",
"Frames without an open. Log a full night frame by frame.": "オープンにならなかったフレームです。1日分をフレームごとに記録してください。",
"How you bowl early against late in a game. Log shots by frame.": "ゲームの序盤と終盤の投球の比較です。フレームごとに投球を記録してください。",
"Pins on the first ball. Log shots frame by frame.": "1投目で倒したピン数です。フレームごとに投球を記録してください。",
"How often the corner pin stands. Log your leaves.": "コーナーピンが残る頻度です。残りピンを記録してください。",
"Single-pin conversion. Log your leaves and whether you made them.": "1本残りのスペアを取る率です。残りピンと、スペアを取れたかどうかを記録してください。",
"Splits and conversions. Log your leaves.": "スプリットとそのメイク率です。残りピンを記録してください。",
"Who missed the lone 5. Log your leaves.": "5番ピンの1本残りをミスしたのは誰か。残りピンを記録してください。",
"Makeable leaves you missed. Log your leaves.": "取れるのにミスした残りピンです。残りピンを記録してください。",
"Longest run of strikes. Log a full night frame by frame.": "ストライクの最長連続記録です。1日分をフレームごとに記録してください。",
"Where your misses go. Record a miss direction on bad shots.": "ミスがどちらに外れるかです。ミスした投球で外れた方向を記録してください。",
"How your release holds up. Record release quality on your shots.": "リリースの安定度です。投球ごとにリリースの質を記録してください。",
"Flush against lucky strikes. Record how each strike carried.": "ジャストポケットとラッキーストライクの比較です。各ストライクのピンの倒れ方を記録してください。",
"Your average as it moves. Log a few more nights.": "アベレージの推移です。もう何日分か記録してください。",
"What you would average with every spare. Log your leaves.": "スペアをすべて取っていた場合のアベレージです。残りピンを記録してください。",
"Where you are heading. Log a few more nights.": "今後の傾向です。もう何日分か記録してください。",
"How much your scores swing. Log a few more nights.": "スコアのばらつきです。もう何日分か記録してください。",
"The shape of your scores. Log a few more nights.": "スコアの分布です。もう何日分か記録してください。",
"This season against last. Finish a season, then start another.": "今シーズンと前シーズンの比較です。シーズンを1つ終えてから、次のシーズンを始めてください。",
"First, second and third game. Log a few full nights.": "1ゲーム目・2ゲーム目・3ゲーム目の比較です。全ゲームを通した記録を何日分か付けてください。",
"What you won and paid in. Turn on side games and record a night.": "獲得額と参加費です。サイドゲームをオンにして、1日分を記録してください。",
"3-6-9 and jackpot. Turn on side games and record a night.": "3-6-9とジャックポットです。サイドゲームをオンにして、1日分を記録してください。",
"Your season at a glance. Log a night.": "シーズンがひと目でわかります。1日分を記録してください。",
"First night": "初日",
"Bowled a night with the group.": "グループで1日投げました。",
"Regular": "常連",
"Five nights in.": "通算5日。",
"Fixture": "ヌシ",
"Fifteen nights. You live here now.": "通算15日。もはやここの住人です。",
"Marathon": "マラソン",
"Six games in one night.": "1日で6ゲーム。",
"Triple figures": "3ケタ",
"Broke 100.": "100の壁を突破。",
"One fifty": "150",
"Broke 150.": "150の壁を突破。",
"Two hundred": "200",
"Broke 200. That's a real game.": "200の壁を突破。これぞ本物のゲームです。",
"Five hundred": "500",
"A 500 series across three games.": "3ゲームのシリーズで500。",
"Night winner": "その日の勝者",
"Won a night outright.": "同点なしで、その日の勝者になりました。",
"Repeat champion": "常勝",
"Won three nights.": "その日の勝者に3回なりました。",
"Clean sweep": "完全制覇",
"Won every game in a night.": "1日の全ゲームで勝ちました。",
"Giant killer": "ジャイアントキリング",
"Beat someone averaging 30 more than you.": "アベレージが30ピン以上高い相手に勝ちました。",
"Comeback": "巻き返し",
"Improved 40 pins between games in a night.": "1日のうちに、ゲーム間でスコアを40ピン伸ばしました。",
"Metronome": "メトロノーム",
"Three games within 10 pins of each other.": "3ゲームのスコア差が10ピン以内。",
"New best": "自己ベスト更新",
"Beat your own high game.": "自分のハイゲームを更新しました。",
"Climbing": "上昇中",
"Your average went up over five nights.": "5日間でアベレージが上がりました。",
"Rough night": "散々な日",
"Everyone has one. Under 70.": "誰にでもあります。70未満。",
"Photo finish": "写真判定",
"Won or lost a night by a single pin.": "1ピン差でその日の勝敗が決まりました。",
"Wooden spoon": "しんがり",
"Finished last. Someone has to.": "最下位。誰かがなるものです。",
"Back to back": "連続",
"Two 150+ games in a row.": "150以上を2ゲーム連続。",
"Rollercoaster": "ジェットコースター",
"100 pins between your best and worst game in one night.": "1日のベストゲームとワーストゲームの差が100ピン。",
"Scorekeeper": "スコア係",
"Kept score for four or more people.": "4人以上のスコアを記録しました。",
"Pins set by machine, fall freely.": "ピンを機械がセットし、ピンは自由に倒れます。",
"Pins on strings, pulled back up.": "ピンにひもが付いていて、引き上げられて元に戻ります。",
"Mixed house": "混在型のボウリング場",
"Some lanes string, some free fall.": "ストリング式とフリーフォール式のレーンが混在しています。",
"7 Pin": "7番ピン",
"10 Pin": "10番ピン",
"Bowled your first league night.": "初めてリーグの日に投げました。",
"Old guard": "古参",
"Three full seasons in the same league.": "同じリーグで3シーズンを完走。",
"Sub covered": "助っ人参上",
"Bowled as a sub for another team.": "他のチームの補欠として投げました。",
"New high game": "ハイゲーム更新",
"New high series": "ハイシリーズ更新",
"Beat your own high series.": "自分のハイシリーズを更新しました。",
"Book buster": "公認アベ破り",
"A game 40+ pins over your book average.": "公認アベレージを40ピン以上上回るゲーム。",
"In the pocket": "ポケットイン",
"Three games in a night within 5 pins of your average.": "1日の3ゲームすべてがアベレージから5ピン以内。",
"Heater": "絶好調",
"Three straight games above your average.": "3ゲーム連続でアベレージ超え。",
"Cold night, warm finish": "尻上がり",
"Opened below average, closed above it.": "アベレージ未満で始まり、アベレージ超えで締めくくりました。",
"Raised book average": "公認アベレージ上昇",
"Your average is 5+ pins above last season's book.": "アベレージが前シーズンの公認アベレージを5ピン以上上回っています。",
"Clean": "ノーミス",
"No open frames all night.": "1日を通してオープンフレームなし。",
"Sharp shooter": "スナイパー",
"Converted three or more splits in a night.": "1日でスプリットを3回以上メイクしました。",
"Carried it": "立役者",
"Your score was the difference in a match your team won.": "チームが勝った試合で、自分のスコアが勝敗を分けました。",
"Held the line": "孤軍奮闘",
"Bowled above your average in a match your team lost.": "チームが負けた試合で、アベレージ以上を投げました。",
"Team high game": "チームのハイゲーム",
"Set your team's high game for the night.": "その日のチームのハイゲームを出しました。",
"Team high series": "チームのハイシリーズ",
"Set your team's high series for the night.": "その日のチームのハイシリーズを出しました。",
"Executioner": "処刑人",
"Helped hang a teammate 30 times.": "チームメイト1人だけがストライクを逃したフレームで、30回ストライクを出しました。",
"Won a side game.": "サイドゲームで勝ちました。",
"Money bags": "がっぽり",
"$100 won in side games, all-time.": "サイドゲームの獲得額が通算$100に到達。",
"Locked in": "お墨付き",
"Your book average was confirmed at season end.": "シーズン終了時に公認アベレージが確定しました。",
"Twelve strikes. The one you'll be telling people about.": "ストライク12個。ずっと語り草になるゲームです。",
"800 series": "800シリーズ",
"An 800 series. USBC honor score.": "800シリーズ達成。USBCのオナースコアです。",
"First tournament": "初めての大会",
"Logged your first tournament.": "初めて大会を記録しました。",
"Survived to the next round.": "次のラウンドに勝ち残りました。",
"Finished in the top five.": "トップ5でフィニッシュしました。",
"Won the whole thing": "優勝",
"First place.": "1位でフィニッシュ。",
"Ramping up": "右肩上がり",
"Three or more straight games, each higher than the last.": "3ゲーム以上連続で、前のゲームよりスコアアップ。",
"Strong finish": "有終の美",
"Last game 50+ pins above the average of the rest.": "最終ゲームが、それまでのゲームのアベレージを50ピン以上上回る。",
"Cashed a side pot": "サイドポット獲得",
"Won a side pot at an event.": "大会でサイドポットを獲得しました。",
"Squeaked in": "滑り込み",
"Made the cut by 10 pins or fewer.": "10ピン差以内で予選を通過しました。",
"First drill": "初めてのドリル練習",
"Logged your first drill.": "初めてドリル練習を記録しました。",
"Repeat customer": "常連さん",
"Same target, five separate sessions.": "同じターゲットを、別々の5セッションで練習。",
"Trending up": "上昇傾向",
"Conversion rate rose across five weeks.": "5週間にわたって成功率が上がりました。",
"Century": "100本ノック",
"100 attempts at one target.": "1つのターゲットに100回挑戦。",
"Graduated": "卒業",
"80%+ on a target, over at least 20 attempts.": "1つのターゲットで成功率80%以上（20回以上挑戦）。",
"Drilled two different targets in one session.": "1回のセッションで2つの異なるターゲットを練習しました。",
"Burned the midnight oil": "居残り練習",
"A practice session of 50+ deliveries.": "1回の練習セッションで50投以上。",
"That file is empty.": "ファイルが空です。",
"game 1": "1ゲーム目",
"game 2": "2ゲーム目",
"game 3": "3ゲーム目",
"no scores on that row": "この行にスコアがありません",
"a game is blank between two scores": "2つのスコアの間に空欄のゲームがあります",
"Nothing in that file could be imported.": "このファイルには取り込めるデータがありませんでした。",
"4 Pin": "4番ピン",
"6 Pin": "6番ピン",
"2 Pin": "2番ピン",
"3 Pin": "3番ピン",
"3-6-10 (bucket-ish)": "3-6-10（バケット風）",
"2-4-5 (bucket)": "2-4-5（バケット）",
"Strike Ball (pocket hits)": "ストライクボール（ポケットヒット）",
"Pocket": "ポケット",
"Custom": "カスタム",
"Failing row contains (*)": "",
"No errors recorded.": "",
"Couldn't connect. Check your signal and try again.": "接続できませんでした。電波状況を確認して、もう一度お試しください。",
"Your sign-in has expired. Sign out and back in, then try again.": "ログインの有効期限が切れました。いったんログアウトしてから再度ログインし、もう一度お試しください。",
"Something went wrong. Try again in a few minutes.": "問題が発生しました。数分後にもう一度お試しください。",
"Why do I keep leaving the 10?": "どうして10番ピンがよく残るの？",
"Which ball carries best for me?": "一番キャリーが出るボールはどれ？",
"Do I fade late in a set?": "後半のゲームになるとスコアが落ちている？",
"Back tomorrow": "また明日",
"Games logged": "",
"Strike percentage": "",
"Spare percentage": "",
"Single-pin spare percentage": "",
"Split conversion percentage": "",
"Open frames per game": "1ゲームあたりのオープンフレーム",
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
"Most common leave": "最も多い残りピン",
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
"Your running average across all games in the current view.": "表示中の全ゲームの累計アベレージ。",
"Your best single game.": "1ゲームの最高スコア。",
"Your best series total.": "シリーズ合計の最高スコア。",
"Share of first balls that strike.": "1投目がストライクになった割合。",
"spare attempts": "スペア機会",
"Non-split spare conversion.": "スプリットを除くスペアの成功率。",
"Single Pin Spare %": "1本残りスペア率",
"single-pin attempts": "1本残りのスペア機会",
"Conversion on leaves of exactly one pin.": "ちょうど1本だけ残ったときのスペア成功率。",
"10 Pin Spare %": "10番ピンのスペア率",
"10 pin attempts": "10番ピンのスペア機会",
"Conversion on a lone corner pin (including weak and ringing ones).": "コーナーピン1本残りのスペア成功率（ウィーク、リンギングも含む）。",
"Frames closed with a strike or a spare.": "ストライクまたはスペアで締めたフレーム。",
"7 pin": "7番ピン",
"single-pin spares": "1本残りのスペア",
"keep clean": "クリーンに保つ",
"to collect, and they're not all about bowling well:": "個のバッジを集められます。好成績が条件のものばかりではありません：",
"Start a session": "セッションを開始",
"new night": "新規記録",
"league night": "リーグの日",
"On the Bowl tab, pick where you're bowling — practice, league, tournament or just bowling. For league, choose which league and the date. The app remembers your usual night, so on a regular Tuesday it sets itself up.": "「投球」タブで、どこで投げるかを選びます（練習、リーグ、大会、フリー投球）。リーグの場合は、リーグと日付を選択します。アプリはいつもの曜日を覚えているので、普段どおりの火曜日なら自動で設定されます。",
"Frame tracking vs game tracking": "フレームごとの記録とゲーム単位の記録",
"Frame tracking records every ball — pins left, ball used, release. That's what powers spare stats, the scoresheet and ball comparisons. Scores only takes three numbers a night. You can switch any time, and start a night one way and finish the other: unlock the score boxes to type totals even mid-game.": "フレームごとの記録では、1投ごとに残りピン、使ったボール、リリースを記録します。スペアの統計、スコアシート、ボールの比較はこのデータをもとにしています。「スコアのみ」なら1日に3つの数字を入力するだけです。いつでも切り替えられ、1日の途中で方式を変えることもできます：スコア欄のロックを解除すれば、ゲームの途中でも合計を入力できます。",
"The ten-frame scoresheet": "10フレームのスコアシート",
"edit frame": "フレーム編集",
"running score": "累計スコア",
"On frame tracking, the ten frames sit between the frame picker and the result buttons. It fills in as you bowl. Tap any frame to edit it. Tapping an empty frame while editing cancels the edit; tapping the next frame when your shot is complete saves it.": "フレームごとの記録では、フレーム選択と結果ボタンの間に10フレームが並び、投げるにつれて埋まっていきます。フレームをタップすると編集できます。編集中に空のフレームをタップすると編集をキャンセルし、投球の入力が済んだ状態で次のフレームをタップすると保存されます。",
"Delete a shot": "投球を削除",
"wrong frame": "フレーム間違い",
"Tap the frame on the scoresheet to open it, then either press Delete this shot, or deselect the result — clearing what happened deletes the frame. Both ask you to confirm, because it can't be undone.": "スコアシートのフレームをタップして開き、「削除」を押すか、結果の選択を解除します — 結果を消すとそのフレームが削除されます。元に戻せないため、どちらの場合も確認が表示されます。",
"Prebowl for a future week": "先の週の分を事前投球する",
"miss next week": "来週欠席",
"Bowling next week's league games early? Turn on Prebowling in Tonight's Session. The games are filed under the date they count for, not the day you threw them — so you can prebowl and bowl tonight's league on the same night without one overwriting the other.": "来週のリーグのゲームを先に投げますか？「今日のリーグ」で事前投球をオンにしてください。ゲームは投げた日ではなく、カウントされる日付で保存されます — そのため、同じ日に事前投球と今日のリーグの両方を投げても、どちらかが上書きされることはありません。",
"Side games and buy-ins": "サイドゲームと参加費",
"side pot": "サイドポット",
"high game": "ハイゲーム",
"buy in": "参加費",
"money games": "賞金ゲーム",
"Buy-ins are saved per league — enter them once and they apply every week. Each night, tap the pots you're actually in; sitting one out costs you nothing. Hide pots your house doesn't run in Settings.": "参加費はリーグごとに保存されます — 一度入力すれば毎週適用されます。毎回、実際に参加するポットをタップしてください。参加しないポットの分はかかりません。通っているボウリング場にないポットは「設定」で非表示にできます。",
"Import a scorecard photo": "スコアシートの写真を取り込む",
"Press Import in the header. Say whether it's practice, league or a tournament, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving.": "ヘッダーの「取り込む」を押します。練習・リーグ・大会のどれかを選び、チームと日付を選んでから、スコアモニターの写真を追加します。アプリがゲームとフレームを読み取るので、保存する前に各列をボウラーに割り当ててください。",
"Send teammates their scores": "チームメイトにスコアを送る",
"share scores": "スコアを共有",
"frame data": "フレームデータ",
"Any column you map to a teammate is sent to them to confirm. They get the frame-by-frame data too, not just totals — once they accept, it lands in their shot history marked as imported.": "チームメイトに割り当てた列は、確認のため本人に送られます。合計だけでなく、フレームごとのデータも届きます — 本人が承認すると、取り込みの印が付いて投球履歴に追加されます。",
"Compare yourself to someone": "ほかのボウラーと比較する",
"head to head": "直接対決",
"team average": "チームアベレージ",
"On the Stats tab, use Compare To. You can compare against a bowler on your device, a friend, or your team's average. Teammates are added as friends automatically, so they're there without sending a request.": "「成績」タブで「比較相手」を使います。この端末に登録しているボウラー、フレンド、またはチームのアベレージと比較できます。チームメイトは自動的にフレンドに追加されるので、申請を送らなくても選べます。",
"Trends over time": "成績の推移",
"over time": "時系列",
"per ball": "ボール別",
"Switch to Trends on the Stats tab to see a metric plotted over time. Filter by ball to see how one piece of equipment is performing — that works on game scores too, if you record which ball bowled which game.": "「成績」タブで「推移」に切り替えると、指標の推移がグラフで表示されます。ボールで絞り込むと、そのボール1個の性能がわかります — どのゲームをどのボールで投げたか記録していれば、ゲームスコアでも使えます。",
"Set a goal": "目標を設定する",
"On the Improve tab, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "「上達」タブで「目標を追加」を押し、取り組む項目を選びます — アベレージ、ストライク率、スペアメイク率など。投球するたびに進捗が更新されます。",
"Practice drills": "ドリル練習",
"spare shooting": "スペア練習",
"Start a drill from the Improve tab. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "「上達」タブからドリル練習を始めます。狙う対象 — 特定のスペアやピンの組み合わせ — を選ぶと、そのセッションの成功と失敗をアプリが記録します。",
"A coach sees every bowler they work with on one roster: what each is working on, how far along, and when the next session is. Tasks are set per bowler, and the bowler sees them on their Improve tab.": "コーチは、指導しているボウラー全員を1つの一覧で確認できます。それぞれが何に取り組んでいて、どこまで進んでいるか、次のレッスンはいつかがひと目でわかります。課題はボウラーごとに設定し、ボウラーは自分の「上達」タブで確認します。",
"add league": "リーグを追加",
"On the Setup tab, under League, add a league with its name, center and season dates. Season dates let the app prompt you to update your book average when the season ends.": "「準備」タブの「リーグ」で、名前、ボウリング場、シーズン期間を入力してリーグを追加します。シーズン期間を入れておくと、シーズン終了時に公認アベレージを更新するようアプリがお知らせします。",
"Add a team and its roster": "チームとメンバーを追加する",
"not signed up": "未登録",
"hasn't joined": "未参加",
"email required": "メールアドレス必須",
"bowling order": "投球順",
"add a teammate": "チームメイトを追加",
"Teams live under their league on the Setup tab — add a league under League, then add your team under Team. Open the team to set the bowling order and add each teammate by name and email. The email is required: it's what connects them to their spot when they sign up. Teammates who haven't joined yet still work — you can log their scores straight away, and everything you've recorded is waiting for them when they accept the invite.": "チームは「準備」タブで各リーグの下にあります — 「リーグ」でリーグを追加してから、「チーム」でチームを追加します。チームを開いて投球順を設定し、チームメイトを名前とメールアドレスで1人ずつ追加します。メールアドレスは必須です。本人が登録したときに、自分の枠と紐づけるために使います。まだ参加していないチームメイトもそのまま使えます — すぐにスコアを記録でき、記録した内容はすべて、本人が招待を承認したときに引き継がれます。",
"Your ball arsenal": "ボールのアーセナル",
"Add your balls on the Setup tab, under Balls, with layout and surface. Balls you log shots with feed the per-ball stats and the trend filters. Bags, the next tab over, let you group what you actually carry.": "「準備」タブの「ボール」で、レイアウトとサーフェスを入力してボールを追加します。投球を記録したボールは、ボール別の成績と推移のフィルターに反映されます。隣のタブの「バッグ」では、実際に持ち歩くボールをまとめられます。",
"add friend": "フレンドを追加",
"Search for someone by name and send a request. Teammates are added automatically. Friends can compare stats with each other. There's also a QR code here for handing someone the app link.": "名前で検索して申請を送ります。チームメイトは自動的に追加されます。フレンド同士で成績を比較できます。アプリのリンクを渡すためのQRコードもここにあります。",
"Your name and profile": "名前とプロフィール",
"two handed": "両手投げ",
"book average": "公認アベレージ",
"Set your display name — that's what teammates see. Also here: handedness, book average, home centers, and scorecard names, which are the other spellings of your name that appear on a printed scorecard so imports match you correctly.": "表示名を設定します — チームメイトにはこの名前が表示されます。ほかにも、利き手、公認アベレージ、よく行くボウリング場、スコアシート上の名前を設定できます。スコアシート上の名前とは、印刷されたスコアシートに載る自分の名前の別表記のことで、取り込み時に正しく本人と照合されるようにするためのものです。",
"Your history": "自分の履歴",
"Every night you've bowled and every shot you've logged. Filter by team or result. You only see your own — teammates keep theirs.": "これまで投げたすべての日と、記録したすべての投球です。チームや結果で絞り込めます。表示されるのは自分の記録だけです — チームメイトの記録はそれぞれ本人のものです。",
"Honor scores, personal bests and badges": "オナースコア、自己ベスト、バッジ",
"perfect game": "パーフェクトゲーム",
"honor score": "オナースコア",
"personal best": "自己ベスト",
"high series": "ハイシリーズ",
"A 300 game or an 800 series is called out automatically. So is beating your own best game or series — set your all-time bests in your profile so it has something to beat from day one. At a tournament you can record how you finished, and a win gets its own badge. All of them can be shared.": "300ゲームや800シリーズは自動的に表示されます。自己ベストのゲームやシリーズを更新したときも同じです — プロフィールに歴代ベストを設定しておけば、初日から更新する目標ができます。大会では最終結果を記録でき、優勝すると専用のバッジがもらえます。どれも共有できます。",
"Adding a teammate without their email": "メールアドレスなしでチームメイトを追加する",
"signup code": "登録コード",
"team code": "チームコード",
"invite code": "招待コード",
"no email": "メールなし",
"don't have their email": "メールアドレスがわからない",
"text them": "メッセージで送る",
"When you add a teammate, tick \"I don't have their email\" and you'll get a short code to text them. They enter it when they sign up and land straight on that roster spot, with everything you've already logged under their name.": "チームメイトを追加するときに「コードをメッセージで送る」を選ぶと、相手にメッセージで送れる短いコードが表示されます。相手が登録時にそのコードを入力すると、そのメンバー枠にそのまま入り、すでに本人の名前で記録した内容もすべて引き継がれます。",
"Split conversion by type": "スプリットの種類別メイク率",
"baby split": "ベビースプリット",
"big four": "ビッグフォー",
"greek church": "グリークチャーチ",
"which splits": "どのスプリット",
"Splits are broken out by type, not lumped into one number — the 4-7-10 and the 3-10 are different problems. The Stats tab shows how often you leave each one and how often you convert it, with the well-known ones named.": "スプリットは1つの数字にまとめず、種類ごとに分けて集計します — 4-7-10と3-10では、まったく別の課題だからです。「成績」タブでは、それぞれをどれくらい残し、どれくらいメイクしているかが表示され、よく知られたスプリットには名前も付いています。",
"Changing how the app looks": "アプリの見た目を変える",
"App appearance in Settings. Glow is the default — rock'n'bowl green on warm black — and there are several others if you'd rather something calmer.": "「設定」の「アプリの外観」で変更できます。デフォルトは「グロー」 — 温かみのある黒にロックンボウル風のグリーン — で、もっと落ち着いた見た目がよければ、ほかにもいくつか用意しています。",
"Recording how a tournament finished": "大会の最終結果を記録する",
"made the cut": "予選通過",
"runner up": "準優勝",
"how did i do": "何位だった",
"At the end of a tournament, say how it finished — won it, runner-up, top five, cashed, or made the cut. The app can't work this out from your scores, since it doesn't know what anyone else shot. A win becomes a badge you can share.": "大会の終わりに、最終結果を記録します — 優勝、準優勝、トップ5、賞金圏入り、予選通過。アプリはほかの人のスコアを知らないので、自分のスコアだけでは結果を判断できません。優勝は共有できるバッジになります。",
"who won": "誰が勝った",
"just bowling": "フリー投球",
"who's best": "誰が一番",
"Everyone you've added to an Open bowling scoresheet turns up in the Standings, ordered by average, with how many games they've bowled, their best single game, and the badges they've earned. It builds up over time, so the more nights you log the more there is to argue about.": "フリー投球のスコアシートに追加した人は全員「順位表」に表示されます。アベレージ順に並び、投げたゲーム数、1ゲームのベストスコア、獲得したバッジも表示されます。記録は少しずつ積み重なるので、記録する日が増えるほど、言い合うネタも増えていきます。",
"Where did everything go?": "いろいろ消えてしまいましたか？",
"where is": "どこ",
"no stats": "成績がない",
"no history": "履歴がない",
"tabs missing": "タブが消えた",
"wrong mode": "モードが違う",
"went back": "元に戻す",
"If you picked Open bowling, the app hides everything that mode doesn't use — History, Stats, Improve and Gear. Nothing is deleted; it's all still there. Go to the Bowl tab, find the card at the top showing what you're bowling, tap Change, and pick Practice, League or Tournament. Everything comes straight back.": "フリー投球を選ぶと、そのモードで使わないもの — 「履歴」「成績」「上達」「用具」 — が非表示になります。何も削除されていません。すべてそのまま残っています。「投球」タブを開き、上部にある今のモードを示すカードで「変更」をタップして、「練習」「リーグ」「大会」のいずれかを選んでください。すぐにすべて元どおり表示されます。",
"Entering scores for the group": "グループのスコアを入力する",
"add someone": "人を追加",
"who's bowling": "記録するボウラー",
"Names down the side, games across the top. Tap a cell and type the final score for that game — totals add themselves. Add whoever's on the lane with the box underneath and they become a row; they don't need the app or an account. Bowl more than a few games and the scores slide across while the names stay put.": "名前は縦に、ゲームは横に並びます。マスをタップしてそのゲームの最終スコアを入力すると、合計は自動で計算されます。レーンにいる人を下の入力欄で追加すると、その人の行ができます。アプリやアカウントは必要ありません。ゲーム数が多くなると、名前はそのままでスコアが横にスクロールします。",
"The badges you can earn": "獲得できるバッジ",
"how do i get": "獲得方法",
"Tips: rolling a better ball": "コツ：もっといいボールを投げる",
"how to bowl": "投げ方",
"help me bowl": "上手くなりたい",
"new to bowling": "ボウリング初心者",
"Pick a ball you can hold comfortably — too heavy and you'll throw it with your arm instead of letting it swing. Aim at the arrows on the lane, not the pins: they're much closer, so they're far easier to hit consistently. Let your arm swing like a pendulum rather than pushing, and try to finish with your hand up where you were aiming. Most beginners improve more from rolling the same ball the same way twice than from anything else.": "無理なく持てるボールを選びましょう — 重すぎると、振り子のように振らずに腕の力で投げてしまいます。狙うのはピンではなく、レーン上のスパットです。ずっと近いので、はるかに安定して狙えます。押し出すのではなく振り子のように腕を振り、最後は狙った方向に手を上げて終わるようにしましょう。初心者の多くにとって、何よりも上達につながるのは、同じボールを同じように2回続けて投げることです。",
"Tips: picking up spares": "コツ：スペアを取る",
"corner pin": "コーナーピン",
"second ball": "2投目",
"pick up": "残りピンを取る",
"Spares are where casual scores are won. If pins are left on the right, move your feet LEFT and aim across the lane at them; if they're on the left, move right. It feels backwards and it works. For a single pin, aim at the arrow closest to it rather than staring at the pin. Converting even half your spares will do more for your score than any strike will.": "フリー投球でスコアの差がつくのはスペアです。右側にピンが残ったら、立ち位置を「左」に移し、レーンを斜めに横切るように狙います。左側に残ったら右に移ります。逆に感じますが、これで取れます。1本だけ残ったときは、ピンを見つめるのではなく、そのピンに一番近いスパットを狙いましょう。スペアを半分取れるようになるだけでも、どんなストライクよりスコアが伸びます。",
"Tips: how scoring actually works": "コツ：スコアの本当の仕組み",
"how does scoring work": "スコアの計算方法",
"what is a turkey": "ターキーとは",
"Ten frames, two balls each. All ten pins on the first ball is a strike, and you get the next two balls added on top. Knocking them all down across both balls is a spare, and you get the next one ball added. That's why strikes are worth chasing — a good game is mostly about not leaving gaps rather than striking every frame. Three strikes in a row is a turkey. A perfect game is 300.": "10フレームで、各フレーム2投です。1投目で10本すべて倒すとストライクで、次の2投分が加算されます。2投で全部倒すとスペアで、次の1投分が加算されます。だからストライクは狙う価値があるのです — とはいえ、いいゲームにするには、毎フレームストライクを取るより、オープンフレームを作らないことが大切です。3回連続のストライクがターキー。パーフェクトゲームは300点です。",
"Tips: making the night better": "コツ：もっと楽しい1日にする",
"night out": "みんなで遊ぶ",
"what to do": "何をする",
"first time": "初めて",
"Bowl in the same order each game so it stays easy to follow. Ask for bumpers if anyone's small — nobody minds and it keeps everyone in it. Lighter balls are usually on the racks nearest the lanes. If someone's having a rough game, remember there's a badge for it. Rented shoes are meant to slide, so don't fight it on the approach.": "毎ゲーム同じ順番で投げると、わかりやすくなります。小さな子どもがいたら、バンパー（ガターガード）を頼みましょう — 誰も気にしませんし、みんなが楽しめます。軽いボールは、たいていレーンに一番近いラックにあります。調子の悪い人がいたら、それ用のバッジもあることを思い出してください。レンタルシューズは滑るように作られているので、アプローチでは逆らわないようにしましょう。",
"Syncing and offline use": "同期とオフライン利用",
"Everything is saved on your phone first and uploaded when there's a connection, so you can log a whole night on bad alley wifi. If something can't upload, the app says so and keeps retrying — nothing is lost.": "すべてまずスマホに保存され、接続できたときにアップロードされるので、ボウリング場のWi-Fiが不安定でも1日分まるごと記録できます。アップロードできないものがあればアプリがお知らせし、再試行を続けます — 何も失われません。",
"Appearance and settings": "外観と設定",
"Change the theme in Settings, along with which stats cards you see, which side games are shown, and whether frame tracking fields like ball speed and rev rate appear.": "「設定」では、テーマのほか、表示する成績カード、表示するサイドゲーム、球速や回転数などフレーム記録の項目を表示するかどうかも変更できます。",
"Importing": "取り込み",
"Improving": "上達",
"Leagues, teams and gear": "リーグ、チーム、用具",
"Your profile": "自分のプロフィール",
"Good to know": "知っておくと便利",
"no record": "記録が見つかりません",
"own scores": "自分のスコア",
"the bowler has already responded": "ボウラー本人がすでに応答しています",
"only a teammate with verified scores of their own can correct this": "自分のスコアが確認済みのチームメイトだけが修正できます",
"wait until the next session has finished": "次の投球日が終わるまでお待ちください",
"bowler did not respond before the next session ended": "ボウラー本人が次の投球日の終わりまでに応答しませんでした",
"no corrected scores supplied": "修正後のスコアが入力されていません",
"Confirmed by the bowler.": "ボウラー本人が確認しました。",
"Corrected by the bowler.": "ボウラー本人が修正しました。",
"Rejected — these scores need to be entered again.": "却下 — これらのスコアは再入力が必要です。",
"Already logged by the bowler — nothing to confirm.": "ボウラー本人が記録済み — 確認は不要です。",
"From an imported scorecard, not yet confirmed.": "取り込んだスコアシートからの記録で、まだ確認されていません。",
"Scores to check": "確認待ちのスコア",
"A teammate imported these from a scorecard photo. They already count — confirming marks them checked.": "チームメイトがスコアシートの写真から取り込んだスコアです。すでに成績に反映されています — 確認すると確認済みになります。",
"A night needs re-entering": "1日分の再入力が必要です",
"You said these weren't yours, so they've stopped counting.": "自分のスコアではないと回答したため、成績に反映されなくなりました。",
"Nobody confirmed these and a session has since finished. You can correct them.": "これらは誰にも確認されないまま、その後の投球日が終了しました。修正することができます。",
"Accept or decline on the Coach tab.": "「コーチ」タブで承認または拒否してください。",
"Work your coach has set for you.": "コーチから出された課題です。",
"They've marked work done or reported how far they got.": "課題の完了や、どこまで進んだかの報告が届いています。",
"Accept or decline on the Social tab.": "「フレンド」タブで承認または拒否してください。",
"Joining lets teammates import your scores from a scorecard photo.": "参加すると、チームメイトがスコアシートの写真からスコアを取り込めるようになります。",
"Anyone on the team can approve it on the Team tab.": "チームの誰でも「チーム」タブで承認できます。",
"Book average needs updating": "公認アベレージの更新が必要です",
"A league season has finished.": "リーグのシーズンが終了しました。",
"Other bowlers voted them down. Check and resubmit if you think they were right.": "他のボウラーの投票で却下されました。正しいと思う場合は、確認して再提出してください。",
"Strike rate": "ストライク率",
"Spare conversion": "スペアメイク率",
"Corner pin conversion": "コーナーピンのメイク率",
"Trend over time": "時系列の推移",
"Game-by-game fade": "ゲームごとの失速",
"Consistency": "安定度",
"Form vs book average": "調子と公認アベレージの比較",
"Single-pin spares": "1本残りのスペア",
"Single corner pin spares": "コーナーピン1本残りのスペア",
"Average by game (1st, 2nd, 3rd)": "ゲーム順別アベレージ（1・2・3ゲーム目）",
"Score spread": "スコアのばらつき",
"Ball comparison": "ボール比較",
"Center-by-center averages": "ボウリング場別アベレージ",
"Drill results": "ドリル練習の結果",
"Oil pattern averages": "オイルパターン別アベレージ",
"Overall": "全体",
"How it finished": "最終結果",
"Broke 50": "50点突破",
"Broke 75": "75点突破",
"First 100 game": "初の100アップ",
"Broke 125": "125点突破",
"First 150 game": "初の150アップ",
"Broke 175": "175点突破",
"First 200 game": "初の200アップ",
"Broke 225": "225点突破",
"First 250 game": "初の250アップ",
"Broke 275": "275点突破",
"First 200 series": "初の200シリーズ",
"First 300 series": "初の300シリーズ",
"First 400 series": "初の400シリーズ",
"First 500 series": "初の500シリーズ",
"First 600 series": "初の600シリーズ",
"First 800 series": "初の800シリーズ",
"First night logged": "初めての投球日を記録",
"Five nights in": "投球5日目",
"Ten nights in": "投球10日目",
"Twenty-five nights": "通算25日",
"Fifty nights": "通算50日",
"A hundred nights": "通算100日",
"First strike": "初ストライク",
"First spare": "初スペア",
"Two strikes in a row": "2連続ストライク",
"First turkey": "初ターキー",
"Four in a row": "4連続ストライク",
"Five in a row": "5連続ストライク",
"Converted a split": "スプリットをメイク",
"Converted the big four": "ビッグフォーをメイク",
"First cash": "初の賞金圏入り",
"House": "ハウスコンディション",
"a tournament": "大会",
"just for fun": "フリー投球",
"Not enough history yet — you'll be asked once a day until a pattern shows up.": "まだ履歴が足りません — 傾向が見えてくるまで、1日1回確認します。",
"Dual Angle": "デュアルアングル",
"VLS (Pin Buffer)": "VLS（ピンバッファー）",
"2LS (Two-Handed)": "2LS（両手投げ）",
"Drilling Angle": "ドリリングアングル",
"VAL Angle": "VALアングル",
"Pin Buffer": "ピンバッファー",
"Not a number": "数値ではありません",
"You're the last member, so the team will be left empty.": "最後のメンバーのため、チームには誰もいなくなります。",
"Your past scores and averages stay.": "これまでのスコアとアベレージは残ります。",
"Standard scoring.": "通常のスコア計算。",
"Nine on the first ball counts as a strike.": "1投目で9本倒すとストライクとして扱います。",
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
"Won every match.": "全試合に勝利しました。",
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
"Sport": "スポーツ",
"Frame tracking": "フレームごとの記録",
"Game tracking": "ゲーム単位の記録",
"Every frame — strikes, spare conversions, open frames and how each ball carried.": "すべてのフレームを記録 — ストライク、スペアメイク、オープンフレーム、各投球でピンがどう倒れたかまで。",
"The final score for each game. Fast, and still tracks averages and trends.": "各ゲームの最終スコアだけを記録。入力が速く、アベレージや推移も確認できます。",
"Season Record": "シーズン成績",
"Hung": "ひとり置いてけぼり",
"Shots / Strike % / Spare %": "投球数 / ストライク率 / スペア率",
"My Records": "自分の記録",
"Clean Frames": "クリーンフレーム",
"Ten Pin Leaves": "10番ピン残り",
"Single Pin Spares": "1本残りのスペア",
"Hand Up": "手を挙げて",
"Longest Strike Streak": "ストライク最長連続",
"Strike % Through the Night": "その日のストライク率の推移",
"Ball vs Ball": "ボール同士の比較",
"A practice session": "練習セッション",
"A league night": "リーグの日",
"A tournament": "大会",
"There's no wrong answer. Each one just changes which screens you see, and you can switch at any time from the Bowl tab or Settings.": "正解・不正解はありません。選んだものによって表示される画面が変わるだけで、「投球」タブや「設定」からいつでも切り替えられます。",
"For working on your game. Drills, frame tracking and every detail field are available, and practice scores stay out of your league averages.": "自分のプレーを磨くためのモードです。ドリル練習、フレームごとの記録、すべての詳細項目が使え、練習のスコアはリーグのアベレージに含まれません。",
"For your weekly team night. Your team roster and standings are available, along with side games.": "毎週チームで投げるリーグの日に。チームのメンバーと順位表に加えて、サイドゲームも使えます。",
"For higher-stakes competition. Blocks, squads, side pots, brackets, match play and the cut line are all available.": "より真剣勝負の競技に。ブロック、シフト、サイドポット、ブラケット、マッチプレー、カットラインがすべて使えます。",
"For a fun activity. You get the scoresheet, standings and badges — all other views are hidden, not deleted, to keep it quick and simple.": "気軽に楽しむために。スコアシート、順位表、バッジが使えます — ほかの画面は削除ではなく非表示になり、手早くシンプルに使えます。",
"no sessions logged": "記録された日がありません",
"PRODID:-//Bowling Tracker//EN": "",
"Retired": "引退",
"This fill ball count may not be reliably read from the scorecard image -- please verify the pin count manually before saving.": "このフィルボールのピン数は、スコアシートの画像から正確に読み取れていない可能性があります -- 保存する前にピン数を手動で確認してください。",
"so a game may be missing from the photo": "写真に写っていないゲームがあるかもしれません",
"so one of the game scores was probably misread": "いずれかのゲームのスコアが誤読された可能性があります",
"so a frame was probably misread": "いずれかのフレームが誤読された可能性があります",
"so the total was probably misread": "合計スコアが誤読された可能性があります",
"Keeping the book for the team? Add your teammates and log their shots too.": "チームのスコアを付けていますか？チームメイトを追加して、その投球も記録しましょう。",
"Practising with someone? Add them to compare sessions afterwards. Their scores stay on this device.": "誰かと一緒に練習していますか？追加すると、あとでセッションを比較できます。追加した人のスコアはこの端末にのみ保存されます。",
"Bowling with others? Add them to keep everyone's score. Their scores stay on this device.": "ほかの人と一緒に投げていますか？追加すると全員のスコアを付けられます。追加した人のスコアはこの端末にのみ保存されます。",
"on target": "狙いどおり",
"board must be a number": "ボードは数値で入力してください",
"Winner": "勝者",
"Best Single Game": "ベストゲーム",
"— that's a real game.": "— これぞ本物のゲーム。",
"Biggest Comeback": "最大の巻き返し",
"Ran Out Of Steam": "息切れ",
"Most Consistent": "安定感ナンバーワン",
"Pick the date these games count for.": "このゲームをどの日の分として記録するか選んでください。",
"That's today — prebowled games count for a future date.": "その日付は今日です — 事前投球は今後の日付の分として記録されます。",
"That date has passed. Prebowled games count for an upcoming session.": "その日付は過ぎています。事前投球は今後のリーグの日の分として記録されます。",
"You already have a session on that date. Saving would overwrite it.": "その日付にはすでに記録があります。保存すると上書きされます。",
"Bowled": "投球結果",
"Practice session": "練習セッション",
"Just for fun": "フリー投球",
"system-ui, sans-serif": "",
"Clean card — no open frames": "全ゲームノーミス — オープンフレームなし",
"No nights bowled yet.": "まだ投球記録がありません。",
"WON IT": "優勝",
"TOP FIVE": "トップ5",
"MADE THE CUT": "予選通過",
"Bracket": "ブラケット",
"Eliminator": "エリミネーター",
"Side Pot": "サイドポット",
"Optional": "オプション",
"Big four": "ビッグフォー",
"Greek church": "グリークチャーチ",
"Baby split": "ベビースプリット",
"Bucket split": "バケット",
"Casual": "フリー投球",
"stat unlocks": "成績のロック解除",
"stats unlock": "成績のロック解除",
"use frame tracking": "フレームごとの記録を使う",
"note which ball bowled each game": "各ゲームで使ったボールを記録する",
"Rates": "各種率",
"Records": "自己ベスト",
"Single pins": "1本残り",
"Other leaves": "その他の残りピン",
"First ball": "1投目",
"Ladder under way.": "ステップラダー進行中。",
"Waiting for a better connection": "接続が安定するのを待っています",
"Your scores are saved on this phone and will upload on their own.": "スコアはこの端末に保存されていて、自動でアップロードされます。",
"Something was already saved": "すでに保存済みのデータがあります",
"This looks like a duplicate of something already in the cloud. Your scores are safe — this copy just isn't needed.": "クラウドにすでにあるデータと重複しているようです。スコアは無事です — このコピーが不要なだけです。",
"Not allowed to save this": "保存が許可されていません",
"The app doesn't have permission to save this. Nothing is lost on this phone, but it can't reach the cloud until this is fixed.": "アプリにこのデータを保存する権限がありません。この端末上のデータは失われていませんが、問題が解決するまでクラウドには送信できません。",
"This didn't save correctly": "正しく保存されませんでした",
"Something about this entry doesn't fit what the cloud expects. Your scores are still on this phone.": "この記録の内容がクラウドの想定する形式と合っていません。スコアは引き続きこの端末に残っています。",
"Couldn't upload yet": "まだアップロードできていません",
"Your scores are saved on this phone. The app keeps trying in the background.": "スコアはこの端末に保存されています。アプリがバックグラウンドで再試行を続けます。",
"Maple and amber, like the house lights are down": "メープルとアンバー。場内の照明を落としたような雰囲気",
"Classic": "クラシック",
"Slate and blue, the original look": "スレートとブルー。最初のデザイン",
"Glow": "グロー",
"Rock'n'bowl green on warm black": "ナイトボウリングの蛍光グリーンに、温かみのあるブラック",
"Deep plum with a pink flash": "深いプラムに、ピンクのきらめき",
"Pin deck": "ピンデッキ",
"High contrast, red pin stripe": "ハイコントラスト、ピンの赤いライン",
"Daylight": "デイライト",
"Bright house, maple accents": "明るい場内に、メープルのアクセント",
"Scoresheet": "スコアシート",
"Cream paper, ruled-line blue and split red": "クリーム色の紙に、罫線の青とスプリットの赤",
"Chalk": "チョーク",
"Cool white, quiet blue": "クールなホワイトに、落ち着いたブルー",
"Keeping score": "スコアの記録",
"Home is where a night gets logged. Pick what you're doing from the rows at the top — league, practice, a tournament, just bowling — and the card opens underneath. Enter three game scores, or go ball by ball and record every leave.": "「ホーム」では、その日の記録をつけます。上の列から今日の内容 — リーグ、練習、大会、フリー投球 — を選ぶと、その下にカードが開きます。3ゲームのスコアを入力するか、1投ずつ残りピンをすべて記録していきます。",
"Your gear": "用具",
"Setup starts with your arsenal. On Balls, add a ball, record its layout, surface and specs, and on Bags sort them so tonight's four are one tap away.": "「準備」タブはアーセナルから始まります。「ボール」でボールを追加して、レイアウト、表面、スペックを記録し、「バッグ」で整理しておけば、今日使う4個にワンタップでたどり着けます。",
"Leagues and teams": "リーグとチーム",
"Setup is also where a league gets set up, under League, and a roster filled in, under Team. Scores file against a league, so that's the one thing worth doing first — a team can wait until you want to compare.": "リーグの設定も「準備」タブで行います。リーグは「リーグ」で作成し、メンバーは「チーム」で入力します。スコアはリーグごとに記録されるので、最初にやっておくべきなのはこれだけです — チームは、比較したくなってからで大丈夫です。",
"Stats and trends": "成績と推移",
"Stats breaks your bowling down by ball, by game, by center and by team. The Trends chip charts any of it over time, and the eye on any card hides it.": "「成績」タブでは、ボール別、ゲーム別、ボウリング場別、チーム別に分析できます。「推移」チップではどの項目も時系列のグラフで見られ、各カードの目のアイコンでそのカードを非表示にできます。",
"Your journey": "あゆみ",
"Your road so far: every first, dated, and how close you are to the next one — a few pins from a 700 series, say. Badges collect beside them.": "ここまでのあゆみ：初めて達成したことすべてに日付を添えて残し、次の目標まであとどれくらいかも表示します — たとえば、700シリーズまであと数ピン、といった具合です。バッジはその横に集まっていきます。",
"Calendar and journal": "カレンダーと日誌",
"History keeps every night you've bowled, on a calendar you can scroll back through. The journal gathers every note you've written — on a shot, a drill, a pattern or the end of a night — and you can search them, or filter by kind and date range.": "「履歴」には、これまで投球したすべての日がカレンダーに残り、さかのぼってスクロールできます。日誌には、1投ごと・ドリル練習・オイルパターン・その日の締めくくりなど、書いたメモがすべて集まり、検索や種類・期間での絞り込みもできます。",
"That's enough for now": "今回はここまで",
"You know your way around. If you want more, the settings menu has the rest — keeping score, bowling a tournament, what the AI does, stats, and coaching.": "これで一通り使えるようになりました。さらに知りたいときは、設定メニューに残りのガイドがあります — スコアの記録、大会での投球、AIでできること、成績、コーチ。",
"By game": "ゲーム単位",
"The quickest way in. Type the score for each game and you're done — three numbers, a night logged. Your average, highs and trends all work from this alone.": "いちばん手軽な始め方です。各ゲームのスコアを入力すれば完了 — 数字3つで、その日の記録ができます。アベレージ、ハイスコア、推移はすべてこれだけで分析できます。",
"A strike": "ストライク",
"Going ball by ball, tap Strike and the frame is finished — no pins to pick. Add how it hit if you want it: flush, high, light, a messenger, a Brooklyn.": "1投ずつ記録する場合、「ストライク」をタップすればそのフレームは完了です — ピンを選ぶ必要はありません。当たり方も残したければ追加できます：ジャストポケット、厚め、薄め、メッセンジャー、ブルックリン。",
"A spare": "スペア",
"Tap the pins you left standing, then answer Spare Made. Yes closes the frame. The pins you tap are what feeds your leave and conversion numbers later.": "残ったピンをタップしてから、「スペアメイク」で「はい」か「いいえ」を選びます。「はい」でフレームが完了します。タップしたピンが、あとで残りピンやスペアメイク率の数字のもとになります。",
"An open frame": "オープンフレーム",
"Same start — tap what was standing — then answer No, and tap which of those pins you knocked down. None of them? Just save. The app works out the count.": "途中までは同じです — 残ったピンをタップしたら、「いいえ」と答えて、そのうち倒したピンをタップします。1本も倒せなかったときは、そのまま保存するだけ。本数はアプリが計算します。",
"How the night went": "その日の振り返り",
"The Results chip closes the session: games, series, how it compared to your average, and anything you won. Tap it when you're done and the night is filed.": "「結果」チップでその日を締めくくります：各ゲーム、シリーズ、アベレージとの比較、獲得した賞金。終わったらタップすれば、その日の記録が保存されます。",
"Setting up an event": "大会の設定",
"Pick Tournament on Home and Set up asks what the event is: its name and center, then Style, Scoring and Format. Those three are separate questions, so any mix works — a Baker squad can be handicapped and 9 pin no-tap at once. A handicap event then asks for your pins per game.": "「ホーム」で「大会」を選ぶと、「準備」で大会の内容を尋ねられます：大会名とボウリング場、続いてスタイル、スコア方式、形式です。この3つは別々の質問なので、どんな組み合わせにもできます — ベーカー方式のシフトを、ハンデ付きの9ピンノータップにすることも可能です。ハンデ戦の場合は、続いて1ゲームあたりのハンデのピン数を入力します。",
"Add a block for each day or squad and they become tabs under Scoring. Enter the cut as it's posted — plus or minus against a 200 average — and the app tells you where you stand against it, carrying your earlier blocks in once there's more than one.": "日ごと、またはシフトごとにブロックを追加すると、「スコア入力」の下にタブとして並びます。カットを発表どおり（アベレージ200基準のプラス／マイナス）で入力すると、カットに対する今の位置をアプリが表示します。ブロックが2つ以上になると、それまでのブロックの分も合算します。",
"Making the cut": "予選通過",
"The app never asks whether you made it: the margin already says. What it can't work out is what came next, so each block asks what you qualified for — match play, a stepladder, or neither — and gives you a button straight to it.": "予選を通過したかどうかをアプリが尋ねることはありません：差を見れば分かるからです。アプリに分からないのはその先の展開なので、各ブロックで、マッチプレー・ステップラダー・どちらでもない、のどれに進んだかを尋ね、そこへ直接移動できるボタンを表示します。",
"Each match is your score against an opponent's, with bonus pins for a win or a tie. In a handicap event there's a box for your opponent's handicap too.": "各試合は自分のスコアと相手のスコアの勝負で、勝ちや引き分けにはボーナスピンがつきます。ハンデ戦では、相手のハンデを入力する欄もあります。",
"The stepladder": "ステップラダー",
"Sudden death, so no bonus pins — the higher score advances. Enter your seed and each opponent's, and the app works out where you finished from how far you climbed. Beat the one seed and it says you won it.": "一発勝負なのでボーナスピンはなし — スコアの高い方が勝ち上がります。自分のシードと各対戦相手のシードを入力すると、どこまで勝ち上がったかから最終順位をアプリが計算します。第1シードに勝てば、優勝と表示されます。",
"How the event went": "大会の振り返り",
"Results recaps the whole event broken out by phase, with your brackets and side pots and what they paid. End tournament and view results saves everything on its way there. The Nightcap reads the night back to you, and the share button hands the lot to whoever asks how you did.": "「結果」では、大会全体を段階ごとにまとめ、ブラケットやサイドポットとその配当も表示します。「大会を終了して結果を見る」を押すと、結果画面に移る前にすべて保存されます。Nightcapはその日の投球を振り返ってお伝えし、共有ボタンを使えば、結果を聞いてきた人にまとめて送れます。",
"Photograph the scorecard": "スコアシートを撮影",
"Import, in the header, takes a picture of the monitor or a printed sheet. Every bowler on it, every frame it can read — no typing. It asks what you're importing, so you don't have to set the night up first.": "ヘッダーの「取り込む」で、スコアモニターや印刷されたスコアシートを撮影します。写っているボウラー全員、読み取れるフレームすべて — 入力は不要です。何を取り込むかを尋ねてくれるので、先にその日の設定をしておく必要はありません。",
"Improve reads your own history and tells you what it finds — which ball is carrying, where a spare is leaking, what changed this month. Each one says how confident it is, and while the sample is still small it says so rather than letting you act on a pattern that is really just noise.": "「上達」は自分の履歴を読み取り、見つかったことを教えてくれます — どのボールがキャリーしているか、どこでスペアを落としているか、今月何が変わったか。それぞれに確信度が示され、サンプルがまだ少ないうちはそう伝えます。実際にはただのノイズにすぎない傾向をもとに行動してしまわないためです。",
"The Nightcap": "Nightcap",
"On a league or tournament Results screen, the Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Log the night ball by ball and it pours itself once the night is saved.": "リーグや大会の「結果」画面では、Nightcapがその日の投球を振り返ってお伝えします — 残りピンの傾向、オープンフレームで失ったもの、キャリーしていたボール。1投ずつ記録すれば、その日を保存したときにNightcapが自動で一杯注がれます。",
"Ask Brooklyn": "Brooklynに質問",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. Her lamp sits in the header on every screen, so you never have to go looking. Three wishes a day.": "一般的な数字は「成績」画面で確認できます。Brooklynは、そこでは分からない疑問に答えます — 自分のボウリングについて普段の言葉で質問すると、記録したデータから答えを導き出します。まだ記録していないデータが必要な場合は、何を記録し始めればよいか教えてくれます。ランプはすべての画面のヘッダーにあるので、探す必要はありません。願いごとは1日3回まで。",
"Linking up": "連携",
"Improve has a Coach button. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "「上達」には「コーチ」ボタンがあります。「相手がコーチ」か「自分がコーチ」かを選んで、コードを作成します。8文字を相手に読み上げ、相手のスマホで入力してもらえば連携完了です。",
"Both sides, one screen": "両方の立場を1画面で",
"If you do both, the View chips flip between them: I'm bowling shows what your own coach has sent you, I'm coaching shows your bowlers. A coach sees their pupils' scores without having to add them as a friend, and either of you can end it from your own phone.": "両方の立場がある場合は、「表示」チップで切り替えられます：「ボウラーとして」では自分のコーチから届いたものを、「コーチとして」では指導中のボウラーを表示します。コーチはフレンドに追加しなくても指導中のボウラーのスコアを見られ、どちらの側からも自分のスマホで連携を解除できます。",
"Reading a bowler": "ボウラーの分析",
"Pick a bowler and you get their recent nights and how their shots break down — strikes, spares, the leaves that keep coming back — with the number of shots it's built on shown beside it, so you know how much to trust it.": "ボウラーを選ぶと、最近の投球日と投球の内訳 — ストライク、スペア、繰り返し出る残りピン — が表示され、その数字が何投にもとづくかも横に示されるので、どの程度信頼できるかが分かります。",
"Setting work": "課題を出す",
"A task is something to go and do, with an optional measurable target and a due date — convert 60% of your single-pin spares, say. Leave the target off for anything that isn't a number.": "課題とは、実際に取り組んでもらうことです。測定できる目標（任意）と期限を設定できます — たとえば「1本残りのスペアを60%取る」など。数字で表せないものは、目標を空欄にしてください。",
"Answering back": "報告を返す",
"The bowler marks it done, or records an attempt with the number they actually reached and a note about how it went. Either way it comes back to the coach, so the next thing you set is based on what happened rather than what was asked for.": "ボウラーは完了にするか、実際に達成した数値とその内容についてのメモを添えて挑戦を記録します。どちらの場合もコーチに届くので、次の課題は指示した内容ではなく、実際の結果にもとづいて出せます。",
"Break it down": "内訳を見る",
"The chips across the top slice the same numbers different ways — yours, your team's, by ball, by game, by center.": "上部のチップで、同じ数字をさまざまな切り口で表示できます — 自分、チーム、ボール別、ゲーム別、ボウリング場別。",
"Compare": "比較",
"Put yourself beside a teammate, or against the team as a whole. Same measures, same scale.": "チームメイトと並べたり、チーム全体と比べたりできます。同じ指標、同じ尺度で。",
"When there isn't much data yet": "データがまだ少ないとき",
"Nothing is locked — every card shows its numbers. But a number built on a handful of shots moves more with luck than with you, so until there's enough behind it the card is faded and says how many more shots it needs to be reliable.": "ロックされるものはありません — どのカードも数字を表示します。ただ、わずかな投球数にもとづく数字は、実力よりも運で大きく動きます。そのため、十分なデータがたまるまではカードが薄く表示され、信頼できる数字になるまであと何投必要かが示されます。",
"The trend graph": "推移グラフ",
"Pick the measure, the ball and the league from the three dropdowns, then choose how far back to look — a number of games, a number of days, or two dates. Every game, or one point per night.": "3つのプルダウンで指標、ボール、リーグを選び、どこまでさかのぼるかを決めます — ゲーム数、日数、または2つの日付で。全ゲームを表示するか、1日1ポイントにするかも選べます。",
"Look around": "ひととおり見る",
"What's behind each tab": "各タブでできること",
"By game, or ball by ball": "ゲーム単位、または1投ずつ",
"Bowling a tournament": "大会で投げる",
"Blocks, the cut, match play, the ladder": "ブロック、カット、マッチプレー、ステップラダー",
"What the AI does": "AIでできること",
"Scorecards, insights, Nightcap, Brooklyn": "スコアシート、分析、Nightcap、Brooklyn",
"Breakdowns, comparing, trends": "内訳、比較、推移",
"Linking up, tasks, what comes back": "連携、課題、ボウラーからの報告",
"Your pins, as bowled.": "倒したピン数そのまま。",
"Pins added to every game.": "毎ゲームにピンを加算。",
"You bowl the whole game.": "1ゲームを通して自分で投げます。",
"You and a partner alternate frames.": "パートナーと交互にフレームを投げます。",
"I start": "自分から",
"Partner starts": "パートナーから",
"you and your partner": "自分とパートナー",
"Your own frames still count toward strikes, spares and how each ball carried.": "自分が投げたフレームは、ストライク、スペア、各ボールのキャリーの集計には引き続き含まれます。",
"Average score per night.": "1日ごとの平均スコア。",
"Best Game": "ハイゲーム",
"Your best single game each night.": "各日のハイゲーム。",
"Series Total": "シリーズ合計",
"Total pins each night.": "各日の合計ピン数。",
"First game each night.": "各日の1ゲーム目。",
"Second game each night.": "各日の2ゲーム目。",
"Third game each night.": "各日の3ゲーム目。",
"Share of first balls that struck, per night.": "1投目がストライクになった割合（1日ごと）。",
"Non-split spare conversion, per night.": "スプリット以外のスペアメイク率（1日ごと）。",
"Conversion on a lone corner pin, per night.": "コーナーピン1本残りのメイク率（1日ごと）。",
"Frames closed with a strike or spare, per night.": "ストライクかスペアで締めたフレーム（1日ごと）。",
"No clear direction — the movement here is within normal night-to-night variation.": "はっきりした傾向はありません — この変動は日ごとの通常のばらつきの範囲内です。",
"Days": "日数",
"the start": "最初",
"Drill": "ドリル練習",
"Name it (optional)": "名前（任意）",
"Pins (optional)": "ピン（任意）",
"No ball recorded": "ボール未記録",
"· last time": "· 前回",
"✓ Made": "✓ 成功",
"✗ Missed": "✗ 失敗",
"Undo last": "直前を取り消す",
"Shot notes — what worked on this drill…": "投球メモ — このドリル練習でうまくいったこと…",
"✓ Drill Saved": "✓ ドリル練習を保存しました",
"Throw a few first": "まず何投か投げてください",
"+ Start another drill": "+ 別のドリル練習を開始",
"Saved tonight": "今日保存したドリル練習",
"This screen hit a problem": "この画面で問題が発生しました",
"Your data is safe — nothing was lost. The rest of the app still works, so you can switch to another tab.": "データは安全です — 失われたものはありません。アプリのほかの部分は引き続き使えるので、別のタブに切り替えてください。",
"Try again": "再試行",
"Copy details": "詳細をコピー",
"Unknown": "不明",
"Loading friends…": "フレンドを読み込み中…",
"Add a Friend": "フレンドを追加",
"Search by name…": "名前で検索…",
"No one found with that name.": "その名前のユーザーは見つかりませんでした。",
"Share Sign-In Link": "ログインリンクを共有",
"A quick way to hand someone the app link — scanning this just opens the sign-in screen. It doesn't log anyone in as anyone; each person still enters their own email.": "アプリのリンクを手軽に渡す方法です — これをスキャンしてもログイン画面が開くだけです。誰かが別の人としてログインすることはなく、各自が自分のメールアドレスを入力します。",
"QR code to sign-in page": "ログインページへのQRコード",
"Sent": "送信済み",
"No friends yet — search above to add someone.": "まだフレンドがいません — 上で検索して追加しましょう。",
"⚠️ Your games aren't attributed to your account": "⚠️ ゲームがアカウントにひも付けられていません",
"Your account's display name doesn't match the bowler name your sessions are logged under. Set your name in Teams to fix this.": "アカウントの表示名が、投球記録に使われているボウラー名と一致していません。「チーム」で名前を設定すると解決します。",
"✓ reached": "✓ 達成",
"Not enough data yet —": "まだデータが足りません —",
"before this is worth reporting.": "が揃うと結果を表示します。",
"Nothing logged for this yet.": "まだ記録がありません。",
"Now:": "現在：",
"Target met": "目標達成",
"Pick a statistic first.": "先に統計項目を選んでください。",
"Enter a number.": "数値を入力してください。",
"Goals": "目標",
"Set a target for a statistic you're working on and track progress against it.": "取り組んでいる統計項目に目標を設定して、達成までの進捗を確認しましょう。",
"+ Add a goal": "+ 目標を追加",
"You've set a goal for every statistic available.": "設定できるすべての統計項目に目標を設定済みです。",
"Statistic": "統計項目",
"Choose one…": "選択してください…",
"Needs": "進捗の表示には",
"before progress is shown.": "が必要です。",
"Google signed in but didn't return an ID token. This usually means": "Googleでのログインは完了しましたが、IDトークンが返されませんでした。多くの場合、原因は",
"the sign-in wasn't configured for online mode.": "ログインがオンラインモード用に設定されていないことです。",
"Couldn't sign in with Google. Check your connection and try again.": "Googleでログインできませんでした。接続を確認して、もう一度お試しください。",
"Menu": "メニュー",
"Search help…": "ヘルプを検索…",
"Search help": "ヘルプを検索",
"Search": "検索",
"Name, hand, style, home centers": "名前、利き手、投球スタイル、よく行くボウリング場",
"Theme, stats cards, account": "テーマ、成績カード、アカウント",
"Search help — try 'buy-in' or 'prebowl'": "ヘルプを検索 — 例：「参加費」「事前投球」",
"Show me around the app again": "アプリの案内をもう一度見る",
"Nothing matched \"": "一致する項目なし：「",
"\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".": "」。アプリ内で使われている言葉で検索してみてください — 「スペア」「チーム」「ボール」「取り込み」。",
"This season": "今シーズン",
"Your career": "通算成績",
"League season": "リーグシーズン",
"Between seasons": "シーズンオフ",
"All league play": "すべてのリーグ戦",
"this season": "今シーズン",
"No games yet": "まだゲームがありません",
"Your bowling": "ボウリング記録",
"League average": "リーグアベレージ",
"High game": "ハイゲーム",
"High series": "ハイシリーズ",
"Open full statistics": "すべての成績を見る",
"My Bowling Journey": "My Bowling Journey",
"Your milestones and progress": "マイルストーンと成長の記録",
"Latest milestone": "最新のマイルストーン",
"milestone": "マイルストーン",
"so far": "（累計）",
"Next ·": "次の目標 ·",
"Progress to next milestone": "次のマイルストーンまでの進捗",
"Your bowling story starts here.": "ボウリングのあゆみはここから始まります。",
"What are you doing today?": "今日は何をしますか？",
"Latest ·": "最新 ·",
"That file could not be read.": "そのファイルを読み込めませんでした。",
"Import cancelled. Nothing was saved.": "取り込みをキャンセルしました。何も保存されていません。",
"Nothing to import.": "取り込むデータがありません。",
"Import scores from a file": "ファイルからスコアを取り込む",
"A CSV with four columns:": "4列のCSVファイル：",
". Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.": "。日付は2026-09-17の形式、スコアは0〜300の整数で、1日分は1〜3ゲームです。",
"Import into": "取り込み先",
"Imported (no league)": "取り込み（リーグなし）",
"Leave it as Imported if these nights don't belong to a league you track.": "記録しているリーグの日でなければ、「取り込み（リーグなし）」のままにしてください。",
"What would import": "取り込まれる内容",
"row": "行",
"skipped": "をスキップ",
"Rows that can't be imported": "取り込めない行",
"Row": "行番号",
"and": "ほか",
"you already have": "はすでに記録済み",
"Replace those nights": "その日の記録を置き換える",
"Keep mine, import the other": "手元の記録を残し、残りを取り込む：",
"Cancel the import": "取り込みをキャンセル",
"Importing…": "取り込み中…",
"Imported from a teammate's scorecard photo. These are already counting — confirming just marks them checked.": "チームメイトのスコアシート写真から取り込まれたスコアです。すでに成績に反映されています — 確認しても確認済みの印が付くだけです。",
"Scores read": "読み取ったスコア",
"Frame-by-frame data included for": "フレームごとのデータあり：",
"— confirming adds it to your shot history.": "— 確認すると投球履歴に追加されます。",
"These are right": "合っています",
"Fix them": "修正する",
"What were they actually?": "実際のスコアは？",
"Save corrections": "修正を保存",
"None of these are mine": "どれも自分のスコアではありません",
"Needs You": "要対応",
"Open ›": "開く ›",
"You were added to the roster as": "チームのメンバー表に次の名前で追加されました：",
"a member": "メンバー",
". Teammates will be able to import your scores from a scorecard photo — you still confirm them.": "。チームメイトがスコアシートの写真からスコアを取り込めるようになります — 確認は引き続きご自身で行います。",
"Joining…": "参加処理中…",
"Join team": "チームに参加",
"Invitation": "招待",
"Invitations": "招待",
"Scores To Check": "確認待ちのスコア",
"imported by a teammate.": "のスコアをチームメイトが取り込みました。",
"Needs Re-entering": "再入力が必要",
"You said these weren't yours, so they've stopped counting. Enter them on the Log tab when you have them.": "自分のスコアではないと回答したため、成績に反映されなくなりました。スコアがわかったら「投球」タブで入力してください。",
"Waiting On Teammates": "チームメイトの確認待ち",
"These haven't been confirmed and a session has since finished. You can correct them if you know the real scores.": "これらのスコアは未確認のまま、その後の投球日が終了しました。正しいスコアがわかっていれば修正できます。",
"Correct these": "修正する",
"Couldn't read that scorecard right now. Try again in a few minutes, or enter the scores by hand.": "現在このスコアシートを読み取れません。数分後にもう一度お試しいただくか、スコアを手入力してください。",
"No": "いいえ",
"Which pins did the second ball knock down?": "2投目で倒したピンは？",
"this frame": "本（このフレーム計）",
"Game": "ゲーム",
"No frame-by-frame detail on this scorecard — importing the game score only.": "このスコアシートにはフレームごとの詳細がありません — ゲームのスコアのみ取り込みます。",
"Score": "スコア",
"That isn't a possible game score — type the real one.": "ありえないスコアです — 正しいスコアを入力してください。",
"fill ball": "フィルボール",
"below couldn't be reliably read from the image -- please double-check the pin count.": "（下記）は画像から正確に読み取れませんでした -- ピン数を確認してください。",
"Tap a frame to fix what was read.": "フレームをタップすると、読み取った内容を修正できます。",
"· fill ball — pick a result": "· フィルボール — 結果を選択",
"What are you importing?": "何を取り込みますか？",
"Which team?": "どのチームですか？",
"No teams yet — add one under a league in Team, then import.": "まだチームがありません — 「チーム」でリーグにチームを追加してから取り込んでください。",
"Which tournament?": "どの大会ですか？",
"No tournaments yet — start one on the Bowl tab first.": "まだ大会がありません — 先に「投球」タブで大会を始めてください。",
"Filed as practice — no league or team needed.": "練習として保存されます — リーグやチームの指定は不要です。",
"Date": "日付",
"Couldn't read one of the selected images.": "選択した画像のうち1枚を読み込めませんでした。",
"Couldn't read the selected images.": "選択した画像を読み込めませんでした。",
"The import took too long and was stopped. Try one image at a time.": "取り込みに時間がかかりすぎたため中止しました。画像を1枚ずつお試しください。",
"a Lite model cannot be trusted with pin identities": "",
"frames did not match the printed total": "",
"saw frame detail but read none": "",
"read no frames": "",
"no response": "",
"timed out": "",
"no frames": "",
", mismatched": "",
"The scorecard reader is busy right now — this happens at peak times and usually clears within a few minutes.": "スコアシートの読み取りが現在混み合っています — 混雑する時間帯に起こりやすく、通常は数分で解消します。",
"Read Frames": "フレームを読み取る",
"Read Scores": "スコアを読み取る",
"The scorecard reader's daily allowance is used up. It resets on Google's clock, so this usually means tomorrow — scores typed in by hand save normally in the meantime.": "スコアシート読み取りの1日の上限に達しました。リセットはGoogleの時刻基準で行われるため、通常は翌日になります — その間も手入力したスコアは通常どおり保存されます。",
"The scorecard reader is briefly over its rate limit. Wait about a minute and try again — nothing is lost.": "スコアシート読み取り機能が一時的に利用上限に達しています。1分ほど待ってから、もう一度お試しください — データは失われていません。",
"The scorecard reader isn't available right now. Scores typed in by hand save normally in the meantime.": "スコアシート読み取り機能は現在ご利用いただけません。その間も、手入力したスコアは通常どおり保存されます。",
"Couldn't reach the scorecard reader. Check your signal, or try one image at a time —": "スコアシート読み取り機能に接続できませんでした。電波状況を確認するか、画像を1枚ずつお試しください —",
"a large photo can take too long to send.": "サイズの大きい写真は送信に時間がかかりすぎることがあります。",
"No games could be read from the image(s). Try a clearer screenshot.": "画像からゲームを読み取れませんでした。より鮮明なスクリーンショットでお試しください。",
"Found games but couldn't read any scores or frame detail. Try a clearer screenshot.": "ゲームは見つかりましたが、スコアやフレームの詳細を読み取れませんでした。より鮮明なスクリーンショットでお試しください。",
"Frames you already have will be skipped, so nothing gets double-counted. Anything new on this card still comes in. Continue?": "すでにあるフレームはスキップされるため、二重にカウントされることはありません。このスコアシートの新しいデータはそのまま取り込まれます。続けますか？",
"Nothing was mapped to you on this card.": "このスコアシートには、自分に割り当てられたデータがありません。",
"What's on the card?": "スコアシートの内容は？",
"Game scores": "ゲームスコア",
"Frame by frame": "フレームごと",
"Reads each game's score. Fastest. If the card turns out to show frames, they get read too.": "各ゲームのスコアを読み取ります。最速です。スコアシートにフレームが載っていれば、それも読み取ります。",
"Reads every ball and the pins it left. Slower, and leaves can come back wrong — you'll see each frame as a scoresheet to fix before saving.": "1投ごとに、残ったピンまで読み取ります。時間がかかり、残りピンが誤って読まれることもあります — 保存前に各フレームをスコアシート形式で表示するので、そこで修正できます。",
"Scorecard Screenshot": "スコアシートのスクリーンショット",
"Clear all": "すべて消去：",
"image": "枚の画像",
"Nothing's broken — just busy": "故障ではありません — 混み合っているだけです",
"Reading the scorecard…": "スコアシートを読み取り中…",
"This can take a minute or two — every frame is read individually.": "1〜2分かかることがあります — フレームを1つずつ読み取っています。",
"Keep this screen open until it finishes.": "完了するまで、この画面を開いたままにしてください。",
"Who's who": "ボウラーの照合",
"bowler": "人",
"read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.": "分をスコアシートから読み取りました。保存する前に一人ずつ確認してください — 照合を誤ると、ある人のゲームが別の人の記録に書き込まれてしまいます。",
"frame tracking": "フレームごとの記録",
"scores only": "スコアのみ",
"no detail": "詳細なし",
"series": "シリーズ",
"· combined from": "· 画像",
"images": "枚を結合",
"Games add to": "ゲームの合計は",
"but the card's scratch series is": "ですが、スコアシートのスクラッチシリーズは",
". One of the games was misread — check the card.": "です。いずれかのゲームが誤読されています — スコアシートを確認してください。",
"Skip this bowler": "このボウラーをスキップ",
"Add \"": "「",
"\" as a new bowler": "」を新しいボウラーとして追加",
"More than one bowler matches this name equally — pick the right one.": "この名前に同じくらい一致するボウラーが複数います — 正しい人を選んでください。",
"Matched on the alias \"": "照合に使った別名：「",
"Roster order": "メンバーの順番",
"The card's order doesn't match your team roster. Names still matched correctly — but if the roster is wrong, position hints will be wrong for every future import.": "スコアシートの順番がチームのメンバー表と一致しません。名前は正しく照合されています — ただし、メンバー表が間違っていると、今後のすべての取り込みで位置のヒントが誤ったものになります。",
"Card order:": "スコアシートの順番：",
"Continue": "続ける",
"Start Over": "やり直す",
"nothing was mapped to you on this card.": "このスコアシートには、自分に割り当てられたデータがありません。",
"check the games below — some came through frame by frame, some as scores only. Correct anything that's wrong, then save.": "下のゲームを確認してください — フレームごとに読み取れたものと、スコアのみのものがあります。間違いがあれば修正してから保存してください。",
"Where this goes": "保存先",
"This scorecard": "このスコアシート",
"check the numbers against the card before saving": "保存する前に、数値をスコアシートと照らし合わせてください",
"Also sending to teammates": "チームメイトにも送信",
"These go to": "これらのスコアは確認のため",
"this bowler": "このボウラー",
"these bowlers": "これらのボウラー",
"to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.": "に送られます。スコアはすぐに成績に反映されます — 確認しても確認済みの印が付くだけです。送信する前に、読み取りミスを修正してください。",
"read as \"": "読み取り名：「",
"couldn't be read — type the real score, or clear the box if they didn't bowl it.": "を読み取れませんでした — 実際のスコアを入力するか、投げていないゲームなら欄を空にしてください。",
"Series": "シリーズ",
"· card printed": "· スコアシートの印字：",
"Saving…": "保存中…",
"Pick a result for the fill ball first": "先にフィルボールの結果を選んでください",
"Fix the flagged scores first": "先に要確認のスコアを修正してください",
"Looks Good — Save": "問題なし — 保存",
"Moderate": "中程度",
"Tentative": "暫定",
"What This Is Based On": "分析の根拠",
"games. Only statistics with enough data to be meaningful are analysed.": "ゲーム。意味のある結果を出せるだけのデータがある統計だけを分析しています。",
"Ball comparisons unlock as each ball builds up its own sample. They need more than overall stats because comparing two percentages doubles the uncertainty.": "ボールごとの比較は、それぞれのボールのデータがたまるにつれて解放されます。2つの割合を比べると不確かさが倍になるため、全体の成績よりも多くのデータが必要です。",
"You're close on": "もう少しで解放：",
"— a couple more nights and it unlocks.": "— あと2〜3日分記録すれば解放されます。",
"Insights": "分析",
"Select a bowler on the Log tab first. Insights are about one bowler's game, not everyone's combined.": "先に「投球」タブでボウラーを選んでください。分析は1人のボウラーのプレーについてのもので、全員を合算したものではありません。",
"to go.": "残っています。",
"Insights need at least": "分析には最低",
"games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.": "ゲームが必要です。それより少ないと、数字が日によって大きくぶれるため、信頼できることは何も言えません — 自信ありげに見えても、実際はただのノイズにすぎない傾向が出てしまいます。",
"You have": "現在",
"games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.": "ゲームを記録しています。まだ正直に分析できるだけのデータがそろった項目はありません — 最も近いものはこちらです。",
"Based on": "これまでの",
"games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.": "ゲームにもとづく分析です。記録するほど精度が上がります — 数日分ならヒント程度、1シーズン分あれば行動に移せる材料になります。",
"New since last time:": "前回からの新着：",
"Dismiss": "閉じる",
"Looks at your logged statistics and reports what stands out. It only uses numbers with enough data behind them, and it reports patterns rather than telling you how to bowl.": "記録した成績を見て、目立つ点をお伝えします。十分なデータがある数字だけを使い、投げ方を指示するのではなく傾向をお伝えします。",
"Analysing…": "分析中…",
"Analyse My Game": "プレーを分析",
"Try Again": "再試行",
"Worth Paying Attention To": "注目したいポイント",
"Written by AI from the stats you've logged. It can be wrong, and it can sound confident while being wrong — treat it as a starting point for a conversation, not an instruction.": "記録した成績をもとにAIが書いた文章です。間違っていることがあり、間違っていても自信ありげに聞こえることがあります — 指示ではなく、話し合いのきっかけとして受け止めてください。",
"You're working with": "現在の指導者：",
"a coach": "コーチ",
"— worth talking this through with them before changing anything. They can see what these numbers can't.": "— 何かを変える前に、一度相談してみましょう。この数字では見えないものが見えているはずです。",
"Run Again": "もう一度分析",
"Night": "当日",
"Pattern": "オイルパターン",
"Shot": "1投",
"Nothing written yet. Notes you add to a shot, a drill or the end of a night all collect here, so you can look back at what you were working on and what you said about it.": "まだ何も書かれていません。投球やドリル練習、1日の終わりに追加したメモはすべてここに集まります。何に取り組んでいたか、それについて何を書いていたかを振り返れます。",
"Search your notes…": "メモを検索…",
"Filters": "フィルター",
"Filter": "絞り込む",
"Kind": "種類",
"Dates": "期間",
"From date": "開始日",
"To date": "終了日",
"in that range": "この期間で",
"Nothing written in that range.": "この期間に書かれたメモはありません。",
"The road starts with your first night": "あゆみは最初の1日から始まります",
"Badges": "バッジ",
"pins down": "倒したピン数",
"Up next": "次の目標",
"Your bowling milestones, newest first": "ボウリングのマイルストーン（新しい順）",
"LATEST": "最新",
"Your road starts here": "あゆみはここから",
"Log a night and your first milestones land on the road with the date you did them — first strike, first spare, first 100.": "1日分の投球を記録すると、最初のマイルストーンが達成した日付とともにあゆみに刻まれます — 初ストライク、初スペア、初100。",
"The road so far": "これまでのあゆみ",
"newest first": "新しい順",
"What you've collected along the way": "これまでに集めたもの",
"Your active league": "利用中のリーグ",
"The free plan follows this league.": "無料プランではこのリーグを利用できます。",
"Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.": "リーグの切り替えや複数リーグでの投球はProの機能です — 登録すれば、これまでに記録したものはすべて戻ってきます。",
"Get Pro": "Proにアップグレード",
"That league is still syncing. Give it a moment and try again.": "そのリーグはまだ同期中です。少し待ってからもう一度お試しください。",
"Your active league is already chosen. Switching leagues is part of Pro.": "利用中のリーグはすでに選択済みです。リーグの切り替えはProの機能です。",
"Could not save that just now. Your leagues are untouched — try again in a minute.": "今は保存できませんでした。リーグはそのままです — 1分ほどしてからもう一度お試しください。",
"Choose your active league": "利用するリーグを選択",
"A free account follows one league. Pick the one you want to keep bowling with — you choose once, and switching later is part of Pro. The rest are paused, not deleted, and everything you have logged comes back when you subscribe.": "無料アカウントで利用できるリーグは1つです。続けて投げたいリーグを選んでください — 選べるのは1回だけで、あとからの切り替えはProの機能です。ほかのリーグは削除されずに一時停止となり、登録すれば、これまでに記録したものはすべて戻ってきます。",
"Active league": "利用中のリーグ",
"Paused:": "一時停止中：",
". Practice and Just Bowling stay open either way.": "。練習とフリー投球はどちらの場合も利用できます。",
"Keep this league": "このリーグにする",
"Saved.": "保存しました。",
"is your active league.": "が利用中のリーグです。",
"more ▾": "さらに ▾",
"Oil pattern": "オイルパターン",
"Which nights": "対象の日",
"Every night": "すべての日",
"Avg": "アベレージ",
"vs your": "全体アベレージ",
"overall": "との差",
"g": "G",
"breakpoint": "ブレイク",
"Averaged over the night": "その日の平均",
"Show my usual line": "いつものラインを表示",
"Follow the transition": "トランジションを追う",
"Position through the block": "ブロック内の位置",
"fresh oil": "フレッシュ",
"end of the block": "ブロックの終わり",
"Show all": "すべて表示",
"Hide all": "すべて非表示",
"Nothing on the lane — turn a ball back on.": "レーンに何も表示されていません — ボールをもう一度オンにしてください。",
"on this night": "（この日）",
"Solid while it skids, dashed once it turns — where it turns comes from the oil pattern rather than from anything you logged.": "滑っている間は実線、曲がり始めたら破線です — どこで曲がるかは、記録した内容ではなくオイルパターンから決まります。",
"no pins": "ピンなし",
"Rank leaves by": "残りピンの並べ替え",
"Top missed": "ミスが多い順",
"Top made": "成功が多い順",
"Everything else": "その他",
"Show more": "もっと見る",
"Collapse all": "すべて閉じる",
"Me": "自分",
"Partner": "パートナー",
"Nightcap": "Nightcap",
"isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "はベーカー方式の日にはお出しできません — フレームは1人のボウラーではなく、ペアのものだからです。",
"Points Won": "獲得ポイント",
"Tap to cycle: not marked → won → lost.": "タップで切り替え：未入力 → 勝ち → 負け。",
"Pinfall": "倒したピン数",
"of 4 points": "/4ポイント",
"Side Games": "サイドゲーム",
"in": "参加費",
"Tonight": "今日",
"G": "G",
"If every makeable spare had been made": "取れるスペアをすべて取っていたら",
"Theory": "理論値",
"Theory Series": "理論値シリーズ",
"pins left on the lane": "本のピンを取り残し",
"✓ Converted every makeable spare": "✓ 取れるスペアはすべて取りました",
"actual vs": "が実際、",
"possible)": "が理論値）",
"Quarter game": "25セントゲーム",
"Dollar game": "1ドルゲーム",
"3-6-9 (whole night)": "3-6-9（1日通し）",
"Side games tonight": "今日のサイドゲーム",
"Tap the ones you're in. Buy-ins are saved for": "参加するものをタップしてください。参加費の保存先：",
"— you won't need to enter them again.": "— 次回から入力する必要はありません。",
"Buy-in per game": "1ゲームあたりの参加費",
"not playing": "不参加",
"tonight · $": "（今日）· $",
"paid in": "参加費",
"Poker Winnings ($)": "ポーカー賞金（$）",
"High Game Pot ($)": "ハイゲームポット（$）",
"Highest game in the league takes it — enter what you won, if anything.": "リーグ内でハイゲームを出した人が獲得します — 獲得した額があれば入力してください。",
"3-6-9 Winnings ($)": "3-6-9賞金（$）",
"All nine struck — you took it": "対象の9フレームすべてでストライク — ポットを獲得",
", and the tenth carried for the jackpot": "、さらに10フレームも決めてジャックポットも獲得",
"Pot": "ポット",
"Jackpot": "ジャックポット",
"won tonight": "今日の獲得額",
"✓ Winnings Saved": "✓ 賞金を保存しました",
"Save Winnings": "賞金を保存",
"Strike %": "ストライク率",
"Spare %": "スペア率",
"10 Pins": "10番ピン残り",
"Weak 10s": "ウィークテン",
"Ringing 10s": "リンギングテン",
"Other 10s": "その他の10番ピン",
"Splits": "スプリット",
"Converted": "メイク率",
"Balls used": "使用ボール",
"Release Quality": "リリースの質",
"Good": "良い",
"Bad": "悪い",
"Misses": "ミス",
"Running Averages": "現在のアベレージ",
"Composite": "総合",
"Share tonight": "今日の結果を共有",
"Set up": "準備",
"Scoring": "スコア入力",
"Side games": "サイドゲーム",
"Games": "ゲーム",
"Tonight's Session": "今日のリーグ",
"✓ Prebowling": "✓ 事前投球",
"Prebowling for a future week?": "先の週の事前投球ですか？",
"Opponent": "対戦相手",
"Opponent (e.g. Team Name)": "対戦相手（例：チーム名）",
"Handicap": "ハンディキャップ",
"Starting Lane": "開始レーン",
"e.g. 8": "例：8",
"Lanes": "レーン",
"Official Pattern": "公式パターン",
"Length (ft)": "長さ（ft）",
"Volume (mL)": "オイル量（mL）",
"Ratio (e.g. 3:1)": "比率（例：3:1）",
"Lane Conditions": "レーンコンディション",
"This league usually runs": "このリーグの通常のパターン：",
". Anything you set here is for tonight only.": "。ここでの設定は今日のみ有効です。",
"Start Scoring": "スコア入力を開始",
"Cancel League": "リーグを中止",
"This deletes tonight's shots, game scores and match points for": "今日の投球、ゲームスコア、対戦ポイントを削除します。対象：",
", clears the setup, and takes you back to Home. This cannot be undone.": "。準備内容もクリアしてホームに戻ります。この操作は取り消せません。",
"Keep bowling": "投球を続ける",
"Delete and exit": "削除して終了",
"Enter Game Scores": "ゲームスコアを入力",
"Which bag tonight?": "今日のバッグは？",
"All my balls": "すべてのボール",
"frames say": "フレーム計算では",
"Ball…": "ボール…",
"Surface…": "表面…",
"Delete game": "ゲームを削除：",
"? This removes the score": "？このゲームのスコア",
"and every frame logged for it": "と記録済みのすべてのフレーム",
". It can't be undone.": "が削除されます。元に戻せません。",
"+ Add game": "+ ゲームを追加",
"Want to see which spares are costing you?": "どのスペアで点を落としているか知りたいですか？",
"You've logged a few nights on game tracking. Tracking one game frame by frame turns those into spare conversion, carry and leave patterns. You can switch back whenever you like.": "ゲーム単位の記録で数日分を記録しました。1ゲームをフレームごとに記録すると、スペアメイク率、キャリー、残りピンの傾向まで分析できます。いつでも元に戻せます。",
"Try it for a game": "1ゲーム試してみる",
"We love leagues too! 🎳": "リーグも大好きです！🎳",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet — you can add one whenever you like, and tonight's scores will join it.": "参加しているリーグを追加すれば、すぐにスコアを入力できます。チームはまだなくても大丈夫です — いつでも追加でき、今日のスコアもそこに反映されます。",
"Add my league": "リーグを追加",
"Show me how first": "先に使い方を見る",
"Want these to count for your team?": "このスコアをチームの記録にも反映しますか？",
"Your scores are saved and yours either way. Joining your team — or making one if it's not there yet — puts them on the team sheet as well: standings, side pots and everyone's averages in one place. Everything you've already logged in this league comes with you.": "スコアはどちらの場合も保存され、自分のものです。チームに参加すれば — まだなければ作成すれば — チームシートにも載り、順位表、サイドポット、全員のアベレージを一か所で確認できます。このリーグでこれまでに記録した内容もすべて引き継がれます。",
"Add or join my team": "チームを追加・参加",
"Not now": "今はしない",
"Scores above are enough. Frames below add shot and ball data.": "上のスコアだけで十分です。下のフレームを入力すると、投球やボールのデータが追加されます。",
"Shot Context": "投球状況",
"10th Frame": "10フレーム",
"No bowler selected": "ボウラー未選択",
"— pick a league above": "— 上でリーグを選択してください",
"Series so far": "ここまでのシリーズ",
"Frame": "フレーム",
"Ball in 10th": "10フレームの投球",
"Lane": "レーン",
"✏️ Edit the 10th — which ball?": "✏️ 10フレームを編集 — 何投目？",
"Fill": "フィルボール",
"✏️ Editing Shot": "✏️ 投球を編集中",
"Keeping score for": "記録するボウラー",
"✓ Also scoring for others": "✓ 他の人のスコアも記録",
"Also scoring for others": "他の人のスコアも記録",
"Add someone bowling with you": "一緒に投げる人を追加",
"No teammates on this league's roster yet — add them on the Social tab.": "このリーグのメンバーにはまだチームメイトがいません — 「フレンド」タブで追加してください。",
"Result": "結果",
"Required": "必須",
"everything else is optional": "その他は任意",
"Other": "その他",
"Pins Standing": "残っているピン",
"Gutter": "ガター",
"9 Pin No-Tap → scored as Strike": "9ピンノータップ → ストライクとして記録",
"Leave:": "残りピン：",
"· First ball:": "· 1投目：",
"Strike Description": "ストライクの内容",
"Spare Made": "スペアメイク",
"Which pins did you knock down?": "どのピンを倒しましたか？",
"Tap the ones that fell. None of them? Just save the shot.": "倒れたピンをタップしてください。1本も倒れなかった場合は、そのまま投球を保存してください。",
"That's every pin — we'll save this as a spare.": "すべてのピンが倒れました — スペアとして保存します。",
"First ball:": "1投目：",
"Second ball:": "2投目：",
"Done picking pins — show the rest of the form": "ピンの選択を完了 — フォームの続きを表示",
"Clear everyone's game 1 scores?": "全員の1ゲーム目のスコアを消去しますか？",
"Later games move down one.": "以降のゲームは1つずつ繰り上がります。",
"Scores": "スコア",
"Just the final score for each game. Totals add themselves.": "各ゲームの最終スコアだけを入力します。合計は自動で計算されます。",
"BOWLER": "ボウラー",
"Total": "合計",
"Clear game 1 scores": "1ゲーム目のスコアを消去",
"TOTAL": "合計",
"+ Add a game": "+ ゲームを追加",
"Cancel Open Bowling": "フリー投球を中止",
"This deletes tonight's open bowling scores for everyone on the sheet and takes you back to Home. This cannot be undone.": "シートに載っている全員の今日のフリー投球のスコアが削除され、ホームに戻ります。元に戻せません。",
"Ball Change Reason": "ボール変更の理由",
"Switched from": "ボール変更：",
"— why?": "— 理由は？",
"Optional below this line": "ここから下は任意",
"Accessory details": "補足情報",
"tap to open": "タップして開く",
"— pick a ball —": "— 選択 —",
"Surface": "表面",
"Line": "ライン",
"Stand": "立ち位置",
"board #": "ボード番号",
"Hit": "通過",
"Breakpoint": "ブレイクポイント",
"On target": "狙いどおり",
"board": "ボード",
"of target": "にずれ",
"Release": "リリース",
"Speed": "球速",
"Rev rate": "回転数",
"Axis rot.": "アクシスローテーション",
"Axis tilt": "アクシスティルト",
"Shoes": "シューズ",
"Heel #": "ヒール番号",
"Sole #": "ソール番号",
"Execution": "投球精度",
"repeat(2, minmax(0, 1fr))": "",
"minmax(0, 1fr)": "",
"Miss": "ミス",
"Tap the pins you left standing.": "残ったピンをタップしてください。",
"Answer \"Spare Made\" above to save.": "上の「スペアメイク」で「はい」か「いいえ」を選ぶと保存できます。",
"Nothing logged yet tonight. Shoot a game or run a drill and it lands here.": "今日はまだ何も記録されていません。ゲームを投げるかドリル練習をすると、ここに表示されます。",
"average": "アベレージ",
"strikes": "ストライク",
"spares": "スペア",
"clean": "クリーンフレーム",
"first balls struck": "（1投目のストライク）",
"Best carry tonight:": "今日のベストキャリー：",
"over": "／",
"first balls": "1投目",
"Session Notes": "今日のメモ",
"How the night went, what to try next time…": "今日の調子、次に試したいこと…",
"Cancel Practice": "練習を中止",
"This deletes today's practice shots and game scores for": "今日の練習の投球とゲームスコアを削除します。対象：",
"and takes you back to Home. This cannot be undone.": "。その後ホームに戻ります。元に戻せません。",
"Keep practicing": "練習を続ける",
"✓ Updated": "✓ 更新しました",
"✓ Saved": "✓ 保存しました",
"Update": "更新",
"Save Shot": "投球を保存",
"Open Bowling": "フリー投球",
"Enter a score first": "先にスコアを入力してください",
"Session": "セッション",
"That sign-in link didn't work — it may have expired. Send yourself a new one.": "このログインリンクは使えませんでした — 有効期限が切れている可能性があります。新しいリンクを送信してください。",
"Couldn't finish signing in. Check your connection and try the link again.": "ログインを完了できませんでした。接続を確認して、もう一度リンクをお試しください。",
"Couldn't pour the nightcap just then. Tap to try again.": "Nightcapをうまく注げませんでした。タップしてもう一度お試しください。",
"No signal for this one. It'll still be here when you're back online.": "今は通信がつながりません。オンラインに戻ったら、ここで見られます。",
"That nightcap came back in a shape the app couldn't read. Tap to try again.": "このNightcapはアプリで読めない形で届きました。タップしてもう一度お試しください。",
"Nightcap 🥃": "Nightcap 🥃",
"Try tracking frame data next week and we'll have a Nightcap together.": "来週はフレームごとのデータも記録してみてください。そうすれば一緒にNightcapを楽しめます。",
"There are": "全部で",
"things worth saying about tonight.": "つ、今日について伝えたいことがあります。",
"The Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Part of the paid plan.": "Nightcapはその日の投球を振り返ってお伝えします — 残りピンの傾向、オープンフレームで失ったもの、キャリーしていたボール。有料プランの機能です。",
"Pour another": "もう一杯",
"things were true about tonight. Here are the two or three worth hearing.": "件の事実が今日のデータから見つかりました。そのうち聞いておきたい2〜3件をお伝えします。",
"Pour the nightcap": "Nightcapを注ぐ",
"Reading back the night…": "今日を振り返っています…",
"first balls across": "回の1投目・全",
"— tonight only.": "— 今日のみ。",
"Pattern name": "パターン名",
"Couldn't search for centers right now.": "現在ボウリング場を検索できません。",
"Welcome to": "ようこそ",
"Who's bowling?": "投げるのはどなたですか？",
"Your name goes on your scores and is how teammates find you. The rest sets up the stats correctly — all changeable later.": "名前はスコアに表示され、チームメイトが見つけるときにも使われます。その他の項目は成績を正しく集計するための設定です — すべて後から変更できます。",
"Your name": "名前",
"Which hand?": "投げる手は？",
"Right": "右",
"Left": "左",
"Style": "スタイル",
"One-handed": "片手投げ",
"Two-handed": "両手投げ",
"Where do you bowl?": "普段どこで投げていますか？",
"(optional)": "（任意）",
"Search for a center": "ボウリング場を検索",
"Just a first name is fine.": "名前は下の名前だけでも構いません。",
"Got a team code from your captain?": "キャプテンからチームコードを受け取りましたか？",
"Team code": "チームコード",
"ABCD-EFGH": "ABCD-EFGH",
"Puts you straight onto your team, with anything they've already logged for you.": "チームにそのまま参加できます。チームがすでに記録したデータも引き継がれます。",
"Do you coach other bowlers?": "他のボウラーを指導していますか？",
"Turns on the roster for tracking who you coach.": "指導中のボウラーを管理するためのメンバー一覧が有効になります。",
"Start Bowling": "はじめる",
"‹ Back to History": "‹ 履歴に戻る",
"No game scores were saved for this night, so there are no results to show.": "この日はゲームのスコアが保存されていないため、表示できる結果がありません。",
"Suggested new book average:": "新しい公認アベレージの提案：",
"Change the number below if this doesn't match your full season.": "シーズン全体の成績と合わない場合は、下の数値を変更してください。",
"Update to": "更新：",
"Not Now": "あとで",
"Add a bowler on the Log tab first — profiles are per bowler.": "まず「投球」タブでボウラーを追加してください — プロフィールはボウラーごとに作成されます。",
"Your Name": "名前",
"(not set)": "（未設定）",
"Scorecard Names": "スコアシート上の名前",
"None": "なし",
"How your name shows up on the screens at your center — \"R. Nadon\", \"RYAN N\", a nickname. Adding these lets a scorecard photo find you instead of asking every time.": "ボウリング場の画面での名前の表示 — 「R. Nadon」「RYAN N」、ニックネームなど。登録しておくと、スコアシートの写真から毎回確認しなくても自動で見つけられます。",
"e.g. R. Nadon": "例：R. Nadon",
"This is what teammates see when they search for you or view the roster — it defaults to your email prefix until you set it.": "チームメイトが検索したりメンバー一覧を見たりするときに表示される名前です — 設定するまでは、メールアドレスの@より前の部分が使われます。",
", backup": "、バックアップ",
"Handedness": "利き手",
"A lefty's corner pin is the 7, not the 10 — this flips the result chips on the Log tab to match.": "左投げの場合、コーナーピンは10番ではなく7番です — この設定に合わせて「投球」タブの結果ボタンが反転します。",
"Right-handed": "右投げ",
"Left-handed": "左投げ",
"Strike ball": "ストライクボール",
"A backup ball goes out to the": "バックアップボールは",
"and hooks back, so your corner pin is the": "へ出てから戻るように曲がるため、コーナーピンは",
"and your pocket is the": "番ピン、ポケットは",
". Turning this on flips every leave, split and lane drawing to match — you are still": "になります。オンにすると、残りピン・スプリット・レーンの図がすべてそれに合わせて反転します — 利き手の表示はどこでも",
"-handed everywhere it says so.": "投げのままです。",
"I throw a backup ball": "バックアップボールを投げる",
"Delivery": "投球",
"Two-handed and no-thumb players are who the 2LS drilling layout system is built for.": "2LSドリルレイアウトシステムは、両手投げやサムレスのボウラー向けに作られています。",
"Two-handed / no thumb": "両手投げ / サムレス",
"Drift (boards)": "ドリフト（ボード）",
"Boards between where you start and where you slide, counting toward the middle.": "スタート位置からスライドした位置までのボード数。中央方向へのずれを数えます。",
"Lateral offset (boards)": "横方向のずれ（ボード）",
"How far outside your slide the ball lays down. Usually 4 to 8 one-handed, less two-handed.": "スライドした足の位置から、ボールがレーンに着く位置がどれだけ外側か。片手投げで通常4〜8枚、両手投げではそれより少なめです。",
"Not coaching": "指導なし",
"Turn this on if you coach other bowlers. It adds a view that shows their tasks and notes instead of your own game.": "他のボウラーを指導している場合はオンにしてください。自分のゲームではなく、指導中のボウラーの課題やメモを表示するビューが追加されます。",
"I bowl": "自分で投げる",
"I coach": "指導する",
"Your league": "リーグ",
"season wrapped up": "のシーズン終了",
"Not enough games logged here yet to suggest a new number": "新しい数値を提案できるほど、ここではまだゲームが記録されていません",
". You can still update it yourself below, or skip for now.": "。下で自分で更新するか、今回はスキップできます。",
"Skip — I'll update it myself": "スキップ — 自分で更新する",
"Book Average": "公認アベレージ",
"Not set": "未設定",
"A static number from last season — the app never changes this on its own. When a league's season ends, you'll be prompted here to update it, with a suggested number you can accept or override.": "前シーズンの固定値です — アプリが自動で変更することはありません。リーグのシーズンが終わると、ここで更新を促すメッセージが表示され、提案された数値をそのまま使うか、別の値を入力できます。",
"e.g. 213": "例：213",
"over how many games": "対象ゲーム数",
"Season (e.g. 2025-26 Winter)": "シーズン（例：2025-26 冬）",
"Your best ever": "自己ベスト",
"Including before you started using the app. We'll tell you when you beat them.": "アプリを使い始める前の記録も含みます。記録を更新したらお知らせします。",
"Home Centers": "よく行くボウリング場",
"None yet": "まだありません",
"The houses this bowler plays regularly. Looked up so they match the same centers your leagues use.": "普段投げているボウリング場です。リーグで使われているボウリング場と一致するよう、検索して登録します。",
"+ Add a Center": "+ ボウリング場を追加",
"Teams & Leagues": "チームとリーグ",
"Not on a team": "チーム未所属",
"Taken from the roster on the Social tab — change it there and it updates here.": "「フレンド」タブのメンバー一覧から取得しています — そちらで変更するとここにも反映されます。",
"Not on any team yet.": "まだどのチームにも所属していません。",
"Add a ball": "ボールを追加",
"Arsenal": "アーセナル",
"Balls and their drilling layouts.": "ボールとそのドリルレイアウト。",
"Has a plastic ball ✓": "プラスチックボールあり ✓",
"Add a plastic ball": "プラスチックボールを追加",
"Could not start checkout. Please try again in a moment.": "決済を開始できませんでした。少ししてからもう一度お試しください。",
"Could not start checkout.": "決済を開始できませんでした。",
"Could not open the subscription manager. Please try again.": "サブスクリプションの管理画面を開けませんでした。もう一度お試しください。",
"Your payment is pending. Pro unlocks once Google Play finishes processing it.": "お支払いは保留中です。Google Playでの処理が完了すると、Proが使えるようになります。",
"The purchase wasn't completed. You haven't been charged.": "購入は完了しませんでした。料金は請求されていません。",
"That purchase is already linked to another account.": "この購入はすでに別のアカウントに紐づけられています。",
"no ok in response": "",
"Your purchase went through, but we couldn't confirm it just yet. Pro will unlock shortly --": "購入は完了しましたが、まだ確認が取れていません。Proはまもなく使えるようになります --",
"reopen the app in a few minutes. You won't be charged twice.": "数分後にアプリを開き直してください。二重に請求されることはありません。",
"Pick a plan first.": "先にプランを選んでください。",
"Something went wrong starting that. Please try again.": "開始時に問題が発生しました。もう一度お試しください。",
"Trip 6": "6番トリップ",
"Kick 7": "7番キック",
"Free fall ·": "フリーフォール ·",
"String ·": "ストリング ·",
"same": "差なし",
"on string": "（ストリング）",
"splits excluded": "スプリットを除く",
"Messengers": "メッセンジャー",
"share of strikes": "ストライクに占める割合",
"Splits left": "スプリット発生",
"share of first balls": "1投目に占める割合",
"-pin left": "番ピン残り",
"% of first balls": "%（1投目中）",
"What's left standing on each. Darker means left more often.": "それぞれで残ったピンです。色が濃いほど多く残っています。",
"Free fall": "フリーフォール",
"String": "ストリング",
"Biggest change on string": "ストリングで大きく変わった残りピン",
"described": "記録済み",
"How your strikes carried, from the ones you described.": "ストライクの内容を記録した投球から見た、キャリーの傾向です。",
"Numbers": "数値",
"Leaves": "残りピン",
"Strikes": "ストライク",
"Free Fall vs String": "フリーフォール vs ストリング",
"Free fall vs string view": "フリーフォール vs ストリングの表示",
"(prefers-reduced-motion: reduce)": "",
", not bowled": "、未投球",
"Tap any frame to edit": "フレームをタップして編集",
"All teams": "すべてのチーム",
"Session History": "投球履歴",
"0 sessions": "0件",
"Nothing saved yet. Finish a night with \"Save & Finish\" on its Results tab and it lands here.": "まだ保存された記録はありません。その日の「結果」タブで「保存して〜を終了」をタップすると、ここに表示されます。",
"ten pins": "10番ピン",
"% spares": "%スペアメイク",
"splits": "スプリット",
"More": "件追加",
"avg": "アベレージ",
"How It Went 🎳": "今日のふりかえり 🎳",
"pins between": "ピン、参加",
"pins first to last": "ピン差（1位〜最下位）",
"Practice Recap": "練習のまとめ",
"Best": "ベスト",
"Spread": "ばらつき",
"vs Avg": "アベレージ比",
"Bowling With": "一緒に投げた人",
"Compared on average — you didn't all bowl the same number of games.": "アベレージで比較しています — 全員が同じゲーム数を投げたわけではありません。",
"Drill Recap": "ドリル練習のまとめ",
"· may move": "· 暫定",
"Head To Head": "直接対決",
"You —": "自分 —",
", may move": "、暫定",
"attempts": "回",
"Not enough attempts on one side to call a difference.": "どちらかの試行回数が少なく、差を判断できません。",
"They also worked (nothing of yours to compare against):": "ほかのボウラーが取り組んだ練習（比較できる自分の記録なし）：",
"Share this": "共有",
"Share the night": "この日の結果を共有",
"End Open Bowling": "フリー投球を終了",
"Share this practice": "この練習を共有",
"Change tonight's setup": "今日の設定を変更",
"Tonight's setup": "今日の設定",
"Collapse": "折りたたむ",
"Bowling today?": "今日は投げますか？",
"Change either answer, then tap Done.": "どちらの回答も変更できます。変更したら「完了」をタップしてください。",
"Two quick questions and the app sets itself up for tonight.": "2つの質問に答えるだけで、アプリが今日の投球に合わせて準備します。",
"You can change this any time.": "いつでも変更できます。",
"How much detail?": "どこまで記録しますか？",
"Tester mode on — Diagnostics is now in Settings.": "テスターモードがオンになりました — 「設定」に「診断情報」が表示されます。",
"Tester mode off.": "テスターモードがオフになりました。",
"turn off": "オフ",
"turn on": "オン",
"Other bowlers have a “": "ほかのボウラーにも「",
"” too": "」があります",
"If it's the same league, combine yours with it. Your games and teams move across, and you'll see each other's teams.": "同じリーグであれば、自分のリーグと統合してください。ゲームとチームが移され、お互いのチームが見られるようになります。",
"No bowling center set": "ボウリング場が未設定",
"· you're already in it": "· 参加済み",
"Combine": "統合",
"” is already here": "」はすでに登録されています",
"Is one of these your league? Joining it puts you in the same league as the bowlers already there, so you can find their teams and they can find yours.": "この中に自分のリーグはありますか？参加すると、すでに登録しているボウラーと同じリーグに入り、お互いのチームを見つけられるようになります。",
"None of these — create mine": "該当なし — 自分で作成",
"Unlock My Bowling Journey Pro": "My Bowling Journey Proにアップグレード",
"Unlimited leagues, full stats, and more.": "リーグ数無制限、すべての成績の表示など。",
"Manage subscription": "サブスクリプションを管理",
"See Pro": "Proの詳細",
"Sessions": "日別",
"Season": "シーズン",
"Calendar": "カレンダー",
"Journal": "日誌",
"Shared": "共有しました",
"Copied to clipboard": "クリップボードにコピーしました",
"High Game": "ハイゲーム",
"High Series": "ハイシリーズ",
"200+ Games": "200+ゲーム",
"Net": "収支",
"Share Summary": "まとめを共有",
"No sessions yet for this bowler and league.": "このボウラーとリーグの記録はまだありません。",
"Walkthroughs": "使い方ガイド",
"Watch any of these again, any time.": "いつでも見直せます。",
"Watch": "見る",
"App appearance": "アプリの外観",
"Each one takes its colour from a different part of the house. Dark ones for a dim centre, light ones for a bright room or daytime.": "どのテーマも、ボウリング場のどこかの場所から色を取っています。ダークは照明を落とした場内に、ライトは明るい部屋や日中に向いています。",
"Dark": "ダーク",
"Light": "薄め",
"Add a league": "リーグを追加",
"Add a league, rename one, set its center and season dates, or hide one you're not bowling any more.": "リーグの追加や名前の変更、ボウリング場やシーズン期間の設定、もう投げていないリーグの非表示ができます。",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet.": "所属しているリーグを追加すれば、すぐにスコアを入力できます。チームはまだなくても大丈夫です。",
"More leagues": "複数のリーグ",
"The free plan covers one league. Bowling a second one — a summer league, or Tuesday and Thursday — is part of the paid plan. Nothing you have already logged goes anywhere.": "無料プランで使えるリーグは1つです。2つ目のリーグ — サマーリーグや、火曜と木曜の両方など — で投げるのは有料プランの機能です。これまでに記録したものがなくなることはありません。",
"League name, e.g. Tuesday Night Mixed": "リーグ名（例：火曜リーグ）",
"Rename": "名前を変更",
"Date range (optional)": "期間（任意）",
"Season dates": "シーズン期間",
"Nine on the first ball counts as a strike. Those are kept separate from your regular strike percentage, but still count toward how your ball carries.": "1投目の9本をストライクとして数えます。通常のストライク率とは別に集計されますが、ボールのキャリーの集計には含まれます。",
"Usual lane condition": "いつものレーンコンディション",
"Used for any night you don't record a pattern for. Leave the name blank if this league rotates.": "オイルパターンを記録しなかった日には、これが使われます。このリーグのパターンが毎回変わる場合は、名前を空欄のままにしてください。",
"Hidden — show again": "非表示中 — 再表示する",
"Hide this league": "このリーグを非表示",
"Won't appear when logging. Past scores still count toward your averages.": "記録時に表示されなくなります。過去のスコアは引き続きアベレージに含まれます。",
"Add weekly reminder": "毎週のリマインダーを追加",
"team": "チーム",
"in this league": "がこのリーグに所属",
"· yours": "· 自分のチーム",
"Asked": "申請済み",
"Ask to join": "参加を申請",
"Leave team": "チームを抜ける",
"More teams": "複数のチーム",
"The free plan covers one team. Your scores keep counting for the team you are already on.": "無料プランで所属できるチームは1つです。すでに所属しているチームでは、スコアが引き続きカウントされます。",
"Add a team": "チームを追加",
"Your scores in this league will join it — including nights you have already logged.": "このリーグでのスコアがこのチームに加わります — すでに記録した日の分も含みます。",
"Add a team to this league": "このリーグにチームを追加",
"Leagues": "リーグ",
"Shown": "表示",
"Hidden": "非表示",
"Poker, 3-6-9, and High Game Pot tracking cards on the Log and Data tabs.": "「投球」タブと「成績」タブに、ポーカー、3-6-9、ハイゲームポットの記録カードを表示します。",
"Which pots does your house run?": "通っているボウリング場にあるポットは？",
"Export": "エクスポート",
"Your data, as spreadsheets. Sessions is one row per night; shots is one row per delivery.": "データをスプレッドシート形式で書き出します。日別記録は1日につき1行、投球記録は1投につき1行です。",
"Sessions CSV": "日別記録CSV",
"Shots CSV": "投球記録CSV",
"Import scores": "スコアを取り込む",
"Backup & Restore": "バックアップと復元",
"No data yet": "まだデータなし",
"Save a copy of everything — shots, sessions, bowlers, arsenals, and match results — so your season is safe no matter what. If you ever open this app and your history looks empty, restore it here.": "投球、日別記録、ボウラー、アーセナル、対戦結果など、すべてのコピーを保存しておけば、何があってもシーズンの記録は安全です。アプリを開いて履歴が空になっているように見えたら、ここから復元してください。",
"Open Backup & Restore": "「バックアップと復元」を開く",
"Backup downloaded.": "バックアップをダウンロードしました。",
"Download Backup": "バックアップをダウンロード",
"If the download doesn't work in this environment, copy the text below instead and save it somewhere safe.": "この環境でダウンロードできない場合は、代わりに下のテキストをコピーして、安全な場所に保存してください。",
"To restore, paste a backup below and tap Restore. This adds anything missing — it won't erase what's already here.": "復元するには、下にバックアップを貼り付けて「このバックアップを復元」をタップしてください。足りないものが追加されるだけで、今あるデータは消えません。",
"Paste backup JSON here…": "バックアップのJSONをここに貼り付け…",
"Restore This Backup": "このバックアップを復元",
"Refresh from the Cloud": "クラウドから更新",
"Use this if something you know you bowled is missing here": "確かに投げたはずの記録がここにない場合に使ってください",
"— a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "— 表示されない日、別のスマホで入力したスコア、投げ続けているのに動かなくなった成績など。",
"To open fast, this app normally downloads only what has changed since it last checked. Once in a while a phone can lose its place and stop asking for something — usually after bowling somewhere with no signal, or when the same account is used on two devices. Your shots are safe in the cloud the whole time; this phone just is not asking for them.": "すばやく開けるように、このアプリは通常、前回の確認から変わった分だけをダウンロードします。ごくまれに、スマホがどこまで取得したかを見失い、一部のデータを取りに行かなくなることがあります — たいていは電波のない場所で投げたあとや、同じアカウントを2台の端末で使っているときです。その間も投球データはずっとクラウドに安全に保存されています。このスマホが取りに行っていないだけです。",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app.": "まだ保存待ちのデータを送信してから、履歴をすべて最初からダウンロードし直し、アプリを再読み込みします。",
"Nothing is deleted": "何も削除されません",
", and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": "。記録したものが失われることもありません。通常の起動より多くのデータ通信を使い、シーズンが長いと少し時間がかかることもあるので、Wi-Fiにつないでおくのがおすすめです。",
"change": "件の変更が",
"still waiting to save.": "保存待ちです。",
"It": "こちらは",
"will be sent first.": "先に送信されます。",
"Refreshing…": "更新中…",
"Account": "アカウント",
"Signed in": "ログイン中",
"Signed in as": "ログイン中のアカウント：",
"this device": "この端末",
"Sign out of this account?": "このアカウントからログアウトしますか？",
"Could not sign out. Check your connection and try again.": "ログアウトできませんでした。接続を確認して、もう一度お試しください。",
"Sign out": "ログアウト",
"About & Legal": "アプリについて・法的情報",
"Privacy Policy": "プライバシーポリシー",
"Terms of Service": "利用規約",
"Delete your account": "アカウントを削除",
"Questions, or want your data deleted?": "ご質問やデータ削除のご希望はこちら：",
"support@mybowlingjourney.com": "support@mybowlingjourney.com",
"is published by My Bowling Journey LLC.": "はMy Bowling Journey LLCが提供しています。",
"Web version": "Web版",
"Diagnostics": "診断情報",
"Nothing logged": "問題の記録なし",
"What went wrong on this phone, and why — failed saves, sync errors, imports that fell back. Copy it and paste it to whoever asked.": "この端末で起きた問題とその原因です — 保存の失敗、同期エラー、代替処理に切り替わった取り込みなど。コピーして、依頼した人に貼り付けて送ってください。",
"Copied": "コピーしました",
"Couldn't copy on this device": "この端末ではコピーできませんでした",
"Copy log": "ログをコピー",
"Tester mode. Tap the \"published by\" line in About & Legal seven times to turn it off.": "テスターモードです。オフにするには、「アプリについて・法的情報」の「〜が提供しています」の行を7回タップしてください。",
"Danger Zone": "危険な操作",
"Clear All Data": "すべてのデータを消去",
"Removes your bowling history including your shots, match results and lane notes. Your account, profile, arsenal and teams are unaffected.": "投球、対戦結果、レーンメモなど、ボウリングの履歴を削除します。アカウント、プロフィール、アーセナル、チームには影響しません。",
"This deletes every logged shot, session, match result (opponents, handicaps, win/loss), and lane condition note. This can't be undone. Consider downloading a backup above first.": "記録したすべての投球、日別記録、対戦結果（対戦相手、ハンディキャップ、勝敗）、レーンコンディションのメモを削除します。元に戻すことはできません。先に上でバックアップをダウンロードしておくことをおすすめします。",
"Yes, Delete Everything": "はい、すべて削除",
"Delete My Account": "アカウントを削除",
"Removes your account and everything in it, permanently.": "アカウントとその中のすべてを完全に削除します。",
"This deletes your account and": "アカウントと",
"everything attached to it": "それに関連するすべてのデータ",
"— every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "を削除します — すべての投球と日別記録、プロフィールと名前、アーセナル、目標、チームへの所属。再びログインすることはできず、こちらで復元することもできません。",
"Leagues and teams you created are kept only if other bowlers are still using them, so nobody loses a league they're bowling in. Any that nobody else is in go with everything else.": "作成したリーグやチームは、ほかのボウラーがまだ使っている場合に限り残されるので、投げているリーグがなくなってしまう人はいません。ほかに誰もいないものは、ほかのデータと一緒に削除されます。",
"Want a copy first? Use": "先にコピーを取っておきたい場合は、",
"above before you do this.": "（上にあります）をこの操作の前に使ってください。",
"to confirm": "と入力して確認",
"Couldn't delete the account.": "アカウントを削除できませんでした。",
"Deleting…": "削除中…",
"Permanently Delete": "完全に削除",
"Test account — everything unlocked": "テストアカウント — すべて解放済み",
"Ending — you keep Pro until the period you paid for runs out": "終了予定 — お支払い済みの期間が終わるまでProをご利用いただけます",
"There's a problem with your payment method": "お支払い方法に問題があります",
"You're subscribed": "サブスクリプション登録中",
"Share": "共有",
"Trend": "推移",
"Preparing…": "準備中…",
"Copied — paste it anywhere": "コピーしました — どこにでも貼り付けられます",
"Couldn't share on this device": "この端末では共有できませんでした",
"Share card": "共有カード",
"Press and hold the card to save or share it.": "カードを長押しすると、保存または共有できます。",
"Copy text": "テキストをコピー",
"Wrong email or password.": "メールアドレスまたはパスワードが正しくありません。",
"Couldn't sign in.": "ログインできませんでした。",
"Couldn't send the code. Try again.": "コードを送信できませんでした。もう一度お試しください。",
"That code didn't work. Check it, or send a new one.": "そのコードは使えませんでした。確認するか、新しいコードを送信してください。",
"Couldn't verify that code.": "そのコードを確認できませんでした。",
"Sign in to log your own games and see the team's stats.": "ログインして、自分のゲームを記録したりチームの成績を見たりしましょう。",
"Email": "メールアドレス",
"Password": "パスワード",
"Signing in…": "ログイン中…",
"Sign In": "ログイン",
"Check your email": "メールを確認してください",
"We sent a": "コード（",
"-digit code to": "桁）を送信しました：",
"The same email has a sign-in link in it, if you'd rather tap that.": "同じメールにログイン用のリンクも記載されています。タップする方が良ければそちらをどうぞ。",
"The code lasts an hour.": "コードの有効期限は1時間です。",
"Use a different email": "別のメールアドレスを使う",
"Opening Google…": "Googleを開いています…",
"Continue with Google": "Googleで続ける",
"or": "または",
"Sending…": "送信中…",
"Email Me a Code": "メールでコードを受け取る",
"No password needed — we'll email you a code.": "パスワードは不要です — メールでコードをお送りします。",
"Knockdown": "倒したピン数",
"Pick a league above": "上でリーグを選んでください",
"Nothing to count yet": "まだ集計するものがありません",
"Log a few frames and this fills in — strike rate, spares, ten pins, and how each ball is carrying.": "何フレームか記録するとここに表示されます — ストライク率、スペア、10番ピン、各ボールのキャリー状況。",
"Viewing": "表示対象",
"(you)": "（自分）",
"Teams": "チーム",
"Compare To": "比較相手",
"Nobody to compare against yet. Add a friend, or set up your team — teammates are added as friends automatically.": "まだ比較する相手がいません。フレンドを追加するか、チームを設定してください。チームメイトは自動的にフレンドに追加されます。",
"Manage friends": "フレンドを管理",
"Add a friend": "フレンドを追加",
"Clean Frame %": "クリーンフレーム率",
"Split Rate": "スプリット率",
"10-Pin Spare %": "10番ピンのスペア率",
"Single-Pin Spare %": "1本残りのスペア率",
"First-Ball Avg": "1投目アベレージ",
"Leave Avg": "ストライク以外の1投目アベレージ",
"Head-to-Head": "直接対決",
"Every rate stat side by side against": "すべての率の成績を並べて比較。相手：",
", instead of hunting through separate cards. Split Rate is the one metric here where lower is better.": "。カードを1枚ずつ探す必要はありません。ここで唯一、低いほど良い指標はスプリット率です。",
"Team Records": "チーム記録",
"to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.": "。選ぶと表示されます — ハイゲーム／ハイシリーズには特定のメンバー構成が必要です。人数の違うチームを合算すると、ボウラーの多いチームが不当に有利になるためです。",
"Season record": "シーズン成績",
"points won": "獲得ポイント",
"points (": "ポイント（ゲーム",
"games,": "、ピン数合計",
"pinfall)": "）",
"Weekly Points": "週別ポイント",
"Points won each week, out of 4 — Season Record only shows the running total, never when those points actually came. Shows momentum: a hot streak or a slump.": "毎週の獲得ポイント（4ポイント中）— 「シーズン成績」は累計しか表示せず、そのポイントをいつ取ったかはわかりません。好調の波やスランプなど、勢いがわかります。",
"Points won": "獲得ポイント",
"Handicap Impact": "ハンデの影響",
"to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.": "。選ぶと表示されます — 「チーム」は1つの特定のメンバー構成を指す必要があり、複数のリーグの対戦を混ぜたものではいけません。",
"Points-won rate split by handicap size — shows whether the team does better closer to scratch or with a bigger handicap cushion.": "ハンデの大きさ別のポイント獲得率 — チームがスクラッチに近いときと、ハンデの余裕が大きいときのどちらで好成績を出しているかがわかります。",
"Points won %": "ポイント獲得率",
"Team Leaderboard": "チーム内ランキング",
"% stk": "%ストライク",
"Giant Killer": "ジャイアントキリング",
"to see this — it needs a specific roster to know who's on top.": "。選ぶと表示されます — 誰がトップかを判定するには、特定のメンバー構成が必要です。",
"No comparisons yet — the first week just sets the baseline average for everyone. Once a second week is logged, that week's giant (whoever had the best average entering it) gets challenged and this fills in.": "まだ比較はありません — 最初の週は全員の基準アベレージを決めるだけです。2週目が記録されると、その週のジャイアント（その週に入る時点でアベレージが最も高かった人）への挑戦が始まり、ここに表示されます。",
"% of games each bowler beat that week's reigning giant, game-by-game — the giant is whoever had the highest average entering that week, based only on weeks before it (never that week's own results). The very first week ever logged sets the baseline with no giant to challenge yet; the hunt starts week two. Locked in per week — if the title changes hands later, earlier weeks stay compared against whoever actually held it at the time. \"Weeks on top\" counts how many weeks they themselves held the title.": "各ボウラーがその週の現ジャイアントに勝ったゲームの割合（%）、1ゲームずつの比較です — ジャイアントとは、その週に入る時点でアベレージが最も高かった人で、それより前の週だけを元に決まります（その週自体の結果は使いません）。一番最初に記録された週は基準を決めるだけで、挑戦するジャイアントはまだいません。ジャイアント狩りは2週目から始まります。結果は週ごとに確定するため、後でタイトルが移っても、それ以前の週は当時実際にタイトルを持っていた人との比較のままです。「週トップ」は、その人自身がタイトルを保持した週の数です。",
"wk": "週",
"on top": "トップ",
"games": "ゲーム",
"🎣 Hung": "🎣 ひとり置いてけぼり",
"to see this — it needs a specific roster to know who else was bowling that frame.": "。選ぶと表示されます — そのフレームで他に誰が投げていたかを知るには、特定のメンバー構成が必要です。",
"Nobody's been hung yet — every strike in this data has had at least one teammate join in, or company on the miss.": "まだ誰も置いてけぼりになっていません — このデータのストライクにはすべて、少なくとも1人のチームメイトが続いたか、一緒にミスした仲間がいました。",
"Every teammate struck that frame except them. The wall of shame.": "そのフレームで、その人以外のチームメイト全員がストライク。不名誉の殿堂です。",
"Team Series": "チームシリーズ",
"Team Total": "チーム合計",
"Tu": "火",
"Th": "木",
"Clean frames": "クリーンフレーム",
"of frames closed out": "オープンにならなかったフレームの割合",
"Frame Position": "フレーム別",
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where": "ゲーム単位ではなくフレーム番号別に集計しています。どの日にも共通する特定のタイミング（ウォームアップ、レーンのトランジション、9フレームでのスコア計算による集中切れ）で",
"tends to leave pins, regardless of which game it is.": "がピンを残しやすいかどうかが、何ゲーム目かに関係なくわかります。",
"Weighted quality score, strict priority order: strike beats every spare, a non-split spare beats every split spare, and within each of those a leave with fewer pins standing scores higher — an open frame always scores lowest, ranked by total pinfall.": "質を重み付けしたスコアで、優先順位は次のとおりです：ストライクはどのスペアよりも上、スプリットでないスペアはどのスプリットからのスペアよりも上、それぞれの中では立っている残りピンが少ないほど高スコアになります。オープンフレームは常に最低で、倒したピン数の合計で順位が付きます。",
"⚠️ Only": "⚠️ 記録はまだ",
"logged — each frame number needs at least": "のみです。本当の傾向と偶然を見分けるには、各フレーム番号に最低",
"to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.": "ゲーム必要です。それまでは結論ではなく、参考程度にご覧ください。",
"Weakest": "最低",
"Strongest": "最高",
"Weakest:": "最低：",
") · Strongest:": ") · 最高：",
"Every frame is even on this metric — no standout weak spot.": "この指標ではどのフレームも同じです — 目立った弱点はありません。",
"First-Ball Average": "1投目アベレージ",
"Average pins on every fresh-rack delivery — every frame's first ball, plus any 10th-frame bonus ball thrown at a full reset rack — strikes counted as 10. The standard metric, comparable to LaneTalk and other scoring apps.": "10本すべてが立った状態での投球の平均ピン数です — 各フレームの1投目に加え、10フレームで10本がリセットされた状態で投げたボーナス投球も含み、ストライクは10本として数えます。標準的な指標で、LaneTalkなどのスコアアプリと比較できます。",
"pins per fresh rack": "10本立ちからの平均ピン数",
"vs": "vs",
"Leave Average": "ストライク以外の1投目アベレージ",
"Same fresh-rack deliveries, but only the ones that weren't a strike — isolates how good the leave is on a miss, separate from strike rate.": "同じく10本立ちでの投球のうち、ストライクにならなかったものだけを対象にしています — ストライク率とは別に、ストライクを逃したときの残りピンの良し悪しがわかります。",
"pins when you don't strike": "ストライクでないときの平均ピン数",
"Ten pins": "10番ピン",
"of your ten pins converted": "10番ピンのスペアメイク率",
"Ten-pin leave rate": "10番ピン残り率",
"Single pin spares": "1本残りのスペア",
"of splits converted": "スプリットのメイク率",
"Split rate": "スプリット率",
"✋ Hand Up": "✋ 手を挙げて",
"to see who owes a round.": "。誰が一杯おごる番かがわかります。",
"Nobody's missed a lone 5 yet. Hands stay down.": "まだ誰も5番ピンの1本残りをミスしていません。手を挙げる人はいません。",
"Lone 5-pins missed. Each one owes a drink to everyone with a hand up.": "5番ピンの1本残りをミスした回数です。ミス1回ごとに、手を挙げている全員に一杯おごります。",
"Bowler": "ボウラー",
"5s missed": "5番ミス",
"Non-Split Leaves": "スプリット以外の残りピン",
"Every recurring leave that isn't a split — how often it happens and how often it gets converted.": "スプリット以外でよく出る残りピンの一覧です — それぞれの発生頻度とスペアメイクの頻度がわかります。",
"Longest strike streak": "ストライク最長連続",
"in a row": "連続",
"Consecutive strikes, carrying across games within the same night.": "連続ストライク数です。同じ日のゲームをまたいで数えます。",
"By Ball": "ボール別",
"Miss Distribution": "ミスの分布",
"Ball Change Triggers": "ボール交換のきっかけ",
"Strike Quality": "ストライクの質",
"Top number is the average bowler's score. \"Team\" below it is what the whole team scores together that game.": "上の数字はボウラー1人あたりの平均スコアです。その下の「チーム」は、そのゲームのチーム全体の合計スコアです。",
"Combined spans all leagues, so there's no single team to compare it against — pick a specific bowler under \"Compare To\", or select a specific league above.": "「総合」は全リーグにまたがるため、比較できる単一のチームがありません — 「比較相手」で特定のボウラーを選ぶか、上で特定のリーグを選んでください。",
"Theoretical Average": "理論アベレージ",
"What the average would be if every makeable spare (not a split, not a washout) had been made — including a theoretical 10th-frame fill ball, estimated from each game's own recent first-ball average at that point.": "取れるスペア（スプリットとウォッシュアウトを除く）をすべて取っていた場合のアベレージです — 10フレームの理論上のフィルボールも含み、その時点での各ゲームの直近の1投目アベレージから推定します。",
"if you'd made every makeable spare": "取れるスペアをすべて取っていた場合",
"This Season vs Last": "今シーズンと前シーズンの比較",
"Level": "変化なし",
"Progress to Next Milestone": "次のマイルストーンまでの進捗",
"Tracked in 5-pin steps": "アベレージを5ピン刻みで追っています",
"— the team's average bowler": "（チームのボウラー1人あたりの平均）",
"% to": "%達成・目標",
"Next Session (": "次回（",
"Games)": "ゲーム）",
"You're averaging": "現在のアベレージは",
"across": "（",
"games. Here's what the next set does to it.": "ゲーム）。次のシリーズでの変化は以下のとおりです。",
"Gaining a full point isn't reachable in one set at this average.": "今のアベレージでは、1回のシリーズでアベレージを丸々1ピン上げることはできません。",
"No set this session can drop the average a full point.": "今回のシリーズでは、どんなスコアでもアベレージが丸々1ピン下がることはありません。",
"Score Consistency": "スコアの安定度",
"How steady their game scores are night to night, independent of the average itself. Lower is steadier.": "アベレージそのものとは別に、日ごとのゲームスコアがどれだけ安定しているかを示します。低いほど安定しています。",
"How steady the team's combined game totals are night to night — not each bowler's individual scores. Lower is steadier.": "チームのゲーム合計スコアが日ごとにどれだけ安定しているかを示します — 各ボウラー個人のスコアではありません。低いほど安定しています。",
"pins either side of your average": "アベレージからの上下の幅（ピン）",
"team games": "ゲーム（チーム合計）",
"Score Distribution": "スコア分布",
"The actual shape behind the std. dev. above — tightly bunched around the average, or a long tail of bad nights dragging it down.": "上の標準偏差の実際の形です — アベレージの周りにまとまっているのか、不調の日が長い裾野となって足を引っ張っているのかがわかります。",
"Game-by-Game Averages": "ゲーム順別アベレージ",
"Composite average at each position in the night, across the whole season — shows whether": "シーズン全体での、その日の各ゲーム順ごとの総合アベレージです。",
"the team is": "チーム",
"bowling better early, middle, or late.": "が序盤・中盤・終盤のどこで調子が良いかがわかります。",
"\"Team\" is what the whole team scores together at that position.": "「チーム」は、その順番でのチーム全体の合計スコアです。",
"Team:": "チーム：",
"Poker": "ポーカー",
"High Game Pot": "ハイゲームポット",
"Team Side Games": "チームのサイドゲーム",
"Season totals across every side game — what came in, what it cost to play, and what actually stuck.": "全サイドゲームのシーズン合計です — 入ってきた額、参加にかかった額、そして実際に残った額。",
"won this season": "今シーズンの獲得額",
"By Game": "種目別",
"Buy-in": "参加費",
"Won": "獲得額",
"3-6-9 Tracker": "3-6-9トラッカー",
"Strike frames 3, 6, and 9 of every game (games 1, 2, and 3 -- all 9 strikes) to win the pot for the night. Also throw a full turkey in game 3's 10th frame to additionally earn the jackpot.": "毎ゲーム（1・2・3ゲーム目 — 計9回のストライク）の3・6・9フレームでストライクを出すと、その日のポットを獲得できます。さらに3ゲーム目の10フレームでターキーを出すと、ジャックポットも獲得できます。",
"won on 3-6-9": "3-6-9での獲得額",
"By Bowling Center": "ボウリング場別",
"How you score house to house. Only leagues with a center set are included — set them under Team.": "ボウリング場ごとのスコアです。ボウリング場が設定されたリーグだけが対象です — 「チーム」で設定してください。",
"Comparison": "比較",
"Comparing two things — bowlers, balls, houses, patterns or seasons — is part of the paid plan. Everything about your own game stays free.": "2つのものの比較 — ボウラー、ボール、ボウリング場、オイルパターン、シーズン — は有料プランの機能です。ご自身のプレーに関することはすべて無料のままです。",
"this card": "このカード",
"Not yet": "まだこれから",
"Unhide Stat Cards (": "非表示の成績カードを再表示 (",
"Something went wrong.": "問題が発生しました。",
"You're on Pro": "Proをご利用中",
"Thanks for subscribing. Everything is unlocked.": "ご登録ありがとうございます。すべての機能をご利用いただけます。",
"Manage or cancel any time in the Play Store app, under Subscriptions.": "管理・解約は、Play Storeアプリの「定期購入」からいつでも行えます。",
"Your subscription is ending": "サブスクリプションは終了予定です",
"You are subscribed": "サブスクリプション登録中",
"when the period you paid for runs out": "お支払い済みの期間が終わった時点で",
"Everything is unlocked.": "すべての機能をご利用いただけます。",
"Manage or cancel your subscription in the Play Store app, under Subscriptions.": "サブスクリプションの管理・解約は、Play Storeアプリの「定期購入」から行えます。",
"Opening…": "開いています…",
"Resume subscription": "サブスクリプションを再開",
"Test account.": "テストアカウント。",
"Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "支払い状況にかかわらず、すべての機能がすでに使える状態です。決済のテストのために、下から購入することもできます。",
"Your scores, spares and ball numbers stay free, always. Pro is for the comparisons — and for the parts that think about your night for you.": "スコア、スペア、ボールごとの数字は、これからもずっと無料です。Proは比較機能 — そして、その日の投球を代わりに考えてくれる機能のためのプランです。",
"Every league and team you bowl in": "所属するすべてのリーグとチーム",
"(free keeps": "(無料版で使えるリーグ数：",
"Ball against ball, house against house, pattern against pattern": "ボール同士、ボウリング場同士、オイルパターン同士の比較",
"Head to head with friends and teammates": "フレンドやチームメイトとの直接対決",
"This season against last": "今シーズンと前シーズンの比較",
"Nightcap, Insights, Brooklyn and coaching": "Nightcap、分析、Brooklyn、コーチ",
"Scorecard import": "スコアシートの取り込み",
"Choose a plan": "プランを選択",
"Yearly ·": "年額 ·",
"Monthly ·": "月額 ·",
"Your": "本日から",
"-day free trial starts today. When it ends, the": "日間の無料トライアルが始まります。終了後は",
"plan starts at": "プランに移行します。料金は",
"and renews on its own until you cancel.": "で、解約するまで自動的に更新されます。",
"The": "お選びの",
"plan is": "プランの料金は",
". Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": "です。Google Playで確定する前に、無料トライアルがご自身のアカウントに適用されるかどうかが表示され、その後は解約するまで自動的に更新されます。",
"You have already had the free trial, so the": "無料トライアルはすでに利用済みのため、",
"plan starts today at": "プランは本日開始となり、料金は",
"Cancel any time": "解約はいつでも",
"in the Play Store app under Subscriptions": "Play Storeアプリの「定期購入」からできます",
"from the link in your receipt": "レシートのリンクからできます",
"— you keep Pro until the end of the period you have paid for.": "— お支払い済みの期間が終わるまで、Proを引き続きご利用いただけます。",
"If you stop, nothing you have logged is deleted. One league stays active and the rest are paused until you come back.": "やめても、記録したデータは何も削除されません。1つのリーグは使えるまま、ほかのリーグは戻ってくるまで一時停止となります。",
"Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.": "",
"Create a .env file at the project root — see supabaseClient.js for the format.": "",
"(no match)": "",
"Tuesday House Shot": "Tuesday House Shot",
"Thursday House Shot": "木曜ハウスコンディション",
"Too many tries. Wait a little and try again.": "試行回数が多すぎます。少し待ってから、もう一度お試しください。",
"Couldn't join just now. Check your connection and try again.": "今は参加できませんでした。接続を確認して、もう一度お試しください。",
"That code didn't match a team. Check it with whoever sent it.": "そのコードに一致するチームがありません。送ってくれた人に確認してください。",
"Couldn't do that just now. It may already have been answered — pull down to refresh.": "今は実行できませんでした。すでに応答済みの可能性があります — 下に引っ張って更新してください。",
"Couldn't send that just now. Check your connection and try again.": "今は送信できませんでした。接続を確認して、もう一度お試しください。",
"Make a new code? The old one stops working, so anyone you sent it to will need the new one.": "新しいコードを作成しますか？古いコードは使えなくなるため、送った相手には新しいコードが必要になります。",
"There's already a pending invite for that email on this team.": "このチームには、このメールアドレスへの招待がすでに保留中です。",
"Add an email, or tick “I don’t have their email” to get a code you can text them. Either way they need a way to claim this spot themselves.": "メールアドレスを入力するか、「コードをメッセージで送る」を選んで、相手に送るコードを受け取ってください。どちらの場合も、本人がこの枠を自分で登録できるようにする必要があります。",
"That doesn't look like an email address.": "メールアドレスの形式ではないようです。",
"Loading teams…": "チームを読み込み中…",
"Couldn't load your teams. You may be offline.": "チームを読み込めませんでした。オフラインの可能性があります。",
"Waiting to join your team": "チームへの参加希望",
"wants to join": "が参加を希望しています：",
"+ Add team": "+ チームを追加",
"A team belongs to a league. Add your league on the League tab first, then come back here.": "チームはリーグに所属します。先に「リーグ」タブでリーグを追加してから、ここに戻ってください。",
"OK": "OK",
"New team": "新しいチーム",
"Pick the league this team bowls in": "このチームが所属するリーグを選択",
"Team name": "チーム名",
"e.g. Split Happens": "例：ガター撲滅隊",
"Create team": "チームを作成",
"Join a team": "チームに参加",
"You're invited to": "チームへの招待：",
"Got a team code from a teammate? Enter it here.": "チームメイトからチームコードを受け取りましたか？ここに入力してください。",
"ABCD-1234": "ABCD-1234",
"No code? Find your team in your league and ask to join. Anyone on the team can approve you.": "コードがない場合は、リーグ内で自分のチームを探して参加を申請してください。チームのメンバーなら誰でも承認できます。",
"Pick a league": "リーグを選択",
"Looking…": "検索中…",
"No teams in this league yet. You can make one with Add team.": "このリーグにはまだチームがありません。「チームを追加」で作成できます。",
"Your team": "所属チーム",
"Asked to join": "参加を申請：",
"— waiting for someone on the team to approve.": "— チームメンバーの承認待ちです。",
"Withdraw": "取り下げ",
"No teams yet. Tap Add team, or add one under a league on the League tab.": "まだチームがありません。「チームを追加」をタップするか、「リーグ」タブでリーグの下に追加してください。",
"Team Name": "チーム名",
"Team code — text it to teammates so they can join": "チームコード — チームメイトにメッセージで送ると参加できます",
"Copy": "コピー",
"Make a new code; the old one stops working": "新しいコードを作成（古いコードは使えなくなります）",
"New": "新規",
"Roster / Bowling Order": "メンバー / 投球順",
"Just you so far — add teammates below, or leave it and come back to it. Your scores count either way.": "今のところ自分だけです — 下からチームメイトを追加するか、あとで戻ってきてください。どちらの場合もスコアはカウントされます。",
"Bowling hand — tap to switch": "投球する手 — タップで切り替え",
"Sub — tap to toggle": "補欠 — タップで切り替え",
"Sub ✓": "補欠 ✓",
"Sub": "補欠",
"invited · not signed in yet": "招待済み · 未ログイン",
"placeholder · no email on file": "仮登録 · メール未登録",
"— invited, waiting for them to accept": "— 招待済み、承認待ち",
"Add Someone Not Signed Up Yet": "未登録の人を追加",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with their email, they're linked the moment they sign in with that exact address; with a code, you get one to text them and they enter it when they sign up.": "今すぐメンバー枠を確保します — アカウントがなくても、「記録するボウラー」からすぐにその人の名前でスコアを記録し始められます。どちらの方法でも、枠は本人が自分で引き継ぎ、それまでに記録した内容はすべてそのまま残ります。メールアドレスの場合は、本人がまったく同じアドレスでログインした時点で紐づけされます。コードの場合は、コードをメッセージで送ると、本人が登録時に入力します。",
"Their name": "名前",
"I have their email": "メールアドレスがわかる",
"Text them a code": "コードをSMSで送る",
"Their email": "メールアドレス",
"They will get a code to enter when they sign up. It links them to this spot the same way an email invite does.": "本人には登録時に入力するコードが届きます。メールでの招待と同じように、この枠に紐付けられます。",
"Add to Roster": "メンバーに追加",
"Skip": "スキップ",
"Start bowling": "投球を始める",
"Next": "次へ",
"Your history:": "これまでの成績：",
"avg over": "アベレージ、ゲーム数",
"Low": "最低",
"Untitled": "無題",
"no date": "日付なし",
"· made cut": "· 予選通過",
"· missed cut": "· 予選落ち",
"Oil Pattern": "オイルパターン",
"e.g. Krypton, or type your own": "例：Krypton（または直接入力）",
"+ Save \"": "+ 次回用に保存「",
"\" for next time": "」",
"Length, ratio, and volume are optional — fill in whatever you know.": "レングス、比率、オイル量は任意です — わかる範囲で入力してください。",
"Feet": "フィート",
"Ratio e.g. 3:1": "比率 例：3:1",
"Squad Details": "シフト詳細",
"Remove Day": "この日を削除",
"Start Time": "開始時刻",
"Squad": "シフト",
"e.g. A": "例：A",
"Block #": "ブロック番号",
"e.g. 2": "例：2",
"Go to scoring": "スコア入力へ",
"Pins vs 200 avg": "200アベレージ比（ピン）",
"(all blocks so far)": "（これまでの全ブロック）",
"Go to": "移動：",
"match play": "マッチプレー",
"the stepladder": "ステップラダー",
"This block": "このブロック",
"s frames are logged under": "のフレームの記録日は",
", not": "、ブロックの日付は",
"Move them to": "移動先：",
"+ Game": "+ ゲーム",
"Tournaments usually move pairs after every game, so each game gets its own.": "大会では通常1ゲームごとにペアレーンを移動するので、レーンはゲームごとに入力します。",
"Pair": "レーン",
"Day Notes": "この日のメモ",
"Transition, ball reaction, what worked…": "トランジション、ボールの反応、うまくいったこと…",
"Brackets & Side Pots": "ブラケット・サイドポット",
"Tracked separately from the main entry, so you can see which of these actually pay for themselves.": "メインのエントリーとは別に記録するので、どれが実際に元を取れているかがわかります。",
"Label (optional)": "名前（任意）",
"Entries": "口数",
"$ Each": "1口あたり（$）",
"Cost $": "費用 $",
"won in brackets": "ブラケットでの獲得額",
"The head-to-head block after the cut. Bonus pins vary by tournament — set them to whatever this event uses.": "予選カット後の直接対決ブロックです。ボーナスピンは大会によって異なるので、この大会のルールに合わせて設定してください。",
"Date bowled": "投球日",
"Bonus per win": "勝利ボーナス",
"Bonus per tie": "引き分けボーナス",
"Match": "試合",
"by": "差",
"Track frames": "フレームを記録",
"Opp hcp": "相手ハンデ",
"+ Add Match": "+ 試合を追加",
"Go to the stepladder": "ステップラダーへ",
"Sudden death, no bonus pins. Enter the seeds and the app works out where you finished.": "一発勝負で、ボーナスピンはありません。シードを入力すると、最終順位をアプリが計算します。",
"e.g. 3": "例：3",
"Step": "ステップ",
"+ Add Step": "+ ステップを追加",
"Steps": "ステップ",
"nothing further": "なし",
"How it went": "大会の振り返り",
"With handicap": "ハンデ込み",
"Block": "ブロック",
"average over": "アベレージ、対象",
"Bonus": "ボーナス",
"pins vs opponents": "ピン（対戦相手比）",
"Best: match": "ベスト：試合",
"Worst: match": "ワースト：試合",
"On to": "次のラウンド：",
"Share this tournament": "この大会を共有",
"is saved to your history. Bowling another block of it, or starting a new tournament?": "は履歴に保存されています。この大会の別のブロックを投げますか？それとも新しい大会を始めますか？",
"Another block": "別のブロック",
"New tournament": "新しい大会",
"e.g. Spring Masters": "例：Spring Masters",
"e.g. Bowlero Pittsburgh": "例：Bowlero Pittsburgh",
"Handicap per game": "1ゲームあたりのハンデ",
"e.g. 40": "例：40",
"Bowling with": "ペアの相手",
"Partner's name": "パートナーの名前",
"Who bowls frame 1": "1フレーム目を投げる人",
"You bowl frames": "担当フレーム：",
"every game": "（毎ゲーム）",
"in game 1, then you swap each game": "（1ゲーム目。以降はゲームごとに交代）",
". The score stays out of your average since you did not bowl it alone, but your own frames still count.": "。1人で投げたスコアではないためアベレージには含まれませんが、自分が投げたフレームは集計されます。",
"Alternate who leads off each game": "ゲームごとに先に投げる人を交代",
"+ Add Another Day or Block": "+ 別の日またはブロックを追加",
"Cancel Tournament": "大会を中止",
"This deletes": "削除対象：",
"this tournament": "この大会",
"— every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "— この大会に入力したすべてのブロック、投球、スコア、ブラケットが削除され、ホームに戻ります。元に戻すことはできません。",
"Brackets and side pots": "ブラケットとサイドポット",
"Working out brackets and side pots as you go is part of the paid plan. Side games in league stay free.": "ブラケットとサイドポットをその場で計算する機能は有料プランでご利用いただけます。リーグのサイドゲームは引き続き無料です。",
"How did it finish?": "最終結果は？",
"The stepladder says": "ステップラダーの結果：",
"Anything worth remembering about it?": "覚えておきたいことは？",
"Entry & Winnings": "参加費と賞金",
"The tournament payout only. Bracket and side pot winnings go on the Brackets tab.": "大会の賞金のみです。ブラケットとサイドポットの賞金は「ブラケット」タブに入力します。",
"Tournament buy in": "大会の参加費",
"Tournament winnings": "大会の賞金",
"Brackets buy in": "ブラケットの参加費",
"Brackets winnings": "ブラケットの賞金",
"net": "（収支）",
"Tournament Notes": "大会メモ",
"Overall takeaways…": "全体の振り返り…",
"✓ Tournament Saved": "✓ 大会を保存しました",
"Save & Finish Tournament": "保存して大会を終了",
"Close this tournament and start a new one? It stays in your history.": "この大会を閉じて、新しい大会を始めますか？この大会は履歴に残ります。",
"Yes, close it": "はい、閉じる",
"Keep working on it": "続ける",
"Close tournament": "大会を閉じる",
"Side pot": "サイドポット",
"Money": "収支",
"Tournament Total": "大会合計",
"All Days": "全日程",
"scratch ·": "（スクラッチ） ·",
"handicap pins": "ピン（ハンデ）",
"← still standing": "← 残っているピン",
"Pins standing": "残りピン",
"Spare made?": "スペアメイク？",
"← tap what fell": "← 倒れたピンをタップ",
"Average over the last 13 games": "直近13ゲームのアベレージ",
"Game 1": "1ゲーム目",
"Scores, or every ball": "スコアだけでも、1投ごとでも",
"Arsenal · 3 balls": "アーセナル · ボール3個",
"47% strikes · 54% spares": "ストライク47% · スペア54%",
"15lb · RG 2.5 / Diff 0.05": "15lb · RG 2.5 / Diff 0.05",
"45% strikes · 61% spares": "ストライク45% · スペア61%",
"15lb · RG 2.57 / Diff 0.046": "15lb · RG 2.57 / Diff 0.046",
"45% strikes · 67% spares": "ストライク45% · スペア67%",
"15lb · RG 2.49 / Diff 0.05": "15lb · RG 2.49 / Diff 0.05",
"Layouts, surface, specs": "レイアウト、表面、スペック",
"Split Happens": "Split Happens",
"Tuesday House Shot · 4 bowlers": "Tuesday House Shot · 4人",
"1. You": "1. 自分",
"2. Rob": "2. Rob",
"3. Kim": "3. Kim",
"4. Dee": "4. Dee",
"A league first, a team later": "先にリーグ、チームはその後で",
"Mine": "自分",
"Trends": "推移",
"Center": "ボウリング場",
"On the road since Jul 9": "7月9日からスタート",
"First 700 series": "初の700シリーズ",
"4 pins short · best 696": "あと4ピン · ベスト696",
"September": "9月",
"10 Sep": "9月10日",
"Lanes broke down early. Moved left 3 and it came back.": "レーンが早めにブレイクダウン。左に3枚移動したら戻った。",
"Settings › Walkthroughs": "設定 › 使い方ガイド",
"Tonight's scores": "今日のスコア",
"Game 2": "2ゲーム目",
"Game 3": "3ゲーム目",
"Three numbers and you're done": "3つ入力するだけで完了",
"Frame 4 · Ball 1": "4フレーム · 1投目",
"Other leave": "その他",
"How it hit": "当たり方",
"Flush": "ジャストポケット",
"Messenger": "メッセンジャー",
"Frame over — no pins to pick": "フレーム終了 — 選ぶピンはありません",
"Frame 5 · left standing": "5フレーム · 残りピン",
"Tap the pins, then answer": "ピンをタップしてから回答",
"Frame 6 · left standing": "6フレーム · 残りピン",
"None fell? Just save": "1本も倒れなかったら、そのまま保存",
"vs average": "アベレージ比",
"Brackets": "ブラケット",
"Standard": "通常",
"Baker": "ベーカー",
"Scratch": "スクラッチ",
"Format": "形式",
"10 pin": "10ピン",
"9 pin no-tap": "9ピンノータップ",
"Mix them however the event runs": "大会の方式に合わせて自由に組み合わせ",
"Qualifying": "予選",
"Match Play": "マッチプレー",
"Stepladder": "ステップラダー",
"Day 1": "1日目",
"Day 2": "2日目",
"Cut": "カット",
"1812 of 1750 across 8 games (all blocks so far).": "カットライン1750に対して8ゲームで1812（これまでの全ブロック）。",
"Where you stand, updated every game": "現在の状況を毎ゲーム更新",
"Qualified for": "進出先",
"Match play": "マッチプレー",
"N/A": "なし",
"Go to match play": "マッチプレーへ",
"The margin already said you made it": "カットとの差で、通過はもうわかっています",
"Match 1": "第1試合",
"WIN": "勝ち",
"by 23": "（23ピン差）",
"Track frames (G1)": "フレームを記録（1ゲーム目）",
"Them": "相手",
"Game 1 again — qualifying doesn't follow you here": "また1ゲーム目から — 予選のスコアは引き継がれません",
"Record": "戦績",
"Bonus pins": "ボーナスピン",
"Your seed": "自分のシード",
"Step 2": "ステップ2",
"LOSS": "負け",
"by 11": "（11ピン差）",
"Seed": "シード",
"2nd": "",
"Finished": "最終順位",
"Won one step, then out to the 2 seed.": "1ステップ勝ち上がり、第2シードに敗退。",
"Worked out from your seed — never asked": "シードから自動で計算 — 入力は不要",
"8 games": "8ゲーム",
"Every phase, and what it paid": "各段階と、その獲得賞金",
"Choose file": "ファイルを選択",
"What changed": "変化したこと",
"Your Bionic is carrying 8% better than the Phaze II on this pattern — 61% against 53% over 94 first balls.": "このパターンでは、BionicのキャリーがPhaze IIを8%上回っています — 1投目94回で61%対53%。",
"10 pin conversion": "10番ピンのスペアメイク率",
"18 more": "あと18回",
"Six of your eight opens were single-pin leaves — the 10 alone cost you 27 pins. The Bionic carried everything in game three; it was the one you finished on.": "オープンフレーム8回のうち6回は1本残り — 10番ピンだけで27ピンを失いました。3ゲーム目はBionicがすべてキャリーし、最後まで使ったのもこのボールでした。",
"Ryan's night": "Ryanの今日の成績",
"Her lamp, on every screen": "ランプはすべての画面に",
"Brooklyn": "Brooklyn",
"2 wishes left today": "今日の願いごとは残り2回",
"Which ball should I start on next week?": "来週はどのボールから投げ始めるべきですか？",
"On a 37-foot pattern you've struck more with the Bionic every time out. Start there.": "37フィートのパターンでは、毎回Bionicの方がストライクが多く出ています。Bionicから始めましょう。",
"Read this to the bowler": "このコードをボウラーに読み上げてください",
"7KPQ-2M4R": "7KPQ-2M4R",
"Works once, for the next 7 days": "1回のみ有効・期限は7日間",
"Works once, on their phone": "相手のスマホで1回だけ使えます",
"I": "自分",
"m bowling": "が投球",
"m coaching": "が指導",
"Dana Reyes": "Dana Reyes",
"Sam Ortiz": "Sam Ortiz",
"A dot means they answered something": "「•」は相手から何か回答があったことを示します",
"From 412 shots": "412投の集計",
"18 Mar · Tuesday Classic": "3月18日 · Tuesday Classic",
"11 Mar · Tuesday Classic": "3月11日 · Tuesday Classic",
"How much data it": "もとになったデータ量",
"s built on, beside it": "をすぐ横に表示",
"New task": "新しい課題",
"Metric": "指標",
"Leave the target off if it isn": "目標が数値でなければ",
"t a number": "空欄のままに",
"Open": "未完了",
"Clean up the single-pin spares": "1本残りのスペアを確実に取る",
"Target 60%": "目標60%",
"due 1 Apr": "期限4月1日",
"Reached 58% so far": "現在の実績：58%",
"Mark done": "完了にする",
"Record attempt": "挑戦を記録",
"What came back, not just what was asked": "出した課題だけでなく、返ってきた結果もわかります",
"By ball · strike rate": "ボール別 · ストライク率",
"Bionic": "Bionic",
"Phaze II": "Phaze II",
"Zen Master": "Zen Master",
"You vs Split Happens": "自分 vs Split Happens",
"Rob": "Rob",
"Team average": "チームアベレージ",
"Same measure, same scale": "同じ指標、同じ尺度",
"Ball · strike rate": "ボール · ストライク率",
"61% · 94 shots": "61% · 94投",
"47% · 8 more shots needed": "47% · あと8投必要",
"Questions it can answer": "答えられる質問",
"Which ball carries best?": "どのボールのキャリーが一番いいですか？",
"Where is a spare leaking?": "どのスペアを取りこぼしていますか？",
"Do I fall off in game three?": "3ゲーム目でスコアが落ちていますか？",
"Jan": "1月",
"Mar": "3月",
"Last 90 days": "直近90日間",
"Showing 13 of 40 games": "40ゲーム中13ゲームを表示",
"All balls": "すべてのボール",
"Only games and shots recorded with this ball. Games with no ball noted are left out.": "このボールで記録したゲームと投球のみです。ボールが記録されていないゲームは除外されます。",
"across every league": "（全リーグ）",
"averaging": "アベレージ",
"· high": "· ハイゲーム",
", low": "、ローゲーム",
". The spread is": "。スコアのばらつきは",
"pins — that's what a nightly average hides.": "ピンです — 1日ごとのアベレージでは、これが見えません。",
"Show": "表示範囲",
"Last": "直近",
"days": "日間",
"This one needs frame tracking. You're on game tracking, so there's nothing to plot here yet.": "この項目にはフレームごとの記録が必要です。現在はゲーム単位の記録なので、まだグラフにできるデータがありません。",
"Need at least 2 nights logged before there's a line to draw.": "グラフを描くには、少なくとも2日分の記録が必要です。",
"Per game": "ゲームごと",
"Per night": "日ごと",
"Every game": "全ゲーム",
"Share this trend": "この推移を共有",
"Nights here average": "ここでの1日あたりの試行回数は平均",
"attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.": "回と少なめです — 自分の投球が何も変わっていなくても、個々の点は大きく上下します。",
"Latest": "最新",
"Free trial —": "無料トライアル —",
"left": "",
"Your subscription starts when the trial ends.": "サブスクリプションはトライアル終了時に開始します。",
"Thanks for bowling with us": "いつもご利用ありがとうございます",
"You are on the monthly plan. The yearly plan works out cheaper — switch any time.": "現在は月額プランです。年額プランのほうがお得です — いつでも切り替えられます。",
"See the yearly plan": "年額プランを見る",
"'Archivo', system-ui, -apple-system, sans-serif": "",
"'Roboto Condensed', 'Archivo', system-ui, sans-serif": "",
"This": "この内容",
"check it against what you saw on the lane": "レーンで実際に見たものと照らし合わせてください",
"was": "は",
"by AI. It can be confidently wrong —": "AIによるものです。自信ありげに間違えることがあります —",
"Other bowlers reported the shared specs for ⟨0⟩ as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "他のボウラーから⟨0⟩の共有スペックが正しくないと報告があったため、スペックを削除しました。ボールはそのまま残っています — 時間のあるときに詳細を入力し直してください。",
"best ⟨0⟩": "ベスト⟨0⟩",
"Now: ⟨0⟩": "現在：⟨0⟩",
"Which pins did the second ball knock down? ⟨0⟩ this frame": "2投目で倒したピンは？ このフレーム計⟨0⟩本",
"⟨0⟩ isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "⟨0⟩はベーカー方式の日にはお出しできません — フレームは1人のボウラーではなく、ペアのものだからです。",
"This league usually runs ⟨0⟩. Anything you set here is for tonight only.": "このリーグの通常のパターンは⟨0⟩です。ここでの設定は今日のみ有効です。",
"This deletes tonight's shots, game scores and match points for ⟨0⟩ in ⟨1⟩, clears the setup, and takes you back to Home. This cannot be undone.": "⟨0⟩の⟨1⟩での今日の投球、ゲームスコア、対戦ポイントを削除し、準備内容をクリアしてホームに戻ります。この操作は取り消せません。",
"First ball: ⟨0⟩": "1投目：⟨0⟩",
"Second ball: ⟨0⟩": "2投目：⟨0⟩",
"Done⟨0⟩": "完了⟨0⟩",
"This deletes today's practice shots and game scores for ⟨0⟩ and takes you back to Home. This cannot be undone.": "⟨0⟩の今日の練習の投球とゲームスコアが削除され、ホームに戻ります。元に戻せません。",
"Where do you bowl? ⟨0⟩": "普段どこで投げていますか？⟨0⟩",
"⟨0⟩ — a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "⟨0⟩ — 表示されない日、別のスマホで入力したスコア、投げ続けているのに動かなくなった成績など。",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app. ⟨0⟩, and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": "まだ保存待ちのデータを送信してから、履歴をすべて最初からダウンロードし直し、アプリを再読み込みします。⟨0⟩。記録したものが失われることもありません。通常の起動より多くのデータ通信を使い、シーズンが長いと少し時間がかかることもあるので、Wi-Fiにつないでおくのがおすすめです。",
"Questions, or want your data deleted? ⟨0⟩": "ご質問やデータ削除のご希望はこちら：⟨0⟩",
"This deletes your account and ⟨0⟩ — every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "アカウントと⟨0⟩を削除します — すべての投球と日別記録、プロフィールと名前、アーセナル、目標、チームへの所属。再びログインすることはできず、こちらで復元することもできません。",
"Want a copy first? Use ⟨0⟩ above before you do this.": "先にコピーを取っておきたい場合は、実行する前に上の⟨0⟩を使ってください。",
"Type ⟨0⟩ to confirm": "確認のため⟨0⟩と入力してください",
"The same email has a sign-in link in it, if you'd rather tap that.⟨0⟩The code lasts an hour.": "同じメールにログイン用のリンクも記載されています。タップする方が良ければそちらをどうぞ。⟨0⟩コードの有効期限は1時間です。",
"⟨0⟩or⟨1⟩": "⟨0⟩または⟨1⟩",
"⟨0⟩ Weakest": "⟨0⟩ 最低",
"⟨0⟩ Strongest": "⟨0⟩ 最高",
"⟨0⟩ Everything else": "⟨0⟩ その他",
"⟨0⟩ Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "⟨0⟩ 支払い状況にかかわらず、すべての機能がすでに使える状態です。決済のテストのために、下から購入することもできます。",
"Every league and team you bowl in ⟨0⟩": "所属するすべてのリーグとチーム ⟨0⟩",
"⟨0⟩ is saved to your history. Bowling another block of it, or starting a new tournament?": "⟨0⟩は履歴に保存されています。この大会の別のブロックを投げますか？それとも新しい大会を始めますか？",
"⟨0⟩Alternate who leads off each game": "⟨0⟩ゲームごとに先に投げる人を交代",
"This deletes ⟨0⟩ — every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "⟨0⟩を削除します — この大会に入力したすべてのブロック、投球、スコア、ブラケットが削除され、ホームに戻ります。元に戻すことはできません。",
"⟨0⟩Import": "⟨0⟩取り込む",
"Match 1 ⟨0⟩⟨1⟩": "第1試合 ⟨0⟩⟨1⟩",
"Step 2 ⟨0⟩⟨1⟩": "ステップ2 ⟨0⟩⟨1⟩",
"Which ball carries best?⟨0⟩Where is a spare leaking?⟨1⟩Do I fall off in game three?": "どのボールのキャリーが一番いいですか？⟨0⟩どのスペアを取りこぼしていますか？⟨1⟩3ゲーム目でスコアが落ちていますか？",
"up": "プラス",
"down": "マイナス",
"they": "チーム",
"they're": "そのボウラー",
"year": "年",
"month": "月",
"yearly": "年額",
"monthly": "月額",
"frames": "フレーム",
"nights": "投球日数",
"now": "現在",
"mixed": "混在",
"unnamed": "名前なし",
"(me)": "（自分）",
"That was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "この回答はAIが書いたものです。自信ありげに間違えることがあります — レーンで実際に見たものと照らし合わせてください。",
"This scorecard was read by AI. It can be confidently wrong — check the numbers against the card before saving.": "このスコアシートはAIが読み取ったものです。自信ありげに間違えることがあります — 保存する前に、数値をスコアシートと照らし合わせてください。",
"This list was found by AI. It can be confidently wrong — check the name and address before you rely on it.": "このリストはAIが見つけたものです。自信ありげに間違えることがあります — 利用する前に名前と住所を確認してください。",
"⟨0⟩ wants to be your coach.": "⟨0⟩がコーチになることを希望しています。",
"⟨0⟩ wants to be your bowler.": "⟨0⟩が指導を受けることを希望しています。",
"Automatic": "自動",
"Automatic · ⟨0⟩": "自動 · ⟨0⟩",
"Automatic follows your phone's language. Changing it restarts the app.": "「自動」ではスマホの言語設定に合わせます。変更するとアプリが再起動します。",
"theme::Light": "ライト",
"theme::Dark": "ダーク",
"hit::High": "厚め",
"hit::Light": "薄め",
"hit::Brooklyn": "ブルックリン",
"confidence::Clear": "明確",
"Analysis came back empty. Try again.": "分析結果が空でした。もう一度お試しください。",
"Analysis came back malformed. Try again.": "分析結果の形式が正しくありませんでした。もう一度お試しください。",
"Couldn't generate insights right now.": "今は分析を生成できませんでした。",
"Insights aren't configured on the server.": "サーバーで分析機能が設定されていません。",
"Insights is part of the paid plan.": "分析は有料プランの機能です。",
"Not enough data yet to analyse.": "分析に必要なデータがまだ足りません。",
"You've used this quite a lot in the last hour. Give it a little while and try again.": "この1時間でかなりの回数を使いました。少し時間をおいてから、もう一度お試しください。",
"Ask me something.": "何か質問してください。",
"Brooklyn only answers on the paid plan.": "Brooklynが答えるのは有料プランのみです。",
"Sign in first.": "先にログインしてください。",
"That's a lot. Try asking me one thing.": "ちょっと多すぎます。質問は1つにしてみてください。",
"The lamp is cold. Try again later.": "ランプが冷えています。後でもう一度お試しください。",
"The lamp went quiet. Try again in a moment.": "ランプが静かになってしまいました。少ししてからもう一度お試しください。",
"You've used all three today. The lamp recharges tomorrow.": "本日の3回分をすべて使いました。ランプは明日また充電されます。",
"Subscriptions are not available yet.": "サブスクリプションはまだご利用いただけません。",
"That plan is not available right now.": "このプランは現在ご利用いただけません。",
"Too many attempts. Try again shortly.": "試行回数が多すぎます。しばらくしてからもう一度お試しください。",
"You already have a subscription.": "すでにサブスクリプションに登録済みです。",
"Could not open the subscription manager.": "サブスクリプションの管理画面を開けませんでした。",
"No Stripe subscription found for this account.": "このアカウントのStripeサブスクリプションが見つかりません。",
"Subscription management is not available yet.": "サブスクリプションの管理はまだご利用いただけません。",
"Account deletion isn't configured on the server. Email support@mybowlingjourney.com and we'll do it by hand.": "サーバーでアカウント削除が設定されていません。support@mybowlingjourney.com までメールでご連絡いただければ、手動で削除します。",
"Account deletion isn't configured on the server.": "サーバーでアカウント削除が設定されていません。",
"Couldn't delete the account just then. Try again, or email support@mybowlingjourney.com.": "今はアカウントを削除できませんでした。もう一度お試しいただくか、support@mybowlingjourney.com までメールでご連絡ください。",
"Not authenticated.": "ログインしていません。",
"Not authenticated": "ログインしていません",
"A location is needed to search nearby centers.": "近くのボウリング場を検索するには位置情報が必要です。",
"Location search isn't configured on the server.": "サーバーで位置情報検索が設定されていません。",
"One of the images is too large. Try a smaller photo.": "画像の1つが大きすぎます。もっと小さい写真でお試しください。",
"One of the images was empty or malformed.": "画像の1つが空か、破損していました。",
"Scorecard import is part of the paid plan.": "スコアシートの取り込みは有料プランの機能です。",
"The import service can't check its limits right now. Try again shortly.": "取り込みサービスが現在、利用上限を確認できません。しばらくしてからもう一度お試しください。",
"The scorecard reader isn't available right now.": "スコアシートの読み取り機能は現在ご利用いただけません。",
"Those images come to too much to send at once. Try fewer at a time.": "画像の合計サイズが大きすぎて、一度に送信できません。枚数を減らしてお試しください。",
"Too many images in one request (max 6)": "1回のリクエストの画像が多すぎます（最大6枚）",
"You've imported a lot in the last hour. Give it a little while and try again.": "この1時間でかなり多くの取り込みを行いました。少し時間をおいてから、もう一度お試しください。",
"No images provided": "画像がありません",
"Nightcap isn't configured on the server.": "Nightcapがサーバーで設定されていません。",
"Not enough logged tonight for a nightcap.": "Nightcapを作るには、今日の記録が足りません。",
"That's a few nightcaps in one hour. Give it a little while and try again.": "1時間でNightcapを何杯も注文しています。少し時間をおいてから、もう一度お試しください。",
"The Nightcap is part of the paid plan.": "Nightcapは有料プランの機能です。",
"The nightcap came back empty. Tap to try again.": "Nightcapの中身が空でした。タップしてもう一度お試しください。",
"The nightcap came back malformed. Tap to try again.": "Nightcapが正しくない形式で届きました。タップしてもう一度お試しください。",
"The nightcap came back thin. Tap to try again.": "Nightcapの中身が薄すぎました。タップしてもう一度お試しください。",
"The nightcap took too long. Tap to try again.": "Nightcapに時間がかかりすぎました。タップしてもう一度お試しください。",
"Could not record that purchase.": "購入を記録できませんでした。",
"Could not verify that purchase.": "購入を確認できませんでした。",
"Purchases are not available yet.": "購入はまだご利用いただけません。",
"That purchase could not be verified.": "この購入は確認できませんでした。",
"My Groups": "マイグループ",
"none here": "投球なし",
"At a glance": "概要",
"Spares": "スペア",
"Language · Langue": "Language · Idioma · Langue · 言語",
"Français (Canada)": "Français (Canada)",
"English": "English",
"1 Apr": "4月1日",
"18 Mar 2026": "2026年3月18日",
"22 Mar": "3月22日",
"Tue": "火曜",
"✓ High game": "✓ ハイゲーム",
"✓ Quarter game": "✓ 25セントゲーム",
"✓ Dollar game": "✓ 1ドルゲーム",
"✓ 3-6-9 (whole night)": "✓ 3-6-9（1日通し）",
"Free fall against string pins. Set the rack type on two centers — or on one mixed house, with its free-fall lanes.": "フリーフォール式とストリング式の比較です。2つのボウリング場でピンセッターの種類を設定してください — または、フリーフォール式のレーンがある混在型のボウリング場1つでも比較できます。",
"Right-handed, backup": "右投げ、バックアップ",
"Left-handed, backup": "左投げ、バックアップ",
"Tournament buy in $": "大会の参加費（$）",
"Tournament winnings $": "大会の賞金（$）",
"milestones": "マイルストーン",
"Spring Masters": "Spring Masters",
"Changing the language": "言語を変更する",
"Language · Langue in Settings. Automatic follows your phone's language, or pick Français (Canada) or English. The app restarts in the language you pick.": "設定の「Language · Idioma · Langue · 言語」で変更できます。「自動」ではスマホの言語設定に合わせます。Français (Canada)またはEnglishを選ぶこともできます。選んだ言語でアプリが再起動します。",
"Quarter $": "25セント（$）",
"Dollar $": "1ドル（$）",
"left lane": "",
"right lane": "",
"left handed": "左投げ",
"Automatic ·": "自動 ·",
"Suivi de quilles": "Suivi de quilles",
"End League & View Results": "リーグを終了して結果を見る",
"End Practice & View Results": "練習を終了して結果を見る",
"End Tournament & View Results": "大会を終了して結果を見る",
"End Open Bowling & View Results": "フリー投球を終了して結果を見る",
"End Session & View Results": "セッションを終了して結果を見る",
"Save & Finish League": "保存してリーグを終了",
"Save & Finish Practice": "保存して練習を終了",
"Save & Finish Open Bowling": "保存してフリー投球を終了",
"Save & Finish Session": "保存してセッションを終了",
"10-pin": "10番ピン",
"degrees": "度",
"rpm": "rpm",
"mph": "mph",
"hand::R": "右",
"hand::L": "左",
"title::Inbox": "受信トレイ",
"title::Import scorecard": "取り込み",
"tab::Clean frames": "クリーンフレーム",
"tab::Other leaves": "その他",
"tab::First ball": "1投目",
"tab::10-pin": "10番ピン",
"tab::Stepladder": "ステップラダー",
"converted": "メイク率",
"G1": "1G",
"G2": "2G",
"G3": "3G",
"G4": "4G",
"G5": "5G",
"G6": "6G",
"Two-sided": "二刀流",
"Runner-up": "準優勝",
"Pin-to-PAP": "ピン〜PAP",
"Pin-to-COG": "ピン〜COG",
"Won $": "獲得額（$）",
"placeholder::Score": "スコア",
"— choose a ball —": "— ボールを選択 —",
"field::Rev rate": "回転数",
"field::Breakpoint": "ブレイクポイント",
"field::Axis rot.": "軸回転",
"field::Axis tilt": "軸傾斜",
"field::Sole #": "ソール",
"field::Heel #": "ヒール",
"tile::High game": "ハイゲーム",
"tile::High series": "ハイシリーズ",
"pin::1 pin": "1番ピン",
"pin::2 pin": "2番ピン",
"pin::3 pin": "3番ピン",
"pin::4 pin": "4番ピン",
"pin::5 pin": "5番ピン",
"pin::6 pin": "6番ピン",
"pin::7 pin": "7番ピン",
"pin::8 pin": "8番ピン",
"pin::9 pin": "9番ピン",
"pin::10 pin": "10番ピン",
"badges::All": "すべて",
"tile::League average": "リーグアベレージ",
"All nights": "すべての日",
"placeholder::board #": "ボード",
"placeholder::degrees": "°",
"Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": "無料トライアルがアカウントに適用されるかどうかは、確定する前にGoogle Playに表示されます。その後は、解約するまで自動で更新されます。",
"Pro": "Pro",
"Reading your question…": "質問を読んでいます…",
"questions today. Ask again tomorrow.": "",
"Brooklyn couldn't answer that right now. Try again in a few minutes.": "Brooklynは今は回答できませんでした。数分後にもう一度お試しください。",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She has her own card at the top of Improve. Three questions a day.": "一般的な数字は「成績」画面で確認できます。Brooklynは、そこでは答えが出ない質問のためのアシスタントです — 自分のボウリングについて普段の言葉で質問すると、記録したデータから答えを導き出します。まだ記録していないデータが必要な場合は、何を記録し始めればよいかを教えてくれます。「上達」タブの一番上に専用のカードがあります。質問は1日3回までです。",
"2 questions left today": "今日の残り質問：2回",
"Brooklyn isn't available right now. Try again later.": "Brooklynは現在ご利用いただけません。しばらくしてからもう一度お試しください。",
"You've used all three questions today. Ask again tomorrow.": "本日の質問3回分をすべて使いました。また明日質問してください。",
"Brooklyn couldn't answer that. Try again in a moment.": "Brooklynはその質問に回答できませんでした。少し待ってからもう一度お試しください。",
"Brooklyn took too long to answer. Try again.": "Brooklynの回答に時間がかかりすぎました。もう一度お試しください。",
"AI": "AI",
"tab::AI": "AI",
"On the Improve tab, open Goals, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "「上達」タブで「目標」を開き、「目標を追加」を押して、取り組む項目を選びます — アベレージ、ストライク率、スペアメイク率など。進み具合は投げるたびに更新されます。",
"Start a drill from the Goals tab on Improve. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "「上達」の「目標」タブからドリル練習を始めます。ターゲット — 特定のスペアやピンの組み合わせ — を選ぶと、そのセッションでの成功とミスをアプリが記録します。",
"Improve has a Coach tab. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "「上達」には「コーチ」タブがあります。「相手がコーチ」か「自分がコーチ」かを選んで、コードを作成します。8文字を相手に読み上げ、相手のスマホで入力してもらえば連携完了です。",
"+6%": "",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She's on the AI tab of Improve, below Insights. Three questions a day.": "「成績」画面ではおなじみの数字を確認できます。そこで答えが出ない疑問は、Brooklynに聞けます — 自分のボウリングについて普段の言葉で質問すると、記録したデータから答えを導き出します。まだ記録していないデータが必要な場合は、何を記録し始めればよいかを教えてくれます。「上達」の「AI」タブ、「分析」の下にいます。質問は1日3回までです。",
"no reading": "",
"more than one bowler": "",
"not a card with drawn racks": "",
"Press Import in the header. Say whether it's practice or league, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving. Tournaments aren't imported: log them live on Bowl, where squads, blocks, match play and stepladder are all tracked.": "ヘッダーの「取り込む」を押します。練習かリーグかを選び、チームと日付を選んでから、スコアモニターの写真を追加します。アプリがゲームとフレームを読み取るので、保存する前に各列をボウラーに割り当てます。大会は取り込めません。「投球」タブでその場で記録してください。シフト、ブロック、マッチプレー、ステップラダーまですべて記録できます。",
"⚠️ Check the flagged ball below — it couldn't be reliably read from the image.": "⚠️ 下の印が付いた投球を確認してください — 画像から正確に読み取れませんでした。",
"⚠️ Check the flagged balls below — they couldn't be reliably read from the image.": "⚠️ 下の印が付いた投球をそれぞれ確認してください — 画像から正確に読み取れませんでした。",
"This frame couldn't be read from the image.": "このフレームは画像から読み取れませんでした。",
"▾ Hide frames": "▾ フレームを閉じる",
"▸ Check frames": "▸ フレームを確認",
"✓ This is right": "✓ これで正しい",
"Waiting for an app update to finish": "アプリのアップデート完了を待っています",
"The cloud isn't ready for this yet. Nothing is lost on this phone; it will upload once the update is complete.": "クラウド側の準備がまだできていません。この端末上のデータは失われていません。アップデートが完了するとアップロードされます。",
"queued behind an earlier write for this row": "この行への以前の書き込みの後ろで待機中",
"The free plan covers one team, and you're already on one. Upgrade to Pro to add another?": "無料プランで所属できるチームは1つまでで、すでに1チームに所属しています。Proにアップグレードしてチームを追加しますか？",
"Sign in with this link?": "このリンクでログインしますか？",
"Text": "メッセージ",
"Your home centers": "よく行くボウリング場",
"Somewhere else?": "別の場所ですか？",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with a code, you get one to text them and they enter it when they sign up; with their email, they're linked the moment they sign in with that exact address.": "今すぐメンバー表に枠を確保します — アカウントがなくても、「記録するボウラー」からその人の名前でスコアをすぐに記録できます。どちらの方法でも本人が自分でこの枠を引き継ぎ、それまでに記録した内容はすべてそのまま残ります。コードの場合は、届いたコードを本人にメッセージで送り、本人が登録時に入力します。メールアドレスの場合は、本人がそのアドレスでログインした時点で紐付けられます。",
"Filled in from your note — check it's the right game.": "メモから入力しました — 正しいゲームか確認してください。",
"(pending)": "（承認待ち）",
"Couldn't tell which league this night belongs to. Reload the app and try again.": "この日がどのリーグのものか判別できませんでした。アプリを再読み込みして、もう一度お試しください。",
"Couldn't change your name without a connection. Try again when you're back online.": "オフラインのため名前を変更できませんでした。オンラインに戻ってからもう一度お試しください。",
"Couldn't change your name. Try again in a moment.": "名前を変更できませんでした。少し待ってからもう一度お試しください。",
"No spare ball. A plastic ball goes straight at corner pins without hooking.": "スペアボールがありません。プラスチックボールならフックせずにまっすぐコーナーピンを狙えます。",
"it can't": "配置できません",
"they can't": "配置できません",
"Nothing strong enough for heavy oil or a fresh pattern.": "オイルの多いレーンやフレッシュなオイルパターンに対応できる強いボールがありません。",
"Nothing weak enough for dry lanes or late in a block when the lanes burn up.": "ドライなレーンや、ブロック終盤でオイルが削れてきたときに使える弱いボールがありません。",
"No ball with a sharp, angular back end for when you need it to turn the corner.": "しっかり曲がり込ませたいときに使える、バックエンドで鋭く切れるボールがありません。",
"No smooth, controllable ball for when the back end is too strong.": "バックエンドが強すぎるときに使える、スムーズで扱いやすいボールがありません。",
"Bag": "バッグ",
"The Caddie couldn't answer just then. Tap to try again.": "Caddieが応答できませんでした。タップしてもう一度お試しください。",
"Arsenal analysis": "アーセナル分析",
"Add your balls on the Balls tab, with their cover and core, and this maps where each one sits and what your bag is missing.": "「ボール」タブでボールを追加してカバーストックとコアを入力すると、各ボールの位置とバッグに足りないものがここに表示されます。",
"Compare bags": "バッグを比較",
"Where each ball sits, from its cover, surface, core and layout — cover and surface count most, because they're what touches the lane. Positions are estimates from specs; your scores show what actually worked.": "カバーストック、サーフェス、コア、レイアウトから見た各ボールの位置です — レーンに触れるのはカバーストックとサーフェスなので、この2つを最も重視しています。位置はスペックからの推定で、実際に何が効いたかはスコアが示します。",
"First bag": "1つ目のバッグ",
"Second bag": "2つ目のバッグ",
"No ball here has the specs this chart needs yet.": "このチャートに必要なスペックがそろっているボールはまだありません。",
"◯ in both": "◯ 両方に入っている",
"⟨0⟩ Solid": "⟨0⟩ ソリッド",
"⟨0⟩ Hybrid": "⟨0⟩ ハイブリッド",
"⟨0⟩ Pearl": "⟨0⟩ パール",
"● Faded: specs incomplete": "● 薄い色：スペックが不完全",
"Bags side by side": "バッグを並べて比較",
"Strength": "強さ",
"Length": "レングス",
"Back end": "バックエンド",
"No ball is in both bags.": "両方のバッグに入っているボールはありません。",
"A wider range means the bag covers more conditions.": "幅が広いほど、そのバッグは多くのコンディションに対応できます。",
"Your balls": "マイボール",
"This bag is empty.": "このバッグは空です。",
"What the arsenal is missing": "アーセナルに足りないもの",
"What this bag is missing": "このバッグに足りないもの",
"Nothing obvious — it covers strong to weak, smooth to sharp, and has a spare ball.": "目立った不足はありません — 強いボールから弱いボールまで、スムーズからシャープまでそろっていて、スペアボールもあります。",
"From the catalog:": "カタログから：",
"The Caddie": "Caddie",
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.": "Caddieがバッグ全体を読み解きます — どのコンディションにどのボールを使うか、どのバッグがうまく組まれているか、何を加えて何を置いていくか。有料プランの機能です。",
"See the plan": "プランを見る",
"🏌️ The Caddie": "🏌️ Caddie",
"Asks which of these two bags is built for what.": "この2つのバッグがそれぞれどんな状況向けかを聞きます。",
"Reads the whole arsenal: each ball's job, your bags, and what to add or leave home.": "アーセナル全体を読み解きます：各ボールの役割、バッグの構成、加えるものと置いていくもの。",
"The Caddie is looking over the bag…": "Caddieがバッグを確認しています…",
"Ask the Caddie": "Caddieに聞く",
"Add cover and core to at least one ball first.": "まず、少なくとも1つのボールにカバーストックとコアを入力してください。",
"Spare ball": "スペアボール",
"Scores well": "好成績",
"Below average": "アベレージ以下",
"Not placed — add cover and core": "未配置 — カバーストックとコアを入力してください",
"games ·": "ゲーム ·",
"No specs entered": "スペック未入力",
"Surface:": "サーフェス：",
"not recorded": "未記録",
"(reading it as out of the box)": "（工場出荷時の状態とみなしています）",
"Layout:": "レイアウト：",
"· Length": "· レングス",
"· Back end": "· バックエンド",
"games at": "ゲームでアベレージ",
"By part of the night:": "時間帯別：",
"No games logged with it yet.": "このボールで記録したゲームはまだありません。",
"Each ball's job": "各ボールの役割",
"Gaps": "足りないもの",
"Next in the bag:": "次にバッグに加えるなら：",
"Leave at home:": "置いていくなら：",
"The Caddie's read": "Caddieの見立て",
"it's working from specs and your logged games, not from watching you throw": "投球を見ているのではなく、スペックと記録したゲームをもとにしています",
"Ask again": "もう一度聞く",
"ArsenalAnalysis": "ArsenalAnalysis",
"Weak": "弱め",
"Benchmark": "ベンチマーク",
"Strong": "強め",
"Early": "早め",
"Mid-lane": "ミッドレーン",
"Long": "長め",
"Smooth": "スムーズ",
"Controlled": "コントロール",
"Sharp": "シャープ",
"Light oil / late in the block": "少なめのオイル / ブロック終盤",
"Medium oil": "中程度のオイル",
"Heavy oil / fresh": "多めのオイル / 序盤",
"Length × Back end": "レングス × バックエンド",
"Where each ball starts to hook, and how it turns. Bigger dots are stronger balls.": "各ボールが曲がり始める位置と、その曲がり方です。点が大きいほど強いボールです。",
"Length × Strength": "レングス × 強さ",
"The ladder: strongest at the top for fresh or heavy oil, weakest at the bottom for dry lanes and late in the block.": "ラダー：上ほど強く、オイルが新しいときや多いとき向き。下ほど弱く、ドライなレーンやブロック終盤向きです。",
"RG × Differential": "RG × ディファレンシャル",
"Low RG (revs early)": "低RG（早めに回転する）",
"High RG (revs late)": "高RG（遅めに回転する）",
"Low diff (less flare)": "低ディファレンシャル（フレア少なめ）",
"High diff (more flare)": "高ディファレンシャル（フレア多め）",
"The core alone, as the maker's numbers. Bigger dots are more asymmetric.": "コア単体を、メーカー公表値で比べたものです。点が大きいほど非対称性が強いボールです。",
"Compare your bags, and ask the Caddie": "バッグを比較して、Caddieに相談",
"Where each ball sits, what scores, what's missing": "各ボールの位置づけ、スコアが出るボール、足りないもの",
"Ball against ball": "ボール同士の比較",
"Your read-back after every night — you've poured one.": "毎回その日の終わりにお届けする振り返り — これまでに1杯注ぎました。",
"A photo of the scorecard instead of typing every game.": "すべてのゲームを手入力する代わりに、スコアシートの写真1枚で。",
"Head to head": "直接対決",
"Your numbers against your teammates', and the team leaderboard.": "チームメイトとの成績比較と、チーム内ランキング。",
"Comparing your numbers with your friends'.": "フレンドとの成績比較。",
"House against house": "ボウリング場同士の比較",
"Your season side by side with the one before.": "今シーズンと前シーズンを並べて比較。",
"Tracking what you put in and won at tournaments.": "大会の参加費と獲得賞金の記録。",
"Your coach's tasks, notes and view of your numbers.": "コーチからの課題、メモ、コーチから見た成績。",
"Your 60 days of Pro are up.": "Proの60日間が終了しました。",
"Every game, shot and night you've logged — nothing is deleted": "記録したすべてのゲーム、投球、日 — 何も削除されません",
"Your own stats: strikes, spares, splits, leaves and each ball's numbers": "自分の成績：ストライク、スペア、スプリット、残りピン、各ボールの数値",
"One league, one team, a league bag and a tournament bag": "リーグ1つ、チーム1つ、リーグ用バッグと大会用バッグ各1つ",
"Badges, your journey and the calendar": "バッジ、あゆみ、カレンダー",
"Your Pro trial has ended": "Proトライアルが終了しました",
"What you've been using that Basic doesn't include:": "これまで使っていた機能のうち、Basicに含まれないもの：",
"Keep Pro ·": "Proを続ける ·",
"/month": "/月",
"Or": "または",
"/year": "/年",
"Basic is free, and keeps:": "Basicは無料で、次の機能は引き続き使えます：",
"Continue with Basic": "Basicで続ける",
"No card is on file, so nothing is charged when the trial ends — you move to Basic unless you choose Pro.": "カードが登録されていないため、トライアル終了時に請求されることはありません — Proを選ばない限り、Basicに移行します。",
"You against a teammate. Needs frames for you and at least one teammate in this league.": "チームメイトとの直接対決です。このリーグで、自分と少なくとも1人のチームメイトのフレーム記録が必要です。",
"Teammate": "チームメイト",
"This league only. Split Rate is the one where lower is better.": "このリーグのみ。スプリット率だけは、低いほど良い指標です。",
"All leagues": "すべてのリーグ",
"Language · Idioma · Langue": "",
"Nightcap, Insights, Brooklyn, the Caddie and coaching": "Nightcap、分析、Brooklyn、Caddie、コーチ",
"You cancelled, so this ends when the period you paid for runs out. Everything stays unlocked until then, and you can start it again any time before it ends.": "解約済みのため、お支払い済みの期間が終わると終了します。それまではすべての機能をご利用いただけます。終了前ならいつでも再開できます。",
"window::All": "全期間",
"tab::Season": "シーズン",
"tab::Calendar": "カレンダー",
"tab::Journey": "あゆみ",
"picker::Every night": "すべての日",
"field::Scoring": "スコア方式",
"tab::Side games": "サイドゲーム",
"Language · Idioma · Langue in Settings. Automatic follows your phone's language, or pick English, Español or Français. The app restarts in the language you pick.": "設定の「Language · Idioma · Langue · 言語」で変更できます。「自動」ではスマホの言語設定に合わせます。English、Español、Françaisを選ぶこともできます。選んだ言語でアプリが再起動します。",
"Español": "",
"Français": "",
"The Caddie's read was written by AI. It can be confidently wrong — it's working from specs and your logged games, not from watching you throw.": "Caddieの見立てはAIが作成したものです。自信たっぷりに間違えることもあります — スペックと記録したゲームをもとにしており、実際の投球を見ているわけではありません。",
"This was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "これはAIが作成したものです。自信たっぷりに間違えることもあります — レーンで実際に見たことと照らし合わせてください。",
"✓ Session Saved": "✓ セッションを保存しました",
"▼ How much data it’s built on, beside it": "▼ その横に、元になったデータの量",
"▼ Leave the target off if it isn’t a number": "▼ 数値でない場合は目標を空欄に",
"Composite average at each position in the night, across the whole season — shows whether they're bowling better early, middle, or late.": "シーズン全体での、その日の各ゲーム順ごとの総合アベレージです。序盤・中盤・終盤のどこで調子が良いかがわかります。",
"⟨0⟩ Urethane": "⟨0⟩ ウレタン",
"Language · Idioma · Langue · 言語": "",
"日本語": "",
"Language · Idioma · Langue · 言語 in Settings. Automatic follows your phone's language, or pick English, Español, Français or 日本語. The app restarts in the language you pick.": "設定の「Language · Idioma · Langue · 言語」で変更できます。「自動」はスマートフォンの言語に合わせます。English、Español、Français、日本語から選ぶこともできます。選んだ言語でアプリが再起動します。",
"Bowled.": "投球しました。",
"tab::Center": "会場",
"placeholder::Handicap": "ハンデ",
"tab::Handicap": "ハンデ",
"window::Games": "ゲーム数",
"field::Delivery": "投球スタイル",
"tile::Strikes": "ストライク率",
"field::Target": "目標",
"milestone::Next ·": "次の目標 ·",
"newly::.": "。"
},
"patterns": [
[
"Add {0}'s balls to start logging shots.",
"{0}のボールを追加すると、投球を記録できます。"
],
[
"{0}% spares",
"スペア率{0}%"
],
[
"Remove {0}",
"{0}を削除"
],
[
"Delete \"{0}\"? Its balls become ungrouped.",
"「{0}」を削除しますか？このグループのボールはグループなしになります。"
],
[
"Name change hasn't reached the cloud yet ({0}) — teammates won't be able to find you until it syncs.",
"名前の変更がまだクラウドに反映されていません（{0}）— 同期が終わるまで、チームメイトから見つけてもらえません。"
],
[
"Saved on this device, but hasn't reached the cloud yet ({0}) — it may not carry over to another device yet.",
"この端末には保存しましたが、まだクラウドに反映されていません（{0}）— 他の端末にはまだ反映されない場合があります。"
],
[
"of {0}",
"/{0}"
],
[
"Earned {0}",
"獲得{0}"
],
[
"Left {0}",
"未獲得{0}"
],
[
"The free plan covers {0} league bag and {1} tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.",
"無料プランで使えるのは、リーグ用バッグ{0}個と大会用バッグ{1}個です。追加のバッグ — ショートパターンの大会用バッグやスポーツコンディション用バッグなど — は有料プランの機能です。すでにバッグに入れたものがなくなることはありません。"
],
[
"{0} · {1}{2} ball{3:s}{4}",
"{0} · ボール{1}{2}個{4}"
],
[
"{0} ball{1:s} not packed in any bag. Practice always shows every ball regardless.",
"どのバッグにも入っていないボールが{0}個あります。練習では常にすべてのボールが表示されます。"
],
[
"Showing the {0}lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.",
"{0}lbの数値を表示しています — RGとディファレンシャルは重さによって異なり、このボールは複数の重さの数値が公開されています。"
],
[
"No published numbers for {0}lb specifically — showing the reference weight instead.",
"{0}lbの公開数値はありません — 代わりに基準の重さの数値を表示しています。"
],
[
"First balls at a full rack only {0} what a strike ball is for.",
"10本すべて立っている状態での1投目のみ {0} それがストライクボールの役割です。"
],
[
"{0} shots — too few to rely on",
"{0}投 — 判断するには少なすぎます"
],
[
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than {0} shots behind it, so treat it as preliminary. A dash means no shots at all.",
"数値はすべてストライク率です。太字はその区間でトップのボールです。差が偶然の範囲内のときは、どれも太字になりません。アンバー表示の率は裏付けとなる投球が{0}投未満なので、暫定値として見てください。「—」は投球がまったくないことを表します。"
],
[
"{0} went quiet. Try again in a moment.",
"{0}から応答がありませんでした。少し待ってからもう一度お試しください。"
],
[
"Couldn't reach {0}. Try again in a moment.",
"{0}に接続できませんでした。少し待ってからもう一度お試しください。"
],
[
"Ask {0}, the bowling genie",
"ボウリングの魔人、{0}に質問"
],
[
"You've used all {0} today. {1} is back tomorrow.",
"本日の質問{0}回分をすべて使いました。{1}は明日また戻ってきます。"
],
[
"The Stats screens cover the usual numbers. {0} is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.",
"一般的な数字は「成績」画面で確認できます。{0}は、そこでは分からない疑問に答えます — 自分のボウリングについて質問すると、記録したデータから答えを導き出します。まだ記録していないデータが必要な場合は、何を記録し始めればよいか教えてくれます。"
],
[
"You're on {0} in this league. Making {1} puts you on its roster and takes you off {2}'s. Your scores stay yours.",
"このリーグでは現在{0}に所属しています。{1}を作成するとそのチームのメンバーになり、{2}のメンバーから外れます。スコアはご自身の記録としてそのまま残ります。"
],
[
"Couldn't find \"{0}\" in the cloud — this team was created on this device only and won't be visible to teammates. Try again once you're back online.",
"クラウド上で「{0}」が見つかりませんでした — このチームはこの端末でのみ作成されたため、チームメイトには表示されません。オンラインに戻ってから、もう一度お試しください。"
],
[
"\"{0}\" was created locally but couldn't reach the cloud yet ({1}). It'll keep retrying in the background.",
"「{0}」はこの端末に作成されましたが、まだクラウドに送信できていません（{1}）。バックグラウンドで再試行を続けます。"
],
[
"Combine your \"{0}\" with the shared one{1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"「{0}」を共有リーグ{1}と統合しますか？ゲーム、チーム、リーグ設定が共有リーグに移り、すでに登録されているチームも表示されるようになります。この操作は元に戻せません。"
],
[
"\"{0}\" was saved on this device only and hasn't reached the cloud yet — it won't be visible to teammates or usable for creating a team until it syncs. It'll keep retrying in the background if you're offline; check back if this persists.",
"「{0}」はこの端末にのみ保存され、まだクラウドに届いていません — 同期が完了するまで、チームメイトには表示されず、チームの作成にも使えません。オフラインの場合はバックグラウンドで再試行を続けます。この状態が続く場合は、あとで確認してください。"
],
[
"You already have a league called \"{0}\". Pick a different name.",
"「{0}」という名前のリーグがすでにあります。別の名前を選んでください。"
],
[
"\"{0}\" was renamed on this device only and hasn't reached the cloud yet. It'll keep retrying in the background if you're offline; check back if this persists.",
"「{0}」の名前変更はこの端末にのみ反映され、まだクラウドに届いていません。オフラインの場合はバックグラウンドで再試行を続けます。この状態が続く場合は、あとで確認してください。"
],
[
"You're not on {0} as {1}, so there's nothing to leave.",
"{1}として{0}に所属していないため、退出の必要はありません。"
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
"このリーグでは現在{0}に所属しています。{1}に参加すると、{2}のメンバーから外れます。スコアはご自身の記録としてそのまま残ります。"
],
[
"You're on {0}.",
"{0}に参加しました。"
],
[
"{0} {1} on {2} now.",
"{0}は{2}のメンバーになりました。"
],
[
"You're on {0} in this league. If {1} approve{2:s} you, you'll be taken off {3}'s roster. Your scores stay yours.",
"このリーグでは現在{0}に所属しています。{1}に承認されると、{3}のメンバーから外れます。スコアはご自身の記録としてそのまま残ります。"
],
[
"This replaces your request to join {0}.",
"{0}への参加リクエストは、これに置き換えられます。"
],
[
"You've joined {0}. It'll show under Social.",
"{0}に参加しました。「フレンド」に表示されます。"
],
[
"This tournament is {0}’s. Switch bowler to save it.",
"この大会は{0}の記録です。保存するにはボウラーを切り替えてください。"
],
[
"profile|{0}",
""
],
[
"These leagues were restored on this device only and haven't reached the cloud yet: {0}. They'll keep retrying in the background if you're offline.",
"次のリーグはこの端末にのみ復元され、まだクラウドに届いていません：{0}。オフラインの場合はバックグラウンドで再試行を続けます。"
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
"· {0}投目"
],
[
"{0} changes backing up",
"{0}件の変更をバックアップ中"
],
[
"Inbox, {0} waiting",
"受信トレイ、{0}件あります"
],
[
"✓ {0} {1} saved on this phone. Nothing is lost.",
"✓ {0}件の変更はこのスマホに保存されています。何も失われていません。"
],
[
"mbj-app-content mbj-view-{0}",
""
],
[
"🧑‍🏫 Coach{0}",
"🧑‍🏫 コーチ{0}"
],
[
"Invitation to join {0}",
"{0}への招待"
],
[
"{0} wants to join {1}",
"{0}が{1}への参加を希望しています"
],
[
"Joining takes you off {0}.",
"参加すると{0}から外れます。"
],
[
"Approving moves them off {0}.",
"承認すると、このボウラーは{0}から外れます。"
],
[
"📥 {0} waiting for you",
"📥 {0}件の確認待ち"
],
[
"{0} total · {1} average · {2} high{3}{4}",
"合計{0} · アベレージ{1} · ハイゲーム{2}{3}{4}"
],
[
"({0} scratch + {1} hcp)",
"（スクラッチ{0} + ハンデ{1}）"
],
[
"{0}{1} vs the cut",
"{0}カットライン比{1}"
],
[
"{0}-{1}{2}{3}{4} match{5:s}{6}{7}{8} with bonus",
"{4}試合で{0}-{1}{2}{6}{7}ボーナス込み{8}"
],
[
"· {0} average",
"· アベレージ{0}"
],
[
"{0}{1} of {2} step{3:s} won{4}",
"{0}{2}戦{1}勝{4}"
],
[
"{0} seed ·",
"{0}シード ·"
],
[
"· finished {0}",
"· 最終{0}"
],
[
"{0} night{1:s} · {2} games · {3} average · {4} high",
"{0}日 · {2}ゲーム · アベレージ{3} · ハイゲーム{4}"
],
[
"1.5px solid {0}",
""
],
[
"Open results for {0}",
"{0}の結果を開く"
],
[
"{0} series · {1} average · {2} high",
"シリーズ{0} · アベレージ{1} · ハイゲーム{2}"
],
[
"{0}% strikes{1}{2}",
"ストライク{0}%{1}{2}"
],
[
"· {0}% spares",
"· スペア{0}%"
],
[
"· {0} split{1:s}",
"· スプリット{0}回"
],
[
"Delete this night? {0} game{1:s} and every frame logged with them. This cannot be undone.",
"この日の記録を削除しますか？{0}ゲームと、そこに記録したすべてのフレームが削除されます。元に戻すことはできません。"
],
[
"Everyone you've bowled with, by average. {0}",
"一緒に投げた全員をアベレージ順に表示しています。{0}"
],
[
"{0} game{1:s}",
"{0}ゲーム"
],
[
"{0} night{1:s}",
"{0}日"
],
[
"{0} win{1:s}",
"{0}勝"
],
[
"Send {0} their badges",
"{0}にバッジを送る"
],
[
"Free fall on {0}.",
"{0}番レーンがフリーフォール式です。"
],
[
"Where does {0} bowl? Set once per season — it lets you compare how you score house to house.",
"{0}はどのボウリング場で投げていますか？シーズンに1回設定します — ボウリング場ごとのスコアを比較できます。"
],
[
"{0} mi",
"{0}マイル"
],
[
"Target: {0}{1} {2}{3}",
"目標：{2}{0}{1}{3}"
],
[
"reached {0}{1}",
"実績{0}{1}"
],
[
"Due {0}",
"期限：{0}"
],
[
"(+{0} more)",
"（ほか{0}件）"
],
[
"Target {0}{1} — no result logged yet.",
"目標{0}{1} — まだ結果が記録されていません。"
],
[
"Bowls {0} on {1}",
"{1}に{0}で投球予定"
],
[
"{0} — asked to be your {1}",
"{0} — {1}として申請中"
],
[
"They enter it on their own phone and you{0}re connected — no searching for each other by name.",
"相手のスマホで入力すれば連携完了 — 名前で探し合う必要はありません。"
],
[
"Connected. They{0}re in the list above.",
"連携しました。上のリストに表示されています。"
],
[
"Goal for {0}",
"{0}の目標"
],
[
"Next session with {0}",
"{0}との次回レッスン"
],
[
"{0}'s Game",
"{0}の成績"
],
[
"From {0} shots",
"{0}投の集計"
],
[
"Misses: {0}",
"ミス：{0}"
],
[
"Tasks — {0}",
"課題 — {0}"
],
[
"{0}. An 800 series is an 800 series.",
"{0}。800シリーズは、800シリーズです。"
],
[
"{0}, beating your {1} by {2}.",
"{0}。これまでの{1}を{2}ピン上回りました。"
],
[
"your {0} drill",
"{0}のドリル練習"
],
[
"Mentions {0}, which you haven't logged enough of yet — treat that part as a guess.",
"{0}に触れていますが、まだ十分な記録がありません — この部分は推測として受け止めてください。"
],
[
"{0} added. {1} you already had.",
"{0}分を追加しました。{1}分はすでに記録済みです。"
],
[
"You already had {0}.",
"{0}すでに記録済みです。"
],
[
"all {0} of those nights",
"その{0}日分はすべて"
],
[
"Manufacturer specifications. Source: {0}",
"メーカー公表スペック。出典：{0}"
],
[
"Verified by {0} bowlers. Locked from edits.",
"{0}人のボウラーが検証済み。編集はロックされています。"
],
[
"Entered by another bowler and confirmed by {0}. Not manufacturer data.",
"他のボウラーが入力し、{0}人が確認済みです。メーカーのデータではありません。"
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
"Int {0}"
],
[
"Earned in {0} only",
"{0}でのみ獲得可能"
],
[
"Earned in {0} or {1}",
"{0}または{1}で獲得可能"
],
[
"date must look like 2026-09-17, got \"{0}\"",
"日付は2026-09-17の形式で入力してください（「{0}」になっています）"
],
[
"no such date: {0}",
"存在しない日付です：{0}"
],
[
"date looks wrong: {0}",
"日付が正しくないようです：{0}"
],
[
"date is in the future: {0}",
"未来の日付です：{0}"
],
[
"{0} must be a whole number, got \"{1}\"",
"{0}は整数で入力してください（「{1}」になっています）"
],
[
"The header row needs these columns: {0}.",
"ヘッダー行に次の列が必要です：{0}。"
],
[
"That file has {0} rows. The limit is {1}.",
"このファイルは{0}行あります。上限は{1}行です。"
],
[
"{0} appears twice in this file",
"{0}はこのファイル内で重複しています"
],
[
"{0} — diagnostics",
""
],
[
"Ask {0} something. She's got your whole history in here.",
"{0}に何か聞いてみてください。これまでの記録をすべて把握しています。"
],
[
"That's a lot. Try asking {0} one thing.",
"盛りだくさんですね。{0}には1つずつ質問してみてください。"
],
[
"{0} only knows bowling. That one's free — ask her something else.",
"{0}はボウリングのことしかわかりません。今の質問はカウントしないので、別のことを聞いてみてください。"
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
"1ゲームあたりあと{0}ピンで目標達成です。"
],
[
"Beat your best by {0} pin{1:s}.",
"ハイゲームを{0}ピン上回りましょう。"
],
[
"Beat your best series by {0} pin{1:s}.",
"ハイシリーズを{0}ピン上回りましょう。"
],
[
"Keep {0} of your next {1} {2} clean",
"今後の{1}{2}のうち{0}フレームをクリーンに"
],
[
"{0}{1} {2} of your next {3} {4}",
"今後の{4}{3}回のうち{2}回成功"
],
[
"{0} — {1} more than you are now.",
"{0} — 今より{1}回多い目標です。"
],
[
"Corrected by {0}.",
"{0}が修正しました。"
],
[
"Game {0}: you logged {1}, the photo reads {2}. Yours is kept unless you change it.",
"{0}ゲーム目：記録したスコアは{1}、写真の読み取りは{2}です。変更しない限り、記録したスコアがそのまま使われます。"
],
[
"game {0} ({1} vs {2})",
"{0}ゲーム目（記録{1}・写真{2}）"
],
[
"These disagree with what you logged — {0}. Yours are kept unless you change them.",
"記録した内容と一致しないスコアがあります — {0}。変更しない限り、記録したスコアがそのまま使われます。"
],
[
"{0} nights of scores to check",
"確認待ちのスコア（{0}日分）"
],
[
"{0} nights need re-entering",
"{0}日分の再入力が必要です"
],
[
"{0} teammate score{1:s} unconfirmed",
"チームメイトの未確認スコア{0}件"
],
[
"{0} wants to be your {1}",
"{0}が{1}としてつながりを希望しています"
],
[
"{0} task{1:s} from your coach",
"コーチからの課題{0}件"
],
[
"{0} task update{1:s} from your bowlers",
"指導中のボウラーからの課題の更新{0}件"
],
[
"{0} sent a friend request",
"{0}からフレンド申請が届きました"
],
[
"{0}Accept or decline on the Team tab.",
"{0}「チーム」タブで承認または拒否してください。"
],
[
"{0} has finished its season.",
"{0}のシーズンが終了しました。"
],
[
"Your specs for {0} were rejected",
"{0}のスペックが却下されました"
],
[
"Game {0}, frame {1}",
"{0}ゲーム目・{1}フレーム"
],
[
"{0} pin{1:s} away",
"あと{0}ピン"
],
[
"Best {0}",
"ベスト{0}"
],
[
"Milestones up to a {0} average",
"アベレージ{0}までのマイルストーン"
],
[
"{0} pin{1:s} short · best {2}",
"あと{0}ピン · ベスト{2}"
],
[
"{0}, and {1}",
"{0}、{1}"
],
[
"You usually bowl {0}. The app sets itself up for you on those days instead of asking.",
"普段は{0}に投球しています。その曜日は、アプリが確認せずに自動で準備します。"
],
[
"Min {0}{1}",
"最小{0}{1}"
],
[
"Max {0}{1}",
"最大{0}{1}"
],
[
"Leave {0}?",
"{0}を抜けますか？"
],
[
"You'll no longer be part of {0}.",
"{0}のメンバーではなくなります。"
],
[
"You'll still be on {0} in {1}.",
"{1}では引き続き{0}に所属します。"
],
[
"Your teammates ({0}) will see you've left.",
"チームメイト（{0}）には、チームを抜けたことが表示されます。"
],
[
"Won every match, by {0} pins on average.",
"全試合に勝利しました（平均{0}ピン差）。"
],
[
"Lost every match, but all of them by under {0} pins.",
"全試合で敗れましたが、どれも{0}ピン未満の差でした。"
],
[
"Lost every match, by {0} pins on average.",
"全試合で敗れました（平均{0}ピン差）。"
],
[
"won by {0} on average",
"勝った試合は平均{0}ピン差"
],
[
"lost by {0}",
"負けた試合は平均{0}ピン差"
],
[
"{0} of {1} came down to under {2} pins.",
"{1}試合中{0}試合は{2}ピン未満の差で決着しました。"
],
[
"Official {0} PBA specs.",
"{0}年のPBA公式スペック。"
],
[
"Not on the {0} sheet — check patternlibrary.kegel.net if you bowled it.",
"{0}年のシートに掲載されていません — 投げたことがある場合は patternlibrary.kegel.net で確認してください。"
],
[
"{0} · {1} · specs not entered yet",
"{0} · {1}年 · スペック未入力"
],
[
"fewer than {0} games in {1}",
"{1}で{0}ゲーム未満"
],
[
"{0} average across {1} games",
"{0}の{1}ゲームのアベレージ"
],
[
"no league reached {0} games, and the combined total didn't either",
"{0}ゲームに達したリーグがなく、合計でも達していません"
],
[
"{0} average across {1} games (your strongest league)",
"{0}の{1}ゲームのアベレージ（最も成績の良いリーグ）"
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
"DESCRIPTION:{0}まであと{1}分"
],
[
"Retired {0}",
"{0}に引退"
],
[
"{0} · nothing logged with it",
"{0} · このボールでの記録なし"
],
[
"{0} · {1}, too few to compare",
"{0} · {1}、比較するには少なすぎます"
],
[
"{0} · {1} · {2}% strikes",
"{0} · {1} · ストライク率{2}%"
],
[
"{0} couldn't be read and were left out. A clearer photo would get more — what's below is still safe to save.",
"{0}を読み取れなかったため、除外しました。より鮮明な写真ならもっと読み取れます — 下の内容はそのまま保存しても問題ありません。"
],
[
"The series says {0} but the {1} games add up to {2} — {3}. Check before saving.",
"シリーズは{0}ですが、{1}ゲームの合計は{2}です — {3}。保存する前に確認してください。"
],
[
"The card says {0} but the frames add up to {1} — {2}. Check before saving.",
"スコアシートの合計は{0}ですが、フレームを合計すると{1}です — {2}。保存する前に確認してください。"
],
[
"board must be {0} to {1}",
"ボードは{0}〜{1}で入力してください"
],
[
"{0} night{1:s} · {2} game{3:s}",
"{0}日 · {2}ゲーム"
],
[
"Average {0}",
"アベレージ{0}"
],
[
"High game {0}{1}",
"ハイゲーム{0} {1}"
],
[
"· High series {0}",
"· ハイシリーズ{0}"
],
[
"{0} game{1:s} over 200",
"200アップ：{0}ゲーム"
],
[
"{0}% strikes · {1}% spares",
"ストライク率{0}% · スペア率{1}%"
],
[
"{0}${1} on the season",
"シーズン収支{0}${1}"
],
[
"{0} – now",
"{0} – 現在"
],
[
"{0} games against {1}",
"{0}ゲーム対{1}ゲーム"
],
[
"Your average is the same as last season — {0}.",
"アベレージは前シーズンと同じです — {0}。"
],
[
"Your average is {0} {1} {2} on last season — {3}.",
"アベレージは前シーズン比{0}{1}ピンです — {3}。"
],
[
"{0} One of those seasons is short, so treat it lightly.",
"{0}どちらかのシーズンはゲーム数が少ないため、参考程度に見てください。"
],
[
"Tied at {0} — nobody's settling this tonight.",
"{0}で同点 — 今日は決着がつきませんでした。"
],
[
"{0}, by just {1}. That was close.",
"{0}、わずか{1}ピン差。接戦でした。"
],
[
"{0}, won by {1}.",
"{0}、{1}ピン差で勝利。"
],
[
"Jumped {0} pins between games.",
"ゲーム間で{0}ピン伸ばしました。"
],
[
"Dropped {0} pins between games.",
"ゲーム間で{0}ピン落としました。"
],
[
"Every game within {0} pins.",
"全ゲームが{0}ピン差以内に収まりました。"
],
[
"{0} average over {1} game{2:s}",
"{1}ゲームでアベレージ{0}"
],
[
"{0} — {1} above your average.",
"{0} — 普段のアベレージを{1}ピン上回りました。"
],
[
"{0} — {1} below your average.",
"{0} — 普段のアベレージを{1}ピン下回りました。"
],
[
"{0} — right on your average.",
"{0} — 普段のアベレージとぴったり同じです。"
],
[
"{0} of {1} across {2} drill{3:s}",
"{2}種類のドリル練習で{0}/{1}"
],
[
"{0} {1} for {2}{3}{4}: {5}.",
"{0}{3}{4}：{2}ゲームで{1}（{5}）。"
],
[
"Badge{0:s} earned: {1}",
"獲得したバッジ：{1}"
],
[
"Tracked with {0} — {1}",
"{0}で記録 — {1}"
],
[
"{0}-game series",
"{0}ゲームのシリーズ"
],
[
"{0}+{1} more",
"{0}ほか{1}個"
],
[
"+{0} more",
"ほか{0}個"
],
[
"Won ${0} in side pots",
"サイドポットで${0}獲得"
],
[
"Hit my goal: {0}",
"目標達成：{0}"
],
[
"New personal best series — beat {0}",
"シリーズの自己ベスト更新 — これまでの{0}を超えました"
],
[
"New personal best game — beat {0}",
"ゲームの自己ベスト更新 — これまでの{0}を超えました"
],
[
"{0} clean game{1:s}",
"ノーミスゲーム{0}回"
],
[
"{0} pins over my average",
"アベレージを{0}ピン上回る"
],
[
"{0} Tracked with {1} — {2}",
"{0} {1}で記録 — {2}"
],
[
"{0} games — averaging {1}, high {2}, low {3}.",
"{0}ゲーム — アベレージ{1}、ハイゲーム{2}、ローゲーム{3}。"
],
[
"{0} has earned {1}{2} badge{3:s}",
"{0}：バッジを{1}{2}個獲得"
],
[
"{0} earned a badge tonight",
"{0}：今日バッジを獲得しました"
],
[
"{0} earned {1} badges tonight",
"{0}：今日バッジを{1}個獲得しました"
],
[
"Keep them: {0}",
"バッジを残すならこちら：{0}"
],
[
"Standings Tracked with {0} — {1}",
"順位表 {0}で記録 — {1}"
],
[
"{0}. {1}{2} — {3} avg, {4} games",
"{0}. {1}{2} — アベレージ{3}、{4}ゲーム"
],
[
"Qualifying: {0} across {1} game{2:s}",
"予選：{1}ゲームで{0}"
],
[
"Made the cut by {0}",
"{0}ピン差で予選通過"
],
[
"Missed the cut by {0}",
"{0}ピン差で予選落ち"
],
[
", {0} with bonus",
"、ボーナス込み{0}"
],
[
"Match play: {0}{1}",
"マッチプレー：{0}{1}"
],
[
"from the {0} seed",
"（{0}シードから）"
],
[
"Won the stepladder{0}",
"ステップラダー優勝{0}"
],
[
"Stepladder: {0}{1}",
"ステップラダー：{0}{1}"
],
[
"Stepladder: {0} of {1} steps won{2}",
"ステップラダー：{1}ステップ中{0}勝{2}"
],
[
"Up ${0} on the day",
"この日の収支：プラス${0}"
],
[
"Down ${0} on the day",
"この日の収支：マイナス${0}"
],
[
"{0} game{1:s} · {2} average",
"{0}ゲーム · アベレージ{2}"
],
[
"{0} {1} if you {2}",
"{2}と、成績{0}項目のロックが解除されます"
],
[
"{0}. Either on its own is fine.",
"{0}。どちらか一方だけでも大丈夫です。"
],
[
"Won the stepladder{0}.",
"ステップラダー優勝 {0}。"
],
[
"— {0} straight",
"— {0}連勝"
],
[
"to the {0} seed",
"{0}シードに敗れ、"
],
[
"Finished {0}{1}.",
"{1}{0}でフィニッシュ。"
],
[
"you and {0}",
"自分と{0}"
],
[
"Baker: {0} bowled this together, so the score stays out of your average.",
"ベーカー方式：{0}で一緒に投げたゲームなので、このスコアはアベレージに含まれません。"
],
[
"{0} more night{1:s} needed before a direction means anything.",
"傾向を判断するには、あと{0}日分のデータが必要です。"
],
[
"Trending {0} about {1}{2} across this stretch.",
"この期間で約{1}{2}の{0}傾向です。"
],
[
"Last {0} — showing {1} of {2} {3}",
"直近{0}件 — {2}{3}中{1}{3}を表示"
],
[
"Last {0} days — showing {1} of {2} {3}",
"直近{0}日 — {2}{3}中{1}{3}を表示"
],
[
"{0} to {1} — showing {2} of {3} {4}",
"{0}〜{1} — {3}{4}中{2}{4}を表示"
],
[
"{0} of {1} {2}{3}",
""
],
[
"{0}· last time {1}%",
"{0}· 前回{1}%"
],
[
"Save Drill ({0} attempts)",
"ドリル練習を保存（{0}回）"
],
[
"Remove {0} as a friend?",
"{0}をフレンドから削除しますか？"
],
[
"Not enough data yet — {0} more {1} before this is worth reporting.",
"まだデータが足りません — 意味のある結果を出すには、{1}があと{0}回分必要です。"
],
[
"{0} to go",
"あと{0}"
],
[
"{0} targets run from {1} to {2}.",
"{0}の目標は{1}〜{2}の範囲です。"
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
"「{0}」に一致する項目はありません。アプリ内で使われている言葉で検索してみてください — 「スペア」「チーム」「ボール」「取り込み」。"
],
[
"{0} games logged",
"{0}ゲーム記録"
],
[
"· {0} seasons",
"· {0}シーズン"
],
[
"{0} badges earned",
"バッジ{0}個獲得"
],
[
"{0} · {1} milestone{2:s} so far",
"{0} · これまでに{1}件のマイルストーン"
],
[
"Next · {0}",
"次の目標 · {0}"
],
[
"Imported {0} night{1:s}.",
"{0}日分を取り込みました。"
],
[
"That didn't save: {0}",
"保存できませんでした：{0}"
],
[
"A CSV with four columns: {0}. Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.",
"4列のCSVファイル：{0}。日付は2026-09-17の形式、スコアは0〜300の整数で、1日分は1〜3ゲームです。"
],
[
"{0} row{1:s} skipped",
"{0}行をスキップ"
],
[
"Row {0}",
"{0}行目"
],
[
"and {0} more",
"ほか{0}件"
],
[
"{0} night{1:s} you already have",
"{0}日分はすでに記録済み"
],
[
", and {0} more",
"、ほか{0}件"
],
[
"Keep mine, import the other {0}",
"手元の記録を残し、残り{0}日分を取り込む"
],
[
"Import {0} night{1:s}",
"{0}日分を取り込む"
],
[
"Frame-by-frame data included for {0}{1}{2} — confirming adds it to your shot history.",
"フレームごとのデータあり：{0}ゲーム — 確認すると投球履歴に追加されます。"
],
[
"Join {0}?",
"{0}に参加しますか？"
],
[
"You were added to the roster as {0}{1}. Teammates will be able to import your scores from a scorecard photo — you still confirm them.",
"チームのメンバー表に{0}{1}として追加されました。チームメイトがスコアシートの写真からスコアを取り込めるようになります — 確認は引き続きご自身で行います。"
],
[
", position {0}",
"（投球順{0}番）"
],
[
"Team {0}",
"チーム{0}"
],
[
"{0} night{1:s} imported by a teammate.",
"{0}日分のスコアをチームメイトが取り込みました。"
],
[
"{0}-{1} open",
"{0}-{1} オープン"
],
[
"Spare: {0}",
"スペア：{0}"
],
[
"Game {0}{1}",
"{0}ゲーム目{1}"
],
[
"⚠️ {0} fill ball{1:s} below couldn't be reliably read from the image -- please double-check the pin count.",
"⚠️ 下のフィルボール{0}投は画像から確実に読み取れませんでした -- ピン数を確認してください。"
],
[
"Frame {0}{1}{2}",
"{0}フレーム目{1}{2}"
],
[
"These images come to about {0}MB, which is too much to send at once. Remove one and try again — images are sent at full quality, so fewer is better than smaller.",
"画像の合計が約{0}MBあり、一度に送るには大きすぎます。1枚減らしてもう一度お試しください — 画像は元の画質のまま送られるため、小さくするより枚数を減らすほうが効果的です。"
],
[
"retried on {0}",
""
],
[
"(Already retried {0} time{1:s}.)",
"（すでに{0}回再試行しました。）"
],
[
"Your images are still selected, so just tap {0} again in a minute.{1}",
"画像は選択されたままなので、1分ほどしてからもう一度「{0}」をタップしてください。{1}"
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
"{1}の{0}ゲーム目には、すでに投球データがあります。"
],
[
"{0} game score{1:s}",
"{0}ゲーム分のスコア"
],
[
"Sent {0} their scores to confirm.",
"{0}に確認用のスコアを送りました。"
],
[
"Imported {0}{1} -- check the Results, then save the night.",
"{0}を取り込みました{1} -- 「結果」を確認してから、その日の記録を保存してください。"
],
[
"Scorecard Screenshot{0:s}",
"スコアシートのスクリーンショット"
],
[
"Scorecard {0}",
"スコアシート{0}"
],
[
"Remove scorecard {0}",
"スコアシート{0}を削除"
],
[
"Clear all {0} image{1:s}",
"すべて消去（{0}枚）"
],
[
"{0} images ({1}MB, full quality) — reading these can take a few minutes.",
"{0}枚の画像（{1}MB、フル画質）— 読み取りに数分かかることがあります。"
],
[
"Reading a scorecard can take a minute or two. ({0}MB, full quality.)",
"スコアシートの読み取りには1〜2分かかることがあります。（{0}MB、フル画質）"
],
[
"Working through {0} images. This can take a few minutes — every frame is read individually.",
"{0}枚の画像を処理中です。数分かかることがあります — フレームを1つずつ読み取っています。"
],
[
"{0} bowler{1:s} read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.",
"スコアシートから{0}人分を読み取りました。保存する前に一人ずつ確認してください — 照合を誤ると、ある人のゲームが別の人の記録に書き込まれてしまいます。"
],
[
"Column {0}",
"{0}列目"
],
[
"{0} game{1:s} · {2}{3}{4}",
"{0}ゲーム · {2}{3}{4}"
],
[
"Games add to {0} but the card's scratch series is {1}. One of the games was misread — check the card.",
"ゲームの合計は{0}ですが、スコアシートのスクラッチシリーズは{1}です。いずれかのゲームが誤読されています — スコアシートを確認してください。"
],
[
"Add \"{0}\" as a new bowler",
"「{0}」を新しいボウラーとして追加"
],
[
"Closest match: {0}",
"最も近い候補：{0}"
],
[
"Matched on the alias \"{0}\".",
"別名「{0}」で照合しました。"
],
[
"Card order: {0}",
"スコアシートの順番：{0}"
],
[
"check the {0} below, correct anything that's wrong, then save.",
"下の{0}を確認し、間違いがあれば修正してから保存してください。"
],
[
"{0} game scores",
"{0}ゲーム分のスコア"
],
[
"These go to {0} to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.",
"これらのスコアは確認のため{0}に送られます。スコアはすぐに成績に反映されます — 確認しても確認済みの印が付くだけです。送信する前に、読み取りミスを修正してください。"
],
[
"read as \"{0}\"",
"読み取り名：「{0}」"
],
[
"Game{0:s} {1} couldn't be read — type the real score, or clear the box if they didn't bowl it.",
"ゲーム{1}を読み取れませんでした — 実際のスコアを入力するか、投げていないゲームなら欄を空にしてください。"
],
[
"Series {0}{1}",
"シリーズ{0}{1}"
],
[
"· card printed {0}",
"· スコアシートの印字：{0}"
],
[
"Save & Send To {0} Teammate{1:s}",
"保存してチームメイト{0}人に送信"
],
[
"{0} games. Only statistics with enough data to be meaningful are analysed.",
"{0}ゲーム。意味のある結果を出せるだけのデータがある統計だけを分析しています。"
],
[
"{0} of {1} · ~{2} more {3}",
"{0}/{1} · あと約{2}ゲーム"
],
[
"You're close on {0} — a couple more nights and it unlocks.",
"{0}はもう少しです — あと2〜3日分記録すれば解放されます。"
],
[
"{0} more {1} to go.",
"あと{0}ゲームです。"
],
[
"Insights need at least {0} games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.",
"分析には最低{0}ゲームが必要です。それより少ないと、数字が日によって大きくぶれるため、信頼できることは何も言えません — 自信ありげに見えても、実際はただのノイズにすぎない傾向が出てしまいます。"
],
[
"You have {0} games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.",
"現在{0}ゲームを記録しています。まだ正直に分析できるだけのデータがそろった項目はありません — 最も近いものはこちらです。"
],
[
"{0} more {1}",
"あと{0}（{1}）"
],
[
"Based on {0} games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.",
"これまでの{0}ゲームにもとづく分析です。記録するほど精度が上がります — 数日分ならヒント程度、1シーズン分あれば行動に移せる材料になります。"
],
[
"You're working with {0} — worth talking this through with them before changing anything. They can see what these numbers can't.",
"{0}の指導を受けています — 何かを変える前に、一度相談してみましょう。この数字では見えないものが見えているはずです。"
],
[
"· {0} of {1}",
"· {1}件中{0}件"
],
[
"Nothing matches “{0}”{1}.",
"{1}「{0}」に一致するものはありません。"
],
[
"On the road since {0}",
"{0}からのあゆみ"
],
[
"{0} Badges",
"{0} バッジ"
],
[
"The free plan follows this league.{0} Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.",
"無料プランではこのリーグを利用できます。{0}リーグの切り替えや複数リーグでの投球はProの機能です — 登録すれば、これまでに記録したものはすべて戻ってきます。"
],
[
"Paused: {0}.",
"一時停止中：{0}。"
],
[
"Paused: {0}. Practice and Just Bowling stay open either way.",
"一時停止中：{0}。練習とフリー投球はどちらの場合も利用できます。"
],
[
"Saved. {0} is your active league.",
"保存しました。{0}が利用中のリーグです。"
],
[
"{0} · {1} games",
"{0} · {1}ゲーム"
],
[
"vs your {0} overall{1}{2} game{3:s}",
"全体アベレージ{0}との差{1}{2}ゲーム"
],
[
"{0} {1} more",
"{0} 他{1}件"
],
[
"Lane diagram, {0} of {1} balls shown",
"レーン図、ボール{1}個中{0}個を表示"
],
[
"breakpoint {0}′",
"ブレイク{0}′"
],
[
"{0} shots around {1}",
"{1}付近の{0}投"
],
[
", across {0} nights",
"（{0}日分）"
],
[
"{0} made of {1}",
"{1}回中{0}回成功"
],
[
"{0} missed of {1}",
"{1}回中{0}回ミス"
],
[
"Show all {0}",
"すべて表示（{0}件）"
],
[
"{0} of 4 points",
"{0}/4ポイント"
],
[
"{0} — tonight",
"{0} — 今日の成績"
],
[
"{0}'s night",
"{0}の今日の成績"
],
[
"G{0} Theory",
"G{0}理論値"
],
[
"▼ {0} pins left on the lane",
"▼ {0}本のピンを取り残し"
],
[
"({0} actual vs {1} possible)",
"（実際{0} / 理論値{1}）"
],
[
"Tap the ones you're in. Buy-ins are saved for {0} — you won't need to enter them again.",
"参加するものをタップしてください。参加費は{0}用に保存されます — 次回から入力する必要はありません。"
],
[
"{0} game{1:s} tonight · ${2} paid in",
"今日{0}ゲーム · 参加費${2}"
],
[
"All nine struck — you took it{0}.",
"対象の9フレームすべてでストライク — ポットを獲得{0}しました。"
],
[
"${0} paid in — {1} ${2} on the night.",
"参加費${0} — 今日の収支は{1}${2}。"
],
[
"Counts for {0}. Bowled today — change the date above if that's the wrong week.",
"{0}の分として記録されます。実際の投球日は今日です — 週が違う場合は上の日付を変更してください。"
],
[
"Lanes {0} & {1}",
"{0}・{1}番レーン"
],
[
"Lane {0}",
"{0}番レーン"
],
[
"Pattern name (e.g. {0})",
"パターン名（例：{0}）"
],
[
"Game {0} score",
"{0}ゲーム目のスコア"
],
[
"{0} frames say {1}",
"{0} フレーム計算では{1}"
],
[
"Frames say {0} — tap to use them",
"フレーム計算では{0} — タップしてこちらを使用"
],
[
"Delete game {0}",
"{0}ゲーム目を削除"
],
[
"Game {0} surface",
"{0}ゲーム目のボール表面"
],
[
"Delete game {0}? This removes the score{1}. It can't be undone.",
"{0}ゲーム目を削除しますか？スコア{1}が削除されます。元に戻せません。"
],
[
"Shot Context{0}",
"投球状況{0}"
],
[
"10th Frame{0}",
"10フレーム{0}"
],
[
"Ball {0}",
"{0}投目"
],
[
"frame {0}{1} of game {2}",
"{2}ゲーム目の{0}フレーム{1}"
],
[
", ball {0}",
"、{0}投目"
],
[
"Delete {0}? This cannot be undone.",
"{0}を削除しますか？元に戻せません。"
],
[
"Clearing the result deletes {0}. Delete it?",
"結果を消すと{0}が削除されます。削除しますか？"
],
[
"Leave: {0}{1}",
"残りピン：{0}{1}"
],
[
"· First ball: {0}",
"· 1投目：{0}"
],
[
"Delete game {0} for everyone?{1}",
"全員の{0}ゲーム目を削除しますか？{1}"
],
[
"{0}, game {1}",
"{0}、{1}ゲーム目"
],
[
"Switched from {0} to {1} — why?",
"{0}から{1}に持ち替えました — 理由は？"
],
[
"Line{0}",
"ライン{0}"
],
[
"· Lane {0}",
"· {0}番レーン"
],
[
"{0} board{1:s} {2} of target",
"ターゲットから{2}に{0}ボードずれ"
],
[
"{0} of {1} first balls struck{2}{3}{4}",
"1投目{1}回中{0}回ストライク{2}{3}{4}"
],
[
", {0} of {1} spares made",
"、スペア{1}回中{0}回成功"
],
[
", {0} split{1:s}",
"、スプリット{0}回"
],
[
"Best carry tonight: {0} {1} {2}%{3}over {4} first balls",
"今日のベストキャリー：{0} {1} {2}%{3}（1投目{4}回）"
],
[
"✓ {0} Saved",
"✓ {0}を保存しました"
],
[
"Save & Finish {0}",
"保存して{0}を終了"
],
[
"End {0} & View Results",
"{0}を終了して結果を見る"
],
[
"nightcap:{0}|{1}|{2}|{3}",
""
],
[
"There are {0} things worth saying about tonight.",
"今日について伝えたいことが{0}つあります。"
],
[
"{0} things were true about tonight. Here are the two or three worth hearing.",
"今日のデータから{0}件の事実が見つかりました。そのうち聞いておきたい2〜3件をお伝えします。"
],
[
"{0} first balls across {1} game{2:s}{3}",
"{0}回の1投目・全{1}ゲーム{3}"
],
[
", against {0} earlier nights in this league.",
"、このリーグの過去{0}日分と比較。"
],
[
"Your current book average is {0}.",
"現在の公認アベレージは{0}です。"
],
[
"Update to {0}",
"{0}に更新"
],
[
"{0}-handed{1} · {2}",
"{0}投げ{1} · {2}"
],
[
"A backup ball goes out to the {0} and hooks back, so your corner pin is the {1} and your pocket is the {2}. Turning this on flips every leave, split and lane drawing to match — you are still{3}-handed everywhere it says so.",
"バックアップボールは{0}へ出てから戻るように曲がるため、コーナーピンは{1}番ピン、ポケットは{2}になります。オンにすると、残りピン・スプリット・レーンの図がすべてそれに合わせて反転します — 利き手の表示はどこでも{3}投げのままです。"
],
[
"Normal {0}-hand hook",
"{0}投げの通常フック"
],
[
"{0} season wrapped up",
"{0}のシーズン終了"
],
[
"Not enough games logged here yet to suggest a new number{0}. You can still update it yourself below, or skip for now.",
"新しい数値を提案できるほど、ここではまだゲームが記録されていません{0}。下で自分で更新するか、今回はスキップできます。"
],
[
"{0}Free fall · {1} game{2:s}",
"{0}フリーフォール · {1}ゲーム"
],
[
"{0}String · {1} game{2:s}",
"{0}ストリング · {1}ゲーム"
],
[
"{0}{1}{2} on string",
"ストリングで{0}{1}{2}"
],
[
"{0}-pins left",
"{0}番ピン残り"
],
[
"{0}: how often each pin was left standing",
"{0}：各ピンが残った頻度"
],
[
"{0}-pin left {1}% of first balls",
"{0}番ピン残り：1投目の{1}%"
],
[
"{0}{1} described",
"{0}記録済み{1}件"
],
[
"{0}% strikes ·",
"ストライク{0}% ·"
],
[
"((100% - {0}px) / {1})",
""
],
[
", running {0}",
"、累計{0}"
],
[
"· ball {0}",
"· {0}投目"
],
[
"Showing {0} of {1}, newest first.",
"{1}件中{0}件を表示（新しい順）"
],
[
"{0} ten pins",
"10番ピン残り{0}回"
],
[
"{0} splits",
"スプリット{0}回"
],
[
"Load {0} More",
"さらに{0}件を読み込む"
],
[
"{0} avg",
"アベレージ{0}"
],
[
"{0} pins between {1} bowler{2:s}{3}",
"{1}人で合計{0}ピン{3}"
],
[
"{0}{1} on my average",
"アベレージ比{0}{1}"
],
[
"{0} more to {1} tester mode",
"あと{0}回タップするとテスターモードが{1}になります"
],
[
"Other bowlers have a “{0}” too",
"ほかのボウラーにも「{0}」があります"
],
[
"“{0}” is already here",
"「{0}」はすでに登録されています"
],
[
"{0} to {1} · {2} night{3:s}, {4} game{5:s}",
"{0}〜{1} · {2}日、{4}ゲーム"
],
[
"Usually {0}s",
"たいてい{0}"
],
[
"Bowls on {0}s",
"毎週{0}に投球"
],
[
"{0} team{1:s} in this league",
"{0}チームがこのリーグに所属"
],
[
"sessions-{0}.csv",
"日別記録-{0}.csv"
],
[
"shots-{0}.csv",
"投球記録-{0}.csv"
],
[
"bowling-backup-{0}.json",
"ボウリングバックアップ-{0}.json"
],
[
"You have {0} change{1:s} still waiting to save. {2} will be sent first.",
"保存待ちの変更が{0}件あります。こちらが先に送信されます。"
],
[
"Signed in as {0}.",
"{0}でログイン中です。"
],
[
"{0} change{1:s} {2} not reached the cloud yet.",
"{0}件の変更がまだクラウドに届いていません。"
],
[
"Signing out now may lose {0}. Sign out anyway?",
"今ログアウトすると、その変更が失われる可能性があります。それでもログアウトしますか？"
],
[
"{0} is published by My Bowling Journey LLC.",
"{0}はMy Bowling Journey LLCが提供しています。"
],
[
"Version {0}",
"バージョン{0}"
],
[
"{0} day{1:s} left in your trial",
"トライアル残り{0}日"
],
[
"mbj-share-{0}.png",
""
],
[
"Share {0}",
"{0}を共有"
],
[
"{0} Team",
"{0}チーム"
],
[
"Select {0} above",
"上で{0}を選んでください"
],
[
"Select {0} or {1} above",
"上で{0}または{1}を選んでください"
],
[
"{0} (you)",
"{0}（自分）"
],
[
"Every rate stat side by side against {0}, instead of hunting through separate cards. Split Rate is the one metric here where lower is better.",
"すべての率の成績を{0}と並べて比較します。カードを1枚ずつ探す必要はありません。ここで唯一、低いほど良い指標はスプリット率です。"
],
[
"{0} to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.",
"表示するには{0} — ハイゲーム／ハイシリーズには特定のメンバー構成が必要です。人数の違うチームを合算すると、ボウラーの多いチームが不当に有利になるためです。"
],
[
"{0}'s Records",
"{0}の自己ベスト"
],
[
", game {0}",
"、{0}ゲーム目"
],
[
"{0} season record",
"{0}のシーズン成績"
],
[
"{0}-{1} on games, {2}-{3} on pinfall.",
"ゲームで{0}-{1}、倒したピン数の合計で{2}-{3}。"
],
[
"{0}: {1}/{2} points ({3}-{4} games, {5}-{6} pinfall)",
"{0}：{1}/{2}ポイント（ゲーム{3}-{4}、ピン数合計{5}-{6}）"
],
[
"{0} to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.",
"表示するには{0} — 「チーム」は1つの特定のメンバー構成を指す必要があり、複数のリーグの対戦を混ぜたものではいけません。"
],
[
"Smaller handicap (avg {0})",
"ハンデ小（平均{0}）"
],
[
"Larger handicap (avg {0})",
"ハンデ大（平均{0}）"
],
[
"{0}% stk",
"ストライク{0}%"
],
[
"{0} shots",
"{0}投"
],
[
"{0} to see this — it needs a specific roster to know who's on top.",
"表示するには{0} — 誰がトップかを判定するには、特定のメンバー構成が必要です。"
],
[
"{0}wk{1:s} on top",
"{0}週トップ"
],
[
"{0}/{1} games",
"{0}/{1}ゲーム"
],
[
"{0} to see this — it needs a specific roster to know who else was bowling that frame.",
"表示するには{0} — そのフレームで他に誰が投げていたかを知るには、特定のメンバー構成が必要です。"
],
[
"{0} of {1} frames with no open.",
"{1}フレーム中、オープンなしは{0}フレームです。"
],
[
"Frames {0}",
"{0}フレーム"
],
[
"Frame {0}",
"{0}フレーム"
],
[
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where {0} tends to leave pins, regardless of which game it is.",
"ゲーム単位ではなくフレーム番号別に集計しています。何ゲーム目かに関係なく、どの日にも共通する特定のタイミング（ウォームアップ、レーンのトランジション、9フレームでのスコア計算による集中切れ）で{0}がピンを残しやすいかどうかがわかります。"
],
[
"⚠️ Only {0} game{1:s} logged — each frame number needs at least {2} to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.",
"⚠️ 記録はまだ{0}ゲームのみです。本当の傾向と偶然を見分けるには、各フレーム番号に最低{2}ゲーム必要です。それまでは結論ではなく、参考程度にご覧ください。"
],
[
"Frame {0} (n={1})",
"{0}フレーム（n={1}）"
],
[
"Weakest: {0} ({1}) · Strongest: {2} ({3})",
"最低：{0}（{1}）· 最高：{2}（{3}）"
],
[
"{0} {1} vs {2}",
"{0} {1}（{2}比）"
],
[
"Across {0} fresh racks.",
"10本立ちでの{0}投の集計です。"
],
[
"Across {0} non-strike balls.",
"ストライク以外の{0}投の集計です。"
],
[
"{0} of {1} made. You leave a ten on {2}% of first balls.",
"{1}回中{0}回スペアメイク。1投目の{2}%で10番ピンが残っています。"
],
[
"{0} of {1} made. Any leave with exactly one pin standing — 7, 4, 8, 10, or any other.",
"{1}回中{0}回メイク。7番、4番、8番、10番など、1本だけ残ったケースはすべて対象です。"
],
[
"{0} split{1:s} left, {2}% of your first balls.",
"スプリットが残ったのは{0}回で、1投目の{2}%です。"
],
[
"{0} to see who owes a round.",
"誰が一杯おごる番かを見るには、{0}。"
],
[
"{0} more shots needed",
"あと{0}投必要"
],
[
"Strike {0}%",
"ストライク {0}%"
],
[
"1st ball {0}",
"1投目 {0}"
],
[
"Split {0}%",
"スプリット {0}%"
],
[
"Across {0} games.",
"{0}ゲームの集計です。"
],
[
"Tracked in 5-pin steps{0}.",
"アベレージを5ピン刻みで追っています{0}。"
],
[
"({0}% to {1})",
"（{1}まで{0}%）"
],
[
"Next Session ({0} Games)",
"次回（{0}ゲーム）"
],
[
"You're averaging {0} across {1} games. Here's what the next set does to it.",
"現在のアベレージは{0}（{1}ゲーム）。次のシリーズでの変化は以下のとおりです。"
],
[
"To reach {0}",
"{0}に到達するには"
],
[
"Drops to {0} at or below",
"合計これ以下で{0}に下がる"
],
[
"under {0}/game",
"1ゲーム{0}未満"
],
[
"Across {0} {1}, ranging {2}–{3}.",
"{0}{1}の集計で、範囲は{2}〜{3}です。"
],
[
"Composite average at each position in the night, across the whole season — shows whether {0} bowling better early, middle, or late.{1}",
"シーズン全体での、その日の各ゲーム順ごとの総合アベレージです。{0}が序盤・中盤・終盤のどこで調子が良いかがわかります。{1}"
],
[
"Game {0}",
"{0}ゲーム目"
],
[
"Team: {0}",
"チーム：{0}"
],
[
"${0} paid in — {1} {2} overall.",
"参加費${0} — 通算{1}{2}。"
],
[
"{0} win{1:s} and {2} jackpot{3:s}.",
"ポット獲得{0}回、ジャックポット{2}回。"
],
[
"{0} games",
"{0}ゲーム"
],
[
"High {0}",
"ハイゲーム{0}"
],
[
"Unhide Stat Cards ({0})",
"非表示の成績カードを再表示（{0}）"
],
[
"{0}{1}Manage or cancel any time in the Play Store app, under Subscriptions.",
"{0}{1}管理・解約は、Play Storeアプリの「定期購入」からいつでも行えます。"
],
[
"Your {0}-day free trial has started, and everything is unlocked.",
"{0}日間の無料トライアルが始まりました。すべての機能をご利用いただけます。"
],
[
"You cancelled, so this ends{0}. Everything stays unlocked until then, and you can start it again any time before it ends.",
"解約済みのため、{0}終了します。それまではすべての機能をご利用いただけます。終了前ならいつでも再開できます。"
],
[
"(free keeps {0})",
"（無料版は{0}リーグまで）"
],
[
"Yearly · {0}",
"年額 · {0}"
],
[
"Monthly · {0}",
"月額 · {0}"
],
[
"Start your {0}-day free trial",
"{0}日間の無料トライアルを開始"
],
[
"Subscribe · {0}/{1}",
"登録する · {0}/{1}"
],
[
"{0}{1}Cancel any time{2}{3}— you keep Pro until the end of the period you have paid for.",
"{0}{1}解約はいつでも{2}{3}— お支払い済みの期間が終わるまで、Proを引き続きご利用いただけます。"
],
[
"Hint: {0}",
"ヒント：{0}"
],
[
"Details: {0}",
"詳細：{0}"
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
"{1}では現在{0}に所属しています。{2}に参加すると、{3}のメンバーから外れます。スコアはご自身の記録としてそのまま残ります。"
],
[
"You're on {0}{1}.{2}",
"{0}{1}のメンバーになりました。{2}"
],
[
"You're off {0}.",
"{0}のメンバーから外れました。"
],
[
"You're on {0} in this league. If {1} approves you, you'll be taken off {2}'s roster. Your scores stay yours.",
"このリーグでは現在{0}に所属しています。{1}に承認されると、{2}のメンバーから外れます。スコアはご自身の記録としてそのまま残ります。"
],
[
"Delete \"{0}\"? This removes the team and its roster, but does not delete any bowler accounts.",
"「{0}」を削除しますか？チームとそのメンバー表は削除されますが、ボウラーのアカウントは削除されません。"
],
[
"{0}approving moves them off {1}",
"{0}承認すると、そのボウラーは{1}から外れます"
],
[
"You're invited to {0}",
"{0}への招待が届いています"
],
[
"Asked to join {0} — waiting for someone on the team to approve.",
"{0}への参加を申請しました — チームメンバーの承認待ちです。"
],
[
"Join our team on {0} — sign up and enter code {1}",
"{0}で私たちのチームに参加してください — アカウント登録後、コード{1}を入力してください"
],
[
"{0} — invited, waiting for them to accept",
"{0} — 招待済み、承認待ち"
],
[
"{0}/{1} cuts",
"予選通過{0}/{1}"
],
[
"{0} Your history: {1} avg over {2} game{3:s}{4}",
"{0} これまでの成績：{2}ゲームでアベレージ{1}{4}"
],
[
"+ Save \"{0}\" for next time",
"+ 「{0}」を次回用に保存"
],
[
"Day {0}",
"{0}日目"
],
[
"Go to scoring{0} {1}",
"スコア入力へ{0} {1}"
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
"カットライン{1}に対して{3}ゲームで{0}{5}。"
],
[
"Go to {0} {1}",
"{0}へ {1}"
],
[
"This block{0}s frames are logged under {1}, not {2}.",
"このブロックのフレームは{2}ではなく{1}の日付で記録されています。"
],
[
"Move them to {0}",
"{0}に移動"
],
[
"Remove game {0}",
"{0}ゲーム目を削除"
],
[
"With hcp ({0}g)",
"ハンデ込み（{0}G）"
],
[
"Total ({0}g)",
"合計（{0}G）"
],
[
"{0} Brackets & Side Pots",
"{0} ブラケット・サイドポット"
],
[
"${0} paid in — {1} ${2} on side action.",
"参加費${0} — ブラケット・サイドポットの収支は{1}${2}。"
],
[
"{0} Match Play",
"{0} マッチプレー"
],
[
"Match {0}{1}{2}",
"第{0}試合{1}{2}"
],
[
"by {0}",
"{0}ピン差"
],
[
"Go to the stepladder {0}",
"ステップラダーへ {0}"
],
[
"{0} Stepladder",
"{0} ステップラダー"
],
[
"Step {0}{1}{2}",
"ステップ{0}{1}{2}"
],
[
"Squad {0}",
"シフト{0}"
],
[
"Block {0}",
"ブロック{0}"
],
[
"{0} average over {1} game{2:s}{3}{4}",
"{1}ゲームのアベレージ{0}{3}{4}"
],
[
"· on to {0}",
"· 次のラウンド：{0}"
],
[
"Match {0}{1}",
"第{0}試合{1}"
],
[
"{0} average over {1} match{2:s}{3}{4}",
"{1}試合のアベレージ{0}{3}{4}"
],
[
"· {0} scratch",
"· スクラッチ{0}"
],
[
"Best: match {0} by {1}{2}",
"ベスト：第{0}試合{2}（{1}ピン差で勝ち）"
],
[
"Worst: match {0} by {1}{2}",
"ワースト：第{0}試合{2}（{1}ピン差で負け）"
],
[
"On to {0}.",
"次のラウンド：{0}"
],
[
"Seeded {0}.",
"{0}シード。"
],
[
"You bowl frames {0}{1}. The score stays out of your average since you did not bowl it alone, but your own frames still count.",
"担当フレーム：{0}{1}。1人で投げたスコアではないためアベレージには含まれませんが、自分が投げたフレームは集計されます。"
],
[
"The stepladder says {0} — {1}",
"ステップラダーの結果：{0} — {1}"
],
[
"{0}${1} net",
"収支 {0}${1}"
],
[
"({0} game{1:s})",
"（{0}ゲーム）"
],
[
"{0} scratch · {1} handicap pins",
"スクラッチ{0} · ハンデ{1}ピン"
],
[
"0.5px solid {0}",
""
],
[
"Go to match play {0}",
"マッチプレーへ{0}"
],
[
"I{0}m bowling",
"ボウラーとして"
],
[
"I{0}m coaching",
"コーチとして"
],
[
"{0} Sam Ortiz",
"{0} Sam Ortiz"
],
[
"How much data it{0}s built on, beside it",
"もとになったデータ量がすぐ横に表示されます"
],
[
"Leave the target off if it isn{0}t a number",
"目標が数値でない場合は空欄のままにしてください"
],
[
"Target 60% {0} due 1 Apr",
"目標60% {0} 期限4月1日"
],
[
"{0} games{1} ·{2}averaging {3} · high {4}, low {5}. The spread is {6} pins — that's what a nightly average hides.",
"{0}ゲーム{1} ·{2}アベレージ{3} · ハイゲーム{4}、ローゲーム{5}。スコアのばらつきは{6}ピンです — 1日ごとのアベレージでは、これが見えません。"
],
[
"Last {0}",
"直近{0}ゲーム"
],
[
"Last {0} days",
"直近{0}日間"
],
[
"Nights here average {0} attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.",
"ここでの1日あたりの試行回数は平均{0}回と少なめです — 自分の投球が何も変わっていなくても、個々の点は大きく上下します。"
],
[
"Free trial — {0} {1} left",
"無料トライアル — 残り{0}日"
],
[
"Your subscription starts {0}.",
"サブスクリプションは{0}に開始します。"
],
[
"You are on the monthly plan. The yearly plan is {0} and works out cheaper — switch any time.",
"現在は月額プランです。年額プランは{0}で、よりお得です — いつでも切り替えられます。"
],
[
"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Crect width='34' height='34' rx='9' fill='{0}' fill-opacity='0.13'/%3E%3Cpath d='M11 14l6 6 6-6' fill='none' stroke='{1}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
""
],
[
"Pin {0}",
"{0}番ピン"
],
[
"{0} was {1} by AI. It can be confidently wrong — {2}.",
"{0}はAIによるものです。自信ありげに間違えることがあります — {2}。"
],
[
"⟨0⟩ wants to be your {0}.",
"⟨0⟩が{0}としてつながりを希望しています。"
],
[
"Avg {0} ⟨0⟩ · {1}g",
"アベレージ{0} ⟨0⟩ · {1}ゲーム"
],
[
"${0} won⟨0⟩${1} in",
"獲得${0}⟨0⟩参加費${1}"
],
[
"Suggested new book average: ⟨0⟩ — {0}.{1} Change the number below if this doesn't match your full season.",
"新しい公認アベレージの提案：⟨0⟩ — {0}。{1}シーズン全体の成績と合わない場合は、下の数値を変更してください。"
],
[
"{0} avg ⟨0⟩",
"アベレージ{0} ⟨0⟩"
],
[
"You — {0}/{1} ⟨0⟩",
"自分 — {0}/{1} ⟨0⟩"
],
[
"{0} — {1}{2} attempts ⟨0⟩",
"{0} — {1}{2}回 ⟨0⟩"
],
[
"{0} — {1}, {2} attempts ⟨0⟩",
"{0} — {1}、{2}回 ⟨0⟩"
],
[
"We sent a {0}-digit code to ⟨0⟩.",
"⟨0⟩に{0}桁のコードを送信しました。"
],
[
"⟨0⟩ wants to join {0}",
"⟨0⟩が{0}への参加を希望しています"
],
[
"Cost ${0} · ⟨0⟩",
"費用 ${0} · ⟨0⟩"
],
[
"{0}% strikes",
"ストライク率{0}%"
],
[
"{0} described",
"記録{0}件"
],
[
"The analysis service didn't respond properly ({0}). This is usually temporary — tap Try Again.",
"分析サービスから正常な応答がありませんでした（{0}）。通常は一時的なものです — 「再試行」をタップしてください。"
],
[
"The lamp went quiet. Try again in a moment. (ref {0})",
"ランプが静かになってしまいました。少し待ってからもう一度お試しください。（参照：{0}）"
],
[
"Location search failed ({0}).",
"位置情報での検索に失敗しました（{0}）。"
],
[
"Unsupported image type: {0}",
"対応していない画像形式です：{0}"
],
[
"Couldn't pour the nightcap ({0}). Tap to try again.",
"Nightcapをお出しできませんでした（{0}）。タップしてもう一度お試しください。"
],
[
"{0} {1} left today",
"今日あと{0}回"
],
[
"{0} league{1:s}",
"{0}リーグ"
],
[
"{0} ball{1:s}",
"ボール{0}個"
],
[
"{0} bowler",
"{0}人"
],
[
"{0} bowlers",
"{0}人"
],
[
"{0} set",
"{0}件設定済み"
],
[
"{0} available",
"{0}件"
],
[
"{0} times",
"{0}回"
],
[
"{0} view",
"{0}の表示"
],
[
"{0}: playing",
"{0}：参加"
],
[
"{0}: not playing",
"{0}：不参加"
],
[
"Frame {0}, {1}, running {2}",
"{0}フレーム、{1}、累計{2}"
],
[
"Frame {0}, not bowled",
"{0}フレーム、未投球"
],
[
"Frame {0}, not bowled, running {1}",
"{0}フレーム、未投球、累計{1}"
],
[
"Frame {0}, {1}",
"{0}フレーム、{1}"
],
[
"{0} pin{1:s} short",
"あと{0}ピン"
],
[
"best {0}",
"ベスト{0}"
],
[
"{0} of {1}",
"{0}/{1}"
],
[
"— {0}, {1}",
"— {0}、{1}"
],
[
"{0} series",
"シリーズ{0}"
],
[
"{0}: {1} series",
"{0}：シリーズ{1}"
],
[
"Delete {0}",
"{0}を削除"
],
[
"nightcap:{0}|{1}|{2}|{3}{4}",
""
],
[
"{0} of {1} attempts",
"{1}回中{0}回"
],
[
"{0} of {1} attempt",
"{1}回中{0}回"
],
[
"{0} of {1} balls",
"{1}個中{0}個"
],
[
"{0} of {1} nights",
"{1}日中{0}日"
],
[
"{0} of {1} games",
"{1}ゲーム中{0}ゲーム"
],
[
"{0}-{1} standing",
"残りピン：{0}-{1}"
],
[
"{0} standing",
"残りピン：{0}"
],
[
"▲ {0} more",
"▲ ほか{0}件"
],
[
"▼ {0} more",
"▼ ほか{0}件"
],
[
"{0} bag",
"バッグ{0}個"
],
[
"{0} bags",
"バッグ{0}個"
],
[
"{0} pin",
"{0}番ピン"
],
[
"e.g. {0}",
"例：{0}"
],
[
"{0}% converted",
"メイク率{0}%"
],
[
"Trending up about {0} pins across this stretch.",
"この期間で約{0}ピンの上昇傾向です。"
],
[
"Trending down about {0} pins across this stretch.",
"この期間で約{0}ピンの下降傾向です。"
],
[
"Trending up about {0} points across this stretch.",
"この期間で約{0}ポイントの上昇傾向です。"
],
[
"Trending down about {0} points across this stretch.",
"この期間で約{0}ポイントの下降傾向です。"
],
[
"Trending up about {0} across this stretch.",
"この期間で約{0}の上昇傾向です。"
],
[
"Trending down about {0} across this stretch.",
"この期間で約{0}の下降傾向です。"
],
[
"${0} paid in — up ${1} on the night.",
"参加費${0} — 今日の収支はプラス${1}。"
],
[
"${0} paid in — down ${1} on the night.",
"参加費${0} — 今日の収支はマイナス${1}。"
],
[
"${0} paid in — up {1} overall.",
"参加費${0} — 通算の収支はプラス{1}。"
],
[
"${0} paid in — down {1} overall.",
"参加費${0} — 通算の収支はマイナス{1}。"
],
[
"${0} paid in — up ${1} on side action.",
"参加費${0} — ブラケット・サイドポットの収支はプラス${1}。"
],
[
"${0} paid in — down ${1} on side action.",
"参加費${0} — ブラケット・サイドポットの収支はマイナス${1}。"
],
[
"Hide {0}",
"「{0}」を非表示"
],
[
"10-Pin {0}%",
"10番ピン {0}%"
],
[
"{0}% {1} pin",
"{1}番ピン残り{0}%"
],
[
"{0} (me)",
"{0}（自分）"
],
[
"{0} ({1}g)",
"{0}（{1}G）"
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
"速すぎ：{0}"
],
[
"Slow: {0}",
"遅すぎ：{0}"
],
[
"Execution: {0}",
"投球精度：{0}"
],
[
"Earned · {0}",
"達成 · {0}"
],
[
"Open results for {0} night, {1}",
"{1}の結果を開く"
],
[
"Game {0} ball",
"{0}ゲーム目のボール"
],
[
"{0} max",
"最大{0}"
],
[
"Your {0}-day free trial starts today. When it ends, the {1} plan starts at {2} and renews on its own until you cancel.",
"{0}日間の無料トライアルが本日から始まります。終了後は{1}プラン（{2}）が始まり、解約するまで自動で更新されます。"
],
[
"The {0} plan is {1}. Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.",
"{0}プランは{1}です。無料トライアルが適用されるかどうかは、購入を確定する前にGoogle Playに表示されます。その後は解約するまで自動で更新されます。"
],
[
"The {0} plan is {1}.",
"{0}プランは{1}です。"
],
[
"You have already had the free trial, so the {0} plan starts today at {1} and renews on its own until you cancel.",
"無料トライアルはすでにご利用済みのため、{0}プランは本日から{1}で始まり、解約するまで自動で更新されます。"
],
[
"Ask {0}",
"{0}に質問"
],
[
"You've used all {0} questions today. Ask again tomorrow.",
"本日の質問{0}回分をすべて使いました。また明日質問してください。"
],
[
"Ask {0} a question",
"{0}に質問する"
],
[
"Brooklyn couldn't answer that. Try again in a moment. (ref {0})",
"Brooklynは回答できませんでした。少し待ってからもう一度お試しください。（参照：{0}）"
],
[
"Coach · {0}",
"コーチ · {0}"
],
[
"{0} strips for {1} games",
""
],
[
"▸ Check frames · {0} flagged",
"▸ フレームを確認 · 要確認{0}件"
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
"このログインリンクは{0}用で、現在ログインしているアカウントとは異なります。アカウントを切り替えるつもりだった場合は、先にログアウトしてください。"
],
[
"Sign in as {0}?",
"{0}としてログインしますか？"
],
[
"{0} (pending)",
"{0}（承認待ち）"
],
[
"rotate(-90 10 {0})",
"rotate(-90 10 {0})"
],
[
"{0}: no cover or core entered yet, so {1} be placed.",
"{0}：カバーストックとコアがまだ入力されていないため、{1}。"
],
[
"A big step down from {0} to {1}: a condition between them has no ball.",
"{0}から{1}へ、強さが大きく下がります：その間のコンディションに合うボールがありません。"
],
[
"{0} and {1} sit almost on top of each other. They do the same job.",
"{0}と{1}はほぼ同じ位置にあり、役割が重なっています。"
],
[
"{0} A wider range means the bag covers more conditions.",
"{0}幅が広いほど、そのバッグは多くのコンディションに対応できます。"
],
[
"In both bags: {0}.",
"両方のバッグに入っているボール：{0}。"
],
[
"In {0}",
"{0}のボール"
],
[
"From the catalog: {0}",
"カタログから：{0}"
],
[
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.{0}",
"Caddieがバッグ全体を読み解きます — どのコンディションにどのボールを使うか、どのバッグがうまく組まれているか、何を加えて何を置いていくか。有料プランの機能です。{0}"
],
[
"Reads {0}: what it's built for and what it's missing.",
"{0}を読み解きます：どんな状況向けか、何が足りないか。"
],
[
"{0} games · {1} avg{2}{3}{4}",
"{0}ゲーム · アベレージ{1}{2}{3}{4}"
],
[
"· best {0}",
"· ベストは{0}"
],
[
"· {0}% strikes",
"· ストライク率{0}%"
],
[
"Surface: {0}{1}{2}Layout: {3}",
"サーフェス：{0}{1}{2}レイアウト：{3}"
],
[
"Strength {0} · Length {1} · Back end {2}⟨0⟩",
"強さ{0} · レングス{1} · バックエンド{2}⟨0⟩"
],
[
"{0} games at {1}{2}.{3}",
"{0}ゲームでアベレージ{1}{2}。{3}"
],
[
", against your {0} overall",
"（全体では{0}）"
],
[
"By part of the night: {0}.",
"時間帯別：{0}。"
],
[
"All {0} of your leagues",
"{0}リーグすべて"
],
[
"Basic keeps {0} league active. The others are paused — nothing is deleted, and they come back when you do.",
"Basicで有効にできるリーグは{0}つまでです。ほかのリーグは一時停止されます — 何も削除されず、戻ってきたときに再開されます。"
],
[
"All {0} of your teams",
"{0}チームすべて"
],
[
"Basic keeps {0}.",
"Basicで使えるのは{0}チームまでです。"
],
[
"Which of your {0} balls carries best, and how each one holds up from the first game to the last.",
"{0}個のボールのうちどれが一番キャリーするか、そして各ボールが1ゲーム目から最終ゲームまでどう持ちこたえるか。"
],
[
"Your read-back after every night — you've poured {0}.",
"毎回その日の終わりにお届けする振り返り — これまでに{0}杯注ぎました。"
],
[
"Answers about your own game — you've asked {0} question{1:s}.",
"自分のプレーについての回答 — これまでに{0}回質問しました。"
],
[
"The deep read of your game — you've run it {0} time{1:s}.",
"プレーの詳しい分析 — これまでに{0}回実行しました。"
],
[
"Your arsenal and bags, read ball by ball — {0} read{1:s} so far.",
"アーセナルとバッグをボールごとに分析 — これまでに{0}回。"
],
[
"All {0} of your bags",
"{0}個のバッグすべて"
],
[
"Basic keeps {0} league bag and {1} tournament bag.",
"Basicで使えるのは、リーグ用バッグ{0}個と大会用バッグ{1}個までです。"
],
[
"How you score at each of the {0} centers you've bowled.",
"これまで投げた{0}か所のボウリング場ごとのスコア。"
],
[
"for {0}/month",
"（月額{0}）"
],
[
"You've logged {0} games with your {1}!",
"{1}で{0}ゲームを記録しました！"
],
[
"To keep seeing how it stacks up against the rest of your bag — which ball carries, and when — keep Pro{0}.",
"バッグのほかのボールと比べてどうか — どのボールがいつキャリーするか — を引き続き確認するには、Pro{0}を続けてください。"
],
[
"You've poured {0} Nightcaps!",
"Nightcapを{0}杯注ぎました！"
],
[
"To keep getting one after every night, keep Pro{0}.",
"毎回その日の終わりに受け取り続けるには、Pro{0}を続けてください。"
],
[
"You're tracking {0} leagues!",
"{0}リーグを記録しています！"
],
[
"To keep all of them active, keep Pro{0}.",
"すべてのリーグを有効なままにするには、Pro{0}を続けてください。"
],
[
"You've logged {0} games in your first 60 days!",
"最初の60日間で{0}ゲームを記録しました！"
],
[
"To keep the comparisons and the AI reads of your game, keep Pro{0}.",
"比較機能やAIによるプレー分析を引き続き使うには、Pro{0}を続けてください。"
],
[
"Keep everything unlocked{0}, or carry on with Basic — your scores and stats stay free.",
"すべての機能をそのまま使う{0}か、Basicで続けるかを選べます — スコアと成績は無料のままです。"
],
[
"Your Pro trial ends in {0} day{1:s}",
"Proトライアル終了まであと{0}日"
],
[
"Keep Pro · {0}/month",
"Proを続ける · {0}/月"
],
[
"Or {0}/year",
"または{0}/年"
],
[
"Pro trial — {0} day{1:s} left. No card on file; nothing is charged when it ends.",
"Proトライアル — 残り{0}日。カードは登録されていないため、終了しても料金は発生しません。"
],
[
"Thanks for subscribing. Everything is unlocked.{0}Manage or cancel any time in the Play Store app, under Subscriptions.",
"ご登録ありがとうございます。すべての機能をご利用いただけます。{0}管理・解約は、Play Storeアプリの「定期購入」からいつでも行えます。"
],
[
"You have Pro free for {0} more day{1:s}. Subscribing now starts billing today; you can also wait, and we'll ask when your trial ends.",
"Proの無料期間は残り{0}日です。今登録すると、本日から課金が始まります。このまま待つこともでき、無料トライアルの終了時にあらためて確認します。"
],
[
"⟨0⟩ {0} · {1} shots",
"⟨0⟩ {0} · {1}投"
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
"解約済みのため、{0}に終了します。それまではすべての機能をご利用いただけます。終了前ならいつでも再開できます。"
],
[
"Finished {0}.",
"{0}でフィニッシュしました。"
],
[
"Finished {0} to the {1} seed.",
"{1}シードに敗れ、{0}でフィニッシュしました。"
],
[
"Finished {0} to {1}.",
"{1}に敗れ、{0}でフィニッシュしました。"
],
[
"{0} step{1:s} won, still climbing.",
"{0}ステップ勝ち上がり、まだ勝ち進んでいます。"
],
[
"{0} board{1:s} left of target",
"ターゲットから左に{0}ボードずれ"
],
[
"{0} board{1:s} right of target",
"ターゲットから右に{0}ボードずれ"
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.",
"{0}はバッジを{1}{2}個獲得しています — {4}。"
],
[
"{0} earned a badge tonight — {1}.",
"{0}が今日バッジを獲得しました — {1}。"
],
[
"{0} earned {1} badges tonight — {2}.",
"{0}が今日バッジを{1}個獲得しました — {2}。"
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.\n\nKeep them: {5}",
"{0}はバッジを{1}{2}個獲得しています — {4}。\n\nバッジを残すならこちら：{5}"
],
[
"{0} earned a badge tonight — {1}.\n\nKeep them: {2}",
"{0}が今日バッジを獲得しました — {1}。\n\nバッジを残すならこちら：{2}"
],
[
"{0} earned {1} badges tonight — {2}.\n\nKeep them: {3}",
"{0}が今日バッジを{1}個獲得しました — {2}。\n\nバッジを残すならこちら：{3}"
],
[
"{0}-{1} over {2} match{3:s} · {4} with bonus",
"{2}試合で{0}-{1} · ボーナス込み{4}"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} with bonus",
"{3}試合で{0}-{1}-{2} · ボーナス込み{5}"
],
[
"{0}-{1} over {2} match{3:s} · {4} average · {5} with bonus",
"{2}試合で{0}-{1} · アベレージ{4} · ボーナス込み{5}"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} average · {6} with bonus",
"{3}試合で{0}-{1}-{2} · アベレージ{5} · ボーナス込み{6}"
],
[
"{0} seed · {1} of {2} step{3:s} won · finished {4}",
"{0}シード · {2}戦{1}勝 · 最終{4}"
],
[
"{0} seed · {1} of {2} step{3:s} won",
"{0}シード · {2}戦{1}勝"
],
[
"{0} of {1} step{2:s} won · finished {3}",
"{1}戦{0}勝 · 最終{3}"
],
[
"Your average is up {0} pin{1:s} on last season — {2}.",
"アベレージが前シーズンから{0}ピン上がりました — {2}。"
],
[
"Your average is down {0} pin{1:s} on last season — {2}.",
"アベレージが前シーズンから{0}ピン下がりました — {2}。"
],
[
"{0} bowled {1} for {2} at {3} on {4}: {5}.",
"{0}：{4}、{3}で{2}ゲーム合計{1}（{5}）。"
],
[
"{0} bowled {1} for {2} at {3}: {4}.",
"{0}：{3}で{2}ゲーム合計{1}（{4}）。"
],
[
"{0} bowled {1} for {2} on {3}: {4}.",
"{0}：{3}、{2}ゲーム合計{1}（{4}）。"
],
[
"{0} bowled {1} for {2}: {3}.",
"{0}：{2}ゲーム合計{1}（{3}）。"
],
[
"{0} bowled a {1} at {2} on {3}.",
"{0}：{3}、{2}でスコア{1}。"
],
[
"{0} bowled a {1} at {2}.",
"{0}：{2}でスコア{1}。"
],
[
"{0} bowled a {1} on {2}.",
"{0}：{2}、スコア{1}。"
],
[
"{0} bowled a {1}.",
"{0}：スコア{1}。"
],
[
"Bowled {0} for {1} at {2} on {3}: {4}.",
"{3}、{2}で{1}ゲーム合計{0}（{4}）。"
],
[
"Bowled {0} for {1} at {2}: {3}.",
"{2}で{1}ゲーム合計{0}（{3}）。"
],
[
"Bowled {0} for {1} on {2}: {3}.",
"{2}、{1}ゲーム合計{0}（{3}）。"
],
[
"Bowled {0} for {1}: {2}.",
"{1}ゲーム合計{0}（{2}）。"
],
[
"Bowled a {0} at {1} on {2}.",
"{2}、{1}でスコア{0}。"
],
[
"Bowled a {0} at {1}.",
"{1}でスコア{0}。"
],
[
"Bowled a {0} on {1}.",
"{1}、スコア{0}。"
],
[
"Bowled a {0}.",
"スコア{0}。"
],
[
"{0} bowled at {1} on {2}.",
"{0}：{2}、{1}で投球しました。"
],
[
"{0} bowled at {1}.",
"{0}：{1}で投球しました。"
],
[
"{0} bowled on {1}.",
"{0}：{1}に投球しました。"
],
[
"{0} bowled.",
"{0}：投球しました。"
],
[
"Bowled at {0} on {1}.",
"{1}、{0}で投球しました。"
],
[
"Bowled at {0}.",
"{0}で投球しました。"
],
[
"Bowled on {0}.",
"{0}に投球しました。"
],
[
"{0} games in {1} · averaging {2} · high {3}, low {4}. The spread is {5} pins — that's what a nightly average hides.",
"{0}ゲーム（{1}） · アベレージ{2} · ハイゲーム{3}、ローゲーム{4}。スコアのばらつきは{5}ピンです — 1日ごとのアベレージでは、これが見えません。"
],
[
"Combine your \"{0}\" with the shared one at {1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"「{0}」を{1}の共有リーグと統合しますか？ゲーム、チーム、リーグ設定が共有リーグに移り、すでに登録されているチームも表示されるようになります。この操作は元に戻せません。"
],
[
"{0}st to {1}",
"{1}に敗れ、{0}st"
],
[
"{0}nd to {1}",
"{1}に敗れ、{0}nd"
],
[
"{0}rd to {1}",
"{1}に敗れ、{0}rd"
],
[
"{0}th to {1}",
"{1}に敗れ、{0}th"
],
[
"Seeded {0}. {1}",
"{0}シード。{1}"
],
[
"Stepladder: {0} from the {1} seed",
"ステップラダー：{0}（{1}シードから）"
],
[
"Stepladder: {0}",
"ステップラダー：{0}"
],
[
"Match play: {0}, {1} with bonus",
"マッチプレー：{0}、ボーナス込み{1}"
],
[
"{0} wants to be your coach",
"{0}がコーチとしてつながりを希望しています"
],
[
"{0} wants to be your bowler",
"{0}が指導を受けるボウラーとしてつながりを希望しています"
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
"Cost $",
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
"tonight · $",
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
