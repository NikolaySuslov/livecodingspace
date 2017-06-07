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

    return view.load(module, {

        // == Module Definition ====================================================================

        initialize: function (options) {
            var self = this;
            this.nodes = {};

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
                createAvatar(childID);
                createAvatarControl(scene);
            }

            //  let avatarCameraID = 'camera-avatar-' + self.kernel.moniker();
            // if (childID == avatarCameraID && ) {
            //     let avatarCameraEl = document.querySelector('#'+ avatarCameraID);
            //      avatarCameraEl.setAttribute('camera', 'active', true);
            // }


        },

        createdProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        initializedProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        satProperty: function (nodeId, propertyName, propertyValue) {
            var self = this;

             var node = this.state.nodes[ nodeId ];

            if ( !( node && node.aframeObj ) ) {
                return;
            }

            var aframeObject = node.aframeObj;
            switch (propertyName) {

                case "activeForAvatar":
                    console.log("sat to active!");
                     //let avatarCameraID = 'camera-avatar-' + self.kernel.moniker();
                    //node.aframeObj.setAttribute('camera', 'active', propertyValue);
                     let avatarCameraEl = document.querySelector('#camera-avatar-'+ self.kernel.moniker());
                        //avatarCameraEl.setAttribute('camera', 'active', false);
                        //avatarCameraEl.setAttribute('camera', 'userHeight', 0.0);
                        document.querySelector('#avatarControl').setAttribute('camera', 'active', true);


                    break;

                case "clickable":
                    if (propertyValue) {
                        aframeObject.addEventListener('click', function (evt) {
                            vwf_view.kernel.fireEvent(nodeId, "clickEvent")
                        })
                    }
                    break;
            }
        },

        firedEvent: function (nodeID, eventName, eventParameters) {
            //var avatarID = vwf_view.kernel.find("", avatarName)

            var avatarName = 'avatar-' + self.kernel.moniker();
            if (eventName == "setAvatarPosition") {
                vwf_view.kernel.setProperty(avatarName, "position", [eventParameters.x, eventParameters.y, eventParameters.z]);
            }
            if (eventName == "setAvatarRotation") {
                vwf_view.kernel.setProperty(avatarName, "rotation", [eventParameters.x, eventParameters.y, eventParameters.z]);
            }

             if (eventName == "setPosition") {
                vwf_view.kernel.setProperty(avatarName, "position", [eventParameters.x, eventParameters.y, eventParameters.z]);
            }

        },

        // ticked: function (vwfTime) {
        // }

    });

    function createAvatarControl(aScene) {

        let avatarName = 'avatar-' + self.kernel.moniker();

        let controlEl = document.createElement('a-camera');
        controlEl.setAttribute('id', 'avatarControl');
        controlEl.setAttribute('wasd-controls', {});
        controlEl.setAttribute('look-controls', {});
        aScene.appendChild(controlEl);
        console.log(document.querySelector('#avatarControl').components);

        controlEl.addEventListener('componentchanged', function (evt) {

        if (evt.detail.name === 'position') {
            var eventParameters = evt.detail.newData;
             vwf_view.kernel.setProperty(avatarName, "position", [eventParameters.x, eventParameters.y, eventParameters.z]);
            //self.kernel.fireEvent(node.parentID, "setPosition", evt.detail.newData);

        }

         if (evt.detail.name === 'rotation') {
            var eventParameters = evt.detail.newData;
               vwf_view.kernel.setProperty(avatarName, "rotation", [eventParameters.x, eventParameters.y, eventParameters.z]);
            //self.kernel.fireEvent(node.parentID, "setPosition", evt.detail.newData);

        }

    });

        vwf_view.kernel.setProperty('camera-'+avatarName, "activeForAvatar", true);

        //let avatarCameraEl = document.querySelector('#camera-'+ avatarName);
       // avatarCameraEl.setAttribute('active', true);

    }

    function createAvatar(nodeID) {

        let avatarID = self.kernel.moniker();
        var nodeName = 'avatar-' + avatarID;


        var newNode = {
            "id": nodeName,
            "uri": nodeName,
            "extends": "http://vwf.example.com/aframe/avatar.vwf",
            "children": {
                  "cursor": {
                            "extends": "http://vwf.example.com/aframe/acursor.vwf",
                        },
                "camera": {
                    "id": 'camera-' + nodeName,
                    "extends": "http://vwf.example.com/aframe/acamera.vwf",
                    "properties": {
                        "forAvatar": true,
                        "look-controls-enabled": false,
                        "wasd-controls": false
                    }
                }
            }
        }

        vwf_view.kernel.createChild(nodeID, nodeName, newNode);
        vwf_view.kernel.callMethod(nodeName, "createAvatarBody");
        
    }

});
