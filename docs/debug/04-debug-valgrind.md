---
id: valgrind
title: 使用Valgrind分析工具
---

Valgrind 是一个非常流行的二进制插桩框架（instrumentation framework），可用于构建动态分析工具。目前的发行版本中自带了许多 Valgrind 工具，用于探测内存管理问题、线程问题等。它支持 MPI 程序的分析。

目前，实验室集群上安装 Valgrind 3.13 供大家使用。

Valgrind 各个工具的具体用法可以参考[官方文档](http://valgrind.org/)。

## 内存检测工具

Valgrind 默认的工具为 *Memcheck*，用于检测各种内存管理方面的问题，如：

- 内存访问越界；
- 内存泄漏；
- 使用未初始化的变量；
- 内存拷贝时目标内存块与源内存块重叠；

等等。

使用 Valgrind 之前，最好在编译代码时加上调试选项，如 `-g`。调试信息可以让 Valgrind 打印出问题发生的具体代码位置。
最简单的用法就是直接调用：

```bash
$ valgrind myprog
```

另一种方式是使用 OpenMPI。OpenMPI 可以支持 Valgrind，因此我们安装了一个相应的工具链供大家使用。示例如下：

```bash
ml gompi/2019a-debug
mpirun -np 4 -mca btl_tcp_if_include 172.16.0.0/24 \
valgrind ./myprog
```

上述命令中，`valgrind` 后也可以加上与 `Memcheck` 相关的选项。
