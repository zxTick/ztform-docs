<script setup lang="ts">
  import BaseReset from '../demos/BaseReset.vue'
  import CustomReset from '../demos/CustomReset.vue'
</script>

# 表单重置

## 简单重置

想要快速的将表单清空，可以调用组件实例中的 `reset` 方法他会将表单中绑定的值默认全部改为 `null` ，null 正是 naive 需要的。

<BaseReset/>

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import ztForm from '../components/ztForm/index.vue'
import { FormPlusItem, DataFormPlusType } from '../components/ztForm/props'
import Card from '../components/card/index.vue'
import { NButton } from 'naive-ui'

const ztFromRef = ref<null | DataFormPlusType>()

const options: FormPlusItem[] = [
  {
    label: '账号',
    key: 'username',
    type: 'Input'
  },
  {
    label: '爱好',
    key: 'like',
    type: 'Select',
    axiosOptions() {
      return new Promise((resolve, reject) => {
        resolve([
          {
            label: '打篮球',
            value: '0'
          },
          {
            label: '打皮球',
            value: '1'
          }
        ])
      })
    }
  }
]

function reset() {
  ztFromRef.value?.reset()
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="reset">重置参数</NButton>
    </div>
  </Card>
</template>

```

## 自定义重置

每一个输入控件的配置项，都会有一个 `reset` 参数，他既是覆盖默认 reset 行为的方法，您可以将您需要重置的值在 reset 方法中返回出去。他的回调参数是整个配置项具体可以看控制台打印。

<CustomReset />

``` vue
<script lang="ts" setup>
import { ref } from 'vue'
import ztForm from '../components/ztForm/index.vue'
import { FormPlusItem, DataFormPlusType } from '../components/ztForm/props'
import Card from '../components/card/index.vue'
import { NButton } from 'naive-ui'

const ztFromRef = ref<null | DataFormPlusType>()

const options: FormPlusItem[] = [
  {
    label: '账号',
    key: 'username',
    type: 'Input',
    reset(formItem) {
      console.log(formItem)
      return '123'
    }
  },
  {
    label: '爱好',
    key: 'like',
    type: 'Select',
    axiosOptions() {
      return new Promise((resolve, reject) => {
        resolve([
          {
            label: '打篮球',
            value: '0'
          },
          {
            label: '打皮球',
            value: '1'
          }
        ])
      })
    }
  }
]

function reset() {
  ztFromRef.value?.reset()
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="reset">重置参数</NButton>
    </div>
  </Card>
</template>

```