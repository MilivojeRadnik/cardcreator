# cardcreator

CardCreator je aplikacija napravljena da pomogne pri osmišljavanju i kreiranju kartaške igre.
Aplikacija omogućava da svako u skladu sa svojom ulogom doprinosi kreiranju igre. Te uloge su _admin_, _editor_ i _creator_.

**Admin** može da po svom nahođenju odobrava karte za izradu.

**Editor** može da pregleda odobrene karte i da kartu nakon izrade u nekom grafičkom editoru označi kartu kao završenu.

**Creator** (ali i _admin_ i _editor_) kreira karte, ima listing svojih i završenih karata.

Svako može da edituje ili briše svoje karte.

Aplikacija nema način unošenja korisnika i oni bi se trebali ručno unijeti u MongoDB kolekciju.
MongoDB model za korisnike ima atribute:
  user - ime korisnika
  password - Bcrypt hash lozinke
  role - jedno od ('admin', 'editor', 'creator')

[Ovdje](https://cardcreator.onrender.com) aplikacija može da se testira sa kredencijalima:
  
| User          | Password      |
| ------------- | ------------- |
| admin         | admin         |
| editor        | editor        |
| creator       | creator       |

Ručnim unošenjem `/logout` kao putanju u browseru briše se cookie koji čuva token za autentifikaciju.

Navigacija naprijed/nazad je pokvarena, tako da preporučujem da se koriste linkovi za navigaciju koji se nalaze ispod svake forme ili menija.
  
