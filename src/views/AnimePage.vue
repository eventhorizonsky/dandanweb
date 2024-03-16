<template>
  <div>

    <ul>
      <v-sheet min-height="70vh" rounded="lg">
      <v-container fluid>
        <v-row dense>
          <div v-for="episode in bangumi.episodes" :key="episode.episodeId" style="margin: 20px;">

            <v-btn :disabled=!episodeExistsInLibrary(episode.episodeId) block class="text-none mb-4"
              color="indigo-darken-3" size="x-large" variant="flat" :cols="6" :md="2"
              @click="jumpClick(episode.episodeId)">
              {{ episode.episodeTitle }}
            </v-btn>

          </div>
        </v-row>
      </v-container></v-sheet>
    </ul>
  </div>
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
          query: { id: matchingLibraryEpisode.id, episodeId:matchingLibraryEpisode.episodeId}

        });
      }
    }

  },
};
</script>
