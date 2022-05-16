const { getHttp } = require("../../utils/config.js");
const { getCode } = require("../../utils/getcode.js");
import Dialog from "../../plugin_vant/dialog/dialog";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    performanceDetailDatas: {},
    statusBarHeight: 0,
    navBarHeight: 0,
    customerizedItems: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    wx.showLoading({
      title: "加载中...",
      mask: true,
    });
    let id = parseInt(options.contractId);
    this.getDettailData(id);
  },

  //调起dilogo
  dialog(msg) {
    Dialog.alert({
      title: "提示",
      message: msg,
      theme: "round-button",
    });
  },
  navgatorHander() {
    wx.navigateBack({
      delta: 1,
    });
  },

  async getDettailData(id) {
    try {
      let res = await getHttp("/api/v1.0/getContractDetail/" + id, "GET");
      wx.hideLoading();
      if (res.code == 200) {
        console.log(res);
        this.setData({
          performanceDetailDatas: res.result,
          customerizedItems: res.result.customerizedItems,
          isShow:res.result.isShow
        });
      }  else if (res.code == 400) {
        this.dialog(res.msg);
      } else if (res.code == 401) {
        getCode(this);
      } else if (res.code == 403) {
        this.dialog(res.msg);
      }
    } catch (error) {
      this.dialog(error);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
