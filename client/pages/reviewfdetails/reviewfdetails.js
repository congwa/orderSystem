// pages/reviewfdetails/reviewfdetails.js
Page({
  

  /**
   * 组件的初始数据
   */
  data: {
         /**
     * 我的评价的页码
     */
    page:1,
    /**
     * 我的评价的数量
     */
    count:0,
    /**
     * 我的评价的数据
     */
    commitList:[],

    scoreList:['全部','好评','差评','服务好','口味好','环境好'],
    score:0,
    type:1
  },
  onLoad(options){
    var strTlist = options.tlist;
    var tlist = JSON.parse(strTlist);
    console.log(tlist);
    this.setData({
      commitList:tlist
    })

  }
  
})
