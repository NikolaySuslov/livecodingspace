// VWF & OSC driver
// Copyright (c) 2018 Nikolai Suslov
// Krestianstvo.org MIT license (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
// VWF Apache License (https://github.com/NikolaySuslov/livecodingspace/blob/master/VWF_LICENSE.md)

define( [ "module", "vwf/model" ], function( module, model ) {

    // vwf/model/example/scene.js is a demonstration of a scene manager.

    return model.load( module, {

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

            if (methodName == 'sendOSC') {

                if (this.osc == null) {
                    this.osc = _OSCManager;
                }

                // var msg = {
                //     address: "/hello/from/oscjs",
                //     args: [Math.random()]
                // };
                this.osc.port.send(methodParameters);

                console.log('send: ' + methodParameters);

            }

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

} );
