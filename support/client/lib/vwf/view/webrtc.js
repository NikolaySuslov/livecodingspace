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

/// @module vwf/view/webrtc
/// @requires vwf/view

define( [ "module", "vwf/view", "vwf/utility", "vwf/utility/color", "jquery" ], function( module, view, utility, Color, $ ) {

    return view.load( module, {

        // == Module Definition ====================================================================

        initialize: function( options ) {

            if ( !this.state ) {   
                this.state = {};
            }
            
            this.state.clients = {};
            this.state.instances = {};
            this.local = {
                "ID": undefined,
                "url": undefined,
                "stream": undefined,
                "sharing": { audio: true, video: true } 
            };

            if ( options === undefined ) { options = {}; }

            this.stereo = options.stereo !== undefined  ? options.stereo : false;
            this.videoElementsDiv = options.videoElementsDiv !== undefined  ? options.videoElementsDiv : 'videoSurfaces';
            this.videoProperties = options.videoProperties !== undefined  ? options.videoProperties : {};
            this.bandwidth = options.bandwidth;
            this.iceServers = options.iceServers !== undefined  ? options.iceServers : [ { "url": "stun:stun.l.google.com:19302" } ];
            this.debug = options.debug !== undefined ? options.debug : false;

            this.videosAdded = 0;
            this.msgQueue = [];

        },
  
        createdNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */ ) {

            if ( childExtendsID === undefined )
                return;

            var self = this, node;
            
            var protos = getPrototypes.call( self, childExtendsID )
   
            if ( isClientInstanceDef.call( this, protos ) && childName ) {
                
                node = {
                    "parentID": nodeID,
                    "ID": childID,
                    "extendsID": childExtendsID,
                    "implementsIDs": childImplementsIDs,
                    "source": childSource,
                    "type": childType,
                    "name": childName,
                    "prototypes": protos,
                };

                this.state.instances[ childID ] = node;

            } else if ( isClientDefinition.call( this, protos ) && childName ) {

                // check if this instance of client and if this client is for this instance
                // create a login for this 
                node = {
                    "parentID": nodeID,
                    "ID": childID,
                    "moniker": undefined,
                    "extendsID": childExtendsID,
                    "implementsIDs": childImplementsIDs,
                    "source": childSource,
                    "type": childType,
                    "name": childName,
                    "prototypes": protos,
                    "displayName": "",
                    "connection": undefined,
                    "localUrl": undefined, 
                    "remoteUrl": undefined,
                    //"color": "rgb(0,0,0)",
                    "createProperty": true, 
                    "sharing": { audio: true, video: true }                   
                };

                this.state.clients[ childID ] = node;
                
                // add the client specific locals
                node.moniker = appMoniker.call( this, childName );
                //console.info( "new client moniker: " + node.moniker );
                node.displayName = undefined;
                node.prototypes = protos;

                if ( this.kernel.moniker() == node.moniker ) { 
                    this.local.ID = childID;
                    
                    
                } 
            }

        }, 

        deleteConnection: function(nodeID){

             // debugger;

            //if ( this.kernel.find( nodeID, "parent::element(*,'http://vwf.example.com/clients.vwf')" ).length > 0 ) {
                //if ( this.kernel.find( nodeID ).length > 0 ) {
                    var moniker = nodeID.slice(-20);//this.kernel.name( nodeID );
                    var client = undefined;
    
                    if ( moniker == this.kernel.moniker() ) {
                        
                        // this is the client that has left the converstaion
                        // go through the peerConnections and close the 
                        // all current connections
                        var peer, peerMoniker;
                        for ( var peerID in this.state.clients ) {
                            peer = this.state.clients[ peerID ];
                            peerMoniker = appMoniker.call( this, peer.name )
                            if ( peerMoniker != this.kernel.moniker() ) {
                                peer.connection && peer.connection.disconnect();
                                let peername = 'avatar-' + peerMoniker;
                                deletePeerConnection.call( this, peername);
                               
                            }
                        }
    
                    } else {
    
                        // this is a client who has has a peer leave the converstaion
                        // remove that client, and the 
                        client = findClientByMoniker.call( this, moniker );
                        if ( client ) {
                            client.connection && client.connection.disconnect();
    
                            //removeClient.call( this, client );
                            //delete this.state.clients[ client ]
                        }
    
                         
                    }

        },


        stopWebRTC: function(nodeID){

            if( this.local.stream ){

                
                var tracks =  this.local.stream.getTracks();
                tracks.forEach(function(track) {
                    track.stop();
                  });
                  this.local.stream = undefined;



                let vidui = document.querySelector('#webrtcvideo');
                const viduicomp = new mdc.iconToggle.MDCIconToggle(vidui); //new mdc.select.MDCIconToggle
                if (vidui) viduicomp.on = false;

                let micui = document.querySelector('#webrtcaudio');
                const micuicomp = new mdc.iconToggle.MDCIconToggle(micui);
                if (micui) micuicomp.on = false;

                this.deleteConnection(nodeID);
                this.kernel.callMethod(nodeID, "removeSoundWebRTC");
                this.kernel.callMethod(nodeID, "removeVideoTexture");
                
            }

        },
        startWebRTC: function(childID) {

            var client = this.state.clients[ childID ];

            if ( client ) {
                if ( this.local.ID == childID ){
                    
                    // local client object
                    // grab access to the webcam 
                    capture.call( this, this.local.sharing );
                   
                    var remoteClient = undefined;
                    // existing clients
                    for ( var clientID in this.state.clients ) {
                        
                        if ( clientID != this.local.ID ) {
                            // create property for this client on each existing client
                            remoteClient = this.state.clients[ clientID ];

                            if ( remoteClient.createProperty ) {
                                //console.info( "++ 1 ++    createProperty( "+clientID+", "+this.kernel.moniker()+" )" );  
                                remoteClient.createProperty = false;
                                this.kernel.createProperty( clientID, this.kernel.moniker() );                                
                            }                          
                        }
                    }
                } else {
                    // not the local client, but if the local client has logged
                    // in create the property for this on the new client
                    if ( this.local.ID )   {
                        if ( client.createProperty ) {
                            client.createProperty = false;
                            //console.info( "++ 2 ++    createProperty( "+childID+", "+this.kernel.moniker()+" )" );
                            this.kernel.createProperty( childID, this.kernel.moniker() );
                        }
                    }
                }
            }            

        },

        initializedNode: function( nodeID, childID, childExtendsID, childImplementsIDs, 
            childSource, childType, childIndex, childName ) {


            if ( childExtendsID === undefined )
                return;

            
        },

        deletedNode: function( nodeID ) {
            

            // debugger;

            //if ( this.kernel.find( nodeID, "parent::element(*,'http://vwf.example.com/clients.vwf')" ).length > 0 ) {
                //if ( this.kernel.find( nodeID ).length > 0 ) {
                var moniker = nodeID.slice(-20);//this.kernel.name( nodeID );
                var client = undefined;

                if ( moniker == this.kernel.moniker() ) {
                    
                    // this is the client that has left the converstaion
                    // go through the peerConnections and close the 
                    // all current connections
                    var peer, peerMoniker;
                    for ( var peerID in this.state.clients ) {
                        peer = this.state.clients[ peerID ];
                        peerMoniker = appMoniker.call( this, peer.name )
                        if ( peerMoniker != this.kernel.moniker() ) {
                            peer.connection && peer.connection.disconnect();
                            let peername = 'avatar-' + peerMoniker;
                            deletePeerConnection.call( this, peername);
                        }
                    }

                } else {

                    // this is a client who has has a peer leave the converstaion
                    // remove that client, and the 
                    client = findClientByMoniker.call( this, moniker );
                    if ( client ) {
                        client.connection && client.connection.disconnect();

                        removeClient.call( this, client );
                        delete this.state.clients[ client ]
                    }

                     
                }
            //}         

        },
  
        createdProperty: function( nodeID, propertyName, propertyValue ) {



            this.satProperty( nodeID, propertyName, propertyValue );
        },        

        initializedProperty: function( nodeID, propertyName, propertyValue ) {


            this.satProperty( nodeID, propertyName, propertyValue );
        },        

        satProperty: function( nodeID, propertyName, propertyValue ) {
            

            var client = this.state.clients[ nodeID ];

            if ( client ) {
                switch( propertyName ) {
                    
                    case "sharing":
                        if ( propertyValue ) {
                            client.sharing = propertyValue;
                            if ( nodeID == this.local.ID ) {
                                updateSharing.call( this, nodeID, propertyValue );
                            }
                        }
                        break;

                    case "localUrl":
                        if ( propertyValue ) {
                            if ( nodeID != this.local.ID ) {
                                client.localUrl = propertyValue;
                            }
                        }
                        break;

                    case "remoteUrl":
                        if ( propertyValue ) {
                            client.remoteUrl = propertyValue;
                         }
                        break;

                    case "displayName":
                        if ( propertyValue ) {
                            client.displayName = propertyValue;
                        }
                        break; 


                    default:  
                        // propertyName is the moniker of the client that 
                        // this connection supports
                        if ( nodeID == this.local.ID ) {
                            if ( propertyValue ) {
                                // propertyName - moniker of the client
                                // propertyValue - peerConnection message
                                handlePeerMessage.call( this, propertyName, propertyValue );
                            }
                        }
                        break;
                }
            }
        },

        gotProperty: function( nodeID, propertyName, propertyValue ) {

            var value = undefined;

            return value;
        },

        calledMethod: function( nodeID, methodName, methodParameters, methodValue ) {

            switch ( methodName ) {
                case "setLocalMute":
                    if ( this.kernel.moniker() == this.kernel.client() ) {
                        methodValue = setMute.call( this, methodParameters );
                    }
                    break;
                
                case "webrtcTurnOnOff":
                    if ( this.kernel.moniker() == this.kernel.client() ) {
                        console.log("WEBRTC turn on/off")
                        methodValue = turnOnOffTracks.call( this, methodParameters );
                    }
                    break;    

                case "webrtcMuteAudio":
                    if ( this.kernel.moniker() == this.kernel.client() ) {
                        methodValue = muteAudio.call( this, methodParameters[0] );
                    }
                    break;  

                case "webrtcMuteVideo":
                    if ( this.kernel.moniker() == this.kernel.client() ) {
                        methodValue = this.muteVideo.call( this, methodParameters[0] );
                    }
                    break; 

            }
        },       

        firedEvent: function( nodeID, eventName, eventParameters ) {
        },

        muteVideo: function ( mute ) {
            let str = this.local.stream;
            if ( str ) {
              
                var tracks = str.getVideoTracks();
    
                tracks.forEach(function(track) {
                    track.enabled = mute;
                  });
            }
        },

        muteAudio: function ( mute ) {
            let str = this.local.stream;
            if ( str ) {
              
                var tracks = str.getAudioTracks();
    
                tracks.forEach(function(track) {
                    track.enabled = mute;
                  });
            }
        }

        

       


    } );
 
    function createVideoElementAsAsset(id, local) {
        
          var video = document.querySelector('#' + id);
        
          if (!video) {
            video = document.createElement('video');
          }
        
          video.setAttribute('id', id);
          video.setAttribute('autoplay', true);
          //video.setAttribute('src', '');
          video.setAttribute("webkit-playsinline", true);
          video.setAttribute("controls", true);
          video.setAttribute("width", 640);
          video.setAttribute("height", 480);

          if (local) video.setAttribute("muted", true);
        
        //   let audioID = '#audio-' + id;
        //   var audio = document.querySelector(audioID);
        //   if (!audio) {
        //     audio = document.createElement('audio');
        //   }
        //   audio.setAttribute('id', audioID);

          var assets = document.querySelector('a-assets');
        
        //   if (!assets) {
        //     assets = document.createElement('a-assets');
        //     document.querySelector('a-scene').appendChild(assets);
        //   }
        
          if (!assets.contains(video)) {
            assets.appendChild(video);
          }
        
        //   if (!assets.contains(audio)) {
        //     assets.appendChild(audio);
        //   }

          return video //{'video': video, 'audio': audio};
        }


    function getPrototypes( extendsID ) {
        var prototypes = [];
        var id = extendsID;

        while ( id !== undefined ) {
            prototypes.push( id );
            id = this.kernel.prototype( id );
        }
                
        return prototypes;
    }

    function getPeer( moniker ) {
        var clientNode;
        for ( var id in this.state.clients ) {
            if ( this.state.clients[id].moniker == moniker ) {
                clientNode = this.state.clients[id];
                break;
            }
        }
        return clientNode;
    }

    function displayLocal( stream, name) {
        var id = this.kernel.moniker();
        return displayVideo.call( this, id, stream, this.local.url, name, id, true);
    }

    function displayVideo( id, stream, url, name, destMoniker, local) {
        
        let va = createVideoElementAsAsset(name, local);
        //video.setAttribute('src', url);
        va.srcObject = stream;

        //var audioCtx = new AudioContext();
        //var source = audioCtx.createMediaStreamSource(stream);
        //va.audio.src = stream;

        this.kernel.callMethod( 'avatar-'+id, "setVideoTexture", [name]);
        
        return id;
    }

    function removeVideo( client ) {
        
        // if ( client.videoDivID ) {
        //     var $videoWin = $( "#" + client.videoDivID );
        //     if ( $videoWin ) {
        //         $videoWin.remove();
        //     }
        //     client.videoDivID = undefined;
        // }

        // this.kernel.callMethod( this.kernel.application(), "removeVideo", [ client.moniker ] );

    }

    function displayRemote( id, stream, url, name, destMoniker, color ) {

        let audioID = 'audio-' + name;
        this.kernel.callMethod( 'avatar-'+id, "setSoundWebRTC", [audioID]);

        return displayVideo.call( this, id, stream, url, name, destMoniker, true );
    }

    function capture( media ) {

        if ( this.local.stream === undefined && ( media.video || media.audio ) ) {
            var self = this;

            var constraints = {
                audio: true,
                video: true
              };

            navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

            function handleError(error) {
                console.log('navigator.getUserMedia error: ', error);
              }

            function handleSuccess(stream) {
                // var videoTracks = stream.getVideoTracks();
                // console.log('Got stream with constraints:', constraints);
                // if (videoTracks.length) {
                //     videoTracks[0].enabled = true;
                // }

                self.local.url = "url" //URL.createObjectURL( stream );
                self.local.stream = stream;
                self.kernel.setProperty( self.local.ID, "localUrl", self.local.url );
                var localNode = self.state.clients[ self.local.ID ];


                self.muteAudio(false);
                self.muteVideo(false);

                let webRTCGUI = document.querySelector('#webrtcswitch');
                if (webRTCGUI) webRTCGUI.setAttribute("aria-pressed", true);

                let videoTracks = stream.getVideoTracks();
                let vstatus =  videoTracks[0].enabled;

                let vidui = document.querySelector('#webrtcvideo');
                const viduicomp = new mdc.iconToggle.MDCIconToggle(vidui); //new mdc.select.MDCIconToggle
                if (vidui) viduicomp.on = vstatus;

                let audioTracks = stream.getAudioTracks();
                let astatus =  audioTracks[0].enabled;

                let micui = document.querySelector('#webrtcaudio');
                const micuicomp = new mdc.iconToggle.MDCIconToggle(micui);
                if (micui) micuicomp.on = astatus;


               
                displayLocal.call( self, stream, localNode.displayName);
                sendOffers.call( self );
              } 
        }
    }  

    function appMoniker( name ) {
        return name.substr( 7, name.length-1 );
    }
    
    function findClientByMoniker( moniker ) {
        var client = undefined;
        for ( var id in this.state.clients ) {
            if ( client === undefined && moniker == this.state.clients[ id ].moniker ) {
                client = this.state.clients[ id ];
            }
        }
        return client;
    }

    function removeClient( client ) {
        if ( client ) {
            removeVideo.call( this, client );
        }
    }

    function sendOffers() {
        var peerNode;
        for ( var id in this.state.clients ) {
            if ( id != this.local.ID ) {
                peerNode = this.state.clients[ id ];
                
                // if there's a url then connect                     
                if ( peerNode.localUrl && peerNode.localUrl != "" && peerNode.connection === undefined ) {
                    createPeerConnection.call( this, peerNode, true );   
                }                
            }
        }
        

    }

    function updateSharing( nodeID, sharing ) {
        setMute.call( this, !sharing.audio );
        setPause.call( this, !sharing.video );
    }

    function turnOnOffTracks( mute ) {
        let str = this.local.stream;
        if ( str ) {
            var audioTracks = str.getAudioTracks();
            var videoTracks = str.getVideoTracks();

            audioTracks.forEach(function(track) {
                track.enabled = mute[0];
              });

              videoTracks.forEach(function(track) {
                track.enabled = mute[0];
              });
        }
    };

    function muteAudio( mute ) {
        let str = this.local.stream;
        if ( str ) {
            var audioTracks = str.getAudioTracks();

            audioTracks.forEach(function(track) {
                track.enabled = mute;
              });

        }
    };
   
    

    function setMute( mute ) {
        if ( this.local.stream && this.local.stream.audioTracks && this.local.stream.audioTracks.length > 0 ) {
          if ( mute !== undefined ) {
            this.local.stream.audioTracks[0].enabled = !mute;
          }
        }
    };

    function setPause( pause ) {
        if ( this.local.stream && this.local.stream.videoTracks && this.local.stream.videoTracks.length > 0 ) {
            if ( pause !== undefined ) {
                this.local.stream.videoTracks[0].enabled = !pause;
            }
        }
    }

    function release() {
      for ( id in this.connections ) {
          this.connections[id].disconnect();
      } 
      this.connections = {};
    }  

    function hasStream() {
        return ( this.stream !== undefined );
    }

    function createPeerConnection( peerNode, sendOffer ) {
        if ( peerNode ) {
            if ( peerNode.connection === undefined ) {
                peerNode.connection = new mediaConnection( this, peerNode );
                peerNode.connection.connect( this.local.stream, sendOffer );

                //if ( this.bandwidth !== undefined ) {
                //    debugger;
                //}
            }
        }
    }

    function handlePeerMessage( propertyName, msg ) {
        var peerNode = getPeer.call( this, propertyName )
        if ( peerNode ) {
            if ( peerNode.connection !== undefined ) {
                peerNode.connection.processMessage( msg );
            } else {
                if ( msg.type === 'offer' ) {
                    
                    this.msgQueue.unshift( msg );

                    peerNode.connection = new mediaConnection( this, peerNode );
                    peerNode.connection.connect( this.local.stream, false );

                    while ( this.msgQueue.length > 0 ) {
                      peerNode.connection.processMessage( this.msgQueue.shift() );
                    }
                    this.msgQueue = [];
                } else {
                    this.msgQueue.push( msg );
                }
            }
        }     
    }

    function deletePeerConnection( peerID ) {
        var peerNode = this.state.clients[ peerID ];
        if ( peerNode ) {
            peerNode.connection.disconnect();
            peerNode.connection = undefined;
        }
    } 

    function getConnectionStats() {
        var peerNode = undefined;
        for ( var id in this.state.clients ) {
            peerNode = this.state.clients[ id ];
            if ( peerNode && peerNode.connection ) {
                peerNode.connection.getStats();
            }
        } 
    }

    function isClientDefinition( prototypes ) {
        var foundClient = false;
        if ( prototypes ) {
            var len = prototypes.length;
            for ( var i = 0; i < len && !foundClient; i++ ) {
                foundClient = ( prototypes[i] == "http://vwf.example.com/aframe/avatar.vwf" );
            }
        }

        return foundClient;
    }

    function isClientInstanceDef( nodeID ) {
        return ( nodeID == "http://vwf.example.com/clients.vwf" );
    }

    function mediaConnection( view, peerNode ) {
        this.view = view;
        this.peerNode = peerNode;        
        
        // 
        this.stream = undefined;
        this.url = undefined;
        this.pc = undefined;
        this.connected = false;
        this.streamAdded = false;
        this.state = "created";

        // webrtc peerConnection parameters
        this.pc_config =  {'iceServers': [
            {'url': 'stun:stun.l.google.com:19302'},
            {'url': 'stun:stun1.l.google.com:19302'}
        ]};//{ "iceServers": this.view.iceServers };

        this.pc_constraints = { "optional": [ { "DtlsSrtpKeyAgreement": true } ] };
        // Set up audio and video regardless of what devices are present.
        this.sdpConstraints = {
                                'offerToReceiveAudio':1, 
                                'offerToReceiveVideo':1 };

        this.connect = function( stream, sendOffer ) {
            var self = this;
            if ( this.pc === undefined ) {
                if ( this.view.debug ) console.log("Creating PeerConnection.");
                
                var iceCallback = function( event ) {
                    //console.log( "------------------------ iceCallback ------------------------" );
                    if ( event.candidate ) {
                        var sMsg = { 
                            "type": 'candidate',
                            "label": event.candidate.sdpMLineIndex,
                            "id": event.candidate.sdpMid,
                            "candidate": event.candidate.candidate
                        };

                        // each client creates a property for each other
                        // the message value is broadcast via the property
                        self.view.kernel.setProperty( self.peerNode.ID, self.view.kernel.moniker(), sMsg );
                    } else {
                        if ( self.view.debug ) console.log("End of candidates.");
                    }
                }; 

                // if ( webrtcDetectedBrowser == "firefox" ) {
                //     this.pc_config = {"iceServers":[{"url":"stun:23.21.150.121"}]};
                // }

                try {
                    this.pc = new RTCPeerConnection( this.pc_config, this.pc_constraints);
                    this.pc.onicecandidate = iceCallback;

                    if ( self.view.debug ) console.log("Created RTCPeerConnnection with config \"" + JSON.stringify( this.pc_config ) + "\".");
                } catch (e) {
                    console.log("Failed to create PeerConnection, exception: " + e.message);
                    alert("Cannot create RTCPeerConnection object; WebRTC is not supported by this browser.");
                    return;
                } 

                this.pc.onnegotiationeeded = function( event ) {
                    //debugger;
                    //console.info( "onnegotiationeeded." );
                }

                this.pc.ontrack = function( event ) {
                    if ( self.view.debug ) console.log("Remote stream added.");
                    
                    self.stream = event.streams[0];

                    self.url = "url" //URL.createObjectURL( event.streams[0] );
                    
                    if ( self.view.debug ) console.log("Remote stream added.  url: " + self.url );

                    var divID = displayRemote.call( self.view, self.peerNode.moniker, self.stream, self.url, self.peerNode.displayName, view.kernel.moniker(), self.peerNode.color );
                    if ( divID !== undefined ) {
                        self.peerNode.videoDivID = divID;
                    }
                };

                this.pc.onremovestream = function( event ) {
                    if ( self.view.debug ) console.log("Remote stream removed.");
                };

                this.pc.onsignalingstatechange = function() {
                    //console.info( "onsignalingstatechange state change." );
                }

                this.pc.oniceconnectionstatechange = function( ) {
                    if ( self && self.pc ) {
                        var state = self.pc.signalingState || self.pc.readyState;
                        //console.info( "peerConnection state change: " + state );
                    } 
                }

                if ( stream ) {
                    
                    // stream.getVideoTracks();
                    // stream.getAudioTracks();

                    stream.getTracks().forEach(
                        function(track) {
                            self.pc.addTrack(
                            track,
                            stream
                          );
                        }
                      );

                    //this.pc.addStream( stream );
                    this.streamAdded = true;
                }

                if ( sendOffer ){
                    this.call();
                }
            }
            this.connected = ( this.pc !== undefined );
        };

        this.setMute = function( mute ) {
            if ( this.stream && this.stream.audioTracks && this.stream.audioTracks.length > 0 ) {
                if ( mute !== undefined ) {
                    this.stream.audioTracks[0].enabled = !mute;
                }
            }
        }

        this.setPause = function( pause ) {
            if ( this.stream && this.stream.videoTracks && this.stream.videoTracks.length > 0 ) {
                if ( pause !== undefined ) {
                    this.stream.videoTracks[0].enabled = !pause;
                }
            }
        }

        this.disconnect = function() {
            if ( this.view.debug ) console.log( "PC.disconnect  " + this.peerID );
            
            if ( this.pc ) {
                this.pc.close();
                this.pc = undefined;
            }
        };

        this.processMessage = function( msg ) {
            //var msg = JSON.parse(message); 
            if ( this.view.debug ) console.log('S->C: ' +  JSON.stringify(msg) );
            if ( this.pc ) {
                if ( msg.type === 'offer') {
                    // if ( this.view.stereo ) {
                    //     msg.sdp = addStereo( msg.sdp );
                    // }
                    this.pc.setRemoteDescription( new RTCSessionDescription( msg ) ); //msg.sdp
                    this.answer();
                } else if ( msg.type === 'answer' && this.streamAdded ) {
                    // if ( this.view.stereo ) {
                    //     msg.sdp = addStereo( msg.sdp );
                    // }                    
                    this.pc.setRemoteDescription( new RTCSessionDescription( msg ) ); //msg.sdp
                } else if ( msg.type === 'candidate' && this.streamAdded ) {
                    var candidate = new RTCIceCandidate( { 
                        "sdpMLineIndex": msg.label,
                        "candidate": msg.candidate 
                    } );
                    this.pc.addIceCandidate( candidate );
                } else if ( msg.type === 'bye' && this.streamAdded ) {
                    this.hangup();
                }
            } 
        };

        this.answer = function() {
            if ( this.view.debug ) console.log( "Send answer to peer" );
            
            var self = this;
            var answerer = function( sessionDescription ) {
                // // Set Opus as the preferred codec in SDP if Opus is present.
                // sessionDescription.sdp = self.preferOpus( sessionDescription.sdp );
                // sessionDescription.sdp = self.setBandwidth( sessionDescription.sdp );

                self.pc.setLocalDescription( sessionDescription );
                self.view.kernel.setProperty( self.peerNode.ID, self.view.kernel.moniker(), sessionDescription );
            };

            function onCreateSessionDescriptionError(error) {
                console.log('Failed to create session description: ' + error.toString());
              }

            this.pc.createAnswer(
                self.sdpConstraints
            ).then(
                answerer,
                onCreateSessionDescriptionError
              );
            //this.pc.createAnswer( answerer, null, this.sdpConstraints);
        };

        this.call = function() {
            var self = this;
            var constraints = {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            };

          
            var offerer = function( sessionDescription ) {

                self.pc.setLocalDescription(sessionDescription).then(
                    function() {
                      onSetLocalSuccess(self.pc);
                    },
                    onSetSessionDescriptionError
                  );

                  function onSetLocalSuccess(pc) {
                    console.log(self.pc + ' setLocalDescription complete');
                  }

                  function onSetSessionDescriptionError(error) {
                    console.log('Failed to set session description: ' + error.toString());
                  }
                // Set Opus as the preferred codec in SDP if Opus is present.
                // sessionDescription.sdp = self.preferOpus( sessionDescription.sdp );
                // sessionDescription.sdp = self.setBandwidth( sessionDescription.sdp );
                // self.pc.setLocalDescription( sessionDescription );
                
                //sendSignalMessage.call( sessionDescription, self.peerID );
                self.view.kernel.setProperty( self.peerNode.ID, self.view.kernel.moniker(), sessionDescription );
            };

            var onFailure = function(e) {
                console.log(e)
            }

            self.pc.createOffer(
                constraints
              ).then(
                offerer,
                onFailure
              );
            //this.pc.createOffer( offerer, onFailure, constraints );
        };

        this.setBandwidth = function( sdp ) {

            // apparently this only works in chrome
            if ( this.bandwidth === undefined || moz ) {
                return sdp;
            }

            // remove existing bandwidth lines
            sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');
            
            if ( this.bandwidth.audio ) {
                sdp = sdp.replace(/a=mid:audio\r\n/g, 'a=mid:audio\r\nb=AS:' + this.bandwidth.audio + '\r\n');
            }

            if ( this.bandwidth.video ) {
                sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:' + this.bandwidth.video + '\r\n');
            }

            if ( this.bandwidth.data /*&& !options.preferSCTP */ ) {
                sdp = sdp.replace(/a=mid:data\r\n/g, 'a=mid:data\r\nb=AS:' + this.bandwidth.data + '\r\n');
            }
            return sdp;
        }

        this.getStats = function(){
          if ( this.pc && this.pc.getStats ) {
            console.info( "pc.iceConnectionState = " + this.pc.iceConnectionState );
            console.info( " pc.iceGatheringState = " + this.pc.iceGatheringState );
            console.info( "        pc.readyState = " + this.pc.readyState );
            console.info( "    pc.signalingState = " + this.pc.signalingState );

            var consoleStats = function( obj ) {
                console.info( '   Timestamp:' + obj.timestamp );
                if ( obj.id ) {
                    console.info( '        id: ' + obj.id );
                }
                if ( obj.type ) {
                    console.info( '        type: ' + obj.type );
                }
                if ( obj.names ) {
                    var names = obj.names();
                    for ( var i = 0; i < names.length; ++i ) {
                        console.info( "         "+names[ i ]+": " + obj.stat( names[ i ] ) );
                    }
                } else {
                    if ( obj.stat && obj.stat( 'audioOutputLevel' ) ) {
                        console.info( "         audioOutputLevel: " + obj.stat( 'audioOutputLevel' ) );
                    }
                }
            };

            // local function
            var readStats = function( stats ) {
                var results = stats.result();
                var bitrateText = 'No bitrate stats';

                for ( var i = 0; i < results.length; ++i ) {
                    var res = results[ i ];
                    console.info( 'Report ' + i );
                    if ( !res.local || res.local === res ) {
                        
                        consoleStats( res );
                        // The bandwidth info for video is in a type ssrc stats record
                        // with googFrameHeightReceived defined.
                        // Should check for mediatype = video, but this is not
                        // implemented yet.
                        if ( res.type == 'ssrc' && res.stat( 'googFrameHeightReceived' ) ) {
                            var bytesNow = res.stat( 'bytesReceived' );
                            if ( timestampPrev > 0) {
                                var bitRate = Math.round( ( bytesNow - bytesPrev ) * 8 / ( res.timestamp - timestampPrev ) );
                                bitrateText = bitRate + ' kbits/sec';
                            }
                            timestampPrev = res.timestamp;
                            bytesPrev = bytesNow;
                        }
                    } else {
                        // Pre-227.0.1445 (188719) browser
                        if ( res.local ) {
                            console.info( "  Local: " );
                            consoleStats( res.local );
                        }
                        if ( res.remote ) {
                            console.info( "  Remote: " );
                            consoleStats( res.remote );
                        }
                    }
                }
                console.info( "    bitrate: " + bitrateText )
            } 

            this.pc.getStats( readStats );        
          }
        }

        this.hangup = function() {
            if ( this.view.debug ) console.log( "PC.hangup  " + this.id );
            
            if ( this.pc ) {
                this.pc.close();
                this.pc = undefined;
            }
        };

        this.mergeConstraints = function( cons1, cons2 ) {
            var merged = cons1;
            for (var name in cons2.mandatory) {
                merged.mandatory[ name ] = cons2.mandatory[ name ];
            }
            merged.optional.concat( cons2.optional );
            return merged;
        }

        // Set Opus as the default audio codec if it's present.
        this.preferOpus = function( sdp ) {
            var sdpLines = sdp.split( '\r\n' );

            // Search for m line.
            for ( var i = 0; i < sdpLines.length; i++ ) {
                if ( sdpLines[i].search( 'm=audio' ) !== -1 ) {
                    var mLineIndex = i;
                    break;
                } 
            }

            if ( mLineIndex === null ) {
                return sdp;
            }

            // for ( var i = 0; i < sdpLines.length; i++ ) {
            //     if ( i == 0 ) console.info( "=============================================" );
                
            //     console.info( "sdpLines["+i+"] = " + sdpLines[i] );
            // }

            // If Opus is available, set it as the default in m line.
            for ( var i = 0; i < sdpLines.length; i++ ) {

                if ( sdpLines[i].search( 'opus/48000' ) !== -1 ) {        
                    var opusPayload = this.extractSdp( sdpLines[i], /:(\d+) opus\/48000/i );
                    if ( opusPayload) {
                        sdpLines[ mLineIndex ] = this.setDefaultCodec( sdpLines[ mLineIndex ], opusPayload );
                    }
                    break;
                }
            }

            // Remove CN in m line and sdp.
            sdpLines = this.removeCN( sdpLines, mLineIndex );

            sdp = sdpLines.join('\r\n');
            return sdp;
        }

        // Set Opus in stereo if stereo is enabled.
        function addStereo( sdp ) {
            var sdpLines = sdp.split('\r\n');

            // Find opus payload.
            for (var i = 0; i < sdpLines.length; i++) {
              if (sdpLines[i].search('opus/48000') !== -1) {
                var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                break;
              }
            }

            // Find the payload in fmtp line.
            for (var i = 0; i < sdpLines.length; i++) {
              if (sdpLines[i].search('a=fmtp') !== -1) {
                var payload = extractSdp(sdpLines[i], /a=fmtp:(\d+)/ );
                if (payload === opusPayload) {
                  var fmtpLineIndex = i;
                  break;
                }
              }
            }
            // No fmtp line found.
            if (fmtpLineIndex === null)
              return sdp;

            // Append stereo=1 to fmtp line.
            sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat(' stereo=1');

            sdp = sdpLines.join('\r\n');
            return sdp;
        }

        // Strip CN from sdp before CN constraints is ready.
        this.removeCN = function( sdpLines, mLineIndex ) {
            var mLineElements = sdpLines[mLineIndex].split( ' ' );
            // Scan from end for the convenience of removing an item.
            for ( var i = sdpLines.length-1; i >= 0; i-- ) {
                var payload = this.extractSdp( sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i );
                if ( payload ) {
                    var cnPos = mLineElements.indexOf( payload );
                    if ( cnPos !== -1 ) {
                        // Remove CN payload from m line.
                        mLineElements.splice( cnPos, 1 );
                    }
                    // Remove CN line in sdp
                    sdpLines.splice( i, 1 );
                }
            }

            sdpLines[ mLineIndex ] = mLineElements.join( ' ' );
            return sdpLines;
        }

        this.extractSdp = function( sdpLine, pattern ) {
            var result = sdpLine.match( pattern );
            return ( result && result.length == 2 ) ? result[ 1 ] : null;
        }    

        // Set the selected codec to the first in m line.
        this.setDefaultCodec = function( mLine, payload ) {
            var elements = mLine.split( ' ' );
            var newLine = new Array();
            var index = 0;
            for ( var i = 0; i < elements.length; i++ ) {
                if ( index === 3 ) // Format of media starts from the fourth.
                    newLine[ index++ ] = payload; // Put target payload to the first.
                if ( elements[ i ] !== payload )
                    newLine[ index++ ] = elements[ i ];
            }
            return newLine.join( ' ' );
        }

    } 



} );
