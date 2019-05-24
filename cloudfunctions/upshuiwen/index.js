// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()
let _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let pro= await db.collection('aweek').where({
    _id:event.id
  }).update({
    data:{
      swei:_.inc(Number(((Math.random()+1)/10).toFixed(4)))
    }
  })
  return pro
}