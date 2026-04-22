export default {
  removesProtocol: {
    methods: {
      removeProtocol(url, showPath = false) {
        const domain = url.replace(/(^\w+:|^)\/\/(www\.)?/, '');
        return showPath === true ? domain : domain.split('/')[0];
      },
    },
  },
};
