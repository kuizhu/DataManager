var app=getApp()
var keys = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainKey:null,
    index:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMainKey()
    console.log(app.globalData.indicators)
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
    this.getMainKey()
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

  getMainKey:function(){
    keys=[]
    let that=this
    for (var key in app.globalData.indicators) {
      keys.push(key)
    }
    console.log("keys",keys)
    that.setData({
      mainKey:keys
    })
  },
  //长按删除
  longPress:function(e){
    let that=this
    let index=e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '删除此健康指标,不可恢复,是否继续删除？',
      success:function(res){
        if(res.confirm){
          console.log("点击了确认")
          console.log("index",index)
          //删除指定位置的健康指标
          delete app.globalData.indicators[keys[index]]
          //重新设置keys
          that.getMainKey()
          //发送改动至服务器
          wx.request({
            url: 'http://127.0.0.1:5000/updateFullItem',
            method:'POST',
            data:{
              openId:app.globalData.openId,
              indicators:app.globalData.indicators
            },
            success(res){
              console.log(res)
            }
          })
        }else if(res.cancel){
          console.log("点击了取消")
        }
      }
    })
  },
  //点击,进入编辑页面
  editContent:function(e){
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/editIndicator/edit/edit?mainKey='+keys[index],
    })
  },

  //添加新指标
  addIndicator:function(){
    wx.navigateTo({
      url: '/pages/editIndicator/edit/edit?mainKey=新建指标'
    })
  }
})