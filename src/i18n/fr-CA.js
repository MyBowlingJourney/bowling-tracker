// Quebec French (fr-CA) for My Bowling Journey.
//
// English -> French. `exact` is whole text; `patterns` are texts built in
// code, {0} {1}... being the values (see src/i18n/engine.js for the rules,
// including {0|singulier|pluriel} and {1:s}). An empty French string means
// "looked at, not text a person reads" and is skipped.
//
// Edit entries here directly. After adding English text to the app, run
//   node scripts/i18n_extract.cjs --missing
// to list what still needs a French entry. Terminology and style:
// src/i18n/glossary.md and src/i18n/style.md.
export const FR_CA = {
"exact": {
"Group": "Groupe",
"Ungrouped": "Sans groupe",
"Coverstock": "Enrobage",
"Core": "Noyau",
"Weight (lb)": "Poids (lb)",
"Diff": "Diff",
"Int. Diff (asymmetric only)": "Diff. int. (noyau asymétrique seulement)",
"Layout System": "Système de perçage",
"Add": "Ajouter",
"'s balls to start logging shots.": ": ses boules, pour commencer à enregistrer des lancers.",
"Active": "Actives",
"Archive": "Archives",
"Done": "Terminé",
"Details": "Détails",
"Remove": "Retirer",
"Cancel": "Annuler",
"No games logged with it yet": "Aucune partie enregistrée avec cette boule pour l'instant",
"No layout recorded": "Aucune disposition de perçage enregistrée",
"Specs": "Caractéristiques",
"Layout": "Perçage",
"Throwing it again": "Je la lance de nouveau",
"No longer throwing this ball? Archiving takes it out of your arsenal and bags and keeps every shot you logged with it.": "Vous ne lancez plus cette boule? L'archiver la retire de votre arsenal et de vos sacs, et conserve tous les lancers que vous avez enregistrés avec elle.",
"Archive this ball": "Archiver cette boule",
"Specs Removed": "Caractéristiques retirées",
"Other bowlers reported the shared specs for": "D'autres personnes ont signalé comme inexactes les caractéristiques partagées de",
"as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "; elles ont donc été retirées. Vous avez toujours la boule — entrez simplement ses détails de nouveau quand vous aurez un moment.",
"Got it": "Compris",
"Group by": "Regrouper par",
"Your groups": "Vos groupes",
"Delete": "Supprimer",
"New group, e.g. Dry lanes": "Nouveau groupe",
"To put a ball in a group, open the ball and pick the group under its specs.": "Pour placer une boule dans un groupe, ouvrez la boule et choisissez le groupe sous ses caractéristiques.",
"Enter the code from your email.": "Entrez le code reçu par courriel.",
"Couldn't delete the account. Try again, or email support@mybowlingjourney.com.": "Impossible de supprimer le compte. Réessayez ou écrivez à support@mybowlingjourney.com.",
"The server didn't confirm the deletion. Nothing has been removed — email support@mybowlingjourney.com.": "Le serveur n'a pas confirmé la suppression. Rien n'a été supprimé — écrivez à support@mybowlingjourney.com.",
"Couldn't reach the server. Nothing has been deleted.": "Impossible de joindre le serveur. Rien n'a été supprimé.",
"Not signed in or name is empty": "Aucune session ouverte ou nom vide",
"unknown reason": "raison inconnue",
"useAuth must be used inside <AuthProvider>": "",
"That code did not work. Check it came through in one piece.": "Ce code n'a pas fonctionné. Vérifiez qu'il est arrivé en entier.",
"Your badges": "Vos badges",
"Your open bowling badges": "Vos badges de jeu libre",
"of": "sur",
"Bowl a league night, a tournament or a practice session to start.": "Jouez une soirée de ligue, un tournoi ou une séance d'entraînement pour commencer.",
"Bowl a night with the group and the first one is yours.": "Jouez une soirée avec le groupe et le premier est à vous.",
"Every one of them.": "Tous sans exception.",
"Every one of them. Including the ones nobody wants.": "Tous sans exception. Même ceux dont personne ne veut.",
"Some come from one good night, some take a season.": "Certains s'obtiennent en une bonne soirée, d'autres prennent une saison.",
"Not all of them are about bowling well — some are about showing up, and one or two you'd rather not have.": "Ils ne portent pas tous sur la qualité de votre jeu — certains récompensent le simple fait d'être là, et vous préféreriez ne pas avoir un ou deux d'entre eux.",
"Share my badges": "Partager mes badges",
"The collection": "Collection",
"All": "Toutes",
"Earned": "Obtenu",
"None yet.": "Aucun pour l'instant.",
"None yet. Bowl a night with the group and the first one is yours.": "Aucun pour l'instant. Jouez une soirée avec le groupe et le premier est à vous.",
"Nothing left. You have all of them.": "Il n'en reste aucun. Vous les avez tous.",
"Someone sent you your badges?": "Quelqu'un vous a envoyé vos badges?",
"Paste the code from their message and your nights come across. Doing it twice is harmless — nothing doubles up.": "Collez le code reçu dans son message et vos soirées seront transférées. Le faire deux fois est sans danger — rien n'est dupliqué.",
"Paste the code": "Collez le code",
"Load": "Charger",
"Edit Bag": "Modifier le sac",
"New Bag": "Nouveau sac",
"Name": "Nom",
"e.g. Short pattern, 6 ball limit": "p. ex. Patron court, limite de 6 boules",
"Type": "Type",
"Balls Allowed": "Boules permises",
"The total the tournament allows. Leave blank for no limit.": "Le nombre total permis par le tournoi. Laissez vide s'il n'y a pas de limite.",
"e.g. 6": "p. ex. 6",
"Plan to include a plastic": "Prévoir une boule de plastique",
"A note for your own planning — it doesn't change the limit above.": "Une note pour votre propre planification — elle ne change pas la limite ci-dessus.",
"Save Bag": "Enregistrer le sac",
"Give the bag a name to save it.": "Donnez un nom au sac pour l'enregistrer.",
"Add a bag": "Ajouter un sac",
"What you carry to league differs from what you carry to a tournament — and tournaments often cap how many balls you may bring, so you can keep several.": "Ce que vous apportez à la ligue diffère de ce que vous apportez en tournoi — et les tournois limitent souvent le nombre de boules permises, alors vous pouvez avoir plusieurs sacs.",
"+ League Bag": "+ Sac de ligue",
"+ Tournament Bag": "+ Sac de tournoi",
"More bags": "Plus de sacs",
"The free plan covers": "Le forfait gratuit comprend",
"league bag and": "sac de ligue et",
"tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.": "sac de tournoi. Les sacs supplémentaires — un sac de tournoi pour patron court, un sac pour patron sport — font partie du forfait payant. Rien de ce que vous avez déjà mis dans vos sacs ne disparaît.",
"Bags": "Sacs",
"No bags yet. Add one above.": "Aucun sac pour l'instant. Ajoutez-en un ci-dessus.",
"ball": "boule",
"· plastic planned": "· boule de plastique prévue",
"Edit": "Modifier",
"Keep": "Garder",
"🔒 Pro — kept exactly as packed, and back the moment you subscribe.": "🔒 Pro — conservé tel quel, et de retour dès que vous vous abonnez.",
"Full — remove a ball before adding another.": "Plein — retirez une boule avant d'en ajouter une autre.",
"Empty. Add balls from below.": "Vide. Ajoutez des boules ci-dessous.",
"Add Balls to a Bag": "Ajouter des boules à un sac",
"Every ball is packed. Practice always shows every ball regardless.": "Toutes les boules sont rangées dans un sac. En entraînement, toutes les boules s'affichent quand même.",
"· not in any bag": "· dans aucun sac",
"Community Specs": "Caractéristiques de la communauté",
"Nobody has shared specs for this ball yet. If you've filled yours in, you can share them so other bowlers don't have to type them.": "Personne n'a encore partagé les caractéristiques de cette boule. Si vous avez rempli les vôtres, vous pouvez les partager pour que d'autres n'aient pas à les saisir.",
"Share My Specs": "Partager mes caractéristiques",
"Yours": "Les vôtres",
"No details recorded": "Aucun détail enregistré",
"Showing the": "Affichage des valeurs pour",
"lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.": "lb — le RG et le différentiel varient selon le poids, et les valeurs de cette boule ont été publiées pour plus d'un poids.",
"No published numbers for": "Aucune valeur publiée pour",
"lb specifically — showing the reference weight instead.": "lb précisément — affichage du poids de référence à la place.",
"more": "autre(s)",
"to": "à",
"Applied": "Appliqué",
"Use These": "Utiliser celles-ci",
"✓ Looks right": "✓ Semble exact",
"Looks right": "Semble exact",
"✓ Wrong": "✓ Inexact",
"Wrong": "Inexact",
"Update Shared": "Mettre à jour le partage",
"Locked — enough bowlers have confirmed these that they can't be edited.": "Verrouillé — assez de personnes les ont confirmées; elles ne peuvent plus être modifiées.",
"Voting closed.": "Vote terminé.",
"Share Mine Instead": "Partager les miennes à la place",
"Ball path": "Trajectoire de la boule",
"First balls at a full rack only": "Premiers lancers sur les 10 quilles debout seulement",
"what a strike ball is for.": "c'est à cela que sert une boule d'abat.",
"Add a ball (e.g. Storm Phaze II)": "p. ex. Storm Phaze II",
"From other bowlers": "D'autres quilleurs et quilleuses",
"Specs entered by other bowlers, not manufacturer data — check them after adding.": "Caractéristiques saisies par d'autres quilleurs et quilleuses, et non données du fabricant — vérifiez-les après l'ajout.",
"Strike % through the night": "Taux d'abats au fil de la soirée",
"How each ball carried as the lanes went, first games to last.": "Comment chaque boule a abattu les quilles à mesure que les allées changeaient, de la première partie à la dernière.",
"Ball": "Boule",
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than": "Chaque valeur est un pourcentage d'abats. Le gras indique la meilleure boule de cette phase; rien n'est en gras quand la différence est assez petite pour relever du hasard. Un taux en ambre repose sur moins de",
"shots behind it, so treat it as preliminary. A dash means no shots at all.": "lancers : considérez-le comme provisoire. Un tiret signifie qu'il n'y a aucun lancer.",
"Rubbing the lamp…": "On frotte la lampe…",
"Reading your numbers…": "Lecture de vos chiffres…",
"Working out what they mean…": "Interprétation des résultats…",
"Still going — it is a fair question…": "Toujours en réflexion — la question le mérite…",
"You've used all": "Vous avez utilisé vos",
"today.": "questions du jour.",
"is back tomorrow.": "revient demain.",
"The Stats screens cover the usual numbers.": "Les écrans Stats couvrent les chiffres habituels.",
"is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.": "sert aux questions auxquelles ils ne répondent pas — posez une question sur votre propre jeu et elle trouve la réponse à partir de ce que vous avez enregistré. S'il lui faut une donnée que vous ne suivez pas encore, elle vous dira quoi commencer à enregistrer.",
"Ask about your bowling…": "Votre question…",
"Ask": "Demander",
"That": "Cela",
"Tour": "",
"Journey": "Parcours",
"Home": "Accueil",
"BadgeCollection": "",
"TeamManagement": "",
"Friends": "Amis",
"StatsView": "",
"ImportScorecard": "",
"Settings": "Paramètres",
"Profile": "Profil",
"TrendsView": "",
"CoachingView": "",
"InsightsView": "",
"A team with that name already exists in this league.": "Une équipe portant ce nom existe déjà dans cette ligue.",
"Could not clear the sync markers on this device. Nothing was changed.": "Impossible d'effacer les marqueurs de synchronisation sur cet appareil. Rien n'a été modifié.",
"Only the bowler who added this league can combine it. Ask them, or join the shared league from a team code.": "Seule la personne qui a ajouté cette ligue peut la fusionner. Demandez-le-lui, ou joignez-vous à la ligue partagée à l'aide d'un code d'équipe.",
"Couldn't combine them just now. Nothing was changed — try again in a moment.": "Impossible de les fusionner pour l'instant. Rien n'a été modifié — réessayez dans un moment.",
"You already have a league with that name. Rename yours first, then join this one.": "Vous avez déjà une ligue portant ce nom. Renommez d'abord la vôtre, puis joignez-vous à celle-ci.",
"Couldn't join that league just now. Check your connection and try again.": "Impossible de vous joindre à cette ligue pour l'instant. Vérifiez votre connexion et réessayez.",
"A league with that name already exists.": "Une ligue portant ce nom existe déjà.",
"Pick a bowler first.": "Choisissez d'abord un quilleur ou une quilleuse.",
"Give the ball a name.": "Donnez un nom à la boule.",
"Location is needed to find nearby centers. Allow location access, or add the center by name.": "La localisation est nécessaire pour trouver les salles de quilles à proximité. Autorisez l'accès à votre position, ou ajoutez la salle par son nom.",
"Couldn't search for centers right now. You can add the center by name instead.": "Impossible de chercher des salles de quilles pour l'instant. Vous pouvez plutôt ajouter la salle par son nom.",
"this team": "cette équipe",
"That request was already answered, or couldn't be reached. Refreshing.": "Cette demande a déjà reçu une réponse ou est inaccessible. Actualisation en cours.",
"the team": "l'équipe",
"They": "Cette personne",
"your team": "votre équipe",
"Couldn't join that team just now — try again in a moment.": "Impossible de vous joindre à cette équipe pour l'instant — réessayez dans un moment.",
"Someone": "Quelqu'un",
"Couldn't make a code just now — check your connection and try again.": "Impossible de générer un code pour l'instant — vérifiez votre connexion et réessayez.",
"That code doesn't look right — it's 8 characters.": "Ce code ne semble pas valide — il compte 8 caractères.",
"That code is not valid.": "Ce code n'est pas valide.",
"That doesn't look like a team code.": "Cela ne ressemble pas à un code d'équipe.",
"Couldn't check that code — you may be offline. You can enter it later in Settings.": "Impossible de vérifier ce code — vous êtes peut-être hors ligne. Vous pourrez le saisir plus tard dans les Paramètres.",
"Give the tournament a name first — it's on the Set up tab.": "Donnez d'abord un nom au tournoi — c'est dans l'onglet Préparation.",
"Weak 10": "10 faible",
"Ringing 10": "10 isolée",
"Other Leave": "Autres quilles",
"9 Pin No-Tap": "Abat à 9 quilles",
"Yes": "Oui",
"Not a valid backup file": "Fichier de sauvegarde non valide",
"No shots logged yet for this night": "Aucun lancer n'a encore été enregistré pour cette soirée",
"The lamp flickered and went quiet. Try again in a few minutes.": "La lampe a vacillé, puis s'est tue. Réessayez dans quelques minutes.",
"Brooklyn had no answer for that.": "Brooklyn n'avait pas de réponse à cela.",
"open bowling": "",
"Sunday": "dimanche",
"Monday": "lundi",
"Tuesday": "mardi",
"Wednesday": "mercredi",
"Thursday": "jeudi",
"Friday": "vendredi",
"Saturday": "samedi",
"Couldn't get your insights right now. Try again in a few minutes.": "Impossible d'obtenir vos analyses pour l'instant. Réessayez dans quelques minutes.",
"Bowl": "Jouer",
"Standings": "Classement",
"Setup": "Préparation",
"Stats": "Stats",
"Improve": "Progresser",
"History": "Historique",
"House Shot": "Huilage maison",
"Back": "Retour",
"Inbox": "Boîte de réception",
"Coach": "Entraîneur",
"Help": "Aide",
"Results": "Résultats",
"Import scorecard": "Importer une feuille de pointage",
"My Bowling Journey Pro": "My Bowling Journey Pro",
"⟳ Backing up": "⟳ Sauvegarde",
"Import": "Importer",
"You're all set": "Tout est prêt",
"We know you're keen to get started — so we won't hold you up for long. We'd just like to show you around first.": "Nous savons que vous avez hâte de commencer — nous ne vous retiendrons donc pas longtemps. Nous aimerions simplement vous faire visiter l'application d'abord.",
"And remember, you can document as much or as little as you want. The more you tell us, the more we can give back.": "Et n'oubliez pas : vous pouvez consigner autant ou aussi peu de détails que vous le voulez. Plus vous nous en dites, plus nous pouvons vous en donner en retour.",
"Begin": "Commencer",
"No thanks — I'll take the tour later from the settings menu": "Non merci — je ferai la visite guidée plus tard à partir du menu des paramètres",
"Close": "Fermer",
"change is": "modification enregistrée",
"changes are": "modifications enregistrées",
"saved on this phone. Nothing is lost.": "sur ce téléphone. Rien n'est perdu.",
"Trying…": "Nouvel essai…",
"Try again now": "Réessayer maintenant",
"Loading…": "Chargement…",
"🧑‍🏫 Coach": "🧑‍🏫 Entraîneur",
"🎯 Start a practice drill": "🎯 Commencer un exercice",
"Competitive": "Compétition",
"Open bowling": "Jeu libre",
"a team": "une équipe",
"A bowler": "Quelqu'un",
"Joining lets teammates see your scores and yours theirs.": "En acceptant, les membres de l'équipe verront vos pointages, et vous, les leurs.",
"Anyone on the team can answer.": "Tout membre de l'équipe peut répondre.",
"Join": "Rejoindre",
"Approve": "Approuver",
"No thanks": "Non merci",
"Decline": "Refuser",
"Nothing Waiting": "Rien en attente",
"Requests, coach tasks and scores to confirm show up here.": "Les demandes, les tâches de l'entraîneur et les pointages à confirmer s'affichent ici.",
"Balls": "Boules",
"League": "Ligue",
"Team": "Équipe",
"waiting for you": "en attente",
"1px solid transparent": "",
"Practice": "Entraînement",
"Tournament": "Tournoi",
"🏆 Won it": "🏆 Victoire",
"🥈 Runner-up": "🥈 Deuxième place",
"🏅 Top five": "🏅 Cinq premiers",
"💰 Cashed": "💰 Dans l'argent",
"✅ Made the cut": "✅ Qualification obtenue",
"QUALIFYING": "QUALIFICATION",
"total ·": "au total ·",
"average ·": "de moyenne ·",
"high": "de meilleure partie",
"vs the cut": "par rapport au seuil de qualification",
"MATCH PLAY": "JEU PAR MATCH",
"match": "match",
"with bonus": "avec boni",
"STEPLADDER": "FINALE À ÉCHELONS",
"step": "match",
"won": "gagnés",
"Nothing logged yet. Once you've bowled a night or two, this shows the shape of a month — which weeks you bowled and which you missed.": "Rien d'enregistré pour l'instant. Après une soirée ou deux aux quilles, vous verrez ici l'allure de votre mois — les semaines où vous avez joué et celles que vous avez manquées.",
"Earlier month": "Mois précédent",
"Later month": "Mois suivant",
"Nothing bowled this month": "Aucune partie jouée ce mois-ci",
"Bowling": "Jeu libre",
"series ·": "de triple ·",
"% strikes": "% d'abats",
"Delete this night?": "Supprimer cette soirée?",
"game": "partie",
"and every frame logged with them. This cannot be undone.": "et tous les carreaux qui y sont enregistrés. Cette action est irréversible.",
"Yes, delete it": "Oui, supprimer",
"Keep it": "La garder",
"Delete this night": "Supprimer cette soirée",
"Nobody here yet. Add people to your scoresheet on the Bowl tab and they'll show up once you've bowled a night together.": "Personne ici pour l'instant. Ajoutez des personnes à votre feuille de pointage dans l'onglet Jouer; elles apparaîtront ici dès que vous aurez joué une soirée ensemble.",
"Everyone you've bowled with, by average.": "Toutes les personnes avec qui vous avez joué, par moyenne.",
"Add someone to compare against.": "Ajoutez quelqu'un pour vous comparer.",
"Share standings": "Partager le classement",
"night": "soirée",
"best": "meilleure partie",
"win": "victoire",
"See all my badges ›": "Voir tous mes badges ›",
"Change": "Changer",
"Pins": "Planteuse",
"Which lanes are free fall? Everything else counts as string.": "Quelles allées ont une planteuse à chute libre? Toutes les autres sont considérées comme à ficelles.",
"e.g. 1-8, 15, 16": "p. ex. 1-8, 15, 16",
"Until these are set, this house stays out of the free fall vs string comparison.": "Tant que ces allées ne sont pas indiquées, cette salle est exclue de la comparaison entre chute libre et ficelles.",
"Bowling Center": "Salle de quilles",
"Where do you usually practice? Setting it lets you compare how you score house to house.": "Où vous entraînez-vous habituellement? Cette information vous permet de comparer vos pointages d'une salle à l'autre.",
"Where do you usually bowl for fun? Setting it lets you compare how you score house to house.": "Où jouez-vous habituellement pour le plaisir? Cette information vous permet de comparer vos pointages d'une salle à l'autre.",
"this league": "cette ligue",
"Search by name, e.g. Arsenal Bowl": "Rechercher par nom, p. ex. Arsenal Bowl",
"Searching…": "Recherche…",
"No centers found nearby. You can add it by name below.": "Aucune salle trouvée à proximité. Vous pouvez l'ajouter par son nom ci-dessous.",
"This list": "Cette liste",
"check the name and address before you rely on it": "vérifiez le nom et l'adresse avant de vous y fier",
"mi": "mi",
"Can't find it? Add by name": "Introuvable? Ajoutez-la par son nom",
"Center name": "Nom de la salle",
"Target:": "Objectif :",
"reached": "résultat :",
"short)": "sous l'objectif)",
"Due": "Échéance",
"Worked on it": "J'y ai travaillé",
"What did you get to?": "Quel résultat avez-vous atteint?",
"Anything to tell your coach?": "Un message pour votre entraîneur?",
"Save": "Enregistrer",
"Reopen": "Rouvrir",
"Give the task a title.": "Donnez un titre à la tâche.",
"What should they work on?": "Sur quoi travailler?",
"Detail (optional)": "Détails (facultatif)",
"Measurable target (optional)": "Objectif mesurable (facultatif)",
"No target": "Aucune cible",
"Target": "Cible",
"Assign": "Assigner",
"Nothing here yet. Both of you can write, and you both see everything.": "Rien ici pour l'instant. De part et d'autre, vous pouvez écrire et tout voir.",
"You": "Vous",
"Add a note…": "Ajouter une note…",
"Post": "Publier",
"Coaching": "Entraîneur",
"Working with a coach — shared goals, drills they set you, and notes back and forth — is part of the paid plan. Everything you have logged is untouched, and any coach already linked to you stays linked.": "Le travail avec un entraîneur ou une entraîneuse — objectifs communs, exercices qui vous sont assignés et échange de notes — fait partie du forfait payant. Tout ce que vous avez enregistré reste intact, et tout lien existant avec un entraîneur est conservé.",
"Your bowlers": "Vos élèves",
"Everyone at a glance — what they're working on, how far along, and when you next see them.": "Tout le monde en un coup d'œil — ce que chaque personne travaille, où elle en est et quand vous la reverrez.",
"+ Add a bowler": "+ Ajouter une personne",
"no session set": "aucune séance prévue",
"Nothing assigned yet.": "Aucune tâche assignée pour l'instant.",
"— no result logged yet.": "— aucun résultat enregistré pour l'instant.",
"Bowls": "Joue dans la ligue",
"on": "le",
"View": "Affichage",
"I'm bowling": "Je joue",
"I'm coaching": "J'entraîne",
"Showing the bowlers you coach.": "Affichage des personnes que vous entraînez.",
"Showing your own game. Switch to see the people you coach.": "Affichage de votre propre jeu. Changez d'affichage pour voir les personnes que vous entraînez.",
"Requests": "Demandes",
"Someone wants to connect.": "Quelqu'un veut établir un lien avec vous.",
"wants to be your": "souhaite être votre",
"Accept": "Accepter",
"Waiting On Them": "En attente de réponse",
"— asked to be your": "— a demandé à être votre",
"Nobody yet. Make a code and read it to them — they enter it on their own phone, and from then on you'll see their sessions, set tasks and track progress here.": "Personne pour l'instant. Créez un code et lisez-le à la personne — elle le saisit sur son propre téléphone, et dès lors, vous verrez ici ses séances, lui assignerez des tâches et suivrez ses progrès.",
"Your Bowlers": "Vos élèves",
"Your Coaches": "Vos entraîneurs",
"Nobody connected yet.": "Aucun lien pour l'instant.",
"Connect with someone": "Établir un lien avec quelqu'un",
"Read this to the bowler you're coaching.": "Lisez ce code à la personne que vous entraînez.",
"Read this to your coach.": "Lisez ce code à votre entraîneur ou entraîneuse.",
"Works once, for the next 7 days.": "Utilisable une seule fois, au cours des 7 prochains jours.",
"They coach me": "Je suis l'élève",
"I coach them": "Je l'entraîne",
"Create a code": "Créer un code",
"They enter it on their own phone and you": "La personne le saisit sur son propre téléphone, et c",
"re connected — no searching for each other by name.": "est fait — le lien est établi, sans avoir à vous chercher par nom.",
"Got a code?": "Vous avez un code?",
"ABCD-2345": "ABCD-2345",
"Coaching code": "Code de jumelage",
"Connect": "Relier",
"Connected. They": "Lien établi. La personne s",
"re in the list above.": "affiche dans la liste ci-dessus.",
"Pick something to work on": "Choisissez un point à travailler",
"Set this goal": "Fixer cet objectif",
"They'll see it on their Improve tab in bowling terms, and it tracks itself as they bowl.": "La personne le verra dans son onglet Progresser, formulé en termes de quilles, et le suivi se fait automatiquement pendant qu'elle joue.",
"Clear": "Effacer",
"Where and when, e.g. 6pm lanes 9-10 at Sunset": "Où et quand, p. ex. 18 h, allées 9-10 au Sunset",
"Shows on your roster above. Leave it blank if you work session to session.": "S'affiche dans votre liste d'élèves ci-dessus. Laissez vide si vous planifiez d'une séance à l'autre.",
"Nothing bowled yet. Their scores appear here once they save a session.": "Aucune partie jouée pour l'instant. Ses pointages s'afficheront ici dès qu'une séance sera enregistrée.",
"Average": "Moyenne",
"High": "Max.",
"Nights": "Soirées",
"From": "Sur",
"shots": "lancers",
"Strike": "Abat",
"Spare": "Réserve",
"Single Pin": "Une quille",
"Split": "Écart",
"Misses:": "Ratés :",
"Recent": "Récemment",
"+ Assign a task": "+ Assigner une tâche",
"No tasks yet — set one above and it'll show in their inbox.": "Aucune tâche pour l'instant — créez-en une ci-dessus et elle apparaîtra dans la boîte de réception de la personne.",
"Done & Attempted": "Terminées et tentées",
"Notes": "Notes",
"Both of you can read and write here.": "Ici, chaque personne peut lire et écrire.",
"End coaching relationship": "Mettre fin à l'encadrement",
"Plastic": "Plastique",
"Just Bowling": "Jeu libre",
"Imported": "Importé",
"Ion Max Solid": "Ion Max Solid",
"Ion Max Pearl": "Ion Max Pearl",
"Phaze II Solid": "Phaze II Solid",
"Phaze II Pearl": "Phaze II Pearl",
"Harsh Reality Pearl": "Harsh Reality Pearl",
"Road Warrior Pearl": "Road Warrior Pearl",
"Equinox Pearl": "Equinox Pearl",
"Box": "Fini d'usine",
"Polish": "Poli",
"Lane Shine": "Lustré par l'allée",
"Weak 7": "7 faible",
"Ringing 7": "7 isolée",
"Half Pocket": "Demi-poche",
"Trip 4": "4 culbutée",
"Kick 10": "10 par la bande",
"Acceptable": "Acceptable",
"Fast": "Rapide",
"Slow": "Lente",
"Too early": "Trop tôt",
"Too late": "Trop tard",
"Too round": "Trop arrondie",
"Too sharp": "Trop brusque",
"Roll out": "S'essouffle",
"Poor carry": "Mauvais abattage",
"No miss room": "Aucune marge d'erreur",
"Lane transition": "Transition de l'huile",
"Surface worn": "Surface usée",
"Perfect game": "Partie parfaite",
"300. Nothing left to take off it.": "300. Impossible de faire mieux.",
"Honor series": "Triple d'honneur",
"New personal best game": "Nouvelle meilleure partie personnelle",
"New personal best series": "Nouveau meilleur triple personnel",
"Won it": "Victoire",
"Top five": "Cinq premiers",
"Cashed": "Dans l'argent",
"Made the cut": "Qualification obtenue",
"Didn't cash": "Aucun gain",
"strike rate": "taux d'abats",
"spare conversion": "taux de réussite des réserves",
"ten pin conversion": "taux de réussite sur la quille 10",
"split conversion": "taux de réussite des écarts",
"single-pin conversion": "le taux de conversion des réserves d'une quille",
"corner-pin conversion": "le taux de conversion des quilles de coin",
"open frames per game": "les carreaux ouverts par partie",
"average by game": "la moyenne par partie",
"score spread": "la dispersion des pointages",
"most common leave": "les quilles restantes les plus fréquentes",
"Nothing in that link.": "Ce lien ne contient rien.",
"that night": "cette soirée",
"No limit": "Sans limite",
"Official": "Officielle",
"Unconfirmed": "Non confirmée",
"Community approved": "Approuvée par la communauté",
"Verified": "Vérifiée",
"Disputed": "Contestée",
"Manufacturer specifications.": "Caractéristiques du fabricant.",
"Reported as incorrect. These specs have been removed.": "Données signalées comme inexactes. Ces caractéristiques ont été retirées.",
"Entered by another bowler and not yet confirmed. Check before trusting it.": "Données saisies par une autre personne et pas encore confirmées. Vérifiez-les avant de vous y fier.",
"Fresh": "Début",
"Transition": "Transition",
"Late": "Fin",
"Strong - Smooth": "Forte - Progressive",
"Strong - Sharp": "Forte - Angulaire",
"Benchmark - Smooth": "Référence - Progressive",
"Benchmark - Sharp": "Référence - Angulaire",
"Weak - Smooth": "Faible - Progressive",
"Weak - Sharp": "Faible - Angulaire",
"Urethane": "Uréthane",
"Solid": "Solide",
"Pearl": "Nacré",
"Hybrid": "Hybride",
"Symmetric": "Symétrique",
"Asymmetric": "Asymétrique",
"All Balls": "Toutes les boules",
"Not specified": "Non précisé",
"Compare yourself with a teammate. Log a night with more than one bowler.": "Comparez-vous à un membre de votre équipe. Enregistrez une soirée avec plus d'une personne.",
"Your team's best games and series. Needs team-mates with logged scores.": "Les meilleures parties et les meilleurs triples de votre équipe. Il faut des membres de l'équipe avec des pointages enregistrés.",
"Your high game and high series. Fills in once you have a game logged.": "Votre meilleure partie et votre meilleur triple. Se remplit dès qu'une partie est enregistrée.",
"Win-loss record. Record match results on a league night.": "Fiche victoires-défaites. Enregistrez les résultats des matchs lors d'une soirée de ligue.",
"Points won each week. Record match results on a league night.": "Points gagnés chaque semaine. Enregistrez les résultats des matchs lors d'une soirée de ligue.",
"How handicap changes results. Set a book average for the roster.": "L'effet du handicap sur les résultats. Entrez une moyenne établie pour la liste des joueurs.",
"Team averages ranked. Add bowlers to your team.": "Classement des moyennes de l'équipe. Ajoutez des membres à votre équipe.",
"Wins against higher-average teams. Record match results.": "Victoires contre des équipes à la moyenne plus élevée. Enregistrez les résultats des matchs.",
"Games decided by a handful of pins. Record match results.": "Parties décidées par quelques quilles. Enregistrez les résultats des matchs.",
"Team totals by night. Needs team-mates with logged scores.": "Totaux de l'équipe par soirée. Il faut des membres de l'équipe avec des pointages enregistrés.",
"Averages by house. Bowl at more than one center.": "Moyennes par salle. Jouez dans plus d'une salle de quilles.",
"Strike percentage by part of the night, ball against ball. Log which ball you threw on each shot.": "Pourcentage d'abats selon le moment de la soirée, boule contre boule. Enregistrez la boule utilisée à chaque lancer.",
"Your line, drawn on the lane. Log start board and arrows on your shots.": "Votre trajectoire, tracée sur l'allée. Enregistrez la planche de départ et les flèches visées à chaque lancer.",
"Each ball's numbers. Log which ball you threw on each shot.": "Les statistiques de chaque boule. Enregistrez la boule utilisée à chaque lancer.",
"What makes you switch balls. Record a ball-change reason.": "Ce qui vous fait changer de boule. Enregistrez la raison d'un changement de boule.",
"Frames without an open. Log a full night frame by frame.": "Les carreaux qui ne restent pas ouverts. Enregistrez une soirée complète, carreau par carreau.",
"How you bowl early against late in a game. Log shots by frame.": "Votre jeu en début de partie par rapport à la fin. Enregistrez vos lancers carreau par carreau.",
"Pins on the first ball. Log shots frame by frame.": "Quilles abattues au premier lancer. Enregistrez vos lancers carreau par carreau.",
"How often the corner pin stands. Log your leaves.": "À quelle fréquence la quille de coin reste debout. Enregistrez vos quilles restantes.",
"Single-pin conversion. Log your leaves and whether you made them.": "Taux de réussite des réserves d'une quille. Enregistrez vos quilles restantes et si vous avez fait la réserve.",
"Splits and conversions. Log your leaves.": "Écarts et taux de réussite. Enregistrez vos quilles restantes.",
"Who missed the lone 5. Log your leaves.": "Qui a raté la quille 5 isolée. Enregistrez vos quilles restantes.",
"Makeable leaves you missed. Log your leaves.": "Les réserves faisables que vous avez ratées. Enregistrez vos quilles restantes.",
"Longest run of strikes. Log a full night frame by frame.": "Votre plus longue suite d'abats. Enregistrez une soirée complète, carreau par carreau.",
"Where your misses go. Record a miss direction on bad shots.": "Où vont vos ratés. Enregistrez la direction du raté sur vos mauvais lancers.",
"How your release holds up. Record release quality on your shots.": "Comment votre lâcher tient le coup. Enregistrez la qualité du lâcher à chaque lancer.",
"Flush against lucky strikes. Record how each strike carried.": "Abats francs contre abats chanceux. Enregistrez comment les quilles sont tombées à chaque abat.",
"Your average as it moves. Log a few more nights.": "Votre moyenne au fil du temps. Enregistrez quelques soirées de plus.",
"What you would average with every spare. Log your leaves.": "La moyenne que vous auriez en faisant toutes vos réserves. Enregistrez vos quilles restantes.",
"Where you are heading. Log a few more nights.": "La direction que vous prenez. Enregistrez quelques soirées de plus.",
"How much your scores swing. Log a few more nights.": "À quel point vos pointages varient. Enregistrez quelques soirées de plus.",
"The shape of your scores. Log a few more nights.": "La répartition de vos pointages. Enregistrez quelques soirées de plus.",
"This season against last. Finish a season, then start another.": "Cette saison comparée à la précédente. Terminez une saison, puis commencez-en une autre.",
"First, second and third game. Log a few full nights.": "Vos première, deuxième et troisième parties. Enregistrez quelques soirées complètes.",
"What you won and paid in. Turn on side games and record a night.": "Ce que vous avez gagné et misé. Activez les cagnottes et enregistrez une soirée.",
"3-6-9 and jackpot. Turn on side games and record a night.": "3-6-9 et gros lot. Activez les cagnottes et enregistrez une soirée.",
"Your season at a glance. Log a night.": "Votre saison en un coup d'œil. Enregistrez une soirée.",
"First night": "Première soirée",
"Bowled a night with the group.": "Une soirée jouée avec le groupe.",
"Regular": "Fidèle",
"Five nights in.": "Cinq soirées au compteur.",
"Fixture": "Fait partie des meubles",
"Fifteen nights. You live here now.": "Quinze soirées. Vous habitez ici maintenant.",
"Marathon": "Marathon",
"Six games in one night.": "Six parties en une soirée.",
"Triple figures": "Trois chiffres",
"Broke 100.": "Cap des 100 franchi.",
"One fifty": "Cent cinquante",
"Broke 150.": "Cap des 150 franchi.",
"Two hundred": "Deux cents",
"Broke 200. That's a real game.": "Cap des 200 franchi. Ça, c'est une vraie partie.",
"Five hundred": "Cinq cents",
"A 500 series across three games.": "Un triple de 500 sur trois parties.",
"Night winner": "Soirée gagnée",
"Won a night outright.": "Une soirée gagnée sans partage.",
"Repeat champion": "Récidive",
"Won three nights.": "Trois soirées gagnées.",
"Clean sweep": "Balayage",
"Won every game in a night.": "Toutes les parties gagnées en une soirée.",
"Giant killer": "David contre Goliath",
"Beat someone averaging 30 more than you.": "Victoire contre quelqu'un qui a 30 quilles de plus que vous en moyenne.",
"Comeback": "Remontée",
"Improved 40 pins between games in a night.": "40 quilles de mieux d'une partie à l'autre en une soirée.",
"Metronome": "Métronome",
"Three games within 10 pins of each other.": "Trois parties à 10 quilles ou moins les unes des autres.",
"New best": "Nouveau record",
"Beat your own high game.": "Vous avez battu votre meilleure partie.",
"Climbing": "Ascension",
"Your average went up over five nights.": "Votre moyenne a augmenté sur cinq soirées.",
"Rough night": "Soirée difficile",
"Everyone has one. Under 70.": "Ça arrive à tout le monde. Moins de 70.",
"Photo finish": "À un cheveu",
"Won or lost a night by a single pin.": "Une soirée gagnée ou perdue par une seule quille.",
"Wooden spoon": "Lanterne rouge",
"Finished last. Someone has to.": "Dernière place. Quelqu'un doit bien la prendre.",
"Back to back": "Coup sur coup",
"Two 150+ games in a row.": "Deux parties de 150+ de suite.",
"Rollercoaster": "Montagnes russes",
"100 pins between your best and worst game in one night.": "100 quilles entre votre meilleure et votre pire partie en une soirée.",
"Scorekeeper": "Responsable du pointage",
"Kept score for four or more people.": "Pointage tenu pour quatre personnes ou plus.",
"Pins set by machine, fall freely.": "Quilles placées par la machine, en chute libre.",
"Pins on strings, pulled back up.": "Quilles attachées à des ficelles, puis remontées.",
"Mixed house": "Salle mixte",
"Some lanes string, some free fall.": "Certaines allées à ficelles, d'autres en chute libre.",
"7 Pin": "Quille 7",
"10 Pin": "Quille 10",
"Bowled your first league night.": "Vous avez joué votre première soirée de ligue.",
"Old guard": "Vieille garde",
"Three full seasons in the same league.": "Trois saisons complètes dans la même ligue.",
"Sub covered": "Remplacement assuré",
"Bowled as a sub for another team.": "Vous avez joué en remplacement pour une autre équipe.",
"New high game": "Nouvelle meilleure partie",
"New high series": "Nouveau meilleur triple",
"Beat your own high series.": "Vous avez battu votre meilleur triple.",
"Book buster": "Moyenne dynamitée",
"A game 40+ pins over your book average.": "Une partie d'au moins 40 quilles au-dessus de votre moyenne établie.",
"In the pocket": "Dans la poche",
"Three games in a night within 5 pins of your average.": "Trois parties dans la même soirée à 5 quilles ou moins de votre moyenne.",
"Heater": "En feu",
"Three straight games above your average.": "Trois parties de suite au-dessus de votre moyenne.",
"Cold night, warm finish": "Départ froid, fin chaude",
"Opened below average, closed above it.": "Début sous la moyenne, fin au-dessus.",
"Raised book average": "Moyenne établie en hausse",
"Your average is 5+ pins above last season's book.": "Votre moyenne dépasse d'au moins 5 quilles votre moyenne établie de la saison dernière.",
"Clean": "Impeccable",
"No open frames all night.": "Aucun carreau ouvert de la soirée.",
"Sharp shooter": "Fine gâchette",
"Converted three or more splits in a night.": "Au moins trois écarts convertis en une soirée.",
"Carried it": "À bout de bras",
"Your score was the difference in a match your team won.": "Votre pointage a fait la différence dans un match gagné par votre équipe.",
"Held the line": "Tenir le fort",
"Bowled above your average in a match your team lost.": "Au-dessus de votre moyenne dans un match perdu par votre équipe.",
"Team high game": "Meilleure partie de l'équipe",
"Set your team's high game for the night.": "Vous avez signé la meilleure partie de votre équipe de la soirée.",
"Team high series": "Meilleur triple de l'équipe",
"Set your team's high series for the night.": "Vous avez signé le meilleur triple de votre équipe de la soirée.",
"Executioner": "Bourreau",
"Helped hang a teammate 30 times.": "Vous avez contribué 30 fois à laisser un membre de l'équipe en plan.",
"Won a side game.": "Vous avez gagné une cagnotte.",
"Money bags": "Plein aux as",
"$100 won in side games, all-time.": "$100 gagnés en cagnottes, au total.",
"Locked in": "Coulé dans le béton",
"Your book average was confirmed at season end.": "Votre moyenne établie a été confirmée à la fin de la saison.",
"Twelve strikes. The one you'll be telling people about.": "Douze abats. Celle que vous allez raconter à tout le monde.",
"800 series": "Triple de 800",
"An 800 series. USBC honor score.": "Un triple de 800. Pointage d'honneur USBC.",
"First tournament": "Premier tournoi",
"Logged your first tournament.": "Vous avez enregistré votre premier tournoi.",
"Survived to the next round.": "Vous avez accédé à la ronde suivante.",
"Finished in the top five.": "Vous avez terminé dans les cinq premières places.",
"Won the whole thing": "Tout raflé",
"First place.": "Première place.",
"Ramping up": "Crescendo",
"Three or more straight games, each higher than the last.": "Au moins trois parties de suite, chacune plus élevée que la précédente.",
"Strong finish": "Fin en force",
"Last game 50+ pins above the average of the rest.": "Dernière partie d'au moins 50 quilles au-dessus de la moyenne des autres.",
"Cashed a side pot": "Cagnotte empochée",
"Won a side pot at an event.": "Vous avez gagné une cagnotte lors d'un événement.",
"Squeaked in": "De justesse",
"Made the cut by 10 pins or fewer.": "Qualification obtenue par 10 quilles ou moins.",
"First drill": "Premier exercice",
"Logged your first drill.": "Vous avez enregistré votre premier exercice.",
"Repeat customer": "Fidèle au poste",
"Same target, five separate sessions.": "Même cible, cinq séances différentes.",
"Trending up": "En progression",
"Conversion rate rose across five weeks.": "Taux de conversion en hausse sur cinq semaines.",
"Century": "Cap des 100",
"100 attempts at one target.": "100 tentatives sur une même cible.",
"Graduated": "Diplôme en poche",
"80%+ on a target, over at least 20 attempts.": "80% ou plus sur une cible, en au moins 20 tentatives.",
"Drilled two different targets in one session.": "Deux cibles différentes travaillées en une séance.",
"Burned the midnight oil": "Jusqu'aux petites heures",
"A practice session of 50+ deliveries.": "Une séance d'entraînement d'au moins 50 lancers.",
"That file is empty.": "Ce fichier est vide.",
"game 1": "partie 1",
"game 2": "partie 2",
"game 3": "partie 3",
"no scores on that row": "aucun pointage sur cette ligne",
"a game is blank between two scores": "une partie est vide entre deux pointages",
"Nothing in that file could be imported.": "Rien dans ce fichier n'a pu être importé.",
"4 Pin": "Quille 4",
"6 Pin": "Quille 6",
"2 Pin": "Quille 2",
"3 Pin": "Quille 3",
"3-6-10 (bucket-ish)": "3-6-10 (presque un « bucket »)",
"2-4-5 (bucket)": "2-4-5 (« bucket »)",
"Strike Ball (pocket hits)": "Boule d'abat (coups dans la poche)",
"Pocket": "Poche",
"Custom": "Personnalisé",
"Failing row contains (*)": "",
"No errors recorded.": "",
"Couldn't connect. Check your signal and try again.": "Connexion impossible. Vérifiez votre signal et réessayez.",
"Your sign-in has expired. Sign out and back in, then try again.": "Votre session a expiré. Déconnectez-vous et reconnectez-vous, puis réessayez.",
"Something went wrong. Try again in a few minutes.": "Une erreur s'est produite. Réessayez dans quelques minutes.",
"Why do I keep leaving the 10?": "Pourquoi est-ce que je laisse toujours la 10?",
"Which ball carries best for me?": "Avec quelle boule est-ce que je fais le plus d'abats?",
"Do I fade late in a set?": "Est-ce que je faiblis en fin de triple?",
"Back tomorrow": "De retour demain",
"Games logged": "",
"Strike percentage": "",
"Spare percentage": "",
"Single-pin spare percentage": "",
"Split conversion percentage": "",
"Open frames per game": "Carreaux ouverts par partie",
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
"Most common leave": "Quilles restantes les plus fréquentes",
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
"Your running average across all games in the current view.": "Votre moyenne cumulative pour toutes les parties de la vue actuelle.",
"Your best single game.": "Votre meilleure partie.",
"Your best series total.": "Le total de votre meilleur triple.",
"Share of first balls that strike.": "Proportion des premiers lancers qui donnent un abat.",
"spare attempts": "tentatives de réserve",
"Non-split spare conversion.": "Réserves réussies, écarts exclus.",
"Single Pin Spare %": "% de réserves d'une quille",
"single-pin attempts": "tentatives sur une quille",
"Conversion on leaves of exactly one pin.": "Réserves réussies quand il reste exactement une quille.",
"10 Pin Spare %": "% de réserves de la quille 10",
"10 pin attempts": "tentatives sur la quille 10",
"Conversion on a lone corner pin (including weak and ringing ones).": "Réserves réussies quand il ne reste qu'une quille de coin (y compris les faibles et les isolées).",
"Frames closed with a strike or a spare.": "Carreaux fermés par un abat ou une réserve.",
"7 pin": "quille 7",
"single-pin spares": "réserves d'une quille",
"keep clean": "fermer",
"to collect, and they're not all about bowling well:": "badges à collectionner, et ils ne récompensent pas tous un bon jeu :",
"Start a session": "Commencer une séance",
"new night": "nouvelle soirée",
"league night": "soirée de ligue",
"On the Bowl tab, pick where you're bowling — practice, league, tournament or just bowling. For league, choose which league and the date. The app remembers your usual night, so on a regular Tuesday it sets itself up.": "Dans l'onglet Jouer, indiquez le type de séance : entraînement, ligue, tournoi ou jeu libre. Pour une ligue, choisissez laquelle et la date. L'application retient votre soirée habituelle : un mardi normal, tout se configure tout seul.",
"Frame tracking vs game tracking": "Suivi par carreau ou par partie",
"Frame tracking records every ball — pins left, ball used, release. That's what powers spare stats, the scoresheet and ball comparisons. Scores only takes three numbers a night. You can switch any time, and start a night one way and finish the other: unlock the score boxes to type totals even mid-game.": "Le suivi par carreau enregistre chaque lancer — quilles restantes, boule utilisée, lâcher. C'est ce qui alimente les stats de réserves, la feuille de pointage et les comparaisons de boules. Le mode pointages seulement ne demande que trois nombres par soirée. Vous pouvez changer en tout temps, et même commencer une soirée d'une façon et la terminer de l'autre : déverrouillez les cases de pointage pour entrer les totaux, même en pleine partie.",
"The ten-frame scoresheet": "La feuille de pointage à dix carreaux",
"edit frame": "modifier un carreau",
"running score": "pointage cumulatif",
"On frame tracking, the ten frames sit between the frame picker and the result buttons. It fills in as you bowl. Tap any frame to edit it. Tapping an empty frame while editing cancels the edit; tapping the next frame when your shot is complete saves it.": "En suivi par carreau, les dix carreaux se trouvent entre le sélecteur de carreau et les boutons de résultat. La feuille se remplit à mesure que vous jouez. Touchez un carreau pour le modifier. Pendant une modification, toucher un carreau vide annule la modification; toucher le carreau suivant quand votre lancer est complet l'enregistre.",
"Delete a shot": "Supprimer un lancer",
"wrong frame": "mauvais carreau",
"Tap the frame on the scoresheet to open it, then either press Delete this shot, or deselect the result — clearing what happened deletes the frame. Both ask you to confirm, because it can't be undone.": "Touchez le carreau sur la feuille de pointage pour l'ouvrir, puis appuyez sur Supprimer ce lancer, ou désélectionnez le résultat — effacer ce qui s'est passé supprime le carreau. Dans les deux cas, on vous demande de confirmer, car c'est irréversible.",
"Prebowl for a future week": "Jouer à l'avance pour une semaine à venir",
"miss next week": "manquer la semaine prochaine",
"Bowling next week's league games early? Turn on Prebowling in Tonight's Session. The games are filed under the date they count for, not the day you threw them — so you can prebowl and bowl tonight's league on the same night without one overwriting the other.": "Vous jouez à l'avance les parties de ligue de la semaine prochaine? Activez Jouer à l'avance dans Soirée en cours. Les parties sont classées à la date pour laquelle elles comptent, pas au jour où vous les avez jouées — vous pouvez donc jouer à l'avance et jouer votre ligue de ce soir le même soir sans que l'un remplace l'autre.",
"Side games and buy-ins": "Cagnottes et mises",
"side pot": "cagnotte",
"high game": "meilleure partie",
"buy in": "mise",
"money games": "jeux d'argent",
"Buy-ins are saved per league — enter them once and they apply every week. Each night, tap the pots you're actually in; sitting one out costs you nothing. Hide pots your house doesn't run in Settings.": "Les mises sont enregistrées par ligue — entrez-les une fois et elles s'appliquent chaque semaine. Chaque soirée, touchez les cagnottes auxquelles vous participez vraiment; en sauter une ne vous coûte rien. Masquez dans Paramètres les cagnottes que votre salle de quilles n'offre pas.",
"Import a scorecard photo": "Importer une photo de feuille de pointage",
"Press Import in the header. Say whether it's practice, league or a tournament, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving.": "Appuyez sur Importer dans l'en-tête. Indiquez s'il s'agit d'entraînement, de ligue ou d'un tournoi, choisissez l'équipe et la date, puis ajoutez des photos de l'écran de pointage. L'application lit les parties et les carreaux, et vous associez chaque colonne à la bonne personne avant d'enregistrer.",
"Send teammates their scores": "Envoyer leurs pointages aux membres de l'équipe",
"share scores": "partager les pointages",
"frame data": "données des carreaux",
"Any column you map to a teammate is sent to them to confirm. They get the frame-by-frame data too, not just totals — once they accept, it lands in their shot history marked as imported.": "Toute colonne associée à un membre de l'équipe lui est envoyée pour confirmation. La personne reçoit aussi les données carreau par carreau, pas seulement les totaux — une fois acceptées, elles s'ajoutent à son historique de lancers, marquées comme importées.",
"Compare yourself to someone": "Vous comparer à quelqu'un",
"head to head": "face-à-face",
"team average": "moyenne d'équipe",
"On the Stats tab, use Compare To. You can compare against a bowler on your device, a friend, or your team's average. Teammates are added as friends automatically, so they're there without sending a request.": "Dans l'onglet Stats, utilisez Comparer à. Vous pouvez vous comparer à une personne enregistrée sur votre appareil, à un ami ou à la moyenne de votre équipe. Les membres de votre équipe sont ajoutés automatiquement à vos amis : ils y sont déjà, sans demande à envoyer.",
"Trends over time": "Tendances au fil du temps",
"over time": "au fil du temps",
"per ball": "par boule",
"Switch to Trends on the Stats tab to see a metric plotted over time. Filter by ball to see how one piece of equipment is performing — that works on game scores too, if you record which ball bowled which game.": "Passez à Suivi dans l'onglet Stats pour voir une mesure tracée au fil du temps. Filtrez par boule pour voir le rendement d'une pièce d'équipement — cela fonctionne aussi pour les pointages de parties, si vous notez quelle boule a servi à chaque partie.",
"Set a goal": "Fixer un objectif",
"On the Improve tab, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "Dans l'onglet Progresser, appuyez sur Ajouter un objectif et choisissez sur quoi travailler — moyenne, taux d'abats, taux de réserves, etc. La progression se met à jour à mesure que vous jouez.",
"Practice drills": "Exercices d'entraînement",
"spare shooting": "exercices de réserves",
"Start a drill from the Improve tab. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "Commencez un exercice à partir de l'onglet Progresser. Choisissez une cible — une réserve précise ou une combinaison de quilles — et l'application compte les réussites et les ratés pour cette séance.",
"A coach sees every bowler they work with on one roster: what each is working on, how far along, and when the next session is. Tasks are set per bowler, and the bowler sees them on their Improve tab.": "L'entraîneur ou l'entraîneuse voit, dans une seule liste, toutes les personnes suivies : ce sur quoi chacune travaille, où elle en est et la date de la prochaine séance. Les tâches sont attribuées individuellement, et chaque quilleur ou quilleuse les voit dans son onglet Progresser.",
"add league": "ajouter une ligue",
"On the Setup tab, under League, add a league with its name, center and season dates. Season dates let the app prompt you to update your book average when the season ends.": "Dans l'onglet Préparation, sous Ligue, ajoutez une ligue avec son nom, sa salle de quilles et les dates de la saison. Grâce aux dates de la saison, l'application peut vous rappeler de mettre à jour votre moyenne établie à la fin de la saison.",
"Add a team and its roster": "Ajouter une équipe et sa liste des joueurs",
"not signed up": "pas encore de compte",
"hasn't joined": "n'a pas encore rejoint",
"email required": "courriel obligatoire",
"bowling order": "alignement",
"add a teammate": "ajouter un membre à l'équipe",
"Teams live under their league on the Setup tab — add a league under League, then add your team under Team. Open the team to set the bowling order and add each teammate by name and email. The email is required: it's what connects them to their spot when they sign up. Teammates who haven't joined yet still work — you can log their scores straight away, and everything you've recorded is waiting for them when they accept the invite.": "Les équipes se trouvent sous leur ligue dans l'onglet Préparation — ajoutez une ligue sous Ligue, puis votre équipe sous Équipe. Ouvrez l'équipe pour définir l'alignement et ajouter chaque membre avec son nom et son courriel. Le courriel est obligatoire : c'est ce qui relie la personne à sa place quand elle s'inscrit. Tout fonctionne même pour les membres qui n'ont pas encore rejoint l'application — vous pouvez enregistrer leurs pointages tout de suite, et tout ce que vous avez enregistré les attendra lorsqu'ils accepteront l'invitation.",
"Your ball arsenal": "Votre arsenal de boules",
"Add your balls on the Setup tab, under Balls, with layout and surface. Balls you log shots with feed the per-ball stats and the trend filters. Bags, the next tab over, let you group what you actually carry.": "Ajoutez vos boules dans l'onglet Préparation, sous Boules, avec leur disposition de perçage et leur surface. Les boules utilisées pour enregistrer vos lancers alimentent les stats par boule et les filtres de tendances. L'onglet voisin, Sacs, vous permet de regrouper ce que vous apportez vraiment.",
"add friend": "ajouter un ami",
"Search for someone by name and send a request. Teammates are added automatically. Friends can compare stats with each other. There's also a QR code here for handing someone the app link.": "Cherchez une personne par son nom et envoyez une demande. Les membres de votre équipe sont ajoutés automatiquement. Les amis peuvent comparer leurs stats entre eux. Vous trouverez aussi ici un code QR pour transmettre le lien de l'application à quelqu'un.",
"Your name and profile": "Votre nom et votre profil",
"two handed": "à deux mains",
"book average": "moyenne établie",
"Set your display name — that's what teammates see. Also here: handedness, book average, home centers, and scorecard names, which are the other spellings of your name that appear on a printed scorecard so imports match you correctly.": "Définissez votre nom d'affichage — c'est ce que voient les membres de votre équipe. Vous y trouverez aussi : main dominante, moyenne établie, salles de quilles habituelles et noms sur la feuille de pointage, c'est-à-dire les autres façons d'écrire votre nom qui apparaissent sur une feuille de pointage imprimée, pour que les importations vous reconnaissent correctement.",
"Your history": "Votre historique",
"Every night you've bowled and every shot you've logged. Filter by team or result. You only see your own — teammates keep theirs.": "Chaque soirée jouée et chaque lancer enregistré. Filtrez par équipe ou par résultat. Vous ne voyez que les vôtres — les membres de votre équipe gardent les leurs.",
"Honor scores, personal bests and badges": "Pointages d'honneur, records personnels et badges",
"perfect game": "partie parfaite",
"honor score": "pointage d'honneur",
"personal best": "record personnel",
"high series": "meilleur triple",
"A 300 game or an 800 series is called out automatically. So is beating your own best game or series — set your all-time bests in your profile so it has something to beat from day one. At a tournament you can record how you finished, and a win gets its own badge. All of them can be shared.": "Une partie de 300 ou un triple de 800 est souligné automatiquement. Même chose quand vous battez votre meilleure partie ou votre meilleur triple — inscrivez vos records de tous les temps dans votre profil pour que l'application ait quelque chose à battre dès le premier jour. En tournoi, vous pouvez noter votre classement final, et une victoire vous vaut son propre badge. Tout peut être partagé.",
"Adding a teammate without their email": "Ajouter un membre d'équipe sans son courriel",
"signup code": "code d'inscription",
"team code": "code d'équipe",
"invite code": "code d'invitation",
"no email": "pas de courriel",
"don't have their email": "je n'ai pas son courriel",
"text them": "lui envoyer un texto",
"When you add a teammate, tick \"I don't have their email\" and you'll get a short code to text them. They enter it when they sign up and land straight on that roster spot, with everything you've already logged under their name.": "Quand vous ajoutez un membre d'équipe, cochez « Je n'ai pas son courriel » et vous obtiendrez un code court à lui envoyer par texto. La personne l'entre à son inscription et arrive directement à sa place dans la liste des joueurs, avec tout ce que vous avez déjà enregistré à son nom.",
"Split conversion by type": "Écarts réussis par type",
"baby split": "petit écart",
"big four": "écart 4-6-7-10",
"greek church": "écart 4-6-7-9-10",
"which splits": "quels écarts",
"Splits are broken out by type, not lumped into one number — the 4-7-10 and the 3-10 are different problems. The Stats tab shows how often you leave each one and how often you convert it, with the well-known ones named.": "Les écarts sont ventilés par type, pas regroupés en un seul chiffre — le 4-7-10 et le 3-10 sont des problèmes différents. L'onglet Stats indique combien de fois vous laissez chacun d'eux et combien de fois vous le réussissez, avec le nom des plus connus.",
"Changing how the app looks": "Changer l'apparence de l'application",
"App appearance in Settings. Glow is the default — rock'n'bowl green on warm black — and there are several others if you'd rather something calmer.": "Apparence de l'application dans Paramètres. Cosmique est le thème par défaut — vert rock'n'bowl sur noir chaud — et il y en a plusieurs autres si vous préférez quelque chose de plus sobre.",
"Recording how a tournament finished": "Indiquer le résultat final d'un tournoi",
"made the cut": "seuil de qualification",
"runner up": "deuxième place",
"how did i do": "mon résultat",
"At the end of a tournament, say how it finished — won it, runner-up, top five, cashed, or made the cut. The app can't work this out from your scores, since it doesn't know what anyone else shot. A win becomes a badge you can share.": "À la fin d'un tournoi, indiquez comment il s'est terminé — victoire, deuxième place, cinq premiers, dans l'argent ou qualification réussie. L'application ne peut pas le déduire de vos pointages, puisqu'elle ne connaît pas ceux des autres. Une victoire devient un badge que vous pouvez partager.",
"who won": "qui a gagné",
"just bowling": "jeu libre",
"who's best": "qui est en tête",
"Everyone you've added to an Open bowling scoresheet turns up in the Standings, ordered by average, with how many games they've bowled, their best single game, and the badges they've earned. It builds up over time, so the more nights you log the more there is to argue about.": "Toutes les personnes que vous avez ajoutées à une feuille de pointage en jeu libre apparaissent dans le Classement, par ordre de moyenne, avec le nombre de parties jouées, leur meilleure partie et les badges obtenus. Il s'étoffe avec le temps : plus vous enregistrez de soirées, plus il y a matière à débattre.",
"Where did everything go?": "Où est passé tout le reste?",
"where is": "où est",
"no stats": "pas de stats",
"no history": "pas d'historique",
"tabs missing": "onglets manquants",
"wrong mode": "mauvais mode",
"went back": "retour en arrière",
"If you picked Open bowling, the app hides everything that mode doesn't use — History, Stats, Improve and Gear. Nothing is deleted; it's all still there. Go to the Bowl tab, find the card at the top showing what you're bowling, tap Change, and pick Practice, League or Tournament. Everything comes straight back.": "Si vous avez choisi Jeu libre, l'application masque tout ce que ce mode n'utilise pas — Historique, Stats, Progresser et Équipement. Rien n'est supprimé; tout est encore là. Allez dans l'onglet Jouer, repérez la carte en haut qui indique votre mode de jeu, touchez Changer et choisissez Entraînement, Ligue ou Tournoi. Tout revient aussitôt.",
"Entering scores for the group": "Saisir les pointages du groupe",
"add someone": "ajouter quelqu'un",
"who's bowling": "qui joue",
"Names down the side, games across the top. Tap a cell and type the final score for that game — totals add themselves. Add whoever's on the lane with the box underneath and they become a row; they don't need the app or an account. Bowl more than a few games and the scores slide across while the names stay put.": "Les noms sur le côté, les parties en haut. Touchez une case et tapez le pointage final de cette partie — les totaux se calculent tout seuls. Ajoutez chaque personne présente sur l'allée avec le champ en dessous : elle devient une ligne, sans avoir besoin de l'application ni d'un compte. Au-delà de quelques parties, les pointages défilent horizontalement tandis que les noms restent en place.",
"The badges you can earn": "Les badges que vous pouvez obtenir",
"how do i get": "comment obtenir",
"Tips: rolling a better ball": "Conseils : mieux lancer la boule",
"how to bowl": "comment jouer aux quilles",
"help me bowl": "m'aider à jouer",
"new to bowling": "débuter aux quilles",
"Pick a ball you can hold comfortably — too heavy and you'll throw it with your arm instead of letting it swing. Aim at the arrows on the lane, not the pins: they're much closer, so they're far easier to hit consistently. Let your arm swing like a pendulum rather than pushing, and try to finish with your hand up where you were aiming. Most beginners improve more from rolling the same ball the same way twice than from anything else.": "Choisissez une boule que vous tenez confortablement — trop lourde, vous la lancerez avec le bras au lieu de la laisser se balancer. Visez les flèches sur l'allée, pas les quilles : elles sont beaucoup plus proches, donc bien plus faciles à atteindre avec constance. Laissez votre bras se balancer comme un pendule plutôt que de pousser, et essayez de terminer la main levée vers l'endroit visé. Pour la plupart des personnes qui débutent, rien n'aide autant que de lancer la même boule de la même façon deux fois de suite.",
"Tips: picking up spares": "Conseils : réussir vos réserves",
"corner pin": "quille de coin",
"second ball": "deuxième lancer",
"pick up": "abattre les quilles restantes",
"Spares are where casual scores are won. If pins are left on the right, move your feet LEFT and aim across the lane at them; if they're on the left, move right. It feels backwards and it works. For a single pin, aim at the arrow closest to it rather than staring at the pin. Converting even half your spares will do more for your score than any strike will.": "C'est avec les réserves qu'on gagne des points en jeu libre. S'il reste des quilles à droite, déplacez vos pieds vers la GAUCHE et visez-les en travers de l'allée; si elles sont à gauche, déplacez-vous vers la droite. Ça semble à l'envers, et pourtant ça marche. Pour une seule quille, visez la flèche la plus proche d'elle plutôt que de fixer la quille. Réussir ne serait-ce que la moitié de vos réserves fera plus pour votre pointage que n'importe quel abat.",
"Tips: how scoring actually works": "Conseils : comment fonctionne vraiment le pointage",
"how does scoring work": "comment calculer le pointage",
"what is a turkey": "qu'est-ce qu'un dindon",
"Ten frames, two balls each. All ten pins on the first ball is a strike, and you get the next two balls added on top. Knocking them all down across both balls is a spare, and you get the next one ball added. That's why strikes are worth chasing — a good game is mostly about not leaving gaps rather than striking every frame. Three strikes in a row is a turkey. A perfect game is 300.": "Dix carreaux, deux lancers chacun. Abattre les dix quilles au premier lancer, c'est un abat : on y ajoute les deux lancers suivants. Les abattre toutes en deux lancers, c'est une réserve : on y ajoute le lancer suivant. Voilà pourquoi les abats valent la peine d'être visés — une bonne partie consiste surtout à ne pas laisser de carreaux ouverts plutôt qu'à faire un abat à chaque carreau. Trois abats de suite, c'est un dindon. Une partie parfaite, c'est 300.",
"Tips: making the night better": "Conseils : pour une soirée encore meilleure",
"night out": "sortie",
"what to do": "quoi faire",
"first time": "première fois",
"Bowl in the same order each game so it stays easy to follow. Ask for bumpers if anyone's small — nobody minds and it keeps everyone in it. Lighter balls are usually on the racks nearest the lanes. If someone's having a rough game, remember there's a badge for it. Rented shoes are meant to slide, so don't fight it on the approach.": "Jouez dans le même ordre à chaque partie pour que ce soit facile à suivre. Demandez les bandes protectrices s'il y a de jeunes enfants — personne ne s'en formalise et tout le monde reste dans la partie. Les boules plus légères sont habituellement sur les supports les plus près des allées. Si quelqu'un connaît une partie difficile, rappelez-vous qu'il y a un badge pour ça. Les souliers de location sont faits pour glisser, alors n'y résistez pas sur l'approche.",
"Syncing and offline use": "Synchronisation et utilisation hors ligne",
"Everything is saved on your phone first and uploaded when there's a connection, so you can log a whole night on bad alley wifi. If something can't upload, the app says so and keeps retrying — nothing is lost.": "Tout est d'abord sauvegardé sur votre téléphone, puis téléversé dès qu'il y a une connexion; vous pouvez donc enregistrer toute une soirée malgré le mauvais Wi-Fi de la salle de quilles. Si quelque chose ne peut pas être téléversé, l'application vous le signale et continue d'essayer — rien n'est perdu.",
"Appearance and settings": "Apparence et paramètres",
"Change the theme in Settings, along with which stats cards you see, which side games are shown, and whether frame tracking fields like ball speed and rev rate appear.": "Changez le thème dans Paramètres, ainsi que les cartes de statistiques affichées, les cagnottes présentées et l'affichage des champs de suivi par carreau comme la vitesse de la boule et le taux de rotation.",
"Importing": "Importation",
"Improving": "Progression",
"Leagues, teams and gear": "Ligues, équipes et équipement",
"Your profile": "Votre profil",
"Good to know": "Bon à savoir",
"no record": "enregistrement introuvable",
"own scores": "vos propres pointages",
"the bowler has already responded": "la personne concernée a déjà répondu",
"only a teammate with verified scores of their own can correct this": "seul un membre de l'équipe dont les propres pointages sont vérifiés peut corriger ceci",
"wait until the next session has finished": "attendez la fin de la prochaine soirée",
"bowler did not respond before the next session ended": "la personne concernée n'a pas répondu avant la fin de la soirée suivante",
"no corrected scores supplied": "aucun pointage corrigé fourni",
"Confirmed by the bowler.": "Confirmé par la personne concernée.",
"Corrected by the bowler.": "Corrigé par la personne concernée.",
"Rejected — these scores need to be entered again.": "Rejeté — ces pointages doivent être saisis de nouveau.",
"Already logged by the bowler — nothing to confirm.": "Déjà enregistré par la personne concernée — rien à confirmer.",
"From an imported scorecard, not yet confirmed.": "Provient d'une feuille de pointage importée, pas encore confirmé.",
"Scores to check": "Pointages à vérifier",
"A teammate imported these from a scorecard photo. They already count — confirming marks them checked.": "Un membre de votre équipe les a importés à partir d'une photo de feuille de pointage. Ils comptent déjà — les confirmer les marque comme vérifiés.",
"A night needs re-entering": "Une soirée à saisir de nouveau",
"You said these weren't yours, so they've stopped counting.": "Vous avez indiqué que ces pointages n'étaient pas les vôtres; ils ne comptent donc plus.",
"Nobody confirmed these and a session has since finished. You can correct them.": "Personne n'a confirmé ces pointages et une soirée s'est terminée depuis. Vous pouvez les corriger.",
"Accept or decline on the Coach tab.": "Acceptez ou refusez dans l'onglet Entraîneur.",
"Work your coach has set for you.": "Le travail que votre entraîneur vous a assigné.",
"They've marked work done or reported how far they got.": "Du travail a été marqué comme terminé ou un avancement a été signalé.",
"Accept or decline on the Social tab.": "Acceptez ou refusez dans l'onglet Amis.",
"Joining lets teammates import your scores from a scorecard photo.": "En vous joignant à l'équipe, vous permettez à ses membres d'importer vos pointages à partir d'une photo de feuille de pointage.",
"Anyone on the team can approve it on the Team tab.": "N'importe quel membre de l'équipe peut l'approuver dans l'onglet Équipe.",
"Book average needs updating": "Moyenne établie à mettre à jour",
"A league season has finished.": "Une saison de ligue est terminée.",
"Other bowlers voted them down. Check and resubmit if you think they were right.": "D'autres quilleurs et quilleuses ont voté contre. Vérifiez-les et soumettez-les de nouveau si vous croyez qu'elles étaient exactes.",
"Strike rate": "Taux d'abats",
"Spare conversion": "Taux de réserves réussies",
"Corner pin conversion": "Réussite des quilles de coin",
"Trend over time": "Tendance dans le temps",
"Game-by-game fade": "Baisse de partie en partie",
"Consistency": "Constance",
"Form vs book average": "Forme par rapport à la moyenne établie",
"Single-pin spares": "Réserves d'une quille",
"Single corner pin spares": "Réserves d'une quille de coin",
"Average by game (1st, 2nd, 3rd)": "Moyenne par partie (1re, 2e, 3e)",
"Score spread": "Dispersion des pointages",
"Ball comparison": "Comparaison des boules",
"Center-by-center averages": "Moyennes par salle de quilles",
"Drill results": "Résultats des exercices",
"Oil pattern averages": "Moyennes par patron d'huilage",
"Overall": "Dans l'ensemble",
"How it finished": "Résultat final",
"Broke 50": "Plus de 50",
"Broke 75": "Plus de 75",
"First 100 game": "Première partie de 100",
"Broke 125": "Plus de 125",
"First 150 game": "Première partie de 150",
"Broke 175": "Plus de 175",
"First 200 game": "Première partie de 200",
"Broke 225": "Plus de 225",
"First 250 game": "Première partie de 250",
"Broke 275": "Plus de 275",
"First 200 series": "Premier triple de 200",
"First 300 series": "Premier triple de 300",
"First 400 series": "Premier triple de 400",
"First 500 series": "Premier triple de 500",
"First 600 series": "Premier triple de 600",
"First 800 series": "Premier triple de 800",
"First night logged": "Première soirée enregistrée",
"Five nights in": "Cinq soirées",
"Ten nights in": "Dix soirées au compteur",
"Twenty-five nights": "Vingt-cinq soirées",
"Fifty nights": "Cinquante soirées",
"A hundred nights": "Cent soirées",
"First strike": "Premier abat",
"First spare": "Première réserve",
"Two strikes in a row": "Deux abats de suite",
"First turkey": "Premier dindon",
"Four in a row": "Quatre abats de suite",
"Five in a row": "Cinq abats de suite",
"Converted a split": "Réserve réussie sur un écart",
"Converted the big four": "Réserve réussie sur l'écart 4-6-7-10",
"First cash": "Premiers gains en tournoi",
"House": "Huilage maison",
"a tournament": "un tournoi",
"just for fun": "pour le plaisir",
"Not enough history yet — you'll be asked once a day until a pattern shows up.": "Pas encore assez d'historique — la question vous sera posée une fois par jour jusqu'à ce qu'une tendance se dégage.",
"Dual Angle": "Dual Angle",
"VLS (Pin Buffer)": "VLS (pin buffer)",
"2LS (Two-Handed)": "2LS (à deux mains)",
"Drilling Angle": "Angle de perçage",
"VAL Angle": "Angle VAL",
"Pin Buffer": "Pin buffer",
"Not a number": "Pas un nombre",
"You're the last member, so the team will be left empty.": "Personne d'autre ne fait partie de l'équipe : elle sera donc vide.",
"Your past scores and averages stay.": "Vos pointages et moyennes passés sont conservés.",
"Standard scoring.": "Pointage standard.",
"Nine on the first ball counts as a strike.": "Neuf quilles au premier lancer comptent comme un abat.",
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
"Won every match.": "Tous les matchs gagnés.",
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
"Sport": "Sport",
"Frame tracking": "Suivi par carreau",
"Game tracking": "Suivi par partie",
"Every frame — strikes, spare conversions, open frames and how each ball carried.": "Chaque carreau — abats, réserves réussies, carreaux ouverts et la façon dont chaque lancer a fait tomber les quilles.",
"The final score for each game. Fast, and still tracks averages and trends.": "Le pointage final de chaque partie. Rapide, et permet quand même de suivre les moyennes et les tendances.",
"Season Record": "Fiche de la saison",
"Hung": "En plan",
"Shots / Strike % / Spare %": "Lancers / % d'abats / % de réserves",
"My Records": "Mes records",
"Clean Frames": "Carreaux fermés",
"Ten Pin Leaves": "Quilles 10 restantes",
"Single Pin Spares": "Réserves d'une quille",
"Hand Up": "Main levée",
"Longest Strike Streak": "Plus longue série d'abats",
"Strike % Through the Night": "% d'abats au fil de la soirée",
"Ball vs Ball": "Boule contre boule",
"A practice session": "Une séance d'entraînement",
"A league night": "Une soirée de ligue",
"A tournament": "Un tournoi",
"There's no wrong answer. Each one just changes which screens you see, and you can switch at any time from the Bowl tab or Settings.": "Il n'y a pas de mauvaise réponse. Chaque choix modifie seulement les écrans que vous voyez, et vous pouvez changer en tout temps à partir de l'onglet Jouer ou des Paramètres.",
"For working on your game. Drills, frame tracking and every detail field are available, and practice scores stay out of your league averages.": "Pour travailler votre jeu. Les exercices, le suivi par carreau et tous les champs de détails sont disponibles, et les pointages d'entraînement ne comptent pas dans vos moyennes de ligue.",
"For your weekly team night. Your team roster and standings are available, along with side games.": "Pour votre soirée d'équipe hebdomadaire. La liste des joueurs et le classement de votre équipe sont disponibles, ainsi que les cagnottes.",
"For higher-stakes competition. Blocks, squads, side pots, brackets, match play and the cut line are all available.": "Pour la compétition à enjeux élevés. Blocs, escouades, cagnottes, tableaux à élimination, jeu par match et seuil de qualification : tout est disponible.",
"For a fun activity. You get the scoresheet, standings and badges — all other views are hidden, not deleted, to keep it quick and simple.": "Pour une activité amusante. Vous avez la feuille de pointage, le classement et les badges — toutes les autres vues sont masquées, pas supprimées, pour que ce soit simple et rapide.",
"no sessions logged": "aucune soirée enregistrée",
"PRODID:-//Bowling Tracker//EN": "",
"Retired": "Retirée",
"This fill ball count may not be reliably read from the scorecard image -- please verify the pin count manually before saving.": "Le nombre de quilles du lancer supplémentaire n'a peut-être pas été lu correctement sur l'image de la feuille de pointage -- veuillez le vérifier manuellement avant d'enregistrer.",
"so a game may be missing from the photo": "il manque donc peut-être une partie sur la photo",
"so one of the game scores was probably misread": "l'un des pointages de partie a donc probablement été mal lu",
"so a frame was probably misread": "un carreau a donc probablement été mal lu",
"so the total was probably misread": "le total a donc probablement été mal lu",
"Keeping the book for the team? Add your teammates and log their shots too.": "Vous tenez la feuille de pointage de l'équipe? Ajoutez les membres de votre équipe et enregistrez aussi leurs lancers.",
"Practising with someone? Add them to compare sessions afterwards. Their scores stay on this device.": "Vous vous entraînez avec quelqu'un? Ajoutez cette personne pour comparer vos séances ensuite. Ses pointages restent sur cet appareil.",
"Bowling with others? Add them to keep everyone's score. Their scores stay on this device.": "Vous jouez avec d'autres personnes? Ajoutez-les pour tenir le pointage de tout le monde. Leurs pointages restent sur cet appareil.",
"on target": "sur la cible",
"board must be a number": "la planche doit être un nombre",
"Winner": "Victoire",
"Best Single Game": "Meilleure partie",
"— that's a real game.": "— ça, c'est une vraie partie.",
"Biggest Comeback": "Plus belle remontée",
"Ran Out Of Steam": "À bout de souffle",
"Most Consistent": "Plus grande constance",
"Pick the date these games count for.": "Choisissez la date pour laquelle ces parties comptent.",
"That's today — prebowled games count for a future date.": "C'est aujourd'hui — les parties jouées à l'avance comptent pour une date future.",
"That date has passed. Prebowled games count for an upcoming session.": "Cette date est passée. Les parties jouées à l'avance comptent pour une soirée à venir.",
"You already have a session on that date. Saving would overwrite it.": "Vous avez déjà une soirée à cette date. L'enregistrement la remplacerait.",
"Bowled": "A joué",
"Practice session": "Séance d'entraînement",
"Just for fun": "Juste pour le plaisir",
"system-ui, sans-serif": "",
"Clean card — no open frames": "Feuille impeccable — aucun carreau ouvert",
"No nights bowled yet.": "Aucune soirée jouée pour l'instant.",
"WON IT": "VICTOIRE",
"TOP FIVE": "CINQ PREMIERS",
"MADE THE CUT": "QUALIFICATION OBTENUE",
"Bracket": "Tableau",
"Eliminator": "Élimination",
"Side Pot": "Cagnotte",
"Optional": "Mise optionnelle",
"Big four": "Écart 4-6-7-10",
"Greek church": "Écart « église grecque »",
"Baby split": "Petit écart",
"Bucket split": "Écart « bucket »",
"Casual": "Jeu libre",
"stat unlocks": "statistique se débloque",
"stats unlock": "statistiques se débloquent",
"use frame tracking": "utilisez le suivi par carreau",
"note which ball bowled each game": "notez la boule utilisée à chaque partie",
"Rates": "Taux",
"Records": "Records",
"Single pins": "Une quille",
"Other leaves": "Autres quilles restantes",
"First ball": "1er lancer",
"Ladder under way.": "Finale à échelons en cours.",
"Waiting for a better connection": "En attente d'une meilleure connexion",
"Your scores are saved on this phone and will upload on their own.": "Vos pointages sont enregistrés sur ce téléphone et seront téléversés automatiquement.",
"Something was already saved": "Un élément était déjà enregistré",
"This looks like a duplicate of something already in the cloud. Your scores are safe — this copy just isn't needed.": "Ceci semble être un doublon d'un élément déjà dans le nuage. Vos pointages sont en sécurité — cette copie n'est simplement pas nécessaire.",
"Not allowed to save this": "Enregistrement non autorisé",
"The app doesn't have permission to save this. Nothing is lost on this phone, but it can't reach the cloud until this is fixed.": "L'application n'a pas la permission d'enregistrer ceci. Rien n'est perdu sur ce téléphone, mais ces données ne pourront pas atteindre le nuage tant que le problème ne sera pas réglé.",
"This didn't save correctly": "Cet élément ne s'est pas enregistré correctement",
"Something about this entry doesn't fit what the cloud expects. Your scores are still on this phone.": "Quelque chose dans cette entrée ne correspond pas à ce qu'attend le nuage. Vos pointages sont toujours sur ce téléphone.",
"Couldn't upload yet": "Téléversement impossible pour l'instant",
"Your scores are saved on this phone. The app keeps trying in the background.": "Vos pointages sont enregistrés sur ce téléphone. L'application continue d'essayer en arrière-plan.",
"Maple and amber, like the house lights are down": "Érable et ambre, comme quand on tamise les lumières de la salle",
"Classic": "Classique",
"Slate and blue, the original look": "Ardoise et bleu, l'apparence d'origine",
"Glow": "Cosmique",
"Rock'n'bowl green on warm black": "Vert fluo des quilles cosmiques sur noir chaud",
"Deep plum with a pink flash": "Prune foncé avec un éclat rose",
"Pin deck": "Aire des quilles",
"High contrast, red pin stripe": "Contraste élevé, bande rouge des quilles",
"Daylight": "Plein jour",
"Bright house, maple accents": "Salle lumineuse, touches d'érable",
"Scoresheet": "Feuille de pointage",
"Cream paper, ruled-line blue and split red": "Papier crème, bleu des lignes et rouge des écarts",
"Chalk": "Craie",
"Cool white, quiet blue": "Blanc froid, bleu discret",
"Keeping score": "Tenir le pointage",
"Home is where a night gets logged. Pick what you're doing from the rows at the top — league, practice, a tournament, just bowling — and the card opens underneath. Enter three game scores, or go ball by ball and record every leave.": "C'est dans Accueil qu'on enregistre une soirée. Choisissez ce que vous faites dans les rangées du haut — ligue, entraînement, tournoi, jeu libre — et la carte s'ouvre juste en dessous. Entrez les pointages de trois parties, ou procédez lancer par lancer et notez toutes les quilles restantes.",
"Your gear": "Votre équipement",
"Setup starts with your arsenal. On Balls, add a ball, record its layout, surface and specs, and on Bags sort them so tonight's four are one tap away.": "L'onglet Préparation commence par votre arsenal. Dans Boules, ajoutez une boule et notez sa disposition de perçage, sa surface et ses caractéristiques; dans Sacs, classez-les pour avoir les quatre de ce soir à portée de main.",
"Leagues and teams": "Ligues et équipes",
"Setup is also where a league gets set up, under League, and a roster filled in, under Team. Scores file against a league, so that's the one thing worth doing first — a team can wait until you want to compare.": "L'onglet Préparation sert aussi à créer une ligue, sous Ligue, et à remplir une liste des joueurs, sous Équipe. Les pointages sont rattachés à une ligue : c'est donc la seule chose à faire d'abord — l'équipe peut attendre que vous vouliez vous comparer.",
"Stats and trends": "Stats et tendances",
"Stats breaks your bowling down by ball, by game, by center and by team. The Trends chip charts any of it over time, and the eye on any card hides it.": "L'onglet Stats décortique votre jeu par boule, par partie, par salle et par équipe. Le bouton Suivi trace l'évolution de n'importe laquelle de ces données au fil du temps, et l'icône d'œil sur chaque carte la masque.",
"Your journey": "Votre parcours",
"Your road so far: every first, dated, and how close you are to the next one — a few pins from a 700 series, say. Badges collect beside them.": "Votre chemin jusqu'ici : chacune de vos premières fois, avec sa date, et à quel point vous êtes près de la prochaine — à quelques quilles d'un triple de 700, par exemple. Les badges s'accumulent juste à côté.",
"Calendar and journal": "Agenda et journal",
"History keeps every night you've bowled, on a calendar you can scroll back through. The journal gathers every note you've written — on a shot, a drill, a pattern or the end of a night — and you can search them, or filter by kind and date range.": "L'Historique conserve chaque soirée où vous avez joué, dans un calendrier que vous pouvez faire défiler vers le passé. Le journal regroupe toutes les notes que vous avez écrites — sur un lancer, un exercice, un patron d'huilage ou la fin d'une soirée — et vous pouvez y faire une recherche ou les filtrer par type et par période.",
"That's enough for now": "C'est assez pour l'instant",
"You know your way around. If you want more, the settings menu has the rest — keeping score, bowling a tournament, what the AI does, stats, and coaching.": "Vous savez maintenant vous y retrouver. Pour aller plus loin, le menu des paramètres contient le reste — tenir le pointage, jouer un tournoi, ce que fait l'IA, les stats et le suivi avec un entraîneur.",
"By game": "Par partie",
"The quickest way in. Type the score for each game and you're done — three numbers, a night logged. Your average, highs and trends all work from this alone.": "La façon la plus rapide de commencer. Entrez le pointage de chaque partie et c'est tout — trois nombres, une soirée enregistrée. Votre moyenne, vos meilleurs résultats et vos tendances se calculent à partir de ces seuls pointages.",
"A strike": "Un abat",
"Going ball by ball, tap Strike and the frame is finished — no pins to pick. Add how it hit if you want it: flush, high, light, a messenger, a Brooklyn.": "En mode lancer par lancer, touchez Abat et le carreau est terminé — aucune quille à choisir. Ajoutez comment la boule a frappé si vous le voulez : en plein dans la poche, coup plein, coup mince, quille messagère, coup croisé.",
"A spare": "Une réserve",
"Tap the pins you left standing, then answer Spare Made. Yes closes the frame. The pins you tap are what feeds your leave and conversion numbers later.": "Touchez les quilles restées debout, puis répondez à « Réserve réussie ». Oui ferme le carreau. Les quilles que vous touchez alimentent ensuite vos statistiques de quilles restantes et de réserves réussies.",
"An open frame": "Un carreau ouvert",
"Same start — tap what was standing — then answer No, and tap which of those pins you knocked down. None of them? Just save. The app works out the count.": "Même début — touchez les quilles restées debout — puis répondez Non, et touchez celles que vous avez abattues. Aucune? Enregistrez, tout simplement. L'application fait le calcul.",
"How the night went": "Le bilan de la soirée",
"The Results chip closes the session: games, series, how it compared to your average, and anything you won. Tap it when you're done and the night is filed.": "Le bouton Résultats clôt la soirée : parties, triple, comparaison avec votre moyenne et tout ce que vous avez gagné. Touchez-le quand vous avez terminé, et la soirée est archivée.",
"Setting up an event": "Configurer un événement",
"Pick Tournament on Home and Set up asks what the event is: its name and center, then Style, Scoring and Format. Those three are separate questions, so any mix works — a Baker squad can be handicapped and 9 pin no-tap at once. A handicap event then asks for your pins per game.": "Choisissez Tournoi à l'écran Accueil, et la section Préparation vous demande de quel événement il s'agit : son nom et sa salle de quilles, puis Style, Pointage et Format. Ce sont trois questions distinctes, donc toutes les combinaisons fonctionnent — une escouade Baker peut être à la fois avec handicap et en abat à 9 quilles. Un événement avec handicap vous demande ensuite votre handicap en quilles par partie.",
"Add a block for each day or squad and they become tabs under Scoring. Enter the cut as it's posted — plus or minus against a 200 average — and the app tells you where you stand against it, carrying your earlier blocks in once there's more than one.": "Ajoutez un bloc pour chaque journée ou chaque escouade, et ils deviennent des onglets sous Pointage. Entrez le seuil de qualification tel qu'il est affiché — en plus ou en moins par rapport à une moyenne de 200 — et l'application vous indique où vous vous situez par rapport à ce seuil, en cumulant vos blocs précédents dès qu'il y en a plus d'un.",
"Making the cut": "Se qualifier",
"The app never asks whether you made it: the margin already says. What it can't work out is what came next, so each block asks what you qualified for — match play, a stepladder, or neither — and gives you a button straight to it.": "L'application ne vous demande jamais si vous avez franchi le seuil : la marge le dit déjà. Ce qu'elle ne peut pas deviner, c'est la suite; chaque bloc vous demande donc à quoi votre qualification vous donne accès — jeu par match, finale à échelons ou ni l'un ni l'autre — et vous donne un bouton pour y aller directement.",
"Each match is your score against an opponent's, with bonus pins for a win or a tie. In a handicap event there's a box for your opponent's handicap too.": "Chaque match oppose votre pointage à celui d'un adversaire, avec des quilles de boni pour une victoire ou une égalité. Dans un événement avec handicap, il y a aussi une case pour le handicap de votre adversaire.",
"The stepladder": "La finale à échelons",
"Sudden death, so no bonus pins — the higher score advances. Enter your seed and each opponent's, and the app works out where you finished from how far you climbed. Beat the one seed and it says you won it.": "Mort subite, donc pas de quilles de boni — le meilleur pointage passe à l'étape suivante. Entrez votre rang de départ et celui de chaque adversaire, et l'application calcule votre position finale selon le nombre d'échelons gravis. Battez la première tête de série et l'application vous annonce votre victoire.",
"How the event went": "Le bilan de l'événement",
"Results recaps the whole event broken out by phase, with your brackets and side pots and what they paid. End tournament and view results saves everything on its way there. The Nightcap reads the night back to you, and the share button hands the lot to whoever asks how you did.": "Résultats récapitule tout l'événement, étape par étape, avec vos tableaux, vos cagnottes et ce qu'ils vous ont rapporté. « Terminer le tournoi et voir les résultats » enregistre tout au passage. Le Nightcap vous fait le récit de la soirée, et le bouton de partage envoie le tout à quiconque vous demande comment ça s'est passé.",
"Photograph the scorecard": "Photographier la feuille de pointage",
"Import, in the header, takes a picture of the monitor or a printed sheet. Every bowler on it, every frame it can read — no typing. It asks what you're importing, so you don't have to set the night up first.": "Importer, dans l'en-tête, prend en photo l'écran de pointage ou une feuille imprimée. Chaque personne qui y figure, chaque carreau lisible — sans rien taper. L'application vous demande ce que vous importez, alors pas besoin de configurer la soirée d'abord.",
"Improve reads your own history and tells you what it finds — which ball is carrying, where a spare is leaking, what changed this month. Each one says how confident it is, and while the sample is still small it says so rather than letting you act on a pattern that is really just noise.": "Progresser lit votre propre historique et vous dit ce qu'il y trouve — quelle boule fait tomber les quilles, où des réserves vous échappent, ce qui a changé ce mois-ci. Chaque analyse indique son degré de confiance, et tant que l'échantillon est encore petit, elle le dit plutôt que de vous laisser agir sur une tendance qui n'est en fait que du hasard.",
"The Nightcap": "Le Nightcap",
"On a league or tournament Results screen, the Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Log the night ball by ball and it pours itself once the night is saved.": "À l'écran Résultats d'une soirée de ligue ou d'un tournoi, le Nightcap, votre bilan de fin de soirée, vous la raconte — quelles quilles restaient debout, ce que les carreaux ouverts vous ont coûté, quelle boule faisait tomber les quilles. Notez chaque lancer, et il vous est servi automatiquement une fois la soirée sauvegardée.",
"Ask Brooklyn": "Demandez à Brooklyn",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. Her lamp sits in the header on every screen, so you never have to go looking. Three wishes a day.": "Les écrans Stats couvrent les chiffres habituels. Brooklyn est là pour les questions auxquelles ils ne répondent pas — posez vos questions sur votre propre jeu en termes simples, et elle trouve la réponse à partir de ce que vous avez enregistré. Si elle a besoin de quelque chose que vous ne suivez pas encore, elle vous dira quoi commencer à enregistrer. Sa lampe se trouve dans l'en-tête de chaque écran, alors vous n'avez jamais à la chercher. Trois vœux par jour.",
"Linking up": "Jumelage",
"Improve has a Coach button. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "Progresser comporte un bouton Entraîneur. Indiquez dans quel sens ça va — « Je suis l'élève » ou « Je l'entraîne » — et créez un code. Dictez les huit caractères à l'autre personne, elle l'entre sur son propre téléphone, et le lien est établi.",
"Both sides, one screen": "Les deux rôles, un seul écran",
"If you do both, the View chips flip between them: I'm bowling shows what your own coach has sent you, I'm coaching shows your bowlers. A coach sees their pupils' scores without having to add them as a friend, and either of you can end it from your own phone.": "Si vous faites les deux, les boutons Affichage permettent de passer de l'un à l'autre : « Je joue » montre ce que votre entraîneur vous a envoyé, « J'entraîne » montre vos élèves. L'entraîneur ou l'entraîneuse voit les pointages de ses élèves sans avoir à les ajouter comme amis, et chacun de vous peut mettre fin au lien depuis son propre téléphone.",
"Reading a bowler": "Analyser le jeu d'un élève",
"Pick a bowler and you get their recent nights and how their shots break down — strikes, spares, the leaves that keep coming back — with the number of shots it's built on shown beside it, so you know how much to trust it.": "Choisissez un élève et vous voyez ses dernières soirées et la répartition de ses lancers — abats, réserves, les quilles restantes qui reviennent sans cesse — avec, à côté, le nombre de lancers sur lequel c'est fondé, pour savoir à quel point vous y fier.",
"Setting work": "Assigner des tâches",
"A task is something to go and do, with an optional measurable target and a due date — convert 60% of your single-pin spares, say. Leave the target off for anything that isn't a number.": "Une tâche, c'est quelque chose à aller faire, avec un objectif mesurable facultatif et une date d'échéance — réussir 60% de vos réserves d'une quille, par exemple. Laissez l'objectif vide pour tout ce qui ne se mesure pas en chiffres.",
"Answering back": "Donner suite",
"The bowler marks it done, or records an attempt with the number they actually reached and a note about how it went. Either way it comes back to the coach, so the next thing you set is based on what happened rather than what was asked for.": "L'élève indique que c'est fait, ou enregistre une tentative avec le nombre réellement atteint et une note sur le déroulement. Dans les deux cas, l'entraîneur reçoit le retour, et la prochaine tâche que vous assignez repose sur ce qui s'est passé plutôt que sur ce qui avait été demandé.",
"Break it down": "Tout décortiquer",
"The chips across the top slice the same numbers different ways — yours, your team's, by ball, by game, by center.": "Les boutons en haut découpent les mêmes chiffres de différentes façons — les vôtres, ceux de votre équipe, par boule, par partie, par salle de quilles.",
"Compare": "Comparer",
"Put yourself beside a teammate, or against the team as a whole. Same measures, same scale.": "Comparez-vous à un membre de l'équipe ou à l'équipe dans son ensemble. Mêmes mesures, même échelle.",
"When there isn't much data yet": "Quand il y a encore peu de données",
"Nothing is locked — every card shows its numbers. But a number built on a handful of shots moves more with luck than with you, so until there's enough behind it the card is faded and says how many more shots it needs to be reliable.": "Rien n'est verrouillé — chaque carte affiche ses chiffres. Mais un chiffre fondé sur une poignée de lancers dépend plus de la chance que de vous; tant qu'il n'y a pas assez de données derrière, la carte est estompée et indique combien de lancers il lui faut encore pour être fiable.",
"The trend graph": "Le graphique des tendances",
"Pick the measure, the ball and the league from the three dropdowns, then choose how far back to look — a number of games, a number of days, or two dates. Every game, or one point per night.": "Choisissez la mesure, la boule et la ligue dans les trois menus déroulants, puis la période à afficher — un nombre de parties, un nombre de jours ou deux dates. Chaque partie, ou un point par soirée.",
"Look around": "Faire le tour",
"What's behind each tab": "Ce que contient chaque onglet",
"By game, or ball by ball": "Par partie, ou lancer par lancer",
"Bowling a tournament": "Jouer un tournoi",
"Blocks, the cut, match play, the ladder": "Blocs, qualification, jeu par match, finale à échelons",
"What the AI does": "Ce que fait l'IA",
"Scorecards, insights, Nightcap, Brooklyn": "Feuilles de pointage, analyses, Nightcap, Brooklyn",
"Breakdowns, comparing, trends": "Répartitions, comparaisons, tendances",
"Linking up, tasks, what comes back": "Jumelage, tâches, retours",
"Your pins, as bowled.": "Vos quilles abattues, telles quelles.",
"Pins added to every game.": "Des quilles ajoutées à chaque partie.",
"You bowl the whole game.": "Vous jouez toute la partie.",
"You and a partner alternate frames.": "Vous alternez les carreaux avec votre partenaire.",
"I start": "Moi d'abord",
"Partner starts": "Partenaire d'abord",
"you and your partner": "vous et votre partenaire",
"Your own frames still count toward strikes, spares and how each ball carried.": "Vos propres carreaux comptent quand même dans les abats, les réserves et l'efficacité de chaque boule.",
"Average score per night.": "Pointage moyen par soirée.",
"Best Game": "Meilleure partie",
"Your best single game each night.": "Votre meilleure partie de chaque soirée.",
"Series Total": "Total du triple",
"Total pins each night.": "Total des quilles abattues par soirée.",
"First game each night.": "Première partie de chaque soirée.",
"Second game each night.": "Deuxième partie de chaque soirée.",
"Third game each night.": "Troisième partie de chaque soirée.",
"Share of first balls that struck, per night.": "Proportion des premiers lancers qui ont donné un abat, par soirée.",
"Non-split spare conversion, per night.": "Conversion des réserves (hors écarts), par soirée.",
"Conversion on a lone corner pin, per night.": "Conversion d'une quille de coin isolée, par soirée.",
"Frames closed with a strike or spare, per night.": "Carreaux fermés par un abat ou une réserve, par soirée.",
"No clear direction — the movement here is within normal night-to-night variation.": "Aucune tendance claire — la variation reste dans les fluctuations normales d'une soirée à l'autre.",
"Days": "Jours",
"the start": "le début",
"Drill": "Exercice",
"Name it (optional)": "Nom (facultatif)",
"Pins (optional)": "Quilles (facultatif)",
"No ball recorded": "Aucune boule indiquée",
"· last time": "· dernière fois :",
"✓ Made": "✓ Réussi",
"✗ Missed": "✗ Raté",
"Undo last": "Annuler le dernier",
"Shot notes — what worked on this drill…": "Notes sur les lancers — ce qui a fonctionné pendant cet exercice…",
"✓ Drill Saved": "✓ Exercice enregistré",
"Throw a few first": "Faites quelques lancers d'abord",
"+ Start another drill": "+ Commencer un autre exercice",
"Saved tonight": "Enregistrés ce soir",
"This screen hit a problem": "Cet écran a rencontré un problème",
"Your data is safe — nothing was lost. The rest of the app still works, so you can switch to another tab.": "Vos données sont en sécurité — rien n'a été perdu. Le reste de l'application fonctionne toujours, vous pouvez donc passer à un autre onglet.",
"Try again": "Réessayer",
"Copy details": "Copier les détails",
"Unknown": "Inconnu",
"Loading friends…": "Chargement des amis…",
"Add a Friend": "Ajouter des amis",
"Search by name…": "Rechercher par nom…",
"No one found with that name.": "Aucun résultat pour ce nom.",
"Share Sign-In Link": "Partager le lien de connexion",
"A quick way to hand someone the app link — scanning this just opens the sign-in screen. It doesn't log anyone in as anyone; each person still enters their own email.": "Une façon rapide de donner le lien de l'application à quelqu'un — balayer ce code ouvre simplement l'écran de connexion. Ça ne connecte personne au compte de quelqu'un d'autre; chaque personne entre toujours sa propre adresse courriel.",
"QR code to sign-in page": "Code QR vers la page de connexion",
"Sent": "Envoyées",
"No friends yet — search above to add someone.": "Aucun ami pour l'instant — faites une recherche ci-dessus pour ajouter quelqu'un.",
"⚠️ Your games aren't attributed to your account": "⚠️ Vos parties ne sont pas associées à votre compte",
"Your account's display name doesn't match the bowler name your sessions are logged under. Set your name in Teams to fix this.": "Le nom affiché de votre compte ne correspond pas au nom de joueur sous lequel vos séances sont enregistrées. Indiquez votre nom dans l'onglet Équipe pour corriger le problème.",
"✓ reached": "✓ atteint",
"Not enough data yet —": "Pas encore assez de données —",
"before this is worth reporting.": "avant que le résultat soit significatif.",
"Nothing logged for this yet.": "Rien d'enregistré pour l'instant.",
"Now:": "Actuel :",
"Target met": "Objectif atteint",
"Pick a statistic first.": "Choisissez d'abord une statistique.",
"Enter a number.": "Entrez un nombre.",
"Goals": "Objectifs",
"Set a target for a statistic you're working on and track progress against it.": "Fixez une cible pour une statistique sur laquelle vous travaillez et suivez votre progression.",
"+ Add a goal": "+ Ajouter un objectif",
"You've set a goal for every statistic available.": "Vous avez fixé un objectif pour chaque statistique disponible.",
"Statistic": "Statistique",
"Choose one…": "Choisir…",
"Needs": "Il faut",
"before progress is shown.": "avant que la progression s'affiche.",
"Google signed in but didn't return an ID token. This usually means": "Google a confirmé la connexion, mais n'a pas renvoyé de jeton d'identification. Cela signifie généralement que",
"the sign-in wasn't configured for online mode.": "la connexion n'a pas été configurée pour le mode en ligne.",
"Couldn't sign in with Google. Check your connection and try again.": "Impossible de se connecter avec Google. Vérifiez votre connexion Internet et réessayez.",
"Menu": "Menu",
"Search help…": "Rechercher dans l'aide…",
"Search help": "Rechercher dans l'aide",
"Search": "Rechercher",
"Name, hand, style, home centers": "Nom, main, style, salles de quilles habituelles",
"Theme, stats cards, account": "Thème, cartes de stats, compte",
"Search help — try 'buy-in' or 'prebowl'": "Rechercher dans l'aide — essayez « mise » ou « jouer à l'avance »",
"Show me around the app again": "Refaire la visite de l'application",
"Nothing matched \"": "Aucun résultat pour « ",
"\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".": " ». Essayez un mot qui figure dans l'application — « réserve », « équipe », « boule », « importer ».",
"This season": "Cette saison",
"Your career": "Votre carrière",
"League season": "Saison de ligue",
"Between seasons": "Entre deux saisons",
"All league play": "Toutes les parties de ligue",
"this season": "cette saison",
"No games yet": "Aucune partie pour l'instant",
"Your bowling": "Votre jeu",
"League average": "Moyenne de ligue",
"High game": "Meilleure partie",
"High series": "Meilleur triple",
"Open full statistics": "Voir toutes les statistiques",
"My Bowling Journey": "My Bowling Journey",
"Your milestones and progress": "Vos jalons et vos progrès",
"Latest milestone": "Dernier jalon",
"milestone": "jalon",
"so far": "jusqu'à maintenant",
"Next ·": "À venir ·",
"Progress to next milestone": "Progression vers le prochain jalon",
"Your bowling story starts here.": "Votre histoire aux quilles commence ici.",
"What are you doing today?": "Que faites-vous aujourd'hui?",
"Latest ·": "Dernière ·",
"That file could not be read.": "Ce fichier n'a pas pu être lu.",
"Import cancelled. Nothing was saved.": "Importation annulée. Rien n'a été enregistré.",
"Nothing to import.": "Rien à importer.",
"Import scores from a file": "Importer des pointages à partir d'un fichier",
"A CSV with four columns:": "Un fichier CSV à quatre colonnes :",
". Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.": ". Les dates s'écrivent comme 2026-09-17, les pointages sont des nombres entiers de 0 à 300, et une soirée peut compter une, deux ou trois parties.",
"Import into": "Importer dans",
"Imported (no league)": "Importé (sans ligue)",
"Leave it as Imported if these nights don't belong to a league you track.": "Laissez « Importé » si ces soirées ne font partie d'aucune ligue que vous suivez.",
"What would import": "Ce qui serait importé",
"row": "ligne",
"skipped": "ignorée(s)",
"Rows that can't be imported": "Lignes impossibles à importer",
"Row": "Ligne",
"and": "et",
"you already have": "que vous avez déjà",
"Replace those nights": "Remplacer ces soirées",
"Keep mine, import the other": "Garder les miennes, importer les autres :",
"Cancel the import": "Annuler l'importation",
"Importing…": "Importation…",
"Imported from a teammate's scorecard photo. These are already counting — confirming just marks them checked.": "Pointages importés à partir de la photo d'une feuille de pointage prise par un membre de l'équipe. Ils comptent déjà — les confirmer ne fait que les marquer comme vérifiés.",
"Scores read": "Pointages lus",
"Frame-by-frame data included for": "Données carreau par carreau incluses pour",
"— confirming adds it to your shot history.": "— en confirmant, vous les ajoutez à votre historique de lancers.",
"These are right": "C'est exact",
"Fix them": "Corriger",
"What were they actually?": "Quels étaient les vrais pointages?",
"Save corrections": "Enregistrer les corrections",
"None of these are mine": "Ce ne sont pas les miens",
"Needs You": "À traiter",
"Open ›": "Ouvrir ›",
"You were added to the roster as": "Vous faites maintenant partie de la liste des joueurs en tant que",
"a member": "membre",
". Teammates will be able to import your scores from a scorecard photo — you still confirm them.": ". Les membres de l'équipe pourront importer vos pointages à partir d'une photo de feuille de pointage — c'est quand même vous qui les confirmez.",
"Joining…": "Ajout en cours…",
"Join team": "Rejoindre l'équipe",
"Invitation": "Invitation",
"Invitations": "Invitations",
"Scores To Check": "Pointages à vérifier",
"imported by a teammate.": "importée(s) par un membre de l'équipe.",
"Needs Re-entering": "À saisir de nouveau",
"You said these weren't yours, so they've stopped counting. Enter them on the Log tab when you have them.": "Vous avez indiqué que ces pointages n'étaient pas les vôtres; ils ne comptent donc plus. Saisissez-les dans l'onglet Jouer quand vous les aurez.",
"Waiting On Teammates": "En attente de l'équipe",
"These haven't been confirmed and a session has since finished. You can correct them if you know the real scores.": "Ces pointages n'ont pas été confirmés et une soirée a pris fin depuis. Vous pouvez les corriger si vous connaissez les vrais pointages.",
"Correct these": "Corriger",
"Couldn't read that scorecard right now. Try again in a few minutes, or enter the scores by hand.": "Impossible de lire cette feuille de pointage pour le moment. Réessayez dans quelques minutes ou entrez les pointages à la main.",
"No": "Non",
"Which pins did the second ball knock down?": "Quelles quilles le deuxième lancer a-t-il abattues?",
"this frame": "dans ce carreau",
"Game": "Partie",
"No frame-by-frame detail on this scorecard — importing the game score only.": "Aucun détail carreau par carreau sur cette feuille de pointage — seul le pointage de la partie sera importé.",
"Score": "Pointage",
"That isn't a possible game score — type the real one.": "Ce pointage est impossible pour une partie — entrez le vrai.",
"fill ball": "lancer",
"below couldn't be reliably read from the image -- please double-check the pin count.": "supplémentaire(s) ci-dessous : lecture incertaine sur l'image -- veuillez vérifier le nombre de quilles.",
"Tap a frame to fix what was read.": "Touchez un carreau pour corriger ce qui a été lu.",
"· fill ball — pick a result": "· lancer supplémentaire — choisissez un résultat",
"What are you importing?": "Qu'importez-vous?",
"Which team?": "Quelle équipe?",
"No teams yet — add one under a league in Team, then import.": "Aucune équipe pour l'instant — ajoutez-en une sous une ligue dans Équipe, puis importez.",
"Which tournament?": "Quel tournoi?",
"No tournaments yet — start one on the Bowl tab first.": "Aucun tournoi pour l'instant — commencez-en un d'abord dans l'onglet Jouer.",
"Filed as practice — no league or team needed.": "Classé comme entraînement — aucune ligue ni équipe requise.",
"Date": "Date",
"Couldn't read one of the selected images.": "Impossible de lire l'une des images sélectionnées.",
"Couldn't read the selected images.": "Impossible de lire les images sélectionnées.",
"The import took too long and was stopped. Try one image at a time.": "L'importation a pris trop de temps et a été arrêtée. Essayez une image à la fois.",
"a Lite model cannot be trusted with pin identities": "",
"frames did not match the printed total": "",
"saw frame detail but read none": "",
"read no frames": "",
"no response": "",
"timed out": "",
"no frames": "",
", mismatched": "",
"The scorecard reader is busy right now — this happens at peak times and usually clears within a few minutes.": "Le lecteur de feuilles de pointage est occupé en ce moment — cela arrive aux heures de pointe et se règle habituellement en quelques minutes.",
"Read Frames": "Lire les carreaux",
"Read Scores": "Lire les pointages",
"The scorecard reader's daily allowance is used up. It resets on Google's clock, so this usually means tomorrow — scores typed in by hand save normally in the meantime.": "La limite quotidienne du lecteur de feuilles de pointage est atteinte. Elle est réinitialisée selon l'horloge de Google, donc habituellement demain — les pointages entrés à la main s'enregistrent normalement d'ici là.",
"The scorecard reader is briefly over its rate limit. Wait about a minute and try again — nothing is lost.": "Le lecteur de feuilles de pointage a brièvement dépassé sa limite de requêtes. Attendez environ une minute et réessayez — rien n'est perdu.",
"The scorecard reader isn't available right now. Scores typed in by hand save normally in the meantime.": "Le lecteur de feuilles de pointage n'est pas disponible pour le moment. Les pointages entrés à la main s'enregistrent normalement d'ici là.",
"Couldn't reach the scorecard reader. Check your signal, or try one image at a time —": "Impossible de joindre le lecteur de feuilles de pointage. Vérifiez votre signal, ou essayez une image à la fois —",
"a large photo can take too long to send.": "une photo volumineuse peut être trop longue à envoyer.",
"No games could be read from the image(s). Try a clearer screenshot.": "Aucune partie n'a pu être lue dans les images. Essayez une capture d'écran plus nette.",
"Found games but couldn't read any scores or frame detail. Try a clearer screenshot.": "Des parties ont été trouvées, mais aucun pointage ni détail des carreaux n'a pu être lu. Essayez une capture d'écran plus nette.",
"Frames you already have will be skipped, so nothing gets double-counted. Anything new on this card still comes in. Continue?": "Les carreaux que vous avez déjà seront ignorés, pour que rien ne soit compté en double. Tout ce qui est nouveau sur cette feuille sera quand même importé. Continuer?",
"Nothing was mapped to you on this card.": "Rien ne vous a été associé sur cette feuille.",
"What's on the card?": "Que contient la feuille?",
"Game scores": "Pointages des parties",
"Frame by frame": "Carreau par carreau",
"Reads each game's score. Fastest. If the card turns out to show frames, they get read too.": "Lit le pointage de chaque partie. Le plus rapide. Si la feuille montre aussi les carreaux, ils sont lus eux aussi.",
"Reads every ball and the pins it left. Slower, and leaves can come back wrong — you'll see each frame as a scoresheet to fix before saving.": "Lit chaque lancer et les quilles restantes. Plus lent, et les quilles restantes peuvent être mal lues — vous verrez chaque carreau sous forme de feuille de pointage à corriger avant d'enregistrer.",
"Scorecard Screenshot": "Photo de la feuille de pointage",
"Clear all": "Tout effacer",
"image": "image",
"Nothing's broken — just busy": "Rien n'est en panne — le service est simplement occupé",
"Reading the scorecard…": "Lecture de la feuille de pointage…",
"This can take a minute or two — every frame is read individually.": "Cela peut prendre une minute ou deux — chaque carreau est lu individuellement.",
"Keep this screen open until it finishes.": "Gardez cet écran ouvert jusqu'à la fin.",
"Who's who": "Qui est qui",
"bowler": "joueur",
"read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.": "sur la feuille. Confirmez chaque correspondance avant tout enregistrement — une erreur d'association inscrirait la partie d'une personne dans le dossier d'une autre.",
"frame tracking": "suivi par carreau",
"scores only": "pointages seulement",
"no detail": "aucun détail",
"series": "triple",
"· combined from": "· fusion de",
"images": "images",
"Games add to": "Les parties totalisent",
"but the card's scratch series is": "mais le triple sans handicap indiqué sur la feuille est de",
". One of the games was misread — check the card.": ". L'une des parties a été mal lue — vérifiez la feuille.",
"Skip this bowler": "Ignorer cette personne",
"Add \"": "Ajouter « ",
"\" as a new bowler": " » comme nouveau joueur",
"More than one bowler matches this name equally — pick the right one.": "Plusieurs personnes correspondent également bien à ce nom — choisissez la bonne.",
"Matched on the alias \"": "Correspondance établie grâce à l'alias « ",
"Roster order": "Ordre de la liste des joueurs",
"The card's order doesn't match your team roster. Names still matched correctly — but if the roster is wrong, position hints will be wrong for every future import.": "L'ordre de la feuille ne correspond pas à la liste des joueurs de votre équipe. Les noms ont quand même été bien associés — mais si la liste est erronée, les indices de position seront faux pour toutes les importations futures.",
"Card order:": "Ordre sur la feuille :",
"Continue": "Continuer",
"Start Over": "Recommencer",
"nothing was mapped to you on this card.": "rien ne vous a été associé sur cette feuille.",
"check the games below — some came through frame by frame, some as scores only. Correct anything that's wrong, then save.": "vérifiez les parties ci-dessous — certaines sont arrivées carreau par carreau, d'autres en pointages seulement. Corrigez ce qui est erroné, puis enregistrez.",
"Where this goes": "Destination",
"This scorecard": "Cette feuille de pointage",
"check the numbers against the card before saving": "vérifiez les chiffres par rapport à la feuille avant d'enregistrer",
"Also sending to teammates": "Envoi aussi aux membres de l'équipe",
"These go to": "Ces pointages sont envoyés à",
"this bowler": "cette personne",
"these bowlers": "ces personnes",
"to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.": "pour confirmation. Ils comptent tout de suite — la confirmation les marque simplement comme vérifiés. Corrigez toute erreur de lecture avant l'envoi.",
"read as \"": "Nom lu : « ",
"couldn't be read — type the real score, or clear the box if they didn't bowl it.": "illisible(s) — entrez le vrai pointage, ou videz la case d'une partie non jouée.",
"Series": "Triple",
"· card printed": "· sur la feuille :",
"Saving…": "Enregistrement…",
"Pick a result for the fill ball first": "Choisissez d'abord le résultat du lancer supplémentaire",
"Fix the flagged scores first": "Corrigez d'abord les pointages signalés",
"Looks Good — Save": "C'est bon — enregistrer",
"Moderate": "Modérée",
"Tentative": "Provisoire",
"What This Is Based On": "Sur quoi repose cette analyse",
"games. Only statistics with enough data to be meaningful are analysed.": "parties. Seules les statistiques ayant assez de données pour être significatives sont analysées.",
"Ball comparisons unlock as each ball builds up its own sample. They need more than overall stats because comparing two percentages doubles the uncertainty.": "Les comparaisons de boules se débloquent à mesure que chaque boule accumule son propre échantillon. Elles exigent plus de données que les statistiques globales, car comparer deux pourcentages double l'incertitude.",
"You're close on": "Vous approchez du but pour",
"— a couple more nights and it unlocks.": "— encore deux ou trois soirées et ce sera débloqué.",
"Insights": "Analyses",
"Select a bowler on the Log tab first. Insights are about one bowler's game, not everyone's combined.": "Choisissez d'abord un quilleur ou une quilleuse dans l'onglet Jouer. Les analyses portent sur le jeu d'une seule personne, pas sur celui de tout le monde combiné.",
"to go.": "à jouer.",
"Insights need at least": "Les analyses nécessitent au moins",
"games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.": "parties. En deçà, les chiffres varient trop d'une soirée à l'autre pour en tirer quoi que ce soit de fiable — vous obtiendriez des tendances qui ont l'air sûres, mais qui ne sont en fait que du bruit.",
"You have": "Vous avez",
"games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.": "parties enregistrées. Rien ne repose encore sur assez de données pour être analysé honnêtement — voici ce qui s'en approche le plus.",
"Based on": "D'après",
"games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.": "parties jusqu'ici. Ces analyses s'affinent à mesure que vous enregistrez — quelques soirées donnent un indice, une saison vous donne de quoi agir.",
"New since last time:": "Nouveau depuis la dernière fois :",
"Dismiss": "Fermer",
"Looks at your logged statistics and reports what stands out. It only uses numbers with enough data behind them, and it reports patterns rather than telling you how to bowl.": "Examine les statistiques que vous avez enregistrées et signale ce qui ressort. Seuls les chiffres appuyés par suffisamment de données sont utilisés, et l'outil décrit des tendances plutôt que de vous dire comment jouer.",
"Analysing…": "Analyse en cours…",
"Analyse My Game": "Analyser mon jeu",
"Try Again": "Réessayer",
"Worth Paying Attention To": "À surveiller",
"Written by AI from the stats you've logged. It can be wrong, and it can sound confident while being wrong — treat it as a starting point for a conversation, not an instruction.": "Rédigé par l'IA à partir des statistiques que vous avez enregistrées. Ce texte peut contenir des erreurs, et il peut paraître convaincu même quand il se trompe — voyez-le comme un point de départ pour une discussion, pas comme une consigne.",
"You're working with": "Vous travaillez avec",
"a coach": "un entraîneur ou une entraîneuse",
"— worth talking this through with them before changing anything. They can see what these numbers can't.": "— parlez-en avec cette personne avant de changer quoi que ce soit. Elle voit ce que ces chiffres ne montrent pas.",
"Run Again": "Relancer",
"Night": "Soirée",
"Pattern": "Patron",
"Shot": "Lancer",
"Nothing written yet. Notes you add to a shot, a drill or the end of a night all collect here, so you can look back at what you were working on and what you said about it.": "Rien d'écrit pour l'instant. Les notes que vous ajoutez à un lancer, à un exercice ou à la fin d'une soirée se retrouvent toutes ici, pour que vous puissiez revoir ce sur quoi vous travailliez et ce que vous en disiez.",
"Search your notes…": "Rechercher dans vos notes…",
"Filters": "Filtres",
"Filter": "Filtrer",
"Kind": "Type",
"Dates": "Dates",
"From date": "Date de début",
"To date": "Date de fin",
"in that range": "dans cette période",
"Nothing written in that range.": "Rien d'écrit dans cette période.",
"The road starts with your first night": "La route commence avec votre première soirée",
"Badges": "Badges",
"pins down": "quilles abattues",
"Up next": "Prochaines étapes",
"Your bowling milestones, newest first": "Vos jalons aux quilles, du plus récent au plus ancien",
"LATEST": "DERNIER",
"Your road starts here": "Votre route commence ici",
"Log a night and your first milestones land on the road with the date you did them — first strike, first spare, first 100.": "Enregistrez une soirée et vos premiers jalons s'inscriront sur la route avec la date où vous les avez atteints — premier abat, première réserve, premier 100.",
"The road so far": "La route jusqu'ici",
"newest first": "plus récents en premier",
"What you've collected along the way": "Ce que vous avez récolté en chemin",
"Your active league": "Votre ligue active",
"The free plan follows this league.": "Le forfait gratuit suit cette ligue.",
"Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.": "Changer de ligue, ou jouer dans plus d'une ligue, fait partie de Pro — et tout ce que vous avez enregistré revient quand vous vous abonnez.",
"Get Pro": "Passer à Pro",
"That league is still syncing. Give it a moment and try again.": "Cette ligue est encore en cours de synchronisation. Attendez un instant et réessayez.",
"Your active league is already chosen. Switching leagues is part of Pro.": "Votre ligue active est déjà choisie. Changer de ligue fait partie de Pro.",
"Could not save that just now. Your leagues are untouched — try again in a minute.": "Impossible d'enregistrer pour le moment. Vos ligues sont intactes — réessayez dans une minute.",
"Choose your active league": "Choisissez votre ligue active",
"A free account follows one league. Pick the one you want to keep bowling with — you choose once, and switching later is part of Pro. The rest are paused, not deleted, and everything you have logged comes back when you subscribe.": "Un compte gratuit suit une seule ligue. Choisissez celle où vous voulez continuer à jouer — vous ne choisissez qu'une fois, et changer plus tard fait partie de Pro. Les autres sont mises en pause, pas supprimées, et tout ce que vous avez enregistré revient quand vous vous abonnez.",
"Active league": "Ligue active",
"Paused:": "En pause :",
". Practice and Just Bowling stay open either way.": ". Les modes Entraînement et Jeu libre restent accessibles dans tous les cas.",
"Keep this league": "Garder cette ligue",
"Saved.": "Enregistré.",
"is your active league.": "est votre ligue active.",
"more ▾": "plus ▾",
"Oil pattern": "Patron d'huilage",
"Which nights": "Quelles soirées",
"Every night": "Toutes les soirées",
"Avg": "Moy.",
"vs your": "contre",
"overall": "de moyenne globale",
"g": "p",
"breakpoint": "rupture",
"Averaged over the night": "Moyenne sur la soirée",
"Show my usual line": "Afficher ma ligne habituelle",
"Follow the transition": "Suivre la transition",
"Position through the block": "Position dans le bloc",
"fresh oil": "huile fraîche",
"end of the block": "fin du bloc",
"Show all": "Tout afficher",
"Hide all": "Tout masquer",
"Nothing on the lane — turn a ball back on.": "Rien sur l'allée — réactivez une boule.",
"on this night": "pendant cette soirée",
"Solid while it skids, dashed once it turns — where it turns comes from the oil pattern rather than from anything you logged.": "Trait plein pendant le glissement, pointillé une fois que la boule tourne — l'endroit où elle tourne dépend du patron d'huilage plutôt que de ce que vous avez enregistré.",
"no pins": "aucune quille",
"Rank leaves by": "Classer les quilles restantes par",
"Top missed": "Échecs",
"Top made": "Réussites",
"Everything else": "Tout le reste",
"Show more": "Afficher plus",
"Collapse all": "Tout réduire",
"Me": "Moi",
"Partner": "Partenaire",
"Nightcap": "Nightcap",
"isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "n'est pas servi lors d'une soirée au système Baker — les carreaux appartiennent au duo, pas à une seule personne.",
"Points Won": "Points gagnés",
"Tap to cycle: not marked → won → lost.": "Touchez pour alterner : non marqué → gagné → perdu.",
"Pinfall": "Quilles abattues",
"of 4 points": "sur 4 points",
"Side Games": "Cagnottes",
"in": "misés",
"Tonight": "Ce soir",
"G": "P",
"If every makeable spare had been made": "Si chaque réserve réalisable avait été convertie",
"Theory": "théorique",
"Theory Series": "Triple théorique",
"pins left on the lane": "quilles laissées sur l'allée",
"✓ Converted every makeable spare": "✓ Toutes les réserves réalisables ont été converties",
"actual vs": "obtenus contre",
"possible)": "possibles)",
"Quarter game": "Partie à 25 sous",
"Dollar game": "Partie à 1 dollar",
"3-6-9 (whole night)": "3-6-9 (toute la soirée)",
"Side games tonight": "Cagnottes ce soir",
"Tap the ones you're in. Buy-ins are saved for": "Touchez celles auxquelles vous participez. Les mises sont enregistrées pour",
"— you won't need to enter them again.": "— vous n'aurez pas à les saisir de nouveau.",
"Buy-in per game": "Mise par partie",
"not playing": "ne participe pas",
"tonight · $": "ce soir · $",
"paid in": "misés",
"Poker Winnings ($)": "Gains au poker ($)",
"High Game Pot ($)": "Cagnotte de la meilleure partie ($)",
"Highest game in the league takes it — enter what you won, if anything.": "La meilleure partie de la ligue la remporte — indiquez ce que vous avez gagné, s'il y a lieu.",
"3-6-9 Winnings ($)": "Gains au 3-6-9 ($)",
"All nine struck — you took it": "Les neuf abats réussis — la cagnotte est à vous",
", and the tenth carried for the jackpot": ", et votre 10e carreau vous donne droit au gros lot",
"Pot": "Cagnotte",
"Jackpot": "Gros lot",
"won tonight": "en gains ce soir",
"✓ Winnings Saved": "✓ Gains enregistrés",
"Save Winnings": "Enregistrer les gains",
"Strike %": "% d'abats",
"Spare %": "% de réserves",
"10 Pins": "Quilles 10",
"Weak 10s": "10 faibles",
"Ringing 10s": "10 isolées",
"Other 10s": "Autres 10",
"Splits": "Écarts",
"Converted": "Convertis",
"Balls used": "Boules utilisées",
"Release Quality": "Qualité du lâcher",
"Good": "Bon",
"Bad": "Mauvais",
"Misses": "Ratés",
"Running Averages": "Moyennes cumulatives",
"Composite": "Globale",
"Share tonight": "Partager la soirée",
"Set up": "Préparation",
"Scoring": "Pointage",
"Side games": "Cagnottes",
"Games": "Parties",
"Tonight's Session": "Soirée en cours",
"✓ Prebowling": "✓ Jouer à l'avance",
"Prebowling for a future week?": "Jouer à l'avance pour une semaine à venir?",
"Opponent": "Adversaire",
"Opponent (e.g. Team Name)": "Équipe adverse",
"Handicap": "Handicap",
"Starting Lane": "Allée de départ",
"e.g. 8": "p. ex. 8",
"Lanes": "Allées",
"Official Pattern": "Patron officiel",
"Length (ft)": "Longueur (pi)",
"Volume (mL)": "Volume (mL)",
"Ratio (e.g. 3:1)": "Rapport (p. ex. 3:1)",
"Lane Conditions": "État des allées",
"This league usually runs": "Patron habituel de cette ligue :",
". Anything you set here is for tonight only.": ". Ce que vous réglez ici ne vaut que pour ce soir.",
"Start Scoring": "Commencer le pointage",
"Cancel League": "Annuler la soirée",
"This deletes tonight's shots, game scores and match points for": "Cette action supprime les lancers, les pointages des parties et les points de match de ce soir pour",
", clears the setup, and takes you back to Home. This cannot be undone.": ", efface la préparation et vous ramène à l'Accueil. Cette action est irréversible.",
"Keep bowling": "Continuer à jouer",
"Delete and exit": "Supprimer et quitter",
"Enter Game Scores": "Saisir les pointages",
"Which bag tonight?": "Quel sac ce soir?",
"All my balls": "Toutes mes boules",
"frames say": "selon les carreaux :",
"Ball…": "Boule…",
"Surface…": "Surface…",
"Delete game": "Supprimer la partie",
"? This removes the score": "? Cela retire le pointage",
"and every frame logged for it": " et tous les carreaux enregistrés pour cette partie",
". It can't be undone.": ". Cette action est irréversible.",
"+ Add game": "+ Ajouter une partie",
"Want to see which spares are costing you?": "Vous voulez voir quelles réserves vous coûtent des points?",
"You've logged a few nights on game tracking. Tracking one game frame by frame turns those into spare conversion, carry and leave patterns. You can switch back whenever you like.": "Vous avez enregistré quelques soirées en suivi par partie. Suivre une partie carreau par carreau transforme ces données en conversion des réserves, en efficacité des abats et en tendances des quilles restantes. Vous pouvez revenir en arrière quand vous le voulez.",
"Try it for a game": "L'essayer pour une partie",
"We love leagues too! 🎳": "Nous aimons aussi les ligues! 🎳",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet — you can add one whenever you like, and tonight's scores will join it.": "Ajoutez la ligue où vous jouez et vous pourrez commencer à saisir des pointages tout de suite. Une équipe n'est pas encore nécessaire — vous pourrez en ajouter une quand vous le voudrez, et les pointages de ce soir s'y ajouteront.",
"Add my league": "Ajouter ma ligue",
"Show me how first": "Montrez-moi d'abord comment faire",
"Want these to count for your team?": "Vous voulez que ces pointages comptent pour votre équipe?",
"Your scores are saved and yours either way. Joining your team — or making one if it's not there yet — puts them on the team sheet as well: standings, side pots and everyone's averages in one place. Everything you've already logged in this league comes with you.": "Vos pointages sont enregistrés et vous appartiennent dans tous les cas. Rejoindre votre équipe — ou la créer si elle n'existe pas encore — les ajoute aussi à la feuille de l'équipe : classement, cagnottes et moyennes de tout le monde au même endroit. Tout ce que vous avez déjà enregistré dans cette ligue vous suit.",
"Add or join my team": "Ajouter ou rejoindre mon équipe",
"Not now": "Pas maintenant",
"Scores above are enough. Frames below add shot and ball data.": "Les pointages ci-dessus suffisent. Les carreaux ci-dessous ajoutent des données sur les lancers et les boules.",
"Shot Context": "Contexte du lancer",
"10th Frame": "10e carreau",
"No bowler selected": "Aucune personne sélectionnée",
"— pick a league above": "— choisissez une ligue ci-dessus",
"Series so far": "Triple jusqu'ici",
"Frame": "Carreau",
"Ball in 10th": "Lancer au 10e",
"Lane": "Allée",
"✏️ Edit the 10th — which ball?": "✏️ Modifier le 10e — quel lancer?",
"Fill": "Suppl.",
"✏️ Editing Shot": "✏️ Modification du lancer",
"Keeping score for": "Pointage tenu pour",
"✓ Also scoring for others": "✓ Aussi pour d'autres personnes",
"Also scoring for others": "Aussi pour d'autres personnes",
"Add someone bowling with you": "Ajouter une personne",
"No teammates on this league's roster yet — add them on the Social tab.": "Aucun membre de l'équipe dans la liste des joueurs de cette ligue pour l'instant — ajoutez-en dans l'onglet Amis.",
"Result": "Résultat",
"Required": "Obligatoire",
"everything else is optional": "le reste est facultatif",
"Other": "Autre",
"Pins Standing": "Quilles debout",
"Gutter": "Dalot",
"9 Pin No-Tap → scored as Strike": "Abat à 9 quilles → compté comme un abat",
"Leave:": "Quilles restantes :",
"· First ball:": "· Premier lancer :",
"Strike Description": "Type d'abat",
"Spare Made": "Réserve réussie",
"Which pins did you knock down?": "Lesquelles sont tombées?",
"Tap the ones that fell. None of them? Just save the shot.": "Touchez celles qui sont tombées. Aucune? Enregistrez simplement le lancer.",
"That's every pin — we'll save this as a spare.": "Toutes les quilles sont tombées — ce lancer sera enregistré comme une réserve.",
"First ball:": "Premier lancer :",
"Second ball:": "Deuxième lancer :",
"Done picking pins — show the rest of the form": "Choix des quilles terminé — afficher le reste du formulaire",
"Clear everyone's game 1 scores?": "Effacer les pointages de la partie 1 pour tout le monde?",
"Later games move down one.": "Les parties suivantes seront décalées d'un rang.",
"Scores": "Pointages",
"Just the final score for each game. Totals add themselves.": "Seulement le pointage final de chaque partie. Les totaux se calculent automatiquement.",
"BOWLER": "JOUEUR",
"Total": "Total",
"Clear game 1 scores": "Effacer les pointages de la partie 1",
"TOTAL": "TOTAL",
"+ Add a game": "+ Ajouter une partie",
"Cancel Open Bowling": "Annuler le jeu libre",
"This deletes tonight's open bowling scores for everyone on the sheet and takes you back to Home. This cannot be undone.": "Les pointages de jeu libre de ce soir seront supprimés pour toutes les personnes sur la feuille, et vous reviendrez à l'Accueil. Cette action est irréversible.",
"Ball Change Reason": "Raison du changement de boule",
"Switched from": "Passage de",
"— why?": "— pourquoi?",
"Optional below this line": "Facultatif sous cette ligne",
"Accessory details": "Détails complémentaires",
"tap to open": "touchez pour ouvrir",
"— pick a ball —": "— choisir —",
"Surface": "Surface",
"Line": "Trajectoire",
"Stand": "Position",
"board #": "planche",
"Hit": "Passage",
"Breakpoint": "Point de rupture",
"On target": "Sur la cible",
"board": "planche",
"of target": "de la cible",
"Release": "Lâcher",
"Speed": "Vitesse",
"Rev rate": "Taux de rotation",
"Axis rot.": "Rot. de l'axe",
"Axis tilt": "Incl. de l'axe",
"Shoes": "Souliers",
"Heel #": "Talon nº",
"Sole #": "Semelle nº",
"Execution": "Exécution",
"repeat(2, minmax(0, 1fr))": "",
"minmax(0, 1fr)": "",
"Miss": "Raté",
"Tap the pins you left standing.": "Touchez les quilles restées debout.",
"Answer \"Spare Made\" above to save.": "Répondez à « Réserve réussie » ci-dessus pour enregistrer.",
"Nothing logged yet tonight. Shoot a game or run a drill and it lands here.": "Rien d'enregistré encore ce soir. Jouez une partie ou faites un exercice, et le résultat s'affichera ici.",
"average": "moyenne",
"strikes": "abats",
"spares": "réserves",
"clean": "carreaux fermés",
"first balls struck": "premiers lancers ont donné un abat",
"Best carry tonight:": "Meilleur taux d'abats ce soir :",
"over": "sur",
"first balls": "premiers lancers",
"Session Notes": "Notes de la soirée",
"How the night went, what to try next time…": "Comment s'est passée la soirée, quoi essayer la prochaine fois…",
"Cancel Practice": "Annuler l'entraînement",
"This deletes today's practice shots and game scores for": "Cette action supprime les lancers d'entraînement et les pointages des parties d'aujourd'hui pour",
"and takes you back to Home. This cannot be undone.": "et vous ramène à l'Accueil. Cette action est irréversible.",
"Keep practicing": "Continuer l'entraînement",
"✓ Updated": "✓ Mis à jour",
"✓ Saved": "✓ Enregistré",
"Update": "Mettre à jour",
"Save Shot": "Enregistrer le lancer",
"Open Bowling": "Jeu libre",
"Enter a score first": "Entrez d'abord un pointage",
"Session": "Séance",
"That sign-in link didn't work — it may have expired. Send yourself a new one.": "Ce lien de connexion n'a pas fonctionné — il a peut-être expiré. Envoyez-vous-en un nouveau.",
"Couldn't finish signing in. Check your connection and try the link again.": "Impossible de finaliser la connexion. Vérifiez votre accès Internet et essayez le lien de nouveau.",
"Couldn't pour the nightcap just then. Tap to try again.": "Impossible de servir le Nightcap pour le moment. Touchez pour réessayer.",
"No signal for this one. It'll still be here when you're back online.": "Aucun signal pour l'instant. Votre Nightcap vous attendra quand vous serez de nouveau en ligne.",
"That nightcap came back in a shape the app couldn't read. Tap to try again.": "Ce Nightcap est revenu dans un format que l'application n'a pas pu lire. Touchez pour réessayer.",
"Nightcap 🥃": "Nightcap 🥃",
"Try tracking frame data next week and we'll have a Nightcap together.": "Essayez d'enregistrer les données de chaque carreau la semaine prochaine, et nous prendrons un Nightcap ensemble.",
"There are": "Il y a",
"things worth saying about tonight.": "choses à souligner à propos de ce soir.",
"The Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Part of the paid plan.": "Le Nightcap (votre bilan de fin de soirée) revient sur votre soirée — où se trouvaient les quilles restantes, ce que les carreaux ouverts vous ont coûté, quelle boule donnait des abats. Offert avec le forfait payant.",
"Pour another": "En servir un autre",
"things were true about tonight. Here are the two or three worth hearing.": "constats sur ce soir. Voici les deux ou trois qui valent la peine d'être entendus.",
"Pour the nightcap": "Servir le Nightcap",
"Reading back the night…": "Retour sur la soirée…",
"first balls across": "premiers lancers en",
"— tonight only.": "— ce soir seulement.",
"Pattern name": "Nom du patron",
"Couldn't search for centers right now.": "Impossible de chercher des salles de quilles pour le moment.",
"Welcome to": "Bienvenue dans",
"Who's bowling?": "Qui joue?",
"Your name goes on your scores and is how teammates find you. The rest sets up the stats correctly — all changeable later.": "Votre nom apparaît sur vos pointages et permet aux membres de votre équipe de vous trouver. Le reste sert à bien configurer les statistiques — tout est modifiable plus tard.",
"Your name": "Votre nom",
"Which hand?": "Quelle main?",
"Right": "Droite",
"Left": "Gauche",
"Style": "Style",
"One-handed": "À une main",
"Two-handed": "À deux mains",
"Where do you bowl?": "Où jouez-vous?",
"(optional)": "(facultatif)",
"Search for a center": "Rechercher une salle de quilles",
"Just a first name is fine.": "Un prénom suffit.",
"Got a team code from your captain?": "Vous avez reçu un code d'équipe de votre capitaine?",
"Team code": "Code d'équipe",
"ABCD-EFGH": "ABCD-EFGH",
"Puts you straight onto your team, with anything they've already logged for you.": "Vous ajoute directement à votre équipe, avec tout ce que l'équipe a déjà enregistré pour vous.",
"Do you coach other bowlers?": "Entraînez-vous d'autres quilleurs ou quilleuses?",
"Turns on the roster for tracking who you coach.": "Active la liste de vos élèves pour faire le suivi des personnes que vous entraînez.",
"Start Bowling": "Commencer à jouer",
"‹ Back to History": "‹ Retour à l'historique",
"No game scores were saved for this night, so there are no results to show.": "Aucun pointage de partie n'a été enregistré pour cette soirée, il n'y a donc aucun résultat à afficher.",
"Suggested new book average:": "Nouvelle moyenne établie suggérée :",
"Change the number below if this doesn't match your full season.": "Modifiez le nombre ci-dessous s'il ne correspond pas à votre saison complète.",
"Update to": "Remplacer par",
"Not Now": "Plus tard",
"Add a bowler on the Log tab first — profiles are per bowler.": "Ajoutez d'abord un quilleur ou une quilleuse dans l'onglet Jouer — chaque personne a son propre profil.",
"Your Name": "Votre nom",
"(not set)": "(non défini)",
"Scorecard Names": "Noms sur la feuille de pointage",
"None": "Aucun",
"How your name shows up on the screens at your center — \"R. Nadon\", \"RYAN N\", a nickname. Adding these lets a scorecard photo find you instead of asking every time.": "La façon dont votre nom apparaît sur les écrans de votre salle de quilles — « R. Nadon », « RYAN N », un surnom. Si vous les ajoutez, l'application pourra vous repérer sur la photo d'une feuille de pointage au lieu de vous le demander chaque fois.",
"e.g. R. Nadon": "p. ex. R. Nadon",
"This is what teammates see when they search for you or view the roster — it defaults to your email prefix until you set it.": "C'est ce que voient les membres de l'équipe quand ils vous cherchent ou consultent la liste des joueurs — par défaut, c'est la partie de votre adresse courriel avant le @, jusqu'à ce que vous le changiez.",
", backup": ", effet inversé",
"Handedness": "Main dominante",
"A lefty's corner pin is the 7, not the 10 — this flips the result chips on the Log tab to match.": "Pour une personne gauchère, la quille de coin est la 7, et non la 10 — ce réglage inverse les boutons de résultat de l'onglet Jouer en conséquence.",
"Right-handed": "Droitier",
"Left-handed": "Gaucher",
"Strike ball": "Boule d'abat",
"A backup ball goes out to the": "Une boule à effet inversé part vers la",
"and hooks back, so your corner pin is the": "et revient en crochet : votre quille de coin est donc la",
"and your pocket is the": "et votre poche, la",
". Turning this on flips every leave, split and lane drawing to match — you are still": ". Activer cette option inverse aussi chaque dessin de quilles restantes, d'écart et d'allée — l'application vous considère toujours comme jouant de la main",
"-handed everywhere it says so.": " partout où c'est indiqué.",
"I throw a backup ball": "Je lance une boule à effet inversé",
"Delivery": "Lancer",
"Two-handed and no-thumb players are who the 2LS drilling layout system is built for.": "Le système de disposition de perçage 2LS est conçu pour le jeu à deux mains ou sans pouce.",
"Two-handed / no thumb": "À deux mains / sans pouce",
"Drift (boards)": "Dérive (planches)",
"Boards between where you start and where you slide, counting toward the middle.": "Nombre de planches entre votre point de départ et votre point de glissade, compté vers le centre.",
"Lateral offset (boards)": "Décalage latéral (planches)",
"How far outside your slide the ball lays down. Usually 4 to 8 one-handed, less two-handed.": "Distance, vers l'extérieur de votre glissade, à laquelle la boule se pose. Habituellement de 4 à 8 à une main, moins à deux mains.",
"Not coaching": "Aucun élève",
"Turn this on if you coach other bowlers. It adds a view that shows their tasks and notes instead of your own game.": "Activez cette option si vous entraînez d'autres quilleurs ou quilleuses. Elle ajoute une vue qui affiche leurs tâches et leurs notes plutôt que votre propre jeu.",
"I bowl": "Je joue",
"I coach": "J'entraîne",
"Your league": "Votre ligue",
"season wrapped up": ": saison terminée",
"Not enough games logged here yet to suggest a new number": "Pas encore assez de parties enregistrées ici pour suggérer une nouvelle valeur",
". You can still update it yourself below, or skip for now.": ". Vous pouvez tout de même la mettre à jour vous-même ci-dessous, ou passer pour l'instant.",
"Skip — I'll update it myself": "Passer — je la mettrai à jour moi-même",
"Book Average": "Moyenne établie",
"Not set": "Non définie",
"A static number from last season — the app never changes this on its own. When a league's season ends, you'll be prompted here to update it, with a suggested number you can accept or override.": "Un nombre fixe de la saison dernière — l'application ne le modifie jamais d'elle-même. À la fin de la saison d'une ligue, on vous invitera ici à le mettre à jour, avec un nombre suggéré que vous pourrez accepter ou remplacer.",
"e.g. 213": "p. ex. 213",
"over how many games": "sur combien de parties",
"Season (e.g. 2025-26 Winter)": "Saison (p. ex. Hiver 2025-26)",
"Your best ever": "Vos meilleurs résultats à vie",
"Including before you started using the app. We'll tell you when you beat them.": "Y compris ceux d'avant l'application. Nous vous le dirons quand vous les battrez.",
"Home Centers": "Salles de quilles habituelles",
"None yet": "Aucune pour l'instant",
"The houses this bowler plays regularly. Looked up so they match the same centers your leagues use.": "Les salles de quilles fréquentées régulièrement. Elles sont associées aux mêmes salles que celles de vos ligues.",
"+ Add a Center": "+ Ajouter une salle",
"Teams & Leagues": "Équipes et ligues",
"Not on a team": "Aucune équipe",
"Taken from the roster on the Social tab — change it there and it updates here.": "Tiré de la liste des joueurs de l'onglet Amis — modifiez-la là-bas et la mise à jour se fera ici.",
"Not on any team yet.": "Dans aucune équipe pour l'instant.",
"Add a ball": "Ajouter une boule",
"Arsenal": "Arsenal",
"Balls and their drilling layouts.": "Les boules et leurs dispositions de perçage.",
"Has a plastic ball ✓": "Boule de plastique ✓",
"Add a plastic ball": "Ajouter une boule de plastique",
"Could not start checkout. Please try again in a moment.": "Impossible de lancer le paiement. Veuillez réessayer dans un instant.",
"Could not start checkout.": "Impossible de lancer le paiement.",
"Could not open the subscription manager. Please try again.": "Impossible d'ouvrir le gestionnaire d'abonnement. Veuillez réessayer.",
"Your payment is pending. Pro unlocks once Google Play finishes processing it.": "Votre paiement est en attente. Pro sera débloqué dès que Google Play aura fini de le traiter.",
"The purchase wasn't completed. You haven't been charged.": "L'achat n'a pas été effectué. Aucun montant ne vous a été facturé.",
"That purchase is already linked to another account.": "Cet achat est déjà lié à un autre compte.",
"no ok in response": "",
"Your purchase went through, but we couldn't confirm it just yet. Pro will unlock shortly --": "Votre achat a été effectué, mais nous ne pouvons pas encore le confirmer. Pro sera débloqué sous peu --",
"reopen the app in a few minutes. You won't be charged twice.": "rouvrez l'application dans quelques minutes. Aucun montant ne vous sera facturé deux fois.",
"Pick a plan first.": "Choisissez d'abord un forfait.",
"Something went wrong starting that. Please try again.": "Un problème est survenu au démarrage. Veuillez réessayer.",
"Trip 6": "6 culbutée",
"Kick 7": "7 par la bande",
"Free fall ·": "Chute libre ·",
"String ·": "Ficelles ·",
"same": "identique",
"on string": "avec ficelles",
"splits excluded": "écarts exclus",
"Messengers": "Quilles messagères",
"share of strikes": "part des abats",
"Splits left": "Écarts laissés",
"share of first balls": "part des premiers lancers",
"-pin left": " : quille restante sur",
"% of first balls": "% des premiers lancers",
"What's left standing on each. Darker means left more often.": "Ce qui reste debout avec chacune. Plus c'est foncé, plus c'est fréquent.",
"Free fall": "Chute libre",
"String": "Ficelles",
"Biggest change on string": "Plus grand changement avec ficelles",
"described": "décrits",
"How your strikes carried, from the ones you described.": "Comment vos abats ont fait tomber les quilles, d'après ceux que vous avez décrits.",
"Numbers": "Chiffres",
"Leaves": "Quilles restantes",
"Strikes": "Abats",
"Free Fall vs String": "Chute libre contre ficelles",
"Free fall vs string view": "Affichage chute libre contre ficelles",
"(prefers-reduced-motion: reduce)": "",
", not bowled": ", non joué",
"Tap any frame to edit": "Touchez un carreau pour le modifier",
"All teams": "Toutes les équipes",
"Session History": "Historique des séances",
"0 sessions": "0 séance",
"Nothing saved yet. Finish a night with \"Save & Finish\" on its Results tab and it lands here.": "Rien d'enregistré pour l'instant. Terminez une soirée avec « Enregistrer et terminer » dans son onglet Résultats et elle apparaîtra ici.",
"ten pins": "quilles 10",
"% spares": "% de réserves",
"splits": "écarts",
"More": "de plus",
"avg": "de moy.",
"How It Went 🎳": "Comment ça s'est passé 🎳",
"pins between": "quilles abattues par",
"pins first to last": "quilles entre la première et la dernière place",
"Practice Recap": "Bilan de l'entraînement",
"Best": "Meilleur",
"Spread": "Dispersion",
"vs Avg": "c. moyenne",
"Bowling With": "Partenaires de jeu",
"Compared on average — you didn't all bowl the same number of games.": "Comparaison selon la moyenne — vous n'avez pas joué le même nombre de parties.",
"Drill Recap": "Bilan des exercices",
"· may move": "· peut encore varier",
"Head To Head": "Face-à-face",
"You —": "Vous —",
", may move": ", peut encore varier",
"attempts": "tentatives",
"Not enough attempts on one side to call a difference.": "Pas assez de tentatives d'un côté pour conclure à une différence.",
"They also worked (nothing of yours to compare against):": "Les autres ont aussi travaillé (rien de votre côté à comparer) :",
"Share this": "Partager",
"Share the night": "Partager la soirée",
"End Open Bowling": "Terminer le jeu libre",
"Share this practice": "Partager cette séance",
"Change tonight's setup": "Modifier les réglages de ce soir",
"Tonight's setup": "Réglages de ce soir",
"Collapse": "Réduire",
"Bowling today?": "Vous jouez aujourd'hui?",
"Change either answer, then tap Done.": "Modifiez l'une ou l'autre réponse, puis touchez Terminé.",
"Two quick questions and the app sets itself up for tonight.": "Deux petites questions et l'application se prépare pour ce soir.",
"You can change this any time.": "Vous pourrez changer cela en tout temps.",
"How much detail?": "Quel niveau de détail?",
"Tester mode on — Diagnostics is now in Settings.": "Mode testeur activé — la section Diagnostic est maintenant dans Paramètres.",
"Tester mode off.": "Mode testeur désactivé.",
"turn off": "désactiver",
"turn on": "activer",
"Other bowlers have a “": "D'autres personnes ont aussi une ligue « ",
"” too": " »",
"If it's the same league, combine yours with it. Your games and teams move across, and you'll see each other's teams.": "S'il s'agit de la même ligue, fusionnez la vôtre avec celle-ci. Vos parties et vos équipes y seront transférées, et vous verrez leurs équipes comme ces personnes verront les vôtres.",
"No bowling center set": "Aucune salle de quilles définie",
"· you're already in it": "· vous en faites déjà partie",
"Combine": "Fusionner",
"” is already here": "” existe déjà",
"Is one of these your league? Joining it puts you in the same league as the bowlers already there, so you can find their teams and they can find yours.": "Est-ce l'une de ces ligues? En vous y joignant, vous serez dans la même ligue que les quilleurs et quilleuses qui y sont déjà : vous pourrez trouver leurs équipes, et ces personnes pourront trouver les vôtres.",
"None of these — create mine": "Aucune de celles-ci — créer la mienne",
"Unlock My Bowling Journey Pro": "Débloquer My Bowling Journey Pro",
"Unlimited leagues, full stats, and more.": "Ligues illimitées, statistiques complètes et plus encore.",
"Manage subscription": "Gérer l'abonnement",
"See Pro": "Voir Pro",
"Sessions": "Séances",
"Season": "Saison",
"Calendar": "Agenda",
"Journal": "Journal",
"Shared": "Partagé",
"Copied to clipboard": "Copié dans le presse-papiers",
"High Game": "Meilleure partie",
"High Series": "Meilleur triple",
"200+ Games": "Parties de 200+",
"Net": "Net",
"Share Summary": "Partager le résumé",
"No sessions yet for this bowler and league.": "Aucune séance pour l'instant pour cette personne dans cette ligue.",
"Walkthroughs": "Visites guidées",
"Watch any of these again, any time.": "Revoyez n'importe laquelle de ces visites, en tout temps.",
"Watch": "Regarder",
"App appearance": "Apparence de l'application",
"Each one takes its colour from a different part of the house. Dark ones for a dim centre, light ones for a bright room or daytime.": "Chaque thème tire sa couleur d'une partie différente de la salle. Les thèmes foncés conviennent à une salle tamisée, les clairs à une pièce bien éclairée ou au jour.",
"Dark": "Foncés",
"Light": "Mince",
"Add a league": "Ajouter une ligue",
"Add a league, rename one, set its center and season dates, or hide one you're not bowling any more.": "Ajoutez une ligue, renommez-en une, indiquez sa salle et les dates de sa saison, ou masquez une ligue où vous ne jouez plus.",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet.": "Ajoutez la ligue où vous jouez et vous pourrez entrer vos pointages tout de suite. Pas besoin d'équipe pour l'instant.",
"More leagues": "Plus de ligues",
"The free plan covers one league. Bowling a second one — a summer league, or Tuesday and Thursday — is part of the paid plan. Nothing you have already logged goes anywhere.": "Le forfait gratuit comprend une ligue. Jouer dans une deuxième — une ligue d'été, ou le mardi et le jeudi — fait partie du forfait payant. Rien de ce que vous avez déjà enregistré ne disparaît.",
"League name, e.g. Tuesday Night Mixed": "p. ex. Mixte du mardi soir",
"Rename": "Renommer",
"Date range (optional)": "Plage de dates (facultatif)",
"Season dates": "Dates de la saison",
"Nine on the first ball counts as a strike. Those are kept separate from your regular strike percentage, but still count toward how your ball carries.": "Neuf quilles au premier lancer comptent comme un abat. Ces abats sont comptés à part de votre pourcentage d'abats habituel, mais comptent quand même dans la capacité de votre boule à faire tomber les quilles.",
"Usual lane condition": "État habituel de l'allée",
"Used for any night you don't record a pattern for. Leave the name blank if this league rotates.": "Utilisé pour toute soirée où vous n'enregistrez pas de patron. Laissez le nom vide si le patron change d'une soirée à l'autre dans cette ligue.",
"Hidden — show again": "Masquée — afficher de nouveau",
"Hide this league": "Masquer cette ligue",
"Won't appear when logging. Past scores still count toward your averages.": "N'apparaîtra plus lors de l'enregistrement. Les pointages passés comptent toujours dans vos moyennes.",
"Add weekly reminder": "Ajouter un rappel hebdomadaire",
"team": "équipe",
"in this league": "dans cette ligue",
"· yours": "· la vôtre",
"Asked": "Demande envoyée",
"Ask to join": "Demander à se joindre",
"Leave team": "Quitter",
"More teams": "Plus d'équipes",
"The free plan covers one team. Your scores keep counting for the team you are already on.": "Le forfait gratuit comprend une équipe. Vos pointages continuent de compter pour l'équipe dont vous faites déjà partie.",
"Add a team": "Ajouter une équipe",
"Your scores in this league will join it — including nights you have already logged.": "Vos pointages dans cette ligue y seront associés — y compris les soirées déjà enregistrées.",
"Add a team to this league": "Ajouter une équipe à cette ligue",
"Leagues": "Ligues",
"Shown": "Visible",
"Hidden": "Non visible",
"Poker, 3-6-9, and High Game Pot tracking cards on the Log and Data tabs.": "Cartes de suivi du poker, du 3-6-9 et de la cagnotte de la meilleure partie dans les onglets Jouer et Stats.",
"Which pots does your house run?": "Cagnottes offertes par votre salle",
"Export": "Exporter",
"Your data, as spreadsheets. Sessions is one row per night; shots is one row per delivery.": "Vos données, en feuilles de calcul. Le fichier des séances compte une ligne par soirée; celui des lancers, une ligne par lancer.",
"Sessions CSV": "CSV des séances",
"Shots CSV": "CSV des lancers",
"Import scores": "Importer des pointages",
"Backup & Restore": "Sauvegarde et restauration",
"No data yet": "Aucune donnée pour l'instant",
"Save a copy of everything — shots, sessions, bowlers, arsenals, and match results — so your season is safe no matter what. If you ever open this app and your history looks empty, restore it here.": "Enregistrez une copie de tout — lancers, séances, joueurs, arsenaux et résultats de matchs — pour que votre saison soit en sécurité quoi qu'il arrive. Si un jour vous ouvrez l'application et que votre historique semble vide, restaurez-le ici.",
"Open Backup & Restore": "Ouvrir Sauvegarde et restauration",
"Backup downloaded.": "Sauvegarde téléchargée.",
"Download Backup": "Télécharger la sauvegarde",
"If the download doesn't work in this environment, copy the text below instead and save it somewhere safe.": "Si le téléchargement ne fonctionne pas dans cet environnement, copiez plutôt le texte ci-dessous et conservez-le en lieu sûr.",
"To restore, paste a backup below and tap Restore. This adds anything missing — it won't erase what's already here.": "Pour restaurer, collez une sauvegarde ci-dessous et touchez Restaurer. Cela ajoute tout ce qui manque — rien de ce qui est déjà ici ne sera effacé.",
"Paste backup JSON here…": "Collez le JSON de sauvegarde ici…",
"Restore This Backup": "Restaurer cette sauvegarde",
"Refresh from the Cloud": "Actualiser à partir du nuage",
"Use this if something you know you bowled is missing here": "Utilisez cette option s'il manque ici quelque chose que vous savez avoir joué",
"— a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "— une soirée qui n'apparaît pas, des pointages saisis sur un autre téléphone, ou des stats qui ne bougent plus même si vous avez continué à jouer.",
"To open fast, this app normally downloads only what has changed since it last checked. Once in a while a phone can lose its place and stop asking for something — usually after bowling somewhere with no signal, or when the same account is used on two devices. Your shots are safe in the cloud the whole time; this phone just is not asking for them.": "Pour s'ouvrir rapidement, l'application ne télécharge normalement que ce qui a changé depuis sa dernière vérification. De temps à autre, un téléphone peut perdre le fil et cesser de demander certaines données — généralement quand vous avez joué dans un endroit sans réseau, ou quand le même compte est utilisé sur deux appareils. Vos lancers restent en sécurité dans le nuage tout ce temps; c'est simplement ce téléphone qui ne les demande pas.",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app.": "Cette option envoie tout ce qui attend encore d'être enregistré, puis télécharge de nouveau tout votre historique à partir de zéro et recharge l'application.",
"Nothing is deleted": "Rien n'est supprimé",
", and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": ", et rien de ce que vous avez enregistré ne peut être perdu. Cela utilise plus de données qu'une ouverture normale et peut prendre quelques instants pour une longue saison; mieux vaut donc être connecté au Wi-Fi.",
"change": "modification",
"still waiting to save.": "en attente d'enregistrement.",
"It": "Elle",
"will be sent first.": "sera envoyée en premier.",
"Refreshing…": "Actualisation…",
"Account": "Compte",
"Signed in": "Session ouverte",
"Signed in as": "Compte connecté :",
"this device": "cet appareil",
"Sign out of this account?": "Vous déconnecter de ce compte?",
"Could not sign out. Check your connection and try again.": "Impossible de se déconnecter. Vérifiez votre connexion et réessayez.",
"Sign out": "Se déconnecter",
"About & Legal": "À propos et mentions légales",
"Privacy Policy": "Politique de confidentialité",
"Terms of Service": "Conditions d'utilisation",
"Delete your account": "Supprimer votre compte",
"Questions, or want your data deleted?": "Des questions ou une demande de suppression de vos données?",
"support@mybowlingjourney.com": "support@mybowlingjourney.com",
"is published by My Bowling Journey LLC.": "est une publication de My Bowling Journey LLC.",
"Web version": "Version Web",
"Diagnostics": "Diagnostics",
"Nothing logged": "Aucun problème consigné",
"What went wrong on this phone, and why — failed saves, sync errors, imports that fell back. Copy it and paste it to whoever asked.": "Ce qui a mal tourné sur ce téléphone, et pourquoi — enregistrements échoués, erreurs de synchronisation, importations passées en mode de secours. Copiez ce journal et collez-le dans un message à la personne qui vous l'a demandé.",
"Copied": "Copié",
"Couldn't copy on this device": "Impossible de copier sur cet appareil",
"Copy log": "Copier le journal",
"Tester mode. Tap the \"published by\" line in About & Legal seven times to turn it off.": "Mode testeur. Touchez sept fois la ligne « est une publication de » dans À propos et mentions légales pour le désactiver.",
"Danger Zone": "Zone de danger",
"Clear All Data": "Effacer toutes les données",
"Removes your bowling history including your shots, match results and lane notes. Your account, profile, arsenal and teams are unaffected.": "Supprime votre historique de quilles, y compris vos lancers, vos résultats de matchs et vos notes sur les allées. Votre compte, votre profil, votre arsenal et vos équipes ne sont pas touchés.",
"This deletes every logged shot, session, match result (opponents, handicaps, win/loss), and lane condition note. This can't be undone. Consider downloading a backup above first.": "Cette action supprime chaque lancer enregistré, chaque séance, chaque résultat de match (adversaires, handicaps, victoires/défaites) et chaque note sur l'état des allées. Cette action est irréversible. Pensez d'abord à télécharger une sauvegarde ci-dessus.",
"Yes, Delete Everything": "Oui, tout supprimer",
"Delete My Account": "Supprimer mon compte",
"Removes your account and everything in it, permanently.": "Supprime définitivement votre compte et tout ce qu'il contient.",
"This deletes your account and": "Cette action supprime votre compte et",
"everything attached to it": "tout ce qui y est rattaché",
"— every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "— chaque lancer et chaque séance, votre profil et votre nom, votre arsenal, vos objectifs et votre place dans toute équipe. Vous ne pourrez plus vous reconnecter, et nous ne pourrons rien récupérer.",
"Leagues and teams you created are kept only if other bowlers are still using them, so nobody loses a league they're bowling in. Any that nobody else is in go with everything else.": "Les ligues et les équipes que vous avez créées sont conservées seulement si d'autres membres les utilisent encore : ainsi, personne ne perd une ligue en cours. Celles qui n'ont aucun autre membre sont supprimées avec tout le reste.",
"Want a copy first? Use": "Vous voulez d'abord une copie? Utilisez",
"above before you do this.": "ci-dessus avant de continuer.",
"to confirm": "pour confirmer",
"Couldn't delete the account.": "Impossible de supprimer le compte.",
"Deleting…": "Suppression…",
"Permanently Delete": "Supprimer définitivement",
"Test account — everything unlocked": "Compte de test — tout est débloqué",
"Ending — you keep Pro until the period you paid for runs out": "Fin prévue — vous gardez Pro jusqu'à la fin de la période payée",
"There's a problem with your payment method": "Il y a un problème avec votre mode de paiement",
"You're subscribed": "Abonnement actif",
"Share": "Partager",
"Trend": "Tendance",
"Preparing…": "En préparation…",
"Copied — paste it anywhere": "Copié — collez-le où vous voulez",
"Couldn't share on this device": "Impossible de partager sur cet appareil",
"Share card": "Carte à partager",
"Press and hold the card to save or share it.": "Maintenez le doigt sur la carte pour l'enregistrer ou la partager.",
"Copy text": "Copier le texte",
"Wrong email or password.": "Courriel ou mot de passe incorrect.",
"Couldn't sign in.": "Connexion impossible.",
"Couldn't send the code. Try again.": "Impossible d'envoyer le code. Réessayez.",
"That code didn't work. Check it, or send a new one.": "Ce code n'a pas fonctionné. Vérifiez-le ou faites-vous envoyer un nouveau code.",
"Couldn't verify that code.": "Impossible de vérifier ce code.",
"Sign in to log your own games and see the team's stats.": "Connectez-vous pour enregistrer vos propres parties et voir les stats de l'équipe.",
"Email": "Courriel",
"Password": "Mot de passe",
"Signing in…": "Connexion…",
"Sign In": "Se connecter",
"Check your email": "Consultez vos courriels",
"We sent a": "Nous avons envoyé un code à",
"-digit code to": " chiffres à",
"The same email has a sign-in link in it, if you'd rather tap that.": "Le même courriel contient aussi un lien de connexion, si vous préférez toucher ce lien.",
"The code lasts an hour.": "Le code est valide pendant une heure.",
"Use a different email": "Utiliser une autre adresse courriel",
"Opening Google…": "Ouverture de Google…",
"Continue with Google": "Continuer avec Google",
"or": "ou",
"Sending…": "Envoi…",
"Email Me a Code": "Recevoir un code par courriel",
"No password needed — we'll email you a code.": "Aucun mot de passe requis — nous vous enverrons un code par courriel.",
"Knockdown": "Quilles abattues",
"Pick a league above": "Choisissez une ligue ci-dessus",
"Nothing to count yet": "Rien à compter pour l'instant",
"Log a few frames and this fills in — strike rate, spares, ten pins, and how each ball is carrying.": "Enregistrez quelques carreaux et cette section se remplira — taux d'abats, réserves, quilles 10 et rendement de chaque boule.",
"Viewing": "Affichage",
"(you)": "(vous)",
"Teams": "Équipes",
"Compare To": "Comparer à",
"Nobody to compare against yet. Add a friend, or set up your team — teammates are added as friends automatically.": "Personne à qui vous comparer pour l'instant. Ajoutez un ami ou configurez votre équipe — les membres de l'équipe sont ajoutés automatiquement à vos amis.",
"Manage friends": "Gérer les amis",
"Add a friend": "Ajouter un ami",
"Clean Frame %": "% de carreaux fermés",
"Split Rate": "Taux d'écarts",
"10-Pin Spare %": "% de réserves de la quille 10",
"Single-Pin Spare %": "% de réserves d'une quille",
"First-Ball Avg": "Moy. au 1er lancer",
"Leave Avg": "Moy. hors abats",
"Head-to-Head": "Face-à-face",
"Every rate stat side by side against": "Chaque statistique de taux côte à côte avec",
", instead of hunting through separate cards. Split Rate is the one metric here where lower is better.": ", au lieu de chercher dans des cartes séparées. Le taux d'écarts est la seule mesure ici où plus bas, c'est mieux.",
"Team Records": "Records de l'équipe",
"to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.": "pour voir ceci — la meilleure partie et le meilleur triple exigent une liste des joueurs précise, puisque combiner des équipes de tailles différentes avantagerait injustement celle qui compte le plus de membres.",
"Season record": "Fiche de la saison",
"points won": "points gagnés",
"points (": "points (",
"games,": "en parties,",
"pinfall)": "en quilles abattues)",
"Weekly Points": "Points par semaine",
"Points won each week, out of 4 — Season Record only shows the running total, never when those points actually came. Shows momentum: a hot streak or a slump.": "Points gagnés chaque semaine, sur 4 — la carte « Fiche de la saison » n'affiche que le total cumulatif, jamais le moment où ces points ont été obtenus. Montre l'élan : une bonne séquence ou une mauvaise passe.",
"Points won": "Points gagnés",
"Handicap Impact": "Effet du handicap",
"to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.": "pour voir ceci — « l'équipe » doit désigner une seule liste de joueurs précise, pas les matchs de plusieurs ligues mélangés.",
"Points-won rate split by handicap size — shows whether the team does better closer to scratch or with a bigger handicap cushion.": "Taux de points gagnés selon l'ampleur du handicap — montre si l'équipe fait mieux quand elle est plus près du sans handicap ou avec un coussin de handicap plus gros.",
"Points won %": "Points gagnés (%)",
"Team Leaderboard": "Palmarès de l'équipe",
"% stk": "% abats",
"Giant Killer": "Chasse au géant",
"to see this — it needs a specific roster to know who's on top.": "pour voir ceci — il faut une liste de joueurs précise pour savoir qui est en tête.",
"No comparisons yet — the first week just sets the baseline average for everyone. Once a second week is logged, that week's giant (whoever had the best average entering it) gets challenged and this fills in.": "Aucune comparaison pour l'instant — la première semaine sert seulement à établir la moyenne de départ de tout le monde. Dès qu'une deuxième semaine est enregistrée, le géant de cette semaine-là (la personne qui avait la meilleure moyenne au début de la semaine) est mis au défi, et cette section se remplit.",
"% of games each bowler beat that week's reigning giant, game-by-game — the giant is whoever had the highest average entering that week, based only on weeks before it (never that week's own results). The very first week ever logged sets the baseline with no giant to challenge yet; the hunt starts week two. Locked in per week — if the title changes hands later, earlier weeks stay compared against whoever actually held it at the time. \"Weeks on top\" counts how many weeks they themselves held the title.": "% des parties où chaque quilleur ou quilleuse a battu le géant en titre de la semaine, partie par partie — le géant, c'est la personne qui avait la moyenne la plus élevée au début de cette semaine, calculée uniquement sur les semaines précédentes (jamais sur les résultats de la semaine même). La toute première semaine enregistrée établit la base, sans géant à défier; la chasse commence à la deuxième semaine. C'est figé semaine par semaine — si le titre change de mains plus tard, les semaines précédentes restent comparées à la personne qui le détenait réellement à ce moment-là. « Sem. en tête » compte le nombre de semaines où la personne a elle-même détenu le titre.",
"wk": "sem.",
"on top": "en tête",
"games": "parties",
"🎣 Hung": "🎣 En plan",
"to see this — it needs a specific roster to know who else was bowling that frame.": "pour voir ceci — il faut une liste de joueurs précise pour savoir qui d'autre jouait ce carreau-là.",
"Nobody's been hung yet — every strike in this data has had at least one teammate join in, or company on the miss.": "Personne n'est encore resté en plan — pour chaque abat de ces données, au moins un autre membre de l'équipe a aussi fait un abat, ou quelqu'un d'autre a aussi raté.",
"Every teammate struck that frame except them. The wall of shame.": "Tous les membres de l'équipe ont fait un abat dans ce carreau, sauf cette personne. Le mur de la honte.",
"Team Series": "Triples de l'équipe",
"Team Total": "Total de l'équipe",
"Tu": "Mar",
"Th": "Jeu",
"Clean frames": "Carreaux fermés",
"of frames closed out": "des carreaux fermés",
"Frame Position": "Position du carreau",
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where": "Ventilé par numéro de carreau, pas par partie — montre s'il y a un moment précis dans chaque soirée (réchauffement, transition de l'huile, la distraction du 9e carreau quand on calcule son pointage) où",
"tends to leave pins, regardless of which game it is.": "a tendance à laisser des quilles debout, peu importe la partie.",
"Weighted quality score, strict priority order: strike beats every spare, a non-split spare beats every split spare, and within each of those a leave with fewer pins standing scores higher — an open frame always scores lowest, ranked by total pinfall.": "Indice de qualité pondéré, selon un ordre de priorité strict : un abat bat toute réserve, une réserve sans écart bat toute réserve sur un écart, et à l'intérieur de chacune de ces catégories, moins il reste de quilles debout, plus l'indice est élevé — un carreau ouvert a toujours l'indice le plus bas, classé selon le total des quilles abattues.",
"⚠️ Only": "⚠️ Seulement",
"logged — each frame number needs at least": "au total — chaque numéro de carreau en exige au moins",
"to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.": "pour distinguer une vraie tendance du hasard. D'ici là, voyez ceci comme un aperçu, pas une conclusion.",
"Weakest": "Plus faible",
"Strongest": "Plus fort",
"Weakest:": "Plus faible :",
") · Strongest:": ") · Plus fort :",
"Every frame is even on this metric — no standout weak spot.": "Tous les carreaux sont égaux selon cette mesure — aucun point faible ne ressort.",
"First-Ball Average": "Moyenne au premier lancer",
"Average pins on every fresh-rack delivery — every frame's first ball, plus any 10th-frame bonus ball thrown at a full reset rack — strikes counted as 10. The standard metric, comparable to LaneTalk and other scoring apps.": "Moyenne de quilles abattues sur chaque lancer devant un jeu complet — le premier lancer de chaque carreau, plus tout lancer supplémentaire du 10e carreau effectué devant les 10 quilles replacées — les abats comptent pour 10. La mesure standard, comparable à LaneTalk et aux autres applications de pointage.",
"pins per fresh rack": "quilles par jeu complet",
"vs": "contre",
"Leave Average": "Moyenne hors abats",
"Same fresh-rack deliveries, but only the ones that weren't a strike — isolates how good the leave is on a miss, separate from strike rate.": "Mêmes lancers devant un jeu complet, mais seulement ceux qui n'ont pas donné d'abat — isole la qualité des quilles restantes quand l'abat est raté, indépendamment du taux d'abats.",
"pins when you don't strike": "quilles quand vous ne faites pas d'abat",
"Ten pins": "Quilles 10",
"of your ten pins converted": "de vos quilles 10 réussies",
"Ten-pin leave rate": "Taux de quille 10 restante",
"Single pin spares": "Réserves d'une quille",
"of splits converted": "des écarts réussis",
"Split rate": "Taux d'écarts",
"✋ Hand Up": "✋ Main levée",
"to see who owes a round.": "pour voir qui doit payer une tournée.",
"Nobody's missed a lone 5 yet. Hands stay down.": "Personne n'a encore raté une quille 5 isolée. Les mains restent baissées.",
"Lone 5-pins missed. Each one owes a drink to everyone with a hand up.": "Quilles 5 isolées ratées. Pour chaque raté, on doit un verre à chaque personne qui a la main levée.",
"Bowler": "Nom",
"5s missed": "5 ratées",
"Non-Split Leaves": "Quilles restantes sans écart",
"Every recurring leave that isn't a split — how often it happens and how often it gets converted.": "Chaque configuration récurrente de quilles restantes qui n'est pas un écart — à quelle fréquence elle se produit et à quelle fréquence elle est convertie en réserve.",
"Longest strike streak": "Plus longue séquence d'abats",
"in a row": "de suite",
"Consecutive strikes, carrying across games within the same night.": "Abats consécutifs, d'une partie à l'autre au cours de la même soirée.",
"By Ball": "Par boule",
"Miss Distribution": "Répartition des ratés",
"Ball Change Triggers": "Raisons des changements de boule",
"Strike Quality": "Qualité des abats",
"Top number is the average bowler's score. \"Team\" below it is what the whole team scores together that game.": "Le chiffre du haut est le pointage moyen par membre de l'équipe. « Équipe », en dessous, est ce que toute l'équipe obtient ensemble dans cette partie.",
"Combined spans all leagues, so there's no single team to compare it against — pick a specific bowler under \"Compare To\", or select a specific league above.": "La vue combinée couvre toutes les ligues, donc il n'y a pas d'équipe unique à laquelle la comparer — choisissez une personne précise sous « Comparer à », ou sélectionnez une ligue précise ci-dessus.",
"Theoretical Average": "Moyenne théorique",
"What the average would be if every makeable spare (not a split, not a washout) had been made — including a theoretical 10th-frame fill ball, estimated from each game's own recent first-ball average at that point.": "Ce que serait la moyenne si chaque réserve réalisable (ni écart ni « washout ») avait été réussie — y compris un lancer supplémentaire théorique au 10e carreau, estimé d'après la moyenne récente au premier lancer de chaque partie à ce moment-là.",
"if you'd made every makeable spare": "si vous aviez réussi chaque réserve réalisable",
"This Season vs Last": "Cette saison contre la précédente",
"Level": "Stable",
"Progress to Next Milestone": "Progression vers le prochain palier",
"Tracked in 5-pin steps": "Suivi par paliers de 5 quilles",
"— the team's average bowler": "— moyenne par membre de l'équipe",
"% to": "% du chemin vers",
"Next Session (": "Prochaine soirée (",
"Games)": "parties)",
"You're averaging": "Votre moyenne est de",
"across": "sur",
"games. Here's what the next set does to it.": "parties. Voici l'effet des prochaines parties.",
"Gaining a full point isn't reachable in one set at this average.": "Gagner un point complet n'est pas possible en une seule soirée avec cette moyenne.",
"No set this session can drop the average a full point.": "Aucun résultat possible lors de cette soirée ne peut faire baisser la moyenne d'un point complet.",
"Score Consistency": "Constance des pointages",
"How steady their game scores are night to night, independent of the average itself. Lower is steadier.": "La stabilité de ses pointages de partie d'une soirée à l'autre, indépendamment de la moyenne elle-même. Plus c'est bas, plus c'est stable.",
"How steady the team's combined game totals are night to night — not each bowler's individual scores. Lower is steadier.": "La stabilité des totaux combinés de l'équipe par partie d'une soirée à l'autre — pas les pointages individuels de chaque membre. Plus c'est bas, plus c'est stable.",
"pins either side of your average": "quilles de part et d'autre de votre moyenne",
"team games": "parties d'équipe",
"Score Distribution": "Répartition des pointages",
"The actual shape behind the std. dev. above — tightly bunched around the average, or a long tail of bad nights dragging it down.": "La forme réelle derrière l'écart-type ci-dessus — des pointages bien regroupés autour de la moyenne, ou une longue traîne de mauvaises soirées qui la tire vers le bas.",
"Game-by-Game Averages": "Moyennes partie par partie",
"Composite average at each position in the night, across the whole season — shows whether": "Moyenne composite à chaque position dans la soirée, sur toute la saison — montre si",
"the team is": "l'équipe est",
"bowling better early, middle, or late.": "en meilleure forme en début, en milieu ou en fin de soirée.",
"\"Team\" is what the whole team scores together at that position.": "« Équipe » correspond au pointage de toute l'équipe à cette position.",
"Team:": "Équipe :",
"Poker": "Poker",
"High Game Pot": "Cagnotte de la meilleure partie",
"Team Side Games": "Cagnottes de l'équipe",
"Season totals across every side game — what came in, what it cost to play, and what actually stuck.": "Totaux de la saison pour toutes les cagnottes — ce qui est entré, ce qu'il en a coûté pour jouer et ce qui est vraiment resté.",
"won this season": "gagnés cette saison",
"By Game": "Par cagnotte",
"Buy-in": "Mise",
"Won": "Gains",
"3-6-9 Tracker": "Suivi 3-6-9",
"Strike frames 3, 6, and 9 of every game (games 1, 2, and 3 -- all 9 strikes) to win the pot for the night. Also throw a full turkey in game 3's 10th frame to additionally earn the jackpot.": "Réussissez un abat aux carreaux 3, 6 et 9 de chaque partie (parties 1, 2 et 3 — les 9 abats) pour remporter la cagnotte de la soirée. Réussissez aussi un dindon complet au 10e carreau de la 3e partie pour remporter en plus le gros lot.",
"won on 3-6-9": "gagnés au 3-6-9",
"By Bowling Center": "Par salle de quilles",
"How you score house to house. Only leagues with a center set are included — set them under Team.": "Votre pointage d'une salle à l'autre. Seules les ligues associées à une salle sont incluses — associez-les sous Équipe.",
"Comparison": "Comparaison",
"Comparing two things — bowlers, balls, houses, patterns or seasons — is part of the paid plan. Everything about your own game stays free.": "Comparer deux choses — quilleurs ou quilleuses, boules, salles, patrons d'huilage ou saisons — fait partie du forfait payant. Tout ce qui concerne votre propre jeu reste gratuit.",
"this card": "cette carte",
"Not yet": "Pas encore",
"Unhide Stat Cards (": "Réafficher les cartes de stats (",
"Something went wrong.": "Une erreur s'est produite.",
"You're on Pro": "Forfait Pro actif",
"Thanks for subscribing. Everything is unlocked.": "Merci pour votre abonnement. Tout est débloqué.",
"Manage or cancel any time in the Play Store app, under Subscriptions.": "Gérez ou annulez votre abonnement en tout temps dans l'application Play Store, sous Abonnements.",
"Your subscription is ending": "Votre abonnement prend fin",
"You are subscribed": "Abonnement actif",
"when the period you paid for runs out": "lorsque la période payée sera écoulée",
"Everything is unlocked.": "Tout est débloqué.",
"Manage or cancel your subscription in the Play Store app, under Subscriptions.": "Gérez ou annulez votre abonnement dans l'application Play Store, sous Abonnements.",
"Opening…": "Ouverture…",
"Resume subscription": "Réactiver l'abonnement",
"Test account.": "Compte de test.",
"Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "Tout est déjà débloqué pour vous, peu importe la facturation. Vous pouvez quand même acheter ci-dessous pour tester le paiement.",
"Your scores, spares and ball numbers stay free, always. Pro is for the comparisons — and for the parts that think about your night for you.": "Vos pointages, vos réserves et les chiffres de vos boules restent gratuits, pour toujours. Pro sert aux comparaisons — et aux fonctions qui analysent votre soirée à votre place.",
"Every league and team you bowl in": "Toutes les ligues et équipes où vous jouez",
"(free keeps": "(la version gratuite en inclut",
"Ball against ball, house against house, pattern against pattern": "Boule contre boule, salle contre salle, patron contre patron",
"Head to head with friends and teammates": "Face-à-face avec vos amis et les membres de votre équipe",
"This season against last": "Cette saison contre la précédente",
"Nightcap, Insights, Brooklyn and coaching": "Nightcap, Analyses, Brooklyn et Entraîneur",
"Scorecard import": "Importation de feuilles de pointage",
"Choose a plan": "Choisissez un forfait",
"Yearly ·": "Annuel ·",
"Monthly ·": "Mensuel ·",
"Your": "Votre essai gratuit de",
"-day free trial starts today. When it ends, the": " jours commence aujourd'hui. À la fin de l'essai, le forfait",
"plan starts at": "entre en vigueur au prix de",
"and renews on its own until you cancel.": "et se renouvelle automatiquement jusqu'à ce que vous l'annuliez.",
"The": "Le forfait",
"plan is": "coûte",
". Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": ". Google Play indique si un essai gratuit s'applique à votre compte avant que vous confirmiez, puis l'abonnement se renouvelle automatiquement jusqu'à ce que vous l'annuliez.",
"You have already had the free trial, so the": "Vous avez déjà profité de l'essai gratuit, donc le forfait",
"plan starts today at": "entre en vigueur aujourd'hui au prix de",
"Cancel any time": "Annulez en tout temps",
"in the Play Store app under Subscriptions": "dans l'application Play Store, sous Abonnements",
"from the link in your receipt": "à partir du lien dans votre reçu",
"— you keep Pro until the end of the period you have paid for.": "— vous conservez Pro jusqu'à la fin de la période payée.",
"If you stop, nothing you have logged is deleted. One league stays active and the rest are paused until you come back.": "Si vous arrêtez, rien de ce que vous avez enregistré n'est supprimé. Une ligue reste active et les autres sont mises en pause jusqu'à votre retour.",
"Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.": "",
"Create a .env file at the project root — see supabaseClient.js for the format.": "",
"(no match)": "",
"Tuesday House Shot": "Huilage maison du mardi",
"Thursday House Shot": "Huilage maison du jeudi",
"Too many tries. Wait a little and try again.": "Trop de tentatives. Attendez un peu et réessayez.",
"Couldn't join just now. Check your connection and try again.": "Impossible de rejoindre l'équipe pour le moment. Vérifiez votre connexion et réessayez.",
"That code didn't match a team. Check it with whoever sent it.": "Ce code ne correspond à aucune équipe. Vérifiez-le auprès de la personne qui vous l'a envoyé.",
"Couldn't do that just now. It may already have been answered — pull down to refresh.": "Action impossible pour le moment. Une réponse a peut-être déjà été donnée — glissez vers le bas pour actualiser.",
"Couldn't send that just now. Check your connection and try again.": "Impossible d'envoyer la demande pour le moment. Vérifiez votre connexion et réessayez.",
"Make a new code? The old one stops working, so anyone you sent it to will need the new one.": "Créer un nouveau code? L'ancien cessera de fonctionner, donc les personnes à qui vous l'avez envoyé auront besoin du nouveau.",
"There's already a pending invite for that email on this team.": "Une invitation est déjà en attente pour cette adresse courriel dans cette équipe.",
"Add an email, or tick “I don’t have their email” to get a code you can text them. Either way they need a way to claim this spot themselves.": "Ajoutez une adresse courriel, ou choisissez « Envoyer un code par texto » pour obtenir un code à lui transmettre. Dans les deux cas, la personne doit pouvoir réclamer cette place elle-même.",
"That doesn't look like an email address.": "Cela ne ressemble pas à une adresse courriel.",
"Loading teams…": "Chargement des équipes…",
"Couldn't load your teams. You may be offline.": "Impossible de charger vos équipes. Vous êtes peut-être hors ligne.",
"Waiting to join your team": "Demandes pour rejoindre votre équipe",
"wants to join": "veut rejoindre l'équipe",
"+ Add team": "+ Ajouter une équipe",
"A team belongs to a league. Add your league on the League tab first, then come back here.": "Une équipe fait partie d'une ligue. Ajoutez d'abord votre ligue dans l'onglet Ligue, puis revenez ici.",
"OK": "OK",
"New team": "Nouvelle équipe",
"Pick the league this team bowls in": "Choisissez la ligue de cette équipe",
"Team name": "Nom de l'équipe",
"e.g. Split Happens": "p. ex. Les Écarts de conduite",
"Create team": "Créer l'équipe",
"Join a team": "Rejoindre une équipe",
"You're invited to": "Invitation à rejoindre",
"Got a team code from a teammate? Enter it here.": "Un membre de l'équipe vous a donné un code d'équipe? Entrez-le ici.",
"ABCD-1234": "ABCD-1234",
"No code? Find your team in your league and ask to join. Anyone on the team can approve you.": "Pas de code? Trouvez votre équipe dans votre ligue et demandez à la rejoindre. N'importe quel membre de l'équipe peut accepter votre demande.",
"Pick a league": "Choisissez une ligue",
"Looking…": "Recherche…",
"No teams in this league yet. You can make one with Add team.": "Aucune équipe dans cette ligue pour l'instant. Vous pouvez en créer une avec « Ajouter une équipe ».",
"Your team": "Votre équipe",
"Asked to join": "Demande envoyée à l'équipe",
"— waiting for someone on the team to approve.": "— en attente de l'approbation d'un membre de l'équipe.",
"Withdraw": "Retirer",
"No teams yet. Tap Add team, or add one under a league on the League tab.": "Aucune équipe pour l'instant. Touchez « Ajouter une équipe », ou ajoutez-en une sous une ligue dans l'onglet Ligue.",
"Team Name": "Nom de l'équipe",
"Team code — text it to teammates so they can join": "Code d'équipe — à envoyer par texto aux membres",
"Copy": "Copier",
"Make a new code; the old one stops working": "Créer un nouveau code; l'ancien cessera de fonctionner",
"New": "Nouveau",
"Roster / Bowling Order": "Liste des joueurs / alignement",
"Just you so far — add teammates below, or leave it and come back to it. Your scores count either way.": "Seulement vous pour l'instant — ajoutez des membres de l'équipe ci-dessous, ou revenez-y plus tard. Vos pointages comptent dans les deux cas.",
"Bowling hand — tap to switch": "Main de jeu — touchez pour changer",
"Sub — tap to toggle": "Personne remplaçante — touchez pour activer ou désactiver",
"Sub ✓": "Rempl. ✓",
"Sub": "Rempl.",
"invited · not signed in yet": "invitation envoyée · pas encore de connexion",
"placeholder · no email on file": "place réservée · aucun courriel au dossier",
"— invited, waiting for them to accept": "— invitation envoyée, en attente d'acceptation",
"Add Someone Not Signed Up Yet": "Ajouter une personne qui n'a pas encore de compte",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with their email, they're linked the moment they sign in with that exact address; with a code, you get one to text them and they enter it when they sign up.": "Réserve sa place dans la liste des joueurs dès maintenant — vous pouvez commencer tout de suite à enregistrer ses pointages sous son nom dans « Pointage tenu pour », sans qu'un compte soit nécessaire pour l'instant. Dans les deux cas, la personne réclame elle-même sa place et tout ce que vous avez enregistré s'y trouve déjà : avec son courriel, elle y est liée dès qu'elle se connecte avec cette adresse exacte; avec un code, vous en recevez un à lui envoyer par texto et elle l'entre au moment de s'inscrire.",
"Their name": "Son nom",
"I have their email": "J'ai son courriel",
"Text them a code": "Code par texto",
"Their email": "Son courriel",
"They will get a code to enter when they sign up. It links them to this spot the same way an email invite does.": "La personne recevra un code à entrer lors de son inscription. Ce code la lie à cette place de la même façon qu'une invitation par courriel.",
"Add to Roster": "Ajouter à la liste",
"Skip": "Passer",
"Start bowling": "Commencer à jouer",
"Next": "Suivant",
"Your history:": "Votre historique :",
"avg over": "de moyenne sur",
"Low": "Min.",
"Untitled": "Sans titre",
"no date": "sans date",
"· made cut": "· qualification obtenue",
"· missed cut": "· qualification manquée",
"Oil Pattern": "Patron d'huilage",
"e.g. Krypton, or type your own": "p. ex. Krypton, ou entrez le vôtre",
"+ Save \"": "+ Enregistrer « ",
"\" for next time": " » pour la prochaine fois",
"Length, ratio, and volume are optional — fill in whatever you know.": "La longueur, le rapport et le volume sont facultatifs — indiquez ce que vous connaissez.",
"Feet": "Pieds",
"Ratio e.g. 3:1": "Rapport p. ex. 3:1",
"Squad Details": "Détails de l'escouade",
"Remove Day": "Retirer le jour",
"Start Time": "Heure de début",
"Squad": "Escouade",
"e.g. A": "p. ex. A",
"Block #": "Nº de bloc",
"e.g. 2": "p. ex. 2",
"Go to scoring": "Aller au pointage",
"Pins vs 200 avg": "Quilles c. moy. de 200",
"(all blocks so far)": "(tous les blocs jusqu'ici)",
"Go to": "Aller à la section",
"match play": "jeu par match",
"the stepladder": "finale à échelons",
"This block": "Les carreaux de ce bloc sont enregistrés dans l",
"s frames are logged under": "historique en date du",
", not": ", et non du",
"Move them to": "Les déplacer au",
"+ Game": "+ Partie",
"Tournaments usually move pairs after every game, so each game gets its own.": "En tournoi, on change généralement de paire d'allées après chaque partie; chaque partie a donc la sienne.",
"Pair": "Paire",
"Day Notes": "Notes du jour",
"Transition, ball reaction, what worked…": "Transition, réaction de la boule, ce qui a fonctionné…",
"Brackets & Side Pots": "Tableaux et cagnottes",
"Tracked separately from the main entry, so you can see which of these actually pay for themselves.": "Suivis séparément de l'inscription principale, pour voir lesquels sont vraiment rentables.",
"Label (optional)": "Nom (facultatif)",
"Entries": "Inscriptions",
"$ Each": "$ chacune",
"Cost $": "Coût $",
"won in brackets": "gagnés dans les tableaux",
"The head-to-head block after the cut. Bonus pins vary by tournament — set them to whatever this event uses.": "Le bloc en face-à-face qui suit le seuil de qualification. Le boni en quilles varie d'un tournoi à l'autre — inscrivez celui de cet événement.",
"Date bowled": "Date de jeu",
"Bonus per win": "Boni par victoire",
"Bonus per tie": "Boni par égalité",
"Match": "Match",
"by": "par",
"Track frames": "Saisir les carreaux",
"Opp hcp": "Hcp adv.",
"+ Add Match": "+ Ajouter un match",
"Go to the stepladder": "Aller à la finale à échelons",
"Sudden death, no bonus pins. Enter the seeds and the app works out where you finished.": "Mort subite, sans boni. Entrez les têtes de série et l'application calcule votre classement final.",
"e.g. 3": "p. ex. 3",
"Step": "Échelon",
"+ Add Step": "+ Ajouter un échelon",
"Steps": "Échelons",
"nothing further": "aucune",
"How it went": "Bilan",
"With handicap": "Avec handicap",
"Block": "Bloc",
"average over": "de moyenne sur",
"Bonus": "Boni",
"pins vs opponents": "quilles face aux adversaires",
"Best: match": "Meilleur : match",
"Worst: match": "Pire : match",
"On to": "Étape suivante :",
"Share this tournament": "Partager ce tournoi",
"is saved to your history. Bowling another block of it, or starting a new tournament?": "est enregistré dans votre historique. Vous jouez un autre bloc de ce tournoi ou vous en commencez un nouveau?",
"Another block": "Autre bloc",
"New tournament": "Nouveau tournoi",
"e.g. Spring Masters": "p. ex. Masters du printemps",
"e.g. Bowlero Pittsburgh": "p. ex. Bowlero Pittsburgh",
"Handicap per game": "Handicap par partie",
"e.g. 40": "p. ex. 40",
"Bowling with": "Vous jouez avec",
"Partner's name": "Nom de votre partenaire",
"Who bowls frame 1": "Qui joue le carreau 1",
"You bowl frames": "Vous jouez les carreaux",
"every game": "à chaque partie",
"in game 1, then you swap each game": "à la partie 1, puis vous alternez à chaque partie",
". The score stays out of your average since you did not bowl it alone, but your own frames still count.": ". Le pointage n'est pas compté dans votre moyenne puisque vous ne l'avez pas joué en solo, mais vos propres carreaux comptent quand même.",
"Alternate who leads off each game": "Alterner le premier carreau à chaque partie",
"+ Add Another Day or Block": "+ Ajouter un autre jour ou bloc",
"Cancel Tournament": "Annuler le tournoi",
"This deletes": "Cette action supprime",
"this tournament": "ce tournoi",
"— every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "— tous les blocs, lancers, pointages et tableaux saisis pour celui-ci — et vous ramène à l'Accueil. Cette action est irréversible.",
"Brackets and side pots": "Tableaux et cagnottes",
"Working out brackets and side pots as you go is part of the paid plan. Side games in league stay free.": "Le calcul des tableaux et des cagnottes en cours de route fait partie du forfait payant. Les cagnottes de ligue restent gratuites.",
"How did it finish?": "Comment le tournoi s'est-il terminé?",
"The stepladder says": "Selon la finale à échelons :",
"Anything worth remembering about it?": "Quelque chose à retenir?",
"Entry & Winnings": "Inscription et gains",
"The tournament payout only. Bracket and side pot winnings go on the Brackets tab.": "Les gains du tournoi seulement. Les gains des tableaux et des cagnottes vont dans l'onglet Tableaux.",
"Tournament buy in": "Inscription au tournoi",
"Tournament winnings": "Gains du tournoi",
"Brackets buy in": "Mises des tableaux",
"Brackets winnings": "Gains des tableaux",
"net": "net",
"Tournament Notes": "Notes du tournoi",
"Overall takeaways…": "Bilan général…",
"✓ Tournament Saved": "✓ Tournoi enregistré",
"Save & Finish Tournament": "Enregistrer et terminer le tournoi",
"Close this tournament and start a new one? It stays in your history.": "Fermer ce tournoi et en commencer un nouveau? Il restera dans votre historique.",
"Yes, close it": "Oui, le fermer",
"Keep working on it": "Continuer",
"Close tournament": "Fermer le tournoi",
"Side pot": "Cagnotte",
"Money": "Argent",
"Tournament Total": "Total du tournoi",
"All Days": "Tous les jours",
"scratch ·": "sans handicap ·",
"handicap pins": "quilles de handicap",
"← still standing": "← encore debout",
"Pins standing": "Quilles debout",
"Spare made?": "Réserve réussie?",
"← tap what fell": "← quilles tombées",
"Average over the last 13 games": "Moyenne des 13 dernières parties",
"Game 1": "Partie 1",
"Scores, or every ball": "Les pointages, ou chaque lancer",
"Arsenal · 3 balls": "Arsenal · 3 boules",
"47% strikes · 54% spares": "47% abats · 54% réserves",
"15lb · RG 2.5 / Diff 0.05": "15lb · RG 2.5 / Diff 0.05",
"45% strikes · 61% spares": "45% abats · 61% réserves",
"15lb · RG 2.57 / Diff 0.046": "15lb · RG 2.57 / Diff 0.046",
"45% strikes · 67% spares": "45% abats · 67% réserves",
"15lb · RG 2.49 / Diff 0.05": "15lb · RG 2.49 / Diff 0.05",
"Layouts, surface, specs": "Dispositions, surface, caractéristiques",
"Split Happens": "Split Happens",
"Tuesday House Shot · 4 bowlers": "Huilage maison du mardi · 4 membres",
"1. You": "1. Vous",
"2. Rob": "2. Rob",
"3. Kim": "3. Kim",
"4. Dee": "4. Dee",
"A league first, a team later": "La ligue d'abord, l'équipe ensuite",
"Mine": "Moi",
"Trends": "Suivi",
"Center": "Salle",
"On the road since Jul 9": "En route depuis le 9 juillet",
"First 700 series": "Premier triple de 700",
"4 pins short · best 696": "Il manque 4 quilles · meilleur : 696",
"September": "Septembre",
"10 Sep": "10 sept.",
"Lanes broke down early. Moved left 3 and it came back.": "L'huile s'est dégradée tôt. Un déplacement de 3 planches vers la gauche, et c'est revenu.",
"Settings › Walkthroughs": "Paramètres › Visites guidées",
"Tonight's scores": "Pointages de ce soir",
"Game 2": "Partie 2",
"Game 3": "Partie 3",
"Three numbers and you're done": "Trois nombres et le tour est joué",
"Frame 4 · Ball 1": "Carreau 4 · Lancer 1",
"Other leave": "Autres quilles",
"How it hit": "Impact de la boule",
"Flush": "Pleine poche",
"Messenger": "Messagère",
"Frame over — no pins to pick": "Carreau terminé — aucune quille à choisir",
"Frame 5 · left standing": "Carreau 5 · quilles restantes",
"Tap the pins, then answer": "Touchez les quilles, puis répondez",
"Frame 6 · left standing": "Carreau 6 · quilles restantes",
"None fell? Just save": "Aucune n'est tombée? Enregistrez, tout simplement",
"vs average": "Par rapport à la moyenne",
"Brackets": "Tableaux",
"Standard": "Standard",
"Baker": "Baker",
"Scratch": "Sans handicap",
"Format": "Format",
"10 pin": "10 quilles",
"9 pin no-tap": "Abat à 9 quilles",
"Mix them however the event runs": "Combinez-les selon la formule du tournoi",
"Qualifying": "Qualification",
"Match Play": "Jeu par match",
"Stepladder": "Échelons",
"Day 1": "Jour 1",
"Day 2": "Jour 2",
"Cut": "Seuil",
"1812 of 1750 across 8 games (all blocks so far).": "1812 pour un seuil de 1750 en 8 parties (tous les blocs jusqu'ici).",
"Where you stand, updated every game": "Votre position, mise à jour à chaque partie",
"Qualified for": "Qualification pour",
"Match play": "Jeu par match",
"N/A": "Aucune",
"Go to match play": "Passer au jeu par match",
"The margin already said you made it": "La marge indiquait déjà votre qualification",
"Match 1": "Match 1",
"WIN": "VICTOIRE",
"by 23": "par 23",
"Track frames (G1)": "Suivre les carreaux (P1)",
"Them": "Adv.",
"Game 1 again — qualifying doesn't follow you here": "On repart à la partie 1 — la qualification ne compte pas ici",
"Record": "Fiche",
"Bonus pins": "Quilles de boni",
"Your seed": "Votre rang",
"Step 2": "Échelon 2",
"LOSS": "DÉFAITE",
"by 11": "par 11",
"Seed": "Rang",
"2nd": "2e",
"Finished": "Rang final",
"Won one step, then out to the 2 seed.": "Un échelon gagné, puis élimination contre la 2e tête de série.",
"Worked out from your seed — never asked": "Calculé à partir de votre rang — on ne vous le demande jamais",
"8 games": "8 parties",
"Every phase, and what it paid": "Chaque phase, et ce qu'elle a rapporté",
"Choose file": "Choisir un fichier",
"What changed": "Ce qui a changé",
"Your Bionic is carrying 8% better than the Phaze II on this pattern — 61% against 53% over 94 first balls.": "Votre Bionic a un taux d'abats supérieur de 8 points à celui de la Phaze II sur ce patron d'huilage — 61 % contre 53 % sur 94 premiers lancers.",
"10 pin conversion": "Réserves de la quille 10",
"18 more": "Encore 18",
"Six of your eight opens were single-pin leaves — the 10 alone cost you 27 pins. The Bionic carried everything in game three; it was the one you finished on.": "Sur vos huit carreaux ouverts, six ne laissaient qu'une quille — la quille 10 à elle seule vous a coûté 27 quilles. La Bionic a tout fait tomber à la troisième partie; c'est avec elle que vous avez terminé.",
"Ryan's night": "La soirée de Ryan",
"Her lamp, on every screen": "Sa lampe, sur chaque écran",
"Brooklyn": "Brooklyn",
"2 wishes left today": "2 vœux restants aujourd'hui",
"Which ball should I start on next week?": "Avec quelle boule devrais-je commencer la semaine prochaine?",
"On a 37-foot pattern you've struck more with the Bionic every time out. Start there.": "Sur un patron de 37 pieds, vous avez fait plus d'abats avec la Bionic chaque fois. Commencez avec elle.",
"Read this to the bowler": "Lisez ce code à l'élève",
"7KPQ-2M4R": "7KPQ-2M4R",
"Works once, for the next 7 days": "Valide une seule fois, pendant les 7 prochains jours",
"Works once, on their phone": "Valide une seule fois, sur le téléphone de l'autre personne",
"I": "C",
"m bowling": "est moi qui joue",
"m coaching": "est moi qui entraîne",
"Dana Reyes": "Dana Reyes",
"Sam Ortiz": "Sam Ortiz",
"A dot means they answered something": "Un point signifie que l'élève a répondu à quelque chose",
"From 412 shots": "Sur 412 lancers",
"18 Mar · Tuesday Classic": "18 mars · Classique du mardi",
"11 Mar · Tuesday Classic": "11 mars · Classique du mardi",
"How much data it": "Sur combien de données ça s",
"s built on, beside it": "appuie, juste à côté",
"New task": "Nouvelle tâche",
"Metric": "Mesure",
"Leave the target off if it isn": "Laissez l'objectif vide si ce n",
"t a number": "est pas un nombre",
"Open": "En cours",
"Clean up the single-pin spares": "Réussir les réserves d'une quille",
"Target 60%": "Objectif 60%",
"due 1 Apr": "d'ici le 1er avril",
"Reached 58% so far": "Atteint jusqu'ici : 58%",
"Mark done": "Terminée",
"Record attempt": "Noter une tentative",
"What came back, not just what was asked": "Ce qui en est ressorti, pas seulement ce qui était demandé",
"By ball · strike rate": "Par boule · taux d'abats",
"Bionic": "Bionic",
"Phaze II": "Phaze II",
"Zen Master": "Zen Master",
"You vs Split Happens": "Vous contre Split Happens",
"Rob": "Rob",
"Team average": "Moyenne de l'équipe",
"Same measure, same scale": "Même mesure, même échelle",
"Ball · strike rate": "Boule · taux d'abats",
"61% · 94 shots": "61% · 94 lancers",
"47% · 8 more shots needed": "47% · encore 8 lancers requis",
"Questions it can answer": "Les questions auxquelles cela répond",
"Which ball carries best?": "Quelle boule donne le plus d'abats?",
"Where is a spare leaking?": "Quelles réserves est-ce que je rate?",
"Do I fall off in game three?": "Est-ce que je faiblis à la troisième partie?",
"Jan": "janv.",
"Mar": "mars",
"Last 90 days": "90 derniers jours",
"Showing 13 of 40 games": "13 parties affichées sur 40",
"All balls": "Toutes les boules",
"Only games and shots recorded with this ball. Games with no ball noted are left out.": "Seulement les parties et les lancers enregistrés avec cette boule. Les parties sans boule indiquée sont exclues.",
"across every league": "dans toutes les ligues",
"averaging": "moyenne de",
"· high": "· meilleure partie",
", low": ", plus faible",
". The spread is": ". La dispersion des pointages est de",
"pins — that's what a nightly average hides.": "quilles — voilà ce que cache une moyenne par soirée.",
"Show": "Afficher",
"Last": "Les",
"days": "derniers jours",
"This one needs frame tracking. You're on game tracking, so there's nothing to plot here yet.": "Cette statistique nécessite le suivi par carreau. Vous êtes en suivi par partie, alors il n'y a encore rien à tracer ici.",
"Need at least 2 nights logged before there's a line to draw.": "Il faut au moins 2 soirées enregistrées pour pouvoir tracer une ligne.",
"Per game": "Par partie",
"Per night": "Par soirée",
"Every game": "Par partie",
"Share this trend": "Partager cette tendance",
"Nights here average": "Les soirées affichées comptent en moyenne",
"attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.": "tentatives, ce qui est peu — chaque point variera beaucoup, même si rien n'a changé dans votre jeu.",
"Latest": "Plus récent",
"Free trial —": "Essai gratuit —",
"left": "",
"Your subscription starts when the trial ends.": "Votre abonnement commence à la fin de l'essai.",
"Thanks for bowling with us": "Merci de jouer avec nous",
"You are on the monthly plan. The yearly plan works out cheaper — switch any time.": "Vous avez le forfait mensuel. Le forfait annuel revient moins cher — changez quand vous voulez.",
"See the yearly plan": "Voir le forfait annuel",
"'Archivo', system-ui, -apple-system, sans-serif": "",
"'Roboto Condensed', 'Archivo', system-ui, sans-serif": "",
"This": "Ce contenu",
"check it against what you saw on the lane": "vérifiez par rapport à ce que vous avez vu sur l'allée",
"was": "a été",
"by AI. It can be confidently wrong —": "par l'IA, qui peut se tromper avec aplomb —",
"Other bowlers reported the shared specs for ⟨0⟩ as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "D'autres personnes ont signalé comme inexactes les caractéristiques partagées de ⟨0⟩; elles ont donc été retirées. Vous avez toujours la boule — entrez simplement ses détails de nouveau quand vous aurez un moment.",
"best ⟨0⟩": "meilleure : ⟨0⟩",
"Now: ⟨0⟩": "Actuel : ⟨0⟩",
"Which pins did the second ball knock down? ⟨0⟩ this frame": "Quelles quilles le deuxième lancer a-t-il abattues? ⟨0⟩ au total dans ce carreau",
"⟨0⟩ isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "⟨0⟩ n'est pas servi lors d'une soirée au système Baker — les carreaux appartiennent au duo, pas à une seule personne.",
"This league usually runs ⟨0⟩. Anything you set here is for tonight only.": "Patron habituel de cette ligue : ⟨0⟩. Ce que vous réglez ici ne vaut que pour ce soir.",
"This deletes tonight's shots, game scores and match points for ⟨0⟩ in ⟨1⟩, clears the setup, and takes you back to Home. This cannot be undone.": "Cette action supprime les lancers, les pointages des parties et les points de match de ce soir pour ⟨0⟩ dans ⟨1⟩, efface la préparation et vous ramène à l'Accueil. Cette action est irréversible.",
"First ball: ⟨0⟩": "Premier lancer : ⟨0⟩",
"Second ball: ⟨0⟩": "Deuxième lancer : ⟨0⟩",
"Done⟨0⟩": "Terminé⟨0⟩",
"This deletes today's practice shots and game scores for ⟨0⟩ and takes you back to Home. This cannot be undone.": "Cette action supprime les lancers d'entraînement et les pointages des parties d'aujourd'hui pour ⟨0⟩ et vous ramène à l'Accueil. Cette action est irréversible.",
"Where do you bowl? ⟨0⟩": "Où jouez-vous? ⟨0⟩",
"⟨0⟩ — a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "⟨0⟩ — une soirée qui n'apparaît pas, des pointages saisis sur un autre téléphone ou des stats qui ne bougent plus même si vous avez continué à jouer.",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app. ⟨0⟩, and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": "Cette option envoie tout ce qui attend encore d'être enregistré, puis télécharge de nouveau tout votre historique à partir de zéro et recharge l'application. ⟨0⟩, et rien de ce que vous avez enregistré ne peut être perdu. Cela utilise plus de données qu'une ouverture normale et peut prendre quelques instants pour une longue saison; mieux vaut donc être connecté au Wi-Fi.",
"Questions, or want your data deleted? ⟨0⟩": "Des questions ou une demande de suppression de vos données? ⟨0⟩",
"This deletes your account and ⟨0⟩ — every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "Cette action supprime votre compte et ⟨0⟩ — chaque lancer et chaque séance, votre profil et votre nom, votre arsenal, vos objectifs et votre place dans toute équipe. Vous ne pourrez plus vous reconnecter, et nous ne pourrons rien récupérer.",
"Want a copy first? Use ⟨0⟩ above before you do this.": "Vous voulez d'abord une copie? Utilisez ⟨0⟩ ci-dessus avant de continuer.",
"Type ⟨0⟩ to confirm": "Entrez ⟨0⟩ pour confirmer",
"The same email has a sign-in link in it, if you'd rather tap that.⟨0⟩The code lasts an hour.": "Le même courriel contient aussi un lien de connexion, si vous préférez toucher ce lien.⟨0⟩Le code est valide pendant une heure.",
"⟨0⟩or⟨1⟩": "⟨0⟩ou⟨1⟩",
"⟨0⟩ Weakest": "⟨0⟩ Plus faible",
"⟨0⟩ Strongest": "⟨0⟩ Plus fort",
"⟨0⟩ Everything else": "⟨0⟩ Tout le reste",
"⟨0⟩ Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "⟨0⟩ Tout est déjà débloqué pour vous, peu importe la facturation. Vous pouvez quand même acheter ci-dessous pour tester le paiement.",
"Every league and team you bowl in ⟨0⟩": "Toutes les ligues et équipes où vous jouez ⟨0⟩",
"⟨0⟩ is saved to your history. Bowling another block of it, or starting a new tournament?": "⟨0⟩ est enregistré dans votre historique. Vous jouez un autre bloc de ce tournoi ou vous en commencez un nouveau?",
"⟨0⟩Alternate who leads off each game": "⟨0⟩Alterner qui commence chaque partie",
"This deletes ⟨0⟩ — every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "Cette action supprime ⟨0⟩ — tous les blocs, lancers, pointages et tableaux qui y sont associés — et vous ramène à l'Accueil. Cette action est irréversible.",
"⟨0⟩Import": "⟨0⟩Importer",
"Match 1 ⟨0⟩⟨1⟩": "Match 1 ⟨0⟩⟨1⟩",
"Step 2 ⟨0⟩⟨1⟩": "Échelon 2 ⟨0⟩⟨1⟩",
"Which ball carries best?⟨0⟩Where is a spare leaking?⟨1⟩Do I fall off in game three?": "Quelle boule donne le plus d'abats?⟨0⟩Quelles réserves est-ce que je rate?⟨1⟩Est-ce que je faiblis à la troisième partie?",
"up": "en hausse",
"down": "en baisse",
"they": "l'équipe",
"they're": "cette personne est",
"year": "an",
"month": "mois",
"yearly": "annuel",
"monthly": "mensuel",
"frames": "carreaux",
"nights": "soirées",
"now": "maintenant",
"mixed": "mixte",
"unnamed": "sans nom",
"(me)": "(moi)",
"That was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "Cette réponse a été écrite par l'IA, qui peut se tromper avec aplomb — vérifiez-la par rapport à ce que vous avez vu sur l'allée.",
"This scorecard was read by AI. It can be confidently wrong — check the numbers against the card before saving.": "Cette feuille de pointage a été lue par l'IA, qui peut se tromper avec aplomb — vérifiez les chiffres par rapport à la feuille avant d'enregistrer.",
"This list was found by AI. It can be confidently wrong — check the name and address before you rely on it.": "Cette liste a été trouvée par l'IA, qui peut se tromper avec aplomb — vérifiez le nom et l'adresse avant de vous y fier.",
"⟨0⟩ wants to be your coach.": "⟨0⟩ souhaite devenir votre entraîneur.",
"⟨0⟩ wants to be your bowler.": "⟨0⟩ vous demande de l'entraîner.",
"Automatic": "Automatique",
"Automatic · ⟨0⟩": "Automatique · ⟨0⟩",
"Automatic follows your phone's language. Changing it restarts the app.": "Le mode automatique suit la langue de votre téléphone. Changer de langue redémarre l'application.",
"theme::Light": "Clairs",
"theme::Dark": "Foncés",
"hit::High": "Plein",
"hit::Light": "Mince",
"hit::Brooklyn": "Coup croisé",
"confidence::Clear": "Élevée",
"Analysis came back empty. Try again.": "L'analyse est revenue vide. Réessayez.",
"Analysis came back malformed. Try again.": "L'analyse est revenue incomplète. Réessayez.",
"Couldn't generate insights right now.": "Impossible de produire les analyses pour le moment.",
"Insights aren't configured on the server.": "Les analyses ne sont pas configurées sur le serveur.",
"Insights is part of the paid plan.": "Les analyses font partie du forfait payant.",
"Not enough data yet to analyse.": "Pas encore assez de données à analyser.",
"You've used this quite a lot in the last hour. Give it a little while and try again.": "Vous avez beaucoup utilisé cette fonction au cours de la dernière heure. Attendez un peu, puis réessayez.",
"Ask me something.": "Posez-moi une question.",
"Brooklyn only answers on the paid plan.": "Brooklyn répond seulement avec le forfait payant.",
"Sign in first.": "Connectez-vous d'abord.",
"That's a lot. Try asking me one thing.": "C'est beaucoup. Posez-moi une seule question.",
"The lamp is cold. Try again later.": "La lampe est froide. Réessayez plus tard.",
"The lamp went quiet. Try again in a moment.": "La lampe s'est tue. Réessayez dans un moment.",
"You've used all three today. The lamp recharges tomorrow.": "Vous avez utilisé vos trois questions aujourd'hui. La lampe se recharge demain.",
"Subscriptions are not available yet.": "Les abonnements ne sont pas encore offerts.",
"That plan is not available right now.": "Ce forfait n'est pas offert pour le moment.",
"Too many attempts. Try again shortly.": "Trop de tentatives. Réessayez sous peu.",
"You already have a subscription.": "Vous avez déjà un abonnement.",
"Could not open the subscription manager.": "Impossible d'ouvrir la gestion de l'abonnement.",
"No Stripe subscription found for this account.": "Aucun abonnement Stripe trouvé pour ce compte.",
"Subscription management is not available yet.": "La gestion de l'abonnement n'est pas encore offerte.",
"Account deletion isn't configured on the server. Email support@mybowlingjourney.com and we'll do it by hand.": "La suppression de compte n'est pas configurée sur le serveur. Écrivez à support@mybowlingjourney.com et nous la ferons nous-mêmes.",
"Account deletion isn't configured on the server.": "La suppression de compte n'est pas configurée sur le serveur.",
"Couldn't delete the account just then. Try again, or email support@mybowlingjourney.com.": "Impossible de supprimer le compte pour le moment. Réessayez ou écrivez à support@mybowlingjourney.com.",
"Not authenticated.": "Vous n'êtes pas connecté à votre compte.",
"Not authenticated": "Vous n'êtes pas connecté à votre compte.",
"A location is needed to search nearby centers.": "Une position est nécessaire pour chercher les salles de quilles à proximité.",
"Location search isn't configured on the server.": "La recherche par position n'est pas configurée sur le serveur.",
"One of the images is too large. Try a smaller photo.": "Une des images est trop grande. Essayez une photo plus petite.",
"One of the images was empty or malformed.": "Une des images était vide ou illisible.",
"Scorecard import is part of the paid plan.": "L'importation de feuilles de pointage fait partie du forfait payant.",
"The import service can't check its limits right now. Try again shortly.": "Le service d'importation ne peut pas vérifier ses limites pour le moment. Réessayez sous peu.",
"The scorecard reader isn't available right now.": "Le lecteur de feuilles de pointage n'est pas disponible pour le moment.",
"Those images come to too much to send at once. Try fewer at a time.": "Ces images sont trop lourdes pour être envoyées en une seule fois. Essayez-en moins à la fois.",
"Too many images in one request (max 6)": "Trop d'images dans une même demande (6 au maximum)",
"You've imported a lot in the last hour. Give it a little while and try again.": "Vous avez beaucoup importé au cours de la dernière heure. Attendez un peu, puis réessayez.",
"No images provided": "Aucune image fournie",
"Nightcap isn't configured on the server.": "Le Nightcap n'est pas configuré sur le serveur.",
"Not enough logged tonight for a nightcap.": "Pas assez de données enregistrées ce soir pour un Nightcap.",
"That's a few nightcaps in one hour. Give it a little while and try again.": "Ça fait quelques Nightcaps en une heure. Attendez un peu, puis réessayez.",
"The Nightcap is part of the paid plan.": "Le Nightcap fait partie du forfait payant.",
"The nightcap came back empty. Tap to try again.": "Le Nightcap est revenu vide. Touchez pour réessayer.",
"The nightcap came back malformed. Tap to try again.": "Le Nightcap est revenu incomplet. Touchez pour réessayer.",
"The nightcap came back thin. Tap to try again.": "Le Nightcap est revenu trop mince. Touchez pour réessayer.",
"The nightcap took too long. Tap to try again.": "Le Nightcap a pris trop de temps. Touchez pour réessayer.",
"Could not record that purchase.": "Impossible d'enregistrer cet achat.",
"Could not verify that purchase.": "Impossible de vérifier cet achat.",
"Purchases are not available yet.": "Les achats ne sont pas encore offerts.",
"That purchase could not be verified.": "Cet achat n'a pas pu être vérifié.",
"My Groups": "Mes groupes",
"none here": "aucun lancer ici",
"At a glance": "En un coup d'œil",
"Spares": "Réserves",
"Language · Langue": "Language · Langue",
"Français (Canada)": "Français (Canada)",
"English": "English",
"1 Apr": "1er avr.",
"18 Mar 2026": "18 mars 2026",
"22 Mar": "22 mars",
"Tue": "Mardi",
"✓ High game": "✓ Meilleure partie",
"✓ Quarter game": "✓ Partie à 25 sous",
"✓ Dollar game": "✓ Partie à 1 dollar",
"✓ 3-6-9 (whole night)": "✓ 3-6-9 (toute la soirée)",
"Free fall against string pins. Set the rack type on two centers — or on one mixed house, with its free-fall lanes.": "Chute libre contre planteuse à ficelles. Indiquez le type de planteuse de deux salles de quilles — ou d'une seule salle mixte, avec ses allées à chute libre.",
"Right-handed, backup": "Droitier, effet inversé",
"Left-handed, backup": "Gaucher, effet inversé",
"Tournament buy in $": "Inscription au tournoi ($)",
"Tournament winnings $": "Gains du tournoi ($)",
"milestones": "jalons",
"Spring Masters": "Classique du printemps",
"Changing the language": "Changer la langue",
"Language · Langue in Settings. Automatic follows your phone's language, or pick Français (Canada) or English. The app restarts in the language you pick.": "Language · Langue dans les Paramètres. Le mode automatique suit la langue de votre téléphone; vous pouvez aussi choisir Français (Canada) ou English. L'application redémarre dans la langue choisie.",
"Quarter $": "25 sous ($)",
"Dollar $": "1 dollar ($)",
"left lane": "",
"right lane": "",
"left handed": "gaucher",
"Automatic ·": "Automatique ·",
"Suivi de quilles": "Suivi de quilles",
"End League & View Results": "Terminer et voir les résultats",
"End Practice & View Results": "Terminer et voir les résultats",
"End Tournament & View Results": "Terminer et voir les résultats",
"End Open Bowling & View Results": "Terminer et voir les résultats",
"End Session & View Results": "Terminer et voir les résultats",
"Save & Finish League": "Enregistrer et terminer la soirée",
"Save & Finish Practice": "Enregistrer et terminer l'entraînement",
"Save & Finish Open Bowling": "Enregistrer et terminer le jeu libre",
"Save & Finish Session": "Enregistrer et terminer la séance",
"10-pin": "Quille 10",
"degrees": "degrés",
"rpm": "tr/min",
"mph": "mi/h",
"hand::R": "D",
"hand::L": "G",
"title::Inbox": "Notifications",
"title::Import scorecard": "Importation",
"tab::Clean frames": "Fermés",
"tab::Other leaves": "Autres",
"tab::First ball": "1er lancer",
"tab::10-pin": "Quille 10",
"tab::Stepladder": "Échelons",
"converted": "de réussite",
"G1": "P1",
"G2": "P2",
"G3": "P3",
"G4": "P4",
"G5": "P5",
"G6": "P6",
"Two-sided": "Des deux côtés",
"Runner-up": "Deuxième place",
"Pin-to-PAP": "Pin-to-PAP",
"Pin-to-COG": "Pin-to-COG",
"Won $": "Gains ($)",
"placeholder::Score": "Pts",
"— choose a ball —": "— boule —",
"field::Rev rate": "Rotation",
"field::Breakpoint": "Rupture",
"field::Axis rot.": "Rot. axe",
"field::Axis tilt": "Incl. axe",
"field::Sole #": "Semelle",
"field::Heel #": "Talon",
"tile::High game": "Partie max.",
"tile::High series": "Triple max.",
"pin::1 pin": "Quille 1",
"pin::2 pin": "Quille 2",
"pin::3 pin": "Quille 3",
"pin::4 pin": "Quille 4",
"pin::5 pin": "Quille 5",
"pin::6 pin": "Quille 6",
"pin::7 pin": "Quille 7",
"pin::8 pin": "Quille 8",
"pin::9 pin": "Quille 9",
"pin::10 pin": "Quille 10",
"badges::All": "Tous",
"tile::League average": "Moy. de ligue",
"All nights": "Toutes",
"placeholder::board #": "pl.",
"placeholder::degrees": "°",
"Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": "Google Play indique si un essai gratuit s'applique à votre compte avant que vous confirmiez, puis l'abonnement se renouvelle automatiquement jusqu'à ce que vous l'annuliez.",
"Pro": "Pro",
"Reading your question…": "Lecture de votre question…",
"questions today. Ask again tomorrow.": "",
"Brooklyn couldn't answer that right now. Try again in a few minutes.": "Brooklyn n'a pas pu répondre pour l'instant. Réessayez dans quelques minutes.",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She has her own card at the top of Improve. Three questions a day.": "Les écrans Stats couvrent les chiffres habituels. Brooklyn est là pour les questions auxquelles ils ne répondent pas — posez vos questions sur votre propre jeu en termes simples, et elle trouve la réponse à partir de ce que vous avez enregistré. Si elle a besoin de quelque chose que vous ne suivez pas encore, elle vous dira quoi commencer à enregistrer. Elle a sa propre carte en haut de l'onglet Progresser. Trois questions par jour.",
"2 questions left today": "2 questions restantes aujourd'hui",
"Brooklyn isn't available right now. Try again later.": "Brooklyn n'est pas disponible pour l'instant. Réessayez plus tard.",
"You've used all three questions today. Ask again tomorrow.": "Vous avez utilisé vos trois questions aujourd'hui. Revenez demain.",
"Brooklyn couldn't answer that. Try again in a moment.": "Brooklyn n'a pas pu répondre. Réessayez dans un moment.",
"Brooklyn took too long to answer. Try again.": "Brooklyn a mis trop de temps à répondre. Réessayez.",
"AI": "IA",
"tab::AI": "IA",
"On the Improve tab, open Goals, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "Dans l'onglet Progresser, ouvrez Objectifs, appuyez sur Ajouter un objectif et choisissez sur quoi travailler — moyenne, taux d'abats, taux de réserves, etc. La progression se met à jour à mesure que vous jouez.",
"Start a drill from the Goals tab on Improve. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "Commencez un exercice à partir de l'onglet Objectifs de Progresser. Choisissez une cible — une réserve précise ou une combinaison de quilles — et l'application compte les réussites et les ratés pour cette séance.",
"Improve has a Coach tab. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "Progresser comporte un onglet Entraîneur. Indiquez dans quel sens ça va — « Je suis l'élève » ou « Je l'entraîne » — et créez un code. Dictez les huit caractères à l'autre personne, elle l'entre sur son propre téléphone, et le lien est établi.",
"+6%": "",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She's on the AI tab of Improve, below Insights. Three questions a day.": "Les écrans Stats couvrent les chiffres habituels. Brooklyn est là pour les questions auxquelles ils ne répondent pas — posez vos questions sur votre propre jeu en termes simples, et elle trouve la réponse à partir de ce que vous avez enregistré. Si elle a besoin de quelque chose que vous ne suivez pas encore, elle vous dira quoi commencer à enregistrer. Elle se trouve dans l'onglet IA de Progresser, sous les analyses. Trois questions par jour.",
"no reading": "",
"more than one bowler": "",
"not a card with drawn racks": "",
"Press Import in the header. Say whether it's practice or league, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving. Tournaments aren't imported: log them live on Bowl, where squads, blocks, match play and stepladder are all tracked.": "Appuyez sur Importer dans l'en-tête. Indiquez s'il s'agit d'entraînement ou de ligue, choisissez l'équipe et la date, puis ajoutez des photos de l'écran de pointage. L'application lit les parties et les carreaux, et vous associez chaque colonne à la bonne personne avant d'enregistrer. Les tournois ne s'importent pas : enregistrez-les en direct dans Jouer, où les escouades, les blocs, le jeu par match et les échelons sont tous suivis.",
"⚠️ Check the flagged ball below — it couldn't be reliably read from the image.": "⚠️ Vérifiez le lancer signalé ci-dessous — il n'a pas pu être lu de façon fiable à partir de l'image.",
"⚠️ Check the flagged balls below — they couldn't be reliably read from the image.": "⚠️ Vérifiez les lancers signalés ci-dessous — ils n'ont pas pu être lus de façon fiable à partir de l'image.",
"This frame couldn't be read from the image.": "Ce carreau n'a pas pu être lu à partir de l'image.",
"▾ Hide frames": "▾ Masquer les carreaux",
"▸ Check frames": "▸ Vérifier les carreaux",
"✓ This is right": "✓ C'est exact",
"Waiting for an app update to finish": "En attente de la fin d'une mise à jour de l'appli",
"The cloud isn't ready for this yet. Nothing is lost on this phone; it will upload once the update is complete.": "Le nuage n'est pas encore prêt pour ceci. Rien n'est perdu sur ce téléphone; l'envoi se fera une fois la mise à jour terminée.",
"queued behind an earlier write for this row": "en attente derrière une modification précédente de cet élément",
"The free plan covers one team, and you're already on one. Upgrade to Pro to add another?": "Le forfait gratuit comprend une équipe, et vous en faites déjà partie d'une. Passer à Pro pour en ajouter une autre?",
"Sign in with this link?": "Se connecter avec ce lien?",
"Text": "Texto",
"Your home centers": "Vos salles de quilles habituelles",
"Somewhere else?": "Ailleurs?",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with a code, you get one to text them and they enter it when they sign up; with their email, they're linked the moment they sign in with that exact address.": "Réserve sa place dans la liste des joueurs dès maintenant — vous pouvez commencer tout de suite à enregistrer ses pointages sous son nom dans « Pointage tenu pour », sans qu'un compte soit nécessaire pour l'instant. Dans les deux cas, la personne réclame elle-même sa place et tout ce que vous avez enregistré s'y trouve déjà : avec un code, vous en recevez un à lui envoyer par texto et elle l'entre au moment de s'inscrire; avec son courriel, elle y est liée dès qu'elle se connecte avec cette adresse exacte.",
"Filled in from your note — check it's the right game.": "Rempli à partir de votre note — vérifiez que c'est la bonne partie.",
"(pending)": "(en attente)",
"Couldn't tell which league this night belongs to. Reload the app and try again.": "Impossible de savoir à quelle ligue appartient cette soirée. Rechargez l'application et réessayez.",
"Couldn't change your name without a connection. Try again when you're back online.": "Impossible de changer votre nom sans connexion. Réessayez une fois de retour en ligne.",
"Couldn't change your name. Try again in a moment.": "Impossible de changer votre nom. Réessayez dans un instant.",
"No spare ball. A plastic ball goes straight at corner pins without hooking.": "Aucune boule de réserve. Une boule de plastique va droit sur les quilles de coin sans crochet.",
"it can't": "elle ne peut pas",
"they can't": "elles ne peuvent pas",
"Nothing strong enough for heavy oil or a fresh pattern.": "Rien d'assez fort pour l'huile abondante ou un patron frais.",
"Nothing weak enough for dry lanes or late in a block when the lanes burn up.": "Rien d'assez faible pour les allées sèches ou la fin d'un bloc quand l'huile est brûlée.",
"No ball with a sharp, angular back end for when you need it to turn the corner.": "Aucune boule au retour angulaire pour tourner le coin quand il le faut.",
"No smooth, controllable ball for when the back end is too strong.": "Aucune boule progressive et contrôlable pour quand le retour est trop fort.",
"Bag": "Sac",
"The Caddie couldn't answer just then. Tap to try again.": "Le Caddie n'a pas pu répondre. Touchez pour réessayer.",
"Arsenal analysis": "Analyse de l'arsenal",
"Add your balls on the Balls tab, with their cover and core, and this maps where each one sits and what your bag is missing.": "Ajoutez vos boules dans l'onglet Boules, avec leur enrobage et leur noyau, et vous verrez où chacune se situe et ce qui manque à votre sac.",
"Compare bags": "Comparer les sacs",
"Where each ball sits, from its cover, surface, core and layout — cover and surface count most, because they're what touches the lane. Positions are estimates from specs; your scores show what actually worked.": "Où se situe chaque boule, selon son enrobage, sa surface, son noyau et son perçage — l'enrobage et la surface comptent le plus, car ce sont eux qui touchent l'allée. Les positions sont des estimations tirées des spécifications; vos pointages montrent ce qui a vraiment fonctionné.",
"First bag": "Premier sac",
"Second bag": "Deuxième sac",
"No ball here has the specs this chart needs yet.": "Aucune boule ici n'a encore les spécifications nécessaires à ce graphique.",
"◯ in both": "◯ dans les deux",
"⟨0⟩ Solid": "⟨0⟩ Solide",
"⟨0⟩ Hybrid": "⟨0⟩ Hybride",
"⟨0⟩ Pearl": "⟨0⟩ Nacré",
"● Faded: specs incomplete": "● Pâle : spécifications incomplètes",
"Bags side by side": "Les sacs côte à côte",
"Strength": "Force",
"Length": "Longueur",
"Back end": "Retour",
"No ball is in both bags.": "Aucune boule n'est dans les deux sacs.",
"A wider range means the bag covers more conditions.": "Un écart plus large veut dire que le sac couvre plus de conditions.",
"Your balls": "Vos boules",
"This bag is empty.": "Ce sac est vide.",
"What the arsenal is missing": "Ce qui manque à l'arsenal",
"What this bag is missing": "Ce qui manque à ce sac",
"Nothing obvious — it covers strong to weak, smooth to sharp, and has a spare ball.": "Rien d'évident — il couvre du fort au faible, du progressif à l'angulaire, et a une boule de réserve.",
"From the catalog:": "Dans le catalogue :",
"The Caddie": "Le Caddie",
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.": "Votre caddie lit tout le sac — quelle boule pour quelle condition, quel sac est bien monté, quoi ajouter et quoi laisser à la maison. Ça fait partie du forfait payant.",
"See the plan": "Voir le forfait",
"🏌️ The Caddie": "🏌️ Le Caddie",
"Asks which of these two bags is built for what.": "Demande lequel de ces deux sacs est monté pour quoi.",
"Reads the whole arsenal: each ball's job, your bags, and what to add or leave home.": "Lit tout l'arsenal : le rôle de chaque boule, vos sacs, et quoi ajouter ou laisser à la maison.",
"The Caddie is looking over the bag…": "Le Caddie examine le sac…",
"Ask the Caddie": "Demander au Caddie",
"Add cover and core to at least one ball first.": "Ajoutez d'abord l'enrobage et le noyau d'au moins une boule.",
"Spare ball": "Boule de réserve",
"Scores well": "Performe bien",
"Below average": "Sous la moyenne",
"Not placed — add cover and core": "Non placée — ajoutez l'enrobage et le noyau",
"games ·": "parties ·",
"No specs entered": "Aucune spécification saisie",
"Surface:": "Surface :",
"not recorded": "non inscrit",
"(reading it as out of the box)": "(lue comme sortie de la boîte)",
"Layout:": "Perçage :",
"· Length": "· Longueur",
"· Back end": "· Retour",
"games at": "parties à",
"By part of the night:": "Selon le moment de la soirée :",
"No games logged with it yet.": "Aucune partie inscrite avec elle pour l'instant.",
"Each ball's job": "Le rôle de chaque boule",
"Gaps": "Lacunes",
"Next in the bag:": "Prochaine dans le sac :",
"Leave at home:": "À laisser à la maison :",
"The Caddie's read": "La lecture du Caddie",
"it's working from specs and your logged games, not from watching you throw": "il se fie aux spécifications et à vos parties inscrites, pas à votre lancer",
"Ask again": "Redemander",
"ArsenalAnalysis": "ArsenalAnalysis",
"Weak": "Faible",
"Benchmark": "Référence",
"Strong": "Forte",
"Early": "Tôt",
"Mid-lane": "Mi-allée",
"Long": "Longue",
"Smooth": "Progressive",
"Controlled": "Contrôlée",
"Sharp": "Angulaire",
"Light oil / late in the block": "Huile légère / fin de bloc",
"Medium oil": "Huile moyenne",
"Heavy oil / fresh": "Huile abondante / début",
"Length × Back end": "Longueur × Retour",
"Where each ball starts to hook, and how it turns. Bigger dots are stronger balls.": "Où chaque boule commence à crocheter, et comment elle tourne. Les plus gros points sont les boules les plus fortes.",
"Length × Strength": "Longueur × Force",
"The ladder: strongest at the top for fresh or heavy oil, weakest at the bottom for dry lanes and late in the block.": "L'échelle : les plus fortes en haut pour l'huile fraîche ou abondante, les plus faibles en bas pour les allées sèches et la fin d'un bloc.",
"RG × Differential": "RG × Différentiel",
"Low RG (revs early)": "RG bas (tourne tôt)",
"High RG (revs late)": "RG élevé (tourne tard)",
"Low diff (less flare)": "Différentiel bas (moins de flare)",
"High diff (more flare)": "Différentiel élevé (plus de flare)",
"The core alone, as the maker's numbers. Bigger dots are more asymmetric.": "Le noyau seul, selon les chiffres du fabricant. Les plus gros points sont les plus asymétriques.",
"Compare your bags, and ask the Caddie": "Comparez vos sacs et demandez au Caddie",
"Where each ball sits, what scores, what's missing": "Où se situe chaque boule, ce qui performe, ce qui manque",
"Ball against ball": "Boule contre boule",
"Your read-back after every night — you've poured one.": "Votre retour sur chaque soirée — vous en avez servi un.",
"A photo of the scorecard instead of typing every game.": "Une photo de la feuille de pointage au lieu de taper chaque partie.",
"Head to head": "Face à face",
"Your numbers against your teammates', and the team leaderboard.": "Vos chiffres contre ceux de vos coéquipiers, et le classement de l'équipe.",
"Comparing your numbers with your friends'.": "Comparer vos chiffres avec ceux de vos amis.",
"House against house": "Centre contre centre",
"Your season side by side with the one before.": "Votre saison à côté de la précédente.",
"Tracking what you put in and won at tournaments.": "Le suivi de ce que vous misez et gagnez en tournoi.",
"Your coach's tasks, notes and view of your numbers.": "Les tâches, les notes et l'accès de votre entraîneur à vos chiffres.",
"Your 60 days of Pro are up.": "Vos 60 jours de Pro sont terminés.",
"Every game, shot and night you've logged — nothing is deleted": "Chaque partie, lancer et soirée inscrits — rien n'est supprimé",
"Your own stats: strikes, spares, splits, leaves and each ball's numbers": "Vos propres statistiques : abats, réserves, splits, quilles restantes et les chiffres de chaque boule",
"One league, one team, a league bag and a tournament bag": "Une ligue, une équipe, un sac de ligue et un sac de tournoi",
"Badges, your journey and the calendar": "Les badges, votre parcours et le calendrier",
"Your Pro trial has ended": "Votre essai Pro est terminé",
"What you've been using that Basic doesn't include:": "Ce que vous utilisez et que Basic n'inclut pas :",
"Keep Pro ·": "Garder Pro ·",
"/month": "/mois",
"Or": "Ou",
"/year": "/an",
"Basic is free, and keeps:": "Basic est gratuit, et garde :",
"Continue with Basic": "Continuer avec Basic",
"No card is on file, so nothing is charged when the trial ends — you move to Basic unless you choose Pro.": "Aucune carte n'est enregistrée, donc rien n'est facturé à la fin de l'essai — vous passez à Basic à moins de choisir Pro.",
"You against a teammate. Needs frames for you and at least one teammate in this league.": "Vous contre un coéquipier. Il faut des carreaux pour vous et au moins un coéquipier dans cette ligue.",
"Teammate": "Coéquipier",
"This league only. Split Rate is the one where lower is better.": "Cette ligue seulement. Le taux de splits est le seul où plus bas, c'est mieux.",
"All leagues": "Toutes les ligues",
"Language · Idioma · Langue": "",
"Nightcap, Insights, Brooklyn, the Caddie and coaching": "Nightcap, Analyses, Brooklyn, le Caddie et Entraîneur",
"You cancelled, so this ends when the period you paid for runs out. Everything stays unlocked until then, and you can start it again any time before it ends.": "Vous avez annulé, donc l'abonnement se termine à la fin de la période payée. Tout reste débloqué d'ici là, et vous pouvez le réactiver en tout temps avant la fin.",
"window::All": "Tout",
"tab::Season": "Saison",
"tab::Calendar": "Agenda",
"tab::Journey": "Parcours",
"picker::Every night": "Toutes les soirées",
"field::Scoring": "Pointage",
"tab::Side games": "Cagnottes",
"Español": "",
"Français": "",
"⟨0⟩ Urethane": "⟨0⟩ Uréthane",
"Language · Idioma · Langue · 言語 in Settings. Automatic follows your phone's language, or pick English, Español, Français or 日本語. The app restarts in the language you pick.": "Language · Idioma · Langue · 言語 dans les Paramètres. Le mode automatique suit la langue de votre téléphone; vous pouvez aussi choisir English, Español, Français ou 日本語. L'application redémarre dans la langue choisie.",
"Language · Idioma · Langue · 言語": "",
"日本語": "",
"tab::Center": "Salle",
"placeholder::Handicap": "Handicap",
"tab::Handicap": "Handicap",
"window::Games": "Parties",
"field::Delivery": "Lancer",
"tile::Strikes": "Abats",
"field::Target": "Cible",
"milestone::Next ·": "À venir ·",
"newly::.": ".",
"Japan": "",
"Singapore": "",
"Language · Idioma · Langue · 言語 · 언어": "",
"Language · Idioma · Langue · 言語 · 언어 in Settings. Automatic follows your phone's language, or pick English, Español, Français, 日本語 or 한국어. The app restarts in the language you pick.": "Language · Idioma · Langue · 言語 · 언어 dans les Paramètres. Le mode automatique suit la langue de votre téléphone; vous pouvez aussi choisir English, Español, Français, 日本語 ou 한국어. L'application redémarre dans la langue choisie.",
"hand::Right": "Droite",
"hand::Left": "Gauche",
"confidence::Not yet": "Pas encore",
"Frames where every teammate struck but one. Log your teammates' frames on a league night.": "Carreaux où tous vos coéquipiers ont réussi un abat, sauf un. Enregistrez les carreaux de vos coéquipiers lors d'une soirée de ligue."
},
"patterns": [
[
"Add {0}'s balls to start logging shots.",
"Ajoutez les boules de {0} pour commencer à enregistrer des lancers."
],
[
"{0}% spares",
"{0}% de réserves"
],
[
"Remove {0}",
"Retirer {0}"
],
[
"Delete \"{0}\"? Its balls become ungrouped.",
"Supprimer « {0} »? Ses boules n'auront plus de groupe."
],
[
"Name change hasn't reached the cloud yet ({0}) — teammates won't be able to find you until it syncs.",
"Le changement de nom n'a pas encore atteint le nuage ({0}) — les membres de votre équipe ne pourront pas vous trouver avant la synchronisation."
],
[
"Saved on this device, but hasn't reached the cloud yet ({0}) — it may not carry over to another device yet.",
"Enregistré sur cet appareil, mais pas encore dans le nuage ({0}) — le changement pourrait ne pas encore apparaître sur un autre appareil."
],
[
"of {0}",
"sur {0}"
],
[
"Earned {0}",
"Obtenus {0}"
],
[
"Left {0}",
"Restants {0}"
],
[
"The free plan covers {0} league bag and {1} tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.",
"Le forfait gratuit comprend {0} {0|sac de ligue|sacs de ligue} et {1} {1|sac de tournoi|sacs de tournoi}. Les sacs supplémentaires — un sac de tournoi pour patron court, un sac pour patron sport — font partie du forfait payant. Rien de ce que vous avez déjà mis dans vos sacs ne disparaît."
],
[
"{0} · {1}{2} ball{3:s}{4}",
"{0} · {1} {1|boule|boules}{2}{4}"
],
[
"{0} ball{1:s} not packed in any bag. Practice always shows every ball regardless.",
"{0} {0|boule n'est rangée|boules ne sont rangées} dans aucun sac. En entraînement, toutes les boules s'affichent quand même."
],
[
"Showing the {0}lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.",
"Affichage des valeurs pour {0} lb — le RG et le différentiel varient selon le poids, et les valeurs de cette boule ont été publiées pour plus d'un poids."
],
[
"No published numbers for {0}lb specifically — showing the reference weight instead.",
"Aucune valeur publiée pour {0} lb précisément — affichage du poids de référence à la place."
],
[
"First balls at a full rack only {0} what a strike ball is for.",
"Premiers lancers sur les 10 quilles debout seulement {0} c'est à cela que sert une boule d'abat."
],
[
"{0} shots — too few to rely on",
"{0} {0|lancer|lancers} — trop peu pour s'y fier"
],
[
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than {0} shots behind it, so treat it as preliminary. A dash means no shots at all.",
"Chaque valeur est un pourcentage d'abats. Le gras indique la meilleure boule de cette phase; rien n'est en gras quand la différence est assez petite pour relever du hasard. Un taux en ambre repose sur moins de {0} lancers : considérez-le comme provisoire. Un tiret signifie qu'il n'y a aucun lancer."
],
[
"{0} went quiet. Try again in a moment.",
"{0} est restée muette. Réessayez dans un moment."
],
[
"Couldn't reach {0}. Try again in a moment.",
"Impossible de joindre {0}. Réessayez dans un moment."
],
[
"Ask {0}, the bowling genie",
"Demander à {0}, le génie des quilles"
],
[
"You've used all {0} today. {1} is back tomorrow.",
"Vous avez utilisé vos {0} questions du jour. {1} revient demain."
],
[
"The Stats screens cover the usual numbers. {0} is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.",
"Les écrans Stats couvrent les chiffres habituels. {0} sert aux questions auxquelles ils ne répondent pas — posez une question sur votre propre jeu et elle trouve la réponse à partir de ce que vous avez enregistré. S'il lui faut une donnée que vous ne suivez pas encore, elle vous dira quoi commencer à enregistrer."
],
[
"You're on {0} in this league. Making {1} puts you on its roster and takes you off {2}'s. Your scores stay yours.",
"Vous faites partie de l'équipe {0} dans cette ligue. Créer {1} vous ajoute à sa liste des joueurs et vous retire de celle de {2}. Vos pointages restent les vôtres."
],
[
"Couldn't find \"{0}\" in the cloud — this team was created on this device only and won't be visible to teammates. Try again once you're back online.",
"Impossible de trouver « {0} » dans le nuage — cette équipe a été créée sur cet appareil seulement et ne sera pas visible pour les autres membres de l'équipe. Réessayez quand vous serez de nouveau en ligne."
],
[
"\"{0}\" was created locally but couldn't reach the cloud yet ({1}). It'll keep retrying in the background.",
"L'équipe « {0} » a été créée sur cet appareil, mais n'a pas encore pu être envoyée dans le nuage ({1}). L'application continuera de réessayer en arrière-plan."
],
[
"Combine your \"{0}\" with the shared one{1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"Fusionner votre ligue « {0} » avec la ligue partagée{1}? Vos parties, vos équipes et les paramètres de la ligue y seront transférés, et vous verrez les équipes qui s'y trouvent déjà. Cette action est irréversible."
],
[
"\"{0}\" was saved on this device only and hasn't reached the cloud yet — it won't be visible to teammates or usable for creating a team until it syncs. It'll keep retrying in the background if you're offline; check back if this persists.",
"La ligue « {0} » a été enregistrée sur cet appareil seulement et n'a pas encore atteint le nuage — elle ne sera ni visible pour les autres membres de l'équipe ni utilisable pour créer une équipe tant qu'elle ne sera pas synchronisée. L'application continuera de réessayer en arrière-plan si vous êtes hors ligne; revenez vérifier si le problème persiste."
],
[
"You already have a league called \"{0}\". Pick a different name.",
"Vous avez déjà une ligue nommée « {0} ». Choisissez un autre nom."
],
[
"\"{0}\" was renamed on this device only and hasn't reached the cloud yet. It'll keep retrying in the background if you're offline; check back if this persists.",
"La ligue « {0} » a été renommée sur cet appareil seulement et n'a pas encore atteint le nuage. L'application continuera de réessayer en arrière-plan si vous êtes hors ligne; revenez vérifier si le problème persiste."
],
[
"You're not on {0} as {1}, so there's nothing to leave.",
"Vous ne faites pas partie de l'équipe {0} sous le nom {1}; il n'y a donc rien à quitter."
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
"Vous faites partie de l'équipe {0} dans cette ligue. Vous joindre à {1} vous retirera de la liste des joueurs de {2}. Vos pointages restent les vôtres."
],
[
"You're on {0}.",
"Vous faites partie de {0}."
],
[
"{0} {1} on {2} now.",
"{0} fait maintenant partie de {2}."
],
[
"You're on {0} in this league. If {1} approve{2:s} you, you'll be taken off {3}'s roster. Your scores stay yours.",
"Vous faites partie de l'équipe {0} dans cette ligue. Si {1} accepte votre demande, vous quitterez la liste des joueurs de {3}. Vos pointages restent les vôtres."
],
[
"This replaces your request to join {0}.",
"Cette demande remplace celle que vous aviez faite pour vous joindre à {0}."
],
[
"You've joined {0}. It'll show under Social.",
"Vous faites maintenant partie de {0}. L'équipe apparaîtra dans l'onglet Amis."
],
[
"This tournament is {0}’s. Switch bowler to save it.",
"Ce tournoi appartient à {0}. Passez au profil de {0} pour l'enregistrer."
],
[
"profile|{0}",
""
],
[
"These leagues were restored on this device only and haven't reached the cloud yet: {0}. They'll keep retrying in the background if you're offline.",
"Ces ligues ont été restaurées sur cet appareil seulement et n'ont pas encore atteint le nuage : {0}. L'application continuera de réessayer en arrière-plan si vous êtes hors ligne."
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
"· Lancer {0}"
],
[
"{0} changes backing up",
"{0} {0|modification en cours de sauvegarde|modifications en cours de sauvegarde}"
],
[
"Inbox, {0} waiting",
"Boîte de réception, {0} en attente"
],
[
"✓ {0} {1} saved on this phone. Nothing is lost.",
"✓ {0} {0|modification enregistrée|modifications enregistrées} sur ce téléphone. Rien n'est perdu."
],
[
"mbj-app-content mbj-view-{0}",
""
],
[
"🧑‍🏫 Coach{0}",
"🧑‍🏫 Entraîneur{0}"
],
[
"Invitation to join {0}",
"Invitation à rejoindre {0}"
],
[
"{0} wants to join {1}",
"{0} veut rejoindre {1}"
],
[
"Joining takes you off {0}.",
"En acceptant, vous quitterez {0}."
],
[
"Approving moves them off {0}.",
"En approuvant, cette personne quittera {0}."
],
[
"📥 {0} waiting for you",
"📥 {0} {0|élément vous attend|éléments vous attendent}"
],
[
"{0} total · {1} average · {2} high{3}{4}",
"Total de {0} · moyenne de {1} · meilleure partie de {2}{3}{4}"
],
[
"({0} scratch + {1} hcp)",
"({0} sans handicap + {1} de handicap)"
],
[
"{0}{1} vs the cut",
"{0}{1} par rapport au seuil de qualification"
],
[
"{0}-{1}{2}{3}{4} match{5:s}{6}{7}{8} with bonus",
"{0}-{1}{2} en {4} {4|match|matchs}{6}{7}{8} avec boni"
],
[
"· {0} average",
"· moyenne de {0}"
],
[
"{0}{1} of {2} step{3:s} won{4}",
"{0}{1} {1|match gagné|matchs gagnés} sur {2}{4}"
],
[
"{0} seed ·",
"Rang : {0} ·"
],
[
"· finished {0}",
"· classement final : {0}"
],
[
"{0} night{1:s} · {2} games · {3} average · {4} high",
"{0} {0|soirée|soirées} · {2} {2|partie|parties} · moyenne de {3} · meilleure partie de {4}"
],
[
"1.5px solid {0}",
""
],
[
"Open results for {0}",
"Ouvrir les résultats du {0}"
],
[
"{0} series · {1} average · {2} high",
"Triple de {0} · moyenne de {1} · meilleure partie de {2}"
],
[
"{0}% strikes{1}{2}",
"{0}% d'abats{1}{2}"
],
[
"· {0}% spares",
"· {0}% de réserves"
],
[
"· {0} split{1:s}",
"· {0} {0|écart|écarts}"
],
[
"Delete this night? {0} game{1:s} and every frame logged with them. This cannot be undone.",
"Supprimer cette soirée? {0} {0|partie|parties} et tous les carreaux qui y sont enregistrés. Cette action est irréversible."
],
[
"Everyone you've bowled with, by average. {0}",
"Toutes les personnes avec qui vous avez joué, par moyenne. {0}"
],
[
"{0} game{1:s}",
"{0} {0|partie|parties}"
],
[
"{0} night{1:s}",
"{0} {0|soirée|soirées}"
],
[
"{0} win{1:s}",
"{0} {0|victoire|victoires}"
],
[
"Send {0} their badges",
"Envoyer ses badges à {0}"
],
[
"Free fall on {0}.",
"Planteuses à chute libre : {0}."
],
[
"Where does {0} bowl? Set once per season — it lets you compare how you score house to house.",
"Où joue {0}? À indiquer une fois par saison — cela vous permet de comparer vos pointages d'une salle à l'autre."
],
[
"{0} mi",
"{0} mi"
],
[
"Target: {0}{1} {2}{3}",
"Objectif : {0}{1} {2}{3}"
],
[
"reached {0}{1}",
"résultat : {0}{1}"
],
[
"Due {0}",
"Échéance : {0}"
],
[
"(+{0} more)",
"(+{0} {0|autre|autres})"
],
[
"Target {0}{1} — no result logged yet.",
"Cible {0}{1} — aucun résultat enregistré pour l'instant."
],
[
"Bowls {0} on {1}",
"Joue dans la ligue {0} le {1}"
],
[
"{0} — asked to be your {1}",
"{0} — a demandé à être votre {1}"
],
[
"They enter it on their own phone and you{0}re connected — no searching for each other by name.",
"La personne le saisit sur son propre téléphone, et c{0}est fait — le lien est établi, sans avoir à vous chercher par nom."
],
[
"Connected. They{0}re in the list above.",
"Lien établi. La personne s{0}affiche dans la liste ci-dessus."
],
[
"Goal for {0}",
"Objectif pour {0}"
],
[
"Next session with {0}",
"Prochaine séance avec {0}"
],
[
"{0}'s Game",
"Le jeu de {0}"
],
[
"From {0} shots",
"Sur {0} {0|lancer|lancers}"
],
[
"Misses: {0}",
"Ratés : {0}"
],
[
"Tasks — {0}",
"Tâches — {0}"
],
[
"{0}. An 800 series is an 800 series.",
"{0}. Un triple de 800, c'est un triple de 800."
],
[
"{0}, beating your {1} by {2}.",
"{0}, soit {2} de plus que votre ancien record de {1}."
],
[
"your {0} drill",
"votre exercice {0}"
],
[
"Mentions {0}, which you haven't logged enough of yet — treat that part as a guess.",
"Mentionne des statistiques pour lesquelles vous n'avez pas encore assez de données ({0}) — considérez cette partie comme une supposition."
],
[
"{0} added. {1} you already had.",
"Ajout de {0}. Vous aviez déjà {1}."
],
[
"You already had {0}.",
"Vous aviez déjà {0}."
],
[
"all {0} of those nights",
"les {0} soirées"
],
[
"Manufacturer specifications. Source: {0}",
"Caractéristiques du fabricant. Source : {0}"
],
[
"Verified by {0} bowlers. Locked from edits.",
"Données vérifiées par {0} {0|personne|personnes}. Modifications verrouillées."
],
[
"Entered by another bowler and confirmed by {0}. Not manufacturer data.",
"Données saisies par une autre personne et confirmées par {0}. Elles ne proviennent pas du fabricant."
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
"S'obtient en {0} seulement"
],
[
"Earned in {0} or {1}",
"S'obtient en {0} ou en {1}"
],
[
"date must look like 2026-09-17, got \"{0}\"",
"la date doit avoir la forme 2026-09-17, et non « {0} »"
],
[
"no such date: {0}",
"cette date n'existe pas : {0}"
],
[
"date looks wrong: {0}",
"la date semble erronée : {0}"
],
[
"date is in the future: {0}",
"la date est dans le futur : {0}"
],
[
"{0} must be a whole number, got \"{1}\"",
"{0} doit être un nombre entier, et non « {1} »"
],
[
"The header row needs these columns: {0}.",
"La ligne d'en-tête doit contenir ces colonnes : {0}."
],
[
"That file has {0} rows. The limit is {1}.",
"Ce fichier contient {0} lignes. La limite est de {1}."
],
[
"{0} appears twice in this file",
"{0} figure deux fois dans ce fichier"
],
[
"{0} — diagnostics",
""
],
[
"Ask {0} something. She's got your whole history in here.",
"Posez une question à {0}. Elle connaît tout votre historique."
],
[
"That's a lot. Try asking {0} one thing.",
"C'est beaucoup. Essayez de poser une seule question à {0}."
],
[
"{0} only knows bowling. That one's free — ask her something else.",
"{0} ne connaît que les quilles. Celle-là ne compte pas — posez-lui autre chose."
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
"Il vous manque {0} {0|quille|quilles} par partie."
],
[
"Beat your best by {0} pin{1:s}.",
"Faites {0} {0|quille|quilles} de plus que votre meilleure partie."
],
[
"Beat your best series by {0} pin{1:s}.",
"Faites {0} {0|quille|quilles} de plus que votre meilleur triple."
],
[
"Keep {0} of your next {1} {2} clean",
"Fermez {0} de vos {1} prochains {2}"
],
[
"{0}{1} {2} of your next {3} {4}",
"Visez {2} {2|réussite|réussites} sur les {3} {4} à venir"
],
[
"{0} — {1} more than you are now.",
"{0} — {1} de plus qu'actuellement."
],
[
"Corrected by {0}.",
"Corrigé par {0}."
],
[
"Game {0}: you logged {1}, the photo reads {2}. Yours is kept unless you change it.",
"Partie {0} : vous avez enregistré {1}, la photo indique {2}. Votre pointage est conservé, à moins que vous le modifiiez."
],
[
"game {0} ({1} vs {2})",
"partie {0} ({1} contre {2})"
],
[
"These disagree with what you logged — {0}. Yours are kept unless you change them.",
"Ces pointages ne concordent pas avec ce que vous avez enregistré — {0}. Les vôtres sont conservés, à moins que vous les modifiiez."
],
[
"{0} nights of scores to check",
"{0} soirées de pointages à vérifier"
],
[
"{0} nights need re-entering",
"{0} soirées à saisir de nouveau"
],
[
"{0} teammate score{1:s} unconfirmed",
"{0} {0|pointage non confirmé dans l'équipe|pointages non confirmés dans l'équipe}"
],
[
"{0} wants to be your {1}",
"{0} vous a envoyé une demande d'entraînement"
],
[
"{0} task{1:s} from your coach",
"{0} {0|tâche|tâches} de votre entraîneur"
],
[
"{0} task update{1:s} from your bowlers",
"{0} {0|mise à jour de tâche|mises à jour de tâches} de vos élèves"
],
[
"{0} sent a friend request",
"{0} vous a envoyé une demande d'amitié"
],
[
"{0}Accept or decline on the Team tab.",
"{0}Acceptez ou refusez dans l'onglet Équipe."
],
[
"{0} has finished its season.",
"{0} a terminé sa saison."
],
[
"Your specs for {0} were rejected",
"Vos caractéristiques pour {0} ont été rejetées"
],
[
"Game {0}, frame {1}",
"Partie {0}, carreau {1}"
],
[
"{0} pin{1:s} away",
"Encore {0} {0|quille|quilles}"
],
[
"Best {0}",
"Meilleur : {0}"
],
[
"Milestones up to a {0} average",
"Jalons jusqu'à une moyenne de {0}"
],
[
"{0} pin{1:s} short · best {2}",
"Il manque {0} {0|quille|quilles} · record : {2}"
],
[
"{0}, and {1}",
"{0} et {1}"
],
[
"You usually bowl {0}. The app sets itself up for you on those days instead of asking.",
"Vous jouez habituellement {0}. Ces jours-là, l'application se configure d'elle-même au lieu de vous le demander."
],
[
"Min {0}{1}",
"Min {0}{1}"
],
[
"Max {0}{1}",
"Max {0}{1}"
],
[
"Leave {0}?",
"Quitter {0}?"
],
[
"You'll no longer be part of {0}.",
"Vous ne ferez plus partie de {0}."
],
[
"You'll still be on {0} in {1}.",
"Vous ferez toujours partie de {0} dans {1}."
],
[
"Your teammates ({0}) will see you've left.",
"Les membres de votre équipe ({0}) verront votre départ."
],
[
"Won every match, by {0} pins on average.",
"Tous les matchs gagnés, par {0} quilles en moyenne."
],
[
"Lost every match, but all of them by under {0} pins.",
"Tous les matchs perdus, mais chaque fois par moins de {0} quilles."
],
[
"Lost every match, by {0} pins on average.",
"Tous les matchs perdus, par {0} quilles en moyenne."
],
[
"won by {0} on average",
"victoires par {0} en moyenne"
],
[
"lost by {0}",
"défaites par {0}"
],
[
"{0} of {1} came down to under {2} pins.",
"{0} sur {1} {0|s'est décidé|se sont décidés} par moins de {2} quilles."
],
[
"Official {0} PBA specs.",
"Caractéristiques officielles PBA {0}."
],
[
"Not on the {0} sheet — check patternlibrary.kegel.net if you bowled it.",
"Absent de la fiche {0} — consultez patternlibrary.kegel.net si vous l'avez joué."
],
[
"{0} · {1} · specs not entered yet",
"{0} · {1} · caractéristiques pas encore saisies"
],
[
"fewer than {0} games in {1}",
"moins de {0} parties dans {1}"
],
[
"{0} average across {1} games",
"moyenne dans {0} sur {1} parties"
],
[
"no league reached {0} games, and the combined total didn't either",
"aucune ligue n'a atteint {0} parties, et le total combiné non plus"
],
[
"{0} average across {1} games (your strongest league)",
"moyenne dans {0} sur {1} parties (votre meilleure ligue)"
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
"DESCRIPTION:{0} dans {1} minutes"
],
[
"Retired {0}",
"Retirée le {0}"
],
[
"{0} · nothing logged with it",
"{0} · aucun lancer enregistré avec cette boule"
],
[
"{0} · {1}, too few to compare",
"{0} · {1}, trop peu pour comparer"
],
[
"{0} · {1} · {2}% strikes",
"{0} · {1} · {2}% d'abats"
],
[
"{0} couldn't be read and were left out. A clearer photo would get more — what's below is still safe to save.",
"Impossible de lire {0} : ces données ont été laissées de côté. Une photo plus nette permettrait d'en récupérer davantage — ce qui figure ci-dessous peut quand même être enregistré sans problème."
],
[
"The series says {0} but the {1} games add up to {2} — {3}. Check before saving.",
"Le triple indique {0}, mais les {1} parties totalisent {2} — {3}. Vérifiez avant d'enregistrer."
],
[
"The card says {0} but the frames add up to {1} — {2}. Check before saving.",
"La feuille indique {0}, mais les carreaux totalisent {1} — {2}. Vérifiez avant d'enregistrer."
],
[
"board must be {0} to {1}",
"la planche doit être entre {0} et {1}"
],
[
"{0} night{1:s} · {2} game{3:s}",
"{0} {0|soirée|soirées} · {2} {2|partie|parties}"
],
[
"Average {0}",
"Moyenne : {0}"
],
[
"High game {0}{1}",
"Meilleure partie {0}{1}"
],
[
"· High series {0}",
"· Meilleur triple {0}"
],
[
"{0} game{1:s} over 200",
"{0} {0|partie|parties} de plus de 200"
],
[
"{0}% strikes · {1}% spares",
"{0}% d'abats · {1}% de réserves"
],
[
"{0}${1} on the season",
"{0}${1} sur la saison"
],
[
"{0} – now",
"{0} – aujourd'hui"
],
[
"{0} games against {1}",
"{0} {0|partie|parties} contre {1}"
],
[
"Your average is the same as last season — {0}.",
"Votre moyenne est la même que la saison dernière — {0}."
],
[
"Your average is {0} {1} {2} on last season — {3}.",
"Votre moyenne est {0} de {1} {1|quille|quilles} par rapport à la saison dernière — {3}."
],
[
"{0} One of those seasons is short, so treat it lightly.",
"{0} L'une de ces saisons est courte, alors prenez ce résultat avec un grain de sel."
],
[
"Tied at {0} — nobody's settling this tonight.",
"Égalité à {0} — rien ne se règle ce soir."
],
[
"{0}, by just {1}. That was close.",
"{0}, avec seulement {1} d'avance. C'était serré."
],
[
"{0}, won by {1}.",
"{0}, avec {1} d'avance."
],
[
"Jumped {0} pins between games.",
"Bond de {0} quilles d'une partie à l'autre."
],
[
"Dropped {0} pins between games.",
"Recul de {0} quilles d'une partie à l'autre."
],
[
"Every game within {0} pins.",
"Toutes les parties dans une fourchette de {0} {0|quille|quilles}."
],
[
"{0} average over {1} game{2:s}",
"Moyenne de {0} sur {1} {1|partie|parties}"
],
[
"{0} — {1} above your average.",
"{0} — {1} au-dessus de votre moyenne."
],
[
"{0} — {1} below your average.",
"{0} — {1} sous votre moyenne."
],
[
"{0} — right on your average.",
"{0} — exactement votre moyenne."
],
[
"{0} of {1} across {2} drill{3:s}",
"{0} sur {1} en {2} {2|exercice|exercices}"
],
[
"{0} {1} for {2}{3}{4}: {5}.",
"{0} {1} en {2} parties{3}{4} : {5}."
],
[
"Badge{0:s} earned: {1}",
"Badges obtenus : {1}"
],
[
"Tracked with {0} — {1}",
"Enregistré avec {0} — {1}"
],
[
"{0}-game series",
"Série de {0} parties"
],
[
"{0}+{1} more",
"{0}+{1} autres"
],
[
"+{0} more",
"+{0} autres"
],
[
"Won ${0} in side pots",
"Gains de ${0} dans les cagnottes"
],
[
"Hit my goal: {0}",
"Objectif atteint : {0}"
],
[
"New personal best series — beat {0}",
"Nouveau meilleur triple personnel — mieux que {0}"
],
[
"New personal best game — beat {0}",
"Nouvelle meilleure partie personnelle — mieux que {0}"
],
[
"{0} clean game{1:s}",
"{0} {0|partie sans carreau ouvert|parties sans carreau ouvert}"
],
[
"{0} pins over my average",
"{0} quilles au-dessus de ma moyenne"
],
[
"{0} Tracked with {1} — {2}",
"{0} Enregistré avec {1} — {2}"
],
[
"{0} games — averaging {1}, high {2}, low {3}.",
"{0} {0|partie|parties} — moyenne de {1}, sommet de {2}, creux de {3}."
],
[
"{0} has earned {1}{2} badge{3:s}",
"{0} a obtenu {1} {1|badge|badges}{2}"
],
[
"{0} earned a badge tonight",
"{0} a obtenu un badge ce soir"
],
[
"{0} earned {1} badges tonight",
"{0} a obtenu {1} badges ce soir"
],
[
"Keep them: {0}",
"À conserver : {0}"
],
[
"Standings Tracked with {0} — {1}",
"Classement Enregistré avec {0} — {1}"
],
[
"Qualifying: {0} across {1} game{2:s}",
"Qualification : {0} en {1} {1|partie|parties}"
],
[
"Made the cut by {0}",
"Qualification obtenue avec {0} de marge"
],
[
"Missed the cut by {0}",
"Qualification manquée par {0}"
],
[
", {0} with bonus",
", {0} avec boni"
],
[
"Match play: {0}{1}",
"Jeu par match : {0}{1}"
],
[
"from the {0} seed",
"en partant du {0} rang"
],
[
"Won the stepladder{0}",
"Finale à échelons remportée{0}"
],
[
"Stepladder: {0}{1}",
"Finale à échelons : {0}{1}"
],
[
"Stepladder: {0} of {1} steps won{2}",
"Finale à échelons : {0} {0|match remporté|matchs remportés} sur {1}{2}"
],
[
"Up ${0} on the day",
"Gain de ${0} pour la journée"
],
[
"Down ${0} on the day",
"Perte de ${0} pour la journée"
],
[
"{0} game{1:s} · {2} average",
"{0} {0|partie|parties} · moyenne de {2}"
],
[
"{0} {1} if you {2}",
"{0} {0|statistique se débloque|statistiques se débloquent} si vous {2}"
],
[
"{0}. Either on its own is fine.",
"{0}. L'une ou l'autre option suffit."
],
[
"Won the stepladder{0}.",
"Finale à échelons remportée{0}."
],
[
"— {0} straight",
"— {0} {0|victoire|victoires} de suite"
],
[
"to the {0} seed",
"face à la personne classée {0}"
],
[
"Finished {0}{1}.",
"Classement final : {0} rang{1}."
],
[
"you and {0}",
"vous et {0}"
],
[
"Baker: {0} bowled this together, so the score stays out of your average.",
"Baker : {0} avez joué cette partie ensemble, alors le pointage n'entre pas dans votre moyenne."
],
[
"{0} more night{1:s} needed before a direction means anything.",
"Il faut encore {0} {0|soirée|soirées} avant qu'une tendance soit significative."
],
[
"Trending {0} about {1}{2} across this stretch.",
"Variation nette d'environ {1} sur cette période."
],
[
"Last {0} — showing {1} of {2} {3}",
"Les {0} plus récentes — {1} sur {2} {1|affichée|affichées}"
],
[
"Last {0} days — showing {1} of {2} {3}",
"Les {0} derniers jours — {1} sur {2} {1|affichée|affichées}"
],
[
"{0} to {1} — showing {2} of {3} {4}",
"Entre {0} et {1} — {2} sur {3} {2|affichée|affichées}"
],
[
"{0} of {1} {2}{3}",
""
],
[
"{0}· last time {1}%",
"{0}· dernière fois : {1}%"
],
[
"Save Drill ({0} attempts)",
"Enregistrer l'exercice ({0} {0|tentative|tentatives})"
],
[
"Remove {0} as a friend?",
"Retirer {0} de vos amis?"
],
[
"Not enough data yet — {0} more {1} before this is worth reporting.",
"Pas encore assez de données — il faut encore {0} {1} avant que le résultat soit significatif."
],
[
"{0} to go",
"Encore {0}"
],
[
"{0} targets run from {1} to {2}.",
"Pour {0}, les cibles vont de {1} à {2}."
],
[
"Target{0}",
"Cible{0}"
],
[
"retrying after: {0}",
""
],
[
"Nothing matched \"{0}\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".",
"Aucun résultat pour « {0} ». Essayez un mot qui figure dans l'application — « réserve », « équipe », « boule », « importer »."
],
[
"{0} games logged",
"{0} {0|partie enregistrée|parties enregistrées}"
],
[
"· {0} seasons",
"· {0} {0|saison|saisons}"
],
[
"{0} badges earned",
"{0} {0|badge obtenu|badges obtenus}"
],
[
"{0} · {1} milestone{2:s} so far",
"{0} · {1} {1|jalon|jalons} jusqu'à maintenant"
],
[
"Next · {0}",
"À venir · {0}"
],
[
"Imported {0} night{1:s}.",
"{0} {0|soirée importée|soirées importées}."
],
[
"That didn't save: {0}",
"L'enregistrement a échoué : {0}"
],
[
"A CSV with four columns: {0}. Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.",
"Un fichier CSV à quatre colonnes : {0}. Les dates s'écrivent comme 2026-09-17, les pointages sont des nombres entiers de 0 à 300, et une soirée peut compter une, deux ou trois parties."
],
[
"{0} row{1:s} skipped",
"{0} {0|ligne ignorée|lignes ignorées}"
],
[
"Row {0}",
"Ligne {0}"
],
[
"and {0} more",
"et {0} {0|autre|autres}"
],
[
"{0} night{1:s} you already have",
"{0} {0|soirée|soirées} que vous avez déjà"
],
[
", and {0} more",
", et {0} {0|autre|autres}"
],
[
"Keep mine, import the other {0}",
"Garder les miennes, importer les autres ({0})"
],
[
"Import {0} night{1:s}",
"Importer {0} {0|soirée|soirées}"
],
[
"Frame-by-frame data included for {0}{1}{2} — confirming adds it to your shot history.",
"Données carreau par carreau incluses pour {0} {0|partie|parties} — en confirmant, vous les ajoutez à votre historique de lancers."
],
[
"Join {0}?",
"Rejoindre {0}?"
],
[
"You were added to the roster as {0}{1}. Teammates will be able to import your scores from a scorecard photo — you still confirm them.",
"Vous faites maintenant partie de la liste des joueurs en tant que {0}{1}. Les membres de l'équipe pourront importer vos pointages à partir d'une photo de feuille de pointage — c'est quand même vous qui les confirmez."
],
[
", position {0}",
", position {0}"
],
[
"Team {0}",
"{0} d'équipe"
],
[
"{0} night{1:s} imported by a teammate.",
"{0} {0|soirée importée|soirées importées} par un membre de l'équipe."
],
[
"{0}-{1} open",
"{0}-{1} ouvert"
],
[
"Spare: {0}",
"Réserve : {0}"
],
[
"Game {0}{1}",
"Partie {0}{1}"
],
[
"⚠️ {0} fill ball{1:s} below couldn't be reliably read from the image -- please double-check the pin count.",
"⚠️ {0} {0|lancer supplémentaire ci-dessous n'a pas pu être lu|lancers supplémentaires ci-dessous n'ont pas pu être lus} de façon fiable sur l'image -- veuillez vérifier le nombre de quilles."
],
[
"Frame {0}{1}{2}",
"Carreau {0}{1}{2}"
],
[
"These images come to about {0}MB, which is too much to send at once. Remove one and try again — images are sent at full quality, so fewer is better than smaller.",
"Ces images totalisent environ {0} Mo, ce qui est trop pour un seul envoi. Retirez-en une et réessayez — les images sont envoyées en pleine qualité, alors mieux vaut moins d'images que des images plus petites."
],
[
"retried on {0}",
""
],
[
"(Already retried {0} time{1:s}.)",
"(Déjà réessayé {0} fois.)"
],
[
"Your images are still selected, so just tap {0} again in a minute.{1}",
"Vos images sont toujours sélectionnées : touchez simplement « {0} » de nouveau dans une minute. {1}"
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
"Des lancers sont déjà enregistrés pour la partie {0} du {1}."
],
[
"{0} game score{1:s}",
"{0} {0|pointage de partie|pointages de partie}"
],
[
"Sent {0} their scores to confirm.",
"Pointages envoyés à {0} pour confirmation."
],
[
"Imported {0}{1} -- check the Results, then save the night.",
"Importé : {0}{1} -- vérifiez les Résultats, puis enregistrez la soirée."
],
[
"Scorecard Screenshot{0:s}",
"Photos de la feuille de pointage"
],
[
"Scorecard {0}",
"Feuille de pointage {0}"
],
[
"Remove scorecard {0}",
"Retirer la feuille de pointage {0}"
],
[
"Clear all {0} image{1:s}",
"Tout effacer ({0} {0|image|images})"
],
[
"{0} images ({1}MB, full quality) — reading these can take a few minutes.",
"{0} images ({1} Mo, pleine qualité) — leur lecture peut prendre quelques minutes."
],
[
"Reading a scorecard can take a minute or two. ({0}MB, full quality.)",
"La lecture d'une feuille de pointage peut prendre une minute ou deux. ({0} Mo, pleine qualité.)"
],
[
"Working through {0} images. This can take a few minutes — every frame is read individually.",
"Traitement de {0} images. Cela peut prendre quelques minutes — chaque carreau est lu individuellement."
],
[
"{0} bowler{1:s} read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.",
"{0} {0|joueur|joueurs} sur la feuille. Confirmez chaque correspondance avant tout enregistrement — une erreur d'association inscrirait la partie d'une personne dans le dossier d'une autre."
],
[
"Column {0}",
"Colonne {0}"
],
[
"{0} game{1:s} · {2}{3}{4}",
"{0} {0|partie|parties} · {2}{3}{4}"
],
[
"Games add to {0} but the card's scratch series is {1}. One of the games was misread — check the card.",
"Les parties totalisent {0}, mais le triple sans handicap indiqué sur la feuille est de {1}. L'une des parties a été mal lue — vérifiez la feuille."
],
[
"Add \"{0}\" as a new bowler",
"Ajouter « {0} » comme nouveau joueur"
],
[
"Closest match: {0}",
"Correspondance la plus proche : {0}"
],
[
"Matched on the alias \"{0}\".",
"Correspondance établie grâce à l'alias « {0} »."
],
[
"Card order: {0}",
"Ordre sur la feuille : {0}"
],
[
"check the {0} below, correct anything that's wrong, then save.",
"vérifiez ci-dessous le pointage de chaque partie, corrigez ce qui est erroné, puis enregistrez."
],
[
"{0} game scores",
"{0} pointages de partie"
],
[
"These go to {0} to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.",
"Ces pointages sont envoyés à {0} pour confirmation. Ils comptent tout de suite — la confirmation les marque simplement comme vérifiés. Corrigez toute erreur de lecture avant l'envoi."
],
[
"read as \"{0}\"",
"Nom lu : « {0} »"
],
[
"Game{0:s} {1} couldn't be read — type the real score, or clear the box if they didn't bowl it.",
"Partie(s) {1} illisible(s) — entrez le vrai pointage, ou videz la case d'une partie non jouée."
],
[
"Series {0}{1}",
"Triple {0}{1}"
],
[
"· card printed {0}",
"· sur la feuille : {0}"
],
[
"Save & Send To {0} Teammate{1:s}",
"Enregistrer et envoyer à {0} {0|membre de l'équipe|membres de l'équipe}"
],
[
"{0} games. Only statistics with enough data to be meaningful are analysed.",
"{0} {0|partie|parties}. Seules les statistiques ayant assez de données pour être significatives sont analysées."
],
[
"{0} of {1} · ~{2} more {3}",
"{0} sur {1} · encore ~{2} {2|partie|parties}"
],
[
"You're close on {0} — a couple more nights and it unlocks.",
"Vous approchez du but pour {0} — encore deux ou trois soirées et ce sera débloqué."
],
[
"{0} more {1} to go.",
"Plus que {0} {0|partie|parties}."
],
[
"Insights need at least {0} games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.",
"Les analyses nécessitent au moins {0} parties. En deçà, les chiffres varient trop d'une soirée à l'autre pour en tirer quoi que ce soit de fiable — vous obtiendriez des tendances qui ont l'air sûres, mais qui ne sont en fait que du bruit."
],
[
"You have {0} games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.",
"Vous avez {0} {0|partie enregistrée|parties enregistrées}. Rien ne repose encore sur assez de données pour être analysé honnêtement — voici ce qui s'en approche le plus."
],
[
"{0} more {1}",
"encore {0} {1}"
],
[
"Based on {0} games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.",
"D'après {0} {0|partie|parties} jusqu'ici. Ces analyses s'affinent à mesure que vous enregistrez — quelques soirées donnent un indice, une saison vous donne de quoi agir."
],
[
"You're working with {0} — worth talking this through with them before changing anything. They can see what these numbers can't.",
"Vous travaillez avec {0} — parlez-en avec cette personne avant de changer quoi que ce soit. Elle voit ce que ces chiffres ne montrent pas."
],
[
"· {0} of {1}",
"· {0} sur {1}"
],
[
"Nothing matches “{0}”{1}.",
"Aucun résultat pour « {0} »{1}."
],
[
"On the road since {0}",
"En route depuis le {0}"
],
[
"{0} Badges",
"{0} Badges"
],
[
"The free plan follows this league.{0} Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.",
"Le forfait gratuit suit cette ligue.{0} Changer de ligue, ou jouer dans plus d'une ligue, fait partie de Pro — et tout ce que vous avez enregistré revient quand vous vous abonnez."
],
[
"Paused: {0}.",
"En pause : {0}."
],
[
"Paused: {0}. Practice and Just Bowling stay open either way.",
"En pause : {0}. Les modes Entraînement et Jeu libre restent accessibles dans tous les cas."
],
[
"Saved. {0} is your active league.",
"Enregistré. {0} est votre ligue active."
],
[
"{0} · {1} games",
"{0} · {1} {1|partie|parties}"
],
[
"vs your {0} overall{1}{2} game{3:s}",
"contre votre moyenne globale de {0}{1}{2} {2|partie|parties}"
],
[
"{0} {1} more",
"{0} {1} {1|autre|autres}"
],
[
"Lane diagram, {0} of {1} balls shown",
"Schéma de l'allée, {0} {0|boule affichée|boules affichées} sur {1}"
],
[
"breakpoint {0}′",
"rupture {0}′"
],
[
"{0} shots around {1}",
"{0} {0|lancer|lancers} autour de ce point ({1})"
],
[
", across {0} nights",
", sur {0} soirées"
],
[
"{0} made of {1}",
"{0} {0|réussite|réussites} sur {1}"
],
[
"{0} missed of {1}",
"{0} {0|échec|échecs} sur {1}"
],
[
"Show all {0}",
"Afficher les {0}"
],
[
"{0} of 4 points",
"{0} sur 4 points"
],
[
"{0} — tonight",
"{0} — ce soir"
],
[
"{0}'s night",
"Soirée de {0}"
],
[
"G{0} Theory",
"P{0} théorique"
],
[
"▼ {0} pins left on the lane",
"▼ {0} {0|quille laissée|quilles laissées} sur l'allée"
],
[
"({0} actual vs {1} possible)",
"({0} obtenus contre {1} possibles)"
],
[
"Tap the ones you're in. Buy-ins are saved for {0} — you won't need to enter them again.",
"Touchez celles auxquelles vous participez. Les mises sont enregistrées pour {0} — vous n'aurez pas à les saisir de nouveau."
],
[
"{0} game{1:s} tonight · ${2} paid in",
"{0} {0|partie|parties} ce soir · ${2} misés"
],
[
"All nine struck — you took it{0}.",
"Les neuf abats réussis — la cagnotte est à vous{0}."
],
[
"${0} paid in — {1} ${2} on the night.",
"${0} misés — {1} de ${2} pour la soirée."
],
[
"Counts for {0}. Bowled today — change the date above if that's the wrong week.",
"Compte pour le {0}. Joué aujourd'hui — changez la date ci-dessus si ce n'est pas la bonne semaine."
],
[
"Lanes {0} & {1}",
"Allées {0} et {1}"
],
[
"Lane {0}",
"Allée {0}"
],
[
"Pattern name (e.g. {0})",
"Nom du patron (p. ex. {0})"
],
[
"Game {0} score",
"Pointage de la partie {0}"
],
[
"{0} frames say {1}",
"{0} selon les carreaux : {1}"
],
[
"Frames say {0} — tap to use them",
"Selon les carreaux : {0} — touchez pour utiliser ce pointage"
],
[
"Delete game {0}",
"Supprimer la partie {0}"
],
[
"Game {0} surface",
"Surface de la boule, partie {0}"
],
[
"Delete game {0}? This removes the score{1}. It can't be undone.",
"Supprimer la partie {0}? Cela retire le pointage{1}. Cette action est irréversible."
],
[
"Shot Context{0}",
"Contexte du lancer{0}"
],
[
"10th Frame{0}",
"10e carreau{0}"
],
[
"Ball {0}",
"Lancer {0}"
],
[
"frame {0}{1} of game {2}",
"le carreau {0}{1} de la partie {2}"
],
[
", ball {0}",
", lancer {0}"
],
[
"Delete {0}? This cannot be undone.",
"Supprimer {0}? Cette action est irréversible."
],
[
"Clearing the result deletes {0}. Delete it?",
"Effacer le résultat supprime {0}. Voulez-vous le supprimer?"
],
[
"Leave: {0}{1}",
"Quilles restantes : {0}{1}"
],
[
"· First ball: {0}",
"· Premier lancer : {0}"
],
[
"Delete game {0} for everyone?{1}",
"Supprimer la partie {0} pour tout le monde? {1}"
],
[
"{0}, game {1}",
"{0}, partie {1}"
],
[
"Switched from {0} to {1} — why?",
"Passage de {0} à {1} — pourquoi?"
],
[
"Line{0}",
"Trajectoire{0}"
],
[
"· Lane {0}",
"· Allée {0}"
],
[
"{0} board{1:s} {2} of target",
"{0} {0|planche|planches} à {2} de la cible"
],
[
"{0} of {1} first balls struck{2}{3}{4}",
"{0} {0|abat|abats} en {1} {1|premier lancer|premiers lancers}{2}{3}{4}"
],
[
", {0} of {1} spares made",
", {0} {0|réserve réussie|réserves réussies} sur {1}"
],
[
", {0} split{1:s}",
", {0} {0|écart|écarts}"
],
[
"Best carry tonight: {0} {1} {2}%{3}over {4} first balls",
"Meilleur taux d'abats ce soir : {0} {1} {2}%{3}sur {4} {4|premier lancer|premiers lancers}"
],
[
"✓ {0} Saved",
"✓ Enregistré"
],
[
"Save & Finish {0}",
"Enregistrer et terminer : {0}"
],
[
"End {0} & View Results",
"Terminer ({0}) et voir les résultats"
],
[
"nightcap:{0}|{1}|{2}|{3}",
""
],
[
"There are {0} things worth saying about tonight.",
"Il y a {0} {0|chose|choses} à souligner à propos de ce soir."
],
[
"{0} things were true about tonight. Here are the two or three worth hearing.",
"{0} {0|constat|constats} sur ce soir. Voici les deux ou trois qui valent la peine d'être entendus."
],
[
"{0} first balls across {1} game{2:s}{3}",
"{0} {0|premier lancer|premiers lancers} en {1} {1|partie|parties}{3}"
],
[
", against {0} earlier nights in this league.",
", comparé à {0} {0|soirée précédente|soirées précédentes} dans cette ligue."
],
[
"Your current book average is {0}.",
"Votre moyenne établie actuelle est de {0}."
],
[
"Update to {0}",
"Remplacer par {0}"
],
[
"{0}-handed{1} · {2}",
"Main : {0}{1} · {2}"
],
[
"A backup ball goes out to the {0} and hooks back, so your corner pin is the {1} and your pocket is the {2}. Turning this on flips every leave, split and lane drawing to match — you are still{3}-handed everywhere it says so.",
"Une boule à effet inversé part vers le côté opposé à votre main et revient en crochet : votre quille de coin est donc la {1} et votre poche, la {2}. Activer cette option inverse en conséquence chaque dessin de quilles restantes, d'écart et d'allée — partout où votre main dominante est indiquée, elle reste la même."
],
[
"Normal {0}-hand hook",
"Crochet normal"
],
[
"{0} season wrapped up",
"{0} : saison terminée"
],
[
"Not enough games logged here yet to suggest a new number{0}. You can still update it yourself below, or skip for now.",
"Pas encore assez de parties enregistrées ici pour suggérer une nouvelle valeur{0}. Vous pouvez tout de même la mettre à jour vous-même ci-dessous, ou passer pour l'instant."
],
[
"{0}Free fall · {1} game{2:s}",
"{0}Chute libre · {1} {1|partie|parties}"
],
[
"{0}String · {1} game{2:s}",
"{0}Ficelles · {1} {1|partie|parties}"
],
[
"{0}{1}{2} on string",
"{0}{1}{2} avec ficelles"
],
[
"{0}-pins left",
"Quilles {0} restantes"
],
[
"{0}: how often each pin was left standing",
"{0} : fréquence à laquelle chaque quille est restée debout"
],
[
"{0}-pin left {1}% of first balls",
"Quille {0} restante : {1}% des premiers lancers"
],
[
"{0}{1} described",
"{0}{1} {1|décrit|décrits}"
],
[
"{0}% strikes ·",
"{0}% d'abats ·"
],
[
"((100% - {0}px) / {1})",
""
],
[
", running {0}",
", total cumulé {0}"
],
[
"· ball {0}",
"· lancer {0}"
],
[
"Showing {0} of {1}, newest first.",
"Affichage de {0} sur {1}, les plus récentes d'abord."
],
[
"{0} ten pins",
"{0} {0|quille 10|quilles 10}"
],
[
"{0} splits",
"{0} {0|écart|écarts}"
],
[
"Load {0} More",
"Charger {0} de plus"
],
[
"{0} avg",
"moy. {0}"
],
[
"{0} pins between {1} bowler{2:s}{3}",
"{0} quilles abattues par {1} {1|personne|personnes}"
],
[
"{0}{1} on my average",
"{0}{1} par rapport à ma moyenne"
],
[
"{0} more to {1} tester mode",
"Encore {0} {0|touche|touches} pour {1} le mode testeur"
],
[
"Other bowlers have a “{0}” too",
"D'autres personnes ont aussi une ligue « {0} »"
],
[
"“{0}” is already here",
"« {0} » existe déjà"
],
[
"{0} to {1} · {2} night{3:s}, {4} game{5:s}",
"Du {0} au {1} · {2} {2|soirée|soirées}, {4} {4|partie|parties}"
],
[
"Usually {0}s",
"Habituellement le {0}"
],
[
"Bowls on {0}s",
"Se joue le {0}"
],
[
"{0} team{1:s} in this league",
"{0} {0|équipe|équipes} dans cette ligue"
],
[
"sessions-{0}.csv",
"seances-{0}.csv"
],
[
"shots-{0}.csv",
"lancers-{0}.csv"
],
[
"bowling-backup-{0}.json",
"sauvegarde-quilles-{0}.json"
],
[
"You have {0} change{1:s} still waiting to save. {2} will be sent first.",
"Vous avez {0} {0|modification|modifications} en attente d'enregistrement. {0|Elle sera envoyée|Elles seront envoyées} en premier."
],
[
"Signed in as {0}.",
"Compte connecté : {0}."
],
[
"{0} change{1:s} {2} not reached the cloud yet.",
"{0} {0|modification n'a pas encore été envoyée|modifications n'ont pas encore été envoyées} au nuage."
],
[
"Signing out now may lose {0}. Sign out anyway?",
"Si vous vous déconnectez maintenant, vous risquez de perdre ces données. Vous déconnecter quand même?"
],
[
"{0} is published by My Bowling Journey LLC.",
"{0} est une publication de My Bowling Journey LLC."
],
[
"Version {0}",
"Version {0}"
],
[
"{0} day{1:s} left in your trial",
"{0} {0|jour restant|jours restants} à votre essai gratuit"
],
[
"mbj-share-{0}.png",
""
],
[
"Share {0}",
"Partager : {0}"
],
[
"{0} Team",
"Équipe {0}"
],
[
"Select {0} above",
"Sélectionnez {0} ci-dessus"
],
[
"Select {0} or {1} above",
"Sélectionnez {0} ou {1} ci-dessus"
],
[
"{0} (you)",
"{0} (vous)"
],
[
"Every rate stat side by side against {0}, instead of hunting through separate cards. Split Rate is the one metric here where lower is better.",
"Chaque statistique de taux côte à côte avec {0}, au lieu de chercher dans des cartes séparées. Le taux d'écarts est la seule mesure ici où plus bas, c'est mieux."
],
[
"{0} to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.",
"{0} pour voir ceci — la meilleure partie et le meilleur triple exigent une liste des joueurs précise, puisque combiner des équipes de tailles différentes avantagerait injustement celle qui compte le plus de membres."
],
[
"{0}'s Records",
"Records de {0}"
],
[
", game {0}",
", partie {0}"
],
[
"{0} season record",
"{0} — fiche de la saison"
],
[
"{0}-{1} on games, {2}-{3} on pinfall.",
"{0}-{1} en parties, {2}-{3} en quilles abattues."
],
[
"{0}: {1}/{2} points ({3}-{4} games, {5}-{6} pinfall)",
"{0} : {1}/{2} points ({3}-{4} en parties, {5}-{6} en quilles abattues)"
],
[
"{0} to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.",
"{0} pour voir ceci — « l'équipe » doit désigner une seule liste de joueurs précise, pas les matchs de plusieurs ligues mélangés."
],
[
"Smaller handicap (avg {0})",
"Handicap plus petit (moy. {0})"
],
[
"Larger handicap (avg {0})",
"Handicap plus grand (moy. {0})"
],
[
"{0}% stk",
"{0}% abats"
],
[
"{0} shots",
"{0} {0|lancer|lancers}"
],
[
"{0} to see this — it needs a specific roster to know who's on top.",
"{0} pour voir ceci — il faut une liste de joueurs précise pour savoir qui est en tête."
],
[
"{0}wk{1:s} on top",
"{0} sem. en tête"
],
[
"{0}/{1} games",
"{0}/{1} {1|partie|parties}"
],
[
"{0} to see this — it needs a specific roster to know who else was bowling that frame.",
"{0} pour voir ceci — il faut une liste de joueurs précise pour savoir qui d'autre jouait ce carreau-là."
],
[
"{0} of {1} frames with no open.",
"{0} {0|carreau fermé|carreaux fermés} sur {1}."
],
[
"Frames {0}",
"Carreaux {0}"
],
[
"Frame {0}",
"Carreau {0}"
],
[
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where {0} tends to leave pins, regardless of which game it is.",
"Ventilé par numéro de carreau, pas par partie — montre s'il y a un moment précis dans chaque soirée (réchauffement, transition de l'huile, la distraction du 9e carreau quand on calcule son pointage) où {0} a tendance à laisser des quilles debout, peu importe la partie."
],
[
"⚠️ Only {0} game{1:s} logged — each frame number needs at least {2} to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.",
"⚠️ Seulement {0} {0|partie enregistrée|parties enregistrées} — chaque numéro de carreau en exige au moins {2} pour distinguer une vraie tendance du hasard. D'ici là, voyez ceci comme un aperçu, pas une conclusion."
],
[
"Frame {0} (n={1})",
"Carreau {0} (n={1})"
],
[
"Weakest: {0} ({1}) · Strongest: {2} ({3})",
"Plus faible : {0} ({1}) · Plus fort : {2} ({3})"
],
[
"{0} {1} vs {2}",
"{0} {1} contre {2}"
],
[
"Across {0} fresh racks.",
"Sur {0} {0|jeu complet|jeux complets}."
],
[
"Across {0} non-strike balls.",
"Sur {0} {0|lancer|lancers} sans abat."
],
[
"{0} of {1} made. You leave a ten on {2}% of first balls.",
"Réussies : {0} sur {1}. Vous laissez la quille 10 sur {2}% de vos premiers lancers."
],
[
"{0} of {1} made. Any leave with exactly one pin standing — 7, 4, 8, 10, or any other.",
"Réussies : {0} sur {1}. Toute situation où il reste exactement une quille debout — 7, 4, 8, 10 ou n'importe quelle autre."
],
[
"{0} split{1:s} left, {2}% of your first balls.",
"{0} {0|écart laissé|écarts laissés}, {2}% de vos premiers lancers."
],
[
"{0} to see who owes a round.",
"{0} pour voir qui doit payer une tournée."
],
[
"{0} more shots needed",
"Encore {0} {0|lancer requis|lancers requis}"
],
[
"Strike {0}%",
"Abats {0}%"
],
[
"1st ball {0}",
"1er lancer {0}"
],
[
"Split {0}%",
"Écarts {0}%"
],
[
"Across {0} games.",
"Sur {0} {0|partie|parties}."
],
[
"Tracked in 5-pin steps{0}.",
"Suivi par paliers de 5 quilles{0}."
],
[
"({0}% to {1})",
"({0}% du chemin vers {1})"
],
[
"Next Session ({0} Games)",
"Prochaine soirée ({0} {0|partie|parties})"
],
[
"You're averaging {0} across {1} games. Here's what the next set does to it.",
"Votre moyenne est de {0} sur {1} {1|partie|parties}. Voici l'effet des prochaines parties."
],
[
"To reach {0}",
"Pour atteindre {0}"
],
[
"Drops to {0} at or below",
"Baisse à {0} avec au plus"
],
[
"under {0}/game",
"moins de {0} par partie"
],
[
"Across {0} {1}, ranging {2}–{3}.",
"Sur {0} {1}, de {2} à {3}."
],
[
"Composite average at each position in the night, across the whole season — shows whether {0} bowling better early, middle, or late.{1}",
"Moyenne composite à chaque position dans la soirée, sur toute la saison — montre si {0} en meilleure forme en début, en milieu ou en fin de soirée.{1}"
],
[
"Game {0}",
"Partie {0}"
],
[
"Team: {0}",
"Équipe : {0}"
],
[
"${0} paid in — {1} {2} overall.",
"${0} en mises — {1} de {2} au total."
],
[
"{0} win{1:s} and {2} jackpot{3:s}.",
"{0} {0|victoire|victoires} et {2} {2|gros lot|gros lots}."
],
[
"{0} games",
"{0} {0|partie|parties}"
],
[
"High {0}",
"Meilleure partie {0}"
],
[
"Unhide Stat Cards ({0})",
"Réafficher les cartes de stats ({0})"
],
[
"{0}{1}Manage or cancel any time in the Play Store app, under Subscriptions.",
"{0}{1} Gérez ou annulez votre abonnement en tout temps dans l'application Play Store, sous Abonnements."
],
[
"Your {0}-day free trial has started, and everything is unlocked.",
"Votre essai gratuit de {0} {0|jour|jours} a commencé, et tout est débloqué."
],
[
"You cancelled, so this ends{0}. Everything stays unlocked until then, and you can start it again any time before it ends.",
"Vous avez annulé, donc l'abonnement se termine {0}. Tout reste débloqué d'ici là, et vous pouvez le réactiver en tout temps avant la fin."
],
[
"(free keeps {0})",
"(la version gratuite en inclut {0})"
],
[
"Yearly · {0}",
"Annuel · {0}"
],
[
"Monthly · {0}",
"Mensuel · {0}"
],
[
"Start your {0}-day free trial",
"Commencer l'essai gratuit de {0} {0|jour|jours}"
],
[
"Subscribe · {0}/{1}",
"S'abonner · {0}/{1}"
],
[
"{0}{1}Cancel any time{2}{3}— you keep Pro until the end of the period you have paid for.",
"{0}{1}Annulez en tout temps {2}{3} — vous conservez Pro jusqu'à la fin de la période payée."
],
[
"Hint: {0}",
"Indice : {0}"
],
[
"Details: {0}",
"Détails : {0}"
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
"Vous êtes dans l'équipe {0} de {1}. Rejoindre l'équipe {2} vous retire de la liste des joueurs de l'équipe {3}. Vos pointages restent les vôtres."
],
[
"You're on {0}{1}.{2}",
"Vous êtes dans l'équipe {0}{1}.{2}"
],
[
"You're off {0}.",
"Vous n'êtes plus dans l'équipe {0}."
],
[
"You're on {0} in this league. If {1} approves you, you'll be taken off {2}'s roster. Your scores stay yours.",
"Vous êtes dans l'équipe {0} dans cette ligue. Si l'équipe {1} accepte votre demande, vous quitterez la liste des joueurs de l'équipe {2}. Vos pointages restent les vôtres."
],
[
"Delete \"{0}\"? This removes the team and its roster, but does not delete any bowler accounts.",
"Supprimer « {0} »? L'équipe et sa liste des joueurs seront supprimées, mais aucun compte de quilleur ou de quilleuse ne sera supprimé."
],
[
"{0}approving moves them off {1}",
"{0}accepter retire cette personne de l'équipe {1}"
],
[
"You're invited to {0}",
"Invitation à rejoindre {0}"
],
[
"Asked to join {0} — waiting for someone on the team to approve.",
"Demande envoyée à l'équipe {0} — en attente de l'approbation d'un membre de l'équipe."
],
[
"Join our team on {0} — sign up and enter code {1}",
"Joignez-vous à notre équipe sur {0} — inscrivez-vous et entrez le code {1}"
],
[
"{0} — invited, waiting for them to accept",
"{0} — invitation envoyée, en attente d'acceptation"
],
[
"{0}/{1} cuts",
"{0}/{1} qualifications"
],
[
"{0} Your history: {1} avg over {2} game{3:s}{4}",
"{0} Votre historique : {1} de moyenne sur {2} {2|partie|parties}{4}"
],
[
"+ Save \"{0}\" for next time",
"+ Enregistrer « {0} » pour la prochaine fois"
],
[
"Day {0}",
"Jour {0}"
],
[
"Go to scoring{0} {1}",
"Aller au pointage{0} {1}"
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
"{0} sur {1} en {3} {3|partie|parties}{5}."
],
[
"Go to {0} {1}",
"Aller à la section {0} {1}"
],
[
"This block{0}s frames are logged under {1}, not {2}.",
"Les carreaux de ce bloc sont enregistrés dans l'historique en date du {1}, et non du {2}."
],
[
"Move them to {0}",
"Les déplacer au {0}"
],
[
"Remove game {0}",
"Retirer la partie {0}"
],
[
"With hcp ({0}g)",
"Avec hcp ({0} p.)"
],
[
"Total ({0}g)",
"Total ({0} p.)"
],
[
"{0} Brackets & Side Pots",
"{0} Tableaux et cagnottes"
],
[
"${0} paid in — {1} ${2} on side action.",
"${0} misés — {1} de ${2} en cagnottes et tableaux."
],
[
"{0} Match Play",
"{0} Jeu par match"
],
[
"Match {0}{1}{2}",
"Match {0}{1}{2}"
],
[
"by {0}",
"par {0}"
],
[
"Go to the stepladder {0}",
"Aller à la finale à échelons {0}"
],
[
"{0} Stepladder",
"{0} Finale à échelons"
],
[
"Step {0}{1}{2}",
"Échelon {0}{1}{2}"
],
[
"Squad {0}",
"Escouade {0}"
],
[
"Block {0}",
"Bloc {0}"
],
[
"{0} average over {1} game{2:s}{3}{4}",
"{0} de moyenne sur {1} {1|partie|parties}{3}{4}"
],
[
"· on to {0}",
"· étape suivante : {0}"
],
[
"Match {0}{1}",
"Match {0}{1}"
],
[
"{0} average over {1} match{2:s}{3}{4}",
"{0} de moyenne sur {1} {1|match|matchs}{3}{4}"
],
[
"· {0} scratch",
"· {0} sans handicap"
],
[
"Best: match {0} by {1}{2}",
"Meilleur : match {0} par {1}{2}"
],
[
"Worst: match {0} by {1}{2}",
"Pire : match {0} par {1}{2}"
],
[
"On to {0}.",
"Étape suivante : {0}."
],
[
"Seeded {0}.",
"Au {0} rang des têtes de série."
],
[
"You bowl frames {0}{1}. The score stays out of your average since you did not bowl it alone, but your own frames still count.",
"Vous jouez les carreaux {0}{1}. Le pointage n'est pas compté dans votre moyenne puisque vous ne l'avez pas joué en solo, mais vos propres carreaux comptent quand même."
],
[
"The stepladder says {0} — {1}",
"Selon la finale à échelons : {0} — {1}"
],
[
"{0}${1} net",
"{0}${1} net"
],
[
"({0} game{1:s})",
"({0} {0|partie|parties})"
],
[
"{0} scratch · {1} handicap pins",
"{0} sans handicap · {1} quilles de handicap"
],
[
"0.5px solid {0}",
""
],
[
"Go to match play {0}",
"Passer au jeu par match {0}"
],
[
"I{0}m bowling",
"Je joue"
],
[
"I{0}m coaching",
"J'entraîne"
],
[
"{0} Sam Ortiz",
"{0} Sam Ortiz"
],
[
"How much data it{0}s built on, beside it",
"Sur combien de données ça s{0}appuie, juste à côté"
],
[
"Leave the target off if it isn{0}t a number",
"Laissez l'objectif vide si ce n{0}est pas un nombre"
],
[
"Target 60% {0} due 1 Apr",
"Objectif 60% {0} d'ici le 1er avril"
],
[
"{0} games{1} ·{2}averaging {3} · high {4}, low {5}. The spread is {6} pins — that's what a nightly average hides.",
"{0} {0|partie|parties} {1} ·{2}moyenne de {3} · meilleure partie {4}, plus faible {5}. La dispersion des pointages est de {6} quilles — voilà ce que cache une moyenne par soirée."
],
[
"Last {0}",
"{0} dernières parties"
],
[
"Last {0} days",
"{0} derniers jours"
],
[
"Nights here average {0} attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.",
"Les soirées affichées comptent en moyenne {0} {0|tentative|tentatives}, ce qui est peu — chaque point variera beaucoup, même si rien n'a changé dans votre jeu."
],
[
"Free trial — {0} {1} left",
"Essai gratuit — {0} {0|jour restant|jours restants}"
],
[
"Your subscription starts {0}.",
"Votre abonnement commence le {0}."
],
[
"You are on the monthly plan. The yearly plan is {0} and works out cheaper — switch any time.",
"Vous avez le forfait mensuel. Le forfait annuel coûte {0} et revient moins cher — changez quand vous voulez."
],
[
"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Crect width='34' height='34' rx='9' fill='{0}' fill-opacity='0.13'/%3E%3Cpath d='M11 14l6 6 6-6' fill='none' stroke='{1}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
""
],
[
"Pin {0}",
"Quille {0}"
],
[
"{0} was {1} by AI. It can be confidently wrong — {2}.",
"{0} a été {1} par l'IA, qui peut se tromper avec aplomb — {2}."
],
[
"⟨0⟩ wants to be your {0}.",
"⟨0⟩ souhaite être votre {0}."
],
[
"Avg {0} ⟨0⟩ · {1}g",
"Moy. {0} ⟨0⟩ · {1} p."
],
[
"${0} won⟨0⟩${1} in",
"${0} gagnés⟨0⟩${1} misés"
],
[
"Suggested new book average: ⟨0⟩ — {0}.{1} Change the number below if this doesn't match your full season.",
"Nouvelle moyenne établie suggérée : ⟨0⟩ — {0}.{1} Modifiez le nombre ci-dessous s'il ne correspond pas à votre saison complète."
],
[
"{0} avg ⟨0⟩",
"{0} de moy. ⟨0⟩"
],
[
"You — {0}/{1} ⟨0⟩",
"Vous — {0}/{1} ⟨0⟩"
],
[
"{0} — {1}{2} attempts ⟨0⟩",
"{0} — {1}{2} {2|tentative|tentatives} ⟨0⟩"
],
[
"{0} — {1}, {2} attempts ⟨0⟩",
"{0} — {1}, {2} {2|tentative|tentatives} ⟨0⟩"
],
[
"We sent a {0}-digit code to ⟨0⟩.",
"Nous avons envoyé un code de {0} chiffres à ⟨0⟩."
],
[
"⟨0⟩ wants to join {0}",
"⟨0⟩ veut rejoindre {0}"
],
[
"Cost ${0} · ⟨0⟩",
"Coût ${0} · ⟨0⟩"
],
[
"{0} wants to be your coach",
"{0} souhaite devenir votre entraîneur"
],
[
"{0} wants to be your bowler",
"{0} vous demande de l'entraîner"
],
[
"{0}% strikes",
"{0}% d'abats"
],
[
"{0} described",
"{0} {0|décrit|décrits}"
],
[
"The analysis service didn't respond properly ({0}). This is usually temporary — tap Try Again.",
"Le service d'analyse n'a pas répondu correctement ({0}). C'est habituellement temporaire — touchez Réessayer."
],
[
"The lamp went quiet. Try again in a moment. (ref {0})",
"La lampe s'est tue. Réessayez dans un moment. (réf. {0})"
],
[
"Location search failed ({0}).",
"La recherche par position a échoué ({0})."
],
[
"Unsupported image type: {0}",
"Type d'image non pris en charge : {0}"
],
[
"Couldn't pour the nightcap ({0}). Tap to try again.",
"Impossible de servir le Nightcap ({0}). Touchez pour réessayer."
],
[
"{0} {1} left today",
"{0} {0|question restante|questions restantes} aujourd'hui"
],
[
"{0} league{1:s}",
"{0} {0|ligue|ligues}"
],
[
"{0} ball{1:s}",
"{0} {0|boule|boules}"
],
[
"{0} bowler",
"{0} membre"
],
[
"{0} bowlers",
"{0} membres"
],
[
"{0} set",
"{0} {0|définie|définies}"
],
[
"{0} available",
"{0} {0|disponible|disponibles}"
],
[
"{0} times",
"{0} fois"
],
[
"{0} view",
"Affichage : {0}"
],
[
"{0}: playing",
"{0} : participation"
],
[
"{0}: not playing",
"{0} : aucune participation"
],
[
"Frame {0}, {1}, running {2}",
"Carreau {0}, {1}, total {2}"
],
[
"Frame {0}, not bowled",
"Carreau {0}, non joué"
],
[
"Frame {0}, not bowled, running {1}",
"Carreau {0}, non joué, total {1}"
],
[
"Frame {0}, {1}",
"Carreau {0}, {1}"
],
[
"{0} pin{1:s} short",
"il manque {0} {0|quille|quilles}"
],
[
"best {0}",
"record : {0}"
],
[
"{0} of {1}",
"{0} sur {1}"
],
[
"— {0}, {1}",
"— {0}, {1}"
],
[
"{0} series",
"Triple de {0}"
],
[
"{0}: {1} series",
"{0} : triple de {1}"
],
[
"Delete {0}",
"Supprimer {0}"
],
[
"nightcap:{0}|{1}|{2}|{3}{4}",
""
],
[
"{0} of {1} attempts",
"{0} sur {1} {1|tentative|tentatives}"
],
[
"{0} of {1} attempt",
"{0} sur {1} {1|tentative|tentatives}"
],
[
"{0} of {1} balls",
"{0} {0|boule|boules} sur {1}"
],
[
"{0} of {1} nights",
"{0} {0|soirée|soirées} sur {1}"
],
[
"{0} of {1} games",
"{0} {0|partie|parties} sur {1}"
],
[
"{0}-{1} standing",
"{0}-{1} debout"
],
[
"{0} standing",
"{0} debout"
],
[
"▲ {0} more",
"▲ {0} de plus"
],
[
"▼ {0} more",
"▼ {0} de plus"
],
[
"{0} bag",
"{0} sac"
],
[
"{0} bags",
"{0} sacs"
],
[
"{0} pin",
"Quille {0}"
],
[
"e.g. {0}",
"p. ex. {0}"
],
[
"{0}% converted",
"{0}% de réussite"
],
[
"Trending up about {0} pins across this stretch.",
"En hausse d'environ {0} {0|quille|quilles} sur cette période."
],
[
"Trending down about {0} pins across this stretch.",
"En baisse d'environ {0} {0|quille|quilles} sur cette période."
],
[
"Trending up about {0} points across this stretch.",
"En hausse d'environ {0} {0|point|points} sur cette période."
],
[
"Trending down about {0} points across this stretch.",
"En baisse d'environ {0} {0|point|points} sur cette période."
],
[
"Trending up about {0} across this stretch.",
"En hausse d'environ {0} sur cette période."
],
[
"Trending down about {0} across this stretch.",
"En baisse d'environ {0} sur cette période."
],
[
"${0} paid in — up ${1} on the night.",
"Mise : ${0} — gain de ${1} pour la soirée."
],
[
"${0} paid in — down ${1} on the night.",
"Mise : ${0} — perte de ${1} pour la soirée."
],
[
"${0} paid in — up {1} overall.",
"Mises : ${0} — gain de {1} au total."
],
[
"${0} paid in — down {1} overall.",
"Mises : ${0} — perte de {1} au total."
],
[
"${0} paid in — up ${1} on side action.",
"Mises : ${0} — gain de ${1} en cagnottes et tableaux."
],
[
"${0} paid in — down ${1} on side action.",
"Mises : ${0} — perte de ${1} en cagnottes et tableaux."
],
[
"Hide {0}",
"Masquer « {0} »"
],
[
"10-Pin {0}%",
"Quille 10 : {0}%"
],
[
"{0}% {1} pin",
"quille {1} : {0}%"
],
[
"{0} (me)",
"{0} (moi)"
],
[
"{0} ({1}g)",
"{0} ({1} p.)"
],
[
"Left: {0}",
"Gauche : {0}"
],
[
"Right: {0}",
"Droite : {0}"
],
[
"Fast: {0}",
"Rapide : {0}"
],
[
"Slow: {0}",
"Lente : {0}"
],
[
"Execution: {0}",
"Exécution : {0}"
],
[
"Earned · {0}",
"Obtenu · {0}"
],
[
"Open results for {0} night, {1}",
"Ouvrir les résultats de la soirée du {1}"
],
[
"Game {0} ball",
"Boule de la partie {0}"
],
[
"{0} max",
"{0} max."
],
[
"Your {0}-day free trial starts today. When it ends, the {1} plan starts at {2} and renews on its own until you cancel.",
"Votre essai gratuit de {0} {0|jour|jours} commence aujourd'hui. À la fin de l'essai, le forfait {1} commence à {2} et se renouvelle automatiquement jusqu'à ce que vous l'annuliez."
],
[
"The {0} plan is {1}. Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.",
"Le forfait {0} coûte {1}. Google Play indique si un essai gratuit s'applique à votre compte avant que vous confirmiez, puis l'abonnement se renouvelle automatiquement jusqu'à ce que vous l'annuliez."
],
[
"The {0} plan is {1}.",
"Le forfait {0} coûte {1}."
],
[
"You have already had the free trial, so the {0} plan starts today at {1} and renews on its own until you cancel.",
"Vous avez déjà profité de l'essai gratuit, donc le forfait {0} commence aujourd'hui à {1} et se renouvelle automatiquement jusqu'à ce que vous l'annuliez."
],
[
"Ask {0}",
"Demandez à {0}"
],
[
"You've used all {0} questions today. Ask again tomorrow.",
"Vous avez utilisé vos {0} questions du jour. Revenez demain."
],
[
"Ask {0} a question",
"Poser une question à {0}"
],
[
"Brooklyn couldn't answer that. Try again in a moment. (ref {0})",
"Brooklyn n'a pas pu répondre. Réessayez dans un moment. (réf. {0})"
],
[
"Coach · {0}",
"Entraîneur · {0}"
],
[
"{0} strips for {1} games",
""
],
[
"▸ Check frames · {0} flagged",
"▸ Vérifier les carreaux · {0} {0|signalé|signalés}"
],
[
"image {0} matched no bowler",
""
],
[
" ({0} settled by the printed total)",
""
],
[
"({0} settled by the printed total)",
""
],
[
"That sign-in link is for {0}, not the account you're signed in to. Sign out first if you meant to switch.",
"Ce lien de connexion est pour {0}, pas pour le compte auquel vous êtes connecté. Déconnectez-vous d'abord si vous vouliez changer de compte."
],
[
"Sign in as {0}?",
"Se connecter en tant que {0}?"
],
[
"{0} (pending)",
"{0} (en attente)"
],
[
"rotate(-90 10 {0})",
"rotate(-90 10 {0})"
],
[
"{0}: no cover or core entered yet, so {1} be placed.",
"{0} : aucun enrobage ni noyau saisi, donc {1} être placée(s)."
],
[
"A big step down from {0} to {1}: a condition between them has no ball.",
"Un grand écart de force entre {0} et {1} : aucune boule pour les conditions entre les deux."
],
[
"{0} and {1} sit almost on top of each other. They do the same job.",
"{0} et {1} sont presque au même endroit. Elles font le même travail."
],
[
"{0} A wider range means the bag covers more conditions.",
"{0} Un écart plus large veut dire que le sac couvre plus de conditions."
],
[
"In both bags: {0}.",
"Dans les deux sacs : {0}."
],
[
"In {0}",
"Dans {0}"
],
[
"From the catalog: {0}",
"Dans le catalogue : {0}"
],
[
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.{0}",
"Votre caddie lit tout le sac — quelle boule pour quelle condition, quel sac est bien monté, quoi ajouter et quoi laisser à la maison. Ça fait partie du forfait payant.{0}"
],
[
"Reads {0}: what it's built for and what it's missing.",
"Lit {0} : pour quoi il est monté et ce qui lui manque."
],
[
"{0} games · {1} avg{2}{3}{4}",
"{0} parties · moy. {1}{2}{3}{4}"
],
[
"· best {0}",
"· meilleure en {0}"
],
[
"· {0}% strikes",
"· {0} % d'abats"
],
[
"Surface: {0}{1}{2}Layout: {3}",
"Surface : {0}{1}{2}Perçage : {3}"
],
[
"Strength {0} · Length {1} · Back end {2}⟨0⟩",
"Force {0} · Longueur {1} · Retour {2}⟨0⟩"
],
[
"{0} games at {1}{2}.{3}",
"{0} parties à {1}{2}.{3}"
],
[
", against your {0} overall",
", contre votre moyenne globale de {0}"
],
[
"By part of the night: {0}.",
"Selon le moment de la soirée : {0}."
],
[
"All {0} of your leagues",
"Vos {0} ligues"
],
[
"Basic keeps {0} league active. The others are paused — nothing is deleted, and they come back when you do.",
"Basic garde {0} ligue active. Les autres sont mises en pause — rien n'est supprimé, et elles reviennent quand vous revenez."
],
[
"All {0} of your teams",
"Vos {0} équipes"
],
[
"Basic keeps {0}.",
"Basic en garde {0}."
],
[
"Which of your {0} balls carries best, and how each one holds up from the first game to the last.",
"Laquelle de vos {0} boules porte le mieux, et comment chacune tient de la première partie à la dernière."
],
[
"Your read-back after every night — you've poured {0}.",
"Votre retour sur chaque soirée — vous en avez servi {0}."
],
[
"Answers about your own game — you've asked {0} question{1:s}.",
"Des réponses sur votre propre jeu — vous avez posé {0} {0|question|questions}."
],
[
"The deep read of your game — you've run it {0} time{1:s}.",
"L'analyse approfondie de votre jeu — utilisée {0} {0|fois|fois}."
],
[
"Your arsenal and bags, read ball by ball — {0} read{1:s} so far.",
"Votre arsenal et vos sacs, lus boule par boule — {0} {0|lecture|lectures} jusqu'ici."
],
[
"All {0} of your bags",
"Vos {0} sacs"
],
[
"Basic keeps {0} league bag and {1} tournament bag.",
"Basic garde {0} sac de ligue et {1} sac de tournoi."
],
[
"How you score at each of the {0} centers you've bowled.",
"Vos pointages dans chacun des {0} centres où vous avez joué."
],
[
"for {0}/month",
"pour {0}/mois"
],
[
"You've logged {0} games with your {1}!",
"Vous avez inscrit {0} parties avec votre {1}!"
],
[
"To keep seeing how it stacks up against the rest of your bag — which ball carries, and when — keep Pro{0}.",
"Pour continuer à voir comment elle se compare au reste de votre sac — quelle boule porte, et quand — gardez Pro{0}."
],
[
"You've poured {0} Nightcaps!",
"Vous avez servi {0} Nightcaps!"
],
[
"To keep getting one after every night, keep Pro{0}.",
"Pour continuer d'en recevoir un après chaque soirée, gardez Pro{0}."
],
[
"You're tracking {0} leagues!",
"Vous suivez {0} ligues!"
],
[
"To keep all of them active, keep Pro{0}.",
"Pour les garder toutes actives, gardez Pro{0}."
],
[
"You've logged {0} games in your first 60 days!",
"Vous avez inscrit {0} parties dans vos 60 premiers jours!"
],
[
"To keep the comparisons and the AI reads of your game, keep Pro{0}.",
"Pour garder les comparaisons et les analyses IA de votre jeu, gardez Pro{0}."
],
[
"Keep everything unlocked{0}, or carry on with Basic — your scores and stats stay free.",
"Gardez tout débloqué{0}, ou continuez avec Basic — vos pointages et statistiques restent gratuits."
],
[
"Your Pro trial ends in {0} day{1:s}",
"Votre essai Pro se termine dans {0} {0|jour|jours}"
],
[
"Keep Pro · {0}/month",
"Garder Pro · {0}/mois"
],
[
"Or {0}/year",
"Ou {0}/an"
],
[
"Pro trial — {0} day{1:s} left. No card on file; nothing is charged when it ends.",
"Essai Pro — {0} {0|jour|jours} restants. Aucune carte enregistrée; rien n'est facturé à la fin."
],
[
"Thanks for subscribing. Everything is unlocked.{0}Manage or cancel any time in the Play Store app, under Subscriptions.",
"Merci de votre abonnement. Tout est débloqué.{0}Gérez ou annulez en tout temps dans l'application Play Store, sous Abonnements."
],
[
"You have Pro free for {0} more day{1:s}. Subscribing now starts billing today; you can also wait, and we'll ask when your trial ends.",
"Vous avez Pro gratuitement pour encore {0} {0|jour|jours}. S'abonner maintenant commence la facturation aujourd'hui; vous pouvez aussi attendre, et nous vous le demanderons à la fin de votre essai."
],
[
"⟨0⟩ {0} · {1} shots",
"⟨0⟩ {0} · {1} lancers"
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
"Vous avez annulé, donc l'abonnement se termine le {0}. Tout reste débloqué d'ici là, et vous pouvez le réactiver en tout temps avant la fin."
],
[
"{0}. {1}{2} — {3} avg, {4} games",
""
],
[
"{0}. {1} — {2} avg, {3} games",
"{0}. {1} — moy. {2}, {3} {3|partie|parties}"
],
[
"Finished {0}.",
"Terminé au {0} rang."
],
[
"Finished {0} to the {1} seed.",
"Terminé au {0} rang après une défaite contre la {1} tête de série."
],
[
"Finished {0} to {1}.",
"Terminé au {0} rang après une défaite contre {1}."
],
[
"The {0} plan starts today at {1} and renews on its own until you cancel.",
"Le forfait {0} entre en vigueur aujourd'hui au prix de {1} et se renouvelle automatiquement jusqu'à ce que vous l'annuliez."
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
