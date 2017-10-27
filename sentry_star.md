# sentry 错误处理相关
对于 nodejs 的错误记录，由于其 callback 机制的特性，使得对一些错误的追踪不是那么的精确。
针对这种情况可以考虑使用 sentry 的 [breadcrumbs 特性](https://blog.sentry.io/2017/01/19/node-breadcrumbs)

## 目前需要解决方案的错误
### 