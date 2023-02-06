<div align="center">
    <a href="https://discord.gg/hTbDFxG78a">
        <img src="./discord_logo.png" alt="discord logo" />
    </a>
</div>

# Stable.art 🖼

Stable.art is an open-source plugin for Photoshop (v23.3.0+) that allows you to use Stable Diffusion (with Automatic1111 as a backend) to accelerate your art workflow. Say goodbye to tedious art processes and hello to seamless creativity with Stable.art.

https://user-images.githubusercontent.com/118139897/211406928-63c2c689-ff75-4825-a49e-7cb2eb352006.mp4

## How to install

0. Download [the CCX file](https://github.com/isekaidev/stable.art/releases/download/v0.0.1/stable.art_0.0.1.ccx).
1. Open the Creative Cloud desktop app and ensure it is running and up to date.
2. Make sure you have the latest version of Photoshop installed. If not, update it through the Creative Cloud desktop app.
3. Open Photoshop.
4. Double-click on the downloaded CCX file.
5. Follow the prompts and the plugin panel should appear in Photoshop. If it does not, go to Plugins > Stable.art.

### Start API server

To use Stable.art you need to enable an API for your Automatic1111:

* If you use Automatic1111 locally, then you need to follow this [guide](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API).

* If you want to use Google Colab, then you can use [fast-stable-diffusion](https://github.com/TheLastBen/fast-stable-diffusion). It supports API out of the box.

Lastly, enter the url of your Automatic1111 server (e.g. `http://127.0.0.1:7860`, `https://***.gradio.live`, `https://***.loca.lt`, `https://***.gradio.app`, etc) in the "Endpoint" field.

## Features

### Lexica.art Integration

If you need help coming up with ideas or finding assistance with prompts, you can use the Lexica.art search engine right inside the plugin for inspiration.

### txt2img

By default, txt2img generates an image with a size of 512x512. If you want to generate an image with a specific size, you can use the rectangular marquee tool and specify any size (with any ratio!) you desire.

### img2img/inpaint

To use img2img/inpaint, simply select an area of your image using any selection tool. Yes, you can use any selection tool (e.g. rectangular marquee, lasso, quick selection, magic wand, or any other selection tool). Then to generate an image, simply click the "Generate" button. It is that easy - no masks or any other complicated steps are required.

### outpaint

Coming Soon.

## Development

1. Install dependencies.

    ```bash
    npm install
    ```

2. Start a server to compile and hot-reload the plugin.

    ```bash
    npm run serve
    ```

3. Open Photoshop, then open "Adobe UXP Developer Tool", click "Add plugin", and select `manifest-dev.json`, which is located in the `/public` folder. Note: during development, you should only use `manifest-dev.json` because `manifest.json` (which will be located in the `/dist` folder) should be used only for final builds after running `npm run build` (and you can just ignore `manifest.json` that is located in the `/public` folder). Two manifests are required to conveniently test final builds - "UXP Developer Tool" does not support adding multiple plugins with the same ids.

4. You will get the plugin with id `dev.stable.art`, click on its Actions and then click "Load".
