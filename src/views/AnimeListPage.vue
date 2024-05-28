<template>
    <v-row class="pa-2 ma-2">
    
        <v-col>
            <v-sheet min-height="70vh" rounded="lg">
                <v-row class="pa-4">
                    <v-col :cols="6" :md="2" v-if="loading" v-for="a in 12">
                        <v-skeleton-loader class="mx-auto border" max-width="300" type="card-avatar, actions"></v-skeleton-loader>
                    </v-col>
                    <v-col v-for="anime in animeList" :key="anime.animeId" :cols="6" :md="2">
                        <v-card @click="jumpClick(anime)">
                            <v-img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" :src="'https://img.dandanplay.net/anime/' + anime.animeId + '_medium.jpg'" class="white--text align-end" cover height="250">
    
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
    
    export default {
        data() {
            return {
                animeList: [], // 存储从API获取的数据
                loading: true,
                requestBody: {}
            };
        },
        mounted() {
            this.fetchAnimeData();
        },
        watch: {
            '$route.query.animeTitle': function (newQuery) {
                this.fetchAnimeData();
            }
        },
        methods: {
            fetchAnimeData() {
                const route = this.$route;
                if (route.query.animeTitle != null && route.query.animeTitle !== '') {
                    this.requestBody = {
                        animeTitle: route.query.animeTitle
                    };
                } else {
                    this.requestBody = {};
                }
                this.loading = true;
                // 在组件挂载后，使用axios发起HTTP请求
                axios.post('api/v1/anime', this.requestBody)
                    .then(response => {
                        // 响应成功，将数据保存到animeList
                        this.animeList = response.data;
                        this.loading = false;
                    })
                    .catch(error => {
                        // 处理错误
                        console.error('Error fetching data:', error);
                    });
            },
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
                this.$router.push({
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
    
    <style>
    .ellipsis {
        height: 60px;
        overflow: hidden;
        font-weight: bold;
    }
    </style>
    