// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let pro= await db.collection('aweek').orderBy('date','asc').where({
    dname:event.dname
  }).get()
  let list=pro.data;
  let ph=[],sw=[],swei=[],nit=[],ox=[],per=[],orgs=[];
  for(let i=0;i<list.length;i++){
    ph.push(Number(list[i].ph));
    sw.push(Number(list[i].sw));
    swei.push(Number(list[i].swei));
    nit.push(Number(list[i].nitrogen));
    ox.push(Number(list[i].oxygen));
    per.push(Number(list[i].permangan));
    let org = list[i].orgacarbon;
    org=(org=='--')?0:Number(org);
    orgs.push(org)
  }
  return {ph,sw,swei,nit,ox,per,orgs}
}