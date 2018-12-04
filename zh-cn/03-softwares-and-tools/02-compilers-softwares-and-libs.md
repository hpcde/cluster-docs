# 编译器、软件及库

集群上安装的软件及工具包列如下(2018/01/06更新)，可用的编译器及工具类软件也可以利用module工具查看：  
## 编译器类
| 名称  | 版本                        | 位置                                                              | module load 命令             | 备注                               |
| ----- | --------------------------- | ----------------------------------------------------------------- | ---------------------------- | ---------------------------------- |
| gcc   | 4.8.5                       | /usr/bin/gcc; /usr/bin/g++; /usr/bin/gfortran                     |                              | 系统默认                           |
| gcc   | 5.1.0                       | /opt/compilers/gcc/5.1.0                                          | module load gcc/5.1.0        |                                    |
| gcc   | 6.3.0                       | /opt/compilers/gcc/6.3.0                                          | module load gcc/6.3.0        |                                    |
| go    | 1.8.3                       | /opt/compilers/go/1.8.3                                           | module load go/1.8.3         | [go语言](https://golang.org)编译器 |
| go    | 1.9.2                       | /opt/compilers/go1.9.1                                            | module load go/1.9.2         |                                    |
| icc   | 2018.1.163(18.0.1.20171018) | /opt/intel/compilers_and_libraries_2018.1.163/linux/[bin/intel64] | module load icc/2018.1.163   | 正版激活                           |
| clang | 6.0.0                       | /opt/compilers/llvm/6.0.0                                         | module load llvm-clang/6.0.0 | c/c++编译器名称：clang/clang++     |

说明:
主节点上系统默认的gcc版本为gcc 4.8.5版本,计算结点上系统默认的gcc版本为4.4.7。

## mpi编译器
| 名称      | 版本       | 位置                       | module load 命令                | 备注     |
| --------- | ---------- | -------------------------- | ------------------------------- | -------- |
| mpich     | 3.2        | /opt/mpi/mpich/3.2         | module load mpi/mpich/3.2       |          |
| intel mpi | 2018.1.163 | /opt/intel/impi/2018.1.163 | module load mpi/impi/2017.4.196 | 正版激活 |
| openmpi   | 1.6.5      | /opt/mpi/openmpi/1.6.5     | module load mpi/openmpi/1.6.5   |          |
| openmpi   | 1.8.8      | /opt/mpi/openmpi/1.8.8     | module load mpi/openmpi/1.8.8   |          |

## 各类工具类软件(含各类解释器)
| 名称   | 版本       | 位置                     | module load 命令              | 备注                               |
| ------ | ---------- | ------------------------ | ----------------------------- | ---------------------------------- |
| CMake  | 3.0.2      | /opt/tools/cmake/3.0.2   | module load cmake/3.0.2       |                                    |
| CMake  | 3.8.0      | /opt/tools/cmake/3.8.0   | module load cmake/3.8.0       |                                    |
| Docker | 17.05.0-ce | /opt/tools/docker        | module load docker/17.05.0-ce | [@docker](https://www.docker.com/) |
| Git    | 1.8.3.1    | /usr/bin/git             |                               | 系统默认                           |
| Python | 2.7.5      | /usr/bin/python          |                               | 系统默认                           |
| Python | 2.7.14     | /opt/tools/python/2.7.14 | module load python/2.7.14     |                                    |
| Python | 3.6.4      | /opt/tools/python/3.6.4  | module load python/3.6.4      |                                    |
| Qt     | 4.8.6      | /opt/tools/qt/4.8.6      | module load qt/ 4.8.6         |                                    |
| Qt     | 5.4.2      | /opt/tools/qt/5.4.2      | module load qt/5.4.2          |                                    |
| swig   | 3.0.12     | /opt/tools/swig/3.0.12   | module load swig/3.0.12       |                                    |

## 数据库类
| 名称  | 版本   | 位置               | module load 命令         | 备注 |
| ----- | ------ | ------------------ | ------------------------ | ---- |
| MySQL | 5.7.19 | /opt/dbs/mysql/5.7 | module load mysql/5.7.19 |      |

## 数学库
所以数学库均放在**/opt/librarys/mathlibs/**目录下,目前安装有:
 - [fftw](http://fftw.org/)
 - [gsl](http://www.gnu.org/software/gsl/)
 