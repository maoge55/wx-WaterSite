let ly=[
  {
    id:0,
    name:'淮河流域',
    x:{start:111.916666667,end:121.416666667},
    y:{start:30.916666667,end:37.6},
    center:{ x: 116.666666667, y: 34.258333333500005 }
  },
  {
    id:1,
    name:'长江流域',
    x:{start:90,end:122},
    y:{start:24,end:35},
    center:{ x: 106, y: 29.5 }
  },
  {
    id:2,
    name:'太湖流域',
    x:{start:119.583333333,end:121.083333333},
    y:{start:30.85,end:31.716666667},
    center:{ x: 120.333333333, y: 31.2833333335 }
  },
  {
    id:3,
    name:'松花江流域',
    x:{start:121.13333333,end:123.53333333},
    y:{start:43.53333333,end:44.53333333},
    center:{ x: 122.33333333, y: 44.03333333 }
  },
  {
    id:4,
    name:'巢湖流域',
    x:{start:118.3,end:118.86666667},
    y:{start:33.36666667,end:33.616666667},
    center:{ x: 118.58333333499999, y: 33.4916666685 }
  },
  {
    id:5,
    name:'珠江流域',
    x:{start:102.23333333,end:115.883333333},
    y:{start:21.516666667,end:26.816666667},
    center:{ x: 109.0583333315, y: 24.166666667 }
  },
  {
    id:6,
    name:'海河流域',
    x:{start:116,end:118},
    y:{start:38,end:40},
    center:{ x: 117, y: 39 }
  },
  {
    id:7,
    name:'滇池流域',
    x:{start:102.16666667,end:103.116666667},
    y:{start:24.416666667,end:25.35},
    center:{ x: 102.6416666685, y: 24.8833333335 }
  },
  {
    id:8,
    name:'黄河流域',
    x:{start:90,end:120},
    y:{start:35,end:40},
    center:{ x: 105, y: 37.5 }
  },
  {
    id:9,
    name:'东南诸河',
    x: { start: 118.730833333, end: 119.46666667 },
    y: { start: 25.9833333333, end: 29.73333333 },
    center:{ x: 119.09875000150001, y: 27.85833333165 }
  },
  {
    id:10,
    name:'辽河流域',
    x: { start: 122.231763888, end: 124.436666667 },
    y: { start: 40.158333333, end: 42.21 },
    center:{ x: 123.3342152775, y: 41.184166666500005 }
  },
  {
    id:11,
    name:'西南诸河',
    x: { start: 100.916666667, end: 103.956722222 },
    y: { start: 21.85, end: 22.508805555 },
    center:{ x: 102.4366944445, y: 22.1794027775 }
  }
]
function onwitchly(x0,y0){
  for(let item of ly){
    if(x0>item.x.start&&x0<item.x.end){
      if(y0>item.y.start&&y0<item.y.end){
        return item;
      }
    }
  }
  //return {name:'未找到',center:{x:120,y:25}}
}
module.exports={
  liuyu:ly,
  onwitchly:onwitchly
}