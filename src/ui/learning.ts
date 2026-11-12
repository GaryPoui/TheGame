export type LearningTopic = 'urns' | 'contracts' | 'records' | 'finale';

const lessons = {
  urns: {title:'Comparar posibilidades', text:'Contá las fichas del color buscado y dividí por el total. Si una ficha queda afuera, volvé a contar. Elegir la mejor posibilidad no asegura el resultado.', url:'https://es.khanacademy.org/math/cc-seventh-grade-math/cc-7th-probability-statistics/cc-7th-basic-prob/v/basic-probability', video:'Video: introducción a la probabilidad'},
  contracts: {title:'Promedio y seguridad', text:'El neto es el premio menos lo que pagaste. El promedio describe muchas tiradas; una garantía se cumple en todas. Elegí según lo que pide el objetivo.', url:'https://es.khanacademy.org/math/precalculus/x9e81a4f98389efdf:prob-comb/x9e81a4f98389efdf:expected-value/v/expected-value-of-a-discrete-random-variable', video:'Video: qué significa el valor esperado'},
  records: {title:'Rachas y fotos elegidas', text:'Mirá las victorias y las derrotas. Si cada partida empieza con una moneda equilibrada, la anterior no cambia la siguiente: ganar sigue teniendo una posibilidad entre dos.', url:'https://es.khanacademy.org/math/probability/probability-geometry/multiplication-rule-dependent-events/v/independent-events-1', video:'Video: sucesos independientes y dependientes'},
};

export function learningReview(topic: LearningTopic): string {
  const topics = topic === 'finale' ? Object.values(lessons) : [lessons[topic]];
  return `<p>Repasá lo que necesites y volvé a la partida cuando quieras.</p><div class="learning-topics">${topics.map(l=>`<section><h3>${l.title}</h3><p>${l.text}</p><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.video} <span class="external-note">(Khan Academy · abre otra pestaña)</span></a></section>`).join('')}</div>`;
}

export function reviewButton(topic: LearningTopic): string {
  return `<button class="review-concepts text-button full" data-review="${topic}">Repasar el tema y ver un video</button>`;
}

export const tutorialSummary = `<ol class="tutorial-summary"><li><strong>Compará.</strong> Buscá la mayor parte del color pedido, no sólo la mayor cantidad.</li><li><strong>Observá.</strong> Si la ficha queda afuera, cambiaron las cantidades.</li><li><strong>Separá decisión y suerte.</strong> Podés elegir bien y sacar otro color.</li></ol>`;
