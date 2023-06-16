<script setup lang="ts">

async function header_data() {
	const response = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", {credentials: 'include'});
	const text = await response.json();
	console.log(text);
	const avatar = text["avatarLink"];
	const name = text["name"];
}

</script>

<template>
<header class="header">
	<router-link to="/" class="logo" ><img class="logo_42" src="../assets/img/logo.png" alt="logo 42"></router-link>
	<div class="profile_container">
		<router-link class="box_img_profile" @click="header_data()" to="/profile"><img class="img_profile" :src="header_data()" alt="default profile img"></router-link>
		<router-link class="profile" to="/profile">Mon Profil</router-link>
	</div>
</header>
</template>

<style>

.profile_container {
	display: flex;
	flex-direction: row;
	flex: 0.18 1 auto
}

.header {
	display: flex;
	height: 10vh;
	border-bottom: 2px solid #BC0002;
	background: #036280;
	justify-content: space-between;
	min-height: 50px;
}

header .logo {
	display: flex;
	border: 3px solid #BC0002;
	background: #ffffff;
	border-radius: 290px;
	margin-left: 2.5%;
	justify-content: center;
}

header .logo_42 {
	display: flex;
	margin-left: 10%;
}

header .profile {
	display: flex;
	width: 100%;
	background: #D9D9D9;
	font-size: 1.7em;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: black;
}

header .box_img_profile {
	display: flex;
	justify-content: end;
}

</style>