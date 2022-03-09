import {request} from "../../request/index.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    schoolName:"",
    jianzhuInfo:[],
    swiperList:[],
    errorImageMess:""
  },
  // 获取用户绑定的学校id
  schoolId:1,
  // 用户id
  userId:"",
  // 向数据库中插入userInfo
  userInfoSql:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.login();
    // 用户从搜索页面进入
    if(options.schoolId){
      this.schoolId = options.schoolId;
      // 发送异步请求获取轮播图数据
      this.getSwiperList();
      // 获取学校名称
      this.getSchoolName();
      // 根据学校id获取对应建筑列表信息
      this.getJianzhuInfo();
    }
  },
  // 用户登录
  login(){
    // 打开小程序先检测缓存中有无用户信息,没有就获取用户信息插入数据库，学校id默认1，有就把学校id赋值，学校未绑定，默认1
    if(wx.getStorageSync('userInfo') && wx.getStorageSync('userId')){
      this.selectByUserId(wx.getStorageSync('userId'));
    }else{
      wx.showModal({
        title: '登录',
        content: '',
        success: (res) => {
          if (res.confirm) {
            wx.getUserProfile({
              desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: (res) => {
                this.userInfoSql = res.userInfo;
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
                          // 发送异步请求获取轮播图数据
                          this.getSwiperList();
                          // 获取学校名称
                          this.getSchoolName();
                          // 根据学校id获取对应建筑列表信息
                          this.getJianzhuInfo();
                      })
                    }else{
                      console.log("登录失败！"+res.errMsg);
                    }
                  }
                })
              },
              fail:(err) => {
                // 发送异步请求获取轮播图数据
                this.getSwiperList();
                // 获取学校名称
                this.getSchoolName();
                // 根据学校id获取对应建筑列表信息
                this.getJianzhuInfo();
                wx.showToast({
                  title: '取消登录',
                  icon: 'success',
                  duration: 2000
                })
              }
            });
          } else if (res.cancel) {
            // 发送异步请求获取轮播图数据
            this.getSwiperList();
            // 获取学校名称
            this.getSchoolName();
            // 根据学校id获取对应建筑列表信息
            this.getJianzhuInfo();
            wx.showToast({
              title: '取消登录',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    }
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
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('userId', this.userId);
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
        wx.setStorageSync('userId', userId);
        wx.setStorageSync('userInfo', res.data.data);
        if(wx.getStorageSync('userInfo').schoolId != 6){
          this.schoolId = wx.getStorageSync('userInfo').schoolId;
        }
        // 发送异步请求获取轮播图数据
        this.getSwiperList();
        // 获取学校名称
        this.getSchoolName();
        // 根据学校id获取对应建筑列表信息
        this.getJianzhuInfo();
      }else{
        // 向数据表中插入用户
        this.insertUserInfo(this.userInfoSql);
      }
    })
  },
  // 根据用户绑定学校id获取学校名称（默认为1）
  getSchoolName(){
    request({
      url:"School/getSchoolName",
      method:"GET",
      data:{
        schoolId:this.schoolId
      }
    }).then((res) => {
      this.setData({
        schoolName:res.data.data.schoolName
      })
    })
  },
  // 获取轮播图信息
  getSwiperList(){
    // 把原生的请求修改为promise请求（防止陷入异步请求回调地狱中）
    // 用上封装后的代码
    request({
      url:"JianZhu/getSwiperList",
      // 101.200.137.150/helpds.cn
      // url:"https://101.200.137.150:8082/getSwiperList",
      method:"GET",
      data:{
        schoolId:this.schoolId
      }
    }).then((res) => {
      this.setData({
        swiperList:res.data.data
      })
    })
  },
  // 根据学校id获取对应建筑列表信息
  getJianzhuInfo(){
    request({
      url:"JianZhu/getJianzhuInfo",
      method:"GET",
      data:{
        schoolId:this.schoolId
      }
    }).then((res) => {
      this.setData({
        jianzhuInfo:res.data.data
      })
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // wx.stopPullDownRefresh({
    //   success: (res) => {
    //     console.log(res);
    //   },
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // wx.showToast({
    //   title: '没有下一页数据了',
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
