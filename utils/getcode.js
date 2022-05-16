const { requestHttp } = require("./config.js");
var log = require("./log.js");
function getCode(self, aId) {
  wx.login({
    success: async (res) => {
      //         //用户按了允许授权按钮
      let code = {
        code: res.code,
      };
      let data = await requestHttp("/api/v1.0/checkLogin", "POST", code);
      if (data.code == 200) {
        let res = data.result;
        log.info(res);
        if (res.status == 0) {
          wx.navigateTo({
            url: "/pages/phoneLogin/index",
          });
        }
        if (res.status == 1) {
          wx.setStorageSync("wx_token", res.userInfo.wxToken);
          let personData = {
            avatar: res.userInfo.avatar,
            nickname: res.userInfo.nickname,
          };
          aId &&
            self.setData({
              aId: aId,
            });
          wx.setStorageSync("personMessage", personData)
          self.onShow();
        }
      }
    },
  });
}
module.exports = {
  getCode,
};
