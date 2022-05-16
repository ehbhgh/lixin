const { requestHttp } = require("../../utils/config.js");
var log = require("../../utils/log.js"); // 引用上面的log.js文件

const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    // isHide: false
    code: "",
    isshow: true,
    personMessage: {
      avatar: "../../images/icon/avatar.png",
      nickname: "未登录",
    },
    personData: {},
  },

  onLoad: function () {},
  onShow: function () {
    this.getcode();
    this.setData({
      personMessage: wx.getStorageSync("personData")
        ? wx.getStorageSync("personData")
        : this.data.personMessage,
    });
  },
  //弹出框
  dialog(msg) {
    Dialog.alert({
      title: "提示",
      message: msg,
      theme: "round-button",
    });
  },
  getcode() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          wx.login({
            success: (res) => {
              log.info("手机号获取code:" + res.code);
              console.log(res.code);
              //将code保存到全局变量中
              this.setData({
                code: res.code,
              });
            },
          });
        }
      },
    });
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    wx.checkSession({
      success: async (res) => {
        var ency = e.detail.encryptedData;
        var iv = e.detail.iv;
        if (!ency || !iv) {
          wx.showModal({
            title: "提示",
            content: "您点击了拒绝授权，部分功能无法使用，请重新选择允许登录",
            showCancel: true,
            confirmText: "返回",
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 2,
                });
              }
            },
          });
        } else {
          let params = {
            ...this.data.personMessage,
            code: this.data.code,
            iv: iv,
            encryptedData: ency,
          };
          log.info(this.data.personMessage.nickname + "登录参数:" + params);
          try {
            let res = await requestHttp("/api/v1.0/login", "POST", params);
            if (res.code == 200) {
              let userInfo = res.userInfo;
              wx.setStorageSync("wx_token", userInfo.wxToken);
              let personMessage = {
                avatar: userInfo.avatar,
                nickname: userInfo.nickname,
              };
              wx.setStorageSync("personMessage", personMessage);
              wx.navigateBack({
                delta: 2,
              });
            }
          } catch (error) {}
          //发送请求
        }
      },
    });

    // getPhoneNumber:fail:user deny
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.navigateBack({
    //   delta:2
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
});
