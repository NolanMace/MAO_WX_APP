// pages/choushang/choushang.js
const app = getApp()
const app_id = app.globalData.appId
const baseUrl = app.globalData.apiBaseUrl
Page({
    /**
     * 页面的初始数据
     */
    data: {
        box_instance: {},
        records: [],
        awardDetail: [],
        show_goods_page: true,
        show_record_page: false,
        visible: false,
        box_number: 0,
        box_tpye: "",
        menuButtonBottom: 0,
        navigation_top: 0,
        top_padding_background_color: 'black',
        selectedCoupon: false,
        discount_value_str: '',
        useXbean: false,
        xbean: 0,
        agree: false,
        isToMyAddress: false,
        address: {},
        isAddressEmpty: true,
        payDisabled: false,
        fromBox: true,
        usingAmount: 0,
    },

    toLogin() {
        wx.navigateTo({
            url: '../login',
        })
    },

    selectPreview() {
        this.updateBox(this.data.box_number)
        this.setData({
            show_goods_page: true,
            show_record_page: false,
        })
    },

    containsNumber(str) {
        var regex = /\d/;
        return regex.test(str);
    },

    selectRecord() {
        var boxNumber = this.data.box_number
        this.updateRecords(boxNumber)
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

    toDetail: function (e) {
        var fromBox = this.data.box_instance.box_type == "box"
        const index = e.currentTarget.dataset.index;
        const goods_data = this.data.box_instance.box_item_counts
        const awardDetail = []
        for (let i = 0; i < goods_data.length; i++) {
            let targetIndex = (i + index) % (goods_data.length)
            awardDetail.push(goods_data[targetIndex])
        }
        this.setData({
            awardDetail: awardDetail,
            fromBox
        })
        this.viewAwardDetail.showViewAwardDetail()
    },

    showPaymentPane(e) {
        let token = wx.getStorageSync('token')
        if (token == null) {
            this.toLogin()
            return
        } else {
            let lottery_count = parseInt(e.currentTarget.dataset.lottery_count)
            if (lottery_count > this.data.box_instance.left_num || this.data.box_instance.left_num == 0) {
                wx.showToast({
                    title: '剩余数量不足',
                    icon: 'none'
                })
                return
            }
            lottery_count = lottery_count == 0 ? this.data.box_instance.left_num : lottery_count
            this.computePaymentAmount(lottery_count)
            this.custompopup.changeRange();
        }
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

    // tPayTest() {
    //     const token = wx.getStorageSync('token')
    //     const payment_amount = this.data.payment_amount
    //     const payment_amount_after_discount = this.data.payment_amount_after_discount
    //     const LotteryUrl = this.data.box.box_type == "box" ? app.globalData.WxLottery :
    //         app.globalData.dqLottery
    //     const user_coupon_id = this.data.selectedCoupon ? this.data.coupon.user_coupon_id : 0
    //     const pay_type = this.data.box.box_type == "box" ? app.globalData.pay_type_box : app.globalData.pay_type_dq
    //     wx.request({
    //         url: 'http://localhost:8080/api/TestBoxLottery',
    //         method: 'POST',
    //         header: {
    //             'Authorization': 'Bearer ' + token,
    //             'Content-Type': 'application/json'
    //         },
    //         data: {
    //             box_id: this.data.box.box_id,
    //             box_number: this.data.box_instance.box_number,
    //             lottery_count: this.data.lottery_count,
    //             app_id: app_id,
    //             payment_amount: payment_amount_after_discount,
    //             total_amount: payment_amount,
    //             user_coupon_id: user_coupon_id,
    //             pay_type: pay_type,
    //         },
    //         success: res => {
    //             console.log(res)
    //         },
    //         fail: res => {
    //             console.log(res)
    //         }
    //     })
    // },

    computePaymentAmount(lotteryCount) {
        const useXbean = this.data.useXbean
        const xbean = this.data.xbean
        var selectedCoupon = this.data.selectedCoupon
        const lottery_count = lotteryCount
        const coupon = this.data.coupon
        var payment_amount = lottery_count * this.data.box_instance.box_price
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
                    useXbean: true,
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
        const token = wx.getStorageSync('token')
        const payment_amount = this.data.payment_amount
        const payment_amount_after_discount = this.data.payment_amount_after_discount
        const LotteryUrl = app.globalData.WxLottery
        const user_coupon_id = this.data.selectedCoupon ? this.data.coupon.user_coupon_id : 0
        const pay_type = this.data.box_instance.box_type == "box" ? app.globalData.pay_type_box : app.globalData.pay_type_dq
        let
            addressStr = this.data.address.name + ',' + this.data.address.phone_num + ',' + this.data.address.region + ',' + this.data.address.detail_info
        // let data = {
        //     box_id: this.data.box_instance.box_id,
        //     box_number: this.data.box_instance.box_number,
        //     lottery_count: this.data.lottery_count,
        //     app_id: app_id,
        //     payment_amount: payment_amount_after_discount,
        //     total_amount: payment_amount,
        //     user_coupon_id: user_coupon_id,
        //     pay_type: pay_type,
        //     xbean: this.data.useXbean ? this.data.xbean : 0,
        //     shipment_address: addressStr
        // }
        // console.log(data)

        wx.login({
            success: (res) => {
                wx.request({
                    url: baseUrl + LotteryUrl,
                    header: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    data: {
                        box_id: this.data.box_instance.box_id,
                        box_number: this.data.box_instance.box_number,
                        lottery_count: this.data.lottery_count,
                        app_id: app_id,
                        payment_amount: payment_amount_after_discount,
                        total_amount: payment_amount,
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
                                title: '剩余数量不足!',
                                icon: 'none',
                                duration: 2000
                            });
                            this.setData({
                                payDisabled: false
                            })
                            setTimeout(() => {
                                this.custompopup.hideModal()
                                this.refresh()
                            }, 2000);     
                            return
                        }
                        if (payment_amount_after_discount > 0) {
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
                                    //console.log(res)
                                    wx.showToast({
                                        title: '取消支付',
                                        icon: 'none'
                                    })
                                    this.setData({
                                        payDisabled: false
                                    })
                                }
                            })
                            return
                        }
                        const out_trade_no = res.data.out_trade_no
                        this.custompopup.hideModal()
                        wx.navigateTo({
                            url: `../result/result?out_trade_no=${out_trade_no}&pay_type=${pay_type}`,
                        })
                        this.setData({
                            payDisabled: false
                        })
                    },
                    fail: res => {
                        if (res.statusCode == 401) {
                            wx.removeStorageSync('token')
                            this.toLogin()
                            this.setData({
                                payDisabled: false
                            })
                        } else {
                            //console.log(res)
                            wx.showToast({
                                title: '剩余数量不足!',
                                icon: 'none',
                                duration: 2000
                            });
                            this.setData({
                                payDisabled: false
                            })
                            setTimeout(() => {
                                this.custompopup.hideModal()
                                this.refresh()
                            }, 2000);     
                            return
                        }
                    }
                })
            },
        })
    },

    toChangeBoxPage() {
        const box_id = this.data.box_instance.box_id
        const boxNumber = this.data.box_number
        wx.navigateTo({
            url: `../changeBox/changeBox?boxId=${box_id}&boxNumber=${boxNumber}`,
        })
    },

    changeBoxNumber(boxNumber) {
        this.setData({
            box_number: boxNumber
        })
    },

    updateRecords(boxNumber) {
        wx.showLoading({
            title: '加载中...',
        })
        const requestUrl = this.data.box_instance.box_type == "box" ? app.globalData.getUserBoxLotteryRecordsByBoxIdAndBoxNumberAndAppId : app.globalData.getUserDqLotteryRecordsByBoxIdAndBoxNumberAndAppId
        const boxId = this.data.box_instance.box_id
        wx.request({
            url: baseUrl + requestUrl + `?box_id=${boxId}&box_number=${boxNumber}&app_id=${app_id}`,
            method: 'GET',
            success: res => {
                wx.hideLoading()
                if (res.statusCode != 200) {
                    wx.showToast({
                        title: '网络错误',
                        icon: 'none'
                    })
                    return
                }
                const records = res.data
                if (records != null) {
                    records.sort(function (a, b) {
                        if (a.product_level === "last" && b.product_level !== "last") {
                            return -1; // a排在前面
                        } else if (a.product_level !== "last" && b.product_level === "last") {
                            return 1; // b排在前面
                        } else if (a.product_level === "first" && b.product_level !== "first") {
                            return -1; // a排在前面
                        } else if (a.product_level !== "first" && b.product_level === "first") {
                            return 1; // b排在前面
                        } else if (a.product_level === "gift" && b.product_level !== "gift") {
                            return -1; // a排在前面
                        } else if (a.product_level !== "gift" && b.product_level === "gift") {
                            return 1; // b排在前面
                        } else {
                            var dateA = new Date(a.created_at);
                            var dateB = new Date(b.created_at);
                            return dateB - dateA; // 按照created_at时间排序
                        }
                    });
                    records.forEach(element => {
                        element.containsNumber = this.containsNumber(element.product_level)
                        const date = new Date(element.created_at);
                        var formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                        element.date = formattedDate
                    });
                }
                //console.log(res.data)
                this.setData({
                    records: records,
                    show_goods_page: false,
                    show_record_page: true,
                })
            },
            fail: res => {
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
            }
        })
    },

    updateBox(boxNumber) {
        wx.showLoading({
            title: '加载中...',
        })
        const getBoxItems = app.globalData.getBoxItems
        wx.request({
            url: baseUrl + getBoxItems + `?box_id=${this.data.box_id}&box_number=${boxNumber}&app_id=${app_id}`,
            method: 'GET',
            success: res => {
                wx.hideLoading()
                if (res.statusCode != 200) {
                    wx.showToast({
                        title: '网络错误',
                        icon: 'error',
                        duration: 2000
                    })
                    return
                }
                if (res.data != null && res.data.box_item_counts != null) {
                    res.data.box_item_counts.forEach((item) => {
                        if (item.product_level == "last" || item.product_level == "first") {
                            item.isNormal = false
                        } else {
                            item.isNormal = true
                        }
                        if (res.data.box_type == "box") {
                            item.showDetail = true
                        } else {
                            item.showDetail = false
                        }
                        var odds = 100 * item.product_left_count / res.data.left_num
                        item.odds = odds.toFixed(2)
                    })
                }
                this.setData({
                    box_instance: res.data,
                    box_number: res.data.box_number,
                    showDetail: res.data.box_type == "box"
                })
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '网络错误',
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    },

    async refresh() {
        this.getUserXbean()
        await this.updateBox(this.data.box_number)
        if (this.data.show_goods_page) {
            return
        }
        await this.updateRecords(this.data.box_number)
    },

    getBox(box_id) {
        wx.request({
            url: baseUrl + app.globalData.getBox + `?box_id=${this.data.box_id}`,
            method: 'GET',
            success: res => {
                if (res.statusCode == 200) {
                    this.setData({
                        box: res.data
                    })
                } else {
                    wx.showToast({
                        title: '网络错误',
                        icon: 'none'
                    })
                }
            },
            fail: res => {
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
            }
        })
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

    // onPageScroll: function (e) {
    //     if (e.scrollTop > this.data.navigation_top - this.data.menuButtonBottom) {
    //         this.setData({
    //             top_padding_background_color: 'orange'
    //         })
    //     } else {
    //         this.setData({
    //             top_padding_background_color: 'black'
    //         })
    //     }
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            box_id,
            box_number,
            share_title,
            share_img,
            share_date,
        } = options;
        const bottom = app.globalData.menuButtonBounding.bottom
        const agree = wx.getStorageSync('agree')
        const address = wx.getStorageSync('address')
        this.setData({
            box_id,
            share_title,
            share_img,
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
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.custompopup = this.selectComponent("#custompopup");
        this.viewAwardDetail = this.selectComponent("#viewAwardDetail")
        const query = wx.createSelectorQuery();
        query.select('#button-container1').boundingClientRect((rect) => {
            this.setData({
                navigation_top: rect.top,
            })
        }).exec();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.refresh()
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
        var path = "/pages/choushang/choushang?box_id=" + this.data.box_instance.box_id + "&box_number=" + this.data.box_number + "&share_img=" + this.data.share_img + "&share_title=" + this.data.share_title + "&share_date=" + shareDate
        return {
            title: this.data.share_title,
            path: path,
            imageUrl: this.data.share_img,
        }
    },
})