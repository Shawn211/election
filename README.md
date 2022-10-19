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
地址：[http://localhost:2711/api](http://localhost:2711/api)

内容：包含所有实现功能的接口与对应参数限制，并涵盖了所有约束情况的对应状态码的描述

## 系统管理员
|邮箱|香港身份证号|权限|
|----|-----|-----|
|admin@admin.com|A012345(6)|系统管理员|

## 数据库表设计
* Election
  |字段|描述|
  |----|-----|
  |electionId|选举ID|
  |status|选举状态: 0-未开始 1-进行中 2-已结束|
* User
  |字段|描述|
  |----|-----|
  |userId|用户ID|
  |email|邮箱|
  |hkId|香港身份证号码|
* Candidate
  |字段|描述|
  |----|-----|
  |candidateId|候选人ID|
  |electionId|选举ID|
  |userId|用户ID|
* Vote
  |字段|描述|
  |----|-----|
  |voteId|投票ID|
  |candidateId|候选者ID|
  |voterId|投票者ID|