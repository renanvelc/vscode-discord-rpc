const vscode = require("vscode");
const http = require("http");

const RPC_PORT = 38471;
const RPC_HOST = "127.0.0.1";

let lastData = null;

function sendToRPC(data) {
    const postData = JSON.stringify(data);

    const options = {
        hostname: RPC_HOST,
        port: RPC_PORT,
        path: "/presence",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        res.on("data", () => {});
    });

    req.on("error", () => {
        // O RPC pode ainda não estar iniciado.
        // A extensão continuará funcionando e tentará novamente
        // quando o arquivo/projeto mudar.
    });

    req.write(postData);
    req.end();
}

function getWorkspaceName() {
    const workspace = vscode.workspace.workspaceFolders;

    if (!workspace || workspace.length === 0) {
        return "Sem projeto";
    }

    return workspace[0].name;
}

function getGitBranch() {
    const gitExtension =
        vscode.extensions.getExtension("vscode.git");

    if (!gitExtension) {
        return null;
    }

    try {
        const git = gitExtension.exports;
        const api = git.getAPI(1);

        if (!api.repositories.length) {
            return null;
        }

        const repository = api.repositories[0];

        return repository.state.HEAD
            ? repository.state.HEAD.name
            : null;

    } catch {
        return null;
    }
}

function sendCurrentFile() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const document = editor.document;

    const fileName = vscode.workspace.asRelativePath(
        document.uri,
        false
    );

    const language =
        document.languageId || null;

    const project =
        getWorkspaceName();

    const branch =
        getGitBranch();

    const data = {
        project: project,
        file: fileName,
        language: language,
        branch: branch
    };

    const changed =
        JSON.stringify(data) !==
        JSON.stringify(lastData);

    if (changed) {
        lastData = data;

        console.log(
            "[Discord RPC]",
            data
        );

        sendToRPC(data);
    }
}

function activate(context) {

    console.log(
        "VS Code Discord RPC Bridge ativada!"
    );

    // Arquivo mudou
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(
            () => {
                sendCurrentFile();
            }
        )
    );

    // Workspace mudou
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(
            () => {
                sendCurrentFile();
            }
        )
    );

    // Salvar arquivo
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(
            () => {
                sendCurrentFile();
            }
        )
    );

    // Quando a extensão iniciar
    sendCurrentFile();
}

function deactivate() {

    const postData = "";

    const options = {
        hostname: RPC_HOST,
        port: RPC_PORT,
        path: "/clear",
        method: "POST",
        headers: {
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    const req = http.request(
        options,
        () => {}
    );

    req.on("error", () => {});

    req.end(postData);
}

module.exports = {
    activate,
    deactivate
};