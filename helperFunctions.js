function compareFloatVector (a, b, epsilon=0.00001) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false
    }
  }

  return true
}

function compareFloat (a, b, epsilon=0.00001) {
  if (Math.abs(a - b) > epsilon) {
    return false
  }

  return true
}


// ----------------------------------------------

/* Trick from here to round floats:
    stackoverflow.com/a/12830454
*/
function roundAtMost (x, maxPrecision) {
  return +(x.toFixed(maxPrecision));
}
