/*
  Global functions from the Observable.

  Not sure if will use these, or create
  variants specific to the visualizations.
*/

// -----------------------------------------------------

// Ket constructs a vector in the quantum state space
function Ket(zero, one) {
  return [zero, one]
}

// -----------------------------------------------------

class Gate {
  constructor(transform) {
    this.transform = transform
  }

  apply(ket) {
    return math.multiply(this.transform, ket)
  }
}

let Not = new Gate([
  [0, 1],
  [1, 0]
])

let X = Not

let Y = new Gate([
  [0, complex('-i')],
  [complex('i'), 0]
])

let Hadamard = new Gate(math.multiply(1/math.sqrt(2), [
  [1,  1],
  [1, -1]
]))
