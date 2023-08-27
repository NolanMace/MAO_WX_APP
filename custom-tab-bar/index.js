Component({
    properties: {
      custom: {
        type: Boolean,
        value: true
      },
      color: {
        type: String,
        value: "#1d1d1f"
      },
      selectedColor: {
        type: String,
        value: "#760000"
      },
      iconStyle: {
        type: String,
        value: "#tab-item-image-unselect"
      },
      selectedIconStyle: {
        type: String,
        value: "#tab-item-image-select"
      },
      list: {
        type: Array,
        value: [
          {
            pagePath: "pages/index/index",
            iconPath: "../image/dhyfs.png",
            selectedIconPath: "../image/dhyfsSelected.png"
          },
          {
            pagePath: "pages/myshipmentorders/myshipmentorders",
            iconPath: "../image/dhsg.png",
            selectedIconPath: "../image/dhsgSelected.png"
          },
          {
            pagePath: "pages/index3/index3",
            iconPath: "../image/dhwd.png",
            selectedIconPath: "../image/dhwdSelected.png"
          }
        ]
      }
    },
    data: {
      currentIndex: 0
    },
    methods: {
      selectTab(e) {
        const index = e.currentTarget.dataset.index;
        this.setData({
        //   currentIndex: index
        });
        const url = this.data.list[index].pagePath;
        wx.switchTab({
          url: `/${url}`
        });
      }
    }
  });
  