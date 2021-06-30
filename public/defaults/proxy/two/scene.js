this.initialize = function () {

    if(Object.getPrototypeOf(this).id.includes('scene.vwf')){
        console.log("Initialize of Scene...", this.id);
        this.future(3).clientWatch();
    } else {
        console.log("Initialize proto Scene..", this.id);
    }
   
    //this.createDefaultXRCostume();
};

this.clientWatch = function () {

    var self = this;

    if (this.children.length !== 0) {

        var clients = this.find("doc('proxy/clients.vwf')")[0];

        if (clients !== undefined) {
            //console.log(clients.children);

            let clientsArray = [];

            clients.children.forEach(function (element) {
                clientsArray.push(element.name);

            });

            this.children.forEach(function (node) {
                if (node.id.indexOf('avatar-') != -1) {

                    if (clientsArray.includes(node.id.slice(7))) {
                        //console.log(node.id + 'is here!');
                    } else {
                        //console.log(node.id + " needed to delete!");
                        let idToDelete = node.id.slice(7);
                        let nodes = self.children.filter(el=>
                            (el.id.includes(idToDelete) && 
                            (   el.id.includes('avatar-') ||
                                el.id.includes('mouse-'))) 
                            );

                        nodes.forEach(el => {
                            self.children[el.id].stepping = false;
                            self.children.delete(self.children[el.id])
                        })
                    }
                }
            });
        }
    }
    this.future(5).clientWatch();
};