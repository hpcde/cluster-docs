"use strict";(self.webpackChunkhpcer_cluster_docs=self.webpackChunkhpcer_cluster_docs||[]).push([[5797],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},u=Object.keys(e);for(r=0;r<u.length;r++)n=u[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(r=0;r<u.length;r++)n=u[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,u=e.originalType,l=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),d=c(n),m=o,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||u;return n?r.createElement(f,a(a({ref:t},s),{},{components:n})):r.createElement(f,a({ref:t},s))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var u=n.length,a=new Array(u);a[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var c=2;c<u;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3965:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return p}});var r=n(7462),o=n(3366),u=(n(7294),n(3905)),a=["components"],i={id:"introduction",title:"\u5728\u96c6\u7fa4\u4e0a\u8c03\u8bd5\u53ca\u5206\u6790\u7a0b\u5e8f"},l=void 0,c={unversionedId:"users/debug/introduction",id:"users/debug/introduction",title:"\u5728\u96c6\u7fa4\u4e0a\u8c03\u8bd5\u53ca\u5206\u6790\u7a0b\u5e8f",description:"\u5728\u96c6\u7fa4\u4e0a\u8c03\u8bd5\u7a0b\u5e8f\u65f6\uff0c\u6700\u7b80\u5355\u7684\u6b65\u9aa4\u5982\u4e0b\uff1a",source:"@site/docs/users/debug/01-debug-intro.md",sourceDirName:"users/debug",slug:"/users/debug/introduction",permalink:"/cluster-docs/docs/users/debug/introduction",editUrl:"https://github.com/hpcde/cluster-docs/blob/master/docs/users/debug/01-debug-intro.md",tags:[],version:"current",lastUpdatedBy:"genshen",lastUpdatedAt:1577847098,formattedLastUpdatedAt:"1/1/2020",sidebarPosition:1,frontMatter:{id:"introduction",title:"\u5728\u96c6\u7fa4\u4e0a\u8c03\u8bd5\u53ca\u5206\u6790\u7a0b\u5e8f"},sidebar:"docs",previous:{title:"Slurm \u9ad8\u7ea7\u7528\u6cd5",permalink:"/cluster-docs/docs/users/slurm/advanced"},next:{title:"\u4f7f\u7528GDB",permalink:"/cluster-docs/docs/users/debug/gdb"}},s={},p=[],d={toc:p};function m(e){var t=e.components,n=(0,o.Z)(e,a);return(0,u.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,u.kt)("p",null,"\u5728\u96c6\u7fa4\u4e0a\u8c03\u8bd5\u7a0b\u5e8f\u65f6\uff0c\u6700\u7b80\u5355\u7684\u6b65\u9aa4\u5982\u4e0b\uff1a"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},"\u4f7f\u7528 ",(0,u.kt)("inlineCode",{parentName:"li"},"salloc")," \u547d\u4ee4\u7533\u8bf7\u4e00\u4e2a\u8282\u70b9\uff0c\u8bb0\u4e3a ",(0,u.kt)("inlineCode",{parentName:"li"},"nodeX"),"\uff1b"),(0,u.kt)("li",{parentName:"ul"},"\u7533\u8bf7\u6210\u529f\u540e\uff0c\u4f7f\u7528 ",(0,u.kt)("inlineCode",{parentName:"li"},"ssh")," \u8fdc\u7a0b\u8fde\u63a5\u5230 ",(0,u.kt)("inlineCode",{parentName:"li"},"nodeX"),"\uff1b"),(0,u.kt)("li",{parentName:"ul"},"\u7f16\u8bd1\u4ee3\u7801\uff1b"),(0,u.kt)("li",{parentName:"ul"},"\u5728 ",(0,u.kt)("inlineCode",{parentName:"li"},"nodeX")," \u4e0a\u4f7f\u7528\u5de5\u5177\u8c03\u8bd5\u7a0b\u5e8f\uff0c\u6216\u8005\u5c06\u7a0b\u5e8f\u63d0\u4ea4\u5230\u96c6\u7fa4\u6267\u884c\u3002")),(0,u.kt)("p",null,"\u5927\u81f4\u547d\u4ee4\u5982\u4e0b\uff1a"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-bash"},"$ salloc -N 1 --exclusive [-p Vhagar]   # -p\u7528\u4e8e\u6307\u5b9a\u5206\u533a\n$ ssh nodeX     # nodeX\u662f\u7533\u8bf7\u5230\u7684\u8282\u70b9\n# \u7f16\u8bd1...\n# \u8c03\u8bd5...\n# \u6216\u8005\u4f7f\u7528 srun/sbatch \u63d0\u4ea4\u7ed9\u96c6\u7fa4...\n")),(0,u.kt)("blockquote",null,(0,u.kt)("p",{parentName:"blockquote"},"\u6ce8\uff1a\u7533\u8bf7\u8282\u70b9\u7684\u76ee\u7684\u662f\u8ba9\u6240\u6709\u8c03\u8bd5\u5de5\u4f5c\u5728\u8fdc\u7a0b\u8282\u70b9\u4e0a\u5b8c\u6210\uff0c\u4e0d\u5360\u7528\u767b\u5f55\u8282\u70b9\u7684 CPU\u3002")),(0,u.kt)("p",null,"\u5728\u8fdc\u7a0b\u8282\u70b9\u4e0a\u53ef\u4ee5\u4f7f\u7528\u7684\u8c03\u8bd5\u548c\u5206\u6790\u5de5\u5177\u6765\u6e90\u4e3a\uff1a"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},"\u96c6\u7fa4\u73af\u5883\u4e0b\u5b89\u88c5\u7684\u5de5\u5177\uff0c\u5373\u4f7f\u7528 ",(0,u.kt)("inlineCode",{parentName:"li"},"module load")," \u547d\u4ee4\u53ef\u4ee5\u52a0\u8f7d\u7684\u5de5\u5177\uff0c\u5982 Valgrind, VTune\uff1b"),(0,u.kt)("li",{parentName:"ul"},"\u5b89\u88c5\u5728\u672c\u673a\u7684\u5de5\u5177\uff0c\u5982 GDB\uff1b"),(0,u.kt)("li",{parentName:"ul"},"\u7528\u6237\u5b89\u88c5\u5728\u5bb6\u76ee\u5f55\u7684\u5de5\u5177\u3002")))}m.isMDXComponent=!0}}]);