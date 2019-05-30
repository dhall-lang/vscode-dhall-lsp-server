'use strict';

// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { ProvideHoverSignature } from 'vscode-languageclient';
import * as child_process from 'child_process';
// import * as os from 'os';
// import * as path from 'path';
import * as util from 'util';
import * as preview from './preview';

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

// copied and adapted from vscode-hie-server!
function trustedHoverHack(
	document: vscode.TextDocument,
	position: vscode.Position,
	token: vscode.CancellationToken,
	next: ProvideHoverSignature
): vscode.ProviderResult<vscode.Hover> {
	const res = next(document, position, token);
	return Promise.resolve(res).then(r => {
		if (r !== null && r !== undefined) {
			r.contents = r.contents.map(trust);
		}
		return r;
	});
}

function trust(ms : vscode.MarkedString) : vscode.MarkedString {
	let s : string = "";
	if (typeof ms === 'string') {
		s = ms; 
	} else if (typeof ms === 'object') {
		s = ms.value;
	}

	const md = new vscode.MarkdownString(s);
	md.isTrusted = true;
	return md;
}

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
		middleware: {
			provideHover: trustedHoverHack
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

	preview.activatePreview('dhall-json', context.subscriptions);
	preview.activatePreview('dhall-text', context.subscriptions);
	preview.activatePreview('dhall-bash', context.subscriptions);
	preview.activatePreview('dhall-yaml', context.subscriptions);

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

