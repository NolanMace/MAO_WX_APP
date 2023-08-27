// components/pagepopup.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        appHomePopup: {
            type: String,
            value: ''
        },
        canLongPress: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
      
    },

    /**
     * 组件的方法列表
     */
    methods: {
        back() {
            this.setData({
                display: false,
            })
        }
    }
})
