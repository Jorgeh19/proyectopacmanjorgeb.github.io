//Realizado por Jorge Bech Castillo
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')
canvas.width = innerWidth
canvas.height = innerHeight

class Perimetro {
  static width = 40
  static height = 40
  constructor({ posicion, imagen }) {
    this.posicion = posicion
    this.width = 40
    this.height = 40
    this.imagen = imagen
  }
  Dibujar() {
    c.drawImage(this.imagen, this.posicion.x, this.posicion.y)
  }
}
class Jugador {
  constructor({ posicion, velocidad }) {
    this.posicion = posicion
    this.velocidad = velocidad
    this.radio = 15
    this.radians = 0.75
    this.rangoAbierto = 0.12
    this.rotacion = 0
  }
  Dibujar() {
    c.save()
    c.translate(this.posicion.x, this.posicion.y)
    c.rotate(this.rotacion)
    c.translate(-this.posicion.x, -this.posicion.y)
    c.beginPath()
    c.arc(
      this.posicion.x,
      this.posicion.y,
      this.radio,
      this.radians,
      Math.PI * 2 - this.radians
    )
    c.lineTo(this.posicion.x, this.posicion.y)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
    c.restore()
  }

  refrescar() {
    this.Dibujar()
    this.posicion.x += this.velocidad.x
    this.posicion.y += this.velocidad.y

    if (this.radians < 0 || this.radians > 0.75) this.rangoAbierto = -this.rangoAbierto

    this.radians += this.rangoAbierto
  }
}
class Fantasma {
  static rapidez = 2
  constructor({ posicion, velocidad, color = 'red' }) {
    this.posicion = posicion
    this.velocidad = velocidad
    this.radio = 15
    this.color = color
    this.colisionanterior = []
    this.rapidez = 2
    this.asustado = false
  }
  Dibujar() {
    c.beginPath()
    c.arc(this.posicion.x, this.posicion.y, this.radio, 0, Math.PI * 2)
    c.fillStyle = this.asustado ? 'blue' : this.color
    c.fill()
    c.closePath()
  }

  refrescar() {
    this.Dibujar()
    this.posicion.x += this.velocidad.x
    this.posicion.y += this.velocidad.y
  }
}
class Bolita {
  constructor({ posicion }) {
    this.posicion = posicion
    this.radio = 3
  }

  Dibujar() {
    c.beginPath()
    c.arc(this.posicion.x, this.posicion.y, this.radio, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
  }
}
class Activar {
  constructor({ posicion }) {
    this.posicion = posicion
    this.radio = 8
  }

  Dibujar() {
    c.beginPath()
    c.arc(this.posicion.x, this.posicion.y, this.radio, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
  }
}
const bolitas = []
const limites = []
const potenciadores = []
const fantasmas = [
  new Fantasma({
    posicion: {
      x: Perimetro.width * 6 + Perimetro.width / 2,
      y: Perimetro.height + Perimetro.height / 2
    },
    velocidad: {
      x: Fantasma.rapidez,
      y: 0
    }
  }),
  new Fantasma({
    posicion: {
      x: Perimetro.width * 6 + Perimetro.width / 2,
      y: Perimetro.height * 3 + Perimetro.height / 2
    },
    velocidad: {
      x: Fantasma.rapidez,
      y: 0
    },
    color: 'pink'
  })
]
const jugador = new Jugador({
  posicion: {
    x: Perimetro.width + Perimetro.width / 2,
    y: Perimetro.height + Perimetro.height / 2
  },
  velocidad: {
    x: 0,
    y: 0
  }
})
const teclas = {
  w: {
    presionado: false
  },
  a: {
    presionado: false
  },
  s: {
    presionado: false
  },
  d: {
    presionado: false
  }
}
let ultimatecla = ''
let puntaje = 0
//Estructura del mapa
const mapa = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', 'p', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]
function crearImagen(src) {
  const imagen = new Image()
  imagen.src = src
  return imagen
}
mapa.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        limites.push(
          new Perimetro({
            posicion: {
              x: Perimetro.width * j,
              y: Perimetro.height * i
            },
            imagen: crearImagen('./imagenes/pipeHorizontal.png')
          })
        )
        break
      case '|':
        limites.push(
          new Perimetro({
            posicion: {
              x: Perimetro.width * j,
              y: Perimetro.height * i
            },
            imagen: crearImagen('./imagenes/pipeVertical.png')
          })
        )
        break
      case '1':
        limites.push(
          new Perimetro({
            posicion: {
              x: Perimetro.width * j,
              y: Perimetro.height * i
            },
            imagen: crearImagen('./imagenes/pipeCorner1.png')
          })
        )
        break
      case '2':
        limites.push(
          new Perimetro({
            posicion: {
              x: Perimetro.width * j,
              y: Perimetro.height * i
            },
            imagen: crearImagen('./imagenes/pipeCorner2.png')
          })
        )
        break
      case '3':
        limites.push(
          new Perimetro({
            posicion: {
              x: Perimetro.width * j,
              y: Perimetro.height * i
            },
            imagen: crearImagen('./imagenes/pipeCorner3.png')
          })
        )
        break
      case '4':
        limites.push(
          new Perimetro({
            posicion: {
              x: Perimetro.width * j,
              y: Perimetro.height * i
            },
            imagen: crearImagen('./imagenes/pipeCorner4.png')
          })
        )
        break
      case 'b':
        limites.push(
          new Perimetro({
            posicion: {
              x: Perimetro.width * j,
              y: Perimetro.height * i
            },
            imagen: crearImagen('./imagenes/block.png')
          })
        )
        break
      case '[':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            imagen: crearImagen('./imagenes/capLeft.png')
          })
        )
        break
      case ']':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            imagen: crearImagen('./imagenes/capRight.png')
          })
        )
        break
      case '_':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            imagen: crearImagen('./imagenes/capBottom.png')
          })
        )
        break
      case '^':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            imagen: crearImagen('./imagenes/capTop.png')
          })
        )
        break
      case '+':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            imagen: crearImagen('./imagenes/pipeCross.png')
          })
        )
        break
      case '5':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            color: 'blue',
            imagen: crearImagen('./imagenes/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            color: 'blue',
            imagen: crearImagen('./imagenes/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            color: 'blue',
            imagen: crearImagen('./imagenes/pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        limites.push(
          new Perimetro({
            posicion: {
              x: j * Perimetro.width,
              y: i * Perimetro.height
            },
            imagen: crearImagen('./imagenes/pipeConnectorLeft.png')
          })
        )
        break
      case '.':
        bolitas.push(
          new Bolita({
            posicion: {
              x: j * Perimetro.width + Perimetro.width / 2,
              y: i * Perimetro.height + Perimetro.height / 2
            }
          })
        )
        break

      case 'p':
        potenciadores.push(
          new Activar({
            posicion: {
              x: j * Perimetro.width + Perimetro.width / 2,
              y: i * Perimetro.height + Perimetro.height / 2
            }
          })
        )
        break
    }
  })
})
function circleCollidesWithRectangle({ circle, rectangle }) {
  const relleno = Perimetro.width / 2 - circle.radio - 1
  return (
    circle.posicion.y - circle.radio + circle.velocidad.y <=
      rectangle.posicion.y + rectangle.height + relleno &&
    circle.posicion.x + circle.radio + circle.velocidad.x >=
      rectangle.posicion.x - relleno &&
    circle.posicion.y + circle.radio + circle.velocidad.y >=
      rectangle.posicion.y - relleno &&
    circle.posicion.x - circle.radio + circle.velocidad.x <=
      rectangle.posicion.x + rectangle.width + relleno
  )
}
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  if (teclas.w.presionado && ultimatecla === 'w') {
    for (let i = 0; i < limites.length; i++) {
      const Perimetro = limites[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...jugador,
            velocidad: {
              x: 0,
              y: -5
            }
          },
          rectangle: Perimetro
        })
      ) {
        jugador.velocidad.y = 0
        break
      } else {
        jugador.velocidad.y = -5
      }
    }
  } else if (teclas.a.presionado && ultimatecla === 'a') {
    for (let i = 0; i < limites.length; i++) {
      const Perimetro = limites[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...jugador,
            velocidad: {
              x: -5,
              y: 0
            }
          },
          rectangle: Perimetro
        })
      ) {
        jugador.velocidad.x = 0
        break
      } else {
        jugador.velocidad.x = -5
      }
    }
  } else if (teclas.s.presionado && ultimatecla === 's') {
    for (let i = 0; i < limites.length; i++) {
      const Perimetro = limites[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...jugador,
            velocidad: {
              x: 0,
              y: 5
            }
          },
          rectangle: Perimetro
        })
      ) {
        jugador.velocidad.y = 0
        break
      } else {
        jugador.velocidad.y = 5
      }
    }
  } else if (teclas.d.presionado && ultimatecla === 'd') {
    for (let i = 0; i < limites.length; i++) {
      const Perimetro = limites[i]
      if (
        circleCollidesWithRectangle({
          circle: {
            ...jugador,
            velocidad: {
              x: 5,
              y: 0
            }
          },
          rectangle: Perimetro
        })
      ) {
        jugador.velocidad.x = 0
        break
      } else {
        jugador.velocidad.x = 5
      }
    }
  }
  // Detectar choque del fantasma y el jugador
  for (let i = fantasmas.length - 1; 0 <= i; i--) {
    const fantasma = fantasmas[i]
    // Cuando fantasma toque al jugador pasará lo siguiente (Condición para perder):
    if (
      Math.hypot(
        fantasma.posicion.x - jugador.posicion.x,
        fantasma.posicion.y - jugador.posicion.y
      ) <
      fantasma.radio + jugador.radio
    ) {
      if (fantasma.asustado) {
        fantasmas.splice(i, 1)
      } else {
        cancelAnimationFrame(animationId)
        console.log('Pierdes')
        alert ("Has perdido (Pulsa F5 para volver a intentarlo)")
      }
    }
  }
  // Esta es la condición para ganar
  if (bolitas.length === 0) {
    console.log('Ganas')
    cancelAnimationFrame(animationId)
    alert ("¡¡Feliciddades has ganado!!")
  }

  // power ups 
  for (let i = potenciadores.length - 1; 0 <= i; i--) {
    const activar = potenciadores[i]
    activar.Dibujar()
    // Jugador toca powerup
    if (
      Math.hypot(
        activar.posicion.x - jugador.posicion.x,
        activar.posicion.y - jugador.posicion.y
      ) <
      activar.radio + jugador.radio
    ) {
      potenciadores.splice(i, 1)
      // Fantasma asustado
      fantasmas.forEach((fantasma) => {
        fantasma.asustado = true

        setTimeout(() => {
          fantasma.asustado = false
        }, 5000)
      })
    }
  }
  //Cuando el jugador toca las bolitas
  for (let i = bolitas.length - 1; 0 <= i; i--) {
    const bolita = bolitas[i]
    bolita.Dibujar()

    if (
      Math.hypot(
        bolita.posicion.x - jugador.posicion.x,
        bolita.posicion.y - jugador.posicion.y
      ) <
      bolita.radio + jugador.radio
    ) {
      bolitas.splice(i, 1)
      puntaje += 10
      scoreEl.innerHTML = puntaje
    }
  }

  limites.forEach((Perimetro) => {
    Perimetro.Dibujar()
    if (
      circleCollidesWithRectangle({
        circle: jugador,
        rectangle: Perimetro
      })
    ) {
      jugador.velocidad.x = 0
      jugador.velocidad.y = 0
    }
  })
  jugador.refrescar()

  fantasmas.forEach((fantasma) => {
    fantasma.refrescar()

    const colisiones = []
    limites.forEach((Perimetro) => {
      if (
        !colisiones.includes('derecha') &&
        circleCollidesWithRectangle({
          circle: {
            ...fantasma,
            velocidad: {
              x: fantasma.rapidez,
              y: 0
            }
          },
          rectangle: Perimetro
        })
      ) {
        colisiones.push('derecha')
      }

      if (
        !colisiones.includes('izquierda') &&
        circleCollidesWithRectangle({
          circle: {
            ...fantasma,
            velocidad: {
              x: -fantasma.rapidez,
              y: 0
            }
          },
          rectangle: Perimetro
        })
      ) {
        colisiones.push('izquierda')
      }
      if (
        !colisiones.includes('subir') &&
        circleCollidesWithRectangle({
          circle: {
            ...fantasma,
            velocidad: {
              x: 0,
              y: -fantasma.rapidez
            }
          },
          rectangle: Perimetro
        })
      ) {
        colisiones.push('subir')
      }

      if (
        !colisiones.includes('bajar') &&
        circleCollidesWithRectangle({
          circle: {
            ...fantasma,
            velocidad: {
              x: 0,
              y: fantasma.rapidez
            }
          },
          rectangle: Perimetro
        })
      ) {
        colisiones.push('bajar')
      }
    })
    if (colisiones.length > fantasma.colisionanterior.length)
      fantasma.colisionanterior = colisiones

    if (JSON.stringify(colisiones) !== JSON.stringify(fantasma.colisionanterior)) {
      if (fantasma.velocidad.x > 0) fantasma.colisionanterior.push('derecha')
      else if (fantasma.velocidad.x < 0) fantasma.colisionanterior.push('izquierda')
      else if (fantasma.velocidad.y < 0) fantasma.colisionanterior.push('subir')
      else if (fantasma.velocidad.y > 0) fantasma.colisionanterior.push('bajar')

      console.log(colisiones)
      console.log(fantasma.colisionanterior)

      const caminos = fantasma.colisionanterior.filter((collision) => {
        return !colisiones.includes(collision)
      })
      console.log({ caminos })

      const direction = caminos[Math.floor(Math.random() * caminos.length)]

      console.log({ direction })

      switch (direction) {
        case 'bajar':
          fantasma.velocidad.y = fantasma.rapidez
          fantasma.velocidad.x = 0
          break

        case 'subir':
          fantasma.velocidad.y = -fantasma.rapidez
          fantasma.velocidad.x = 0
          break

        case 'derecha':
          fantasma.velocidad.y = 0
          fantasma.velocidad.x = fantasma.rapidez
          break

        case 'izquierda':
          fantasma.velocidad.y = 0
          fantasma.velocidad.x = -fantasma.rapidez
          break
      }

      fantasma.colisionanterior = []
    }
  })

  if (jugador.velocidad.x > 0) jugador.rotacion = 0
  else if (jugador.velocidad.x < 0) jugador.rotacion = Math.PI
  else if (jugador.velocidad.y > 0) jugador.rotacion = Math.PI / 2
  else if (jugador.velocidad.y < 0) jugador.rotacion = Math.PI * 1.5
}
animate()
//Controles para jugar
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
      teclas.w.presionado = true
      ultimatecla = 'w'
      break
    case 'a':
      teclas.a.presionado = true
      ultimatecla = 'a'
      break
    case 's':
      teclas.s.presionado = true
      ultimatecla = 's'
      break
    case 'd':
      teclas.d.presionado = true
      ultimatecla = 'd'
      break
  }
})
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'w':
      teclas.w.presionado = false

      break
    case 'a':
      teclas.a.presionado = false

      break
    case 's':
      teclas.s.presionado = false

      break
    case 'd':
      teclas.d.presionado = false

      break
  }
})
