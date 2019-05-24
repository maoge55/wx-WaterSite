// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let site=event.site;
  var { nitrogen, orgacarbon, oxygen, dname, belong, location, permangan, ph, sw, swei } = site
  let tasks=[];
  for(let i=0;i<7;i++){
    let mydate = new Date();
    mydate.setDate(mydate.getDate()-i);//获取测量日期
    let pro= db.collection('aweek').add({
      data:{
        dname:dname,
        belong:belong,
        location:location,
        nitrogen: Number((nitrogen+Math.random()/2).toFixed(2)),
        orgacarbon:Number((orgacarbon+(Math.random()*0.5+0.5)).toFixed(2)),
        oxygen: Number((oxygen+(Math.random()*2)).toFixed(2)),
        permangan: Number((permangan+(Math.random()*2)).toFixed(2)),
        ph: Number((ph+(Math.random())).toFixed(2)),
        sw: Number((sw+(Math.random()*2)).toFixed(2)),
        swei: Number((swei+(Math.random()*0.1)+0.1).toFixed(2)),
        date:mydate.toLocaleDateString().replace(/\//g,'-')
      }
    })
    tasks.push(pro)
  }
  return  (await Promise.all(tasks))
}