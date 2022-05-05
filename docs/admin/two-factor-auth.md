---
id: two-factor-authentication
title: 双因子认证
---
双因子认证（2FA），又被称作两步验证或者双因素验证，是一种比单一密码口令认证更为安全的认证方式。
其要求用户提供两种不同的认证因素来证明自己的身份。一般第一种可以是传统的静态口令密码，第二种可以是动态口令或者指纹/面部识别等。

为了更安全的保护集群上的用户数据，我们配置了双因子认证，并且强制对所有用户启用。
其中，第一种认证方式为用户的密码，第二种认证方式为 google 验证器提供的动态口令。

## 编译构建 Google Authenticator PAM 模块
从 [github](https://github.com/google/google-authenticator-libpam) 上下载/clone 代码，然后按照其文档进行编译构建即可。
```bash
git clone https://github.com/google/google-authenticator-libpam.git
cd google-authenticator-libpam
git checkout 1.09

./bootstrap.sh
./configure --prefix=/usr/local/google-authenticator
make
sudo make install

cd /usr/local/bin && sudo ln -s /usr/local/google-authenticator/bin/google-authenticator ./
cd /lib64/security && sudo ln -s /usr/local/google-authenticator/lib/security/pam_google_authenticator.so ./
```
## 配置登录认证
为了让用户在 ssh 登录时，可以使用 google 验证进行二次验证。需要修改 pam 中的配置文件 `/etc/pam.d/sshd`。
添加如下内容：
```diff
#%PAM-1.0
auth       required     pam_sepermit.so
auth       substack     password-auth
+auth       required     pam_google_authenticator.so secret=${HOME}/.ssh/.google_authenticator
```
这里，由于服务器中不只有一个用户，pam 配置中可以使用变量${USER}来配置多用户，不需要为每个用户写一条 pam 配置。

此外，还需要检查 `/etc/ssh/sshd_config` 文件中的相关项配置正确： `UsePAM yes`。
这样，ssh 服务端的二次验证就配置完成了，可能还需要重启下 sshd 服务。

:::tip
用户启用 google authenticator 的操作步骤，可以参考[集群用户文档](/users/login/01-normal-login.md)。
:::

注：google authenticator pam 的相关重要配置参数
- secret：secret 文件的路径。
- authtok_prompt：认证时的提示语。
- no_increment_hotp：不统计失败的两步认证。可以防止有被暴力破解时锁定用户。


## 其他配置
我们还可以给 sudo 命令配置二次认证。
```conf
# vi /etc/pam.d/sudo
auth sufficient pam_google_authenticator.so
```
<!-- auth requisite pam_google_authenticator.so secret=/root/.google_authenticator user=root -->

以及给 su 配置二次认证（root 切换至普通用户不需要两步验证，普通用户切换至 root，或者普通用户之间切换需要先进行两步验证）：
```conf
# vi /etc/pam.d/su
auth required pam_google_authenticator.so secret=/root/.ssh/.google_authenticator no_increment_hotp
```

## PAM 控制标记
> 控制标记简单的解释是就是各个模块的重要程度。
> - required
> 该标记的模块认证成功是用户通过的必要条件。就是说required标记的模块如果认证失败，就一定不会通过认证。认证失败以后也不会立刻返回给用户错误消息，而是在所有的模块调用完毕以后统一返回，就是说该模块认证失败以后其他的模块认证没有意义了。这样做的目的是为了迷惑“敌人”，让他们不知道是哪个模块认证失败导致的问题。
> -requisite
> 该标记的模块 required的相似，它标记的模块认证失败以后会直接返回给应用，不会执行接下来的模块，而该标记一般用在认证一开始，用来判断用户的登录环境是否合法，如果不合法的话直接返回认证失败，就算是合法的用户，如果登录环境不对也不会通过认证。
- sufficient
> 该标记的模块标识的是用户通过认证的充分条件，意思就是只要该模块通过了认证就会立刻返回给用户认证成功。当然sufficient的优先级低于required，如果required认证失败了最终结果也是失败。当sufficient认证失败的时候就相当于optional
- optional
> 该标记的模块认证失败，用户也能通过认证。就是该标记的模块一般只做信息的展示，不去做认证相关的东西，用户的认证能否通过全部取决于上边三个标记。
> - include
> 该标记实际上就是引用这个pam文件相同的目录下的另一个文件。但是不会将另一个pam配置文件中的所有内容引入，只会对“模板类型”字段所标记的一类模块起到作用。即便system-auth可能包含了全部的四种类型的模块，也只有当前记录所对应的哪一类模块的那些记录包含进来。
>
> 来源： https://www.cnblogs.com/yanghehe/p/12294128.html

参考：
- https://github.com/google/google-authenticator-libpam
- https://www.nixops.me/articles/ssh-multi-factor-authentication.html
- https://ruttkowa.medium.com/securing-sudo-and-su-with-google-authenticator-4bc9b6ae03cd
- https://blog.entek.org.uk/notes/2019/07/08/secure-sudo-with-google-authenticator.html

