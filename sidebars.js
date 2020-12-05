/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
      "首页": ["users/getting-started"],
      "集群概况": ["users/cluster-overview"],
      "登录到集群": [
        "users/login/normal-login",
        "users/login/proxy-login"
      ],
      "软件与工具": [
        "users/software/lmod",
        "users/software/spack",
        "users/software/software-list",
        "users/software/spack-software-list",
        "users/software/anaconda",
        "users/software/tools"
      ],
      "使用计算资源": [
        "users/slurm/introduction",
        "users/slurm/submit-jobs",
        "users/slurm/mpi-omp",
        "users/slurm/mpi-version-diff",
        "users/slurm/understand",
        "users/slurm/advanced"
      ],
      "调试": [
        "users/debug/introduction",
        "users/debug/gdb",
        "users/debug/parallel",
        "users/debug/valgrind"
      ],
      "性能分析": [
        "users/profile/scorep",
        "users/profile/vtune"
      ],
      "其他说明": ["users/cautions"],
      "Q&A": ["users/question_and_answer"]
    },
    admin: {
      "First Category": ["doc4", "doc5"]
    },
  
};
