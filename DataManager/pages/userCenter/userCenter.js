// pages/userCenter/userCenter.js
const appid = "wx8f6943cca62a3788";
const appsecret = "f0bc55941de2a2f8e51c46cc0e5d7745";
var openid;
var session_key;

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    routers: [
    {
      name: '历史',
      url: '/pages/history/history',
      icon: '/images/history_1.png',
    },
    {
      name: '帮助',
      url: '/pages/userCenter/help/help',
      icon: '/images/help.png',
    },
    {
      name: '关于',
      url: '/pages/userCenter/company/company',
      icon: '/images/aboutus.png',
    },
    ]
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
  getUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    app.globalData.isLogin = true;
    app.globalData.userInfo = e.detail.userInfo;
    wx.showToast({
      title: '登录成功',
      icon: "success",
      duration: 800
    })
    this.getOpenIdTap()
  },

  getOpenIdTap: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: appid,
            secret: appsecret,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            openid = res.data.openid; //获取到的openid
            session_key = res.data.session_key; //获取到session_key
            app.globalData.openId = openid;
            console.log("openid", app.globalData.openId)
            that.getIndicators()
          }
        })
      }
    })
  },
  /**
   * 1.已注册过，直接获取其指标信息
   * 2.未注册，先注册，再获取
   */
  getIndicators:function(){
    wx.request({
      url: 'http://127.0.0.1:5000/isFirstLogin',
      method:'POST',
      data:{
        openId: app.globalData.openId
      },success(res){
        console.log(res)
        //注册
        if(res.data=="not signed"){
          wx.request({
            url: 'http://127.0.0.1:5000/register',
            method:'POST',
            data:{
              openId: app.globalData.openId
            },
            success(res){
              console.log("reg res",res)
            },
          })
        }
       
      }
    })
    //获取指标内容
    wx.request({
      url: 'http://127.0.0.1:5000/getIndicators',
      method: 'POST',
      data: {
        openId: app.globalData.openId
      },
      success(res) {
        console.log("reg res", res.data)
        app.globalData.indicators=res.data
      },
    })
  }


})