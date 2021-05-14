---
id: mpi-omp
title: 提交 OpenMP/MPI 作业
---

这一小节，我们用几个实例来演示如何提交 OpenMP、MPI 以及 MPI+OpenMP 作业，以及如何设置简单的绑定/亲和性。要注意的是，计算资源的单位（CPU、核、内存）是与机器和 Slurm 配置相关的，下面例子中的方式不一定适用于其他集群，应该具体问题具体分析。

为了方便，我们统一使用 `sbatch`，例子中只给出脚本文件和相应的解释。所有实例都在分区 *Vhagar* 上完成。*Vhagar* 分区的节点拥有2个6核处理器，每个核支持超线程执行，共计 24 CPUs。

:::tip 进程映射和绑定

我们有时会需要调整进程与硬件之间的映射和绑定/亲和性。
*映射（mapping）*就是将进程对应到相应级别、数量的计算资源；*绑定（binding）*就是不让操作系统把进程调度到其他硬件上。
控制映射和绑定最简单的方法是使用 `mpirun` 或者 `srun` 提供的参数。例如：

- `mpirun --map-by core` 指明每个进程都应该映射到一个核心，不多不少；
- `mpirun --bind-to core` 则指明进程应该绑定到核心，不能移动。

具体如何使用映射和绑定，要根据具体情况来分析，参数的取值和意义请参考 `mpirun` 和 `srun` 的手册。
:::

## 运行 OpenMP 程序

OpenMP 并行程序执行时需要知道线程数量。对于 Slurm 命令来说，默认亲和性为 `--cpu-bind=none`，此时 OpenMP 通常能正确使用 24 CPUs。
若 OpenMP 无法得到正确的线程数量，或者线程绑定有问题，我们就要手动设置环境变量。

提交作业时我们通过 Slurm 参数或者 shell 命令来设置环境变量 `OMP_NUM_THREADS`的值：

- Slurm命令的 `--export` 参数；
- shell的 `export` 命令。

除了 `OMP_NUM_THREADS`，OpenMP 还有许多其他的环境变量，它们会随 OpenMP 版本变化。其中比较常用的是控制线程亲和性（Thread Affinity）的环境变量，例如 `OMP_PROC_BIND` 和 `OMP_PLACES`。详细用法可以参考 OpenMP 手册。

测试程序 `compute_pi_omp` 使用简单的数值积分（求和）计算圆周率，每个 OpenMP 线程完成一部分计算，最终使用归约得到所求的值。

### 编译

编译的工作也可以提交到计算节点，因为计算节点和登录节点的软件环境是一样的。

```bash
#!/bin/sh
#SBATCH -J compile
#SBATCH -p Vhagar
#SBATCH -n 1

## 用Spack加载编译器
spack load gompi

## 或用module加载编译器
#module load gompi

## 编译源代码
gcc -fopenmp compute_pi_omp.c -o compute_pi_omp
```

### 使用单节点的所有逻辑核心

在下面的例子中，关键是要保证申请到节点中的所有 CPU，我们用 `-c 24` 来完成，除此之外也可以用其他方式来独占计算资源。

参数说明：

- `-N 1`：需要的节点数为 1；
- `-n 1`：需要的任务（进程）总数为 1；
- `-c 24`：需要每任务（进程）可用 CPU 数为 24；
- `--cpu-bind=none`：取消进程绑定。

```bash
#!/bin/sh
#SBATCH -J omp-N1t24
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24

srun ./compute_pi_omp

# 如果线程绑定有问题，可以尝试手动指定OpenMP线程数
# 或者手动指定--cpu-bind
# export OMP_NUM_THREADS=24
# srun --cpu-bind=none ./compute_pi_omp
```

### 使用单节点的所有物理核心

和上面的例子不同，在这里我们希望每个线程都独占物理核心，而不是逻辑核心。这可以通过设置 OpenMP 环境变量来完成。
如果实际运行时发现线程并没有很好地绑定到物理核心，可以使用其他环境变量，例如 `OMP_PLACES=cores`。

参数说明：

- `-N 1`：需要的节点数为 1；
- `-n 1`：需要的任务（进程）总数为 1；
- `-c 24`：需要每任务（进程）可用 CPU 数为 24；
- `OMP_NUM_THREADS=12`：指定 OpenMP 可用的线程数为 12。

```bash
#!/bin/sh
#SBATCH -J omp-N1t12
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24

# 设置OpenMP线程数为12
export OMP_NUM_THREADS=12

srun ./compute_pi_omp
```

:::note
在具体问题中，用超线程和不用超线程取决于程序是怎么写的，使用超线程不一定会缩短计算时间。用户请根据具体程序的需求来申请资源。
:::

### 常见问题：使用多节点执行没有 MPI 的程序

下面的例子使用多个节点运行 OpenMP 程序，这通常是**错误的**。
因为该程序没有涉及任何进程间的同步，让 Slurm 使用过多的资源只会简单地把该程序同时执行多次而已。

参数说明：

- `-N 1`：需要的节点数为 1；
- `-n 2`：需要的任务（进程）总数为 2；
- `-c 12`：需要每任务（进程）可用 CPU 数为 12。

```bash
#!/bin/sh
#SBATCH -J omp-N1p2t12
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12

srun ./compute_pi_omp
```

## 运行 MPI 程序

目前，集群上安装了三种不同 MPI 实现：MPICH、OpenMPI 和 Intel MPI。使用 MPICH 时，既可以用 `mpirun` 也可以用 `srun` 来执行你的程序；使用 Intel MPI 时，暂时只能用 `mpirun`或 `mpiexec`。

MPI 并行程序执行时至少需要知道进程数量，这通常会由 Slurm 自动加上，不需要我们添加额外的参数。指定进程数量的方式通常是：

- Slurm 命令的 `-N`、`-n` 等参数，详细指明各节点的进程数量；
- mpirun 的 `-n/-np` 参数，指明总进程数量，通常由 Slurm 来管理。

:::note MPI 版本
用户可以用多种 MPI 版本（性能可能有区别）、多种提交命令来提交作业。本节中，示例均由 OpenMPI 完成。
:::

测试程序 `compute_pi_mpi` 使用简单的数值积分（求和）计算圆周率，每个 MPI 进程完成一部分计算，最终使用归约得到所求的值。

### 编译

为了方便我们使用 MPI wrapper，也就是 `mpicc`、`mpicxx` 等可执行文件。

```bash
#!/bin/sh
#SBATCH -J compile
#SBATCH -p Vhagar
#SBATCH -n 1

## 用Spack加载编译器
spack load gompi

## 或用module加载编译器
#module load gompi

## 编译源代码
mpicc compute_pi_mpi.c -o compute_pi_mpi
```

### 使用单节点的所有逻辑核心

进程映射到硬件线程是最简单的情况，所有 CPU 都被占用，Slurm 通常会处理好进程映射和绑定，不需要我们指定任何额外的参数。

参数说明：

- `-N 1`：需要的节点数为 1；
- `-n 24`：需要的任务（进程）总数为 24，默认每任务可用 CPU 数为 1。

```bash
#!/bin/sh
#SBATCH -J mpi-N1p24
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 24

## 加载编译器
spack load gompi
#module load gompi

## 不给定-n参数，交给Slurm管理
mpirun ./compute_pi_mpi

## 或者指定进程映射
#mpirun --map-by hwthread ./compute_pi_mpi

## 或者使用srun，不指定参数
#srun ./compute_pi_mpi
```

### 使用单节点的所有逻辑核心

和 OpenMP 的例子类似，我们也可以要求进程映射到物理核心，这需要用参数做一些限制。

参数说明：

- `-N 1`：需要的节点数为 1；
- `-n 12`：需要的任务（进程）总数为 12；
- `-c 2`：需要每任务（进程）可用的 CPU 数为 2，该参数可以省略；
- `--map-by core`：要求进程映射到 core。

```bash
#!/bin/sh
#SBATCH -J mpi-N1p12
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 12
#SBATCH -c 2

## 加载编译器
spack load gompi
#module load gompi

## 进程映射到物理核心
mpirun --map-by core ./compute_pi_mpi

## 或者使用srun，绑定进程到核心
#srun --cpu-bind=cores ./compute_pi_mpi
```

### 使用多节点

集群上的 MPI 不需要每个人自己安装和配置，也不需要设置复杂的参数就可以使用。因此，多节点和单节点的作业提交没有太大区别，只是参数的取值不同。

下面演示的是把进程映射到节点的情况。由于这个示例程序没有多线程，实际在单个节点上仍然只有一个 CPU 在转。进程映射到 node、socket、numa 通常可以和多线程搭配使用。

参数说明：

- `-N 4`：需要的节点数为 4；
- `-n 4`：需要的任务（进程）总数为 4，该参数可以省略。

```bash
#!/bin/sh
#SBATCH -J mpi-N4p4
#SBATCH -p Vhagar
#SBATCH -N 4
#SBATCH -n 4
## --ntasks-per-node=1可以替换-n 4

## 加载编译器
spack load gompi
#module load gompi

mpirun ./compute_pi_mpi
```

:::caution
如果在使用多节点时遇到 TCP 网络不通的问题，可以给 `mpirun` 加上参数 `-mca btl_tcp_if_include 172.16.0.0/24`。

集群上各版本 MPI 的配置可能不完全相同。如果 `srun` 无法正常使用，可以尝试加上参数 `--mpi=pmi`、`--mpi=pmi2` 或 `--mpi=pmix`。
:::

## 运行 MPI+OpenMP 混合程序

测试程序 `compute_pi_hybrid` 在 `compute_pi_mpi` 的基础上增加了 OpenMP 指导语句，让核心的循环被多个线程同时执行，最后归约得到该进程的值，再归约得到最终结果。

在提交 MPI+OpenMP 混合程序时，进程绑定通常可以设置为 `none`，否则容易把一堆线程都绑到一起。

### 编译

```bash
#!/bin/sh
#SBATCH -J compile
#SBATCH -p Vhagar
#SBATCH -n 1

## 用Spack加载编译器
spack load gompi

## 或用module加载编译器
#module load gompi

## 编译源代码
mpicc -fopenmp compute_pi_hybrid.c -o compute_pi_hybrid
```

### 使用单节点

下面的例子尝试在每个节点上运行2个进程，并且要求进程映射到 socket，让OpenMP 在每个 socket 上起12个线程。

参数说明：

- `-N 1`：需要的节点数为 1；
- `-n 2`：需要的任务（进程）总数为 2；
- `-c 12`：需要每任务（进程）可用的 CPU 数为 12；
- `OMP_NUM_THREADS=12`：指定 OpenMP 可用的线程数为 12；
- `--map-by socket`：要求进程映射到 socket，该参数通常可以省略。

```bash
#!/bin/sh
#SBATCH -J hybrid-N1p2t12
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12

## 加载编译器
spack load gompi
#module load gompi

## 也可以将该环境变量作为参数-x OMP_NUM_THREADS=12传给mpirun
export OMP_NUM_THREADS=12

## --map-by socket通常是默认值
mpirun --map-by socket --bind-to none ./compute_pi_hybrid
```

### 使用多节点

下面的例子演示在多节点上运行 MPI+OpenMP 混合程序，并尝试把节点上的所有线程都利用上。

参数说明：

- `-N 4`：需要的节点数为 4；
- `-n 4`：需要的任务（进程）总数为 4；
- `-c 24`：需要每任务（进程）可用的 CPU 数为 24；
- `--map-by node`：要求进程映射到 node，该参数可以省略。

```bash
#!/bin/sh
#SBATCH -J hybrid-N4p4t24
#SBATCH -p Vhagar
#SBATCH -N 4
#SBATCH -n 4
#SBATCH -c 24

## 加载编译器
spack load gompi
#module load gompi

## --map-by node可以省略，交给Slurm处理
mpirun --map-by node --bind-to none ./compute_pi_hybrid
```

:::caution
在该例子中，每节点只有一个任务，因此 `-n 4` 可能会被用户省略。
但要注意，当 `-c` 要求的 CPU 数量少于节点拥有的 CPU 数量时，省略 `-n` 会让 Slurm 尽量分配较少的节点给用户。

具体说明见文档中 Slurm 的基本用法部分。
:::
