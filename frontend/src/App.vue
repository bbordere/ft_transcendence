<script setup lang="ts">
import {ref} from 'vue'
import field from "@/components/field.vue"
import btn from "@/components/button.vue"
import inscription from "@/components/inscription.vue"

const showModal = ref(false)

function onClick() {
	connection.value = true
}

function display(input) {
	console.log('App.vue : ' + input)
}

function connection(input) {
	console.log("aled")
}

function backgroundColor() {
	
}

</script>

<template>

<body>
	<header>
		<img class="logo" alt="logo" src="./assets/img/logo.png">
	</header>
	<div class="connection">
		<div class= "co-42">
			<img class="logo42" src="./assets/img/42.png" alt="logo 42">
			<button class="btn42">42</button>
		</div>
		<div class= "co-email">
			<span class="text">connection</span>
			<form action="#">
				<field str="pseudo" @updateInput = "speudo => display(speudo)" />
				<field str="password" @updateInput = "password => display(password)" />
				<btn @updateInput = "co => connection(input)" />
			</form>
			<button id="show-modal" @click="showModal = true">Show Modal</button>
			<Teleport to="body">
				<inscription :show="showModal" @close="showModal = false" />
			</Teleport>
		</div>
	</div>
	<footer>
		<p class="copyright">copyright</p>
	</footer>
</body>

</template>

<style scoped>

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
  --d:10000px;
  background-color: #000;
  background: repeating-linear-gradient(35deg,	#c4e8f6e0,
												#9ccef2e0,
												#c4e8f6e0,
												#509ac9e0,
												#206fade0,
												#c4e8f6e0 var(--d));
  background-size: calc(var(--d)/var(--sinus)) 100%;
  animation: AnimationName 10s linear infinite reverse;
}

@keyframes AnimationName {
  0% {
    background-position: calc(var(--d)/var(--sinus)) 0;
  }
}

.connection{
	min-height: 350px;

	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;

}
.co-42{
	width:350px;
	height: 350px;

	padding: 40px 30px;

	background: inear-gradient(32deg,#03a8f4,#f441a6,#ffeb3b,#03a8f4);
	border-radius: 10px;
	box-shadow:  4px 4px 4px #474747,
             -4px -4px 4px #eaeaea;
}

.co-42 .logo42{
	height: 160x;
	width: 160px;

	display: block;
	margin-left: auto;
	margin-right: auto;
}

.co-email{
	width:550px;
	height: 400px;
	padding: 40px 30px;

	background: inear-gradient(32deg,#03a8f4,#f441a6,#ffeb3b,#03a8f4);
	border-radius: 10px;
	box-shadow:  4px 4px 4px #474747,
             -4px -4px 4px #eaeaea;
}

.co-email .text{
	font-size: 33px;
	font-weight: 600;
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-bottom: 35px;
	color: #595959;
}

header{
	position: absolute;
	width: 100vw;
	height: 80px;
	left: 0px;
	top: 0px;

	background: linear-gradient(35deg, #B4CFEC, #DDE1E7);	
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
	position: absolute;
	width: 100vw;
	height: 50px;
	bottom: 0px;

	background: linear-gradient(35deg, #B4CFEC, #DDE1E7);	
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

.btn42 {
	color: #595959;
	display: block;
	margin-left: auto;
	margin-right: auto;
	--border-radius: 25px;
	--border-width: 6px;
	appearance: none;
	position: relative;
	padding: 1em 2em;
	border: 0;
	background: none;
	font-family: "Roboto", Arial, "Segoe UI", sans-serif;
	font-size: 18px;
	font-weight: 500;
	color: #fff;
	z-index: 2;
}

.btn42::after {
	color: #595959;

	--m-i: linear-gradient(#000, #000);
	--m-o: content-box, padding-box;
	content: "";
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	padding: var(--border-width);
	border-radius: var(--border-radius);
	background-image: conic-gradient(
			#488cfb,
			#29dbbc,
			#ddf505,
			#ff9f0e,
			#e440bb,
			#655adc,
			#488cfb
		);
	-webkit-mask-image: var(--m-i), var(--m-i);
	mask-image: var(--m-i), var(--m-i);
	-webkit-mask-origin: var(--m-o);
	mask-origin: var(--m-o);
	-webkit-mask-clip: var(--m-o);
	mask-composite: exclude;
	-webkit-mask-composite: destination-out;
	filter: hue-rotate(0);
	animation: rotate-hue linear 500ms infinite;
	animation-play-state: paused;
}

.btn42,
.btn42:hover::after {
	color: #595959;

	animation-play-state: running;
}

@keyframes rotate-hue {
	to {
	filter: hue-rotate(1turn);
	}
}

.btn42::after {
	box-sizing: border-box;
}

.btn42:focus{
	color: black;
;

}


</style>
