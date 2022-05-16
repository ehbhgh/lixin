// pages/mine/index.js
import Dialog from '../../plugin_vant/dialog/dialog';
var log = require('../../utils/log.js') // 引用上面的log.js文件
const {
  getHttp
} = require("../../utils/config.js");
const app = getApp();
Page({
  data: {
    //保存从微信返回用户信息
    personMessage: [],
    isLaunched: false,
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // log.info("dddddddddddddddddd")
    //获取用户信息
    let userInfo = wx.getStorageSync("userInfo")
    // console.log(userInfo)
    if (userInfo.nickName == undefined) {
      this.setData({
        personMessage: {
          "nickName": "未登录",
          "avatarUrl": "../../images/icon/guest.png",
        }
      })
    } else {
      this.setData({
        personMessage: userInfo
      })
    }
    this.setData({
      isLaunched: true
    })
  },

  onShow: function(options) {
    if (this.data.isLaunched){
      this.setData({
        isLaunched: false
      })
    } else {
      let userInfo = wx.getStorageSync("userInfo")
      if (userInfo.nickName == undefined) {
        this.setData({
          personMessage: {
            "nickName": "未登录",
            "avatarUrl": "../../images/icon/guest.png"
          }
        })
      } else {
        this.setData({
          personMessage: userInfo
        })
      }
    }
  },

  //联系客服
  linkService() {
    Dialog.alert({
      title: '请联系客服',
      message: 'hantianyuan@lixinmedia.net',
      theme: 'round-button'
    })
  },

  login() {
    let token = wx.getStorageSync("login_token")
    if (!token) {
      wx.navigateTo({
        url: "/pages/phoneLogin/index"
      })
    }
  },

  //点击查看名片，获取数据
  async seeName() {
    let token = wx.getStorageSync("login_token")
    //判断是否有token,是否登录
    if (token) {
      wx.showLoading({
        title: "数据加载中",
        mask: true
      })
      let res = await getHttp("/api/v1.0/show_business/info", "get")
      if (res.code === 200) {
        wx.hideLoading(res.result.data)
        if (res.result.data === -1) {
          //用户名片未完善
          wx.navigateTo({
            url: "/pages/my_name/index"
          })
        }
        else {
          //用户已经存在名片
          wx.setStorageSync("nameListdata", res.result[0])
          wx.navigateTo({
            url: "/pages/my_name/index"
          })
        }
      }
      else{
        //请求发送失败返回异常状态
        wx.navigateTo({
          url:"/pages/abnormal/index"
        })
      }
    } else {
      //没有登录返回登录状态
      wx.navigateTo({url:"/pages/phoneLogin/index"})
    }

  },
  seeShoplist(){
    //每次点击修改一下内容
    wx.setStorageSync("num",0)
    wx.navigateTo({
      url:"/pages/participant_list/index"
    })
  },
  //关于我们
  aboutMine(){
    Dialog.alert({
      message: '力心，价值的传递者',
      theme: 'round-button'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
