<template>
  <a :href="link.href"> {{ link.text }} </a>
</template>

<script>
export default {
  name: 'SidebarLink',
  props: {
    link: {
      type: Object,
      required: true,
    }
  }
}
</script>

<style>
</style>
