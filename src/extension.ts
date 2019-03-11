'use strict';

// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as child_process from 'child_process';
// import * as os from 'os';
// import * as path from 'path';
import * as util from 'util';

import {
	window,
	workspace
} from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

// TODO: check https://github.com/scalameta/metals-vscode/blob/master/src/extension.ts
const outputChannel = window.createOutputChannel("Dhall LSP");

// * -= The Entry Point =- *
export async function activate(context: vscode.ExtensionContext) {

	console.log('..Extension "vscode-dhall-lsp-server" is now active..');
	
	const config = workspace.getConfiguration("vscode-dhall-lsp-server");

	const userDefinedExecutablePath = config.executable;

	let executablePath =  (userDefinedExecutablePath === '') ? 'dhall-lsp-server' : userDefinedExecutablePath; 

	const executableStatus = await obtainExecutableStatus(executablePath);

	if (executableStatus !== 'available') {
		if (executableStatus === 'timedout') {
			window.showErrorMessage('The server process has timed out.');
		} else {
			if (userDefinedExecutablePath === '') {
			  window.showErrorMessage('No `dhall-lsp-server` executable is available in the VSCode PATH.\n' +
			                     'You might need to install [Dhall LSP server](https://github.com/PanAeon/dhall-lsp-server).\n' +
								 'Also you might want to set an absolute path to the `dhall-lsp-server` executable ' +
								 'in the plugin settings.');
			} else {
				window.showErrorMessage('The server executable path is invalid: [' + executablePath + "]");
			}
		}
		
		return;
	}

	// TODO: properly parse extra arguments!! UNIT TEST !!
	const logFile: string = config.logFile;

	const logFileOpt : string[] = logFile.trim() === '' ? [] : ['--log=' + logFile]; 



	// let serverCommand = '~/.local/bin/dhall-lsp-server'; // context.asAbsolutePath(path.parse()); 
	// let serverCommand = context.asAbsolutePath(path.join('/home/vitalii/.local/bin/dhall-lsp-server'));

	let runArgs : string[] = [...logFileOpt];
	let debugArgs : string[] = [...logFileOpt]; 

	let serverOptions: ServerOptions = {
		run: { command: executablePath, 
			   transport: TransportKind.stdio,
			   args: runArgs
			 },
		debug: {
			command: executablePath,
			transport: TransportKind.stdio,
			args: debugArgs
		}
	};

	let clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'dhall' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		},
		outputChannel: outputChannel
	};

	client = new LanguageClient(
		'vscode-dhall-lsp-server',
		'VSCode Dhall Language Server',
		serverOptions,
		clientOptions
	);

	client.start();
	outputChannel.appendLine("..Dhall LSP Server has been started..");

	activatePreview(context.subscriptions);
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

// TODO: should also handle case when executable has returned error code on startup
async function obtainExecutableStatus(executableLocation: string) : Promise<string> {
  const execPromise =  util.promisify(child_process.execFile)
							 (executableLocation, ['version'], { timeout: 2000, windowsHide: true })
							 .then(() => 'available').catch((error) => { 
								  return 'missing'; 
								});
  const timeoutPromise : Promise<string> = new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      resolve('timedout'); 
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

const myProvider = new class implements vscode.TextDocumentContentProvider {

	// emitter and its event
	onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	onDidChange = this.onDidChangeEmitter.event;

	

	async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
		const dhallToJsonPath = "/home/vitalii/.local/bin/dhall-to-json";

		console.log(">>>foo<<<");

		const sourceURI = uri.with({ scheme: 'file',
	                                 path: uri.path.replace(/\.json$/gi, "") });

		return await vscode.workspace.openTextDocument(sourceURI).then((document) => {
			let text = document.getText();

			let child = child_process.execFile(dhallToJsonPath, ["--explain", "--pretty"], { 
							 timeout: 5000, 
							 windowsHide: true,
						});
			child.stdin.write(text);
			child.stdin.end();

			let buffer = "";

			child.stdout.on('data', (data) => {
				buffer += data;
			  });
			child.stderr.on('data', (data) => {
				buffer += data; // FIXME: supper sloppppy
			});

			return new Promise((resolve, reject) => {
				child.on('exit', function (code, signal) {
					console.log('child process exited with ' +
								`code ${code} and signal ${signal}`);
					resolve(buffer);
				  });
			});
		
		});
		
	}
};
// TODO: side by side
async function activatePreview(subscriptions: any) {
	const myScheme = 'dhall-json';
	
	

	subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider));

	// register a command that opens a cowsay-document
	subscriptions.push(vscode.commands.registerCommand('dhall.json.preview', async () => {
		//let what = await vscode.window.showInputBox({ placeHolder: 'cowsay...' });
		// if (what) {
			var sourceURI: vscode.Uri;

	if (vscode.window.activeTextEditor) {
		// TODO: check this is dhall file?
		sourceURI = vscode.window.activeTextEditor.document.uri;
    } else {
		return;
	}

			let uri = sourceURI.with({ scheme: 'dhall-json',
									   path: sourceURI.path + ".json" // FIXME: sloppy
									 });
			// let uri = vscode.Uri.parse('dhall-json:' + sourceURI.path); // 
			// FIXME: normal refresh
			myProvider.onDidChangeEmitter.fire(uri);

			let doc = await vscode.workspace.openTextDocument(uri); // FIxME: strip name dhall

			
			

			const resourceColumn = (vscode.window.activeTextEditor && vscode.window.activeTextEditor.viewColumn) || vscode.ViewColumn.One;
			const sideBySide = true;
			await vscode.window.showTextDocument(doc, { 
				preview: true,
				viewColumn: sideBySide ? resourceColumn + 1 : resourceColumn,
				preserveFocus: true
			}); // FIXME: on the side!
		// }
	}));

	// register a command that updates the current cowsay
	// subscriptions.push(vscode.commands.registerCommand('cowsay.backwards', async () => {
	// 	if (!vscode.window.activeTextEditor) {
	// 		return; // no editor
	// 	}
	// 	let { document } = vscode.window.activeTextEditor;
	// 	if (document.uri.scheme !== myScheme) {
	// 		return; // not my scheme
	// 	}
	// 	// get path-components, reverse it, and create a new uri
	// 	let say = document.uri.path;
	// 	let newSay = say.split('').reverse().join('');
	// 	let newUri = document.uri.with({ path: newSay });
	// 	await vscode.window.showTextDocument(newUri, { preview: false });
	// }));
}