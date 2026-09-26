# Ten-pin bowling glossary: English to Korean (ko-KR)

Korean bowlers use English loanwords written in Hangul for almost every bowling term (스트라이크, 스페어, 스플릿, 거터, 포켓, 브루클린, 캐리), plus a few native or Sino-Korean terms of their own: 스페어 처리 (converting a spare), 지공 (drilling), 회전수 (rev rate), 구속 (ball speed), 남은 핀 (leave), 볼링장 (bowling center). The full term table is in `style-ko.md`. This file records the sources and the choices that were not obvious.

## Sources

- [나무위키: 볼링](https://namu.wiki/w/%EB%B3%BC%EB%A7%81) is the source for:
  - 거터, 파울 ("전광판에는 F로 표기"), 오픈, 클린 게임, 스페어 처리, 남은 핀.
  - 오일 패턴, 레인 상태, 구속, 회전수 / RPM.
  - 원핸드 / 투핸드, 스트로커, 크랭커, 트위너, 브루클린 스트라이크.
- [EIGHTBOX: 알아두면 좋은 볼링 용어](https://blog.eightbox.net/297) is the source for 더블, 터키, 퍼펙트 게임, 포켓, 브루클린, 세븐텐, 빅포, 버킷, 스플릿, 릴리스, 스팬.
- [(사)한국프로볼링협회 에버리지 랭킹](http://koreapba.com/weel_bbs/board.php?bo_table=his_everlank) and [BowlingManager 가이드](https://www.bowlingmanager.co.kr/guide/average-improvement-tips) use **에버리지** for average.
- [언발란스볼링매니아: 지공시에 주의할 점](https://m.cafe.daum.net/unbalance1/oJ/8?listURI=/unbalance1/oJ) uses **지공** for drilling.

## Decisions

| Term | Chosen | Why |
|---|---|---|
| average | **에버리지** (short: 에버) | What the Korea PBA and Korean bowlers write. The dictionary spelling 애버리지 appears too but is less common in bowling. |
| leave | **남은 핀** | Plain and understood by everyone; 잔핀 is club slang. |
| arrows | **스팟** | What Korean coaching calls the target arrows. |
| drilling | **지공** | The everyday Korean word; 드릴 is kept for practice drills (연습 드릴). |
| tournament | **대회** | The natural Korean word. 토너먼트 suggests a knockout bracket. |
| squad | **조** | Korean tournaments name their time slots 1조, 2조. |
| open bowling / casual | **자유 게임** | Plain wording for bowling outside a league or tournament. |
| Arsenal | **보유 볼** | 아스널 reads as the football club in Korea. |
| Inbox | **알림함** | The app's inbox holds notices and messages, not email. |
| assistant name | **Brooklyn** (Latin letters) | 브루클린 is the crossover hit, so keeping the name in Latin letters avoids the clash. |
| sentence style | **해요체** | The friendly polite style of Korean consumer apps. |

## Numbers and time

- Korea writes numbers as the English app does (198.4, 1,250, 54%), so they stay as they are. Won is written ₩7,900.
- The runtime (`koreanNumbers` in `engine.js`) only rewrites:
  - 12-hour times to "오후 7:30" / "오전 9:00".
  - English ordinals to places ("3위"), and seeds to "2번 시드".
- `koreanParticles` resolves the particle markers `(을)를`, `(이)가`, `(은)는`, `(과)와`, `(으)로`, `(이)에요`, `(이)야` written after inserted values (see `style-ko.md`).
