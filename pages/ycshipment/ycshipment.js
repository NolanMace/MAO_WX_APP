// pages/ycshipment/ycshipment.js
const app = getApp()
const baseUrl = app.globalData.apiBaseUrl
Page({
    /**
     * 页面的初始数据
     */
    data: {
        address: {
            name: '',
            phone: '',
            detail: ''
        },
        price: 0,
        priceStr: '0',
        products: []
    },

    getAddress() {
        const token = wx.getStorageSync('token')
        wx.request({
            url: baseUrl + app.globalData.getMerchantAddress,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: res => {
                if (res.statusCode == 200) {
                    // console.log(res.data)
                    this.setData({
                        address: res.data
                    })
                }
            }
        })
    },

    getShipment(ids) {
        const token = wx.getStorageSync('token')
        wx.request({
            url: baseUrl + app.globalData.getProductByShipmentOrderId,
            method: 'POST',
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: {
                json_int_arrays: ids
            },
            success: res => {
                if (res.statusCode == 200) {
                    var price = 0
                    var priceStr = "0"
                    var products = res.data
                    if (products != null) {
                        for (let i = 0; i < products.length; i++) {
                            price += parseFloat(products[i].product_price)
                            // console.log(price)
                        }
                        priceStr = price.toFixed(2)
                    }
                    this.setData({
                        price,
                        products,
                        priceStr
                    })
                }
            }
        })
    },

    decompose() {
        wx.showModal({
            title: '提示',
            content: `赏品分解后不可找回，请谨慎选择！(可获得${this.data.priceStr}仙豆,1仙豆抵扣1元)`,
            complete: (res) => {
                if (res.cancel) {

                }

                if (res.confirm) {
                    const url = baseUrl + app.globalData.decomposeOrderItems
                    //console.log(this.data.shipment_order_ids)
                    let token = wx.getStorageSync('token')
                    wx.request({
                        url: url,
                        method: 'POST',
                        header: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            json_int_arrays: this.data.shipment_order_ids
                        },
                        success: (res) => {
                            wx.showModal({
                                title: '发货成功',
                                content: '已发货',
                                complete: (res) => {
                                    if (res.cancel) {
                                        wx.switchTab({
                                            url: '../../pages/index3/index3',
                                        })
                                    }

                                    if (res.confirm) {
                                        wx.switchTab({
                                            url: '../../pages/index3/index3',
                                        })
                                    }
                                }
                            })
                        },
                        fail: res => {
                            wx.showToast({
                                title: '分解失败',
                                icon: 'none'
                            })
                        }
                    })
                }
            }
        })
    },

    back() {
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var shipment_order_ids = JSON.parse(options.shipment_order_ids)
        this.getShipment(shipment_order_ids)
        this.getAddress()
        const menuButtonBounding = app.globalData.menuButtonBounding
        this.setData({
            menuButtonBottom: menuButtonBounding.bottom,
            menuButtonTop: menuButtonBounding.top,
            shipment_order_ids
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