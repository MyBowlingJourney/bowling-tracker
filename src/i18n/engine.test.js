import { describe, it, expect } from "vitest";
import { createTranslator, frenchNumbers } from "./engine.js";

const NB = "\u00A0", NN = "\u202F";

const tr = createTranslator({
  exact: {
    "Practice": "Entraînement",
    "League": "Ligue",
    "Right": "Droite",
    "Won it": "Gagné",
    "Sunday": "dimanche",
    "Save": "Enregistrer",
    "Light": "Mince",
    "theme::Light": "Clairs",
    "Your games": "Vos parties",
    "strike rate": "le taux d'abats",
    "spare rate": "le taux de réserves",
    "It": "Elle",
    "Split Happens": "Écarts de conduite",
    "No shots yet.": "Aucun lancer.",
    "Log one.": "Enregistrez-en un.",
  },
  patterns: [
    ["{0} game{1:s} logged", "{0} {0|partie enregistrée|parties enregistrées}"],
    ["Delete game {0}?", "Supprimer la partie {0}?"],
    ["{0} of {1}", "{0} sur {1}"],
    ["Earned in {0} only", "S'obtient en {0} seulement"],
    ["{0}-handed", "Main {0}"],
    ["Mentions {0}, which is new", "Mentionne {0}, ce qui est nouveau"],
    ["Share {0}", "Partager : {0}"],
    ["{0} will be sent first.", "{0|Elle sera envoyée|Elles seront envoyées} en premier."],
    ["{0} win{1:s} and {2} jackpot{3:s}.", "{0} {0|victoire|victoires} et {2} {2|gros lot|gros lots}."],
    ["Saved for {0}", "Enregistré pour {0}"],
    ["{0} in {1}", "{0} dans {1}"],
    ["Imported {0}", "Importé : {0}"],
    ["{0} shot{1:s}", "{0} {0|lancer|lancers}"],
  ],
});

describe("exact and patterns", () => {
  it("translates exact text and keeps React's outer spaces", () => {
    expect(tr.translate(" Save ")).toBe(" Enregistrer ");
  });
  it("returns null from lookup when there is no entry", () => {
    expect(tr.lookup("Nothing here")).toBeNull();
    expect(tr.translate("Nothing here")).toBe("Nothing here");
  });
  it("fills a pattern and picks the French plural (0 and 1 are singular)", () => {
    expect(tr.translate("1 game logged")).toBe("1 partie enregistrée");
    expect(tr.translate("0 games logged")).toBe("0 partie enregistrée");
    expect(tr.translate("3 games logged")).toBe("3 parties enregistrées");
  });
  it("finds a pattern whose longest word the English pluralizes", () => {
    expect(tr.translate("3 wins and 2 jackpots.")).toBe("3 victoires et 2 gros lots.");
    expect(tr.translate("1 win and 1 jackpot.")).toBe("1 victoire et 1 gros lot.");
  });
  it("keeps an English plural ending from swallowing a neighbour", () => {
    expect(tr.translate("12 shots")).toBe("12 lancers");
  });
});

describe("captured values", () => {
  it("translates a captured value that has an entry", () => {
    expect(tr.translate("Delete game Practice?")).toBe("Supprimer la partie entraînement?");
  });
  it("lower-cases a translated word in the middle of a sentence", () => {
    expect(tr.translate("Earned in League only")).toBe("S'obtient en ligue seulement");
    expect(tr.translate("Right-handed")).toBe("Main droite");
  });
  it("finds a lower-case capture through the capitalised entry", () => {
    expect(tr.translate("Earned in league only")).toBe("S'obtient en ligue seulement");
  });
  it("lower-cases a translated word after a colon, as French does", () => {
    expect(tr.translate("Share Practice")).toBe(`Partager${NB}: entraînement`);
  });
  it("translates a capture that is itself a pattern", () => {
    expect(tr.translate("Imported 3 shots")).toBe(`Importé${NB}: 3 lancers`);
  });
  it("translates a list built in code when every item is known", () => {
    expect(tr.translate("Mentions strike rate and spare rate, which is new"))
      .toBe("Mentionne le taux d'abats et le taux de réserves, ce qui est nouveau");
  });
  it("leaves a list alone when an item is unknown", () => {
    expect(tr.translate("Mentions strike rate and luck, which is new"))
      .toBe("Mentionne strike rate and luck, ce qui est nouveau");
  });
  it("picks the plural from a word when there is no number", () => {
    expect(tr.translate("It will be sent first.")).toBe("Elle sera envoyée en premier.");
    expect(tr.translate("They will be sent first.")).toBe("Elles seront envoyées en premier.");
  });
  it("does not glue a captured value to its neighbour", () => {
    expect(tr.translate("Saved for  Bob")).toBe("Enregistré pour Bob");
  });
});

describe("hard cases", () => {
  const t4 = createTranslator({
    exact: { ", not bowled": ", non joué", "Hybrid": "Hybride", "At a glance": "En un coup d'œil" },
    patterns: [
      ["Frame {0}{1}{2}", "Carreau {0}{1}{2}"],
      ["{0} of {1}", "{0} sur {1}"],
      ["at {0}", "à {0}"],
      ["{0} shot{1:s}", "{0} {0|lancer|lancers}"],
    ],
  });
  it("splits two values side by side at the number", () => {
    expect(t4.translate("Frame 10, not bowled")).toBe("Carreau 10, non joué");
  });
  it("does not let a short pattern half-translate an English sentence", () => {
    expect(t4.translate("Every phase of what it paid")).toBe("Every phase of what it paid");
    expect(t4.translate("at a party")).toBe("at a party");
    expect(t4.translate("3 of 10")).toBe("3 sur 10");
    expect(t4.translate("at Bowl-O-Rama")).toBe("à Bowl-O-Rama");
  });
  it("translates each fact of a line joined with middle dots", () => {
    expect(t4.translate("134 shots · Hybrid · RG 2.5")).toBe("134 lancers · Hybride · RG 2,5");
  });
});

describe("protected names", () => {
  it("never translates a name the bowler typed", () => {
    const t2 = createTranslator({ exact: { "Split Happens": "Écarts de conduite", "League": "Ligue" }, patterns: [["{0} in {1}", "{0} dans {1}"]] });
    expect(t2.translate("Split Happens")).toBe("Écarts de conduite");
    t2.protect(["Split Happens"]);
    expect(t2.translate("Split Happens")).toBe("Split Happens");
    expect(t2.translate("League in Split Happens")).toBe("Ligue dans Split Happens");
  });
});

describe("case", () => {
  it("capitalises a lower-case French word used as a whole label", () => {
    expect(tr.translate("Sunday")).toBe("Dimanche");
  });
  it("lower-cases a label that code lower-cased", () => {
    expect(tr.translate("won it")).toBe("gagné");
  });
});

describe("sentences run together", () => {
  it("translates each sentence when all are known", () => {
    expect(tr.translate("No shots yet. Log one.")).toBe("Aucun lancer. Enregistrez-en un.");
  });
  it("leaves the whole thing when one sentence is unknown", () => {
    expect(tr.translate("No shots yet. Something else.")).toBe("No shots yet. Something else.");
  });
});

describe("messages", () => {
  it("translates paragraph by paragraph", () => {
    expect(tr.translateMessage("Save\n\nDelete game 3?")).toBe("Enregistrer\n\nSupprimer la partie 3?");
  });
});

describe("frenchNumbers", () => {
  it("formats money, percent, decimals and thousands", () => {
    expect(frenchNumbers("$6.99")).toBe(`6,99${NB}$`);
    expect(frenchNumbers("-$1,234.50")).toBe(`-1${NN}234,50${NB}$`);
    expect(frenchNumbers("54%")).toBe(`54${NB}%`);
    expect(frenchNumbers("avg 198.4")).toBe("avg 198,4");
    expect(frenchNumbers("12,345 pins")).toBe(`12${NN}345 pins`);
    expect(frenchNumbers("15lb")).toBe(`15${NB}lb`);
  });
  it("converts the 12-hour clock and ordinals", () => {
    expect(frenchNumbers("7:30 PM")).toBe(`19${NB}h${NB}30`);
    expect(frenchNumbers("9am")).toBe(`9${NB}h`);
    expect(frenchNumbers("1st and 3rd")).toBe("1er and 3e");
  });
  it("leaves versions, emails and links alone", () => {
    expect(frenchNumbers("v1.2.3")).toBe("v1.2.3");
    expect(frenchNumbers("a@b.com 1.5")).toBe("a@b.com 1.5");
  });
});

describe("punctuation", () => {
  it("puts a non-breaking space before a colon and removes stray spaces", () => {
    const t3 = createTranslator({ patterns: [["Team: {0}", "Équipe : {0}"], ["Done {0}.", "Terminé {0}."]] });
    expect(t3.translate("Team: Pins")).toBe(`Équipe${NB}: Pins`);
    expect(t3.translate("Done .")).toBe("Terminé.");
  });
});

// Latin American Spanish: English-style numbers, 12-hour "p. m." times,
// ordinals 3.º, " y " in lists, and only exactly 1 is singular.
describe("Spanish (es-419)", () => {
  const es = createTranslator({
    lang: "es",
    exact: { "Practice": "Práctica", "League": "Liga", "Save": "Guardar", "Ready?": "¿Listo?" },
    patterns: [
      ["{0} game{1:s} logged", "{0} {0|juego registrado|juegos registrados}"],
      ["Starts at {0}", "Empieza a las {0}"],
      ["Paid {0}", "Pagado: {0}"],
      ["Earned in {0} only", "Se obtiene solo en {0}"],
    ],
  });
  it("keeps English-style numbers, money and percent", () => {
    expect(es.translate("198.4")).toBe("198.4");
    expect(es.translate("12,345")).toBe("12,345");
    expect(es.translate("Paid $4.99")).toBe("Pagado: $4.99");
    expect(es.translate("54%")).toBe("54%");
  });
  it("writes times and ordinals the Spanish way", () => {
    expect(es.translate("Starts at 7:30 PM")).toBe("Empieza a las 7:30 p. m.");
    expect(es.translate("3rd")).toBe("3.º");
  });
  it("takes the singular only for exactly one", () => {
    expect(es.translate("0 games logged")).toBe("0 juegos registrados");
    expect(es.translate("1 game logged")).toBe("1 juego registrado");
    expect(es.translate("2 games logged")).toBe("2 juegos registrados");
  });
  it("joins lists with y and adds no space before punctuation", () => {
    expect(es.translate("Earned in Practice and League only")).toBe("Se obtiene solo en práctica y liga");
    expect(es.translate("Ready?")).toBe("¿Listo?");
  });
  it("still defaults to French rules for a catalog with no lang", () => {
    expect(tr.translate("198.4")).toBe("198,4");
  });
});
