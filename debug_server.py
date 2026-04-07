import paramiko
import sys
import os

os.environ["PYTHONIOENCODING"] = "utf-8"

HOST = "43.130.1.77"
USER = "root"
PASS = "Frogapi123@"

commands = [
    (
        "Backup and patch frogapi.top nginx config",
        "cp /www/server/panel/vhost/nginx/frogapi.top.conf /www/server/panel/vhost/nginx/frogapi.top.conf.bak-20260407 && "
        "python3 -c \"from pathlib import Path; p=Path('/www/server/panel/vhost/nginx/frogapi.top.conf'); s=p.read_text(); "
        "assert 'proxy_set_header Host 127.0.0.1;' in s, 'Host header line not found'; "
        "assert 'proxy_no_cache 1;' not in s, 'Cache bypass already present'; "
        "s=s.replace('proxy_set_header Host 127.0.0.1;','proxy_set_header Host $host;',1); "
        "s=s.replace('        proxy_read_timeout 600s;','        proxy_read_timeout 600s;\\n        proxy_no_cache 1;\\n        proxy_cache_bypass 1;\\n        add_header X-Proxy-Cache-Bypass 1 always;',1); "
        "p.write_text(s); print('Patched frogapi.top.conf')\" && nginx -t && nginx -s reload"
    ),
    (
        "Purge nginx cache reload and restart dashboard",
        "rm -rf /www/server/nginx/proxy_cache_dir/* /www/wwwroot/frogapi.top/proxy_cache_dir/* 2>/dev/null; nginx -s reload && docker restart cliproxyapi-dashboard && sleep 3 && curl -sI https://frogapi.top/login | head -20 && printf '\n---\n' && curl -sI https://frogapi.top/_next/static/chunks/0b2bcdf2d9e101e9.js | head -20"
    ),
    (
        "Verify missing old asset stays missing",
        "curl -sI https://frogapi.top/_next/static/chunks/9bbc7204f9edf1ee.js | head -20"
    ),
]

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, username=USER, password=PASS, timeout=15)
        for label, cmd in commands:
            print(f"{'='*60}")
            print(f"[{label}]")
            print(f"{'='*60}")
            stdin, stdout, stderr = client.exec_command(cmd, timeout=60)
            out = stdout.read().decode("utf-8", errors="replace")
            err = stderr.read().decode("utf-8", errors="replace")
            if out:
                sys.stdout.buffer.write(out.encode("utf-8", errors="replace"))
                sys.stdout.buffer.write(b"\n")
            if err:
                sys.stdout.buffer.write(err.encode("utf-8", errors="replace"))
                sys.stdout.buffer.write(b"\n")
            sys.stdout.buffer.flush()
            print()
    except Exception as e:
        sys.stdout.buffer.write(f"Error: {e}\n".encode("utf-8"))
        sys.exit(1)
    finally:
        client.close()

if __name__ == "__main__":
    main()
