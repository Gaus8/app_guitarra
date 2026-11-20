/* Motor musical: notas, acordes, escalas y sonido de referencia. */
var SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  var LATIN_SHARP = ["Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"];
  var LATIN_FLAT = ["Do", "Re♭", "Re", "Mi♭", "Mi", "Fa", "Sol♭", "Sol", "La♭", "La", "Si♭", "Si"];
  var LETTERS = "CDEFGAB";
  var LETTER_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  var NATURAL_PC = [0, 2, 4, 5, 7, 9, 11];

  // Cuerda 6 (Mi grave) → cuerda 1 (Mi agudo). MIDI: E2 A2 D3 G3 B3 E4.
  var OPEN_PC = [4, 9, 2, 7, 11, 4];
  var OPEN_MIDI = [40, 45, 50, 55, 59, 64];
  var STRING_NAME = ["Mi grave", "La", "Re", "Sol", "Si", "Mi agudo"];
  var STRING_SHORT = ["E", "A", "D", "G", "B", "e"];

  var INTERVALS = [
    { semi: 0, name: "unísono", short: "1" },
    { semi: 1, name: "segunda menor", short: "b2" },
    { semi: 2, name: "segunda mayor", short: "2" },
    { semi: 3, name: "tercera menor", short: "b3" },
    { semi: 4, name: "tercera mayor", short: "3" },
    { semi: 5, name: "cuarta justa", short: "4" },
    { semi: 6, name: "tritono", short: "b5" },
    { semi: 7, name: "quinta justa", short: "5" },
    { semi: 8, name: "sexta menor", short: "b6" },
    { semi: 9, name: "sexta mayor", short: "6" },
    { semi: 10, name: "séptima menor", short: "b7" },
    { semi: 11, name: "séptima mayor", short: "7" }
  ];

  var DEGREE = {
    "1": { semi: 0, letter: 0 },
    "b2": { semi: 1, letter: 1 },
    "2": { semi: 2, letter: 1 },
    "9": { semi: 2, letter: 1 },
    "#9": { semi: 3, letter: 1 },
    "b3": { semi: 3, letter: 2 },
    "3": { semi: 4, letter: 2 },
    "4": { semi: 5, letter: 3 },
    "#4": { semi: 6, letter: 3 },
    "b5": { semi: 6, letter: 4 },
    "5": { semi: 7, letter: 4 },
    "#5": { semi: 8, letter: 4 },
    "b6": { semi: 8, letter: 5 },
    "6": { semi: 9, letter: 5 },
    "bb7": { semi: 9, letter: 6 },
    "b7": { semi: 10, letter: 6 },
    "7": { semi: 11, letter: 6 }
  };

  var QUALITIES = [
    { id: "maj", name: "mayor", symbol: "", tokens: ["1", "3", "5"], group: "triada", blurb: "La tríada básica. Tercera mayor: suena estable y abierto." },
    { id: "min", name: "menor", symbol: "m", tokens: ["1", "b3", "5"], group: "triada", blurb: "Igual que el mayor, con la tercera un semitono más grave." },
    { id: "5", name: "quinta", symbol: "5", tokens: ["1", "5"], group: "triada", blurb: "Power chord. Sin tercera: no es mayor ni menor. El bloque del rock." },
    { id: "sus2", name: "sus2", symbol: "sus2", tokens: ["1", "2", "5"], group: "triada", blurb: "La segunda ocupa el lugar de la tercera. Queda en el aire." },
    { id: "sus4", name: "sus4", symbol: "sus4", tokens: ["1", "4", "5"], group: "triada", blurb: "La cuarta sustituye a la tercera. Pide caer al acorde mayor." },
    { id: "dim", name: "disminuido", symbol: "dim", tokens: ["1", "b3", "b5"], group: "triada", blurb: "Tercera menor y quinta baja. Inestable, de paso." },
    { id: "aug", name: "aumentado", symbol: "aug", tokens: ["1", "3", "#5"], group: "triada", blurb: "Quinta subida un semitono. Suena flotando." },
    { id: "7", name: "séptima", symbol: "7", tokens: ["1", "3", "5", "b7"], group: "septima", blurb: "Dominante. Es el acorde que empuja hacia la tónica. Base del blues." },
    { id: "maj7", name: "séptima mayor", symbol: "maj7", tokens: ["1", "3", "5", "7"], group: "septima", blurb: "La séptima queda pegada a la octava. Suave, de balada." },
    { id: "m7", name: "menor 7", symbol: "m7", tokens: ["1", "b3", "5", "b7"], group: "septima", blurb: "El menor, más amplio. Muy común en pop y en jazz." },
    { id: "m7b5", name: "semidisminuido", symbol: "m7b5", tokens: ["1", "b3", "b5", "b7"], group: "septima", blurb: "Menor siete con la quinta baja. El vii de la tonalidad mayor." },
    { id: "dim7", name: "disminuido 7", symbol: "dim7", tokens: ["1", "b3", "b5", "bb7"], group: "septima", blurb: "Simétrico: de cada nota a la siguiente hay una tercera menor." },
    { id: "7sus4", name: "7sus4", symbol: "7sus4", tokens: ["1", "4", "5", "b7"], group: "septima", blurb: "Sus4 con séptima menor. Muy de rock y de funk suave." },
    { id: "7#9", name: "7#9", symbol: "7#9", tokens: ["1", "3", "b7", "#9"], group: "septima", blurb: "El acorde de Hendrix: tercera mayor y #9 a la vez." },
    { id: "6", name: "sexta", symbol: "6", tokens: ["1", "3", "5", "6"], group: "color", blurb: "Mayor con la sexta. Brilla en el blues mayor." },
    { id: "m6", name: "menor 6", symbol: "m6", tokens: ["1", "b3", "5", "6"], group: "color", blurb: "Menor con sexta. Sonido de jazz y de tango." },
    { id: "add9", name: "add9", symbol: "add9", tokens: ["1", "3", "5", "9"], group: "color", blurb: "Mayor más la novena, sin séptima. Color de pop." },
    { id: "9", name: "novena", symbol: "9", tokens: ["1", "3", "5", "b7", "9"], group: "color", blurb: "Dominante con novena. Funk, soul, jazz." },
    { id: "maj9", name: "novena mayor", symbol: "maj9", tokens: ["1", "3", "5", "7", "9"], group: "color", blurb: "maj7 con novena. Amplio y luminoso." },
    { id: "m9", name: "menor 9", symbol: "m9", tokens: ["1", "b3", "5", "b7", "9"], group: "color", blurb: "m7 con novena. Una de las sonoridades más dulces del mástil." }
  ];

  var SCALES = [
    { id: "major", name: "Mayor", aka: "jónica", intervals: [0, 2, 4, 5, 7, 9, 11], formula: "1 2 3 4 5 6 7", use: "La escala de referencia. De aquí salen los modos y los acordes de la tonalidad." },
    { id: "minor", name: "Menor natural", aka: "eólica", intervals: [0, 2, 3, 5, 7, 8, 10], formula: "1 2 b3 4 5 b6 b7", use: "La relativa menor. En el rock y el pop triste es la casa." },
    { id: "harmonic", name: "Menor armónica", aka: "", intervals: [0, 2, 3, 5, 7, 8, 11], formula: "1 2 b3 4 5 b6 7", use: "La menor natural con la séptima subida. Por eso el V grado puede ser mayor." },
    { id: "melodic", name: "Menor melódica", aka: "", intervals: [0, 2, 3, 5, 7, 9, 11], formula: "1 2 b3 4 5 6 7", use: "Sube con 6 y 7 mayores. En jazz se usa también al bajar." },
    { id: "pentMaj", name: "Pentatónica mayor", aka: "", intervals: [0, 2, 4, 7, 9], formula: "1 2 3 5 6", use: "Cinco notas, ningún semitono. Country, pop, solos cantables." },
    { id: "pentMin", name: "Pentatónica menor", aka: "", intervals: [0, 3, 5, 7, 10], formula: "1 b3 4 5 b7", use: "La primera escala que conviene tener en los dedos. Rock, blues, solos." },
    { id: "blues", name: "Blues", aka: "", intervals: [0, 3, 5, 6, 7, 10], formula: "1 b3 4 b5 5 b7", use: "La pentatónica menor más la nota de blues (b5). Con eso ya se habla el idioma." },
    { id: "dorian", name: "Dórica", aka: "modo", intervals: [0, 2, 3, 5, 7, 9, 10], formula: "1 2 b3 4 5 6 b7", use: "Menor, pero con la sexta mayor. Santana, funk, rock modal." },
    { id: "phrygian", name: "Frigia", aka: "modo", intervals: [0, 1, 3, 5, 7, 8, 10], formula: "1 b2 b3 4 5 b6 b7", use: "El semitono al principio le da el color flamenco y oscuro." },
    { id: "lydian", name: "Lidia", aka: "modo", intervals: [0, 2, 4, 6, 7, 9, 11], formula: "1 2 3 #4 5 6 7", use: "Mayor con la cuarta subida. Suena a película, flotando." },
    { id: "mixolydian", name: "Mixolidia", aka: "modo", intervals: [0, 2, 4, 5, 7, 9, 10], formula: "1 2 3 4 5 6 b7", use: "Mayor con séptima menor. Es la escala del acorde dominante y del rock sureño." },
    { id: "locrian", name: "Locria", aka: "modo", intervals: [0, 1, 3, 5, 6, 8, 10], formula: "1 b2 b3 4 b5 b6 b7", use: "La más inestable. Encaja sobre el acorde semidisminuido." },
    { id: "whole", name: "Tonos enteros", aka: "", intervals: [0, 2, 4, 6, 8, 10], formula: "1 2 3 #4 #5 b7", use: "Solo tonos, sin semitonos. Impresionista, de sueño." },
    { id: "chromatic", name: "Cromática", aka: "", intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], formula: "los 12 semitonos", use: "Todas las notas. Sirve para ver el mástil completo y para el ejercicio 1-2-3-4." }
  ];

  // priority: 0 cómoda, 1 forma Mi, 2 forma La, 3 forma Re, 5 CAGED avanzado.
  // offsets: semitonos respecto al traste de la fundamental. null = cuerda muda.
  var MOVABLE = [
    shape("maj", "forma de Mi", 1, 0, [0, 2, 2, 1, 0, 0]),
    shape("maj", "forma de La", 2, 1, [null, 0, 2, 2, 2, 0]),
    shape("maj", "forma de Re", 3, 2, [null, null, 0, 2, 3, 2]),
    shape("maj", "forma de Sol", 5, 0, [0, -1, -3, -3, -3, 0]),
    shape("maj", "forma de Do", 5, 1, [null, 0, -1, -3, -2, -3]),

    shape("min", "forma de Mi", 1, 0, [0, 2, 2, 0, 0, 0]),
    shape("min", "forma de La", 2, 1, [null, 0, 2, 2, 1, 0]),
    shape("min", "forma de Re", 3, 2, [null, null, 0, 2, 3, 1]),

    shape("5", "quinta en 6ª", 1, 0, [0, 2, 2, null, null, null]),
    shape("5", "quinta en 5ª", 2, 1, [null, 0, 2, 2, null, null]),

    shape("7", "forma de Mi", 1, 0, [0, 2, 0, 1, 0, 0]),
    shape("7", "forma de La", 2, 1, [null, 0, 2, 0, 2, 0]),
    shape("7", "forma de Re", 3, 2, [null, null, 0, 2, 1, 2]),

    shape("maj7", "forma de Mi", 1, 0, [0, 2, 1, 1, 0, 0]),
    shape("maj7", "forma de La", 2, 1, [null, 0, 2, 1, 2, 0]),
    shape("maj7", "forma de Re", 3, 2, [null, null, 0, 2, 2, 2]),

    shape("m7", "forma de Mi", 1, 0, [0, 2, 0, 0, 0, 0]),
    shape("m7", "forma de La", 2, 1, [null, 0, 2, 0, 1, 0]),
    shape("m7", "forma de Re", 3, 2, [null, null, 0, 2, 1, 1]),

    shape("sus2", "forma de La", 2, 1, [null, 0, 2, 2, 0, 0]),
    shape("sus2", "forma de Re", 3, 2, [null, null, 0, 2, 3, 0]),
    shape("sus2", "forma de Mi", 4, 0, [0, 2, 4, 4, 0, 0]),

    shape("sus4", "forma de Mi", 1, 0, [0, 2, 2, 2, 0, 0]),
    shape("sus4", "forma de La", 2, 1, [null, 0, 2, 2, 3, 0]),
    shape("sus4", "forma de Re", 3, 2, [null, null, 0, 2, 3, 3]),

    shape("dim", "forma reducida", 1, 1, [null, 0, 1, 2, 1, null]),
    shape("dim7", "desde la 4ª", 1, 2, [null, null, 0, 1, 0, 1]),
    shape("dim7", "desde la 5ª", 2, 1, [null, 0, 1, 2, 1, 2]),
    shape("aug", "forma de Mi", 1, 0, [0, 3, 2, 1, 1, 0]),
    shape("m7b5", "forma de La", 1, 1, [null, 0, 1, 0, 1, null]),

    shape("6", "forma de Mi", 1, 0, [0, 2, 2, 1, 2, 0]),
    shape("6", "forma de La", 2, 1, [null, 0, 2, 2, 2, 2]),
    shape("m6", "forma de La", 1, 1, [null, 0, 2, 2, 1, 2]),

    shape("add9", "forma de La", 1, 1, [null, 0, 2, 4, 2, 0]),
    shape("add9", "forma de Mi", 2, 0, [0, 2, 4, 1, 0, 0]),

    shape("9", "forma de Mi", 1, 0, [0, 2, 0, 1, 0, 2]),
    shape("maj9", "forma de Mi", 1, 0, [0, 2, 1, 1, 0, 2]),
    shape("m9", "forma de Mi", 1, 0, [0, 2, 0, 0, 0, 2]),
    shape("7sus4", "forma de Mi", 1, 0, [0, 2, 0, 2, 0, 0]),
    shape("7sus4", "forma de La", 2, 1, [null, 0, 2, 0, 3, 0]),
    shape("7#9", "forma de Hendrix", 1, 1, [null, 0, -1, 0, 1, null])
  ];

  var FIXED = [
    fixed("maj", "al aire", 0, 0, [-1, 3, 2, 0, 1, 0]),
    fixed("maj", "al aire", 0, 7, [3, 2, 0, 0, 0, 3]),
    fixed("maj", "Sol con bajos en Re y Sol", 4, 7, [3, 2, 0, 0, 3, 3]),
    fixed("maj", "Fa cómodo", 0, 5, [-1, -1, 3, 2, 1, 1]),
    fixed("maj7", "al aire", 0, 0, [-1, 3, 2, 0, 0, 0]),
    fixed("maj7", "al aire", 0, 7, [3, 2, 0, 0, 0, 2]),
    fixed("maj7", "Fa cómodo", 0, 5, [-1, -1, 3, 2, 1, 0]),
    fixed("7", "al aire", 0, 7, [3, 2, 0, 0, 0, 1]),
    fixed("7", "Si cómodo", 0, 11, [-1, 2, 1, 2, 0, 2]),
    fixed("sus4", "al aire", 0, 7, [3, 3, 0, 0, 1, 3]),
    fixed("add9", "al aire", 0, 0, [-1, 3, 2, 0, 3, 0]),
    fixed("m7", "variante", 4, 4, [0, 2, 2, 0, 3, 0])
  ];

  var FINGER_OVERRIDE = {
    "0,2,2,0,0,0": [0, 2, 3, 0, 0, 0],
    "0,2,2,2,0,0": [0, 2, 3, 4, 0, 0],
    "0,2,1,1,0,0": [0, 2, 1, 1, 0, 0],
    "3,2,0,0,0,3": [2, 1, 0, 0, 0, 4],
    "3,2,0,0,3,3": [2, 1, 0, 0, 3, 4],
    "-1,-1,3,2,1,1": [0, 0, 3, 2, 1, 1],
    "-1,0,2,0,2,0": [0, 0, 2, 0, 3, 0],
    "-1,-1,0,2,1,1": [0, 0, 0, 2, 1, 1]
  };

  function shape(quality, name, priority, rootString, offsets) {
    return { kind: "move", quality: quality, name: name, priority: priority, rootString: rootString, offsets: offsets };
  }

  function fixed(quality, name, priority, rootPc, frets) {
    return { kind: "fixed", quality: quality, name: name, priority: priority, rootPc: rootPc, frets: frets };
  }

  function qualityById(id) {
    for (var i = 0; i < QUALITIES.length; i++) if (QUALITIES[i].id === id) return QUALITIES[i];
    return null;
  }

  function scaleById(id) {
    for (var i = 0; i < SCALES.length; i++) if (SCALES[i].id === id) return SCALES[i];
    return null;
  }

  function pcOfName(name) {
    if (!name) return null;
    var n = String(name).replace("♯", "#").replace("♭", "b");
    var i = SHARP.indexOf(n);
    if (i >= 0) return i;
    i = FLAT.indexOf(n);
    if (i >= 0) return i;
    return null;
  }

  function preferFlat(pc, accidental) {
    if (accidental === "flat") return true;
    if (accidental === "sharp") return false;
    return pc === 1 || pc === 3 || pc === 8 || pc === 10;
  }

  function noteName(pc, naming) {
    naming = naming || {};
    var pcN = ((pc % 12) + 12) % 12;
    var flat = preferFlat(pcN, naming.accidental || "auto");
    if (naming.system === "latin") return flat ? LATIN_FLAT[pcN] : LATIN_SHARP[pcN];
    return flat ? FLAT[pcN] : SHARP[pcN];
  }

  function bothNames(pc, naming) {
    var cipher = noteName(pc, { accidental: (naming && naming.accidental) || "auto", system: "cipher" });
    var latin = noteName(pc, { accidental: (naming && naming.accidental) || "auto", system: "latin" });
    return { cipher: cipher, latin: latin };
  }

  function rootNameForSpelling(pc, naming) {
    return noteName(pc, { accidental: (naming && naming.accidental) || "auto", system: "cipher" });
  }

  function spellToken(rootPc, token, naming) {
    var info = DEGREE[token];
    var rootLabel = rootNameForSpelling(rootPc, naming);
    var match = rootLabel.match(/^([A-G])([#b])?$/);
    var letterIdx = LETTER_INDEX[match[1]];
    var targetLetter = (letterIdx + info.letter) % 7;
    var natural = NATURAL_PC[targetLetter];
    var wanted = (rootPc + info.semi) % 12;
    var diff = (wanted - natural + 12) % 12;
    if (diff > 6) diff -= 12;
    var acc = "";
    if (diff === 1) acc = "#";
    else if (diff === 2) acc = "##";
    else if (diff === -1) acc = "b";
    else if (diff === -2) acc = "bb";
    return LETTERS[targetLetter] + acc;
  }

  function chordTones(rootPc, qualityId, naming) {
    var q = qualityById(qualityId);
    return q.tokens.map(function (token) {
      return {
        token: token,
        semi: DEGREE[token].semi % 12,
        name: spellToken(rootPc, token, naming)
      };
    });
  }

  function intervalName(semitones) {
    var s = ((semitones % 12) + 12) % 12;
    return INTERVALS[s];
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function octaveOf(midi) {
    return Math.floor(midi / 12) - 1;
  }

  function autoFingers(frets) {
    var groups = [];
    var indexByFret = {};
    frets.forEach(function (f, i) {
      if (f > 0) {
        if (indexByFret[f] == null) {
          indexByFret[f] = groups.length;
          groups.push({ fret: f, strings: [] });
        }
        groups[indexByFret[f]].strings.push(i);
      }
    });
    groups.sort(function (a, b) { return a.fret - b.fret; });
    var total = 0;
    groups.forEach(function (g) { total += g.strings.length; });
    var fingers = [0, 0, 0, 0, 0, 0];
    var finger = 1;
    groups.forEach(function (g, gi) {
      var barre = gi === 0 && g.strings.length >= 2 && total > 4;
      var mini = g.strings.length >= 3 && finger + g.strings.length - 1 > 4;
      if (barre || mini) {
        g.strings.forEach(function (s) { fingers[s] = finger; });
        finger += 1;
      } else {
        g.strings.forEach(function (s) {
          fingers[s] = Math.min(4, finger);
          finger += 1;
        });
      }
    });
    var key = frets.join(",");
    if (FINGER_OVERRIDE[key]) return FINGER_OVERRIDE[key].slice();
    return fingers;
  }

  function barreOf(frets) {
    var items = [];
    frets.forEach(function (f, i) { if (f > 0) items.push({ f: f, i: i }); });
    if (items.length < 5) return null;
    var min = items[0].f;
    items.forEach(function (it) { if (it.f < min) min = it.f; });
    var at = items.filter(function (it) { return it.f === min; });
    var higher = items.some(function (it) { return it.f > min; });
    if (!higher || at.length < 2) return null;
    var from = at[0].i;
    var to = at[0].i;
    at.forEach(function (it) {
      if (it.i < from) from = it.i;
      if (it.i > to) to = it.i;
    });
    return { fret: min, from: from, to: to };
  }

  function pcsOfFrets(frets) {
    var pcs = [];
    frets.forEach(function (f, i) {
      if (f >= 0) pcs.push((OPEN_PC[i] + f) % 12);
    });
    return pcs;
  }

  function intervalsOf(qualityId) {
    return qualityById(qualityId).tokens.map(function (token) { return DEGREE[token].semi; });
  }

  function voicingValid(frets, rootPc, qualityId) {
    var pcs = pcsOfFrets(frets);
    if (pcs.length < 2) return false;
    var intervals = intervalsOf(qualityId);
    var allowed = {};
    intervals.forEach(function (iv) { allowed[(rootPc + iv) % 12] = true; });
    for (var i = 0; i < pcs.length; i++) if (!allowed[pcs[i]]) return false;
    if (pcs.indexOf(rootPc) < 0) return false;
    var uniq = [];
    intervals.forEach(function (iv) {
      var n = ((iv % 12) + 12) % 12;
      if (uniq.indexOf(n) < 0) uniq.push(n);
    });
    var required = uniq.filter(function (iv) {
      if (iv === 0) return true;
      if (iv === 7 && uniq.length >= 4) return false;
      return true;
    });
    for (var r = 0; r < required.length; r++) {
      if (pcs.indexOf((rootPc + required[r]) % 12) < 0) return false;
    }
    return true;
  }

  function materializeMove(spec, rootFret) {
    var frets = spec.offsets.map(function (o) {
      return o == null ? -1 : rootFret + o;
    });
    if (frets.some(function (f) { return f > 15; })) return null;
    if (frets.some(function (f, i) { return spec.offsets[i] != null && f < 0; })) return null;
    var rootPc = (OPEN_PC[spec.rootString] + rootFret) % 12;
    if (!voicingValid(frets, rootPc, spec.quality)) return null;
    var hasOpen = frets.indexOf(0) >= 0;
    return {
      frets: frets,
      fingers: autoFingers(frets),
      barre: barreOf(frets),
      rootPc: rootPc,
      quality: spec.quality,
      name: hasOpen ? "al aire" : spec.name,
      priority: spec.priority,
      signature: frets.join(",")
    };
  }

  function materializeFixed(spec) {
    if (!voicingValid(spec.frets, spec.rootPc, spec.quality)) return null;
    return {
      frets: spec.frets.slice(),
      fingers: autoFingers(spec.frets),
      barre: barreOf(spec.frets),
      rootPc: spec.rootPc,
      quality: spec.quality,
      name: spec.name,
      priority: spec.priority,
      signature: spec.frets.join(",")
    };
  }

  function rankVoicing(v) {
    var pos = v.frets.filter(function (f) { return f > 0; });
    var min = pos.length ? Math.min.apply(null, pos) : 0;
    var opens = v.frets.indexOf(0) >= 0 ? -30 : 0;
    var barre = v.barre ? 6 : 0;
    return v.priority * 8 + min * 6 + opens + barre;
  }

  function voicingsFor(rootPc, qualityId) {
    var list = [];
    var seen = {};
    FIXED.forEach(function (spec) {
      if (spec.quality !== qualityId || spec.rootPc !== rootPc) return;
      var v = materializeFixed(spec);
      if (!v || seen[v.signature]) return;
      seen[v.signature] = true;
      list.push(v);
    });
    MOVABLE.forEach(function (spec) {
      if (spec.quality !== qualityId) return;
      if (spec.offsets[spec.rootString] !== 0) return;
      var open = OPEN_PC[spec.rootString];
      var base = (rootPc - open + 12) % 12;
      var neg = spec.offsets.filter(function (o) { return o != null && o < 0; });
      var minFret = neg.length ? -Math.min.apply(null, neg) : 0;
      var hi = Math.max.apply(null, spec.offsets.filter(function (o) { return o != null; }));
      var maxFret = Math.min(12, 15 - hi);
      [base, base + 12].forEach(function (rootFret) {
        if (rootFret < minFret || rootFret > maxFret) return;
        var v = materializeMove(spec, rootFret);
        if (!v || seen[v.signature]) return;
        seen[v.signature] = true;
        list.push(v);
      });
    });
    list.sort(function (a, b) { return rankVoicing(a) - rankVoicing(b); });
    return list.slice(0, 6);
  }

  function chordSymbol(rootPc, qualityId, naming) {
    var q = qualityById(qualityId);
    return noteName(rootPc, naming) + q.symbol;
  }

  function parseChord(symbol) {
    if (!symbol) return null;
    var raw = String(symbol).trim().replace("♯", "#").replace("♭", "b");
    var match = raw.match(/^([A-G](?:#|b)?)(.*)$/);
    if (!match) return null;
    var rootPc = pcOfName(match[1]);
    if (rootPc == null) return null;
    var rest = match[2];
    var pairs = QUALITIES.map(function (q) { return [q.symbol, q.id]; });
    pairs.sort(function (a, b) { return b[0].length - a[0].length; });
    var qualityId = null;
    for (var i = 0; i < pairs.length; i++) {
      if (rest === pairs[i][0]) { qualityId = pairs[i][1]; break; }
    }
    if (!qualityId) return null;
    return { rootPc: rootPc, qualityId: qualityId, rootName: match[1], symbol: raw };
  }

  function findVoicing(symbol, hint) {
    var parsed = parseChord(symbol);
    if (!parsed) return null;
    var list = voicingsFor(parsed.rootPc, parsed.qualityId);
    if (hint) {
      var wanted = hint.join ? hint.join(",") : hint;
      for (var i = 0; i < list.length; i++) if (list[i].signature === wanted) return list[i];
    }
    return list[0] || null;
  }

  function scaleIntervals(scaleId) {
    var sc = scaleById(scaleId);
    return sc ? sc.intervals.slice() : [];
  }

  function diatonic(rootPc, mode) {
    var majorIv = [0, 2, 4, 5, 7, 9, 11];
    var minorIv = [0, 2, 3, 5, 7, 8, 10];
    var iv = mode === "minor" ? minorIv : majorIv;
    var quals = mode === "minor"
      ? ["min", "dim", "maj", "min", "min", "maj", "maj"]
      : ["maj", "min", "min", "maj", "maj", "min", "dim"];
    var degrees = mode === "minor"
      ? ["i", "ii°", "III", "iv", "v", "VI", "VII"]
      : ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
    return iv.map(function (step, i) {
      return {
        degree: degrees[i],
        pc: (rootPc + step) % 12,
        qualityId: quals[i],
        scaleDegree: i + 1
      };
    });
  }

  function keySignature(rootPc, mode) {
    var majorPc = mode === "minor" ? (rootPc + 3) % 12 : rootPc;
    var sharpKeys = [0, 7, 2, 9, 4, 11, 6];
    var sharpNames = ["Fa#", "Do#", "Sol#", "Re#", "La#", "Mi#", "Si#"];
    var si = sharpKeys.indexOf(majorPc);
    if (si >= 0) {
      return { count: si, kind: si ? "sostenidos" : "ninguna", notes: sharpNames.slice(0, si) };
    }
    var flatKeys = [5, 10, 3, 8, 1];
    var flatNames = ["Sib", "Mib", "Lab", "Reb", "Solb"];
    var fi = flatKeys.indexOf(majorPc);
    if (fi >= 0) return { count: fi + 1, kind: "bemoles", notes: flatNames.slice(0, fi + 1) };
    return { count: 0, kind: "ninguna", notes: [] };
  }

  function detectChords(pcs) {
    pcs = pcs.filter(function (pc, i) { return pcs.indexOf(pc) === i; });
    if (pcs.length < 2) return [];
    var found = [];
    for (var root = 0; root < 12; root++) {
      QUALITIES.forEach(function (q) {
        var allowed = q.tokens.map(function (token) { return (root + DEGREE[token].semi) % 12; });
        var ok = pcs.every(function (pc) { return allowed.indexOf(pc) >= 0; });
        if (!ok) return;
        if (allowed.indexOf(root) < 0) return;
        if (pcs.indexOf(root) < 0) return;
        var uniq = [];
        q.tokens.forEach(function (token) {
          var n = DEGREE[token].semi % 12;
          if (uniq.indexOf(n) < 0) uniq.push(n);
        });
        var required = uniq.filter(function (iv) {
          if (iv === 0) return true;
          if (iv === 7 && uniq.length >= 4) return false;
          return true;
        });
        var hasAll = required.every(function (iv) { return pcs.indexOf((root + iv) % 12) >= 0; });
        if (!hasAll) return;
        found.push({
          rootPc: root,
          qualityId: q.id,
          extra: allowed.length - pcs.length,
          size: q.tokens.length
        });
      });
    }
    found.sort(function (a, b) {
      if (a.extra !== b.extra) return a.extra - b.extra;
      return b.size - a.size;
    });
    return found.slice(0, 6);
  }

  function noteAt(stringIndex, fret) {
    var midi = OPEN_MIDI[stringIndex] + fret;
    return { midi: midi, pc: midi % 12, stringIndex: stringIndex, fret: fret };
  }

  var audio = { ctx: null, nodes: [] };

  function ensureAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audio.ctx) audio.ctx = new AC();
    if (audio.ctx.state === "suspended") audio.ctx.resume();
    return audio.ctx;
  }

  function track(node) {
    audio.nodes.push(node);
    node.onended = function () {
      var i = audio.nodes.indexOf(node);
      if (i >= 0) audio.nodes.splice(i, 1);
    };
  }

  function stopAudio() {
    audio.nodes.forEach(function (node) {
      try { node.stop(); } catch (err) { /* already stopped */ }
    });
    audio.nodes = [];
  }

  function pluck(midi, when, dur, bend) {
    var ctx = ensureAudio();
    if (!ctx) return;
    var t = when == null ? ctx.currentTime : when;
    var length = dur || 1.5;
    var freq = midiToFreq(midi);
    var osc = ctx.createOscillator();
    var over = ctx.createOscillator();
    var filter = ctx.createBiquadFilter();
    var gain = ctx.createGain();
    osc.type = "triangle";
    over.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    over.frequency.setValueAtTime(freq * 2, t);
    if (bend) {
      var up = freq * Math.pow(2, 0.7 / 12);
      osc.frequency.linearRampToValueAtTime(up, t + 0.22);
      over.frequency.linearRampToValueAtTime(up * 2, t + 0.22);
    }
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, t);
    filter.frequency.exponentialRampToValueAtTime(420, t + length);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(filter);
    over.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    over.start(t);
    osc.stop(t + length + 0.02);
    over.stop(t + length + 0.02);
    track(osc);
    track(over);
  }

  function strumFrets(frets, when, gap) {
    var ctx = ensureAudio();
    if (!ctx) return;
    var t = when == null ? ctx.currentTime : when;
    var step = gap == null ? 0.028 : gap;
    frets.forEach(function (fret, i) {
      if (fret < 0) return;
      pluck(OPEN_MIDI[i] + fret, t + i * step, 1.7);
    });
  }

  function playMidi(midi) {
    pluck(midi, null, 1.3);
  }

  function selfTest() {
    var problems = [];
    QUALITIES.forEach(function (q) {
      for (var pc = 0; pc < 12; pc++) {
        var list = voicingsFor(pc, q.id);
        if (!list.length) {
          problems.push("sin digitación: " + SHARP[pc] + " " + q.id);
          continue;
        }
        list.forEach(function (v) {
          if (!voicingValid(v.frets, pc, q.id)) problems.push("inválido " + SHARP[pc] + q.symbol + " " + v.signature);
          if (v.fingers.length !== 6) problems.push("dedos " + v.signature);
        });
      }
    });
    function first(symbol) {
      var parsed = parseChord(symbol);
      var v = voicingsFor(parsed.rootPc, parsed.qualityId)[0];
      return v ? v.signature : "ninguna";
    }
    function expect(symbol, sig) {
      var got = first(symbol);
      if (got !== sig) problems.push(symbol + " esperaba " + sig + " y salió " + got);
    }
    expect("C", "-1,3,2,0,1,0");
    expect("G", "3,2,0,0,0,3");
    expect("E", "0,2,2,1,0,0");
    expect("Em", "0,2,2,0,0,0");
    expect("A", "-1,0,2,2,2,0");
    expect("Am", "-1,0,2,2,1,0");
    expect("D", "-1,-1,0,2,3,2");
    expect("Dm", "-1,-1,0,2,3,1");
    var fList = voicingsFor(5, "maj").map(function (v) { return v.signature; });
    if (fList.indexOf("-1,-1,3,2,1,1") < 0) problems.push("falta Fa cómodo");
    if (fList.indexOf("1,3,3,2,1,1") < 0) problems.push("falta Fa con cejilla");
    var b7 = voicingsFor(11, "7").map(function (v) { return v.signature; });
    if (b7.indexOf("-1,2,1,2,0,2") < 0) problems.push("falta Si7");
    if (!parseChord("A7sus4") || parseChord("A7sus4").qualityId !== "7sus4") problems.push("parser A7sus4");
    if (!parseChord("F#m") || parseChord("F#m").qualityId !== "min" || parseChord("F#m").rootPc !== 6) problems.push("parser F#m");
    if (!parseChord("Bb") || parseChord("Bb").rootPc !== 10) problems.push("parser Bb");
    return problems;
  }

export {
  SHARP,
  FLAT,
  OPEN_PC,
  OPEN_MIDI,
  STRING_NAME,
  STRING_SHORT,
  INTERVALS,
  QUALITIES,
  SCALES,
  qualityById,
  scaleById,
  pcOfName,
  noteName,
  bothNames,
  chordTones,
  intervalName,
  midiToFreq,
  octaveOf,
  voicingsFor,
  chordSymbol,
  parseChord,
  findVoicing,
  scaleIntervals,
  diatonic,
  keySignature,
  detectChords,
  noteAt,
  autoFingers,
  barreOf,
  ensureAudio,
  pluck,
  strumFrets,
  playMidi,
  stopAudio,
  selfTest,
};
