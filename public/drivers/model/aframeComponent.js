/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & A-Frame components model driver

import { Fabric } from '/core/vwf/fabric.js';

class AFrameComponentModel extends Fabric {

    constructor(module) {
        console.log("AFrameComponentModel constructor");
        super(module, "Model");
    }

    factory() {
        let _self_ = this;

        return this.load(this.module,

            {

                // == Module Definition ====================================================================

                // -- pipeline -----------------------------------------------------------------------------

                // pipeline: [ log ], // vwf <=> log <=> scene

                // -- initialize ---------------------------------------------------------------------------

                initialize: function () {

                    let self = this;

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
                                "aframeObj": undefined,
                                "componentName": undefined

                            };
                        },

                        isComponentClass: function (prototypes, classID) {
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
                        isComponentNode: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] === "proxy/aframe/componentNode.vwf");
                                }
                            }
                            return found;
                        },

                        isAAnimMixerDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/anim-mixer-component.vwf");
                                }
                            }
                            return found;
                        },

                        isAInterpolationDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/interpolation-component.vwf");
                                }
                            }
                            return found;
                        },

                        isALinePathDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/linepath.vwf");
                                }
                            }
                            return found;
                        },

                        isAMaterialDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/aMaterialComponent.vwf");
                                }
                            }
                            return found;
                        },

                        isASoundDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/a-sound-component.vwf");
                                }
                            }
                            return found;
                        },


                        isAViewOffsetCameraDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/viewOffsetCamera-component.vwf");
                                }
                            }
                            return found;
                        },


                        isAGizmoDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/gizmoComponent.vwf");
                                }
                            }
                            return found;
                        },

                        isAFogDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/aSceneFogComponent.vwf");
                                }
                            }
                            return found;
                        },

                        isAShadowDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/shadowComponent.vwf");
                                }
                            }
                            return found;
                        },

                        isAAabbColliderDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/aabb-collider-component.vwf");
                                }
                            }
                            return found;
                        },

                        isAMirrorDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/a-mirror-component.vwf");
                                }
                            }
                            return found;
                        },


                        isARayCasterDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/raycasterComponent.vwf");
                                }
                            }
                            return found;
                        },

                        isARayCasterListenerDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/app-raycaster-listener-component.vwf");
                                }
                            }
                            return found;
                        },

                        isAAabbColliderListenerDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/app-aabb-collider-listener-component.vwf");
                                }
                            }
                            return found;
                        },

                        isALineDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/lineComponent.vwf");
                                }
                            }
                            return found;
                        },

                        isGearVRControlsDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/gearvr-controlsComponent.vwf");
                                }
                            }
                            return found;
                        },

                        isComponentNodeDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/componentNode.vwf");
                                }
                            }
                            return found;
                        },

                        isComponentDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/aframe/aentityComponent.vwf");
                                }
                            }
                            return found;
                        },

                        setAFrameObject: function (node, config) {
                            var protos = node.prototypes;
                            var aframeObj = {};
                            var sceneEl = document.querySelector('a-scene');

                            aframeObj.id = node.parentID;
                            // aframeObj.el = sceneEl.children[node.parentID];
                            aframeObj.el = Array.from(sceneEl.querySelectorAll('*')).filter(item => { return item.id == aframeObj.id })[0];


                            if (this.isComponentClass(protos, "proxy/aframe/lineComponent.vwf")) {
                                // aframeObj.id = node.parentID;
                                // aframeObj.el = sceneEl.children[node.parentID];

                                if (node.name !== 'line') {
                                    aframeObj.compName = node.name;
                                } else {
                                    aframeObj.compName = "line";
                                }
                                //aframeObj.el.setAttribute(node.type, {});
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/gizmoComponent.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "gizmo";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/aSceneFogComponent.vwf")) {

                                // aframeObj.el.setAttribute(node.type, {});

                                aframeObj = {};
                                //var sceneEl = document.querySelector('a-scene');

                                aframeObj.id = node.parentID;
                                aframeObj.el = document.querySelector('a-scene');

                                aframeObj.compName = "fog";
                                aframeObj.el.setAttribute('fog', {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/raycasterComponent.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "raycaster";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }



                            if (this.isComponentClass(protos, "proxy/aframe/shadowComponent.vwf")) {

                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "shadow";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/aabb-collider-component.vwf")) {

                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "aabb-collider";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/a-mirror-component.vwf")) {

                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "mirror";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/viewOffsetCamera-component.vwf")) {

                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "viewoffset";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/streamSoundComponent.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "streamsound";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/linepath.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "linepath";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/aMaterialComponent.vwf")) {

                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "material";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/a-sound-component.vwf")) {

                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "sound";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/interpolation-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "interpolation";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/anim-mixer-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "animation-mixer";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/app-envmap-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "envmap";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }


                            if (this.isComponentClass(protos, "proxy/aframe/app-avatarbvh-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "avatarbvh";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/app-sun-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "sun";
                                aframeObj.el.setAttribute('id', "sun");
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/app-skyshader-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "skyshader";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/app-raycaster-listener-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "raycaster-listener";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }

                            if (this.isComponentClass(protos, "proxy/aframe/app-aabb-collider-listener-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "aabb-collider-listener";
                                aframeObj.el.setAttribute(aframeObj.compName, {});
                                  
                            }

                            if (this.isComponentClass(protos, "proxy/aframe/app-cursor-listener-component.vwf")) {


                                // aframeObj.el.setAttribute(node.type, {});
                                aframeObj.compName = "cursor-listener";
                                aframeObj.el.setAttribute(aframeObj.compName, {});

                            }


                            return aframeObj;
                        },

                        addNodeToHierarchy: function (node) {

                            if (node.aframeObj) {
                                if (this.nodes[node.parentID] !== undefined) {
                                    var parent = this.nodes[node.parentID];
                                    if (parent.aframeObj) {

                                        if (parent.children === undefined) {
                                            parent.children = [];
                                        }
                                        parent.children.push(node.ID);

                                    }
                                }


                            }

                        }

                    };

                    this.state.kernel = this.kernel.kernel.kernel;

                    this.aframeComponentDef = {

                        'A-SOUND': [
                            "autoplay", "distanceModel", "loop", "maxDistance", "on", "poolSize", "refDistance",
                            "rolloffFactor", "src", "volume"
                        ],
                        'aabb-collider': [
                            "collideNonVisible", "debug", "enabled", "objects", "interval"
                        ],
                        'mirror': [
                            "camera", "renderothermirror"
                        ]

                    }


                    //this.state.kernel = this.kernel.kernel.kernel;

                },
                // == Model API ============================================================================

                // -- creatingNode -------------------------------------------------------------------------

                creatingNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                    childSource, childType, childIndex, childName, callback /* ( ready ) */) {

                    let self = this;
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

                    var protos = _self_.constructor.getPrototypes(this.kernel, childExtendsID);
                    //var kernel = this.kernel.kernel.kernel;
                    var node;

                    if (this.state.isComponentNode(protos)) {

                        // Create the local copy of the node properties
                        if (this.state.nodes[childID] === undefined) {
                            this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childIndex, childName, callback);
                        }

                        node = this.state.nodes[childID];
                        node.prototypes = protos;

                        //node.aframeObj = createAFrameObject(node);
                        node.aframeObj = this.state.setAFrameObject(node);
                        // addNodeToHierarchy(node);

                        //notifyDriverOfPrototypeAndBehaviorProps();
                    }
                },

                // -- initializingNode -------------------------------------------------------------------------

                //   initializingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                //     childSource, childType, childIndex, childName ) {

                // },

                // -- deletingNode -------------------------------------------------------------------------

                deletingNode: function (nodeID) {

                    if (this.state.nodes[nodeID] !== undefined) {

                        var node = this.state.nodes[nodeID];

                        if (node.aframeObj.compName !== undefined) {
                            // removes and destroys object
                            node.aframeObj.el.removeAttribute(node.aframeObj.compName);
                            node.aframeObj = undefined;
                        }

                        delete this.state.nodes[nodeID];
                    }

                },

                // -- initializingProperty -----------------------------------------------------------------

                initializingProperty: function (nodeID, propertyName, propertyValue) {

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

                settingProperty: function (nodeID, propertyName, propertyValue) {

                    let self = this;
                    var node = this.state.nodes[nodeID];
                    var value = undefined;

                    if (node && node.aframeObj && _self_.utility.validObject(propertyValue)) {

                        var aframeObject = node.aframeObj;

                        if (self.state.isComponentNodeDefinition(node.prototypes)) {


                            value = propertyValue;
                            switch (propertyName) {

                                default:
                                    value = undefined;
                                    break;
                            }

                        }


                        if (value === undefined && self.state.isComponentDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                case "compName":

                                    break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                        if (value === undefined && self.state.isAViewOffsetCameraDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;
                                // let defs = ['fullWidth', 'fullHeight', 'xoffset', 'yoffset'];

                                // defs.forEach(element => {
                                //     element == propertyName ? parentNodeAF.setAttribute('viewoffset', element, propertyValue) :
                                //         value = undefined;
                                // })

                                switch (propertyName) {

                                    case "fullWidth":
                                        parentNodeAF.setAttribute('viewoffset', 'fullWidth', propertyValue);
                                        break;

                                    case "fullHeight":
                                        parentNodeAF.setAttribute('viewoffset', 'fullHeight', propertyValue);
                                        break;

                                    case "yoffset":
                                        parentNodeAF.setAttribute('viewoffset', 'yoffset', propertyValue);
                                        break;

                                    case "xoffset":
                                        parentNodeAF.setAttribute('viewoffset', 'xoffset', propertyValue);
                                        break;


                                    case "subcamWidth":
                                        parentNodeAF.setAttribute('viewoffset', 'width', propertyValue);
                                        break;

                                    case "subcamHeight":
                                        parentNodeAF.setAttribute('viewoffset', 'height', propertyValue);
                                        break;

                                    default:
                                        value = undefined;
                                        break;
                                }


                            }
                        }


                        // if (value === undefined && isARayCasterListenerDefinition(node.prototypes)) {
                        //     if (aframeObject.el.getAttribute(aframeObject.compName)) {

                        //         value = propertyValue;
                        //         let parentNodeAF = aframeObject.el;


                        //         switch (propertyName) {

                        //             default:
                        //                 value = undefined;
                        //                 break;
                        //         }


                        //     }
                        // }


                        //aframeObj.el.setAttribute('data-aabb-collider-dynamic', "");
                        if (value === undefined && self.state.isAAabbColliderListenerDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;

                                if(propertyName == "dynamic"){
                                    if(propertyValue){
                                        parentNodeAF.setAttribute('data-aabb-collider-dynamic', "");
                                    } else {
                                        let attr = parentNodeAF.getAttribute('data-aabb-collider-dynamic');
                                        if(attr !== undefined)
                                            parentNodeAF.removeAttribute('data-aabb-collider-dynamic');
                                    }
                                }

                            }
                        }

                        if (value === undefined && self.state.isAShadowDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;


                                switch (propertyName) {

                                    case "cast":
                                        parentNodeAF.setAttribute('shadow', 'cast', propertyValue);
                                        break;

                                    case "receive":
                                        parentNodeAF.setAttribute('shadow', 'receive', propertyValue);
                                        break;

                                    default:
                                        value = undefined;
                                        break;
                                }


                            }
                        }


                        if (value === undefined && self.state.isAMaterialDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;
                                //let defs = ['color', 'transparent', 'opacity', 'side'];

                                let schema = Object.keys(AFRAME.components.material.schema).concat(Object.keys(AFRAME.shaders.standard.schema));
                                let el = schema.includes(propertyName);
                                if (el) {
                                    parentNodeAF.setAttribute('material', propertyName, propertyValue);
                                } else {
                                    value = undefined
                                }

                            }
                        }

                        if (value === undefined && self.state.isASoundDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;
                                //let defs = ['color', 'transparent', 'opacity', 'side'];

                                let el = self.aframeComponentDef['A-SOUND'].includes(propertyName);
                                if (el) {
                                    parentNodeAF.setAttribute('sound', propertyName, propertyValue);
                                } else {
                                    value = undefined
                                }

                                // self.aframeComponentDef['A-SOUND'].forEach(element => {
                                //     element == propertyName ? parentNodeAF.setAttribute('sound', element, propertyValue) :
                                //         value = undefined;
                                // })


                            }
                        }



                        if (value === undefined && self.state.isAMirrorDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;

                                let el = self.aframeComponentDef['mirror'].includes(propertyName);
                                if (el) {
                                    parentNodeAF.setAttribute('mirror', propertyName, propertyValue);
                                } else {
                                    value = undefined
                                }

                                // self.aframeComponentDef['mirror'].forEach(element => {
                                //     element == propertyName ? parentNodeAF.setAttribute('mirror', element, propertyValue) :
                                //         value = undefined;
                                // })
                            }
                        }

                        if (value === undefined && self.state.isAAabbColliderDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;
                                //let defs = ['color', 'transparent', 'opacity', 'side'];

                                let el = self.aframeComponentDef['aabb-collider'].includes(propertyName);
                                if (el) {
                                    parentNodeAF.setAttribute('aabb-collider', propertyName, propertyValue);
                                } else {
                                    value = undefined
                                }

                                // self.aframeComponentDef['aabb-collider'].forEach(element => {
                                //     element == propertyName ? parentNodeAF.setAttribute('aabb-collider', element, propertyValue) :
                                //         value = undefined;
                                // })
                            }
                        }

                        if (value === undefined && self.state.isAFogDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;
                                let defs = ['fogType', 'fogColor', 'density', 'near', 'far'];

                                defs.forEach(element => {
                                    if (element == propertyName) {

                                        switch (element) {

                                            case 'fogType':
                                                parentNodeAF.setAttribute('fog', 'type', propertyValue);
                                                break;

                                            case 'fogColor':
                                                parentNodeAF.setAttribute('fog', 'color', propertyValue);
                                                break;

                                            default:
                                                value = parentNodeAF.setAttribute('fog', element, propertyValue);
                                                break;
                                        }



                                    } else {
                                        value = undefined
                                    }
                                    // element == propertyName ? parentNodeAF.setAttribute('fog', element, propertyValue) :
                                    //     value = undefined;
                                })
                            }
                        }

                        if (value === undefined && self.state.isARayCasterDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;
                                let parentNodeAF = aframeObject.el;
                                let defs = ['direction', 'far', 'interval', 'near', 'objects', 'origin', 'recursive', 'showLine', 'useWorldCoordinates'];

                                let el = defs.includes(propertyName);
                                if (el) {
                                    parentNodeAF.setAttribute('raycaster', propertyName, propertyValue);
                                } else {
                                    value = undefined
                                }


                                // defs.forEach(element => {
                                //     element == propertyName ? parentNodeAF.setAttribute('raycaster', element, propertyValue) :
                                //         value = undefined;
                                // })


                            }
                        }

                        if (value === undefined && self.state.isALinePathDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;


                                let parentNodeAF = aframeObject.el;

                                switch (propertyName) {

                                    case "color":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'color', propertyValue);
                                        break;

                                    case "path":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'path', propertyValue);
                                        break;

                                    case "width":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'width', propertyValue);
                                        break;

                                    case "taper":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'taper', propertyValue);
                                        break;

                                    case "transparent":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'transparent', propertyValue);
                                        break;

                                    case "opacity":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'opacity', propertyValue);
                                        break;

                                    default:
                                        value = undefined;
                                        break;


                                }

                            }
                        }

                        //isALineDefinition(node.prototypes)
                        //if (value === undefined && node.componentName == 'line') { //isALineDefinition( node.prototypes )
                        if (node.extendsID == "proxy/aframe/lineComponent.vwf") {
                            if (value === undefined && aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;

                                //let parentNodeAF = self.state.kernel.find(node.parentID);

                                // aframeObject.el.setAttribute('line', 'color')
                                let parentNodeAF = aframeObject.el;

                                switch (propertyName) {

                                    case "start":

                                        parentNodeAF.setAttribute(aframeObject.compName, { start: propertyValue });
                                        break;

                                    case "end":

                                        parentNodeAF.setAttribute(aframeObject.compName, { end: propertyValue });
                                        break;

                                    case "color":

                                        parentNodeAF.setAttribute(aframeObject.compName, 'color', propertyValue);
                                        break;

                                    case "opacity":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'opacity', propertyValue);
                                        break;

                                    case "visible":

                                        parentNodeAF.setAttribute(aframeObject.compName, 'visible', propertyValue);
                                        break;

                                    default:
                                        value = undefined;
                                        break;
                                }

                            }
                        }

                        if (value === undefined && self.state.isAAnimMixerDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {
                                value = propertyValue;


                                let parentNodeAF = aframeObject.el;

                                switch (propertyName) {

                                    case "clip":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'clip', propertyValue);
                                        break;

                                    case "duration":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'duration', propertyValue);
                                        break;

                                    case "crossFadeDuration":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'crossFadeDuration', propertyValue);
                                        break;

                                    case "loop":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'loop', propertyValue);
                                        break;

                                    case "repetitions":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'repetitions', propertyValue);
                                        break;

                                    default:
                                        value = undefined;
                                        break;


                                }

                            }
                        }

                        if (value === undefined && self.state.isAInterpolationDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;


                                let parentNodeAF = aframeObject.el;

                                switch (propertyName) {

                                    case "enabled":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'enabled', propertyValue);
                                        break;

                                    case "deltaPos":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'deltaPos', propertyValue);
                                        break;

                                    case "deltaRot":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'deltaRot', propertyValue);
                                        break;

                                    case "deltaScale":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'deltaScale', propertyValue);
                                        break;

                                    default:
                                        value = undefined;
                                        break;


                                }

                            }
                        }

                        if (value === undefined && self.state.isAGizmoDefinition(node.prototypes)) {
                            if (aframeObject.el.getAttribute(aframeObject.compName)) {

                                value = propertyValue;


                                let parentNodeAF = aframeObject.el;

                                switch (propertyName) {

                                    case "mode":
                                        parentNodeAF.setAttribute(aframeObject.compName, 'mode', propertyValue);
                                        break;

                                    default:
                                        value = undefined;
                                        break;


                                }

                            }
                        }





                    }

                    return value;

                },
                // -- callingMethod ------------------------------------------------------------------------

            callingMethod: function (nodeID, methodName, methodParameters) {

                let self = this;
                var node = this.state.nodes[nodeID];

                if (!node) return;

                if (node && node.aframeObj) {
                    let aframeObject = node.aframeObj;
                    let parentNodeAF = aframeObject.el;

                    if(methodName == "getIntersectedElement") {

                        let comp = parentNodeAF.components['raycaster'];
                        if (comp.intersectedEls.length>0){
                            //console.log(comp.intersectedEls);
                        
                        let intersecedObjID = comp.intersectedEls[0].id
                        return intersecedObjID
                        }
                        return undefined
                    }

                    if(methodName == "getIntersectionPoint") {
                        //let nodes = vwf.models["/drivers/model/aframe"].model.state.nodes;
                        let comp = parentNodeAF.components['raycaster'];
                        let objID = methodParameters[0];
                        if (comp.intersectedEls.length>0){
                            //console.log(comp.intersectedEls);
                        
                        let intersecedObj = comp.intersectedEls[0]; //objID ? nodes[objID] : nodes[comp.intersectedEls[0].id];
                        //comp.checkIntersections();
                        let intersection = comp.getIntersection(intersecedObj);
                        if(intersection)
                            return {id: intersecedObj.id, point: intersection.point}

                        }
                        return undefined

                    }
                }
            },


                // -- gettingProperty ----------------------------------------------------------------------

                gettingProperty: function (nodeID, propertyName, propertyValue) {

                    let self = this;
                    var node = this.state.nodes[nodeID];
                    var value = undefined;
                    if (node && node.aframeObj) {

                        var aframeObject = node.aframeObj;

                        if (self.state.isComponentNodeDefinition(node.prototypes)) {
                            switch (propertyName) {
                            }
                        }

                        if (value === undefined && self.state.isComponentDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "compName":

                                    break;
                            }
                        }

                        // isALineDefinition( node.prototypes ) aframeObject.compName == compName



                        if (value === undefined && self.state.isARayCasterDefinition(node.prototypes)) {
                            value = propertyValue;

                            let parentNodeAF = aframeObject.el;
                            let defs = ['direction', 'far', 'interval', 'near', 'objects', 'origin', 'recursive', 'showLine', 'useWorldCoordinates'];

                            let el = defs.includes(propertyName);
                            value = el ? parentNodeAF.getAttribute('raycaster')[propertyName] : undefined;

                            // defs.forEach(element => {
                            //     if (element == propertyName) {
                            //         let val = parentNodeAF.getAttribute('raycaster').element;
                            //         value = AFRAME.utils.coordinates.isCoordinates(val) ? AFRAME.utils.coordinates.stringify(val) : val
                            //     }
                            // })


                        }


                        // if (value === undefined && isARayCasterListenerDefinition(node.prototypes)) {

                        //         value = propertyValue;
                        //         let parentNodeAF = aframeObject.el;

                        //         switch (propertyName) {

                        //             default:
                        //                 value = undefined;
                        //                 break;
                        //         }
                        // }


                        if (value === undefined && self.state.isAFogDefinition(node.prototypes)) {
                            value = propertyValue;

                            let parentNodeAF = aframeObject.el;
                            let defs = ['fogType', 'color', 'density', 'near', 'far'];

                            defs.forEach(element => {
                                if (element == propertyName) {


                                    switch (element) {

                                        case 'fogType':

                                            value = parentNodeAF.getAttribute('fog').type;
                                            break;

                                        case 'fogColor':

                                            value = parentNodeAF.getAttribute('fog').color;
                                            break;

                                        default:
                                            value = parentNodeAF.getAttribute('fog').element;
                                            break;

                                    }

                                }
                            })
                        }

                        if (value === undefined && self.state.isAAabbColliderListenerDefinition(node.prototypes)) {

                                let parentNodeAF = aframeObject.el;

                                if(propertyName == "dynamic"){
                                    let attr = parentNodeAF.getAttribute('data-aabb-collider-dynamic');
                                    value = attr ? true : false
                                }
                        }


                        if (value === undefined && self.state.isAShadowDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            switch (propertyName) {

                                case "cast":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).cast;
                                    break;

                                case "receive":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).receive;
                                    break;


                            }
                        }


                        if (value === undefined && self.state.isALineDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            switch (propertyName) {

                                case "start":

                                    value = AFRAME.utils.coordinates.stringify(parentNodeAF.getAttribute(aframeObject.compName).start);
                                    break;

                                case "end":
                                    value = AFRAME.utils.coordinates.stringify(parentNodeAF.getAttribute(aframeObject.compName).end);
                                    break;

                                case "color":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).color;
                                    break;

                                case "opacity":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).opacity;
                                    break;

                                case "visible":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).visible;
                                    break;

                            }
                        }


                        if (value === undefined && self.state.isAAnimMixerDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            switch (propertyName) {

                                case "clip":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).clip;
                                    break;

                                case "duration":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).duration;
                                    break;

                                case "crossFadeDuration":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).crossFadeDuration;
                                    break;

                                case "loop":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).loop;
                                    break;

                                case "repetitions":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).repetitions;
                                    break;

                            }

                        }

                        //A-Frame material
                        if (value === undefined && self.state.isAMaterialDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            let schema = Object.keys(AFRAME.components.material.schema).concat(Object.keys(AFRAME.shaders.standard.schema));
                            let el = schema.includes(propertyName);
                            value = el ? parentNodeAF.getAttribute('material')[propertyName] : undefined;


                            switch (propertyName) {
                                case "src":
                                    value = value !== "" ? ('#' + value.getAttribute('id')) : value;
                                    break;

                            }

                        }

                        if (value === undefined && self.state.isASoundDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            let el = self.aframeComponentDef['A-SOUND'].includes(propertyName);
                            value = el ? parentNodeAF.getAttribute('sound')[propertyName] : undefined;

                            // self.aframeComponentDef['A-SOUND'].forEach(element => {
                            //     if (element == propertyName) {
                            //         value = parentNodeAF.getAttribute('sound').element;
                            //     }

                            // })
                        }

                        if (value === undefined && self.state.isAMirrorDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            let el = self.aframeComponentDef['mirror'].includes(propertyName);
                            value = el ? parentNodeAF.getAttribute('mirror')[propertyName] : undefined;

                            // self.aframeComponentDef['mirror'].forEach(element => {
                            //     if (element == propertyName) {
                            //         value = parentNodeAF.getAttribute('mirror').element;
                            //     }

                            // })
                        }

                        if (value === undefined && self.state.isAAabbColliderDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            let el = self.aframeComponentDef['aabb-collider'].includes(propertyName);
                            value = el ? parentNodeAF.getAttribute('aabb-collider')[propertyName] : undefined;

                            // self.aframeComponentDef['aabb-collider'].forEach(element => {
                            //     if (element == propertyName) {
                            //         value = parentNodeAF.getAttribute('aabb-collider').element;
                            //     }

                            // })
                        }

                        if (value === undefined && self.state.isALinePathDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            switch (propertyName) {

                                case "color":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).color;
                                    break;

                                case "path":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).path;
                                    break;

                                case "width":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).width;
                                    break;

                                case "taper":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).taper;
                                    break;

                                case "transparent":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).transparent;
                                    break;

                                case "opacity":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).opacity;
                                    break;


                            }

                        }

                        if (value === undefined && self.state.isAViewOffsetCameraDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            switch (propertyName) {

                                case "fullWidth":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).fullWidth;
                                    break;

                                case "fullHeight":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).fullHeight;
                                    break;

                                case "subcamWidth":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).width;
                                    break;

                                case "subcamHeight":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).height;
                                    break;

                                case "xoffset":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).xoffset;
                                    break;

                                case "yoffset":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).yoffset;
                                    break;
                            }

                        }

                        if (value === undefined && self.state.isAInterpolationDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            switch (propertyName) {

                                case "enabled":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).enabled;
                                    break;

                                case "deltaPos":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).deltaPos;
                                    break;

                                case "deltaRot":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).deltaRot;
                                    break;

                                case "deltaScale":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).deltaScale;
                                    break;

                            }

                        }

                        if (value === undefined && self.state.isAGizmoDefinition(node.prototypes)) {
                            value = propertyValue;

                            // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                            let parentNodeAF = aframeObject.el;

                            switch (propertyName) {

                                case "mode":
                                    value = parentNodeAF.getAttribute(aframeObject.compName).mode;
                                    break;



                            }

                        }


                    }

                    if (value !== undefined) {
                        propertyValue = value;
                    }

                    return value;


                }

            });

    }

}

export {
    AFrameComponentModel as default
}


