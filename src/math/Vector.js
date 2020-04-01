/*
    A quick JavaScript 2D vector implementation.
    Based on simplifications of the vector functions in P5.js
    Useful for quick animations in JS using acceleration & velocity.
    MIT License
    Ivaylo Getov, 2015
    www.ivaylogetov.com
    Quick reference:
    let v = new Vector(some_x_val, some_y_val);
        v.set(new_x_val, new_y_val);
        v.add(x_val, y_val) OR v.add(v2);
        v.div(divisor);
        v.mult(scalar);
        v.normalize();
        v.setMag(new_length);
        v.dot(v2) OR v.dot(x_val,y_val);
        v.dist(v2);
        v.limit(max_length);
        v.rotateRads(angle_in_radians);
        v.rotateDegs(angle_in_degrees);
        v.headingDegs();
        v.headingDeg();
        v.angleBetweenRads(v2) OR v.angleBetweenRads(some_x,some_y);
        v.angleBetweenDegs(v2) OR v.angleBetweenDegs(some_x,some_y)
        v.lerp(v2, lerp_amount) OR v.lerp(some_x, some_y, lerp_amount);
        v.equals(v2) OR v.equals(some_x,some_y);
        let v2 = v.copy();
*/
function timeout (ms) {
  return new Promise (resolve => setTimeout (resolve, ms));
}

function Vector (x, y) {
  // create a new instance using "new"
  this.x = x; // let v = new Vector(some_x_val, some_y_val);
  this.y = y;

  this.set = function (x, y) {
    // reset the x,y values of an existing vector.
    this.x = x; // v.set(new_x_val, new_y_val);
    this.y = y;
  };

  this.magSq = function () {
    // returns the length of the vector, squared.
    let x = this.x, y = this.y;
    return x * x + y * y;
  };

  this.mag = function () {
    // returns the length of the vector.
    return Math.sqrt (this.magSq ());
  };

  this.add = function (x, y) {
    // add two vectors together, or add x and y values
    if (x instanceof Vector) {
      // to an existing vector.
      this.x += x.x; // v.add(x_val, y_val) OR v.add(v2)
      this.y += x.y;
      return this;
    }
    this.x += x;
    this.y += y;
    return this;
  };

  this.sub = function (x, y) {
    // same as above, with subtraction
    if (x instanceof Vector) {
      this.x -= x.x;
      this.y -= x.y;
      return this;
    }
    this.x -= x;
    this.y -= y;
    return this;
  };

  this.div = function (n) {
    // divide vector length (ie magnitude) by a constant
    this.x /= n; // v.div(divisor)
    this.y /= n;
    return this;
  };

  this.mult = function (n) {
    // multiply vector length (ie magnitude) by a constant
    this.x *= n; // v.mult(scalar)
    this.y *= n;
    return this;
  };

  this.normalize = function () {
    // set magnitude equal to 1
    return this.div (this.mag ()); // v.normalize()
  };

  this.setMag = function (n) {
    // set magnitude to a given value
    return this.normalize ().mult (n); // v.setMag(new_length)
  };

  this.dot = function (x, y) {
    // returns dot product of two vectors
    if (x instanceof Vector) {
      // v1.dot(v2) OR v.dot(x_val,y_val)
      return this.dot (x.x, x.y);
    }
    return this.x * (x || 0) + this.y * (y || 0);
  };

  this.dist = function (v) {
    // returns the distance between two points defined as vectors
    let d = v.copy ().sub (this); // v1.dist(v2)
    return d.mag ();
  };

  this.limit = function (l) {
    // constrain the magnitude (length) of a vector to the value
    let mSq = this.magSq (); // passed to this function.
    if (mSq > l * l) {
      // v.limit(max_length)
      this.div (Math.sqrt (mSq));
      this.mult (l);
    }
    return this;
  };

  this.headingDegs = function () {
    // returns heading in radians
    let h = Math.atan2 (this.y, this.x);
    return h;
  };

  this.headingDeg = function () {
    // returns heading in Degrees
    let r = Math.atan2 (this.y, this.x);
    let h = r * 180.0 / Math.PI;
    return h;
  };

  this.rotateRads = function (a) {
    // rotates the vector by given angle in radians
    let newHead = this.headingDegs () + a; // v.rotateRads(angle_in_radians)
    let mag = this.mag ();
    this.x = Math.cos (newHead) * mag;
    this.y = Math.sin (newHead) * mag;
    return this;
  };

  this.rotateDegs = function (a) {
    // rotates the vector by given angle in radians
    a = a * Math.PI / 180.0; // v.rotateDegs(angle_in_degrees)
    let newHead = this.headingDegs () + a;
    let mag = this.mag ();
    this.x = Math.cos (newHead) * mag;
    this.y = Math.sin (newHead) * mag;
    return this;
  };

  this.angleBetweenRads = function (x, y) {
    // find the angle between two vectors in radians
    let v1 = this.copy (), v2; // v1.angleBetweenRads(v2) OR v.angleBetweenRads(some_x,some_y)
    if (x instanceof Vector) {
      v2 = x.copy ();
    } else {
      v2 = new Vector (x, y);
    }
    let angle = Math.acos (v1.dot (v2) / (v1.mag () * v2.mag ()));
    return angle;
  };

  this.angleBetweenDegs = function (x, y) {
    // same as above, except in degrees
    let r = this.angleBetweenRads (x, y);
    let d = r * 180 / Math.PI;
    return d;
  };

  this.lerp = function (x, y, amt) {
    // linear interpolate the vector to another vector
    if (x instanceof Vector) {
      // amt is a value between 0.0 (close to the old vector)
      return this.lerp (x.x, x.y, y); // and 1.0 (close to the new vector)
    } // v1.lerp(v2, lerp_amount) OR v.lerp(some_x, some_y, lerp_amount)
    if (amt > 1.0) {
      amt = 1.0;
    }
    this.x += (x - this.x) * amt;
    this.y += (y - this.y) * amt;
    return this;
  };

  this.equals = function (x, y) {
    // checks if two vectors are identical.
    let a, b; // returns true or false
    if (x instanceof Vector) {
      // v1.equals(v2) OR v.equals(some_x,some_y)
      a = x.x || 0;
      b = x.y || 0;
    } else {
      a = x || 0;
      b = y || 0;
    }

    return this.x === a && this.y === b;
  };

  this.copy = function () {
    return new Vector (this.x, this.y); // returns a COPY of the vector (ie pass by value, not by reference)
  }; // let v2 = v1.copy()
}

module.exports = Vector;
