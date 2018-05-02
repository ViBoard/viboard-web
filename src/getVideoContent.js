let golos = require('golos-js');
export const getVideoContent = {
  methods: {
    getVideoContent: function (vm) {
      golos.api.getContent(vm.author, vm.permlink, function (err, result) {
        if (!err) {
          vm.title = result.title;
          vm.total = result.pending_payout_value;
          // console.log("Tags:", JSON.parse(result.json_metadata).tags);
          let parsed = vm.parseBody(result.body);
          // console.log("parsed:", parsed);
          vm.previewSrc = parsed.previewSrc;
          vm.description = parsed.description;

          // console.log(vm.previewSrc);
          vm.src = "https://ipfs.io/ipfs/" + parsed.ipfs_id;
          vm.videos.push({src: vm.src, format: 'mp4'});
          vm.tags = JSON.parse(result.json_metadata).tags;
          vm.contentGot = true;
        } else {
          console.log(err);
        }
      });
    }
  }
};
