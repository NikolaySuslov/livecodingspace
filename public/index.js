//Load all required JS libs

loadjs([
    '/lib/ui/noty/noty.css',
    '/lib/ui/noty/themes/mint.css',
    '/lib/ui/noty/noty.js',
    '/lib/ui/spinjs/spin.css'
],'sys', {
    async: false
});

loadjs([
    '/index.css',
    '/lib/socket.io.js',
    '/lib/he.js',
    '/lib/locale/polyglot.min.js',
    '/lib/hashids.min.js',
    '/lib/page-query.js'
],'forall', {
    async: false
});

loadjs([
    '/lib/ohm/ohm.min.js',
    '/lib/fun/@most/prelude/dist/index.js',
    '/lib/fun/@most/scheduler/dist/index.js',
    '/lib/fun/@most/disposable/dist/index.js',
    '/lib/fun/@most/core/dist/index.js',
    '/lib/fun/@most/dom-event/dist/index.js',
    '/lib/fun/ramda.min.js',
    '/lib/fun/infestines.js',
    '/lib/fun/partial.lenses.min.js'
],'fun', {
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


loadjs.ready(['sys', 'fun', 'forall'], function() {
    }).ready('gundb', function() {
        import('/core/app.js')
            .then((module) => {
                new module.App
        });
})


