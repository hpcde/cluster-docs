---
id: normal-login
title: 登录到集群
---

用户可以使用 SSH 登陆到节点，这是最常用的方式。可以登陆的节点如下：

| 节点        | 域名                                                         | 说明                                     |
| ----------- | ----------------------------------------------------------- | ---------------------------------------- |
| node01      | ssh.hpcer.dev<br/>n.hpcone.science                           | 计算集群的登陆节点，可以连接到其他节点。     |
| node02      | x.hpcone.science                                            | 计算集群的登陆节点，可以连接到其他节点。     |
| node[03-04] | n03.hpcone.science<br/>n04.hpcone.science                    | 单独使用的节点。也可以由node01登陆。        |
| node[13-16] | -                                                           | Hadoop集群。                              |
| nodegpu     | gpu.ssh.hpcer.dev<br/> ssh.ml.gensh.me                       | GPU节点，单独使用。                        |

账号使用过程中有任何问题或申请开通账号请联系管理员:[汪岸](mailto:wangan.cs@gmail.com) 或 [储根深](mailto:genshenchu@gmail.com)。

## ssh登录集群
目前,该集群仅允许校内的网段登录,不对外网开放直接登录权限。
- ssh登录工具  
  - [ssh命令] 使用OS X、Linux或者window 10 1803以上版本内置的ssh命令
  - [Xshell](http://www.netsarang.com/products/)(windows 推荐);  
  - [termius](https://www.termius.com/) (移动端推荐使用)
  - [putty](http://www.putty.org/)工具;  
  - web登录: [http://console.hpc.gensh.me](http://console.hpc.gensh.me),适用于在未安装ssh工具的系统上登录。  

  **说明**:  
  1. Web登录方式可参考**集群外网VPN登录**章节的关于其登录方式的介绍；  

- ssh登录地址及端口  
主节点登录地址为[ssh.hpcer.dev](ssh.hpcer.dev)或[n.hpcone.science](n.hpcone.science)，登录端口**22**。  

- 登录方式  
  以安全为目的, 集群的不支持静态密码的登录方式, 仅支持**PublicKey** 和 **Keyboard-Interactive**两种登录方式。

## Keyboard-Interactive登录
1. 手机端前往应用商店下载[Google身份验证器](https://support.google.com/accounts/answer/1066447)或者[Microsoft Authenticator](https://www.microsoft.com/zh-cn/account/authenticator)应用。扫描创建账号时提供的二维码或者输入提供的密钥以创建动态验证码。
![Google 身份验证器](assets/google_authenticator.png) 

1. 以xshell为例，在xshell中选择文件->新建，在类别连接中填入主机名、端口号等内容，再在左侧的连接->用户身份认证，选择Keyboard-Interactive项。  
![Xshell登录](assets/login.png)  

1. 在进行登录时(Xshell中从已创建的会话中登录), 会提示输入验证码, 输入手机端验证器提供的动态密码; 密码输入创建账号时提供的密码(如果有提示输入的话)。
  
## PublicKey登录
1. 在本地机器上使用ssh-keygen生成公钥和私钥。
使用Xshell的用户使用以下方式生成公钥: [https://www.netsarang.com/tutorial/xshell/1005/Public_Key_User_Authentication](https://www.netsarang.com/tutorial/xshell/1005/Public_Key_User_Authentication)  
```
local$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa): my_id_rsa
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in my_id_rsa.
Your public key has been saved in my_id_rsa.pub.
The key fingerprint is:
SHA256:GKW7yzA1J1qkr1Cr9MhUwAbHbF2NrIPEgZXeOUOz3Us user@klar
The key's randomart image is:
+---[RSA 2048]----+
|.*++ o.o.        |
|.+B + oo.        |
| +++ *+.         |
| .o.Oo.+E        |
|    ++B.S.       |
|   o * =.        |
|  + = o          |
| + = = .         |
|  + o o          |
+----[SHA256]-----+
```
注:以上示例中,公钥和私钥文件名分别保存为:my_id_rsa my_id_rsa.pub; passphrase允许为空。

2. 将公钥上传到服务器并导入到**authorized_keys**文件, 可以使用[ssh-copy-id](https://www.ssh.com/ssh/copy-id)命令上传或者sftp工具上传。
```bash
local$ ssh-copy-id -i ~/.ssh/my_id_rsa.pub user@host # -i 参数指定公钥路径
```
如果是使用sftp工具上传公钥文件(例如上传mykey.pub到服务器～/.ssh/my_id_rsa.pub), 还需要登录服务器, 手动将公钥(Public Key)导入到**authorized_keys**文件中。
```bash
server$ cat ~/.ssh/my_id_rsa.pub >> ~/.ssh/authorized_keys
server$ chmod 600 authorized_keys
server$ chmod 700 ~/.ssh
server$ rm ~/.ssh/my_id_rsa.pub
```
3. 登录:
如果使用ssh命令登录,可以使用:
```bash
ssh -i ~/.ssh/my_id_rsa user@host # -i 参数指定私钥路径
```
对于Xshell用户, 选择文件->新建，在类别连接中填入主机名、端口号等内容，再在左侧的连接->用户身份认证,在Method中选择Public Key, 在下面出现User Key选择框, 下拉选择相应的刚才注册的公钥(如果有Passphrase可以在下面注册),也可以使用Browse来找保存下来的User Key文件。

## 使用sftp上传文件  
如果需要上传文件到集群的对应的用户目录，可使用支持sftp协议的工具上传。这里推荐使用Xftp工具，具体配置方法和Xshell类似，其中主机名和端口号同ssh登录的设置，协议选择**sftp**。
<!-- 登录示例参考下图: -->
<!-- ![Xftp登录](assets/sftp-login.png) -->
