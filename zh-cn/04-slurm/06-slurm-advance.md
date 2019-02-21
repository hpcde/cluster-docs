# 高级用法

用于提交作业的选项还有很多，其中有一些是相当有用的。这里简单介绍一下。

## Job Array

参考：[Job Array Support](https://slurm.schedmd.com/job_array.html)

作业组（job array)能让用户以相同的参数值一次性提交大量作业，每个作业都可以单独输出。一个作业组有一个 ID，其中的每个作业又有自己的索引号（用户指定）。示例如下：

```
#!/bin/sh
#SBATCH -N 2 -n 4 -c 6 
#SBATCH --export=ALL,OMP_NUM_THREADS=12
#SBATCH -a 1,3,5,7

ml intel/2018a
mpirun ./my_prog
```
这个例子中，我们申请2个节点，希望在每个节点上运行2个进程，每个进程使用12个线程。`-a`或`--array`能让这个作业成为作业组，相当于同时提交多个作业。在这里，我们提交的作业组中包括4个作业，编号分别是`1,3,5,7`。这4个作业的参数完全相同，即申请的资源完全相同。如果有一个或多个作业的资源申请不下来，它会等待，其他的作业会先完成。

## 任务绑定

参考：[CPU Management](https://slurm.schedmd.com/cpu_management.html)

分配了节点、处理器、核心之后，执行的任务（进程）可能会在不同处理器、核心之间切换。用户可以在提交作业时指定选项，让任务绑定到核。

```
$SBATCH --cpu-bind=cores
```

当然，也可以指定绑定到处理器。如果使用了`-B`，也会启用绑定。