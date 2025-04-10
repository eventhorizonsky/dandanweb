<template>
<v-row class="pa-2 ma-2">
    <v-col>
        <v-sheet min-height="70vh" rounded="lg">
            <v-row class="pa-4">
                <v-col :cols="6" :md="2" v-if="loading" v-for="a in 12">
                    <v-skeleton-loader  class="mx-auto border" max-width="300" type="card-avatar, actions"></v-skeleton-loader>
                </v-col>
                <v-col v-for="anime in sortedAnimeList" :key="anime.animeId" :cols="6" :md="2">

                    <v-card @click="jumpClick(anime)" :disabled=anime.disable>
                        <v-img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" :src="'https://img.dandanplay.net/anime/' + anime.animeId + '.jpg'" class="white--text align-end" cover height="250">

                        </v-img>
                        <v-card-text style="font-weight: bold;" class="ellipsis" v-text="anime.animeTitle"></v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-sheet>
    </v-col>
</v-row>
</template>

<script>
import axios from 'axios';
import router from '@/router';
export default {
    data() {
        return {
            animeList: [], // 存储从API获取的数据
            loginStatus: false,
            loginUser: {},
            libraryEpisodes: [],
            loading: true
        };
    },
    mounted() {
        this.loading=true
        if (localStorage.hasOwnProperty('loginUser')) {
            var loginUserStr = localStorage.getItem("loginUser");
            this.loginUser = JSON.parse(loginUserStr)
            this.loginStatus = true
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.loginUser.token
                }
            };
            // 在组件挂载后，使用axios发起HTTP请求获取 bangumi 数据
            axios.get('/dandanapi/api/v2/favorite', config) // 替换成实际的API URL
                .then(response => {
                    // 响应成功，将数据保存到 bangumi
                    this.animeList = response.data.favorites;
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
        }else{
            this.loading=false
        }

    },
    computed: {
        sortedAnimeList() {
            const sortedList = this.animeList.slice().map(anime => {
                const existsInLibrary = this.episodeExistsInLibrary(anime.animeId);
                return {
                    ...anime,
                    disable: !existsInLibrary
                };
            }).sort((a, b) => {
                const aExists = this.episodeExistsInLibrary(a.animeId);
                const bExists = this.episodeExistsInLibrary(b.animeId);

                if (aExists && !bExists) {
                    return -1;
                } else if (!aExists && bExists) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // 设置loading为false
            this.loading = false;

            return sortedList;
        }
    },
    methods: {

        // 判断 animeId 是否存在于 http://127.0.0.1:82/api/v1/library 返回的数据中
        episodeExistsInLibrary(animeId) {
            return this.libraryEpisodes.some(libraryEpisode => libraryEpisode.animeId === animeId);
        },
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
        calculateFontSize(title) {
            // 根据标题的长度来计算字体大小，你可以根据需要调整系数和基准大小
            const baseFontSize = 15; // 基准字体大小
            const scaleFactor = 0.8; // 缩放系数，可以根据需要调整
            const maxLength = 8; // 最大标题长度，超过这个长度将开始缩小字体

            let fontSize = baseFontSize;
            if (title.length > maxLength) {
                fontSize = baseFontSize * scaleFactor;
            }
            return fontSize + 'px';
        },
        jumpClick(anime) {
            // 3. name跳转
            router.push({
                // name
                name: 'about',
                // 传递参数
                query: {
                    animeId: anime.animeId
                }

            });
        }
    },
};
</script>
