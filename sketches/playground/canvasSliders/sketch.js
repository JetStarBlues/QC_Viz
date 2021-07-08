let s;

let sketch = function (p) {

  p.setup = function () {
    p.createCanvas(400, 400);

    s = new Slider(
      p,
      50, 50,
      // 200, 50, 50 * 2,
      200, 10, 10 * 2,
      // 0, 1
      // 0, 1, 0.1
      // 0, 1, 0.1, 0.1
      // 0, 1, 0.1, 0.01
      0, 1, null, 0.1
      // 0, 1, 0.23, 0.1
      // 0, 1, 0.25, 0.1
    );

    s.setLabel("pots:");
    s.showLabel = true;
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
