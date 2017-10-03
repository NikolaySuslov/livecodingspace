if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}
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


//https://threejs.org/examples/webgl_shaders_sky.html

AFRAME.registerComponent('skyshader', {


    init: function () {

        let sunSphereEl = document.querySelector('a-scene').querySelector('#sun');
        this.sunSphere = sunSphereEl.object3D;

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

    tick: function (t) {

    }
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