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
      return {
        previewSrc: previewSrc,
        ipfs_id: ipfs_id,
      }
    }
  }
};
