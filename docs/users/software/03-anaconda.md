---
id: anaconda
title: Anaconda - Python包管理
---

Anaconda 是 Python 的一个发行版。它可以创建并管理许多虚拟环境，在每个虚拟环境中的 Python 版本、依赖包版本都可以完全不同。相比于用 pip 安装 Python 包，使用 Anaconda 更加方便。

当然，Anaconda 包括的依赖项的范围其实是很广的，例如 qt, swig 这些工具都作为依赖项供用户安装。实验室集群上安装了 Anaconda3。使用 Anaconda 的详细方法见官网 

- [Anaconda User Guide](https://docs.anaconda.com/anaconda/user-guide/)
- [Conda User Guide](https://conda.io/projects/conda/en/latest/user-guide/index.html)

## 快速入门

要使用 Anaconda，请先加载：

```
$ ml Anaconda3
```

以下的基本操作可以帮助你快速上手。

```bash
 # 查看安装信息，查看安装路径、配置路径
$ conda info
 # 查看可用的环境（包括系统的和用户自己的）
$ conda env list
 # 创建名为 py35 的环境并安装 Python 3.7
$ conda create --name py37 python=3.7
 # 克隆已有的环境 base，创建新环境名为 py37
$ conda create --clone base --name py37
 # 激活一个环境，随后的 Python 及其依赖项版本都是这个环境中的
$ source activate py37
 # 反激活（退出）一个环境
$ source deactivate py37
 # 列出当前激活的环境中所有安装的包
$ conda list
 # 查找可安装的包
$ conda search PACKAGENAME
 # 安装一些包到当前激活的环境中，可以指定版本
$ conda install numpy=1.11              # 1.11.0, 1.11.1, 1.11.2 等
$ conda install numpy==1.11             # 精确指定为 1.11.0
$ conda install "numpy>=1.11"           # 1.11.0 或更高版本
$ conda install "numpy>=1.8,<2"         # 1.8, 1.9 或 2.0
$ conda install "numpy=1.11.1|1.11.3"   # 1.11.1 或 1.11.3
 # 更新当前已激活环境中的包
$ conda update numpy
 # 移除当前已激活环境中的包
$ conda remove --name numpy
 # 移除一个环境
$ conda env remove --name py37
```

## 占用空间

创建的 Anaconda 环境会占用数百 MB 甚至更多的磁盘空间。安装依赖项时下载的包也会占用上 GB 的空间，它们都存放在你的家目录下

```bash
$ ls ~.conda/pkgs
```

使用以下命令可以清理：

```bash
$ conda clean -a
```

或者直接把存放包的目录清理：

```bash
$ conda clean -f
```

## 在 SLURM 中使用 Anaconda

这里仅给出一点说明，关于 SLURM 的用法请参考下一章：[使用计算资源 - SLURM](../slurm/01-slurm-intro.md)

提交脚本时，如果用户当前的环境中没有加载 Anaconda，那就要在脚本中加载 Anaconda。提交脚本后，如果  SLURM 不能识别`activate`命令，则可以写绝对路径：

```bash
#!/bin/sh
#SBATCH -N 1
...
ml Anaconda3
source /apps/software/Core/Anaconda3/5.3.0/bin/activate py37
python --version
```
