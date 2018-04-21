import Vue from 'vue'
import Index from './Index.vue'
import New from './New.vue'
import Single from './Single.vue'
import Upload from './Upload'
import Embed from './Embed.vue'
import Blog from './Blog.vue'

// пути к страницам
const routes = {
  '/': Index,
  '/new': New,
  '/watch': Single,
  '/upload': Upload,
  '/embed': Embed,
  '/blog': Blog
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
