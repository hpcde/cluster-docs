---
id: proxy-login
title: 外网代理登录
---

目前，在外网环境下(指校外网络环境),无法直接登录该集群.但可以通过**VPN**或者**代理**的方式在外网登录.  
用户可以通过以下的任意一种方式登录到集群:
- **ssh-web-console**: 在校外通过vpn访问网站 https://console.hpc.gensh.me, 使用[ssh-web-console](https://github.com/genshen/ssh-web-console)登录到校内服务器, 该服务提供基于web的ssh登录与文件传输功能.
- **wssocks代理**: [wssocks](https://github.com/genshen/wssocks)提供TCP协议代理,可以通过该代理访问校内的网站、使用ssh连接服务器等(只要是TCP协议的均可).

## 外网ssh-web-console使用
- 登录VPN  
在浏览器输入https://n.ustb.edu.cn, 进行VPN登录(账号及密码分别为校园网用户名与密码).  

- 登录集群  
 在VPN页面的网址输入框中，输入以下链接:https://console.hpc.gensh.me, 即可进入SSH Web Console页面.  
 进入集群SSH Web Console的登录页面后,填入登录地址及端口与用户名,密码后即可登录集群. 
 ![SSH Web Console登录](https://github.com/genshen/ssh-web-console/raw/master/Screenshots/shot2.png)

- 主要功能  
 该SSH Web Console目前的主要功能包括shell与文件上传功能.
 ![Console Shell](https://github.com/genshen/ssh-web-console/raw/master/Screenshots/shot3.png)
 ![Console Upload File](https://github.com/genshen/ssh-web-console/raw/master/Screenshots/shot4.png)

?> 注:该SSH Web Console在校内网也可以访问,地址:https://console.hpc.gensh.me.

## 外网wssocks代理使用
1. 从wssocks-plugin-ustb的[Release](https://github.com/genshen/wssocks-plugin-ustb/releases)页面下载带有[wssocks-plugin-ustb](https://github.com/genshen/wssocks-plugin-ustb)插件的wssocks二进制包,并配置好环境变量.  

!> 如果你需要从校外访问USTB校内网络,需要下载带有wssocks-plugin-ustb插件的wssocks版本.

2. 登录USTB VPN https://n.ustb.edu.cn (账号及密码分别为校园网用户名与密码),获取cookie.
   ![获取Cookie](https://github.com/genshen/wssocks-plugin-ustb/raw/master/docs/zh-cn/asserts/get-cookie.png).

3. 使用wssocks连接到USTB校内wssocks服务器,其中wssocks服务器地址为: `ws://proxy.gensh.me`.
```bash
USTB_VPN=ON VPN_COOKIE=wengine_vpn_ticket=b28f9aabf8d4f3dd wssocks-ustb client --addr :1080 --remote ws://proxy.gensh.me
# 其中 b28f9aabf8d4f3dd 为上一步中获取到的 cookie,依据自己情况进行替换.
```
4. ssh连接校内服务  
   如果你的ssh客户端有socks5代理功能,可以开启socks5代理, socks5代理本地服务器地址为 `127.0.0.1:1080` (该地址及端口可通过`wssocks-ustb client --addr [地址:端口]`指定).  
   如果你的ssh客户端没有socks5代理功能, 你可以在你的Terminal中使用下面的命令进行ssh连接:
   ```bash
   ssh -o ProxyCommand='nc -x 127.0.0.1:1080 %h %p' your_server_address
   ```

?> 当然,你也可以配置全局的socks5代理,你的所有的应用程序均可通过该代理访问校内网络，包括web网站, git, ssh等.相关文档见[wssocks-plugin-ustb文档](https://github.com/genshen/wssocks-plugin-ustb/blob/master/docs/zh-cn/README.md).

!> 以上内容仅为大致的wssocks代理使用步骤，更多内容及细节请查看[wssocks-plugin-ustb文档](https://github.com/genshen/wssocks-plugin-ustb/blob/master/docs/zh-cn/README.md).

## 关于项目及git repo
该页面涉及的几个项目的代码仓库均开源在github上,使用中有任何问题或改进意见,欢迎前来贡献代码或提issues.

- **[ssh-web-console](https://github.com/genshen/ssh-web-console)**:  
  <a class="github-button" target="_blank" href="https://github.com/genshen/ssh-web-console" data-size="large" data-show-count="true" aria-label="Star genshen/ssh-web-console on GitHub">Star</a>  <a class="github-button" target="_blank" href="https://github.com/genshen/ssh-web-console/fork" data-size="large" data-show-count="true" aria-label="Fork genshen/ssh-web-console on GitHub">Fork</a>

- **[wssocks](https://github.com/genshen/wssocks)**:  
  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks" data-size="large" data-show-count="true" aria-label="Star genshen/wssocks on GitHub">Star</a>  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks/fork" data-size="large" data-show-count="true" aria-label="Fork genshen/wssocks on GitHub">Fork</a>

- **[wssocks-plugin-ustb](https://github.com/genshen/wssocks-plugin-ustb)**:  
  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks-plugin-ustb" data-size="large" data-show-count="true" aria-label="Star genshen/wssocks-plugin-ustb on GitHub">Star</a>  <a class="github-button" target="_blank" href="https://github.com/genshen/wssocks-plugin-ustb/fork" data-size="large" data-show-count="true" aria-label="Fork genshen/wssocks-plugin-ustb on GitHub">Fork</a>
