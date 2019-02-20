# 申请计算资源并运行程序

## 如何提交作业

提交作业的命令主要是：

- `salloc`，申请计算资源，随后可以登陆并使用计算资源；
- `srun`，申请计算资源并实时运行程序，会阻塞终端；
- `sbatch`，申请计算资源并随后运行程序，不会阻塞终端。

> 注：`sbatch`通常配合提交作业的脚本来使用，但它也可以直接在命令行使用。同样，`srun`常常会直接在命令行中被使用，但它也可以写在脚本里提交给`sbatch`。

这三个命令的命令行选项基本一样，具体的选项参考手册：

```
$ man salloc
$ man srun
$ man sbatch
```

接下来我们对一些常用的选项作一点注释，方便大家理解。如果有不明白的地方，请：

- 参考系统上的手册或[官网](https://slurm.schedmd.com/)的说明，官网上的使用说明非常全面（推荐）；
- Google相关用法；
- Google或百度其他集群的手册。

列表中的尖括号内是用户给的参数。

| 参数                                          | 含义                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| **-p**, **--partition**=<*partition_names*>   | 指定分区。                                                   |
| **-N**, **--nodes**=<*minnodes*[-*maxnodes*]> | 请求特定的节点数量。<br />给两个参数就是请求一定范围内的节点。 |
| **-n**, **--ntasks**=<*number*>               | 指定要执行的任务（进程）数量，请求分配相应的资源。<br />默认是一个节点执行一个任务。 |
| **--ntasks-per-node**=<*ntasks*>              | 请求在每个节点上执行*ntasks*个任务。**[1]**                  |
| **-c**, **--cpus-per-task**=<*ncpus*>         | 请求给每个任务分配*ncpus*个CPU。**[2]**<br />不加这个选项，控制器会试着为每个任务分配一个CPU。 |
| **-o**, **--output**=<*filename pattern*>     | 指明将stdout重定向到某个文件，即打印标准输出。<br />如果不指定**--error**，则错误信息也输出到这个文件里。 |
| **-e**, **--error**=<*filename pattern*>      | 指明将stderr重定向到某个文件，即打印错误信息。               |
| **-t**, **--time**=<*time*>                   | 为作业指定时间限制。格式为<br />"minutes", "minutes:seconds", <br />"hours:minutes:seconds", "days-hours", <br />"days-hours:minutes", "days-hours:minutes:seconds" |
| **-J**, **--job-name**=<*jobname*>            | 指定作业的名称。                                             |
| **-w**, **--nodelist**=<*hosts*>              | 指定运行程序的节点，语法见手册。                             |
| **-F**, **--nodefile**=<*node file*>          | 指定运行程序的节点                                           |
| **-x**, **--exclude**=<*hosts*>               | 排除一些节点，语法见手册。                                   |
| **-D**, **--chdir**=<*path*>                  | 执行进程前，先切换到另一个路径*path*。<br />默认路径为用户执行SLURM命令的当前路径。<br />可以使用绝对路径或者相对于当前路径的路径。 |
| **--mincpus**=<*n*>                           | 要求每节点至少有这么多个逻辑CPU。                            |
| **--comment**=<*string*>                      | 给作业加个注释。<br />注释中有空格或特殊字符时，要加引号。   |
| **--deadline**=<*OPT*>                        | 给作业设定期限，到期还未结束就移除这个作业。格式为<br />HH:MM[:SS] [AM\|PM]<br />MMDD[YY] or MM/DD[/YY] or MM.DD[.YY]<br />MM/DD[/YY]-HH:MM[:SS]<br />YYYY-MM-DD[THH:MM[:SS]]] |

> **[1]**：`--ntasks`优先于`--ntasks-per-node`，如果两个一起用，则`--ntasks-per-node`会被当成单节点任务数量的上限。
>
> **[2]**：`-c`一般与`-n`配合使用，否则，SLURM会尽量把进程塞满节点。假设节点有8个CPU，`-N 4 -c 3`意味着请求4个节点，每个节点1个进程（默认），每个进程3个CPU。但SLURM可能只分配2个节点，每个节点2个进程，每个进程3个CPU。
>
> 更多实例请见附录。

## 提交交互式作业 - salloc

用户可以先申请计算资源，再使用 SSH 登陆到分配给自己的节点上完成操作。这种模式便于用户调试程序，但要注意资源使用的时限，超过时限会自动断开连接。

当用户申请了节点并使用 SSH 登陆到节点上时，SLURM 会给用户分配一个 shell，因此，当用户退出时，需要使用两次`exit`。下面我们在`Balerion`分区申请1个节点，并登陆到这个节点上。

```
$ salloc -N 1 -c 12 -t 30:00 -p Balerion
salloc: Granted job allocation 95
salloc: Waiting for resource configuration
salloc: Nodes node21 are ready for job
```

上述命令指定了分区`-p Balerion`，节点数量`-N 1`，CPU数量`-c 12`，资源使用的时限`-t 30:00`。申请成功后，用户会进入由 SLURM 创建的 shell。

随后，使用 SSH 登陆到节点`node01`并执行操作。

```
$ ssh node21
```

> 注：目前全节点共享的存储空间只有`/home`和`/data`。用户在登陆到计算节点后，若发现`/home`的空间已经不够用，请切换到`/data/user`目录下，`user`是你的用户名。若要使用计算节点的本地存储，可以用`/tmp`。

完成操作后，如果不再使用这个节点的计算资源，则退出。

```
$ exit
logout
Connection to node21 closed.
$ exit
exit
salloc: Relinquishing job allocation 95
```

此时，节点`node21`已经可以重新分配给其他作业了。

## 提交批处理作业 - srun | sbatch

批处理作业指的是用户直接提交给集群的作业。作业完成后，用户会得到输出结果。在作业执行期间，用户可以使用 SSH 登陆到分配给自己的节点上。

提交作业一般有两个命令：`srun`和`sbatch`。

### srun

该命令用于提交作业并实时运行。它是个交互式命令，并且会阻塞你的终端。它的参数与`salloc`类似，具体用法请参考官方文档或查看手册：

```
$ man srun
```

下面我们申请一个节点（可以指定节点），开两个进程，每个进程都执行相同的命令：

```
$ srun -N 1 -n 2 hostname
node05
node05
$ srun -w node06 -n 2 hostname
node06
node06
```

### sbatch

该命令用于提交作业（包括分配资源）。它不是交互式的，也不会阻塞终端。如果作业运行时间较长，建议用这个命令。它的参数与`srun`一样。这里仅给出使用的例子。

下面我们申请一个节点，开两个进程，每个进程使用12个线程，同时运行一个 OpenMP 程序：

```
$ vim mybatch
    #!/bin/sh
    #SBATCH -N 1
    #SBATCH -n 2
    #SBATCH -c 12
    srun omp_program

$ sbatch mybatch
```

如果需要使用特定的软件，可以把加载的命令写在脚本中：

```
$ vim mybatch
    #!/bin/sh
    #SBATCH -N 1
    #SBATCH -n 2
    #SBATCH -c 12
    module load HDF5
    module load Python/3.7.0
    
    srun omp_program

$ sbatch mybatch
```

## 取消作业 - scancel

该命令用于取消已提交的作业。可以通过参数指定作业、筛选条件等。

```
$ scancel 103
```

## 发送文件 - sbcast

该命令用于发送文件到计算节点上。使用这个命令之前，请仔细阅读手册。如果在脚本中把文件发送到计算节点上，请同时清理这些文件。

一般情况下，尽量使用共享存储空间`/home`和`/data`，而非`sbcast`命令。