this.initialize = function() {
    // this.future(0).updateAvatar();
  
 };

 this.createPlayerBody = function() {
   
    let color = this.getRandomColor();

    let vis = {
          "extends": "proxy/two/group.vwf",
          "properties": {},
          "children":{
            "body":{
              "extends": "proxy/two/ellipse.vwf",
              "properties": {
                "width": 30,
                "height": 30,
                "fill": color,
                "opacity": 0.7,
                "linewidth": 4
              }
            }
          }
        }
      
   

    this.children.create("vis", vis, function(child){

            this.delta = [0,0]
            this.stepping = true;
            this.stepTime = 0.2;
            this.step();
            // if (!nodeDef) {
            
            // }
    
        });

 };

 this.move = function(x,y){
    this.x = x;
    this.y = y;

    if(this.dragID){
        let node = this.getScene().findNodeByID(this.dragID);
        node.x = this.x - this.delta[0];
        node.y = this.y - this.delta[1]
    }

 }

 this.checkOver = function(x, y){
    //console.log("CHECK OVER from ", this.id);

 }

this.do = function(){
        this.checkOver(this.x, this.y);
}
