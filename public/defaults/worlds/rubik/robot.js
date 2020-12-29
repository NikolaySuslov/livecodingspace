this.initialize = function(){}

this.initRobot = function(){

    let nodes = {
        'left': {
            position: [-1,0,0]
        },
        'right': {
            position: [1,0,0]
        },
        'front': {
            position: [0,0,1]
        },
        'back': {
            position: [0,0,-1]
        }

    };

    Object.keys(nodes).forEach(el=>{

        let legoBoostNode = {
            "extends": "proxy/objects/legoboost.vwf",
            "properties": {
                "boostID": el,
                "position": nodes[el].position,
                "displayName": el,
                "tracking": false
            }
        }
        this.children.create(el, legoBoostNode, function( child ) {
            child.createVisual();
            child.trackLego();
        })
    
    })


}

this.rotateFace = function(faceID){

    let direction = (faceID == faceID.toLowerCase()) ? -1 : 1;

    let angle = 90;
    //let dutyCycle = 80  * direction;

    let robotMap = {

        'l': {
            'robot': 'left',
            'motor': 'B',
            'dutyCycle': 70,
            'direction': -1*direction
        },
        'd': {
            'robot': 'left',
            'motor': 'C',
            'dutyCycle': 100,
            'direction': -1*direction
        },
        'b': {
            'robot': 'back',
            'motor': 'A',
            'dutyCycle': 70,
            'direction': direction
        },
        'r': {
            'robot': 'right',
            'motor': 'A',
            'dutyCycle': 70,
            'direction': direction
        },
        'u': {
            'robot': 'back',
            'motor': 'C',
            'dutyCycle': 100,
            'direction': direction
        },
        'f': {
            'robot': 'front',
            'motor': 'A',
            'dutyCycle': 70,
            'direction': direction
        }
    } 

    let robot = robotMap[faceID.toLowerCase()];
    this[robot.robot].setMotorAngle(robot.motor, angle, robot.dutyCycle*robot.direction, 'sync');

}