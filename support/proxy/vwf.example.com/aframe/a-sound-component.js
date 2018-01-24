this.updateSrc = function(srcID){

    if (srcID) {

            this.src = "";
            this.src = srcID;
        
    }
    
}

this.refreshSrc = function(srcID){

    if (srcID) {

        if (srcID == this.src) {
            this.src = "";
            this.src = srcID;
        }
    }
    
}