import Vue from 'vue'
import Index from './Index.vue'
import New from './New.vue'
import Single from './Single.vue'
import Upload from './Upload'
import Embed from './Embed.vue'
import Landing from './Landing.vue'
import Confirm from './Confirm.vue'
import FAQ from './FAQ.vue'

// пути к страницам
const routes = {
  '/index': Index,
  '/new': New,
  '/watch': Single,
  '/upload': Upload,
  '/embed': Embed,
  '/': Index,
  '/confirm' : Confirm,
  '/FAQ' : FAQ
};


new Vue({
  // элемент на странице, в который рендерится приложение
  el: '#app',

  data: {
    currentRoute: window.location.pathname,
  },

  computed: {
    ViewComponent() {
      return routes[this.currentRoute]
    }
  },

  render(h) { return h(this.ViewComponent) }
});
