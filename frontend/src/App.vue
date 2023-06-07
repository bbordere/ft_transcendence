<script setup lang="ts">

</script>

<template>

<body>
	<!-- <nav>
   	 <router-link to="/">Home</router-link> | <router-link to="/verif">Verif</router-link> | 
		<router-link to="/auth">Auth</router-link> | <router-link to="/profile">profil</router-link> | 
		<router-link to="/pong">pong</router-link>
  	</nav> -->
	<notifications position="top center" group="notif-center" max="2"/>
	<notifications position="top right" group="friend"/>
  	<main>
  	  <router-view />
  	</main>	
</body>

</template>

<style scoped lang="scss">

@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Poppins', sans-serif;
}

body {
	margin: -8px;
    position: absolute;
	height: 100vh;
	width: 100vw;
  --sinus:0.57357643635;
  --d:50000px;
  background-color: #000;
  background: repeating-linear-gradient(35deg,	#c4e8f6e0,
												#9ccef2e0,
												#c4e8f6e0,
												#509ac9e0,
												#206fade0,
												#c4e8f6e0 var(--d));
  background-size: calc(var(--d)/var(--sinus)) 100%;
  animation: AnimationName 10s linear infinite reverse;
  overflow: scroll;
}

body::-webkit-scrollbar{
	display: none;
}

@keyframes AnimationName {
  0% {
    background-position: calc(var(--d)/var(--sinus)) 0;
  }
}

header{
	z-index: 10000;
	position: absolute;
	width: 100vw;
	height: 80px;
	left: 0px;
	top: 0px;

	border-bottom: 2px solid black;
}

header .logo{
	box-sizing: border-box;

	width: 150px;
	height: 80px;
	left: 50px;
	display: block;
	margin-left: auto;
	margin-right: auto;

	border: 3px solid black;
	border-radius: 290px;
	box-shadow: -3px -3px 7px #ffffff73,
               2px 2px 5px rgba(94,104,121,0.288);
}

footer {
	z-index: 9999;
	position: absolute;
	width: 100vw;
	height: 50px;
	bottom: 0px;

	border-top: 2px solid black;
}

footer .copyright {
	display: block;
	margin-left: auto;
	margin-right: auto;

	font-family: 'Inter';
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	line-height: 24px;
	text-align: center;

	color: black;
}


.verif{
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}

nav {
	position: relative;
	z-index: 999999;
}

</style>
