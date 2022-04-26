"use strict";(self.webpackChunkhpcer_cluster_docs=self.webpackChunkhpcer_cluster_docs||[]).push([[5655],{3905:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return m}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var o=r.createContext({}),u=function(e){var n=r.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},s=function(e){var n=u(e.components);return r.createElement(o.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,l=e.originalType,o=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),d=u(t),m=a,k=d["".concat(o,".").concat(m)]||d[m]||c[m]||l;return t?r.createElement(k,i(i({ref:n},s),{},{components:t})):r.createElement(k,i({ref:n},s))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var l=t.length,i=new Array(l);i[0]=d;var p={};for(var o in n)hasOwnProperty.call(n,o)&&(p[o]=n[o]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var u=2;u<l;u++)i[u]=t[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6999:function(e,n,t){t.r(n),t.d(n,{assets:function(){return s},contentTitle:function(){return o},default:function(){return m},frontMatter:function(){return p},metadata:function(){return u},toc:function(){return c}});var r=t(7462),a=t(3366),l=(t(7294),t(3905)),i=["components"],p={id:"parallel",title:"\u8c03\u8bd5\u5e76\u884c\u7a0b\u5e8f"},o=void 0,u={unversionedId:"users/debug/parallel",id:"users/debug/parallel",title:"\u8c03\u8bd5\u5e76\u884c\u7a0b\u5e8f",description:"\u591a\u7ebf\u7a0b\u3001\u591a\u8fdb\u7a0b\u7684\u7a0b\u5e8f\u9700\u8981\u989d\u5916\u7684\u8c03\u8bd5\u6280\u5de7\u548c\u5de5\u5177\u3002",source:"@site/docs/users/debug/03-debug-parallel.md",sourceDirName:"users/debug",slug:"/users/debug/parallel",permalink:"/cluster-docs/docs/users/debug/parallel",editUrl:"https://github.com/hpcde/cluster-docs/blob/master/docs/users/debug/03-debug-parallel.md",tags:[],version:"current",lastUpdatedBy:"genshen",lastUpdatedAt:1609149978,formattedLastUpdatedAt:"12/28/2020",sidebarPosition:3,frontMatter:{id:"parallel",title:"\u8c03\u8bd5\u5e76\u884c\u7a0b\u5e8f"},sidebar:"docs",previous:{title:"\u4f7f\u7528GDB",permalink:"/cluster-docs/docs/users/debug/gdb"},next:{title:"\u4f7f\u7528Valgrind\u5206\u6790\u5de5\u5177",permalink:"/cluster-docs/docs/users/debug/valgrind"}},s={},c=[{value:"\u4f7f\u7528 GDB \u8c03\u8bd5 MPI \u7a0b\u5e8f",id:"\u4f7f\u7528-gdb-\u8c03\u8bd5-mpi-\u7a0b\u5e8f",level:2},{value:"\u6253\u5370\u8282\u70b9\u540d\u548c\u8fdb\u7a0b\u53f7",id:"\u6253\u5370\u8282\u70b9\u540d\u548c\u8fdb\u7a0b\u53f7",level:3},{value:"\u5229\u7528\u73af\u5883\u53d8\u91cf\u4f5c\u4e3a\u8c03\u8bd5\u5f00\u5173",id:"\u5229\u7528\u73af\u5883\u53d8\u91cf\u4f5c\u4e3a\u8c03\u8bd5\u5f00\u5173",level:3},{value:"\u4f7f\u7528 TotalView \u8c03\u8bd5 MPI \u7a0b\u5e8f",id:"\u4f7f\u7528-totalview-\u8c03\u8bd5-mpi-\u7a0b\u5e8f",level:2}],d={toc:c};function m(e){var n=e.components,t=(0,a.Z)(e,i);return(0,l.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\u591a\u7ebf\u7a0b\u3001\u591a\u8fdb\u7a0b\u7684\u7a0b\u5e8f\u9700\u8981\u989d\u5916\u7684\u8c03\u8bd5\u6280\u5de7\u548c\u5de5\u5177\u3002"),(0,l.kt)("p",null,"\u867d\u7136 GDB \u6700\u5e38\u7528\u4e8e\u8c03\u8bd5\u4e32\u884c\u7a0b\u5e8f\uff0c\u4f46\u5b83\u4e5f\u5b8c\u5168\u652f\u6301\u591a\u7ebf\u7a0b\u7684\u8c03\u8bd5\u3002\u5177\u4f53\u53ef\u4ee5\u53c2\u8003 GDB \u6587\u6863\u3002\n\u7136\u800c\uff0c\u4f7f\u7528 GDB \u8c03\u8bd5\u591a\u8fdb\u7a0b\u7a0b\u5e8f\uff08\u5982 MPI \u7a0b\u5e8f\uff09\u5e76\u4e0d\u662f\u5f88\u65b9\u4fbf\u3002\u672c\u8282\u7684\u76ee\u7684\u662f\u4e3a\u5927\u5bb6\u63d0\u4f9b\u4e00\u4e9b\u8c03\u8bd5\u5e76\u884c\u4ee3\u7801\u7684\u65b9\u6cd5\u548c\u5de5\u5177\uff0c\u5305\u62ec\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u4f7f\u7528\u4e32\u884c\u8c03\u8bd5\u5de5\u5177\uff1b"),(0,l.kt)("li",{parentName:"ul"},"\u4f7f\u7528\u5e76\u884c\u8c03\u8bd5\u5de5\u5177\u3002")),(0,l.kt)("h2",{id:"\u4f7f\u7528-gdb-\u8c03\u8bd5-mpi-\u7a0b\u5e8f"},"\u4f7f\u7528 GDB \u8c03\u8bd5 MPI \u7a0b\u5e8f"),(0,l.kt)("p",null,"MPI \u7a0b\u5e8f\u5f80\u5f80\u4f1a\u6709\u591a\u4e2a\u8fdb\u7a0b\uff0c\u4f7f\u7528 GDB \u8c03\u8bd5\u7684\u6700\u7b80\u5355\u7684\u65b9\u6cd5\u5c31\u662f\u628a GDB ",(0,l.kt)("strong",{parentName:"p"},"\u7ed1\u5230\uff08attach\uff09")," \u67d0\u4e2a\u8fdb\u7a0b\u4e0a\uff0c\u8c03\u8bd5\u8fd9\u4e2a\u8fdb\u7a0b\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ gdb -p pid\n")),(0,l.kt)("p",null,"\u5176\u4e2d\uff0c",(0,l.kt)("inlineCode",{parentName:"p"},"pid")," \u662f\u5f85\u7ed1\u7684\u8fdb\u7a0b\u53f7\u3002\u6362\u53e5\u8bdd\u8bf4\uff0c\u53ea\u8981\u7528\u6237\u80fd\u591f\u83b7\u53d6\u5230\u8fd0\u884c\u4e2d\u7684\u8fdb\u7a0b\u7684\u8fdb\u7a0b\u53f7\uff0c\u5c31\u53ef\u4ee5\u7528 GDB \u8c03\u8bd5\u5b83\u3002\u4e3a\u4e86\u8fbe\u5230\u8fd9\u4e2a\u76ee\u7684\uff0c\u6211\u4eec\u4e00\u822c\u53ef\u4ee5\u91c7\u7528\u4e24\u79cd\u65b9\u6cd5\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u7a0b\u5e8f\u8fd0\u884c\u540e\uff0c\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"li"},"ps")," \u6216 ",(0,l.kt)("inlineCode",{parentName:"li"},"top")," \u7b49\u547d\u4ee4\u67e5\u770b\u8fdb\u7a0b\u53f7\uff0c\u7136\u540e\u5c06 GDB \u7ed1\u5230\u8fdb\u7a0b\u4e0a\uff1b"),(0,l.kt)("li",{parentName:"ul"},"\u5728\u7a0b\u5e8f\u4e2d\u690d\u5165\u4e00\u6bb5\u4ee3\u7801\uff0c\u628a\u6240\u6709\u8fdb\u7a0b\u90fd\u5361\u4f4f\uff0c\u518d\u5c06 GDB \u7ed1\u5230\u8fdb\u7a0b\u4e0a\u3002")),(0,l.kt)("p",null,"\u7b2c\u4e00\u79cd\u65b9\u5f0f\u4e0b\uff0c\u6211\u4eec\u65e0\u6cd5\u63a7\u5236\u5207\u5165\u7684\u4f4d\u7f6e\u3002\u8fd9\u79cd\u65b9\u5f0f\u4e00\u822c\u53ef\u7528\u4e8e\u67e5\u770b\u4ee3\u7801\u5361\u5728\u54ea\u4e2a\u4f4d\u7f6e\uff08\u7c7b\u4f3c\u4e8e\u4f7f\u7528 core dump \u6587\u4ef6\uff09\uff0c\u53ea\u8981\u7ed1\u5230\u8fdb\u7a0b\u540e\u4f7f\u7528 GDB \u7684 ",(0,l.kt)("inlineCode",{parentName:"p"},"backtrace")," \u547d\u4ee4\u5373\u53ef\u3002"),(0,l.kt)("p",null,"\u7b2c\u4e8c\u79cd\u65b9\u5f0f\u5e94\u7528\u5f88\u5e7f\u3002\u4f8b\u5982\uff0c\u6211\u4eec\u53ef\u4ee5\u5728 C++ \u4ee3\u7801\u4e2d\u690d\u5165\u4e00\u6bb5\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"{\n    volatile int f = 0;\n    while (f == 0)\n        sleep(5);\n}\n")),(0,l.kt)("p",null,"\u8fd9\u662f\u6700\u7b80\u5355\u7684\u5f62\u5f0f\uff0c\u6240\u6709\u8fdb\u7a0b\u90fd\u4f1a\u505c\u5728\u8fd9\u4e2a\u6b7b\u5faa\u73af\u5185\u3002\u968f\u540e\uff0c\u7528\u6237\u53ef\u4ee5 SSH \u5230\u8ba1\u7b97\u8282\u70b9\u4e0a\uff0c\u52a0\u8f7d\u73af\u5883\u53d8\u91cf\uff08\u8fd9\u6837\u80fd\u6700\u5927\u7a0b\u5ea6\u663e\u793a\u8c03\u8bd5\u4fe1\u606f\uff09\uff0c\u518d\u628a GDB \u7ed1\u5230\u8fdb\u7a0b\u4e0a\uff0c\u8fdb\u884c\u8c03\u8bd5\u5de5\u4f5c\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ gdb -p pid\n\n(gdb) bt\n")),(0,l.kt)("p",null,"\u4e0a\u8ff0\u547d\u4ee4\u5c06 GDB \u7ed1\u597d\uff0c\u5e76\u67e5\u770b\u5f53\u524d\u8fdb\u7a0b\u7684\u8c03\u7528\u6808\u3002\u4e5f\u53ef\u4ee5\u5148\u542f\u52a8 GDB\uff0c\u518d\u7528 GDB \u7684\u547d\u4ee4\u6765\u7ed1\u8fdb\u7a0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ gdb\n\n(gdb) attach pid\n(gdb) bt\n")),(0,l.kt)("p",null,"\u65e0\u8bba\u54ea\u79cd\u65b9\u5f0f\uff0c\u7ed1\u597d\u4e4b\u540e\uff0c\u8fdb\u7a0b\u5e94\u8be5\u662f\u505c\u5728 ",(0,l.kt)("inlineCode",{parentName:"p"},"while")," \u5904\u7684\u3002\u968f\u540e\uff0c\u6211\u4eec\u5c06\u53d8\u91cf ",(0,l.kt)("inlineCode",{parentName:"p"},"f")," \u7684\u503c\u4fee\u6539\u4e3a\u975e 0\uff0c\u8ba9\u7a0b\u5e8f\u80fd\u7ee7\u7eed\u6267\u884c\u3002\u518d\u5f80\u540e\uff0c\u53ef\u4ee5\u50cf\u8c03\u8bd5\u4e32\u884c\u7a0b\u5e8f\u4e00\u6837\u64cd\u4f5c\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"(gdb) set var f=1\n")),(0,l.kt)("h3",{id:"\u6253\u5370\u8282\u70b9\u540d\u548c\u8fdb\u7a0b\u53f7"},"\u6253\u5370\u8282\u70b9\u540d\u548c\u8fdb\u7a0b\u53f7"),(0,l.kt)("p",null,"\u5982\u679c\u8fdb\u7a0b\u6570\u91cf\u5f88\u591a\uff0c\u4e14\u540c\u4e00\u8282\u70b9\u4e0a\u53ef\u80fd\u6709\u5f88\u591a\u8fdb\u7a0b\uff0c\u6211\u4eec\u76f4\u63a5\u901a\u8fc7 ",(0,l.kt)("inlineCode",{parentName:"p"},"ps")," \u7b49\u547d\u4ee4\u4e0d\u5bb9\u6613\u627e\u5230\u51fa\u95ee\u9898\u7684\u90a3\u4e00\u4e2a\uff08\u6216\u4e00\u4e9b\uff09\u3002\u5728 Linux \u4e0a\uff0c\u6211\u4eec\u7528\u5934\u6587\u4ef6 ",(0,l.kt)("inlineCode",{parentName:"p"},"unistd.h")," \u4e2d\u58f0\u660e\u7684\u51fd\u6570\u53ef\u4ee5\u5b8c\u6210\u8fd9\u70b9\u3002"),(0,l.kt)("p",null,"\u6539\u8fdb\u540e\u7684\u4ee3\u7801\u770b\u4e0a\u53bb\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},'#include <unistd.h>\n\n...\n\n{\n    volatile int f = 0;\n    char hostname[256];\n    gethostname(hostname, sizeof(hostname));\n    printf("PID %d on %s is ready for attach.", getpid(), hostname);\n    fflush(stdout);\n    while (f == 0)\n        sleep(5);\n}\n')),(0,l.kt)("p",null,"\u8fd9\u4e2a\u4ee3\u7801\u5757\u4f1a\u6253\u5370\u51fa\u8fdb\u7a0b\u53f7\u548c Linux \u4e3b\u673a\u540d\uff0c\u544a\u77e5\u7528\u6237\u8be5\u8fdb\u7a0b\u5df2\u7ecf\u5361\u5728\u4ee3\u7801\u5757\u6240\u5728\u4f4d\u7f6e\u3002\u968f\u540e\uff0c\u7528\u6237\u53ef\u4ee5\u5c06 GDB \u7ed1\u5230\u8be5\u8fdb\u7a0b\uff0c\u8fdb\u884c\u8c03\u8bd5\u3002"),(0,l.kt)("h3",{id:"\u5229\u7528\u73af\u5883\u53d8\u91cf\u4f5c\u4e3a\u8c03\u8bd5\u5f00\u5173"},"\u5229\u7528\u73af\u5883\u53d8\u91cf\u4f5c\u4e3a\u8c03\u8bd5\u5f00\u5173"),(0,l.kt)("p",null,"\u7528\u6237\u53ef\u4ee5\u628a\u524d\u9762\u8bf4\u7684\u4ee3\u7801\u5757\u5c01\u88c5\u5230\u51fd\u6570\u3001\u65b9\u6cd5\u91cc\uff0c\u4fbf\u4e8e\u4f7f\u7528\u3002\u53e6\u4e00\u65b9\u9762\uff0c\u8fd8\u53ef\u4ee5\u8bbe\u7f6e\u4e00\u4e2a\u73af\u5883\u53d8\u91cf\u6765\u51b3\u5b9a\u662f\u5426\u542f\u7528\u8fd9\u6bb5\u4ee3\u7801\u3002\u6211\u4eec\u7ed9\u51fa\u4e24\u79cd\u6539\u8fdb\u540e\u7684\u4ee3\u7801\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u6240\u6709\u8fdb\u7a0b\u5361\u5728\u6b7b\u5faa\u73af\uff0c\u8c03\u8bd5\u4e00\u4e2a\u8fdb\u7a0b\u65f6\uff0c\u5176\u4ed6\u8fdb\u7a0b\u4e0d\u4f1a\u7ee7\u7eed\u6267\u884c\uff1b"),(0,l.kt)("li",{parentName:"ul"},"\u6240\u6709\u8fdb\u7a0b\u5361\u5728\u4e00\u4e2a Barrier \u5904\uff0c\u8c03\u8bd5\u4e00\u4e2a\u8fdb\u7a0b\u65f6\uff0c\u5176\u4ed6\u8fdb\u7a0b\u53ef\u4ee5\u6267\u884c\u5230\u4e0b\u4e00\u4e2a MPI \u540c\u6b65\u4f4d\u7f6e\u3002")),(0,l.kt)("p",null,"\u4ee5\u4e0b\u662f\u7b2c\u4e00\u79cd\u6539\u8fdb\u7684\u793a\u4f8b\u4ee3\u7801\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},'#include <unistd.h>\n\n...\n\nstatic void wait_for_debugger()\n{\n    if (getenv("MPI_DEBUG") != nullptr) {\n        volatile int f = 0;\n        char hostname[256];\n        gethostname(hostname, sizeof(hostname));\n        printf("PID %d on %s is ready for attach.", getpid(), hostname);\n        fflush(stdout);\n        while (f == 0)\n            sleep(5);\n    }\n}\n')),(0,l.kt)("p",null,"\u8fd9\u4e2a\u4ee3\u7801\u5757\u4f1a\u628a\u6240\u6709\u8fdb\u7a0b\u90fd\u5361\u5728 ",(0,l.kt)("inlineCode",{parentName:"p"},"while")," \u5185\uff0c\u4e00\u6b21\u53ea\u80fd\u8ba9\u4e00\u4e2a\u8fdb\u7a0b\u7ee7\u7eed\u6267\u884c\u3002"),(0,l.kt)("p",null,"\u4ee5\u4e0b\u662f\u7b2c\u4e8c\u79cd\u6539\u8fdb\u7684\u793a\u4f8b\u4ee3\u7801\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},'#include <unistd.h>\n\n...\n\nstatic void wait_for_debugger()\n{\n    int rank, a_rank;\n    char *env_rank;\n    MPI_Comm_rank(MPI_COMM_WORLD, &rank);\n    env_rank = getenv("MPI_DEBUG_RANK");\n    a_rank = (env_rank == nullptr)? 0 : atoi(env_rank);\n\n    if (getenv("MPI_DEBUG") != nullptr && a_rank == rank) {\n        volatile int f = 0;\n        char hostname[256];\n        gethostname(hostname, sizeof(hostname));\n        printf("PID %d on %s is ready for attach.", getpid(), hostname);\n        fflush(stdout);\n        while (f == 0)\n            sleep(5);\n    }\n    MPI_Barrier(MPI_COMM_WORLD);\n}\n')),(0,l.kt)("p",null,"\u4e0a\u8ff0\u4ee3\u7801\u4f7f\u7528\u4e86\u4e24\u4e2a\u73af\u5883\u53d8\u91cf\uff0c\u5176\u4e2d\uff0c"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"MPI_DEBUG")," \u7528\u4e8e\u786e\u5b9a\u8981\u4e0d\u8981\u542f\u52a8\u8fd9\u6bb5\u8c03\u8bd5\u4ee3\u7801\uff1b"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"MPI_DEBUG_RANK")," \u7528\u4e8e\u6307\u5b9a\u8981\u8c03\u8bd5\u7684\u8fdb\u7a0b\uff0c\u5982\u679c\u8be5\u73af\u5883\u53d8\u91cf\u672a\u5b9a\u4e49\uff0c\u5219\u8c03\u8bd5 0 \u53f7\u8fdb\u7a0b\u3002")),(0,l.kt)("p",null,"\u8fd9\u4e2a\u4ee3\u7801\u5757\u4f1a\u628a\u6240\u6709\u8fdb\u7a0b\uff08\u9664\u4e86\u5f85\u8c03\u8bd5\u7684\uff09\u5361\u5728 ",(0,l.kt)("inlineCode",{parentName:"p"},"MPI_Barrier")," \u5904\uff0c\u800c\u628a\u5f85\u8c03\u8bd5\u7684\u8fdb\u7a0b\u5361\u5728 ",(0,l.kt)("inlineCode",{parentName:"p"},"while")," \u5185\u3002\u5f53\u5f85\u8c03\u8bd5\u8fdb\u7a0b\u6267\u884c\u5230 ",(0,l.kt)("inlineCode",{parentName:"p"},"MPI_Barrier")," \u65f6\uff0c\u6240\u6709\u8fdb\u7a0b\u90fd\u53ef\u4ee5\u7ee7\u7eed\u6267\u884c\uff0c\u76f4\u5230\u4e0b\u4e00\u4e2a\u540c\u6b65\uff08\u6216\u6b7b\u5faa\u73af\uff09\u3002"),(0,l.kt)("h2",{id:"\u4f7f\u7528-totalview-\u8c03\u8bd5-mpi-\u7a0b\u5e8f"},"\u4f7f\u7528 TotalView \u8c03\u8bd5 MPI \u7a0b\u5e8f"),(0,l.kt)("p",null,"TotalView \u662f\u4ea7\u54c1\u7ea7\u7684\u5168\u80fd\uff08full-featured\uff09\u5e76\u884c\u7a0b\u5e8f\u8c03\u8bd5\u5de5\u5177\u3002"),(0,l.kt)("p",null,"\u5b9e\u9a8c\u5ba4\u767b\u5f55\u8282\u70b9 ",(0,l.kt)("em",{parentName:"p"},"node02")," \u4e0a\u5b89\u88c5\u4e86 TotalView 2019\u3002\u7531\u4e8e\u662f\u6559\u80b2\u8bb8\u53ef\uff0c\u76ee\u524d\u8be5\u8f6f\u4ef6\u4ec5\u80fd\u5728 ",(0,l.kt)("em",{parentName:"p"},"node02")," \u4e0a\u4f7f\u7528\u3002"),(0,l.kt)("p",null,"TotalView \u6709 GUI \u548c CLI\uff0c\u542f\u7528 CLI \u7684\u547d\u4ee4\u4e3a ",(0,l.kt)("inlineCode",{parentName:"p"},"totalviewcli"),"\uff0c\u4f7f\u7528\u65b9\u6cd5\u4e0e GDB \u7c7b\u4f3c\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ ml TotalView\n$ totalviewcli\n")),(0,l.kt)("p",null,"\u8be6\u7ec6\u4f7f\u7528\u65b9\u6cd5\u8bf7\u53c2\u8003\u5b98\u65b9\u7f51\u7ad9 ",(0,l.kt)("a",{parentName:"p",href:"https://www.roguewave.com/products-services/totalview"},"TotalView for HPC"),"\u3002\u5b98\u7f51\u4e2d\u6709\u7528\u6237\u624b\u518c\u3001\u6559\u5b66\u89c6\u9891\u7b49\u8d44\u6e90\u3002"))}m.isMDXComponent=!0}}]);