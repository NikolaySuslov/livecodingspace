/*
The MIT License (MIT)
Copyright (c) 2014-2021 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

import { createSignal, onCleanup, createState, createEffect } from "/lib/ui/solid-js/dist/solid.js";
import { render, For } from "/lib/ui/solid-js/web/dist/web.js";
import h from "/lib/ui/solid-js/h/dist/h.js";
import { styled, css, createGlobalStyles } from "/lib/ui/solid-js/solid-styled-components/src/index.js";


class Standalone {
    constructor(userName, worldName) {
        console.log("standalone app constructor");
        //setBasePath('/lib/ui/shoelace');

        //this.entry = entry;
        this.userName = userName;
        this.worldName = worldName;

        this.worlds = {};
        this.instances = {};

        if (!_app.isLuminary) {
            //  this.initReflectorConnection();
        }
        this.initApp();
    }

    get containerClass() {
        return css({
            "align-items": "center",
            display: "flex",
            "justify-content": "center"
        })
    }

    styledDiv() {
        return styled("div")`
      color: red;
      font-size: 32px;
      padding: 5px;
      border: 2px solid black;
      background-color: white;
    `;
    }

    get GlobalStyles() {
        return createGlobalStyles`
            html,
            body {
                background: white;
                margin: 10px;

                min-height: 94vh;
                display: flex;
                flex-direction: column;
            }
`;
    }

    get CardInstance() {

        const card = props => h("sl-card", {
            class: "card-overview", style: {
                "box-shadow": "var(--sl-shadow-medium)"
            }
        }, [
            h("sl-qr-code", {
                value: props.url, label: "Scan this code to connect!", size: "150", style: {
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center"
                }
            }),
            h("p"),
            h("small", props.instanceID),
            h("div", { slot: "footer" }, [

                h("sl-button", {
                    type: "primary", "pill": true, style: {
                        "margin-right": "1rem"
                    },
                    href: props.url,
                    target: "_blank"
                    //onClick: () => { this.goToIndexWorld(props.url)} //href: props.url 
                }, "Connect", [
                    h("sl-badge", { pill: true, pulse: true, type: "warning" }, props.clients)
                ]),
                h("sl-tooltip", { content: "Settings" }, [
                    h("sl-icon-button", { name: "gear" })]) //disabled: true
            ])

        ])

        return card
    }

    get Card() {
        let self = this;

        const card = props => h("sl-card", {
            class: "card-overview", style: {
                "box-shadow": "var(--sl-shadow-x-large)",
                "max-width": "400px"
            }
        }, [
            h("img", {
                slot: "image",
                src: "/defaults/worlds/concert/webimg.jpg",
                alt: ""
            }),
            h("strong", "THIS IS NOT A CONCERT"),
            h("br"),
            h("small", "collaborative performance"),
            h("div", { slot: "footer" }, [
                h("sl-button", {
                    type: "primary", "pill": {}, style: {
                        "margin-right": "1rem"
                    },
                    href: props.url,
                    target: "_blank"
                    //onClick: () => { self.goToIndexWorld(props.url) },  
                }, "Start new"),
                h("div", [
                    h("sl-tooltip", { content: "Info" }, [
                        h("sl-icon-button", { name: "info-circle" })
                    ]),
                    h("sl-tooltip", { content: "Settings" }, [
                        h("sl-icon-button", { name: "gear" })
                    ])
                ])

            ])

        ])

        return card
        //return (props) => h("h1", () => props.label, props.children);
    }

    goToIndexWorld(path) {
        window.location.href = path;
    }

    get Label() {
        return (props) => h("h1", () => props.label, props.children);
    }

    initApp() {
        let self = this;
        const App = () => {
            const [state, setState] = createState({ instances: [] });
            //const [count, setCount] = createSignal(0);

            // createEffect(() => {
            //     console.log("instances:", () => state.instances);
            // });

            self.initReflectorConnection(setState)

            return [
                h(self.GlobalStyles),
                //self.containerClass
                h('header', {}, [
                    h('sl-details', {
                        summary: "About", open: false, style: {
                            "max-width": "800px"
                        }
                    }, [
                        h("a", { class: "link-in-text", href: "https://browsersound.com/" }, "BROWSER 2021"),
                        h("h4", ["A Festival of Web-based Music | June 11th-13th"]),

                        h("strong", "Delia Ramos Rodríguez and Nikolay Suslov"),
                        h("p", "Another perspective to what we normally (don't) see. The bowing after coming to the stage; the tuning of the instrument; the playing itself; the applause (?)."),
                        h("p", "As always, but different."),
                        h("p", "The art work is presented in the form of interactive, multi-user, collaborative p2p web application. Application can be run on any desktop or mobile Web Browser. The audience collaboratively explores the artwork inside virtual canvas space within multi-contextual / conceptual creative layers by touching the virtual objects. These layers are not visible by default. Interaction is based on applying or viewing through some sort of \"filters\" (augmenting reality in virtual reality). Several participants can personally or collaboratively explore the hidden layers, as well as experimenting with the artwork through these layers without breaking the original artwork."),
                        h("p", "For the implementation Open Source frameworks for Web Browser were used, especially LiveCoding.space SDK. During the development of the project there was implemented multi-user synchronization support for several open source frameworks across web browsers: multi-user 2D canvas in Two.js, synchronized Transport object in Tone.js. Also backported a video synchronization solution from Croquet V onto Virtual World Framework. MediaPipe and Hand.js were used for offline extracting of the body motion from the video performance. The project can be built from the source code and run locally without the need of internet connection, as it has no dependencies on any cloud services. The source code will be available on the project site soon.")
                    ])
                ]),
                h('main', {}, [
                    h(self.Card, { url: "https://localhost:3007/" + self.userName + "/" + self.worldName }),
                    h(For, { each: () => state.instances }, (instance) =>
                        h(self.CardInstance, { url: instance.url, clients: instance.clients, instanceID: instance.instanceID })
                    )

                ]),
                h('footer', {
                    style: {
                        "margin-top": "auto"
                    }
                }, [

                    h("small", { style: { color: "var(--sl-color-gray-500" } }, [
                        "Made with ",
                        h("a", { class: "link-in-text", href: "https://livecoding.space" }, "LiveCoding.space"), //type: "text", size:"medium",
                        " 2021"
                    ])
                ])

            ]

        };

        render(App, document.body); //document.getElementById("root")

    }

    initReflectorConnection(fun) {
        let self = this;
        this.options = {

            query: 'pathname=' + window.location.pathname.slice(1,
                window.location.pathname.lastIndexOf("/")),
            secure: window.location.protocol === "https:",
            reconnection: false,
            path: '',
            transports: ['websocket']
        }

        //window.location.host
        var socket = io.connect(window._app.reflectorHost, this.options);

        const parse = (msg) => {
            //self.setCount(msg)
            //fun("instance", msg)
            this.parseOnlineData(fun, msg)
        }
        socket.on('getWebAppUpdate', msg => parse.call(this, msg));
        socket.on("connect", function () {

            let noty = new Noty({
                text: 'Connected to Reflector!',
                timeout: 2000,
                theme: 'mint',
                layout: 'bottomRight',
                type: 'success'
            });
            noty.show();
        })

        socket.on('connect_error', function (err) {
            console.log(err);
            var errDiv = document.createElement("div");
            errDiv.innerHTML = "<div class='vwf-err' style='z-index: 10; position: absolute; top: 80px; right: 50px'>Connection error to Reflector!" + err + "</div>";
            document.querySelector('body').appendChild(errDiv);

            let noty = new Noty({
                text: 'Connection error to Reflector! ' + err,
                theme: 'mint',
                layout: 'bottomRight',
                type: 'error'
            });
            noty.show();

        });

    }


    parseOnlineData(fun, data) {
        let self = this;

        let parcedData = _app.parseAppInstancesData(data);
        let worldInfo = parcedData[self.worldName];
        if (worldInfo) {
            const instances = Object.entries(worldInfo).map(el => {
                let url = el[0].split('/');
                return {
                    clients: el[1].clients,
                    user: el[1].user,
                    url: window.location.href + el[1].user + '/' + url[1] + '?k=' + url[3],
                    instanceID: url[3]
                }
            });
            fun("instances", instances);
        } else {
            fun("instances", []);
        }
        //this.initView(Object.values(worldInfo))
    }

}

export { Standalone }