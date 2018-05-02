export const parseBody = {
  methods: {
    parseBody: function (body) {
      let regexp = RegExp('<img src="(.*)" alt="(.*)"');
      let parsed = regexp.exec(body);
      if (!parsed) {
        return undefined;
      }
      let previewSrc = parsed[1];
      let ipfs_id = parsed[2];
      if (!previewSrc || !ipfs_id) {
        return undefined;
      }

      let regexpDescription = RegExp('<a.*>.*</a>([^]*)');
      let parsedDescription = regexpDescription.exec(body);
      let description = [];
      if (parsedDescription) {
        parsedDescription = parsedDescription[1];
        parsedDescription = parsedDescription.replace(/<.?p>|<.?div>|<.?body>|<.?html>/gi, '');
        parsedDescription = parsedDescription.replace(/<br.?>/gi, "\n");
        // console.log("pd:", parsedDescription);
        description = parsedDescription.split(/(<a.*href="(.*)".*>(.*)<\/a>)/);
        //console.log("description:", description)
      }

      return {
        previewSrc: previewSrc,
        ipfs_id: ipfs_id,
        description: description,
      }
    }
  }
};
