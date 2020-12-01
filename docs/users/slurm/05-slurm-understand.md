---
id: understand
title: 关于SLURM的额外知识
---

前面的小节可以帮助我们快速上手，利用 SLURM 来执行自己的程序。这一节是参考材料，帮助大家理解 SLURM 的相关概念。本节的内容都摘自官方文档。如果对集群管理系统、作业调度系统已经有一些了解了，请忽略本节的内容，直接参考官方文档。

## Socket, Core, Thread

如下图所示，我们常说的**处理器(processor)**，在 Linux 和 SLURM 中对应于**socket**，即插处理器芯片的插槽；我们常说的**核(core)**，大部分情况下都指的是处理器芯片上的物理核心；我们常说的**线程(thread)**，对于 Linux 和 SLURM 这种管理系统来说就是**逻辑处理器(logical processor)**，或者叫逻辑核心、逻辑CPU，或者直接称为**CPU**。

![处理器相关概念](https://slurm.schedmd.com/mc_support.gif)

通过提交作业时给定的选项，我们可以精细地控制请求分配的资源数量。其中一个很有用的选项是 `-B`，它指明我们需要调度系统分配的 sockets, cores, threads 的数量。

使用这个选项之前，最好先确认一下要申请的节点是否能满足这个限制。比如，如果节点只有1个 socket，就无法指定2个。

```
-B, --extra-node-info=S[:C[:T]]            Expands to:
  --sockets-per-node=S   number of sockets per node to allocate
  --cores-per-socket=C   number of cores per socket to allocate
  --threads-per-core=T   number of threads per core to allocate
                each field can be 'min' or wildcard '*'

     Total cpus requested = (Nodes) x (S x C x T)
```

例如：

```bash
#SBATCH -n 4 -N 2
#SBATCH -B 2:6:2
```

这表明我们需要执行4个任务，请求2个节点，每节点2个处理器，每处理器6个核，每个核都超线程。在我们的机器配置下，这就相当于前几节里用其他选项达到的效果，例如

```bash
#SBATCH -n 4 -N 2 -c 6
#SBATCH --export=ALL,OMP_NUM_THREADS=12
```

> 注：使用 `-B` 选项代替其他选项时，要注意它会自动启用任务绑定。如果执行的程序不需要绑定，请参考手册。

## 可消耗的资源

参考：[Consumable Resources in Slurm](https://slurm.schedmd.com/cons_res.html)

在 SLURM 中，处理器、内存、磁盘等都是节点拥有的资源，它们可以分配给作业，即被作业消耗了。在我们提交的所有脚本中，会指定一个或多个资源，请求调度系统分配资源给作业使用。这里需要注意的是**CPU**。

对于 SLURM 来说，不同架构、系统的 CPU 有不同含义。原文如下：

> CPU (CR_CPU): CPU as a consumable resource.
> - No notion of sockets, cores, or threads.
> - On a multi-core system CPUs will be cores.
> - On a multi-core/hyperthread system CPUs will be threads.
> - On a single-core systems CPUs are CPUs. ;-)

因此，对于我们的机器而言，CPU 指的是逻辑核（或者叫逻辑CPU、线程）。正如前面所有的示例脚本中说明的，我们申请的是逻辑 CPU，而实际上可能需要超线程，也可能不需要超线程。总之，如何申请资源以达到自己的目的，这需要仔细调整脚本中的参数。我们集群中的不同分区有不同的配置，但所有分区的可消耗资源都是物理核（不是逻辑核），即以物理核为基本单位分配资源。使用以下命令可以看到分区中节点的可消耗资源数量：

```
$ sinfo -lNe
```

*Vhagar* 和 *Balerion* 分区采用**非独占**策略，并且不支持**超额**使用（oversubscribe）。只要一个节点的资源没有用尽，就可以被多个用户使用。也就是说，同一节点可能会有多个程序在跑，但一个物理核同时不会被多个作业共享。

如果想跑MPI程序又担心受其他程序的通信、IO影响，可以加上参数 `--exclusive` 指明申请的资源要被独占地使用 。