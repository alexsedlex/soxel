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
  <div id="app">
    <Menu />
    <router-view class="page-content" />
  </div>
</template>

<script lang="ts">
import Menu from "@/components/Menu.vue";
import "@mdi/font/css/materialdesignicons.css";

export default {
  name: "App",
  components: {
    Menu,
  },
};
</script>

<style lang="less">
@import "less/main";

body {
  background-color: @white;
  margin: 0px;
  height: 100%;
  overflow: hidden;
  overflow-x: hidden;
  width: 100vw;
}

html {
  height: 100%;
}

* {
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @gunmetal;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow-x: auto;
  padding: 20px;
}

.page-content {
  padding: 10px;
}
</style>
