---
id: introduction
title: 使用计算资源 - SLURM
---

集群用户可以通过SLURM提交作业。SLURM提供了3个命令用于申请计算资源/提交作业。

- `srun`提交作业步，在当前shell等待输出，结果直接打印到标准输出；
- `sbatch`提交作业，执行完成后结果输出到日志文件；
- `salloc`申请计算资源，申请成功后可使用`srun`提交作业或SSH登陆到相应的节点上完成操作。

下面用简单的例子演示如何使用这些命令。

首先检查当前是否有足够的空闲节点：

```console
$ sinfo -t idle
```

使用`srun`提交作业，查看计算节点的主机名：

```console
## 使用srun提交一个作业
## "-N 2"指定节点数为
## "-p all"指定节点分区名称
## hostname是可执行文件
$ srun -N 2 -p all hostname
```

同样的功能可以用`sbatch`完成，并且不需要等待标准输出：

```console
## 写一个脚本文件，用"#SBATCH"向SLURM传递参数
## "-o names.out"指定日志文件的路径
$ cat > hostname.slurm << END
#!/bin/sh
#SBATCH -p all
#SBATCH -N 2
#SBATCH -o names.out
srun hostname
END

## 提交作业
$ sbatch hostname.slurm

## 查看作业是否结束
$ squeue

## 查看输出的日志文件
$ cat names.log
```

把申请资源和使用资源分离开，我们也可以用`salloc`达到`sbatch`的效果：

```console
## 申请计算资源，申请成功后会进入SLURM打开的shell
## "-J test"指名作业名称，便于在squeue命令中分辨自己的作业
$ salloc -p all -N 2 -J test

## 在SLURM分配的shell中执行srun，仅能使用刚刚申请的2个节点
$ srun hostname

## 跳转到其中一个节点（假设为node08）
$ ssh node08

$ hostname

## 退出node08
$ exit

## 释放申请的资源，退出SLURM分配的shell
$ exit
```

> 注：需要使用大量计算资源的工作，如编译、执行并行程序等，都应该提交到计算节点，不要在登录节点执行。
>
> 计算所需的数据应该放在专门的目录中，如`$HOME/data`。

SLURM提供的一系列命令还可以完成更复杂的查询、作业提交、作业记录管理、用户记费等功能，下面列出几个使用较为频繁的查询命令，作业提交命令的详细说明在下一节。

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

- `S:C:T` : 节点的 Sockets(S)、Cores(C)、Threads(T) 数量。更详细的解释参考[关于SLURM的额外知识](../slurm\05-slurm-understand.md)；

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

直接运行该命令，可以查看当前用户的历史作业。

通过相应的选项，我们可以指定要显示的历史作业的起止时间。

```bash
$ sacct             # 以默认配置显示历史记录
$ sacct -S 0301     # 从3月1日起所有的记录
$ sacct -E 0312     # 在3月12日之前的记录
$ sacct -S 0301 -s FAILED   # 3月1日以来失败的作业
```

通过使用 `-o` 或 `--format` 选项，可以显示特定的字段。不带任何参数时，`sacct` 会显示 7 个字段。以下两条命令可显示相同的字段：

```bash
$ sacct

$ sacct -o "JobID,JobName,Partition,Account,AllocCPUS,State,ExitCode"
```

有时我们想知道历史作业执行了多长时间，可以使用 `-o Elapsed` 或 `-o ElapsedRaw`。

所有可显示的字段可以通过以下命令查看：

```bash
$ sacct -e
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

最新信息请使用命令在集群上查看。

每个分区的时间限制、资源限制可能不同。目前来说，两个分区的限制如下：

**Vhagar** 分区

- 作业的默认时限：2天

- 作业的最长时限：无限制

- 每个CPU默认分配的内存：2670 MB

- 默认的资源使用方式：非独占

**Balerion** 分区

- 作业的默认时限：2天

- 作业的最长时限：无限制

- 每个CPU默认分配的内存：2000 MiB

- 默认的资源使用方式：非独占

> 作业的默认时限指的是一个作业在未给定时间限制时可以运行的时间上限，超时的作业会被杀掉。提交作业时可以用 `-t` 来指定时间限制。
>
> 非独占的资源使用方式指的是多个作业可以共享同一节点。节点以 CPU 为单位分配，除非用户加上参数 `--exclusive` 来占据整个节点。
>
> 例如，用户 A 申请了一个节点中的 12 个 CPU。如果这是非独占的，剩下的 12 个 CPU 仍然可以被用户 B 申请；如果是独占的，剩下的 12 个 CPU 无法被其他任何用户申请。
