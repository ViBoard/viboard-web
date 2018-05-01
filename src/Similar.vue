<template>
  <div id="similar-videos">
    <h3>Похожее</h3>
    <div>
      <video-block
        v-for="item in videosList"
        :author="item.author"
        :permlink="item.permlink"
        :ap="false"
        :muted="true"
        :controls="false"
        :isPreview="true"
        :custom_player="false"
        :key="item.id">
      </video-block>
    </div>
  </div>
</template>

<script>
  import VideoBlock from './VideoBlock.vue'
  
  let golos = require('golos-js');
  
  export default {
    name: "Similar",
    
    data: function () {
      return {
        videosList: [],
        videosCount: 5,
        totalSelect: 10,
        selectByAuthor: 3,
        selectByTags: 7
      }
    },
    
    components: {
      VideoBlock,
    },
    
    kekule: function (tags, author) {
      let vm = this;
      let videosListTotal = [];
      
      let videos_added = 0;
      console.log("Similar tags:", tags, author);
      let query = {
        select_tags: ['viboard-videos'],
        limit: vm.videosCount * 3,
      };
      golos.api.getDiscussionsByTrending(query, function (err, result) {
        if (!err) {
          for (let i = 0; i < result.length; ++i) {
            let v = result[i];
            if (vm.parseBody(v.body)) {
              videosListTotal.push({id: i, permlink: v.permlink, author: v.author});
              videos_added++;
            }
            if (videos_added == vm.selectByTags) {
              break
            }
          }
        }
      });
      
      videos_added = 0;
      query = {
        select_authors: [author],
        limit: vm.videosCount * 3,
      };
      golos.api.getDiscussionsByBlog(query, function (err, result) {
        if (!err) {
          for (let i = 0; i < result.length; ++i) {
            let v = result[i];
            if (vm.parseBody(v.body)) {
              videosListTotal.push({id: i, permlink: v.permlink, author: v.author});
              videos_added++;
            }
            if (videos_added == vm.selectByAuthor) {
              break
            }
          }
        }
      });
      console.log(videosListTotal);
      
      function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        
        return array;
      }
      
      videosListTotal = shuffle(videosListTotal);
      console.log(videosListTotal);
      
      for (let i = 0; i < vm.videosCount; ++i) {
        vm.videosList.push(videosListTotal[i]);
      }
    }
  }


</script>

<style scoped>

</style>
