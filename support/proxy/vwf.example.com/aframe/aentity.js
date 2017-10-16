this.setGizmoMode = function (mode) {
    if (this.gizmo) {
        this.gizmo.properties.mode = mode
    }
}

this.showCloseGizmo = function () {
    let gizmoNode =
        {
            "extends": "http://vwf.example.com/aframe/gizmoComponent.vwf",
            "type": "component",
            "properties":
            {
                "mode": "translate"
            }
        }
    if (this.properties.edit) {
        this.children.create("gizmo", gizmoNode);
    } else {
        if (this.gizmo) {
            this.children.delete(this.gizmo)
        }
    }
}
