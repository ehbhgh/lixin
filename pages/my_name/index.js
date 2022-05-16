// pages/my_name/index.js
const { getHttp, formHttp } = require("../../utils/config.js");
const { getCode } = require("../../utils/getcode.js");
import Dialog from "../../plugin_vant/dialog/dialog";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    commonData: {},
    isShow: false,
    isForbiden: false,
    isPropt: false,
    type: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从缓存中获取数
    // wx.set "disableScroll":true
  },

  onShow: function async() {
    this.getData();
  },

  async getData() {
    try {
      let res = await getHttp("/api/v1.0/myBusinessCard");
      if (res.code == 200) {
        let isShow = res.result.cards.every((item) => item.isSet == 0);
        res.result.cards.forEach((item) => {
          item.nickname = decodeURIComponent(item.nickname);
        });
        res.result.commonData.address = decodeURIComponent(
          res.result.commonData.address
        );
        this.setData({
          cards: res.result.cards,
          commonData: res.result.commonData,
          isShow,
          isflag:res.result.isShow,
          isForbiden: true,
        });
      } else if (res.code == 401) {
        getCode(this);
      } else {
        wx.showToast({
          title: res.msg,
          icon: "info",
          duration: 1000,
          mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
        });
      }
    } catch (error) {
      wx.showToast({
        title: error,
        icon: "info",
        duration: 1000,
        mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
      });
    }
  },

  cancelPlay() {
    this.setData({
      isPropt: !this.data.isPropt,
    });
  },
  //删除名片
  deleteName(e) {
    this.setData({
      isPropt: !this.data.isPropt,
      type: e.currentTarget.dataset.type,
    });
  },

  async surePlay() {
    try {
      this.setData({
        isPropt: !this.data.isPropt,
      });
      let params = {
        platformId: this.data.type,
      };
      let res = await formHttp("/api/v1.0/deleteCard", "POST", params);
      if (res.code == 200) {
        this.getData();
      } else {
        wx.showToast({
          title: res.msg,
          icon: "info",
          duration: 1000,
          mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
        });
      }
    } catch (error) {
      wx.showToast({
        title: error,
        icon: "info",
        duration: 1000,
        mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
      });
    }
  },
  modifyName() {
    wx.navigateTo({
      url: "/pages/common_add/index",
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */

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
