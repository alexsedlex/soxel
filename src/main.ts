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

document.documentElement.style
.setProperty('$primary', 'yellow');

import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'



Vue.use(Buefy)

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
