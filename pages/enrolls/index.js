// pages/enrolls/index.js
const dateTimePicker = require("../../utils/dateTimePicker.js");
const { getHttp, formHttp } = require("../../utils/config.js");
const { getCode } = require("../../utils/getcode.js");
import Dialog from "../../plugin_vant/dialog/dialog";
import Toast from "../../plugin_vant/toast/toast";
let tmplId = "HiyadcYYvnA7zFipmOfTOmAmaCdOtrpI6RMZWdTlVl8";
var log = require("../../utils/log.js"); // 引用上面的log.js文件
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 选择时间
    date: "2018-10-01",
    time: "12:00",
    dateTimeArray: null,
    dateTime: null,
    startYear: 2020,
    endYear: 2050,
    value: "",
    showerTime: true,
    //预填数据
    inintData: {},
    selectNull: null,
    citySelect: [],
    citySelectIndex: 0,
    aId: 0,
    show: false,
    message: "",
    isBtn: false,
    placeText: "请填写商单中要求填的信息，如无可不填，不超过1000字",
    ismessage: "",
    isshow: false,
    fansCount: "",
    isforbiden: false,
    targetIndex: 0,
    arr: [],
    buttomShow: false,
    targetId: 0,
    // selectValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let aId = parseInt(options.aId);
    // 获取完整的年月日 时分秒，以及默认显示的数组
    let obj = dateTimePicker.dateTimePicker(
      this.data.startYear,
      this.data.endYear
    );
    //赋值初始数据
    this.setData({
      arr: this.data.arr,
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      aId: aId,
      isflag: wx.getStorageSync("isFlag"), 
      inintData: wx.getStorageSync("inintData")
        ? wx.getStorageSync("inintData")
        : {},
      arr: wx.getStorageSync("customerizedItems")
        ? wx.getStorageSync("customerizedItems")
        : [],
      citySelect: wx.getStorageSync("citySelect")
        ? wx.getStorageSync("citySelect")
        : [],
      fansCount: wx.getStorageSync("fansCount")
        ? wx.getStorageSync("fansCount")
        : null,
    });
    this.data.arr.forEach((element) => {
      element.uid = this.GenNonDuplicateID();
      element.open = false;
    });
    this.setData({
      arr: this.data.arr,
    });
    if (this.data.fansCount && this.data.fansCount != null) {
      this.setData({
        isforbiden: true,
      });
    } else {
      this.setData({
        isforbiden: false,
      });
    }
  },

  // 生成id
  GenNonDuplicateID() {
    return Math.random().toString();
  },

  //文本框输入
  txtInput(e) {
    let id = e.currentTarget.dataset.id;
    this.data.arr.forEach((item) => {
      if (item.uid == id) {
        item.value = e.detail.value;
      }
    });
    this.setData({
      arr: this.data.arr,
    });
  },

  //选择对应的弹出层
  selectItem(e) {
    let id = e.currentTarget.dataset.id;
    this.data.arr.forEach((item) => {
      if (item.uid == id) {
        item.open = true;
      }
    });
    this.setData({
      arr: this.data.arr,
    });
  },

  //选择弹出层中的选项
  selctOptions(e) {
    var valueArr = e.currentTarget.dataset.value;
    this.data.arr.forEach((item) => {
      if (item.uid == valueArr[0]) {
        item.value = valueArr[1];
      }
    });
    this.setData({
      targetIndex: valueArr[2],
    });
    this.closePround();
  },
  closePround() {
    this.data.arr.forEach((item) => {
      item.open = false;
    });
    this.setData({
      arr: this.data.arr,
    });
  },

  //时间选择器
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value,
      showerTime: false,
    });
  },
  //省市确定
  bindcityPickerChange(e) {
    this.setData({
      selectNull: "0",
      citySelectIndex: e.detail.value,
    });
  },
  //时间选择
  changeDateTimeColumn(e) {
    let arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(
      dateArr[0][arr[0]],
      dateArr[1][arr[1]]
    );
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
    });
  },

  //输入文本框
  inputeidt(e) {
    this.setData({
      [e.currentTarget.dataset.value]: e.detail.value,
    });
  },
  //复选框
  onChangeone() {
    this.setData({
      checked1: !this.data.checked1,
    });
  },
  onChangetwo() {
    this.setData({
      checked2: !this.data.checked2,
    });
  },
  onChangefour() {
    this.setData({
      checked4: !this.data.checked4,
    });
  },
  //返回上一层
  onClose() {
    wx.navigateBack({
      delta: 1, //返回上一级页面
    });
  },
  getUserInfo() {
    wx.redirectTo({
      url: "/pages/my_name/index",
    });
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

  propt(message) {
    Toast.fail({
      mask: false,
      message: message,
      forbidClick: true,
    });
  },

  //根据内容提示不行
  txt() {
    const res = this.data.arr.every((item) => {
      if (item.value == null) {
        this.propt("请选择" + item.key);
        return false;
      }
      if ((item.type == 1 || 2) && item.value.length > 1000) {
        this.propt(item.key + "不能超过1000字");
        return false;
      }
      if (item.type == 1 && item.value.trim().length == 0) {
        this.propt(item.key + "不能为空");
        return false;
      }
      if (item.type == 2 && item.value.toString().trim().length == 0) {
        this.propt(item.key + "不能为空");
        return false;
      }
      return true;
    });
    return res;
  },

  //报名成功
  async enlistHandle() {
    if (this.data.selectNull != 0) {
      this.propt("请选择履约城市");
      return false;
    }
    if (this.data.showerTime == true) {
      this.propt("请选择执行时间");
      return false;
    }
    if (this.data.fansCount == null) {
      this.propt("请填写粉丝数量");
      return false;
    }
    if (this.data.fansCount.toString().trim().length == 0) {
      this.propt("粉丝数量不能为空");
      return false;
    }
    if (this.data.value.length > 1000) {
      this.propt("备注信息字数不能超过1000");
      return false;
    }
    if (!this.txt()) {
      return false;
    }
    if (!this.data.checked1) {
      this.propt("请勾选并确认是否满足粉丝要求");
      return false;
    }
    if (!this.data.checked2) {
      this.propt("请勾选并确认商单内容");
      return false;
    }
    if (!this.data.checked4) {
      this.propt("请勾选并确认是否是本人账号");
      return false;
    }
    try {
      wx.showLoading({
        title: "加载中...",
        mask: true,
      });
      this.data.arr.forEach((item) => {
        if (item.type == 1) {
          item.value = this.analysisEmoji(item.value);
        }
        if (item.type == 2) {
          item.value = parseInt(item.value);
        }
      });
      let params = {
        availableTime:
          this.data.dateTimeArray[0][this.data.dateTime[0]] +
          "-" +
          this.data.dateTimeArray[1][this.data.dateTime[1]] +
          "-" +
          this.data.dateTimeArray[2][this.data.dateTime[2]] +
          " " +
          this.data.dateTimeArray[3][this.data.dateTime[3]] +
          ":" +
          this.data.dateTimeArray[4][this.data.dateTime[4]] +
          ":" +
          this.data.dateTimeArray[5][this.data.dateTime[5]],
        remarks: this.analysisEmoji(this.data.value),
        cityString: this.data.citySelect[this.data.citySelectIndex],
        aId: this.data.aId,
        fansCount: parseInt(this.data.fansCount),
        customerizedItems: this.data.arr,
      };
      this.setData({
        isBtn: true,
      });
      let res = await formHttp("/api/v1.0/enroll3", "POST", params);
      log.info(res);
      this.setData({
        value: "",
        placeText: "",
      });
      if (res.code == 200) {
        app.globalData.operatorWx = res.result.operatorWx;
        wx.hideLoading();
        this.submit();
      } else if (res.code == 400) {
        wx.hideLoading();
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      } else if (res.code == 401) {
        wx.hideLoading();
        getCode(this);
      } else if (res.code == 400) {
        wx.hideLoading();
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      } else if (res.code == 403) {
        wx.hideLoading();
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      } else if (res.code == 406) {
        wx.hideLoading();
        this.setData({
          show: true,
          message: res.msg,
        });
      } else {
        wx.hideLoading();
        wx.redirectTo({
          url: "/pages/abnormal/index",
        });
      }
    } catch (error) {
      this.setData({
        ismessage: error,
        isshow: true,
      });
    }
  },
  getUserInfos() {
    this.setData({
      isShow: false,
    });
  },
  submit() {
    // 调用微信 API 申请发送订阅消息
    wx.requestSubscribeMessage({
      // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
      tmplIds: [tmplId],
      success: (res) => {
        // 申请订阅成功
        if (res[tmplId] == "accept") {
          //某条订阅信息 接收或者拒绝
          wx.showToast({
            title: "订阅成功！", // 标题
            icon: "success", // 图标类型，默认success
            duration: 1500, // 提示窗停留时间，默认1500ms
          });
        } else if (res[tmplId] == "reject") {
          // 用户拒绝授权
          wx.showModal({
            title: "温馨提示",
            content:
              "您已关闭消息推送，如需要消息推送服务，请点击确定跳转设置页面打开授权后再次尝试。",
            success: function (modal) {
              if (modal.confirm) {
                // 点击确定
                wx.openSetting({
                  withSubscriptions: true,
                });
              }
            },
          });
        }
        wx.navigateTo({
          url: "/pages/successful_regist/index",
        });
      },
      fail: (err) => {
        if (err.errCode == "20004") {
          wx.showModal({
            title: "温馨提示",
            content:
              "您的消息订阅主开关已关闭，如需要消息推送服务，请点击确定跳转设置页面打开授权后再次尝试。",
            success: function (modal) {
              if (modal.confirm) {
                // 点击确定
                wx.openSetting({
                  withSubscriptions: true,
                });
              }
            },
          });
        }
      },
    });
  },
  //弹出框
  dialogPrompt(msg) {
    Dialog.alert({
      title: "提示",
      message: msg,
      theme: "round-button",
      zIndex: 990,
      className: "dialog",
    });
  },

  fansInput(e) {
    this.setData({
      fansCount: e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isflag: wx.getStorageSync("isFlag"), 
    })
    let obj = wx.getStorageSync("obj");
    if (obj && obj.uid == this.data.aId) {
      this.setData({
        arr: obj.arr,
        checked1: obj.checked1,
        checked2: obj.checked2,
        checked4: obj.checked4,
        value: obj.value,
        citySelectIndex: obj.citySelectIndex,
        selectNull: obj.selectNull,
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        showerTime: obj.showerTime,
        fansCount: obj.fansCount,
      });
    }
    wx.removeStorageSync(obj);
  },

  //保存数据
  storeData() {
    let obj = {
      uid: this.data.aId,
      arr: this.data.arr,
      checked1: this.data.checked1,
      checked2: this.data.checked2,
      checked4: this.data.checked4,
      value: this.data.value,
      citySelectIndex: this.data.citySelectIndex,
      selectNull: this.data.selectNull,
      dateTime: this.data.dateTime,
      dateTimeArray: this.data.dateTimeArray,
      showerTime: this.data.showerTime,
      fansCount: this.data.fansCount,
    };
    wx.setStorageSync("obj", obj);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.storeData();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeData();
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
