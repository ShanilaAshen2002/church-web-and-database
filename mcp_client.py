import sys
import json
import subprocess
import time
import os

api_key = "ik_307665f361fe6e1c88c83c523677525d"
api_base_url = "https://j6gn86g9.ap-southeast.insforge.app"

with open("database_schema.sql", "r", encoding="utf-8") as f:
    sql = f.read()

payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
        "name": "run-raw-sql",
        "arguments": {
            "query": sql
        }
    }
}

cmd = ["cmd", "/c", f"npx -y @insforge/mcp@latest --api_key {api_key} --api_base_url {api_base_url}"]
# on windows shell=True might be better
proc = subprocess.Popen(
    f"npx -y @insforge/mcp@latest --api_key {api_key} --api_base_url {api_base_url}",
    shell=True,
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    encoding="utf-8"
)

# Send request
proc.stdin.write(json.dumps(payload) + "\n")
proc.stdin.flush()

start = time.time()
while time.time() - start < 15:
    line = proc.stdout.readline()
    if not line:
        break
    if line.strip():
        print("OUT:", line.strip())
        if '"jsonrpc"' in line:
            break

proc.terminate()
