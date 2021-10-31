// Code by Jaron

// Import iFrame
import iframe from "./iframe.vue";

// Use Plugin Object
import { PluginObject } from "vue";

// Export for Usage
export default {
  install(Vue) {
    Vue.component("i-vue-frame", iframe);
  }
} as PluginObject<void>;
