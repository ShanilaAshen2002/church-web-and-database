$sql = [IO.File]::ReadAllText('database_schema.sql')
$body = @{
    jsonrpc = "2.0"
    id = 1
    method = "tools/call"
    params = @{
        name = "run-raw-sql"
        arguments = @{
            query = $sql
        }
    }
}
$jsonString = ConvertTo-Json $body -Depth 10 -Compress
[IO.File]::WriteAllText('request.json', $jsonString + "`n")
