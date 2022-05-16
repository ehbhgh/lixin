// /index.js
const app = getApp();
const { getHttp } = require("../../utils/config.js");
import Dialog from "../../plugin_vant/dialog/dialog";
var log = require("../../utils/log.js"); // 引用上面的log.js文件
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // actionSheetHidden:false,
    selectNull: null,
    citySelect: {
      cityName: "全国",
      cityId: -1,
    },
    statusBarHeight: 0,
    navBarHeight: 0,
    floorstatus: false,
    //长度

    newArr: [
      {
        platformId: -1,
        name: "全部平台",
      },
      {
        platformId: 1,
        name: "大众点评",
      },
      {
        platformId: 2,
        name: "小红书",
      },
      {
        platformId: 3,
        name: "抖音",
      },
      {
        platformId: 4,
        name: "微博",
      },

      {
        platformId: 5,

        name: "快手",
      },
      {
        platformId: 6,
        name: "哔哩哔哩",
      },
    ],
    targetIndex: 0,
    //下拉
    isRefreshing: false, //是否下拉刷新状态
    dataList: [],
    showLoading: false,
    //传递到后端数据
    messageDatas: {
      cityId: -1,
      platformId: -1,
      offset: 0,
      perPage: 10,
    },

    //获取商单数据
    shopDatas: [],

    //加载完毕
    finished: false,

    //每次数据
    everyData: [],

    isPropt: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isPropt: false,
    });
    //轮播图
    this.getSwiper();
    //自定义导航栏
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight,
        });
      },
    });
    let systemInfo = wx.getSystemInfoSync();
    let rect = wx.getMenuButtonBoundingClientRect
      ? wx.getMenuButtonBoundingClientRect()
      : null; //胶囊按钮位置信息
    wx.getMenuButtonBoundingClientRect();
    let navBarHeight = (function () {
      //导航栏高度
      let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
      return 2 * gap + rect.height;
    })();
    this.setData({
      navBarHeight,
    });
  },

  onChange(event) {
    const { picker, value, index } = event.detail;

    // Toast(`当前值：${value}, 当前索引：${index}`);
  },
  //省市确定
  bindcityPickerChange() {
    wx.navigateTo({
      url: "/pages/citys/index",
    });
  },
  //弹出框
  dialogPrompt(msg) {
    Dialog.alert({
      title: "提示",
      message: msg,
      theme: "round-button",
    });
  },

  proptPlay() {
    this.setData({
      isPropt: true,
    });
  },

  closed(){
    this.setData({
      isPropt: false,
    });
  },
  //获取banner
  async getSwiper() {
    try {
      let res = await getHttp("/api/v1.0/getBannerList", "GET");
      if (res.code == 403) {
        this.dialogPrompt(res.msg);
      } else if (res.code == 400) {
        this.dialogPrompt(res.msg);
      } else {
        res.result[0].link =
          "https://mp.weixin.qq.com/s/_cY83ZeJR32rFzr5wAySwg";
        res.result[1].link =
          "https://mp.weixin.qq.com/s/OS4krZow0nRVczA_fIaWBg";
        this.setData({
          bannerResults: res.result,
        });
      }
    } catch (error) {
      this.dialogPrompt(error);
    }
  },

  //获取信息列表
  async getShopMessage() {
    try {
      let res = await getHttp(
        "/api/v1.0/getAnnouncementList",
        "GET",
        this.data.messageDatas
      );
      wx.hideLoading();
      if (res.code == 200) {
        this.setData({
          everyData: res.result,
          finished: false,
        });
        if (this.data.messageDatas.offset == 0) {
          this.setData({
            shopDatas: res.result,
          });
        } else {
          let shopDatas = this.data.shopDatas;
          //获取新列表
          let arr = res.result;
          //新列表数据与原列表数据合并
          let newArr = shopDatas.concat(arr);
          this.setData({
            shopDatas: newArr,
            isRefreshing: false,
          });
        }
      } else if (res.code == 400) {
        this.dialogPrompt(res.msg);
      }
    } catch (error) {
      this.dialogPrompt(error);
    }
  },

  //点击便签
  tagHandle(e) {
    wx.showLoading({
      title: "加载中...",
    });
    this.setData({
      targetIndex: e.currentTarget.dataset.id,
      messageDatas: {
        ...this.data.messageDatas,
        offset: 0,
        platformId: e.currentTarget.dataset.id
          ? e.currentTarget.dataset.id
          : -1,
      },
      finished: false,
    });
    //商单信息列表
    this.getShopMessage();
  },

  wxlinkPlay(e) {
    wx.navigateTo({
      url: "/pages/weixinLink/index?url=" + e.currentTarget.dataset.link,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  // getPhoneNumber (e) {
  //   console.log(e.detail.errMsg)
  //   console.log(e.detail.iv)
  //   console.log(e.detail.encryptedData)
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    this.data.newArr.forEach((item) => {
      item.innerWidth = 46 + (item.name.length - 2) * 10;
    });
    wx.showLoading({
      title: "加载中...",
    });
    this.setData({
      isPropt: false,
      newArr: this.data.newArr,
      citySelect: app.globalData.cityitem
        ? app.globalData.cityitem
        : this.data.citySelect,
      messageDatas: {
        ...this.data.messageDatas,
        offset: 0,
        cityId: app.globalData.cityitem ? app.globalData.cityitem.cityId : -1,
      },
      finished: false,
    });
    //商单信息列表

    this.getShopMessage();

   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isPropt: false,
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isPropt: false,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.everyData.length == 0) {
      this.setData({
        finished: true,
      });
    } else {
      let index =
        this.data.messageDatas.perPage + this.data.messageDatas.offset;
      this.setData({
        messageDatas: {
          ...this.data.messageDatas,
          offset: index,
        },
        isRefreshing: true,
      });

      this.getShopMessage();
    }
  },
  goTop(e) {
    // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  },

  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true,
      });
    } else {
      this.setData({
        floorstatus: false,
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
