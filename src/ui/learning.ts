import {diceVideoUrl,guideButton} from './game-guides';

export type LearningTopic = 'urns' | 'contracts' | 'records' | 'legacy-records' | 'finale';

const lessons: Record<Exclude<LearningTopic, 'finale'>, {title:string; body:string; url:string; video:string}> = {
  urns: {
    title:'Vera · Las fichas del color que buscás',
    body:'<p>Imaginá una urna con <strong>3 fichas rojas ▲ y 2 azules ●</strong>. El conjunto completo tiene 5 fichas. Todas tienen la misma chance de salir, así que cada ficha representa <strong>1 de 5 (20 %)</strong>.</p><p>Las 3 rojas son el grupo que te sirve. Juntas representan <strong>3 de 5 (60 %)</strong>. Si sacás una roja y la dejás afuera, quedan 2 rojas de 4 fichas. Ahora cada ficha representa 1 de 4, y las rojas juntas son 2 de 4 (50 %).</p><p>Para comparar dos urnas, fijate qué parte del total ocupa el color pedido en cada una. Con más fichas del color puede haber menos chance si el total también es mucho mayor.</p>',
    url:'https://es.khanacademy.org/math/probability/probability-geometry/probability-basics/v/simple-probability',
    video:'Ver cómo calcular la chance de sacar una canica',
  },
  contracts: {
    title:'Doble · Qué puede salir y cuánto te deja',
    body:'<p>Sumá los dos dados. Por ejemplo, 2 y 5 suman 7. Si el primer dado ya muestra 6, necesitás un 1 en el segundo para llegar a 7.</p><p>Leé tu tarjeta para ver cuántos puntos te deja esa suma y qué pasa si sale otra.</p>',
    url:diceVideoUrl,
    video:'Ver cómo se cuentan las 36 combinaciones de dos dados',
  },
  records: {
    title:'Ada · Qué carta completa tu mano',
    body:'<p>Mirá tus dos cartas y las cuatro de la mesa. Pensá qué cartas podrían completar cada tipo de mano. Por ejemplo, si ya tenés cuatro corazones, otro corazón podría darte color. Para cobrar el premio, además de acertar la categoría exacta, tenés que ganarle a Ada.</p>',
    url:'https://es.khanacademy.org/math/precalculus/x9e81a4f98389efdf:prob-comb/x9e81a4f98389efdf:addition-rule-prob-precalc/v/probability-with-playing-cards-and-venn-diagrams',
    video:'Ver cómo se cuentan posibilidades en una baraja',
  },
  'legacy-records': {
    title:'Ada · Rachas y fotos elegidas',
    body:'<p>Mirá las victorias y las derrotas. Si cada partida empieza con una moneda equilibrada, la anterior no cambia la siguiente. Ganar sigue teniendo una posibilidad entre dos.</p>',
    url:'https://es.khanacademy.org/math/probability/probability-geometry/multiplication-rule-dependent-events/v/independent-events-1',
    video:'Ver cómo funcionan los sucesos independientes',
  },
};

export function learningReview(topic: LearningTopic): string {
  const topics = topic === 'finale' ? [lessons.urns,lessons.contracts,lessons.records] : [lessons[topic]];
  return topics.map(l=>`<h3>${l.title}</h3>${l.body}<p><a class="learning-video" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.video} <span class="external-note">(Khan Academy · abre otra pestaña)</span></a></p>${l===lessons.records?guideButton('poker','Probar una mano guiada'):''}`).join('');
}

export function reviewButton(topic: LearningTopic): string {
  const labels: Record<LearningTopic,string> = {urns:'Repasar las urnas', contracts:'Repasar los dados', records:'Repasar el póker', 'legacy-records':'Repasar las fotos', finale:'Repasar las tres mesas'};
  return `<button class="review-concepts text-button full" data-review="${topic}">${labels[topic]}</button>`;
}

export const tutorialSummary = `<ol class="tutorial-summary"><li><strong>Compará.</strong> Buscá la mayor parte del color pedido, no sólo la mayor cantidad.</li><li><strong>Observá.</strong> Si la ficha queda afuera, cambiaron las cantidades.</li><li><strong>Separá decisión y suerte.</strong> Podés elegir bien y sacar otro color.</li></ol>`;
