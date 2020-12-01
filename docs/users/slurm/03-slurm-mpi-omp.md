---
id: mpi-omp
title: 提交OpenMP/MPI作业
---

OpenMP并行程序执行时需要知道线程数量，提交作业时我们可以设置环境变量`OMP_NUM_THREADS`。通常可以利用SLURM参数或者shell的环境变量来完成：

- SLURM命令的`--export`参数；
- shell的`export`命令。

> **OpenMP的环境变量**
>
> 除了`OMP_NUM_THREADS`，OpenMP还有许多其他的环境变量，它们会随OpenMP版本变化。
>
> 其中比较常用的是控制线程亲和性（Thread Affinity）的环境变量，例如`OMP_PROC_BIND`和`OMP_PLACES`。详细用法可以参考OpenMP手册。

MPI并行程序执行时至少需要知道进程数量，这通常会由SLURM自动加上，不需要我们添加额外的参数。指定进程数量的方式通常是：

- SLURM命令的`-N`、`-n`等参数，详细指明各节点的进程数量；
- mpirun的`-n/-np`参数，指明总进程数量，通常由SLURM来管理。

> **进程映射和绑定**
>
> 我们有时会需要调整进程与硬件之间的映射和绑定/亲和性。映射就是将进程对应到相应级别、数量的计算资源；绑定就是不让操作系统把进程调度到其他硬件上。控制映射和绑定最简单的方法是使用`mpirun`或者`srun`提供的参数。例如，`mpirun --map-by core`指明每个进程都应该映射到一个核心，不多不少；`mpirun --bind-to core`则指明进程应该绑定到核心，不能移动。
>
> 具体如何使用映射和绑定，要根据具体情况来分析，参数的取值和意义请参考`mpirun`和`srun`的手册。

这一小节，我们用几个实例来演示如何提交 OpenMP/MPI 作业，以及如何设置简单的绑定/亲和性。要注意的是，计算资源的单位（CPU、核、内存）是与机器和SLURM配置相关的，下面例子中的方式不一定适用于其他集群，应该具体问题具体分析。

为了方便，我们统一使用`sbatch`，例子中只给出脚本文件。以下的所有实例都在分区*Vhagar*上完成。*Vhagar*分区的节点具有2个6核处理器，每个核支持超线程执行，共计24个可用于分配的CPU。

> 注：用户可以用多种 MPI 版本（性能可能有区别）、多种提交命令来提交 OpenMP/MPI 作业。本节中，示例均由 OpenMPI 完成。

## 运行OpenMP程序

测试程序 *omptest.c* 会申请数GB内存空间，初始化变量并对变量求和，求和的过程使用 OpenMP 完成。以下是示例。

**申请1个节点，1个进程，24个逻辑CPU**

在默认亲和性为`--cpu-bind=none`的情况下，OpenMP通常能正确使用24个CPU。否则，我们就需要设置环境变量。在下面的例子中，关键是要保证申请到节点中的所有CPU，我们用`-c 24`来完成，除此之外也可以用其他方式来独占计算资源。

```bash
#!/bin/sh
#SBATCH -J omptest1
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24

srun ./omptest

## 如果线程绑定有问题，可以尝试手动指定OpenMP线程数
## 或者手动指定--cpu-bind
# export OMP_NUM_THREADS=24
# srun --cpu-bind=none ./omptest
```

**申请1个节点，1个进程，24个逻辑CPU，但只起12个线程**

和上面的例子不同，在这里我们希望每个线程都独占物理核心，而不是逻辑核心。这可以通过设置OpenMP环境变量来完成。如果实际运行时发现线程并没有很好地绑定到物理核心，可以使用其他环境变量，例如`OMP_PLACES=cores`。

```bash
#!/bin/sh
#SBATCH -J omptest2
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24

export OMP_NUM_THREADS=12
srun ./omptest
```

**申请1个节点，2个进程，每进程12个逻辑CPU**

这通常是**错误的**。让SLURM使用过多的资源来执行没有多进程并行的程序，只会简单地把该程序同时执行多次而已。

```bash
#!/bin/sh
#SBATCH -J omptest3
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12

srun ./omptest
```

> 注：在具体问题中，用超线程和不用超线程取决于程序是怎么写的，使用超线程不一定会缩短计算时间。

## 运行MPI程序

测试程序 *computePI* 使用简单的数值积分（求和）计算圆周率，每个MPI进程完成一部分计算，最终使用归约得到所求的值。

首先我们要编译源代码，为了方便我们要使用MPI wrapper，也就是`mpicc`、`mpicxx`等可执行文件。编译的工作也可以提交到计算节点，因为计算节点和登录节点的软件环境是一样的。

```bash
## 加载编译器
ml gompi/2019a

## 编译源代码
mpicc -fopenmp computePI.c -o computePI
```

**在单节点上运行**

申请1个节点，24个进程，进程映射到硬件线程。这是最简单的情况，所有CPU都被占用，SLURM通常会处理好进程映射和绑定，不需要我们指定任何额外的参数。

```bash
#!/bin/sh
#SBATCH -J cpi-N1n24
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 24

ml gompi/2019a

## 不给定-n参数，交给SLURM管理
mpirun ./computePI

## 或者指定进程映射
#mpirun --map-by hwthread ./computePI

## 或者使用srun，不指定参数
#srun ./computePI
```

申请1个节点，12个进程，24个逻辑CPU，进程映射到物理核心。

```bash
#!/bin/sh
#SBATCH -J cpi-N1n12c2
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 12
#SBATCH -c 2

ml gompi/2019a

## 进程映射到物理核心
mpirun --map-by core ./computePI

## 或者使用srun，绑定进程到核心
#srun --cpu-bind=cores ./computePI
```

**在多节点上运行**

集群上的MPI不需要每个人自己安装配置，也不需要设置复杂的参数就可以使用。因此，多节点和单节点的作业提交没有太大区别，只是参数的取值不同。

> 如果在使用多节点时遇到TCP网络不通的问题，可以给`mpirun`加上参数`-mca btl_tcp_if_include 172.16.0.0/24`。
>
> 集群上MPI版本很多，配置可能不完全相同。如果`srun`无法正常使用，可以尝试加上参数`--mpi=pmi`、`--mpi=pmi2`或`--mpi=pmix`。

申请4个节点，每节点1个进程，进程映射到节点。由于这个示例程序没有多线程，实际在单个节点上仍然只有一个CPU在转。进程映射到node、socket、numa通常可以和多线程搭配使用。

```bash
#!/bin/sh
#SBATCH -J cpi-N4n4
#SBATCH -p Vhagar
#SBATCH -N 4
#SBATCH -n 4
## --ntasks-per-node=1可以替换-n 4

ml gompi/2019a
mpirun ./computePI
```

## 运行OpenMP+MPI混合程序

测试程序 *computePI-hybrid* 在 *computePI* 的基础上增加了 OpenMP 指导语句，让核心的循环被多个线程同时执行，最后归约得到该进程的值，再归约得到最终结果。

在提交OpenMP+MPI混合程序时，进程绑定通常都设置为`none`，否则容易把一堆线程都绑到一起。

**在单节点上运行**

申请1个节点，2个进程/任务，每进程12个CPU，进程映射到socket，让OpenMP在每个socket上起12个线程。

```bash
#!/bin/sh
#SBATCH -J cpi-hybrid-N1n2c12
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12

ml gompi/2019a

## 也可以将该环境变量作为参数-x OMP_NUM_THREADS=12传给mpirun
export OMP_NUM_THREADS=12

## --map-by socket通常是默认值
mpirun --map-by socket --bind-to none ./computePI
```

**在多节点上运行**

申请4个节点，每节点1个进程，每进程24个逻辑CPU，每个CPU都起一个线程。

```bash
#!/bin/sh
#SBATCH -J cpi-hybrid-N4n4c24
#SBATCH -p Vhagar
#SBATCH -N 4
#SBATCH -n 4
#SBATCH -c 24

ml gompi/2019a

## --map-by node可以省略，交给SLURM处理
mpirun --map-by node --bind-to none ./computePI
```
