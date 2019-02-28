import * as echarts from '../../ec-canvas/echarts';
var app=getApp()
var records
var mainKeyArr=[]
var imgsArr=[]
var start
var end
var chosedItem=[]

var flag = true


function setOption(chart,y_data){
  //解析 y_data---->series 数组
  let keys = Object.keys(y_data);
  let seriesData = [];
  let item = {
    name: "",
    type: 'line',
    smooth: true,
    data: null
  };
  let minData=[]
  let maxSize=0
  for(let index=0;index<keys.length;index++){
    if(y_data[keys[index]].length>maxSize)
      maxSize=y_data[keys[index]].length
  }
  for (let index = 0; index < keys.length; index++) {
    let tmp = { ...item };
    tmp.name = keys[index];
    tmp.data = y_data[keys[index]];
    minData.push(Math.min(...y_data[keys[index]]))
    seriesData.push(tmp);
  }
  let min = Math.min(...minData).toFixed(2);
  let x_data = []
  for (let index = 0; index < maxSize; index++) {
    x_data.push(index + 1);
  }
  var option = {
    title: {
      left: 'center'
    },
    color: ["#37A2DA", "#808000", "#FFB6C1", "#3CB371", "#0000FF","#FFA500"],
    legend: {
      data: keys,
      top: 20,
      left: 'center',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x_data,
      // show: false
    },
    yAxis: {
      x: 'center',
      min: min,
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },

    series: seriesData,
  }
  console.log(option.legend);
  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:app.globalData.screenW,
    ecValues:null,
    imgUrl:null,
    mainKey:null,
    chosedKey:null,
    startDate:"",
    endDate:"",
    hide:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.requestDataDefault()
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

  requestDataDefault:function(){
    let dataCount=15
    let that=this
    wx.request({
      url: 'http://127.0.0.1:5000/requestDataDefault',
      method:"POST",
      data:{
        count: dataCount,
        openId:app.globalData.openId
      },success(res){
        console.log(res.data)
        records=res.data
        that.dealRecordsAndCharts()
      }
    })
  },
  showChart:function(){
    let that = this
    this.ecComponent = []
    for (var index = 0; index < chosedItem.length; ++index) {
      this.ecComponent.push(this.selectComponent('#chart-' + index))
    }
    console.log("onready", this.ecComponent)
    //加载数据
    for (var index = 0; index < chosedItem.length; ++index) {
      that.loadData(index, records[chosedItem[index]])
    }
  },

  loadData:function(index,y_data){
    this.ecComponent[index].init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, y_data);
      this.chart = chart;
      return chart;
    });
  },

  bindDateChange:function(e){
    let id=e.target["id"]
    let that=this
    if(id=="start"){
      start = e.detail.value
      that.setData({
        startDate: start
      })
    }
    else{
      end = e.detail.value
      that.setData({
        endDate: end
      })
    }
  },

  confirm2update:function(){
    let that=this
    if(start>end){
      wx.showToast({
        title: '错误：开始时间晚于结束时间',
        icon:"none",
        duration:1000
      })
      return
    }
    wx.request({
      url: 'http://127.0.0.1:5000/requestDataByTime',
      method:"POST",
      data:{
        startDate:start,
        endDate:end,
        openId:app.globalData.openId
      },success(res){
        records=res.data
        that.dealRecordsAndCharts()
      },
      
    })
  },
  dealRecordsAndCharts:function(){
    let that=this
    //构建空的chart
    let tmpChart = {
      lazyLoad: true
    }
    
    mainKeyArr = Object.keys(records)
    chosedItem = mainKeyArr
    
    imgsArr = []
    
    let charts = []
    let keySet = new Set()
    for (var key in app.globalData.cn2en) {
      keySet.add(key)
    }
    for (var index = 0; index < chosedItem.length; ++index) {
      charts.push(tmpChart)
      if (keySet.has(chosedItem[index]))
        imgsArr.push("/images/" + app.globalData.cn2en[chosedItem[index]] + ".png")
      else
        imgsArr.push("/images/self.png")
    }
    that.setData({
      ecValues: charts,
      mainKey: mainKeyArr,
      imgUrl: imgsArr,
      chosedKey:chosedItem
    })
    that.showChart()
  },

  checkboxChange: function (e) {
    chosedItem = e.detail["value"]
    console.log(chosedItem)
  },
  //执行筛选
  doSelection: function (e) {
    let tmpChart = {
      lazyLoad: true
    }
    let that = this
    imgsArr = []

    let charts = []
    let keySet = new Set()
    for (var key in app.globalData.cn2en) {
      keySet.add(key)
    }
    console.log(chosedItem)
    for (var index = 0; index < chosedItem.length; ++index) {
      charts.push(tmpChart)
      if (keySet.has(chosedItem[index]))
        imgsArr.push("/images/" + app.globalData.cn2en[chosedItem[index]] + ".png")
      else
        imgsArr.push("/images/self.png")
    }
    
    that.setData({
      ecValues: charts,
      imgUrl: imgsArr,
      chosedKey:chosedItem
    })
    that.showChart()
  },

  showSelectArea: function () {
    let that = this
    flag = !flag
    that.setData({
      hide: flag
    })
  },

  //求交集
  getSamePart:function(arr1,arr2){
    var same=arr1.indexOf(arr2)
    return same
  }


})