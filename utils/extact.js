function extact(inputString) {
  let obj = {}
  var uidMatchResults = inputString.match(/https:\/\/m.dianping.com\/userprofile\/\d+/ig)
if (uidMatchResults != undefined) {
 obj.uid = uidMatchResults[0].split("https://m.dianping.com/userprofile/")[1]  
} else {
  obj.uid = ""
};

var nicknameMatchResults = inputString.match(/【.+正在#大众点评#分享自己的生活】爱生活的人都在这里/ig)
if (nicknameMatchResults != undefined) {
 obj.nickname = nicknameMatchResults[0].replace("【", "").replace(" 正在#大众点评#分享自己的生活】爱生活的人都在这里", "")
} else {
   obj.nickname = ""
}
  return obj
}
module.exports = {
  extact
}
