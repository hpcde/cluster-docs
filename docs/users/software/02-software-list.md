---
id: software-list
title: 公共软件列表
---

## 编译 & 运行时

| 软件包        | 说明                                                         | 加载        |
| ------------- | ------------------------------------------------------------ | ----------- |
| gompi@2020b   | GCC, OpenMPI, Git, CMake, Autoconf, Automake                 | Spack       |
| gmpich@2020b  | GCC, MPICH, Git, CMake, Autoconf, Automake                   | Spack       |
| cgompi@2020b  | GCC, Clang, OpenMPI, Git, CMake, Autoconf, Automake          | Spack       |
| cgmpich@2020b | GCC, Clang, MPICH, Git, CMake, Autoconf, Automake            | Spack       |
| foss@2020b    | GCC, OpenMPI, Git, CMake, Autoconf, Automake, OpenBLAS, ScaLAPACK, FFTW, ParMETIS, PETSc | Spack       |
| gompi/2019a   | GCC, OpenMPI                                                 | Lmod        |
| gmpich/2019a  | GCC, MPICH                                                   | Lmod        |
| cgmpich/2018a | GCC, Clang, MPICH                                            | Lmod        |
| foss/2019a    | GCC, OpenMPI, OpenBLAS, ScaLAPACK, FFTW                      | Lmod        |
| gcc           | GNU Compiler Collection                                      | Spack, Lmod |
| llvm          | Clang, libc++, libompt                                       | Spack, Lmod |
| mpich         | MPICH                                                        | Spack, Lmod |
| openmpi       | OpenMPI                                                      | Spack, Lmod |
| hpx           | High Performance ParalleX, a runtime system for high performance computing | Spack       |
| go            | Go language                                                  | Spack, Lmod |
| julia         | Julia language                                               | Spack       |
| autoconf      | Autotools                                                    | Spack, Lmod |
| automake      | Autotools                                                    | Spack, Lmod |
| cmake         | CMake build system                                           | Spack, Lmod |
| ninja         | Ninja build system                                           | Spack       |

## 程序分析 & 调试

| 软件包     | 说明                                   | 加载        |
| ---------- | -------------------------------------- | ----------- |
| valgrind   | Valgrind                               | Spack, Lmod |
| gperftools | Google performance tools               | Spack       |
| scorep     | Score-P, Cube, OPARI2, OTF2            | Spack, Lmod |
| hpctoolkit | HPCToolkit                             | Spack       |
| cgdb       | An interface to the GNU Debugger (GDB) | Spack, Lmod |


## C/C++

| 软件包     | 说明                                                      | 加载        |
| ---------- | --------------------------------------------------------- | ----------- |
| boost      | A set of free peer-reviewed portable C++ source libraries | Spack, Lmod |
| googletest | GTest, GMock                                              | Spack, Lmod |
| benchmark  | Google benchmark                                          | Spack       |
| lcov       | A graphical front-end for gcov                            | Spack       |
| fmt        | A modern formatting library for C++                       | Spack       |
| tinyxml2   | A simple, small, efficient, C++ XML parser                | Spack       |
| pugixml    | A light-weight C++ XML processing library                 | Spack       |
| yaml-cpp   | A YAML parser and emitter in C++                          | Spack       |
| toml11     | A C++11 (or later) header-only toml parser/encoder        | Spack       |

## Python

| 软件包    | 说明                                                   | 加载        |
| --------- | ------------------------------------------------------ | ----------- |
| python    | Python distribution                                    | Spack       |
| Anaconda3 | Distribution of the Python and R programming languages | Lmod        |
| swig      | The Simplified Wrapper and Interface Generator (SWIG)  | Spack, Lmod |

## 科学计算

| 软件包      | 说明                                                         | 加载        |
| ----------- | ------------------------------------------------------------ | ----------- |
| netcdf-c    | netCDF C library                                             | Spack, Lmod |
| netcdf-cxx4 | netCDF-4 C++ library                                         | Spack, Lmod |
| hdf5        | Hierarchical Data Format (HDF) 5                             | Spack, Lmod |
| metis       | Serial graph partitioning programs                           | Spack, Lmod |
| parmetis    | Parallel Graph Partitioning and Fill-reducing Matrix Ordering (ParMETIS) | Spack, Lmod |
| openblas    | An optimized BLAS library                                    | Spack, Lmod |
| scalapack   | Scalable Linear Algebra PACKage (ScaLAPACK)                  | Spack, Lmod |
| fftw        | A C library for computing discrete Fourier transform (DFT)   | Spack, Lmod |
| petsc       | A suite of data structures and routines for the scalable (parallel) solution of scientific applications modeled by PDEs | Spack, Lmod |