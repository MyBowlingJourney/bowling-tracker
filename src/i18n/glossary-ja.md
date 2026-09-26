# Ten-pin bowling glossary: English to Japanese (ja-JP)

Japanese bowlers use katakana loanwords for almost every bowling term, and a few native terms of their own: 1投目 / 2投目, 残りピン, 板目, 回転数, 球速, 薄め / 厚め, ノーミスゲーム. The full term table is in `style-ja.md`. This file records the sources and the choices that were not obvious.

## Sources

- [BowlingAgent: ボウリング用語集まとめ](https://bowling-agent.com/2026/04/23/2564/) is the source for:
  - Scoring: ストライク, スペア, ダブル, ターキー, パーフェクトゲーム, クリーンゲーム, オープンフレーム, フィルボール.
  - The lane: アプローチ, アロー, ボード, ドット, ファウルライン, ガター, ヘッドピン, ポケット, ブレイクポイント.
  - Oil: ハウスショット, ブレイクダウン, キャリーダウン.
  - The ball: コア, カバーストック, ディファレンシャル.
  - Splits and leaves: スプリット, セブンテン, ビッグフォー, グリークチャーチ, ベビースプリット, ウォッシュアウト, メッセンジャー.
  - Bowling style: ストローカー, クランカー, トゥイーナー, ツーハンダー, アクシスローテーション, アクシスティルト, キャリー, ブルックリン.
- [週末ボウラー奮闘日記: 用語集(1) スコア関連](https://bowling.handmade73.net/skill/1_syosinsya/word_1_score.php) is the source for ノーミスゲーム, マーク, アベレージ, シリーズ, ハイゲーム and ハイシリーズ.
- Further glossaries: [Sunbridge](https://www.sunbridge-group.com/glossary/), [埼玉県ボウリング場協会](http://www.bowl-saitama.com/vocabulary.php), [Park Lanes](https://www.parklanes.co.jp/web_lesson/k1.php).

## Decisions

| Term | Chosen | Why |
|---|---|---|
| clean game | **ノーミスゲーム** | This is the everyday Japanese term. クリーンゲーム is also listed but is less common. |
| arrows | **スパット** | This is what Japanese coaching says. アロー is understood too. |
| boards | **ボード (板目)** | Both are used. ボード is the label and 板目 is fine in running text. |
| house shot | **ハウスコンディション** | Japanese centers say this more often than ハウスショット. |
| tournament | **大会** | This is the natural Japanese word. トーナメント suggests a knockout bracket. |
| squad | **シフト** | Japanese tournaments call their time slots シフト. |
| open bowling / casual | **フリー投球** | This is what centers call it. |
| Stats tab | **成績** | Short and natural. スタッツ is also used but is more of an insider word. |
| Journey | **あゆみ** | A warm native word for looking back over a bowling history. |
| assistant name | **Brooklyn** (Latin letters) | ブルックリン is the crossover hit, so keeping the name in Latin letters avoids the clash. |

## Numbers and time

- Japan writes numbers as the English app does (198.4, 1,250, 54%), so they stay as they are.
- The runtime (`japaneseNumbers` in `engine.js`) only rewrites two things:
  - 12-hour times become 24-hour ("19:30").
  - English ordinals become places ("3位").
