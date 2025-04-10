<template>
  <v-container>
    <v-card title="最近更新">
      <v-container fluid>
        <v-row>
          <v-col v-for="anime in recentAnime" :key="anime.animeId" cols="6" md="2">
            <v-card @click="jumpClick(anime)">
              <v-img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                     :src="'https://img.dandanplay.net/anime/' + anime.animeId + '.jpg'" class="white--text align-end"
                     cover height="200"></v-img>
              <v-card-text style="font-weight: bold;" class="ellipsis" v-text="anime.animeTitle"></v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
  <v-container>
    <v-card title="新番时间表">
      <v-tabs v-model="whatDay" align-tabs="center" color="deep-purple-accent-4">
        <v-tab :value="1">周一</v-tab>
        <v-tab :value="2">周二</v-tab>
        <v-tab :value="3">周三</v-tab>
        <v-tab :value="4">周四</v-tab>
        <v-tab :value="5">周五</v-tab>
        <v-tab :value="6">周六</v-tab>
        <v-tab :value="0">周日</v-tab>
      </v-tabs>

      <v-tabs-window v-model="whatDay">
        <v-tabs-window-item v-for="item in 7" :key="item" :value="item">
          <v-container fluid>
            <v-row>
              <v-col cols="6" md="2" v-for="anime in filteredAnimeList(whatDay)" :key="anime.animeId">
                <v-card @click="jumpClick(anime)">
                  <v-img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                         :src="'https://img.dandanplay.net/anime/' + anime.animeId + '_medium.jpg'"
                         class="white--text align-end" cover height="200"></v-img>
                  <v-card-text style="font-weight: bold;" class="ellipsis" v-text="anime.animeTitle"></v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      animeList: [], // 存储从API获取的数据
      recentAnime: [],
      loading: true,
      requestBody: {},
      whatDay: 1 // 默认选中第一个标签页
    };
  },
  mounted() {
    this.setCurrentDayTab();
    this.fetchAnimeData();
  },
  methods: {
    fetchAnimeData() {
      this.requestBody = {
        air: true,
        pageSize: 999,
      };

      this.loading = true;
      // 在组件挂载后，使用axios发起HTTP请求
      axios.post('api/v1/anime', this.requestBody)
          .then(response => {
            // 响应成功，将数据保存到animeList
            this.animeList = response.data.data.rows;
          })
          .catch(error => {
            // 处理错误
            console.error('Error fetching data:', error);
          });
      axios.get('api/videos/recentUpdate')
          .then(response => {
            // 响应成功，将数据保存到animeList
            this.recentAnime = response.data;

          })
          .catch(error => {
            // 处理错误
            console.error('Error fetching data:', error);
          });
      this.loading = false;
    },
    filteredAnimeList(day) {
      return this.animeList.filter(anime => anime.airDay === day&&anime.type !=="jpdrama");
    },
    jumpClick(anime) {
      // 3. name跳转
      this.$router.push({
        // name
        name: 'about',
        // 传递参数
        query: {
          animeId: anime.animeId
        }
      });
    },
    setCurrentDayTab() {
      this.whatDay = new Date().getDay(); // 获取当前星期几 (0 表示周日，1 表示周一，依此类推)
    }
  },
};
</script>

<style>
.ellipsis {
  height: 60px;
  overflow: hidden;
  font-weight: bold;
}
</style>
