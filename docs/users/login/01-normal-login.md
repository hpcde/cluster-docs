---
id: normal-login
title: 登录到集群
---
import useBaseUrl from '@docusaurus/useBaseUrl';

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
  - [Xshell](https://www.netsarang.com/products/)(windows 推荐);  
  - [termius](https://www.termius.com/) (移动端推荐使用)
  - [putty](https://www.putty.org/)工具;  
  - web登录: [https://console.hpc.gensh.me](https://console.hpc.gensh.me),适用于在未安装ssh工具的系统上登录。  

  **说明**:  
  1. Web登录方式可参考**集群外网VPN登录**章节的关于其登录方式的介绍；  

- ssh登录地址及端口  
主节点登录地址为[ssh.hpcer.dev](ssh.hpcer.dev)或[n.hpcone.science](n.hpcone.science)，登录端口**22**。  

- 登录方式  
  以安全为目的, 集群的不支持静态密码的登录方式, 仅支持**PublicKey** 和 **Keyboard-Interactive**两种登录方式。

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

## Keyboard-Interactive 登录
为了方便用户在不同节点间跳转，或者当身边无相应的私钥以进行登录 (如借用别人电脑时)。
集群还提供了 Keyboard-Interactive 的方式登录，这是一种**密码+动态口令**的登录方式，其中动态口令采用 [google authenticator](https://github.com/google/google-authenticator-libpam)。   
用户可以通过以下步骤进行配置：  
1. 登录集群 (如利用 PublicKey 登录或者通过管理员协助登录)，在用户目录执行如下命令以初始化:
  ```bash
  cd ～
  google-authenticator
  ```
  依据提示进行操作 (基本上, 一路按 "y"即可)，并参照步骤 2 进行二维码扫描。 
  :::caution
  请注意保存好 **emergency scratch codes**
  :::
2. 手机端前往应用商店下载[Google身份验证器](https://support.google.com/accounts/answer/1066447)或者[Microsoft Authenticator](https://www.microsoft.com/zh-cn/account/authenticator)应用。扫描创建账号时提供的二维码或者输入提供的密钥以创建动态验证码。
<img alt="Google 身份验证器" src={useBaseUrl('users-assets/google_authenticator.png')} />   

3. 完成 `google-authenticator` 命令后，由于 SELinux 的作用，还需要调整一下文件权限:
   ```bash
   mv .google_authenticator .ssh/
   restorecon -Rv .ssh/
   ```

4. 以 xshell 为例，在xshell中选择文件->新建，在类别连接中填入主机名、端口号等内容，再在左侧的连接->用户身份认证，选择Keyboard-Interactive项。  
   用户也可直接采用 ssh 命令进行登录，登录过程中会要求输入密码和 Verification code（动态口令）。
<img alt="Xshell登录" src={useBaseUrl('users-assets/login.png')} />   

1. 在进行登录时(Xshell中从已创建的会话中登录), 会提示输入验证码, 输入手机端验证器提供的动态密码; 密码输入创建账号时提供的密码(如果有提示输入的话)。

## 使用sftp上传文件  
如果需要上传文件到集群的对应的用户目录，可使用支持sftp协议的工具上传。这里推荐使用Xftp工具和系统自带的 sftp 命令。
其中，sXftp 工具的具体配置方法和 Xshell 类似，其中主机名和端口号同ssh登录的设置，协议选择**sftp**。
<!-- 登录示例参考下图: -->
<!-- <img alt="Xftp登录" src={useBaseUrl('users-assets/sftp-login.png')} />   -->
