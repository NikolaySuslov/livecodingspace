this.animationTime_set = function (value) {

    if (this.animationStartTime == null) {
        this.animationStartTime = 0;
    }
    if (this.animationStopTime == null) {
        this.animationStopTime = this.animationDuration;
    }
    // Save copies to avoid repeated reads.
    var duration = this.animationStopTime - this.animationStartTime,
        rate = this.animationRate;
    // Range limit the incoming value.
    value = Math.min(Math.max(this.animationStartTime, value), this.animationStopTime);
    // Keep paused if updating start/pause from null/null. Use t=0 instead of `this.time` so that
    // setting `node.animationTime` during initialization is consistent across multiple clients.
    if (this.animationStartSIM == null) {
        this.animationPauseSIM = 0;
    }
    // Calculate the start and stop times that makes the new time work.
    this.animationStartSIM =
        (this.animationPauseSIM != null ? this.animationPauseSIM : this.time) -
        (rate >= 0 ? value - this.animationStartTime : value - duration) / rate;
    this.animationStopSIM =
        this.animationStartSIM +
        (rate >= 0 ? duration : -duration) / rate;
    // Update the node and fire the changed event.
    if (value !== this.animationTimeUpdated) {
        this.animationTimeUpdated = value;
        this.animationUpdate(value, this.animationDuration);
        this.animationTimeChanged(value);
    } //@ sourceURL=animation.animationTime.set.vwf

}

this.animationTime_get = function () {

    // Save copies to avoid repeated reads.
    var startTime = this.animationStartTime;
    var stopTime = this.animationStopTime;
    var rate = this.animationRate;
    var animationPauseSIM = this.animationPauseSIM;
    var animationStartSIM = this.animationStartSIM;
    var time = this.time;
    // Calculate the time from the start and current/pause times.
    var value = (
        (animationPauseSIM != null ? animationPauseSIM : time) -
        (animationStartSIM != null ? animationStartSIM : time)
    ) * rate + (rate >= 0 ? startTime : stopTime);
    // Range limit the value.
    value = Math.min(Math.max(startTime, value), stopTime);
    // If changed since last seen, update and fire the changed event.
    if (value !== this.animationTimeUpdated) {
        this.animationTimeUpdated = value;
        this.animationUpdate(value, this.animationDuration);
        this.animationTimeChanged(value);
    }
    return value; //@ sourceURL=animation.animationTime.get.vwf
}

this.animationDuration_set = function (value) {
    var duration = value, rate = this.animationRate;
    this.animationDuration = duration;
    this.animationDurationSIM = (rate >= 0 ? duration : -duration) / rate;
}

this.animationRate_set = function (value) {
    var duration = this.animationDuration, rate = value;
    this.animationRate = rate;
    this.animationDurationSIM = (rate >= 0 ? duration : -duration) / rate;
}

this.animationPlaying_set = function (value) {
    if (this.animationStartTime == null) {
        this.animationStartTime = 0;
    }
    if (this.animationStopTime == null) {
        this.animationStopTime = this.animationDuration;
    }
    if (this.animationStartSIM != null && this.animationPauseSIM == null) {
        if (!value) {
            // Mark as paused at the current time.
            this.animationPauseSIM = this.time;
            // Send the `animationStopped` event if stopping at the end.
            if (this.time == this.animationStopSIM) {
                this.animationStopped();
            }
        }
    } else {
        if (value) {
            // Save copies to avoid repeated reads.
            var duration = this.animationStopTime - this.animationStartTime,
                rate = this.animationRate;
            // Start from the beginning if resuming from the end.
            if (this.animationPauseSIM == this.animationStopSIM) {
                this.animationPauseSIM = this.animationStartSIM;
            }
            // Recalculate the start and stop times to keep paused time unchanged, then resume.
            this.animationStartSIM =
                (this.animationStartSIM != null ? this.animationStartSIM : this.time) -
                (this.animationPauseSIM != null ? this.animationPauseSIM : this.time) +
                this.time;
            this.animationStopSIM =
                this.animationStartSIM +
                (rate >= 0 ? duration : -duration) / rate;
            this.animationPauseSIM = null;
            // Send the `animationStarted` event if starting from the beginning.
            if (this.time == this.animationStartSIM) {
                this.animationStarted();
            }
            // Start the animation worker.
            this.logger.debug("scheduling animationTick");
            this.animationTick();
        }
    } //@ sourceURL=animation.animationPlaying.set.vwf

}

this.animationPlaying_get = function () {
    return this.animationStartSIM != null && this.animationPauseSIM == null;
}

this.animationStartTime_set = function (value) {
    this.animationStartTime = value ? Math.min(Math.max(0, value), this.animationDuration) : value;

}

this.animationStopTime_set = function (value) {
    this.animationStopTime = value ? Math.min(Math.max(0, value), this.animationDuration) : value;
}

this.animationStartFrame_set = function (value) {

    this.animationStartTime = value / this.animationFPS
}

this.animationStartFrame_get = function () {
    return Math.floor(this.animationStartTime * this.animationFPS)
}

this.animationStopFrame_set = function (value) {
    this.animationStopTime = value / this.animationFPS
}
this.animationStopFrame_get = function () {
    return Math.floor(this.animationStopTime * this.animationFPS)
}

this.animationFrames_set = function (value) {
    this.animationDuration = value / this.animationFPS
}
this.animationFrames_get = function () {
    return Math.ceil(this.animationFPS * this.animationDuration)
}

this.animationFrame_set = function (value) {
    if (this.animationFPS) {
        this.animationTime = value / this.animationFPS;
    }
}

this.animationFrame_get = function () {
    if (this.animationFPS) {
        return Math.floor(this.animationTime * this.animationFPS);
    }
}

//methods
this.animationPlay = function (startTime, stopTime, cb) {

    if (!isNaN(stopTime)) {
        this.animationStopTime = stopTime;
    }
    if (!isNaN(startTime)) {
        this.animationStartTime = startTime;
    }
    this.animationPlaying = true;
    this.animationStoppedCallback = cb;
}

this.animationPause = function () {
    this.animationPlaying = false;
}

this.animationResume = function () {
    this.animationPlaying = true;
}

this.animationStop = function () {
    this.animationPlaying = false;
    this.animationTime = 0;
}

this.animationTick = function () {
    if (this.animationPlaying) {
        // Read the time to recognize the current time and update.
        // TODO: move side effects out of the getter!!! (says Kevin)
        this.animationTime;
        // Loop or stop after reaching the end.
        if (this.time === this.animationStopSIM) {
            if (this.animationLoop) {
                this.animationLooped();
                this.animationTime = this.animationRate >= 0 ?
                    this.animationStartTime : this.animationStopTime;
            } else {
                this.animationPlaying = false;
            }
        }
        // Schedule the next tick if still playing.
        if (this.animationPlaying) {
            if (this.animationStopSIM - this.time > 1 / this.animationTPS) {
                this.in(1 / this.animationTPS).animationTick(); // next interval
            } else {

                // TODO: When animationStopSIM is 0 (usually when a model does not actually have an 
                //       animation on it), we schedule a method call for a time in the past (at time 0).
                //       That immediately calls animationTick again, but this.time does not equal 
                //       animationStopSIM as we would expect.  So, it doesn't stop the animation and we get
                //       caught in an infinite loop.
                //       Ideally we should catch the case where animationStopSIM is 0 before this point.
                //       But for now, we catch it here.  
                if (this.animationStopSIM > 0) {
                    this.at(this.animationStopSIM).animationTick(); // exactly at end
                } else {
                    this.animationPlaying = false;
                }
            }
        } else {
            this.logger.debug("canceling animationTick");
        }
    } //@ sourceURL=animation.animationTick.vwf
}

this.animationUpdate = function (time, duration) {
    //console.log("Do on animation update")

}

this.initialize = function () {

    // Locate child nodes that extend or implement "http://vwf.example.com/animation/position.vwf"
    // to identify themselves as animation key positions.

    var positions = this.find("./element(*,'proxy/animation/position.vwf')");

    // Fill in missing `animationTime` properties, distributing evenly between the left and right
    // positions that define `animationTime`.

    // 1: [ - ] => [ 0 ]
    // 1: [ 0, - ] => [ 0, 1 ]
    // 1: [ -, 1 ] => [ 0, 1 ]
    // 1: [ 0, -, - ] => [ 0, 1/2, 1 ]
    // 1: [ -, -, 1 ] => [ 0, 1/2, 1 ]
    // 1: [ 0, - , -, 1 ] => [ 0, 1/3 , 2/3, 1 ]

    var leftTime, leftIndex;
    var rightTime, rightIndex = -Infinity;

    if (positions.length > 0) {

        positions.sort(function (a, b) {
            return a.sequence - b.sequence;
        });

        if (positions[0].animationTime === null) {
            positions[0].animationTime = 0;
        }

        if (positions[positions.length - 1].animationTime === null) {
            positions[positions.length - 1].animationTime = this.animationDuration;
        }

        positions.forEach(function (position, index) {

            if (position.animationTime !== null) {

                leftTime = position.animationTime;
                leftIndex = index;

            } else {

                if (index > rightIndex) {
                    for (rightIndex = index + 1; rightIndex < positions.length; rightIndex++) {
                        if ((rightTime = /* assignment! */ positions[rightIndex].animationTime) !== null) {
                            break;
                        }
                    }
                }

                position.animationTime = leftTime + (rightTime - leftTime) *
                    (index - leftIndex) / (rightIndex - leftIndex);

            }

        }, this);

    }

} //@ sourceURL=http://vwf.example.com/animation.vwf/scripts~initialize

this.animationStopped = function(){
    //console.log("Animation stopped");

    if(this.animationStoppedCallback){
        let data = this.animationStoppedCallback.split(':');
        let args = data ? JSON.parse(data[1]) : [];
        vwf.callMethod(this.id, data[0], args);
    }
    this.animationStoppedCallback = null;
    
}