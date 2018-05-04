<template>
  <div class="category mb-5">
    <h3> {{ title }} </h3>
    <div :class="gridClass">
      <video-block
        v-for="item in videosList"
        :author="item.author"
        :link="item.link"
        :permlink="item.permlink"
        :ap="ap"
        :muted="true"
        :controls="false"
        :isPreview="isPreview"
        :custom_player="custom_player"
        :key="item.id">
      </video-block>
    </div>
  </div>
</template>

<script>
  import VideoBlock from './VideoBlock.vue'
  import {parseBody} from './parseBody.js'

  let golos = require('golos-js');
  let Cookies = require('js-cookie');
  export default {
    name: 'Category',

    components: {
      VideoBlock,
    },

    mixins: [parseBody],

    props: {
      method: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'hot',
            'trending',
            'new',
            'personal',
            'lenta'
          ].indexOf(value) !== -1
        },
      },
      title: {
        type: String,
        required: true,
      },
      nVideos: {
        type: Number,
        required: true,
      },
      gridClass: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'grid-big',
            'grid-medium',
            'grid-small',
          ].indexOf(value) !== -1
        }
      },
      ap: {
        type: Boolean,
        default: false,
      },
      muted: {
        type: Boolean,
        default: false,
      },
      controls: {
        type: Boolean,
        default: false,
      },
      isPreview: {
        type: Boolean,
        default: false,
      },
      custom_player: {
        type: Boolean,
        default: false,
      }
    },

    data: function () {
      return {
        videosList: [],
      }
    },

    created: function () {
      var vm = this;

      var query = {
        select_tags: ['viboard-videos'],
        limit: vm.nVideos * 3,
      };

      // ужасая копипаста, но почему-то пока не получается передавать функции в props
      if (vm.method == "new") {
        var videos_added = 0;

        golos.api.getDiscussionsByCreated(query, function (err, result) {
          if (!err) {
            for (var i = 0; i < result.length; ++i) {
              let v = result[i];
              if (v.beneficiaries[0]) {
                if (v.beneficiaries[0].account == "viboard" && v.beneficiaries[0].weight >= 1000) {
                  console.log("norm")
                  if (vm.parseBody(v.body)) {
                    vm.videosList.push({
                      id: i,
                      permlink: v.permlink,
                      author: v.author,
                      link: "/personal?author=" + v.author
                    });
                    videos_added++;
                  }
                  if (videos_added == vm.nVideos) {
                    break
                  }
                }
              }
              console.log("ne norm")
            }
          }
        });
      } else if (vm.method == "hot") {
        var videos_added = 0;

        golos.api.getDiscussionsByHot(query, function (err, result) {
          if (!err) {
            for (var i = 0; i < result.length; ++i) {
              var v = result[i];
              if (vm.parseBody(v.body)) {
                vm.videosList.push({
                  id: i,
                  permlink: v.permlink,
                  author: v.author,
                  link: "/personal?author=" + v.author
                });
                videos_added++;
              }
              if (videos_added == vm.nVideos) {
                break
              }
            }
          }
        });
      } else if (vm.method == "trending") {
        var videos_added = 0;

        golos.api.getDiscussionsByTrending(query, function (err, result) {
          if (!err) {
            for (var i = 0; i < result.length; ++i) {
              var v = result[i];
              if (vm.parseBody(v.body)) {
                vm.videosList.push({
                  id: i,
                  permlink: v.permlink,
                  author: v.author,
                  link: "/personal?author=" + v.author
                });
                videos_added++;
              }
              if (videos_added == vm.nVideos) {
                break
              }
            }
          }
        });
      } else if (vm.method == "personal") {
        var url = new URL(window.location.href);
        var query = {
          select_authors: [url.searchParams.get("author")],
          select_tags: ['viboard-videos'],
          limit: 100
        };

        golos.api.getDiscussionsByBlog(query, function (err, result) {
          if (!err) {
            for (var i = 0; i < result.length; ++i) {
              var v = result[i];
              if (vm.parseBody(v.body)) {
                vm.videosList.push({
                  id: i,
                  permlink: v.permlink,
                  author: v.author,
                  link: "/personal?author=" + v.author
                });
              }
            }
          }
          console.log(err);
        });
      } else if (vm.method == "lenta") {

        let temp_login = Cookies.get("login");
        if (temp_login) {
          let people=[];
          let getPromise = new Promise((resolve, reject) => {
            golos.api.getFollowing(temp_login, '', null, 100, function (err, result) {
              if (!err) {
                result.forEach(function (item) {
                  if (item['what'][0] === 'blog') {
                    people.push(item['following']);
                  }
                });
                resolve();
              }
              else console.error("ОШИБКА АПИ ПРИ ПОЛУЧЕНИИ ПОДПИСОК", err);
            });
          });

          getPromise.then((successMessage) => {
            let query = {
              select_authors: people,
              select_tags: ['viboard-videos'],
              limit: 100
            };

            golos.api.getDiscussionsByBlog(query, function (err, result) {
              if (!err) {
                for (var i = 0; i < result.length; ++i) {
                  var v = result[i];
                  if (vm.parseBody(v.body)) {
                    vm.videosList.push({
                      id: i,
                      permlink: v.permlink,
                      author: v.author,
                      link: "/personal?author=" + v.author
                    });
                  }
                }
              }
              console.log(err);
            });
          });
        }
      }
    }
  }
</script>

<style>
  .grid-big {
    display: grid;
    grid-template-columns: 33% 33% 33%;
  }

  .grid-medium {
    display: grid;
    grid-template-columns: 25% 25% 25%;
  }

  .grid-small {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
  }

  .video-block {
    padding: 0.5em;
    padding-right: 1.5em;
  }

  .video-element {
    width: 100%;
    /* -webkit-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.2);
    -moz-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.2);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0, 0.2); */
  }

  video:hover {
    /* -webkit-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.3);
    -moz-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.3);
    box-shadow: 3px 3px 0px 0px rgba(0,0,0.3); */
  }
</style>
