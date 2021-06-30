/*
  Global functions from the Observable.

  Not sure if will use these, or create
  variants specific to the visualizations.
*/

// -----------------------------------------------------

function compareFloatVector(a, b, epsilon=0.00001) {
  if(a.length !== b.length) return false
  for(let i=0; i<a.length; i++) {
    if(Math.abs(a[i] - b[i]) > epsilon) return false
  }
  return true
}
