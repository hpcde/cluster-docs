# 调试并行程序

多线程、多进程的程序需要额外的调试技巧和工具。

虽然 GDB 最常用于调试串行程序，但它也完全支持多线程的调试。具体可以参考 GDB 文档。
然而，使用 GDB 调试多进程程序（如 MPI 程序）并不是很方便。本节的目的是为大家提供一些调试并行代码的方法和工具，包括：

- 使用串行调试工具；
- 使用并行调试工具。

## 使用 GDB 调试 MPI 程序

MPI 程序往往会有多个进程，使用 GDB 调试的最简单的方法就是把 GDB **绑到（attach）** 某个进程上，调试这个进程。

```bash
$ gdb -p pid
```

其中，`pid` 是待绑的进程号。换句话说，只要用户能够获取到运行中的进程的进程号，就可以用 GDB 调试它。为了达到这个目的，我们一般可以采用两种方法：

- 程序运行后，使用 `ps` 或 `top` 等命令查看进程号，然后将 GDB 绑到进程上；
- 在程序中植入一段代码，把所有进程都卡住，再将 GDB 绑到进程上。

第一种方式下，我们无法控制切入的位置。这种方式一般可用于查看代码卡在哪个位置（类似于使用 core dump 文件），只要绑到进程后使用 GDB 的 `backtrace` 命令即可。

第二种方式应用很广。例如，我们可以在 C++ 代码中植入一段：

```c++
{
    volatile int f = 0;
    while (f == 0)
        sleep(5);
}
```

这是最简单的形式，所有进程都会停在这个死循环内。随后，用户可以 SSH 到计算节点上，加载环境变量（这样能最大程度显示调试信息），再把 GDB 绑到进程上，进行调试工作。

```bash
$ gdb -p pid

(gdb) bt
```

上述命令将 GDB 绑好，并查看当前进程的调用栈。也可以先启动 GDB，再用 GDB 的命令来绑进程：

```bash
$ gdb

(gdb) attach pid
(gdb) bt
```

无论哪种方式，绑好之后，进程应该是停在 `while` 处的。随后，我们将变量 `f` 的值修改为非 0，让程序能继续执行。再往后，可以像调试串行程序一样操作。

```bash
(gdb) set var f=1
```

### 打印节点名和进程号

如果进程数量很多，且同一节点上可能有很多进程，我们直接通过 `ps` 等命令不容易找到出问题的那一个（或一些）。在 Linux 上，我们用头文件 `unistd.h` 中声明的函数可以完成这点。

改进后的代码看上去如下：

```c++
#include <unistd.h>

...

{
    volatile int f = 0;
    char hostname[256];
    gethostname(hostname, sizeof(hostname));
    printf("PID %d on %s is ready for attach.", getpid(), hostname);
    fflush(stdout);
    while (f == 0)
        sleep(5);
}
```

这个代码块会打印出进程号和 Linux 主机名，告知用户该进程已经卡在代码块所在位置。随后，用户可以将 GDB 绑到该进程，进行调试。

### 利用环境变量作为调试开关

用户可以把前面说的代码块封装到函数、方法里，便于使用。另一方面，还可以设置一个环境变量来决定是否启用这段代码。我们给出两种改进后的代码：

- 所有进程卡在死循环，调试一个进程时，其他进程不会继续执行；
- 所有进程卡在一个 Barrier 处，调试一个进程时，其他进程可以执行到下一个 MPI 同步位置。

以下是第一种改进的示例代码：

```c++
#include <unistd.h>

...

static void wait_for_debugger()
{
    if (getenv("MPI_DEBUG") != nullptr) {
        volatile int f = 0;
        char hostname[256];
        gethostname(hostname, sizeof(hostname));
        printf("PID %d on %s is ready for attach.", getpid(), hostname);
        fflush(stdout);
        while (f == 0)
            sleep(5);
    }
}
```

这个代码块会把所有进程都卡在 `while` 内，一次只能让一个进程继续执行。

以下是第二种改进的示例代码：

```c++
#include <unistd.h>

...

static void wait_for_debugger()
{
    int rank, a_rank;
    char *env_rank;
    int a_rank;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    env_rank = getenv("MPI_DEBUG_RANK");
    a_rank = (env_rank == nullptr)? 0 : atoi(env_rank);

    if (getenv("MPI_DEBUG") != nullptr && a_rank == rank) {
        volatile int f = 0;
        char hostname[256];
        gethostname(hostname, sizeof(hostname));
        printf("PID %d on %s is ready for attach.", getpid(), hostname);
        fflush(stdout);
        while (f == 0)
            sleep(5);
    }
    MPI_Barrier(MPI_COMM_WORLD);
}
```

上述代码使用了两个环境变量，其中，

- `MPI_DEBUG` 用于确定要不要启动这段调试代码；
- `MPI_DEBUG_RANK` 用于指定要调试的进程，如果该环境变量未定义，则调试 0 号进程。

这个代码块会把所有进程（除了待调试的）卡在 `MPI_Barrier` 处，而把待调试的进程卡在 `while` 内。当待调试进程执行到 `MPI_Barrier` 时，所有进程都可以继续执行，直到下一个同步（或死循环）。

## 使用 TotalView 调试 MPI 程序

TotalView 是产品级的全能（full-featured）并行程序调试工具。

实验室登录节点 *node02* 上安装了 TotalView 2019。由于是教育许可，目前该软件仅能在 *node02* 上使用。

TotalView 有 GUI 和 CLI，启用 CLI 的命令为 `totalviewcli`，使用方法与 GDB 类似。

```bash
$ ml TotalView
$ totalviewcli
```

详细使用方法请参考官方网站 [TotalView for HPC](https://www.roguewave.com/products-services/totalview)。官网中有用户手册、教学视频等资源。
