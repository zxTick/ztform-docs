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
