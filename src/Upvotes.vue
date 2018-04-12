<template>
  <div id="upvotes">
    <div id="nUpvotes">{{ upvotes.length }}</div>
    <span id="icon" @click="putUpvote">
      <svg viewBox="0 0 33 33" xml:space="preserve"> 
        <g>
          <circle cx="16" cy="16" r="15" 
            :stroke="mainColor" 
            :fill="bgColor">
          </circle>
          <path d="M16.699,11.293c-0.384-0.38-1.044-0.381-1.429,0l-6.999,6.899c-0.394,0.391-0.394,1.024,0,1.414 c0.395,0.391,1.034,0.391,1.429,0l6.285-6.195l6.285,6.196c0.394,0.391,1.034,0.391,1.429,0c0.394-0.391,0.394-1.024,0-1.414 L16.699,11.293z" 
            :fill="mainColor">
          </path>
        </g>
      </svg>
    </span>
    <div v-if="upvotes.length" id="toggle" @click="toggleUpvotes">
      {{ upvotesShown ? "скрыть" : "показать" }}
      <table id="upvoters" v-if="upvotesShown">
        <tr v-for="u in upvotes" class="upvoter">
          <td class="upvote-name">{{ u.name }}</td> <td class="upvote-power">{{ u.power }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  var golos = require('golos-js')
  var Cookies = require('js-cookie')
  export default {
    name: 'Upvotes',

    data: function() {
      return {
        upvotesShown: false,
        upvotes: [],
      }
    },

    props: {
      permlink: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      }
    },

    methods: {
      update: function() {
        var vm = this;
        vm.upvotes = [];
        golos.api.getContent(vm.author, vm.permlink, function(err, result) {
          if (!err) {
            result.active_votes.forEach(function(item, i, arr) {
              vm.upvotes.push({
                                name: item.voter, 
                                power: item.percent/100 + "%"
                              })
            });
          }
          else console.error(err);
        });
      },

      putUpvote: function() {
        var vm = this;
        var login = Cookies.get("login");
        var password = Cookies.get("posting_private");

        var auths = {
          posting: [[golos.auth.wifToPublic(password)]] // golos.auth.wifToPublic(password)
        };

        var verifyResult = golos.auth.verify(login, password, auths);
        console.log('ver_res', verifyResult)
        var wif = password;
        golos.broadcast.vote(wif, login, vm.author, vm.permlink, 10000, function(err, result) {
          console.log(err, result);
        });
        vm.update();
      },

      toggleUpvotes: function() {
        this.upvotesShown = !this.upvotesShown;
      }, 

      toggleIcon: function() {
        this.iconIsActive = !this.iconIsActive;
      }, 
    },

    computed: {
      iconIsActive: function() {
        var vm = this;
        var login = Cookies.get("login");
        for (var i = 0; i < vm.upvotes.length; ++i) {
          if (vm.upvotes[i].name == login) {
            return true;
          }
        }
        return false;
      },

      mainColor: function() {
        return this.iconIsActive ? '#fafafa' : '#000';
      },

      bgColor: function() {
        return !this.iconIsActive ? '#fafafa' : '#000';
      }
    },

    created: function() {
      this.update();
    }
  }
</script>

<style>
#upvotes {
  margin-top: 0.5em;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#toggle {
  cursor: pointer;
}

#nUpvotes {
  font-size: 1.7em;
  font-weight: bold;
  margin-right: 0.3em;
}

#icon {
  margin-right: 1em;
  width: 1.5em;
  height: 1.5em;
  cursor: pointer;
}

</style>
