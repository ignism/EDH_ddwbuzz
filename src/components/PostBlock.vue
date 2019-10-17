<template>
    <div class="post-block">
        <div class="post__content" v-bind:class="getBlockColor(index)" v-bind:style="{ 'background-image': getBackground(index), 'animation-delay': (100 * index) + 'ms' }">
          
            <router-link v-bind:to="{path: '/source/' + type + '/' + user + '/' + id}">
            <div class="gradient" v-on:click="activate">
                <div class="align-top">
                    <span class="timestamp">
                        {{ getTime() }}
                    </span>
                </div>
                <div class="align-bottom">
                    <router-link v-bind:to="{path: '/source/' + type + '/' + user}" v-on:click.native="deactivate">
                        <span class="user" v-bind:style="{ 'background': getLabelColor() }">
                            {{ getChannel() }}
                        </span>
                    </router-link>
                    <!-- <router-link v-bind:to="{path: '/source/' + type + '/' + user + '/' + index}"> -->
                    <div class="activate-post" v-on:click="activate">
                        <span v-if="title" class="title">
                            {{ title }}
                        </span>
                        <span v-else-if="type == 'twitter'" class="text--light">
                            {{ getText() }}
                        </span>
                        <span v-else class="text">
                            {{ text }}
                        </span>
                    </div>
                    <!-- </router-link> -->
                </div>
            </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css"

export default {
  name: "post-block",
  components: {
    "d-player": VueDPlayer
  },
  props: ["i", "content", "color", "channel"],
  data() {
    return {
      index: this.i,
      id: this.content.id,
      type: this.content.type,
      user: this.content.user,
      time: this.content.time,
      date: this.content.date,
      timestamp: this.content.timestamp,
      title: this.content.title,
      text: this.content.text,
      tags: this.content.tags,
      media: this.content.media,
      video: {
        url: this.content.video,
        pic: this.content.media
      },
      player: null,
      url: this.content.url,
      DPlayerOptions: {
              volume: "0.0",
              video: {
                url: this.content.video,
                pic: this.content.media
              },
              url: this.content.url,
              autoplay: false,
              player: null,
              contextmenu: [
                  {
                  text: "Get the buzz",
                  link: ""
                  }
              ],
            },
    };
  },
  methods: {
    getChannel: function() {
      if (this.channel != "" && this.channel != null) {
        return this.channel;
      }
      return this.user;
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
    },
    getLabelColor: function() {
      // return "#" + this.color;
      return '#00f000';
    },
    getBackground(index) {
      if (this.media == "") {
        // // var startColor = 'rgb(0, 240, 0)';
        // // var stopColor = '#381d58';
        // var r = Math.floor(Math.random() * 3) + 1;
        // if (index % 3 == 0) {
        //     // stopColor = '#1F1130';
        //     r += 3;

        // } else if (index % 2 == 0) {
        //     // startColor = '#8258C9';
        //     r+= 5;
        // }
        return "";
        // return 'linear-gradient('+startColor+', '+stopColor+')'
      } else {
        return "url(" + this.media + ")";
      }
    },
    getText: function() {
      var fullString = "" + this.text;
      var maxLength = 500;

      if (window.innerWidth < 960) {
        var maxLength = 150;
      }

      if (window.innerWidth < 640) {
        var maxLength = 100;
      }

      var trimmedString = fullString.substr(0, maxLength);

      trimmedString = trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
      );

      if (trimmedString.length < fullString.length) {
        trimmedString = trimmedString + "...";
      }
      return trimmedString;
    },
    activate: function() {
      // TODO SOURCE SLIDERS
      if (this.$parent.$el.className == "source") {
        this.$parent.setActivePost(this.index);
      } else {
        this.$parent.$parent.removeSiemaInterval();
      }
    },
    deactivate: function() {
      this.$parent.closeActivePost();
    },
    getTime: function() {
      if (this.time == "Now") return this.time;

      var inputDate = new Date(this.timestamp * 1000);
      var today = new Date();
      if (today.setHours(0, 0, 0, 0) == inputDate.setHours(0, 0, 0, 0)) {
        return this.time;
      }
      var oneDay = 24 * 60 * 60 * 1000;
      var diffDays = Math.round(
        Math.abs((inputDate.getTime() - today.getTime()) / oneDay)
      );

      if (diffDays == 1) {
        return "A day ago";
      }
      if (diffDays > 1 && diffDays < 7) {
        return diffDays + " days ago";
      }

      var diffWeeks = Math.round(diffDays / 7);

      if (diffWeeks == 1) {
        return "Last week";
      }
      if (diffWeeks < 4) {
        return diffWeeks + " weeks ago";
      }

      var diffMonths = Math.round(diffWeeks / 4);

      if (diffMonths == 1) {
        return "Last month";
      }

      return diffMonths + " months ago";
    }
  }
};
</script>

<style scoped>
.background--tint-2 {
  background: #dcdcdc;
}

.background--tint-2 {
  background: #dcdcdc;
}

.background--tint-3 {
  background: #cbcbcb;
}

.align-top {
  position: absolute;
  top: 33px;
}

.align-bottom {
  position: absolute;
  bottom: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 55%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.activate-post {
  cursor: pointer;
}

.post-block {
  min-height: 33.3333vw;
}

@media screen and (max-width: 639px) {
  .post-block {
    min-height: 100vw;
  }
}


</style>
