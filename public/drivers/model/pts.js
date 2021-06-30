/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & PtsJS model driver

import { Fabric } from '/core/vwf/fabric.js';

class PTSModel extends Fabric {

    constructor(module) {

        console.log("PTSModel constructor");
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
                    
                    var self = this;
        
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
                                "prototypes": undefined
                            };
                        },
                        isNodeComponent: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] === "proxy/pts/node.vwf");
                                }
                            }
                            return found;
                        },
                        isClass: function (prototypes, classID) {
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length; i++) {
                                    if (prototypes[i] === classID) {
                                        //console.info( "prototypes[ i ]: " + prototypes[ i ] );
                                        return true;
                                    }
                                }
                            }
                            return false;
                        },
                        isPTDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/pts/pt.vwf");
                                }
                            }
                            return found;
                        },
                        
                        createObject: function (node, config) {

                            var protos = node.prototypes;
                            var obj = undefined;
    
                            if (this.isClass(protos, "proxy/pts/scene.vwf")) {

                                let el = document.createElement("space");
                                el.setAttribute("id", "space");
                                el.style.height = "600px";
                                el.style.width = "800px";
                                document.querySelector("body").appendChild(el);
                                Pts.namespace( window );
                                obj = new CanvasSpace("#space").setup(
                                    { bgcolor: "#99eeff", retina: true, resize: false });
                               
                                obj.nodeName = "space";  
                                obj.nodeID = node.ID; 
                                this.scenes[node.ID] = node;
                                node.form = obj.getForm();
                                
                            }

                            // if (this.isClass(protos, "proxy/pts/player.vwf")) {
                            //     toneObj = new Tone.PolySynth(Tone.MembraneSynth);

                            // }

                            if(this.isPTDefinition(protos)) {
                                obj = new Pt(2);
                                obj.nodeName = "pt";  
                                obj.nodeID = node.ID; 
                                
                            }

                            return obj
                            },
                            addNodeToHierarchy: function (node) {

                                if (node.obj) {
                                    
                                    if (node.obj.nodeName !== "space") {
                                        node.scene = this.scenes[self.kernel.application()];
                                    }
        
                                }
        
                            }
                    };
        
                    this.state.kernel = this.kernel.kernel.kernel;
        
                    //this.Tone = Tone;
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
        
                    if (this.state.isNodeComponent(protos)) {
        
                        // Create the local copy of the node properties
                        if (this.state.nodes[childID] === undefined) {
                            this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childIndex, childName, callback);
                        }
        
                        node = this.state.nodes[childID];
                        node.prototypes = protos;
        
                        node.obj = this.state.createObject(node);
                        this.state.addNodeToHierarchy(node);

                        //let aframeDriver = vwf.views["/drivers/view/aframe"];
                      
                        
                        //notifyDriverOfPrototypeAndBehaviorProps();
                    }
                },
        
                 // -- initializingNode -------------------------------------------------------------------------
        
                //   initializingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                //     childSource, childType, childIndex, childName ) {
        
                // },
        
                // -- deletingNode -------------------------------------------------------------------------
        
                deletingNode: function( nodeID ) {

                    if (nodeID) {
                        var childNode = this.state.nodes[nodeID];
                        if (!childNode) return;
    
    
                        if (childNode !== undefined) {
    
                            if (childNode.children) {
    
                                for (var i = 0; i < childNode.children.length; i++) {
                                    this.deletingNode(childNode.children[i]);
                                }
                            }
    
                            if (childNode.obj !== undefined) {
                                // removes and destroys object

                                let space = childNode.scene.obj;
                                let player = Object.values(space.players).filter(el=> el.myID == nodeID)[0];
                                space.remove(player.animateID);
                                childNode.obj = undefined;
                            }
    
                            delete this.state.nodes[nodeID];
                        }
    
                    }


                },
        
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
        
                    let self = this;
                    let node = this.state.nodes[nodeID];
                    var value = undefined;

                    if (node && node.obj && _self_.utility.validObject(propertyValue)) {

                        let object = node.obj;

                        // if (self.state.isComponentNodeDefinition(node.prototypes)) {


                        //     value = propertyValue;
                        //     switch (propertyName) {

                        //         default:
                        //             value = undefined;
                        //             break;
                        //     }

                        // }


                        if (value === undefined && self.state.isPTDefinition(node.prototypes)) {
                            
                            value = propertyValue;

                            switch (propertyName) {


                                case "x":

                                    object.x = propertyValue

                                    break;

                                case "y":
                                        object.y = propertyValue

    
                                        break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }
                    }
        
                     return value;
        
                },
        
                // -- gettingProperty ----------------------------------------------------------------------
        
                gettingProperty: function( nodeID, propertyName, propertyValue ) {
        
                    let self = this;
                    let node = this.state.nodes[nodeID];
                    let value = undefined;
                    if (node && node.obj) {

                        let object = node.obj;

                        // if (self.state.isComponentNodeDefinition(node.prototypes)) {
                        //     switch (propertyName) {
                        //     }
                        // }

                        if (value === undefined && self.state.isPTDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "x":
                                    value = object.x
                                    break;

                                case "y":
                                        value = object.y
                                        break;
                            }
                        }

        
                    }

                     if ( value !== undefined ) {
                        propertyValue = value;
                    }
        
                    return value;
        
                     
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
        PTSModel as default
      }
    