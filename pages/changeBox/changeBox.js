// pages/changeBox/changeBox.js
const app = getApp()
const app_id = app.globalData.appId
const baseUrl = app.globalData.apiBaseUrl
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dividendLength: 5,
        segmentation: [],
        boxes: [],
        filteredBoxes: []
    },

    onRangeButtonClick: function (event) {
        const segmentation = this.data.segmentation
        const index2 = segmentation.findIndex(item => item.rangeButtonStyle === "range-button-selected")
        if (segmentation[index2]) {
            segmentation[index2].rangeButtonStyle = "range-button-unselected"
        }
        const index = event.currentTarget.dataset.index
        segmentation[index].rangeButtonStyle = "range-button-selected"
        const start = parseInt(event.currentTarget.dataset.start);
        const end = parseInt(event.currentTarget.dataset.end);
        this.selectRangeBoxes(start, end)
        this.setData({
            segmentation
        })
    },

    selectRangeBoxes(start, end) {
        const filteredBoxes = this.data.boxes.filter(box =>
            box.box_number >= start && box.box_number <= end
        );
        this.setData({
            filteredBoxes
        });
    },

    selectBox(e) {
        const box_number = e.currentTarget.dataset.box_number
        // 获取页面栈
        const pages = getCurrentPages();
        // 获取上一个页面的实例
        const prevPage = pages[pages.length - 2];
        // 调用上一个页面的函数，将数据传递给上一个页面
        if (prevPage && prevPage.updateBox) {
            prevPage.changeBoxNumber(box_number);
        }

        // 返回上一个页面
        wx.navigateBack({
            delta: 1
        });
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
        const menuButtonBounding = app.globalData.menuButtonBounding
        this.setData({
            menuButtonBottom: menuButtonBounding.bottom,
            menuButtonTop: menuButtonBounding.top,
        })
        const boxId = options.boxId
        const boxNumber = options.boxNumber
        const getBoxInstances = app.globalData.getBoxInstances + `?box_id=${boxId}&app_id=${app_id}`
        wx.request({
            url: baseUrl + getBoxInstances,
            method: 'GET',
            success: res => {
                if (res.statusCode == 200) {
                    console.log(res.data)
                    const boxes = res.data
                    const segmentation = [];
                    for (let i = 0; i < Math.ceil(boxes.length / this.data.dividendLength); i++) {
                        const range = {
                            start: i * this.data.dividendLength + 1,
                            end: (i + 1) * this.data.dividendLength,
                            rangeButtonStyle: "range-button-unselected"
                        }
                        segmentation.push(range)
                    }
                    segmentation[Math.ceil(boxNumber / this.data.dividendLength) - 1].rangeButtonStyle = "range-button-selected"
                    const range = segmentation[Math.ceil(boxNumber / this.data.dividendLength) - 1]
                    this.setData({
                        boxes,
                        segmentation
                    })
                    this.selectRangeBoxes(range.start, range.end)
                } else {
                    wx.showToast({
                        title: '网络错误',
                        icon: 'error',
                        duration: 2000
                    })
                }
            },
            fail: res => {
                //console.error(res.errMsg)
                wx.showToast({
                    title: '网络错误',
                    icon: 'error',
                    duration: 2000
                })
            }
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