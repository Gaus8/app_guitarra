export interface StrumStep {
  t: number;
  dir: "D" | "U" | "B";
}

export interface Strum {
  id: string;
  name: string;
  meter: number;
  detail: string;
  steps: StrumStep[];
}

export const STRUMS: Strum[] = [
  {
    id: "ocho",
    name: "D D U U D U",
    meter: 4,
    detail: "El rasgueo de pop y balada. En corcheas: abajo, abajo, arriba, arriba, abajo, arriba.",
    steps: [
      { t: 0, dir: "D" },
      { t: 1, dir: "D" },
      { t: 1.5, dir: "U" },
      { t: 2.5, dir: "U" },
      { t: 3, dir: "D" },
      { t: 3.5, dir: "U" },
    ],
  },
  {
    id: "ochos",
    name: "Corcheas seguidas",
    meter: 4,
    detail: "Abajo y arriba sin huecos. La mano no se detiene: el pulso lo marca el acento del tiempo 1.",
    steps: [
      { t: 0, dir: "D" },
      { t: 0.5, dir: "U" },
      { t: 1, dir: "D" },
      { t: 1.5, dir: "U" },
      { t: 2, dir: "D" },
      { t: 2.5, dir: "U" },
      { t: 3, dir: "D" },
      { t: 3.5, dir: "U" },
    ],
  },
  {
    id: "negras",
    name: "Negras hacia abajo",
    meter: 4,
    detail: "Un golpe abajo por tiempo. Sirve para escuchar los cambios antes de rasguear más fino.",
    steps: [
      { t: 0, dir: "D" },
      { t: 1, dir: "D" },
      { t: 2, dir: "D" },
      { t: 3, dir: "D" },
    ],
  },
  {
    id: "balada",
    name: "Balada",
    meter: 4,
    detail: "Abajo en el 1, y en el 3 un abajo con dos arribas suaves.",
    steps: [
      { t: 0, dir: "D" },
      { t: 2, dir: "D" },
      { t: 2.5, dir: "U" },
      { t: 3.5, dir: "U" },
    ],
  },
  {
    id: "vals",
    name: "Vals en 3",
    meter: 3,
    detail: "Un bajo y dos rasgueos. El compás de las canciones que se sienten en tres.",
    steps: [
      { t: 0, dir: "B" },
      { t: 1, dir: "D" },
      { t: 2, dir: "U" },
    ],
  },
  {
    id: "reggae",
    name: "Reggae",
    meter: 4,
    detail: "El acorde cae en el contratiempo, corto, casi como un golpe de percusión.",
    steps: [
      { t: 0.5, dir: "U" },
      { t: 1.5, dir: "U" },
      { t: 2.5, dir: "U" },
      { t: 3.5, dir: "U" },
    ],
  },
  {
    id: "boom",
    name: "Boom-chick",
    meter: 4,
    detail: "Bajo en el 1 y el 3, acorde en el 2 y el 4. El tren de Johnny Cash.",
    steps: [
      { t: 0, dir: "B" },
      { t: 1, dir: "D" },
      { t: 2, dir: "B" },
      { t: 3, dir: "D" },
    ],
  },
  {
    id: "seis",
    name: "Arpegio en 6/8",
    meter: 6,
    detail: "Seis notas por compás: bajo, dos cuerdas, bajo, dos cuerdas.",
    steps: [
      { t: 0, dir: "B" },
      { t: 1, dir: "U" },
      { t: 2, dir: "U" },
      { t: 3, dir: "B" },
      { t: 4, dir: "U" },
      { t: 5, dir: "U" },
    ],
  },
];

export function strumById(id: string) {
  return STRUMS.find((strum) => strum.id === id) ?? STRUMS[0];
}

export interface Topic {
  id: string;
  label: string;
  to: string;
}

export const TOPICS: Topic[] = [
  { id: "cuerdas", label: "Nombrar las 6 cuerdas al aire", to: "/teoria/cuerdas" },
  { id: "cinco", label: "Ver las notas en los primeros 5 trastes", to: "/diapason" },
  { id: "afinar", label: "Afinar con referencia o con el oído", to: "/practica" },
  { id: "abiertos", label: "Los abiertos: E, Em, A, Am, D, Dm, G, C", to: "/acordes?r=0&q=maj" },
  { id: "fa", label: "Fa, primero cómodo y después con cejilla", to: "/acordes?r=5&q=maj" },
  { id: "formar", label: "Saber por qué un acorde es mayor o menor", to: "/formacion" },
  { id: "penta", label: "Pentatónica menor, caja 1", to: "/escalas?r=9&s=pentMin&box=1" },
  { id: "rasgueo", label: "Un rasgueo de corcheas que no se cae", to: "/practica" },
  { id: "cancion", label: "Una canción de cuatro acordes de punta a punta", to: "/canciones/let-it-be" },
  { id: "intervalos", label: "Nombrar 3ª, 5ª y b7", to: "/teoria/intervalos" },
  { id: "circulo", label: "Leer el círculo de quintas", to: "/teoria/circulo" },
  { id: "mayor", label: "Ver la escala mayor en el mástil", to: "/escalas?r=0&s=major&box=all" },
  { id: "caged", label: "Reconocer las cinco formas CAGED", to: "/teoria/caged" },
  { id: "riff", label: "Sacar un riff lento, nota por nota", to: "/riffs/smoke" },
  { id: "blues", label: "El blues de 12 compases", to: "/canciones/blues-12" },
  { id: "tecnica", label: "Ligados, slide y un bend pequeño", to: "/teoria/tecnica" },
];

export interface Block {
  type: "p" | "ul" | "note";
  text?: string;
  items?: string[];
}

export interface Lesson {
  id: string;
  kicker: string;
  title: string;
  blocks: Block[];
}

export const LESSONS: Lesson[] = [
  {
    id: "cuerdas",
    kicker: "El mapa",
    title: "Seis cuerdas, doce notas",
    blocks: [
      { type: "p", text: "De la más grave a la más aguda, al aire, la guitarra en afinación estándar dice: Mi, La, Re, Sol, Si, Mi. En cifrado: E A D G B E. La 6ª es el Mi grave. La 1ª es el Mi agudo, dos octavas más arriba." },
      { type: "p", text: "Un traste es un semitono. Si pisas el traste 1 de la 6ª cuerda ya no suena Mi: suena Fa. El traste 2 es Fa#. No hay traste entre Mi y Fa, ni entre Si y Do: ahí el semitono ya está en el nombre de la nota." },
      { type: "ul", items: ["6ª Mi grave, la más gorda", "5ª La", "4ª Re", "3ª Sol", "2ª Si", "1ª Mi agudo"] },
      { type: "note", text: "En el diapasón, la 6ª está arriba, como cuando miras el mástil. Pulsa una nota y fíjate en el nombre y en la octava." },
    ],
  },
  {
    id: "semitonos",
    kicker: "Distancia",
    title: "Tono y semitono",
    blocks: [
      { type: "p", text: "Toda la teoría de la guitarra cabe en una idea: la distancia entre dos notas. El semitono es un traste. El tono son dos trastes." },
      { type: "p", text: "Las doce notas son Do, Do#, Re, Re#, Mi, Fa, Fa#, Sol, Sol#, La, La#, Si, y vuelta a Do. Las mismas con bemoles: Reb es la misma tecla y el mismo traste que Do#. Se llaman enarmónicas. En acordes verás las dos escrituras; suenan igual." },
      { type: "note", text: "En la barra lateral puedes forzar sostenidos, bemoles, o dejar que la app elija (Si bemol, no La sostenido; Fa sostenido, no Sol bemol)." },
    ],
  },
  {
    id: "leer",
    kicker: "Lectura",
    title: "Diagramas y tablatura",
    blocks: [
      { type: "p", text: "Un diagrama es una foto del mástil, con la cejuela arriba y la 6ª cuerda a la izquierda. El número dentro del punto es el dedo: 1 índice, 2 medio, 3 anular, 4 meñique. La cuerda con un círculo suena al aire. La cuerda con una cruz no se toca." },
      { type: "p", text: "Si el diagrama no empieza en la cejuela, el número de la izquierda dice en qué traste está el primer espacio. Una cejilla es el índice tumbado: una raya que cruza varias cuerdas en el mismo traste." },
      { type: "p", text: "La tablatura son seis líneas. La de arriba es la 1ª cuerda, la de abajo es la 6ª. El número es el traste. No dice la figura rítmica con la precisión de una partitura: para el ritmo, el oído y el metrónomo mandan. Por eso cada riff de aquí se puede escuchar despacio." },
    ],
  },
  {
    id: "afinar",
    kicker: "Antes de tocar",
    title: "Afinar",
    blocks: [
      { type: "p", text: "Una guitarra desafinada enseña mal el oído. Afina cada vez que la sacas del estuche, y otra vez a los diez minutos: las cuerdas nuevas se mueven." },
      { type: "p", text: "El método del traste 5: la 6ª pisada en el 5 suena como la 5ª al aire. La 5ª en el 5, como la 4ª al aire. La 4ª en el 5, como la 3ª al aire. La excepción es la 2ª: se compara con la 3ª pisada en el traste 4, no en el 5. La 2ª en el 5 suena como la 1ª al aire." },
      { type: "note", text: "En Práctica hay un tono de referencia por cuerda y un afinador con el micrófono. El sonido de la app es una referencia, no una guitarra." },
    ],
  },
  {
    id: "ritmo",
    kicker: "El tiempo",
    title: "Pulso, compás y rasgueo",
    blocks: [
      { type: "p", text: "El pulso es el latido. El metrónomo lo hace audible. El compás agrupa esos latidos: 4/4 son cuatro, 3/4 son tres, 6/8 se siente en dos grupos de tres." },
      { type: "p", text: "Abajo es hacia el suelo. Arriba es hacia el techo. La mano sigue moviéndose aunque no golpees todas las cuerdas: el rasgueo sale del brazo, no de apretar cada cuerda." },
      { type: "ul", items: ["Negra: un golpe por tiempo", "Corchea: dos golpes por tiempo, abajo y arriba", "El acento casi siempre vive en el tiempo 1", "Si te pierdes, vuelve a negras. El cambio de acorde importa más que el adorno."] },
      { type: "note", text: "Práctica tiene el rasgueo D D U U D U, las corcheas seguidas, el vals y el boom-chick, con clic." },
    ],
  },
  {
    id: "intervalos",
    kicker: "La distancia",
    title: "Intervalos",
    blocks: [
      { type: "p", text: "Un intervalo es cuántos semitonos hay de una nota a otra, y también cómo se llaman esas notas. De Do a Mi hay 4 semitonos: tercera mayor. De Do a Mib hay 3: tercera menor. Esa única diferencia separa un acorde alegre de uno menor." },
      { type: "ul", items: ["Unísono, 0. La misma nota.", "Segunda mayor, 2. Un tono.", "Tercera menor, 3. Tercera mayor, 4.", "Cuarta justa, 5. Quinta justa, 7.", "El tritono, 6, parte la octava por la mitad. Suena inestable a propósito.", "Séptima menor, 10. Séptima mayor, 11. La octava vuelve al 0."] },
      { type: "p", text: "La quinta justa es el salto del power chord. La séptima menor es la que pide resolver: está en el acorde de 7ª del blues. La novena es una segunda, una octava más arriba." },
    ],
  },
  {
    id: "acordes",
    kicker: "Construcción",
    title: "Cómo se arma un acorde",
    blocks: [
      { type: "p", text: "Un acorde mayor es fundamental, tercera mayor y quinta justa: 1, 3 y 5. Do mayor es Do, Mi, Sol. Si bajas la tercera un semitono, es menor: Do, Mib, Sol." },
      { type: "p", text: "La guitarra casi nunca toca las tres notas una sola vez y en orden. Las reparte entre cuerdas, repite la fundamental o la quinta, y a veces calla una cuerda. Por eso el mismo Do tiene varias digitaciones. Todas son Do si suenan esas notas y ninguna de más." },
      { type: "ul", items: ["sus2 y sus4 cambian la tercera por la 2ª o la 4ª. El acorde queda en el aire.", "dim baja la tercera y la quinta. aug sube la quinta.", "7 añade la séptima menor. maj7 añade la séptima mayor. m7 es menor con séptima menor.", "5, el power chord, es solo fundamental y quinta. Ni mayor ni menor.", "add9 suma la novena sin meter la séptima."] },
      { type: "note", text: "Formación deja elegir la fundamental y el tipo, y enciende esas notas en una regla de doce casillas y en el mástil." },
    ],
  },
  {
    id: "tonalidad",
    kicker: "La familia",
    title: "Acordes de una tonalidad",
    blocks: [
      { type: "p", text: "En Do mayor las notas son Do Re Mi Fa Sol La Si. Si armas un acorde sobre cada grado, usando solo esas notas, sale esta familia: Do, Rem, Mim, Fa, Sol, Lam, Sidim. En números: I, ii, iii, IV, V, vi, vii°." },
      { type: "p", text: "Los grados en mayúscula son mayores. Los de minúscula, menores. El vii es disminuido. El I es la casa. El V empuja de vuelta a casa. El vi es el menor relativo: la menor comparte las mismas notas que Do mayor." },
      { type: "p", text: "En menor natural la familia cambia de acento. La menor natural: Lam, Sidim, Do, Rem, Mim, Fa, Sol. Si subes la séptima (menor armónica), el V pasa a ser mayor: Mi, o Mi7. Por eso tantos temas en menor resuelven con un acorde mayor." },
      { type: "note", text: "Cuatro acordes que vas a ver todo el tiempo: I, V, vi, IV. En Do: Do, Sol, Lam, Fa. Es la rueda de medio pop." },
    ],
  },
  {
    id: "circulo",
    kicker: "Las tonalidades",
    title: "El círculo de quintas",
    blocks: [
      { type: "p", text: "Si caminas hacia los sostenidos, cada tonalidad está una quinta por encima: Do, Sol, Re, La, Mi, Si, Fa#. Cada paso añade un sostenido, y siempre en el mismo orden: Fa, Do, Sol, Re, La, Mi, Si." },
      { type: "p", text: "Hacia los bemoles es al revés, por cuartas: Do, Fa, Sib, Mib, Lab, Reb. El orden de los bemoles es el de los sostenidos, al revés." },
      { type: "p", text: "El círculo también dice qué acorde quiere ir después. Un dominante suele caer una quinta abajo: Sol7 quiere ir a Do, Re7 quiere ir a Sol. Esa caída es el movimiento más viejo de la armonía." },
      { type: "note", text: "En esta página el círculo es clicable. Al elegir una tonalidad ves su armadura, su relativa y sus siete acordes." },
    ],
  },
  {
    id: "escalas",
    kicker: "Melodía",
    title: "Escalas que sí se usan",
    blocks: [
      { type: "p", text: "La escala mayor es tono, tono, semitono, tono, tono, tono, semitono. Desde cualquier nota. Si empiezas la misma escala en otro grado, sale un modo: desde el 2º, dórica; desde el 5º, mixolidia; desde el 6º, la menor natural." },
      { type: "p", text: "No hace falta memorizar siete modos el primer mes. Conviene saber que existen y que son la escala mayor mirando desde otro peldaño. Mixolidia es la escala del acorde de 7ª. Dórica es un menor con la sexta mayor, el color de mucho rock modal." },
      { type: "p", text: "La menor armónica sube la séptima. La menor melódica sube también la sexta. Las vas a ver cuando un solo en menor quiera sonar más tirante hacia el acorde mayor del V." },
    ],
  },
  {
    id: "pentatonica",
    kicker: "La primera escala",
    title: "Pentatónica y blues",
    blocks: [
      { type: "p", text: "La pentatónica menor tiene cinco notas: 1, b3, 4, 5, b7. En La: La, Do, Re, Mi, Sol. No tiene semitonos seguidos, por eso casi cualquier nota cae bien sobre un acorde menor o sobre un blues." },
      { type: "p", text: "La caja 1 es la que todo el mundo aprende primero. Con la tónica en la 6ª cuerda, ocupa cuatro trastes. En La menor empieza en el traste 5. En Mi menor, en el traste 0: las cuerdas al aire entran en la caja." },
      { type: "p", text: "Hay cinco cajas. Son la misma escala, movida de sitio, para no quedarte en un solo dibujo. La pentatónica mayor (1, 2, 3, 5, 6) usa las mismas formas que la pentatónica menor de su relativa. Do mayor pentatónica y La menor pentatónica son las mismas notas: cambia cuál consideras la tónica." },
      { type: "p", text: "La escala de blues es esa pentatónica menor más la b5, la nota azul. En La: añade Re#. Úsala de paso, no como sitio donde vivir." },
    ],
  },
  {
    id: "caged",
    kicker: "Todo el mástil",
    title: "CAGED",
    blocks: [
      { type: "p", text: "Cinco formas de acorde abierto, enganchadas, recorren el mástil: Do, La, Sol, Mi, Re. En inglés, CAGED. Cada forma se puede mover. La forma de Mi, con cejilla, es el Fa del traste 1, el Sol del traste 3, el La del traste 5." },
      { type: "p", text: "La forma de La nace en la 5ª cuerda. La de Re, en la 4ª. Las de Do y Sol también se mueven, pero estiran más: por eso en los diagramas salen al final, marcadas como forma de Do o de Sol." },
      { type: "p", text: "El truco no es coleccionar cejillas. Es ver que el mismo Do del aire vuelve a aparecer más arriba con otra forma, y que la fundamental está en una cuerda concreta. Cuando eso se ve, el mástil deja de ser 150 puntos sueltos." },
      { type: "note", text: "Abre un acorde mayor y mira las otras digitaciones. La primera suele ser la más cómoda. Las siguientes son las formas subiendo por el mástil." },
    ],
  },
  {
    id: "cejilla",
    kicker: "La mano",
    title: "Cejilla y capo",
    blocks: [
      { type: "p", text: "La cejilla es el índice haciendo de cejuela móvil. Se apoya de lado, cerca del traste, no en mitad del espacio. El pulgar va detrás del mástil, más o menos frente al índice. Si zumba una cuerda, casi nunca es por falta de fuerza: es porque el índice está torcido o demasiado lejos del traste." },
      { type: "p", text: "El capo hace otra cosa: baja el instrumento a una posición y sube la afinación. Con capo en el traste 2, la forma de Em7 suena F#m7. Las canciones de aquí que lo usan enseñan la forma que dibujas y el acorde que realmente suena. La escucha ya incluye ese transporte." },
      { type: "p", text: "Fa tiene dos caminos. El cómodo (solo las cuatro primeras cuerdas) deja tocar la canción hoy. La cejilla completa es la que después abre todas las formas de Mi. Las dos están en el diccionario." },
    ],
  },
  {
    id: "tecnica",
    kicker: "La mano izquierda",
    title: "Ligados, slide, bend, vibrato",
    blocks: [
      { type: "p", text: "Hammer-on: suena una nota y, sin volver a pulsar con la derecha, el dedo de la izquierda cae con fuerza en un traste más agudo. Pull-off: al revés, el dedo arranca la cuerda al soltarla hacia una nota más grave. Juntos son los ligados." },
      { type: "p", text: "Slide: el mismo dedo se desliza de un traste a otro sin levantar la presión. El destino tiene que quedar justo detrás del traste, si no queda baja." },
      { type: "p", text: "Bend: empujas la cuerda (en las agudas, hacia arriba, hacia el techo del mástil) hasta que la nota sube. Un semitono es la primera meta. El oído dice cuándo llegaste: compáralo con el traste de al lado. Vibrato es un bend diminuto, rítmico, que mantiene la nota viva." },
      { type: "p", text: "Palm mute: el canto de la mano derecha, cerca del puente, apaga un poco las cuerdas graves. Es el chug de los power chords. No es apretar: es apoyar." },
      { type: "note", text: "El ejercicio cromático 1-2-3-4, en Riffs, entrena el cambio de dedo antes de pedirle velocidad a un solo." },
    ],
  },
  {
    id: "blues",
    kicker: "Una forma",
    title: "Doce compases",
    blocks: [
      { type: "p", text: "El blues de 12 compases es una canción entera con tres acordes. En La: cuatro compases de La, dos de Re, dos de La, uno de Mi7, uno de Re, uno de La y un Mi7 para volver a empezar." },
      { type: "p", text: "En números, en cualquier tono: I I I I, IV IV I I, V IV I V. La variante con cambio rápido pone el IV ya en el segundo compás." },
      { type: "p", text: "Encima casi siempre vive la pentatónica menor de la tónica, aunque los acordes sean mayores. Esa fricción es el blues. La nota azul, la b5, se apoya un instante y se va." },
      { type: "note", text: "Hay una forma en La, con acordes abiertos, y Folsom Prison Blues como blues en Mi con ritmo de tren." },
    ],
  },
  {
    id: "practicar",
    kicker: "El hábito",
    title: "Cómo estudiar sin convertir esto en un curso",
    blocks: [
      { type: "p", text: "Veinte minutos seguidos valen más que una hora dispersa. Un reparto que cabe en una noche: cinco de afinación y de una forma de acorde, cinco de un rasgueo con metrónomo lento, cinco de una canción, cinco de una caja de pentatónica o de un riff." },
      { type: "p", text: "Toca lento hasta que salga limpio. Sube el tempo solo cuando a esa velocidad ya no piensas en los dedos. Si un cambio se cae, aíslalo: los dos acordes, cuatro repeticiones, y vuelta a la canción." },
      { type: "ul", items: ["Marca en el inicio lo que ya miraste. No es una nota: es para no repetir siempre lo mismo.", "Guarda canciones y riffs. Mañana abres solo eso.", "El oído se educa escuchando el cambio y cantándolo antes de rasguearlo.", "Cuando algo suene mal, afina otra vez antes de culpar a la mano."] },
      { type: "note", text: "No hay nivel que desbloquear. El cuaderno está entero desde el primer día. Vuelve a la página que haga falta." },
    ],
  },
];

export function lessonById(id: string | undefined) {
  return LESSONS.find((lesson) => lesson.id === id) ?? LESSONS[0];
}
