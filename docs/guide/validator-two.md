<script setup lang="ts">
  import BaseValidatorTwo from '../demos/BaseValidatorTwo.vue'
  import CustomValidatorTwo from '../demos/CustomValidatorTwo.vue'

</script>

# 表单校验模式二

校验模式二则是通过naive自己的表单校验实现的。

## 普通校验

当你开启配置中的 `naive` 时校验模式二就会启动，默认开启非空校验，然后您调用组件实例中的 `naiveValidator` 方法就可以触发校验，您现在可以点击下方的校验按钮，您会发现表表单每一项下方都会弹出具体 `label` 的必填信息，当然您不喜欢 原生提示信息 的话您可以通过没像中的 `message` 配置单独设置。

<BaseValidatorTwo />

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
    type: 'Input',
    naive: true
  },
  {
    label: '爱好',
    key: 'like',
    type: 'Select',
    message: 'zx 和 tick',
    naive: true,
    axiosOptions() {
      return new Promise((resolve) => {
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

function naiveValidator() {
  ztFromRef.value?.navieValidator(() => {
    console.log('验证通过')   
  })
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="naiveValidator">验证</NButton>
    </div>
  </Card>
</template>
```

## 自定义校验

每一个输入控件的配置项，都会有一个 `naiveValidator` 参数，他既是覆盖默认 `naiveValidator` 行为的方法，您可以将您需要更新的值在 `naiveValidator` 方法中返回出去。他的回调参数就是调用组件 `naiveValidator` 方法时返回 `true` 即使通过否则反之，具体可以看控制台打印。

<CustomValidatorTwo />

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
    type: 'Input',
    naive: true,
  },
  {
    label: '爱好',
    key: 'like',
    type: 'Select',
    message: 'zx 和 tick',
    naive: true,
    axiosOptions() {
      return new Promise((resolve) => {
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

function naiveValidator() {
  ztFromRef.value?.navieValidator(() => {
    console.log('验证通过')   
  })
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="naiveValidator">验证</NButton>
    </div>
  </Card>
</template>
```