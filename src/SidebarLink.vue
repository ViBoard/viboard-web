<template>
    <a class="sidebar-link" :href="link.href">
        <img :src="'img/'+link.icon" class="sidebar-icon" style="vertical-align: middle;">
        {{ link.text }}
    </a>
</template>

<script>
    export default {
        name: 'SidebarLink',
        props: {
            link: {
                type: Object,
                required: true,
            },
        },
    }
</script>

<style>
    .sidebar-link {
        color: black;
        text-decoration: none;
    }
    
    .sidebar-icon {
        height: 1.3em;
        margin-right: 0.3em;
        opacity: 0.85;
    }
</style>
