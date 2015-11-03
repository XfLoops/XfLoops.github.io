---
layout: post-a
title: 链接文字下划线动画
type: article
tags: css
excerpt: 鼠标悬停时文字下方出现下划线,并伴有滑入的动画效果.
---
# 链接文字下划线动画

## Demo和源代码
在线demo:[underline animation](http://xfloops.com/demo/underline-animation/)
源代码：[underline animation](https://github.com/XfLoops/demo/tree/master/underline-animation/)

当鼠标悬停在链接文字上时，文字下方出现下划线，并且带有**从左边滑入**、**从中间滑入**、**从右边滑入**的动画效果。通过给`<a>`添加`::before`或者`::after`伪元素来实现。本文以`::before`来说明。

## `::before`介绍
`::before`是CSS3引入的表示**伪元素**的语法，用于淘汰CSS2中的`:before`语法，以便和**伪类**的语法（如:hover,:first-child等）区别开来。它会创建一个作为当前元素第一个子元素的伪元素。通过`content`属性来为一个元素添加修饰性的内容，此元素默认为行内元素。`::after`跟`::before`同理，区别在于后者会创建一个作为当前元素最后一个子元素的伪元素。具体用法如下：

``` html
<p> world</p>
```

``` css
p::before {
    content:"hello";
    ...
}
```
页面最后输出的效果：`hello world`

## 下划线用伪元素来实现
明白了`::before`的用法了吧，好的。我们希望鼠标悬停在链接文字时出现下划线，并且伴有动画。有个方法是直接在hover时用`text-decoration:underline`，但是下划线会没有动画，不是我们想要的。我们可以通过给`<a>`添加一个伪元素，让伪元素来作下划线。伪元素默认是行内元素，我们要对其位置进行控制，因此需要对`<a>`设置`position:relative`，对伪元素设置`position:absolute`，滑入的动画可以通过渐变伪元素的宽度来实现。初始宽度为`0`,hover时宽度为`100%`. 

## 从左边滑入
从左边滑入关键代码如下：

``` css
a::before {
    content:"";
    height: 2px; /* 下划线的宽度 */
    position: absolute;
    width: 0;
    left: 0;
    bottom:0;
    transition:all 0.5s;
    background-color:#FF5722; /* 下划线的颜色 */
}
a:hover::before {
    width: 100%;
}
```

## 从中间滑入

从中间滑入关键代码如下：

``` css
a::before {
    ...
    width: 0;
    left: 50%;
    ...
}
a:hover::before {
    width: 100%;
    left:0;
}
```

## 从右边滑入

从右边滑入关键代码如下：

``` css
a::before {
    ...
    width: 0;
    left: 100%;
    ...
}
a:hover::before {
    width: 100%;
    left:0;
}
```
## 更新日志
- 发布于 2015.11.02
- 2015.11.02 发现在chrome里下划线动画不能正常显示



