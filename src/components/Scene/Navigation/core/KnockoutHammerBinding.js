/* eslint-disable no-unused-vars */
import Hammer from 'hammerjs'

var KnockoutHammerBinding = {
    register: function(knockout) {
        Cesium.knockout.bindingHandlers.swipeLeft = {
            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var f = Cesium.knockout.unwrap(valueAccessor())
                new Hammer(element).on('swipeleft', function(e) {
                    var viewModel = bindingContext.$data
                    f.apply(viewModel, arguments)
                })
            }
        }

        Cesium.knockout.bindingHandlers.swipeRight = {
            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var f = Cesium.knockout.unwrap(valueAccessor())
                new Hammer(element).on('swiperight', function(e) {
                    var viewModel = bindingContext.$data
                    f.apply(viewModel, arguments)
                })
            }
        }
    }

}

export default KnockoutHammerBinding