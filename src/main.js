import Vue from 'vue'
import Index from './Index.vue'
import New from './New.vue'
import Single from './Single.vue'

// пути к страницам
const routes = {
  '/': Index,
  '/new': New,
  '/watch': Single,
}


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
})
