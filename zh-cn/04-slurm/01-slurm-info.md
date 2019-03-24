# 使用计算资源 - SLURM

用户可以提交作业到集群，由 SLURM 分配计算资源。目前，在实验室集群，任何人都可以提交以下作业：

- OpenMP 程序；
- MPI 程序。
- MPI/OpenMP 混合程序。

用户可以直接提交一个作业，待执行完成后查看返回结果；也可以申请计算资源，登陆到相应的节点上完成操作。在得到计算资源后（比如作业运行期间），用户可以使用 SSH 登陆到分配给自己的节点上。在提交作业之间，请检查现有的空闲计算资源。

需要使用大量计算资源或内存的程序都请提交给 SLURM 运行，不要在本地运行。例如：

- 测试项目中的程序；
- 测试机器、软件、库的性能；
- 编译一些大型程序，比如编译 GCC。

> 注：编译工作也请提交到 *Vhagar* 或 *Balerion* 分区。提交的脚本中可以写编译命令、`make`等，支持 SHELL。

SLURM 提供了一系列命令用于查看分区、节点、作业等信息。以下给出简单的用法。

## 查看分区和节点信息 - sinfo | snodes

### sinfo

该命令用于查看当前集群的所有分区信息，包括分区和节点的状态。

```
$ sinfo
PARTITION AVAIL TIMELIMIT NODES STATE NODELIST
Balerion     up   1:00:00     4	down* node[17-20]
Balerion     up   1:00:00     3	 idle node[21-23]
Vhagar*      up   3:00:00     2	alloc node[05-06]
Vhagar*      up   3:00:00     6	  mix node[07-12]
```

> 注：节点和分区的信息以集群上的实时数据为准，这里只是用于演示。

- `PARTITION` : 节点的分区。每个任务都只能提交到分区中，不能跨分区。默认分区的名称后有 `*` 号；

- `AVAIL` : 分区的状态。`UP` 表示分区可用；

- `TIMELIMIT` : 分区对作业的时间限制。所有提交到该分区的作业都不能超过时间上限；

- `NODES` : 分区中的节点数量。这是该分区所有可以分配给用户的计算节点；

- `STATE` : 节点的状态。常见状态：`down` 表示不可用，`idle` 表示空闲节点，`alloc` 表示已完全分配给用户使用，`mix` 表示已分配给用户，但仍有剩余的计算资源可用。同一分区可能会占据多个条目，这是因为分区中节点的状态不同；

- `NODELIST` : 节点的名称。

给 `sinfo` 命令加上选项，可以查看更详细的信息
```
$ sinfo -lN
NODELIST   NODES PARTITION       STATE CPUS    S:C:T MEMORY TMP_DISK WEIGHT AVAIL_FE REASON              
node05         1   Vhagar*   allocated   24    2:6:2  64156    10240      1   (null) none
node06         1   Vhagar*   allocated   24    2:6:2  64156    10240      1   (null) none
node23         1  Balerion    drained*   32    2:8:2  64155    10240      1   (null) Power saving
```

- `CPUS` : 节点的总CPU数量；

- `S:C:T` : 节点的 Sockets(S)、Cores(C)、Threads(T) 数量。更详细的解释参考[关于SLURM的额外知识](zh-cn\04-slurm\05-slurm-understand.md)；

- `MEMORY` : 节点的可用内存；

- `TMP_DISK` : 节点的可用临时存储空间；

- `WEIGHT` : 节点被调度的优先级（权重）。

### snodes

如果用户不记得 `sinfo` 的那些选项，`snodes` 命令更方便。

这个命令可以按节点、分区或状态来查看信息，包括分区名、节点名、状态、处理器数量、内存大小。它也能显示节点上的 CPU 占用情况，见 `CPUS(A/I/O/T)` 一栏。

> 注：用 `sinfo` 也可以完成差不多的功能，具体参考其手册 `man sinfo`。


## 查看作业队列 - squeue | showq

### squeue

该命令用于查看当前在队列中的作业。默认情况下它会显示作业已经运行的时间。

用法示例如下：

```bash
$ squeue            # 以默认配置显示队列中的作业

$ squeue -u slurm   # 只显示slurm这个用户的作业

$ squeue -l         # 以长格式显示，包括作业的时限

$ squeue -S +i      # 按作业号升序排列

$ squeue -S -M      # 按作业已执行时间降序排列
```

> 注：还有很多选项和相应参数可以用于筛选作业，具体见手册 `man squeue`。

### showq

该命令调整了输出信息的格式，便于用户使用。要注意的是，它显示的时间有两个：

- `REMAINING` : 作业剩余的时间。每个作业提交时都有时限，这一栏显示了分配给作业的时间还剩余多少，而无剩余时间的作业会被强制结束；

- `STARTTIME` : 作业的起始时间。

## 查看历史作业 - sacct

直接运行该命令，可以查看当前用户的历史作业。可以通过参数调整输出，具体参数见手册。

```bash
$ sacct             # 以默认配置显示历史记录

$ sacct -S 0301     # 从3月1日起所有的记录

$ sacct -E 0312     # 在3月12日之前的记录

$ sacct -S 0301 -s FAILED   # 3月1日以来失败的作业
```

## 查看详细信息 - scontrol show

该命令可以查看很多信息，比如分区、节点的详细信息。示例如下。

查看所有分区信息/查看某个分区的信息：

```
$ scontrol show partition
$ scontrol show Vhagar
```

查看所有节点信息/查看某个节点的信息：

```
$ scontrol show node
$ scontrol show node node05
```

查看所有作业信息/查看某个作业的信息：

```
$ scontrol show job
$ scontrol show job 103
```

## 分区的限制

本部分可能不会频繁更新，最新信息请使用命令在集群上查看。

每个分区的时间限制、资源限制可能不同。目前来说，两个分区的限制如下：

**Vhagar** 分区

- 作业的默认时限：6小时

- 作业的最长时限：无限制

- 每个CPU默认分配的内存：1024 MiB

- 每个CPU最大可分配内存：2645 MiB

- 默认的资源使用方式：非独占

**Balerion** 分区

- 作业的默认时限：6小时

- 作业的最长时限：无限制

- 每个CPU默认分配的内存：1024 MiB

- 每个CPU最大可分配内存：1984 MiB

- 默认的资源使用方式：非独占

> 作业的默认时限指的是，一个作业在未给定时间限制时，系统默认设置的时间限制，超时的作业会被杀掉。提交作业时可以用 `-t` 来指定时间限制。
>
> **非独占**的资源使用方式指的是，节点以 CPU 为单位分配，除非用户加上参数 `--exclusive` 来占据整个节点。
