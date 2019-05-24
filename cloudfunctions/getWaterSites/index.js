// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    let pro=await db.collection('waterSite').where({
      belong:event.belong
    }).field({dname:true,location:true}).get()
    return {mes:'获取数据成功',data:pro.data}
  }catch(e){return {mes:'获取数据失败'}}
}