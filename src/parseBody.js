export const parseBody = {
  methods: {
    parseBody: function(body) {
      var regexp = RegExp('<img src="(.*)" alt="(.*)"');
      var parsed = regexp.exec(body);
      if (!parsed) {
        return undefined;
      }
      var previewSrc = parsed[1];
      var ipfs_id = parsed[2];
      if (!previewSrc || !ipfs_id) {
        return undefined;
      }
      return {
        previewSrc: previewSrc,
        ipfs_id: ipfs_id,
      }
    }
  }
}
