/*
  - think about how circuits will work
    - input/output bidirectionality... eg.
        input - X - H - output
        - should be reversible, i.e. tweaking
          output should correctly reflect/propogaet on input
          i.e. no concept of one-way, both directions 


  Representation
  - Take a cue from Quirk?
     https://github.com/Strilanc/Quirk/blob/master/src/ui/menu.js

    - e.g. not gate demo
      "cols" : [
          ["unitCircle"]
          ["X"],
          ["unitCircle"]
      ]

*/

const pegjs = require("pegjs")
const fs = require("fs")
const util = require("util")

let data = ''
try {
  data = fs.readFileSync("./parser/qcircuit.pegjs", "utf8")
} catch (err) {
  console.error(err)
}
const parser = pegjs.generate(data);

function QCircuit([circuitString]) {
  return parser.parse(circuitString)
}

function circuitToString(qubits) {
  const renderPart = part => {
    switch(part.type) {
    case "wire": return "-".repeat(part.width)
    case "gate": return part.name
    case "cnot": return {target: "*", control: "O", passthrough: "|"}[part.role]
    case "measure": return "M>"
    }
    throw "Part not implemented."
  }
  return qubits.map(qubit =>
    `|${qubit.basis}>${qubit.parts.map(part => renderPart(part)).join("")}`
  ).join("\n")
}
