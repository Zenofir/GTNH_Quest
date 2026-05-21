const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "../bin/version/284");
const questJson = JSON.parse(fs.readFileSync(path.join(BASE, "quest_json_fr.json"), "utf8"));

const translations = {
    "AAAAAAAAAAAAAAAAAAAD4A==": "Ensuite, vous devrez trouver des abeilles tropicales. Les ruches se trouvent dans les biomes de Jungle. Soyez prudent car ces abeilles sont très agressives et peuvent vous empoisonner. Récupérez des rayons soyeux et extrayez-en de la soie brumeuse pour confectionner des vêtements d'apiculteur. Essayez d'obtenir des abeilles immaculées. Si vous avez du mal à les trouver, vous pouvez utiliser la Boussole de la Nature pour rechercher un biome spécifique.",
    "AAAAAAAAAAAAAAAAAAALkw==": "9 511 000 EU/t pendant 4 secondes par litre. Préparez-vous à en produire en grande quantité, car tous les niveaux suivants de Carburant Naquadah partent du Mk III.<br/><br/>La recette alternative peut réduire la demande logistique, mais l'approvisionnement en verre chromatique pourrait s'avérer problématique avant les stades avancés.",
    "AAAAAAAAAAAAAAAAAAALlA==": "88 540 000 EU/t pendant 5 secondes par litre. Les Carburants Naquadah commencent vraiment à devenir excellents. Pensez à épuiser le Combustible Thorium Excité pour obtenir le praséodyme nécessaire.<br/><br/>La recette alternative nécessitera une Forge à Plasma Dimensionnellement Transcendante, mais peut simplifier encore davantage l'ensemble de la chaîne d'approvisionnement.<br/><br/>C'est peut-être aussi le bon moment pour envisager d'utiliser du Neutronium Fondu pour améliorer le rendement des matériaux Haute Densité.",
    "vK1Ed8HPTTms4QxfaA_P8Q==": "Avec accès à des matériaux encore plus avancés, vous pouvez améliorer votre QFT au niveau 3 en remplaçant les coques §3Manipulateur de Tissu Cosmique§r par des coques §3Manipulateur Infusé d'Infini§r. Ce niveau débloque deux nouveaux raccourcis puissants : le §6raccourci naqline final§r et le §6raccourci cellule souche§r.<br/><br/>Cette nouvelle coque nécessite des matériaux encore plus avancés, dont le §3Composite Supraconducteur Terres Rares§r, qui ne peut être fabriqué que dans un QFT de niveau 2. Contrairement au §3Adhésif Auto-Réparant Hyper-Stable§r, axé sur l'intégrité structurelle, ce composite est conçu uniquement pour la transmission d'énergie. La réparation automatique étant désormais entièrement gérée, nous pouvons nous concentrer sur l'augmentation du flux d'énergie entre les composants et dans la multistructure elle-même.<br/><br/>Les supraconducteurs standard se dégradent sous le stress quantique — mais ce composite élimine toute résistance sur l'enveloppe extérieure. Ses éléments de terres rares finement stratifiés créent des transitions si progressives que le flux quantique circule sans effort, sans pertes ni effets déstabilisateurs.<br/><br/>§oQue découvrirez-vous ensuite ?!",
    "eWOxG-reT9ewlW0CNXgQNQ==": "Vous êtes-vous déjà dit « pourquoi tout doit-il utiliser autant d'aspects primordiaux ? » Eh bien, vous n'aurez plus à vous en inquiéter !<br/><br/>Voici la Rosa Mysteria. Lorsqu'elle est plantée sur un Bloc de Cristal, elle utilise l'essence de ce bloc pour pousser en un Éclat d'Aspect du même type ! Ces éclats peuvent ensuite être jetés dans votre Chaudron ou votre Fourneau Alchimique, ou utilisés comme Fragments de Connaissance pour obtenir des Points de Recherche. Même les Cristaux Mixtes peuvent servir de catalyseur !<br/><br/>[warn]Avertissement : Planter une Rosa Mysteria sur des Blocs de Cristal Souillés entraînera des conséq§ku§re§kn§rc§ke§rs i§km§rp§kr§ké§kv§ru§ke§rs.§r[/warn]",
    "AAAAAAAAAAAAAAAAAAAC2w==": "Ensuite, vous devriez compresser des balles végétales à partir de votre blé.<br/><br/>Le compresseur MV est deux fois plus rapide que le LV. Vous pourriez penser que c'est une bonne idée de l'utiliser. Eh bien, cela dépend. N'oubliez pas qu'il consomme aussi 4 fois plus d'énergie. Cela signifie que vous dépensez 2 fois plus d'EU au total pour obtenir la même quantité d'EU en sortie. Si vous surchargez trop dans votre configuration de production de carburant, vous vous retrouvez avec un déficit d'EU ! Un seul surcadençage est cependant généralement très rentable.<br/><br/>À terme, vous voudrez utiliser des multiblocs pour de meilleures vitesses et une meilleure efficacité !"
};

let updated = 0;
for (const lineKey in questJson) {
    for (const quest of (questJson[lineKey].data || [])) {
        if (quest.quest_id && translations[quest.quest_id]) {
            quest.data = translations[quest.quest_id];
            updated++;
        }
    }
}

fs.writeFileSync(path.join(BASE, "quest_json_fr.json"), JSON.stringify(questJson, null, 2), "utf8");
console.log(`✅ ${updated} quêtes injectées. quest_json_fr.json mis à jour !`);
