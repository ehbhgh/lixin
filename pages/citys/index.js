const app = getApp();
const { getHttp } = require("../../utils/config.js");
import Dialog from "../../plugin_vant/dialog/dialog";
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcitysData();
  },
  bindAZ: function (e) {
    var currentCityName = e.currentTarget.dataset.id;
    var that = this;
    //放入A-Z的scrollTop参数
    if (that.data.scrollAZ == null) {
      wx.createSelectorQuery()
        .selectAll(".city-item-A-Z")
        .fields(
          {
            dataset: true,
            size: true,
            rect: true,
          },
          function (res) {
            res.forEach(function (re) {
              if (currentCityName == re.dataset.cityname) {
                wx.pageScrollTo({
                  scrollTop: re.top + that.data.scrollNow - 55.5,
                  duration: 0,
                });
              }
            });
          }
        )
        .exec();
    } else {
      this.data.scrollAZ.forEach(function (re) {
        if (currentCityName == re.dataset.cityname) {
          wx.pageScrollTo({
            scrollTop: re.top + that.data.scrollNow - 55.5,
            duration: 0,
          });
        }
      });
    }
  },
  onPageScroll: function (e) {
    // 获取滚动条当前位置
    this.setData({
      scrollNow: e.scrollTop,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  //选择操作
  citySelected: function (e) {
    var cityNameTemp = e.currentTarget.dataset.cityname;
    let citys=this.data.citys
    let cityItem=citys.find(item=>item.cityName==cityNameTemp)
    if (cityNameTemp.match(/[\u4e00-\u9fa5]/) && cityNameTemp !== "热门") {
      app.globalData.cityitem = {
        cityName:cityNameTemp,
        cityId:cityItem.cityId || ''
      }
      wx.navigateBack();
    }
  },

  //搜索操作
  bindSarchInput: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });

    var inputVal = e.detail.value;
    var cityResultsTemp = new Array();
    var citys = this.data.citys;
    if (inputVal == null || inputVal.trim() == "") {
      this.setData({
        cityResults: citys,
      });
      return;
    }
    citys.forEach((item) => {
      if (item.cityName.includes(inputVal) && item.cityName != "热门") {
        cityResultsTemp.push(item);
      }
    });
    let obj = {};
    cityResultsTemp = cityResultsTemp.reduce((cur, next) => {
      obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
      return cur;
    }, []);
    this.setData({
      cityResults: cityResultsTemp,
    });
  },
  dialogPrompt(msg) {
    Dialog.alert({
      title: "提示",
      message: msg,
      theme: "round-button",
    });
  },
  //获取城市数据
  async getcitysData() {
    try {
      let res = await getHttp("/api/v1.0/getCityList", "GET");
      if (res.code == 403) {
        this.dialogPrompt(res.msg);
      } else if (res.code == 400) {
        this.dialogPrompt(res.msg);
      } else {
        if (this.data.cityResults.length === 0) {
          this.setData({
            cityResults: res.result,
            citys: res.result,
          });
        }
      }
    } catch (error) {
      this.dialogPrompt(error)
    }
  },

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
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  /**
   * 页面的初始数据
   */ data: {
    scrollAZ: null,
    scrollNow: 0,
    cityType: "begin",
    cityResults: [],
    cityAZ: [
      { cityName: "热门" },
      { cityName: "A" },
      { cityName: "B" },
      { cityName: "C" },
      { cityName: "D" },
      { cityName: "E" },
      { cityName: "F" },
      { cityName: "G" },
      { cityName: "H" },
      { cityName: "J" },
      { cityName: "K" },
      { cityName: "L" },
      { cityName: "M" },
      { cityName: "N" },
      { cityName: "P" },
      { cityName: "Q" },
      { cityName: "R" },
      { cityName: "S" },
      { cityName: "T" },
      { cityName: "W" },
      { cityName: "X" },
      { cityName: "Y" },
      { cityName: "Z" },
    ],
    citys: [],
  },
});
