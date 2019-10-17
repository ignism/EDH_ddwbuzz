<template>
    <div class="app-header">
        <router-link to="/"><img v-bind:style="{'display':getLogo()}" class="logo" src="../assets/svg/getthebuzz_logo.svg"></router-link>
        <div class="source-name">{{ source }}</div>
        <router-link to="/">
            <div class="menu-back" v-if="isBack == true" v-bind:class="{ active: isActive }">
                <img class="home" src="../assets/svg/home.svg">
            </div>
        </router-link>
        <div class="menu-toggle" v-if="isBack == false" v-bind:class="{ active: isActive }" v-on:click="toggle">
            <div class="bar"></div>
        </div>
        <div class="menu-dropdown" v-bind:class="{ active: isActive }">
            <h3>
                A real-time insight into the hottest parties, most beautiful exhibitions, most interesting lectures and underground gems.
            </h3>
            <div class="button-wrapper">
                <a href="mailto:redactie@ddw.buzz" class="button">contact</a>
                <a href="mailto:redactie@ddw.buzz" class="button">contribute</a>
            </div>
            <div class="menu-header">
                <span>sources</span>
            </div>
            <ul v-if="sources.length > 0" class="menu-list">
                <li v-for="(item, index) in sources" v-bind:key="item.id">
                    <router-link v-on:click.native="hideDropdown" v-bind:to="{path: '/source/' + item.type + '/' + item.username}">{{ item.channel }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import config from '../config'

export default {
    name: 'app-header',
    data() {
        return {
            isActive: false,
            sources: [],
            errors: [],
            source: '',
            isBack: false
        }
    },
    methods: {
        getLogo: function() {
            if (this.isBack && window.innerWidth < 640) {
                return 'none'
            } else {
                return 'block'
            }
        },
        setSource: function(name) {
            this.source = name;
            if (this.source == '' || this.source == null) {
                this.isBack = false;
            } else {
                this.isBack = true;
            }
        },
        back: function() {
            isBack = false;
            this.$router.go('/');
        },
        toggle: function(e) {
            var element = e.currentTarget
            if (element.classList.contains("active")) {
                this.isActive = false
            } else {
                this.isActive = true
            }
        },
        hideDropdown: function() {
            this.isActive = false;
        },
        alertMe: function() {
            alert('me');
        },
        isEmpty: function(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
    },
    created() {
        axios.get(config.apiUrl + '/sources')
            .then(response => {
                // JSON responses are automatically parsed.
                this.sources = response.data
            })
            .catch(e => {
                this.errors.push(e)
            })
    },
    watch: {
        '$route.params'(from, to) {
            if (this.isEmpty(from)) {
                this.isBack = false;
                this.source = '';
            } else {
                this.isBack = true;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.home {
        width: 30px;
    height: 50px;
    margin: 5px 15px;
}
.app-header {
    max-width: 1799px;
    position: fixed !important;
    width: 100%;
    background: #fff;
    height: 60px;
    position: relative;
    z-index: 2000;
}

.logo {
    height: 40px;
    width: auto;
    float: left;
    padding: 5px;
    margin-top: 10px;
    margin-left: 60px;
}

.source-name {
    position: absolute;
    top: 0;
    right: 50%;
    margin-right: -25%;
    width: 50%;
    text-align: center;
    /* DDW NEWS FEED: */
    font-family: 'Montserrat';
    font-size: 18px;
    font-weight: 600;
    color: rgb(0, 240, 0);
    letter-spacing: 0.66px;
    line-height: 60px;
    overflow-y: hidden;
    height: 60px;
}


h3 {
    font-family: Montserrat;
    font-weight: bold;
    font-size: 30px;
    color: white;
    letter-spacing: 0.62px;
    line-height: 1.6em;
    margin: 0 72px;
    text-align: center;
}

@media screen and (max-width: 639px) {
    h3 {
        font-size: 20px;
        margin: 0 40px;
    }

    .logo {
        display: none;
    }
}

a {
    color: white;
    text-decoration: none;
}

ul {
    font-size: 24px;
    color: #FFFFFF;
    letter-spacing: 0.5px;
    line-height: 40px;
    text-transform: uppercase;
    margin-bottom: 120px;
}

ul li {
    text-align: center;
}
</style>