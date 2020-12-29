this.initialize = function () {
    this.run();
}

this.run = function () {
    this.timeCount = this.time;
    console.log(this.timeCount);
    this.future(1).run();
}

this.incClicks = function () {
    this.clicks = this.clicks + 1
}

this.decClicks = function () {
    this.clicks = this.clicks - 1
}

this.getRandom = function () {
    this.randomNumber = this.random();
}

