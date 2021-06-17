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
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        SOXEL
      </b-navbar-item>
    </template>
    <template slot="start">
      
    </template>

    <template slot="end">
      Copyright Boudin Créole
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Menu extends Vue {}
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
  color: @pelorous !important;
}
.navbar-link:not(.is-arrowless)::after {
  border-color: @pelorous !important;
}

.buttons {
  margin-right: 10px;
}
</style>
