# pnpm安装和配置

1.安装

```sh
npm install pnpm -g
```

查看是否安装成功：`pnpm -v`

2.修改淘宝镜像源

```sh
# https://registry.npmjs.org
pnpm config set registry https://registry.npmmirror.com/
# 或者
pnpm config set registry https://registry.npm.taobao.org/
```

3.验证是否成功

```sh
pnpm config get registry
```

4.设置包存储仓库，比如E盘的.pnpm-store（注：请将项目和包存储仓库放在一个磁盘）

```sh
# 以管理员身份运行power shell
# 安装完记得重启下环境使其生效
# windows 环境不好整就直接重启，重启后指定目录会生效
pnpm config set store-dir /path/to/.pnpm-store (--global)
pnpm config set store-dir C:\.pnpm-store --global
```

5.查看是否成功

```sh
pnpm store path
```

6.常用命令

```sh
pnpm add -g pnpm to update # 升级版本
pnpm install # 全局安装依赖
pnpm build # 构建 packages
pnpm add (-g)(-D) 包名 # 安装依赖
pnpm remove (-D) 包名 (--global) # 删除依赖
pnpm 脚本 或 pnpm run脚本 # 启动脚本
pnpm rm -P #  删除dependencies 中相关依赖项
pnpm uninstall -g # 全局中删除
pnpm prune # 移除没有在项目中使用的packages
pnpm env use --global lts # 安装lts版node
pnpm env use --global 18  # 安装v18版node
pnpm env use --global latest # 安装最新node
pnpm env remove --global 14.0.0 # 移除指定版本node
pnpm env list # 查看本地有的node版本
pnpm env list --remote # 查看网络源可用的node版本
pnpm test # 验证项目
pnpm store prune # 清除整个缓存, 移除所有不再引用的包
pnpm store path # 输出 pnpm 缓存的位置
pnpm store verify # 验证缓存

pnpm up                # 更新所有依赖项
pnpm upgrade 包        # 更新包
pnpm upgrade 包 --global  # 更新全局包

pnpm list [-g] #  查看依赖(全局)
```

## 幽灵依赖 - 在系统上禁止使用脚本解决方法

```sh
# 以管理员身份运行power shell
# 幽灵依赖--将依赖A中的依赖同步到node_module下，避免以后依赖A中的依赖发生改变，导致无法察觉的bug
set-executionpolicy remotesigned
# 或者 .npmrc 文件中加入
shamefully-hoist=true
```
