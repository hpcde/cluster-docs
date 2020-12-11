---
id: spack
title: 使用集群上的软件 - Spack
---

Spack是一个为超算平台设计的包管理工具，它能较好地处理依赖关系，用法上类似于 Lmod、Anaconda。
目前，Spack 0.16.0 支持 Linux 和 macOS 两种系统，可以安装 C/C++、Fortran、Python、R 等语言的软件包。

在实验室集群上，Spack 可以用来替代 EasyBuild & Lmod 进行软件包/环境管理。  
Spack的主要特点如下：
- **查询**：软件信息，包括版本、依赖项等；
- **加载**：动态加载、卸载、更换软件（相当于module load/unload/swap）；
- **安装**：安装软件、软件栈，处理软件的依赖关系；
- **删除**：删除软件及其依赖；
- **多用户**：设计了有优先级的配置文件，用户级配置可以覆盖系统配置文件；
- **兼容性**：可以导出lmod或tcl格式的modulefiles；
- **易于迁移**：可以方便的添加软件的repos、mirrors，也可以自定义新的软件，支持docker。

相关参考资料和链接如下：  
Spack官方网站：https://spack.io/  
Spack官方教程 (Tutorial: Spack 101): https://spack-tutorial.readthedocs.io/en/latest/  
Spack工作流：[Spack Workflows](https://spack.readthedocs.io/en/latest/workflows.html)

## 快速入门

```bash
# 配置和加载 Spack 环境
$ export SPACK_ROOT=/apps/spack
$ source $SPACK_ROOT/share/spack/setup-env.sh

# 查看已安装的编译器，有的软件会同时存在依赖不同编译器的多个版本
$ spack compilers

# 查看已安装的软件及版本
$ spack find cmake
$ spack find openmpi

# 加载软件包
$ spack load cmake openmpi%gcc

# 查看已加载的软件包
$ spack find --loaded

# 使用软件包
$ cmake --version
$ mpicc --version

# 卸载当前加载的所有软件包
$ spack unload -a
```

:::note 切换 Spack 环境
如果机器上配置了多个 Spack，切换 Spack 环境时直接使用 `source setup-env.sh` 可能不会生效。
问题在于该脚本会检查 `PATH` 变量里面是否已经有 Spack 路径，并且该脚本定义了几个变量、函数可能不会被新脚本覆盖。
最简单的办法就是在 `source` 之前，用 `env` 检查一下自己的环境，从 `PATH` 里去掉 Spack 路径，并删除 Spack 定义的函数。
:::

## 基本概念
在使用 Spack 之前，建议先熟悉 Spack 中的相关概念，如包的命名规则。

### 公共 Spack

公共 Spack 指的是由管理员安装在实验室集群上的 Spack，仅管理员有写权限。

普通用户不能用公共 Spack

- 安装或删除软件；
- 修改集群的 Spack 配置文件；
- 创建 Spack 虚拟环境（因为虚拟环境路径无法修改）。

### 用户级 Spack

用户级 Spack（或者本地 Spack）指的是由用户自行安装在家目录下的 Spack，用户对该 Spack 拥有完全的读写权限。用户级 Spack 默认情况下无法用于加载集群上安装的软件，需要进行相关配置将它连接到公共 Spack。

### spec

参考：[Specs & dependencies](https://spack.readthedocs.io/en/latest/basic_usage.html#specs-dependencies)

在 Spack 中，每个软件包都由一个 *spec*（specification）唯一表示。一个 spec 中包含了软件名称、版本、选项、编译器 spec、依赖项 spec 等，也就是说，它是递归定义的。
spec 中信息的改变会导致软件包的 hash 值发生变化，也就是说，只要 spec 中有关键信息变了，就会被视为新的 spec，在安装时会被当作新的软件包。

spec 的语法可以查阅参考文档，也可以在机器上用命令查看

```bash
$ spack help --spec
```

### add, concretize, install

Spack 将软件包的管理分为多个阶段：

- *add*：添加 spec，通常仅仅修改配置文件
- *concretize*：完成 spec 检索、依赖项解析等工作，可能会修改配置文件（包括`.lock`文件），这个过程也会发现已安装的软件包、有冲突的 specs
- *install*：完成下载、编译安装、索引生成等工作，结束后用户便可使用软件包

用户使用 `spack install` 时，所有阶段都会执行。只有在使用 Spack 虚拟环境时，用户才能手动执行各个阶段。

### environment

参考：[Environments](https://spack.readthedocs.io/en/latest/environments.html)

熟悉 Python 的应该都了解虚拟环境，Spack 也提供了对虚拟环境（在 Spack 中称为 *environments*）的支持。
Spack 提供的虚拟环境与 Anaconda 的虚拟环境功能类似。  
Spack的环境可以用于批量操作软件包 specs，也可以用于管理文件系统视图，以及像 Anaconda 的虚拟环境一样激活、反激活，一次性加载其中的所有软件包等。

### view

参考：[Filesystem Views](https://spack.readthedocs.io/en/latest/workflows.html#filesystem-views)

Spack 的文件系统视图（*filesystem views*）是一种帮助用户批量使用软件包的方式。它可以为指定的软件包建立软/硬链接，按照Linux的目录结构来组织。例如，为指定的一些软件在目录 `myview/` 建立文件系统视图后，该目录内容通常包含

- `myview/bin`：存放所有指定软件包的`bin/*`
- `myview/lib`：存放所有指定软件包的`lib/*`
- `myview/include`：存放所有指定软件包的`include/*`

从上述说明可知，一个文件系统视图中通常不能有两个同名软件包，否则无法创建。

## 查询软件包

参考：

- [Seeing installed packages](https://spack.readthedocs.io/en/latest/basic_usage.html#seeing-installed-packages)
- [Specs & dependencies](https://spack.readthedocs.io/en/latest/basic_usage.html#specs-dependencies)

用于查询软件包的相关命令有： 
- `spack find`：查看已安装软件
- `spack info`：查看软件的介绍，包括版本、选项等

### `spack find`

```bash
## 列出所有已安装的软件包
$ spack find

## 列出指定名称的软件包，可能会搜出多个同名软件包
$ spack find hdf5

## '@'用于指定软件包版本
$ spack find hdf5@1.10.7

## '%'用于指定编译器，编译器后面可接'@'继续限定编译器版本
$ spack find hdf5@1.10.7%gcc@10.2.0

## '^'用于指定依赖项，可以有多个
$ spack find hdf5@1.10.7%gcc ^openmpi

## '+'、'~'或'='用于指定编译该软件包所用的选项（称为variants）
$ spack find hdf5@1.10.7 +mpi ~fortran

## 查看软件包的编译选项和依赖项，并且注明编译器的版本
$ spack find -vd --show-full-compiler hdf5

## 查看软件包的hash值和安装路径
## 虽然这些软件包是同名、同版本的，但它们的编译选项、编译器、依赖项各不相同，因此
## 有不同的spec，产生不同的hash值。hash值也可以在加载软件包的时候使用。
$ spack find -L --paths hdf5
```

Spack把安装的软件包按照架构（target）和编译器（compiler/compiler driver）分类。在目前的集群Spack中，架构统一为x86_64，这是为了兼容集群中不同型号的处理器。

使用 `spack find` 可以看到，不同编译器下面会有同名的软件包。例如，查看已安装的所有 `mpi` 包如下

```bash
## mpi属于virtual package，查询它就会显示所有提供mpi的包
$ spack find mpi

==> 4 installed packages
-- linux-centos7-x86_64 / clang@11.0.0
--------------------------
mpich@3.3.2  openmpi@4.0.5

-- linux-centos7-x86_64 / gcc@10.2.0
----------------------------
mpich@3.3.2  openmpi@4.0.5
```

### `spack info`

如果对于某一软件不熟悉，或者不清楚该软件的编译选项有什么含义，可以使用 `spack info` 来确认。

该命令会显示软件包的帮助信息，包括简介、版本、下载地址、编译选项说明、编译安装阶段说明、依赖项列表等。

```bash
$ spack info openmpi
```

## 加载/卸载软件包

参考：

- [Using installed packages](https://spack.readthedocs.io/en/latest/basic_usage.html#using-installed-packages)

用于加载/卸载软件包的命令分别如下：  
- `spack load`：加载软件包
- `spack unload`：卸载软件包

通过 Spack 使用软件包和 Environment Module 的用法类似，分为加载和卸载两个命令。

```bash
# 加载软件包
$ spack load cmake

# 加载软件包，并同时加载它的所有依赖（非必需）
$ spack load -r cmake

# 卸载软件包
$ spack unload cmake

# 卸载当前所有已加载的软件包
$ spack unload -a
```

除了普通的软件包，集群上还定义了一些 *bundle package*，也就是一组软件。这些 bundle package 主要用于代替 Easybuild & Lmod 的 *toolchain*，版本规则也类似于toolchain：年份+字母。例如，`gompi@2020b` 就包含了 `gcc` 和 `openmpi`，软件的安装时间为2020年下半年。

```bash
$ spack find gompi

$ spack load gompi@2020b
```

:::info 关于依赖项
使用 Spack 安装的软件都会尽可能用 **RPATH**，依赖项的位置会写在二进制文件里。
因此通常不需要加载依赖项就可以使用软件包。
例如，使用 `openmpi%gcc@10.2.0` 时，不需要加载 `gcc@10.2.0` ，mpicc 会指向正确的 gcc 位置。
:::

:::info 自定义bundle package
参考后续创建软件包的说明和 [Bundle package](https://spack.readthedocs.io/en/latest/build_systems/bundlepackage.html)。
:::

## 使用 Spack 加载 Python 包

参考：

- [Extensions & Python support](https://spack.readthedocs.io/en/latest/basic_usage.html#extensions-python-support)

Spack 中用于加载 Python 包的命令为：

- `spack extensions`：列出Python包

Spack 把 Python 包归为 **extensions**，可以通过相应的命令查看 Python 包列表。
Python 包的加载有多种方式，这里只介绍最简单的方式。

```bash
# 查看所有已安装的Python包
$ spack extensions -s installed python

# 查看目前已加载的Python包
$ spack extensions -s activated python

# 加载Python和想用的Python包
$ spack load python
$ spack load py-numpy

# 使用Python包
$ python3

>>> import numpy
```

:::tip 集群预装的 Spack 环境
如果对 Python 包的版本没有特殊要求，可以使用预装的 Spack 环境：
`spack env activate python3`。
关于Spack环境的说明见后续内容。
:::

## 创建文件系统视图

参考：

- [Workflows - Filesystem views](https://spack.readthedocs.io/en/latest/workflows.html)

用于创建、修改文件系统视图的命令为：

- `spack view`

Spack 安装的所有软件包都按照 Spack 的命名规则存放在同一目录下，但我们也可以建立文件系统视图，将某些软件包的文件聚在一起。

```bash
## 在指定目录中为软件包建立软链接
$ spack view add $HOME/data/mytools petsc%gcc scorep%gcc

## 将软链接所在目录添加到环境变量
$ export PATH=$HOME/data/mytools/bin:$PATH
$ export LIBRARY_PATH=$HOME/data/mytools/lib:$LIBRARY_PATH
$ export LD_LIBRARY_PATH=$HOME/data/mytools/lib:$LD_LIBRARY_PATH
$ export CPATH=$HOME/data/mytools/include:$CPATH

## 不再使用时，删除所有软链接
$ spack view remove --all $HOME/data/mytools
```

## 创建虚拟环境

参考：

- [Using environments](https://spack.readthedocs.io/en/latest/environments.html#using-environments)

用于管理虚拟环境的主要命令有：
- `spack env`：创建、修改虚拟环境（需要写权限）
- `spack add`：在虚拟环境中添加抽象specs（仅添加到配置文件）
- `spack concretize`：对所有specs执行`concretize`（检查、解析依赖等，可能会格式化配置文件）
- `spack install`：安装所有 concretized specs

同一个环境里的specs可以批量操作，可使用的操作（阶段）为：

- *add*：批量添加specs，但不执行后续操作
- *concretize*：批量concretize，解析所有依赖
- *install*：批量下载、编译安装

因此，把specs组织成多个环境既有助于我们管理软件包，也有助于我们切换开发用的环境变量。
:::note
要注意的是，操作Spack的虚拟环境需要修改权限，普通用户只能修改用户级 Spack（关于用户级 Spack的配置见后续内容），不能修改集群的公共Spack。
:::

Spack 环境的简单用法如下：

```bash
# 创建一个名为python3的空环境（需要用户级 Spack）
$ spack env create python3

# 查看目前有哪些环境
$ spack env list

# 激活Spack环境
$ spack env activate python3

# 查看当前位于哪个环境中
$ spack env status

# 查看当前环境中有哪些软件包
$ spack find

# 添加一些抽象specs到环境中
$ spack add py-numpy py-h5py

# 执行concretize，解析所有依赖（需要用户级 Spack）
$ spack concretize --force

# 已安装的specs会直接被拉到环境中来，如果对concretize的结果不满意，可以修改specs
# Spack环境只有一个配置文件，其他诸如packages等配置作为子节点写在总配置文件中
# （需要用户级 Spack）
$ spack config edit

# 查看目前concretize的结果（需要用户级 Spack）
$ spack find -c

# 安装所有软件包及依赖项（需要用户级 Spack）
$ spack install
```

:::tip Spack环境的默认view
激活Spack环境后，默认也会启用一个view，为我们设置好环境变量。
如果该环境中某些软件包没有正确加载，可以使用 `spack load` 命令手动加载一下。
:::

:::tip **集群Spack预定义的环境**
集群 Spack 中可能会预先定义一些只读的环境，如 `python3`，它们通常是一些常用的软件包，只有在使用集群的公共 Spack 时才可以加载：
```bash
$ spack env list
$ spack env activate python3
```

如果需要定制Spack环境，请配置用户级 Spack。
:::

## 生成 modulefiles

参考：

- [Modules](https://spack.readthedocs.io/en/latest/module_file_support.html)

Spack加载软件包的速度比Lmod要慢，好在它提供了两种简单的方式让我们能快速加载想要的环境，分别为: 
- `spack view`：建立文件系统视图，前面已经介绍过
- `spack module`：为软件包创建 modulefiles，之后便可通过`module`加载

Spack 中用于生成 modulefiles 的相关命令为：

- `spack module`

Spack 能够为 `lmod` 和 `tcl` 两种类型环境系统创建 modulefiles，在实验室集群上，两种均可以使用。我们以 `lmod` 为例。

```bash
# 为某些软件包创建modulefiles
$ spack module lmod refresh autoconf automake boost

# 创建完成后，可以通过module查看这些modulefiles
# module avail

# 也可以直接用Spack查看
$ spack module lmod find boost

boost/1.70.0-d42gtzk

# 还可以用Spack生成加载软件包用的module命令
# 通常可以为一批软件包生成module load命令，存放在自己的脚本里批量加载
$ spack module lmod loads boost

module load boost/1.70.0-d42gtzk
```

## 配置用户级 Spack 并连接公共 Spack

参考：

- [Prerequisites](https://spack.readthedocs.io/en/latest/getting_started.html#prerequisites)
- [Chaining spack installations](https://spack.readthedocs.io/en/latest/chain.html)
- [Configuration files](https://spack.readthedocs.io/en/latest/configuration.html)
- [Concretization preferences](https://spack.readthedocs.io/en/latest/build_settings.html#concretization-preferences)

相关命令：

- `spack config`：查看、修改 Spack 配置文件
- `spack compiler`：查看、查找编译器

实验室集群只安装了一个公共的 Spack，位于`/apps/spack`，它其中的软件包由管理员维护，普通用户不能在里面增加新的软件包。

为了完全使用 Spack 的功能（例如安装自己需要的包），需要在自己的目录下安装 Spack并做一些配置。

### 安装 Spack

根据 Spack 文档，运行 Spack 0.16.0 运行以下依赖：

- Python 2 (2.6 or 2.7) 或 3 (3.5 - 3.9)，用于运行Spack；
- C/C++编译器，用于软件包的编译链接；
- `make`，用于软件包的编译链接；
- `tar`、`gzip`、`bzip2`、`xz`、可选的`zstd`，用于解压下载的压缩包；
- `patch`，用于给软件包打补丁；
- `git`或`curl`，用于在缺少软件包时下载其源代码；
- 可选的`gnupg2`，用于GPG。

由于 Spack 基本都是 Python，我们只需要克隆它的仓库、添加 Python 路径便可使用。

```bash
# 克隆Spack仓库到自己目录下
$ export SPACK_ROOT=~/data/spack
$ git clone https://github.com/spack/spack $SPACK_ROOT

# 加载用户级 Spack环境
$ . $SPACK_ROOT/share/spack/setup-env.sh

# 检查一下是否能找到Spack
$ which spack
```

### 修改配置文件

准备好 Spack 仓库之后，我们要针对目前实验室集群的配置来修改 Spack 的配置文件：

- 设置公共 Spack 为 upstream
- 添加 repos（可选，集群的 repo 会包含自定义软件包）
- 添加 mirrors（可选，凡是集群安装过的软件都不用重复下载）
- 修改 target（可选，修改软件包的默认 target 为 x86_64）
- 添加 compilers（可选，添加集群 Spack 的编译器到用户级 Spack）

为用户级 Spack 修改配置的具体步骤如下：

```bash
# 将公共Spack作为upstream。编辑配置文件，修改为如下三行
$ spack config edit upstreams

upstreams.yaml
  1 upstreams:
  2   spack-instance-public:
  3       install_tree: /apps/spack/opt/spack

# 检查 upstreams
$ spack config get upstreams

# 添加集群的软件包 repo。编辑配置文件，修改为如下两行
$ spack config edit repos

repos.yaml
  1 repos:
  2   - /apps/spack_repo

# 检查 repos
$ spack config get repos

# 编辑配置文件，添加镜像位置
$ spack config edit mirrors

mirrors.yaml
  1 mirrors:
  2   cluster-public: file:///apps/sources/spack

# 检查 mirrors
$ spack config get mirrors

## 设置默认 target 为通用x86_64。编辑配置文件，修改为如下三行
$ spack config edit packages

packages.yaml
  1 packages:
  2   all:
  3     target: [x86_64]

# 按需添加编译器，只要先加载编译器所在的软件包，再执行添加命令
# 例如，我们想添加集群 Spack 的 gcc 和 clang
$ spack load gcc llvm
$ spack compiler find

# 检查 compilers
$ spack compiler list
$ spack config get compilers

# 配置完成，查看已安装的软件包，包括公共的和用户级的 Spack
$ spack find
```

完成配置后，可以随意安装、删除用户级 Spack 的软件包。有关安装路径、外部软件包等设置，请参考 Spack 配置文件的手册。

:::note 关于软件包的优先级
如果公共 Spack 和用户级 Spack 存在相同的软件包，用户级的会优先被选择。
:::

:::tip Spack版本的影响
不同Spack版本在安装软件包时，包的默认版本不同。
例如，集群 Spack 安装的 `cmake` 可能是 3.19.0，用户级 Spack 中的默认 `cmake` 却是 3.19.1，导致默认情况下不会使用集群的 `cmake`。
- 解决方法一：把用户级的 Spack 仓库切换到和集群 Spack 相同的 git 分支。要获知集群 Spack 在哪个分支，使用集群 Spack 执行 `spack debug report`
- 解决方法二：在安装软件包时额外指定依赖的版本，例如 `^cmake@3.19.1` 。
- 解决方法三：在配置文件 [packages.yaml](https://spack.readthedocs.io/en/latest/build_settings.html#build-settings) 中设置某个版本为优先。
:::

### 在超算上使用Spack

当用户在超算上做开发时，可能需要安装有较多依赖的软件。手动管理这些依赖是非常麻烦的，此时我们可以在超算上配置 Spack，这不仅可以让我们快速批量安装软件，同时能利用实验室集群上已有的配置文件、软件包源码达到节省时间的目的。
Spack 安装的软件默认使用 RPATH（可关闭），实验室集群上的公共软件包不能直接拷贝到超算，需要重新编译。如果要交叉编译后直接拷贝到超算，注意取消 RPATH。

为了在超算上用 Spack 安装软件包，用户需要准备以下数据：

- Spack 的 git 仓库，从官网下载或直接从实验室集群上拷贝均可；
- 实验室集群的 Spack mirror，位于 `/apps/sources/spack`；
- 实验室集群的 Spack repo，位于 `/apps/spack_repo`。

拷贝数据到超算后，参考实验室集群文档中关于 Spack 的说明、公共 Spack 的配置（config.yaml、packages.yaml 等配置文件）来配置用户级 Spack，然后使用 Spack 安装软件即可。如果需要安装的软件在集群的 Spack mirror 中没有源代码，用户可以自行下载。

实验室集群的公共 Spack 配置文件可以在加载公共 Spack 环境后用命令查看：

```bash
# 打印config.yaml文件中的配置
$ spack config --scope site get config

# 查看config.yaml文件
$ spack config --scope site edit config
```

## 安装或删除软件包

参考：

- [Installing and uninstalling](https://spack.readthedocs.io/en/latest/basic_usage.html#installing-and-uninstalling)
- [Dependency types](https://spack.readthedocs.io/en/latest/packaging_guide.html#dependency-types)

安装或删除软件包的相关命令有：

- `spack list`：查看可安装的软件包
- `spack spec`：查看软件包的spec，包括编译选项、依赖项等
- `spack install`：安装软件包
- `spack uninstall`：解除安装（删除）
- `spack dependents`：列出依赖于某个包的软件包
- `spack gc`：垃圾回收，清理依赖项
- `spack mark`：标记软件包
- `spack clean`：清理build临时文件、下载的源文件

Spack：

- 用户级

配置好用户级 Spack并连接到集群Spack后，我们可以在本地安装自己需要的软件包。安装软件的一般流程如下

- 检查软件包是否存在
- 确认软件包的版本、编译选项
- 确认软件包的依赖项
- 安装软件包
- 清理依赖
- 删除软件包（若不再使用）

假设我们要用集群 Spack 的 `gcc` 来安装一个低版本 `cmake`，演示如下

```bash
## 检查软件包是否存在，若不存在，可考虑spack create来创建
## spack list支持通配符，传参时用引号引起来，如'*make'
$ spack list cmake

## 确认软件包的版本、编译选项
$ spack info cmake

## 查看软件包的完整spec，为已安装的软件包显示特殊标记
$ spack spec -It cmake@3.15.0 %gcc@10.2.0

## 安装软件包
$ spack install cmake@3.15.0 %gcc@10.2.0

## 清理运行时不需要的依赖项，主要是仅用于build的工具
$ spack gc

## 删除已安装的软件包
$ spack uninstall cmake@3.15.0

## 清理build产生的临时文件、下载的源文件（源文件可重复利用，不建议清除）
$ spack clean
$ spack clean -d
```

`spack gc`可清理的主要是 build-time 依赖和 test 依赖，它们不会链接到安装的软件包中，也不会在运行时被调用。

一个软件包的依赖有四种类型：build、link、run、test。使用命令可以看到所有依赖对应的类型：

```bash
$ spack spec -t cmake
```

除了特定类型的依赖不会被清理，我们也可以手动标记软件包，让GC不要清理：

```bash
$ spack mark -e ncurse
```

`spack gc` 和 `spack uninstall` 都会考虑依赖项。使用 `spack uninstall` 时，如果要删除的包是其他某个软件包的依赖，Spack会给出提示。我们也可以事先用命令确认一下一个软件包到底被哪些软件包使用着。

```bash
## 列出已安装的软件包中依赖于zlib的
## 一定要带上参数-i限制范围在已安装的软件包，否则会搜索所有可安装的软件包
$ spack dependents -i zlib
```

:::info 仅安装依赖
`spack install` 默认会安装软件包及其依赖。如果用户需要的只是依赖项，希望自己编译特定的程序，可用参数 `--only` 来指定：

```bash
$ spack install --only dependencies petsc
```

`spack load` 也有同样的参数用于仅加载依赖项：

```bash
$ spack load --only dependencies petsc
```
:::

## 让Spack使用外部软件包

参考：

- [External packages](https://spack.readthedocs.io/en/latest/build_settings.html#external-packages)

相关命令：

- `spack config`
- `spack install`

Spack：

- 用户级

Spack很擅长编译安装软件包，我们通常不需要关心装一个东西需要多少依赖，也不用关心一个依赖是不是反复被 gc 又反复被 build，完全可以全部交给Spack。

不过我们也可能会有不需要Spack来安装的、已经存在的软件包。比如，集群上的默认 `gcc` 和 `slurm` 都在系统路径里，不需要Spack来安装，只需要Spack能识别它们，把它们当成一个普通的软件包来处理就行。

在这种情况下，我们可以使用 *external packages*，将已经存在的软件定义在 `externals` 中，并且禁止Spack重新安装它们。

```bash
## 假设我们已经在/apps/software/Boost/底下安装了boost，想放在Spack里使用
## 编辑配置文件如下
$ spack config edit packages

packages.yaml
  1 packages:
  2   boost:
  3     buildable: false
  4     externals:
  5     - spec: boost@1.70.0-system
  6       prefix: /apps/software/Boost/1.70.0-gompi-2019a/

## 添加这个外部软件包到Spack
$ spack install boost@1.70.0-system

## 像普通Spack软件包一样使用
$ spack load boost@1.70.0-system
```

在这个例子中，我们在配置文件里增加了一个外部软件包，指定了它的名字、版本和路径。同时，我们将 `buildable` 设置为 `false`，禁止Spack安装其他版本的 `boost`，仅使用我们自己提供的版本。

:::tip 集群的外部软件包配置
集群的公共Spack配置了许多外部软件包，用户可以参考该配置文件来写自己的配置。

路径：`/apps/spack/etc/spack/packages.yaml`
:::

:::info 外部软件包的依赖
外部软件包可能是由其他包管理软件安装的，也可能是由用户手动编译安装的，它们也有自己的依赖。

比如，编译安装 `openmpi` 时，可能会依赖于某个路径下的 `hwloc`。在添加该 `openmpi` 为Spack外部软件包时，一定要尽量让编译的 `openmpi` 使用 RPATH，即把依赖的路径硬编码在二进制文件中。否则，在加载时很可能被动态链接到其他版本的 `hwloc`，产生不易发现的错误。
:::

:::info 实验室集群上软件包的路径
用户为Spack配置外部软件包时，可能会涉及多个分散的软件安装路径。主要的路径和所在节点列在这里以供参考

- `$HOME`：位于登录节点，用户可能有自己安装的软件；
- `$HOME/data`：位于数据节点，用户可能有自己安装的软件；
- `/opt`：位于登录节点，存放的多是手动安装的软件；
- `/apps/software`：位于软件安装节点，存放的是由EasyBuild安装或手动安装的软件；
- `/apps/spack/opt/spack`：位于软件安装节点，存放的是由公共Spack安装的软件；

:::

## 自定义软件包

:::info
详细说明请参考Spack文档的教程。
:::

参考：

- [Package creation tutorial](https://spack-tutorial.readthedocs.io/en/latest/tutorial_packaging.html)

- [Packaging guide](https://spack.readthedocs.io/en/latest/packaging_guide.html)

相关命令：

- `spack create`：创建软件包的配置文件
- `spack edit`：编辑软件包的配置文件
- `spack cd`：切到上一次的软件包build目录
- `spack build-env`：手动build软件包

Spack：

- 用户级

Spack可安装的每个软件包都有相应的Python配置文件，每个包都是Spack定义的某个类的实例。目前，Spack内置了5000多个软件包（0.16），大多是常用的开发工具、数值计算软件，不过这并不能完全满足我们的需求。

当我们使用 `spack list` 找不到想要的软件包时，我们可以自己写配置文件。一般流程如下：

```bash
## 根据软件包的下载地址，提取名称、版本等信息自动生成配置文件草稿
$ spack create https://url/to/package

## 配置文件在生成后会自动被打开，若没有打开，可以使用edit命令
$ spack edit <package name>

## 调整配置文件后，使用Spack安装该软件包
$ spack install <package name>

## 如果安装失败，可以切换到刚刚的build目录手动处理
$ spack cd <package name>

## 手动build
$ spack build-env <package name> bash

## 也可以直接使用make等工具
$ make

## 反复调整配置文件直到能够成功安装
## spack install <package name>
```
