import { request } from "../../request/index";

// pages/search/search.js
// 防抖（通过定时器实现）
  /**
   * 1.设置一个全局定时器id
   * 2.发送请求前先清除定时器id
   * 3.开启定时器
   */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolList:[],
    // 取消按钮是否隐藏
    isFocus:false,
    // 输入框的值
    inputValue:""
  },
  searchInput:"",
  TimeId:-1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 输入框值改变时调用
  getUserSearch(e){
    const value = e.detail.value;
    // 检测值合法性（为空直接跳过）
    if(!value.trim()){
      // 值不和法
      this.setData({
        schoolList:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.getSearchInfo(value);
    },1000);
  },
  // 发送请求获取学校列表
  getSearchInfo(value){
    request({
      url:"School/getSearchInfo",
      method:"GET",
      data:{
        searchInput:this.searchInput = value
      }
    }).then((res) => {
      this.setData({
        schoolList:res.data.data
      })
    })
  },
  Restart(){
    this.setData({
      schoolList:[],
      isFocus:false,
      inputValue:""
    })
  }
})