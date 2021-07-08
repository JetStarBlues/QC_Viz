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

/* Trick from here to count decimal places:
    stackoverflow.com/a/17369245

   Assumes `x` is a Number
*/
function countDecimals (x) {
  //
  if (Number.isInteger(x)) {
    return 0;
  }

  //
  let str = x.toString();

  // Use absolute value
  if (str[0] === '-') {
    str = str.slice(1);
  }

  // Count decimals
    // E.g. `1e-10`, `2.7e-13`
    if (str.indexOf('-') !== -1) {
      return parseInt(str.split('-')[1]) || 0;
    }
    // E.g. `3.14`
    else {
      return str.split('.')[1].length || 0;
    }
}

/*function __test_countDecimals () {
  console.log(`23.453453453, 9`);
  console.log(countDecimals(23.453453453) === 9);

  console.log(`-23.453453453, 9`);
  console.log(countDecimals(-23.453453453) === 9);

  console.log(`0.0000000001, 10`);
  console.log(countDecimals(0.0000000001) === 10);

  console.log(`0.000000000000270, 13`);
  console.log(countDecimals(0.000000000000270) === 13);

  console.log(`101, 0`);
  console.log(countDecimals(101) === 0);

  console.log(`3.14, 2`);
  console.log(countDecimals(3.14) === 2);
}*/
