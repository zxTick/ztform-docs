<script setup lang="ts">
import BaseUpdate from '../demos/BaseUpdate.vue'
import CustomUpdate from '../demos/CustomUpdate.vue'
import ProxyUpdate from '../demos/ProxyUpdate.vue'
</script>

# 表单更新

## 简单更新

想要将表单的值更新，可以调用组件实例中的 `update` 方法，其接受一个对象参数，执行此方法时，函数内部会在表单配置项中找到对应 key 的 value 进行赋值，从而更新表单。

<BaseUpdate />

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

function update() {
  const value = {
    username: '123',
    like: '0'
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
```

## 自定义更新

每一个输入控件的配置项，都会有一个 `update` 参数，他既是覆盖默认 update 行为的方法，您可以将您需要更新的值在 update 方法中返回出去。他的回调参数就是调用组件 update 方法时传入的对象，具体可以看控制台打印。

<CustomUpdate />

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
    update(row) {
      console.log(row)
      const { username } = row
      return username + '567'
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

function update() {
  const value = {
    username: '123',
    like: '0'
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
```

## 代理更新

代理更新的概念是当更新对象的里面出现我指定的 key 的时候，就算我自身的配置的 key 在更新对象中不存在时也会出发更新

* `代理单个值`：可以看一下代码爱好的配置项目中 proxyKey 监听了一个单个的字段 zt 在我们调用组件实例的 update 方法时，更新对象中存在 zt 这个字段，但是并不存在 like 字段，即便如此输入控件也会进行更新。

* `代理多个值`：可以看一下代码账号的配置项目中 proxyKey 监听了一个数组，数组中有多个字段，这样不管是更新对象中有 `username1` 还是 `username2` 表单控件都会更新。！！！！！需要注意的是监听多个值时，请一定要配合 配置中的 update 方法一起使用，就跟下面例子一样。

<ProxyUpdate />

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
```