# module工具
集群使用module工具进行用户环境变量管理,MPI库的加载、切换,gcc版本切换等都需要使用module工具完成。

## 什么是module
一句话概:[module](http://modules.sourceforge.net/)主要是为用户提供动态的环境变量修改以实现类似于切换mpi版本的功能。

## 使用举例
- module avail 查看所有module(即软件包)  

```shell
$ module avail

--------------------------------- /usr/share/Modules/modulefiles -------------------------------------------------------------------
dot         module-git  module-info modules     null        use.own

--------------------------------- /etc/modulefiles----------------------------------------------------------------------------------
cmake/3.0.2         gcc/5.1.0           go/1.8.3            icc/2018.1.163      mpi/mpich/3.2       mysql/5.7.19        qt/4.8.6
cmake/3.8.0         gcc/6.3.0           go/1.9.2            llvm-clang/6.0.0    mpi/openmpi/1.6.5   python/2.7.14       qt/5.4.2
docker/17.05.0-ce   glibc/2.14          hdf5/1.8.18         mpi/impi/2018.1.163 mpi/openmpi/1.8.8   python/3.6.4        swig/3.0.12
```
- module load 加载module  

```shell
$ gcc --version
gcc (GCC) 4.8.5 20150623 (Red Hat 4.8.5-16)
Copyright (C) 2015 Free Software Foundation, Inc.
...

$ module load gcc/6.3.0 
$ gcc --version
gcc (GCC) 6.3.0
Copyright (C) 2016 Free Software Foundation, Inc.
...
```

```shell
$ mpicc -v
-bash: mpicc: command not found

$ module load mpi/mpich/3.2 
$ mpicc -v
mpicc for MPICH version 3.2
Using built-in specs.
COLLECT_GCC=gcc
...
```
- module unload 卸载module  

- module switch 切换module   
 更多信息请参考[http://modules.sourceforge.net/](http://modules.sourceforge.net/)及module --help
 
## 说明
 - 由于Fortran编译器是包含在gcc中的,不同版本Fortran的加载与切换直接加载或切换gcc