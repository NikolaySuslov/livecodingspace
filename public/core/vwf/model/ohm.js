/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & Ohm model driver

import { Fabric } from '/core/vwf/fabric.js';

class OhmModel extends Fabric {

    constructor(module) {

        console.log("OhmModel constructor");
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
                                "prototypes": undefined,
                                "lang": {   
                                    "grammar": undefined,
                                    "semantics": undefined,
                                    "source": undefined
                                }
                            };
                        },
                        isOhmNodeComponent: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] === "proxy/ohm/node.vwf");
                                }
                            }
                            return found;
                        }
                    };
        
                    this.state.kernel = this.kernel.kernel.kernel;
        
                    this.ohm = ohm;
                    window._ohm = this.ohm;
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
        
                    if (this.state.isOhmNodeComponent(protos)) {
        
                        // Create the local copy of the node properties
                        if (this.state.nodes[childID] === undefined) {
                            this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childIndex, childName, callback);
                        }
        
                        node = this.state.nodes[childID];
                        node.prototypes = protos;
        
                        //node.aframeObj = createAFrameObject(node);
                        //addNodeToHierarchy(node);
                        //notifyDriverOfPrototypeAndBehaviorProps();
                    }
                },
        
                 // -- initializingNode -------------------------------------------------------------------------
        
                //   initializingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                //     childSource, childType, childIndex, childName ) {
        
                // },
        
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
        
                    var node = this.state.nodes[nodeID];
                    var value = undefined;
                    if (node && _self_.utility.validObject(propertyValue)) {
                           switch ( propertyName ) {
                         
                                case "ohmLang":
                                                node.lang.source = propertyValue;
                                                node.lang.grammar = ohm.grammar(propertyValue);
                                                node.lang.semantics = node.lang.grammar.createSemantics();
                                                break;
        
                                default:
                                    value = undefined;
                                    break;
                            }
                         }
        
                     return value;
        
                },
        
                // -- gettingProperty ----------------------------------------------------------------------
        
                gettingProperty: function( nodeID, propertyName, propertyValue ) {
        
                     var node = this.state.nodes[nodeID];
                    var value = undefined;
                    if (node) {
                           switch ( propertyName ) {
                         
                                   case "grammar":
                                               value = node.lang.grammar;
                                                break;
        
                                 case "semantics":
                                               value = node.lang.semantics;
                                                break;
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
        OhmModel as default
      }
    