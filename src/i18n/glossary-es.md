# Ten-pin bowling glossary: English to Latin American Spanish (es-419)

The app's Spanish readers are league bowlers in **Mexico, Puerto Rico, the US and the rest of Latin America**. Bowling vocabulary is not uniform across them:

- **Mexico and Colombia** say *chuza* for a strike.
- **Spain** says *bolos* and *pleno* / *semipleno*.
- **League bowlers everywhere**, and Puerto Rican and US Hispanic bowlers above all, use the English words *strike*, *spare* and *split*.

So the app uses the words every one of those readers already uses at the lanes. `style-es.md` has the full term table; this file records why, and what to avoid.

## Decisions

| Term | Chosen | Why | Not used |
|---|---|---|---|
| the sport | **boliche** | Mexico, Puerto Rico and US Hispanics call it *boliche*. | *bolos* (Spain; in Latin America it can also mean the pins) |
| strike | **strike** | Used in Mexican ([Martí](https://blog.marti.mx/los-spares-en-el-boliche-tambien-cuentan-descubre-mas/)) and Puerto Rican ([Carolina Bowling](https://www.carolinabowling.com/post/aprende-los-conceptos-b%C3%A1sicos-en-el-juego-de-bowling)) bowling writing. | *chuza* (Mexico/Colombia colloquial, [AML](https://academia.org.mx/consultas/obras-de-consulta-en-linea/diccionario-breve-de-mexicanismos-de-guido-gomez-de-silva/item/chuza)); unknown in Puerto Rico. *pleno* (Spain). |
| spare | **spare** | Used in both sources above. | *semipleno*, *media chuza* |
| split | **split** | "el temido 7-10 split" (Martí); "se llama 'split'" (Carolina Bowling). | *agujero*, *cuernos*, *banderillas* (regional) |
| frame | **cuadro** | "tu segundo intento de un cuadro" (Martí). | *frame* (Puerto Rico), *entrada* (some Mexican usage). *cuadro* is understood everywhere. |
| game | **juego** | Neutral everywhere. | *línea* (Mexico: "una línea de boliche equivale a 10 tiros", [Bowlero MX](https://bowlero.mx/preguntas-frecuentes/)) reads as "line" or "lane" elsewhere. |
| pin | **pino** | Mexico ([El Modo](https://elmodo.mx/blog/chuza/), Bowlero MX). | *bolo* (Spain and some Puerto Rico usage; also the sport) |
| lane | **pista** | Neutral. | *carril*, *línea* |
| gutter | **canal** | Neutral ([italki](https://www.italki.com/en/post/question-508115)). | *canaleta* is fine too, but pick one |
| score | **puntaje** | Latin American norm. | *puntuación* (Spain-leaning) |
| average | **promedio** | Universal. | *media* (Spain) |
| bag | **maleta** | What Mexican shops call a bowling bag. | *bolsa* (a plastic bag) |
| ball | **bola** | Universal in bowling. | *pelota* (a ball for other sports) |

## Avoid (Spain-only or wrong register)

| Avoid | Use |
|---|---|
| vosotros, habéis, podéis | ustedes, tienen, pueden |
| ordenador | computadora |
| móvil | celular / teléfono |
| coger | tomar / agarrar |
| vale | está bien / ok |
| pinchar | tocar |
| fichero | archivo |
| guay | genial / padre (avoid slang; use "genial") |
| usted (for the reader) | tú |
| bolos / pleno / semipleno | boliche / strike / spare |
| media (average) | promedio |
| puntuación | puntaje |
| "e-mail" | correo |

## Numbers

Mexico, Puerto Rico and the US write 198.4, 1,250 and $4.99, and the app does too. The runtime (`spanishNumbers` in `engine.js`) only rewrites times ("7:30 p. m.") and English ordinals ("3.º").
