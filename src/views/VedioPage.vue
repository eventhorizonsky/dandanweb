<template>
    <Artplayer @get-instance="getInstance" :option="option" :style="style" />
  </template>
  
  <script>
  import Artplayer from "../components/Artplayer.vue";
  import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
  import { useRoute } from 'vue-router';

  export default {
   
    setup() {
      const route = useRoute();
       console.log(route)
      return {
        option: {
          container: '.artplayer-app',
          autoSize: true,
          fullscreen: true,
          fullscreenWeb: true,
          flip: true,
          playbackRate: true,
          aspectRatio: true,
          setting: true,
          url: "http://127.0.0.1:82/api/v1/stream/id/"+route.query.id,
          plugins: [
          artplayerPluginDanmuku({
              danmuku: 'http://127.0.0.1:82/api/v1/comment/id/'+route.query.id,
              speed: 5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
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
      ],
        },
        style: {
          width: "1200px",
          height: "800px",
          margin: "60px auto 0",
        },
      };
    },
    components: {
      Artplayer,
    },
    methods: {
      getInstance(art) {
        console.info(art);
      },
    },
  };
  </script>