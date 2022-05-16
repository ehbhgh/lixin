// pages/successfulRegist/index.js
//消息推送的模板id
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    executor_wx: "",
    isshow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      executor_wx: app.globalData.operatorWx,
    });
  },
  copytext(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: (result) => {
        wx.getClipboardData({
          success: (result) => {
            wx.showToast({
              title: "复制成功",
            });
          },
        });
      },
    });
  },
  returnHome() {
    //这里直接返回商单广场
    wx.navigateBack({
      delta: 3,
    });
  },
  seewxArea() {
    this.setData({
      isshow: true,
    });
  },
  onClose() {
    this.setData({
      isshow: false,
    });
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
  onUnload: function () {
    //这里直接返回商单广场
    wx.navigateBack({
      delta: 3,
    });
  },

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
