this.getChildByName = function (name) {
    let nodes = this.children.filter(el => el.displayName == name);
    return nodes[0]
}

this.nodeDef = function () {
    let def = _app.helpers.getNodeDef(this.id);
    return def
}

this.clone = function () {
    let nodeDef = _app.helpers.getNodeDef(this.id);
    return nodeDef
}

this.getScene = function () {
    let scene = this.find("/")[0];
    return scene
}

this.setGizmoMode = function (mode) {
    if (this.gizmo) {
        this.gizmo.properties.mode = mode
    }
}

this.showCloseGizmo = function () {
    let gizmoNode =
    {
        "extends": "proxy/aframe/gizmoComponent.vwf",
        "type": "component",
        "properties":
        {
            "mode": "translate"
        }
    }
    if (this.properties.edit) {
        this.children.create("gizmo", gizmoNode);
    } else {
        if (this.gizmo) {
            this.children.delete(this.gizmo)
        }
    }
}

// Parse a parameter as a translation specification.
this.translationFromValue = function (propertyValue) {

    var value = new THREE.Vector3();//goog.vec.Vec3.create();

    if (propertyValue.hasOwnProperty('x')) {
        value = value.set(propertyValue.x, propertyValue.y, propertyValue.z)
    }
    else if (Array.isArray(propertyValue)) {
        value = value.fromArray(propertyValue);
    }
    else if (typeof propertyValue === 'string') {

        let val = propertyValue.includes(',') ? AFRAME.utils.coordinates.parse(propertyValue.split(',').join(' ')) : AFRAME.utils.coordinates.parse(propertyValue);
        value = value.set(val.x, val.y, val.z)

    } else if (propertyValue.hasOwnProperty('0')) {
        value = value.set(propertyValue[0], propertyValue[1], propertyValue[2])
    }

    return value


    // return value && value.length >= 3 ?
    //   value :
    //   goog.vec.Vec3.create();
};

this.sendOSC = function (msg) {
    //sending OSC msg

    vwf_view.kernel.fireEvent(this.id, "sendOSC", [msg]);

    // if (_OSCManager.port !== null) {
    //     _OSCManager.port.send(msg);
    // }

    //on driver side

}

// this.clickEvent = function () {
//     //this.intersectEventMethod();
// }

// this.intersectEvent = function () {
//     //this.intersectEventMethod();
// }
// this.clearIntersectEvent = function () {
//     //this.clearIntersectEventMethod();
// }


this.intersectEventMethod = function () {
    //intersect method
}

this.clearIntersectEventMethod = function () {
    //clearIntersect method
}

this.hitstartEventMethod = function () {
    //intersect method
}


this.hitendEventMethod = function () {
    //clearIntersect method
}

this.clickEventMethod = function (value) {
    //clickEventMethod
}

this.mousedownEventMethod = function (value) {
    //clickEventMethod
}

this.mouseupEventMethod = function (value) {
    //clickEventMethod
}



this.setOwner = function (param) {

    var clients = this.find("doc('proxy/clients.vwf')")[0];

    if (clients !== undefined) {
        //console.log(clients.children);

        let clientsArray = [];

        clients.children.forEach(function (element) {
            clientsArray.push(element.name);

        });

        //console.log(clientsArray);

        if (this.ownedBy) {
            if (clientsArray.includes(this.ownedBy)) {
                console.log(this.id + " already owned by: " + param);
            } else {
                this.ownedBy = param;
                //console.log(this.id + ' set owner to: ' + param);
            }


        } else {
            this.ownedBy = param;
            //console.log(this.id + ' set owner to: ' + param);
        }

    }

}

this.updateMethod = function (methodName, methodBody, params) {
    vwf.setMethod(this.id, methodName, { body: methodBody, type: "application/javascript", parameters: params });
}

this.callMethod = function (methodName, params) {
    vwf.callMethod(this.id, methodName, params)
}

this.do = function () {
    //do in step
}

this.step = function () {

    if (this.stepping) {
        this.do();
    }

    let t = this.stepTime ? this.stepTime : 0.05;

    this.future(t).step();
}

this.onGlobalBeat = function (obj) {
    //dispatch the beat example send OSC
    let transportNode = this.find('//' + obj.name)[0];
    let rate = transportNode.animationRate; // 1 by default
    let drumSeq = [
        { beat: 0, msg: 0 },
        { beat: 30, msg: 0 }];
    drumSeq.forEach(el => {
        if (el.beat / rate == obj.beat) {
            let msg = {
                address: "/trigger/sample01",
                args: [this.time, 'bd_808', 3]
            };
            //for synth {beat:0, msg: "A"}
            //let msg = {
            // address: "/trigger/synth01",
            // args: [this.time, 'piano', el.msg, 0.1, 1]};

            // this.sendOSC(msg); 
            // this.changeVisual();
        }
    })

}

this.changeVisual = function () {
    //code for changing me
    this.future(0.1).resetVisual();
}

this.resetVisual = function () {

}

this.getRandomColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(this.random() * 16)];
    }
    return color;
}

this.randomize = function () {

}

// this.position_set = function (value) {
//     var position = this.translationFromValue(value); // parse incoming value
//     if (!position || !this.position) {
//         this.position = new THREE.Vector3();
//     } else if (!this.position.equals(position)){ //!goog.vec.Vec3.equals(this.position || goog.vec.Vec3.create(), position)) {
//         this.position = position;
//         this.positionChanged(position);
//     }
// }
// this.position_get = function () {
//     return this.position || new THREE.Vector3();
// }

// this.rotation_set = function (value) {
//     var rotation = this.translationFromValue(value); // parse incoming value
//     if (!rotation || !this.rotation) {
//         this.rotation = new THREE.Vector3();
//     } else if (!this.rotation.equals(rotation)){ //!goog.vec.Vec3.equals(this.rotation || goog.vec.Vec3.create(), rotation)) {
//         this.rotation = rotation;
//         this.rotationChanged(rotation);
//     }
// }
// this.rotation_get = function () {
//     return this.rotation || new THREE.Vector3();
// }

// this.scale_set = function (value) {
//   var scale = this.translationFromValue( value ); // parse incoming value
//   if(!scale || !this.scale){
//     this.scale = new THREE.Vector3();
//   } else if (!this.scale.equals(scale)){ //! goog.vec.Vec3.equals( this.scale || goog.vec.Vec3.create(), scale ) ) {
//     this.scale = scale;
//     this.scaleChanged( scale);
//   }  
// }
// this.scale_get = function () {
//   return this.scale || new THREE.Vector3();
// }

this.createEditTool = function() {

    var self = this;
    //let scene = this.getScene();

    if(!this.editTool){
    let nodeName = 'editTool';

    let node = {
        "extends": "proxy/objects/edittool.vwf",
        "properties": {}
    }

    this.children.create(nodeName, node, function( child ) {
        child.createVisual();
    })
}

}


this.globalToLocalRotation = function(aQ, order){

    let ord = order ? order: 'XYZ';
    let q = this.localQuaternion().inverse().multiply(aQ); //new THREE.Quaternion().setFromEuler(euler)
    let localEuler = new THREE.Euler().setFromQuaternion(q, ord);
    return [
        THREE.Math.radToDeg(localEuler.x),
        THREE.Math.radToDeg(localEuler.y),
        THREE.Math.radToDeg(localEuler.z)
    ]
}  

this.placeInFrontOf =  function(nodeID, dist) {
    // fixed distance from camera to the object
    let node = this.getScene().findNodeByID(nodeID);
    
    let cwd = node.worldDirection(); //new THREE.Vector3();
    cwd.multiplyScalar(dist);
    cwd.add(node.position);
    
    let nodeQ = node.localQuaternion();

    let localEuler = new THREE.Euler().setFromQuaternion(nodeQ, 'XYZ');
    let rotation = [
        THREE.Math.radToDeg(localEuler.x),
        THREE.Math.radToDeg(localEuler.y),
        THREE.Math.radToDeg(localEuler.z)
    ];

    this.position = cwd;
    this.rotation = rotation;

}
