import { request } from "../../request/index.js"

// pages/jianzhuArticle/jianzhuArticle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jianzhuId:"",
    jianzhuInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面携带的参数赋值
    this.setData({
      jianzhuId:options.jianzhuid
    })
    // 调用函数
    this.selectJianzhuByJianzhuId();
  },
  // 根据id获取建筑信息
  selectJianzhuByJianzhuId(){
    request({
      url:"JianZhu/selectJianzhuByJianzhuId",
      method:"get",
      data:{
        jianzhuId:this.data.jianzhuId
      }
    }).then(res => {
      this.setData({
        jianzhuInfo:res.data.data
      })
    })
  },
  // 点击提交修改后，修改建筑信息和图片上传，并修改数据库中图片访问路径
  updateJianzhuInfo(){
    console.log("提交修改");
  }
})