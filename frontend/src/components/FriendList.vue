<script lang="ts">
import { defineComponent } from 'vue';
import ProfilCell from './ProfilCell.vue';

export default defineComponent({
	components: {
		ProfilCell
	},
	data() {
		return {
			friends: [],
			sender: -1 as number,
		};
	},

	async mounted() {
		this.sender = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json())['id'];
		const response = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/friend/list", { credentials: 'include' });
		this.friends = await response.json();
	},
})

</script>

<template>
	<ProfilCell class="FriendCase" v-for="friend in friends" :profilObject="friend" :myid=sender></ProfilCell>
</template>

<style>

.FriendCase {
	display: flex;
	width: 100%;
	height: 10%;
	border: 2px solid #000000;
	border-radius: 10px;
	padding: 5px;
	margin-bottom: 15px;
}

</style>