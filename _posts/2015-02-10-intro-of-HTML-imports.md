---
title: HTML imports 入门
layout: post-b
type: article
tags: HTML5
excerpt: HTML导入让你以一个合并的HTML文件来加载这些资源。
---


Template、Shadow DOM及Custom Elements 让你创建UI组件比以前更容易了。但是像HTML、CSS、JavaScript这样的资源仍然需要一个个地去加载，这是很没效率的。

删除重复依赖也并不简单。例如，现在加载jQuery UI或Bootstrap就需要为JavaScript、CSS及Web Fonts添加单独的标签。如果你的Web 组件应用了多重的依赖，那事情就变得更为复杂。

HTML 导入让你以一个合并的HTML文件来加载这些资源。

## 使用HTML导入

为加载一个HTML文件，你需要增加一个link标签，其rel属性为import，herf属性是HTML文件的路径。例如，如果你想把`component.html`加载到`index.html`：

**index.html**

``` html
<link rel="import" href="component.html" >
```
你可以往HTML导入文件（译者注：本文将“ the imported HTML”译为“HTML导入文件”，将“the original HTML”译为“HTML主文件”。例如，index.html是HTML主文件，component.html是HTML导入文件。）添加任何的资源，包括脚本、样式表及字体，就跟往普通的HTML添加资源一样。

**component.html**

``` html
<link rel="stylesheet" href="css/style.css">
<script src="js/script.js"></script>
```
doctype、html、 head、 body这些标签是不需要的。HTML 导入会立即加载要导入的文档，解析文档中的资源，如果有脚本的话也会立即执行它们。

## 执行顺序

浏览器解析HTML文档的方式是线性的，这就是说HTML顶部的script会比底部先执行。并且，浏览器通常会等到JavaScript代码执行完毕后，才会接着解析后面的代码。

为了不让script 妨碍HTML的渲染，你可以在标签中添加`async`或`defer`属性（或者你也可以将script 标签放到页面的底部）。`defer` 属性会延迟脚本的执行，直到全部页面解析完毕。`async` 属性让浏览器异步地执行脚本，从而不会妨碍HTML的渲染。那么，HTML 导入是怎样工作的呢？

HTML导入文件中的脚本就跟含有defer属性一样。例如在下面的示例中，`index.html`会先执行`script1.js`和`script2.js` ，然后再执行`script3.js`。


**index.html**

``` html
<link rel="import" href="component.html"> // 1.
<title>Import Example</title>
<script src="script3.js"></script>        // 4.
```

**component.html**

``` html
<script src="js/script1.js"></script>     // 2.
<script src="js/script2.js"></script>     // 3.
```

1. 在`index.html` 中加载`component.html`并等待执行

2. 执行`component.html`中的`script1.js`

3. 执行完`script1.js`后执行`component.html`中的`script2.js`

4. 执行完`script2.js`继而执行`index.html`中的`script3.js`

注意，如果给`link[rel="import"]`添加`async`属性，HTML导入会把它当做含有`async`属性的脚本来对待。它不会等待HTML导入文件的执行和加载，这意味着HTML 导入不会妨碍HTML主文件的渲染。这也给提升网站性能带来了可能，除非有其他的脚本依赖于HTML导入文件的执行。

## 跨域导入

从根本上说，HTML导入是不能从其他的域名导入资源的。

比如，你不能从[http://webcomponents.org/](http://webcomponents.org/)向 [http://example.com/](http://example.com/) 导入HTML 文件。为了绕过这个限制，可以使用CORS（跨域资源共享）。想了解CORS，请看[这篇文章](http://www.html5rocks.com/tutorials/cors/)。

## HTML导入文件中的window和document对象

前面我提过在导入HTML文件的时候里面的脚本是会被执行的，但这并不意味着HTML导入文件中的标签也会被浏览器渲染。你需要写一些JavaScript代码来帮忙。

当在HTML导入文件中使用JavaScript时，有一点要提防的是，HTML导入文件中的document对象实际上指的是HTML主文件中的document对象。以前面的代码为例，`index.html`和`component.html`的document都是指`index.html`的document对象。怎么才能使用HTML导入文件中的document 呢？借助`link`中的`import`属性。

**index.html**

``` js
var link = document.querySelector('link[rel="import"]');
link.addEventListener('load', function(e) {
  var importedDoc = link.import;
  // importedDoc points to the document under component.html
});
```
为了获取`component.html`中的document 对象，要使用`document.currentScript.ownerDocument`.

**component.html**

``` js
var mainDoc = document.currentScript.ownerDocument;
// mainDoc points to the document under component.html
```
如果你在用`webcomponents.js`，那么就用`document._currentScript`来代替`document.currentScript`。下划线用于填充`currentScript`属性，因为并不是所有的浏览器都支持这个属性。

**component.html**

``` js
var mainDoc = document._currentScript.ownerDocument;
// mainDoc points to the document under component.html
```

通过在脚本开头添加下面的代码，你就可以轻松地访问component.html中的document对象，而不用管浏览器是不是支持HTML导入。

``` js
document._currentScript = document._currentScript || document.currentScript;
```

## 性能方面的考虑

使用HTML 导入的一个好处是能够将资源组织起来，但是也意味着在加载这些资源的时候，由于使用了一些额外的HTML文件而让头部变得过大。有几点是需要考虑的：

### 解析依赖

假如HTML主文件要依赖多个导入文件，而且导入文件中含有相同的库，这时会怎样呢？例如，你要从导入文件中加载jQuery，如果每个导入文件都含有加载jQuery的script标签，那么jQuery就会被加载两次，并且也会被执行两次。

**index.html**

``` html
<link rel="import" href="component1.html">
<link rel="import" href="component2.html">
```
**component1.html**

``` html
<script src="js/jquery.js"></script>
```

**component2.html**

``` html
<script src="js/jquery.js"></script>
```

HTML导入自动帮你解决了这个问题。

与加载两次script标签的做法不同，HTML 导入对已经加载过的HTML文件不再进行加载和执行。以前面的代码为例，通过将加载jQuery的script标签打包成一个HTML导入文件，这样jQuery就只被加载和执行一次了。

但这还有一个问题：我们增加了一个要加载的文件。怎么处理数目膨胀的文件呢？幸运的是，我们有一个叫vulcanize的工具来解决这个问题。

### 合并网络请求

[Vulcanize](https://github.com/polymer/vulcanize) 能将多个HTML文件合并成一个文件，从而减少了网络连接数。你可以借助npm安装它，并且用命令行来使用它。你可能也在用 grunt和gulp 托管一些任务，这样的话你可以把vulcanize作为构建过程的一部分。

为了解析依赖以及合并`index.html`中的导入文件，使用如下命令：

``` js
$ vulcanize -o vulcanized.html index.html
``` 
通过执行这个命令，`index.html`中的依赖会被解析，并且会产生一个合并的HTML文件，称作 `vulcanized.html`。学习更多有关vulcanize的知识，请看[这儿](https://www.polymer-project.org/articles/concatenating-web-components.html)。

注意：http2的服务器推送功能被考虑用于以后消除文件的连结与合并。

## 把Template、Shadow DOM、自定义元素跟HTML导入结合起来

让我们对这个文章系列的代码使用HTML导入。你之前可能没有看过这些文章，我先解释一下：Template可以让你用声明的方式定义你的自定义元素的内容。Shadow DOM可以让一个元素的style、ID、class只作用到其本身。自定义元素可以让你自定义HTML标签。通过把这些跟HTML导入结合起来，你自定义的web 组件会变得模块化，具有复用性。任何人添加一个Link标签就可以使用它。

**x-component.html**

``` html
<template id="template">
  <style>
    ...
  </style>
  <div id="container">
    <img src="http://webcomponents.org/img/logo.svg">
    <content select="h1"></content>
  </div>
</template>
<script>
  // This element will be registered to index.html
  // Because `document` here means the one in index.html
  var XComponent = document.registerElement('x-component', {
    prototype: Object.create(HTMLElement.prototype, {
      createdCallback: {
        value: function() {
          var root = this.createShadowRoot();
          var template = document.querySelector('#template');
          var clone = document.importNode(template.content, true);
          root.appendChild(clone);
        }
      }
    })
  });
</script>
```

**index.html**

``` html
...
  <link rel="import" href="x-component.html">
</head>
<body>
  <x-component>
    <h1>This is Custom Element</h1>
  </x-component>
  ...
```

注意，因为`x-component.html`中的document对象跟`index.html`的一样，你没必要再写一些棘手的代码，它会自动为你注册。

## 支持的浏览器

Chrome 和 Opera提供对HTML导入的支持，Firefox要在2014年12月后才支持（Mozilla表示Firefox不计划在近期提供对HTML导入的支持，声称需要首先了解ES6的模块是怎样实现的）。

你可以去[chromestatus.com](https://www.chromestatus.com/features/4642138092470272)或[caniuse.com](http://caniuse.com/#feat=custom-elements)查询浏览器是否支持HTML导入。想要在其他浏览器上使用HTML导入，可以用[webcomponents.js](https://github.com/Polymer/webcomponentsjs)（原名platform.js）。

## 相关资源

HTML导入就介绍这么多了。如果你想学更多关于HTML导入的知识，请前往：

- [HTML Imports: #include for the web – HTML5Rocks](http://goo.gl/EqeOBI)
- [HTML Imports spec](http://w3c.github.io/webcomponents/spec/imports/)

## 原文地址
[Introduction to HTML Imports](http://webcomponents.org/articles/introduction-to-html-imports/)


## 更新日志

- 2015.02.10发布在伯乐在线
- 2015.11.04发布在本博客












