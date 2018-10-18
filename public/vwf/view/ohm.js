"use strict";
/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/
// VWF & Ohm view driver

define(["module", "vwf/view"], function (module, view) {

    return view.load(module, {

        // == Module Definition ====================================================================

        initialize: function (options) {
            var self = this;
            this.nodes = {};

         
        },

        // initializedNode: function( nodeID, childID ) {
        // },

        createdProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        initializedProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        satMethod: function (nodeId, methodName) {

            var self = this;

             var node = this.state.nodes[ nodeId ];

            if ( !( node && node.lang) ) {
                return;
            }
                 if (methodName.indexOf("Operation") > -1) {


                  //self.kernel.callMethod (nodeId, methodName);
                   self.kernel.setProperty(nodeId, 'ohmLang', node.lang.source);
                    console.log("set new lang properties");
                 }

        },

        // createdMethod: function( nodeId, methodName, methodParameters, methodBody) {

        //     var self = this;
        //      var node = this.state.nodes[ nodeId ];
        //     if ( !( node && node.lang) ) {
        //         return;
        //     }

        //     if (methodName.indexOf("Operation") > -1) {

        //         console.log("add semantic operations");
        //           self.kernel.callMethod (nodeId, methodName);

        //          }

        // },

        satProperty: function (nodeId, propertyName, propertyValue) {
           
            var self = this;
             var node = this.state.nodes[ nodeId ];
            if ( !( node && node.lang) ) {
                return;
            }
            var lang = node.lang;
            switch (propertyName) {
                case "ohmLang":
                    if (propertyValue) {
                        self.kernel.callMethod (nodeId, 'initLang');
                    }
                    break;
            }

        },

        // firedEvent: function (nodeID, eventName, eventParameters) {
        // },


        // ticked: function (vwfTime) {
        // }

    });

   

});
