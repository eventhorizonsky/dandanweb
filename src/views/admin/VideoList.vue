<template max-width="auto">
    <div  style="width:auto;padding: 10px;">
        <v-card title="番剧列表" class="mx-auto" max-width="auto" style="margin:10px;">
        <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-video-input-component"></v-icon> &nbsp; 管理你的本地番剧

        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            density="compact"
            label="查找"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
        ></v-text-field>
        </v-card-title>
    
        <v-data-table
            :headers="headers"
            :items="videos"
            :search="search"
        >
        <template v-slot:item.fileSize="{ item }">
            <div class="text-end">
                {{formatFileSize(item.fileSize)}}
            </div>
        </template>
        <template v-slot:item.matched="{ item }">
            <div class="text-end">
                <v-chip 
                :color="item.matched=='1'?'green':'red'"
                :text="item.matched=='1' ? '已匹配' : '待确认'"
                 variant="flat">
                </v-chip>
            </div>
        </template>
        <template v-slot:item.operation="{ item }">
            <div class="text-end">
            <v-btn
                color="indigo-darken-3"
                variant="flat"
                block
                @click=matchVideo(item)
            >
              重新匹配
            </v-btn>
        </div>
        </template>
        </v-data-table>
        </v-card>
        <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="1000"
        title="修改匹配结果"
      >
      <v-container>
    <v-row >
        <v-col
        class="d-flex align-center"
        cols="12"
        sm="5"
      >         
      <v-text-field
      class="ma-2 pa-2"
        v-model="anime"
        label="番剧名称"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col
        cols="12"
        sm="5"
        class="d-flex align-center"
      >    
      <v-text-field
      class="ma-2 pa-2 align-self-center"
        v-model="episode"
        label="剧集名称或集数"
        hide-details
      ></v-text-field>
    </v-col>
      <v-col
        cols="12"
        sm="2"
        class="d-flex align-center"
      >  <v-btn class="ma-2 pa-2" type="submit" size="x-large" @click=searchVideo()>查找</v-btn> </v-col>
    </v-row>
  </v-container>

      <v-data-table
            :headers="matchheaders"
            :items="matchResult"
            :search="search"
        >
        <template v-slot:item.operation="{ item }">
            <div class="text-end">
            <v-btn
                color="indigo-darken-3"
                variant="flat"
                block
                @click=updateVideo(item)
            >
              选择
            </v-btn>
        </div>
        </template>
    </v-data-table>
      </v-card>
    </v-dialog>
    </div>

  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        search: '',
        headers: [
          { title: '文件名称', key: 'fileName'},
          { title: '文件大小', key: 'fileSize'},
          { title: '动画名称', key: 'animeTitle' },
          { title: '剧集名称', key: 'episodeTitle' },
          { title: '类型', key: 'typeDescription' },
          { title: '匹配结果', key: 'matched' },
          { title: '操作', key: 'operation' },
        ],
        matchheaders : [
            { title: '弹幕库ID', key: 'episodeId'},
            { title: '作品ID', key: 'animeId'},
            { title: '作品标题', key: 'animeTitle' },
            { title: '剧集标题', key: 'episodeTitle' },
            { title: '作品类别', key: 'type' },
            { title: '类型描述', key: 'typeDescription' },
            { title: '操作', key: 'operation' },
        ],
        episode:'',
        anime:'',
        videos: [],
        changeId:0,
        matchResult:[],
        dialog:false
      };
    },
    created() {
      this.fetchVideos();
    },
    methods: {
      async fetchVideos() {
        try {
          const response = await axios.get('../api/videos');
          this.videos = response.data; // Assuming the response data is an array of objects
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      },
      async matchVideo(video) {
      try {
        this.dialog=true
        const requestBody = {
          fileName: video.fileName, 
          fileHash: video.hashValue, 
          fileSize: video.fileSize, 
        };
        const response = await axios.post('../dandanapi/api/v2/match',requestBody);
        this.changeId=video.id
        this.matchResult = response.data.matches;
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    },
    async searchVideo() {
      try {
        this.dialog=true
        const params  = {
            episode: this.episode, 
            anime: this.anime
        };
        const response = await axios.get('../dandanapi/api/v2/search/episodes', { params });
        this.matchResult=[]
        for(const anime of  response.data.animes){
            for(const episode of  anime.episodes){
               const result= {
                    "episodeId": episode.episodeId,
                    "animeId": anime.animeId,
                    "animeTitle": anime.animeTitle,
                    "episodeTitle":episode.episodeTitle,
                    "type": anime.type,
                    "typeDescription": anime.typeDescription,
                    "shift": 0
                }
                this.matchResult.push(result)
            }
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    },
    async updateVideo(video) {
      try {
        const requestBody = {
            episodeId: video.episodeId, 
            animeId: video.animeId, 
            animeTitle: video.animeTitle, 
            episodeTitle:video.episodeTitle,
            type:video.type,
            typeDescription:video.typeDescription,
            matched:'1'
        };
        await axios.put('../api/videos/'+this.changeId,requestBody);
        this.matchResult = [];
        this.changeId=0
        this.dialog=false
        this.fetchVideos()
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    },
      formatFileSize(bytes) {
      const MB = 1024 * 1024;
      const GB = MB * 1024;
      if (bytes >= GB) {
        return (bytes / GB).toFixed(2) + ' GB';
      } else {
        return (bytes / MB).toFixed(2) + ' MB';
      }
    },
    },
  };
  </script>
  