<template>
  <div class="player-panel">
    <div
      ref="playerRef"
      class="player-style"
      :style="{ height: playerHeight + 'px' }"
    />
    <div class="danmu-panel">
      <div class="watcher">
        {{ onLineCount }} 人正在看，已装填 {{ danmuCount }} 条弹幕
      </div>
      <div
        v-show="showDanmu"
        id="danmu"
      />
      <div
        v-show="!showDanmu"
        class="close-danmu"
      >
        已关闭弹幕
      </div>
    </div>
    <div id="play">
      <img
        :src="proxy.Utils.getLocalImage('play.png')"
        alt=""
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { mitter } from '@/eventbus/eventBus'
import {
  ref,
  getCurrentInstance,
  nextTick,
  onMounted,
  onBeforeUnmount,
  inject,
  computed,
  watch,
} from 'vue'
import Hls from 'hls.js'
import { useRoute } from 'vue-router'
const { proxy } = getCurrentInstance() as any
const route = useRoute()
import Artplayer from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
//https://artplayer.org/

import { useLoginStore } from '@/stores/loginStore'
import { reportVideoPlayOnline as apiReportVideoPlayOnline } from '@/api/video'
import { loadDanmu as apiLoadDanmu, postDanmu as apiPostDanmu } from '@/api/danmu'
const loginStore = useLoginStore()

defineProps({
  fileId: {
    type: String,
    default: '',
  },
})

const playerRef = ref<string | HTMLDivElement | null>(null)
import { fetchAbrVariants, abrMasterUrl, abrPlaylistUrl } from '@/api/abr'
import { issueEncToken, encMasterUrl, encPlaylistUrl, listEncQualities } from '@/api/enc'
let player: any = null
let playerReady = false

const initPlayer = (defaultUrl: string) => {
  // 重新挂载前清空弹幕挂载点，避免切换分P时重复渲染多个输入区域
  const danmuMount = document.querySelector('#danmu') as HTMLDivElement | null
  if (danmuMount) danmuMount.innerHTML = ''

  //隐藏右键菜单
  Artplayer.CONTEXTMENU = false
  //自动回放功能的最大记录数，默认为 10
  Artplayer.AUTO_PLAYBACK_MAX = 20
  //自动回放功能的最小记录时长，单位为秒，默认为 5
  Artplayer.AUTO_PLAYBACK_MIN = 10
  playerReady = false
  player = new Artplayer({
    container: playerRef.value as string | HTMLDivElement,
    url: defaultUrl,
    type: 'm3u8',
    customType: {
      m3u8: function (video: HTMLVideoElement, url: string, art: any) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy()
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
            if (!currentQualityList[0]?.default) return
            const level = hls.levels?.[data.level]
            updateAutoQualityLabel(formatAutoQualityLabel(level))
          })
          art.hls = hls
          art.on('destroy', () => hls.destroy())
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        } else {
          art.notice.show = '浏览器不支持该播放器'
        }
      },
    },
    quality: [],
    theme: '#23ade5', //播放器主题颜色，目前用于 进度条 和 高亮元素 上
    volume: 0.7, //播放器的默认音量
    autoplay: true, //是否自动播放 假如希望默认进入页面就能自动播放视频，muted 必需为 true
    autoMini: false, //当播放器滚动到浏览器视口以外时，自动进入 迷你播放 模式
    fullscreen: true, //设置和获取播放器窗口全屏
    fullscreenWeb: true, //设置和获取播放器网页全屏
    setting: true,
    pip: true, //开启画中画
    playbackRate: true, //是否显示视频播放速度功能，会出现在 设置面板 和 右键菜单 里
    flip: true, //是否显示视频翻转功能，目前只出现在 设置面板 和 右键菜单
    aspectRatio: true, //比例
    //miniProgressBar: true, //迷你进度条，只在播放器失去焦点后且正在播放时出现
    screenshot: true, //截图
    autoPlayback: true, //自动回放
    //自定义图标
    icons: {
      state: document.querySelector('#play') as HTMLElement,
    },
    controls: [
      {
        name: 'wide-screen',
        position: 'right',
        html: '<span class="iconfont icon-wide-screen"></span>',
        tooltip: '宽屏模式',
        style: {
          color: '#fff',
          display: 'flex',
        },
        click: function () {
          changeWideScreen()
        },
      },
      {
        name: 'narrow-screen',
        position: 'right',
        html: '<span class="iconfont icon-narrow-screen"></span>',
        tooltip: '退出宽屏',
        style: {
          color: '#fff',
          display: 'none',
        },
        click: function () {
          changeWideScreen()
        },
      },
    ],
    plugins: [
      artplayerPluginDanmuku({
        mount: document.querySelector('#danmu') as HTMLDivElement,
        theme: 'light',
        emitter: true,
        danmuku: function () {
          return new Promise<any[]>(async (resovle) => {
            //是否展示弹幕
            const danmuList = await loadDanmuList()
            return resovle(danmuList as any)
          })
        },
        beforeEmit: async (danmu) => {
          try { await postDanmu(danmu) } catch (e) { return false }
          //重新获取一下弹幕列表
          await loadDanmuList()
          mitter.emit('danmSend')
          proxy.Message.success('发布成功')
          return true
        },
      }),
    ],
  })
  player.on('ready', () => {
    playerReady = true
    attachQualityGuard(player)
  })
  player.on('hover', (state: boolean) => {
    let display = 'none'
    if (state) {
      display = 'flex'
    }
    player.template.$bottom.style.display = display
  })
  //视频播放完成
  player.on('video:ended', () => {
    mitter.emit('playEnd')
  })
}

const emit = defineEmits(['changeWideScreen'])
const wideScreen = ref(false)
const changeWideScreen = () => {
  wideScreen.value = !wideScreen.value
  if (wideScreen.value) {
    player.controls['wide-screen'].style.display = 'none'
    player.controls['narrow-screen'].style.display = 'flex'
  } else {
    player.controls['wide-screen'].style.display = 'flex'
    player.controls['narrow-screen'].style.display = 'none'
  }
  emit('changeWideScreen', wideScreen.value)
}

const currentFileId = ref<string | number | null>(null)
let currentQualitySourceList: { html: string; url: string; value?: string; default?: boolean; playable?: boolean }[] = []
let currentQualityList: { html: string; url: string; value?: string; default?: boolean; playable?: boolean }[] = []
type EncQualityItem = { quality: string; authPolicy: number; playable: boolean }
let currentQualityPlayableByUrl = new Map<string, boolean>()
let lastSelectedQualityUrl = ''
let currentAutoUrl = ''
const AUTO_QUALITY_VALUE = 'auto'
let lastSelectedQualityValue = AUTO_QUALITY_VALUE
const DEBUG_QUALITY = true
const logQuality = (...args: any[]) => {
  if (DEBUG_QUALITY) console.log('[Player][Quality]', ...args)
}
const AUTO_QUALITY_LABEL = '自动'
const formatAutoQualityLabel = (level?: { height?: number; name?: string } | null) => {
  if (!level) return AUTO_QUALITY_LABEL
  if (level.height) return `${AUTO_QUALITY_LABEL} (${level.height}p)`
  if (level.name) return `${AUTO_QUALITY_LABEL} (${level.name})`
  return AUTO_QUALITY_LABEL
}
const markDefaultQualityByUrl = (url: string) => {
  if (!url) return
  currentQualitySourceList.forEach((item) => {
    item.default = item.url === url
  })
}
const refreshPlayableByUrl = () => {
  currentQualityPlayableByUrl = new Map(
    currentQualitySourceList.map((item) => [item.url, item.playable !== false])
  )
}
const buildQualityListForArt = () => currentQualitySourceList.map((item) => ({ ...item }))
const resolveDefaultQualityItem = (preferredValue: string) => {
  if (!currentQualitySourceList.length) return null
  const preferred = currentQualitySourceList.find((item) => item.value === preferredValue)
  if (preferred && preferred.playable !== false) return preferred
  const autoItem = currentQualitySourceList.find((item) => item.value === AUTO_QUALITY_VALUE)
  if (autoItem && autoItem.playable !== false) return autoItem
  const playableItem = currentQualitySourceList.find((item) => item.playable !== false)
  return playableItem || currentQualitySourceList[0]
}
const restoreQualitySelection = (art: any, url: string) => {
  const targetUrl = url || currentAutoUrl
  markDefaultQualityByUrl(targetUrl)
  logQuality('restore', { targetUrl })
  attachQualityGuard(art)
}
const attachQualityGuard = (art: any) => {
  if (!currentQualitySourceList.length) return
  const selector = buildQualityListForArt()
  currentQualityList = selector
  const currentDefault = selector.find((item) => item.default) || selector[0]
  logQuality('updateControl', { count: selector.length, default: currentDefault?.html })
  art.controls.update({
    name: 'quality',
    position: 'right',
    index: 10,
    style: { marginRight: '10px' },
    html: currentDefault?.html || AUTO_QUALITY_LABEL,
    selector: selector as any,
    onSelect: async (selector: any) => {
      const url = selector?.url || ''
      logQuality('select', { url, playable: currentQualityPlayableByUrl.get(url) })
      if (url && currentQualityPlayableByUrl.get(url) === false) {
        loginStore.setLogin(true)
        restoreQualitySelection(art, lastSelectedQualityUrl)
        return currentQualityList.find((item) => item.default)?.html || AUTO_QUALITY_LABEL
      }
      await art.switchQuality(url)
      lastSelectedQualityUrl = url
      lastSelectedQualityValue = selector?.value || AUTO_QUALITY_VALUE
      return selector?.html || ''
    },
  })
}
type QualityPayload = {
  useEnc: boolean
  autoUrl: string
  qualities: { html: string; url: string; value?: string; default?: boolean; playable?: boolean }[]
}
const fetchQualityPayload = async (fileId: string | number): Promise<QualityPayload> => {
  let encToken = ''
  let encQualities: EncQualityItem[] = []
  try {
    const encResp = await issueEncToken(fileId)
    encToken = encResp?.token || ''
  } catch {}
  try {
    const encListResp = await listEncQualities(fileId)
    encQualities = encListResp?.qualities || []
  } catch {}

  if (!encQualities.length) {
    const variantResp = await fetchAbrVariants(fileId)
    encQualities = (variantResp.qualities || []).map((q: string) => ({
      quality: q,
      authPolicy: 1,
      playable: true
    }))
  }

  const useEnc = Boolean(encToken)
  const autoUrl = useEnc ? encMasterUrl(fileId, encToken) : abrMasterUrl(fileId)
  const qualities = [
    { html: AUTO_QUALITY_LABEL, url: autoUrl, value: AUTO_QUALITY_VALUE, default: true, playable: true },
    ...encQualities.map((item) => ({
      html: item.quality,
      value: item.quality,
      url: useEnc
        ? encPlaylistUrl(fileId, item.quality, encToken)
        : abrPlaylistUrl(fileId, item.quality),
      playable: item.playable
    }))
  ]
  return { useEnc, autoUrl, qualities }
}
const applyQualityPayload = (
  payload: QualityPayload,
  options: { resetSelection: boolean; forceSwitchWhenUnplayable: boolean; updatePlayer: boolean; reason: string }
) => {
  currentAutoUrl = payload.autoUrl
  currentQualitySourceList = payload.qualities
  refreshPlayableByUrl()

  const preferredValue = options.resetSelection ? AUTO_QUALITY_VALUE : lastSelectedQualityValue
  const preferredItem = currentQualitySourceList.find((item) => item.value === preferredValue) || null
  const preferredPlayable = preferredItem ? preferredItem.playable !== false : false
  const defaultItem = preferredPlayable ? preferredItem : resolveDefaultQualityItem(AUTO_QUALITY_VALUE)
  if (defaultItem) {
    markDefaultQualityByUrl(defaultItem.url)
    lastSelectedQualityUrl = defaultItem.url
    lastSelectedQualityValue = defaultItem.value || AUTO_QUALITY_VALUE
  }
  logQuality(options.reason, {
    fileId: currentFileId.value,
    useEnc: payload.useEnc,
    autoUrl: payload.autoUrl,
    preferredValue,
    preferredPlayable,
    defaultValue: defaultItem?.value,
    qualities: currentQualitySourceList
  })
  if (options.updatePlayer && player && playerReady) {
    attachQualityGuard(player)
    if (options.forceSwitchWhenUnplayable && !preferredPlayable && defaultItem) {
      player.switchQuality(defaultItem.url)
    }
  }
}
const updateAutoQualityLabel = (label: string) => {
  if (!currentQualityList.length) return
  const autoItem = currentQualityList[0]
  if (!autoItem?.default) return
  const autoItemAny = autoItem as any
  if (autoItemAny.$control_item && autoItemAny.$control_item.innerHTML !== label) {
    autoItemAny.$control_item.innerHTML = label
  }
  if (autoItemAny.$control_value && autoItemAny.$control_value.innerHTML !== AUTO_QUALITY_LABEL) {
    autoItemAny.$control_value.innerHTML = AUTO_QUALITY_LABEL
  }
}
const postDanmu = (danmu: any) => {
  if (Object.keys(loginStore.userInfo).length == 0) {
    loginStore.setLogin(true)
    return
  }
  danmu.fileId = currentFileId.value
  danmu.videoId = route.params.videoId
  danmu.time = Math.round(danmu.time)
  return apiPostDanmu(danmu as any)
}

//弹幕数量
const danmuCount = ref(0)
const loadDanmuList = async (): Promise<any[]> => {
  if (!currentFileId.value) {
    return []
  }
  const result = await apiLoadDanmu({ fileId: currentFileId.value, videoId: route.params.videoId as any })
  if (!result) return []
  mitter.emit('loadDanmu', result)
  danmuCount.value = result.length
  return result as any
}

const playerHeight = ref(500)
const setPlayerHeight = inject<((h: number) => void) | null>('playerHeight', null)

onMounted(() => {
  nextTick(() => {
    // 占位初始化，实际切换分P时重建播放器
    initPlayer('')
    //滚动条的宽度是8，页面未全部加载完获取不到滚动条的宽度，所以这里提前减去滚动条的宽度
    const width = (playerRef.value as HTMLDivElement)?.clientWidth ?? 0
    const height = Math.round((width - 8) * 0.5625)
    playerHeight.value = height
    setPlayerHeight && setPlayerHeight(height)
  })

  mitter.on('changeP', async (_fileId: string | number) => {
    currentFileId.value = _fileId

    lastSelectedQualityValue = AUTO_QUALITY_VALUE
    const payload = await fetchQualityPayload(currentFileId.value!)
    applyQualityPayload(payload, {
      resetSelection: true,
      forceSwitchWhenUnplayable: false,
      updatePlayer: false,
      reason: 'changeP'
    })
    const defaultUrl = lastSelectedQualityUrl || payload.autoUrl || ''
    if (player) {
      player.destroy(false)
    }
    initPlayer(defaultUrl)

    //获取在线人数
    await reportVideoPlayOnline()
    //切换弹幕
    player.plugins.artplayerPluginDanmuku.load()
  })
  //轮训获取
  startTimer()
})

const loginUserId = computed(() => (loginStore.userInfo as any)?.userId || '')
watch(loginUserId, async (newId, oldId) => {
  if (newId === oldId) return
  if (!currentFileId.value) return
  const payload = await fetchQualityPayload(currentFileId.value)
  applyQualityPayload(payload, {
    resetSelection: false,
    forceSwitchWhenUnplayable: true,
    updatePlayer: true,
    reason: 'auth-change'
  })
})

onBeforeUnmount(() => {
  if (player) {
    player.destroy(false)
  }
  mitter.off('changeP')
  cleanTimer()
})

//获取在线人数轮训上报，类似上报心跳
let timmer = ref<ReturnType<typeof setInterval> | null>(null)
const startTimer = () => {
  timmer.value = setInterval(() => {
    reportVideoPlayOnline()
  }, 5000)
}

const onLineCount = ref(1)
const reportVideoPlayOnline = async () => {
  if (!currentFileId.value) {
    return
  }
  const result = await apiReportVideoPlayOnline(String(currentFileId.value), loginStore.deviceId as string)
  if (!result) return
  onLineCount.value = result
}

const cleanTimer = () => {
  if (timmer.value !== null) {
    clearInterval(timmer.value)
    timmer.value = null
  }
}

//判断是否显示弹幕
const videoInfo = inject<any>('videoInfo')
const showDanmu = computed(() => {
  return (
    videoInfo?.value?.interaction == null ||
    videoInfo?.value?.interaction.indexOf('0') == -1
  )
})
</script>

<style>
</style>

<style lang="scss" scoped>
.player-panel {
  .player-style {
    width: 100%;
    :deep(.art-video-player.art-mask-show .art-state) {
      //播放按钮
      position: absolute;
      right: 40px;
      bottom: 50px;
      .art-icon-state {
        width: 60px;
        height: 60px;
        img {
          width: 100%;
        }
      }
    }
    //改变播放器的右侧操作按钮
    :deep(.art-controls-right) {
      position: relative;
      display: block;
      width: 330px;
      .art-control {
        position: absolute;
      }
      //截屏
      .art-control-screenshot {
        left: 0;
      }
      .art-control-quality {
        left: 48px;
      }
      //设置按钮
      .art-control-setting {
        left: 96px;
      }
      //画中画
      .art-control-pip {
        left: 144px;
      }
      //宽屏
      .art-control-wide-screen,
      .art-control-narrow-screen {
        left: 192px;
        .iconfont {
          font-size: 20px;
        }
      }
      //网页全屏按钮
      .art-control-fullscreenWeb {
        left: 240px;
      }
      //全屏按钮
      .art-control-fullscreen {
        left: 288px;
      }
    }
  }
  .danmu-panel {
    box-shadow: 0 2px 6px #ddd;
    height: 56px;
    border-top: none;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 15px;
    .watcher {
      width: 250px;
      color: var(--text2);
    }
    #danmu {
      flex: 1;
    }
    .close-danmu {
      flex: 1;
      color: var(--text2);
      text-align: center;
    }
  }

  :deep(.danmu-setting) {
    background: none !important;
    padding: 0;
    border: none;
    .inner-panel {
      width: 300px;
      height: 280px;
      position: relative;
      .inner {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99999;
        color: #fff;
      }
      .mask {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: #000;
        opacity: 0.6;
      }
    }
  }
}
</style>
