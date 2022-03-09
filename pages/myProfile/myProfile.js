import { request } from "../../request/index.js"

// pages/myProfile/myProfile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userId:"",
    schoolName:"",
    userBirthday:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
      userId:wx.getStorageSync('userId'),
      userBirthday:wx.getStorageSync('userInfo').userBirthday
    })
    // 调用函数
    this.getSchoolName(this.data.userInfo.schoolId);
  },
  // 根据id获取学校名称
  getSchoolName(schoolId){
    request({
      url:"School/getSchoolName",
      method:"get",
      data:{
        schoolId:schoolId
      }
    }).then(res => {
      this.setData({
        schoolName:res.data.data.schoolName,
      })
    })
  },

  // 获取输入框信息
  getInput(e){
    this.setData({
      userBirthday:e.detail.value
    })
  },
  getInput2(e){
    this.setData({
      schoolName:e.detail.value
    })
  },
  // 修改用户信息
  updateUserInfo(){
    if(!this.data.userBirthday){
      wx.showToast({
        title: '请绑定出生日期！',
        icon: 'none',
        duration: 2000
      })
    }
    if(!this.data.schoolName){
      wx.showToast({
        title: '请绑定学校！',
        icon: 'none',
        duration: 2000
      })
    }
    request({
      url:"User/updateUserInfo",
      method:"get",
      data:{
        userBirthday:this.data.userBirthday,
        schoolName:this.data.schoolName,
        userId:this.data.userId
      }
    }).then(res => {
      if(res.data.data == 1){
        request({
          url:"User/selectByUserId",
          method:"get",
          data:{
            userId:this.data.userId
          }
        }).then(res => {
          // 修改个人信息成功后刷新本地缓存
          wx.setStorageSync('userInfo', res.data.data);
          this.setData({
            userInfo:res.data.data
          })
          // 重定向到个人信息页
          wx.switchTab({
            url: '../profile/profile',
          })
        })
      }
      // 打印结果信息
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        duration: 2000
      })
    })
    
  },

})