var app=getApp()
//用于比较是否发生改动
var mainKey_copy
var subKey_copy=[]
var chosedKey
var subItems=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainKey:null,
    subKey:null,
    width:app.globalData.screenW,
    index:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    subKey_copy=[]
    subItems=[]
    chosedKey = options.mainKey
    mainKey_copy = options.mainKey
    if (app.globalData.indicators.hasOwnProperty(chosedKey)){
      subItems = app.globalData.indicators[chosedKey]
      subKey_copy = app.globalData.indicators[chosedKey]
    }
    
    let that=this
    that.setData({
      mainKey:chosedKey,
      subKey:subItems
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
  //删除一项
  deleteItem:function(e){
    let that=this
    let index = e.currentTarget.dataset.index
    console.log(index)
    let tmpArr=[]
    console.log(subKey_copy)
    for (var i = 0; i < subKey_copy.length;++i){
      if(index!=i)
        tmpArr.push(subKey_copy[i])
    }
    subKey_copy = tmpArr.slice();
    that.setData({
      subKey: subKey_copy
    })

  },

  changeValue:function(e){
    let id = e.currentTarget["id"];
    //修改主指标
    if(id=="main"){
      mainKey_copy = e.detail["value"]
    }else{
      let index=parseInt(id);
      subKey_copy[index] = e.detail["value"]
    }
  },
  addItem:function(){
    let that=this
    console.log("click")
    subKey_copy.push("")
    console.log(subKey_copy)
    that.setData({
      subKey: subKey_copy
    })
  },
  //向服务器提交
  confirmChange:function(){
    console.log("confirm")
    //删除之前的项目
    delete app.globalData.indicators[chosedKey]
    //获取输入框中的内容，写如
    app.globalData.indicators[mainKey_copy]=subKey_copy
    console.log(app.globalData.indicators)
    //发送至服务器
    wx.request({
      url: 'http://127.0.0.1:5000/editIndicator',
      method:'POST',
      data:{
        openId:app.globalData.openId,
        indicators:app.globalData.indicators
      },success(res){
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }

})