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

      this.children.create('material', material);
      this.children.create('cursor-listener', cursorListener);
      this.children.create('raycaster-listener', raycasterListener);


}

this.intersectEventMethod = function(){
    this.material.opacity = 0.6;
    this.material.color = this.hoverColor
}

this.clearIntersectEventMethod = function(){
    this.material.opacity = 0.3;
    this.material.color = this.baseColor
}

this.mousedownAction = function(){
    this.triggerdownAction();
}

this.mouseupAction = function(){
    this.triggerupAction();

}

this.triggerdownAction = function(){
    this.material.color = this.clickColor;

    let target = this.getScene().findNode(this.target);
    target.doButtonTriggerdownAction(this.id);
}

this.triggerupAction = function(){
    this.material.color = this.baseColor;
    
}