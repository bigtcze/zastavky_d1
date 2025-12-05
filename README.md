# Zástavky D1 🛣️

Kompletní průvodce benzínkami a odpočívadly na dálnici D1 pro rodiny s dětmi.

![Preview](images/hero-car.webp)

## O projektu

Webová stránka mapující všechny benzínky a odpočívadla na dálnici D1 mezi Prahou a Brnem. Zaměřeno na potřeby rodin s malými dětmi - přebalovací pulty, dětské koutky, restaurace.

### Funkce

- 📍 Seznam 40+ zastávek v obou směrech
- 🍼 Informace o přebalovacích pultech
- 🍽️ Přehled restaurací (McDonald's, KFC, Burger King)
- 📱 Responzivní design pro mobil i desktop
- 🌙 Tmavý OLED-friendly design

## Spuštění

### Docker (doporučeno)

```bash
# Stáhnout z GitHub Container Registry
docker pull ghcr.io/bigtcze/zastavky_d1:latest

# Spustit
docker run -d -p 8080:80 ghcr.io/bigtcze/zastavky_d1:latest
```

Otevřete prohlížeč na `http://localhost:8080`

### Docker Compose

```bash
docker-compose up -d
```

### Lokální build

```bash
docker build -t zastavky-d1 .
docker run -d -p 8080:80 zastavky-d1
```

## Bezpečnost

- nginx:alpine s bezpečnou konfigurací
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, CSP)
- Skrytá verze nginx serveru
- Read-only filesystem v Docker

## Technologie

- HTML5 + CSS3 + Vanilla JavaScript
- nginx:alpine
- Docker
- GitHub Actions

## CI/CD

Docker image se automaticky builduje při vytvoření nového release a pushuje do GitHub Container Registry.

## Licence

MIT License - viz [LICENSE](LICENSE)

## Přispívání

Našli jste chybu nebo máte návrh na vylepšení? Otevřete issue nebo pull request!

---

Vytvořeno s ❤️ pro rodiny s dětmi
