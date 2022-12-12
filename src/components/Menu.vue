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
  <b-navbar shadow>
    <template slot="brand">
      <b-navbar-item>
        <router-link to="/home">
          SOXEL v2.0
        </router-link>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item>
        <router-link to="/generate-bloctel">
          Générer une demande bloctel
        </router-link>
      </b-navbar-item>
      <b-navbar-item>
        <router-link to="/apply-bloctel">
          Intégrer une réponse bloctel
        </router-link>
      </b-navbar-item></template
    >

    <template slot="end" v-if="userName">
      <div style="height: 100%; display: flex;align-items: center">
        <b-navbar-item>
          <router-link to="/home">
            {{ userName }}
          </router-link>
        </b-navbar-item>
        <b-button
          @click="logout"
          icon-right="logout"
          type="is-primary is-small"
          :label="logoutLabel"
          @mouseover="logoutLabel = 'Se déconnecter'"
          @mouseout="logoutLabel = ''"
        >
        </b-button>
      </div>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Menu extends Vue {
  @Prop() userName: string;
  logoutLabel = "";

  mounted() {
    this.logoutLabel = "";
  }
  logout() {
    this.$buefy.dialog.confirm({
      message: "Êtes-vous certain de vouloir vous déconnecter ?",
      cancelText: "Annuler",
      confirmText: "Se déconnecter",
      onConfirm: () => this.$emit("logout"),
    });
  }
}
</script>

<style lang="less">
@import "../less/main";

.logo {
  height: 52px;
}

a.navbar-item:focus,
a.navbar-item:focus-within,
a.navbar-item:hover,
a.navbar-item.is-active,
.navbar-link:focus,
.navbar-link:focus-within,
.navbar-link:hover,
.navbar-link.is-active {
  color: black;
}

.navbar {
  .navbar-item {
    a {
      color: black;
    }
  }
}
.navbar-link:not(.is-arrowless)::after {
  border-color: @pelorous !important;
}

.buttons {
  margin-right: 10px;
}
.router-link-active {
  color: #7957d5 !important;
  font-weight: bolder;
}
</style>
