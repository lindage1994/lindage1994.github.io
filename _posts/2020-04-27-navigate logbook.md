---
layout: post
title: "航海日志"
date: 2020-04-04
excerpt: "记录工作和生活"
description: "记录工作和生活"
tag: [log]
comments: true
---

#### 问题
http请求参数错误导致异常
#### 原因
后台接收一个base64加密的参数，由于参数中有特殊字符没有进行urlencode，导致后端接受的参数错误
#### 解决
对参数进行urlencode或者将参数放到body里面传输

#### 问题
mybatis中使用concat查询结果是乱码
#### 原因
concat拼接的类型不一样，一个是数字类型，一个字符类型，就会出现乱码
#### 解决
通过convert或者cast将其他类型转化成字符类型
