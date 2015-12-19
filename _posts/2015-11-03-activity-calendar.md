---
title: 制作activity calendar
layout: post-b
type: article
tags: javascript 
excerpt: 介绍如何制作跟github的contribution calendar类似的activity calendar.
---

## 简单的通用组件及源代码
[github-calendar](https://github.com/XfLoops/github-calendar)是仿照Github的contribution calendar制作的通用组件。缺点是一、数据放在js文件中；二、没有实现"longest streak"和"current streak"。查看源代码:[https://github.com/XfLoops/github-calendar](https://github.com/XfLoops/github-calendar)
![github-calendar](/images/sources/2015-11-03-github-calendar.png)

## 什么是contribution calendar
Github的contribution calendar 展示了过去一年你的commit的情况，每当有commit时calendar上就会用一个绿色的格子来记录，同一天commit的次数越多，绿颜色就会越深。calendar 上有一个"longest streak",是指你的最长的连续commit的天数，还有一个是"current streak"，指当前所持续commit的天数。这个两个指标看似简单却有着很强的激励作用，因为如果坚持commit了一段时间之后突然有一天没有commit，这个"current streak"就会重新计数，你之前向"longest streak"发起的挑战就又要从头开始。所以，contribution calendar有提醒你继续坚持下去的作用。你是不是也这么觉得呢？本文将介绍如何仿照Github的contribution calendar来制作用于个人博客的activity calendar。

## activity calendar
activity calendar 用于记录博主的活动情况。每当有post时就会在calendar上对应的日期用颜色小方格记录下来。同样，activity calendar也有"longest streak"和"current streak"，来提醒博主坚持下去，养成写博客的习惯。
![activity calendar](/images/sources/2015-11-03-activity-calendar.png)


## 技术实现思路
calendar记录的是过去一年的活动情况，因此时间跨度是“去年的今天”至“今天”，首先要计算好天数，然后根据天数计算周数，然后根据周数以及容器的宽高来确定单元格的大小。在数据方面，首先需要准备包含所有博文的json格式的原始数据。如果是用jeykll在github上搭建博客的话，可以通过写一个模板来获取所有博文的信息，这里会用到[Liquid语法](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)。关于如何利用原始数据来生成带有颜色小方格的calendar，可能会有更优的方法。本文将原始数据映射到涵盖过去一年所有天数的完备数组中。最后遍历这个完备数组，来依次生成相应的单元格。

## 需要注意的地方
- **天数的计算**

由于calendar还带有“星期”的信息，因此“去年的今天”可能不都是出现在第一个格子位置，因此要考虑距离最近的“星期日”相隔多少天。

- **月份标签位置的确定**

月份标签的位置需要根据calendar的日期而动态改变，因此计算当前有多少个“周日”在相同的月份，然后用所得的数量及单元格的宽度来确定月份标签的宽度。

- **提示的生成**

当鼠标悬停在单元格上会出现提示，有的提示内容简单，有的提示内容丰富。可以给不同类型的post加一个type标签，通过判断type的类型来生成不同的提示。

- **longest streak的计算**

遍历一次完备数组data，用一个新的数组arr来存储所有出现连续的情况（单独的一个也算）。关键代码如下：

``` js
for(var i = sparedays; i < len; i++){
            if(data[i].value){
                var index = i,
                    count = 0;
                while((index < len) && data[index].value){
                    ++count;
                    ++index;
                }
                arr.push({
                    "count":count,
                    "start":data[i].date,
                    "end":data[index - 1].date
                });
                i = index;
            }
        }

```

## 更新日志
- 发布于2015-11-03
- 2015-11-03 activity calendar 在Firefox，Safari浏览器中不显示




