<script setup>
import {
    onMounted,
    onUnmounted,
    ref,
    onBeforeMount
} from "vue";
import Artplayer from "artplayer";
import axios from 'axios';
import SubtitlesOctopus from "libass-wasm";
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import {
    useRoute
} from 'vue-router';
const subtitlesOctopusWorkJsPath =
    "/js/JavascriptSubtitlesOctopus/subtitles-octopus-worker-legacy.js";
const route = useRoute();
var video = {

};

var fonts = [
    "/static/SourceHanSansCN-Bold.woff2"
];

var artRef = ref();
var art = ref();
const subtitleOctopus = ref();
const tmpSubtitleOctopusSubUrl = ref("");

const artplayerPluginAss = function (options) {
    return function (art) {
        const instance = new SubtitlesOctopus({
            ...options,
            video: art.template.$video,
        });

        instance.canvasParent.style.zIndex = 20;
        art.on("destroy", () => instance.dispose());

        subtitleOctopus.value = instance;
        return {
            name: "artplayerPluginAss",
            instance: instance,
        };
    };
};
onMounted(function () {

    axios.get('/api/videos/' + route.query.id + "/playerInfo") // 替换成实际的API URL
        .then(response => {
            // 响应成功，将数据保存到 bangumi

            video = response.data;
            console.log("3")
            console.log(video)
            if (video.subtitles.length > 0) {
                art.value = new Artplayer({
                    container: artRef.value,
                    url: video.url,
                    poster: video.poster,
                    volume: 0.5,
                    isLive: false,
                    muted: false,
                    autoplay: false,
                    pip: true,
                    autoSize: true,
                    autoMini: true,
                    screenshot: true,
                    setting: true,
                    loop: true,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                    fullscreen: true,
                    fullscreenWeb: true,
                    subtitleOffset: false,
                    miniProgressBar: true,
                    mutex: true,
                    backdrop: true,
                    playsInline: true,
                    autoPlayback: true,
                    airplay: true,
                    theme: "skyblue",
                    lang: navigator.language.toLowerCase(),
                    moreVideoAttr: {
                        crossOrigin: "anonymous",
                    },
                    plugins: [
                        artplayerPluginDanmuku({
                            danmuku: '/api/videos/convert?episodeId=' + route.query.episodeId,
                            speed: 7, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
                            opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
                            fontSize: 25, // 字体大小，支持数字和百分比
                            color: '#FFFFFF', // 默认字体颜色
                            mode: 0, // 默认模式，0-滚动，1-静止
                            margin: [10, '25%'], // 弹幕上下边距，支持数字和百分比
                            antiOverlap: true, // 是否防重叠
                            useWorker: true, // 是否使用 web worker
                            synchronousPlayback: false, // 是否同步到播放速度
                            filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数，返回 true 则可以发送
                            lockTime: 5, // 输入框锁定时间，单位秒，范围在[1 ~ 60]
                            maxLength: 100, // 输入框最大可输入的字数，范围在[0 ~ 500]
                            minWidth: 200, // 输入框最小宽度，范围在[0 ~ 500]，填 0 则为无限制
                            maxWidth: 400, // 输入框最大宽度，范围在[0 ~ Infinity]，填 0 则为 100% 宽度
                            theme: 'dark', // 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
                            beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送

                            // 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部，仅在当宽度小于最小值时生效
                            // mount: document.querySelector('.artplayer-danmuku'),
                        }),
                        artplayerPluginAss({
                            fonts: fonts,
                            subUrl: video.subtitles[0].url,
                            fallbackFont:"/static/SourceHanSansCN-Bold.woff2",
                            workerUrl: subtitlesOctopusWorkJsPath,
                        }),
                    ],
                    settings: [{
                        width: 200,
                        html: "字幕",
                        tooltip: "选择",
                        icon: '<img width="22" heigth="22" src="/svg/subtitle.svg">',
                        selector: [{
                                html: "开启",
                                tooltip: "显示",
                                switch: true,
                                onSwitch: function (item) {
                                    item.tooltip = item.switch ? "隐藏" : "显示";
                                    if (item.switch) {
                                        tmpSubtitleOctopusSubUrl.value = subtitleOctopus.value.subUrl;
                                        subtitleOctopus.value.freeTrack();
                                    } else {
                                        subtitleOctopus.value.setTrackByUrl(
                                            tmpSubtitleOctopusSubUrl.value
                                        );
                                        subtitleOctopus.value.setSubUrl(tmpSubtitleOctopusSubUrl.value);
                                    }
                                    return !item.switch;
                                },
                            },
                            ...video.subtitles.map((subtitle, index) => ({
                                default: subtitle.default,
                                html: subtitle.subtitleName,
                                url: subtitle.url,
                            })),
                        ],
                        onSelect: function (item) {
                            const newSubtitleUrl = item.url;
                            tmpSubtitleOctopusSubUrl.value = newSubtitleUrl;
                            subtitleOctopus.value.setTrackByUrl(newSubtitleUrl);
                            subtitleOctopus.value.setSubUrl(newSubtitleUrl);
                            return item.html;
                        },
                    }, ],
                    contextmenu: [{
                        html: "Custom menu",
                        click: function (contextmenu) {
                            console.info("You clicked on the custom menu");
                            contextmenu.show = false;
                        },
                    }, ],
                });
            } else {
                art.value = new Artplayer({
                    container: artRef.value,
                    url: video.url,
                    poster: video.poster,
                    volume: 0.5,
                    isLive: false,
                    muted: false,
                    autoplay: false,
                    pip: true,
                    autoSize: true,
                    autoMini: true,
                    screenshot: true,
                    setting: true,
                    loop: true,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                    fullscreen: true,
                    fullscreenWeb: true,
                    subtitleOffset: false,
                    miniProgressBar: true,
                    mutex: true,
                    backdrop: true,
                    playsInline: true,
                    autoPlayback: true,
                    airplay: true,
                    theme: "skyblue",
                    lang: navigator.language.toLowerCase(),
                    moreVideoAttr: {
                        crossOrigin: "anonymous",
                    },
                    plugins: [
                        artplayerPluginDanmuku({
                            danmuku: '/api/videos/convert?episodeId=' + route.query.episodeId,
                            speed: 7, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
                            opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
                            fontSize: 25, // 字体大小，支持数字和百分比
                            color: '#FFFFFF', // 默认字体颜色
                            mode: 0, // 默认模式，0-滚动，1-静止
                            margin: [10, '25%'], // 弹幕上下边距，支持数字和百分比
                            antiOverlap: true, // 是否防重叠
                            useWorker: true, // 是否使用 web worker
                            synchronousPlayback: false, // 是否同步到播放速度
                            filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数，返回 true 则可以发送
                            lockTime: 5, // 输入框锁定时间，单位秒，范围在[1 ~ 60]
                            maxLength: 100, // 输入框最大可输入的字数，范围在[0 ~ 500]
                            minWidth: 200, // 输入框最小宽度，范围在[0 ~ 500]，填 0 则为无限制
                            maxWidth: 400, // 输入框最大宽度，范围在[0 ~ Infinity]，填 0 则为 100% 宽度
                            theme: 'dark', // 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
                            beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送

                            // 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部，仅在当宽度小于最小值时生效
                            // mount: document.querySelector('.artplayer-danmuku'),
                        })
                    ],
                    settings: [],
                    contextmenu: [{
                        html: "Custom menu",
                        click: function (contextmenu) {
                            console.info("You clicked on the custom menu");
                            contextmenu.show = false;
                        },
                    }, ],
                });
            }

        })
        .catch(error => {
            // 处理错误
            console.error('Error fetching bangumi data:', error);
        });

});
onUnmounted(function () {
    if (art.value) {
        art.value.destroy(false);
    }
});
</script>

<template>
<div align="center" class="pa-1" style="margin-top: 20px;">
    <div style="width: 100%; ">
        <div ref="artRef" style="width: 1200px; height: 650px" v-if="$vuetify.display.mdAndUp"></div>
        <div ref="artRef" style="width: 100%; height: 250px" v-if="$vuetify.display.smAndDown"></div>
    </div>
</div>
<v-container>
      <ul>
        <v-sheet min-height="20vh" rounded="lg">
        <v-container fluid>
          <v-row dense>
            <div v-for="episode in bangumi.episodes" :key="episode.episodeId" style="margin: 7px;">
              <v-btn :disabled=!episodeExistsInLibrary(episode.episodeId) block 
                color="indigo-darken-3" variant="flat" :cols="6" :md="2"
                @click="jumpClick(episode.episodeId)">
                {{ episode.episodeTitle }}
              </v-btn>

            </div>
          </v-row>
        </v-container></v-sheet>
      </ul> 

    </v-container>
</template>
<script>
import axios from 'axios';
import { useRoute } from 'vue-router';
import router from '@/router';
export default {
  data() {
    return {
      bangumi: {},
      libraryEpisodes: [], // 存储从 http://127.0.0.1:82/api/v1/library 获取的数据
    };
  },
  mounted() {
    const route = useRoute();
    // 在组件挂载后，使用axios发起HTTP请求获取 bangumi 数据
    axios.get('/dandanapi/api/v2/bangumi/' + route.query.animeId) // 替换成实际的API URL
      .then(response => {
        // 响应成功，将数据保存到 bangumi
        this.bangumi = response.data.bangumi;
      })
      .catch(error => {
        // 处理错误
        console.error('Error fetching bangumi data:', error);
      });

    // 在组件挂载后，使用axios发起HTTP请求获取 library 数据
    axios.get('api/videos')
      .then(response => {
        // 响应成功，将数据保存到 libraryEpisodes
        this.libraryEpisodes = response.data;
      })
      .catch(error => {
        // 处理错误
        console.error('Error fetching library data:', error);
      });
  },
  methods: {
    // 判断 episodeId 是否存在于 http://127.0.0.1:82/api/v1/library 返回的数据中
    episodeExistsInLibrary(episodeId) {
      return this.libraryEpisodes.some(libraryEpisode => libraryEpisode.episodeId === episodeId);
    },
    jumpClick(episodeId) {
  const matchingLibraryEpisode = this.libraryEpisodes.find(libraryEpisode => libraryEpisode.episodeId === episodeId);

  if (matchingLibraryEpisode) {
    router.push({
      // name
      name: 'play',
      // 传递参数
      query: { id: matchingLibraryEpisode.id, episodeId: matchingLibraryEpisode.episodeId, animeId: matchingLibraryEpisode.animeId }
    }).catch(err => {
      if (err.name !== 'NavigationDuplicated') {
        throw err;
      }
    }).finally(() => {
      router.go(0); // 重新加载当前页面
    });
  }
}


  },
};
</script>
<style scoped></style>
