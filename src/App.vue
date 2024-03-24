<template>
  <v-app id="inspire">
    <v-app-bar flat>
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

    <v-main class="bg-grey-lighten-3">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
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