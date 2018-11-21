this.updateSrc = function(srcID){

    if (srcID) {
        this.src = "";
        this.src = srcID;
    }
    
}

this.refreshSrc = function(){

    let mySrcID = this.src;
    if (mySrcID) {
        this.src = "";
        this.src = mySrcID;
    }
    
}
