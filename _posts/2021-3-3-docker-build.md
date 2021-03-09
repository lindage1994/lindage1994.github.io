---
layout: post
title: "docker 搭建基础开发环境"
date: 2021-02-17
excerpt: "docker搭建常用的开发环境 MySQL Redis "
description: "docker"
tag: [docker]
comments: true

---

### 安装docker

- windows 直接下载安装包就可以了，注意 **需要开启hyper-v** 和 **cpu 支持虚拟化（BIOS 中开启）**

### MySQL

- 拉取 MySQL 镜像

​      ` docker pull mysql:latest `

- 运行 MySQL 镜像

​      `docker run -itd --restart always --name local-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:latest`

### redis

- 拉取 redis 镜像

​      `docker pull redis:latest`

- 运行 redis 镜像

​      `docker run -itd --restart always --name local-redis -p 6379:6379 redis`

- 进入命令行

​      `docker exec -it redis-test /bin/bash`

### nacos

- 拉取 nacos 镜像

​      `$ docker pull nacos/nacos-server`

- standalone 模式运行

​      `$ docker run -d -p 8848:8848 -e MODE=standalone --restart always --name nacos nacos/nacos-server`

### sentinel

- 拉取 sentinel 镜像 (bladex 提供的镜像)

​      `docker pull bladex/sentinel-dashboard:tagname`

   - 运行

     `docker run --name sentinel  -d -p 8858:8858 -d  bladex/sentinel-dashboard:tagname`

     