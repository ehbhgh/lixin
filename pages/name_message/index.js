// pages/name_message/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.name,
    });
    if(options.name==1){
        wx.setNavigationBarTitle({
            title: "抖音名片信息在哪",
          });
    }
    if(options.name==2){
        wx.setNavigationBarTitle({
            title: "微博名片信息在哪",
          });
    }
    if(options.name==3){
        wx.setNavigationBarTitle({
            title: "小红书名片信息在哪",
          });
    }
    if(options.name==4){
        wx.setNavigationBarTitle({
            title: "大众点评名片信息在哪",
          });
    }
    if(options.name==5){
        wx.setNavigationBarTitle({
            title: "Blibli名片信息在哪",
          });
    }
    if(options.name==6){
        wx.setNavigationBarTitle({
            title: "快手名片信息在哪",
          });
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
