if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

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
      line.setGeometry( geometry );

//new THREE.Line(geometry, material)

      this.el.setObject3D('mesh', new THREE.Mesh( line.geometry, material ));
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

        this.transformControls.attach( this.el.object3D);
        this.el.sceneEl.setObject3D('control-'+this.el.id,  this.transformControls);

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
              [object.position.x, object.position.y, object.position.z] )  
           
                break;
              case 'rotate':
              vwf_view.kernel.setProperty(object.el.id, 'rotation', 
              [THREE.Math.radToDeg(object.rotation.x), THREE.Math.radToDeg(object.rotation.y), THREE.Math.radToDeg(object.rotation.z)] )  
              
                break;
              case 'scale':
              vwf_view.kernel.setProperty(object.el.id, 'scale', 
              [object.scale.x, object.scale.y, object.scale.z] )
               
                break;
            }
            
            //vwf_view.kernel.fireEvent(evt.detail.target.id, "clickEvent")
      });
    },

    remove: function () {
        this.transformControls.detach();
        this.el.sceneEl.removeObject3D('control-'+this.el.id);
       
      },

    tick: function (t) {
        this.transformControls.update();
    }

  });



AFRAME.registerComponent('cursor-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            console.log('I was clicked at: ', evt.detail.intersection.point);
            let cursorID = 'cursor-avatar-'+ vwf_view.kernel.moniker();
            if (evt.detail.cursorEl.id.includes(vwf_view.kernel.moniker())) {
                 vwf_view.kernel.fireEvent(evt.detail.target.id, "clickEvent")
            }
            
            //vwf_view.kernel.fireEvent(evt.detail.target.id, "clickEvent")
      });
    }
  });

AFRAME.registerComponent('raycaster-listener', {
    init: function () {

        let self = this;
        this.intersected = false;
        this.casters = {}

      this.el.addEventListener('raycaster-intersected', function (evt) {

        if (evt.detail.el.nodeName == 'A-CURSOR') {
            //console.log('CURSOR was intersected at: ', evt.detail.intersection.point);

        } else {
            if (self.intersected) { 
                

            } else {
                console.log('I was intersected at: ', evt.detail.intersection.point);
                vwf_view.kernel.fireEvent(evt.detail.target.id, "intersectEvent")
            }
          
            self.casters[evt.detail.el.id] = evt.detail.el;
            self.intersected = true;
        }
        
      });

      this.el.addEventListener('raycaster-intersected-cleared', function (evt) {


        if (evt.detail.el.nodeName == 'A-CURSOR') {
            //console.log('CURSOR was intersected at: ', evt.detail.intersection.point);

        } else {
            if (self.intersected) { 
                console.log('Clear intersection');
                if (Object.entries(self.casters).length == 1 && (self.casters[evt.detail.el.id] !== undefined))
                {
                    vwf_view.kernel.fireEvent(evt.detail.target.id, "clearIntersectEvent")
            }
                delete self.casters[evt.detail.el.id]
            } else {}
        
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
    tick: function (t) {

    }
})