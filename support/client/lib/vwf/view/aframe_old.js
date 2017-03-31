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

/// vwf/view/lesson creates a view interface for instruction text. 
/// 
/// @module vwf/view/aframe
/// @requires vwf/view

define( [ "module", "vwf/view", "jquery", "jquery-ui" ], function( module, view, $ ) {

    let aframeTypes = new Set(["a-camera", "a-entity", "a-box", "a-sphere", "a-sky"]);

    return view.load( module, {

        // == Module Definition ====================================================================

        initialize: function( options ) {
            var self = this;
            this.nodes = {};
            
            if ( typeof options == "object" ) {
 
                this.rootSelector = options[ "application-root" ];
            }
            else {
                this.rootSelector = options;
            }

            // Create AFrame example scene

            // var $aframediv = $( "<a-scene><a-sphere position='0 1.25 -1' radius='1.25' color='#EF2D5E'></a-sphere> <a-sky color='#ECECEC'></a-sky><a-entity position='0 0 3.8'><a-camera></a-camera></a-entity></a-scene>" );

            // $('body').append($aframediv);
        },
        
        createdNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */) {
            
            //the created node is a scene, and has already been added to the state by the model.
            //how/when does the model set the state object? 
            if ( this.state.scenes[ childID ] )
            {           
                document.body.append(this.state.scenes[childID].threeScene);
                
            } 

             if ( aframeTypes.has(childType)) {

            if(this.state.nodes[childID] && this.state.nodes[childID].threeObject instanceof AFRAME.AEntity) {
                this.nodes[childID] = {id:childID,extends:childExtendsID};

                let scene = this.state.scenes[this.state.nodes[childID].sceneID].threeScene;

                if (this.state.nodes[childID].parentID == this.state.nodes[childID].sceneID) {
                    scene.appendChild(this.state.nodes[childID].threeObject);
                } else {
                    this.state.nodes[nodeID].threeObject.appendChild(this.state.nodes[childID].threeObject);
                }
             }
             }


        },

        createdProperty: function( nodeId, propertyName, propertyValue ) {
            return this.satProperty( nodeId, propertyName, propertyValue );   
        },

        initializedProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty( nodeId, propertyName, propertyValue );
        },

        satProperty: function( nodeId, propertyName, propertyValue ) {
         
        },        
    } );


} );
