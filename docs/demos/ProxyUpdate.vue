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
    proxyKey: ['username1', 'username2'],
    update(row) {
      console.log(row)
      const { username1, username2 } = row
      return username1 + username2
    }
  },
  {
    label: '爱好',
    key: 'like',
    type: 'Select',
    proxyKey: 'zt',
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

function update() {
  const value = {
    username1: '123',
    username2: '456',
    zt: '0'
  }
  ztFromRef.value?.update(value)
}
</script>

<template>
  <Card>
    <zt-form :options="options" preset="grid-item" ref="ztFromRef" />
    <div>
      <NButton @click="update">更新表单</NButton>
    </div>
  </Card>
</template>
