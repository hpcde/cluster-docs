"use strict";(self.webpackChunkhpcer_cluster_docs=self.webpackChunkhpcer_cluster_docs||[]).push([[8636],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return g}});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function l(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?l(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function o(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=n.createContext({}),c=function(e){var r=n.useContext(u),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},p=function(e){var r=c(e.components);return n.createElement(u.Provider,{value:r},e.children)},s={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),d=c(t),g=a,m=d["".concat(u,".").concat(g)]||d[g]||s[g]||l;return t?n.createElement(m,i(i({ref:r},p),{},{components:t})):n.createElement(m,i({ref:r},p))}));function g(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var l=t.length,i=new Array(l);i[0]=d;var o={};for(var u in r)hasOwnProperty.call(r,u)&&(o[u]=r[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var c=2;c<l;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6889:function(e,r,t){t.r(r),t.d(r,{assets:function(){return p},contentTitle:function(){return u},default:function(){return g},frontMatter:function(){return o},metadata:function(){return c},toc:function(){return s}});var n=t(7462),a=t(3366),l=(t(7294),t(3905)),i=["components"],o={id:"valgrind",title:"\u4f7f\u7528Valgrind\u5206\u6790\u5de5\u5177"},u=void 0,c={unversionedId:"users/debug/valgrind",id:"users/debug/valgrind",title:"\u4f7f\u7528Valgrind\u5206\u6790\u5de5\u5177",description:"Valgrind \u662f\u4e00\u4e2a\u975e\u5e38\u6d41\u884c\u7684\u4e8c\u8fdb\u5236\u63d2\u6869\u6846\u67b6\uff08instrumentation framework\uff09\uff0c\u53ef\u7528\u4e8e\u6784\u5efa\u52a8\u6001\u5206\u6790\u5de5\u5177\u3002\u76ee\u524d\u7684\u53d1\u884c\u7248\u672c\u4e2d\u81ea\u5e26\u4e86\u8bb8\u591a Valgrind \u5de5\u5177\uff0c\u7528\u4e8e\u63a2\u6d4b\u5185\u5b58\u7ba1\u7406\u95ee\u9898\u3001\u7ebf\u7a0b\u95ee\u9898\u7b49\u3002\u5b83\u652f\u6301 MPI \u7a0b\u5e8f\u7684\u5206\u6790\u3002",source:"@site/docs/users/debug/04-debug-valgrind.md",sourceDirName:"users/debug",slug:"/users/debug/valgrind",permalink:"/cluster-docs/docs/users/debug/valgrind",editUrl:"https://github.com/hpcde/cluster-docs/blob/master/docs/users/debug/04-debug-valgrind.md",tags:[],version:"current",lastUpdatedBy:"genshen",lastUpdatedAt:1577847098,formattedLastUpdatedAt:"1/1/2020",sidebarPosition:4,frontMatter:{id:"valgrind",title:"\u4f7f\u7528Valgrind\u5206\u6790\u5de5\u5177"},sidebar:"docs",previous:{title:"\u8c03\u8bd5\u5e76\u884c\u7a0b\u5e8f",permalink:"/cluster-docs/docs/users/debug/parallel"},next:{title:"\u4f7f\u7528Score-P\u5206\u6790\u6027\u80fd",permalink:"/cluster-docs/docs/users/profile/scorep"}},p={},s=[{value:"\u5185\u5b58\u68c0\u6d4b\u5de5\u5177",id:"\u5185\u5b58\u68c0\u6d4b\u5de5\u5177",level:2}],d={toc:s};function g(e){var r=e.components,t=(0,a.Z)(e,i);return(0,l.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Valgrind \u662f\u4e00\u4e2a\u975e\u5e38\u6d41\u884c\u7684\u4e8c\u8fdb\u5236\u63d2\u6869\u6846\u67b6\uff08instrumentation framework\uff09\uff0c\u53ef\u7528\u4e8e\u6784\u5efa\u52a8\u6001\u5206\u6790\u5de5\u5177\u3002\u76ee\u524d\u7684\u53d1\u884c\u7248\u672c\u4e2d\u81ea\u5e26\u4e86\u8bb8\u591a Valgrind \u5de5\u5177\uff0c\u7528\u4e8e\u63a2\u6d4b\u5185\u5b58\u7ba1\u7406\u95ee\u9898\u3001\u7ebf\u7a0b\u95ee\u9898\u7b49\u3002\u5b83\u652f\u6301 MPI \u7a0b\u5e8f\u7684\u5206\u6790\u3002"),(0,l.kt)("p",null,"\u76ee\u524d\uff0c\u5b9e\u9a8c\u5ba4\u96c6\u7fa4\u4e0a\u5b89\u88c5 Valgrind 3.13 \u4f9b\u5927\u5bb6\u4f7f\u7528\u3002"),(0,l.kt)("p",null,"Valgrind \u5404\u4e2a\u5de5\u5177\u7684\u5177\u4f53\u7528\u6cd5\u53ef\u4ee5\u53c2\u8003",(0,l.kt)("a",{parentName:"p",href:"http://valgrind.org/"},"\u5b98\u65b9\u6587\u6863"),"\u3002"),(0,l.kt)("h2",{id:"\u5185\u5b58\u68c0\u6d4b\u5de5\u5177"},"\u5185\u5b58\u68c0\u6d4b\u5de5\u5177"),(0,l.kt)("p",null,"Valgrind \u9ed8\u8ba4\u7684\u5de5\u5177\u4e3a ",(0,l.kt)("em",{parentName:"p"},"Memcheck"),"\uff0c\u7528\u4e8e\u68c0\u6d4b\u5404\u79cd\u5185\u5b58\u7ba1\u7406\u65b9\u9762\u7684\u95ee\u9898\uff0c\u5982\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5185\u5b58\u8bbf\u95ee\u8d8a\u754c\uff1b"),(0,l.kt)("li",{parentName:"ul"},"\u5185\u5b58\u6cc4\u6f0f\uff1b"),(0,l.kt)("li",{parentName:"ul"},"\u4f7f\u7528\u672a\u521d\u59cb\u5316\u7684\u53d8\u91cf\uff1b"),(0,l.kt)("li",{parentName:"ul"},"\u5185\u5b58\u62f7\u8d1d\u65f6\u76ee\u6807\u5185\u5b58\u5757\u4e0e\u6e90\u5185\u5b58\u5757\u91cd\u53e0\uff1b")),(0,l.kt)("p",null,"\u7b49\u7b49\u3002"),(0,l.kt)("p",null,"\u4f7f\u7528 Valgrind \u4e4b\u524d\uff0c\u6700\u597d\u5728\u7f16\u8bd1\u4ee3\u7801\u65f6\u52a0\u4e0a\u8c03\u8bd5\u9009\u9879\uff0c\u5982 ",(0,l.kt)("inlineCode",{parentName:"p"},"-g"),"\u3002\u8c03\u8bd5\u4fe1\u606f\u53ef\u4ee5\u8ba9 Valgrind \u6253\u5370\u51fa\u95ee\u9898\u53d1\u751f\u7684\u5177\u4f53\u4ee3\u7801\u4f4d\u7f6e\u3002\n\u6700\u7b80\u5355\u7684\u7528\u6cd5\u5c31\u662f\u76f4\u63a5\u8c03\u7528\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ valgrind myprog\n")),(0,l.kt)("p",null,"\u53e6\u4e00\u79cd\u65b9\u5f0f\u662f\u4f7f\u7528 OpenMPI\u3002OpenMPI \u53ef\u4ee5\u652f\u6301 Valgrind\uff0c\u56e0\u6b64\u6211\u4eec\u5b89\u88c5\u4e86\u4e00\u4e2a\u76f8\u5e94\u7684\u5de5\u5177\u94fe\u4f9b\u5927\u5bb6\u4f7f\u7528\u3002\u793a\u4f8b\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"ml gompi/2019a-debug\nmpirun -np 4 -mca btl_tcp_if_include 172.16.0.0/24 \\\nvalgrind ./myprog\n")),(0,l.kt)("p",null,"\u4e0a\u8ff0\u547d\u4ee4\u4e2d\uff0c",(0,l.kt)("inlineCode",{parentName:"p"},"valgrind")," \u540e\u4e5f\u53ef\u4ee5\u52a0\u4e0a\u4e0e ",(0,l.kt)("inlineCode",{parentName:"p"},"Memcheck")," \u76f8\u5173\u7684\u9009\u9879\u3002"))}g.isMDXComponent=!0}}]);