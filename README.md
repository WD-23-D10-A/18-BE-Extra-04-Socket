# 18-BE-Extra-04-Socket

-   Docs: `docs`-Branch [hier.](https://github.com/WD-23-D10-A/18-BE-Extra-04-Socket/tree/docs)
-   Zum: `setup`-Branch [hier.](https://github.com/WD-23-D10-A/18-BE-Extra-04-Socket/tree/setup)
-   Zum mitverfolgen: `final`-Branch [hier.](https://github.com/WD-23-D10-A/18-BE-Extra-04-Socket/tree/final)


# Was Sind WebSockets und warum sind die nützlich

Du hast schon von GET und POST Anfragen gehört. Diese werden typischerweise verwendet, um Daten vom Client (deinem Browser) an den Server zu senden und umgekehrt. Aber was ist, wenn du etwas in Echtzeit möchtest? Zum Beispiel:

* Eine Chat-Anwendung, bei der Nachrichten sofort gesendet und empfangen werden.

* Live-Benachrichtigungen, ohne die Seite neu laden zu müssen.

* Multiplayer-Spiele, wo die Aktionen der Spieler sofort sichtbar sein müssen.

WebSockets sind eine Technologie, die es ermöglicht, eine bidirektionale Kommunikation zwischen einem Client und einem Server über das HTTP-Protokoll aufzubauen. Sie sind nützlich, weil sie eine effiziente und schnelle Kommunikation zwischen einem Client und einem Server ermöglichen, ohne dass der Client ständig eine Anfrage an den Server senden muss. Dies ist besonders nützlich, wenn der Client und der Server in Echtzeit miteinander kommunizieren müssen, z.B. bei einem Chat oder einem Multiplayer-Spiel.


Hier kommt [Socket.io](https://socket.io/) ins Spiel! 

## Was macht Socket.io?

Socket.io ist eine Bibliothek, die es ermöglicht, in Echtzeit zwischen einem Client (z.B. deinem Browser) und einem Server Daten auszutauschen. Der große Vorteil: Der Client und der Server können zu jeder Zeit miteinander "sprechen", nicht nur, wenn eine Anfrage gesendet wird, wie es bei GET oder POST der Fall ist.

## Beispiel für GET/POST mit Express:

Normalerweise funktioniert der Datenaustausch so:

1. Der Client schickt eine GET Anfrage, um Daten vom Server zu holen (z.B. eine Liste von Nachrichten).

2. Der Server schickt diese Daten zurück.

3. Wenn der Client neue Daten will (z.B. neue Nachrichten), muss er erneut eine GET Anfrage schicken.

Das funktioniert gut, aber ist nicht sehr effizient, wenn du ständig nach neuen Daten fragen musst.

## Beispiel mit Socket.io:

Mit Socket.io kann der Server die Daten sofort an den Client senden, sobald sich etwas ändert – z.B. wenn eine neue Nachricht eintrifft. Der Client muss nicht ständig fragen, ob etwas Neues passiert ist. Das spart Ressourcen und fühlt sich viel "flüssiger" an.

* In einem Chat kann der Benutzer eine Nachricht senden, und Socket.io schickt diese Nachricht sofort an alle verbundenen Benutzer, ohne dass jemand die Seite neu laden oder auf neue Nachrichten prüfen muss.

## Wie ist es anders als normale GET/POST Anfragen?

1. Echtzeit-Kommunikation: Bei normalen Anfragen (GET/POST) muss der Client ständig den Server anfragen, um zu wissen, ob es neue Daten gibt. Bei Socket.io werden die Daten sofort gesendet, sobald sich etwas ändert, ohne dass der Client etwas tun muss.

2. Bidirektionale Kommunikation: Bei GET/POST wird die Anfrage nur in eine Richtung gesendet – entweder vom Client an den Server oder umgekehrt. Bei Socket.io können der Client und der Server ständig in beide Richtungen miteinander kommunizieren.

3. Perfekt für Echtzeitanwendungen: Anwendungen wie Chats, Multiplayer-Spiele oder Live-Benachrichtigungen funktionieren am besten mit Socket.io, da sie schnelle Reaktionen erfordern.

## Ein einfaches Beispiel:

Mit Express und GET/POST:

```javascript
const express = require('express');
const app = express();

app.get('/messages', (req, res) => {
  res.send(['Nachricht 1', 'Nachricht 2']);  // Jede Nachricht holen
});

app.listen(3000, () => console.log('Server läuft auf Port 3000'));
```
Hier muss der Client immer wieder GET Anfragen stellen, um neue Nachrichten zu holen.

Mit Socket.io:

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Ein Benutzer ist verbunden');

  socket.on('nachricht senden', (msg) => {
    io.emit('neue nachricht', msg);  // Sofortige Nachricht an alle Clients
  });
});

server.listen(3000, () => console.log('Server läuft auf Port 3000'));
```

In diesem Beispiel wird die Nachricht sofort an alle verbundenen Benutzer gesendet, sobald jemand eine Nachricht schickt. Kein ständiges Neuladen der Seite nötig!

## Wann solltest du Socket.io verwenden?

1. Chats: Nachrichten sollten sofort bei allen Benutzern erscheinen.

2. Live-Benachrichtigungen: Wenn du z.B. sofort wissen willst, wenn jemand dir eine Nachricht schickt oder auf einen Beitrag antwortet.

3. Multiplayer-Spiele: Aktionen der Spieler müssen in Echtzeit synchronisiert werden.

4. Echtzeit-Dashboards: Wenn Daten sofort aktualisiert werden sollen (z.B. Börsendaten, Überwachungssysteme).

Ich hoffe, das gibt dir eine gute Einführung in die Welt von Socket.io! Viel Spaß beim Experimentieren und Erstellen von Echtzeitanwendungen!