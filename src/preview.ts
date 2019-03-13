import * as vscode from 'vscode';

import * as child_process from 'child_process';
import * as quote from 'shell-quote';

const dots = ":.:.:.:.:.::.:.:.:.:.::.:.:.:.:.::.:.:.:.:.::.:.:.:.:.::.:.:.:.:.::.:.:.:.:.:.:\n";

class PreviewProvider implements vscode.TextDocumentContentProvider {
    

    constructor(previewConfig: PreviewConfig) {
        this.previewConfig = previewConfig;
    }

    previewConfig: PreviewConfig;

    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;



    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        

        const config = vscode.workspace.getConfiguration("vscode-dhall-lsp-server");
        const previewConfig = this.previewConfig;


        const extraArguments : string = config.preview[previewConfig.configSelector].extraArguments;
        const executablePath : string = config.preview[previewConfig.configSelector].executable === '' ? this.previewConfig.executable : config.preview[previewConfig.configSelector].executable;

        let args : string[] = [];

        // TODO: this would ignore globes, also it might not work correctly on windows. Also it might be better to merge command and params?
        quote.parse(extraArguments).forEach((entry) => {
            if (typeof entry === "string") {
               args.push(entry);
            }
        });

        console.log("args: >>> " + args);
        

        const extensionRegexp = new RegExp("\." + previewConfig.extension + "$");

        

        const sourceURI = uri.with({
            scheme: 'file',
            path: uri.path.replace(extensionRegexp, "")
        });

       

        return await vscode.workspace.openTextDocument(sourceURI).then((document) => {
            let text = document.getText();

            let child = child_process.execFile(executablePath, args, {
                timeout: 60000,
                windowsHide: true,
            });
            
            // while(!child.connected) {
            //     await sleep(1);
            // }
            // if (child.connected) {
            // will raise an exception when proces not found
                child.stdin.write(text);
                child.stdin.end();
            // }

            let buffer = "";
            let errorBuffer = "";

            child.stdout.on('data', (data) => {
                buffer += data;
            });
            child.stderr.on('data', (data) => {
                errorBuffer += data;
            });



            child.on('close', function (code, signal) {
                if (code === -2) { // TODO: slopppy, how to check that it's run successfully? how to prevent sigpipe error?
                    console.log(`can't find executable. ${code} ${signal}`);
                    vscode.window.showWarningMessage(`Can't find \`${previewConfig.executable}\` executable. \n You might want to specify it's location in the user settings.`);
                }

            });


            return new Promise((resolve, reject) => {
                child.on('exit', function (code, signal) {
                    if (code === 0) {
                        resolve(buffer);
                    } else {
                        console.log('child process exited with ' + `code ${code} and signal ${signal}`);
                        // vscode.languages.setTextDocumentLanguage(destDocument, "markdown");
                        resolve(dots + errorBuffer.replace(/\[1;31m/gi, "").replace(/\[0m/gi, ""));
                    }
                    

                });
            });

        });

    }
}


interface PreviewConfig {
    command: string;
    extension: string;
    executable: string;
    configSelector: string;
    // lastName: string;
}

const previewConfigurations : { [id:string]: PreviewConfig}= {
  "dhall-json": {
    "command": "dhall.json.preview",
    "extension": "json",
    "executable": "dhall-to-json",
    "configSelector": "dhallToJson"
  },
  "dhall-text": {
    "command": "dhall.text.preview",
    "extension": "txt",
    "executable": "dhall-to-text",
    "configSelector": "dhallToText"
  },
  "dhall-bash": {
    "command": "dhall.bash.preview",
    "extension": "bash",
    "executable": "dhall-to-bash",
    "configSelector": "dhallToBash"
  },
  "dhall-yaml": {
    "command": "dhall.yaml.preview",
    "extension": "yaml",
    "executable": "dhall-to-yaml",
    "configSelector": "dhallToYaml"
  }
};

// TODO: autorefresh
export async function activatePreview(previewScheme: string, subscriptions: any) {
    const {command, extension} = previewConfigurations[previewScheme];

    const provider = new PreviewProvider(previewConfigurations[previewScheme]);
    subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(previewScheme, provider));

    subscriptions.push(vscode.commands.registerCommand(command, async () => {

        var sourceURI: vscode.Uri;

        const config = vscode.workspace.getConfiguration("vscode-dhall-lsp-server");

        const openOnTheSide : boolean = config.preview.openOnTheSide;
 

        if (vscode.window.activeTextEditor) {
            let { document } = vscode.window.activeTextEditor;

            sourceURI = document.uri;
        } else {
            return;
        }

        let uri = sourceURI.with({
            scheme: previewScheme,
            path: sourceURI.path + "." + extension // TODO: sloppy?
        });

        // FIXME: normal refresh
        provider.onDidChangeEmitter.fire(uri);

        let doc = await vscode.workspace.openTextDocument(uri);

        const resourceColumn = (vscode.window.activeTextEditor && vscode.window.activeTextEditor.viewColumn) || vscode.ViewColumn.One;

        await vscode.window.showTextDocument(doc, {
            preview: true,
            viewColumn: openOnTheSide ? resourceColumn + 1 : resourceColumn,
            preserveFocus: true
        });
    }));

    // let uri = vscode.Uri.parse('dhall-json:' + sourceURI.path);

    // * not checking that this is dhall file
    // * but if anything: document.languageId === 'dhall'
    // if (document.languageId !== jsonScheme) {
    //    console.log(document.languageId);
    //    return; // not my scheme


}