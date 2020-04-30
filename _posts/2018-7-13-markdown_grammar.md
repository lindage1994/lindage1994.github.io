---
layout: post
title: "markdown"
date: 2019-09-03
description: "Markdown基本语法"
tag: [markdown,tools]
comments: true
---

## 一、标题
作为标题的前面加#号来表示
#是一级标题，##是二级标题，以此类推。支持六级标题。

## 二、字体
>斜体

用*包起来

`*这是倾斜的文字*`  *这是倾斜的文字*
> 加粗

用**包起来

`**这是加粗的文字**`   **这是加粗的文字**
> 斜体加粗

用***包起来

`***这是倾斜加粗的文字***`   ***这是倾斜加粗的文字***
> 删除线

用~~包起来

`~~这是加删除线的文字~~`   ~~这是加删除线的文字~~

## 三、引用
在引用的文字前加>即可。引用也可以嵌套，如加两个>>三个>>>
n个...
```
>这是引用的内容
>>这是引用的内容
```
>这是引用的内容
>>这是引用的内容

## 四、分割线
三个或者三个以上的 - 或者 * 都可以
```
---
----
***
*****
```
显示效果是一样的。

---
----
***
****

## 五、图片
语法
```
![图片alt](图片地址 ''图片title'')

图片alt就是显示在图片下面的文字，相当于对图片内容的解释。
图片title是图片的标题，当鼠标移到图片上时显示的内容。title可加可不加
```
示例：
```
![design_patten](https://github.com/lindage1994/images/raw/master/blog/2019/design_pattern_1.png "design_patten")
```
![design_patten](https://github.com/lindage1994/images/raw1/master/blog/2019/design_pattern_1.png "design_patten")

## 六、超链接
语法
```
[超链接名](超链接地址 "超链接title")
title可加可不加
```
示例
```
[google](https://google.com "title")
[baidu](https://www.baidu.com "baidu title")
```
效果   
[google](https://google.com "title")   
[baidu](https://www.baidu.com "baidu title")

图片链接
```
<!--图片超链接：在前面加一个感叹号即可-->
![示例图片](http://icoco.qiniudn.com/image/hexo09090115252c6bc118f5d9c215.gif "这个是Tooltips")
```
索引链接
```
<!--索引超链接：如果网址中有括号可以这么用,1,2只要对应就好，可以使用任意字符-->
[mcl' space][*]
![Example][2]
[*]:www.mclspace.com
[2]:http://icoco.qiniudn.com/image/hexo/m1.jpg
```
自动链接
```
<!--自动链接:加尖括号即可,实验结果表明 网址的话得在前面加http://,否则无法显示-->
<www.mclspace.com>
<rdmclin2@gmail.com>
```


## 七、列表
无序列表 语法   
无序列表用 - + * 任何一种都可以
```
- 列表内容
+ 列表内容
* 列表内容

注意：- + * 跟内容之间都要有一个空格
```
有序列表 语法   
数字加点
```
1.列表内容
2.列表内容
3.列表内容

注意：序号跟内容之间要有空格
```
列表嵌套   
上一级和下一级之间敲三个空格   
* 一级无序列表   
   * 二级无序列表
   * 二级无序列表
* 一级无序列表
   1. 二级有序列表
   2. 二级有序列表
      * 三级无序列表
1. 一级有序列表
2. 一级有序列表

## 八、表格
语法
```
表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容

第二行分割表头和内容。
- 有一个就行，为了对齐，多加了几个
文字默认居左
-两边加：表示文字居中
-右边加：表示文字居右
注：原生的语法两边都要用 | 包起来。此处省略
```
示例
```
姓名|技能|排行
--|:--:|--:
刘备|哭|大哥
关羽|打|二哥
张飞|骂|三弟
```
效果

姓名|技能|排行
--|:--:|--:
刘备|哭|大哥
关羽|打|二哥
张飞|骂|三弟

## 九、代码
语法 单行代码用一个反引号包起来
```
`代码内容`
```
代码块用三个反引号包起来，且两边的反引号独占一行
```
<!--在第一行后指定编程语言，也可以不指定,用三个反引号-->
\`\`\`java
  String helloworld = "Hello world!";
  System.out.println(helloworld);
\`\`\`
```
```java
    String helloworld = "Hello world!";
    System.out.println(helloworld);
```

## 十、流程图
```
```flow
st=>start: 开始
op=>operation: My Operation
cond=>condition: Yes or No?
e=>end
st->op->cond
cond(yes)->e
cond(no)->op
&```
```

## 十一、页内跳转
先定义一个锚(id)

`<span id="jump">Hello World</span>`   

然后使用markdown的语法   

`[XXXX](#jump)`







------
引用原文地址   
[1]:https://www.jianshu.com/p/191d1e21f7ed
[2]:http://mclspace.com/2014/10/28/markdown-intro/
