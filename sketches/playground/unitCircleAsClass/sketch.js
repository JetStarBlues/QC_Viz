let sketch = function (p) {

  let c;

  p.setup = function () {
    p.createCanvas(400, 400);

    c = new UnitCircle(p);
    c.setCenter(p.width / 2, p.height / 2);
  }

  p.draw = function () {
    p.background(220);


    c.render();

    p.noLoop();
  }

}  // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
