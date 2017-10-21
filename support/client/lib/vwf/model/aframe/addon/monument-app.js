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


AFRAME.registerComponent('avatarbvh0', {

    /**
     * Creates a new THREE.ShaderMaterial using the two shaders defined
     * in vertex.glsl and fragment.glsl.
     */
    init: function () {
        let skeletonHelper;
        let self = this;
        this.clock = new THREE.Clock();



        let loader = new THREE.BVHLoader();
        loader.load("./assets/walk.bvh", function (result) {

            skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
            skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly

            //var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, depthTest: false, depthWrite: false, transparent: true } );

            skeletonHelper.material.depthTest = true;
            skeletonHelper.material.lineWidth = 10.0;
            skeletonHelper.material.depthWrite = true;
            skeletonHelper.material.transparent = false;
            skeletonHelper.material.flatShading = true;

            var boneContainer = new THREE.Group();
            boneContainer.add(result.skeleton.bones[0]);

            self.el.setObject3D('skeletonHelper', skeletonHelper);
            self.el.setObject3D('mesh', boneContainer);
            //scene.add( skeletonHelper );
            // scene.add( boneContainer );

            // play animation
            self.mixer = new THREE.AnimationMixer(skeletonHelper);
            self.mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();

        });

    },
    /**
     * Update the ShaderMaterial when component data changes.
     */
    update: function () {

    },



    tick: function (t) {
        var delta = this.clock.getDelta();

        if (this.mixer) this.mixer.update(delta);
    }
})


AFRAME.registerComponent('avatarbvh', {
    
    
        init: function () {
    
            let helper;
            let self = this;
            this.clock = new THREE.Clock();

            console.log(this.el.object3D);
            this.el.addEventListener('model-loaded', function (evt) {

                const model = evt.detail.model
                console.log(model);

                // let loader = new THREE.BVHLoader();
                // loader.load("./assets/walk.bvh", function (bvh) {

                //     console.log(model);
                //      self.mixer = new THREE.AnimationMixer(model.children[0].children[0]);
                // self.mixer.clipAction(bvh.clip).setEffectiveWeight(1.0).play();

                // })



                //console.log(evt);
                self.mixer = new THREE.AnimationMixer(model);
                self.mixer.clipAction(model.animations[0]).setEffectiveWeight(1.0).play();

            })

            

            let loader = new THREE.BVHLoader();
            loader.load("./assets/walk.bvh", function (bvh) {



                const mesh = self.el.object3D;
                //mesh.material.skinning = true;
                
                // mesh.updateMatrixWorld();
                // mesh.skeleton.calculateInverses();   
                // mesh.normalizeSkinWeights ()
                
                // See example from THREE.Skeleton for the armSkeleton


                // var rootBone = bvh.skeleton.bones[0]
                // mesh.add( rootBone );
            
                
                
                // mesh.bind( bvh.skeleton );
                // skeletonHelper = new THREE.SkeletonHelper(mesh);

                // self.mixer = new THREE.AnimationMixer(mesh );
                // self.mixer.clipAction(bvh.clip).setEffectiveWeight(1.0).play();

            })

        },
    
        update: function () {
        },
    
        tick: function (t) {

            var delta = this.clock.getDelta();
            // update skeletal animcation
            if (this.mixer){
            this.mixer.update(delta)
            }

        }
    })


AFRAME.registerComponent('avatarbvh_best', {

    /**
     * Creates a new THREE.ShaderMaterial using the two shaders defined
     * in vertex.glsl and fragment.glsl.
     */

    createBones: function (object, jsonBones) {
        /* adapted from the THREE.SkinnedMesh constructor */
        // create bone instances from json bone data
        const bones = jsonBones.map(gbone => {
            bone = new THREE.Bone()
            bone.name = gbone.name
            bone.position.fromArray(gbone.pos)
            bone.quaternion.fromArray(gbone.rotq)
            if (gbone.scl !== undefined) bone.scale.fromArray(gbone.scl)
            return bone
        })
        // add bone instances to the root object
        jsonBones.forEach((gbone, index) => {
            if (gbone.parent !== -1 && gbone.parent !== null && bones[gbone.parent] !== undefined) {
                bones[gbone.parent].add(bones[index])
            } else {
               // object.add(bones[index])
            }
        })
        return bones
    },

    createSkinnedMesh: function (mesh, skeleton) {
        // create SkinnedMesh from static mesh geometry and swap it in the scene graph
        const skinnedMesh = new THREE.SkinnedMesh(mesh.geometry, mesh.material)
        skinnedMesh.castShadow = true
        skinnedMesh.receiveShadow = true
        // bind to skeleton
        skinnedMesh.bind(skeleton)
        // swap mesh for skinned mesh
        //mesh.parent.add(skinnedMesh)
       // mesh.parent.remove(mesh)
        return skinnedMesh
    },

    init: function () {
        let helper;
        let self = this;
        this.clock = new THREE.Clock();


        let loader = new THREE.BVHLoader();
        loader.load("./assets/walk.bvh", function (bvh) {

           // skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
           // skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly

           self.bvhData = bvh;

         new THREE.GLTFLoader().load("./assets/av2/avatar.gltf", result => {
             let scene = result

             
             const mesh = new THREE.SkinnedMesh(
                result,
                new THREE.MeshPhongMaterial()
            );
            mesh.material.skinning = true;
            //group.add( mesh );
            
            mesh.updateMatrixWorld();
            mesh.skeleton.calculateInverses();   
            mesh.normalizeSkinWeights ()
            
            // See example from THREE.Skeleton for the armSkeleton
            var rootBone = self.bvhData.skeleton.bones[0]
            mesh.add( rootBone );
            
            // Bind the skeleton to the mesh
            
            
            mesh.bind( self.bvhData.skeleton );
            
            
            
            skeletonHelper = new THREE.SkeletonHelper(mesh);
            //skeletonHelper.skeleton = self.bvhData.skeleton;
            
            //var boneContainer = new THREE.Group();
            // boneContainer.add(mesh);
            
            // mesh.bind(self.bvhData.skeleton, mesh.matrixWorld)
            
            // const bones = self.createBones(result, result.bones)
            
            // mesh.updateMatrixWorld()
            // let skeleton = new THREE.Skeleton(bones, undefined, true)
            // mesh.bind(skeleton, mesh.matrixWorld)
            
            // let body = self.createSkinnedMesh(mesh, skeleton)
            // skeletonHelper = new THREE.SkeletonHelper(body);
            
            
            self.el.setObject3D('mesh', mesh)
            //self.el.setObject3D('mesh',boneContainer)
            
            self.mixer = new THREE.AnimationMixer(mesh );
            self.mixer.clipAction(self.bvhData.clip).setEffectiveWeight(1.0).play();
            //self.mixer.clipAction( mesh.geometry.animations[ 0 ] ).play();
            


        //     const mesh = new THREE.SkinnedMesh(
        //         result,
        //         new THREE.MeshPhongMaterial()
        //     );
        //     mesh.material.skinning = true;
        //     self.el.setObject3D('mesh', mesh)
        //     self.mixer = new THREE.AnimationMixer( mesh );
        //     self.mixer.clipAction( mesh.geometry.animations[ 0 ] ).play();


            // find armature root object.
            // This is a group instance with a userData.bones property
            // containing bones in the same format as would normally be 
            // found on a SkinnedMesh Geometry instance
            
            //let root = scene.getObjectByName('Human')

            // manually create bones and parent them to the root object
            // NOTE: This is normally done in the SkinnedMesh constructor
           
           // const bones = self.createBones(root, root.userData.bones)
           // const bones = bvh.skeleton.bones[0]

            // Important! must update world matrices before creating skeleton instance
            //result.updateMatrixWorld()
            // create skeleton
            // let skeleton = new THREE.Skeleton(bones, undefined, true)
            // const skinnedMesh = new THREE.SkinnedMesh(result, null)
            // skinnedMesh.bind(skeleton, mesh.matrixWorld)
            // create SkinnedMesh from static mesh geometry
           // let body = self.createSkinnedMesh(root.getObjectByName('Body'), skeleton)
            
           //let body = self.createSkinnedMesh(result, skeleton)

            //let clothes = self.createSkinnedMesh(root.getObjectByName('Clothes'), skeleton)
            // create skeleton helper
        //     self.helper = new THREE.SkeletonHelper(root)
        //     scene.add(self.helper)
        //   self.el.setObject3D('mesh', scene)
          // self.el.setObject3D('mesh', clothes)
            //self.el.setObject3D('skeletonHelper', self.helper)


            // scene.add( helper )
            // skeletal animation
          // self.mixer = new THREE.AnimationMixer(root);
          //self.mixer.clipAction(scene.animations[0]).play()
         // self.mixer.clipAction(bvh.clip).setEffectiveWeight(1.0).play();
         // let action = self.mixer.clipAction( scene.animations[ 0 ] ).play();
          //action.enabled = true;

        // self.mixer = new THREE.AnimationMixer(self.helper);
        // self.mixer.clipAction(scene.animations[0]).play();

            // start
            //animate()
        })

    })

    },
    /**
     * Update the ShaderMaterial when component data changes.
     */
    update: function () {

    },



    tick: function (t) {

        var delta = this.clock.getDelta();
        // update skeletal animcation
        if (this.mixer){
        this.mixer.update(delta)
        // update skeleton helper
        //this.helper.update()
        }

    }
})