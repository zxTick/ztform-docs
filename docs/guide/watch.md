<script setup lang="ts">
  import BaseWatch from '../demos/BaseWatch.vue'
</script>

# 监听模式


## 普通监听

在通过配置生成表单中，其中一项想要监听另一项时就会变得比较棘手，因为他们都是配置我们无从下手。
<br />
但是在 `ztform` 中，我们可以通过 `watchKey` 属性来设置监听，这样就可以让我们的表单更加灵活。他可以同时监听多项。
<br />

`watchKey` 属性必须要配合 `watchCallBack` 回调函数一起使用。 `watchCallBack` 的回调参数可以拿到搜有监听对象的信息，并且也提供自己的对应的响应式对象，具体使用可以看下面例子中的代码。

<BaseWatch />

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import ztForm from '../components/ztForm/index.vue'
import { FormPlusItem, DataFormPlusType } from '../components/ztForm/props'
import Card from '../components/card/index.vue'

const ztFromRef = ref<null | DataFormPlusType>()

const options: FormPlusItem[] = [
  {
    label: '账号',
    key: 'username',
    type: 'Input',
  },
  {
    label: '密码/年龄',
    key: 'password',
    type: 'Input',
    watchKey: ['username'],
    watchCallBack(proxy, values, self) {
      console.log(proxy);
      console.log(values);
      console.log(self);
      const [username] = values
      if (username === '123') {
        self.type = 'InputNum'
      }
    }
  }
]

</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
  </Card>
</template>
```