<p align="center">
  <a href="https://Thinksoft.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Thinksoft logo">
    </picture>
  </a>
</p>
<p align="center">Otwartoźródłowy agent kodujący AI.</p>
<p align="center">
  <a href="https://Thinksoft.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/Thinksoft-ai"><img alt="npm" src="https://img.shields.io/npm/v/Thinksoft-ai?style=flat-square" /></a>
  <a href="https://github.com/thinksoft/thinksoft/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/thinksoft/thinksoft/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![Thinksoft Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://Thinksoft.ai)

---

### Instalacja

```bash
# YOLO
curl -fsSL https://Thinksoft.ai/install | bash

# Menedżery pakietów
npm i -g Thinksoft-ai@latest        # albo bun/pnpm/yarn
scoop install Thinksoft             # Windows
choco install Thinksoft             # Windows
brew install thinksoft/tap/Thinksoft # macOS i Linux (polecane, zawsze aktualne)
brew install Thinksoft              # macOS i Linux (oficjalna formuła brew, rzadziej aktualizowana)
sudo pacman -S Thinksoft            # Arch Linux (Stable)
paru -S Thinksoft-bin               # Arch Linux (Latest from AUR)
mise use -g Thinksoft               # dowolny system
nix run nixpkgs#Thinksoft           # lub github:thinksoft/thinksoft dla najnowszej gałęzi dev
```

> [!TIP]
> Przed instalacją usuń wersje starsze niż 0.1.x.

### Aplikacja desktopowa (BETA)

Thinksoft jest także dostępny jako aplikacja desktopowa. Pobierz ją bezpośrednio ze strony [releases](https://github.com/thinksoft/thinksoft/releases) lub z [Thinksoft.ai/download](https://Thinksoft.ai/download).

| Platforma             | Pobieranie                         |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `Thinksoft-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `Thinksoft-desktop-mac-x64.dmg`     |
| Windows               | `Thinksoft-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm` lub AppImage        |

```bash
# macOS (Homebrew)
brew install --cask Thinksoft-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/Thinksoft-desktop
```

#### Katalog instalacji

Skrypt instalacyjny stosuje następujący priorytet wyboru ścieżki instalacji:

1. `$THINKSOFT_INSTALL_DIR` - Własny katalog instalacji
2. `$XDG_BIN_DIR` - Ścieżka zgodna ze specyfikacją XDG Base Directory
3. `$HOME/bin` - Standardowy katalog binarny użytkownika (jeśli istnieje lub można go utworzyć)
4. `$HOME/.Thinksoft/bin` - Domyślny fallback

```bash
# Przykłady
THINKSOFT_INSTALL_DIR=/usr/local/bin curl -fsSL https://Thinksoft.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://Thinksoft.ai/install | bash
```

### Agents

Thinksoft zawiera dwóch wbudowanych agentów, między którymi możesz przełączać się klawiszem `Tab`.

- **build** - Domyślny agent z pełnym dostępem do pracy developerskiej
- **plan** - Agent tylko do odczytu do analizy i eksploracji kodu
  - Domyślnie odmawia edycji plików
  - Pyta o zgodę przed uruchomieniem komend bash
  - Idealny do poznawania nieznanych baz kodu lub planowania zmian

Dodatkowo jest subagent **general** do złożonych wyszukiwań i wieloetapowych zadań.
Jest używany wewnętrznie i można go wywołać w wiadomościach przez `@general`.

Dowiedz się więcej o [agents](https://Thinksoft.ai/docs/agents).

### Dokumentacja

Więcej informacji o konfiguracji Thinksoft znajdziesz w [**dokumentacji**](https://Thinksoft.ai/docs).

### Współtworzenie

Jeśli chcesz współtworzyć Thinksoft, przeczytaj [contributing docs](./CONTRIBUTING.md) przed wysłaniem pull requesta.

### Budowanie na Thinksoft

Jeśli pracujesz nad projektem związanym z Thinksoft i używasz "Thinksoft" jako części nazwy (na przykład "Thinksoft-dashboard" lub "Thinksoft-mobile"), dodaj proszę notatkę do swojego README, aby wyjaśnić, że projekt nie jest tworzony przez zespół Thinksoft i nie jest z nami w żaden sposób powiązany.

---

**Dołącz do naszej społeczności** [Discord](https://discord.gg/Thinksoft) | [X.com](https://x.com/Thinksoft)
