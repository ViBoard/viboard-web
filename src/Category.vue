<template>
  <div class="category">
    <div class="category-title"> {{ title }} </div>
    <div v-bind:class="gridClass">
      <video-block
        v-for="item in videosList"
        v-bind:video="item"
        v-bind:ap="ap"
        v-bind:muted="muted"
        v-bind:controls="controls"
        v-bind:key="item.id">
      </video-block>
    </div>
  </div>
</template>

<script>
import VideoBlock from './VideoBlock.vue'
var golos = require('golos-js')

export default {
  name: 'Category',

  components: {
    VideoBlock,
  },

  props: {
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
  },

  data: function() {
    return {
      videosList: [],
    }
  },

  created: function() {
    var vm = this;

    var query = {
      select_tags: ['videotest'],
      limit: vm.nVideos,
    };

    // пока что везде вывводим свежее, как будет постов побольше, надо будет передавать функцию через props
    golos.api.getDiscussionsByCreated(query, function(err, result) {
      if (!err) {
        for (var i = 0; i < result.length; ++i) {
          var v = result[i];
          vm.videosList.push({ id: i, title: v.title, ipfs_id: v.body, author: v.author, total: v.curator_payout_value })
        }
      } else {
        console.log(err)
        console.log(err.payload)
      }
    });
  }
}
</script>

<style>
.category {
  margin-top: 2em;
  margin-left: 150px;
  padding: 1em;
}

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

video {
  width: 100%;
  -webkit-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.2);
  -moz-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.2);
  box-shadow: 3px 3px 0px 0px rgba(0,0,0, 0.2);
}

video:hover {
  -webkit-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.3);
  box-shadow: 3px 3px 0px 0px rgba(0,0,0.3);
}
</style>
