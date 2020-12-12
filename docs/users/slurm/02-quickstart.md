---
id: quickstart
title: 使用计算资源
---

用户使用集群时，通常会涉及以下操作：

- 查看集群信息
- 提交作业
- 取消作业
- 挂起/恢复作业
- 调整作业的属性
- 传输文件

## 常用命令

参考：

- [Slurm Workload Manager](https://slurm.schedmd.com/)
- [Command/option Summary](https://slurm.schedmd.com/pdfs/summary.pdf)
- [Man Pages](https://slurm.schedmd.com/man_index.html)

为满足用户查询、提交、管理作业等需求，Slurm 提供了相当丰富的命令行工具，其中最为常用的如下：

| 命令       | 说明                                              |
| ---------- | ------------------------------------------------- |
| `sinfo`    | 查看集群节点、节点分区等信息                      |
| `squeue`   | 查看作业队列、作业状态等信息                      |
| `sacct`    | 查看作业的计费信息，包括时长、资源使用量等        |
| `sattach`  | 查看作业的标准输入输出                            |
| `scancel`  | 取消作业                                          |
| `salloc`   | 申请计算资源                                      |
| `srun`     | 提交一个作业步，在当前 shell 等待输出             |
| `sbatch`   | 提交一个作业脚本，执行完成后结果输出到日志文件    |
| `scontrol` | 查看和修改各种 Slurm 对象，包括作业、节点、分区等 |

## 快速入门

参考：

- [Quick Start User Guide](https://slurm.schedmd.com/quickstart.html)

### 查看集群状态

```bash
# 检查当前是否有足够的空闲节点：
$ sinfo -t idle

# 查看当前的作业队列，看是否有很多作业在排列中
$ squeue

# 查看历史作业的计费信息，看自己的作业是不是成功结束了
$ sacct
```

### 运行自己的程序 (srun)

```bash
# 使用srun提交一个作业，等待标准输出
# "-N"指定节点数为"2"
# "-n"指定总任务数为"4"，相当于说总共4个进程，每节点2个进程
# "-p"指定节点分区名称为"all"
# hostname是可执行文件，在这里我们仅仅让节点打印主机名
$ srun -p all -N 2 -n 4 hostname
```

### 运行自己的程序 (sbatch)

```bash
# 写一个脚本文件，用"#SBATCH"向Slurm传递参数
# "-o slurm-log.txt"指定日志文件的路径
$ cat > ping.slurm << END
#!/bin/sh
#SBATCH -p all
#SBATCH -N 2
#SBATCH -o slurm-log.out
srun ping -c 60 nodedata
END

# 提交作业，立即返回不等待标准输出
$ sbatch ping.slurm

# 查看作业是否结束，状态为"PD"表示挂起，为"R"表示运行中，为"CG"表示正在结束
$ squeue

# 把当前标准I/O绑到运行中的作业步上，以便实时查看输出
#（假设作业号为31001，第一个作业步为31001.0）
$ sattach 31001.0

# 作业结束后，查看输出的日志文件
$ cat slurm-log.txt
```

### 仅申请资源 (salloc)

```bash
## 申请计算资源，申请成功后会进入Slurm打开的shell
## "-J test"指名作业名称，便于在squeue命令中分辨自己的作业
$ salloc -p all -N 2 -J test

## 在Slurm分配的shell中执行srun，仅能使用刚刚申请的2个节点
$ srun hostname

## 跳转到其中一个节点（假设为node08）
$ ssh node08

$ hostname

## 退出node08
$ exit

## 释放申请的资源，退出Slurm分配的shell
$ exit
```

:::caution
需要使用大量计算资源的工作，如编译、执行并行程序等，都应该提交到计算节点，不要在登录节点执行。

计算所需的数据应该放在专门的目录中，如`$HOME/data`。
:::

## 查看分区和节点信息

参考：

- `$ man info`
- `$ snodes --help`

### `sinfo`

该命令用于查看当前集群的节点信息，包括分区和节点的数量、状态等。

```bash
$ sinfo
PARTITION AVAIL TIMELIMIT NODES STATE NODELIST
all          up  infinite     4 down* node[17-20]
all          up  infinite     2 alloc node[05-06]
all          up  infinite     6   mix node[07-12]
all          up  infinite     3	 idle node[21-23]
Balerion     up  infinite     4	down* node[17-20]
Balerion     up  infinite     3	 idle node[21-23]
Vhagar*      up  infinite     2	alloc node[05-06]
Vhagar*      up  infinite     6	  mix node[07-12]
```

命令默认输出以下字段：

- `PARTITION`：节点的分区。每个任务都只能提交到分区中，不能跨分区。默认分区的名称后有 `*` 号；
- `AVAIL`：分区的状态。`UP` 表示分区可用；
- `TIMELIMIT`：分区对作业的时间限制。所有提交到该分区的作业都不能超过时间上限；
- `NODES`：分区中的节点数量。这是该分区所有可以分配给用户的计算节点；
- `STATE`：节点的状态。`down` 表示不可用，`idle` 表示空闲节点，`alloc` 表示已完全分配给用户使用，`mix` 表示已分配给用户，但仍有剩余的计算资源可用。同一分区可能会占据多个条目，这是因为分区中节点的状态不同；
- `NODELIST`：节点的名称。同一节点可以编入多个分区。

我们可以给 `sinfo` 命令加上选项查看更详细的信息

```bash
$ sinfo -lN
NODELIST   NODES PARTITION       STATE CPUS    S:C:T MEMORY TMP_DISK WEIGHT AVAIL_FE REASON              
node05         1   Vhagar*   allocated   24    2:6:2  64156    10240      1   (null) none
node06         1   Vhagar*   allocated   24    2:6:2  64156    10240      1   (null) none
node23         1  Balerion    drained*   32    2:8:2  64155    10240      1   (null) Power saving
```

- `CPUS`：节点的总CPU数量；
- `S:C:T`：节点的 Sockets(S)、Cores(C)、Threads(T) 数量；
- `MEMORY`：节点的可用内存；
- `TMP_DISK`：节点的可用临时存储空间；
- `WEIGHT`：节点被调度的优先级（权重）。

:::info 作业的默认时限
使用 `sinfo` 直接能看到的是分区的最大时限（无穷大），不是默认时限。默认时限指的是一个作业在未给定时间限制时可以运行的时间上限。需要长时间运行的作业要注意在提交时设置时限，不要用默认值（可设为 `infinite`，但不推荐）。

实验室集群各分区的默认时限通常为两天。
:::

### `snodes`

如果用户不记得 `sinfo` 的那些选项，可以使用 `snodes` 命令。

这个命令可以按节点、分区或状态来查看信息，包括分区名、节点名、状态、处理器数量、内存大小。它也能显示节点上的 CPU 资源的分配情况，见 `CPUS(A/I/O/T)` 一栏。

:::info 输出格式
Slurm 的查询命令通常都接受用户自定义格式。`snodes` 其实就是个调用 `sinfo` 的脚本，它自己定义了一种输出格式。

可以打开这个脚本观察它是如何使用 `sinfo` 的
```bash
$ vi $(which snodes)
```
:::

## 查看作业队列

参考：

- `$ man squeue`
- `$ showq --help`

### `squeue`

该命令用于查看当前在队列中的作业。默认情况下它会显示作业已经运行的时间。它有许多参数可以帮助我们筛选队列中的作业，举例如下：

```bash
$ squeue            # 以默认配置显示队列中的作业
$ squeue -u slurm   # 只显示slurm这个用户的作业
$ squeue -l         # 以长格式显示，包括作业的时限
$ squeue -S +i      # 按作业号升序排列
$ squeue -S -M      # 按作业已执行时间降序排列
```

### `showq`

该命令也用于查看作业队列，但调整了输出信息的格式，增加了一些数量统计。要注意的是，它显示的时间有两个：

- `REMAINING`：作业剩余的时间。每个作业提交时都有时限，这一栏显示了分配给作业的时间还剩余多少，而无剩余时间的作业会被强制结束；

- `STARTTIME`：作业的起始时间。

## `sacct` - 查看作业计费信息

直接运行该命令，可以查看当前用户的计费信息，其中包括很多字段，例如运行时长、起止时间、最大内存占用、磁盘读写速度等等。因此，我们常用它来查看历史作业的信息。

通过相应的选项，我们可以指定要显示的历史作业的起止时间。

```bash
$ sacct             # 以默认配置显示历史记录
$ sacct -S 0301     # 从3月1日起所有的记录
$ sacct -E 0312     # 在3月12日之前的记录
$ sacct -S 0301 -s FAILED   # 3月1日以来失败的作业
```

`sacct` 加上 `-o` 或 `--format` 选项可以调整输出的格式，显示特定的字段。不带任何参数时，`sacct` 会显示 7 个字段。以下两条命令可显示相同的字段：

```bash
$ sacct
$ sacct -o "JobID,JobName,Partition,Account,AllocCPUS,State,ExitCode"
```

有时我们想知道历史作业执行了多长时间，可以使用 `-o Elapsed` 或 `-o ElapsedRaw`。

所有可显示的字段可以通过以下命令查看：

```bash
$ sacct -e
```

:::info 作业运行时的信息
`sacct` 虽然能查看历史作业的一些信息，但并不是全部。它输出的信息通常都来源于 Slurm 的数据库，是一些用于计费的统计信息。像作业提交脚本这样的内容并不会被记录。
:::

## `scontrol show` - 查看 Slurm 配置

`scontrol` 是管理 Slurm 配置用的命令，`show` 是它的子命令，可以用于查看很多信息，比如分区、节点、作业的详细信息。

查看所有分区信息/查看某个分区的信息：

```bash
$ scontrol show partition
$ scontrol show Vhagar
```

查看所有节点信息/查看某个节点的信息：

```bash
$ scontrol show node
$ scontrol show node node05
```

查看所有作业信息/查看某个作业的信息：

```bash
$ scontrol show job
$ scontrol show job 103
```

:::info 已结束作业的信息
目前，实验室集群上的作业只有在运行时才能用 `scontrol show` 查看它的信息，在结束以后只留下计费数据在数据库中。计费数据使用 `sacct` 查看。
:::

## 如何提交作业

参考：

- [Quick Start User Guide](https://slurm.schedmd.com/quickstart.html)
- `$ man salloc`
- `$ man srun`
- `$ man sbatch`

提交作业的命令有三个，它们分别适用于不同情况，用户可根据需要选择：

- `salloc`：申请计算资源，随后可以登陆并使用计算资源；
- `srun`：申请计算资源并实时运行程序，会阻塞终端；
- `sbatch`：申请计算资源并随后运行程序，不会阻塞终端。

这三个命令的命令行选项大多相同，我们在此列举一些常用的选项并作一点注释，方便大家理解。
各命令的使用在后续小节以例子的形式给出。

:::note
列表中的尖括号内是用户给的参数。
:::

| 参数                                | 含义                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| `-p, --partition=<names>`           | 指定分区名称。                                               |
| `-N, --nodes=<minnodes[-maxnodes]>` | 请求特定的节点数量，给两个参数就是请求一定范围内的节点。     |
| `-n, --ntasks=<number>`             | 指定要执行的任务（进程）数量，请求分配相应的资源。默认是一个节点执行一个任务。 |
| `--ntasks-per-node=<ntasks>`        | 请求在每个节点上执行 `ntasks` 个任务。**[1]**                    |
| `-c, --cpus-per-task=<ncpus>`       | 请求给每个任务分配 `ncpus` 个 CPU。**[2]**<br />不加这个选项，控制器会试着为每个任务分配一个 CPU。 |
| `-o, --output=<filename pattern>`   | 指明将 stdout 重定向到某个文件，即打印标准输出。<br />如果不指定 `--error`，则错误信息也输出到这个文件里。 |
| `-e, --error=<filename pattern>`    | 指明将 stderr 重定向到某个文件，即打印错误信息。             |
| `-t, --time=<time>`                 | 为作业指定时间限制。格式为<br />"minutes", "minutes:seconds", <br />"hours:minutes:seconds", "days-hours", <br />"days-hours:minutes", "days-hours:minutes:seconds" |
| `-J, --job-name=<jobname>`          | 指定作业的名称，便于用户识别自己提交的作业。                 |
| `-w, --nodelist=<hosts>`            | 指定运行程序的节点，语法见手册。                             |
| `-F, --nodefile=<node file>`        | 提供一个文件来指定运行程序的节点。                           |
| `-x, --exclude=<hosts>`             | 排除一些节点，语法见手册。                                   |
| `-D, --chdir=<path>`                | 执行进程前，先切换到另一个路径。默认路径为用户执行 Slurm 命令的当前路径。<br />可以使用绝对路径或者相对于当前路径的路径。 |
| `--mincpus=<n>`                     | 要求每节点至少有 `n` 个逻辑CPU。                             |
| `--comment=<string>`                | 给作业加个注释。<br />注释中有空格或特殊字符时，要加引号。   |
| `--deadline=<OPT>`                  | 给作业设定期限，到期还未结束就移除这个作业。格式为<br />HH:MM[:SS] [AM\|PM]<br />MMDD[YY] or MM/DD[/YY] or MM.DD[.YY]<br />MM/DD[/YY]-HH:MM[:SS]<br />YYYY-MM-DD[THH:MM[:SS]]] |

:::note 脚注
**[1]** `--ntasks` 优先于 `--ntasks-per-node`，如果两个一起用，则`--ntasks-per-node`会被当成单节点任务数量的上限。

**[2]** `-c` 一般与 `-n` 配合使用，否则，Slurm 会尽量把进程塞满节点。
假设节点有8个 CPU，`-N 4 -c 3` 意味着请求4个节点，每个节点1个进程（默认），每个进程3个 CPU。
但 Slurm 可能只分配2个节点，每个节点2个进程，每个进程3个 CPU。
:::

## `salloc` - 申请计算资源

用户可以先申请计算资源，再使用 SSH 登陆到分配给自己的节点上完成操作。这种模式便于用户调试程序，但要注意资源使用的时限，超过时限会自动断开连接。

目前，绝大多数能在 *node01* 上完成的工作都能在远程节点上完成。因此，如果用户想编译程序、调试程序，可以使用 `salloc` 申请一个或多个节点，再 SSH 到这些节点上完成工作。

### 基本用法

当用户申请了节点并使用 SSH 登陆到节点上时，Slurm 会给用户分配一个 shell，因此，当用户退出时，需要使用两次`exit`。下面我们在`Balerion`分区申请1个节点，并登陆到这个节点上。

```bash
$ salloc -N 1 -c 12 -t 30:00 -p Balerion
salloc: Granted job allocation 95
salloc: Waiting for resource configuration
salloc: Nodes node21 are ready for job
```

上述命令指定了分区`-p Balerion`，节点数量`-N 1`，CPU数量`-c 12`，资源使用的时限`-t 30:00`。申请成功后，用户会进入由 Slurm 创建的 shell。

随后，使用 SSH 登陆到节点`node01`并执行操作。

```bash
$ ssh node21
```

:::info
目前全节点共享的存储空间只有`/home`和`/data`。用户在登陆到计算节点后，若发现`/home`的空间已经不够用，请切换到`/data/user`目录下，`user`是你的用户名。若要使用计算节点的本地存储，可以用`/tmp`。

完成操作后，如果不再使用这个节点的计算资源，则退出。
:::

​```bash
$ exit
logout
Connection to node21 closed.

$ exit
exit
salloc: Relinquishing job allocation 95
```

此时，节点`node21`已经可以重新分配给其他作业了。

使用 `--exclusive` 参数，可以独占节点而不用指定任务数量、CPU 数量。

```bash
$ salloc -N1 --exclusive -t 30:00 -p Balerion
```

### 与`screen`或`tmux`配合使用

使用 `screen` 或 `tmux` 可以创建在后台运行的会话。最常见的是在登陆节点上使用它们来保持自己的SSH、SFTP 连接，以便下次连接到登陆节点时能恢复。

这些工具同样可以用于保存 `salloc` 申请资源后由 Slurm 分配的 shell。我们只要在一个创建好的会话里面申请资源即可。

```bash
$ screen -S myalloc                     # 创建会话
$ salloc -N1 --exclusive -p Vhagar      # 申请资源
```

执行以上两行命令后，即使网络中断，也可以通过命令恢复之前的会话。

```bash
$ screen -r myalloc
```

:::info Terminal multiplexers
像 `screen` 和 `tmux` 这样能创建多个"伪"终端的软件被称为 *Terminal multiplexers*，具体用法可参考官方网站或浏览集群文档中的博客。
:::

## `srun` - 提交作业步

参考：

- `$ man srun`

`srun` 在申请计算资源后会立即执行用户提供的二进制文件，Slurm 会为它创建一个作业步。作业执行时会输出到标准输出，直接执行该命令会阻塞终端。它的参数与 `salloc` 类似。

下面我们申请一个节点（可以指定节点），开两个进程，每个进程都执行相同的命令：

```bash
$ srun -N 1 -n 2 hostname
node05
node05

$ srun -w node06 -n 2 hostname
node06
node06

$ srun -N 2 hostname
node05
node06
```

可以发现，在这三条命令中，`hostname` 都执行了两次。换句话说，申请的资源数量就是使用的资源数量。这是 `srun` 最基本的用法：申请资源，并完全使用这些资源。

在后续章节中，我们会看到另一种用法，即申请资源后只使用申请的一部分资源。

## `sbatch` - 提交作业

`sbatch` 用于申请资源并执行用户提供的脚本，Slurm 会为它创建一个作业，一个作业里面可以有多个 `srun` （多个作业步）。与 `srun` 不同的是，它不会阻塞终端。

如果作业运行时间较长，建议用这个命令。它的参数与 `srun` 一样。接下来我们重点介绍一下它的使用方法，这部分的很多内容都是适用于 `salloc` 和 `srun` 的。

### 命令格式

```bash
sbatch [options] script [args]
```

使用 `sbatch` 时，要指明申请的资源数量，如节点数、任务数、CPU数等；还要指明待执行的脚本名称。随后，Slurm 会分配相应的资源（或挂起作业），并将用户的脚本拷贝到计算节点上执行。其中，脚本名必须提供给 sbatch。

例如，我们想跑一个程序（记为 `myprog`）。我们会希望在跑之前先编译，跑完后输出结果并且清理一下编译过程中产生的文件。这个工作可以全部写在脚本中提交。假设脚本为 `mybatch.sh`。

```bash
$ vim mybatch.sh
    #!/bin/sh
    #SBATCH -J compile-and-run
    #SBATCH -o %x-%j.log
    #SBATCH -p Vhagar
    #SBATCH -n 1

    module load GCC         # 加载所需的编译器
    gcc myprog.c -o myprog  # 编译
    srun myprog             # 执行
    rm myprog               # 清理文件

$ sbatch mybatch.sh
```

上述脚本分为两大部分，第一部分是以 `#SBATCH` 开头的资源申请部分，其解释如下：

- `-J myjob` 指定作业的名称，便于用户从多个已经提交的作业中识别它。不指定名称的话，系统会自动分配一个。
- `-o %x-%j.log` 指定作业的输出位置。`%x` 和 `%j` 是替换符，分别表示作业名和作业编号。关于替换符的说明，请参考手册 `man sbatch`。
- `-p Vhagar` 指定分区。使用前请通过 `sinfo`、`snodes` 等命令确认哪个分区有空闲节点，否则作业可能要排队等待。
- `-n 1` 指定任务数量。在这里我们只要求执行1个进程。

第二部分是执行部分，也就是作业步。如果分配了多个节点，被提交的脚本 `mybatch` 会交由第一个节点执行。这些作业步大致有三类命令：

- 加载环境变量：环境变量会从第一个节点广播到其他所有计算节点。例如 `module GCC`，加载之后，每个计算节点都能使用 `GCC` 的同一版本。
- 不带 `srun` 的命令：会在第一个节点上执行。因此 `gcc ...` 这句编译命令和 `rm ...` 这句清理命令，都只在第一个节点上执行。
- 带 `srun` 的命令：会在所有节点上执行，是并行任务。因此 `srun myprog` 这句会在所有申请到的计算节点上执行。

执行完毕后，计算节点的输出（包括 `stdout` 和 `stderr`）都可以在输出文件中看到。默认的输出文件名称为 `slurm-作业名.out `，这里的例子中使用 `-o` 参数指定了一个输出文件名称。

### 命令行选项和参数

由脚本中 `#SBATCH` 指定的选项和由命令行直接输入的选项是一样的。例如，以下脚本和命令可以达到和前例相同的效果。

```bash
$ vim mybatch.sh
    #!/bin/sh
    #SBATCH -J compile-and-run
    #SBATCH -o %x-%j.log

    module load GCC         # 加载所需的编译器
    gcc myprog.c -o myprog  # 编译
    srun myprog             # 执行
    rm myprog               # 清理文件

$ sbatch -p Vhagar -n 1 mybatch.sh
```

### 作业的时限

执行时间较长的作业需要手动指定时间限制，因为默认的时间限制可能不满足要求。选项 `-t` 的格式我们在前面总结过了。例如，我们可以指定时间为数分钟甚至数天。

```bash
## 时限为30分钟
#SBATCH -t 30:00

## 时限为12小时
#SBATCH -t 12:00:00

## 时限为2天零12小时
#SBATCH -t 2-12:00:00
```

如果需要给作业设置一个期限，让作业到期就被终止，可以用 `--deadline`。这个选项可以在作业提交之后通过 `scontrol` 附加上去。

某些情况下，我们可能希望自己的作业在特定时间执行，或者在数小时之后执行。比如定期跑一个清理脚本，跑一个数据分析软件或者脚本之类的。此时可以用 `--begin` 选项来完成。

```bash
## 当天晚上9点开始
#SBATCH --begin=21:00:00

## 6小时以后开始
#SBATCH --begin=now+6hour

## 2100年1月1日凌晨开始
#SBATCH --begin=2100-01-01T00:00:00
```

### 作业的依赖关系

一个作业可以设置与其他作业的依赖关系。考虑以下场景：

我们有不同版本的代码需要编译（使用不同编译器），这些编译后的程序我们要同时提交运行。一种解决方案是，分为2个脚本完成：脚本 A 负责一个接一个地编译，这样能避免多个编译过程产生相同的中间文件（如 `*.o` 文件）相互覆盖；脚本 B 负责把编译后的程序提交给集群去执行。

`mybatchA` 中的选项没什么特别的。提交之后可以看到它的作业编号 `JobID`，假设是 103。接下来，`mybatchB`中要加上一个选项：

```bash
#SBATCH -d afterok:103
```

这一句指明了，`mybatchB` 会在 `mybatchA` 成功执行时才会执行。除此之外，还有其他的依赖，例如：

```bash
## 在作业 103 开始执行之后
#SBATCH -d after:103

## 在作业 103 和 104 都失败之后，失败的原因有很多
#SBATCH -d afternotok:103 104

## 单例作业，在所有同名、同用户的作业都结束后才执行
#SBATCH -d singleton
```

在提交作业时，多个作业的作业名是可以重复的，因此`singleton` 有时会很有用的，它保证当前任务执行时没有和它作业名、用户名相同的任务。

在手册中可以看到 `-d` 选项的所有参数。

## `scancel` - 取消作业

该命令用于取消已提交的作业。可以通过参数指定作业、筛选条件等。

```bash
$ scancel 103
```

取消某一用户 `hpcer`（通常是自己的）所有作业，使用如下命令：

```bash
$ scancel -u hpcer
```

## `scontrol update` - 更新作业相关信息

`scontrol` 的子命令 `update` 可用于更新各种 Slurm 对象。其中，`scontrol update job` 用于更新一个已提交的作业的信息。如果作业提交后发现时间写短了，或者想附加一些参数，用户应该使用这个命令更新，而不是取消作业再重新提交。

命令的格式可以为：

```bash
scontrol update job=JobID [Attr1=Value1] [Att2=Value2] ...
```

其中，`JobID` 是要更新的作业编号，`Attr` 和 `Value` 分别是待更新的作业属性和值。例如，我们要更新编号为 `103` 的作业，把它的时限调整为 `7` 天整。

```bash
$ scontrol update job=103 TimeLimit=7-00
```

> 注：`job=103` 可以写成 `job 103`。属性名称`TimeLimit` 不区分大小写，可以写成 `timelimit`。

属性的名字可以通过以下命令查看：
```bash
$ scontrol show job 103
```

## `sbcast` - 发送文件

该命令用于发送文件到计算节点上。使用这个命令之前，请仔细阅读手册。如果在脚本中把文件发送到计算节点上，请同时清理这些文件。

一般情况下，尽量使用共享存储空间`$HOME/data`，而非`sbcast`命令。