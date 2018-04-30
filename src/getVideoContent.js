let golos = require('golos-js');
export const getVideoContent = {
  methods: {
    getVideoContent: function (vm) {
      golos.api.getContent(vm.author, vm.permlink, function (err, result) {
        if (!err) {
          vm.title = result.title;
          vm.total = result.pending_payout_value;
          let parsed = vm.parseBody(result.body);
          console.log("parsed:", parsed);
          vm.previewSrc = parsed.previewSrc;

          vm.description = parsed.description;
          //Создаём ссылку
          var node = document.createElement("a");
          node.href = "www.forbes.com"
          //Текст для проверки
          var textnode = document.createTextNode("Forbes");
          //Прикрепляем текст к ссылке
          node.appendChild(textnode);
          //Прикрепляем элемент списка к элементу с айдишником myList
          var textnode1 = document.createTextNode("Перейти на сайт ");
          var textnode2 = document.createTextNode(" чтобы узнать больше..");
          document.getElementById("vid-descr").appendChild(textnode1);
          document.getElementById("vid-descr").appendChild(node);
          document.getElementById("vid-descr").appendChild(textnode2);


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
