# i-vue-frame

An iframe Solution compatible Vue 2.x and Vue 3.x

## install

```sh
npm i i-vue-frame
# or
yarn add i-vue-frame
```

## init

```js
import iVueFrame from "i-vue-frame";

Vue.use(iVueFrame);
```

## sample use

```vue
<template>
  <i-vue-frame width="100%" height="100%" :css="styles" src="http://localhost:8080/example" />
</template>

<script>
export default {
  data() {
    return {
      styles: {
        aside: "display: none !important;",
        header: "display: none !important;"
      }
    };
  }
};
</script>
```

## frame onload

```vue
<template>
  <i-vue-frame @onload="frameOnloadHook" src="http://localhost:8080/example" />
</template>

<script>
export default {
  methods: {
    frameOnloadHook(iframe) {
      console.log(iframe);
    }
  }
};
</script>
```

## post-message

> use [post-bridge](https://www.npmjs.com/package/post-bridge)

### get message from iframe ( send message in iframe )

```vue
<template>
  <i-vue-frame @emit="emitMessage" src="http://localhost:8080/example" />
</template>

<script>
// in Parent Page

export default {
  methods: {
    emitMessage(data = {}) {
      console.log("Get Message from iFrame", data);
    }
  }
};
</script>
```

> in iFrame, send `emit:message` by `post-bridge`

```vue
<template>
  <button @click="sendMessageToPage">Send Message to Page</button>
</template>

<script>
import { send } from "i-vue-frame/api";

export default {
  methods: {
    sendMessageToPage() {
      send({ key: "sendMessageToPage" });
    }
  }
};
</script>
```

### send message to iframe

> send message to iframe with namespace `emit:custom`

```vue
<template>
  <button @click="sendMessageToIframe">Send Message to iFrame</button>
  <!-- set id on i-vue-frame -->
  <i-vue-frame id="customFrame" src="http://localhost:8080/example" />
</template>

<script>
import { send } from "i-vue-frame/api";

export default {
  methods: {
    sendMessageToIframe() {
      // get frame object by id
      const frame = document.getElementById("frame");

      send({ key: "sendMessageToIframe" }, "emit:custom", frame);
    }
  }
};
</script>
```

> receive message from page with namespace `emit:custom`

```vue
<script>
import { receive } from "i-vue-frame/api";

export default {
  mounted() {
    receive(data => console.log(data), "emit:custom");
  }
};
</script>
```

# !! Cross Domain with Styles

> Add These Code in iFrame

```js
// Import Receive
import { sheet } from "i-vue-frame/api";

// Use Receive
sheet((data, { addCss }) => {
  for (const selector in data) {
    addCss(selector, data[selector]);
  }
});
```
