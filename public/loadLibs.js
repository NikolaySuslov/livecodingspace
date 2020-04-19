//Load all required JS libs

loadjs(['/lib/yamljs/dist/yaml.js',
        '/lib/compatibilitycheck.js',
        '/lib/socket.io/socket.io.js',
        '/vwf/view/webrtc/adapter-latest.js',
        '/lib/cell.js',
        '/lib/he.js',
        '/lib/noty/noty.js',
        '/lib/draggabilly/draggabilly.pkgd.js',
        '/lib/screenfull/screenfull.min.js',
        '/lib/polyglot/polyglot.min.js',
        '/vwf/model/aframe/addon/virtualgc/nipplejs.js',
        '/lib/lively.vm_standalone.js',
        '/lib/async/async.min.js',
        '/lib/require.js',
        '/lib/crypto.js',
        '/lib/md5.js',
        '/lib/alea.js',
        '/lib/mash.js',
        '/lib/ace/ace.js'
        ],'libs', {
            async: false
        });

loadjs('/lib/mdc/dist/material-components-web.min.js', 'mdc');

loadjs(['/lib/gundb/gun.js',
        '/lib/gundb/sea.js',
        '/lib/gundb/lib/then.js',
        '/lib/gundb/lib/path.js',
        '/lib/gundb/lib/not.js',
        '/lib/gundb/lib/open.js',
        '/lib/gundb/lib/load.js',
        '/lib/gundb/lib/promise.js',
        '/lib/gundb/lib/time.js',
        '/lib/gundb/lib/bye.js',
        '/lib/gundb/lib/webrtc.js',
        '/lib/gundb/nts.js',
        '/lib/gundb/lib/radix.js',
        '/lib/gundb/lib/radisk.js',
        '/lib/gundb/lib/store.js',
        '/lib/gundb/lib/rindexed.js'
        ], 'gundb', {
            async: false
        }
);

loadjs(['/vwf.js'],'vwf');

loadjs.ready('libs', function() {
    //load libs
    }).ready('gundb', function() {
        //load gundb
    }).ready('mdc', function() {
        guiInit();
    }).ready('vwf', function() {
       
        import('/app.js')
            .then((module) => {
                let oldGunStorage = localStorage.getItem('gun/');
                if(oldGunStorage){
                    localStorage.removeItem('gun/');
                };
                new module.App
        });
})


function guiInit() {

    mdc.autoInit();
    window.addEventListener("load", function (event) {

        console.log("All resources finished loading!");

    });

    const iconEl = document.querySelector('#hideui');
    const compHideUI = new mdc.iconButton.MDCIconButtonToggle(iconEl);
    iconEl.addEventListener('MDCIconButtonToggle:change', (e) => {

        let ui = document.querySelector('.mdc-top-app-bar');
        if (ui) {

            let chkAttr = e.detail.isOn;
            if (chkAttr) {
                ui.style.visibility = 'visible'
            } else {
                ui.style.visibility = 'hidden'
            }
        }

    });

    const fullScreenToggle = document.querySelector('#fullscreenui');
    const compfullScreen = new mdc.iconButton.MDCIconButtonToggle(fullScreenToggle);
    fullScreenToggle.addEventListener('MDCIconButtonToggle:change', (e) => {

        if (screenfull.enabled) {
            screenfull.toggle();
        } else {
            // Ignore or do something else
        }
    });

}
