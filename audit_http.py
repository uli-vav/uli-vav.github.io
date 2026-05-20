import requests
from urllib.parse import urlparse

def check_status(urls, domain):
    """Проверка HTTP-статусов для списка URL"""
    results = []
    for url in urls:
        try:
            parsed_url = urlparse(url)
            if not parsed_url.scheme or not parsed_url.netloc:
                print(f"Некорректный URL: {url}")
                continue
            response = requests.get(
                url,
                timeout=10,
                allow_redirects=True,
                headers={'User-Agent': 'SEO-Audit-Bot/1.0'}
            )
            final_url = response.url
            status = response.status_code
            redirected = final_url != url
            if 200 <= status < 300:
                status_type = '✅ OK'
            elif 300 <= status < 400:
                status_type = '🔄 РЕДИРЕКТ'
            elif status == 404:
                status_type = '❌ НЕ НАЙДЕН (404)'
            elif status >= 500:
                status_type = '💥 ОШИБКА СЕРВЕРА'
            else:
                status_type = f'⚠️ ОШИБКА ({status})'
            results.append({
                'url': url,
                'final_url': final_url,
                'status': status,
                'status_type': status_type,
                'redirected': redirected,
                'response_time': response.elapsed.total_seconds()
            })
        except requests.exceptions.RequestException as e:
            results.append({
                'url': url,
                'error': f'Ошибка: {str(e)}',
                'status_type': '💀 НЕТ ДОСТУПА'
            })
    return results
def print_report(results):
    """Вывод отчёта"""
    print("=" * 80)
    print("📊 ОТЧЁТ ПО ТЕХНИЧЕСКОМУ АУДИТУ HTTP-СТАТУСОВ")
    print("=" * 80)
    # Статистика
    total = len(results)
    ok = sum(1 for r in results if '✅' in r.get('status_type', ''))
    redirects = sum(1 for r in results if '🔄' in r.get('status_type', ''))
    errors = sum(1 for r in results if '❌' in r.get('status_type', '') or '💥' in r.get('status_type', ''))
    print(f"\n📈 СТАТИСТИКА:")
    print(f"   Всего проверено URL: {total}")
    print(f"   Успешных (2xx): {ok}")
    print(f"   Редиректов (3xx): {redirects}")
    print(f"   Ошибок (4xx/5xx): {errors}")
    print("\n" + "-" * 80)
    print("📋 ДЕТАЛИ ПО КАЖДОМУ URL:")
    print("-" * 80)
    for item in results:
        print(f"\n🌐 URL: {item['url']}")
        if 'error' in item:
            print(f"   {item['status_type']}")
            print(f"   Описание: {item['error']}")
        else:
            print(f"   {item['status_type']} → {item['status']}")
            print(f"   Финальный URL: {item['final_url']}")
            print(f"   Редирект: {'Да' if item['redirected'] else 'Нет'}")
            print(f"   Время ответа: {item['response_time']:.2f} сек")
        print("-" * 50)
# URL для проверки вашего сайта
urls_to_check = [
    'https://uli-vav.github.io/',
    'https://uli-vav.github.io/#how-to-use',
    'https://uli-vav.github.io/несуществующая-страница',
    'https://uli-vav.github.io/robots.txt',
    'https://uli-vav.github.io/sitemap.xml',
    'https://uli-vav.github.io/404.html'
]
print("🚀 Запуск технического аудита...")
results = check_status(urls_to_check, 'uli-vav.github.io')
print_report(results)
