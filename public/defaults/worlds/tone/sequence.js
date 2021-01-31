this.positionChanged = function(){
    this.children.forEach(child => {
        if(child.note){
            child.positionChanged();
        }
    })
}