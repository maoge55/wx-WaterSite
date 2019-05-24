let ly=require('../../utils/lyfw.js').liuyu
Page({


  data: {
    nav:ly,
    current:0,
    sites:[],
    lyName:'',
    flag:true
  },
  onLoad:function(e){
    //console.log(ly);
    this.setData({lyName:ly[this.data.current].name})
    this.getsites(this.data.current)
  },
  //导航切换并获取站点
  onnavclick:function(e){
    let current=e.detail.value;
    //console.log(current);
    this.getsites(current)
  },
  //根据导航获取站点
  getsites(current){
    wx.showLoading({
      title: '正在加载',
    })
    let belong=ly[current].name;
    //console.log(belong)
    wx.cloud.callFunction({
      name:'getWaterSites',
      data:{belong: belong}
    }).then(res=>{
      //console.log(res.result.data)
      this.setData({
        lyName:belong,
        sites:res.result.data
      })
      wx.hideLoading()
    }).catch(err=>console.log(err))
  },

  //展开信息
  ckinfo:function(e){
    let i=e.currentTarget.dataset.index;
    let sites=this.data.sites;
    //console.log(i);
    this.setData({
      ['sites['+i+'].click']:!sites[i].click
    })
  },

  //更多信息
  tositeDetail:function(e){
    let id=e.currentTarget.dataset.id;
    console.log(id);
    let url='../siteDetail/siteDetail?id='+id+'';
    wx.navigateTo({
      url: url,
    })
  }
})