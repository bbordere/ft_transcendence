<script lang="ts">
import { defineComponent } from 'vue';

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
<style>
@import url('https://fonts.googleapis.com/css2?family=Happy+Monkey&display=swap');

.header {
	font-family: 'Happy Monkey', cursive;
	display: flex;
	height: 10vh;
	border-bottom: 2px solid #515151;
	background: #f7f4dd;
	justify-content: space-between;
	min-height: 50px;
}

.logo_42 {
	height: 9.4vh;
	background-color: white;
	border-radius: 290px;
	border: 3px solid #515151;
	padding-left: 10%;
	margin-left: 25%;
}

.profile {
	display: flex;
	flex-direction: row;
	text-decoration: none;
	align-items: center;
	color: black;
	font-size: 1.7em;
}

.img_profile{
	height: 100%;
	aspect-ratio: 1;
	border-radius:27px 0px 0px 27px;
}

.profile_name {
	width: 30vh;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-color: white;
}
</style>