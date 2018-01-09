"use strict";

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
/// @module vwf/model/scenejs
/// @requires vwf/model

define(["module", "vwf/model", "vwf/utility"], function (module, model, utility) {

    var self;

    // vwf/model/example/scene.js is a demonstration of a scene manager.

    return model.load(module, {

        // == Module Definition ====================================================================

        // -- pipeline -----------------------------------------------------------------------------

        // pipeline: [ log ], // vwf <=> log <=> scene

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
                            found = (prototypes[i] === "http://vwf.example.com/aframe/componentNode.vwf");
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

            if (this.state.isComponentNode(protos)) {

                // Create the local copy of the node properties
                if (this.state.nodes[childID] === undefined) {
                    this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                        childSource, childType, childIndex, childName, callback);
                }

                node = this.state.nodes[childID];
                node.prototypes = protos;

                //node.aframeObj = createAFrameObject(node);
                node.aframeObj = setAFrameObject(node);
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

            var node = this.state.nodes[nodeID];
            var value = undefined;

            if (node && node.aframeObj && utility.validObject(propertyValue)) {

                var aframeObject = node.aframeObj;

                if (isComponentNodeDefinition(node.prototypes)) {


                    value = propertyValue;
                    switch (propertyName) {

                        default:
                            value = undefined;
                            break;
                    }

                }


                if (value === undefined && isComponentDefinition(node.prototypes)) {

                    value = propertyValue;

                    switch (propertyName) {


                        case "compName":

                            break;

                        default:
                            value = undefined;
                            break;
                    }
                }

                if (value === undefined && isAViewOffsetCameraDefinition(node.prototypes)) {
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

                if (value === undefined && isAMaterialDefinition(node.prototypes)) {
                    if (aframeObject.el.getAttribute(aframeObject.compName)) {

                        value = propertyValue;
                        let parentNodeAF = aframeObject.el;
                        let defs = ['color', 'transparent', 'opacity'];

                        defs.forEach(element => {
                            element == propertyName ? parentNodeAF.setAttribute('material', element, propertyValue) :
                                value = undefined;
                        })

                    


                    }
                }


                if (value === undefined && isARayCasterDefinition(node.prototypes)) {
                    if (aframeObject.el.getAttribute(aframeObject.compName)) {

                        value = propertyValue;
                        let parentNodeAF = aframeObject.el;
                        let defs = ['direction', 'far', 'interval', 'near', 'objects', 'origin', 'recursive', 'showLine', 'useWorldCoordinates'];

                        defs.forEach(element => {
                            element == propertyName ? parentNodeAF.setAttribute('raycaster', element, propertyValue) :
                                value = undefined;
                        })
                    }
                }

                if (value === undefined && aframeObject.el.getAttribute(aframeObject.compName)) {
                    
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

                                            default:
                                                value = undefined;
                                                break;
                    
                    
                                        }
                    
                                    }


                //isALineDefinition(node.prototypes)
                //if (value === undefined && node.componentName == 'line') { //isALineDefinition( node.prototypes )
                if (node.extendsID == "http://vwf.example.com/aframe/lineComponent.vwf") {
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

                if (value === undefined && aframeObject.el.getAttribute(aframeObject.compName)) {

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


                if (value === undefined && aframeObject.el.getAttribute(aframeObject.compName)) {

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

                        default:
                            value = undefined;
                            break;


                    }

                }

                if (value === undefined && aframeObject.el.getAttribute(aframeObject.compName)) {
                    
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

                if (value === undefined && aframeObject.el.getAttribute(aframeObject.compName)) {

                    value = propertyValue;

                    //let parentNodeAF = self.state.kernel.find(node.parentID);

                    // aframeObject.el.setAttribute('line', 'color')
                    let parentNodeAF = aframeObject.el;

                    switch (propertyName) {

                        case "armModel":

                            parentNodeAF.setAttribute(aframeObject.compName, { armModel: propertyValue });
                            break;

                        case "buttonColor":

                            parentNodeAF.setAttribute(aframeObject.compName, { buttonColor: propertyValue });
                            break;

                        case "buttonTouchedColor":

                            parentNodeAF.setAttribute(aframeObject.compName, 'buttonTouchedColor', propertyValue);
                            break;

                        case "buttonHighlightColor":
                            parentNodeAF.setAttribute(aframeObject.compName, 'buttonHighlightColor', propertyValue);
                            break;

                        case "hand":

                            parentNodeAF.setAttribute(aframeObject.compName, 'hand', propertyValue);
                            break;

                        case "model":

                            parentNodeAF.setAttribute(aframeObject.compName, 'model', propertyValue);
                            break;

                        case "rotationOffset":

                            parentNodeAF.setAttribute(aframeObject.compName, 'rotationOffset', propertyValue);
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

                if (isComponentNodeDefinition(node.prototypes)) {
                    switch (propertyName) {
                    }
                }

                if (value === undefined && isComponentDefinition(node.prototypes)) {

                    switch (propertyName) {

                        case "compName":

                            break;
                    }
                }

                // isALineDefinition( node.prototypes ) aframeObject.compName == compName



                if (value === undefined && isARayCasterDefinition(node.prototypes)) {
                    value = propertyValue;

                    let parentNodeAF = aframeObject.el;
                    let defs = ['direction', 'far', 'interval', 'near', 'objects', 'origin', 'recursive', 'showLine', 'useWorldCoordinates'];

                    defs.forEach(element => {
                        if (element == propertyName) {
                            let val = parentNodeAF.getAttribute('raycaster').element;
                            value = AFRAME.utils.coordinates.isCoordinates(val) ? AFRAME.utils.coordinates.stringify(val) : val
                        }
                    })
                }


                if (value === undefined && isALineDefinition(node.prototypes)) {
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


                if (value === undefined && isAAnimMixerDefinition(node.prototypes)) {
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

                if (value === undefined && isAMaterialDefinition(node.prototypes)) {
                    value = propertyValue;

                    // let parentNodeAF = self.state.nodes[node.parentID].aframeObj;
                    let parentNodeAF = aframeObject.el;

                    switch (propertyName) {

                        case "color":
                            value = parentNodeAF.getAttribute('material').color;
                            break;

                        case "opacity":
                            value = parentNodeAF.getAttribute('material').opacity;
                            break;

                            case "transparent":
                            value = parentNodeAF.getAttribute('material').transparent;
                            break;
                        

                    }

                }

                if (value === undefined && isALinePathDefinition(node.prototypes)) {
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
                        

                    }

                }

                if (value === undefined && isAViewOffsetCameraDefinition(node.prototypes)) {
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


                if (value === undefined && isAInterpolationDefinition(node.prototypes)) {
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

                    }

                }

                if (value === undefined && isAGizmoDefinition(node.prototypes)) {
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


    function getPrototypes(kernel, extendsID) {
        var prototypes = [];
        var id = extendsID;

        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }
        return prototypes;
    }



    function isAAnimMixerDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/anim-mixer-component.vwf");
            }
        }
        return found;
    }

    function isAInterpolationDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/interpolation-component.vwf");
            }
        }
        return found;
    }

    function isALinePathDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/linepath.vwf");
            }
        }
        return found;
    }

    function isAMaterialDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/aMaterialComponent.vwf");
            }
        }
        return found;
    }

    function isAViewOffsetCameraDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/viewOffsetCamera-component.vwf");
            }
        }
        return found;
    }


    function isAGizmoDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/gizmoComponent.vwf");
            }
        }
        return found;
    }

    function isARayCasterDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/raycasterComponent.vwf");
            }
        }
        return found;
    }

    function isALineDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/lineComponent.vwf");
            }
        }
        return found;
    }

    function isGearVRControlsDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/gearvr-controlsComponent.vwf");
            }
        }
        return found;
    }

    function isComponentNodeDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/componentNode.vwf");
            }
        }
        return found;
    }

    function isComponentDefinition(prototypes) {
        var found = false;
        if (prototypes) {
            for (var i = 0; i < prototypes.length && !found; i++) {
                found = (prototypes[i] == "http://vwf.example.com/aframe/aentityComponent.vwf");
            }
        }
        return found;
    }


    function setAFrameObject(node, config) {
        var protos = node.prototypes;
        var aframeObj = {};
        var sceneEl = document.querySelector('a-scene');

        aframeObj.id = node.parentID;
        aframeObj.el = sceneEl.children[node.parentID];
        aframeObj.el = Array.from(sceneEl.querySelectorAll('*')).filter(item => { return item.id == aframeObj.id })[0];


        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/lineComponent.vwf")) {
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

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/gizmoComponent.vwf")) {
            
            
                        // aframeObj.el.setAttribute(node.type, {});
                        aframeObj.compName = "gizmo";
                        aframeObj.el.setAttribute(aframeObj.compName, {});
            
                    }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/raycasterComponent.vwf")) {


            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "raycaster";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/viewOffsetCamera-component.vwf")) {
            
            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "viewoffset";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/streamSoundComponent.vwf")) {
            
            
            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "streamsound";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/linepath.vwf")) {
            
            
                        // aframeObj.el.setAttribute(node.type, {});
                        aframeObj.compName = "linepath";
                        aframeObj.el.setAttribute(aframeObj.compName, {});
            
                    }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/aMaterialComponent.vwf")) {

            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "material";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/interpolation-component.vwf")) {


            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "interpolation";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/anim-mixer-component.vwf")) {


            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "animation-mixer";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/app-envmap-component.vwf")) {


            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "envmap";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }


        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/app-avatarbvh-component.vwf")) {


            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "avatarbvh";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/app-sun-component.vwf")) {
            
 
                // aframeObj.el.setAttribute(node.type, {});
             aframeObj.compName = "sun";
             aframeObj.el.setAttribute('id', "sun");
             aframeObj.el.setAttribute(aframeObj.compName, {});
 
         }

         if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/app-skyshader-component.vwf")) {
            
 
                // aframeObj.el.setAttribute(node.type, {});
             aframeObj.compName = "skyshader";
             aframeObj.el.setAttribute(aframeObj.compName, {});
 
         }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/app-raycaster-listener-component.vwf")) {


            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "raycaster-listener";
            aframeObj.el.setAttribute(aframeObj.compName, {});

        }

        if (self.state.isComponentClass(protos, "http://vwf.example.com/aframe/app-cursor-listener-component.vwf")) {


            // aframeObj.el.setAttribute(node.type, {});
            aframeObj.compName = "cursor-listener";
            aframeObj.el.setAttribute(aframeObj.compName, {});

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

                }
            }


        }

    }

});
