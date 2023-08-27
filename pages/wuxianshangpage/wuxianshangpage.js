// pages/wuxianshangpage/wuxianshangpage.js
const app = getApp()
const app_id = app.globalData.appId
const baseUrl = app.globalData.apiBaseUrl
const getPoolAndPoolItemSetsByPoolIdAndAppId = app.globalData.getPoolAndPoolItemSetsByPoolIdAndAppId

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showedAwardList: [],
        awardDetail: [],
        recordsList: [],
        records: [],
        show_goods_page: true,
        show_record_page: false,
        awardLevelItemStatus: "awardlevel-item-collapse",
        visible: false,
        pool_id: 0,
        menuButtonBottom: 0,
        top_padding_background_color: 'transparent',
        selectedCoupon: false,
        discount_value_str: '',
        useXbean: false,
        xbean: 0,
        agree: false,
        isToMyAddress: false,
        address: {},
        isAddressEmpty: true,
        payDisabled: false,
        fromPool: true,
        usingAmount: 0
    },

    toRulesPage() {
        wx.navigateTo({
            url: '../rulesPage/rulesPage?para=rules',
        })
    },

    toShipmentRules() {
        wx.navigateTo({
            url: '../rulesPage/rulesPage?para=shipmentRules',
        })
    },

    selectPreview() {
        this.setData({
            show_goods_page: true,
            show_record_page: false,
        })
    },

    selectRecord() {
        const pool_id = this.data.pool.pool_id
        const getUserPoolLotteryRecordsByPoolIdAndAppId = app.globalData.getUserPoolLotteryRecordsByPoolIdAndAppId + `?pool_id=${pool_id}&app_id=${app_id}`
        wx.request({
            url: baseUrl + getUserPoolLotteryRecordsByPoolIdAndAppId,
            method: "GET",
            success: (res) => {
                const records = res.data
                var result = []
                if (records != null) {
                    records.sort((a, b) => {
                        let levelOrder = ["SP", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                        let aIndex = levelOrder.indexOf(a.product_level);
                        let bIndex = levelOrder.indexOf(b.product_level);
                        if (aIndex !== bIndex) {
                            return aIndex - bIndex; // ascending order by product level
                        } else {
                            var dateA = new Date(a.created_at);
                            var dateB = new Date(b.created_at);
                            return dateB - dateA; // descending order by timestamp
                        }
                    });
                    records.forEach(element => {
                        const date = new Date(element.created_at);
                        var formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                        element.date = formattedDate
                    });
                    for (let i = 0; i < records.length; i++) {
                        let record = records[i]
                        let index = result.findIndex((el) => el.product_level === record.product_level);
                        if (index === -1) {
                            result.push({
                                product_level: record.product_level,
                                expanded: false,
                                usersList: [{
                                    avatar_url: record.avatar_url,
                                    nickname: record.nickname,
                                    date: record.date,
                                    visible: "",
                                    width: "",
                                    product_name: record.product_name,
                                }]
                            })
                        } else {
                            result[index].usersList.push({
                                avatar_url: record.avatar_url,
                                nickname: record.nickname,
                                date: record.date,
                                visible: "hidden",
                                width: "",
                                product_name: record.product_name,
                            })
                        }
                    }
                }
                this.setData({
                    recordsList: result
                })
            },
            fail: (res) => {
                console.log(res)
            }
        })
        this.setData({
            show_goods_page: false,
            show_record_page: true,
        })
    },

    toUnfold(e) {
        let index = e.currentTarget.dataset.buttonsequence
        const recordsList = this.data.recordsList
        const userlist = recordsList[index].usersList
        if (userlist) {
            for (let i = 1; i < userlist.length; i++) {
                userlist[i].visible = ""
                userlist[i].width = "width:97%"
            }
        }
        recordsList[index].expanded = true
        this.setData({
            recordsList: recordsList,
            awardLevelItemStatus: "awardlevel-item-unfold"
        })
    },

    toCollapse(e) {
        let index = e.currentTarget.dataset.buttonsequence
        const recordsList = this.data.recordsList
        const userlist = recordsList[index].usersList
        if (userlist) {
            for (let i = 1; i < userlist.length; i++) {
                userlist[i].visible = "hidden"
            }
        }
        recordsList[index].expanded = false
        this.setData({
            recordsList: recordsList,
            awardLevelItemStatus: "awardlevel-item-collapse"
        })
    },

    showPaymentPane(e) {
        let token = wx.getStorageSync('token')
        if (token == null) {
            this.toLogin()
            return
        } else {
            let lottery_count = parseInt(e.currentTarget.dataset.lottery_count)
            this.computePaymentAmount(lottery_count)
            this.custompopup.changeRange();
        }
    },

    computePaymentAmount(lotteryCount) {
        const useXbean = this.data.useXbean
        const xbean = this.data.xbean
        let selectedCoupon = this.data.selectedCoupon
        const lottery_count = lotteryCount
        const coupon = this.data.coupon
        var payment_amount = lottery_count * this.data.pool.pool_price
        var payment_amount_after_discount = payment_amount
        var payment_amount_after_xbean = payment_amount
        if (useXbean) {
            payment_amount_after_discount = xbean > payment_amount ? 0 : payment_amount - xbean
            payment_amount_after_xbean = payment_amount_after_discount
            if (payment_amount_after_xbean < this.data.usingAmount) {
                selectedCoupon = false
                this.setData({
                    selectedCoupon,
                    discount_value_str: '',
                    coupon: {},
                    usingAmount: 0
                })
            }
        }
        if (selectedCoupon && coupon != null) {
            if (coupon.discount_type) {
                var discount_value = parseFloat(coupon.discount_value) / 10
                payment_amount_after_discount = payment_amount_after_discount * discount_value
            } else {
                var discount_value = parseFloat(coupon.discount_value)
                payment_amount_after_discount = payment_amount_after_discount - discount_value < 0 ? 0 : payment_amount_after_discount - discount_value
            }
        }
        this.setData({
            lottery_count: lottery_count,
            payment_amount: payment_amount,
            payment_amount_str: payment_amount.toFixed(2),
            payment_amount_after_discount,
            payment_amount_after_xbean,
            payment_amount_after_discount_str: payment_amount_after_discount.toFixed(2),
        })
    },

    selectCoupon(coupon) {
        let discount_value_str = coupon.description
        var isCouponChanged = JSON.stringify(coupon) !== JSON.stringify(this.data.coupon)
        // console.log(JSON.stringify(coupon))
        // console.log(JSON.stringify(this.data.coupon))
        this.setData({
            coupon: isCouponChanged ? coupon : {},
            discount_value_str: isCouponChanged ? discount_value_str : '',
            selectedCoupon: isCouponChanged,
            usingAmount: isCouponChanged ? this.data.payment_amount_after_xbean : 0
        })
        this.computePaymentAmount(this.data.lottery_count)
    },

    toMyCoupons() {
        const usingAmount = this.data.payment_amount_after_xbean
        wx.navigateTo({
            url: `../useCoupons/useCoupon?usingAmount=${usingAmount}`,
        })
    },

    toLogin() {
        wx.navigateTo({
            url: '../login',
        })
    },

    getUserXbean(callback) {
        const token = wx.getStorageSync('token')
        if (token == null) {
            return
        }
        const url = baseUrl + app.globalData.getUserXbeanByAppIdAndPhone
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: res => {
                if (res.statusCode == 200) {
                    this.setData({
                        xbean: res.data.xbean,
                    })
                    if (typeof callback === 'function') {
                        callback();
                    }
                } else {
                    wx.showToast({
                        title: '请登录',
                        icon: 'none'
                    })
                    wx.removeStorageSync('token')
                    this.setData({
                        xbean: 0,
                        useXbean: false
                    })
                }
            },
            fail: res => {
                wx.showToast({
                    title: '请登录',
                    icon: 'none'
                })
                wx.removeStorageSync('token')
                this.setData({
                    xbean: 0,
                    useXbean: false
                })
            }
        })
    },

    toAgreement() {
        wx.navigateTo({
            url: '../index3/useragreement/useragreement',
        })
    },

    agree() {
        if (this.data.agree) {
            this.setData({
                agree: false
            })
            wx.removeStorageSync('agree')
            return
        }
        this.setData({
            agree: true
        })
        wx.setStorageSync('agree', true)
    },

    toUseXbean() {
        this.getUserXbean(
            () => {
                if (this.data.useXbean) {
                    this.setData({
                        useXbean: false
                    })
                    this.computePaymentAmount(this.data.lottery_count)
                    return
                }
                const token = wx.getStorageSync('token')
                if (token == null) {
                    this.toLogin()
                    return
                }
                if (this.data.xbean == 0) {
                    wx.showToast({
                        title: '仙豆为零',
                        icon: 'none'
                    })
                    return
                }
                this.setData({
                    useXbean: true
                })
                this.computePaymentAmount(this.data.lottery_count)
            }
        )
    },

    selectMyAddress() {
        this.setData({
            isToMyAddress: true
        })
        wx.navigateTo({
            url: '../myaddress/myaddress',
        })
    },

    updateAddress: function (data) {
        if (!this.isObjectEmpty(data)) {
            this.setData({
                address: data,
                isAddressEmpty: false,
            });
            wx.setStorageSync('address', data)
        }
    },

    isObjectEmpty: function (obj) {
        return Object.keys(obj).length === 0;
    },

    toPay() {
        if (this.data.payDisabled) {
            return
        }
        if (this.isObjectEmpty(this.data.address)) {
            wx.showToast({
                title: '请填写收获地址',
                icon: 'none'
            })
            return
        }
        if (!this.data.agree) {
            wx.showToast({
                title: '请同意用户协议',
                icon: 'none'
            })
            return
        }
        this.setData({
            payDisabled: true
        })
        let token = wx.getStorageSync('token')
        let payment_amount = this.data.payment_amount_after_discount
        let total_amount = this.data.payment_amount
        let poolLottery = app.globalData.WxLottery
        const user_coupon_id = this.data.selectedCoupon ? this.data.coupon.user_coupon_id : 0
        const pay_type = app.globalData.pay_type_pool
        let
            addressStr = this.data.address.name + ',' + this.data.address.phone_num + ',' + this.data.address.region + ',' + this.data.address.detail_info
        wx.login({
            success: (res) => {
                wx.request({
                    url: baseUrl + poolLottery,
                    header: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    data: {
                        pool_id: this.data.pool.pool_id,
                        lottery_count: this.data.lottery_count,
                        app_id: app_id,
                        payment_amount: payment_amount,
                        total_amount: total_amount,
                        user_coupon_id: user_coupon_id,
                        pay_type: pay_type,
                        xbean: this.data.useXbean ? this.data.xbean : 0,
                        shipment_address: addressStr,
                        code: res.code
                    },
                    success: res => {
                        if (res.statusCode == 401) {
                            wx.removeStorageSync('token')
                            this.toLogin()
                            this.setData({
                                payDisabled: false
                            })
                            return
                        }
                        if (res.statusCode != 200) {
                            //console.log(res)
                            wx.showToast({
                                title: '网络错误!',
                                icon: 'none',
                            });
                            this.setData({
                                payDisabled: false
                            })
                            return
                        }
                        if (payment_amount > 0) {
                            const out_trade_no = res.data.data.out_trade_no
                            wx.requestPayment({
                                timeStamp: res.data.data.timeStamp,
                                nonceStr: res.data.data.nonceStr,
                                package: res.data.data.package,
                                signType: res.data.data.signType,
                                paySign: res.data.data.paySign,
                                success: res => {
                                    this.custompopup.hideModal()
                                    wx.navigateTo({
                                        url: `../result/result?out_trade_no=${out_trade_no}&pay_type=${pay_type}`,
                                    })
                                    this.setData({
                                        payDisabled: false
                                    })
                                },
                                fail: (res) => {
                                    wx.showToast({
                                        title: '支付失败',
                                        icon: 'none'
                                    })
                                    this.setData({
                                        payDisabled: false
                                    })
                                }
                            })
                            return
                        }
                        this.custompopup.hideModal()
                        const out_trade_no = res.data.out_trade_no
                        wx.navigateTo({
                            url: `../result/result?out_trade_no=${out_trade_no}&pay_type=${pay_type}`,
                        })
                        this.setData({
                            payDisabled: false
                        })
                    },
                    fail: res => {
                        // console.error(res.errMsg)
                        // console.log(res)
                        if (res.statusCode == 401) {
                            wx.removeStorageSync('token')
                            this.toLogin()
                            this.setData({
                                payDisabled: false
                            })
                        } else {
                            wx.showToast({
                                title: '网络错误',
                                icon: 'error',
                                duration: '1600'
                            })
                            this.setData({
                                payDisabled: false
                            })
                        }
                    }
                })
            },
        })
    },

    toDetail: function (e) {
        const itemid = e.currentTarget.dataset.itemid;
        const index = this.data.productData.findIndex(item => item.id == itemid)
        const awardDetail = []
        for (let i = 0; i < this.data.productData.length; i++) {
            awardDetail.push(this.data.productData[(i + index) % (this.data.productData.length)])
        }
        //console.log(awardDetail)
        this.setData({
            awardDetail: awardDetail
        })
        this.viewAwardDetail.showViewAwardDetail()
    },

    updatePool(poolId) {
        wx.showLoading({
            title: '请稍等',
        })
        wx.request({
            url: baseUrl + getPoolAndPoolItemSetsByPoolIdAndAppId + `?pool_id=${poolId}&app_id=${app_id}`,
            method: 'GET',
            success: res => {
                if (res.statusCode == 200) {
                    let result = []
                    let pool = res.data
                    let productData = res.data.pool_item_sets
                    productData.sort((a, b) => {
                        let levelOrder = ["SP", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                        let aIndex = levelOrder.indexOf(a.product_level);
                        let bIndex = levelOrder.indexOf(b.product_level);
                        return aIndex - bIndex;
                    });
                    //console.log(productData)
                    for (let i = 0; i < productData.length; i++) {
                        let item = productData[i];
                        productData[i].probability_str = (productData[i].probability * 100).toFixed(3)
                        item.id = i
                        // 判断当前的 pool_level 是否已存在于 result 中
                        let index = result.findIndex((el) => el.product_level === item.product_level);

                        if (index === -1) {
                            // 如果不存在，则创建新的对象
                            let newItem = {
                                product_level: item.product_level,
                                probability: item.probability,
                                probability_str: (100 * item.probability).toFixed(3),
                                products: [{
                                    id: item.id,
                                    product_name: item.product_name,
                                    product_price: item.product_price.toFixed(2),
                                    product_image_url: item.product_image_url,
                                    probability: item.probability,
                                }]
                            };
                            result.push(newItem);
                        } else {
                            // 如果已存在，则将当前产品信息添加到该项的 products 数组中，并更新 probability 的值
                            result[index].products.push({
                                id: item.id,
                                product_name: item.product_name,
                                product_image_url: item.product_image_url,
                                product_price: item.product_price.toFixed(2),
                                probability: item.probability,
                            });
                            result[index].probability += item.probability;
                            result[index].probability_str = (100 * result[index].probability).toFixed(3)
                        }
                    }
                    this.setData({
                        productData,
                        result,
                        pool
                    })
                }
                wx.hideLoading()
            },
            fail: res => {
                console.error(res.errMsg)
                wx.hideLoading()
            }
        })
    },

    onPageScroll: function (e) {
        if (e.scrollTop > this.data.navigation_top - this.data.menuButtonBottom) {
            this.setData({
                top_padding_background_color: '#040406'
            })
        } else {
            this.setData({
                top_padding_background_color: 'transparent'
            })
        }
    },

    back() {
        const pages = getCurrentPages();
        if (pages.length >= 2) {
            wx.navigateBack()
        } else {
            wx.switchTab({
                url: '../index/index'
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            pool_id,
            share_title,
            share_img,
            share_date,
        } = options
        const bottom = app.globalData.menuButtonBounding.bottom
        const agree = wx.getStorageSync('agree')
        const address = wx.getStorageSync('address')
        //console.log(address)
        this.setData({
            share_title,
            share_img,
            pool_id,
            agree,
            address: address == null ? {} : address,
            isAddressEmpty: address == "",
            menuButtonBottom: bottom
        })
        var shareDate = share_date == null ? new Date().getTime() : parseInt(share_date)
        var timeDiff = Math.abs(new Date().getTime() - shareDate);
        var expirationTime = app.globalData.expiration_time
        var isGreaterThanOneDay = timeDiff > (expirationTime * 60 * 1000);
        if (isGreaterThanOneDay) {
            wx.showModal({
                title: '分享链接已过期',
                content: '',
                complete: (res) => {
                    if (res.cancel) {
                        wx.switchTab({
                            url: '../index/index'
                        });
                    }

                    if (res.confirm) {
                        wx.switchTab({
                            url: '../index/index'
                        });
                    }
                }
            })
        } else {
            this.updatePool(pool_id)
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.custompopup = this.selectComponent("#custompopup");
        this.viewAwardDetail = this.selectComponent("#viewAwardDetail")
        const query = wx.createSelectorQuery();
        query.select('.button-container').boundingClientRect((rect) => {
            this.setData({
                navigation_top: rect.top,
            })
        }).exec();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getUserXbean()
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
    onShareAppMessage(res) {
        var shareDate = new Date().getTime().toString();
        var path = "/pages/wuxianshangpage/wuxianshangpage?pool_id=" + this.data.pool_id + "&share_img=" + this.data.share_img + "&share_title=" + this.data.share_title + "&share_date=" + shareDate
        return {
            title: this.data.share_title,
            path: path,
            imageUrl: this.data.share_img,
        }
    },
})