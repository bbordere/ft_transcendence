<template>
	<div @click.stop>
		<button class="toggle_menu_button" @click="toggle"><font-awesome-icon icon="fa-solid fa-gear" /></button>
	</div>
	<Transition name="fade" mode="out-in">
		<div v-show="showMenu" class="menu_content" @click.stop>
			<button class="button_menu_channel" type="button" @click="$emit('quitChannel')">Quitter le channel</button>
			<button class="button_menu_channel" v-if="isAdmin" type="button" @click="$emit('displayChannelOption', 'unban')">Débannir</button>
			<button class="button_menu_channel" v-if="isAdmin" type="button" @click="$emit('displayChannelOption', 'add_admin')">Ajouter Admin</button>
			<button class="button_menu_channel" v-if="isAdmin" type="button" @click="$emit('displayChannelOption', 'remove_admin')">Supprimer Admin</button>
			<button class="button_menu_channel" v-if="isAdmin" type="button" @click="$emit('displayChannelOption', 'add_password')">Ajouter mot de passe</button>
			<button class="button_menu_channel" v-if="isAdmin && isProtected" type="button" @click="$emit('removePassword')">Supprimer mot de passe</button>	
		</div>
	</Transition>
</template>
  
<script lang="ts">
	export default {
		props: ['showMenu', 'isProtected', 'isAdmin'],
	data () {
		return {
		active: false
		}
	},
	methods: {
		toggle () {
				this.$emit('openMenu');
				console.log(this.showMenu);
			}
		}
	}
</script>

<style>

.toggle_menu_button{
	margin: 15px;
	color: black;
	background-color: white;
	border: none;
	border-radius: 20px;
	/* border: none; */
	cursor: pointer;
	font-size: clamp(1rem, 0.4231rem + 1.8462vw, 1.75rem);
}

.toggle_menu_button:hover {
	background-color: #d4eefd;
}

.toggle_menu_button:focus {
	background-color: #d4eefd;
}

.menu_content{
	position: absolute;
	display: flex;
	flex-direction: column;
	right: 0;
	top: 40px;
	/* background: pink; */
	border-radius: 20px;
	border: #515151 1px solid;
	padding: 10px;
	overflow: hidden;
	gap: 6px;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease-out;
}

.button_menu_channel{
	background-color: #d4eefd;
	border: none;
	cursor: pointer;
	border-radius: 10px;
	font-weight: bold;
}

.button_menu_channel:hover{
	background-color: #9fcde7;
}

</style>