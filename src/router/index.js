import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import GtbSource from '@/components/GtbSource'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/source/:type/:username/:id?',
            name: 'gtbSource',
            component: GtbSource
        }
    ]
})