# 使用Score-P分析性能

Score-P 是一个高可扩展且易于使用的工具集，可用于高性能程序的性能分析和事件追踪。

官方网站：[Score-P](https://www.vi-hps.org/projects/score-p/)
手册（HTML）：[Score-P 5.0 documentation](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/)
手册（PDF）： [Score-P 5.0 documentation](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/pdf/scorep.pdf)

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

## 性能分析

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

区别在于，编译时要在命令前加上 `scorep`，用于链接 `Score-P` 的库（PMPI、POMP等）。使用 CMake, Make 等方式编译的代码，做类似的处理即可。如果成功链接了 Score-P 的库，可以看到相关信息：

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

各列的解释参考 [Scoring a Profile Measurement](http://scorepci.pages.jsc.fz-juelich.de/scorep-pipelines/docs/scorep-5.0/html/score.html)
