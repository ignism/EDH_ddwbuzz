<template>
    <div class="home">
        <!-- <vue-pull-refresh :on-refresh="onRefresh" :config="pullConfig"> -->
            <div v-if="posts.length < 1" class="loader__container--top">
                <div class="loader">
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                    <span class="loader-block"></span>
                </div>
            </div>
            
            <div class="masonry-items" v-if="isActivePost == false">
                <div v-masonry transition-duration="0.3s" item-selector=".item" v-if="posts && posts.length" percent-position="true" column-width=".item--sizer">
                    <div class="item--sizer"></div>
                    <div class="gutter--sizer"></div>

                    <div v-if="!isMobileView">
                      <div v-masonry-tile class="item" v-bind:class="getBlockSize(index)" v-for="(index, key) in getArrayEvenIndices(posts)" v-bind:key="index.id">
                        <siema class="siema-slider" :ref="'siema' + key" :class="'siema' + key" :options="siemaOptions">
                          <div>
                            <post-block v-bind:channel="meta['channel_users'][posts[index].user]" v-bind:color="meta['color_users'][posts[index].user]" v-bind:content="posts[index]" v-bind:i="index"></post-block>
                          </div>
                          <div v-if="posts.length > index + 1">
                            <post-block v-bind:channel="meta['channel_users'][posts[index + 1].user]" v-bind:color="meta['color_users'][posts[index + 1].user]" v-bind:content="posts[index + 1]" v-bind:i="index + 1"></post-block>
                          </div>
                        </siema>
                      </div>
                    </div>

                    <div v-if="isMobileView">
                      <div v-masonry-tile class="item" v-bind:class="getBlockSize(index)" v-for="(post, index) in posts" v-bind:key="post.id">
                        <post-block v-bind:channel="meta['channel_users'][posts[index].user]" v-bind:color="meta['color_users'][posts[index].user]" v-bind:content="posts[index]" v-bind:i="index"></post-block>
                      </div>
                    </div>
                </div>
            </div>

            <div id="loader" v-infinite-scroll="getNextPosts" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <div v-if="posts.length > 1 && busy && !isActivePost" class="loader__container--bottom ">
                    <div class="loader">
                        <span class="loader-block"></span>
                        <span class="loader-block"></span>
                        <span class="loader-block"></span>
                        <span class="loader-block"></span>
                        <span class="loader-block"></span>
                        <span class="loader-block"></span>
                        <span class="loader-block"></span>
                    </div>
                </div>
            </div>
        <!-- </vue-pull-refresh> -->
    </div>
</template>

<script>
import PostBlock from "@/components/PostBlock";
import PostDetail from "@/components/PostDetail";
import axios from "axios";
import http_build_query from "locutus/php/url/http_build_query";
import config from "@/config";
import VuePullRefresh from "vue-pull-refresh";
import Siema from 'vue2-siema'

var count = 0;

function scrollToTop(scrollDuration) {
  const scrollHeight = window.scrollY,
    scrollStep = Math.PI / (scrollDuration / 15),
    cosParameter = scrollHeight / 2;
  var scrollCount = 0,
    scrollMargin,
    scrollInterval = setInterval(function() {
      if (window.scrollY != 0) {
        scrollCount = scrollCount + 1;
        scrollMargin =
          cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
        window.scrollTo(0, scrollHeight - scrollMargin);
      } else clearInterval(scrollInterval);
    }, 15);
}

export default {
  name: "home",
  components: {
    PostBlock,
    PostDetail,
    "vue-pull-refresh": VuePullRefresh,
  },
  data() {
    return {
      siemaIntervalID: "",
      siemaOptions: {
        duration: 400, 
        draggable: false,
        loop: true, 
      },
      siemaAutoplayTime: [8000, 13000, 11000, 15000, 10000, 12000, 9000, 17000],
      siemaTicker: 7,
      intervalID: "",
      posts: [],
      errors: [],
      activePost: 0,
      isActivePost: false,
      windowWidth: 0,
      meta: "",
      busy: false,
      data: [],
      pullConfig: {
        errorLabel: "Error",
        startLabel: "Pull down to refresh",
        readyLabel: "Release to refresh",
        loadingLabel: ""
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);

      this.getWindowWidth();
    });
  },
  methods: {
    onRefresh: function() {
      this.posts = "";
      this.getAllPosts();
      return new Promise(function(resolve, reject) {
        //setTimeout(function () {
        resolve();
        //}, 1000);
      });
    },
    reload: function() {
      this.posts = "";
      this.getAllPosts();
    },
    getBlockSize: function(index) {
      if (((index / 2) + 1) % 4 == 0) {
        return "item--medium";
      }
      return "item--small";
    },
    getBlockColor: function(index) {
      if (index % 3 == 0) {
        return "background--tint-3";
      } else if (index % 2 == 0) {
        return "background--tint-2";
      }
      return "background--tint-1";
    },
    closeActivePost: function() {
      this.isActivePost = false;
      this.busy = false;
      var a = document.getElementById("active-post");
      a.style.height = 0;
    },
    openActivePost: function() {
      this.busy = true;
      var a = document.getElementById("active-post");
      var b = document.getElementById("post-detail");

      if (this.posts[this.activePost].media != "") {
        var c = document.getElementById("post-detail__image");
        c.style.height = c.offsetWidth + "px";
      } else {
        if (this.windowWidth >= 640) {
          var c = document.getElementById("post-detail__image");
          c.style.height = c.offsetWidth * 0.5 + "px";
        } else {
          var c = document.getElementById("post-detail__image");
          c.style.height = 0 + "px";
          c.style.minHeight = "80px";
        }
      }

      if (window.innerWidth >= 640) {
        a.style.height = b.offsetHeight + "px";
      } else {
        a.style.height = "auto";
      }

      scrollToTop(600);
    },
    setActivePost: function(index) {
      this.isActivePost = true;
      this.activePost = index;
      this.openActivePost();
    },
    getWindowWidth: function(event) {
      this.windowWidth = document.documentElement.clientWidth;
    },
    getAllPosts: function() {
      this.busy = true;
      var url = config.apiUrl + "/all";
      axios
        .get(url)
        .then(response => {
          this.posts = response.data["feeds"];
          this.meta = response.data["meta"];
          this.busy = false;
        })
        .catch(e => {
          this.errors.push(e);
          this.busy = false;
        });
    },
    getNextPosts: function() {
      this.busy = true;
      var query = http_build_query(this.meta, "");
      var url = config.apiUrl + "/next/?" + query;
      axios
        .get(url)
        .then(response => {
          for (var i = 0; i < response.data["feeds"].length; i++) {
            this.posts.push(response.data["feeds"][i]);
            this.$nextTick();
            this.$redrawVueMasonry();
          }
          this.meta = response.data["meta"];
          this.busy = false;
          this.$nextTick();
          this.$redrawVueMasonry();
        })
        .catch(e => {
          this.errors.push(e);
          this.busy = false;
        });
    },
    getTimedPosts: function() {
      const self = this;

      this.intervalID = setInterval(function() {
        self.busy = true;
        self.posts = '';
        var url = config.apiUrl + "/all";

        axios
          .get(url)
          .then(response => {
            self.posts = response.data["feeds"];
            self.meta = response.data["meta"];
            self.busy = false;
          })
          .catch(e => {
            self.errors.push(e);
            self.busy = false;
          });
      }, 300000);
    },
    loadMore: function() {
      this.busy = true;

      setTimeout(() => {
        for (var i = 0, j = 10; i < j; i++) {
          this.data.push({
            name: count++
          });
        }
        this.busy = false;
      }, 1000);
    },
    redraw: function() {

      window.dispatchEvent(new Event("resize"));
    },
    getArrayEvenIndices: function(array) {
      let len = array.length;
      let indices = [];

      for (let i = 0; i < len; i+=2) {
        indices.push(i);
      }

      return indices;
    },
    getSiemaOptions: function () {
      return this.siemaOptions[2];
    },
    removeSiemaInterval() {
      window.clearInterval(this.siemaIntervalID)
    }
  },
  computed: {
    isMobileView () {
      if (this.windowWidth < 640) {
        return true
      }
      return false
    }
  },
  created() {
    this.getAllPosts();
    this.getTimedPosts();

    this.siemaIntervalID = setInterval(() => {
      if (this.posts.length > 0) {
        for (let i = 0; i < this.posts.length; i++) {
          let ticker = i % 8;

          if (ticker == this.siemaTicker) {
            let windowWidth = document.documentElement.clientWidth
            if (windowWidth > 639) {
              if (this.$refs['siema' + i]) {
                if (this.$refs['siema' + i].length > 0) {
                  this.$refs['siema' + i][0].next();
                }
              }
            } else {
              // console.log(windowWidth)
            }
          }
        }

        //window.clearInterval(interval)
      }
      //this.siemaTicker = Math.floor(Math.random() * 8) 
      this.siemaTicker = (this.siemaTicker + 1) % 8
    }, 4000)
  },
  events: {
    "vuemasonry.imageLoaded": this.redraw
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.active-post {
  overflow: hidden;
}

.home {
  margin: 0 -5px;
  width: calc(100% + 5px);
  z-index: 1000;
}

.reload {
  height: 200px;
  margin-top: -200px;
}

.siema-slider,
.siema-slider > div,
.siema-slider > div > div {
  /* height: 33.3333vw; */
}
.siema-slider > div {
  position: absolute;
}
</style>
