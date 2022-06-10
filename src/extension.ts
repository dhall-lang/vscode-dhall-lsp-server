"use strict";

// The module 'vscode' contains the VS Code extensibility API
import * as child_process from "child_process";
// import * as os from 'os';
// import * as path from 'path';
import * as os from "os";
import * as util from "util";
import * as vscode from "vscode";
import { window, workspace } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

import * as explain from "./explain";

let client: LanguageClient;

// TODO: check https://github.com/scalameta/metals-vscode/blob/master/src/extension.ts
const outputChannel = window.createOutputChannel("Dhall LSP");

// * -= The Entry Point =- *
export async function activate(context: vscode.ExtensionContext) {
  console.log("..Extension \"vscode-dhall-lsp-server\" is now active..");

  const config = workspace.getConfiguration("vscode-dhall-lsp-server");

  const userDefinedExecutablePath = config.get<string>("executable");

  let executablePath = userDefinedExecutablePath ?? "dhall-lsp-server";

  console.log(`Trying to find the server executable in: ${executablePath}`);
  // Substitute path variables with their corresponding locations.
  executablePath = executablePath
    .replace("${HOME}", os.homedir)
    .replace("${home}", os.homedir)
    .replace(/^~/, os.homedir);
  if (executablePath === "") {
    window.showErrorMessage(
      `dhall executable path: ${executablePath} is empty, check your configuration`,
    );
    return;
  }

  const folders = workspace.workspaceFolders;
  if (folders) {
    const folder = folders[0];
    if (folder) {
      executablePath = executablePath
        .replace("${workspaceFolder}", folder.uri.path)
        .replace("${workspaceRoot}", folder.uri.path);
    }
  }

  console.log(`Location after path variables subsitution: ${executablePath}`);

  const executableStatus = await obtainExecutableStatus(executablePath);

  if (executableStatus !== "available") {
    if (executableStatus === "timedout") {
      window.showInformationMessage(
        "The server process has timed out."
          + "Maybe you have a custom setup that's taking too long to start the server.",
      );
    } else {
      if (userDefinedExecutablePath === "") {
        window.showErrorMessage(
          "No `dhall-lsp-server` executable is available in the VSCode PATH.\n"
            + "You might need to install [Dhall LSP server](https://github.com/dhall-lang/dhall-haskell/tree/master/dhall-lsp-server).\n"
            + "Also you might want to set an absolute path to the `dhall-lsp-server` executable "
            + "in the plugin settings.",
        );
        return;
      } else {
        window.showInformationMessage(
          `The user defined executable path couldn't be exec'd: [${executablePath}]. The language server probably still works. So continuing.`,
        );
      }
    }
  }

  // TODO: properly parse extra arguments!! UNIT TEST !!
  const logFile: string = config.logFile;

  const logFileOpt: string[] = logFile.trim() === ""
    ? []
    : [`--log=${logFile}`];

  // let serverCommand = '~/.local/bin/dhall-lsp-server'; // context.asAbsolutePath(path.parse());
  // let serverCommand = context.asAbsolutePath(path.join('/home/vitalii/.local/bin/dhall-lsp-server'));

  const runArgs: string[] = [...logFileOpt];
  const debugArgs: string[] = [...logFileOpt];

  const serverOptions: ServerOptions = {
    run: {
      command: executablePath,
      transport: TransportKind.stdio,
      args: runArgs,
    },
    debug: {
      command: executablePath,
      transport: TransportKind.stdio,
      args: debugArgs,
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "dhall" }],
    synchronize: {
      configurationSection: "vscode-dhall-lsp-server",
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: vscode.workspace.createFileSystemWatcher("**/.clientrc"),
    },
    initializationOptions: {
      "vscode-dhall-lsp-server": workspace.getConfiguration(
        "vscode-dhall-lsp-server",
      ),
    },
    outputChannel,
  };

  client = new LanguageClient(
    "vscode-dhall-lsp-server",
    "VSCode Dhall Language Server",
    serverOptions,
    clientOptions,
  );

  client.start();
  outputChannel.appendLine("..Dhall LSP Server has been started..");

  // activate linting command
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("dhall.lint", (editor, edit) => {
      const cmd = {
        command: "dhall.server.lint",
        arguments: [editor.document.uri.toString()],
      };
      client.sendRequest("workspace/executeCommand", cmd);
    }),
  );

  // activate annotateLet command
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "dhall.annotateLet",
      (editor, edit) => {
        const cmd = {
          command: "dhall.server.annotateLet",
          arguments: [
            {
              position: editor.selection.active,
              textDocument: { uri: editor.document.uri.toString() },
            },
          ],
        }; // editor.document.uri.toString()
        client.sendRequest("workspace/executeCommand", cmd);
      },
    ),
  );

  // activate freezeImport command
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "dhall.freezeImport",
      (editor, edit) => {
        const cmd = {
          command: "dhall.server.freezeImport",
          arguments: [
            {
              position: editor.selection.active,
              textDocument: { uri: editor.document.uri.toString() },
            },
          ],
        }; // editor.document.uri.toString()
        client.sendRequest("workspace/executeCommand", cmd);
      },
    ),
  );

  // activate freezeAllImports command
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "dhall.freezeAllImports",
      (editor, edit) => {
        const cmd = {
          command: "dhall.server.freezeAllImports",
          arguments: [editor.document.uri.toString()],
        };
        client.sendRequest("workspace/executeCommand", cmd);
      },
    ),
  );

  // enable "dhall-explain" URIs
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      "dhall-explain",
      new explain.ExplainProvider(),
    ),
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // don't forget to register
  // let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
  // 	// The code you place here will be executed every time your command is executed

  // 	// Display a message box to the user
  // 	vscode.window.showInformationMessage('Hello World!');
  // });

  // context.subscriptions.push(disposable);
}

// TODO: maybe use promisify-child-process ??

// TODO: should also handle case when executable has returned error code on startup
async function obtainExecutableStatus(
  executableLocation: string,
): Promise<string> {
  const execPromise = util.promisify(child_process.execFile)(
    executableLocation,
    ["version"],
    {
      timeout: 2000,
      windowsHide: true,
    },
  )
    .then(() => "available").catch((error) => {
      return "missing";
    });
  const timeoutPromise: Promise<string> = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve("timedout");
    }, 1000);
  });
  return Promise.race([execPromise, timeoutPromise]);
}

export function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
