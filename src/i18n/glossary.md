# Ten-pin bowling glossary: English to Quebec French (fr-CA)

Compiled 2026-09-25 for the bowling stats app. There was no native-speaker review, so every entry says how it was checked.

## How to read this glossary

**Confidence levels**

| Code | Meaning |
|---|---|
| **V** | **Verified in source.** An OQLF Grand dictionnaire terminologique (GDT) fiche or Banque de dépannage linguistique (BDL) page was fetched and read. |
| **Q** | **Attested in Quebec/Canadian usage.** Found in a French-language document from a Canadian or Quebec bowling body (the Fédération canadienne des dix-quilles (FCDQ) rules, the FCDQ league officers' manual, Jeunes Quilleurs du Canada, Quilles Canada, FADOQ) or from a Quebec bowling centre or league. |
| **I** | **Best inference.** No authoritative source was found. The term is built from verified terms or from general French. **Have someone who bowls in a Quebec league check these.** |

**Method and limits**

- OQLF fiches were found by WebSearch restricted to `vitrinelinguistique.oqlf.gouv.qc.ca`, then read with WebFetch.
- OQLF's bowling coverage is small. Most fiches date from 1972 to 1996, and several core terms have no fiche at all: frame, split, spare, foul line and approach.
- **TERMIUM Plus could not be reached** from the research environment (its robots.txt fetch failed every time). None of the entries were checked against TERMIUM. That is the obvious next source for the rows marked I.
- The PDFs were read through a summarising fetcher. For the key terms I asked for verbatim quotes and got them: abat, réserve, écart, carreau ouvert, double, triple/dindon, ligne de faute, moyenne établie, pointage d'absent, poste vacant, à une main / à deux mains, 3-6-9 and cagnotte.
- "Avoid" lists what OQLF marks as déconseillé or as European usage, plus plain anglicisms.

Source links use short reference names. The full URLs are listed in [Sources](#sources) at the end.

---

## 1. Scoring

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| strike | **abat** (n. m.) | fauchage (n. m.): also a preferred term in the GDT, but not found in any usage source, so keep it out of the UI | strike; "frappe" | [GDT abat][g-abat], [FCDQ r. 3b][fcdq], [JQC][jqc], [FADOQ][fadoq], [Champion][champ] | **V + Q** |
| spare | **réserve** (n. f.) | demi-abat (n. m.): appears only in a GDT note, not in usage | spare | [GDT lancer précis][g-lancer] (note: "réserve (ou demi-abat)"), [FCDQ r. 3e][fcdq], [JQC][jqc], [Gaillards][gail], [Champion][champ] | **Q** (+ mentioned in V) |
| split | **écart** (n. m.) | trouée (n. f.) ([JQC][jqc]); "split" (n. m.) in casual Quebec centre usage ([Champion][champ]) | fente: there is **no** OQLF bowling fiche for it. The only "fente" fiches are wood defects and fitness lunges. | [FCDQ r. 3g][fcdq] ("Un écart est un ensemble de quilles laissées debout après le premier lancer, à condition que la quille de tête ait été abattue") | **Q** (sources disagree, see Terms to watch) |
| gutter | **dalot** (n. m.) | — | rigole, gouttière, goulotte (GDT marks these as France/Europe); gutter | [GDT dalot][g-dalot], [JQC][jqc], [FADOQ][fadoq] | **V + Q** |
| gutter ball | **boule dans le dalot** (n. f.) | — | boule dans la rigole / gouttière | [JQC][jqc] | **Q** |
| open frame | **carreau ouvert** (n. m.) | — | frame ouvert, "open" | [FCDQ r. 3f][fcdq] | **Q** |
| frame | **carreau** (n. m.) | — | frame (n. f./m., France); manche | [FCDQ r. 2a][fcdq], [FADOQ][fadoq], [Quilles Canada][bowlcan], [Champion][champ] | **Q** |
| game | **partie** (n. f.) | — | game (anglicism). "jeu" for a single game: the GDT uses it loosely, but use *partie* | [FCDQ r. 2a][fcdq], [FADOQ][fadoq], [Gaillards][gail] | **Q** |
| series (three-game set) | **triple** (n. m.) | série (n. f.), as in "une série de trois parties" ([FCDQ r. 54][fcdq]) | — | [FCDQ manual][man] ("un triple de 800 ou plus"), [Gaillards][gail] ("plus haut triple") | **Q** (collides with *turkey*, see Terms to watch) |
| pinfall | **quilles abattues** (n. f. pl.) | chute de quilles (n. f.) | — | [FCDQ r. 6][fcdq], [Lexer league page][lexer] ("Moyenne quilles abattues") | **Q** |
| total pins | **total des quilles abattues** (n. m.) | total de quilles | — | built from the row above | **I** |
| score | **pointage** (n. m.) | score (n. m.): FCDQ rules use it, and it is standard in Europe | — | [GDT carte de pointage][g-carte] (Quebec prefers *pointage*), [FCDQ manual][man], [Champion][champ] | **V + Q** |
| scoresheet | **feuille de pointage** (n. f.) | feuille de marque (n. f.) | feuille de score (European) | [GDT feuille de marque][g-feuille] ("feuille de pointage", used in Canada) | **V** |
| mark (strike or spare) | **abat ou réserve** (descriptive) | carreau fermé (n. m.): the logical opposite of *carreau ouvert*, but not found in any source | "marque" (calque) | — | **I** |
| double (2 strikes in a row) | **double** (n. m.) | — | — | [FCDQ r. 3c][fcdq] ("Deux abats consécutifs, c'est un double.") | **Q** |
| turkey (3 in a row) | **dindon** (n. m.) | dinde (n. f.) ([JQC][jqc]); in stats labels, **"3 abats de suite"** | turkey. Also avoid *triple* here, because that word is reserved for a series. | [FCDQ r. 3d][fcdq] ("Trois abats successifs, c'est un triple ou un dindon.") | **Q** (sources disagree, see Terms to watch) |
| perfect game / 300 | **partie parfaite** (n. f.) | partie de 300; "300" | perfect game | [Gaillards][gail], [Champion][champ], [FCDQ r. 51][fcdq], [FCDQ manual][man]; Quilles Canada uses "jeu parfait" | **Q** |
| clean game (no open frames) | **partie sans carreau ouvert** (descriptive) | — | clean game | built from *carreau ouvert*. The FCDQ manual has "partie entière de réserves", which means an all-spare game, not a clean game. | **I** |
| honor score | **pointage d'honneur** (n. m.) | prix d'honneur (n. m.), for the award itself | — | [FCDQ manual][man] ("Des scores de parties de 300, 299, 298; un triple de 800 ou plus") | **Q** |
| first ball | **premier lancer** (n. m.) | première boule (n. f.) | first ball | [FCDQ r. 3b][fcdq]; [GDT abat][g-abat] ("avec sa première boule") | **V + Q** |
| second ball | **deuxième lancer** (n. m.) | deuxième boule (n. f.) | — | [JQC][jqc] ("avec votre deuxième boule") | **Q** |
| fill ball (10th-frame bonus) | **lancer supplémentaire** (n. m.) | — | fill ball | [Champion][champ] ("le joueur reçoit un ou deux lancers supplémentaires") | **Q** (Quebec centre, not a federation) |
| foul | **faute** (n. f.) | — | foul | [GDT faute (sport)][g-faute], [FCDQ r. 5a][fcdq], [FADOQ][fadoq] | **V + Q** |
| foul line | **ligne de faute** (n. f.) | — | ligne de jeu: the GDT *allée de quilles* definition uses it, but its only fiche is the curling hog line | [FCDQ r. 5a][fcdq], [FADOQ][fadoq] | **Q** (see Terms to watch) |

## 2. Pins and leaves

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| pin | **quille** (n. f.) | — | — | [GDT quille][g-quille] | **V** |
| headpin (1 pin) | **quille de tête** (n. f.) | quille maîtresse (n. f.); quille 1 | — | [FCDQ r. 3g][fcdq], [Quilles Canada][bowlcan] ("quille de tête (quille maîtresse)") | **Q** |
| pocket | **poche** (n. f.) | — | pocket | common European French; no Quebec source found | **I** |
| pin deck | **aire des quilles** (n. f.) | — | pin deck | — | **I** |
| pinsetter (machine) | **planteuse** (n. f.) | planteuse-déblayeuse (n. f.); planteur de quilles (n. m.) ([FCDQ][fcdq]) | requilleuse / requilleur (believed to be France usage; not checked) | [GDT planteuse][g-planteuse], [GDT remise en place][g-remise] | **V** |
| string pinsetter | **planteuse à ficelles** (n. f.) | — | — | built from *planteuse* | **I** |
| free-fall pinsetter | **planteuse à chute libre** (n. f.) | — | — | built from *planteuse* | **I** |
| leave (pins left standing) | **quilles restantes** (n. f. pl.) | quilles laissées debout | leave | [FCDQ r. 3e/3g][fcdq] ("quilles laissées debout après le premier lancer"), [JQC][jqc] ("les quilles restantes") | **Q** |
| single-pin spare | **réserve d'une quille** (n. f.) | — | — | built from *réserve* | **I** |
| corner pin | **quille de coin** (n. f.) | quille extérieure (n. f.) | — | [Quilles Canada][bowlcan] ("quilles extérieures (quilles de coin)") | **Q** |
| 10 pin / 7 pin | **quille 10**, **quille 7** (n. f.); informally "la 10", "la 7" | quille no 10 | — | numbering convention; no source for the phrasing | **I** |
| ringing 10 / weak 10 (flat 10) | **quille 10 isolée (frappe faible)** (descriptive) | — | — | no source found | **I** |
| lone 5 pin | **quille 5 isolée** (descriptive) | — | — | no source found | **I** |
| washout | **no verified term.** Show the pin numbers (e.g. "1-2-10"). | "washout" in quotes | Do not call it *écart*: the FCDQ definition of écart requires the headpin to be down. | [FCDQ r. 3g][fcdq] | **I** |
| bucket | **no verified term.** Show the pin numbers ("2-4-5-8" / "3-5-6-9"). | — | — | — | **I** |
| 7-10 split | **écart 7-10** (n. m.) | — | split 7-10 | built from *écart* (Q) | **Q/I** |
| baby split | **petit écart** (n. m.), or the pin numbers (2-7, 3-10) | — | — | — | **I** |
| big four | **écart 4-6-7-10** (n. m.) | — | — | — | **I** |
| greek church | **écart 4-6-7-9-10** / **4-6-7-8-10** (n. m.) | — | — | — | **I** |
| messenger | **no verified term.** Use a description: "quille qui traverse l'allée". | — | — | — | **I** |
| light hit / high hit | **coup mince** / **coup plein** (n. m.), meaning a thin or full hit on the headpin | — | — | no source found | **I** |
| Brooklyn (crossover) | **coup croisé** (n. m.), meaning a hit in the opposite pocket | "Brooklyn" (probably kept in speech) | — | no source found | **I** |

## 3. Lane

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| lane | **allée** (n. f.) | allée de quilles (n. f.); piste (n. f.) (the GDT lists it as European but still a preferred term) | **piste de bowling** (GDT: déconseillé) | [GDT allée de quilles][g-allee], [FCDQ][fcdq], [FADOQ][fadoq] | **V + Q** |
| bowling alley / bowling centre | **salle de quilles** (n. f.) | centre de quilles (n. m.) ([FCDQ r. 74][fcdq23]); **salon de quilles** is the dominant real-world usage (see Terms to watch) | salle de bowling, salon de bowling, quillorama, quillodrome (all déconseillés in the GDT; *Quillorama* is fine as part of a business name) | [GDT salle de quilles][g-salle] | **V** (usage differs) |
| approach | **approche** (n. f.) | élan (n. m.), for the run-up movement | — | [FCDQ r. 12][fcdq], [JQC][jqc] | **Q** |
| arrows (targeting arrows) | **flèches** (n. f. pl.) | repères de visée (n. m. pl.) | — | general French usage; no Quebec source found | **I** |
| dots | **points** (n. m. pl.) | repères (n. m. pl.) | — | — | **I** |
| board(s) | **planche(s)** (n. f.) | — | lattes (France usage, e.g. bowlingsports.org) | no Quebec source found | **I** |
| breakpoint | **point de rupture** (n. m.) | point de cassure (n. m.) | breakpoint | — | **I** |
| oil pattern | **patron d'huilage** (n. m.) | profil d'huilage (n. m.) (France/international) | — | "Huilage des allées" is the heading of [FCDQ r. 75][fcdq23]; France uses "profils de huilage" | **I** (the *huilage* part is Q) |
| lane condition | **état de l'allée** (n. m.) | allée peu huilée / très huilée | — | [Motiv Canada][motiv] (ball categories "Légèrement huilés", "Très huilés") | **I/Q** |
| house shot | **huilage maison** (n. m.) | patron maison | house shot | FCDQ uses "maison" for house balls ("Boules du centre (maison)", [r. 74][fcdq23]) | **I** |
| sport shot / sport pattern | **patron sport** (n. m.) | huilage sport | — | — | **I** |
| oil transition / carrydown | **transition de l'huile** (n. f.) / **déplacement de l'huile** (n. m.) | — | carrydown | — | **I** |
| lane conditioning | **huilage des allées** (n. m.) | entretien des allées | — | [FCDQ r. 75 heading][fcdq23] | **Q** |

## 4. Equipment

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| bowling ball | **boule** (n. f.) / **boule de quilles** (n. f.) | grosse boule (n. f.): the GDT term for the ten-pin ball, as opposed to *petite boule* | balle (anglicism); boule de bowling (France) | [GDT grosse boule][g-grosse], [FCDQ r. 74][fcdq23] ("Boules de quilles") | **V + Q** |
| strike ball | **boule d'abat** (n. f.) | — | — | built from *abat* | **I** |
| spare ball | **boule de réserve** (n. f.) | — | — | built from *réserve* | **I** |
| arsenal | **arsenal** (n. m.) | ensemble de boules | — | — | **I** |
| bowling bag | **sac de quilles** (n. m.) | — | sac de bowling | modelled on [GDT soulier de quilles][g-soulier] | **I** |
| (bonus) bowling shoe | **soulier de quilles** (n. m.) | — | chaussure de bowling | [GDT soulier de quilles][g-soulier] | **V** |
| coverstock | **enrobage** (n. m.) | surface de la boule (n. f.) ([FCDQ r. 74.4][fcdq23]) | coverstock | — | **I** |
| core | **noyau** (n. m.) | — | core | — | **I** |
| RG (radius of gyration) | **RG** / **rayon de giration** (n. m.) | — | — | standard physics term; no bowling source found | **I** |
| differential | **différentiel** (n. m.) | — | — | — | **I** |
| layout (drilling layout) | **disposition de perçage** (n. f.) | "layout" | — | *perçage* is Q ([FCDQ r. 74.7][fcdq23]) | **I** |
| PAP (positive axis point) | **PAP** (point d'axe positif, n. m.) | — | — | — | **I** |
| finger holes | **trous des doigts** (n. m. pl.) | — | — | [GDT grosse boule][g-grosse] describes the three holes for the thumb, ring finger and middle finger | **V** (concept) / **I** (wording) |
| thumb hole | **trou du pouce** (n. m.) | — | — | same as above | **V/I** |
| pro shop | **boutique du pro** (n. f.) | boutique du professionnel; "pro shop" is common on signage | — | [GDT boutique du pro][g-pro] (a **golf/tennis** fiche, extended here by analogy) | **V** (other sport) / **I** |
| drilling | **perçage** (n. m.) | — | — | [FCDQ r. 74.7][fcdq23] ("Exigences en matière de perçage") | **Q** |

## 5. Delivery

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| release | **lâcher** (n. m.) (de la boule) | relâchement (n. m.) | release | — | **I** |
| hook | **crochet** (n. m.) | effet (n. m.); courbe (n. f.) | hook | — | **I** |
| rev rate | **taux de rotation** (n. m.), shown as **tr/min** | révolutions par minute | RPM (fine as a unit label, but the French symbol is tr/min) | — | **I** |
| ball speed | **vitesse de la boule** (n. f.) | — | — | — | **I** |
| axis rotation | **rotation de l'axe** (n. f.) | — | — | — | **I** |
| axis tilt | **inclinaison de l'axe** (n. f.) | — | — | — | **I** |
| (bonus) backswing | **ballant** (n. m.) | — | — | [GDT ballant de la boule][g-ballant] | **V** |
| one-handed | **à une main** | — | — | [FCDQ manual][man] ("le jeu avec une seule main") | **Q** |
| two-handed | **à deux mains** | — | — | [FCDQ manual][man] ("se servant de ses deux mains pour jouer") | **Q** |
| right-handed / left-handed bowler | **quilleur droitier / quilleuse droitière**; **quilleur gaucher / quilleuse gauchère** | short forms: **droitier/droitière**, **gaucher/gauchère** (French has no separate slang for "righty/lefty") | — | general French | **I** |
| stroker | **no French equivalent found.** Use a description: "style en douceur". | "stroker" | — | — | **I** |
| cranker | **no French equivalent found.** Use a description: "style puissant". | "cranker" | — | — | **I** |
| tweener | **no French equivalent found.** Use a description: "style intermédiaire". | "tweener" | — | — | **I** |

## 6. League play

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| league | **ligue** (n. f.) | — | — | [FCDQ][fcdq], [FCDQ manual][man], [SalonsDeQuilles][salons] | **Q** |
| team | **équipe** (n. f.) | — | — | [FCDQ][fcdq], [FADOQ][fadoq] | **Q** |
| roster | **liste des joueurs** (n. f.) | liste des quilleurs | roster | [FCDQ manual][man]; [Lexer][lexer] ("Liste des quilleurs") | **Q** |
| substitute (sub) | **remplaçant / remplaçante** (n.) | substitut (n. m.) ([FCDQ manual][man], [Lexer][lexer]); réserviste (n.) ([Gaillards][gail]) | sub; **never *réserve***: Canadian English "spare" also means a substitute, but *réserve* means only the scoring spare | [GDT joueur remplaçant][g-rempl], [FCDQ r. 100i][fcdq] | **V + Q** |
| captain | **capitaine** (n. m./f.) | capitaine d'équipe | — | [FCDQ][fcdq], [FCDQ manual][man], [FADOQ][fadoq] | **Q** |
| bowling order / lineup | **alignement** (n. m.) | ordre de jeu | lineup | [FCDQ r. 100i][fcdq] ("Un remplaçant doit prendre la place du joueur remplacé dans l'alignement."), [FCDQ manual][man] | **Q** |
| handicap | **handicap** (n. m.) | — | — | [FCDQ][fcdq], [FCDQ manual][man], [Gaillards][gail] | **Q** |
| scratch | **sans handicap** | — | scratch, used alone | [FCDQ r. 50][fcdq] ("sans handicap (scratch)") | **Q** |
| (scratch bowler) | **maître-quilleur** (n. m.) | — | joueur scratch (GDT: critiqué) | [GDT maître-quilleur][g-maitre] | **V** |
| average | **moyenne** (n. f.) | — | — | [FCDQ][fcdq], [FCDQ manual][man], [Gaillards][gail] | **Q** |
| book / entering average | **moyenne établie** (n. f.) | moyenne de la saison précédente; moyenne d'entrée (unconfirmed, see Terms to watch) | — | [FCDQ manual][man] ("Moyenne établie lors de la saison précédente, pour 21 parties ou plus") | **Q** |
| high game | **partie la plus élevée** (n. f.) | plus haut simple (n. m.) (league usage); "meilleure partie" (plain-language UI label) | high game | [FCDQ manual][man] ("parties ou des triples les plus élevés"), [Gaillards][gail] ("Les 3 plus hauts simples") | **Q** |
| high series | **triple le plus élevé** (n. m.) | plus haut triple (n. m.) | — | [FCDQ manual][man], [Gaillards][gail] | **Q** |
| standings | **classement** (n. m.) | feuille de classement (the printed sheet) | — | [Lexer][lexer] ("Classements"), [FCDQ manual][man], [Gaillards][gail] | **Q** |
| points (league) | **points** (n. m. pl.) | — | — | [FCDQ manual][man], [Gaillards][gail] | **Q** |
| match play | **jeu par match** (n. m.) | — | — | the FCDQ 2020-21 rules, per the summariser; not confirmed verbatim | **Q (weak)** |
| head-to-head | **face-à-face** (n. m.) | un contre un | — | — | **I** |
| position round | **ronde de position** (n. f.) | — | — | "ronde" (round) is Q ([La Place][place]: "1re ronde"); the full phrase was not found | **I** |
| pre-bowl | **jouer à l'avance** (v.); **partie jouée à l'avance** (n. f.) | — | pre-bowl | [FCDQ manual][man] ("jouer sans adversaire avant et après une séance régulière") | **Q** |
| post-bowl | **jouer après la séance** (v.); **partie jouée en différé** (n. f.) | — | post-bowl | [FCDQ manual][man] (same passage) | **Q/I** |
| absent bowler / blind score | **pointage d'absent** (n. m.) | joueur absent (n. m.); the Gaillards league uses "joueur demandé (dummy)" | blind | [FCDQ manual][man], [FCDQ r. 100i][fcdq] | **Q** |
| vacancy | **poste vacant** (n. m.) | place vacante (n. f.) ([FCDQ r. 100i][fcdq]) | — | [FCDQ manual][man] ("Les équipes qui n'ont pas un alignement complet (poste vacant)") | **Q** |
| baker format | **système Baker** (n. m.) | format Baker | — | [FCDQ manual][man] ("Le système Baker met de l'emphase sur l'effort d'équipe") | **Q** |
| league night | **séance de ligue** (n. f.) | soirée de ligue | — | *séance* is Q ([FCDQ manual][man]) | **Q/I** |
| league season | **saison** (n. f.) | — | — | [FCDQ][fcdq], [FCDQ manual][man] | **Q** |
| sanctioned league | **ligue sanctionnée** (n. f.) | ligue homologuée (n. f.) (I) | — | [FCDQ r. 100a][fcdq], [FCDQ manual][man] | **Q** |

## 7. Tournaments and money

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| tournament | **tournoi** (n. m.) | — | — | [FCDQ][fcdq]; Quebec centres | **Q** |
| qualifying | **qualification** (n. f.) / **ronde de qualification** (n. f.) | — | — | — | **I** |
| cut / making the cut | **se qualifier (pour les finales)**; **seuil de qualification** (n. m.) | — | "faire le cut" | — | **I** |
| bracket(s) | **tableau à élimination** (n. m.) | "brackets" (probably common in speech) | — | — | **I** |
| side pot | **cagnotte** (n. f.) | bourse parallèle | side pot | [GDT cagnotte][g-cagnotte] (a horse-racing fiche; same money-pool sense) | **V** (other domain) / **I** |
| jackpot | **cagnotte** (n. f.) | — | jackpot | [FCDQ manual][man] ("cagnotte des prix/récompenses"), [Gaillards][gail] ("la cagnotte accumulée") | **Q** |
| high game pot | **cagnotte de la partie la plus élevée** (n. f.) | — | — | built from the rows above | **I** |
| 3-6-9 | **3-6-9** (n. m.); "cagnotte 3-6-9" for the side game | — | — | [FCDQ manual][man] ("Dans une ligue 3-6-9, chaque quilleur se voit automatiquement attribué un abat"). **That describes a different thing, see Terms to watch.** | **Q** (term) / **I** (meaning) |
| poker (league side game) | **poker** (n. m.) | — | — | — | **I** |
| buy-in / entry fee | **frais d'inscription** (n. m. pl.) | droits d'inscription (n. m. pl.) (GDT fiche seen in search, not read) | buy-in | [FCDQ r. 101a][fcdq], [FCDQ manual][man] | **Q** |
| prize | **prix** (n. m.) | récompense (n. f.) | — | [FCDQ][fcdq], [FCDQ manual][man] | **Q** |
| prize money / prize fund | **bourse** (n. f.) | cagnotte des prix | — | [La Place][place] ("Quilles 10 $ Bourses 10 $"), [FCDQ manual][man] | **Q** |
| winnings | **gains** (n. m. pl.) | — | — | — | **I** |

## 8. Other

| English | Recommended (gender) | Acceptable alternatives | Avoid in Quebec | Sources | Conf. |
|---|---|---|---|---|---|
| practice session | **séance d'entraînement** (n. f.) | parties d'entraînement (n. f. pl.) | — | [FCDQ r. 100a][fcdq] ("parties d'entraînement") | **Q** |
| open bowling | **jeu libre** (n. m.) / **quilles libres** | — | — | Quebec centres advertise "quilles à volonté" ([Champion][champ2]), which means unlimited bowling, a different thing | **I** |
| coach | **entraîneur / entraîneuse** (n.) | — | coach | general French | **I** |
| drill (practice exercise) | **exercice** (n. m.) | — | — | — | **I** |
| ten-pin bowling | **grosses quilles** (n. f. pl.) | **dix-quilles** (n. m.) (the formal/federation name) | bowling (as the sport's name) | [Regroupement Quilles Québec][rqq] ("Grosses quilles, petites quilles et cinq quilles"), [Quilles Canada][bowlcan] ("le dix-quilles"), [FADOQ][fadoq], [La Place][place], [Laurentian Lanes][laur] | **Q** |
| five-pin bowling | **cinq-quilles** (n. m.) | cinq quilles | **not "petites quilles"** | [Quilles Canada][bowlcan] ("le cinq-quilles"), [RQQ][rqq] | **Q** |
| (petites quilles) | **petites quilles** is a **separate Quebec game**: 10 small pins with a rubber band around them and a small ball. It is not five-pin. | — | — | [petitesquilles.ca][pq] ("Il se joue avec 10 quilles plus petites, entourées d'une bande de caoutchouc"), [RQQ][rqq], [GDT petite boule][g-petite] | **Q** |
| bowler | **quilleur / quilleuse** (n.) | joueur de quilles / joueuse de quilles (n.) | In Europe *quilleur* means the pin-setter. That is irrelevant for fr-CA but matters if the strings are reused for fr-FR. | [GDT joueur de quilles][g-joueur] | **V + Q** |
| to bowl | **jouer aux quilles** (v.) | lancer (v.), for delivering a ball | quiller (the GDT notes usage never adopted it); "bowler"; "faire du bowling" (France) | [GDT jouer aux quilles][g-jouer] | **V** |

---

## Answers to the specific questions

### What is the Quebec French word for "bowling"?

- **Use `quilles` (n. f. pl.) or `jeu de quilles` (n. m.).** OQLF recommended both in February 2011 ([GDT jeu de quilles][g-jeu]).
- OQLF **did not accept "bowling"**. It notes that the word is spreading in Quebec but chose not to let the loanword compete with the established French terms.
- In practice, "bowling" shows up in Quebec marketing and search-engine copy, for example SalonsDeQuilles.com ("Bowling au Québec") and bowlingchampion.ca ("Comment compter une partie de bowling"). Federations, league documents and the centres' own names use *quilles*.
- **Recommendation:** use *quilles* everywhere in the UI. The only exception is the App Store keyword field, where "bowling" helps discovery.
- Ten-pin is **grosses quilles**, or formally **dix-quilles**. Five-pin is **cinq-quilles**. **Petites quilles** is a third, Quebec-specific game.

### Should the app say "vous" or "tu"?

**Use `vous`.** The evidence:

- **OQLF guidance.** The [BDL page on vouvoiement and tutoiement][bdl-vous] treats *vous* as the courteous and safer default with people you don't know. The [BDL web-writing page][bdl-web] suggests addressing users directly with *vous* or with the imperative ("Envoyez", "Consultez").
- **Major Quebec apps (App Store fr-CA descriptions, checked).** [Desjardins][app-desj] ("Faites vos transactions et gérez votre argent…"), [Hydro-Québec][app-hq] ("suivez l'évolution…", "de votre choix"), [Chrono (ARTM/STM)][app-chrono] ("Chrono vous permet…") and [ChargeHub][app-ch] all use *vous*.
- **Every Quebec bowling source read uses *vous*.** That includes the FCDQ rules, Jeunes Quilleurs du Canada ("Lorsque vous faites tomber…"), Regroupement Quilles Québec, SalonsDeQuilles.com, Laurentian Lanes and Salon de quilles de la Place.

Some Quebec consumer brands do use *tu* in advertising. No source recommends it for a general-audience app, and choosing it would be a brand decision, not a localization norm.

**Practical tip:** use the imperative and neutral labels ("Enregistrer la partie", "Moyenne") so that few strings need a pronoun at all.

### OQLF typography for Quebec French

| Item | Quebec (OQLF) rule | Example | Source |
|---|---|---|---|
| `;` `!` `?` | **No space before**, or a fine non-breaking space (U+202F) if available. OQLF notes that no space "tends to become a convention" because software handles the fine space badly. **This differs from France,** which uses a space before ; ! ? | `Prêt?` `Bravo!` | [BDL espacement][bdl-esp] |
| `:` | **Non-breaking space before** (U+00A0), normal space after | `Moyenne : 187` | [BDL espacement][bdl-esp] |
| « guillemets » | Non-breaking space inside both guillemets | `« abat »` | [BDL espacement][bdl-esp] |
| Decimal separator | **Comma** | `187,4` | [BDL espacements dans les nombres][bdl-nb] |
| Thousands separator | **Space** (non-breaking; U+202F or U+00A0) in groups of three. Optional for 4-digit numbers (`8000` or `8 000`). None in identifiers or years. | `12 345`; `1 250 quilles` | [BDL espacements dans les nombres][bdl-nb] |
| Currency | Symbol **after** the number, **preceded by a space** (use a non-breaking space) | `9,99 $`, `500 $`, `20 $ CA` | [BDL sommes d'argent][bdl-arg] |
| Percent | Non-breaking space before `%` | `54 %` | [BDL espacement][bdl-esp] |
| Time | 24-hour clock with `h` and a space on both sides; leading zero on minutes is optional; **no a.m./p.m.** `19:30` is allowed only in technical contexts such as device clocks and timetables, not in running text. | `19 h 30`, `9 h`, `17 h 05` | [BDL écriture de l'heure][bdl-h] |
| Ordinals | `1er`, `1re`, `2e`, `3e`, … (superscript when possible). For "second(e)" use `2d`, `2de`. Plurals: `1ers`, `1res`, `3es`. **Avoid** `1ère`, `2ème`, `2è`, `3ième`. | `10e carreau`, `1re partie` | [BDL adjectifs ordinaux][bdl-ord] |

**Implementation notes**

- `Intl.NumberFormat('fr-CA')` produces the comma, the space separator and `9,99 $`.
- Check which space character it emits: recent ICU versions use U+00A0 or U+202F.
- If your formatter adds a space before `?` or `!`, that is fr-FR behaviour. Strip it for fr-CA.

---

## Terms to watch (ambiguities and collisions)

1. **"triple" has two meanings in the FCDQ texts.** Rule 3d says "trois abats successifs, c'est un triple ou un dindon" (three strikes in a row). League usage and the manual use *triple* for a three-game **series**. **In the app, keep *triple* for the series** and write the turkey as **dindon** or "3 abats de suite".
2. **The English word "spare" has two meanings.** *Réserve* is only the scoring spare. A substitute player is **remplaçant**, **substitut** or **réserviste**.
3. **An *écart* needs the headpin down.** FCDQ rule 3g defines *écart* only for leaves where the headpin fell. A washout (headpin still standing) is not an écart. If the app flags splits, apply the same rule.
4. **Petites quilles is not five-pin.** Five-pin is *cinq-quilles*.
5. **The GDT has mismatched fiches.** "ligne de jeu" in its bowling definitions only has a curling fiche, and "fente" only has wood and fitness fiches. Neither should be used as a bowling term.
6. **Split: the sources disagree.** The FCDQ rules say *écart*. Jeunes Quilleurs du Canada says *trouée*. At least one Quebec centre writes "split". OQLF has no fiche. The glossary recommends *écart* because it is the rulebook term.
7. **Turkey: the sources disagree.** The FCDQ rules say *dindon* (or *triple*). Jeunes Quilleurs du Canada says *dinde*.
8. **Bowling centre: official term vs usage.** OQLF recommends *salle de quilles* and lists **salon de quilles as déconseillé**. Yet *salon de quilles* is what Quebec centres, leagues and FADOQ actually say. Use *salle de quilles* in UI text. Keep *salon de quilles* when it is part of a business's proper name.
9. **Foul line.** The GDT's lane definition says "ligne de jeu". Federation rules say "ligne de faute". The glossary recommends *ligne de faute*.
10. **Entering average.** The FCDQ manual confirms *moyenne établie*. *Moyenne d'entrée* came back from one summarised read of the manual but was not found in a verbatim check, so treat it as unconfirmed.
11. **3-6-9 means something else in the FCDQ manual.** There, a "ligue 3-6-9" is a **scoring format** in which a strike is automatically awarded in frames 3, 6 and 9. That is not the side game you described (a payout for actually striking in frames 3, 6 and 9). Quebec centres also run **"Abat-9"** tournaments, which is a different game again (its rules were not defined on the page read). Describe the side game in a help string rather than relying on the label.

## Sources

**OQLF – Grand dictionnaire terminologique**

- [g-abat]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8412768/abat
- [g-dalot]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8412767/dalot
- [g-jeu]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/1298903/jeu-de-quilles
- [g-joueur]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8414426/joueur-de-quilles
- [g-jouer]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/9496822/jouer-aux-quilles
- [g-allee]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8897796/allee-de-quilles
- [g-salle]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/1299009/salle-de-quilles
- [g-quille]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8878425/quille
- [g-planteuse]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8877569/planteuse
- [g-remise]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/18046860/remise-en-place-des-quilles
- [g-lancer]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8994540/lancer-precis
- [g-ballant]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8897795/ballant-de-la-boule
- [g-grosse]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/9999422/grosse-boule
- [g-petite]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8994541/petite-boule
- [g-maitre]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8488216/maitre-quilleur
- [g-soulier]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/9496829/soulier-de-quilles
- [g-faute]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/17028739/faute
- [g-feuille]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8361697/feuille-de-marque
- [g-carte]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8871297/carte-de-pointage
- [g-rempl]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/10455139/joueur-remplacant
- [g-pro]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8871821/boutique-du-pro
- [g-cagnotte]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8976026/cagnotte
- Also read: [jeu de quilles chandelles](https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/17039718/jeu-de-quilles-chandelles) (candlepins), [planteur](https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8878427/planteur) (pin-boy)

**OQLF – Banque de dépannage linguistique**

- [bdl-esp]: https://vitrinelinguistique.oqlf.gouv.qc.ca/22039/la-typographie/espacement/espacement-avant-et-apres-les-signes-de-ponctuation-et-les-symboles
- [bdl-nb]: https://vitrinelinguistique.oqlf.gouv.qc.ca/25447/la-typographie/nombres/espacements-dans-les-nombres
- [bdl-arg]: https://vitrinelinguistique.oqlf.gouv.qc.ca/21584/la-typographie/nombres/ecriture-des-sommes-dargent
- [bdl-h]: https://vitrinelinguistique.oqlf.gouv.qc.ca/21516/la-typographie/nombres/ecriture-des-heures
- [bdl-ord]: https://vitrinelinguistique.oqlf.gouv.qc.ca/24271/les-abreviations-et-les-symboles/les-abreviations/cas-particuliers-dabreviations/abreviation-de-ladjectif-numeral-ordinal
- [bdl-vous]: https://vitrinelinguistique.oqlf.gouv.qc.ca/25140/la-redaction-et-la-communication/protocole-et-activites-publiques/contextes-demploi-du-vouvoiement-et-du-tutoiement
- [bdl-web]: https://vitrinelinguistique.oqlf.gouv.qc.ca/25035/banque-de-depannage-linguistique/la-redaction-et-la-communication/redaction-pour-le-web/principes-de-redaction-pour-le-web

**Canadian and Quebec bowling bodies, leagues and centres**

- [fcdq]: https://fqdq.ca/wp-content/uploads/2020/09/Reglements-2020-21.pdf (FCDQ *Règles de jeu* 2020-21, hosted by the Fédération québécoise des dix-quilles)
- [fcdq23]: https://gmtba.ca/fr/wp-content/uploads/2023/08/2023-2024-Playing-Rules-FRENCH.pdf (FCDQ *Règles de jeu* 2023-24)
- [man]: https://tenpincanada.com/home/wp-content/uploads/2022/08/League-Officers-Manual-French-2022-2023.pdf (FCDQ *Manuel des responsables d'une ligue* 2022-23)
- [jqc]: https://francais.youthbowl.ca/le-jargon-des-quilles/ (Jeunes Quilleurs du Canada, "Le jargon des quilles")
- [bowlcan]: https://francais.bowlcanada.ca/tout-sur-les-quilles/ (Quilles Canada)
- [rqq]: https://www.regroupementquillesquebec.com/ (Regroupement Quilles Québec)
- [fadoq]: https://www.fadoq.ca/wp-content/uploads/2018/09/reglements-de-quilles-jeux-fadoq-2019.pdf (FADOQ games rules)
- [gail]: https://www.gaillards-montreal.com/wp-content/uploads/2023/10/Charte_des_reglements_2023-2024.pdf (Les Gaillards league, Montreal)
- [lexer]: https://bowling.lexerbowling.com/salondequillesgrandeallee/ligueoutremer/ (Quebec league standings software)
- [champ]: https://www.bowlingchampion.ca/comment-compter-une-partie-de-bowling/ (Salon de quilles Champion)
- [champ2]: https://www.bowlingchampion.ca/Mots-cles/le-saviez-vous/
- [place]: https://quillesdelaplace.com/tournois-abat-9-de-la-place/ (Salon de quilles de la Place)
- [laur]: https://laurentianlanes.com/fr/quilles/ (Laurentian Lanes, Montreal)
- [salons]: https://www.salonsdequilles.com/10-regles-a-suivre-aux-quilles/
- [pq]: https://petitesquilles.ca/articles/
- [motiv]: https://motivcanada.com/boutique?categorie=boules

**App Store descriptions (fr-CA)**

- [app-desj]: https://apps.apple.com/ca/app/services-mobiles-desjardins/id386636953?l=fr-CA
- [app-hq]: https://apps.apple.com/ca/app/hydro-qu%C3%A9bec/id1045080947?l=fr-CA
- [app-chrono]: https://apps.apple.com/ca/app/chrono-recharge-opus/id1261397728?l=fr-CA
- [app-ch]: https://apps.apple.com/ca/app/chargehub-bornes-%C3%A9lectriques/id548640732?l=fr-CA

[g-abat]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8412768/abat
[g-dalot]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8412767/dalot
[g-jeu]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/1298903/jeu-de-quilles
[g-joueur]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8414426/joueur-de-quilles
[g-jouer]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/9496822/jouer-aux-quilles
[g-allee]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8897796/allee-de-quilles
[g-salle]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/1299009/salle-de-quilles
[g-quille]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8878425/quille
[g-planteuse]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8877569/planteuse
[g-remise]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/18046860/remise-en-place-des-quilles
[g-lancer]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8994540/lancer-precis
[g-ballant]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8897795/ballant-de-la-boule
[g-grosse]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/9999422/grosse-boule
[g-petite]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8994541/petite-boule
[g-maitre]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8488216/maitre-quilleur
[g-soulier]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/9496829/soulier-de-quilles
[g-faute]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/17028739/faute
[g-feuille]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8361697/feuille-de-marque
[g-carte]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8871297/carte-de-pointage
[g-rempl]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/10455139/joueur-remplacant
[g-pro]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8871821/boutique-du-pro
[g-cagnotte]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8976026/cagnotte
[bdl-esp]: https://vitrinelinguistique.oqlf.gouv.qc.ca/22039/la-typographie/espacement/espacement-avant-et-apres-les-signes-de-ponctuation-et-les-symboles
[bdl-nb]: https://vitrinelinguistique.oqlf.gouv.qc.ca/25447/la-typographie/nombres/espacements-dans-les-nombres
[bdl-arg]: https://vitrinelinguistique.oqlf.gouv.qc.ca/21584/la-typographie/nombres/ecriture-des-sommes-dargent
[bdl-h]: https://vitrinelinguistique.oqlf.gouv.qc.ca/21516/la-typographie/nombres/ecriture-des-heures
[bdl-ord]: https://vitrinelinguistique.oqlf.gouv.qc.ca/24271/les-abreviations-et-les-symboles/les-abreviations/cas-particuliers-dabreviations/abreviation-de-ladjectif-numeral-ordinal
[bdl-vous]: https://vitrinelinguistique.oqlf.gouv.qc.ca/25140/la-redaction-et-la-communication/protocole-et-activites-publiques/contextes-demploi-du-vouvoiement-et-du-tutoiement
[bdl-web]: https://vitrinelinguistique.oqlf.gouv.qc.ca/25035/banque-de-depannage-linguistique/la-redaction-et-la-communication/redaction-pour-le-web/principes-de-redaction-pour-le-web
[fcdq]: https://fqdq.ca/wp-content/uploads/2020/09/Reglements-2020-21.pdf
[fcdq23]: https://gmtba.ca/fr/wp-content/uploads/2023/08/2023-2024-Playing-Rules-FRENCH.pdf
[man]: https://tenpincanada.com/home/wp-content/uploads/2022/08/League-Officers-Manual-French-2022-2023.pdf
[jqc]: https://francais.youthbowl.ca/le-jargon-des-quilles/
[bowlcan]: https://francais.bowlcanada.ca/tout-sur-les-quilles/
[rqq]: https://www.regroupementquillesquebec.com/
[fadoq]: https://www.fadoq.ca/wp-content/uploads/2018/09/reglements-de-quilles-jeux-fadoq-2019.pdf
[gail]: https://www.gaillards-montreal.com/wp-content/uploads/2023/10/Charte_des_reglements_2023-2024.pdf
[lexer]: https://bowling.lexerbowling.com/salondequillesgrandeallee/ligueoutremer/
[champ]: https://www.bowlingchampion.ca/comment-compter-une-partie-de-bowling/
[champ2]: https://www.bowlingchampion.ca/Mots-cles/le-saviez-vous/
[place]: https://quillesdelaplace.com/tournois-abat-9-de-la-place/
[laur]: https://laurentianlanes.com/fr/quilles/
[salons]: https://www.salonsdequilles.com/10-regles-a-suivre-aux-quilles/
[pq]: https://petitesquilles.ca/articles/
[motiv]: https://motivcanada.com/boutique?categorie=boules
[app-desj]: https://apps.apple.com/ca/app/services-mobiles-desjardins/id386636953?l=fr-CA
[app-hq]: https://apps.apple.com/ca/app/hydro-qu%C3%A9bec/id1045080947?l=fr-CA
[app-chrono]: https://apps.apple.com/ca/app/chrono-recharge-opus/id1261397728?l=fr-CA
[app-ch]: https://apps.apple.com/ca/app/chargehub-bornes-%C3%A9lectriques/id548640732?l=fr-CA
