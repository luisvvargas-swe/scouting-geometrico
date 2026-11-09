# Scouting geométrico

Aplicación de Luis Armando Vargas Peña que permite elegir un futbolista y encontrar perfiles con estadísticas similares. La implementación web contó con asistencia de IA. Los nueve jugadores y sus cifras son ficticios. El método procede de un cuaderno académico de Luis. [Cuaderno original y versión de referencia](https://github.com/Luisvvargas/data-mining/blob/8ef0b78c9be7703a4bc4469c2ab931d49a2c0907/Unit%20-%20III/scouting%20geometrico.ipynb)

[Probar la aplicación](https://luisvvargas-swe.github.io/scouting-geometrico/) · [Portafolio](https://luisvvargas-swe.github.io/)

## Una comparación de ejemplo

1. Abre la aplicación. Con Adrián Valle como referencia, la distancia euclidiana sitúa a Ivo Landa en primer lugar.
2. Cambia el método a Manhattan. Bruno Rivas pasa al primer lugar.
3. Selecciona otro candidato en la lista. Las barras muestran goles, asistencias, minutos y tiros por 90 minutos para ambos jugadores.

## Cálculo de distancias

Cada indicador se estandariza usando la media y la desviación estándar poblacional de la muestra. Un indicador constante aporta cero. La distancia euclidiana es la raíz de la suma de las diferencias al cuadrado. La de Manhattan suma las diferencias absolutas. La lista ordena de menor a mayor distancia y excluye al jugador de referencia. La gráfica utiliza los valores originales y una escala distinta por indicador.

## Ejecución local

Descarga el repositorio y abre `index.html` en tu navegador. El archivo `model.js` contiene las estadísticas y los cálculos. `app.js` vincula las selecciones con la lista y la gráfica. La aplicación completa se sirve como archivos estáticos y funciona sin conexión.
