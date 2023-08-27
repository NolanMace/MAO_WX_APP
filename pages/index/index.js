// index.js
const app = getApp()
const app_id = app.globalData.appId
const baseUrl = app.globalData.apiBaseUrl
Page({
    data: {
        swipers: [],
        current: 0,
        navigate_items: [{
                category: '一番赏',
                active: true,
                url: 'https://yfsmax.oss-cn-hangzhou.aliyuncs.com/yfs.png',
                selectedUrl: 'https://yfsmax.oss-cn-hangzhou.aliyuncs.com/selectedyfs.png'
            },
            {
                category: '竞技赏',
                active: false,
                url: 'https://yfsmax.oss-cn-hangzhou.aliyuncs.com/jjs.png',
                selectedUrl: 'https://yfsmax.oss-cn-hangzhou.aliyuncs.com/selectedjjs.png',
            },
            {
                category: '无限赏',
                active: false,
                url: 'https://yfsmax.oss-cn-hangzhou.aliyuncs.com/wxs.png',
                selectedUrl: 'https://yfsmax.oss-cn-hangzhou.aliyuncs.com/selectedwxs.png'
            },
        ],
        category: '一番赏',
        labelStyle: 'yifan_label',
        boxes: [],
        pools: [],
        isBox: true,
        isPool: false,
        indicatorDots: false,
        autoplay: true,
        interval: 4000,
        duration: 500,
        circular: true,
        newUserPopup: '',
        newUserPopupDisplay: false,
        normalPopupDisplay: false,
        normalPopup: '',
        showJoinPage: false,
        joinClubImage: 'https://yfsmax.oss-cn-hangzhou.aliyuncs.com/wx.jpg',
        menuButtonBottom: 0,
        top_padding_background_color: 'transparent',
        navigation_top: 0,
        isFold: false,
        windowBars: [],
        windowBarsScrollX: true
    },

    monitorCurrent: function (e) {
        // console.log(e.detail.current)
        let current = e.detail.current;
        this.setData({
            current: current
        })
    },

    fold() {
        this.setData({
            isFold: !this.data.isFold
        })
    },

    getBoxRequest: function (type) {
        const GetAppBoxesByAppIdAndBoxType = app.globalData.GetAppBoxesByAppIdAndBoxType
        let box_type = type
        wx.request({
            url: baseUrl + GetAppBoxesByAppIdAndBoxType + `?app_id=${app_id}` + `&box_type=${box_type}`,
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200) {
                    if (res.data != null) {
                        // console.log(res.data)
                        res.data.forEach((box) => {
                            box.priceStr = box.box_price.toFixed(2);
                        })
                    }
                    this.setData({
                        isBox: true,
                        isPool: false,
                        boxes: res.data,
                    })
                } else {
                    wx.showToast({
                        title: '网络断开',
                        icon: 'error',
                        duration: 2000
                    })
                }
            },
            fail: (res) => {
                console.error('获取商品失败:', res.errMsg);
            }
        })
    },

    getPoolRequest: function () {
        const GetPoolsByAppId = app.globalData.GetPoolsByAppId
        wx.request({
            url: baseUrl + GetPoolsByAppId + `?app_id=${app_id}`,
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200) {
                    if (res.data != null) {
                        res.data.forEach((item) => {
                            item.priceStr = item.pool_price.toFixed(2);
                        })
                    }
                    this.setData({
                        isBox: false,
                        isPool: true,
                        pools: res.data,
                    })
                } else {
                    wx.showToast({
                        title: '网络断开',
                        icon: 'error',
                        duration: 2000
                    })
                    this.setData({
                        isBox: false,
                        isPool: true,
                        pools: [],
                    })
                }
            },
            fail: (res) => {
                console.error('获取商品失败:', res.errMsg);
            }
        })
    },

    getAppHomePopup() {
        var getAppHomePopupByAppId = app.globalData.getAppHomePopupByAppId
        wx.request({
            url: baseUrl + getAppHomePopupByAppId + `?app_id=${app_id}`,
            method: 'GET',
            success: res => {
                if (res.statusCode == 200) {
                    //console.log(res)
                    let newUserPopup = res.data.new_user_image_url
                    let normalPopup = res.data.normal_image_url
                    let display = res.data.display
                    let newUserPopupDisplay = false
                    let normalPopupDisplay = false
                    let token = wx.getStorageSync('token')
                    if (newUserPopup != '' && newUserPopup && !token && display) {
                        newUserPopupDisplay = true
                    } else if (display && normalPopup != '' && normalPopup) {
                        normalPopupDisplay = true
                    }
                    this.setData({
                        newUserPopupDisplay: newUserPopupDisplay,
                        normalPopupDisplay: normalPopupDisplay,
                        newUserPopup: newUserPopup,
                        normalPopup: normalPopup
                    })
                } else {
                    // wx.showToast({
                    //     title: '请求失败',
                    //     icon: 'error'
                    // })
                }
            },
            fail: res => {
                // wx.showToast({
                //     title: '请求失败',
                // })
            }
        })
    },

    getCustomerWx() {
        var getCustomerWx = app.globalData.getCustomerWx
        wx.request({
            url: baseUrl + getCustomerWx + `?app_id=${app_id}`,
            method: 'GET',
            success: res => {
                if (res.statusCode == 200) {
                    this.setData({
                        joinClubImage: res.data.wx_image
                    })
                }
            }
        })
    },

    getWindowBar() {
        var url = baseUrl + app.globalData.getWindowBarByAppId + `?app_id=${app_id}`
        wx.request({
            url: url,
            method: "GET",
            success: res => {
                //console.log(res.data)
                this.setData({
                    windowBars: res.data
                })
            },
            fail: res => {

            }
        })
    },

    toWindowBar(e) {
        var wname = e.currentTarget.dataset.window_name
        var top_url = e.currentTarget.dataset.top_url
        var cover_url = e.currentTarget.dataset.cover_url
        wx.navigateTo({
          url: "../winbar/winbar?window_name=" + wname + "&top_url=" + top_url + "&cover_url=" + cover_url,
        })
    },

    toLogin() {
        wx.navigateTo({
            url: '../login',
        })
    },

    hideAppHomePopup() {
        this.setData({
            newUserPopupDisplay: false,
            normalPopupDisplay: false,
            showJoinPage: false,
        })
    },

    receiveNewUserCoupon() {
        if (this.data.isNewUserCoupon) {
            this.hideAppHomePopup()
            wx.navigateTo({
                url: '../index3/mycoupons/mycoupons',
            })
        } else {
            this.toLogin()
            this.setData({
                isNewUserCoupon: true
            })
        }
    },

    getAppSwiperItems() {
        var url = baseUrl + app.globalData.getAppSwiperItemsByAppId + `?app_id=${app_id}`
        wx.request({
            url: url,
            method: 'GET',
            success: res => {
                if (res.statusCode == 200) {
                    this.setData({
                        swipers: res.data
                    })
                } else {
                    console.log(res)
                }
            },
            fail: res => {
                console.log(res)
            }
        })
    },

    joinClub() {
        this.setData({
            showJoinPage: true,
        })
    },

    onPageScroll: function (e) {
        if (e.scrollTop > this.data.navigation_top - this.data.menuButtonBottom) {
            this.setData({
                top_padding_background_color: '#e5b18b'
            })
        } else {
            this.setData({
                top_padding_background_color: 'transparent'
            })
        }
    },

    onLoad: function () {
        const tabBarHeight = app.globalData.tabBarHeight
        const bottom = app.globalData.menuButtonBounding.bottom
        const top = app.globalData.menuButtonBounding.top
        this.setData({
            menuButtonBottom: bottom,
            menuButtonTop: top,
            tabBarHeight: tabBarHeight
        })
        this.getBoxRequest('box')
        this.getAppHomePopup()
        this.getAppSwiperItems()
        this.getWindowBar()
    },

    onReady() {
        const query = wx.createSelectorQuery();
        query.select('#navigation').boundingClientRect((rect) => {
            this.setData({
                navigation_top: rect.top,
            })
        }).exec();
    },

    onShow() {
        if (typeof this.getTabBar === "function" && this.getTabBar()) {
            this.getTabBar().setData({
                currentIndex: 0
            });
        }
    },

    onUnload: function () {

    },

    onHide() {

    },

    onShareAppMessage(res) {

    },

    switchSeries: function (e) {
        let category = e.currentTarget.dataset.category
        var items = this.data.navigate_items
        items.forEach((item) => {
            if (item.category == category) {
                item.active = true
            } else {
                item.active = false
            }
        })
        if (category == "一番赏") {
            this.setData({
                boxes: [],
                labelStyle: "yifan_label",
                category: category,
                navigate_items: items
            })
            this.getBoxRequest('box')
        } else if (category == "竞技赏") {
            this.setData({
                boxes: [],
                labelStyle: "dq_label",
                category: category,
                navigate_items: items
            })
            this.getBoxRequest('dq')
        } else {
            this.setData({
                pools: [],
                labelStyle: "wuxian_label",
                category: category,
                navigate_items: items
            })
            this.getPoolRequest()
        }
    },

    toChouShang: function (e) {
        const boxId = e.currentTarget.dataset.box_id;
        const box = this.data.boxes.find((item) => {
            return item.box_id == boxId
        })
        const boxNumber = 0
        wx.navigateTo({
            url: `../choushang/choushang?box_id=${boxId}&box_number=${boxNumber}&share_img=${box.share_img}&share_title=${box.share_title}`,
        })
    },

    toWXS: function (e) {
        var pool_id = e.currentTarget.dataset.pool_id
        var pool = this.data.pools.find((item) => {
            return item.pool_id == pool_id
        })
        wx.navigateTo({
            url: `../wuxianshangpage/wuxianshangpage?pool_id=${pool_id}&share_img=${pool.share_img}&share_title=${pool.share_title}`,
        })
    },

})