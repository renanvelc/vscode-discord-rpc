const vscode = require("vscode");
const RPC = require("discord-rpc");

const CLIENT_ID = "1539755392798560407";

let rpc = null;
let startTimestamp = null;
let lastData = null;

// ==========================================
// LANGUAGE INFORMATION
// ==========================================

function getLanguageInfo(language) {

    const languages = {

        javascript: {
            name: "JavaScript",
            icon: "🟨"
        },

        typescript: {
            name: "TypeScript",
            icon: "🔷"
        },

        python: {
            name: "Python",
            icon: "🐍"
        },

        java: {
            name: "Java",
            icon: "☕"
        },

        csharp: {
            name: "C#",
            icon: "🟪"
        },

        cpp: {
            name: "C++",
            icon: "⚙️"
        },

        c: {
            name: "C",
            icon: "⚙️"
        },

        html: {
            name: "HTML",
            icon: "🌐"
        },

        css: {
            name: "CSS",
            icon: "🎨"
        },

        scss: {
            name: "SCSS",
            icon: "🎨"
        },

        json: {
            name: "JSON",
            icon: "📋"
        },

        markdown: {
            name: "Markdown",
            icon: "📝"
        },

        sql: {
            name: "SQL",
            icon: "🗄️"
        },

        php: {
            name: "PHP",
            icon: "🐘"
        },

        rust: {
            name: "Rust",
            icon: "🦀"
        },

        go: {
            name: "Go",
            icon: "🐹"
        },

        kotlin: {
            name: "Kotlin",
            icon: "🟣"
        },

        swift: {
            name: "Swift",
            icon: "🍎"
        },

        dart: {
            name: "Dart",
            icon: "🔵"
        },

        lua: {
            name: "Lua",
            icon: "🌙"
        },

        shellscript: {
            name: "Shell",
            icon: "💻"
        },

        powershell: {
            name: "PowerShell",
            icon: "🔵"
        },

        plaintext: {
            name: "Text",
            icon: "📄"
        }
    };

    return languages[language] || {
        name: language || "Code",
        icon: "💻"
    };
}

// ==========================================
// WORKSPACE
// ==========================================

function getWorkspaceName() {

    const workspace =
        vscode.workspace.workspaceFolders;

    if (!workspace || workspace.length === 0) {
        return "Sem projeto";
    }

    return workspace[0].name;
}

// ==========================================
// GIT BRANCH
// ==========================================

function getGitBranch() {

    const gitExtension =
        vscode.extensions.getExtension("vscode.git");

    if (!gitExtension) {
        return null;
    }

    try {

        const git =
            gitExtension.exports;

        const api =
            git.getAPI(1);

        if (!api.repositories.length) {
            return null;
        }

        const repository =
            api.repositories[0];

        return repository.state.HEAD
            ? repository.state.HEAD.name
            : null;

    } catch {

        return null;
    }
}

// ==========================================
// CURRENT VS CODE DATA
// ==========================================

function getCurrentData() {

    const editor =
        vscode.window.activeTextEditor;

    if (!editor) {
        return null;
    }

    const document =
        editor.document;

    const fileName =
        vscode.workspace.asRelativePath(
            document.uri,
            false
        );

    const language =
        document.languageId || null;

    const project =
        getWorkspaceName();

    const branch =
        getGitBranch();

    return {
        project,
        file: fileName,
        language,
        branch
    };
}

// ==========================================
// UPDATE PRESENCE
// ==========================================

function updatePresence() {

    if (!rpc) {
        return;
    }

    const data =
        getCurrentData();

    if (!data) {
        return;
    }

    const languageInfo =
        getLanguageInfo(data.language);

    // --------------------------------------
    // START TIMER
    // --------------------------------------

    if (!startTimestamp) {

        startTimestamp =
            Date.now();

    }

    // --------------------------------------
    // MAIN TEXT
    // --------------------------------------

    const details =
        `⌨️ Coding ${data.project}`;

    // --------------------------------------
    // SECOND LINE
    // --------------------------------------

    let state = "";

    if (data.file) {

        state +=
            `📄 ${data.file}`;

    }

    if (data.branch) {

        if (state) {
            state += " • ";
        }

        state +=
            `🌿 ${data.branch}`;

    }

    if (data.language) {

        if (state) {
            state += " • ";
        }

        state +=
            `${languageInfo.icon} ${languageInfo.name}`;

    }

    if (!state) {

        state =
            "💻 Working in Visual Studio Code";

    }

    // --------------------------------------
    // SEND TO DISCORD
    // --------------------------------------

    rpc.setActivity({

        details,

        state,

        startTimestamp,

        largeImageKey: "vscode",

        largeImageText:
            "Visual Studio Code",

        smallImageKey: "coding",

        smallImageText:
            data.language
                ? `Coding in ${languageInfo.name}`
                : "Coding",

        instance: false

    }).then(() => {

        console.log(
            "[Discord RPC] Presence atualizada!",
            data
        );

    }).catch(error => {

        console.error(
            "[Discord RPC] Erro ao atualizar Presence:",
            error
        );

    });

    lastData = data;
}

// ==========================================
// CONNECT TO DISCORD
// ==========================================

async function connectDiscord() {

    try {

        rpc =
            new RPC.Client({
                transport: "ipc"
            });

        rpc.on("ready", () => {

            console.log(
                "[Discord RPC] Discord conectado!"
            );

            updatePresence();

        });

        await rpc.login({
            clientId: CLIENT_ID
        });

    } catch (error) {

        console.error(
            "[Discord RPC] Erro ao conectar:",
            error
        );

        vscode.window.showErrorMessage(
            "Não foi possível conectar ao Discord."
        );

    }
}

// ==========================================
// ACTIVATE
// ==========================================

async function activate(context) {

    console.log(
        "[Discord RPC] Extensão ativada!"
    );

    // --------------------------------------
    // CONNECT
    // --------------------------------------

    await connectDiscord();

    // --------------------------------------
    // FILE CHANGE
    // --------------------------------------

    context.subscriptions.push(

        vscode.window.onDidChangeActiveTextEditor(
            () => {

                updatePresence();

            }
        )

    );

    // --------------------------------------
    // WORKSPACE CHANGE
    // --------------------------------------

    context.subscriptions.push(

        vscode.workspace.onDidChangeWorkspaceFolders(
            () => {

                updatePresence();

            }
        )

    );

    // --------------------------------------
    // SAVE
    // --------------------------------------

    context.subscriptions.push(

        vscode.workspace.onDidSaveTextDocument(
            () => {

                updatePresence();

            }
        )

    );

    // --------------------------------------
    // INITIAL UPDATE
    // --------------------------------------

    updatePresence();
}

// ==========================================
// DEACTIVATE
// ==========================================

async function deactivate() {

    console.log(
        "[Discord RPC] Extensão sendo encerrada..."
    );

    if (rpc) {

        try {

            await rpc.clearActivity();

        } catch {

            // Ignora erro

        }

        try {

            rpc.destroy();

        } catch {

            // Ignora erro

        }

        rpc = null;

    }

    startTimestamp = null;
}

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    activate,
    deactivate
};