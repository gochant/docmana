# docmana

docmana 是一个 js 库，用于创建可扩展的web端的文件管理器

## 为什么使用它？

* UI 简单直接，布局仿 Windows File Explorer，支持快捷键
* 样式基于 Bootstrap，也可重写所有模板基于其他样式库
* 模块化，预留扩展点，定制或扩展方便
* 与后端主要交互接口兼容 elFinder，服务器端可重用现有的 elFinder Connector（需稍作更改）

## 当前版本特性

* 文件（夹）的基本管理（上传、重命名、删除、下载文件、新建文件夹）
* 文件浏览（列表、大图标视图）
* 文件预览（预览类型取决去服务器端具体实现）
* 文件夹内搜索（根据文件名查找）

## 依赖

* [jQuery](https://github.com/jquery/jquery)（>= 1.11.x）
* [Bootstrap](https://github.com/twbs/bootstrap)（= 3.x）
* [Lodash](https://github.com/lodash/lodash) （>= 4.x）
* [Backbone](https://github.com/jashkenas/backbone)（或 veronica）

* FontAwesome 


## 开始使用

### 1. 引入 JS/CSS

```html
<!-- css -->
<link href="assets/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
<link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
<link href="../dist/css/docmana.css" rel="stylesheet" />

<!-- js -->
<script src="assets/jquery.min.js"></script>
<script src="assets/lodash.min.js"></script>
<script src="assets/bootstrap.min.js"></script>
<script src="assets/backbone.min.js"></script>
<script src="../dist/js/docmana.js"></script>
```

### 2. 放置目标元素

默认配置下，docmana 主界面采用绝对定位布局以撑满整个父级元素，因此父级元素应该设置一个高度

```html
<div id="docmana"></div>
```

### 3. 调用

```js
$(function () {
    $('#docmana').docmana({
        store: {
            requestData: {
                folder: 'Medias'
            },
            url: '/FileManager/Medias'
        }
    });
});
```

## API

### 获取选中文件

```js
var instance = $('#docmana').data('docmana');
instance.workzone().on('selected', function (selected) {
    var data = instance.store().byIds(instance.workzone().getIds());
    console.log(data);
})
```

### 构建

使用 [gulp](https://github.com/gulpjs/gulp)，nodejs 环境（4.x）

```cmd
gulp

gulp scripts
gulp images
gulp less
```

## 当前版本一些问题和说明

### 浏览器兼容性

在 Chrome 50 和 IE11 下进行了测试

### 说明

* **bug** 重命名后选择的文件可能会发生不一致
* **bug** List 模式下，可能一些 theme 下表头和内容区布局会发生几个像素的瑕疵
* **体验** 未建立缓冲区进行懒加载，大量文件可能会造成界面卡顿
* **体验** 长时操作未没有等待状态
* **体验** List 模式下的拖拽行为与 Windows File Explorer 下有一些不一致，空白区域不可拖拽
* **体验** Shift 选择模式与 Windows File Explorer 有一些不一致
* **体验** 剪切时的文件透明度变化与 Windows 下有一些不一致
* 新建文件夹，由于冲突，并未采用 Windows 快捷键：Ctrl+Alt+N，而是 Alt+N
* 在不同文件夹间拷贝时，并未判断文件的重复
* 不支持右键菜单

### 后续开发计划

* 增强的图片预览组件
* 分组显示
* 上传类型控制
* 访问控制


