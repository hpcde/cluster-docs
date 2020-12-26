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
- 使用新安装的软件包

本文涉及的所有内容基本都包含在实验室集群文档和 Spack 官方文档中，因此不再专门给出链接。

<!--truncate-->

## 超算环境说明

为了便于叙述，我们假定超算的相关参数、环境如下：

| 参数名           | 值                                                           |
| ---------------- | ------------------------------------------------------------ |
| 名称             | S                                                            |
| 架构             | x86_64                                                       |
| 操作系统         | CentOS 7                                                     |
| 模块系统         | Environment Modules                                          |
| 作业调度系统     | Slurm                                                        |
| 已有模块         | `compiler/gcc/10.2.0`<br />`mpi/hpcx/2.5`<br />`tools/cmake/3.19.3` |

## 拷贝必要数据

按照实验室集群文档中的说明，我们在超算 S 上建立如下几个目录并拷贝相应数据：

- `~/public/spack`：存放 Spack 仓库
- `~/public/repos/spack`：Spack repo，存放我们自定义的软件包配置文件（`package.py`）
- `~/public/sources/spack`：Spack mirror，存放所有软件包的源代码
- `~/public/software/spack`：Spack 软件安装路径，最初为空目录
- `~/.spack`：Spack 配置文件、缓存路径，由 Spack 自动创建

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

:::note
使用 Spack 之前，最好确保系统上有 Python 3.x。
:::

## 修改配置文件中的路径

首先，我们要修改软件安装路径、mirror 路径和 repo 路径。

```bash
# 修改软件安装路径
$ spack config edit config

config:
  install_tree:
    root: ~/public/software/spack

# 增加优先搜索的 mirror 路径（针对不能联网的机器）
$ spack config edit mirrors

mirrors:
  cluster-public: file://~/public/sources/spack

# 增加优先搜索的 repo 路径
$ spack config edit repos

repos:
  - ~/public/repos/spack
```

## 添加编译器

超算 S 上有系统自带的编译器，位于 `/usr` 路径。其他编译器都由管理员安装在别的路径，要用 `module load` 加载。我们首先加载编译器，再让 Spack 来搜索。

```bash
# 加载超算上常用的编译器
$ module load compiler/gcc/10.2.0

# 查找编译器并添加到配置文件
$ spack compiler find

# 清空环境，防止干扰后续操作
$ module purge
```

执行完成后，应该会有至少一个编译器被添加到 `compilers.yaml` 文件中，我们可以去掉系统自带的低版本编译器，只保留刚刚加载的那个。

超算 S 上的编译器可能需要一些额外的环境变量、flags 之类，我们有必要检查一下原本的模块文件。

```bash
$ module show compiler/gcc/10.2.0
```

若的确存在环境变量、flags，我们要把它们添加到 `compilers.yaml` 的`environment` 和 `flags` 这两个字典中。

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

packages:
  gcc:
    buildable: false
    externals:
    - spec: gcc@10.2.0
      modules:
      - compiler/gcc/10.2.0
  mpi:
    buildable: false
  hpcx:
    buildable: false
    externals:
    - spec: hpcx@2.5%gcc@10.2.0
      modules:
      - compiler/gcc/10.2.0
      - mpi/hpcx/2.5
  cmake:
    buildable: false
    externals:
    - spec: cmake@3.19.3%gcc@10.2.0
      modules:
      - tools/cmake/3.19.3
  gettext:
    buildable: false
    externals:
    - spec: gettext@system
      prefix: /usr
  curl:
    buildable: false
    externals:
    - spec: curl@system
      prefix: /usr
  numactl:
    buildable: false
    externals:
    - spec: numactl@system
      prefix: /usr
  autoconf:
    buildable: false
    externals:
    - spec: autoconf@system
      prefix: /usr
  automake:
    buildable: false
    externals:
    - spec: automake@system
      prefix: /usr
  libtool:
    buildable: false
    externals:
    - spec: libtool@system
      prefix: /usr
  perl:
    buildable: false
    externals:
    - spec: perl@system
      prefix: /usr
  openssl:
    buildable: false
    externals:
    - spec: openssl@system
      prefix: /usr
  openssh:
    buildable: false
    externals:
    - spec: openssh@system
      prefix: /usr
  binutils:
    buildable: false
    externals:
    - spec: binutils@system+ld+libiberty~nls
      prefix: /usr
```

从这个配置中我们可以看到，有一些是我们用 `modules` 配置的，其他都是我们从 `/usr` 路径里找的。在 `/usr` 路径里的这些都是一些我们没有必要自己安装，或者自己安装容易出错的软件，例如：

- `curl`、`autoconf`、`automake`、`libtool`、`perl` 都是比较基本的开发工具，不需要很新的版本；
- `gettext` 是用于本地化的软件，自己安装可能会有问题；
- `openssl` 是系统的 SSL 软件，自己安装可能会有问题；
- `binutils` 是基本的 GNU 开发工具，包括 `ld`、`ar` 等，自己安装可能会与超算上其他软件冲突。在这里为了便于叙述我们直接给定为 `system`，但通常我们应该给定版本号让其他软件包能正常安装。

:::tip 缺失的软件包

目前的 Spack 版本（0.16.0）不包含 `hpcx` 这个软件包，我们可以自定义一个简单的 `hpcx` 来用。详见本文后续说明。

:::

## 安装新的软件包

外部软件包配置完成后，我们已经具备安装新软件的所有条件了。接下来，我们用一个脚本来批量安装如下软件：

- `netcdf-cxx4@4.3.1`
- `petsc@3.14.1`
- `python@3.7.9`
- `py-numpy@1.19.4`
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
    py-numpy@1.19.4
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

modules:
  tcl:
    hash_length: 0
    verbose: True
    blacklist:
      - autoconf
      - automake
      - curl
      - gettext
      - libtool
      - numactl
      - openssl
      - perl
    all:
      conflict:
        - '{name}'
      environment:
        set:
          '{name}_ROOT': '{prefix}'
    projections:
      all:      '{name}/{version}-{compiler.name}-{compiler.version}'
      hdf5:     '{name}/{version}-{compiler.name}-{compiler.version}-{variants.mpi}'
    ^python:
      autoload: direct
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

模块文件的配置都完成后，我们就可以像加载超算 S 上已有的模块一样加载新安装的模块了。

## 加载模块

我们可以直接用 `module load` 加载模块，但这种方式可能会让加载的模块缺少一些依赖。Spack v0.16.0 还不能很好地处理模块的依赖关系，我们要么修改 Spack 的模块文件 `templates`，要么就让 Spack 为我们生成加载模块用的命令。这里我们选择后者。

```bash
# 生成一个脚本，其中会包含很多module load命令
$ echo '#!/bin/bash' > env.sh
$ spack module tcl loads -r petsc py-numpy >> env.sh
$ chmod u+x env.sh

# 加载petsc和py-numpy
$ source ./env.sh
```

## 附：自定义软件包

在添加外部软件包或者安装新软件包时，我们可能会遇到 Spack 不能识别的名称，比如 `hpcx`。遇到这种情况大致有以下几种处理方式：

- 它可能叫不同名字，我们可以使用 `spack list` 按通配符搜索；
- 在 Spack 文档、GitHub 或其他网站上搜索该软件包的配置文件，找到了可以直接用；
- 自己定义该软件包。

下面以 `hpcx` 为例演示如何自定义软件包并设置运行时的环境变量。假设超算 S 上安装的 `hpcx` 有如下目录结构：

```
hpcx/
|- gcc-10.2.0/
|- hcoll/
|- sharp/
`- ucx/
```

简单起见，我们把 `hpcx` 当作基于 `openmpi` 的另一种 `mpi`，并且不考虑它的诸如 `ucx`、`hcoll` 之类的依赖项。考虑到我们只想要一个外部软件包，不会直接 build 它，我们要做的事情变得很简单：

- 创建一个名为 `hpcx` 的 bundle package；
- 在 `package.py` 中，让 `hpcx` 依赖于 `openmpi`，并且提供 `mpi`；
- 在 `package.py` 中，设置 build、run 等各阶段所用的环境。

首先是创建，在创建时要指明 repo 的位置以便于统一管理：

```bash
$ spack create -r ~/public/repos/spack/ -t bundle -n hpcx
```

接着修改 `package.py`：

```python
from spack import *

class Hpcx(BundlePackage):
    """Mellanox HPC-X ScalableHPC Software Toolkit"""
    homepage = "https://www.mellanox.com/products/hpc-x-toolkit"
    
    executables = ['^ompi_info$']
    
    version('2.4.1')

    provides('mpi')
    provides('mpi@:3.0', when='@2.0.0:')
    depends_on('openmpi')
    
    def setup_run_environment(self, env):
        import os

        # Set user environment manually.
        hpcx_home       = os.path.dirname(self.prefix)
        hpcx_mpi_dir    = self.prefix
        hpcx_oshmem_dir = self.prefix
        hpcx_hcoll_dir  = join_path(hpcx_home, 'hcoll')
        hpcx_sharp_dir  = join_path(hpcx_home, 'sharp')
        hpcx_ucx_dir    = join_path(hpcx_home, 'ucx')

        for d in [hpcx_hcoll_dir, hpcx_sharp_dir, hpcx_ucx_dir]:
            env.prepend_path('PATH',            join_path(d, 'bin'))
            env.prepend_path('CPATH',           join_path(d, 'include'))
            env.prepend_path('LIBRARY_PATH',    join_path(d, 'lib'))
            env.prepend_path('LD_LIBRARY_PATH', join_path(d, 'lib'))
            
        # Dependency directories
        env.set('HPCX_HCOLL_DIR', hpcx_hcoll_dir)
        env.set('HPCX_SHARP_DIR', hpcx_sharp_dir)
        env.set('HPCX_UCX_DIR',   hpcx_ucx_dir)

        # Home directories
        homes = ['HPCX_DIR', 'HPCX_HOME']
        for home in homes:
            env.set(home, hpcx_home)

        mpi_homes = ['HPCX_MPI_DIR', 'HPCX_MPI_DIR', 'OMPI_HOME', 'MPI_HOME']
        for mpi_home in mpi_homes:
            env.set(mpi_home, hpcx_mpi_dir)

        oshmem_homes = ['HPCX_OSHMEM_DIR', 'OSHMEM_HOME', 'SHMEM_HOME']
        for oshmem_home in oshmem_homes:
            env.set(oshmem_home, hpcx_oshmem_dir)

        # Because MPI is both a runtime and a compiler, we have to setup the
        # compiler components as part of the run environment.
        env.set('MPICC',  join_path(self.prefix.bin, 'mpicc'))
        env.set('MPICXX', join_path(self.prefix.bin, 'mpic++'))
        env.set('MPIF77', join_path(self.prefix.bin, 'mpif77'))
        env.set('MPIF90', join_path(self.prefix.bin, 'mpif90'))

    def setup_dependent_build_environment(self, env, dependent_spec):
        # Duplicate environment variables to avoid Spack warnings.
        env.set('MPICC',  join_path(self.prefix.bin, 'mpicc'))
        env.set('MPICXX', join_path(self.prefix.bin, 'mpic++'))
        env.set('MPIF77', join_path(self.prefix.bin, 'mpif77'))
        env.set('MPIF90', join_path(self.prefix.bin, 'mpif90'))

        # Use the spack compiler wrappers under MPI
        env.set('OMPI_CC',  spack_cc)
        env.set('OMPI_CXX', spack_cxx)
        env.set('OMPI_FC',  spack_fc)
        env.set('OMPI_F77', spack_f77)

        # See https://www.open-mpi.org/faq/?category=building#installdirs
        for suffix in ['PREFIX', 'EXEC_PREFIX', 'BINDIR', 'SBINDIR',
                       'LIBEXECDIR', 'DATAROOTDIR', 'DATADIR', 'SYSCONFDIR',
                       'SHAREDSTATEDIR', 'LOCALSTATEDIR', 'LIBDIR',
                       'INCLUDEDIR', 'INFODIR', 'MANDIR', 'PKGDATADIR',
                       'PKGLIBDIR', 'PKGINCLUDEDIR']:
            env.unset('OPAL_%s' % suffix)

    def setup_dependent_package(self, module, dependent_spec):
        self.spec.mpicc  = join_path(self.prefix.bin, 'mpicc')
        self.spec.mpicxx = join_path(self.prefix.bin, 'mpic++')
        self.spec.mpifc  = join_path(self.prefix.bin, 'mpif90')
        self.spec.mpif77 = join_path(self.prefix.bin, 'mpif77')
        self.spec.mpicxx_shared_libs = [
            join_path(self.prefix.lib, 'libmpi_cxx.{0}'.format(dso_suffix)),
            join_path(self.prefix.lib, 'libmpi.{0}'.format(dso_suffix))
        ]
```

在这个配置文件中，我们增加了一些语句让 `hpcx` 能像 `openmpi` 一样被使用。其中：

- `executables` 用于提供可执行文件让 Spack 能够识别；
- `provides` 用于提供 virtual package 给其他软件包使用；
- `env` 是表示用户环境的对象，可以操作环境变量；
- `setup_run_environment` 是设置 runtime 环境的方法，在加载、卸载 `hpcx` 时会被执行；
- `setup_dependent_build_environment` 是设置 build-time 环境的方法，会影响依赖于 `hpcx` 的软件包；
- `setup_dependent_package` 也是设置 build-time 环境的方法，影响依赖于 `hpcx` 的软件包。

在 `setup_run_environment` 中我们设置了很多环境变量，如果还有其他与超算 S 网络相关的环境需要设置，也可以添加在该方法中。

:::note
这里配置的 `hpcx` 是给外部软件包使用的，所以里面没有给定其他依赖项。
:::