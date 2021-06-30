/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & TWO JS model driver

import { Fabric } from '/core/vwf/fabric.js';

class TwoModel extends Fabric {

    constructor(module) {

        console.log("TwoModel constructor");
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
                                    found = (prototypes[i] === "proxy/two/node.vwf");
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
                        isTwoTextureDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/texture.vwf");
                                }
                            }
                            return found;
                        },
                        isTwoRectangleDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/rectangle.vwf");
                                }
                            }
                            return found;
                        },
                        isTwoCurveDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/curve.vwf");
                                }
                            }
                            return found;
                        },
                        isTwoEllipseDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/ellipse.vwf");
                                }
                            }
                            return found;
                        },
                        isTwoAnchorDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/anchor.vwf");
                                }
                            }
                            return found;
                        },
                        isTwoGroupDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/group.vwf");
                                }
                            }
                            return found;
                        },
                        isTwoPathDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/path.vwf");
                                }
                            }
                            return found;
                        },
                        isTwoTextDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/two/text.vwf");
                                }
                            }
                            return found;
                        },

                        setFromValue: function (propertyValue) {

                            var value = []; //goog.vec.Vec3.create();
                            if (Array.isArray(propertyValue) || propertyValue instanceof Float32Array) {
                                value = propertyValue;
                            } else if (typeof propertyValue === 'string') {

                                if (propertyValue.includes(',')) {
                                    value = propertyValue.split(',').map(el => { return parseFloat(el) })
                                }
                            }

                            return value
                        },

                        createObject: function (node, config) {

                            var protos = node.prototypes;
                            var obj = undefined;

                            if (this.isClass(protos, "proxy/two/scene.vwf")) {

                                // Make an instance of two and place it on the page.
                                // let el = document.createElement("space");
                                // document.querySelector("body").appendChild(el);

                                // let params = { width: 800, height: 600 };
                                // obj = new Two(params).appendTo(el);

                                obj = new Two({
                                    type: Two.Types.webgl, //webgl
                                    fullscreen: true,
                                    autostart: true
                                }).appendTo(document.body);

                                obj.renderer.domElement.style.position = 'absolute';
                                obj.renderer.domElement.style.top = 0;
                                obj.renderer.domElement.style.left = 0;


                                obj.nodeName = "space";
                                obj.nodeID = node.ID;
                                this.scenes[node.ID] = node;


                            }

                            if (this.isTwoRectangleDefinition(protos)) {

                                obj = new Two.Rectangle(0, 0, 10, 10);
                                obj.nodeName = "rectangle";
                                obj.nodeID = node.ID;

                            }


                            if (this.isTwoTextDefinition(protos)) {

                                obj = new Two.Text();
                                obj.nodeName = "text";
                                obj.nodeID = node.ID;

                            }

                            if (this.isTwoAnchorDefinition(protos)) {

                                obj = new Two.Anchor();
                                obj.nodeName = "anchor";
                                obj.nodeID = node.ID;

                            }


                            if (this.isTwoEllipseDefinition(protos)) {

                                obj = new Two.Ellipse(0, 0, 10);
                                obj.nodeName = "ellipse";
                                obj.nodeID = node.ID;

                            }

                            if (this.isTwoGroupDefinition(protos)) {

                                obj = new Two.Group();
                                obj.nodeName = "group";
                                obj.nodeID = node.ID;

                            }

                            if (this.isTwoCurveDefinition(protos)) {

                                obj = new Two.Path();
                                obj.nodeName = "path";
                                obj.nodeID = node.ID;

                            }

                            if (this.isTwoTextureDefinition(protos)) {

                                obj = new Two.Texture();
                                obj.nodeName = "texture";
                                obj.nodeID = node.ID;

                            }

                            return obj
                        },
                        addNodeToHierarchy: function (node) {

                            if (node.obj) {

                                if (this.nodes[node.parentID] !== undefined) {
                                    var parent = this.nodes[node.parentID];
                                    if (parent.obj) {

                                        if (parent.children === undefined) {
                                            parent.children = [];
                                        }
                                        parent.children.push(node.ID);
                                        //console.info( "Adding child: " + childID + " to " + nodeID );
                                        if (node.obj.nodeName !== "texture" && node.obj.nodeName !== "anchor") {
                                            parent.obj.add(node.obj);
                                        }
                                    }
                                }

                                if (node.obj.nodeName !== "space") {
                                    node.scene = this.scenes[self.kernel.application()];
                                    // if(node.parentID == self.kernel.application()){
                                    //     node.scene.obj.add(node.obj);
                                    // }
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

                            if (childNode.obj !== undefined) {
                                // removes and destroys object

                                //let space = childNode.scene.obj;
                                childNode.obj.parent.remove(childNode.obj);
                                childNode.obj = undefined;
                            }

                            delete this.state.nodes[nodeID];
                        }

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

                //callingMethod

                callingMethod: function (nodeID, methodName, methodParameters) {

                    let self = this;
                    var node = this.state.nodes[nodeID];

                    if (!node) return;

                    if (node && node.obj) {



                        if (methodName == "getJointsAtTime") {

                            let time = methodParameters[0];
                            return node.motionData[time];

                        }

                        if (methodName == "getJointAtTime") {

                            let time = methodParameters[0];
                            let jointID = methodParameters[1];

                            return node.motionData[time][jointID];

                        }


                    }
                },


                // -- creatingProperty ---------------------------------------------------------------------

                creatingProperty: function (nodeID, propertyName, propertyValue) {
                    return this.initializingProperty(nodeID, propertyName, propertyValue);
                },


                // -- settingProperty ----------------------------------------------------------------------

                settingProperty: function (nodeID, propertyName, propertyValue) {

                    let self = this;
                    let node = this.state.nodes[nodeID];
                    var value = undefined;

                    if (node && node.obj && _self_.utility.validObject(propertyValue)) {

                        let object = node.obj;

                        if (value === undefined && self.state.isTwoGroupDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {

                                case "x":

                                    object.translation.x = propertyValue
                                    break;

                                case "y":
                                    object.translation.y = propertyValue
                                    break;

                                case "translation":
                                    let translation = this.state.setFromValue(propertyValue);
                                    object.translation.set(translation[0], translation[1])
                                    break;

                                case "rotation":
                                    object.rotation = propertyValue
                                    break;

                                case "scale":
                                    object.scale = propertyValue
                                    break;

                                case "opacity":
                                    object.opacity = propertyValue
                                    break;

                                // case "mask":
                                //     object.mask = propertyValue
                                // break;


                                case "visible":
                                    object.visible = propertyValue
                                    break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }




                        if (value === undefined && self.state.isTwoTextDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {

                                case "translation":

                                    let translation = this.state.setFromValue(propertyValue);
                                    object.translation.set(translation[0], translation[1])
                                    break;

                                case "rotation":
                                    object.rotation = propertyValue
                                    break;

                                case "scale":
                                    object.scale = propertyValue
                                    break;

                                case "fill":

                                    object.fill = propertyValue


                                    break;

                                case "stroke":
                                    object.stroke = propertyValue
                                    break;

                                case "linewidth":

                                    object.linewidth = propertyValue
                                    break;

                                case "opacity":
                                    object.opacity = propertyValue
                                    break;

                                case "text":
                                    object.value = propertyValue
                                    break;

                                case "family":
                                    object.family = propertyValue
                                    break;


                                case "size":
                                    object.size = propertyValue
                                    break;


                                case "style":
                                    object.style = propertyValue
                                    break;

                                case "weight":
                                    object.weight = propertyValue
                                    break;

                                case "visible":
                                    object.visible = propertyValue
                                    break;
                                // "text": null,
                                // "family": null,
                                // "size": null,
                                // "style": null,
                                // "weight": null,
                                // "visible": null,


                                default:
                                    value = undefined;
                                    break;
                            }
                        }


                        if (value === undefined && self.state.isTwoPathDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {

                                case "x":

                                    object.translation.x = propertyValue
                                    break;

                                case "y":
                                    object.translation.y = propertyValue
                                    break;

                                case "translation":

                                    object.translation.set(propertyValue[0], propertyValue[1])
                                    break;

                                case "rotation":
                                    object.rotation = propertyValue
                                    break;

                                case "scale":
                                    object.scale = propertyValue
                                    break;

                                case "fill":

                                    if (propertyValue.includes('https') || propertyValue.startsWith('/')) {
                                        let name = propertyValue//.split('=')[1];
                                        if (name.includes('webm') || name.includes('mp4')) {
                                            var video = document.createElement('video');
                                            video.src = name;
                                            video.autoplay = false;
                                            video.loop = true;
                                            video.muted = true;

                                            object.fill = new Two.Texture(video);
                                            node.fillType = "video";
                                        } else {
                                            let texture = new Two.Texture(name);
                                            object.fill = texture
                                            node.fillType = "image";
                                        }

                                    } else {
                                        object.fill = propertyValue
                                        node.fillType = "color";
                                    }


                                    break;

                                case "stroke":
                                    object.stroke = propertyValue
                                    break;

                                case "linewidth":

                                    object.linewidth = propertyValue
                                    break;

                                case "opacity":
                                    object.opacity = propertyValue
                                    break;

                                case "clip":
                                    object.clip = propertyValue
                                    break;

                                case "curved":
                                    object.curved = propertyValue
                                    break;

                                case "closed":
                                    object.closed = propertyValue
                                    break;

                                case "join":
                                    object.join = propertyValue
                                    break;

                                case "automatic":
                                    object.automatic = propertyValue
                                    break;

                                case "vertices":
                                    object.vertices = [];
                                    propertyValue.forEach(v => {
                                        let a = new Two.Anchor(v.x, v.y);
                                        object.vertices.push(a);
                                    })
                                    break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                        if (value === undefined && self.state.isTwoAnchorDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                case "x":

                                    object.x = propertyValue
                                    break;

                                case "y":
                                    object.y = propertyValue
                                    break;

                                case "command":
                                    object.command = propertyValue
                                    break;


                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                        if (value === undefined && self.state.isTwoRectangleDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                case "height":

                                    object.height = propertyValue
                                    break;

                                case "width":
                                    object.width = propertyValue
                                    break;



                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                        if (value === undefined && self.state.isTwoEllipseDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                case "height":

                                    object.height = propertyValue
                                    break;

                                case "width":
                                    object.width = propertyValue
                                    break;



                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                        if (value === undefined && self.state.isTwoTextureDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                case "src":

                                    object.src = propertyValue
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
                    let node = this.state.nodes[nodeID];
                    let value = undefined;
                    if (node && node.obj) {

                        let object = node.obj;

                        if (value === undefined && self.state.isTwoGroupDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "x":
                                    value = object.translation.x

                                    break;

                                case "y":
                                    value = object.translation.y
                                    break;

                                case "translation":
                                    let translation = [object.translation.x, object.translation.y]
                                    value = translation

                                    break;

                                case "rotation":
                                    value = object.rotation
                                    break;

                                case "scale":
                                    value = object.scale
                                    break;

                                case "opacity":
                                    value = object.opacity
                                    break;

                                case "twoWidth":
                                    value = node.scene.obj.width
                                    break;

                                case "twoHeight":
                                    value = node.scene.obj.height
                                    break;


                                case "visible":
                                    value = object.visible
                                    break;
                                // case "mask":
                                //     value =  object.mask
                                //    break;

                            }
                        }


                        if (value === undefined && self.state.isTwoTextDefinition(node.prototypes)) {

                            switch (propertyName) {


                                case "translation":
                                    let translation = [object.translation.x, object.translation.y]
                                    value = translation

                                    break;

                                case "rotation":
                                    value = object.rotation
                                    break;

                                case "scale":
                                    value = object.scale
                                    break;

                                case "fill":
                                    value = object.fill
                                    break;

                                case "text":
                                    value = object.value
                                    break;

                                case "family":
                                    value = object.family
                                    break;

                                case "size":
                                    value = object.size
                                    break;

                                case "stroke":
                                    value = object.stroke
                                    break;

                                case "linewidth":

                                    value = object.linewidth

                                    break;

                                case "opacity":
                                    value = object.opacity
                                    break;

                                case "style":
                                    value = object.style
                                    break;


                                case "weight":
                                    value = object.weight
                                    break;

                                case "visible":
                                    value = object.visible
                                    break;

                            }

                        }

                        if (value === undefined && self.state.isTwoPathDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "x":
                                    value = object.translation.x

                                    break;

                                case "y":
                                    value = object.translation.y
                                    break;



                                case "translation":
                                    let translation = [object.translation.x, object.translation.y]
                                    value = translation

                                    break;

                                case "rotation":
                                    value = object.rotation
                                    break;

                                case "scale":
                                    value = object.scale
                                    break;

                                case "fill":

                                    if (typeof object.fill == 'object' && object.fill.src) {
                                        value = object.fill.src
                                    } else {
                                        value = object.fill
                                    }


                                    break;

                                case "stroke":
                                    value = object.stroke
                                    break;

                                case "linewidth":

                                    value = object.linewidth

                                    break;

                                case "opacity":
                                    value = object.opacity
                                    break;

                                case "clip":
                                    value = object.clip
                                    break;


                                case "twoWidth":
                                    value = node.scene.obj.width
                                    break;

                                case "twoHeight":
                                    value = node.scene.obj.height
                                    break;

                                case "curved":
                                    value = object.curved
                                    break;

                                case "automatic":
                                    value = object.automatic
                                    break;

                                case "closed":
                                    value = object.closed
                                    break;

                                case "join":
                                    value = object.join
                                    break;

                                case "vertices":
                                    let anchors = object.vertices;
                                    let vertices = anchors.map(a => {
                                        return { x: a.x, y: a.y }
                                    })
                                    value = vertices
                                    break;

                            }
                        }

                        if (value === undefined && self.state.isTwoAnchorDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "x":
                                    value = object.x
                                    break;

                                case "y":
                                    value = object.y
                                    break;

                                case "command":
                                    value = object.command
                                    break;

                            }
                        }

                        if (value === undefined && self.state.isTwoRectangleDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "height":
                                    value = object.height
                                    break;

                                case "width":
                                    value = object.width
                                    break;

                            }
                        }

                        if (value === undefined && self.state.isTwoEllipseDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "height":
                                    value = object.height
                                    break;

                                case "width":
                                    value = object.width
                                    break;

                            }
                        }

                        if (value === undefined && self.state.isTwoTextureDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "src":
                                    value = object.src
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
    TwoModel as default
}
