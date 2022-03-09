let requestNum = 0;
export const request=(params) => {
  requestNum++;
  const baseUrl = "https://localhost:8082/";
  // 加上请求加载中小图标
  wx.showLoading({
    title: '加载中',
    // 加蒙版，数据加载中无法进行操作
    mask:true
  })
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      url:baseUrl+params.url,
      success:(res) => {
        resolve(res);
      },
      fail:(res) => {
        reject(res);
      },
      complete:()=>{
        // 判断请求是否全部执行完毕，执行完毕后关闭加载图标
        requestNum--;
        if(!requestNum){
          wx.hideLoading()
        }
      }
    });
  })
}