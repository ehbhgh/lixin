const { requestHttp } = require("../../utils/config.js");
var log = require("../../utils/log.js"); // 引用上面的log.js文件

const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    // isHide: false

    isUser: false,
    personMessage: {
      avatar: "../../images/icon/avatar.png",
      nickname: "未登录",
    },
  },

  onLoad: function (options) {},
  onShow: function () {
    this.setData({
      isUser: false,
    });
  },

  //点击授权按钮
  getUserProfile(e) {
    this.setData({
      isUser: true,
    });
    //用户按了允许授权按钮
    wx.getUserProfile({
      desc: "获取头像及昵称",
      success: (res) => {
        let personData = {
          avatar: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName,
        };
        wx.setStorageSync("personData", personData),
          wx.navigateTo({
            url: "/pages/phoneLoginSecond/index",
          });
      },
      fail: function (err) {},
    });
  },
});
