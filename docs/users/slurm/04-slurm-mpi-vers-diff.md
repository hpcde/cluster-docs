---
id: mpi-version-diff
title: MPI的不同实现
---


目前，集群上安装了三种不同MPI实现：MPICH、OpenMPI和Intel MPI。使用MPICH时，既可以用`mpirun`也可以用`srun`来执行你的程序；使用Intel MPI时，暂时只能用`mpirun`或`mpiexec`。

三种MPI实现除了进程管理可能不太一样之外，编译器也可能不同。使用Lmod时，加载了MPI之后可以检查一下MPI的版本，看看它使用的编译器是GCC、Clang还是Intel。

- OpenMPI - gompi/2019a 工具链；
- MPICH - gmpich/2016a 工具链；
- Intel MPI - intel/2019a 工具链。
