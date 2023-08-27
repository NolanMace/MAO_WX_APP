// pages/ycshipmentorders/ycshipmentorders.js
const app = getApp()
const baseUrl = app.globalData.apiBaseUrl
Page({
    /**
     * 页面的初始数据
     */
    data: {
        selectedIds: [],
        selectUndelivered: true,
        selectUncomposed: false,
        isLoggen: true,
        page: 1,
        pages_size: 10,
        lastShipmentOrders: [],
        status: '0'
    },

    clickNavigateButton(e) {
        const index = e.currentTarget.dataset.index
        this.selectShipmentOrders(index)
    },

    selectShipmentOrders(index) {
        this.unDeliveredShipmentOrdersButton.unselect()
        this.uncomposedShipmentOrdersButton.unselect()
        if (index == '0') {
            this.unDeliveredShipmentOrdersButton.select()
        } else {
            this.uncomposedShipmentOrdersButton.select()
        }
        this.setData({
            selectUndelivered: index == '0',
            selectUncomposed: index == '3',
            page: 1,
            status: index,
            shipmentOrders: [],
            lastShipmentOrders: [],
        })
        var pages_size = this.data.pages_size
        //console.log(pages_size)
        this.getShipments(1, pages_size, index)
    },

    getShipments(page, pages_size, status) {
        let token = wx.getStorageSync('token')
        if (token == null) {
            this.setData({
                isLoggen: false
            })
            return
        }
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: baseUrl + app.globalData.getUserShipmentOrderResponses + "?status=" + status + "&page=" + page + "&pages_size=" + pages_size,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: res => {
                if (res.statusCode == 200) {
                    wx.hideLoading()
                    // console.log(res.data)
                    if (res.data == null) {
                        return
                    }
                    var lastShipmentOrders = res.data
                    for (let i = 0; i < lastShipmentOrders.length; i++) {
                        lastShipmentOrders[i].isSelected = false
                    }
                    var oldShipmentOrders = this.data.shipmentOrders
                    var shipmentOrders = oldShipmentOrders.concat(lastShipmentOrders)
                    page += 1
                    // console.log(shipmentOrders)
                    this.setData({
                        shipmentOrders,
                        lastShipmentOrders,
                        page
                    })
                } else {
                    wx.hideLoading()
                    wx.removeStorageSync('token')
                    this.setData({
                        isLoggen: false
                    })
                }
            },
            fail: res => {
                wx.hideLoading()
                wx.removeStorageSync('token')
                this.setData({
                    isLoggen: false
                })
            }
        })
    },

    selectShipment(e) {
        const index = e.currentTarget.dataset.index
        //console.log(index)
        const shipmentOrders = this.data.shipmentOrders
        const item = shipmentOrders[index]
        const selectedIds = this.data.selectedIds
        item.isSelected = !item.isSelected
        var findindex = selectedIds.findIndex((shipment) => {
            return shipment.shipment_order_id == item.shipment_order_id
        })
        if (item.isSelected) {
            selectedIds.push(item.shipment_order_id)
        } else if (!item.isSelected && findindex) {
            selectedIds.splice(findindex, 1)
        }
        // console.log(selectedIds)
        this.setData({
            selectedIds,
            shipmentOrders
        })
    },

    toYcPage() {
        var shipment_order_ids = this.data.selectedIds
        // console.log(shipment_order_ids)
        if (shipment_order_ids.length == 0) {
            wx.showToast({
                title: '请选择发货订单',
                icon: 'none',
            })
            return
        }
        wx.navigateTo({
            url: '../ycshipment/ycshipment?shipment_order_ids=' + JSON.stringify(shipment_order_ids),
        })
    },

    back() {
        wx.navigateBack()
    },

    toLogin() {
        wx.navigateTo({
            url: '../login',
        })
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
        this.unDeliveredShipmentOrdersButton = this.selectComponent('#unDeliveredShipmentOrdersButton')
        this.uncomposedShipmentOrdersButton = this.selectComponent('#uncomposedShipmentOrdersButton')
        const status = '0'
        this.selectShipmentOrders(status)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        const token = wx.getStorageSync('token')
        if (this.unDeliveredShipmentOrdersButton && token) {
            this.setData({
                isLoggen: true,
            })
            this.selectShipmentOrders("0")
        }
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
        if (this.data.lastShipmentOrders.length != 0 && this.data.lastShipmentOrders.length < this.data.pages_size) {
            return
        }
        this.getShipments(this.data.page, this.data.pages_size, this.data.status)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})