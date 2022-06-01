import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'helloword.helloWorld',
    () => {
      const doc = vscode.window.activeTextEditor?.document
      vscode.window.showErrorMessage(`Hello ${doc}`, {
        detail: 'detail from modal',
      })
    },
  )
  context.subscriptions.push(disposable)
  vscode.languages.registerHoverProvider(
    'javascript',
    new (class implements vscode.HoverProvider {
      provideHover(
        _document: vscode.TextDocument,
        _position: vscode.Position,
        _token: vscode.CancellationToken,
      ): vscode.ProviderResult<vscode.Hover> {
        // const commentCommandUri = vscode.Uri.parse(
        //   'command:editor.action.addCommentLine',
        // )

        // command URIs如果想在Markdown 内容中生效, 你必须设置`isTrusted`。
        // 当创建可信的Markdown 字符, 请合理地清理所有的输入内容
        // 以便你期望的命令command URIs生效

        const args = [{ resourceUri: _document.uri }]
        const test = vscode.Uri.parse(
          `command:git.stage?${encodeURIComponent(JSON.stringify(args))}`,
        )
        const contents = new vscode.MarkdownString(
          `[${encodeURIComponent(JSON.stringify(args))}](https://www.baidu.com)`
        );
        console.log(JSON.stringify(args))
        console.log(test)
        contents.isTrusted = true

        return new vscode.Hover('test')
      }
    })(),
  )
}

export function deactivate() {}
