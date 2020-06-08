this.initialize = function () {
}

this.setParams = function(w, h) {
   // debugger;
    let width = this.properties.subcamWidth;
    let height = this.properties.subcamHeight;

    //TODO: not good trick to force updating property
    vwf_view.kernel.setProperty(this.id, "subcamWidth", 1); 
    vwf_view.kernel.setProperty(this.id, "subcamHeight", 1);

    vwf_view.kernel.setProperty(this.id, "subcamWidth", width); 
    vwf_view.kernel.setProperty(this.id, "subcamHeight", height);
}