let sketch = function (p) {

  p.setup = function () {
    p.createCanvas(400, 400);
  }

  p.draw = function () {
    p.background(220);
    p.noLoop();
  }

}  // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
