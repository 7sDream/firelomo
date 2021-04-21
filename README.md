# Firelomo

<p align="center">
  <img src="https://raw.githubusercontent.com/7sDream/firelomo/master/icons/firelomo-128.png" alt="firelomo log"/>
</p>

一个火狐扩展，用于简便快速的将火狐中的内容发送到 [flomo]。

## 安装

从[火狐官方扩展商店（暂未上架）][AMO-page]安装。

或在 [Release 页面][release-page]下载。

## 功能

- 添加 `发送到 flomo` 右键菜单：
  - 选中文字：快速发送选中文字
  - 右键链接：发送链接文本和 URL
  - 空白处右键：发送标签页标题和 URL
  - 菜单可用 `F` 键快速选中
- 单击工具栏图标：
  - 打开一个空白的发送框，方便随时写点东西
  - 默认快捷键 `Ctrl(Command)+Shift+M`
- 设置选项
  - API URL：登录 flomo 网页版后在 `选项 - API 及第三方工具` 页面获取
  - 超时时间：发送请求的超时时间，单位毫秒
  - 内容模板：参见 [Wiki（还没写）][wiki]

## 开发

```bash
$ npm install -D
# 本地编译调试
$ npm run build
```

<details>
<summary>注意事项</summary>

- Import `ts` 文件时需要把后缀改成 `js`，因为编译后只剩 ts，同理 HTML 里引用脚本也要使用 `js` 后缀。- 使用绝对路径引用源码文件时，需要改用 `/dist/` 目录而不是 `src` 目录
- 新增 Background script 需要通过在 `background.html` 增加 `script` 标签完成。[原因](https://discourse.mozilla.org/t/using-es6-modules-in-background-scripts/29911)
- Content Script 必须放在 `src/content` 或其子文件夹内，这里面的 `ts` 文件在编译后会再使用 `browserify` 编译，之后才能正常注入到页面中。

</details>

## License

[BSC-3-Clause][license]

[flomo]: https://flomoapp.com/
[AMO-page]: https://addons.mozilla.org/zh-CN/firefox/addon/firelomo
[release-page]: https://github.com/7sDream/firelomo/releases/latest
[wiki]: https://github.com/7sDream/torrent_parser/wiki/template
[license]: https://github.com/7sDream/rikka/blob/master/LICENSE.md