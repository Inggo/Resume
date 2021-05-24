export default {
  removesProtocol: {
    methods: {
      removeProtocol(url, showPath = false) {
        let domain = url.replace(/(^\w+:|^)\/\/(www\.)?/, '');

        return showPath === true ? domain : domain.split('/')[0];
      }
    }
  }
}