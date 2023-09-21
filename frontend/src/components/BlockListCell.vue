<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';


export default defineComponent({
		props: ["block", "myId"],
	data() {
		return {
			friendUsername: "" as string,
		}
	},
	methods: {

		redirecToProfil(name: string) {
			router.push({path:'/profile', query: { user: name }});
		},

		getAvatarUrl(id: number) {
			return ("http://" + import.meta.env.VITE_HOST + ":3000/avatar/user/id/" + id.toString());
		},

		async unblockUser() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/user/block/unblock`,{
				credentials: 'include',
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: this.myId,
					unblockId: this.block,
				}),
			});
		},

		async friendInfo() {
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/id/' + this.block,{ 
				credentials: 'include'
			});
			const userData = await response.json();
			this.friendUsername = userData.name;
		},
	},

	async mounted() {
		await this.friendInfo();
	}
});

</script>

<template>
	<div class="box">
		<div class="img_user">
			<img class="img_user_profil" :src="getAvatarUrl(block)" @click="redirecToProfil(friendUsername)">
		</div>
		<div class="name">
			{{ friendUsername }}
		</div>
			<button v-on:click="unblockUser">UNBLOCK</button>
	</div>

</template>
<style>

</style>