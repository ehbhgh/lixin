// pages/participant_list/index.js
const { getHttp, formHttp } = require("../../utils/config.js");
const { getCode } = require("../../utils/getcode.js");
import Dialog from "../../plugin_vant/dialog/dialog";
var log = require("../../utils/log.js"); // 引用上面的log.js文件
let isShowLoading = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    styleColor: true,
    flag: false,
    value: -1,
    isLaunched: false,
    //展示dilogo
    show: false,
    // 商单数据
    //下拉框初始数据
    options: [
      {
        text: "全部平台",
        value: -1,
      },
      {
        text: "大众点评",
        value: 1,
      },
      {
        text: "小红书",
        value: 2,
      },
      {
        text: "抖音",
        value: 3,
      },
      {
        text: "微博",
        value: 4,
      },
      {
        text: "快手",
        value: 5,
      },
      {
        text: "blibli",
        value: 6,
      },
    ],
    titleArr: ["报名中", "已入选", "未入选", "已完成"],
    urlArrKeys: ["check", "content", "completed"],
    selectValue: 1,
    // 筛选框显示隐藏
    selectShower: true,

    //弹出框的输入框的值
    linkUrl: "",
    // 验证输入框格式是否正确
    isTrue: false,
    isBlank: false,
    isBlankContent: false,
    httpData: {
      platformId: -1,
      state: 1,
    },

    listDatas: [],

    //点击的id
    id: 0,

    //蒙版
    filter: false,

    isForbiden: false,

    isPropt: false,

    targetId: 0,
    shopName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //登录时拿到token,验证登录
  },

  //下拉框选项改变
  selectValue(e) {
    wx.showLoading({
      title: "数据加载中",
      mask: true,
    });
    this.setData({
      httpData: {
        ...this.data.httpData,
        platformId: e.detail,
      },
    });
    this.getInitdata();
  },

  //  //显示弹出框上传链接
  uploadUrlLink(e) {
    this.setData({
      show: true,
      id: e.target.dataset.id,
    });
  },
  //取消上传链接
  cancelHandle() {
    this.setData({
      show: false,
    });
  },
  cancelEntroll(e) {
    this.setData({
      isPropt: !this.data.isPropt,
      targetId: e.currentTarget.dataset.contractid,
      shopName: e.currentTarget.dataset.shopname,
    });
  },

  cancelPlay() {
    this.setData({
      isPropt: !this.data.isPropt,
    });
  },
  async surePlay() {
    this.setData({
      isPropt: !this.data.isPropt,
    });
    let params = { contractId: this.data.targetId };
    try {
      let res = await formHttp("/api/v1.0/cancelContract", "POST", params);
      if (res.code == 200) {
        this.getInitdata();
      } else {
        this.dialogPrompt(res.msg);
      }
    } catch (error) {
      this.dialogPrompt(error);
    }
  },
  //输入验证
  inputeidt(e) {
    this.setData({
      linkUrl: e.detail.value,
    });
    if (this.data.isBlank) {
      this.setData({
        isBlank: !this.data.isBlank,
      });
    }
  },
  //改变头标签状态
  changeState(e) {
    let index = e.currentTarget.dataset.value;
    wx.showLoading({
      title: "数据加载中",
      mask: true,
    });
    this.setData({
      httpData: {
        ...this.data.httpData,
        state: index,
      },
      selectValue: index,
      show: false,
      linkUrl: "",
    });
    this.getInitdata();
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
  //获取初始数据
  async getInitdata() {
    try {
      let res = await getHttp(
        "/api/v1.0/getMyContracts",
        "GET",
        this.data.httpData
      );
      if (res.code == 200) {
        wx.hideLoading();
        res.result.forEach((item) => {
          if (item.state == 2) {
            item.filter = true;
          } else {
            item.filter = false;
          }
        });

        this.setData({
          listDatas: res.result,
          isForbiden: true,
        });
      } else if (res.code == 401) {
        getCode(this);
      } else if (res.code == 400) {
        this.dialogPrompt(res.msg);
      } else if (res.code == 403) {
        this.dialogPrompt(res.msg);
      }
    } catch (error) {
      this.dialogPrompt(error);
    }
  },

  async requestUrl(id) {
    try {
      let params = {
        contractId: id,
        workUrl: this.data.linkUrl,
      };
      let res = await formHttp("/api/v1.0/uploadWorkUrl", "POST", params);
      this.setData({
        show: false,
      });
      if (res.code == 200 && res.result.data) {
        wx.showToast({
          title: "上传链接成功",
          icon: "success",
          duration: 2000, //持续的时间
        });
        this.setData({
          httpData: {
            ...this.data.httpData,
            state: 3,
          },
          selectValue: 3,
        });
        this.getInitdata();
      } else if (res.code == 400) {
        this.dialogPrompt(res.msg);
      } else if (res.code == 403) {
        this.dialogPrompt(res.msg);
      }
    } catch (error) {
      this.dialogPrompt(error);
    }
  },

  //确认上传链接操作
  sureHandle(e) {
    //验证非空
    if (this.data.linkUrl === "") {
      this.setData({
        isBlank: true,
      });
      return false;
    } else {
      this.requestUrl(this.data.id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pages = getCurrentPages();
    //  console.log(pages);
    this.getInitdata();
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
