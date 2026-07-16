// Vérifie la syntaxe de tous les fichiers .js du projet (hors node_modules).
// Remplace la commande Unix "find ... -exec node --check" qui ne fonctionne
// pas sur Windows (npm y exécute les scripts via cmd.exe, pas Bash).

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DOSSIERS_IGNORES = new Set(['node_modules', '.git']);
const racine = process.cwd();
let erreurTrouvee = false;

function listerFichiersJs(dossier) {
  const fichiersJs = [];

  function parcourir(cheminCourant) {
    const entrees = fs.readdirSync(cheminCourant, { withFileTypes: true });

    for (const entree of entrees) {
      if (DOSSIERS_IGNORES.has(entree.name)) continue;

      const cheminComplet = path.join(cheminCourant, entree.name);

      if (entree.isDirectory()) {
        parcourir(cheminComplet);
      } else if (entree.isFile() && entree.name.endsWith('.js')) {
        fichiersJs.push(cheminComplet);
      }
    }
  }

  parcourir(dossier);
  return fichiersJs;
}

const fichiers = listerFichiersJs(racine);

console.log(`Vérification de la syntaxe de ${fichiers.length} fichier(s) JS...\n`);

for (const fichier of fichiers) {
  try {
    execFileSync(process.execPath, ['--check', fichier], { stdio: 'pipe' });
    console.log(`  OK   ${path.relative(racine, fichier)}`);
  } catch (err) {
    erreurTrouvee = true;
    console.error(`  ERREUR ${path.relative(racine, fichier)}`);
    console.error(err.stderr ? err.stderr.toString() : err.message);
  }
}

if (erreurTrouvee) {
  console.error('\nBuild check échoué : au moins un fichier contient une erreur de syntaxe.');
  process.exit(1);
} else {
  console.log('\nBuild check réussi : aucune erreur de syntaxe détectée.');
}
