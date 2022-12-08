<!--
  #%L
  Soxel
  %%
  Copyright (C) 2021 MorelProd
  %%
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
  #L%
  -->
<template>
  <b-steps
    v-model="activeStep"
    :animated="true"
    :rounded="true"
    :clickable="true"
    :has-navigation="false"
  >
    <b-step-item step="1" label="Fichier Base" :clickable="true">
      <div class="content">
        <h1 class="title has-text-centered">Fichier Base</h1>

        <b-message type="is-info">
          Le fichier "base" correspond au listing complet avec nom, numéro de
          téléphone etc. <br />
          La colonne "L" doit être un identifiant bloctel.
        </b-message>

        <b-upload v-model="baseFile" class="file-label" accept=".ods" multiple>
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label">
              Renseignez le fichier Excel Base (format ods)</span
            >
          </span>
          <span class="file-name" v-if="baseFile.length > 0">
            {{ baseFile[0].name }}
          </span>
        </b-upload>
      </div>
    </b-step-item>

    <b-step-item
      step="2"
      label="Réponse Bloctel"
      :clickable="baseFile.length > 0"
    >
      <div class="content">
        <h1 class="title has-text-centered">Réponse Bloctel</h1>

        <b-message type="is-info">
          La réponse bloctel doit avoir 3 colonnes : le numéro, l'identifiant,
          et la réponse bloctel.
        </b-message>

        <b-upload
          v-model="answerFile"
          class="file-label"
          accept=".ods"
          multiple
        >
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label">
              Renseignez le fichier Bloctel (csv qui commence par
              "retour_")</span
            >
          </span>
          <span class="file-name" v-if="answerFile.length > 0">
            {{ answerFile[0].name }}
          </span>
        </b-upload>
      </div>
    </b-step-item>

    <b-step-item
      step="3"
      label="Résultat"
      :clickable="baseFile.length > 0 && answerFile.length > 0"
    >
      <div class="content">
        <h1 class="title has-text-centered">Résultat</h1>

        <b-loading v-model="isCalculating" />
        <span v-if="isCalculating">
          Calcul en cours...
          <br />
          <span v-if="infoCounter >= 0"> </span>
          <br />
          <b-message type="is-info">
            {{ randomInfo }}
          </b-message>
        </span>
        <div v-else-if="error">
          <b-message type="is-danger">{{ error }}</b-message>
        </div>
        <div v-else>
          <b-message type="is-success"
            >Calcul terminé ! <br />
            <span v-html="success" />
          </b-message>

          <b-message type="is-warning">Merci bisous merci ❤️</b-message>
        </div>
      </div>
    </b-step-item>
  </b-steps>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { parseAndMapCSV } from "../services/SolexMapper";

@Component({})
export default class SoxelBloctelApplierVue extends Vue {
  activeStep = 0;
  baseFile: File[] = [];
  answerFile: File[] = [];
  isCalculating = false;
  error = "";
  success = "";
  infoCounter = 1;
  randomInfo = "";

  @Watch("baseFile")
  baseFileChanged(): void {
    if (this.baseFile.length > 0) {
      this.activeStep = 1;
    }
  }

  @Watch("answerFile")
  anwserFileChanged(): void {
    if (this.answerFile.length > 0) {
      this.launchCalculation();
      this.activeStep = 2;
    }
  }

  launchCalculation(): void {
    this.isCalculating = true;
    this.randomInfoUpdate();
    parseAndMapCSV(
      this.baseFile,
      this.answerFile,
      (error: string, success: string) => {
        this.error = error;
        this.success = success;
        this.isCalculating = false;
      }
    );
  }

  randomInfoUpdate(): void {
    this.refreshRandomInfo();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    if (this.isCalculating) {
      setTimeout(() => {
        if (that.isCalculating) {
          that.randomInfoUpdate();
        }
      }, 5000);
    }
  }

  refreshRandomInfo(): void {
    const info = [
      "l'Everest gagne 4 mm de hauteur chaque année",
      "le Canada a plus de lacs que le reste du monde combiné",
      "bien qu'elle s'étende sur 5 fuseaux horaires, la Chine utilise l'heure de Pékin",
      "une ville du Texas s'appelle Ding Dong",
      "taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu est la colline au nom le plus long",
      "pluton est plus petite que la Russie",
      "50% de l'ADN humain est similaire à celui d'une banane",
      "Le cœur d'une baleine bleue est si grand qu'un homme peut nager dans ses artères",
      "Certaines tortues peuvent respirer par l'anus",
      "Il y a 1,6 million de fourmis pour chaque être humain",
      "la Reine est propriétaire de tous les esturgeons, les baleines et les dauphins dans les eaux situées à 3 miles de la Grande-Bretagne",
    ];
    this.randomInfo =
      "Savais-tu que " +
      info[Math.round(Math.random() * (info.length - 1))] +
      "?";
  }
}
</script>

<style scoped lang="less">
@import "../less/main";

.content {
  margin: auto;
  width: 700px;
}
</style>
