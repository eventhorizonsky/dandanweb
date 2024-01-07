<template>
    <div ref="artRef"></div>
  </template>
  
  <script>
  import ArtPlayer from "artplayer"; // Change the import statement to use a multi-word name
  
  export default {
    name: "MultiWordArtPlayer", // Change the component name to a multi-word name
    data() {
      return {
        instance: null,
      };
    },
    props: {
      option: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.instance = new ArtPlayer({ // Change the instance creation to use the new name
        ...this.option,
        container: this.$refs.artRef,
      });
  
      this.$nextTick(() => {
        this.$emit("get-instance", this.instance);
      });
    },
    beforeUnmount() { // Change from beforeDestroy to beforeUnmount
      if (this.instance && this.instance.destroy) {
        this.instance.destroy(false);
      }
    },
  };
  </script>
  