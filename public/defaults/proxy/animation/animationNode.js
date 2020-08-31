this.animationUpdate = function(time, duration){

    //console.log("DO on animation update")

}

this.translateBy = function(translation, duration){

this.startTranslationSIM = this.position || goog.vec.Vec3.create();
  var deltaTranslation = this.translationFromValue( translation );
  this.stopTranslationSIM = goog.vec.Vec3.add(
    this.startTranslationSIM,
    deltaTranslation,
    goog.vec.Vec3.create()
  );
  if(duration > 0) {
    this.animationDuration = duration;
    this.animationUpdate = function(time, duration) {
      this.position = goog.vec.Vec3.lerp(
        this.startTranslationSIM, this.stopTranslationSIM,
        time >= duration ? 1 : time / duration,
        goog.vec.Vec3.create()
      );
    }
    this.animationPlay(0, duration);
  }
  else {
    this.position = this.stopTranslationSIM;
  } //@ sourceURL=node3.animation.translateBy.vwf

}

this.translateTo = function(translation, duration){
    this.startTranslationSIM = this.position || goog.vec.Vec3.create();
    this.stopTranslationSIM = this.translationFromValue( translation );
    if(duration > 0) {
      this.animationDuration = duration;
      this.animationUpdate = function(time, duration) {
        this.position = goog.vec.Vec3.lerp(
          this.startTranslationSIM, this.stopTranslationSIM,
          duration == 0 ? duration : time / duration,
          goog.vec.Vec3.create()
        );
      }
      this.animationPlay(0, duration);
    }
    else {
      this.position = this.stopTranslationSIM;
    } //@ sourceURL=node3.animation.translateTo.vwf
}

this.rotateBy = function(rotation, duration, frame) {
    let rotationValue = this.translationFromValue(rotation);
    let deltaQuaternion = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
       (THREE.Math.degToRad(rotationValue[0])),
       (THREE.Math.degToRad(rotationValue[1])),
       (THREE.Math.degToRad(rotationValue[2])), 'XYZ'
     ));
     this.quaterniateBy( deltaQuaternion, duration, frame ); //@ sourceURL=node3.animation.rotateBy.vwf
}

this.rotateTo = function(rotation, duration){
    let rotationValue = this.translationFromValue(rotation);
    let stopQuaternion = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
        (THREE.Math.degToRad(rotationValue[0])),
        (THREE.Math.degToRad(rotationValue[1])),
        (THREE.Math.degToRad(rotationValue[2])), 'XYZ'
      ));
    this.quaterniateTo( stopQuaternion, duration ); //@ sourceURL=node3.animation.rotateTo.vwf
}

this.quaterniateBy = function(quaternion, duration, frame) {

      this.startQuaternionSIM = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
          (THREE.Math.degToRad(this.rotation[0])),
          (THREE.Math.degToRad(this.rotation[1])),
          (THREE.Math.degToRad(this.rotation[2])), 'XYZ'
        ));
      var deltaQuaternion = (new THREE.Quaternion).copy(quaternion);
      if ( ! frame || frame == "rotated" ) {
        this.stopQuaternionSIM = (new THREE.Quaternion()).multiplyQuaternions(deltaQuaternion,  this.startQuaternionSIM);
      } else if ( frame == "scaled" ) {
        this.stopQuaternionSIM = (new THREE.Quaternion()).multiplyQuaternions(this.startQuaternionSIM, deltaQuaternion);
      }
      //this.stopQuaternionSIM = (new THREE.Quaternion()).copy(quaternion);
      if(duration > 0) {
        this.animationDuration = duration;
        this.animationUpdate = function(time, duration) {

          let q = new THREE.Quaternion();
          let e = new THREE.Euler();
          let step = (time >= duration) ? 1 : time / duration;

          THREE.Quaternion.slerp(this.startQuaternionSIM, this.stopQuaternionSIM, q, step || 0);
          let interp = e.setFromQuaternion(q, 'XYZ');
          this.rotation = [THREE.Math.radToDeg(interp.x), THREE.Math.radToDeg(interp.y), THREE.Math.radToDeg(interp.z)];
        }
        this.animationPlay(0, duration);
      }
      else {
        let eE = new THREE.Euler();
        let eQ = (new THREE.Quaternion).copy(this.stopQuaternionSIM);
        let interpE = eE.setFromQuaternion(eQ, 'XYZ');
        this.rotation = [THREE.Math.radToDeg(interpE.x),THREE.Math.radToDeg(interpE.y), THREE.Math.radToDeg(interpE.z)];
        //this.quaternion = this.stopQuaternionSIM;
      } //@ sourceURL=node3.animation.quaterniateBy.vwf

    }
  
    this.quaterniateTo = function(quaternion, duration) {

      this.startQuaternionSIM = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
        (THREE.Math.degToRad(this.rotation[0])),
        (THREE.Math.degToRad(this.rotation[1])),
        (THREE.Math.degToRad(this.rotation[2])), 'XYZ'
      ));
    this.stopQuaternionSIM = (new THREE.Quaternion).copy(quaternion);
    if(duration > 0) {
      this.animationDuration = duration;
      this.animationUpdate = function(time, duration) {

        let q = new THREE.Quaternion();
        let e = new THREE.Euler();
        let step = (time >= duration) ? 1 : time / duration;

        THREE.Quaternion.slerp(this.startQuaternionSIM, this.stopQuaternionSIM, q, step || 0);
        let interp = e.setFromQuaternion(q, 'XYZ');
        this.rotation = [THREE.Math.radToDeg(interp.x), THREE.Math.radToDeg(interp.y), THREE.Math.radToDeg(interp.z)];
      }
      this.animationPlay(0, duration);
    }
    else {
      let eE = new THREE.Euler();
      let eQ = (new THREE.Quaternion).copy(this.stopQuaternionSIM);
      let interpE = eE.setFromQuaternion(eQ, 'XYZ');
      this.rotation = [THREE.Math.radToDeg(interpE.x),THREE.Math.radToDeg(interpE.y), THREE.Math.radToDeg(interpE.z)];
      //this.quaternion = this.stopQuaternionSIM;
    } //@ sourceURL=node3.animation.quaterniateTo.vwf

    }


    this.scaleBy = function(scale, duration){

      this.startScaleSIM = this.scale || goog.vec.Vec3.createFromValues( 1, 1, 1 );
      var deltaScale = this.translationFromValue( scale );
      this.stopScaleSIM = goog.vec.Vec3.createFromValues(
        this.startScaleSIM[0] * deltaScale[0],
        this.startScaleSIM[1] * deltaScale[1],
        this.startScaleSIM[2] * deltaScale[2]
      );
      if(duration > 0) {
        this.animationDuration = duration;
        this.animationUpdate = function(time, duration) {
          this.scale = goog.vec.Vec3.lerp(  // TODO: should be geometric interpolation
            this.startScaleSIM, this.stopScaleSIM,
            duration == 0 ? duration : time / duration,
            goog.vec.Vec3.create()
          );
        }
        this.animationPlay(0, duration);
      }
      else {
        this.scale = this.stopScaleSIM;
      } //@ sourceURL=node3.animation.scaleBy.vwf

    }

    this.scaleTo = function(scale, duration){

      this.startScaleSIM = this.scale || goog.vec.Vec3.createFromValues( 1, 1, 1 );
      this.stopScaleSIM = this.translationFromValue( scale );
      if(duration > 0) {
        this.animationDuration = duration;
        this.animationUpdate = function(time, duration) {
          this.scale = goog.vec.Vec3.lerp(  // TODO: should be geometric interpolation
            this.startScaleSIM, this.stopScaleSIM,
            duration == 0 ? duration : time / duration,
            goog.vec.Vec3.create()
          );
        }
        this.animationPlay(0, duration); 
      }
      else {
        this.scale = this.stopScaleSIM;
      }//@ sourceURL=node3.animation.scaleTo.vwf
    }

    this.transformBy = function(transform, duration){

      var startTransform = this.transform || goog.vec.Vec3.create();
      var deltaTransform = this.transformFromValue( transform );
      // Left multiply by the delta
      var stopTransform = goog.vec.Mat4.multMat( deltaTransform, startTransform, goog.vec.Mat4.createFloat32() );
      this.transformTo( stopTransform, duration ); //@ sourceURL=node3.animation.transformBy.vwf
    }

    this.transformTo = function(transform, duration){

      var stopTransform = this.transformFromValue( transform ) || goog.vec.Mat4.createIdentity();

      if ( duration > 0 ) {

        // Calculate the start and stop translations
        this.startTranslationSIM = this.translation || goog.vec.Vec3.create();
        this.stopTranslationSIM = goog.vec.Vec3.create();
        goog.vec.Mat4.getColumn( stopTransform, 3, this.stopTranslationSIM );
        // Calculate the start and stop quaternion and scale
        this.startScaleSIM = this.scale || goog.vec.Vec3.createFromValues( 1, 1, 1 );
        this.stopScaleSIM = goog.vec.Vec3.create();
        this.startQuaternionSIM = this.quaternion || goog.vec.Quaternion.createFromValues( 0, 0, 0, 1 );
        this.stopQuaternionSIM = goog.vec.Quaternion.fromRotationMatrix4(
          this.unscaledTransform( stopTransform || goog.vec.Mat4.createIdentity(), this.stopScaleSIM, goog.vec.Mat4.create() ),
          goog.vec.Quaternion.create()
        );

        this.animationDuration = duration;
        // Call the appropriate functions to do the translation and quaterniation (that is totally a word)
        this.animationUpdate = function(time, duration) {
          this.translation = goog.vec.Vec3.lerp(
            this.startTranslationSIM, this.stopTranslationSIM,
            duration == 0 ? duration : time / duration,
            goog.vec.Vec3.create()
          );
          this.quaternion = goog.vec.Quaternion.slerp(
            this.startQuaternionSIM, this.stopQuaternionSIM,
            duration == 0 ? duration : time / duration,
            goog.vec.Quaternion.create()
          );
          this.scale = goog.vec.Vec3.lerp(  // TODO: should be geometric interpolation
            this.startScaleSIM, this.stopScaleSIM,
            duration == 0 ? duration : time / duration,
            goog.vec.Vec3.create()
          );
        }
        this.animationPlay(0, duration);
      }
      else {
        this.transform = stopTransform;
      } //@ sourceURL=node3.animation.transformTo.vwf
    }

    this.worldTransformBy = function(transform, duration){

      var startWorldTransform = this.worldTransform || goog.vec.Mat4.create();
      var deltaTransform = this.transformFromValue( transform );
      // Left multiply by the delta
      var stopWorldTransform = goog.vec.Mat4.multMat( deltaTransform, startWorldTransform, 
                                                      goog.vec.Mat4.createFloat32() );
      this.worldTransformTo( stopWorldTransform, duration ) //@ sourceURL=node3.animation.worldTransformBy.vwf
    }

    this.worldTransformTo = function(transform, duration){

      var stopWorldTransform = this.transformFromValue( transform );
      var stopTransform;
      if ( this.parent && this.parent.worldTransform ) {
        // We need to find the local transform that will bring about the desired world transform
        // The math for this looks like -
        // (new worldTransform) = (parentWorldTransform) * (transform)
        // So, if we left multiply both sides by the inverse of the parentWorldTransform...
        // inv(parentWorldTransform) * (new worldTransform) = (transform)
        // Find the inverse parent worldTransform
        var inverseParentWorldTransform = goog.vec.Mat4.createFloat32();
        if ( goog.vec.Mat4.invert( this.parent.worldTransform, inverseParentWorldTransform ) ) {
          // Left multiply the new worldTransform by the inverse parent worldTransform
          stopTransform = goog.vec.Mat4.multMat( inverseParentWorldTransform, stopWorldTransform,
                                                 goog.vec.Mat4.createFloat32() );
        }
        else {
          stopTransform = goog.vec.Mat4.createIdentity();
          this.logger.error( "Parent '" + this.parent.id + "' transform matrix is not invertible: " + 
                             this.parent.transform );
        }
      }
      else {
        stopTransform = stopWorldTransform;
      }
      this.transformTo( stopTransform, duration ); //@ sourceURL=node3.animation.worldTransformTo.vwf
    }