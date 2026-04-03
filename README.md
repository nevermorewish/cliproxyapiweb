<p align="center">
  <img src="docs/screenshots/1.png" alt="CLIProxyAPI Dashboard" width="800">
</p>

<h1 align="center">CLIProxyAPI Dashboard (控制台)</h1>

<p align="center">
  <strong>将 Claude Code、Gemini CLI 和 Codex 转换为兼容 OpenAI 接口的 API — 通过现代化的 Web 控制台进行全局管理。</strong>
</p>

<p align="center">
  <a href="https://github.com/itsmylife44/cliproxyapi-dashboard/releases"><img src="https://img.shields.io/github/v/release/itsmylife44/cliproxyapi-dashboard" alt="Release"></a>
  <a href="https://github.com/itsmylife44/cliproxyapi-dashboard/actions/workflows/release.yml"><img src="https://github.com/itsmylife44/cliproxyapi-dashboard/actions/workflows/release.yml/badge.svg" alt="Build"></a>
  <a href="https://github.com/itsmylife44/cliproxyapi-dashboard/pkgs/container/cliproxyapi-dashboard%2Fdashboard"><img src="https://img.shields.io/badge/Docker-GHCR-blue?logo=docker" alt="Docker"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
</p>

---

## 项目简介

[CLIProxyAPIPlus](https://github.com/router-for-me/CLIProxyAPIPlus) 将基于 OAuth 认证的 CLI 工具（包括 Claude Code, Gemini CLI, Codex, GitHub Copilot, Kiro, Antigravity, Kimi, Qwen）封装成 **完全兼容 OpenAI 协议的 API**。
本 Dashboard 提供了一个可视化的 Web 界面，让您可以无需手动修改 YAML 文件，就能轻松管理所有服务商 (Providers)、API 密钥、配置项、系统日志及更新。

## 快速开始

> **本地使用 (macOS/Windows/Linux)**: 只需要安装 Docker Desktop。

```bash
git clone https://github.com/itsmylife44/cliproxyapi-dashboard.git
cd cliproxyapi-dashboard
./setup-local.sh          # macOS/Linux
# .\setup-local.ps1       # Windows
```

打开 **http://localhost:3000** → 创建管理员账户 → 完成。

> **服务器部署**: 请参阅完整的 [安装指南 (Installation Guide)](docs/INSTALLATION.md)。

## 核心特性

- **可视化配置** — 通过结构化表单管理 CLIProxyAPIPlus 设置，告别繁琐的 YAML 编辑
- **多平台 OAuth** — 快速连接 Claude, Gemini, Codex, Copilot, Kiro, Antigravity, iFlow, Kimi, 及 Qwen 账号
- **自定义供应商** — 支持添加任何兼容 OpenAI 标准的端点（如 OpenRouter, Ollama 等）并配置模型映射
- **密钥管理 (API Key)** — 创建、撤销并追踪每个用户的内部 API 密钥使用情况
- **实时监控** — 提供实时的日志流、容器健康状态检测以及服务启动/停止管理
- **额度追踪 (Quota)** — 按服务商（Claude, Codex, Kimi, Antigravity）记录请求速率限制和使用情况
- **Telegram 额度超限警告** — 当 OAuth 额度低于设定阈值时自动发送警告（可按服务商独立配置，具备 1 小时冷却期）
- **使用情况统计** — 直观展示请求总数、各服务商使用占比、模型统计及错误率
- **Oh-My-OpenCode 方案切换** — 支持在 [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)（9个 Agent + 分类）和 [oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim)（6个 Agent、低 Token 消耗、回退链路）之间切换，同时支持自定义每个 Agent 的模型与技能
- **配置同步 (Config Sync)** — 借助 [`opencode-cliproxyapi-sync`](https://github.com/itsmylife44/opencode-cliproxyapi-sync) 插件实现 OpenCode 配置的自动同步
- **配置分享** — 通过共享码 (`XXXX-XXXX`) 将您的模型配置分享给其他用户
- **一键更新** — 直接在管理后台即可更新 Dashboard (GHCR) 以及 CLIProxyAPIPlus (Docker Hub)
- **容器管理** — 支持在 UI 界面上启动、停止、重启相关容器
- **自动获取 TLS 证书** — 通过 Caddy 自动申请及续期 Let's Encrypt 证书

## Telegram 额度警告

当 OAuth 提供商账号额度不足时，您可以及时在 Telegram 上获取通知。

**设置步骤** (前往 Admin → Settings → Telegram Alerts)：

1. 通过 [@BotFather](https://t.me/BotFather) 创建 Telegram 机器人并复制 bot token
2. 获取您的 Chat ID (向机器人发送随意一条消息，然后访问 `https://api.telegram.org/bot<TOKEN>/getUpdates` 查看)
3. 在 Dashboard 仪表面板进入 **Admin → Settings → Telegram** 并输入：
   - Bot token (机器人令牌)
   - Chat ID (聊天 ID)
   - Quota threshold (触发阈值，例如剩余额度 20%)
   - 需要监控的供应商 (Claude, Codex, Kimi, Antigravity)
4. 启用警告 — 定时任务将每隔 5 分钟检查一次，单次提醒冷却时间为 1 小时

在开启功能前，可点击 **Test Message**（测试消息）按钮验证配置是否准确。

## Oh-My-OpenCode 集成支持

控制台目前支持两种 OpenCode 编排变体。在面板内的 **Using with OpenCode** 模块中可以随意切换：

| 编排方案 | 代理数量 | 说明描述 |
|---------|--------|-------------|
| **Oh-My-OpenCode** | 9 个代理 + 8 个大类 | 全功能的智能编排工作流，包含 sisyphus, atlas, prometheus, oracle 等 |
| **Oh-My-OpenCode Slim** | 6 个代理 | 轻量化：包含 orchestrator, oracle, designer, explorer, librarian, fixer。采用更低的 Token 使用量与独立配置的容错回退机制 |

**工作机制:**

1. 选择对应方案后，系统会自动更新 `opencode.json` 内的对应插件配置
2. 分配专属大模型（按层级自动分配或手动覆盖）
3. 按需开关 Agent 的技能支持 (simplify, cartography, agent-browser)
4. 通过同步插件实现配置文件的热生效

**初次部署安装** (每个变体需执行一次):

```bash
bunx oh-my-opencode@latest install          # 标准版本
bunx oh-my-opencode-slim@latest install     # 轻量版本
```

每种变体都维护各自单独的配置文件 (`oh-my-opencode.json` / `oh-my-opencode-slim.json`) ，彼此不会产生冲突。

## 界面截图

<p align="center">
  <img src="docs/screenshots/1.png" alt="Dashboard" width="700">
</p>

<p align="center">
  <img src="docs/screenshots/2.png" alt="Dashboard" width="700">
</p>

## 系统架构图

由 6 个独立的 Docker 容器组建并运行于两个隔离网络环境内：

<p align="center">
  <img src="docs/code-snippets/architecture.png" alt="Architecture" width="700">
</p>

| 系统服务 | 角色定义 |
|---------|------|
| **Caddy** | 作为反向代理并提供自动化的 TLS, HTTP/3 负载支持 |
| **Dashboard** | 基于 Next.js 开发的管理端应用，包含 JWT 身份认证，同时借助 Socket proxy 查询与管理 Docker 服务 |
| **CLIProxyAPIPlus** | 核心代理服务端，处理各类 OAuth 登录回调、中转路由以及响应 API 管理请求 |
| **Perplexity Sidecar** | 将 Perplexity Pro 订阅功能包装输出为完全兼容 OpenAI 接口规范的附属工具 |
| **Docker Socket Proxy** | 受限的 Docker API 访问层（仅拥有对容器状态信息的查询控制权，不涉及更底层的 host 权限问题） |
| **PostgreSQL** | 存放所有底层数据的独立数据库容器，运行在内部网络拒绝外网直连 |

## 目录结构

<p align="center">
  <img src="docs/code-snippets/project-structure.png" alt="Project Structure" width="600">
</p>

## 技术栈总结

| 模块部分 | 使用技术 |
|-----------|-----------|
| 框架核心 | Next.js 16 (App Router) |
| UI 组件 | React 19 |
| 样式渲染 | Tailwind CSS v4 |
| 数据库存储 | PostgreSQL 16 + Prisma 7 |
| 认证解密 | JWT (jose) + bcrypt |
| 容器运维 | 借助 Socket 代理管理 Docker CLI |

## 开发指南

```bash
cd dashboard
./dev-local.sh              # 启动测试环境
./dev-local.sh --reset      # 重置并清空数据库
./dev-local.sh --down       # 停止所有相关容器
```

您也可以选择更为手动的部署方式：

```bash
cd dashboard
npm install
cp .env.example .env.local  # 修改并输入您的数据库账密信息
npx prisma migrate dev
npm run dev
```

成功运行后访问 `http://localhost:3000` 即可进入本地调试控制台。

## 文档参考

| 教程指南 | 介绍说明 |
|-------|-------------|
| **[部署安装 (Installation)](docs/INSTALLATION.md)** | 服务器标准部署，本地搭建方案，以及手动安装详解 |
| **[配置说明 (Configuration)](docs/CONFIGURATION.md)** | 环境变量总览，`config.yaml` 定义解析与同步机制 |
| **[常见问题 (Troubleshooting)](docs/TROUBLESHOOTING.md)** | 日常使用中报错及无法使用的常见解决办法 |
| **[安全相关 (Security)](docs/SECURITY.md)** | 适用于生产部署的最佳安全实践守则 |
| **[系统备份 (Backup & Restore)](docs/BACKUP.md)** | 定时及手动系统的备份与恢复指导 |
| **[服务管理 (Service Management)](docs/SERVICE-MANAGEMENT.md)** | 常用的 Systemd 与 Docker Compose 命令行对照表 |

## 如何参与贡献

1. Fork 项目代码 → 拉取新分支开发特性 → 提交 PR 请求
2. 建议使用 [Conventional Commits (常规提交规范)](https://www.conventionalcommits.org/) 格式 (`feat:`, `fix:`, `chore:`)
3. 在提交合并申请之前先完成您本地环境中的通过测试

项目使用 Release-Please 可以依据 Commit 信息来自动生成最新包的发布版本与 Changelog。

## 技术支持

- **[CLIProxyAPIPlus](https://github.com/router-for-me/CLIProxyAPIPlus)** — 底层代理服务端文档与说明
- **[Issues](https://github.com/itsmylife44/cliproxyapi-dashboard/issues)** — Bug 请求提交与功能新建议反馈区
- **[Discussions](https://github.com/itsmylife44/cliproxyapi-dashboard/discussions)** — 常见问题回答以及相关经验社区探讨

## Star 趋势图

<a href="https://star-history.com/#itsmylife44/cliproxyapi-dashboard&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=itsmylife44/cliproxyapi-dashboard&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=itsmylife44/cliproxyapi-dashboard&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=itsmylife44/cliproxyapi-dashboard&type=Date" />
  </picture>
</a>

## 开源协议

[MIT](LICENSE)

---

<p align="center">
  Built with ❤️ using Next.js, React, and Tailwind CSS
</p>
