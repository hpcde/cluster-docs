---
id: cluster-overview
title: 集群环境
---
import useBaseUrl from '@docusaurus/useBaseUrl';

**北京科技大学高性能计算与数据工程实验室 (High Performance Computing and Data Engineer Lab,HPC&DE Labs)** 隶属于北京科技大学计算机与通信工程学院。
实验室配有一套集群环境，用于支撑高性能计算、数据工程、机器学习等领域的学习与科研工作。

## 历史

2005 至 2009 年，架设第一批 Linux 服务器集群，用于高性能计算、数据工程、编译系统等领域的研究工作。

2013 至 2014 年，架设第一批 Windows Server 集群，配有相应存储节点、万兆交换机，用于社交网络、大数据等领域的研究工作。

2016 至 2018 年，架设小型的高性能计算集群，包括 24 个 CPU 节点、1 个 GPU 节点、1 个 飞腾节点和 1 个存储阵列。该集群可用于并行计算、社交网络、机器学习、大数据等领域的研究工作。

目前，实验室集群仅供给实验室内的各位老师、研究生与本科生作学习、研究用途，不对外开放。

本文档主要提供给 2016 至 2018 年搭建的高性能计算集群。

## 节点概况

该集群系统共有 24 个 CPU 计算节点，命名为 **node[01-24]**。每节点 2 个 Intel Xeon 处理器，其中

- *node[01-16]* 搭载 Intel Xeon E5-2620 v3
- *node[17-24]* 搭载 Intel Xeon E5-2620 v4

大部分节点都是计算节点，少数节点提供其他服务：

- *node01*：登录节点、NIS主节点、SLURM主节点；
- *node02*：登录节点、集群监控服务主节点；
- *node[03-04]*：为某些小组保留的节点；
- *node[05-12]*：计算节点；
- *node[13-16]*：Hadoop 集群；
- *node[17-23]*：计算节点；
- *node24*：集群数据库、软件管理节点；
- *nodegpu*：GPU 节点；
- *nodeft*：飞腾节点；
- *nodedata*：存储节点。

每一个节点都有两个以太网卡(eth0与eth1)，一个连入以太网(eth0)，一个接入外部互联网络(eth1)。除登录节点、GPU 节点、Hadoop 节点等需要单独连接外部网络的节点会同时开启两张网卡，其他节点都只开启一张网卡。

因此，计算节点本身并不直接连接外部网络，而是通过登录节点 *node01* 配置的NAT和IP转发来连接外部网络（例如使用 `yum`）。

此外，

- GPU节点采用一块NVIDIA Tesla K40m GPU, 安装有CUDA, tensorflow等环境, 可满足高性能计算和深度学习等需求；

- 飞腾节点采用国产飞腾CPU —— FT-1500A (arm v8 指令集)。

集群配置图如下：

<img alt="节点概况" src={useBaseUrl('users-assets/clusters_arch.svg')} />

## 操作系统

*node[01-24]* 均为 CentOS，除 *node[03-04]* 外，其他节点的系统、内核版本都是一致的，并且会定期更新。

*nodegpu* 为 CentOS 7.4.1810,x64。

*nodeft* 为麒麟操作系统。

## 集群资源


### 节点信息

集群只包含了部分机器，仍有许多机器是由使用人员远程登陆使用的。以下列出集群中已经包括和预计要包括的所有机器。

| 节点分区     | 节点                         | 数量 | 处理器型号                                                   | 超线程 | CPUs | 内存   | 说明        |
| ------------ | ---------------------------- | :--: | ------------------------------------------------------------ | ------ | ---- | ------ | ----------- |
| 登陆         | node[01-02]                  |  2   | 2 * E5-2620 v3, 2.40 GHz, 6 cores                            | ✓      | 24   | 64 GiB | 登陆节点    |
| **Vhagar**   | node[05-12]                  |  8   | 2 * E5-2620 v3, 2.40 GHz, 6 cores                            | ✓      | 24   | 64 GiB | 2016年机器  |
| **Balerion** | node[17-23]                  |  8   | 2 * E5-2620 v4, 2.10 GHz, 8 cores                            | ✓      | 32   | 64 GiB | 2018年机器  |
| **Viserion** | nodeft                       |  1   | 4 * Phytium FT1500a, 1.8 GHz, 4 cores                        | ✗      | 16   | 32 GiB | 未开放      |
| **Drogon**   | nodegpu                      |  1   | 1 * E5-2620 v4, 2.10 GHz, 8 cores<br />1 * NVIDIA Tesla K40m | ✓      | 32   | 16 GiB | 未开放      |
| 数据库       | node24                       |  8   | 2 * E5-2620 v4, 2.10 GHz, 8 cores                            | ✓      | 32   | 64 GiB | 管理员使用  |
| 其他         | node[03-04]<br />node[13-16] |  3   | 2 * E5-2620 v3, 2.40 GHz, 6 cores                            | ✓      | 24   | 64 GiB | 单独使用    |

### 存储信息

假定用户名为 `hpcer`。在登录节点上，我们为用户提供两种存储服务：本地存储和 NFS 存储。

- `/home/hpcer` 或 `$HOME`：用户家目录，目前是 *node01* 的本地存储，速度更快，但空间已经不太多了；

- `/home/hpcer/data` 或 `$HOME/data`：共享数据目录，使用 NFS，速度慢。该空间位于存储节点 *nodedata* 上，共有 50TB。

- `/data/hpcer`：与 `/home/hpcer/data` 相同。

> 注：使用集群节点运行程序时，如果程序会产生大量 I/O，请将程序放在 `$HOME/data` 目录下执行，或者将输出重定向到 `$HOME/data` 目录。如果在登录节点 *node01* 下进行大量 I/O，会使机器卡顿，影响其他用户使用。 

## 可用的软件

| 名称     | 说明          |
| -------- | ------------- |
| 软件管理 | Lmod 7.8      |
| 作业调度 | SLURM 18.08.5 |

所有预装的软件都可以用命令查看：

```
$ module spider
```

或

```
$ module spider <TAB><TAB>
```

常用软件列表见[预装软件](software/02-software-list.md)一节。

## 集群节点状态

集群安装了 Zabbix 用于监控集群的使用情况、节点的健康状况，校内网用户可访问以下网址查看：

- Zabbix: [http://view.hpcone.science/zabbix](http://view.hpcone.science/zabbix)

用户以 `Guest` 身份登录时，可以查看集群 CPU、内存、磁盘等资源的使用情况。

<img alt="Zabbix登录" src={useBaseUrl('users-assets/zabbix-login.jpg')} />

登录之后，点击左上角的 *Monitoring -> Dashboard*，可进入 **仪表盘**。每一个仪表盘都显示了集群的部分监控数据。目前开放的仪表盘有以下几个：

- **Global View** ：整体信息、报警、机柜分布图等；
- **CPU & Memory Usage** ：计算节点、登录节点、数据库节点的处理器和内存使用情况；
- **Disk Usage** ：磁盘使用情况；
- **Network Traffic** ：网络流量，包括局域网和节点与外部互联网的通信；
- **Individual Nodes** ：未加入作业调度系统的节点状况，目前为 *node[03-04]*；
- **Login Nodes** ：登录节点的状况；
- **Slurm Database** ：数据库节点的状况。

## 其他说明

集群登录节点对 CPU 占用有一定限制，多个用户同时在登录节点上运行程序时，CPU 使用率可能会很低，导致程序跑很长时间。因此，请尽量把程序[提交给调度系统](slurm/02-slurm-submit-jobs.md)，不要在登录节点上运行。
