import {TextDocumentContentProvider, Uri} from 'vscode';

export class ExplainProvider implements TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri) : string {
        return decodeURIComponent(uri.query);
    }
}