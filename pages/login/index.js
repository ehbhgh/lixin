const { requestHttp } = require("../../utils/config.js");
var log = require("../../utils/log.js"); // 引用上面的log.js文件

const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    // isHide: false

    isDisabled: false,
    code:''
  },

  onLoad: function () {
    this.getcode();
   
  },
  onShow: function () {
    //  let token= wx.getStorageSync("login_token");
    //  if(token){
    //   wx.switchTab({
    //     url: "/pages/homes/index",
    //   });
    //  }
   
  },

  

  getcode() {
    wx.getSetting({
      success:  (res)=> {
        if (res.authSetting["scope.userInfo"]) {
         wx.login({
          success: (res) => {
            //将code保存到全局变量中
            this.setData({
              code: res.code,
            });
         
          },
        });
        
        // app.globalData.userInfo = res.userInfo;
        }
      },
    });
   
  },

  //点击授权按钮
  getUserProfile(e) {
    //用户按了允许授权按钮
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: async (res) => {
        let  personMessages={
          avatar:res.userInfo.avatarUrl,
          nickname:res.userInfo.nickName

        }
        wx.setStorageSync("personMessage", personMessages)
        try {
          let params = {
            code: this.data.code,
          };
          log.info({
            code:this.data.code
          }); // 日志会和当前打开的页面关联，建议在页面的onHide、onShow等生命周期里面打
          //发送请求获取
          let result = await requestHttp("/api/v1.0/wx_login", "POST", params);
          if (result.code === 200) {
            //将token值保存在本地，并跳转到我的页面
            if (result.wx_token) {
              wx.setStorageSync("wx_token", result.wx_token);
              wx.switchTab({
                url: "/pages/homes/index",
              });
            }
          } else {
            wx.showToast({
              title: "微信登录失败，请重试",
              icon: "none",
            });
          }
        } catch (error) {}
      },
      fail: function (err) {
        wx.showModal({
          title: "警告",
          content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",
          showCancel: false,
          confirmText: "返回授权",
        });
      },
    });
  },
});
