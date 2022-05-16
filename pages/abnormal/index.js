// pages/abnormal/index.js
import Dialog from "../../plugin_vant/dialog/dialog";
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // touchStart: function (e) {
  //   console.log(e, " right-touchStart");
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       console.log(res,'right');
  //       console.log(res.windowHeight ,"right-windowHeight");
  //       console.log(res.windowWidth,'right-windowWidth');
  //     },
  //   });
  // },

  // touchStart1: function (e) {
  //   console.log(e, " left-touchStart");
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       console.log(res,'left');
  //       console.log(res.windowHeight ,"left-windowHeight");
  //       console.log(res.windowWidth,'left-windowWidth');
  //     },
  //   });
  // },


  // 触摸移动事件
  touchMove: function (e) {
    console.log(e, " touchMove");
    console.log(Date.now())
    //     wx.getSystemInfo({
    //   success: function (res) {
    //     console.log(res.windowHeight ,"right-windowHeight");
    //     console.log(res.windowWidth,'right-windowWidth');
    //   },
    // });
  },
  // // 触摸结束事件
  // touchEnd: function (e) {
  //   console.log(e, " touchEnd");
  // },
  linkPersonhandle() {
    Dialog.alert({
      title: "管理员信息",
      theme: "round-button",
      message: "hantianyuan@lixinmedia.net",
    }).then(() => {});
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
