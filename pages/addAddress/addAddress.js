const app = getApp()
const app_id = app.globalData.appId
const baseUrl = app.globalData.apiBaseUrl
Page({
    data: {
        auto_id: null,
        app_id: app_id,
        user_id: 0,
        name: '',
        phone_num: '',
        regionList: ['广东省', '广州市', '海珠区'],
        detail_info: '',
    },

    back() {
        wx.navigateBack({
            delta: 1
        });
    },

    onInputName: function (e) {
        this.setData({
            name: e.detail.value
        });
    },

    onInputPhone: function (e) {
        this.setData({
            phone_num: e.detail.value
        });
    },

    regionChange: function (e) {
        this.setData({
            regionList: e.detail.value
        });
    },

    onInputdetailInfo: function (e) {
        this.setData({
            detail_info: e.detail.value
        });
    },

    toLogin() {
        wx.navigateTo({
            url: '../login',
        })
    },

    onSave: function () {
        const address = {
            auto_id: this.data.auto_id,
            app_id: this.data.app_id,
            user_id: this.data.user_id,
            name: this.data.name,
            phone_num: this.data.phone_num,
            region: this.data.regionList.join(","),
            detail_info: this.data.detail_info,
        }
        if (!address.name || !address.phone_num || !address.detail_info) {
            wx.showToast({
                title: '请填写完整信息',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        const token = wx.getStorageSync('token')
        let addressUrl = address.auto_id ? app.globalData.updateAddress : app.globalData.createAddress
        wx.request({
            url: baseUrl + addressUrl,
            method: 'POST',
            data: address,
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: (res) => {
                if (res.statusCode == 200) {
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 700
                    });
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 800);
                } else if (res.statusCode == 401) {
                    wx.removeStorageSync('token')
                    this.toLogin()
                } else {
                    wx.showToast({
                        title: '保存失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            fail: (res) => {
                if (res.statusCode == 401) {
                    wx.removeStorageSync('token')
                    this.toLogin()
                    return
                }
                wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        })
    },

    onLoad: function (options) {
        let auto_id = this.data.auto_id
        let name = this.data.name
        let phone_num = this.data.phone_num
        let regionList = this.data.regionList
        let detail_info = this.data.detail_info
        const menuButtonBounding = app.globalData.menuButtonBounding
        const address = options.address
        if (address) {
            const addressObj = JSON.parse(address)
            auto_id = addressObj.auto_id
            name = addressObj.name
            phone_num = addressObj.phone_num
            regionList = addressObj.region.split(",")
            detail_info = addressObj.detail_info
        }
        this.setData({
            menuButtonBottom: menuButtonBounding.bottom,
            menuButtonTop: menuButtonBounding.top,
            auto_id: auto_id,
            name: name,
            phone_num: phone_num,
            regionList: regionList,
            detail_info: detail_info
        })
    }
})