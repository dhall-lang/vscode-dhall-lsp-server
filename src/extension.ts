'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
//import * as path from 'path';

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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-dhall-lsp-server" is now active!');
	
	// ! FIXME: parametrize stack server executable location

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
								 'You can set an absolute path to the `dhall-lsp-server` executable ' +
								 'in the plugin settings.');
			} else {
				window.showErrorMessage('The server executable path is invalid: [' + executablePath + "]");
			}
		}
		
		return;
	}

	
	



	// let serverCommand = '/Users/edevi86/.local/bin/dhall-lsp-server'; // context.asAbsolutePath(path.parse()); 
	// let serverCommand = context.asAbsolutePath(path.join('/home/vitalii/.local/bin/dhall-lsp-server'));

	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let runArgs : string[] = [];
	let debugArgs : string[] = []; 

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
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

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'dhall' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		},
		outputChannel: outputChannel
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'vscode-dhall-lsp-server',
		'VSCode Dhall Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
	outputChannel.appendLine("Dhall server has started.");
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

// TODO: should also handle case when executable has returned error code on start
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

// this method is called when your extension is deactivated
export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
