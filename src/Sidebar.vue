<template>
   <div id="sidebar">
    <nav>
      <sidebar-link
         v-for="item in LinksList"
         v-bind:link="item"
         v-bind:key="item.id">
      </sidebar-link>
    </nav>
  </div>
</template>

<script>
import SidebarLink from './SidebarLink.vue'

export default {
  name: 'Sidebar',
  
  components: {
    SidebarLink,
  },

  props: {
    LinksList: {
      type: Array,
      required: true,
    }
  }

}
</script>

<style>
#sidebar a, #sidebar div {
  padding-left: 1em;
  margin-top: 1em;
  display: block;
}

nav {
  padding-top: 5em;
  position:fixed;
}
</style>
