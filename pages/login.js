// pages/login.js
const app = getApp()
const app_id = app.globalData.appId
const baseUrl = app.globalData.apiBaseUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    back() {
        wx.navigateBack()
    },

    getPhoneNumber(e) {
        const code = e.detail.code
        if (code) {
            wx.login({
                success: (res) => {
                    wx.request({
                        url: baseUrl + app.globalData.login,
                        method: 'POST',
                        data: {
                            code: res.code,
                            phone_code: code,
                            app_id: app_id
                        },
                        success: res => {
                            if (res.statusCode == 200) {
                                const token = res.data.token
                                wx.setStorageSync('token', token)
                            } else {
                                console.log(res)
                                wx.showToast({
                                    title: '登录失败',
                                    icon: 'error'
                                })
                            }
                            wx.navigateBack()
                        },
                        fail: res => {
                            console.log(res)
                            wx.showToast({
                                title: '登录失败',
                                icon: 'error'
                            })
                            wx.navigateBack()
                        }
                    })
                },
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const menuButtonBounding = app.globalData.menuButtonBounding
        this.setData({
            menuButtonBottom: menuButtonBounding.bottom,
            menuButtonTop: menuButtonBounding.top,
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