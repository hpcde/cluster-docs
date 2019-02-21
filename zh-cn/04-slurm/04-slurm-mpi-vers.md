# 三种MPI实现的用法对比

使用 OpenMPI 时，可以在申请资源后用 `srun` 命令执行你的程序；使用 MPICH/Intel MPI 时，在申请资源后请尽量用 `mpirun` 或 `mpiexec` 执行你的程序。

我们仍然以*Vhagar*分区为例，使用多线程时让每个物理核跑一个线程。使用的编译器如下：

- OpenMPI - gompi/2019a 工具链；
- MPICH - gmpich/2016a 工具链；
- Intel MPI - intel/2019a 工具链。

## 提交MPI作业

申请2个节点，每个节点12个进程，把所有核都用上。以下是不同版本的脚本。

**OpenMPI**

编译：

```
$ ml gompi/2019a
$ mpicc -o computePI computePI.c
```

运行：

```
#!/bin/sh
#SBATCH -J computePI-ompi
#SBATCH -o J%j-%x.log
#SBATCH -N 2
#SBATCH --ntasks-per-node=12
#SBATCH -c 2 
ml gompi/2019a
mpirun -n 24 -mca btl_tcp_if_include 172.16.0.0/24 ./computePI
```

**MPICH**

编译：

```
$ ml gmpich/2016a
$ mpicc -o computePI computePI.c
```

运行：

```
#!/bin/sh
#SBATCH -J computePI-mpich
#SBATCH -o J%j-%x.log
#SBATCH -N 2
#SBATCH --ntasks-per-node=12
#SBATCH -c 2 
ml gmpich/2016a
mpirun -n 24 ./computePI
```

**Intel MPI**

编译：

```
$ ml intel/2019a
$ mpiicc -o computePI computePI.c
```

运行：

```
#!/bin/sh
#SBATCH -J computePI-impi
#SBATCH -o J%j-%x.log
#SBATCH -N 2
#SBATCH --ntasks-per-node=12
#SBATCH -c 2 
ml intel/2019a
mpirun -n 24 ./computePI
```

> 注：MPICH 和 IMPI 的 `mpirun` 命令都不需要指明网卡或网段。

## 提交MPI/OpenMP作业

申请2个节点，每个节点2个进程，每个进程6个线程，把所有核都用上。以下是不同版本的脚本。

**OpenMPI**

编译：

```
$ ml gompi/2019a
$ mpicc -fopenmp -o computePI computePI.c
```

运行：

```
#!/bin/sh
#SBATCH -J computePI-ompi
#SBATCH -o J%j-%x.log
#SBATCH -N 2
#SBATCH -n 4
#SBATCH -c 12
ml gompi/2019a
export OMP_NUM_THREADS=6
mpirun -n 4 --bind-to none -x OMP_NUM_THREADS -mca btl_tcp_if_include 172.16.0.0/24 ./computePI
```

**MPICH**

编译：

```
$ ml gmpich/2016a
$ mpicc -fopenmp -o computePI computePI.c
```

运行：

```
#!/bin/sh
#SBATCH -J computePI-mpich
#SBATCH -o J%j-%x.log
#SBATCH -N 2
#SBATCH -n 4
#SBATCH -c 12
ml gmpich/2016a
mpirun -n 4 -env OMP_NUM_THREADS 6 ./computePI
```

**Intel MPI**

编译：

```
$ ml intel/2019a
$ mpiicc -qopenmp -o computePI computePI.c
```

运行：

```
#!/bin/sh
#SBATCH -J computePI-impi
#SBATCH -o J%j-%x.log
#SBATCH -N 2
#SBATCH -n 4
#SBATCH -c 12 
ml intel/2019a
mpirun -n 4 -env OMP_NUM_THREADS 6 ./computePI
```

> 注：IMPI 在编译 OpenMP 程序时用的选项是`-qopenmp`。