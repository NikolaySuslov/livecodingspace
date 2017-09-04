"use strict";

// VWF & A-Frame view driver
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

/// vwf/view/lesson creates a view interface for instruction text. 
/// 
/// @module vwf/view/aframe
/// @requires vwf/view

define(["module", "vwf/view", "jquery", "jquery-ui"], function (module, view, $) {
    var self;

    return view.load(module, {

        // == Module Definition ====================================================================

        initialize: function (options) {
            self = this;
            this.nodes = {};

            this.state.appInitialized = false;

            if (typeof options == "object") {

                this.rootSelector = options["application-root"];
            }
            else {
                this.rootSelector = options;
            }

         
        },

        createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */) {

            var node = this.state.nodes[childID];

            // If the "nodes" object does not have this object in it, it must not be one that
            // this driver cares about
            if (!node) {
                return;
            }

            if (this.state.scenes[childID]) {
                let scene = this.state.scenes[childID];

                document.body.append(scene);
                createAvatarControl(scene);
                createAvatar(childID);
               // this.state.appInitialized  = true;
            }

            if(this.state.nodes[childID] && this.state.nodes[childID].aframeObj.object3D instanceof THREE.Object3D) {
                this.nodes[childID] = {id:childID,extends:childExtendsID};
            }

        },


        initializedNode: function( nodeID, childID ) {

            var node = this.state.nodes[childID];
            if (!node) {
                return;
            }

        },

        createdProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        initializedProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        satProperty: function (nodeId, propertyName, propertyValue) {
            var selfs = this;

             var node = this.state.nodes[ nodeId ];

            if ( !( node && node.aframeObj ) ) {
                return;
            }

            var aframeObject = node.aframeObj;
            switch (propertyName) {
                case "clickable":
                    if (propertyValue) {
                        aframeObject.addEventListener('click', function (evt) {
                            let cursorID = 'cursor-avatar-'+selfs.kernel.moniker();
                           if (evt.detail.cursorEl.id == cursorID) {
                                vwf_view.kernel.fireEvent(nodeId, "clickEvent")
                           }
                        });
                    }
                    break;
            }
        },

        firedEvent: function (nodeID, eventName, eventParameters) {
            //var avatarID = vwf_view.kernel.find("", avatarName)

            var avatarName = 'avatar-' + self.kernel.moniker();

            if (eventName == "setAvatarRotation") {
                vwf_view.kernel.setProperty(avatarName, "rotation", [eventParameters.x, eventParameters.y, eventParameters.z]);
            }

             if (eventName == "setAvatarPosition") {
                vwf_view.kernel.setProperty(avatarName, "position", [eventParameters.x, eventParameters.y, eventParameters.z]);
            }
        },

        ticked: function (vwfTime) {

            updateAvatarPosition();
           
            //lerpTick ()
        }


    });


    function updateAvatarPosition() {

        let avatarName = 'avatar-' + self.kernel.moniker();
        let el = document.querySelector('#avatarControl');
        if (el) {
            let postion = el.getAttribute('position');
            let rotation = el.getAttribute('rotation');

            if ( postion && rotation) {
            vwf_view.kernel.setProperty(avatarName, "position", [postion.x, postion.y, postion.z]);
            vwf_view.kernel.setProperty(avatarName, "rotation", [rotation.x, rotation.y, rotation.z]);
            }
        }
    }

    function createAvatarControl(aScene) {

        let avatarName = 'avatar-' + self.kernel.moniker();

        let controlEl = document.createElement('a-camera');
       // controlEl.setAttribute('avatar', '');
        controlEl.setAttribute('id', 'avatarControl');
        controlEl.setAttribute('wasd-controls', {});
        controlEl.setAttribute('look-controls', {});
        controlEl.setAttribute('camera', 'active', true);
        aScene.appendChild(controlEl);

        let cursorEl = document.createElement('a-cursor');
        cursorEl.setAttribute('id', 'cursor-'+avatarName);
        cursorEl.setAttribute('raycaster', {objects: '.intersectable'});
        controlEl.appendChild(cursorEl);

        

       
    //     controlEl.addEventListener('componentchanged', function (evt) {
    //     if (evt.detail.name === 'position') {
    //         var eventParameters = evt.detail.newData;
    //          vwf_view.kernel.setProperty(avatarName, "position", [eventParameters.x, eventParameters.y, eventParameters.z]);
    //     }

    //      if (evt.detail.name === 'rotation') {
    //         var eventParameters = evt.detail.newData;
    //            vwf_view.kernel.setProperty(avatarName, "rotation", [eventParameters.x, eventParameters.y, eventParameters.z]);
    //     }

    // });

    }

    function createAvatar(nodeID) {

        let avatarID = self.kernel.moniker();
        var nodeName = 'avatar-' + avatarID;

        var newNode = {
            "id": nodeName,
            "uri": nodeName,
            "extends": "http://vwf.example.com/aframe/avatar.vwf"
        }
        
        vwf_view.kernel.createChild(nodeID, nodeName, newNode);
        vwf_view.kernel.callMethod(nodeName, "createAvatarBody");
    }

    

});
