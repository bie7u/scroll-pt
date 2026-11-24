# Scroll PT

Nauka portugalskiego (europejskiego, pt-PT) od zera w formie przewijanego feedu, jak Reels/Instagram.

- jeden ekran = jedna karta (CSS scroll-snap), nieskończony feed
- przełącznik tłumaczeń 🇵🇱 polski / 🇬🇧 angielski (cały interfejs)
- posty fikcyjnych autorów: słówka, quizy, ciekawostki, scenki-filmiki z lektorem
- działy: powitania, grzeczności, przedstawianie się, być (osoby + odmiana ser i estar), ratunkowe zwroty, liczby (1–10 i system do 1000), kawiarnia, jedzenie i picie, miasto,
  restauracja, transport (Navegante, metro, elétrico), podróż, apteka i nagłe sytuacje, przymiotniki, czasowniki, przyimki miejsca, dni tygodnia, słowa czasu, czas przeszły (pretérito perfeito),
  przyszłość (ir + bezokolicznik, tak jak mówi się w Portugalii)
- przy każdym słówku osobny post ze zdaniem A1/A2 (słowo podświetlone, lektor, tłumaczenie do odsłonięcia)
- liczby jako system: ściągi z zasadami + karty „złóż liczbę z klocków” + quiz z losowymi liczbami 1–1000
- słuchanie: karty „Ze słuchu” (całe zdanie bez tekstu, tempo ×1,12, 🐢 ×0,75), scenki w tempie ulicy (`fast: true`)
- system powtórek (przegródki): powtórki na dziś przed nowym materiałem, limit nowych słówek dziennie (domyślnie 10)
- powtórki w komentarzach: wpisujesz odpowiedź po portugalsku, sprawdzanie toleruje brak akcentów i literówki
- XP, combo, streak, cel dnia, skrzynki z nagrodami, rzadkie karty

Całość w jednym pliku `index.html`, bez budowania. Demo: https://bie7u.github.io/scroll-pt/

## Zdjęcia i filmiki

- `img/` – zdjęcia do słówek i działów z Wikimedia Commons (wolne licencje). Autor i licencja są w `PHOTOS` w `index.html`
  i wyświetlają się na karcie. Klucz to id słowa (np. `cafe:3`), `U:<dział>`, `rare:<słowo>` albo `gen<N>` (ogólne zdjęcia z Portugalii dla quizów,
  ciekawostek i skrzynek). Post bez własnego zdjęcia dostaje losowe ogólne.
- `video/pastelaria.mp4` – **przykładowy** filmik: trzy zdjęcia z Commons + syntetyczny głos pt-PT. Do podmiany na
  prawdziwe nagranie.

### Jak dodać własne nagranie

1. Nagraj pionowo (9:16), 15–30 s, w ciszy, z 1–2 s zapasu na początku i końcu. Bez wypalonych napisów.
2. Skompresuj: `ffmpeg -i nagranie.mov -vf scale=720:-2 -c:v libx264 -crf 26 -c:a aac -b:a 96k -movflags +faststart video/nazwa.mp4`
3. W `VIDEOS` w `index.html` ustaw `src: 'video/nazwa.mp4'` i dla każdej kwestii w `lines` podaj `start` i `end` w sekundach.
   Napisy PT/PL/EN aplikacja nakłada sama, więc działa przełącznik języka.
4. Każda nagrana osoba musi wyrazić zgodę na publikację wizerunku.

## System powtórek

Postęp zapisuje się w `localStorage` przeglądarki (klucz `scroll-pt-v2`), więc tylko na tym jednym urządzeniu.
Każde słowo ma kartotekę w `S.srs`:

```js
"cafe:4": { box: 3, due: "2026-11-27", lapses: 1, last: "2026-11-20" }
```

- `box` 1–6 = przegródka; następna powtórka za 1, 3, 7, 14, 30, 90 dni.
- Ocena: zła odpowiedź → przegródka 1 (jutro); dobra po namyśle (> 6 s) → bez zmian; dobra szybko → +1;
  komentarz bezbłędnie (z akcentami) → +2. Awans najwyżej raz dziennie i tylko po terminie.
- Samo rozpoznanie (quiz PT → PL) nie podnosi słowa powyżej przegródki 3. Dalej trzeba umieć je przypomnieć:
  quiz PL → PT, odsłuch albo komentarz.
- Pozycja w planie opiera się na znanych słowach: nowy dział wstawiony w środek trafia do użytkownika jako
  następny, a przerobione działy są pomijane (`planRedundant`, `syncPlan`).
- Rano: słowa z `due <= dziś` (max 40, najpierw najsłabsze) lecą jako powtórki, zanim pojawi się nowy materiał.
- Synchronizacja między urządzeniami wymaga logowania i bazy (np. Supabase/Firebase). Kartotekę da się przenieść 1:1.

## Konta użytkowników (Supabase)

Bez konfiguracji aplikacja zapisuje postęp tylko w przeglądarce. Z Supabase każdy użytkownik loguje się e-mailem
i hasłem, a postęp (cały stan aplikacji, w tym kartoteka powtórek) zapisuje się w tabeli `progress`.

1. Załóż projekt na https://supabase.com (darmowy plan).
2. SQL Editor → wklej `supabase/schema.sql` → Run. Tworzy tabelę i reguły RLS (każdy widzi tylko swój wiersz).
3. Authentication → Sign In / Providers → Email: włączony. Na czas testów wyłącz „Confirm email”
   (darmowy Supabase wysyła tylko kilka maili na godzinę).
4. Authentication → URL Configuration → Site URL: `https://bie7u.github.io/scroll-pt/`.
5. Project Settings → API: skopiuj **Project URL** i klucz **anon / publishable** i wpisz w `index.html`:
   `const CLOUD = window.SCROLL_PT_CLOUD || { url: '…', key: '…' };`

Klucz anon jest publiczny z założenia (trafia do przeglądarki). Bezpieczeństwo zapewniają reguły RLS.
**Nigdy** nie wpisuj tu klucza `service_role`.

Zachowanie:
- Pierwsze logowanie przejmuje postęp zrobiony wcześniej bez konta na tym telefonie.
- Zapis do chmury 1,5 s po każdej zmianie i przy zamknięciu/zminimalizowaniu aplikacji.
- Po powrocie do aplikacji sprawdza, czy inne urządzenie nie zapisało nowszego postępu (wygrywa nowszy).
- Bez internetu postęp zapisuje się na telefonie i trafia do chmury przy następnym udanym zapisie.

## Aplikacja na telefonie (PWA)

- `manifest.webmanifest` + `icons/`: instalacja na ekranie głównym, pełny ekran, ikona i nazwa „Scroll PT”.
- `sw.js` (service worker): strona najpierw z sieci (zawsze świeża wersja), bez internetu z pamięci; zdjęcia, ikony
  i biblioteka logowania z pamięci z odświeżaniem w tle. Supabase, YouTube i wideo idą zawsze z sieci.
  Przy zmianie listy plików w `SHELL` podbij `VERSION`.
- Android/Chrome: przycisk „Zainstaluj” (zdarzenie `beforeinstallprompt`). iPhone: instrukcja
  „Udostępnij → Do ekranu początkowego” (Apple nie pozwala instalować jednym kliknięciem).
- Na iPhonie zainstalowana aplikacja ma osobną pamięć od Safari: postęp bez konta nie przechodzi, dlatego
  po instalacji trzeba się zalogować.

## Lektor (nagrania)

Lektor odtwarza pliki `audio/<klucz>.mp3` (portugalski z Portugalii, wygenerowane gTTS z `lang='pt', tld='pt'`),
a nie syntezator mowy telefonu, który na wielu Androidach milczy albo nie ma portugalskiego głosu.
Klucz to `'a' + hash(tekst)` w base36 (funkcja `audioKey`), lista dostępnych kluczy jest w `AUDIO_KEYS`.
Liczby i inne złożenia grają z klocków (słowo po słowie). Gdy brakuje nagrania, awaryjnie mówi syntezator.

Po dodaniu nowych słówek lub zdań trzeba dograć brakujące nagrania:
1. zebrać frazy (`ALL[].pt`, `ALL[].ex[0]`, `RARES[].pt`, kwestie `VIDEOS`) z kluczami `audioKey(...)` do JSON,
2. `python tools/gen_audio.py frazy.json audio` (pomija istniejące pliki),
3. dopisać nowe klucze do `AUDIO_KEYS` w `index.html`.
Docelowo nagrania można podmienić na głos prawdziwego lektora pod tymi samymi nazwami plików.
