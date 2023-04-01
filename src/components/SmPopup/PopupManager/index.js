let popupManager = {
    getIndex() {
        if (!this.zIndex) {
            this.zIndex = 1000; //默认对话框 模态面板的zIndex值设置为1000
        }
        return this.zIndex++;
    }
}

export default popupManager;