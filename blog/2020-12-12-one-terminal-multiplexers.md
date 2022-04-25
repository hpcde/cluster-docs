---
slug: one-terminal-multiplexers
title: 实用工具：Terminal Multiplexers
author: one
author_title: PhD student at USTB
author_url: https://github.com/alephpiece
author_image_url: https://github.com/alephpiece.png
tags: [tool, screen, tmux]
---

使用实验室集群时，我们可能偶尔会遇到断开连接的情况，可能是主动断开SSH，也可能是网络不稳定。无论怎样，重新连接后不会自动恢复上一次的工作（所在的路径、环境变量、打开的文件等）。

为了保存工作，便于重连后继续，我们可以让自己的程序或者 shell 在后台一直运行。保持程序后台运行的方式/工具有很多，本文简单介绍以下几种：

- `nohup` 和 `&`
- `screen`
- `tmux`

<!--truncate-->

## 后台运行程序：nohup 和 &

参考：

- [Wikipedia - nohup](https://en.wikipedia.org/wiki/Nohup)

Linux上常用的后台执行程序的命令是 `nohup`，它的功能是无视 hangup 信号，也就是在 shell 退出时不会自动被挂断。该命令默认会把原本到标准输出的东西重定向到一个文件。

```bash
$ nohup ping nodedata
nohup: ignoring input and appending output to ‘nohup.out’
```

执行该命令后，退出 shell 不会中断它。实际上，它已经不再依赖于任何 pts 了。不过，我们直接在当前shell执行后（*foreground*），把自己的 shell 也阻塞了，因此我们要把程序放在后台（*background*）。

```bash
$ ping nodedata &
```

执行该命令后，会产生一个 subshell 来执行 `ping nodedata`，输出仍然是标准输出，所以会出现这样的情况：屏幕不断地打印东西出来，但自己还是能正常敲其他命令。

作为后台运行的进程，直接用组合键 `Control + c` 是无法终止的。通常有两种方法用于终止一个后台执行的程序：

- 用 `ps` 找到进程号，用 `kill` 直接发送终止信号；
- 用 `fg` 把后台程序调到到前面，再 `Control + c` 终止。

了解 `nohup` 和 `&` 以后，我们可以组合两者，实现后台运行一个不依赖于当前 shell 的程序。

```bash
$ nohup ping nodedata &
```

执行该命令后，仍然可以在当前shell做其他事情，因为 `&` 把程序转入后台，而 `nohup` 重定向了输出。也可以立马退出，因为 `nohup` 会无视SIGHUP信号。

## Terminal multiplexers

参考：

- [Wikipedia - Terminal multiplexer](https://en.wikipedia.org/wiki/Terminal_multiplexer)

终端多路复用器（terminal multiplexers）就是一种创建多个伪终端（会话）的程序，达到类似于“多路复用”的状态。相比于 `nohup` 通常只用于跑单个程序，我们使用 multiplexer 可以很容易地在一个登录的终端中管理大量会话，每个会话都有自己的shell。

一个会话通常有 *attached* 和 *detached* 两种状态，attached 表示有某个 shell 正在使用它（可以同时从多个 shell 进入同一会话），detached 表示它没被使用。

处于一个会话中时，通常要使用组合键来向 multiplexer 发送命令，见后续介绍。在会话中，用户可以使用的组合键通常都非常丰富，可以实现在同一会话中创建多个窗口、分屏等操作。

### screen

`screen` 是Linux通常会带的 multiplexer。创建并进入会话后，所有发给 `screen` 的命令都由组合键 `Control + a` 开头。例如：

| 组合键          | 功能                                     |
| --------------- | ---------------------------------------- |
| Control + a + ? | 查看在`screen`会话中可使用的key bindings |
| Control + a + d | detach，把当前会话挂在后台               |

实际操作的例子如下：

```bash
## 以detached模式创建一个有名字的会话
$ screen -dmS test

## 创建另一个有名字的会话，并立即使用（attach）
$ screen -S develop

## 列出所有存在的会话和状态
$ screen -ls
There are screens on:
        26426.develop   (Attached)
        26348.test      (Detached)
2 Sockets in /var/run/screen/S-one.

## detach当前会话，退回到最初的shell
Control + a + d

## 进入另一个会话（reattach）
$ screen -r test

## 假设网络突然中断，又或者我们想在另一台电脑上继续之前的工作
## 只需要登录后执行
$ screen -r develop
```

### tmux

参考：

- [Tmux Wiki](https://github.com/tmux/tmux/wiki)

- [Tmux Cheat Sheet & Quick Reference](https://tmuxcheatsheet.com/)

`tmux` 是一个比 `screen` 功能更全面的 multiplexer，但它们的基本用法差不多。创建并进入会话后，所有发给 `screen` 的命令都由组合键 `Control + b` 开头。例如：

| 组合键            | 功能                                               |
| ----------------- | -------------------------------------------------- |
| Control + b + ?   | 查看在`tmux`会话中可使用的key bindings和命令       |
| Control + b + d   | detach，把当前会话挂在后台                         |
| Control + b + :   | 发送命令到`tmux`，每个组合键的功能都可以用命令完成 |
| Control + b + c   | 在当前会话创建新的window                           |
| Control + b + n/p | 切换到前一个/后一个window                          |
| Control + b + w   | 列出现存的windows，可用键盘上/下键选择             |

实际操作的例子如下：

```bash
## 以detached模式创建一个有名字的会话
$ tmux new-session -ds test

## 创建另一个有名字的会话，并立即使用（attach）
$ tmux new-session -s develop

## 列出所有存在的会话和状态
$ tmux ls
test: 1 windows
develop: 1 windows (attached)

## detach当前会话，退回到最初的shell
Control + b + d

## 进入另一个会话（reattach）
$ tmux attach -t test

## 假设网络突然中断，又或者我们想在另一台电脑上继续之前的工作
## 只需要登录后执行
$ tmux attach -t develop
```

## 保持SSH或SFTP连接

当我们使用集群时，使用 `screen` 或 `tmux` 这样的程序能让我们保存当前的工作以便下次继续。如果出于某种理由我们不希望反复登录集群（比如需要动态口令），那就需要保存已登录的 shell，也就是在 multiplexer 打开的会话里面登录集群。

例如，我们想在实验室机器上创建会话，在这个会话里面打开一个SSH和一个SFTP到某超算S。假设超算域名是 `s.example.cn`，端口是 `12345`，我的用户名是 `hpcer`。

```bash
## 首先从自己电脑登录实验室集群
$ ssh hpcer@ssh.hpcer.dev

## 创建一个tmux会话用于SSH
$ tmux new-session -s myssh

## 在myssh会话中连接超算S
$ ssh -o ServerAliveInterval=60 -p 12345 hpcer@s.example.cn

## 用组合键detach当前会话
Control + b + d

## 创建另一个tmux会话用于SFTP
$ tmux new-session -s mysftp

## 在mysftp会话中连接超算S
$ sftp -o ServerAliveInterval=60 -P 12345 hpcer@s.example.cn

## 用组合键detach当前会话
Control + b + d 
```

创建了上述两个会话后，只要实验室集群到超算S的连接不断开，我们随时都可以通过 `tmux` 会话回到超算S，不需要反复登录。如果实验室集群到超算S的连接也不稳定，可以换其他不在校园网的机器。
