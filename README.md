Réponses pour la Présentation Vidéo
1. Explication concise de l'architecture logicielle choisie
L'application repose sur une architecture React optimisée et modulaire, conçue pour la collaboration temps réel fluide.

Gestion d'État Globale : Utilisation d'un EditorContext avec useReducer pour centraliser les actions atomiques (frappe locale, réception distante, synchronisation).
Moteur de Simulation : Un hook personnalisé 
useSimulatedNetwork
 qui agit comme un backend virtuel. Il gère non seulement la latence et les pertes de paquets, mais aussi une logique de bots "intelligents" qui écrivent une histoire cohérente et corrigent leurs fautes, simulant une vraie session de travail.
Rendu Optimisé : Séparation stricte entre la couche de données (état) et la couche visuelle (composants memo), garantissant que seules les lignes modifiées sont redessinées.
2. Démonstration fonctionnelle (Points Clés à montrer)
Nous démontrons une expérience utilisateur "sans friction" malgré les contraintes réseaux :

Édition Simultanée : Vous pouvez écrire votre propre texte pendant que des utilisateurs virtuels (Alice, Bob) rédigent et corrigent une histoire à plusieurs mains.
Stabilité du Curseur : Grâce à une logique de préservation différentielle, votre curseur ne "saute" jamais, même si du texte est inséré avant votre position par un autre utilisateur.
Précision Pixel-Perfect : L'alignement des curseurs distants est calculé à l'unité ch près sur une police monospace stricte (Courier New), éliminant tout décalage visuel.
Résilience : Le système gère les fluctuations de latence (affichées en ms) et les micro-coupures sans perte de données locale.
3. Justification des choix techniques critiques
Unités ch vs px/em : Pour garantir un alignement parfait des curseurs collaboratifs, nous avons banni les unités relatives approximatives au profit de l'unité ch (largeur du caractère 0) couplée à une police monospace stricte. Cela assure que le curseur d'Alice est toujours exactement devant la lettre qu'elle vient d'écrire.
Mises à jour Atomiques (UPDATE_SIMULATION) : Pour éviter que le curseur ne soit "plus rapide" que le texte, nous avons regroupé l'insertion du caractère et le déplacement du curseur dans une seule action atomique du reducer, garantissant une synchronisation visuelle parfaite.
Préservation de Scroll & Sélection : L'utilisation de useLayoutEffect permet de recalculer et restaurer la position du curseur et du défilement après chaque mise à jour distante mais avant que le navigateur ne peigne l'écran, rendant les ajustements invisibles pour l'utilisateur.
Tailwind CSS : Choisi pour sa capacité à gérer le Dark Mode et le Responsive Design sans surcoût de performance, essentiel pour une application qui doit rester fluide.
