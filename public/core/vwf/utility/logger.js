/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

/// @module logger
/// @requires vwf/configuration
//define( [ "vwf/configuration" ], function( configuration ) {


    class Logger {

        constructor() {
            //console.log("Logger constructor");

            // exports.configure( undefined, undefined, vwf.configuration["log-level"] || "warn" );

            this.TRACE = 1
            this.DEBUG = 2
            this.INFO = 3
            this.WARN = 4
            this.ERROR = 5
            this.FATAL = 6

            this.levels = {
                trace: this.TRACE,
                debug: this.DEBUG,
                info: this.INFO,
                warn: this.WARN,
                error: this.ERROR,
                // fatal: this.FATAL,
            }

            this.label = undefined
            this.context = undefined
    
            this.level = { name: "warn", number: this.WARN };//this.WARN
    

        }

        for ( label, context, level ) {
            return Object.create( this ).configure( label, context, level );
        }

        configure ( label, context, level ) {

            var proto = Object.getPrototypeOf( this ) !== Object.prototype ?
                Object.getPrototypeOf( this ) : undefined;

            this.label = this.combined_label( proto && proto.label, label );

            this.context = context || proto && proto.context;

            this.level = { name: "warn", number: this.WARN }; // default

            switch( level ) {
                case "trace": case "TRACE": this.level = { name: "trace", number: this.TRACE }; break;
                case "debug": case "DEBUG": this.level = { name: "debug", number: this.DEBUG }; break;
                case "info":  case "INFO":  this.level = { name: "info",  number: this.INFO };  break;
                case "warn":  case "WARN":  this.level = { name: "warn",  number: this.WARN };  break;
                case "error": case "ERROR": this.level = { name: "error", number: this.ERROR }; break;
                // case "fatal": case "FATAL": this.level = { name: "fatal", number: FATAL }; break;
                default: proto && delete this.level; break; // inherit from the prototype
            }

            return this;
        }

        /// Log a message and open a group if the log threshold is "trace" or below.

        traceg ( /* ... */ ) {
            this.TRACE >= this.level.number &&
                this.log.call( this, arguments, console && console.group, console );
        }

        /// Log a message and open a group if the log threshold is "debug" or below.

        debugg ( /* ... */ ) {
            this.DEBUG >= this.level.number &&
                this.log.call( this, arguments, console && console.group, console );
        }

        /// Log a message and open a group if the log threshold is "info" or below.

        infog ( /* ... */ ) {
            this.INFO >= this.level.number &&
                this.log.call( this, arguments, console && console.group, console );
        }

        /// Close a group if the log threshold is "trace" or below.

        traceu () {
            this.TRACE >= this.level.number &&
                this.log.call( this, arguments, console && console.groupEnd, console );
        }

        /// Close a group if the log threshold is "debug" or below.

        debugu () {
            this.DEBUG >= this.level.number &&
                this.log.call( this, arguments, console && console.groupEnd, console );
        }

        /// Close a group if the log threshold is "info" or below.

        infou () {
            this.INFO >= this.level.number &&
                this.log.call( this, arguments, console && console.groupEnd, console );
        }

        /// Log a message if the log threshold is "trace" or below.

        trace ( /* ... */ ) {
            this.TRACE >= this.level.number &&
                this.log.call( this, arguments, console && console.debug, console ); // not console.trace(), which would log the stack
        }

         /// Log a message if the log threshold is "debug" or below.

         debug ( /* ... */ ) {
            this.DEBUG >= this.level.number &&
                this.log.call( this, arguments, console && console.debug, console );
        }

        /// Log a message if the log threshold is "info" or below.

        info ( /* ... */ ) {
            this.INFO >= this.level.number &&
                this.log.call( this, arguments, console && console.info, console );
        }

        /// Log a message if the log threshold is "warn" or below.

        warn ( /* ... */ ) {
            this.WARN >= this.level.number &&
                this.log.call( this, arguments, console && console.warn, console );
        }

        /// Log a message if the log threshold is "error" or below.

        error ( /* ... */ ) {
            this.ERROR >= this.level.number &&
                this.log.call( this, arguments, console && console.error, console );
        }

        /// Log a message.

        log ( /* ... */ ) {
            this.log.call( this, arguments, console && console.log, console );
        }

         // Log with an extra one-time label. Equivalent to this.logger.for( label ).log( ... ),
        // etc., but without the overhead of creating a new logger.

        /// Log a message with an extra one-time label and open a group if the log threshold is
        /// "trace" or below.

        tracegx ( /* label, ... */ ) {
            this.TRACE >= this.level.number &&
                this.log.call( this, arguments, console && console.group, console, true );
        }

        /// Log a message with an extra one-time label and open a group if the log threshold is
        /// "debug" or below.

        debuggx ( /* label, ... */ ) {
            this.DEBUG >= this.level.number &&
                this.log.call( this, arguments, console && console.group, console, true );
        }


        /// Log a message with an extra one-time label and open a group if the log threshold is
        /// "info" or below.

        infogx ( /* label, ... */ ) {
            this.INFO >= this.level.number &&
                this.log.call( this, arguments, console && console.group, console, true );
        }

        /// Log a message with an extra one-time label if the log threshold is "trace" or below.

        tracex ( /* ... */ ) {
            this.TRACE >= this.level.number &&
                this.log.call( this, arguments, console && console.debug, console, true ); // not console.trace(), which would log the stack
        }

        /// Log a message with an extra one-time label if the log threshold is "debug" or below.

        debugx ( /* label, ... */ ) {
            this.DEBUG >= this.level.number &&
                this.log.call( this, arguments, console && console.debug, console, true );
        }

        /// Log a message with an extra one-time label if the log threshold is "info" or below.

        infox ( /* label, ... */ ) {
            this.INFO >= this.level.number &&
                this.log.call( this, arguments, console && console.info, console, true );
        }

        /// Log a message with an extra one-time label if the log threshold is "warn" or below.

        warnx ( /* label, ... */ ) {
            this.WARN >= this.level.number &&
                this.log.call( this, arguments, console && console.warn, console, true );
        }

        /// Log a message with an extra one-time label if the log threshold is "error" or below.

        errorx ( /* label, ... */ ) {
            this.ERROR >= this.level.number &&
                this.log.call( this, arguments, console && console.warn, console, true );
        }

        /// Log a message with an extra one-time label.

        logx ( /* label, ... */ ) {
            this.log.call( this, arguments, console && console.log, console, true );
        }

        /////

        /// Log a message to the console. Normalize the arguments list and invoke the appender function.
    /// 
    /// @param {Array} args
    ///   An Array-like list of arguments passed to a log function. normalize describes the formats
    ///   supported.
    /// @param {Function} appender
    ///   A Firebug-like log function that logs its arguments, such as window.console.log.
    /// @param {Object} context
    ///   The *this* object for the appender, such as window.console.
    /// @param {Boolean} [extra]
    ///   If true, interpret args[0] as a one-time label that extends the logger's output prefix.

    log ( args, appender, context, extra ) {  // invoke with *this* as the logger module

        // Normalize the arguments and log the message. Don't log a message if normalize() returned
        // undefined (because a generator function didn't return a result).

        if ( args = /* assignment! */ this.normalize.call( this, args, extra ) ) {
            appender && appender.apply( context, args );
        }

    }

    /// Normalize the arguments provided to a log function. The arguments may take one of the
    /// following forms:
    /// 
    /// A series of values, or a function that generates the values:
    /// 
    ///   [ value, value, ... ]
    ///   [ function( name, number ) { return [ value, value, ... ] }, context ]
    /// 
    /// For a generator function, an optional context argument provides the function's *this*
    /// context. The logger's default context will be used if the context argument is no provided.
    /// The log threshold name and number ("info" and 3, for example) are passed as arguments to the
    /// function.
    /// 
    /// No message will be logged if a generator function returns undefined. Since the function will
    /// only be called if the message type exceeds the log threshold, logger calls may be used to
    /// control program behavior based on the log level:
    ///
    ///   this.logger.debug( function( name, number ) {
    ///       debugControls.visible = true; // returns undefined, so no message
    ///   } );
    /// 
    /// When *extra* is truthy, the first argument is interpreted as a one-time label that extends
    /// the logger's output prefix:
    /// 
    ///   [ "label", value, value, ... ]
    ///   [ "label", function( name, number ) { return [ value, value, ... ] }, context ]
    /// 
    /// The arguments are normalized into a list of values ready to pass to the appender:
    /// 
    ///   [ value, value, ... ]
    /// 
    /// @param {Array} args
    ///   An Array-like list of arguments passed to one of the log functions.
    /// @param {Boolean} [extra]
    ///   If true, interpret args[0] as a one-time label that extends the logger's output prefix.

    normalize( args, extra ) {  // invoke with *this* as the logger module

        // Record the extra one-time label if one is provided. We leave it in the arguments list so
        // that we don't convert Arguments to an Array if it isn't necessary.

        if ( extra && ( typeof args[0] == "string" || args[0] instanceof String ) ) {
            var label = args[0];
            var start = 1;
        } else {
            var label = undefined;
            var start = 0;
        }

        // If a generator function is provided (instead of a series of values), call it to get the
        // arguments list.

        if ( typeof args[ start ] == "function" || args[ start ] instanceof Function ) {

            // Call the function using the provided context or this logger's context. We expect the
            // function to return an array of values, a single value, or undefined.

            args = args[ start ].call( args[ start+1 ] || this.context, this.level.name, this.level.number );

            // Convert a single value to an Array. An Array remains an Array. Leave undefined
            // unchanged.

            if ( args !== undefined && ( typeof args != "object" || ! ( args instanceof Array ) ) ) {
                args = [ args ];
            }

        } else {

            // Remove the extra one-time label.

            if ( start > 0 ) {
                args = Array.prototype.slice.call( args, start );
            }

        }

        // Add the prefix label to the arguments list and return. But return undefined if a
        // generator didn't return a result.

        return args ? this.prefixed_arguments( this.label, label, args ) : undefined;
    }

       /// Update an arguments list to prepend "<label>: " to the output.

       prefixed_arguments( label, extra, args ) {

        if ( label || extra ) {

            if ( args.length == 0 ) {
                return [ this.combined_label( label, extra ) ]; // just show the module and function name when there are no additional arguments
            } else if ( typeof args[0] == "string" || args[0] instanceof String ) {
                return [ this.combined_label( label, extra ) + ": " + args[0] ].concat( Array.prototype.slice.call( args, 1 ) ); // concatenate when the first field is a string so that it may remain a format string
            } else {
                return [ this.combined_label( label, extra ) + ":" ].concat( args ); // otherwise insert a new first field
            }

        } else {

            return args;

        }

    }

     /// Generate a new label from a parent label and an extra part.

    combined_label( label, extra ) {

        // Combine with "." unless the extension provides its own separator.

        var separator = extra && extra.match( /^[0-9A-Za-z]/ ) ? "." : "";

        // Concatenate and return.

        if ( label && extra ) {
            return label + separator + extra;
        } else if ( extra ) {
            return extra;
        } else if ( label ) {
            return label;
        } else {
            return undefined;
        }

    }


    }

    export {
        Logger
    }    
