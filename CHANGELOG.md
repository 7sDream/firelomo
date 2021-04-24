# ChangeLog

## Unreleased

## v1.1.0

## 新增

- 发送面板输入框中 `ESC` 键关闭
- 发送面板输入框中增加确认快捷键
  - macOs：`Cmd/Ctrl + Enter`
  - Other：`Ctrl + Enter`

## 修改

- 使用 `appendChild` 而不是 `body.innerHTML` 来添加发送面板，貌似省掉一些 DOM 重排之类的消耗性能会好（虽然小东西也不在乎啥性能）
- CSS 加了点东西，防止页面的样式干扰。据说应该用 `iframe`，但是我懒得改。

## 优化

- 发送面板弹出后输入框自动获取焦点

## v1.0.1

- 初版，提供基础功能。
