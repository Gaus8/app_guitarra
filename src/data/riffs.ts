export interface RiffNote {
  s: number;
  f: number;
  t: number;
  bend?: boolean;
}

export interface Riff {
  id: string;
  title: string;
  artist: string;
  level: 1 | 2 | 3;
  bpm: number;
  loop: number;
  tuning: string;
  tip: string;
  notes: RiffNote[];
}

function doubles(pairs: [number, number][]): RiffNote[] {
  return pairs.flatMap(([fret, time]) => [
    { s: 1, f: fret, t: time },
    { s: 2, f: fret, t: time },
  ]);
}

function power(pairs: [number, number][], strings = 2): RiffNote[] {
  return pairs.flatMap(([fret, time]) => {
    const notes: RiffNote[] = [{ s: 0, f: fret, t: time }];
    if (strings > 1) notes.push({ s: 1, f: fret + 2, t: time });
    if (strings > 2) notes.push({ s: 2, f: fret + 2, t: time });
    return notes;
  });
}

export const RIFFS: Riff[] = [
  {
    id: "smoke",
    title: "Smoke on the Water",
    artist: "Deep Purple",
    level: 1,
    bpm: 112,
    loop: 14,
    tuning: "Estándar",
    tip: "Las dos cuerdas, La y Re, pisan el mismo traste. Es un intervalo de quinta moviéndose: Re, Fa, Sol, y luego el Sol# que es la nota que todo el mundo reconoce. Índice en el 3, anular en el 5, meñique en el 6.",
    notes: doubles([
      [0, 0],
      [3, 1],
      [5, 2],
      [0, 4],
      [3, 5],
      [6, 6],
      [5, 7],
      [0, 8.5],
      [3, 9.5],
      [5, 10.5],
      [3, 11.5],
      [0, 12.5],
    ]),
  },
  {
    id: "seven",
    title: "Seven Nation Army",
    artist: "The White Stripes",
    level: 1,
    bpm: 124,
    loop: 6,
    tuning: "Estándar. La línea original está en el bajo.",
    tip: "Una sola cuerda, la 6ª: 7, 7, 10, 7, 5, 3, 2. El 7 y el 10 con meñique o anular, según el tamaño de la mano. Si quieres el cuerpo de octava, añade la 4ª cuerda dos trastes por encima de cada nota.",
    notes: [
      { s: 0, f: 7, t: 0 },
      { s: 0, f: 7, t: 1 },
      { s: 0, f: 10, t: 2 },
      { s: 0, f: 7, t: 2.5 },
      { s: 0, f: 5, t: 3 },
      { s: 0, f: 3, t: 3.5 },
      { s: 0, f: 2, t: 4 },
    ],
  },
  {
    id: "come-as-you-are",
    title: "Come As You Are",
    artist: "Nirvana",
    level: 1,
    bpm: 120,
    loop: 6,
    tuning: "La grabación está un tono más grave.",
    tip: "Casi todo en la 6ª cuerda, con la 5ª al aire de paso. Índice en el traste 1, medio en el 2, y no hace falta mover la mano. Para tocar con el disco, baja todas las cuerdas un tono y deja estas mismas casas.",
    notes: [
      { s: 0, f: 0, t: 0 },
      { s: 0, f: 0, t: 0.5 },
      { s: 0, f: 1, t: 1 },
      { s: 0, f: 2, t: 1.5 },
      { s: 1, f: 0, t: 2 },
      { s: 0, f: 2, t: 2.5 },
      { s: 1, f: 0, t: 3 },
      { s: 0, f: 2, t: 3.5 },
      { s: 0, f: 1, t: 4 },
      { s: 0, f: 0, t: 4.5 },
    ],
  },
  {
    id: "day-tripper",
    title: "Day Tripper",
    artist: "The Beatles",
    level: 2,
    bpm: 100,
    loop: 8,
    tuning: "Estándar",
    tip: "Empieza en la 6ª: al aire, traste 3, traste 4, y el resto es un giro entre La y Re. Está escrito en corcheas parejas para estudiarlo. En la canción el giro del medio va más apretado. Más adelante el mismo dibujo se traslada a la 5ª cuerda.",
    notes: [
      { s: 0, f: 0, t: 0 },
      { s: 0, f: 3, t: 0.5 },
      { s: 0, f: 4, t: 1 },
      { s: 1, f: 2, t: 1.5 },
      { s: 2, f: 2, t: 2 },
      { s: 2, f: 0, t: 2.5 },
      { s: 1, f: 2, t: 3 },
      { s: 2, f: 4, t: 3.5 },
      { s: 1, f: 2, t: 4 },
      { s: 2, f: 0, t: 4.5 },
      { s: 2, f: 2, t: 5 },
    ],
  },
  {
    id: "iron-man",
    title: "Iron Man",
    artist: "Black Sabbath",
    level: 2,
    bpm: 72,
    loop: 14,
    tuning: "Estándar",
    tip: "El mismo power chord todo el rato: índice en la 6ª, anular en la 5ª dos trastes más arriba. Solo se mueve el bloque. Las fundamentales son Si, Re, Mi, Sol y Fa#. El tramo 15-14 es un slide corto, ida y vuelta.",
    notes: power([
      [7, 0],
      [10, 1.5],
      [10, 2.5],
      [12, 3.5],
      [12, 4.5],
      [15, 6],
      [14, 6.5],
      [15, 7],
      [14, 7.5],
      [15, 8],
      [14, 8.5],
      [10, 9.5],
      [10, 10.5],
      [12, 11.5],
      [12, 12.5],
    ]),
  },
  {
    id: "sunshine",
    title: "Sunshine of Your Love",
    artist: "Cream",
    level: 3,
    bpm: 112,
    loop: 8,
    tuning: "Estándar",
    tip: "Primera frase del riff, cerca del traste 12, sobre la pentatónica menor de Re. La nota del traste 8 en la 5ª cuerda se dobla un poco hacia arriba. La frase siguiente de la canción es el mismo dibujo, una cuerda más aguda.",
    notes: [
      { s: 2, f: 12, t: 0 },
      { s: 2, f: 12, t: 1 },
      { s: 2, f: 10, t: 1.5 },
      { s: 2, f: 12, t: 2 },
      { s: 1, f: 12, t: 3 },
      { s: 1, f: 11, t: 3.5 },
      { s: 1, f: 10, t: 4 },
      { s: 0, f: 10, t: 4.75 },
      { s: 1, f: 8, t: 5.25, bend: true },
      { s: 0, f: 10, t: 6 },
    ],
  },
  {
    id: "teen-spirit",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    level: 2,
    bpm: 118,
    loop: 8,
    tuning: "Estándar",
    tip: "Cuatro power chords de tres cuerdas: Fa5, Sib5, Lab5, Reb5. La fundamental va en la 6ª y las otras dos cuerdas, un par de trastes más arriba. El ritmo de la grabación tiene más silencios; aquí van en corcheas parejas para aprender el orden y la forma.",
    notes: power(
      [
        [1, 0],
        [1, 0.5],
        [1, 1],
        [6, 2],
        [6, 2.5],
        [6, 3],
        [4, 4],
        [4, 4.5],
        [4, 5],
        [9, 6],
        [9, 6.5],
        [9, 7],
      ],
      3,
    ),
  },
  {
    id: "cromatico",
    title: "Cromático 1-2-3-4",
    artist: "Ejercicio de siempre",
    level: 1,
    bpm: 70,
    loop: 12,
    tuning: "Estándar",
    tip: "Un dedo por traste: índice, medio, anular, meñique. Sube por cada cuerda y no mires el mástil cuando ya te salga. Es el ejercicio que ordena la mano izquierda antes de cualquier solo. Al bajar, invierte: 4-3-2-1.",
    notes: Array.from({ length: 6 }, (_, string) =>
      [1, 2, 3, 4].map((fret, index) => ({ s: string, f: fret, t: string * 2 + index * 0.5 })),
    ).flat(),
  },
  {
    id: "shuffle",
    title: "Shuffle de blues en Mi",
    artist: "Ejercicio de siempre",
    level: 2,
    bpm: 96,
    loop: 8,
    tuning: "Estándar",
    tip: "No es una canción concreta: es el idioma. Bajo en Mi al aire, en el tiempo, y un doble stop en La y Re en la parte larga del swing. El doble stop se mueve del traste 2 al 4: eso es la pentatónica, dicha con ritmo.",
    notes: [2, 2, 4, 2, 2, 2, 4, 2].flatMap((fret, index) => [
      { s: 0, f: 0, t: index },
      { s: 1, f: fret, t: index + 0.66 },
      { s: 2, f: fret, t: index + 0.66 },
    ]),
  },
];

export function riffById(id: string | undefined) {
  return RIFFS.find((riff) => riff.id === id);
}
