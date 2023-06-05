<template>
<header class="header">
	<router-link to="/" class="logo" ><img class="logo_42" src="../assets/img/logo.png" alt="logo 42"></router-link>
	<router-link class="box_img_profile" to="/profile"><img class="img_profile" src="../assets/img/default_profile.jpg" alt="default profile img"></router-link>
	<router-link class="profile" to="/profile">Mon Profil</router-link>
</header>
</template>

<style>

.header {
	display: flex;
	width: 100%;
	height: 80px;
	border-bottom: 2px solid #BC0002;
	background: #036280;
	justify-content: space-between;
}

header .logo {
	display: flex;
	height: 95%;
	width: 9%;
	border: 3px solid #BC0002;
	background: #ffffff;
	border-radius: 290px;
	margin-left: 50px;
}

header .logo_42 {
	display: flex;
	margin-left: auto;
	height: 100%;
	width: 100%;
}

header .profile {
	display: flex;
	height: 100%;
	width: 18%;
	background: #D9D9D9;
	font-size: 150%;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	text-decoration: none;
	color: black;
}

header .box_img_profile {
	display: flex;
	width: 6%;
	height: 100%;
	margin-left: auto;
}

header .img_profile {
	display: flex;
	width: 100%;
	height: 100%;
}
</style>