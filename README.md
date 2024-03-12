## 目录结构

https://github.com/nestjs/ \
https://nest.nodejs.cn/ \

```
+-- bin // 自定义任务脚本
+-- dist // 源码构建目录
+-- public // 静态资源目录（web页面）
+-- src
|   +-- config // 公共全局配置
|   +-- i18n // 国际化语言文件
|   +-- init // 系统初始化操作
|   +-- common // 公共全局模块
|   |   +-- constants // 静态变量 常量
|   |   +-- decorators // 装饰器
|   |   +-- dto // DTO (Data Transfer Object) Schema, Validation
|   |   +-- enums // 枚举变量
|   |   +-- exceptions // 自定义异常
|   |   +-- filters // 异常过滤器
|   |   +-- guards // 守卫
|   |   +-- interceptors // 拦截器
|   |   +-- interfaces // 公共类型接口
|   |   +-- middleware // 中间件
|   |   +-- pipes // 管道
|   |   +-- providers // 服务
|   +-- modules // 业务模块
|   |   +-- admin/users // 通过命令 nest g res [模块名] 生成
|   |   |   +-- dto
|   |   |   +-- entities
|   |   |   +-- enums
|   |   |   +-- users.constant.ts
|   |   |   +-- users.controller.ts
|   |   |   +-- users.service.ts
|  |    |   +-- users.module.ts
|   |   |   +-- users.exception.ts
|   |   |   +-- users.*.ts
|   |   |   +-- index.ts
|   |   +-- shared/* // 共享模块
|   +-- * // 其他模块同以上结构
+-- test // Jest testing

```

## Installation

```bash
vscode 扩展
在安装扩展输入框输入 @recommended 安装工作区推荐的扩展

Chinese:中文语言包
Prettier:格式化代码-JavaScript / TypeScript / CSS
JavaScript (ES6) snippets:支持 JavaScript ES6 语法
Bookmarks
One Dark Pro
ESLint
Remote Development
Path Intellisense 路径补全
Babel JavaScript：支持ES201X、React、FlowType以及GraphQL的语法高亮。

node-snippets
ashinzekene/NestJS Snippets
Abhijoy Basak/NestJS Files

```

## 程序初始化

```
pnpm i -g @nestjs/cli
pnpm install
// listen EACCES: permission denied 0.0.0.0:443 时执行以下脚本
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```

## 配置 lanunch.json 进行应用调试

## 升级

```sh
npm audit
npm outdated # 检测哪些包可以升级
npm upgrade @nestjs/common --latest # 升级最新版本
npm upgrade @nestjs/core --latest # 升级最新版本
npm upgrade @nestjs/jwt@9.0.0 # 升级指定包
npm install -D
npm update
npm cache clean --force

# 批量升级
npm install -g npm-check-updates
npm-check-updates #  简写 ncu
# 更新 package.json 文件中的版本
ncu -u
# 执行npm install 自动安装最新的包
npm install

## 注意
chalk 不要升级
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run dev

# production mode
$ pnpm run prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).

## 配置 git

```
# server certificate verification failed. CAfile: none CRLfile: none
git config --global http.sslverify false
git config --global https.sslverify false
# 配置用户名密码
git config credential.helper store
git config [--global] [--unset] credential.helper store

git config --global user.name "username"
git config --global user.email useremail@163.com
```

## 提交规范

git commit -m "<type>(<scope>): <subject>"

1、type (必须)

````
用于说明 git commit 的类别，只允许使用下面的标识
feat: 新功能（feature）
fix: 修复 bug
docs: 文档（documentation）
style: 优化项目结构或者代码格式（不影响代码运行的变动）
refactor: 重构（既不是新增功能，也不是修改 bug 的代码变动. 不应该影响原有功能, 包括对外暴露的接口）
test: 增加测试
chore: 构建过程, 辅助工具升级. 如升级依赖, 升级构建工具
perf: 性能优化
revert: 回滚之前的commit \
 git revert 命令用于撤销之前的一个提交, 并在为这个撤销操作生成一个提交
build或release: 构建或发布版本
ci: 持续集成
types: 类型定义文件更改
workflow: 工作流改进
wip: 开发中
safe: 修复安全问题
merge: 代码合并
```
2. scope: 可选. 说明提交影响的范围. 例如样式, 后端接口, 逻辑层等等
3. Subject: 提交目的的简短描述, 动词开头, 不超过80个字符. 不要为了提交而提交

build, ci, perf

如:
git status
git add .
git commit -m "fix: 修复"
git commit -m "feat: 修复"
git push

## i18n

````

# [https://github.com/toonvanstrijp/nestjs-i18n]

https://github.com/toonvanstrijp/nestjs-i18n/tree/main/docs \
npm install --save nestjs-i18n

# nest-cli.json

```json
{
    "collection": "@nestjs/schematics",
    "sourceRoot": "src",
    "compilerOptions": {
        "assets": [{ "include": "i18n/**/*", "watchAssets": true }]
    }
}
```

# app.module.ts

```ts
@Module({
    imports: [
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
        }),
    ],
    controllers: [],
})
```

# users.service.ts / users.controller.ts

```ts
constructor(private readonly i18nService: I18nService) {}

```

## 静态服务 [https://docs.nestjs.com/recipes/serve-static]

```

npm install --save @nestjs/serve-static

```

## curd

```sh
npm install mongodb --save
npm install @nestjsx/crud class-transformer class-validator
npm install @nestjs/typeorm typeorm --save
or
npm install --save @nestjs/mongoose mongoose
```

## 模块开发流程

1. 生成一个 REST API 类 `nest g res modules/admin/role`
2. 定义表结构，创建文件夹 schemas 和 schema (Roles RolesSchema createRoleValidationSchema)
3. 创建 dto 类
4. 如果有 controller 操作接口，要在对应的 dto 类注入验证 schema 对象 @RequestValidationSchema(createRoleValidationSchema)
5. 增加 i18n 文件 i18n/zh-CN/role.json
6. 增加错误异常文件类 role.exception.ts

```ts
// role.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GuestDecorator } from '@/modules/shared/auth/decorators';
import { OpenApiResponseDto } from '@/common/dto';
import { OpenApiHeaderConfigure } from '@/common/constants';
import { appConfig } from '@/config';
import { OperateLogEnum } from '@/common/enum';

// 抛出 400类(客户端错误)异常 500类(服务器错误)异常
// 出现多级路由时，多级的要排前面定义 role/role-group-list > role/:id

// -- swagger 设置 --begain
// 设置标题
@ApiTags('角色管理')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
@Controller(`${appConfig.adminPrefix}role`)
export class RoleController {
    private logMoudle = 'role.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(private readonly service: RoleService) {}
    @ApiOperation({ summary: 'xxx' })
    // @ApiResult({ status: 200, type: RoleListDto, isPage: true })
    @ApiResult({ type: RoleListDto })
    @Get(@RequestUserDecorator() loginUser: RequestUserDto)
    get() {
        //
    }
}
```

```ts
// role.service.ts
import { BaseService } from '@/common/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService extends BaseService<Role> {
    constructor(
        @InjectMongooseRepository(Role.name) protected readonly repository: MongooseRepository<Role>,
        // 有循环依赖时
        @Inject(forwardRef(() => MenuService)) private readonly menuService: MenuService,
    ) {
        super(repository);
    }
}
```

```ts
// role.module.ts
const providers = [RoleService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
        // 有循环依赖时
        forwardRef(() => MenuModule),
        AuthModule,
        RoleGroupModule,
        AdminRouteModule,
        UserModule,
    ],
    controllers: [RoleController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class RoleModule {}
```

```ts
// role.exception.ts
import { ApiException } from '@/common/exceptions';
import { ApiErrorInterface } from '@/common/interfaces';

export class RoleException extends ApiException {
    constructor(objectOrError?: ApiErrorInterface, error?: any) {
        super(objectOrError, error);
    }
}
```

7. 在文件 api-error-code.constant.ts 中增加错误对象`RoleError`

```

### 常用模块

```

1. npm install mkdirp --save 创建文件夹
2. npm install jimp --save 缩略图

```

### 部署

1. 本地运行

```

npm run build
tar zcvf node_modules.tar.gz node_modules
tar zxvf node_modules.tar.gz

tar zcvf dist.tar.gz dist
tar zxvf dist.tar.gz

# sh bin/build.sh

# sh bin/build.sh m

表初始化
node dist/init/main.js --init

使用 pm2
npm install -g pm2
启动服务
pm2 start ecosystem.config.js

pm2 start app.js --name my-api # 命名进程
pm2 start app.js -i 4 #后台运行 pm2，启动 4 个 app.js
pm2 start test.php # 运行 php 程序
pm2 list # 查看进程
pm2 stop all # 停止所有
pm2 restart all # 重启所有进程
pm2 monit # 监视所有进程
pm2 logs # 查看日志
pm2 log [app_id] # 查看日志
pm2 restart [app_id]
pm2 stop [app_id]
pm2 plus # 开启 web 监控页面，需要注册 pm2 的官方账号
pm2 delete all

# sh bin/install.sh

# sh bin/install.sh init

```

2. 上传以下文件到服务器

```

dist
bin
node_modules
.env

```

3. 服务器运行

```

npm config set registry https://registry.npm.taobao.org
npm set strict-ssl false
npm i 或 npm i -f
node dist/init/main.js --init
node dist/main.js
pm2 start ecosystem.config.js --watch
pm2 stop das
pm2 restart das

# 打包

```sh
npm i -g @vercel/ncc
npm run build
ncc build dist/main.js -m -o dist_ncc

```

# 日志查看

pm2 logs das
pm2 monit

# 清除 api 应用的日志

pm2 flush das

## 获取序列号

```sh
# 获取硬盘序列号
lsblk --nodeps -no serial /dev/sda # 在虚拟机上获取为空
# 获取硬盘 UUID
blkid -s UUID /dev/sda1
blkid -s UUID /dev/sda1 | md5sum | awk '{printf $1}'

# 获取CPU序列号
dmidecode -t system | grep UUID
# 获取主板信息
dmidecode -t system | grep 'Serial Number'
dmidecode -t baseboard

# 获取产品UUID
cat /sys/class/dmi/id/product_uuid

cat /etc/machine-id
```

## SSL 证书

证书生成：
安装 openssl: `pt-get install openssl`

1. 成一个私钥 `openssl genrsa -out server.com.key 4096`
2. 自签名 CA，生成 CRT 文件 `openssl req -x509 -new -nodes -sha512 -days 3650 -subj "/C=CN/ST=Fujian/L=Fuzhou" -key server.com.key -out server.com.crt`
3. 生成证书签发请求(CSR) `openssl req -new -key server.com.key -out server.com.csr`
4. 颁发 SSL 证书 `openssl x509 -req -in server.com.csr -CA server.com.crt -CAkey server.com.key -CAcreateserial -out server.com.crt -days 3650`
5. 使用的文件：server.crt 和 server.key
6. 查看证书: `openssl x509 -in server.com.crt -noout -text`

## SSE

https://blog.csdn.net/Crazymryan/article/details/127116510 \
SSE 全称是 Server Sent Event，翻译过来的意思就是 服务器派发事件 \
https://github.com/nestjs/nest/blob/master/sample/28-sse

```ts
@Controller()
@Sse('sse')
sse(): Observable<MessageEvent> {
return interval(1000).pipe(
    map((_) => ({ data: { hello: 'world' } } as MessageEvent)),
);
}
```

```js
const eventSource = new EventSource('/sse');
eventSource.onmessage = ({ data }) => {
    const message = document.createElement('li');
    message.innerText = 'New message: ' + data;
    document.body.appendChild(message);
};
eventSource.close();
```

## 组件

```sh
# 缓存
# https://github.com/node-cache/node-cache
npm install node-cache

# hash 计算
# https://github.com/Daninet/hash-wasm
npm install hash-wasm
# bcrypt HMAC md5, sha1, sha512, sha3

# 文件上传
# https://docs.nestjs.com/techniques/file-upload
# https://github.com/expressjs/multer
npm install --save multer
npm i -D @types/multer
```

```ts
import { getRandomValues } from 'node:crypto';
import { md5, sm3, scrypt, bcrypt, pbkdf2, sha1, sha256, sha512, crc32 } from 'hash-wasm';

const salt = new Uint8Array(16);
// window.crypto.getRandomValues(salt);
getRandomValues(salt);
```

### sse 服务器发送事件

```ts
// 后端发送
@Sse('sse')
// 设置不验证 jwt
@PublicDecorator()
async sse(): Promise<Observable<MessageEvent>> {
    return interval(1000).pipe(map((_) => ({ data: {test: 'hello world'}, retry: 10000 } as MessageEvent)));
}
```

```ts
// 前端调用
const eventSource = new EventSource('/data/runtime/sse', { withCredentials: true });
// 连接建立时
eventSource.onopen = (e) => {};
// 接收消息
eventSource.onmessage = (event) => {};
// 发生错误时自动重连
eventSource.onerror = (e) => {};
eventSource?.close();
```

## 空间管理

数据存储 /mnt/disk/das/data
日志存储 /mnt/disk/das/logs
临时文件 /mnt/disk/public

# mongodb

添加用户

```sh
$ mongo
> use admin
> db.createUser({user:'admin',pwd:'Admin@db6.0.9',roles:[{ role: 'root', db: 'admin' }],mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]})
> db.auth('admin','Admin@db6.0.9')

> db.createUser({user:'das',pwd:'Das@db6.0.9',roles:[{role:'dbOwner', db: 'das'}],mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]})
> db.auth('das','Das@db6.0.9')

> db.createUser({user:'dbfw',pwd:'Dbfw@db6.0.9',roles:[{role:'dbOwner', db: 'dbfw'}],mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]})
> db.auth('dbfw','Dbfw@db6.0.9')

> db.getUsers()

> exit
```

# jsPDF

```sh
# https://github.com/parallax/jsPDF
# https://github.com/simonbengtsson/jsPDF-AutoTable
# http://www.rotisedapsales.com/snr/cloud2/website/jsPDF-master/docs/index.html
# https://artskydj.github.io/jsPDF/docs/index.html
npm install jspdf jspdf-autotable

Puppeteer

// 导出HTML
const html = `<html><head><style></style></head><body></body></html>`
const blob = new Blob([html], {
  type: 'application/msword',
  // type: 'application/pdf',
  // type: 'text/html;charset=utf-8,\ufeff'
});

const link = document.createElement('a');
link.download = 'output.doc'; // wps
link.href = URL.createObjectURL(blob);
link.click();

```

# fast-xml-parser

```sh
# https://github.com/NaturalIntelligence/fast-xml-parser
npm install fast-xml-parser
```
