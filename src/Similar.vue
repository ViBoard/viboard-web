<template>
    <div id="similar-videos">
        <div>
            <video-block
                v-for="item in videosList"
                :author="item.author"
                :permlink="item.permlink"
                :ap="false"
                :muted="true"
                :controls="false"
                :isPreview="true"
                :custom_player="false"
                :key="item.id">
            </video-block>
        </div>
    </div>
</template>

<script>
    import VideoBlock from './VideoBlock.vue'
    import {getVideoContent} from './getVideoContent.js'
    import {parseBody} from './parseBody.js'
    import {beneficiaries} from "./beneficiaries"
    
    let golos = require('golos-js')
    
    export default {
        name: "Similar",
        
        data: function () {
            return {
                videosList: [],
                video_id: 0
            }
        },
        
        components: {
            VideoBlock,
        },
        
        mixins: [parseBody, getVideoContent, beneficiaries],
        
        methods: {
            kekule: function (tags, author, video_id) {
                let videosCount = 5
                let totalSelect = 10
                let selectByAuthor = 3
                let selectByTags = 7
                let vm = this
                let videosListTotal = []
                vm.video_id = video_id
                
                let getPromise = new Promise((resolve, reject) => {
                    let videos_added_tag = 0
                    console.log("Similar tags:", tags, author)
                    let queryTag = {
                        select_tags: tags,
                        limit: selectByTags * 3,
                    }
                    golos.api.getDiscussionsByTrending(queryTag, function (err, result) {
                        if (!err) {
                            console.log("Tags:", result)
                            for (let i = 0; i < result.length; ++i) {
                                let v = result[i]
                                console.log("QWE PPPP getDiscussionsByTrending ", v.id, vm.video_id)
                                if (vm.parseBody(v.body) && vm.beneficiaries(v) && v.id != vm.video_id) {
                                    // console.push("push")
                                    videosListTotal.push({id: i, permlink: v.permlink, author: v.author})
                                    videos_added_tag++
                                }
                                if (videos_added_tag == selectByTags) {
                                    break
                                }
                            }
                            
                            let videos_added_author = 0
                            let queryAuthor = {
                                select_authors: [author],
                                limit: selectByAuthor * 3,
                            }
                            golos.api.getDiscussionsByBlog(queryAuthor, function (err, result) {
                                if (!err) {
                                    console.log("Author:", result)
                                    for (let i = 0; i < result.length; ++i) {
                                        let v = result[i]
                                        console.log("QWE PPPP getDiscussionsByBlog ", v.id, vm.video_id)
                                        if (vm.parseBody(v.body) && vm.beneficiaries(v) && v.id != vm.video_id) {
                                            videosListTotal.push({id: i, permlink: v.permlink, author: v.author})
                                            videos_added_author++
                                        }
                                        if (videos_added_author == selectByAuthor) {
                                            break
                                        }
                                    }
                                    resolve()
                                } else {
                                    console.log(err)
                                    reject(err)
                                }
                            })
                        } else {
                            console.log(err)
                            reject(err)
                        }
                    })
                    
                    
                })
                getPromise.then((successMessage) => {
                    console.log("successMessage:", successMessage)
                    console.log("before:", videosListTotal)
                    
                    function shuffle(array) {
                        let currentIndex = array.length, temporaryValue, randomIndex
                        
                        // While there remain elements to shuffle...
                        while (0 !== currentIndex) {
                            
                            // Pick a remaining element...
                            randomIndex = Math.floor(Math.random() * currentIndex)
                            currentIndex -= 1
                            
                            // And swap it with the current element.
                            temporaryValue = array[currentIndex]
                            array[currentIndex] = array[randomIndex]
                            array[randomIndex] = temporaryValue
                        }
                        
                        return array
                    }
                    
                    function getUnique(arr) {
                        let i = 0,
                            current,
                            length = arr.length,
                            unique = []
                        for (; i < length; i++) {
                            current = arr[i]
                            if (!~unique.indexOf(current)) {
                                unique.push(current)
                            }
                        }
                        return unique
                    }
                    
                    videosListTotal = shuffle(getUnique(videosListTotal))
                    
                    for (let i = 0; i < videosCount; ++i) {
                        if (videosListTotal[i]) {
                            vm.videosList.push(videosListTotal[i])
                        }
                    }
                    console.log("after:", vm.videosList)
                    
                })
                
            },
        },
    }


</script>

<style scoped>

</style>
