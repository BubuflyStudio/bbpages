# bbpages
基于git存储的文档型网站工具

经过研究后发现已经有更为强大且方便的[docsify](https://github.com/QingWei-Li/docsify)，所以该工程只作为 ts 实战的一个案例。

## 使用指南

TODO markdown 的自定义解析

## json 设计
```js
const config = {
    type: 'github',
    username: 'wujohns',
    project：'learn-ts',
    branch: 'master',
    list: [
        {
            title: '基础实验',
            path: 'docs/base1.md',
            rawUrl: '', // 可以覆盖默认选项配置
        },
        {
            title: '一个系列',  // 打开后不修改页面
            list: [
                ...
            ]
        }
    ],
};
```

[test](/www.hahha.com)