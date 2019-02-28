//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        this.globalData.screenW = res.windowWidth;
        this.globalData.screenH = res.windowHeight;
      }
    });
    //获取指标信息
  },
  globalData: {
    screenW:null,
    screenH:null,
    userInfo: null,
    indicators:null,
    isLogin:null,
    isNoticed:null,
    cn2en:{
      "口气":"mouth","体型":"body","视力":"eye","皮肤":"skin"
    },
    openId:null,
    serverIP:"http://127.0.0.1:5000/"
  }
})