this.triggerdown = function(){
    let scene = this.getScene();
    this.pointer.material.color = "white";
    this.penDown = true;
    this.penName = 'drawNode-' + scene.GUID();
    scene.createDrawNode(scene.drawBox, this.penName, "#f9f9f9", 0.007, "0 0 0");
}

this.triggerup = function(){
    this.pointer.material.color = "green";
    this.penDown = false;
}

this.onMove = function(){
    if(this.penDown){
        let scene = this.getScene();
        let pen = scene.drawBox.children[this.penName];
        let pos = this.pointer.worldPosition();
        let path = pen.linepath.path.slice();
        path.push(pos);
        pen.linepath.path = path;
    }
    
}

this.met = function(){

    console.log('FROM JS: ', this.id);

}

this.getMyProp =  function(){
    return this.myProperty;
}

this.setMyProp =  function(val){
    if ( val == "fancy" ) {
        this.myProperty = val + " coding!";
      } else {
        this.myProperty = val;
      }
}
