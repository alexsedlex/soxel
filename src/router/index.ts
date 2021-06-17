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

import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import SoxelMapperVue from "@/views/SoxelMapperVue.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "SoxelMapper",
    component: SoxelMapperVue
  },
];

const router = new VueRouter({
  routes
})

export default router
