
/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('interpolation', {
  schema: {
    enabled: { default: true },
    deltaPos: { default: 0.001 },
    deltaScale: { default: 0.001 },
    deltaRot: { default: 0.1 }
  },

  init: function () {

    this.driver = vwf.views["/drivers/view/aframeComponent"];
    //this.el.sceneEl.components['scene-utils'].interpolationComponents[this.el.id] = this;

  },

  update: function (oldData) {

    if (!this.interpolation) {
      this.deltaPos = parseFloat(this.data.deltaPos);
      this.deltaScale = parseFloat(this.data.deltaScale);
      this.deltaRot = THREE.Math.degToRad(parseFloat(this.data.deltaRot));

      this.enabled = JSON.parse(this.data.enabled);
      if (this.enabled) {
      }
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { 

    //delete this.el.sceneEl.components['scene-utils'].interpolationComponents[this.el.id]

  },

  /**
   * Called on each scene tick.
   */
  // interpolationTick
  tick: function (t, dt) {


    var now = performance.now();
    var timepassed = now - this.lastTime;

    //console.log(timepassed);

    if (!this.node) {
      let interNode = Object.entries(this.driver.state.nodes).find(el =>
        el[1].parentID == this.el.id && el[1].extendsID == "proxy/aframe/interpolation-component.vwf"
      );
      this.node = this.driver.nodes[interNode[0]];
      this.nodeState = interNode[1];
    }

    if (this.enabled && this.node && this.node.interpolate && this.driver.interpolateView) {
      this.setInterpolatedTransforms(timepassed);

      // this.restoreTransforms();

    }
    this.lastTime = now;



  },

  //interpolationTock
  tock: function (t, dt) {
    if (this.node) {
      if (this.enabled && this.node.interpolate && this.driver.interpolateView) {
        this.restoreTransforms();
      }

    }
  },

  vecCmpThreeJS: function (a, b, delta) {

    let distance = a.distanceTo(b);
    //let distance = goog.vec.Vec3.distance(a,b);
    if (distance > delta) {
      return false;
    }

    return true;
  },

  vecCmp: function (a, b, delta) {

    // let distance = a.distanceTo(b);
    let distance = a.distanceTo(b);
    if (distance > delta) {
      return false;
    }

    return true;
  },

  restoreTransforms: function () {

    this.restorePositionTransforms();
    this.restoreRotationTransforms();
    this.restoreScaleTransforms();

    this.el.object3D.updateMatrixWorld( true );

  },

  restorePositionTransforms: function () {

    var now = this.node.interpolate.position.selfTick;

    if (now && this.node.needPositionRestore) {
      let pos = now.clone();
      this.el.object3D.position.copy(pos);
      this.node.needPositionRestore = false;
    }

  },

  restoreRotationTransforms: function () {

    var now = this.node.interpolate.rotation.selfTick;

    if (now && this.node.needRotationRestore) {
      let r = new THREE.Euler();
      let rot = r.copy(now);

      this.el.object3D.rotation.set(rot.x, rot.y, rot.z)
      this.node.needRotationRestore = false;

    }
  },

  restoreScaleTransforms: function () {

    var now = this.node.interpolate.scale.selfTick;

    if (now && this.node.needScaleRestore) {
      let pos = now.clone();
      this.el.object3D.scale.copy(pos);
      this.node.needScaleRestore = false;
    }

  },


  setInterpolatedTransforms: function (deltaTime) {

    var step = (this.node.tickTime) / (this.node.realTickDif);
    step = Math.min(step, 1);
    //step = Math.min(1, .2 * (deltaTime / 16.6)) //Math.min(step, 1);
    deltaTime = Math.min(deltaTime, this.node.realTickDif)
    this.node.tickTime += deltaTime || 0;


    this.interpolatePosition(step);
    this.interpolateRotation(step);
    this.interpolateScale(step);

    // if (this.node.tickTime == 0){
    //   this.restoreTransforms();
    // }

  },
  radians: function (degrees) {
    // return degrees * Math.PI / 180.0;
    return THREE.Math.degToRad(degrees)
  },

  interpolateRotation: function (step) {

    let last = this.node.interpolate.rotation.lastTick;
    let now = this.node.interpolate.rotation.selfTick;

    if (last && now) {

      let comp = this.vecCmpThreeJS(last.toVector3(), now.toVector3(), this.deltaRot);

      if (!comp) {

        // console.log('Last:', last, ' Now: ', now);

        let lastV = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
          (last.x),
          (last.y),
          (last.z), last.order//'YXZ'
        ));

        let nowV = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
          (now.x),
          (now.y),
          (now.z), last.order//'YXZ'
        ));

        let q = new THREE.Quaternion();
        let e = new THREE.Euler();

        THREE.Quaternion.slerp(lastV, nowV, q, step || 0);
        let interp = e.setFromQuaternion(q, last.order); //'YXZ');

        //this.el.object3D.rotation.set(interp.x, interp.y, interp.z);
        this.setRotation(interp);
        this.node.needRotationRestore = true;
      }
    }
  },

  interpolatePosition: function (step) {

    var last = this.node.interpolate.position.lastTick; //this.node.lastTickTransform;
    var now = this.node.interpolate.position.selfTick; //Transform;

    if (last && now) {

      let comp = this.vecCmp(last, now, this.deltaPos);

      if (!comp) {

        var interp = new THREE.Vector3().lerpVectors(
          last, now,
          step || 0
        );

        this.setPosition(interp);
        this.node.needPositionRestore = true;
      }
    }
  },

  interpolateScale: function (step) {

    var last = this.node.interpolate.scale.lastTick; //this.node.lastTickTransform;
    var now = this.node.interpolate.scale.selfTick; //Transform;

    if (last && now) {

      let comp = this.vecCmp(last, now, this.deltaScale);

      if (!comp) {

        var interp = new THREE.Vector3().lerpVectors(
          last, now,
          step || 0
        );

        this.setScale(interp);
        this.node.needScaleRestore = true;
      }
    }
  },

  setPosition: function (interp) {
    let vec = interp.clone();
    this.el.object3D.position.copy(vec);
  },

  setRotation: function (interp) {
    let vec = (new THREE.Euler()).copy(interp);
    this.el.object3D.rotation.set(vec.x, vec.y, vec.z);
  },

  setScale: function (interp) {
    let vec = interp.clone();
    this.el.object3D.scale.copy(vec);
  },


  pause: function () { },
  play: function () { }
});