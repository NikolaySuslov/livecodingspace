/*
 * WebRTC.js : Behaves as a wrapper for vwf/view/rtcObject
 * Maps simple 1:1 signal model to a broadcast model using target and sender ids
 */

define(["module", "vwf/view", "vwf/view/oscjs/dist/osc-module"], function(module, view, osc) {

	return view.load(module, {

		initialize: function() {
			
			self = this;
            this.osc = osc;
            this.portValue = '8081';
            this.hostValue = 'localhost';
            this.port = null;

            //window._osc = this.osc;
            window._OSCManager = this;

		},

		/*
		 * Receives incoming messages
		 */
		// calledMethod: function(id, name, params) {
		// },
		
		setOSCHostAndPort: function(h,p) {

			this.hostValue = h;
			this.portValue = p;
            
		},

		connect: function() {
	
			this.disconnect();

			this.port = new osc.WebSocketPort({
                url: 'ws://' + this.hostValue + ':' + this.portValue
                //url: "ws://localhost:8081"
            	});
			
           	 	this.port.on("message", function (oscMessage) {
                	console.log("message", oscMessage);
                	findAllNodesWithOSC(oscMessage);
            	});

				this.port.open();


		},

		disconnect: function() {
			console.log('disconnect');
			if (this.port !== null)
				this.port.close(1000, 'manual close');

		},

		getStatus: function() {
			if (this.port){
			return this.port.socket.readyState
			} 
			return 3
		}

		
	})

	function findAllNodesWithOSC(oscMessage){

		let appID = vwf.application();
		var oscSceneProp = vwf.getProperty(appID, 'osc');
		if (oscSceneProp !== undefined){
			if (oscSceneProp){
				//console.log('now callMethod');
				vwf_view.kernel.callMethod(appID, 'getOSC', [oscMessage]);
			}
		}

		var children = vwf.children(appID);
			children.forEach(function(child){
				var oscprop = vwf.getProperty(child, 'osc');
				if (oscprop !== undefined){
					if (oscprop){
						//console.log('now callMethod');
						vwf_view.kernel.callMethod(child, 'getOSC', [oscMessage]);
					}
				}

			})
		 // var scene = _Editor.getNode(Engine.application());
   //  	 for (var i in scene.children) {
                    
   //                  if (scene.children[i].properties.DisplayName.indexOf("leapmotion") > -1) {
   //                  this.leapHandsID = (scene.children[i].id);
   //              }
   //          }


	}

});