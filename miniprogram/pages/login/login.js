Page({
  data: {
    uid: "",
    password: ""
  },
  onLoad: function(options) {
    if (!!options.uid && !!options.password) {
      this.setData({
        uid: options.uid,
        password: options.password
      })
    }
    let user=wx.getStorageSync('user')||[];
    if(!!user.uid&&!!user.password){
      this.setData({
        uid:user.uid,
        password:user.password
      })
    }
  },

  registerTap: function() {
    wx.showLoading({
      title: '前往注册',
    })
    wx.navigateTo({
      url: '../index/index',
      success:e=>wx.hideLoading()
    })
  },

  formSubmit: function(e) {
    //console.log(e.detail.value)
    const db = wx.cloud.database({
      env: 'dixiashui1-6c296f'
    })
    var uidVal = e.detail.value.uid;
    var passwordVal = e.detail.value.password;
    var that = this;
    if (this.data.uidVal == '' || this.data.passwordVal == '') {
      wx.showModal({
        title: '提示',
        content: '请输入账号密码',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '正在登陆',
      })
      db.collection('User').where({
        uid: uidVal,
        password: passwordVal
      }).get().then(res => {
        if (res.data.length == 0) {
          wx.hideLoading();
          wx.showToast({
            title: '账号密码错误',
            image: '/images/fail.png'
          })
        } else {
          wx.setStorageSync('user', {
            uid: uidVal,
            password: passwordVal
          })
          wx.showToast({
            title: '登陆成功',
            success: e => wx.switchTab({
              url: '../map2/map2',
            })
          })
        }
      })
    };
  },

})