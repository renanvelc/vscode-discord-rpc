const RPC = require("discord-rpc");

const CLIENT_ID = "1539755392798560407";

const rpc = new RPC.Client({
    transport: "ipc"
});

rpc.on("ready", () => {
    console.log("DISCORD CONECTOU!");

    rpc.setActivity({
        details: "Teste do VS Code RPC",
        state: "Rich Presence funcionando",
        startTimestamp: Math.floor(Date.now() / 1000),
        largeImageKey: "vscode",
        largeImageText: "Visual Studio Code"
    });
});

rpc.login({
    clientId: CLIENT_ID
}).catch(error => {
    console.error("ERRO AO CONECTAR:");
    console.error(error);
});