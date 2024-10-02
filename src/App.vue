<template>
  <v-app id="inspire">
    <v-layout>
      <v-navigation-drawer
          v-navigation-drawer v-model="drawer" temporary fixed
      >
        <v-list nav>
          <v-list-item
              v-for="(item, i) in mobleLink"
              :key="i"
              :title="item.name"
              @click="register(item.href)"
          />
        </v-list>
      </v-navigation-drawer>

      <v-app-bar class="px-md-4">
        <template #prepend>
          <v-app-bar-nav-icon
              v-if="$vuetify.display.smAndDown"
              @click="drawer = !drawer"
          />
        </template>

        <v-img
            v-if="!$vuetify.display.smAndDown"
            class="me-sm-8"
            max-width="40"
            src="https://cdn.vuetifyjs.com/docs/images/logos/v.svg"
        />

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn
              v-for="(item, i) in links"
              :key="i"
              class="me-2 text-none"
              :text="item.name"
              @click="register(item.href)"
          />
        </template>
        <v-spacer/>

            <v-text-field
                :loading="loading"
                :width="300"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="搜索"
                v-model="searchQuery"
                color="primary"
                @keyup.enter="searchAnime()"
                @input="onSearchInput"
                variant="outlined"
                hide-details
                single-line
                @click:append-inner="searchAnime()"
            ></v-text-field>

        <v-spacer v-if="$vuetify.display.smAndDown"/>

        <template #append>
          <v-btn class="ms-1" color="medium-emphasis" icon="mdi-bell-outline"  v-if="!$vuetify.display.smAndDown"/>

          <v-btn v-if="!loginStatus" icon="mdi-account-circle" @click="loginDialog=true">
          </v-btn>
          <v-menu v-else>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="$vuetify">
                <v-avatar>
                  <v-img :alt="loginUser.screenName" :src="loginUser.profileImage" @click="menu"></v-img>
                </v-avatar>
              </v-btn>
            </template>

            <v-list>
              <v-list-item min-width="100" @click="logoutDialog=true">
                登出
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-app-bar>
      <v-main class="bg-grey-lighten-3">
        <router-view></router-view>

      </v-main>
    </v-layout>
    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor" location="top" max-height="20px">
      {{ message }}
    </v-snackbar>
    <v-dialog v-model="logoutDialog" width="auto">
      <v-card max-width="400" prepend-icon="mdi-update" text="点击确认登出账号" title="确定登出吗">
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Ok" @click="logout"></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loginDialog" width="600">
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">

        <h2 class="mx-auto my-6" max-width="228">登录</h2>
        <v-text-field label="账号" @keyup.enter="login" density="compact" v-model="loginName"
                      placeholder="Email address" prepend-inner-icon="mdi-email-outline"
                      variant="outlined"></v-text-field>
        <v-text-field label="密码" @keyup.enter="login" v-model="passWord"
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                      density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
                      variant="outlined" @click:append-inner="visible = !visible"></v-text-field>
        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            本项目使用的账号密码为弹弹play官方的账号密码，相关信息来源也来自弹弹play，请在使用前先注册弹弹账号
          </v-card-text>
        </v-card>

        <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login" :loading="isloading">
          登录
        </v-btn>
        <v-card-text class="text-center">
          <a class="text-blue text-decoration-none" href="https://www.dandanplay.com/" rel="noopener noreferrer"
             target="_blank">
            前往注册
            <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>

      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      drawer: false, //侧边栏开关
      animeList: [], // 存储从API获取的数据
      loading: false,
      loginDialog: false,
      visible: false,
      loginName: '',
      passWord: '',
      searchQuery: '',
      snackbar: false,
      message: '',
      snackbarColor: '',
      loginUser: {},
      loginStatus: false,
      logoutDialog: false,
      isloading: false,
      links: [{
        name: '首页',
        href: "/"
      },
        {
          name: '追番',
          href: "/mylove"
        },
        {
          name: '观看历史',
          href: "/history"
        },
        {
          name: '站长推荐',
          href: "/"
        }
      ], //导航链接
      mobleLink: [{
        name: '首页',
        href: "/",
        icon: "mdi-home"
      },
        {
          name: '追番',
          href: "/mylove",
          icon: "mdi-heart"
        },
        {
          name: '消息',
          href: "/"
        },
        {
          name: '观看历史',
          href: "/history",
          icon: "mdi-history"
        },
        {
          name: '站长推荐',
          href: "/"
        }
      ], //导航链接
    };
  },
  mounted() {

    if (localStorage.hasOwnProperty('loginUser')) {
      var loginUserStr = localStorage.getItem("loginUser");
      this.loginUser = JSON.parse(loginUserStr)
      this.loginStatus = true
    }

  },
  methods: {
    register(href) { //重定向用的
      this.$router.push(href)
    },
    logout() {
      this.logoutDialog = false
      localStorage.removeItem("loginUser")
      this.loginUser = {}
      this.loginStatus = false
      this.snackbar = true
      this.message = '登出成功'
      this.snackbarColor = 'green'
    },
    searchAnime() {
      this.$router.push({
        path: '/AnimeList',
        query: {
          animeTitle: this.searchQuery
        }
      });
    },
    onSearchInput() {
      if (this.searchQuery === '') {
        this.$router.push({
          path: '/',
          query: {}
        });
      }
    },
    login() {
      this.isloading = true
      const requestBody = {
        loginName: this.loginName,
        passWord: this.passWord
      };
      axios.post('../api/user/login', requestBody).then(response => {
        if (response.data.errorCode == 0) {
          this.snackbar = true
          this.message = '登录成功'
          this.snackbarColor = 'green'
          this.loginDialog = false
          const loginUser = {
            userId: response.data.userId,
            userName: response.data.userName,
            userType: response.data.userType,
            screenName: response.data.screenName,
            profileImage: response.data.profileImage,
            token: response.data.token
          }
          localStorage.setItem("loginUser", JSON.stringify(loginUser))
          this.loginUser = loginUser
          this.loginStatus = true
        } else {
          this.snackbar = true
          this.message = response.data.errorMessage
          this.snackbarColor = 'red'
        }
        console.log(response.data)
      }).finally(() => {
        this.isloading = false
      });
    }

  }
}
</script>
