<template>
<v-app id="inspire">
    <!-- PC版界面 -->
    <v-app-bar flat v-if="$vuetify.display.mdAndUp" class="mx-auto d-flex align-center justify-center">
        <v-spacer></v-spacer>
        <v-btn v-for="link in links" :key="link.name" text @click="register(link.href)">
            {{ link.name }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="240">
            <v-text-field density="compact" label="搜索" rounded="lg" variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-responsive>
        <v-spacer></v-spacer>

        <v-spacer></v-spacer>
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
        <v-spacer></v-spacer>

    </v-app-bar>
    <!-- 手机版界面 -->
    <v-app-bar app flat v-if="$vuetify.display.smAndDown">
        <!-- 侧边栏开关 -->
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-responsive max-width="250">
            <v-text-field density="compact" label="搜索" rounded="lg" variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-responsive>
        <!-- 功能键组合 -->
        <v-btn icon v-if="$vuetify.theme.dark==false" @click="changedark()">
            <v-icon>mdi-weather-night</v-icon>
        </v-btn>
        <v-btn icon v-if="$vuetify.theme.dark==true" @click="changedark()">
            <v-icon>mdi-white-balance-sunny</v-icon>
        </v-btn>
        <v-btn icon="mdi-account-circle" @click="loginDialog=true">
        </v-btn>
    </v-app-bar>

    <!-- 侧边栏 -->
    <v-navigation-drawer v-model="drawer" temporary fixed>
        <v-list nav dense>
            <v-list-item-group active-class="accent">
                <v-list-item v-for="link in links" :key="link.name" text @click="register(link.href)">
                    {{ link.name }}
                </v-list-item>
            </v-list-item-group>
        </v-list>

    </v-navigation-drawer>
    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor" location="top" max-height="20px">
        {{ message }}
    </v-snackbar>
    <v-main class="bg-grey-lighten-3">
        <router-view></router-view>

    </v-main>

    <v-bottom-navigation mode="shift" v-if="$vuetify.display.smAndDown">
        <v-btn v-for="link in mobleLink" :value="link.name" @click="register(link.href)">
            <v-icon>{{link.icon}}</v-icon>
            <span>{{link.name}}</span>
        </v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="logoutDialog" width="auto">
        <v-card min-width="400" prepend-icon="mdi-update" text="点击确认登出账号" title="确定登出吗">
            <template v-slot:actions>
                <v-btn class="ms-auto" text="Ok" @click="logout"></v-btn>
            </template>
        </v-card>
    </v-dialog>
    <v-dialog v-model="loginDialog" width="600">
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
          
                <h2  class="mx-auto my-6"
      max-width="228">登录</h2>
                <v-text-field label="账号" @keyup.enter="login" density="compact" v-model="loginName" placeholder="Email address" prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>
                <v-text-field label="密码" @keyup.enter="login" v-model="passWord" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"></v-text-field>
                <v-card class="mb-12" color="surface-variant" variant="tonal">
                    <v-card-text class="text-medium-emphasis text-caption">
                        本项目使用的账号密码为弹弹play官方的账号密码，相关信息来源也来自弹弹play，请在使用前先注册弹弹账号
                    </v-card-text>
                </v-card>
            
            <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login" :loading="isloading">
                登录
            </v-btn>
            <v-card-text class="text-center">
                <a class="text-blue text-decoration-none" href="https://www.dandanplay.com/" rel="noopener noreferrer" target="_blank">
                    前往注册<v-icon icon="mdi-chevron-right"></v-icon>
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
            loginDialog: false,
            visible: false,
            loginName: '',
            passWord: '',
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
                    name: '后台管理',
                    href: "/admin/videolist"
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
                    name: '观看历史',
                    href: "/history",
                    icon: "mdi-history"
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
