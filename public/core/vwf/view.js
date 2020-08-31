/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

/// FROM FABRIC.JS
/// vwf/view.js is the common implementation of all Virtual World Framework views. Views
/// interpret information from the simulation, present it to the user, and accept user input
/// influencing the simulation.
///
/// Views are outside of the simulation. Unlike models, they may accept external input--such as
/// pointer and key events from a user--but may only affect the simulation indirectly through the
/// synchronization server.
/// 
/// vwf/view and all deriving views are loaded as RequireJS (http://requirejs.org) modules.

/// @module vwf/kernel/view
/// @requires vwf/view

import { Fabric } from '/core/vwf/fabric.js';

class ViewKernel extends Fabric {

    constructor(module) {

        //console.log("ViewKernel constructor");
        super(module, "View")
        this.module = module;
        //this.view = this;

        // new Fabric({
        //     id:"vwf/view"
        // }, 'View');

    }

    factory(){

        return this.load( this.module, {

            // == Module Definition ====================================================================
            
        }, function( viewFunctionName ) {
    
            // == View API =============================================================================
    
            // The kernel bypasses vwf/kernel/view and calls directly into the first driver stage.
    
            return undefined;
    
        }, function( kernelFunctionName ) {
    
            // == Kernel API ===========================================================================
    
            switch ( kernelFunctionName ) {
    
                // -- Read-write functions -------------------------------------------------------------
    
                // TODO: setState
                // TODO: getState
                // TODO: hashState
    
                case "createNode":
    
                    return function( nodeComponent, nodeAnnotation, baseURI, when, callback /* nodeID */ ) {
    
                        // Interpret `createNode( nodeComponent, when, callback )` as
                        // `createNode( nodeComponent, undefined, undefined, when, callback )` and
                        // `createNode( nodeComponent, nodeAnnotation, when, callback )` as
                        // `createNode( nodeComponent, nodeAnnotation, undefined, when, callback )`.
                        // `nodeAnnotation` was added in 0.6.12, and `baseURI` was added in 0.6.25.
    
                        if ( typeof baseURI == "function" || baseURI instanceof Function ) {
                            callback = baseURI;
                            when = nodeAnnotation;
                            baseURI = undefined;
                            nodeAnnotation = undefined;
                        } else if ( typeof when == "function" || when instanceof Function ) {
                            callback = when;
                            when = baseURI;
                            baseURI = undefined;
                        }
    
                        // Make the call.
    
                        this.kernel.virtualTime.send( undefined, kernelFunctionName, undefined,
                            [ nodeComponent, nodeAnnotation ], when || 0, callback /* result */ );
    
                    };
    
                case "deleteNode":
    
                    return function( nodeID, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            undefined, when || 0, callback /* result */ );
                    };
    
                // TODO: setNode
                // TODO: getNode
    
                case "createChild":
    
                    return function( nodeID, childName, childComponent, childURI, when, callback /* childID */ ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, childName,
                            [ childComponent, childURI ], when || 0, callback /* result */ );
                    };
    
                case "deleteChild":
    
                    return function( nodeID, childName, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, childName,
                            undefined, when || 0, callback /* result */ );
                    };
    
                case "addChild":
                
                    return function( nodeID, childID, childName, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            [ childID, childName ], when || 0, callback /* result */ );  // TODO: swap childID & childName?
                    };
    
                case "removeChild":
    
                    return function( nodeID, childID, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            [ childID ], when || 0, callback /* result */ );  // TODO: swap childID & childName?
                    };
    
                case "setProperties":
    
                    return function( nodeID, properties, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            [ properties ], when || 0, callback /* result */ );
                    };
    
                case "getProperties":
    
                    return function( nodeID, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            undefined, when || 0, callback /* result */ );
                    };
    
                case "createProperty":
    
                    return function( nodeID, propertyName, propertyValue, propertyGet, propertySet, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, propertyName,
                            [ propertyValue, propertyGet, propertySet ], when || 0, callback /* result */ );  // TODO: { value: propertyValue, get: propertyGet, set: propertySet } ? -- vwf.receive() needs to parse
                    };
    
                // TODO: deleteProperty
    
                case "setProperty":
    
                    return function( nodeID, propertyName, propertyValue, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, propertyName,
                            [ propertyValue ], when || 0, callback /* result */ );
                    };
    
                case "getProperty":
    
                    return function( nodeID, propertyName, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, propertyName,
                            undefined, when || 0, callback /* result */ );
                    };
        
                case "createMethod":
    
                    return function( nodeID, methodName, methodParameters, methodBody, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, methodName,
                            [ methodParameters, methodBody ], when || 0, callback /* result */ );  // TODO: { parameters: methodParameters, body: methodBody } ? -- vwf.receive() needs to parse
                    };
    
                // TODO: deleteMethod
    
                case "setMethod":
    
                    return function( nodeID, methodName, methodHandler, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, methodName,
                            [ methodHandler ], when || 0, callback /* result */ );
                    };
    
                case "getMethod":
    
                    return function( nodeID, methodName, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, methodName,
                            undefined, when || 0, callback /* result */ );
                    };
    
                case "callMethod":
    
                    return function( nodeID, methodName, methodParameters, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, methodName,
                            [ methodParameters ], when || 0, callback /* result */ );
                    };
        
                case "createEvent":
    
                    return function( nodeID, eventName, eventParameters, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, eventName,
                            [ eventParameters ], when || 0, callback /* result */ );
                    };
    
                // TODO: deleteEvent
    
                case "addEventListener":
    
                    return function( nodeID, eventName, eventHandler, eventContextID, eventPhases, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, eventName,
                            [ eventHandler, eventContextID, eventPhases ], when || 0, callback /* result */ );
                    };
    
                case "removeEventListener":
    
                    return function( nodeID, eventName, eventListenerID, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, eventName,
                            [ eventListenerID ], when || 0, callback /* result */ );
                    };
    
                case "flushEventListeners":
    
                    return function( nodeID, eventName, eventContextID, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, eventName,
                            [ eventContextID ], when || 0, callback /* result */ );
                    };
    
                case "fireEvent":
    
                    return function( nodeID, eventName, eventParameters, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, eventName,
                            [ eventParameters ], when || 0, callback /* result */ );
                    };
        
                case "dispatchEvent":
    
                    return function( nodeID, eventName, eventParameters, eventNodeParameters, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, eventName,
                            [ eventParameters, eventNodeParameters ], when || 0, callback /* result */ );
                    };
        
                case "execute":
    
                    return function( nodeID, scriptText, scriptType, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            [ scriptText, scriptType ], when || 0, callback /* result */ );  // TODO: { text: scriptText, type: scriptType } ? -- vwf.receive() needs to parse
                    };
    
                case "random":
    
                    return function( nodeID, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            undefined, when || 0, callback /* result */ );
                    };
    
                case "seed":
    
                    return function( nodeID, seed, when, callback ) {
                        this.kernel.virtualTime.send( nodeID, kernelFunctionName, undefined,
                            [ seed ], when || 0, callback /* result */ );
                    };
    
                // -- Read-only functions --------------------------------------------------------------
    
                case "time":
                case "client":
                case "moniker":
    
                case "application":
    
                case "intrinsics":
                case "uri":
                case "name":
    
                case "prototype":
                case "prototypes":
                case "behaviors":
    
                case "ancestors":
                case "parent":
                case "children":
                case "descendants":
    
                case "find":
                case "test":
                case "findClients":
    
                    return function() {
                        return this.kernel[kernelFunctionName].apply( this.kernel, arguments );
                    };
    
            }
    
        } );

    }

}

export {
    ViewKernel
  }

