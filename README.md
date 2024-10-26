- ODOVZDAVTE DOCKER-COMPOSE.YML, PACKAGE.JSON, maximalne 7 \*.JS(ON) suborov a INDEX.HTML
- pripadne odovzdavate DOCKERFILE, .DOCKERIGNORE
- NEODOVZDAVATE OBRAZKY, NODE_MODULES
- KAZDY SUBOR MUSI MAT HLAVICKU
- po "docker-compose build" a "docker-compose up" sa musi vsetko spustit. Spustenie inymi prikazmi nie je mozne a riesenia, ktore budu vyzadovant inu spustaciu sekvenciu ako hore uvedenu budu hodnotene 0b bez ohladu na funkcionalitu.
- POUZIT MOZETE LEN node:23.0 alebo node:lts. Pouzitie inej verzie nie je mozne a zadania ktore budu vyuzivat inu verziu ako uvedene 2 moznosti budu hodnotene 0b bez ohladu na funkcionalitu.
- HTTP MUSI KOMUNIKOVAT NA 8080, WS MUSI KOMUNIKOVAT NA 8082, inak zadanie bude hodnotene 0b.

Cielom ulohy bude prepisat predoslu hru z client-side verzie na server-side verziu s moznostou manazmentu viacerych hracov.

| Cislo | Hotova | Uloha                                                                                                              | Body |
| ----- | ------ | ------------------------------------------------------------------------------------------------------------------ | ---- |
| 1     | x      | prepisanie originalnej hry na server-side riesenie                                                                 | 1    |
| 2     | x      | posielanie stlaceni klaves na server a ich spracovanie na serveri cez http                                         | 1    |
| 3     | x      | vratenie iba aktualnej plochy hry zo serveru pomocou websocketov a vykreslenie aktualnej plochy cez canvas         | 1    |
| 4     | x      | moznost vyberu obrazku lode, pamatanie vyberu pre prihlaseneho pouzivatela                                         | 1    |
| 5     | x      | serverside ukladanie max skore pre prihlaseneho pouzivatela a neprihlaseneho pouzivatela                           | 1    |
| 6     | x      | vypisovanie aktualneho a najlepsieho skore zo serveru (per user/session)                                           | 1    |
| 7     | x      | umoznenie viacerych nezavislych hier paralelne (aspon 1000)                                                        | 1    |
| 8     | x      | na stranke umoznit registraciu a prihlasenie pouzivatelov - e-mail, login, heslo (2x pri registracii)              | 1    |
| 9     | x      | zdielanie session medzi backendom (server) a frontedom (browser)                                                   | 1    |
| 10    | x      | admin rozhranie zobrazujuce tabulku registrovanych pouzivatelov s moznostou zmazania pouzivatela (len pre admina)  | 1    |
| 11    |        | zobrazit zoznam aktualne hranych hier (meno/null) s moznostou sledovania pre vsetkych pouzivatelov                 | 1    |
| 12    |        | import a export CSV udajov pouzivatelov (meno, email, heslo, max score, max rychlost) len pre pouzivatela "admin"  | 1    |
| 13    | x      | vyuzitie objektovej reprezentacie struktury stranky                                                                | 1    |
| 14    | x      | server vracia staticky obsah (index.html, js subory), vsetka ostatna komunikacia (plocha, interakcia) pouziva JSON | 1    |
| 15    | x      | kontrola vstupov (email, login, heslo)                                                                             | 1    |

SUM 15

3. WS
   WebSockety su urcene iba na posielanie plochy, nic ine. 8082

4. admin
   meno: admin
   heslo: admin

5. Inspiracia:

```json
[
  {
    "tag": "div",
    "id": "id1",
    "innerTags": [
      {
        "tag": "p",
        "innerText": "Lorem ipsum"
      },
      {
        "tag": "button",
        "id": "register",
        "innerText": "Click me"
      }
    ]
  }
]
```

6. e-mail - unikatny, s overenim tvaru 3@3.2
   heslo - hashed
   login - unikatne, iba [a-zA-Z]; nepihlaseny "[N/A]"

vzor index.html:

```html
<!-- Roman Bronis -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body></body>
  <script src="client.js"></script>
</html>
```

Odovzdavate zazipovany priecinok s:
1x JS so server kodom
1x JS so server-side kodom hry
1x JS s client-side kodom hry
max. 1 HTML - index.html (cez server, nie cez file://) kde LEN nacitate svoju client-side kniznicu
optional: max dokopy 7 JS/JSON suborov
1x package.json
1x docker-compose.yml a (pripadne) dockerfile

HTTP server komunikuje na 8080
WS server komunikuje na 8082

Kazdy subor musi mat hlavicku s menom autora.
Priklad hlavicky a komentaru:
html:

```html
<!-- Roman Bronis -->
...
```

js:

```js
// Roman Bronis
...
```

Odporucane frameworky/kniznice:
Express

Vyzadovane frameworky/kniznice:
ws, fetch

Zakazane frameworky/kniznice:
React, Angular, Vue, socket.io, html2json... (ak si nie ste isty, ci ho mozete pouzit, spytajte sa)

Kazdy student zodpoveda za vypracovanie samostatne. V pripade akychkolvek nejasnosti v zadani je povinnostou studenta ich konzultovat s garantom predmetu a to pred odovzdanim do miesta odovzdania. V pripade, ze student objavi nejasnost zadania po odovzdani ma vyucujuci pravo nepridelit body za danu funkcionalitu alebo projekt podla svojho zhodnotenia. (priklad: "...ja som to pochopil tak, ze...")
