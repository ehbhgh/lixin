const app = getApp();
var chooseImage = (t, count) =>{
    wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            // var imgArr=wx.getStorageSync("upImgArr")
            // if(upImgArr.length!=0){
            //     upImgArr:upImgArr
            // }
            var imgArr = t.data.upImgArr ;
            let arr = res.tempFiles;
            console.log(arr,"xxxxxxxx")
            // console.log(res)
            arr.map(function(v,i){
                v['progress'] = 0;
                imgArr.push(v)
            })
            console.log(imgArr)
            t.setData({
                upImgArr: imgArr
            })
            wx.setStorageSync("upImgArr",imgArr)
            app.globalData.imgArr = imgArr
            let upFilesArr = getPathArr(t);
            if (upFilesArr.length > count-1) {
                let imgArr = t.data.upImgArr;
                let newimgArr = imgArr.slice(0, count)
                t.setData({
                    upFilesBtn: false,
                    upImgArr: newimgArr
                })
                app.globalData.imgArr = newimgArr
               
            }
        },
    });
}
var chooseVideo = (t,count) => {
    wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        compressed:true,
        camera: 'back',
        success: function (res) {
         console.log(res)
            let videoArr = t.data.upVideoArr || [];
            let videoInfo = {};
            videoInfo['tempFilePath'] = res.tempFilePath;
            videoInfo['size'] = res.size;
            videoInfo['height'] = res.height;
            videoInfo['width'] = res.width;
            videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
            videoInfo['progress'] = 0;
            videoArr.push(videoInfo)
            t.setData({
                upVideoArr: videoArr
            })
            let upFilesArr = getPathArr(t);
            if (upFilesArr.length > count - 1) {
                t.setData({
                    upFilesBtn: false,
                })
            }
            console.log(res)
        }
    })
}

// ?????? ???????????? ??? ???????????? ??????????????????
var getPathArr = t => {
    let imgarr = t.data.upImgArr || [];
    let upVideoArr = t.data.upVideoArr || [];
    let imgPathArr = [];
    let videoPathArr = [];
    imgarr.map(function (v, i) {
        imgPathArr.push(v.path)
    })
    upVideoArr.map(function (v, i) {
        videoPathArr.push(v.tempFilePath)
    })
    let filesPathsArr = imgPathArr.concat(videoPathArr);
    return filesPathsArr;
}

/**
 * upFilesFun(this,object)
 * object:{
 *    url     ************   ???????????? (??????)
 *    filesPathsArr  ******  ??????????????????
 *    name           ******  wx.uploadFile name
 *    formData     ******    ?????????????????????
 *    startIndex     ******  ?????????????????? 0
 *    successNumber  ******     ????????????
 *    failNumber     ******     ????????????
 *    completeNumber  ******    ????????????
 * }
 * progress:????????????
 * success?????????????????????
 */

// var upFilesFun = (t, data, progress, success) =>{
//     let _this = t;
//     let url = data.url;
//     let filesPath = data.filesPathsArr ? data.filesPathsArr : getPathArr(t);
//     let name = data.name || 'file';
//     let formData = data.formData || {};
//     let startIndex = data.startIndex ? data.startIndex : 0;
//     let successNumber = data.successNumber ? data.successNumber : 0;
//     let failNumber = data.failNumber ? data.failNumber : 0;
//     if (filesPath.length == 0) {
//       success([]);
//       return;
//     }
//     const uploadTask = wx.uploadFile({
//         url: url,
//         filePath: filesPath[startIndex],
//         name: name,
//         formData: formData,
//         success: function (res) {
//             var data = res.data
//             successNumber++;
//             // console.log('success', successNumber)
//             // console.log('success',res)
//             // ????????????????????????????????????????????????
//             let uploaded = t.data.uploadedPathArr || [];
//             var da = JSON.parse(res.data);
//             // console.log(da)
//             if (da.code == 1001) {
//                 // ### ???????????????????????? ?????????????????????
//                 uploaded.push(da.data)

//                 t.setData({
//                     uploadedPathArr: uploaded
//                 })
//             }
//         },
//         fail: function(res){
//             failNumber++;
//             // console.log('fail', filesPath[startIndex])
//             // console.log('failstartIndex',startIndex)
//             // console.log('fail', failNumber)
//             // console.log('fail', res)
//         },
//         complete: function(res){

//             if (startIndex == filesPath.length - 1 ){
//                 // console.log('completeNumber', startIndex)
//                 // console.log('over',res)
//                 let sucPathArr = t.data.uploadedPathArr;
//                 success(sucPathArr);
//                 t.setData({
//                     uploadedPathArr: []
//                 })
//                 console.log('?????????' + successNumber + " ?????????" + failNumber)
//             }else{
//                 startIndex++;
//                 // console.log(startIndex)
//                 data.startIndex = startIndex;
//                 data.successNumber = successNumber;
//                 data.failNumber = failNumber;
//                 upFilesFun(t, data, progress, success);
//             }
//         }
//     })

//     uploadTask.onProgressUpdate((res) => {
//         res['index'] = startIndex;
//         // console.log(typeof (progress));
//         if (typeof (progress) == 'function') {
//             progress(res);
//         }
//         // console.log('????????????', res.progress)
//         // console.log('???????????????????????????', res.totalBytesSent)
//         // console.log('????????????????????????????????????', res.totalBytesExpectedToSend)
//     })

// }
module.exports = { chooseImage, chooseVideo, getPathArr}