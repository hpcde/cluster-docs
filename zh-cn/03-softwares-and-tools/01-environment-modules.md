# 配置你的使用环境 - Lmod

Lmod 是一个基于 Lua 的 Environment Module System 实现。它可以帮助用户

- 切换不同软件，如 Anaconda 和 Python；

- 切换同一软件的不同版本，如 GCC 7.3.0 和 GCC 8.2.0。

当用户想要使用软件时，只要运行相应命令来加载软件的环境变量即可。Lmod 提供了 `module`和`ml`命令供用户选择，让用户能够用命令来“加载”、”卸载“、查找已安装的软件。

> 注：目前，实验室的集群已经用 Lmod 代替了以前的基于 Tcl 的 Environment Module System。使用旧的 Module System 的用户请参考[旧模块的处理](#旧模块的处理)。

基本用法如下：

```bash
$ module spider             # 查看集群上所有可加载的软件
$ module avail              # 查看当前可加载的软件
$ module load Anaconda3     # 加载软件的环境变量
$ module list               # 查看已加载的软件
$ module unload Anaconda3   # 卸载软件的环境变量
```

或者，使用简化的命令：

```bash
$ ml spider             # 查看集群上所有可加载的软件
$ ml av                 # 查看当前可加载的软件
$ ml Anaconda3          # 加载软件的环境变量
$ ml                    # 查看已加载的软件
$ ml -Anaconda3         # 卸载软件的环境变量
```

> 注：如果不加载软件，用户使用的就是系统自带的软件，如 Python 2.7.5。

## 快速入门

```bash
$ man module                    # manpage
$ module help                   # help

$ module avail                  # 查看当前可加载的模块（软件）
$ module spider                 # 查看所有可加载的模块（软件）
$ module spider GCC             # 查看GCC有多少不同版本已安装在集群上
$ module spider GCC/8.2.0       # 查看模块的依赖关系
$ module load GCC/8.2.0         # 加载模块，从而能使用GCC/8.2.0
$ module list                   # 列出已加载的模块
$ module unload GCC/8.2.0       # 卸载模块
$ module key GCC                # 在模块名称和描述中查找关键字

$ module save [mymods]          # 保存已加载的模块到列表中
$ module savelist               # 查看已保存的加载方案
$ module restore [mymods]       # 恢复已保存的加载方案

$ ml                            # module命令的前端，单独调用相当于 module list
$ ml av                         # module avail
$ ml spider                     # module spider
$ ml GCC/8.2.0                  # module load GCC/8.2.0
$ ml -GCC/8.2.0                 # module unload GCC/8.2.0
$ ml -GCC/8.2.0 GCC/7.3.0       # module swap
```

以上只是命令的简单用法，更详细的用法参考 [User Guide for Lmod](https://lmod.readthedocs.io/en/latest/010_user.html)。

> 注：请注意`module avail`和`module spider`的区别，如果要快速查看当前可加载的软件，键入`module avail`后按`<TAB><TAB>`；如果要快速查看**所有**已安装的软件，键入`module spider`后按`<TAB><TAB>`。
>
> 注：多数情况下切换模块都不需要卸载之前加载的模块，例如，`ml GCC/7.3.0; ml GCC/8.2.0`。命令会自动切换相应的依赖项。

### 旧模块的处理

Environment Module System 的迁移并不影响旧的软件模块的使用。

旧的模块都转移到另一个路径了，因此无法直接用`module avail`命令看到。如果要使用旧的模块，请执行：

```
$ ml showlegacy
```

> 注：为防止模块冲突，尽量不要使用旧模块提供的科学计算相关的软件（如 GCC, OpenMPI, MPICH, PETSc）等。除此之外，其他手动安装的软件都可随意使用。

> 注：目前配置好的只有 bash，如果需要使用其他 shell 加载模块，请联系管理员。

旧模块提供的软件安装在`/opt`下，新模块提供的软件安装在`/apps`下。

预装的软件都以是特定的编译选项编译的，这些软件可能无法完全满足你的需求。如果需要额外的编译选项，或者需要额外的软件，请联系管理员。

**如果你的脚本中使用了 module load**

在你的脚本中使用的加载命令**很可能**不再起作用，例如`module load mpi/mpich/3.2`。如果加载失败，请检查自己的脚本，确保：

- 已经执行了`ml showlegacy`；
- 执行`ml spider mpi/mpich/3.2`命令，能找到`mpi/mpich/3.2`这个模块，或者，
- 执行`ml av`命令，能找到`mpi/mpich/3.2`这个模块。

## Lmod的特性

除了基本用法，Lmod 还提供了更为强大的功能，具体参考 [Lmod: A New Environment Module System](https://lmod.readthedocs.io/en/latest/index.html)。以下仅简单介绍一些对用户最有用的特性。

### 模块层次

编译科学计算软件的编译器版本众多，许多软件在特定编译器下能顺利通过，换作其他编译器就会相当棘手。Lmod 使用模块层次来处理这种软件间的依赖关系。用户可以用 `module avail`查看**当前**可加载的模块，因为模块文件所在的路径`$MODULEPATH`会在运行时被修改。例如：

```none
$ ml av
GCC/8.2.0-2.31.1
$ ml GCC/8.2.0-2.31.1
$ ml av
GCC/8.2.0-2.31.1 (L)    OpenMPI/3.1.3
```

当用户加载了 `GCC/8.2.0` 后，依赖它的软件就可以用命令看到了。如果未加载依赖项，直接加载 `OpenMPI/3.1.3` 会报错，除非在模块文件中加入了额外的配置。

```
$ ml purge
$ ml OpenMPI/3.1.3
Lmod has detected the following error: These module(s) exist but cannot be loaded as requested:
"OpenMPI/3.1.3"
	Try: "module spider OpenMPI/3.1.3" to see how to load the module(s).

$ ml spider OpenMPI/3.1.3
-----------------------------------------------------------
OpenMPI: OpenMPI/3.1.3
-----------------------------------------------------------
  Description:
  	The Open MPI Project is an open source MPI-3 implementation.
    
  You will need to load all module(s) on any one of the lines below before the "OpenMPI/3.1.3" module is available to load.
  
  	GCC/8.2.0-2.31.1
```

集群上有的软件是用同一编译器编译的。假设有4个模块： A (`GCC/6.4.0`)，B (`CMake/3.9.1`)，C (`CMake/3.10.2`)，D (`GCC/8.2.0`)。B 和 C 都依赖于 A。典型的用法如下。

- 用户想使用 B，必须加载 A：

```bash
$ ml CMake/3.9.1                  # 报错
$ ml GCC/6.4.0-2.28 CMake/3.9.1   # 成功加载
``` 

- 用户加载了 A 和 B后，想切换到 C：

```bash
$ ml GCC/6.4.0-2.28 CMake/3.9.1   # 成功加载
$ ml CMake/3.10.2                 # 成功切换
```

- 用户不想用 A 了，想切换到 D 编译器：

```bash
$ ml GCC/6.4.0-2.28 CMake/3.9.1   # 成功加载
$ ml GCC/8.2.0-2.31.1             # 成功切换

Inactive Modules:
  1) CMake/3.9.1

Due to MODULEPATH changes, the following have been reloaded:
  1) ncurses/6.0

The following have been reloaded with a version change:
  1) GCC/6.4.0-2.28 => GCC/8.2.0-2.31.1     2) GCCcore/6.4.0 => GCCcore/8.2.0     3) binutils/2.28 => binutils/2.31.1
```

> 注：从输出可以看到，`GCC/6.4.0` 依赖的模块都自动切换了版本；依赖于 `GCC/6.4.0` 的模块要么找到了对应的版本，要么进入 *Inactive* 状态。

### 工具链（推荐）

多个同时加载的模块构成了一个工具链（toolchain），工具链中的软件是有依赖关系的。使用工具链可以很方便地编译绝大多数的软件。加载工具链和卸载工具链可以帮助用户快速使用所需的编译器，而不用手动加载依赖项。

它的实现方式很简单，只要在模块文件中指明依赖关系，让 Lmod 自动加载/卸载依赖项就行。例如 `gompi/2019a`工具链中的依赖关系：

```lua
depends_on("GCC/8.2.0-2.31-1")
depends_on("OpenMPI/3.1.3")
```

再往底层，`GCC/8.2.0-2.31-1`又依赖于其他软件、库。加载工具链后，可以看到所有加载进来的模块：

```bash
$ ml gompi/2019a
$ ml
Currently loaded Modules:
  1) GCCcore/8.2.0      4) zlib/1.2.11      7) libxml2/2.9.8        10) OpenMPI/3.1.3
  2) binutils/2.31.1    5) numactl/2.0.12   8) libciaccess/0.14     11) gompi/2019a
  3) GCC/8.2.0-2.31-1   6) XZ/5.2.4         9) hwloc/1.11.11
```

卸载工具链时会把所有依赖项全部卸载。

```bash
$ ml -gompi/2019a
$ ml
No modules loaded
```

切换工具链时，对于同一系列的工具链，用户只需要加载新的就能让旧的自动切换（参考上一节的说明）；对于不同系列的工具链，最好使用切换命令。

```bash
$ ml gompi/2019a                  # 加载工具链
$ ml gompi/2019o                  # 切换到同一系列的另一工具链

The following have been reloaded with a version change:
  1) OpenMPI/3.1.3 => OpenMPI/4.0.0     3) hwloc/1.11.11 => hwloc/2.0.2
  2) gompi/2019a => gompi/2019o

$ ml -gompi/2019o intel/2019a     # 切换到不同系列的工具链
```

常用的 MPI 工具链和版本如下。

| 名称   | 包含的主要模块                          | 版本(MPI版本)                                             | 说明             |
| ------ | --------------------------------------- | ------------------------------------------------------------ | ---------------- |
| intel  | icc, ifort, imkl, impi                  | 2018a (2018.1)<br />2018b (2018.3)<br />***2019a***(2019.1) | Intel编译器      |
| gmpich | GCC, MPICH                              | 2016a (3.2)<br />***2017.08*** (3.2.1)<br /> | gcc编译的MPICH   |
| impich | icc, ifort, MPICH                       | ***2018o*** (3.2.1)                                          | icc编译的MPICH   |
| gompi  | GCC, OpenMPI                            | 1.5.16 (1.6.5)<br />2016b (1.10.3)<br />2018a (2.1.2)<br />2018b (3.1.1)<br />***2019a*** (3.1.3)<br />***2019o*** (4.0.0) | gcc编译的OpenMPI |
| iompi  | icc, ifort, OpenMPI                     | ***2019.01*** (3.1.3)                                        | icc编译的OpenMPI |
| foss   | GCC, OpenMPI, OpenBLAS, FFTW, ScaLAPACK | 2018a (2.1.2)<br />2018b (3.1.1)<br />***2019a*** (3.1.3)    | 包括数学库       |

有几点使用说明：

- 表中列出的所有 MPICH 都是 3.X.X 版本；
- 表中列出的 OpenMPI 涵盖 1.X.X, 2.X.X, 3.X.X, 4.X.X 四个大版本，请用户在使用时选择自己需要的版本；
- 在实验室集群上，用 intel 的工具链编译的程序可能比用 gnu 的要快，因此，在目前版本有效期内，推荐使用 intel/impich/iompi 这几个工具链。使用 foss/gompi/gmpich 要注意它们的优化级别；
- 对于一个工具链，如果你不确定要用什么版本，就用最新的，例如表中加粗字体的版本；如果不确定用哪类工具链，就选择 intel 或 foss。

### 保存加载的模块

用户在使用 Lmod 时，可以把已经加载的模块保存起来，便于下次使用：

```shell
$ ml GCC/8.2.0-2.31-1 OpenMPI/3.1.3
$ ml save mytools                       # 保存当前的加载配置

Saved current collection of modules to: "mytools"

$ ml savelist                           # 查看所有保存的加载配置
Named collection list:
  1) mytools

$ ml purge
$ ml restore mytools                    # 恢复一个已保存的加载配置

Restoring modules from user's mytools

$ ml disable mytools                    # 弃用一个已保存的加载配置
```
