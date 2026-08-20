# VS Code Discord RPC

A custom Discord Rich Presence integration for Visual Studio Code.

This project connects Visual Studio Code to Discord through a local Node.js application and a custom VS Code extension, allowing your Discord profile to display information about what you are currently working on.

## Features

-  Automatically detects the current workspace/project
-  Detects the currently active file
-  Detects the programming language
-  Displays the current Git branch
-  Custom Discord Rich Presence
-  Updates the presence when the active file changes
-  Custom VS Code extension
-  Optional automatic startup with Windows

## Preview

The Rich Presence can display information such as:

- **Visual Studio Code**  
-  Coding in CVSCodeDiscordRPC  
-  index.js  
-  JavaScript  
-  main

## How It Works

The project consists of two main components:

Visual Studio Code → Custom VS Code Extension → Workspace information → Node.js → index.js → Discord RPC Client → Discord → Discord → Rich Presence       

The VS Code extension collects information from the current workspace and sends it to the local Node.js application.

The Node.js application then uses Discord RPC to update the user's Discord Rich Presence.

## Technologies

- JavaScript
- Node.js
- Discord RPC
- Visual Studio Code Extension API
- Git
- GitHub
- Windows Script Host (VBScript)

## Project Structure

--Index.js--
The main Node.js application.

It connects to Discord through Discord RPC and handles the Rich Presence data.

--vscode-extension/--

Contains the custom Visual Studio Code extension responsible for collecting information from the active workspace.

--start-rpc.vbs--

Optional Windows startup script that launches the RPC application without requiring the user to manually open a terminal.

## Installation
Requirements:

* Node.js
* Visual Studio Code
* Discord Desktop
* A Discord Application with Rich Presence enabled
  
1. Clone the repository
git clone https://github.com/renanvelc/vscode-discord-rpc.git
Then enter the project directory:
cd vscode-discord-rpc

2. Install dependencies
npm install

3. Configure the Discord Application
Create a Discord Application and obtain its Application ID.
Configure the project with your Client ID before starting the RPC.
Do not publish private credentials or tokens in the repository.

4. Start the RPC
node index.js
The application should connect to Discord and wait for information from the VS Code extension.

5. Install the VS Code Extension
The extension is located inside:
vscode-extension/
Package the extension as a .vsix file and install it through Visual Studio Code.
After installation, reload VS Code.

## Automatic Startup

The project includes:
start-rpc.vbs

This script can be configured to start the Node.js RPC automatically when Windows starts.
This allows the RPC to run in the background without manually opening a terminal.

## Privacy & Security

The application is designed to communicate locally between the VS Code extension and the Node.js RPC process.
The project does not need to upload your source code to a remote server.
Only workspace-related information required for the Rich Presence is processed.

Never commit:
API keys
Tokens
Passwords
Private credentials
Personal configuration files

Use .gitignore to keep local configuration files out of version control.

## What I Learned

This project was created as a practical way to explore:
Node.js development
Discord Rich Presence
VS Code Extension development
Local application communication
Git and GitHub
Workspace and file detection
Windows automation

It also helped me understand how different applications can communicate with each other through APIs and local services.

## Future Improvements

Possible improvements for future versions:

- Improved coding session tracking
- Easier configuration
- More Rich Presence customization
- Additional VS Code information
- Custom project-specific assets
- Easier installation
- Better automatic reconnection handling

## License
This project is licensed under the MIT License.
