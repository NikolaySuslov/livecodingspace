/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & Ohm model driver

import { Fabric } from '/core/vwf/fabric.js';

import {skipjs} from "/drivers/model/rubik/lib/skip.js"
import {Queue} from "/drivers/model/rubik/lib/queues.js"
import {Color} from "/drivers/model/rubik/lib/colors.js"
import {Twist} from "/drivers/model/rubik/lib/twists.js"
import {Direction} from "/drivers/model/rubik/lib/directions.js"
import {Fold} from "/drivers/model/rubik/lib/folds.js"
import {Cubelet} from "/drivers/model/rubik/lib/cubelets.js"
import {Group} from "/drivers/model/rubik/lib/groups.js"
import {Slice} from "/drivers/model/rubik/lib/slices.js"
import {Cube} from "/drivers/model/rubik/lib/cubes.js"

class RubikModel extends Fabric {

    constructor(module) {

        console.log("RUBIK model constructor");
        super(module, "Model");
    }

    factory() {
        let _self_ = this;

        return this.load( this.module, 
            {

                // == Module Definition ====================================================================
        
                // -- pipeline -----------------------------------------------------------------------------
        
                // pipeline: [ log ], // vwf <=> log <=> scene
        
                // -- initialize ---------------------------------------------------------------------------
        
                initialize: function() {
                    
                    let self = this;

              
                skipjs();
                globalThis.Queue = Queue;
                globalThis.Color = Color;
                globalThis.Twist = Twist;
                globalThis.Direction = Direction;
                globalThis.Fold = Fold;
        
                globalThis.Cubelet = Cubelet;
                globalThis.Group = Group;
                globalThis.Slice = Slice;
        
                globalThis.Cube = Cube;
        
                if( globalThis.setupTasks )	{
                    globalThis.setupTasks.forEach( function( task ){ task() })
                }
                        
                    

        
                   this.state = {
                        nodes: {},
                        scenes: {},
                        prototypes: {},
                        createLocalNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                            childSource, childType, childIndex, childName, callback) {
                            return {
                                "parentID": nodeID,
                                "ID": childID,
                                "extendsID": childExtendsID,
                                "implementsIDs": childImplementsIDs,
                                "source": childSource,
                                "type": childType,
                                "name": childName,
                                "prototypes": undefined,
                            };
                        },
                        isCubeNodeComponent: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] === "cubeModel.vwf");
                                }
                            }
                            return found;
                        },
                        isCubeletNodeComponent: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] === "cubeletModel.vwf");
                                }
                            }
                            return found;
                        }
                
                        

                    };
        
                    this.state.kernel = this.kernel.kernel.kernel;
        
                    //this.state.kernel = this.kernel.kernel.kernel;
                    
                },
                // == Model API ============================================================================
        
                // -- creatingNode -------------------------------------------------------------------------
        
                creatingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                    childSource, childType, childIndex, childName, callback /* ( ready ) */ ) {
        
                    // If the parent nodeID is 0, this node is attached directly to the root and is therefore either 
                    // the scene or a prototype.  In either of those cases, save the uri of the new node
                    var childURI = (nodeID === 0 ? childIndex : undefined);
                    var appID = this.kernel.application();
        
                    // If the node being created is a prototype, construct it and add it to the array of prototypes,
                    // and then return
                    var prototypeID = _self_.utility.ifPrototypeGetId(appID, this.state.prototypes, nodeID, childID);
                    if (prototypeID !== undefined) {
        
                        this.state.prototypes[prototypeID] = {
                            parentID: nodeID,
                            ID: childID,
                            extendsID: childExtendsID,
                            implementsID: childImplementsIDs,
                            source: childSource,
                            type: childType,
                            name: childName
                        };
                        return;
                    }
        
                    var protos = _self_.getPrototypes(this.kernel, childExtendsID);
                    //var kernel = this.kernel.kernel.kernel;
                    var node;
        
                    if (this.state.isCubeNodeComponent(protos)) {
        
                        // Create the local copy of the node properties
                        if (this.state.nodes[childID] === undefined) {
                            this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childIndex, childName, callback);
                        }
        
                        node = this.state.nodes[childID];
                        node.prototypes = protos;
        
                        node.cube = new Cube(childName);
                        node.cube.nodeID = childID;
                        node.cube.kernel = this.state.kernel;
                        // let jsModel = vwf.models['/core/vwf/model/javascript'].model;
                        // let jsNode = jsModel.nodes[childID];
                        // jsNode.cubeModel = node.cube;

                        //node.aframeObj = createAFrameObject(node);
                        //addNodeToHierarchy(node);
                        //notifyDriverOfPrototypeAndBehaviorProps();
                    }

                    if (this.state.isCubeletNodeComponent(protos)) {
        
                        // Create the local copy of the node properties
                        if (this.state.nodes[childID] === undefined) {
                            this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childIndex, childName, callback);
                        }
        
                        node = this.state.nodes[childID];
                        node.prototypes = protos;
        

                    }
                },
        
                callingMethod: function( nodeID, methodName, methodParameters ) {
        
                    //let self = this;
                    let node = this.state.nodes[nodeID];

                    if (node && node.cube) {
    
                    // if (methodName == 'getCubeModel') {
                    //    return node.cube
                    // }

                    if(methodName == "inspect"){

                        node.cube.inspect();
                        console.log(node.cube);

                    }
                    
                    if (methodName == 'isCubeTweening') {
                        return node.cube.isTweening()
                     }

                    if (methodName == 'getCubeModelID') {
                        return node.cube.id
                     }

                    if (methodName == 'getCubelet') {

                        let cubelet = Object.assign({}, node.cube.cubelets[methodParameters[0]]);
                        cubelet.cube = node.cube.id;
                        return cubelet
                        
                    }

                    if(methodName == "setCubeletID"){

                        node.cube.cubelets[methodParameters[0]].nodeID = methodParameters[1];

                    }

                    if (methodName == 'progressQueue') {

                           if (node.cube.twistQueue.future.length > 0) {
                                node.cube.twist(node.cube.twistQueue.do());
                            } 

                    }

                    if (methodName == 'undo') {

                        //TODO:

                 }

                    if (methodName == 'twistAction') {
                        let key = methodParameters[0];

                        node.cube.twistQueue.add(key);

                            // while (node.cube.twistQueue.future.length > 0) {
                            //     node.cube.twist(node.cube.twistQueue.do());
                            // }

                    //node.cube.twist( node.cube.twistQueue.do() );     

                    }

                    if (methodName == 'getCubelets') {

                        var cubelets = [];
                        node.cube.cubelets.forEach(el=>{
                            let cubelet = {
                                id: el.id.toString(),
                                address: el.address,
                                addressX: el.addressX,
                                addressY: el.addressY,
                                addressZ: el.addressZ
                            }
                            cubelets.push(cubelet)
                        })
                        return cubelets
                     }

                }

                if(methodName == "cubeletsRemap"){

                    let cubeletID = methodParameters[0];
                    let cubeCallback = methodParameters[1]
                
                    node.cube.remap(cubeletID, cubeCallback)
                    

                }


                // if (this.state.isCubeletNodeComponent(node.prototypes)){

                   
                    
                //     // if (methodName == 'getFaces') {

                //     //     var faces = [];
                //     //     node.cube.cubelets.forEach(el=>{
                //     //         let cubelet = {
                //     //             id: el.id.toString(),
                //     //             address: el.address,
                //     //             addressX: el.addressX,
                //     //             addressY: el.addressY,
                //     //             addressZ: el.addressZ
                //     //         }
                //     //         cubelets.push(cubelet)
                //     //     })
                //     //     return cubelets
                //     // }
                     

                    
                // }
        
                },


                 // -- initializingNode -------------------------------------------------------------------------
        
                initializingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                childSource, childType, childIndex, childName ) {
                let node = this.state.nodes[childID];

                if ( node ) {
                    if (this.state.isCubeletNodeComponent(node.prototypes)) {
                            console.log("CUBElet INitializing...");
                            
                            let props = this.state.kernel.getProperties(childID);
                            let nodeCube = this.state.nodes[props.cubeNodeID];
                            nodeCube.cube.cubelets[childName].nodeID = childID;
                            
                            // nodeCube.cube.cubelets[childName].address = props.address;
                            // nodeCube.cube.cubelets[childName].cubeletID = props.cubeletID;
                    }

                    if (this.state.isCubeNodeComponent(node.prototypes)) {
                        console.log("CUBE INitializing...");
                        let props = this.state.kernel.getProperties(childID);
                        let history = props.twistQueueHistory;
                        // let action = history.join('');
                        // node.cube.twistQueue.add(action);
                        // node.cube.twist(node.cube.twistQueue.do(), true );
                        history.forEach(el=>{
                            node.cube.twistQueue.add(el);
                        })
                        
                        
                        if(history.length > 0){
                            while (node.cube.twistQueue.future.length > 0) {
                                node.cube.twist(node.cube.twistQueue.do(), true );
                            }
                            // node.cube.twistQueue.future.map(el=>{
                            //     node.cube.twist(node.cube.twistQueue.do(), true );
                            // })
                            
                        }
                        
                        //node.cube.map();
                }
                }
            },
        
                // -- deletingNode -------------------------------------------------------------------------
        
                //deletingNode: function( nodeID ) {
                //},
        
                 // -- initializingProperty -----------------------------------------------------------------
    
                initializingProperty: function( nodeID, propertyName, propertyValue ) {
        
                     var value = undefined;
                    var node = this.state.nodes[nodeID];
                    if (node !== undefined) {
                        value = this.settingProperty(nodeID, propertyName, propertyValue);
                    }
                    return value;
                
            },
        
                // -- creatingProperty ---------------------------------------------------------------------
        
                creatingProperty: function (nodeID, propertyName, propertyValue) {
                    return this.initializingProperty(nodeID, propertyName, propertyValue);
                },
        
        
                // -- settingProperty ----------------------------------------------------------------------
        
                settingProperty: function( nodeID, propertyName, propertyValue ) {
        
                    // let node = this.state.nodes[nodeID];
                    // var value = undefined;


                    // if (node) {
    
                    //     if (this.state.isCubeletNodeComponent(node.prototypes)) {

                    //        switch ( propertyName ) {
                         
                    //             case "cubeletID":
                    //                 node.nodeID = nodeID;
                    //                 value = propertyValue          
                    //                 break;
        
                    //             default:
                    //                 value = undefined;
                    //                 break;
                    //         }
                    //      }
                    //     }
        
                    //  return value;
        
                },
        
                // -- gettingProperty ----------------------------------------------------------------------
        
                gettingProperty: function( nodeID, propertyName, propertyValue ) {
        
                    // let node = this.state.nodes[nodeID];
                    // let value = undefined;
    
                    // if (node) {
    
                    //     if (this.state.isCubeNodeComponent(node.prototypes)) {

                    //        switch ( propertyName ) {
                         
                    //                case "cubeID":
                    //                            value = node.cube.id;
                    //                             break;

                    //         }
                    //      }
                    // }

        
                    //  if ( value !== undefined ) {
                    //     propertyValue = value;
                    // }
        
                    // return value;
        
                     
                }
        
            } );

        }


    getPrototypes(kernel, extendsID) {
        var prototypes = [];
        var id = extendsID;
    
        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }
        return prototypes;
    }
    

    }

    export {
        RubikModel as default
      }
    