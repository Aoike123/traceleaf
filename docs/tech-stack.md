# Traceleaf 技术选型

- 更新日期：2026-10-16
- 状态：目标选型，尚未安装依赖或实现
- 实施顺序见 [项目计划书](project-plan.md)，运行语义见 [体系架构](architecture.md)

## 1. 产品形态

首要目标是本地桌面应用。运行时先通过 CLI 验证，再由 Electron 承载 React 界面和独立 Node.js 运行进程。核心不依赖 Electron 的窗口或浏览器对象。

关闭窗口可由托盘保留应用进程；彻底退出后不承诺继续执行，重新启动后从检查点恢复。系统后台服务属于单独的后续需求。

网页不是首版运行前提。未来可用 HTTP/SSE 接入同一核心，但浏览器不能自行获得桌面文件、进程和本地 MCP 的全部访问能力。

## 2. 选定技术

| 部分 | 选型 | 用途 |
| --- | --- | --- |
| 主语言 | TypeScript strict | 领域契约、运行时、适配器、前端与 Workflow 执行器 |
| 开发与 CLI 运行时 | Node.js 24 LTS、pnpm workspace | 开发工具、CLI 和模块组织 |
| 桌面容器 | Electron | 窗口、托盘、应用生命周期与本地能力 |
| 界面 | React、Vite、TanStack Query | 任务状态、控制操作与产物展示 |
| 桌面通信 | preload + contextBridge + 受控 IPC | 向界面暴露有限的任务 API 与事件订阅 |
| 契约校验 | Zod、JSON Schema | 内部输入输出与工具参数；外部 Schema 不强行转成同一种内部表示 |
| 数据库 | SQLite、Drizzle、SQL migration | 任务树、状态、操作、事件、检查点、用量与产物索引 |
| 产物 | 本地 ArtifactStore | 图片、工程、长文档、长工具结果及不可变版本 |
| 模型接入 | AI SDK Core，必要时原生提供商适配 | ModelGateway 内的单步调用，不接管任务循环 |
| 工具接入 | 官方 MCP TypeScript SDK、fetch、本地函数 | MCP / HTTP / 本地执行适配器 |
| Skill | Markdown + 元数据 | 指令、版本、依赖与关联资源 |
| 观测 | Pino、OpenTelemetry | 日志、关联 ID、调用耗时与用量 |
| 验证 | Vitest、可控假模型/工具、真实临时 SQLite | 状态转换、隔离、故障恢复与回归 |
| Workflow | 版本化 Workflow IR + 自有 TS 执行器 | 串行执行显式步骤，保留必要的 Agent 与验证节点 |

以上版本是设计基线。Electron 内置的 Node.js 版本由 Electron 决定，不等同于开发机 Node.js 版本；打包时需检查运行时 API 与依赖兼容性。

## 3. SQLite 的使用边界

- 数据库放在应用用户数据目录；测试使用独立临时文件。
- 初版由核心运行进程集中管理数据库访问，界面不直接执行 SQL。
- 事务保持简短，不在事务中等待模型、网络、渲染或子任务。
- 根执行权、任务修订、状态与关键事件采用事务或条件更新落实。
- 单根串行不能代替重复派送、恢复及过期提交保护。
- SQLite 支持单写入者；不把本地数据库文件放在网络共享目录上作为多人数据库。
- 迁移需有版本记录；升级前保留一致性备份。驱动、journal 模式、busy 策略及备份方式在实施时验证。

具体 SQLite 驱动暂未定。应先验证 Electron 打包、目标系统、Drizzle 兼容性、原生模块 ABI，以及同步驱动是否阻塞运行进程，再确定依赖。采用 Drizzle 不意味着未来切换 PostgreSQL 无需改动 SQL、迁移与事务实现。

## 4. 模型与重计算边界

Traceleaf 的编排与状态管理保持 TypeScript。Blender 渲染、FFmpeg 编码、ComfyUI 生成和模型推理由对应工具或服务执行。

Jev 可通过 HTTP 接入。若采用本地 Laya，则以独立 Python 服务接入；它不是 TS 核心的内部模块，也不是首个里程碑的必选依赖。评审阈值与质量需要领域样本验证。

先度量模型等待、工具耗时、上下文体积、数据库访问和编排开销。Workflow 的首要性能目标是减少探索中的重复决策与无效操作；出现可测量的编排计算瓶颈后，再考虑 Worker Threads 或 Rust 模块。

## 5. 第一版部署结构

```text
Electron
├── React 渲染进程
├── 主进程：窗口、生命周期、受控桥接
└── 独立核心运行进程
    ├── Traceleaf Core
    ├── SQLite
    ├── 本地 ArtifactStore
    └── 模型 API / 本地工具 / HTTP / MCP

CLI → 同一套 Traceleaf Core（桌面完成前验证使用）
```

SQLite 文件的进程所有权由启动机制管理；同一工作目录不允许 CLI 和桌面各自启动一个未协调的写入运行时。

CLI 与核心的边界、配置、输出及阶段交付见 [CLI 模块计划](cli-plan.md)。CLI 解析库和本地控制通道实现尚未选定；短生命周期控制命令通过受控通道调用持有者，不能自行启动第二个写入运行时。

## 6. 后续候选

| 技术 | 引入条件 |
| --- | --- |
| Fastify + HTTP/SSE | 明确需要网页或远程控制入口 |
| PostgreSQL | 明确需要服务端集中部署、多用户共享及相应访问模式 |
| S3 兼容存储 | 产物需要远端保存、共享或规模化管理 |
| 队列服务 | 后台派送确有需求，且执行权、幂等与恢复语义已稳定 |
| Docker Compose | 开发确实需要多个外部服务；不作为桌面用户安装前提 |
| Rust | 原生集成或重计算存在测量证据，收益足以承担额外维护 |

暂不引入 Redis、BullMQ、Temporal 或完整 Agent 框架来接管 Traceleaf 的核心执行语义。
