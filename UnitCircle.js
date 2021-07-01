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

  - Where chuck windowResized event handler?
    - "global" dispatcher?

  - Events that should trigger redraw
    - mouse move, press, release, drag
    - window resize
  - Events that should trigger recalc (recalc should be followed by redraw)
    - mouse drag & selected
    - slider
    - set from ket

  - Make imaginary point draggable?
*/

class UnitCircle {

  constructor (p) {

    this.p = p;  // p5.js instance...

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
    this.showUnitaryProof = true;

    this.showAxisProjections = false;

    this.renderAsComplexCircle = true;
    this.showImaginaryCircle = true;
    this.showImagniaryPoint = true;


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


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // circle dimensions (pixels)
    this.circleWidth = 180;  // TODO, make resizable
    this.circleRadius = this.circleWidth / 2;
    this.circleHalfRadius = this.circleRadius / 2;

    // center pos (pixels)
    this.centerX = 0;  // arbitrary default value
    this.centerY = 0;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // point on real circle

    // point pos (pixels)
    this.pointX;
    this.pointY;
    // point label pos (pixels)
    this.pointLabelX;
    this.pointLabelY;
    this.pointLabelOffset = 30;  // TODO, make resizable
    // this.pointLabelOffset = 20;  // TODO, make resizable
    //
    this.pointLabelTextSize = 14;

    //
    this.pointIsHovered = false;
    this.pointIsSelected = false;
    this.pointDiameter = 10;  // TODO, make resizable
    this.pointDiameterHovered = this.pointDiameter * 1.3;
    this.pointRadius = this.pointDiameter / 2;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // point on imaginary cicle

    // point pos (pixels)
    this.imgPointX;
    this.imgPointY;

    //
    this.imgPointDiameter = this.pointDiameter * 0.8;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // ...
    this.updateMiscellanea();


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // colors
    // this.bgColor = this.p.color(colors["background0"]);

    this.realCircleColor = this.p.color(0);
    // this.unitCircleColor = this.p.color(180);
    this.unitCircleColor = this.p.color(colors["unitCircle0"]);
    this.imgCircleColor = this.p.color(colors["imgCircle0"]);  // TODO, change me

    this.vectorColor = this.p.color(0);
    this.imgVectorColor = this.p.color(colors["imgCircle0"]);  // TODO, change me

    this.pointColor = this.p.color(0);
    this.pointColorHovered = this.p.color(colors["point0"]);
    this.imgPointColor = this.p.color(colors["imgCircle0"]);  // TODO, change me

    this.pointLabelBaseColor = this.p.color(0);
    this.pointLabelSecondaryColor = this.p.color(colors["pointLabel0"]);
    // this.pointLabelErrorColor = this.p.color(255, 0, 0);  // TODO, change me
    this.pointLabelErrorColor = this.p.color(colors["pointLabelError0"]);  // TODO, change me

    this.realProjectionXColor = this.p.color(0);
    this.realProjectionYColor = this.p.color(0);
    this.imgProjectionXColor = this.p.color(colors["imgCircle0"]);  // TODO, change me
    this.imgProjectionYColor = this.p.color(colors["imgCircle0"]);  // TODO, change me
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

    // recalculate realTheta...
  }

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

  setSize () {
    // TODO

/*
    this.circleWidth = ?;
    this.circleRadius = this.circleWidth / 2;
    this.circleHalfRadius = this.circleRadius / 2;

    this.pointLabelOffset = ?

    this.pointDiameter = ?
*/
  }


  // ----------------------------------------------

  updateValuesUsingMouse () {
    /* Assumes `this.imgX` and `this.imgY`
       have *previously* been set with sliders
    */

    let theta = this.p.atan2(
      this.p.mouseY - this.centerY,
      this.p.mouseX - this.centerX
    );

    let ux = this.p.cos(theta);
    let uy = this.p.sin(theta);

    this.realX = ux * this.realMagnitude;
    this.realY = uy * this.realMagnitude;

    //
    this.updateMiscellanea();
  }

  updateValuesUsingSliders () {
    /* Assumes `this.imgX` and `this.imgY`
       have *just* been set with sliders
    */

// TODO
    this.imgX = 0;  // TODO, get value from slider?
    this.imgY = 0;  // TODO, get value from slider?

    let imgMagnitudeSquared = this.p.sq(this.imgX) + sthis.p.q(this.imgY);
    this.imgMagnitude = this.p.sqrt(imgMagnitudeSquared);
    this.realMagnitude = this.p.sqrt(1 - imgMagnitudeSquared);

    let theta = this.p.atan2(
      this.p.mouseY - this.centerY,
      this.p.mouseX - this.centerX
    );

    let ux = this.p.cos(theta);
    let uy = this.p.sin(theta);

    this.realX = ux * this.realMagnitude;
    this.realY = uy * this.realMagnitude;

    //
    this.updateMiscellanea();
  }

  updateValuesUsingKet () {
    /* Assumes `this.realX`, `this.imgX`, `this.realY`, and `this.imgY`
       have been set via a call to`setFromKet`
    */

    this.realMagnitude = this.p.sqrt(this.p.sq(this.realX) + this.p.sq(this.realY));
    this.imgMagnitude = this.p.sqrt(this.p.sq(this.imgX) + sthis.p.q(this.imgY));

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
  }


  // ----------------------------------------------

  mouseMovedHandler () {

    // User doesn't have to be exact
    let closeEnough = this.pointRadius * 2.5;

    // sq(a) + sq(b) = sq(c)
    closeEnough = this.p.sq(closeEnough);
    let distanceToPoint = (
      this.p.sq(this.p.mouseX - this.pointX) +
      this.p.sq(this.p.mouseY - this.pointY)
    );

    if (distanceToPoint <= closeEnough) {
      this.pointIsHovered = true;
    }
    else {
      this.pointIsHovered = false;
    }
  }

  mousePressedHandler () {
    if (this.pointIsHovered) {
      this.pointIsSelected = true;
      // this.p.noCursor();
    }
  }

  mouseReleasedHandler () {
    this.pointIsSelected = false;
    // this.p.cursor();
  }

  mouseDraggedHandler () {
    if (this.pointIsSelected) {
      this.updateValuesUsingMouse();
    }
  }


  // ----------------------------------------------

  drawCircle () {
    this.p.noFill();
    this.p.strokeWeight(1);

    if (this.renderAsComplexCircle) {
      // unit circle (real = 1 and img = 0, or vice versa)
      this.p.stroke(this.unitCircleColor);
      this.p.circle(this.centerX, this.centerY, this.circleWidth);

      // imaginary circle
      if (this.showImaginaryCircle) {
        this.p.stroke(this.imgCircleColor);
        this.p.circle(this.centerX, this.centerY, this.circleWidth * this.imgMagnitude);
      }

      // real circle
      this.p.stroke(this.realCircleColor);
      this.p.circle(this.centerX, this.centerY, this.circleWidth * this.realMagnitude);
    }
    else {
      // real circle
      this.p.stroke(this.realCircleColor);
      this.p.circle(this.centerX, this.centerY, this.circleWidth * this.realMagnitude);
    }
  }

  drawAxisProjections () {
    // Imaginary
    if (this.renderAsComplexCircle && this.showImaginaryCircle) {
      this.p.stroke(this.imgProjectionXColor);
      this.p.line(this.imgPointX, this.imgPointY, this.imgPointX, this.centerY);
      this.p.stroke(this.imgProjectionYColor);
      this.p.line(this.imgPointX, this.imgPointY, this.centerX, this.imgPointY);
    }

    // Real
    this.p.strokeWeight(1);
    this.p.stroke(this.realProjectionXColor);
    this.p.line(this.pointX, this.pointY, this.pointX, this.centerY);
    this.p.stroke(this.realProjectionYColor);
    this.p.line(this.pointX, this.pointY, this.centerX, this.pointY);
  }

  drawPoint () {
    // Imaginary
    if (this.renderAsComplexCircle && this.showImaginaryCircle && this.showImagniaryPoint)
    {
      // draw line to point
      this.p.strokeWeight(2);
      this.p.stroke(this.imgVectorColor);
      this.p.line(this.centerX, this.centerY, this.imgPointX, this.imgPointY);

      // draw point
      this.p.noStroke();
      this.p.fill(this.imgPointColor);
      this.p.circle(this.imgPointX, this.imgPointY, this.imgPointDiameter);
    }

    // Real
    {
      // draw line to point
      this.p.strokeWeight(4);
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
  }

  drawPointLabel () {
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
    let realYText = roundAtMost(- this.realY, 2);  // display cartesian y-direction
    let imgYText = roundAtMost(- this.imgY, 2);  // display cartesian y-direction

    // TODO, would need to add simplified case
  // if (this.showComplexLabel) {}

    // basic label
    {
      this.p.fill(this.pointLabelBaseColor);
      this.p.text(
        `(${realXText} + ${imgXText}i) ∣0⟩ + (${realYText} + ${imgYText}i) ∣1⟩`,
        this.pointLabelX, this.pointLabelY
      );
    }

    if (this.showUnitaryProof) {

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
        this.p.fill(this.pointLabelErrorColor);
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
    }
  }

  drawImaginarySliders () {
    // ...
  }

  render () {
    this.drawCircle();

    if (this.showAxisProjections) {
      this.drawAxisProjections();
    }

    this.drawPoint();

    if (this.showLabel) {
      this.drawPointLabel();
    }
  }
}
