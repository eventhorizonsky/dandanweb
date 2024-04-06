<template>
  <v-app id="inspire">
    <v-app-bar flat  v-if="$vuetify.display.mdAndUp" >
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar class="mr-10" size="32"> <img alt="Avatar" style="width: inherit;"
            src="https://www.ezsky.xyz/wp-content/uploads/2020/07/blackhole.png"></v-avatar>

        <v-btn v-for="link in links" :key="link.name" text @click="register(link.href)">
          {{ link.name }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="360">
          <v-text-field density="compact" label="搜索" rounded="lg" variant="solo-filled" flat hide-details
            single-line></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>
    <v-app-bar app  flat v-if="$vuetify.display.smAndDown">
      <!-- 侧边栏开关 -->
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <!-- 意义不明的空格 -->
        <v-spacer></v-spacer>

        <v-spacer></v-spacer>
        <!-- 功能键组合 -->
        <v-btn icon v-if="$vuetify.theme.dark==false" @click="changedark()"><v-icon>mdi-weather-night</v-icon></v-btn>
        <v-btn icon v-if="$vuetify.theme.dark==true" @click="changedark()"><v-icon>mdi-white-balance-sunny</v-icon></v-btn>
             <v-menu
      bottom
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          icon
        >
      <v-icon>mdi-bell-ring</v-icon>
        </v-btn>
      </template>

      <v-list> 
        <v-list-item
          >
            <v-list-item-title >番剧更新</v-list-item-title>

            <v-list-item-icon>
              <v-btn @click="register('/mylove')" icon> <v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </v-list-item-icon>
          </v-list-item>
      
        <template  v-for="li,newindex in newanime">
         
          <v-divider v-if="newanime.length!=0"
          :key="newindex"></v-divider>
          
  
          <v-list-item
            v-if="newanime.length!=0"
          :key="newindex"
        > 
        <v-list-item-content >
          <v-list-item-title>{{ li.name }}</v-list-item-title>
          <v-list-item-subtitle>更新至{{ li.last }}</v-list-item-subtitle>
        </v-list-item-content>
           <v-list-item-icon>
          <v-btn @click="goplaynew(li.webindex,li.playurl)" icon><v-icon>mdi-menu-right-outline</v-icon></v-btn> 
        </v-list-item-icon>
        
        </v-list-item>
      
      </template>
     
       
         <v-list-item
         v-if="newanime.length==0"
        >
          <v-list-item-title >暂无更新</v-list-item-title>
          
        </v-list-item>
      </v-list>
    </v-menu>
    </v-app-bar>
     <!-- 侧边栏 -->
<v-navigation-drawer v-model="drawer" temporary fixed>
  <v-list nav dense>
    <v-list-item-group  active-class="accent">
      <v-list-item v-for="link in links"
          :key="link.name"
          text
          @click="register(link.href)" >
          {{ link.name }}
      </v-list-item>
    </v-list-item-group>
  </v-list>

  
</v-navigation-drawer>
    <v-main class="bg-grey-lighten-3">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,//侧边栏开关
      animeList: [], // 存储从API获取的数据
      links: [
        { name: '首页', href: "/" },
        { name: '追番', href: "/mylove" },
        { name: '观看历史', href: "/history" },
        { name: '后台管理', href: "/admin/videolist" },
      ],//导航链接
    };
  },
  methods: {
    register(href) {//重定向用的
      this.$router.push(href)
    }
  }
}

</script>