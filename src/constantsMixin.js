// separate variables are for using inside data() because of the Vue lifecycle (Vue calls data() BEFORE computed)
// mixin with computed are for using inside templates (<html>)

export const EXPORT_MASK_FILENAME = 'stableart_exported_mask.png';
export const DISABLED_MINIMUM_DIMENSION = 448;

export const constantsMixin = {
  computed: {
    getConstants() {
      return {
        EXPORT_MASK_FILENAME,
        DISABLED_MINIMUM_DIMENSION,
      };
    },
  },
};
