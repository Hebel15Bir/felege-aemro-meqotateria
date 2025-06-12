Set WshShell = CreateObject("WScript.Shell")

' Change directory to your Next.js project
WshShell.Run "cmd.exe /k cd /d C:\Users\Hebel\gubae-bet && npm run dev", 0
