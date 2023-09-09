# monorepo

基于 [pnpm workspace](https://www.pnpm.cn/workspaces) 机制实现 monorepo 把单独的包抽离到独立的子项目中维护

__是什么？__
Monorepo 是一种管理多个项目代码的方式，将多个项目存储在同一个版本库中。通过这种方式，多个项目可以共享代码，同时保持各自的独立性。


__背景__
Monorepo 的出现主要是为了解决跨项目代码复用、版本管理和协同开发的问题。对于大型组织来说，虽然 NPM 包也可以用于代码共享，但是在一些场景下维护管理起来比较复杂，在大型组织项目中，使用 Monorepo 可以更方便地管理和共享代码。


__应用场景__
当你需要管理和维护多个有共享代码的项目，或者你需要协调一个团队开发多个项目，你可以考虑使用 Monorepo。例如，Google 和 Facebook 都使用 Monorepo 来管理他们的代码库。



__原理__

* 默认策略
在使用 Node.js 进行模块引用时，它的解析策略大致是这样的：当你使用 `require` 或 `import` 引入一个模块时，Node.js 首先会查看是否有本地文件或文件夹匹配该模块名。如果没有，它会向上遍历目录树，查看每个 `node_modules` 文件夹，看是否存在匹配的模块。
然而，在 Monorepo 结构中， `app01` 和 `shared` 并不在同一个文件夹内，也没有相同的父 `node_modules` 文件夹。因此，如果没有额外的帮助，Node.js 将无法正确解析跨包的 


* 符号链接
这就是 Pnpm Workspaces, Yarn Workspaces 和 Lerna 发挥作用的地方。它们通过创建符号链接（symlink）来帮助 Node.js 解析跨包引用。

具体看 pnpm 的 [链接工作区（link-workspace-packages）](https://www.pnpm.cn/npmrc#link-workspace-packages)

当你在 Monorepo 中运行 `pnpm install`, `yarn install` 或 `lerna bootstrap`  时，Pnpm, Yarn 和 Lerna 会遍历所有的子项目，看它们的 `package.json` 中是否有对其他子项目的依赖。如果有，它们就会在该子项目的 `node_modules` 文件夹中创建一个指向被依赖子项目的符号链接。这样，当 Node.js 尝试查找模块时，它会找到这个符号链接，并被正确地重定向到被依赖的子项目。

所以，尽管 Node.js 本身并不支持 Monorepo 中的跨包引用，但通过使用 Yarn Workspaces 或 Lerna，我们可以“欺骗” Node.js，让它以为所有的子项目都在同一个 `node_modules` 文件夹中，从而正确地解析跨包的 `import` 语句。
---


__如何使用？__

* 项目结构参考：
```bash
/monorepo
├── package.json
├── public
├── /packages   # 应用目录
│    ├── /app01
│    │   ├── package.json
│    │   ├── src
│    ├── /app02
│    │   ├── package.json
│    │   ├── src
│    ├── /shared
│    │   ├── package.json
│    │   ├── src
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── typings     # 类型声明，包括：全局组件、业务数据、远程微模块、shim
```

---
* 代码写法
如果你想在应用 app01 中引入 shared 中的某个模块， 你可以在 app01 的 `package.json` 中声明
```json
"dependencies": {
    "@monorepo/shared":"*"  // * 表示使用最新版本
  },
```

或者这样直接在项目根目录下使用 pnpm 命令:
```shell
pnpm add @monorepo/shared --filter @monorepo/app01
```

以上命令是 `pnpm --filter` 系列命令，可以为指定包 安装依赖
``` shell
pnpm add @types/lodash --filter @monorepo/shared
```


然后，就可以引入并使用了
``` ts 
import { useHttp } from "@monorepo/shared";

console.log(useHttp());
```


在这里，你不必先将 `shared` 发布到 npm，但可以像引用 npm 包一样引用 `shared` 代码库中的 `useHttp` 方法。