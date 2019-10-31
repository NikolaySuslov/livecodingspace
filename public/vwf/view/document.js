"use strict";
/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

define( [ "module", "vwf/view", "vwf/utility"], function( module, view, utility) {

    return view.load( module, {

        // == Module Definition ====================================================================

        initialize: function() {
            window.vwf_view = this;
        },

        // == Model API ============================================================================

        createdNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                childSource, childType, childURI, childName, callback /* ( ready ) */ ) {

            var self = this;

            // At the root node of the application, load the UI chrome if available.
        
           

           

            if ( childID == this.kernel.application() &&
                    ( window.location.protocol == "http:" || window.location.protocol == "https:" ) ) {

                // Suspend the queue.

                callback( false );

                // Load the file and insert it into the main page.

               // var container = jQuery( "body" ).append( "<div />" ).children( ":last" );
               let container = document.createElement("div");
               document.querySelector("body").appendChild(container);
               //var container = document.querySelector("body").append( "<div />" ).children( ":last" );


               let path =  JSON.parse(localStorage.getItem('lcs_app')).path.public_path;
               let appName = JSON.parse(localStorage.getItem('lcs_app')).path.application.split(".").join("_");
               let dbPath = appName + '_html';
              let worldName = path.slice(1);
              let userDB = _LCSDB.user(_LCS_WORLD_USER.pub);


              function loadDoc(doc){

                var responseText = doc;

                  // If the overlay attached a `createdNode` handler, forward this first call
                 // since the overlay will have missed it.

                setInnerHtml(container, responseText);

                if ( self.createdNode !== Object.getPrototypeOf( self ).createdNode ) {
                 self.createdNode( nodeID, childID, childExtendsID, childImplementsIDs,
                     childSource, childType, childURI, childName );
             }

             // Remove the container div if an error occurred or if we received an empty
             // result. The server sends an empty document when the application doesn't
             // provide a chrome file.

             if (  responseText == "" ) {
                 container.remove();
             }

             // Resume the queue.

             
             //callback( true );

              }

              userDB.get('worlds').get(worldName).load(all=>{

                if(all){
                    if(Object.keys(all).includes(dbPath)){

                        //userDB.get('worlds').get(worldName).get(dbPath).get('file').once(function(res) { 
                        let res = all[dbPath].file;
                        loadDoc(res);
                        callback( true );
                       // })
                    } else {
                        //NEED TO FIXED!!! Error: Callback was already called.
                        // userDB.get('worlds').get('empty').get(dbPath).get('file').once(function(res) { 
                        //     loadDoc(res);
                        //     callback( true );
                        //     },{wait:300})

                          var emptyDoc = '<!DOCTYPE html><html><head><script type=\"text\/javascript\">\r\n\r\n        vwf_view.satProperty = function (nodeID, propertyName, propertyValue) {\r\n            if (propertyValue === undefined || propertyValue == null) {\r\n                return;\r\n            }\r\n        }\r\n\r\n\r\n    <\/script>\r\n<\/head>\r\n\r\n<body>\r\n<\/body>\r\n\r\n<\/html>';
                       
                          loadDoc(emptyDoc);
                          callback( true );
                        

                    }
                }
                
              },{wait:300})


              
   

            // fetch("admin/chrome", {
            //     method: 'get'
            // }).then(function(response) {
            //     return response.text();
            // }).catch(function(err) {
                
            //     container.remove();
            //     // Resume the queue.
            //     callback( true );

            // }).then(function(responseText) {
                
            //     // If the overlay attached a `createdNode` handler, forward this first call
            //         // since the overlay will have missed it.

            //        // setInnerHtml(container, responseText);

            //         if ( self.createdNode !== Object.getPrototypeOf( self ).createdNode ) {
            //             self.createdNode( nodeID, childID, childExtendsID, childImplementsIDs,
            //                 childSource, childType, childURI, childName );
            //         }

            //         // Remove the container div if an error occurred or if we received an empty
            //         // result. The server sends an empty document when the application doesn't
            //         // provide a chrome file.

            //         if (  responseText == "" ) {
            //             container.remove();
            //         }

            //         // Resume the queue.

            //         callback( true );

            // });
                // container.load( "admin/chrome", function( responseText, textStatus ) {

                //     // If the overlay attached a `createdNode` handler, forward this first call
                //     // since the overlay will have missed it.

                //     if ( self.createdNode !== Object.getPrototypeOf( self ).createdNode ) {
                //         self.createdNode( nodeID, childID, childExtendsID, childImplementsIDs,
                //             childSource, childType, childURI, childName );
                //     }

                //     // Remove the container div if an error occurred or if we received an empty
                //     // result. The server sends an empty document when the application doesn't
                //     // provide a chrome file.

                //     if ( ! ( textStatus == "success" || textStatus == "notmodified" ) || responseText == "" ) {
                //         container.remove();
                //     }

                //     // Resume the queue.

                //     callback( true );

                // } );

            }

        },

    }, function( viewFunctionName ) {

        // == View API =============================================================================

    } );


    function setInnerHtml (elm, html) {
        elm.innerHTML = html;
        Array.from(elm.querySelectorAll("script")).forEach(function(el) {
          let newEl = document.createElement("script");
          Array.from(el.attributes).forEach(function(el) { 
            newEl.setAttribute(el.name, el.value)
          });
          newEl.appendChild(document.createTextNode(el.innerHTML));
          el.parentNode.replaceChild(newEl, el);
        })
      }



} );
