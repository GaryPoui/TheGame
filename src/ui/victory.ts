export function escapeView():string {
 return `<main class="escape-layout" aria-label="Salida en primera persona"><p class="escape-caption">La puerta está abierta</p><svg class="escape-hands" viewBox="0 0 1200 320" aria-hidden="true"><defs><path id="escape-hand" d="M30 320 95 186Q109 158 133 171L161 191 181 145Q192 120 205 134L215 174 245 141Q263 127 269 145L258 201 275 185Q293 177 297 196L277 247 226 320Z"/></defs><use href="#escape-hand" fill="#c8a17b" stroke="#2b2230" stroke-width="8"/><use href="#escape-hand" transform="translate(1200 0) scale(-1 1)" fill="#c8a17b" stroke="#2b2230" stroke-width="8"/></svg><button class="quiet" data-testid="skip-escape">Saltar cinemática</button></main>`;
}
export function victoryCard():string {
 return `<section class="victory-card" data-testid="victory-screen"><span class="victory-emblem" aria-hidden="true">✧</span><h1>Ganaste</h1><p class="victory-subtitle">Saliste de la Casa del Azar</p><p>La puerta quedó atrás. Tu libertad y tus sellos están guardados.</p><button class="primary full" data-testid="back-room">Volver a la sala</button><button class="text-button full" data-testid="replay-escape">Volver a ver la salida</button></section>`;
}
