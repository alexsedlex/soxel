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

        <b-upload v-model="baseFile" class="file-label" accept=".ods" multiple>
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label"> Renseignez le fichier Excel Base</span>
          </span>
          <span class="file-name" v-if="baseFile.length > 0">
            {{ baseFile[0].name }}
          </span>
        </b-upload>

        <b-message type="is-info">
          Le fichier "base" correspond au listing complet avec nom, numéro de
          téléphone etc. La colonne "L" doit être un identifant bloctel.
        </b-message>
      </div>
    </b-step-item>

    <b-step-item
      step="2"
      label="Réponse Bloctel"
      :clickable="baseFile.length > 0"
    >
      <div class="content">
        <h1 class="title has-text-centered">Réponse Bloctel</h1>

        <b-upload
          v-model="answerFile"
          class="file-label"
          accept=".ods"
          multiple
        >
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label"> Renseignez le fichier Bloctel</span>
          </span>
          <span class="file-name" v-if="answerFile.length > 0">
            {{ answerFile[0].name }}
          </span>
        </b-upload>

        <b-message type="is-info">
          La réponse bloctel doit avoir 3 colonnes : le numéro, l'identifiant,
          et la réponse bloctel.
        </b-message>
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
          Calcul en cours, ce service vous êtes offert par votre dévoué boudin
          créole...</span
        >
        <div v-else-if="error">
          <b-message type="is-danger">{{ error }}</b-message>
        </div>
        <div v-else>
          <b-message type="is-success"
            >Calcul terminé ! <br />
            <span v-html="success" />
          </b-message>

          <b-message type="is-warning">Merci bisous merci</b-message>
        </div>
      </div>
    </b-step-item>
  </b-steps>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import parseAndMap from "../services/SolexMapper";

@Component({})
export default class SoxelMapperVue extends Vue {
  activeStep = 0;
  baseFile: File[] = [];
  answerFile: File[] = [];
  isCalculating = false;
  error = "";
  success = "";

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
    parseAndMap(this.baseFile, this.answerFile, (error, success) => {
      this.error = error;
      this.success = success;
      this.isCalculating = false;
    });
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
