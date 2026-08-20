Set WshShell = CreateObject("WScript.Shell")

WshShell.Run "cmd /c cd /d D:\ADS\CVSCodeDiscordRPC && node index.js", 0, False