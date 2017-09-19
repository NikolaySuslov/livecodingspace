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
    

    AFRAME.registerComponent('avatarbvh', {
        
            /**
             * Creates a new THREE.ShaderMaterial using the two shaders defined
             * in vertex.glsl and fragment.glsl.
             */
            init: function () {
                let skeletonHelper;
                let self = this;
                this.clock = new THREE.Clock();



               let loader = new THREE.BVHLoader();
                loader.load( "./assets/walk.bvh", function( result ) {
    
                    skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );
                    skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly
    
                    //var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, depthTest: false, depthWrite: false, transparent: true } );

                    skeletonHelper.material.depthTest = true;
                    skeletonHelper.material.lineWidth = 10.0;
                    skeletonHelper.material.depthWrite = true;
                    skeletonHelper.material.transparent = false;
                    skeletonHelper.material.flatShading = true;

                    var boneContainer = new THREE.Group();
                    boneContainer.add( result.skeleton.bones[ 0 ] );
    
                    self.el.setObject3D('skeletonHelper', skeletonHelper);
                    self.el.setObject3D('mesh', boneContainer);
                    //scene.add( skeletonHelper );
                   // scene.add( boneContainer );
    
                    // play animation
                    self.mixer = new THREE.AnimationMixer( skeletonHelper );
                    self.mixer.clipAction( result.clip ).setEffectiveWeight( 1.0 ).play();
    
                } );

            },
            /**
             * Update the ShaderMaterial when component data changes.
             */
            update: function () {
        
            },
        
          
       
            tick: function (t) {
                                var delta = this.clock.getDelta();
                
                                if ( this.mixer ) this.mixer.update( delta );
            }
        })