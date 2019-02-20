# 提交OpenMP/MPI作业

这一小节，我们用几个实例来演示如何提交 OpenMP/MPI 作业。为了方便，我们统一使用`sbatch`，给出脚本文件。以下的所有实例都在分区*Vhagar*上完成。*Vhagar*分区的节点具有2个6核处理器，每个核支持超线程执行，共计24个可用于分配的CPU。

## 运行OpenMP程序

测试程序*omptest.c*会申请数GB内存空间，初始化变量并对变量求和，求和的过程使用 OpenMP 完成。以下是实例。

申请1个节点，1个进程，24个逻辑CPU：

```
#!/bin/sh
#SBATCH -J omptest1
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24
srun omptest
```

申请1个节点，1个进程，24个逻辑CPU，但只起12个线程：

```
#!/bin/sh
#SBATCH -J omptest2
#SBATCH -N 1
#SBATCH -n 1
#SBATCH -c 24
export OMP_NUM_THREADS=12
srun omptest
```

申请1个节点，2个进程，每进程12个逻辑CPU，此时运行两份程序：

```
#!/bin/sh
#SBATCH -J omptest3
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12
srun omptest
```

申请1个节点，2个进程，每进程12个逻辑CPU，但每进程只起6个线程：

```
#!/bin/sh
#SBATCH -J omptest4
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12
export OMP_NUM_THREADS=6
srun omptest
```

> 注：以上两类用法可以自行对比，用超线程和不用超线程取决于程序的优化，否则，盲目使用超线程可能会增加程序运行时间。

## 运行MPI程序

测试程序*computePI*使用数值积分公式计算圆周率*PI*，每个MPI进程完成一部分计算，最终使用归约得到所求的值。以下是实例。

> 注：这里的例子基本都用工具链*gompi/2019a*编译，里面包括OpenMPI-3.1.3。使用前先执行加载命令
>
> `$ ml gompi/2019a`

**在单节点上运行**

申请1个节点，24个进程，每进程1个逻辑CPU：

```
#!/bin/sh
#SBATCH -J pi-p24
#SBATCH -N 1
#SBATCH -n 24
ml gompi/2019a
mpirun -np 24 computePI
```

申请1个节点，12个进程，把所有CPU（逻辑）都占住：

```
#!/bin/sh
#SBATCH -J mpitest1
#SBATCH -N 1
#SBATCH -n 12
ml gompi/2019a
mpirun -np 12 computePI
```

**在多节点上运行**

实验室的计算节点都有两张网卡，目前只有一张网卡能用，今后可能会连接到其他的高速网络。在使用OpenMPI时，需要指定使用的网卡，或者指定子网。

申请4个节点，每节点1个进程：

```
#!/bin/sh
#SBATCH -J mpitest2
#SBATCH -N 4
#SBATCH -n 4
ml gompi/2019a
mpirun -np 4 -mca btl_tcp_if_include enp3s0f0 computePI

# specify subnets
# mpirun -np 4 -mca btl_tcp_if_include 172.16.0.0/24 computePI
```

> 注：也可以用`--ntasks-per-node=1`替换`-n 4`。

申请4个节点，每节点12个进程，共48个进程：

```
#!/bin/sh
#SBATCH -J computePI
#SBATCH -N 4
#SBATCH -n 48
ml gompi/2019a
mpirun -np 48 -mca btl_tcp_if_include 172.16.0.0/24 computePI
```

> 注：也可以用`--ntasks-per-node=12`替换`-n 48`。

**其他版本的MPI**

上面的例子用的都是OpenMPI，如果使用MPICH，格式大致如下：

```
ml gmpich/2016a
ml gmpich/2016a
mpirun -np 4 ./computePI
```

后面的可执行程序名字前要加上`./`，以便MPICH的命令能正确识别。

## 运行MPI/OpenMPI混合程序

测试程序*computePI-hybrid*在*computePI*的基础上增加了OpenMP指导语句，让核心的循环被多个线程同时执行，最后归约得到该进程的值，再归约得到最终结果。

**在单节点上运行**

申请1个节点，1个进程，24个逻辑CPU，但只起12个线程：

```
#!/bin/sh
#SBATCH -J computePI-hybrid
#SBATCH -N 1
#SBATCH -c 24
ml gompi/2019a
mpirun --bind-to none -np 1 -x OMP_NUM_THREADS=12 -mca btl_tcp_if_include 172.16.0.0/24 computePI-hybrid
```

> 注：OpenMPI默认会把进程绑定到核，所以这里使用了`--bind-to none`。

申请1个节点，2个进程，共24个逻辑CPU，每个进程起6个线程：

```
#!/bin/sh
#SBATCH -J computePI-hybrid
#SBATCH -N 1
#SBATCH -n 2
#SBATCH -c 12
ml gompi/2019a
mpirun --bind-to none -np 2 -x OMP_NUM_THREADS=6 -mca btl_tcp_if_include 172.16.0.0/24 computePI-hybrid
```

**在多节点上运行**

申请4个节点，每节点1个进程，每进程24个逻辑CPU，但只起12个线程：

```
#!/bin/sh
#SBATCH -J computePI-hybrid
#SBATCH -N 4
#SBATCH -n 4
#SBATCH -c 24
ml gompi/2019a
mpirun --bind-to none -np 4 -x OMP_NUM_THREADS=12 -mca btl_tcp_if_include 172.16.0.0/24 computePI-hybrid
```

**其他版本的MPI**

上面的例子用的都是OpenMPI，如果使用MPICH，格式大致如下：

```
ml gmpich/2016a
mpirun -np 4 -env OMP_NUM_THREADS 12 ./computePI-hybrid
```
