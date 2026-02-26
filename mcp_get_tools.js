const cp = require('child_process');
const mcp = cp.spawn('cmd', ['/c', 'npx', '-y', '@insforge/mcp@latest', '--api_key', 'ik_307665f361fe6e1c88c83c523677525d', '--api_base_url', 'https://j6gn86g9.ap-southeast.insforge.app']);
let output = '';
mcp.stdout.on('data', d => {
    output += d.toString();
    if (output.includes('"id":1')) {
        console.log(output);
        mcp.kill();
    }
});
mcp.stderr.on('data', d => console.error('STDERR:', d.toString()));
mcp.stdin.write(JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }) + '\n');
