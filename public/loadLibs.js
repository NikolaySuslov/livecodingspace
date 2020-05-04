//Load all required JS libs

loadjs([
    '/lib/async/async.min.js',
    '/lib/socket.io/socket.io.js',
    '/lib/cell.js',
    '/lib/he.js',
    '/lib/noty/noty.js',
    '/lib/screenfull/screenfull.min.js',
    '/lib/polyglot/polyglot.min.js',
    '/lib/mdc/dist/material-components-web.min.js',
    '/lib/ace/ace.js',
    '/lib/yamljs/dist/yaml.js',
],'forall', {
    async: false
});


loadjs(['/lib/gundb/gun.min.js',
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


loadjs.ready('forall', function() {
    //int mdc
    mdc.autoInit();
    }).ready('gundb', function() {
        //load gundb
        import('/app.js')
            .then((module) => {
                let oldGunStorage = localStorage.getItem('gun/');
                if(oldGunStorage){
                    localStorage.removeItem('gun/');
                };
                new module.App
        });
})
