# 关于SLURM的额外知识

前面的小节可以帮助我们快速上手，利用 SLURM 来执行自己的程序。这一节是参考材料，帮助用户理解 SLURM 的相关概念。本节的内容都摘自官方文档。如果对集群管理系统、作业调度系统已经有一些了解了，请忽略本节的内容，直接参考官方文档。

## Socket, Core, Thread

如下图所示，我们常说的**处理器(processor)**，在 Linux 和 SLURM 中对应于**socket**，即插处理器芯片的插槽；我们常说的**核(core)**，大部分情况下都指的是处理器芯片上的物理核心；我们常说的**线程(thread)**，对于 Linux 和 SLURM 这种管理系统来说就是**逻辑处理器(logical processor)**，或者叫逻辑核心、逻辑CPU，或者直接称为**CPU**。

![处理器相关概念](https://slurm.schedmd.com/mc_support.gif)

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

具体来说，*Vhagar*分区采用**独占**策略，同一个节点不会同时有两个作业运行。这种策略适合跑程序、测时间等等，不会有其他作业影响通信时间、IO时间。

*Balerion*分区采用**非独占**策略，并且不支持**超额**使用（oversubscribe）。一个节点可能有多个作业执行，但一个物理核同时不会被多个作业共享。如果需要独占地使用，用户在提交作业时要给定选项`--exclusive`。