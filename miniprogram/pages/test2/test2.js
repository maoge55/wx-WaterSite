let db=wx.cloud.database();
let sum=0;
Page({


  data: {

  },

  onLoad: function (options) {
    
  },

  sss:function(){
    wx.cloud.callFunction({
      name:'addDate'
    }).then(res=>{
      console.log(res.result)
      let names=res.result.names;
      this.cs(names);
    })

  },
  cs(names){
    setInterval(() => {
      if(sum>=97){return;}
      console.log(names[sum]);
      db.collection('aweek').where({ dname: names[sum] }).count().then(res=>{
        let t=res.total;
        console.log(t)
        if(t!=7){
          console.log(names[sum]+'数据异常')
        }
        sum++;
        console.log('sum:'+sum)
      })
    }, 1000)
  }

})