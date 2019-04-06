# 使用Score-P分析性能

Score-P 是一个高可扩展且易于使用的工具集，可用于高性能程序的性能分析和事件追踪。

- 官方网站：[Score-P](https://www.vi-hps.org/projects/score-p/)
- 手册（HTML）：[Score-P 5.0 documentation](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/)
- 手册（PDF）： [Score-P 5.0 documentation](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/pdf/scorep.pdf)

## 简介

Score-P 支持流行的开源性能文件和事件追踪文件格式，能够与其他性能分析软件、事件追踪软件很好地协同起来。使用 Score-P 优化程序性能一般有以下流程：

![performance optimization](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/perf-opt-cycle.png)

实验室集群上目前已安装 Score-P 5.0。经测试，可以分析 MPI 程序（包括 MPICH3 和 OpenMPI3）、OpenMP 程序，以及混合程序。在实验室集群上加载 Score-P 时，要先加载相应的编译器（有的库并不是动态链接的），目前支持的编译器（工具链）如下表：

| 依赖           | 编译器                     | 完整的加载命令          |
| -------------- | ------------------------- | ---------------------- |
| gompi/2019a    | gcc/8.2.0, OpenMPI/3.1.3  | `$ ml gompi Score-P`   |
| gmpich/2017.08 | gcc/7.2.0, MPICH/3.2.1    | `$ ml gmpich Score-P`  |

加载成功后就可以使用 Score-P 的相关工具了。

```bash
$ scorep --version
Score-P 5.0
```

> 注：Score-P 还支持 OpenCL, OpenACC, CUDA。

## 性能分析示例

使用 Score-P 可以测量程序中 MPI 调用、OpenMP 并行区的时间。大致步骤如下，随后会附上一个小例子。

- 编译时，在编译命令前加上 `scorep`；
- 运行程序，或用 `srun, sbatch` 提交到集群执行；
- 执行完成后，会多一个以 `scorep` 开头的子目录，该目录下有 `.cubex` 文件，就是性能测量数据；
- 在命令行下用 `scorep-score` 查看测量数据的汇总信息，或在图形界面用工具打开 `.cubex` 文件查看具体信息。

我们来看具体的例子。该例子是安装包附带的，其文件存放在 `/data/public/scorep-5.0/test/jacobi/hybrid/C` 目录下，具体可参考手册 [Simple Example](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/quickstart.html)。

这份代码使用 MPI+OpenMP 混合编程求解泊松方程。一共两个源文件 `jacobi.c main.c`。

如果不使用 Score-P，编译运行的命令大致会如下：

```bash
$ ml gmpich
$ mpicc -std=c99 -g -O2 -fopenmp -c jacobi.c
$ mpicc -std=c99 -g -O2 -fopenmp -c main.c
$ mpicc -std=c99 -g -O2 -fopenmp -o jacobi jacobi.o main.o -lm
$ srun --mpi=pmi2 -n 2 ./jacobi
```

如果使用 Score-P 收集性能数据，编译运行的命令大致如下：

```bash
$ ml gmpich Score-P
$ scorep mpicc -std=c99 -g -O2 -fopenmp -c jacobi.c
$ scorep mpicc -std=c99 -g -O2 -fopenmp -c main.c
$ scorep mpicc -std=c99 -g -O2 -fopenmp -o jacobi jacobi.o main.o -lm
$ srun --mpi=pmi2 -n 2 ./jacobi
```

区别在于，编译时要在命令前加上 `scorep`，用于链接 `Score-P` 的库（PMPI、POMP等）。

> 注：使用 CMake, Make 等方式编译的代码，Score-P 提供了相应的工具来处理，见后续小节。

如果成功链接了 Score-P 的库，可以看到相关信息：

```bash
$ ldd jacobi | grep scorep
```

程序执行完毕后，会生成一个目录，目录名称包含了当前时间和一个标识串。该目录下的 `.cubex` 文件保存了所需的数据。

```bash
$ ls -d
scorep-20190404_1709_4309181655683768

$ ls scorep*
MANIFEST.md  profile.cubex  scorep.cfg
```

接下来，我们可以使用 GUI 来查看（需要下载安装相关软件，如 CUBE）；也可以直接用 Score-P 的数据查看汇总的信息。

```bash
$ scorep-score scorep*/profile.cubex

Estimated aggregate size of event trace:                   82kB
Estimated requirements for largest trace buffer (max_buf): 41kB
Estimated memory requirements (SCOREP_TOTAL_MEMORY):       51MB
(hint: When tracing set SCOREP_TOTAL_MEMORY=51MB to avoid intermediate flushes
 or reduce requirements using USR regions filters.)

flt     type max_buf[B] visits time[s] time[%] time/visit[us]  region
         ALL     41,769  1,902    4.87   100.0        2560.11  ALL
         OMP     39,816  1,824    4.65    95.4        2547.50  OMP
         MPI      1,600     52    0.04     0.9         854.64  MPI
         COM        286     22    0.18     3.7        8096.77  COM
      SCOREP         41      2    0.00     0.0          41.03  SCOREP
         USR         26      2    0.00     0.0          16.83  USR
```

除了汇总的信息，还可以查看每一个区域（函数、结构等）的具体统计信息。例如 `MPI_Send`, `MPI_Recv` 函数或 `#pragma omp parallel` 结构花费了多少时间。

```bash
$ scorep-score scorep*/profile.cubex -r
```

各列的详细解释可参考 [Scoring a Profile Measurement](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/score.html)，这里对其中重要的几列说明一下：

- **region** 是被测量（插桩）的代码区域，例如用户函数、库函数、OpenMP 结构等；
- **visits** 是访问某一区域的次数；
- **time[s]** 是程序在运行过程中花费在特定区域的总时间；
- **time[%]** 是程序花费在特定区域的总时间占程序总执行时间的比例。
- **time/visit[us]** 是访问某区域一次的平均时间。

> 注：C++ 编写的代码如果大量使用 STL，要格外小心。请先仔细阅读官方手册 [Application Measurement](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/measurement.html) 中的内容，尤其是如何筛去一些函数。原因在于，我们这里使用了 Score-P 的插桩功能，会极大影响 C++ STL 中的短函数，让程序运行时间显著延长（几十倍到上千倍都是可能的）。

## 事件追踪分析示例

在性能分析示例中，执行程序时我们没有设置任何与 Score-P 相关的环境变量、参数。这里要说明的是，Score-P 会检查相应的环境变量，因而我们可以通过环境变量来调整它的行为。例如，可以只做性能分析（默认），也可以只做事件追踪。

性能分析示例的输出结果中，前3行以 Estimated 开头的信息可以用作后续事件追踪。开启追踪功能会记录相当多的信息，需要在内存中预先分配足够的内存给 Score-P 使用。因此，做程序的追踪分析之前，一般要先做一个不带追踪功能的性能分析，根据 **估计的(Estimated)** 内存需求，指定环境变量，再运行一个开启了追踪的版本。其工作流程可以大致总结如下：

- 编译；
- 执行程序（只做性能分析）；
- 用 `scorep-score` 查看输出结果，确认总的统计信息和后续事件追踪所需的内存大小；
- 设置环境变量，执行程序（事件追踪，或性能分析+事件追踪）；
- 分析结果。

详细的工作流程请参考文档中的章节 [Performance Analysis Workflow Using Score-P](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html)。本文档仅列出相应标题和链接：

1. Program instrumentation (Section '[Program Instrumentation](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html#program_instrumentation)')
2. Summary measurement collection (Section '[Summary Measurement Collection](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html#summary_measurement)')
3. Summary report examination (Section '[Summary report examination](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html#summary_examination)')
4. Summary experiment scoring (Section '[Summary experiment scoring](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html#summary_scoring)')
5. Advanced summary measurement collection (Section '[Advanced summary measurement collection](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html#advanced_summary_collection)')
6. Advanced summary report examination (Section '[Advanced summary report examination](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html#advanced_summary_examination)')
7. Event trace collection and examination (Section '[Event trace collection and examination](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/workflow.html#trace_collection_exploration)')

## 提交作业的脚本示例

无论性能分析还是事件追踪，都可以作为脚本提交到实验室集群上。在脚本中，我们可以设置环境变量来控制 Score-P 的行为，所有可用的环境变量可参考官方文档 [Score-P Measurement Configuration](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/scorepmeasurementconfig.html)。

实验室集群上支持的环境变量及含义可以用以下命令查看：

```bash
$ scorep-info config-vars
```

下面我们给一个脚本作为例子，演示如何把事件追踪的任务提交到集群上。

我们申请在 `Vhagar` 分区上用4个进程来收集 `jacobi` 程序的事件追踪数据，每个进程开12个线程。为了保证有足够的内存供 Score-P 使用，我们要求为每个进程分配 200M 用于存储性能数据（默认为 16000K）。

```bash
#!/bin/bash
#SBATCH -J Jacobi-n4-t12
#SBATCH -t 12:00:00
#SBATCH -p Vhagar
#SBATCH -n 4
#SBATCH -c 12

export OMP_NUM_THREADS=12
export SCOREP_ENABLE_TRACING=true
export SCOREP_ENABLE_PROFILING=false
export SCOREP_ENABLE_UNWINDING=true
export SCOREP_TOTAL_MEMORY=200M

ml gompi Score-P
mpirun -bind-to none -mca btl_tcp_if_include 172.16.0.0/24 ./jacobi
```

从脚本中可以看到，为了只做事件追踪，我们开启了 `TRACING` 并关闭了默认的 `PROFILING`，为了得到详细的调用关系，我们还开启了 `UNWINDING`。

## CMake 与 Score-P

Score-P 为 CMake 和基于 Autotools 的构建系统提供了简便的工具（Score-P wrappers）来链接相应的库。具体做法可以参考官方文档 [Score-P Compiler Wrapper Usage](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/scorepwrapper.html)。

简单来说，使用 CMake 的程序无需修改 CMake 的配置，只需要让 Score-P 来替换 CMake 生成的文件中所用的编译器：

```bash
$ SCOREP_WRAPPER=off cmake .. \
    -DCMAKE_C_COMPILER=scorep-gcc \
    -DCMAKE_CXX_COMPILER=scorep-g++
```