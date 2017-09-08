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

define(["module", "vwf/view"], function (module, view) {

    return view.load(module, {

        // == Module Definition ====================================================================

        initialize: function (options) {
            var self = this;
            this.nodes = {};

            this.state.appInitialized = false;
            
                        if (typeof options == "object") {
            
                            this.rootSelector = options["application-root"];
                        }
                        else {
                            this.rootSelector = options;
                        }
         
        },

        // initializedNode: function( nodeID, childID ) {
        // },

        createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */) {

            var node = this.state.nodes[childID];

            // If the "nodes" object does not have this object in it, it must not be one that
            // this driver cares about
            if (!node) {
                return;
            }


            if(this.state.nodes[childID]) {
                this.nodes[childID] = {id:childID,extends:childExtendsID};
            } 
            else if (this.state.nodes[childID] && this.state.nodes[childID].aframeObj) {
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
           
            var node = this.state.nodes[ nodeId ];
            
                        if ( !( node && node.aframeObj ) ) {
                            return;
                        }



            switch (propertyName) {
                case "color":
                    if (propertyValue) {
                       // self.kernel.callMethod (nodeId, 'initLang');
                       console.log("sat color "+ propertyValue)
                    }
                    break;
            }

        },

        // firedEvent: function (nodeID, eventName, eventParameters) {
        // },


        ticked: function (vwfTime) {

            

        }

    });

   

});
