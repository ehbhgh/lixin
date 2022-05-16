// pages/category_add/index.js
import Toast from "../../plugin_vant/toast/toast";
const app = getApp();
const {extact}=require('../../utils/extact')
const { getHttp, formHttp } = require("../../utils/config.js");
var log = require("../../utils/log.js"); // 引用上面的log.js文件
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tagNameArr: [],
    //按钮禁用
    addBtnDisable: false,
    douyin_url: "",
    douyin_uid: "",
    douyin_nickname: "",
    douyin_price: "",
    weibo_url: "",
    weibo_uid: "",
    weibo_nickname: "",
    weibo_price: "",
    blibli_url: "",
    blibli_uid: "",
    blibli_nickname: "",
    blibli_price: "",
    dianping_url: "",
    dianping_uid: "",
    dianping_nickname: "",
    dianping_price: "",
    kuaishou_url: "",
    kuaishou_uid: "",
    kuaishou_nickname: "",
    kuaishou_price: "",
    little_red_book_url: "",
    little_red_book_uid: "",
    little_red_book_nickname: "",
    little_red_book_price: ""
  },

  onLoad: function (options) {
    // "type": 1, //1为点评，2为小红书，3为抖音，4为微博，5为快手，6为bilibili
    let tagNameArr = wx.getStorageSync("tagNameArr") || [];
    this.setData({
      douyin: tagNameArr.includes(3),
      weibo: tagNameArr.includes(4),
      redBook: tagNameArr.includes(2),
      dianping: tagNameArr.includes(1),
      blibli: tagNameArr.includes(6),
      kuaishou: tagNameArr.includes(5),
    });
     let cards = app.globalData.cards;
    if (cards) {
      this.setData({
        douyin_url: cards.douyin_url ,
        douyin_uid: cards.douyin_uid ,
        douyin_nickname: cards.douyin_nickname ,
        douyin_price: cards.douyin_price ,
        weibo_url: cards.weibo_url ,
        weibo_uid: cards.weibo_uid ,
        weibo_nickname: cards.weibo_nickname ,
        weibo_price: cards.weibo_price ,
        blibli_url: cards.blibli_url ,
        blibli_uid: cards.blibli_uid ,
        blibli_nickname: cards.blibli_nickname ,
        blibli_price: cards.blibli_price ,
        dianping_url: cards.dianping_url ,
        dianping_uid: cards.dianping_uid ,
        dianping_nickname: cards.dianping_nickname ,
        dianping_price: cards.dianping_price ,
        kuaishou_url: cards.kuaishou_url ,
        kuaishou_uid: cards.kuaishou_uid ,
        kuaishou_nickname: cards.kuaishou_nickname ,
        kuaishou_price: cards.kuaishou_price ,
        little_red_book_url: cards.little_red_book_url ,
        little_red_book_uid: cards.little_red_book_uid ,
        little_red_book_nickname: cards.little_red_book_nickname ,
        little_red_book_price: cards.little_red_book_price ,
      });
    }
  },
  onShow: function () {
    let cards = app.globalData.cards;
    if (cards) {
      this.setData({
        douyin_url: cards.douyin_url ,
        douyin_uid: cards.douyin_uid ,
        douyin_nickname: cards.douyin_nickname ,
        douyin_price: cards.douyin_price ,
        weibo_url: cards.weibo_url ,
        weibo_uid: cards.weibo_uid ,
        weibo_nickname: cards.weibo_nickname ,
        weibo_price: cards.weibo_price ,
        blibli_url: cards.blibli_url ,
        blibli_uid: cards.blibli_uid ,
        blibli_nickname: cards.blibli_nickname ,
        blibli_price: cards.blibli_price ,
        dianping_url: cards.dianping_url ,
        dianping_uid: cards.dianping_uid ,
        dianping_nickname: cards.dianping_nickname ,
        dianping_price: cards.dianping_price ,
        kuaishou_url: cards.kuaishou_url ,
        kuaishou_uid: cards.kuaishou_uid ,
        kuaishou_nickname: cards.kuaishou_nickname ,
        kuaishou_price: cards.kuaishou_price ,
        little_red_book_url: cards.little_red_book_url ,
        little_red_book_uid: cards.little_red_book_uid ,
        little_red_book_nickname: cards.little_red_book_nickname ,
        little_red_book_price: cards.little_red_book_price ,
      });
    }
  },

  // 解析表情
  analysisEmoji(str) {
    let keyStr = str.replace(/%/g, "%25");
    let regex =
      /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
    let nickWords = keyStr.replace(regex, function (res) {
      return encodeURIComponent(res);
    });
    return nickWords;
  },

  async formSubmit(e) {
    let val = e.detail.value;
    let nickNameReg = / /;
    let cards = [];
    //bibli
    if (val.blibli) {
      if (val.blibli_nickname == "") {
        Toast.fail("哔哩哔哩的昵称不能为空");
        return false;
      }
      if (val.blibli_url == "") {
        Toast.fail("哔哩哔哩的主页链接不能为空");
        return false;
      }
      if (val.blibli_price == "") {
        Toast.fail("哔哩哔哩的刊例报价不能为空");
        return false;
      }
      if (val.blibli_uid == "") {
        Toast.fail("哔哩哔哩的主页ID不能为空");
        return false;
      }
      if (val.blibli_uid && val.blibli_uid.length > 50) {
        Toast.fail("哔哩哔哩的主页ID不能超过50字符");
        return false;
      }
      if (val.blibli_nickname && val.blibli_nickname.length > 50) {
        Toast.fail("哔哩哔哩的昵称不能超过50字符");
        return false;
      }
      if (val.blibli_url && val.blibli_url.length > 200) {
        Toast.fail("哔哩哔哩的主页链接不能超过200字符");
        return false;
      }
      if (nickNameReg.test(val.blibli_uid)) {
        Toast.fail("哔哩哔哩的主页ID输入不能存在空格");
        return false;
      }
    }
    //dianping
    if (val.dianping) {
      if (val.dianping_nickname == "") {
        Toast.fail("大众点评的昵称不能为空");
        return false;
      }
      if (val.dianping_url == "") {
        Toast.fail("大众点评的主页链接不能为空");
        return false;
      }
      if (val.dianping_price == "") {
        Toast.fail("大众点评的刊例报价不能为空");
        return false;
      }
      if (val.dianping_uid == "") {
        Toast.fail("大众点评的主页ID不能为空");
        return false;
      }
      if (val.dianping_uid && val.dianping_uid.length > 50) {
        Toast.fail("大众点评的主页ID不能超过50字符");
        return false;
      }
      if (val.dianping_nickname && val.dianping_nickname.length > 50) {
        Toast.fail("大众点评的昵称不能超过50字符");
        return false;
      }
      if (val.dianping_url && val.dianping_url.length > 200) {
        Toast.fail("大众点评的主页链接不能超过200字符");
        return false;
      }

      if (nickNameReg.test(val.dianping_uid)) {
        Toast.fail("大众点评的主页ID输入不能存在空格");
        return false;
      }
    }
    //douying
    if (val.douyin) {
      if (val.douyin_nickname == "") {
        Toast.fail("抖音的昵称不能为空");
        return false;
      }
      if (val.douyin_url == "") {
        Toast.fail("抖音的主页链接不能为空");
        return false;
      }
      if (val.douyin_price == "") {
        Toast.fail("抖音的刊例报价不能为空");
        return false;
      }
      if (val.douyin_uid == "") {
        Toast.fail("抖音的主页ID不能为空");
        return false;
      }
      if (val.douyin_uid && val.douyin_uid.length > 50) {
        Toast.fail("抖音的主页ID不能超过50字符");
        return false;
      }
      if (val.douyin_nickname && val.douyin_nickname.length > 50) {
        Toast.fail("抖音的昵称不能超过50字符");
        return false;
      }
      if (val.douyin_url && val.douyin_url.length > 200) {
        Toast.fail("抖音的主页链接不能超过200字符");
        return false;
      }

      if (nickNameReg.test(val.douyin_uid)) {
        Toast.fail("抖音的主页ID输入不能存在空格");
        return false;
      }
    }
    //little_red_book
    if (val.little_red_book) {
      if (val.little_red_book_nickname == "") {
        Toast.fail("小红书的昵称不能为空");
        return false;
      }
      if (val.little_red_book_url == "") {
        Toast.fail("小红书的主页链接不能为空");
        return false;
      }
      if (val.little_red_book_price == "") {
        Toast.fail("小红书的刊例报价不能为空");
        return false;
      }
      if (val.little_red_book_uid == "") {
        Toast.fail("小红书的主页ID不能为空");
        return false;
      }
      if (val.little_red_book_uid && val.little_red_book_uid.length > 50) {
        Toast.fail("小红书的主页ID不能超过50字符");
        return false;
      }
      if (
        val.little_red_book_nickname &&
        val.little_red_book_nickname.length > 50
      ) {
        Toast.fail("小红书的昵称不能超过50字符");
        return false;
      }
      if (val.little_red_book_url && val.little_red_book_url.length > 200) {
        Toast.fail("小红书的主页链接不能超过200字符");
        return false;
      }
      if (nickNameReg.test(val.little_red_book_uid)) {
        Toast.fail("小红书的主页ID输入不能存在空格");
        return false;
      }
    }
    //weibo
    if (val.weibo) {
      if (val.weibo_nickname == "") {
        Toast.fail("微博的昵称不能为空");
        return false;
      }
      if (val.weibo_url == "") {
        Toast.fail("微博的主页链接不能为空");
        return false;
      }
      if (val.weibo_price == "") {
        Toast.fail("微博的刊例报价不能为空");
        return false;
      }
      if (val.weibo_uid == "") {
        Toast.fail("微博的主页ID不能为空");
        return false;
      }
      if (val.weibo_uid && val.weibo_uid.length > 50) {
        Toast.fail("微博的主页ID不能超过50字符");
        return false;
      }
      if (val.weibo_nickname && val.weibo_nickname.length > 50) {
        Toast.fail("微博的昵称不能超过50字符");
      }
      if (val.weibo_url && val.weibo_url.length > 200) {
        Toast.fail("微博的主页链接不能超过200字符");
        return false;
      }

      if (nickNameReg.test(val.weibo_uid)) {
        Toast.fail("微博的主页ID输入不能存在空格");
        return false;
      }
    }
    //快手

    if (val.kuaishou) {
      if (val.kuaishou_nickname == "") {
        Toast.fail("快手的昵称不能为空");
        return false;
      }
      if (val.kuaishou_url == "") {
        Toast.fail("快手的主页链接不能为空");
        return false;
      }
      if (val.weibo_price == "") {
        Toast.fail("快手的刊例报价不能为空");
        return false;
      }
      if (val.kuaishou_uid == "") {
        Toast.fail("快手的主页ID不能为空");
        return false;
      }
      if (val.kuaishou_uid && val.kuaishou_uid.length > 50) {
        Toast.fail("快手的主页ID不能超过50字符");
        return false;
      }
      if (val.kuaishou_nickname && val.kuaishou_nickname.length > 50) {
        Toast.fail("快手的昵称不能超过50字符");
        return false;
      }
      if (val.kuaishou_url && val.kuaishou_url.length > 200) {
        Toast.fail("快手的主页链接不能超过200字符");
        return false;
      }
      if (nickNameReg.test(val.kuaishou_uid)) {
        Toast.fail("快手的主页ID输入不能存在空格");
        return false;
      }
    }

    //b站
    if (val.blibli) {
      cards.push({
        type: parseInt(val.blibli),
        uid: val.blibli_uid,
        nickname: this.analysisEmoji(val.blibli_nickname),
        url: this.analysisEmoji(val.blibli_url),
        price: parseInt(val.blibli_price),
      });
    }
    //微博
    if (val.weibo) {
      cards.push({
        type: parseInt(val.weibo),
        uid: val.weibo_uid,
        nickname: this.analysisEmoji(val.weibo_nickname),
        url: this.analysisEmoji(val.weibo_url),
        price: parseInt(val.weibo_price),
      });
    }
    //点评
    if (val.dianping) {
      cards.push({
        type: parseInt(val.dianping),
        uid: val.dianping_uid,
        nickname: this.analysisEmoji(val.dianping_nickname),
        url: this.analysisEmoji(val.dianping_url),
        price: parseInt(val.dianping_price),
      });
    }
    //抖音
    if (val.douyin) {
      cards.push({
        type: parseInt(val.douyin),
        uid: val.douyin_uid,
        nickname: this.analysisEmoji(val.douyin_nickname),
        url: this.analysisEmoji(val.douyin_url),
        price: parseInt(val.douyin_price),
      });
    }
    //小红书
    if (val.little_red_book) {
      cards.push({
        type: parseInt(val.little_red_book),
        uid: val.little_red_book_uid,
        nickname: this.analysisEmoji(val.little_red_book_nickname),
        url: this.analysisEmoji(val.little_red_book_url),
        price: parseInt(val.little_red_book_price),
      });
    }
    //快手
    if (val.kuaishou) {
      cards.push({
        type: parseInt(val.kuaishou),
        uid: val.kuaishou_uid,
        nickname: this.analysisEmoji(val.kuaishou_nickname),
        url: this.analysisEmoji(val.kuaishou_url),
        price: parseInt(val.kuaishou_price),
      });
    }
    log.info(cards)
    wx.showModal({
      title: "提示信息",
      confirmText: "确认",
      cancelColor: "#d81e06",
      cancelText: "取消",
      confirmColor: "#000",
      content: "提交名片后无法修改，确认提交吗？",
      success: async (res) => {
        try {
          if (res.confirm) {
            //这里是点击了确定以后
            let res = await formHttp(
              "/api/v1.0/batchAddBusinessCards",
              "POST",
              {
                cards,
              }
            );
            if (res.code == 200) {
              wx.navigateBack({
                delta: 2,
              });
            
            } else if (res.code == 400) {
              wx.showToast({
                title: res.msg,
                icon: "info",
                duration: 1000,
                mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
              });
            } else if (res.code == 401) {
              wx.navigateTo({
                url: "/pages/phoneLogin/index",
              });
            } 
            else if (res.code == 403) {
              wx.showToast({
                title: res.msg,
                icon: "info",
                duration: 1000,
                mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
              });
            }
          } else {
            //这里是点击了取消以后
            wx.showToast({
              title: "取消成功",
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
    });
  },
  urlInput(e){
  let {uid,nickname}=extact(e.detail)
 
  this.setData({
    dianping_uid :uid,
    dianping_nickname:nickname

  })
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
  onHide: function () {
    app.globalData.cards= {
      douyin_url: this.data.douyin_url,
      douyin_uid: this.data.douyin_uid,
      douyin_nickname: this.data.douyin_nickname,
      douyin_price: this.data.douyin_price,
      weibo_url: this.data.weibo_url,
      weibo_uid: this.data.weibo_uid,
      weibo_nickname: this.data.weibo_nickname,
      weibo_price: this.data.weibo_price,
      blibli_url: this.data.blibli_url,
      blibli_uid: this.data.blibli_uid,
      blibli_nickname: this.data.blibli_nickname,
      blibli_price: this.data.blibli_price,
      dianping_url: this.data.dianping_url,
      dianping_uid: this.data.dianping_uid,
      dianping_nickname: this.data.dianping_nickname,
      dianping_price: this.data.dianping_price,
      kuaishou_url: this.data.kuaishou_url,
      kuaishou_uid: this.data.kuaishou_uid,
      kuaishou_nickname: this.data.kuaishou_nickname,
      kuaishou_price: this.data.kuaishou_price,
      little_red_book_url: this.data.little_red_book_url,
      little_red_book_uid: this.data.little_red_book_uid,
      little_red_book_nickname: this.data.little_red_book_nickname,
      little_red_book_price: this.data.little_red_book_price,
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.cards= {
      douyin_url: this.data.douyin_url,
      douyin_uid: this.data.douyin_uid,
      douyin_nickname: this.data.douyin_nickname,
      douyin_price: this.data.douyin_price,
      weibo_url: this.data.weibo_url,
      weibo_uid: this.data.weibo_uid,
      weibo_nickname: this.data.weibo_nickname,
      weibo_price: this.data.weibo_price,
      blibli_url: this.data.blibli_url,
      blibli_uid: this.data.blibli_uid,
      blibli_nickname: this.data.blibli_nickname,
      blibli_price: this.data.blibli_price,
      dianping_url: this.data.dianping_url,
      dianping_uid: this.data.dianping_uid,
      dianping_nickname: this.data.dianping_nickname,
      dianping_price: this.data.dianping_price,
      kuaishou_url: this.data.kuaishou_url,
      kuaishou_uid: this.data.kuaishou_uid,
      kuaishou_nickname: this.data.kuaishou_nickname,
      kuaishou_price: this.data.kuaishou_price,
      little_red_book_url: this.data.little_red_book_url,
      little_red_book_uid: this.data.little_red_book_uid,
      little_red_book_nickname: this.data.little_red_book_nickname,
      little_red_book_price: this.data.little_red_book_price,
    }
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
