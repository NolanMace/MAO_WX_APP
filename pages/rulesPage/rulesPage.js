// pages/rulesPage/rulesPage.js
const app = getApp()
const baseUrl = app.globalData.apiBaseUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isRules: false,
        isShipmentRules: false,
    },

    back() {
        wx.navigateBack({
            delta: 1
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const para = options.para
        const tabBarHeight = app.globalData.tabBarHeight
        const menuButtonBounding = app.globalData.menuButtonBounding
        this.setData({
            menuButtonBottom: menuButtonBounding.bottom,
            menuButtonTop: menuButtonBounding.top,
            tabBarHeight,
            isRules: para == "rules",
            isShipmentRules: para == "shipmentRules",
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})