# Make It Shine — terminal immersif

Site statique responsive sans dépendance à installer. Entrée par mot de passe, sons synthétisés avec Web Audio, accueil vocal via la synthèse vocale du navigateur et bureau interactif.

## Lancer

```sh
cd /workspace/test
python3 -m http.server 3000
```

## Accès et personnalisation

Le mot de passe est **SHINE** (insensible à la casse). Modifier `ACCESS_CODE` dans `script.js` pour le changer. Cet écran est une mise en scène : le code est visible dans les fichiers publics et ne protège pas des données confidentielles.

Les sections musique, concerts et contact sont dans `screens` dans `script.js`. Ajouter les vrais contenus du groupe à cet endroit. Aucun titre, concert ou contact fictif n'est annoncé.

Le son commence après une interaction. Le bouton SON permet de le couper. La voix dépend du support de la synthèse vocale et des voix installées dans le navigateur. La navigation fonctionne sans audio. Google Fonts est optionnel et possède des polices de repli locales.
