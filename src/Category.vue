<template>
  <div class="category mb-5">
    <h3> {{ title }} </h3>
    <div :class="gridClass">
      <video-block
        v-for="item in videosList"
        :author="item.author"
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
  import {beneficiaries} from "./beneficiaries";
  
  let golos = require('golos-js');
  
  export default {
    name: 'Category',
    
    components: {
      VideoBlock,
    },
    
    mixins: [parseBody, beneficiaries],
    
    props: {
      method: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'hot',
            'trending',
            'new',
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
              if (vm.parseBody(v.body) && vm.beneficiaries(v)) {
                vm.videosList.push({id: i, permlink: v.permlink, author: v.author});
                videos_added++;
              }
              if (videos_added == vm.nVideos) {
                break
              }
            }
          }
        });
      } else if (vm.method == "hot") {
        var videos_added = 0;
        
        golos.api.getDiscussionsByHot(query, function (err, result) {
          if (!err) {
            for (var i = 0; i < result.length; ++i) {
              var v = result[i];
              if (vm.parseBody(v.body) && vm.beneficiaries(v)) {
                vm.videosList.push({id: i, permlink: v.permlink, author: v.author});
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
              if (vm.parseBody(v.body) && vm.beneficiaries(v)) {
                vm.videosList.push({id: i, permlink: v.permlink, author: v.author})
                videos_added++;
              }
              if (videos_added == vm.nVideos) {
                break
              }
            }
          }
        });
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
