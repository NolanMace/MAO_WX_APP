// components/radiusButton.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        width: {
            type: String,
            value: '150rpx',
        },
        height: {
            type: String,
            value: '60rpx'
        },
        buttonText: {
            type: String,
            value: '按钮文本'
        },
        fontSize: {
            type: String,
            value: '30rpx'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        buttonStyle: 'btStyle',
        selectedButtonStyle: '',
        buttonTextStyle: 'unselectedBtTextStyle',
        buttonTextBorder: '',
        buttonBackGround: 'transparent'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        select(color) {
            this.setData({
                buttonStyle: 'selectedBtStyle',
                buttonTextStyle: 'selectedBtTextStyle',
                buttonTextBorder: 'btTextBorder',
                buttonBackGround: color? color : 'transparent'
            })
        },
        unselect(color) {
            this.setData({
                buttonStyle: 'btStyle',
                buttonTextStyle: 'unselectedBtTextStyle',
                buttonTextBorder: '',
                buttonBackGround: color? color : 'transparent'
            })
        }
    }
})
