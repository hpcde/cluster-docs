# 提交OpenMP/MPI作业

这一小节，我们用几个实例来演示如何提交 OpenMP/MPI 作业。为了方便，我们统一使用`sbatch`，给出脚本文件。以下的所有实例都在分区*Vhagar*上完成。*Vhagar*分区的节点具有2个6核处理器，每个核支持超线程执行，共计24个可用于分配的CPU。

> 注：用户可以用多种 MPI 版本、多种提交命令来提交 OpenMP/MPI 作业。本节中，示例均由 OpenMPI 完成。

> 注：不同的 MPI 实现可能会有不同的性能。

## 运行OpenMP程序

测试程序 *omptest.c* 会申请数GB内存空间，初始化变量并对变量求和，求和的过程使用 OpenMP 完成。以下是实例。

申请1个节点，1个进程，24个逻辑CPU：

```bash
#!/bin/sh
#SBATCH -J omptest1
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24
srun omptest
```

申请1个节点，1个进程，24个逻辑CPU，但只起12个线程：

```bash
#!/bin/sh
#SBATCH -J omptest2
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24
export OMP_NUM_THREADS=12
srun omptest
```

申请1个节点，2个进程，每进程12个逻辑CPU，此时运行两份程序：

```bash
#!/bin/sh
#SBATCH -J omptest3
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12
srun omptest
```

申请1个节点，2个进程，每进程12个逻辑CPU，起12个线程：

```bash
#!/bin/sh
#SBATCH -J omptest4
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 2
export OMP_NUM_THREADS=12
srun omptest
```

> 注：以上两类用法可以自行对比，用超线程和不用超线程取决于程序是怎么写的，否则，盲目使用超线程可能会增加程序运行时间。

## 运行MPI程序

测试程序 *computePI* 使用数值积分公式计算圆周率，每个MPI进程完成一部分计算，最终使用归约得到所求的值。以下是实例。

> 注：这里的例子使用工具链 *gompi/2019a* 编译，该工具链中包括OpenMPI-3.1.3。也就是说，加载该工具链也就加载了相应的 GCC 和 OpenMPI。
> 
> `$ ml gompi/2019a`

**在单节点上运行**

申请1个节点，24个进程，每进程1个逻辑CPU：

```bash
#!/bin/sh
#SBATCH -J cpi-N1n24
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 24

## 加载编译器
ml gompi/2019a

## 编译源代码
mpicc -fopenmp computePI.c -o computePI

## 执行程序
mpirun ./computePI
```

> 在这个例子中，我们把编译任务也一并提交了。实际的编译工作会由一个进程来完成，通常也就是一个核。

申请1个节点，12个进程，把所有CPU（逻辑）都占住：

```bash
#!/bin/sh
#SBATCH -J cpi-N1n12c2
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 12
#SBATCH -c 2
ml gompi/2019a
mpicc -fopenmp computePI.c -o computePI
mpirun ./computePI
```

**在多节点上运行**

实验室的计算节点都有两张网卡，目前只有一张网卡能用，今后可能会连接到其他的高速网络。在使用OpenMPI时，需要指定使用的网卡，或者指定子网。

申请4个节点，每节点1个进程：

```bash
#!/bin/sh
#SBATCH -J cpi-N4n4
#SBATCH -p Vhagar
#SBATCH -N 4
#SBATCH -n 4
ml gompi/2019a
mpicc -fopenmp computePI.c -o computePI

## 指定用于通信的网段
mpirun -mca btl_tcp_if_include 172.16.0.0/24 computePI

## 指定用于通信的网卡
# mpirun -mca btl_tcp_if_include enp3s0f0 ./computePI
```

> 注：也可以用`--ntasks-per-node=1`替换`-n 4`。

申请4个节点，每节点12个进程，共48个进程：

```bash
#!/bin/sh
#SBATCH -J cpi-N4n48
#SBATCH -p Vhagar
#SBATCH -N 4
#SBATCH -n 48
#SBATCH -c 2
ml gompi/2019a
mpicc -fopenmp computePI.c -o computePI
mpirun -mca btl_tcp_if_include 172.16.0.0/24 ./computePI
```

> 注：也可以用`--ntasks-per-node=12`替换`-n 48`。

## 运行MPI/OpenMPI混合程序

测试程序 *computePI-hybrid* 在 *computePI* 的基础上增加了 OpenMP 指导语句，让核心的循环被多个线程同时执行，最后归约得到该进程的值，再归约得到最终结果。

**在单节点上运行**

申请1个节点，1个进程，24个逻辑CPU，但只起12个线程：

```bash
#!/bin/sh
#SBATCH -J cpi-hybrid-N1c24
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -c 24
ml gompi/2019a
mpicc -fopenmp computePI.c -o computePI
mpirun --bind-to none -x OMP_NUM_THREADS=12 -mca btl_tcp_if_include 172.16.0.0/24 ./computePI-hybrid
```

> 注：OpenMPI默认会把进程绑定到核，所以这里使用了`--bind-to none`。

申请1个节点，2个进程，共24个逻辑CPU，每个进程起12个线程：

```bash
#!/bin/sh
#SBATCH -J cpi-hybrid-N1n2c12
#SBATCH -p Vhagar
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12
ml gompi/2019a
mpicc -fopenmp computePI.c -o computePI
mpirun --bind-to none -x OMP_NUM_THREADS=12 -mca btl_tcp_if_include 172.16.0.0/24 ./computePI-hybrid
```

**在多节点上运行**

申请4个节点，每节点1个进程，每进程24个逻辑CPU，但只起12个线程：

```bash
#!/bin/sh
#SBATCH -J cpi-hybrid-N4n4c24
#SBATCH -p Vhagar
#SBATCH -N 4
#SBATCH -n 4
#SBATCH -c 24
ml gompi/2019a
mpicc -fopenmp computePI.c -o computePI
mpirun --bind-to none -x OMP_NUM_THREADS=12 -mca btl_tcp_if_include 172.16.0.0/24 ./computePI-hybrid
```
