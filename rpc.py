import time
import os
import psutil
from pypresence import Presence


# ==========================================================
# CONFIGURATION
# ==========================================================

CLIENT_ID = "1539755392798560407"

LARGE_IMAGE = "vscode"

UPDATE_INTERVAL = 5


# ==========================================================
# DETECT VS CODE
# ==========================================================

def get_vscode_process():
    for process in psutil.process_iter(["name", "cmdline"]):
        try:
            name = process.info["name"]

            if not name:
                continue

            if name.lower() == "code.exe":
                return process

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass

    return None


# ==========================================================
# CONNECT TO DISCORD
# ==========================================================

rpc = None
connected = False


def connect_discord():
    global rpc
    global connected

    try:
        rpc = Presence(CLIENT_ID)
        rpc.connect()

        connected = True
        print("Conectado ao Discord.")

    except Exception as e:
        connected = False
        print(f"Não foi possível conectar ao Discord: {e}")


# ==========================================================
# UPDATE RICH PRESENCE
# ==========================================================

def update_presence():

    try:
        rpc.update(
            details="Programando no Visual Studio Code",
            state="Desenvolvendo um projeto",
            large_image=LARGE_IMAGE,
            large_text="Visual Studio Code",
            start=int(time.time())
        )

        print("Rich Presence atualizada.")

    except Exception as e:
        print(f"Erro ao atualizar Rich Presence: {e}")


# ==========================================================
# CLEAR RICH PRESENCE
# ==========================================================

def clear_presence():

    global rpc
    global connected

    try:
        if rpc and connected:
            rpc.clear()
            rpc.close()

    except Exception:
        pass

    connected = False


# ==========================================================
# MAIN LOOP
# ==========================================================

print("VS Code Discord Rich Presence iniciado.")

while True:

    vscode = get_vscode_process()

    if vscode:

        if not connected:
            connect_discord()

        if connected:
            update_presence()

    else:

        if connected:
            print("VS Code fechado. Removendo atividade.")
            clear_presence()

    time.sleep(UPDATE_INTERVAL)