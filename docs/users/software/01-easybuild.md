---
id: easybuild
title: EasyBuild - 软件安装工具
---

EasyBuild 是一个用于在超算上安装科学计算软件的框架，它与 Lmod 配合使用能够替代 Spack，但它目前的关注量远不如 Spack。
它的命令行工具、依赖项解析等方面都要稍逊于 Spack，但是它与 Environment Module 整合地非常好。
出于维护现有软件的目的，本节简要介绍 EasyBuild 的用法，并尝试将它与 Spack 做个简单对比。

:::caution
EasyBuild 安装的软件不好维护，相关配置文件也不容易迁到超算上使用，请尽量使用 Spack。
:::

## 基本概念

参考：

- [EasyBuild](https://easybuild.readthedocs.io/en/latest/)
- [Concepts and terminology](https://easybuild.readthedocs.io/en/latest/Concepts_and_Terminology.html)

EasyBuild 提供命令 `eb` 用于安装软件，每个具体的软件包都由两个文件定义：*Easyblock* 和*Easyconfig*。基本概念如下：

- [EasyBuild framework](https://github.com/easybuilders/easybuild-framework)：框架本身，由 Python 写成，包括面向 autotools、CMake 等各种工具的安装逻辑；

- [Easyblocks](https://github.com/easybuilders/easybuild-easyblocks)：每个软件包的安装逻辑，由 Python 写成；

- [Easyconfigs](https://github.com/easybuilders/easybuild-easyconfigs)：软件包具体版本的配置信息，纯文本；

- [Toolchains](https://easybuild.readthedocs.io/en/latest/Common-toolchains.html#common-toolchains)：预定义的软件包集合，如 `gompi`；

- [Extensions](https://easybuild.readthedocs.io/en/latest/Partial_installations.html#installing-additional-extensions-using-k-skip)：软件的额外包/插件，如 Python 包。

## 安装 EasyBuild

最简单的安装方式是使用 EasyBuild 提供的 bootstrapping 脚本。

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

使用 EasyBuild 安装软件的工作流如下：

- 搜索软件包；
- 确定工具链；
- 确定软件包版本、查看具体的依赖项；
- 安装软件包。

如果要安装的软件版本搜索不到，可以修改 Easyconfig 文本文件或使用命令行参数调整；如果要安装的软件名称不存在，需要增加 Easyblock。

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
各软件、工具链的版本需要完全匹配，如果某个版本没有对应的 Easyconfig 文件，解析会失败。例如，如果不存在 `GCC-10.2.0.eb`，下述命令就无法成功执行：

```bash
$ eb --software=OpenMPI,4.0.5 --try-toolchain=GCC,10.2.0
```

用户可以手写相应的 Easyconfig，然后使用参数 `-r` 把自定义 Easyconfig 的目录传给 `eb`。要注意的是，自定义 Easyconfig 中写的所有依赖项（事实上是整个依赖图中的每一项）都必须有对应的 Easyconfig。
:::

## 删除已安装的软件

在更新集群上的软件版本、清理不需要的软件时，我们都会删除一些已安装的软件。遗憾的是，截至版本 4.X.X，EasyBuild 并没有提供删除软件的方法。

要想删除之前用 EasyBuild 安装的软件，我们只能找出所有相关的目录和文件逐个删除。要删除的主要是模块文件路径和软件安装路径。模块文件路径就是 Lmod 看到的层次，比较容易找到。软件安装路径要麻烦一些。

### 搜索并删除安装路径

首先，要清楚安装路径的命名规则。命名规则有两种，一种是默认的，目录较少，另一种目录较多。默认情况下，安装路径中会包含以下内容：

`<name>/<version>-<toolchain>-<dependencies>`

如果采用的是目录较多的命名规则，就是把上述路径继续按 `toolchain`、`dependencies` 拆分创建新目录。

其次，要注意顶层目录的位置。有的软件以自己的名称为顶层目录，有的会放在别的目录下，这跟 EasyBuild 版本、具体的软件都有关系。例如

- `GCC/`：以自己名称为顶层目录
- `Core/GCC`：以 `Core/` 为顶层目录
- `MPI/GCC`：以 `MPI` 为顶层目录

顶层目录不是软件名的，通常是与 Lmod 对应，反映了模块的依赖关系。

了解 EasyBuild 的模块文件和安装路径的组织方式后，我们可以开始删除软件了。一个软件可能有很多依赖，我们要利用 `module` 命令查看依赖，因此在完全删除安装文件之前不要动模块文件。为了删除软件，首先可以用 `module show` 命令查看相应的模块文件，确认一下安装路径。如果是删除 `GCC` 或 `MPI` 等路径下的软件，通常可以一次性删除整个目录，因为它们的目录中可能会包含依赖于 `GCC` 或 `MPI` 的所有软件。

如果删除了 `module show` 命令显示的安装路径还有剩余的文件，可以通过 `find` 等命令搜索关键字。例如，若要删除 `GCC/6.4.0`，可以尝试搜索 `GCC-6.4.0`。

当所有文件都确认删除后，再次使用 `module show` 命令，根据命令返回的结果删除 modulefile。

### EasyBuild 相关数据的路径

类似于 Spack，EasyBuild 也有自己的路径用于存放各种数据。除了前面提到的 Lmod 和软件安装路径，还有配置文件、源代码的路径等。下面对 EasyBuild 相关数据所在位置做个简单总结，以便于维护现有安装。

- `/apps/ebfiles_repo`：已安装软件的 Easyconfigs 文件，相当于配置的备份，可通过参数 `-r` 传给 `eb` 搜索该路径
- `/apps/sources`：EasyBuild 的文件下载路径（`/apps/sources/spack`除外）
- `/apps/software`：EasyBuild 的安装路径（`/apps/software/spack`除外）
- `/apps/modulefiles`：EasyBuild 的 Lmod 模块文件路径

## EasyBuild 和 Spack 的对比

EasyBuild 和 Spack 的一个比较明显的区别是 EasyBuild 把软件包的具体配置放在了纯文本中。
Spack 的一个配置文件（`.py`）相当于 EasyBuild 的一个 Easyblock（`.py`）加上所有与它相关的 Easyconfig（`.eb`，纯文本）。

对于 Spack 来说，用户总是可以通过命令行参数来控制软件包的版本、依赖等信息；对于 EasyBuild 来说，主要依赖于文本文件，用命令行参数控制版本、依赖仍是试验性功能（v4），不太稳定。

|                  | EasyBuild                                                    | Spack                                                        |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **安装和删除**   | 一键安装，删除时需要找到所有路径、Lmod 模块文件逐个删除。    | 一键安装，一键删除。                                         |
| **软件包分类**   | 软件包按工具链组织，每个包都基于某个工具链编译，比如 GCC 就是一个工具链。 | 软件包按编译器组织，每个包都基于某个编译器。                 |
| **软件包定义**   | 由一个 Easyblock 和一个 Easyconfig 定义。自定义较为麻烦，很可能两个文件都要写，预定义的安装选项可由 `eb -a` 查看。 | 由一个 package.py 定义。                                     |
| **依赖项解析**   | 由 Easyblock 解析 Easyconfig 后生成软件包依赖项的具体版本信息，可以用命令 `eb --dry-run <package>` 看到； | 由*concretize*算法完成，可由软件包的配置文件控制。依赖图可以用命令 `spack spec -d <package>` 看到。 |
| **加载速度**     | 自身只有安装功能，加载功能由 Lmod 实现，速度很快。           | 自身的加载功能速度很慢，但可以为 Lmod 生成 modulefiles。     |
| **对Lmod的支持** | 与 Lmod 整合地很好，有许多相关选项可以调整 modulefile 的生成。 | 目前仅能简单地生成、删除、查询 modulefiles。                 |
