---
layout: post
title: "航海日志"
date: 2020-05-21
excerpt: "group_concat 字符串过长被截取"
description: "记录工作和生活遇到的事"
tag: [log]
comments: true
---

#### 起因

小伙伴随便写了一个统计多层级结构的数据的sql，大哥说数据不对

，sql拿过来层层分析，发现查出来的数据经过group_concat之后数据被截取了，面向google编程一搜，果然

```mysql
SELECT
	nickname,
	merchant_id AS level_id,
	(
	SELECT
		GROUP_CONCAT( m1.merchant_id ) 
	FROM
		merchant_account AS m1 
	WHERE
		m1.path LIKE CONCAT( m_user.merchant_id, '/%' ) 
		AND m1.merchant_type = 1 
	) AS dlsh 
FROM
	merchant_account AS m_user 
WHERE
	merchant_type = 0
```

#### 问题原因

group_concat_max_len这个参数默认1024,超过这个长度就会被截取

#### 问题解决

- MySQL配置文件设置：

  group_concat_max_len = 18446744073709551615;

- 执行SQL语句

  SET GLOBAL group_concat_max_len = 18446744073709551615;

  // 设置全局

  SET SESSION group_concat_max_len = 18446744073709551615;

  // 设置当前会话

  

#### 问题又来了
连接池的连接参数不支持多查询，不能同时执行多条语句

#### 解决
连接参数加上&allowMultiQueries=true
  

  