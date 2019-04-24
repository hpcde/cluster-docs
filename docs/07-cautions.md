---
id: cautions
title: 用户注意事项
---

1. 请勿在计算节点对用户信息进行操作（如更改密码等），因为信息可能不会及时更新到主节点。如果需要，请在主节点操作，修改密码和 shell 请使用`yppasswd`；

1. 针对用户安装软件包或库的需求，若是通用软件或库(即大量用户都可能会用到的软件包或库)，可反馈管理员安装到公用软件包区(/opt 或 /apps 目录下)；对于所有非通用软件包或库，用户必须自行安装到自己的用户目录(自己的$HOME目录)。  
> 注：使用 Python 的用户可以用 Anaconda3 安装 Python 包。使用 pip 的用户安装 python 包时，可以使用**pip install --user <package_name>**命令安装到用户自己$HOME目录，具体可参考[How can I install packages in my home folder with pip](https://stackoverflow.com/questions/7143077/how-can-i-install-packages-in-my-home-folder-with-pip);  

使用中出现任何不能自己解决的问题请联系管理员：[汪岸](mailto:wangan.cs@gmail.com)或[储根深](mailto:genshenchu@gmail.com)。

# 管理员注意事项

1. 请勿使用**root**用户进行编译调试程序等工作，请使用自己的账户进行这些操作。root 仅用于系统维护等工作；

1. **builder**账户：为系统安装软件时，尽量使用该账户；

1. **slurm**账户：SLURM 默认账户，也是 node24 上维护的 SLURM 数据库的管理员账户；

1. 如果重启了机器，请检查各节点的状态、各项服务是否已启动（nfs/nis/slurm/mysql等）。