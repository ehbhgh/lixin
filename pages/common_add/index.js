// pages/weibo_add/index.js
import Toast from "../../plugin_vant/toast/toast";
const { getCode } = require("../../utils/getcode.js");
const { getHttp, formHttp } = require("../../utils/config.js");
var log = require("../../utils/log.js"); // 引用上面的log.js文件
Page({
  /**
   * 页面的初始数据
   */

  data: {
    //表单是否禁用
    isDisable: false,

    //弹出框控制
    sureShow: false,

    //新建标签数组
    cards: [],

    //标签数组
    newArr: [],

    //按钮禁用
    isAddBtn: false,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tagNameArr = wx.getStorageSync("tagNameArr");
    if (tagNameArr.length > 0) {
      wx.setStorageSync("tagNameArr", []);
    }
    this.getData();
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
    log.info(this.data.isShow,'微信名:'+wx.getStorageSync('personMessage').nickname);
  },

  async getData() {
    let res = await getHttp("/api/v1.0/myBusinessCard");
    this.setData({
      isShow: res.result.isShow
    })
    if (res.code == 200) {
      if (this.data.sureShow) {
        this.setData({
          realName: "",
          alipay: "",
          mobile: "",
          address: "",
        });
      } else {
        this.setData({
          realName: res.result.commonData.realName,
          alipay: res.result.commonData.alipay,
          mobile: res.result.commonData.mobile,
          address: res.result.commonData.address,
          wx: res.result.commonData.wx
        });
      }
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
  },

  //提交
  formSubmit(e) {
    if (
      e.detail.value.realName == "" ||
      e.detail.value.mobile == "" ||
      e.detail.value.address == "" ||
      e.detail.value.wx === "" ||
      e.detail.value.alipay == ""
    ) {
      Toast.fail("请将信息填写完整后再提交");
    } else {
      if (e.detail.value.address.length > 100) {
        Toast.fail("寄送地址字数超过上限");
        this.setData({
          address: "",
        });
      } else {
        let realNameReg = / /;
        let alipayNumReg = / /;
        let sendAddressReg = / /;
        let wxNameReg = / /;
        let mobbileReg = / /;
        let chineseReg = /[\u4e00-\u9fa5]/g;
        if (
          chineseReg.test(e.detail.value.realName.replace(" ", "")) &&
          realNameReg.test(e.detail.value.realName)
        ) {
          Toast.fail("请输入正确的姓名格式");
        } else if (alipayNumReg.test(e.detail.value.alipay)) {
          Toast.fail("支付宝不能存在空格");
        } else if (wxNameReg.test(e.detail.value.wx)) {
          Toast.fail("微信号不能存在空格");
        } else if (sendAddressReg.test(e.detail.value.address)) {
          Toast.fail("寄送地址不能存在空格");
        } else if (mobbileReg.test(e.detail.value.mobile)) {
          Toast.fail("请输入正确的手机号格式");
        } else {
          this.setData({
            isDisable: true,
          });
          //这里是点击了确定以后
          if (e.detail.value) {
            this.addform(e.detail.value);
          }
        }
      }
    }
  },

  async addform(val) {
    //发送请求
    try {
      let res = await formHttp("/api/v1.0/editCommonData", "POST", val);
      if (res.code == 200) {
        wx.showToast({
          title: "保存成功",
          icon: "success",
          duration: 1000,
          mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
          success: async () => {
            try {
              let res = await getHttp("/api/v1.0/myBusinessCard");
              if (res.code == 200) {
                this.setData({
                  isDisable: true,
                  sureShow: true,
                  realName: "",
                  mobile: "",
                  address: "",
                  wx: "",
                  alipay: "",
                  isAddBtn: true,
                });
                res.result.cards.forEach((item) => {
                  if (item.isSet == 0) {
                    item.showTag = false;
                  }
                  if (item.type == 1) {
                    item.title = "大众点评";
                  }
                  if (item.type == 2) {
                    item.title = "小红书";
                  }
                  if (item.type == 3) {
                    item.title = "抖音名片";
                  }
                  if (item.type == 4) {
                    item.title = "微博名片";
                  }
                  if (item.type == 5) {
                    item.title = "快手名片";
                  }
                  if (item.type == 6) {
                    item.title = "哔哩哔哩";
                  }
                });
                this.setData({
                  cards: res.result.cards,
                });
              } else if (res.code == 401) {
                getCode(this);
              } else {
                Dialog.alert({
                  message: res.msg,
                });
              }
            } catch (error) {
              Dialog.alert({
                message: error,
              });
            }
          },
        });
      } else if (res.code == 401) {
        getCode(this);
      } else if (res.code == 403) {
        wx.showToast({
          title: res.msg,
          icon: "info",
          duration: 1000,
          mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
        });
      } else if (res.code == 400) {
        wx.showToast({
          title: res.msg,
          icon: "info",
          duration: 1000,
          mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: "info",
          duration: 1000,
          mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false ,
        });
      }
    } catch (error) {
      Dialog.alert({
        message: error,
      });
    }
  },

  //点击标签
  nameSelect(e) {
    let id = e.currentTarget.dataset.id;
    this.data.cards.map((item) => {
      if (item.type == id) {
        item.showTag = !item.showTag;
      }
    });
    this.setData({
      cards: this.data.cards,
    });
  },

  //二次提交
  nextSumbit() {
    let newArr = [];
    this.data.cards.forEach((item) => {
      if (item.showTag) {
        newArr.push(item.type);
      }
    });
    this.setData({
      newArr,
    });
    wx.setStorageSync("tagNameArr", newArr);
    if (newArr.length <= 0) {
      Toast.fail("请选择至少一个平台进行创建名片");
      return false;
    }
    if (newArr.length > 6) {
      Toast.fail("暂无名片可绑定");
      return false;
    }
    wx.navigateTo({
      url: "/pages/category_add/index",
    });
  },
  cancel() {
    wx.navigateBack(); //返回上一个页面
  },
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
