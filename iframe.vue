<style lang="scss" scoped>
.i-vue-frame {
  width: 100%;
  height: 100%;

  &.mask {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2147483647;
      background-color: white;
    }
  }
}
</style>

<template>
  <div class="i-vue-frame" ref="container"></div>
</template>

<script>
// Use Post Bridge
import postBridge from "post-bridge";

export default {
  name: "i-vue-frame",

  /**
   * Preset Options
   * ========== ========== ==========
   * @name { String } - default `iframe`
   * @width { Number }
   * @height { Number }
   * @scrolling { Boolean } - auto | yes | no
   * @src { String }
   *
   *
   * Custom Options
   * ========== ========== ==========
   * @style { Object }
   */
  props: {
    name: {
      type: [String],
      default: "iframe"
    },

    width: {
      type: [String, Number],
      default: "100%"
    },
    height: {
      type: [String, Number],
      default: "100%"
    },

    scroll: {
      type: [Boolean, String],
      default: "auto"
    },
    border: {
      type: [Boolean, String],
      default: false
    },

    mask: {
      type: [Boolean],
      default: false
    },

    src: {
      type: [String],
      default: ""
    },

    css: {
      type: [Object],
      default: {}
    },

    id: {
      type: [String],
      default: "frame"
    },

    message: {
      type: [String],
      default: "emit:message"
    }
  },

  data() {
    return {
      iframe: null,
      bridge: null,
      lock: false
    };
  },

  computed: {
    // Dom Insert iFrame
    dom() {
      return this.$refs.container;
    },
    // contentWindow of iFrame
    context() {
      return window.frames[this.name];
    },

    // Scrolling
    scrolling() {
      return ["no", "yes"][this.scroll - 0] || "auto";
    },
    // No Importance
    frameBorder() {
      return this.border.constructor === Boolean ? ["no", "yes"][this.border - 0] : this.border;
    }
  },

  watch: {
    src() {
      this.fluit(true);
    }
  },

  methods: {
    // Insert iFrame
    insert(iframe) {
      // Preset Lock for Cross Domain
      this.lock = false;

      // Insert iFrame
      this.dom.appendChild(iframe);

      // Use Post Bridge
      this.bridge = new postBridge(iframe);

      // Insert Css
      this.context.onload = () => {
        // Trigger After
        this.after(() => {
          // Add Sheets
          this.sheet(this.css);
        });
      };

      // 1s Trigger
      this.trigger(() => {
        // Trigger After
        this.after(() => {
          // Send CSS by Post Bridge
          this.bridge.send("emit:styles", { ...this.css });
        });
      });
    },

    // Sheet
    sheet(styles = {}, count = 0) {
      // New Sheet
      const sheet = new CSSStyleSheet();

      // Get Rules
      const rules = this.context.document.styleSheets[0];

      // Loop Styles
      for (const selector in styles) {
        rules.insertRule(`${selector} { ${styles[selector]} }`, count++);
      }
    },

    // Create iFrame
    init() {
      // Add Mask
      if (this.mask) {
        this.dom.classList.add("mask");
      }

      // Create iFrame Element
      this.iframe = document.createElement("iframe");

      // Set Properties
      this.iframe = Object.assign(this.iframe, {
        // Name for Use
        name: this.name,

        // Distance
        width: this.suffix(this.width),
        height: this.suffix(this.height),

        // Others
        scrolling: this.scrolling,
        frameBorder: this.frameBorder,

        // Link
        src: this.src,

        // ID
        id: this.id
      });

      // Insert
      this.insert(this.iframe);

      // Emit Hook
      this.bridge.onloader = () => this.$emit("onload", this.frame);
    },

    // Suffix
    suffix(value) {
      return /^\d+$/.test(value) ? `${value}px` : value;
    },

    // Tolence
    tolence(callback) {
      try {
        callback();
      } catch (e) {
        // console.log(e);
      }
    },

    // Remove iFrame
    remove() {
      // No iFrame No Work
      if (!this.iframe) {
        return false;
      }
      // Clean Context First
      this.tolence(() => this.context.document.write(""));

      // Close Win of iFrame
      this.tolence(() => this.context.close());

      // Remove Dom of iFrame
      this.tolence(() => this.iframe.remove());

      // Remove iFrame from Dom
      this.tolence(() => this.dom.removeChild(this.iframe));

      // Assignment
      this.iframe = null;

      // Complete
      return true;
    },

    // Trigger
    trigger(handler, time = 1680) {
      // Timeout
      let timeout = setTimeout(() => (handler(), clearTimeout(timeout)), time);
    },

    // After Frame
    after(callback = () => {}) {
      // Check Lock
      if (this.lock) {
        return false;
      }

      // Remove Mask
      if (this.mask) {
        this.tolence(() => this.dom.classList.remove("mask"));
      }

      // Receive Message From Page
      this.bridge.receive(this.message, data => this.$emit("emit", data));

      // Set Lock
      this.lock = true;

      // Callback
      callback();
    },

    // iFrame Fluit
    fluit(first = false) {
      // After Remove
      if (this.remove() || first) {
        // Init Then
        this.init();
      }
    }
  },

  mounted() {
    // Use Fluit as iFrame Control
    this.fluit(true);
  }
};
</script>
