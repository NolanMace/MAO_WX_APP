// pages/result/result.js
const app = getApp()
const baseUrl = app.globalData.apiBaseUrl
var retryCount = 0;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        shipment_order_id: 0,
        maxRetryCount: 8
    },

    requestAsync(url, token) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                method: 'GET',
                header: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                success: res => resolve(res),
                fail: err => reject(err),
            });
        });
    },

    async getMyResults(url, token) {
        const maxRetryCount = this.data.maxRetryCount;
        for (let i = 0; i < maxRetryCount; i++) {
            try {
                const res = await this.requestAsync(url, token);

                if (res.statusCode !== 200 || res.data === null) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    continue;
                }

                const shipment_order_id = res.data[0].shipment_order_id;
                this.setData({
                    products: res.data,
                    shipment_order_id,
                });

                // Data received successfully, exit the loop
                return;
            } catch (error) {
                console.error(error);
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, 500));
                continue; // Retry the request    
            }
        }
        wx.showModal({
            title: '提示',
            content: '剩余数量不足！系统自动退款',
            complete: (res) => {
                if (res.cancel || res.confirm) {
                    wx.navigateBack();
                }
            },
        });
    },

    requestData(url, token) {
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: res => {
                if (res.statusCode != 200) {
                    console.log('错误')
                    return
                }
                if (res.data == null && retryCount >= 4) {
                    wx.showModal({
                        title: '提示',
                        content: '剩余数量不足！系统自动退款',
                        complete: (res) => {
                            if (res.cancel) {
                                wx.navigateBack()
                            }

                            if (res.confirm) {
                                wx.navigateBack()
                            }
                        }
                    })
                    return
                }
                if (res.data == null) {
                    retryCount++;
                    setTimeout(() => {
                        this.requestData(url, token)
                    }, 500);
                    return
                }
                var shipment_order_id = 0
                shipment_order_id = res.data[0].shipment_order_id
                this.setData({
                    products: res.data,
                    shipment_order_id
                });
            },
            fail: res => {
                if (retryCount < 4) {
                    retryCount++;
                    setTimeout(() => {
                        this.requestData(url, token)
                    }, 500);
                    return
                }
                console.log('准备返回')
                wx.showModal({
                    title: '提示',
                    content: '剩余数量不足！系统自动退款',
                    complete: (res) => {
                        if (res.cancel) {
                            wx.navigateBack()
                        }

                        if (res.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
            }
        })
    },

    back() {
        wx.navigateBack()
    },

    toMyShipment() {
        wx.switchTab({
            url: '../myshipmentorders/myshipmentorders',
        })
    },

    toYcShipment() {
        var shipment_order_ids = [this.data.shipment_order_id]
        wx.navigateTo({
            url: '../ycshipment/ycshipment?shipment_order_ids=' + JSON.stringify(shipment_order_ids),
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const token = wx.getStorageSync('token')
        const {
            out_trade_no,
            pay_type
        } = options
        if (pay_type == 'box') {
            const url = baseUrl + app.globalData.getUserBoxLotteryRecordsByOutTradeNo + `?out_trade_no=${out_trade_no}`
            this.getMyResults(url, token)
        } else if (pay_type == 'dq') {
            const url = baseUrl + app.globalData.getUserDqLotteryRecordsByOutTradeNo + `?out_trade_no=${out_trade_no}`
            this.getMyResults(url, token)
        } else if (pay_type == 'pool') {
            const url = baseUrl + app.globalData.getUserPoolLotteryRecordsByOutTradeNo + `?out_trade_no=${out_trade_no}`
            this.getMyResults(url, token)
        }

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