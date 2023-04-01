import Vue from "vue";

import AlertVue from "./Views/alert";
let AlertVM = Vue.extend(AlertVue);

import ConfirmVue from "./Views/confirm";
let ConfirmVM = Vue.extend(ConfirmVue);
let SmMessageBox = {
    confirm(title, content) {
        return new Promise((resolve, reject) => {
            this.comfirmInstance = new ConfirmVM({
                propsData: {
                    title,
                    content
                }
            }).$mount();
            this.comfirmInstance.show = true;
            document.body.appendChild(this.comfirmInstance.$el);
            //点击确认按钮
            this.comfirmInstance.confirmBtnClick = function() {
                resolve();
            }

            this.comfirmInstance.cancelBtnClick = function() {
                reject && reject();
            }
        })
    },

    alert(title, content) {
        return new Promise((resolve, reject) => {
            this.alertVmInstance = new AlertVM({
                propsData: {
                    title,
                    content
                }
            }).$mount();

            this.alertVmInstance.show = true;
            document.body.appendChild(this.alertVmInstance.$el);
            //点击确认按钮
            this.alertVmInstance.confirmBtnClick = function() {
                resolve();
            }
        })
    }
}
export default SmMessageBox;