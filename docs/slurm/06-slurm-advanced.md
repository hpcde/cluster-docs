---
id: advanced
title: 高级用法
---

为了完成特定的需求，我们可以借助 shell 脚本的能力。此外，用于提交作业的选项还有很多，其中有一些是相当有用的。本节介绍一些可能适用于完成用户特定目标的功能。

## Job Array

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

## 测试加速比

我们常常需要测试一个程序的加速比，即用不同数量的计算资源执行相同的程序。一种完成方式是使用异构作业，参考 [Heterogenous Job](https://slurm.schedmd.com/heterogeneous_jobs.html)。另一种完成方式是写一个用于提交作业的脚本。

假设我们有一个 MPI 程序 `mpiprog`，我们要用 8 个不同的配置来执行它，分别是 1、2、4、8、16、32、64、128进程（最大的作业需要 `Balerion` 分区提供 4 个节点）。我们可以写一个脚本，让它完成如下工作：

1. 编译程序；
1. 生成一个执行该程序的脚本；
1. 提交该脚本；
1. 清理；
1. 重复步骤 1。

这个脚本（记为 `metabatch`）本身需要的资源可能很少，执行时间也不长。以 Bash 为例，脚本的结构如下：

```bash
#!/bin/bash

#### 用于编译、分发作业所需的资源 ####

#SBATCH -J metajob
#SBATCH -t 30:00
#SBATCH -p Vhagar
#SBATCH -n 1

######## 执行程序所需的资源 #########
## 以变量的形式提供
TLIMIT='2-00:00:00'
PARTITION='Balerion'
NTASKS='1'                  # 起始的进程数量
CPUS='16'                   # 每进程的线程数量
NJOBS='8'                   # 表示1,2,4,8,16,32,64,128这8种配置

########## 程序的信息  #############
PROGDIR='./'                # 源代码所在目录
SRCNAME='mpiprog.c'         # 源代码的名字（如果需要的话）
PROGNAME='mpiprog'          # 程序的名字
PROGARGS=''                 # 程序的参数，可以没有
LOGDIR='log'                # 输出文件的目录

CL='gmpich'                 # 编译器，这里写的是工具链的名字
CLCMD='mpicc'               # 编译程序的命令
RUNCMD='srun --mpi=pmi2'    # 执行程序的命令
MAXITERS='5'                # 每种配置下跑多次，方便取平均

######## 实现功能的脚本  ###########
SRC="$PROGDIR/$SRCNAME"
PROG="$PROGDIR/$PROGNAME"

## 编译
ml purge; ml $CL
$CLCMD $SRC -o $PROG

## 生成并提交脚本
for i in `seq $NJOBS`; do
    if [[ $i != 1 ]]; then NTASKS=$(($NTASKS * 2)); fi

    SUFFIX="n${NTASKS}t${CPUS}-$CL"     # 便于识别
    NEWPROG="$PROG-$SUFFIX"             # 新的程序名，避免冲突
    WORKER="wk-$PROGNAME-$SUFFIX"       # 待提交的脚本名
    JOBNAME="$PROGNAME-$SUFFIX"         # 作业名，便于识别
    LOGFILE="$LOGDIR/%j-%x.log"         # 输出文件名，便于识别

    ## 程序执行所需的选项
    ALLOC=("#!/bin/bash" \
    "#SBATCH -J ${JOBNAME}" \
    "#SBATCH -o ${LOGFILE}" \
    "#SBATCH -t ${TLIMIT}" \
    "#SBATCH -p ${PARTITION}" \
    "#SBATCH -n ${NTASKS}" \
    "#SBATCH -c ${CPUS}" \
    "#SBATCH --export=ALL,OMP_NUM_THREADS=${CPUS}")

    ## 复制可执行文件
    cp $PROG $NEWPROG

    ## 生成脚本文件
    printf "%s\n" "${ALLOC[@]}" > $WORKER   # 资源申请
    echo "ml purge; ml $CL" >> $WORKER      # 软件加载

    for j in `seq $MAXITERS`; do            # 多次执行
        echo "$RUNCMD ./$NEWPROG $PROGARGS" >> $WORKER
    done

    echo "rm $NEWPROG $WORKER" >> $WORKER   # 清理文件

    ## 提交脚本
    sbatch $WORKER
done
```
> 注：这个脚本中，文件的清理工作由它派生的脚本完成。如果要让这个脚本自己完成清理，要保证所有作业把所需的文件读过去之后再执行清理，因为从作业提交到开始执行是有延迟的。

以上脚本以 8 种不同配置执行程序，每种配置下执行 5 次。这些作业都是分开的，因此只要计算资源够就会同时执行。每种配置的输出结果是单独放在一个文件中的，也就是说，每个输出文件中有跑 5 次的结果。

总的来说，这个脚本把源代码编译了一次，随后根据不同的配置拷贝多份可执行文件，并生成多份待提交的脚本，逐个把这些脚本提交给集群。

如果有其他需要，还可以扩充这个脚本：

- 用脚本把结果集中起来分析，或用其他方式分析结果（如 Python）；
- 使用多个不同的时限、分区、节点数、任务数等；
- 使用多线程；
- 使用多种不同编译器分别编译、运行；
- 获取作业编号，让某些作业依赖于其他作业。

这种批量提交作业的方式不限于 shell 脚本。我们也可以用 C/C++、Python 等其他语言写一个用于编译、提交作业并分析结果的程序。

## 任务绑定

参考：[CPU Management](https://slurm.schedmd.com/cpu_management.html)

分配了节点、处理器、核心之后，执行的任务（进程）可能会在不同处理器、核心之间切换。用户可以在提交作业时指定选项，让任务绑定到核、CPU 等。

```
#SBATCH --cpu-bind=cores
```

除此之外，OpenMPI/MPICH/IMPI 这些 MPI 实现也有自己的绑定语法。使用这些语法时，请参考官网或手册。

> 注：前面我们还提到过，使用 `-B` 会自动启用绑定。

## Rosetta Stone

参考：[Rosetta Stone of Workload Managers](https://slurm.schedmd.com/rosetta.html)

PBS/Torque、Slurm、LSF、SGE 和 LoadLeveler 这几个调度和管理软件都有自己的命令和参数，它们的命令之间的对应关系在 Slurm 的文档中有说明，见参考链接。

例如，Slurm 用的 `sbatch` 和 `squeue` 分别对应 LSF 中的 `bsub` 和 `bjobs`。

除此之外，集群中安装了 PBS/Torque 插件，可以把 PBS/Torque 的脚本转换为 Slurm 的脚本格式。该插件的相关命令有 `pbs2sbatch`, `pbs2slurm`, `pbsenv2slurm`, `pbsnodes`。
