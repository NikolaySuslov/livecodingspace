this.triggerdown = function(){
    this.pointer.material.color = "black";
    this.penDown = true;
}

this.triggerup = function(){
    this.pointer.material.color = "white";
    this.penDown = false;
}

this.onMove = function(){
    if(this.penDown){
        let scene = this.getScene();
        let pos = this.pointer.worldPosition();
        let path = scene.drawNode.linepath.path.slice();
        path.push(pos);
        scene.drawNode.linepath.path = path;
    }
    
}