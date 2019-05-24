
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nav:{
      type:Array,
    },
    current:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toList:function(e){
      //let info=e.currentTarget.dataset.item;
      let index=e.currentTarget.dataset.index
      //console.log(info);
      this.setData({
        current:index
      })
      let detail={value:index}
      this.triggerEvent('change',detail)
    }
  } 
})
