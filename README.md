# Scroll PT

Nauka portugalskiego (europejskiego, pt-PT) od zera w formie przewijanego feedu, jak Reels/Instagram.

- jeden ekran = jedna karta (CSS scroll-snap), nieskończony feed
- przełącznik tłumaczeń 🇵🇱 polski / 🇬🇧 angielski (cały interfejs)
- posty fikcyjnych autorów: słówka, quizy, ciekawostki, scenki-filmiki z lektorem
- działy: powitania, grzeczności, przedstawianie się, liczby (1–10 i system do 1000), kawiarnia, jedzenie i picie, miasto,
  podróż, przymiotniki, czasowniki, przyimki miejsca, dni tygodnia
- przy każdym słówku osobny post ze zdaniem A1/A2 (słowo podświetlone, lektor, tłumaczenie do odsłonięcia)
- liczby jako system: ściągi z zasadami + karty „złóż liczbę z klocków” + quiz z losowymi liczbami 1–1000
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
- Rano: słowa z `due <= dziś` (max 40, najpierw najsłabsze) lecą jako powtórki, zanim pojawi się nowy materiał.
- Synchronizacja między urządzeniami wymaga logowania i bazy (np. Supabase/Firebase). Kartotekę da się przenieść 1:1.
