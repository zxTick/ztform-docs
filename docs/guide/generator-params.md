<script setup lang="ts">
  import Base from '../demos/base.vue'
  import SplitParameters from '../demos/SplitParameters.vue'
</script>

# 获取参数
:::info
以下事例均可在控制台参看变化
:::

## 简单获取

简单的获取参数可以通过调用组件事例中的 `getParameters` 方法获取，他会根据您在在配置项中书写的 key 和表单输入控件输入的值形成一个对象。

<Base />

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

function getParameters() {
  console.log(ztFromRef.value?.generatorParams())
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="getParameters">获取参数</NButton>
    </div>
  </Card>
</template>
```

## 分割参数

分割参数就是把一个参数分割成 N 个参数，并且原来的参数并不会被保存。但是这不是一定的 您可以完全由 `reconfiguration` 函数的返回值控制，此函数的返回值就是您当前输入控件的中值。

<SplitParameters />


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
    reconfiguration(value) {
      return [
        {
          key: 'username1',
          value: value[0]
        },
        {
          key: 'username2',
          value: value[1]
        }
      ]
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

function getParameters() {
  console.log(ztFromRef.value?.generatorParams())
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="getParameters">获取参数</NButton>
    </div>
  </Card>
</template>
```