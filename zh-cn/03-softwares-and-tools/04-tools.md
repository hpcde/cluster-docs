# 常用工具

## [Vtune](https://software.intel.com/en-us/intel-vtune-amplifier-xe/) 性能分系软件
位置:/opt/intel/vtune_amplifier_2018.1.0.535340 或 /opt/intel/vtune_amplifier(软链接方式)  
备注:正版激活  
相关链接:  
https://software.intel.com/en-us/intel-vtune-amplifier-xe/  
https://software.intel.com/en-us/parallel-studio-xe/  
https://software.intel.com/en-us/qualify-for-free-software/student/  

## [cgdb](https://cgdb.github.io/)
CGDB是一款比gdb更好用、更强大的调试工具。
使用：
```bash
$ cgdb [cgdb options] [--] [gdb options]
```

## [sysstat](https://github.com/sysstat/sysstat)
The sysstat package contains various utilities, common to many commercial Unixes, to monitor system performance and usage activity:  
- iostat reports CPU statistics and input/output statistics for block devices and partitions.
- mpstat reports individual or combined processor related statistics.
- pidstat reports statistics for Linux tasks (processes) : I/O, CPU, memory, etc.
- tapestat reports statistics for tape drives connected to the system.
- cifsiostat reports CIFS statistics.

 Usages: Please visit [https://github.com/sysstat/sysstat](https://github.com/sysstat/sysstat) for more details.
 
## [nload](https://linux.die.net/man/1/nload)
nload is a console application which monitors network traffic and bandwidth usage in real time. It visualizes the in- and outgoing traffic using two graphs and provides additional info like the total amount of transfered data and min/max network usage.  
Usages：Please visit [https://linux.die.net/man/1/nload](https://linux.die.net/man/1/nload) for more details.

## [lm-sensors](https://github.com/groeck/lm-sensors)
lm-sensors是一款基于linux系统的硬件监控的软件。可以监控主板，CPU的工作电压，温度等数据。
使用:
```bash
$ sensors
```

## 代码统计工具[cloc](https://github.com/AlDanial/cloc)
cloc用于统计各语言代码量
位置:/opt/tools/cloc
使用方法:
```bash
$ cloc [代码目录]
```

示例:
```bash
$ cloc ./
      61 text files.
      61 unique files.                              
      18 files ignored.

github.com/AlDanial/cloc v 1.72  T=0.20 s (222.8 files/s, 42946.5 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
C/C++ Header                    14            750            494           3359
C++                             11            193            144           1141
XML                              6              0              0            931
C                                2             97             50            454
CMake                            9             62             34            340
make                             1            125             67            226
Markdown                         1              3              0             11
-------------------------------------------------------------------------------
SUM:                            44           1230            789           6462
-------------------------------------------------------------------------------
```
更多使用方式请参照:[https://github.com/AlDanial/cloc](https://github.com/AlDanial/cloc)

##  校园网登录工具 netlogin
如果需要在该机器上通过互联网下载一些东西,需要先登录校园网,请使用此工具进行登录。  
位置:/home/public/netlogin  
使用方法:
```bash
#普通登录(ipv4模式)
$ netlogin -u [校园网用户名] -p [校园网密码] 

# ipv6模式
#方式1：手动加入ipv6地址,ipv6地址可以使用ip addr 命令查询
$ netlogin -u [校园网用户名] -p [校园网密码]  -i [ipv6地址]
#方式2：使用自动获取ipv6地址
$ netlogin -u [校园网用户名] -p [校园网密码]  --autoipv6
```
详细信息请执行**netlogin --help**或**netlogin -h**命令查看  
```bash
$ netlogin --help
netlogin	0.1.0	Author:genshen | http://git.gensh.me/genshen/NetLogin

Usage: netlogin --username USERNAME [--password PASSWORD] [--ipv6addr IPV6ADDR] [--autoipv6]

Options:
  --username USERNAME, -u USERNAME
                         your student ID or job ID
  --password PASSWORD, -p PASSWORD
  --ipv6addr IPV6ADDR, -i IPV6ADDR
                         default='' login with ipv6 mode
  --autoipv6, -a         default='false' obtaining ipv6 address automatically and login with ipv6 mode
  --help, -h             display this help and exit
  --version              display version and exit
```
该校园网登录工具使用中有任何问题请到 http://git.gensh.me/genshen/NetLogin 上提issue或者联系作者([genshenchu@gmail.com](mailto:genshenchu@gmail.com))
