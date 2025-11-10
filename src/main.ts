import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/scss/base.scss'
import '@/assets/icon/iconfont.css'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'

// 全局组件
import Collapse from '@/components/Collapse.vue'
import Avatar from '@/components/Avatar.vue'
import Dialog from '@/components/Dialog.vue'
import ImageCoverSelect from '@/components/ImageCoverSelect.vue'
import DataList from '@/components/DataList.vue'
import DataGridList from '@/components/DataGridList.vue'
import NoData from '@/components/NoData.vue'
import Cover from '@/components/Cover.vue'
import MyTab from '@/components/MyTab.vue'
import DataLoadMoreList from '@/components/DataLoadMoreList.vue'
import VideoItem from '@/components/VideoItem.vue'

// 全局工具
import Request from '@/utils/Request'
import Message from '@/utils/Message'
import Utils from '@/utils/Utils'
import Verify from '@/utils/Verify'
import Confirm from '@/utils/Confirm'
import { Api } from '@/utils/Api.js'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.component('Collapse', Collapse)
app.component('Avatar', Avatar)
app.component('Cover', Cover)
app.component('Dialog', Dialog)
app.component('ImageCoverSelect', ImageCoverSelect)
app.component('DataList', DataList)
app.component('NoData', NoData)
app.component('MyTab', MyTab)
app.component('VideoItem', VideoItem)
app.component('DataGridList', DataGridList)
app.component('DataLoadMoreList', DataLoadMoreList)

app.config.globalProperties.VueCookies = VueCookies as any
app.config.globalProperties.Request = Request as any
app.config.globalProperties.Message = Message as any
app.config.globalProperties.Utils = Utils as any
app.config.globalProperties.Api = Api as any
app.config.globalProperties.Verify = Verify as any
app.config.globalProperties.Confirm = Confirm as any
app.config.globalProperties.bodyMaxWidth = 2000
app.config.globalProperties.bodyMinWidth = 1250
app.config.globalProperties.rowCategoryCount = 10
app.config.globalProperties.chunkSize = 1024 * 512
app.config.globalProperties.maxUploading = 3
app.config.globalProperties.videoAccept = '.mp4,.avi,.rmvb,.mkv,.mov'
app.config.globalProperties.imageAccept = '.jpg,.png,.gif,.bmp,.webp'
app.config.globalProperties.imageThumbnailSuffix = '_thumbnail.jpg'
app.config.globalProperties.carouselMaxCount = 5
app.config.globalProperties.bodyPadding = 150

app.mount('#app')
