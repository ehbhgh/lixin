//请求封装
const {
  baseurl
} = require("./server.js")

let version =2023
//获取token
function requestHttp(url, method, data) {
  //请求头设置
  var header = {
    'Content-Type': 'application/json',
    "version":version
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseurl + url,
      data: data,
      header: header,
      method: method,
      success: (res => {
        if (res.data.code === 200) {
          resolve(res.data)
        } else {
          wx.showToast({
            title: '微信登录失败，请重试',
            icon: 'none'
          });
        }
      }),
      fail: (res => {
        wx.showToast({
          title: '网络异常',
          icon: 'info',
          duration: 1500 //持续的时间  
        })
      })
    })
  })
}

function formHttp(url, method, data) {
  var header = {
    'Content-Type': 'application/json',
    "wx_token": wx.getStorageSync("wx_token"),
    "version":version
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseurl + url,
      data: data,
      header: header,
      method: method,
      success: (res => {
       
          resolve(res.data)
        
      }),
      fail: (res => {
        wx.showToast({
          title: '网络异常',
          icon: 'info',
          duration: 1500 //持续的时间  
        })
      })
    })
  })
}
//get请求不携带参数
function getHttp(url, method,data={}) {
  var header = {
    'Content-Type': 'application/json',
    "wx_token": wx.getStorageSync("wx_token"),
    "version":version
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseurl + url,
      header: header,
      data: data,
      method: method,
      success: (res => {
          resolve(res.data)
         
      }),
      fail: (res => {
        wx.showToast({
          title: '网络异常',
          icon: 'info',
          duration: 1500 //持续的时间  
        })
      })
    })
  })
}

//更换请求头
function formHttpChangeheader(url, method, data) {
  var header = {
    'Content-Type': 'application/x-www-form-urlencoded',
    "wx_token": wx.getStorageSync("wx_token"),
    "version":version
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseurl + url,
      data: data,
      header: header,
      method: method,
      success: (res => {
          resolve(res.data)
      }),
      fail: (res => {
        wx.showToast({
          title: '网络异常',
          icon: 'info',
          duration: 1500 //持续的时间  
        })
      })
    })
  })
}
module.exports = {
  requestHttp,
  formHttp,
  getHttp,
  formHttpChangeheader
}
