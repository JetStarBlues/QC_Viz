/*
  ...

  - Resizable

  - toggle (as independent from complex controls)
    - display imaginary component in label
      - for the `1 == sq(realX) + sq(imgX) + sq(realY) + sq(imgY)`,
        can simplify to `1 == sq(realX) + sq(realY)``

  - Include complex viz as setting can turn on/off
    - create sliders for each instance...
    - toggle
      - display imgX/imgY (imgα/imgβ) sliders
      - display variable real circle
        - or is this a given that it will always have diameter 1
          when imaginary is 0...
          i.e. no need to distinguish between "modes"
          - if this is the case, can UI make real circle
            dark outline, and 1-state as light (target)

  - Better way to handle flipped p5 y-axis

  - TODO,
    - can fancy label be achieved without colors (simplify theming),
      i.e. create contrast with things like underline / bold?

    - simplifies theming
    - still have computation problem

  - Slider as own class??

  - Call `p.textFont("monospace")` everywhere want to use,
    don't rely on it being set globally

  - Event handling
    - who will dispatch to instances?
      - ex. is there a "global" entity that will receive event
        and trickle it down to each instance?
    - how to propogate state change across circuit
      - with the whole no-direction thing...

  - How handle loop/noLoop
    - do we just move to "global" dispatcher?

  - Events that should trigger redraw
    - mouse move, press, release, drag
    - window resize
  - Events that should trigger recalc (recalc should be followed by redraw)
    - mouse drag & selected
    - slider
    - set from ket

  - Make imaginary point draggable?

  - Think a bit about how the y-axis direction thing
    - Currently, we use p5 negative value in calculations,
      and only invert when displaying (ex as label)
    - How will this behave when apply gate matrix ??

  - TODO,
    turn "red" if not showing proof and state not unitary

  - UI/UX to somehow toggle visibility of details...
    - right click?
    - press hold?

  - If have both sliders (real, imaginary)
    - how avoid inability to set precise (eq 1)
      - case for step e.g. if aiming for exactly 0.6 and 0.8
    - do we want button or something that locks
      - e.g. if adjust real, imaginary auto calculated to make 1?
*/

class UnitCircle {

  constructor (p) {

    this.p = p;  // p5.js instance

    /* Do we have this property in every drawable...
       Set to true if requires redraw.
       Global dispatcher iterates through all drawables, and
       calles their render method if they need to be redrawn??

       Or KISS, and just redraw everything on
       - all mouse events
       - ...
    */
    this.isDirty = false;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Configure display
    this.showLabel = true;
    this.showComplexLabel = true;
    this.showNormalizedProof = false;

    this.renderAsComplexCircle = true;
    this.showImaginaryCircle = true;

    this.showAxisProjections = false;

    this.showSliders = true;
    this.autoNormalizeSliders = false;  // hmm...


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // value (unitary)
    // arbitrary default value

    // this.realX = 0.6;
    // this.realY = -0.8;  // use p5 y-direction internally  // TODO, p5 y-axis thing
    // this.imgX = 0;
    // this.imgY = 0;
    // this.realMagnitude = 1;
    // this.imgMagnitude = 0;

    this.realX = 0.4;
    this.realY = -0.2;  // use p5 y-direction internally  // TODO, p5 y-axis thing
    this.imgX = 0.5;
    this.imgY = 0.5;
    this.realMagnitude = this.p.sqrt(this.p.sq(this.realX) + this.p.sq(this.realY));
    this.imgMagnitude = this.p.sqrt(this.p.sq(this.imgX) + this.p.sq(this.imgY));

    // this.realX = 0;
    // this.realY = 0;  // use p5 y-direction internally  // TODO, p5 y-axis thing
    // this.imgX = 0.6;
    // this.imgY = 0.8;
    // this.realMagnitude = this.p.sqrt(this.p.sq(this.realX) + this.p.sq(this.realY));
    // this.imgMagnitude = this.p.sqrt(this.p.sq(this.imgX) + this.p.sq(this.imgY));

    // TODO, propogate initial state to sliders...


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // circle dimensions (pixels)
    this.baseCircleWidth = 180;
    this.circleWidth = this.baseCircleWidth;  // TODO, make resizable
    this.circleRadius = this.circleWidth / 2;
    this.circleHalfRadius = this.circleRadius / 2;

    // center position (pixels)
    this.centerX = 0;  // arbitrary default value
    this.centerY = 0;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Point on real circle

    // point position (pixels)
    this.pointX;
    this.pointY;
    // point label position (pixels)
    this.pointLabelX;
    this.pointLabelY;
    this.pointLabelOffset = 30;  // TODO, make resizable
    //
    this.pointLabelTextSize = 14;  // TODO, make resizable?

    //
    this.pointIsHovered = false;
    this.pointIsSelected = false;
    this.pointDiameter = 10;  // TODO, make resizable
    this.pointDiameterHovered = this.pointDiameter * 1.3;
    this.pointRadius = this.pointDiameter / 2;

    // line thickness
    this.vectorThickness = 4;
    this.realCircleThickness = 2;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Point on imaginary cicle

    // point position (pixels)
    this.imgPointX;
    this.imgPointY;

    //
    this.imgPointIsHovered = false;
    this.imgPointIsSelected = false;
    this.imgPointDiameter = this.pointDiameter * 0.8;
    this.imgPointDiameterHovered = this.imgPointDiameter * 1.3;
    this.imgPointRadius = this.imgPointDiameter / 2;

    // line thickness
    this.imgVectorThickness = 3;
    this.imgCircleThickness = 2;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // slider dimensions (pixels)
    this.sliderWidth = this.baseCircleWidth;
    this.sliderHeight = 10;
    this.sliderKnobWidth = this.sliderHeight * 2;

    // slider position (pixels)
    this.sliderBaseX = - this.circleRadius;
    this.sliderBaseY = this.circleRadius * 1.5;

    let sliderSpacing = this.sliderHeight * 2.3;
    this.realXSliderYPos = this.sliderBaseY;
    this.imgXSliderYPos = this.sliderBaseY + (sliderSpacing * 1);
    this.realYSliderYPos = this.sliderBaseY + (sliderSpacing * 2);
    this.imgYSliderYPos = this.sliderBaseY + (sliderSpacing * 3);

    // realX slider
    this.realXSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.realXSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1
    );
    this.realXSlider.setLabel("realX:");
    this.realXSlider.showLabel = true;

    // imgX slider
    this.imgXSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.imgXSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1
    );
    this.imgXSlider.setLabel("imgX:");
    this.imgXSlider.showLabel = true;

    // realY slider
    this.realYSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.realYSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1
    );
    this.realYSlider.setLabel("realY:");
    this.realYSlider.showLabel = true;

    // imgY slider
    this.imgYSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.imgYSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1
    );
    this.imgYSlider.setLabel("imgY:");
    this.imgYSlider.showLabel = true;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // ...
    this.updateMiscellanea();


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    this.realCircleColor = this.p.color(0);
    this.unitCircleColor = this.p.color(colors["unitCircle0"]);
    this.imgCircleColor = this.p.color(colors["imgCircle0"]);  // TODO, change me

    this.vectorColor = this.p.color(0);
    this.imgVectorColor = this.p.color(colors["imgCircle0"]);  // TODO, change me

    this.pointColor = this.p.color(0);
    this.pointColorHovered = this.p.color(colors["point0"]);
    this.imgPointColor = this.p.color(colors["imgCircle0"]);  // TODO, change me
    this.imgPointColorHovered = this.p.color(colors["imgPoint0"]);

    this.pointLabelBaseColor = this.p.color(0);
    this.pointLabelSecondaryColor = this.p.color(colors["pointLabel0"]);

    this.errorColor = this.p.color(colors["error0"]);  // TODO, change me

    this.realProjectionXColor = this.p.color(0);
    this.realProjectionYColor = this.p.color(0);
    this.imgProjectionXColor = this.p.color(colors["imgCircle0"]);  // TODO, change me
    this.imgProjectionYColor = this.p.color(colors["imgCircle0"]);  // TODO, change me

    // TODO
    this.sliderBarColor = this.p.color(colors["sliderBar0"]);
    this.sliderLabelColor = this.p.color(0);

    // this.realSliderBarValueColor = this.p.color(0);  // ugh
    this.realSliderBarValueColor = this.p.color(colors["sliderBarValue0"]);
    this.realSliderKnobColor = this.p.color(colors["sliderKnob0"]);
    this.realSliderKnobHoveredColor = this.p.color(colors["sliderKnobHovered0"]);

    // this.imgSliderBarValueColor = this.p.color(colors["imgCircle0"]);
    this.imgSliderBarValueColor = this.p.color(colors["sliderBarValue0"]);
    // this.imgSliderKnobColor = this.p.color(colors["imgPoint0"]);
    this.imgSliderKnobColor = this.p.color(colors["sliderKnob0"]);
    this.imgSliderKnobHoveredColor = this.p.color(colors["sliderKnobHovered0"]);

    this.realXSlider.barColor = this.sliderBarColor;
    this.realXSlider.barValueColor = this.realSliderBarValueColor;
    this.realXSlider.knobColor = this.realSliderKnobColor;
    this.realXSlider.knobColorHovered = this.realSliderKnobHoveredColor;
    this.realXSlider.labelColor = this.sliderLabelColor;

    this.realYSlider.barColor = this.sliderBarColor;
    this.realYSlider.barValueColor = this.realSliderBarValueColor;
    this.realYSlider.knobColor = this.realSliderKnobColor;
    this.realYSlider.knobColorHovered = this.realSliderKnobHoveredColor;
    this.realYSlider.labelColor = this.sliderLabelColor;

    this.imgXSlider.barColor = this.sliderBarColor;
    this.imgXSlider.barValueColor = this.imgSliderBarValueColor;
    this.imgXSlider.knobColor = this.imgSliderKnobColor;
    this.imgXSlider.knobColorHovered = this.imgSliderKnobHoveredColor;
    this.imgXSlider.labelColor = this.sliderLabelColor;

    this.imgYSlider.barColor = this.sliderBarColor;
    this.imgYSlider.barValueColor = this.imgSliderBarValueColor;
    this.imgYSlider.knobColor = this.imgSliderKnobColor;
    this.imgYSlider.knobColorHovered = this.imgSliderKnobHoveredColor;
    this.imgYSlider.labelColor = this.sliderLabelColor;
  }


  // ----------------------------------------------

  /* Value as an array of complex numbers...
     [alpha, beta]
  */
  getKet () {
    return [
      math.complex(this.realX, this.imgX),
      math.complex(this.realY, this.imgY)
    ];
  }

  /* Set value from ket...
  */
  setFromKet (ket) {
    this.realX = ket[0].re;
    this.imgX = ket[0].im;
    this.realX = ket[1].re;
    this.imgX = ket[1].im;

    // TODO, call `updateValuesUsingKet` here?
  }


  // ----------------------------------------------

  calculateRealMagnitude () {
    return this.p.sqrt(this.p.sq(this.realX) + this.p.sq(this.realY));
  }

  calculateImaginaryMagnitude () {
    return this.p.sqrt(this.p.sq(this.imgX) + this.p.sq(this.imgY));
  }


  // ----------------------------------------------

  setCenter (x, y) {
    this.centerX = x;
    this.centerY = y;

    // Hmm...
    this.updateMiscellanea();
  }


  // ----------------------------------------------

  isUnitary () {
    return compareFloat(
      1,
      this.p.sq(this.realX) + this.p.sq(this.imgX) +
      this.p.sq(this.realY) + this.p.sq(this.imgY)
    );
  }


  // ----------------------------------------------

  setSize (newCircleWidth) {

    this.circleWidth = newCircleWidth;
    this.circleRadius = this.circleWidth / 2;
    this.circleHalfRadius = this.circleRadius / 2;

    // Shrink point size? or KISS?
    /*if (newCircleWidth < this.baseCircleWidth * 0.5)
    {
      this.pointDiameter = 6;
      this.pointDiameterHovered = this.pointDiameter * 1.3;
      this.pointRadius = this.pointDiameter / 2;
      this.imgPointDiameter = this.pointDiameter * 0.8;

      this.vectorThickness = 3;
      this.imgVectorThickness = 2;
    }*/

    // TODO, sliders would need to be resized

    this.updateMiscellanea();
  }


  // ----------------------------------------------

  updateValuesUsingMouse (updateRealValues) {
    /* Assumes `this.imgX` and `this.imgY`
       have *previously* been set with sliders
    */

    let theta = this.p.atan2(
      this.p.mouseY - this.centerY,
      this.p.mouseX - this.centerX
    );

    let ux = this.p.cos(theta);
    let uy = this.p.sin(theta);

    if (updateRealValues) {
      this.realX = ux * this.realMagnitude;
      this.realY = uy * this.realMagnitude;

      // propogate change to sliders
      this.realXSlider.setValue(this.realX);
      this.realYSlider.setValue(this.realY);  // TODO, the p5 y thing =/
    }
    else {
      this.imgX = ux * this.imgMagnitude;
      this.imgY = uy * this.imgMagnitude;

      // propogate change to sliders
      this.imgXSlider.setValue(this.imgX);
      this.imgYSlider.setValue(this.imgY);  // TODO, the p5 y thing =/
    }

    // TODO, would need to propogate change to sliders

    //
    this.updateMiscellanea();
  }

  updateValuesUsingSliders () {
    /* Assumes `this.imgX` and `this.imgY`
       have *just* been set with sliders
    */

// TODO

// TODO, handle locking/auto

    /* If user sets real sliders, imaginary values are auto-computed
       to create normalized vector.
       And vice versa if user sets imaginary sliders
    */
    if (this.autoNormalizeSliders) {

      // user set real, auto set imaginary
      if (this.realXSlider.knobIsSelected || this.realYSlider.knobIsSelected) {
        console.log("user set real, auto set imaginary");
        // get values from slider
        this.realX = this.realXSlider.getValue();
        this.realY = this.realYSlider.getValue();

        // calculate magnitudes
        let realMagnitudeSquared = this.p.sq(this.realX) + this.p.sq(this.realY);
        this.realMagnitude = this.p.sqrt(realMagnitudeSquared);
        this.imgMagnitude = this.p.sqrt(1 - realMagnitudeSquared);

        // get current angle
        let theta = this.p.atan2(this.imgY, this.imgX);
        console.log(this.imgY, this.imgX, theta);

        // calculate new values
        this.imgX = this.p.cos(theta) * this.imgMagnitude;
        this.imgY = this.p.sin(theta) * this.imgMagnitude;
      }

      // user set imaginary, auto set real
      else {
        console.log("user set imaginary, auto set real");
        // get values from slider
        this.imgX = this.imgXSlider.getValue();
        this.imgY = this.imgYSlider.getValue();

        // calculate magnitudes
        let imgMagnitudeSquared = this.p.sq(this.imgX) + this.p.sq(this.imgY);
        this.imgMagnitude = this.p.sqrt(imgMagnitudeSquared);
        this.realMagnitude = this.p.sqrt(1 - imgMagnitudeSquared);

        // get current angle
        let theta = this.p.atan2(this.realY, this.realX);
        console.log(theta);

        // calculate new values
        this.realX = this.p.cos(theta) * this.realMagnitude;
        this.realY = this.p.sin(theta) * this.realMagnitude;

        // TODO, figure out theta src...
        /*let theta = this.p.atan2(
          this.p.mouseY - this.centerY,
          this.p.mouseX - this.centerX
        );

        let ux = this.p.cos(theta);
        let uy = this.p.sin(theta);

        this.realX = ux * this.realMagnitude;
        this.realY = uy * this.realMagnitude;*/
      }
    }

    else {
      console.log("use all slider values");
      // get values from slider
      this.realX = this.realXSlider.getValue();
      this.realY = this.realYSlider.getValue();
      this.imgX = this.imgXSlider.getValue();
      this.imgY = this.imgYSlider.getValue();

      this.realMagnitude = this.calculateRealMagnitude();  // TODO, move assignment to calculate function ??
      this.imgMagnitude = this.calculateImaginaryMagnitude();
    }

    //
    this.updateMiscellanea();
  }

  updateValuesUsingKet () {
    /* Assumes `this.realX`, `this.imgX`, `this.realY`, and `this.imgY`
       have been set via a call to`setFromKet`
    */

    this.realMagnitude = this.calculateRealMagnitude();
    this.imgMagnitude = this.calculateImaginaryMagnitude();

    // TODO, would need to propogate change to sliders

    //
    this.updateMiscellanea();
  }

  updateMiscellanea () {
    this.pointX = this.realX * this.circleRadius;
    this.pointY = this.realY * this.circleRadius;

    this.imgPointX = this.imgX * this.circleRadius;
    this.imgPointY = this.imgY * this.circleRadius;

    this.pointLabelX = this.realX * (this.circleRadius + this.pointLabelOffset);
    this.pointLabelY = this.realY * (this.circleRadius + this.pointLabelOffset);

    this.pointX += this.centerX;
    this.pointY += this.centerY;
    this.imgPointX += this.centerX;
    this.imgPointY += this.centerY;
    this.pointLabelX += this.centerX;
    this.pointLabelY += this.centerY;

    // TODO
    this.realXSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.realXSliderYPos + this.centerY
    )
    this.imgXSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.imgXSliderYPos + this.centerY
    )
    this.realYSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.realYSliderYPos + this.centerY
    )
    this.imgYSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.imgYSliderYPos + this.centerY
    )
  }


  // ----------------------------------------------

  mouseIsCloseToPoint (pX, pY, pRadius) {
    // User doesn't have to be exact
    let closeEnough = pRadius * 2.5;

    // sq(a) + sq(b) = sq(c)
    closeEnough = this.p.sq(closeEnough);
    let distanceToPoint = (
      this.p.sq(this.p.mouseX - pX) +
      this.p.sq(this.p.mouseY - pY)
    );

    return distanceToPoint <= closeEnough;
  }

  mouseMovedHandler_draggablePoints () {

    // real point
    if (this.mouseIsCloseToPoint(this.pointX, this.pointY, this.pointRadius)) {
      this.pointIsHovered = true;
    }
    else {
      this.pointIsHovered = false;
    }

    // imaginary point
    this.imgPointIsHovered = false;

    if (this.renderAsComplexCircle && this.showImaginaryCircle) {
      if (this.mouseIsCloseToPoint(this.imgPointX, this.imgPointY, this.imgPointRadius)) {
        this.imgPointIsHovered = true;
      }
    }

    // only one can be chosen... default to real
    if (this.pointIsHovered && this.imgPointIsHovered) {
      this.imgPointIsHovered = false;
    }
  }

  mousePressedHandler_draggablePoints () {
    if (this.pointIsHovered) {
      this.pointIsSelected = true;
      // this.p.noCursor();
    }
    else if (this.imgPointIsHovered) {
      this.imgPointIsSelected = true;
      // this.p.noCursor();
    }
  }

  mouseReleasedHandler_draggablePoints () {
    this.pointIsSelected = false;
    this.imgPointIsSelected = false;
    // this.p.cursor();
  }

  mouseDraggedHandler_draggablePoints () {
    if (this.pointIsSelected) {
      this.updateValuesUsingMouse(true);
    }
    else if (this.imgPointIsSelected) {
      this.updateValuesUsingMouse(false);
    }
  }


  // ----------------------------------------------

  mouseMovedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mouseMovedHandler();
    this.imgXSlider.mouseMovedHandler();
    this.realYSlider.mouseMovedHandler();
    this.imgYSlider.mouseMovedHandler();
  }

  mousePressedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mousePressedHandler();
    this.imgXSlider.mousePressedHandler();
    this.realYSlider.mousePressedHandler();
    this.imgYSlider.mousePressedHandler();
  }

  mouseReleasedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mouseReleasedHandler();
    this.imgXSlider.mouseReleasedHandler();
    this.realYSlider.mouseReleasedHandler();
    this.imgYSlider.mouseReleasedHandler();
  }

  mouseDraggedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mouseDraggedHandler();
    this.imgXSlider.mouseDraggedHandler();
    this.realYSlider.mouseDraggedHandler();
    this.imgYSlider.mouseDraggedHandler();

    // Hmm...
    if (
      this.realXSlider.knobIsSelected ||
      this.imgXSlider.knobIsSelected ||
      this.realYSlider.knobIsSelected ||
      this.imgYSlider.knobIsSelected
    ) {
      this.updateValuesUsingSliders();
    }
  }


  // ----------------------------------------------

  mouseMovedHandler () {
    this.mouseMovedHandler_draggablePoints();
    this.mouseMovedHandler_sliders();
  }

  mousePressedHandler () {
    this.mousePressedHandler_draggablePoints();
    this.mousePressedHandler_sliders();
  }

  mouseReleasedHandler () {
    this.mouseReleasedHandler_draggablePoints();
    this.mouseReleasedHandler_sliders();
  }

  mouseDraggedHandler () {
    this.mouseDraggedHandler_draggablePoints();
    this.mouseDraggedHandler_sliders();
  }


  // ----------------------------------------------

  // unit circle (real = 1 and img = 0, or vice versa)
  drawUnitCircle () {
    if (this.renderAsComplexCircle) {
      if (this.isUnitary()) {
        this.p.stroke(this.unitCircleColor);
      }
      else {
        this.p.stroke(this.errorColor);
      }
      this.p.strokeWeight(1);
      this.p.noFill();
      this.p.circle(this.centerX, this.centerY, this.circleWidth);
    }
  }

  drawRealCircle () {
    this.p.stroke(this.realCircleColor);
    this.p.strokeWeight(this.realCircleThickness);
    this.p.noFill();
    this.p.circle(this.centerX, this.centerY, this.circleWidth * this.realMagnitude);
  }

  drawImaginaryCircle () {
    if (this.renderAsComplexCircle && this.showImaginaryCircle) {
      this.p.stroke(this.imgCircleColor);
      this.p.strokeWeight(this.imgCircleThickness);
      this.p.noFill();
      this.p.circle(this.centerX, this.centerY, this.circleWidth * this.imgMagnitude);
    }
  }

  drawRealPoint () {
    // draw line to point
    this.p.strokeWeight(this.vectorThickness);
    this.p.stroke(this.vectorColor);
    this.p.line(this.centerX, this.centerY, this.pointX, this.pointY);

    // draw point
    let d;
    if (this.pointIsHovered || this.pointIsSelected) {
      this.p.fill(this.pointColorHovered);
      d = this.pointDiameterHovered;
    }
    else {
      this.p.fill(this.pointColor);
      d = this.pointDiameter;
    }
    this.p.noStroke();
    this.p.circle(this.pointX, this.pointY, d);
  }

  drawImaginaryPoint () {
    if (this.renderAsComplexCircle && this.showImaginaryCircle)
    {
      // draw line to point
      this.p.strokeWeight(this.imgVectorThickness);
      this.p.stroke(this.imgVectorColor);
      this.p.line(this.centerX, this.centerY, this.imgPointX, this.imgPointY);

      // draw point
      let d;
      if (this.imgPointIsHovered || this.imgPointIsSelected) {
        this.p.fill(this.imgPointColorHovered);
        d = this.imgPointDiameterHovered;
      }
      else {
        this.p.fill(this.imgPointColor);
        d = this.imgPointDiameter;
      }
      this.p.noStroke();
      this.p.circle(this.imgPointX, this.imgPointY, d);
    }
  }

  drawPointLabel () {
    if (!this.showLabel) return;

    this.p.noStroke();
    this.p.textFont("monospace");
    this.p.textSize(this.pointLabelTextSize);

    // flip orientation for legibility
    if (this.realX >= 0) {
      this.p.textAlign(this.p.LEFT, this.p.CENTER);
    }
    else {
      this.p.textAlign(this.p.RIGHT, this.p.CENTER);
    }

    //
    let realXText = roundAtMost(this.realX, 2);
    let imgXText = roundAtMost(this.imgX, 2);
    // TODO, p5 y-axis thing
    let realYText = roundAtMost(-this.realY, 2);  // display cartesian y-direction
    let imgYText = roundAtMost(-this.imgY, 2);  // display cartesian y-direction

    // TODO, add simplified case
    // if (this.showComplexLabel) {}

    // basic label
    {
      this.p.fill(this.pointLabelBaseColor);
      this.p.text(
        `(${realXText} + ${imgXText}i)∣0⟩ + (${realYText} + ${imgYText}i)∣1⟩`,
        // `【${realXText} + ${imgXText}i】∣0⟩ + 【${realYText} + ${imgYText}i】∣1⟩`,
        this.pointLabelX, this.pointLabelY
      );
    }

    // Show whether sum of squares equals 1
    if (this.showNormalizedProof) {

      // equation
      this.p.fill(this.pointLabelSecondaryColor);

      let y = this.pointLabelY + (this.pointLabelTextSize * 2);
      this.p.text(
        ` 1 = (real𝛼² + img𝛼²) + (real𝛽² + img𝛽²)`,
        this.pointLabelX, y
      )

      // substitution
      let symbol;
      if (this.isUnitary()) {
        symbol = "=";
        this.p.fill(this.pointLabelSecondaryColor);
      }
      else {
        symbol = "≠";
        this.p.fill(this.errorColor);
      }

      y += this.pointLabelTextSize * 1.4;
      this.p.text(
        `   ${symbol} ` +
        `(${roundAtMost(this.realX, 2)}² + ${roundAtMost(this.imgX, 2)}²) + ` +
        `(${roundAtMost(this.realY, 2)}² + ${roundAtMost(this.imgY, 2)}²)`,

        this.pointLabelX, y
      )

      y += this.pointLabelTextSize * 1.4;
      this.p.text(
        `   ${symbol} ` +
        `(${roundAtMost(this.p.sq(this.realX), 2)} + ${roundAtMost(this.p.sq(this.imgX), 2)}) + ` +
        `(${roundAtMost(this.p.sq(this.realY), 2)} + ${roundAtMost(this.p.sq(this.imgY), 2)})`,

        this.pointLabelX, y
      )

      // Add one more line if not unitary, less math for user to do in head
      y += this.pointLabelTextSize * 1.4;
      if (symbol === "≠") {
        this.p.text(
          `   ${symbol} ` +
          `${roundAtMost(
            this.p.sq(this.realX) + this.p.sq(this.imgX) + this.p.sq(this.realY) + this.p.sq(this.imgY),
            2
          )}`,
          this.pointLabelX, y
        );
      }
    }
  }

  drawRealAxisProjections () {
    if (!this.showAxisProjections) return;

    this.p.strokeWeight(1);
    this.p.stroke(this.realProjectionXColor);
    this.p.line(this.pointX, this.pointY, this.pointX, this.centerY);
    this.p.stroke(this.realProjectionYColor);
    this.p.line(this.pointX, this.pointY, this.centerX, this.pointY);
  }

  drawImaginaryAxisProjections () {
    if (!this.showAxisProjections) return;

    if (this.renderAsComplexCircle && this.showImaginaryCircle) {
      this.p.strokeWeight(1);
      this.p.stroke(this.imgProjectionXColor);
      this.p.line(this.imgPointX, this.imgPointY, this.imgPointX, this.centerY);
      this.p.stroke(this.imgProjectionYColor);
      this.p.line(this.imgPointX, this.imgPointY, this.centerX, this.imgPointY);
    }
  }

  drawSliders () {
    if (!this.showSliders) return;

    this.realXSlider.render();
    this.imgXSlider.render();
    this.realYSlider.render();
    this.imgYSlider.render();
  }

  render () {
    // this.drawCircle();

    this.drawUnitCircle();

    this.drawImaginaryCircle();
    this.drawImaginaryAxisProjections();
    this.drawImaginaryPoint();

    this.drawRealCircle();
    this.drawRealAxisProjections();
    this.drawRealPoint();

    this.drawPointLabel();

    this.drawSliders();
  }
}
