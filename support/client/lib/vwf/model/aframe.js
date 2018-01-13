"use strict";

// VWF & A-Frame model driver
// Copyright 2017 Krestianstvo.org project
//
// Copyright 2012 United States Government, as represented by the Secretary of Defense, Under
// Secretary of Defense (Personnel & Readiness).
// 
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
// in compliance with the License. You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License
// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
// or implied. See the License for the specific language governing permissions and limitations under
// the License.

/// vwf/model/scenejs.js is a placeholder for a 3-D scene manager.
/// 
/// @module vwf/model/aframe
/// @requires vwf/model

define(["module", "vwf/model", "vwf/utility"], function (module, model, utility) {
    var self;

    return model.load(module, {

        // == Module Definition ====================================================================

        // -- initialize ---------------------------------------------------------------------------

        initialize: function () {

            self = this;

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
                            found = (prototypes[i] === "http://vwf.example.com/aframe/node.vwf");
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
                                    aframeObject.setAttribute(propertyName, { x: propertyValue[0], y: propertyValue[1], z: propertyValue[2] })
                                } else if (typeof propertyValue === 'string') {
                                    aframeObject.setAttribute(propertyName, AFRAME.utils.coordinates.parse(propertyValue))
                                }
                    
                        }
            };

            this.state.kernel = this.kernel.kernel.kernel;

            this.aframeDef = {
                'A-BOX':    [
                    'ambient-occlusion-map', 'ambient-occlusion-map-intensity',
                    'ambient-occlusion-texture-offset', 'ambient-occlusion-texture-repeat',
                    'color',  'depth', 'displacement-bias', 'displacement-map',
                    'displacement-scale', 'displacement-texture-offset',
                    'displacement-texture-repeat', 'env-map',
                    'fog', 'height', 'metalness',
                    'normal-map', 'normal-scale',
                    'normal-texture-offset', 'normal-texture-repeat',
                    'repeat', 'roughness', 'segments-depth',
                    'segments-height', 'segments-width',
                    'spherical-env-map', 'src', 'width',
                    'wireframe', 'wireframe-linewidth'],

                'A-SPHERE': [
                    'ambient-occlusion-map', 'ambient-occlusion-map-intensity',
                    'ambient-occlusion-texture-offset', 'ambient-occlusion-texture-repeat',
                    'color', 'displacement-bias', 'displacement-map',
                    'displacement-scale', 'displacement-texture-offset',
                    'displacement-texture-repeat', 'env-map',
                    'fog', 'height', 'metalness',
                    'normal-map', 'normal-scale',
                    'normal-texture-offset', 'normal-texture-repeat',
                    'phi-length', 'phi-start', 'radius', 
                    'repeat', 'roughness', 'segments-depth',
                    'segments-height', 'segments-width',
                    'spherical-env-map', 'src', 
                    'theta-length', 'theta-start',
                    'width',  'wireframe', 'wireframe-linewidth'
                ],

                'A-PLANE': [
                    'ambient-occlusion-map', 'ambient-occlusion-map-intensity',
                    'ambient-occlusion-texture-offset', 'ambient-occlusion-texture-repeat',
                    'color', 'displacement-bias', 'displacement-map',
                    'displacement-scale', 'displacement-texture-offset',
                    'displacement-texture-repeat', 'env-map',
                    'fog', 'height', 'metalness',
                    'normal-map', 'normal-scale',
                    'normal-texture-offset', 'normal-texture-repeat',
                    'repeat', 'roughness',
                    'segments-height', 'segments-width',
                    'spherical-env-map', 'src', 'width',
                    'wireframe', 'wireframe-linewidth'
                ],

                'A-TEXT': [
                        'align', 'alpha-test', 'anchor',
                        'baseline', 'color', 'font',
                        'font-image', 'height',
                        'letter-spacing', 'line-height',
                        'opacity', 'shader',
                        'side', 'tab-size',
                        'transparent', 'value',
                        'white-space', 'width',
                        'wrap-count', 'wrap-pixels',
                        'z-offset'
                    ],

                'A-SKY': [
                    'color', 'metalness', 'opacity',
                    'phi-length', 'phi-start', 'radius',
                    'repeat', 'roughness', 'segments-height',
                    'segments-width', 'shader',
                    'side', 'src',
                    'theta-length', 'theta-start',
                    'transparent'
                    ],

                'A-LIGHT': [
                    'angle', 'color', 'decay', 'distance',
                    'ground-color', 'intensity', 'penumbra',
                    'type', 'target'
                    ]
            }
           
            

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
            var prototypeID = utility.ifPrototypeGetId(appID, this.state.prototypes, nodeID, childID);
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

            var protos = getPrototypes(this.kernel, childExtendsID);
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

                node.aframeObj = createAFrameObject(node);
                addNodeToHierarchy(node);

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

        callingMethod: function( nodeID, methodName, methodParameters ) {

            var node = this.state.nodes[nodeID];

            if(!node) return;

            if (node && node.aframeObj ) {
                if (methodName == 'lookAt') {
                    console.log('lookAt: ' +  methodParameters[0]);
                    let target = methodParameters[0];
                    node.aframeObj.object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z));
                    let newRotation = node.aframeObj.getAttribute('rotation');
                    self.kernel.setProperty(nodeID, "rotation", {x: 0, y: newRotation.y, z: 0});
                }
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
                    childNode.aframeObj = undefined;
                }

                delete this.state.nodes[nodeID];
            }

        }
        },



        // -- settingProperty ----------------------------------------------------------------------

        settingProperty: function (nodeID, propertyName, propertyValue) {

            var node = this.state.nodes[nodeID];
            var value = undefined;

            //    if (node.componentName == 'line') {
            //        console.log(node.aframeObj);
            //    }

            if (node && node.aframeObj && utility.validObject(propertyValue)) {

                var aframeObject = node.aframeObj;

                if (isNodeDefinition(node.prototypes)) {

                    // 'id' will be set to the nodeID
                    value = propertyValue;
                    switch (propertyName) {

                        default:
                            value = undefined;
                            break;
                    }

                }


                if (value === undefined && isAEntityDefinition(node.prototypes)) {

                    value = propertyValue;

                    switch (propertyName) {

                        case "worldPosition":
                            break;

                        case "position":
                            this.state.setAFrameProperty('position', propertyValue, aframeObject);
                            break;

                        case "rotation":
                            this.state.setAFrameProperty('rotation', propertyValue, aframeObject);
                            break;

                        case "scale":
                        this.state.setAFrameProperty('scale', propertyValue, aframeObject);
                            break;

                        case "clickable":
                            if (propertyValue) {
                                aframeObject.setAttribute('class', 'intersectable');
                            } else {
                                aframeObject.setAttribute('class', 'nonintersectable');
                            }
                            node.events.clickable = propertyValue;
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

                if (value === undefined && aframeObject.nodeName == "A-SKY") {
                    value = propertyValue;

                    self.aframeDef['A-SKY'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })
                }

                if (value === undefined && aframeObject.nodeName == "A-TEXT") {
                    value = propertyValue;

                    self.aframeDef['A-TEXT'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })
                   
                }

                if (value === undefined && aframeObject.nodeName == "A-SCENE") {
                    value = propertyValue;

                    switch (propertyName) {

                        case "color":
                        aframeObject.setAttribute('background', {'color': propertyValue} );
                        break;

                        case "transparent":
                        aframeObject.setAttribute('background', {'transparent': propertyValue} );
                        break;

                        // case "fog":
                        //     aframeObject.setAttribute('fog', propertyValue);
                        //     break;
                        case "assets":
                            let assetsEl = document.querySelector('a-assets');
                            if (!assetsEl) {
                                let newAssetsEl = document.createElement('a-assets');
                                aframeObject.appendChild(newAssetsEl);
                            }
                            var assetsElement = document.querySelector('a-assets');
                            if (propertyValue) {

                                httpGetJson(propertyValue).then(function (response) {
                                    console.log(JSON.parse(response));
                                    let assets = JSON.parse(response);
                                    for (var prop in assets) {
                                        var elm = document.createElement(assets[prop].tag);
                                        elm.setAttribute('id', prop);
                                        elm.setAttribute('src', assets[prop].src);
                                        assetsElement.appendChild(elm);

                                    }

                                }).catch(function (error) {
                                    console.log(error);
                                });

                            }
                            break;


                        default:
                            value = undefined;
                            break;
                    }
                }

   
   
                


                if (value === undefined && aframeObject.nodeName == "A-BOX") {
                    value = propertyValue;

                    self.aframeDef['A-BOX'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })
                }

                if (value === undefined && aframeObject.nodeName == "A-LIGHT") {
                    value = propertyValue;

                    self.aframeDef['A-LIGHT'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })

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

                if (value === undefined && aframeObject.nodeName == "A-SOUND") {
                    value = propertyValue;

                    switch (propertyName) {

                        case "src":
                            aframeObject.setAttribute('src', propertyValue);
                            break;

                        case "on":
                            aframeObject.setAttribute('on', propertyValue);
                            break;

                        case "autoplay":
                            aframeObject.setAttribute('autoplay', propertyValue);
                            break;

                        default:
                            value = undefined;
                            break;
                    }
                }

                if (value === undefined && aframeObject.nodeName == "A-PLANE") {
                    value = propertyValue;

                    self.aframeDef['A-PLANE'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })

                }

                if (value === undefined && aframeObject.nodeName == "A-SPHERE") {
                    value = propertyValue;

                    self.aframeDef['A-SPHERE'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })
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

            }
            return value;
        },

        // -- gettingProperty ----------------------------------------------------------------------

        gettingProperty: function (nodeID, propertyName, propertyValue) {


            var node = this.state.nodes[nodeID];
            var value = undefined;

            if (node && node.aframeObj) {

                var aframeObject = node.aframeObj;

                if (isNodeDefinition(node.prototypes)) {
                    switch (propertyName) {
                    }
                }


                if (value === undefined && isAEntityDefinition(node.prototypes)) {

                    switch (propertyName) {

                        case "worldPosition":
                        var pos = aframeObject.object3D.getWorldPosition();
                        if (pos !== undefined) {
                            value = pos;
                        }
                        break;

                        case "position":
                            var pos = aframeObject.getAttribute('position');
                            if (pos !== undefined) {
                                value = pos//[pos.x, pos.y, pos.z]//AFRAME.utils.coordinates.stringify(pos);
                            }
                            break;
                        case "scale":
                            var scale = aframeObject.getAttribute('scale');
                            if (scale !== undefined) {
                                value = scale//AFRAME.utils.coordinates.stringify(scale);
                            }
                            break;

                        case "rotation":
                            var rot = aframeObject.getAttribute('rotation');
                            if (rot !== undefined) {
                                value = rot//AFRAME.utils.coordinates.stringify(rot);
                            }
                            break;

                        case "clickable":
                            value = node.events.clickable;
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

                if (value === undefined && aframeObject.nodeName == "A-SCENE") {

                    switch (propertyName) {
                        // case "fog":
                        //     value = aframeObject.getAttribute('fog');
                        //     break;
                        
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

                if (value === undefined && aframeObject.nodeName == "A-SKY") {
                    
                    self.aframeDef['A-SKY'].forEach(element => {
                        if (element == propertyName) {
                            value = aframeObject.getAttribute(element);
                        }
                    })

                }

               

                if (value === undefined && aframeObject.nodeName == "A-LIGHT") {

                    self.aframeDef['A-LIGHT'].forEach(element => {
                        if (element == propertyName) {
                            value = aframeObject.getAttribute(element);
                        }
                    })

                    switch (propertyName) {
                        case "castShadow":
                        value = aframeObject.getAttribute('light').castShadow;
                            break;

                        case "shadowCameraVisible":
                        value = aframeObject.getAttribute('light').shadowCameraVisible;
                            break;

                    }

                }

                if (value === undefined && aframeObject.nodeName == "A-BOX") {
    
                    self.aframeDef['A-BOX'].forEach(element => {
                        if (element == propertyName) {
                            value = aframeObject.getAttribute(element);
                        }
                    })
            }

                if (value === undefined && aframeObject.nodeName == "A-PLANE") {

                   self.aframeDef['A-PLANE'].forEach(element => {
                        if (element == propertyName) {
                            value = aframeObject.getAttribute(element);
                        }
                    })
                }

                if (value === undefined && aframeObject.nodeName == "A-SPHERE") {

                    self.aframeDef['A-SPHERE'].forEach(element => {
                        if (element == propertyName) {
                            value = aframeObject.getAttribute(element);
                        }
                    })
                }

                if (value === undefined && aframeObject.nodeName == "A-TEXT") {

                    self.aframeDef['A-TEXT'].forEach(element => {
                        if (element == propertyName) {
                            value = aframeObject.getAttribute(element);
                        }
                    })
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

                if (value === undefined && aframeObject.nodeName == "A-SOUND") {

                    switch (propertyName) {
                        case "src":
                            value = aframeObject.getAttribute('src');
                            break;
                        case "on":
                            value = aframeObject.getAttribute('on');
                            break;
                        case "autoplay":
                            value = aframeObject.getAttribute('autoplay');
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



            }

            if (value !== undefined) {
                propertyValue = value;
            }

            return value;
        }
    });


    function createAFrameObject(node, config) {
        var protos = node.prototypes;
        var aframeObj = undefined;

        if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/ascene.vwf")) {
            aframeObj = document.createElement('a-scene');
            let assetsElement = document.createElement('a-assets');
            aframeObj.appendChild(assetsElement);
            self.state.scenes[node.ID] = aframeObj;
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-asset-item.vwf")) {

            let assets = document.querySelector('a-assets');
            if (assets){

                aframeObj = document.createElement('a-asset-item');
                aframeObj.setAttribute('id', "item-"+GUID());
                aframeObj.setAttribute('src', "");
                aframeObj.setAttribute('crossorigin', "anonymous");
                assets.appendChild(aframeObj);
            }
        
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-asset-image-item.vwf")) {

            let assets = document.querySelector('a-assets');
            if (assets){

                aframeObj = document.createElement('img');
                aframeObj.setAttribute('id', "item-"+GUID());
                aframeObj.setAttribute('src', "");
                aframeObj.setAttribute('crossorigin', "anonymous");
                assets.appendChild(aframeObj);
            }

        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-asset-audio-item.vwf")) {

            let assets = document.querySelector('a-assets');
            if (assets){

                aframeObj = document.createElement('audio');
                aframeObj.setAttribute('id', "item-"+GUID());
                aframeObj.setAttribute('src', "");
                aframeObj.setAttribute('crossorigin', "anonymous");
                assets.appendChild(aframeObj);
            }


        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/asky.vwf")) {
            aframeObj = document.createElement('a-sky');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acamera.vwf")) {
            aframeObj = document.createElement('a-camera');
            aframeObj.setAttribute('camera', 'active', false);

        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/alight.vwf")) {
            aframeObj = document.createElement('a-light');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acursor.vwf")) {
            aframeObj = document.createElement('a-cursor');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-sun-sky.vwf")) {
                aframeObj = document.createElement('a-sun-sky');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/abox.vwf")) {
            aframeObj = document.createElement('a-box');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aplane.vwf")) {
            aframeObj = document.createElement('a-plane');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/atext.vwf")) {
            aframeObj = document.createElement('a-text');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acolladamodel.vwf")) {
            aframeObj = document.createElement('a-collada-model');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aobjmodel.vwf")) {
            aframeObj = document.createElement('a-obj-model');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/asound.vwf")) {
            aframeObj = document.createElement('a-sound');
         } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/agltfmodel.vwf")) {
            aframeObj = document.createElement('a-gltf-model');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/asphere.vwf")) {
            aframeObj = document.createElement('a-sphere');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aanimation.vwf")) {
            aframeObj = document.createElement('a-animation');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aentity.vwf")) {
            aframeObj = document.createElement('a-entity');
        }

        if (aframeObj.nodeName !== "A-ASSET-ITEM" && aframeObj.nodeName !== "IMG" && aframeObj.nodeName !== "AUIDO"){
            aframeObj.setAttribute('id', node.ID);
        }

       
        return aframeObj;
    }

    function addNodeToHierarchy(node) {

        if (node.aframeObj) {
            if (self.state.nodes[node.parentID] !== undefined) {
                var parent = self.state.nodes[node.parentID];
                if (parent.aframeObj) {

                    if (parent.children === undefined) {
                        parent.children = [];
                    }
                    parent.children.push(node.ID);
                    //console.info( "Adding child: " + childID + " to " + nodeID );
                    if (node.aframeObj.nodeName !== "A-ASSET-ITEM" && node.aframeObj.nodeName !== "IMG" && node.aframeObj.nodeName !== "AUIDO"){
                    parent.aframeObj.appendChild(node.aframeObj);
                    }
                }
            }
            if (node.aframeObj.nodeName !== "A-SCENE") {
                node.scene = self.state.scenes[self.kernel.application()];
            }

        }

    }


    function getPrototypes(kernel, extendsID) {
        var prototypes = [];
        var id = extendsID;

        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }
        return prototypes;
    }

    function isNodeDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/node.vwf");
            }
        }
        return found;
    }

    function isAEntityDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/aentity.vwf");
            }
        }
        return found;
    }





    // Changing this function significantly from the GLGE code
    // Will search hierarchy down until encountering a matching child
    // Will look into nodes that don't match.... this might not be desirable
    function FindChildByName(obj, childName, childType, recursive) {

        var child = undefined;
        if (recursive) {

            // TODO: If the obj itself has the child name, the object will be returned by this function
            //       I don't think this this desirable.

            if (nameTest.call(this, obj, childName)) {
                child = obj;
            } else if (obj.children && obj.children.length > 0) {
                for (var i = 0; i < obj.children.length && child === undefined; i++) {
                    child = FindChildByName(obj.children[i], childName, childType, true);
                }
            }
        } else {
            if (obj.children) {
                for (var i = 0; i < obj.children.length && child === undefined; i++) {
                    if (nameTest.call(this, obj.children[i], childName)) {
                        child = obj.children[i];
                    }
                }
            }
        }
        return child;

    }

    function nameTest(obj, name) {
        if (obj.name == "") {
            return (obj.parent.name + "Child" == name);
        } else {
            return (obj.name == name || obj.id == name || obj.vwfID == name);
        }
    }

    function httpGet(url) {
        return new Promise(function (resolve, reject) {
            // do the usual Http request
            let request = new XMLHttpRequest();
            request.open('GET', url);

            request.onload = function () {
                if (request.status == 200) {
                    resolve(request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function () {
                reject(Error('Network Error'));
            };

            request.send();
        });
    }
    async function httpGetJson(url) {
        // check if the URL looks like a JSON file and call httpGet.
        let regex = /\.(json)$/i;

        if (regex.test(url)) {
            // call the async function, wait for the result
            return await httpGet(url);
        } else {
            throw Error('Bad Url Format');
        }
    }

    function GUID() {
        var S4 = function () {
            return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
        };

        return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
    }


});

