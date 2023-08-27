// app.js
App({
    onLaunch: function () {
        // 获取系统信息
        const systemInfo = wx.getSystemInfoSync();
        // 将状态栏高度存储在全局数据中
        this.globalData.statusBarHeight = systemInfo.statusBarHeight;
        const menuButtonBounding = wx.getMenuButtonBoundingClientRect()
        this.globalData.menuButtonBounding = menuButtonBounding
    },
    globalData: {
        expiration_time: 60,//分享链接过期时间，单位分钟
        pay_type_pool: 'pool',
        pay_type_box: 'box',
        pay_type_dq: 'dq',
        tabBarHeight: 170,
        menuButtonBounding: {},
        statusBarHeight: 0,
        appId: "1",
        login: "login",
        apiBaseUrl: "https://www.yfsmax.top/api/",
        getCustomerWx: '',
        getBox: "GetBox",
        GetAppBoxesByAppIdAndBoxType: "GetAppBoxesByAppIdAndBoxType",
        GetPoolsByAppId: "GetPoolsByAppId",
        getBoxItems: "GetBoxInstanceByAppIdAndBoxIdAndBoxNumber",
        getBoxInstances: "GetBoxInstanceByAppIdAndBoxId",
        getPoolAndPoolItemSetsByPoolIdAndAppId: "GetPoolAndPoolItemSetsByPoolIdAndAppId",
        WxLottery: "WxLottery",
        getUserXbeanByAppIdAndPhone: "GetUserXbeanByAppIdAndPhone",
        getUserBoxLotteryRecordsByOutTradeNo: "GetUserBoxLotteryRecordsByOutTradeNo",
        getUserDqLotteryRecordsByOutTradeNo: 'GetUserDqLotteryRecordsByOutTradeNo',
        getUserPoolLotteryRecordsByOutTradeNo: "GetUserPoolLotteryRecordsByOutTradeNo",
        dqLottery: "DqLottery",
        poolLottery: "PoolLottery",
        getMyCabinetItemsByAppIdAndPhone: "GetMyCabinetItemsByAppIdAndPhone",
        createWxUserShipmentOrder: "CreateWxUserShipmentOrder",
        getUserShipmentOrderResponses: "GetUserShipmentOrderResponses",
        decomposeOrderItems: "DecomposeOrderItems",
        getProductByShipmentOrderId: "GetProductByShipmentOrderId",
        getMerchantAddress: "GetMerchantAddress",
        getUserBoxLotteryRecordsByBoxIdAndBoxNumberAndAppId: "GetUserBoxLotteryRecordsByBoxIdAndBoxNumberAndAppId",
        getUserDqLotteryRecordsByBoxIdAndBoxNumberAndAppId: "GetUserDqLotteryRecordsByBoxIdAndBoxNumberAndAppId",
        getUserPoolLotteryRecordsByPoolIdAndAppId: "GetUserPoolLotteryRecordsByPoolIdAndAppId",
        getAddressesByUserId: "GetAddressesByUserId",
        createAddress: "CreateAddress",
        updateAddress: "UpdateAddress",
        deleteAddress: "DeleteAddress",
        deleteAddresses: "DeleteAddresses",
        getUserBoxRecordsByAppIdAndPhone: "GetUserBoxRecordsByAppIdAndPhone",
        getUserPoolRecordsByAppIdAndPhone: "GetUserPoolRecordsByAppIdAndPhone",
        getUserDqRecordsByAppIdAndPhone: "GetUserDqRecordsByAppIdAndPhone",
        getUserAgreementByAppId: "GetUserAgreementByAppId",
        getAppHomePopupByAppId: "GetAppHomePopupByAppId",
        getUserCouponByPhoneAndAppId: "GetUserCouponByAppIdAndPhone",
        updateAvatarUrlByPhoneAndAppId: "UpdateAvatarUrlByPhoneAndAppId",
        updateNicknameByPhoneAndAppId: "UpdateNicknameByPhoneAndAppId",
        getUserAvatarAndNicknameByPhoneAndAppId: "GetUserAvatarAndNicknameByPhoneAndAppId",
        getAppSwiperItemsByAppId: "GetAppSwiperItemsByAppId",
        getWindowBarByAppId: "GetWindowBarByAppId",
        getWindowBarBoxByAppId: "GetWindowBarBoxByAppId",
        updateAddressByShipmentOrderId: 'UpdateAddressByShipmentOrderId'
    }

})