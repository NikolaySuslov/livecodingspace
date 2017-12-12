this.initialize = function() {
    this.future(0).clientWatch();
};

this.clientWatch = function () {
    var self = this;

    if (this.children.length !== 0) {

        var clients = this.find("doc('http://vwf.example.com/clients.vwf')")[0];

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
                        self.children.delete(self.children[node.id]);
                        //'controlvr-'
                        let controllerVR = self.children['controlvr-'+ node.id.slice(7)];
                        if (controllerVR){
                            self.children.delete(controllerVR);
                        }

                        let wmrvR = self.children['wmrvr-right-'+ node.id.slice(7)];
                        if (wmrvR){
                            self.children.delete(wmrvR);
                        }
                        
                        let wmrvL = self.children['wmrvr-left-'+ node.id.slice(7)];
                        if (wmrvL){
                            self.children.delete(wmrvL);
                        }
                        
                    }
                }
            });
     }
    }
    this.future(5).clientWatch(); 
};
