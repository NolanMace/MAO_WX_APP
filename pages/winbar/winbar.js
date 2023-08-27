// pages/winbar/winbar.js
const app = getApp()
const app_id = app.globalData.appId
const baseUrl = app.globalData.apiBaseUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectBox: true,
        selectDq: false,
        selectPool: false,
        boxes: [],
        dqs: [],
        pools: [],
        category: '一番赏',
        labelStyle: 'yifan_label',
    },

    getDisplays(wname) {
        var url = baseUrl + app.globalData.getWindowBarBoxByAppId + "?window_name=" + wname + "&window_type=all&app_id=" + app_id
        wx.request({
            url: url,
            method: 'GET',
            success: res => {
                //console.log(res.data)
                var boxes = []
                var dqs = []
                var pools = []
                if (res.data == null) {
                    return
                }
                var displays = res.data
                for (let i = 0; i < displays.length; i++) {
                    displays[i].priceStr = displays[i].window_bar_price.toFixed(2)
                    if (displays[i].window_bar_type == 'box') {
                        boxes.push(displays[i])
                    } else if (displays[i].window_bar_type == 'dq') {
                        dqs.push(displays[i])
                    } else if (displays[i].window_bar_type == 'pool') {
                        pools.push(displays[i])
                    }
                }
                this.setData({
                    boxes,
                    dqs,
                    pools
                })
            },
            fail: res => {
                wx.showToast({
                    title: res.data,
                    icon: 'none'
                })
            }
        })
    },

    switchCategory(e) {
        let category = e.currentTarget.dataset.category
        var labelStyle = ''
        if (category == "一番赏") {
            labelStyle = "yifan_label"
        } else if (category == "竞技赏") {
            labelStyle = "dq_label"
        } else {
            labelStyle = "wuxian_label"
        }
        this.setData({
            labelStyle,
            category,
            selectBox: category == "一番赏",
            selectDq: category == "竞技赏",
            selectPool: category == "无限赏",
        })
    },

    toChoushang(e) {
        var window_bar_id = e.currentTarget.dataset.window_bar_id
        if (this.data.selectBox) {
            const window_bar = this.data.boxes.find((item) => {
                return item.window_bar_id == window_bar_id
            })
            const boxNumber = 0
            wx.navigateTo({
                url: `../choushang/choushang?box_id=${window_bar.window_bar_id}&box_number=${boxNumber}&share_img=${window_bar_id.share_img}&share_title=${window_bar_id.share_title}`,
            })
        } else if (this.data.selectDq) {
            const window_bar = this.data.dqs.find((item) => {
                return item.window_bar_id == window_bar_id
            })
            const boxNumber = 0
            wx.navigateTo({
                url: `../choushang/choushang?box_id=${window_bar.window_bar_id}&box_number=${boxNumber}&share_img=${window_bar_id.share_img}&share_title=${window_bar_id.share_title}`,
            })
        } else if (this.data.selectPool) {
            var window_bar = this.data.pools.find((item) => {
                return item.window_bar_id == window_bar_id
            })
            wx.navigateTo({
                url: `../wuxianshangpage/wuxianshangpage?pool_id=${window_bar_id}&share_img=${window_bar.share_img}&share_title=${window_bar.share_title}`,
            })
        }
    },

    back() {
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            window_name,
            top_url,
            cover_url
        } = options
        const tabBarHeight = app.globalData.tabBarHeight
        const bottom = app.globalData.menuButtonBounding.bottom
        const top = app.globalData.menuButtonBounding.top
        this.setData({
            menuButtonBottom: bottom,
            menuButtonTop: top,
            tabBarHeight: tabBarHeight,
            window_name,
            top_url,
            cover_url
        })
        this.getDisplays(window_name)
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