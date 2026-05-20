import subprocess
import sys
def run_script(script_name):
    print(f"\n🚀 Запуск {script_name}...")
    print("=" * 60)
    result = subprocess.run([sys.executable, script_name], capture_output=False)
    return result.returncode
# Запуск всех аудитов по очереди
scripts = [
    'audit_http.py',
    'audit_content.py', 
    'audit_schema.py'
]
for script in scripts:
    run_script(script)
    input("\nНажмите Enter для продолжения...")
