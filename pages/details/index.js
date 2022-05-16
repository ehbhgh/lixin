// pages/details/index.js
const { getHttp } = require("../../utils/config.js");
const { getCode } = require("../../utils/getcode.js");
import Dialog from "../../plugin_vant/dialog/dialog";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //分享
    withShareTicket: false,
    detailData: {},
    aId: 0,
    show: false,
    message: "",
    statusBarHeight: 0,
    navBarHeight: 0,
    floorstatus: false,
    ismessage: "",
    isshow: false,
    isForbiden: true,
    isPropt: false,
    url: "http://mcn.lixinmcn.cn:8888/index.html#/pages/detail/index?aId=",
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    console.log('参数'+options.scene);
    if (options.aId) {
      this.setData({
        aId: options.aId,
      });
    } else if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let aId = parseInt(scene.split("=")[1]);
      this.setData({
        aId: aId,
      });
    } else {
      this.setData({
        aId: this.data.aId,
      });
    }
    this.getDetailData();
    //自定义导航栏
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight,
        });
      },
    });
    let systemInfo = wx.getSystemInfoSync();
    let rect = wx.getMenuButtonBoundingClientRect
      ? wx.getMenuButtonBoundingClientRect()
      : null; //胶囊按钮位置信息
    wx.getMenuButtonBoundingClientRect();
    let navBarHeight = (function () {
      //导航栏高度
      let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
      return 2 * gap + rect.height;
    })();
    this.setData({
      navBarHeight,
    });
  },

  //回到首页
  navgatorHander() {
    wx.switchTab({
      url: "/pages/homes/index",
    });
  },
  getUserInfos() {
    this.setData({
      isShow: false,
    });
  },
  //弹出框
  dialogPrompt(msg) {
    Dialog.alert({
      title: "提示",
      message: msg,
      theme: "round-button",
    });
  },

  proptArea() {
    this.setData({
      isPropt: true,
    });
  },

  sharePlay() {
    this.setData({
      showShare: true,
    });
  },
  cancelPlay() {
    this.setData({
      showShare: false,
    });
  },
  shareH5() {
    this.setData({
      showShare: false,
    });
    Dialog.confirm({
      title: "复制h5链接",
      confirmButtonText: "复制链接",
      message: this.data.url + this.data.aId,
    })
      .then(() => {
        this.copyText();
      })
      .catch(() => {
        // on cancel
      });
  },

  copyText() {
    wx.setClipboardData({
      data: this.data.url + this.data.aId,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: "复制成功",
            });
          },
        });
      },
    });
  },
  closed() {
    this.setData({
      isPropt: false,
    });
  },
  //获取商单详情数据
  async getDetailData() {
    try {
      let res = await getHttp(
        "/api/v1.0/getAnnouncementDetail/" + this.data.aId
      );
      wx.hideLoading();
      if (res.code == 200) {
        this.setData({
          detailData: res.result,
          isForbiden: false,
        });
      } else if (res.code == 400) {
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      } else if (res.code == 401) {
        getCode(this, this.data.aId);
      } else if (res.code == 403) {
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      }
    } catch (error) {
      this.setData({
        ismessage: error,
        isshow: true,
      });
    }
  },

  //返回上一层
  onClose() {
    wx.switchTab({
      url: "/pages/homes/index",
    });
  },
  getUserInfo() {
    wx.redirectTo({
      url: "/pages/my_name/index",
    });
  },

  //数据预填
  async signUphandle() {
    try {
      let res = await getHttp(
        "/api/v1.0/getEnrollmentInfo?aId=" + this.data.detailData.aId,
        "GET"
      );
      if (res.code == 200) {

        wx.setStorageSync("inintData", res.result);
        wx.setStorageSync("isFlag", res.result.isShow);
        wx.setStorageSync("citySelect", res.result.city);
        wx.setStorageSync("fansCount", res.result.fansCount);
        wx.setStorageSync("customerizedItems", res.result.customerizedItems);
        wx.navigateTo({
          url: "/pages/enrolls/index?aId=" + this.data.detailData.aId,
        });
      } else if (res.code == 400) {
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      } else if (res.code == 401) {
        getCode(this);
      } else if (res.code == 400) {
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      } else if (res.code == 403) {
        this.setData({
          ismessage: res.msg,
          isshow: true,
        });
      } else if (res.code == 406) {
        this.setData({
          show: true,
          message: res.msg,
        });
      } else {
        wx.redirectTo({
          url: "/pages/abnormal/index",
        });
      }
    } catch (error) {
      this.dialogPrompt(error);
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
    this.setData({
      aId: this.data.aId,
    });
    this.getDetailData();
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
  onShareAppMessage(ops) {
    this.setData({
      showShare: false,
    });
    wx.showShareMenu({
      withShareTicket: true,
    });
    return {
      title: this.data.detailData.activityName,
      path: "/pages/details/index?aId=" + this.data.aId,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: "success",
          duration: 1500, //持续的时间
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: "转发失败",
          icon: "warn",
          duration: 2000, //持续的时间
        });
      },
    };
  },
});
