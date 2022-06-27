<script setup lang="ts">
  import BaseValidatorOne from '../demos/BaseValidatorOne.vue'
  import CustomValidatorOne from '../demos/CustomValidatorOne.vue'
</script>

# 表单校验模式一

表单校验模式一，是哪部自定义的验证规则并不属于 navie 的验证范畴中。

## 普通校验

当你开启配置中的 `required` 时校验模式一就会启动，然后您调用组件实例中的 `validator` 方法就可以触发校验，您现在可以点击下方的校验按钮，您会发现 alert 会弹出具体 `label` 的必填信息，当然您不喜欢 `alert` 的话您可以将其换成任何您喜欢的api。

<BaseValidatorOne />

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
    required: true
  },
  {
    label: '爱好',
    key: 'like',
    type: 'Select',
    required: true,
    axiosOptions() {
      return new Promise((resolve, ) => {
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

function validator() {
  console.log(ztFromRef.value?.validator());
  // 如果验证通过则为 true，否则为 false

}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="validator">校验</NButton>
    </div>
  </Card>
</template>
```

## 自定义校验方式

每一个输入控件的配置项，都会有一个 `validator` 参数，他既是覆盖默认 `validator` 行为的方法，您可以将您需要更新的值在 `validator` 方法中返回出去。他的回调参数就是调用组件 `validator` 方法时返回 `true` 即使通过否则反之，具体可以看控制台打印。

<CustomValidatorOne />

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
    required: true,
    validator(item, message) {
      const {value = ''} = item
      if(value === null || value[0] === '1') {
        message.error('账号规则不正确')
        return false
      } else {
        return true
      }
    }
  },
  {
    label: '爱好',
    key: 'like',
    type: 'Select',
    required: true,
    axiosOptions() {
      return new Promise((resolve, ) => {
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

function validator() {
  console.log(ztFromRef.value?.validator());
  // 如果验证通过则为 true，否则为 false
  
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="validator">校验</NButton>
    </div>
  </Card>
</template>

```