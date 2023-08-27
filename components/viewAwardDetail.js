// components/viewAwardDetail.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        awardDetail: {
            type: Object,
            value: []
        },
        fromBox: {
            type: Boolean,
            value: false
        },
        fromPool: {
            type: Boolean,
            value: false
        },
        price: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        indicatorDots: false,
        autoplay: false,
        duration: 500,
        circular: true,
        visible: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        back: function() {
            this.setData({
                visible: false,
            })
        },

        showViewAwardDetail: function() {
            this.setData({
                visible: true,
            })
        }
    }
})
