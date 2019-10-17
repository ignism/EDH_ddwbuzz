<template>
    <div class="source">
        <!-- <vue-pull-refresh :on-refresh="onRefresh" :config="pullConfig"> -->
            <div v-if="posts.length < 1" class="loader">
                <span class="loader-block"></span>
                <span class="loader-block"></span>
                <span class="loader-block"></span>
                <span class="loader-block"></span>
                <span class="loader-block"></span>
                <span class="loader-block"></span>
                <span class="loader-block"></span>
            </div>

            <div v-if="posts.length > 0" id="active-post" class="active-post" v-bind:class="{active: isActivePost}">
                <post-detail ref="postDetail" id="post-detail" v-if="activePost != null || activePost != false" v-bind:i="activePost" v-bind:content="posts[activePost]" v-bind:class="{active: isActivePost}"></post-detail>
            </div>

            <div class="masonry-items" v-if="isActivePost == false">
                <div v-masonry transition-duration="0.3s" item-selector=".item" v-if="posts && posts.length" column-width=".item--sizer">
                    <div class="item--sizer"></div>
                    <div class="gutter--sizer"></div>
                    <div v-masonry-tile class="item" v-bind:class="getBlockSize(index)" v-for="(item, index) in posts" v-bind:key="item.id">
                        <post-block v-bind:channel="meta['channel_users'][item.user]" v-bind:color="meta['color_users'][item.user]" v-bind:content="item" v-bind:i="index"></post-block>
                    </div>
                    <!-- <div v-masonry-tile class="item" v-bind:class="getBlockSize(index)" v-for="(index, key) in getArrayEvenIndices(posts)" v-bind:key="index.id">
                        <siema class="siema-slider" :ref="'siema' + key" :class="'siema' + key" :options="siemaOptions">
                          <div>
                            <post-block v-bind:channel="meta['channel_users'][posts[index].user]" v-bind:color="meta['color_users'][posts[index].user]" v-bind:content="posts[index]" v-bind:i="index"></post-block>
                          </div>
                          <div v-if="posts.length > (index + 1)">
                            <post-block v-bind:channel="meta['channel_users'][posts[index + 1].user]" v-bind:color="meta['color_users'][posts[index + 1].user]" v-bind:content="posts[index + 1]" v-bind:i="index + 1"></post-block>
                          </div>
                        </siema>
                    </div> -->
                </div>
            </div>

            <div id="loader" v-if="eol == false" v-infinite-scroll="getNextPosts" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
                <div v-if="posts.length > 1 && busy && isActivePost == false" class="loader__container--bottom ">
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
import http_build_query from "locutus/php/url/http_build_query";
import config from "@/config";
import axios from "axios";
import VuePullRefresh from "vue-pull-refresh";
import Siema from 'vue2-siema'

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
  name: "gtbSource",
  components: {
    PostBlock,
    PostDetail,
    "vue-pull-refresh": VuePullRefresh
  },
  data() {
    return {
      posts: [],
      errors: [],
      activePost: 0,
      isActivePost: false,
      windowWidth: 0,
      meta: "",
      busy: false,
      eol: false,
      pullConfig: {
        errorLabel: "Error",
        startLabel: "Pull down to refresh",
        readyLabel: "Release to refresh",
        loadingLabel: ""
      },
      siemaOptions: {
        autoplaytime: 1000,
        duration: 400, 
        draggable: false,
        loop: true, 
      },
    };
  },
  computed: {
    isMobileView () {
      if (this.windowWidth < 640) {
        return true
      }
      return false
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);

      this.getWindowWidth();
    });
  },
  methods: {
      getPostsLength() {
          return this.posts.length;
      },
    getNext(index) {
        var next = (index + 1);

        if (next > this.posts.length - 1) next = 0;;
        var type = this.posts[next]['type']
        var user = this.posts[next]['user']
        var id = this.posts[next]['id']
        var path = '/#/source/' + type + '/' + user + '/' + id

        window.location = path;
        //window.location.reload();
        return this.posts[next];
    },
    getPrev(index) {
        var prev = index - 1;
        if (prev < 0) prev = this.posts.length - 1;
        var type = this.posts[prev]['type']
        var user = this.posts[prev]['user']
        var id = this.posts[prev]['id']
        var path = '/#/source/' + type + '/' + user + '/' + id

        window.location = path;
        //window.location.reload();
        return this.posts[prev];
    },
    onRefresh: function() {
      this.posts = "";
      this.getPosts();
      return new Promise(function(resolve, reject) {
        //setTimeout(function () {
        resolve();
        //}, 1000);
      });
    },
    getBlockSize: function(index) {
      if ((index - 1) % 4 == 0) {
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
    getPosts: function(openPost = false) {
      this.busy = true;
      var url =
        config.apiUrl +
        "/user/?username=" +
        this.$route.params.username +
        "&type=" +
        this.$route.params.type;

      axios
        .get(url)
        .then(response => {
          // JSON responses are automatically parsed.
          this.posts = response.data["feeds"];
          this.meta = response.data["meta"];
          this.busy = false;

        var user = this.posts[0].user;
        var channel = this.meta['channel_users'][user];
          this.$root.$children[0].$children[0].setSource(channel);

          if (this.$route.params.id != null) {
            this.isActivePost = true;
            this.getActivePost(this.$route.params.id);
          }
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    getNextPosts: function() {
      this.busy = true;
      var query = http_build_query(this.meta, "");
      var url =
        config.apiUrl +
        "/user_next/?username=" +
        this.$route.params.username +
        "&type=" +
        this.$route.params.type +
        "&" +
        query;

      axios
        .get(url)
        .then(response => {
          if (response.data["feeds"].length > 0) {
            for (var i = 0; i < response.data["feeds"].length; i++) {
              this.posts.push(response.data["feeds"][i]);
              this.$nextTick();
              this.$redrawVueMasonry();
            }
            this.meta = response.data["meta"];
            this.busy = false;
          } else {
            this.eol = true;
          }
          this.$nextTick();
          this.$redrawVueMasonry();
        })
        .catch(e => {
          this.errors.push(e);
          this.busy = false;
        });
    },
    getActivePost: function(id) {
      var open = "";
      var index = 0;

      this.posts.forEach(function(post) {
        if (post["id"] == id) {
          open = index;
        }
        index++;
      }, this);

      if (open != "") {
        this.setActivePost(open);
      }
    },
    closeActivePost: function() {
      this.isActivePost = false;
      var a = document.getElementById("active-post");
      a.style.height = 0;
    },
    openActivePost: function() {
      var a = document.getElementById("active-post");
      var b = document.getElementById("post-detail");

      if (this.posts[this.activePost].media != "") {
        var c = document.getElementById("post-detail__image");
        if (c) {
          c.style.height = c.offsetWidth + "px";
        }
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

      if (this.$refs.postDetail.doPlay) {
        this.$refs.postDetail.doPlay();
      }
    },
    setActivePost: function(index) {
      this.isActivePost = true;
      this.activePost = index;
      this.openActivePost();
    },
    getWindowWidth: function(event) {
      this.windowWidth = document.documentElement.clientWidth;
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
    }
  },
  created() {
    this.getPosts(true);
  },
  watch: {
    "$route.params.username"(from, to) {
      // console.log(from)
      this.getPosts();
    }
    // '$route.params.id'(from, to) {
    //     if (this.$route.params.id == null) {
    //         this.isActivePost = false;
    //     }

    //     var open = '';
    //     var index = 0;
    //     this.posts.forEach(function(post) {
    //         if (post['id'] == this.$route.params.id) {
    //             open = index;
    //         }
    //         index++;
    //     }, this);

    //     this.activePost = open
    //     this.isActivePost = true
    //     var a = document.getElementById('active-post');
    //     var b = document.getElementById('post-detail');
    //     a.style.height = b.offsetHeight + 'px';

    // }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.active-post {
  overflow: hidden;
}

.source {
  margin: 0 -5px;
  width: calc(100% + 5px);
  z-index: 1000;
}
</style>
