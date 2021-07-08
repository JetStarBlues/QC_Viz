/* Based on:
    - https://processing.org/examples/scrollbar.html
*/

/*
  TODO
   - step
*/

class Slider {

  constructor (
    p,
    barXPos, barYPos, barWidth, barHeight,
    knobWidth,
    minValue, maxValue, initialValue, step
  ) {

    this.p = p;  // p5.js instance


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Configure display
    this.showLabel = false;
    this.roundEdges = true;
    this.showBarCenterIndicator = true;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // values slider represents
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.step = step ? step : null;  // optional (also not currently implemented)

    // size and position of bar
    this.barWidth  = barWidth;
    this.barHeight = barHeight;
    this.barXPos   = barXPos;
    this.barYPos   = barYPos;

    // size of knob
    this.knobWidth = knobWidth;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    this.stepPrecison = null;
    if (this.step != null) {
      this.stepPrecison = countDecimals(this.step);
    }


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // ...
    this.calculateDimensions();

    // set slider value
    if (initialValue != null) {
      this.setValue(initialValue);
    }
    else {
      // initialize at center of bar
      // this.setValueAsPercent(0.5);
      this.setValueAsPercent(0.35);
    }


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // knob state
    this.knobIsHovered = false;
    this.knobIsSelected = false;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // label
    this.label = null;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // this.barColor = this.p.color(204);
    // this.barValueColor = this.p.color(255, 170, 170);
    // this.barCenterIndicatorColor = this.p.color(255, 0, 0);
    // this.knobColor = this.p.color(102);
    // this.knobHoveredColor = this.p.color(0);
    // this.labelColor = this.p.color(0);

    this.barColor = this.p.color(colors["pal0col0"]);
    this.barValueColor = this.p.color(colors["pal0col1"]);
    this.barCenterIndicatorColor = this.p.color(colors["pal0col2"]);
    this.knobColor = this.p.color(colors["pal0col4"]);
    this.knobHoveredColor = this.p.color(colors["pal0col3"]);
    this.labelColor = this.p.color(0);
  }


  // ----------------------------------------------

  calculateDimensions (currentValue) {
    // size of knob
    this.knobHeight = this.barHeight;
    this.knobHalfWidth = this.knobWidth / 2;

    // min and max values of knob
    this.knobXPosMin = this.barXPos;
    this.knobXPosMax = this.barXPos + this.barWidth - this.knobWidth;

    // position of knob
    this.knobYPos = this.barYPos;
    if (currentValue != null) {
      this.setValue(currentValue);
    }
  }


  // ----------------------------------------------

  /*
    E.g. if step is 0.1, then
      0.20 becomes 0.2
      0.23 becomes 0.2
      0.25 becomes 0.3
      0.27 becomes 0.3
  */
  roundToNearestStep (value) {
    // Do nothing
    if (this.step == null) {
      return value;
    }

    // Make value a multiple of step
    // let v = this.p.round(value / this.step) * this.step;
    let v = roundAtMost(value / this.step, this.stepPrecison);
    v *= this.step;

    /* Round to precision of step

       E.g. if step is 0.1, then
         0.30000000000000004 becomes 0.3
    */
    return roundAtMost(v, this.stepPrecison);
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
    // newValue = this.p.constrain(newValue, this.minValue, this.maxValue);
    let rawValue = this.p.constrain(newValue, this.minValue, this.maxValue);

    /*this.knobXPos = this.p.map(
      newValue,
      this.minValue, this.maxValue,
      this.knobXPosMin, this.knobXPosMax
    );*/

    let stepAdjustedValue = this.roundToNearestStep(rawValue);

    this.knobXPos = this.p.map(
      stepAdjustedValue,
      this.minValue, this.maxValue,
      this.knobXPosMin, this.knobXPosMax
    );
  }

  // TODO, modify to take step into account
  setValueAsPercent (pct) {
    // this.knobXPos = this.barXPos + (this.barWidth - this.knobWidth) * pct;

    let rawValue = this.p.map(
      pct,
      0, 1,
      this.minValue, this.maxValue
    );

    let stepAdjustedValue = this.roundToNearestStep(rawValue);

    this.knobXPos = this.p.map(
      stepAdjustedValue,
      this.minValue, this.maxValue,
      // this.knobXPosMin, this.knobXPosMax
      this.barXPos, this.barXPos + this.barWidth
    );

    this.knobXPos -= this.knobWidth / 2;

    console.log(rawValue, stepAdjustedValue, this.knobXPos);
  }


  // ----------------------------------------------

  setLabel (labelText) {
    this.label = labelText;
  }


  // ----------------------------------------------

  setSize (barWidth, barHeight, knobWidth) {
    // Save current value
    let currentValue = this.getValue();

    // Update dimensions
    if (barWidth != null) {
      this.barWidth = barWidth;
    }
    if (barHeight != null) {
      this.barHeight = barHeight;
    }
    if (knobWidth != null) {
      this.knobWidth = knobWidth;
    }

    // Update dependent values
    this.calculateDimensions(currentValue);
  }

  setTopLeft (barXPos, barYPos) {
    // Save current value
    let currentValue = this.getValue();

    // Update position
    if (barXPos != null) {
      this.barXPos = barXPos;
    }
    if (barYPos != null) {
      this.barYPos = barYPos;
    }

    // Update dependent values
    this.calculateDimensions(currentValue);
  }


  // ----------------------------------------------

  updateKnobPosition () {
    /*this.knobXPos = this.p.constrain(
      // this.p.mouseX,
      this.p.mouseX - this.knobHalfWidth,  // keeps mouse at center of knob...
      this.knobXPosMin, this.knobXPosMax
    );*/

    // let rawKnobXPos = this.p.constrain(
    let selectedBarXPos = this.p.constrain(
      this.p.mouseX,
      // this.knobXPosMin, this.knobXPosMax
      // this.p.mouseX - this.knobHalfWidth,  // keeps mouse at center of knob...
      // this.knobXPosMin, this.knobXPosMax
      this.barXPos, this.barXPos + this.barWidth
    );

    //
    // this.setValueAsPercent((rawKnobXPos - this.barXPos) / (this.barWidth - this.knobWidth));
    this.setValueAsPercent((selectedBarXPos - this.barXPos) / this.barWidth);

    // console.log(this.getValue());

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
    //
    let radius = this.roundEdges ? this.barHeight * 0.5 : 0;

    // Draw bar
    this.p.rectMode(this.p.CORNERS);

    let knobCenterX = this.knobXPos + (this.knobWidth / 2);
    let barBottomY = this.barYPos + this.barHeight;

    this.p.noStroke();
    this.p.fill(this.barValueColor);
    this.p.rect(
      this.barXPos, this.barYPos, knobCenterX, barBottomY,
      radius, 0, 0, radius
    );
    this.p.fill(this.barColor);
    this.p.rect(
      knobCenterX, this.barYPos, this.barXPos + this.barWidth, barBottomY,
      0, radius, radius, 0
    );

    this.p.rectMode(this.p.CORNER);  // restore default

    /* Draw center of bar indicator...
       Specifically, thinking of range -1..1 and desire to indicate 0
    */
    if (this.showBarCenterIndicator) {
      let barCenterX = this.barXPos + (this.barWidth / 2);
      this.p.strokeWeight(1);
      this.p.stroke(this.barCenterIndicatorColor);
      this.p.strokeCap(this.p.SQUARE);
      this.p.line(barCenterX, this.barYPos, barCenterX, barBottomY);
      this.p.strokeCap(this.p.ROUND);  // restore default
      this.p.noStroke();
    }

    // Temp, draw notches
    let range = this.maxValue - this.minValue;
    let nSteps = range / this.step;
    let stepSizeInPixels = this.barWidth / nSteps;
    // console.log(range, nSteps, stepSizeInPixels);
    this.p.stroke(0);
    let tickY1 = this.barYPos - 10;
    let tickY2 = this.barYPos - 20;
    for (let x = this.barXPos; x <= this.barXPos + this.barWidth; x += stepSizeInPixels) {
      this.p.line(x, tickY1, x, tickY2);
    }
    this.p.noStroke();

    // Draw knob
    if (this.knobIsHovered || this.knobIsSelected) {
      this.p.fill(this.knobHoveredColor);
    }
    else {
      this.p.fill(this.knobColor);
    }
    this.p.rect(
      this.knobXPos, this.knobYPos, this.knobWidth, this.knobHeight,
      radius
    );

    // Temp
    this.p.stroke(255,0,0);
    let x = this.knobXPos + this.knobWidth / 2;
    this.p.line(x, this.barYPos, x, this.barYPos + this.barHeight);

    // Draw label
    if (this.showLabel && (this.label != null)) {
      /* Not general purpose...
         - sets textSize to barHeight
         - places text to left of bar, centered vertically
      */
      this.p.textFont("monospace");
      this.p.textSize(this.barHeight * 1.1);
      this.p.noStroke();
      this.p.fill(this.labelColor);
      this.p.textAlign(this.p.RIGHT, this.p.CENTER);
      this.p.text(
        this.label,
        this.barXPos - 5,  // a bit of breathing space
        this.barYPos + (this.barHeight / 2)  // center Y
      );
    }
  }
}