<template>
  <div>
    <div class="form">
      <div class="form__inline-field">
        <sp-textfield v-model-custom-element="searchText" type="text" placeholder="Search images" @keydown.enter="search">
          <sp-label slot="label" isrequired="true">Search images</sp-label>
        </sp-textfield>

        <sp-button variant="cta" @click="search">
          {{ isSearching ? 'Searching...' : 'Search' }}
        </sp-button>
      </div>
    </div>

    <div class="explore__images explore__generated-images generated-images">
      <div v-for="image in images" :key="image.id">
        <img :src="image.srcSmall">
        <div class="explore__generated-images__overlay">
          <sp-button class="sp-button--icon" quiet variant="primary">
            <!-- eslint-disable-next-line vue/attributes-order -->
            <svg @click="copyPrompt(image)" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
              <title>S BreakdownAdd 18 N</title>
              <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
              <path d="M7.542,15H5V13H7.375a6.107,6.107,0,0,1,.509-2H5V9H9.318A6.084,6.084,0,0,1,15,7.542V7.5a.5.5,0,0,0-.5-.5H5V4h9.5a.5.5,0,0,0,.5-.5v-2a.5.5,0,0,0-.5-.5H.5a.5.5,0,0,0-.5.5v2A.5.5,0,0,0,.5,4H3V16.5a.5.5,0,0,0,.5.5H8.4465A6.11305,6.11305,0,0,1,7.542,15Z" />
              <path d="M13.5,9.05a4.45,4.45,0,1,0,4.45,4.45A4.45,4.45,0,0,0,13.5,9.05Zm2.5,4.7a.25.25,0,0,1-.25.25H14v1.75a.25.25,0,0,1-.25.25h-.5a.25.25,0,0,1-.25-.25V14H11.25a.25.25,0,0,1-.25-.25v-.5a.25.25,0,0,1,.25-.25H13V11.25a.25.25,0,0,1,.25-.25h.5a.25.25,0,0,1,.25.25V13h1.75a.25.25,0,0,1,.25.25Z" />
            </svg>
          </sp-button>

          <sp-button class="sp-button--icon" quiet variant="primary">
            <!-- eslint-disable-next-line vue/attributes-order -->
            <svg @click="searchSimilarImages(image.src)" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
              <title>S ImageSearch 18 N</title>
              <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
              <path d="M17.817,16.933l-2.58417-2.58417a4.01015,4.01015,0,1,0-.88389.88389L16.933,17.81693A.625.625,0,0,0,17.817,16.933ZM9,12a3,3,0,1,1,3,3A3,3,0,0,1,9,12ZM8.38672,8.55871,5.63611,5.8081A1,1,0,0,0,4.222,5.808L1,9.029V2H15V8.02264a5.005,5.005,0,0,1,1,1.00482V1.5a.5.5,0,0,0-.5-.5H.5a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5H7.10077A4.97311,4.97311,0,0,1,8.38672,8.55871ZM11,5.02539a1.35,1.35,0,1,0,1.35-1.35A1.35,1.35,0,0,0,11,5.02539Z" />
            </svg>
          </sp-button>

          <sp-body size="S">{{ image.prompt }}</sp-body>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {app} from 'photoshop';
import axios from 'axios';

export default {

  data() {
    return {
      searchText: 'artstation',
      images: null,

      isSearching: false,
    };
  },

  computed: {
    getLexicaUrl() {
      return `https://lexica.art/api/v1/search?q=${encodeURIComponent(this.searchText)}`;
    },
  },

  mounted() {
    this.search();
  },

  methods: {

    async search() {
      if (this.isSearching) return;
      if (!this.searchText) {
        await app.showAlert('Query cannot be empty');
        return;
      }

      this.isSearching = true;

      let response;
      try {
        response = await axios.get(this.getLexicaUrl);
      }
      catch (e) {
        this.isSearching = false;
        console.error('Explore API error:', e);
        await app.showAlert('Error: cannot connect to Lexica.art');
        return;
      }

      this.images = response.data.images;
      this.isSearching = false;
    },

    searchSimilarImages(src) {
      this.images = [];
      this.searchText = src;
      this.search();
    },

    copyPrompt(image) {
      this.$root.$emit('copyPrompt', image.prompt, image.width, image.height, image.seed, image.guidance);
      this.$root.$emit('changeTab', 'generate');
    },

  },

};
</script>

<style scoped lang="scss">

  .explore__generated-images.generated-images {
    justify-content: center;

    & > div {
      width: calc(33% - 10px);
      max-width: 200px;
      margin: 0 5px 10px 5px;
      position: relative;

      &:hover .explore__generated-images__overlay {
        visibility: visible;
      }
    }

    img {
      width: 100%;
      max-width: 100%;
      margin: 0;
      height: 100%;
      vertical-align: bottom;
    }
  }

  .explore__generated-images__overlay {
    visibility: hidden;

    /* background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.1) 100%); */
    background: linear-gradient(0deg,rgba(0,0,0,1) 0%,rgba(0,0,0,0.9) 10%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0.1) 100%);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column-reverse;

    .sp-button--icon {
      position: absolute;
      top: 0;
      margin: 7px;
      z-index: 1;

      &:nth-child(2) {
        right: 0
      }
    }

    sp-body {
      position: relative;
      color: #fff;
      max-height: 85px;
      overflow: hidden;
      padding: 0 10px;

      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0px;
        width: 100%;
        height: 17px;
        background: linear-gradient(-90deg,rgba(0,0,0,95) 10%,rgba(0,0,0,0.5) 50%,rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 80%);
        display: block;
        z-index: 1;
      }
    }
  }

</style>
