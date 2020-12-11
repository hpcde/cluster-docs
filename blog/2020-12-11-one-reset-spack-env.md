---
id: one-reset-spack-env
title: 切换Spack环境变量
author: one
author_title: PhD student at USTB
author_url: https://github.com/alephpiece
author_image_url: https://github.com/alephpiece.png
tags: [tutorial, spack]
---

Spack的环境变量、自动补全等都由Spack目录下的脚本设置。例如，为bash设置环境变量的命令为

```bash
$ export SPACK_ROOT=/path/to/spack
$ source $SPACK_ROOT/share/spack/setup-env.sh
```

当我们有多个Spack时，直接`source`其中一个Spack的环境配置脚本可能不会达到预期效果。比如，首先加载了集群的公共Spack，随后切换到自己的本地Spack，实际上仍有些环境是公共Spack设置的。此时我们需要清除一下旧的环境。

<!--truncate-->

> 以下均以bash为例。

## Spack的环境变量

Spack的环境配置脚本`setup-env.sh`实际上会如下修改用户的环境：

- 修改变量`SPACK_ROOT`；
- 修改变量`PATH`，添加`$SPACK_ROOT/bin`，但该目录已存在时会跳过修改；
- 定义函数`_spack_shell_wrapper`，是处理Spack命令的函数；
- 定义函数`spack`，是给用户使用的。

如果以上环境都已被设置，再`source`另一个路径下的Spack，很可能只有`SPACK_ROOT`被修改。此时用户使用`which spack`等命令都只能找到旧的变量和函数。尤其是，如果`PATH`没有正确被修改，用户实际执行的可执行文件仍然来自于旧路径。

## 重置Spack的环境

切换Spack最干净的方法就是重新开shell，重新`source`配置脚本。如果一定要在当前shell切换Spack，可以手动删除旧的环境变量`PATH`和函数`_spack_shell_wrapper`、`spack`。如果Spack版本差的不多，实际上只需要修改`PATH`就差不多能正常使用。

下面提供一个可以删除这些环境的脚本。该脚本的输入参数为Spack的`setup-env.sh`路径。

```bash
#   Script:
#       reset-env.sh
#   Usage:
#       source ./reset-env.sh /path/to/setup-env.sh
#
#!/bin/bash

unset_spack_path() {
    # Figure out Spack paths
    local spack_script=$1
    local spack_share_dir="$(cd "$(dirname $spack_script)" > /dev/null && pwd)"
    local spack_prefix="$(cd "$(dirname $(dirname $spack_share_dir))" > /dev/null && pwd)"
    local spack_bin="${spack_prefix%/}/bin"

    # Remove the specified directory from PATH
    local path_old=$PATH
    local path_canonical=":$path_old:"

    if [[ "$path_canonical" =~ ":$spack_bin:" ]];
    then
        # Remove the given directory
        local path_new="${spack_bin}${path_canonical//:$spack_bin:/:}"

        # Remove the tail colon
        path_new=${path_new%:}

        # Export PATH, this will change the user environment
        export PATH=$path_new

        echo "removed from PATH: $spack_bin"
    else
        echo "removed nothing"
    fi
}

unset_spack_func() {
    # Spack functions
    local spack_functions=(spack _spack_shell_wrapper)

    for i in "${spack_functions[@]}"
    do
        if [ -n $i ] && [ "$(type -t $i)" = function ]
        then
            # This is supposed to change the user environment
            unset -f $i
            echo "unset function: $i"
        else
            echo "$i not found"
        fi
    done
}

echo -e "\nRemoving Spack directory from PATH..."
unset_spack_path "$1"

echo -e "\nUnsetting Spack functions..."
unset_spack_func

echo -e "\nSourcing ${1}..."
source "$1" &> /dev/null
if [ $? != 0 ]; then
    echo "failed to source $1"
fi

echo -e "\nNow, you can run following commands for checking"
echo -e "\t$ which spack"
echo -e "\t$ env | grep -i spack"
```

该脚本需要`source`，使用方式如下
```bash
export SPACK_ROOT=/path/to/new/spack
$ source ./reset-env.sh $SPACK_ROOT/share/spack/setup-env.sh
```

脚本中的`unset_spack_path`用于计算一些路径并修改用户的`PATH`，执行完后，用户提供的新Spack的路径会并加到`PATH`最前面。`unset_spack_func`用于清除旧的函数。
