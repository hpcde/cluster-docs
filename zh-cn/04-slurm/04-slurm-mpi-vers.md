# 三种MPI实现的用法对比

使用 OpenMPI 时，可以在申请资源后用 `srun` 命令执行你的程序；使用 MPICH/Intel MPI 时，在申请资源后请尽量用 `mpirun` 或 `mpiexec` 执行你的程序。

我们仍然以 *Vhagar* 分区为例，使用多线程时让每个物理核跑一个线程。示例中使用的编译器如下：

- OpenMPI - gompi/2019a 工具链；
- MPICH - gmpich/2016a 工具链；
- Intel MPI - intel/2019a 工具链。

## 提交MPI作业

申请2个节点，每个节点12个进程，把所有核都用上。以下是不同版本的脚本。

> 注：如果想把所有逻辑核都用上，就开24个进程。这样做的话，核内的通信快，有可能缩短计算时间。

**OpenMPI**

```bash
#!/bin/sh
#SBATCH -J computePI-ompi
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH --ntasks-per-node=12
#SBATCH -c 2 
ml gompi/2019a
mpicc -o computePI computePI.c
mpirun -mca btl_tcp_if_include 172.16.0.0/24 ./computePI
```

**MPICH**

```bash
#!/bin/sh
#SBATCH -J computePI-mpich
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH --ntasks-per-node=12
#SBATCH -c 2 
ml gmpich/2016a
mpicc -o computePI computePI.c
mpirun ./computePI
```

**Intel MPI**

```bash
#!/bin/sh
#SBATCH -J computePI-impi
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH --ntasks-per-node=12
#SBATCH -c 2 
ml intel/2019a
mpicc -o computePI computePI.c
mpirun ./computePI
```

**MPICH 和 Intel MPI 的说明**

Intel MPI 是基于 MPICH的，这两个的使用方式是类似的，即使用 `mpirun` 命令都不需要指明网卡或网段。

## 提交MPI/OpenMP作业

申请2个节点，每个节点2个进程，每个进程12个线程，让所有逻辑核都满负载。以下是不同版本的脚本。

> 注：申请计算资源时可以用 SLURM 提供的`--export`选项来传环境变量，默认是把用户在主节点加载的环境变量全部传过去。如果不用这种方式，就要像前面的小节演示的那样，显示地定义变量，或者作为参数传给 mpirun。 

**OpenMPI**

使用 OpenMPI 执行 MPI/OpenMP 混合程序时，要解除进程绑定，否则效率可能会很低。

```bash
#!/bin/sh
#SBATCH -J computePI-ompi
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH -n 4
#SBATCH -c 12
#SBATCH --export=ALL,OMP_NUM_THREADS=12
ml gompi/2019a
mpicc -fopenmp -o computePI computePI.c
mpirun -bind-to none -mca btl_tcp_if_include 172.16.0.0/24 ./computePI
```

**MPICH**

使用 MPICH 和基于 MPICH（如 Intel MPI, MVAPICH）的 MPI 实现时，推荐用 `srun` 代替 `mpirun`。这种方式更简单，且一般能得到正确的进程绑定、映射关系。

如果要使用 `mpirun`，请参考手册。

```bash
#!/bin/sh
#SBATCH -J computePI-mpich
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH -n 4
#SBATCH -c 12
#SBATCH --export=ALL,OMP_NUM_THREADS=12
ml gmpich/2016a
mpicc -fopenmp -o computePI computePI.c
srun --mpi=mpi2 ./computePI
```

**Intel MPI**

```bash
#!/bin/sh
#SBATCH -J computePI-impi
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH -n 4
#SBATCH -c 12
#SBATCH --export=ALL,OMP_NUM_THREADS=12
ml intel/2019a
mpiicc -qopenmp -o computePI computePI.c
srun --mpi=mpi2 ./computePI
```

> 注：IMPI 在编译 OpenMP 程序时用的选项是`-qopenmp`。

**提交非独占作业**

以上的例子都把整个节点的资源申请下来了。用户可以只申请节点的一部分资源，让其他人仍然能申请剩余的资源。

例如，我们要使用2个节点，每个节点只执行1个进程，该进程使用12个逻辑CPU。

```bash
#!/bin/sh
#SBATCH -J computePI-mpich
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH -n 2
#SBATCH -c 12
#SBATCH --export=ALL,OMP_NUM_THREADS=12
ml gmpich/2016a
mpicc -fopenmp -o computePI computePI.c
srun --mpi=mpi2 ./computePI
```

提交后，执行该作业的节点会处于 `mix` 状态，而剩余的资源（每节点12核，共24核剩余）仍然可以被别的作业使用。比如说，你可以再提交一次上面这个脚本，把剩余的也申请来使用。

**提交独占作业**

用户可能并没有用到节点上所有的资源，但又希望自己申请的节点不再被其他用户或作业使用。在上面的例子中，只要加上一个选项就可以独占节点。

```bash
#!/bin/sh
#SBATCH -J computePI-mpich
#SBATCH -o J%j-%x.log
#SBATCH -p Vhagar
#SBATCH -N 2
#SBATCH -n 2
#SBATCH -c 12
#SBATCH --export=ALL,OMP_NUM_THREADS=12
#SBATCH --exclusive
ml gmpich/2016a
mpicc -fopenmp -o computePI computePI.c
srun --mpi=mpi2 ./computePI
```
