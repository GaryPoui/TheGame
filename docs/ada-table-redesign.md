# Ada integrada a las mesas de la casa — 2026-10-29

Pedido: reemplazar la presentación de Ada, que se veía desconectada de las otras partidas, por una composición semejante a Vera y Doble.

Las fotos de Ada usan la mesa 3D original de madera y paño verde. El único canvas se monta en la vista de Ada y vuelve a su lugar al salir. El renderizador elige el retrato de Ada, conserva el encuadre de torso y retira los dados. La cámara adapta el campo visual al ancho para conservar mesa y personaje en celulares. Doble y Vera recuperan sus retratos y sus objetos al regresar.

Las fotos quedan en la misma superficie de juego, sin el gran recuadro de álbum separado ni el borde de mesa plano que cortaba el cuerpo. Ganadas y perdidas se distinguen por símbolo, color y texto. El panel usa el ancho, los botones y la tipografía de las otras mesas. Se compacta el título y se simplifica el texto del diagnóstico, conservando moneda equilibrada, lanzamiento nuevo por partida, independencia, respuesta No y ausencia de puntos. Después de responder, también se aclara que no existe una derrota obligatoria.

El diagnóstico, la partida y la comparación de dos álbumes comparten esa presentación. La comparación conserva las cuatro fotos de A y las ocho de B, sus identificadores y sus cantidades. En pantallas estrechas los álbumes y el panel pasan a una columna. Texto al 200 % permite crecer verticalmente. Sin WebGL hay un retrato y una mesa HTML con los mismos controles y fotos. Los diálogos independientes siguen usando cuerpo completo. La vista de registros anterior a las fotos conserva su ruta de compatibilidad.

Se aplicaron frontend-design y game-ui-ux, reutilizando Babylon.js 9.32.0, las ilustraciones existentes y Playwright TypeScript. Se usan las mismas APIs de textura, transformación, resize y encuadre que ya usa Doble. No se agregan imágenes, motores, dependencias ni servicios. Las reglas de Ada, méritos, RNG, ayuda finita y guardado no cambian.

Las pruebas nuevas comprueban canvas compartido con anfitriona Ada y textura lista, ausencia de desborde horizontal o panel fuera de pantalla en 1673×840, 1440×900, 1366×768, 900×900 y 390×844, diagnóstico sin modificación por redimensionar, respuesta con teclado, apertura de fotos faltantes, comparación de proporciones y alternativa sin WebGL. Se inspeccionan capturas reales del canvas y las fotos, además del DOM. Las pruebas anteriores comprueban diagnóstico, compatibilidad de sesiones, campaña y texto al 200 %.

Validación y publicación definitivas se registran al completar los recorridos.
