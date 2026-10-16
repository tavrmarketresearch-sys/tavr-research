$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/ - Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $reqPath = $context.Request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($reqPath)) { $reqPath = "index.html" }
        $filePath = Join-Path $PSScriptRoot $reqPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $context.Response.ContentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                default { "application/octet-stream" }
            }
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $context.Response.StatusCode = 404
        }
        $context.Response.Close()
    }
} finally {
    $listener.Stop()
}
