# Corrección de zoom y tarjetas de Vera

Pedido del 2026-11-17: evitar mesa y opciones fuera de pantalla en tamaños intermedios de zoom; no dar la probabilidad calculada del nivel 1 fuera del tutorial.

Vera tiene una ventana propia junto al panel. El mismo canvas se conserva al seleccionar y su cámara se encuadra según el ancho y alto disponibles, incluyendo el contorno de la mesa y sus patas. El encuadre se restablece al volver a la mesa y al cambiar ajustes. Se amplía el régimen compacto hasta 760 píxeles de alto para cubrir los tamaños intermedios que antes quedaban entre dos disposiciones.

Las tarjetas normales de Vera muestran cantidades rojas y azules, sin porcentaje ni fracción calculada. La demostración conserva las cuentas. Las reglas, el azar, los puntos y el guardado versión 8 permanecen iguales.

Validación: build y 63 pruebas unitarias, 70 verificaciones matemáticas y 92 archivos de skills. La prueba anterior al arreglo detectó el porcentaje incorrectamente mostrado. Hay 26 casos de regresión aprobados y una verificación final de los tamaños intermedios en los cuatro juegos. Vera se comprueba antes y después de extraer a 1366×768, 1200×675, 1093×615, 1000×601, 911×512, 800×640, 768×614, 640×512, 548×439 y 500×400; se proyectan 16 puntos del contorno real de la mesa y cuatro pies, además de los centros interactivos de las urnas.

Evidencia: [regresión](evidence/urns-zoom/regression.txt), [casos finales](evidence/urns-zoom/final.txt), [fotogramas y coordenadas](evidence/urns-zoom/final/frames.json), [vista compacta](evidence/urns-zoom/final/compact-choice.png), [resultado intermedio](evidence/urns-zoom/final/intermediate-result.png).

El clic sobre el cristal se verificó tras cambiar tamaño, ampliar texto a 2 y volver desde la sala. El primer recorrido de esa prueba esperaba la partida sin pasar el tutorial de una sesión nueva; se corrigió la preparación y [aprobó](evidence/urns-zoom/picking.txt). Se conserva el [intento inicial](evidence/urns-zoom/picking-initial.txt).

Límite: estos tamaños se verifican cambiando el espacio CSS de Chrome. La prueba con teclas del zoom nativo se interrumpió con Escape antes de ampliarlo; no se presenta como comprobada. Una ejecución final anterior también se interrumpió y se conserva su registro. No se afirma una cobertura universal de todos los tamaños o navegadores, ni mejoras medidas de rendimiento.

Se aplicaron game-ui-ux, frontend-design, camera-systems y webapp-testing para conservar la identidad y revisar encuadre, selección y ausencia de scroll mediante el runner TypeScript existente. No se añaden dependencias ni recursos externos.
