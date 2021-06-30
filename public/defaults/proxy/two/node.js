this.do = function () {
    //do in step
}

this.step = function () {

    if (this.stepping) {
        this.do();
    }

    let t = this.stepTime ? this.stepTime : 0.05;

    this.future(t).step();
}

this.clickEvent = function () {
    //click event
}

this.mouseupEvent = function () {
    //click event
}

this.mousedownEvent = function () {
    //click event
}

this.checkForDragStart = function (avatarID) {

    let av = this.getScene().findNodeByID(avatarID);
    if (this.drag) {
        //console.log("DRAG START for ", avatarID)
                av.dragID = this.id;
                av.delta = [av.x - this.x, av.y - this.y] 
    }

}

this.checkForDragEnd = function (avatarID) {

    if (this.drag) {
       // console.log("DRAG END for ", avatarID)
        let node = this.getScene().findNodeByID(avatarID);
        node.dragID = null;
        node.delta = [0, 0]
    }

}

this.overstartEvent = function (avatarID) {

    //over start

}

this.overendEvent = function (avatarID) {

    //over end

}


this.getRandomColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(this.random() * 16)];
    }
    return color;
}

this.getScene = function () {
    let scene = this.find("/")[0];
    return scene
}

this.onGlobalBeat = function(obj){
    //on global beat
}