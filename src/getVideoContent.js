let golos = require('golos-js');
export const getVideoContent = {
  methods: {
    getVideoContent: function (vm) {
      golos.api.getContent(vm.author, vm.permlink, function (err, result) {
        if (!err) {
          vm.title = result.title;
          vm.total = result.pending_payout_value;
          let parsed = vm.parseBody(result.body);
          console.log(parsed);
          vm.previewSrc = parsed.previewSrc;
          console.log(vm.previewSrc);
          vm.src = "https://ipfs.io/ipfs/" + parsed.ipfs_id;
          vm.videos.push({src: vm.src, format: 'mp4'});
        } else {
          console.log(err);
        }
      });
    }
  }
};
