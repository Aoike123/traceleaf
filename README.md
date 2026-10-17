# Traceleaf

Traceleaf 是一个桌面优先、可恢复、可追溯的递归任务运行时。每个 Task 聚焦一个明确问题，装配独立的 Skill 与 Tools，通过结果、证据和产物引用与父任务交接。

同一根任务树只有一个活跃执行节点。父任务委派后挂起，子任务交付后父任务恢复。长期目标是将经过验证的探索过程提取为可复用 Workflow。

## 当前状态

当前处于设计阶段，尚未开始运行时代码开发。下列文档描述目标方案，不表示能力已经实现。Storyloom 当前独立，World Engine / RAG 与业务集成均属于后续范围。

## 文档导航

| 文档 | 回答的问题 |
| --- | --- |
| [项目计划书](docs/project-plan.md) | 做什么、分几步做、每一步如何验收？ |
| [体系架构](docs/architecture.md) | 模块如何协作，任务、上下文和恢复有哪些约束？ |
| [技术选型](docs/tech-stack.md) | 使用哪些技术，哪些决定已经确定，哪些留待实施？ |
| [地基实施清单](docs/foundation-plan.md) | 当前阶段具体要交付和验证什么？ |
| [CLI 模块计划](docs/cli-plan.md) | 命令入口分哪些模块，如何分阶段交付与验收？ |

建议按上表顺序阅读。范围和阶段以计划书为准，运行语义以架构为准，技术依赖以技术选型为准，实施清单不另外定义阶段顺序。

## 协作规范

提交统一采用 `type(scope): 中文动作与结果`，类型、模块名和正文示例见 [Git 提交规范](docs/commit-convention.md)。

## 当前方向

- Electron + React 桌面应用，核心运行时使用 TypeScript / Node.js。
- SQLite 保存运行状态，本地文件保存产物。
- CLI 先验证核心，再接桌面界面；网页控制台属于可选入口。
- Workflow 编排继续使用 TypeScript，重计算交给 Blender、FFmpeg、ComfyUI 等工具。
- 当前仅整理设计文档；下一步先收口并独立验证 ModelGateway，再进入能力装配与单 Task Loop。
