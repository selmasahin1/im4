# Unsere App
Wir haben eine App entwickelt, in der Familienmitglieder angeben können, zu welchen Tageszeiten sie zu Hause sind. So können die Mutter oder der Vater unter anderem einschätzen, wieviel eingekauft und gekocht werden muss. Dies ist vor allem für Familien nützlich, die Kinder haben, welche studieren oder so alt sind, dass sie nicht mehr jeden Tag zu fixen Zeiten zu Hause sind.
Dafür haben wir einen Homebildschirm, auf dem man genau sieht, wer wann zu Hause ist und einen Bearbeiten-Tab, bei dem jede Person angeben kann, ob sie am Morgen, Mittag und Abend daheim ist.

# Technik
Nach der Registrierung in der FamSync-App muss jede Nutzerin und jeder Nutzer einer Familie beitreten. Dabei gibt es zwei Möglichkeiten:

Neue Familie gründen:
Es wird automatisch ein 6-stelliger Familiencode generiert, den man kopieren und an seine Familienmitglieder weitergeben kann.
→ Der Code wird in der Datenbank gespeichert und eine neue Familie wird gegründet

Bestehender Familie beitreten:
Hat ein anderes Familienmitglied bereits einen Code erstellt, kann man diesen eingeben, um der Familie beizutreten.
→ Der eingegebene Code wird geprüft, und wenn er existiert, wird die aktuelle Benutzer-ID der entsprechenden Familie zugewiesen.

## Darstellung in der App
Für jede Person wird visuell angezeigt, wann sie zuhause ist.

Pro Zeitabschnitt(Morgen, Mittag, Abend) wird ein Symbol angezeigt:
- Gefülltes Icon = Person ist zuhause
- Helles Icon = Person hat angegeben, nicht zuhause zu sein

## Keine Antwort gegeben
Falls ein Familienmitglied noch keine Angabe gemacht hat, wird es automatisch in einem separaten Abschnitt unten auf der Seite angezeigt:

Diese Mitglieder erscheinen unter der Überschrift „Noch keine Antwort“.

Es wird keine Zeitinformation angezeigt, da keine Daten vorhanden sind.

# Reflexion Selma
Durch die Hilfe von ChatGPT war es gut möglich die WebApp umzusetzten. Ich fand es aber recht schwierig alles einheitlich und strukturiert zu halten. Ich habe bei dieser Arbeit versucht den Lead zu übernehmen, und versucht Nadine alles zu erklären, was wie wo passiert. Gewisse Funktionalitäten haben wir gemeinsam programmiert. Das Backend habe ich mehrheitlich selbständig umgesetzt aber immer versucht dannach Nadine zu erklären wie es funktioniert. Sie hat mehr am Frontend gearbeitet.

# Reflexion Nadine
Da ich beim Programmieren wirklich nicht die Hellste bin, habe ich relativ viel neues gelernt bzw. auch einiges wirklich verstanden. Auch Sachen aus den vorherigen Semestern, bei denen ich einfach mitgeschwommen bin, habe ich diesmal angefangen richtig zu verstehen und selbstständig anzuwenden. Ich habe vor allem am Frontend gearbeitet. Selma hat am Backend gearbeitet und erklärte es mir dann, sodass ich ungefähr verstehe, wieso etwas so funktioniert, wie es funktioniert.
