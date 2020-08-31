/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/
/// 
/// @module vwf/view
/// @requires logger
/// @requires vwf/api/kernel
/// @requires vwf/api/view

import { Utility } from '/core/vwf/utility/utility.js';
import { Helpers } from '/core/helpers.js';
import { Logger } from '/core/vwf/utility/logger.js';
import { Kernel } from '/core/vwf/api/kernel.js';
import { ViewApi } from '/core/vwf/api/view.js';
import { ModelApi } from '/core/vwf/api/model.js';

class Fabric {

    constructor(module, api) {

        //console.log("Fabric constructor");

        // this.view_api = new ViewApi;
        this.api = (api == 'View') ? new ViewApi : new ModelApi
        this.kernel_api = new Kernel;
        
        this.loggerFactory = new Logger;
        this.utility = new Utility;
        this.helpers = new Helpers;
        

        this.module = module;
        this.label = module.id.replace( /\//g, "." );
        this.loggerFactory.for( this.label ).debug( "loading" );

        this.logger = this.loggerFactory.for( this.label );

    }

    load ( module, initializer, fabricGenerator, kernelGenerator ) {

        var instance = Object.create( this );
        instance.driver = this;

        instance.module = module;
        instance.logger = this.logger.for( instance.module.id.replace( /\//g, "." ), instance );
        
        instance.logger.debug( "loading" );

        if ( typeof initializer == "function" || initializer instanceof Function ) {
            initializer = initializer();
        }

        for ( var key in initializer ) {
            instance[key] = initializer[key]; 
        }

        fabricGenerator && Object.keys( this.api ).forEach( function( fabricFunctionName ) {
            if ( ! instance.hasOwnProperty( fabricFunctionName ) ) {
                instance[fabricFunctionName] = fabricGenerator.call( instance, fabricFunctionName );
                instance[fabricFunctionName] || delete instance[fabricFunctionName];
            }
        } );

        kernelGenerator && Object.keys( this.kernel_api ).forEach( function( kernelFunctionName ) {
            if ( ! instance.hasOwnProperty( kernelFunctionName ) ) {
                instance[kernelFunctionName] = kernelGenerator.call( instance, kernelFunctionName );
                instance[kernelFunctionName] || delete instance[kernelFunctionName];
            }
        } );

        return instance;
    }

    create ( kernel, fabric, stages, state, parameters ) {

        let self = this;
        // let view_api = this.view_api;
        // let kernel_api = this.kernel_api;

        this.logger.debug( "creating" );

        // Interpret create( kernel, stages, ... ) as create( kernel, undefined, stages, ... )

        if ( fabric && fabric.length !== undefined ) { // is an array?
            parameters = state;
            state = stages;
            stages = fabric;
            fabric = undefined;
        }

        // Append this driver's stages to the pipeline to be placed in front of this driver.

        if ( ! fabric ) {
            stages = Array.prototype.concat.apply( [], ( this.pipeline || [] ).map( function( stage ) {
                return ( stages || [] ).concat( stage );
            } ) ).concat( stages || [] );
        } else {
            stages = ( stages || [] ).concat( this.pipeline || [] );
        }

        // Create the driver stage using its module as its prototype.

        var instance = Object.create( this );



        // Attach the reference to the stage to the right through the view API.

        fabricize.call( instance, fabric, self.api );

        // Create the pipeline to the left and attach the reference to the stage to the left
        // through the kernel API.

        kernelize.call( instance,
            stages.length ?
                stages.pop().create( kernel, instance, stages ) :
                kernel,
            self.kernel_api );

        // Attach the shared state object.

        instance.state = state || {};

        // Call the driver's initialize().

        initialize.apply( instance, parameters );

        // Call viewize() on the driver.

        function fabricize( fabric_type, fabric_api ) {
            Object.getPrototypeOf( this ) && fabricize.call( Object.getPrototypeOf( this ), fabric_type, fabric_api ); // depth-first recursion through the prototypes
            this.hasOwnProperty( "fabricize" ) && this.fabricize.call( instance, fabric_type, fabric_api ); // viewize() from the bottom up
        }

        // Call kernelize() on the driver.

        function kernelize( kernel, kernel_api ) {
            Object.getPrototypeOf( this ) && kernelize.call( Object.getPrototypeOf( this ), kernel, kernel_api ); // depth-first recursion through the prototypes
            this.hasOwnProperty( "kernelize" ) && this.kernelize.call( instance, kernel, kernel_api ); // kernelize() from the bottom up
        }

        // Call initialize() on the driver.

        function initialize( /* parameters */ ) {
            Object.getPrototypeOf( this ) && initialize.apply( Object.getPrototypeOf( this ), arguments ); // depth-first recursion through the prototypes
            this.hasOwnProperty( "initialize" ) && this.initialize.apply( instance, arguments ); // initialize() from the bottom up
        }

        // Return the driver stage. For the actual driver, return the leftmost stage in the
        // pipeline.

        if ( ! fabric ) {
            while ( instance.kernel !== kernel ) {
                instance = instance.kernel;
            }
        }

        this.driver.instance = instance;
        return instance;
    }

    kernelize ( kernel, kernel_api ) {
        this.kernel = kernel;
    }

    static getPrototypes(kernel, extendsID) {
        let prototypes = [];
        let id = extendsID;

        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }
        return prototypes;
    }

}

export {
    Fabric
  }

