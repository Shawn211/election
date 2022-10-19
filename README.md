# Ecletion
基于 **Node.js** + **TypeScript** + **Nest.js** + **Postgres** + **TypeORM** + **Redis** + **Docker** 实现的一款简单高效的**简易选举投票后端服务**。

## 环境依赖
1. [Node.js](https://nodejs.org/)
2. [Docker](https://www.docker.com/)
3. *[Git Bash](https://git-scm.com/) ( Unix 终端，仅 Windows 环境需要)

## 启动项目
1. 本地脚本 Docker 启动 Postgres 和 Redis 实例
``` bash
npm run start:dev:db
```

2. 启动项目
``` bash
npm run start:dev
```

## API 文档
[http://localhost:2711/api](http://localhost:2711/api)

## 系统管理员
|邮箱|香港身份证号|权限|
|----|-----|-----|
|admin@admin.com|A012345(6)|系统管理员|