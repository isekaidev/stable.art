import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import {BrowserTracing} from '@sentry/tracing';
import {app} from 'photoshop';
import uxp from 'uxp';

import App from './App.vue';
import modelCustomElement from './model-custom-element';

Vue.config.productionTip = false;

// https://github.com/vuejs/vue/issues/7830
Vue.directive('model-custom-element', modelCustomElement);

Vue.config.errorHandler = async (err) => {
  if (String(err)) {
    await app.showAlert(String(err));
  }
};

// https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/#debug
Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `stableart@${uxp.versions.plugin}—${process.env.VUE_APP_GIT_HASH}`,
  integrations: [
    new BrowserTracing(),
  ],
  tracingOptions: {trackComponents: true},
  logErrors: true,
  attachProps: true,
  attachStacktrace: true,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
  // Sentry recommend adjusting this value in production
  tracesSampleRate: 0.7,
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
