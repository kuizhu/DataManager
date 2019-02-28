var app=getApp()
var flag=1
var isFirst=true
var keys=[]
var flag=true
var hideDict={}
var chosedItem=[]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicators:null,
    latestData:null,
    mainKeys:null,
    visible:null,
    imgUrl:null,
    hide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("state",app.globalData.indicators)
    this.setData({
      indicators:app.globalData.indicators,
      hide:true
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
    let that=this
    if (!app.globalData.isLogin){
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

    //已经登录，并且第一次动态加载
    if(app.globalData.isLogin&&isFirst){
      isFirst=false
      this.loadData()
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
    console.log("pull")
    let that=this
    if(app.globalData.isLogin){
      that.loadData()
    }
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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

  loadData:function(){
    let that=this
    wx.request({
      url: "http://127.0.0.1:5000/getLatestData",
      method: "POST",
      data:{
        openId:app.globalData.openId
      },
      success(res){
        console.log(res.data)
        //获取所有key值，并删除数据为空的项目
        let tmpkeys=Object.keys(res.data)
        keys = []
        let keySet = new Set()
        for (var key in app.globalData.cn2en) {
          keySet.add(key)
        }
        let imgUrls=[]
        for(var item in tmpkeys){
          let tmpMainKey = tmpkeys[item]
          if (Object.keys(res.data[tmpMainKey]).length>0){
            keys.push(tmpMainKey)
            hideDict[tmpMainKey]=false
            if (keySet.has(tmpMainKey))
              imgUrls.push("/images/" + app.globalData.cn2en[tmpMainKey] + ".png")
            else
              imgUrls.push("/images/self.png")
          }
        }
        that.setData({
          mainKeys:keys,
          latestData:res.data,
          imgUrl:imgUrls,
          visible:hideDict
        })
      }

    })
  },

  showSelectArea:function(){
    let that=this
    flag=!flag
    that.setData({
      hide:flag
    })
  },
  checkboxChange:function(e){
    chosedItem=e.detail["value"]
    console.log(chosedItem)
  },
  //执行筛选
  doSelection:function(e){
    let that=this
    for(var index=0;index<keys.length;index++){
      if(chosedItem.indexOf(keys[index])>-1)
        hideDict[keys[index]]=false
      else
        hideDict[keys[index]]=true
    }
    console.log(hideDict)
    that.setData({
      visible:hideDict
    })
  }
})