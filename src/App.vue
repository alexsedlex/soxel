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
    <Menu :userName="userName" @logout="logout" />
    <router-view class="page-content" v-if="loginSuccess && !loggingIn" />
    <b-message type="is-danger" v-if="!loginSuccess && !loggingIn">
      Merci de vous identifier pour pouvoir accéder à Soxel. <br />
      Pas encore client ? Contactez-nous sur
      <a href="mailto:lesmorels@googlegroups.com">par mail pour vous abonner</a>
    </b-message>
  </div>
</template>

<script lang="ts">
import Menu from "@/components/Menu.vue";
import "@mdi/font/css/materialdesignicons.css";
import { sha256 } from "js-sha256";

const clientsHashes = [
  "a7309c942c042b99afe6a172670e8ce9b8c5d57b5d4008f221bbd41ca455ad61",
  "5ceae8d2a8d34628bc35999f6d283ef9343368439d65961b16eb83c2ca039978",
];
const clientsNames = {
  a7309c942c042b99afe6a172670e8ce9b8c5d57b5d4008f221bbd41ca455ad61:
    "Soline CTBF",
  "5ceae8d2a8d34628bc35999f6d283ef9343368439d65961b16eb83c2ca039978":
    "Florella AMHF",
};
export default {
  name: "App",
  components: {
    Menu,
  },
  data() {
    return {
      loggingIn: true,
      loginSuccess: false,
      userName: "",
    };
  },

  mounted() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.askForPasswordIfNeeded();
  },
  methods: {
    logout() {
      localStorage.setItem("lpwd", "");
      localStorage.setItem("lpwv", "");
      localStorage.setItem("lpwn", "");

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.userName = "";

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.loggingIn = true;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.loginSuccess = false;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.askForPasswordIfNeeded();
    },
    askForPasswordIfNeeded() {
      const lastPwdCheckSt = localStorage.getItem("lpwd");
      const lastPwdValue = localStorage.getItem("lpwv");
      let lastPwdCheck = undefined;
      if (lastPwdCheckSt) {
        lastPwdCheck = new Date();
        lastPwdCheck.setTime(parseInt(lastPwdCheckSt));
      }
      if (
        !lastPwdValue ||
        !lastPwdCheck ||
        new Date().getTime() - lastPwdCheck.getTime() > 1000 * 60 * 24 * 7 * 4
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.loggingIn = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$buefy.dialog.prompt({
          message: `Veuillez indiquer votre identifiant Soxel (10 caractères)`,
          inputAttrs: {
            placeholder: "e.g. MORA-44000",
            minlength: 10,
            maxlength: 10,
          },
          confirmText: "Valider",
          cancelText: "Annuler",
          trapFocus: true,
          onConfirm: (value: string) => {
            this.performLogin(value, false);
          },
        });
      } else if (lastPwdValue) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.loggingIn = false;
        this.performLogin(lastPwdValue, true);
      }
    },
    performLogin(value: string, hashed: boolean) {
      const actualPwd = hashed ? value : sha256(value);
      if (clientsHashes.indexOf(actualPwd) > -1) {
        localStorage.setItem("lpwd", "" + new Date().getTime());
        localStorage.setItem("lpwv", actualPwd);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const name = clientsNames[actualPwd];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.loginSuccess = true;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.userName = name;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$buefy.toast.open({
          type: "is-success",
          message: `Bienvue sur Soxel ${name} ! Vous nous aviez manqué`,
        });
      } else {
        console.error("unknown : ", actualPwd);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.loginSuccess = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$buefy.toast.open({
          type: "is-danger",
          message: `Identifiant Soxel inconnu ou expiré, veuillez contacter le service technique`,
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$buefy.dialog.prompt({
          message: `Veuillez indiquer votre identifiant Soxel (10 caractères)`,
          inputAttrs: {
            placeholder: "e.g. MORA-44000",
            minlength: 10,
            maxlength: 10,
          },
          cancelText: "Annuler",
          confirmText: "Valider",
          trapFocus: true,
          onConfirm: (value: string) => {
            this.performLogin(value, false);
          },
        });
      }
    },
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
