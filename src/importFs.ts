import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient";

interface ImportSource {
	text: string;
	entries: string[];
}

// Read-only view of decoded imports. File bytes come from the
// `dhall/importSource` request; the server also mirrors them under
// `$XDG_CACHE_HOME/dhall-lsp/sources`.
export class DhallImportFileSystem implements vscode.FileSystemProvider {
	private readonly emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	readonly onDidChangeFile = this.emitter.event;

	constructor(private readonly client: LanguageClient) {}

	watch(): vscode.Disposable {
		return new vscode.Disposable(() => undefined);
	}

	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		if (uri.path === "/" || uri.path === "") {
			return { type: vscode.FileType.Directory, ctime: 0, mtime: 0, size: 0 };
		}
		const source = await this.fetch(this.nameOf(uri));
		return {
			type: vscode.FileType.File,
			ctime: 0,
			mtime: 0,
			size: Buffer.byteLength(source.text),
		};
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		if (uri.path !== "/" && uri.path !== "") {
			throw vscode.FileSystemError.FileNotADirectory(uri);
		}
		const source = await this.fetch(null);
		return source.entries.map((name) => [name, vscode.FileType.File]);
	}

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const source = await this.fetch(this.nameOf(uri));
		return Buffer.from(source.text);
	}

	createDirectory(uri: vscode.Uri): void {
		throw vscode.FileSystemError.NoPermissions(uri);
	}

	writeFile(uri: vscode.Uri): void {
		throw vscode.FileSystemError.NoPermissions(uri);
	}

	delete(uri: vscode.Uri): void {
		throw vscode.FileSystemError.NoPermissions(uri);
	}

	rename(oldUri: vscode.Uri): void {
		throw vscode.FileSystemError.NoPermissions(oldUri);
	}

	private nameOf(uri: vscode.Uri): string {
		const parts = uri.path.split("/").filter((part) => part.length > 0);
		return parts.length === 0 ? "" : parts[parts.length - 1];
	}

	private fetch(path: string | null): Thenable<ImportSource> {
		return this.client.sendRequest<ImportSource>("dhall/importSource", path);
	}
}

export async function mountDhallImports(): Promise<void> {
	const uri = vscode.Uri.parse("dhall-import:/");
	const folders = vscode.workspace.workspaceFolders ?? [];
	const already = folders.some((folder) => folder.uri.scheme === "dhall-import");
	if (!already) {
		vscode.workspace.updateWorkspaceFolders(folders.length, 0, {
			uri,
			name: "Dhall imports",
		});
	}
	const files = vscode.workspace.getConfiguration("files");
	const current = files.get<Record<string, boolean>>("readonlyInclude") ?? {};
	await files.update(
		"readonlyInclude",
		{ ...current, "**/dhall-lsp/sources/**": true },
		vscode.ConfigurationTarget.Workspace
	);
}
