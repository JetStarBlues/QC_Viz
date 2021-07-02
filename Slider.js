/* Based on:
    - https://processing.org/examples/scrollbar.html
    - https://www.khanacademy.org/cs/a/6032791229661184
*/

/* TODO
   - resize
*/

/*
  Preliminary work on supporting `step`.
  For now, on-hold until use case arises.
*/

class Slider {

  constructor (
    p,
    barXPos, barYPos, barWidth, barHeight,
    minValue, maxValue, initialValue, step
  ) {

    this.p = p;  // p5.js instance


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Value range slider represents
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.step = step;  // optional (also not currently implemented)

    // size and position of the bar
    this.barWidth  = barWidth;
    this.barHeight = barHeight;
    this.barXPos   = barXPos;
    this.barYPos   = barYPos;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // size of knob
    this.knobWidth = this.barHeight;
    // this.knobHeight = this.barHeight;
    this.knobHeight = this.barHeight * 0.6;
    this.knobHalfWidth = this.knobWidth / 2;

    // min and max values of knob
    this.knobXPosMin = this.barXPos;
    this.knobXPosMax = this.barXPos + this.barWidth - this.knobWidth;

    // position of knob
    this.knobXPos = 0;
    if (initialValue != null) {
      this.setValue(initialValue);
    }
    else {
      // initialize at center of bar
      this.knobXPos = this.barXPos + (this.barWidth - this.knobWidth) / 2;
    }
    this.knobYPos = this.barYPos;

    //
    this.knobIsHovered = false;
    this.knobIsSelected = false;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    //
    this.barColor = this.p.color(204);
    this.knobColor = this.p.color(102);
    this.knobColorHovered = this.p.color(0);
  }


  // ----------------------------------------------

  getValue () {
    let value = this.p.map(
      this.knobXPos,
      this.knobXPosMin, this.knobXPosMax,
      this.minValue, this.maxValue
    );

    return value;


    /*
      Consider `this.step` in value returned.
      Want to floor value accordingly. E.g.
        minValue = 0
        maxValue = 4
        value = 3.6

        if step = 1, return 3
        if step = 0.5, return 3.5

      TODO,
      this should probably be round, not floor.
      i.e. with example above
        if step = 1, return 4
        if step = 0.5, return 3.5
    */
    /*
    if (this.step != null)
    {
      if ((value % this.step) === 0) {
        return value;
      }
      else {
        return this.p.floor(value / this.step) * this.step;
      }
    }
    */
  }

  setValue (newValue) {
    this.knobXPos = this.p.map(
      newValue,
      this.minValue, this.maxValue,
      this.knobXPosMin, this.knobXPosMax
    );
  }


  // ----------------------------------------------

  setSize (barWidth, barHeight) {
    //
  }

  setKnobSize (knobWidth, knobHeight) {
    //
  }

  setTopLeft (barXPos, barYPos) {
    //
  }


  // ----------------------------------------------

  updateKnobPosition () {
    this.knobXPos = this.p.constrain(
      // this.p.mouseX,
      this.p.mouseX - this.knobHalfWidth,  // keeps mouse at center of knob...
      this.knobXPosMin, this.knobXPosMax
    );

    console.log(this.getValue());

    /*
      "Snap" according to `this.step`.
      Currently not implemented.

      Probaby trickier than might seem at first glance.
      Slider snaps to a position based on round?....

       0       1          2        3        4
      ||---.---||--x-.-x--||---.---||---.---||
                   ^   ^
                   |   |_ slider will snap to 2
                   |
                   |_ slider will snap to 1
    */
    /*
    if (this.step != null) {
      // TODO
    }
    */
  }


  // ----------------------------------------------

  mouseIsOverKnob () {
    return (
      (this.p.mouseX >= this.knobXPos) &&
      (this.p.mouseX <= this.knobXPos + this.knobWidth) &&
      (this.p.mouseY >= this.knobYPos) &&
      (this.p.mouseY <= this.knobYPos + this.knobHeight)
    );
  }


  // ----------------------------------------------

  mouseMovedHandler () {
    if (this.mouseIsOverKnob()) {
      this.knobIsHovered = true;
    }
    else {
      this.knobIsHovered = false;
    }
  }

  mousePressedHandler () {
    if (this.knobIsHovered) {
      this.knobIsSelected = true;
    }
  }

  mouseReleasedHandler () {
    this.knobIsSelected = false;
  }

  mouseDraggedHandler () {
    if (this.knobIsSelected) {
      this.updateKnobPosition();
    }
  }


  // ----------------------------------------------

  render () {
    // Draw bar
    this.p.noStroke();
    this.p.fill(this.barColor);
    this.p.rect(this.barXPos, this.barYPos, this.barWidth, this.barHeight);

    this.p.stroke(255,0,0);
    let x = this.barXPos + (this.barWidth / 2);
    this.p.line(x, this.barYPos, x, this.barYPos + this.barHeight);

    this.p.stroke(0,255,0);
    for (let i = 0; i < 5; i += 1 ) {
      x = this.barXPos + (this.barWidth / 5 * i);
      this.p.line(x, this.barYPos, x, this.barYPos + this.barHeight);
    }
    this.p.noStroke();

    // Draw knob
    if (this.knobIsHovered || this.knobIsSelected) {
      this.p.fill(this.knobColorHovered);
    }
    else {
      this.p.fill(this.knobColor);
    }
    this.p.rect(this.knobXPos, this.knobYPos, this.knobWidth, this.knobHeight);

    this.p.stroke(0,0,255);
    x = this.knobXPos + (this.knobWidth / 2);
    this.p.line(x, this.knobYPos, x, this.knobYPos + this.knobHeight);
  }
}
