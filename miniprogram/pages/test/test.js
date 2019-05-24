let db=wx.cloud.database();
let util=require('../../utils/util.js')
let _=db.command;
let ly=require('../../utils/lyfw.js').liuyu
let hh = ['安徽宿州杨庄',
'安徽宿州泗县公路桥',
'安徽淮北小王桥',
'安徽蚌埠蚌埠闸',
'山东临沂重坊桥',
'江苏泗洪大屈',
'江苏连云港大兴桥',
'河南信阳淮滨水文站',
  '安徽安庆皖河口']
let sweis=[9,11,15,17]
let sum=0;
Page({

  /**
   * 页面的初始数据
   */

  onLoad: function (options) {
    db.collection('aweek').count().then(res=>{
      console.log(res.total);
    })
  },
  test2:function(){
    setInterval(()=>{
      if(sum>=97){return;}
      db.collection('waterSite').skip(sum).limit(1).get().then(res => {
        let site = res.data[0];
        site.orgacarbon = (!Number(site.orgacarbon)) ? Number((Math.random() * 4.5 + 0.5).toFixed(2)) : Number(site.orgacarbon)
        site.oxygen = (!Number(site.oxygen)) ? Number((Math.random() * 4 + 5).toFixed(2)) : Number(site.oxygen)
        site.permangan = (!Number(site.permangan)) ? util.randomNum(0, 6) : Number(site.permangan)
        site.ph = (!Number(site.ph)) ? util.randomNum(3, 8) : Number(site.ph)
        site.nitrogen=(!Number(site.nitrogen))?0.5:Number(site.nitrogen)
        site.swei = sweis[util.randomNum(0, 3)];
        site.sw = 15
        console.log(site)
        wx.cloud.callFunction({
          name: 'addweekdata',
          data: {
            site: site
          }
        }).then(res => {
          console.log(res.result);
          sum++;
          console.log(sum)
        })
      })
    },3000)
  },


  test1:function(){
    return;
    db.collection('water').where({wid:11}).get().then(res=>{
      console.log(res.data[0].result);
      let obj=res.data[0].result[0];
      //console.log(obj)
      for(let item in obj){
        console.log(item)
        let newitem=obj[item]
        newitem.dname=item.toString()
        console.log(newitem)
        let str=obj[item].profile;
        let long = str.match(/东经(.*?)秒|东经(.*?)分|东经(.*?)度|东经(.*?)′|东经(.*?)′′|经度(.*?)分/);
        let lati = str.match(/北纬(.*?)秒|北纬(.*?)分|北纬(.*?)度|北纬(.*?)′|北纬(.*?)′′|纬度(.*?)分/)
        console.log(long[0])
        console.log(lati[0])
        let latiarr = lati[0].match(/([+]\d+[.]\d+|[-]\d+[.]\d+|\d+[.]\d+|[+]\d+|[-]\d+|\d+)/ig)
        let longarr = long[0].match(/([+]\d+[.]\d+|[-]\d+[.]\d+|\d+[.]\d+|[+]\d+|[-]\d+|\d+)/ig)
        console.log(longarr)
        console.log(latiarr)
        let x,y;
        let x1=Number(longarr[0])
        let x2=Number(longarr[1]||0)
        let x3=Number(longarr[2]||0)
        let y1=Number(latiarr[0])
        let y2=Number(latiarr[1]||0)
        let y3=Number(latiarr[2]||0)
        //console.log(x1,x2,x3,y1,y2,y3)
        x=x1+x2/60+x3/3600;
        y=y1+y2/60+y3/3600;
        //console.log(x,y);
        let location={};
        location.x=x;
        location.y=y;
        console.log(location);
        newitem.location=location;
        resmao.push(newitem);
      }
      console.log(resmao);
      this.addsite(resmao);
    })
  },

  addsite(obj){
    if(sum==obj.length){console.log('加入完成，跳出循环');return;}
    db.collection('waterSite').add({
      data:obj[sum]
    }).then(res=>{
        console.log(sum)
        sum++;
        setTimeout(()=>this.addsite(obj),1000);
      })
  }
})