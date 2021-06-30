this.start = function(){
    //on view side
}

this.syncStart = function(time){
    //on view side
}

this.stop = function(){
    //on view side
}

this.pause = function(){
    //on view side
}


this.playBuffer = function(){

}
this.syncBufferState = function(){

}

this.setBufferState = function(isPlaying, startOffset, pausedTime){
   
    this.isPlaying = isPlaying;
    this.startOffset = startOffset;
    this.pausedTime = pausedTime;

  }