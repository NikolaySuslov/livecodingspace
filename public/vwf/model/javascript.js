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

/// vwf/model/javascript.js is a placeholder for the JavaScript object interface to the
/// simulation.
/// 
/// @module vwf/model/javascript
/// @requires vwf/model
/// @requires vwf/kernel/utility
/// @requires vwf/utility
/// @requires vwf/configuration

define( [ "module", "vwf/model", "vwf/kernel/utility", "vwf/utility", "vwf/configuration" ],
        function( module, model, kutility, utility, configuration ) {

    var exports = model.load( module, {

        // This is a placeholder for providing a natural integration between simulation and the
        // browser's JavaScript environment.
        // 
        // Within the JavaScript environment, component instances appear as JavaScript objects.
        // 
        //   - Properties appear in the "properties" field. Each property contains a getter and
        //     setter callback to notify the object of property manipulation.
        //   - Methods appear in "methods".
        //   - Events appear in "events".
        //   - "parent" refers to the parent node and "children" is an array of the child nodes.
        // 
        //   - Node prototypes use the JavaScript prototype chain.
        //   - Properties, methods, events, and children may be referenced directly on the node or
        //     within their respective collections by name when there is no conflict with another
        //     attribute.
        //   - Properties support getters and setters that invoke a handler that may influence the
        //     property access.

        // == Module Definition ====================================================================

        // -- initialize ---------------------------------------------------------------------------

        initialize: function() {
            this.nodes = {};                    // maps id => new type()
            this.protoNode = undefined;         // this.nodes[kutility.protoNodeURI] once it exists
            this.creatingNode( undefined, 0 );  // global root  // TODO: to allow vwf.children( 0 ), vwf.getNode( 0 ); is this the best way, or should the kernel createNode( global-root-id /* 0 */ )?
        },

        // == Model API ============================================================================

        // -- creatingNode -------------------------------------------------------------------------

        creatingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */ ) {

            var self = this;

            // Get the prototype node.

            var prototype = this.nodes[childExtendsID] || Object.prototype;

            // Get the behavior nodes.

            var behaviors = ( childImplementsIDs || [] ).map( function( childImplementsID ) {
                return self.nodes[childImplementsID];
            } );

            // For each behavior, create a proxy for this node to the behavior and attach it above
            // the prototype, or above the most recently-attached behavior.

            behaviors.forEach( function( behavior ) {
                prototype = proxiedBehavior.call( self, prototype, behavior );
            } );

            // Create the node. Its prototype is the most recently-attached behavior, or the
            // specific prototype if no behaviors are attached.

            var node = this.nodes[childID] = Object.create( prototype );

            if ( childID === kutility.protoNodeURI ) {
                this.protoNode = node;
            }

            Object.defineProperty( node, "private", {
                value: {} // for bookkeeping, not visible to scripts on the node  // TODO: well, ideally not visible; hide this better ("_private", "vwf_private", ?)
            } );

            Object.defineProperty( node, "id", {
                value: childID,
                enumerable: true,
            } );

            Object.defineProperty( node, "uri", { // "this" is node
                get: function() {
                    return self.kernel.uri( this.id );
                },
                enumerable: true,
            } );

            node.name = childName;

            node.parent = undefined;

            Object.defineProperty( node, "parent_", { // "this" is node in get/set
                get: function() {
                    return this.parent;
                },
                set: function( value ) {
                    var childIndex;
                    if ( this.parent ) { 
                        var oldParent = this.parent;
                        self.kernel.removeChild( this.parent.id, this.id );
                        childIndex = oldParent.children.indexOf( this );
                        if ( childIndex != -1 )
                            oldParent.children.splice( childIndex, 1 );
                    }
                    self.kernel.addChild( value.id, this.id, this.name );
                    this.parent = value;
                    childIndex = this.parent.children.indexOf( this );
                    if ( childIndex == -1 )
                        this.parent.children.push( this ); 
                },
            } );

            node.source = childSource;
            node.type = childType;

            Object.defineProperty( node, "logger", {
                value: this.logger.for( "#" + ( childName || childIndex || childID ), node ),
                enumerable: true,
            } );

            // Properties.

            node.properties = Object.create( prototype.properties || Object.prototype, {
                node: { value: node } // for node.properties accessors (non-enumerable)  // TODO: hide this better
            } );

            Object.defineProperty( node.properties, "create", {
                value: function( name, value, get, set ) { // "this" is node.properties
                    return self.kernel.createProperty( this.node.id, name, value, get, set );
                }
            } );

            // Attach the property meta events to `node.properties.{created,initialized,deleted}`.

            createEventAccessor.call( this, node.properties, "created", "properties" );
            createEventAccessor.call( this, node.properties, "initialized", "properties" );
            createEventAccessor.call( this, node.properties, "deleted", "properties" );

            node.private.getters = Object.create( prototype.private ?
                prototype.private.getters : Object.prototype
            );

            node.private.setters = Object.create( prototype.private ?
                prototype.private.setters : Object.prototype
            );

            // Methods.

            node.methods = Object.create( prototype.methods || Object.prototype, {
                node: { value: node } // for node.methods accessors (non-enumerable)  // TODO: hide this better
            } );

            Object.defineProperty( node.methods, "create", {
                value: function( name, parameters, body ) { // "this" is node.methods  // TODO: also accept create( name, body )
                    return self.kernel.createMethod( this.node.id, name, parameters, body );
                }
            } );

            // Attach the method meta events to `node.methods.{created,deleted}`.

            createEventAccessor.call( this, node.methods, "created", "methods" );
            createEventAccessor.call( this, node.methods, "deleted", "methods" );

            node.private.bodies = Object.create( prototype.private ?
                prototype.private.bodies : Object.prototype
            );

            // Events.

            node.events = Object.create( prototype.events || Object.prototype, {
                node: { value: node }, // for node.events accessors (non-enumerable)  // TODO: hide this better
            } );

            // TODO: these only need to be on the base node's events object

            Object.defineProperty( node.events, "create", {
                value: function( name, parameters ) { // "this" is node.events
                    return self.kernel.createEvent( this.node.id, name, parameters );
                }
            } );

            // Attach the event meta events to `node.events.{created,deleted}`.

            createEventAccessor.call( this, node.events, "created", "events" );
            createEventAccessor.call( this, node.events, "deleted", "events" );

            // Provide helper functions to create the directives for adding, removing and flushing
            // event handlers.

            // Add: `node.events.*eventName* =
            //   node.events.add( handler [, phases ] [, context ] [, callback( listenerID ) ] )`

            Object.defineProperty( node.events, "add", {

                value: function( handler, phases, context, callback /* listenerID */ ) {

                    // Interpret `add( handler [, phases|context ], callback )` as
                    // `add( handler, phases|context|undefined, undefined, callback )`.

                    if ( typeof context === "function" || context instanceof Function ) {
                        callback = context;
                        context = undefined;
                    } else if ( typeof phases === "function" || phases instanceof Function ) {
                        callback = phases;
                        context = phases = undefined;
                    }

                    // Interpret `add( handler, context, ... )` as `add( handler, undefined, context, ... )`.

                    if ( valueIsNode.call( self, phases ) ) {
                        context = phases;
                        phases = undefined;
                    }

                    return { add: true, handler: handler, phases: phases, context: context, callback: callback };
                }

            } );

            // Remove: `node.events.*eventName* = node.events.remove( listenerID|handler )`

            Object.defineProperty( node.events, "remove", {

                value: function( listenerID ) {

                    // For 0.6.23 and earlier, listeners were removed using a direct reference to
                    // the handler. For 0.6.24 and later a `listenerID` is used. Accept a function
                    // for compatability with components written for 0.6.23 or earlier. The event
                    // setter will translate the function to an id.

                    if ( typeof listenerID === "function" || listenerID instanceof Function ) {
                        return { remove: true, handler: listenerID };
                    } else {
                        return { remove: true, id: listenerID };
                    }

                }

            } );

            // Flush: `node.events.*eventName* = node.events.flush( context )`

            Object.defineProperty( node.events, "flush", {
                value: function( context ) {
                    return { flush: true, context: context };
                }
            } );

            node.private.listeners = {}; // not delegated to the prototype as with getters, setters, and bodies; findListeners() filters recursion

            // Children.

            node.children = [];  // TODO: connect children's prototype like properties, methods and events do? how, since it's an array? drop the ordered list support and just use an object?

            Object.defineProperty( node.children, "node", {
                value: node // for node.children accessors (non-enumerable)  // TODO: hide this better
            } );

            Object.defineProperty( node.children, "create", {

                value: function( name, component, callback /* ( child ) */ ) { // "this" is node.children

                    // Interpret `node.children.create( name, callback )` as
                    // `node.children.create( name, undefined, callback )`.

                    if ( typeof component === "function" || component instanceof Function ) {
                        callback = component;
                        component = undefined;
                    }

                    // Accept `node.children.create( name )` and treat it as
                    // `node.children.create( name, {} )`.

                    component = component || {};

                    // Make the call. If a callback is provided, wrap it and translate the ID to a
                    // node reference.

                    if ( callback ) {
                        self.kernel.createChild( this.node.id, name, componentKernelFromJS.call( self, component ), undefined, undefined, function( childID ) {
                            callback.call( node, self.nodes[childID] );
                        } );
                    } else { 
                        return self.kernel.createChild( this.node.id, name, componentKernelFromJS.call( self, component ) );
                    }

                }

            } );

            Object.defineProperty( node.children, "delete", {
                value: function( child ) {
                    if ( typeof child === "string" ) {
                        child = this.node.children[ child ];
                    }
                    return self.kernel.deleteNode( child.id );
                }
            } );

            // Attach the child meta events to `node.children.{added,removed}`.

            createEventAccessor.call( this, node.children, "added", "children" );
            createEventAccessor.call( this, node.children, "removed", "children" );

            // Define the "random" and "seed" functions.

            Object.defineProperty( node, "random", { // "this" is node
                value: function() {
                    return self.kernel.random( this.id );
                }
            } );

            Object.defineProperty( node, "seed", { // "this" is node
                value: function( seed ) {
                    return self.kernel.seed( this.id, seed );
                }
            } );

            // Define the "time", "client", and "moniker" properties.

            Object.defineProperty( node, "time", {  // TODO: only define on shared "node" prototype?
                get: function() {
                    return self.kernel.time();
                },
                enumerable: true,
            } );

            Object.defineProperty( node, "client", {  // TODO: only define on shared "node" prototype?
                get: function() {
                    return self.kernel.client();
                },
                enumerable: true,
            } );

            Object.defineProperty( node, "moniker", {  // TODO: only define on shared "node" prototype?
                get: function() {
                    return self.kernel.moniker();
                },
                enumerable: true,
            } );

            Object.defineProperty( node, "find", {
                value: function( matchPattern, callback /* ( match ) */ ) { // "this" is node
                    if ( callback ) {
                        self.kernel.find( this.id, matchPattern, true, function( matchID ) {
                            callback.call( node, self.nodes[matchID] );
                        } );
                    } else {  // TODO: future iterator proxy
                        var findResults = self.kernel.find( this.id, matchPattern, true );
                        if ( findResults )
                            return findResults.map( function( matchID ) {
                                return self.nodes[matchID];
                            } );
                    }
                }
            } );

            Object.defineProperty( node, "test", {
                value: function( matchPattern, testNode ) { // "this" is node
                    return self.kernel.test( this.id, matchPattern, testNode.id, true );
                }
            } );

            // Define a "future" proxy so that for any this.property, this.method, or this.event, we
            // can reference this.future( when, callback ).property/method/event and have the
            // expression evaluated at the future time.

            Object.defineProperty( node, "in", {  // TODO: only define on shared "node" prototype?
                value: function( when, callback ) { // "this" is node
                    return refreshedFuture.call( self, this, -when, callback ); // relative time
                },
                enumerable: true,
            } );

            Object.defineProperty( node, "at", {  // TODO: only define on shared "node" prototype?
                value: function( when, callback ) { // "this" is node
                    return refreshedFuture.call( self, this, when, callback ); // absolute time
                },
                enumerable: true,
            } );

            Object.defineProperty( node, "future", { // same as "in"  // TODO: only define on shared "node" prototype?
                get: function() {
                    return this.in;
                },
                enumerable: true,
            } );

            node.private.future = Object.create( prototype.private ?
                prototype.private.future : Object.prototype
            );

            Object.defineProperty( node.private.future, "private", {
                value: {
                    when: 0,
                    callback: undefined,
                    change: 0,
                }
            } );

            node.private.change = 1; // incremented whenever "future"-related changes occur

        },

        // -- initializingNode ---------------------------------------------------------------------

        // Invoke an initialize() function if one exists.

        initializingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName ) {

            var node = this.nodes[nodeID];
            var child = this.nodes[childID];

            var scriptText =
                "this.hasOwnProperty( 'initialize' ) && " +
                "( typeof this.initialize === 'function' || this.initialize instanceof Function ) && " +
                "this.initialize()";

            // Call the child's initializer.

            try {
                ( function( scriptText ) { return eval( scriptText ) } ).call( child, scriptText );
            } catch ( e ) {
                this.logger.warnx( "initializingNode", childID,
                    "exception in initialize:", utility.exceptionMessage( e ) );
            }

            // The node is fully initialized at this point

            // Link to the parent.
            // 
            // The parent reference is only defined once the node is fully initialized.
            // It is not defined earlier since components should be able to stand alone 
            // without depending on external nodes.
            // 
            // Additionally, since parts of the application may become ready in a different
            // order on other clients, referring to properties in other parts of the 
            // application may lead to consistency errors.

            child.parent = node;

            if ( node ) {

                node.children[childIndex] = child;

                if ( parseInt( childName ).toString() !== childName ) {
                    node.children[childName] = child;
                }
node.hasOwnProperty( childName ) ||  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
                ( node[childName] = child );

            }

            return undefined;
        },

        // -- initializingNodeFromPrototype --------------------------------------------------------

        // Invoke an initialize() function from `childInitializingNodeID` on `childID` if one exists.

        initializingNodeFromPrototype: function( nodeID, childID, childInitializingNodeID ) {

            var child = this.nodes[childID];
            var initializer = this.nodes[childInitializingNodeID];

            // Call the prototype's initializer on the child.
            try {
                var prototypeHasInitialize = ( initializer.hasOwnProperty( 'initialize' ) && 
                    ( typeof initializer.initialize === 'function' || 
                      initializer.initialize instanceof Function ) );
                if ( prototypeHasInitialize ) {
                    return initializer.initialize.call( child ); 
                }
            } catch ( e ) {
                this.logger.warnx( "initializingNodeFromPrototype", childID,
                    "exception in initialize:", utility.exceptionMessage( e ) );
            }

            return undefined;
        },

        // -- deletingNode -------------------------------------------------------------------------

        deletingNode: function( nodeID ) {

            var child = this.nodes[nodeID];
            var node = child.parent;

            if ( node ) {

                var index = node.children.indexOf( child );

                if ( index >= 0 ) {
                    node.children.splice( index, 1 );
                }

                delete node.children[child.name];  // TODO: conflict if childName is parseable as a number

                if ( node[child.name] === child ) {
                    delete node[child.name];  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
                }

                child.parent = undefined;

            }

            delete this.nodes[nodeID];

        },

        // -- addingChild --------------------------------------------------------------------------

        addingChild: function( nodeID, childID, childName ) {
        },

        // -- removingChild ------------------------------------------------------------------------

        removingChild: function( nodeID, childID ) {

            var node = this.nodes[nodeID];
            var child = this.nodes[childID];

            child.parent = undefined;

            if ( node ) {
                node.children.splice( node.children.indexOf( child ), 1 );
                delete node.children[child.name];  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
                delete node[child.name];  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
            }

        },

        // -- creatingProperty ---------------------------------------------------------------------

        creatingProperty: function( nodeID, propertyName, propertyValue, propertyGet, propertySet ) {

            var node = this.nodes[nodeID];

            var self = this;

            var getter = propertyGet &&  // TODO: assuming javascript here; how to specify script type?
                functionFromHandler( { body: propertyGet, type: scriptMediaType },
                    logGetterException );

            if ( getter ) {
                node.private.getters[ propertyName ] = getter;
            } else {
                node.private.getters[ propertyName ] = true; // set a guard value so that we don't call prototype getters on value properties
            }
        
            var setter = propertySet &&  // TODO: assuming javascript here; how to specify script type?
                functionFromHandler( { parameters: [ "value" ], body: propertySet, type: scriptMediaType },
                    logSetterException );

            if ( setter ) {
                node.private.setters[ propertyName ] = setter;
            } else {
                node.private.setters[ propertyName ] = true; // set a guard value so that we don't call prototype setters on value properties
            }

            function logGetterException( exception ) {
                self.logger.warnx( "creatingProperty", nodeID, propertyName, propertyValue,
                    "exception evaluating getter:", utility.exceptionMessage( exception ) );
            }

            function logSetterException( exception ) {
                self.logger.warnx( "creatingProperty", nodeID, propertyName, propertyValue,
                    "exception evaluating setter:", utility.exceptionMessage( exception ) );
            }

            return this.initializingProperty( nodeID, propertyName, propertyValue );
        },

        // -- initializingProperty -----------------------------------------------------------------

        initializingProperty: function( nodeID, propertyName, propertyValue ) {

            var node = this.nodes[nodeID];

            createPropertyAccessor.call( this, node.properties, propertyName );

node.hasOwnProperty( propertyName ) ||  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
            createPropertyAccessor.call( this, node, propertyName );

            // Invalidate the "future" cache.

            node.private.change++;

            return propertyValue !== undefined ?
                this.settingProperty( nodeID, propertyName, propertyValue ) : undefined;
        },

        // TODO: deletingProperty

        // -- settingProperty ----------------------------------------------------------------------

        settingProperty: function( nodeID, propertyName, propertyValue ) {

            var node = this.nodes[nodeID];

if ( ! node ) return;  // TODO: patch until full-graph sync is working; drivers should be able to assume that nodeIDs refer to valid objects

            var setter = node.private.setters && node.private.setters[propertyName];

            if ( setter && setter !== true ) { // is there is a setter (and not just a guard value)
                try {
                    var valueJS = valueJSFromKernel.call( this, propertyValue );
                    var resultJS = setter.call( node, valueJS );
                    return valueKernelFromJS.call( this, resultJS );
                } catch ( e ) {
                    this.logger.warnx( "settingProperty", nodeID, propertyName, propertyValue,
                        "exception in setter:", utility.exceptionMessage( e ) );
                }
            }

            return undefined;
        },

        // -- gettingProperty ----------------------------------------------------------------------

        gettingProperty: function( nodeID, propertyName, propertyValue ) {

            var node = this.nodes[nodeID];
            var getter = node.private.getters && node.private.getters[propertyName];

            if ( getter && getter !== true ) { // is there is a getter (and not just a guard value)
                try {
                    var resultJS = getter.call( node );
                    return valueKernelFromJS.call( this, resultJS );
                } catch ( e ) {
                    this.logger.warnx( "gettingProperty", nodeID, propertyName, propertyValue,
                        "exception in getter:", utility.exceptionMessage( e ) );
                }
            }

            return undefined;
        },

        // -- creatingMethod -----------------------------------------------------------------------

        creatingMethod: function( nodeID, methodName, methodParameters, methodBody ) {

            var node = this.nodes[nodeID];

            createMethodAccessor.call( this, node.methods, methodName );

node.hasOwnProperty( methodName ) ||  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
            createMethodAccessor.call( this, node, methodName );

            // Invalidate the "future" cache.

            node.private.change++;

            // Delegate to `settingMethod`.

            return this.settingMethod( nodeID, methodName, {

                parameters: methodParameters,
                body: methodBody,

                type: typeof methodBody === "string" || methodBody instanceof String ?
                    scriptMediaType : undefined,  // TODO: heuristic duplicated in vwf.js `normalizedHandler`.
            } );

        },

        // TODO: deletingMethod

        // -- settingMethod ------------------------------------------------------------------------

        settingMethod: function( nodeID, methodName, methodHandler ) {

            var node = this.nodes[nodeID];

            var self = this;

            var body = functionFromHandler( methodHandler, logException,
                configuration.active[ "preserve-script-closures" ] );

            if ( body ) {
                node.private.bodies[ methodName ] = body;
                return handlerFromFunction( body );  // TODO: shortcut to avoid retrieving this?
            } else  {
                delete node.private.bodies[ methodName ];
            }

            function logException( exception ) {
                self.logger.warnx( "settingMethod", nodeID, methodName, methodHandler.parameters,
                    "exception evaluating body:", utility.exceptionMessage( exception ) );
            }

            return undefined;
        },

        // -- gettingMethod ------------------------------------------------------------------------

        gettingMethod: function( nodeID, methodName ) {

            var node = this.nodes[nodeID];
            var body = node.private.bodies && node.private.bodies[methodName];

            if ( body ) {
                return handlerFromFunction( body );
            }

            return undefined;
        },

        // -- callingMethod ------------------------------------------------------------------------

        callingMethod: function( nodeID, methodName, methodParameters ) {

            var node = this.nodes[nodeID];
            var body = node.private.bodies && node.private.bodies[methodName];

            if ( body ) {
                try {
                    var parametersJS = parametersJSFromKernel.call( this, methodParameters );
                    var resultJS = body.apply( node, parametersJS );
                    return valueKernelFromJS.call( this, resultJS );
                } catch ( e ) {
                    this.logger.warnx( "callingMethod", nodeID, methodName, methodParameters, // TODO: limit methodParameters for log
                        "exception:", utility.exceptionMessage( e ) );
                }
            }

            return undefined;
        },

        // -- creatingEvent ------------------------------------------------------------------------

        creatingEvent: function( nodeID, eventName, eventParameters ) {

            var node = this.nodes[nodeID];

            createEventAccessor.call( this, node.events, eventName );

node.hasOwnProperty( eventName ) ||  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
            createEventAccessor.call( this, node, eventName );

            // Invalidate the "future" cache.

            node.private.change++;

        },

        // -- addingEventListener ------------------------------------------------------------------

        addingEventListener: function( nodeID, eventName, eventListenerID, eventHandler, eventContextID, eventPhases ) {

            var node = this.nodes[nodeID];

            // Create the listeners collection if this is the first listener added for an event on a
            // prototype.

            if ( ! node.private.listeners[eventName] ) {
                node.private.listeners[eventName] = [];
            }

            // Build a `Listener` from the `Handler` and the context and phases.

            var eventListener = utility.merge( eventHandler, {
                context: eventContextID,
                phases: eventPhases,
            } );

            // Delegate to `settingEventListener`.

            return this.settingEventListener( nodeID, eventName, eventListenerID, eventListener ) ?
                true : undefined;
        },

        // -- removingEventListener ----------------------------------------------------------------

        removingEventListener: function( nodeID, eventName, eventListenerID ) {

            var node = this.nodes[nodeID];

            var listeners = node.private.listeners[eventName];

            if ( listeners && listeners[ eventListenerID ] ) {
                delete listeners[ eventListenerID ];
                return true;
            }

            return undefined;
        },

        // -- settingEventListener -----------------------------------------------------------------

        settingEventListener: function( nodeID, eventName, eventListenerID, eventListener ) {

            var node = this.nodes[nodeID];

            var self = this;

            var listeners = node.private.listeners[eventName];

            var handler = functionFromHandler( eventListener, logException,
                configuration.active[ "preserve-script-closures" ] );

            if ( handler ) {

                listeners[ eventListenerID ] = {
                    handler: handler,
                    context: eventListener.context,
                    phases: eventListener.phases,
                };

                // Kernel actions that set a value allow the driver to modify the value assigned.
                // The result of the action is the actually-assigned value reported by the driver.

                // Here, we should return a `Listener` derived from the function we just rendered so
                // that `kernel.setEvent` will return the same result that a following
                // `kernel.getEvent` would. However, since `Function.toString` is relatively heavy,
                // we'll just return the incoming value until there is a demonstrated need for the
                // precise result.

                // return utility.merge( handlerFromFunction( listener.handler ), {
                //     context: listener.context,
                //     phases: listener.phases,
                // } );

                return eventListener;

            } else  {

                delete listeners[ eventListenerID ];

            }

            function logException( exception ) {
                self.logger.warnx( "settingEventListener", nodeID, eventName, eventListenerID,
                    "exception evaluating listener:", utility.exceptionMessage( exception ) );
            }

            return undefined;
        },

        // -- gettingEventListener -----------------------------------------------------------------

        gettingEventListener: function( nodeID, eventName, eventListenerID ) {

            var node = this.nodes[nodeID];

            var listeners = node.private.listeners[eventName];

            if ( listeners ) {

                var listener = listeners[ eventListenerID ];

                return utility.merge( handlerFromFunction( listener.handler ), {
                    context: listener.context,
                    phases: listener.phases,
                } );

            }

            return undefined;
        },

        // -- flushingEventListeners ---------------------------------------------------------------

        flushingEventListeners: function( nodeID, eventName, eventContextID ) {

            // Prepare the return value
            var removedListenerIDs = [];

            // Extract the listeners of the specified node
            var node = this.nodes[ nodeID ];
            var listeners = node.private.listeners[ eventName ];

            // If listeners exist for the given eventName, loop through them, removing any for which
            // the context is the node specified by the parameter eventContextID
            if ( listeners ) {
                listeners.forEach( function( listener, listenerID ) {
                    if ( listener.context === eventContextID ) {
                        delete listeners[ listenerID ];
                        removedListenerIDs.push( listenerID );
                    }
                } );
            }
            return removedListenerIDs;
        },

        // -- firingEvent --------------------------------------------------------------------------

        firingEvent: function( nodeID, eventName, eventParameters ) {

            var phase = eventParameters && eventParameters.phase; // the phase is smuggled across on the parameters array  // TODO: add "phase" as a fireEvent() parameter? it isn't currently needed in the kernel public API (not queueable, not called by the drivers), so avoid if possible

            var node = this.nodes[nodeID];
            var listeners = findListeners( node, eventName );

            var parametersJS = parametersJSFromKernel.call( this, eventParameters );

            var self = this;

            // Call the handlers registered for the event, and calculate the logical OR of each
            // result. Normally, callers to fireEvent() ignore the handler result, but dispatched
            // events use the return value to determine when an event has been handled as it bubbles
            // up from its target.

            var handled = listeners && listeners.reduce( function( handled, listener ) {

                // Call the handler. If a phase is provided, only call handlers tagged for that
                // phase.

                try {
                    if ( ! phase || listener.phases && listener.phases.indexOf( phase ) >= 0 ) {
                        var contextNode = self.nodes[ listener.context ] || self.nodes[ 0 ];  // default context is the global root  // TODO: this presumes this.creatingNode( undefined, 0 ) is retained above
                        var resultJS = listener.handler.apply( contextNode, parametersJS );
                        var result = valueKernelFromJS.call( self, resultJS );
                        return handled || result || result === undefined;  // interpret no return as "return true"
                    }
                } catch ( e ) {
                    self.logger.warnx( "firingEvent", nodeID, eventName, eventParameters,  // TODO: limit eventParameters for log
                        "exception:", utility.exceptionMessage( e ) );
                }

                return handled;

            }, false );

            return handled;
        },

        // -- executing ----------------------------------------------------------------------------

        executing: function( nodeID, scriptText, scriptType ) {

            var node = this.nodes[nodeID];

            if ( scriptType == scriptMediaType ) {
                try {
                    var resultJS = ( function( scriptText ) { return eval( scriptText ) } ).call( node, scriptText || "" );
                    return valueKernelFromJS.call( this, resultJS );
                } catch ( e ) {
                    this.logger.warnx( "executing", nodeID,
                        ( scriptText || "" ).replace( /\s+/g, " " ).substring( 0, 100 ), scriptType, "exception:", utility.exceptionMessage( e ) );
                }
            }

            return undefined;
        },

    } );

    // == Private functions ========================================================================

    // -- proxiedBehavior --------------------------------------------------------------------------

    function proxiedBehavior( prototype, behavior ) { // invoke with the model as "this"  // TODO: this is a lot like createProperty()/createMethod()/createEvent(), and refreshedFuture(). Find a way to merge.  // TODO: nodes need to keep a list of proxies on them and callback here to refresh after changes

        var self = this;

        var proxy = Object.create( prototype );

        Object.defineProperty( proxy, "private", {
            value: {}
        } );

        proxy.private.origin = behavior; // the node we're the proxy for

        Object.defineProperty( proxy, "id", {
            value: behavior.id,
            enumerable: true,
        } );

        proxy.name = behavior.name;

        proxy.parent = behavior.parent;

        proxy.source = behavior.source;
        proxy.type = behavior.type;

        proxy.initialize = behavior.initialize;

        proxy.properties = Object.create( prototype.properties || Object.prototype, {
            node: { value: proxy } // for proxy.properties accessors (non-enumerable)  // TODO: hide this better
        } );

        proxy.private.getters = Object.create( prototype.private ?
            prototype.private.getters : Object.prototype
        );

        proxy.private.setters = Object.create( prototype.private ?
            prototype.private.setters : Object.prototype
        );

        for ( var propertyName in behavior.properties ) {

            if ( behavior.properties.hasOwnProperty( propertyName ) ) {

                ( function( propertyName ) {
                    createPropertyAccessor.call( self, proxy.properties, propertyName );
proxy.hasOwnProperty( propertyName ) ||  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
                    createPropertyAccessor.call( self, proxy, propertyName );
                } )( propertyName );
            
                if ( behavior.private.getters.hasOwnProperty( propertyName ) ) {
                    proxy.private.getters[propertyName] = behavior.private.getters[propertyName];
                }

                if ( behavior.private.setters.hasOwnProperty( propertyName ) ) {
                    proxy.private.setters[propertyName] = behavior.private.setters[propertyName];
                }

            }

        }

        proxy.methods = Object.create( prototype.methods || Object.prototype, {
            node: { value: proxy } // for proxy.methods accessors (non-enumerable)  // TODO: hide this better
        } );

        proxy.private.bodies = Object.create( prototype.private ?
            prototype.private.bodies : Object.prototype
        );

        for ( var methodName in behavior.methods ) {

            if ( behavior.methods.hasOwnProperty( methodName ) ) {

                ( function( methodName ) {
                    createMethodAccessor.call( self, proxy.methods, methodName );
proxy.hasOwnProperty( methodName ) ||  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
                    createMethodAccessor.call( self, proxy, methodName );
                } )( methodName );
            
                if ( behavior.private.bodies.hasOwnProperty( methodName ) ) {
                    proxy.private.bodies[methodName] = behavior.private.bodies[methodName];
                }

            }

        }

        proxy.events = Object.create( prototype.events || Object.prototype, {
            node: { value: proxy } // for proxy.events accessors (non-enumerable)  // TODO: hide this better
        } );

        proxy.private.listeners = {}; // not delegated to the prototype as with getters, setters, and bodies; findListeners() filters recursion

        for ( var eventName in behavior.events ) {

            if ( behavior.events.hasOwnProperty( eventName ) ) {

                ( function( eventName ) {
                    createEventAccessor.call( self, proxy.events, eventName );
proxy.hasOwnProperty( eventName ) ||  // TODO: recalculate as properties, methods, events and children are created and deleted; properties take precedence over methods over events over children, for example
                    createEventAccessor.call( self, proxy, eventName );
                } )( eventName );

            }

        }

        for ( var eventName in behavior.private.listeners ) { // outside of the behavior.events loop as with getters, setters, and bodies; listeners may appear above the event definition
            if ( behavior.private.listeners.hasOwnProperty( eventName ) ) {
                proxy.private.listeners[eventName] = behavior.private.listeners[eventName];
            }
        }

        proxy.private.future = Object.create( prototype.private ?
            prototype.private.future : Object.prototype
        );

        Object.defineProperty( proxy.private.future, "private", {
            value: {
                when: 0,
                callback: undefined,
                change: 0,
            }
        } );

        proxy.private.change = behavior.private.change;

        return proxy;
    }

    // -- refreshedFuture --------------------------------------------------------------------------

    function refreshedFuture( node, when, callback ) { // invoke with the model as "this"

        var self = this;

        if ( Object.getPrototypeOf( node ).private ) {
            refreshedFuture.call( this, Object.getPrototypeOf( node ) );
        }

        var future = node.private.future;

        future.private.when = when;
        future.private.callback = callback;  // TODO: would like to be able to remove this reference after the future call has completed

        if ( future.private.change < node.private.change ) { // only if out of date

            Object.defineProperty( future, "id", {
                value: node.id,
                enumerable: true,
            } );

            future.properties = Object.create( Object.getPrototypeOf( future ).properties || Object.prototype, {
                node: { value: future } // for future.properties accessors (non-enumerable)  // TODO: hide this better
            } );

            for ( var propertyName in node.properties ) {

                if ( node.properties.hasOwnProperty( propertyName ) ) {

                    ( function( propertyName ) {
                        createPropertyAccessor.call( self, future.properties, propertyName );
future.hasOwnProperty( propertyName ) ||  // TODO: calculate so that properties take precedence over methods over events, for example
                        createPropertyAccessor.call( self, future, propertyName );
                    } )( propertyName );
                
                }
    
            }

            future.methods = Object.create( Object.getPrototypeOf( future ).methods || Object.prototype, {
                node: { value: future } // for future.methods accessors (non-enumerable)  // TODO: hide this better
            } );

            for ( var methodName in node.methods ) {

                if ( node.methods.hasOwnProperty( methodName ) ) {

                    ( function( methodName ) {
                        createMethodAccessor.call( self, future.methods, methodName, true );
future.hasOwnProperty( methodName ) ||  // TODO: calculate so that properties take precedence over methods over events, for example
                        createMethodAccessor.call( self, future, methodName, true );
                    } )( methodName );

                }

            }

            future.events = Object.create( Object.getPrototypeOf( future ).events || Object.prototype, {
                node: { value: future } // for future.events accessors (non-enumerable)  // TODO: hide this better
            } );

            for ( var eventName in node.events ) {

                if ( node.events.hasOwnProperty( eventName ) ) {

                    ( function( eventName ) {
                        createEventAccessor.call( self, future.events, eventName, undefined, true );
future.hasOwnProperty( eventName ) ||  // TODO: calculate so that properties take precedence over methods over events, for example
                        createEventAccessor.call( self, future, eventName, undefined, true );
                    } )( eventName );

                }

            }

            future.private.change = node.private.change;

        }

        return future;
    }

    /// Define a (JavaScript) accessor property on a node or a node's `properties` collection that
    /// will manipulate a (VWF) property on the node.
    /// 
    /// Reading `node.properties.name` invokes the `get` accessor, which calls `kernel.getProperty`
    /// to return the value for the property on the node. Writing `node.properties.name` invokes
    /// the `set` accessor, which calls `kernel.setProperty` to assign a new value to the property
    /// on its node.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `createPropertyAccessor.call( driver, container, propertyName )`.
    /// 
    /// @param {Object} container
    ///   A `node` or `node.properties` object to receive the property.
    /// @param {String} propertyName
    ///   The name of the property to create on `container`.

    function createPropertyAccessor( container, propertyName ) {

        var self = this;

        Object.defineProperty( container, propertyName, {

            // On read, call `kernel.getProperty` and return the result.

            get: function() {  // `this` is the container
                var node = this.node || this;  // the node via node.properties.node, or just node
                var resultKernel = self.kernel.getProperty( node.id, propertyName,
                    node.private.when, node.private.callback );
                return valueJSFromKernel.call( self, resultKernel );
            },

            // On write, pass the assigned value to `kernel.setProperty`.

            set: function( value ) {  // `this` is the container
                var node = this.node || this;  // the node via node.properties.node, or just node
                var valueKernel = valueKernelFromJS.call( self, value );
                self.kernel.setProperty( node.id, propertyName, valueKernel,
                    node.private.when, node.private.callback );
            },

            enumerable: true,

        } );

    }

    /// Define an accessor property on a node or a node's `methods` collection that manipulates a
    /// method on the node.
    /// 
    /// Reading `node.methods.name` returns a function that when called calls `kernel.callMethod` to
    /// invoke the method on the node. Writing a function object to `node.methods.name` will set the
    /// method body to the assigned function.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `createMethodAccessor.call( driver, container, methodName )`.
    /// 
    /// @param {Object} container
    ///   A `node` or `node.methods` object to receive the property.
    /// @param {String} methodName
    ///   The name of the property to create on `container`.
    /// @param {Boolean} [unsettable]
    ///   When truthy, don't create the `set` accessor. An unsettable method property doesn't allow
    ///   the method body to be changed.

    function createMethodAccessor( container, methodName, unsettable ) {

        var self = this;

        Object.defineProperty( container, methodName, {

            // On read, return a function that calls `kernel.callMethod` when invoked.

            get: function() {  // `this` is the container
                var node = this.node || this;  // the node via node.methods.node, or just node
                return function( /* parameter1, parameter2, ... */ ) {  // `this` is the container
                    var argumentsKernel = parametersKernelFromJS.call( self, arguments );
                    var resultKernel = self.kernel.callMethod( node.id, methodName, argumentsKernel,
                        node.private.when, node.private.callback );
                    return valueJSFromKernel.call( self, resultKernel );
                };
            },

            // On write, update the method body. `unsettable` methods don't accept writes.

            set: unsettable ? undefined : function( value ) {  // `this` is the container
                var node = this.node || this;  // the node via node.methods.node, or just node
                self.kernel.setMethod( node.id, methodName,
                    handlerFromFunction( value, configuration.active[ "preserve-script-closures" ] ) );
            },

            enumerable: true,

        } );

    }

    /// Define an accessor property on a node or a node's `events` collection that manipulates an
    /// event on the node. `createEventAccessor` is also used to define accessor properties at other
    /// locations on the node to expose the node's meta events.
    /// 
    /// Reading `node.events.name` returns a function that when called calls `kernel.fireEvent` to
    /// fire the event from the node. Writing a function object to `node.events.name` will add the
    /// assigned function as a new listener using default parameters. To add a listener with
    /// specified paramters, call the `node.events.add` helper function and assign the result to
    /// `node.events.name`. Remove a listener by calling the `node.events.remove` helper and
    /// assigning the result. Flush a set of listeners with the `node.events.flush` helper.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `createEventAccessor.call( driver, container, eventName [, eventNamespace ] [, unsettable ] )`.
    /// 
    /// @param {Object} container
    ///   A `node` or `node.events` object to receive the property. Meta events will attach to
    ///   `node.properties`, `node.methods`, `node.events`, and `node.children` as well.
    /// @param {String} eventName
    ///   The name of the property to create on `container`.
    /// @param {String} [eventNamespace]
    ///   For meta events, the namespace associated with the event.
    /// @param {Boolean} [unsettable]
    ///   When truthy, don't create the `set` accessor. An unsettable event property can't add or
    ///   remove listeners.

    function createEventAccessor( container, eventName, eventNamespace, unsettable ) {

        var self = this;

        Object.defineProperty( container, eventName, {

            // On read, return a function that calls `kernel.fireEvent` when invoked. Namespaced
            // events (which are meta events and controlled by the kernel) are ungettable and can't
            // be fired by the application.

            get: eventNamespace ? undefined : function() {  // `this` is the container

                var node = this.node || this;  // the node via node.*collection*.node, or just node

                return function( /* parameter1, parameter2, ... */ ) {  // `this` is the container

                    var argumentsKernel = parametersKernelFromJS.call( self, arguments );

                    var resultKernel = self.kernel.fireEvent( node.id, eventName, argumentsKernel,
                        node.private.when, node.private.callback );

                    return valueJSFromKernel.call( self, resultKernel );
                };

            },

            // On write, update the listeners. `unsettable` events don't accept writes.

            set: unsettable ? undefined : function( value ) {  // `this` is the container

                var node = this.node || this;  // the node via node.*collection*.node, or just node
                var namespacedName = eventNamespace ? [ eventNamespace, eventName ] : eventName;

                if ( typeof value === "function" || value instanceof Function ) {

                    // `container.*eventName* = handler` (context is the target node).

                    addListener( value, node );

                } else if ( value.add ) {

                    // `container.*eventName* = node.events.add( handler, phases, context, callback /* listenerID */ )`.

                    if ( ! value.phases || value.phases instanceof Array ) {
                        addListener( value.handler, value.context, value.phases, value.callback );
                    } else {
                        addListener( value.handler, value.context, [ value.phases ], value.callback );
                    }

                } else if ( value.remove ) {

                    // `container.*eventName* = node.events.remove( listenerID|handler )`.

                    // For `node.events.remove( listenerID )`, remove using the direct parameter.
                    // For `node.events.remove( handler )`, use the id that `addListener` attached
                    // to the handler.

                    self.kernel.removeEventListener( node.id, namespacedName,
                        value.handler ? value.handler.listenerID : value.id );

                } else if ( value.flush ) {

                    // `container.*eventName* = node.events.flush( context )`.

                    self.kernel.flushEventListeners( node.id, namespacedName,
                        value.context && value.context.id );
                }

                function addListener( handler, context, phases, callback ) {

                    var listenerID = self.kernel.addEventListener( node.id, namespacedName,
                        handlerFromFunction( handler, configuration.active[ "preserve-script-closures" ] ),
                        context && context.id, phases );

                    // For 0.6.23 and earlier, listeners were removed using a direct reference to
                    // the handler. For backward compatability, tag the handler with the listener id
                    // so that we can retrieve the id if the listener is removed by handler.

                    handler.listenerID = listenerID;

                    callback && callback.call( node, listenerID );

                }

            },

            // Meta events--including the `properties`, `methods`, and `events` `created` and
            // `deleted` events, and the `children` `added` and `removed` events--are not
            // enumerable.

            enumerable: ! eventNamespace,

        } );

    }

    /// Convert a `Handler` to a JavaScript function.
    /// 
    /// @param {Handler} handler
    ///   A `Handler` to convert to a function.
    /// @param {function} [errback]
    ///   If `errback` is provided, any exception that occurs during the conversion will be passed
    ///   to `errback` as `errback( exception )`.
    /// @param {boolean} [bypass]
    ///   Expect that `handler.body` is a function object instead of the string representation of
    ///   the function body. Return the function without any conversion. This parameter should only
    ///   be used in support of the backwards-compatability `preserve-script-closures` configuration
    ///   option.
    /// 
    /// @returns {function|undefined}
    ///   The function generated from `handler`, or `undefined` if `handler` does not describe a
    ///   JavaScript function or if the function could not be converted.

    function functionFromHandler( handler, errback /* exception */, bypass ) {

        if ( bypass && ( typeof handler.body === "function" || handler.body instanceof Function ) ) {

            return handler.body;

        } else if ( handler.type === scriptMediaType ) {

            var name = handler.name, parameters = handler.parameters, body = handler.body;

            var parameterString = parameters && parameters.length ?
                " " + parameters.join( ", " ) + " " :
                "";

            var prefix = "function(" + parameterString + ") {";
            var suffix = "}";

            var functionString, indentedBody;

            if ( body && body.length ) {
                if ( body.charAt( body.length-1 ) === "\n" ) {
                    indentedBody = body.match( /^[^\S\n]/ ) ? body : body.replace( /^./gm, "    $&" );
                    functionString = prefix + "\n" + indentedBody + suffix + "\n";
                } else {
                    functionString = prefix + " " + body + " " + suffix;
                }
            } else {
                functionString = prefix + suffix;
            }

            try {
                return eval( "( " + functionString + ")" );
            } catch( exception ) {
                errback && errback( exception );
            }

        }

        return undefined;
    }

    /// Convert a JavaScript `function` to a `Handler`.
    /// 
    /// @param {function} funcshun
    ///   A function to convert to a `Handler`.
    /// @param {boolean} [bypass]
    ///   Create an object having the form of a `Handler`, but with the `body` field set to the
    ///   function object instead of the string representation of the function body. The `name`,
    ///   `parameters`, and `type` fields will not be set. This parameter should only be used in
    ///   support of the backwards-compatability `preserve-script-closures` configuration option.
    /// 
    /// @returns {Handler|undefined}
    ///   The `Handler` generated from `funcshun`, or `undefined` if the function's `toString` could
    ///   not be parsed.

    function handlerFromFunction( funcshun, bypass ) {

        var name, parameters, body, type = scriptMediaType;

        var match, leadingMatch, trailingMatch, indention = "";

        if ( bypass ) {

            return {
                body: funcshun,
            };

        } else if ( match = /* assignment! */ functionRegex.exec( funcshun.toString() ) ) {

            name = match[1];

            // Trim the parameter string. Also remove the `/**/` that Chrome adds to the parameter
            // list for functions created using `Function( parameter, ..., body )`. See
            // `NewFunctionString` in http://code.google.com/p/v8/source/browse/trunk/src/v8natives.js.

            var parameterString = match[2].replace( /\/\*.*\*\//, "" ).trim();

            parameters = parameterString.length ? parameterString.split( "," ).map( function( parameter ) {
                return parameter.trim();
            } ) : undefined;

            // Trim the body string. Recognize block vs. inline formatting where possible and retain
            // the existing spacing.

            body = match[3];

            leadingMatch =  // leading spacing, if the leading brace is on its own line
                body.match( /^([^\S\n]*\n)([^\S\n]*)/ );

            trailingMatch = // trailing spacing, if the trailing brace is on own line
                body.match( /\n([^\S\n]*)$/ );

            // Trim the leading spaces. If the leading brace was on its own line, delete the empty
            // first line and take the body indention to be the next line's spacing. Otherwise, just
            // trim the beginning of the body.

            if ( leadingMatch ) {
                body = body.substr( leadingMatch[1].length );
                indention = leadingMatch[2];
            } else {
                body = body.replace( /^\s*/, "" );
            }

            // Trim the trailing spaces. If the trailing brace was on its own line, delete its
            // indention and take that as the body indention. The trailing brace indention takes
            // priority over indention taken from the leading line. If the trailing brace was not on
            // its own line, just trim the end of the body.

            if ( trailingMatch ) {
                body = body.substr( -trailingMatch[1] );
                indention = trailingMatch[1];
            } else {
                body = body.replace( /\s*$/, "" );
            }

            // If we recognized the body as an block (not inline with the braces), unindent it and
            // ensure that the last line ends with a newline.

            if ( leadingMatch || trailingMatch ) {
                body = body.replace( new RegExp( "^" + indention, "gm" ), "" );
                body = body.replace( /\n?$/, "\n" );
            }

            return {
                name: name,
                parameters: parameters,
                body: body,
                type: type,
            };

        }

        return undefined;
    }

    /// The `application/javascript` media type for scripts that this driver recognizes.
    /// 
    /// @field

    var scriptMediaType = "application/javascript";

    /// Regex to crack a `Function.toString()` result.
    /// 
    /// @field

    var functionRegex = new RegExp(
        "function" +                    // `function`
        "\\s*" +
        "([a-zA-Z_$][0-9a-zA-Z_$]*)?" + // optional name; capture #1
        "\\s*" +
        "\\(([^)]*)\\)" +               // `(...)`; capture #2 inside `()`
        "\\s*" +
        "\\{([^]*)\\}"                  // `{...}`; capture #3 inside `{}`
    );

    // -- findListeners ----------------------------------------------------------------------------

// TODO: this walks the full prototype chain and is probably horribly inefficient.

    function findListeners( node, eventName, targetOnly ) {

        var prototypeListeners = Object.getPrototypeOf( node ).private ?  // get any self-targeted listeners from the prototypes
            findListeners( Object.getPrototypeOf( node ), eventName, true ) : [];

        var nodeListeners = node.private.listeners && node.private.listeners[eventName] || [];

        if ( targetOnly ) {
            return prototypeListeners.concat( nodeListeners.filter( function( listener ) {
                return listener.context === node.id ||  // in the prototypes, select self-targeted listeners only
                    ( node.private.origin && listener.context === node.private.origin.id );
            } ) );
        } else {
            return prototypeListeners.map( function( listener ) {  // remap the prototype listeners to target the node
                return { handler: listener.handler, context: node.id, phases: listener.phases };
            } ).concat( nodeListeners );
        }

    }

    /// Transform node references in a component descriptor into kernel-style node references. The
    /// resulting object will be suitable for passing to `kernel.createNode`.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `componentKernelFromJS.call( driver, component )`.
    /// 
    /// @param {String|Object} component
    ///   A component URI or descriptor. A URI will pass through unchanged (as will all descriptor
    ///   fields that aren't node references.)
    /// 
    /// @returns {String|Object}
    ///   `component` with node references replaced with kernel-style node references.

    function componentKernelFromJS( component ) {
        return valueKernelFromJS.call( this, component );
    }

    /// Convert a parameter array of values using `valueKernelFromJS`.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `parametersKernelFromJS.call( driver, parameters )`.
    /// 
    /// @param {Object[]} parameters
    /// 
    /// @returns {Object}

    function parametersKernelFromJS( parameters ) {
        return valueKernelFromJS.call( this, parameters );
    }

    /// Convert a parameter array of values using `valueJSFromKernel`.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `parametersJSFromKernel.call( driver, parameters )`.
    /// 
    /// @param {Object[]} parameters
    /// 
    /// @returns {Object}

    function parametersJSFromKernel( parameters ) {
        return valueJSFromKernel.call( this, parameters );
    }

    /// Convert node references into special values that can pass through the kernel. These values
    /// are wrapped in such a way that they won't be confused with any other application value, and
    /// they will be replicated correctly by the kernel.
    /// 
    /// Other values are returned unchanged. Use `valueJSFromKernel` to retrieve the original.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `valueKernelFromJS.call( driver, value )`.
    /// 
    /// @param {Object} value
    /// 
    /// @returns {Object}

    function valueKernelFromJS( value ) {

        var self = this;

        return utility.transform( value, function( object, names, depth, finished ) {

            if ( valueIsNode.call( self, object ) ) {
                finished();
                return kutility.nodeReference( object.id );
            } else if ( object && object.buffer && object.buffer.toString() === "[object ArrayBuffer]" ) {
                finished();
                return object;
            } else if ( kutility.valueIsNodeReference( object ) ) {
                finished();
                self.logger.warnx( "valueKernelFromJS", "javascript-format value contains a kernel-format node reference" );
                return object;
            } else {
                return object;
            }

        } );

    }

    /// Convert values wrapped by `valueKernelFromJS` into their original form for use in the
    /// JavaScript driver's execution environment.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `valueJSFromKernel.call( driver, value )`.
    /// 
    /// @param {Object} value
    /// 
    /// @returns {Object}

    function valueJSFromKernel( value ) {

        var self = this;

        return utility.transform( value, function( object, names, depth, finished ) {

            if ( kutility.valueIsNodeReference( object ) ) {
                finished();
                return self.nodes[ object.id ];
            } else if ( object && object.buffer && object.buffer.toString() === "[object ArrayBuffer]" ) {
                finished();
                return object;
            } else if ( valueIsNode.call( self, object ) ) {
                finished();
                self.logger.warnx( "valueJSFromKernel", "kernel-format value contains a javascript-format node reference" );
                return object;
            } else {
                return object;
            }

        } );

    }

    /// Determine if a value is a `model/javascript` node.
    /// 
    /// This function must run as a method of the driver. Invoke it as:
    ///   `valueIsNode.call( driver, value )`.
    /// 
    /// @param {Object} value
    /// 
    /// @returns {Boolean}

    function valueIsNode( value ) {

        return this.protoNode &&  // our proxy for the node.vwf prototype
            ( this.protoNode.isPrototypeOf( value ) || value === this.protoNode );
    }

    return exports;

} );
