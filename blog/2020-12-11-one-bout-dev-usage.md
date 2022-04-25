---
slug: one-bout-dev-usage
title: 使用集群上安装的BOUT++库
author: one
author_title: PhD student at USTB
author_url: https://github.com/alephpiece
author_image_url: https://github.com/alephpiece.png
tags: [tutorial, bout++, spack]
---

本文演示了如何使用实验室集群上安装的BOUT++。

使用已安装的某版本BOUT++库：

```bash
$ spack load bout-dev ~openmp+scorep
```

使用BOUT++的依赖，但不包括BOUT++库本身：

```bash
$ spack load --only dependencies ~openmp+scorep
```

查看当前BOUT++的配置：
```bash
$ bout-config --all
```

<!--truncate-->

## 链接集群上已安装的BOUT++库

BOUT++通常需要开发者在源代码目录下编译，也就是*in-source build*。完成build后有以下几个比较重要的文件：

- `lib/libbout++.a`：BOUT++的静态库，默认是没有共享库的；
- `bin/bout-config`：打印BOUT++配置信息的脚本，比如库的路径、编译器路径等；
- `make.config`：编译BOUT++算例用的makefile，包含头文件和库路径、编译flags等。

随后我们可以进到算例的目录下，直接调`make`来编译算例得到可执行文件，例如

```bash
$ cd examples/conduction
$ make
```

算例目录下的makefile会将BOUT++的根目录`BOUT_TOP`设置为当前源代码的根目录，然后调`make.config`完成后续工作。

`make.config`中的关键变量是在用户配置BOUT++的过程中设置的，和实验室集群上安装的BOUT++不一样。因此，要链接集群上安装的BOUT++库，我们就不能直接用算例目录下现有的makefile，需要按照BOUT++官网的说明修改makefile。

以`examples/conduction/makefile`为例链接实验室集群上安装的BOUT++库：

```bash
## 加载Spack环境
$ source /apps/spack/share/spack/setup-env.sh

## 加载BOUT++，如果有多个BOUT++包，请按照集群文档中Spack使用说明来筛选
## 最终提交脚本到集群运行算例时，也要用这一句来加载环境
$ spack load bout-dev +openmp+scorep

## 目前，在集群上安装的BOUT++至少有OpenMP和非OpenMP两个版本
## spack load bout-dev ~openmp+scorep

## 进入自己下载的BOUT++算例目录
$ cd BOUT-dev/examples/conduction

## 修改makefile，新makefile的例子在examples/make-script中
$ sed -e 's/test.cxx/conduction.cxx/g' ../make-script/makefile > makefile

## 创建可执行文件
$ make clean && make
```

执行上述命令后，我们就得到了算例的可执行文件`conduction`。

若要使用BOUT++源代码目录下的Python包，有两种选择：用自己下载的，或用集群上已安装的。自己下载的可参考文后的链接。下面演示如何使用集群上已有的。

```bash
## 加载集群的BOUT++包
$ spack load bout-dev +openmp+scorep

## 使用bout-config获取Python包路径并添加到环境变量中
$ export PYTHONPATH=$(bout-config --python):$PYTHONPATH
```

执行上述命令后，便可在使用Python时导入BOUT++的Python包。

## 使用集群上安装的依赖项编译BOUT++

当我们想重新编译BOUT++时，可以使用集群上安装的BOUT++依赖项，通常不需要自己再次安装。涉及Spack的操作可参考集群文档中Spack的说明。

```bash
## 加载BOUT++的依赖项，但不加载BOUT++本身
$ spack load --only dependencies bout-dev ~openmp+scorep

## 进入自己下载的BOUT++目录
$ cd BOUT-dev

## 按照自己的需要完成build
$ ./configure --with-petsc --with-sundials && make -j16
```

## 参考资料

- [BOUT++ - Getting started](https://bout-dev.readthedocs.io/en/latest/user_docs/installing.html)
- [BOUT++ - Python configuration](https://bout-dev.readthedocs.io/en/latest/user_docs/installing.html#python-configuration)
- [BOUT++ - Installing BOUT++(experimental)](https://bout-dev.readthedocs.io/en/latest/user_docs/installing.html#installing-bout-experimental)