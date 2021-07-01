/*
  - Is this approach viable
    - https://processing.org/examples/scrollbar.html
    - https://www.khanacademy.org/cs/a/6032791229661184
*/

/* TODO
   - how do "step"
   - resize
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
    // this.initialValue = initialValue ? initialValue : 0;
    this.step = step ? step : 1;

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
// Hmm....
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
    /* TODO
       - floor returned value using step??
    */

    // return map()
  }

  setValue (newValue) {
    this.knobXPos = this.p.map(
      newValue,
      this.minValue, this.maxValue,
      this.knobXPosMin, this.knobXPosMax
    );
  }


  // ----------------------------------------------

  resize () {
    //
  }


  // ----------------------------------------------

  updateKnobPosition () {
    this.knobXPos = this.p.constrain(
      // this.p.mouseX,
      this.p.mouseX - this.knobHalfWidth,  // keeps mouse at center of knob...
      this.knobXPosMin, this.knobXPosMax
    );
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
    this.p.noStroke();

    // Draw knob
    if (this.knobIsHovered || this.knobIsSelected) {
      this.p.fill(this.knobColorHovered);
    }
    else {
      this.p.fill(this.knobColor);
    }
    this.p.rect(this.knobXPos, this.knobYPos, this.knobWidth, this.knobHeight);
  }
}
