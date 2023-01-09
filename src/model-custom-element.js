/* eslint-disable no-param-reassign */
import Vue from 'vue';

const wm = new WeakMap();

export default {
  bind(el, binding, vnode) {
    const inputHandler = (event) => Vue.set(vnode.context, binding.expression, event.target.value);
    wm.set(el, inputHandler);
    el.value = binding.value;
    el.addEventListener('input', inputHandler);
  },

  componentUpdated(el, binding) {
    el.value = binding.value;
  },

  unbind(el) {
    const inputHandler = wm.get(el);
    el.removeEventListener(el, inputHandler);
  },
};
