import { request } from "../../request/index.js"

// pages/jianzhuShow/jianzhuShow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jianzhuInfo:[],
    schoolName:""
  },
  // 定义全局变量
  jianzhuId:0,
  schoolId:0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拿到页面传过来的建筑id
    this.jianzhuId = options.jianzhuId;
    this.schoolId = options.schoolId;
    // 发送请求获取建筑信息
    this.getJianzhuInfo();
    // 获取学校名称
    this.getSchoolName(this.schoolId);
  },
// 根据id发送网络请求在后端拿到建筑信息
  getJianzhuInfo(){
    request({
      url:"JianZhu/getJianzhuInfoById",
      method:"GET",
      data:{
        jianzhuId:this.jianzhuId,
        schoolId:this.schoolId
      }
    }).then((res) => {
      // 请求过来的值赋值
      this.setData({
        jianzhuInfo:res.data.data
      })
    })
  },
  // 根据学校id查出学校名称
  getSchoolName(schoolId){
    request({
      url:"School/getSchoolName",
      method:"get",
      data:{
        schoolId:schoolId
      }
    }).then((res) =>  {
      this.setData({
        schoolName:res.data.data.schoolName
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})