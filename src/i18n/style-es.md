# Spanish style guide: My Bowling Journey → Latin American Spanish (es-419)

This is the interface of a ten-pin bowling statistics app for league bowlers. Most of its Spanish readers are in **Mexico, Puerto Rico, the United States and the rest of Latin America**, so it is written in neutral Latin American Spanish, **not Spain's Spanish**. No native speaker reviews it before release, so accuracy matters most: the same meaning as the English, natural Latin American Spanish, the bowling words those bowlers really use, and correct grammar and agreement.

## Where translations live

`es-419.js` holds every entry, in the same shape as `fr-CA.js` (see its header):

- Texts built in code are **patterns**. `{0}`, `{1}`... are the values code inserts, and `{1:s}` on the English side marks an English plural ending.
- Text with inline elements (bold, links) uses `⟨0⟩`, `⟨1⟩`... for each element. They must stay **in the same order** in Spanish.
- An empty string means the text is not read by a person.

## Placeholders `{0}`, `{1}`...

- **Meaningful values:** keep every placeholder that carries a number, a name or a score. You may **reorder** them.
- **English plural endings:** those built in code (`game{1}` where `{1}` is `n === 1 ? "" : "s"`) are **dropped**. Use the plural syntax **`{0|singular|plural}`** instead, where 0 is the index of the NUMBER placeholder.
  - The runtime picks the singular only when that number is exactly 1 or -1 (Spanish rule: "0 juegos", "1 juego", "2 juegos").
  - Example: `{0} game{1} logged` → `{0} {0|juego registrado|juegos registrados}`.
- **English words inserted by code** (`"team" : "teams"`, `"is" : "are"`): drop them too. Use the plural syntax on the relevant number instead. With no number available, choose wording that works either way.
- Never invent a placeholder index that is not in the English, and put nothing else in curly braces.

## Numbers, money, percent, time

Mexico, Puerto Rico and the US write numbers the English way, and so does the app: **198.4**, **1,250**, **$4.99**, **54%**. So:

- Keep `$` directly before its number or placeholder, as in the English (`${0}` stays `${0}`).
- Keep `%` directly after its number or placeholder, with no space.
- Do not change digits or decimal points.
- The runtime handles two conversions itself:
  - Times: "7:30 PM" becomes "7:30 p. m.".
  - Ordinals: "3rd" becomes "3.º". The ordinal is masculine, so pair it with a masculine noun ("3.º lugar").

## Voice and style

- **Tú**, always. It is the standard for consumer apps in Mexico, Puerto Rico and Latin America. Imperatives use tú ("Guarda", "Toca", "Elige").
- **Latin American words, not Spain's words.** Use celular, computadora, correo, app, tocar, guardar, borrar/eliminar, ahorita (never), carro. Avoid vosotros forms, "ordenador", "móvil", "vale", "coger", "pinchar", "fichero", "gilipollas" etc. See the glossary's "Avoid" list.
- **Sentence case**, not Title Case: "Scores To Check" → "Puntajes por revisar". Proper names keep their capitals.
- **Punctuation:**
  - Opening marks on questions and exclamations: **¿…?** and **¡…!**
  - No space before `: ; ! ?`
  - Quotes: “así”.
- **Gender-neutral where it is easy.** The reader can be any gender.
  - Prefer rephrasing ("Ya estás en el equipo" rather than "Estás inscrito"), neutral nouns (persona, integrante, miembro), or nouns instead of participles.
  - Do not use @, x or e endings.
  - When a noun for the bowler is unavoidable in a tight label, the generic "jugador" is acceptable.
- **Tone:** keep the English's tone: friendly, plain, direct, with a little dry humour in badges. Do not add or remove information.
- **Length:** buttons, tabs, chips and table headers must stay short. Spanish runs longer than English, so pick the shortest natural wording. Abbreviate only when unavoidable, such as "Prom." for average in a table header.
- Keep emoji, arrows, bullets (·, •, —, →) and the line structure as in the English.

## Do not translate

- **Names:**
  - My Bowling Journey (the app), Pro (the plan).
  - **Brooklyn**, the in-app assistant's name. But a "Brooklyn" HIT (the crossover into the wrong pocket) is "cruzada".
  - **Nightcap**, a feature name. Keep "Nightcap", with a short Spanish gloss only where a sentence explains what it is.
  - **Caddie**: "el Caddie".
- **Brands and services:** Google, Google Play, Stripe, Link, USBC, ball and manufacturer names (Storm, Hammer, Phaze II...), oil pattern names (Viper, Shark...).
- **Scoresheet marks and pin numbers:** X, /, -, F stay as they are, and so do pin numbers and combinations (7-10, 2-4-5-8).
- **Units:** lb stays lb, ft stays ft, mL stays mL, and RG, Diff, PAP stay.

## App vocabulary (use exactly)

| English | Spanish |
|---|---|
| Home (tab) | Inicio |
| Bowl (tab) | Jugar |
| Stats (tab) | Stats (keep it short; "estadísticas" in running text) |
| History (tab) | Historial |
| Setup (tab) | Preparar |
| Improve (tab) | Mejorar |
| Settings | Configuración |
| Inbox | Bandeja de entrada |
| Help | Ayuda |
| Insights (AI feature) | Análisis |
| Journey (milestones card/section) | Trayectoria |
| Badges | Insignias |
| Friends / Social | Amigos |
| Team (tab) | Equipo |
| Gear (tab) | Equipamiento |
| Coach / Coaching (feature) | Entrenador (the person: "tu entrenador"; neutral "entrenador o entrenadora" when it reads well) |
| your bowlers (coach's view) | tus alumnos |
| Side Games | Juegos extra |
| Brackets | Brackets |
| Just Bowling / Open bowling / Casual (mode) | Juego libre |
| Practice (mode) | Práctica |
| League (mode) | Liga |
| Tournament (mode) | Torneo |
| Scores only (mode) | Solo puntajes |
| Subscribe / subscription | Suscribirse / suscripción |
| Free trial | prueba gratis |
| Sign in / sign out | Iniciar sesión / Cerrar sesión |
| Import (scorecard) | Importar |
| Share | Compartir |
| Log / record (a game, shots) | registrar |
| Bag(s) | maleta(s) |
| Ball(s) | bola(s) |
| Arsenal | arsenal |
| Night / session | noche (league or tournament night: "noche de liga"), sesión (practice) |
| Delete my account | Eliminar mi cuenta |
| teammate | compañero de equipo (neutral: integrante del equipo) |
| Prebowling | Adelantar juegos |
| Linking up (coach link) | Vinculación |

## Bowling terminology (see glossary-es.md)

Several scoring words stay in **English**, exactly as league bowlers in Mexico, Puerto Rico and the US say them. They are masculine, and their plurals are strikes, spares, splits.

| English | Spanish |
|---|---|
| bowling (the sport) | boliche |
| bowler | jugador de boliche / bolichista (neutral rephrasing preferred) |
| to bowl | jugar (boliche); tirar (a ball) |
| strike | **strike** (m.) |
| spare | **spare** (m.) — only the scoring spare. A substitute player is "suplente". |
| split | **split** (m.) |
| gutter / gutter ball | canal / bola al canal |
| frame | cuadro |
| open frame | cuadro abierto |
| clean frame | cuadro limpio |
| game | juego |
| series (3 games) | serie |
| pinfall / total pins | pinos derribados / total de pinos |
| score | puntaje |
| scoresheet / scorecard | hoja de puntaje |
| mark (strike or spare) | marca |
| double / turkey | doble / turkey |
| perfect game / clean game | juego perfecto / juego limpio |
| first ball / second ball | primer tiro / segundo tiro |
| fill ball | tiro extra |
| foul / foul line | falta / línea de falta |
| pin / headpin / pocket | pino / pino 1 / bolsillo |
| pin deck | área de pinos |
| pinsetter (string / free-fall) | armadora (de cuerdas / de caída libre) |
| leave (pins left) | pinos que quedan |
| single-pin spare | spare de un pino |
| corner pin / 10 pin | pino de esquina / pino 10 |
| ringing 10 / weak 10 | 10 aislado / 10 débil (same pattern for the 7) |
| lone 5 | 5 solo |
| washout / bucket | keep the pin numbers; "washout" / "bucket" in quotes if the English names them |
| 7-10 split, baby split, big four, greek church | split 7-10, baby split, big four, greek church |
| messenger | mensajero |
| light hit / high hit | golpe delgado / golpe grueso |
| Brooklyn (crossover hit) | cruzada |
| carry | carry (bowler jargon, m.) or plain wording ("cuánto derriba") |
| lane / bowling center | pista / centro de boliche |
| approach, arrows, dots, boards | aproximación, flechas, puntos, tablas |
| breakpoint | punto de quiebre |
| oil pattern / lane condition | patrón de aceite / condición de la pista |
| house shot / sport shot | patrón de casa / patrón deportivo |
| transition / carrydown | transición / arrastre de aceite |
| bowling ball / strike ball / spare ball | bola / bola de strike / bola de spare |
| coverstock / core | cubierta / núcleo |
| RG / differential / layout / PAP | RG / diferencial / layout (diseño de perforación) / PAP |
| drilling / finger holes / thumb hole | perforación / orificios de los dedos / orificio del pulgar |
| release / hook | soltada / gancho |
| rev rate / ball speed | revoluciones (rpm) / velocidad de la bola |
| axis rotation / axis tilt | rotación del eje / inclinación del eje |
| one-handed / two-handed | a una mano / a dos manos |
| right-handed / left-handed | diestro / zurdo |
| stroker / cranker / tweener | stroker / cranker / tweener |
| league / team / roster | liga / equipo / lista del equipo |
| sub / substitute | suplente |
| captain | capitán |
| bowling order / lineup | orden de tiro |
| handicap / scratch | hándicap / scratch |
| average / book average | promedio / promedio establecido |
| high game / high series | juego más alto / serie más alta |
| standings / points | tabla de posiciones / puntos |
| match play / head-to-head | match play / mano a mano |
| position round | ronda de posiciones |
| absent / blind score / vacancy | ausente / puntaje de ausente / vacante |
| baker format | formato Baker |
| league night / season | noche de liga / temporada |
| tournament / qualifying / cut | torneo / clasificación / corte |
| stepladder / squad / seed | final escalonada / turno / sembrado |
| cashed | cobró (en premios) |
| bonus | bono |
| side pot / jackpot / high game pot | bote / bote / bote del juego más alto |
| 3-6-9 / poker | 3-6-9 / póker |
| buy-in / entry fee / winnings | entrada / cuota de inscripción / ganancias |
| practice / open bowling / drill | práctica / juego libre / ejercicio |
| score spread | dispersión de puntajes |

## Leave empty ("")

- **Text no one reads:** CSS values, keys (`manual|{0}|{1}`), code identifiers, regexes, calendar rules (`RRULE...`), debug and log lines, developer errors.
- **Instructions and data sent to the AI model.** But translate anything in those files that the bowler could see.
- **Not empty: help search keywords** (literal strings in help.js arrays next to `keywords`). Give the Spanish words a Latin American bowler would type to search for that topic.
- **Same as French:** where the French entry is empty, the Spanish entry is empty too.

## Fragments

A `fragment` is a piece of a sentence that React renders around other elements or values. Translate it so that, read in order with its siblings, the whole sentence is correct Spanish. If Spanish word order makes a piece impossible to translate alone, translate it as naturally as possible and keep the meaning. Do not leave English.

## Context entries

A key like `theme::Light` is used where one English word needs a different Spanish word on a particular screen. Translate for that context.

## Quality bar

Before writing the file, re-read every translation and check:

- The meaning is the same as the English.
- Grammar and agreement are correct.
- Glossary terms are used.
- Placeholders are intact.
- Opening ¿ and ¡ are there.
- No English is left (except the names and loanwords above).
- No Spain-only words.
