<script lang="ts">
import router from '@/router';
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
		redirectToHome(){
			router.push('/home')
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
	<img class="logo" src="../assets/img/logoPinaColaPong2.png" @click="redirectToHome()" draggable="false">
	<router-link to="/profile" class="profile" draggable="false">
		<img class="img_profile" v-bind:src=avatar draggable="false">
		<div class="profile_name">
			<span class="name">{{ name }}</span>
		</div>
	</router-link>
</header>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Happy+Monkey&display=swap');

.header {
	font-family: 'Poppins', sans-serif;
	display: flex;
	height: 10vh;
	border-bottom: 2px solid #515151;
	/* background: #f7f4dd; */
	background: white;
	justify-content: space-between;
	align-items: center;
	min-height: 50px;
}

.logo {
	height: 90%;
	/* max-width: 20%; */
	/* min-width: 145px; */
	/* background-color: white; */
	/* border-radius: 290px; */
	/* border: 3px solid #515151; */
	/* padding-left: 10%; */
	margin-left: 0.8%;
	cursor: pointer	;
}
.name{
	z-index: 2;
}

.profile {
	display: flex;
	flex-direction: row;
	text-decoration: none;
	align-items: center;
	color: black;
	font-size: clamp(0.8125rem, 0.476rem + 1.0769vw, 1.25rem);
	font-weight: bold;
	max-width: 50%;
	height: 90%;
	/* background: pink; */
	border: 2px solid #515151;
	margin-right: 0.1%;
	border-radius: 27px;
	overflow: hidden;
	overflow-wrap: anywhere;
	position: relative;
	/* border-bottom-width: 0px; */
	/* border-radius: 50px; */
	/* width: 25%; */
}

/* .profile:hover{
	background-color: #d1e6eee0;
} */

.profile::before{
	content: "";
	z-index: 1;
	background-color: #a5d6e9e0;
	width: 0;
	height: 9vh;
	position: absolute;
	border-radius: 27px;
	top: 0.1%;
	/* left: 0; */
	transition: width 700ms ease-in-out;
	opacity: 50%;
}

.profile:hover::before {
	width: 100%;
	opacity: 50%;
	border-radius: 27px;
}

.img_profile{
	z-index: 1;

	height: 90%;
	padding-left: 5px;
	aspect-ratio: 1;
	border-radius:27px 27px 27px 27px;
}

.profile_name {
	width: 30vh;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>