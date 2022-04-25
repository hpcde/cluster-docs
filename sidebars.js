/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: {
    "首页": ["users/getting-started"],
    "集群概况": ["users/cluster-overview"],
    "登录到集群": [
      "users/login/normal-login",
      "users/login/proxy-login"
    ],
    "软件与工具": [
      "users/software/spack",
      "users/software/lmod",
      "users/software/easybuild",
      "users/software/software-list",
      "users/software/anaconda",
      "users/software/tools"
    ],
    "使用计算资源": [
      "users/slurm/basics",
      "users/slurm/quickstart",
      "users/slurm/mpi-omp",
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
    "Q&A": ["users/question_and_answer"]
  },
  admin: {
    // "First Category": ["doc4", "doc5"]
  },
};

module.exports = sidebars;
