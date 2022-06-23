<script lang="ts" setup>
import {
  computed,
  reactive,
  ref,
  toRef,
  watch,
  onMounted,
  WatchStopHandle,
  onUnmounted
} from 'vue'
import DataFormPlusProps, { FormPlusData, FormPlusItem } from './props'
import { logError, logWarning, noop } from '../../utils/tools'
import { isArray } from '@vue/shared'
import {
  NInput,
  NSpace,
  NGrid,
  NForm,
  NFormItem,
  NTransfer,
  NTreeSelect,
  NSelect,
  NInputNumber,
  NTimePicker,
  NRadio,
  NRadioGroup,
  NCheckboxGroup,
  NCheckbox,
  NFormItemGi,
  NDatePicker,
  NSwitch
} from 'naive-ui'

// component props
const props = defineProps(DataFormPlusProps)
const options = toRef(props, 'options')

// component state
const data = reactive<{ value: FormPlusData[] }>({
  value: []
})
const rules = ref<any>({})
const _value = computed(() => {
  return generatorParams('role')
})

// RefDom | RefComponent
const dataForm = ref<any>(null)

// stopEffect
const stopWatchs: any[] = []

// component var
const axiosOptionsMap = new Map<string, FormPlusData>()
let noOptionsType = ['Input', 'InputNum', 'Picker', 'Time', 'Switch', 'Img']

onMounted(() => {
  if (axiosOptionsMap.size > 0) {
    axiosOptionsMap.forEach(async value => {
      const proxy = value
      if (proxy.axiosOptions) {
        const res = await proxy.axiosOptions()
        setProxyOptions(proxy, res)
      }
      if (proxy.defaultValue) {
        setProxyDefaultValue(proxy)
      }
      closeComponentLoading(proxy)
      axiosOptionsMap.delete(proxy.key)
    })
  }
})

const setProxyOptions = (proxy: FormPlusData, value: any[]) => {
  proxy.options = value
}
const setProxyDefaultValue = (proxy: FormPlusData) => {
  proxy.value = proxy.defaultValue || null
}

function initRules() {
  if (data.value) {
    rules.value = []
    data.value.forEach(item => {
      let message = `${item.label}不可以为空，请输入值。`
      if ((item.path && item.path !== '') || item.naive) {
        const rule = {
          type: item.ruleType || 'string',
          required: item.naive || item.required,
          message: item.message || message,
          trigger: item.trigger || 'blur',
          validator: item.naiveValidator
        }
        if (!rule.validator) {
          delete rule.validator
        }
        rules.value[item.path || item.key] = rule
      }
    })
  }
}
function initializeTheCenter() {
  if (!options.value) {
    return
  }
  for (const iterator of options.value) {
    mixinData(iterator)
  }
  initRules()
  initWatch()
}
initializeTheCenter()

function initWatch() {
  data.value.forEach(item => {
    if (!item.watchKey || !item.watchCallBack) {
      if (item.watchCallBack || item.watchKey) {
        logError('请让watchKey和watchCallBack 一同食用')
      }
      return
    }

    let keyArr = isArray(item.watchKey) ? item.watchKey : [item.watchKey]

    const collectTheKeyFunction: (() => any)[] = []

    const params = keyArr
      .map(key => {
        const proxy = data.value.find(it => it.key === key)
        if (proxy) {
          injectionToMonitorAnArrayElement(proxy)
        } else {
          logWarning(`你输入的key=${key}不再存在于你传入的表单配置中`)
        }
        return proxy
      })
      .filter(item => !!item) as FormPlusData[]

    if (params.length === 0) {
      logWarning(
        `您在${item.label}---${item.key}中传入${JSON.stringify(
          item.watchKey
        )}全部无效`
      )
      return
    }

    function injectionToMonitorAnArrayElement(proxy: FormPlusData) {
      collectTheKeyFunction.push(() => proxy?.value)
    }

    let stopWatch = watch(collectTheKeyFunction, async newValue => {
      openComponentLoading(item)
      const res =
        item.watchCallBack && (await item.watchCallBack(params, newValue, item))
      if (item._isWatchUpdate) {
        item.value = null
      } else {
        item._isWatchUpdate = true
      }
      item.options = res as any[]
      initRules()
      closeComponentLoading(item)
    })
    stopWatchs.push(stopWatch)
  })
}
const openComponentLoading = (proxy: FormPlusData) => {
  proxy._loading = true
}
const closeComponentLoading = (proxy: FormPlusData) => {
  proxy._loading = false
}
function mixinData(iterator: FormPlusItem) {
  let options: any[] = []
  iterator.size = iterator.size || 'small'
  let _isWatchUpdate: boolean = true
  if (iterator.defaultValue) {
    _isWatchUpdate = false
  }
  const ProxyLength = data.value.push({
    ...iterator,
    value: null,
    options,
    _loading: true,
    _isWatchUpdate: _isWatchUpdate
  })

  const proxy = data.value[ProxyLength - 1]
  if (iterator.axiosOptions) {
    axiosOptionsMap.set(proxy.key, proxy)
  }
}

function generatorParams(type: string = 'create') {
  if (!data.value) return
  return data.value.reduce((pre: any, cur: FormPlusData) => {
    if (type === 'create') {
      if (cur.reconfiguration && cur.value !== null) {
        cur.reconfiguration(cur.value).forEach(item => {
          pre[item.key] = item.value
        })
      } else {
        pre[cur.key] = cur.value
      }
    } else if (type === 'role') {
      pre[cur.key] = cur.value
    }

    return pre
  }, {})
}

async function update(it: any) {
  Object.keys(it).forEach(key => {
    const targetProxy = findTargetProxy(key)
    if (!targetProxy) {
      return
    }

    if (targetProxy._watch) {
      targetProxy._watch()
    }

    const value = targetProxy.update
      ? targetProxy.update(it)
      : it[key]
      ? it[key]
      : null
    const isTargetProxyHas = noOptionsType.indexOf(targetProxy.type) === -1

    let stopWatch: WatchStopHandle = noop
    if (targetProxy.options.length === 0 && isTargetProxyHas) {
      stopWatch = watch(
        () => targetProxy.options,
        () => {
          targetProxy.value = value
          stopWatch()
        },
        { deep: true }
      )
    } else {
      targetProxy.value = value
    }

    targetProxy._watch = stopWatch
  })
}

function findTargetProxy(key: string) {
  const targetProxy = data.value.find(it => {
    const currentKey = it.proxyKey ? it.proxyKey : it.key
    if (isArray(currentKey)) {
      return currentKey.some(value => value === key)
    } else {
      return currentKey === key
    }
  }) as FormPlusData

  return targetProxy
}

/**
 * @description: 重置表单（清空表单）
 */
function reset() {
  if (!data.value) return
  data.value.forEach((it: FormPlusData) => {
    if (it.reset) {
      it.value = it.reset(it)
    } else {
      ;(it.value as any) = null
    }
  })
}

/**
 * @description: 使用naive自带的校验模式
 * @param {Function} callBack 成功后的回调函数
 */
function navieValidator(callBack: Function) {
  if (dataForm.value) {
    dataForm.value.validate((errors: any) => {
      if (!errors) {
        callBack()
      }
    })
  }
}

/**
 * @description: 开启表单验证
 * @return {boolean}
 */
function validator() {
  const messageTools = {
    error: (message: string) => alert(message)
  }
  if (!data.value) return
  return data.value.every((it: FormPlusData) => {
    if (it.validator) {
      return it.validator(it, messageTools as any)
    }
    if (it.required) {
      if (it.value) {
        return true
      }
      messageTools?.error(it.label + '不能为空')
      return false
    }
    return true
  })
}

onUnmounted(() => {
  // 取消effect的缓存
  if (stopWatchs.length > 0) {
    stopWatchs.forEach(stop => {
      stop()
    })
  }
})

defineExpose({
  generatorParams,
  update,
  reset,
  navieValidator,
  validator,
  _value
})
</script>

<template>
  <n-form
    v-bind="props.formConfig"
    ref="dataForm"
    :model="_value"
    :rules="rules"
  >
    <!-- 非响应式 -->
    <template v-if="props.preset === 'form-item'">
      <template v-for="item in data.value" :key="item.key">
        <n-form-item
          :label="item.label"
          :path="item.path || item.key"
          v-if="item.type !== 'Null'"
        >
          <template v-if="item.type === 'Input'">
            <n-input
              v-bind="item.cops"
              :size="item.size"
              v-model:value="item.value"
            />
          </template>
          <template v-else-if="item.type === 'InputNum'">
            <n-input-number
              v-bind="item.cops"
              :size="item.size"
              v-model:value="item.value"
            />
          </template>
          <template v-else-if="item.type === 'Select'">
            <n-select
              v-bind="item.cops"
              :size="item.size"
              v-model:value="item.value"
              :options="item.options"
              :loading="item._loading"
            />
          </template>
          <template v-else-if="item.type === 'Checkbox'">
            <n-checkbox-group
              v-model:value="item.value"
              :size="item.size"
              v-bind="item.cops"
            >
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="ic in item.options"
                  :key="ic.value"
                  :value="ic.value"
                  :label="ic.label"
                />
              </n-space>
            </n-checkbox-group>
          </template>
          <template v-else-if="item.type === 'Radio'">
            <n-radio-group
              v-model:value="item.value"
              :size="item.size"
              v-bind="item.cops"
              name="ic"
            >
              <n-space>
                <n-radio
                  v-for="song in item.options"
                  :key="song.value"
                  :value="song.value"
                >
                  {{ song.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </template>
          <template v-else-if="item.type === 'Picker'">
            <n-date-picker
              v-model:value="item.value"
              :size="item.size"
              v-bind="item.cops"
            />
          </template>
          <template v-else-if="item.type === 'Time'">
            <n-time-picker
              v-model:value="item.value"
              :size="item.size"
              v-bind="item.cops"
            />
          </template>
          <template v-else-if="item.type === 'Switch'">
            <n-switch
              v-model:value="item.value"
              :size="item.size"
              v-bind="item.cops"
            />
          </template>
          <template v-else-if="item.type === 'TreeSelect'">
            <n-tree-select
              :options="item.options"
              v-model:value="item.value"
              :size="item.size"
              v-bind="item.cops"
              :loading="item._loading"
            />
          </template>
          <template v-else-if="item.type === 'Transfer'">
            <n-transfer
              v-model:value="item.value"
              :size="item.size"
              v-bind="item.cops"
              :options="item.options"
              :loading="item._loading"
            />
          </template>

          <template v-else-if="item.type === 'Null'"> </template>
          <template v-if="item.required">
            <span class="text-red-600 ml-2">*</span>
          </template>
        </n-form-item>
      </template>
    </template>
    <!-- 响应式 -->
    <template v-else-if="props.preset === 'grid-item'">
      <n-grid :cols="props.cols" :xGap="10">
        <template v-for="item in data.value" :key="item.key">
          <n-form-item-gi
            :label="item.label"
            :path="item.path || item.key"
            v-if="item.type !== 'Null'"
          >
            <template v-if="item.type === 'Input'">
              <n-input
                v-bind="item.cops"
                :size="item.size"
                v-model:value="item.value"
              />
            </template>
            <template v-else-if="item.type === 'InputNum'">
              <n-input-number
                v-bind="item.cops"
                :size="item.size"
                v-model:value="item.value"
                clearable
              />
            </template>
            <template v-else-if="item.type === 'Select'">
              <n-select
                v-bind="item.cops"
                :size="item.size"
                v-model:value="item.value"
                :options="item.options"
                :loading="item._loading"
              />
            </template>
            <template v-else-if="item.type === 'Checkbox'">
              <n-checkbox-group
                v-model:value="item.value"
                :size="item.size"
                v-bind="item.cops"
              >
                <n-space item-style="display: flex;">
                  <n-checkbox
                    v-for="ic in item.options"
                    :key="ic.value"
                    :value="ic.value"
                    :label="ic.label"
                  />
                </n-space>
              </n-checkbox-group>
            </template>
            <template v-else-if="item.type === 'Radio'">
              <n-radio-group
                v-model:value="item.value"
                :size="item.size"
                v-bind="item.cops"
                name="ic"
              >
                <n-space>
                  <n-radio
                    v-for="song in item.options"
                    :key="song.value"
                    :value="song.value"
                  >
                    {{ song.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </template>
            <template v-else-if="item.type === 'Picker'">
              <n-date-picker
                v-model:value="item.value"
                :size="item.size"
                v-bind="item.cops"
              />
            </template>
            <template v-else-if="item.type === 'Time'">
              <n-time-picker
                v-model:value="item.value"
                :size="item.size"
                v-bind="item.cops"
              />
            </template>
            <template v-else-if="item.type === 'Switch'">
              <n-switch
                v-model:value="item.value"
                :size="item.size"
                v-bind="item.cops"
              />
            </template>
            <template v-else-if="item.type === 'TreeSelect'">
              <n-tree-select
                :options="item.options"
                v-model:value="item.value"
                :size="item.size"
                v-bind="item.cops"
              />
            </template>
            <template v-else-if="item.type === 'Transfer'">
              <n-transfer
                v-model:value="item.value"
                :size="item.size"
                v-bind="item.cops"
                :options="item.options"
              />
            </template>
            <template v-else-if="item.type === 'Null'"> </template>
            <template v-if="item.required">
              <span class="text-red-600 ml-2">*</span>
            </template>
          </n-form-item-gi>
        </template>
      </n-grid>
    </template>
  </n-form>
</template>

<style lang="scss" scoped></style>
