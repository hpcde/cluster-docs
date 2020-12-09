---
id: terminal-multiplexer
title: 实用工具：终端多路复用器
---

使用实验室集群时，我们可能偶尔会遇到断开连接的情况，可能是主动断开SSH，也可能是网络不稳定。无论怎样，重新连接后是不会自动保存上一次的工作的（所在的路径、环境变量、打开的文件等）。

为了保存工作，便于重连后继续，我们可以让自己的程序或者shell在后台一直运行。

## 后台运行程序

参考：

- [Wikipedia - nohup](http://en.wikipedia.org/wiki/Nohup)

Linux上常用的后台执行程序的命令是`nohup`，它的功能是无视hangup信号，也就是在shell退出时不会自动被挂断。该命令默认会把原本到标准输出的东西重定向到一个文件。

```console
$ nohup ping nodedata
nohup: ignoring input and appending output to ‘nohup.out’
```

执行该命令后，退出shell不会中断它。实际上，它已经不再依赖于任何pts了。不过，我们直接在当前shell执行后（*foreground*），把自己的shell也阻塞了，因此我们要把程序放在后台执行（*background*）。

```console
$ ping nodedata &
```

执行该命令后，应该会fork一个新的shell来执行`ping nodedata`，输出仍然是标准输出，所以会出现这样的情况：屏幕不断地打印东西出来，但自己还是能正常敲其他命令。

作为后台运行的进程，直接用组合键`Control + C`是无法终止的。通常有两种方法用于终止一个后台执行的程序：

- 用`ps`找到进程号，用`kill`直接发送终止信号；
- 用`fg`把后台程序调到到前面，再`Control + C`终止。

了解`nohup`和`&`以后，我们可以组合两者，实现后台运行一个不依赖于当前shell的程序。

```console
$ nohup ping nodedata &
```

执行该命令后，仍然可以在当前shell做其他事情，因为`&`把程序转入后台，而`nohup`重定向了输出。也可以立马退出，因为`nohup`会无视SIGHUP信号。
