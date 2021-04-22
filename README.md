# Firelomo

<p align="center">
  <img src="https://raw.githubusercontent.com/7sDream/firelomo/master/icons/firelomo-128.png" alt="firelomo log"/>
</p>

一个火狐扩展，用于简便快速的将火狐中的内容发送到 [flomo]。

## 安装

从[火狐官方扩展商店][AMO-page]安装。

或在 [Release 页面][release-page]下载。

注意：Release 页面的版本（`firelomo.selfhost.firefox@7sdre.am`）和官方商店的版本（`firelomo.firefox@7sdre.am`）有不同的 ID。所以直接安装两个渠道的版本不会覆盖更新，请自行先卸载原有扩展。

## 功能

![screen shot of firelomo menu and send panel][screenshot]

- 添加 `发送到 flomo` 右键菜单：
  - 选中文字：快速发送选中文字
  - 右键链接：发送链接文本和 URL
  - 空白处右键：发送标签页标题和 URL
  - 菜单可用 `F` 键快速选中
- 单击工具栏图标：
  - 打开一个空白的发送框，方便随时写点东西
  - 默认快捷键 `Ctrl(Command)+Shift+M`

## 选项

![options]

- API URL：登录 flomo 网页版后在 `选项 - API 及第三方工具` 页面获取
- 超时时间：发送请求的超时时间，单位毫秒
- 内容模板：参见 [Wiki][wiki]

## 欢迎共建

### 开发

```bash
$ npm install -D
# 编译
$ npm run build
```

使用`火狐扩展页面-齿轮-调试附加组件-临时载入附加组件`，打开 `manifest.json` 文件来测试。

也可以使用 `npx web-ext run`。

<details>
<summary>开发注意事项</summary>

- Import `ts` 文件时需要把后缀改成 `js`，因为编译后只剩 `js`，同理 HTML 里引用脚本也要使用 `js` 后缀。
- 使用绝对路径引用源码文件时，需要改用 `/dist/` 目录而不是 `src` 目录
- 新增 Background script 需要通过在 `background.html` 增加 `script` 标签完成。[原因](https://discourse.mozilla.org/t/using-es6-modules-in-background-scripts/29911)。
- Content Script 必须放在 `src/content` 或其子文件夹内，这里面的 `ts` 文件在编译后会再使用 `browserify` 编译，之后才能正常注入到页面中。

</details>

### 设计相关

#### Logo

不会画画，现在这个 Logo 我是基本瞎画的，这拙劣的画工，蚌埠住了。

如果有设计师/画师/会画画的人能帮忙画个 Logo，或者贡献创意，请直接开 Issue 吧。

#### UI/UX

同上，不会设计 UI，当然现在也没啥 UI，不过如果你愿意设计/讨论一下也很欢迎，请直接开 Issue 吧。

#### UI 实现

再次同上，不是前端，不会 HTML 和 CSS，临时学的。

如果你有能力且愿意做点优化，直接提 PR 就好。

## License

[BSC-3-Clause][license]

[flomo]: https://flomoapp.com/
[AMO-page]: https://addons.mozilla.org/zh-CN/firefox/addon/firelomo
[release-page]: https://github.com/7sDream/firelomo/releases/latest
[screenshot]: https://rikka.7sdre.am/files/623a6b08-2afa-40ca-9897-7720a8aaaf83.png
[options]: https://rikka.7sdre.am/files/35286ca5-e8fd-4516-b74e-1a7ab156ef00.png
[wiki]: https://github.com/7sDream/firelomo/wiki/template
[license]: https://github.com/7sDream/firelomo/blob/master/LICENSE
