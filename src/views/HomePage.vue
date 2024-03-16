<template>
    <v-col cols="12" md="12">
        <v-sheet min-height="70vh" rounded="lg">
            <v-card class="mx-auto" max-width="auto">
                <v-container fluid>
                    <v-row dense>
                        <template v-for="anime in animeList" :key="anime.animeId">

                            <v-col :cols="6" :md="2">
                                <v-card>
                                    <v-card @click="jumpClick(anime)">
                                        <v-img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                            :src="'https://img.dandanplay.net/anime/' + anime.animeId + '_medium.jpg'"
                                            class="white--text align-end" height="300px">

                                        </v-img>
                                    </v-card>

                                    <v-card-actions>
                                        <v-card-title class="pb-0" v-text="anime.animeTitle">

                                        </v-card-title>
                                    </v-card-actions>
                                </v-card>

                            </v-col>
                        </template>
                    </v-row>
                </v-container>
            </v-card>
        </v-sheet>
    </v-col>
</template>
  
<script>
import axios from 'axios';
import router from '@/router';
export default {
    data() {
        return {
            animeList: [], // 存储从API获取的数据
        };
    },
    mounted() {
        // 在组件挂载后，使用axios发起HTTP请求
        axios.get('api/videos')
            .then(response => {
                // 响应成功，将数据保存到animeList
                const apiResponse = response.data;
                this.processAnimeData(apiResponse);
            })
            .catch(error => {
                // 处理错误
                console.error('Error fetching data:', error);
            });
    },
    methods: {
        // 处理从API返回的数据
        processAnimeData(apiResponse) {
            const uniqueAnimeIds = new Set();
            const resultArray = [];

            // 遍历 API 返回的数据
            apiResponse.forEach(item => {
                // 检查是否已经添加过这个 AnimeId
                if (!uniqueAnimeIds.has(item.animeId) && item.animeId) {
                    // 如果没有添加过，则添加到 Set 和结果数组中
                    uniqueAnimeIds.add(item.animeId);
                    resultArray.push({
                        animeId: item.animeId,
                        animeTitle: item.animeTitle
                    });
                }
            });

            // 将结果保存到animeList
            this.animeList = resultArray;
        },

        jumpClick(anime) {
            // 3. name跳转
            router.push({
                // name
                name: 'about',
                // 传递参数
                query: {animeId:anime.animeId}
                
            });
        }
    },
};
</script>