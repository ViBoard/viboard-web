<template>
  <div class="comments">
    <div v-for="c in children" class="comment">
      <div class="comment-author"> {{ c.author }} </div>
      <div class="comment-body" v-html="c.body"></div>
      <div class="reply">ответить</div>
      <Comments
           :author="c.author"
           :permlink="c.permlink"
      />
    </div>
  </div>
</template>

<script>
  var golos = require('golos-js')
  var markdown = require('markdown').markdown
  export default {
    name: 'Comments',

    props: {
      permlink: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
    },

    data: function() {
      return {
        children: [],
      }
    },

    methods: {
      update: function() {
        var vm = this;
        golos.api.getContentReplies(vm.author, vm.permlink, function(err, result) {
          if (!err) {
            console.log(result);
            result.forEach(function(item) {
              vm.children.push({
                author: item.author,
                permlink: item.permlink,
                body: markdown.toHTML(item.body).replace(/(?:\r\n|\r|\n)/g, '<br/>')
              })
            });
          }
          else console.error(err);
        });
      }
    },

    created:  function() {
      this.update();
    }
}
</script>

<style>
.comment {
  padding-left: 0.5em;
  border-top:0px solid #d8d8d8;
  border-right:0px solid #d8d8d8;
  border-bottom:0px solid #d8d8d8;
  border-left:2px solid #d8d8d8;
  margin-left: 0.7em;
}

.comment-author {
  padding-bottom: 0.3em;
  font-weight: bolder;
}

.comment-body {
  padding-left: 0.3em;
}

.reply {
  padding-left: 0.3em;
  padding-top: 1.3em;
  font-size: 0.8em;
  text-decoration: underline;
  margin-bottom: 2em;
  cursor: pointer;
}

</style>
