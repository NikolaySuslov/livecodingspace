"use strict";
/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

// VWF & A-Frame model driver

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

                            propertyValue.includes(',') ? aframeObject.setAttribute(propertyName, AFRAME.utils.coordinates.parse(propertyValue.split(',').join(' '))) : aframeObject.setAttribute(propertyName, AFRAME.utils.coordinates.parse(propertyValue))

                            //aframeObject.setAttribute(propertyName, AFRAME.utils.coordinates.parse(propertyValue))
                        } else if (propertyValue.hasOwnProperty('0')) {
                            aframeObject.setAttribute(propertyName, { x: propertyValue[0], y: propertyValue[1], z: propertyValue[2] })
                        }

                },
                setFromValue: function (propertyValue) {

                    var value = goog.vec.Vec3.create();
                    if (propertyValue.hasOwnProperty('x')) {
                        value = goog.vec.Vec3.createFromValues(propertyValue.x, propertyValue.y, propertyValue.z)
                    }
                    else if (Array.isArray(propertyValue) || propertyValue instanceof Float32Array) {
                        value = goog.vec.Vec3.createFromArray(propertyValue);
                    }
                    else if (typeof propertyValue === 'string') {

                        let val = propertyValue.includes(',') ? AFRAME.utils.coordinates.parse(propertyValue.split(',').join(' ')) : AFRAME.utils.coordinates.parse(propertyValue);
                        value = goog.vec.Vec3.createFromValues(val.x, val.y, val.z)

                        // let val = AFRAME.utils.coordinates.parse(propertyValue);
                        // value = goog.vec.Vec3.createFromValues(val.x, val.y, val.z)


                    }  else if (propertyValue.hasOwnProperty('0')) {
                        value = goog.vec.Vec3.createFromValues(propertyValue[0], propertyValue[1], propertyValue[2])
                    }

                    return value
                }
            };

            this.state.kernel = this.kernel.kernel.kernel;

            this.aframeDef = {
                'A-BOX': [
                    'depth', 'height', 'segments-depth',
                    'segments-height', 'segments-width',
                    'width'],

                'A-SPHERE': [
                    'phi-length', 'phi-start', 'radius',
                    'segments-depth',
                    'segments-height', 'segments-width',
                    'theta-length', 'theta-start'
                ],

                'A-CYLINDER': [
                    'height', 'radius',
                    'open-ended', 'radius-bottom', 'radius-top',
                    'segments-height', 'segments-radial',
                    'theta-length', 'theta-start'
                ],

                'A-CONE': [
                    'height',
                    'open-ended', 'radius-bottom', 'radius-top',
                    'segments-height', 'segments-radial',
                    'theta-length', 'theta-start'
                ],

                'A-PLANE': [
                    'height', 'segments-height', 'segments-width', 'width'
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
                    'z-offset', 'negate'
                ],

                'A-SKY': [
                    'phi-length', 'phi-start', 'radius', 'segments-height',
                    'segments-width',
                    'theta-length', 'theta-start',
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

                if (isAEntityDefinition(node.prototypes)) {
                    //updateStoredTransform( node );
                    updateStoredTransformFor(node, 'position');
                    updateStoredTransformFor(node, 'rotation');
                    updateStoredTransformFor(node, 'scale');
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

            var node = this.state.nodes[nodeID];

            if (!node) return;

            if (node && node.aframeObj) {

                if (methodName == 'lookAt') {
                    console.log('lookAt: ' + methodParameters[0]);
                    let target = methodParameters[0];
                    node.aframeObj.object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z));
                    let newRotation = node.aframeObj.getAttribute('rotation');
                    self.kernel.setProperty(nodeID, "rotation", { x: 0, y: newRotation.y, z: 0 });
                }

                if (methodName == 'worldRotation') {

                    var worldQuat = new THREE.Quaternion();
                    node.aframeObj.object3D.getWorldQuaternion(worldQuat);

                    let angle = (new THREE.Euler()).setFromQuaternion(worldQuat, 'YXZ');
                    let rotation = (new THREE.Vector3(THREE.Math.radToDeg(angle.x),
                        THREE.Math.radToDeg(angle.y), THREE.Math.radToDeg(angle.z)));
                    return rotation

                }

                if (methodName == 'worldPosition') {

                    var position = new THREE.Vector3();

                    node.aframeObj.object3D.getWorldPosition(position);
                    return position

                }

                if(methodName == 'setFont') {

                        node.aframeObj.setAttribute('font', methodParameters[0]);
                    
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
                        childNode.aframeObj.destroy();
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

                        case "position":

                            var position = this.state.setFromValue(propertyValue || []); //goog.vec.Vec3.createFromArray( propertyValue || [] );
                            node.transform.position = goog.vec.Vec3.clone(position);
                            //value = propertyValue;
                            node.transform.storedPositionDirty = true;
                            //setTransformsDirty( threeObject );
                            //this.state.setAFrameProperty('position', propertyValue, aframeObject);
                            break;

                        case "rotation":

                            var rotation = this.state.setFromValue(propertyValue || []); //goog.vec.Vec3.createFromArray( propertyValue || [] );
                            node.transform.rotation = goog.vec.Vec3.clone(rotation);
                            //value = propertyValue;
                            node.transform.storedRotationDirty = true;

                            //this.state.setAFrameProperty('rotation', propertyValue, aframeObject);
                            break;

                        case "scale":

                            var scale = this.state.setFromValue(propertyValue || []); //goog.vec.Vec3.createFromArray( propertyValue || [] );
                            node.transform.scale = goog.vec.Vec3.clone(scale);
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
                            if (propertyValue.includes(',')){
                                newClasses = propertyValue.split(',');
                            } else {
                                newClasses = propertyValue.split(' ')
                            }
                            
                               // let newClasses = propertyValue.split(','); //trim()
                                aframeObject.setAttribute('class',"");
                                newClasses.forEach(el=>{
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

                if (value === undefined && aframeObject.nodeName == "A-SKY") {
                    value = propertyValue;

                    self.aframeDef['A-SKY'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })
                }

                if (value === undefined && aframeObject.nodeName == "A-TEXT") {
                    value = propertyValue;

                    self.aframeDef['A-TEXT'].filter(el=>el !== 'font').forEach(element => {

                       
                            element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                        
                    })

                    // if(propertyName == 'font'){
                    //     console.log('Loading font...', element);
                    // }

                }

                if (value === undefined && aframeObject.nodeName == "A-SCENE") {
                    value = propertyValue;

                    switch (propertyName) {

                        case "color":
                            aframeObject.setAttribute('background', { 'color': propertyValue });
                            break;

                        case "transparent":
                            aframeObject.setAttribute('background', { 'transparent': propertyValue });
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

                                let path = JSON.parse(localStorage.getItem('lcs_app')).path.public_path;
                                let worldName = path.slice(1);
                                let dbPath = propertyValue.split(".").join("_");

                                let userDB = _LCSDB.user(_LCS_WORLD_USER.pub);
                                userDB.get('worlds').get(worldName).get(dbPath).once(function(response) {
                                    if (response) {

                                        if (Object.keys(response).length > 0) {
                                        //console.log(JSON.parse(response));

                                        let assets = (typeof(response) == 'object') ? response: JSON.parse(response);
                                        for (var prop in assets) {
                                            var elm = document.createElement(assets[prop].tag);
                                            elm.setAttribute('id', prop);
                                            elm.setAttribute('src', assets[prop].src);
                                            assetsElement.appendChild(elm);

                                        }
                                    }

                                    }
                                });


                                // httpGetJson(propertyValue).then(function (response) {
                                //     console.log(JSON.parse(response));
                                //     let assets = JSON.parse(response);
                                //     for (var prop in assets) {
                                //         var elm = document.createElement(assets[prop].tag);
                                //         elm.setAttribute('id', prop);
                                //         elm.setAttribute('src', assets[prop].src);
                                //         assetsElement.appendChild(elm);

                                //     }

                                // }).catch(function (error) {
                                //     console.log(error);
                                // });

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

                if (value === undefined && aframeObject.nodeName == "A-CYLINDER") {
                    value = propertyValue;

                    self.aframeDef['A-CYLINDER'].forEach(element => {
                        element == propertyName ? aframeObject.setAttribute(element, propertyValue) :
                            value = undefined;
                    })
                }

                if (value === undefined && aframeObject.nodeName == "A-CONE") {
                    value = propertyValue;

                    self.aframeDef['A-CONE'].forEach(element => {
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

                        case "position":
                            // var pos = aframeObject.getAttribute('position');
                            // if (pos !== undefined) {
                            //     value = pos//[pos.x, pos.y, pos.z]//AFRAME.utils.coordinates.stringify(pos);
                            // }

                            if (node.transform.position) {

                                if (node.transform.storedPositionDirty) {
                                    updateStoredTransformFor(node, 'position');
                                }

                                value = goog.vec.Vec3.clone(node.transform.position);
                                //value =  node.transform.position;
                            }
                            break;

                        case "rotation":

                            if (node.transform.rotation) {

                                if (node.transform.storedRotationDirty) {
                                    updateStoredTransformFor(node, 'rotation');
                                }

                                value = goog.vec.Vec3.clone(node.transform.rotation);

                                // var rot = aframeObject.getAttribute('rotation');
                                // if (rot !== undefined) {
                                //     value = rot//AFRAME.utils.coordinates.stringify(rot);
                                // }
                            }

                            break;


                        case "scale":

                            if (node.transform.scale) {

                                if (node.transform.storedScaleDirty) {
                                    updateStoredTransformFor(node, 'scale');
                                }

                                value = goog.vec.Vec3.clone(node.transform.scale);
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

                if (value === undefined && aframeObject.nodeName == "A-CYLINDER") {

                    self.aframeDef['A-CYLINDER'].forEach(element => {
                        if (element == propertyName) {
                            value = aframeObject.getAttribute(element);
                        }
                    })
                }

                if (value === undefined && aframeObject.nodeName == "A-CONE") {

                    self.aframeDef['A-CONE'].forEach(element => {
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


    function createAFrameObject(node, config) {
        var protos = node.prototypes;
        var aframeObj = undefined;

        if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/ascene.vwf")) {
            aframeObj = document.createElement('a-scene');
            let assetsElement = document.createElement('a-assets');
            aframeObj.appendChild(assetsElement);
            aframeObj.setAttribute('scene-utils', "");
            aframeObj.setAttribute('light', 'defaultLightsEnabled', false);
            //aframeObj.setAttribute('embedded', {});
            //aframeObj.setAttribute('loading-screen', "backgroundColor: black");
            self.state.scenes[node.ID] = aframeObj;
            //TODO: move from veiw here
            document.body.appendChild(aframeObj);

        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-asset-item.vwf")) {

            let assets = document.querySelector('a-assets');
            if (assets) {

                aframeObj = document.createElement('a-asset-item');
                aframeObj.setAttribute('id', "item-" + GUID());
                aframeObj.setAttribute('src', "");
                aframeObj.setAttribute('crossorigin', "anonymous");
                assets.appendChild(aframeObj);
            }

        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-asset-image-item.vwf")) {

            let assets = document.querySelector('a-assets');
            if (assets) {
                let elID = "item-" + GUID();
                aframeObj = document.createElement('img');
                aframeObj.setAttribute('id', elID);
                aframeObj.setAttribute('src', "");
                aframeObj.setAttribute('crossorigin', "anonymous");
                assets.appendChild(aframeObj);
            }

        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-asset-audio-item.vwf")) {

            let assets = document.querySelector('a-assets');
            if (assets) {

                aframeObj = document.createElement('audio');
                aframeObj.setAttribute('id', "item-" + GUID());
                aframeObj.setAttribute('src', "");
                aframeObj.setAttribute('crossorigin', "anonymous");
                assets.appendChild(aframeObj);
            }


        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-asset-video-item.vwf")) {

            let assets = document.querySelector('a-assets');
            if (assets) {

                aframeObj = document.createElement('video');
                aframeObj.setAttribute('id', "item-" + GUID());
                aframeObj.setAttribute('src', "");
                aframeObj.setAttribute('crossorigin', "anonymous");
                aframeObj.setAttribute('autoplay', "");
                aframeObj.setAttribute('loop', true);

                assets.appendChild(aframeObj);
            }

        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/asky.vwf")) {
            aframeObj = document.createElement('a-sky');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-arjs-anchor.vwf")) {
            aframeObj = document.createElement('a-anchor');
        
        }  else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/alight.vwf")) {
            aframeObj = document.createElement('a-light');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acursor.vwf")) {
            aframeObj = document.createElement('a-cursor');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/a-sun-sky.vwf")) {
            aframeObj = document.createElement('a-sun-sky');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/abox.vwf")) {
            aframeObj = document.createElement('a-box');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aplane.vwf")) {
            aframeObj = document.createElement('a-plane');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acylinder.vwf")) {
            aframeObj = document.createElement('a-cylinder');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acone.vwf")) {
            aframeObj = document.createElement('a-cone');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/atext.vwf")) {
            aframeObj = document.createElement('a-text');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acolladamodel.vwf")) {
            aframeObj = document.createElement('a-collada-model');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aobjmodel.vwf")) {
            aframeObj = document.createElement('a-obj-model');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/agltfmodel.vwf")) {
            aframeObj = document.createElement('a-gltf-model');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/asphere.vwf")) {
            aframeObj = document.createElement('a-sphere');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aanimation.vwf")) {
            aframeObj = document.createElement('a-animation');
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/acamera.vwf")) {
            aframeObj = document.createElement('a-camera');
            aframeObj.setAttribute('camera', 'active', false);
        } else if (self.state.isAFrameClass(protos, "http://vwf.example.com/aframe/aentity.vwf")) {
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
                node.scene = self.state.scenes[self.kernel.application()];
            }

        }

    }


    function updateStoredTransform(node) {

        if (node && node.aframeObj) {
            // Add a local model-side transform that can stay pure even if the view changes the
            // transform on the threeObject - this already happened in creatingNode for those nodes that
            // didn't need to load a model
            node.transform = {};

            //let pos = node.aframeObj.object3D.position;
            let pos = (new THREE.Vector3()).copy(node.aframeObj.object3D.position);
            node.transform.position = goog.vec.Vec3.createFromValues(pos.x, pos.y, pos.z);

            //node.transform.position = AFRAME.utils.coordinates.stringify(node.aframeObj.object3D.position);
            node.transform.rotation = AFRAME.utils.coordinates.stringify(node.aframeObj.object3D.rotation);
            node.storedTransformDirty = false;
        }

    }


    function updateStoredTransformFor(node, propertyName) {

        if (node && node.aframeObj) {
            // Add a local model-side transform that can stay pure even if the view changes the
            // transform on the threeObject - this already happened in creatingNode for those nodes that
            // didn't need to load a model
            if (!node.transform)
                node.transform = {};

            if (propertyName == 'position') {
                let pos = (new THREE.Vector3()).copy(node.aframeObj.object3D.position);
                node.transform.position = goog.vec.Vec3.createFromValues(pos.x, pos.y, pos.z);
                node.transform.storedPositionDirty = false;
            }

            if (propertyName == 'rotation') {
                // let rot = (new THREE.Vector3()).copy(node.aframeObj.object3D.rotation);
                let rot = node.aframeObj.getAttribute('rotation');
                node.transform.rotation = goog.vec.Vec3.createFromValues(rot.x, rot.y, rot.z);
                node.transform.storedRotationDirty = false;
            }

            if (propertyName == 'scale') {
                let scale = (new THREE.Vector3()).copy(node.aframeObj.object3D.scale);
                node.transform.scale = goog.vec.Vec3.createFromValues(scale.x, scale.y, scale.z);
                node.transform.storedScaleDirty = false;
            }

            //node.transform.position = AFRAME.utils.coordinates.stringify(node.aframeObj.object3D.position);

            // node.transform.rotation = AFRAME.utils.coordinates.stringify(node.aframeObj.object3D.rotation);
            // node.storedTransformDirty = false;             
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

