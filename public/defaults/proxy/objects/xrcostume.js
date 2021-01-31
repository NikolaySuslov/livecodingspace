this.onMove = function (idata) {

    if (this.mousedown_state || this.triggerdown_state) {
       
        let controller = this.parent.parent;
        if (controller && controller.dragID) {
            let point = idata && idata.point ? AFRAME.utils.coordinates.parse(idata.point) : null;
            //console.log("Point: ", point)
            vwf.callMethod(controller.dragID, "moveAction", [controller.id, point])
        } 
        // else if (idata) {
        //     //console.log('Move POINT: ', idata.point, + ' on ' + idata.elID);
        //     let point = AFRAME.utils.coordinates.parse(idata.point);
        //     vwf.callMethod(idata.elID, "moveAction", [controller.id, point])
        // }
    }
}

this.triggerupAction = function (point, elID, controllerID) {
    //do on trigger up
    this.cursorVisual.color = this.cursorVisual.avatarColor;
    if (elID) {
        //let node = this.findNodeByID(elID);
        let pointData = AFRAME.utils.coordinates.parse(point);
        vwf.callMethod(elID, "triggerupAction", [pointData, controllerID])
    }
    this.triggerdown_state = false;
}

this.triggerdownAction = function (point, elID, controllerID) {
    //do on trigger down
    this.triggerdown_state = true;
    this.cursorVisual.color = "red";

    if (elID) {
        //let node = this.findNodeByID(elID);
        let pointData = AFRAME.utils.coordinates.parse(point);
        vwf.callMethod(elID, "triggerdownAction", [pointData, controllerID])
    }

}

this.mouseupAction = function (point, elID, controllerID) {

    if (elID) {
        //let node = this.findNodeByID(elID);
        let pointData = AFRAME.utils.coordinates.parse(point);
        vwf.callMethod(elID, "mouseupAction", [pointData, controllerID])
    }
    this.mousedown_state = false;

}

this.mousedownAction = function (point, elID, controllerID) {

    this.mousedown_state = true;
    if (elID) {
        //let node = this.findNodeByID(elID);
        let pointData = AFRAME.utils.coordinates.parse(point);
        vwf.callMethod(elID, "mousedownAction", [pointData, controllerID])
    }

}


