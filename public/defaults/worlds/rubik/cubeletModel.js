this.initialize = function(){}
this.getCube = function(){

    return this.parent.parent

}

this.initCubeletFaces = function(){

    let cube = this.getCube();
    let cubeletModel = cube.getCubelet(this.cubeletID);

    //let cubeModel = cube.cubeModel;
    //let cubeletModel = cubeModel.cubelets[this.cubleteID];
    //cubeletModel.nodeID = this.id;

    let half = this.size / 2;

    //MISTAKE in UP/DOWN position (in original code)

    let faces = {
        "front":{
            "faceID": "0",
            "rotation": [0,0,0],
            "position": [0,0,half]
        },
        "up":{
            "faceID": "1",
            "rotation": [-90,0,0],
            "position": [0,half,0]
        },
        "right":{
            "faceID": "2",
            "rotation": [0,90,0],
            "position": [half,0,0]
        },
        "down":{
            "faceID": "3",
            "rotation": [90,0,0],
            "position": [0,-half,0]
        },
        "left":{
            "faceID": "4",
            "rotation": [0,-90,0],
            "position": [-half,0,0]
        },
        "back":{
            "faceID": "5",
            "rotation": [0,180,0],
            "position": [0,0,-half]
        }
    }

    Object.keys(faces).forEach(key=>{
        let data = faces[key];
        let face = //getFace(faces[key]);
        {
            "extends": "proxy/aframe/aplane.vwf",
            "properties": {
                "faceID": data.faceID,
                "rotation": data.rotation,
                "position": data.position
            },
            "children":{
                "label":{
                    "extends": "proxy/aframe/atext.vwf",
                    "properties": {
                        "displayName": key,
                        "color": "black",
                        "value": this.cubeletID,
                        "side": "double",
                        "position": [-0.3,0,0.01]
                    }
                },
                "material": {
                    "extends": "proxy/aframe/aMaterialComponent.vwf",
                    "type": "component",
                    "properties": {
                        "side": "double",
                        "color": cubeletModel.faces[data.faceID].color.hex
                    }
                }
            }
        }

        //let color = cubeletModel[key].color.hex;
        //face.children.material.properties.color = color;
        this.wrapper.children.create(key, face)
    })

    

}


// this.rotateCublet = function(data){

// //     this.rotateBy([0,0,90],0.5);
// // this.parent["1"].rotateBy([0,0,90],0.5);
// // this.parent["2"].rotateBy([0,0,90],0.5);
// // this.parent["3"].rotateBy([0,0,90],0.5);
// // this.parent["4"].rotateBy([0,0,90],0.5);

//     this.rotation = data;
//     let k = this.getMatrix().clone();
//     let t = this.wrapper.getMatrix().clone();
//     t.premultiply(k);
//     console.log(t);
//     let p = new THREE.Vector3();
//     let q = new THREE.Quaternion();
//     let s = new THREE.Vector3();
//     t.decompose( p, q, s );
//     let angle = (new THREE.Euler()).setFromQuaternion(q, 'XYZ');
//     let rotation = (new THREE.Vector3(THREE.Math.radToDeg(angle.x),
//                                 THREE.Math.radToDeg(angle.y), THREE.Math.radToDeg(angle.z)));
//     console.log(p, rotation, s);

//     this.wrapper.position = p;
//     this.wrapper.rotation = rotation;

//     this.rotation = [0,0,0];
    
//     }

    this.rotateCubelet = function(rotation, speed, cubeCallback) {

        if(cubeCallback){
            this.rotateBy(rotation, speed, 'cubeletOnStopRotation:[' + this.cubeletID + ',"' + cubeCallback +'"]')
        } else {
            this.rotateBy(rotation, speed, "cubeletOnStopRotation:[" + this.cubeletID + "]" )
        }
        
    }

    this.cubeletOnStopRotation = function(cubeletID, cubeCallback){

        let cube = this.getCube();
        cube.cubeletsRemap(cubeletID, cubeCallback);
        
        if(cubeCallback){
            if(cube.robotID && cube.withRobot){
                let robot = cube.getRobot();
                robot.rotateFace(cubeCallback);
            }
        }
        

    }

    // this.cubeletOnStopRotation = function(cubeletID, cubeCallback){
    //     debugger;
    //     let threshold = 0.001
    //     //  Here's some complexity.
	// 			//  We need to support partial rotations of arbitrary degrees
	// 			//  yet ensure our internal model is always in a valid state.
	// 			//  This means only remapping the Cubelet when it makes sense
	// 			//  and also remapping the Cube if this Cubelet is allowed to do so.
    //             let myCube = this.getCube();
    //             let cube = myCube.cubeModel;
    //             let cubelet = cube.cubelets[cubeletID];
                

	// 			var 
	// 			xRemaps = cubelet.x.divide( 90 ).round()
	// 				.subtract( cubelet.xPrevious.divide( 90 ).round() )
	// 				.absolute(),
	// 			yRemaps = cubelet.y.divide( 90 ).round()
	// 				.subtract( cubelet.yPrevious.divide( 90 ).round() )
	// 				.absolute(),
	// 			zRemaps = cubelet.z.divide( 90 ).round()
	// 				.subtract( cubelet.zPrevious.divide( 90 ).round() )
	// 				.absolute()

	// 			if( Cube.verbosity >= 0.9 ){

	// 				console.log( 'Cublet #'+ ( cubelet.id < 10 ? '0'+ cubelet.id : cubelet.id ), 
	// 					' |  xRemaps:', xRemaps, ' yRemaps:', yRemaps, ' zRemaps:', zRemaps,
	// 					' |  xPrev:', cubelet.xPrevious, ' x:', cubelet.x,
	// 					' |  yPrev:', cubelet.yPrevious, ' y:', cubelet.y,
	// 					' |  zPrev:', cubelet.zPrevious, ' z:', cubelet.z )
	// 			}


	// 			if( xRemaps ){
					
	// 				while( xRemaps -- ){

	// 					if( cubelet.x < cubelet.xPrevious ) cubelet.faces = [ cubelet.up, cubelet.back, cubelet.right, cubelet.front, cubelet.left, cubelet.down ]
	// 					else cubelet.faces = [ cubelet.down, cubelet.front, cubelet.right, cubelet.back, cubelet.left, cubelet.up ]
	// 					cubelet.map()
	// 					if( cubeCallback !== undefined ){

    //                         let swapMap = Cube.swapMaps[cubeCallback];
    //                         let swap = cubelet.cube.cubelets.slice();
    //                         swapMap.forEach(el=>{
    //                             cube.cubelets[el[0]] = swap[el[1]]
    //                         })
	// 						//cubeCallback( cubelet.cube.cubelets.slice())
	// 						cubelet.cube.map()
	// 					}
	// 				}
	// 				cubelet.xPrevious = cubelet.x
	// 			}
	// 			if( cubelet.x.modulo( 90 ).absolute() < threshold ){

	// 				cubelet.x = 0
	// 				cubelet.xPrevious = cubelet.x
	// 				cubelet.isEngagedX = false
	// 			}
				

	// 			if( yRemaps ){
					
	// 				while( yRemaps -- ){

	// 					if( cubelet.y < cubelet.yPrevious ) cubelet.faces = [ cubelet.left, cubelet.up, cubelet.front, cubelet.down, cubelet.back, cubelet.right ]
	// 					else cubelet.faces = [ cubelet.right, cubelet.up, cubelet.back, cubelet.down, cubelet.front, cubelet.left ]
	// 					cubelet.map()
	// 					if( cubeCallback !== undefined ){

    //                         let swapMap = Cube.swapMaps[cubeCallback];
    //                         let swap = cubelet.cube.cubelets.slice();
    //                         swapMap.forEach(el=>{
    //                             cube.cubelets[el[0]] = swap[el[1]]
    //                         })
	// 						//cubeCallback( cubelet.cube.cubelets.slice())
	// 						cubelet.cube.map()
	// 					}
	// 				}
	// 				cubelet.yPrevious = cubelet.y
	// 			}
	// 			if( cubelet.y.modulo( 90 ).absolute() < threshold ){

	// 				cubelet.y = 0
	// 				cubelet.yPrevious = cubelet.y
	// 				cubelet.isEngagedY = false
	// 			}


	// 			if( zRemaps ){
					
	// 				while( zRemaps -- ){

	// 					if( cubelet.z < cubelet.zPrevious ) cubelet.faces = [ cubelet.front, cubelet.right, cubelet.down, cubelet.left, cubelet.up, cubelet.back ]
	// 					else cubelet.faces = [ cubelet.front, cubelet.left, cubelet.up, cubelet.right, cubelet.down, cubelet.back ]
	// 					cubelet.map()
	// 					if( cubeCallback !== undefined ){
    //                 //debugger;
    //                         let swapMap = Cube.swapMaps[cubeCallback];
    //                         let swap = cubelet.cube.cubelets.slice();
    //                         swapMap.forEach(el=>{
    //                             cube.cubelets[el[0]] = swap[el[1]]
    //                         })
	// 						//cubeCallback( cubelet.cube.cubelets.slice())
	// 						cubelet.cube.map()
	// 					}
	// 				}
	// 				cubelet.zPrevious = cubelet.z
	// 			}
	// 			if( cubelet.z.modulo( 90 ).absolute() < threshold ){

	// 				cubelet.z = 0
	// 				cubelet.zPrevious = cubelet.z
	// 				cubelet.isEngagedZ = false
	// 			}


	// 			//  Phew! Now we can turn off the tweening flag.

	// 			cubelet.isTweening = false


    // }