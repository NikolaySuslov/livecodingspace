/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & A-Frame model driver

import { Fabric } from '/core/vwf/fabric.js';

class AFrameModel extends Fabric {

    constructor(module) {
        console.log("AFrame constructor");
        super(module, "Model");
    }

    factory() {
        let _self_ = this;

        return this.load(this.module, {

            // == Module Definition ====================================================================

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
                            "scene": undefined,
                            "componentName": undefined,
                            "events": {
                                "clickable": false
                            }
                        };
                    },
                    isAFrameClass: function (prototypes, classID) {
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
                    isAFrameComponent: function (prototypes) {
                        var found = false;
                        if (prototypes) {
                            for (var i = 0; i < prototypes.length && !found; i++) {
                                found = (prototypes[i] === "proxy/aframe/node.vwf");
                            }
                        }
                        return found;
                    },
                    isNodeDefinition: function (prototypes) {
                        var found = false;
                        if (prototypes) {
                            for (var i = 0; i < prototypes.length && !found; i++) {
                                found = (prototypes[i] == "proxy/aframe/node.vwf");
                            }
                        }
                        return found;
                    },

                    isAEntityDefinition: function (prototypes) {
                        var found = false;
                        if (prototypes) {
                            for (var i = 0; i < prototypes.length && !found; i++) {
                                found = (prototypes[i] == "proxy/aframe/aentity.vwf");
                            }
                        }
                        return found;
                    },

                    setAFrameProperty: function (propertyName, propertyValue, aframeObject) {
                        //console.log(propertyValue);
                        if (propertyValue.hasOwnProperty('x')) {
                            aframeObject.setAttribute(propertyName, propertyValue)
                        } else
                            if (Array.isArray(propertyValue)) {
                                aframeObject.setAttribute(propertyName, {
                                    x: propertyValue[0],
                                    y: propertyValue[1],
                                    z: propertyValue[2]
                                })
                            } else if (typeof propertyValue === 'string') {

                                propertyValue.includes(',') ? aframeObject.setAttribute(propertyName, AFRAME.utils.coordinates.parse(propertyValue.split(',').join(' '))) : aframeObject.setAttribute(propertyName, AFRAME.utils.coordinates.parse(propertyValue))

                                //aframeObject.setAttribute(propertyName, AFRAME.utils.coordinates.parse(propertyValue))
                            } else if (propertyValue.hasOwnProperty('0')) {
                                aframeObject.setAttribute(propertyName, {
                                    x: propertyValue[0],
                                    y: propertyValue[1],
                                    z: propertyValue[2]
                                })
                            }

                    },
                    setFromValue: function (propertyValue) {

                        var value = new THREE.Vector3(); //goog.vec.Vec3.create();
                        if (propertyValue.hasOwnProperty('x')) {
                            value = value.set(propertyValue.x, propertyValue.y, propertyValue.z)
                        } else if (Array.isArray(propertyValue) || propertyValue instanceof Float32Array) {
                            value = value.fromArray(propertyValue);
                        } else if (typeof propertyValue === 'string') {

                            let val = propertyValue.includes(',') ? AFRAME.utils.coordinates.parse(propertyValue.split(',').join(' ')) : AFRAME.utils.coordinates.parse(propertyValue);
                            value = value.set(val.x, val.y, val.z)

                            // let val = AFRAME.utils.coordinates.parse(propertyValue);
                            // value = goog.vec.Vec3.createFromValues(val.x, val.y, val.z)


                        } else if (propertyValue.hasOwnProperty('0')) {
                            value = value.set(propertyValue[0], propertyValue[1], propertyValue[2])
                        }

                        return value
                    },

                    updateStoredTransformFor: function (node, propertyName) {

                        if (node && node.aframeObj && node.aframeObj.object3D) {
                            // Add a local model-side transform that can stay pure even if the view changes the
                            // transform on the threeObject - this already happened in creatingNode for those nodes that
                            // didn't need to load a model
                            if (!node.transform)
                                node.transform = {};

                            if (propertyName == 'position') {
                                let pos = (new THREE.Vector3()).copy(node.aframeObj.object3D.position);
                                node.transform.position = new THREE.Vector3(pos.x, pos.y, pos.z);
                                node.transform.storedPositionDirty = false;
                            }

                            if (propertyName == 'rotation') {
                                // let rot = (new THREE.Vector3()).copy(node.aframeObj.object3D.rotation);
                                let rot = node.aframeObj.getAttribute('rotation');
                                node.transform.rotation = new THREE.Vector3(rot.x, rot.y, rot.z);
                                node.transform.storedRotationDirty = false;
                            }

                            if (propertyName == 'scale') {
                                let scale = (new THREE.Vector3()).copy(node.aframeObj.object3D.scale);
                                node.transform.scale = new THREE.Vector3(scale.x, scale.y, scale.z);
                                node.transform.storedScaleDirty = false;
                            }

                            //node.transform.position = AFRAME.utils.coordinates.stringify(node.aframeObj.object3D.position);

                            // node.transform.rotation = AFRAME.utils.coordinates.stringify(node.aframeObj.object3D.rotation);
                            // node.storedTransformDirty = false;             
                        }

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
                                    //console.info( "Adding child: " + childID + " to " + nodeID );
                                    if (node.aframeObj.nodeName !== "A-ASSET-ITEM" &&
                                        node.aframeObj.nodeName !== "IMG" &&
                                        node.aframeObj.nodeName !== "AUDIO" &&
                                        node.aframeObj.nodeName !== "VIDEO"
                                    ) {
                                        parent.aframeObj.appendChild(node.aframeObj);
                                    }
                                }
                            }
                            if (node.aframeObj.nodeName !== "A-SCENE") {
                                node.scene = this.scenes[self.kernel.application()];
                            }

                        }

                    },

                    createAFrameObject: function (node, config) {

                        var protos = node.prototypes;
                        var aframeObj = undefined;

                        if (this.isAFrameClass(protos, "proxy/aframe/ascene.vwf")) {
                            aframeObj = document.createElement('a-scene');
                            let assetsElement = document.createElement('a-assets');
                            aframeObj.appendChild(assetsElement);
                            aframeObj.setAttribute('scene-utils', "");
                            aframeObj.setAttribute('light', 'defaultLightsEnabled', false);
                            //aframeObj.setAttribute('embedded', {});
                            //aframeObj.setAttribute('loading-screen', "backgroundColor: black");
                            this.scenes[node.ID] = aframeObj;
                            //TODO: move from veiw here
                            //document.body.appendChild(aframeObj);

                        }

                        if (this.isAFrameClass(protos, "proxy/aframe/a-asset-item.vwf")) {

                            let assets = document.querySelector('a-assets');
                            if (assets) {

                                aframeObj = document.createElement('a-asset-item');
                                aframeObj.setAttribute('id', "item-" + _self_.helpers.GUID());
                                aframeObj.setAttribute('src', "");
                                aframeObj.setAttribute('crossorigin', "anonymous");
                                assets.appendChild(aframeObj);
                            }

                        } else if (this.isAFrameClass(protos, "proxy/aframe/a-asset-image-item.vwf")) {

                            let assets = document.querySelector('a-assets');
                            if (assets) {
                                let elID = "item-" + _self_.helpers.GUID();
                                aframeObj = document.createElement('img');
                                aframeObj.setAttribute('id', elID);
                                aframeObj.setAttribute('src', "");
                                aframeObj.setAttribute('crossorigin', "anonymous");
                                assets.appendChild(aframeObj);
                            }

                        } else if (this.isAFrameClass(protos, "proxy/aframe/a-asset-audio-item.vwf")) {

                            let assets = document.querySelector('a-assets');
                            if (assets) {

                                aframeObj = document.createElement('audio');
                                aframeObj.setAttribute('id', "item-" + _self_.helpers.GUID());
                                aframeObj.setAttribute('src', "");
                                //aframeObj.setAttribute('response-type', "arraybuffer");
                                aframeObj.setAttribute('crossorigin', "anonymous");
                                assets.appendChild(aframeObj);
                            }


                        } else if (this.isAFrameClass(protos, "proxy/aframe/a-asset-video-item.vwf")) {

                            let assets = document.querySelector('a-assets');
                            if (assets) {

                                aframeObj = document.createElement('video');
                                aframeObj.setAttribute('id', "item-" + _self_.helpers.GUID());
                                aframeObj.setAttribute('src', "");
                                aframeObj.setAttribute('crossorigin', "anonymous");
                                aframeObj.setAttribute('autoplay', "");
                                aframeObj.setAttribute('loop', true);

                                assets.appendChild(aframeObj);
                            }


                        }
                        else if (this.isAFrameClass(protos, "proxy/aframe/asky.vwf")) {
                            aframeObj = document.createElement('a-sky');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/a-arjs-anchor.vwf")) {
                            aframeObj = document.createElement('a-anchor');

                        } else if (this.isAFrameClass(protos, "proxy/aframe/alight.vwf")) {
                            aframeObj = document.createElement('a-light');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/acursor.vwf")) {
                            aframeObj = document.createElement('a-cursor');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/a-sun-sky.vwf")) {
                            aframeObj = document.createElement('a-sun-sky');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/abox.vwf")) {
                            aframeObj = document.createElement('a-box');
                            aframeObj.setAttribute('geometry', {
                                primitive: 'box'
                            });
                        } else if (this.isAFrameClass(protos, "proxy/aframe/asphere.vwf")) {
                            aframeObj = document.createElement('a-sphere');
                            aframeObj.setAttribute('geometry', {
                                primitive: 'sphere'
                            });
                        } else if (this.isAFrameClass(protos, "proxy/aframe/aplane.vwf")) {
                            aframeObj = document.createElement('a-plane');
                            aframeObj.setAttribute('geometry', {
                                primitive: 'plane'
                            });
                        } else if (this.isAFrameClass(protos, "proxy/aframe/acylinder.vwf")) {
                            aframeObj = document.createElement('a-cylinder');
                            aframeObj.setAttribute('geometry', {
                                primitive: 'cylinder'
                            });
                        } else if (this.isAFrameClass(protos, "proxy/aframe/acone.vwf")) {
                            aframeObj = document.createElement('a-cone');
                            aframeObj.setAttribute('geometry', {
                                primitive: 'cone'
                            });
                        }
                        else if (this.isAFrameClass(protos, "proxy/aframe/atext.vwf")) {
                            aframeObj = document.createElement('a-text');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/acolladamodel.vwf")) {
                            aframeObj = document.createElement('a-collada-model');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/aobjmodel.vwf")) {
                            aframeObj = document.createElement('a-obj-model');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/agltfmodel.vwf")) {
                            aframeObj = document.createElement('a-gltf-model');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/aanimation.vwf")) {
                            aframeObj = document.createElement('a-animation');
                        } else if (this.isAFrameClass(protos, "proxy/aframe/acamera.vwf")) {
                            aframeObj = document.createElement('a-camera');
                            aframeObj.setAttribute('camera', 'active', false);
                        }

                        else if (this.isAFrameClass(protos, "proxy/aframe/aentity.vwf")) {
                            aframeObj = document.createElement('a-entity');
                        }

                        if (aframeObj.nodeName !== "A-ASSET-ITEM" &&
                            aframeObj.nodeName !== "IMG" &&
                            aframeObj.nodeName !== "AUDIO" &&
                            aframeObj.nodeName !== "VIDEO"
                        ) {
                            aframeObj.setAttribute('id', node.ID);
                        }


                        return aframeObj;
                    }
                };

                this.state.kernel = this.kernel.kernel.kernel;

                this.aframePrimitives = ["a-box", "a-circle", "a-cone", "a-cylinder", "a-dodecahedron", "a-icosahedron", "a-octahedron", "a-plane", "a-ring", "a-sphere", "a-tetrahedron", "a-torus", "a-torus-knot", "a-triangle", "a-text",
                    "a-light", "a-sky"] //Object.keys(AFRAME.primitives.primitives);

            },

            // == Model API ============================================================================

            // -- creatingNode -------------------------------------------------------------------------

            creatingNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                childSource, childType, childIndex, childName, callback /* ( ready ) */) {

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

                if (this.state.isAFrameComponent(protos)) {

                    // Create the local copy of the node properties
                    if (this.state.nodes[childID] === undefined) {
                        this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                            childSource, childType, childIndex, childName, callback);
                    }

                    node = this.state.nodes[childID];
                    node.prototypes = protos;

                    // if (childType == "component") {
                    //     if (nodeID !== undefined) {
                    //         node.aframeObj =  setAFrameObjectComponents(node);
                    //         addNodeToHierarchy(node);
                    //     }
                    // } else {

                    node.aframeObj = this.state.createAFrameObject(node);
                    this.state.addNodeToHierarchy(node);

                    if (this.state.isAEntityDefinition(node.prototypes)) {
                        //updateStoredTransform( node );
                        this.state.updateStoredTransformFor(node, 'position');
                        this.state.updateStoredTransformFor(node, 'rotation');
                        this.state.updateStoredTransformFor(node, 'scale');
                    }

                    //notifyDriverOfPrototypeAndBehaviorProps();
                    //  }

                    //addNodeToHierarchy(node);
                }



            },

            // initializingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
            //     childSource, childType, childIndex, childName ) {
            //     var node = this.state.nodes[childID];


            //     if ( node && childType == "component" ) {

            //     }
            // },

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


            // -- callingMethod ------------------------------------------------------------------------

            callingMethod: function (nodeID, methodName, methodParameters) {

                let self = this;
                var node = this.state.nodes[nodeID];

                if (!node) return;

                if (node && node.aframeObj) {

                    if (methodName == 'lookAt') {
                        console.log('lookAt: ' + methodParameters[0]);
                        let target = methodParameters[0];
                        node.aframeObj.object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z));
                        let newRotation = node.aframeObj.getAttribute('rotation');
                        self.kernel.setProperty(nodeID, "rotation", {
                            x: 0,
                            y: newRotation.y,
                            z: 0
                        });
                    }

                    if (methodName == 'worldRotation') {

                        var worldQuat = new THREE.Quaternion();
                        node.aframeObj.object3D.getWorldQuaternion(worldQuat);

                        let angle = (new THREE.Euler()).setFromQuaternion(worldQuat, 'XYZ');
                        let rotation = (new THREE.Vector3(THREE.Math.radToDeg(angle.x),
                            THREE.Math.radToDeg(angle.y), THREE.Math.radToDeg(angle.z)));
                        return rotation

                    }

                    if (methodName == 'worldPosition') {

                        var position = new THREE.Vector3();

                        node.aframeObj.object3D.getWorldPosition(position);
                        return position

                    }

                    if (methodName == 'boundingBox') {

                        let bbox = new THREE.Box3().setFromObject(node.aframeObj.object3D);
                        return bbox;
                    }

                    if (methodName == 'localQuaternion') {
                        return node.aframeObj.object3D.quaternion.clone()
                    }

                    if (methodName == 'worldQuaternion') {

                        let worldQuaternion = new THREE.Quaternion();
                        node.aframeObj.object3D.getWorldQuaternion(worldQuaternion);
                        return worldQuaternion
                    }

                    if (methodName == 'worldScale') {

                        let worldScale = new THREE.Vector3();
                        node.aframeObj.object3D.getWorldScale(worldScale);
                        return worldScale

                    }

                    if (methodName == 'worldDirection') {

                        let worldDirection = new THREE.Vector3();
                        node.aframeObj.object3D.getWorldDirection(worldDirection);
                        return worldDirection

                    }

                    if (methodName == 'localToWorld') {

                        let target = this.state.setFromValue(methodParameters[0] || []);
                        let worldPoint = node.aframeObj.object3D.localToWorld(target);
                        return worldPoint

                    }

                    if (methodName == 'worldToLocal') {
                        let target = this.state.setFromValue(methodParameters[0] || []);
                        let localPoint = node.aframeObj.object3D.worldToLocal(target);
                        return localPoint

                    }
                    if (methodName == 'applyMatrix') {
                        let fromNode = this.state.nodes[methodParameters[0]];
                        let matrix = fromNode.aframeObj.object3D.matrix;
                        node.aframeObj.object3D.applyMatrix(matrix);
                    }

                    if (methodName == 'getMatrix') {
                        node.aframeObj.object3D.updateMatrix( true );
                        return node.aframeObj.object3D.matrix
                    }
                    //.worldToLocal

                }


            },


            // -- deletingNode -------------------------------------------------------------------------

            //deletingNode: function( nodeID ) {
            //},

            // -- deletingNode -------------------------------------------------------------------------

            deletingNode: function (nodeID) {

                if (nodeID) {
                    var childNode = this.state.nodes[nodeID];
                    if (!childNode) return;


                    if (childNode !== undefined) {

                        if (childNode.children) {

                            for (var i = 0; i < childNode.children.length; i++) {
                                this.deletingNode(childNode.children[i]);
                            }
                        }

                        if (childNode.aframeObj !== undefined) {
                            // removes and destroys object
                            childNode.aframeObj.parentNode.removeChild(childNode.aframeObj);
                            childNode.aframeObj.destroy();
                            childNode.aframeObj = undefined;
                        }

                        delete this.state.nodes[nodeID];
                    }

                }
            },



            // -- settingProperty ----------------------------------------------------------------------

            settingProperty: function (nodeID, propertyName, propertyValue) {

                let self = this;
                var node = this.state.nodes[nodeID];
                var value = undefined;

                //    if (node.componentName == 'line') {
                //        console.log(node.aframeObj);
                //    }

                if (node && node.aframeObj && _self_.utility.validObject(propertyValue)) {

                    var aframeObject = node.aframeObj;

                    if (this.state.isNodeDefinition(node.prototypes)) {

                        // 'id' will be set to the nodeID
                        value = propertyValue;
                        switch (propertyName) {

                            default:
                                value = undefined;
                                break;
                        }

                    }


                    if (value === undefined && this.state.isAEntityDefinition(node.prototypes)) {

                        value = propertyValue;

                        switch (propertyName) {

                            case "position":

                                if (!node.transform)
                                    node.transform = {};

                                var position = this.state.setFromValue(propertyValue || []); //goog.vec.Vec3.createFromArray( propertyValue || [] );
                                node.transform.position = position.clone();
                                //value = propertyValue;
                                node.transform.storedPositionDirty = true;
                                //setTransformsDirty( threeObject );
                                //this.state.setAFrameProperty('position', propertyValue, aframeObject);
                                break;

                            case "rotation":

                                if (!node.transform)
                                    node.transform = {};

                                var rotation = this.state.setFromValue(propertyValue || []); //goog.vec.Vec3.createFromArray( propertyValue || [] );
                                node.transform.rotation = rotation.clone();
                                //value = propertyValue;
                                node.transform.storedRotationDirty = true;

                                //this.state.setAFrameProperty('rotation', propertyValue, aframeObject);
                                break;

                            case "scale":

                                if (!node.transform)
                                    node.transform = {};

                                var scale = this.state.setFromValue(propertyValue || []); //goog.vec.Vec3.createFromArray( propertyValue || [] );
                                node.transform.scale = scale.clone();
                                //value = propertyValue;
                                node.transform.storedScaleDirty = true;
                                //setTransformsDirty( threeObject );
                                //this.state.setAFrameProperty('position', propertyValue, aframeObject);

                                //this.state.setAFrameProperty('scale', propertyValue, aframeObject);
                                break;


                            case "animationTimeUpdated":
                                if (node.transform) {
                                    node.transform.storedPositionDirty = true;
                                    node.transform.storedRotationDirty = true;
                                    node.transform.storedScaleDirty = true;
                                }

                                break;

                            case "clickable":
                                if (propertyValue) {
                                    aframeObject.setAttribute('class', 'intersectable');
                                } else {
                                    aframeObject.setAttribute('class', 'nonintersectable');
                                }
                                node.events.clickable = propertyValue;
                                break;

                            case "class":
                                var newClasses = [];
                                if (propertyValue.includes(',')) {
                                    newClasses = propertyValue.split(',');
                                } else {
                                    newClasses = propertyValue.split(' ')
                                }

                                // let newClasses = propertyValue.split(','); //trim()
                                aframeObject.setAttribute('class', "");
                                newClasses.forEach(el => {
                                    aframeObject.classList.add(el.trim());
                                })
                                break;

                            case "ownedBy":
                                aframeObject.setAttribute('ownedby', propertyValue);
                                break;

                            case "visible":
                                aframeObject.setAttribute('visible', propertyValue);
                                break;

                            //  case "clickable":   
                            //          console.log("set clickable!");
                            //          value = propertyValue;
                            //      break;

                            // case "clickable":
                            //     if (propertyValue) {
                            //         aframeObject.addEventListener('click', function (evt) {
                            //              console.log("click!");
                            //             vwf_view.kernel.fireEvent(node.ID, "clickEvent",evt.detail.cursorEl.id);
                            //         });
                            //     }
                            //     break;


                            // case "look-controls-enabled":
                            //     aframeObject.setAttribute('look-controls', 'enabled', propertyValue);
                            //     break;
                            case "wasd-controls":
                                aframeObject.setAttribute('wasd-controls', 'enabled', propertyValue);
                                break;

                            default:
                                value = undefined;
                                break;
                        }

                    }

                    if (value === undefined && aframeObject.nodeName == "A-ASSET-ITEM") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "itemID":
                                aframeObject.setAttribute('id', propertyValue);
                                break;

                            case "itemSrc":
                                aframeObject.setAttribute('src', propertyValue);
                                break;

                            default:
                                value = undefined;
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "IMG") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "itemID":
                                aframeObject.setAttribute('id', propertyValue);
                                break;

                            case "itemSrc":
                                aframeObject.setAttribute('src', propertyValue);
                                break;

                            // case "width":
                            //     aframeObject.width = propertyValue;
                            // break;

                            // case "height":
                            //     aframeObject.height = propertyValue;
                            // break;

                            default:
                                value = undefined;
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "AUDIO") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "itemID":
                                aframeObject.setAttribute('id', propertyValue);
                                break;

                            case "itemSrc":
                                aframeObject.setAttribute('src', propertyValue);
                                break;

                            default:
                                value = undefined;
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "VIDEO") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "itemID":
                                aframeObject.setAttribute('id', propertyValue);
                                break;

                            case "itemSrc":
                                aframeObject.setAttribute('src', propertyValue);
                                break;

                            default:
                                value = undefined;
                                break;
                        }
                    }


                    if (value === undefined && aframeObject.nodeName == "A-SCENE") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "color":
                                aframeObject.setAttribute('background', {
                                    'color': propertyValue
                                });
                                break;

                            case "transparent":
                                aframeObject.setAttribute('background', {
                                    'transparent': propertyValue
                                });
                                break;

                            // case "fog":
                            //     aframeObject.setAttribute('fog', propertyValue);
                            //     break;
                            case "assets":
                                _self_.initAssets(propertyValue)
                                break;


                            default:
                                value = undefined;
                                break;
                        }
                    }


                    if (value === undefined && aframeObject.nodeName == "A-GLTF-MODEL") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "src":
                                aframeObject.setAttribute('src', propertyValue);
                                break;


                            default:
                                value = undefined;
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-COLLADA-MODEL") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "src":
                                aframeObject.setAttribute('src', propertyValue);
                                break;


                            default:
                                value = undefined;
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-OBJ-MODEL") {
                        value = propertyValue;

                        switch (propertyName) {

                            case "src":
                                aframeObject.setAttribute('src', propertyValue);
                                break;

                            case "mtl":
                                aframeObject.setAttribute('mtl', propertyValue);
                                break;

                            default:
                                value = undefined;
                                break;
                        }
                    }

                    //A-Frame geometries & primitives
                    if (value === undefined && self.aframePrimitives.includes(aframeObject.nodeName.toLowerCase())) {

                        value = propertyValue;
                        //let geometry = aframeObject.nodeName.toLowerCase().slice(2);
                        //AFRAME.geometries[geometry].schema;
                        let mappings = AFRAME.primitives.primitives[aframeObject.nodeName.toLowerCase()].prototype.mappings;
                        let el = Object.keys(mappings).includes(propertyName);
                        if (el) {
                            aframeObject.setAttribute(propertyName, propertyValue);
                        } else {
                            value = undefined
                        }


                        if (value === undefined && aframeObject.nodeName == "A-LIGHT") {
                            value = propertyValue;

                            switch (propertyName) {
                                case "castShadow":
                                    aframeObject.setAttribute('light', 'castShadow', propertyValue);
                                    break;

                                case "shadowCameraVisible":
                                    aframeObject.setAttribute('light', 'shadowCameraVisible', propertyValue);
                                    break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                    }

                    if (value === undefined && aframeObject.nodeName == "A-ANIMATION") {
                        value = propertyValue;
                        switch (propertyName) {

                            // attribute:
                            // dur:
                            // from:
                            // to:
                            // repeat:

                            case "dur":
                                aframeObject.setAttribute('dur', propertyValue);
                                break;

                            case "from":
                                aframeObject.setAttribute('from', propertyValue);
                                break;

                            case "to":
                                aframeObject.setAttribute('to', propertyValue);
                                break;

                            case "repeat":
                                aframeObject.setAttribute('repeat', propertyValue);
                                break;

                            case "attribute":
                                aframeObject.setAttribute('attribute', propertyValue);
                                break;

                            case "begin":
                                aframeObject.setAttribute('begin', propertyValue);
                                break;

                            default:
                                value = undefined;
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-CAMERA") {
                        value = propertyValue;
                        switch (propertyName) {

                            case "user-height":
                                aframeObject.setAttribute('user-height', propertyValue);
                                break;

                            case "look-controls-enabled":
                                aframeObject.setAttribute('look-controls-enabled', propertyValue);
                                break;

                            case "wasd-controls-enabled":
                                aframeObject.setAttribute('wasd-controls-enabled', propertyValue);
                                break;

                            // case "active":
                            //     aframeObject.setAttribute('camera', 'active', propertyValue);
                            //        break;

                            default:
                                value = undefined;
                                break;
                        }
                    }
                    if (value === undefined && aframeObject.nodeName == "A-SUN-SKY") {
                        value = propertyValue;
                        switch (propertyName) {

                            case "sunPosition":
                                aframeObject.setAttribute('material', 'sunPosition', propertyValue);
                                break;

                            // case "active":
                            //     aframeObject.setAttribute('camera', 'active', propertyValue);
                            //        break;

                            default:
                                value = undefined;
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-ANCHOR") {
                        value = propertyValue;

                        switch (propertyName) {
                            case "changeMatrixMode":
                                aframeObject.setAttribute('arjs-anchor', 'changeMatrixMode', propertyValue);
                                break;

                            case 'hit-testing-enabled':
                                aframeObject.setAttribute('hit-testing-enabled', propertyValue);
                                break;

                            case 'preset':
                                aframeObject.setAttribute('preset', propertyValue);
                                break;

                            case 'markerType':
                                aframeObject.setAttribute('type', propertyValue);
                                break;

                            case 'markerValue':
                                aframeObject.setAttribute('velue', propertyValue);
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

            gettingProperty: function (nodeID, propertyName, propertyValue) {

                let self = this;
                var node = this.state.nodes[nodeID];
                var value = undefined;

                if (node && node.aframeObj) {

                    var aframeObject = node.aframeObj;

                    if (this.state.isNodeDefinition(node.prototypes)) {
                        switch (propertyName) { }
                    }


                    if (value === undefined && this.state.isAEntityDefinition(node.prototypes)) {

                        switch (propertyName) {

                            case "position":
                                // var pos = aframeObject.getAttribute('position');
                                // if (pos !== undefined) {
                                //     value = pos//[pos.x, pos.y, pos.z]//AFRAME.utils.coordinates.stringify(pos);
                                // }

                                if (node.transform.position) {

                                    if (node.transform.storedPositionDirty) {
                                        this.state.updateStoredTransformFor(node, 'position');
                                    }

                                    value = node.transform.position.clone();
                                    //value =  node.transform.position;
                                }
                                break;

                            case "rotation":

                                if (node.transform.rotation) {

                                    if (node.transform.storedRotationDirty) {
                                        this.state.updateStoredTransformFor(node, 'rotation');
                                    }

                                    value = node.transform.rotation.clone();

                                    // var rot = aframeObject.getAttribute('rotation');
                                    // if (rot !== undefined) {
                                    //     value = rot//AFRAME.utils.coordinates.stringify(rot);
                                    // }
                                }

                                break;


                            case "scale":

                                if (node.transform.scale) {

                                    if (node.transform.storedScaleDirty) {
                                        this.state.updateStoredTransformFor(node, 'scale');
                                    }

                                    value = node.transform.scale.clone();
                                    // var scale = aframeObject.getAttribute('scale');
                                    // if (scale !== undefined) {
                                    //     value = scale//AFRAME.utils.coordinates.stringify(scale);
                                    // }
                                }
                                break;



                            case "clickable":
                                value = node.events.clickable;
                                break;

                            case "class":
                                value = aframeObject.classList.toString();
                                //aframeObject.getAttribute('class');
                                break;

                            // case "look-controls-enabled":
                            //     var look = aframeObject.getAttribute('look-controls-enabled');
                            //     if (look !== null && look !== undefined) {
                            //         value = aframeObject.getAttribute('look-controls').enabled;
                            //     }
                            //     break;
                            // case "wasd-controls":
                            //     var wasd = aframeObject.getAttribute('wasd-controls');
                            //     if (wasd !== null && wasd !== undefined) {
                            //         value = aframeObject.getAttribute('wasd-controls').enabled;
                            //     }
                            //     break;

                            case "ownedBy":
                                value = aframeObject.getAttribute('ownedby');
                                break;


                            case "visible":
                                value = aframeObject.getAttribute('visible');
                                break;

                        }
                    }



                    if (value === undefined && aframeObject.nodeName == "A-ASSET-ITEM") {

                        switch (propertyName) {

                            case "itemID":
                                value = aframeObject.getAttribute('id');
                                break;

                            case "itemSrc":
                                value = aframeObject.getAttribute('src');
                                break;


                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "IMG") {

                        switch (propertyName) {

                            case "itemID":
                                value = aframeObject.getAttribute('id');
                                break;

                            case "itemSrc":
                                value = aframeObject.getAttribute('src');
                                break;

                            case "width":
                                value = aframeObject.width;
                                break;

                            case "height":
                                value = aframeObject.height;
                                break;

                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "AUDIO") {

                        switch (propertyName) {

                            case "itemID":
                                value = aframeObject.getAttribute('id');
                                break;

                            case "itemSrc":
                                value = aframeObject.getAttribute('src');
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "VIDEO") {

                        switch (propertyName) {

                            case "itemID":
                                value = aframeObject.getAttribute('id');
                                break;

                            case "itemSrc":
                                value = aframeObject.getAttribute('src');
                                break;

                            case "videoWidth":
                                value = aframeObject.videoWidth;
                                break;

                            case "videoHeight":
                                value = aframeObject.videoHeight;
                                break;

                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-SCENE") {

                        switch (propertyName) {
                            // case "fog":
                            //     value = aframeObject.getAttribute('fog');
                            //     break;

                            case "assets":
                                break;
                            case "color":
                                if (aframeObject.getAttribute('background')) {
                                    value = aframeObject.getAttribute('background').color;
                                }
                                break;

                            case "transparent":
                                if (aframeObject.getAttribute('background')) {
                                    value = aframeObject.getAttribute('background').transparent;
                                }
                                break;
                        }
                    }

                    //A-Frame geometries & primitives
                    if (value === undefined && self.aframePrimitives.includes(aframeObject.nodeName.toLowerCase())) {

                        // let geometry = aframeObject.nodeName.toLowerCase().slice(2);
                        // let schema = AFRAME.geometries[geometry].schema;
                        let mappings = AFRAME.primitives.primitives[aframeObject.nodeName.toLowerCase()].prototype.mappings;
                        let el = Object.keys(mappings).includes(propertyName);

                        value = el ? aframeObject.getAttribute(propertyName) : undefined;
                        // if(el && !value){
                        //     let attr = mappings[propertyName].split('.');
                        //     value = aframeObject.getAttribute(attr[0],attr[1])
                        // }

                        //Light specific
                        if (value === undefined && aframeObject.nodeName == "A-LIGHT") {
                            switch (propertyName) {
                                case "castShadow":
                                    value = aframeObject.getAttribute('light').castShadow;
                                    break;

                                case "shadowCameraVisible":
                                    value = aframeObject.getAttribute('light').shadowCameraVisible;
                                    break;

                            }
                        }


                    }


                    if (value === undefined && aframeObject.nodeName == "A-ANIMATION") {


                        switch (propertyName) {

                            case "attribute":
                                value = aframeObject.getAttribute('attribute');
                                break;


                            case "dur":
                                value = aframeObject.getAttribute('dur');
                                break;



                            case "from":
                                value = aframeObject.getAttribute('from');
                                break;



                            case "to":
                                value = aframeObject.getAttribute('to');
                                break;



                            case "repeat":
                                value = aframeObject.getAttribute('repeat');
                                break;



                            case "begin":
                                value = aframeObject.getAttribute('begin');
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-CAMERA") {


                        switch (propertyName) {
                            case "user-height":
                                value = aframeObject.getAttribute('user-height');
                                break;
                            case "look-controls-enabled":
                                value = aframeObject.getAttribute('look-controls-enabled');
                                break;

                            case "wasd-controls-enabled":
                                value = aframeObject.getAttribute('wasd-controls-enabled');
                                break;

                        }

                        //    switch (propertyName) {
                        //         case "active":
                        //             value = aframeObject.getAttribute('camera').active;
                        //             break;
                        //         }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-SUN-SKY") {


                        switch (propertyName) {
                            case "sunPosition":
                                value = aframeObject.getAttribute('material').sunPosition;
                                break;
                        }

                        //    switch (propertyName) {
                        //         case "active":
                        //             value = aframeObject.getAttribute('camera').active;
                        //             break;
                        //         }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-COLLADA-MODEL") {

                        switch (propertyName) {
                            case "src":
                                value = aframeObject.getAttribute('src');
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-OBJ-MODEL") {

                        switch (propertyName) {
                            case "src":
                                value = aframeObject.getAttribute('src');
                                break;
                            case "mtl":
                                value = aframeObject.getAttribute('mtl');
                                break;
                        }
                    }


                    if (value === undefined && aframeObject.nodeName == "A-GLTF-MODEL") {

                        switch (propertyName) {
                            case "src":
                                value = aframeObject.getAttribute('src');
                                break;
                        }
                    }

                    if (value === undefined && aframeObject.nodeName == "A-ANCHOR") {

                        switch (propertyName) {
                            case "changeMatrixMode":
                                value = aframeObject.getAttribute('arjs-anchor').changeMatrixMode;
                                break;
                            case "hit-testing-enabled":
                                value = aframeObject.getAttribute('hit-testing-enabled');
                                break;
                            case "preset":
                                value = aframeObject.getAttribute('preset');
                                break;

                            case 'markerType':
                                value = aframeObject.getAttribute('type');
                                break;

                            case 'markerValue':
                                value = aframeObject.getAttribute('value');
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


    async initAssets(propertyValue) {

        let assetsEl = document.querySelector('a-assets');
        if (!assetsEl) {
            let newAssetsEl = document.createElement('a-assets');
            aframeObject.appendChild(newAssetsEl);
        }
        var assetsElement = document.querySelector('a-assets');
        if (propertyValue) {

            let path = JSON.parse(localStorage.getItem('lcs_app')).path.public_path;
            let worldName = path.slice(1);
            let dbPath = propertyValue.split(".").join("_");

            let userDB = _LCSDB.user(_LCS_WORLD_USER.pub);
            userDB.get('worlds').get(worldName).get(dbPath).load(function (response) {
                if (response) {

                    if (Object.keys(response).length > 0) {
                        //console.log(JSON.parse(response));
                        let assets = (typeof (response) == 'object') ? response : JSON.parse(response);
                        for (var prop in assets) {
                            var elm = document.createElement(assets[prop].tag);
                            elm.setAttribute('id', prop);
                            elm.setAttribute('src', assets[prop].src);
                            assetsElement.appendChild(elm);
                        }
                    }
                }
            });
        }
    }

}

export {
    AFrameModel as default
}

