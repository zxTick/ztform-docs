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
      const {value} = item
      if(value[0] === '1') {
        message.error('账号不能以1开头')
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
