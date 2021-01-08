---
id: lmod
title: Lmod - 使用集群上的软件
---

[Lmod](https://github.com/TACC/Lmod) 是一个环境变量管理软件，是基于 Lua 的*模块系统（Module System，或 Environment Module System）* 实现。
在其他超算系统上，使用的通常是另一个基于 Tcl 的实现：[Environment Modules](https://github.com/cea-hpc/modules)。

通过 Lmod，用户可以:

- 加载/卸载软件；
- 切换软件，如 Anaconda 和 Python；
- 切换软件版本，如 GCC 7.3.0 和 GCC 8.2.0。

当用户想要使用软件时，只要运行相应命令来加载软件的环境变量即可。Lmod 提供了 `module`和`ml`命令供用户选择，让用户能够用命令来加载、卸载、查找已安装的软件。

:::caution
目前，实验室的集群已经用 Lmod 代替了以前的 Environment Modules。
使用旧模块系统的用户请参考 [Tcl 旧模块的处理](#Tcl旧模块的处理)。
:::

:::note
为了方便叙述，在本节中我们把 Lmod 和 Environment Modules 两种实现统称为模块系统，并将 Environment Modules 简称为 Modules。
:::

## 快速入门

```bash
$ man module                    # manpage
$ module help                   # help

$ module avail                  # 查看当前可加载的模块（软件）
$ module avail GCC				# 查看当前可加载的包含'GCC'的模块
$ module spider                 # 查看所有可加载的模块（软件）
$ module spider GCC             # 查看GCC有多少不同版本已安装在集群上
$ module spider GCC/8.2.0       # 查看必须手动加载的依赖
$ module keyword GCC            # 在模块名称和描述中查找关键字

$ module load GCC/8.2.0         # 加载模块，从而能使用GCC/8.2.0
$ module list                   # 列出已加载的模块
$ module unload GCC/8.2.0       # 卸载模块

$ module save mymods            # 保存已加载的模块到列表中
$ module savelist               # 查看已保存的加载方案
$ module restore mymods         # 恢复已保存的加载方案

$ module purge                  # 卸载所有已加载的模块

$ ml                            # module命令的前端，单独调用相当于 module list
$ ml avail                      # module avail
$ ml spider                     # module spider
$ ml GCC/8.2.0                  # module load GCC/8.2.0
$ ml -GCC/8.2.0                 # module unload GCC/8.2.0
$ ml -GCC/8.2.0 GCC/7.3.0       # module swap
```

更多关于 Lmod 的用法，可参考官方文档：

- [Lmod: A New Environment Module System](https://lmod.readthedocs.io/en/latest/index.html)
- [User Guide for Lmod](https://lmod.readthedocs.io/en/latest/010_user.html)

:::info 初始环境变量
如果不加载软件，用户使用的就是系统自带的软件，例如， GCC 可能使用的就是 `/usr/bin` 下面的 GCC 4.8.5，Python 可能使用的是 `/usr/bin` 下面的 Python 2.7.5。
:::

:::tip Shell的配置
目前默认的配置是 bash，如果需要使用其他 shell 加载模块，可以在 Lmod 目录下找相应的配置脚本，或联系管理员解决。
:::

:::tip 依赖项的切换
多数情况下使用 Lmod 切换模块都不需要卸载之前的模块，例如，

```bash
$ module load GCC/7.3.0
$ module load GCC/8.2.0
```

执行第二条命令会自动切换相应的依赖项。
:::

### `module avail` 与 `module spider`

Lmod 有两个查询命令：`module avail` 和 `module spider`，Environment Modules 只有 `module avail`。区别如下：

- `module avail` (Lmod)：查询**当前**可加载的软件包。如果一个软件包需要一些依赖项，在依赖项被加载之前它可能不会显示在列表里。
- `module spider` (Lmod)：查询**所有**可加载的软件包。
- `module avail` (Modules)：查询**所有**可加载的软件包。

### `module` 与 `ml`

`ml` 实际上是 Lmod 中的一个脚本，它像 `spack` 一样给用户提供便利的功能。Modules 从 4.5 开始也引入了 `ml`。

Lmod：https://lmod.readthedocs.io/en/latest/010_user.html#ml-a-convenient-tool

Modules：https://modules.readthedocs.io/en/latest/ml.html

## 模块层次

参考

- [How to use a Software Module hierarchy](https://lmod.readthedocs.io/en/latest/080_hierarchy.html)
- [Dependent Modules](https://lmod.readthedocs.io/en/latest/098_dependent_modules.html)

科学计算软件的依赖比较复杂，许多软件在特定编译器/依赖版本下能顺利编译和运行，换作其他编译器/依赖就出现很多意想不到的错误（如链接库错误）。
EasyBuild & Lmod 使用模块层次来处理这种软件间的依赖关系。

Lmod 的每个模块都可以依赖于其他模块，依赖关系也有不同类型，最终形成像文件系统一样的层次结构。用户可以用 `module avail` 查看**当前**可加载的模块，该命令的结果会随着用户加载的模块不同而变化，因为模块文件所在的路径 `$MODULEPATH` 会在运行时被修改。

例如，OpenMPI 只有在加载了特定编译器之后才会显示在 `module avail` 结果中：

```bash
## 清空所有已加载的模块，保证环境是干净的
$ module purge

## 查看当前可加载的模块，OpenMPI不会显示
$ module avail

GCC/8.2.0-2.31.1

## 加载GCC后再次查看模块列表，OpenMPI已经可以加载
$ module GCC/8.2.0-2.31.1
$ module avail

GCC/8.2.0-2.31.1 (L)    OpenMPI/3.1.3
```

如果未加载依赖项，直接加载 `OpenMPI/3.1.3` 会报错：

```bash
## 清空所有已加载的模块，保证环境是干净的
$ module purge

## 跳过GCC，直接加载OpenMPI
$ module OpenMPI/3.1.3

Lmod has detected the following error: These module(s) exist but cannot be loaded as requested:
"OpenMPI/3.1.3"
	Try: "module spider OpenMPI/3.1.3" to see how to load the module(s).

## 查看OpenMPI所需的依赖项
$ module spider OpenMPI/3.1.3

-----------------------------------------------------------
OpenMPI: OpenMPI/3.1.3
-----------------------------------------------------------
  Description:
  	The Open MPI Project is an open source MPI-3 implementation.
    
  You will need to load all module(s) on any one of the lines below before the "OpenMPI/3.1.3" module is available to load.
  
  	GCC/8.2.0-2.31.1
```

在用户没有加载任何模块的情况下，可以加载的模块称为 *核心 (Core)* 模块。其模块所在路径也以 *Core* 命名：

```
/apps/modulefiles/Core
/apps/lmod/lmod/modulefiles/Core
```

为了避免手动加载依赖项，用户可以为当前加载的模块创建 *savelist* ，或者使用核心模块中的工具链。关于工具链的说明见后续小节。


:::note 模块名称及版本
集群上所有 Lmod 的模块文件均由 EasyBuild 生成，采用 EasyBuild 的命名规则。
:::note

## 切换软件版本

集群上有的软件是用同一编译器编译的。假设有4个模块：`GCC/8.2.0`, `OpenMPI/3.1.3`, `OpenMPI/4.0.0`, `GCC/9.1.0`。
其中两个 OpenMPI 都是由 `GCC/8.2.0` 编译的。在下面的演示中，我们先加载一个 OpenMPI，再切换到另一个 OpenMPI 版本，最后切换 GCC 的版本。

```bash
## 使用OpenMPI之前必须加载GCC/8.2.0，否则报错
## ml OpenMPI/3.1.3
$ ml GCC/8.2.0-2.31.1 OpenMPI/3.1.3

## 成功加载OpenMPI/3.1.3后，切换到OpenMPI/4.0.0
$ ml OpenMPI/4.0.0

The following have been reloaded with a version change:
  1) OpenMPI/3.1.3 => OpenMPI/4.0.0     2) hwloc/1.11.11 => hwloc/2.0.2

## 在加载了GCC/8.2.0和OpenMPI/3.1.3的情况下，切换到GCC/9.1.0
## 此时OpenMPI会进入inactive状态
$ ml GCC/9.1.0-2.32

Inactive Modules:
  1) OpenMPI/4.0.0     2) hwloc/2.0.2     3) libxml2/2.9.8

Due to MODULEPATH changes, the following have been reloaded:
  1) XZ/5.2.4     2) libpciaccess/0.14     3) numactl/2.0.12     4) zlib/1.2.11

The following have been reloaded with a version change:
  1) GCC/8.2.0-2.31.1 => GCC/9.1.0-2.32     2) GCCcore/8.2.0 => GCCcore/9.1.0     3) binutils/2.31.1 => binutils/2.32
```

最后一条命令输出了三类信息：

- ***Inactive Modules***：模块不再生效。这是由于 `OpenMPI/4.0.0` 这些软件包并没有针对 `GCC/9.1.0` 安装的版本。当我们把原本的 `GCC/8.2.0` 切换为 `GCC/9.1.0` 后，Lmod 找不到这个版本的编译器对应的 `OpenMPI/4.0.0`。解决办法：查看并加载 `GCC/9.1.0` 对应的 OpenMPI 版本。

- ***...have been reloaded***：模块被重新加载。这是由于 `libpciaccess/0.14` 这些软件包在两个GCC版本下都存在，但安装路径不同。

- ***...reloaded with a version change***：模块被重新加载为不同版本。这是由于这些模块在两个GCC版本下都存在，但版本和路径都不同。

## 默认模块

参考：

- [Site and user control of defaults, aliases and hidden modules](https://lmod.readthedocs.io/en/latest/093_modulerc.html)

如果用户在加载模块时不指定版本，那么 Lmod 会加载默认模块。在模块列表中，默认模块的名字后面有个 `(D)`。用户可以用命令查看当前可加载的所有默认模块：

```bash
$ module -d avail
```

例如，在实验室集群上，以下两条命令的效果是相同的：

```bash
$ ml GCC/8.2.0-2.31.1

$ ml GCC
```

默认模块可以由*模块名*目录下的配置文件 `.modulerc.lua` 或 `.modulerc` 指定。例如，以下命令可以指定 GCC 的默认版本为 8.3.0：

```bash
$ MY_GCC_DIR="/apps/modulefiles/Core/GCC"
$ echo 'module_version("2.31.1","default")' > $MY_GCC_DIR/.modulerc.lua
```

普通用户无法通过这种方式设置公共Lmod的默认模块，只能为自定义的模块设置。

## 工具链

在科学计算中，多个编译工具、数学库往往会组合在一起使用。
实验室集群使用 EasyBuild 来生成 Lmod 模块文件，除了单个软件包的模块，还提供了*工具链 (toolchains)*，每个工具链都是一组模块，这些软件模块相互之间有依赖关系。

### 加载工具链
加载一个工具链时，相当于同时加载了一系列模块。
使用工具链可以很方便地编译绝大多数的 C/C++/Fortran 程序。
加载工具链和卸载工具链可以帮助用户快速切换所需的编译器，而不用手动加载依赖项。

例如，`gmpich` 就是一些与 MPICH 相关的编译工具，它包括 `gcc`、`mpicc`； `gompi` 则是一些与 OpenMPI 相关的编译工具。 下面两条命令分别加载了这两个工具链的默认版本。

```bash
## 加载工具链gmpich
$ module load gmpich

## 清空当前加载的模块，因为同时只能使用一个MPI实现
$ module purge

## 加载工具链gompi
$ module load gompi
```

每个工具链都依赖于一些编译器和库。例如，在实验室集群上，`gompi/2019a` 工具链主要依赖于 `GCC/8.2.0-2.31-1` 和 `OpenMPI/3.1.3`，其中的 `GCC` 和 `OpenMPI` 又有各自的依赖项。

如果想确认一个工具链里具体包含哪些模块，我们可以先加载工具链，再用命令查看所有加载进来的模块：

```bash
## 加载gompi
$ ml purge
$ ml gompi/2019a

## 查看当前加载的模块
$ ml
Currently loaded Modules:
  1) GCCcore/8.2.0      4) zlib/1.2.11      7) libxml2/2.9.8        10) OpenMPI/3.1.3
  2) binutils/2.31.1    5) numactl/2.0.12   8) libciaccess/0.14     11) gompi/2019a
  3) GCC/8.2.0-2.31-1   6) XZ/5.2.4         9) hwloc/1.11.11
```

或者检查 modulefile 中的 `depends_on` 语句：

```bash
$ ml show gompi/2019a |& grep depends_on

depends_on("GCC/8.2.0-2.31.1")
depends_on("OpenMPI/3.1.3")
```

:::info Spack的工具链
集群上的公共 Spack 也可以加载 `gompi`、`gmpich` 等少量工具链，具体用法请参考文档中 Spack 章节。
:::

### 卸载工具链
卸载工具链时会把所有依赖项全部卸载。

```bash
## 从当前shell卸载整个工具链
$ ml -gompi/2019a

$ ml
No modules loaded
```

### 切换工具链
切换工具链时，建议使用 `ml` 的切换语法或者 `swap` 等切换命令。
例如，我们可以通过以下命令在加载 `gompi/2019a` 之后切换到 `gmpich/2019a`：

```bash
## 加载gompi
$ ml gompi/2019a

## 切换到gmpich
$ ml -gompi/2019a gmpich/2019a
```

常用的工具链见集群文档的公共软件列表。

## 保存加载的模块

用户在使用 Lmod 时，通过 `ml save` 命令，可以把已经加载的模块保存起来，便于下次使用。
保存模块的配置信息位于用户的 `~/.lmod.d` 目录下。

```bash
## 加载一些模块
$ ml CMake/3.19.1 GCC/8.2.0-2.31-1 OpenMPI/3.1.3

## 保存到名为devtools的列表
$ ml save devtools

Saved current collection of modules to: "devtools"

## 查看所有已保存的配置
$ ml savelist
Named collection list:
  1) devtools

## 清空当前环境，加载之前保存的配置
$ ml purge
$ ml restore devtools

Restoring modules from user's devtools

## 弃用一个已保存的加载配置
$ ml disable devtools
```

## 自定义软件和模块

参考：

- [Advanced User Guide for Personal Modulefiles](https://lmod.readthedocs.io/en/latest/020_advanced.html)

- [Modulefile Examples from simple to complex](https://lmod.readthedocs.io/en/latest/100_modulefile_examples.html)

预装的软件都以是特定的编译选项编译的，可能无法完全满足你的需求。普通用户无法更改公共的软件，但可以向 Lmod 添加自定义的模块文件。因此，我们只要为自己安装的软件写 modulefile，让 Lmod 能够搜索到即可。

步骤总结如下：

- 建立一个目录用于存放 modulefiles，如 `$HOME/modulefiles/`；
- 使用 `module use` 添加该目录到 Lmod 搜索路径；
- 安装软件到自己的家目录（`$HOME`）；
- 为安装的软件写一个 modulefile，放在自己的 modulefiles 目录下。

假设用户安装了 `GCC/10.2.0`，并且写了一个名为 `gcc-10.2.0.lua` 的 modulefile 放在 `$HOME/modulefiles/` 目录下。为了让 Lmod 能搜索到这个模块，执行命令

```bash
$ module use $HOME/modulefiles
```

随后便可以加载自定义的模块

```bash
$ module load gcc-10.2.0
```

在这个例子中，我们的模块文件名为 `gcc-10.2.0.lua`，由 `module` 命令显示的名称为 `gcc-10.2.0`。
根据 Lmod 的模块层次，如果我们想要一个名为 `gcc/10.2.0/mpich/3.3.2` 的模块，就应该创建如下文件

```bash
$ mkdir -p $HOME/modulefiles/gcc/10.2.0/mpich
$ touch $HOME/modulefiles/gcc/10.2.0/mpich/3.3.2.lua

## 添加Lmod搜索路径
$ module use $HOME/modulefiles
```

:::info 更新 cache
实验室集群上的 Lmod 配置了 cache 文件来加快模块的访问速度，这些文件每小时都被更新。
新的模块被添加后，若 Lmod 的 cache 文件没有正常更新，就需要管理员来手动更新。相关命令和路径如下：

- 命令：`/apps/lmod/lmod/libexec/update_lmod_system_cache_files`
- cache 目录：`/apps/moduleData/cacheDir`
- system 目录：`/apps/moduleData/system.txt`
:::

### 自定义模块的命名

为防止自定义模块与系统中安装的模块发生冲突，有两种解决方法。

第一种是以不同风格命名。例如，系统中已安装 `MPICH/3.2`，如果用户想使用自己编译的 MPICH，可以命名为 `mpich/3.2, user/mpich/3.2` 等。

第二种是修改 Lmod 搜索路径。只有处于 Lmod 搜索路径中的同名模块才会冲突，我们可以在需要时去掉现存的路径（例如默认加载的 `Core/` 路径），只使用自己的路径。
比如，集群上的 `showlegacy` 模块文件里实际上是一句 `module use`，它启用了一个新的搜索路径让 Lmod 能找到 Tcl 旧模块。
我们可以仿照 `showlegacy` 模块的做法，写一个模块文件，启用自定义路径的同时删除公共模块文件的路径。

### 编写模块文件

一个 modulefile 中最主要的就是各种环境变量，例如 `PATH` 和 `LIBRARY_PATH`。
用户使用 `module load` 加载这个 modulefile 时，实际上就是在当前 shell 设置这些环境变量。
因此，用户在安装完软件后，通常需要把 `bin`、`include`、`lib` 等目录的绝对路径写在 modulefile 中。

自定义模块文件时，可以用命令查看集群上已有模块的配置文件供参考，例如，查看 `GCC/8.2.0` 的模块文件：

```bash
$ module show GCC/8.2.0-2.31.1
```
需要注意的是，集群上的模块文件通常都是 Lua 语法，在其他超算上可能需要 Tcl。Tcl 的模块文件可以参考 Tcl 旧模块。

## Tcl 旧模块的处理

模块系统的迁移（指从 Environment Modules 迁移到 Lmod）并不影响 Tcl 旧的软件模块的使用，
因为 Lmod 同样兼容 Tcl 模块文件。

目前，实验室集群上的 Tcl 模块都转移到另一个路径了，因此无法直接用 `module avail` 命令看到。如果要使用旧的模块，请执行：

```bash
$ ml showlegacy
```

旧模块提供的软件安装在 `/opt` 下，新模块提供的软件安装在 `/apps` 下。

:::note 冲突的模块
为防止模块冲突，在 `/opt` 中安装编译工具、科学计算软件 Tcl 模块时尽量不要与 Lua 模块同名（如 GCC、OpenMPI、MPICH、PETSc 等）。除此之外，其他手动安装的软件都可随意使用。
:::
