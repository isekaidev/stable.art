<template>
  <div>
    <div ref="form" class="form">
      <div>
        <sp-textfield
          v-model-custom-element="endpoint" type="url"
          placeholder="Link to your Auto1111 (e.g. http://127.0.0.1:7860, https://***.gradio.live, https://***.loca.lt, etc)"
          @blur="handleEndpointBlurAndLoadModels"
        >
          <sp-label slot="label" isrequired="true">
            <!-- <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 14 14" width="14"
              style="display: inline-block;"
            >
              <title>InfoSmall</title>
              <rect id="ToDelete" fill="#ff13dc" opacity="0" width="14" height="14" /><path d="M7,.77778A6.22222,6.22222,0,1,0,13.22222,7,6.22222,6.22222,0,0,0,7,.77778ZM6.88333,2.45a1.057,1.057,0,0,1,1.11308.99778q.00273.05018.0007.10044A1.036,1.036,0,0,1,6.88333,4.662,1.05229,1.05229,0,0,1,5.76956,3.54744,1.057,1.057,0,0,1,6.7837,2.44926Q6.83352,2.44728,6.88333,2.45ZM8.55556,10.5a.38889.38889,0,0,1-.38889.38889H5.83333A.38889.38889,0,0,1,5.44444,10.5V9.72222a.3889.3889,0,0,1,.38889-.38889h.38889V7H5.83333a.38889.38889,0,0,1-.38889-.38889V5.83333a.3889.3889,0,0,1,.38889-.38889H7.38889a.38889.38889,0,0,1,.38889.38889v3.5h.38889a.3889.3889,0,0,1,.38889.38889Z" />
            </svg> -->

            Endpoint
          </sp-label>
        </sp-textfield>
      </div>

      <sp-picker :placeholder="getDefaultModelTitle" :disabled="!models.length">
        <sp-label slot="label">Model {{ loadingModelsStatus }}</sp-label>
        <sp-menu slot="options" @change="changeModel">
          <!-- eslint-disable vue/no-v-text-v-html-on-component vue/no-v-html vue/html-self-closing -->

          <sp-menu-item :selected="currentModelTitle === null ? true : null" v-html="getDefaultModelTitle"></sp-menu-item>

          <sp-menu-item
            v-for="model in models"
            :key="model.title"
            :selected="currentModelTitle === model.title ? true : null"
            v-html="model.title"
          >
          </sp-menu-item>
          <!-- eslint-enable-->
        </sp-menu>
      </sp-picker>

      <div>
        <sp-textarea
          ref="prompt" v-model-custom-element="prompt" type="text"
          placeholder="Prompt" @input="handleTextareaInput"
        >
          <sp-label slot="label" isrequired="true">Prompt</sp-label>
        </sp-textarea>
      </div>

      <div>
        <sp-textarea
          v-model-custom-element="negativePrompt" type="text" placeholder="(Optional)"
          @input="handleTextareaInput"
        >
          <sp-label slot="label">Negative Prompt</sp-label>
        </sp-textarea>
      </div>

      <div class="form__inline-field">
        <sp-textfield v-model-custom-element="seed" type="text" placeholder="(Optional)">
          <sp-label slot="label">Seed</sp-label>
        </sp-textfield>

        <sp-button
          class="sp-button--icon" quiet variant="primary"
          title="Reuse seed from last generation, mostly useful if it was randomed"
        >
          <!-- eslint-disable-next-line vue/attributes-order -->
          <svg @click="reuseSeed" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
            <title>S Reuse 18 N</title>
            <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path d="M8.37,2.154a6.88348,6.88348,0,0,0-5.2805,3.15l-1.565-.817a.346.346,0,0,0-.46681.14671L1.056,4.637a.33649.33649,0,0,0-.0215.2615L2.2,8.6665a.2155.2155,0,0,0,.26981.14172L2.4705,8.808,6.212,7.603a.33952.33952,0,0,0,.2-.1675.345.345,0,0,0-.14184-.46683L6.267,6.967,4.622,6.1065A5.158,5.158,0,0,1,9.7,3.9285a.43151.43151,0,0,0,.497-.3125l.216-.8415a.4295.4295,0,0,0-.30346-.52617l-.027-.00633A6.861,6.861,0,0,0,8.37,2.154Z" />
            <path d="M16.456,4.1275a.339.339,0,0,0-.2245-.1365L12.34,3.341a.218.218,0,0,0-.161.038.215.215,0,0,0-.0865.1405l-.6,3.885a.339.339,0,0,0,.0585.256.34548.34548,0,0,0,.48174.08161L12.035,7.7405,13.481,6.7a5.094,5.094,0,0,1,.569,1.9595A5.15849,5.15849,0,0,1,12.8205,12.4a.4345.4345,0,0,0,.0115.5935l.611.6135a.43251.43251,0,0,0,.61159.00876L14.07,13.6a6.866,6.866,0,0,0,.834-7.9255l1.474-1.062a.34551.34551,0,0,0,.08018-.482Z" />
            <path d="M11.8805,14.533l-3.012-2.524a.3375.3375,0,0,0-.25-.082.3455.3455,0,0,0-.31924.3699L8.2995,12.3l.15,1.84A5.191,5.191,0,0,1,4.014,10.75a.433.433,0,0,0-.5235-.282l-.8325.2365a.43451.43451,0,0,0-.30485.53353l.00485.01647A6.9105,6.9105,0,0,0,8.5865,15.882l.1415,1.754a.34551.34551,0,0,0,.37162.31724L9.1025,17.953a.339.339,0,0,0,.2325-.121l2.5705-2.9945a.216.216,0,0,0-.02494-.30445Z" />
          </svg>
        </sp-button>
      </div>

      <sp-picker @change="changeSampler">
        <sp-label slot="label">Sampling method</sp-label>
        <sp-menu slot="options">
          <!-- eslint-disable vue/no-v-text-v-html-on-component vue/no-v-html vue/html-self-closing -->
          <sp-menu-item
            v-for="sampler in getSamplers"
            :key="sampler"
            :selected="currentSampler == sampler ? true : null"
            v-html="sampler"
          >
          </sp-menu-item>
          <!-- eslint-enable-->
        </sp-menu>
      </sp-picker>

      <sp-slider v-model-custom-element="steps" min="1" max="100" show-value="false">
        <sp-label slot="label" class="label">
          Steps
          <sp-label class="value">{{ steps }}</sp-label>
        </sp-label>
      </sp-slider>

      <sp-slider v-model-custom-element="cfgScale" min="1" max="30" show-value="false">
        <sp-label slot="label" class="label">
          CFG Scale
          <!-- Higher values keep your image closer to your prompt -->
          <sp-label class="value">{{ cfgScale }}</sp-label>
        </sp-label>
      </sp-slider>

      <div class="form__modes">
        <sp-label slot="label">Mode</sp-label>

        <sp-button
          v-for="mode in modes" :key="mode" size="m"
          :variant="currentMode == mode ? 'cta' : 'primary'"
          @click="changeMode(mode)"
        >
          {{ mode }}
        </sp-button>
      </div>

      <sp-detail v-show="currentMode === 'txt2img'" size="M">
        Tip for txt2img: you can use the rectangular marquee tool to specify any size (with any ratio) you desire
      </sp-detail>

      <!-- <sp-detail v-show="currentMode !== 'txt2img'" size="M">
        Tip: you can simply click "Generate more" without recreating the selection if you want to generate more images with the same selection.
        It will use the same selection but new parameters (e.g. prompt, steps, sampling method, etc)
      </sp-detail> -->

      <sp-slider v-show="currentMode !== 'txt2img'" v-model-custom-element="denoisingStrength" min="1" max="99" show-value="false">
        <sp-label slot="label" class="label">
          Denoising strength
          <sp-label class="value">{{ denoisingStrength / 100 }}</sp-label>
        </sp-label>
      </sp-slider>

      <div class="form__advanced-settings">
        <sp-heading size="XS" @click="toggleAdvancedSettings">
          <span>{{ showAdvancedSettings ? '▼' : '▶' }}</span>
          Advanced Settings
        </sp-heading>

        <div v-if="showAdvancedSettings">
          <sp-slider v-model-custom-element="imagesNumber" min="1" max="8" show-value="false">
            <sp-label slot="label" class="label">
              Number of images
              <sp-label class="value">{{ imagesNumber }}</sp-label>
            </sp-label>
          </sp-slider>
        </div>
      </div>

      <!-- <sp-divider size="large"></sp-divider> -->
      <br>
      <br>
      <sp-button
        size="xl" class="generate-button"
        @mouseover="handleMouseoverForGenerateButton(true)" @mouseleave="handleMouseoverForGenerateButton(false)"
        @click="generate(false)"
      >
        {{ getTextForGenerateButton(false) }}
        <span v-show="isGenerating" class="generate-button__progressbar" :style="{ width: progress + '%' }"></span>
      </sp-button>
    </div> <!-- .form -->

    <div>
      <div v-if="generatedImages.length" class="generate__generated-images generated-images">
        <div
          v-for="(img, i) in generatedImages" :key="i"
          :class="{ 'active': i === currentGeneratedImageIndex }"
        >
          <img :src="`data:image/png;base64,${img}`" @click="chooseImage(i)" />

          <sp-button
            class="sp-button--icon" :class="{ 'active': addedImages.find((x) => x.index === i) }"
            quiet variant="primary" @click="chooseAdditionalImage(i)"
          >
            <!-- eslint-disable-next-line vue/attributes-order -->
            <svg @click="chooseAdditionalImage(i)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
              <g id="CheckmarkSize200">
                <rect id="Frame" width="12" height="12" fill="red" opacity="0" />
                <path d="M11.19531,1.17822a1.0431,1.0431,0,0,0-1.46289.1753L4.28967,8.2818,2.24707,5.83105A1.0418,1.0418,0,0,0,.64648,7.165L3.5127,10.604c.02142.0257.05285.03516.07617.05829a.97029.97029,0,0,0,.08056.09455,1.00368,1.00368,0,0,0,.148.08038,1.00365,1.00365,0,0,0,.10266.05572,1.03457,1.03457,0,0,0,.3924.08655l.01508-.00342a1.03348,1.03348,0,0,0,.38635-.087.99926.99926,0,0,0,.11719-.06684A.99051.99051,0,0,0,4.98,10.7373a.9737.9737,0,0,0,.0769-.09576c.02271-.0238.0542-.03363.075-.06l6.23925-7.94092A1.04154,1.04154,0,0,0,11.19531,1.17822Z" />
              </g>
            </svg>
          </sp-button>
        </div>
      </div>

      <sp-button v-if="generatedImages.length" variant="primary" @click="generate(true)">
        {{ getTextForGenerateButton(true) }}
      </sp-button>
    </div>
  </div>
</template>

<script>
import {storage} from 'uxp';
import {action, core, app} from 'photoshop';

import * as Sentry from '@sentry/vue';
import axios from 'axios';
import Jimp from 'jimp';

import maskGeneratorMixin from './maskGeneratorMixin';
import {changeDpiDataUrl} from './changedpi';

export default {
  mixins: [maskGeneratorMixin],
  data() {
    return {
      isGenerating: false,
      isInterrupting: false,

      modes: ['txt2img', 'img2img', 'inpaint'],
      currentMode: 'txt2img',
      endpoint: null,
      prompt: '',
      negativePrompt: '',
      seed: null,
      currentSampler: 'Euler a',
      steps: 20,
      cfgScale: 7,
      denoisingStrength: 75,
      imagesNumber: 4,

      generatedImages: [],
      currentGeneratedImageIndex: 0,
      currentLayerId: null,
      currentSeedList: [],
      addedImages: [],

      generatedImagePosition: {left: null, top: null},
      generatedImageSize: {width: null, height: null},
      tempFolder: null,
      progress: 0,
      isMouseoverGenerateButton: false,

      axiosController: null,
      initImageData: {maskBase64: null, currentLayerBase64: null},
      inpaintOriginalPosition: {leftOffset: null, topOffset: null, width: null, height: null},

      models: [],
      currentModelTitle: null,
      loadingModelsStatus: '',
      textareaInputDebounceTimer: null,
      showAdvancedSettings: false,
    };
  },

  computed: {
    getDefaultModelTitle() {
      return 'default (current webui value)';
    },
    getSizeForGeneratingImage() {
      // https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/4094
      let {width, height} = this.generatedImageSize;

      // for txt2img without selection
      if (!width || !height) {
        width = 512;
        height = 512;
      }

      if (width !== height || this.currentMode !== 'txt2img') {
        width = 8 * Math.round(width / 8);
        height = 8 * Math.round(height / 8);
      }
      return {width, height};
    },

    getSamplers() {
      return [
        'Euler a',
        'Euler',
        'LMS',
        'Heun',
        'DPM2',
        'DPM2 a',
        'DPM++ 2S a',
        'DPM++ 2M',
        'DPM++ SDE',
        'DPM fast',
        'DPM adaptive',
        'LMS Karras',
        'DPM2 Karras',
        'DPM2 a Karras',
        'DPM++ 2S a Karras',
        'DPM++ 2M Karras',
        'DPM++ SDE Karras',
        'DDIM',
        'PLMS',
      ];
    },
  },

  mounted() {
    this.endpoint = storage.localStorage.getItem('endpoint');
    this.steps = storage.localStorage.getItem('steps') || this.steps;
    this.cfgScale = storage.localStorage.getItem('cfgScale') || this.cfgScale;
    this.currentSampler = storage.localStorage.getItem('currentSampler') || this.currentSampler;
    this.imagesNumber = storage.localStorage.getItem('imagesNumber') || this.imagesNumber;
    this.currentMode = storage.localStorage.getItem('currentMode') || this.currentMode;

    this.getTempFolder();

    this.$root.$on('copyPrompt', async (prompt, width, height, seed, guidance) => {
      this.prompt = '';
      this.seed = seed;
      this.cfgScale = guidance;
      // this.generatedImageSize = {width, height};

      for (const char of prompt) {
        this.prompt += char;
        await this.sleep(5); // eslint-disable-line no-await-in-loop
      }

      // trigger handleTextareaInput()
      this.$refs.prompt.dispatchEvent(new Event('input'));
    });
  },

  methods: {
    toggleAdvancedSettings() {
      this.showAdvancedSettings = !this.showAdvancedSettings;
    },

    handleTextareaInput(event, skipDebounceTimer) {
      if (!skipDebounceTimer) {
        clearTimeout(this.textareaInputDebounceTimer);
        this.textareaInputDebounceTimer = setTimeout(() => {
          this.handleTextareaInput(event, true);
        }, 200);
        return;
      }

      const newDiv = document.createElement('div');
      newDiv.style.cssText = `
        width: ${event.target.clientWidth}px;
        font-size: 12px;
        padding: 15px;
        padding-bottom: 25px;
        line-height: 15px;
        white-space: pre-wrap;
        position: absolute;
        visibility: hidden;
      `;

      newDiv.innerHTML = `<p style="width: 100%;">${event.target.value}</p>`;

      const handleWindowResize = () => {
        const textareaDefaultHeight = 101;
        const newHeight = newDiv.clientHeight > textareaDefaultHeight ? newDiv.clientHeight : textareaDefaultHeight;
        event.target.style.height = `${newHeight}px`; // eslint-disable-line no-param-reassign

        this.$refs.form.removeChild(newDiv);
        window.removeEventListener('resize', handleWindowResize);
      };

      // https://forums.creativeclouddeveloper.com/t/is-it-possible-to-customize-the-scrollbar/2447/12
      // UXP’s DOM is asynchronous, so there is a delay in when you can get clientHeight
      window.addEventListener('resize', handleWindowResize);
      this.$refs.form.appendChild(newDiv);
    },

    async sleep(ms) {
      return new Promise((resolve) => { setTimeout(resolve, ms); });
    },

    handleMouseoverForGenerateButton(newValue) {
      this.isMouseoverGenerateButton = newValue;
    },

    async handleEndpointBlurAndLoadModels() {
      if (!this.endpoint) {
        await app.showAlert('Error: you did not provide an endpoint');
        return;
      }

      this.loadingModelsStatus = '(loading models...)';

      if (!this.endpoint.startsWith('http')) {
        const isBackendRunningLocally = this.endpoint.includes('localhost') || this.endpoint.includes('127.0.0.1');
        const endpointProtocol = isBackendRunningLocally ? 'http://' : 'https://';
        this.endpoint = `${endpointProtocol}${this.endpoint}`;
      }

      if (this.endpoint.endsWith('/')) {
        this.endpoint = this.endpoint.slice(0, -1);
      }

      try {
        this.currentModelTitle = null;
        const axiosConfig = {transitional: {silentJSONParsing: false}, responseType: 'json'};
        this.models = (await axios.get(`${this.endpoint}/sdapi/v1/sd-models`, axiosConfig)).data;
        if (!this.models.length) throw new Error('Cannot get models');
      }
      catch (modelsError) {
        try {
          await axios.get(this.endpoint);
        }
        catch (endpointError) {
          await app.showAlert('Error: cannot connect to your server');
          this.loadingModelsStatus = '';
          return;
        }

        await app.showAlert('Error: your server is live, but the plugin cannot connect to the API');
      }

      this.loadingModelsStatus = '';
    },

    async changeModel(event) {
      if (event.target.value === this.getDefaultModelTitle) {
        this.currentModelTitle = null;
        return;
      }

      this.loadingModelsStatus = '(changing model...)';
      try {
        await axios.post(`${this.endpoint}/sdapi/v1/options`, {sd_model_checkpoint: event.target.value});
        this.currentModelTitle = event.target.value;
        this.loadingModelsStatus = '';
      }
      catch (error) {
        this.loadingModelsStatus = '(error)';
      }
    },

    changeSampler(event) {
      this.currentSampler = event.target.value;
    },

    async updateProgress() {
      if (this.isGenerating) {
        this.progress = (await axios.get(`${this.endpoint}/sdapi/v1/progress`)).data.progress * 100;

        await this.sleep(500);
        await this.updateProgress();
      }
      else {
        this.progress = 0;
      }
    },

    changeMode(mode) {
      this.currentMode = mode;
    },

    reuseSeed() {
      this.seed = String(this.currentSeedList[this.currentGeneratedImageIndex]);
    },

    async getTempFolder() {
      this.tempFolder = await storage.localFileSystem.getTemporaryFolder();
    },

    async sendData(data, apiMethod) {
      const endpoint = `${this.endpoint}/sdapi/v1/${apiMethod}`;
      const axiosConfig = {};

      // https://github.com/isekaidev/stable.art/issues/13
      try {
        this.axiosController = new AbortController();
        axiosConfig.signal = this.axiosController.signal;
      }
      catch (e) {} // eslint-disable-line no-empty

      let res;
      try {
        res = await axios.post(endpoint, data, axiosConfig);
      }
      catch (e) {
        this.isGenerating = false;
        if (e.code === 'ERR_CANCELED') return;

        console.error('sendData error', e);
        await app.showAlert(`Error: ${e.message}`);
        return;
      }

      let resDataImages = res.data.images;
      if (this.currentMode === 'inpaint') {
        resDataImages = await this.handleInpaintGeneratedImages(resDataImages, data.mask);
      }
      this.generatedImages = [...this.generatedImages, ...resDataImages];

      const isGeneratingMoreImages = this.currentSeedList.length > 0;
      if (!isGeneratingMoreImages) {
        this.currentLayerId = null;
        this.addedImages = [];
        this.chooseImage(0);
      }

      this.currentSeedList = [...this.currentSeedList, ...JSON.parse(res.data.info).all_seeds];
      this.isGenerating = false;
    },

    async handleInpaintGeneratedImages(resDataImages, debugMask) {
      const generatedImages = [];

      // TODO: Rewrite to Promises without await
      for (const image of resDataImages) {
        // eslint-disable-next-line no-await-in-loop
        const imageJimpObject = await Jimp.read(Buffer.from(image, 'base64'));

        try {
          imageJimpObject.crop(
            this.inpaintOriginalPosition.leftOffset,
            this.inpaintOriginalPosition.topOffset,
            this.inpaintOriginalPosition.width,
            this.inpaintOriginalPosition.height,
          );
        }
        catch (error) {
          // DEBUG ERROR: x and y must be numbers (PHOTOSHOP-PLUGIN-1X)
          Sentry.configureScope((scope) => {
            scope.addAttachment({filename: 'generated_image.png', data: new Uint8Array(Buffer.from(image, 'base64')), contentType: 'image/png'});

            const debugMaskData = new Uint8Array(Buffer.from(debugMask.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
            scope.addAttachment({filename: 'mask.png', data: debugMaskData, contentType: 'image/png'});
          });

          Sentry.setContext('handleInpaintGeneratedImages', {
            inpaintOriginalPosition: this.inpaintOriginalPosition,
            inpaintOriginalPositionTypes: {
              leftOffset: typeof this.inpaintOriginalPosition.leftOffset,
              topOffset: typeof this.inpaintOriginalPosition.topOffset,
              width: typeof this.inpaintOriginalPosition.width,
              height: typeof this.inpaintOriginalPosition.height,
            },

            imageJimpObject,
            imageJimpObjectBitmap: imageJimpObject?.bitmap,
          });

          throw error; // rethrow
        }

        // eslint-disable-next-line no-await-in-loop
        const croppedImageBase64 = await imageJimpObject.getBase64Async(Jimp.MIME_PNG);
        generatedImages.push(croppedImageBase64.replace(/^data:image\/\w+;base64,/, ''));

        Sentry.configureScope((scope) => {
          scope.clearAttachments();
        });
      }

      return generatedImages;
    },

    async interrupt() {
      this.isInterrupting = true;
      try {
        await axios.post(`${this.endpoint}/sdapi/v1/interrupt`);
        this.axiosController.abort();
      }
      catch (e) { console.error('interrupt error', e); }
      this.isInterrupting = false;
      this.isGenerating = false;
    },

    async chooseAdditionalImage(id) {
      this.currentLayerId = null;
      const addedImagesIndex = this.addedImages.findIndex((x) => x.index === id);

      if (addedImagesIndex > -1) {
        await core.executeAsModal(async () => {
          await action.batchPlay([{
            _obj: 'delete',
            _target: {_ref: 'layer', _id: this.addedImages[addedImagesIndex].layerId},
          }], {modalBehavior: 'execute'});

          this.addedImages.splice(addedImagesIndex, 1);
          this.currentGeneratedImageIndex = null;
        });
      }
      else {
        this.chooseImage(id);
      }
    },

    async chooseImage(id) {
      // DEBUG ERROR: Cannot read properties of null (reading 'resolution') (PHOTOSHOP-PLUGIN-E)
      if (!app.activeDocument?.resolution) {
        Sentry.captureException(new Error('chooseImage: cannot get resolution'), {
          contexts: {
            activeDocumentObject: app.activeDocument,
            documentProperties: {
              id: app.activeDocument?.id,
              cloudDocument: app.activeDocument?.cloudDocument,
              height: app.activeDocument?.height,
              width: app.activeDocument?.width,
              name: app.activeDocument?.name,
              resolution: app.activeDocument?.resolution,
              saved: app.activeDocument?.saved,
              typename: app.activeDocument?.typename,
              layers: app.activeDocument?.layers.length,
            },
          },
        });
      }

      if (this.currentLayerId) this.addedImages = [];

      // this.generatedImages[id] is base64 url
      // we need to change DPI because otherwise, if document DPI is not 72, then photoshop will resize placed layer
      const imgUrl = changeDpiDataUrl(`data:image/png;base64,${this.generatedImages[id]}`, app.activeDocument?.resolution || 72);
      const imgBase64 = imgUrl.replace(/^data:image\/\w+;base64,/, '');
      const img = Buffer.from(imgBase64, 'base64');

      // const imageFile = await storage.localFileSystem.getFileForSaving('image.png');
      const imageFile = await this.tempFolder.createFile('generated_image.png', {overwrite: true});
      await imageFile.write(img, {format: storage.formats.binary});

      const token = storage.localFileSystem.createSessionToken(imageFile); // batchPlay requires a token on _path

      try {
        await core.executeAsModal(async (executionContext) => {
          const suspensionID = await executionContext.hostControl.suspendHistory({
            documentID: app.activeDocument.id,
            name: 'Place generated image',
          });

          const placeImageCmd = [
            {
              _obj: 'make',
              _target: {_ref: 'layer'},
            },

            // upload the original selection from the channel
            // photoshop will use this selection to get a position for placeEvent
            {
              _obj: 'set',
              _target: {_ref: 'channel', _property: 'selection'},
              to: {_ref: 'channel', _name: 'stableart_mask'},
            },
            {
              _obj: 'placeEvent',
              target: {_path: token, _kind: 'local'},
              linked: false,
            },

            ...this.currentLayerId ? [{
              _obj: 'delete',
              _target: {_ref: 'layer', _id: this.currentLayerId},
            }] : [],
          ];

          const placeImageResults = await action.batchPlay(placeImageCmd, {modalBehavior: 'execute'});
          this.currentLayerId = placeImageResults.find((x) => x._obj === 'placeEvent').ID; // eslint-disable-line no-underscore-dangle

          // we do not need to add a mask for txt2img images
          if (this.currentMode === 'txt2img') {
            await executionContext.hostControl.resumeHistory(suspensionID);
            return;
          }

          // const placedImageTopPosition = placeImageResults[placeImageCmd.length - 1].bounds.top._value;
          // const placedImageLeftPosition = placeImageResults[placeImageCmd.length - 1].bounds.left._value;

          const createMaskForImageCmd = [
            // TODO: refactor and remove legacy for generatedImagePosition and placeImageResults
            // (e.g. we can get layerID from the make/placeEvent events)
            // {
            //   _obj: 'move',
            //   _target: [{_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'}],
            //   to: {
            //     _obj: 'offset',
            //     horizontal: {_unit: 'pixelsUnit', _value: this.generatedImagePosition.left - placedImageLeftPosition},
            //     vertical: {_unit: 'pixelsUnit', _value: this.generatedImagePosition.top - placedImageTopPosition},
            //   },
            // },

            // upload the original selection from the channel, then create the mask from this selection
            {
              _obj: 'set',
              _target: {_ref: 'channel', _property: 'selection'},
              to: {_ref: 'channel', _name: 'stableart_mask'},
            },
            {
              _obj: 'make',
              new: {_class: 'channel'},
              at: {_ref: 'channel', _enum: 'channel', _value: 'mask'},
              using: {_enum: 'userMaskEnabled', _value: 'revealSelection'},
            },

            // fix edges of the mask
            {
              _obj: 'set',
              _target: {_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'},
              to: {
                _obj: 'layer',
                userMaskFeather: {_unit: 'pixelsUnit', _value: 10},
              },
            },

            // and again upload the original selection from the channel
            {
              _obj: 'set',
              _target: {_ref: 'channel', _property: 'selection'},
              to: {_ref: 'channel', _name: 'stableart_mask'},
            },
          ];
          await action.batchPlay(createMaskForImageCmd, {modalBehavior: 'execute'});

          await executionContext.hostControl.resumeHistory(suspensionID);
        });

        this.currentGeneratedImageIndex = id;
        this.addedImages.push({index: id, layerId: this.currentLayerId});
      }
      catch (e) {
        console.error(e);
      }
    },

    getTextForGenerateButton(isGenerateMoreButton) {
      if (this.isInterrupting) return 'Interrupting...';
      if (this.isGenerating) {
        if (this.isMouseoverGenerateButton) return 'Interrupt';
        return `Generating (${Math.round(this.progress)}%)`;
      }
      return isGenerateMoreButton ? 'Generate More' : 'Generate';
    },
  },

};
</script>

<style scoped lang="scss">

  .generate-button {
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .generate-button__progressbar {
    position: absolute;
    left: 0;
    bottom: 0px;
    height: 2px;
    background: #fff;
    display: block;
    z-index: 1;
  }

  .generate__generated-images.generated-images > div {
    .sp-button--icon {
      right: 0;
      svg {
        margin: 5px;
      }

      &:not(.active),
      &:not(.active) svg {
        display: none;
      }
    }

    &.active,
    &:hover {
      outline: 2px solid #2680eb;
      .sp-button--icon {
        display: block;
      }
    }
  }

  .form__modes sp-action-button,
  .form__modes sp-button {
      margin-right: 10px;
      font-weight: normal;
      border-radius: 0px;
  }

  .form__advanced-settings {
    & > sp-heading {
      cursor: pointer;

      span {
        width: 10px;
        margin-right: 5px;
        display: inline-block;
      }
    }

    & > div {
      width: 100%;
    }
  }

</style>
