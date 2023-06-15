<template>
<header class="header">
	<router-link to="/" class="logo" ><img class="logo_42" src="../assets/img/logo.png" alt="logo 42"></router-link>
	<div class="profile_container">
		<router-link class="box_img_profile" to="/profile"><img class="img_profile" src="../assets/img/default_profile.jpg" alt="default profile img"></router-link>
		<router-link class="profile" to="/profile">Mon Profil</router-link>
	</div>
</header>
</template>

<style>

.profile_container {
	width: 25%;
	display: flex;
	flex-direction: row;
}

.header {
	display: flex;
	width: 100%;
	height: 10vh;
	border-bottom: 2px solid #BC0002;
	background: #036280;
	justify-content: space-between;
	min-height: 50px;
}

header .logo {
	display: flex;
	height: 95%;
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
	font-size: 100%;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: black;
}

header .box_img_profile {
	display: flex;
	justify-content: end;
	width: auto;
	height: 100%;

}

@media screen and (max-width: 750px) {
	.profile_container {
			width: 50%
	}
}

</style>