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
