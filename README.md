# Scroll PT

Nauka portugalskiego (europejskiego, pt-PT) od zera w formie przewijanego feedu, jak Reels/Instagram.

- jeden ekran = jedna karta (CSS scroll-snap), nieskończony feed
- przełącznik tłumaczeń 🇵🇱 polski / 🇬🇧 angielski (cały interfejs)
- posty fikcyjnych autorów: słówka, quizy, ciekawostki, scenki-filmiki z lektorem
- powtórki błędów, XP, combo, streak, cel dnia, skrzynki z nagrodami, rzadkie karty

Całość w jednym pliku `index.html`, bez budowania. Demo: https://bie7u.github.io/scroll-pt/

## Zdjęcia i filmiki

- `img/` – zdjęcia do słówek i działów z Wikimedia Commons (wolne licencje). Autor i licencja są w `PHOTOS` w `index.html`
  i wyświetlają się na karcie. Klucz to id słowa (np. `cafe:3`), `U:<dział>` albo `rare:<słowo>`.
- `video/pastelaria.mp4` – **przykładowy** filmik: trzy zdjęcia z Commons + syntetyczny głos pt-PT. Do podmiany na
  prawdziwe nagranie.

### Jak dodać własne nagranie

1. Nagraj pionowo (9:16), 15–30 s, w ciszy, z 1–2 s zapasu na początku i końcu. Bez wypalonych napisów.
2. Skompresuj: `ffmpeg -i nagranie.mov -vf scale=720:-2 -c:v libx264 -crf 26 -c:a aac -b:a 96k -movflags +faststart video/nazwa.mp4`
3. W `VIDEOS` w `index.html` ustaw `src: 'video/nazwa.mp4'` i dla każdej kwestii w `lines` podaj `start` i `end` w sekundach.
   Napisy PT/PL/EN aplikacja nakłada sama, więc działa przełącznik języka.
4. Każda nagrana osoba musi wyrazić zgodę na publikację wizerunku.
