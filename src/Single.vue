<template>
    <Navigation>
        <b-container>
            <b-row>
                <b-col>
                    <plyr-video :poster="previewSrc"
                                :videos="this.videos"
                                :autoplay="ap"
                                :muted="muted"
                                :controls="customControls"
                                :crossorigin="true"/>
                    <div class="video-header"> {{ title }}</div>
                    <div class="video-info">
                        <a :href="link">
                            <div class="video-author"> {{ author }}</div>
                        </a>
                        <div class="video-total"> {{ total }}</div>
                    </div>
                    <Upvotes
                        :author="author"
                        :permlink="permlink"
                    />
                    <div class="video-description" id="vid-descr"></div>
                    <div class="d-lg-none">
                        <h4>Похожие видео:</h4>
                        <Similar ref="similar1" id="similar-small"/>
                    </div>
                    <Comments id="comments"
                              :author="author"
                              :permlink="permlink"
                    />
                </b-col>
                <b-col cols="3" class="d-none d-lg-block">
                    <Similar ref="similar2"/>
                </b-col>
            </b-row>
        </b-container>
    </Navigation>
</template>

<script>
    var queryString = require('query-string')
    var golos = require('golos-js')
    import Comments from './Comments.vue'
    import Upvotes from './Upvotes.vue'
    import {PlyrVideo} from 'vue-plyr'
    import {getVideoContent} from './getVideoContent.js'
    import {parseBody} from './parseBody.js'
    
    import AppInner from './AppInner.vue'
    import VideoBlock from './VideoBlock.vue'
    import Navigation from './Navigation.vue'
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import BootstrapVue from 'bootstrap-vue'
    import Vue from 'vue'
    import Similar from './Similar.vue'
    
    Vue.use(BootstrapVue)
    
    export default {
        name: 'app',
        
        components: {
            Comments,
            Upvotes,
            PlyrVideo,
            VideoBlock,
            Navigation,
            AppInner,
            Similar,
        },
        
        mixins: [parseBody, getVideoContent],
        
        data: function () {
            return {
                author: "",
                link: "",
                permlink: "",
                src: "",
                previewSrc: "",
                title: "",
                description: "",
                total: "",
                videos: [],
                customControls: ``,
                tags: [],
                contentGot: false,
                ap: false,
                muted: false,
                controls: true,
                video_id: 0,
            }
        },
        
        computed: {
            getHref: function () {
                return 'watch?v=' + this.permlink + '&a=' + this.author
            },
        },
        
        created: function () {
            let vm = this
            let queries = queryString.parse(location.search)
            vm.author = queries.a
            vm.link = "/personal?author=" + queries.a
            vm.permlink = queries.v
            vm.getVideoContent(vm)
            let whileCheck = setInterval(function () {
                if (vm.contentGot) {
                    console.log("this", vm.tags, vm.author)
                    document.title = vm.title
                    vm.$refs.similar1.kekule(vm.tags, vm.author, vm.video_id)
                    vm.$refs.similar2.kekule(vm.tags, vm.author, vm.video_id)
                    
                    let i = 0
                    while (i < vm.description.length) {
                        let node = undefined
                        if (vm.description[i].substring(0, 2) == "<a") {
                            node = document.createElement("a")
                            node.href = vm.description[i + 1]
                            let textnode = document.createTextNode(vm.description[i + 2])
                            node.appendChild(textnode)
                            i += 3
                        } else {
                            node = document.createTextNode(vm.description[i])
                            i += 1
                        }
                        
                        document.getElementById("vid-descr").appendChild(node)
                    }
                    clearInterval(whileCheck)
                    
                }
            }, 100)
            
            console.log(vm.src, vm.ap)
        },
    }
</script>

<style>
    .video-header {
        overflow: hidden;
        font-size: 1.1em;
        margin-top: 0.3em;
    }
    
    .video-description {
        word-wrap: break-word;
        white-space: pre-wrap;
    }
    
    .video-info {
        font-size: 0.9em;
        color: #888888;
    }
    
    .video-info div {
        margin: 0;
        padding: 0;
        margin-top: 0.25em;
    }
    
    #comments {
        margin-top: 3em;
    }
    
    #similar-small {
        width: 40%;
    }
</style>