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
  <div class="home">
    <b>Bienvenue sur Soxel !</b><br />
    Quelle action souhaitez-vous réaliser ?

    <br /><br />
    <section class="hero">
      <router-link to="/generate-bloctel">
        <b-button type="is-info">
          Générer une demande bloctel
        </b-button>
      </router-link>

      <div style="padding-top: 20px" />
      <br />

      <router-link to="/apply-bloctel">
        <b-button type="is-info">
          Intégrer une réponse bloctel
        </b-button>
      </router-link>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class HomeVue extends Vue {}
</script>

<style scoped lang="less">
@import "../less/main";
.home {
  padding-top: 20px;
  text-align: center;
  width: 100%;
}
</style>
