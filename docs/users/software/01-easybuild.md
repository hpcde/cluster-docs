---
id: easybuild
title: 使用集群上的软件 - EasyBuild
---

## 安装 EasyBuild

最简单的安装方式是使用EasyBuild提供的bootstrapping脚本。

```bash
## 设置安装路径
EASYBUILD_PREFIX=$HOME/.local/easybuild

## 下载安装脚本
$ wget https://raw.githubusercontent.com/easybuilders/easybuild-framework/develop/easybuild/scripts/bootstrap_eb.py

## 安装EasyBuild、Easyblocks和预定义的Easyconfigs
$ python bootstrap_eb.py $EASYBUILD_PREFIX

## 安装完成后会生成EasyBuild的模块文件，加载即可
$ module use $EASYBUILD_PREFIX/modules/all
$ module load EasyBuild
```

更多关于 EasyBuild 的安装信息，请参考 EasyBuild 官方文档：
- [Bootstrapping procedure](https://easybuild.readthedocs.io/en/latest/Installation.html#bootstrapping-procedure)

## 基本工作流

参考：

- [Getting started](https://easybuild.readthedocs.io/en/latest/index.html#getting-started)
- [Using the EasyBuild command line](https://easybuild.readthedocs.io/en/latest/Using_the_EasyBuild_command_line.html)

使用EasyBuild安装软件的工作流如下：

- 搜索软件包；
- 确定工具链；
- 确定软件包版本、查看具体的依赖项；
- 安装软件包。

如果要安装的软件版本搜索不到，可以修改Easyconfig文本文件或使用命令行参数调整；如果要安装的软件名称不存在，需要增加Easyblock。

```bash
## 搜索特定名称的软件包（不区分大小写）
$ eb --search openmpi

## 在安装之前可以查看所有可用的工具链
## eb --list-toolchains

## 仅打印依赖项或安装过程，不实际安装
$ eb --dry-run OpenMPI-4.0.5-GCC-9.3.0.eb

## 安装软件包，同时生成modulefile
## 可使用Easyconfig作为输入
$ eb OpenMPI-4.0.5-GCC-9.3.0.eb --robot

## 或用参数指定软件名称、版本
## eb --software=OpenMPI,4.0.5 --toolchain=GCC,9.3.0

## 工具链、软件版本需要完全匹配，若Easyconfig文件不存在，调整参数
$ eb --software=OpenMPI,4.0.5 --try-toolchain=GCC,8.3.0

## 加载安装好的软件包，注意Lmod的模块层次
$ module load GCC/9.3.0 OpenMPI/4.0.5
```

:::note 软件包版本的匹配
各软件、工具链的版本需要完全匹配，如果某个版本没有对应的Easyconfig文件，解析会失败。例如，如果不存在`GCC-10.2.0.eb`，下述命令就无法成功执行：

`eb --software=OpenMPI,4.0.5 --try-toolchain=GCC,10.2.0`

用户可以手写相应的Easyconfig，然后使用参数`-r`把自定义Easyconfig的目录传给`eb`。要注意的是，自定义Easyconfig中写的所有依赖项（事实上是整个依赖图中的每一项）都必须有对应的Easyconfig。
:::

## EasyBuild和Spack的对比

EasyBuild和Spack在设计上的一个区别是把软件包的具体配置放在了纯文本中。Spack的一个配置文件（.py）相当于EasyBuild的一个Easyblock（.py）加上所有与它相关的Easyconfig（.eb，纯文本）。

对于Spack来说，用户总是通过命令行参数来控制软件包的版本、依赖等信息，该过程称为*concretize*；对于EasyBuild来说，用命令行参数控制版本、依赖是试验性功能（v4），不太稳定。

|  |  EasyBuild | Spack |
| -- | -- | -- |
| **软件包的安装和删除** | 一键安装，删除时需要找到所有路径、Lmod模块文件逐个删除；| 一键安装，一键删除。|
|**软件包的分类**  | 软件包按工具链组织，每个包都基于某个工具链编译，比如GCC就是一个工具链；| Spack：软件包按编译器组织，每个包都基于某个编译器。|
| **软件包的定义** | 由一个Easyblock和一个Easyconfig定义。自定义较为麻烦，很可能两个文件都要写，预定义的安装选项可由`eb -a`查看；| 由一个package.py定义。|
| **依赖项的解析/具体化** | 由Easyblock解析Easyconfig后生成软件包依赖项的具体版本信息，可以用命令`eb --dry-run <package>`看到；| 分为*add*和*concretize*两个阶段，由软件包的配置文件定义，依赖图可以用命令`spack spec -d <package>`看到。|
| **软件包加载速度** | 自身只有安装功能，加载功能由Lmod实现，速度很快；| 自身的加载功能速度很慢，但可以为Lmod生成modulefiles。 |
| **对Environment Module的支持** | 与Lmod整合地很好，有许多相关选项可以调整modulefile的生成；| 目前仅能简单地生成、删除、查询modulefiles。|

