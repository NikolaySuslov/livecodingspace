var options = {

    query: 'pathname=' + window.location.pathname.slice(1,
        window.location.pathname.lastIndexOf("/")),
    secure: window.location.protocol === "https:",
    reconnection: false,
    transports: ['websocket']

};

var socket = io.connect(window.location.protocol + "//" + window.location.host, options);

socket.on('getWebAppUpdate', function (msg) {
    parseAppInstancesData(msg)
    //console.log(msg);
});


function parseAppInstancesData(data) {

    var needToUpdate = true;

    if (data == "{}") {
        var el = document.querySelector(".instance");
        if (el) {
            var topEl = el.parentNode;
            topEl.removeChild(el);
        }
        // let removeElements = elms => Array.from(elms).forEach(el => el.remove()); 
    }

    let jsonObj = JSON.parse(data);
    var parsed = {};
    for (var prop in jsonObj) {
        var name = prop.split('/')[1];
        if (parsed[name]) {
            parsed[name][prop] = jsonObj[prop];
        } else {
            parsed[name] = {};
            parsed[name][prop] = jsonObj[prop];
        }
        
    }
    //console.log(parsed);

    for (var prop in parsed) {
       var name = prop;
        let element = document.getElementById(name);
        if (element) {
            var list = document.getElementById(name + 'List');

                var topList = list.parentNode;
                topList.removeChild(list);
                var list = document.createElement('ol');
                list.setAttribute("id", name + 'List');
                topList.appendChild(list);
            
            var newListProps = parsed[prop];
             for (var propEntry in newListProps) {

            let entry = document.createElement('li');
            entry.setAttribute("class", "instance");
            let node = document.createElement("A");
            let textLink = document.createTextNode(newListProps[propEntry].instance);
            node.setAttribute("href", 'http://' + newListProps[propEntry].instance);
            node.setAttribute("target", "_blank");
            node.setAttribute("onclick", "refresh();");

            node.appendChild(textLink);

            let numClientsEl = document.createElement('span');
            numClientsEl.setAttribute("class", "numClients");
            let numClients = document.createTextNode('Users online: ' + newListProps[propEntry].clients);

            entry.appendChild(node);
            entry.appendChild(document.createElement('br'));
            entry.appendChild(numClientsEl).appendChild(numClients);

            list.appendChild(entry);
            
         }
        }
        //needToUpdate = true
    }
    // console.log(data)

}

function parseWebAppData(data) {

    let jsonObj = JSON.parse(data);
    for (var prop in jsonObj) {
        let main = document.getElementById('main');
        let app = document.createElement("DIV");
        app.setAttribute("class", "mdl-cell mdl-cell--4-col exp-card-wide mdl-card mdl-shadow--2dp");
        var appCard = '<div class="mdl-card__title"><h2 id="' + prop + 'Title" class="mdl-card__title-text">' + jsonObj[prop].title + '</h2></div><div id="' + prop + 'Text" class="mdl-card__supporting-text">' + jsonObj[prop].text + '</div><div id="' + prop + '"  class="mdl-card__actions mdl-card--border"> <a href="/' + prop + '" onclick="refresh();" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Start new</a><hr/><p/><span class="mdl-color-text--grey-500">...or connect to:</span><ol id="' + prop + 'List"></ol></div>';
        app.innerHTML = appCard;
        if (jsonObj[prop].imgUrl !== "") {
            app.firstChild.style.backgroundImage = 'linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(' + jsonObj[prop].imgUrl + ')';
        }

        main.appendChild(app);
    }
    //console.log(data);
    // getAllAppInstances();

}

function getAllAppInstances() {

    let allInatances = httpGetJson('allinstances.json')
        .then(res => {
            parseAppInstancesData(res);
        });
}

function getAppDetails() {
    let appDetails = httpGetJson('webapps.json')
        .then(res => {
            parseWebAppData(res)
        })
        .then(res => refresh());
}


function refresh() {
   // socket.emit('getWebAppUpdate', "");
}


function httpGet(url) {
    return new Promise(function (resolve, reject) {
        // do the usual Http request
        let request = new XMLHttpRequest();
        request.open('GET', url);

        request.onload = function () {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };

        request.onerror = function () {
            reject(Error('Network Error'));
        };

        request.send();
    });
}
async function httpGetJson(url) {
    // check if the URL looks like a JSON file and call httpGet.
    let regex = /\.(json)$/i;

    if (regex.test(url)) {
        // call the async function, wait for the result
        return await httpGet(url);
    } else {
        throw Error('Bad Url Format');
    }
}