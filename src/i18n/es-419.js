// Latin American Spanish (es-419) for My Bowling Journey -- for bowlers in
// Mexico, Puerto Rico, the US and the rest of Latin America.
//
// English -> Spanish, in the same shape as fr-CA.js. `exact` is whole text;
// `patterns` are texts built in code, {0} {1}... being the values (see
// src/i18n/engine.js for the rules, including {0|singular|plural} and
// {1:s}). An empty string means "looked at, not text a person reads" and is
// skipped. "lang": "es" gives Spanish number, punctuation and plural rules.
//
// Edit entries here directly. After adding English text to the app, run
//   node scripts/i18n_extract.cjs --missing
// to list what still needs an entry here and in fr-CA.js. Terminology and
// style: src/i18n/glossary-es.md and src/i18n/style-es.md.
export const ES_419 = {
"lang": "es",
"exact": {
"Group": "Grupo",
"Ungrouped": "Sin grupo",
"Coverstock": "Cubierta",
"Core": "Núcleo",
"Weight (lb)": "Peso (lb)",
"Diff": "Diff",
"Int. Diff (asymmetric only)": "Diff int. (solo núcleo asimétrico)",
"Layout System": "Sistema de layout",
"Add": "Agregar",
"'s balls to start logging shots.": ": sus bolas, para empezar a registrar tiros.",
"Active": "Activas",
"Archive": "Archivadas",
"Done": "Listo",
"Details": "Detalles",
"Remove": "Quitar",
"Cancel": "Cancelar",
"No games logged with it yet": "Todavía no hay juegos registrados con esta bola",
"No layout recorded": "Sin layout registrado",
"Specs": "Especificaciones",
"Layout": "Layout",
"Throwing it again": "La vuelvo a tirar",
"No longer throwing this ball? Archiving takes it out of your arsenal and bags and keeps every shot you logged with it.": "¿Ya no tiras esta bola? Archivarla la quita de tu arsenal y de tus maletas, y conserva todos los tiros que registraste con ella.",
"Archive this ball": "Archivar esta bola",
"Specs Removed": "Especificaciones eliminadas",
"Other bowlers reported the shared specs for": "Otras personas reportaron que las especificaciones compartidas de",
"as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "eran incorrectas, así que se eliminaron. Todavía tienes la bola — solo vuelve a ingresar sus datos cuando puedas.",
"Got it": "Entendido",
"Group by": "Agrupar por",
"Your groups": "Tus grupos",
"Delete": "Eliminar",
"New group, e.g. Dry lanes": "Nuevo grupo, p. ej. Pistas secas",
"To put a ball in a group, open the ball and pick the group under its specs.": "Para poner una bola en un grupo, abre la bola y elige el grupo debajo de sus especificaciones.",
"Enter the code from your email.": "Ingresa el código que te llegó por correo.",
"Couldn't delete the account. Try again, or email support@mybowlingjourney.com.": "No se pudo eliminar la cuenta. Intenta de nuevo o escribe a support@mybowlingjourney.com.",
"The server didn't confirm the deletion. Nothing has been removed — email support@mybowlingjourney.com.": "El servidor no confirmó la eliminación. No se borró nada — escribe a support@mybowlingjourney.com.",
"Couldn't reach the server. Nothing has been deleted.": "No se pudo conectar con el servidor. No se eliminó nada.",
"Not signed in or name is empty": "No has iniciado sesión o el nombre está vacío",
"unknown reason": "motivo desconocido",
"useAuth must be used inside <AuthProvider>": "",
"That code did not work. Check it came through in one piece.": "Ese código no funcionó. Revisa que haya llegado completo.",
"Your badges": "Tus insignias",
"Your open bowling badges": "Tus insignias de juego libre",
"of": "de",
"Bowl a league night, a tournament or a practice session to start.": "Juega una noche de liga, un torneo o una sesión de práctica para empezar.",
"Bowl a night with the group and the first one is yours.": "Juega una noche con el grupo y la primera es tuya.",
"Every one of them.": "Todas, sin excepción.",
"Every one of them. Including the ones nobody wants.": "Todas, sin excepción. Incluso las que nadie quiere.",
"Some come from one good night, some take a season.": "Algunas llegan con una buena noche; otras toman toda una temporada.",
"Not all of them are about bowling well — some are about showing up, and one or two you'd rather not have.": "No todas son por jugar bien — algunas son por no faltar, y hay una o dos que preferirías no tener.",
"Share my badges": "Compartir mis insignias",
"The collection": "La colección",
"All": "Todas",
"Earned": "Logrado",
"None yet.": "Ninguna todavía.",
"None yet. Bowl a night with the group and the first one is yours.": "Ninguna todavía. Juega una noche con el grupo y la primera es tuya.",
"Nothing left. You have all of them.": "No falta ninguna. Las tienes todas.",
"Someone sent you your badges?": "¿Alguien te envió tus insignias?",
"Paste the code from their message and your nights come across. Doing it twice is harmless — nothing doubles up.": "Pega el código de su mensaje y tus noches se transfieren. Hacerlo dos veces no causa problemas — nada se duplica.",
"Paste the code": "Pega el código",
"Load": "Cargar",
"Edit Bag": "Editar maleta",
"New Bag": "Nueva maleta",
"Name": "Nombre",
"e.g. Short pattern, 6 ball limit": "p. ej. Patrón corto, límite de 6 bolas",
"Type": "Tipo",
"Balls Allowed": "Bolas permitidas",
"The total the tournament allows. Leave blank for no limit.": "El total que permite el torneo. Déjalo en blanco si no hay límite.",
"e.g. 6": "p. ej. 6",
"Plan to include a plastic": "Incluir una bola de plástico",
"A note for your own planning — it doesn't change the limit above.": "Una nota para tu propia planeación — no cambia el límite de arriba.",
"Save Bag": "Guardar maleta",
"Give the bag a name to save it.": "Ponle nombre a la maleta para guardarla.",
"Add a bag": "Agregar una maleta",
"What you carry to league differs from what you carry to a tournament — and tournaments often cap how many balls you may bring, so you can keep several.": "Lo que llevas a la liga no es lo mismo que lo que llevas a un torneo — y los torneos suelen limitar cuántas bolas puedes llevar, así que puedes tener varias maletas.",
"+ League Bag": "+ Maleta de liga",
"+ Tournament Bag": "+ Maleta de torneo",
"More bags": "Más maletas",
"The free plan covers": "El plan gratuito incluye",
"league bag and": "maleta de liga y",
"tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.": "maleta de torneo. Las maletas extra — una de torneo para patrón corto, una para patrón deportivo — son parte del plan de pago. Lo que ya tienes en tus maletas se queda donde está.",
"Bags": "Maletas",
"No bags yet. Add one above.": "Todavía no hay maletas. Agrega una arriba.",
"ball": "bola",
"· plastic planned": "· bola de plástico prevista",
"Edit": "Editar",
"Keep": "Conservar",
"🔒 Pro — kept exactly as packed, and back the moment you subscribe.": "🔒 Pro — se guarda tal como está y vuelve en cuanto te suscribas.",
"Full — remove a ball before adding another.": "Llena — quita una bola antes de agregar otra.",
"Empty. Add balls from below.": "Vacía. Agrega bolas desde abajo.",
"Add Balls to a Bag": "Agregar bolas a una maleta",
"Every ball is packed. Practice always shows every ball regardless.": "Todas las bolas están en una maleta. En Práctica siempre aparecen todas las bolas.",
"· not in any bag": "· en ninguna maleta",
"Community Specs": "Especificaciones de la comunidad",
"Nobody has shared specs for this ball yet. If you've filled yours in, you can share them so other bowlers don't have to type them.": "Nadie ha compartido todavía las especificaciones de esta bola. Si ya llenaste las tuyas, puedes compartirlas para que otras personas no tengan que escribirlas.",
"Share My Specs": "Compartir mis datos",
"Yours": "Las tuyas",
"No details recorded": "Sin datos registrados",
"Showing the": "Mostrando los números de",
"lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.": "lb — el RG y el diferencial cambian según el peso, y los números de esta bola se publicaron para más de uno.",
"No published numbers for": "No hay números publicados para",
"lb specifically — showing the reference weight instead.": "lb específicamente — se muestra el peso de referencia en su lugar.",
"more": "más",
"to": "a",
"Applied": "Aplicado",
"Use These": "Usar estas",
"✓ Looks right": "✓ Parece correcto",
"Looks right": "Parece correcto",
"✓ Wrong": "✓ Incorrecto",
"Wrong": "Incorrecto",
"Update Shared": "Actualizar lo compartido",
"Locked — enough bowlers have confirmed these that they can't be edited.": "Bloqueadas — suficientes personas las confirmaron, así que ya no se pueden editar.",
"Voting closed.": "Votación cerrada.",
"Share Mine Instead": "Mejor compartir las mías",
"Ball path": "Recorrido de la bola",
"First balls at a full rack only": "Solo primeros tiros con los 10 pinos en pie",
"what a strike ball is for.": "para eso sirve la bola de strike.",
"Add a ball (e.g. Storm Phaze II)": "Bola, p. ej. Storm Phaze II",
"From other bowlers": "De otros jugadores",
"Specs entered by other bowlers, not manufacturer data — check them after adding.": "Especificaciones que ingresaron otras personas, no datos del fabricante — revísalas después de agregar la bola.",
"Strike % through the night": "% de strikes en la noche",
"How each ball carried as the lanes went, first games to last.": "Cuánto derribó cada bola a medida que cambiaban las pistas, del primer juego al último.",
"Ball": "Bola",
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than": "Cada número es un porcentaje de strikes. La negrita marca la bola que lidera esa fase; nada va en negrita cuando la diferencia es tan pequeña que puede ser casualidad. Un porcentaje en ámbar se basa en menos de",
"shots behind it, so treat it as preliminary. A dash means no shots at all.": "tiros, así que tómalo como preliminar. Un guion significa que no hubo ningún tiro.",
"Rubbing the lamp…": "Frotando la lámpara…",
"Reading your numbers…": "Leyendo tus números…",
"Working out what they mean…": "Descifrando qué significan…",
"Still going — it is a fair question…": "Todavía en eso — la pregunta lo amerita…",
"You've used all": "Ya usaste tus",
"today.": "hoy.",
"is back tomorrow.": "vuelve mañana.",
"The Stats screens cover the usual numbers.": "Las pantallas de Stats cubren los números de siempre.",
"is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.": "es para las preguntas que ahí no se responden — pregunta sobre cómo juegas y ella lo deduce a partir de lo que has registrado. Si le falta algo que todavía no registras, te dirá qué empezar a anotar.",
"Ask about your bowling…": "¿Qué quieres saber?",
"Ask": "Preguntar",
"That": "Esto",
"Tour": "",
"Journey": "Trayectoria",
"Home": "Inicio",
"BadgeCollection": "",
"TeamManagement": "",
"Friends": "Amigos",
"StatsView": "",
"ImportScorecard": "",
"Settings": "Configuración",
"Profile": "Perfil",
"TrendsView": "",
"CoachingView": "",
"InsightsView": "",
"A team with that name already exists in this league.": "Ya existe un equipo con ese nombre en esta liga.",
"Could not clear the sync markers on this device. Nothing was changed.": "No se pudieron borrar las marcas de sincronización en este dispositivo. No se cambió nada.",
"Only the bowler who added this league can combine it. Ask them, or join the shared league from a team code.": "Solo quien agregó esta liga puede combinarla. Pídeselo, o únete a la liga compartida con un código de equipo.",
"Couldn't combine them just now. Nothing was changed — try again in a moment.": "No se pudieron combinar ahora. No se cambió nada — inténtalo de nuevo en un momento.",
"You already have a league with that name. Rename yours first, then join this one.": "Ya tienes una liga con ese nombre. Primero cámbiale el nombre a la tuya y luego únete a esta.",
"Couldn't join that league just now. Check your connection and try again.": "No pudimos unirte a esa liga ahora. Revisa tu conexión e inténtalo de nuevo.",
"A league with that name already exists.": "Ya existe una liga con ese nombre.",
"Pick a bowler first.": "Primero elige un jugador.",
"Give the ball a name.": "Ponle nombre a la bola.",
"Location is needed to find nearby centers. Allow location access, or add the center by name.": "Se necesita tu ubicación para encontrar centros de boliche cercanos. Permite el acceso a la ubicación o agrega el centro por su nombre.",
"Couldn't search for centers right now. You can add the center by name instead.": "No se pudieron buscar centros en este momento. Puedes agregar el centro por su nombre.",
"this team": "este equipo",
"That request was already answered, or couldn't be reached. Refreshing.": "Esa solicitud ya fue respondida o no se pudo acceder a ella. Actualizando.",
"the team": "el equipo",
"They": "Esa persona",
"your team": "tu equipo",
"Couldn't join that team just now — try again in a moment.": "No pudimos unirte a ese equipo ahora — inténtalo de nuevo en un momento.",
"Someone": "Alguien",
"Couldn't make a code just now — check your connection and try again.": "No se pudo generar un código ahora — revisa tu conexión e inténtalo de nuevo.",
"That code doesn't look right — it's 8 characters.": "Ese código no parece correcto — tiene 8 caracteres.",
"That code is not valid.": "Ese código no es válido.",
"That doesn't look like a team code.": "Eso no parece un código de equipo.",
"Couldn't check that code — you may be offline. You can enter it later in Settings.": "No se pudo verificar ese código — quizá no tienes conexión. Puedes ingresarlo después en Configuración.",
"Give the tournament a name first — it's on the Set up tab.": "Primero ponle nombre al torneo — está en la pestaña Preparar.",
"Weak 10": "10 débil",
"Ringing 10": "10 aislado",
"Other Leave": "Otros pinos",
"9 Pin No-Tap": "No-tap de 9 pinos",
"Yes": "Sí",
"Not a valid backup file": "No es un archivo de respaldo válido",
"No shots logged yet for this night": "Todavía no hay tiros registrados para esta noche",
"The lamp flickered and went quiet. Try again in a few minutes.": "La lámpara parpadeó y se quedó en silencio. Vuelve a intentarlo en unos minutos.",
"Brooklyn had no answer for that.": "Brooklyn no tuvo respuesta para eso.",
"open bowling": "",
"Sunday": "domingo",
"Monday": "lunes",
"Tuesday": "martes",
"Wednesday": "miércoles",
"Thursday": "jueves",
"Friday": "viernes",
"Saturday": "sábado",
"Couldn't get your insights right now. Try again in a few minutes.": "No pudimos obtener tus análisis ahora. Inténtalo de nuevo en unos minutos.",
"Bowl": "Jugar",
"Standings": "Posiciones",
"Setup": "Preparar",
"Stats": "Stats",
"Improve": "Mejorar",
"History": "Historial",
"House Shot": "Patrón de casa",
"Back": "Atrás",
"Inbox": "Bandeja de entrada",
"Coach": "Entrenador",
"Help": "Ayuda",
"Results": "Resultados",
"Import scorecard": "Importar hoja de puntaje",
"My Bowling Journey Pro": "My Bowling Journey Pro",
"⟳ Backing up": "⟳ Respaldando",
"Import": "Importar",
"You're all set": "Todo listo",
"We know you're keen to get started — so we won't hold you up for long. We'd just like to show you around first.": "Sabemos que tienes ganas de empezar — así que no te quitaremos mucho tiempo. Solo queremos mostrarte la app primero.",
"And remember, you can document as much or as little as you want. The more you tell us, the more we can give back.": "Y recuerda: puedes anotar tanto o tan poco como quieras. Cuanto más nos cuentes, más podemos darte a cambio.",
"Begin": "Comenzar",
"No thanks — I'll take the tour later from the settings menu": "No, gracias — haré el recorrido después desde el menú de configuración",
"Close": "Cerrar",
"change is": "cambio guardado",
"changes are": "cambios guardados",
"saved on this phone. Nothing is lost.": "en este teléfono. No se pierde nada.",
"Trying…": "Reintentando…",
"Try again now": "Reintentar ahora",
"Loading…": "Cargando…",
"🧑‍🏫 Coach": "🧑‍🏫 Entrenador",
"🎯 Start a practice drill": "🎯 Empezar un ejercicio",
"Competitive": "Competitivo",
"Open bowling": "Juego libre",
"a team": "un equipo",
"A bowler": "Alguien",
"Joining lets teammates see your scores and yours theirs.": "Al unirte, los integrantes del equipo verán tus puntajes y tú, los suyos.",
"Anyone on the team can answer.": "Cualquier integrante del equipo puede responder.",
"Join": "Unirme",
"Approve": "Aprobar",
"No thanks": "No, gracias",
"Decline": "Rechazar",
"Nothing Waiting": "Nada pendiente",
"Requests, coach tasks and scores to confirm show up here.": "Aquí aparecen las solicitudes, las tareas de tu entrenador y los puntajes por confirmar.",
"Balls": "Bolas",
"League": "Liga",
"Team": "Equipo",
"waiting for you": "por revisar",
"1px solid transparent": "",
"Practice": "Práctica",
"Tournament": "Torneo",
"🏆 Won it": "🏆 Lo ganaste",
"🥈 Runner-up": "🥈 Segundo lugar",
"🏅 Top five": "🏅 Entre los cinco primeros",
"💰 Cashed": "💰 Cobraste premio",
"✅ Made the cut": "✅ Pasaste el corte",
"QUALIFYING": "CLASIFICACIÓN",
"total ·": "en total ·",
"average ·": "de promedio ·",
"high": "de máximo",
"vs the cut": "respecto al corte",
"MATCH PLAY": "MATCH PLAY",
"match": "match",
"with bonus": "con bono",
"STEPLADDER": "FINAL ESCALONADA",
"step": "escalón",
"won": "ganados",
"Nothing logged yet. Once you've bowled a night or two, this shows the shape of a month — which weeks you bowled and which you missed.": "Aún no hay nada registrado. Cuando hayas jugado una noche o dos, aquí verás la forma de tu mes — qué semanas jugaste y cuáles te saltaste.",
"Earlier month": "Mes anterior",
"Later month": "Mes siguiente",
"Nothing bowled this month": "Sin juegos este mes",
"Bowling": "Juego libre",
"series ·": "de serie ·",
"% strikes": "% strikes",
"Delete this night?": "¿Eliminar esta noche?",
"game": "juego",
"and every frame logged with them. This cannot be undone.": "y todos los cuadros registrados en ellos. Esto no se puede deshacer.",
"Yes, delete it": "Sí, eliminarla",
"Keep it": "Conservar",
"Delete this night": "Eliminar esta noche",
"Nobody here yet. Add people to your scoresheet on the Bowl tab and they'll show up once you've bowled a night together.": "Aún no hay nadie aquí. Agrega personas a tu hoja de puntaje en la pestaña Jugar y aparecerán en cuanto compartan una noche de juego contigo.",
"Everyone you've bowled with, by average.": "Todas las personas con quienes has jugado, por promedio.",
"Add someone to compare against.": "Agrega a alguien para compararte.",
"Share standings": "Compartir posiciones",
"night": "noche",
"best": "mejor juego",
"win": "victoria",
"See all my badges ›": "Ver todas mis insignias ›",
"Change": "Cambiar",
"Pins": "Armadora",
"Which lanes are free fall? Everything else counts as string.": "¿Qué pistas tienen armadora de caída libre? Todas las demás cuentan como de cuerdas.",
"e.g. 1-8, 15, 16": "p. ej., 1-8, 15, 16",
"Until these are set, this house stays out of the free fall vs string comparison.": "Hasta que las indiques, este centro queda fuera de la comparación entre caída libre y cuerdas.",
"Bowling Center": "Centro de boliche",
"Where do you usually practice? Setting it lets you compare how you score house to house.": "¿Dónde sueles practicar? Indicarlo te permite comparar tus puntajes de un centro a otro.",
"Where do you usually bowl for fun? Setting it lets you compare how you score house to house.": "¿Dónde sueles jugar por diversión? Indicarlo te permite comparar tus puntajes de un centro a otro.",
"this league": "esta liga",
"Search by name, e.g. Arsenal Bowl": "Busca por nombre, p. ej., Arsenal Bowl",
"Searching…": "Buscando…",
"No centers found nearby. You can add it by name below.": "No se encontraron centros cerca. Puedes agregarlo por nombre abajo.",
"This list": "Esta lista",
"check the name and address before you rely on it": "revisa el nombre y la dirección antes de confiar en ella",
"mi": "mi",
"Can't find it? Add by name": "¿No lo encuentras? Agrégalo por nombre",
"Center name": "Nombre del centro",
"Target:": "Meta:",
"reached": "logrado:",
"short)": "por debajo)",
"Due": "Fecha límite",
"Worked on it": "Lo trabajé",
"What did you get to?": "¿Qué resultado lograste?",
"Anything to tell your coach?": "¿Algo que decirle a tu entrenador?",
"Save": "Guardar",
"Reopen": "Reabrir",
"Give the task a title.": "Ponle un título a la tarea.",
"What should they work on?": "¿En qué debe trabajar?",
"Detail (optional)": "Detalle (opcional)",
"Measurable target (optional)": "Meta medible (opcional)",
"No target": "Sin meta",
"Target": "Meta",
"Assign": "Asignar",
"Nothing here yet. Both of you can write, and you both see everything.": "Todavía no hay nada aquí. Los dos pueden escribir y los dos ven todo.",
"You": "Tú",
"Add a note…": "Agrega una nota…",
"Post": "Publicar",
"Coaching": "Entrenador",
"Working with a coach — shared goals, drills they set you, and notes back and forth — is part of the paid plan. Everything you have logged is untouched, and any coach already linked to you stays linked.": "Trabajar con un entrenador — objetivos compartidos, ejercicios que te asigna y notas de ida y vuelta — es parte del plan de pago. Todo lo que has registrado sigue intacto, y cualquier entrenador que ya esté vinculado contigo sigue vinculado.",
"Your bowlers": "Tus alumnos",
"Everyone at a glance — what they're working on, how far along, and when you next see them.": "Todos de un vistazo — en qué trabaja cada persona, cuánto ha avanzado y cuándo la vuelves a ver.",
"+ Add a bowler": "+ Agregar alumno",
"no session set": "sin sesión programada",
"Nothing assigned yet.": "Todavía no hay nada asignado.",
"— no result logged yet.": "— aún no hay resultado registrado.",
"Bowls": "Juega en la liga",
"on": "el",
"View": "Vista",
"I'm bowling": "Yo juego",
"I'm coaching": "Yo entreno",
"Showing the bowlers you coach.": "Mostrando a las personas que entrenas.",
"Showing your own game. Switch to see the people you coach.": "Mostrando tu propio juego. Cambia la vista para ver a las personas que entrenas.",
"Requests": "Solicitudes",
"Someone wants to connect.": "Alguien quiere conectarse contigo.",
"wants to be your": "quiere ser tu",
"Accept": "Aceptar",
"Waiting On Them": "Esperando respuesta",
"— asked to be your": "— pidió ser tu",
"Nobody yet. Make a code and read it to them — they enter it on their own phone, and from then on you'll see their sessions, set tasks and track progress here.": "Nadie todavía. Crea un código y léeselo — la otra persona lo escribe en su propio celular y, desde ese momento, aquí verás sus sesiones, le asignarás tareas y seguirás su progreso.",
"Your Bowlers": "Tus alumnos",
"Your Coaches": "Tus entrenadores",
"Nobody connected yet.": "Todavía no hay nadie conectado.",
"Connect with someone": "Conectar con alguien",
"Read this to the bowler you're coaching.": "Léele esto a la persona que entrenas.",
"Read this to your coach.": "Léele esto a tu entrenador.",
"Works once, for the next 7 days.": "Sirve una sola vez, durante los próximos 7 días.",
"They coach me": "Me entrena",
"I coach them": "Yo entreno",
"Create a code": "Crear código",
"They enter it on their own phone and you": "La otra persona lo escribe en su propio celular y",
"re connected — no searching for each other by name.": "quedan conectados — sin tener que buscarse por nombre.",
"Got a code?": "¿Tienes un código?",
"ABCD-2345": "ABCD-2345",
"Coaching code": "Código de vinculación",
"Connect": "Conectar",
"Connected. They": "Conexión establecida. Ya",
"re in the list above.": "aparece en la lista de arriba.",
"Pick something to work on": "Elige en qué trabajar",
"Set this goal": "Fijar este objetivo",
"They'll see it on their Improve tab in bowling terms, and it tracks itself as they bowl.": "Lo verá en su pestaña Mejorar, en términos de boliche, y se actualiza solo mientras juega.",
"Clear": "Borrar",
"Where and when, e.g. 6pm lanes 9-10 at Sunset": "Dónde y cuándo, p. ej. 6 p. m., pistas 9-10 en Sunset",
"Shows on your roster above. Leave it blank if you work session to session.": "Aparece arriba, en tu lista de alumnos. Déjalo en blanco si programas sesión por sesión.",
"Nothing bowled yet. Their scores appear here once they save a session.": "Todavía no hay juegos. Sus puntajes aparecerán aquí cuando guarde una sesión.",
"Average": "Promedio",
"High": "Máx.",
"Nights": "Noches",
"From": "En",
"shots": "tiros",
"Strike": "Strike",
"Spare": "Spare",
"Single Pin": "Un pino",
"Split": "Split",
"Misses:": "Fallos:",
"Recent": "Recientes",
"+ Assign a task": "+ Asignar tarea",
"No tasks yet — set one above and it'll show in their inbox.": "Aún no hay tareas — crea una arriba y aparecerá en su bandeja de entrada.",
"Done & Attempted": "Completadas e intentadas",
"Notes": "Notas",
"Both of you can read and write here.": "Los dos pueden leer y escribir aquí.",
"End coaching relationship": "Terminar la relación de entrenamiento",
"Plastic": "Plástico",
"Just Bowling": "Juego libre",
"Imported": "Importado",
"Ion Max Solid": "Ion Max Solid",
"Ion Max Pearl": "Ion Max Pearl",
"Phaze II Solid": "Phaze II Solid",
"Phaze II Pearl": "Phaze II Pearl",
"Harsh Reality Pearl": "Harsh Reality Pearl",
"Road Warrior Pearl": "Road Warrior Pearl",
"Equinox Pearl": "Equinox Pearl",
"Box": "De fábrica",
"Polish": "Pulida",
"Lane Shine": "Brillo de pista",
"Weak 7": "7 débil",
"Ringing 7": "7 aislado",
"Half Pocket": "Medio bolsillo",
"Trip 4": "Tropiezo del 4",
"Kick 10": "Rebote del 10",
"Acceptable": "Aceptable",
"Fast": "Rápida",
"Slow": "Lenta",
"Too early": "Muy pronto",
"Too late": "Muy tarde",
"Too round": "Muy redonda",
"Too sharp": "Muy angular",
"Roll out": "Se queda sin energía",
"Poor carry": "Poco carry",
"No miss room": "Sin margen de error",
"Lane transition": "Transición de la pista",
"Surface worn": "Superficie gastada",
"Perfect game": "Juego perfecto",
"300. Nothing left to take off it.": "300. Imposible hacerlo mejor.",
"Honor series": "Serie de honor",
"New personal best game": "Nuevo mejor juego personal",
"New personal best series": "Nueva mejor serie personal",
"Won it": "Lo ganaste",
"Top five": "Entre los cinco primeros",
"Cashed": "Cobraste premio",
"Made the cut": "Pasaste el corte",
"Didn't cash": "No cobraste premio",
"strike rate": "la tasa de strikes",
"spare conversion": "la conversión de spares",
"ten pin conversion": "la conversión del pino 10",
"split conversion": "la conversión de splits",
"single-pin conversion": "la conversión de spares de un pino",
"corner-pin conversion": "la conversión de pinos de esquina",
"open frames per game": "los cuadros abiertos por juego",
"average by game": "el promedio por número de juego",
"score spread": "la dispersión de puntajes",
"most common leave": "los pinos que más te quedan",
"Nothing in that link.": "Ese enlace no tiene nada.",
"that night": "esa noche",
"No limit": "Sin límite",
"Official": "Oficial",
"Unconfirmed": "Sin confirmar",
"Community approved": "Aprobada por la comunidad",
"Verified": "Verificada",
"Disputed": "En disputa",
"Manufacturer specifications.": "Especificaciones del fabricante.",
"Reported as incorrect. These specs have been removed.": "Datos reportados como incorrectos. Estas especificaciones se eliminaron.",
"Entered by another bowler and not yet confirmed. Check before trusting it.": "Datos ingresados por otra persona y aún sin confirmar. Revísalos antes de confiar en ellos.",
"Fresh": "Frescas",
"Transition": "Transición",
"Late": "Final",
"Strong - Smooth": "Fuerte - Suave",
"Strong - Sharp": "Fuerte - Angular",
"Benchmark - Smooth": "Benchmark - Suave",
"Benchmark - Sharp": "Benchmark - Angular",
"Weak - Smooth": "Débil - Suave",
"Weak - Sharp": "Débil - Angular",
"Urethane": "Uretano",
"Solid": "Sólida",
"Pearl": "Perlada",
"Hybrid": "Híbrida",
"Symmetric": "Simétrico",
"Asymmetric": "Asimétrico",
"All Balls": "Todas las bolas",
"Not specified": "Sin especificar",
"Compare yourself with a teammate. Log a night with more than one bowler.": "Compárate con alguien de tu equipo. Registra una noche con más de una persona.",
"Your team's best games and series. Needs team-mates with logged scores.": "Los mejores juegos y series de tu equipo. Se necesitan integrantes del equipo con puntajes registrados.",
"Your high game and high series. Fills in once you have a game logged.": "Tu juego más alto y tu serie más alta. Se llena en cuanto registres un juego.",
"Win-loss record. Record match results on a league night.": "Récord de victorias y derrotas. Registra los resultados de los matches en una noche de liga.",
"Points won each week. Record match results on a league night.": "Puntos ganados cada semana. Registra los resultados de los matches en una noche de liga.",
"How handicap changes results. Set a book average for the roster.": "Cómo cambia el hándicap los resultados. Indica un promedio establecido para la lista del equipo.",
"Team averages ranked. Add bowlers to your team.": "Promedios del equipo, en orden. Agrega integrantes a tu equipo.",
"Wins against higher-average teams. Record match results.": "Victorias contra equipos de mayor promedio. Registra los resultados de los matches.",
"Games decided by a handful of pins. Record match results.": "Juegos decididos por unos cuantos pinos. Registra los resultados de los matches.",
"Team totals by night. Needs team-mates with logged scores.": "Totales del equipo por noche. Se necesitan integrantes del equipo con puntajes registrados.",
"Averages by house. Bowl at more than one center.": "Promedios por centro. Juega en más de un centro de boliche.",
"Strike percentage by part of the night, ball against ball. Log which ball you threw on each shot.": "Porcentaje de strikes según el momento de la noche, bola contra bola. Registra qué bola usaste en cada tiro.",
"Your line, drawn on the lane. Log start board and arrows on your shots.": "Tu trayectoria, dibujada en la pista. Registra la tabla de salida y las flechas en tus tiros.",
"Each ball's numbers. Log which ball you threw on each shot.": "Los números de cada bola. Registra qué bola usaste en cada tiro.",
"What makes you switch balls. Record a ball-change reason.": "Lo que te hace cambiar de bola. Registra un motivo de cambio de bola.",
"Frames without an open. Log a full night frame by frame.": "Cuadros que no quedan abiertos. Registra una noche completa cuadro por cuadro.",
"How you bowl early against late in a game. Log shots by frame.": "Cómo juegas al principio de un juego frente al final. Registra tus tiros por cuadro.",
"Pins on the first ball. Log shots frame by frame.": "Pinos en el primer tiro. Registra tus tiros cuadro por cuadro.",
"How often the corner pin stands. Log your leaves.": "Qué tan seguido se queda parado el pino de esquina. Registra los pinos que te quedan.",
"Single-pin conversion. Log your leaves and whether you made them.": "Conversión de spares de un pino. Registra los pinos que te quedan y si hiciste el spare.",
"Splits and conversions. Log your leaves.": "Splits y conversiones. Registra los pinos que te quedan.",
"Who missed the lone 5. Log your leaves.": "Quién falló el 5 solo. Registra los pinos que te quedan.",
"Makeable leaves you missed. Log your leaves.": "Spares convertibles que fallaste. Registra los pinos que te quedan.",
"Longest run of strikes. Log a full night frame by frame.": "Tu racha más larga de strikes. Registra una noche completa cuadro por cuadro.",
"Where your misses go. Record a miss direction on bad shots.": "Hacia dónde van tus fallos. Registra la dirección del fallo en tus malos tiros.",
"How your release holds up. Record release quality on your shots.": "Qué tan constante es tu soltada. Registra la calidad de la soltada en tus tiros.",
"Flush against lucky strikes. Record how each strike carried.": "Strikes al bolsillo frente a strikes de suerte. Registra cómo cayeron los pinos en cada strike.",
"Your average as it moves. Log a few more nights.": "Tu promedio a medida que cambia. Registra algunas noches más.",
"What you would average with every spare. Log your leaves.": "Lo que promediarías haciendo todos los spares. Registra los pinos que te quedan.",
"Where you are heading. Log a few more nights.": "Hacia dónde vas. Registra algunas noches más.",
"How much your scores swing. Log a few more nights.": "Cuánto varían tus puntajes. Registra algunas noches más.",
"The shape of your scores. Log a few more nights.": "La distribución de tus puntajes. Registra algunas noches más.",
"This season against last. Finish a season, then start another.": "Esta temporada contra la anterior. Termina una temporada y luego empieza otra.",
"First, second and third game. Log a few full nights.": "Primer, segundo y tercer juego. Registra algunas noches completas.",
"What you won and paid in. Turn on side games and record a night.": "Lo que ganaste y lo que pagaste. Activa los juegos extra y registra una noche.",
"3-6-9 and jackpot. Turn on side games and record a night.": "3-6-9 y acumulado. Activa los juegos extra y registra una noche.",
"Your season at a glance. Log a night.": "Tu temporada de un vistazo. Registra una noche.",
"First night": "Primera noche",
"Bowled a night with the group.": "Jugaste una noche con el grupo.",
"Regular": "Habitual",
"Five nights in.": "Cinco noches y contando.",
"Fixture": "De la casa",
"Fifteen nights. You live here now.": "Quince noches. Ya vives aquí.",
"Marathon": "Maratón",
"Six games in one night.": "Seis juegos en una noche.",
"Triple figures": "Tres cifras",
"Broke 100.": "Superaste los 100.",
"One fifty": "Ciento cincuenta",
"Broke 150.": "Superaste los 150.",
"Two hundred": "Doscientos",
"Broke 200. That's a real game.": "Superaste los 200. Eso sí es un juego.",
"Five hundred": "Quinientos",
"A 500 series across three games.": "Una serie de 500 en tres juegos.",
"Night winner": "Noche ganada",
"Won a night outright.": "Ganaste una noche sin empate.",
"Repeat champion": "Reincidencia",
"Won three nights.": "Ganaste tres noches.",
"Clean sweep": "Barrida",
"Won every game in a night.": "Ganaste todos los juegos de una noche.",
"Giant killer": "Matagigantes",
"Beat someone averaging 30 more than you.": "Le ganaste a alguien con 30 pinos más de promedio que tú.",
"Comeback": "Remontada",
"Improved 40 pins between games in a night.": "Mejoraste 40 pinos de un juego a otro en una noche.",
"Metronome": "Metrónomo",
"Three games within 10 pins of each other.": "Tres juegos con 10 pinos o menos de diferencia entre sí.",
"New best": "Nuevo récord",
"Beat your own high game.": "Superaste tu juego más alto.",
"Climbing": "En ascenso",
"Your average went up over five nights.": "Tu promedio subió a lo largo de cinco noches.",
"Rough night": "Mala noche",
"Everyone has one. Under 70.": "A todos nos pasa. Menos de 70.",
"Photo finish": "Por un pelo",
"Won or lost a night by a single pin.": "Ganaste o perdiste una noche por un solo pino.",
"Wooden spoon": "En el sótano",
"Finished last. Someone has to.": "Terminaste en último lugar. A alguien le tiene que tocar.",
"Back to back": "Uno tras otro",
"Two 150+ games in a row.": "Dos juegos de 150+ seguidos.",
"Rollercoaster": "Montaña rusa",
"100 pins between your best and worst game in one night.": "100 pinos entre tu mejor y tu peor juego en una noche.",
"Scorekeeper": "A cargo del puntaje",
"Kept score for four or more people.": "Anotaste el puntaje de cuatro personas o más.",
"Pins set by machine, fall freely.": "La máquina coloca los pinos y caen libremente.",
"Pins on strings, pulled back up.": "Pinos atados a cuerdas que se vuelven a subir.",
"Mixed house": "Centro mixto",
"Some lanes string, some free fall.": "Unas pistas con cuerdas, otras de caída libre.",
"7 Pin": "Pino 7",
"10 Pin": "Pino 10",
"Bowled your first league night.": "Jugaste tu primera noche de liga.",
"Old guard": "Vieja guardia",
"Three full seasons in the same league.": "Tres temporadas completas en la misma liga.",
"Sub covered": "Suplencia cubierta",
"Bowled as a sub for another team.": "Jugaste como suplente de otro equipo.",
"New high game": "Nuevo juego más alto",
"New high series": "Nueva serie más alta",
"Beat your own high series.": "Superaste tu propia serie más alta.",
"Book buster": "Rompepromedios",
"A game 40+ pins over your book average.": "Un juego 40+ pinos por encima de tu promedio establecido.",
"In the pocket": "En el bolsillo",
"Three games in a night within 5 pins of your average.": "Tres juegos en una noche a 5 pinos o menos de tu promedio.",
"Heater": "En racha",
"Three straight games above your average.": "Tres juegos seguidos por encima de tu promedio.",
"Cold night, warm finish": "Noche fría, final caliente",
"Opened below average, closed above it.": "Empezaste por debajo del promedio y terminaste por encima.",
"Raised book average": "Promedio establecido superado",
"Your average is 5+ pins above last season's book.": "Tu promedio está 5+ pinos por encima de tu promedio establecido de la temporada pasada.",
"Clean": "Noche limpia",
"No open frames all night.": "Ningún cuadro abierto en toda la noche.",
"Sharp shooter": "Puntería fina",
"Converted three or more splits in a night.": "Convertiste tres splits o más en una noche.",
"Carried it": "Cargaste al equipo",
"Your score was the difference in a match your team won.": "Tu puntaje marcó la diferencia en un match que ganó tu equipo.",
"Held the line": "Aguantaste firme",
"Bowled above your average in a match your team lost.": "Jugaste por encima de tu promedio en un match que perdió tu equipo.",
"Team high game": "Juego más alto del equipo",
"Set your team's high game for the night.": "Hiciste el juego más alto de tu equipo en la noche.",
"Team high series": "Serie más alta del equipo",
"Set your team's high series for the night.": "Hiciste la serie más alta de tu equipo en la noche.",
"Executioner": "Verdugo",
"Helped hang a teammate 30 times.": "Ayudaste 30 veces a dejar colgado a un integrante del equipo.",
"Won a side game.": "Ganaste un juego extra.",
"Money bags": "Cartera llena",
"$100 won in side games, all-time.": "$100 ganados en juegos extra, en total.",
"Locked in": "Sellado",
"Your book average was confirmed at season end.": "Tu promedio establecido se confirmó al final de la temporada.",
"Twelve strikes. The one you'll be telling people about.": "Doce strikes. El juego que le vas a contar a todo el mundo.",
"800 series": "Serie de 800",
"An 800 series. USBC honor score.": "Una serie de 800. Puntaje de honor USBC.",
"First tournament": "Primer torneo",
"Logged your first tournament.": "Registraste tu primer torneo.",
"Survived to the next round.": "Pasaste a la siguiente ronda.",
"Finished in the top five.": "Terminaste entre los cinco primeros.",
"Won the whole thing": "Ganaste todo",
"First place.": "Primer lugar.",
"Ramping up": "En ascenso",
"Three or more straight games, each higher than the last.": "Tres juegos seguidos o más, cada uno más alto que el anterior.",
"Strong finish": "Cierre fuerte",
"Last game 50+ pins above the average of the rest.": "Último juego 50+ pinos por encima del promedio de los demás.",
"Cashed a side pot": "Cobraste un bote",
"Won a side pot at an event.": "Ganaste un bote en un evento.",
"Squeaked in": "Por un pelo",
"Made the cut by 10 pins or fewer.": "Pasaste el corte por 10 pinos o menos.",
"First drill": "Primer ejercicio",
"Logged your first drill.": "Registraste tu primer ejercicio.",
"Repeat customer": "Cliente frecuente",
"Same target, five separate sessions.": "El mismo blanco, cinco sesiones distintas.",
"Trending up": "En alza",
"Conversion rate rose across five weeks.": "El porcentaje de conversión subió a lo largo de cinco semanas.",
"Century": "Centenario",
"100 attempts at one target.": "100 intentos al mismo blanco.",
"Graduated": "Graduación",
"80%+ on a target, over at least 20 attempts.": "80%+ en un blanco, en al menos 20 intentos.",
"Drilled two different targets in one session.": "Practicaste dos blancos diferentes en una misma sesión.",
"Burned the midnight oil": "Hasta la madrugada",
"A practice session of 50+ deliveries.": "Una sesión de práctica de 50+ tiros.",
"That file is empty.": "Ese archivo está vacío.",
"game 1": "juego 1",
"game 2": "juego 2",
"game 3": "juego 3",
"no scores on that row": "no hay puntajes en esa fila",
"a game is blank between two scores": "hay un juego vacío entre dos puntajes",
"Nothing in that file could be imported.": "No se pudo importar nada de ese archivo.",
"4 Pin": "Pino 4",
"6 Pin": "Pino 6",
"2 Pin": "Pino 2",
"3 Pin": "Pino 3",
"3-6-10 (bucket-ish)": "3-6-10 (casi un “bucket”)",
"2-4-5 (bucket)": "2-4-5 (“bucket”)",
"Strike Ball (pocket hits)": "Bola de strike (golpes al bolsillo)",
"Pocket": "Bolsillo",
"Custom": "Personalizado",
"Failing row contains (*)": "",
"No errors recorded.": "",
"Couldn't connect. Check your signal and try again.": "No se pudo conectar. Revisa tu señal e intenta de nuevo.",
"Your sign-in has expired. Sign out and back in, then try again.": "Tu sesión expiró. Cierra sesión, vuelve a iniciarla e intenta de nuevo.",
"Something went wrong. Try again in a few minutes.": "Algo salió mal. Intenta de nuevo en unos minutos.",
"Why do I keep leaving the 10?": "¿Por qué siempre me queda el 10?",
"Which ball carries best for me?": "¿Con qué bola tengo mejor carry?",
"Do I fade late in a set?": "¿Rindo menos al final de una serie?",
"Back tomorrow": "Vuelve mañana",
"Games logged": "",
"Strike percentage": "",
"Spare percentage": "",
"Single-pin spare percentage": "",
"Split conversion percentage": "",
"Open frames per game": "Cuadros abiertos por juego",
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
"Most common leave": "Pinos que más te quedan",
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
"Your running average across all games in the current view.": "Tu promedio acumulado de todos los juegos de la vista actual.",
"Your best single game.": "Tu mejor juego.",
"Your best series total.": "El total de tu mejor serie.",
"Share of first balls that strike.": "Porcentaje de primeros tiros que son strike.",
"spare attempts": "intentos de spare",
"Non-split spare conversion.": "Conversión de spares, sin contar splits.",
"Single Pin Spare %": "% de spares de un pino",
"single-pin attempts": "intentos de un pino",
"Conversion on leaves of exactly one pin.": "Conversión cuando queda exactamente un pino.",
"10 Pin Spare %": "% de spares del pino 10",
"10 pin attempts": "intentos al pino 10",
"Conversion on a lone corner pin (including weak and ringing ones).": "Conversión cuando queda solo un pino de esquina (incluidos los débiles y los aislados).",
"Frames closed with a strike or a spare.": "Cuadros cerrados con strike o spare.",
"7 pin": "pino 7",
"single-pin spares": "spares de un pino",
"keep clean": "mantener limpios",
"to collect, and they're not all about bowling well:": "insignias por coleccionar, y no todas tienen que ver con jugar bien:",
"Start a session": "Empezar una sesión",
"new night": "nueva noche",
"league night": "noche de liga",
"On the Bowl tab, pick where you're bowling — practice, league, tournament or just bowling. For league, choose which league and the date. The app remembers your usual night, so on a regular Tuesday it sets itself up.": "En la pestaña Jugar, elige dónde vas a jugar — práctica, liga, torneo o juego libre. Para liga, elige cuál y la fecha. La app recuerda tu noche habitual, así que un martes normal se configura sola.",
"Frame tracking vs game tracking": "Registro por cuadro o por juego",
"Frame tracking records every ball — pins left, ball used, release. That's what powers spare stats, the scoresheet and ball comparisons. Scores only takes three numbers a night. You can switch any time, and start a night one way and finish the other: unlock the score boxes to type totals even mid-game.": "El registro por cuadro guarda cada tiro — pinos que quedan, bola usada, soltada. Eso es lo que alimenta las estadísticas de spares, la hoja de puntaje y las comparaciones de bolas. Solo puntajes pide tres números por noche. Puedes cambiar cuando quieras, e incluso empezar una noche de una forma y terminarla de la otra: desbloquea las casillas de puntaje para escribir los totales, incluso a mitad de un juego.",
"The ten-frame scoresheet": "La hoja de puntaje de diez cuadros",
"edit frame": "editar cuadro",
"running score": "puntaje acumulado",
"On frame tracking, the ten frames sit between the frame picker and the result buttons. It fills in as you bowl. Tap any frame to edit it. Tapping an empty frame while editing cancels the edit; tapping the next frame when your shot is complete saves it.": "En el registro por cuadro, los diez cuadros están entre el selector de cuadro y los botones de resultado. La hoja se llena a medida que juegas. Toca cualquier cuadro para editarlo. Si tocas un cuadro vacío mientras editas, se cancela la edición; si tocas el cuadro siguiente cuando tu tiro está completo, se guarda.",
"Delete a shot": "Eliminar un tiro",
"wrong frame": "cuadro equivocado",
"Tap the frame on the scoresheet to open it, then either press Delete this shot, or deselect the result — clearing what happened deletes the frame. Both ask you to confirm, because it can't be undone.": "Toca el cuadro en la hoja de puntaje para abrirlo y luego presiona Eliminar este tiro, o quita la selección del resultado — borrar lo que pasó elimina el cuadro. En ambos casos se te pide confirmar, porque no se puede deshacer.",
"Prebowl for a future week": "Adelantar juegos de una semana futura",
"miss next week": "faltar la próxima semana",
"Bowling next week's league games early? Turn on Prebowling in Tonight's Session. The games are filed under the date they count for, not the day you threw them — so you can prebowl and bowl tonight's league on the same night without one overwriting the other.": "¿Vas a jugar antes los juegos de liga de la próxima semana? Activa Adelantar juegos en Noche de hoy. Los juegos se guardan en la fecha para la que cuentan, no en el día en que los jugaste — así puedes adelantar juegos y jugar la liga de esta noche la misma noche sin que unos reemplacen a los otros.",
"Side games and buy-ins": "Juegos extra y entradas",
"side pot": "bote",
"high game": "juego más alto",
"buy in": "entrada",
"money games": "juegos por dinero",
"Buy-ins are saved per league — enter them once and they apply every week. Each night, tap the pots you're actually in; sitting one out costs you nothing. Hide pots your house doesn't run in Settings.": "Las entradas se guardan por liga — ingrésalas una vez y se aplican cada semana. Cada noche, toca los botes en los que de verdad participas; quedarte fuera de uno no te cuesta nada. Oculta en Configuración los botes que tu centro de boliche no maneja.",
"Import a scorecard photo": "Importar una foto de la hoja de puntaje",
"Press Import in the header. Say whether it's practice, league or a tournament, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving.": "Toca Importar en el encabezado. Indica si es práctica, liga o torneo, elige el equipo y la fecha, y luego agrega fotos del monitor de puntaje. La app lee los juegos y los cuadros, y tú asignas cada columna a la persona que corresponde antes de guardar.",
"Send teammates their scores": "Enviar a tus compañeros de equipo sus puntajes",
"share scores": "compartir puntajes",
"frame data": "datos por cuadro",
"Any column you map to a teammate is sent to them to confirm. They get the frame-by-frame data too, not just totals — once they accept, it lands in their shot history marked as imported.": "Cualquier columna que asignes a un compañero de equipo se le envía para que la confirme. También recibe los datos cuadro por cuadro, no solo los totales — cuando acepta, llegan a su historial de tiros marcados como importados.",
"Compare yourself to someone": "Compararte con alguien",
"head to head": "mano a mano",
"team average": "promedio del equipo",
"On the Stats tab, use Compare To. You can compare against a bowler on your device, a friend, or your team's average. Teammates are added as friends automatically, so they're there without sending a request.": "En la pestaña Stats, usa Comparar con. Puedes compararte con una persona guardada en tu dispositivo, un amigo o el promedio de tu equipo. Tus compañeros de equipo se agregan como amigos automáticamente, así que ya están ahí sin enviar una solicitud.",
"Trends over time": "Tendencias a lo largo del tiempo",
"over time": "a lo largo del tiempo",
"per ball": "por bola",
"Switch to Trends on the Stats tab to see a metric plotted over time. Filter by ball to see how one piece of equipment is performing — that works on game scores too, if you record which ball bowled which game.": "Cambia a Avance en la pestaña Stats para ver una métrica graficada a lo largo del tiempo. Filtra por bola para ver cómo rinde una bola en particular — también funciona con los puntajes de juegos, si registras qué bola usaste en cada juego.",
"Set a goal": "Fijar un objetivo",
"On the Improve tab, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "En la pestaña Mejorar, toca Agregar un objetivo y elige en qué trabajar — promedio, porcentaje de strikes, conversión de spares, etc. El progreso se actualiza mientras juegas.",
"Practice drills": "Ejercicios de práctica",
"spare shooting": "práctica de spares",
"Start a drill from the Improve tab. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "Empieza un ejercicio desde la pestaña Mejorar. Elige un blanco — un spare específico o una combinación de pinos — y la app cuenta aciertos y fallos en esa sesión.",
"A coach sees every bowler they work with on one roster: what each is working on, how far along, and when the next session is. Tasks are set per bowler, and the bowler sees them on their Improve tab.": "Quien entrena ve en una sola lista a todas las personas con las que trabaja: en qué trabaja cada una, cuánto ha avanzado y cuándo es la próxima sesión. Las tareas se asignan por persona, y cada quien las ve en su pestaña Mejorar.",
"add league": "agregar liga",
"On the Setup tab, under League, add a league with its name, center and season dates. Season dates let the app prompt you to update your book average when the season ends.": "En la pestaña Preparar, en Liga, agrega una liga con su nombre, centro de boliche y fechas de la temporada. Con las fechas de la temporada, la app puede recordarte que actualices tu promedio establecido cuando termine la temporada.",
"Add a team and its roster": "Agregar un equipo y sus integrantes",
"not signed up": "no registrado",
"hasn't joined": "no se ha unido",
"email required": "correo obligatorio",
"bowling order": "orden de tiro",
"add a teammate": "agregar un compañero",
"Teams live under their league on the Setup tab — add a league under League, then add your team under Team. Open the team to set the bowling order and add each teammate by name and email. The email is required: it's what connects them to their spot when they sign up. Teammates who haven't joined yet still work — you can log their scores straight away, and everything you've recorded is waiting for them when they accept the invite.": "Los equipos están dentro de su liga en la pestaña Preparar — agrega una liga en Liga y luego tu equipo en Equipo. Abre el equipo para definir el orden de tiro y agregar a cada compañero con su nombre y correo. El correo es obligatorio: es lo que vincula a cada persona con su lugar cuando se registra. Aunque tus compañeros todavía no se hayan unido, todo funciona — puedes registrar sus puntajes de inmediato, y todo lo que hayas registrado estará ahí cuando acepten la invitación.",
"Your ball arsenal": "Tu arsenal de bolas",
"Add your balls on the Setup tab, under Balls, with layout and surface. Balls you log shots with feed the per-ball stats and the trend filters. Bags, the next tab over, let you group what you actually carry.": "Agrega tus bolas en la pestaña Preparar, en Bolas, con su layout y superficie. Las bolas con las que registras tiros alimentan las estadísticas por bola y los filtros de tendencias. Maletas, la pestaña de al lado, te permite agrupar lo que de verdad llevas.",
"add friend": "agregar amigo",
"Search for someone by name and send a request. Teammates are added automatically. Friends can compare stats with each other. There's also a QR code here for handing someone the app link.": "Busca a alguien por su nombre y envía una solicitud. Tus compañeros de equipo se agregan automáticamente. Los amigos pueden comparar sus estadísticas entre sí. Aquí también hay un código QR para pasarle a alguien el enlace de la app.",
"Your name and profile": "Tu nombre y perfil",
"two handed": "a dos manos",
"book average": "promedio establecido",
"Set your display name — that's what teammates see. Also here: handedness, book average, home centers, and scorecard names, which are the other spellings of your name that appear on a printed scorecard so imports match you correctly.": "Define tu nombre visible — es lo que ven tus compañeros de equipo. También aquí: mano dominante, promedio establecido, centros habituales y nombres en la hoja de puntaje, que son las otras formas en que tu nombre aparece escrito en una hoja de puntaje impresa, para que las importaciones te reconozcan correctamente.",
"Your history": "Tu historial",
"Every night you've bowled and every shot you've logged. Filter by team or result. You only see your own — teammates keep theirs.": "Cada noche que has jugado y cada tiro que has registrado. Filtra por equipo o por resultado. Solo ves lo tuyo — tus compañeros de equipo conservan lo suyo.",
"Honor scores, personal bests and badges": "Puntajes de honor, récords personales e insignias",
"perfect game": "juego perfecto",
"honor score": "puntaje de honor",
"personal best": "récord personal",
"high series": "serie más alta",
"A 300 game or an 800 series is called out automatically. So is beating your own best game or series — set your all-time bests in your profile so it has something to beat from day one. At a tournament you can record how you finished, and a win gets its own badge. All of them can be shared.": "Un juego de 300 o una serie de 800 se destaca automáticamente. Lo mismo cuando superas tu mejor juego o tu mejor serie — registra tus récords de siempre en tu perfil para que haya algo que superar desde el primer día. En un torneo puedes registrar cómo terminaste, y una victoria tiene su propia insignia. Todo se puede compartir.",
"Adding a teammate without their email": "Agregar a un compañero sin su correo",
"signup code": "código de registro",
"team code": "código del equipo",
"invite code": "código de invitación",
"no email": "sin correo",
"don't have their email": "no tengo su correo",
"text them": "mandarle un mensaje",
"When you add a teammate, tick \"I don't have their email\" and you'll get a short code to text them. They enter it when they sign up and land straight on that roster spot, with everything you've already logged under their name.": "Cuando agregues a un compañero, marca “No tengo su correo” y obtendrás un código corto para mandárselo por mensaje. Esa persona lo ingresa al registrarse y llega directo a su lugar en la lista del equipo, con todo lo que ya registraste a su nombre.",
"Split conversion by type": "Conversión de splits por tipo",
"baby split": "baby split",
"big four": "big four",
"greek church": "greek church",
"which splits": "cuáles splits",
"Splits are broken out by type, not lumped into one number — the 4-7-10 and the 3-10 are different problems. The Stats tab shows how often you leave each one and how often you convert it, with the well-known ones named.": "Los splits se desglosan por tipo, no se agrupan en un solo número — el 4-7-10 y el 3-10 son problemas distintos. La pestaña Stats muestra cuántas veces te queda cada uno y cuántas veces lo conviertes, con nombre para los más conocidos.",
"Changing how the app looks": "Cambiar la apariencia de la app",
"App appearance in Settings. Glow is the default — rock'n'bowl green on warm black — and there are several others if you'd rather something calmer.": "Apariencia de la app en Configuración. Cósmico es el tema predeterminado — verde de boliche cósmico sobre negro cálido — y hay varios más si prefieres algo más tranquilo.",
"Recording how a tournament finished": "Registrar cómo terminó un torneo",
"made the cut": "pasé el corte",
"runner up": "segundo lugar",
"how did i do": "cómo me fue",
"At the end of a tournament, say how it finished — won it, runner-up, top five, cashed, or made the cut. The app can't work this out from your scores, since it doesn't know what anyone else shot. A win becomes a badge you can share.": "Al final de un torneo, indica cómo terminó — lo ganaste, segundo lugar, entre los cinco primeros, cobraste premio o pasaste el corte. La app no puede deducirlo de tus puntajes, porque no sabe cuánto tiraron los demás. Una victoria se convierte en una insignia que puedes compartir.",
"who won": "quién ganó",
"just bowling": "juego libre",
"who's best": "quién es el mejor",
"Everyone you've added to an Open bowling scoresheet turns up in the Standings, ordered by average, with how many games they've bowled, their best single game, and the badges they've earned. It builds up over time, so the more nights you log the more there is to argue about.": "Todas las personas que agregaste a una hoja de puntaje de Juego libre aparecen en Posiciones, ordenadas por promedio, con cuántos juegos han jugado, su mejor juego y las insignias que han ganado. Se va llenando con el tiempo: entre más noches registres, más hay para discutir.",
"Where did everything go?": "¿Dónde quedó todo?",
"where is": "dónde está",
"no stats": "sin estadísticas",
"no history": "sin historial",
"tabs missing": "faltan pestañas",
"wrong mode": "modo equivocado",
"went back": "volver atrás",
"If you picked Open bowling, the app hides everything that mode doesn't use — History, Stats, Improve and Gear. Nothing is deleted; it's all still there. Go to the Bowl tab, find the card at the top showing what you're bowling, tap Change, and pick Practice, League or Tournament. Everything comes straight back.": "Si elegiste Juego libre, la app oculta todo lo que ese modo no usa — Historial, Stats, Mejorar y Equipamiento. No se borra nada; todo sigue ahí. Ve a la pestaña Jugar, busca la tarjeta de arriba que muestra lo que estás jugando, toca Cambiar y elige Práctica, Liga o Torneo. Todo vuelve de inmediato.",
"Entering scores for the group": "Anotar los puntajes del grupo",
"add someone": "agregar a alguien",
"who's bowling": "quién juega",
"Names down the side, games across the top. Tap a cell and type the final score for that game — totals add themselves. Add whoever's on the lane with the box underneath and they become a row; they don't need the app or an account. Bowl more than a few games and the scores slide across while the names stay put.": "Los nombres van a un lado y los juegos arriba. Toca una celda y escribe el puntaje final de ese juego — los totales se suman solos. Agrega a quien esté en la pista con el campo de abajo y se convierte en una fila; no necesita la app ni una cuenta. Si juegan más de unos cuantos juegos, los puntajes se desplazan de lado mientras los nombres se quedan fijos.",
"The badges you can earn": "Las insignias que puedes ganar",
"how do i get": "cómo consigo",
"Tips: rolling a better ball": "Consejos: tirar mejor la bola",
"how to bowl": "cómo jugar boliche",
"help me bowl": "ayúdame a jugar",
"new to bowling": "empezar en el boliche",
"Pick a ball you can hold comfortably — too heavy and you'll throw it with your arm instead of letting it swing. Aim at the arrows on the lane, not the pins: they're much closer, so they're far easier to hit consistently. Let your arm swing like a pendulum rather than pushing, and try to finish with your hand up where you were aiming. Most beginners improve more from rolling the same ball the same way twice than from anything else.": "Elige una bola que puedas sostener cómodamente — si es demasiado pesada, la vas a lanzar con el brazo en vez de dejar que se balancee. Apunta a las flechas de la pista, no a los pinos: están mucho más cerca, así que es mucho más fácil atinarles con constancia. Deja que tu brazo se balancee como un péndulo en lugar de empujar, e intenta terminar con la mano arriba, hacia donde apuntabas. La mayoría de quienes empiezan mejoran más tirando la misma bola de la misma manera dos veces seguidas que con cualquier otra cosa.",
"Tips: picking up spares": "Consejos: cómo hacer spares",
"corner pin": "pino de esquina",
"second ball": "segundo tiro",
"pick up": "tumbar los pinos que quedan",
"Spares are where casual scores are won. If pins are left on the right, move your feet LEFT and aim across the lane at them; if they're on the left, move right. It feels backwards and it works. For a single pin, aim at the arrow closest to it rather than staring at the pin. Converting even half your spares will do more for your score than any strike will.": "En el juego libre, los puntajes se ganan con los spares. Si quedan pinos a la derecha, mueve los pies a la IZQUIERDA y apunta hacia ellos cruzando la pista; si están a la izquierda, muévete a la derecha. Se siente al revés, pero funciona. Para un solo pino, apunta a la flecha más cercana a él en vez de quedarte mirando el pino. Convertir aunque sea la mitad de tus spares hará más por tu puntaje que cualquier strike.",
"Tips: how scoring actually works": "Consejos: cómo funciona de verdad el puntaje",
"how does scoring work": "cómo se calcula el puntaje",
"what is a turkey": "qué es un turkey",
"Ten frames, two balls each. All ten pins on the first ball is a strike, and you get the next two balls added on top. Knocking them all down across both balls is a spare, and you get the next one ball added. That's why strikes are worth chasing — a good game is mostly about not leaving gaps rather than striking every frame. Three strikes in a row is a turkey. A perfect game is 300.": "Diez cuadros, dos tiros cada uno. Derribar los diez pinos en el primer tiro es un strike, y se le suman los dos tiros siguientes. Derribarlos todos entre los dos tiros es un spare, y se le suma el tiro siguiente. Por eso vale la pena ir por los strikes — aunque un buen juego se trata más de no dejar cuadros abiertos que de hacer strike en cada cuadro. Tres strikes seguidos son un turkey. Un juego perfecto es de 300.",
"Tips: making the night better": "Consejos: para que la noche sea mejor",
"night out": "salida en grupo",
"what to do": "qué hacer",
"first time": "primera vez",
"Bowl in the same order each game so it stays easy to follow. Ask for bumpers if anyone's small — nobody minds and it keeps everyone in it. Lighter balls are usually on the racks nearest the lanes. If someone's having a rough game, remember there's a badge for it. Rented shoes are meant to slide, so don't fight it on the approach.": "Tiren en el mismo orden en cada juego para que sea fácil de seguir. Pide los bumpers (barreras) si hay niños pequeños — a nadie le molesta y así todos siguen metidos en el juego. Las bolas más ligeras suelen estar en los estantes más cercanos a las pistas. Si a alguien le está yendo mal en un juego, recuerda que hay una insignia para eso. Los zapatos de renta están hechos para deslizarse, así que no luches contra eso en la aproximación.",
"Syncing and offline use": "Sincronización y uso sin conexión",
"Everything is saved on your phone first and uploaded when there's a connection, so you can log a whole night on bad alley wifi. If something can't upload, the app says so and keeps retrying — nothing is lost.": "Todo se guarda primero en tu celular y se sube cuando hay conexión, así que puedes registrar una noche completa aunque el wifi del boliche sea malo. Si algo no se puede subir, la app te avisa y sigue intentando — no se pierde nada.",
"Appearance and settings": "Apariencia y configuración",
"Change the theme in Settings, along with which stats cards you see, which side games are shown, and whether frame tracking fields like ball speed and rev rate appear.": "Cambia el tema en Configuración, además de qué tarjetas de estadísticas ves, qué juegos extra se muestran y si aparecen campos de seguimiento por cuadro como la velocidad de la bola y las revoluciones.",
"Importing": "Importación",
"Improving": "Mejorar",
"Leagues, teams and gear": "Ligas, equipos y equipamiento",
"Your profile": "Tu perfil",
"Good to know": "Es bueno saberlo",
"no record": "no se encontró el registro",
"own scores": "tus propios puntajes",
"the bowler has already responded": "la persona ya respondió",
"only a teammate with verified scores of their own can correct this": "solo alguien del equipo con sus propios puntajes verificados puede corregir esto",
"wait until the next session has finished": "espera a que termine la siguiente noche",
"bowler did not respond before the next session ended": "la persona no respondió antes de que terminara la siguiente noche",
"no corrected scores supplied": "no se proporcionaron puntajes corregidos",
"Confirmed by the bowler.": "Confirmado por quien jugó.",
"Corrected by the bowler.": "Corregido por quien jugó.",
"Rejected — these scores need to be entered again.": "Rechazado — hay que volver a ingresar estos puntajes.",
"Already logged by the bowler — nothing to confirm.": "Ya lo registró quien jugó — no hay nada que confirmar.",
"From an imported scorecard, not yet confirmed.": "De una hoja de puntaje importada, aún sin confirmar.",
"Scores to check": "Puntajes por revisar",
"A teammate imported these from a scorecard photo. They already count — confirming marks them checked.": "Alguien de tu equipo los importó desde una foto de la hoja de puntaje. Ya cuentan — confirmarlos los marca como revisados.",
"A night needs re-entering": "Una noche por registrar de nuevo",
"You said these weren't yours, so they've stopped counting.": "Dijiste que no eran tuyos, así que dejaron de contar.",
"Nobody confirmed these and a session has since finished. You can correct them.": "Nadie confirmó estos puntajes y desde entonces ya terminó una sesión. Puedes corregirlos.",
"Accept or decline on the Coach tab.": "Acepta o rechaza en la pestaña Entrenador.",
"Work your coach has set for you.": "Trabajo que tu entrenador te asignó.",
"They've marked work done or reported how far they got.": "Marcaron tareas como hechas o reportaron cuánto avanzaron.",
"Accept or decline on the Social tab.": "Acepta o rechaza en la pestaña Amigos.",
"Joining lets teammates import your scores from a scorecard photo.": "Al unirte, tu equipo podrá importar tus puntajes desde una foto de la hoja de puntaje.",
"Anyone on the team can approve it on the Team tab.": "Cualquier integrante del equipo puede aprobarlo en la pestaña Equipo.",
"Book average needs updating": "Promedio establecido por actualizar",
"A league season has finished.": "Terminó una temporada de liga.",
"Other bowlers voted them down. Check and resubmit if you think they were right.": "Otras personas votaron en contra. Revísalas y vuelve a enviarlas si crees que eran correctas.",
"Strike rate": "Porcentaje de strikes",
"Spare conversion": "Conversión de spares",
"Corner pin conversion": "Conversión de pinos de esquina",
"Trend over time": "Tendencia en el tiempo",
"Game-by-game fade": "Caída juego a juego",
"Consistency": "Consistencia",
"Form vs book average": "Forma frente al promedio establecido",
"Single-pin spares": "Spares de un pino",
"Single corner pin spares": "Spares de un pino de esquina",
"Average by game (1st, 2nd, 3rd)": "Promedio por juego (1.º, 2.º, 3.º)",
"Score spread": "Dispersión de puntajes",
"Ball comparison": "Comparación de bolas",
"Center-by-center averages": "Promedios por centro de boliche",
"Drill results": "Resultados de ejercicios",
"Oil pattern averages": "Promedios por patrón de aceite",
"Overall": "En general",
"How it finished": "Cómo terminó",
"Broke 50": "Más de 50",
"Broke 75": "Más de 75",
"First 100 game": "Primer juego de 100",
"Broke 125": "Más de 125",
"First 150 game": "Primer juego de 150",
"Broke 175": "Más de 175",
"First 200 game": "Primer juego de 200",
"Broke 225": "Más de 225",
"First 250 game": "Primer juego de 250",
"Broke 275": "Más de 275",
"First 200 series": "Primera serie de 200",
"First 300 series": "Primera serie de 300",
"First 400 series": "Primera serie de 400",
"First 500 series": "Primera serie de 500",
"First 600 series": "Primera serie de 600",
"First 800 series": "Primera serie de 800",
"First night logged": "Primera noche registrada",
"Five nights in": "Cinco noches jugadas",
"Ten nights in": "Diez noches jugadas",
"Twenty-five nights": "Veinticinco noches",
"Fifty nights": "Cincuenta noches",
"A hundred nights": "Cien noches",
"First strike": "Primer strike",
"First spare": "Primer spare",
"Two strikes in a row": "Dos strikes seguidos",
"First turkey": "Primer turkey",
"Four in a row": "Cuatro strikes seguidos",
"Five in a row": "Cinco strikes seguidos",
"Converted a split": "Split convertido",
"Converted the big four": "Big four convertido",
"First cash": "Primer cobro en premios",
"House": "De casa",
"a tournament": "un torneo",
"just for fun": "por diversión",
"Not enough history yet — you'll be asked once a day until a pattern shows up.": "Aún no hay suficiente historial — te preguntaremos una vez al día hasta que se note una tendencia.",
"Dual Angle": "Dual Angle",
"VLS (Pin Buffer)": "VLS (Pin Buffer)",
"2LS (Two-Handed)": "2LS (a dos manos)",
"Drilling Angle": "Ángulo de perforación",
"VAL Angle": "Ángulo VAL",
"Pin Buffer": "Pin Buffer",
"Not a number": "No es un número",
"You're the last member, so the team will be left empty.": "No queda nadie más en el equipo, así que quedará vacío.",
"Your past scores and averages stay.": "Tus puntajes y promedios anteriores se conservan.",
"Standard scoring.": "Puntaje estándar.",
"Nine on the first ball counts as a strike.": "Nueve pinos en el primer tiro cuentan como strike.",
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
"Won every match.": "Ganaste todos los matches.",
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
"Sport": "Deportivo",
"Frame tracking": "Registro por cuadro",
"Game tracking": "Registro por juego",
"Every frame — strikes, spare conversions, open frames and how each ball carried.": "Cada cuadro — strikes, spares convertidos, cuadros abiertos y cuánto derribó cada tiro.",
"The final score for each game. Fast, and still tracks averages and trends.": "El puntaje final de cada juego. Es rápido y aun así registra promedios y tendencias.",
"Season Record": "Récord de la temporada",
"Hung": "Dejado colgado",
"Shots / Strike % / Spare %": "Tiros / % de strikes / % de spares",
"My Records": "Mis récords",
"Clean Frames": "Cuadros limpios",
"Ten Pin Leaves": "Pino 10 que queda",
"Single Pin Spares": "Spares de un pino",
"Hand Up": "Mano arriba",
"Longest Strike Streak": "Racha más larga de strikes",
"Strike % Through the Night": "% de strikes a lo largo de la noche",
"Ball vs Ball": "Bola vs. bola",
"A practice session": "Una sesión de práctica",
"A league night": "Una noche de liga",
"A tournament": "Un torneo",
"There's no wrong answer. Each one just changes which screens you see, and you can switch at any time from the Bowl tab or Settings.": "No hay respuesta incorrecta. Cada opción solo cambia las pantallas que ves, y puedes cambiarla cuando quieras desde la pestaña Jugar o desde Configuración.",
"For working on your game. Drills, frame tracking and every detail field are available, and practice scores stay out of your league averages.": "Para trabajar en tu juego. Tienes ejercicios, registro por cuadro y todos los campos de detalle, y los puntajes de práctica no cuentan para tus promedios de liga.",
"For your weekly team night. Your team roster and standings are available, along with side games.": "Para tu noche semanal con el equipo. Tienes la lista del equipo y la tabla de posiciones, además de los juegos extra.",
"For higher-stakes competition. Blocks, squads, side pots, brackets, match play and the cut line are all available.": "Para competencias con más en juego. Tienes bloques, turnos, botes, brackets, match play y la línea de corte.",
"For a fun activity. You get the scoresheet, standings and badges — all other views are hidden, not deleted, to keep it quick and simple.": "Para una actividad divertida. Tienes la hoja de puntaje, la tabla de posiciones y las insignias — las demás vistas se ocultan, no se borran, para que todo sea rápido y sencillo.",
"no sessions logged": "no hay noches registradas",
"PRODID:-//Bowling Tracker//EN": "",
"Retired": "Retirada",
"This fill ball count may not be reliably read from the scorecard image -- please verify the pin count manually before saving.": "Es posible que el conteo del tiro extra no se haya leído bien en la imagen de la hoja de puntaje -- verifica manualmente la cantidad de pinos antes de guardar.",
"so a game may be missing from the photo": "así que puede faltar un juego en la foto",
"so one of the game scores was probably misread": "así que probablemente se leyó mal el puntaje de uno de los juegos",
"so a frame was probably misread": "así que probablemente se leyó mal un cuadro",
"so the total was probably misread": "así que probablemente se leyó mal el total",
"Keeping the book for the team? Add your teammates and log their shots too.": "¿Llevas la hoja de puntaje del equipo? Agrega a los integrantes de tu equipo y registra también sus tiros.",
"Practising with someone? Add them to compare sessions afterwards. Their scores stay on this device.": "¿Practicas con alguien? Agrega a esa persona para comparar las sesiones después. Sus puntajes se quedan en este dispositivo.",
"Bowling with others? Add them to keep everyone's score. Their scores stay on this device.": "¿Juegas con otras personas? Agrégalas para llevar el puntaje de todos. Sus puntajes se quedan en este dispositivo.",
"on target": "en el blanco",
"board must be a number": "la tabla debe ser un número",
"Winner": "Primer lugar",
"Best Single Game": "Mejor juego",
"— that's a real game.": "— eso sí es un juegazo.",
"Biggest Comeback": "Mayor remontada",
"Ran Out Of Steam": "Se quedó sin gasolina",
"Most Consistent": "Más constante",
"Pick the date these games count for.": "Elige la fecha para la que cuentan estos juegos.",
"That's today — prebowled games count for a future date.": "Es hoy — los juegos adelantados cuentan para una fecha futura.",
"That date has passed. Prebowled games count for an upcoming session.": "Esa fecha ya pasó. Los juegos adelantados cuentan para una próxima noche.",
"You already have a session on that date. Saving would overwrite it.": "Ya tienes una noche en esa fecha. Si guardas, se reemplazará.",
"Bowled": "Jugó",
"Practice session": "Sesión de práctica",
"Just for fun": "Solo por diversión",
"system-ui, sans-serif": "",
"Clean card — no open frames": "Hoja limpia — sin cuadros abiertos",
"No nights bowled yet.": "Todavía no hay noches jugadas.",
"WON IT": "PRIMER LUGAR",
"TOP FIVE": "TOP 5",
"MADE THE CUT": "CORTE SUPERADO",
"Bracket": "Bracket",
"Eliminator": "Eliminatoria",
"Side Pot": "Bote",
"Optional": "Opcional",
"Big four": "Big four",
"Greek church": "Greek church",
"Baby split": "Baby split",
"Bucket split": "Split “bucket”",
"Casual": "Juego libre",
"stat unlocks": "estadística se desbloquea",
"stats unlock": "estadísticas se desbloquean",
"use frame tracking": "usas el registro por cuadro",
"note which ball bowled each game": "anotas qué bola usaste en cada juego",
"Rates": "Porcentajes",
"Records": "Récords",
"Single pins": "Un pino",
"Other leaves": "Otros pinos",
"First ball": "Primer tiro",
"Ladder under way.": "Final escalonada en curso.",
"Waiting for a better connection": "Esperando una mejor conexión",
"Your scores are saved on this phone and will upload on their own.": "Tus puntajes están guardados en este celular y se subirán solos.",
"Something was already saved": "Algo ya estaba guardado",
"This looks like a duplicate of something already in the cloud. Your scores are safe — this copy just isn't needed.": "Parece un duplicado de algo que ya está en la nube. Tus puntajes están a salvo — simplemente esta copia no hace falta.",
"Not allowed to save this": "No se permite guardar esto",
"The app doesn't have permission to save this. Nothing is lost on this phone, but it can't reach the cloud until this is fixed.": "La app no tiene permiso para guardar esto. No se pierde nada en este celular, pero no podrá llegar a la nube hasta que se corrija.",
"This didn't save correctly": "Esto no se guardó correctamente",
"Something about this entry doesn't fit what the cloud expects. Your scores are still on this phone.": "Algo en este registro no coincide con lo que espera la nube. Tus puntajes siguen en este celular.",
"Couldn't upload yet": "Todavía no se pudo subir",
"Your scores are saved on this phone. The app keeps trying in the background.": "Tus puntajes están guardados en este celular. La app sigue intentándolo en segundo plano.",
"Maple and amber, like the house lights are down": "Arce y ámbar, como cuando bajan las luces del boliche",
"Classic": "Clásico",
"Slate and blue, the original look": "Pizarra y azul, el aspecto original",
"Glow": "Cósmico",
"Rock'n'bowl green on warm black": "Verde de boliche cósmico sobre negro cálido",
"Deep plum with a pink flash": "Ciruela oscuro con un destello rosa",
"Pin deck": "Área de pinos",
"High contrast, red pin stripe": "Alto contraste, franja roja de pino",
"Daylight": "Luz de día",
"Bright house, maple accents": "Boliche iluminado, detalles de arce",
"Scoresheet": "Hoja de puntaje",
"Cream paper, ruled-line blue and split red": "Papel crema, azul de renglones y rojo de split",
"Chalk": "Tiza",
"Cool white, quiet blue": "Blanco frío, azul sereno",
"Keeping score": "Anotar puntaje",
"Home is where a night gets logged. Pick what you're doing from the rows at the top — league, practice, a tournament, just bowling — and the card opens underneath. Enter three game scores, or go ball by ball and record every leave.": "Inicio es donde se registra una noche. Elige lo que vas a hacer en las filas de arriba — liga, práctica, un torneo, juego libre — y la tarjeta se abre debajo. Ingresa los puntajes de tres juegos, o ve tiro por tiro y registra todos los pinos que quedan.",
"Your gear": "Tu equipamiento",
"Setup starts with your arsenal. On Balls, add a ball, record its layout, surface and specs, and on Bags sort them so tonight's four are one tap away.": "Preparar empieza con tu arsenal. En Bolas, agrega una bola y registra su layout, su superficie y sus especificaciones; en Maletas, organízalas para tener las cuatro de esta noche a un toque.",
"Leagues and teams": "Ligas y equipos",
"Setup is also where a league gets set up, under League, and a roster filled in, under Team. Scores file against a league, so that's the one thing worth doing first — a team can wait until you want to compare.": "En Preparar también configuras tu liga (en Liga) y llenas la lista del equipo (en Equipo). Los puntajes se registran dentro de una liga, así que eso es lo único que vale la pena hacer primero — el equipo puede esperar hasta que quieras compararte.",
"Stats and trends": "Stats y tendencias",
"Stats breaks your bowling down by ball, by game, by center and by team. The Trends chip charts any of it over time, and the eye on any card hides it.": "Stats desglosa cómo juegas por bola, por juego, por centro de boliche y por equipo. El botón Avance grafica cualquiera de esos datos a lo largo del tiempo, y el ojo de cada tarjeta la oculta.",
"Your journey": "Tu trayectoria",
"Your road so far: every first, dated, and how close you are to the next one — a few pins from a 700 series, say. Badges collect beside them.": "Tu camino hasta ahora: cada primera vez, con su fecha, y qué tan cerca estás de la siguiente — a unos pinos de una serie de 700, por ejemplo. Las insignias se van juntando al lado.",
"Calendar and journal": "Calendario y diario",
"History keeps every night you've bowled, on a calendar you can scroll back through. The journal gathers every note you've written — on a shot, a drill, a pattern or the end of a night — and you can search them, or filter by kind and date range.": "Historial guarda cada noche que has jugado, en un calendario que puedes recorrer hacia atrás. El diario reúne cada nota que has escrito — sobre un tiro, un ejercicio, un patrón o el final de una noche — y puedes buscarlas o filtrarlas por tipo y por rango de fechas.",
"That's enough for now": "Suficiente por ahora",
"You know your way around. If you want more, the settings menu has the rest — keeping score, bowling a tournament, what the AI does, stats, and coaching.": "Ya sabes moverte por la app. Si quieres más, el menú de configuración tiene el resto — anotar puntaje, jugar un torneo, qué hace la IA, estadísticas y entrenador.",
"By game": "Por juego",
"The quickest way in. Type the score for each game and you're done — three numbers, a night logged. Your average, highs and trends all work from this alone.": "La forma más rápida de empezar. Escribe el puntaje de cada juego y listo — tres números, una noche registrada. Tu promedio, tus mejores marcas y tus tendencias funcionan solo con esto.",
"A strike": "Un strike",
"Going ball by ball, tap Strike and the frame is finished — no pins to pick. Add how it hit if you want it: flush, high, light, a messenger, a Brooklyn.": "Si vas tiro por tiro, toca Strike y el cuadro queda terminado — no hay pinos que elegir. Agrega cómo pegó si quieres: al bolsillo, grueso, delgado, mensajero, cruzada.",
"A spare": "Un spare",
"Tap the pins you left standing, then answer Spare Made. Yes closes the frame. The pins you tap are what feeds your leave and conversion numbers later.": "Toca los pinos que quedaron en pie y luego responde “Spare convertido”. “Sí” cierra el cuadro. Los pinos que tocas son los que después alimentan tus números de pinos que quedan y de conversión.",
"An open frame": "Un cuadro abierto",
"Same start — tap what was standing — then answer No, and tap which of those pins you knocked down. None of them? Just save. The app works out the count.": "El mismo inicio — toca lo que quedó en pie — luego responde No y toca cuáles de esos pinos derribaste. ¿Ninguno? Solo guarda. La app hace la cuenta.",
"How the night went": "Cómo te fue en la noche",
"The Results chip closes the session: games, series, how it compared to your average, and anything you won. Tap it when you're done and the night is filed.": "El botón Resultados cierra la noche: juegos, serie, cómo te fue frente a tu promedio y lo que hayas ganado. Tócalo cuando termines y la noche queda archivada.",
"Setting up an event": "Preparar un evento",
"Pick Tournament on Home and Set up asks what the event is: its name and center, then Style, Scoring and Format. Those three are separate questions, so any mix works — a Baker squad can be handicapped and 9 pin no-tap at once. A handicap event then asks for your pins per game.": "Elige Torneo en Inicio y la pestaña Preparar te pregunta cuál es el evento: su nombre y su centro de boliche, luego Estilo, Modalidad y Formato. Son tres preguntas separadas, así que cualquier combinación funciona — un turno Baker puede ser con hándicap y no-tap de 9 pinos a la vez. Luego, un evento con hándicap te pide tus pinos por juego.",
"Add a block for each day or squad and they become tabs under Scoring. Enter the cut as it's posted — plus or minus against a 200 average — and the app tells you where you stand against it, carrying your earlier blocks in once there's more than one.": "Agrega un bloque por cada día o turno y se convierten en pestañas dentro de Puntaje. Ingresa el corte tal como lo publican — con + o − respecto a un promedio de 200 — y la app te dice dónde estás frente a él, sumando tus bloques anteriores en cuanto haya más de uno.",
"Making the cut": "Pasar el corte",
"The app never asks whether you made it: the margin already says. What it can't work out is what came next, so each block asks what you qualified for — match play, a stepladder, or neither — and gives you a button straight to it.": "La app nunca te pregunta si pasaste: el margen ya lo dice. Lo que no puede saber es qué vino después, así que cada bloque te pregunta a qué clasificaste — match play, final escalonada o ninguno — y te da un botón que te lleva directo ahí.",
"Each match is your score against an opponent's, with bonus pins for a win or a tie. In a handicap event there's a box for your opponent's handicap too.": "Cada match es tu puntaje contra el de un rival, con pinos de bono por ganar o empatar. En un evento con hándicap también hay una casilla para el hándicap de tu rival.",
"The stepladder": "La final escalonada",
"Sudden death, so no bonus pins — the higher score advances. Enter your seed and each opponent's, and the app works out where you finished from how far you climbed. Beat the one seed and it says you won it.": "Muerte súbita, así que no hay pinos de bono — avanza el puntaje más alto. Ingresa tu sembrado y el de cada rival, y la app calcula en qué lugar terminaste según cuánto subiste. Vence al sembrado 1 y te dice que la ganaste.",
"How the event went": "Cómo te fue en el evento",
"Results recaps the whole event broken out by phase, with your brackets and side pots and what they paid. End tournament and view results saves everything on its way there. The Nightcap reads the night back to you, and the share button hands the lot to whoever asks how you did.": "Resultados resume todo el evento por fase, con tus brackets y botes y lo que pagaron. “Terminar torneo y ver resultados” guarda todo antes de mostrarlos. El Nightcap repasa la noche contigo, y el botón de compartir le manda todo a quien te pregunte cómo te fue.",
"Photograph the scorecard": "Fotografiar la hoja de puntaje",
"Import, in the header, takes a picture of the monitor or a printed sheet. Every bowler on it, every frame it can read — no typing. It asks what you're importing, so you don't have to set the night up first.": "Importar, en el encabezado, toma una foto del monitor o de una hoja impresa. Cada persona que aparece, cada cuadro que pueda leer — sin escribir nada. Te pregunta qué estás importando, así que no tienes que preparar la noche primero.",
"Improve reads your own history and tells you what it finds — which ball is carrying, where a spare is leaking, what changed this month. Each one says how confident it is, and while the sample is still small it says so rather than letting you act on a pattern that is really just noise.": "La pestaña Mejorar lee tu propio historial y te dice lo que encuentra — qué bola tiene carry, dónde se te están escapando spares, qué cambió este mes. Cada análisis dice qué tan confiable es, y mientras la muestra todavía es pequeña, lo dice en lugar de dejarte actuar según una tendencia que en realidad es solo ruido.",
"The Nightcap": "El Nightcap",
"On a league or tournament Results screen, the Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Log the night ball by ball and it pours itself once the night is saved.": "En la pantalla de Resultados de una noche de liga o de torneo, el Nightcap, tu resumen al final de la noche, la repasa contigo — dónde quedaron los pinos, cuánto te costaron los cuadros abiertos, con qué bola tenías carry. Registra la noche tiro por tiro y se sirve solo en cuanto se guarda la noche.",
"Ask Brooklyn": "Pregúntale a Brooklyn",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. Her lamp sits in the header on every screen, so you never have to go looking. Three wishes a day.": "Las pantallas de Stats cubren los números de siempre. Brooklyn es para las preguntas que esas pantallas no responden — pregunta sobre tu propio juego con palabras sencillas y ella lo calcula a partir de lo que has registrado. Si necesita algo que todavía no registras, te dirá qué empezar a registrar. Su lámpara está en el encabezado de cada pantalla, así que nunca tienes que buscarla. Tres deseos al día.",
"Linking up": "Vinculación",
"Improve has a Coach button. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "Mejorar tiene un botón Entrenador. Indica en qué sentido va — “Me entrena” o “Yo entreno” — y crea un código. Dile los ocho caracteres a la otra persona, que lo ingresa en su propio celular, y quedan conectados.",
"Both sides, one screen": "Los dos lados, una pantalla",
"If you do both, the View chips flip between them: I'm bowling shows what your own coach has sent you, I'm coaching shows your bowlers. A coach sees their pupils' scores without having to add them as a friend, and either of you can end it from your own phone.": "Si haces las dos cosas, los botones de Vista cambian entre ellas: “Yo juego” muestra lo que te ha enviado tu entrenador, “Yo entreno” muestra a tus alumnos. Quien entrena ve los puntajes de sus alumnos sin tener que agregarlos como amigos, y cualquiera de los dos puede terminar la vinculación desde su propio celular.",
"Reading a bowler": "Analizar a un alumno",
"Pick a bowler and you get their recent nights and how their shots break down — strikes, spares, the leaves that keep coming back — with the number of shots it's built on shown beside it, so you know how much to trust it.": "Elige a un alumno y verás sus noches recientes y cómo se reparten sus tiros — strikes, spares, los pinos que le siguen quedando — con el número de tiros en que se basa al lado, para que sepas cuánto confiar en ello.",
"Setting work": "Asignar tareas",
"A task is something to go and do, with an optional measurable target and a due date — convert 60% of your single-pin spares, say. Leave the target off for anything that isn't a number.": "Una tarea es algo por hacer, con una meta medible opcional y una fecha límite — convertir el 60% de tus spares de un pino, por ejemplo. Deja la meta vacía para cualquier cosa que no sea un número.",
"Answering back": "Responder",
"The bowler marks it done, or records an attempt with the number they actually reached and a note about how it went. Either way it comes back to the coach, so the next thing you set is based on what happened rather than what was asked for.": "El alumno la marca como completada, o registra un intento con el número que realmente alcanzó y una nota sobre cómo le fue. De cualquier forma, le llega al entrenador, así que lo próximo que asignes se basa en lo que pasó y no en lo que se pidió.",
"Break it down": "Desglósalo",
"The chips across the top slice the same numbers different ways — yours, your team's, by ball, by game, by center.": "Los botones de arriba dividen los mismos números de distintas formas — los tuyos, los de tu equipo, por bola, por juego, por centro de boliche.",
"Compare": "Comparar",
"Put yourself beside a teammate, or against the team as a whole. Same measures, same scale.": "Ponte al lado de un compañero de equipo, o frente al equipo completo. Mismas medidas, misma escala.",
"When there isn't much data yet": "Cuando todavía no hay muchos datos",
"Nothing is locked — every card shows its numbers. But a number built on a handful of shots moves more with luck than with you, so until there's enough behind it the card is faded and says how many more shots it needs to be reliable.": "Nada está bloqueado — cada tarjeta muestra sus números. Pero un número basado en un puñado de tiros depende más de la suerte que de ti, así que hasta que tenga suficiente respaldo, la tarjeta se ve atenuada y dice cuántos tiros más necesita para ser confiable.",
"The trend graph": "La gráfica de tendencias",
"Pick the measure, the ball and the league from the three dropdowns, then choose how far back to look — a number of games, a number of days, or two dates. Every game, or one point per night.": "Elige la medida, la bola y la liga en los tres menús desplegables, y luego qué tan atrás quieres ver — un número de juegos, un número de días o dos fechas. Cada juego, o un punto por noche.",
"Look around": "Explorar",
"What's behind each tab": "Qué hay en cada pestaña",
"By game, or ball by ball": "Por juego, o tiro por tiro",
"Bowling a tournament": "Jugar un torneo",
"Blocks, the cut, match play, the ladder": "Bloques, el corte, match play, la final escalonada",
"What the AI does": "Qué hace la IA",
"Scorecards, insights, Nightcap, Brooklyn": "Hojas de puntaje, análisis, Nightcap, Brooklyn",
"Breakdowns, comparing, trends": "Desgloses, comparaciones, tendencias",
"Linking up, tasks, what comes back": "Vinculación, tareas, respuestas",
"Your pins, as bowled.": "Tus pinos, tal como los derribaste.",
"Pins added to every game.": "Pinos que se suman a cada juego.",
"You bowl the whole game.": "Tú tiras el juego completo.",
"You and a partner alternate frames.": "Alternas los cuadros con tu compañero.",
"I start": "Empiezo yo",
"Partner starts": "Empieza tu pareja",
"you and your partner": "tú y tu pareja",
"Your own frames still count toward strikes, spares and how each ball carried.": "Tus propios cuadros sí cuentan para los strikes, los spares y el carry de cada bola.",
"Average score per night.": "Puntaje promedio por noche.",
"Best Game": "Mejor juego",
"Your best single game each night.": "Tu mejor juego de cada noche.",
"Series Total": "Total de la serie",
"Total pins each night.": "Total de pinos de cada noche.",
"First game each night.": "Primer juego de cada noche.",
"Second game each night.": "Segundo juego de cada noche.",
"Third game each night.": "Tercer juego de cada noche.",
"Share of first balls that struck, per night.": "Porcentaje de primeros tiros que fueron strike, por noche.",
"Non-split spare conversion, per night.": "Conversión de spares (sin contar splits), por noche.",
"Conversion on a lone corner pin, per night.": "Conversión de un pino de esquina solo, por noche.",
"Frames closed with a strike or spare, per night.": "Cuadros cerrados con strike o spare, por noche.",
"No clear direction — the movement here is within normal night-to-night variation.": "Sin una tendencia clara — el movimiento aquí está dentro de la variación normal de una noche a otra.",
"Days": "Días",
"the start": "el inicio",
"Drill": "Ejercicio",
"Name it (optional)": "Ponle nombre (opcional)",
"Pins (optional)": "Pinos (opcional)",
"No ball recorded": "Sin bola registrada",
"· last time": "· la vez pasada",
"✓ Made": "✓ Acierto",
"✗ Missed": "✗ Fallo",
"Undo last": "Deshacer último",
"Shot notes — what worked on this drill…": "Notas de tiro — qué funcionó en este ejercicio…",
"✓ Drill Saved": "✓ Ejercicio guardado",
"Throw a few first": "Primero haz algunos tiros",
"+ Start another drill": "+ Empezar otro ejercicio",
"Saved tonight": "Guardados esta noche",
"This screen hit a problem": "Esta pantalla tuvo un problema",
"Your data is safe — nothing was lost. The rest of the app still works, so you can switch to another tab.": "Tus datos están a salvo — no se perdió nada. El resto de la app sigue funcionando, así que puedes cambiar a otra pestaña.",
"Try again": "Reintentar",
"Copy details": "Copiar detalles",
"Unknown": "Desconocido",
"Loading friends…": "Cargando amigos…",
"Add a Friend": "Agregar amigo",
"Search by name…": "Buscar por nombre…",
"No one found with that name.": "No hay nadie con ese nombre.",
"Share Sign-In Link": "Compartir enlace de acceso",
"A quick way to hand someone the app link — scanning this just opens the sign-in screen. It doesn't log anyone in as anyone; each person still enters their own email.": "Una forma rápida de pasarle a alguien el enlace de la app — escanear esto solo abre la pantalla de inicio de sesión. No inicia la sesión de nadie en otra cuenta; cada persona sigue escribiendo su propio correo.",
"QR code to sign-in page": "Código QR a la página de inicio de sesión",
"Sent": "Enviadas",
"No friends yet — search above to add someone.": "Aún no tienes amigos — busca arriba para agregar a alguien.",
"⚠️ Your games aren't attributed to your account": "⚠️ Tus juegos no están asociados a tu cuenta",
"Your account's display name doesn't match the bowler name your sessions are logged under. Set your name in Teams to fix this.": "El nombre visible de tu cuenta no coincide con el nombre de jugador con el que se registran tus sesiones. Pon tu nombre en Equipo para corregirlo.",
"✓ reached": "✓ alcanzado",
"Not enough data yet —": "Aún no hay suficientes datos —",
"before this is worth reporting.": "para que valga la pena mostrarlo.",
"Nothing logged for this yet.": "Aún no hay nada registrado para esto.",
"Now:": "Actual:",
"Target met": "Meta alcanzada",
"Pick a statistic first.": "Primero elige una estadística.",
"Enter a number.": "Escribe un número.",
"Goals": "Objetivos",
"Set a target for a statistic you're working on and track progress against it.": "Fija una meta para una estadística en la que estés trabajando y sigue tu progreso.",
"+ Add a goal": "+ Agregar un objetivo",
"You've set a goal for every statistic available.": "Ya fijaste un objetivo para cada estadística disponible.",
"Statistic": "Estadística",
"Choose one…": "Elige una…",
"Needs": "Se necesitan",
"before progress is shown.": "para mostrar el progreso.",
"Google signed in but didn't return an ID token. This usually means": "Google confirmó el inicio de sesión, pero no devolvió un token de ID. Esto suele significar que",
"the sign-in wasn't configured for online mode.": "el inicio de sesión no se configuró para el modo en línea.",
"Couldn't sign in with Google. Check your connection and try again.": "No se pudo iniciar sesión con Google. Revisa tu conexión y vuelve a intentarlo.",
"Menu": "Menú",
"Search help…": "Buscar en la ayuda…",
"Search help": "Buscar en la ayuda",
"Search": "Buscar",
"Name, hand, style, home centers": "Nombre, mano, estilo, centros habituales",
"Theme, stats cards, account": "Tema, tarjetas de estadísticas, cuenta",
"Search help — try 'buy-in' or 'prebowl'": "Buscar en la ayuda — prueba “entrada” o “adelantar”",
"Show me around the app again": "Volver a ver el recorrido de la app",
"Nothing matched \"": "No hay resultados para “",
"\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".": "”. Prueba una palabra que veas en la app — “spare”, “equipo”, “bola”, “importar”.",
"This season": "Esta temporada",
"Your career": "Tu carrera",
"League season": "Temporada de liga",
"Between seasons": "Entre temporadas",
"All league play": "Todos los juegos de liga",
"this season": "esta temporada",
"No games yet": "Aún no hay juegos",
"Your bowling": "Tu juego",
"League average": "Promedio de liga",
"High game": "Juego más alto",
"High series": "Serie más alta",
"Open full statistics": "Ver todas las estadísticas",
"My Bowling Journey": "My Bowling Journey",
"Your milestones and progress": "Tus hitos y tu progreso",
"Latest milestone": "Último hito",
"milestone": "hito",
"so far": "hasta ahora",
"Next ·": "Próximo ·",
"Progress to next milestone": "Progreso al próximo hito",
"Your bowling story starts here.": "Tu historia en el boliche empieza aquí.",
"What are you doing today?": "¿Qué vas a hacer hoy?",
"Latest ·": "Reciente ·",
"That file could not be read.": "No se pudo leer ese archivo.",
"Import cancelled. Nothing was saved.": "Importación cancelada. No se guardó nada.",
"Nothing to import.": "No hay nada que importar.",
"Import scores from a file": "Importar puntajes desde un archivo",
"A CSV with four columns:": "Un CSV con cuatro columnas:",
". Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.": ". Las fechas se escriben como 2026-09-17, los puntajes son números enteros de 0 a 300 y una noche puede tener uno, dos o tres juegos.",
"Import into": "Importar a",
"Imported (no league)": "Importado (sin liga)",
"Leave it as Imported if these nights don't belong to a league you track.": "Déjalo en “Importado” si estas noches no pertenecen a una liga que sigas.",
"What would import": "Lo que se importaría",
"row": "fila",
"skipped": "omitida(s)",
"Rows that can't be imported": "Filas que no se pueden importar",
"Row": "Fila",
"and": "y",
"you already have": "que ya tienes",
"Replace those nights": "Reemplazar esas noches",
"Keep mine, import the other": "Dejar las mías, importar las otras",
"Cancel the import": "Cancelar la importación",
"Importing…": "Importando…",
"Imported from a teammate's scorecard photo. These are already counting — confirming just marks them checked.": "Puntajes importados de la foto de la hoja de puntaje de un integrante del equipo. Ya cuentan — confirmarlos solo los marca como revisados.",
"Scores read": "Puntajes leídos",
"Frame-by-frame data included for": "Datos cuadro por cuadro incluidos para",
"— confirming adds it to your shot history.": "— al confirmar, se agregan a tu historial de tiros.",
"These are right": "Son correctos",
"Fix them": "Corregir",
"What were they actually?": "¿Cuáles fueron en realidad?",
"Save corrections": "Guardar correcciones",
"None of these are mine": "Ninguno es mío",
"Needs You": "Pendientes",
"Open ›": "Abrir ›",
"You were added to the roster as": "Te agregaron a la lista del equipo como",
"a member": "integrante",
". Teammates will be able to import your scores from a scorecard photo — you still confirm them.": ". Tu equipo podrá importar tus puntajes desde una foto de la hoja de puntaje — igual tú los confirmas.",
"Joining…": "Uniéndote…",
"Join team": "Unirme al equipo",
"Invitation": "Invitación",
"Invitations": "Invitaciones",
"Scores To Check": "Puntajes por revisar",
"imported by a teammate.": "que importó alguien de tu equipo.",
"Needs Re-entering": "Por registrar de nuevo",
"You said these weren't yours, so they've stopped counting. Enter them on the Log tab when you have them.": "Dijiste que estos no eran tuyos, así que dejaron de contar. Regístralos en la pestaña Jugar cuando los tengas.",
"Waiting On Teammates": "Esperando al equipo",
"These haven't been confirmed and a session has since finished. You can correct them if you know the real scores.": "Estos no se han confirmado y desde entonces ya terminó una noche. Puedes corregirlos si sabes los puntajes reales.",
"Correct these": "Corregir",
"Couldn't read that scorecard right now. Try again in a few minutes, or enter the scores by hand.": "No se pudo leer esa hoja de puntaje por ahora. Intenta de nuevo en unos minutos o escribe los puntajes a mano.",
"No": "No",
"Which pins did the second ball knock down?": "¿Qué pinos derribó el segundo tiro?",
"this frame": "en este cuadro",
"Game": "Juego",
"No frame-by-frame detail on this scorecard — importing the game score only.": "Esta hoja de puntaje no tiene detalle cuadro por cuadro — solo se importará el puntaje del juego.",
"Score": "Puntaje",
"That isn't a possible game score — type the real one.": "Ese puntaje no es posible en un juego — escribe el real.",
"fill ball": "tiro extra",
"below couldn't be reliably read from the image -- please double-check the pin count.": "de abajo no se pudo leer bien en la imagen -- revisa el conteo de pinos.",
"Tap a frame to fix what was read.": "Toca un cuadro para corregir lo que se leyó.",
"· fill ball — pick a result": "· tiro extra — elige un resultado",
"What are you importing?": "¿Qué vas a importar?",
"Which team?": "¿Qué equipo?",
"No teams yet — add one under a league in Team, then import.": "Aún no hay equipos — agrega uno dentro de una liga en Equipo y luego importa.",
"Which tournament?": "¿Qué torneo?",
"No tournaments yet — start one on the Bowl tab first.": "Todavía no hay torneos — primero empieza uno en la pestaña Jugar.",
"Filed as practice — no league or team needed.": "Se guarda como práctica — no hace falta liga ni equipo.",
"Date": "Fecha",
"Couldn't read one of the selected images.": "No se pudo leer una de las imágenes seleccionadas.",
"Couldn't read the selected images.": "No se pudieron leer las imágenes seleccionadas.",
"The import took too long and was stopped. Try one image at a time.": "La importación tardó demasiado y se detuvo. Prueba con una imagen a la vez.",
"a Lite model cannot be trusted with pin identities": "",
"frames did not match the printed total": "",
"saw frame detail but read none": "",
"read no frames": "",
"no response": "",
"timed out": "",
"no frames": "",
", mismatched": "",
"The scorecard reader is busy right now — this happens at peak times and usually clears within a few minutes.": "El lector de hojas de puntaje está ocupado en este momento — pasa en horas pico y normalmente se resuelve en unos minutos.",
"Read Frames": "Leer cuadros",
"Read Scores": "Leer puntajes",
"The scorecard reader's daily allowance is used up. It resets on Google's clock, so this usually means tomorrow — scores typed in by hand save normally in the meantime.": "Se agotó el límite diario del lector de hojas de puntaje. Se reinicia según el horario de Google, así que normalmente será mañana — mientras tanto, los puntajes que escribas a mano se guardan normalmente.",
"The scorecard reader is briefly over its rate limit. Wait about a minute and try again — nothing is lost.": "El lector de hojas de puntaje superó brevemente su límite de solicitudes. Espera más o menos un minuto e inténtalo de nuevo — no se pierde nada.",
"The scorecard reader isn't available right now. Scores typed in by hand save normally in the meantime.": "El lector de hojas de puntaje no está disponible en este momento. Mientras tanto, los puntajes que escribas a mano se guardan normalmente.",
"Couldn't reach the scorecard reader. Check your signal, or try one image at a time —": "No se pudo conectar con el lector de hojas de puntaje. Revisa tu señal o prueba con una imagen a la vez —",
"a large photo can take too long to send.": "una foto grande puede tardar demasiado en enviarse.",
"No games could be read from the image(s). Try a clearer screenshot.": "No se pudo leer ningún juego de las imágenes. Prueba con una captura de pantalla más nítida.",
"Found games but couldn't read any scores or frame detail. Try a clearer screenshot.": "Se encontraron juegos, pero no se pudo leer ningún puntaje ni detalle de cuadros. Prueba con una captura de pantalla más nítida.",
"Frames you already have will be skipped, so nothing gets double-counted. Anything new on this card still comes in. Continue?": "Los cuadros que ya tienes se omitirán, así que nada se contará dos veces. Todo lo nuevo de esta hoja sí se importa. ¿Continuar?",
"Nothing was mapped to you on this card.": "No se te asignó nada en esta hoja.",
"What's on the card?": "¿Qué hay en la hoja?",
"Game scores": "Puntajes de juegos",
"Frame by frame": "Cuadro por cuadro",
"Reads each game's score. Fastest. If the card turns out to show frames, they get read too.": "Lee el puntaje de cada juego. Lo más rápido. Si resulta que la hoja muestra cuadros, también se leen.",
"Reads every ball and the pins it left. Slower, and leaves can come back wrong — you'll see each frame as a scoresheet to fix before saving.": "Lee cada tiro y los pinos que dejó. Más lento, y los pinos que quedan pueden salir mal — verás cada cuadro como hoja de puntaje para corregirlo antes de guardar.",
"Scorecard Screenshot": "Captura de la hoja de puntaje",
"Clear all": "Borrar todo",
"image": "imagen",
"Nothing's broken — just busy": "No hay ninguna falla — solo está ocupado",
"Reading the scorecard…": "Leyendo la hoja de puntaje…",
"This can take a minute or two — every frame is read individually.": "Esto puede tomar uno o dos minutos — cada cuadro se lee por separado.",
"Keep this screen open until it finishes.": "Mantén esta pantalla abierta hasta que termine.",
"Who's who": "Quién es quién",
"bowler": "jugador",
"read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.": "en la hoja. Confirma cada uno antes de guardar nada — una asignación equivocada registra el juego de una persona en el historial de otra.",
"frame tracking": "registro por cuadro",
"scores only": "solo puntajes",
"no detail": "sin detalle",
"series": "serie",
"· combined from": "· combinación de",
"images": "imágenes",
"Games add to": "Los juegos suman",
"but the card's scratch series is": "pero la serie scratch de la hoja es",
". One of the games was misread — check the card.": ". Uno de los juegos se leyó mal — revisa la hoja.",
"Skip this bowler": "Omitir a esta persona",
"Add \"": "Agregar “",
"\" as a new bowler": "” como jugador nuevo",
"More than one bowler matches this name equally — pick the right one.": "Este nombre coincide igual de bien con más de una persona — elige la correcta.",
"Matched on the alias \"": "Coincidencia por el alias “",
"Roster order": "Orden de la lista del equipo",
"The card's order doesn't match your team roster. Names still matched correctly — but if the roster is wrong, position hints will be wrong for every future import.": "El orden de la hoja no coincide con la lista de tu equipo. Los nombres sí se asociaron bien — pero si la lista está mal, las sugerencias de posición estarán mal en cada importación futura.",
"Card order:": "Orden en la hoja:",
"Continue": "Continuar",
"Start Over": "Empezar de nuevo",
"nothing was mapped to you on this card.": "no se te asignó nada en esta hoja.",
"check the games below — some came through frame by frame, some as scores only. Correct anything that's wrong, then save.": "revisa los juegos de abajo — algunos llegaron cuadro por cuadro y otros solo como puntajes. Corrige lo que esté mal y luego guarda.",
"Where this goes": "Destino",
"This scorecard": "Esta hoja de puntaje",
"check the numbers against the card before saving": "compara los números con la hoja antes de guardar",
"Also sending to teammates": "También se envía a integrantes del equipo",
"These go to": "Estos puntajes se envían a",
"this bowler": "esta persona",
"these bowlers": "estas personas",
"to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.": "para confirmar. Cuentan de inmediato — confirmarlos solo los marca como revisados. Corrige lo que se haya leído mal antes de enviar.",
"read as \"": "Se leyó como “",
"couldn't be read — type the real score, or clear the box if they didn't bowl it.": "ilegible(s) — escribe el puntaje real, o vacía la casilla si no se jugó.",
"Series": "Serie",
"· card printed": "· en la hoja:",
"Saving…": "Guardando…",
"Pick a result for the fill ball first": "Primero elige el resultado del tiro extra",
"Fix the flagged scores first": "Primero corrige los puntajes señalados",
"Looks Good — Save": "Todo bien — guardar",
"Moderate": "Moderada",
"Tentative": "Provisional",
"What This Is Based On": "En qué se basa",
"games. Only statistics with enough data to be meaningful are analysed.": "juegos. Solo se analizan las estadísticas con suficientes datos para ser significativas.",
"Ball comparisons unlock as each ball builds up its own sample. They need more than overall stats because comparing two percentages doubles the uncertainty.": "Las comparaciones de bolas se desbloquean a medida que cada bola acumula su propia muestra. Necesitan más datos que las estadísticas generales porque comparar dos porcentajes duplica la incertidumbre.",
"You're close on": "Te falta poco para",
"— a couple more nights and it unlocks.": "— un par de noches más y se desbloquea.",
"Insights": "Análisis",
"Select a bowler on the Log tab first. Insights are about one bowler's game, not everyone's combined.": "Primero elige a una persona en la pestaña Jugar. El análisis trata del juego de una sola persona, no de todos combinados.",
"to go.": "por jugar.",
"Insights need at least": "El análisis necesita al menos",
"games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.": "juegos. Con menos, los números varían demasiado de una noche a otra como para decir algo confiable — obtendrías tendencias que suenan muy seguras pero que en realidad son solo ruido.",
"You have": "Tienes",
"games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.": "juegos registrados. Todavía nada tiene suficientes datos para analizarlo con honestidad — esto es lo que está más cerca.",
"Based on": "Basado en",
"games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.": "juegos hasta ahora. Esto se vuelve más preciso cuanto más registras — unas cuantas noches dan una pista, una temporada te da algo con qué actuar.",
"New since last time:": "Nuevo desde la última vez:",
"Dismiss": "Cerrar",
"Looks at your logged statistics and reports what stands out. It only uses numbers with enough data behind them, and it reports patterns rather than telling you how to bowl.": "Revisa las estadísticas que has registrado y te dice qué destaca. Solo usa números con suficientes datos detrás, y describe tendencias en lugar de decirte cómo jugar.",
"Analysing…": "Analizando…",
"Analyse My Game": "Analizar mi juego",
"Try Again": "Reintentar",
"Worth Paying Attention To": "Para tener en cuenta",
"Written by AI from the stats you've logged. It can be wrong, and it can sound confident while being wrong — treat it as a starting point for a conversation, not an instruction.": "Escrito por IA a partir de las estadísticas que has registrado. Puede equivocarse, y puede sonar muy seguro aun cuando se equivoca — tómalo como punto de partida para una conversación, no como una instrucción.",
"You're working with": "Trabajas con",
"a coach": "un entrenador o entrenadora",
"— worth talking this through with them before changing anything. They can see what these numbers can't.": "— conviene hablarlo con esa persona antes de cambiar algo. Puede ver lo que estos números no muestran.",
"Run Again": "Analizar de nuevo",
"Night": "Noche",
"Pattern": "Patrón",
"Shot": "Tiro",
"Nothing written yet. Notes you add to a shot, a drill or the end of a night all collect here, so you can look back at what you were working on and what you said about it.": "Todavía no hay nada escrito. Las notas que agregas a un tiro, a un ejercicio o al final de una noche se juntan aquí, para que puedas revisar en qué estabas trabajando y qué dijiste al respecto.",
"Search your notes…": "Busca en tus notas…",
"Filters": "Filtros",
"Filter": "Filtrar",
"Kind": "Tipo",
"Dates": "Fechas",
"From date": "Fecha de inicio",
"To date": "Fecha de fin",
"in that range": "en ese rango de fechas",
"Nothing written in that range.": "No hay nada escrito en ese rango de fechas.",
"The road starts with your first night": "El camino empieza con tu primera noche",
"Badges": "Insignias",
"pins down": "pinos derribados",
"Up next": "Lo que sigue",
"Your bowling milestones, newest first": "Tus hitos en el boliche, del más reciente al más antiguo",
"LATEST": "ÚLTIMO",
"Your road starts here": "Tu camino empieza aquí",
"Log a night and your first milestones land on the road with the date you did them — first strike, first spare, first 100.": "Registra una noche y tus primeros hitos aparecerán en el camino con la fecha en que los lograste — primer strike, primer spare, primer 100.",
"The road so far": "El camino hasta ahora",
"newest first": "más recientes primero",
"What you've collected along the way": "Lo que has reunido en el camino",
"Your active league": "Tu liga activa",
"The free plan follows this league.": "El plan gratis cubre esta liga.",
"Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.": "Cambiar de liga, o jugar en más de una, es parte de Pro — y todo lo que has registrado regresa cuando te suscribes.",
"Get Pro": "Obtén Pro",
"That league is still syncing. Give it a moment and try again.": "Esa liga todavía se está sincronizando. Espera un momento y vuelve a intentarlo.",
"Your active league is already chosen. Switching leagues is part of Pro.": "Tu liga activa ya está elegida. Cambiar de liga es parte de Pro.",
"Could not save that just now. Your leagues are untouched — try again in a minute.": "No se pudo guardar en este momento. Tus ligas siguen intactas — vuelve a intentarlo en un minuto.",
"Choose your active league": "Elige tu liga activa",
"A free account follows one league. Pick the one you want to keep bowling with — you choose once, and switching later is part of Pro. The rest are paused, not deleted, and everything you have logged comes back when you subscribe.": "Una cuenta gratis cubre una sola liga. Elige la liga en la que quieres seguir jugando — solo eliges una vez, y cambiar después es parte de Pro. Las demás quedan en pausa, no se eliminan, y todo lo que has registrado regresa cuando te suscribes.",
"Active league": "Liga activa",
"Paused:": "En pausa:",
". Practice and Just Bowling stay open either way.": ". Práctica y Juego libre siguen disponibles de todos modos.",
"Keep this league": "Conservar esta liga",
"Saved.": "Guardado.",
"is your active league.": "es tu liga activa.",
"more ▾": "más ▾",
"Oil pattern": "Patrón de aceite",
"Which nights": "Qué noches",
"Every night": "Todas las noches",
"Avg": "Prom.",
"vs your": "vs. tu",
"overall": "de promedio general",
"g": "j.",
"breakpoint": "quiebre",
"Averaged over the night": "Promedio de toda la noche",
"Show my usual line": "Ver mi línea habitual",
"Follow the transition": "Ver transición",
"Position through the block": "Posición en el bloque",
"fresh oil": "aceite fresco",
"end of the block": "fin del bloque",
"Show all": "Mostrar todo",
"Hide all": "Ocultar todo",
"Nothing on the lane — turn a ball back on.": "Nada en la pista — vuelve a activar una bola.",
"on this night": "en esta noche",
"Solid while it skids, dashed once it turns — where it turns comes from the oil pattern rather than from anything you logged.": "Línea continua mientras se desliza, punteada cuando empieza a girar — dónde gira depende del patrón de aceite, no de algo que hayas registrado.",
"no pins": "ningún pino",
"Rank leaves by": "Ordenar los pinos que quedan por",
"Top missed": "Fallados",
"Top made": "Convertidos",
"Everything else": "Todo lo demás",
"Show more": "Ver más",
"Collapse all": "Contraer todo",
"Me": "Yo",
"Partner": "Pareja",
"Nightcap": "Nightcap",
"isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "no se sirve en una noche de formato Baker — los cuadros son de la pareja, no de una sola persona.",
"Points Won": "Puntos ganados",
"Tap to cycle: not marked → won → lost.": "Toca para alternar: sin marcar → ganado → perdido.",
"Pinfall": "Total de pinos",
"of 4 points": "de 4 puntos",
"Side Games": "Juegos extra",
"in": "pagados",
"Tonight": "Esta noche",
"G": "J",
"If every makeable spare had been made": "Si hubieras convertido cada spare posible",
"Theory": "teórico",
"Theory Series": "Serie teórica",
"pins left on the lane": "pinos sin derribar en la pista",
"✓ Converted every makeable spare": "✓ Convertiste todos los spares posibles",
"actual vs": "real vs.",
"possible)": "posible)",
"Quarter game": "Juego de 25 centavos",
"Dollar game": "Juego de 1 dólar",
"3-6-9 (whole night)": "3-6-9 (toda la noche)",
"Side games tonight": "Juegos extra esta noche",
"Tap the ones you're in. Buy-ins are saved for": "Toca los juegos en los que participas. Las entradas se guardan para",
"— you won't need to enter them again.": "— no tendrás que volver a ingresarlas.",
"Buy-in per game": "Entrada por juego",
"not playing": "no participas",
"tonight · $": "esta noche · $",
"paid in": "pagados",
"Poker Winnings ($)": "Ganancias de póker ($)",
"High Game Pot ($)": "Bote del juego más alto ($)",
"Highest game in the league takes it — enter what you won, if anything.": "El juego más alto de la liga se lo lleva — ingresa lo que ganaste, si ganaste algo.",
"3-6-9 Winnings ($)": "Ganancias del 3-6-9 ($)",
"All nine struck — you took it": "Strike en los nueve cuadros — te llevaste el bote",
", and the tenth carried for the jackpot": ", y con el décimo, también el acumulado",
"Pot": "Bote",
"Jackpot": "Acumulado",
"won tonight": "ganados esta noche",
"✓ Winnings Saved": "✓ Ganancias guardadas",
"Save Winnings": "Guardar ganancias",
"Strike %": "% de strikes",
"Spare %": "% de spares",
"10 Pins": "Pino 10",
"Weak 10s": "10 débiles",
"Ringing 10s": "10 aislados",
"Other 10s": "Otros 10",
"Splits": "Splits",
"Converted": "Convertidos",
"Balls used": "Bolas usadas",
"Release Quality": "Calidad de soltada",
"Good": "Buena",
"Bad": "Mala",
"Misses": "Fallos",
"Running Averages": "Promedios acumulados",
"Composite": "Combinado",
"Share tonight": "Compartir la noche",
"Set up": "Preparar",
"Scoring": "Puntaje",
"Side games": "Juegos extra",
"Games": "Juegos",
"Tonight's Session": "Noche de hoy",
"✓ Prebowling": "✓ Adelantar juegos",
"Prebowling for a future week?": "¿Adelantar juegos de una semana futura?",
"Opponent": "Rival",
"Opponent (e.g. Team Name)": "Equipo rival",
"Handicap": "Hándicap",
"Starting Lane": "Pista inicial",
"e.g. 8": "p. ej. 8",
"Lanes": "Pistas",
"Official Pattern": "Patrón oficial",
"Length (ft)": "Longitud (ft)",
"Volume (mL)": "Volumen (mL)",
"Ratio (e.g. 3:1)": "Proporción (p. ej. 3:1)",
"Lane Conditions": "Condiciones de la pista",
"This league usually runs": "Esta liga suele usar",
". Anything you set here is for tonight only.": ". Lo que configures aquí es solo para esta noche.",
"Start Scoring": "Empezar a anotar",
"Cancel League": "Cancelar noche de liga",
"This deletes tonight's shots, game scores and match points for": "Esto elimina los tiros, los puntajes de los juegos y los puntos de match de esta noche de",
", clears the setup, and takes you back to Home. This cannot be undone.": ", limpia la preparación y te regresa a Inicio. No se puede deshacer.",
"Keep bowling": "Seguir jugando",
"Delete and exit": "Eliminar y salir",
"Enter Game Scores": "Ingresar puntajes",
"Which bag tonight?": "¿Qué maleta usas esta noche?",
"All my balls": "Todas mis bolas",
"frames say": "los cuadros dicen",
"Ball…": "Bola…",
"Surface…": "Superficie…",
"Delete game": "Eliminar juego",
"? This removes the score": "? Esto borra el puntaje",
"and every frame logged for it": "y todos los cuadros registrados para ese juego",
". It can't be undone.": ". No se puede deshacer.",
"+ Add game": "+ Agregar juego",
"Want to see which spares are costing you?": "¿Quieres ver qué spares te están costando puntos?",
"You've logged a few nights on game tracking. Tracking one game frame by frame turns those into spare conversion, carry and leave patterns. You can switch back whenever you like.": "Ya registraste algunas noches con seguimiento por juego. Registrar un juego cuadro por cuadro convierte esos datos en conversión de spares, carry y patrones de pinos que quedan. Puedes volver al modo anterior cuando quieras.",
"Try it for a game": "Pruébalo en un juego",
"We love leagues too! 🎳": "¡A nosotros también nos encantan las ligas! 🎳",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet — you can add one whenever you like, and tonight's scores will join it.": "Agrega la liga en la que juegas y podrás empezar a anotar puntajes de inmediato. Todavía no hace falta un equipo — puedes agregar uno cuando quieras, y los puntajes de esta noche se sumarán a él.",
"Add my league": "Agregar mi liga",
"Show me how first": "Primero muéstrame cómo",
"Want these to count for your team?": "¿Quieres que cuenten para tu equipo?",
"Your scores are saved and yours either way. Joining your team — or making one if it's not there yet — puts them on the team sheet as well: standings, side pots and everyone's averages in one place. Everything you've already logged in this league comes with you.": "Tus puntajes se guardan y son tuyos de cualquier forma. Unirte a tu equipo — o crearlo si todavía no existe — también los pone en la hoja del equipo: tabla de posiciones, botes y los promedios de todos en un solo lugar. Todo lo que ya registraste en esta liga se va contigo.",
"Add or join my team": "Agregar o unirme a mi equipo",
"Not now": "Ahora no",
"Scores above are enough. Frames below add shot and ball data.": "Con los puntajes de arriba basta. Los cuadros de abajo agregan datos de tiros y bolas.",
"Shot Context": "Contexto del tiro",
"10th Frame": "Cuadro 10",
"No bowler selected": "No hay nadie seleccionado",
"— pick a league above": "— elige una liga arriba",
"Series so far": "Serie hasta ahora",
"Frame": "Cuadro",
"Ball in 10th": "Tiro en el cuadro 10",
"Lane": "Pista",
"✏️ Edit the 10th — which ball?": "✏️ Editar el cuadro 10 — ¿qué tiro?",
"Fill": "Extra",
"✏️ Editing Shot": "✏️ Editando tiro",
"Keeping score for": "Anotando puntaje de",
"✓ Also scoring for others": "✓ También anoto a otras personas",
"Also scoring for others": "También anoto a otras personas",
"Add someone bowling with you": "Agregar a alguien que juega contigo",
"No teammates on this league's roster yet — add them on the Social tab.": "Todavía no hay integrantes del equipo en la lista de esta liga — agrégalos en la pestaña Amigos.",
"Result": "Resultado",
"Required": "Obligatorio",
"everything else is optional": "lo demás es opcional",
"Other": "Otro",
"Pins Standing": "Pinos en pie",
"Gutter": "Canal",
"9 Pin No-Tap → scored as Strike": "No-tap de 9 pinos → cuenta como strike",
"Leave:": "Pinos que quedan:",
"· First ball:": "· Primer tiro:",
"Strike Description": "Tipo de strike",
"Spare Made": "Spare convertido",
"Which pins did you knock down?": "¿Qué pinos derribaste?",
"Tap the ones that fell. None of them? Just save the shot.": "Toca los que cayeron. ¿Ninguno? Solo guarda el tiro.",
"That's every pin — we'll save this as a spare.": "Son todos los pinos — lo guardaremos como spare.",
"First ball:": "Primer tiro:",
"Second ball:": "Segundo tiro:",
"Done picking pins — show the rest of the form": "Ya elegí los pinos — mostrar el resto del formulario",
"Clear everyone's game 1 scores?": "¿Borrar los puntajes del juego 1 de todos?",
"Later games move down one.": "Los juegos siguientes se renumeran.",
"Scores": "Puntajes",
"Just the final score for each game. Totals add themselves.": "Solo el puntaje final de cada juego. Los totales se suman solos.",
"BOWLER": "JUGADOR",
"Total": "Total",
"Clear game 1 scores": "Borrar puntajes del juego 1",
"TOTAL": "TOTAL",
"+ Add a game": "+ Agregar un juego",
"Cancel Open Bowling": "Cancelar juego libre",
"This deletes tonight's open bowling scores for everyone on the sheet and takes you back to Home. This cannot be undone.": "Esto elimina los puntajes de juego libre de esta noche de todas las personas en la hoja y te regresa a Inicio. No se puede deshacer.",
"Ball Change Reason": "Motivo del cambio de bola",
"Switched from": "Cambiaste de",
"— why?": "— ¿por qué?",
"Optional below this line": "Opcional debajo de esta línea",
"Accessory details": "Detalles adicionales",
"tap to open": "toca para abrir",
"— pick a ball —": "— elige —",
"Surface": "Superficie",
"Line": "Línea",
"Stand": "Posición",
"board #": "tabla n.º",
"Hit": "Real",
"Breakpoint": "Punto de quiebre",
"On target": "En el blanco",
"board": "tabla",
"of target": "del blanco",
"Release": "Soltada",
"Speed": "Velocidad",
"Rev rate": "Revoluciones",
"Axis rot.": "Rot. del eje",
"Axis tilt": "Incl. del eje",
"Shoes": "Zapatos",
"Heel #": "Tacón n.º",
"Sole #": "Suela n.º",
"Execution": "Ejecución",
"repeat(2, minmax(0, 1fr))": "",
"minmax(0, 1fr)": "",
"Miss": "Fallo",
"Tap the pins you left standing.": "Toca los pinos que quedaron en pie.",
"Answer \"Spare Made\" above to save.": "Responde “Spare convertido” arriba para guardar.",
"Nothing logged yet tonight. Shoot a game or run a drill and it lands here.": "Todavía no hay nada registrado esta noche. Tira un juego o haz un ejercicio y aparecerá aquí.",
"average": "promedio",
"strikes": "strikes",
"spares": "spares",
"clean": "limpios",
"first balls struck": "primeros tiros con strike",
"Best carry tonight:": "Mejor carry esta noche:",
"over": "en",
"first balls": "primeros tiros",
"Session Notes": "Notas de la noche",
"How the night went, what to try next time…": "Cómo te fue esta noche, qué probar la próxima vez…",
"Cancel Practice": "Cancelar práctica",
"This deletes today's practice shots and game scores for": "Esto borra los tiros de práctica y los puntajes de juegos de hoy de",
"and takes you back to Home. This cannot be undone.": "y te regresa a Inicio. Esto no se puede deshacer.",
"Keep practicing": "Seguir practicando",
"✓ Updated": "✓ Actualizado",
"✓ Saved": "✓ Guardado",
"Update": "Actualizar",
"Save Shot": "Guardar tiro",
"Open Bowling": "Juego libre",
"Enter a score first": "Primero ingresa un puntaje",
"Session": "Sesión",
"That sign-in link didn't work — it may have expired. Send yourself a new one.": "Ese enlace para iniciar sesión no funcionó — puede que haya vencido. Envíate uno nuevo.",
"Couldn't finish signing in. Check your connection and try the link again.": "No se pudo terminar de iniciar sesión. Revisa tu conexión y vuelve a probar el enlace.",
"Couldn't pour the nightcap just then. Tap to try again.": "No se pudo servir el Nightcap en ese momento. Toca para intentarlo de nuevo.",
"No signal for this one. It'll still be here when you're back online.": "No hay señal por ahora. Tu Nightcap seguirá aquí cuando vuelvas a tener conexión.",
"That nightcap came back in a shape the app couldn't read. Tap to try again.": "Ese Nightcap regresó en un formato que la app no pudo leer. Toca para intentarlo de nuevo.",
"Nightcap 🥃": "Nightcap 🥃",
"Try tracking frame data next week and we'll have a Nightcap together.": "Intenta registrar los datos de cada cuadro la próxima semana y compartiremos un Nightcap.",
"There are": "Hay",
"things worth saying about tonight.": "cosas que vale la pena comentar sobre esta noche.",
"The Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Part of the paid plan.": "El Nightcap (tu resumen al final de la noche) repasa tu noche contigo — qué pinos te quedaban en pie, cuánto te costaron los cuadros abiertos, con qué bola tenías carry. Incluido en el plan de pago.",
"Pour another": "Servir otro",
"things were true about tonight. Here are the two or three worth hearing.": "datos de esta noche. Estos son los dos o tres que vale la pena escuchar.",
"Pour the nightcap": "Servir el Nightcap",
"Reading back the night…": "Repasando la noche…",
"first balls across": "primeros tiros en",
"— tonight only.": "— solo esta noche.",
"Pattern name": "Nombre del patrón",
"Couldn't search for centers right now.": "No se pudieron buscar centros de boliche en este momento.",
"Welcome to": "Te damos la bienvenida a",
"Who's bowling?": "¿Quién juega?",
"Your name goes on your scores and is how teammates find you. The rest sets up the stats correctly — all changeable later.": "Tu nombre aparece en tus puntajes y así te encuentran los integrantes de tu equipo. Lo demás sirve para configurar bien las estadísticas — todo se puede cambiar después.",
"Your name": "Tu nombre",
"Which hand?": "¿Con qué mano?",
"Right": "Derecha",
"Left": "Izquierda",
"Style": "Estilo",
"One-handed": "A una mano",
"Two-handed": "A dos manos",
"Where do you bowl?": "¿Dónde juegas?",
"(optional)": "(opcional)",
"Search for a center": "Busca un centro de boliche",
"Just a first name is fine.": "Con tu nombre de pila basta.",
"Got a team code from your captain?": "¿Tu capitán te dio un código de equipo?",
"Team code": "Código de equipo",
"ABCD-EFGH": "ABCD-EFGH",
"Puts you straight onto your team, with anything they've already logged for you.": "Te agrega directamente a tu equipo, con todo lo que el equipo ya haya registrado por ti.",
"Do you coach other bowlers?": "¿Entrenas a otros bolichistas?",
"Turns on the roster for tracking who you coach.": "Activa la lista de alumnos para dar seguimiento a las personas que entrenas.",
"Start Bowling": "Empezar a jugar",
"‹ Back to History": "‹ Volver al historial",
"No game scores were saved for this night, so there are no results to show.": "No se guardaron puntajes de juegos para esta noche, así que no hay resultados que mostrar.",
"Suggested new book average:": "Nuevo promedio establecido sugerido:",
"Change the number below if this doesn't match your full season.": "Cambia el número de abajo si no coincide con tu temporada completa.",
"Update to": "Actualizar a",
"Not Now": "Ahora no",
"Add a bowler on the Log tab first — profiles are per bowler.": "Primero agrega un jugador en la pestaña Jugar — cada persona tiene su propio perfil.",
"Your Name": "Tu nombre",
"(not set)": "(sin definir)",
"Scorecard Names": "Nombres en la hoja de puntaje",
"None": "Ninguno",
"How your name shows up on the screens at your center — \"R. Nadon\", \"RYAN N\", a nickname. Adding these lets a scorecard photo find you instead of asking every time.": "Cómo aparece tu nombre en las pantallas de tu centro de boliche — “R. Nadon”, “RYAN N”, un apodo. Si los agregas, la app podrá encontrarte en la foto de una hoja de puntaje en vez de preguntarte cada vez.",
"e.g. R. Nadon": "p. ej. R. Nadon",
"This is what teammates see when they search for you or view the roster — it defaults to your email prefix until you set it.": "Esto es lo que ven los integrantes de tu equipo cuando te buscan o consultan la lista del equipo — por defecto es la parte de tu correo antes de la @, hasta que lo cambies.",
", backup": ", backup",
"Handedness": "Mano dominante",
"A lefty's corner pin is the 7, not the 10 — this flips the result chips on the Log tab to match.": "Para quien juega con la izquierda, el pino de esquina es el 7, no el 10 — esto invierte los botones de resultado de la pestaña Jugar para que coincidan.",
"Right-handed": "Diestro",
"Left-handed": "Zurdo",
"Strike ball": "Bola de strike",
"A backup ball goes out to the": "Una bola backup sale hacia la",
"and hooks back, so your corner pin is the": "y regresa con gancho, así que tu pino de esquina es el",
"and your pocket is the": "y tu bolsillo es el",
". Turning this on flips every leave, split and lane drawing to match — you are still": ". Activar esto también invierte todos los dibujos de pinos que quedan, de splits y de la pista — para la app sigues jugando con la mano",
"-handed everywhere it says so.": " dondequiera que se indique.",
"I throw a backup ball": "Tiro una bola backup",
"Delivery": "Lanzamiento",
"Two-handed and no-thumb players are who the 2LS drilling layout system is built for.": "El sistema de layout (diseño de perforación) 2LS está pensado para quienes juegan a dos manos o sin pulgar.",
"Two-handed / no thumb": "A dos manos / sin pulgar",
"Drift (boards)": "Desplazamiento (tablas)",
"Boards between where you start and where you slide, counting toward the middle.": "Tablas entre donde empiezas y donde te deslizas, contando hacia el centro.",
"Lateral offset (boards)": "Separación lateral (tablas)",
"How far outside your slide the ball lays down. Usually 4 to 8 one-handed, less two-handed.": "Qué tan afuera de tu deslizamiento se posa la bola. Normalmente de 4 a 8 a una mano, menos a dos manos.",
"Not coaching": "No entrenas",
"Turn this on if you coach other bowlers. It adds a view that shows their tasks and notes instead of your own game.": "Actívalo si entrenas a otros bolichistas. Agrega una vista que muestra sus tareas y notas en lugar de tu propio juego.",
"I bowl": "Yo juego",
"I coach": "Yo entreno",
"Your league": "Tu liga",
"season wrapped up": ": terminó la temporada",
"Not enough games logged here yet to suggest a new number": "Todavía no hay suficientes juegos registrados aquí para sugerir un número nuevo",
". You can still update it yourself below, or skip for now.": ". Aun así puedes actualizarlo tú abajo u omitirlo por ahora.",
"Skip — I'll update it myself": "Omitir — yo lo actualizo",
"Book Average": "Promedio establecido",
"Not set": "Sin definir",
"A static number from last season — the app never changes this on its own. When a league's season ends, you'll be prompted here to update it, with a suggested number you can accept or override.": "Un número fijo de la temporada pasada — la app nunca lo cambia por su cuenta. Cuando termine la temporada de una liga, aquí se te pedirá actualizarlo, con un número sugerido que puedes aceptar o reemplazar.",
"e.g. 213": "p. ej. 213",
"over how many games": "en cuántos juegos",
"Season (e.g. 2025-26 Winter)": "Temporada (p. ej. Invierno 2025-26)",
"Your best ever": "Tus mejores resultados de siempre",
"Including before you started using the app. We'll tell you when you beat them.": "Incluidos los de antes de usar la app. Te avisaremos cuando los superes.",
"Home Centers": "Centros habituales",
"None yet": "Ninguno aún",
"The houses this bowler plays regularly. Looked up so they match the same centers your leagues use.": "Los centros donde juegas con regularidad. Se buscan para que coincidan con los centros que usan tus ligas.",
"+ Add a Center": "+ Agregar un centro",
"Teams & Leagues": "Equipos y ligas",
"Not on a team": "Sin equipo",
"Taken from the roster on the Social tab — change it there and it updates here.": "Tomado de la lista del equipo en la pestaña Amigos — cámbiala ahí y se actualiza aquí.",
"Not on any team yet.": "Aún sin equipo.",
"Add a ball": "Agregar una bola",
"Arsenal": "Arsenal",
"Balls and their drilling layouts.": "Las bolas y sus diseños de perforación.",
"Has a plastic ball ✓": "Tiene bola de plástico ✓",
"Add a plastic ball": "Agregar bola de plástico",
"Could not start checkout. Please try again in a moment.": "No se pudo iniciar el pago. Vuelve a intentarlo en un momento.",
"Could not start checkout.": "No se pudo iniciar el pago.",
"Could not open the subscription manager. Please try again.": "No se pudo abrir la administración de suscripciones. Vuelve a intentarlo.",
"Your payment is pending. Pro unlocks once Google Play finishes processing it.": "Tu pago está pendiente. Pro se desbloquea en cuanto Google Play termine de procesarlo.",
"The purchase wasn't completed. You haven't been charged.": "La compra no se completó. No se te cobró nada.",
"That purchase is already linked to another account.": "Esa compra ya está vinculada a otra cuenta.",
"no ok in response": "",
"Your purchase went through, but we couldn't confirm it just yet. Pro will unlock shortly --": "Tu compra se realizó, pero todavía no pudimos confirmarla. Pro se desbloqueará en breve --",
"reopen the app in a few minutes. You won't be charged twice.": "vuelve a abrir la app en unos minutos. No se te cobrará dos veces.",
"Pick a plan first.": "Primero elige un plan.",
"Something went wrong starting that. Please try again.": "Algo salió mal al iniciar eso. Vuelve a intentarlo.",
"Trip 6": "Tropiezo del 6",
"Kick 7": "Rebote del 7",
"Free fall ·": "Caída libre ·",
"String ·": "Cuerdas ·",
"same": "igual",
"on string": "con cuerdas",
"splits excluded": "sin contar splits",
"Messengers": "Mensajeros",
"share of strikes": "parte de los strikes",
"Splits left": "Splits que quedan",
"share of first balls": "parte de los primeros tiros",
"-pin left": " quedó en pie en el",
"% of first balls": "% de los primeros tiros",
"What's left standing on each. Darker means left more often.": "Lo que queda en pie con cada armadora. Más oscuro significa que queda más seguido.",
"Free fall": "Caída libre",
"String": "Cuerdas",
"Biggest change on string": "Mayor cambio con cuerdas",
"described": "descritos",
"How your strikes carried, from the ones you described.": "Cómo fue el carry de tus strikes, según los que describiste.",
"Numbers": "Números",
"Leaves": "Pinos que quedan",
"Strikes": "Strikes",
"Free Fall vs String": "Caída libre vs. cuerdas",
"Free fall vs string view": "Vista caída libre vs. cuerdas",
"(prefers-reduced-motion: reduce)": "",
", not bowled": ", sin jugar",
"Tap any frame to edit": "Toca cualquier cuadro para editarlo",
"All teams": "Todos los equipos",
"Session History": "Historial de sesiones",
"0 sessions": "0 sesiones",
"Nothing saved yet. Finish a night with \"Save & Finish\" on its Results tab and it lands here.": "Aún no hay nada guardado. Termina una noche con “Guardar y terminar” en su pestaña Resultados y aparecerá aquí.",
"ten pins": "pinos 10",
"% spares": "% spares",
"splits": "splits",
"More": "más",
"avg": "de promedio",
"How It Went 🎳": "Cómo te fue 🎳",
"pins between": "pinos entre",
"pins first to last": "pinos entre el primero y el último",
"Practice Recap": "Resumen de la práctica",
"Best": "Mejor",
"Spread": "Dispersión",
"vs Avg": "vs. prom.",
"Bowling With": "Jugando con",
"Compared on average — you didn't all bowl the same number of games.": "Comparado por promedio — no todos jugaron la misma cantidad de juegos.",
"Drill Recap": "Resumen de ejercicios",
"· may move": "· puede cambiar",
"Head To Head": "Mano a mano",
"You —": "Tú —",
", may move": ", puede cambiar",
"attempts": "intentos",
"Not enough attempts on one side to call a difference.": "No hay suficientes intentos de un lado para hablar de una diferencia.",
"They also worked (nothing of yours to compare against):": "Otras personas también practicaron (sin nada tuyo con qué comparar):",
"Share this": "Compartir",
"Share the night": "Compartir la noche",
"End Open Bowling": "Terminar juego libre",
"Share this practice": "Compartir esta práctica",
"Change tonight's setup": "Cambiar la preparación de hoy",
"Tonight's setup": "Preparación de hoy",
"Collapse": "Contraer",
"Bowling today?": "¿Juegas hoy?",
"Change either answer, then tap Done.": "Cambia cualquiera de las dos respuestas y luego toca Listo.",
"Two quick questions and the app sets itself up for tonight.": "Dos preguntas rápidas y la app se prepara para hoy.",
"You can change this any time.": "Puedes cambiarlo cuando quieras.",
"How much detail?": "¿Cuánto detalle?",
"Tester mode on — Diagnostics is now in Settings.": "Modo de pruebas activado — Diagnóstico ya está en Configuración.",
"Tester mode off.": "Modo de pruebas desactivado.",
"turn off": "desactivar",
"turn on": "activar",
"Other bowlers have a “": "Otras personas también tienen una liga “",
"” too": "”",
"If it's the same league, combine yours with it. Your games and teams move across, and you'll see each other's teams.": "Si es la misma liga, combina la tuya con ella. Tus juegos y equipos pasan a ella, y podrán ver los equipos de ambas partes.",
"No bowling center set": "Sin centro de boliche",
"· you're already in it": "· ya estás en ella",
"Combine": "Combinar",
"” is already here": "” ya existe",
"Is one of these your league? Joining it puts you in the same league as the bowlers already there, so you can find their teams and they can find yours.": "¿Alguna de estas es tu liga? Al unirte, quedas en la misma liga que quienes ya juegan en ella: tú podrás encontrar sus equipos y esas personas podrán encontrar los tuyos.",
"None of these — create mine": "Ninguna de estas — crear la mía",
"Unlock My Bowling Journey Pro": "Desbloquea My Bowling Journey Pro",
"Unlimited leagues, full stats, and more.": "Ligas ilimitadas, estadísticas completas y más.",
"Manage subscription": "Administrar suscripción",
"See Pro": "Ver Pro",
"Sessions": "Sesiones",
"Season": "Temporada",
"Calendar": "Calendario",
"Journal": "Diario",
"Shared": "Compartido",
"Copied to clipboard": "Copiado al portapapeles",
"High Game": "Juego más alto",
"High Series": "Serie más alta",
"200+ Games": "Juegos 200+",
"Net": "Neto",
"Share Summary": "Compartir resumen",
"No sessions yet for this bowler and league.": "Todavía no hay sesiones para esta persona en esta liga.",
"Walkthroughs": "Recorridos guiados",
"Watch any of these again, any time.": "Vuelve a ver cualquiera de estos recorridos cuando quieras.",
"Watch": "Ver",
"App appearance": "Apariencia de la app",
"Each one takes its colour from a different part of the house. Dark ones for a dim centre, light ones for a bright room or daytime.": "Cada tema toma su color de una parte distinta del centro de boliche. Los oscuros, para un centro con poca luz; los claros, para un lugar bien iluminado o de día.",
"Dark": "Oscuros",
"Light": "Delgado",
"Add a league": "Agregar una liga",
"Add a league, rename one, set its center and season dates, or hide one you're not bowling any more.": "Agrega una liga, cámbiale el nombre, indica su centro de boliche y las fechas de la temporada, u oculta una en la que ya no juegues.",
"Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet.": "Agrega la liga en la que juegas y podrás empezar a registrar puntajes de inmediato. Todavía no necesitas un equipo.",
"More leagues": "Más ligas",
"The free plan covers one league. Bowling a second one — a summer league, or Tuesday and Thursday — is part of the paid plan. Nothing you have already logged goes anywhere.": "El plan gratis incluye una liga. Jugar en una segunda — una liga de verano, o martes y jueves — es parte del plan de pago. Nada de lo que ya registraste se pierde.",
"League name, e.g. Tuesday Night Mixed": "Liga, p. ej. Mixta del martes",
"Rename": "Renombrar",
"Date range (optional)": "Rango de fechas (opcional)",
"Season dates": "Fechas de la temporada",
"Nine on the first ball counts as a strike. Those are kept separate from your regular strike percentage, but still count toward how your ball carries.": "Nueve pinos en el primer tiro cuentan como strike. Esos strikes se cuentan aparte de tu porcentaje de strikes normal, pero sí cuentan para medir cuánto derriba tu bola.",
"Usual lane condition": "Condición habitual de la pista",
"Used for any night you don't record a pattern for. Leave the name blank if this league rotates.": "Se usa para cualquier noche en la que no registres un patrón. Deja el nombre en blanco si el patrón de esta liga va cambiando.",
"Hidden — show again": "Oculta — mostrar de nuevo",
"Hide this league": "Ocultar esta liga",
"Won't appear when logging. Past scores still count toward your averages.": "No aparecerá al registrar. Los puntajes anteriores siguen contando para tus promedios.",
"Add weekly reminder": "Agregar recordatorio semanal",
"team": "equipo",
"in this league": "en esta liga",
"· yours": "· el tuyo",
"Asked": "Solicitud enviada",
"Ask to join": "Pedir unirme",
"Leave team": "Salir",
"More teams": "Más equipos",
"The free plan covers one team. Your scores keep counting for the team you are already on.": "El plan gratis incluye un equipo. Tus puntajes siguen contando para el equipo en el que ya estás.",
"Add a team": "Agregar un equipo",
"Your scores in this league will join it — including nights you have already logged.": "Tus puntajes en esta liga se asociarán a ese equipo — incluidas las noches que ya registraste.",
"Add a team to this league": "Agregar un equipo a esta liga",
"Leagues": "Ligas",
"Shown": "Visible",
"Hidden": "No visible",
"Poker, 3-6-9, and High Game Pot tracking cards on the Log and Data tabs.": "Tarjetas para llevar el póker, el 3-6-9 y el bote del juego más alto en las pestañas Jugar y Stats.",
"Which pots does your house run?": "¿Qué botes hay en tu centro de boliche?",
"Export": "Exportar",
"Your data, as spreadsheets. Sessions is one row per night; shots is one row per delivery.": "Tus datos, en hojas de cálculo. Sesiones tiene una fila por noche; tiros, una fila por lanzamiento.",
"Sessions CSV": "CSV sesiones",
"Shots CSV": "CSV tiros",
"Import scores": "Importar puntajes",
"Backup & Restore": "Respaldo y restauración",
"No data yet": "Aún no hay datos",
"Save a copy of everything — shots, sessions, bowlers, arsenals, and match results — so your season is safe no matter what. If you ever open this app and your history looks empty, restore it here.": "Guarda una copia de todo — tiros, sesiones, jugadores, arsenales y resultados de los matches — para que tu temporada esté a salvo pase lo que pase. Si algún día abres esta app y tu historial se ve vacío, restáuralo aquí.",
"Open Backup & Restore": "Abrir Respaldo y restauración",
"Backup downloaded.": "Respaldo descargado.",
"Download Backup": "Descargar respaldo",
"If the download doesn't work in this environment, copy the text below instead and save it somewhere safe.": "Si la descarga no funciona en este entorno, mejor copia el texto de abajo y guárdalo en un lugar seguro.",
"To restore, paste a backup below and tap Restore. This adds anything missing — it won't erase what's already here.": "Para restaurar, pega un respaldo abajo y toca Restaurar. Esto agrega todo lo que falta — no borra lo que ya está aquí.",
"Paste backup JSON here…": "Pega aquí el JSON del respaldo…",
"Restore This Backup": "Restaurar este respaldo",
"Refresh from the Cloud": "Actualizar desde la nube",
"Use this if something you know you bowled is missing here": "Usa esto si falta aquí algo que sabes que jugaste",
"— a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "— una noche que no aparece, puntajes que registraste en otro celular o estadísticas que dejaron de moverse aunque sigues jugando.",
"To open fast, this app normally downloads only what has changed since it last checked. Once in a while a phone can lose its place and stop asking for something — usually after bowling somewhere with no signal, or when the same account is used on two devices. Your shots are safe in the cloud the whole time; this phone just is not asking for them.": "Para abrir rápido, esta app normalmente descarga solo lo que cambió desde la última vez que revisó. De vez en cuando, un celular puede perder el hilo y dejar de pedir algo — casi siempre después de jugar en un lugar sin señal, o cuando se usa la misma cuenta en dos dispositivos. Tus tiros están a salvo en la nube todo el tiempo; simplemente este celular no los está pidiendo.",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app.": "Esto envía todo lo que sigue pendiente de guardar, luego vuelve a descargar todo tu historial desde cero y recarga la app.",
"Nothing is deleted": "No se borra nada",
", and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": ", y nada de lo que registraste se puede perder. Usa más datos que una apertura normal y puede tardar unos momentos si la temporada es larga, así que conviene usar Wi-Fi.",
"change": "cambio",
"still waiting to save.": "pendiente de guardar.",
"It": "Este cambio",
"will be sent first.": "se enviará primero.",
"Refreshing…": "Actualizando…",
"Account": "Cuenta",
"Signed in": "Sesión iniciada",
"Signed in as": "Sesión iniciada como",
"this device": "este dispositivo",
"Sign out of this account?": "¿Cerrar sesión en esta cuenta?",
"Could not sign out. Check your connection and try again.": "No se pudo cerrar sesión. Revisa tu conexión e inténtalo de nuevo.",
"Sign out": "Cerrar sesión",
"About & Legal": "Acerca de y legal",
"Privacy Policy": "Política de privacidad",
"Terms of Service": "Términos del servicio",
"Delete your account": "Eliminar tu cuenta",
"Questions, or want your data deleted?": "¿Tienes preguntas o quieres que borremos tus datos?",
"support@mybowlingjourney.com": "support@mybowlingjourney.com",
"is published by My Bowling Journey LLC.": "es una app de My Bowling Journey LLC.",
"Web version": "Versión web",
"Diagnostics": "Diagnóstico",
"Nothing logged": "Nada registrado",
"What went wrong on this phone, and why — failed saves, sync errors, imports that fell back. Copy it and paste it to whoever asked.": "Lo que falló en este celular, y por qué — guardados fallidos, errores de sincronización, importaciones que recurrieron al método alternativo. Cópialo y pégalo en un mensaje para quien te lo pidió.",
"Copied": "Copiado",
"Couldn't copy on this device": "No se pudo copiar en este dispositivo",
"Copy log": "Copiar registro",
"Tester mode. Tap the \"published by\" line in About & Legal seven times to turn it off.": "Modo de pruebas. Toca siete veces la línea “es una app de” en Acerca de y legal para desactivarlo.",
"Danger Zone": "Zona de peligro",
"Clear All Data": "Borrar todos los datos",
"Removes your bowling history including your shots, match results and lane notes. Your account, profile, arsenal and teams are unaffected.": "Borra tu historial de boliche, incluidos tus tiros, los resultados de tus matches y tus notas de pista. Tu cuenta, tu perfil, tu arsenal y tus equipos no se modifican.",
"This deletes every logged shot, session, match result (opponents, handicaps, win/loss), and lane condition note. This can't be undone. Consider downloading a backup above first.": "Esto borra cada tiro registrado, cada sesión, cada resultado de match (rivales, hándicaps, victorias/derrotas) y cada nota sobre la condición de la pista. No se puede deshacer. Considera descargar primero un respaldo con la opción de arriba.",
"Yes, Delete Everything": "Sí, borrar todo",
"Delete My Account": "Eliminar mi cuenta",
"Removes your account and everything in it, permanently.": "Elimina tu cuenta y todo lo que contiene, de forma permanente.",
"This deletes your account and": "Esto elimina tu cuenta y",
"everything attached to it": "todo lo vinculado a ella",
"— every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "— cada tiro y cada sesión, tu perfil y tu nombre, tu arsenal, tus objetivos y tu lugar en cualquier equipo. No podrás volver a iniciar sesión y no podremos recuperarla.",
"Leagues and teams you created are kept only if other bowlers are still using them, so nobody loses a league they're bowling in. Any that nobody else is in go with everything else.": "Las ligas y los equipos que creaste se conservan solo si otras personas todavía los usan, para que nadie pierda una liga en la que está jugando. Los que no tengan a nadie más se eliminan junto con todo lo demás.",
"Want a copy first? Use": "¿Quieres una copia primero? Usa",
"above before you do this.": "arriba antes de continuar.",
"to confirm": "para confirmar",
"Couldn't delete the account.": "No se pudo eliminar la cuenta.",
"Deleting…": "Eliminando…",
"Permanently Delete": "Eliminar definitivamente",
"Test account — everything unlocked": "Cuenta de prueba — todo desbloqueado",
"Ending — you keep Pro until the period you paid for runs out": "Por terminar — conservas Pro hasta que se acabe el periodo que pagaste",
"There's a problem with your payment method": "Hay un problema con tu método de pago",
"You're subscribed": "Suscripción activa",
"Share": "Compartir",
"Trend": "Tendencia",
"Preparing…": "Preparando…",
"Copied — paste it anywhere": "Copiado — pégalo donde quieras",
"Couldn't share on this device": "No se pudo compartir en este dispositivo",
"Share card": "Tarjeta para compartir",
"Press and hold the card to save or share it.": "Mantén presionada la tarjeta para guardarla o compartirla.",
"Copy text": "Copiar texto",
"Wrong email or password.": "Correo o contraseña incorrectos.",
"Couldn't sign in.": "No se pudo iniciar sesión.",
"Couldn't send the code. Try again.": "No se pudo enviar el código. Intenta de nuevo.",
"That code didn't work. Check it, or send a new one.": "Ese código no funcionó. Revísalo o pide uno nuevo.",
"Couldn't verify that code.": "No se pudo verificar ese código.",
"Sign in to log your own games and see the team's stats.": "Inicia sesión para registrar tus propios juegos y ver las estadísticas del equipo.",
"Email": "Correo",
"Password": "Contraseña",
"Signing in…": "Iniciando sesión…",
"Sign In": "Iniciar sesión",
"Check your email": "Revisa tu correo",
"We sent a": "Te enviamos un código de",
"-digit code to": " dígitos a",
"The same email has a sign-in link in it, if you'd rather tap that.": "Ese mismo correo trae un enlace para iniciar sesión, si prefieres tocarlo.",
"The code lasts an hour.": "El código es válido por una hora.",
"Use a different email": "Usar otro correo",
"Opening Google…": "Abriendo Google…",
"Continue with Google": "Continuar con Google",
"or": "o",
"Sending…": "Enviando…",
"Email Me a Code": "Enviarme un código",
"No password needed — we'll email you a code.": "No necesitas contraseña — te enviaremos un código por correo.",
"Knockdown": "Derribo",
"Pick a league above": "Elige una liga arriba",
"Nothing to count yet": "Aún no hay nada que contar",
"Log a few frames and this fills in — strike rate, spares, ten pins, and how each ball is carrying.": "Registra algunos cuadros y esto se llenará — porcentaje de strikes, spares, pinos 10 y cuánto derriba cada bola.",
"Viewing": "Viendo",
"(you)": "(tú)",
"Teams": "Equipos",
"Compare To": "Comparar con",
"Nobody to compare against yet. Add a friend, or set up your team — teammates are added as friends automatically.": "Aún no hay con quién compararte. Agrega a un amigo o configura tu equipo — los integrantes de tu equipo se agregan automáticamente como amigos.",
"Manage friends": "Administrar amigos",
"Add a friend": "Agregar amigo",
"Clean Frame %": "% de cuadros limpios",
"Split Rate": "Porcentaje de splits",
"10-Pin Spare %": "% de spares del pino 10",
"Single-Pin Spare %": "% de spares de un pino",
"First-Ball Avg": "Prom. primer tiro",
"Leave Avg": "Prom. sin strike",
"Head-to-Head": "Mano a mano",
"Every rate stat side by side against": "Cada estadística de porcentaje lado a lado frente a",
", instead of hunting through separate cards. Split Rate is the one metric here where lower is better.": ", sin tener que buscar en tarjetas separadas. El porcentaje de splits es la única métrica aquí en la que menos es mejor.",
"Team Records": "Récords del equipo",
"to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.": "para ver esto — el juego y la serie más altos requieren una lista del equipo específica, ya que combinar equipos de distinto tamaño favorecería injustamente al que tenga más integrantes.",
"Season record": "Récord de la temporada",
"points won": "puntos ganados",
"points (": "puntos (",
"games,": "en juegos,",
"pinfall)": "en total de pinos)",
"Weekly Points": "Puntos por semana",
"Points won each week, out of 4 — Season Record only shows the running total, never when those points actually came. Shows momentum: a hot streak or a slump.": "Puntos ganados cada semana, de 4 posibles — “Récord de la temporada” solo muestra el total acumulado, nunca cuándo llegaron esos puntos. Muestra el impulso: una buena racha o un bache.",
"Points won": "Puntos ganados",
"Handicap Impact": "Impacto del hándicap",
"to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.": "para ver esto — “el equipo” tiene que ser una lista específica, no los matches de varias ligas mezclados.",
"Points-won rate split by handicap size — shows whether the team does better closer to scratch or with a bigger handicap cushion.": "Porcentaje de puntos ganados según el tamaño del hándicap — muestra si al equipo le va mejor más cerca de scratch o con un colchón de hándicap más grande.",
"Points won %": "% de puntos ganados",
"Team Leaderboard": "Clasificación del equipo",
"% stk": "% strikes",
"Giant Killer": "Matagigantes",
"to see this — it needs a specific roster to know who's on top.": "para ver esto — se necesita una lista específica para saber quién va a la cabeza.",
"No comparisons yet — the first week just sets the baseline average for everyone. Once a second week is logged, that week's giant (whoever had the best average entering it) gets challenged and this fills in.": "Todavía no hay comparaciones — la primera semana solo establece el promedio base de todos. En cuanto se registre una segunda semana, se reta al gigante de esa semana (quien tenía el mejor promedio al empezarla) y esto se llena.",
"% of games each bowler beat that week's reigning giant, game-by-game — the giant is whoever had the highest average entering that week, based only on weeks before it (never that week's own results). The very first week ever logged sets the baseline with no giant to challenge yet; the hunt starts week two. Locked in per week — if the title changes hands later, earlier weeks stay compared against whoever actually held it at the time. \"Weeks on top\" counts how many weeks they themselves held the title.": "% de juegos en que cada integrante le ganó al gigante reinante de esa semana, juego por juego — el gigante es quien tenía el promedio más alto al empezar esa semana, calculado solo con las semanas anteriores (nunca con los resultados de esa misma semana). La primerísima semana registrada establece la base, sin gigante que retar todavía; la cacería empieza en la semana dos. Queda fijo semana por semana — si el título cambia de manos después, las semanas anteriores se siguen comparando con quien realmente lo tenía en ese momento. “Semanas a la cabeza” cuenta cuántas semanas esa persona tuvo el título.",
"wk": "sem.",
"on top": "a la cabeza",
"games": "juegos",
"🎣 Hung": "🎣 Dejado colgado",
"to see this — it needs a specific roster to know who else was bowling that frame.": "para ver esto — se necesita una lista específica para saber quién más estaba jugando ese cuadro.",
"Nobody's been hung yet — every strike in this data has had at least one teammate join in, or company on the miss.": "Nadie se ha quedado colgado todavía — en estos datos, cada strike tuvo al menos otro integrante del equipo que se sumó, o el fallo tuvo compañía.",
"Every teammate struck that frame except them. The wall of shame.": "Todo el equipo hizo strike en ese cuadro, menos esa persona. El muro de la vergüenza.",
"Team Series": "Series del equipo",
"Team Total": "Total del equipo",
"Tu": "Mar",
"Th": "Jue",
"Clean frames": "Cuadros limpios",
"of frames closed out": "de cuadros cerrados",
"Frame Position": "Posición del cuadro",
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where": "Desglosado por número de cuadro, no por juego — muestra si hay un momento específico en cada noche (calentamiento, transición de la pista, el despiste del cuadro 9 por sacar cuentas del puntaje) donde",
"tends to leave pins, regardless of which game it is.": "tiende a dejar pinos, sin importar qué juego sea.",
"Weighted quality score, strict priority order: strike beats every spare, a non-split spare beats every split spare, and within each of those a leave with fewer pins standing scores higher — an open frame always scores lowest, ranked by total pinfall.": "Puntaje de calidad ponderado, en estricto orden de prioridad: un strike supera a cualquier spare, un spare sin split supera a cualquier spare de split, y dentro de cada grupo, dejar menos pinos en pie da más puntaje — un cuadro abierto siempre tiene el puntaje más bajo, ordenado por total de pinos derribados.",
"⚠️ Only": "⚠️ Solo",
"logged — each frame number needs at least": "en total — cada número de cuadro necesita al menos",
"to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.": "para distinguir un patrón real del ruido. Hasta entonces, tómalo como un adelanto, no como una conclusión.",
"Weakest": "Más débil",
"Strongest": "Más fuerte",
"Weakest:": "Más débil:",
") · Strongest:": ") · Más fuerte:",
"Every frame is even on this metric — no standout weak spot.": "Todos los cuadros están parejos en esta medida — ningún punto débil destaca.",
"First-Ball Average": "Promedio del primer tiro",
"Average pins on every fresh-rack delivery — every frame's first ball, plus any 10th-frame bonus ball thrown at a full reset rack — strikes counted as 10. The standard metric, comparable to LaneTalk and other scoring apps.": "Promedio de pinos en cada tiro con los 10 pinos en pie — el primer tiro de cada cuadro, más cualquier tiro extra del cuadro 10 lanzado con los 10 pinos otra vez en pie — los strikes cuentan como 10. La medida estándar, comparable con LaneTalk y otras apps de puntaje.",
"pins per fresh rack": "pinos por tiro con los 10 en pie",
"vs": "vs.",
"Leave Average": "Promedio sin strike",
"Same fresh-rack deliveries, but only the ones that weren't a strike — isolates how good the leave is on a miss, separate from strike rate.": "Los mismos tiros con los 10 pinos en pie, pero solo los que no fueron strike — aísla qué tan buenos son los pinos que quedan cuando no hay strike, aparte del porcentaje de strikes.",
"pins when you don't strike": "pinos cuando no haces strike",
"Ten pins": "Pino 10",
"of your ten pins converted": "de tus pinos 10 convertidos",
"Ten-pin leave rate": "Frecuencia del pino 10",
"Single pin spares": "Spares de un pino",
"of splits converted": "de splits convertidos",
"Split rate": "% de splits",
"✋ Hand Up": "✋ Mano arriba",
"to see who owes a round.": "para ver quién debe una ronda.",
"Nobody's missed a lone 5 yet. Hands stay down.": "Nadie ha fallado un 5 solo todavía. Las manos siguen abajo.",
"Lone 5-pins missed. Each one owes a drink to everyone with a hand up.": "5 solos fallados. Cada uno cuesta un trago para todos los que tengan la mano arriba.",
"Bowler": "Nombre",
"5s missed": "5 fallados",
"Non-Split Leaves": "Pinos que quedan sin split",
"Every recurring leave that isn't a split — how often it happens and how often it gets converted.": "Cada combinación de pinos que se repite y no es split — qué tan seguido pasa y qué tan seguido se convierte.",
"Longest strike streak": "Racha más larga de strikes",
"in a row": "seguidos",
"Consecutive strikes, carrying across games within the same night.": "Strikes consecutivos, contando de un juego a otro dentro de la misma noche.",
"By Ball": "Por bola",
"Miss Distribution": "Distribución de fallos",
"Ball Change Triggers": "Motivos de cambio de bola",
"Strike Quality": "Calidad del strike",
"Top number is the average bowler's score. \"Team\" below it is what the whole team scores together that game.": "El número de arriba es el puntaje promedio por integrante. “Equipo”, abajo, es lo que todo el equipo suma junto en ese juego.",
"Combined spans all leagues, so there's no single team to compare it against — pick a specific bowler under \"Compare To\", or select a specific league above.": "La vista combinada abarca todas las ligas, así que no hay un solo equipo con el cual compararla — elige a una persona específica en “Comparar con” o selecciona una liga específica arriba.",
"Theoretical Average": "Promedio teórico",
"What the average would be if every makeable spare (not a split, not a washout) had been made — including a theoretical 10th-frame fill ball, estimated from each game's own recent first-ball average at that point.": "Cuál sería el promedio si se hubieran convertido todos los spares posibles (ni splits ni “washouts”) — incluido un tiro extra teórico en el cuadro 10, estimado con el promedio reciente del primer tiro de cada juego en ese momento.",
"if you'd made every makeable spare": "si hubieras convertido cada spare posible",
"This Season vs Last": "Esta temporada vs. la anterior",
"Level": "Sin cambio",
"Progress to Next Milestone": "Progreso al próximo hito",
"Tracked in 5-pin steps": "Medido en pasos de 5 pinos",
"— the team's average bowler": "— promedio por integrante del equipo",
"% to": "% del camino a",
"Next Session (": "Próxima noche (",
"Games)": "juegos)",
"You're averaging": "Llevas un promedio de",
"across": "en",
"games. Here's what the next set does to it.": "juegos. Así puede cambiar con la próxima serie.",
"Gaining a full point isn't reachable in one set at this average.": "Con este promedio, no puedes subir un punto completo en una sola serie.",
"No set this session can drop the average a full point.": "Ninguna serie de esta noche puede bajar el promedio un punto completo.",
"Score Consistency": "Constancia de puntajes",
"How steady their game scores are night to night, independent of the average itself. Lower is steadier.": "Qué tan estables son sus puntajes por juego de una noche a otra, sin importar el promedio en sí. Mientras más bajo, más estable.",
"How steady the team's combined game totals are night to night — not each bowler's individual scores. Lower is steadier.": "Qué tan estables son los totales combinados del equipo por juego de una noche a otra — no los puntajes individuales de cada integrante. Mientras más bajo, más estable.",
"pins either side of your average": "pinos arriba o abajo de tu promedio",
"team games": "juegos de equipo",
"Score Distribution": "Distribución de puntajes",
"The actual shape behind the std. dev. above — tightly bunched around the average, or a long tail of bad nights dragging it down.": "La forma real detrás de la desviación estándar de arriba — puntajes bien agrupados alrededor del promedio, o una larga cola de malas noches que lo jala hacia abajo.",
"Game-by-Game Averages": "Promedios juego por juego",
"Composite average at each position in the night, across the whole season — shows whether": "Promedio compuesto en cada posición de la noche, en toda la temporada — muestra si",
"the team is": "el equipo rinde",
"bowling better early, middle, or late.": "mejor al principio, a la mitad o al final de la noche.",
"\"Team\" is what the whole team scores together at that position.": "“Equipo” es lo que todo el equipo suma junto en esa posición.",
"Team:": "Equipo:",
"Poker": "Póker",
"High Game Pot": "Bote del juego más alto",
"Team Side Games": "Juegos extra del equipo",
"Season totals across every side game — what came in, what it cost to play, and what actually stuck.": "Totales de la temporada en todos los juegos extra — lo que entró, lo que costó jugar y lo que de verdad quedó.",
"won this season": "ganados esta temporada",
"By Game": "Por juego",
"Buy-in": "Entrada",
"Won": "Ganado",
"3-6-9 Tracker": "Seguimiento 3-6-9",
"Strike frames 3, 6, and 9 of every game (games 1, 2, and 3 -- all 9 strikes) to win the pot for the night. Also throw a full turkey in game 3's 10th frame to additionally earn the jackpot.": "Haz strike en los cuadros 3, 6 y 9 de cada juego (juegos 1, 2 y 3 — los 9 strikes) para ganar el bote de la noche. Además, tira un turkey completo en el décimo cuadro del juego 3 para ganar también el acumulado.",
"won on 3-6-9": "ganados en el 3-6-9",
"By Bowling Center": "Por centro de boliche",
"How you score house to house. Only leagues with a center set are included — set them under Team.": "Cómo te va de un centro a otro. Solo se incluyen las ligas que tienen un centro asignado — asígnalo en Equipo.",
"Comparison": "Comparación",
"Comparing two things — bowlers, balls, houses, patterns or seasons — is part of the paid plan. Everything about your own game stays free.": "Comparar dos cosas — jugadores, bolas, centros, patrones o temporadas — es parte del plan de pago. Todo lo de tu propio juego sigue gratis.",
"this card": "esta tarjeta",
"Not yet": "Aún no",
"Unhide Stat Cards (": "Mostrar tarjetas ocultas (",
"Something went wrong.": "Algo salió mal.",
"You're on Pro": "Ya tienes Pro",
"Thanks for subscribing. Everything is unlocked.": "Gracias por suscribirte. Todo está desbloqueado.",
"Manage or cancel any time in the Play Store app, under Subscriptions.": "Administra o cancela cuando quieras en la app de Play Store, en Suscripciones.",
"Your subscription is ending": "Tu suscripción está por terminar",
"You are subscribed": "Tu suscripción está activa",
"when the period you paid for runs out": "cuando se acabe el periodo que pagaste",
"Everything is unlocked.": "Todo está desbloqueado.",
"Manage or cancel your subscription in the Play Store app, under Subscriptions.": "Administra o cancela tu suscripción en la app de Play Store, en Suscripciones.",
"Opening…": "Abriendo…",
"Resume subscription": "Reanudar suscripción",
"Test account.": "Cuenta de prueba.",
"Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "Todo ya está desbloqueado para ti, sin importar la facturación. Aun así puedes comprar abajo para probar el pago.",
"Your scores, spares and ball numbers stay free, always. Pro is for the comparisons — and for the parts that think about your night for you.": "Tus puntajes, tus spares y los números de tus bolas siguen gratis, siempre. Pro es para las comparaciones — y para las partes que analizan tu noche por ti.",
"Every league and team you bowl in": "Todas las ligas y equipos en los que juegas",
"(free keeps": "(la versión gratis incluye",
"Ball against ball, house against house, pattern against pattern": "Bola contra bola, centro contra centro, patrón contra patrón",
"Head to head with friends and teammates": "Mano a mano con tus amigos y compañeros de equipo",
"This season against last": "Esta temporada contra la anterior",
"Nightcap, Insights, Brooklyn, the Caddie and coaching": "Nightcap, Análisis, Brooklyn, el Caddie y Entrenador",
"Scorecard import": "Importación de hojas de puntaje",
"Choose a plan": "Elige un plan",
"Yearly ·": "Anual ·",
"Monthly ·": "Mensual ·",
"Your": "Tu prueba gratis de",
"-day free trial starts today. When it ends, the": " días empieza hoy. Cuando termine, el plan",
"plan starts at": "empieza a cobrarse a",
"and renews on its own until you cancel.": "y se renueva automáticamente hasta que lo canceles.",
"The": "El plan",
"plan is": "cuesta",
". Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": ". Google Play te muestra si aplica una prueba gratis a tu cuenta antes de que confirmes, y luego el plan se renueva solo hasta que lo canceles.",
"You have already had the free trial, so the": "Ya usaste la prueba gratis, así que el plan",
"plan starts today at": "empieza hoy con un precio de",
"Cancel any time": "Cancela cuando quieras",
"in the Play Store app under Subscriptions": "en la app de Play Store, en Suscripciones",
"from the link in your receipt": "desde el enlace de tu recibo",
"— you keep Pro until the end of the period you have paid for.": "— conservas Pro hasta que termine el periodo que pagaste.",
"If you stop, nothing you have logged is deleted. One league stays active and the rest are paused until you come back.": "Si cancelas, no se borra nada de lo que registraste. Una liga sigue activa y las demás quedan en pausa hasta que regreses.",
"Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.": "",
"Create a .env file at the project root — see supabaseClient.js for the format.": "",
"(no match)": "",
"Tuesday House Shot": "Tuesday House Shot",
"Thursday House Shot": "Patrón de casa del jueves",
"Too many tries. Wait a little and try again.": "Demasiados intentos. Espera un poco e inténtalo de nuevo.",
"Couldn't join just now. Check your connection and try again.": "No fue posible unirte en este momento. Revisa tu conexión e inténtalo de nuevo.",
"That code didn't match a team. Check it with whoever sent it.": "Ese código no coincide con ningún equipo. Confírmalo con quien te lo envió.",
"Couldn't do that just now. It may already have been answered — pull down to refresh.": "No se pudo hacer en este momento. Puede que ya se haya respondido — desliza hacia abajo para actualizar.",
"Couldn't send that just now. Check your connection and try again.": "No se pudo enviar en este momento. Revisa tu conexión e inténtalo de nuevo.",
"Make a new code? The old one stops working, so anyone you sent it to will need the new one.": "¿Crear un código nuevo? El anterior dejará de funcionar, así que quien lo haya recibido necesitará el nuevo.",
"There's already a pending invite for that email on this team.": "Ya hay una invitación pendiente para ese correo en este equipo.",
"Add an email, or tick “I don’t have their email” to get a code you can text them. Either way they need a way to claim this spot themselves.": "Agrega un correo o elige la opción de enviarle un código por mensaje de texto. De cualquier forma, la persona necesita una manera de reclamar este lugar por su cuenta.",
"That doesn't look like an email address.": "Eso no parece una dirección de correo.",
"Loading teams…": "Cargando equipos…",
"Couldn't load your teams. You may be offline.": "No se pudieron cargar tus equipos. Puede que no tengas conexión.",
"Waiting to join your team": "Solicitudes para unirse a tu equipo",
"wants to join": "quiere unirse a",
"+ Add team": "+ Agregar equipo",
"A team belongs to a league. Add your league on the League tab first, then come back here.": "Un equipo pertenece a una liga. Primero agrega tu liga en la pestaña Liga y luego regresa aquí.",
"OK": "OK",
"New team": "Nuevo equipo",
"Pick the league this team bowls in": "Elige la liga en la que juega este equipo",
"Team name": "Nombre del equipo",
"e.g. Split Happens": "p. ej. Puro Strike",
"Create team": "Crear equipo",
"Join a team": "Unirte a un equipo",
"You're invited to": "Te invitaron a",
"Got a team code from a teammate? Enter it here.": "¿Alguien de tu equipo te dio un código? Escríbelo aquí.",
"ABCD-1234": "ABCD-1234",
"No code? Find your team in your league and ask to join. Anyone on the team can approve you.": "¿No tienes código? Busca tu equipo en tu liga y pide unirte. Cualquier integrante del equipo puede aprobarte.",
"Pick a league": "Elige una liga",
"Looking…": "Buscando…",
"No teams in this league yet. You can make one with Add team.": "Todavía no hay equipos en esta liga. Puedes crear uno con “Agregar equipo”.",
"Your team": "Tu equipo",
"Asked to join": "Pediste unirte a",
"— waiting for someone on the team to approve.": "— falta que alguien del equipo te apruebe.",
"Withdraw": "Cancelar",
"No teams yet. Tap Add team, or add one under a league on the League tab.": "Todavía no hay equipos. Toca “Agregar equipo” o agrega uno dentro de una liga en la pestaña Liga.",
"Team Name": "Nombre del equipo",
"Team code — text it to teammates so they can join": "Código del equipo — mándalo por mensaje a tus compañeros para que se unan",
"Copy": "Copiar",
"Make a new code; the old one stops working": "Crear un código nuevo; el anterior dejará de funcionar",
"New": "Nuevo",
"Roster / Bowling Order": "Lista del equipo / orden de tiro",
"Just you so far — add teammates below, or leave it and come back to it. Your scores count either way.": "Por ahora solo estás tú — agrega a tus compañeros de equipo abajo, o déjalo para después. Tus puntajes cuentan de todos modos.",
"Bowling hand — tap to switch": "Mano de tiro — toca para cambiar",
"Sub — tap to toggle": "Suplente — toca para activar o desactivar",
"Sub ✓": "Supl. ✓",
"Sub": "Supl.",
"invited · not signed in yet": "invitación enviada · aún no inicia sesión",
"placeholder · no email on file": "lugar reservado · sin correo registrado",
"— invited, waiting for them to accept": "— invitación enviada, falta que la acepte",
"Add Someone Not Signed Up Yet": "Agregar a alguien que aún no tiene cuenta",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with their email, they're linked the moment they sign in with that exact address; with a code, you get one to text them and they enter it when they sign up.": "Reserva su lugar en la lista del equipo desde ahora — puedes empezar a registrar sus puntajes con su nombre de inmediato desde “Anotando puntaje de”, sin que necesite una cuenta todavía. De cualquier forma, es la propia persona quien reclama el lugar, y todo lo que hayas registrado ya estará ahí: con su correo, queda vinculada en cuanto inicie sesión con esa misma dirección; con un código, recibes uno para mandárselo por mensaje y lo ingresa al registrarse.",
"Their name": "Su nombre",
"I have their email": "Tengo su correo",
"Text them a code": "Mandarle un código",
"Their email": "Su correo",
"They will get a code to enter when they sign up. It links them to this spot the same way an email invite does.": "Esa persona recibirá un código para ingresar al registrarse. El código la vincula a este lugar igual que una invitación por correo.",
"Add to Roster": "Agregar a la lista",
"Skip": "Omitir",
"Start bowling": "Empezar a jugar",
"Next": "Siguiente",
"Your history:": "Tu historial:",
"avg over": "de promedio en",
"Low": "Mín.",
"Untitled": "Sin título",
"no date": "sin fecha",
"· made cut": "· pasaste el corte",
"· missed cut": "· no pasaste el corte",
"Oil Pattern": "Patrón de aceite",
"e.g. Krypton, or type your own": "p. ej. Krypton, o escribe el tuyo",
"+ Save \"": "+ Guardar “",
"\" for next time": "” para la próxima",
"Length, ratio, and volume are optional — fill in whatever you know.": "La longitud, la proporción y el volumen son opcionales — completa lo que sepas.",
"Feet": "Pies",
"Ratio e.g. 3:1": "Proporción p. ej. 3:1",
"Squad Details": "Detalles del turno",
"Remove Day": "Quitar día",
"Start Time": "Hora de inicio",
"Squad": "Turno",
"e.g. A": "p. ej. A",
"Block #": "N.º de bloque",
"e.g. 2": "p. ej. 2",
"Go to scoring": "Ir a anotar",
"Pins vs 200 avg": "Pinos vs. prom. de 200",
"(all blocks so far)": "(todos los bloques hasta ahora)",
"Go to": "Ir a",
"match play": "match play",
"the stepladder": "la final escalonada",
"This block": "Los cuadros de este bloque",
"s frames are logged under": "están registrados con fecha",
", not": ", no",
"Move them to": "Moverlos a",
"+ Game": "+ Juego",
"Tournaments usually move pairs after every game, so each game gets its own.": "En los torneos normalmente se cambia de par de pistas después de cada juego, así que cada juego tiene el suyo.",
"Pair": "Pistas",
"Day Notes": "Notas del día",
"Transition, ball reaction, what worked…": "Transición, reacción de la bola, lo que funcionó…",
"Brackets & Side Pots": "Brackets y botes",
"Tracked separately from the main entry, so you can see which of these actually pay for themselves.": "Se registran aparte de la entrada principal, para que veas cuáles de verdad se pagan solos.",
"Label (optional)": "Nombre (opcional)",
"Entries": "Entradas",
"$ Each": "$ c/u",
"Cost $": "Costo $",
"won in brackets": "ganado en brackets",
"The head-to-head block after the cut. Bonus pins vary by tournament — set them to whatever this event uses.": "El bloque mano a mano después del corte. Los pinos de bono varían según el torneo — pon los que use este evento.",
"Date bowled": "Fecha de juego",
"Bonus per win": "Bono por victoria",
"Bonus per tie": "Bono por empate",
"Match": "Match",
"by": "por",
"Track frames": "Registrar cuadros",
"Opp hcp": "Hcp rival",
"+ Add Match": "+ Agregar match",
"Go to the stepladder": "Ir a la final escalonada",
"Sudden death, no bonus pins. Enter the seeds and the app works out where you finished.": "Muerte súbita, sin pinos de bono. Ingresa los sembrados y la app calcula en qué lugar terminaste.",
"e.g. 3": "p. ej. 3",
"Step": "Escalón",
"+ Add Step": "+ Agregar escalón",
"Steps": "Escalones",
"nothing further": "ninguna",
"How it went": "Cómo te fue",
"With handicap": "Con hándicap",
"Block": "Bloque",
"average over": "de promedio en",
"Bonus": "Bono",
"pins vs opponents": "pinos frente a los rivales",
"Best: match": "Mejor: match",
"Worst: match": "Peor: match",
"On to": "Siguiente fase:",
"Share this tournament": "Compartir este torneo",
"is saved to your history. Bowling another block of it, or starting a new tournament?": "ya está guardado en tu historial. ¿Vas a jugar otro bloque o a empezar un torneo nuevo?",
"Another block": "Otro bloque",
"New tournament": "Torneo nuevo",
"e.g. Spring Masters": "p. ej. Masters de primavera",
"e.g. Bowlero Pittsburgh": "p. ej. Bowlero Pittsburgh",
"Handicap per game": "Hándicap por juego",
"e.g. 40": "p. ej. 40",
"Bowling with": "Juegas con",
"Partner's name": "Nombre de tu pareja",
"Who bowls frame 1": "Quién tira el cuadro 1",
"You bowl frames": "Tú tiras los cuadros",
"every game": "en cada juego",
"in game 1, then you swap each game": "en el juego 1, y luego alternan en cada juego",
". The score stays out of your average since you did not bowl it alone, but your own frames still count.": ". El puntaje no cuenta para tu promedio porque no fue un juego individual, pero tus propios cuadros sí cuentan.",
"Alternate who leads off each game": "Alternar quién empieza cada juego",
"+ Add Another Day or Block": "+ Agregar otro día o bloque",
"Cancel Tournament": "Cancelar torneo",
"This deletes": "Esto elimina",
"this tournament": "este torneo",
"— every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "— todos los bloques, tiros, puntajes y brackets que registraste — y te regresa a Inicio. No se puede deshacer.",
"Brackets and side pots": "Brackets y botes",
"Working out brackets and side pots as you go is part of the paid plan. Side games in league stay free.": "Calcular brackets y botes sobre la marcha es parte del plan de pago. Los juegos extra de liga siguen siendo gratis.",
"How did it finish?": "¿Cómo terminó?",
"The stepladder says": "Según la final escalonada:",
"Anything worth remembering about it?": "¿Algo que valga la pena recordar?",
"Entry & Winnings": "Entrada y ganancias",
"The tournament payout only. Bracket and side pot winnings go on the Brackets tab.": "Solo el premio del torneo. Las ganancias de brackets y botes van en la pestaña Brackets.",
"Tournament buy in": "Entrada del torneo",
"Tournament winnings": "Ganancias del torneo",
"Brackets buy in": "Entrada de brackets",
"Brackets winnings": "Ganancias de brackets",
"net": "neto",
"Tournament Notes": "Notas del torneo",
"Overall takeaways…": "Conclusiones generales…",
"✓ Tournament Saved": "✓ Torneo guardado",
"Save & Finish Tournament": "Guardar y terminar torneo",
"Close this tournament and start a new one? It stays in your history.": "¿Cerrar este torneo y empezar uno nuevo? Se queda en tu historial.",
"Yes, close it": "Sí, cerrarlo",
"Keep working on it": "Seguir trabajando",
"Close tournament": "Cerrar torneo",
"Side pot": "Bote",
"Money": "Dinero",
"Tournament Total": "Total del torneo",
"All Days": "Todos los días",
"scratch ·": "scratch ·",
"handicap pins": "pinos de hándicap",
"← still standing": "← en pie",
"Pins standing": "Pinos de pie",
"Spare made?": "¿Hiciste el spare?",
"← tap what fell": "← toca los caídos",
"Average over the last 13 games": "Promedio de los últimos 13 juegos",
"Game 1": "Juego 1",
"Scores, or every ball": "Puntajes, o cada tiro",
"Arsenal · 3 balls": "Arsenal · 3 bolas",
"47% strikes · 54% spares": "47% strikes · 54% spares",
"15lb · RG 2.5 / Diff 0.05": "15lb · RG 2.5 / Diff 0.05",
"45% strikes · 61% spares": "45% strikes · 61% spares",
"15lb · RG 2.57 / Diff 0.046": "15lb · RG 2.57 / Diff 0.046",
"45% strikes · 67% spares": "45% strikes · 67% spares",
"15lb · RG 2.49 / Diff 0.05": "15lb · RG 2.49 / Diff 0.05",
"Layouts, surface, specs": "Layouts, superficie, especificaciones",
"Split Happens": "Split Happens",
"Tuesday House Shot · 4 bowlers": "Tuesday House Shot · 4 integrantes",
"1. You": "1. Tú",
"2. Rob": "2. Rob",
"3. Kim": "3. Kim",
"4. Dee": "4. Dee",
"A league first, a team later": "Primero la liga, después el equipo",
"Mine": "Yo",
"Trends": "Avance",
"Center": "Centro",
"On the road since Jul 9": "En camino desde el 9 de julio",
"First 700 series": "Primera serie de 700",
"4 pins short · best 696": "Faltan 4 pinos · mejor: 696",
"September": "Septiembre",
"10 Sep": "10 sep.",
"Lanes broke down early. Moved left 3 and it came back.": "El patrón se rompió temprano. Me moví 3 tablas a la izquierda y la bola volvió a entrar.",
"Settings › Walkthroughs": "Configuración › Recorridos guiados",
"Tonight's scores": "Puntajes de esta noche",
"Game 2": "Juego 2",
"Game 3": "Juego 3",
"Three numbers and you're done": "Tres números y listo",
"Frame 4 · Ball 1": "Cuadro 4 · Tiro 1",
"Other leave": "Otros pinos",
"How it hit": "Cómo pegó",
"Flush": "Al bolsillo",
"Messenger": "Mensajero",
"Frame over — no pins to pick": "Cuadro terminado — no hay pinos que elegir",
"Frame 5 · left standing": "Cuadro 5 · pinos de pie",
"Tap the pins, then answer": "Toca los pinos y luego responde",
"Frame 6 · left standing": "Cuadro 6 · pinos de pie",
"None fell? Just save": "¿No cayó ninguno? Solo guarda",
"vs average": "vs. promedio",
"Brackets": "Brackets",
"Standard": "Estándar",
"Baker": "Baker",
"Scratch": "Scratch",
"Format": "Formato",
"10 pin": "10 pinos",
"9 pin no-tap": "No-tap de 9 pinos",
"Mix them however the event runs": "Combínalos según el formato del torneo",
"Qualifying": "Clasificación",
"Match Play": "Match play",
"Stepladder": "Final escalonada",
"Day 1": "Día 1",
"Day 2": "Día 2",
"Cut": "Corte",
"1812 of 1750 across 8 games (all blocks so far).": "1812 contra un corte de 1750 en 8 juegos (todos los bloques hasta ahora).",
"Where you stand, updated every game": "Tu posición, actualizada en cada juego",
"Qualified for": "Clasificaste a",
"Match play": "Match play",
"N/A": "Ninguno",
"Go to match play": "Ir a match play",
"The margin already said you made it": "El margen ya indicaba que pasaste el corte",
"Match 1": "Match 1",
"WIN": "VICTORIA",
"by 23": "por 23",
"Track frames (G1)": "Registrar cuadros (J1)",
"Them": "Rival",
"Game 1 again — qualifying doesn't follow you here": "Otra vez el juego 1 — la clasificación no cuenta aquí",
"Record": "Récord",
"Bonus pins": "Pinos de bono",
"Your seed": "Tu sembrado",
"Step 2": "Escalón 2",
"LOSS": "DERROTA",
"by 11": "por 11",
"Seed": "Sembrado",
"2nd": "2.º",
"Finished": "Lugar final",
"Won one step, then out to the 2 seed.": "Ganaste un escalón y luego caíste ante el sembrado 2.",
"Worked out from your seed — never asked": "Se calcula a partir de tu sembrado — nunca se te pregunta",
"8 games": "8 juegos",
"Every phase, and what it paid": "Cada fase y lo que pagó",
"Choose file": "Elegir archivo",
"What changed": "Qué cambió",
"Your Bionic is carrying 8% better than the Phaze II on this pattern — 61% against 53% over 94 first balls.": "Tu Bionic tiene un carry 8% mejor que la Phaze II en este patrón — 61% contra 53% en 94 primeros tiros.",
"10 pin conversion": "Conversión del pino 10",
"18 more": "Faltan 18",
"Six of your eight opens were single-pin leaves — the 10 alone cost you 27 pins. The Bionic carried everything in game three; it was the one you finished on.": "Seis de tus ocho cuadros abiertos dejaron un solo pino — solo el 10 te costó 27 pinos. La Bionic lo derribó todo en el tercer juego; fue con la que terminaste.",
"Ryan's night": "La noche de Ryan",
"Her lamp, on every screen": "Su lámpara, en cada pantalla",
"Brooklyn": "Brooklyn",
"2 wishes left today": "Te quedan 2 deseos hoy",
"Which ball should I start on next week?": "¿Con qué bola debería empezar la próxima semana?",
"On a 37-foot pattern you've struck more with the Bionic every time out. Start there.": "En un patrón de 37 pies, siempre hiciste más strikes con la Bionic. Empieza con ella.",
"Read this to the bowler": "Léele esto a la persona que entrenas",
"7KPQ-2M4R": "7KPQ-2M4R",
"Works once, for the next 7 days": "Sirve una sola vez, durante los próximos 7 días",
"Works once, on their phone": "Sirve una sola vez, en el celular de la otra persona",
"I": "Yo",
"m bowling": "juego",
"m coaching": "entreno",
"Dana Reyes": "Dana Reyes",
"Sam Ortiz": "Sam Ortiz",
"A dot means they answered something": "Un punto indica que esa persona respondió algo",
"From 412 shots": "Con base en 412 tiros",
"18 Mar · Tuesday Classic": "18 mar. · Clásico de los martes",
"11 Mar · Tuesday Classic": "11 mar. · Clásico de los martes",
"How much data it": "Cuántos datos",
"s built on, beside it": "lo respaldan, justo al lado",
"New task": "Nueva tarea",
"Metric": "Métrica",
"Leave the target off if it isn": "Deja la meta vacía si no",
"t a number": "es un número",
"Open": "Pendientes",
"Clean up the single-pin spares": "Convertir los spares de un pino",
"Target 60%": "Meta 60%",
"due 1 Apr": "para el 1 de abril",
"Reached 58% so far": "Logrado hasta ahora: 58%",
"Mark done": "Completar",
"Record attempt": "Registrar intento",
"What came back, not just what was asked": "Lo que se respondió, no solo lo que se pidió",
"By ball · strike rate": "Por bola · % de strikes",
"Bionic": "Bionic",
"Phaze II": "Phaze II",
"Zen Master": "Zen Master",
"You vs Split Happens": "Tú vs. Split Happens",
"Rob": "Rob",
"Team average": "Promedio del equipo",
"Same measure, same scale": "Misma medida, misma escala",
"Ball · strike rate": "Bola · % de strikes",
"61% · 94 shots": "61% · 94 tiros",
"47% · 8 more shots needed": "47% · faltan 8 tiros",
"Questions it can answer": "Preguntas que puede responder",
"Which ball carries best?": "¿Qué bola tiene mejor carry?",
"Where is a spare leaking?": "¿Qué spare se me está escapando?",
"Do I fall off in game three?": "¿Rindo menos en el tercer juego?",
"Jan": "ene.",
"Mar": "mar.",
"Last 90 days": "Últimos 90 días",
"Showing 13 of 40 games": "Se muestran 13 de 40 juegos",
"All balls": "Todas las bolas",
"Only games and shots recorded with this ball. Games with no ball noted are left out.": "Solo juegos y tiros registrados con esta bola. Los juegos sin bola anotada quedan fuera.",
"across every league": "en todas las ligas",
"averaging": "promedio de",
"· high": "· máximo de",
", low": ", mínimo de",
". The spread is": ". La dispersión es de",
"pins — that's what a nightly average hides.": "pinos — eso es lo que oculta un promedio por noche.",
"Show": "Mostrar",
"Last": "Últimos",
"days": "días",
"This one needs frame tracking. You're on game tracking, so there's nothing to plot here yet.": "Esto necesita seguimiento por cuadro. Estás en seguimiento por juego, así que todavía no hay nada que graficar aquí.",
"Need at least 2 nights logged before there's a line to draw.": "Necesitas al menos 2 noches registradas para poder trazar una línea.",
"Per game": "Por juego",
"Per night": "Por noche",
"Every game": "Cada juego",
"Share this trend": "Compartir esta tendencia",
"Nights here average": "Las noches aquí promedian",
"attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.": "intentos, lo cual es poco — los puntos individuales van a variar mucho aunque nada haya cambiado en tu juego.",
"Latest": "Último",
"Free trial —": "Prueba gratis —",
"left": "",
"Your subscription starts when the trial ends.": "Tu suscripción empieza cuando termine la prueba.",
"Thanks for bowling with us": "Gracias por jugar con nosotros",
"You are on the monthly plan. The yearly plan works out cheaper — switch any time.": "Tienes el plan mensual. El plan anual sale más barato — cámbiate cuando quieras.",
"See the yearly plan": "Ver el plan anual",
"'Archivo', system-ui, -apple-system, sans-serif": "",
"'Roboto Condensed', 'Archivo', system-ui, sans-serif": "",
"This": "Esto",
"check it against what you saw on the lane": "compáralo con lo que viste en la pista",
"was": "fue",
"by AI. It can be confidently wrong —": "por una IA. Puede equivocarse con total seguridad —",
"Other bowlers reported the shared specs for ⟨0⟩ as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.": "Otras personas reportaron que las especificaciones compartidas de ⟨0⟩ eran incorrectas, así que se eliminaron. Todavía tienes la bola — solo vuelve a ingresar sus datos cuando puedas.",
"best ⟨0⟩": "mejor juego ⟨0⟩",
"Now: ⟨0⟩": "Actual: ⟨0⟩",
"Which pins did the second ball knock down? ⟨0⟩ this frame": "¿Qué pinos derribó el segundo tiro? ⟨0⟩ en este cuadro",
"⟨0⟩ isn't poured on a Baker night — the frames belong to the pair, not to one bowler.": "⟨0⟩ no se sirve en una noche de formato Baker — los cuadros son de la pareja, no de una sola persona.",
"This league usually runs ⟨0⟩. Anything you set here is for tonight only.": "Patrón habitual de esta liga: ⟨0⟩. Lo que configures aquí es solo para esta noche.",
"This deletes tonight's shots, game scores and match points for ⟨0⟩ in ⟨1⟩, clears the setup, and takes you back to Home. This cannot be undone.": "Esto elimina los tiros, los puntajes de los juegos y los puntos de match de esta noche de ⟨0⟩ en ⟨1⟩, limpia la preparación y te regresa a Inicio. No se puede deshacer.",
"First ball: ⟨0⟩": "Primer tiro: ⟨0⟩",
"Second ball: ⟨0⟩": "Segundo tiro: ⟨0⟩",
"Done⟨0⟩": "Listo⟨0⟩",
"This deletes today's practice shots and game scores for ⟨0⟩ and takes you back to Home. This cannot be undone.": "Esto elimina los tiros de práctica y los puntajes de los juegos de hoy de ⟨0⟩ y te regresa a Inicio. No se puede deshacer.",
"Where do you bowl? ⟨0⟩": "¿Dónde juegas? ⟨0⟩",
"⟨0⟩ — a night that will not appear, scores you entered on another phone, or stats that stopped moving even though you have kept bowling.": "⟨0⟩ — una noche que no aparece, puntajes que registraste en otro celular o estadísticas que dejaron de moverse aunque sigues jugando.",
"This sends up anything still waiting to save, then downloads your full history again from scratch and reloads the app. ⟨0⟩, and nothing you have logged can be lost. It uses more data than a normal open and can take a few moments on a long season, so it is worth being on Wi-Fi.": "Esto envía todo lo que sigue pendiente de guardar, luego vuelve a descargar todo tu historial desde cero y recarga la app. ⟨0⟩, y nada de lo que registraste se puede perder. Usa más datos que una apertura normal y puede tardar unos momentos si la temporada es larga, así que conviene usar Wi-Fi.",
"Questions, or want your data deleted? ⟨0⟩": "¿Tienes preguntas o quieres que eliminemos tus datos? ⟨0⟩",
"This deletes your account and ⟨0⟩ — every shot and session, your profile and name, your arsenal, goals, and your place on any team. You won't be able to sign back in, and we can't recover it.": "Esto elimina tu cuenta y ⟨0⟩ — cada tiro y cada sesión, tu perfil y tu nombre, tu arsenal, tus objetivos y tu lugar en cualquier equipo. No podrás volver a iniciar sesión y no podremos recuperarla.",
"Want a copy first? Use ⟨0⟩ above before you do this.": "¿Quieres una copia primero? Usa ⟨0⟩ arriba antes de continuar.",
"Type ⟨0⟩ to confirm": "Escribe ⟨0⟩ para confirmar",
"The same email has a sign-in link in it, if you'd rather tap that.⟨0⟩The code lasts an hour.": "Ese mismo correo trae un enlace para iniciar sesión, si prefieres tocarlo.⟨0⟩El código es válido por una hora.",
"⟨0⟩or⟨1⟩": "⟨0⟩o⟨1⟩",
"⟨0⟩ Weakest": "⟨0⟩ Más débil",
"⟨0⟩ Strongest": "⟨0⟩ Más fuerte",
"⟨0⟩ Everything else": "⟨0⟩ Todo lo demás",
"⟨0⟩ Everything is already unlocked for you regardless of billing. You can still buy below to test checkout.": "⟨0⟩ Todo ya está desbloqueado para ti, sin importar la facturación. Aun así puedes comprar abajo para probar el pago.",
"Every league and team you bowl in ⟨0⟩": "Todas las ligas y equipos en los que juegas ⟨0⟩",
"⟨0⟩ is saved to your history. Bowling another block of it, or starting a new tournament?": "⟨0⟩ ya está guardado en tu historial. ¿Vas a jugar otro bloque o a empezar un torneo nuevo?",
"⟨0⟩Alternate who leads off each game": "⟨0⟩Alternar quién empieza cada juego",
"This deletes ⟨0⟩ — every block, shot, score and bracket entered for it — and takes you back to Home. This cannot be undone.": "Esto elimina ⟨0⟩ — todos los bloques, tiros, puntajes y brackets que registraste — y te regresa a Inicio. No se puede deshacer.",
"⟨0⟩Import": "⟨0⟩Importar",
"Match 1 ⟨0⟩⟨1⟩": "Match 1 ⟨0⟩⟨1⟩",
"Step 2 ⟨0⟩⟨1⟩": "Escalón 2 ⟨0⟩⟨1⟩",
"Which ball carries best?⟨0⟩Where is a spare leaking?⟨1⟩Do I fall off in game three?": "¿Qué bola tiene mejor carry?⟨0⟩¿Qué spare se me está escapando?⟨1⟩¿Rindo menos en el tercer juego?",
"up": "arriba",
"down": "abajo",
"they": "el equipo",
"they're": "esta persona rinde",
"year": "año",
"month": "mes",
"yearly": "anual",
"monthly": "mensual",
"frames": "cuadros",
"nights": "noches",
"now": "ahora",
"mixed": "mixto",
"unnamed": "sin nombre",
"(me)": "(yo)",
"That was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "Esto lo escribió una IA. Puede equivocarse con total seguridad — compáralo con lo que viste en la pista.",
"This scorecard was read by AI. It can be confidently wrong — check the numbers against the card before saving.": "Esta hoja de puntaje la leyó una IA. Puede equivocarse con total seguridad — compara los números con la hoja antes de guardar.",
"This list was found by AI. It can be confidently wrong — check the name and address before you rely on it.": "Esta lista la encontró una IA. Puede equivocarse con total seguridad — revisa el nombre y la dirección antes de confiar en ella.",
"⟨0⟩ wants to be your coach.": "⟨0⟩ quiere ser tu entrenador.",
"⟨0⟩ wants to be your bowler.": "⟨0⟩ quiere ser tu alumno.",
"Automatic": "Automático",
"Automatic · ⟨0⟩": "Automático · ⟨0⟩",
"Automatic follows your phone's language. Changing it restarts the app.": "El modo automático sigue el idioma de tu celular. Cambiar el idioma reinicia la app.",
"theme::Light": "Claros",
"theme::Dark": "Oscuros",
"hit::High": "Grueso",
"hit::Light": "Delgado",
"hit::Brooklyn": "Cruzada",
"confidence::Clear": "Clara",
"Analysis came back empty. Try again.": "El análisis regresó vacío. Inténtalo de nuevo.",
"Analysis came back malformed. Try again.": "El análisis regresó con un formato incorrecto. Inténtalo de nuevo.",
"Couldn't generate insights right now.": "No se pudo generar el análisis en este momento.",
"Insights aren't configured on the server.": "El análisis no está configurado en el servidor.",
"Insights is part of the paid plan.": "El análisis es parte del plan de pago.",
"Not enough data yet to analyse.": "Todavía no hay suficientes datos para analizar.",
"You've used this quite a lot in the last hour. Give it a little while and try again.": "Lo has usado bastante en la última hora. Espera un rato e inténtalo de nuevo.",
"Ask me something.": "Pregúntame algo.",
"Brooklyn only answers on the paid plan.": "Brooklyn solo responde con el plan de pago.",
"Sign in first.": "Primero inicia sesión.",
"That's a lot. Try asking me one thing.": "Eso es mucho. Intenta preguntarme una sola cosa.",
"The lamp is cold. Try again later.": "La lámpara está fría. Inténtalo más tarde.",
"The lamp went quiet. Try again in a moment.": "La lámpara se quedó en silencio. Inténtalo de nuevo en un momento.",
"You've used all three today. The lamp recharges tomorrow.": "Ya usaste tus tres preguntas de hoy. La lámpara se recarga mañana.",
"Subscriptions are not available yet.": "Las suscripciones todavía no están disponibles.",
"That plan is not available right now.": "Ese plan no está disponible en este momento.",
"Too many attempts. Try again shortly.": "Demasiados intentos. Inténtalo de nuevo en breve.",
"You already have a subscription.": "Ya tienes una suscripción.",
"Could not open the subscription manager.": "No se pudo abrir la administración de la suscripción.",
"No Stripe subscription found for this account.": "No se encontró ninguna suscripción de Stripe para esta cuenta.",
"Subscription management is not available yet.": "La administración de la suscripción todavía no está disponible.",
"Account deletion isn't configured on the server. Email support@mybowlingjourney.com and we'll do it by hand.": "La eliminación de cuentas no está configurada en el servidor. Escribe a support@mybowlingjourney.com y lo haremos manualmente.",
"Account deletion isn't configured on the server.": "La eliminación de cuentas no está configurada en el servidor.",
"Couldn't delete the account just then. Try again, or email support@mybowlingjourney.com.": "No se pudo eliminar la cuenta en este momento. Inténtalo de nuevo o escribe a support@mybowlingjourney.com.",
"Not authenticated.": "No has iniciado sesión.",
"Not authenticated": "No has iniciado sesión",
"A location is needed to search nearby centers.": "Se necesita una ubicación para buscar centros de boliche cercanos.",
"Location search isn't configured on the server.": "La búsqueda por ubicación no está configurada en el servidor.",
"One of the images is too large. Try a smaller photo.": "Una de las imágenes es demasiado grande. Prueba con una foto más pequeña.",
"One of the images was empty or malformed.": "Una de las imágenes estaba vacía o dañada.",
"Scorecard import is part of the paid plan.": "Importar hojas de puntaje es parte del plan de pago.",
"The import service can't check its limits right now. Try again shortly.": "El servicio de importación no puede verificar sus límites en este momento. Inténtalo de nuevo en breve.",
"The scorecard reader isn't available right now.": "El lector de hojas de puntaje no está disponible en este momento.",
"Those images come to too much to send at once. Try fewer at a time.": "Esas imágenes pesan demasiado para enviarlas juntas. Prueba con menos a la vez.",
"Too many images in one request (max 6)": "Demasiadas imágenes en una sola solicitud (máximo 6)",
"You've imported a lot in the last hour. Give it a little while and try again.": "Importaste mucho en la última hora. Espera un rato e inténtalo de nuevo.",
"No images provided": "No se enviaron imágenes",
"Nightcap isn't configured on the server.": "El Nightcap no está configurado en el servidor.",
"Not enough logged tonight for a nightcap.": "No hay suficientes datos registrados esta noche para un Nightcap.",
"That's a few nightcaps in one hour. Give it a little while and try again.": "Ya van varios Nightcaps en una hora. Espera un rato e inténtalo de nuevo.",
"The Nightcap is part of the paid plan.": "El Nightcap es parte del plan de pago.",
"The nightcap came back empty. Tap to try again.": "El Nightcap regresó vacío. Toca para intentarlo de nuevo.",
"The nightcap came back malformed. Tap to try again.": "El Nightcap regresó con un formato incorrecto. Toca para intentarlo de nuevo.",
"The nightcap came back thin. Tap to try again.": "El Nightcap regresó con muy poco contenido. Toca para intentarlo de nuevo.",
"The nightcap took too long. Tap to try again.": "El Nightcap tardó demasiado. Toca para intentarlo de nuevo.",
"Could not record that purchase.": "No se pudo registrar esa compra.",
"Could not verify that purchase.": "No se pudo verificar esa compra.",
"Purchases are not available yet.": "Las compras todavía no están disponibles.",
"That purchase could not be verified.": "Esa compra no se pudo verificar.",
"My Groups": "Mis grupos",
"none here": "sin tiros aquí",
"At a glance": "De un vistazo",
"Spares": "Spares",
"Language · Langue": "Language · Idioma · Langue",
"Français (Canada)": "Français (Canada)",
"English": "English",
"1 Apr": "1 abr.",
"18 Mar 2026": "18 mar. 2026",
"22 Mar": "22 mar.",
"Tue": "Martes",
"✓ High game": "✓ Juego más alto",
"✓ Quarter game": "✓ Juego de 25 centavos",
"✓ Dollar game": "✓ Juego de 1 dólar",
"✓ 3-6-9 (whole night)": "✓ 3-6-9 (toda la noche)",
"Free fall against string pins. Set the rack type on two centers — or on one mixed house, with its free-fall lanes.": "Caída libre contra cuerdas. Indica el tipo de armadora en dos centros — o en un solo centro mixto, con sus pistas de caída libre.",
"Right-handed, backup": "Diestro, bola backup",
"Left-handed, backup": "Zurdo, bola backup",
"Tournament buy in $": "Entrada del torneo ($)",
"Tournament winnings $": "Ganancias del torneo ($)",
"milestones": "hitos",
"Spring Masters": "Masters de primavera",
"Changing the language": "Cambiar el idioma",
"Language · Langue in Settings. Automatic follows your phone's language, or pick Français (Canada) or English. The app restarts in the language you pick.": "Language · Langue en Configuración. Automático usa el idioma de tu teléfono, o elige Français (Canada) o English. La app se reinicia en el idioma que elijas.",
"Quarter $": "25 centavos ($)",
"Dollar $": "1 dólar ($)",
"left lane": "",
"right lane": "",
"left handed": "zurdo",
"Automatic ·": "Automático ·",
"Suivi de quilles": "Suivi de quilles",
"End League & View Results": "Terminar y ver resultados",
"End Practice & View Results": "Terminar y ver resultados",
"End Tournament & View Results": "Terminar y ver resultados",
"End Open Bowling & View Results": "Terminar juego libre y ver resultados",
"End Session & View Results": "Terminar sesión y ver resultados",
"Save & Finish League": "Guardar y terminar noche de liga",
"Save & Finish Practice": "Guardar y terminar práctica",
"Save & Finish Open Bowling": "Guardar y terminar juego libre",
"Save & Finish Session": "Guardar y terminar sesión",
"10-pin": "Pino 10",
"degrees": "grados",
"rpm": "rpm",
"mph": "mph",
"hand::R": "D",
"hand::L": "Z",
"title::Inbox": "Bandeja de entrada",
"title::Import scorecard": "Importar",
"tab::Clean frames": "Limpios",
"tab::Other leaves": "Otros",
"tab::First ball": "Primer tiro",
"tab::10-pin": "Pino 10",
"tab::Stepladder": "Escalonada",
"converted": "convertidos",
"G1": "J1",
"G2": "J2",
"G3": "J3",
"G4": "J4",
"G5": "J5",
"G6": "J6",
"Two-sided": "De ambos lados",
"Runner-up": "Segundo lugar",
"Pin-to-PAP": "Pin-to-PAP",
"Pin-to-COG": "Pin-to-COG",
"Won $": "Ganado ($)",
"placeholder::Score": "Puntaje",
"— choose a ball —": "— elige una bola —",
"field::Rev rate": "RPM",
"field::Breakpoint": "Punto de quiebre",
"field::Axis rot.": "Rot. del eje",
"field::Axis tilt": "Incl. del eje",
"field::Sole #": "Suela n.º",
"field::Heel #": "Tacón n.º",
"tile::High game": "Juego máx.",
"tile::High series": "Serie máx.",
"pin::1 pin": "Pino 1",
"pin::2 pin": "Pino 2",
"pin::3 pin": "Pino 3",
"pin::4 pin": "Pino 4",
"pin::5 pin": "Pino 5",
"pin::6 pin": "Pino 6",
"pin::7 pin": "Pino 7",
"pin::8 pin": "Pino 8",
"pin::9 pin": "Pino 9",
"pin::10 pin": "Pino 10",
"badges::All": "Todas",
"tile::League average": "Prom. de liga",
"All nights": "Todas las noches",
"placeholder::board #": "tabla",
"placeholder::degrees": "°",
"Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.": "Google Play te muestra si aplica una prueba gratis a tu cuenta antes de que confirmes; después, la suscripción se renueva automáticamente hasta que la canceles.",
"Pro": "Pro",
"Reading your question…": "Leyendo tu pregunta…",
"questions today. Ask again tomorrow.": "",
"Brooklyn couldn't answer that right now. Try again in a few minutes.": "Brooklyn no pudo responder eso ahora. Inténtalo de nuevo en unos minutos.",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She has her own card at the top of Improve. Three questions a day.": "Las pantallas de Stats cubren los números de siempre. Brooklyn es para las preguntas que esas pantallas no responden — pregunta sobre tu propio juego con palabras sencillas y ella lo averigua a partir de lo que has registrado. Si necesita algo que todavía no registras, te dirá qué empezar a registrar. Tiene su propia tarjeta arriba en Mejorar. Tres preguntas al día.",
"2 questions left today": "Quedan 2 hoy",
"Brooklyn isn't available right now. Try again later.": "Brooklyn no está disponible en este momento. Intenta de nuevo más tarde.",
"You've used all three questions today. Ask again tomorrow.": "Ya usaste tus tres preguntas de hoy. Vuelve a preguntar mañana.",
"Brooklyn couldn't answer that. Try again in a moment.": "Brooklyn no pudo responder eso. Intenta de nuevo en un momento.",
"Brooklyn took too long to answer. Try again.": "Brooklyn tardó demasiado en responder. Intenta de nuevo.",
"AI": "IA",
"tab::AI": "IA",
"On the Improve tab, open Goals, press Add a goal and pick what to work on — average, strike rate, spare conversion and so on. Progress updates as you bowl.": "En la pestaña Mejorar, abre Objetivos, presiona Agregar un objetivo y elige en qué trabajar — promedio, porcentaje de strikes, conversión de spares, etc. El progreso se actualiza a medida que juegas.",
"Start a drill from the Goals tab on Improve. Pick a target — a specific spare, or a pin combination — and the app tracks makes and misses for that session.": "Empieza un ejercicio desde la pestaña Objetivos en Mejorar. Elige a qué tirarle — un spare específico o una combinación de pinos — y la app cuenta aciertos y fallos en esa sesión.",
"Improve has a Coach tab. Say which way round it goes — they coach me, or I coach them — and make a code. Read the eight characters to the other person, they enter it on their own phone, and you're connected.": "Mejorar tiene una pestaña Entrenador. Indica en qué sentido va — “Me entrena” o “Yo entreno” — y genera un código. Dile los ocho caracteres a la otra persona, que lo ingresa en su propio celular, y quedan conectados.",
"+6%": "",
"The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. She's on the AI tab of Improve, below Insights. Three questions a day.": "Las pantallas de Stats cubren los números de siempre. Brooklyn es para las preguntas que esas pantallas no responden — pregunta sobre tu propio juego con palabras sencillas y ella lo calcula a partir de lo que has registrado. Si necesita algo que todavía no registras, te dirá qué empezar a registrar. Está en la pestaña IA de Mejorar, debajo de Análisis. Tres preguntas al día.",
"no reading": "",
"more than one bowler": "",
"not a card with drawn racks": "",
"Press Import in the header. Say whether it's practice or league, pick the team and date, then add photos of the scoring monitor. The app reads the games and frames, and you map each column to a bowler before saving. Tournaments aren't imported: log them live on Bowl, where squads, blocks, match play and stepladder are all tracked.": "Presiona Importar en el encabezado. Indica si es práctica o liga, elige el equipo y la fecha, y luego agrega fotos del monitor de puntaje. La app lee los juegos y los cuadros, y tú asignas cada columna a la persona que corresponde antes de guardar. Los torneos no se importan: regístralos en vivo en Jugar, donde se registran los turnos, los bloques, el match play y la final escalonada.",
"⚠️ Check the flagged ball below — it couldn't be reliably read from the image.": "⚠️ Revisa el tiro marcado abajo — no se pudo leer con certeza en la imagen.",
"⚠️ Check the flagged balls below — they couldn't be reliably read from the image.": "⚠️ Revisa los tiros marcados abajo — no se pudieron leer con certeza en la imagen.",
"This frame couldn't be read from the image.": "Este cuadro no se pudo leer en la imagen.",
"▾ Hide frames": "▾ Ocultar cuadros",
"▸ Check frames": "▸ Revisar cuadros",
"✓ This is right": "✓ Es correcto",
"Waiting for an app update to finish": "Esperando a que termine una actualización de la app",
"The cloud isn't ready for this yet. Nothing is lost on this phone; it will upload once the update is complete.": "La nube todavía no está lista para esto. No se pierde nada en este celular; se subirá cuando termine la actualización.",
"queued behind an earlier write for this row": "en espera detrás de un cambio anterior en este elemento",
"The free plan covers one team, and you're already on one. Upgrade to Pro to add another?": "El plan gratis incluye un equipo, y ya estás en uno. ¿Te pasas a Pro para agregar otro?",
"Sign in with this link?": "¿Iniciar sesión con este enlace?",
"Text": "Mensaje",
"Your home centers": "Tus centros habituales",
"Somewhere else?": "¿En otro lugar?",
"Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with a code, you get one to text them and they enter it when they sign up; with their email, they're linked the moment they sign in with that exact address.": "Le reserva su lugar en la lista del equipo desde ahora — puedes empezar a registrar sus puntajes a su nombre de inmediato desde “Anotando puntaje de”, sin que necesite cuenta todavía. De cualquier forma, esa persona reclama el lugar por su cuenta y todo lo que hayas registrado ya estará ahí: con un código, recibes uno para mandárselo por mensaje y lo ingresa al registrarse; con su correo, queda vinculada en cuanto inicia sesión con esa misma dirección.",
"Filled in from your note — check it's the right game.": "Se completó a partir de tu nota — revisa que sea el juego correcto.",
"(pending)": "(pendiente)",
"Couldn't tell which league this night belongs to. Reload the app and try again.": "No se pudo saber a qué liga pertenece esta noche. Vuelve a cargar la app e inténtalo de nuevo.",
"Couldn't change your name without a connection. Try again when you're back online.": "No se pudo cambiar tu nombre sin conexión. Intenta de nuevo cuando vuelvas a estar en línea.",
"Couldn't change your name. Try again in a moment.": "No se pudo cambiar tu nombre. Intenta de nuevo en un momento.",
"No spare ball. A plastic ball goes straight at corner pins without hooking.": "No hay bola de spare. Una bola de plástico va directo a los pinos de esquina sin hacer gancho.",
"it can't": "no se puede",
"they can't": "no se pueden",
"Nothing strong enough for heavy oil or a fresh pattern.": "Nada lo bastante fuerte para aceite abundante o un patrón recién aplicado.",
"Nothing weak enough for dry lanes or late in a block when the lanes burn up.": "Nada lo bastante débil para pistas secas o para el final de un bloque, cuando el aceite ya se quemó.",
"No ball with a sharp, angular back end for when you need it to turn the corner.": "Ninguna bola con una reacción final brusca y angular para cuando necesitas que quiebre con fuerza.",
"No smooth, controllable ball for when the back end is too strong.": "Ninguna bola suave y controlable para cuando la reacción final es demasiado fuerte.",
"Bag": "Maleta",
"The Caddie couldn't answer just then. Tap to try again.": "El Caddie no pudo responder en ese momento. Toca para intentarlo de nuevo.",
"Arsenal analysis": "Análisis del arsenal",
"Add your balls on the Balls tab, with their cover and core, and this maps where each one sits and what your bag is missing.": "Agrega tus bolas en la pestaña Bolas, con su cubierta y su núcleo, y aquí verás dónde se ubica cada una y qué le falta a tu maleta.",
"Compare bags": "Comparar maletas",
"Where each ball sits, from its cover, surface, core and layout — cover and surface count most, because they're what touches the lane. Positions are estimates from specs; your scores show what actually worked.": "Dónde se ubica cada bola, según su cubierta, superficie, núcleo y layout — la cubierta y la superficie pesan más, porque son lo que toca la pista. Las posiciones son estimaciones a partir de las especificaciones; tus puntajes muestran lo que realmente funcionó.",
"First bag": "Primera maleta",
"Second bag": "Segunda maleta",
"No ball here has the specs this chart needs yet.": "Ninguna bola aquí tiene todavía las especificaciones que necesita esta gráfica.",
"◯ in both": "◯ en ambas",
"⟨0⟩ Solid": "⟨0⟩ Sólida",
"⟨0⟩ Hybrid": "⟨0⟩ Híbrida",
"⟨0⟩ Pearl": "⟨0⟩ Perlada",
"● Faded: specs incomplete": "● Atenuado: especificaciones incompletas",
"Bags side by side": "Las maletas lado a lado",
"Strength": "Fuerza",
"Length": "Longitud",
"Back end": "Reacción final",
"No ball is in both bags.": "Ninguna bola está en ambas maletas.",
"A wider range means the bag covers more conditions.": "Un rango más amplio significa que la maleta cubre más condiciones.",
"Your balls": "Tus bolas",
"This bag is empty.": "Esta maleta está vacía.",
"What the arsenal is missing": "Lo que le falta al arsenal",
"What this bag is missing": "Lo que le falta a esta maleta",
"Nothing obvious — it covers strong to weak, smooth to sharp, and has a spare ball.": "Nada evidente — cubre de fuerte a débil, de suave a angular, y tiene bola de spare.",
"From the catalog:": "Del catálogo:",
"The Caddie": "El Caddie",
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.": "El Caddie lee toda la maleta — qué bola para qué condición, qué maleta está bien armada, qué agregar y qué dejar en casa. Es parte del plan de pago.",
"See the plan": "Ver el plan",
"🏌️ The Caddie": "🏌️ El Caddie",
"Asks which of these two bags is built for what.": "Pregunta para qué está armada cada una de estas dos maletas.",
"Reads the whole arsenal: each ball's job, your bags, and what to add or leave home.": "Lee todo el arsenal: la función de cada bola, tus maletas y qué agregar o dejar en casa.",
"The Caddie is looking over the bag…": "El Caddie está revisando la maleta…",
"Ask the Caddie": "Preguntar al Caddie",
"Add cover and core to at least one ball first.": "Primero agrega la cubierta y el núcleo de al menos una bola.",
"Spare ball": "Bola de spare",
"Scores well": "Rinde bien",
"Below average": "Bajo el promedio",
"Not placed — add cover and core": "Sin ubicar — agrega cubierta y núcleo",
"games ·": "juegos ·",
"No specs entered": "Sin especificaciones",
"Surface:": "Superficie:",
"not recorded": "sin registrar",
"(reading it as out of the box)": "(se toma como de fábrica)",
"Layout:": "Layout:",
"· Length": "· Longitud",
"· Back end": "· Reacción final",
"games at": "juegos con promedio de",
"By part of the night:": "Por momento de la noche:",
"No games logged with it yet.": "Todavía no hay juegos registrados con ella.",
"Each ball's job": "La función de cada bola",
"Gaps": "Carencias",
"Next in the bag:": "La próxima para la maleta:",
"Leave at home:": "Dejar en casa:",
"The Caddie's read": "La lectura del Caddie",
"it's working from specs and your logged games, not from watching you throw": "se basa en las especificaciones y en tus juegos registrados, no en verte tirar",
"Ask again": "Preguntar de nuevo",
"ArsenalAnalysis": "ArsenalAnalysis",
"Weak": "Débil",
"Benchmark": "Benchmark",
"Strong": "Fuerte",
"Early": "Temprana",
"Mid-lane": "Media pista",
"Long": "Larga",
"Smooth": "Suave",
"Controlled": "Controlada",
"Sharp": "Angular",
"Light oil / late in the block": "Aceite ligero / final del bloque",
"Medium oil": "Aceite medio",
"Heavy oil / fresh": "Aceite abundante / recién aplicado",
"Length × Back end": "Longitud × Reacción final",
"Where each ball starts to hook, and how it turns. Bigger dots are stronger balls.": "Dónde empieza el gancho de cada bola y cómo gira. Los puntos más grandes son las bolas más fuertes.",
"Length × Strength": "Longitud × Fuerza",
"The ladder: strongest at the top for fresh or heavy oil, weakest at the bottom for dry lanes and late in the block.": "La escalera: las más fuertes arriba para aceite fresco o abundante, las más débiles abajo para pistas secas y el final del bloque.",
"RG × Differential": "RG × Diferencial",
"Low RG (revs early)": "RG bajo (gira antes)",
"High RG (revs late)": "RG alto (gira después)",
"Low diff (less flare)": "Diferencial bajo (menos flare)",
"High diff (more flare)": "Diferencial alto (más flare)",
"The core alone, as the maker's numbers. Bigger dots are more asymmetric.": "Solo el núcleo, según los números del fabricante. Los puntos más grandes son más asimétricos.",
"Compare your bags, and ask the Caddie": "Compara tus maletas y pregúntale al Caddie",
"Where each ball sits, what scores, what's missing": "Dónde encaja cada bola, cuál rinde, qué falta",
"Ball against ball": "Bola contra bola",
"Your read-back after every night — you've poured one.": "Tu resumen después de cada noche — ya has servido uno.",
"A photo of the scorecard instead of typing every game.": "Una foto de la hoja de puntaje en vez de escribir cada juego.",
"Head to head": "Mano a mano",
"Your numbers against your teammates', and the team leaderboard.": "Tus números contra los de tus compañeros de equipo, y la clasificación del equipo.",
"Comparing your numbers with your friends'.": "Comparar tus números con los de tus amigos.",
"House against house": "Centro contra centro",
"Your season side by side with the one before.": "Tu temporada junto a la anterior.",
"Tracking what you put in and won at tournaments.": "Llevar la cuenta de lo que pagas y ganas en torneos.",
"Your coach's tasks, notes and view of your numbers.": "Las tareas y notas de tu entrenador, y lo que ve de tus números.",
"Your 60 days of Pro are up.": "Tus 60 días de Pro terminaron.",
"Every game, shot and night you've logged — nothing is deleted": "Cada juego, tiro y noche que registraste — no se borra nada",
"Your own stats: strikes, spares, splits, leaves and each ball's numbers": "Tus propias estadísticas: strikes, spares, splits, pinos que quedan y los números de cada bola",
"One league, one team, a league bag and a tournament bag": "Una liga, un equipo, una maleta de liga y una maleta de torneo",
"Badges, your journey and the calendar": "Las insignias, tu trayectoria y el calendario",
"Your Pro trial has ended": "Tu prueba de Pro terminó",
"What you've been using that Basic doesn't include:": "Lo que has estado usando y Basic no incluye:",
"Keep Pro ·": "Mantener Pro ·",
"/month": "/mes",
"Or": "O",
"/year": "/año",
"Basic is free, and keeps:": "Basic es gratis y conserva:",
"Continue with Basic": "Continuar con Basic",
"No card is on file, so nothing is charged when the trial ends — you move to Basic unless you choose Pro.": "No tienes ninguna tarjeta registrada, así que no se te cobrará nada cuando termine la prueba — pasas a Basic a menos que elijas Pro.",
"You against a teammate. Needs frames for you and at least one teammate in this league.": "Tú contra alguien de tu equipo. Se necesitan cuadros tuyos y de al menos otro integrante del equipo en esta liga.",
"Teammate": "Integrante del equipo",
"This league only. Split Rate is the one where lower is better.": "Solo esta liga. El porcentaje de splits es el único donde más bajo es mejor.",
"All leagues": "Todas las ligas",
"The Caddie's read was written by AI. It can be confidently wrong — it's working from specs and your logged games, not from watching you throw.": "La lectura del Caddie la escribió una IA. Puede equivocarse con total seguridad — se basa en las especificaciones y en tus juegos registrados, no en verte tirar.",
"This was written by AI. It can be confidently wrong — check it against what you saw on the lane.": "Esto lo escribió una IA. Puede equivocarse con total seguridad — compáralo con lo que viste en la pista.",
"✓ Session Saved": "✓ Sesión guardada",
"Language · Idioma · Langue": "",
"You cancelled, so this ends when the period you paid for runs out. Everything stays unlocked until then, and you can start it again any time before it ends.": "Cancelaste, así que tu suscripción termina cuando se acabe el periodo que pagaste. Todo sigue desbloqueado hasta entonces y puedes reactivarla cuando quieras antes de que termine.",
"window::All": "Todo",
"▼ How much data it’s built on, beside it": "▼ Cuántos datos lo respaldan, justo al lado",
"▼ Leave the target off if it isn’t a number": "▼ Deja la meta vacía si no es un número",
"Composite average at each position in the night, across the whole season — shows whether they're bowling better early, middle, or late.": "Promedio compuesto en cada posición de la noche, en toda la temporada — muestra si los juegos salen mejor al principio, a la mitad o al final de la noche.",
"tab::Season": "Temp.",
"tab::Calendar": "Fechas",
"tab::Journey": "Camino",
"picker::Every night": "Todas",
"field::Scoring": "Modalidad",
"tab::Side games": "Extras",
"Español": "",
"Français": "",
"⟨0⟩ Urethane": "⟨0⟩ Uretano",
"Language · Idioma · Langue · 言語 in Settings. Automatic follows your phone's language, or pick English, Español, Français or 日本語. The app restarts in the language you pick.": "Language · Idioma · Langue · 言語 en Configuración. Automático sigue el idioma de tu celular, o elige English, Español, Français o 日本語. La app se reinicia en el idioma que elijas.",
"Language · Idioma · Langue · 言語": "",
"日本語": "",
"tab::Center": "Centro",
"placeholder::Handicap": "Hándicap",
"tab::Handicap": "Hándicap",
"window::Games": "Juegos",
"field::Delivery": "Lanzamiento",
"tile::Strikes": "Strikes",
"field::Target": "Meta",
"milestone::Next ·": "Próximo ·",
"newly::.": ".",
"Japan": "",
"Singapore": "",
"Language · Idioma · Langue · 言語 · 언어": "",
"Language · Idioma · Langue · 言語 · 언어 in Settings. Automatic follows your phone's language, or pick English, Español, Français, 日本語 or 한국어. The app restarts in the language you pick.": "Language · Idioma · Langue · 言語 · 언어 en Configuración. Automático sigue el idioma de tu celular, o elige English, Español, Français, 日本語 o 한국어. La app se reinicia en el idioma que elijas.",
"hand::Right": "Derecha",
"hand::Left": "Izquierda",
"confidence::Not yet": "Aún no",
"Frames where every teammate struck but one. Log your teammates' frames on a league night.": "Cuadros en los que todo el equipo hizo strike menos una persona. Registra los cuadros de tus compañeros en una noche de liga."
},
"patterns": [
[
"Add {0}'s balls to start logging shots.",
"Agrega las bolas de {0} para empezar a registrar tiros."
],
[
"{0}% spares",
"{0}% spares"
],
[
"Remove {0}",
"Quitar {0}"
],
[
"Delete \"{0}\"? Its balls become ungrouped.",
"¿Eliminar “{0}”? Sus bolas quedarán sin grupo."
],
[
"Name change hasn't reached the cloud yet ({0}) — teammates won't be able to find you until it syncs.",
"El cambio de nombre todavía no llega a la nube ({0}) — tus compañeros de equipo no podrán encontrarte hasta que se sincronice."
],
[
"Saved on this device, but hasn't reached the cloud yet ({0}) — it may not carry over to another device yet.",
"Se guardó en este dispositivo, pero todavía no llega a la nube ({0}) — es posible que aún no aparezca en otro dispositivo."
],
[
"of {0}",
"de {0}"
],
[
"Earned {0}",
"Ganadas {0}"
],
[
"Left {0}",
"Faltan {0}"
],
[
"The free plan covers {0} league bag and {1} tournament bag. Extra bags — a short-pattern tournament bag, a sport shot bag — are part of the paid plan. Nothing you have already packed goes anywhere.",
"El plan gratuito incluye {0} {0|maleta de liga|maletas de liga} y {1} {1|maleta de torneo|maletas de torneo}. Las maletas extra — una de torneo para patrón corto, una para patrón deportivo — son parte del plan de pago. Lo que ya tienes en tus maletas se queda donde está."
],
[
"{0} · {1}{2} ball{3:s}{4}",
"{0} · {1} {1|bola|bolas}{2}{4}"
],
[
"{0} ball{1:s} not packed in any bag. Practice always shows every ball regardless.",
"{0} {0|bola no está|bolas no están} en ninguna maleta. En Práctica siempre aparecen todas las bolas."
],
[
"Showing the {0}lb numbers — RG and differential differ by weight, and this ball's own numbers were published for more than one.",
"Mostrando los números de {0} lb — el RG y el diferencial cambian según el peso, y los números de esta bola se publicaron para más de uno."
],
[
"No published numbers for {0}lb specifically — showing the reference weight instead.",
"No hay números publicados para {0} lb específicamente — se muestra el peso de referencia en su lugar."
],
[
"First balls at a full rack only {0} what a strike ball is for.",
"Solo primeros tiros con los 10 pinos en pie {0} para eso sirve la bola de strike."
],
[
"{0} shots — too few to rely on",
"{0} {0|tiro|tiros} — muy poco para ser confiable"
],
[
"Every number is a strike percentage. Bold leads that phase; nothing is bold when the gap is small enough to be chance. A rate in amber has fewer than {0} shots behind it, so treat it as preliminary. A dash means no shots at all.",
"Cada número es un porcentaje de strikes. La negrita marca la bola que lidera esa fase; nada va en negrita cuando la diferencia es tan pequeña que puede ser casualidad. Un porcentaje en ámbar se basa en menos de {0} tiros, así que tómalo como preliminar. Un guion significa que no hubo ningún tiro."
],
[
"{0} went quiet. Try again in a moment.",
"{0} se quedó callada. Intenta de nuevo en un momento."
],
[
"Couldn't reach {0}. Try again in a moment.",
"No se pudo contactar a {0}. Intenta de nuevo en un momento."
],
[
"Ask {0}, the bowling genie",
"Pregúntale a {0}, tu genio del boliche"
],
[
"You've used all {0} today. {1} is back tomorrow.",
"Ya usaste tus {0} preguntas de hoy. {1} vuelve mañana."
],
[
"The Stats screens cover the usual numbers. {0} is for the questions they don't answer — ask about your own bowling and she works it out from what you've logged. If it needs something you don't track yet, she'll tell you what to start logging.",
"Las pantallas de Stats cubren los números de siempre. {0} es para las preguntas que ahí no se responden — pregunta sobre cómo juegas y ella lo deduce a partir de lo que has registrado. Si le falta algo que todavía no registras, te dirá qué empezar a anotar."
],
[
"You're on {0} in this league. Making {1} puts you on its roster and takes you off {2}'s. Your scores stay yours.",
"Ya estás en {0} en esta liga. Si creas {1}, quedarás en su lista y saldrás de la de {2}. Tus puntajes siguen siendo tuyos."
],
[
"Couldn't find \"{0}\" in the cloud — this team was created on this device only and won't be visible to teammates. Try again once you're back online.",
"No se encontró “{0}” en la nube — este equipo se creó solo en este dispositivo y los demás integrantes no lo verán. Inténtalo de nuevo cuando vuelvas a tener conexión."
],
[
"\"{0}\" was created locally but couldn't reach the cloud yet ({1}). It'll keep retrying in the background.",
"“{0}” se creó en este dispositivo, pero todavía no llega a la nube ({1}). La app seguirá intentándolo en segundo plano."
],
[
"Combine your \"{0}\" with the shared one{1}? Your games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.",
"¿Combinar tu liga “{0}” con la compartida{1}? Tus juegos, equipos y ajustes de la liga pasarán a ella, y verás los equipos que ya están ahí. Esto no se puede deshacer."
],
[
"\"{0}\" was saved on this device only and hasn't reached the cloud yet — it won't be visible to teammates or usable for creating a team until it syncs. It'll keep retrying in the background if you're offline; check back if this persists.",
"La liga “{0}” se guardó solo en este dispositivo y todavía no llega a la nube — los demás integrantes del equipo no la verán ni podrás usarla para crear un equipo hasta que se sincronice. Si no tienes conexión, la app seguirá intentándolo en segundo plano; vuelve a revisar si esto continúa."
],
[
"You already have a league called \"{0}\". Pick a different name.",
"Ya tienes una liga llamada “{0}”. Elige otro nombre."
],
[
"\"{0}\" was renamed on this device only and hasn't reached the cloud yet. It'll keep retrying in the background if you're offline; check back if this persists.",
"La liga “{0}” se renombró solo en este dispositivo y todavía no llega a la nube. Si no tienes conexión, la app seguirá intentándolo en segundo plano; vuelve a revisar si esto continúa."
],
[
"You're not on {0} as {1}, so there's nothing to leave.",
"No estás en {0} como {1}, así que no hay de dónde salir."
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
"Ya estás en {0} en esta liga. Si te unes a {1}, saldrás de la lista de {2}. Tus puntajes siguen siendo tuyos."
],
[
"You're on {0}.",
"Ya estás en {0}."
],
[
"{0} {1} on {2} now.",
"{0} ya está en {2}."
],
[
"You're on {0} in this league. If {1} approve{2:s} you, you'll be taken off {3}'s roster. Your scores stay yours.",
"Ya estás en {0} en esta liga. Si {1} te acepta, saldrás de la lista de {3}. Tus puntajes siguen siendo tuyos."
],
[
"This replaces your request to join {0}.",
"Esto reemplaza tu solicitud para unirte a {0}."
],
[
"You've joined {0}. It'll show under Social.",
"Ya te uniste a {0}. Aparecerá en Amigos."
],
[
"This tournament is {0}’s. Switch bowler to save it.",
"Este torneo es de {0}. Cambia de jugador para guardarlo."
],
[
"profile|{0}",
""
],
[
"These leagues were restored on this device only and haven't reached the cloud yet: {0}. They'll keep retrying in the background if you're offline.",
"Estas ligas se restauraron solo en este dispositivo y todavía no llegan a la nube: {0}. Si no tienes conexión, la app seguirá intentándolo en segundo plano."
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
"· Tiro {0}"
],
[
"{0} changes backing up",
"Respaldando {0} {0|cambio|cambios}"
],
[
"Inbox, {0} waiting",
"Bandeja de entrada, {0} {0|pendiente|pendientes}"
],
[
"✓ {0} {1} saved on this phone. Nothing is lost.",
"✓ {0} {0|cambio guardado|cambios guardados} en este teléfono. No se pierde nada."
],
[
"mbj-app-content mbj-view-{0}",
""
],
[
"🧑‍🏫 Coach{0}",
"🧑‍🏫 Entrenador{0}"
],
[
"Invitation to join {0}",
"Invitación para unirte a {0}"
],
[
"{0} wants to join {1}",
"{0} quiere unirse a {1}"
],
[
"Joining takes you off {0}.",
"Al unirte, saldrás de {0}."
],
[
"Approving moves them off {0}.",
"Si apruebas, saldrá de {0}."
],
[
"📥 {0} waiting for you",
"📥 {0} {0|pendiente|pendientes} para ti"
],
[
"{0} total · {1} average · {2} high{3}{4}",
"Total de {0} · promedio de {1} · máximo de {2}{3}{4}"
],
[
"({0} scratch + {1} hcp)",
"({0} scratch + {1} de hándicap)"
],
[
"{0}{1} vs the cut",
"{0}{1} respecto al corte"
],
[
"{0}-{1}{2}{3}{4} match{5:s}{6}{7}{8} with bonus",
"{0}-{1}{2} en {4} {4|match|matches}{6}{7}{8} con bono"
],
[
"· {0} average",
"· promedio de {0}"
],
[
"{0}{1} of {2} step{3:s} won{4}",
"{0}{1} de {2} {2|escalón ganado|escalones ganados}{4}"
],
[
"{0} seed ·",
"{0} sembrado ·"
],
[
"· finished {0}",
"· terminaste en {0} lugar"
],
[
"{0} night{1:s} · {2} games · {3} average · {4} high",
"{0} {0|noche|noches} · {2} {2|juego|juegos} · promedio de {3} · máximo de {4}"
],
[
"1.5px solid {0}",
""
],
[
"Open results for {0}",
"Abrir resultados de {0}"
],
[
"{0} series · {1} average · {2} high",
"Serie de {0} · promedio de {1} · máximo de {2}"
],
[
"{0}% strikes{1}{2}",
"{0}% strikes{1}{2}"
],
[
"· {0}% spares",
"· {0}% spares"
],
[
"· {0} split{1:s}",
"· {0} {0|split|splits}"
],
[
"Delete this night? {0} game{1:s} and every frame logged with them. This cannot be undone.",
"¿Eliminar esta noche? {0} {0|juego|juegos} y todos los cuadros registrados en {0|él|ellos}. Esto no se puede deshacer."
],
[
"Everyone you've bowled with, by average. {0}",
"Todas las personas con quienes has jugado, por promedio. {0}"
],
[
"{0} game{1:s}",
"{0} {0|juego|juegos}"
],
[
"{0} night{1:s}",
"{0} {0|noche|noches}"
],
[
"{0} win{1:s}",
"{0} {0|victoria|victorias}"
],
[
"Send {0} their badges",
"Enviarle a {0} sus insignias"
],
[
"Free fall on {0}.",
"Caída libre en las pistas {0}."
],
[
"Where does {0} bowl? Set once per season — it lets you compare how you score house to house.",
"¿Dónde juega {0}? Se indica una vez por temporada — te permite comparar tus puntajes de un centro a otro."
],
[
"{0} mi",
"{0} mi"
],
[
"Target: {0}{1} {2}{3}",
"Meta: {0}{1} {2}{3}"
],
[
"reached {0}{1}",
"logrado: {0}{1}"
],
[
"Due {0}",
"Fecha límite: {0}"
],
[
"(+{0} more)",
"(+{0} más)"
],
[
"Target {0}{1} — no result logged yet.",
"Meta {0}{1} — aún no hay resultado registrado."
],
[
"Bowls {0} on {1}",
"Juega en la liga {0} el {1}"
],
[
"{0} — asked to be your {1}",
"{0} — pidió ser tu {1}"
],
[
"They enter it on their own phone and you{0}re connected — no searching for each other by name.",
"La otra persona lo escribe en su propio celular y quedan conectados — sin tener que buscarse por nombre."
],
[
"Connected. They{0}re in the list above.",
"Conexión establecida. Ya aparece en la lista de arriba."
],
[
"Goal for {0}",
"Objetivo para {0}"
],
[
"Next session with {0}",
"Próxima sesión con {0}"
],
[
"{0}'s Game",
"El juego de {0}"
],
[
"From {0} shots",
"En {0} {0|tiro|tiros}"
],
[
"Misses: {0}",
"Fallos: {0}"
],
[
"Tasks — {0}",
"Tareas — {0}"
],
[
"{0}. An 800 series is an 800 series.",
"{0}. Una serie de 800 es una serie de 800."
],
[
"{0}, beating your {1} by {2}.",
"{0}, superando por {2} tu récord de {1}."
],
[
"your {0} drill",
"tu ejercicio {0}"
],
[
"Mentions {0}, which you haven't logged enough of yet — treat that part as a guess.",
"Menciona {0}, y todavía no tienes suficientes datos registrados de eso — toma esa parte como una suposición."
],
[
"{0} added. {1} you already had.",
"Agregaste {0}. Ya tenías {1}."
],
[
"You already had {0}.",
"Ya tenías {0}."
],
[
"all {0} of those nights",
"todas esas {0} noches"
],
[
"Manufacturer specifications. Source: {0}",
"Especificaciones del fabricante. Fuente: {0}"
],
[
"Verified by {0} bowlers. Locked from edits.",
"Datos verificados por {0} {0|persona|personas}. Ya no se pueden editar."
],
[
"Entered by another bowler and confirmed by {0}. Not manufacturer data.",
"Datos ingresados por otra persona y confirmados por {0} {0|persona|personas}. No son datos del fabricante."
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
"Se obtiene solo en {0}"
],
[
"Earned in {0} or {1}",
"Se obtiene en {0} o en {1}"
],
[
"date must look like 2026-09-17, got \"{0}\"",
"la fecha debe tener la forma 2026-09-17, no “{0}”"
],
[
"no such date: {0}",
"esa fecha no existe: {0}"
],
[
"date looks wrong: {0}",
"la fecha parece incorrecta: {0}"
],
[
"date is in the future: {0}",
"la fecha está en el futuro: {0}"
],
[
"{0} must be a whole number, got \"{1}\"",
"{0} debe ser un número entero, no “{1}”"
],
[
"The header row needs these columns: {0}.",
"La fila de encabezado necesita estas columnas: {0}."
],
[
"That file has {0} rows. The limit is {1}.",
"Ese archivo tiene {0} {0|fila|filas}. El límite es {1}."
],
[
"{0} appears twice in this file",
"{0} aparece dos veces en este archivo"
],
[
"{0} — diagnostics",
""
],
[
"Ask {0} something. She's got your whole history in here.",
"Pregúntale algo a {0}. Tiene todo tu historial aquí."
],
[
"That's a lot. Try asking {0} one thing.",
"Es mucho. Intenta preguntarle una sola cosa a {0}."
],
[
"{0} only knows bowling. That one's free — ask her something else.",
"{0} solo sabe de boliche. Esa no cuenta — pregúntale otra cosa."
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
"Te {0|falta|faltan} {0} {0|pino|pinos} por juego."
],
[
"Beat your best by {0} pin{1:s}.",
"Supera tu mejor juego por {0} {0|pino|pinos}."
],
[
"Beat your best series by {0} pin{1:s}.",
"Supera tu mejor serie por {0} {0|pino|pinos}."
],
[
"Keep {0} of your next {1} {2} clean",
"Mantén limpios {0} de tus próximos {1} {2}"
],
[
"{0}{1} {2} of your next {3} {4}",
"Acierta {2} de tus próximos {3} {4}"
],
[
"{0} — {1} more than you are now.",
"{0} — {1} más que ahora."
],
[
"Corrected by {0}.",
"Corregido por {0}."
],
[
"Game {0}: you logged {1}, the photo reads {2}. Yours is kept unless you change it.",
"Juego {0}: registraste {1} y la foto dice {2}. Se conserva el tuyo, a menos que lo cambies."
],
[
"game {0} ({1} vs {2})",
"juego {0} ({1} contra {2})"
],
[
"These disagree with what you logged — {0}. Yours are kept unless you change them.",
"Estos no coinciden con lo que registraste — {0}. Se conservan los tuyos, a menos que los cambies."
],
[
"{0} nights of scores to check",
"{0} {0|noche|noches} de puntajes por revisar"
],
[
"{0} nights need re-entering",
"{0} {0|noche|noches} por registrar de nuevo"
],
[
"{0} teammate score{1:s} unconfirmed",
"{0} {0|puntaje de compañero sin confirmar|puntajes de compañeros sin confirmar}"
],
[
"{0} wants to be your {1}",
"{0} quiere ser tu {1}"
],
[
"{0} task{1:s} from your coach",
"{0} {0|tarea|tareas} de tu entrenador"
],
[
"{0} task update{1:s} from your bowlers",
"{0} {0|actualización de tarea|actualizaciones de tareas} de tus alumnos"
],
[
"{0} sent a friend request",
"{0} te envió una solicitud de amistad"
],
[
"{0}Accept or decline on the Team tab.",
"{0}Acepta o rechaza en la pestaña Equipo."
],
[
"{0} has finished its season.",
"{0} terminó su temporada."
],
[
"Your specs for {0} were rejected",
"Se rechazaron tus especificaciones de {0}"
],
[
"Game {0}, frame {1}",
"Juego {0}, cuadro {1}"
],
[
"{0} pin{1:s} away",
"{0|Falta|Faltan} {0} {0|pino|pinos}"
],
[
"Best {0}",
"Mejor: {0}"
],
[
"Milestones up to a {0} average",
"Hitos hasta un promedio de {0}"
],
[
"{0} pin{1:s} short · best {2}",
"{0|Falta|Faltan} {0} {0|pino|pinos} · mejor: {2}"
],
[
"{0}, and {1}",
"{0} y {1}"
],
[
"You usually bowl {0}. The app sets itself up for you on those days instead of asking.",
"Sueles jugar {0}. Esos días, la app se configura sola en lugar de preguntarte."
],
[
"Min {0}{1}",
"Mín. {0}{1}"
],
[
"Max {0}{1}",
"Máx. {0}{1}"
],
[
"Leave {0}?",
"¿Salir de {0}?"
],
[
"You'll no longer be part of {0}.",
"Ya no formarás parte de {0}."
],
[
"You'll still be on {0} in {1}.",
"Seguirás en {0} dentro de {1}."
],
[
"Your teammates ({0}) will see you've left.",
"Los demás integrantes ({0}) verán que saliste del equipo."
],
[
"Won every match, by {0} pins on average.",
"Ganaste todos los matches, por {0} pinos en promedio."
],
[
"Lost every match, but all of them by under {0} pins.",
"Perdiste todos los matches, pero todos por menos de {0} pinos."
],
[
"Lost every match, by {0} pins on average.",
"Perdiste todos los matches, por {0} pinos en promedio."
],
[
"won by {0} on average",
"ganaste por {0} en promedio"
],
[
"lost by {0}",
"perdiste por {0}"
],
[
"{0} of {1} came down to under {2} pins.",
"{0} de {1} se {0|decidió|decidieron} por menos de {2} pinos."
],
[
"Official {0} PBA specs.",
"Especificaciones oficiales de la PBA de {0}."
],
[
"Not on the {0} sheet — check patternlibrary.kegel.net if you bowled it.",
"No está en la hoja de {0} — consulta patternlibrary.kegel.net si lo jugaste."
],
[
"{0} · {1} · specs not entered yet",
"{0} · {1} · especificaciones aún sin ingresar"
],
[
"fewer than {0} games in {1}",
"menos de {0} juegos en {1}"
],
[
"{0} average across {1} games",
"promedio de {1} {1|juego|juegos} en {0}"
],
[
"no league reached {0} games, and the combined total didn't either",
"ninguna liga llegó a {0} juegos, y el total combinado tampoco"
],
[
"{0} average across {1} games (your strongest league)",
"promedio de {1} {1|juego|juegos} en {0} (tu mejor liga)"
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
"DESCRIPTION:{0} en {1} minutos"
],
[
"Retired {0}",
"Retirada el {0}"
],
[
"{0} · nothing logged with it",
"{0} · sin tiros registrados con ella"
],
[
"{0} · {1}, too few to compare",
"{0} · {1}, muy pocos para comparar"
],
[
"{0} · {1} · {2}% strikes",
"{0} · {1} · {2}% strikes"
],
[
"{0} couldn't be read and were left out. A clearer photo would get more — what's below is still safe to save.",
"Se dejó fuera lo que no se pudo leer: {0}. Con una foto más nítida se recuperaría más — lo que está abajo igual se puede guardar sin problema."
],
[
"The series says {0} but the {1} games add up to {2} — {3}. Check before saving.",
"La serie dice {0}, pero los {1} juegos suman {2} — {3}. Revisa antes de guardar."
],
[
"The card says {0} but the frames add up to {1} — {2}. Check before saving.",
"La hoja dice {0}, pero los cuadros suman {1} — {2}. Revisa antes de guardar."
],
[
"board must be {0} to {1}",
"la tabla debe estar entre {0} y {1}"
],
[
"{0} night{1:s} · {2} game{3:s}",
"{0} {0|noche|noches} · {2} {2|juego|juegos}"
],
[
"Average {0}",
"Promedio {0}"
],
[
"High game {0}{1}",
"Juego más alto {0}{1}"
],
[
"· High series {0}",
"· Serie más alta {0}"
],
[
"{0} game{1:s} over 200",
"{0} {0|juego|juegos} de más de 200"
],
[
"{0}% strikes · {1}% spares",
"{0}% strikes · {1}% spares"
],
[
"{0}${1} on the season",
"{0}${1} en la temporada"
],
[
"{0} – now",
"{0} – hoy"
],
[
"{0} games against {1}",
"{0} {0|juego|juegos} contra {1}"
],
[
"Your average is the same as last season — {0}.",
"Tu promedio es igual al de la temporada pasada — {0}."
],
[
"Your average is {0} {1} {2} on last season — {3}.",
"Tu promedio está {1} {1|pino|pinos} {0} respecto a la temporada pasada — {3}."
],
[
"{0} One of those seasons is short, so treat it lightly.",
"{0} Una de esas temporadas es corta, así que tómalo con cautela."
],
[
"Tied at {0} — nobody's settling this tonight.",
"Empate en {0} — esto no se define esta noche."
],
[
"{0}, by just {1}. That was close.",
"{0}, por apenas {1}. Estuvo cerrado."
],
[
"{0}, won by {1}.",
"{0}, ganó por {1}."
],
[
"Jumped {0} pins between games.",
"Subió {0} {0|pino|pinos} entre juegos."
],
[
"Dropped {0} pins between games.",
"Bajó {0} {0|pino|pinos} entre juegos."
],
[
"Every game within {0} pins.",
"Todos los juegos en un rango de {0} {0|pino|pinos}."
],
[
"{0} average over {1} game{2:s}",
"Promedio de {0} en {1} {1|juego|juegos}"
],
[
"{0} — {1} above your average.",
"{0} — {1} por encima de tu promedio."
],
[
"{0} — {1} below your average.",
"{0} — {1} por debajo de tu promedio."
],
[
"{0} — right on your average.",
"{0} — justo en tu promedio."
],
[
"{0} of {1} across {2} drill{3:s}",
"{0} de {1} en {2} {2|ejercicio|ejercicios}"
],
[
"{0} {1} for {2}{3}{4}: {5}.",
"{0} {1} en {2} {2|juego|juegos}{3}{4}: {5}."
],
[
"Badge{0:s} earned: {1}",
"{0|Insignia obtenida|Insignias obtenidas}: {1}"
],
[
"Tracked with {0} — {1}",
"Registrado con {0} — {1}"
],
[
"{0}-game series",
"Serie de {0} {0|juego|juegos}"
],
[
"{0}+{1} more",
"{0}+{1} más"
],
[
"+{0} more",
"+{0} más"
],
[
"Won ${0} in side pots",
"Gané ${0} en botes"
],
[
"Hit my goal: {0}",
"Cumplí mi objetivo: {0}"
],
[
"New personal best series — beat {0}",
"Nueva mejor serie personal — superé {0}"
],
[
"New personal best game — beat {0}",
"Nuevo mejor juego personal — superé {0}"
],
[
"{0} clean game{1:s}",
"{0} {0|juego limpio|juegos limpios}"
],
[
"{0} pins over my average",
"{0} {0|pino|pinos} por encima de mi promedio"
],
[
"{0} Tracked with {1} — {2}",
"{0} Registrado con {1} — {2}"
],
[
"{0} games — averaging {1}, high {2}, low {3}.",
"{0} {0|juego|juegos} — promedio de {1}, máximo de {2}, mínimo de {3}."
],
[
"{0} has earned {1}{2} badge{3:s}",
"{0}: {1}{2} {3|insignia obtenida|insignias obtenidas}"
],
[
"{0} earned a badge tonight",
"{0}: una insignia nueva esta noche"
],
[
"{0} earned {1} badges tonight",
"{0}: {1} insignias nuevas esta noche"
],
[
"Keep them: {0}",
"Consérvalas: {0}"
],
[
"Standings Tracked with {0} — {1}",
"Posiciones Registrado con {0} — {1}"
],
[
"Qualifying: {0} across {1} game{2:s}",
"Clasificación: {0} en {1} {1|juego|juegos}"
],
[
"Made the cut by {0}",
"Pasó el corte por {0}"
],
[
"Missed the cut by {0}",
"Quedó fuera del corte por {0}"
],
[
", {0} with bonus",
", {0} con bono"
],
[
"Match play: {0}{1}",
"Match play: {0}{1}"
],
[
"from the {0} seed",
"como {0} sembrado"
],
[
"Won the stepladder{0}",
"Ganó la final escalonada{0}"
],
[
"Stepladder: {0}{1}",
"Final escalonada: {0} lugar{1}"
],
[
"Stepladder: {0} of {1} steps won{2}",
"Final escalonada: {0} de {1} {1|escalón ganado|escalones ganados}{2}"
],
[
"Up ${0} on the day",
"Arriba ${0} en el día"
],
[
"Down ${0} on the day",
"Abajo ${0} en el día"
],
[
"{0} game{1:s} · {2} average",
"{0} {0|juego|juegos} · promedio de {2}"
],
[
"{0} {1} if you {2}",
"{0} {0|estadística se desbloquea|estadísticas se desbloquean} si {2}"
],
[
"{0}. Either on its own is fine.",
"{0}. Con cualquiera de las dos basta."
],
[
"Won the stepladder{0}.",
"Ganaste la final escalonada{0}."
],
[
"— {0} straight",
"— {0} {0|victoria seguida|victorias seguidas}"
],
[
"to the {0} seed",
"tras perder ante el {0} sembrado"
],
[
"Finished {0}{1}.",
"Terminaste en {0} lugar{1}."
],
[
"you and {0}",
"tú y {0}"
],
[
"Baker: {0} bowled this together, so the score stays out of your average.",
"Baker: {0} jugaron este juego en equipo, así que el puntaje queda fuera de tu promedio."
],
[
"{0} more night{1:s} needed before a direction means anything.",
"{0|Falta|Faltan} {0} {0|noche|noches} más para que la tendencia signifique algo."
],
[
"Trending {0} about {1}{2} across this stretch.",
"Tendencia hacia {0} de unos {1} en este tramo."
],
[
"Last {0} — showing {1} of {2} {3}",
"{0} más recientes — {1|se muestra|se muestran} {1} de {2} {3}"
],
[
"Last {0} days — showing {1} of {2} {3}",
"Últimos {0} días — {1|se muestra|se muestran} {1} de {2} {3}"
],
[
"{0} to {1} — showing {2} of {3} {4}",
"Entre {0} y {1} — {2|se muestra|se muestran} {2} de {3} {4}"
],
[
"{0} of {1} {2}{3}",
""
],
[
"{0}· last time {1}%",
"{0}· la vez pasada {1}%"
],
[
"Save Drill ({0} attempts)",
"Guardar ejercicio ({0} {0|intento|intentos})"
],
[
"Remove {0} as a friend?",
"¿Quitar a {0} de tus amigos?"
],
[
"Not enough data yet — {0} more {1} before this is worth reporting.",
"Aún no hay suficientes datos — se necesitan {0} {1} más para que valga la pena mostrarlo."
],
[
"{0} to go",
"{0|Falta|Faltan} {0}"
],
[
"{0} targets run from {1} to {2}.",
"Las metas de {0} van de {1} a {2}."
],
[
"Target{0}",
"Meta{0}"
],
[
"retrying after: {0}",
""
],
[
"Nothing matched \"{0}\". Try a word you'd see in the app — \"spare\", \"team\", \"ball\", \"import\".",
"No hay resultados para “{0}”. Prueba una palabra que veas en la app — “spare”, “equipo”, “bola”, “importar”."
],
[
"{0} games logged",
"{0} {0|juego registrado|juegos registrados}"
],
[
"· {0} seasons",
"· {0} {0|temporada|temporadas}"
],
[
"{0} badges earned",
"{0} {0|insignia obtenida|insignias obtenidas}"
],
[
"{0} · {1} milestone{2:s} so far",
"{0} · {1} {1|hito|hitos} hasta ahora"
],
[
"Next · {0}",
"Próximo · {0}"
],
[
"Imported {0} night{1:s}.",
"Se {0|importó|importaron} {0} {0|noche|noches}."
],
[
"That didn't save: {0}",
"No se guardó: {0}"
],
[
"A CSV with four columns: {0}. Dates look like 2026-09-17, scores are whole numbers from 0 to 300, and a night can be one, two or three games.",
"Un CSV con cuatro columnas: {0}. Las fechas se escriben como 2026-09-17, los puntajes son números enteros de 0 a 300 y una noche puede tener uno, dos o tres juegos."
],
[
"{0} row{1:s} skipped",
"{0} {0|fila omitida|filas omitidas}"
],
[
"Row {0}",
"Fila {0}"
],
[
"and {0} more",
"y {0} más"
],
[
"{0} night{1:s} you already have",
"{0} {0|noche|noches} que ya tienes"
],
[
", and {0} more",
", y {0} más"
],
[
"Keep mine, import the other {0}",
"Dejar las mías, importar las otras {0}"
],
[
"Import {0} night{1:s}",
"Importar {0} {0|noche|noches}"
],
[
"Frame-by-frame data included for {0}{1}{2} — confirming adds it to your shot history.",
"Datos cuadro por cuadro incluidos para {0} {0|juego|juegos} — al confirmar, se agregan a tu historial de tiros."
],
[
"Join {0}?",
"¿Unirte a {0}?"
],
[
"You were added to the roster as {0}{1}. Teammates will be able to import your scores from a scorecard photo — you still confirm them.",
"Te agregaron a la lista del equipo como {0}{1}. Los integrantes del equipo podrán importar tus puntajes desde una foto de la hoja de puntaje — la confirmación sigue siendo tuya."
],
[
", position {0}",
", posición {0}"
],
[
"Team {0}",
"{0} de equipo"
],
[
"{0} night{1:s} imported by a teammate.",
"{0} {0|noche importada|noches importadas} por alguien de tu equipo."
],
[
"{0}-{1} open",
"{0}-{1} abierto"
],
[
"Spare: {0}",
"Spare: {0}"
],
[
"Game {0}{1}",
"Juego {0}{1}"
],
[
"⚠️ {0} fill ball{1:s} below couldn't be reliably read from the image -- please double-check the pin count.",
"⚠️ {0} {0|tiro extra de abajo no se pudo leer|tiros extra de abajo no se pudieron leer} con certeza en la imagen -- revisa bien el número de pinos."
],
[
"Frame {0}{1}{2}",
"Cuadro {0}{1}{2}"
],
[
"These images come to about {0}MB, which is too much to send at once. Remove one and try again — images are sent at full quality, so fewer is better than smaller.",
"Estas imágenes suman unos {0} MB, lo que es demasiado para enviar de una vez. Quita una e inténtalo de nuevo — las imágenes se envían en calidad completa, así que es mejor enviar menos que enviarlas más pequeñas."
],
[
"retried on {0}",
""
],
[
"(Already retried {0} time{1:s}.)",
"(Ya se reintentó {0} {0|vez|veces}.)"
],
[
"Your images are still selected, so just tap {0} again in a minute.{1}",
"Tus imágenes siguen seleccionadas, así que solo toca “{0}” de nuevo en un minuto.{1}"
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
"Ya hay tiros registrados para el juego {0} del {1}."
],
[
"{0} game score{1:s}",
"{0} {0|puntaje de juego|puntajes de juego}"
],
[
"Sent {0} their scores to confirm.",
"Puntajes enviados a {0} para confirmar."
],
[
"Imported {0}{1} -- check the Results, then save the night.",
"Importado: {0}{1} -- revisa los Resultados y luego guarda la noche."
],
[
"Scorecard Screenshot{0:s}",
"Capturas de la hoja de puntaje"
],
[
"Scorecard {0}",
"Hoja de puntaje {0}"
],
[
"Remove scorecard {0}",
"Quitar hoja de puntaje {0}"
],
[
"Clear all {0} image{1:s}",
"Borrar todo ({0} {0|imagen|imágenes})"
],
[
"{0} images ({1}MB, full quality) — reading these can take a few minutes.",
"{0} imágenes ({1} MB, calidad completa) — leerlas puede tomar unos minutos."
],
[
"Reading a scorecard can take a minute or two. ({0}MB, full quality.)",
"Leer una hoja de puntaje puede tomar uno o dos minutos. ({0} MB, calidad completa.)"
],
[
"Working through {0} images. This can take a few minutes — every frame is read individually.",
"Procesando {0} imágenes. Esto puede tomar unos minutos — cada cuadro se lee por separado."
],
[
"{0} bowler{1:s} read off the card. Confirm each one before anything is saved — a wrong match writes someone else's game into their record.",
"{0} {0|jugador leído|jugadores leídos} de la hoja. Confirma cada uno antes de guardar nada — una asignación equivocada registra el juego de una persona en el historial de otra."
],
[
"Column {0}",
"Columna {0}"
],
[
"{0} game{1:s} · {2}{3}{4}",
"{0} {0|juego|juegos} · {2}{3}{4}"
],
[
"Games add to {0} but the card's scratch series is {1}. One of the games was misread — check the card.",
"Los juegos suman {0}, pero la serie scratch de la hoja es {1}. Uno de los juegos se leyó mal — revisa la hoja."
],
[
"Add \"{0}\" as a new bowler",
"Agregar “{0}” como jugador nuevo"
],
[
"Closest match: {0}",
"Coincidencia más cercana: {0}"
],
[
"Matched on the alias \"{0}\".",
"Coincidencia por el alias “{0}”."
],
[
"Card order: {0}",
"Orden en la hoja: {0}"
],
[
"check the {0} below, correct anything that's wrong, then save.",
"revisa abajo el puntaje de cada juego, corrige lo que esté mal y luego guarda."
],
[
"{0} game scores",
"{0} puntajes de juego"
],
[
"These go to {0} to confirm. They count straight away — confirming just marks them checked. Fix anything that was misread before sending.",
"Estos puntajes se envían a {0} para confirmar. Cuentan de inmediato — confirmarlos solo los marca como revisados. Corrige lo que se haya leído mal antes de enviar."
],
[
"read as \"{0}\"",
"Se leyó como “{0}”"
],
[
"Game{0:s} {1} couldn't be read — type the real score, or clear the box if they didn't bowl it.",
"Juego(s) {1} ilegible(s) — escribe el puntaje real, o vacía la casilla si no se jugó."
],
[
"Series {0}{1}",
"Serie {0}{1}"
],
[
"· card printed {0}",
"· en la hoja: {0}"
],
[
"Save & Send To {0} Teammate{1:s}",
"Guardar y enviar a {0} {0|compañero|compañeros}"
],
[
"{0} games. Only statistics with enough data to be meaningful are analysed.",
"{0} {0|juego|juegos}. Solo se analizan las estadísticas con suficientes datos para ser significativas."
],
[
"{0} of {1} · ~{2} more {3}",
"{0} de {1} · ~{2} {2|juego|juegos} más"
],
[
"You're close on {0} — a couple more nights and it unlocks.",
"Te falta poco para {0} — un par de noches más y se desbloquea."
],
[
"{0} more {1} to go.",
"{0|Falta|Faltan} {0} {0|juego|juegos}."
],
[
"Insights need at least {0} games. Below that, the numbers swing too much from night to night to say anything you can rely on — you'd get confident-sounding patterns that are really just noise.",
"El análisis necesita al menos {0} juegos. Con menos, los números varían demasiado de una noche a otra como para decir algo confiable — obtendrías tendencias que suenan muy seguras pero que en realidad son solo ruido."
],
[
"You have {0} games logged. Nothing has enough behind it to analyse honestly yet — here's what's closest.",
"Tienes {0} {0|juego registrado|juegos registrados}. Todavía nada tiene suficientes datos para analizarlo con honestidad — esto es lo que está más cerca."
],
[
"{0} more {1}",
"{0|falta|faltan} {0} {1}"
],
[
"Based on {0} games so far. These get sharper the more you log — a few nights gives a hint, a season gives you something to act on.",
"Basado en {0} {0|juego|juegos} hasta ahora. Esto se vuelve más preciso cuanto más registras — unas cuantas noches dan una pista, una temporada te da algo con qué actuar."
],
[
"You're working with {0} — worth talking this through with them before changing anything. They can see what these numbers can't.",
"Trabajas con {0} — conviene hablarlo con esa persona antes de cambiar algo. Puede ver lo que estos números no muestran."
],
[
"· {0} of {1}",
"· {0} de {1}"
],
[
"Nothing matches “{0}”{1}.",
"No hay resultados para “{0}”{1}."
],
[
"On the road since {0}",
"En camino desde el {0}"
],
[
"{0} Badges",
"{0} Insignias"
],
[
"The free plan follows this league.{0} Switching leagues, or bowling more than one, is part of Pro — and everything you have logged comes back when you subscribe.",
"El plan gratis cubre esta liga.{0} Cambiar de liga, o jugar en más de una, es parte de Pro — y todo lo que has registrado regresa cuando te suscribes."
],
[
"Paused: {0}.",
"En pausa: {0}."
],
[
"Paused: {0}. Practice and Just Bowling stay open either way.",
"En pausa: {0}. Práctica y Juego libre siguen disponibles de todos modos."
],
[
"Saved. {0} is your active league.",
"Guardado. {0} es tu liga activa."
],
[
"{0} · {1} games",
"{0} · {1} {1|juego|juegos}"
],
[
"vs your {0} overall{1}{2} game{3:s}",
"vs. tu promedio de {0}{1}{2} {2|juego|juegos}"
],
[
"{0} {1} more",
"{0} {1} más"
],
[
"Lane diagram, {0} of {1} balls shown",
"Diagrama de la pista: {0} de {1} bolas visibles"
],
[
"breakpoint {0}′",
"quiebre {0}′"
],
[
"{0} shots around {1}",
"{0} {0|tiro|tiros} en torno a este punto ({1})"
],
[
", across {0} nights",
", en {0} noches"
],
[
"{0} made of {1}",
"{0} de {1} {1|convertido|convertidos}"
],
[
"{0} missed of {1}",
"{0} de {1} {1|fallado|fallados}"
],
[
"Show all {0}",
"Ver los {0}"
],
[
"{0} of 4 points",
"{0} de 4 puntos"
],
[
"{0} — tonight",
"{0} — esta noche"
],
[
"{0}'s night",
"Noche de {0}"
],
[
"G{0} Theory",
"J{0} teórico"
],
[
"▼ {0} pins left on the lane",
"▼ {0} {0|pino|pinos} sin derribar en la pista"
],
[
"({0} actual vs {1} possible)",
"({0} real vs. {1} posible)"
],
[
"Tap the ones you're in. Buy-ins are saved for {0} — you won't need to enter them again.",
"Toca los juegos en los que participas. Las entradas se guardan para {0} — no tendrás que volver a ingresarlas."
],
[
"{0} game{1:s} tonight · ${2} paid in",
"{0} {0|juego|juegos} esta noche · ${2} pagados"
],
[
"All nine struck — you took it{0}.",
"Strike en los nueve cuadros — te llevaste el bote{0}."
],
[
"${0} paid in — {1} ${2} on the night.",
"${0} pagados — {1} ${2} en la noche."
],
[
"Counts for {0}. Bowled today — change the date above if that's the wrong week.",
"Cuenta para el {0}. Jugado hoy — cambia la fecha arriba si no es la semana correcta."
],
[
"Lanes {0} & {1}",
"Pistas {0} y {1}"
],
[
"Lane {0}",
"Pista {0}"
],
[
"Pattern name (e.g. {0})",
"Nombre del patrón (p. ej. {0})"
],
[
"Game {0} score",
"Puntaje del juego {0}"
],
[
"{0} frames say {1}",
"{0} los cuadros dicen {1}"
],
[
"Frames say {0} — tap to use them",
"Los cuadros dicen {0} — toca para usar ese puntaje"
],
[
"Delete game {0}",
"Eliminar juego {0}"
],
[
"Game {0} surface",
"Superficie del juego {0}"
],
[
"Delete game {0}? This removes the score{1}. It can't be undone.",
"¿Eliminar el juego {0}? Esto borra el puntaje{1}. No se puede deshacer."
],
[
"Shot Context{0}",
"Contexto del tiro{0}"
],
[
"10th Frame{0}",
"Cuadro 10{0}"
],
[
"Ball {0}",
"Tiro {0}"
],
[
"frame {0}{1} of game {2}",
"el cuadro {0}{1} del juego {2}"
],
[
", ball {0}",
", tiro {0}"
],
[
"Delete {0}? This cannot be undone.",
"¿Eliminar {0}? No se puede deshacer."
],
[
"Clearing the result deletes {0}. Delete it?",
"Al borrar el resultado se elimina {0}. ¿Eliminarlo?"
],
[
"Leave: {0}{1}",
"Pinos que quedan: {0}{1}"
],
[
"· First ball: {0}",
"· Primer tiro: {0}"
],
[
"Delete game {0} for everyone?{1}",
"¿Eliminar el juego {0} para todos?{1}"
],
[
"{0}, game {1}",
"{0}, juego {1}"
],
[
"Switched from {0} to {1} — why?",
"Cambiaste de {0} a {1} — ¿por qué?"
],
[
"Line{0}",
"Trayectoria{0}"
],
[
"· Lane {0}",
"· Pista {0}"
],
[
"{0} board{1:s} {2} of target",
"{0} {0|tabla|tablas} a la {2} del blanco"
],
[
"{0} of {1} first balls struck{2}{3}{4}",
"{0} {0|strike|strikes} en {1} {1|primer tiro|primeros tiros}{2}{3}{4}"
],
[
", {0} of {1} spares made",
", {0} de {1} {1|spare convertido|spares convertidos}"
],
[
", {0} split{1:s}",
", {0} {0|split|splits}"
],
[
"Best carry tonight: {0} {1} {2}%{3}over {4} first balls",
"Mejor carry esta noche: {0} {1} {2}%{3}en {4} {4|primer tiro|primeros tiros}"
],
[
"✓ {0} Saved",
"✓ Guardado"
],
[
"Save & Finish {0}",
"Guardar y terminar {0}"
],
[
"End {0} & View Results",
"Terminar {0} y ver resultados"
],
[
"nightcap:{0}|{1}|{2}|{3}",
""
],
[
"There are {0} things worth saying about tonight.",
"Hay {0} {0|cosa|cosas} que vale la pena comentar sobre esta noche."
],
[
"{0} things were true about tonight. Here are the two or three worth hearing.",
"{0} {0|dato|datos} de esta noche. Estos son los dos o tres que vale la pena escuchar."
],
[
"{0} first balls across {1} game{2:s}{3}",
"{0} {0|primer tiro|primeros tiros} en {1} {1|juego|juegos}{3}"
],
[
", against {0} earlier nights in this league.",
", comparado con {0} {0|noche anterior|noches anteriores} en esta liga."
],
[
"Your current book average is {0}.",
"Tu promedio establecido actual es {0}."
],
[
"Update to {0}",
"Actualizar a {0}"
],
[
"{0}-handed{1} · {2}",
"Mano: {0}{1} · {2}"
],
[
"A backup ball goes out to the {0} and hooks back, so your corner pin is the {1} and your pocket is the {2}. Turning this on flips every leave, split and lane drawing to match — you are still{3}-handed everywhere it says so.",
"Una bola backup sale hacia el lado contrario a tu mano y regresa con gancho, así que tu pino de esquina es el {1} y tu bolsillo es el {2}. Activar esto invierte todos los dibujos de pinos que quedan, de splits y de la pista para que coincidan — tu mano dominante sigue siendo la misma en todos los lugares donde se indica."
],
[
"Normal {0}-hand hook",
"Gancho normal"
],
[
"{0} season wrapped up",
"{0}: terminó la temporada"
],
[
"Not enough games logged here yet to suggest a new number{0}. You can still update it yourself below, or skip for now.",
"Todavía no hay suficientes juegos registrados aquí para sugerir un número nuevo{0}. Aun así puedes actualizarlo tú abajo u omitirlo por ahora."
],
[
"{0}Free fall · {1} game{2:s}",
"{0}Caída libre · {1} {1|juego|juegos}"
],
[
"{0}String · {1} game{2:s}",
"{0}Cuerdas · {1} {1|juego|juegos}"
],
[
"{0}{1}{2} on string",
"{0}{1}{2} con cuerdas"
],
[
"{0}-pins left",
"Pinos {0} que quedan"
],
[
"{0}: how often each pin was left standing",
"{0}: con qué frecuencia quedó en pie cada pino"
],
[
"{0}-pin left {1}% of first balls",
"El {0} quedó en pie en el {1}% de los primeros tiros"
],
[
"{0}{1} described",
"{0}{1} {1|descrito|descritos}"
],
[
"{0}% strikes ·",
"{0}% strikes ·"
],
[
"((100% - {0}px) / {1})",
""
],
[
", running {0}",
", acumulado {0}"
],
[
"· ball {0}",
"· tiro {0}"
],
[
"Showing {0} of {1}, newest first.",
"Mostrando {0} de {1}, las más recientes primero."
],
[
"{0} ten pins",
"{0} {0|pino 10|pinos 10}"
],
[
"{0} splits",
"{0} {0|split|splits}"
],
[
"Load {0} More",
"Cargar {0} más"
],
[
"{0} avg",
"Prom. {0}"
],
[
"{0} pins between {1} bowler{2:s}{3}",
"{0} pinos entre {1} {1|persona|personas}{3}"
],
[
"{0}{1} on my average",
"{0}{1} respecto a mi promedio"
],
[
"{0} more to {1} tester mode",
"{0} {0|toque|toques} más para {1} el modo de pruebas"
],
[
"Other bowlers have a “{0}” too",
"Otras personas también tienen una liga “{0}”"
],
[
"“{0}” is already here",
"“{0}” ya existe"
],
[
"{0} to {1} · {2} night{3:s}, {4} game{5:s}",
"Del {0} al {1} · {2} {2|noche|noches}, {4} {4|juego|juegos}"
],
[
"Usually {0}s",
"Día habitual: {0}"
],
[
"Bowls on {0}s",
"Se juega cada {0}"
],
[
"{0} team{1:s} in this league",
"{0} {0|equipo|equipos} en esta liga"
],
[
"sessions-{0}.csv",
"sesiones-{0}.csv"
],
[
"shots-{0}.csv",
"tiros-{0}.csv"
],
[
"bowling-backup-{0}.json",
"respaldo-boliche-{0}.json"
],
[
"You have {0} change{1:s} still waiting to save. {2} will be sent first.",
"Tienes {0} {0|cambio pendiente|cambios pendientes} de guardar. {0|Se enviará|Se enviarán} primero."
],
[
"Signed in as {0}.",
"Sesión iniciada como {0}."
],
[
"{0} change{1:s} {2} not reached the cloud yet.",
"{0} {0|cambio todavía no llega|cambios todavía no llegan} a la nube."
],
[
"Signing out now may lose {0}. Sign out anyway?",
"Si cierras sesión ahora, podrías perder lo que falta por enviar. ¿Cerrar sesión de todos modos?"
],
[
"{0} is published by My Bowling Journey LLC.",
"{0} es una app de My Bowling Journey LLC."
],
[
"Version {0}",
"Versión {0}"
],
[
"{0} day{1:s} left in your trial",
"{0|Te queda|Te quedan} {0} {0|día|días} de prueba"
],
[
"mbj-share-{0}.png",
""
],
[
"Share {0}",
"Compartir “{0}”"
],
[
"{0} Team",
"Equipo {0}"
],
[
"Select {0} above",
"Selecciona {0} arriba"
],
[
"Select {0} or {1} above",
"Selecciona {0} o {1} arriba"
],
[
"{0} (you)",
"{0} (tú)"
],
[
"Every rate stat side by side against {0}, instead of hunting through separate cards. Split Rate is the one metric here where lower is better.",
"Cada estadística de porcentaje lado a lado frente a {0}, sin tener que buscar en tarjetas separadas. El porcentaje de splits es la única métrica aquí en la que menos es mejor."
],
[
"{0} to see this — high game/series need one specific roster, since combining different-sized teams would unfairly favor whichever has more bowlers.",
"{0} para ver esto — el juego y la serie más altos requieren una lista del equipo específica, ya que combinar equipos de distinto tamaño favorecería injustamente al que tenga más integrantes."
],
[
"{0}'s Records",
"Récords de {0}"
],
[
", game {0}",
", juego {0}"
],
[
"{0} season record",
"{0} — récord de la temporada"
],
[
"{0}-{1} on games, {2}-{3} on pinfall.",
"{0}-{1} en juegos, {2}-{3} en total de pinos."
],
[
"{0}: {1}/{2} points ({3}-{4} games, {5}-{6} pinfall)",
"{0}: {1}/{2} puntos ({3}-{4} en juegos, {5}-{6} en total de pinos)"
],
[
"{0} to see this — \"the team\" needs to mean one specific roster, not several leagues' matches blended together.",
"{0} para ver esto — “el equipo” tiene que ser una lista específica, no los matches de varias ligas mezclados."
],
[
"Smaller handicap (avg {0})",
"Hándicap menor (prom. {0})"
],
[
"Larger handicap (avg {0})",
"Hándicap mayor (prom. {0})"
],
[
"{0}% stk",
"{0}% strikes"
],
[
"{0} shots",
"{0} {0|tiro|tiros}"
],
[
"{0} to see this — it needs a specific roster to know who's on top.",
"{0} para ver esto — se necesita una lista específica para saber quién va a la cabeza."
],
[
"{0}wk{1:s} on top",
"{0} sem. a la cabeza"
],
[
"{0}/{1} games",
"{0}/{1} {1|juego|juegos}"
],
[
"{0} to see this — it needs a specific roster to know who else was bowling that frame.",
"{0} para ver esto — se necesita una lista específica para saber quién más estaba jugando ese cuadro."
],
[
"{0} of {1} frames with no open.",
"{0} de {1} {1|cuadro cerrado|cuadros cerrados}."
],
[
"Frames {0}",
"Cuadros {0}"
],
[
"Frame {0}",
"Cuadro {0}"
],
[
"Broken out by frame number, not by game — shows whether there's a specific spot in every night (warm-up, lane transition, the 9th-frame score-math lapse) where {0} tends to leave pins, regardless of which game it is.",
"Desglosado por número de cuadro, no por juego — muestra si hay un momento específico en cada noche (calentamiento, transición de la pista, el despiste del cuadro 9 por sacar cuentas del puntaje) donde {0} tiende a dejar pinos, sin importar qué juego sea."
],
[
"⚠️ Only {0} game{1:s} logged — each frame number needs at least {2} to tell a real pattern from noise. Treat this as a preview, not a conclusion, until then.",
"⚠️ Solo {0} {0|juego registrado|juegos registrados} — cada número de cuadro necesita al menos {2} para distinguir un patrón real del ruido. Hasta entonces, tómalo como un adelanto, no como una conclusión."
],
[
"Frame {0} (n={1})",
"Cuadro {0} (n={1})"
],
[
"Weakest: {0} ({1}) · Strongest: {2} ({3})",
"Más débil: {0} ({1}) · Más fuerte: {2} ({3})"
],
[
"{0} {1} vs {2}",
"{0} {1} vs. {2}"
],
[
"Across {0} fresh racks.",
"En {0} {0|tiro|tiros} con los 10 pinos en pie."
],
[
"Across {0} non-strike balls.",
"En {0} {0|tiro|tiros} sin strike."
],
[
"{0} of {1} made. You leave a ten on {2}% of first balls.",
"{0} de {1} convertidos. Te queda el pino 10 en el {2}% de los primeros tiros."
],
[
"{0} of {1} made. Any leave with exactly one pin standing — 7, 4, 8, 10, or any other.",
"{0} de {1} convertidos. Cualquier situación con exactamente un pino en pie — 7, 4, 8, 10 o cualquier otro."
],
[
"{0} split{1:s} left, {2}% of your first balls.",
"{0|Quedó|Quedaron} {0} {0|split|splits}, el {2}% de tus primeros tiros."
],
[
"{0} to see who owes a round.",
"{0} para ver quién debe una ronda."
],
[
"{0} more shots needed",
"{0|Falta|Faltan} {0} {0|tiro|tiros}"
],
[
"Strike {0}%",
"Strike {0}%"
],
[
"1st ball {0}",
"1.er tiro {0}"
],
[
"Split {0}%",
"Split {0}%"
],
[
"Across {0} games.",
"En {0} {0|juego|juegos}."
],
[
"Tracked in 5-pin steps{0}.",
"Medido en pasos de 5 pinos{0}."
],
[
"({0}% to {1})",
"({0}% del camino a {1})"
],
[
"Next Session ({0} Games)",
"Próxima noche ({0} {0|juego|juegos})"
],
[
"You're averaging {0} across {1} games. Here's what the next set does to it.",
"Llevas un promedio de {0} en {1} {1|juego|juegos}. Así quedaría después de la próxima tanda."
],
[
"To reach {0}",
"Para llegar a {0}"
],
[
"Drops to {0} at or below",
"Baja a {0} si no pasas de"
],
[
"under {0}/game",
"menos de {0} por juego"
],
[
"Across {0} {1}, ranging {2}–{3}.",
"En {0} {1}, entre {2} y {3}."
],
[
"Composite average at each position in the night, across the whole season — shows whether {0} bowling better early, middle, or late.{1}",
"Promedio compuesto en cada posición de la noche, en toda la temporada — muestra si {0} mejor al principio, a la mitad o al final de la noche.{1}"
],
[
"Game {0}",
"Juego {0}"
],
[
"Team: {0}",
"Equipo: {0}"
],
[
"${0} paid in — {1} {2} overall.",
"${0} pagados — {1} {2} en total."
],
[
"{0} win{1:s} and {2} jackpot{3:s}.",
"{0} {0|victoria|victorias} y {2} {2|acumulado|acumulados}."
],
[
"{0} games",
"{0} {0|juego|juegos}"
],
[
"High {0}",
"Máx. {0}"
],
[
"Unhide Stat Cards ({0})",
"Mostrar tarjetas ocultas ({0})"
],
[
"{0}{1}Manage or cancel any time in the Play Store app, under Subscriptions.",
"{0}{1}Administra o cancela cuando quieras en la app de Play Store, en Suscripciones."
],
[
"Your {0}-day free trial has started, and everything is unlocked.",
"Tu prueba gratis de {0} {0|día|días} ya empezó y todo está desbloqueado."
],
[
"You cancelled, so this ends{0}. Everything stays unlocked until then, and you can start it again any time before it ends.",
"Cancelaste, así que tu suscripción termina {0}. Todo sigue desbloqueado hasta entonces y puedes reactivarla cuando quieras antes de que termine."
],
[
"(free keeps {0})",
"(la versión gratis incluye {0})"
],
[
"Yearly · {0}",
"Anual · {0}"
],
[
"Monthly · {0}",
"Mensual · {0}"
],
[
"Start your {0}-day free trial",
"Empezar prueba gratis de {0} {0|día|días}"
],
[
"Subscribe · {0}/{1}",
"Suscribirse · {0}/{1}"
],
[
"{0}{1}Cancel any time{2}{3}— you keep Pro until the end of the period you have paid for.",
"{0}{1}Cancela cuando quieras{2}{3}— conservas Pro hasta el final del periodo que ya pagaste."
],
[
"Hint: {0}",
"Sugerencia: {0}"
],
[
"Details: {0}",
"Detalles: {0}"
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
"Estás en el equipo {0} en {1}. Si te unes a {2}, sales de la lista del equipo {3}. Tus puntajes siguen siendo tuyos."
],
[
"You're on {0}{1}.{2}",
"Ya estás en el equipo {0}{1}.{2}"
],
[
"You're off {0}.",
"Ya no estás en el equipo {0}."
],
[
"You're on {0} in this league. If {1} approves you, you'll be taken off {2}'s roster. Your scores stay yours.",
"Estás en el equipo {0} en esta liga. Si el equipo {1} te aprueba, saldrás de la lista del equipo {2}. Tus puntajes siguen siendo tuyos."
],
[
"Delete \"{0}\"? This removes the team and its roster, but does not delete any bowler accounts.",
"¿Eliminar “{0}”? Esto elimina el equipo y su lista, pero no elimina ninguna cuenta de jugador."
],
[
"{0}approving moves them off {1}",
"{0}al aprobar, esta persona sale del equipo {1}"
],
[
"You're invited to {0}",
"Te invitaron a {0}"
],
[
"Asked to join {0} — waiting for someone on the team to approve.",
"Pediste unirte a {0} — falta que alguien del equipo te apruebe."
],
[
"Join our team on {0} — sign up and enter code {1}",
"Únete a nuestro equipo en {0} — regístrate e ingresa el código {1}"
],
[
"{0} — invited, waiting for them to accept",
"{0} — invitación enviada, falta que la acepte"
],
[
"{0}/{1} cuts",
"{0}/{1} cortes superados"
],
[
"{0} Your history: {1} avg over {2} game{3:s}{4}",
"{0} Tu historial: {1} de promedio en {2} {2|juego|juegos}{4}"
],
[
"+ Save \"{0}\" for next time",
"+ Guardar “{0}” para la próxima"
],
[
"Day {0}",
"Día {0}"
],
[
"Go to scoring{0} {1}",
"Ir a anotar{0} {1}"
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
"{0} de {1} en {3} {3|juego|juegos}{5}."
],
[
"Go to {0} {1}",
"Ir a {0} {1}"
],
[
"This block{0}s frames are logged under {1}, not {2}.",
"Los cuadros de este bloque están registrados con fecha {1}, no {2}."
],
[
"Move them to {0}",
"Moverlos a {0}"
],
[
"Remove game {0}",
"Quitar juego {0}"
],
[
"With hcp ({0}g)",
"Con hcp ({0} j.)"
],
[
"Total ({0}g)",
"Total ({0} j.)"
],
[
"{0} Brackets & Side Pots",
"{0} Brackets y botes"
],
[
"${0} paid in — {1} ${2} on side action.",
"${0} pagados — {1} ${2} en botes y brackets."
],
[
"{0} Match Play",
"{0} Match play"
],
[
"Match {0}{1}{2}",
"Match {0}{1}{2}"
],
[
"by {0}",
"por {0}"
],
[
"Go to the stepladder {0}",
"Ir a la final escalonada {0}"
],
[
"{0} Stepladder",
"{0} Final escalonada"
],
[
"Step {0}{1}{2}",
"Escalón {0}{1}{2}"
],
[
"Squad {0}",
"Turno {0}"
],
[
"Block {0}",
"Bloque {0}"
],
[
"{0} average over {1} game{2:s}{3}{4}",
"{0} de promedio en {1} {1|juego|juegos}{3}{4}"
],
[
"· on to {0}",
"· siguiente fase: {0}"
],
[
"Match {0}{1}",
"Match {0}{1}"
],
[
"{0} average over {1} match{2:s}{3}{4}",
"{0} de promedio en {1} {1|match|matches}{3}{4}"
],
[
"· {0} scratch",
"· {0} scratch"
],
[
"Best: match {0} by {1}{2}",
"Mejor: match {0} por {1}{2}"
],
[
"Worst: match {0} by {1}{2}",
"Peor: match {0} por {1}{2}"
],
[
"On to {0}.",
"Siguiente fase: {0}."
],
[
"Seeded {0}.",
"{0} sembrado."
],
[
"You bowl frames {0}{1}. The score stays out of your average since you did not bowl it alone, but your own frames still count.",
"Tú tiras los cuadros {0}{1}. El puntaje no cuenta para tu promedio porque no fue un juego individual, pero tus propios cuadros sí cuentan."
],
[
"The stepladder says {0} — {1}",
"Según la final escalonada: {0} — {1}"
],
[
"{0}${1} net",
"{0}${1} neto"
],
[
"({0} game{1:s})",
"({0} {0|juego|juegos})"
],
[
"{0} scratch · {1} handicap pins",
"{0} scratch · {1} {1|pino|pinos} de hándicap"
],
[
"0.5px solid {0}",
""
],
[
"Go to match play {0}",
"Ir al match play {0}"
],
[
"I{0}m bowling",
"Yo juego"
],
[
"I{0}m coaching",
"Yo entreno"
],
[
"{0} Sam Ortiz",
"{0} Sam Ortiz"
],
[
"How much data it{0}s built on, beside it",
"Cuántos datos lo respaldan, justo al lado"
],
[
"Leave the target off if it isn{0}t a number",
"Deja la meta vacía si no es un número"
],
[
"Target 60% {0} due 1 Apr",
"Meta 60% {0} para el 1 de abril"
],
[
"{0} games{1} ·{2}averaging {3} · high {4}, low {5}. The spread is {6} pins — that's what a nightly average hides.",
"{0} {0|juego|juegos}{1} ·{2}promedio de {3} · máximo de {4}, mínimo de {5}. La dispersión es de {6} {6|pino|pinos} — eso es lo que oculta un promedio por noche."
],
[
"Last {0}",
"Últimos {0}"
],
[
"Last {0} days",
"Últimos {0} días"
],
[
"Nights here average {0} attempts, which is thin — individual points will swing a lot even when nothing about your game has changed.",
"Las noches aquí promedian {0} {0|intento|intentos}, lo cual es poco — los puntos individuales van a variar mucho aunque nada haya cambiado en tu juego."
],
[
"Free trial — {0} {1} left",
"Prueba gratis — {0} {0|día restante|días restantes}"
],
[
"Your subscription starts {0}.",
"Tu suscripción empieza el {0}."
],
[
"You are on the monthly plan. The yearly plan is {0} and works out cheaper — switch any time.",
"Tienes el plan mensual. El plan anual cuesta {0} y sale más barato — cámbiate cuando quieras."
],
[
"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Crect width='34' height='34' rx='9' fill='{0}' fill-opacity='0.13'/%3E%3Cpath d='M11 14l6 6 6-6' fill='none' stroke='{1}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
""
],
[
"Pin {0}",
"Pino {0}"
],
[
"{0} was {1} by AI. It can be confidently wrong — {2}.",
"{0} viene de una IA. Puede equivocarse con total seguridad — {2}."
],
[
"⟨0⟩ wants to be your {0}.",
"⟨0⟩ quiere ser tu {0}."
],
[
"Avg {0} ⟨0⟩ · {1}g",
"Prom. {0} ⟨0⟩ · {1} {1|juego|juegos}"
],
[
"${0} won⟨0⟩${1} in",
"${0} ganados⟨0⟩${1} pagados"
],
[
"Suggested new book average: ⟨0⟩ — {0}.{1} Change the number below if this doesn't match your full season.",
"Nuevo promedio establecido sugerido: ⟨0⟩ — {0}.{1} Cambia el número de abajo si no coincide con tu temporada completa."
],
[
"{0} avg ⟨0⟩",
"Prom. {0} ⟨0⟩"
],
[
"You — {0}/{1} ⟨0⟩",
"Tú — {0}/{1} ⟨0⟩"
],
[
"{0} — {1}{2} attempts ⟨0⟩",
"{0} — {1}{2} {2|intento|intentos} ⟨0⟩"
],
[
"{0} — {1}, {2} attempts ⟨0⟩",
"{0} — {1}, {2} {2|intento|intentos} ⟨0⟩"
],
[
"We sent a {0}-digit code to ⟨0⟩.",
"Te enviamos un código de {0} dígitos a ⟨0⟩."
],
[
"⟨0⟩ wants to join {0}",
"⟨0⟩ quiere unirse a {0}"
],
[
"Cost ${0} · ⟨0⟩",
"Costo ${0} · ⟨0⟩"
],
[
"{0} wants to be your coach",
"{0} quiere ser tu entrenador"
],
[
"{0} wants to be your bowler",
"{0} quiere ser tu alumno"
],
[
"{0}% strikes",
"{0}% strikes"
],
[
"{0} described",
"{0} {0|descrito|descritos}"
],
[
"The analysis service didn't respond properly ({0}). This is usually temporary — tap Try Again.",
"El servicio de análisis no respondió correctamente ({0}). Normalmente es temporal — toca Reintentar."
],
[
"The lamp went quiet. Try again in a moment. (ref {0})",
"La lámpara se quedó en silencio. Intenta de nuevo en un momento. (ref. {0})"
],
[
"Location search failed ({0}).",
"La búsqueda por ubicación falló ({0})."
],
[
"Unsupported image type: {0}",
"Tipo de imagen no compatible: {0}"
],
[
"Couldn't pour the nightcap ({0}). Tap to try again.",
"No se pudo servir el Nightcap ({0}). Toca para intentarlo de nuevo."
],
[
"{0} {1} left today",
"Te {0|queda|quedan} {0} {0|pregunta|preguntas} hoy"
],
[
"{0} league{1:s}",
"{0} {0|liga|ligas}"
],
[
"{0} ball{1:s}",
"{0} {0|bola|bolas}"
],
[
"{0} bowler",
"{0} integrante"
],
[
"{0} bowlers",
"{0} integrantes"
],
[
"{0} set",
"{0} {0|definido|definidos}"
],
[
"{0} available",
"{0} {0|disponible|disponibles}"
],
[
"{0} times",
"{0} {0|vez|veces}"
],
[
"{0} view",
"Vista “{0}”"
],
[
"{0}: playing",
"{0}: participas"
],
[
"{0}: not playing",
"{0}: no participas"
],
[
"Frame {0}, {1}, running {2}",
"Cuadro {0}, {1}, acumulado {2}"
],
[
"Frame {0}, not bowled",
"Cuadro {0}, sin jugar"
],
[
"Frame {0}, not bowled, running {1}",
"Cuadro {0}, sin jugar, acumulado {1}"
],
[
"Frame {0}, {1}",
"Cuadro {0}, {1}"
],
[
"{0} pin{1:s} short",
"{0|falta|faltan} {0} {0|pino|pinos}"
],
[
"best {0}",
"mejor: {0}"
],
[
"{0} of {1}",
"{0} de {1}"
],
[
"— {0}, {1}",
"— {0}, {1}"
],
[
"{0} series",
"Serie de {0}"
],
[
"{0}: {1} series",
"{0}: serie de {1}"
],
[
"Delete {0}",
"Eliminar {0}"
],
[
"nightcap:{0}|{1}|{2}|{3}{4}",
""
],
[
"{0} of {1} attempts",
"{0} de {1} {1|intento|intentos}"
],
[
"{0} of {1} attempt",
"{0} de {1} {1|intento|intentos}"
],
[
"{0} of {1} balls",
"{0} de {1} {1|bola|bolas}"
],
[
"{0} of {1} nights",
"{0} de {1} {1|noche|noches}"
],
[
"{0} of {1} games",
"{0} de {1} {1|juego|juegos}"
],
[
"{0}-{1} standing",
"{0}-{1} en pie"
],
[
"{0} standing",
"{0} en pie"
],
[
"▲ {0} more",
"▲ {0} más"
],
[
"▼ {0} more",
"▼ {0} más"
],
[
"{0} bag",
"{0} maleta"
],
[
"{0} bags",
"{0} maletas"
],
[
"{0} pin",
"Pino {0}"
],
[
"e.g. {0}",
"p. ej. {0}"
],
[
"{0}% converted",
"{0}% convertidos"
],
[
"Trending up about {0} pins across this stretch.",
"Subió unos {0} {0|pino|pinos} en este tramo."
],
[
"Trending down about {0} pins across this stretch.",
"Bajó unos {0} {0|pino|pinos} en este tramo."
],
[
"Trending up about {0} points across this stretch.",
"Subió unos {0} {0|punto|puntos} en este tramo."
],
[
"Trending down about {0} points across this stretch.",
"Bajó unos {0} {0|punto|puntos} en este tramo."
],
[
"Trending up about {0} across this stretch.",
"Subió unos {0} en este tramo."
],
[
"Trending down about {0} across this stretch.",
"Bajó unos {0} en este tramo."
],
[
"${0} paid in — up ${1} on the night.",
"${0} pagados — ganaste ${1} en la noche."
],
[
"${0} paid in — down ${1} on the night.",
"${0} pagados — perdiste ${1} en la noche."
],
[
"${0} paid in — up {1} overall.",
"${0} pagados — vas ganando {1} en total."
],
[
"${0} paid in — down {1} overall.",
"${0} pagados — vas perdiendo {1} en total."
],
[
"${0} paid in — up ${1} on side action.",
"${0} pagados — ganaste ${1} en botes y brackets."
],
[
"${0} paid in — down ${1} on side action.",
"${0} pagados — perdiste ${1} en botes y brackets."
],
[
"Hide {0}",
"Ocultar “{0}”"
],
[
"10-Pin {0}%",
"Pino 10: {0}%"
],
[
"{0}% {1} pin",
"pino {1}: {0}%"
],
[
"{0} (me)",
"{0} (yo)"
],
[
"{0} ({1}g)",
"{0} ({1} {1|juego|juegos})"
],
[
"Left: {0}",
"Izquierda: {0}"
],
[
"Right: {0}",
"Derecha: {0}"
],
[
"Fast: {0}",
"Rápida: {0}"
],
[
"Slow: {0}",
"Lenta: {0}"
],
[
"Execution: {0}",
"Ejecución: {0}"
],
[
"Earned · {0}",
"Obtenida · {0}"
],
[
"Open results for {0} night, {1}",
"Abrir los resultados de la noche del {1}"
],
[
"Game {0} ball",
"Bola del juego {0}"
],
[
"{0} max",
"{0} máx."
],
[
"Your {0}-day free trial starts today. When it ends, the {1} plan starts at {2} and renews on its own until you cancel.",
"Tu prueba gratis de {0} {0|día|días} empieza hoy. Cuando termine, el plan {1} empieza con un precio de {2} y se renueva automáticamente hasta que lo canceles."
],
[
"The {0} plan is {1}. Google Play shows whether a free trial applies to your account before you confirm, then it renews on its own until you cancel.",
"El plan {0} cuesta {1}. Google Play te muestra si aplica una prueba gratis a tu cuenta antes de que confirmes; después, el plan se renueva automáticamente hasta que lo canceles."
],
[
"The {0} plan is {1}.",
"El plan {0} cuesta {1}."
],
[
"You have already had the free trial, so the {0} plan starts today at {1} and renews on its own until you cancel.",
"Ya usaste la prueba gratis, así que el plan {0} empieza hoy con un precio de {1} y se renueva automáticamente hasta que lo canceles."
],
[
"Ask {0}",
"Pregúntale a {0}"
],
[
"You've used all {0} questions today. Ask again tomorrow.",
"Ya usaste tus {0} preguntas de hoy. Vuelve a preguntar mañana."
],
[
"Ask {0} a question",
"Hazle una pregunta a {0}"
],
[
"Brooklyn couldn't answer that. Try again in a moment. (ref {0})",
"Brooklyn no pudo responder eso. Intenta de nuevo en un momento. (ref. {0})"
],
[
"Coach · {0}",
"Entrenador · {0}"
],
[
"{0} strips for {1} games",
""
],
[
"▸ Check frames · {0} flagged",
"▸ Revisar cuadros · {0} {0|señalado|señalados}"
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
"Ese enlace para iniciar sesión es para {0}, no para la cuenta con la que iniciaste sesión. Si querías cambiar de cuenta, primero cierra sesión."
],
[
"Sign in as {0}?",
"¿Iniciar sesión como {0}?"
],
[
"{0} (pending)",
"{0} (pendiente)"
],
[
"rotate(-90 10 {0})",
"rotate(-90 10 {0})"
],
[
"{0}: no cover or core entered yet, so {1} be placed.",
"{0}: todavía sin cubierta ni núcleo, así que {1} ubicar."
],
[
"A big step down from {0} to {1}: a condition between them has no ball.",
"Un gran salto de fuerza de {0} a {1}: no hay bola para las condiciones intermedias."
],
[
"{0} and {1} sit almost on top of each other. They do the same job.",
"{0} y {1} están casi en el mismo lugar. Hacen el mismo trabajo."
],
[
"{0} A wider range means the bag covers more conditions.",
"{0} Un rango más amplio significa que la maleta cubre más condiciones."
],
[
"In both bags: {0}.",
"En ambas maletas: {0}."
],
[
"In {0}",
"En {0}"
],
[
"From the catalog: {0}",
"Del catálogo: {0}"
],
[
"Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.{0}",
"El Caddie lee toda la maleta — qué bola para qué condición, qué maleta está bien armada, qué agregar y qué dejar en casa. Es parte del plan de pago.{0}"
],
[
"Reads {0}: what it's built for and what it's missing.",
"Lee {0}: para qué está armada y qué le falta."
],
[
"{0} games · {1} avg{2}{3}{4}",
"{0} {0|juego|juegos} · {1} de promedio{2}{3}{4}"
],
[
"· best {0}",
"· mejor: {0}"
],
[
"· {0}% strikes",
"· {0}% strikes"
],
[
"Surface: {0}{1}{2}Layout: {3}",
"Superficie: {0}{1}{2}Layout: {3}"
],
[
"Strength {0} · Length {1} · Back end {2}⟨0⟩",
"Fuerza {0} · Longitud {1} · Reacción final {2}⟨0⟩"
],
[
"{0} games at {1}{2}.{3}",
"{0} {0|juego|juegos} con promedio de {1}{2}.{3}"
],
[
", against your {0} overall",
", frente a tu promedio general de {0}"
],
[
"By part of the night: {0}.",
"Por momento de la noche: {0}."
],
[
"All {0} of your leagues",
"Todas tus {0} ligas"
],
[
"Basic keeps {0} league active. The others are paused — nothing is deleted, and they come back when you do.",
"Basic conserva {0} {0|liga activa|ligas activas}. Las demás quedan en pausa — no se borra nada, y vuelven cuando tú vuelvas."
],
[
"All {0} of your teams",
"Todos tus {0} equipos"
],
[
"Basic keeps {0}.",
"Basic conserva {0} {0|equipo|equipos}."
],
[
"Which of your {0} balls carries best, and how each one holds up from the first game to the last.",
"Cuál de tus {0} bolas tiene mejor carry, y cómo rinde cada una del primer juego al último."
],
[
"Your read-back after every night — you've poured {0}.",
"Tu resumen después de cada noche — ya has servido {0}."
],
[
"Answers about your own game — you've asked {0} question{1:s}.",
"Respuestas sobre tu propio juego — has hecho {0} {0|pregunta|preguntas}."
],
[
"The deep read of your game — you've run it {0} time{1:s}.",
"El análisis a fondo de tu juego — lo has usado {0} {0|vez|veces}."
],
[
"Your arsenal and bags, read ball by ball — {0} read{1:s} so far.",
"Tu arsenal y tus maletas, analizados bola por bola — {0} {0|análisis|análisis} hasta ahora."
],
[
"All {0} of your bags",
"Todas tus {0} maletas"
],
[
"Basic keeps {0} league bag and {1} tournament bag.",
"Basic conserva {0} {0|maleta|maletas} de liga y {1} {1|maleta|maletas} de torneo."
],
[
"How you score at each of the {0} centers you've bowled.",
"Tus puntajes en cada uno de los {0} centros de boliche donde has jugado."
],
[
"for {0}/month",
"por {0}/mes"
],
[
"You've logged {0} games with your {1}!",
"¡Has registrado {0} juegos con tu {1}!"
],
[
"To keep seeing how it stacks up against the rest of your bag — which ball carries, and when — keep Pro{0}.",
"Para seguir viendo cómo se compara con el resto de tu maleta — qué bola tiene carry, y cuándo — mantén Pro{0}."
],
[
"You've poured {0} Nightcaps!",
"¡Has servido {0} Nightcaps!"
],
[
"To keep getting one after every night, keep Pro{0}.",
"Para seguir recibiendo uno después de cada noche, mantén Pro{0}."
],
[
"You're tracking {0} leagues!",
"¡Estás registrando {0} ligas!"
],
[
"To keep all of them active, keep Pro{0}.",
"Para mantenerlas todas activas, sigue con Pro{0}."
],
[
"You've logged {0} games in your first 60 days!",
"¡Registraste {0} {0|juego|juegos} en tus primeros 60 días!"
],
[
"To keep the comparisons and the AI reads of your game, keep Pro{0}.",
"Para conservar las comparaciones y los análisis de IA de tu juego, sigue con Pro{0}."
],
[
"Keep everything unlocked{0}, or carry on with Basic — your scores and stats stay free.",
"Mantén todo desbloqueado{0}, o continúa con Basic — tus puntajes y estadísticas siguen siendo gratis."
],
[
"Your Pro trial ends in {0} day{1:s}",
"Tu prueba de Pro termina en {0} {0|día|días}"
],
[
"Keep Pro · {0}/month",
"Mantener Pro · {0}/mes"
],
[
"Or {0}/year",
"O {0}/año"
],
[
"Pro trial — {0} day{1:s} left. No card on file; nothing is charged when it ends.",
"Prueba de Pro — {0|queda|quedan} {0} {0|día|días}. No hay tarjeta registrada; no se cobra nada cuando termine."
],
[
"Thanks for subscribing. Everything is unlocked.{0}Manage or cancel any time in the Play Store app, under Subscriptions.",
"Gracias por suscribirte. Todo está desbloqueado.{0}Administra o cancela cuando quieras en la app de Play Store, en Suscripciones."
],
[
"You have Pro free for {0} more day{1:s}. Subscribing now starts billing today; you can also wait, and we'll ask when your trial ends.",
"Tienes Pro gratis por {0} {0|día|días} más. Si te suscribes ahora, el cobro empieza hoy; también puedes esperar y te preguntaremos cuando termine tu prueba."
],
[
"⟨0⟩ {0} · {1} shots",
"⟨0⟩ {0} · {1} tiros"
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
"Finished {0}.",
"Terminaste en {0} lugar."
],
[
"Finished {0} to the {1} seed.",
"Terminaste en {0} lugar tras perder ante el {1} sembrado."
],
[
"Finished {0} to {1}.",
"Terminaste en {0} lugar tras perder ante {1}."
],
[
"{0} step{1:s} won, still climbing.",
"{0} {0|escalón ganado|escalones ganados}; sigues subiendo."
],
[
"{0} board{1:s} left of target",
"{0} {0|tabla|tablas} a la izquierda del blanco"
],
[
"{0} board{1:s} right of target",
"{0} {0|tabla|tablas} a la derecha del blanco"
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.",
"{0}: {1}{2} {3|insignia obtenida|insignias obtenidas} — {4}."
],
[
"{0} earned a badge tonight — {1}.",
"{0}: una insignia nueva esta noche — {1}."
],
[
"{0} earned {1} badges tonight — {2}.",
"{0}: {1} insignias nuevas esta noche — {2}."
],
[
"{0} has earned {1}{2} badge{3:s} — {4}.\n\nKeep them: {5}",
"{0}: {1}{2} {3|insignia obtenida|insignias obtenidas} — {4}.\n\n{3|Consérvala|Consérvalas}: {5}"
],
[
"{0} earned a badge tonight — {1}.\n\nKeep them: {2}",
"{0}: una insignia nueva esta noche — {1}.\n\nConsérvala: {2}"
],
[
"{0} earned {1} badges tonight — {2}.\n\nKeep them: {3}",
"{0}: {1} insignias nuevas esta noche — {2}.\n\nConsérvalas: {3}"
],
[
"{0}-{1} over {2} match{3:s} · {4} with bonus",
"{0}-{1} en {2} {2|match|matches} · {4} con bono"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} with bonus",
"{0}-{1}-{2} en {3} {3|match|matches} · {5} con bono"
],
[
"{0}-{1} over {2} match{3:s} · {4} average · {5} with bonus",
"{0}-{1} en {2} {2|match|matches} · promedio de {4} · {5} con bono"
],
[
"{0}-{1}-{2} over {3} match{4:s} · {5} average · {6} with bonus",
"{0}-{1}-{2} en {3} {3|match|matches} · promedio de {5} · {6} con bono"
],
[
"{0} seed · {1} of {2} step{3:s} won · finished {4}",
"{0} sembrado · {1} de {2} {2|escalón ganado|escalones ganados} · terminó en {4} lugar"
],
[
"{0} seed · {1} of {2} step{3:s} won",
"{0} sembrado · {1} de {2} {2|escalón ganado|escalones ganados}"
],
[
"{0} of {1} step{2:s} won · finished {3}",
"{0} de {1} {1|escalón ganado|escalones ganados} · terminó en {3} lugar"
],
[
"You cancelled, so this ends on {0}. Everything stays unlocked until then, and you can start it again any time before it ends.",
"Cancelaste, así que tu suscripción termina el {0}. Todo sigue desbloqueado hasta entonces y puedes reactivarla cuando quieras antes de que termine."
],
[
"Your average is up {0} pin{1:s} on last season — {2}.",
"Tu promedio subió {0} {0|pino|pinos} respecto a la temporada pasada — {2}."
],
[
"Your average is down {0} pin{1:s} on last season — {2}.",
"Tu promedio bajó {0} {0|pino|pinos} respecto a la temporada pasada — {2}."
],
[
"{0}. {1}{2} — {3} avg, {4} games",
""
],
[
"{0}. {1} — {2} avg, {3} games",
"{0}. {1} — prom. {2}, {3} {3|juego|juegos}"
],
[
"The {0} plan starts today at {1} and renews on its own until you cancel.",
"El plan {0} empieza hoy con un precio de {1} y se renueva automáticamente hasta que lo canceles."
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
