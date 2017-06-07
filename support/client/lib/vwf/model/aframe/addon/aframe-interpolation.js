/* Interpolate component for A-Frame VR. https://github.com/scenevr/aframe-interpolate-component.git

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

function getMillis () {
  return new Date().getTime();
}

function PositionInterpolator (timestep, entity) {
  var time = getMillis();
  var previous;
  var next;

  entity.el.addEventListener('componentchanged', function (event) {
    if (getTime() < 0.5) {
      // fixme - ignore multiple calls
      return;
    }

    if (event.detail.name === 'position') {
      if (!previous) {
        previous = new THREE.Vector3();
        next = new THREE.Vector3();
      }

      time = getMillis();
      previous.copy(next);
      next.copy(event.detail.newData);
    }
  });

  function getTime () {
    return (getMillis() - time) / timestep;
  }

  this.active = function () {
    return previous && next && (getTime() < 1.0);
  };

  var v = new THREE.Vector3();

  this.get = function () {
    return v.lerpVectors(previous, next, getTime());
  };
}

function radians(degrees) {
  return degrees * Math.PI / 180.0;
}

function RotationInterpolator (timestep, entity) {
  var time = getMillis();
  var previous;
  var next;

  entity.el.addEventListener('componentchanged', function (event) {
    if (getTime() < 0.5) {
      // fixme - ignore multiple calls
      return;
    }

    if (event.detail.name === 'rotation') {
      if (!previous) {
        previous = new THREE.Quaternion();
        next = new THREE.Quaternion();
      }

      time = getMillis();
      previous.copy(next);
      next.setFromEuler(new THREE.Euler(
        radians(event.detail.newData.x),
        radians(event.detail.newData.y),
        radians(event.detail.newData.z),'YXZ'
      ));
    }
  });

  function getTime () {
    return (getMillis() - time) / timestep;
  }

  this.active = function () {
    return previous && next && (getTime() < 1.0);
  };

  var e = new THREE.Euler();
  var q = new THREE.Quaternion();
  this.get = function () {
    THREE.Quaternion.slerp(previous, next, q, getTime());
    return e.setFromQuaternion(q);
  };
}

/**
 * Interpolate component for A-Frame.
 */
AFRAME.registerComponent('interpolation', {
  schema: {
    duration: { default: 200 }
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    if (!this.interpolation) {
      var timestep = parseInt(this.data.duration, 10);

      this.positionInterpolator = new PositionInterpolator(timestep, this);
      this.rotationInterpolator = new RotationInterpolator(timestep, this);
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  tick: function (t) {
    if (this.positionInterpolator && this.positionInterpolator.active()) {
      this.el.object3D.position.copy(this.positionInterpolator.get());
    }

    if (this.rotationInterpolator && this.rotationInterpolator.active()) {
      this.el.object3D.rotation.copy(this.rotationInterpolator.get());
    }
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