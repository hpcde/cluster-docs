---
id: proxy-login
title: 外网代理登录
---

目前，在外网环境下(指校外网络环境),无法直接登录该集群.但可以通过**VPN**或者**代理**的方式在外网登录.  
用户可以通过以下的任意一种方式登录到集群:
- **ssh-web-console**: 在校外通过vpn访问网站 https://console.hpc.gensh.me, 使用[ssh-web-console](https://github.com/genshen/ssh-web-console)登录到校内服务器, 该服务提供基于web的ssh登录与文件传输功能.
- **wssocks代理**: [wssocks](https://github.com/genshen/wssocks)提供TCP协议代理,可以通过该代理访问校内的网站、使用ssh连接服务器等(只要是TCP协议的均可).

## 外网ssh-web-console使用 【已弃用】
- 登录VPN  
在浏览器输入https://n.ustb.edu.cn, 进行VPN登录(账号及密码分别为校园网用户名与密码).  

- 登录集群  
 在新标签页打开 [🔗链接](https://n.ustb.edu.cn/https/77726476706e69737468656265737421f3f84f8f283c6d1e76188ae29f502d2667c3c311/)，可进入SSH Web Console页面.  
 进入集群SSH Web Console的登录页面后,填入登录地址及端口与用户名,密码后即可登录集群. 
 ![SSH Web Console登录](https://github.com/genshen/ssh-web-console/raw/master/Screenshots/shot2.png)

- 主要功能  
 该 SSH Web Console 目前的主要功能包括shell与文件上传功能.
 ![Console Shell](https://github.com/genshen/ssh-web-console/raw/master/Screenshots/shot3.png)
 ![Console Upload File](https://github.com/genshen/ssh-web-console/raw/master/Screenshots/shot4.png)

:::tip
 该 SSH Web Console 在校内网也可直接访问,地址: https://console.hpc.gensh.me.
:::

## 外网wssocks代理使用

1. 从wssocks-plugin-ustb的[Release](https://github.com/genshen/wssocks-plugin-ustb/releases)页面下载带有[wssocks-plugin-ustb](https://github.com/genshen/wssocks-plugin-ustb)插件的wssocks二进制包(该插件会通过USTB的vpn服务连接进校内网络),并配置好环境变量.  

    如果你有 go 环境，也可以直接 使用一下命令安装：
    ```bash
    go get -u github.com/genshen/wssocks-plugin-ustb/wssocks-ustb
    ```

2. 运行wssocks客户端
   ```bash
   wssocks-ustb client --remote=wss://proxy.gensh.me --http -http-addr=:1086 --vpn-enable --vpn-host=vpn4.ustb.edu.cn --vpn-force-logout --vpn-host-encrypt
   ```
   其中，wssocks 服务器地址为`wss://proxy.gensh.me`。  
   其他选项请参见 github 上的[wssocks-plugin-ustb文档](https://github.com/genshen/wssocks-plugin-ustb/blob/master/docs/zh-cn/README.md)。  
3. ssh连接校内服务  
   如果你的ssh客户端有socks5代理功能(如xshell软件),可以开启socks5代理, socks5代理本地服务器地址为 `127.0.0.1:1080` (该地址及端口可通过`wssocks-ustb client --addr [地址:端口]`指定).  
   如果你的ssh客户端没有socks5代理功能, 你可以在你的Terminal中使用下面的命令进行ssh连接:
   ```bash
   # Mac and Linux
   ssh -o ProxyCommand='nc -x 127.0.0.1:1080 %h %p' your_server_address
   # Git Bash
   ssh -o ProxyCommand='connect -S 127.0.0.1:1080 %h %p' your_server_address
   ```

当然,你也可以配置**全局的socks5代理**,你的所有的应用程序均可通过该代理访问校内网络，包括**web网站, git, ssh**等.  
更多内容及细节请查看[wssocks-plugin-ustb文档](https://github.com/genshen/wssocks-plugin-ustb/blob/master/docs/zh-cn/README.md).  

## 关于项目及git repo
该页面涉及的几个项目的代码仓库均开源在github上,使用中有任何问题或改进意见,欢迎前来贡献代码或提issues.

- **[ssh-web-console](https://github.com/genshen/ssh-web-console)**:  
  <a class="github-button" target="_blank" href="https://github.com/genshen/ssh-web-console" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star genshen/ssh-web-console on GitHub">Star</a>  <a class="github-button" target="_blank" href="https://github.com/genshen/ssh-web-console/fork" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Fork genshen/ssh-web-console on GitHub">Fork</a>

- **[wssocks](https://github.com/genshen/wssocks)**:  
  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star genshen/wssocks on GitHub">Star</a>  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks/fork" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Fork genshen/wssocks on GitHub">Fork</a>

- **[wssocks-plugin-ustb](https://github.com/genshen/wssocks-plugin-ustb)**:  
  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks-plugin-ustb" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star genshen/wssocks-plugin-ustb on GitHub">Star</a>  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks-plugin-ustb/fork" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Fork genshen/wssocks-plugin-ustb on GitHub">Fork</a>
