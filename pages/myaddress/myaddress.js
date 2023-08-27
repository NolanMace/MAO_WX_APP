// pages/myaddress/myaddress.js
const app = getApp()
const baseUrl = app.globalData.apiBaseUrl
Page({
    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        defaultAddress: {},
        hasDefaultAddress: false,
        isLoggen: true,
    },

    setAddressAsDefault(e) {
        let index = e.currentTarget.dataset.index
        const addressList = this.data.addressList
        wx.removeStorageSync('defaultAddress')
        wx.setStorageSync('defaultAddress', addressList[index])
        wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 2000
        })
        this.setData({
            defaultAddress: addressList[index],
            hasDefaultAddress: true,
        })
    },

    addNewAddress() {
        wx.navigateTo({
            url: '../addAddress/addAddress',
        })
    },

    updateAddress(e) {
        let index = e.currentTarget.dataset.index
        const addressList = this.data.addressList
        wx.navigateTo({
            url: '../addAddress/addAddress?address=' + JSON.stringify(addressList[index]),
        })
    },

    deleteAddress(e) {
        let index = e.currentTarget.dataset.index
        const address = this.data.addressList[index]
        const defaultAddress = this.data.defaultAddress
        if (defaultAddress && defaultAddress.auto_id == address.auto_id) {
            wx.removeStorageSync('defaultAddress')
            this.setData({
                defaultAddress: {},
                hasDefaultAddress: false
            })
        }
        const deleteAddressUrl = app.globalData.deleteAddress
        const token = wx.getStorageSync('token')
        wx.request({
            url: baseUrl + deleteAddressUrl,
            method: 'DELETE',
            data: address,
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: (res) => {
                console.log(res)
                if (res.statusCode == 200) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    })
                    this.getMyAddresses()
                } else {
                    wx.removeStorageSync('token')
                    this.setData({
                        isLoggen: false
                    })
                }
            },
            fail: (res) => {
                wx.removeStorageSync('token')
                this.setData({
                    isLoggen: false
                })
            }
        })
    },

    selectAddress(e) {
        const address = this.data.addressList[e.currentTarget.dataset.index]
        // 获取页面栈
        const pages = getCurrentPages();
        // 获取上一个页面的实例
        const prevPage = pages[pages.length - 2];
        // 调用上一个页面的函数，将数据传递给上一个页面
        if (prevPage && prevPage.updateAddress) {//选择地址
            prevPage.updateAddress(address);
            // 返回上一个页面
            wx.navigateBack({
                delta: 1
            });
        } else if (prevPage && prevPage.changeAddress) {//修改订单地址
            prevPage.changeAddress(address);
            // 返回上一个页面
            wx.navigateBack({
                delta: 1
            });
        }
    },

    back() {
        wx.navigateBack({
            delta: 1
        });
    },

    toLogin() {
        wx.navigateTo({
            url: '../login',
        })
    },

    getMyAddresses() {
        const getAddressesByUserId = app.globalData.getAddressesByUserId
        const token = wx.getStorageSync('token')
        if (!token) {
            this.setData({
                isLoggen: false
            })
            return
        }
        wx.request({
            url: baseUrl + getAddressesByUserId,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: (res) => {
                console.log(res)
                if (res.statusCode == 200) {
                    this.setData({
                        addressList: res.data
                    })
                } else {
                    wx.removeStorageSync('token')
                    this.setData({
                        isLoggen: false
                    })
                }
            },
            fail: (res) => {
                wx.removeStorageSync('token')
                this.setData({
                    isLoggen: false
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let defaultAddress = wx.getStorageSync('defaultAddress')
        const menuButtonBounding = app.globalData.menuButtonBounding
        this.setData({
            menuButtonBottom: menuButtonBounding.bottom,
            menuButtonTop: menuButtonBounding.top,
            defaultAddress: defaultAddress,
            hasDefaultAddress: Object.keys(defaultAddress).length != 0
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.myaddresslabel = this.selectComponent('#myaddresslabel')
        this.myaddresslabel.select()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let defaultAddress = wx.getStorageSync('defaultAddress')
        if (defaultAddress) {
            this.setData({
                defaultAddress: defaultAddress,
                hasDefaultAddress: true
            })
        }
        const token = wx.getStorageSync('token')
        if (token) {
            this.setData({
                isLoggen: true,
            })
        }
        this.getMyAddresses()
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