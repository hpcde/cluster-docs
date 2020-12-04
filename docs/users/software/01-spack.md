---
id: spack
title: 使用集群上的软件 - Spack
---

Spack是一个为超算平台设计的包管理工具，用法上类似于Lmod、Anaconda。目前，Spack 0.16.0支持Linux和macOS两种系统，可以安装C/C++、Fortran、Python、R等语言的软件包。

总的来说，它和EasyBuild & Lmod的方案能相互替代，但它对依赖的管理能力要更强大。Spack主要特点如下：

- 查询：软件信息，包括版本、依赖项等（比EasyBuild强大）；
- 加载：动态加载、卸载、更换软件（相当于module load/unload/swap）；
- 安装：安装软件、软件栈，处理软件的依赖关系；
- 删除：删除软件及其依赖；
- 多用户：设计了有优先级的配置文件，用户级配置可以覆盖系统配置文件；
- 兼容性：可以导出lmod或tcl格式的modulefiles；
- 易于迁移：可以方便的添加软件的repos、mirrors，也可以自定义新的软件，支持docker。

## 快速入门

Spack的教程非常丰富，可以参考[Tutorial: Spack 101](https://spack-tutorial.readthedocs.io/en/latest/)。

下面简介如何使用集群上已安装的Spack和软件。

```console
## 配置Spack环境
$ export SPACK_ROOT=/apps/spack
$ . $SPACK_ROOT/share/spack/setup-env.sh

## 查看已安装的编译器，有的软件会同时存在依赖不同编译器的多个版本
$ spack compiler list

## 查看已安装的软件及版本
$ spack find cmake
$ spack find openmpi

## 加载软件包
$ spack load cmake openmpi%gcc

## 查看已加载的软件包
$ spack find --loaded

## 使用软件包
$ cmake --version
$ mpicc --version

## 卸载当前加载的所有软件包
$ spack unload -a
```

## 查看集群上的软件

参考：

- [Seeing installed packages](https://spack.readthedocs.io/en/latest/basic_usage.html#seeing-installed-packages)
- [Specs & dependencies](https://spack.readthedocs.io/en/latest/basic_usage.html#specs-dependencies)

相关命令：

- `spack find`：查看已安装软件
- `spack info`：查看软件的介绍，包括版本、选项等

在Spack中，每个软件包都由一个`spec`（specification）唯一表示，`spec`中包含了软件名称、版本、选项、编译器spec、依赖项spec等，因此它是递归定义的。`spec`中信息的改变会导致软件包的hash值发生变化，因此，只要`spec`中有关键信息变了，就会得到新的软件包。更详细的说明见[Specs & dependencies](https://spack.readthedocs.io/en/latest/basic_usage.html#specs-dependencies)。

### `spack find`

```console
## 只指定软件包名称，可能会搜出多个同名软件包
$ spack find hdf5

## '@'用于指定软件包版本
$ spack find hdf5@1.10.7

## '%'用于指定编译器，编译器后面可接'@'等继续限定软件包
$ spack find hdf5@1.10.7%gcc

## '^'用于指定依赖项，可以有多个
$ spack find hdf5@1.10.7%gcc ^openmpi

## '+'、'~'或'='用于指定编译该软件包所用的选项（称为variants）
$ spack find hdf5@1.10.7 +mpi ~fortran

## 查看软件包的编译选项和依赖项，并且注明编译器的版本
$ spack find -vd --show-full-compiler hdf5

## 查看软件包的hash值和安装路径
## 虽然这些软件包是同名、同版本的，但它们的编译选项、编译器、依赖项各不相同，因此
## 有不同的spec，产生不同的hash值
$ spack find -L --paths hdf5
```

### `spack info`

如果对于某一软件不熟悉，或者不清楚该软件的编译选项有什么含义，可以使用`spack info`来确认。

该命令会显示软件包的帮助信息，包括简介、版本、下载地址、编译选项说明、编译安装阶段说明、依赖项列表等。

```console
$ spack info openmpi
```

## 使用集群上的软件

参考：

- [Using installed packages](https://spack.readthedocs.io/en/latest/basic_usage.html#using-installed-packages)

相关命令：

- `spack load`：加载软件包
- `spack unload`：卸载软件包

通过Spack使用软件包和Environment Module的用法类似，分为加载和卸载两个命令。

```console
## 加载软件包
$ spack load cmake

## 加载软件包，并同时加载它的所有依赖（非必需）
$ spack load -r cmake

## 卸载软件包
$ spack unload cmake

## 卸载当前所有已加载的软件包
$ spack unload -a
```

> **关于依赖项**
>
> 使用Spack安装的软件都会尽可能用RPATH，依赖项的位置会写在二进制文件里。因此通常不需要加载依赖项就可以使用软件包。例如，使用`openmpi%gcc@10.2.0`时，不需要加载`gcc@10.2.0`，mpicc会指向正确的gcc位置。

## 配置本地Spack并连接集群Spack

参考：

- [Chaining spack installations](https://spack.readthedocs.io/en/latest/chain.html)
- [Configuration files](https://spack.readthedocs.io/en/latest/configuration.html)

相关命令：

- `spack config`：查看、修改Spack配置文件
- `spack compiler`：查看、查找编译器

实验室集群只安装了一个共享的Spack，位于`/apps/spack`，它其中的软件包由管理员维护，普通用户不能在里面增加新的软件包。

为了完全使用Spack的功能，需要在自己的目录下克隆Spack仓库并做一些配置：

- 设置共享Spack为upstream
- 添加repos（可选，集群的repo会包含自定义软件包）
- 添加mirrors（可选，凡是集群安装过的软件都不用重复下载）
- 修改target（可选，修改软件包的默认target为x86_64）
- 添加compilers（可选，添加集群Spack的编译器到本地Spack）

具体步骤如下：

```console
## 克隆Spack仓库到自己目录下
$ export SPACK_ROOT=~/data/spack
$ git clone https://github.com/spack/spack $SPACK_ROOT

## 加载本地Spack环境
$ . $SPACK_ROOT/share/spack/setup-env.sh

## 检查一下是否能找到Spack
$ which spack

## 将共享Spack作为upstream。编辑配置文件，修改为如下三行
$ spack config edit upstreams

upstreams.yaml
  1 upstreams:
  2   spack-instance-public:
  3       install_tree: /apps/spack/opt/spack

## 检查upstreams
$ spack config get upstreams

## 添加集群的软件包repo。编辑配置文件，修改为如下两行
$ spack config edit repos

repos.yaml
  1 repos:
  2   - /apps/spack_repo

## 检查repos
$ spack config get repos

## 添加镜像位置。编辑配置文件，修改为如下三行
$ spack config edit mirrors

mirrors.yaml
  1 mirrors:
  2   cluster-public: file:///apps/sources/spack
  3   cluster-public-cache: file:///apps/spack/var/spack/cache

## 检查mirrors
$ spack config get mirrors

## 设置默认target为通用x86_64。编辑配置文件，修改为如下三行
$ spack config edit packages

packages.yaml
  1 packages:
  2   all:
  3     target: [x86_64]

## 按需添加编译器，只要先加载编译器所在的软件包，再执行添加命令
## 例如，我们想添加集群Spack的gcc和clang
$ spack load gcc llvm
$ spack compiler find

## 检查compilers
$ spack compiler list
$ spack config get compilers

## 配置完成，查看已安装的软件包，包括共享Spack中的和自己本地的
$ spack find
```

完成配置后，可以随意安装、卸载本地Spack的软件包。有关安装路径、外部软件包等设置，请参考Spack配置文件的手册。

> **关于优先级**
>
> 如果共享Spack和本地Spack存在相同的软件包，本地的会优先被选择。

> **关于Spack版本**
>
> 不同Spack版本在安装软件包时，包的默认版本不同。例如，集群Spack安装的cmake可能是3.18.4，用户本地Spack中的默认cmake却是3.19.1，导致默认情况下不会使用集群的cmake。
>
> 解决方法一：把本地的Spack仓库切换到和集群Spack相同的git分支。要获知集群Spack在哪个分支，使用集群Spack执行
>
> `spack debug report`
>
> 解决方法二：在安装软件包时额外指定依赖的版本，例如`^cmake@3.18.4`。
>
> 解决方法三：在配置文件[packages.yaml](https://spack.readthedocs.io/en/latest/build_settings.html#build-settings)中设置某个版本为优先。

## 在本地安装软件

参考：

- [Installing and uninstalling](https://spack.readthedocs.io/en/latest/basic_usage.html#installing-and-uninstalling)
- [Dependency types](https://spack.readthedocs.io/en/latest/packaging_guide.html#dependency-types)

相关命令：

- `spack list`：查看可安装的软件包
- `spack spec`：查看软件包的spec，包括编译选项、依赖项等
- `spack install`：安装软件包
- `spack uninstall`：解除安装（删除）
- `spack gc`：垃圾回收，清理依赖项
- `spack mark`：标记软件包

配置好本地Spack并连接到集群Spack后，我们可以在本地安装自己需要的软件包。安装软件的一般流程如下

- 检查软件包是否存在
- 确认软件包的版本、编译选项
- 确认软件包的依赖项
- 安装软件包
- 清理依赖
- 删除软件包（若不再使用）

假设我们要用集群Spack的gcc来安装一个低版本cmake，演示如下

```console
## 检查软件包是否存在，若不存在，可考虑spack create来创建
## spack list支持通配符，传参时用引号引起来，如'*make'
$ spack list cmake

## 确认软件包的版本、编译选项
$ spack info cmake

## 查看软件包的完整spec，为已安装的软件包显示标记
$ spack spec -It cmake@3.15.0 %gcc@10.2.0

## 安装软件包
$ spack install cmake@3.15.0 %gcc@10.2.0

## 清理运行时不需要的依赖项，主要是仅用于build的工具
$ spack gc

## 删除已安装的软件包
$ spack uninstall cmake@3.15.0
```

> **关于清理**
>
> `spack gc`可清理的主要是build-time依赖和test依，它们不会连链到安装的软件包中，也不会在运行时被调用。
>
> 一个软件包的依赖有四种类型：build、link、run、test。使用命令可以看到所有依赖对应的类型：
>
> `spack spec -t cmake`
>
> 除了特定类型的依赖不会被清理，我们也可以手动标记软件包，让GC不要清理：
>
> `spack mark -e ncurse`
