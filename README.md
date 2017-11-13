# bbpages
基于 `github` 存储的文档型网站工具，相比于其他文档工具 `bbpages` 的使用比较简单。但需要给 
`rawgit.com` 添加翻墙规则（如果无法访问 [rawgit](https://rawgit)，则可以放弃使用该框架了）。
所以这里目前还是 `Bubufly Studio` 自用吧。

## 使用指南
### 基础使用
在 `github` 中创建相应的工程作为文档的存储地，这里以 `wujohns` 的 
[graphql-learn](https://github.com/wujohns/graphql-learn) 笔记工程为例。该工程的目录结构如下：

```
graphql-learn
    +-docs          // 笔记文档目录
        +-1.graphql基础查询.md
        +-2.graphql关联查询.md
        +-3.graphql修改数据.md
        +-base1.png
        +-base2.png
        +-base3.png
    +-scripts       // 案例代码目录，这里不做展开说明
    +-bbpages.json  // 文档结构配置文件，之后会被 bbpages 读取作为目录配置
    +-package.json.js
    +-readme.md     // readme 文档
```

虽然可以将该项目的地址直接分享给其他人查看，但在 `github` 上的“观感体验”不是特别好，这里可以编
写以下 html 将该笔记工程更好的分享出去：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>BBPages</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/BubuflyStudio/bbpages/master/release/bbpages.min.css">
</head>
<body>
    <script type="text/javascript" src="https://cdn.rawgit.com/BubuflyStudio/bbpages/master/release/bbpages.min.js"></script>
    <script type="text/javascript">
        BBPages({
            username: 'wujohns',
            project: 'graphql-learn',
            branch: 'master',
            footer: 'Powered By Bubufly Studio',
            list: [
                { title: '简介', 'path': 'readme.md' },
                {
                    title: '基础改动',
                    list: [
                        { title: 'graphql base1', path: 'docs/1.graphql基础查询.md' },
                        { title: 'graphql base2', path: 'docs/2.graphql关联查询.md' },
                        { title: 'graphql base3', path: 'docs/3.graphql修改数据.md' }
                    ]
                }
            ]
        });
    </script>
</body>
</html>
```

如其所示，只需要引入：  
css 文件：`https://cdn.rawgit.com/BubuflyStudio/bbpages/master/release/bbpages.min.css`  
js 文件：`https://cdn.rawgit.com/BubuflyStudio/bbpages/master/release/bbpages.min.js`  
然后在 `html` 页面中做初始化配置即可，该 `html` 文件可以直接在本地打开或是部署到静态服务上（随你喜欢）。

预期效果如下，参考地址（[graphql-learn](http://2bflydocs.duapp.com/graphql)）：  
![images/ex1.png](/images/ex1.png)

### 进阶使用
如果笔记中需要新增相应的文档或进行目录改动，那么就得去修改已经部署好的 `html`，这样的话会比较麻烦，所以
可以考虑使用 `configLink` 参数，将目录的配置放在笔记项目中：  

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>BBPages</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/BubuflyStudio/bbpages/master/release/bbpages.min.css">
</head>
<body>
    <script type="text/javascript" src="https://cdn.rawgit.com/BubuflyStudio/bbpages/master/release/bbpages.min.js"></script>
    <script type="text/javascript">
        BBPages({
            username: 'wujohns',
            project: 'graphql-learn',
            branch: 'master',
            configLink: 'bbpages.json'
        });
    </script>
</body>
</html>
```

这里的配置将会使 `BBPages` 读取 `graphql-learn` 工程中的 `bbpages.json` 文件作为目录配置，`bbpages.json` 要
求为严格的 `json` 格式，具体可以参考 `graphql-learn` 工程中的 `bbpages.json` 文件。

## 参数说明
BBPages 的初始化参数如下（仅支持二级目录）：
```js
BBPages({
    username: 'wujohns',        // 相应github项目所有者的用户名
    project: 'graphql-learn',   // 相应github项目的名称
    branch: 'master',           // 相应笔记所在的分支（默认为master）
    logo: '<div>Logo</div>',    // logo 区域的显示，默认为样式调整好的项目名称
    footer: 'the footer',       // footer 区域的显示，默认为空
    list: [         // 目录结构配置
        {
            title: 'title1'         // 在左侧目录的名称
            path: 'path'            // 在该github中的相对路径（不用以 / 开头也行）
            rawUrl: 'http://xxx'    // markdown资源的完整路径，有该项时 path 的配置就不生效
        },
        {
            title: 'title2'         // 目录名称
            list: []                // 子目录配置
        }
    ],
    configLink: 'path'      // json配置文件在该github项目中的相对路径，如graphql-learn案例中的bbpages.json
})
```

## TODO（欢迎pr）
“回到顶部”按钮的支持  
右上角 github 连接标记支持  
对 `gitosc` 与 `coding` 的支持  
本地模式的支持