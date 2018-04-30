export const parseBody = {
  methods: {
    parseBody: function (body) {
      let regexp = RegExp('<img src="(.*)" alt="(.*)"');
      let parsed = regexp.exec(body);
      let regexpDescription = RegExp('<a.*>.*</a><p>([^]*)</p>');
      let parsedDescription = regexpDescription.exec(body);
      console.log("pd:", parsedDescription)
      if (!parsed) {
        return undefined;
      }
      let previewSrc = parsed[1];
      let ipfs_id = parsed[2];
      let description = parsedDescription[1];
      if (!previewSrc || !ipfs_id) {
        return undefined;
      }
      return {
        previewSrc: previewSrc,
        ipfs_id: ipfs_id,
        description: description,
      }
    }
  }
};
