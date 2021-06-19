/*-
 * #%L
 * Soxel
 * %%
 * Copyright (C)  2021 Morel prod
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * #L%
 */

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import SoxelBloctelApplierVue from "@/views/SoxelBloctelApplierVue.vue";
import SoxelBloctelGeneratorVue from "@/views/SoxelBloctelGeneratorVue.vue";
import HomeView from "@/views/HomeView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home2",
    component: HomeView,
  },
  {
    path: "/home",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/apply-bloctel",
    name: "SoxelMapperApply",
    component: SoxelBloctelApplierVue,
  },
  {
    path: "/generate-bloctel",
    name: "SoxelMapperGenerator",
    component: SoxelBloctelGeneratorVue,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
