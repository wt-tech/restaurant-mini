/**
 * 分页支持类
 */

class PageSupport{

    constructor (initPageInfo){
        this.pageInfo = initPageInfo;
    }

    // 下拉刷新

    // 上滑下一页
    nextPage() {
        this.pageInfo = null;
    }

}