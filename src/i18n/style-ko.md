# Korean style guide: My Bowling Journey → Korean (ko-KR)

This is the interface of a ten-pin bowling statistics app for league, club and tournament bowlers in South Korea. No native speaker reviews it before release, so accuracy matters most: the same meaning as the English, natural Korean as Korean apps write it, the bowling words Korean bowlers actually use (almost all English loanwords in Hangul), and correct grammar, spacing and particles.

## Where translations live

`ko-KR.js` holds every entry, in the same shape as `fr-CA.js`:

- **Patterns:** texts built in code. `{0}`, `{1}`... are the values code inserts, and `{1:s}` on the English side marks an English plural ending.
- **Inline elements:** text with inline elements (bold, links) uses `⟨0⟩`, `⟨1⟩`... for each element, and they must stay **in the same order** in Korean. If Korean word order makes that impossible, rephrase until the order works; never swap the tokens.
- **Empty string:** means the text is not read by a person.

## Placeholders

- **Values that carry meaning:** keep every placeholder that carries a number, a name or a score. You may **reorder** them as Korean needs.
- **No plurals:** Korean does not mark them. **Drop** English plural endings (`{1:s}`, `game{1}`) and English words inserted by code for number agreement (`"is" : "are"`, `"team" : "teams"`), and write one form. Do not add 들 unless Korean really needs it. `{0|a|b}` is rarely needed; when two forms truly differ ("one" vs "several"), you may use `{0|하나|여러 개}`, where the first form means exactly 1.
- **Counters:** a number usually takes a counter, written right after it: 3게임, 5프레임, 핀 2개, 4명, 3번 / 3회, 10구 (deliveries), 2일.
- Never invent a placeholder index that is not in the English, and put nothing else in curly braces except the particle markers below.

## Particles after inserted values (important)

Korean particles change with the sound before them (을/를, 이/가, 은/는, 과/와, 으로/로, 이에요/예요, 이야/야). A translation cannot know how a name or number that code drops in will end, so **right after a placeholder or ⟨n⟩ token, write the particle as a marker**:

| Marker | Becomes |
|---|---|
| `(을)를` | 을 after a consonant, 를 after a vowel |
| `(이)가` | 이 / 가 |
| `(은)는` | 은 / 는 |
| `(과)와` | 과 / 와 |
| `(으)로` | 으로 / 로 (로 after ㄹ too) |
| `(이)에요` | 이에요 / 예요 |
| `(이)야` | 이야 / 야 |

Example: `{0} joined your team` → `{0}(이)가 팀에 합류했어요.` The runtime turns it into "민지가 팀에 합류했어요" or "라이언이 팀에 합류했어요". After a Latin name it cannot read ("Ryan"), the marker stays as written, which is the usual Korean way. Numbers are read correctly (3이, 2가, 10으로, 7로, 54%가).

After Korean words you write yourself, write the correct particle directly (볼링장으로, 스페어를), not a marker.

## Numbers, money, time

- **Numbers:** Korea writes them as English does, and so does the app: 198.4, 1,250, 54%, $4.99, ₩7,900.
  - Keep `$` and `₩` directly before their number or placeholder and `%` directly after, with no space.
  - Do not change digits.
- **What the runtime converts:**
  - "7:30 PM" becomes "오후 7:30".
  - An ordinal from code ("3rd") becomes "3위", a place. Word patterns so that a place reads well ("{0}(으)로 마무리" → "3위로 마무리"). Where an ordinal is not a place ("3rd game"), prefer "3번째 게임" / "3게임째" wording in the pattern around it.
  - "2nd seed" / "{0} 시드" becomes "2번 시드".

## Voice and style

- **해요체** for sentences: the friendly, polite style Korean consumer apps use (저장했어요, 삭제할까요?, 할 수 없어요). Not 합니다체 (too stiff) and never 반말.
- **Labels** (buttons, tabs, chips, headers) are short nouns or noun + 하기: 저장, 삭제, 공유, 취소, 닫기, 시작하기.
- **Do not use 당신.** Leave the subject implied, or use 내 (내 볼, 내 기록) where "my/your" is needed on a label.
- **Spacing (띄어쓰기):** follow standard Korean spacing. A number and its counter are written together (3게임, 198.4점).
- **Punctuation:** ASCII . , ! ? : as in English. Quoted UI labels use ‘…’ (e.g. ‘설정’에서). No space before punctuation.
- **Tone:** keep the English's tone, with a little dry humour in badge names. Do not add or remove information.
- **Length:** Korean is usually shorter than English. Keep buttons and tabs short anyway.
- Keep emoji, arrows, bullets (·, •, —, →) and line structure as in the English.

## Do not translate

- **Names:** My Bowling Journey (the app), Pro (the plan), **Brooklyn** (the in-app assistant's name, kept in Latin letters; 브루클린 is the crossover HIT), **Nightcap** (a feature name, kept in Latin letters), **Caddie** (feature name, kept in Latin letters).
- **Services, brands and patterns:** Google, Google Play, Stripe, Link, USBC, KBA, ball and manufacturer names (Storm, Hammer, Phaze II...), oil pattern names (Viper, Shark...).
- **Scoresheet marks and pins:** X, /, -, F stay as they are, and so do pin numbers and combinations (7-10, 2-4-5-8).
- **Units:** lb, ft, mL, RG, Diff and PAP stay as they are.

## App vocabulary (use exactly)

| English | Korean |
|---|---|
| Home (tab) | 홈 |
| Bowl (tab) | 투구 |
| Stats (tab) | 통계 |
| History (tab) | 기록 |
| Setup (tab) | 준비 |
| Improve (tab) | 실력 향상 (tab label: 향상) |
| Settings | 설정 |
| Inbox | 알림함 |
| Help | 도움말 |
| Insights (AI feature) | 분석 |
| Journey (milestones) | 여정 |
| Badges | 배지 |
| Friends / Social | 친구 |
| Team (tab) | 팀 |
| Gear (tab) | 장비 |
| Coach / Coaching | 코치 / 코칭 |
| your bowlers (coach's view) | 내 볼러 |
| Side Games | 사이드 게임 |
| Brackets | 브래킷 |
| Just Bowling / Open bowling / Casual | 자유 게임 |
| Practice | 연습 |
| League | 리그 |
| Tournament | 대회 |
| Scores only | 점수만 |
| Subscribe / subscription | 구독하기 / 구독 |
| Free trial | 무료 체험 |
| Sign in / sign out | 로그인 / 로그아웃 |
| Import (scorecard) | 가져오기 |
| Share | 공유 |
| Log / record | 기록하기 |
| Bag(s) | 가방 |
| Ball(s) | 볼 |
| Arsenal | 보유 볼 |
| Night / tonight (league or tournament) | 오늘 ("tonight" = 오늘, not 오늘 밤 — leagues are not always at night); session (practice) = 세션 |
| Delete my account | 계정 삭제 |
| teammate | 팀원 |
| Prebowling | 사전 투구 |

## Bowling terminology (see glossary-ko.md)

| English | Korean |
|---|---|
| bowling (the sport) | 볼링 |
| bowler | 볼러 |
| bowling center | 볼링장 |
| strike / spare / split | 스트라이크 / 스페어 / 스플릿 |
| convert a spare | 스페어 처리 |
| gutter | 거터 |
| frame / 10th frame | 프레임 / 10프레임 |
| open frame | 오픈 프레임 (short: 오픈) |
| clean frame | 클린 프레임 |
| game / series | 게임 / 시리즈 |
| score / scoresheet | 점수 / 점수표 |
| pinfall | 쓰러뜨린 핀 수 |
| mark | 마크 |
| double / turkey | 더블 / 터키 |
| perfect game / clean game (no open frames) | 퍼펙트 게임 / 클린 게임 |
| first ball / second ball | 첫 투구 / 두 번째 투구 (narrow labels: 1구 / 2구) |
| fill ball | 보너스 투구 |
| foul / foul line | 파울 / 파울 라인 |
| pin / headpin / pocket | 핀 / 헤드핀 / 포켓 |
| leave | 남은 핀 |
| single-pin spare | 싱글 핀 스페어 |
| corner pin / 10 pin | 코너 핀 / 10번 핀 |
| ringing 10 / weak 10 | 링잉 텐 / 위크 텐 |
| 7-10 split / big four / greek church / baby split / washout / bucket | 세븐텐 / 빅포 / 그릭 처치 / 베이비 스플릿 / 워시아웃 / 버킷 |
| messenger | 메신저 |
| light hit / high hit | 얇은 히트 / 두꺼운 히트 (short: 얇게 / 두껍게) |
| Brooklyn (crossover hit) | 브루클린 |
| carry | 캐리 |
| lane | 레인 |
| approach / arrows / dots / boards | 어프로치 / 스팟 / 도트 / 보드 |
| breakpoint | 브레이크 포인트 |
| oil pattern / lane condition | 오일 패턴 / 레인 컨디션 |
| house shot / sport shot | 하우스 패턴 / 스포츠 패턴 |
| transition / carrydown / breakdown | 트랜지션 / 캐리다운 / 브레이크다운 |
| ball / strike ball / spare ball | 볼 / 스트라이크 볼 / 스페어 볼 |
| coverstock / core | 커버스톡 / 코어 |
| RG / differential / layout / PAP | RG / 디퍼렌셜 / 레이아웃 / PAP |
| drilling / finger holes / thumb hole | 지공 / 핑거 홀 / 엄지 홀 |
| release / hook | 릴리스 / 훅 |
| rev rate / ball speed | 회전수 / 구속 |
| axis rotation / axis tilt | 액시스 로테이션 / 액시스 틸트 |
| one-handed / two-handed | 원핸드 / 투핸드 |
| right-handed / left-handed | 오른손 / 왼손 |
| stroker / cranker / tweener | 스트로커 / 크랭커 / 트위너 |
| league / team / roster | 리그 / 팀 / 팀원 명단 |
| sub | 대체 선수 |
| captain | 주장 |
| bowling order | 투구 순서 |
| handicap / scratch | 핸디캡 (short: 핸디) / 스크래치 |
| average / book average | 에버리지 (short: 에버) / 공인 에버리지 |
| high game / high series | 하이 게임 / 하이 시리즈 |
| standings / points | 순위표 / 포인트 |
| match play / head-to-head | 매치 플레이 / 맞대결 |
| position round | 포지션 라운드 |
| absent / blind / vacancy | 불참 / 블라인드 / 공석 |
| baker format | 베이커 방식 |
| league night / season | 리그 날 / 시즌 |
| tournament / qualifying / cut | 대회 / 예선 / 컷 (컷라인) |
| stepladder / squad / seed | 스텝래더 / 조 / 시드 |
| cashed | 상금권 입상 |
| bonus pins | 보너스 핀 |
| side pot / jackpot | 사이드 팟 / 잭팟 |
| buy-in / entry fee / winnings | 참가비 / 참가비 / 상금 |
| drill (exercise) | 연습 드릴 |
| score spread | 점수 편차 |

## Leave empty ("")

- **Text no one reads:** CSS values, keys, code identifiers, regexes, calendar rules, debug and log lines, and developer errors.
- **Instructions and data sent to the AI model.** But translate anything in those files that the bowler could see.
- **Help search keywords are NOT empty.** Give the Korean words a Korean bowler would type.
- **Same as Japanese:** where the Japanese entry is empty, the Korean entry is empty too.

## Fragments

A `fragment` is a piece of a sentence that React renders around other elements or values. Korean word order is very different from English, so:

- Translate each piece so the pieces, **read in the English order**, still make natural Korean. When "Delete ⟨0⟩?" is split into fragments, choose wording like "삭제: " + name + "?" rather than a sentence that needs the name in the middle.
- A particle may stand at the start of a fragment only as a marker right after the value (`(을)를 …`), so the runtime can fit it.
- Look at the source to see which pieces sit next to each other.
- Do not leave English.

## Context entries

A key like `theme::Light` is used where one English word needs a different Korean word on one screen. Translate for that context.

## Quality bar

Before writing your file, re-read every translation and check:

- The meaning is the same as the English.
- The Korean is natural, not translationese: 해요체, no 당신, correct spacing, particles and counters; markers after every inserted value that takes a particle.
- Glossary terms are used.
- Placeholders are intact.
- ⟨n⟩ tokens are in order.
- No English is left (except the names above).
