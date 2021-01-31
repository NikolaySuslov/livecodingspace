this.moveAction = function(controllerID, point){
    
    let pos = this.parent.localToWorld(this.position);

    if( point && this.pointerDragStart){
        let newPos = new THREE.Vector3().subVectors(point, this.pointerDragStart);
        if(this.lockZ){
            this.position = this.parent.worldToLocal(new THREE.Vector3(newPos.x, newPos.y, pos.z)); //[newPos.x, newPos.y, newPos.z]
        } else {
            this.position = this.parent.worldToLocal(newPos);
        }
       
        this.positionChanged();
    }

}

this.doButtonTriggerupAction = function(buttonID, controllerID){

        let pointer = this.getScene().findNodeByID(controllerID);
        this.pointerDragStart = false;
        pointer.dragID = false;

}

this.doButtonTriggerdownAction = function(buttonID, controllerID, point){
    
        let pointer = this.getScene().findNodeByID(controllerID);
        if(point) {
        //console.log('POINT:', point);

        let wp = new THREE.Vector3().subVectors( point, this.parent.localToWorld(this.position));
        this.pointerDragStart = wp;
        }

        pointer.dragID = this.id;

}

this.mousedownAction = function(point, controllerID){
    this.triggerdownAction(point, controllerID);
}

this.mouseupAction = function(point, controllerID){
    this.triggerupAction(point, controllerID);

}

this.triggerdownAction = function(point, controllerID){
    
    this.doButtonTriggerdownAction(this.id, controllerID, point);
}

this.triggerupAction = function(point, controllerID){
   
    this.doButtonTriggerupAction(this.id, controllerID);
    
}