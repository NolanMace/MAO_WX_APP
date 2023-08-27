// components/custompopup.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: '标题'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showModalStatus: false,
        attrBoxStyle: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        changeRange: function () {
            this.showModal();
        },

        showModal: function () {
            this.setData({
                showModalStatus: true
            })
        },

        //点击背景面任意一处时，弹出框隐藏
        hideModal: function () {
            this.setData({
                showModalStatus: false
            })
        },
    }
})