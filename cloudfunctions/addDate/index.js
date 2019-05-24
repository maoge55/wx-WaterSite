// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let pro=await db.collection('waterSite').field({dname:true}).get();
  let data=pro.data;
  let names=[];
  for(let i=0;i<data.length;i++){
    names.push(data[i].dname);
  }
  return {
    l:data.length,
    names:names
  }
}