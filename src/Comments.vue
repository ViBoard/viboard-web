<template>
  <div class="comments">
    <div v-if="!formOpened" class="reply" @click="formOpened=true">ответить</div>
    <div class="reply-form comment" v-if="formOpened">
      <textarea rows=10 cols=70 v-model="commentText"/></br>
      <div class="reply-send" @click="sendComment">отправить</div>
      <div class="reply-close" @click="formOpened=false">отмена</div>
    </div>
    <div v-for="c in children" class="comment">
      <div class="comment-author"> {{ c.author }} </div>
     <div class="comment-body" v-html="c.body"></div>
      <Upvotes
         :author="c.author"
         :permlink="c.permlink"
      />
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
  var Cookies = require('js-cookie')
  import Upvotes from './Upvotes.vue'
  export default {
    name: 'Comments',

    components: {
      Upvotes
    },

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
        formOpened: false,
        commentText: "",
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
      },

      sendComment: function() {
        var vm = this;
        var wif = Cookies.get("posting_private");
        var author = Cookies.get("login")
        var permlink = 're-' + vm.author + '-' + vm.permlink + '-' + Date.now();
        var title = '';
        var body = vm.commentText;
        var jsonMetadata = '{}';
        golos.broadcast.comment(wif, vm.author, vm.permlink, author, permlink, title, body, jsonMetadata, function(err, result) {
          console.log(err, result);
          if (!err) {
            console.log('comment', result);
          }
          else console.error(err);
          vm.update();
          vm.formOpened = false;
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
  margin-top: 1.5em;
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
  padding-left: 1em;
}

.reply, .reply-send, .reply-close {
  display: inline-block;
  padding-left: 0.3em;
  text-decoration: underline;
  margin-bottom: 1em;
  cursor: pointer;
  margin-bottom: 1em;
}

.reply-form {
  margin-bottom: 2em;
}

</style>
