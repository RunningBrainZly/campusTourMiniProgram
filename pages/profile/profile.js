import { request } from "../../request/index.js";

// pages/profile/profile.js
// 更改用户信息后要刷新本地缓存的用户信息
Page({
  data: {
    userInfo: {},
    // 判断是否登录
    isLogin:true,
  },
  // 用户id
  userId:"",
  // 向数据库中插入userInfo
  userInfoSql:{},
  onLoad(options) {
    wx.showToast({
      title: options.message,
      icon: 'none',
      duration: 2000
    })
    // 先判断缓存中是否有登录信息,有直接赋值，没有则显示登录
    if(wx.getStorageSync('userInfo')){
      this.setData({
        userInfo:wx.getStorageSync('userInfo'),
        isLogin:false
      })
    }
  },
  /**
   * 
   * @param {zly} e 
   * 点击登录后获取到用户信息后，查询数据库,数据库中没有再插入数据库，数据库中有就直接赋值，存入缓存，结束执行
   */
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.userInfoSql = res.userInfo
        wx.login({
          timeout: 10000,
          success:(res) => {
            if(res.code){
              request({
                url:"User/getOpenId",
                method:"post",
                data:{
                  code:res.code
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // post请求把传参类型改一下
                }
              }).then((res) => {
                  this.userId =res.data.openid;
                  // 根据openid查询数据库用户信息
                  this.selectByUserId(this.userId);
              })
            }else{
              console.log("登录失败！"+res.errMsg);
            }
          }
        })
      }
    })
  },
  // 用户同意获取信息后发送请求插入数据库
  insertUserInfo(userInfo){
    request({
      url:"User/insertUser",
      method:"post",
      data:{
        userId:this.userId,
        schoolId:6,
        nickName:userInfo.nickName,
        userSex:userInfo.gender?"女":"男",
        avatarUrl:userInfo.avatarUrl,
        userStatus:1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
    }).then((res) => {
      wx.setStorageSync('userInfo', this.userInfoSql);
      wx.setStorageSync('userId', this.userId);
      this.setData({
        userInfo:userInfo,
        isLogin:false
      })
    }).catch((err) => {
      console.log("插入失败！");
    })
  },
  // 根据用户id查询用户
  selectByUserId(userId){
    request({
      url:"User/selectByUserId",
      method:"post",
      data:{
        userId:userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
    }).then((res) => {
      // 有就赋值结束，没有就获取用户信息插入用户
      if(res.data.data){
        this.setData({
          userInfo:res.data.data,
          isLogin:false
        })
        wx.setStorageSync('userId', this.userId);
        wx.setStorageSync('userInfo', this.userInfoSql);
      }else{
        // 向数据表中插入用户
        this.insertUserInfo(this.userInfoSql);
      }
    })
  },
  // 点击管理员登录
  loginAdmin(){
    wx.showModal({
      title: '管理员登录',
      placeholderText: '输入管理员编码',
      confirmText:"登录",
      editable:true,
      success:(res) => {
        if (res.confirm) {
          // 点击确定后验证数据库密码
          request({
            url:"User/loginAdminInfo",
            method:"get",
            data:{
              password:res.content
            }
          }).then(res => {
            if(res.data.data == 0){
              // 编码错误后返回上一页
              wx.reLaunch({
                url: '../profile/profile?message='+res.data.message
              })
            }
          })
        } else if (res.cancel) {
          // 点击取消后返回上一页
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})
