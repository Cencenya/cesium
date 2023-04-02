/* eslint-disable no-unused-vars */

import registerKnockoutBindings from './core/registerKnockoutBindings'
import DistanceLegendViewModel from './viewModels/DistanceLegendViewModel'
import NavigationViewModel from './viewModels/NavigationViewModel'

/**
 * @alias CesiumNavigation
 * @constructor
 *
 * @param {Viewer|CesiumWidget} viewerCesiumWidget The Viewer or CesiumWidget instance
 */
var CesiumNavigation = function(viewerCesiumWidget) {
    initialize.apply(this, arguments)

    this._onDestroyListeners = []
}

CesiumNavigation.prototype.distanceLegendViewModel = undefined
CesiumNavigation.prototype.navigationViewModel = undefined
CesiumNavigation.prototype.navigationDiv = undefined
CesiumNavigation.prototype.distanceLegendDiv = undefined
CesiumNavigation.prototype.terria = undefined
CesiumNavigation.prototype.container = undefined
CesiumNavigation.prototype._onDestroyListeners = undefined
CesiumNavigation.prototype._navigationLocked = false

CesiumNavigation.prototype.setNavigationLocked = function(locked) {
    this._navigationLocked = locked
    this.navigationViewModel.setNavigationLocked(this._navigationLocked)
}

CesiumNavigation.prototype.getNavigationLocked = function() {
    return this._navigationLocked
}

CesiumNavigation.prototype.destroy = function() {
    if (Cesium.defined(this.navigationViewModel)) {
        this.navigationViewModel.destroy()
    }
    if (Cesium.defined(this.distanceLegendViewModel)) {
        this.distanceLegendViewModel.destroy()
    }

    if (Cesium.defined(this.navigationDiv)) {
        this.navigationDiv.parentNode.removeChild(this.navigationDiv)
    }
    delete this.navigationDiv

    if (Cesium.defined(this.distanceLegendDiv)) {
        this.distanceLegendDiv.parentNode.removeChild(this.distanceLegendDiv)
    }
    delete this.distanceLegendDiv

    if (Cesium.defined(this.container)) {
        this.container.parentNode.removeChild(this.container)
    }
    delete this.container

    for (var i = 0; i < this._onDestroyListeners.length; i++) {
        this._onDestroyListeners[i]()
    }
}

CesiumNavigation.prototype.addOnDestroyListener = function(callback) {
    if (typeof callback === 'function') {
        this._onDestroyListeners.push(callback)
    }
}

/**
 * @param {Viewer|CesiumWidget} viewerCesiumWidget The Viewer or CesiumWidget instance
 * @param options
 */
function initialize(viewerCesiumWidget, options) {
    if (!Cesium.defined(viewerCesiumWidget)) {
        throw new Cesium.DeveloperError('CesiumWidget or Viewer is required.')
    }

    //        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

    var cesiumWidget = Cesium.defined(viewerCesiumWidget.cesiumWidget) ? viewerCesiumWidget.cesiumWidget : viewerCesiumWidget

    var container = document.createElement('div')
    container.className = 'cesium-widget-cesiumNavigationContainer'
    cesiumWidget.container.appendChild(container)

    this.terria = viewerCesiumWidget
    this.terria.options = (Cesium.defined(options)) ? options : {}
    this.terria.afterWidgetChanged = new Cesium.Event()
    this.terria.beforeWidgetChanged = new Cesium.Event()
    this.container = container

    // this.navigationDiv.setAttribute("id", "navigationDiv");

    // Register custom Cesium.knockout.js bindings.  If you're not using the TerriaJS user interface, you can remove this.
    registerKnockoutBindings()

    if (!Cesium.defined(this.terria.options.enableDistanceLegend) || this.terria.options.enableDistanceLegend) {
        this.distanceLegendDiv = document.createElement('div')
        container.appendChild(this.distanceLegendDiv)
        this.distanceLegendDiv.setAttribute('id', 'distanceLegendDiv')
        this.distanceLegendViewModel = DistanceLegendViewModel.create({
            container: this.distanceLegendDiv,
            terria: this.terria,
            mapElement: container,
            enableDistanceLegend: true
        })
    }

    if ((!Cesium.defined(this.terria.options.enableZoomControls) || this.terria.options.enableZoomControls) && (!Cesium.defined(this.terria.options.enableCompass) || this.terria.options.enableCompass)) {
        this.navigationDiv = document.createElement('div')
        this.navigationDiv.setAttribute('id', 'navigationDiv')
        container.appendChild(this.navigationDiv)
            // Create the navigation controls.
        this.navigationViewModel = NavigationViewModel.create({
            container: this.navigationDiv,
            terria: this.terria,
            enableZoomControls: true,
            enableCompass: true
        })
    } else if ((Cesium.defined(this.terria.options.enableZoomControls) && !this.terria.options.enableZoomControls) && (!Cesium.defined(this.terria.options.enableCompass) || this.terria.options.enableCompass)) {
        this.navigationDiv = document.createElement('div')
        this.navigationDiv.setAttribute('id', 'navigationDiv')
        container.appendChild(this.navigationDiv)
            // Create the navigation controls.
        this.navigationViewModel = NavigationViewModel.create({
            container: this.navigationDiv,
            terria: this.terria,
            enableZoomControls: false,
            enableCompass: true
        })
    } else if ((!Cesium.defined(this.terria.options.enableZoomControls) || this.terria.options.enableZoomControls) && (Cesium.defined(this.terria.options.enableCompass) && !this.terria.options.enableCompass)) {
        this.navigationDiv = document.createElement('div')
        this.navigationDiv.setAttribute('id', 'navigationDiv')
        container.appendChild(this.navigationDiv)
            // Create the navigation controls.
        this.navigationViewModel = NavigationViewModel.create({
            container: this.navigationDiv,
            terria: this.terria,
            enableZoomControls: true,
            enableCompass: false
        })
    } else if ((Cesium.defined(this.terria.options.enableZoomControls) && !this.terria.options.enableZoomControls) && (Cesium.defined(this.terria.options.enableCompass) && !this.terria.options.enableCompass)) {
        // this.navigationDiv.setAttribute("id", "navigationDiv");
        // container.appendChild(this.navigationDiv);
        // Create the navigation controls.
        //            this.navigationViewModel = NavigationViewModel.create({
        //                container: this.navigationDiv,
        //                terria: this.terria,
        //                enableZoomControls: false,
        //                enableCompass: false
        //            });
    }
}

export default CesiumNavigation