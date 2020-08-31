/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

/// @module vwf/model/stage
/// @requires vwf/model


import { Fabric } from '/core/vwf/fabric.js';

class Stage extends Fabric {

    constructor(module) {

        //console.log("Stage constructor");
        super(module, "Model")

    }

    factory(){

        return this.load( this.module, 
            {

                fabricize: function ( model, model_api ) {

                    this.model = model;
        
                    // Suppress functions that aren't implemented in the stage to the right.
        
                    Object.keys( model_api ).forEach( function( modelFunctionName ) {
                        if ( ! model[modelFunctionName] ) {
                            this[modelFunctionName] = undefined;
                        }
                    }, this );
        
                }

            },
             function( modelFunctionName ) {
        
            // == Model API ============================================================================
    
            return function() {
                return this.model[modelFunctionName] && this.model[modelFunctionName].apply( this.model, arguments );
            };
    
        }, function( kernelFunctionName ) {
    
            // == Kernel API ===========================================================================
    
            return function() {
                return this.kernel[kernelFunctionName].apply( this.kernel, arguments );
            };
            
        } );
    }
}

export {
    Stage
  }
