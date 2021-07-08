/* Based on:
    - https://processing.org/examples/scrollbar.html
*/

class Slider {

  constructor (
    p,
    barXPos, barYPos, barWidth, barHeight,
    knobWidth,
    minValue, maxValue,
    initialValue,  // optional
    step  // optional
  ) {

    this.p = p;  // p5.js instance


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Configure display
    this.showLabel = false;
    this.roundEdges = true;
    this.showBarCenterIndicator = true;

    //
    this.debugMode = false;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // values slider represents
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.step = step ? step : null;

    // position and size of bar
    this.barXPos   = barXPos;
    this.barYPos   = barYPos;
    this.barHeight = barHeight;
    // this.barWidth  = barWidth;
    // Take difference between visual and actual bar into account
    this.barWidth = this.p.max(0, barWidth - knobWidth);

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


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Keep track of "set" value
    this.value = null;

    // set slider value
    if (initialValue != null) {
      this.setValue(initialValue);
    }
    else {
      // initialize at center of bar
      this.setValueAsPercent(0.5);
    }


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // knob state
    this.knobIsHovered = false;
    this.knobIsSelected = false;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // label
    this.label = null;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

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


    /* "visual bar" vs "actual bar".
       Visual bar overflows actual on both sides by knobHalfWidth.
       So that avoid visual appearance of knob half hanging
       outside of bar when at min and max.
       And range appearing to expand as consequence.

       ooo      ooo       ooo
        --------------------
       ^                    ^
    */
    this.visualBarXPos = this.barXPos;
    this.barXPos += this.knobHalfWidth;

    // max value of bar
    this.barXPosMax = this.barXPos + this.barWidth;
    this.visualBarXPosMax = this.visualBarXPos + this.barWidth + this.knobWidth;

    //
    this.barHalfHeight = this.barHeight / 2;


    // min and max values of knob
    this.knobXPosMin = this.barXPos;
    this.knobXPosMax = this.barXPosMax - this.knobWidth;

    // position of knob
    this.knobYPos = this.barYPos;
    if (currentValue != null) {
      this.setValue(currentValue);
    }


    //
    this.textSize = this.barHeight * 1.2;
  }


  // ----------------------------------------------

  getStep () {
    return this.step;
  }

  setStep (step) {
    this.step = step;

    if (step == null) {
      this.stepPrecison = null;
    }
    else {
      this.stepPrecison = countDecimals(step);
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
    return this.value;
  }

  setValue (newValue) {
    let rawValue = this.p.constrain(newValue, this.minValue, this.maxValue);

    let stepAdjustedValue = this.roundToNearestStep(rawValue);

    this.knobXPos = this.p.map(
      stepAdjustedValue,
      this.minValue, this.maxValue,
      this.knobXPosMin, this.knobXPosMax
    );

    //
    this.value = stepAdjustedValue;
  }

  setValueAsPercent (pct) {
    let rawValue = this.p.map(
      pct,
      0, 1,
      this.minValue, this.maxValue
    );

    let stepAdjustedValue = this.roundToNearestStep(rawValue);

    this.knobXPos = this.p.map(
      stepAdjustedValue,
      this.minValue, this.maxValue,
      this.barXPos, this.barXPosMax
    );

    this.knobXPos -= this.knobHalfWidth;

    //
    this.value = stepAdjustedValue;

    // console.log(rawValue, stepAdjustedValue, this.knobXPos);
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
      // this.barWidth = barWidth;

      // Take difference between visual and actual bar into account
      this.barWidth = this.p.max(0, barWidth - this.knobWidth);
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

    let selectedBarXPos = this.p.constrain(
      this.p.mouseX,
      this.barXPos, this.barXPosMax
    );

    let pct = (selectedBarXPos - this.barXPos) / this.barWidth;

    this.setValueAsPercent(pct);
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

    let knobCenterX = this.knobXPos + this.knobHalfWidth;
    let barBottomY = this.barYPos + this.barHeight;

    this.p.noStroke();
    this.p.fill(this.barValueColor);
    this.p.rect(
      this.visualBarXPos, this.barYPos, knobCenterX, barBottomY,
      radius, 0, 0, radius
    );
    this.p.fill(this.barColor);
    this.p.rect(
      knobCenterX, this.barYPos, this.visualBarXPosMax, barBottomY,
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


    // Debug, draw notches
    if (this.debugMode) {
      if (this.step != null) {
        let range = this.maxValue - this.minValue;
        let nSteps = range / this.step;
        let stepSizeInPixels = this.barWidth / nSteps;
        this.p.stroke(0);
        let tickHeight = 5;
        let tickY1 = this.barYPos - 10;
        let tickY2 = tickY1 - tickHeight;
        for (let x = this.barXPos; x <= this.barXPosMax; x += stepSizeInPixels) {
          this.p.line(x, tickY1, x, tickY2);
        }
        this.p.noStroke();
      }
    }


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


    // Debug, draw knob center
    if (this.debugMode) {
      this.p.stroke(255,0,0);
      let x = this.knobXPos + this.knobHalfWidth;
      this.p.line(x, this.barYPos, x, this.barYPos + this.barHeight);
      this.p.noStroke();
    }


    // Draw label
    if (this.showLabel && (this.label != null)) {
      /* Not general purpose...
         - sets textSize to barHeight
         - places text to left of bar, centered vertically
      */
      this.p.textFont("monospace");
      this.p.textSize(this.textSize);
      this.p.noStroke();
      this.p.fill(this.labelColor);
      this.p.textAlign(this.p.RIGHT, this.p.CENTER);
      this.p.text(
        this.label,
        this.visualBarXPos - 5,  // a bit of breathing space
        this.barYPos + this.barHalfHeight  // center Y
      );
    }
  }
}
