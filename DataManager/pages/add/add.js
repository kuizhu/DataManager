// pages/add/add.js
var app=getApp()
var mainKey = []
var imgUrls = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keys:null,
    imgs:null,
    str1:"自定义",
    index:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if(app.globalData.isLogin){
      //获取所有key值
      mainKey = []
      imgUrls = []
      let keySet = new Set()
      let that = this
      for (var key in app.globalData.cn2en) {
        keySet.add(key)
      }
      for (var key in app.globalData.indicators) {
        mainKey.push(key)
        if (keySet.has(key))
          imgUrls.push("/images/" + app.globalData.cn2en[key] + ".png")
        else
          imgUrls.push("/images/self.png")
      }
      that.setData({
        keys: mainKey,
        imgs: imgUrls
      })
    }else{
      wx.showModal({
        title: '使用提示',
        content: '现在登录，即刻体验',
        cancelText: '稍后',
        confirmText: '去登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/userCenter/userCenter',
            })
          }
        }
      })
    }
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

  },
  //跳转至指标添加页
  editIndicator:function(){
    wx.navigateTo({
      url: '/pages/editIndicator/editIndicator',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //跳转至输入页面
  toInput:function(e){
    let index = e.currentTarget.dataset.index;
    console.log(mainKey[index])
    wx.navigateTo({
      url: '/pages/inputRecords/inputRecords?mainKey='+mainKey[index],
    })
  }

})