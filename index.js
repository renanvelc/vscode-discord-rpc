const http = require("http");
const RPC = require("discord-rpc");

const CLIENT_ID = "1539755392798560407";
const PORT = 38471;

const rpc = new RPC.Client({
    transport: "ipc"
});

let vscodeData = null;
let lastProject = null;

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
// RICH PRESENCE
// ==========================================

function updatePresence() {

    if (!vscodeData) {
        return;
    }

    const project =
        vscodeData.project || "Unknown Project";

    const file =
        vscodeData.file || null;

    const language =
        vscodeData.language || null;

    const branch =
        vscodeData.branch || null;

    const languageInfo =
        getLanguageInfo(language);

    // --------------------------------------
    // MAIN TEXT
    // --------------------------------------

    const details =
        `⌨️ Coding ${project}`;

    // --------------------------------------
    // SECOND LINE
    // --------------------------------------

    let state = "";

    if (file) {
        state += `📄 ${file}`;
    }

    if (branch) {

        if (state) {
            state += " • ";
        }

        state += `🌿 ${branch}`;
    }

    if (language) {

        if (state) {
            state += " • ";
        }

        state += `${languageInfo.icon} ${languageInfo.name}`;
    }

    if (!state) {
        state = "💻 Working in Visual Studio Code";
    }

    // --------------------------------------
    // SEND TO DISCORD
    // --------------------------------------

    rpc.setActivity({

        details: details,

        state: state,

        largeImageKey: "vscode",

        largeImageText:
            "Visual Studio Code",

        smallImageKey: "coding",

        smallImageText:
            language
                ? `Coding in ${languageInfo.name}`
                : "Coding",

        instance: false

    }).then(() => {

        console.log(
            "Rich Presence updated."
        );

    }).catch(error => {

        console.log(
            "Failed to update Rich Presence:"
        );

        console.log(
            error.message
        );
    });
}

// ==========================================
// HTTP SERVER
// ==========================================

const server = http.createServer(
    (req, res) => {

        // ----------------------------------
        // RECEIVE VS CODE DATA
        // ----------------------------------

        if (
            req.method === "POST" &&
            req.url === "/presence"
        ) {

            let body = "";

            req.on(
                "data",
                chunk => {
                    body += chunk;
                }
            );

            req.on(
                "end",
                () => {

                    try {

                        vscodeData =
                            JSON.parse(body);

                        // ----------------------
                        // PROJECT
                        // ----------------------

                        if (
                            vscodeData.project !==
                            lastProject
                        ) {

                            lastProject =
                                vscodeData.project;

                            console.log(
                                `📁 Project: ${vscodeData.project}`
                            );
                        }

                        // ----------------------
                        // FILE
                        // ----------------------

                        if (
                            vscodeData.file
                        ) {

                            console.log(
                                `📄 File: ${vscodeData.file}`
                            );
                        }

                        // ----------------------
                        // LANGUAGE
                        // ----------------------

                        if (
                            vscodeData.language
                        ) {

                            const info =
                                getLanguageInfo(
                                    vscodeData.language
                                );

                            console.log(
                                `${info.icon} Language: ${info.name}`
                            );
                        }

                        // ----------------------
                        // BRANCH
                        // ----------------------

                        if (
                            vscodeData.branch
                        ) {

                            console.log(
                                `🌿 Branch: ${vscodeData.branch}`
                            );
                        }

                        // ----------------------
                        // UPDATE DISCORD
                        // ----------------------

                        updatePresence();

                        // ----------------------
                        // RESPONSE
                        // ----------------------

                        res.writeHead(
                            200,
                            {
                                "Content-Type":
                                    "application/json"
                            }
                        );

                        res.end(
                            JSON.stringify({
                                success: true
                            })
                        );

                    } catch (error) {

                        console.log(
                            "Failed to process VS Code data:"
                        );

                        console.log(
                            error.message
                        );

                        res.writeHead(
                            400,
                            {
                                "Content-Type":
                                    "application/json"
                            }
                        );

                        res.end(
                            JSON.stringify({
                                success: false
                            })
                        );
                    }
                }
            );

            return;
        }

        // ----------------------------------
        // CLEAR PRESENCE
        // ----------------------------------

        if (
            req.method === "POST" &&
            req.url === "/clear"
        ) {

            vscodeData = null;

            rpc.clearActivity()
                .catch(() => {});

            console.log(
                "VS Code closed or workspace cleared."
            );

            res.writeHead(200);

            res.end("ok");

            return;
        }

        // ----------------------------------
        // NOT FOUND
        // ----------------------------------

        res.writeHead(404);

        res.end("Not Found");
    }
);

// ==========================================
// START SERVER
// ==========================================

server.listen(
    PORT,
    "127.0.0.1",
    () => {

        console.log(
            "================================="
        );

        console.log(
            " VS Code Discord RPC - V2"
        );

        console.log(
            "================================="
        );

        console.log(
            `Local server running on port ${PORT}.`
        );
    }
);

// ==========================================
// CONNECT TO DISCORD
// ==========================================

rpc.on(
    "ready",
    () => {

        console.log(
            "Discord connected!"
        );

        console.log(
            "Waiting for VS Code information..."
        );

        updatePresence();
    }
);

rpc.login({

    clientId: CLIENT_ID

}).catch(
    error => {

        console.log(
            "Failed to connect to Discord:"
        );

        console.log(
            error.message
        );
    }
);