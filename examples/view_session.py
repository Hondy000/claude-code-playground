#!/usr/bin/env python3
# view_session.py - Claude Codeセッションを見やすく表示

import json
import sys
from pathlib import Path
from datetime import datetime

def view_session(session_file):
    with open(session_file, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                
                # タイムスタンプの取得（ある場合）
                timestamp_str = data.get('timestamp', '')
                if timestamp_str:
                    timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                    time_prefix = f"[{timestamp.strftime('%Y-%m-%d %H:%M:%S')}] "
                else:
                    time_prefix = ""
                
                # メッセージタイプごとの処理
                if data['type'] == 'user':
                    message = data.get('message', {})
                    content = message.get('content', '')
                    print(f"\n{time_prefix}USER:")
                    print(content)
                    
                elif data['type'] == 'assistant':
                    message = data.get('message', {})
                    content = message.get('content', [])
                    print(f"\n{time_prefix}CLAUDE:")
                    
                    # コンテンツが配列の場合の処理
                    if isinstance(content, list):
                        for item in content:
                            if isinstance(item, dict) and item.get('type') == 'text':
                                text = item.get('text', '')
                                print(text[:300] + "..." if len(text) > 300 else text)
                    else:
                        print(content[:300] + "..." if len(content) > 300 else content)
                        
                elif data['type'] == 'tool_use':
                    tool_name = data.get('name', 'Unknown')
                    tool_input = data.get('input', {})
                    print(f"\n{time_prefix}TOOL: {tool_name}")
                    print(f"Input: {json.dumps(tool_input, ensure_ascii=False)[:100]}...")
                    
                elif data['type'] == 'summary':
                    summary = data.get('summary', '')
                    print(f"\n{time_prefix}SUMMARY: {summary}")
                    
            except (json.JSONDecodeError, KeyError) as e:
                # JSON parsing or key access errors - skip invalid lines
                print(f"Warning: Skipping invalid line: {e}", file=sys.stderr)
                continue
            except BrokenPipeError:
                # Broken pipe (e.g., when output is piped to head) - exit gracefully
                sys.exit(0)
            except Exception as e:
                # Unexpected errors - log and continue
                print(f"Unexpected error processing line: {e}", file=sys.stderr)
                continue

if __name__ == "__main__":
    if len(sys.argv) > 1:
        session_file = sys.argv[1]
        
        # ファイルの存在確認
        if not Path(session_file).exists():
            print(f"Error: File '{session_file}' does not exist.", file=sys.stderr)
            sys.exit(1)
        
        # ファイルの読み取り権限確認
        if not Path(session_file).is_file():
            print(f"Error: '{session_file}' is not a file.", file=sys.stderr)
            sys.exit(1)
            
        try:
            # ファイルが読み取り可能か確認
            with open(session_file, 'r', encoding='utf-8') as f:
                pass
        except PermissionError:
            print(f"Error: No permission to read file '{session_file}'.", file=sys.stderr)
            sys.exit(1)
        except Exception as e:
            print(f"Error: Unable to read file '{session_file}': {e}", file=sys.stderr)
            sys.exit(1)
            
        view_session(session_file)
    else:
        print("使用方法: python view_session.py <session_file.jsonl>")
