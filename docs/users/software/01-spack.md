---
id: spack
title: 使用集群上的软件 - Spack
---

Spack是一个为超算平台设计的包管理工具，用法上类似于Lmod、Anaconda。目前，Spack 0.16.0支持Linux和macOS两种系统，可以安装C/C++、Fortran、Python、R等语言的软件包。

总的来说，它和EasyBuild & Lmod的方案能相互替代，但它对依赖的管理能力要更强大。关键的功能如下：

- 安装：安装软件、软件栈，处理软件的依赖关系（处理依赖使用DAG，算法不止一种）；
- 删除：删除软件及其依赖；
- 查询：软件信息，包括版本、依赖项等（比EasyBuild强大）；
- 加载：动态加载、卸载、更换软件（相当于module load/unload/swap）；
- 多用户：设计了有优先级的配置文件，用户级配置可以覆盖系统配置文件；
- 兼容性：可以导出lmod或tcl格式的modulefiles；
- 易于迁移：可以方便的添加软件的repos、mirrors，也可以自定义新的软件，支持docker。

## 快速入门

```console
## 克隆Spack仓库
$ git clone https://github.com/spack/spack ~/spack

## 配置Spack环境
$ . ~/spack/share/spack/setup-env.sh

## 查找并添加系统已有的编译器
$ spack compiler find

## 搜索现有的软件包配置文件
$ spack list fmt

## 查看可用的软件版本、编译选项等
$ spack info fmt

## 查看软件包的完整spec，包括它的所有依赖，-I用于标记已安装的软件包
$ spack spec -I fmt

## 安装特定版本的软件
## @6.0.0               软件版本
## +pic cxxstd=17       软件编译选项
## %gcc@10.2.0          编译器spec
## ^cmake@3.18%gcc@4    依赖项spec，它使用gcc 4
$ spack install fmt@6.0.0 +pic cxxstd=17 %gcc@10.2.0 ^cmake@3.18%gcc@4

## 查看已安装软件的列表
$ spack find

## 加载软件
$ spack load fmt

## 查看已加载软件的列表
$ spack find --loaded

## 卸载软件，即去除相关环境变量
$ spack unload fmt

## 删除软件包
$ spack uninstall fmt
```

Spack的教程非常丰富，可以参考[Tutorial: Spack 101](https://spack-tutorial.readthedocs.io/en/latest/)。

## 使用集群上的Spack

实验室集群安装了一个共享的Spack，它其中的软件包由管理员维护。若要使用Spack自己安装新的软件，需要在自己的目录下克隆Spack仓库才能操作。若要将自己的Spack与集群上的共享Spack混用，可以考虑[Chaining Spack Installations](https://spack.readthedocs.io/en/latest/chain.html)。

共享Spack位于`/apps/spack`，使用它之前需要配置相关环境。

```console
$ source /apps/spack/share/spack/setup-env.sh
```

配置好之后，可以查看并使用已经安装的软件包。

```console
$ spack find
```
