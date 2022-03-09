import { request } from "../../request/index.js"

// pages/myJianzhuUpload/myJianzhuUpload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    jianzhus:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拿取本地缓存中的userid
    this.setData({
      userId:wx.getStorageSync('userId')
    })
    // 调用函数
    this.selectJianzhuByUserId(this.data.userId);
  },
  // 根据id查出所有建筑列表
  selectJianzhuByUserId(userId){
    request({
      url:"JianZhu/selectJianzhuByUserId",
      method:"get",
      data:{
        userId:userId
      }
    }).then(res => {
      this.setData({
        jianzhus:res.data.data
      })
    })
  },
  // 点击列表跳转到详情页
  // 有编辑和删除按钮

  // 编辑按钮功能
  updateUserJianzhuInfo(e){
    const jianzhuid = e.currentTarget.dataset.jianzhuid;
    wx.navigateTo({
      url: '../jianzhuArticle/jianzhuArticle?jianzhuid='+jianzhuid,
    })
  },
  // 删除按钮功能
  deleteUserJianzhuInfo(e){
    const jianzhuid = e.currentTarget.dataset.jianzhuid;
    request({
      url:"JianZhu/deleteUserJianzhuInfo",
      method:"get",
      data:{
        jianzhuId:jianzhuid
      }
    }).then(res => {
      // 重新请求数据
      this.selectJianzhuByUserId(this.data.userId);
      // 显示删除成功
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        duration: 2000
      })
    })
  }
})