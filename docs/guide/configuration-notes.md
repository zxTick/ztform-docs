# 配置说明

## form props

`formConfig`：此配置项可以传递 naive form 组件的的默认 props 具体参数参阅 [form props](https://www.naiveui.com/zh-CN/os-theme/components/form#API)

`preset`：可以选择 form-item (行排列)， grid-item(块排列)

`options`：生成表单的配置类型为 FormPlusItem

`clos`：当选择 grid-item(块排列)时，响应式规则。 对此可参照 [clos](https://www.naiveui.com/zh-CN/os-theme/components/grid)

## FormPlusItem

``` ts
export interface FormPlusItem {
  ruleType?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'enum'
    | 'date'
    | 'url'
    | 'hex'
    | 'email'
    | 'pattern'
    | 'any'
  label: string
  key: string
  type: string
  size?: 'small' | 'medium' | 'large' | undefined
  cops?: object
  path?: string
  message?: string
  trigger?: string
  required?: boolean
  naive?: boolean
  proxyKey?: string | string[]
  watchKey?: string[] | string
  defaultValue?: any
  axiosOptions?: () => Promise<any[]>
  reconfiguration?: (value: any) => { key: string; value: any }[]
  update?: (row: any) => any
  reset?: (formItem: FormPlusData) => any
  naiveValidator?: (rule: FormItemRule, value: any) => boolean | Error
  validator?: (value: FormPlusData, message: MessageApi) => boolean
  watchCallBack?: (
    params: FormPlusData[],
    value: string[],
    self: FormPlusData
  ) => Promise<any[]>
}
```

`ruleType`：表单校验时，校验参数的类型

`label`：formItem 的 label

`key`：生成参数时对应的key

`type`：使用组件的名称

`size`：使用组件的大小

`cops`：naive 输入控件自带的 props 皆可输入到此

`path`：寻找验证规则的路径

`message`：校验错误时提示的文本信息

`trigger`：触发验证的方式

`required`: 启动校验模式一的配置项，设置为 true 后则开始自实现的验证放方式

`naive`：启动校验模式二的配置项，设置为true后开启 naive 表单自带的验证方式

`proxyKey`：代理的 key ，用于接受非自身参数

`watchKey`：需要监听的 key 此 key 对应了所要监听的输入控件

`watchCallBack`：启动监听后，监听的控件发生改变时回调用函数

`defaultValue`：默认值

`axiosOptions`：列表控件获取配置项的方法

`reconfiguration`：重构自身参数获取的方法。

`update`：重构自身修改方法

`reset`：重构自身重制方法

`naiveValidator`: 重构自身校验方式二 naive 提供的表单验证方法

`validator`：重构自身校验方式一提供的校验方法
