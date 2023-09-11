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
	<div class="list_friend">
		<ProfilCell v-for="friend in friends" :profilObject="friend" :myid=sender></ProfilCell>
	</div>
</template>

<style>

.list_friend{

	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 90%;
}

</style>