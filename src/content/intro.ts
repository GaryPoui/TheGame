import type {DialogueGraph} from './dialogue-schema';
export const INTRO:DialogueGraph={id:'intro-v1',start:'intro.host.offer',strings:{
 'offer':'Una carta violeta se enciende en la oscuridad. El hombre del abrigo ya está frente a vos. «Ah… por fin. Tu libertad se juega acá. La suerte reparte; vos vas a tener que entender la mano».',
 'release':'«La silla era para la presentación». Los grilletes se abren. Podés moverte; la puerta seguirá cerrada. Tres asistentes. Tres sellos. Después, una partida con él.',
 'vera':'«En esta casa una buena decisión puede terminar mal. Eso no la convierte en una mala decisión. Te voy a mostrar por qué».',
},nodes:[
 {id:'intro.host.offer',speaker:'El anfitrión',lineId:'offer',next:'intro.host.release'},
 {id:'intro.host.release',speaker:'El anfitrión',lineId:'release',effect:'released',next:'intro.vera.welcome'},
 {id:'intro.vera.welcome',speaker:'Vera',lineId:'vera',next:null},
]};
