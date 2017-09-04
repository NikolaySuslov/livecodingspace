/* 
The MIT License (MIT)
Copyright (c) 2017 Nikolai Suslov
Updated for using in LiveCoding.space and A-Frame 0.6.x

Interpolate component for A-Frame VR. https://github.com/scenevr/aframe-interpolate-component.git

The MIT License (MIT)

Copyright (c) 2015 Kevin Ngo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* globals AFRAME, performance, THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}


class Interpolator {
  constructor(comp) {
    this.component = comp;
    this.time = this.getMillis();
  }

  active() {
    return this.previous && this.next && (this.getTime() < 1);
  }

  getMillis() {
    return new Date().getTime();
  }

  getTime() {
    return (this.getMillis() - this.time) / this.component.timestep;
  }

  vecCmp(a, b, delta) {

    let distance = a.distanceTo(b);
    if (distance > delta) {
      return false;
    }
    return true;
  }

}

class RotationInterpolator extends Interpolator {

  constructor(comp) {
    super(comp);

    this.lastRotation = this.component.el.getAttribute('rotation');
    this.previous = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
      this.radians(this.lastRotation.x),
      this.radians(this.lastRotation.y),
      this.radians(this.lastRotation.z), 'YXZ'
    ));
    this.next = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
      this.radians(this.lastRotation.x),
      this.radians(this.lastRotation.y),
      this.radians(this.lastRotation.z), 'YXZ'
    ));


  }

  radians(degrees) {
    // return degrees * Math.PI / 180.0;
    return THREE.Math.degToRad(degrees)
  }

  makeInterpolation() {
    let q = new THREE.Quaternion();
    let e = new THREE.Euler();

    THREE.Quaternion.slerp(this.previous, this.next, q, this.getTime());
    return e.setFromQuaternion(q);
  }

  testForLerp() {

    if (this.component.deltaRot == 0) {
      return true
    }

    let prev = (new THREE.Euler()).setFromQuaternion(this.previous).toVector3();
    let next = (new THREE.Euler()).setFromQuaternion(this.next).toVector3();

    if (prev && next && this.vecCmp(prev, next, this.component.deltaRot)) {
      return true
    }
    return false
  }


  inTick(currentRotation) {

    if (this.getTime() < 0.5) {
      // fixme - ignore multiple calls
      return;
    }


    if (!this.previous) {
      // this.previous = new THREE.Quaternion();
      // this.next = new THREE.Quaternion();
      this.previous = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
        this.radians(this.lastRotation.x),
        this.radians(this.lastRotation.y),
        this.radians(this.lastRotation.z), 'YXZ'
      ));

      this.next = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
        this.radians(currentRotation.x),
        this.radians(currentRotation.y),
        this.radians(currentRotation.z), 'YXZ'
      ));
    }

    this.time = this.getMillis();
    this.previous.copy(this.next);
    this.next.setFromEuler(new THREE.Euler(
      this.radians(currentRotation.x),
      this.radians(currentRotation.y),
      this.radians(currentRotation.z), 'YXZ'
    ));

    this.lastRotation = currentRotation;

  }

}


class PositionInterpolator extends Interpolator {

  constructor(comp) {
    super(comp);
    this.lastPosition = this.component.el.getAttribute('position');
    this.previous = (new THREE.Vector3()).fromArray(Object.values(this.lastPosition));
    this.next = (new THREE.Vector3()).fromArray(Object.values(this.lastPosition));

  }


  testForLerp() {

    if (this.component.deltaPos == 0) {
      return true
    }

    if (this.previous && this.next && this.vecCmp(this.previous, this.next, this.component.deltaPos)) {
      return true
    }
    return false
  }

  makeInterpolation() {
    return this.previous.lerp(this.next, this.getTime());
  }

  inTick(currentPosition) {

    if (this.getTime() < 0.5) {
      // fixme - ignore multiple calls
      return;
    }

    if (!this.previous) {
      this.previous = (new THREE.Vector3()).fromArray(Object.values(this.lastPosition));
      this.next = (new THREE.Vector3()).fromArray(Object.values(currentPosition));
    }

    this.time = this.getMillis();
    this.previous.copy(this.next);
    this.next.copy(currentPosition);

    this.lastPosition = currentPosition;

  }

}

/**
 * Interpolate component for A-Frame.
 */
AFRAME.registerComponent('interpolation', {
  schema: {
    duration: { default: 50 },
    enabled: { default: true },
    deltaPos: { default: 0 },
    deltaRot: { default: 0 }
  },



  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {

    // Set up the tick throttling.
    //this.tick = AFRAME.utils.throttleTick(this.throttledTick, 0, this);

    //var el = this.el;
    //this.lastPosition = el.getAttribute('position');


    //this.timestep = 50;
    //this.time = this.getMillis();
    //  this.previous = (new THREE.Vector3()).fromArray(Object.values(this.lastPosition));
    //  this.next = (new THREE.Vector3()).fromArray(Object.values(this.lastPosition));

  },

  // throttledTick: function (time, deltaTime) {

  // },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {

    if (!this.interpolation) {
      this.timestep = parseInt(this.data.duration, 10);
      this.deltaPos = parseFloat(this.data.deltaPos);
      this.deltaRot = THREE.Math.degToRad(parseFloat(this.data.deltaRot));

      this.enabled = JSON.parse(this.data.enabled);

      if (this.enabled) {
        this.posInterpolator = new PositionInterpolator(this);
        this.rotInterpolator = new RotationInterpolator(this);
      }
    }

    // if (!this.interpolation) {
    //   var timestep = parseInt(this.data.duration, 10);

    //   this.positionInterpolator = new PositionInterpolator(timestep, this);
    //   this.rotationInterpolator = new RotationInterpolator(timestep, this);
    // }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  tick: function (t, dt) {

    let currentPosition = this.el.getAttribute('position');
    let currentRotation = this.el.getAttribute('rotation');

    if (this.enabled) {

      if (this.posInterpolator.lastPosition != currentPosition) {
        this.posInterpolator.inTick(currentPosition)
      }
      if (this.posInterpolator.active() && this.posInterpolator.testForLerp()) {
        this.el.object3D.position.copy(this.posInterpolator.makeInterpolation());
      }


      if (this.rotInterpolator.lastRotation != currentRotation) {
        this.rotInterpolator.inTick(currentRotation)
      }
      if (this.rotInterpolator.active() && this.rotInterpolator.testForLerp()) {
        this.el.object3D.rotation.copy(this.rotInterpolator.makeInterpolation());
      }

    }

    // if (this.positionInterpolator && this.positionInterpolator.active()) {
    //   this.el.object3D.position.copy(this.positionInterpolator.get());
    // }

    // if (this.rotationInterpolator && this.rotationInterpolator.active()) {
    //   this.el.object3D.rotation.copy(this.rotationInterpolator.get());
    // }
  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { },
});