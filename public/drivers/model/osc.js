/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & OSC model driver

import { Fabric } from '/core/vwf/fabric.js';

class OSCModel extends Fabric {

    constructor(module) {

        console.log("OSCModel constructor");
        super(module, "Model");
    }

    factory() {
        let _self_ = this;

        return this.load( this.module,
            {

                // == Module Definition ====================================================================
        
                // -- pipeline -----------------------------------------------------------------------------
        
                // pipeline: [ log ], // vwf <=> log <=> scene
        
                // -- initialize ---------------------------------------------------------------------------
        
                initialize: function() {
                 
                    this.objects = {}; // maps id => { property: value, ... }
        
                    self = this;
                    this.osc = null;
                    //window._OSCModel = this;
                },
        
                // == Model API ============================================================================
        
                // -- creatingNode -------------------------------------------------------------------------
        
                creatingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                    childSource, childType, childURI, childName, callback /* ( ready ) */ ) {
                },
        
                // -- deletingNode -------------------------------------------------------------------------
        
                deletingNode: function( nodeID ) {
                },
        
                // -- addingChild --------------------------------------------------------------------------
        
                addingChild: function( nodeID, childID, childName ) {
                },
        
                // -- removingChild ------------------------------------------------------------------------
        
                removingChild: function( nodeID, childID ) {
                },
        
                // -- parenting ----------------------------------------------------------------------------
        
                parenting: function( nodeID ) {
                },
        
                // -- childrening --------------------------------------------------------------------------
        
                childrening: function( nodeID ) {
                },
        
                // -- naming -------------------------------------------------------------------------------
        
                naming: function( nodeID ) {
                },
        
                // -- creatingProperty ---------------------------------------------------------------------
        
                creatingProperty: function( nodeID, propertyName, propertyValue ) {
                    // var object = this.objects[nodeID] || ( this.objects[nodeID] = {} );
                    // return object[propertyName] = propertyValue;
                },
        
                // -- initializingProperty -----------------------------------------------------------------
        
                initializingProperty: function( nodeID, propertyName, propertyValue ) {
                    // var object = this.objects[nodeID] || ( this.objects[nodeID] = {} );
                    // return object[propertyName] = propertyValue;
                },
        
                // TODO: deletingProperty
        
                // -- settingProperty ----------------------------------------------------------------------
        
                settingProperty: function( nodeID, propertyName, propertyValue ) {
                    // var object = this.objects[nodeID] || ( this.objects[nodeID] = {} );
                    // return object[propertyName] = propertyValue;
                },
        
                // -- gettingProperty ----------------------------------------------------------------------
        
                gettingProperty: function( nodeID, propertyName, propertyValue ) {
                    // var object = this.objects[nodeID];
                    // return object && object[propertyName];
                },
        
                // -- creatingMethod -----------------------------------------------------------------------
        
                creatingMethod: function( nodeID, methodName, methodParameters, methodBody ) {
                },
        
                // TODO: deletingMethod
        
                // -- callingMethod ------------------------------------------------------------------------
        
                callingMethod: function( nodeID, methodName, methodParameters ) {
        
                    // if (methodName == 'sendOSC') {
        
                    //     if (this.osc == null) {
                    //         this.osc = _OSCManager;
                    //     }
        
                    //     // var msg = {
                    //     //     address: "/hello/from/oscjs",
                    //     //     args: [Math.random()]
                    //     // };
                    //     this.osc.port.send(methodParameters);
        
                    //     console.log('send: ' + methodParameters);
        
                    // }
        
                },
        
                // -- creatingEvent ------------------------------------------------------------------------
        
                creatingEvent: function( nodeID, eventName, eventParameters ) {
                },
        
                // TODO: deletingEvent
        
                // -- firingEvent --------------------------------------------------------------------------
        
                firingEvent: function( nodeID, eventName, eventParameters ) {
                },
        
                // -- executing ----------------------------------------------------------------------------
        
                executing: function( nodeID, scriptText, scriptType ) {
                }
        
            } );
        }
        
    }

    export {
        OSCModel as default
      }
    