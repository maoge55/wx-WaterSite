import * as echarts from '../../ec-canvas/echarts.min';
let ly=require('../../utils/lyfw.js').liuyu
let nowd=new Date();
/**
 * 获取近七天的日期
 */
function getDate(){
  let dates = [];
  for (let i = 0; i < 7; i++) {
    let mydate = new Date();
    let date = (mydate.getMonth()+1)+'-'+(mydate.getDate()-6+i);
    dates.push(date)
  }
  return dates
}
let chart
var option = {
  title: {},
  color: ["#37A2DA", "#67E0E3", "#9FE6B8", "#FF8C00", "#FF00FF", "#EEEE00", "#CDB38B"],
  legend: {
    data: ['水温', '水位', 'PH值', '溶解氧', '氨氮', '高锰酸钾', '总有机碳'],
    top: 0,
    padding: [0, 0, 0, 0],
    
    left: 'center',
    backgroundColor: 'white',
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
    data: getDate(),
    // show: false
  },
  yAxis: {
    x: 'center',
    name: '属性值',
    type: 'value',
    min: 0,
    max: 20
    // show: false
  },
  series: [{
    name: '水温',
    type: 'line',
    smooth: true,
    data: [1, 3, 6, 3, 7, 4, 3]
  }, {
    name: '水位',
    type: 'line',
    smooth: true,
    data: [15.66, 5, 5, 3, 0, 3, 2]
  }, {
    name: 'PH值',
    type: 'line',
    smooth: true,
    data: [1, 3, 3, 5, 4, 2, 1]
  }, {
    name: '溶解氧',
    type: 'line',
    smooth: true,
    data: [1, 3, 6, 3, 7, 4, 3]
  }, {
    name: '氨氮',
    type: 'line',
    smooth: true,
    data: [1, 3, 6, 3, 7, 4, 3]
  }, {
    name: '高锰酸钾',
    type: 'line',
    smooth: true,
    data: [1, 3, 6, 3, 7, 4, 3]
  }, {
    name: '总有机碳',
    type: 'line',
    smooth: true,
    data: [1, 3, 6, 3, 7, 4, 3]
  },]
};
function initChart(canvas, width, height) {
    chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    ec: {onInit: initChart},
    watersites: [],
    ly:ly,
    lyIndex:0,
    cursite:'未知',
    wkdata:null,
    startPoint:nowd.getFullYear()+'-'+(getDate())[0],
    endPoint: nowd.getFullYear()+'-'+(nowd.getMonth()+1)+'-'+nowd.getDate(),
    startDate: nowd.getFullYear() + '-' + (getDate())[0],
    endDate: nowd.getFullYear() + '-' +(nowd.getMonth()+1) + '-' + nowd.getDate(),
  },

  onLoad: function(e) {
    console.log(new Date().getMonth())
    let site=false
    if (!!e.sitestr){
      console.log(e.sitestr)
      site = JSON.parse(e.sitestr)
    }
    this.getsites(site)
    //this.getdata(this.data.watersites[0].text)
  },
  onReady:function(){
  },
  test:function(){
  },
  sitechange: function(e) {
    let id = e.detail.id;
    let text = e.detail.text;
    //console.log(id,text);
    this.getdata(text)
  },
  //从数据库获取一周数据
  getdata(text){
    wx.showLoading({
      title: '正在加载',
    })
    console.log(text);
    this.setData({
      cursite:text
    })
    wx.cloud.callFunction({
      name:'getweekdata',
      data:{dname:text}
    }).then(res=>{
      let wkdata=res.result
      console.log(wkdata);
      this.setData({wkdata:wkdata})
      chart.setOption({
        series:[
          { data: wkdata.sw},
          { data: wkdata.swei},
          { data: wkdata.ph},
          { data: wkdata.ox},
          { data: wkdata.nit},
          { data: wkdata.per},
          { data: wkdata.orgs},
        ]
      })
      wx.hideLoading()
    })
  },
  PickerChange:function(e){
    wx.showLoading({
      title: '正在切换流域',
    })
    let value=e.detail.value;
    console.log(value)
    this.setData({
      lyIndex:value
    })
    this.getsites()
  },
  getsites(site){
    let belong = ly[this.data.lyIndex].name
    
    if (site) {
      console.log(222)
      belong=site.belong
      for(let i=0;i<ly.length;i++){
        if(ly[i].name==site.belong){
          this.setData({
            lyIndex:i,
            cursite:site.dname
          })
          break;
        }
      }
    }
    wx.cloud.callFunction({
      name:'getWaterSites',
      data:{belong:belong}
    }).then(res=>{
      //console.log(res.result.data)
      let sites=res.result.data;
      let seitems=[]
      for(let i=0;i<sites.length;i++){
        let item={}
        item.id=i;
        item.text=sites[i].dname;
        seitems.push(item)
      }
      let text0=seitems[0].text;
      if (site) {
        text0 = site.dname
      }
      this.getdata(text0)
      this.setData({
        watersites:seitems
      })
    })
  },
  bindStartDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  onShareAppMessage: function(res) {
    return {
      path: '/pages/weekly/weekly',
      success: function() {},
      fail: function() {}
    }
  },

  getDataByDate:function(e){
    let range=this.createXdata()
    //console.log(range)
    let xdata = range.xdata//获取x轴数据
    console.log(xdata)
    let ydata=this.createYdata(range.j,range.k+1)//获取y抽数据
    console.log(ydata)
    //更新表格
    chart.setOption({
      xAxis: {
        data: xdata,
        // show: false
      },
      series: [
        { data: ydata.sw },
        { data: ydata.swei },
        { data: ydata.ph },
        { data: ydata.ox },
        { data: ydata.nit },
        { data: ydata.per },
        { data: ydata.orgs },
      ]
    })
  },

  createXdata(){
    var { startDate, endDate } = this.data;
    let starts=startDate.match(/\d{1,4}/g);
    let ends=endDate.match(/\d{1,4}/g);
    let xStart=Number(starts[1])+'-'+Number(starts[2]);
    let xEnd=Number(ends[1])+'-'+Number(ends[2]);
    let dates=getDate();
    let j,k;//截取点
    for(let i=0;i<dates.length;i++){
      if(dates[i]==xEnd){
        k=i;
        break;
      }
      if(dates[i]==xStart){
        j=i;
      }
    }
    return {xdata:dates.slice(j,k+1),j:j,k:k};
  },

  createYdata(x,y){
    //console.log(x,y)
    let wkdata=this.data.wkdata;
    let ydata=new Object;
    for(let item in wkdata){
      ydata[item]=wkdata[item].slice(x,y);
    }
    return ydata;
  }

});