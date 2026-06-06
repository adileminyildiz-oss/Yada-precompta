# ROADMAP — YADA / Précompta · finalisation par module

> Feuille de route de finalisation du format actuel (jusqu'à `yada-addon20`).
> **Principe directeur : ne jamais rompre le fil comptable.** Tout se fait par addons `yada-addonN` additifs, validés à chaque étape (`node --check` + Σ débit = Σ crédit sur les 2 démos AMA et SCI 42).

## Règles d'or
1. Écritures **uniquement** via `posterFacture` / `genEcriture` / `posterBanque` / `posterOD`.
2. **Σ débit = Σ crédit** sur chaque pièce.
3. Comptes normalisés **`c9`** (9 chiffres).
4. Numérotation **unique et chronologique** (`nextNumUnique`).
5. Pièce envoyée/verrouillée = non modifiable → correction par **avoir** ou **OD**.
6. **Continuité d'exercice** : à‑nouveaux (classes 1→5) + résultat (120/129) reportés à la clôture.
7. Validation systématique à chaque addon.

## Fondations transverses (priorité maximale)
- ✅ **T1 — Clôture & à‑nouveaux & résultat** : OD de résultat (solde 6/7 → 120/129) + report des soldes 1→5 à l'ouverture N+1. *(addon21)*
- ✅ **T2 — Cohérence des comptes (TVA)** : normalisation `c9` partout ; l'OD TVA solde réellement `44571`/`44566`. *(addon22)*
- ✅ **T4 — États de synthèse** : Bilan + Compte de résultat. *(addon23)*
- ✅ **T3 — Lettrage unifié** : moteur commun `lz*` + lettrage interactif dans l'éditeur (colonne L), compatible compte auxiliaire. *(addon24)*

**→ Fondations terminées. Prochaine phase : modules à risque comptable.**

## Plan par module (synthèse)
| Module | À finaliser (clé) | Garde‑fou comptable |
|---|---|---|
| `dash` | Agrégats basés sur les écritures ; trésorerie = solde 512 ; GED réelle | Lecture seule |
| `societe` | Compteurs dynamiques par dossier | Navigation |
| `client` | GED réelle, mode client séparé, messagerie | Aucune écriture directe |
| `tiers` | Édition/suppression fiche ; collectif vs auxiliaire | Pas de modif rétroactive ; type figé si mouvementé |
| `facturation` | Avoirs, chronologie n°, e‑reporting, Factur‑X dans PDF/A‑3 | VTE équilibrée ; verrou après envoi |
| `achats` | OCR réel, autoliquidation UE, justificatif rattaché | ACH équilibrée |
| `compta` | Éditeur filtre+lettrage ; intégrer les A‑nouveaux | Équilibre imposé (471/bon compte) |
| `chargespaie` | Taux paramétrables, paiement+lettrage, bulletin/DSN | OD équilibrées, idempotence |
| `journal` | Édition depuis le journal, pagination | Lecture ; signaler déséquilibres |
| `ia` | IA en ligne réelle, mémorisation par tiers | Comptabilisation via posterFacture |
| `tva` | **T2** : OD TVA solde réellement ; chaînage crédit ; CA12 acomptes | TVA déclarée = solde 4457x/4456x |
| `editions` | **T4** Bilan + CR ; balance âgée ; A‑nouveaux | États depuis écritures |
| `fec` | FEC inverse (N→N‑1), conformité renforcée | Rejet déséquilibre/hors‑exercice |
| `analytique` | Axes analytiques, marge par affaire | Lecture |
| `banque` | Multi‑512, import relevé, ventilation TVA charge | BQ équilibrée |
| `saisiebq` | Fusion avec banque ; TVA/multi‑512 | 2 lignes équilibrées |
| `rappro` | Rapprochement auto, import relevé | Pointage ne modifie aucune écriture |
| `reglements` | **Relier à la banque** : pas de « réglé » sans mouvement 512 | Contrepartie trésorerie obligatoire |
| `immos` | Cession → écriture (675/775), dégressif fiable, A‑nouveaux | OD dotations équilibrée |
| `dossier` | Ouvrir K‑bis/Statuts, reprise A‑nouveaux | Dataset isolé |
| `infosociete` | Bouton K‑bis/Statuts, validations | Aucune écriture |
| `coffre` | Chiffrement local | Hors compta |
| `parametrage` | Mapping TVA appliqué à la saisie ; `c9` | Compte mouvementé non supprimable |

## Ordre d'exécution — AVANCEMENT
1. OK **Fondations** : T1 (addon21) -> T2 (22) -> T4 (23) -> T3 (24).
2. OK **Risque compta** : `tva` (T2), `reglements`<->`banque` (25), `immos` cession (26), `fec` inverse (34). *(rappro : pointage total + justification deja presents)*
3. OK **Fiabilisation/UX** : `compta` editeur filtre+lettrage (24/27), `tiers` edition (28), `editions` balance agee (29), `dash` tresorerie reelle (30).
4. OK/EN COURS **Fonctionnalites** : GED (31), mode client (32), messagerie (33) livres ; **OCR reel + IA en ligne** (reseau/cle API) et **e-reporting** restent hors perimetre hors-ligne.

**Etat : feuille de route traitee. Reste non faisable hors-ligne : OCR/IA en ligne reelle, e-reporting (a brancher quand une API sera disponible).**
