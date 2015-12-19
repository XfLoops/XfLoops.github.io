---
title: hover shine effect
tags: css
type: article
layout: list
excerpt: 当悬停在图片或者按钮上时出现闪烁一下的效果
---

## Demo和源代码
[在线demo](http://127.0.0.1:4000/demo/hover-effect/)

## 用到的HTML5标签与CSS3属性

- **figure**

- **linear-gradient**

- **transform**

- **animation**

- **keyframes**

## 实现shine效果的代码

``` css

/* Shine */
.hover14 figure {
    position: relative;
}
.hover14 figure::before {
    position: absolute;
    top: 0;
    left: -75%;
    z-index: 2;
    display: block;
    content: '';
    width: 50%;
    height: 100%;
    background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
    -webkit-transform: skewX(-25deg);
    transform: skewX(-25deg);
}
.hover14 figure:hover::before {
    -webkit-animation: shine .75s;
    animation: shine .75s;
}
@-webkit-keyframes shine {
    100% {
        left: 125%;
    }
}
@keyframes shine {
    100% {
        left: 125%;
    }
}

```
