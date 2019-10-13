/*
The MIT License (MIT)
Copyright (c) 2014-2019 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

import { Helpers } from '/helpers.js';

class ReflectorClient {
    constructor() {
        console.log("reflector client constructor");
        this.helpers = new Helpers;
        this.socket = undefined;
    }

    connect(component_uri_or_json_or_object, path){

        function isSocketIO07() {
            //return ( parseFloat( io.version ) >= 0.7 );
            return true
        } 

        try {

            let objToRef = this.helpers.reduceSaveObject(path);

            var options = {

                // The socket is relative to the application path.

                // resource: window.location.pathname.slice( 1,
                //      window.location.pathname.lastIndexOf("/") ),

                query: {
                    pathname: window.location.pathname.slice( 1,
                        window.location.pathname.lastIndexOf("/") ),
                    appRoot: "./public",
                    path: JSON.stringify(objToRef)//JSON.stringify(path)
                  },
                // query: 'pathname=' + window.location.pathname.slice( 1,
                //     window.location.pathname.lastIndexOf("/") ),

                // Use a secure connection when the application comes from https.
                
                secure: window.location.protocol === "https:",

                // Don't attempt to reestablish lost connections. The client reloads after a
                // disconnection to recreate the application from scratch.

                //reconnect: false,
                reconnection: false,
                upgrade: false,
                transports: ['websocket']

            };

            if ( isSocketIO07() ) {

                //window.location.host
        var host = window._app.reflectorHost; //localStorage.getItem('lcs_reflector'); 
        //if(!host) host = 'http://localhost:3002'; //window.location.origin;       
        this.socket = io.connect( host, options );
                

            } else {  // Ruby Server -- only supports socket.io 0.6

                io.util.merge( options, {

                    // For socket.io 0.6, specify the port since the default isn't correct when
                    // using https.

                    port: window.location.port ||
                        ( window.location.protocol === "https:" ? 443 : 80 ),

                    // The ruby socket.io server only supports WebSockets. Don't try the others.

                    transports: [
                        'websocket',
                    ],

                    // Increase the timeout because of starvation while loading the scene. The
                    // server timeout must also be increased. (For socket.io 0.7+, the client
                    // timeout is controlled by the server.)

                    transportOptions: {
                        "websocket": { timeout: 90000 },
                    },

                } );

             this.socket = io.connect( undefined, options );
            }

        } catch ( e ) {

            // If a connection to the reflector is not available, then run in single-user mode.
            // Messages intended for the reflector will loop directly back to us in this case.
            // Start a timer to monitor the incoming queue and dispatch the messages as though
            // they were received from the server.

            vwf.dispatch();

            setInterval( function() {

                var fields = {
                    time: vwf.now + 0.010, // TODO: there will be a slight skew here since the callback intervals won't be exactly 10 ms; increment using the actual delta time; also, support play/pause/stop and different playback rates as with connected mode.
                    origin: "reflector",
                };

                vwf.private.queue.insert( fields, true ); // may invoke dispatch(), so call last before returning to the host

            }, 10 );

        }

        if ( this.socket ) {

            this.socket.on('connect_error', function(err) {
                console.log(err);
                var errDiv = document.createElement("div");
                errDiv.innerHTML = "<div class='vwf-err' style='z-index: 10; position: absolute; top: 80px; right: 50px'>Connection error!" + err + "</div>";
                document.querySelector('body').appendChild(errDiv);
                
            });

            this.socket.on( "connect", function() {

                vwf.logger.infox( "-socket", "connected" );

                if ( isSocketIO07() ) {
                    vwf.moniker_ = this.id;                        
                } else {  //Ruby Server
                    vwf.moniker_ = this.transport.sessionid;
                }

            } );

            // Configure a handler to receive messages from the server.
            
            // Note that this example code doesn't implement a robust parser capable of handling
            // arbitrary text and that the messages should be placed in a dedicated priority
            // queue for best performance rather than resorting the queue as each message
            // arrives. Additionally, overlapping messages may cause actions to be performed out
            // of order in some cases if messages are not processed on a single thread.

            this.socket.on( "message", function( message ) {

                // vwf.logger.debugx( "-socket", "message", message );

                try {

                    if ( isSocketIO07() ) {
                        var fields = message;
                    } else { // Ruby Server - Unpack the arguements
                        var fields = JSON.parse( message );
                    }

                    fields.time = Number( fields.time );
                    // TODO: other message validation (check node id, others?)

                    fields.origin = "reflector";

                    // Update the queue.  Messages in the queue are ordered by time, then by order of arrival.
                    // Time is only advanced if the message has no action, meaning it is a tick.

                    vwf.private.queue.insert( fields, !fields.action ); // may invoke dispatch(), so call last before returning to the host

                    // Each message from the server allows us to move time forward. Parse the
                    // timestamp from the message and call dispatch() to execute all queued
                    // actions through that time, including the message just received.
                
                    // The simulation may perform immediate actions at the current time or it
                    // may post actions to the queue to be performed in the future. But we only
                    // move time forward for items arriving in the queue from the reflector.

                } catch ( e ) {

                    vwf.logger.warn( fields.action, fields.node, fields.member, fields.parameters,
                        "exception performing action:", require( "vwf/utility" ).exceptionMessage( e ) );

                }

            } );

            this.socket.on( "disconnect", function() {

                vwf.logger.infox( "-socket", "disconnected" );

                // Reload to rejoin the application.

                window.location = window.location.href;

            } );

            this.socket.on( "error", function() { 

                //Overcome by compatibility.js websockets check
                document.querySelector('body').innerHTML = "<div class='vwf-err'>WebSockets connections are currently being blocked. Please check your proxy server settings.</div>";
                // jQuery('body').html("<div class='vwf-err'>WebSockets connections are currently being blocked. Please check your proxy server settings.</div>"); 

            } );

            if ( !isSocketIO07() ) {
                // Start communication with the reflector. 

                this.socket.connect();  // TODO: errors can occur here too, particularly if a local client contains the socket.io files but there is no server; do the loopback here instead of earlier in response to new io.Socket.
            }

        } else if ( component_uri_or_json_or_object ) {

            // Load the application. The application is rooted in a single node constructed here
            // as an instance of the component passed to initialize(). That component, its
            // prototype(s), and its children, and their prototypes and children, flesh out the
            // entire application.

            // TODO: add note that this is only for a self-determined application; with socket, wait for reflection server to tell us.
            // TODO: maybe depends on component_uri_or_json_or_object too; when to override and not connect to reflection server?

            this.createNode( component_uri_or_json_or_object, "application" );

        } else {  // TODO: also do this if component_uri_or_json_or_object was invalid and createNode() failed

            // TODO: show a selection dialog

        }

    }


}

export { ReflectorClient }