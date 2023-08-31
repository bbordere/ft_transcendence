<script lang="ts">
import { defineComponent } from 'vue';
import '../assets/css/head.css';

export default defineComponent({

	data() {
		return {
			name: '' as string, avatar: '' as string,
		};
	},

	props: ["updateTimestamp"],

	methods: {
		getInfos(){
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", { credentials: 'include' })
			.then(res => res.json())
			.then((data) => {
				this.name = data["name"];
				this.avatar = data["avatarLink"];
			})
		},
	},

	watch: {
		updateTimestamp() {
			this.getInfos();
		}
	},

	mounted() {
		this.getInfos();
	},
})
</script>

<template>
<header class="header">
	<router-link to="/">
		<img class="logo_42" src="../assets/img/logo.png" alt="logo 42">
	</router-link>
	<router-link to="/profile" class="profile">
		<img class="img_profile" v-bind:src=avatar alt="default profile img">
		<div class="profile_name">
			<span>{{ name }}</span>
		</div>
	</router-link>
</header>
</template>