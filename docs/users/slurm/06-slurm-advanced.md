---
id: advanced
title: 高级用法
---

向SLURM提交作业时，可使用的参数非常多。使用`sbatch`提交脚本时，脚本本身也是用shell语言写的（如bash），我们可以多利用shell语言的语法来完成自己的目标。

## 作业组

参考：[Job Array Support](https://slurm.schedmd.com/job_array.html)

作业组（job array)能让用户以相同的参数值一次性提交大量作业，每个作业都可以单独输出。一个作业组有一个 ID，其中的每个作业又有自己的索引号（用户指定）。示例如下：

```
#!/bin/sh
#SBATCH -N 2 -n 4
#SBATCH --exclusive
#SBATCH --export=ALL,OMP_NUM_THREADS=12
#SBATCH -a 1,3,5,7

ml intel/2018a
mpirun ./my_prog
```
这个例子中，我们申请2个节点，希望在每个节点上运行2个进程，每个进程使用12个线程。`-a`或`--array`能让这个作业成为作业组，相当于同时提交多个作业。在这里，我们提交的作业组中包括4个作业，编号分别是`1,3,5,7`。这4个作业的参数完全相同，即申请的资源完全相同。如果有一个或多个作业的资源申请不下来，它会等待，其他的作业会先完成。

更常见的做法是，使用作业组之后，根据每个作业自己的编号来为程序设置输入参数，批量执行程序。

## 测试加速比

我们常常需要测试一个程序的加速比，即用不同数量的计算资源执行相同的程序。可以考虑使用异构作业，参考 [Heterogenous Job](https://slurm.schedmd.com/heterogeneous_jobs.html)。

## 任务/进程绑定

参考：[CPU Management](https://slurm.schedmd.com/cpu_management.html)

前面提到了进程映射和绑定。在分配了节点、处理器、核心之后，执行的任务（进程）可能会在不同处理器、核心之间切换。用户可以在提交作业时指定选项，让任务绑定到核、CPU 等。

```
#SBATCH --cpu-bind=cores
```

除此之外，OpenMPI/MPICH/IMPI 这些 MPI 实现也有自己的绑定语法。使用这些语法时，请参考官网或手册。

> 注：使用 `-B` 会自动启用绑定。

## Rosetta Stone

参考：[Rosetta Stone of Workload Managers](https://slurm.schedmd.com/rosetta.html)

PBS/Torque、Slurm、LSF、SGE 和 LoadLeveler 这几个调度和管理软件都有自己的命令和参数，它们的命令之间的对应关系在 Slurm 的文档中有说明，见参考链接。

例如，Slurm 用的 `sbatch` 和 `squeue` 分别对应 LSF 中的 `bsub` 和 `bjobs`。

除此之外，集群中安装了 PBS/Torque 插件，可以把 PBS/Torque 的脚本转换为 Slurm 的脚本格式。该插件的相关命令有 `pbs2sbatch`, `pbs2slurm`, `pbsenv2slurm`, `pbsnodes`。
