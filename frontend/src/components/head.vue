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
	height: 10vh;
	border-bottom: 2px solid #BC0002;
	background: #036280;
	justify-content: space-between;
	min-height: 50px;
}

header .logo {
	display: flex;
	height: 95%;
	width: 9%;
	border: 3px solid #BC0002;
	background: #ffffff;
	border-radius: 290px;
	margin-left: 2.5%;
}

header .logo_42 {
	display: flex;
	margin-left: 10%;
	height: 100%;
	width: 85%;
}

header .profile {
	display: flex;
	height: 100%;
	width: 18%;
	background: #D9D9D9;
	font-size: 100%;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: black;
}

header .box_img_profile {
	display: flex;
	width: 5.25%;
	height: 100%;
	margin-left: 65%;
}

header .img_profile {
	display: flex;
	width: 100%;
	height: 100%;
}

@media screen and (max-width: 1000px) {
	header .logo {
		display: flex;
		height: 95%;
		width: 80%;
	}

	header .profile {
		display: flex;
		width: 100%;
	}

	header .box_img_profile {
		display: flex;
		width: 60%;
	}
}

@media screen and (max-width: 500px) {
	header .box_img_profile {
		display: flex;
		width: 100%;
	}

	header .logo {
		display: flex;
		height: 90%;
		width: 100%;
	}

	.header {
		height: 7vh;
	}
}

</style>