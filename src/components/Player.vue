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
import { issueEncToken, encPlaylistUrl, encMasterUrl } from '@/api/enc'
import { fetchAbrVariants, abrPlaylistUrl } from '@/api/abr'
const loginStore = useLoginStore()

defineProps({
  fileId: {
    type: String,
    default: '',
  },
})

const playerRef = ref<string | HTMLDivElement | null>(null)
let player: any = null
let currentToken: string | null = null
let currentMasterObjectUrl: string | null = null
let levelIndexByName: Record<string, number> = {}
let currentAutoLabel = 'Auto'

const appendTokenParam = (url: string) => {
  if (!currentToken) return url
  try {
    const parsed = new URL(url, window.location.href)
    if (parsed.pathname.startsWith('/video/enc/')) {
      parsed.pathname = `/api${parsed.pathname}`
    }
    parsed.searchParams.set('token', currentToken)
    return parsed.toString()
  } catch (_) {
    return url
  }
}

const initPlayer = (defaultUrl: string, qualityList: { html: string; url: string; default?: boolean }[]) => {
  // 重新挂载前清空弹幕挂载点，避免切换分P时重复渲染多个输入区域
  const danmuMount = document.querySelector('#danmu') as HTMLDivElement | null
  if (danmuMount) danmuMount.innerHTML = ''

  levelIndexByName = {}
  currentAutoLabel = 'Auto'
  //隐藏右键菜单
  Artplayer.CONTEXTMENU = false
  //自动回放功能的最大记录数，默认为 10
  Artplayer.AUTO_PLAYBACK_MAX = 20
  //自动回放功能的最小记录时长，单位为秒，默认为 5
  Artplayer.AUTO_PLAYBACK_MIN = 10
  player = new Artplayer({
    container: playerRef.value as string | HTMLDivElement,
    url: defaultUrl,
    type: 'm3u8',
    customType: {
      m3u8: function (video: HTMLVideoElement, url: string, art: any) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy()
          const tokenizedLoader = (() => {
            const BaseLoader = Hls.DefaultConfig.loader
            return class TokenLoader extends (BaseLoader as any) {
              load(context: any, config: any, callbacks: any) {
                context.url = appendTokenParam(context.url)
                return super.load(context, config, callbacks)
              }
            }
          })()
          const hls = new Hls({ loader: tokenizedLoader as any })
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            levelIndexByName = {}
            hls.levels.forEach((lv: any, idx: number) => {
              const name = lv.name || lv.attrs?.['NAME'] || (lv.height ? `${lv.height}p` : undefined)
              if (name) levelIndexByName[name] = idx
            })
          })
          hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
            const lv = hls.levels?.[data.level]
            if (lv) {
              const name = lv.name || lv.attrs?.['NAME'] || (lv.height ? `${lv.height}p` : '')
              currentAutoLabel = name ? `Auto(${name})` : 'Auto'
              updateAutoLabel()
            }
          })
          hls.loadSource(url)
          hls.attachMedia(video)
          art.hls = hls
          art.on('destroy', () => hls.destroy())
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        } else {
          art.notice.show = '浏览器不支持该播放器'
        }
      },
    },
    quality: qualityList,
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
  player.on('quality', (item: any) => {
    const hls = player?.hls
    if (!hls) return
    if (item.html.startsWith('Auto')) {
      hls.autoLevelEnabled = true
      hls.currentLevel = -1
      hls.loadLevel = -1
      hls.nextLevel = -1
      return
    }
    const idx = levelIndexByName[item.html]
    if (typeof idx === 'number') {
      hls.autoLevelEnabled = false
      hls.currentLevel = idx
      hls.loadLevel = idx
      hls.nextLevel = idx
      currentAutoLabel = 'Auto'
      updateAutoLabel()
    }
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
let currentQualityList: { html: string; url: string; default?: boolean }[] = []
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
    initPlayer('', [])
    //滚动条的宽度是8，页面未全部加载完获取不到滚动条的宽度，所以这里提前减去滚动条的宽度
    const width = (playerRef.value as HTMLDivElement)?.clientWidth ?? 0
    const height = Math.round((width - 8) * 0.5625)
    playerHeight.value = height
    setPlayerHeight && setPlayerHeight(height)
  })

  mitter.on('changeP', async (_fileId: string | number) => {
    currentFileId.value = String(_fileId)

    let masterUrl = ''
    let encVariants: string[] = []
    let allowedQualities: string[] | null = null
    currentToken = null
    try {
      const tokenResp = await issueEncToken(currentFileId.value!)
      currentToken = tokenResp.token
      allowedQualities = parseAllowedQualities(tokenResp.allowedQualities)
      masterUrl = encMasterUrl(currentFileId.value!, currentToken || '')
      encVariants = await loadEncMasterVariants(masterUrl)
    } catch (e) {
      currentToken = null
    }

    const variantResp = await fetchAbrVariants(currentFileId.value!)
    const qualities: string[] = variantResp.qualities || []

    const variants = buildVariantEntries(qualities, encVariants, allowedQualities)
    const masterText = buildMasterPlaylist(variants)
    cleanupMasterUrl()
    currentMasterObjectUrl = masterText ? URL.createObjectURL(new Blob([masterText], { type: 'application/vnd.apple.mpegurl' })) : ''

    currentQualityList = buildQualityList(variants, currentMasterObjectUrl || masterUrl)
    const defaultUrl = pickDefaultUrl(currentQualityList)
    if (player) {
      player.destroy(false)
    }
    initPlayer(defaultUrl, currentQualityList)

    //获取在线人数
    await reportVideoPlayOnline()
    //切换弹幕
    player.plugins.artplayerPluginDanmuku.load()
  })
  //轮训获取
  startTimer()
})

onBeforeUnmount(() => {
  if (player) {
    player.destroy(false)
  }
  cleanupMasterUrl()
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

const buildQualityList = (variants: VariantEntry[], masterUrl: string) => {
  const list = variants.map((v) => ({
    html: v.quality,
    url: masterUrl,
    default: false,
  }))
  const autoUrl = masterUrl || list[0]?.url || ''
  if (list[0]) {
    list[0].default = true
  }
  return autoUrl
    ? [{ html: currentAutoLabel, url: autoUrl, default: true }, ...list]
    : list
}

const pickDefaultUrl = (qualities: { url: string; html: string }[]) => {
  return qualities.find((q: any) => q.default)?.url || qualities[0]?.url || ''
}

const qualityWeight = (q: string): number => {
  const map: Record<string, number> = { '1080p': 1080, '720p': 720, '480p': 480, '360p': 360 }
  return map[q] ?? 0
}

const loadEncMasterVariants = async (masterUrl: string): Promise<string[]> => {
  if (!masterUrl) return []
  try {
    const res = await fetch(masterUrl)
    if (!res.ok) return []
    const text = await res.text()
    const variants = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.replace(/\/index\.m3u8$/, ''))
    return Array.from(new Set(variants))
  } catch (e) {
    console.warn('parse enc master failed', e)
    return []
  }
}

type VariantEntry = {
  quality: string
  url: string
  bandwidth?: number
  width?: number
  height?: number
}

const buildVariantEntries = (qualities: string[], encVariants: string[], allowed: string[] | null): VariantEntry[] => {
  const weighted = (
    qualities
      .map((q) => q?.trim())
      .filter(Boolean) as string[]
  ).sort((a, b) => qualityWeight(b) - qualityWeight(a))
  const encSet = new Set(encVariants)
  const allowedSet = allowed ? new Set(allowed) : null
  return weighted
    .filter((q) => !allowedSet || allowedSet.has(q))
    .map((q) => {
      const meta = qualityMeta[q] || {}
      const useEnc = !!currentToken && encSet.has(q)
      const url = useEnc ? encPlaylistUrl(currentFileId.value!, q, currentToken || '') : abrPlaylistUrl(currentFileId.value!, q)
      return { quality: q, url, bandwidth: meta.bandwidth, width: meta.width, height: meta.height }
    })
}

const qualityMeta: Record<string, { width: number; height: number; bandwidth: number }> = {
  '1080p': { width: 1920, height: 1080, bandwidth: 5_000_000 },
  '720p': { width: 1280, height: 720, bandwidth: 3_000_000 },
  '480p': { width: 854, height: 480, bandwidth: 1_500_000 },
  '360p': { width: 640, height: 360, bandwidth: 900_000 },
}

const buildMasterPlaylist = (variants: VariantEntry[]): string => {
  if (!variants.length) return ''
  const lines = ['#EXTM3U', '#EXT-X-VERSION:3', '#EXT-X-INDEPENDENT-SEGMENTS']
  variants.forEach((v) => {
    const bw = v.bandwidth ?? Math.max(400_000, qualityWeight(v.quality) * 8_000)
    const res = v.width && v.height ? `,RESOLUTION=${v.width}x${v.height}` : ''
    lines.push(`#EXT-X-STREAM-INF:BANDWIDTH=${bw}${res},NAME="${v.quality}"`)
    lines.push(v.url)
  })
  return lines.join('\n')
}

const parseAllowedQualities = (json?: string | null): string[] | null => {
  if (!json) return null
  try {
    const arr = JSON.parse(json)
    return Array.isArray(arr) ? arr.filter((q) => typeof q === 'string') : null
  } catch (_) {
    return null
  }
}

const cleanupMasterUrl = () => {
  if (currentMasterObjectUrl) {
    URL.revokeObjectURL(currentMasterObjectUrl)
    currentMasterObjectUrl = null
  }
}

const updateAutoLabel = () => {
  if (!player) return
  const qualityList = player?.option?.quality || []
  const updated = qualityList.map((q: any) => (q.default ? { ...q, html: currentAutoLabel } : q))
  player.switchQuality(updated.find((q: any) => q.default), true)
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
