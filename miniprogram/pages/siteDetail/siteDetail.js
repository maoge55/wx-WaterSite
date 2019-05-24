
Page({

  data: {
    water:null,
    location:''
  },


  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载数据',
    })
    if(!options.id){
      wx.redirectTo({
        url: '../map2/map2',
      })
    }
    else{
      let id=options.id
      console.log(id)
      this.getwater(id);
    }
  },

  getwater(id){
    let db=wx.cloud.database();
    db.collection('waterSite').doc(id).get().then(res=>{
      let site=res.data
      wx.hideLoading()
      let x=(site.location.x).toFixed(2)
      let y=(site.location.y).toFixed(2)
      let location='('+x+'，'+y+')';
      this.setData({
        water:site,
        location:location
      })
      console.log(site)
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '获取信息失败',
        icon:none
      })
      wx.redirectTo({
        url: '../map2/map2',
      })
    })
  },

  tomap:function(e){
    let water=this.data.water
    console.log(water)
    if(!water){
      wx.showToast({
        title: '请等待加载完毕',
        image:'/images/fail.png'
      })
      return;
    }

    let site={
      _id:water._id,
      location:water.location,
      dname:water.dname,
      belong:water.belong
    }

    let sitestr=JSON.stringify(site)//款页面传值需封装为JSON string格式
    wx.reLaunch({
      url: '../map2/map2?sitestr='+sitestr+''
    })
  },

  toweek:function(e){
    let water = this.data.water
    console.log(water)
    if (!water) {
      wx.showToast({
        title: '请等待加载完毕',
        image: '/images/fail.png'
      })
      return;
    }
    let site = {
      _id: water._id,
      location: water.location,
      dname: water.dname,
      belong: water.belong
    }
    let sitestr = JSON.stringify(site)//款页面传值需封装为JSON string格式
    wx.reLaunch({
      url: '../weekly/weekly?sitestr=' + sitestr + ''
    })
  }

})