# French style guide: My Bowling Journey → Quebec French (fr-CA)

You are translating the interface of a ten-pin bowling statistics app for league bowlers in Quebec. There will be **no native-speaker review**, so accuracy is everything: correct meaning, natural Quebec French, correct bowling terminology, correct grammar and agreement. Take your time. Being right matters more than being fast.

## Where translations live

`fr-CA.js` holds every entry (see its header). Texts built in code are patterns: `{0}`, `{1}`... are the values code inserts; `{1:s}` on the English side marks an English plural ending. Text with inline elements (bold, links) uses `⟨0⟩`, `⟨1⟩`... for each element, which must stay in the same order in French. An empty French string means the text is not read by a person.

## Placeholders `{0}`, `{1}`...

- Keep every placeholder that carries meaning (a number, a name, a score). You may **reorder** them as French needs.
- English plural endings built in code (e.g. `game{1}` where `{1}` is `n === 1 ? "" : "s"`) must be **dropped** in French; instead use the plural form syntax **`{0|singulier|pluriel}`**, where 0 is the index of the NUMBER placeholder. The runtime picks the first form when that number is 0 or 1 (French rule), the second otherwise. Example: `{0} game{1} logged` → `{0} {0|partie consignée|parties consignées}`.
- A placeholder whose value is an English word produced by code (e.g. `"team" : "teams"`, `"is" : "are"`) should likewise be dropped and replaced by French wording using the plural syntax on the relevant number, if one is available. If no number is available, pick wording that works for both.
- Never invent a placeholder index that is not in the English.
- Do not put anything else in curly braces.

## Numbers, money, percent

The runtime formats numbers the French way automatically ("$6.99" → "6,99 $", "54%" → "54 %", "198.4" → "198,4", "7:30 PM" → "19 h 30"). So:
- Keep `$` **directly before** its number or placeholder exactly as in the English (`${0}` stays `${0}`, `$5` stays `$5`). Do not move it.
- Keep `%` directly after its number or placeholder.
- Do not change digits or decimal points yourself.

## Voice and style

- **Vous**, always (OQLF guidance; standard for Quebec apps). Prefer imperatives and neutral labels.
- **Sentence case**, not Title Case: "Scores To Check" → "Pointages à vérifier". Proper names keep their capitals.
- Quebec French, not France French. Avoid anglicisms and France-only words (see glossary "Avoid").
- **Gender-neutral where possible**: the reader can be any gender. Prefer rephrasing ("Vous êtes dans l'équipe" rather than "Vous êtes inscrit"), epicene words (membre, personne, capitaine), or nouns instead of participles. Do not use the median dot (inscrit·e). When a noun for the bowler is needed, "quilleur ou quilleuse" is fine in running text; in tight labels use a neutral word ("Joueur" is acceptable as the traditional generic if nothing else fits).
- Typography (OQLF, Quebec): **no space before ? ! ;** — write "Prêt?" — and a space before ":" (the runtime makes it non-breaking). Quotes: « like this » with spaces inside. Use the apostrophe ’ or ' consistently (either is fine; prefer ').
- Keep the tone of the English: friendly, plain, direct, a little dry humour in badges. Do not add or remove information.
- **Length**: buttons, tabs, chips and table headers must stay short. If the English is 1–2 words on a button, keep the French compact (abbreviate only if unavoidable, e.g. "Moy." for average in a table header).
- Keep emoji, arrows, bullets (·, •, —, →) and line structure as in the English.

## Do not translate

- **My Bowling Journey** (app name), **Pro** (the plan), **Brooklyn** (the in-app assistant's name — but a "Brooklyn" HIT, the crossover into the wrong pocket, is "coup croisé"), **Nightcap** (a feature name: keep "Nightcap"; you may add a short French gloss only where a sentence explains what it is), **Google**, **Google Play**, **Stripe**, **Link**, **USBC**, brand names of balls/manufacturers (Storm, Hammer, Phaze II, etc.), oil pattern names (Viper, Shark...), **Insights**-style proper feature names are translated as below.
- Scoresheet marks X, /, -, F stay as they are. Pin numbers and pin combinations (7-10, 2-4-5-8) stay.
- Units: lb stays lb; ft → pi (pieds) is NOT used in bowling in Quebec — keep "ft" as "pi" only if clearly a unit label (e.g. "Length (ft)" → "Longueur (pi)"); mL stays mL; RG, Diff, PAP stay.

## App vocabulary (use exactly)

| English | French |
|---|---|
| Home (tab) | Accueil |
| Bowl (tab) | Jouer |
| Stats (tab) | Stats |
| History (tab) | Historique |
| Setup (tab) | Préparation |
| Settings | Paramètres |
| Inbox | Boîte de réception |
| Help | Aide |
| Improve | Progresser |
| Insights (AI feature) | Analyses |
| Journey (the milestones card/section) | Parcours |
| Badges | Badges |
| Friends | Amis |
| Coach (feature/tab) | Entraîneur (for the person, prefer "votre entraîneur" / "l'entraîneur"; "entraîneur ou entraîneuse" when it reads well) |
| Side Games | Cagnottes |
| Brackets | Tableaux (à élimination) |
| Just Bowling / Open bowling / Casual (mode) | Jeu libre |
| Practice (mode) | Entraînement |
| League (mode) | Ligue |
| Tournament (mode) | Tournoi |
| Subscribe / subscription | S'abonner / abonnement |
| Free trial | essai gratuit |
| Sign in / sign out | Se connecter / se déconnecter |
| Import (scorecard) | Importer |
| Share | Partager |
| Log / record (a game, shots) | enregistrer (preferred) / consigner |
| Bag(s) | sac(s) |
| Ball(s) | boule(s) |
| Arsenal | arsenal |
| Night / session (a league night) | soirée (league/tournament night), séance (practice) |
| Welcome screen | Accueil |
| Delete my account | Supprimer mon compte |

## Bowling terminology (verified — see glossary.md for sources)

| English | Quebec French |
|---|---|
| bowling (the sport) | les quilles / jeu de quilles (never "bowling" in UI text) |
| ten-pin | grosses quilles / dix-quilles |
| bowler | quilleur, quilleuse (neutral rephrasing preferred) |
| to bowl | jouer (aux quilles); lancer (a ball) |
| strike | abat (n.m.) |
| spare | réserve (n.f.) — ONLY the scoring spare; a substitute player is "remplaçant" |
| split | écart (n.m.) |
| gutter / gutter ball | dalot / boule dans le dalot |
| open frame | carreau ouvert |
| frame | carreau |
| game | partie |
| series (3 games) | triple (n.m.) |
| pinfall / total pins | quilles abattues / total des quilles abattues |
| score | pointage |
| scoresheet | feuille de pointage |
| mark (strike or spare) | abat ou réserve (or "carreau fermé" when a noun is required) |
| double | double |
| turkey | dindon (or "3 abats de suite") |
| perfect game | partie parfaite |
| clean game | partie sans carreau ouvert |
| first ball / second ball | premier lancer / deuxième lancer |
| fill ball | lancer supplémentaire |
| foul / foul line | faute / ligne de faute |
| pin / headpin / pocket | quille / quille de tête / poche |
| pin deck | aire des quilles |
| pinsetter; string / free-fall | planteuse; planteuse à ficelles / à chute libre |
| leave (pins left) | quilles restantes |
| single-pin spare | réserve d'une quille |
| corner pin | quille de coin |
| 10 pin, 7 pin | quille 10, quille 7 |
| ringing 10 / weak 10 | quille 10 isolée (frappe faible) — adapt to context |
| lone 5 | quille 5 isolée |
| washout / bucket | keep the pin numbers; you may write « washout » in quotes where the English uses the word |
| 7-10 split, baby split, big four, greek church | écart 7-10, petit écart, écart 4-6-7-10, écart 4-6-7-9-10 |
| messenger (a pin that crosses and takes out another) | quille messagère |
| light hit / high hit | coup mince / coup plein |
| Brooklyn (crossover hit) | coup croisé |
| lane / bowling centre | allée / salle de quilles |
| approach, arrows, dots, boards | approche, flèches, points, planches |
| breakpoint | point de rupture |
| oil pattern / lane condition | patron d'huilage / état de l'allée |
| house shot / sport shot | huilage maison / patron sport |
| transition / carrydown | transition de l'huile |
| bowling ball / strike ball / spare ball | boule / boule d'abat / boule de réserve |
| bag | sac de quilles |
| coverstock / core | enrobage / noyau |
| RG / differential / layout / PAP | RG / différentiel / disposition de perçage / PAP |
| drilling / finger holes / thumb hole | perçage / trous des doigts / trou du pouce |
| release / hook | lâcher / crochet |
| rev rate / ball speed | taux de rotation (tr/min) / vitesse de la boule |
| axis rotation / axis tilt | rotation de l'axe / inclinaison de l'axe |
| one-handed / two-handed | à une main / à deux mains |
| right-handed / left-handed | droitier / gaucher (as labels) |
| stroker / cranker / tweener | style en douceur / style puissant / style intermédiaire |
| league / team / roster | ligue / équipe / liste des joueurs |
| sub / substitute | remplaçant (neutral: "remplacement" or "personne remplaçante" if needed) |
| captain | capitaine |
| bowling order / lineup | alignement |
| handicap / scratch | handicap / sans handicap |
| average / book average | moyenne / moyenne établie |
| high game / high series | meilleure partie / meilleur triple |
| standings / points | classement / points |
| match play / head-to-head | jeu par match / face-à-face |
| position round | ronde de position |
| pre-bowl / post-bowl | jouer à l'avance / jouer en différé |
| absent / blind score / vacancy | absence / pointage d'absent / poste vacant |
| baker format | système Baker |
| league night / season | soirée de ligue / saison |
| tournament / qualifying / cut | tournoi / qualification / seuil de qualification (se qualifier) |
| side pot / jackpot / high game pot | cagnotte / cagnotte / cagnotte de la meilleure partie |
| 3-6-9 / poker | 3-6-9 / poker |
| buy-in / entry fee / winnings | mise / frais d'inscription / gains |
| practice / open bowling / drill | entraînement / jeu libre / exercice |
| coach | entraîneur |

## Leave empty ("")

- Anything that is not read by a person: CSS values, keys (`manual|{0}|{1}`), code identifiers, regexes, calendar rules (`RRULE...`), debug/log lines (`bowlerCount={0}`, `-> {0} bowler(s)`), developer errors (`useAuth must be used inside...`).
- Text that is part of an instruction or data sent to the AI model (prompt building in genie*.js, aiGuard.js, insight prompts) — BUT translate anything in those files that could be shown to the bowler (answers, refusals, messages).
- Help search keywords (prop/literal strings in help.js arrays next to `keywords`) are NOT empty: give the French words a Quebec bowler would type to search for that topic (a short phrase).

## Fragments

For `jsx-fragment`, translate the piece so that, read in order with its siblings, the whole sentence is correct French. If French word order makes a piece impossible to translate alone, translate it as naturally as possible and keep the meaning; do not leave English.

## Terms already settled (use these for consistency)

| English | French |
|---|---|
| stepladder (finals format) | finale à échelons |
| squad (tournament time slot) | escouade |
| bonus (pins/points) | boni |
| seed (tournament) | tête de série / rang |
| cashed (tournament) | dans l'argent / gains |
| Social (tab) / Friends | Amis |
| Team (tab) | Équipe |
| Gear (tab) | Équipement |
| Coaching (card/feature) | Entraîneur |
| your bowlers (coach's view) | vos élèves |
| Scores only (mode) | Pointages seulement |
| Prebowling | Jouer à l'avance |
| Linking up (coach link) | Jumelage |
| Weak 10 / Ringing 10 | 10 faible / 10 isolée (same pattern for 7) |
| score spread | dispersion des pointages (never "écart", which is a split) |
| teammate (neutral) | membre de l'équipe |

Notes:
- Text is translated where it is DISPLAYED, so translating a word that code also uses as a stored value (e.g. "Yes", "House", "Plastic") is safe — the stored value never changes.
- Ordinals like "3rd" are converted by the runtime to "3e" / "1er" (masculine). Pair them with masculine nouns (rang).
- English words that code inserts into a sentence (e.g. "up"/"down", "they") also get their own entries; translate them in lowercase where they appear in your batch.

## Quality bar

Before writing the file, re-read every translation: meaning identical to the English, grammar and agreement correct, glossary terms used, placeholders intact, no English left (except the names above), no France-only words.
