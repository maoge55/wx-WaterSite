let ly=require('../../utils/lyfw.js')
var db = wx.cloud.database();
let _=db.command
var canUseReachBottom = true;
Page({
  data: {
    longitude: null,
    latitude: null,
    scale: 14,
    points: null,
    ly:ly.liuyu,
    lyName:'未知',
    markers:null,
    flag:true,
    curitem:0,
    keyword:'',
    flag2:true,
    searchres:[],
    flag3:true,
    focus:false
  },
  onLoad: function(options) {
    //console.log(options.sitestr)
    this.getLocation(options);
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  getLocation(e) {
    if(!!e.sitestr){
      this.cksite(e.sitestr)
      return;
    }
    wx.showLoading({
      title: '正在定位',
    })
    var that = this;
    wx.getLocation({
      success: function (res) {
        let item = ly.onwitchly(res.longitude, res.latitude)
        that.setData({
          scale: 14,
          longitude: item.center.x,
          latitude: item.center.y,
          lyName:item.name,
          curitem: item.id
        })
        that.mapCtx.getCenterLocation({
          success:e=>console.log(e)
        })
        that.getlyMarks(item.name);
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '请打开设置开启位置权限',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.openSetting({

              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })


  },
  //详情页跳转到地图查看站点
  cksite(str){
    wx.showLoading({
      title: '正在定位',
    })
    let site=JSON.parse(str)
    let sites=[]
    let curitem
    //console.log(666,site)
    sites.push(site);
    for (let v of ly.liuyu) {
      if (v.name == site.belong) {
        curitem = v.id;
        break;
      }
    }
    this.createMarks(sites);
    this.setData({
      longitude: site.location.x,
      latitude: site.location.y,
      flag2: true,
      searchres: [],
      scale: 12,
      lyName: site.belong,
      keyword: '',
      curitem: curitem
    })

  },
  //获取水站标记
  getlyMarks(name){
    wx.cloud.callFunction({
      name:'getWaterSites',
      data:{belong:name}
    }).then(res=>{
      let sites=res.result.data
      //console.log(sites)
      this.createMarks(sites);
    }).catch(err=>console.log(err))
  },
  
  //根据获取到的水站位置信息制作地图标记点和include-points
  createMarks(sites){
    let marks=[],points=[]
    for(let i=0;i<sites.length;i++){
      let mark={
        id: sites[i]._id,
        longitude: sites[i].location.x,
        latitude: sites[i].location.y,
        iconPath: '/images/waterSite.png',
        width: '40rpx',
        height: '40rpx',
        callout: {
          content: sites[i].dname,
          color: '#ffffff',
          borderRadius: 20,
          padding: '10rpx',
          bgColor: '#004370',
          display: 'ALWAYS',
          textAlign: 'center',
          zIndex:999
        }
      }
      let point = { latitude: sites[i].location.y, longitude: sites[i].location.x}
      marks.push(mark);
      points.push(point);
    }
    //console.log(marks,points)
    this.setData({
      markers:marks,
      points:points
    })
    wx.hideLoading()
    //this.mapCtx.moveToLocation()
  },
  scc:function(e){
    if(e.type=='end'){
      this.mapCtx.getCenterLocation({
        success:(e)=>{
          //console.log(e)
        }
      })
    }
  },
  
  onRightClk:function(){
    this.setData({
      flag:!this.data.flag
    })
  },

  //切换流域
  changely:function(e){
    let name=e.currentTarget.dataset.name;
    let id=e.currentTarget.dataset.id;
    if (this.data.lyName == name) { return; }
    wx.showLoading({
      title: '正在定位',
    })
    console.log(name);
    this.setData({
      longitude:ly.liuyu[id].center.x,
      latitude:ly.liuyu[id].center.y,
      curitem:id,
      lyName:name,
      flag:true
    })
    this.getlyMarks(name);
  },

  hidebg:function(){
    this.setData({flag2:true})
  },

  openserch:function(){
    this.setData({focus:true})
  },
  onconfirm:function(e){
    let keyword=e.detail.value
    console.log(keyword)
    this.searchbykey(keyword)
  },
  keysubmit:function(e){
    let keyword=e.detail.value.keyword;
    console.log(keyword)
    this.searchbykey(keyword)
  },
  searchbykey(keyword){
    wx.showLoading({
      title: '搜索中',
    })
    console.log(keyword);
    keyword=keyword.replace(/[省市县]/gi,'')
    db.collection('waterSite').where(_.or([
      {
        dname: db.RegExp({
          regexp:keyword,
          options:'i',
        })
      },
      {
        belong: db.RegExp({
          regexp:keyword,
          options:'i',
        })
      }
    ])).field({
      dname:true,
      belong:true,
      location:true
    }).get().then(res=>{
      if(res.data.length==0){
        wx.showToast({
          title: '未找到结果',
          image:'/images/fail.png'
        })
        this.setData({searchres:[],flag:true})
        return;
      }
      this.setData({
        searchres:res.data,
        flag3:false,
        flag:true
      })
      //console.log(this.data.searchres)
      wx.hideLoading();
    })
  },

  tores:function(e){
    wx.showLoading({
      title: '正在定位',
    })
    let item=e.currentTarget.dataset.item;
    let curitem
    console.log(item);
    let sites=[];
    sites.push(item);
    for(let v of ly.liuyu){
      if(v.name==item.belong){
        curitem=v.id;
        break;
      }
    }
    this.createMarks(sites);
    this.setData({
      longitude:item.location.x,
      latitude:item.location.y,
      flag2:true,
      searchres:[],
      scale:12,
      lyName:item.belong,
      keyword:'',
      curitem:curitem
    })
  },
  hideser:function(){
    this.setData({
      searchres:[],
      keyword:''
    })
  },
  todetail:function(e){
    let id=e.markerId;
    //console.log(id);
    wx.navigateTo({
      url: '../siteDetail/siteDetail?id='+id+'',
    })
  },
})