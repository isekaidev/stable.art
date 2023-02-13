import * as Sentry from '@sentry/vue';
import {storage} from 'uxp';
import {action, core, app} from 'photoshop';
import * as fs from 'fs';

import Jimp from 'jimp';

const EXPORT_MASK_FILENAME = 'stableart_exported_mask.png';

export default {
  methods: {
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

      await core.executeAsModal(async (executionContext) => {
        const suspensionID = await executionContext.hostControl.suspendHistory({
          documentID: app.activeDocument.id,
          name: 'Save selection',
        });

        const hasMaskChannel = app.activeDocument.channels.getByName('stableart_mask');
        const handleMaskChannelCmd = [
          ...hasMaskChannel ? [{
            _obj: 'delete',
            _target: {_ref: 'channel', _name: 'stableart_mask'},
          }] : [],

          // If there is no selection, then this is the txt2img mod;
          // we need to set a new selection (that covers the entire document)
          // because otherwise a generated image can be placed beyond the canvas borders
          ...selection ? [] : [{
            _obj: 'set',
            _target: {_ref: 'channel', _property: 'selection'},
            to: {
              _obj: 'rectangle',
              top: {_unit: 'pixelsUnit', _value: 0},
              left: {_unit: 'pixelsUnit', _value: 0},
              bottom: {_unit: 'pixelsUnit', _value: app.activeDocument.height},
              right: {_unit: 'pixelsUnit', _value: app.activeDocument.width},
            },
          }],

          {
            _obj: 'duplicate',
            _target: {_ref: 'channel', _property: 'selection'},
            name: 'stableart_mask',
          },
        ];

        await action.batchPlay(handleMaskChannelCmd, {modalBehavior: 'execute'});
        await executionContext.hostControl.resumeHistory(suspensionID);
      }, {commandName: 'Saving selection...'});

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
      if (!this.models.length) {
        await this.handleEndpointBlurAndLoadModels();
        if (!this.models.length) return; // no models == no connection to server
      }

      if (this.isGenerating) {
        this.interrupt();
        return;
      }

      if (!this.endpoint) {
        await app.showAlert('Error: you did not provide an endpoint');
        return;
      }

      if (!app.activeDocument) {
        await core.executeAsModal(async () => {
          await app.documents.add({
            width: 512,
            height: 512,
            resolution: 72,
            mode: 'RGBColorMode',
            fill: '#fff',
          });
        });
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
      storage.localStorage.setItem('cfgScale', this.cfgScale);
      storage.localStorage.setItem('currentSampler', this.currentSampler);
      storage.localStorage.setItem('imagesNumber', this.imagesNumber);
      storage.localStorage.setItem('currentMode', this.currentMode);

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
          styles: this.getCheckedStyles,
          seed: this.seed ? Number(this.seed) : -1,
          subseed: -1,
          subseed_strength: 0,
          seed_resize_from_h: -1,
          seed_resize_from_w: -1,
          batch_size: this.imagesNumber,
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
          styles: this.getCheckedStyles,
          seed: this.seed ? Number(this.seed) : -1,
          subseed: -1,
          subseed_strength: 0,
          seed_resize_from_h: -1,
          seed_resize_from_w: -1,
          batch_size: this.imagesNumber,
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

        const [currentLayerBuffer, currentLayerProperties] = await this.exportActiveLayer('document');
        const isCurrentLayerTopmost = currentLayerProperties.count === currentLayerProperties.itemIndex;
        await this.generateMaskFromSelection(isCurrentLayerTopmost);

        const [maskBuffer] = await this.exportActiveLayer('mask');

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

    async loadLocalFile(filename, count, debugType) {
      const newCount = count ? count + 1 : 1;

      if (newCount > 5000) {
        await app.showAlert(`Cannot export ${filename}. Try to reload Photoshop and check that "Quick Export as PNG" is working`);
        // throw new Error(`Cannot export ${filename}`);

        // DEBUG ERROR: Cannot export stableart_exported_mask.png (PHOTOSHOP-PLUGIN-G)
        Sentry.captureException(new Error(`Cannot export ${filename}; type=${debugType}`), {
          contexts: {
            activeDocumentObject: app.activeDocument,
            documentProperties: {
              debugType,

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

      try {
        const fileArrayBuffer = await fs.readFile(`plugin-temp:/${filename}`);
        if (fileArrayBuffer.byteLength === 0) return this.loadLocalFile(filename, newCount, debugType);
        return fileArrayBuffer;
      }
      catch (e) {
        return this.loadLocalFile(filename, newCount, debugType);
      }
    },

    async exportActiveLayer(debugType) {
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
      await app.activeDocument.saveAs.png(imageFile, {compression: 6}, true);

      const activeLayerBuffer = await this.loadLocalFile(EXPORT_MASK_FILENAME, 0, debugType);
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
          _target: {_ref: 'layer'},
        },
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
      ];
      await action.batchPlay(cmd, {modalBehavior: 'execute'});

      // we need to separate select and bringLayerToFront() into 2 batchPlays
      // because old photoshop versions have a bug and ignore bringLayerToFront() if we get a new selection
      // https://forums.creativeclouddeveloper.com/t/move-layer-bug/3458/2
      await action.batchPlay([
        ...bringLayerToFront(false),
        {
          _obj: 'mergeLayersNew',
          _options: {dialogOptions: 'dontDisplay'},
        },
        setNewName,
      ], {modalBehavior: 'execute'});
    },

    async handleMask(maskBuffer, currentLayerBuffer) {
      const maskJimpObject = await Jimp.read(maskBuffer);

      const whitePositions = [];
      maskJimpObject.scan(0, 0, maskJimpObject.bitmap.width, maskJimpObject.bitmap.height, (x, y, idx) => {
        const {data} = maskJimpObject.bitmap;
        const isWhiteColor = data[idx] !== 0 && data[idx + 1] !== 0 && data[idx + 2] !== 0;
        if (isWhiteColor) {
          whitePositions.push({x, y});
        }
      });

      // DEBUG ERROR: Reduce of empty array with no initial value (PHOTOSHOP-PLUGIN-1B)
      if (!whitePositions.length) {
        Sentry.configureScope((scope) => {
          scope.addAttachment({filename: 'handleMask_maskBuffer.png', data: new Uint8Array(maskBuffer), contentType: 'image/png'});
          // scope.addAttachment({filename: 'handleMask_currentLayerBuffer.png', data: new Uint8Array(currentLayerBuffer), contentType: 'image/png'});
        });

        Sentry.setContext('handleMask', {
          maskBuffer: maskBuffer?.byteLength,
          currentLayerBuffer: currentLayerBuffer?.byteLength,
          maskJimpObject,
          maskJimpObjectBitmap: maskJimpObject?.bitmap,
          // sentryDebugMaskBase64
        });
      }

      // +1 is required because positions start from 0-index
      // without +1 you can get 511 width/height for 512 image
      let bottomPosition = whitePositions.reduce((a, b) => (a.y > b.y ? a : b)).y + 1;
      let rightPosition = whitePositions.reduce((a, b) => (a.x > b.x ? a : b)).x + 1;
      let leftPosition = whitePositions.reduce((a, b) => (a.x < b.x ? a : b)).x;
      let topPosition = whitePositions.reduce((a, b) => (a.y < b.y ? a : b)).y;

      this.generatedImagePosition = {left: leftPosition, top: topPosition};

      if (this.currentMode === 'inpaint') {
        const inpaintAreaWidth = rightPosition - leftPosition;
        const inpaintAreaHeight = bottomPosition - topPosition;

        const inpaintMinSize = {width: 512, height: 512};

        // if inpaintDimension is used, alter inpaintMinSize.width or height to take
        // into account the ratio that will be applied in getSizeForGeneratingImage()
        if (this.inpaintDimension > 480) { // not auto inpaint dimension
          if (inpaintAreaWidth > inpaintAreaHeight
            && inpaintAreaHeight * (this.inpaintDimension / inpaintAreaWidth) < 512) {
            inpaintMinSize.height *= 512 / this.inpaintDimension; // ensure 512 minimum height
          }
          else if (inpaintAreaWidth > inpaintAreaHeight) {
            inpaintMinSize.height *= inpaintAreaHeight / inpaintAreaWidth; // reduced minimum height
          }
          else if (inpaintAreaHeight > inpaintAreaWidth
            && inpaintAreaWidth * (this.inpaintDimension / inpaintAreaHeight) < 512) {
            inpaintMinSize.width *= 512 / this.inpaintDimension; // ensure 512 minimum width
          }
          else if (inpaintAreaHeight > inpaintAreaWidth) {
            inpaintMinSize.width *= inpaintAreaWidth / inpaintAreaHeight; // reduced minimum width
          }
        }

        // enforce inpaint minimum width
        if (inpaintAreaWidth < inpaintMinSize.width) {
          const widthOffset = (inpaintMinSize.width - inpaintAreaWidth) / 2;
          const canvasWidth = maskJimpObject.bitmap.width;

          rightPosition += widthOffset;
          leftPosition -= widthOffset;
          if (rightPosition > canvasWidth) {
            rightPosition = canvasWidth;
            leftPosition = canvasWidth - inpaintMinSize.width;
          }
          if (leftPosition < 0) {
            leftPosition = 0;
            rightPosition = inpaintMinSize.width;
          }
        }

        // enforce inpaint minimum height
        if (inpaintAreaHeight < inpaintMinSize.height) {
          const heightOffset = (inpaintMinSize.height - inpaintAreaHeight) / 2;
          const canvasHeight = maskJimpObject.bitmap.height;

          bottomPosition += heightOffset;
          topPosition -= heightOffset;
          if (bottomPosition > canvasHeight) {
            bottomPosition = canvasHeight;
            topPosition = canvasHeight - inpaintMinSize.height;
          }
          if (topPosition < 0) {
            topPosition = 0;
            bottomPosition = inpaintMinSize.height;
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

      Sentry.configureScope((scope) => {
        scope.clearAttachments();
      });

      this.initImageData = {maskBase64, currentLayerBase64};
    },
  },
};
