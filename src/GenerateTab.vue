<template>
  <div>
    <div class="form">
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

      <sp-picker placeholder="default" :disabled="!models.length">
        <sp-label slot="label">Model {{ loadingModelsStatus }}</sp-label>
        <sp-menu slot="options" @change="changeModel">
          <!-- eslint-disable vue/no-v-text-v-html-on-component vue/no-v-html vue/html-self-closing -->
          <sp-menu-item
            v-for="model in models"
            :key="model.title"
            :selected="currentModelTitle == model.title ? true : null"
            v-html="model.title"
          >
          </sp-menu-item>
          <!-- eslint-enable-->
        </sp-menu>
      </sp-picker>

      <div>
        <sp-textarea v-model-custom-element="prompt" type="text" placeholder="Prompt">
          <sp-label slot="label" isrequired="true">Prompt</sp-label>
        </sp-textarea>
      </div>

      <div>
        <sp-textarea v-model-custom-element="negativePrompt" type="text" placeholder="(Optional)">
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

      <sp-slider v-show="currentMode != 'txt2img'" v-model-custom-element="denoisingStrength" min="1" max="99" show-value="false">
        <sp-label slot="label" class="label">
          Denoising strength
          <sp-label class="value">{{ denoisingStrength / 100 }}</sp-label>
        </sp-label>
      </sp-slider>

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
        <img
          v-for="(img, i) in generatedImages" :key="i" :src="`data:image/png;base64,${img}`"
          :class="{ 'active': i == currentGeneratedImageIndex }" @click="chooseImage(i)"
        />
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
import * as fs from 'fs';

import axios from 'axios';
import Jimp from 'jimp';

const EXPORT_MASK_FILENAME = 'stableart_exported_mask.png';

export default {

  data() {
    return {
      isGenerating: false,
      isInterrupting: false,

      modes: ['txt2img', 'img2img', 'inpaint'],
      currentMode: 'txt2img',
      endpoint: null,
      prompt: null,
      negativePrompt: '',
      seed: null,
      currentSampler: 'Euler a',
      steps: 20,
      cfgScale: 7,
      denoisingStrength: 75,

      generatedImages: [],
      currentGeneratedImageIndex: 0,
      currentLayerId: null,
      currentSeedList: [],

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
    };
  },

  computed: {
    getSizeForGeneratingImage() {
      // https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/4094
      let {width, height} = this.generatedImageSize;

      // for txt2img without selection
      if (!width || !height) {
        width = 512;
        height = 512;
      }

      if (width !== height || this.currentMode !== 'txt2img') {
        width = 64 * Math.round(width / 64);
        height = 64 * Math.round(height / 64);
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
    this.steps = storage.localStorage.getItem('steps') || 20;
    this.prompt = storage.localStorage.getItem('prompt');

    if (this.endpoint) this.handleEndpointBlurAndLoadModels();
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
    });
  },

  methods: {
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
        const endpointProtocol = this.endpoint.includes('localhost') ? 'http://' : 'https://';
        this.endpoint = `${endpointProtocol}${this.endpoint}`;
      }

      if (this.endpoint.endsWith('/')) {
        this.endpoint = this.endpoint.slice(0, -1);
      }

      try {
        this.models = (await axios.get(`${this.endpoint}/sdapi/v1/sd-models`)).data;
      }
      catch (modelsError) {
        try {
          await axios.get(this.endpoint);
        }
        catch (endpointError) {
          console.error('endpointError error', endpointError);
          await app.showAlert('Error: cannot connect to your server');
          this.loadingModelsStatus = '';
          return;
        }

        console.error('/sd-models error', modelsError);
        await app.showAlert('Error: cannot connect to your API');
      }

      this.loadingModelsStatus = '';
    },

    async changeModel(event) {
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
        resDataImages = await this.handleInpaintGeneratedImages(resDataImages);
      }
      this.generatedImages = [...this.generatedImages, ...resDataImages];

      const isGeneratingMoreImages = this.currentSeedList.length > 0;
      if (!isGeneratingMoreImages) {
        this.currentLayerId = null;
        this.chooseImage(0);
      }

      this.currentSeedList = [...this.currentSeedList, ...JSON.parse(res.data.info).all_seeds];
      this.isGenerating = false;
    },

    async handleInpaintGeneratedImages(resDataImages) {
      const generatedImages = [];

      // TODO: Rewrite to Promises without await
      for (const image of resDataImages) {
        // eslint-disable-next-line no-await-in-loop
        const imageJimpObject = await Jimp.read(Buffer.from(image, 'base64'));

        imageJimpObject.crop(
          this.inpaintOriginalPosition.leftOffset,
          this.inpaintOriginalPosition.topOffset,
          this.inpaintOriginalPosition.width,
          this.inpaintOriginalPosition.height,
        );

        // eslint-disable-next-line no-await-in-loop
        const croppedImageBase64 = await imageJimpObject.getBase64Async(Jimp.MIME_PNG);
        generatedImages.push(croppedImageBase64.replace(/^data:image\/\w+;base64,/, ''));
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

    // returns prepareGenerationHasError
    async prepareGeneration(isLoadMore) {
      if (isLoadMore) return false;

      const batchPlaySelection = await action.batchPlay([{
        _obj: 'get',
        _target: [
          {_property: 'selection'},
          {_ref: 'document', _id: app.activeDocument.id},
        ],
        _options: {dialogOptions: 'dontDisplay'},
      }], {});

      const {selection} = batchPlaySelection[0];
      if (this.currentMode !== 'txt2img' && !selection) {
        await app.showAlert('For the img2img/inpaint modes you need to select the area that will be in-painted. You can use any of the selection tools (e.g. Marquee, Lasso, Wand, etc)');
        this.isGenerating = false;
        return true;
      }

      if (this.currentMode === 'img2img' || this.currentMode === 'inpaint') {
        // const useOffset = !batchPlaySelection[0].solid;

        const {maskBuffer, currentLayerBuffer} = await this.handleLayersForMask();
        // const {maskBase64, currentLayerBase64} = await this.handleMask(maskBuffer, currentLayerBuffer);
        await this.handleMask(maskBuffer, currentLayerBuffer);

        // DEBUGGING START
        // this.generatedImages = [
        //   this.initImageData.maskBase64.replace(/^data:image\/\w+;base64,/, ''),
        //   this.initImageData.currentLayerBase64.replace(/^data:image\/\w+;base64,/, ''),
        // ];
        // this.isGenerating = false;
        // return true;
        // DEBUGGING END
      }

      if (this.currentMode === 'txt2img' && selection) {
        const width = selection.right._value - selection.left._value;
        const height = selection.bottom._value - selection.top._value;
        this.generatedImagePosition = {left: selection.left._value, top: selection.top._value};
        this.generatedImageSize = {width, height};
      }

      return false;
    },

    async generate(isLoadMore) {
      if (this.isGenerating) {
        this.interrupt();
        return;
      }

      if (!this.endpoint) {
        await app.showAlert('Error: you did not provide an endpoint');
        return;
      }

      this.isGenerating = true;
      if (!isLoadMore) {
        this.generatedImagePosition = {left: null, top: null};
        this.generatedImageSize = {width: null, height: null};
        this.inpaintOriginalPosition = {leftOffset: null, topOffset: null, width: null, height: null};

        // this.activeDocumentTitle = app.activeDocument.title.replace(/\.[^/.]+$/, ''); // get name without extension (.psd, .png, etc)
        this.currentSeedList = [];
        this.generatedImages = [];
      }
      storage.localStorage.setItem('endpoint', this.endpoint);
      storage.localStorage.setItem('steps', this.steps);
      storage.localStorage.setItem('prompt', this.prompt);

      this.updateProgress();

      const prepareGenerationHasError = await this.prepareGeneration(isLoadMore);
      if (prepareGenerationHasError) return;

      if (this.currentMode === 'img2img' || this.currentMode === 'inpaint') {
        const img2imgData = {
          init_images: [this.initImageData.currentLayerBase64],
          resize_mode: 0,
          denoising_strength: Number(this.denoisingStrength) / 100,
          mask: this.currentMode === 'inpaint' ? this.initImageData.maskBase64 : null,
          mask_blur: 4,
          inpainting_fill: this.currentMode === 'inpaint' ? 1 : 0, // 1 == original; 2 == latent noise
          inpaint_full_res: true,
          inpaint_full_res_padding: 32,
          inpainting_mask_invert: 0,
          prompt: this.prompt,
          styles: [],
          seed: this.seed ? Number(this.seed) : -1,
          subseed: -1,
          subseed_strength: 0,
          seed_resize_from_h: -1,
          seed_resize_from_w: -1,
          batch_size: 4,
          n_iter: 1,
          steps: Number(this.steps),
          cfg_scale: Number(this.cfgScale),
          width: this.getSizeForGeneratingImage.width,
          height: this.getSizeForGeneratingImage.height,
          restore_faces: false,
          tiling: false,
          negative_prompt: this.negativePrompt,
          eta: 0,
          s_churn: 0,
          s_tmax: 0,
          s_tmin: 0,
          s_noise: 1,
          override_settings: {},
          sampler_index: this.currentSampler,
          include_init_images: false,
        };

        await this.sendData(img2imgData, 'img2img');
      }

      if (this.currentMode === 'txt2img') {
        const txt2imgData = {
          enable_hr: false,
          denoising_strength: 0,
          firstphase_width: 0,
          firstphase_height: 0,
          prompt: this.prompt,
          styles: [],
          seed: this.seed ? Number(this.seed) : -1,
          subseed: -1,
          subseed_strength: 0,
          seed_resize_from_h: -1,
          seed_resize_from_w: -1,
          batch_size: 4,
          n_iter: 1,
          steps: Number(this.steps),
          cfg_scale: Number(this.cfgScale),
          width: this.getSizeForGeneratingImage.width,
          height: this.getSizeForGeneratingImage.height,
          restore_faces: false,
          tiling: false,
          negative_prompt: this.negativePrompt,
          eta: 0,
          s_churn: 0,
          s_tmax: 0,
          s_tmin: 0,
          s_noise: 1,
          override_settings: {},
          sampler_index: this.currentSampler,
        };

        await this.sendData(txt2imgData, 'txt2img');
      }
    },

    async handleLayersForMask() {
      return core.executeAsModal(async (executionContext) => {
        // Suspend history state on the target document
        // This will coalesce all changes into a single history state called
        const suspensionID = await executionContext.hostControl.suspendHistory({
          documentID: app.activeDocument.id,
          name: 'Generate mask',
        });

        const [currentLayerBuffer, currentLayerProperties] = await this.exportActiveLayer();
        const isCurrentLayerTopmost = currentLayerProperties.count === currentLayerProperties.itemIndex;
        await this.generateMaskFromSelection(isCurrentLayerTopmost);

        const [maskBuffer] = await this.exportActiveLayer();

        // remove layer with generated mask and select the initial layer
        await action.batchPlay([
          {
            _obj: 'delete',
            _target: {_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'},
            _options: {dialogOptions: 'dontDisplay'},
            _isCommand: true,
          },
          {
            _obj: 'select',
            _target: [{_ref: 'layer', _id: currentLayerProperties.layerID}],
            makeVisible: false,
            _options: {dialogOptions: 'dontDisplay'},
          },
        ], {modalBehavior: 'execute'});

        // resume the history state
        await executionContext.hostControl.resumeHistory(suspensionID);

        return {maskBuffer, currentLayerBuffer};
      }, {commandName: 'Generating mask...'});
    },

    async loadLocalFile(filename, count) {
      const newCount = count ? count + 1 : 1;

      if (newCount > 5000) {
        await app.showAlert(`Cannot export ${filename}. Try to reload Photoshop and check that "Quick Export as PNG" is working`);
        throw new Error(`Cannot export ${filename}`);
      }

      try {
        const fileArrayBuffer = await fs.readFile(`plugin-temp:/${filename}`);
        if (fileArrayBuffer.byteLength === 0) return this.loadLocalFile(filename, newCount);
        return fileArrayBuffer;
      }
      catch (e) {
        return this.loadLocalFile(filename, newCount);
      }
    },

    async exportActiveLayer() {
      const cmd = [
        {
          _obj: 'multiGet',
          _target: {_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'},
          extendedReference: [['layerID', 'itemIndex', 'count']],
          options: {failOnMissingProperty: false, failOnMissingElement: false},
        },

        /*
        {
          // _obj: 'exportSelectionAsFileTypePressed',
          _obj: 'exportDocumentAsFileTypePressed',
          _target: { _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' },
          // _target: {_ref: 'layer', _id: 1},
          fileType: 'png',
          quality: 32,
          metadata: 0,
          destFolder: this.tempFolder.nativePath,
          sRGB: true,
          openWindow: false,
          _options: { dialogOptions: 'dontDisplay' },
        },
        */
      ];

      const activeLayerResults = await action.batchPlay(cmd, {modalBehavior: 'execute'});
      const imageFile = await this.tempFolder.createFile(EXPORT_MASK_FILENAME, {overwrite: true});
      await app.activeDocument.saveAs.png(imageFile, null, true);

      const activeLayerBuffer = await this.loadLocalFile(EXPORT_MASK_FILENAME);
      await fs.unlink(`plugin-temp:/${EXPORT_MASK_FILENAME}`);

      return [activeLayerBuffer, activeLayerResults[0]];
    },

    async generateMaskFromSelection(isCurrentLayerTopmost) {
      // const converMaskToSmartObjectCmd = {
      //   _obj: 'newPlacedLayer',
      //   _options: {dialogOptions: 'dontDisplay'},
      // };

      const createLayerWithColor = (red, grain, blue) => ([
        {
          _obj: 'make',
          _target: {_ref: 'contentLayer'},
          using: {
            _obj: 'contentLayer',
            type: {
              _obj: 'solidColorLayer',
              color: {_obj: 'RGBColor', red, grain, blue},
            },
          },
          _options: {dialogOptions: 'dontDisplay'},
        },
        {
          _obj: 'rasterizeLayer',
          _target: [{_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'}],
          _options: {dialogOptions: 'dontDisplay'},
        },
        {
          _obj: 'delete',
          _target: [{_ref: 'channel', _enum: 'channel', _value: 'mask'}],
          apply: true,
          _options: {dialogOptions: 'dontDisplay'},
        },
      ]);

      const bringLayerToFront = (isKeepCurrentIndex) => {
        if (isKeepCurrentIndex) return [];

        return [{
          _obj: 'move',
          _target: {_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'},
          to: {_ref: 'layer', _enum: 'ordinal', _value: 'front'},
          _options: {dialogOptions: 'dontDisplay'},
        }];
      };

      const setNewName = {
        _obj: 'set',
        _target: [{_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'}],
        to: {_obj: 'layer', name: EXPORT_MASK_FILENAME},
        _options: {dialogOptions: 'dontDisplay'},
        _isCommand: true,
      };

      const cmd = [
        ...createLayerWithColor(255, 255, 255),
        ...bringLayerToFront(isCurrentLayerTopmost),
        setNewName,
        ...createLayerWithColor(0, 0, 0),
        {
          _obj: 'select',
          _target: [{_ref: 'layer', _name: EXPORT_MASK_FILENAME}],
          makeVisible: false,
          _options: {dialogOptions: 'dontDisplay'},
        },
        ...bringLayerToFront(false),
        {
          _obj: 'mergeLayersNew',
          _options: {dialogOptions: 'dontDisplay'},
        },
        setNewName,
      ];

      await action.batchPlay(cmd, {modalBehavior: 'execute'});
    },

    async handleMask(maskBuffer, currentLayerBuffer) {
      const maskJimpObject = await Jimp.read(maskBuffer);

      const whitePositions = [];
      maskJimpObject.scan(0, 0, maskJimpObject.bitmap.width, maskJimpObject.bitmap.height, (x, y, idx) => {
        const {data} = maskJimpObject.bitmap;
        const isWhiteColor = data[idx] === 255 && data[idx + 1] === 255 && data[idx + 2] === 255;
        if (isWhiteColor) {
          whitePositions.push({x, y});
        }
      });

      // +1 is required because positions start from 0-index
      // without +1 you can get 511 width/height for 512 image
      let bottomPosition = whitePositions.reduce((a, b) => (a.y > b.y ? a : b)).y + 1;
      let rightPosition = whitePositions.reduce((a, b) => (a.x > b.x ? a : b)).x + 1;
      let leftPosition = whitePositions.reduce((a, b) => (a.x < b.x ? a : b)).x;
      let topPosition = whitePositions.reduce((a, b) => (a.y < b.y ? a : b)).y;

      this.generatedImagePosition = {left: leftPosition, top: topPosition};

      if (this.currentMode === 'inpaint') {
        const inpaintAreaWidth = rightPosition - leftPosition;
        if (inpaintAreaWidth < 512) {
          const widthOffset = (512 - inpaintAreaWidth) / 2;
          const canvasWidth = maskJimpObject.bitmap.width;

          rightPosition += widthOffset;
          leftPosition -= widthOffset;
          if (rightPosition > canvasWidth) {
            rightPosition = canvasWidth;
            leftPosition = canvasWidth - 512;
          }
          if (leftPosition < 0) {
            leftPosition = 0;
            rightPosition = 512;
          }
        }

        const inpaintAreaHeight = bottomPosition - topPosition;
        if (inpaintAreaHeight < 512) {
          const heightOffset = (512 - inpaintAreaHeight) / 2;
          const canvasHeight = maskJimpObject.bitmap.height;

          bottomPosition += heightOffset;
          topPosition -= heightOffset;
          if (bottomPosition > canvasHeight) {
            bottomPosition = canvasHeight;
            topPosition = canvasHeight - 512;
          }
          if (topPosition < 0) {
            topPosition = 0;
            bottomPosition = 512;
          }
        }

        const leftOffset = this.generatedImagePosition.left - leftPosition;
        const topOffset = this.generatedImagePosition.top - topPosition;

        this.inpaintOriginalPosition = {
          leftOffset,
          topOffset,
          width: inpaintAreaWidth,
          height: inpaintAreaHeight,
        };

        // rightPosition = rightPosition < maskJimpObject.bitmap.width ? rightPosition : maskJimpObject.bitmap.width;
        // bottomPosition = bottomPosition < maskJimpObject.bitmap.height ? bottomPosition : maskJimpObject.bitmap.height;
        // leftPosition = leftPosition > 0 ? leftPosition : 0;
        // topPosition = topPosition > 0 ? topPosition : 0;
      }

      const width = rightPosition - leftPosition;
      const height = bottomPosition - topPosition;
      this.generatedImageSize = {width, height};

      maskJimpObject.crop(leftPosition, topPosition, width, height);

      const currentLayerJimpObject = await Jimp.read(currentLayerBuffer);
      currentLayerJimpObject.crop(leftPosition, topPosition, width, height);

      const maskBase64 = await maskJimpObject.getBase64Async(Jimp.MIME_PNG);
      const currentLayerBase64 = await currentLayerJimpObject.getBase64Async(Jimp.MIME_PNG);

      this.initImageData = {maskBase64, currentLayerBase64};
    },

    async chooseImage(id) {
      const imgUrl = this.generatedImages[id];
      const imgBase64 = imgUrl.replace(/^data:image\/\w+;base64,/, '');
      const img = Buffer.from(imgBase64, 'base64');

      // const imageFile = await storage.localFileSystem.getFileForSaving('image.png');
      const imageFile = await this.tempFolder.createFile('generated_image.png', {overwrite: true});
      await imageFile.write(img, {format: storage.formats.binary});

      const token = storage.localFileSystem.createSessionToken(imageFile); // batchPlay requires a token on _path

      try {
        this.currentLayerId = await core.executeAsModal(async (executionContext) => {
          const suspensionID = await executionContext.hostControl.suspendHistory({
            documentID: app.activeDocument.id,
            name: 'Place generated image',
          });

          if (this.currentLayerId) {
            const layer = app.activeDocument.activeLayers.find((x) => x._id === this.currentLayerId);
            if (layer) {
              await layer.delete();
            }
          }

          const placeImageCmd = [
            {
              _obj: 'placeEvent',
              target: {_path: token, _kind: 'local'},
              linked: false,
              _isCommand: true,
            },
            {
              _obj: 'multiGet',
              _target: {_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'},
              extendedReference: [['bounds', 'boundsNoEffects', 'boundsNoMask', 'layerID']],
              options: {failOnMissingProperty: false, failOnMissingElement: false},
            },
          ];

          const placeImageResults = await action.batchPlay(placeImageCmd, {modalBehavior: 'execute'});
          const placedImageTopPosition = placeImageResults[1].bounds.top._value;
          const placedImageLeftPosition = placeImageResults[1].bounds.left._value;

          const moveImageCmd = [
            {
              _obj: 'move',
              _target: [{_ref: 'layer', _enum: 'ordinal', _value: 'targetEnum'}],
              to: {
                _obj: 'offset',
                horizontal: {_unit: 'pixelsUnit', _value: this.generatedImagePosition.left - placedImageLeftPosition},
                vertical: {_unit: 'pixelsUnit', _value: this.generatedImagePosition.top - placedImageTopPosition},
              },
              _isCommand: true,
            },
          ];
          await action.batchPlay(moveImageCmd, {modalBehavior: 'execute'});

          // resume the history state
          await executionContext.hostControl.resumeHistory(suspensionID);

          return placeImageResults[1].layerID;
        });

        this.currentGeneratedImageIndex = id;
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

  .generate__generated-images.generated-images {
    img.active {
      border: 5px solid #2680eb;
      padding: -5px;
    }

    img:not(.active):hover {
      outline: 2px solid #2680eb;
    }
  }

</style>
