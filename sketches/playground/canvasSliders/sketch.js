let s;

let sketch = function (p) {

  p.setup = function () {
    p.createCanvas(400, 400);

    s = new Slider(
      p,
      50, 50, 200, 50,
      0, 1, 0.5, 0.1
      );
  }

  p.draw = function () {
    p.background(240);

    s.render();

    p.noLoop();
  }

  // Temporary for testing
  p.mouseMoved = function () {
    s.mouseMovedHandler();
    p.loop();
  }
  p.mousePressed = function () {
    s.mousePressedHandler();
    p.loop();
  }
  p.mouseReleased = function () {
    s.mouseReleasedHandler();
    p.loop();
  }
  p.mouseDragged = function () {
    s.mouseDraggedHandler();
    p.loop();
  }

}  // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
