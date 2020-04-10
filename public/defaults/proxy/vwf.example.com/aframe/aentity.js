this.getChildByName = function (name) {
    let nodes = this.children.filter(el => el.displayName == name);
    return nodes[0]
}

this.getScene =  function () {
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
        "extends": "http://vwf.example.com/aframe/gizmoComponent.vwf",
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

    var value = goog.vec.Vec3.create();

    if (propertyValue.hasOwnProperty('x')) {
        value = goog.vec.Vec3.createFromValues(propertyValue.x, propertyValue.y, propertyValue.z)
    }
    else if (Array.isArray(propertyValue) || propertyValue instanceof Float32Array) {
        value = goog.vec.Vec3.createFromArray(propertyValue);
    }
    else if (typeof propertyValue === 'string') {

        let val = propertyValue.includes(',') ? AFRAME.utils.coordinates.parse(propertyValue.split(',').join(' ')) : AFRAME.utils.coordinates.parse(propertyValue);
        value = goog.vec.Vec3.createFromValues(val.x, val.y, val.z)
        
    } else if (propertyValue.hasOwnProperty('0')) {
        value = goog.vec.Vec3.createFromValues(propertyValue[0], propertyValue[1], propertyValue[2])
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

this.clickEventMethod = function () {
    //clickEventMethod
}



this.setOwner = function (param) {

    var clients = this.find("doc('http://vwf.example.com/clients.vwf')")[0];

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
    vwf.setMethod(this.id, methodName, { body: methodBody, type: "application/javascript", parameters: params});
}

this.callMethod = function(methodName, params){
    vwf.callMethod(this.id, methodName, params)
}

this.do = function() {
    //do in step
}

this.step = function(){

    if (this.stepping){
        this.do();
    }
    
    let t = this.stepTime ? this.stepTime: 0.05;

    this.future(t).step();
}

this.onGlobalBeat = function(obj) {
    //dispatch the beat example send OSC
    let transportNode = this.find('//' + obj.name)[0];
    let rate = transportNode.animationRate; // 1 by default
    let drumSeq = [
    {beat:0, msg: 0},
    {beat:30, msg: 0}];
    drumSeq.forEach(el=>{
      if(el.beat/rate == obj.beat){
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

this.changeVisual = function() {
    //code for changing me
    this.future(0.1).resetVisual();
}

this.resetVisual = function() {

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