// Simple Quantum Circuit Grammar
// ==========================
//
// Accepts expressions like:

/*
|0>--H--O--H-M>
|0>-----|----M>
|0>--H--*--H-M>
*/

QCircuit
  = "\n"* qubits:Qubits { return qubits }

Qubits
  = head:Qubit "\n"* rest:Qubits? { return [head, ...(rest ? rest : [])] }

Qubit
  = basis:Basis parts:(Wire / Gate / CNot)+ measure:Measure? {
  return {type: "qubit", basis, parts: [...parts, ...(measure ? [measure] : [])]}
  }

Wire
  = wire:"-"+ { return {type: "wire", width: wire.length} }

Basis
  = "|" basis:[01] ">" { return basis }
  
Gate
  = name:[H] { return {type: "gate", name} }

Measure
  = "M>" { return {type: "measure"} }
  
CNot
  = role:[O|*] { return {
    type: "cnot",
    role: {"O": "control", "|": "passthrough", "*": "target"}[role]
  } }