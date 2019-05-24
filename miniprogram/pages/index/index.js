var app = getApp();

Page({
  data: {},
  onLoad: function() {},
  formSubmit: function(e) {
    const db = wx.cloud.database({
      env: 'dixiashui1-6c296f'
    })
    let value = e.detail.value
    console.log()
    var uid = e.detail.value.uid;
    var password = e.detail.value.password;
    var subPassword = e.detail.value.subPassword;
    var that = this;
    //判断是否为空
    for (let item in value) {
      if (!value[item]) {
        wx.showModal({
          title: '提示',
          content: '请输入' + item,
          showCancel: false
        })
        return;
      }
    }
    // 两个密码必须一致
    if (password != subPassword) {
      wx.showModal({
        title: '提示',
        content: '两次密码不一致',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '正在注册',
    })
    // 判断账号是否为空和判断该账号名是否被注册
    db.collection('User').where({
      uid: uid
    }).count().then(res => {
      if (res.total > 0) {
        wx.showToast({
          title: '用户名已经被注册',
          image: '/images/fail.png'
        })
      }
      // 验证都通过了执行注册方法
      else {
        db.collection('User').add({
          data: {
            uid: e.detail.value.uid,
            password: e.detail.value.password,
          },
          success: res => {
            console.log('[数据库] [新增记录] 成功：', res),
              wx.redirectTo({
                url: '../login/login?uid=' + uid + '&password=' + password + '',
                success: e => wx.hideLoading()
              })
          },
          fail: err => {
            wx.showToast({
              title: '新增数据失败',
            })
            console.error('[数据库] [新增记录] 失败：', err)
          },

        })
      }
    })
  }
})