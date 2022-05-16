// pages/content_upload/index.js
const {
  getHttp,
  formHttp
} = require("../../utils/config.js");
const app = getApp();
import Dialog from '../../plugin_vant/dialog/dialog';
// import log from '../../utils/log';
var COS = require('../../lib/cos-wx-sdk-v5.js')
const {
  baseurl
} = require("../../utils/server.js")

let tmplId = "HiyadcYYvnA7zFipmOfTOmAmaCdOtrpI6RMZWdTlVl8"
var upFiles = require('../../utils/upFiles.js')
var cos = new COS({
  // ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
  getAuthorization: function (options, callback) {
    // 异步获取临时密钥
    return new Promise(() => {
      wx.request({
        url: baseurl + '/api/v1.0/secret_infos',
        header: {
          "Content-Type": "multipart/form-data",
          "wx_token": wx.getStorageSync("login_token")
        },
        method: "GET",
        data: {
          bucket: options.Bucket,
          region: options.Region,
        },
        dataType: 'json',
        success: function (res) {
         
          let data = res.data.result;
          var credentials = data && data.credentials;
          if (!data || !credentials) return console.error('credentials invalid');
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            XCosSecurityToken: credentials.sessionToken,
            // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000900
          });
        }
      });
    })
  }
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //初始数据
    initList: {},
    //定义上传图片内容
    fileList: [],
    //定义上传视频内容
    videofileList: [],
    //图片序号
    imgIndex: 0,
    //视频序号
    videoIndex: 0,

    // 话题
    topic: "",
    //标题
    title: "",
    //内容文字
    words: "",

    // 添加数据
    picArr: [],
    vedioArr: [],
    vedioSuccess: false,
    upImgArr: [],
    upFilesBtn: true,
    upFilesProgress: false,
    maxUploadLen: 100,
    imgList: [],
    uploadData: false,
    upVideoArr: [],
    imgFlag: false,
    vedioFlag: false,
    hidden: false,
    noScroll: false,
    //禁用文本框
    isDisable: false,
    overlayShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync("login_token")
    if (token) {
      this.initHttp(options.id)
    } else {
      wx.redirectTo({
        url: '/pages/login/index'
      });
    }


  },
  //发送请求拿到初始数据
  async initHttp(id) {
    let res = await getHttp("/api/v1.0/pre_fill/content/" + id)
    if (res.code === 200) {
      if (res.result.data == -1) {
        wx.redirectTo({
          url: "/pages/login/index"
        })
      } else if (res.result.data == -2) {
        Dialog.alert({
          title: '提示',
          message: res.msg,
          theme: 'round-button',
          confirmButtonText: "去完善"
        }).then(() => {
          wx.redirectTo({
            url: "/pages/noorder_received/index"
          })
        })
      } else if (res.result.data == -3) {
        this.dialog(res.msg)
      } else if (res.result.data == -4) {
        this.dialog(res.msg)
      } else if (res.result.data == -5) {
        this.dialog(res.msg)
      } else if (res.result.data == -6) {
        this.dialog(res.msg)
      } else if (res.result.data == -7) {
        this.dialog(res.msg)
      } else if (res.result.data == -8) {
        wx.redirectTo({
          url: "/pages/abnormal/index"
        })
      } else {
        let initData = wx.getStorageSync("initData")
        if (initData && res.result.contract_id == initData.contract_id) {
          this.setData({
            topic: initData.topic,
            title: initData.title,
            words: initData.words,
            upImgArr: initData.upImgArr,
            upVideoArr: initData.upVideoArr
          })
        }

        this.setData({
          initList: res.result
        })


      }
    } else {
      wx.redirectTo({
        url: "/pages/abnormal/index"
      })
    }
  },


  //标题
  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  //话题
  topicInput(e) {
    this.setData({
      topic: e.detail.value
    })
  },
  //文字
  wordsInput(e) {
    this.setData({
      words: e.detail.value
    })
  },

  //提示框
  pointOut(icon, title) {
    wx.showToast({
      icon: icon,
      title: title,
      duration: 1500
    })
  },
  //调起dilogo
  dialog(msg) {
    Dialog.alert({
      title: '提示',
      message: msg,
      theme: 'round-button'
    })
  },

  //点击上传
  uploadPlayer() {
    this.upoadertencent()
    // 话题和标题不为空
    if (this.data.initList.video_num && this.data.initList.video_num === 1) {
      if (this.data.title !== "" && this.data.topic !== "") {
        //判断视频状态
        if (this.data.upVideoArr) {
          //判断图片状态
          if (this.data.upImgArr && this.data.upImgArr.length >= this.data.initList.picture_num && this.data.upImgArr.length <= 20) {
            //判断文字状态
            if (this.data.words && this.data.words.length >= this.data.initList.content_requirement_num && this.data.words.length <= 3000) {
              wx.showLoading({
                title: '上传中...',
              })
              this.setData({
                noScroll: true,
                isDisable: true,
                overlayShow: true
              })
              //调用腾讯云上传
          
            } else {
              this.pointOut('none', "字数不符合要求，请重新上传！")
            }
          } else {
            wx.showToast({
              icon: 'none',
              title: "图片不符合要求，请重新上传！",
              duration: 1500
            })
          }
        }
      } else {
        wx.showToast({
          title: '话题/标题不能为空！', // 标题
          icon: 'none', // 图标类型，默认success
          duration: 1500 // 提示窗停留时间，默认1500ms
        })
      }
    } else {
      if (this.data.title !== "" && this.data.topic !== "") {
        if (this.data.upImgArr && this.data.upImgArr.length >= this.data.initList.picture_num && this.data.upImgArr.length <= 20) {
          //判断文字状态
          if (this.data.words && this.data.words.length >= this.data.initList.content_requirement_num && this.data.words.length <= 3000) {
            wx.showLoading({
              title: '上传中...',
            })
            this.setData({
              noScroll: true,
              isDisable: true,
              overlayShow: true
            })
            //调用腾讯云上传
            this.upoadertencent()
          } else {
            this.pointOut('none', "字数不符合要求，请重新上传！")
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: "图片不符合要求，请重新上传！",
            duration: 1500
          })
        }
      } else {
        wx.showToast({
          title: '话题/标题不能为空！', // 标题
          icon: 'none', // 图标类型，默认success
          duration: 1500 // 提示窗停留时间，默认1500ms
        })
      }
    }
  },

  //上传到腾讯云
  upoadertencent() {
    if (this.data.initList.video_num && this.data.initList.video_num === 1) {
      let promisedArr = [];
      let picArr = [];
      let vedioArr = [];
      if (this.data.upImgArr && this.data.upImgArr instanceof Array) {
        this.data.upImgArr.forEach((item, index) => {
          let p = new Promise((resolve, reject) => {
            cos.postObject({
                Bucket: 'wxmcnbucket-1259537042',
                Region: 'ap-shanghai',
                Key: `mcn/image_${this.data.initList.contract_id}_${index}.png`,
                FilePath: item.path, // wx.chooseImage 选择文件得到的 tmpFilePath
                onProgress: (info) => {
                  resolve(info)
                }
              },
              (err, data) => {
                reject(data)
              })
          })
          promisedArr.push(p);
          picArr.push(`mcn/image_${this.data.initList.contract_id}_${index}.png`)
        })
      }
      if (this.data.upVideoArr && this.data.upVideoArr instanceof Array) {
        if (this.data.upVideoArr.length == 0) {
          this.setData({
            vedioArr: []
          })
        } else {
          let vedioPromise = new Promise((resolve, reject) => {
            cos.postObject({
                Bucket: 'wxmcnbucket-1259537042',
                Region: 'ap-shanghai',
                Key: `mcn/vedio_${this.data.initList.contract_id}_0.mp4`,
                FilePath: this.data.upVideoArr[0].tempFilePath, // wx.chooseImage 选择文件得到的 tmpFilePath
                onProgress: (info) => {
                  resolve(info)
                }
              },
              (err, data) => {
                reject(data)
              })
          })
          promisedArr.push(vedioPromise)
          vedioArr.push(`mcn/vedio_${this.data.initList.contract_id}_0.mp4`)
        }
      } else {
        wx.showToast({
          title: '请上传视频',
          icon: 'info',
          duration: 1500 //持续的时间  
        })
      }


      Promise.all(promisedArr).then(data => {
        //这里的data数组，存放着之前两个异步回调传的数据
        console.log(data,'ffff');
        let flag = data.every(item => {
          return item.hasOwnProperty("loaded") && item.hasOwnProperty("speed") && item.hasOwnProperty("total") && item.total != undefined
        })
        if (flag == true) {
          this.uploadData()
        } else {
          this.setData({
            picArr: [],
            vedioArr: [],
            upImgArr: [],
            upVideoArr: [],
            noScroll: false,
            isDisable: false,
            overlayShow: false
          })
          wx.showToast({
            title: '上传云端失败',
            icon: 'info',
            duration: 1500 //持续的时间  
          })
        }
      }).catch(data => {
        this.setData({
          picArr: [],
          vedioArr: [],
          upImgArr: [],
          upVideoArr: [],
          noScroll: false,
          isDisable: false,
          overlayShow: false
        })
        wx.showToast({
          title: '上传云端失败',
          icon: 'info',
          duration: 1500 //持续的时间  
        })
      })
      this.setData({
        vedioArr: vedioArr,
        picArr: picArr
      })
    } else {
      let promisedArr = [];
      let picArr = [];
      if (this.data.upImgArr && this.data.upImgArr instanceof Array) {
        this.data.upImgArr.forEach((item, index) => {
          let p = new Promise((resolve, reject) => {
            cos.postObject({
                Bucket: 'wxmcnbucket-1259537042',
                Region: 'ap-shanghai',
                Key: `mcn/image_${this.data.initList.contract_id}_${index}.png`,
                FilePath: item.path, // wx.chooseImage 选择文件得到的 tmpFilePath
                onProgress: (info) => {
                  resolve(info)
                }
              },
              (err, data) => {
                reject(data)
              })
          })
          promisedArr.push(p);
          picArr.push(`mcn/image_${this.data.initList.contract_id}_${index}.png`)
        })
      }
      console.log(picArr);
      Promise.all(promisedArr).then(data => {
        //这里的data数组，存放着之前两个异步回调传的数据
        console.log(data,'ffff');
        let flag = data.every(item => {
          return item.hasOwnProperty("loaded") && item.hasOwnProperty("speed") && item.hasOwnProperty("total") && item.total != undefined
        })
        if (flag == true) {
          this.uploadData()
        } else {
          this.setData({
            picArr: [],
            upImgArr: [],
            noScroll: false,
            isDisable: false,
            overlayShow: false
          })
          wx.showToast({
            title: '上传云端失败',
            image: '../../images/icon/fail.jpg',
            icon: 'info',
            duration: 1500 //持续的时间  
          })
        }
      }).catch(data => {
        this.setData({
          picArr: [],
          upImgArr: [],
          noScroll: false,
          isDisable: false,
          overlayShow: false
        })
        wx.showToast({
          title: '上传云端失败',
          image: '../../images/icon/fail.png',
          icon: 'info',
          duration: 1500 //持续的时间  
        })
      })
      this.setData({
        picArr: picArr
      })
    }
  },


  //推送
  submit() {
    wx.hideLoading()
    this.setData({
      overlayShow: false
    })
    wx.showModal({
      title: "上传成功",
      content: "请您选择是否进行订阅操作",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
            tmplIds: [tmplId],
            success: res => {
              // 申请订阅成功
              if (res[tmplId] == 'accept') { //某条订阅信息 接收或者拒绝
                wx.showToast({
                  title: '订阅成功！', // 标题
                  icon: 'success', // 图标类型，默认success
                  duration: 1500 // 提示窗停留时间，默认1500ms
                })
              } else if (res[tmplId] == 'reject') { // 用户拒绝授权
                wx.showModal({
                  title: '温馨提示',
                  content: "您已关闭消息推送，如需要消息推送服务，请点击确定跳转设置页面打开授权后再次尝试。",
                  success: function (modal) {
                    if (modal.confirm) { // 点击确定
                      wx.openSetting({
                        withSubscriptions: true
                      })
                    }
                  }
                })
              }
            },
            fail: err => {
              if (err.errCode == '20004') {
                wx.showModal({
                  title: '温馨提示',
                  content: "您的消息订阅主开关已关闭，如需要消息推送服务，请点击确定跳转设置页面打开授权后再次尝试。",
                  success: function (modal) {
                    if (modal.confirm) { // 点击确定
                      wx.openSetting({
                        withSubscriptions: true
                      })
                    }
                  }
                })
              }
            }
          });
          wx.setStorageSync("num", 1)
          wx.redirectTo({
            url: '/pages/participant_list/index'
          })
        } else {
          wx.setStorageSync("num", 1)
          wx.redirectTo({
            url: '/pages/participant_list/index'
          })
        }
      }
    })
    // 调用微信 API 申请发送订阅消息

  },


  // 解析表情
  analysisEmoji(str) {
    let keyStr = str.replace(/%/g, "%25")
    let regex = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
    let nickWords = keyStr.replace(regex, function (res) {
      return encodeURIComponent(res)
    })
    return nickWords
  },

  //上传到后端
 async uploadData() {
   console.log('gg');
  //  this.upoadertencent()
    let params = {
      contract_id: parseInt(this.data.initList.contract_id),
      works: this.analysisEmoji(this.data.words),
      title: this.analysisEmoji(this.data.title),
      topic: this.analysisEmoji(this.data.topic),
      picture_urls: this.data.picArr,
      video_urls: this.data.vedioArr
    }

    let res = await formHttp("/api/v1.0/upload_content", "POST", params)
    if (res.code === 200) {
      if (res.result.data === -1) {
        wx.hideLoading()
        wx.redirectTo({
          url: "/pages/login/index"
        })
      } else if (res.result.data === -2) {
        wx.hideLoading()
        Dialog.alert({
          title: '提示',
          message: res.msg,
          theme: 'round-button',
          confirmButtonText: "去完善"
        }).then(() => {
          wx.redirectTo({
            url: "/pages/noorder_received/index"
          })
        })
      } else if (res.result.data === -3) {
        wx.hideLoading()
        this.dialog(res.msg)
      } else if (res.result.data === -4) {
        wx.hideLoading()
        this.dialog(res.msg)
      } else if (res.result.data === -5) {
        wx.hideLoading()
        this.dialog(res.msg)
      } else if (res.result.data === -6) {
        wx.hideLoading()
        this.dialog(res.msg)
      } else if (res.result.data === -7) {
        wx.hideLoading()
        this.redirectTo({
          url: '/pages/abnormal/index'
        })
      } else if (res.result.data === -8) {
        wx.hideLoading()
        this.dialog(res.msg)
      } else {
        // this.submit()
        this.upoadertencent()

      }
    } else {
      wx.hideLoading()
      this.redirectTo({
        url: '/pages/abnormal/index'
      })
    }

  },

  // 预览图片
  previewImg: function (e) {
    let imgsrc = e.currentTarget.dataset.presrc;
    let _this = this;
    let arr = _this.data.upImgArr;
    let preArr = [];
    arr.map(function (v, i) {
      preArr.push(v.path)
    })
    //   console.log(preArr)
    wx.previewImage({
      current: imgsrc,
      urls: preArr
    })
  },
  // 删除上传图片 或者视频
  delFile: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '您确认删除嘛？',
      success(res) {
        if (res.confirm) {
          let delNum = e.currentTarget.dataset.index;
          let delType = e.currentTarget.dataset.type;
          let upImgArr = _this.data.upImgArr;
          let upVideoArr = _this.data.upVideoArr;
          if (delType == 'image') {
            upImgArr.splice(delNum, 1)
            // _this.data.picArr.splice(delNum, 1)
            _this.setData({
              upImgArr: upImgArr
            })
            wx.setStorageSync("upImgArr", _this.data.upImgArr)
          } else if (delType == 'video') {
            upVideoArr.splice(delNum, 1)
            // _this.data.vedioArr.splice(delNum, 1)
            _this.setData({
              upVideoArr: upVideoArr
            })
          }
          let upFilesArr = upFiles.getPathArr(_this);
          if (upFilesArr.length < _this.data.maxUploadLen) {
            _this.setData({
              upFilesBtn: true,
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 选择图片
  uploadFiles: function (e) {
    var _this = this;
    wx.showActionSheet({
      itemList: ['选择图片'],
      success: function (res) {
        let xindex = res.tapIndex;
        if (xindex == 0) {
          upFiles.chooseImage(_this, _this.data.maxUploadLen)
        }
      },

    })
  },


  // 选择视频
  uploadVedioFiles: function (e) {
    var _this = this;
    wx.showActionSheet({
      itemList: ['选择视频'],
      success: function (res) {
        let xindex = res.tapIndex;
        if (xindex == 0) {
          upFiles.chooseVideo(_this, _this.data.maxUploadLen)
        }

      },

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //每次切换页面确保对屏幕。文本框没有影响
    this.setData({
      noScroll: false,
      isDisable: false,
      overlayShow: false
    })

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
    if (this.data.topic != "" || this.data.title != "" || this.data.words != "" || this.data.upImgArr.length != 0 || this.data.upVideoArr != 0) {
      wx.setStorageSync("initData", {
        contract_id: this.data.initList.contract_id,
        topic: this.data.topic,
        title: this.data.title,
        words: this.data.words,
        upImgArr: this.data.upImgArr,
        upVideoArr: this.data.upVideoArr
      })
    }


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