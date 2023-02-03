<template>
  <div id="wrapper" ref="wrapper">
    <div class="sp-tabs">
      <div v-for="tab in tabs" :key="tab" class="sp-tab" :class="{ 'selected': tab == currentTab }">
        <!-- UXP does not support text-transform -->
        <sp-label @click="changeTab(tab)">{{ tab[0].toUpperCase() + tab.slice(1) }}</sp-label>
      </div>
    </div>

    <GenerateTab v-show="currentTab == 'generate'" />
    <ExploreTab v-show="currentTab == 'explore'" />

    <sp-detail class="version">Version: {{ getVersion }}</sp-detail>
  </div>
</template>

<script>
import uxp from 'uxp';

import GenerateTab from './GenerateTab.vue';
import ExploreTab from './ExploreTab.vue';

export default {

  components: {
    GenerateTab,
    ExploreTab,
  },

  data() {
    return {
      tabs: ['generate', 'explore'],
      currentTab: 'generate',
    };
  },

  computed: {
    getVersion() {
      const devEnv = process.env.NODE_ENV === 'development' ? 'DEV ' : '';
      return `${devEnv}${uxp.versions.plugin} — ${process.env.VUE_APP_GIT_HASH.slice(0, 7)}`;
    },
  },

  mounted() {
    if (process.env.NODE_ENV === 'development') console.log('mounted'); // eslint-disable-line no-console

    this.$root.$on('changeTab', (tab) => {
      this.$refs.wrapper.scrollTop = 0;
      this.changeTab(tab);
    });
  },

  methods: {
    changeTab(tab) {
      this.currentTab = tab;
    },
  },

};
</script>

<style lang="scss">

  sp-button {
    cursor: pointer;
  }

  sp-textarea {
    height: 101px;
    line-height: 24px;
  }

  sp-picker {
    width: 100%;
  }

  /* INDEX.HTML */
  .version {
    text-align: center;
    margin-top: 150px;
    opacity: 0.8;
  }

  div {
    margin: auto;
  }
  #wrapper {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    padding: 20px;

    overflow-y: scroll;
    /* overflow-x: scroll; */
    /* height: 500px; */
  }

  /* SVG */
  path {
    fill: currentColor;
  }

  /* TABS */
  .sp-tabs {
    /* flex: 0 0 auto; */
    display: flex;
    /* flex-direction: row; */
    border-bottom: 2px solid #3E3E3E;
    margin-bottom: 20px;
  }

  .sp-tab {
    cursor: pointer;
    margin: 0 12px 0 0;
    /* padding: 0 20px; */

    &:hover sp-label {
      color: white;
    }

    &.selected {
      border-bottom: 2px solid white;
      margin-bottom: -2px;

      sp-label {
        color: white;
      }
    }

    sp-label {
      color: rgba(255, 255, 255, 0.75);

      font-size: 17px;
      font-weight: bold;
      padding: 5px 20px;
    }
  }

  @media (prefers-color-scheme: light), (prefers-color-scheme: lightest) {
    .sp-tabs {
      border-bottom: 2px solid #B8B8B8;
    }
    .sp-tab sp-label {
      color: rgba(0,0,0,0.66);
    }
    .sp-tab:hover sp-label {
      color: black;
    }
    .sp-tab.selected {
      border-bottom: 2px solid black;

      sp-label {
        color: black;
      }
    }
  }

  /* FORM */
  .form {
    & > div {
      display: flex;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    sp-picker {
      margin-bottom: 15px;
      display: block;
    }

    & > div sp-label {
      width: 100%;
    }

    sp-textfield, sp-textarea {
      width: 100%;
    }

    sp-slider {
      margin: 30px 0;
      position: relative;

      sp-label {
        margin: -5px 0;
      }

      .value {
        position: absolute;
        margin-top: -1px;
        right: 0;
        padding: 0;
        text-align: right;
        min-width: 0;
      }
    }

    .form__inline-field {
      flex-wrap: nowrap;
      align-items: end;

      sp-button {
        margin-left: 10px;
        font-weight: normal;
      }
    }
  }

  /* button that has only icon */
  .sp-button--icon {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 5px;
    min-width: 0;
    justify-content: center;
    align-items: center;
    display: flex;

    /* fill: #fff; */
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;

    width: auto;
    height: auto;
    padding: 0;

    &:hover {
      background: rgba(0, 0, 0, 1);
      color: rgba(255, 255, 255, 1);
    }

    svg {
      margin: 9px;
    }
  }

  /* GENERATED IMAGES */
  .generated-images {
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    & > div {
      width: calc(50% - 20px);
      min-height: 85px;
      cursor: pointer;
      position: relative;
      margin: 10px;
      margin-top: 0;
    }

    img {
      object-fit: cover;
      width: 100%;
      max-width: 100%;
      margin: 0;
      height: 100%;
      vertical-align: bottom;
    }

    .sp-button--icon {
      position: absolute;
      top: 0;
      margin: 7px;
      z-index: 1;

      width: 26px;
      height: 26px;
    }
  }

</style>
