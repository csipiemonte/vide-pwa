# Project Title
**PWA: VIDE, Your Virtual Desk**

# Project Description
È una web application realizzata in tecnica *responsive*, nativamente adattabile ai dispositivi sia mobili che desktop. Nello specifico si tratta di una *Single Page Application* che rappresenta, all'interno del progetto VIDE, il modulo impiegato per la gestione della videoconferenza fra operatore di sportello e cittadino.

# Configurations
Nei file di configurazione:

- *.env.development* (per la generazione della distribuzione per l'ambiente di sviluppo remoto)
- *.env.test* (per la generazione della distribuzione per l'ambiente di test remoto)
- *.env.production* (per la generazione della distribuzione per l'ambiente di produzione)

predisporre il seguente parametro:

- VUE_APP_CONFERENCE_URL_DOMAIN: URL del server di videoconferenza Jitsi.

# Prerequisites
I prerequisiti per la compilazione e l'installazione della componente sono i seguenti:

## Software
- [Apache 2.4](https://www.apache.org)
- [Node.js 12.19.0](https://nodejs.org)

# Installing
Per predisporre il progetto ed avviare il server in locale, mandare in esecuzione:

>#### installazione dipendenze
> ```npm install```
>
>#### per avviare il server locale su localhost:8080
>``` npm run serve```

## End to end tests
L'esecuzione automatica dei test funziona **solamente** con i seguenti prerequisiti:
 - Java(TM) SE Runtime Environment (build 1.8.0_211-b12) Java HotSpot(TM) 64-Bit Server
 - Google Chrome Versione 87.0.4280.66 (Build ufficiale) (a 64 bit)
 - @vue/cli-plugin-e2e-nightwatch v. 4.5.9"
 - chromedriver v. 87.0.2
 - dare OK all'accesso esecuzione Java nelle reti pubbliche e private
 - non avere un precedente processo di chrome (chromedriver.exe) in stato zombie e quindi non terminato (cfr. Gestione attività)

Ogni modifica di versione ai componenti elencati deve essere testata. Per ottenere il CSS selector: in Google Chrome fare click con il tasto destro sull'elemento di cui si desidera conoscere il selector, poi click su Ispeziona che apre la barra dello sviluppatore. All'interno di quest'ultima, click con il tasto destro sull'elemento ispezionato e poi Copy -> Copy selector.

Prima di eseguire i test, avviare il json-server con:
``` bash
> npm run serve
```
In un'altra finestra di Node.js, mandare in esecuzione i test automatizzati con:
``` bash
> npm run test
```

## Coding style tests
Mandare in esecuzione il comando:
> ```npm run lint```

# Deployment
Per eseguire la build del codice JS ed ottenere la distribuzione (cartella *dist*) del software per l'ambiente di deployment, i comandi da utilizzare sono:
>#### build e dist per ambiente di sviluppo
> npm run build:dev
>
>#### build e dist per ambiente di test
> npm run build:test
>
>#### build e dist per ambiente di produzione
> npm run build:prod
>

Il contenuto della cartella *dist*, originato dal comando di build, deve essere portato sull'ambiente di deployment.

# Versioning
Per la gestione del codice sorgente viene utilizzata la metodologia [Semantic Versioning](https://semver.org/).

# Authors
Gli autori della componente **PWA: VIDE, Your Virtual Desk** sono:

- [Ramona Banfi](mailto:ramona.banfi@consulenti.csi.it)
- [Riccardo Franco](mailto:riccardo.franco@csi.it)
- [Carlo Peraudo](mailto:carlo.peraudo@consulenti.csi.it)
- [Daniel Scaletta](mailto:daniel.scaletta@consulenti.csi.it)

# Copyrights
(C) Copyright 2020 CSI Piemonte

# License
Questo software è distribuito con licenza [EUPL-1.2-or-later](https://joinup.ec.europa.eu/collection/eupl/eupl-text-11-12)

Consulta il file [LICENSE.txt](LICENSE.txt) per i dettagli sulla licenza (versione inglese [LICENSE_EN.txt](LICENSE_EN.txt)).

In [Bom.csv](Bom.csv) è presente l'elenco delle librerie esterne utilizzate dalla PWA.
