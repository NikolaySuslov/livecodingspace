/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

/// @module vwf/model/stage/log
/// @requires vwf/model/stage

import { Stage } from '/core/vwf/model/stage.js';

class Log extends Stage {

    constructor(module) {
        //console.log("Stage constructor");
        super(module);

    }


    factory(){
        let _self_ = this;

        return super.factory().load( this.module, 
            {
                 // == Module Definition ====================================================================

     initialize: function () {
        this.logger = this.model.logger; // steal the model's logger since we're logging for it
    }
            },
            function( modelFunctionName ) {

                // == Model API ============================================================================
        
                return function() {
        
                    if ( this.model[modelFunctionName] ) {
        
                        var logees = Array.prototype.slice.call( arguments );
        
                        switch ( modelFunctionName ) {
        
                            case "creatingNode": // nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName, callback /* ( ready ) */
                                logees[8] = undefined; // callback /* ( ready ) */
                                break;
        
                            case "creatingProperty":
                                logees[3] && ( logees[3] = _self_.loggableScript( logees[3] ) ); // propertyGet
                                logees[4] && ( logees[4] = _self_.loggableScript( logees[4] ) ); // propertySet
                                break;
        
                            case "executing":
                                logees[1] && ( logees[1] = _self_.loggableScript( logees[1] ) ); // scriptText
                                break;
        
                            case "ticking":
                                logees = undefined; // no logging for model.ticking()
                                break;
        
                        }
        
                        if ( logees ) {
                            this.logger.tracex.apply( this.logger, [ modelFunctionName ].concat( logees ) );
                        }
        
                        return this.model[modelFunctionName].apply( this.model, arguments );
                    }
        
                };
        
            }, function( kernelFunctionName ) {
        
                // == Kernel API ===========================================================================
        
                return function() {
        
                    var logees = Array.prototype.slice.call( arguments );
        
                    switch ( kernelFunctionName ) {
        
                        case "createNode": // nodeComponent, [ nodeAnnotation, ] [ baseURI, ] callback /* ( nodeID ) */
                            _self_.objectIsComponent( logees[0] ) && ( logees[0] = JSON.stringify( _self_.loggableComponent( logees[0] ) ) ); // nodeComponent
                            break;
        
                        case "createChild": // nodeID, childName, childComponent, childURI, callback /* ( childID ) */
                            _self_.objectIsComponent( logees[2] ) && ( logees[2] = JSON.stringify( _self_.loggableComponent( logees[2] ) ) ); // childComponent
                            break;
        
                        case "createProperty":
                            logees[3] && ( logees[3] = _self_.loggableScript( logees[3] ) ); // propertyGet
                            logees[4] && ( logees[4] = _self_.loggableScript( logees[4] ) ); // propertySet
                            break;
        
                        case "execute":
                            logees[1] && ( logees[1] = _self_.loggableScript( logees[1] ) ); // scriptText
                            break;
        
                        case "time":
                            logees = undefined; // no logging for kernel.time()
                            break;
        
                    }
        
                    if ( logees ) {
                        this.logger.tracex.apply( this.logger, [ kernelFunctionName ].concat( logees ) );
                    } 
        
                    return this.kernel[kernelFunctionName].apply( this.kernel, arguments );
                };
                
            } );

        }

         // == Private functions ========================================================================

    objectIsComponent( candidate ) {  // TODO: this was copied from vwf.js; find a way to share (use the log stage for incoming logging too?)

        var componentAttributes = [
            "extends",
            "implements",
            "source",
            "type",
            "properties",
            "methods",
            "events",
            "children",
            "scripts",
        ];

        var isComponent = false;

        if ( typeof candidate == "object" && candidate != null ) {

            componentAttributes.forEach( function( attributeName ) {
                isComponent = isComponent || Boolean( candidate[attributeName] );
            } );

        }
            
        return isComponent; 
    }

    loggableComponent( component ) {  // TODO: this was copied from vwf.js; find a way to share (use the log stage for incoming logging too?)

        var loggable = {};

        for ( var elementName in component ) {

            switch ( elementName ) {

                case "properties":

                    loggable.properties = {};

                    for ( var propertyName in component.properties ) {

                        var componentPropertyValue = component.properties[propertyName];
                        var loggablePropertyValue = loggable.properties[propertyName] = {};

                        if ( this.valueHasAccessors( componentPropertyValue ) ) {
                            for ( var propertyElementName in componentPropertyValue ) {
                                if ( propertyElementName == "set" || propertyElementName == "get" ) {
                                    loggablePropertyValue[propertyElementName] = "...";
                                } else {
                                    loggablePropertyValue[propertyElementName] = componentPropertyValue[propertyElementName];
                                }
                            }
                        } else {
                            loggable.properties[propertyName] = componentPropertyValue;
                        }

                    }

                    break;

                case "children":

                    loggable.children = {};

                    for ( var childName in component.children ) {
                        loggable.children[childName] = {};
                    }

                    break;

                case "scripts":

                    loggable.scripts = [];

                    component.scripts.forEach( function( script ) {

                        var loggableScript = {};

                        for ( var scriptElementName in script ) {
                            loggableScript[scriptElementName] = scriptElementName == "text" ? "..." : script[scriptElementName];
                        }

                        loggable.scripts.push( loggableScript );

                    } );

                    break;

                default:

                    loggable[elementName] = component[elementName];

                    break;
            }

        }

        return loggable;
    }

    valueHasAccessors( candidate ) {  // TODO: this was copied from vwf.js; find a way to share (use the log stage for incoming logging too?)

        var accessorAttributes = [
            "get",
            "set",
            "value",
        ];

        var hasAccessors = false;

        if ( typeof candidate == "object" && candidate != null ) {

            accessorAttributes.forEach( function( attributeName ) {
                hasAccessors = hasAccessors || Boolean( candidate[attributeName] );
            } );

        }
            
        return hasAccessors; 
    }

    loggableScript( scriptText ) {
        return ( scriptText || "" ).replace( /\s+/g, " " ).substring( 0, 100 );
    }


}

export {
    Log
  }
