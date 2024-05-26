<template>
<v-container>
    <v-row>
        <!-- 侧边弹弹play信息栏 -->
        <v-col cols="12" md="3" v-if="bangumi!=null">
            <v-card class="mx-auto">
                <v-img :src="bangumi.imageUrl"></v-img>
                <v-card-title>
                    {{bangumi.animeTitle}}
                </v-card-title>

                <v-container>
                    <v-expansion-panels>
                        <v-expansion-panel title="番剧详情">
                            <v-expansion-panel-text v-for="metadata in bangumi.metadata" :key="metadata">
                                {{metadata}}</v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-container>
            </v-card>
        </v-col>

        <v-col cols="12" md='9'>
            <v-row>
                <v-col cols="12" md="12" style="padding:10px">
                    <v-sheet min-height="20vh" rounded="lg">
                        <v-card-title style="font-family: auto;font-weight: bolder;">
                            {{bangumi.animeTitle}}
                        </v-card-title>
                        <v-container>
                            {{bangumi.summary}}
                        </v-container>
                        <v-container fluid>
                            <v-row style="padding:10px">
                                <v-chip col="3" style="margin: 5px;" v-for="tag  in bangumi.tags" :key="tag.id" label> {{ tag.name}}</v-chip>

                            </v-row>
                        </v-container>
                    </v-sheet>
                </v-col>
                <v-col cols="12" md="12">
                        <v-sheet min-height="20vh" rounded="lg">
                            <v-container fluid>
                                <v-row dense>
                                    <v-col cols="6" md='3' v-for="episode in bangumi.episodes" :key="episode.episodeId">
                                        <v-card class="ma-2" v-if="episodeExistsInLibrary(episode.episodeId)" variant="tonal" :subtitle="episode.episodeTitle"  :title="episode.episodeNumber" color="indigo" label="indigo" @click="jumpClick(episode.episodeId)"  hover></v-card>
                                        <v-card class="ma-2" v-else variant="outlined" :subtitle="episode.episodeTitle"  :title="episode.episodeNumber" disabled="false" @click="jumpClick(episode.episodeId)"  hover></v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-sheet>
                </v-col>
            </v-row>
        </v-col>

    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ snaptext }}

        <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                关闭
            </v-btn>
        </template>
    </v-snackbar>
</v-container>
</template>

<script>
import axios from 'axios';
import {
    useRoute
} from 'vue-router';
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
        axios.get('api/videos/anime?animeId='+route.query.animeId)
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
                    query: {
                        id: matchingLibraryEpisode.id,
                        episodeId: matchingLibraryEpisode.episodeId,
                        animeId: matchingLibraryEpisode.animeId
                    }

                });
            }
        }

    },
};
</script>
