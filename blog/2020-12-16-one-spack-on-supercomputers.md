---
id: one-spack-on-supercomputers
title: 如何在超算上配置Spack
author: one
author_title: PhD student at USTB
author_url: https://github.com/alephpiece
author_image_url: https://github.com/alephpiece.png
tags: [tutorial, spack]
---

实验室集群文档介绍了如何配置、使用 Spack。本文用具体的例子来演示如何在超算上配置 Spack，主要内容如下：

- 准备必要的数据
- 配置 Spack，修改配置文件
- 添加编译器和外部软件包
- 自定义软件包，安装软件包
- 导出模块文件

<!--truncate-->

## 超算环境说明

为了便于叙述，我们假定超算的相关参数、环境如下：

| 参数名           | 值                                                           |
| ---------------- | ------------------------------------------------------------ |
| 名称             | S                                                            |
| 域名             | s@example.cn                                                 |
| 用户名           | one                                                          |
| 架构             | x86_64                                                       |
| 操作系统         | CentOS 7                                                     |
| 模块系统         | Environment Modules                                          |
| 作业调度系统     | Slurm                                                        |
| 公共模块路径     | `/opt/modulefiles`                                           |
| 公共软件安装路径 | `/opt/software`                                              |
| 已有模块         | `compiler/gcc/10.2.0`<br />`mpi/hpcx/2.5`<br />`tools/cmake/3.19.3` |

## 拷贝必要数据

按照实验室集群文档中的说明，我们在超算 S 上建立如下几个目录并拷贝相应数据：

- `~/public/spack`：存放 Spack 仓库
- `~/public/repos/spack`：Spack repo，存放我们自定义的软件包配置文件（`package.py`）
- `~/public/sources/spack`：Spack mirror，存放所有软件包的源代码
- `~/public/software/spack`：Spack 软件安装路径，最初为空目录
- `~/.spack`：Spack 配置文件、缓存路径，最初为空目录

## 配置 Spack 的环境

数据准备完成后，创建一个脚本方便我们启用 Spack，下面以 Bash 为例。

```bash
#
# Script: setup-spack.sh
#
#!/bin/bash
export SPACK_ROOT=$HOME/public/spack
source $SPACK_ROOT/share/spack/setup-env.sh
```

随后，我们先申请一个计算节点，后续操作都在计算节点上完成。

```bash
# 申请计算节点
$ salloc -N 1 --exclusive -J spack

# 假设分配的节点名为n0001，连接到该节点上
$ ssh n0001

# 设置环境变量
$ source ./setup-spack.sh
```

## 修改配置文件中的路径

首先，我们要修改软件安装路径、mirror 路径和 repo 路径。

```bash
# 修改软件安装路径，整个配置文件包含3行
$ spack config edit config

  1 config:
  2   install_tree:
  3     root: ~/public/software/spack

# 修改 mirror 路径，整个配置文件包含2行（针对不能联网的机器）
$ spack config edit mirrors

  1 mirrors:
  2   cluster-public: file://~/public/sources/spack

# 修改 repo 路径，整个配置文件包含3行
$ spack config edit repos

  1 repos:
  2   - ~/public/repos/spack
  3   - $spack/var/spack/repos/builtin
```

## 添加编译器

超算 S 上有系统自带的编译器，位于 `/usr` 路径。其他编译器都由管理员安装在别的路径，要用 `module load` 加载。我们首先加载编译器，再让 Spack 来搜索。

```bash
# 加载超算上常用的编译器
$ module load compiler/gcc/10.2.0

# 查找编译器并添加到配置文件
$ spack -C ~/.spack compiler find

# 清空环境，防止干扰后续操作
$ module purge
```

执行完成后，应该会有至少一个编译器被添加到 `~/.spack/compilers.yaml` 文件中，我们可以去掉系统自带的低版本编译器，只保留刚刚加载的那个。

超算 S 上的编译器可能需要一些额外的环境变量、flags 之类，我们有必要检查一下原本的模块文件。

```bash
$ module show compiler/gcc/10.2.0
```

若的确存在环境变量、flags，我们要把它们添加到 `~/.spack/compilers.yaml` 的`environment` 和 `flags` 这两个字典中。

```bash
# 编辑配置文件
$ spack config edit compilers

# 若配置文件为空白，可能是scope的优先级有影响，可以指定scope
# spack config --scope user compilers
```

## 添加外部软件包

超算 S 上有一些软件是我们无法自己安装的，例如：

- `/usr` 目录下的软件。它们可能是其他软件的依赖项，不能随意替换；
- `CUDA`、`ROCM` 等平台相关的软件。它们的安装涉及硬件型号、驱动版本，自己安装非常麻烦；
- `PGI` 等编译器，或 `intel`、`hpcx` 等 MPI 实现。它们都是商用软件，并且可能由管理员微调过。

总之，和硬件关系比较密切的软件都是我们要避免重新安装的，只能把它们当作外部软件包。

添加外部软件包时，要注意用 `module show` 来查看模块文件的配置，确定一个软件有哪些依赖、环境变量需要设置。根据我们假想的超算 S 配置，外部软件包大概有以下几个：

```bash
$ spack config edit packages

  1 packages:
  2   gcc:
  3     buildable: false
  4     externals:
  5     - spec: gcc@10.2.0
  6       modules:
  7       - compiler/gcc/10.2.0
  8   mpi:
  9     buildable: false
 10   hpcx:
 11     buildable: false
 12     externals:
 13     - spec: hpcx@2.5%gcc@10.2.0
 14       modules:
 15       - compiler/gcc/10.2.0
 16       - mpi/hpcx/2.5
 17   cmake:
 18     buildable: false
 19     externals:
 20     - spec: cmake@3.19.3%gcc@10.2.0
 21       modules:
 22       - tools/cmake/3.19.3
 23   gettext:
 24     buildable: false
 25     externals:
 26     - spec: gettext@system
 27       prefix: /usr
 28   curl:
 29     buildable: false
 30     externals:
 31     - spec: curl@system
 32       prefix: /usr
 33   numactl:
 34     buildable: false
 35     externals:
 36     - spec: numactl@system
 37       prefix: /usr
 38   autoconf:
 39     buildable: false
 40     externals:
 41     - spec: autoconf@system
 42       prefix: /usr
 43   automake:
 44     buildable: false
 45     externals:
 46     - spec: automake@system
 47       prefix: /usr
 48   libtool:
 49     buildable: false
 50     externals:
 51     - spec: libtool@system
 52       prefix: /usr
 53   perl:
 54     buildable: false
 55     externals:
 56     - spec: perl@system
 57       prefix: /usr
 58   openssl:
 59     buildable: false
 60     externals:
 61     - spec: openssl@system
 62       prefix: /usr
 63   binutils:
 64     buildable: false
 65     externals:
 66     - spec: binutils@system+ld+libiberty~nls
 67       prefix: /usr
```

从这个配置中我们可以看到，有一些是我们用 `modules` 配置的，其他都是我们从 `/usr` 路径里找的。在 `/usr` 路径里的这些都是一些我们没有必要自己安装，或者自己安装容易出错的软件，例如：

- `curl`、`autoconf`、`automake`、`libtool`、`perl` 都是比较基本的开发工具，不需要很新的版本；
- `gettext` 是用于本地化的软件，自己安装可能会有问题；
- `openssl` 是系统的 SSL 软件，自己安装可能会有问题；
- `binutils` 是基本的 GNU 开发工具，包括 `ld`、`ar` 等，自己安装可能会与超算上其他软件冲突。通常它需要一个版本号，在这里为了全球叙述我们直接给定为 `system`。

:::tip 缺失的软件包

目前的 Spack 版本（0.16.0）不包含 `hpcx` 这个软件包，我们可以自定义一个简单的 `hpcx` 来用。详见本文后续说明。

:::

## 安装新的软件包

外部软件包配置完成后，我们已经具备安装新软件的所有条件了。接下来，我们用一个脚本来批量安装如下软件：

- `netcdf-cxx4@4.3.1`
- `petsc@3.14.1`
- `python@3.7.9`
- `scorep@6.0`

在安装它们的过程中，还会相应地安装许多依赖。在下面的脚本中，我们把各类不同的软件包都区分出来，分别安装。

```bash
#!/bin/bash

# 外部软件包，列出来便于我们在有问题时针对性地调整
externals=(
    gcc
    hpcx
    cmake

    autoconf
    automake
    binutils
    curl
    gettext
    libtool
    numactl
    openssl
    perl
)

# 罗列我们要安装的软件包
compilers=('gcc@10.2.0')
devtools=(
    netcdf-cxx4@4.3.1
    petsc@3.14.1
    python@3.7.9
    scorep@6.0
)

# 安装外部软件包
for i in "${externals[@]}"
do
    echo "external package: $i"
    spack install -ny --fail-fast $i
done

# 对于每个列出的编译器，安装我们需要的软件包
for c in "${compilers[@]}"
do
    for i in "${devtools[@]}"
    do
        echo "my package: $i%$c"
        spack install -ny --fail-fast $i%$c
    done
done
```

在这个脚本中，我们用 `for` 循环来逐个安装软件包，这样方便我们做一些额外的操作（比如打印提示信息）。执行完成后，所有软件和依赖都已正确安装，我们可以选择清理不必要的文件。

```bash
# 清理可能存在的临时文件
$ spack clean

# 清理不必要的依赖项
$ spack gc
```

## 导出模块文件

使用 Spack 安装了软件包后，我们还只能用 `spack load` 加载。在实验室集群文档中有提到，这种加载方式比 `module load` 要慢很多，且与 `module load` 混用容易出问题。

由于我们不可避免地要使用超算 S 上的 Environment Modules，我们接下来把刚刚安装的所有软件包都导出为模块文件。为此，先调整配置文件，只允许一些软件包被导出为模块，同时修改一下模块的命名规则。

```bash
$ spack config edit modules

  1 modules:
  2   tcl:
  3     hash_length: 0
  4     verbose: True
  5     blacklist:
  6       - autoconf
  7       - automake
  8       - curl
  9       - gettext
 10       - libtool
 11       - numactl
 12       - openssl
 13       - perl
 14     all:
 15       conflict:
 16         - '{name}'
 17       environment:
 18         set:
 19           '{name}_ROOT': '{prefix}'
 20     projections:
 21       all:      '{name}/{version}-{compiler.name}-{compiler.version}'
 22       hdf5:     '{name}/{version}-{compiler.name}-{compiler.version}-{variants.mpi}'
 25     ^python:
 26       autoload: direct
```

该配置文件中各对象的含义如下：

- `tcl`：表示我们接下来的配置都是针对 Tcl 模块文件的；
- `hash_length`：模块文件名称中 hash 值的长度；
- `verbose`：当模块有 `autoload` 指定的依赖时，输出提示信息；
- `blacklist`：禁止为这些模块生成文件，我们把 `/usr` 里找到的都屏蔽掉；
- `all`：对所有 Tcl 模块生效的设置；
- `conflict`：在模块文件中增加 `conflict`；
- `environment`：在模块文件中设置特定环境变量，在此我们设定诸如 `PETSC_ROOT` 之类的变量；
- `projections`：调整软件包到模块文件的映射规则；
- `autoload`：指明满足特定条件的模块需要加载的依赖，这里我们让所有依赖于 `python` 的模块都加载依赖项。

配置完成后，执行命令来生成模块文件：

```bash
# 清空以前的模块文件，生成新的模块文件
$ spack module tcl refresh --delete-tree
```

随后使用命令来启用 Spack 模块文件的路径，该路径可以在 `config.yaml` 中修改。在这里我们使用默认路径。

```bash
# 启用模块搜索路径
$ module use $SPACK_ROOT/share/spack/modules

# 如果该路径底下还有以架构命名的目录，为了避免模块文件名过长，我们可以用以下命令
# module use $SPACK_ROOT/share/spack/modules/linux-centos7-x86_64
```