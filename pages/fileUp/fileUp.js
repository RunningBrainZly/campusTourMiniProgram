import { request } from "../../request/index.js";

/**
 *  
 *  */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName:"山西警察学院",
    // 被选中的图片路径 数组
    uploadImage_url:[],
    // 用户输入的建筑名称
    jianzhuName:"",
    // 用户输入的建筑介绍
    jianzhuText:"",
    // 建筑图片地址
    jianzhuImage:""
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  clickUploadImage(e){
    wx.chooseImage({
      // 最多可以选择图片数量
      count: 9,
      // 原图  ， 压缩图
      sizeType: ['original', 'compressed'],
      // 上传图片方式，相机，本地
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          // 用户上传一次再上传，就要拼接数组
          uploadImage_url:[...this.data.uploadImage_url,...res.tempFilePaths]
        })
      }
    })
  },
  /**
   * 删除图片：
   *  点击删除图标，子组件中icon发出点击事件
   *  父组件接收，根据index删除数组中的元素
   *  重置data中的数据
   */
  deleteImage(e){
    // const 定义时必须赋值，赋值后不可变，他里面的元素可变
    // let 定义后可改变
    const index = e.currentTarget.dataset.index;
    let {uploadImage_url} = this.data;
    // 数组方法 。splice(开始下标，删除几个)
    uploadImage_url.splice(index,1);
    this.setData({
      uploadImage_url
    })
  },
  // 获取用户输入建筑名称
  getInput(e){
    this.setData({
        jianzhuName:e.detail.value
      })
  },
  // 获取建筑介绍文本
  getInput2(e){
    this.setData({
        jianzhuText:e.detail.value
      })
  },

  /**
   * 点击上传后
   *  1.获取用户输入的所有信息
   *  2.上传状态为0
   *  3.把图片存放到网络图床，获取网络地址
   *  4.把所有信息插入数据库中
   *  5.上传成功后清空页面，提示上传成功，待审核
   */  

  //  上传文件方法
  uploadImage(){
    wx.uploadFile({
      // 访问服务器地址
      url: 'JianZhu/upload', //仅为示例，非真实的接口地址
      // 本地资源路径（本地路径）
      filePath: this.data.uploadImage_url[0],
      name: 'file',
      formData: {
        'user': 'zly'
      },
      success (res){
        console.log(res);
        //do something
      }
    })
  },
  insertJianZhu(){
    // 点击上传后上传图片
    this.uploadImage();
    request({
      url:"JianZhu/insertJianZhu",
      method:"GET",
      data:{
        uploadStatus:0,
        userId:wx.getStorageSync('userId'),
        schoolId:wx.getStorageSync('userInfo').schoolId,
        jianzhuName:this.data.jianzhuName,
        jianzhuText:this.data.jianzhuText,
        jianzhuImage:this.data.uploadImage_url[0]
      }
    }).then((res) => {
      console.log(res.data);
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        duration: 2000
      })
    })
  }
})