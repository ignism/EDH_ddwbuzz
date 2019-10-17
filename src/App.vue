<template>
    <div id="app">
        <div class="container">
            <app-header></app-header>
            <div class="pusher"></div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'


export default {
    name: 'app',
    metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Get The Buzz',
        // all titles will be injected into this template
        titleTemplate: 'Get The Buzz',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },
    components: {
        AppHeader
    },
    mounted() {
        this.$ga.page('/')
    }
}
</script>

<style>
.pusher {
    padding-top: 60px;
}
</style>
