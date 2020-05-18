/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('scene-utils', {


    init: function () {
        this.mirrors = {};

        const sceneEnterVR = (e) => {

            //vwf_view.kernel.callMethod(vwf.application(), "enterVR");
            let avatarEl = document.querySelector('#avatarControlParent');
            let avatarID = 'avatar-' + vwf_view.kernel.moniker();
            if (AFRAME.utils.device.isMobileVR()) {

                 vwf_view.kernel.callMethod(avatarID, "updateYPositionForXR", [0.0]);
                //avatarEl.setAttribute('position', '0 1.6 0');
                // if (AFRAME.utils.device.isGearVR()){  
                // }

            } else if (AFRAME.utils.device.isMobile()) {
                avatarEl.setAttribute('position', '0 0 0')
            } else {
                avatarEl.setAttribute('position', '0 0 0'); //'0 1.6 0'
            }

            // if (!AFRAME.utils.device.isGearVR() && !AFRAME.utils.device.isMobile()) {
            //     avatarEl.setAttribute('position', '0 1.6 0');
            // }

        }

        const sceneExitVR = (e) => {

            //vwf_view.kernel.callMethod(vwf.application(), "exitVR");
            let avatarEl = document.querySelector('#avatarControlParent');
            let avatarID = 'avatar-' + vwf_view.kernel.moniker();

            if (AFRAME.utils.device.isMobileVR()) {
                //avatarEl.setAttribute('position', '0 0 0');

                vwf_view.kernel.callMethod(avatarID, "updateYPositionForXR", [-1.6]);

            } else if (AFRAME.utils.device.isMobile()) {
                avatarEl.setAttribute('position', '0 1.6 0');
            } else {
                avatarEl.setAttribute('position', '0 0 0');
            }

        }

        this.el.sceneEl.addEventListener('enter-vr', sceneEnterVR);
        this.el.sceneEl.addEventListener('exit-vr', sceneExitVR);

    },

    update: function () {

    },

     tick: function (t) {

            Object.values(this.mirrors).forEach(el => {
                el.mirrorTick.call(el)
            })

     }
})


AFRAME.registerComponent('linepath', {
    schema: {
        color: { default: '#000' },
        width: { default: 0.01 },
        path: {
            default: [
                { x: -0.5, y: 0, z: 0 },
                { x: 0.5, y: 0, z: 0 }
            ]

            // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
            // parse: function (value) {
            //   return value.split(',').map(coordinates.parse);
            // },

            // Serialize array of vec3s in case someone does setAttribute('line', 'path', [...]).
            // stringify: function (data) {
            //   return data.map(coordinates.stringify).join(',');
            // }
        }
    },

    update: function () {
        var material = new MeshLineMaterial({
            color: new THREE.Color(this.data.color), //this.data.color
            lineWidth: this.data.width
        });

        var geometry = new THREE.Geometry();
        this.data.path.forEach(function (vec3) {
            geometry.vertices.push(
                new THREE.Vector3(vec3.x, vec3.y, vec3.z)
            );
        });

        let line = new MeshLine();
        line.setGeometry(geometry);

        //new THREE.Line(geometry, material)

        this.el.setObject3D('mesh', new THREE.Mesh(line.geometry, material));
    },

    remove: function () {
        this.el.removeObject3D('mesh');
    }
});


AFRAME.registerComponent('gizmo', {

    schema: {
        mode: { default: 'translate' }
    },

    update: function (old) {
        let modes = ['translate', 'rotate', 'scale'];
        if (!this.gizmo) {
            let newMode = modes.filter(el => {
                return el == this.data.mode
            })
            if (newMode.length !== 0) {
                this.mode = this.data.mode
                this.transformControls.setMode(this.mode)
            }
        }
    },

    init: function () {
        let self = this
        this.mode = this.data.mode
        let activeCamera = document.querySelector('#avatarControl').getObject3D('camera');
        let renderer = this.el.sceneEl.renderer;

        this.transformControls = new THREE.TransformControls(activeCamera, renderer.domElement);

        this.transformControls.attach(this.el.object3D);
        this.el.sceneEl.setObject3D('control-' + this.el.id, this.transformControls);

        this.transformControls.addEventListener('change', function (evt) {
            // console.log('changed');
            var object = self.transformControls.object;
            if (object === undefined) {
                return;
            }

            var transformMode = self.transformControls.getMode();
            switch (transformMode) {
                case 'translate':
                    vwf_view.kernel.setProperty(object.el.id, 'position',
                        [object.position.x, object.position.y, object.position.z])

                    break;
                case 'rotate':
                    // let q = (new THREE.Quaternion()).setFromEuler(new THREE.Euler(
                    //     (object.rotation.x),
                    //     (object.rotation.y),
                    //     (object.rotation.z), 'XYZ'
                    //   ));
                    // let angle = (new THREE.Euler()).setFromQuaternion(q, 'YXZ');

                    // vwf_view.kernel.setProperty(object.el.id, 'rotation', [THREE.Math.radToDeg(angle.x), THREE.Math.radToDeg(angle.y), THREE.Math.radToDeg(angle.z)])
                    vwf_view.kernel.setProperty(object.el.id, 'rotation',
                        [THREE.Math.radToDeg(object.rotation.x), THREE.Math.radToDeg(object.rotation.y), THREE.Math.radToDeg(object.rotation.z)])

                    break;
                case 'scale':
                    vwf_view.kernel.setProperty(object.el.id, 'scale',
                        [object.scale.x, object.scale.y, object.scale.z])

                    break;
            }

            //vwf_view.kernel.fireEvent(evt.detail.target.id, "clickEvent")
        });
    },

    remove: function () {
        this.transformControls.detach();
        this.el.sceneEl.removeObject3D('control-' + this.el.id);

    },

    // tick: function (t) {
    //    // this.transformControls.update();
    // }

});



AFRAME.registerComponent('cursor-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            console.log('I was clicked at: ', evt.detail.intersection.point);
            let cursorID = 'cursor-avatar-' + vwf_view.kernel.moniker();
            if (evt.detail.cursorEl.id.includes(vwf_view.kernel.moniker())) {
                vwf_view.kernel.fireEvent(evt.detail.intersection.object.el.id, "clickEvent", [vwf_view.kernel.moniker()])
            }
            //vwf_view.kernel.fireEvent(evt.detail.target.id, "clickEvent")
        });
    }
});

AFRAME.registerComponent('aabb-collider-listener', {

    // If the target collidable object is moving, set <a-entity data-aabb-collider-dynamic> on the target. By default, collidable objects are presumed to be static for performance purposes.

    init: function () {

        // let self = this;
        // this.me = vwf_view.kernel.moniker();
        this.el.addEventListener('hitstart', function (evt) {
            vwf_view.kernel.fireEvent(evt.target.id, "hitstartEvent");
        })

        this.el.addEventListener('hitend', function (evt) {
            vwf_view.kernel.fireEvent(evt.target.id, "hitendEvent");
        })
    }



});

AFRAME.registerComponent('raycaster-listener', {
    init: function () {

        let self = this;
        this.intersected = false;
        this.casters = {}
        this.me = vwf_view.kernel.moniker();
        this.driver = vwf.views["vwf/view/aframe"];

        this.el.addEventListener('raycaster-intersected', function (evt) {

            if (evt.detail.el.nodeName == 'A-CURSOR') {
                //console.log('CURSOR was intersected at: ', evt.detail.intersection.point);

            } else {
                if (self.intersected) {

                } else {
                    console.log('I was intersected at: ', evt.target);//evt.detail.getIntersection().point);
                    vwf_view.kernel.fireEvent(evt.target.id, "intersectEvent");
                }

                self.casters[evt.target.id] = evt.target;
                self.intersected = true;
            }

        });

        this.el.addEventListener('raycaster-intersected-cleared', function (evt) {


            if (evt.detail.el.nodeName == 'A-CURSOR') {
                //console.log('CURSOR was intersected at: ', evt.detail.intersection.point);

            } else {
                if (self.intersected) {
                    console.log('Clear intersection');
                    if (Object.entries(self.casters).length == 1 && (self.casters[evt.target.id] !== undefined)) {
                        vwf_view.kernel.fireEvent(evt.target.id, "clearIntersectEvent")
                    }
                    delete self.casters[evt.target.id]
                } else { }

                self.intersected = false;
            }



        });


    }
});

AFRAME.registerComponent('envmap', {

    /**
     * Creates a new THREE.ShaderMaterial using the two shaders defined
     * in vertex.glsl and fragment.glsl.
     */
    init: function () {
        const data = this.data;

        //this.applyToMesh();
        this.el.addEventListener('model-loaded', () => this.applyToMesh());
    },
    /**
     * Update the ShaderMaterial when component data changes.
     */
    update: function () {

    },

    getEnvMap: function () {

        var path = './assets/textures/skybox2/';
        var format = '.jpg';
        var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

        envMap = new THREE.CubeTextureLoader().load(urls);
        envMap.format = THREE.RGBFormat;
        return envMap;

    },

    /**
     * Apply the material to the current entity.
     */
    applyToMesh: function () {

        const mesh = this.el.getObject3D('mesh');
        //var scene = mesh;
        var envMap = this.getEnvMap();


        mesh.traverse(function (node) {

            if (node.material) {

                node.material.side = THREE.BackSide;
                node.material.needsUpdate = true;
                //side = THREE.DoubleSide; break;

            }

        });

        mesh.traverse(function (node) {

            if (node.material && (node.material.isMeshStandardMaterial ||
                (node.material.isShaderMaterial && node.material.envMap !== undefined))) {

                node.material.envMap = envMap;
                node.material.needsUpdate = true;


            }

        });

        // const mesh = this.el.getObject3D('mesh');
        // if (mesh) {
        //   mesh.material = this.material;
        // }

    },
    /**
     * On each frame, update the 'time' uniform in the shaders.
     */
    // tick: function (t) {

    // }
})

//https://threejs.org/examples/webgl_shaders_sky.html

AFRAME.registerComponent('skyshader', {


    makeSun: function () {
        let sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        sunSphere.position.y = - 700000;
        sunSphere.visible = true;

        let scene = this.el.sceneEl;
        this.el.sceneEl.setObject3D('sun', sunSphere);
    },

    init: function () {

        //let sunSphereEl = document.querySelector('a-scene').querySelector('#sun');
        //this.sunSphere = sunSphereEl.object3D;
        this.makeSun();
        this.sunSphere = this.el.sceneEl.getObject3D('sun');

        this.sky = new THREE.Sky();
        let scene = this.el.sceneEl;


        let effectController = {
            turbidity: 5,
            rayleigh: 2,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            luminance: 1,
            inclination: 0, // elevation / inclination
            azimuth: 0.25, // Facing front,
            sun: ! true
        };

        let uniforms = this.sky.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.rayleigh.value = effectController.rayleigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

        this.el.setObject3D('mesh', this.sky.mesh);

        let distance = 400000;

        var theta = Math.PI * (effectController.inclination - 0.5);
        var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

        this.sunSphere.position.x = distance * Math.cos(phi);
        this.sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        this.sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);

        this.sunSphere.visible = effectController.sun;
        this.sky.uniforms.sunPosition.value.copy(this.sunSphere.position);


    },

    update: function () {

    },

    // tick: function (t) {

    // }
})

AFRAME.registerComponent('sun', {


    init: function () {

        this.sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.sunSphere.position.y = - 700000;
        this.sunSphere.visible = true;

        this.el.setObject3D('mesh', this.sunSphere);

    },

    update: function () {
    },

    // tick: function (t) {
    // }
})

AFRAME.registerComponent('gearvrcontrol', {

    init: function () {
        var self = this;
        var controllerID = 'gearvr-' + vwf_view.kernel.moniker();

        this.el.addEventListener('triggerdown', function (event) {
            vwf_view.kernel.callMethod(controllerID, "triggerdown", []);
        });

        this.el.addEventListener('triggerup', function (event) {
            vwf_view.kernel.callMethod(controllerID, "triggerup", []);
        });

    },

    update: function () {
    },

    // tick: function (t) {
    // }
})


AFRAME.registerComponent('wmrvrcontrol', {

    schema: {
        hand: { default: 'right' }
    },

    update: function (old) {
        this.hand = this.data.hand;
    },

    init: function () {
        var self = this;
        this.hand = this.data.hand;
        var controllerID = 'wrmr-' + this.hand + '-' + vwf_view.kernel.moniker();
        //this.gearel = document.querySelector('#gearvrcontrol');
        this.el.addEventListener('triggerdown', function (event) {
            vwf_view.kernel.callMethod(controllerID, "triggerdown", []);
        });
        this.el.addEventListener('triggerup', function (event) {
            vwf_view.kernel.callMethod(controllerID, "triggerup", []);
        });
    },

    // tick: function (t) {
    // }
})

AFRAME.registerComponent('streamsound', {

    schema: {
        positional: { default: true }
    },

    init: function () {
        var self = this;

        let driver = vwf.views["vwf/view/webrtc"];

        this.listener = null;
        this.stream = null;

        if (!this.sound) {
            this.setupSound();
        }

        if (driver) {
            //let avatarID = 'avatar-' + vwf.moniker();
            let avatarID = this.el.id.slice(0, 27); //avatar-0RtnYBBTBU84OCNcAAFY
            let client = driver.state.clients[avatarID];
            if (client) {
                if (client.connection) {
                    this.stream = client.connection.stream;
                    if (this.stream) {
                        this.audioEl = new Audio();
                        this.audioEl.srcObject = this.stream;

                        this.sound.setNodeSource(this.sound.context.createMediaStreamSource(this.stream));
                    }
                }
            }
        }

    },

    setupSound: function () {
        var el = this.el;
        var sceneEl = el.sceneEl;

        if (this.sound) {
            el.removeObject3D(this.attrName);
        }

        if (!sceneEl.audioListener) {
            sceneEl.audioListener = new THREE.AudioListener();
            sceneEl.camera && sceneEl.camera.add(sceneEl.audioListener);
            sceneEl.addEventListener('camera-set-active', function (evt) {
                evt.detail.cameraEl.getObject3D('camera').add(sceneEl.audioListener);
            });
        }
        this.listener = sceneEl.audioListener;

        this.sound = this.data.positional
            ? new THREE.PositionalAudio(this.listener)
            : new THREE.Audio(this.listener);
        el.setObject3D(this.attrName, this.sound);
    },

    remove: function () {
        if (!this.sound) return;

        this.el.removeObject3D(this.attrName);
        if (this.stream) {
            this.sound.disconnect();
        }
    },

    update: function (old) {

    },

    // tick: function (t) {
    // }
})


AFRAME.registerComponent('viewoffset', {

    // fullWidth:
    // fullHeight:
    // xoffset:
    // yoffset:
    // width:
    // height:

    schema: {
        fullWidth: { default: window.innerWidth },
        fullHeight: { default: window.innerHeight },
        xoffset: { default: window.innerWidth / 2 },
        yoffset: { default: window.innerHeight / 2 },
        width: { default: window.innerWidth },
        height: { default: window.innerHeight }
    },


    init: function () {
        var self = this;
        this.el.sceneEl.addEventListener('loaded', setOffset);

        function setOffset() {
            this.setNewOffset();
        }

    },


    update: function (old) {
        this.fullWidth = this.data.fullWidth;
        this.fullHeight = this.data.fullHeight;
        this.xoffset = this.data.xoffset;
        this.yoffset = this.data.yoffset;
        this.width = this.data.width;
        this.height = this.data.height;
        //console.log(this.data);
        this.setNewOffset();
    },

    setNewOffset: function () {
        this.el.object3DMap.camera.setViewOffset(
            this.data.fullWidth,
            this.data.fullHeight,
            this.data.xoffset,
            this.data.yoffset,
            this.data.width,
            this.data.height)
    },

    // tick: function (t) {

    // }
})

AFRAME.registerComponent("virtual-gamepad-controls", {
    schema: {},
  
    init() {
      this.onEnterVr = this.onEnterVr.bind(this);
      this.onExitVr = this.onExitVr.bind(this);
      this.onFirstInteraction = this.onFirstInteraction.bind(this);
      this.onMoveJoystickChanged = this.onMoveJoystickChanged.bind(this);
      this.onMoveJoystickEnd = this.onMoveJoystickEnd.bind(this);
      // this.onLookJoystickChanged = this.onLookJoystickChanged.bind(this);
      // this.onLookJoystickEnd = this.onLookJoystickEnd.bind(this);
  
      this.mockJoystickContainer = document.createElement("div");
      this.mockJoystickContainer.classList.add('mockJoystickContainer');
      const leftMock = document.createElement("div");
      leftMock.classList.add('mockJoystick');
      const leftMockSmall = document.createElement("div");
      leftMockSmall.classList.add('mockJoystick', 'inner');
      leftMock.appendChild(leftMockSmall);
      this.mockJoystickContainer.appendChild(leftMock);
      // const rightMock = document.createElement("div");
      // rightMock.classList.add('mockJoystick');
      // const rightMockSmall = document.createElement("div");
      // rightMockSmall.classList.add('mockJoystick', 'inner');
      // rightMock.appendChild(rightMockSmall);
      // this.mockJoystickContainer.appendChild(rightMock);
      document.body.appendChild(this.mockJoystickContainer);
  
      // Setup gamepad elements
      const leftTouchZone = document.createElement("div");
      leftTouchZone.classList.add('touchZone', 'left');
      document.body.appendChild(leftTouchZone);
  
      this.leftTouchZone = leftTouchZone;
  
      this.leftStick = nipplejs.create({
        zone: this.leftTouchZone,
        color: "white",
        fadeTime: 0
      });
  
      this.leftStick.on("start", this.onFirstInteraction);
      this.leftStick.on("move", this.onMoveJoystickChanged);
      this.leftStick.on("end", this.onMoveJoystickEnd);
  
      // const rightTouchZone = document.createElement("div");
      // rightTouchZone.classList.add('touchZone', 'right');
      // document.body.appendChild(rightTouchZone);
  
      // this.rightTouchZone = rightTouchZone;
  
      // this.rightStick = nipplejs.create({
      //   zone: this.rightTouchZone,
      //   color: "white",
      //   fadeTime: 0
      // });
  
      // this.rightStick.on("start", this.onFirstInteraction);
      // this.rightStick.on("move", this.onLookJoystickChanged);
      // this.rightStick.on("end", this.onLookJoystickEnd);
  
      this.inVr = false;
      this.moving = false;
      this.rotating = false;
  
      this.moveEvent = {
        axis: [0, 0]
      };
  
      // this.rotateYEvent = {
      //   value: 0
      // };
      // this.rotateXEvent = {
      //   value: 0
      // };
  
      this.el.sceneEl.addEventListener("enter-vr", this.onEnterVr);
      this.el.sceneEl.addEventListener("exit-vr", this.onExitVr);
    },
  
    onFirstInteraction() {
      this.leftStick.off("start", this.onFirstInteraction);
      //this.rightStick.off("start", this.onFirstInteraction);
      document.body.removeChild(this.mockJoystickContainer);
    },
  
    onMoveJoystickChanged(event, joystick) {
      const angle = joystick.angle.radian;
      const force = joystick.force < 1 ? joystick.force : 1;
      const moveStrength = 1.85;
      const x = Math.cos(angle) * force * moveStrength;
      const z = Math.sin(angle) * force * moveStrength;
      this.moving = true;
      this.moveEvent.axis[0] = x;
      this.moveEvent.axis[1] = z;
    },
  
    onMoveJoystickEnd() {
      this.moving = false;
      this.moveEvent.axis[0] = 0;
      this.moveEvent.axis[1] = 0;
      this.el.emit("move", this.moveEvent);
    },
  
    onLookJoystickChanged(event, joystick) {
      // Set pitch and yaw angles on right stick move
      const angle = joystick.angle.radian;
      const force = joystick.force < 1 ? joystick.force : 1;
      const turnStrength = 0.5;
      this.rotating = true;
      this.rotateYEvent.value = Math.cos(angle) * force * turnStrength;
      this.rotateXEvent.value = Math.sin(angle) * force * turnStrength;
    },
  
    onLookJoystickEnd() {
      this.rotating = false;
      this.rotateYEvent.value = 0;
      this.rotateXEvent.value = 0;
      this.el.emit("rotateY", this.rotateYEvent);
      this.el.emit("rotateX", this.rotateXEvent);
    },
  
    tick() {
      if (!this.inVr) {
        if (this.moving) {
          this.el.emit("move", this.moveEvent);
        }
  
        // if (this.rotating) {
        //   this.el.emit("rotateY", this.rotateYEvent);
        //   this.el.emit("rotateX", this.rotateXEvent);
        // }
      }
    },
  
    onEnterVr() {
      // Hide the joystick controls
      this.inVr = true;
      this.leftTouchZone.style.display = "none";
      // this.rightTouchZone.style.display = "none";
    },
  
    onExitVr() {
      // Show the joystick controls
      this.inVr = false;
      this.leftTouchZone.style.display = "block";
      // this.rightTouchZone.style.display = "block";
    },
  
    remove() {
      this.el.sceneEl.removeEventListener("entervr", this.onEnterVr);
      this.el.sceneEl.removeEventListener("exitvr", this.onExitVr);
      if (document.getElementsByClassName('mockJoystickContainer').length > 0){
        document.body.removeChild(this.mockJoystickContainer);
      }
      document.body.removeChild(this.leftTouchZone);
      // document.body.removeChild(this.rightTouchZone);
    }
  });
  
////ARJS///

//////////////////////////////////////////////////////////////////////////////
//		arjs-anchor
//////////////////////////////////////////////////////////////////////////////
AFRAME.registerComponent('arjs-anchor', {
    dependencies: ['arjs', 'artoolkit'],
    schema: {
        preset: {
            type: 'string',
        },
        markerhelpers: {	// IIF preset === 'area'
            type: 'boolean',
            default: false,
        },

        // controls parameters
        size: {
            type: 'number',
            default: 1
        },
        type: {
            type: 'string',
        },
        patternUrl: {
            type: 'string',
        },
        barcodeValue: {
            type: 'number'
        },
        changeMatrixMode: {
            type: 'string',
            default: 'modelViewMatrix',
        },
        minConfidence: {
            type: 'number',
            default: 0.6,
        },
        smooth: {
            type: 'boolean',
            default: false,
        },
        smoothCount: {
            type: 'number',
            default: 5,
        },
        smoothTolerance: {
            type: 'number',
            default: 0.01,
        },
        smoothThreshold: {
            type: 'number',
            default: 2,
        },
    },
    init: function () {
        var _this = this

        // get arjsSystem
        var arjsSystem = this.el.sceneEl.systems.arjs || this.el.sceneEl.systems.artoolkit

        //////////////////////////////////////////////////////////////////////////////
        //		Code Separator
        //////////////////////////////////////////////////////////////////////////////

        _this.isReady = false
        _this._arAnchor = null

        //LiveCoding.space fix for editor mode
        if(arjsSystem) {

        // honor object visibility
        if (_this.data.changeMatrixMode === 'modelViewMatrix') {
            _this.el.object3D.visible = false
        } else if (_this.data.changeMatrixMode === 'cameraTransformMatrix') {
            _this.el.sceneEl.object3D.visible = false
        } else console.assert(false)

        // trick to wait until arjsSystem is isReady
        var startedAt = Date.now()
        var timerId = setInterval(function () {
            // wait until the system is isReady
            if (arjsSystem.isReady === false) return

            clearInterval(timerId)

            //////////////////////////////////////////////////////////////////////////////
            //		update arProfile
            //////////////////////////////////////////////////////////////////////////////
            var arProfile = arjsSystem._arProfile

            // arProfile.changeMatrixMode('modelViewMatrix')
            arProfile.changeMatrixMode(_this.data.changeMatrixMode)

            // honor this.data.preset
            var markerParameters = Object.assign({}, arProfile.defaultMarkerParameters)

            if (_this.data.preset === 'hiro') {
                markerParameters.type = 'pattern'
                markerParameters.patternUrl = THREEx.ArToolkitContext.baseURL + 'examples/marker-training/examples/pattern-files/pattern-hiro.patt'
                markerParameters.markersAreaEnabled = false
            } else if (_this.data.preset === 'kanji') {
                markerParameters.type = 'pattern'
                markerParameters.patternUrl = THREEx.ArToolkitContext.baseURL + 'examples/marker-training/examples/pattern-files/pattern-kanji.patt'
                markerParameters.markersAreaEnabled = false
            } else if (_this.data.preset === 'area') {
                markerParameters.type = 'barcode'
                markerParameters.barcodeValue = 1001
                markerParameters.markersAreaEnabled = true
            } else if (_this.data.type === 'barcode') {
                markerParameters = {
                    type: _this.data.type,
                    changeMatrixMode: 'modelViewMatrix',
                    barcodeValue: _this.data.barcodeValue,
                    markersAreaEnabled: false
                }
            } else if (_this.data.type === 'pattern') {
                markerParameters.type = _this.data.type
                markerParameters.patternUrl = _this.data.patternUrl;
                markerParameters.markersAreaEnabled = false
            }

            markerParameters.smooth = _this.data.smooth;
            markerParameters.smoothCount = _this.data.smoothCount;
            markerParameters.smoothTolerance = _this.data.smoothTolerance;
            markerParameters.smoothThreshold = _this.data.smoothThreshold;

            //////////////////////////////////////////////////////////////////////////////
            //		create arAnchor
            //////////////////////////////////////////////////////////////////////////////

            var arSession = arjsSystem._arSession
            var arAnchor = _this._arAnchor = new ARjs.Anchor(arSession, markerParameters)

            // it is now considered isReady
            _this.isReady = true

            //////////////////////////////////////////////////////////////////////////////
            //		honor .debugUIEnabled
            //////////////////////////////////////////////////////////////////////////////
            if (arjsSystem.data.debugUIEnabled) {
                // get or create containerElement
                var containerElement = document.querySelector('#arjsDebugUIContainer')
                if (containerElement === null) {
                    containerElement = document.createElement('div')
                    containerElement.id = 'arjsDebugUIContainer'
                    containerElement.setAttribute('style', 'position: fixed; bottom: 10px; width:100%; text-align: center; z-index: 1; color: grey;')
                    document.body.appendChild(containerElement)
                }
                // create anchorDebugUI
                var anchorDebugUI = new ARjs.AnchorDebugUI(arAnchor)
                containerElement.appendChild(anchorDebugUI.domElement)
            }
        }, 1000 / 60)
    }
    },
    remove: function () {
    },
    update: function () {
    },
    tick: function () {
        var _this = this
        // if not yet isReady, do nothing
        if (this.isReady === false) return

        //////////////////////////////////////////////////////////////////////////////
        //		update arAnchor
        //////////////////////////////////////////////////////////////////////////////
        var arjsSystem = this.el.sceneEl.systems.arjs || this.el.sceneEl.systems.artoolkit
        this._arAnchor.update()

        //////////////////////////////////////////////////////////////////////////////
        //		honor pose
        //////////////////////////////////////////////////////////////////////////////
        var arWorldRoot = this._arAnchor.object3d
        arWorldRoot.updateMatrixWorld(true)
        arWorldRoot.matrixWorld.decompose(this.el.object3D.position, this.el.object3D.quaternion, this.el.object3D.scale)

        //////////////////////////////////////////////////////////////////////////////
        //		honor visibility
        //////////////////////////////////////////////////////////////////////////////
        if (_this._arAnchor.parameters.changeMatrixMode === 'modelViewMatrix') {
            var wasVisible = _this.el.object3D.visible
            _this.el.object3D.visible = this._arAnchor.object3d.visible
        } else if (_this._arAnchor.parameters.changeMatrixMode === 'cameraTransformMatrix') {
            var wasVisible = _this.el.sceneEl.object3D.visible
            _this.el.sceneEl.object3D.visible = this._arAnchor.object3d.visible
        } else console.assert(false)

        // emit markerFound markerLost
        if (_this._arAnchor.object3d.visible === true && wasVisible === false) {
            _this.el.emit('markerFound')
        } else if (_this._arAnchor.object3d.visible === false && wasVisible === true) {
            _this.el.emit('markerLost')
        }
    }
})

//////////////////////////////////////////////////////////////////////////////
//                define some primitives shortcuts
//////////////////////////////////////////////////////////////////////////////

AFRAME.registerPrimitive('a-anchor', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        'arjs-anchor': {},
        'arjs-hit-testing': {},
    },
    mappings: {
        'type': 'arjs-anchor.type',
        'size': 'arjs-anchor.size',
        'url': 'arjs-anchor.patternUrl',
        'value': 'arjs-anchor.barcodeValue',
        'preset': 'arjs-anchor.preset',
        'min-confidence': 'arjs-anchor.minConfidence',
        'marker-helpers': 'arjs-anchor.markerhelpers',
        'smooth': 'arjs-anchor.smooth',
        'smooth-count': 'arjs-anchor.smoothCount',
        'smooth-tolerance': 'arjs-anchor.smoothTolerance',
        'smooth-threshold': 'arjs-anchor.smoothThreshold',

        'hit-testing-render-debug': 'arjs-hit-testing.renderDebug',
        'hit-testing-enabled': 'arjs-hit-testing.enabled',
    }
}))

AFRAME.registerPrimitive('a-camera-static', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        'camera': {},
    },
    mappings: {
    }
}))

//////////////////////////////////////////////////////////////////////////////
//		backward compatibility
//////////////////////////////////////////////////////////////////////////////
// FIXME
AFRAME.registerPrimitive('a-marker', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        'arjs-anchor': {},
        'arjs-hit-testing': {},
    },
    mappings: {
        'type': 'arjs-anchor.type',
        'size': 'arjs-anchor.size',
        'url': 'arjs-anchor.patternUrl',
        'value': 'arjs-anchor.barcodeValue',
        'preset': 'arjs-anchor.preset',
        'min-confidence': 'arjs-anchor.minConfidence',
        'marker-helpers': 'arjs-anchor.markerhelpers',
        'smooth': 'arjs-anchor.smooth',
        'smooth-count': 'arjs-anchor.smoothCount',
        'smooth-tolerance': 'arjs-anchor.smoothTolerance',
        'smooth-threshold': 'arjs-anchor.smoothThreshold',

        'hit-testing-render-debug': 'arjs-hit-testing.renderDebug',
        'hit-testing-enabled': 'arjs-hit-testing.enabled',
    }
}))

AFRAME.registerPrimitive('a-marker-camera', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        'arjs-anchor': {
            changeMatrixMode: 'cameraTransformMatrix'
        },
        'camera': {},
    },
    mappings: {
        'type': 'arjs-anchor.type',
        'size': 'arjs-anchor.size',
        'url': 'arjs-anchor.patternUrl',
        'value': 'arjs-anchor.barcodeValue',
        'preset': 'arjs-anchor.preset',
        'min-confidence': 'arjs-anchor.minConfidence',
        'marker-helpers': 'arjs-anchor.markerhelpers',
    }
}))
//////////////////////////////////////////////////////////////////////////////
//		arjs-hit-testing
//////////////////////////////////////////////////////////////////////////////
AFRAME.registerComponent('arjs-hit-testing', {
	dependencies: ['arjs', 'artoolkit'],
	schema: {
		enabled : {
			type: 'boolean',
			default: false,
		},
		renderDebug : {
			type: 'boolean',
			default: false,
		},
	},
	init: function () {
		var _this = this
		var arjsSystem = this.el.sceneEl.systems.arjs || this.el.sceneEl.systems.artoolkit

// TODO make it work on cameraTransformMatrix too
//
		_this.isReady = false
		_this._arAnchor = null
		_this._arHitTesting = null

        //LiveCdoing.space fix for editor mode

        if(arjsSystem) {

		// trick to wait until arjsSystem is isReady
		var startedAt = Date.now()
		var timerId = setInterval(function(){
			var anchorEl = _this.el
			var anchorComponent = anchorEl.components['arjs-anchor']
			// wait until anchorComponent is isReady
			if( anchorComponent === undefined || anchorComponent.isReady === false )	return

			clearInterval(timerId)

			//////////////////////////////////////////////////////////////////////////////
			//		create arAnchor
			//////////////////////////////////////////////////////////////////////////////
			var arAnchor = anchorComponent._arAnchor
			var arSession = arjsSystem._arSession
			var renderer = arSession.parameters.renderer

			var hitTesting = _this._arHitTesting = new ARjs.HitTesting(arSession)
			hitTesting.enabled = _this.data.enabled

			_this.isReady = true
        }, 1000/60)
    }
	},
	remove : function(){
	},
	update: function () {
	},
	tick: function(){
		var _this = this
		// if not yet isReady, do nothing
		if( this.isReady === false )	return

		var arjsSystem = this.el.sceneEl.systems.arjs || this.el.sceneEl.systems.artoolkit
		var arSession = arjsSystem._arSession

		var anchorEl = _this.el
		var anchorComponent = anchorEl.components['arjs-anchor']
		var arAnchor = anchorComponent._arAnchor


		var hitTesting = this._arHitTesting
		var camera = arSession.parameters.camera
// console.log(camera.position)
		hitTesting.update(camera, arAnchor.object3d, arAnchor.parameters.changeMatrixMode)
	}
});
///////////////END ARJS/////////

///MIRROR//

THREE.ShaderLib[ 'mirror' ] = {

	uniforms: {
		"mirrorColor": { value: new THREE.Color( 0x7F7F7F ) },
		"mirrorSampler": { value: null },
		"textureMatrix" : { value: new THREE.Matrix4() }
	},

	vertexShader: [

		"uniform mat4 textureMatrix;",

		"varying vec4 mirrorCoord;",

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
			"mirrorCoord = textureMatrix * worldPosition;",

			"gl_Position = projectionMatrix * mvPosition;",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec3 mirrorColor;",
		"uniform sampler2D mirrorSampler;",

		"varying vec4 mirrorCoord;",

		"float blendOverlay(float base, float blend) {",
			"return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );",
		"}",

		"void main() {",

			"vec4 color = texture2DProj(mirrorSampler, mirrorCoord);",
			"color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);",

			"gl_FragColor = color;",

		"}"

	].join( "\n" )

};

THREE.Mirror = function ( renderer, camera, options ) {

    
	THREE.Object3D.call( this );

	this.name = 'mirror_' + this.id;

	options = options || {};

	this.matrixNeedsUpdate = true;

	var width = options.textureWidth !== undefined ? options.textureWidth : 512;
	var height = options.textureHeight !== undefined ? options.textureHeight : 512;

	this.clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;

	var mirrorColor = options.color !== undefined ? new THREE.Color( options.color ) : new THREE.Color( 0x7F7F7F );

	this.renderer = renderer;
	this.mirrorPlane = new THREE.Plane();
	this.normal = new THREE.Vector3( 0, 0, 1 );
	this.mirrorWorldPosition = new THREE.Vector3();
	this.cameraWorldPosition = new THREE.Vector3();
	this.rotationMatrix = new THREE.Matrix4();
	this.lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
	this.clipPlane = new THREE.Vector4();

	// For debug only, show the normal and plane of the mirror
	var debugMode = options.debugMode !== undefined ? options.debugMode : false;

	if ( debugMode ) {

		var arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( 0, 0, 0 ), 10, 0xffff80 );
		var planeGeometry = new THREE.Geometry();
		planeGeometry.vertices.push( new THREE.Vector3( - 10, - 10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( 10, - 10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( 10, 10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( - 10, 10, 0 ) );
		planeGeometry.vertices.push( planeGeometry.vertices[ 0 ] );
		var plane = new THREE.Line( planeGeometry, new THREE.LineBasicMaterial( { color: 0xffff80 } ) );

		this.add( arrow );
		this.add( plane );

	}

	if ( camera instanceof THREE.PerspectiveCamera ) {

		this.camera = camera;

	} else {

		this.camera = new THREE.PerspectiveCamera();
		console.log( this.name + ': camera is not a Perspective Camera!' );

    }


	this.textureMatrix = new THREE.Matrix4();

	this.mirrorCamera = this.camera.clone();
    this.mirrorCamera.matrixAutoUpdate = true;


	var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    //this.currentRenderTarget = this.renderer.getRenderTarget();

	this.renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );
	this.renderTarget2 = new THREE.WebGLRenderTarget( width, height, parameters );

	var mirrorShader = THREE.ShaderLib[ "mirror" ];
	var mirrorUniforms = THREE.UniformsUtils.clone( mirrorShader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		fragmentShader: mirrorShader.fragmentShader,
		vertexShader: mirrorShader.vertexShader,
		uniforms: mirrorUniforms

	} );

	this.material.uniforms.mirrorSampler.value = this.renderTarget.texture;
	this.material.uniforms.mirrorColor.value = mirrorColor;
	this.material.uniforms.textureMatrix.value = this.textureMatrix;

	if ( ! THREE.Math.isPowerOfTwo( width ) || ! THREE.Math.isPowerOfTwo( height ) ) {

		this.renderTarget.texture.generateMipmaps = false;
		this.renderTarget2.texture.generateMipmaps = false;

	}

	this.updateTextureMatrix();
    this.render();
    


};

THREE.Mirror.prototype = Object.create( THREE.Object3D.prototype );
THREE.Mirror.prototype.constructor = THREE.Mirror;

THREE.Mirror.prototype.renderWithMirror = function ( otherMirror, aScene ) {

	// update the mirror matrix to mirror the current view
	this.updateTextureMatrix();
	this.matrixNeedsUpdate = false;

	// set the camera of the other mirror so the mirrored view is the reference view
	var tempCamera = otherMirror.camera;
	otherMirror.camera = this.mirrorCamera;

	// render the other mirror in temp texture
	otherMirror.renderTemp(aScene);
	otherMirror.material.uniforms.mirrorSampler.value = otherMirror.renderTarget2.texture;

	// render the current mirror
	this.render(aScene);
	this.matrixNeedsUpdate = true;

	// restore material and camera of other mirror
	otherMirror.material.uniforms.mirrorSampler.value = otherMirror.renderTarget.texture;
	otherMirror.camera = tempCamera;

	// restore texture matrix of other mirror
	otherMirror.updateTextureMatrix();

};

THREE.Mirror.prototype.updateTextureMatrix = function () {

	this.updateMatrixWorld();
	this.camera.updateMatrixWorld();

	this.mirrorWorldPosition.setFromMatrixPosition( this.matrixWorld );
	this.cameraWorldPosition.setFromMatrixPosition( this.camera.matrixWorld );

	this.rotationMatrix.extractRotation( this.matrixWorld );

	this.normal.set( 0, 0, 1 );
	this.normal.applyMatrix4( this.rotationMatrix );

	var view = this.mirrorWorldPosition.clone().sub( this.cameraWorldPosition );
	view.reflect( this.normal ).negate();
	view.add( this.mirrorWorldPosition );

	this.rotationMatrix.extractRotation( this.camera.matrixWorld );

	this.lookAtPosition.set( 0, 0, - 1 );
	this.lookAtPosition.applyMatrix4( this.rotationMatrix );
	this.lookAtPosition.add( this.cameraWorldPosition );

	var target = this.mirrorWorldPosition.clone().sub( this.lookAtPosition );
	target.reflect( this.normal ).negate();
	target.add( this.mirrorWorldPosition );

	this.up.set( 0, - 1, 0 );
	this.up.applyMatrix4( this.rotationMatrix );
	this.up.reflect( this.normal ).negate();

	this.mirrorCamera.position.copy( view );
	this.mirrorCamera.up = this.up;
	this.mirrorCamera.lookAt( target );

	this.mirrorCamera.updateProjectionMatrix();
	this.mirrorCamera.updateMatrixWorld();
	this.mirrorCamera.matrixWorldInverse.getInverse( this.mirrorCamera.matrixWorld );

	// Update the texture matrix
	this.textureMatrix.set( 0.5, 0.0, 0.0, 0.5,
							0.0, 0.5, 0.0, 0.5,
							0.0, 0.0, 0.5, 0.5,
							0.0, 0.0, 0.0, 1.0 );
	this.textureMatrix.multiply( this.mirrorCamera.projectionMatrix );
	this.textureMatrix.multiply( this.mirrorCamera.matrixWorldInverse );

	// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
	// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
	this.mirrorPlane.setFromNormalAndCoplanarPoint( this.normal, this.mirrorWorldPosition );
	this.mirrorPlane.applyMatrix4( this.mirrorCamera.matrixWorldInverse );

	this.clipPlane.set( this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant );

	var q = new THREE.Vector4();
	var projectionMatrix = this.mirrorCamera.projectionMatrix;

	q.x = ( Math.sign( this.clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
	q.y = ( Math.sign( this.clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
	q.z = - 1.0;
	q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

	// Calculate the scaled plane vector
	var c = new THREE.Vector4();
	c = this.clipPlane.multiplyScalar( 2.0 / this.clipPlane.dot( q ) );

	// Replacing the third row of the projection matrix
	projectionMatrix.elements[ 2 ] = c.x;
	projectionMatrix.elements[ 6 ] = c.y;
	projectionMatrix.elements[ 10 ] = c.z + 1.0 - this.clipBias;
	projectionMatrix.elements[ 14 ] = c.w;

};

THREE.Mirror.prototype.render = function (aScene) {

	if ( this.matrixNeedsUpdate ) this.updateTextureMatrix();

	this.matrixNeedsUpdate = true;

	// Render the mirrored view of the current scene into the target texture
	//var scene = aScene //this;

	// while ( scene.parent !== null ) {

	// 	scene = scene.parent;

	// }

    //this.renderer.setRenderTarget( null );

    if ( aScene !== undefined) //&& scene instanceof THREE.Scene ) 
    {

		// We can't render ourself to ourself
		var visible = this.material.visible;
		this.material.visible = false;

        this.renderer.clear();
        this.renderer.setRenderTarget( this.renderTarget);
        this.renderer.render( aScene.object3D, this.mirrorCamera);
        this.renderer.setRenderTarget(null);
   

		//this.renderer.render( scene, this.mirrorCamera, this.renderTarget, true );

		this.material.visible = visible;

	}

};

THREE.Mirror.prototype.renderTemp = function (aScene) {

	if ( this.matrixNeedsUpdate ) this.updateTextureMatrix();

	this.matrixNeedsUpdate = true;

    // Render the mirrored view of the current scene into the target texture
    
	// var scene = this;

	// while ( scene.parent !== null ) {

	// 	scene = scene.parent;

	// }

	if ( aScene !== undefined) //&& scene instanceof THREE.Scene ) {
{
        this.renderer.clear();
        this.renderer.setRenderTarget( this.renderTarget2);
        this.renderer.render( aScene.object3D, this.mirrorCamera );
        this.renderer.setRenderTarget( null );

		//this.renderer.render( scene, this.mirrorCamera, this.renderTarget2, true );

	}

};

AFRAME.registerComponent('mirror', {
    schema:{
        renderothermirror:{default:true},
        camera:{default: 'avatarControl'}
    },
    init: function () {
        var scene = this.el.sceneEl;
        this.cameraID = this.data.camera;
        scene.addEventListener('render-target-loaded',this.OnRenderLoaded()); //this.OnRenderLoaded.bind(this)
    },

    // update: function (old) {
    //     this.cameraID = this.data.camera;
    //     this.OnRenderLoaded();
    // },

    OnRenderLoaded: function()
    {

        var mirrorObj = this.el.getOrCreateObject3D('mesh',THREE.Mesh);
        // var cameraEl = document.querySelector('a-entity[camera]')
        // if(!cameraEl)
        // {
        //     cameraEl = document.querySelector('a-camera');
        // }
        // var camera = cameraEl.components.camera.camera;
        let cameraEl = document.querySelector("[id='" + this.cameraID + "']")
        if (cameraEl){
        let camera = cameraEl.getObject3D('camera'); //document.querySelector('#avatarControl').getObject3D('camera');
        var scene = this.el.sceneEl;
        // this.renderer = new THREE.WebGLRenderer({
        //     antialias: true,
        // });
        this.renderer = scene.renderer;
        this.mirror = new THREE.Mirror( this.renderer, camera, { clipBias: 0.003, textureWidth: window.innerWidth, textureHeight: window.innerHeight, color: 0x777777, debugMode: false} );
        mirrorObj.material = this.mirror.material;
        //mirrorObj.children = [];
        mirrorObj.add(this.mirror);
        }

        //As of A-Frame tick (behaviours) priority issue need to place mirror tick onto upper tick()
        this.el.sceneEl.components['scene-utils'].mirrors[this.el.id] = this;

    },

    remove: function () {
        delete this.el.sceneEl.components['scene-utils'].mirrors[this.el.id]
    },

    mirrorTick: function () {

        //    //this.mirror.render();

            if(!this.data.renderothermirror)
                {
                    this.mirror.render(this.el.sceneEl);
                }
            else
                {
                    var mirrors = [];
                    var mirrorEls = document.querySelectorAll("[mirror]");
                    for(var i=0;i<mirrorEls.length;i++)
                    {
                        if(mirrorEls[i]!=this.el)
                        {
                            mirrors.push(mirrorEls[i].components.mirror.mirror);
                        }   
                    }
                    if(mirrors.length === 0)
                    {
                        this.mirror.render(this.el.sceneEl);
                    }
                    for(var i = 0; i<mirrors.length;i++)
                    {
                        this.mirror.renderWithMirror(mirrors[i], this.el.sceneEl);
                    }
                }
         },

    // tick: function () {

    //  }

    });