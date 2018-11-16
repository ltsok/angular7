
/**
 * 全局接口
 * @export
 * @interface ITpiGlobal
 */
export interface ITpiGlobal {


    /**
     * 显示loading遮罩层
     * @memberof ITpiGlobal
     */
    showLoading(): void;


    /**
     * 隐藏loading遮罩层
     * @memberof ITpiGlobal
     */
    hideLoading(): void;


    //TODO:
    /**
     * 弹出确认框
     * @memberof ITpiGlobal
     */
    confirmDialog(): void;


    /**
     * 弹出告警框
     * @memberof ITpiGlobal
     */
    warnDialog(): void;


    /**
     * 弹出错误框
     * @memberof ITpiGlobal
     */
    errorDialog(): void;


    /**
     * 弹出成功框
     * @memberof ITpiGlobal
     */
    successDialog(): void;
}