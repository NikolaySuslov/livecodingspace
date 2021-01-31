this.init = function(){


    this.height = this.height ? this.height : 0.3;
    this.width = this.width? this.width : 0.4;
    this.class = "clickable intersectable";

    this.baseColor = this.baseColor ? this.baseColor : 'white';
    this.hoverColor = this.hoverColor ? this.hoverColor : 'green';
    this.clickColor = this.clickColor ? this.clickColor : 'blue';

    let material = {
        "extends": "proxy/aframe/aMaterialComponent.vwf",
        "type": "component",
        "properties": {
            "transprent": true,
            "opacity": 0.3,
            "color": "white",
            "side": "double"
        }
    }

    let cursorListener = {
        "extends": "proxy/aframe/app-raycaster-listener-component.vwf",
        "type": "component"
      }

      let raycasterListener = {
        "extends": "proxy/aframe/app-raycaster-listener-component.vwf",
        "type": "component"
      }

      let textNode = {
        "extends": "proxy/aframe/atext.vwf",
        "properties": {
          "value": this.text,
          "color": "white",
          "position": [-this.width/2, 0, 0],
          "width": this.width*10
        }
      }

      this.children.create('material', material);
      this.children.create('cursor-listener', cursorListener);
      this.children.create('raycaster-listener', raycasterListener);
      this.children.create('textNode', textNode);


}

this.intersectEventMethod = function(){
    this.material.opacity = 0.6;
    this.material.color = this.hoverColor
}

this.clearIntersectEventMethod = function(){
    this.material.opacity = 0.3;
    this.material.color = this.baseColor
}

this.mousedownAction = function(point, controllerID){
    this.triggerdownAction(point, controllerID);
}

this.mouseupAction = function(point, controllerID){
    this.triggerupAction(point, controllerID);

}

this.triggerdownAction = function(point, controllerID){
    this.material.color = this.clickColor;

    let target = this.target ? this.getScene().findNode(this.target) :
    this.parent;
    target.doButtonTriggerdownAction(this.id, controllerID, point);
}

this.triggerupAction = function(point, controllerID){
    this.material.color = this.baseColor;
    let target = this.target ? this.getScene().findNode(this.target) :
    this.parent;
    target.doButtonTriggerupAction(this.id, controllerID);
    
}