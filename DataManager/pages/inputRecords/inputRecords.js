var app=getApp()
var chosedKey
var subItems=[]
var inputRecord={}
var latest
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainKey:null,
    subKey:null,
    latestRecord:null,
    index:null,
    width:app.globalData.screenW
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    chosedKey=""
    subItems=[]
    chosedKey=options.mainKey
    subItems = app.globalData.indicators[chosedKey]
    this.setData({
      mainKey:chosedKey,
      subKey:subItems
    })
    this.getRecordUseMainKey()

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

  //输入数据
  inputValue:function(e){
    let key = subItems[parseInt(e.currentTarget["id"])]
    if(e.detail["value"]!="")
      inputRecord[key]=parseFloat(e.detail["value"])
  },
  send2server:function(){
    let that=this
    if (Object.keys(inputRecord).length>0){
      inputRecord["openId"] = app.globalData.openId
      wx.request({
        url: 'http://127.0.0.1:5000/addRecord',
        method:'POST',
        data:{
          mainKey:chosedKey,
          record:inputRecord
        },success(res){
          that.getRecordUseMainKey()
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    }
  },
  getRecordUseMainKey:function(){
    let that=this
    wx.request({
      url: 'http://127.0.0.1:5000/getRecordUseMainKey',
      method:"POST",
      data:{
        openId:app.globalData.openId,
        mainKey: chosedKey
      },success(res){
        latest=res.data
        that.setData({
          latestRecord:latest
        })
      }
    })
  },
  //删除表中一项，并更新数据库
  deleteData:function(e){
    let that = this
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '删除此项，不可恢复，是否继续？',
      success: function (res) {
        if (res.confirm) {
          console.log("点击了确认")
          let tmp=latest[index]
          latest.splice(index,1)
          console.log(latest)
          that.setData({
            latestRecord: latest
          })
          wx.request({
            url: 'http://127.0.0.1:5000/delteOneRecord',
            method:"POST",
            data:{
              mainKey:chosedKey,
              openId:app.globalData.openId,
              content:tmp
            },success(res){
              console.log(res)
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 800
              })
            }
          })
        }
      }
    })
  }


})