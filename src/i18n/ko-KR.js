// Korean (ko-KR) for My Bowling Journey.
//
// English -> Korean, in the same shape as fr-CA.js. `exact` is whole
// text; `patterns` are texts built in code, {0} {1}... being the values
// (see src/i18n/engine.js). An empty string means "looked at, not text a
// person reads" and is skipped. "lang": "ko" gives the Korean number,
// spacing and particle rules: after an inserted value, a particle is
// written as a marker, "(을)를", "(이)가", "(은)는", "(과)와", "(으)로",
// "(이)에요", "(이)야", and the runtime picks the form that fits.
//
// Edit entries here directly. After adding English text to the app, run
//   node scripts/i18n_extract.cjs --missing
// to list what still needs an entry here and in the other catalogs.
// Terminology and style: src/i18n/glossary-ko.md and src/i18n/style-ko.md.
export const KO_KR = {
"lang": "ko",
"exact": {
"Group": "그룹",
"Ungrouped": "그룹 없음",
"Coverstock": "커버스톡",
"Core": "코어",
"Weight (lb)": "무게 (lb)",
"Diff": "Diff",
"Int. Diff (asymmetric only)": "Int. Diff (비대칭 코어만)",
"Layout System": "레이아웃 방식",
"Add": "추가",
"'s balls to start logging shots.": "의 볼을 추가하면 투구를 기록할 수 있어요.",
"Active": "사용 중",
"Archive": "보관함",
"Done": "완료",
"Details": "자세히",
"Remove": "삭제",
"Cancel": "취소",
"No games logged with it yet": "이 볼로 기록한 게임이 아직 없어요",
"No layout recorded": "레이아웃 기록 없음",
"Specs": "스펙",
"Layout": "레이아웃",
"Throwing it again": "다시 사용하기",
"No longer throwing this ball? Archiving takes it out of your arsenal and bags and keeps every shot you logged with it.": "이 볼을 더 이상 쓰지 않나요? 보관하면 보유 볼과 가방에서 빠지지만, 이 볼로 기록한 투구는 모두 그대로 남아요.",
"Archive this ball": "이 볼 보관하기",
"Specs Removed": "스펙 삭제됨",
"Other bowlers reported the shared specs for": "다른 볼러가 공유 스펙이 틀렸다고 신고해서 다음 볼의 스펙을 삭제했어요:",
"as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": ". 볼은 그대로 남아 있어요 — 시간 날 때 상세 정보를 다시 입력해 주세요.",
"Got it": "확인",
"Group by": "분류 기준",
"Your groups": "내 그룹",
"Delete": "삭제",
"New group, e.g. Dry lanes": "새 그룹 (예: 드라이 레인)",
"To put a ball in a group, open the ball and pick the group under its specs.": "볼을 그룹에 넣으려면 볼을 열고 스펙 아래에서 그룹을 고르세요.",
"Enter the code from your email.": "이메일로 받은 코드를 입력해 주세요.",
"Couldn't delete the account. Try again, or email support@mybowlingjourney.com.": "계정을 삭제하지 못했어요. 다시 시도하거나 support@mybowlingjourney.com으로 메일을 보내 주세요.",
"The server didn't confirm the deletion. Nothing has been removed — email support@mybowlingjourney.com.": "서버에서 삭제가 확인되지 않았어요. 아무것도 삭제되지 않았어요 — support@mybowlingjourney.com으로 메일을 보내 주세요.",
"Couldn't reach the server. Nothing has been deleted.": "서버에 연결하지 못했어요. 아무것도 삭제되지 않았어요.",
"Not signed in or name is empty": "로그인하지 않았거나 이름이 비어 있어요",
"unknown reason": "알 수 없는 이유",
"useAuth must be used inside <AuthProvider>": "",
"That code did not work. Check it came through in one piece.": "이 코드는 사용할 수 없어요. 코드가 잘리지 않고 전부 왔는지 확인해 주세요.",
"Your badges": "내 배지",
"Your open bowling badges": "내 자유 게임 배지",
"of": "/",
"Bowl a league night, a tournament or a practice session to start.": "리그, 대회, 연습 세션 중 하나를 치르면 시작돼요.",
"Bowl a night with the group and the first one is yours.": "일행과 한 번 볼링을 치면 첫 배지를 받을 수 있어요.",
"Every one of them.": "하나도 빠짐없이 모았어요.",
"Every one of them. Including the ones nobody wants.": "하나도 빠짐없이 모았어요. 아무도 원하지 않는 것까지요.",
"Some come from one good night, some take a season.": "좋은 날 하루면 받는 것도 있고, 한 시즌이 걸리는 것도 있어요.",
"Not all of them are about bowling well — some are about showing up, and one or two you'd rather not have.": "잘 치는 것만이 전부는 아니에요 — 꾸준히 나오기만 해도 받는 것도 있고, 차라리 없었으면 하는 것도 한두 개 있어요.",
"Share my badges": "내 배지 공유",
"The collection": "컬렉션",
"All": "전체",
"Earned": "획득",
"None yet.": "아직 없어요.",
"None yet. Bowl a night with the group and the first one is yours.": "아직 없어요. 일행과 한 번 볼링을 치면 첫 배지를 받을 수 있어요.",
"Nothing left. You have all of them.": "남은 배지가 없어요. 전부 모았어요.",
"Someone sent you your badges?": "누군가 배지를 보내 줬나요?",
"Paste the code from their message and your nights come across. Doing it twice is harmless — nothing doubles up.": "메시지에 있는 코드를 붙여 넣으면 내 기록이 옮겨져요. 두 번 해도 괜찮아요 — 중복되지 않아요.",
"Paste the code": "코드 붙여 넣기",
"Load": "불러오기",
"Edit Bag": "가방 편집",
"New Bag": "새 가방",
"Name": "이름",
"e.g. Short pattern, 6 ball limit": "예: 짧은 패턴, 볼 6개 제한",
"Type": "종류",
"Balls Allowed": "허용 볼 수",
"The total the tournament allows. Leave blank for no limit.": "대회에서 허용하는 총 개수예요. 제한이 없으면 비워 두세요.",
"e.g. 6": "예: 6",
"Plan to include a plastic": "플라스틱 볼 포함 예정",
"A note for your own planning — it doesn't change the limit above.": "내 계획을 위한 메모예요 — 위의 제한 수는 바뀌지 않아요.",
"Save Bag": "가방 저장",
"Give the bag a name to save it.": "저장하려면 가방 이름을 입력해 주세요.",
"Add a bag": "가방 추가",
"What you carry to league differs from what you carry to a tournament — and tournaments often cap how many balls you may bring, so you can keep several.": "리그에 가져가는 볼과 대회에 가져가는 볼은 달라요 — 대회는 가져갈 수 있는 볼 수를 제한하는 경우가 많아서, 가방을 여러 개 만들어 둘 수 있어요.",
"+ League Bag": "+ 리그 가방",
"+ Tournament Bag": "+ 대회 가방",
"More bags": "더 많은 가방",
"The free plan covers": "무료 플랜에서 쓸 수 있는 가방은",
"league bag and": "개의 리그 가방과",
"tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.": "개의 대회 가방이에요. 추가 가방(짧은 패턴용 대회 가방, 스포츠 패턴용 가방 등)은 유료 플랜 기능이에요. 이미 챙겨 둔 볼은 그대로 남아 있어요.",
"Bags": "가방",
"No bags yet. Add one above.": "아직 가방이 없어요. 위에서 추가해 주세요.",
"ball": "개",
"· plastic planned": "· 플라스틱 볼 포함 예정",
"Edit": "편집",
"Keep": "유지",
"🔒 Pro — kept exactly as packed, and back the moment you subscribe.": "🔒 Pro — 챙겨 둔 그대로 보관되고, 구독하면 바로 다시 쓸 수 있어요.",
"Full — remove a ball before adding another.": "가득 찼어요 — 다른 볼을 넣으려면 먼저 하나를 빼 주세요.",
"Empty. Add balls from below.": "비어 있어요. 아래에서 볼을 추가해 주세요.",
"Add Balls to a Bag": "가방에 볼 넣기",
"Every ball is packed. Practice always shows every ball regardless.": "모든 볼이 가방에 들어 있어요. 연습에서는 항상 모든 볼이 표시돼요.",
"· not in any bag": "· 가방에 없음",
"Community Specs": "커뮤니티 스펙",
"Nobody has shared specs for this ball yet. If you've filled yours in, you can share them so other bowlers don't have to type them.": "아직 이 볼의 스펙을 공유한 사람이 없어요. 내 스펙을 입력해 두었다면 공유해서 다른 볼러가 직접 입력하지 않아도 되게 할 수 있어요.",
"Share My Specs": "내 스펙 공유",
"Yours": "내 스펙",
"No details recorded": "기록된 정보 없음",
"Showing the": "표시 중:",
"lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.": "lb 기준 수치 — RG와 디퍼렌셜은 무게에 따라 다르고, 이 볼은 여러 무게의 수치가 공개되어 있어요.",
"No published numbers for": "공개된 수치 없음:",
"lb specifically — showing the reference weight instead.": "lb 전용 — 대신 기준 무게의 수치를 표시하고 있어요.",
"more": "개 더",
"to": "~",
"Applied": "적용됨",
"Use These": "이 값 사용",
"✓ Looks right": "✓ 맞음",
"Looks right": "맞음",
"✓ Wrong": "✓ 틀림",
"Wrong": "틀림",
"Update Shared": "공유 스펙 업데이트",
"Locked — enough bowlers have confirmed these that they can't be edited.": "잠김 — 충분한 수의 볼러가 확인해서 더 이상 수정할 수 없어요.",
"Voting closed.": "투표가 종료됐어요.",
"Share Mine Instead": "대신 내 스펙 공유",
"Ball path": "볼 궤적",
"First balls at a full rack only": "핀 10개가 모두 서 있을 때의 첫 투구만",
"what a strike ball is for.": "스트라이크 볼의 역할이 바로 그거예요.",
"Add a ball (e.g. Storm Phaze II)": "볼 추가 (예: Storm Phaze II)",
"From other bowlers": "다른 볼러가 등록한 볼",
"Specs entered by other bowlers, not manufacturer data — check them after adding.": "다른 볼러가 입력한 스펙이며 제조사 데이터가 아니에요 — 추가한 뒤 확인해 주세요.",
"Strike % through the night": "그날의 스트라이크율 추이",
"How each ball carried as the lanes went, first games to last.": "레인이 변하는 동안 각 볼의 캐리가 어땠는지, 첫 게임부터 마지막 게임까지.",
"Ball": "볼",
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than": "모든 숫자는 스트라이크율이에요. 굵게 표시된 볼이 그 구간 1위예요. 차이가 우연으로 볼 수 있을 만큼 작으면 아무것도 굵게 표시하지 않아요. 주황색 비율은 근거가 되는 투구 수가",
"shots behind it, so treat it as preliminary. A dash means no shots at all.": "미만이라 잠정적인 수치로 봐 주세요. ‘—’는 투구가 하나도 없다는 뜻이에요.",
"Rubbing the lamp…": "램프를 문지르는 중…",
"Reading your numbers…": "기록된 수치를 읽고 있어요…",
"Working out what they mean…": "무슨 의미인지 분석하고 있어요…",
"Still going — it is a fair question…": "아직 생각 중이에요 — 충분히 고민할 만한 질문이라서요…",
"You've used all": "오늘 질문을 모두 사용했어요",
"today.": "개 전부요.",
"is back tomorrow.": "기능은 내일 다시 이용할 수 있어요.",
"The Stats screens cover the usual numbers.": "일반적인 수치는 ‘통계’ 화면에서 볼 수 있어요.",
"is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.": "기능은 그 화면으로는 답할 수 없는 질문을 위한 거예요 — 내 볼링에 대해 물어보면 지금까지 기록한 내용을 바탕으로 답을 찾아 줘요. 아직 기록하지 않는 항목이 필요하면 무엇부터 기록하면 좋을지 알려 줘요.",
"Ask about your bowling…": "내 볼링에 대해 물어보세요…",
"Ask": "질문",
"That": "이 답변",
"Tour": "",
"Journey": "여정",
"Home": "홈",
"BadgeCollection": "",
"TeamManagement": "",
"Friends": "친구",
"StatsView": "",
"ImportScorecard": "",
"Settings": "설정",
"Profile": "프로필",
"TrendsView": "",
"CoachingView": "",
"InsightsView": "",
"A team with that name already exists in this league.": "이 리그에 같은 이름의 팀이 이미 있어요.",
"Could not clear the sync markers on this device. Nothing was changed.": "이 기기의 동기화 표시를 지우지 못했어요. 아무것도 바뀌지 않았어요.",
"Only the bowler who added this league can combine it. Ask them, or join the shared league from a team code.": "이 리그를 추가한 볼러만 합칠 수 있어요. 그 볼러에게 부탁하거나, 팀 코드로 공유 리그에 참가하세요.",
"Couldn't combine them just now. Nothing was changed — try again in a moment.": "지금은 합치지 못했어요. 아무것도 바뀌지 않았어요 — 잠시 후 다시 시도해 주세요.",
"You already have a league with that name. Rename yours first, then join this one.": "같은 이름의 리그가 이미 있어요. 내 리그 이름을 먼저 바꾼 다음 이 리그에 참가하세요.",
"Couldn't join that league just now. Check your connection and try again.": "지금은 이 리그에 참가하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.",
"A league with that name already exists.": "같은 이름의 리그가 이미 있어요.",
"Pick a bowler first.": "먼저 볼러를 골라 주세요.",
"Give the ball a name.": "볼 이름을 입력해 주세요.",
"Location is needed to find nearby centers. Allow location access, or add the center by name.": "주변 볼링장을 찾으려면 위치 정보가 필요해요. 위치 접근을 허용하거나 볼링장을 이름으로 추가하세요.",
"Couldn't search for centers right now. You can add the center by name instead.": "지금은 볼링장을 검색할 수 없어요. 대신 볼링장을 이름으로 추가할 수 있어요.",
"this team": "이 팀",
"That request was already answered, or couldn't be reached. Refreshing.": "이미 응답한 요청이거나 연결할 수 없었어요. 새로 고치는 중이에요.",
"the team": "팀",
"They": "그 볼러",
"your team": "팀",
"Couldn't join that team just now — try again in a moment.": "지금은 이 팀에 가입하지 못했어요 — 잠시 후 다시 시도해 주세요.",
"Someone": "누군가",
"Couldn't make a code just now — check your connection and try again.": "지금은 코드를 만들지 못했어요 — 연결 상태를 확인하고 다시 시도해 주세요.",
"That code doesn't look right — it's 8 characters.": "코드가 올바르지 않은 것 같아요 — 코드는 8자예요.",
"That code is not valid.": "유효하지 않은 코드예요.",
"That doesn't look like a team code.": "팀 코드가 아닌 것 같아요.",
"Couldn't check that code — you may be offline. You can enter it later in Settings.": "코드를 확인하지 못했어요 — 오프라인일 수 있어요. 나중에 ‘설정’에서 입력할 수 있어요.",
"Give the tournament a name first — it's on the Set up tab.": "먼저 대회 이름을 입력하세요 — ‘준비’ 탭에 있어요.",
"Weak 10": "위크 텐",
"Ringing 10": "링잉 텐",
"Other Leave": "기타 남은 핀",
"9 Pin No-Tap": "9핀 노탭",
"Yes": "예",
"Not a valid backup file": "유효한 백업 파일이 아니에요",
"No shots logged yet for this night": "이날은 아직 기록된 투구가 없어요",
"The lamp flickered and went quiet. Try again in a few minutes.": "램프가 깜빡이더니 조용해졌어요. 몇 분 뒤에 다시 시도해 주세요.",
"Brooklyn had no answer for that.": "Brooklyn이 이 질문에는 답을 찾지 못했어요.",
"open bowling": "",
"Sunday": "일요일",
"Monday": "월요일",
"Tuesday": "화요일",
"Wednesday": "수요일",
"Thursday": "목요일",
"Friday": "금요일",
"Saturday": "토요일",
"Couldn't get your insights right now. Try again in a few minutes.": "지금은 분석을 가져오지 못했어요. 몇 분 뒤에 다시 시도해 주세요.",
"Bowl": "투구",
"Standings": "순위표",
"Setup": "준비",
"Stats": "통계",
"Improve": "향상",
"History": "기록",
"House Shot": "하우스 패턴",
"Back": "뒤로",
"Inbox": "알림함",
"Coach": "코치",
"Help": "도움말",
"Results": "결과",
"Import scorecard": "점수표 가져오기",
"My Bowling Journey Pro": "My Bowling Journey Pro",
"⟳ Backing up": "⟳ 백업 중",
"Import": "가져오기",
"You're all set": "준비가 끝났어요",
"We know you're keen to get started — so we won't hold you up for long. We'd just like to show you around first.": "빨리 시작하고 싶으신 거 알아요 — 오래 붙잡지 않을게요. 먼저 앱을 간단히 안내해 드릴게요.",
"And remember, you can document as much or as little as you want. The more you tell us, the more we can give back.": "그리고 기억하세요. 기록은 원하는 만큼만 하면 돼요. 많이 알려 주실수록 더 많은 걸 돌려드릴 수 있어요.",
"Begin": "시작하기",
"No thanks — I'll take the tour later from the settings menu": "괜찮아요 — 둘러보기는 나중에 설정 메뉴에서 할게요",
"Close": "닫기",
"change is": "개 변경 사항이",
"changes are": "개 변경 사항이",
"saved on this phone. Nothing is lost.": "이 휴대폰에 저장되어 있어요. 사라진 건 없어요.",
"Trying…": "다시 시도하는 중…",
"Try again now": "지금 다시 시도",
"Loading…": "불러오는 중…",
"🧑‍🏫 Coach": "🧑‍🏫 코치",
"🎯 Start a practice drill": "🎯 연습 드릴 시작하기",
"Competitive": "경기",
"Open bowling": "자유 게임",
"a team": "팀",
"A bowler": "어떤 볼러",
"Joining lets teammates see your scores and yours theirs.": "가입하면 팀원들과 서로의 점수를 볼 수 있어요.",
"Anyone on the team can answer.": "팀원 누구나 응답할 수 있어요.",
"Join": "참가",
"Approve": "승인",
"No thanks": "괜찮아요",
"Decline": "거절",
"Nothing Waiting": "대기 중인 항목 없음",
"Requests, coach tasks and scores to confirm show up here.": "요청, 코치 과제, 확인할 점수가 여기에 표시돼요.",
"Balls": "볼",
"League": "리그",
"Team": "팀",
"waiting for you": "건 확인 대기",
"1px solid transparent": "",
"Practice": "연습",
"Tournament": "대회",
"🏆 Won it": "🏆 우승",
"🥈 Runner-up": "🥈 준우승",
"🏅 Top five": "🏅 5위 이내",
"💰 Cashed": "💰 상금권 입상",
"✅ Made the cut": "✅ 컷 통과",
"QUALIFYING": "예선",
"total ·": "(합계) ·",
"average ·": "(에버리지) ·",
"high": "(하이 게임)",
"vs the cut": "(컷라인 대비)",
"MATCH PLAY": "매치 플레이",
"match": "경기",
"with bonus": "(보너스 포함)",
"STEPLADDER": "스텝래더",
"step": "스텝",
"won": "승",
"Nothing logged yet. Once you've bowled a night or two, this shows the shape of a month — which weeks you bowled and which you missed.": "아직 기록이 없어요. 한두 번 볼링을 치고 나면 여기에 한 달의 흐름이 보여요 — 어느 주에 쳤고 어느 주를 걸렀는지요.",
"Earlier month": "이전 달",
"Later month": "다음 달",
"Nothing bowled this month": "이번 달은 볼링 기록이 없어요",
"Bowling": "자유 게임",
"series ·": "(시리즈) ·",
"% strikes": "% 스트라이크",
"Delete this night?": "이날 기록을 삭제할까요?",
"game": "게임",
"and every frame logged with them. This cannot be undone.": "및 여기에 기록한 모든 프레임이 삭제돼요. 되돌릴 수 없어요.",
"Yes, delete it": "예, 삭제할게요",
"Keep it": "그대로 두기",
"Delete this night": "이날 기록 삭제",
"Nobody here yet. Add people to your scoresheet on the Bowl tab and they'll show up once you've bowled a night together.": "아직 아무도 없어요. ‘투구’ 탭의 점수표에 함께 치는 사람을 추가하면, 함께 한 번 치고 난 뒤 여기에 나타나요.",
"Everyone you've bowled with, by average.": "함께 친 모든 사람을 에버리지 순으로 보여 줘요.",
"Add someone to compare against.": "비교할 사람을 추가해 보세요.",
"Share standings": "순위 공유",
"night": "회",
"best": "최고",
"win": "승",
"See all my badges ›": "내 배지 모두 보기 ›",
"Change": "변경",
"Pins": "핀세터",
"Which lanes are free fall? Everything else counts as string.": "프리폴 레인은 어디인가요? 나머지는 모두 스트링으로 처리해요.",
"e.g. 1-8, 15, 16": "예: 1-8, 15, 16",
"Until these are set, this house stays out of the free fall vs string comparison.": "설정하기 전까지 이 볼링장은 프리폴과 스트링 비교에서 빠져요.",
"Bowling Center": "볼링장",
"Where do you usually practice? Setting it lets you compare how you score house to house.": "주로 어디서 연습하나요? 설정하면 볼링장별 점수를 비교할 수 있어요.",
"Where do you usually bowl for fun? Setting it lets you compare how you score house to house.": "자유 게임은 주로 어디서 치나요? 설정하면 볼링장별 점수를 비교할 수 있어요.",
"this league": "이 리그",
"Search by name, e.g. Arsenal Bowl": "이름으로 검색 (예: Arsenal Bowl)",
"Searching…": "검색 중…",
"No centers found nearby. You can add it by name below.": "근처에서 볼링장을 찾지 못했어요. 아래에서 이름으로 추가할 수 있어요.",
"This list": "이 목록",
"check the name and address before you rely on it": "이용하기 전에 이름과 주소를 확인하세요",
"mi": "마일",
"Can't find it? Add by name": "찾을 수 없나요? 이름으로 추가",
"Center name": "볼링장 이름",
"Target:": "목표:",
"reached": "결과",
"short)": "부족)",
"Due": "기한",
"Worked on it": "연습했어요",
"What did you get to?": "결과는 얼마였나요?",
"Anything to tell your coach?": "코치에게 전할 말이 있나요?",
"Save": "저장",
"Reopen": "다시 열기",
"Give the task a title.": "과제 제목을 입력해 주세요.",
"What should they work on?": "어떤 걸 연습하게 할까요?",
"Detail (optional)": "세부 내용 (선택)",
"Measurable target (optional)": "수치 목표 (선택)",
"No target": "목표 없음",
"Target": "목표",
"Assign": "배정",
"Nothing here yet. Both of you can write, and you both see everything.": "아직 아무것도 없어요. 두 사람 모두 쓸 수 있고, 모든 내용을 함께 볼 수 있어요.",
"You": "나",
"Add a note…": "메모 추가…",
"Post": "등록",
"Coaching": "코칭",
"Working with a coach — shared goals, drills they set you, and notes back and forth — is part of the paid plan. Everything you have logged is untouched, and any coach already linked to you stays linked.": "코치와 함께하는 기능은 유료 플랜에 포함돼요 — 공동 목표, 코치가 내주는 연습 드릴, 서로 주고받는 메모까지요. 지금까지 기록한 내용은 그대로 남고, 이미 연결된 코치와의 연결도 유지돼요.",
"Your bowlers": "내 볼러",
"Everyone at a glance — what they're working on, how far along, and when you next see them.": "모두 한눈에 — 무엇을 연습 중인지, 얼마나 진행됐는지, 다음 레슨은 언제인지.",
"+ Add a bowler": "+ 볼러 추가",
"no session set": "다음 레슨 미정",
"Nothing assigned yet.": "아직 배정된 과제가 없어요.",
"— no result logged yet.": "— 아직 기록된 결과가 없어요.",
"Bowls": "다음 리그:",
"on": "·",
"View": "보기",
"I'm bowling": "볼러 모드",
"I'm coaching": "코치 모드",
"Showing the bowlers you coach.": "코칭하는 볼러를 보여 주고 있어요.",
"Showing your own game. Switch to see the people you coach.": "내 게임을 보여 주고 있어요. 전환하면 코칭하는 볼러를 볼 수 있어요.",
"Requests": "요청",
"Someone wants to connect.": "연결 요청이 왔어요.",
"wants to be your": "님의 연결 요청 — 역할:",
"Accept": "수락",
"Waiting On Them": "상대방 응답 대기 중",
"— asked to be your": "— 요청한 역할:",
"Nobody yet. Make a code and read it to them — they enter it on their own phone, and from then on you'll see their sessions, set tasks and track progress here.": "아직 아무도 없어요. 코드를 만들어 상대에게 불러 주세요 — 상대가 자기 휴대폰에서 코드를 입력하면, 그때부터 여기서 그 볼러의 세션을 보고, 과제를 주고, 실력 향상을 추적할 수 있어요.",
"Your Bowlers": "내 볼러",
"Your Coaches": "내 코치",
"Nobody connected yet.": "아직 연결된 사람이 없어요.",
"Connect with someone": "다른 사람과 연결하기",
"Read this to the bowler you're coaching.": "코칭할 볼러에게 이 코드를 불러 주세요.",
"Read this to your coach.": "코치에게 이 코드를 불러 주세요.",
"Works once, for the next 7 days.": "한 번만 쓸 수 있고, 7일 동안 유효해요.",
"They coach me": "상대가 코치",
"I coach them": "내가 코치",
"Create a code": "코드 만들기",
"They enter it on their own phone and you": "상대가 자기 휴대폰에서 입력하면",
"re connected — no searching for each other by name.": "바로 연결돼요 — 서로 이름으로 찾을 필요가 없어요.",
"Got a code?": "코드가 있나요?",
"ABCD-2345": "ABCD-2345",
"Coaching code": "코칭 코드",
"Connect": "연결",
"Connected. They": "연결됐어요.",
"re in the list above.": "위 목록에 표시돼요.",
"Pick something to work on": "연습할 항목 선택",
"Set this goal": "이 목표 설정하기",
"They'll see it on their Improve tab in bowling terms, and it tracks itself as they bowl.": "그 볼러는 ‘향상’ 탭에서 볼링 용어로 목표를 확인하고, 볼링을 칠 때마다 진행 상황이 자동으로 추적돼요.",
"Clear": "지우기",
"Where and when, e.g. 6pm lanes 9-10 at Sunset": "장소와 시간 (예: 오후 6시, Sunset 9-10번 레인)",
"Shows on your roster above. Leave it blank if you work session to session.": "위의 ‘내 볼러’ 목록에 표시돼요. 레슨 일정을 그때그때 정한다면 비워 두세요.",
"Nothing bowled yet. Their scores appear here once they save a session.": "아직 투구 기록이 없어요. 세션을 저장하면 여기에 점수가 표시돼요.",
"Average": "에버리지",
"High": "최고",
"Nights": "볼링 횟수",
"From": "집계 대상:",
"shots": "투구",
"Strike": "스트라이크",
"Spare": "스페어",
"Single Pin": "싱글 핀",
"Split": "스플릿",
"Misses:": "미스:",
"Recent": "최근",
"+ Assign a task": "+ 과제 주기",
"No tasks yet — set one above and it'll show in their inbox.": "아직 과제가 없어요 — 위에서 과제를 만들면 볼러의 알림함에 표시돼요.",
"Done & Attempted": "완료 및 시도",
"Notes": "메모",
"Both of you can read and write here.": "두 사람 모두 여기서 읽고 쓸 수 있어요.",
"End coaching relationship": "코칭 관계 종료",
"Plastic": "플라스틱",
"Just Bowling": "자유 게임",
"Imported": "가져온 기록",
"Ion Max Solid": "Ion Max Solid",
"Ion Max Pearl": "Ion Max Pearl",
"Phaze II Solid": "Phaze II Solid",
"Phaze II Pearl": "Phaze II Pearl",
"Harsh Reality Pearl": "Harsh Reality Pearl",
"Road Warrior Pearl": "Road Warrior Pearl",
"Equinox Pearl": "Equinox Pearl",
"Box": "출고 상태",
"Polish": "폴리시",
"Lane Shine": "레인 샤인",
"Weak 7": "위크 세븐",
"Ringing 7": "링잉 세븐",
"Half Pocket": "하프 포켓",
"Trip 4": "4번 트립",
"Kick 10": "10번 킥",
"Acceptable": "무난",
"Fast": "빠름",
"Slow": "느림",
"Too early": "훅이 너무 빠름",
"Too late": "훅이 너무 늦음",
"Too round": "반응이 너무 완만함",
"Too sharp": "반응이 너무 급격함",
"Roll out": "롤아웃",
"Poor carry": "캐리 부족",
"No miss room": "미스 여유 없음",
"Lane transition": "레인 트랜지션",
"Surface worn": "표면 마모",
"Perfect game": "퍼펙트 게임",
"300. Nothing left to take off it.": "300. 더할 나위 없어요.",
"Honor series": "아너 시리즈",
"New personal best game": "개인 하이 게임 경신",
"New personal best series": "개인 하이 시리즈 경신",
"Won it": "우승",
"Top five": "톱 5",
"Cashed": "상금권 입상",
"Made the cut": "컷 통과",
"Didn't cash": "상금권 밖",
"strike rate": "스트라이크율",
"spare conversion": "스페어 처리율",
"ten pin conversion": "10번 핀 처리율",
"split conversion": "스플릿 처리율",
"single-pin conversion": "싱글 핀 스페어 처리율",
"corner-pin conversion": "코너 핀 처리율",
"open frames per game": "게임당 오픈 프레임 수",
"average by game": "게임 순서별 에버리지",
"score spread": "점수 편차",
"most common leave": "가장 자주 남는 핀",
"Nothing in that link.": "링크에 아무것도 없어요.",
"that night": "그날 기록은",
"No limit": "제한 없음",
"Official": "공식",
"Unconfirmed": "미확인",
"Community approved": "커뮤니티 승인",
"Verified": "검증됨",
"Disputed": "이의 제기됨",
"Manufacturer specifications.": "제조사 스펙.",
"Reported as incorrect. These specs have been removed.": "잘못된 정보로 신고되어 이 스펙은 삭제됐어요.",
"Entered by another bowler and not yet confirmed. Check before trusting it.": "다른 볼러가 입력했고 아직 확인되지 않았어요. 참고하기 전에 확인해 주세요.",
"Fresh": "초반",
"Transition": "중반",
"Late": "후반",
"Strong - Smooth": "강함 - 스무스",
"Strong - Sharp": "강함 - 샤프",
"Benchmark - Smooth": "벤치마크 - 스무스",
"Benchmark - Sharp": "벤치마크 - 샤프",
"Weak - Smooth": "약함 - 스무스",
"Weak - Sharp": "약함 - 샤프",
"Urethane": "우레탄",
"Solid": "솔리드",
"Pearl": "펄",
"Hybrid": "하이브리드",
"Symmetric": "대칭",
"Asymmetric": "비대칭",
"All Balls": "전체 볼",
"Not specified": "미지정",
"Compare yourself with a teammate. Log a night with more than one bowler.": "팀원과 나를 비교해 보세요. 볼러 2명 이상이 함께한 날을 기록해 주세요.",
"Your team's best games and series. Needs team-mates with logged scores.": "팀의 하이 게임과 하이 시리즈예요. 점수를 기록한 팀원이 필요해요.",
"Your high game and high series. Fills in once you have a game logged.": "내 하이 게임과 하이 시리즈예요. 게임을 하나 기록하면 표시돼요.",
"Win-loss record. Record match results on a league night.": "승패 기록이에요. 리그 날에 경기 결과를 기록해 주세요.",
"Points won each week. Record match results on a league night.": "매주 얻은 포인트예요. 리그 날에 경기 결과를 기록해 주세요.",
"How handicap changes results. Set a book average for the roster.": "핸디캡이 결과를 어떻게 바꾸는지 보여줘요. 팀원 명단에 공인 에버리지를 설정해 주세요.",
"Team averages ranked. Add bowlers to your team.": "팀 에버리지 순위예요. 팀에 볼러를 추가해 주세요.",
"Wins against higher-average teams. Record match results.": "에버리지가 더 높은 팀을 상대로 거둔 승리예요. 경기 결과를 기록해 주세요.",
"Games decided by a handful of pins. Record match results.": "팀원이 모두 스트라이크를 친 프레임에서 혼자만 놓친 횟수예요. 팀원들의 투구를 기록해 주세요.",
"Team totals by night. Needs team-mates with logged scores.": "날짜별 팀 합계예요. 점수를 기록한 팀원이 필요해요.",
"Averages by house. Bowl at more than one center.": "볼링장별 에버리지예요. 두 곳 이상의 볼링장에서 게임해 보세요.",
"Strike percentage by part of the night, ball against ball. Log which ball you threw on each shot.": "초반·중반·후반별 스트라이크율을 볼끼리 비교해요. 투구마다 어떤 볼을 던졌는지 기록해 주세요.",
"Your line, drawn on the lane. Log start board and arrows on your shots.": "레인 위에 그린 내 라인이에요. 투구할 때 시작 보드와 스팟을 기록해 주세요.",
"Each ball's numbers. Log which ball you threw on each shot.": "볼별 수치예요. 투구마다 어떤 볼을 던졌는지 기록해 주세요.",
"What makes you switch balls. Record a ball-change reason.": "볼을 바꾸게 되는 이유예요. 볼 교체 이유를 기록해 주세요.",
"Frames without an open. Log a full night frame by frame.": "오픈이 아닌 프레임이에요. 하루 게임 전체를 프레임별로 기록해 주세요.",
"How you bowl early against late in a game. Log shots by frame.": "게임 초반과 후반의 투구를 비교해요. 프레임별로 투구를 기록해 주세요.",
"Pins on the first ball. Log shots frame by frame.": "첫 투구에 쓰러뜨린 핀 수예요. 프레임별로 투구를 기록해 주세요.",
"How often the corner pin stands. Log your leaves.": "코너 핀이 남는 빈도예요. 남은 핀을 기록해 주세요.",
"Single-pin conversion. Log your leaves and whether you made them.": "싱글 핀 스페어 처리율이에요. 남은 핀과 처리 여부를 기록해 주세요.",
"Splits and conversions. Log your leaves.": "스플릿과 처리율이에요. 남은 핀을 기록해 주세요.",
"Who missed the lone 5. Log your leaves.": "홀로 남은 5번 핀을 놓친 사람은? 남은 핀을 기록해 주세요.",
"Makeable leaves you missed. Log your leaves.": "처리할 수 있었는데 놓친 남은 핀이에요. 남은 핀을 기록해 주세요.",
"Longest run of strikes. Log a full night frame by frame.": "최장 연속 스트라이크예요. 하루 게임 전체를 프레임별로 기록해 주세요.",
"Where your misses go. Record a miss direction on bad shots.": "미스가 어느 쪽으로 빠지는지 보여 줘요. 실투에는 빗나간 방향을 기록해 주세요.",
"How your release holds up. Record release quality on your shots.": "릴리스가 얼마나 안정적인지 보여 줘요. 투구마다 릴리스 품질을 기록해 주세요.",
"Flush against lucky strikes. Record how each strike carried.": "정확한 포켓 스트라이크와 운 좋은 스트라이크를 비교해요. 스트라이크마다 핀이 어떻게 쓰러졌는지 기록해 주세요.",
"Your average as it moves. Log a few more nights.": "에버리지의 변화 추이예요. 몇 번 더 기록해 주세요.",
"What you would average with every spare. Log your leaves.": "스페어를 모두 처리했다면 나왔을 에버리지예요. 남은 핀을 기록해 주세요.",
"Where you are heading. Log a few more nights.": "앞으로의 흐름을 보여 줘요. 몇 번 더 기록해 주세요.",
"How much your scores swing. Log a few more nights.": "점수가 얼마나 들쭉날쭉한지 보여 줘요. 몇 번 더 기록해 주세요.",
"The shape of your scores. Log a few more nights.": "점수의 분포예요. 몇 번 더 기록해 주세요.",
"This season against last. Finish a season, then start another.": "이번 시즌과 지난 시즌을 비교해요. 한 시즌을 마친 뒤 새 시즌을 시작해 주세요.",
"First, second and third game. Log a few full nights.": "첫 번째, 두 번째, 세 번째 게임을 비교해요. 그날의 게임을 빠짐없이 기록한 날이 몇 번 필요해요.",
"What you won and paid in. Turn on side games and record a night.": "획득 상금과 낸 참가비예요. 사이드 게임을 켜고 볼링을 한 번 기록해 주세요.",
"3-6-9 and jackpot. Turn on side games and record a night.": "3-6-9와 잭팟이에요. 사이드 게임을 켜고 볼링을 한 번 기록해 주세요.",
"Your season at a glance. Log a night.": "시즌을 한눈에 볼 수 있어요. 볼링을 한 번 기록해 주세요.",
"First night": "첫날",
"Bowled a night with the group.": "일행과 함께 하루 볼링을 쳤어요.",
"Regular": "단골",
"Five nights in.": "볼링 5회째.",
"Fixture": "붙박이",
"Fifteen nights. You live here now.": "15회째. 이제 여기 주민이에요.",
"Marathon": "마라톤",
"Six games in one night.": "하루에 6게임.",
"Triple figures": "세 자릿수",
"Broke 100.": "100점 돌파.",
"One fifty": "150",
"Broke 150.": "150점 돌파.",
"Two hundred": "200",
"Broke 200. That's a real game.": "200점 돌파. 이 정도면 진짜 게임이죠.",
"Five hundred": "500",
"A 500 series across three games.": "3게임 합계 500점 시리즈.",
"Night winner": "그날의 승자",
"Won a night outright.": "동점 없이 그날 단독 1위를 했어요.",
"Repeat champion": "우승 상습범",
"Won three nights.": "그날의 승자가 3번 됐어요.",
"Clean sweep": "싹쓸이",
"Won every game in a night.": "하루 동안 모든 게임에서 이겼어요.",
"Giant killer": "자이언트 킬링",
"Beat someone averaging 30 more than you.": "나보다 에버리지가 30 이상 높은 상대를 이겼어요.",
"Comeback": "반등",
"Improved 40 pins between games in a night.": "같은 날 게임 사이에 점수를 40핀 끌어올렸어요.",
"Metronome": "메트로놈",
"Three games within 10 pins of each other.": "3게임의 점수 차가 모두 10핀 이내.",
"New best": "개인 신기록",
"Beat your own high game.": "내 하이 게임을 경신했어요.",
"Climbing": "상승세",
"Your average went up over five nights.": "볼링 5회에 걸쳐 에버리지가 올랐어요.",
"Rough night": "안 풀리는 날",
"Everyone has one. Under 70.": "누구에게나 있어요. 70점 미만.",
"Photo finish": "간발의 차",
"Won or lost a night by a single pin.": "단 1핀 차로 그날의 승부가 갈렸어요.",
"Wooden spoon": "꼴찌상",
"Finished last. Someone has to.": "꼴찌로 마쳤어요. 누군가는 해야죠.",
"Back to back": "백투백",
"Two 150+ games in a row.": "2게임 연속 150점 이상.",
"Rollercoaster": "롤러코스터",
"100 pins between your best and worst game in one night.": "하루 중 최고 게임과 최저 게임의 차이가 100핀.",
"Scorekeeper": "기록원",
"Kept score for four or more people.": "4명 이상의 점수를 기록했어요.",
"Pins set by machine, fall freely.": "기계가 핀을 세우고, 핀이 자유롭게 쓰러져요.",
"Pins on strings, pulled back up.": "핀에 줄이 달려 있어 다시 끌어올려져요.",
"Mixed house": "혼합형 볼링장",
"Some lanes string, some free fall.": "일부 레인은 스트링, 일부 레인은 프리폴이에요.",
"7 Pin": "7번 핀",
"10 Pin": "10번 핀",
"Bowled your first league night.": "첫 리그 날 경기를 치렀어요.",
"Old guard": "고참",
"Three full seasons in the same league.": "같은 리그에서 3시즌을 완주했어요.",
"Sub covered": "구원 등판",
"Bowled as a sub for another team.": "다른 팀의 대체 선수로 뛰었어요.",
"New high game": "하이 게임 경신",
"New high series": "하이 시리즈 경신",
"Beat your own high series.": "내 하이 시리즈를 경신했어요.",
"Book buster": "공인 에버 격파",
"A game 40+ pins over your book average.": "공인 에버리지보다 40핀 이상 높은 게임.",
"In the pocket": "정조준",
"Three games in a night within 5 pins of your average.": "하루 3게임 모두 에버리지와의 차이가 5핀 이내.",
"Heater": "핫핸드",
"Three straight games above your average.": "3게임 연속 에버리지 초과.",
"Cold night, warm finish": "뒷심 발휘",
"Opened below average, closed above it.": "에버리지보다 낮게 시작해서 에버리지보다 높게 마무리했어요.",
"Raised book average": "공인 에버리지 상승",
"Your average is 5+ pins above last season's book.": "에버리지가 지난 시즌 공인 에버리지보다 5핀 이상 높아요.",
"Clean": "클린",
"No open frames all night.": "하루 내내 오픈 프레임 없음.",
"Sharp shooter": "명사수",
"Converted three or more splits in a night.": "하루에 스플릿을 3개 이상 처리했어요.",
"Carried it": "일등 공신",
"Your score was the difference in a match your team won.": "팀이 이긴 경기에서 내 점수가 승부를 갈랐어요.",
"Held the line": "최후의 보루",
"Bowled above your average in a match your team lost.": "팀이 진 경기에서 에버리지보다 높은 점수를 냈어요.",
"Team high game": "팀 하이 게임",
"Set your team's high game for the night.": "그날 팀 하이 게임을 기록했어요.",
"Team high series": "팀 하이 시리즈",
"Set your team's high series for the night.": "그날 팀 하이 시리즈를 기록했어요.",
"Executioner": "사형 집행인",
"Helped hang a teammate 30 times.": "팀원 한 명만 스트라이크를 놓친 프레임에서 30번 스트라이크를 쳤어요.",
"Won a side game.": "사이드 게임에서 이겼어요.",
"Money bags": "돈방석",
"$100 won in side games, all-time.": "사이드 게임에서 통산 $100 획득.",
"Locked in": "도장 쾅",
"Your book average was confirmed at season end.": "시즌이 끝나고 공인 에버리지가 확정됐어요.",
"Twelve strikes. The one you'll be telling people about.": "스트라이크 12개. 두고두고 이야기하게 될 게임이에요.",
"800 series": "800점 시리즈",
"An 800 series. USBC honor score.": "800점 시리즈. USBC 아너 스코어예요.",
"First tournament": "첫 대회",
"Logged your first tournament.": "첫 대회를 기록했어요.",
"Survived to the next round.": "살아남아 다음 라운드에 진출했어요.",
"Finished in the top five.": "5위 이내로 마쳤어요.",
"Won the whole thing": "정상 등극",
"First place.": "1위.",
"Ramping up": "상승 곡선",
"Three or more straight games, each higher than the last.": "3게임 이상 연속으로, 매 게임 직전 게임보다 높은 점수.",
"Strong finish": "유종의 미",
"Last game 50+ pins above the average of the rest.": "마지막 게임이 나머지 게임의 에버리지보다 50핀 이상 높았어요.",
"Cashed a side pot": "사이드 팟 획득",
"Won a side pot at an event.": "대회에서 사이드 팟을 따냈어요.",
"Squeaked in": "턱걸이",
"Made the cut by 10 pins or fewer.": "10핀 이하 차이로 컷을 통과했어요.",
"First drill": "첫 연습 드릴",
"Logged your first drill.": "첫 연습 드릴을 기록했어요.",
"Repeat customer": "단골손님",
"Same target, five separate sessions.": "같은 타깃으로 서로 다른 세션 5번.",
"Trending up": "오름세",
"Conversion rate rose across five weeks.": "5주에 걸쳐 처리율이 올랐어요.",
"Century": "100번 도전",
"100 attempts at one target.": "한 타깃에 100번 시도.",
"Graduated": "졸업",
"80%+ on a target, over at least 20 attempts.": "한 타깃에서 성공률 80% 이상 (최소 20번 시도).",
"Drilled two different targets in one session.": "한 세션에서 서로 다른 타깃 2개를 연습했어요.",
"Burned the midnight oil": "불철주야",
"A practice session of 50+ deliveries.": "연습 세션 한 번에 50구 이상.",
"That file is empty.": "파일이 비어 있어요.",
"game 1": "1게임",
"game 2": "2게임",
"game 3": "3게임",
"no scores on that row": "이 행에 점수가 없어요",
"a game is blank between two scores": "두 점수 사이에 빈 게임이 있어요",
"Nothing in that file could be imported.": "이 파일에서 가져올 수 있는 항목이 없어요.",
"4 Pin": "4번 핀",
"6 Pin": "6번 핀",
"2 Pin": "2번 핀",
"3 Pin": "3번 핀",
"3-6-10 (bucket-ish)": "3-6-10 (버킷에 가까움)",
"2-4-5 (bucket)": "2-4-5 (버킷)",
"Strike Ball (pocket hits)": "스트라이크 볼 (포켓 히트)",
"Pocket": "포켓",
"Custom": "사용자 지정",
"Failing row contains (*)": "",
"No errors recorded.": "",
"Couldn't connect. Check your signal and try again.": "연결할 수 없어요. 신호 상태를 확인하고 다시 시도해 주세요.",
"Your sign-in has expired. Sign out and back in, then try again.": "로그인이 만료됐어요. 로그아웃했다가 다시 로그인한 뒤 다시 시도해 주세요.",
"Something went wrong. Try again in a few minutes.": "문제가 발생했어요. 몇 분 후에 다시 시도해 주세요.",
"Why do I keep leaving the 10?": "왜 자꾸 10번 핀이 남을까요?",
"Which ball carries best for me?": "어떤 볼이 캐리가 제일 잘 돼요?",
"Do I fade late in a set?": "시리즈 후반에 점수가 떨어지나요?",
"Back tomorrow": "내일 다시 만나요",
"Games logged": "",
"Strike percentage": "",
"Spare percentage": "",
"Single-pin spare percentage": "",
"Split conversion percentage": "",
"Open frames per game": "게임당 오픈 프레임",
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
"Most common leave": "가장 자주 남는 핀",
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
"Your running average across all games in the current view.": "현재 보기에 있는 모든 게임의 누적 에버리지.",
"Your best single game.": "한 게임 최고 점수.",
"Your best series total.": "시리즈 합계 최고 점수.",
"Share of first balls that strike.": "첫 투구가 스트라이크로 이어진 비율.",
"spare attempts": "스페어 기회",
"Non-split spare conversion.": "스플릿을 제외한 스페어 처리율.",
"Single Pin Spare %": "싱글 핀 스페어 처리율",
"single-pin attempts": "싱글 핀 기회",
"Conversion on leaves of exactly one pin.": "정확히 핀 하나만 남았을 때의 스페어 처리율.",
"10 Pin Spare %": "10번 핀 스페어 처리율",
"10 pin attempts": "10번 핀 기회",
"Conversion on a lone corner pin (including weak and ringing ones).": "코너 핀 하나만 남았을 때의 스페어 처리율(위크·링잉 포함).",
"Frames closed with a strike or a spare.": "스트라이크나 스페어로 마무리한 프레임.",
"7 pin": "7번 핀",
"single-pin spares": "싱글 핀 스페어",
"keep clean": "클린 유지",
"to collect, and they're not all about bowling well:": "개의 배지를 모을 수 있어요. 모두 볼링을 잘해야 받는 배지는 아니에요:",
"Start a session": "기록 시작하기",
"new night": "새 기록",
"league night": "리그 날",
"On the Bowl tab, pick where you're bowling — practice, league, tournament or just bowling. For league, choose which league and the date. The app remembers your usual night, so on a regular Tuesday it sets itself up.": "‘투구’ 탭에서 무엇을 치는지 고르세요 — 연습, 리그, 대회, 자유 게임. 리그라면 어느 리그인지와 날짜를 선택해요. 앱이 평소 리그 요일을 기억하니까, 평소 같은 화요일이면 알아서 설정돼요.",
"Frame tracking vs game tracking": "프레임별 기록과 게임별 기록",
"Frame tracking records every ball — pins left, ball used, release. That's what powers spare stats, the scoresheet and ball comparisons. Scores only takes three numbers a night. You can switch any time, and start a night one way and finish the other: unlock the score boxes to type totals even mid-game.": "프레임별 기록은 투구 하나하나를 기록해요 — 남은 핀, 사용한 볼, 릴리스. 스페어 통계, 점수표, 볼 비교가 모두 이 데이터로 만들어져요. ‘점수만’은 하루에 숫자 세 개만 입력하면 돼요. 언제든 바꿀 수 있고, 한 방식으로 시작해서 다른 방식으로 끝낼 수도 있어요. 점수 칸의 잠금을 풀면 게임 도중에도 합계를 입력할 수 있어요.",
"The ten-frame scoresheet": "10프레임 점수표",
"edit frame": "프레임 수정",
"running score": "누적 점수",
"On frame tracking, the ten frames sit between the frame picker and the result buttons. It fills in as you bowl. Tap any frame to edit it. Tapping an empty frame while editing cancels the edit; tapping the next frame when your shot is complete saves it.": "프레임별 기록에서는 프레임 선택과 결과 버튼 사이에 10프레임이 표시되고, 투구할수록 채워져요. 프레임을 누르면 수정할 수 있어요. 수정 중에 빈 프레임을 누르면 수정이 취소되고, 투구 입력을 마친 뒤 다음 프레임을 누르면 저장돼요.",
"Delete a shot": "투구 삭제하기",
"wrong frame": "프레임 잘못 입력",
"Tap the frame on the scoresheet to open it, then either press Delete this shot, or deselect the result — clearing what happened deletes the frame. Both ask you to confirm, because it can't be undone.": "점수표에서 프레임을 눌러 연 다음, ‘삭제’를 누르거나 결과 선택을 해제하세요 — 결과를 지우면 그 프레임이 삭제돼요. 되돌릴 수 없으니 두 경우 모두 확인을 요청해요.",
"Prebowl for a future week": "이후 주차 사전 투구하기",
"miss next week": "다음 주 불참",
"Bowling next week's league games early? Turn on Prebowling in Tonight's Session. The games are filed under the date they count for, not the day you threw them — so you can prebowl and bowl tonight's league on the same night without one overwriting the other.": "다음 주 리그 게임을 미리 치나요? ‘오늘의 리그’에서 ‘사전 투구’를 켜세요. 게임은 실제로 친 날이 아니라 점수가 반영되는 날짜로 저장돼요 — 그래서 같은 날 사전 투구와 오늘 리그를 모두 쳐도 서로 덮어쓰지 않아요.",
"Side games and buy-ins": "사이드 게임과 참가비",
"side pot": "사이드 팟",
"high game": "하이 게임",
"buy in": "참가비",
"money games": "상금 게임",
"Buy-ins are saved per league — enter them once and they apply every week. Each night, tap the pots you're actually in; sitting one out costs you nothing. Hide pots your house doesn't run in Settings.": "참가비는 리그별로 저장돼요 — 한 번 입력하면 매주 적용돼요. 리그 날마다 실제로 참가하는 팟만 누르세요. 빠진 팟은 비용이 들지 않아요. 다니는 볼링장에서 운영하지 않는 팟은 ‘설정’에서 숨길 수 있어요.",
"Import a scorecard photo": "점수표 사진 가져오기",
"Press Import in the header. Say whether it's practice, league or a tournament, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving.": "상단의 ‘가져오기’를 누르세요. 연습, 리그, 대회 중 무엇인지 고르고 팀과 날짜를 선택한 다음, 점수 모니터 사진을 추가하세요. 앱이 게임과 프레임을 읽어 들이면, 저장하기 전에 각 열을 해당 볼러에게 연결하면 돼요.",
"Send teammates their scores": "팀원에게 점수 보내기",
"share scores": "점수 공유",
"frame data": "프레임 데이터",
"Any column you map to a teammate is sent to them to confirm. They get the frame-by-frame data too, not just totals — once they accept, it lands in their shot history marked as imported.": "팀원에게 지정한 열은 확인을 위해 그 팀원에게 전송돼요. 합계뿐 아니라 프레임별 데이터도 함께 가요 — 팀원이 수락하면 가져온 기록으로 표시되어 투구 기록에 추가돼요.",
"Compare yourself to someone": "다른 볼러와 비교하기",
"head to head": "맞대결",
"team average": "팀 에버리지",
"On the Stats tab, use Compare To. You can compare against a bowler on your device, a friend, or your team's average. Teammates are added as friends automatically, so they're there without sending a request.": "‘통계’ 탭에서 ‘비교 대상’을 사용하세요. 이 기기에 등록된 볼러, 친구, 또는 팀 에버리지와 비교할 수 있어요. 팀원은 자동으로 친구로 추가되니까 요청을 보내지 않아도 목록에 있어요.",
"Trends over time": "시간에 따른 추이",
"over time": "추이",
"per ball": "볼별",
"Switch to Trends on the Stats tab to see a metric plotted over time. Filter by ball to see how one piece of equipment is performing — that works on game scores too, if you record which ball bowled which game.": "‘통계’ 탭에서 ‘추이’로 바꾸면 지표의 변화를 그래프로 볼 수 있어요. 볼로 필터링하면 볼 하나의 성능을 확인할 수 있어요 — 어떤 게임을 어떤 볼로 쳤는지 기록해 두면 게임 점수에서도 쓸 수 있어요.",
"Set a goal": "목표 설정하기",
"On the Improve tab, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "‘향상’ 탭에서 ‘목표 추가’를 누르고 연습할 항목을 고르세요 — 에버리지, 스트라이크율, 스페어 처리율 등. 볼링을 치는 동안 진행 상황이 업데이트돼요.",
"Practice drills": "연습 드릴",
"spare shooting": "스페어 연습",
"Start a drill from the Improve tab. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "‘향상’ 탭에서 연습 드릴을 시작하세요. 특정 스페어나 핀 조합 같은 목표를 고르면 그 세션의 성공과 실패를 앱이 기록해요.",
"A coach sees every bowler they work with on one roster: what each is working on, how far along, and when the next session is. Tasks are set per bowler, and the bowler sees them on their Improve tab.": "코치는 지도하는 모든 볼러를 한 명단에서 볼 수 있어요. 각자 무엇을 연습하고 있는지, 얼마나 진행됐는지, 다음 레슨이 언제인지 알 수 있어요. 과제는 볼러마다 따로 정하고, 볼러는 자기 ‘향상’ 탭에서 확인해요.",
"add league": "리그 추가",
"On the Setup tab, under League, add a league with its name, center and season dates. Season dates let the app prompt you to update your book average when the season ends.": "‘준비’ 탭의 ‘리그’에서 이름, 볼링장, 시즌 기간을 입력해 리그를 추가하세요. 시즌 기간을 입력해 두면 시즌이 끝날 때 공인 에버리지를 업데이트하라고 앱이 알려 줘요.",
"Add a team and its roster": "팀과 팀원 명단 추가하기",
"not signed up": "미가입",
"hasn't joined": "팀 미가입",
"email required": "이메일 필수",
"bowling order": "투구 순서",
"add a teammate": "팀원 추가",
"Teams live under their league on the Setup tab — add a league under League, then add your team under Team. Open the team to set the bowling order and add each teammate by name and email. The email is required: it's what connects them to their spot when they sign up. Teammates who haven't joined yet still work — you can log their scores straight away, and everything you've recorded is waiting for them when they accept the invite.": "팀은 ‘준비’ 탭에서 각 리그 아래에 있어요 — ‘리그’에서 리그를 추가한 다음 ‘팀’에서 팀을 추가하세요. 팀을 열어 투구 순서를 정하고, 팀원을 이름과 이메일로 한 명씩 추가하세요. 이메일은 필수예요. 팀원이 가입할 때 자기 자리와 연결해 주는 역할을 해요. 아직 가입하지 않은 팀원도 문제없어요 — 바로 점수를 기록할 수 있고, 기록한 내용은 팀원이 초대를 수락하면 모두 그대로 넘겨받아요.",
"Your ball arsenal": "내 보유 볼",
"Add your balls on the Setup tab, under Balls, with layout and surface. Balls you log shots with feed the per-ball stats and the trend filters. Bags, the next tab over, let you group what you actually carry.": "‘준비’ 탭의 ‘볼’에서 레이아웃과 표면을 입력해 볼을 추가하세요. 투구를 기록할 때 쓴 볼은 볼별 통계와 추세 필터에 반영돼요. 바로 옆 탭인 ‘가방’에서는 실제로 들고 다니는 볼을 묶어 둘 수 있어요.",
"add friend": "친구 추가",
"Search for someone by name and send a request. Teammates are added automatically. Friends can compare stats with each other. There's also a QR code here for handing someone the app link.": "이름으로 검색해서 친구 요청을 보내세요. 팀원은 자동으로 추가돼요. 친구끼리는 서로 통계를 비교할 수 있어요. 앱 링크를 전해 줄 수 있는 QR 코드도 여기 있어요.",
"Your name and profile": "이름과 프로필",
"two handed": "투핸드",
"book average": "공인 에버리지",
"Set your display name — that's what teammates see. Also here: handedness, book average, home centers, and scorecard names, which are the other spellings of your name that appear on a printed scorecard so imports match you correctly.": "표시 이름을 설정하세요 — 팀원에게 보이는 이름이에요. 여기서 투구 손, 공인 에버리지, 자주 가는 볼링장, 점수표 이름도 설정할 수 있어요. 점수표 이름은 인쇄된 점수표에 나오는 내 이름의 다른 표기로, 가져오기할 때 나를 정확히 찾게 해 줘요.",
"Your history": "내 기록",
"Every night you've bowled and every shot you've logged. Filter by team or result. You only see your own — teammates keep theirs.": "지금까지 볼링을 친 모든 날과 기록한 모든 투구예요. 팀이나 결과로 필터링할 수 있어요. 내 기록만 보여요 — 팀원의 기록은 각자 따로 관리돼요.",
"Honor scores, personal bests and badges": "아너 스코어, 개인 최고 기록, 배지",
"perfect game": "퍼펙트 게임",
"honor score": "아너 스코어",
"personal best": "개인 최고 기록",
"high series": "하이 시리즈",
"A 300 game or an 800 series is called out automatically. So is beating your own best game or series — set your all-time bests in your profile so it has something to beat from day one. At a tournament you can record how you finished, and a win gets its own badge. All of them can be shared.": "300점 게임이나 800점 시리즈는 자동으로 표시돼요. 자기 최고 게임이나 시리즈 기록을 넘어설 때도 마찬가지예요 — 프로필에 역대 최고 기록을 설정해 두면 첫날부터 넘어설 기록이 생겨요. 대회에서는 최종 순위를 기록할 수 있고, 우승하면 전용 배지를 받아요. 모두 공유할 수 있어요.",
"Adding a teammate without their email": "이메일 없이 팀원 추가하기",
"signup code": "가입 코드",
"team code": "팀 코드",
"invite code": "초대 코드",
"no email": "이메일 없음",
"don't have their email": "이메일 모름",
"text them": "문자 보내기",
"When you add a teammate, tick \"I don't have their email\" and you'll get a short code to text them. They enter it when they sign up and land straight on that roster spot, with everything you've already logged under their name.": "팀원을 추가할 때 ‘문자로 코드 보내기’를 선택하면 문자로 보낼 짧은 코드가 나와요. 팀원이 가입할 때 이 코드를 입력하면 바로 그 명단 자리에 들어가고, 이미 그 이름으로 기록한 내용도 모두 이어받아요.",
"Split conversion by type": "스플릿 종류별 처리율",
"baby split": "베이비 스플릿",
"big four": "빅포",
"greek church": "그릭 처치",
"which splits": "스플릿 종류",
"Splits are broken out by type, not lumped into one number — the 4-7-10 and the 3-10 are different problems. The Stats tab shows how often you leave each one and how often you convert it, with the well-known ones named.": "스플릿은 숫자 하나로 뭉뚱그리지 않고 종류별로 나눠서 집계해요 — 4-7-10과 3-10은 전혀 다른 문제니까요. ‘통계’ 탭에서 스플릿마다 얼마나 자주 남기고 얼마나 자주 처리하는지 볼 수 있고, 잘 알려진 스플릿에는 이름도 붙어 있어요.",
"Changing how the app looks": "앱 테마 바꾸기",
"App appearance in Settings. Glow is the default — rock'n'bowl green on warm black — and there are several others if you'd rather something calmer.": "‘설정’의 ‘앱 테마’에서 바꿀 수 있어요. 기본은 ‘글로우’ — 따뜻한 검은색 바탕에 락볼링 느낌의 초록색 — 이고, 좀 더 차분한 게 좋다면 다른 테마도 여러 가지 있어요.",
"Recording how a tournament finished": "대회 최종 결과 기록하기",
"made the cut": "컷 통과",
"runner up": "준우승",
"how did i do": "몇 위",
"At the end of a tournament, say how it finished — won it, runner-up, top five, cashed, or made the cut. The app can't work this out from your scores, since it doesn't know what anyone else shot. A win becomes a badge you can share.": "대회가 끝나면 최종 결과를 기록해 주세요 — 우승, 준우승, 5위 이내, 상금권 입상, 컷 통과. 앱은 다른 사람의 점수를 모르기 때문에 내 점수만으로는 결과를 알 수 없어요. 우승하면 공유할 수 있는 배지가 생겨요.",
"who won": "승자",
"just bowling": "자유 게임",
"who's best": "누가 1등",
"Everyone you've added to an Open bowling scoresheet turns up in the Standings, ordered by average, with how many games they've bowled, their best single game, and the badges they've earned. It builds up over time, so the more nights you log the more there is to argue about.": "자유 게임 점수표에 추가한 사람은 모두 ‘순위표’에 에버리지 순으로 표시되고, 친 게임 수, 한 게임 최고 점수, 획득한 배지도 함께 나와요. 기록은 시간이 지날수록 쌓이니까, 기록한 날이 많아질수록 따질 거리도 많아져요.",
"Where did everything go?": "다 어디로 사라졌나요?",
"where is": "어디 있나요",
"no stats": "통계 없음",
"no history": "기록 없음",
"tabs missing": "탭 사라짐",
"wrong mode": "모드 잘못 선택",
"went back": "원래대로",
"If you picked Open bowling, the app hides everything that mode doesn't use — History, Stats, Improve and Gear. Nothing is deleted; it's all still there. Go to the Bowl tab, find the card at the top showing what you're bowling, tap Change, and pick Practice, League or Tournament. Everything comes straight back.": "자유 게임을 선택하면 앱이 그 모드에서 쓰지 않는 것을 숨겨요 — ‘기록’, ‘통계’, ‘향상’, ‘장비’. 삭제된 건 없어요. 전부 그대로 있어요. ‘투구’ 탭에서 맨 위에 지금 무엇을 치는지 보여 주는 카드를 찾아 ‘변경’을 누르고, ‘연습’, ‘리그’, ‘대회’ 중 하나를 고르세요. 모든 게 바로 다시 나타나요.",
"Entering scores for the group": "그룹 점수 입력하기",
"add someone": "사람 추가",
"who's bowling": "기록할 볼러",
"Names down the side, games across the top. Tap a cell and type the final score for that game — totals add themselves. Add whoever's on the lane with the box underneath and they become a row; they don't need the app or an account. Bowl more than a few games and the scores slide across while the names stay put.": "이름은 세로로, 게임은 가로로 놓여요. 칸을 누르고 그 게임의 최종 점수를 입력하면 합계는 자동으로 계산돼요. 레인에 있는 사람을 아래 입력란으로 추가하면 그 사람의 줄이 생겨요. 앱이나 계정은 없어도 돼요. 게임 수가 많아지면 이름은 그대로 두고 점수만 옆으로 넘어가요.",
"The badges you can earn": "획득할 수 있는 배지",
"how do i get": "획득 방법",
"Tips: rolling a better ball": "팁: 더 잘 던지기",
"how to bowl": "볼링 치는 법",
"help me bowl": "볼링 잘 치는 법",
"new to bowling": "볼링 초보",
"Pick a ball you can hold comfortably — too heavy and you'll throw it with your arm instead of letting it swing. Aim at the arrows on the lane, not the pins: they're much closer, so they're far easier to hit consistently. Let your arm swing like a pendulum rather than pushing, and try to finish with your hand up where you were aiming. Most beginners improve more from rolling the same ball the same way twice than from anything else.": "편하게 들 수 있는 볼을 고르세요 — 너무 무거우면 스윙에 맡기지 못하고 팔 힘으로 던지게 돼요. 핀이 아니라 레인의 스팟을 겨냥하세요. 훨씬 가까워서 일정하게 맞히기가 훨씬 쉬워요. 밀어내지 말고 팔을 시계추처럼 흔들고, 마지막에는 겨냥한 쪽으로 손을 들어 올린 채 끝내 보세요. 초보자 대부분은 다른 무엇보다 같은 볼을 같은 방식으로 두 번 연속 던질 수 있게 될 때 가장 많이 늘어요.",
"Tips: picking up spares": "팁: 스페어 처리하기",
"corner pin": "코너 핀",
"second ball": "두 번째 투구",
"pick up": "남은 핀 처리",
"Spares are where casual scores are won. If pins are left on the right, move your feet LEFT and aim across the lane at them; if they're on the left, move right. It feels backwards and it works. For a single pin, aim at the arrow closest to it rather than staring at the pin. Converting even half your spares will do more for your score than any strike will.": "자유 게임에서 점수 차이는 스페어에서 나요. 오른쪽에 핀이 남으면 발을 왼쪽으로 옮기고 레인을 가로질러 핀을 겨냥하세요. 왼쪽에 남으면 오른쪽으로 옮기고요. 거꾸로인 것 같지만 효과가 있어요. 핀이 하나만 남았을 때는 핀을 쳐다보지 말고 그 핀에 가장 가까운 스팟을 겨냥하세요. 스페어를 절반만 처리해도 어떤 스트라이크보다 점수에 더 큰 도움이 돼요.",
"Tips: how scoring actually works": "팁: 점수 계산 제대로 알기",
"how does scoring work": "점수 계산 방법",
"what is a turkey": "터키란",
"Ten frames, two balls each. All ten pins on the first ball is a strike, and you get the next two balls added on top. Knocking them all down across both balls is a spare, and you get the next one ball added. That's why strikes are worth chasing — a good game is mostly about not leaving gaps rather than striking every frame. Three strikes in a row is a turkey. A perfect game is 300.": "10프레임이고, 프레임마다 2번 던져요. 첫 투구로 핀 10개를 모두 쓰러뜨리면 스트라이크이고, 다음 두 투구의 점수가 더해져요. 두 투구에 걸쳐 모두 쓰러뜨리면 스페어이고, 다음 한 투구의 점수가 더해져요. 그래서 스트라이크는 노려 볼 가치가 있어요 — 그래도 좋은 게임의 핵심은 매 프레임 스트라이크를 치는 것보다 오픈 프레임을 남기지 않는 거예요. 스트라이크 3번 연속은 터키, 퍼펙트 게임은 300점이에요.",
"Tips: making the night better": "팁: 더 즐거운 볼링 모임 만들기",
"night out": "볼링 모임",
"what to do": "뭘 하면 좋을까",
"first time": "처음",
"Bowl in the same order each game so it stays easy to follow. Ask for bumpers if anyone's small — nobody minds and it keeps everyone in it. Lighter balls are usually on the racks nearest the lanes. If someone's having a rough game, remember there's a badge for it. Rented shoes are meant to slide, so don't fight it on the approach.": "매 게임 같은 순서로 치면 따라가기 쉬워요. 어린아이가 있으면 범퍼를 요청하세요 — 아무도 신경 쓰지 않고, 모두가 함께 즐길 수 있어요. 가벼운 볼은 보통 레인에서 가장 가까운 랙에 있어요. 게임이 잘 안 풀리는 사람이 있다면, 그걸 위한 배지도 있다는 걸 기억하세요. 대여 볼링화는 원래 미끄러지도록 만들어졌으니 어프로치에서 억지로 버티지 마세요.",
"Syncing and offline use": "동기화와 오프라인 사용",
"Everything is saved on your phone first and uploaded when there's a connection, so you can log a whole night on bad alley wifi. If something can't upload, the app says so and keeps retrying — nothing is lost.": "모든 기록은 먼저 휴대폰에 저장되고 연결되면 업로드돼요. 그래서 볼링장 와이파이가 불안정해도 하루 기록을 전부 남길 수 있어요. 업로드하지 못한 게 있으면 앱이 알려 주고 계속 다시 시도해요 — 사라지는 건 없어요.",
"Appearance and settings": "테마와 설정",
"Change the theme in Settings, along with which stats cards you see, which side games are shown, and whether frame tracking fields like ball speed and rev rate appear.": "‘설정’에서 테마를 바꿀 수 있고, 표시할 통계 카드, 보여 줄 사이드 게임, 구속·회전수 같은 프레임 기록 항목의 표시 여부도 바꿀 수 있어요.",
"Importing": "가져오기",
"Improving": "실력 향상",
"Leagues, teams and gear": "리그, 팀, 장비",
"Your profile": "내 프로필",
"Good to know": "알아 두면 좋은 정보",
"no record": "기록을 찾을 수 없어요",
"own scores": "본인 점수",
"the bowler has already responded": "볼러 본인이 이미 응답했어요",
"only a teammate with verified scores of their own can correct this": "본인 점수가 확인된 팀원만 수정할 수 있어요",
"wait until the next session has finished": "다음 볼링 날이 끝날 때까지 기다려 주세요",
"bowler did not respond before the next session ended": "볼러 본인이 다음 볼링 날이 끝날 때까지 응답하지 않았어요",
"no corrected scores supplied": "수정한 점수가 입력되지 않았어요",
"Confirmed by the bowler.": "볼러 본인이 확인했어요.",
"Corrected by the bowler.": "볼러 본인이 수정했어요.",
"Rejected — these scores need to be entered again.": "거절됨 — 이 점수를 다시 입력해야 해요.",
"Already logged by the bowler — nothing to confirm.": "볼러 본인이 이미 기록했어요 — 확인할 필요가 없어요.",
"From an imported scorecard, not yet confirmed.": "가져온 점수표의 기록으로, 아직 확인되지 않았어요.",
"Scores to check": "확인할 점수",
"A teammate imported these from a scorecard photo. They already count — confirming marks them checked.": "팀원이 점수표 사진에서 가져온 점수예요. 이미 기록에 반영되어 있어요 — 확인하면 확인 완료로 표시돼요.",
"A night needs re-entering": "하루치 점수를 다시 입력해야 해요",
"You said these weren't yours, so they've stopped counting.": "내 점수가 아니라고 답해서 더 이상 반영되지 않아요.",
"Nobody confirmed these and a session has since finished. You can correct them.": "아무도 이 점수를 확인하지 않은 채 그 뒤로 세션이 끝났어요. 직접 수정할 수 있어요.",
"Accept or decline on the Coach tab.": "‘코치’ 탭에서 수락하거나 거절해 주세요.",
"Work your coach has set for you.": "코치가 준 과제예요.",
"They've marked work done or reported how far they got.": "과제를 완료했거나 어디까지 했는지 알려 왔어요.",
"Accept or decline on the Social tab.": "‘친구’ 탭에서 수락하거나 거절해 주세요.",
"Joining lets teammates import your scores from a scorecard photo.": "가입하면 팀원이 점수표 사진에서 내 점수를 가져올 수 있어요.",
"Anyone on the team can approve it on the Team tab.": "팀원 누구나 ‘팀’ 탭에서 승인할 수 있어요.",
"Book average needs updating": "공인 에버리지를 업데이트해야 해요",
"A league season has finished.": "리그 시즌이 끝났어요.",
"Other bowlers voted them down. Check and resubmit if you think they were right.": "다른 볼러들의 투표로 반려됐어요. 스펙이 맞다고 생각하면 확인 후 다시 제출해 주세요.",
"Strike rate": "스트라이크율",
"Spare conversion": "스페어 처리율",
"Corner pin conversion": "코너 핀 스페어 처리율",
"Trend over time": "기간별 추이",
"Game-by-game fade": "게임별 하락세",
"Consistency": "안정성",
"Form vs book average": "공인 에버리지 대비 최근 폼",
"Single-pin spares": "싱글 핀 스페어",
"Single corner pin spares": "코너 핀 싱글 스페어",
"Average by game (1st, 2nd, 3rd)": "게임 순서별 에버리지 (1·2·3번째 게임)",
"Score spread": "점수 편차",
"Ball comparison": "볼 비교",
"Center-by-center averages": "볼링장별 에버리지",
"Drill results": "연습 드릴 결과",
"Oil pattern averages": "오일 패턴별 에버리지",
"Overall": "총평",
"How it finished": "최종 결과",
"Broke 50": "50점 돌파",
"Broke 75": "75점 돌파",
"First 100 game": "첫 100점 게임",
"Broke 125": "125점 돌파",
"First 150 game": "첫 150점 게임",
"Broke 175": "175점 돌파",
"First 200 game": "첫 200점 게임",
"Broke 225": "225점 돌파",
"First 250 game": "첫 250점 게임",
"Broke 275": "275점 돌파",
"First 200 series": "첫 200점 시리즈",
"First 300 series": "첫 300점 시리즈",
"First 400 series": "첫 400점 시리즈",
"First 500 series": "첫 500점 시리즈",
"First 600 series": "첫 600점 시리즈",
"First 800 series": "첫 800점 시리즈",
"First night logged": "첫 볼링 기록",
"Five nights in": "볼링 5회째",
"Ten nights in": "볼링 10회째",
"Twenty-five nights": "누적 25회",
"Fifty nights": "누적 50회",
"A hundred nights": "누적 100회",
"First strike": "첫 스트라이크",
"First spare": "첫 스페어",
"Two strikes in a row": "2연속 스트라이크",
"First turkey": "첫 터키",
"Four in a row": "4연속 스트라이크",
"Five in a row": "5연속 스트라이크",
"Converted a split": "스플릿 스페어 처리",
"Converted the big four": "빅포 스페어 처리",
"First cash": "첫 상금권 입상",
"House": "하우스 패턴",
"a tournament": "대회",
"just for fun": "자유 게임",
"Not enough history yet — you'll be asked once a day until a pattern shows up.": "아직 기록이 충분하지 않아요 — 경향이 보일 때까지 하루에 한 번 물어볼게요.",
"Dual Angle": "듀얼 앵글",
"VLS (Pin Buffer)": "VLS (핀 버퍼)",
"2LS (Two-Handed)": "2LS (투핸드)",
"Drilling Angle": "드릴링 앵글",
"VAL Angle": "VAL 앵글",
"Pin Buffer": "핀 버퍼",
"Not a number": "숫자가 아니에요",
"You're the last member, so the team will be left empty.": "마지막 팀원이라 팀이 비게 돼요.",
"Your past scores and averages stay.": "지금까지의 점수와 에버리지는 그대로 남아요.",
"Standard scoring.": "일반적인 점수 계산 방식이에요.",
"Nine on the first ball counts as a strike.": "첫 투구에서 핀 9개를 쓰러뜨리면 스트라이크로 인정돼요.",
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
"Won every match.": "모든 경기에서 이겼어요.",
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
"Sport": "스포츠 패턴",
"Frame tracking": "프레임 단위 기록",
"Game tracking": "게임 단위 기록",
"Every frame — strikes, spare conversions, open frames and how each ball carried.": "모든 프레임 기록 — 스트라이크, 스페어 처리, 오픈 프레임, 그리고 투구마다 캐리가 어땠는지까지.",
"The final score for each game. Fast, and still tracks averages and trends.": "게임별 최종 점수만 기록해요. 빠르면서도 에버리지와 추세는 계속 볼 수 있어요.",
"Season Record": "시즌 전적",
"Hung": "혼자만 놓친 스트라이크",
"Shots / Strike % / Spare %": "투구 수 / 스트라이크율 / 스페어 처리율",
"My Records": "내 기록",
"Clean Frames": "클린 프레임",
"Ten Pin Leaves": "10번 핀 남음",
"Single Pin Spares": "싱글 핀 스페어",
"Hand Up": "손 들기",
"Longest Strike Streak": "최장 연속 스트라이크",
"Strike % Through the Night": "그날의 스트라이크율 추이",
"Ball vs Ball": "볼 궤적",
"A practice session": "연습 세션",
"A league night": "리그 날",
"A tournament": "대회",
"There's no wrong answer. Each one just changes which screens you see, and you can switch at any time from the Bowl tab or Settings.": "정답은 없어요. 선택에 따라 보이는 화면만 달라지고, ‘투구’ 탭이나 ‘설정’에서 언제든 바꿀 수 있어요.",
"For working on your game. Drills, frame tracking and every detail field are available, and practice scores stay out of your league averages.": "실력을 키우기 위한 모드예요. 연습 드릴, 프레임별 기록, 모든 세부 항목을 사용할 수 있고, 연습 점수는 리그 에버리지에 반영되지 않아요.",
"For your weekly team night. Your team roster and standings are available, along with side games.": "매주 팀과 함께하는 리그 날을 위한 모드예요. 팀원 명단과 순위표에 사이드 게임까지 사용할 수 있어요.",
"For higher-stakes competition. Blocks, squads, side pots, brackets, match play and the cut line are all available.": "더 치열한 경쟁을 위한 모드예요. 블록, 조, 사이드 팟, 브래킷, 매치 플레이, 컷라인을 모두 사용할 수 있어요.",
"For a fun activity. You get the scoresheet, standings and badges — all other views are hidden, not deleted, to keep it quick and simple.": "가볍게 즐기기 위한 모드예요. 점수표, 순위표, 배지를 사용할 수 있어요 — 빠르고 간단하게 쓸 수 있도록 나머지 화면은 삭제하지 않고 숨겨 둬요.",
"no sessions logged": "기록 없음",
"PRODID:-//Bowling Tracker//EN": "",
"Retired": "은퇴",
"This fill ball count may not be reliably read from the scorecard image -- please verify the pin count manually before saving.": "이 보너스 투구의 핀 수는 점수표 이미지에서 정확히 읽히지 않았을 수 있어요 -- 저장하기 전에 핀 수를 직접 확인해 주세요.",
"so a game may be missing from the photo": "사진에서 게임 하나가 빠졌을 수 있어요",
"so one of the game scores was probably misread": "게임 점수 하나를 잘못 읽었을 가능성이 높아요",
"so a frame was probably misread": "프레임 하나를 잘못 읽었을 가능성이 높아요",
"so the total was probably misread": "합계를 잘못 읽었을 가능성이 높아요",
"Keeping the book for the team? Add your teammates and log their shots too.": "팀 점수를 기록하고 있나요? 팀원을 추가해서 팀원의 투구도 함께 기록하세요.",
"Practising with someone? Add them to compare sessions afterwards. Their scores stay on this device.": "누군가와 함께 연습하나요? 추가하면 나중에 세션을 비교할 수 있어요. 추가한 사람의 점수는 이 기기에만 저장돼요.",
"Bowling with others? Add them to keep everyone's score. Their scores stay on this device.": "다른 사람과 함께 치나요? 추가하면 모두의 점수를 기록할 수 있어요. 추가한 사람의 점수는 이 기기에만 저장돼요.",
"on target": "타깃 적중",
"board must be a number": "보드는 숫자로 입력하세요",
"Winner": "우승",
"Best Single Game": "베스트 게임",
"— that's a real game.": "— 이게 진짜 게임이죠.",
"Biggest Comeback": "최대 반등",
"Ran Out Of Steam": "뒷심 부족",
"Most Consistent": "꾸준함 1등",
"Pick the date these games count for.": "이 게임을 반영할 날짜를 선택하세요.",
"That's today — prebowled games count for a future date.": "오늘 날짜예요 — 사전 투구는 이후 날짜로 반영돼요.",
"That date has passed. Prebowled games count for an upcoming session.": "이미 지난 날짜예요. 사전 투구는 앞으로 있을 리그 날로 반영돼요.",
"You already have a session on that date. Saving would overwrite it.": "그 날짜에는 이미 기록이 있어요. 저장하면 기존 기록을 덮어써요.",
"Bowled": "투구 결과",
"Practice session": "연습 세션",
"Just for fun": "자유 게임",
"system-ui, sans-serif": "",
"Clean card — no open frames": "전 게임 클린 — 오픈 프레임 없음",
"No nights bowled yet.": "아직 볼링 기록이 없어요.",
"WON IT": "우승",
"TOP FIVE": "5위 이내",
"MADE THE CUT": "컷 통과",
"Bracket": "브래킷",
"Eliminator": "엘리미네이터",
"Side Pot": "사이드 팟",
"Optional": "옵션",
"Big four": "빅포",
"Greek church": "그릭 처치",
"Baby split": "베이비 스플릿",
"Bucket split": "버킷",
"Casual": "자유 게임",
"stat unlocks": "통계 잠금 해제",
"stats unlock": "통계 잠금 해제",
"use frame tracking": "프레임별로 기록하면",
"note which ball bowled each game": "게임마다 사용한 볼을 기록하면",
"Rates": "비율",
"Records": "최고 기록",
"Single pins": "싱글 핀",
"Other leaves": "기타 남은 핀",
"First ball": "첫 투구",
"Ladder under way.": "스텝래더가 진행 중이에요.",
"Waiting for a better connection": "연결이 좋아지기를 기다리는 중",
"Your scores are saved on this phone and will upload on their own.": "점수는 이 휴대폰에 저장되어 있고, 알아서 업로드돼요.",
"Something was already saved": "이미 저장된 항목이 있어요",
"This looks like a duplicate of something already in the cloud. Your scores are safe — this copy just isn't needed.": "클라우드에 이미 있는 항목과 중복된 것 같아요. 점수는 안전해요 — 이 사본이 필요 없을 뿐이에요.",
"Not allowed to save this": "저장 권한이 없어요",
"The app doesn't have permission to save this. Nothing is lost on this phone, but it can't reach the cloud until this is fixed.": "앱에 이 항목을 저장할 권한이 없어요. 이 휴대폰의 데이터는 사라지지 않았지만, 문제가 해결될 때까지 클라우드에 올릴 수 없어요.",
"This didn't save correctly": "제대로 저장되지 않았어요",
"Something about this entry doesn't fit what the cloud expects. Your scores are still on this phone.": "이 기록의 일부가 클라우드가 요구하는 형식과 맞지 않아요. 점수는 이 휴대폰에 그대로 있어요.",
"Couldn't upload yet": "아직 업로드하지 못했어요",
"Your scores are saved on this phone. The app keeps trying in the background.": "점수는 이 휴대폰에 저장되어 있어요. 앱이 백그라운드에서 계속 다시 시도해요.",
"Maple and amber, like the house lights are down": "메이플과 앰버, 볼링장 조명을 낮춘 듯한 분위기",
"Classic": "클래식",
"Slate and blue, the original look": "슬레이트와 블루, 처음 그대로의 디자인",
"Glow": "글로우",
"Rock'n'bowl green on warm black": "따뜻한 블랙 위에 락볼링 그린",
"Deep plum with a pink flash": "짙은 플럼에 반짝이는 핑크",
"Pin deck": "핀 데크",
"High contrast, red pin stripe": "고대비, 핀의 빨간 줄무늬",
"Daylight": "데이라이트",
"Bright house, maple accents": "밝은 볼링장, 메이플 포인트",
"Scoresheet": "점수표",
"Cream paper, ruled-line blue and split red": "크림색 종이에 괘선의 파란색과 스플릿의 빨간색",
"Chalk": "초크",
"Cool white, quiet blue": "차가운 화이트, 차분한 블루",
"Keeping score": "점수 기록",
"Home is where a night gets logged. Pick what you're doing from the rows at the top — league, practice, a tournament, just bowling — and the card opens underneath. Enter three game scores, or go ball by ball and record every leave.": "‘홈’에서 그날의 볼링을 기록해요. 상단의 줄에서 오늘 할 것을 고르면 — 리그, 연습, 대회, 자유 게임 — 그 아래에 카드가 열려요. 세 게임의 점수만 입력하거나, 투구마다 남은 핀을 하나하나 기록하세요.",
"Your gear": "내 장비",
"Setup starts with your arsenal. On Balls, add a ball, record its layout, surface and specs, and on Bags sort them so tonight's four are one tap away.": "‘준비’는 보유 볼에서 시작해요. ‘볼’에서 볼을 추가하고 레이아웃, 표면, 스펙을 기록한 다음, ‘가방’에서 정리해 두면 오늘 쓸 볼 4개를 탭 한 번으로 꺼낼 수 있어요.",
"Leagues and teams": "리그와 팀",
"Setup is also where a league gets set up, under League, and a roster filled in, under Team. Scores file against a league, so that's the one thing worth doing first — a team can wait until you want to compare.": "리그 설정도 ‘준비’에서 해요. 리그는 ‘리그’에서 만들고, 팀원 명단은 ‘팀’에서 채워요. 점수는 리그별로 저장되니 먼저 해 둘 일은 이것 하나예요 — 팀은 비교하고 싶어질 때 만들어도 돼요.",
"Stats and trends": "통계와 추이",
"Stats breaks your bowling down by ball, by game, by center and by team. The Trends chip charts any of it over time, and the eye on any card hides it.": "‘통계’에서는 볼별, 게임별, 볼링장별, 팀별로 기록을 나눠 볼 수 있어요. ‘추이’ 칩은 어떤 항목이든 시간에 따른 그래프로 보여 주고, 카드마다 있는 눈 아이콘을 누르면 그 카드를 숨길 수 있어요.",
"Your journey": "내 여정",
"Your road so far: every first, dated, and how close you are to the next one — a few pins from a 700 series, say. Badges collect beside them.": "지금까지 걸어온 길: 처음 이룬 기록을 모두 날짜와 함께 남기고, 다음 기록까지 얼마나 남았는지도 보여 줘요 — 예를 들면 700점 시리즈까지 몇 핀 남았는지처럼요. 배지는 그 옆에 모여요.",
"Calendar and journal": "캘린더와 일지",
"History keeps every night you've bowled, on a calendar you can scroll back through. The journal gathers every note you've written — on a shot, a drill, a pattern or the end of a night — and you can search them, or filter by kind and date range.": "‘기록’의 캘린더에는 볼링한 날이 모두 남아 있어서, 스크롤해 지난 날짜까지 볼 수 있어요. 일지에는 직접 쓴 메모가 모두 모여요 — 투구, 연습 드릴, 오일 패턴, 그날의 마무리에 대한 메모까지요. 메모를 검색하거나 종류와 기간으로 필터링할 수 있어요.",
"That's enough for now": "이번엔 여기까지",
"You know your way around. If you want more, the settings menu has the rest — keeping score, bowling a tournament, what the AI does, stats, and coaching.": "이제 어디에 무엇이 있는지 알게 됐어요. 더 알고 싶다면 설정 메뉴에 나머지 가이드가 있어요 — 점수 기록, 대회 치르기, AI가 하는 일, 통계, 코칭.",
"By game": "게임 단위로",
"The quickest way in. Type the score for each game and you're done — three numbers, a night logged. Your average, highs and trends all work from this alone.": "가장 빠른 시작 방법이에요. 게임마다 점수를 입력하면 끝 — 숫자 세 개로 하루 기록이 완성돼요. 에버리지, 최고 점수, 추이 모두 이것만으로 볼 수 있어요.",
"A strike": "스트라이크",
"Going ball by ball, tap Strike and the frame is finished — no pins to pick. Add how it hit if you want it: flush, high, light, a messenger, a Brooklyn.": "투구마다 기록할 때는 ‘스트라이크’를 누르면 프레임이 끝나요 — 핀을 고를 필요가 없어요. 원하면 어떻게 맞았는지도 추가하세요: 정확한 포켓, 두껍게, 얇게, 메신저, 브루클린.",
"A spare": "스페어",
"Tap the pins you left standing, then answer Spare Made. Yes closes the frame. The pins you tap are what feeds your leave and conversion numbers later.": "남은 핀을 누른 다음 ‘스페어 처리’에 답하세요. ‘예’를 누르면 프레임이 끝나요. 여기서 누른 핀이 나중에 남은 핀 통계와 스페어 처리율의 바탕이 돼요.",
"An open frame": "오픈 프레임",
"Same start — tap what was standing — then answer No, and tap which of those pins you knocked down. None of them? Just save. The app works out the count.": "시작은 같아요. 남은 핀을 누르고 ‘아니요’를 선택한 다음, 그중 쓰러뜨린 핀을 누르세요. 하나도 못 쓰러뜨렸나요? 그냥 저장하면 돼요. 핀 수는 앱이 계산해요.",
"How the night went": "그날의 결과",
"The Results chip closes the session: games, series, how it compared to your average, and anything you won. Tap it when you're done and the night is filed.": "‘결과’ 칩으로 그날을 마무리해요: 게임별 점수, 시리즈, 에버리지와의 비교, 획득한 상금까지. 다 치고 나서 누르면 그날 기록이 저장돼요.",
"Setting up an event": "대회 설정하기",
"Pick Tournament on Home and Set up asks what the event is: its name and center, then Style, Scoring and Format. Those three are separate questions, so any mix works — a Baker squad can be handicapped and 9 pin no-tap at once. A handicap event then asks for your pins per game.": "‘홈’에서 ‘대회’를 고르면 ‘준비’에서 어떤 대회인지 물어봐요: 대회 이름과 볼링장, 그다음 ‘스타일’, ‘점수 방식’, ‘형식’이에요. 이 세 가지는 서로 다른 질문이라 어떻게 조합해도 돼요 — 예를 들어 베이커 방식이면서 핸디캡을 적용하는 9핀 노탭 대회도 설정할 수 있어요. 핸디캡 대회라면 이어서 게임당 핸디캡 핀 수를 물어봐요.",
"Add a block for each day or squad and they become tabs under Scoring. Enter the cut as it's posted — plus or minus against a 200 average — and the app tells you where you stand against it, carrying your earlier blocks in once there's more than one.": "날짜나 조마다 블록을 추가하면 ‘점수 입력’ 아래에 탭으로 생겨요. 컷은 발표된 그대로 입력하세요 — 에버리지 200 기준 플러스 또는 마이너스로요 — 그러면 앱이 컷 대비 현재 위치를 알려 줘요. 블록이 두 개 이상이 되면 앞선 블록의 점수도 합산해요.",
"Making the cut": "컷 통과",
"The app never asks whether you made it: the margin already says. What it can't work out is what came next, so each block asks what you qualified for — match play, a stepladder, or neither — and gives you a button straight to it.": "컷을 통과했는지는 앱이 따로 묻지 않아요: 점수 차이만 봐도 알 수 있으니까요. 앱이 알 수 없는 건 그다음 단계라서, 블록마다 매치 플레이와 스텝래더 중 어디에 진출했는지(또는 둘 다 아닌지) 묻고, 바로 이동할 수 있는 버튼을 보여 줘요.",
"Each match is your score against an opponent's, with bonus pins for a win or a tie. In a handicap event there's a box for your opponent's handicap too.": "각 경기는 내 점수와 상대 점수의 대결이고, 이기거나 비기면 보너스 핀이 붙어요. 핸디캡 대회에서는 상대의 핸디캡을 입력하는 칸도 있어요.",
"The stepladder": "스텝래더",
"Sudden death, so no bonus pins — the higher score advances. Enter your seed and each opponent's, and the app works out where you finished from how far you climbed. Beat the one seed and it says you won it.": "단판 승부라 보너스 핀은 없어요 — 점수가 높은 쪽이 올라가요. 내 시드와 각 상대의 시드를 입력하면, 얼마나 올라갔는지를 보고 최종 순위를 앱이 계산해요. 1번 시드를 이기면 우승으로 표시돼요.",
"How the event went": "대회 결과",
"Results recaps the whole event broken out by phase, with your brackets and side pots and what they paid. End tournament and view results saves everything on its way there. The Nightcap reads the night back to you, and the share button hands the lot to whoever asks how you did.": "‘결과’에서는 대회 전체를 단계별로 정리하고, 브래킷과 사이드 팟에서 받은 상금까지 보여 줘요. ‘종료하고 결과 보기’를 누르면 결과 화면으로 넘어가면서 모든 게 저장돼요. Nightcap은 그날의 경기를 되짚어 주고, 공유 버튼을 누르면 어땠냐고 묻는 사람에게 전부 보낼 수 있어요.",
"Photograph the scorecard": "점수표 촬영하기",
"Import, in the header, takes a picture of the monitor or a printed sheet. Every bowler on it, every frame it can read — no typing. It asks what you're importing, so you don't have to set the night up first.": "상단의 ‘가져오기’로 모니터나 인쇄된 점수표를 촬영해요. 거기 있는 모든 볼러, 읽을 수 있는 모든 프레임을 가져와요 — 입력할 필요가 없어요. 무엇을 가져오는지 물어보니까, 그날 설정을 먼저 해 둘 필요도 없어요.",
"Improve reads your own history and tells you what it finds — which ball is carrying, where a spare is leaking, what changed this month. Each one says how confident it is, and while the sample is still small it says so rather than letting you act on a pattern that is really just noise.": "‘향상’은 내 기록을 읽고 찾아낸 것을 알려 줘요 — 어떤 볼이 캐리가 잘 되는지, 어느 스페어를 자꾸 놓치는지, 이번 달에 무엇이 달라졌는지. 각 분석은 얼마나 확실한지도 알려 주고, 아직 표본이 적을 때는 그렇다고 말해 줘요. 사실은 우연에 불과한 패턴을 믿고 움직이지 않도록요.",
"The Nightcap": "Nightcap",
"On a league or tournament Results screen, the Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Log the night ball by ball and it pours itself once the night is saved.": "리그나 대회의 ‘결과’ 화면에서 Nightcap이 그날의 경기를 되짚어 줘요 — 남은 핀이 어디에 몰렸는지, 오픈 프레임으로 몇 점을 잃었는지, 어떤 볼이 캐리가 잘 됐는지. 투구마다 기록하면 그날을 저장하는 순간 Nightcap 한 잔이 저절로 채워져요.",
"Ask Brooklyn": "Brooklyn에게 질문",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. Her lamp sits in the header on every screen, so you never have to go looking. Three wishes a day.": "일반적인 수치는 ‘통계’ 화면에서 볼 수 있어요. Brooklyn은 그 화면으로는 답할 수 없는 질문을 위한 기능이에요 — 내 볼링에 대해 평소 말하듯 물어보면 지금까지 기록한 내용을 바탕으로 답을 찾아 줘요. 아직 기록하지 않는 항목이 필요하면 무엇부터 기록하면 좋을지 알려 줘요. 램프는 모든 화면의 상단에 있어서 따로 찾을 필요가 없어요. 소원은 하루 세 번이에요.",
"Linking up": "연결하기",
"Improve has a Coach button. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "‘향상’ 탭에 ‘코치’ 버튼이 있어요. 누가 코치인지 — 상대가 나를 코치하는지, 내가 상대를 코치하는지 — 고른 뒤 코드를 만드세요. 여덟 글자를 상대에게 불러 주고, 상대가 자기 휴대폰에서 입력하면 연결돼요.",
"Both sides, one screen": "두 역할을 한 화면에서",
"If you do both, the View chips flip between them: I'm bowling shows what your own coach has sent you, I'm coaching shows your bowlers. A coach sees their pupils' scores without having to add them as a friend, and either of you can end it from your own phone.": "둘 다 한다면 ‘보기’ 칩으로 전환하세요: ‘볼러 모드’에서는 내 코치가 보낸 내용을, ‘코치 모드’에서는 내 볼러를 보여 줘요. 코치는 친구로 추가하지 않아도 지도하는 볼러의 점수를 볼 수 있고, 연결은 어느 쪽이든 자기 휴대폰에서 끊을 수 있어요.",
"Reading a bowler": "볼러 분석",
"Pick a bowler and you get their recent nights and how their shots break down — strikes, spares, the leaves that keep coming back — with the number of shots it's built on shown beside it, so you know how much to trust it.": "볼러를 고르면 최근 경기와 투구 내역이 나와요 — 스트라이크, 스페어, 자꾸 나오는 남은 핀까지 — 몇 개의 투구를 바탕으로 한 숫자인지도 옆에 표시되니, 얼마나 믿을 만한지 알 수 있어요.",
"Setting work": "과제 내기",
"A task is something to go and do, with an optional measurable target and a due date — convert 60% of your single-pin spares, say. Leave the target off for anything that isn't a number.": "과제는 직접 해 볼 일이에요. 수치 목표(선택)와 기한을 정할 수 있어요 — 예를 들면 싱글 핀 스페어 60% 처리하기처럼요. 숫자로 나타낼 수 없는 과제라면 목표는 비워 두세요.",
"Answering back": "결과 보고하기",
"The bowler marks it done, or records an attempt with the number they actually reached and a note about how it went. Either way it comes back to the coach, so the next thing you set is based on what happened rather than what was asked for.": "볼러는 과제를 완료로 표시하거나, 실제로 달성한 숫자와 어땠는지에 대한 메모를 붙여 시도를 기록해요. 어느 쪽이든 코치에게 전달되니, 다음 과제는 요청한 내용이 아니라 실제 결과를 바탕으로 낼 수 있어요.",
"Break it down": "세부 분석",
"The chips across the top slice the same numbers different ways — yours, your team's, by ball, by game, by center.": "상단의 칩으로 같은 수치를 여러 방식으로 나눠 볼 수 있어요 — 내 기록, 팀 기록, 볼별, 게임별, 볼링장별로요.",
"Compare": "비교",
"Put yourself beside a teammate, or against the team as a whole. Same measures, same scale.": "팀원 한 명이나 팀 전체와 나란히 비교해 보세요. 같은 지표를 같은 척도로 보여 줘요.",
"When there isn't much data yet": "아직 데이터가 많지 않을 때",
"Nothing is locked — every card shows its numbers. But a number built on a handful of shots moves more with luck than with you, so until there's enough behind it the card is faded and says how many more shots it needs to be reliable.": "잠긴 건 없어요 — 모든 카드에 수치가 표시돼요. 하지만 몇 번 안 되는 투구로 나온 수치는 실력보다 운에 더 크게 흔들려요. 그래서 데이터가 충분히 쌓일 때까지는 카드가 흐리게 표시되고, 믿을 만한 수치가 되려면 몇 구가 더 필요한지 알려 줘요.",
"The trend graph": "추이 그래프",
"Pick the measure, the ball and the league from the three dropdowns, then choose how far back to look — a number of games, a number of days, or two dates. Every game, or one point per night.": "드롭다운 세 개에서 지표, 볼, 리그를 고른 다음 얼마나 거슬러 올라가 볼지 정하세요 — 게임 수, 일수, 또는 두 날짜 사이로요. 게임마다 한 점씩, 또는 볼링한 날마다 한 점씩 표시할 수 있어요.",
"Look around": "둘러보기",
"What's behind each tab": "탭마다 무엇이 있는지",
"By game, or ball by ball": "게임 단위로, 또는 투구 하나하나",
"Bowling a tournament": "대회 치르기",
"Blocks, the cut, match play, the ladder": "블록, 컷, 매치 플레이, 스텝래더",
"What the AI does": "AI가 하는 일",
"Scorecards, insights, Nightcap, Brooklyn": "점수표, 분석, Nightcap, Brooklyn",
"Breakdowns, comparing, trends": "세부 분석, 비교, 추이",
"Linking up, tasks, what comes back": "연결, 과제, 볼러의 결과 보고",
"Your pins, as bowled.": "쓰러뜨린 핀 그대로.",
"Pins added to every game.": "매 게임에 핀을 더해요.",
"You bowl the whole game.": "한 게임을 혼자 모두 투구해요.",
"You and a partner alternate frames.": "파트너와 프레임을 번갈아 투구해요.",
"I start": "내가 먼저",
"Partner starts": "파트너가 먼저",
"you and your partner": "나와 파트너",
"Your own frames still count toward strikes, spares and how each ball carried.": "내가 투구한 프레임은 스트라이크, 스페어, 볼별 캐리 기록에 그대로 반영돼요.",
"Average score per night.": "날짜별 평균 점수.",
"Best Game": "하이 게임",
"Your best single game each night.": "날짜별 하이 게임.",
"Series Total": "시리즈 합계",
"Total pins each night.": "날짜별 쓰러뜨린 핀 합계.",
"First game each night.": "날짜별 첫 번째 게임.",
"Second game each night.": "날짜별 두 번째 게임.",
"Third game each night.": "날짜별 세 번째 게임.",
"Share of first balls that struck, per night.": "첫 투구가 스트라이크가 된 비율 (날짜별).",
"Non-split spare conversion, per night.": "스플릿을 제외한 스페어 처리율 (날짜별).",
"Conversion on a lone corner pin, per night.": "코너 핀 하나만 남았을 때의 스페어 처리율 (날짜별).",
"Frames closed with a strike or spare, per night.": "스트라이크나 스페어로 마무리한 프레임 (날짜별).",
"No clear direction — the movement here is within normal night-to-night variation.": "뚜렷한 추세는 없어요 — 이 정도 변동은 날마다 생기는 보통 범위 안이에요.",
"Days": "일수",
"the start": "처음",
"Drill": "연습 드릴",
"Name it (optional)": "이름 (선택)",
"Pins (optional)": "핀 (선택)",
"No ball recorded": "볼 기록 없음",
"· last time": "· 지난번",
"✓ Made": "✓ 성공",
"✗ Missed": "✗ 실패",
"Undo last": "마지막 기록 취소",
"Shot notes — what worked on this drill…": "투구 메모 — 이 연습 드릴에서 잘된 점…",
"✓ Drill Saved": "✓ 드릴 저장 완료",
"Throw a few first": "먼저 몇 번 던져 보세요",
"+ Start another drill": "+ 다른 연습 드릴 시작하기",
"Saved tonight": "오늘 저장한 드릴",
"This screen hit a problem": "이 화면에 문제가 생겼어요",
"Your data is safe — nothing was lost. The rest of the app still works, so you can switch to another tab.": "데이터는 안전해요 — 사라진 건 없어요. 앱의 다른 부분은 계속 작동하니 다른 탭으로 이동해 보세요.",
"Try again": "다시 시도",
"Copy details": "세부 정보 복사",
"Unknown": "알 수 없음",
"Loading friends…": "친구 불러오는 중…",
"Add a Friend": "친구 추가",
"Search by name…": "이름으로 검색…",
"No one found with that name.": "그 이름의 사용자를 찾지 못했어요.",
"Share Sign-In Link": "로그인 링크 공유",
"A quick way to hand someone the app link — scanning this just opens the sign-in screen. It doesn't log anyone in as anyone; each person still enters their own email.": "앱 링크를 간편하게 전달하는 방법이에요 — 이 코드를 스캔하면 로그인 화면이 열릴 뿐이에요. 누구도 다른 사람의 계정으로 로그인되지 않으며, 각자 자기 이메일을 입력해야 해요.",
"QR code to sign-in page": "로그인 페이지로 연결되는 QR 코드",
"Sent": "보낸 요청",
"No friends yet — search above to add someone.": "아직 친구가 없어요 — 위에서 검색해 친구를 추가해 보세요.",
"⚠️ Your games aren't attributed to your account": "⚠️ 게임이 내 계정에 연결되어 있지 않아요",
"Your account's display name doesn't match the bowler name your sessions are logged under. Set your name in Teams to fix this.": "계정의 표시 이름이 세션 기록에 사용된 볼러 이름과 달라요. ‘팀’에서 이름을 설정하면 해결돼요.",
"✓ reached": "✓ 달성",
"Not enough data yet —": "아직 데이터가 부족해요 —",
"before this is worth reporting.": "기록이 쌓여야 결과를 보여 드려요.",
"Nothing logged for this yet.": "아직 기록이 없어요.",
"Now:": "현재:",
"Target met": "목표 달성",
"Pick a statistic first.": "먼저 통계 항목을 선택하세요.",
"Enter a number.": "숫자를 입력하세요.",
"Goals": "목표",
"Set a target for a statistic you're working on and track progress against it.": "연습 중인 통계 항목에 목표를 정하고 진행 상황을 추적해 보세요.",
"+ Add a goal": "+ 목표 추가",
"You've set a goal for every statistic available.": "설정할 수 있는 모든 통계 항목에 목표를 정했어요.",
"Statistic": "통계 항목",
"Choose one…": "선택하세요…",
"Needs": "진행 상황을 보려면 최소",
"before progress is shown.": "기록이 필요해요.",
"Google signed in but didn't return an ID token. This usually means": "Google 로그인은 됐지만 ID 토큰이 반환되지 않았어요. 보통 이런 경우는",
"the sign-in wasn't configured for online mode.": "로그인이 온라인 모드로 설정되지 않았다는 뜻이에요.",
"Couldn't sign in with Google. Check your connection and try again.": "Google로 로그인하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.",
"Menu": "메뉴",
"Search help…": "도움말 검색…",
"Search help": "도움말 검색",
"Search": "검색",
"Name, hand, style, home centers": "이름, 투구 손, 스타일, 자주 가는 볼링장",
"Theme, stats cards, account": "테마, 통계 카드, 계정",
"Search help — try 'buy-in' or 'prebowl'": "도움말 검색 — 예: ‘참가비’, ‘사전 투구’",
"Show me around the app again": "앱 안내 다시 보기",
"Nothing matched \"": "검색 결과 없음: ‘",
"\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".": "’. 앱에 나오는 단어로 검색해 보세요 — ‘스페어’, ‘팀’, ‘볼’, ‘가져오기’.",
"This season": "이번 시즌",
"Your career": "통산 기록",
"League season": "리그 시즌",
"Between seasons": "시즌 휴식기",
"All league play": "전체 리그 경기",
"this season": "이번 시즌",
"No games yet": "아직 게임이 없어요",
"Your bowling": "내 볼링",
"League average": "리그 에버리지",
"High game": "하이 게임",
"High series": "하이 시리즈",
"Open full statistics": "전체 통계 보기",
"My Bowling Journey": "My Bowling Journey",
"Your milestones and progress": "내 마일스톤과 성장 기록",
"Latest milestone": "최근 마일스톤",
"milestone": "마일스톤",
"so far": "달성",
"Next ·": "다음 ·",
"Progress to next milestone": "다음 마일스톤까지 진행률",
"Your bowling story starts here.": "볼링 이야기가 여기서 시작돼요.",
"What are you doing today?": "오늘은 무엇을 할까요?",
"Latest ·": "최근 ·",
"That file could not be read.": "파일을 읽을 수 없어요.",
"Import cancelled. Nothing was saved.": "가져오기를 취소했어요. 저장된 내용은 없어요.",
"Nothing to import.": "가져올 내용이 없어요.",
"Import scores from a file": "파일에서 점수 가져오기",
"A CSV with four columns:": "4개 열로 된 CSV 파일:",
". Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.": ". 날짜는 2026-09-17 형식, 점수는 0~300 사이의 정수이며, 하루에 1~3게임을 넣을 수 있어요.",
"Import into": "가져올 위치",
"Imported (no league)": "가져온 기록 (리그 없음)",
"Leave it as Imported if these nights don't belong to a league you track.": "이 날짜들이 기록 중인 리그에 속하지 않으면 ‘가져온 기록’으로 두세요.",
"What would import": "가져올 내용",
"row": "행",
"skipped": "건너뜀",
"Rows that can't be imported": "가져올 수 없는 행",
"Row": "행",
"and": "외",
"you already have": "(이미 기록 있음)",
"Replace those nights": "해당 날짜 기록 교체하기",
"Keep mine, import the other": "내 기록 유지, 나머지 가져오기:",
"Cancel the import": "가져오기 취소",
"Importing…": "가져오는 중…",
"Imported from a teammate's scorecard photo. These are already counting — confirming just marks them checked.": "팀원의 점수표 사진에서 가져온 점수예요. 이미 기록에 반영돼 있어요 — 확인하면 확인됨으로 표시만 돼요.",
"Scores read": "읽은 점수",
"Frame-by-frame data included for": "프레임별 데이터 포함:",
"— confirming adds it to your shot history.": "— 확인하면 내 투구 기록에 추가돼요.",
"These are right": "맞아요",
"Fix them": "수정하기",
"What were they actually?": "실제 점수는 얼마였나요?",
"Save corrections": "수정 내용 저장",
"None of these are mine": "모두 내 점수가 아니에요",
"Needs You": "확인 필요",
"Open ›": "열기 ›",
"You were added to the roster as": "팀원 명단에 추가된 이름:",
"a member": "팀원",
". Teammates will be able to import your scores from a scorecard photo — you still confirm them.": ". 이제 팀원이 점수표 사진에서 내 점수를 가져올 수 있어요 — 확인은 계속 직접 해요.",
"Joining…": "가입하는 중…",
"Join team": "팀 가입하기",
"Invitation": "초대",
"Invitations": "초대",
"Scores To Check": "확인할 점수",
"imported by a teammate.": "— 팀원이 가져온 점수예요.",
"Needs Re-entering": "다시 입력 필요",
"You said these weren't yours, so they've stopped counting. Enter them on the Log tab when you have them.": "내 점수가 아니라고 답해서 더 이상 기록에 반영되지 않아요. 점수를 알게 되면 ‘투구’ 탭에서 입력하세요.",
"Waiting On Teammates": "팀원 확인 대기 중",
"These haven't been confirmed and a session has since finished. You can correct them if you know the real scores.": "아직 확인되지 않은 채로 그 뒤 세션이 하나 끝났어요. 실제 점수를 알면 고칠 수 있어요.",
"Correct these": "수정하기",
"Couldn't read that scorecard right now. Try again in a few minutes, or enter the scores by hand.": "지금은 이 점수표를 읽을 수 없어요. 몇 분 뒤에 다시 시도하거나 점수를 직접 입력하세요.",
"No": "아니요",
"Which pins did the second ball knock down?": "두 번째 투구로 쓰러뜨린 핀은?",
"this frame": "개 (이번 프레임 합계)",
"Game": "게임",
"No frame-by-frame detail on this scorecard — importing the game score only.": "이 점수표에는 프레임별 상세 기록이 없어요 — 게임 점수만 가져와요.",
"Score": "점수",
"That isn't a possible game score — type the real one.": "게임에서 나올 수 없는 점수예요 — 실제 점수를 입력하세요.",
"fill ball": "개의 보너스 투구",
"below couldn't be reliably read from the image -- please double-check the pin count.": "(아래)를 이미지에서 정확히 읽지 못했어요 -- 핀 수를 다시 확인해 주세요.",
"Tap a frame to fix what was read.": "프레임을 탭하면 읽은 내용을 수정할 수 있어요.",
"· fill ball — pick a result": "· 보너스 투구 — 결과 선택",
"What are you importing?": "무엇을 가져올까요?",
"Which team?": "어느 팀인가요?",
"No teams yet — add one under a league in Team, then import.": "아직 팀이 없어요 — ‘팀’에서 리그에 팀을 추가한 다음 가져오세요.",
"Which tournament?": "어느 대회인가요?",
"No tournaments yet — start one on the Bowl tab first.": "아직 대회가 없어요 — 먼저 ‘투구’ 탭에서 대회를 시작하세요.",
"Filed as practice — no league or team needed.": "연습으로 저장돼요 — 리그나 팀은 필요 없어요.",
"Date": "날짜",
"Couldn't read one of the selected images.": "선택한 이미지 중 하나를 읽지 못했어요.",
"Couldn't read the selected images.": "선택한 이미지를 읽지 못했어요.",
"The import took too long and was stopped. Try one image at a time.": "가져오기가 너무 오래 걸려서 중단했어요. 이미지를 한 장씩 시도해 보세요.",
"a Lite model cannot be trusted with pin identities": "",
"frames did not match the printed total": "",
"saw frame detail but read none": "",
"read no frames": "",
"no response": "",
"timed out": "",
"no frames": "",
", mismatched": "",
"The scorecard reader is busy right now — this happens at peak times and usually clears within a few minutes.": "지금 점수표 인식이 혼잡해요 — 사용자가 몰리는 시간대에 생기는 일로, 보통 몇 분 안에 풀려요.",
"Read Frames": "프레임 읽기",
"Read Scores": "점수 읽기",
"The scorecard reader's daily allowance is used up. It resets on Google's clock, so this usually means tomorrow — scores typed in by hand save normally in the meantime.": "점수표 인식의 하루 사용량을 다 썼어요. Google 시간 기준으로 초기화되기 때문에 보통 내일 다시 쓸 수 있어요 — 그동안 직접 입력한 점수는 평소처럼 저장돼요.",
"The scorecard reader is briefly over its rate limit. Wait about a minute and try again — nothing is lost.": "점수표 인식이 잠시 요청 한도를 넘었어요. 1분쯤 기다렸다가 다시 시도하세요 — 사라진 데이터는 없어요.",
"The scorecard reader isn't available right now. Scores typed in by hand save normally in the meantime.": "지금은 점수표 인식을 사용할 수 없어요. 그동안 직접 입력한 점수는 평소처럼 저장돼요.",
"Couldn't reach the scorecard reader. Check your signal, or try one image at a time —": "점수표 인식에 연결하지 못했어요. 네트워크 상태를 확인하거나 이미지를 한 장씩 시도해 보세요 —",
"a large photo can take too long to send.": "큰 사진은 보내는 데 너무 오래 걸릴 수 있어요.",
"No games could be read from the image(s). Try a clearer screenshot.": "이미지에서 게임을 읽지 못했어요. 더 선명한 스크린샷으로 다시 시도해 보세요.",
"Found games but couldn't read any scores or frame detail. Try a clearer screenshot.": "게임은 찾았지만 점수나 프레임 정보를 읽지 못했어요. 더 선명한 스크린샷으로 다시 시도해 보세요.",
"Frames you already have will be skipped, so nothing gets double-counted. Anything new on this card still comes in. Continue?": "이미 있는 프레임은 건너뛰므로 중복 집계되지 않아요. 이 점수표의 새 기록은 그대로 가져와요. 계속할까요?",
"Nothing was mapped to you on this card.": "이 점수표에는 나로 지정된 기록이 없어요.",
"What's on the card?": "점수표에 어떤 기록이 있나요?",
"Game scores": "게임 점수",
"Frame by frame": "프레임별",
"Reads each game's score. Fastest. If the card turns out to show frames, they get read too.": "게임별 점수를 읽어요. 가장 빨라요. 점수표에 프레임이 나와 있으면 프레임도 함께 읽어요.",
"Reads every ball and the pins it left. Slower, and leaves can come back wrong — you'll see each frame as a scoresheet to fix before saving.": "투구마다 남은 핀까지 읽어요. 더 느리고 남은 핀이 잘못 읽힐 수 있어요 — 저장하기 전에 프레임마다 점수표로 보여 드리니 거기서 고치면 돼요.",
"Scorecard Screenshot": "점수표 스크린샷",
"Clear all": "모두 지우기:",
"image": "장",
"Nothing's broken — just busy": "오류가 아니에요 — 지금 요청이 많을 뿐이에요",
"Reading the scorecard…": "점수표를 읽는 중…",
"This can take a minute or two — every frame is read individually.": "1~2분 걸릴 수 있어요 — 프레임을 하나씩 읽고 있어요.",
"Keep this screen open until it finishes.": "완료될 때까지 이 화면을 열어 두세요.",
"Who's who": "볼러 확인",
"bowler": "명",
"read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.": "(점수표에서 읽음). 저장하기 전에 한 명씩 확인하세요 — 잘못 연결하면 다른 사람의 게임이 엉뚱한 사람의 기록에 들어가요.",
"frame tracking": "프레임별 기록",
"scores only": "점수만",
"no detail": "상세 정보 없음",
"series": "시리즈",
"· combined from": "· 이미지",
"images": "장 합침",
"Games add to": "게임 합계는",
"but the card's scratch series is": "점인데 점수표의 스크래치 시리즈는",
". One of the games was misread — check the card.": "점이에요. 게임 중 하나를 잘못 읽었어요 — 점수표를 확인하세요.",
"Skip this bowler": "이 볼러 건너뛰기",
"Add \"": "\"",
"\" as a new bowler": "\" 새 볼러로 추가",
"More than one bowler matches this name equally — pick the right one.": "이 이름과 똑같이 일치하는 볼러가 여러 명이에요 — 맞는 볼러를 선택하세요.",
"Matched on the alias \"": "별칭으로 연결: \"",
"Roster order": "팀원 명단 순서",
"The card's order doesn't match your team roster. Names still matched correctly — but if the roster is wrong, position hints will be wrong for every future import.": "점수표의 순서가 팀원 명단과 달라요. 이름은 제대로 연결됐어요 — 하지만 명단이 잘못돼 있으면 앞으로 가져올 때마다 투구 순서 힌트가 틀리게 돼요.",
"Card order:": "점수표 순서:",
"Continue": "계속",
"Start Over": "처음부터 다시",
"nothing was mapped to you on this card.": "이 점수표에는 내 기록으로 연결된 게임이 없어요.",
"check the games below — some came through frame by frame, some as scores only. Correct anything that's wrong, then save.": "아래 게임을 확인하세요 — 프레임별로 읽힌 게임도 있고, 점수만 읽힌 게임도 있어요. 틀린 부분이 있으면 고친 다음 저장하세요.",
"Where this goes": "저장 위치",
"This scorecard": "이 점수표",
"check the numbers against the card before saving": "저장하기 전에 숫자를 점수표와 대조해 보세요",
"Also sending to teammates": "팀원에게도 전송",
"These go to": "확인 요청 대상:",
"this bowler": "이 볼러",
"these bowlers": "각 볼러",
"to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.": "— 점수는 바로 반영되고, 확인하면 확인됨으로 표시만 돼요. 보내기 전에 잘못 읽힌 부분을 고치세요.",
"read as \"": "인식된 이름: \"",
"couldn't be read — type the real score, or clear the box if they didn't bowl it.": "읽을 수 없음 — 실제 점수를 입력하거나, 치지 않은 게임이면 칸을 비우세요.",
"Series": "시리즈",
"· card printed": "· 점수표상",
"Saving…": "저장 중…",
"Pick a result for the fill ball first": "보너스 투구 결과를 먼저 선택하세요",
"Fix the flagged scores first": "표시된 점수를 먼저 고치세요",
"Looks Good — Save": "이상 없음 — 저장",
"Moderate": "보통",
"Tentative": "잠정",
"What This Is Based On": "분석 근거",
"games. Only statistics with enough data to be meaningful are analysed.": "게임. 의미 있는 결과를 낼 만큼 데이터가 충분한 통계만 분석해요.",
"Ball comparisons unlock as each ball builds up its own sample. They need more than overall stats because comparing two percentages doubles the uncertainty.": "볼별 비교는 볼마다 데이터가 충분히 쌓이면 열려요. 두 비율을 비교하면 불확실성이 두 배가 되기 때문에 전체 통계보다 더 많은 데이터가 필요해요.",
"You're close on": "곧 열려요:",
"— a couple more nights and it unlocks.": "— 두세 번만 더 볼링하면 돼요.",
"Insights": "분석",
"Select a bowler on the Log tab first. Insights are about one bowler's game, not everyone's combined.": "먼저 ‘투구’ 탭에서 볼러를 선택하세요. 분석은 볼러 한 명의 게임을 다루며, 모든 볼러를 합친 결과가 아니에요.",
"to go.": "남았어요.",
"Insights need at least": "분석에는 최소",
"games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.": "게임이 필요해요. 그보다 적으면 날마다 수치가 너무 크게 흔들려서 믿을 만한 이야기를 할 수 없어요 — 그럴듯해 보여도 실제로는 잡음일 뿐인 패턴이 나오게 돼요.",
"You have": "현재",
"games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.": "게임을 기록했어요. 아직 제대로 분석할 만큼 데이터가 쌓인 항목이 없어요 — 가장 가까운 항목은 다음과 같아요.",
"Based on": "지금까지",
"games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.": "게임을 바탕으로 한 분석이에요. 기록할수록 더 정확해져요 — 몇 번 치면 힌트 정도, 한 시즌이면 실제로 행동에 옮길 근거가 돼요.",
"New since last time:": "지난번 이후 새로 생긴 항목:",
"Dismiss": "닫기",
"Looks at your logged statistics and reports what stands out. It only uses numbers with enough data behind them, and it reports patterns rather than telling you how to bowl.": "기록한 통계를 살펴보고 눈에 띄는 점을 알려 드려요. 데이터가 충분히 뒷받침되는 수치만 사용하고, 어떻게 투구하라고 지시하기보다는 패턴을 알려 드려요.",
"Analysing…": "분석 중…",
"Analyse My Game": "내 게임 분석하기",
"Try Again": "다시 시도",
"Worth Paying Attention To": "눈여겨볼 점",
"Written by AI from the stats you've logged. It can be wrong, and it can sound confident while being wrong — treat it as a starting point for a conversation, not an instruction.": "기록한 통계를 바탕으로 AI가 작성한 글이에요. 틀릴 수 있고, 틀렸을 때도 확신에 찬 것처럼 들릴 수 있어요 — 지시가 아니라 대화의 출발점으로 생각해 주세요.",
"You're working with": "현재 코치:",
"a coach": "코치",
"— worth talking this through with them before changing anything. They can see what these numbers can't.": "— 무언가를 바꾸기 전에 코치와 충분히 이야기해 보세요. 코치는 이 숫자가 보여 주지 못하는 것을 볼 수 있어요.",
"Run Again": "다시 분석",
"Night": "볼링한 날",
"Pattern": "오일 패턴",
"Shot": "투구",
"Nothing written yet. Notes you add to a shot, a drill or the end of a night all collect here, so you can look back at what you were working on and what you said about it.": "아직 쓴 메모가 없어요. 투구, 연습 드릴, 볼링한 날의 마무리에 남긴 메모가 모두 여기에 모여서, 무엇에 집중했고 그에 대해 어떤 말을 남겼는지 돌아볼 수 있어요.",
"Search your notes…": "메모 검색…",
"Filters": "필터",
"Filter": "필터",
"Kind": "종류",
"Dates": "기간",
"From date": "시작일",
"To date": "종료일",
"in that range": "이 기간에",
"Nothing written in that range.": "이 기간에 쓴 메모가 없어요.",
"The road starts with your first night": "여정은 첫 볼링 날부터 시작돼요",
"Badges": "배지",
"pins down": "쓰러뜨린 핀",
"Up next": "다음 목표",
"Your bowling milestones, newest first": "볼링 마일스톤 (최신순)",
"LATEST": "최신",
"Your road starts here": "여정은 여기서 시작돼요",
"Log a night and your first milestones land on the road with the date you did them — first strike, first spare, first 100.": "볼링을 한 번 기록하면 첫 마일스톤이 달성한 날짜와 함께 여정에 새겨져요 — 첫 스트라이크, 첫 스페어, 첫 100점.",
"The road so far": "지금까지의 여정",
"newest first": "최신순",
"What you've collected along the way": "여정에서 모은 것들",
"Your active league": "이용 중인 리그",
"The free plan follows this league.": "무료 플랜은 이 리그만 기록해요.",
"Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.": "리그를 바꾸거나 두 개 이상의 리그에서 볼링하는 건 Pro 기능이에요 — 구독하면 기록한 모든 내용이 다시 돌아와요.",
"Get Pro": "Pro로 업그레이드",
"That league is still syncing. Give it a moment and try again.": "그 리그는 아직 동기화 중이에요. 잠시 후 다시 시도해 주세요.",
"Your active league is already chosen. Switching leagues is part of Pro.": "이용 중인 리그가 이미 선택되어 있어요. 리그 변경은 Pro 기능이에요.",
"Could not save that just now. Your leagues are untouched — try again in a minute.": "지금은 저장하지 못했어요. 리그는 그대로예요 — 1분 후 다시 시도해 주세요.",
"Choose your active league": "이용할 리그 선택",
"A free account follows one league. Pick the one you want to keep bowling with — you choose once, and switching later is part of Pro. The rest are paused, not deleted, and everything you have logged comes back when you subscribe.": "무료 계정은 리그 하나만 기록해요. 계속 볼링할 리그를 선택하세요 — 선택은 한 번만 할 수 있고, 나중에 바꾸는 건 Pro 기능이에요. 나머지 리그는 삭제되지 않고 일시 중지되며, 구독하면 기록한 모든 내용이 다시 돌아와요.",
"Active league": "이용 중인 리그",
"Paused:": "일시 중지:",
". Practice and Just Bowling stay open either way.": ". 연습과 자유 게임은 어느 경우든 그대로 이용할 수 있어요.",
"Keep this league": "이 리그 유지",
"Saved.": "저장했어요.",
"is your active league.": "— 이용 중인 리그예요.",
"more ▾": "더 보기 ▾",
"Oil pattern": "오일 패턴",
"Which nights": "대상 날짜",
"Every night": "전체 날짜",
"Avg": "에버",
"vs your": "전체 에버리지",
"overall": "대비",
"g": "게임",
"breakpoint": "브레이크",
"Averaged over the night": "그날 전체 평균",
"Show my usual line": "평소 라인 보기",
"Follow the transition": "트랜지션 따라가기",
"Position through the block": "블록 내 위치",
"fresh oil": "새 오일",
"end of the block": "블록 끝",
"Show all": "전체 보기",
"Hide all": "전체 숨기기",
"Nothing on the lane — turn a ball back on.": "레인에 표시된 볼이 없어요 — 볼을 다시 켜 주세요.",
"on this night": "(이날 기준)",
"Solid while it skids, dashed once it turns — where it turns comes from the oil pattern rather than from anything you logged.": "미끄러지는 구간은 실선, 휘기 시작한 뒤는 점선이에요 — 어디서 휘는지는 기록한 내용이 아니라 오일 패턴으로 정해져요.",
"no pins": "남은 핀 없음",
"Rank leaves by": "남은 핀 정렬 기준",
"Top missed": "실패 많은 순",
"Top made": "처리 많은 순",
"Everything else": "기타",
"Show more": "더 보기",
"Collapse all": "모두 접기",
"Me": "나",
"Partner": "파트너",
"Nightcap": "Nightcap",
"isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "— 베이커 방식인 날에는 따라 드리지 않아요. 프레임은 볼러 한 명이 아니라 페어의 것이니까요.",
"Points Won": "획득 포인트",
"Tap to cycle: not marked → won → lost.": "탭해서 전환: 미표시 → 승 → 패.",
"Pinfall": "쓰러뜨린 핀 수",
"of 4 points": "/4포인트",
"Side Games": "사이드 게임",
"in": "참가비",
"Tonight": "오늘",
"G": "G",
"If every makeable spare had been made": "처리 가능한 스페어를 모두 처리했다면",
"Theory": "이론",
"Theory Series": "이론 시리즈",
"pins left on the lane": "개 핀을 레인에 남김",
"✓ Converted every makeable spare": "✓ 처리 가능한 스페어를 모두 처리했어요",
"actual vs": "점 실제 /",
"possible)": "점 이론상)",
"Quarter game": "25센트 게임",
"Dollar game": "1달러 게임",
"3-6-9 (whole night)": "3-6-9 (전체 게임)",
"Side games tonight": "오늘의 사이드 게임",
"Tap the ones you're in. Buy-ins are saved for": "참가하는 게임을 탭하세요. 참가비 저장 대상:",
"— you won't need to enter them again.": "— 다시 입력할 필요가 없어요.",
"Buy-in per game": "게임당 참가비",
"not playing": "참가 안 함",
"tonight · $": "(오늘) · $",
"paid in": "참가비",
"Poker Winnings ($)": "포커 상금($)",
"High Game Pot ($)": "하이 게임 팟($)",
"Highest game in the league takes it — enter what you won, if anything.": "리그에서 가장 높은 게임을 친 볼러가 가져가요 — 받은 금액이 있으면 입력하세요.",
"3-6-9 Winnings ($)": "3-6-9 상금($)",
"All nine struck — you took it": "9개 프레임 모두 스트라이크 — 팟을 획득",
", and the tenth carried for the jackpot": "하고, 10프레임까지 스트라이크로 잭팟도 획득",
"Pot": "팟",
"Jackpot": "잭팟",
"won tonight": "오늘 획득 상금",
"✓ Winnings Saved": "✓ 상금 저장됨",
"Save Winnings": "상금 저장",
"Strike %": "스트라이크율",
"Spare %": "스페어 처리율",
"10 Pins": "10번 핀 남음",
"Weak 10s": "위크 텐",
"Ringing 10s": "링잉 텐",
"Other 10s": "기타 10번 핀",
"Splits": "스플릿",
"Converted": "처리율",
"Balls used": "사용한 볼",
"Release Quality": "릴리스 품질",
"Good": "좋음",
"Bad": "나쁨",
"Misses": "미스",
"Running Averages": "누적 에버리지",
"Composite": "종합",
"Share tonight": "오늘 결과 공유",
"Set up": "준비",
"Scoring": "점수 입력",
"Side games": "사이드 게임",
"Games": "게임",
"Tonight's Session": "오늘의 리그",
"✓ Prebowling": "✓ 사전 투구",
"Prebowling for a future week?": "이후 주차의 사전 투구인가요?",
"Opponent": "상대",
"Opponent (e.g. Team Name)": "상대 (예: 팀 이름)",
"Handicap": "핸디캡",
"Starting Lane": "시작 레인",
"e.g. 8": "예: 8",
"Lanes": "레인",
"Official Pattern": "공식 패턴",
"Length (ft)": "길이 (ft)",
"Volume (mL)": "오일량 (mL)",
"Ratio (e.g. 3:1)": "비율 (예: 3:1)",
"Lane Conditions": "레인 컨디션",
"This league usually runs": "이 리그의 평소 패턴:",
". Anything you set here is for tonight only.": ". 여기서 설정한 내용은 오늘만 적용돼요.",
"Start Scoring": "점수 입력 시작",
"Cancel League": "오늘 리그 취소",
"This deletes tonight's shots, game scores and match points for": "오늘의 투구, 게임 점수, 매치 포인트를 삭제해요. 대상:",
", clears the setup, and takes you back to Home. This cannot be undone.": ". 준비 내용도 초기화하고 홈으로 돌아가요. 되돌릴 수 없어요.",
"Keep bowling": "계속 투구하기",
"Delete and exit": "삭제하고 나가기",
"Enter Game Scores": "게임 점수 입력",
"Which bag tonight?": "오늘은 어떤 가방을 쓰나요?",
"All my balls": "내 볼 전체",
"frames say": "프레임 계산:",
"Ball…": "볼…",
"Surface…": "표면…",
"Delete game": "게임 삭제:",
"? This removes the score": "? 삭제 대상: 점수",
"and every frame logged for it": "및 이 게임에 기록한 모든 프레임",
". It can't be undone.": ". 되돌릴 수 없어요.",
"+ Add game": "+ 게임 추가",
"Want to see which spares are costing you?": "어떤 스페어에서 점수를 잃고 있는지 알고 싶나요?",
"You've logged a few nights on game tracking. Tracking one game frame by frame turns those into spare conversion, carry and leave patterns. You can switch back whenever you like.": "지금까지 게임 점수만으로 몇 번 기록했어요. 한 게임을 프레임별로 기록하면 이 기록이 스페어 처리율, 캐리, 남은 핀 패턴 분석으로 이어져요. 언제든 원래 방식으로 돌아갈 수 있어요.",
"Try it for a game": "한 게임만 해 보기",
"We love leagues too! 🎳": "저희도 리그를 좋아해요! 🎳",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet — you can add one whenever you like, and tonight's scores will join it.": "참가 중인 리그를 추가하면 바로 점수를 입력할 수 있어요. 팀은 아직 없어도 돼요 — 언제든 추가할 수 있고, 오늘 점수도 그 팀에 반영돼요.",
"Add my league": "내 리그 추가",
"Show me how first": "먼저 사용법 보기",
"Want these to count for your team?": "이 점수를 팀 기록에도 반영할까요?",
"Your scores are saved and yours either way. Joining your team — or making one if it's not there yet — puts them on the team sheet as well: standings, side pots and everyone's averages in one place. Everything you've already logged in this league comes with you.": "점수는 어느 쪽이든 저장되고 내 기록으로 남아요. 팀에 가입하면 — 아직 팀이 없다면 만들면 — 팀 시트에도 올라가서 순위표, 사이드 팟, 모두의 에버리지를 한곳에서 볼 수 있어요. 이 리그에서 이미 기록한 내용도 모두 함께 옮겨져요.",
"Add or join my team": "내 팀 추가 또는 가입",
"Not now": "나중에",
"Scores above are enough. Frames below add shot and ball data.": "위의 점수만으로도 충분해요. 아래 프레임을 입력하면 투구와 볼 데이터가 추가돼요.",
"Shot Context": "투구 상황",
"10th Frame": "10프레임",
"No bowler selected": "선택된 볼러 없음",
"— pick a league above": "— 위에서 리그를 선택하세요",
"Series so far": "현재까지 시리즈",
"Frame": "프레임",
"Ball in 10th": "10프레임 투구",
"Lane": "레인",
"✏️ Edit the 10th — which ball?": "✏️ 10프레임 수정 — 몇 번째 투구인가요?",
"Fill": "보너스 투구",
"✏️ Editing Shot": "✏️ 투구 수정 중",
"Keeping score for": "기록할 볼러",
"✓ Also scoring for others": "✓ 다른 사람 점수도 기록",
"Also scoring for others": "다른 사람 점수도 기록",
"Add someone bowling with you": "함께 치는 사람 추가",
"No teammates on this league's roster yet — add them on the Social tab.": "이 리그 팀원 명단에 아직 팀원이 없어요 — ‘친구’ 탭에서 추가하세요.",
"Result": "결과",
"Required": "필수",
"everything else is optional": "나머지는 선택 사항",
"Other": "기타",
"Pins Standing": "남은 핀",
"Gutter": "거터",
"9 Pin No-Tap → scored as Strike": "9핀 노탭 → 스트라이크로 기록",
"Leave:": "남은 핀:",
"· First ball:": "· 첫 투구:",
"Strike Description": "스트라이크 유형",
"Spare Made": "스페어 처리",
"Which pins did you knock down?": "어떤 핀을 쓰러뜨렸나요?",
"Tap the ones that fell. None of them? Just save the shot.": "쓰러진 핀을 누르세요. 하나도 안 쓰러졌다면 그대로 투구를 저장하면 돼요.",
"That's every pin — we'll save this as a spare.": "핀을 모두 쓰러뜨렸어요 — 스페어로 저장할게요.",
"First ball:": "첫 투구:",
"Second ball:": "두 번째 투구:",
"Done picking pins — show the rest of the form": "핀 선택 완료 — 나머지 입력 항목 보기",
"Clear everyone's game 1 scores?": "모든 볼러의 첫 번째 게임 점수를 지울까요?",
"Later games move down one.": "이후 게임은 하나씩 앞당겨져요.",
"Scores": "점수",
"Just the final score for each game. Totals add themselves.": "각 게임의 최종 점수만 입력하세요. 합계는 자동으로 계산돼요.",
"BOWLER": "볼러",
"Total": "합계",
"Clear game 1 scores": "첫 번째 게임 점수 지우기",
"TOTAL": "합계",
"+ Add a game": "+ 게임 추가",
"Cancel Open Bowling": "자유 게임 취소",
"This deletes tonight's open bowling scores for everyone on the sheet and takes you back to Home. This cannot be undone.": "점수표에 있는 모든 볼러의 오늘 자유 게임 점수가 삭제되고 홈으로 돌아가요. 되돌릴 수 없어요.",
"Ball Change Reason": "볼 교체 이유",
"Switched from": "볼 교체:",
"— why?": "— 이유는?",
"Optional below this line": "이 아래는 선택 사항",
"Accessory details": "추가 정보",
"tap to open": "탭해서 열기",
"— pick a ball —": "— 볼 선택 —",
"Surface": "표면",
"Line": "라인",
"Stand": "스탠스",
"board #": "보드",
"Hit": "통과",
"Breakpoint": "브레이크 포인트",
"On target": "타깃 적중",
"board": "보드",
"of target": "(타깃 기준)",
"Release": "릴리스",
"Speed": "구속",
"Rev rate": "회전수",
"Axis rot.": "액시스 로테이션",
"Axis tilt": "액시스 틸트",
"Shoes": "볼링화",
"Heel #": "힐 번호",
"Sole #": "솔 번호",
"Execution": "투구 정확도",
"repeat(2, minmax(0, 1fr))": "",
"minmax(0, 1fr)": "",
"Miss": "미스",
"Tap the pins you left standing.": "남은 핀을 눌러 주세요.",
"Answer \"Spare Made\" above to save.": "저장하려면 위의 ‘스페어 처리’에 답해 주세요.",
"Nothing logged yet tonight. Shoot a game or run a drill and it lands here.": "오늘은 아직 기록이 없어요. 게임을 치거나 연습 드릴을 하면 여기에 표시돼요.",
"average": "에버리지",
"strikes": "스트라이크",
"spares": "스페어",
"clean": "클린 프레임",
"first balls struck": "(첫 투구 중 스트라이크)",
"Best carry tonight:": "오늘 캐리가 가장 좋은 볼:",
"over": "/",
"first balls": "첫 투구",
"Session Notes": "오늘 메모",
"How the night went, what to try next time…": "오늘 어땠는지, 다음에 시도해 볼 것…",
"Cancel Practice": "연습 취소",
"This deletes today's practice shots and game scores for": "오늘 연습 투구와 게임 점수를 삭제해요. 대상:",
"and takes you back to Home. This cannot be undone.": ". 그런 다음 홈으로 돌아가요. 되돌릴 수 없어요.",
"Keep practicing": "계속 연습하기",
"✓ Updated": "✓ 수정 완료",
"✓ Saved": "✓ 저장 완료",
"Update": "수정",
"Save Shot": "투구 저장",
"Open Bowling": "자유 게임",
"Enter a score first": "먼저 점수를 입력해 주세요",
"Session": "세션",
"That sign-in link didn't work — it may have expired. Send yourself a new one.": "이 로그인 링크가 작동하지 않았어요 — 만료되었을 수 있어요. 새 링크를 받아 보세요.",
"Couldn't finish signing in. Check your connection and try the link again.": "로그인을 완료하지 못했어요. 연결 상태를 확인하고 링크를 다시 열어 보세요.",
"Couldn't pour the nightcap just then. Tap to try again.": "지금은 Nightcap을 따르지 못했어요. 탭해서 다시 시도해 주세요.",
"No signal for this one. It'll still be here when you're back online.": "지금은 연결이 안 돼요. 다시 온라인이 되면 여기서 볼 수 있어요.",
"That nightcap came back in a shape the app couldn't read. Tap to try again.": "이번 Nightcap은 앱이 읽을 수 없는 형태로 도착했어요. 탭해서 다시 시도해 주세요.",
"Nightcap 🥃": "Nightcap 🥃",
"Try tracking frame data next week and we'll have a Nightcap together.": "다음 주에는 프레임 데이터도 기록해 보세요. 그러면 함께 Nightcap 한잔해요.",
"There are": "총",
"things worth saying about tonight.": "가지, 오늘 짚어 볼 만한 이야기가 있어요.",
"The Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Part of the paid plan.": "Nightcap은 오늘 하루를 되짚어 드려요 — 남은 핀이 어디에 몰렸는지, 오픈 프레임이 얼마나 손해였는지, 어떤 볼이 캐리가 좋았는지. 유료 플랜 기능이에요.",
"Pour another": "한 잔 더",
"things were true about tonight. Here are the two or three worth hearing.": "가지 사실을 오늘 기록에서 찾았어요. 그중 들어 볼 만한 두세 가지를 알려 드릴게요.",
"Pour the nightcap": "Nightcap 따르기",
"Reading back the night…": "오늘을 되짚어 보는 중…",
"first balls across": "번의 첫 투구 · 총",
"— tonight only.": "— 오늘 기록만.",
"Pattern name": "패턴 이름",
"Couldn't search for centers right now.": "지금은 볼링장을 검색할 수 없어요.",
"Welcome to": "어서 오세요",
"Who's bowling?": "누가 치나요?",
"Your name goes on your scores and is how teammates find you. The rest sets up the stats correctly — all changeable later.": "이름은 점수에 표시되고, 팀원이 나를 찾을 때도 쓰여요. 나머지는 통계를 정확하게 내기 위한 설정이에요 — 모두 나중에 바꿀 수 있어요.",
"Your name": "이름",
"Which hand?": "어느 쪽 손으로 던지나요?",
"Right": "오른쪽",
"Left": "왼쪽",
"Style": "스타일",
"One-handed": "원핸드",
"Two-handed": "투핸드",
"Where do you bowl?": "주로 어디서 치나요?",
"(optional)": "(선택)",
"Search for a center": "볼링장 검색",
"Just a first name is fine.": "성 없이 이름만 써도 돼요.",
"Got a team code from your captain?": "주장에게 받은 팀 코드가 있나요?",
"Team code": "팀 코드",
"ABCD-EFGH": "ABCD-EFGH",
"Puts you straight onto your team, with anything they've already logged for you.": "바로 팀에 가입되고, 팀에서 이미 기록해 둔 내 기록도 함께 가져와요.",
"Do you coach other bowlers?": "다른 볼러를 코칭하나요?",
"Turns on the roster for tracking who you coach.": "코칭하는 볼러를 관리하는 명단 기능이 켜져요.",
"Start Bowling": "시작하기",
"‹ Back to History": "‹ 기록으로 돌아가기",
"No game scores were saved for this night, so there are no results to show.": "이날은 저장된 게임 점수가 없어서 보여 줄 결과가 없어요.",
"Suggested new book average:": "추천하는 새 공인 에버리지:",
"Change the number below if this doesn't match your full season.": "시즌 전체 기록과 맞지 않으면 아래 숫자를 바꿔 주세요.",
"Update to": "업데이트:",
"Not Now": "나중에",
"Add a bowler on the Log tab first — profiles are per bowler.": "먼저 ‘투구’ 탭에서 볼러를 추가해 주세요 — 프로필은 볼러마다 따로 있어요.",
"Your Name": "내 이름",
"(not set)": "(설정 안 됨)",
"Scorecard Names": "점수표 이름",
"None": "없음",
"How your name shows up on the screens at your center — \"R. Nadon\", \"RYAN N\", a nickname. Adding these lets a scorecard photo find you instead of asking every time.": "볼링장 화면에 표시되는 내 이름이에요 — \"R. Nadon\", \"RYAN N\", 별명 등. 등록해 두면 점수표 사진에서 매번 묻지 않고 나를 찾아요.",
"e.g. R. Nadon": "예: R. Nadon",
"This is what teammates see when they search for you or view the roster — it defaults to your email prefix until you set it.": "팀원이 나를 검색하거나 팀원 명단을 볼 때 보이는 이름이에요 — 설정하기 전에는 이메일 주소의 @ 앞부분이 쓰여요.",
", backup": ", 백업 볼",
"Handedness": "투구 손",
"A lefty's corner pin is the 7, not the 10 — this flips the result chips on the Log tab to match.": "왼손 볼러의 코너 핀은 10번이 아니라 7번 핀이에요 — 이 설정에 맞게 ‘투구’ 탭의 결과 버튼이 반전돼요.",
"Right-handed": "오른손",
"Left-handed": "왼손",
"Strike ball": "스트라이크 볼",
"A backup ball goes out to the": "백업 볼은",
"and hooks back, so your corner pin is the": "방향으로 나갔다가 휘어 들어오기 때문에 코너 핀은",
"and your pocket is the": "번 핀, 포켓은",
". Turning this on flips every leave, split and lane drawing to match — you are still": " 포켓이 돼요. 이 옵션을 켜면 모든 남은 핀, 스플릿, 레인 그림이 그에 맞게 반전돼요 — 앱에 표시되는 투구 손은",
"-handed everywhere it says so.": "어디서나 그대로예요.",
"I throw a backup ball": "백업 볼을 던져요",
"Delivery": "투구",
"Two-handed and no-thumb players are who the 2LS drilling layout system is built for.": "2LS 지공 레이아웃 시스템은 투핸드·노섬 볼러를 위해 만들어졌어요.",
"Two-handed / no thumb": "투핸드 / 노섬",
"Drift (boards)": "드리프트(보드)",
"Boards between where you start and where you slide, counting toward the middle.": "출발 위치에서 슬라이드한 위치까지 가운데 쪽으로 움직인 보드 수예요.",
"Lateral offset (boards)": "좌우 간격(보드)",
"How far outside your slide the ball lays down. Usually 4 to 8 one-handed, less two-handed.": "슬라이드한 발에서 바깥쪽으로 얼마나 떨어진 곳에 볼이 놓이는지예요. 보통 원핸드는 4~8보드, 투핸드는 그보다 적어요.",
"Not coaching": "코칭 안 함",
"Turn this on if you coach other bowlers. It adds a view that shows their tasks and notes instead of your own game.": "다른 볼러를 코칭한다면 켜 주세요. 내 게임 대신 코칭하는 볼러의 과제와 메모를 보여 주는 화면이 추가돼요.",
"I bowl": "직접 쳐요",
"I coach": "코칭해요",
"Your league": "내 리그",
"season wrapped up": "시즌이 끝났어요",
"Not enough games logged here yet to suggest a new number": "여기에 기록된 게임이 아직 부족해서 새 수치를 추천할 수 없어요",
". You can still update it yourself below, or skip for now.": ". 아래에서 직접 업데이트하거나 이번에는 건너뛸 수 있어요.",
"Skip — I'll update it myself": "건너뛰기 — 직접 업데이트할게요",
"Book Average": "공인 에버리지",
"Not set": "설정 안 됨",
"A static number from last season — the app never changes this on its own. When a league's season ends, you'll be prompted here to update it, with a suggested number you can accept or override.": "지난 시즌의 고정 수치예요 — 앱이 스스로 바꾸지 않아요. 리그 시즌이 끝나면 여기서 업데이트하라는 안내가 뜨고, 추천 수치를 그대로 쓰거나 직접 입력할 수 있어요.",
"e.g. 213": "예: 213",
"over how many games": "기준 게임 수",
"Season (e.g. 2025-26 Winter)": "시즌(예: 2025-26 겨울)",
"Your best ever": "내 최고 기록",
"Including before you started using the app. We'll tell you when you beat them.": "앱을 쓰기 전 기록도 포함해요. 이 기록을 넘으면 알려 드릴게요.",
"Home Centers": "자주 가는 볼링장",
"None yet": "아직 없음",
"The houses this bowler plays regularly. Looked up so they match the same centers your leagues use.": "이 볼러가 자주 치는 볼링장이에요. 리그에서 쓰는 볼링장과 같은 곳으로 연결되도록 검색해서 등록해요.",
"+ Add a Center": "+ 볼링장 추가",
"Teams & Leagues": "팀과 리그",
"Not on a team": "소속 팀 없음",
"Taken from the roster on the Social tab — change it there and it updates here.": "‘친구’ 탭의 팀원 명단에서 가져와요 — 거기서 바꾸면 여기에도 반영돼요.",
"Not on any team yet.": "아직 소속된 팀이 없어요.",
"Add a ball": "볼 추가",
"Arsenal": "보유 볼",
"Balls and their drilling layouts.": "볼과 지공 레이아웃.",
"Has a plastic ball ✓": "플라스틱 볼 있음 ✓",
"Add a plastic ball": "플라스틱 볼 추가",
"Could not start checkout. Please try again in a moment.": "결제를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.",
"Could not start checkout.": "결제를 시작하지 못했어요.",
"Could not open the subscription manager. Please try again.": "구독 관리 화면을 열지 못했어요. 다시 시도해 주세요.",
"Your payment is pending. Pro unlocks once Google Play finishes processing it.": "결제가 대기 중이에요. Google Play에서 처리가 끝나면 Pro가 활성화돼요.",
"The purchase wasn't completed. You haven't been charged.": "구매가 완료되지 않았어요. 요금은 청구되지 않았어요.",
"That purchase is already linked to another account.": "이 구매는 이미 다른 계정에 연결되어 있어요.",
"no ok in response": "",
"Your purchase went through, but we couldn't confirm it just yet. Pro will unlock shortly --": "구매는 완료됐지만 아직 확인하지 못했어요. Pro는 곧 활성화돼요 --",
"reopen the app in a few minutes. You won't be charged twice.": "몇 분 후에 앱을 다시 열어 주세요. 요금이 두 번 청구되지는 않아요.",
"Pick a plan first.": "먼저 플랜을 선택하세요.",
"Something went wrong starting that. Please try again.": "시작하는 중에 문제가 생겼어요. 다시 시도해 주세요.",
"Trip 6": "6번 트립",
"Kick 7": "7번 킥",
"Free fall ·": "프리폴 ·",
"String ·": "스트링 ·",
"same": "차이 없음",
"on string": "(스트링)",
"splits excluded": "스플릿 제외",
"Messengers": "메신저",
"share of strikes": "스트라이크 중 비율",
"Splits left": "스플릿 발생",
"share of first balls": "첫 투구 중 비율",
"-pin left": "번 핀 남음",
"% of first balls": "%(첫 투구 중)",
"What's left standing on each. Darker means left more often.": "각 방식에서 서 있던 핀이에요. 색이 진할수록 더 자주 남은 핀이에요.",
"Free fall": "프리폴",
"String": "스트링",
"Biggest change on string": "스트링에서 가장 크게 달라진 남은 핀",
"described": "개 기록됨",
"How your strikes carried, from the ones you described.": "직접 기록한 스트라이크를 바탕으로 스트라이크가 어떻게 캐리됐는지 보여 줘요.",
"Numbers": "수치",
"Leaves": "남은 핀",
"Strikes": "스트라이크",
"Free Fall vs String": "프리폴 vs 스트링",
"Free fall vs string view": "프리폴 vs 스트링 보기",
"(prefers-reduced-motion: reduce)": "",
", not bowled": ", 투구 전",
"Tap any frame to edit": "프레임을 탭해서 수정",
"All teams": "모든 팀",
"Session History": "날짜별 기록",
"0 sessions": "0건",
"Nothing saved yet. Finish a night with \"Save & Finish\" on its Results tab and it lands here.": "아직 저장된 기록이 없어요. 그날의 ‘결과’ 탭에서 ‘저장하고 … 종료’ 버튼으로 마무리하면 여기에 표시돼요.",
"ten pins": "10번 핀",
"% spares": "% 스페어 처리",
"splits": "스플릿",
"More": "개 더",
"avg": "에버",
"How It Went 🎳": "오늘의 볼링 🎳",
"pins between": "핀 · 참가",
"pins first to last": "핀 차이(1위~꼴찌)",
"Practice Recap": "연습 요약",
"Best": "최고",
"Spread": "편차",
"vs Avg": "에버 대비",
"Bowling With": "함께 친 볼러",
"Compared on average — you didn't all bowl the same number of games.": "에버리지로 비교했어요 — 모두 같은 게임 수를 치지는 않았어요.",
"Drill Recap": "연습 드릴 요약",
"· may move": "· 변동 가능",
"Head To Head": "맞대결",
"You —": "나 —",
", may move": ", 변동 가능",
"attempts": "회 시도",
"Not enough attempts on one side to call a difference.": "한쪽의 시도 횟수가 적어서 차이를 판단할 수 없어요.",
"They also worked (nothing of yours to compare against):": "다른 볼러가 연습한 항목(비교할 내 기록 없음):",
"Share this": "공유하기",
"Share the night": "오늘 결과 공유하기",
"End Open Bowling": "자유 게임 종료",
"Share this practice": "이 연습 공유하기",
"Change tonight's setup": "오늘 설정 변경",
"Tonight's setup": "오늘 설정",
"Collapse": "접기",
"Bowling today?": "오늘 볼링 치나요?",
"Change either answer, then tap Done.": "어느 답이든 바꾼 다음 ‘완료’를 눌러 주세요.",
"Two quick questions and the app sets itself up for tonight.": "간단한 질문 두 개에 답하면 앱이 오늘 볼링에 맞게 준비돼요.",
"You can change this any time.": "언제든지 바꿀 수 있어요.",
"How much detail?": "얼마나 자세히 기록할까요?",
"Tester mode on — Diagnostics is now in Settings.": "테스터 모드가 켜졌어요 — 이제 ‘설정’에 ‘진단 정보’가 표시돼요.",
"Tester mode off.": "테스터 모드가 꺼졌어요.",
"turn off": "끄기",
"turn on": "켜기",
"Other bowlers have a “": "다른 볼러에게도 “",
"” too": "” 리그가 있어요",
"If it's the same league, combine yours with it. Your games and teams move across, and you'll see each other's teams.": "같은 리그라면 내 리그를 그 리그와 합치세요. 게임과 팀이 옮겨지고, 서로의 팀을 볼 수 있게 돼요.",
"No bowling center set": "볼링장 미설정",
"· you're already in it": "· 이미 참가 중",
"Combine": "합치기",
"” is already here": "” 리그가 이미 있어요",
"Is one of these your league? Joining it puts you in the same league as the bowlers already there, so you can find their teams and they can find yours.": "이 중에 내 리그가 있나요? 참가하면 이미 등록된 볼러들과 같은 리그에 들어가서, 서로의 팀을 찾을 수 있어요.",
"None of these — create mine": "해당 없음 — 새로 만들기",
"Unlock My Bowling Journey Pro": "My Bowling Journey Pro 잠금 해제",
"Unlimited leagues, full stats, and more.": "리그 무제한, 전체 통계 등.",
"Manage subscription": "구독 관리",
"See Pro": "Pro 알아보기",
"Sessions": "날짜별",
"Season": "시즌",
"Calendar": "캘린더",
"Journal": "일지",
"Shared": "공유했어요",
"Copied to clipboard": "클립보드에 복사했어요",
"High Game": "하이 게임",
"High Series": "하이 시리즈",
"200+ Games": "200점 이상 게임",
"Net": "순손익",
"Share Summary": "요약 공유",
"No sessions yet for this bowler and league.": "이 볼러와 리그의 기록이 아직 없어요.",
"Walkthroughs": "사용 가이드",
"Watch any of these again, any time.": "언제든지 다시 볼 수 있어요.",
"Watch": "보기",
"App appearance": "앱 테마",
"Each one takes its colour from a different part of the house. Dark ones for a dim centre, light ones for a bright room or daytime.": "테마마다 볼링장의 서로 다른 곳에서 색을 따왔어요. 다크 테마는 조명이 어두운 볼링장에, 라이트 테마는 밝은 실내나 낮 시간에 잘 어울려요.",
"Dark": "다크",
"Light": "얇게",
"Add a league": "리그 추가",
"Add a league, rename one, set its center and season dates, or hide one you're not bowling any more.": "리그를 추가하거나 이름을 바꾸고, 볼링장과 시즌 기간을 설정하거나, 더 이상 참가하지 않는 리그를 숨길 수 있어요.",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet.": "참가 중인 리그를 추가하면 바로 점수를 입력할 수 있어요. 팀은 아직 없어도 돼요.",
"More leagues": "더 많은 리그",
"The free plan covers one league. Bowling a second one — a summer league, or Tuesday and Thursday — is part of the paid plan. Nothing you have already logged goes anywhere.": "무료 플랜에서는 리그 1개를 이용할 수 있어요. 두 번째 리그에 참가하려면 — 여름 리그든, 화요일과 목요일 두 리그든 — 유료 플랜이 필요해요. 이미 기록한 내용은 그대로 남아 있어요.",
"League name, e.g. Tuesday Night Mixed": "리그 이름 (예: 화요일 혼성 리그)",
"Rename": "이름 변경",
"Date range (optional)": "기간 (선택)",
"Season dates": "시즌 기간",
"Nine on the first ball counts as a strike. Those are kept separate from your regular strike percentage, but still count toward how your ball carries.": "첫 투구에 핀 9개를 쓰러뜨리면 스트라이크로 인정해요. 이 스트라이크는 일반 스트라이크율과 따로 집계되지만, 볼의 캐리 계산에는 포함돼요.",
"Usual lane condition": "평소 레인 컨디션",
"Used for any night you don't record a pattern for. Leave the name blank if this league rotates.": "패턴을 기록하지 않은 날에는 이 패턴이 적용돼요. 이 리그의 패턴이 매번 바뀐다면 이름을 비워 두세요.",
"Hidden — show again": "숨김 — 다시 표시",
"Hide this league": "이 리그 숨기기",
"Won't appear when logging. Past scores still count toward your averages.": "기록할 때 표시되지 않아요. 지난 점수는 계속 에버리지에 반영돼요.",
"Add weekly reminder": "매주 알림 추가",
"team": "팀",
"in this league": "(이 리그)",
"· yours": "· 내 팀",
"Asked": "신청함",
"Ask to join": "가입 신청",
"Leave team": "팀 나가기",
"More teams": "여러 팀",
"The free plan covers one team. Your scores keep counting for the team you are already on.": "무료 플랜에서는 팀 1개만 이용할 수 있어요. 이미 소속된 팀에는 점수가 계속 반영돼요.",
"Add a team": "팀 추가",
"Your scores in this league will join it — including nights you have already logged.": "이 리그의 내 점수가 이 팀에 반영돼요 — 이미 기록한 날도 포함돼요.",
"Add a team to this league": "이 리그에 팀 추가",
"Leagues": "리그",
"Shown": "표시",
"Hidden": "숨김",
"Poker, 3-6-9, and High Game Pot tracking cards on the Log and Data tabs.": "‘투구’ 탭과 ‘통계’ 탭에 표시되는 포커, 3-6-9, 하이 게임 팟 기록 카드예요.",
"Which pots does your house run?": "내 볼링장에는 어떤 팟이 있나요?",
"Export": "내보내기",
"Your data, as spreadsheets. Sessions is one row per night; shots is one row per delivery.": "내 데이터를 스프레드시트로 받아요. 날짜별 기록은 하루당 한 줄, 투구 기록은 투구당 한 줄이에요.",
"Sessions CSV": "날짜별 CSV",
"Shots CSV": "투구 기록 CSV",
"Import scores": "점수 가져오기",
"Backup & Restore": "백업 및 복원",
"No data yet": "아직 데이터 없음",
"Save a copy of everything — shots, sessions, bowlers, arsenals, and match results — so your season is safe no matter what. If you ever open this app and your history looks empty, restore it here.": "투구, 날짜별 기록, 볼러, 보유 볼, 매치 결과까지 모든 데이터의 사본을 저장해 두면 무슨 일이 있어도 시즌 기록은 안전해요. 앱을 열었는데 기록이 비어 보이면 여기서 복원하세요.",
"Open Backup & Restore": "백업 및 복원 열기",
"Backup downloaded.": "백업을 다운로드했어요.",
"Download Backup": "백업 다운로드",
"If the download doesn't work in this environment, copy the text below instead and save it somewhere safe.": "이 환경에서 다운로드가 안 되면, 대신 아래 텍스트를 복사해서 안전한 곳에 저장하세요.",
"To restore, paste a backup below and tap Restore. This adds anything missing — it won't erase what's already here.": "복원하려면 아래에 백업을 붙여 넣고 ‘이 백업 복원’을 누르세요. 빠진 데이터만 추가되고, 이미 있는 데이터는 지워지지 않아요.",
"Paste backup JSON here…": "백업 JSON을 여기에 붙여 넣으세요…",
"Restore This Backup": "이 백업 복원",
"Refresh from the Cloud": "클라우드에서 새로고침",
"Use this if something you know you bowled is missing here": "분명히 친 기록이 여기에 없다면 이 기능을 사용하세요",
"— a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "— 표시되지 않는 날, 다른 폰에서 입력한 점수, 계속 볼링을 치는데도 더 이상 바뀌지 않는 통계 등.",
"To open fast, this app normally downloads only what has changed since it last checked. Once in a while a phone can lose its place and stop asking for something — usually after bowling somewhere with no signal, or when the same account is used on two devices. Your shots are safe in the cloud the whole time; this phone just is not asking for them.": "빠르게 열리도록 이 앱은 보통 마지막 확인 이후 바뀐 내용만 다운로드해요. 가끔 폰이 어디까지 받았는지 놓쳐서 일부 데이터를 더 이상 요청하지 않을 때가 있어요 — 주로 신호가 안 잡히는 곳에서 볼링을 친 뒤나, 같은 계정을 두 기기에서 쓸 때 그래요. 그동안에도 투구 기록은 클라우드에 안전하게 저장되어 있어요. 이 폰이 요청하지 않고 있을 뿐이에요.",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app.": "아직 저장을 기다리는 데이터를 먼저 전송한 다음, 전체 기록을 처음부터 다시 다운로드하고 앱을 다시 불러와요.",
"Nothing is deleted": "아무것도 삭제되지 않아요",
", and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": ". 기록한 내용이 사라질 일도 없어요. 평소보다 데이터를 더 많이 쓰고, 시즌이 길면 잠시 시간이 걸릴 수 있으니 Wi-Fi에 연결해 두는 게 좋아요.",
"change": "건의 변경 사항이",
"still waiting to save.": "아직 저장 대기 중이에요.",
"It": "이 변경 사항은",
"will be sent first.": "먼저 전송돼요.",
"Refreshing…": "새로 고치는 중…",
"Account": "계정",
"Signed in": "로그인됨",
"Signed in as": "로그인 계정:",
"this device": "이 기기",
"Sign out of this account?": "이 계정에서 로그아웃할까요?",
"Could not sign out. Check your connection and try again.": "로그아웃하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.",
"Sign out": "로그아웃",
"About & Legal": "앱 정보 및 법적 고지",
"Privacy Policy": "개인정보 처리방침",
"Terms of Service": "서비스 이용약관",
"Delete your account": "계정 삭제",
"Questions, or want your data deleted?": "문의 또는 데이터 삭제 요청:",
"support@mybowlingjourney.com": "support@mybowlingjourney.com",
"is published by My Bowling Journey LLC.": "앱은 My Bowling Journey LLC에서 제공해요.",
"Web version": "웹 버전",
"Diagnostics": "진단 정보",
"Nothing logged": "기록된 문제 없음",
"What went wrong on this phone, and why — failed saves, sync errors, imports that fell back. Copy it and paste it to whoever asked.": "이 휴대폰에서 무엇이 왜 잘못됐는지 보여 줘요 — 저장 실패, 동기화 오류, 대체 방식으로 처리된 가져오기 등. 복사해서 요청한 사람에게 붙여 넣어 보내 주세요.",
"Copied": "복사했어요",
"Couldn't copy on this device": "이 기기에서는 복사할 수 없어요",
"Copy log": "로그 복사",
"Tester mode. Tap the \"published by\" line in About & Legal seven times to turn it off.": "테스터 모드예요. 끄려면 ‘앱 정보 및 법적 고지’에서 ‘…에서 제공해요’ 줄을 7번 탭하세요.",
"Danger Zone": "위험 구역",
"Clear All Data": "모든 데이터 삭제",
"Removes your bowling history including your shots, match results and lane notes. Your account, profile, arsenal and teams are unaffected.": "투구, 경기 결과, 레인 메모 등 볼링 기록을 삭제해요. 계정, 프로필, 보유 볼, 팀은 그대로 유지돼요.",
"This deletes every logged shot, session, match result (opponents, handicaps, win/loss), and lane condition note. This can't be undone. Consider downloading a backup above first.": "기록한 모든 투구, 세션, 경기 결과(상대, 핸디캡, 승패), 레인 컨디션 메모를 삭제해요. 되돌릴 수 없어요. 먼저 위에서 백업을 다운로드해 두는 걸 권해요.",
"Yes, Delete Everything": "예, 모두 삭제",
"Delete My Account": "계정 삭제",
"Removes your account and everything in it, permanently.": "계정과 계정 안의 모든 데이터를 영구적으로 삭제해요.",
"This deletes your account and": "계정과 계정에",
"everything attached to it": "연결된 모든 데이터",
"— every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "— 모두 삭제돼요: 모든 투구와 세션, 프로필과 이름, 보유 볼, 목표, 팀 소속까지요. 다시 로그인할 수 없고, 저희도 복구해 드릴 수 없어요.",
"Leagues and teams you created are kept only if other bowlers are still using them, so nobody loses a league they're bowling in. Any that nobody else is in go with everything else.": "직접 만든 리그와 팀은 다른 볼러가 아직 사용 중일 때만 남겨 둬요. 그래서 참가 중인 리그를 잃는 사람은 없어요. 다른 사람이 아무도 없는 리그와 팀은 나머지 데이터와 함께 삭제돼요.",
"Want a copy first? Use": "먼저 사본을 받아 두고 싶나요? 진행하기 전에 위의",
"above before you do this.": "기능을 사용하세요.",
"to confirm": "입력해서 확인",
"Couldn't delete the account.": "계정을 삭제하지 못했어요.",
"Deleting…": "삭제 중…",
"Permanently Delete": "영구 삭제",
"Test account — everything unlocked": "테스트 계정 — 모든 기능 잠금 해제",
"Ending — you keep Pro until the period you paid for runs out": "해지 예정 — 결제한 기간이 끝날 때까지 Pro를 이용할 수 있어요",
"There's a problem with your payment method": "결제 수단에 문제가 있어요",
"You're subscribed": "구독 중",
"Share": "공유",
"Trend": "추이",
"Preparing…": "준비 중…",
"Copied — paste it anywhere": "복사했어요 — 원하는 곳에 붙여 넣으세요",
"Couldn't share on this device": "이 기기에서는 공유할 수 없어요",
"Share card": "공유 카드",
"Press and hold the card to save or share it.": "카드를 길게 눌러 저장하거나 공유하세요.",
"Copy text": "텍스트 복사",
"Wrong email or password.": "이메일 또는 비밀번호가 올바르지 않아요.",
"Couldn't sign in.": "로그인하지 못했어요.",
"Couldn't send the code. Try again.": "코드를 보내지 못했어요. 다시 시도해 주세요.",
"That code didn't work. Check it, or send a new one.": "코드가 맞지 않아요. 다시 확인하거나 새 코드를 받아 보세요.",
"Couldn't verify that code.": "코드를 확인하지 못했어요.",
"Sign in to log your own games and see the team's stats.": "로그인하면 내 게임을 기록하고 팀 통계를 볼 수 있어요.",
"Email": "이메일",
"Password": "비밀번호",
"Signing in…": "로그인 중…",
"Sign In": "로그인",
"Check your email": "이메일을 확인하세요",
"We sent a": "코드",
"-digit code to": "자리를 다음 주소로 보냈어요:",
"The same email has a sign-in link in it, if you'd rather tap that.": "같은 메일에 로그인 링크도 들어 있어요. 탭하는 게 편하면 링크를 쓰세요.",
"The code lasts an hour.": "코드는 1시간 동안 유효해요.",
"Use a different email": "다른 이메일 사용하기",
"Opening Google…": "Google 여는 중…",
"Continue with Google": "Google로 계속하기",
"or": "또는",
"Sending…": "보내는 중…",
"Email Me a Code": "이메일로 코드 받기",
"No password needed — we'll email you a code.": "비밀번호는 필요 없어요 — 이메일로 코드를 보내 드려요.",
"Knockdown": "쓰러뜨린 핀",
"Pick a league above": "위에서 리그를 선택하세요",
"Nothing to count yet": "아직 집계할 게 없어요",
"Log a few frames and this fills in — strike rate, spares, ten pins, and how each ball is carrying.": "몇 프레임만 기록하면 여기가 채워져요 — 스트라이크율, 스페어, 10번 핀, 볼별 캐리까지.",
"Viewing": "보기 대상",
"(you)": "(나)",
"Teams": "팀",
"Compare To": "비교 대상",
"Nobody to compare against yet. Add a friend, or set up your team — teammates are added as friends automatically.": "아직 비교할 상대가 없어요. 친구를 추가하거나 팀을 설정해 보세요 — 팀원은 자동으로 친구로 추가돼요.",
"Manage friends": "친구 관리",
"Add a friend": "친구 추가",
"Clean Frame %": "클린 프레임 비율",
"Split Rate": "스플릿 비율",
"10-Pin Spare %": "10번 핀 스페어 처리율",
"Single-Pin Spare %": "싱글 핀 스페어 처리율",
"First-Ball Avg": "1구 평균",
"Leave Avg": "스트라이크 외 1구 평균",
"Head-to-Head": "맞대결",
"Every rate stat side by side against": "모든 비율 통계를 나란히 비교해요. 비교 대상:",
", instead of hunting through separate cards. Split Rate is the one metric here where lower is better.": ". 카드를 하나씩 찾아볼 필요가 없어요. 여기서 스플릿 비율만은 낮을수록 좋은 지표예요.",
"Team Records": "팀 기록",
"to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.": ". 선택하면 볼 수 있어요 — 하이 게임/하이 시리즈는 특정 팀원 명단 하나가 필요해요. 인원이 다른 팀을 합치면 볼러가 더 많은 팀이 부당하게 유리해지기 때문이에요.",
"Season record": "시즌 전적",
"points won": "획득 포인트",
"points (": "포인트(게임",
"games,": ", 총 핀 수",
"pinfall)": ")",
"Weekly Points": "주간 포인트",
"Points won each week, out of 4 — Season Record only shows the running total, never when those points actually came. Shows momentum: a hot streak or a slump.": "매주 획득한 포인트(4포인트 중) — ‘시즌 전적’은 누적 합계만 보여 줄 뿐, 그 포인트를 실제로 언제 땄는지는 알 수 없어요. 상승세인지 슬럼프인지, 흐름을 보여 줘요.",
"Points won": "획득 포인트",
"Handicap Impact": "핸디캡 영향",
"to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.": ". 선택하면 볼 수 있어요 — ‘팀’은 여러 리그의 경기를 섞은 것이 아니라 특정 팀원 명단 하나를 뜻해야 해요.",
"Points-won rate split by handicap size — shows whether the team does better closer to scratch or with a bigger handicap cushion.": "핸디캡 크기별 포인트 획득률 — 팀이 스크래치에 가까울 때와 핸디캡 여유가 클 때 중 언제 더 잘하는지 보여 줘요.",
"Points won %": "포인트 획득률",
"Team Leaderboard": "팀 내 순위",
"% stk": "% 스트라이크",
"Giant Killer": "자이언트 킬링",
"to see this — it needs a specific roster to know who's on top.": ". 선택하면 볼 수 있어요 — 누가 선두인지 알려면 특정 팀원 명단이 필요해요.",
"No comparisons yet — the first week just sets the baseline average for everyone. Once a second week is logged, that week's giant (whoever had the best average entering it) gets challenged and this fills in.": "아직 비교한 결과가 없어요 — 첫 주는 모두의 기준 에버리지만 정해요. 두 번째 주가 기록되면 그 주의 자이언트(그 주를 시작할 때 에버리지가 가장 높았던 볼러)에게 도전이 시작되고 여기가 채워져요.",
"% of games each bowler beat that week's reigning giant, game-by-game — the giant is whoever had the highest average entering that week, based only on weeks before it (never that week's own results). The very first week ever logged sets the baseline with no giant to challenge yet; the hunt starts week two. Locked in per week — if the title changes hands later, earlier weeks stay compared against whoever actually held it at the time. \"Weeks on top\" counts how many weeks they themselves held the title.": "각 볼러가 그 주의 현 자이언트를 이긴 게임의 비율(%)로, 게임마다 비교해요 — 자이언트는 그 주를 시작할 때 에버리지가 가장 높았던 볼러이며, 그 이전 주들의 기록만으로 정해요(그 주 자체의 결과는 절대 쓰지 않아요). 맨 처음 기록된 주는 기준만 정할 뿐 아직 도전할 자이언트가 없고, 자이언트 사냥은 둘째 주부터 시작돼요. 결과는 주마다 확정돼요 — 나중에 타이틀 주인이 바뀌어도 이전 주들은 당시 실제로 타이틀을 가졌던 볼러와 비교한 그대로 남아요. ‘주 선두’는 그 볼러 자신이 타이틀을 가졌던 주의 수예요.",
"wk": "주",
"on top": "선두",
"games": "게임",
"🎣 Hung": "🎣 혼자만 놓친 스트라이크",
"to see this — it needs a specific roster to know who else was bowling that frame.": ". 선택하면 볼 수 있어요 — 그 프레임에서 누가 함께 투구했는지 알려면 특정 팀원 명단이 필요해요.",
"Nobody's been hung yet — every strike in this data has had at least one teammate join in, or company on the miss.": "아직 혼자만 빠진 볼러가 없어요 — 이 데이터의 모든 스트라이크에는 함께 스트라이크를 친 팀원이 적어도 한 명 있었거나, 놓쳤을 때 같이 놓친 팀원이 있었어요.",
"Every teammate struck that frame except them. The wall of shame.": "그 프레임에서 이 볼러만 빼고 팀원 전원이 스트라이크. 불명예의 전당이에요.",
"Team Series": "팀 시리즈",
"Team Total": "팀 합계",
"Tu": "화",
"Th": "목",
"Clean frames": "클린 프레임",
"of frames closed out": "오픈 없이 마친 프레임 비율",
"Frame Position": "프레임별 성적",
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where": "게임별이 아니라 프레임 번호별로 나눠 봤어요 — 매번 볼링할 때 핀을 남기기 쉬운 특정 시점(워밍업, 레인 트랜지션, 9프레임에서 점수 계산하다 집중이 흐트러지는 순간)이 있는지 보여 줘요. 대상:",
"tends to leave pins, regardless of which game it is.": "— 몇 번째 게임이든 상관없이 봐요.",
"Weighted quality score, strict priority order: strike beats every spare, a non-split spare beats every split spare, and within each of those a leave with fewer pins standing scores higher — an open frame always scores lowest, ranked by total pinfall.": "품질에 가중치를 둔 점수로, 우선순위가 엄격해요: 스트라이크는 어떤 스페어보다 높고, 스플릿이 아닌 스페어는 어떤 스플릿 스페어보다 높으며, 각 그룹 안에서는 남은 핀이 적을수록 점수가 높아요 — 오픈 프레임은 항상 가장 낮고, 쓰러뜨린 핀 수 합계로 순위를 매겨요.",
"⚠️ Only": "⚠️ 아직",
"logged — each frame number needs at least": "기록됐어요 — 실제 패턴과 우연을 구분하려면 프레임 번호마다 최소",
"to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.": "게임이 필요해요. 그때까지는 결론이 아니라 미리 보기 정도로 봐 주세요.",
"Weakest": "가장 약함",
"Strongest": "가장 강함",
"Weakest:": "가장 약함:",
") · Strongest:": ") · 가장 강함:",
"Every frame is even on this metric — no standout weak spot.": "이 지표로는 모든 프레임이 똑같아요 — 눈에 띄는 약점이 없어요.",
"First-Ball Average": "첫 투구 평균",
"Average pins on every fresh-rack delivery — every frame's first ball, plus any 10th-frame bonus ball thrown at a full reset rack — strikes counted as 10. The standard metric, comparable to LaneTalk and other scoring apps.": "핀 10개가 모두 선 상태에서 던진 투구의 평균 핀 수예요 — 모든 프레임의 첫 투구에 더해, 10프레임에서 핀 10개가 다시 세워진 상태로 던진 보너스 투구까지 포함하고, 스트라이크는 10으로 계산해요. 표준 지표라서 LaneTalk 등 다른 점수 앱과 비교할 수 있어요.",
"pins per fresh rack": "10핀 상태 투구당 평균 핀 수",
"vs": "대",
"Leave Average": "스트라이크 외 첫 투구 평균",
"Same fresh-rack deliveries, but only the ones that weren't a strike — isolates how good the leave is on a miss, separate from strike rate.": "같은 10핀 상태 투구 중 스트라이크가 아니었던 것만 봐요 — 스트라이크율과 별개로, 스트라이크를 놓쳤을 때 남은 핀이 얼마나 좋은지 따로 보여 줘요.",
"pins when you don't strike": "스트라이크가 아닐 때 평균 핀 수",
"Ten pins": "10번 핀",
"of your ten pins converted": "10번 핀 스페어 처리율",
"Ten-pin leave rate": "10번 핀이 남는 비율",
"Single pin spares": "싱글 핀 스페어",
"of splits converted": "스플릿 처리율",
"Split rate": "스플릿 비율",
"✋ Hand Up": "✋ 손 들기",
"to see who owes a round.": "— 누가 한턱 쏠 차례인지 볼 수 있어요.",
"Nobody's missed a lone 5 yet. Hands stay down.": "아직 5번 핀 하나 남은 걸 놓친 사람이 없어요. 모두 손 내리고 있어요.",
"Lone 5-pins missed. Each one owes a drink to everyone with a hand up.": "5번 핀 하나만 남았을 때 놓친 횟수예요. 한 번 놓칠 때마다 손을 든 모두에게 한 잔씩 사야 해요.",
"Bowler": "볼러",
"5s missed": "5번 핀 미스",
"Non-Split Leaves": "스플릿 외 남은 핀",
"Every recurring leave that isn't a split — how often it happens and how often it gets converted.": "스플릿이 아닌, 반복해서 나오는 남은 핀 전체예요 — 얼마나 자주 남는지, 얼마나 자주 처리하는지 보여 줘요.",
"Longest strike streak": "최장 연속 스트라이크",
"in a row": "연속",
"Consecutive strikes, carrying across games within the same night.": "연속 스트라이크 수예요. 같은 날 치른 게임끼리는 이어서 세요.",
"By Ball": "볼별",
"Miss Distribution": "미스 분포",
"Ball Change Triggers": "볼 교체 이유",
"Strike Quality": "스트라이크 품질",
"Top number is the average bowler's score. \"Team\" below it is what the whole team scores together that game.": "위 숫자는 볼러 1인 평균 점수예요. 그 아래 ‘팀’은 그 게임에서 팀 전체가 함께 낸 점수예요.",
"Combined spans all leagues, so there's no single team to compare it against — pick a specific bowler under \"Compare To\", or select a specific league above.": "‘종합’은 모든 리그를 합친 값이라 비교할 팀이 하나로 정해지지 않아요 — ‘비교 대상’에서 특정 볼러를 고르거나, 위에서 특정 리그를 선택하세요.",
"Theoretical Average": "이론상 에버리지",
"What the average would be if every makeable spare (not a split, not a washout) had been made — including a theoretical 10th-frame fill ball, estimated from each game's own recent first-ball average at that point.": "처리할 수 있는 스페어(스플릿과 워시아웃 제외)를 모두 처리했다면 나왔을 에버리지예요 — 10프레임의 이론상 보너스 투구도 포함하며, 이는 각 게임의 그 시점까지의 최근 첫 투구 평균으로 추정해요.",
"if you'd made every makeable spare": "처리할 수 있는 스페어를 모두 처리했다면",
"This Season vs Last": "이번 시즌 vs 지난 시즌",
"Level": "변화 없음",
"Progress to Next Milestone": "다음 마일스톤까지 진행도",
"Tracked in 5-pin steps": "5핀 단위로 추적해요",
"— the team's average bowler": "(팀 볼러 1인 평균 기준)",
"% to": "% 달성, 목표",
"Next Session (": "다음 회차(",
"Games)": "게임)",
"You're averaging": "현재 에버리지:",
"across": "·",
"games. Here's what the next set does to it.": "게임 기준. 다음 시리즈 결과에 따라 아래처럼 달라져요.",
"Gaining a full point isn't reachable in one set at this average.": "현재 에버리지에서는 한 시리즈만으로 에버리지를 1점 올릴 수 없어요.",
"No set this session can drop the average a full point.": "이번 시리즈에서는 어떤 점수를 쳐도 에버리지가 1점 떨어지지 않아요.",
"Score Consistency": "점수 안정성",
"How steady their game scores are night to night, independent of the average itself. Lower is steadier.": "에버리지 자체와는 별개로, 날마다 게임 점수가 얼마나 꾸준한지 보여 줘요. 낮을수록 꾸준해요.",
"How steady the team's combined game totals are night to night — not each bowler's individual scores. Lower is steadier.": "팀의 게임 합계 점수가 날마다 얼마나 꾸준한지 보여 줘요 — 볼러 개인 점수가 아니에요. 낮을수록 꾸준해요.",
"pins either side of your average": "에버리지 기준 위아래 핀",
"team games": "게임(팀 합계)",
"Score Distribution": "점수 분포",
"The actual shape behind the std. dev. above — tightly bunched around the average, or a long tail of bad nights dragging it down.": "위 표준편차의 실제 모양이에요 — 에버리지 주변에 촘촘히 모여 있는지, 부진한 날들이 긴 꼬리를 만들며 끌어내리는지 보여 줘요.",
"Game-by-Game Averages": "게임 순서별 에버리지",
"Composite average at each position in the night, across the whole season — shows whether": "시즌 전체에서, 그날 몇 번째 게임인지에 따른 종합 에버리지예요. 초반, 중반, 후반 중 언제 더 잘 치는지 보여 줘요 —",
"the team is": "팀",
"bowling better early, middle, or late.": "기준.",
"\"Team\" is what the whole team scores together at that position.": "‘팀’은 그 순서의 게임에서 팀 전체가 함께 낸 점수예요.",
"Team:": "팀:",
"Poker": "포커",
"High Game Pot": "하이 게임 팟",
"Team Side Games": "팀 사이드 게임",
"Season totals across every side game — what came in, what it cost to play, and what actually stuck.": "모든 사이드 게임의 시즌 합계예요 — 획득 상금, 참가비, 그리고 실제로 남은 돈.",
"won this season": "이번 시즌 획득 상금",
"By Game": "종목별",
"Buy-in": "참가비",
"Won": "획득 상금",
"3-6-9 Tracker": "3-6-9 트래커",
"Strike frames 3, 6, and 9 of every game (games 1, 2, and 3 -- all 9 strikes) to win the pot for the night. Also throw a full turkey in game 3's 10th frame to additionally earn the jackpot.": "매 게임 3, 6, 9프레임에서 스트라이크를 치면(첫 번째~세 번째 게임 모두 — 스트라이크 총 9개) 그날의 팟을 가져가요. 여기에 세 번째 게임의 10프레임에서 터키까지 치면 잭팟도 추가로 받아요.",
"won on 3-6-9": "3-6-9 획득 상금",
"By Bowling Center": "볼링장별",
"How you score house to house. Only leagues with a center set are included — set them under Team.": "볼링장마다 점수가 어떻게 다른지 보여 줘요. 볼링장이 지정된 리그만 포함돼요 — ‘팀’에서 지정하세요.",
"Comparison": "비교",
"Comparing two things — bowlers, balls, houses, patterns or seasons — is part of the paid plan. Everything about your own game stays free.": "두 대상을 비교하는 기능은 — 볼러, 볼, 볼링장, 오일 패턴, 시즌 모두 — 유료 플랜에 포함돼요. 내 게임에 관한 건 전부 계속 무료예요.",
"this card": "이 카드",
"Not yet": "아직 기록 없음",
"Unhide Stat Cards (": "숨긴 통계 카드 표시 (",
"Something went wrong.": "문제가 발생했어요.",
"You're on Pro": "Pro 이용 중",
"Thanks for subscribing. Everything is unlocked.": "구독해 주셔서 감사해요. 모든 기능을 이용할 수 있어요.",
"Manage or cancel any time in the Play Store app, under Subscriptions.": "Play 스토어 앱의 ‘정기 결제’에서 언제든지 관리하거나 해지할 수 있어요.",
"Your subscription is ending": "구독이 곧 종료돼요",
"You are subscribed": "구독 중이에요",
"when the period you paid for runs out": "결제한 기간이 끝나는 시점에",
"Everything is unlocked.": "모든 기능을 이용할 수 있어요.",
"Manage or cancel your subscription in the Play Store app, under Subscriptions.": "구독 관리와 해지는 Play 스토어 앱의 ‘정기 결제’에서 할 수 있어요.",
"Opening…": "여는 중…",
"Resume subscription": "구독 재개",
"Test account.": "테스트 계정.",
"Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "결제 여부와 관계없이 모든 기능이 이미 열려 있어요. 결제 과정을 테스트하려면 아래에서 구매할 수도 있어요.",
"Your scores, spares and ball numbers stay free, always. Pro is for the comparisons — and for the parts that think about your night for you.": "점수, 스페어, 볼별 수치는 언제까지나 무료예요. Pro는 비교 기능 — 그리고 오늘 경기를 대신 분석해 주는 기능을 위한 플랜이에요.",
"Every league and team you bowl in": "참가하는 모든 리그와 팀",
"(free keeps": "(무료 이용 가능 리그 수:",
"Ball against ball, house against house, pattern against pattern": "볼끼리, 볼링장끼리, 오일 패턴끼리 비교",
"Head to head with friends and teammates": "친구·팀원과의 맞대결",
"This season against last": "이번 시즌과 지난 시즌 비교",
"Nightcap, Insights, Brooklyn and coaching": "Nightcap, 분석, Brooklyn, 코칭",
"Scorecard import": "점수표 가져오기",
"Choose a plan": "플랜 선택",
"Yearly ·": "연간 ·",
"Monthly ·": "월간 ·",
"Your": "오늘부터",
"-day free trial starts today. When it ends, the": "일 무료 체험이 시작돼요. 체험이 끝나면",
"plan starts at": "플랜으로 전환돼요. 요금:",
"and renews on its own until you cancel.": "— 해지할 때까지 자동으로 갱신돼요.",
"The": "선택한",
"plan is": "플랜 요금:",
". Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": ". 확정하기 전에 무료 체험이 내 계정에 적용되는지 Google Play에서 보여 주고, 그 후에는 해지할 때까지 자동으로 갱신돼요.",
"You have already had the free trial, so the": "무료 체험을 이미 이용했기 때문에",
"plan starts today at": "플랜이 오늘 시작돼요. 요금:",
"Cancel any time": "해지는 언제든지",
"in the Play Store app under Subscriptions": "Play 스토어 앱의 ‘정기 결제’에서 할 수 있어요",
"from the link in your receipt": "영수증에 있는 링크에서 할 수 있어요",
"— you keep Pro until the end of the period you have paid for.": "— 결제한 기간이 끝날 때까지 Pro를 계속 이용할 수 있어요.",
"If you stop, nothing you have logged is deleted. One league stays active and the rest are paused until you come back.": "구독을 중단해도 기록한 내용은 하나도 삭제되지 않아요. 리그 하나는 계속 활성 상태로 남고, 나머지는 다시 돌아올 때까지 일시 중지돼요.",
"Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.": "",
"Create a .env file at the project root — see supabaseClient.js for the format.": "",
"(no match)": "",
"Tuesday House Shot": "화요일 하우스 패턴",
"Thursday House Shot": "목요일 하우스 패턴",
"Too many tries. Wait a little and try again.": "시도 횟수가 너무 많아요. 잠시 후 다시 시도해 주세요.",
"Couldn't join just now. Check your connection and try again.": "지금은 가입할 수 없어요. 연결 상태를 확인하고 다시 시도해 주세요.",
"That code didn't match a team. Check it with whoever sent it.": "이 코드와 일치하는 팀이 없어요. 코드를 보낸 사람에게 확인해 주세요.",
"Couldn't do that just now. It may already have been answered — pull down to refresh.": "지금은 처리할 수 없어요. 이미 응답이 끝났을 수도 있어요 — 아래로 당겨서 새로고침해 주세요.",
"Couldn't send that just now. Check your connection and try again.": "지금은 보낼 수 없어요. 연결 상태를 확인하고 다시 시도해 주세요.",
"Make a new code? The old one stops working, so anyone you sent it to will need the new one.": "새 코드를 만들까요? 이전 코드는 더 이상 쓸 수 없어서, 코드를 받은 사람은 모두 새 코드가 필요해요.",
"There's already a pending invite for that email on this team.": "이 팀에는 해당 이메일로 보낸 초대가 이미 대기 중이에요.",
"Add an email, or tick “I don’t have their email” to get a code you can text them. Either way they need a way to claim this spot themselves.": "이메일을 입력하거나 ‘문자로 코드 보내기’를 선택해 문자로 보낼 코드를 받으세요. 어느 쪽이든 본인이 직접 이 자리를 가져갈 방법이 필요해요.",
"That doesn't look like an email address.": "이메일 주소 형식이 아닌 것 같아요.",
"Loading teams…": "팀 불러오는 중…",
"Couldn't load your teams. You may be offline.": "팀을 불러오지 못했어요. 오프라인 상태일 수 있어요.",
"Waiting to join your team": "팀 가입 요청",
"wants to join": "님이 가입을 요청한 팀:",
"+ Add team": "+ 팀 추가",
"A team belongs to a league. Add your league on the League tab first, then come back here.": "팀은 리그에 속해요. 먼저 ‘리그’ 탭에서 리그를 추가한 뒤 여기로 돌아오세요.",
"OK": "확인",
"New team": "새 팀",
"Pick the league this team bowls in": "이 팀이 참가하는 리그 선택",
"Team name": "팀 이름",
"e.g. Split Happens": "예: 스플릿 해결사",
"Create team": "팀 만들기",
"Join a team": "팀 가입",
"You're invited to": "초대받은 팀:",
"Got a team code from a teammate? Enter it here.": "팀원에게 팀 코드를 받았나요? 여기에 입력하세요.",
"ABCD-1234": "ABCD-1234",
"No code? Find your team in your league and ask to join. Anyone on the team can approve you.": "코드가 없나요? 리그에서 내 팀을 찾아 가입을 요청하세요. 팀원 누구나 승인할 수 있어요.",
"Pick a league": "리그 선택",
"Looking…": "찾는 중…",
"No teams in this league yet. You can make one with Add team.": "이 리그에는 아직 팀이 없어요. ‘팀 추가’로 만들 수 있어요.",
"Your team": "내 팀",
"Asked to join": "가입 요청:",
"— waiting for someone on the team to approve.": "— 팀원의 승인을 기다리는 중이에요.",
"Withdraw": "취소",
"No teams yet. Tap Add team, or add one under a league on the League tab.": "아직 팀이 없어요. ‘팀 추가’를 탭하거나 ‘리그’ 탭에서 리그 아래에 추가하세요.",
"Team Name": "팀 이름",
"Team code — text it to teammates so they can join": "팀 코드 — 팀원에게 문자로 보내면 가입할 수 있어요",
"Copy": "복사",
"Make a new code; the old one stops working": "새 코드 만들기 (이전 코드는 더 이상 쓸 수 없어요)",
"New": "새 코드",
"Roster / Bowling Order": "팀원 명단 / 투구 순서",
"Just you so far — add teammates below, or leave it and come back to it. Your scores count either way.": "아직은 나 혼자예요 — 아래에서 팀원을 추가하거나, 나중에 다시 와도 돼요. 어느 쪽이든 내 점수는 반영돼요.",
"Bowling hand — tap to switch": "투구하는 손 — 탭해서 바꾸기",
"Sub — tap to toggle": "대체 선수 — 탭해서 켜기/끄기",
"Sub ✓": "대체 ✓",
"Sub": "대체",
"invited · not signed in yet": "초대함 · 아직 로그인 안 함",
"placeholder · no email on file": "임시 등록 · 이메일 없음",
"— invited, waiting for them to accept": "— 초대함, 수락 대기 중",
"Add Someone Not Signed Up Yet": "아직 가입하지 않은 사람 추가",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with their email, they're linked the moment they sign in with that exact address; with a code, you get one to text them and they enter it when they sign up.": "지금 팀원 명단에 자리를 맡아 둬요 — 아직 계정이 없어도 ‘기록할 볼러’에서 바로 그 사람 이름으로 점수를 기록할 수 있어요. 어느 방법이든 본인이 직접 이 자리를 가져가고, 그동안 기록한 내용은 모두 그대로 남아 있어요. 이메일을 고르면 본인이 정확히 그 주소로 로그인하는 순간 연결돼요. 코드를 고르면 받은 코드를 문자로 보내 주고, 본인이 가입할 때 입력해요.",
"Their name": "이름",
"I have their email": "이메일 주소를 알아요",
"Text them a code": "문자로 코드 보내기",
"Their email": "이메일 주소",
"They will get a code to enter when they sign up. It links them to this spot the same way an email invite does.": "그 볼러는 가입할 때 입력할 코드를 받게 돼요. 이메일 초대와 똑같이 이 자리에 연결돼요.",
"Add to Roster": "명단에 추가",
"Skip": "건너뛰기",
"Start bowling": "투구 시작하기",
"Next": "다음",
"Your history:": "내 기록:",
"avg over": "에버리지 ·",
"Low": "최저",
"Untitled": "제목 없음",
"no date": "날짜 없음",
"· made cut": "· 컷 통과",
"· missed cut": "· 컷 탈락",
"Oil Pattern": "오일 패턴",
"e.g. Krypton, or type your own": "예: Krypton 또는 직접 입력",
"+ Save \"": "+ ‘",
"\" for next time": "’ 다음에도 쓸 수 있게 저장",
"Length, ratio, and volume are optional — fill in whatever you know.": "길이, 비율, 오일량은 선택 사항이에요 — 아는 것만 입력해 주세요.",
"Feet": "피트",
"Ratio e.g. 3:1": "비율 예: 3:1",
"Squad Details": "조 정보",
"Remove Day": "일차 삭제",
"Start Time": "시작 시간",
"Squad": "조",
"e.g. A": "예: A",
"Block #": "블록 번호",
"e.g. 2": "예: 2",
"Go to scoring": "점수 입력으로 이동",
"Pins vs 200 avg": "에버 200 대비 핀",
"(all blocks so far)": "(지금까지 전체 블록)",
"Go to": "이동:",
"match play": "매치 플레이",
"the stepladder": "스텝래더",
"This block": "‘이 블록",
"s frames are logged under": "의 프레임이 기록된 날짜는",
", not": ", 블록 날짜는",
"Move them to": "옮길 날짜:",
"+ Game": "+ 게임",
"Tournaments usually move pairs after every game, so each game gets its own.": "대회에서는 보통 게임마다 레인을 옮기기 때문에, 게임마다 레인을 따로 입력해요.",
"Pair": "레인",
"Day Notes": "당일 메모",
"Transition, ball reaction, what worked…": "트랜지션, 볼 반응, 잘 통했던 것…",
"Brackets & Side Pots": "브래킷 및 사이드 팟",
"Tracked separately from the main entry, so you can see which of these actually pay for themselves.": "메인 참가비와 따로 기록하니, 이 중 어떤 게 실제로 본전을 뽑는지 알 수 있어요.",
"Label (optional)": "이름(선택)",
"Entries": "엔트리 수",
"$ Each": "엔트리당 $",
"Cost $": "비용 $",
"won in brackets": "브래킷 획득 상금",
"The head-to-head block after the cut. Bonus pins vary by tournament — set them to whatever this event uses.": "컷 통과 후 치르는 맞대결 블록이에요. 보너스 핀은 대회마다 다르니, 이 대회 규정에 맞게 설정하세요.",
"Date bowled": "경기 날짜",
"Bonus per win": "승리당 보너스",
"Bonus per tie": "무승부당 보너스",
"Match": "경기",
"by": "점수 차",
"Track frames": "프레임 기록하기",
"Opp hcp": "상대 핸디",
"+ Add Match": "+ 경기 추가",
"Go to the stepladder": "스텝래더로 이동",
"Sudden death, no bonus pins. Enter the seeds and the app works out where you finished.": "단판 승부이고 보너스 핀은 없어요. 시드를 입력하면 최종 순위를 앱이 계산해요.",
"e.g. 3": "예: 3",
"Step": "스텝",
"+ Add Step": "+ 스텝 추가",
"Steps": "스텝",
"nothing further": "없음",
"How it went": "대회 돌아보기",
"With handicap": "핸디 포함",
"Block": "블록",
"average over": "에버리지 ·",
"Bonus": "보너스",
"pins vs opponents": "핀 (상대 대비)",
"Best: match": "최대 승리: 경기",
"Worst: match": "최대 패배: 경기",
"On to": "다음 단계:",
"Share this tournament": "이 대회 공유",
"is saved to your history. Bowling another block of it, or starting a new tournament?": "대회는 기록에 저장돼 있어요. 이 대회의 다른 블록을 투구할까요, 아니면 새 대회를 시작할까요?",
"Another block": "다른 블록",
"New tournament": "새 대회",
"e.g. Spring Masters": "예: 스프링 마스터스",
"e.g. Bowlero Pittsburgh": "예: 강남볼링센터",
"Handicap per game": "게임당 핸디캡",
"e.g. 40": "예: 40",
"Bowling with": "파트너",
"Partner's name": "파트너 이름",
"Who bowls frame 1": "1프레임 투구자",
"You bowl frames": "내 담당 프레임:",
"every game": "(매 게임)",
"in game 1, then you swap each game": "(첫 번째 게임 기준, 이후 게임마다 교대)",
". The score stays out of your average since you did not bowl it alone, but your own frames still count.": ". 혼자 투구한 게임이 아니라서 점수는 에버리지에 반영되지 않지만, 내가 투구한 프레임은 집계돼요.",
"Alternate who leads off each game": "게임마다 먼저 투구하는 사람 교대",
"+ Add Another Day or Block": "+ 다른 날 또는 블록 추가",
"Cancel Tournament": "대회 취소",
"This deletes": "삭제 대상:",
"this tournament": "이 대회",
"— every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "— 입력한 모든 블록, 투구, 점수, 브래킷이 함께 지워지고 홈으로 돌아가요. 되돌릴 수 없어요.",
"Brackets and side pots": "브래킷 및 사이드 팟",
"Working out brackets and side pots as you go is part of the paid plan. Side games in league stay free.": "브래킷과 사이드 팟을 경기 중에 바로 계산하는 기능은 유료 플랜에 포함돼요. 리그 사이드 게임은 계속 무료예요.",
"How did it finish?": "최종 결과는 어땠나요?",
"The stepladder says": "스텝래더 결과:",
"Anything worth remembering about it?": "기억해 둘 만한 점이 있나요?",
"Entry & Winnings": "참가비 및 상금",
"The tournament payout only. Bracket and side pot winnings go on the Brackets tab.": "대회 상금만 해당돼요. 브래킷과 사이드 팟 상금은 ‘브래킷’ 탭에 입력하세요.",
"Tournament buy in": "대회 참가비",
"Tournament winnings": "대회 상금",
"Brackets buy in": "브래킷 참가비",
"Brackets winnings": "브래킷 상금",
"net": "(순손익)",
"Tournament Notes": "대회 메모",
"Overall takeaways…": "전반적인 소감…",
"✓ Tournament Saved": "✓ 대회를 저장했어요",
"Save & Finish Tournament": "저장하고 대회 종료",
"Close this tournament and start a new one? It stays in your history.": "이 대회를 닫고 새 대회를 시작할까요? 이 대회는 기록에 남아요.",
"Yes, close it": "예, 닫기",
"Keep working on it": "계속하기",
"Close tournament": "대회 닫기",
"Side pot": "사이드 팟",
"Money": "손익",
"Tournament Total": "대회 합계",
"All Days": "전체 일정",
"scratch ·": "스크래치 ·",
"handicap pins": "핸디캡 핀",
"← still standing": "← 남은 핀",
"Pins standing": "남은 핀",
"Spare made?": "스페어 처리했나요?",
"← tap what fell": "← 쓰러진 핀을 누르세요",
"Average over the last 13 games": "최근 13게임 에버리지",
"Game 1": "1게임",
"Scores, or every ball": "점수만, 또는 투구마다",
"Arsenal · 3 balls": "보유 볼 · 3개",
"47% strikes · 54% spares": "스트라이크 47% · 스페어 54%",
"15lb · RG 2.5 / Diff 0.05": "15lb · RG 2.5 / Diff 0.05",
"45% strikes · 61% spares": "스트라이크 45% · 스페어 61%",
"15lb · RG 2.57 / Diff 0.046": "15lb · RG 2.57 / Diff 0.046",
"45% strikes · 67% spares": "스트라이크 45% · 스페어 67%",
"15lb · RG 2.49 / Diff 0.05": "15lb · RG 2.49 / Diff 0.05",
"Layouts, surface, specs": "레이아웃, 표면, 스펙",
"Split Happens": "Split Happens",
"Tuesday House Shot · 4 bowlers": "화요일 하우스 패턴 · 4명",
"1. You": "1. 나",
"2. Rob": "2. Rob",
"3. Kim": "3. Kim",
"4. Dee": "4. Dee",
"A league first, a team later": "리그 먼저, 팀은 그다음에",
"Mine": "나",
"Trends": "추이",
"Center": "볼링장",
"On the road since Jul 9": "7월 9일부터 여정 중",
"First 700 series": "첫 700점 시리즈",
"4 pins short · best 696": "4핀 부족 · 최고 696",
"September": "9월",
"10 Sep": "9월 10일",
"Lanes broke down early. Moved left 3 and it came back.": "레인 브레이크다운이 일찍 옴. 왼쪽으로 3보드 옮기니 다시 맞기 시작함.",
"Settings › Walkthroughs": "설정 › 사용 가이드",
"Tonight's scores": "오늘 점수",
"Game 2": "2게임",
"Game 3": "3게임",
"Three numbers and you're done": "숫자 3개면 끝나요",
"Frame 4 · Ball 1": "4프레임 · 1구",
"Other leave": "기타 남은 핀",
"How it hit": "히트 유형",
"Flush": "정확한 포켓",
"Messenger": "메신저",
"Frame over — no pins to pick": "프레임 종료 — 고를 핀이 없어요",
"Frame 5 · left standing": "5프레임 · 남은 핀",
"Tap the pins, then answer": "핀을 누른 다음 답해 주세요",
"Frame 6 · left standing": "6프레임 · 남은 핀",
"None fell? Just save": "하나도 안 쓰러졌나요? 그냥 저장하세요",
"vs average": "에버리지 대비",
"Brackets": "브래킷",
"Standard": "일반",
"Baker": "베이커",
"Scratch": "스크래치",
"Format": "형식",
"10 pin": "10핀",
"9 pin no-tap": "9핀 노탭",
"Mix them however the event runs": "대회 방식에 맞게 자유롭게 조합할 수 있어요",
"Qualifying": "예선",
"Match Play": "매치 플레이",
"Stepladder": "스텝래더",
"Day 1": "1일차",
"Day 2": "2일차",
"Cut": "컷",
"1812 of 1750 across 8 games (all blocks so far).": "컷 1750 대비 8게임 합계 1812 (지금까지의 모든 블록).",
"Where you stand, updated every game": "매 게임 갱신되는 현재 위치",
"Qualified for": "진출 단계",
"Match play": "매치 플레이",
"N/A": "없음",
"Go to match play": "매치 플레이로 이동",
"The margin already said you made it": "컷과의 점수 차로 이미 통과가 확인됐어요",
"Match 1": "1경기",
"WIN": "승",
"by 23": "(23핀 차)",
"Track frames (G1)": "프레임 기록 (1게임)",
"Them": "상대",
"Game 1 again — qualifying doesn't follow you here": "다시 첫 번째 게임부터 — 예선 점수는 이어지지 않아요",
"Record": "전적",
"Bonus pins": "보너스 핀",
"Your seed": "내 시드",
"Step 2": "스텝 2",
"LOSS": "패",
"by 11": "(11핀 차)",
"Seed": "시드",
"2nd": "",
"Finished": "최종 순위",
"Won one step, then out to the 2 seed.": "한 스텝을 이긴 뒤 2번 시드에게 졌어요.",
"Worked out from your seed — never asked": "시드로 자동 계산 — 따로 입력할 필요 없어요",
"8 games": "8게임",
"Every phase, and what it paid": "모든 단계와 단계별 상금",
"Choose file": "파일 선택",
"What changed": "달라진 점",
"Your Bionic is carrying 8% better than the Phaze II on this pattern — 61% against 53% over 94 first balls.": "이 패턴에서는 Bionic의 캐리가 Phaze II보다 8% 좋아요 — 첫 투구 94번 기준 61% 대 53%.",
"10 pin conversion": "10번 핀 스페어 처리율",
"18 more": "18번 더",
"Six of your eight opens were single-pin leaves — the 10 alone cost you 27 pins. The Bionic carried everything in game three; it was the one you finished on.": "오픈 8번 중 6번이 핀 하나만 남은 경우였어요 — 10번 핀에서만 27점을 잃었어요. 세 번째 게임에서는 Bionic이 전부 캐리했고, 마지막까지 쓴 볼도 Bionic이었어요.",
"Ryan's night": "Ryan의 오늘 기록",
"Her lamp, on every screen": "램프는 모든 화면에",
"Brooklyn": "Brooklyn",
"2 wishes left today": "오늘 남은 소원 2번",
"Which ball should I start on next week?": "다음 주에는 어떤 볼로 시작할까요?",
"On a 37-foot pattern you've struck more with the Bionic every time out. Start there.": "37피트 패턴에서는 매번 Bionic으로 스트라이크가 더 많이 나왔어요. Bionic으로 시작하세요.",
"Read this to the bowler": "볼러에게 이 코드를 불러 주세요",
"7KPQ-2M4R": "7KPQ-2M4R",
"Works once, for the next 7 days": "한 번만 쓸 수 있고, 7일 동안 유효해요",
"Works once, on their phone": "그 볼러의 휴대폰에서 한 번만 쓸 수 있어요",
"I": "내가",
"m bowling": "투구",
"m coaching": "코칭",
"Dana Reyes": "Dana Reyes",
"Sam Ortiz": "Sam Ortiz",
"A dot means they answered something": "점이 있으면 그 볼러가 답한 게 있다는 뜻이에요",
"From 412 shots": "412구 기준",
"18 Mar · Tuesday Classic": "3월 18일 · 화요일 클래식",
"11 Mar · Tuesday Classic": "3월 11일 · 화요일 클래식",
"How much data it": "기준이 된 데이터 양은",
"s built on, beside it": "바로 옆에 표시돼요",
"New task": "새 과제",
"Metric": "지표",
"Leave the target off if it isn": "목표가 숫자가 아니면",
"t a number": "비워 두세요",
"Open": "진행 중",
"Clean up the single-pin spares": "싱글 핀 스페어 확실히 처리하기",
"Target 60%": "목표 60%",
"due 1 Apr": "기한 4월 1일",
"Reached 58% so far": "지금까지 58% 달성",
"Mark done": "완료로 표시",
"Record attempt": "시도 기록하기",
"What came back, not just what was asked": "낸 과제뿐 아니라 돌아온 결과까지",
"By ball · strike rate": "볼별 · 스트라이크율",
"Bionic": "Bionic",
"Phaze II": "Phaze II",
"Zen Master": "Zen Master",
"You vs Split Happens": "나 vs Split Happens",
"Rob": "Rob",
"Team average": "팀 에버리지",
"Same measure, same scale": "같은 지표, 같은 척도",
"Ball · strike rate": "볼 · 스트라이크율",
"61% · 94 shots": "61% · 94구",
"47% · 8 more shots needed": "47% · 8구 더 필요",
"Questions it can answer": "답할 수 있는 질문",
"Which ball carries best?": "어떤 볼이 캐리가 가장 좋나요?",
"Where is a spare leaking?": "어떤 스페어를 놓치고 있나요?",
"Do I fall off in game three?": "세 번째 게임에서 점수가 떨어지나요?",
"Jan": "1월",
"Mar": "3월",
"Last 90 days": "최근 90일",
"Showing 13 of 40 games": "40게임 중 13게임 표시",
"All balls": "전체 볼",
"Only games and shots recorded with this ball. Games with no ball noted are left out.": "이 볼로 기록한 게임과 투구만 보여요. 볼이 기록되지 않은 게임은 제외돼요.",
"across every league": "(전체 리그)",
"averaging": "에버리지",
"· high": "· 최고",
", low": ", 최저",
". The spread is": ". 점수 편차:",
"pins — that's what a nightly average hides.": "핀 — 하루 에버리지만 봐서는 알 수 없는 부분이에요.",
"Show": "표시 범위",
"Last": "최근",
"days": "일",
"This one needs frame tracking. You're on game tracking, so there's nothing to plot here yet.": "이 항목은 프레임 단위 기록이 필요해요. 지금은 게임 단위로 기록하고 있어서 아직 그래프로 표시할 데이터가 없어요.",
"Need at least 2 nights logged before there's a line to draw.": "그래프를 그리려면 최소 2회의 볼링 기록이 필요해요.",
"Per game": "게임별",
"Per night": "날짜별",
"Every game": "모든 게임",
"Share this trend": "이 추이 공유",
"Nights here average": "여기 표시된 날의 시도 횟수는 평균",
"attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.": "번으로 적은 편이에요 — 경기력에 아무 변화가 없어도 개별 점이 크게 오르내릴 수 있어요.",
"Latest": "최신",
"Free trial —": "무료 체험 —",
"left": "",
"Your subscription starts when the trial ends.": "구독은 무료 체험이 끝나면 시작돼요.",
"Thanks for bowling with us": "함께 볼링해 주셔서 감사해요",
"You are on the monthly plan. The yearly plan works out cheaper — switch any time.": "지금은 월간 플랜을 이용 중이에요. 연간 플랜이 더 저렴해요 — 언제든 변경할 수 있어요.",
"See the yearly plan": "연간 플랜 보기",
"'Archivo', system-ui, -apple-system, sans-serif": "",
"'Roboto Condensed', 'Archivo', system-ui, sans-serif": "",
"This": "이 내용",
"check it against what you saw on the lane": "레인에서 실제로 본 것과 비교해 보세요",
"was": "—",
"by AI. It can be confidently wrong —": "AI가 만든 거예요. 그럴듯하게 틀릴 수도 있어요 —",
"Other bowlers reported the shared specs for ⟨0⟩ as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "다른 볼러가 ⟨0⟩의 공유 스펙이 틀렸다고 신고해서 스펙을 삭제했어요. 볼은 그대로 남아 있어요 — 시간 날 때 상세 정보를 다시 입력해 주세요.",
"best ⟨0⟩": "최고 ⟨0⟩",
"Now: ⟨0⟩": "현재: ⟨0⟩",
"Which pins did the second ball knock down? ⟨0⟩ this frame": "두 번째 투구로 쓰러뜨린 핀은? 이번 프레임 합계 ⟨0⟩개",
"⟨0⟩ isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "⟨0⟩은 베이커 방식인 날에는 따라 드리지 않아요 — 프레임은 볼러 한 명이 아니라 페어의 것이니까요.",
"This league usually runs ⟨0⟩. Anything you set here is for tonight only.": "이 리그의 평소 패턴: ⟨0⟩. 여기서 설정한 내용은 오늘만 적용돼요.",
"This deletes tonight's shots, game scores and match points for ⟨0⟩ in ⟨1⟩, clears the setup, and takes you back to Home. This cannot be undone.": "⟨0⟩의 ⟨1⟩ 기록에서 오늘의 투구, 게임 점수, 매치 포인트를 삭제하고, 준비 내용을 초기화한 뒤 홈으로 돌아가요. 되돌릴 수 없어요.",
"First ball: ⟨0⟩": "첫 투구: ⟨0⟩",
"Second ball: ⟨0⟩": "두 번째 투구: ⟨0⟩",
"Done⟨0⟩": "완료⟨0⟩",
"This deletes today's practice shots and game scores for ⟨0⟩ and takes you back to Home. This cannot be undone.": "⟨0⟩의 오늘 연습 투구와 게임 점수가 삭제되고 홈으로 돌아가요. 되돌릴 수 없어요.",
"Where do you bowl? ⟨0⟩": "주로 어디서 치나요? ⟨0⟩",
"⟨0⟩ — a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "⟨0⟩ — 표시되지 않는 날, 다른 폰에서 입력한 점수, 계속 볼링을 치는데도 더 이상 바뀌지 않는 통계 등.",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app. ⟨0⟩, and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": "아직 저장을 기다리는 데이터를 먼저 보낸 다음, 전체 기록을 처음부터 다시 다운로드하고 앱을 새로 불러와요. ⟨0⟩. 기록한 내용이 사라질 일도 없어요. 평소 앱을 열 때보다 데이터를 더 많이 쓰고 시즌이 길면 잠시 시간이 걸릴 수 있으니, Wi-Fi에 연결해 두는 게 좋아요.",
"Questions, or want your data deleted? ⟨0⟩": "문의 또는 데이터 삭제 요청: ⟨0⟩",
"This deletes your account and ⟨0⟩ — every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "계정과 계정에 ⟨0⟩를 삭제해요 — 모든 투구와 세션, 프로필과 이름, 보유 볼, 목표, 팀 소속까지요. 다시 로그인할 수 없고, 저희도 복구해 드릴 수 없어요.",
"Want a copy first? Use ⟨0⟩ above before you do this.": "먼저 사본을 받아 두고 싶나요? 진행하기 전에 위의 ⟨0⟩ 기능을 사용하세요.",
"Type ⟨0⟩ to confirm": "확인을 위해 ⟨0⟩ 입력",
"The same email has a sign-in link in it, if you'd rather tap that.⟨0⟩The code lasts an hour.": "같은 메일에 로그인 링크도 들어 있어요. 탭하는 게 편하면 링크를 쓰세요.⟨0⟩코드는 1시간 동안 유효해요.",
"⟨0⟩or⟨1⟩": "⟨0⟩또는⟨1⟩",
"⟨0⟩ Weakest": "⟨0⟩ 가장 약함",
"⟨0⟩ Strongest": "⟨0⟩ 가장 강함",
"⟨0⟩ Everything else": "⟨0⟩ 나머지",
"⟨0⟩ Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "⟨0⟩ 결제 여부와 관계없이 모든 기능이 이미 열려 있어요. 결제 과정을 테스트하려면 아래에서 구매할 수도 있어요.",
"Every league and team you bowl in ⟨0⟩": "참가하는 모든 리그와 팀 ⟨0⟩",
"⟨0⟩ is saved to your history. Bowling another block of it, or starting a new tournament?": "⟨0⟩(은)는 기록에 저장돼 있어요. 이 대회의 다른 블록을 투구할까요, 아니면 새 대회를 시작할까요?",
"⟨0⟩Alternate who leads off each game": "⟨0⟩게임마다 먼저 투구하는 사람 교대",
"This deletes ⟨0⟩ — every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "⟨0⟩(을)를 삭제하면 입력한 모든 블록, 투구, 점수, 브래킷이 함께 지워지고 홈으로 돌아가요. 되돌릴 수 없어요.",
"⟨0⟩Import": "⟨0⟩가져오기",
"Match 1 ⟨0⟩⟨1⟩": "1경기 ⟨0⟩⟨1⟩",
"Step 2 ⟨0⟩⟨1⟩": "스텝 2 ⟨0⟩⟨1⟩",
"Which ball carries best?⟨0⟩Where is a spare leaking?⟨1⟩Do I fall off in game three?": "어떤 볼이 캐리가 가장 좋나요?⟨0⟩어떤 스페어를 놓치고 있나요?⟨1⟩세 번째 게임에서 점수가 떨어지나요?",
"up": "증가",
"down": "감소",
"they": "팀",
"they're": "그 볼러",
"year": "년",
"month": "월",
"yearly": "연간",
"monthly": "월간",
"frames": "프레임",
"nights": "회",
"now": "현재",
"mixed": "혼합",
"unnamed": "이름 없음",
"(me)": "(나)",
"That was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "AI가 작성한 내용이에요. 그럴듯하게 틀릴 수 있어요 — 레인에서 직접 본 것과 비교해 보세요.",
"This scorecard was read by AI. It can be confidently wrong — check the numbers against the card before saving.": "이 점수표는 AI가 읽었어요. 그럴듯하게 틀릴 수 있어요 — 저장하기 전에 점수표와 숫자를 대조해 보세요.",
"This list was found by AI. It can be confidently wrong — check the name and address before you rely on it.": "이 목록은 AI가 찾았어요. 그럴듯하게 틀릴 수 있어요 — 이용하기 전에 이름과 주소를 확인하세요.",
"⟨0⟩ wants to be your coach.": "⟨0⟩ 님이 코치로 연결을 요청했어요.",
"⟨0⟩ wants to be your bowler.": "⟨0⟩ 님이 볼러로 연결을 요청했어요.",
"Automatic": "자동",
"Automatic · ⟨0⟩": "자동 · ⟨0⟩",
"Automatic follows your phone's language. Changing it restarts the app.": "‘자동’은 휴대폰의 언어 설정을 따라요. 언어를 바꾸면 앱이 다시 시작돼요.",
"theme::Light": "라이트",
"theme::Dark": "다크",
"hit::High": "두껍게",
"hit::Light": "얇게",
"hit::Brooklyn": "브루클린",
"confidence::Clear": "뚜렷함",
"Analysis came back empty. Try again.": "분석 결과가 비어 있어요. 다시 시도해 주세요.",
"Analysis came back malformed. Try again.": "분석 결과의 형식이 올바르지 않아요. 다시 시도해 주세요.",
"Couldn't generate insights right now.": "지금은 분석을 생성하지 못했어요.",
"Insights aren't configured on the server.": "서버에 분석 기능이 설정되어 있지 않아요.",
"Insights is part of the paid plan.": "분석은 유료 플랜 기능이에요.",
"Not enough data yet to analyse.": "아직 분석할 데이터가 부족해요.",
"You've used this quite a lot in the last hour. Give it a little while and try again.": "최근 1시간 동안 꽤 많이 사용했어요. 잠시 후 다시 시도해 주세요.",
"Ask me something.": "무엇이든 물어보세요.",
"Brooklyn only answers on the paid plan.": "Brooklyn은 유료 플랜에서만 답해요.",
"Sign in first.": "먼저 로그인하세요.",
"That's a lot. Try asking me one thing.": "한 번에 너무 많아요. 한 가지만 물어봐 주세요.",
"The lamp is cold. Try again later.": "램프가 식었어요. 나중에 다시 시도해 주세요.",
"The lamp went quiet. Try again in a moment.": "램프가 조용해졌어요. 잠시 후 다시 시도해 주세요.",
"You've used all three today. The lamp recharges tomorrow.": "오늘 세 번을 모두 사용했어요. 램프는 내일 다시 충전돼요.",
"Subscriptions are not available yet.": "아직 구독을 이용할 수 없어요.",
"That plan is not available right now.": "지금은 이 플랜을 이용할 수 없어요.",
"Too many attempts. Try again shortly.": "시도 횟수가 너무 많아요. 잠시 후 다시 시도해 주세요.",
"You already have a subscription.": "이미 구독 중이에요.",
"Could not open the subscription manager.": "구독 관리 화면을 열지 못했어요.",
"No Stripe subscription found for this account.": "이 계정의 Stripe 구독을 찾을 수 없어요.",
"Subscription management is not available yet.": "아직 구독 관리를 이용할 수 없어요.",
"Account deletion isn't configured on the server. Email support@mybowlingjourney.com and we'll do it by hand.": "서버에 계정 삭제 기능이 설정되어 있지 않아요. support@mybowlingjourney.com으로 메일을 보내 주시면 직접 삭제해 드릴게요.",
"Account deletion isn't configured on the server.": "서버에 계정 삭제 기능이 설정되어 있지 않아요.",
"Couldn't delete the account just then. Try again, or email support@mybowlingjourney.com.": "지금은 계정을 삭제하지 못했어요. 다시 시도하거나 support@mybowlingjourney.com으로 메일을 보내 주세요.",
"Not authenticated.": "로그인되어 있지 않아요.",
"Not authenticated": "로그인되어 있지 않아요",
"A location is needed to search nearby centers.": "근처 볼링장을 검색하려면 위치 정보가 필요해요.",
"Location search isn't configured on the server.": "서버에 위치 검색 기능이 설정되어 있지 않아요.",
"One of the images is too large. Try a smaller photo.": "이미지 중 하나가 너무 커요. 더 작은 사진으로 시도해 보세요.",
"One of the images was empty or malformed.": "이미지 중 하나가 비어 있거나 손상됐어요.",
"Scorecard import is part of the paid plan.": "점수표 가져오기는 유료 플랜 기능이에요.",
"The import service can't check its limits right now. Try again shortly.": "지금은 가져오기 서비스가 사용 한도를 확인할 수 없어요. 잠시 후 다시 시도해 주세요.",
"The scorecard reader isn't available right now.": "지금은 점수표 읽기 기능을 이용할 수 없어요.",
"Those images come to too much to send at once. Try fewer at a time.": "이미지 용량이 너무 커서 한 번에 보낼 수 없어요. 한 번에 보내는 장수를 줄여 보세요.",
"Too many images in one request (max 6)": "한 번에 보낸 이미지가 너무 많아요(최대 6장)",
"You've imported a lot in the last hour. Give it a little while and try again.": "최근 1시간 동안 가져오기를 너무 많이 했어요. 잠시 후 다시 시도해 주세요.",
"No images provided": "제공된 이미지가 없어요",
"Nightcap isn't configured on the server.": "서버에 Nightcap이 설정되어 있지 않아요.",
"Not enough logged tonight for a nightcap.": "Nightcap을 따르기에는 오늘 기록한 내용이 부족해요.",
"That's a few nightcaps in one hour. Give it a little while and try again.": "1시간 동안 Nightcap을 벌써 여러 잔 마셨네요. 잠시 후 다시 시도해 주세요.",
"The Nightcap is part of the paid plan.": "Nightcap은 유료 플랜 기능이에요.",
"The nightcap came back empty. Tap to try again.": "Nightcap이 빈 잔으로 나왔어요. 탭해서 다시 시도해 주세요.",
"The nightcap came back malformed. Tap to try again.": "Nightcap이 잘못된 형태로 도착했어요. 탭해서 다시 시도해 주세요.",
"The nightcap came back thin. Tap to try again.": "Nightcap이 너무 싱겁게 나왔어요. 탭해서 다시 시도해 주세요.",
"The nightcap took too long. Tap to try again.": "Nightcap이 너무 오래 걸렸어요. 탭해서 다시 시도해 주세요.",
"Could not record that purchase.": "구매를 기록하지 못했어요.",
"Could not verify that purchase.": "구매를 확인하지 못했어요.",
"Purchases are not available yet.": "아직 구매할 수 없어요.",
"That purchase could not be verified.": "이 구매를 확인할 수 없었어요.",
"My Groups": "내 그룹",
"none here": "투구 없음",
"At a glance": "한눈에 보기",
"Spares": "스페어",
"Language · Langue": "Language · Idioma · Langue · 言語 · 언어",
"Français (Canada)": "Français (Canada)",
"English": "English",
"1 Apr": "4월 1일",
"18 Mar 2026": "2026년 3월 18일",
"22 Mar": "3월 22일",
"Tue": "화요일",
"✓ High game": "✓ 하이 게임",
"✓ Quarter game": "✓ 25센트 게임",
"✓ Dollar game": "✓ 1달러 게임",
"✓ 3-6-9 (whole night)": "✓ 3-6-9 (전체 게임)",
"Free fall against string pins. Set the rack type on two centers — or on one mixed house, with its free-fall lanes.": "프리폴과 스트링을 비교해요. 볼링장 두 곳의 핀세터 종류를 설정하세요 — 또는 프리폴 레인이 있는 혼합형 볼링장 한 곳이면 돼요.",
"Right-handed, backup": "오른손, 백업 볼",
"Left-handed, backup": "왼손, 백업 볼",
"Tournament buy in $": "대회 참가비($)",
"Tournament winnings $": "대회 상금($)",
"milestones": "마일스톤",
"Spring Masters": "스프링 마스터스",
"Changing the language": "언어 바꾸기",
"Language · Langue in Settings. Automatic follows your phone's language, or pick Français (Canada) or English. The app restarts in the language you pick.": "‘설정’의 ‘Language · Idioma · Langue · 言語 · 언어’에서 바꿀 수 있어요. ‘자동’은 휴대폰의 언어를 따르며, Français (Canada), English 중에서 고를 수도 있어요. 선택한 언어로 앱이 다시 시작돼요.",
"Quarter $": "25센트($)",
"Dollar $": "1달러($)",
"left lane": "",
"right lane": "",
"left handed": "왼손",
"Automatic ·": "자동 ·",
"Suivi de quilles": "Suivi de quilles",
"End League & View Results": "종료하고 결과 보기",
"End Practice & View Results": "종료하고 결과 보기",
"End Tournament & View Results": "종료하고 결과 보기",
"End Open Bowling & View Results": "종료하고 결과 보기",
"End Session & View Results": "종료하고 결과 보기",
"Save & Finish League": "저장하고 리그 종료",
"Save & Finish Practice": "저장하고 연습 종료",
"Save & Finish Open Bowling": "저장하고 자유 게임 종료",
"Save & Finish Session": "저장하고 세션 종료",
"10-pin": "10번 핀",
"degrees": "각도(°)",
"rpm": "RPM",
"mph": "mph",
"hand::R": "우",
"hand::L": "좌",
"title::Inbox": "알림함",
"title::Import scorecard": "가져오기",
"tab::Clean frames": "클린 프레임",
"tab::Other leaves": "기타",
"tab::First ball": "첫 투구",
"tab::10-pin": "10번 핀",
"tab::Stepladder": "스텝래더",
"converted": "처리율",
"G1": "1G",
"G2": "2G",
"G3": "3G",
"G4": "4G",
"G5": "5G",
"G6": "6G",
"Two-sided": "투 트랙",
"Runner-up": "준우승",
"Pin-to-PAP": "핀~PAP 거리",
"Pin-to-COG": "핀~COG 거리",
"Won $": "획득 상금($)",
"placeholder::Score": "점수",
"— choose a ball —": "— 볼 선택 —",
"field::Rev rate": "회전수",
"field::Breakpoint": "브레이크 포인트",
"field::Axis rot.": "액시스 로테이션",
"field::Axis tilt": "액시스 틸트",
"field::Sole #": "솔 번호",
"field::Heel #": "힐 번호",
"tile::High game": "하이 게임",
"tile::High series": "하이 시리즈",
"pin::1 pin": "1번 핀",
"pin::2 pin": "2번 핀",
"pin::3 pin": "3번 핀",
"pin::4 pin": "4번 핀",
"pin::5 pin": "5번 핀",
"pin::6 pin": "6번 핀",
"pin::7 pin": "7번 핀",
"pin::8 pin": "8번 핀",
"pin::9 pin": "9번 핀",
"pin::10 pin": "10번 핀",
"badges::All": "전체",
"tile::League average": "리그 에버리지",
"All nights": "전체 날짜",
"placeholder::board #": "보드",
"placeholder::degrees": "°",
"Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": "확정하기 전에 무료 체험이 내 계정에 적용되는지 Google Play에서 보여 줘요. 그 후에는 해지할 때까지 자동으로 갱신돼요.",
"Pro": "Pro",
"Reading your question…": "질문을 읽고 있어요…",
"questions today. Ask again tomorrow.": "",
"Brooklyn couldn't answer that right now. Try again in a few minutes.": "Brooklyn이 지금은 답할 수 없어요. 몇 분 뒤에 다시 시도해 주세요.",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She has her own card at the top of Improve. Three questions a day.": "일반적인 수치는 ‘통계’ 화면에서 볼 수 있어요. Brooklyn은 그 화면으로는 답할 수 없는 질문을 위한 기능이에요 — 내 볼링에 대해 평소 말하듯 물어보면 지금까지 기록한 내용을 바탕으로 답을 찾아 줘요. 아직 기록하지 않는 항목이 필요하면 무엇부터 기록하면 좋을지 알려 줘요. ‘향상’ 탭 맨 위에 전용 카드가 있어요. 질문은 하루 3번까지예요.",
"2 questions left today": "오늘 남은 질문 2개",
"Brooklyn isn't available right now. Try again later.": "Brooklyn은 지금 이용할 수 없어요. 나중에 다시 시도해 주세요.",
"You've used all three questions today. Ask again tomorrow.": "오늘 질문 3개를 모두 사용했어요. 내일 다시 물어보세요.",
"Brooklyn couldn't answer that. Try again in a moment.": "Brooklyn이 그 질문에 답하지 못했어요. 잠시 후 다시 시도해 주세요.",
"Brooklyn took too long to answer. Try again.": "Brooklyn의 답변이 너무 오래 걸렸어요. 다시 시도해 주세요.",
"AI": "AI",
"tab::AI": "AI",
"On the Improve tab, open Goals, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "‘향상’ 탭에서 ‘목표’를 열고 ‘목표 추가’를 누른 다음 연습할 항목을 고르세요 — 에버리지, 스트라이크율, 스페어 처리율 등. 투구할 때마다 진행 상황이 업데이트돼요.",
"Start a drill from the Goals tab on Improve. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "‘향상’의 ‘목표’ 탭에서 연습 드릴을 시작하세요. 타깃을 고르면 — 특정 스페어든 핀 조합이든 — 그 세션의 성공과 실패를 앱이 기록해요.",
"Improve has a Coach tab. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "‘향상’에는 ‘코치’ 탭이 있어요. 어느 쪽인지 고르고 — ‘상대가 코치’ 또는 ‘내가 코치’ — 코드를 만드세요. 8자리 코드를 상대에게 읽어 주고, 상대가 자기 휴대폰에서 입력하면 연결돼요.",
"+6%": "",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She's on the AI tab of Improve, below Insights. Three questions a day.": "‘통계’ 화면에서는 기본적인 숫자를 볼 수 있어요. 거기서 답이 안 나오는 질문은 Brooklyn에게 하세요 — 내 볼링에 대해 평소 말투로 물어보면 지금까지 기록한 내용으로 답을 찾아 줘요. 아직 기록하지 않는 데이터가 필요하면 무엇을 기록하기 시작하면 좋을지 알려 줘요. ‘향상’의 ‘AI’ 탭, ‘분석’ 아래에 있어요. 질문은 하루 3번까지 할 수 있어요.",
"no reading": "",
"more than one bowler": "",
"not a card with drawn racks": "",
"Press Import in the header. Say whether it's practice or league, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving. Tournaments aren't imported: log them live on Bowl, where squads, blocks, match play and stepladder are all tracked.": "상단의 ‘가져오기’를 누르세요. 연습인지 리그인지 고르고, 팀과 날짜를 선택한 다음 점수 모니터 사진을 추가하세요. 앱이 게임과 프레임을 읽으면, 저장하기 전에 각 열이 어느 볼러의 것인지 지정해요. 대회는 가져올 수 없어요. ‘투구’에서 실시간으로 기록하세요. 조, 블록, 매치 플레이, 스텝래더까지 모두 기록돼요.",
"⚠️ Check the flagged ball below — it couldn't be reliably read from the image.": "⚠️ 아래 표시된 투구를 확인하세요 — 이미지에서 정확하게 읽지 못했어요.",
"⚠️ Check the flagged balls below — they couldn't be reliably read from the image.": "⚠️ 아래 표시된 투구를 모두 확인하세요 — 이미지에서 정확하게 읽지 못했어요.",
"This frame couldn't be read from the image.": "이 프레임은 이미지에서 읽지 못했어요.",
"▾ Hide frames": "▾ 프레임 접기",
"▸ Check frames": "▸ 프레임 확인",
"✓ This is right": "✓ 맞아요",
"Waiting for an app update to finish": "앱 업데이트가 끝나기를 기다리는 중",
"The cloud isn't ready for this yet. Nothing is lost on this phone; it will upload once the update is complete.": "클라우드가 아직 준비되지 않았어요. 이 휴대폰에 있는 데이터는 사라지지 않았고, 업데이트가 끝나면 업로드돼요.",
"queued behind an earlier write for this row": "이 항목의 이전 변경 사항이 처리되기를 기다리는 중",
"The free plan covers one team, and you're already on one. Upgrade to Pro to add another?": "무료 플랜은 팀 1개까지 가능한데, 이미 팀에 소속되어 있어요. Pro로 업그레이드하고 팀을 추가할까요?",
"Sign in with this link?": "이 링크로 로그인할까요?",
"Text": "문자",
"Your home centers": "자주 가는 볼링장",
"Somewhere else?": "다른 곳인가요?",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with a code, you get one to text them and they enter it when they sign up; with their email, they're linked the moment they sign in with that exact address.": "지금 팀원 명단에 자리를 맡아 둬요 — 아직 계정이 없어도 ‘기록할 볼러’에서 바로 그 사람 이름으로 점수를 기록할 수 있어요. 어느 방법이든 본인이 직접 이 자리를 가져가고, 그동안 기록한 내용은 모두 그대로 남아 있어요. 코드를 고르면 받은 코드를 문자로 보내 주고, 본인이 가입할 때 입력해요. 이메일을 고르면 본인이 바로 그 주소로 로그인하는 순간 연결돼요.",
"Filled in from your note — check it's the right game.": "메모를 보고 채웠어요 — 맞는 게임인지 확인하세요.",
"(pending)": "(승인 대기)",
"Couldn't tell which league this night belongs to. Reload the app and try again.": "이날이 어느 리그 기록인지 알 수 없어요. 앱을 다시 불러온 뒤 다시 시도해 주세요.",
"Couldn't change your name without a connection. Try again when you're back online.": "오프라인 상태라 이름을 변경하지 못했어요. 다시 연결되면 시도해 주세요.",
"Couldn't change your name. Try again in a moment.": "이름을 변경하지 못했어요. 잠시 후 다시 시도해 주세요.",
"No spare ball. A plastic ball goes straight at corner pins without hooking.": "스페어 볼이 없어요. 플라스틱 볼은 훅 없이 코너 핀으로 곧장 가요.",
"it can't": "차트에 표시할 수 없어요",
"they can't": "차트에 표시할 수 없어요",
"Nothing strong enough for heavy oil or a fresh pattern.": "오일이 많은 레인이나 프레시 패턴에 쓸 만큼 강한 볼이 없어요.",
"Nothing weak enough for dry lanes or late in a block when the lanes burn up.": "드라이한 레인이나, 블록 후반에 오일이 다 닳았을 때 쓸 만큼 약한 볼이 없어요.",
"No ball with a sharp, angular back end for when you need it to turn the corner.": "볼이 급하게 꺾여야 할 때 쓸, 백엔드 반응이 날카롭고 각진 볼이 없어요.",
"No smooth, controllable ball for when the back end is too strong.": "백엔드가 너무 강할 때 쓸, 부드럽고 컨트롤하기 쉬운 볼이 없어요.",
"Bag": "가방",
"The Caddie couldn't answer just then. Tap to try again.": "Caddie가 지금은 답하지 못했어요. 탭해서 다시 시도해 주세요.",
"Arsenal analysis": "보유 볼 분석",
"Add your balls on the Balls tab, with their cover and core, and this maps where each one sits and what your bag is missing.": "‘볼’ 탭에서 볼을 추가하고 커버스톡과 코어를 입력하면, 각 볼의 위치와 가방에 부족한 볼을 여기에 보여 줘요.",
"Compare bags": "가방 비교",
"Where each ball sits, from its cover, surface, core and layout — cover and surface count most, because they're what touches the lane. Positions are estimates from specs; your scores show what actually worked.": "커버스톡, 표면, 코어, 레이아웃으로 본 각 볼의 위치예요 — 레인에 닿는 부분이라 커버스톡과 표면을 가장 중요하게 봐요. 위치는 스펙으로 추정한 값이고, 실제로 무엇이 잘 맞았는지는 점수가 보여 줘요.",
"First bag": "첫 번째 가방",
"Second bag": "두 번째 가방",
"No ball here has the specs this chart needs yet.": "이 차트에 필요한 스펙이 입력된 볼이 아직 없어요.",
"◯ in both": "◯ 두 가방 모두",
"⟨0⟩ Solid": "⟨0⟩ 솔리드",
"⟨0⟩ Hybrid": "⟨0⟩ 하이브리드",
"⟨0⟩ Pearl": "⟨0⟩ 펄",
"● Faded: specs incomplete": "● 흐린 점: 스펙 일부 누락",
"Bags side by side": "가방 나란히 비교",
"Strength": "강도",
"Length": "길이",
"Back end": "백엔드",
"No ball is in both bags.": "두 가방에 모두 있는 볼은 없어요.",
"A wider range means the bag covers more conditions.": "범위가 넓을수록 그 가방이 더 다양한 컨디션에 대응해요.",
"Your balls": "내 볼",
"This bag is empty.": "이 가방은 비어 있어요.",
"What the arsenal is missing": "보유 볼에 부족한 것",
"What this bag is missing": "이 가방에 부족한 것",
"Nothing obvious — it covers strong to weak, smooth to sharp, and has a spare ball.": "뚜렷하게 부족한 건 없어요 — 강한 볼부터 약한 볼까지, 부드러운 반응부터 날카로운 반응까지 갖췄고 스페어 볼도 있어요.",
"From the catalog:": "카탈로그에서:",
"The Caddie": "Caddie",
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.": "Caddie가 가방 전체를 살펴봐요 — 어떤 컨디션에 어떤 볼을 쓸지, 어떤 가방이 잘 구성됐는지, 무엇을 추가하고 무엇을 집에 두고 올지. 유료 플랜 기능이에요.",
"See the plan": "플랜 보기",
"🏌️ The Caddie": "🏌️ Caddie",
"Asks which of these two bags is built for what.": "두 가방이 각각 어떤 상황에 맞게 구성됐는지 물어봐요.",
"Reads the whole arsenal: each ball's job, your bags, and what to add or leave home.": "보유 볼 전체를 살펴봐요: 볼별 역할, 가방 구성, 추가할 볼과 집에 두고 올 볼.",
"The Caddie is looking over the bag…": "Caddie가 가방을 살펴보는 중…",
"Ask the Caddie": "Caddie에게 물어보기",
"Add cover and core to at least one ball first.": "먼저 볼 하나 이상에 커버스톡과 코어를 입력해 주세요.",
"Spare ball": "스페어 볼",
"Scores well": "점수 좋음",
"Below average": "에버리지 이하",
"Not placed — add cover and core": "위치 없음 — 커버스톡과 코어 입력 필요",
"games ·": "게임 ·",
"No specs entered": "스펙 미입력",
"Surface:": "표면:",
"not recorded": "기록 없음",
"(reading it as out of the box)": "(출고 상태로 간주)",
"Layout:": "레이아웃:",
"· Length": "· 길이",
"· Back end": "· 백엔드",
"games at": "게임에서 에버리지",
"By part of the night:": "구간별:",
"No games logged with it yet.": "이 볼로 기록한 게임이 아직 없어요.",
"Each ball's job": "볼별 역할",
"Gaps": "부족한 점",
"Next in the bag:": "다음에 추가할 볼:",
"Leave at home:": "집에 두고 올 볼:",
"The Caddie's read": "Caddie의 분석",
"it's working from specs and your logged games, not from watching you throw": "투구를 직접 본 게 아니라 스펙과 기록한 게임을 바탕으로 해요",
"Ask again": "다시 물어보기",
"ArsenalAnalysis": "ArsenalAnalysis",
"Weak": "약함",
"Benchmark": "벤치마크",
"Strong": "강함",
"Early": "일찍",
"Mid-lane": "미드레인",
"Long": "길게",
"Smooth": "스무스",
"Controlled": "안정적",
"Sharp": "샤프",
"Light oil / late in the block": "적은 오일 / 블록 후반",
"Medium oil": "중간 오일",
"Heavy oil / fresh": "많은 오일 / 초반",
"Length × Back end": "길이 × 백엔드",
"Where each ball starts to hook, and how it turns. Bigger dots are stronger balls.": "볼마다 훅이 시작되는 지점과 꺾이는 모양이에요. 점이 클수록 강한 볼이에요.",
"Length × Strength": "길이 × 강도",
"The ladder: strongest at the top for fresh or heavy oil, weakest at the bottom for dry lanes and late in the block.": "볼 사다리: 위로 갈수록 강해서 새 오일이나 오일이 많은 레인에, 아래로 갈수록 약해서 마른 레인이나 블록 후반에 맞아요.",
"RG × Differential": "RG × 디퍼렌셜",
"Low RG (revs early)": "낮은 RG (일찍 회전)",
"High RG (revs late)": "높은 RG (늦게 회전)",
"Low diff (less flare)": "낮은 디퍼렌셜 (플레어 적음)",
"High diff (more flare)": "높은 디퍼렌셜 (플레어 많음)",
"The core alone, as the maker's numbers. Bigger dots are more asymmetric.": "제조사 수치로 본 코어만의 특성이에요. 점이 클수록 비대칭성이 커요.",
"Compare your bags, and ask the Caddie": "가방을 비교하고 Caddie에게 물어보세요",
"Where each ball sits, what scores, what's missing": "볼별 역할, 점수가 잘 나오는 볼, 부족한 부분",
"Ball against ball": "볼끼리 비교",
"Your read-back after every night — you've poured one.": "경기가 끝날 때마다 받는 하루 되짚기 — 지금까지 한 잔 따랐어요.",
"A photo of the scorecard instead of typing every game.": "게임마다 직접 입력하는 대신 점수표 사진 한 장으로.",
"Head to head": "맞대결",
"Your numbers against your teammates', and the team leaderboard.": "팀원과 내 수치 비교, 그리고 팀 내 순위.",
"Comparing your numbers with your friends'.": "친구와 내 수치 비교.",
"House against house": "볼링장끼리 비교",
"Your season side by side with the one before.": "이번 시즌과 지난 시즌을 나란히 비교.",
"Tracking what you put in and won at tournaments.": "대회 참가비와 상금 기록.",
"Your coach's tasks, notes and view of your numbers.": "코치가 준 과제와 메모, 코치가 보는 내 수치.",
"Your 60 days of Pro are up.": "Pro 이용 60일이 끝났어요.",
"Every game, shot and night you've logged — nothing is deleted": "기록한 모든 게임과 투구, 날짜별 기록 — 삭제되는 건 없어요",
"Your own stats: strikes, spares, splits, leaves and each ball's numbers": "내 통계: 스트라이크, 스페어, 스플릿, 남은 핀, 볼별 수치",
"One league, one team, a league bag and a tournament bag": "리그 1개, 팀 1개, 리그 가방과 대회 가방 각 1개",
"Badges, your journey and the calendar": "배지, 여정, 캘린더",
"Your Pro trial has ended": "Pro 무료 체험이 끝났어요",
"What you've been using that Basic doesn't include:": "그동안 써 온 기능 중 Basic에 없는 기능:",
"Keep Pro ·": "Pro 계속 이용하기 ·",
"/month": "/월",
"Or": "또는",
"/year": "/년",
"Basic is free, and keeps:": "Basic은 무료이며, 다음 기능은 계속 쓸 수 있어요:",
"Continue with Basic": "Basic으로 계속하기",
"No card is on file, so nothing is charged when the trial ends — you move to Basic unless you choose Pro.": "등록된 카드가 없어서 체험이 끝나도 요금이 청구되지 않아요 — Pro를 선택하지 않으면 Basic으로 전환돼요.",
"You against a teammate. Needs frames for you and at least one teammate in this league.": "팀원과의 맞대결이에요. 이 리그에서 나와 팀원 최소 1명의 프레임 기록이 필요해요.",
"Teammate": "팀원",
"This league only. Split Rate is the one where lower is better.": "이 리그만 해당돼요. 스플릿 비율만은 낮을수록 좋아요.",
"All leagues": "모든 리그",
"Language · Idioma · Langue": "",
"Nightcap, Insights, Brooklyn, the Caddie and coaching": "Nightcap, 분석, Brooklyn, Caddie, 코칭",
"You cancelled, so this ends when the period you paid for runs out. Everything stays unlocked until then, and you can start it again any time before it ends.": "구독을 해지해서 결제한 기간이 끝나면 종료돼요. 그때까지는 모든 기능을 계속 이용할 수 있고, 종료 전이라면 언제든지 다시 시작할 수 있어요.",
"window::All": "전체",
"tab::Season": "시즌",
"tab::Calendar": "캘린더",
"tab::Journey": "여정",
"picker::Every night": "전체 날짜",
"field::Scoring": "점수 방식",
"tab::Side games": "사이드 게임",
"Language · Idioma · Langue in Settings. Automatic follows your phone's language, or pick English, Español or Français. The app restarts in the language you pick.": "‘설정’의 ‘Language · Idioma · Langue · 言語 · 언어’에서 바꿀 수 있어요. ‘자동’은 휴대폰의 언어를 따르며, English, Español, Français 중에서 고를 수도 있어요. 선택한 언어로 앱이 다시 시작돼요.",
"Español": "",
"Français": "",
"The Caddie's read was written by AI. It can be confidently wrong — it's working from specs and your logged games, not from watching you throw.": "Caddie의 판단은 AI가 작성했어요. 그럴듯하게 틀릴 수 있어요 — 볼 스펙과 기록한 게임을 바탕으로 한 것이지, 실제로 던지는 모습을 보고 판단한 게 아니에요.",
"This was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "이 내용은 AI가 작성했어요. 그럴듯하게 틀릴 수 있어요 — 레인에서 직접 본 것과 비교해 보세요.",
"✓ Session Saved": "✓ 세션 저장 완료",
"▼ How much data it’s built on, beside it": "▼ 기준이 된 데이터 양도 바로 옆에 표시돼요",
"▼ Leave the target off if it isn’t a number": "▼ 수치가 아니면 목표는 비워 두세요",
"Composite average at each position in the night, across the whole season — shows whether they're bowling better early, middle, or late.": "시즌 전체에서, 그날 몇 번째 게임인지에 따른 종합 에버리지예요. 그 볼러가 초반, 중반, 후반 중 언제 더 잘 치는지 보여 줘요.",
"⟨0⟩ Urethane": "⟨0⟩ 우레탄",
"Language · Idioma · Langue · 言語": "",
"日本語": "",
"Language · Idioma · Langue · 言語 in Settings. Automatic follows your phone's language, or pick English, Español, Français or 日本語. The app restarts in the language you pick.": "‘설정’의 ‘Language · Idioma · Langue · 言語 · 언어’에서 바꿀 수 있어요. ‘자동’은 휴대폰의 언어를 따르며, English, Español, Français, 日本語 중에서 고를 수도 있어요. 선택한 언어로 앱이 다시 시작돼요.",
"Bowled.": "볼링을 쳤어요.",
"tab::Center": "볼링장",
"placeholder::Handicap": "핸디캡",
"tab::Handicap": "핸디캡",
"window::Games": "게임 수",
"field::Delivery": "투구 방식",
"tile::Strikes": "스트라이크율",
"field::Target": "타깃",
"milestone::Next ·": "다음 목표 ·",
"newly::.": ".",
"Japan": "",
"Singapore": "",
"Language · Idioma · Langue · 言語 · 언어": "",
"Language · Idioma · Langue · 言語 · 언어 in Settings. Automatic follows your phone's language, or pick English, Español, Français, 日本語 or 한국어. The app restarts in the language you pick.": "‘설정’의 ‘Language · Idioma · Langue · 言語 · 언어’에서 바꿀 수 있어요. ‘자동’은 휴대폰의 언어를 따르며, English, Español, Français, 日本語, 한국어 중에서 고를 수도 있어요. 선택한 언어로 앱이 다시 시작돼요.",
"Split Happens — Tuesday House Shot": "Split Happens — 화요일 하우스 패턴",
"league": "리그",
"hand::Right": "오른손",
"hand::Left": "왼손",
"confidence::Not yet": "아직 표본 부족",
"Frames where every teammate struck but one. Log your teammates' frames on a league night.": "팀원이 모두 스트라이크를 친 프레임에서 혼자만 놓친 횟수예요. 리그 날에 팀원들의 프레임도 기록해 주세요."
},
"patterns": [
[
"Add {0}'s balls to start logging shots.",
"{0}의 볼을 추가하면 투구를 기록할 수 있어요."
],
[
"{0}% spares",
"스페어 {0}%"
],
[
"Remove {0}",
"{0} 삭제"
],
[
"Delete \"{0}\"? Its balls become ungrouped.",
"‘{0}’ 그룹을 삭제할까요? 이 그룹의 볼은 그룹에서 빠져요."
],
[
"Name change hasn't reached the cloud yet ({0}) — teammates won't be able to find you until it syncs.",
"이름 변경이 아직 클라우드에 반영되지 않았어요({0}) — 동기화될 때까지 팀원이 검색해도 찾을 수 없어요."
],
[
"Saved on this device, but hasn't reached the cloud yet ({0}) — it may not carry over to another device yet.",
"이 기기에는 저장했지만 아직 클라우드에 반영되지 않았어요({0}) — 다른 기기에는 아직 나타나지 않을 수 있어요."
],
[
"of {0}",
"/{0}"
],
[
"Earned {0}",
"획득 {0}"
],
[
"Left {0}",
"남음 {0}"
],
[
"The free plan covers {0} league bag and {1} tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.",
"무료 플랜에서는 리그 가방 {0}개와 대회 가방 {1}개를 쓸 수 있어요. 추가 가방(짧은 패턴용 대회 가방, 스포츠 패턴용 가방 등)은 유료 플랜 기능이에요. 이미 챙겨 둔 볼은 그대로 남아 있어요."
],
[
"{0} · {1}{2} ball{3:s}{4}",
"{0} · 볼 {1}{2}개{4}"
],
[
"{0} ball{1:s} not packed in any bag. Practice always shows every ball regardless.",
"어느 가방에도 들어 있지 않은 볼이 {0}개 있어요. 연습에서는 항상 모든 볼이 표시돼요."
],
[
"Showing the {0}lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.",
"{0}lb 기준 수치를 표시하고 있어요 — RG와 디퍼렌셜은 무게에 따라 다르고, 이 볼은 여러 무게의 수치가 공개되어 있어요."
],
[
"No published numbers for {0}lb specifically — showing the reference weight instead.",
"{0}lb 전용으로 공개된 수치가 없어요 — 대신 기준 무게의 수치를 표시하고 있어요."
],
[
"First balls at a full rack only {0} what a strike ball is for.",
"핀 10개가 모두 서 있을 때의 첫 투구만 {0} 스트라이크 볼이 하는 일이 바로 이거예요."
],
[
"{0} shots — too few to rely on",
"{0}구 — 판단하기엔 너무 적어요"
],
[
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than {0} shots behind it, so treat it as preliminary. A dash means no shots at all.",
"모든 숫자는 스트라이크율이에요. 굵게 표시된 볼이 그 구간 1위예요. 차이가 우연으로 볼 수 있을 만큼 작으면 아무것도 굵게 표시하지 않아요. 주황색 비율은 근거가 되는 투구 수가 {0} 미만이라 잠정적인 수치로 봐 주세요. ‘—’는 투구가 하나도 없다는 뜻이에요."
],
[
"{0} went quiet. Try again in a moment.",
"{0}에게서 응답이 없었어요. 잠시 후 다시 시도해 주세요."
],
[
"Couldn't reach {0}. Try again in a moment.",
"{0}과 연결하지 못했어요. 잠시 후 다시 시도해 주세요."
],
[
"Ask {0}, the bowling genie",
"볼링 지니 {0}에게 물어보기"
],
[
"You've used all {0} today. {1} is back tomorrow.",
"오늘 질문 {0}개를 모두 사용했어요. {1}(은)는 내일 다시 돌아와요."
],
[
"The Stats screens cover the usual numbers. {0} is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.",
"일반적인 수치는 ‘통계’ 화면에서 볼 수 있어요. {0}은 그 화면으로는 답할 수 없는 질문을 위한 기능이에요 — 내 볼링에 대해 물어보면 지금까지 기록한 내용을 바탕으로 답을 찾아 줘요. 아직 기록하지 않는 항목이 필요하면 무엇부터 기록하면 좋을지 알려 줘요."
],
[
"You're on {0} in this league. Making {1} puts you on its roster and takes you off {2}'s. Your scores stay yours.",
"이 리그에서 지금 {0} 소속이에요. {1}(을)를 만들면 그 팀 명단에 들어가고 {2} 팀원 명단에서 빠져요. 내 점수는 그대로 내 기록으로 남아요."
],
[
"Couldn't find \"{0}\" in the cloud — this team was created on this device only and won't be visible to teammates. Try again once you're back online.",
"클라우드에서 ‘{0}’ 팀을 찾을 수 없어요 — 이 팀은 이 기기에서만 만들어져서 팀원에게 보이지 않아요. 다시 온라인이 되면 다시 시도해 주세요."
],
[
"\"{0}\" was created locally but couldn't reach the cloud yet ({1}). It'll keep retrying in the background.",
"‘{0}’ 팀은 이 기기에 만들어졌지만 아직 클라우드에 올라가지 않았어요({1}). 백그라운드에서 계속 다시 시도해요."
],
[
"Combine your \"{0}\" with the shared one{1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"‘{0}’ 리그를 공유 리그{1}(과)와 합칠까요? 내 게임, 팀, 리그 설정이 공유 리그로 옮겨지고, 이미 있는 팀도 보이게 돼요. 되돌릴 수 없어요."
],
[
"\"{0}\" was saved on this device only and hasn't reached the cloud yet — it won't be visible to teammates or usable for creating a team until it syncs. It'll keep retrying in the background if you're offline; check back if this persists.",
"‘{0}’ 리그는 이 기기에만 저장되었고 아직 클라우드에 올라가지 않았어요 — 동기화될 때까지 팀원에게 보이지 않고 팀을 만드는 데도 쓸 수 없어요. 오프라인이면 백그라운드에서 계속 다시 시도해요. 이 상태가 계속되면 나중에 다시 확인해 주세요."
],
[
"You already have a league called \"{0}\". Pick a different name.",
"‘{0}’ 리그가 이미 있어요. 다른 이름을 골라 주세요."
],
[
"\"{0}\" was renamed on this device only and hasn't reached the cloud yet. It'll keep retrying in the background if you're offline; check back if this persists.",
"‘{0}’ 리그의 이름 변경은 이 기기에만 반영되었고 아직 클라우드에 올라가지 않았어요. 오프라인이면 백그라운드에서 계속 다시 시도해요. 이 상태가 계속되면 나중에 다시 확인해 주세요."
],
[
"You're not on {0} as {1}, so there's nothing to leave.",
"{1} 이름으로 {0}에 소속되어 있지 않아서 나갈 팀이 없어요."
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
"이 리그에서 지금 {0} 소속이에요. {1}에 가입하면 {2} 팀원 명단에서 빠져요. 내 점수는 그대로 내 기록으로 남아요."
],
[
"You're on {0}.",
"{0}에 가입했어요."
],
[
"{0} {1} on {2} now.",
"{0}(이)가 이제 {2}에 가입했어요."
],
[
"You're on {0} in this league. If {1} approve{2:s} you, you'll be taken off {3}'s roster. Your scores stay yours.",
"이 리그에서 지금 {0} 소속이에요. {1}에서 승인하면 {3} 팀원 명단에서 빠져요. 내 점수는 그대로 내 기록으로 남아요."
],
[
"This replaces your request to join {0}.",
"기존 {0} 가입 요청은 이 요청으로 대체돼요."
],
[
"You've joined {0}. It'll show under Social.",
"{0}에 가입했어요. ‘친구’에 표시돼요."
],
[
"This tournament is {0}’s. Switch bowler to save it.",
"이 대회는 {0}의 기록이에요. 저장하려면 볼러를 바꿔 주세요."
],
[
"profile|{0}",
""
],
[
"These leagues were restored on this device only and haven't reached the cloud yet: {0}. They'll keep retrying in the background if you're offline.",
"다음 리그는 이 기기에만 복원되었고 아직 클라우드에 올라가지 않았어요: {0}. 오프라인이면 백그라운드에서 계속 다시 시도해요."
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
"· {0}구"
],
[
"{0} changes backing up",
"변경 사항 {0}개 백업 중"
],
[
"Inbox, {0} waiting",
"알림함, {0}개 대기 중"
],
[
"✓ {0} {1} saved on this phone. Nothing is lost.",
"✓ 변경 사항 {0}개가 이 휴대폰에 저장되어 있어요. 사라진 건 없어요."
],
[
"mbj-app-content mbj-view-{0}",
""
],
[
"🧑‍🏫 Coach{0}",
"🧑‍🏫 코치{0}"
],
[
"Invitation to join {0}",
"{0} 가입 초대"
],
[
"{0} wants to join {1}",
"{0} 님이 {1}에 가입을 요청했어요"
],
[
"Joining takes you off {0}.",
"가입하면 {0}에서 빠지게 돼요."
],
[
"Approving moves them off {0}.",
"승인하면 이 볼러는 {0}에서 빠지게 돼요."
],
[
"📥 {0} waiting for you",
"📥 확인 대기 {0}건"
],
[
"{0} total · {1} average · {2} high{3}{4}",
"합계 {0} · 에버리지 {1} · 하이 게임 {2}{3}{4}"
],
[
"({0} scratch + {1} hcp)",
"(스크래치 {0} + 핸디 {1})"
],
[
"{0}{1} vs the cut",
"{0} 컷라인 대비 {1}"
],
[
"{0}-{1}{2}{3}{4} match{5:s}{6}{7}{8} with bonus",
"{4}경기 {0}-{1}{2}{6}{7} 보너스 포함 {8}"
],
[
"· {0} average",
"· 에버리지 {0}"
],
[
"{0}{1} of {2} step{3:s} won{4}",
"{0}{2}스텝 중 {1}승{4}"
],
[
"{0} seed ·",
"{0} 시드 ·"
],
[
"· finished {0}",
"· 최종 {0}"
],
[
"{0} night{1:s} · {2} games · {3} average · {4} high",
"{0}회 · {2}게임 · 에버리지 {3} · 하이 게임 {4}"
],
[
"1.5px solid {0}",
""
],
[
"Open results for {0}",
"{0} 결과 열기"
],
[
"{0} series · {1} average · {2} high",
"시리즈 {0} · 에버리지 {1} · 하이 게임 {2}"
],
[
"{0}% strikes{1}{2}",
"스트라이크 {0}%{1}{2}"
],
[
"· {0}% spares",
"· 스페어 {0}%"
],
[
"· {0} split{1:s}",
"· 스플릿 {0}번"
],
[
"Delete this night? {0} game{1:s} and every frame logged with them. This cannot be undone.",
"이날 기록을 삭제할까요? {0}게임과 여기에 기록한 모든 프레임이 삭제돼요. 되돌릴 수 없어요."
],
[
"Everyone you've bowled with, by average. {0}",
"함께 친 모든 사람을 에버리지 순으로 보여 줘요. {0}"
],
[
"{0} game{1:s}",
"{0}게임"
],
[
"{0} night{1:s}",
"{0}회"
],
[
"{0} win{1:s}",
"{0}승"
],
[
"Send {0} their badges",
"{0}에게 배지 보내기"
],
[
"Free fall on {0}.",
"{0}번 레인은 프리폴이에요."
],
[
"Where does {0} bowl? Set once per season — it lets you compare how you score house to house.",
"{0}(은)는 어느 볼링장에서 치나요? 시즌마다 한 번만 설정하면 돼요 — 볼링장별 점수를 비교할 수 있어요."
],
[
"{0} mi",
"{0}마일"
],
[
"Target: {0}{1} {2}{3}",
"목표: {2} {0}{1}{3}"
],
[
"reached {0}{1}",
"결과 {0}{1}"
],
[
"Due {0}",
"기한: {0}"
],
[
"(+{0} more)",
"(외 {0}개)"
],
[
"Target {0}{1} — no result logged yet.",
"목표 {0}{1} — 아직 기록된 결과가 없어요."
],
[
"Bowls {0} on {1}",
"{1}에 {0} 출전 예정"
],
[
"{0} — asked to be your {1}",
"{0} — {1}(으)로 연결 요청 중"
],
[
"They enter it on their own phone and you{0}re connected — no searching for each other by name.",
"상대가 자기 휴대폰에서 입력하면 바로 연결돼요 — 서로 이름으로 찾을 필요가 없어요."
],
[
"Connected. They{0}re in the list above.",
"연결됐어요. 위 목록에 표시돼요."
],
[
"Goal for {0}",
"{0}의 목표"
],
[
"Next session with {0}",
"{0}(과)와의 다음 레슨"
],
[
"{0}'s Game",
"{0}의 성적"
],
[
"From {0} shots",
"{0}구 기준"
],
[
"Misses: {0}",
"미스: {0}"
],
[
"Tasks — {0}",
"과제 — {0}"
],
[
"{0}. An 800 series is an 800 series.",
"{0}. 800점 시리즈는 800점 시리즈니까요."
],
[
"{0}, beating your {1} by {2}.",
"{0}점, 이전 기록 {1}점보다 {2}점 높아요."
],
[
"your {0} drill",
"{0} 연습 드릴"
],
[
"Mentions {0}, which you haven't logged enough of yet — treat that part as a guess.",
"{0}에 대한 내용이 있지만 아직 기록이 충분하지 않아요 — 이 부분은 추측으로 참고해 주세요."
],
[
"{0} added. {1} you already had.",
"{0}(을)를 추가했어요. {1}(은)는 이미 있었어요."
],
[
"You already had {0}.",
"{0} 이미 있어요."
],
[
"all {0} of those nights",
"그 {0}회 기록은 모두"
],
[
"Manufacturer specifications. Source: {0}",
"제조사 스펙. 출처: {0}"
],
[
"Verified by {0} bowlers. Locked from edits.",
"볼러 {0}명이 검증했어요. 수정할 수 없도록 잠겨 있어요."
],
[
"Entered by another bowler and confirmed by {0}. Not manufacturer data.",
"다른 볼러가 입력했고 {0}명이 확인했어요. 제조사 데이터가 아니에요."
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
"{0}에서만 획득 가능"
],
[
"Earned in {0} or {1}",
"{0} 또는 {1}에서 획득 가능"
],
[
"date must look like 2026-09-17, got \"{0}\"",
"날짜는 2026-09-17 형식이어야 해요(입력값: \"{0}\")"
],
[
"no such date: {0}",
"존재하지 않는 날짜예요: {0}"
],
[
"date looks wrong: {0}",
"날짜가 잘못된 것 같아요: {0}"
],
[
"date is in the future: {0}",
"미래 날짜예요: {0}"
],
[
"{0} must be a whole number, got \"{1}\"",
"{0}(은)는 정수여야 해요(입력값: \"{1}\")"
],
[
"The header row needs these columns: {0}.",
"헤더 행에 다음 열이 있어야 해요: {0}."
],
[
"That file has {0} rows. The limit is {1}.",
"파일에 {0}행이 있어요. 최대 {1}행까지 가능해요."
],
[
"{0} appears twice in this file",
"{0}(이)가 이 파일에 두 번 있어요"
],
[
"{0} — diagnostics",
""
],
[
"Ask {0} something. She's got your whole history in here.",
"{0}에게 무엇이든 물어보세요. 지금까지의 기록을 모두 알고 있어요."
],
[
"That's a lot. Try asking {0} one thing.",
"한꺼번에 너무 많아요. {0}에게 한 가지만 물어보세요."
],
[
"{0} only knows bowling. That one's free — ask her something else.",
"{0}은 볼링만 알아요. 방금 질문은 차감되지 않아요 — 다른 걸 물어보세요."
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
"목표까지 게임당 {0}핀 남았어요."
],
[
"Beat your best by {0} pin{1:s}.",
"최고 게임보다 {0}핀 더 쳐 보세요."
],
[
"Beat your best series by {0} pin{1:s}.",
"최고 시리즈보다 {0}핀 더 쳐 보세요."
],
[
"Keep {0} of your next {1} {2} clean",
"앞으로 {2} {1}개 중 {0}개를 클린으로 유지"
],
[
"{0}{1} {2} of your next {3} {4}",
"앞으로 {4} {3}번 중 {2}번 성공"
],
[
"{0} — {1} more than you are now.",
"{0} — 지금보다 {1}번 더 많은 목표예요."
],
[
"Corrected by {0}.",
"{0}(이)가 수정했어요."
],
[
"Game {0}: you logged {1}, the photo reads {2}. Yours is kept unless you change it.",
"{0}번째 게임: 기록한 점수는 {1}점, 사진에서 읽은 점수는 {2}점이에요. 바꾸지 않으면 기록한 점수가 그대로 유지돼요."
],
[
"game {0} ({1} vs {2})",
"{0}번째 게임(기록 {1}점, 사진 {2}점)"
],
[
"These disagree with what you logged — {0}. Yours are kept unless you change them.",
"기록한 점수와 다른 게임이 있어요 — {0}. 바꾸지 않으면 기록한 점수가 그대로 유지돼요."
],
[
"{0} nights of scores to check",
"확인할 점수 ({0}회분)"
],
[
"{0} nights need re-entering",
"{0}회분 점수를 다시 입력해야 해요"
],
[
"{0} teammate score{1:s} unconfirmed",
"미확인 팀원 점수 {0}개"
],
[
"{0} wants to be your {1}",
"{0} 님이 {1}(으)로 연결을 요청했어요"
],
[
"{0} task{1:s} from your coach",
"코치가 준 과제 {0}개"
],
[
"{0} task update{1:s} from your bowlers",
"내 볼러가 보낸 과제 업데이트 {0}건"
],
[
"{0} sent a friend request",
"{0} 님이 친구 요청을 보냈어요"
],
[
"{0}Accept or decline on the Team tab.",
"{0}‘팀’ 탭에서 수락하거나 거절해 주세요."
],
[
"{0} has finished its season.",
"{0} 시즌이 끝났어요."
],
[
"Your specs for {0} were rejected",
"{0} 스펙이 반려됐어요"
],
[
"Game {0}, frame {1}",
"{0}게임 {1}프레임"
],
[
"{0} pin{1:s} away",
"목표까지 {0}핀"
],
[
"Best {0}",
"최고 {0}점"
],
[
"Milestones up to a {0} average",
"에버리지 {0}까지의 마일스톤"
],
[
"{0} pin{1:s} short · best {2}",
"{0}핀 부족 · 최고 {2}"
],
[
"{0}, and {1}",
"{0} 및 {1}"
],
[
"You usually bowl {0}. The app sets itself up for you on those days instead of asking.",
"보통 {0}에 볼링을 쳐요. 그 요일에는 묻지 않고 앱이 알아서 준비해요."
],
[
"Min {0}{1}",
"최소 {0}{1}"
],
[
"Max {0}{1}",
"최대 {0}{1}"
],
[
"Leave {0}?",
"{0}에서 나갈까요?"
],
[
"You'll no longer be part of {0}.",
"{0}에서도 빠지게 돼요."
],
[
"You'll still be on {0} in {1}.",
"{1}에서는 계속 {0} 소속이에요."
],
[
"Your teammates ({0}) will see you've left.",
"팀원({0})에게 탈퇴 사실이 표시돼요."
],
[
"Won every match, by {0} pins on average.",
"모든 경기에서 평균 {0}핀 차로 이겼어요."
],
[
"Lost every match, but all of them by under {0} pins.",
"모든 경기에서 졌지만, 모두 {0}핀 미만 차이였어요."
],
[
"Lost every match, by {0} pins on average.",
"모든 경기에서 평균 {0}핀 차로 졌어요."
],
[
"won by {0} on average",
"이긴 경기는 평균 {0}핀 차"
],
[
"lost by {0}",
"진 경기는 평균 {0}핀 차"
],
[
"{0} of {1} came down to under {2} pins.",
"{1}경기 중 {0}경기는 {2}핀 미만 차이로 승부가 갈렸어요."
],
[
"Official {0} PBA specs.",
"{0}년 PBA 공식 스펙."
],
[
"Not on the {0} sheet — check patternlibrary.kegel.net if you bowled it.",
"{0}년 시트에 없어요 — 이 패턴에서 쳐 봤다면 patternlibrary.kegel.net에서 확인해 보세요."
],
[
"{0} · {1} · specs not entered yet",
"{0} · {1}년 · 스펙 미입력"
],
[
"fewer than {0} games in {1}",
"{1}에서 {0}게임 미만"
],
[
"{0} average across {1} games",
"{0}에서 {1}게임 기준 에버리지"
],
[
"no league reached {0} games, and the combined total didn't either",
"{0}게임을 채운 리그가 없고, 전체 합산도 마찬가지"
],
[
"{0} average across {1} games (your strongest league)",
"{0}에서 {1}게임 기준 에버리지 (가장 성적이 좋은 리그)"
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
"DESCRIPTION:{0} {1}분 전"
],
[
"Retired {0}",
"{0} 은퇴"
],
[
"{0} · nothing logged with it",
"{0} · 이 볼로 기록한 투구 없음"
],
[
"{0} · {1}, too few to compare",
"{0} · {1}, 비교하기엔 너무 적음"
],
[
"{0} · {1} · {2}% strikes",
"{0} · {1} · 스트라이크 {2}%"
],
[
"{0} couldn't be read and were left out. A clearer photo would get more — what's below is still safe to save.",
"{0}(은)는 읽지 못해서 제외했어요. 더 선명한 사진이면 더 많이 읽을 수 있어요 — 아래 내용은 그대로 저장해도 괜찮아요."
],
[
"The series says {0} but the {1} games add up to {2} — {3}. Check before saving.",
"시리즈는 {0}점인데 {1}게임 합계는 {2}점이에요 — {3}. 저장하기 전에 확인하세요."
],
[
"The card says {0} but the frames add up to {1} — {2}. Check before saving.",
"점수표에는 {0}점인데 프레임 합계는 {1}점이에요 — {2}. 저장하기 전에 확인하세요."
],
[
"board must be {0} to {1}",
"보드는 {0}~{1} 사이로 입력하세요"
],
[
"{0} night{1:s} · {2} game{3:s}",
"{0}회 · {2}게임"
],
[
"Average {0}",
"에버리지 {0}"
],
[
"High game {0}{1}",
"하이 게임 {0}{1}"
],
[
"· High series {0}",
"· 하이 시리즈 {0}"
],
[
"{0} game{1:s} over 200",
"200점 이상 {0}게임"
],
[
"{0}% strikes · {1}% spares",
"스트라이크 {0}% · 스페어 {1}%"
],
[
"{0}${1} on the season",
"시즌 손익 {0}${1}"
],
[
"{0} – now",
"{0} – 현재"
],
[
"{0} games against {1}",
"{0}게임 대 {1}게임"
],
[
"Your average is the same as last season — {0}.",
"에버리지가 지난 시즌과 같아요 — {0}."
],
[
"Your average is {0} {1} {2} on last season — {3}.",
"에버리지가 지난 시즌보다 {1}핀 {0}했어요 — {3}."
],
[
"{0} One of those seasons is short, so treat it lightly.",
"{0} 두 시즌 중 하나는 게임 수가 적으니 참고만 하세요."
],
[
"Tied at {0} — nobody's settling this tonight.",
"{0}점 동점 — 오늘은 승부가 안 났어요."
],
[
"{0}, by just {1}. That was close.",
"{0}점, 단 {1}점 차. 아슬아슬했어요."
],
[
"{0}, won by {1}.",
"{0}점, {1}점 차로 승리."
],
[
"Jumped {0} pins between games.",
"게임 사이에 점수를 {0}핀 끌어올렸어요."
],
[
"Dropped {0} pins between games.",
"게임 사이에 점수가 {0}핀 떨어졌어요."
],
[
"Every game within {0} pins.",
"모든 게임이 {0}핀 차 이내였어요."
],
[
"{0} average over {1} game{2:s}",
"{1}게임 에버리지 {0}"
],
[
"{0} — {1} above your average.",
"{0} — 내 에버리지보다 {1}핀 높아요."
],
[
"{0} — {1} below your average.",
"{0} — 내 에버리지보다 {1}핀 낮아요."
],
[
"{0} — right on your average.",
"{0} — 딱 내 에버리지만큼이에요."
],
[
"{0} of {1} across {2} drill{3:s}",
"연습 드릴 {2}개에서 {0}/{1}"
],
[
"{0} {1} for {2}{3}{4}: {5}.",
"{0}{3}{4}: {2}게임 합계 {1}점 ({5})."
],
[
"Badge{0:s} earned: {1}",
"획득한 배지: {1}"
],
[
"Tracked with {0} — {1}",
"{0} 앱으로 기록 — {1}"
],
[
"{0}-game series",
"{0}게임 시리즈"
],
[
"{0}+{1} more",
"{0}외 {1}개"
],
[
"+{0} more",
"외 {0}개"
],
[
"Won ${0} in side pots",
"사이드 팟에서 ${0} 획득"
],
[
"Hit my goal: {0}",
"목표 달성: {0}"
],
[
"New personal best series — beat {0}",
"개인 하이 시리즈 경신 — 이전 기록 {0} 돌파"
],
[
"New personal best game — beat {0}",
"개인 하이 게임 경신 — 이전 기록 {0} 돌파"
],
[
"{0} clean game{1:s}",
"클린 게임 {0}회"
],
[
"{0} pins over my average",
"내 에버리지보다 {0}핀 높음"
],
[
"{0} Tracked with {1} — {2}",
"{0} {1} 앱으로 기록 — {2}"
],
[
"{0} games — averaging {1}, high {2}, low {3}.",
"{0}게임 — 에버리지 {1}, 최고 {2}, 최저 {3}."
],
[
"{0} has earned {1}{2} badge{3:s}",
"{0}: 배지 {1}{2}개 획득"
],
[
"{0} earned a badge tonight",
"{0}: 오늘 배지 획득"
],
[
"{0} earned {1} badges tonight",
"{0}: 오늘 배지 {1}개 획득"
],
[
"Keep them: {0}",
"배지 간직하기: {0}"
],
[
"Standings Tracked with {0} — {1}",
"순위표 {0} 앱으로 기록 — {1}"
],
[
"Qualifying: {0} across {1} game{2:s}",
"예선: {1}게임 합계 {0}점"
],
[
"Made the cut by {0}",
"{0}핀 차로 컷 통과"
],
[
"Missed the cut by {0}",
"{0}핀 차로 컷 탈락"
],
[
", {0} with bonus",
", 보너스 포함 {0}점"
],
[
"Match play: {0}{1}",
"매치 플레이: {0}{1}"
],
[
"from the {0} seed",
"({0} 시드에서 출발)"
],
[
"Won the stepladder{0}",
"스텝래더 우승{0}"
],
[
"Stepladder: {0}{1}",
"스텝래더: {0}{1}"
],
[
"Stepladder: {0} of {1} steps won{2}",
"스텝래더: {1}스텝 중 {0}승{2}"
],
[
"Up ${0} on the day",
"이날 ${0} 이익"
],
[
"Down ${0} on the day",
"이날 ${0} 손실"
],
[
"{0} game{1:s} · {2} average",
"{0}게임 · 에버리지 {2}"
],
[
"{0} {1} if you {2}",
"{2} 통계 {0}개가 잠금 해제돼요"
],
[
"{0}. Either on its own is fine.",
"{0}. 둘 중 하나만 해도 괜찮아요."
],
[
"Won the stepladder{0}.",
"스텝래더 우승{0}."
],
[
"— {0} straight",
"— {0}연승"
],
[
"to the {0} seed",
"({0} 시드에게 패배)"
],
[
"Finished {0}{1}.",
"최종 {0}{1}."
],
[
"you and {0}",
"나와 {0}"
],
[
"Baker: {0} bowled this together, so the score stays out of your average.",
"베이커: {0}(이)가 함께 투구한 게임이라 이 점수는 에버리지에 들어가지 않아요."
],
[
"{0} more night{1:s} needed before a direction means anything.",
"추세를 판단하려면 {0}회 더 기록해야 해요."
],
[
"Trending {0} about {1}{2} across this stretch.",
"이 기간 동안 약 {1}{2} {0} 추세예요."
],
[
"Last {0} — showing {1} of {2} {3}",
"최근 {0}개 — {2}{3} 중 {1}{3} 표시"
],
[
"Last {0} days — showing {1} of {2} {3}",
"최근 {0}일 — {2}{3} 중 {1}{3} 표시"
],
[
"{0} to {1} — showing {2} of {3} {4}",
"{0} ~ {1} — {3}{4} 중 {2}{4} 표시"
],
[
"{0} of {1} {2}{3}",
""
],
[
"{0}· last time {1}%",
"{0}· 지난번 {1}%"
],
[
"Save Drill ({0} attempts)",
"연습 드릴 저장 ({0}회)"
],
[
"Remove {0} as a friend?",
"{0}(을)를 친구에서 삭제할까요?"
],
[
"Not enough data yet — {0} more {1} before this is worth reporting.",
"아직 데이터가 부족해요 — 의미 있는 결과를 보려면 {1}(이)가 {0}번 더 필요해요."
],
[
"{0} to go",
"목표까지 {0}"
],
[
"{0} targets run from {1} to {2}.",
"{0} 목표는 {1}~{2} 사이로 입력하세요."
],
[
"Target{0}",
"목표{0}"
],
[
"retrying after: {0}",
""
],
[
"Nothing matched \"{0}\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".",
"‘{0}’에 해당하는 결과가 없어요. 앱에 나오는 단어로 검색해 보세요 — ‘스페어’, ‘팀’, ‘볼’, ‘가져오기’."
],
[
"{0} games logged",
"{0}게임 기록"
],
[
"· {0} seasons",
"· {0}시즌"
],
[
"{0} badges earned",
"배지 {0}개 획득"
],
[
"{0} · {1} milestone{2:s} so far",
"{0} · 지금까지 마일스톤 {1}개 달성"
],
[
"Next · {0}",
"다음 · {0}"
],
[
"Imported {0} night{1:s}.",
"볼링 {0}회 기록을 가져왔어요."
],
[
"That didn't save: {0}",
"저장하지 못했어요: {0}"
],
[
"A CSV with four columns: {0}. Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.",
"4개 열로 된 CSV 파일: {0}. 날짜는 2026-09-17 형식, 점수는 0~300 사이의 정수이며, 하루에 1~3게임을 넣을 수 있어요."
],
[
"{0} row{1:s} skipped",
"{0}행 건너뜀"
],
[
"Row {0}",
"{0}행"
],
[
"and {0} more",
"외 {0}개"
],
[
"{0} night{1:s} you already have",
"이미 기록한 볼링 {0}회"
],
[
", and {0} more",
", 외 {0}개"
],
[
"Keep mine, import the other {0}",
"내 기록 유지, 나머지 {0}회 가져오기"
],
[
"Import {0} night{1:s}",
"{0}회 가져오기"
],
[
"Frame-by-frame data included for {0}{1}{2} — confirming adds it to your shot history.",
"{0}게임의 프레임별 데이터가 포함돼 있어요 — 확인하면 내 투구 기록에 추가돼요."
],
[
"Join {0}?",
"{0}에 가입할까요?"
],
[
"You were added to the roster as {0}{1}. Teammates will be able to import your scores from a scorecard photo — you still confirm them.",
"팀원 명단에 {0}{1}(으)로 추가됐어요. 이제 팀원이 점수표 사진에서 내 점수를 가져올 수 있어요 — 확인은 계속 직접 해요."
],
[
", position {0}",
", 투구 순서 {0}번"
],
[
"Team {0}",
"팀 {0}"
],
[
"{0} night{1:s} imported by a teammate.",
"팀원이 {0}회분 점수를 가져왔어요."
],
[
"{0}-{1} open",
"{0}-{1} 오픈"
],
[
"Spare: {0}",
"스페어: {0}"
],
[
"Game {0}{1}",
"{0}게임{1}"
],
[
"⚠️ {0} fill ball{1:s} below couldn't be reliably read from the image -- please double-check the pin count.",
"⚠️ 아래 보너스 투구 {0}개를 이미지에서 정확히 읽지 못했어요 -- 핀 수를 다시 확인해 주세요."
],
[
"Frame {0}{1}{2}",
"{0}프레임{1}{2}"
],
[
"These images come to about {0}MB, which is too much to send at once. Remove one and try again — images are sent at full quality, so fewer is better than smaller.",
"이미지 용량이 약 {0}MB라서 한 번에 보내기에는 너무 커요. 한 장을 빼고 다시 시도하세요 — 이미지는 원본 화질로 보내지기 때문에 크기를 줄이는 것보다 장수를 줄이는 편이 좋아요."
],
[
"retried on {0}",
""
],
[
"(Already retried {0} time{1:s}.)",
"(이미 {0}번 다시 시도했어요.)"
],
[
"Your images are still selected, so just tap {0} again in a minute.{1}",
"이미지는 선택된 그대로 있으니 1분쯤 뒤에 ‘{0}’ 버튼만 다시 누르세요.{1}"
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
"{1}의 {0}번째 게임에는 이미 투구 기록이 있어요."
],
[
"{0} game score{1:s}",
"{0}게임 점수"
],
[
"Sent {0} their scores to confirm.",
"{0}에게 확인용 점수를 보냈어요."
],
[
"Imported {0}{1} -- check the Results, then save the night.",
"{0}(을)를 가져왔어요{1} -- ‘결과’를 확인한 뒤 기록을 저장하세요."
],
[
"Scorecard Screenshot{0:s}",
"점수표 스크린샷"
],
[
"Scorecard {0}",
"점수표 {0}"
],
[
"Remove scorecard {0}",
"점수표 {0} 삭제"
],
[
"Clear all {0} image{1:s}",
"이미지 {0}장 모두 지우기"
],
[
"{0} images ({1}MB, full quality) — reading these can take a few minutes.",
"이미지 {0}장 ({1}MB, 원본 화질) — 읽는 데 몇 분 걸릴 수 있어요."
],
[
"Reading a scorecard can take a minute or two. ({0}MB, full quality.)",
"점수표를 읽는 데 1~2분 걸릴 수 있어요. ({0}MB, 원본 화질)"
],
[
"Working through {0} images. This can take a few minutes — every frame is read individually.",
"이미지 {0}장을 처리하고 있어요. 몇 분 걸릴 수 있어요 — 프레임을 하나씩 읽고 있어요."
],
[
"{0} bowler{1:s} read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.",
"점수표에서 볼러 {0}명을 읽었어요. 저장하기 전에 한 명씩 확인하세요 — 잘못 연결하면 다른 사람의 게임이 엉뚱한 사람의 기록에 들어가요."
],
[
"Column {0}",
"{0}열"
],
[
"{0} game{1:s} · {2}{3}{4}",
"{0}게임 · {2}{3}{4}"
],
[
"Games add to {0} but the card's scratch series is {1}. One of the games was misread — check the card.",
"게임 합계는 {0}점인데 점수표의 스크래치 시리즈는 {1}점이에요. 게임 중 하나를 잘못 읽었어요 — 점수표를 확인하세요."
],
[
"Add \"{0}\" as a new bowler",
"\"{0}\" 새 볼러로 추가"
],
[
"Closest match: {0}",
"가장 비슷한 볼러: {0}"
],
[
"Matched on the alias \"{0}\".",
"별칭 \"{0}\" 기준으로 연결했어요."
],
[
"Card order: {0}",
"점수표 순서: {0}"
],
[
"check the {0} below, correct anything that's wrong, then save.",
"아래 {0}(을)를 확인하고, 틀린 부분이 있으면 고친 다음 저장하세요."
],
[
"{0} game scores",
"{0}게임 점수"
],
[
"These go to {0} to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.",
"이 점수는 확인 요청과 함께 {0}에게 보내져요. 점수는 바로 반영돼요 — 확인하면 확인됨으로 표시만 돼요. 보내기 전에 잘못 읽힌 부분을 고치세요."
],
[
"read as \"{0}\"",
"인식된 이름: \"{0}\""
],
[
"Game{0:s} {1} couldn't be read — type the real score, or clear the box if they didn't bowl it.",
"{1}번째 게임을 읽지 못했어요 — 실제 점수를 입력하거나, 치지 않은 게임이면 칸을 비우세요."
],
[
"Series {0}{1}",
"시리즈 {0}{1}"
],
[
"· card printed {0}",
"· 점수표상 {0}"
],
[
"Save & Send To {0} Teammate{1:s}",
"저장하고 팀원 {0}명에게 보내기"
],
[
"{0} games. Only statistics with enough data to be meaningful are analysed.",
"{0}게임. 의미 있는 결과를 낼 만큼 데이터가 충분한 통계만 분석해요."
],
[
"{0} of {1} · ~{2} more {3}",
"{0}/{1} · 약 {2}게임 더"
],
[
"You're close on {0} — a couple more nights and it unlocks.",
"{0} 비교가 곧 열려요 — 두세 번만 더 볼링하면 돼요."
],
[
"{0} more {1} to go.",
"앞으로 {0}게임 남았어요."
],
[
"Insights need at least {0} games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.",
"분석에는 최소 {0}게임이 필요해요. 그보다 적으면 날마다 수치가 너무 크게 흔들려서 믿을 만한 이야기를 할 수 없어요 — 그럴듯해 보여도 실제로는 잡음일 뿐인 패턴이 나오게 돼요."
],
[
"You have {0} games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.",
"현재 {0}게임을 기록했어요. 아직 제대로 분석할 만큼 데이터가 쌓인 항목이 없어요 — 가장 가까운 항목은 다음과 같아요."
],
[
"{0} more {1}",
"앞으로 {0} ({1})"
],
[
"Based on {0} games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.",
"지금까지 {0}게임을 바탕으로 한 분석이에요. 기록할수록 더 정확해져요 — 몇 번 치면 힌트 정도, 한 시즌이면 실제로 행동에 옮길 근거가 돼요."
],
[
"You're working with {0} — worth talking this through with them before changing anything. They can see what these numbers can't.",
"{0}에게 코칭을 받고 있어요 — 무언가를 바꾸기 전에 코치와 충분히 이야기해 보세요. 코치는 이 숫자가 보여 주지 못하는 것을 볼 수 있어요."
],
[
"· {0} of {1}",
"· {1}개 중 {0}개"
],
[
"Nothing matches “{0}”{1}.",
"{1} ‘{0}’ 검색 결과가 없어요."
],
[
"On the road since {0}",
"{0}부터 이어온 여정"
],
[
"{0} Badges",
"{0} 배지"
],
[
"The free plan follows this league.{0} Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.",
"무료 플랜은 이 리그만 기록해요.{0} 리그를 바꾸거나 두 개 이상의 리그에서 볼링하는 건 Pro 기능이에요 — 구독하면 기록한 모든 내용이 다시 돌아와요."
],
[
"Paused: {0}.",
"일시 중지: {0}."
],
[
"Paused: {0}. Practice and Just Bowling stay open either way.",
"일시 중지: {0}. 연습과 자유 게임은 어느 경우든 그대로 이용할 수 있어요."
],
[
"Saved. {0} is your active league.",
"저장했어요. {0}(이)가 이용 중인 리그예요."
],
[
"{0} · {1} games",
"{0} · {1}게임"
],
[
"vs your {0} overall{1}{2} game{3:s}",
"전체 에버리지 {0} 대비{1}{2}게임"
],
[
"{0} {1} more",
"{0} 외 {1}개"
],
[
"Lane diagram, {0} of {1} balls shown",
"레인 다이어그램, 볼 {1}개 중 {0}개 표시"
],
[
"breakpoint {0}′",
"브레이크 {0}′"
],
[
"{0} shots around {1}",
"{1} 부근 {0}구"
],
[
", across {0} nights",
"({0}회 합계)"
],
[
"{0} made of {1}",
"{1}번 중 {0}번 처리"
],
[
"{0} missed of {1}",
"{1}번 중 {0}번 실패"
],
[
"Show all {0}",
"{0}개 모두 보기"
],
[
"{0} of 4 points",
"{0}/4포인트"
],
[
"{0} — tonight",
"{0} — 오늘 기록"
],
[
"{0}'s night",
"{0}의 오늘 기록"
],
[
"G{0} Theory",
"{0}G 이론"
],
[
"▼ {0} pins left on the lane",
"▼ 레인에 남긴 핀 {0}개"
],
[
"({0} actual vs {1} possible)",
"(실제 {0}점 / 이론상 {1}점)"
],
[
"Tap the ones you're in. Buy-ins are saved for {0} — you won't need to enter them again.",
"참가하는 게임을 탭하세요. 참가비는 {0} 기준으로 저장돼요 — 다시 입력할 필요가 없어요."
],
[
"{0} game{1:s} tonight · ${2} paid in",
"오늘 {0}게임 · 참가비 ${2}"
],
[
"All nine struck — you took it{0}.",
"9개 프레임 모두 스트라이크 — 팟을 획득{0}했어요."
],
[
"${0} paid in — {1} ${2} on the night.",
"참가비 ${0} — 오늘 잔액 ${2} {1}."
],
[
"Counts for {0}. Bowled today — change the date above if that's the wrong week.",
"{0} 경기로 기록돼요. 실제 투구일은 오늘이에요 — 주차가 다르면 위에서 날짜를 변경하세요."
],
[
"Lanes {0} & {1}",
"{0}·{1}번 레인"
],
[
"Lane {0}",
"{0}번 레인"
],
[
"Pattern name (e.g. {0})",
"패턴 이름 (예: {0})"
],
[
"Game {0} score",
"{0}게임 점수"
],
[
"{0} frames say {1}",
"{0} 프레임 계산: {1}"
],
[
"Frames say {0} — tap to use them",
"프레임 계산은 {0}점 — 탭하면 이 점수를 사용해요"
],
[
"Delete game {0}",
"{0}번째 게임 삭제"
],
[
"Game {0} surface",
"{0}게임 볼 표면"
],
[
"Delete game {0}? This removes the score{1}. It can't be undone.",
"{0}번째 게임을 삭제할까요? 점수{1}(이)가 삭제되며, 되돌릴 수 없어요."
],
[
"Shot Context{0}",
"투구 상황{0}"
],
[
"10th Frame{0}",
"10프레임{0}"
],
[
"Ball {0}",
"{0}구"
],
[
"frame {0}{1} of game {2}",
"{2}번째 게임 {0}프레임{1}"
],
[
", ball {0}",
", {0}구"
],
[
"Delete {0}? This cannot be undone.",
"{0}(을)를 삭제할까요? 되돌릴 수 없어요."
],
[
"Clearing the result deletes {0}. Delete it?",
"결과를 지우면 {0}(이)가 삭제돼요. 삭제할까요?"
],
[
"Leave: {0}{1}",
"남은 핀: {0}{1}"
],
[
"· First ball: {0}",
"· 첫 투구: {0}"
],
[
"Delete game {0} for everyone?{1}",
"모든 볼러의 {0}번째 게임을 삭제할까요?{1}"
],
[
"{0}, game {1}",
"{0}, {1}게임"
],
[
"Switched from {0} to {1} — why?",
"{0}에서 {1}(으)로 교체 — 이유는?"
],
[
"Line{0}",
"라인{0}"
],
[
"· Lane {0}",
"· {0}번 레인"
],
[
"{0} board{1:s} {2} of target",
"타깃에서 {2}(으)로 {0}보드 벗어남"
],
[
"{0} of {1} first balls struck{2}{3}{4}",
"첫 투구 {1}번 중 스트라이크 {0}번{2}{3}{4}"
],
[
", {0} of {1} spares made",
", 스페어 {1}번 중 {0}번 처리"
],
[
", {0} split{1:s}",
", 스플릿 {0}번"
],
[
"Best carry tonight: {0} {1} {2}%{3}over {4} first balls",
"오늘 캐리가 가장 좋은 볼: {0} {1} {2}%{3}(첫 투구 {4}번 기준)"
],
[
"✓ {0} Saved",
"✓ {0} 저장 완료"
],
[
"Save & Finish {0}",
"저장하고 {0} 종료"
],
[
"End {0} & View Results",
"종료하고 결과 보기"
],
[
"nightcap:{0}|{1}|{2}|{3}",
""
],
[
"There are {0} things worth saying about tonight.",
"오늘 짚어 볼 만한 이야기가 {0}가지 있어요."
],
[
"{0} things were true about tonight. Here are the two or three worth hearing.",
"오늘 기록에서 {0}가지 사실을 찾았어요. 그중 들어 볼 만한 두세 가지를 알려 드릴게요."
],
[
"{0} first balls across {1} game{2:s}{3}",
"{1}게임 동안 첫 투구 {0}번 기준{3}"
],
[
", against {0} earlier nights in this league.",
", 이 리그의 이전 {0}회 기록과 비교했어요."
],
[
"Your current book average is {0}.",
"현재 공인 에버리지는 {0}(이)에요."
],
[
"Update to {0}",
"{0}(으)로 업데이트"
],
[
"{0}-handed{1} · {2}",
"투구 손: {0}{1} · {2}"
],
[
"A backup ball goes out to the {0} and hooks back, so your corner pin is the {1} and your pocket is the {2}. Turning this on flips every leave, split and lane drawing to match — you are still{3}-handed everywhere it says so.",
"백업 볼은 평소와 반대쪽으로 나갔다가 휘어 들어오기 때문에 코너 핀은 {1}번 핀, 포켓은 {2} 포켓이 돼요. 이 옵션을 켜면 모든 남은 핀, 스플릿, 레인 그림이 그에 맞게 반전돼요 — 앱에 표시되는 투구 손은 어디서나 그대로예요."
],
[
"Normal {0}-hand hook",
"일반 훅"
],
[
"{0} season wrapped up",
"{0} 시즌이 끝났어요"
],
[
"Not enough games logged here yet to suggest a new number{0}. You can still update it yourself below, or skip for now.",
"여기에 기록된 게임이 아직 부족해서 새 수치를 추천할 수 없어요{0}. 아래에서 직접 업데이트하거나 이번에는 건너뛸 수 있어요."
],
[
"{0}Free fall · {1} game{2:s}",
"{0}프리폴 · {1}게임"
],
[
"{0}String · {1} game{2:s}",
"{0}스트링 · {1}게임"
],
[
"{0}{1}{2} on string",
"스트링에서 {0}{1}{2}"
],
[
"{0}-pins left",
"{0}번 핀 남음"
],
[
"{0}: how often each pin was left standing",
"{0}: 핀별로 남은 빈도"
],
[
"{0}-pin left {1}% of first balls",
"{0}번 핀 남음: 첫 투구의 {1}%"
],
[
"{0}{1} described",
"{0}{1}개 기록됨"
],
[
"{0}% strikes ·",
"스트라이크율 {0}% ·"
],
[
"((100% - {0}px) / {1})",
""
],
[
", running {0}",
", 누적 {0}점"
],
[
"· ball {0}",
"· {0}구"
],
[
"Showing {0} of {1}, newest first.",
"{1}건 중 {0}건 표시 · 최신순"
],
[
"{0} ten pins",
"10번 핀 남음 {0}회"
],
[
"{0} splits",
"스플릿 {0}회"
],
[
"Load {0} More",
"{0}개 더 보기"
],
[
"{0} avg",
"에버 {0}"
],
[
"{0} pins between {1} bowler{2:s}{3}",
"볼러 {1}명 · 총 {0}핀{3}"
],
[
"{0}{1} on my average",
"내 에버리지 대비 {0}{1}"
],
[
"{0} more to {1} tester mode",
"테스터 모드 {1}까지 {0}번 남았어요"
],
[
"Other bowlers have a “{0}” too",
"다른 볼러에게도 “{0}” 리그가 있어요"
],
[
"“{0}” is already here",
"“{0}” 리그가 이미 있어요"
],
[
"{0} to {1} · {2} night{3:s}, {4} game{5:s}",
"{0}~{1} · 리그 {2}회, {4}게임"
],
[
"Usually {0}s",
"보통 {0}"
],
[
"Bowls on {0}s",
"매주 {0}에 볼링"
],
[
"{0} team{1:s} in this league",
"이 리그의 팀 {0}개"
],
[
"sessions-{0}.csv",
"날짜별기록-{0}.csv"
],
[
"shots-{0}.csv",
"투구기록-{0}.csv"
],
[
"bowling-backup-{0}.json",
"볼링백업-{0}.json"
],
[
"You have {0} change{1:s} still waiting to save. {2} will be sent first.",
"현재 {0}건의 변경 사항이 아직 저장 대기 중이에요. 이 변경 사항은 먼저 전송돼요."
],
[
"Signed in as {0}.",
"로그인 계정: {0}"
],
[
"{0} change{1:s} {2} not reached the cloud yet.",
"{0}건의 변경 사항이 아직 클라우드에 전송되지 않았어요."
],
[
"Signing out now may lose {0}. Sign out anyway?",
"지금 로그아웃하면 이 변경 사항이 사라질 수 있어요. 그래도 로그아웃할까요?"
],
[
"{0} is published by My Bowling Journey LLC.",
"{0} 앱은 My Bowling Journey LLC에서 제공해요."
],
[
"Version {0}",
"버전 {0}"
],
[
"{0} day{1:s} left in your trial",
"무료 체험 {0}일 남음"
],
[
"mbj-share-{0}.png",
""
],
[
"Share {0}",
"{0} 공유"
],
[
"{0} Team",
"{0} 팀"
],
[
"Select {0} above",
"위에서 {0}(을)를 선택하세요"
],
[
"Select {0} or {1} above",
"위에서 {0} 또는 {1}(을)를 선택하세요"
],
[
"{0} (you)",
"{0} (나)"
],
[
"Every rate stat side by side against {0}, instead of hunting through separate cards. Split Rate is the one metric here where lower is better.",
"모든 비율 통계를 {0}(과)와 나란히 비교해요. 카드를 하나씩 찾아볼 필요가 없어요. 여기서 스플릿 비율만은 낮을수록 좋은 지표예요."
],
[
"{0} to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.",
"이 항목을 보려면 {0} — 하이 게임/하이 시리즈는 특정 팀원 명단 하나가 필요해요. 인원이 다른 팀을 합치면 볼러가 더 많은 팀이 부당하게 유리해지기 때문이에요."
],
[
"{0}'s Records",
"{0}의 기록"
],
[
", game {0}",
", {0}번째 게임"
],
[
"{0} season record",
"{0} 시즌 전적"
],
[
"{0}-{1} on games, {2}-{3} on pinfall.",
"게임 기준 {0}-{1}, 총 핀 수 기준 {2}-{3}."
],
[
"{0}: {1}/{2} points ({3}-{4} games, {5}-{6} pinfall)",
"{0}: {1}/{2}포인트(게임 {3}-{4}, 총 핀 수 {5}-{6})"
],
[
"{0} to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.",
"이 항목을 보려면 {0} — ‘팀’은 여러 리그의 경기를 섞은 것이 아니라 특정 팀원 명단 하나를 뜻해야 해요."
],
[
"Smaller handicap (avg {0})",
"작은 핸디캡(평균 {0})"
],
[
"Larger handicap (avg {0})",
"큰 핸디캡(평균 {0})"
],
[
"{0}% stk",
"스트라이크 {0}%"
],
[
"{0} shots",
"{0}구"
],
[
"{0} to see this — it needs a specific roster to know who's on top.",
"이 항목을 보려면 {0} — 누가 선두인지 알려면 특정 팀원 명단이 필요해요."
],
[
"{0}wk{1:s} on top",
"{0}주 선두"
],
[
"{0}/{1} games",
"{0}/{1}게임"
],
[
"{0} to see this — it needs a specific roster to know who else was bowling that frame.",
"이 항목을 보려면 {0} — 그 프레임에서 누가 함께 투구했는지 알려면 특정 팀원 명단이 필요해요."
],
[
"{0} of {1} frames with no open.",
"{1}프레임 중 {0}프레임을 오픈 없이 마쳤어요."
],
[
"Frames {0}",
"{0}프레임"
],
[
"Frame {0}",
"{0}프레임"
],
[
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where {0} tends to leave pins, regardless of which game it is.",
"게임별이 아니라 프레임 번호별로 나눠 봤어요 — 몇 번째 게임이든 상관없이, 매번 볼링할 때 특정 시점(워밍업, 레인 트랜지션, 9프레임에서 점수 계산하다 집중이 흐트러지는 순간)에 {0}(이)가 핀을 남기기 쉬운지 보여 줘요."
],
[
"⚠️ Only {0} game{1:s} logged — each frame number needs at least {2} to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.",
"⚠️ 아직 {0}게임만 기록됐어요 — 실제 패턴과 우연을 구분하려면 프레임 번호마다 최소 {2}게임이 필요해요. 그때까지는 결론이 아니라 미리 보기 정도로 봐 주세요."
],
[
"Frame {0} (n={1})",
"{0}프레임(n={1})"
],
[
"Weakest: {0} ({1}) · Strongest: {2} ({3})",
"가장 약함: {0}({1}) · 가장 강함: {2}({3})"
],
[
"{0} {1} vs {2}",
"{0} {1}({2} 대비)"
],
[
"Across {0} fresh racks.",
"10핀 상태 투구 {0}구 기준이에요."
],
[
"Across {0} non-strike balls.",
"스트라이크가 아닌 투구 {0}구 기준이에요."
],
[
"{0} of {1} made. You leave a ten on {2}% of first balls.",
"{1}번 중 {0}번 처리. 첫 투구의 {2}%에서 10번 핀이 남아요."
],
[
"{0} of {1} made. Any leave with exactly one pin standing — 7, 4, 8, 10, or any other.",
"{1}번 중 {0}번 처리했어요. 핀이 딱 하나 남은 경우는 모두 포함돼요 — 7, 4, 8, 10번 핀 등 어떤 핀이든요."
],
[
"{0} split{1:s} left, {2}% of your first balls.",
"스플릿이 {0}번 남았어요. 첫 투구의 {2}%예요."
],
[
"{0} to see who owes a round.",
"누가 한턱 쏠 차례인지 보려면 {0}."
],
[
"{0} more shots needed",
"{0}구 더 필요"
],
[
"Strike {0}%",
"스트라이크 {0}%"
],
[
"1st ball {0}",
"1구 {0}"
],
[
"Split {0}%",
"스플릿 {0}%"
],
[
"Across {0} games.",
"{0}게임 기준."
],
[
"Tracked in 5-pin steps{0}.",
"5핀 단위로 추적해요{0}."
],
[
"({0}% to {1})",
"({0}% 달성, 목표 {1})"
],
[
"Next Session ({0} Games)",
"다음 회차({0}게임)"
],
[
"You're averaging {0} across {1} games. Here's what the next set does to it.",
"{1}게임 기준 현재 에버리지는 {0}(이)에요. 다음 시리즈 결과에 따라 아래처럼 달라져요."
],
[
"To reach {0}",
"{0}(으)로 올리려면"
],
[
"Drops to {0} at or below",
"이 합계 이하면 {0}(으)로 하락"
],
[
"under {0}/game",
"게임당 {0} 미만"
],
[
"Across {0} {1}, ranging {2}–{3}.",
"{0}{1} 기준, 범위 {2}–{3}."
],
[
"Composite average at each position in the night, across the whole season — shows whether {0} bowling better early, middle, or late.{1}",
"시즌 전체에서, 그날 몇 번째 게임인지에 따른 종합 에버리지예요. {0}(이)가 초반, 중반, 후반 중 언제 더 잘 치는지 보여 줘요. {1}"
],
[
"Game {0}",
"{0}게임"
],
[
"Team: {0}",
"팀: {0}"
],
[
"${0} paid in — {1} {2} overall.",
"참가비 ${0} — 총 잔액 {2} {1}."
],
[
"{0} win{1:s} and {2} jackpot{3:s}.",
"팟 획득 {0}번, 잭팟 {2}번."
],
[
"{0} games",
"{0}게임"
],
[
"High {0}",
"하이 게임 {0}"
],
[
"Unhide Stat Cards ({0})",
"숨긴 통계 카드 표시 ({0})"
],
[
"{0}{1}Manage or cancel any time in the Play Store app, under Subscriptions.",
"{0}{1}Play 스토어 앱의 ‘정기 결제’에서 언제든지 관리하거나 해지할 수 있어요."
],
[
"Your {0}-day free trial has started, and everything is unlocked.",
"{0}일 무료 체험이 시작됐어요. 모든 기능을 이용할 수 있어요."
],
[
"You cancelled, so this ends{0}. Everything stays unlocked until then, and you can start it again any time before it ends.",
"구독을 해지해서 {0} 종료돼요. 그때까지는 모든 기능을 계속 이용할 수 있고, 종료 전이라면 언제든지 다시 시작할 수 있어요."
],
[
"(free keeps {0})",
"(무료는 리그 {0}개까지)"
],
[
"Yearly · {0}",
"연간 · {0}"
],
[
"Monthly · {0}",
"월간 · {0}"
],
[
"Start your {0}-day free trial",
"{0}일 무료 체험 시작하기"
],
[
"Subscribe · {0}/{1}",
"구독하기 · {0}/{1}"
],
[
"{0}{1}Cancel any time{2}{3}— you keep Pro until the end of the period you have paid for.",
"{0}{1}해지는 언제든지{2}{3}— 결제한 기간이 끝날 때까지 Pro를 계속 이용할 수 있어요."
],
[
"Hint: {0}",
"힌트: {0}"
],
[
"Details: {0}",
"세부 정보: {0}"
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
"{1}에서 지금 {0} 소속이에요. {2}에 가입하면 {3} 팀원 명단에서 빠져요. 내 점수 기록은 그대로 남아요."
],
[
"You're on {0}{1}.{2}",
"{0}{1}에 가입했어요.{2}"
],
[
"You're off {0}.",
"{0}에서 빠졌어요."
],
[
"You're on {0} in this league. If {1} approves you, you'll be taken off {2}'s roster. Your scores stay yours.",
"이 리그에서 지금 {0} 소속이에요. {1}에서 승인하면 {2} 팀원 명단에서 빠져요. 내 점수 기록은 그대로 남아요."
],
[
"Delete \"{0}\"? This removes the team and its roster, but does not delete any bowler accounts.",
"‘{0}’ 팀을 삭제할까요? 팀과 팀원 명단이 삭제되지만 볼러 계정은 삭제되지 않아요."
],
[
"{0}approving moves them off {1}",
"{0}승인하면 그 볼러는 {1}에서 빠져요"
],
[
"You're invited to {0}",
"{0}에서 초대가 왔어요"
],
[
"Asked to join {0} — waiting for someone on the team to approve.",
"{0}에 가입을 요청했어요 — 팀원의 승인을 기다리는 중이에요."
],
[
"Join our team on {0} — sign up and enter code {1}",
"{0}에서 우리 팀에 가입해 주세요 — 앱에 가입한 뒤 코드 {1}(을)를 입력하면 돼요"
],
[
"{0} — invited, waiting for them to accept",
"{0} — 초대함, 수락 대기 중"
],
[
"{0}/{1} cuts",
"{0}/{1} 컷 통과"
],
[
"{0} Your history: {1} avg over {2} game{3:s}{4}",
"{0} 내 기록: {2}게임 에버리지 {1}{4}"
],
[
"+ Save \"{0}\" for next time",
"+ ‘{0}’ 다음에도 쓸 수 있게 저장"
],
[
"Day {0}",
"{0}일차"
],
[
"Go to scoring{0} {1}",
"점수 입력으로 이동{0} {1}"
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
"{3}게임 합계 {0} / 컷 기준 {1}{5}."
],
[
"Go to {0} {1}",
"{0}(으)로 이동 {1}"
],
[
"This block{0}s frames are logged under {1}, not {2}.",
"이 블록의 프레임이 {2} 날짜가 아닌 {1} 날짜로 기록되어 있어요."
],
[
"Move them to {0}",
"{0}(으)로 옮기기"
],
[
"Remove game {0}",
"{0}번째 게임 삭제"
],
[
"With hcp ({0}g)",
"핸디 포함 ({0}게임)"
],
[
"Total ({0}g)",
"합계 ({0}게임)"
],
[
"{0} Brackets & Side Pots",
"{0} 브래킷 및 사이드 팟"
],
[
"${0} paid in — {1} ${2} on side action.",
"참가비 ${0} — 브래킷·사이드 팟 잔액 ${2} {1}."
],
[
"{0} Match Play",
"{0} 매치 플레이"
],
[
"Match {0}{1}{2}",
"{0}경기{1}{2}"
],
[
"by {0}",
"{0}핀 차"
],
[
"Go to the stepladder {0}",
"스텝래더로 이동 {0}"
],
[
"{0} Stepladder",
"{0} 스텝래더"
],
[
"Step {0}{1}{2}",
"스텝 {0}{1}{2}"
],
[
"Squad {0}",
"{0}조"
],
[
"Block {0}",
"{0}블록"
],
[
"{0} average over {1} game{2:s}{3}{4}",
"{1}게임 에버리지 {0}{3}{4}"
],
[
"· on to {0}",
"· 다음 단계: {0}"
],
[
"Match {0}{1}",
"{0}경기{1}"
],
[
"{0} average over {1} match{2:s}{3}{4}",
"{1}경기 에버리지 {0}{3}{4}"
],
[
"· {0} scratch",
"· 스크래치 {0}"
],
[
"Best: match {0} by {1}{2}",
"최대 승리: {0}경기{2} ({1}핀 차)"
],
[
"Worst: match {0} by {1}{2}",
"최대 패배: {0}경기{2} ({1}핀 차)"
],
[
"On to {0}.",
"다음 단계: {0}."
],
[
"Seeded {0}.",
"{0} 시드."
],
[
"You bowl frames {0}{1}. The score stays out of your average since you did not bowl it alone, but your own frames still count.",
"내 담당 프레임: {0}{1}. 혼자 투구한 게임이 아니라서 점수는 에버리지에 반영되지 않지만, 내가 투구한 프레임은 집계돼요."
],
[
"The stepladder says {0} — {1}",
"스텝래더 결과: {0} — {1}"
],
[
"{0}${1} net",
"순손익 {0}${1}"
],
[
"({0} game{1:s})",
"({0}게임)"
],
[
"{0} scratch · {1} handicap pins",
"스크래치 {0} · 핸디캡 {1}핀"
],
[
"0.5px solid {0}",
""
],
[
"Go to match play {0}",
"매치 플레이로 이동 {0}"
],
[
"I{0}m bowling",
"볼러 모드"
],
[
"I{0}m coaching",
"코치 모드"
],
[
"{0} Sam Ortiz",
"{0} Sam Ortiz"
],
[
"How much data it{0}s built on, beside it",
"기준이 된 데이터 양도 바로 옆에 표시돼요"
],
[
"Leave the target off if it isn{0}t a number",
"목표가 숫자가 아니면 비워 두세요"
],
[
"Target 60% {0} due 1 Apr",
"목표 60% {0} 기한 4월 1일"
],
[
"{0} games{1} ·{2}averaging {3} · high {4}, low {5}. The spread is {6} pins — that's what a nightly average hides.",
"{0}게임{1} ·{2}에버리지 {3} · 최고 {4}, 최저 {5}. 점수 편차는 {6}핀이에요 — 하루 에버리지만 봐서는 알 수 없는 부분이에요."
],
[
"Last {0}",
"최근 {0}게임"
],
[
"Last {0} days",
"최근 {0}일"
],
[
"Nights here average {0} attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.",
"여기 표시된 날의 시도 횟수가 평균 {0}번으로 적은 편이에요 — 경기력에 아무 변화가 없어도 개별 점이 크게 오르내릴 수 있어요."
],
[
"Free trial — {0} {1} left",
"무료 체험 — {0}일 남음"
],
[
"Your subscription starts {0}.",
"구독은 {0}에 시작돼요."
],
[
"You are on the monthly plan. The yearly plan is {0} and works out cheaper — switch any time.",
"지금은 월간 플랜을 이용 중이에요. 연간 플랜은 {0}(으)로 더 저렴해요 — 언제든 변경할 수 있어요."
],
[
"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Crect width='34' height='34' rx='9' fill='{0}' fill-opacity='0.13'/%3E%3Cpath d='M11 14l6 6 6-6' fill='none' stroke='{1}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
""
],
[
"Pin {0}",
"{0}번 핀"
],
[
"{0} was {1} by AI. It can be confidently wrong — {2}.",
"{0}(은)는 AI가 만든 거예요. 그럴듯하게 틀릴 수도 있어요 — {2}."
],
[
"⟨0⟩ wants to be your {0}.",
"⟨0⟩ 님이 {0}(으)로 연결을 요청했어요."
],
[
"Avg {0} ⟨0⟩ · {1}g",
"에버 {0} ⟨0⟩ · {1}게임"
],
[
"${0} won⟨0⟩${1} in",
"획득 상금 ${0}⟨0⟩참가비 ${1}"
],
[
"Suggested new book average: ⟨0⟩ — {0}.{1} Change the number below if this doesn't match your full season.",
"추천하는 새 공인 에버리지: ⟨0⟩ — {0}.{1} 시즌 전체 기록과 맞지 않으면 아래 숫자를 바꿔 주세요."
],
[
"{0} avg ⟨0⟩",
"에버 {0} ⟨0⟩"
],
[
"You — {0}/{1} ⟨0⟩",
"나 — {0}/{1} ⟨0⟩"
],
[
"{0} — {1}{2} attempts ⟨0⟩",
"{0} — {1}{2}회 시도 ⟨0⟩"
],
[
"{0} — {1}, {2} attempts ⟨0⟩",
"{0} — {1}, {2}회 시도 ⟨0⟩"
],
[
"We sent a {0}-digit code to ⟨0⟩.",
"{0}자리 코드를 다음 주소로 보냈어요: ⟨0⟩."
],
[
"⟨0⟩ wants to join {0}",
"⟨0⟩ 님이 {0}에 가입을 요청했어요"
],
[
"Cost ${0} · ⟨0⟩",
"비용 ${0} · ⟨0⟩"
],
[
"{0}% strikes",
"스트라이크 {0}%"
],
[
"{0} described",
"{0}개 기록됨"
],
[
"The analysis service didn't respond properly ({0}). This is usually temporary — tap Try Again.",
"분석 서비스가 제대로 응답하지 않았어요({0}). 보통 일시적인 문제예요 — ‘다시 시도’를 탭하세요."
],
[
"The lamp went quiet. Try again in a moment. (ref {0})",
"램프가 조용해졌어요. 잠시 후 다시 시도해 주세요. (참조 {0})"
],
[
"Location search failed ({0}).",
"위치 검색에 실패했어요({0})."
],
[
"Unsupported image type: {0}",
"지원하지 않는 이미지 형식이에요: {0}"
],
[
"Couldn't pour the nightcap ({0}). Tap to try again.",
"Nightcap을 따르지 못했어요({0}). 탭해서 다시 시도해 주세요."
],
[
"{0} {1} left today",
"오늘 남은 질문 {0}개"
],
[
"{0} league{1:s}",
"리그 {0}개"
],
[
"{0} ball{1:s}",
"볼 {0}개"
],
[
"{0} bowler",
"{0}명"
],
[
"{0} bowlers",
"{0}명"
],
[
"{0} set",
"{0}곳 설정됨"
],
[
"{0} available",
"{0}개 이용 가능"
],
[
"{0} times",
"{0}회"
],
[
"{0} view",
"‘{0}’ 탭"
],
[
"{0}: playing",
"{0}: 참가"
],
[
"{0}: not playing",
"{0}: 불참"
],
[
"Frame {0}, {1}, running {2}",
"{0}프레임, {1}, 누적 {2}점"
],
[
"Frame {0}, not bowled",
"{0}프레임, 투구 전"
],
[
"Frame {0}, not bowled, running {1}",
"{0}프레임, 투구 전, 누적 {1}점"
],
[
"Frame {0}, {1}",
"{0}프레임, {1}"
],
[
"{0} pin{1:s} short",
"{0}핀 부족"
],
[
"best {0}",
"최고 {0}"
],
[
"{0} of {1}",
"{0}/{1}"
],
[
"— {0}, {1}",
"— {0}, {1}"
],
[
"{0} series",
"시리즈 {0}"
],
[
"{0}: {1} series",
"{0}: 시리즈 {1}"
],
[
"Delete {0}",
"{0} 삭제"
],
[
"nightcap:{0}|{1}|{2}|{3}{4}",
""
],
[
"{0} of {1} attempts",
"{1}번 중 {0}번"
],
[
"{0} of {1} attempt",
"{1}번 중 {0}번"
],
[
"{0} of {1} balls",
"볼 {1}개 중 {0}개"
],
[
"{0} of {1} nights",
"{1}회 중 {0}회"
],
[
"{0} of {1} games",
"{1}게임 중 {0}게임"
],
[
"{0}-{1} standing",
"남은 핀: {0}-{1}"
],
[
"{0} standing",
"남은 핀: {0}"
],
[
"▲ {0} more",
"▲ {0}개 더"
],
[
"▼ {0} more",
"▼ {0}개 더"
],
[
"{0} bag",
"가방 {0}개"
],
[
"{0} bags",
"가방 {0}개"
],
[
"{0} pin",
"{0}번 핀"
],
[
"e.g. {0}",
"예: {0}"
],
[
"{0}% converted",
"처리율 {0}%"
],
[
"Trending up about {0} pins across this stretch.",
"이 기간 동안 약 {0}핀 올랐어요."
],
[
"Trending down about {0} pins across this stretch.",
"이 기간 동안 약 {0}핀 떨어졌어요."
],
[
"Trending up about {0} points across this stretch.",
"이 기간 동안 약 {0}%p 올랐어요."
],
[
"Trending down about {0} points across this stretch.",
"이 기간 동안 약 {0}%p 떨어졌어요."
],
[
"Trending up about {0} across this stretch.",
"이 기간 동안 약 {0} 올랐어요."
],
[
"Trending down about {0} across this stretch.",
"이 기간 동안 약 {0} 떨어졌어요."
],
[
"${0} paid in — up ${1} on the night.",
"참가비 ${0} — 오늘 이익 ${1}."
],
[
"${0} paid in — down ${1} on the night.",
"참가비 ${0} — 오늘 손실 ${1}."
],
[
"${0} paid in — up {1} overall.",
"참가비 ${0} — 총 이익 {1}."
],
[
"${0} paid in — down {1} overall.",
"참가비 ${0} — 총 손실 {1}."
],
[
"${0} paid in — up ${1} on side action.",
"참가비 ${0} — 브래킷·사이드 팟에서 ${1} 이익."
],
[
"${0} paid in — down ${1} on side action.",
"참가비 ${0} — 브래킷·사이드 팟에서 ${1} 손실."
],
[
"Hide {0}",
"‘{0}’ 숨기기"
],
[
"10-Pin {0}%",
"10번 핀 {0}%"
],
[
"{0}% {1} pin",
"{1}번 핀 남음 {0}%"
],
[
"{0} (me)",
"{0} (나)"
],
[
"{0} ({1}g)",
"{0} ({1}게임)"
],
[
"Left: {0}",
"왼쪽: {0}"
],
[
"Right: {0}",
"오른쪽: {0}"
],
[
"Fast: {0}",
"빠름: {0}"
],
[
"Slow: {0}",
"느림: {0}"
],
[
"Execution: {0}",
"투구 정확도: {0}"
],
[
"Earned · {0}",
"획득 · {0}"
],
[
"Open results for {0} night, {1}",
"{1} 결과 열기"
],
[
"Game {0} ball",
"{0}게임 볼"
],
[
"{0} max",
"최대 {0}"
],
[
"Your {0}-day free trial starts today. When it ends, the {1} plan starts at {2} and renews on its own until you cancel.",
"{0}일 무료 체험이 오늘 시작돼요. 체험이 끝나면 {1} 플랜이 {2} 요금으로 시작되고, 해지할 때까지 자동으로 갱신돼요."
],
[
"The {0} plan is {1}. Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.",
"{0} 플랜은 {1}(이)에요. 내 계정에 무료 체험이 적용되는지는 결제를 확정하기 전에 Google Play에서 보여 주며, 이후 해지할 때까지 자동으로 갱신돼요."
],
[
"The {0} plan is {1}.",
"{0} 플랜은 {1}(이)에요."
],
[
"You have already had the free trial, so the {0} plan starts today at {1} and renews on its own until you cancel.",
"이미 무료 체험을 이용했기 때문에 {0} 플랜은 오늘부터 {1} 요금으로 시작되고, 해지할 때까지 자동으로 갱신돼요."
],
[
"Ask {0}",
"{0}에게 질문하기"
],
[
"You've used all {0} questions today. Ask again tomorrow.",
"오늘 질문 {0}개를 모두 사용했어요. 내일 다시 물어봐 주세요."
],
[
"Ask {0} a question",
"{0}에게 질문하기"
],
[
"Brooklyn couldn't answer that. Try again in a moment. (ref {0})",
"Brooklyn이 답변하지 못했어요. 잠시 후 다시 시도해 주세요. (참조 {0})"
],
[
"Coach · {0}",
"코치 · {0}"
],
[
"{0} strips for {1} games",
""
],
[
"▸ Check frames · {0} flagged",
"▸ 프레임 확인 · 확인 필요 {0}개"
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
"이 로그인 링크는 지금 로그인한 계정이 아니라 {0} 계정용이에요. 계정을 바꾸려던 거라면 먼저 로그아웃하세요."
],
[
"Sign in as {0}?",
"{0} 계정으로 로그인할까요?"
],
[
"{0} (pending)",
"{0} (승인 대기)"
],
[
"rotate(-90 10 {0})",
"rotate(-90 10 {0})"
],
[
"{0}: no cover or core entered yet, so {1} be placed.",
"{0}: 아직 커버스톡이나 코어를 입력하지 않아서 차트에 표시할 수 없어요."
],
[
"A big step down from {0} to {1}: a condition between them has no ball.",
"{0}에서 {1}(으)로 강도가 크게 떨어져요. 그 사이 컨디션에 맞는 볼이 없어요."
],
[
"{0} and {1} sit almost on top of each other. They do the same job.",
"{0}(과)와 {1}(은)는 위치가 거의 겹쳐요. 같은 역할을 하는 볼이에요."
],
[
"{0} A wider range means the bag covers more conditions.",
"{0} 범위가 넓을수록 그 가방이 더 다양한 컨디션에 대응해요."
],
[
"In both bags: {0}.",
"두 가방에 모두 있는 볼: {0}."
],
[
"In {0}",
"{0}에 담긴 볼"
],
[
"From the catalog: {0}",
"카탈로그에서: {0}"
],
[
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.{0}",
"Caddie가 가방 전체를 살펴봐요 — 어떤 컨디션에 어떤 볼을 쓸지, 어떤 가방이 잘 구성됐는지, 무엇을 추가하고 무엇을 집에 두고 올지. 유료 플랜 기능이에요.{0}"
],
[
"Reads {0}: what it's built for and what it's missing.",
"{0}(을)를 살펴봐요: 어떤 상황에 맞는 가방인지, 무엇이 부족한지."
],
[
"{0} games · {1} avg{2}{3}{4}",
"{0}게임 · 에버리지 {1}{2}{3}{4}"
],
[
"· best {0}",
"· {0}에 최고"
],
[
"· {0}% strikes",
"· 스트라이크 {0}%"
],
[
"Surface: {0}{1}{2}Layout: {3}",
"표면: {0}{1}{2}레이아웃: {3}"
],
[
"Strength {0} · Length {1} · Back end {2}⟨0⟩",
"강도 {0} · 길이 {1} · 백엔드 {2}⟨0⟩"
],
[
"{0} games at {1}{2}.{3}",
"{0}게임에서 에버리지 {1}{2}.{3}"
],
[
", against your {0} overall",
", 전체 에버리지는 {0}"
],
[
"By part of the night: {0}.",
"구간별: {0}."
],
[
"All {0} of your leagues",
"내 리그 {0}개 모두"
],
[
"Basic keeps {0} league active. The others are paused — nothing is deleted, and they come back when you do.",
"Basic에서는 리그 {0}개만 활성 상태로 유지돼요. 나머지는 일시 중지돼요 — 삭제되는 건 없고, 다시 돌아오면 그대로 복구돼요."
],
[
"All {0} of your teams",
"내 팀 {0}개 모두"
],
[
"Basic keeps {0}.",
"Basic에서는 팀 {0}개만 유지돼요."
],
[
"Which of your {0} balls carries best, and how each one holds up from the first game to the last.",
"볼 {0}개 중 어떤 볼이 캐리가 가장 좋은지, 그리고 각 볼이 첫 게임부터 마지막 게임까지 얼마나 버티는지."
],
[
"Your read-back after every night — you've poured {0}.",
"경기가 끝날 때마다 받는 하루 되짚기 — 지금까지 {0}잔 따랐어요."
],
[
"Answers about your own game — you've asked {0} question{1:s}.",
"내 플레이에 대한 답변 — 지금까지 {0}번 질문했어요."
],
[
"The deep read of your game — you've run it {0} time{1:s}.",
"내 플레이 심층 분석 — 지금까지 {0}번 실행했어요."
],
[
"Your arsenal and bags, read ball by ball — {0} read{1:s} so far.",
"보유 볼과 가방을 볼 하나하나 분석 — 지금까지 {0}번."
],
[
"All {0} of your bags",
"내 가방 {0}개 모두"
],
[
"Basic keeps {0} league bag and {1} tournament bag.",
"Basic에서는 리그 가방 {0}개와 대회 가방 {1}개만 유지돼요."
],
[
"How you score at each of the {0} centers you've bowled.",
"지금까지 쳐 본 볼링장 {0}곳에서 각각 점수가 어떤지."
],
[
"for {0}/month",
"월 {0}에"
],
[
"You've logged {0} games with your {1}!",
"{1}(으)로 {0}게임을 기록했어요!"
],
[
"To keep seeing how it stacks up against the rest of your bag — which ball carries, and when — keep Pro{0}.",
"이 볼이 가방 속 다른 볼과 비교해 어떤지 — 어떤 볼이 언제 캐리가 좋은지 — 계속 확인하려면 Pro를{0} 계속 이용하세요."
],
[
"You've poured {0} Nightcaps!",
"Nightcap을 벌써 {0}잔 따랐어요!"
],
[
"To keep getting one after every night, keep Pro{0}.",
"경기가 끝날 때마다 계속 받아 보려면 Pro를{0} 계속 이용하세요."
],
[
"You're tracking {0} leagues!",
"리그 {0}개를 기록하고 있어요!"
],
[
"To keep all of them active, keep Pro{0}.",
"모든 리그를 계속 활성 상태로 두려면 Pro를{0} 계속 이용하세요."
],
[
"You've logged {0} games in your first 60 days!",
"처음 60일 동안 {0}게임을 기록했어요!"
],
[
"To keep the comparisons and the AI reads of your game, keep Pro{0}.",
"비교 기능과 AI 플레이 분석을 계속 쓰려면 Pro를{0} 계속 이용하세요."
],
[
"Keep everything unlocked{0}, or carry on with Basic — your scores and stats stay free.",
"모든 기능을{0} 그대로 쓰거나, Basic으로 이어 가세요 — 점수와 통계는 계속 무료예요."
],
[
"Your Pro trial ends in {0} day{1:s}",
"Pro 무료 체험이 {0}일 후에 끝나요"
],
[
"Keep Pro · {0}/month",
"Pro 계속 이용하기 · {0}/월"
],
[
"Or {0}/year",
"또는 {0}/년"
],
[
"Pro trial — {0} day{1:s} left. No card on file; nothing is charged when it ends.",
"Pro 무료 체험 — {0}일 남았어요. 등록된 카드가 없어서 체험이 끝나도 요금이 청구되지 않아요."
],
[
"Thanks for subscribing. Everything is unlocked.{0}Manage or cancel any time in the Play Store app, under Subscriptions.",
"구독해 주셔서 감사해요. 모든 기능을 이용할 수 있어요.{0}Play 스토어 앱의 ‘정기 결제’에서 언제든지 관리하거나 해지할 수 있어요."
],
[
"You have Pro free for {0} more day{1:s}. Subscribing now starts billing today; you can also wait, and we'll ask when your trial ends.",
"Pro 무료 이용 기간이 {0}일 남았어요. 지금 구독하면 오늘부터 결제가 시작돼요. 기다려도 괜찮아요. 무료 체험이 끝날 때 다시 여쭤볼게요."
],
[
"⟨0⟩ {0} · {1} shots",
"⟨0⟩ {0} · {1}구"
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
"구독을 해지해서 {0}에 종료돼요. 그때까지는 모든 기능을 계속 이용할 수 있고, 종료 전이라면 언제든지 다시 시작할 수 있어요."
],
[
"Finished {0}.",
"{0}(으)로 마무리했어요."
],
[
"Finished {0} to the {1} seed.",
"{1} 시드에게 져서 {0}(으)로 마무리했어요."
],
[
"Finished {0} to {1}.",
"{1}에게 져서 {0}(으)로 마무리했어요."
],
[
"{0} step{1:s} won, still climbing.",
"{0}스텝 승리, 계속 올라가는 중이에요."
],
[
"{0} board{1:s} left of target",
"타깃에서 왼쪽으로 {0}보드 벗어남"
],
[
"{0} board{1:s} right of target",
"타깃에서 오른쪽으로 {0}보드 벗어남"
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.",
"{0}(이)가 배지 {1}{2}개를 획득했어요 — {4}."
],
[
"{0} earned a badge tonight — {1}.",
"{0}(이)가 오늘 배지를 획득했어요 — {1}."
],
[
"{0} earned {1} badges tonight — {2}.",
"{0}(이)가 오늘 배지 {1}개를 획득했어요 — {2}."
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.\n\nKeep them: {5}",
"{0}(이)가 배지 {1}{2}개를 획득했어요 — {4}.\n\n배지를 간직하려면: {5}"
],
[
"{0} earned a badge tonight — {1}.\n\nKeep them: {2}",
"{0}(이)가 오늘 배지를 획득했어요 — {1}.\n\n배지를 간직하려면: {2}"
],
[
"{0} earned {1} badges tonight — {2}.\n\nKeep them: {3}",
"{0}(이)가 오늘 배지 {1}개를 획득했어요 — {2}.\n\n배지를 간직하려면: {3}"
],
[
"{0}-{1} over {2} match{3:s} · {4} with bonus",
"{2}경기 {0}-{1} · 보너스 포함 {4}"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} with bonus",
"{3}경기 {0}-{1}-{2} · 보너스 포함 {5}"
],
[
"{0}-{1} over {2} match{3:s} · {4} average · {5} with bonus",
"{2}경기 {0}-{1} · 에버리지 {4} · 보너스 포함 {5}"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} average · {6} with bonus",
"{3}경기 {0}-{1}-{2} · 에버리지 {5} · 보너스 포함 {6}"
],
[
"{0} seed · {1} of {2} step{3:s} won · finished {4}",
"{0} 시드 · {2}스텝 중 {1}승 · 최종 {4}"
],
[
"{0} seed · {1} of {2} step{3:s} won",
"{0} 시드 · {2}스텝 중 {1}승"
],
[
"{0} of {1} step{2:s} won · finished {3}",
"{1}스텝 중 {0}승 · 최종 {3}"
],
[
"Your average is up {0} pin{1:s} on last season — {2}.",
"에버리지가 지난 시즌보다 {0}핀 올랐어요 — {2}."
],
[
"Your average is down {0} pin{1:s} on last season — {2}.",
"에버리지가 지난 시즌보다 {0}핀 떨어졌어요 — {2}."
],
[
"{0} bowled {1} for {2} at {3} on {4}: {5}.",
"{0}(이)가 {4} {3}에서 {2}게임 합계 {1}점을 쳤어요: {5}."
],
[
"{0} bowled {1} for {2} at {3}: {4}.",
"{0}(이)가 {3}에서 {2}게임 합계 {1}점을 쳤어요: {4}."
],
[
"{0} bowled {1} for {2} on {3}: {4}.",
"{0}(이)가 {3}에 {2}게임 합계 {1}점을 쳤어요: {4}."
],
[
"{0} bowled {1} for {2}: {3}.",
"{0}(이)가 {2}게임 합계 {1}점을 쳤어요: {3}."
],
[
"{0} bowled a {1} at {2} on {3}.",
"{0}(이)가 {3} {2}에서 {1}점을 쳤어요."
],
[
"{0} bowled a {1} at {2}.",
"{0}(이)가 {2}에서 {1}점을 쳤어요."
],
[
"{0} bowled a {1} on {2}.",
"{0}(이)가 {2}에 {1}점을 쳤어요."
],
[
"{0} bowled a {1}.",
"{0}(이)가 {1}점을 쳤어요."
],
[
"Bowled {0} for {1} at {2} on {3}: {4}.",
"{3} {2}에서 {1}게임 합계 {0}점을 쳤어요: {4}."
],
[
"Bowled {0} for {1} at {2}: {3}.",
"{2}에서 {1}게임 합계 {0}점을 쳤어요: {3}."
],
[
"Bowled {0} for {1} on {2}: {3}.",
"{2}에 {1}게임 합계 {0}점을 쳤어요: {3}."
],
[
"Bowled {0} for {1}: {2}.",
"{1}게임 합계 {0}점을 쳤어요: {2}."
],
[
"Bowled a {0} at {1} on {2}.",
"{2} {1}에서 {0}점을 쳤어요."
],
[
"Bowled a {0} at {1}.",
"{1}에서 {0}점을 쳤어요."
],
[
"Bowled a {0} on {1}.",
"{1}에 {0}점을 쳤어요."
],
[
"Bowled a {0}.",
"{0}점을 쳤어요."
],
[
"{0} bowled at {1} on {2}.",
"{0}(이)가 {2} {1}에서 볼링을 쳤어요."
],
[
"{0} bowled at {1}.",
"{0}(이)가 {1}에서 볼링을 쳤어요."
],
[
"{0} bowled on {1}.",
"{0}(이)가 {1}에 볼링을 쳤어요."
],
[
"{0} bowled.",
"{0}(이)가 볼링을 쳤어요."
],
[
"Bowled at {0} on {1}.",
"{1} {0}에서 볼링을 쳤어요."
],
[
"Bowled at {0}.",
"{0}에서 볼링을 쳤어요."
],
[
"Bowled on {0}.",
"{0}에 볼링을 쳤어요."
],
[
"{0} games in {1} · averaging {2} · high {3}, low {4}. The spread is {5} pins — that's what a nightly average hides.",
"{1}에서 {0}게임 · 에버리지 {2} · 최고 {3}, 최저 {4}. 점수 편차는 {5}핀이에요 — 하루 에버리지만 봐서는 알 수 없는 부분이에요."
],
[
"Combine your \"{0}\" with the shared one at {1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"‘{0}’ 리그를 {1}의 공유 리그와 합칠까요? 내 게임, 팀, 리그 설정이 공유 리그로 옮겨지고, 이미 있는 팀도 보이게 돼요. 이 작업은 되돌릴 수 없어요."
],
[
"{0}st to {1}",
"{1}에게 져서 {0}위"
],
[
"{0}nd to {1}",
"{1}에게 져서 {0}위"
],
[
"{0}rd to {1}",
"{1}에게 져서 {0}위"
],
[
"{0}th to {1}",
"{1}에게 져서 {0}위"
],
[
"Seeded {0}. {1}",
"{0} 시드. {1}"
],
[
"Stepladder: {0} from the {1} seed",
"스텝래더: {0} ({1} 시드에서 출발)"
],
[
"Stepladder: {0}",
"스텝래더: {0}"
],
[
"Match play: {0}, {1} with bonus",
"매치 플레이: {0}, 보너스 포함 {1}"
],
[
"{0} wants to be your coach",
"{0} 님이 코치로 연결을 요청했어요"
],
[
"{0} wants to be your bowler",
"{0} 님이 볼러로 연결을 요청했어요"
],
[
"{0}. {1}{2} — {3} avg, {4} games",
""
],
[
"{0}. {1} — {2} avg, {3} games",
"{0}. {1} — 에버리지 {2}, {3}게임"
],
[
"{0} pins first to last",
"1위~꼴찌 {0}핀 차"
],
[
"{0} more nights",
"{0}회 더"
],
[
"{0} more games",
"{0}게임 더"
],
[
"{0} more first balls",
"첫 투구 {0}번 더"
],
[
"{0} more spare attempts",
"스페어 기회 {0}번 더"
],
[
"{0} more attempts",
"{0}번 더 시도"
],
[
"A bowler wants to join {0}",
"어떤 볼러가 {0}에 가입을 요청했어요"
],
[
"The {0} plan starts today at {1} and renews on its own until you cancel.",
"{0} 플랜이 오늘 시작되며 요금은 {1}(이)에요. 해지할 때까지 자동으로 갱신돼요."
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
