<template>
  <div class="comments">
    <div v-if="!formOpened" class="reply" @click="openForm">ответить</div>
    <div class="reply-form comment" v-if="formOpened">
      <textarea rows=10 cols=70 v-model="commentText"/></br>

      <b-badge variant="dark" v-if="loading">загрузка...</b-badge>
      <b-badge variant="danger" v-if="errorMessage"> {{ errorMessage }} </b-badge>
      <div class="clear"></div>
      <div class="reply-send" @click="sendComment">отправить</div>
      <div class="reply-close" @click="formOpened=false">отмена</div>
    </div>
    <div class="clear"></div>
    <b-badge variant="light" v-if="loginBadge"> <b-link href="#" v-b-modal.login_modal>войдите</b-link>, чтобы ответить </b-badge>
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
        loginBadge: false,
        errorMessage: "",
        loading: false,
      }
    },

    methods: {
      openForm: function() {
        this.loginBadge = false;
        var author = Cookies.get("login")
        if (!author) {
          this.loginBadge = true;
        } else {
          this.formOpened = true;
        }
      },

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
        vm.errorMessage = "";
        var wif = Cookies.get("posting_private");
        var author = Cookies.get("login");
        var permlink = 're-' + vm.author + '-' + vm.permlink + '-' + Date.now();
        var title = '';
        var body = vm.commentText;
        if (!body) {
          return;
        }
        vm.loading = true;
        var jsonMetadata = '{}';
        golos.broadcast.comment(wif, vm.author, vm.permlink, author, permlink, title, body, jsonMetadata, function(err, result) {
          console.log(err, result);
          vm.update();
          if (!err) {
            vm.formOpened = false;
            vm.loading = false;
          } else {
            vm.loading = false;
            console.error(err);
            if (err.message.includes("now - auth.last_post) > STEEMIT_MIN_REPLY_INTERVAL")) {
              vm.errorMessage = "вы можете комментировать не чаще чем раз в 20 секунд";
            } else if (err.message.includes("abs_rshares >")) {
              vm.errorMessage = "недостаточно силы голоса";
            } else if (err.message.includes("permlink.size() < STEEMIT_MAX_PERMLINK_LENGTH")) {
              vm.errorMessage = "вы превысили максимальную вложенность комментариев";
            } else {
              vm.errorMessage = "ошибка";
            }

          }
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
