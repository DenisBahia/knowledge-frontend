<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header title="Base de Conhecimento" 
		:hideToggle="!user"
		:hideUserDropDown="!user" />
		<Menu v-if="user" />
		<Loading v-if="validatingToken" />
		<Content v-else />
		<Footer />
	</div>
</template>

<script>
import {mapState} from "vuex"
 //@ = /src
import Header from "@/components/template/header"
import Menu from "@/components/template/menu"
import Footer from "@/components/template/footer"
import Content from "@/components/template/content"
import Loading from "@/components/template/loading"
import axios from "axios"
import {baseApiUrl, userKey} from "@/global"

export default {
	name: "App",
	components: {Header, Menu, Content, Footer, Loading},
	computed: mapState(["isMenuVisible", "user"]),
	data: function(){
		return {
			validatingToken: true
		}
	},
	methods: {
		async validateToken() {

			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)

			this.$store.commit("setUser", null)

			if (!userData){
				this.validatingToken = false
				return this.$router.push({name: "auth"})
			} 

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			if (res.data){
				this.$store.commit("setUser", userData)
				if (this.$mq === "xs" || this.$mq === "sm"){
					this.$store.commit("toggleMenu", false)
				}
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({name: "auth"})
			}

			this.validatingToken = false

		}
	},
	created() {
		this.validateToken()
	}
}
</script>

<style>
	* {
		font-family: "Lato";

	}

	body {
		margin: 0;

	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: antialiased;

		height: 100vh;
		display: grid;
		grid-template-rows: 60px 1fr 60px;
		grid-template-columns: 300px 1fr;
		grid-template-areas: 
			"header header"
			"menu content"
			"menu footer"
	}

	#app.hide-menu {
		grid-template-areas: 
			"header header"
			"content content"
			"footer footer"
	}
</style>