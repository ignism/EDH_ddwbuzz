<template>
    <div class="post-detail">
        <div class="toggle-detail" v-on:click="goBack">
            <img class="arrow" src="../assets/svg/arrow_back.svg">
        </div>
        <div class="button-right" v-on:click="getNext">
            <img class="arrow" src="../assets/svg/arrow_right.svg" style="margin-top: 5px">
        </div>
         <div class="button-left" v-on:click="getPrev">
            <img class="arrow" src="../assets/svg/arrow_left.svg"  style="margin-top: 5px">
        </div>
        <div class="post-detail__media">
            <div class="post-detail__content">
                <d-player v-if="hasVideo" 
                    :options="DPlayerOptions"
                    lang="en"
                    @play="play"
                    ref="player" style="width: 100%">
                </d-player>
                <div v-if="!hasVideo" id="post-detail__image" v-bind:class="getBlockColor(index)" v-bind:style="{'background-image': backImage}">

                </div>
            </div>
        </div>
        <div id="post-detail__text" class="post-detail__text">
            <div class="post-detail__content">
                <div class="post-detail__header">
                    <span class="timestamp">{{ time }}</span>
                </div>
                <div class="post-detail__body">
                    <h3 v-if="title != ''" class="post-detail__title">{{ title }}</h3>
                    <p v-if="type == 'instagram' || type == 'twitter'" class="post-detail__text--large">{{ text }}</p>
                    <p v-else>{{ text }}</p>
                </div>
                <div class="post-detail__source">
                    <a v-bind:href="url" target="_blank" class="source-button">visit source</a>
                </div>
            </div>
        </div>
        <div class="source-link">
            <router-link v-bind:to="{path: '/source/' + type + '/' + user}" v-on:click.native="goBack">+ <span>see more</span></router-link>
        </div>
    </div>
</template>

<script>
import PostBlock from "@/components/PostBlock";
import config from "@/config";
import axios from "axios";
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";

export default {
  name: "post-detail",
  components: {
    PostBlock,
    "d-player": VueDPlayer
  },
  props: ["i", "content"],
  data() {
    return {
      hasVideo: false,
      index: this.i,
      id: this.content.id,
      type: this.content.type,
      user: this.content.user,
      time: this.content.time,
      date: this.content.date,
      title: this.content.title,
      text: this.content.text,
      tags: this.content.tags,
      media: this.content.media,
      url: this.content.url,
      video: {
        url: this.content.video,
        pic: this.content.media
      },
      DPlayerOptions: {
        volume: "0.5",
        video: {
          url: this.content.video,
          pic: this.content.media
        },
        loop: true,
        contextmenu: [
          {
            text: "Get the buzz",
            link: ""
          }
        ]
      }
    };
  },
  methods: {
    play() {
      this.$root.$emit('play-callback')
    },
    getNext() {
      var length = this.$parent.getPostsLength();
      var newcontent = this.$parent.getNext(this.index);
      this.resetData(newcontent);
      this.index++;
      if (this.index > length - 1) this.index = 0;
    },
    getPrev() {
      var length = this.$parent.getPostsLength();
      var newcontent = this.$parent.getPrev(this.index);
      this.resetData(newcontent);
      this.index--;
      if (this.index < 0) this.index = length - 1;
    },
    goBack: function() {
      if (this.$refs.player) this.$refs.player.dp.pause();
      this.$parent.closeActivePost();
    },
    setData: function() {
      this.index = this.i;
      this.type = this.content.type;
      this.user = this.content.user;
      this.time = this.content.time;
      this.date = this.content.date;
      this.title = this.content.title;
      this.text = this.content.text;
      this.tags = this.content.tags;
      this.media = this.content.media;
      this.video = {
        url: this.content.video,
        pic: this.content.media
      },
      this.url = this.content.url;
      this.setVideo();
      //this.$forceUpdate();
    },
    resetData: function(newcontent) {
      this.type = newcontent.type;
      this.user = newcontent.user;
      this.time = newcontent.time;
      this.date = newcontent.date;
      this.title = newcontent.title;
      this.text = newcontent.text;
      this.tags = newcontent.tags;
      this.media = newcontent.media;
      this.video = {
        url: newcontent.video,
        pic: newcontent.media
      },
      this.url = newcontent.url;
      this.setVideo();
      //this.$forceUpdate();
    },
    setVideo: function() {
      if (this.video["url"] != null && this.video.url != "") {
        this.DPlayerOptions.video.url = this.video.url;
        this.DPlayerOptions.video.pic = this.video.pic
        this.hasVideo = true;

        let interval = setInterval(() => {
          if (this.$refs.player) {
            this.$refs.player.dp.play()
            clearInterval(interval)
          }
        }, 400)
      } else {
        this.hasVideo = false;
      }
    },
    getBlockColor: function(index) {
      var r = Math.floor(Math.random() * 3) + 1;
      if (index % 3 == 0) {
        // stopColor = '#1F1130';
        r += 3;
      } else if (index % 2 == 0) {
        // startColor = '#8258C9';
        r += 5;
      }
      return "background-pattern-0" + r;
    }
  },
  computed: {
    backImage: function() {
      if (this.media == null || this.media == "") return null;
      return "url(" + this.media + ")";
    },
  },
  mounted() {
    this.setVideo();
  },
  watch: {
    content: function() {
      this.setData();
    }
  }
};
</script>

<style scoped>
.toggle-detail {
  position: absolute;
  right: 0;
  top: 0;
  width: 60px;
  height: 60px;
  background: #151515;
  z-index: 9999;
}

.button-right {
  position: absolute;
  right: 0;
  top: 30%;
  width: 60px;
  height: 60px;
  background: #151515;
  z-index: +1;
}

.button-left {
  position: absolute;
  left: 0;
  top: 30%;
  width: 60px;
  height: 60px;
  background: #151515;
  z-index: +1;
}

.timestamp {
  color: #151515;
  background: 0;
  padding: 0;
  margin: 0;
}

.source-button {
  text-decoration: none;
  background-color: rgb(0, 240, 0);
  color: white;
  font-family: Montserrat;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0.37px;
  text-transform: uppercase;
  padding: 12px 16px;
  border-radius: 2px;
}

.arrow {
  padding: 12px;
  cursor: pointer;
}

.source-link {
  text-align: center;
  width: 100%;
  height: 80px;
  background: white;
}

.source-link > .router-link-active {
  position: absolute;
  top: 0;
  left: 50%;
  text-decoration: none;
  text-align: center;
  font-family: Montserrat;
  font-size: 48px;
  line-height: 64px;
  height: 64px;
  width: 200px;
  margin-left: -100px;
  font-weight: 600;
  color: rgb(0, 240, 0);
}

.source-link > .router-link-active > span {
  text-decoration: none;
  position: relative;
  top: -9px;
  font-family: Montserrat;
  font-size: 24px;
  line-height: 64px;
  height: 64px;
  font-weight: 600;
  padding-bottom: 10px;
  color: rgb(0, 240, 0);
}

@media screen and (min-width: 1799px) {
  .toggle-detail {
    right: 1px;
  }

  .button-right {
    right: 1px;
  }
}
</style>
