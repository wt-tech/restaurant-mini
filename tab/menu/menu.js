import httpReq from '../../utils/request.js';
Page({

  data: {
    currentSelectId: null,
    menuHeaders: [],
    menus: [],
    tableOrBoxId: null, //scene值,小程序码传递过来.以 'TAB-' 或者 'BOX-'开头,后面加id
    totalCounts: 0
  },

  onLoad: function(options) {
    let tableOrBoxId = options.scene;
    console.log(options);
    if (tableOrBoxId) { //若是通过桌上二维码扫描进来.
      this.setData({
        tableOrBoxId: tableOrBoxId
      });
    } else {
      getApp().globalHint("若您已在店内,请用微信扫描桌子或包厢上的小程序码点餐~");
    }
    this.initMenuClassification();
  },

  onHide: function() {
    this.storeMenusToAppMemory();
  },

  initMenuClassification: function() {
    wx.showLoading({
      title: '努力加载中...',
    });
    let that = this;
    let url = 'classification/listclassification';
    httpReq.getRequest([url]).then(function(success) {
      if (success.status === 'success') {
        that.setData({
          currentSelectId: success.classifications[0].id,
          menuHeaders: success.classifications
        });
        that.getMenuByClassificationId();
      } else
        getApp().globalHint("加载菜单失败");
    }).catch(function(error) {
      getApp().globalHint("加载菜单失败");
    }).finally(function() {
      wx.hideLoading();
    });
  },

  menuHeaderChanged: function(event) {
    let that = this;
    that.storeMenusToAppMemory(); //保存菜单信息
    let selectedId = event.currentTarget.dataset.id;
    that.setData({
      currentSelectId: selectedId
    });
    that.getMenuByClassificationId();
  },

  getMenuByClassificationId: function() {
    let that = this;
    //尝试从app.menusMap中获取.
    if (that.getMenusFromAppMemory()) { //缓存中存在
      //do nothing...
    } else { //缓存中不存在,发送请求从服务器获取
      that.getMenuFromBackEnd();
    }
  },

  /**
   * 从globaldata中获取menus
   * 在menu-header切换前调用
   */
  getMenusFromAppMemory: function() {
    let selectedClassificationId = this.data.currentSelectId;
    let menus = getApp().menusMap.get(selectedClassificationId);
    if (!!menus) { //menus有值
      this.setData({
        menus: menus
      });
    }
    return !!menus;
  },
  /**
   * 将menus保存到globaldata中
   * 在menu-header切换前调用,点击下一步前调用
   */
  storeMenusToAppMemory: function() {
    getApp().menusMap.set(this.data.currentSelectId, this.data.menus);
    console.log(getApp().menusMap);
  },
  getMenuFromBackEnd: function() {
    let that = this;

    wx.showLoading({
      title: '努力加载中...',
    });
    let url = 'menu/listmenu';
    let params = {
      classificationId: that.data.currentSelectId
    }
    httpReq.getRequest([url, params]).then(function(success) {
      if (success.status === 'success') {
        that.setData({
          menus: that.rawMenuDataProcess(success.menus)
        });
      } else
        getApp().globalHint("加载菜单失败");
    }).catch(function(error) {
      getApp().globalHint("加载菜单失败");
    }).finally(function() {
      wx.hideLoading();
    });
  },

  rawMenuDataProcess: function(menus) {
    console.log(menus);
    let that = this;
    if (Array.isArray(menus)) {
      return menus.map(function(menu) {
        let size = [];
        that.menuSizeAssemble(size, menu);
        return {
          id: menu.id,
          classification: menu.classification,
          name: menu.name,
          salesVolume: menu.salesVolume,
          introduction: menu.introduction,
          uncertainPrice: menu.uncertainPrice,
          unit: menu.unit,
          sort: menu.sort,
          menuimage: menu.menuimage,
          sizeList: size,
          selectedSize: size[0],
          count: 0
        };
      });
    }
  },

  menuSizeAssemble: function(size, menu) {
    let id = 0;
    if (!!menu.largePrice) { //有值
      size.push({
        id: ++id,
        value: '大'+menu.unit,
        price:  menu.largePrice
      });
    }
    if (!!menu.mediumPrice) { //有值
      size.push({
        id: ++id,
        value: '中' + menu.unit,
        price: menu.mediumPrice
      });
    }
    if (!!menu.smallPrice) { //有值
      size.push({
        id: ++id,
        value: '小' + menu.unit,
        price: menu.smallPrice
      });
    }
    if (!!menu.uncertainPrice) { //有值
      size.push({
        id: ++id,
        value: null,
        price: menu.uncertainPrice
      });
    }
  },
  //选择规格
  sizeChanged: function(event) {
    let selectedIndex = event.detail.value;
    let index = event.currentTarget.dataset.index; //用于记录菜品所在菜单列表的下标
    let newMenus = this.data.menus;
    let menu = newMenus[index]; //找到该菜品
    menu.selectedSize = menu.sizeList[selectedIndex];
    //更新对应规格菜品的价格
    this.setData({
      menus: newMenus
    });
  },

  subtractOne: function(event) {
    let index = event.currentTarget.dataset.index; //用于记录菜品所在菜单列表的下标
    let count = this.data.menus[index].count;
    if (count > 0) { //只有大于0才能减一
      let menus = this.data.menus;
      menus[index].count -= 1;
      this.setData({
        menus: menus
      });
    }
  },

  addOne: function(event) {
    let index = event.currentTarget.dataset.index; //用于记录菜品所在菜单列表的下标
    let count = this.data.menus[index].count;

    let menus = this.data.menus;
    menus[index].count += 1;
    this.setData({
      menus: menus
    });

  },

  goToTableReserve: function() {
    if (this.menuCountsDished() === 0) {
      getApp().globalHint('请先点菜~');
      return;
    }
    this.storeMenusToAppMemory();
    wx.navigateTo({
      url: '../../pages/tab/table-reserve-form/table-reserve-form'
    })
  },


  goToOrderConfirm: function() {
    if (this.menuCountsDished() === 0) {
      getApp().globalHint('请先点菜~');
      return;
    }
    this.storeMenusToAppMemory();
    let tableOrBoxId = this.data.tableOrBoxId;
    wx.navigateTo({
      url: '../../pages/tab/menu-confirm/menu-confirm?tableOrBoxId=' + tableOrBoxId
    })
  },

  /**
   * 返回所点菜的总数量
   */
  menuCountsDished: function() {
    let menus = this.data.menus;
    let totalCounts = 0;
    totalCounts = menus.reduce(function(accumulator, item, index) {
      return accumulator + item.count;
    }, totalCounts);
    return totalCounts;
  }

})