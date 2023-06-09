<script setup>

import {ref} from "vue"
import inscription from "@/components/inscription.vue"
import { useNotification } from "@kyvg/vue3-notification";
import router from '../router'

const email = ref('')
const password = ref('')
const showModal = ref(false)
const status = ref('')


async function login(){
	const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/login",
	{
		credentials: 'include',
		method: 'post',
		mode: "cors",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email.value,
			password: password.value

		})
	})

	switch (res.status) {
		case 406:{
			const notification = useNotification()
			console.log("TEST");
			notification.notify({
				title: "Utilisateur Introuvable !",
				type: 'error',
				group: 'notif-center'
			});
			break;
		}
		case 401:{
			const notification = useNotification()
			console.log("TEST");
			notification.notify({
				title: "Mauvais mot de passe !",
				type: 'error',
				group: 'notif-center'
			});
			break;
		}
		case 201:{
			router.push('/');
			break;
		}
		case 207:{
			router.push({path:'/auth/2fa/verif', query: { plan: 'verify' }});
			break;
		}
	}
}

</script>

<template>

<div class="connection">
	<div class= "co-42">
		<img class="logo42" src="../assets/img/42.png" alt="logo 42">
		<button @click="$redirect('/auth/42/login')" type="button" class="btn42">Login</button>
		

	</div>
	<div class= "co-email">
		<span class="text">connection</span>
		<div class="form">
			<div class="field">
				<input type="email" id="email" placeholder="@ email" v-model="email" />
			</div>
			<div class="field">
				<input type="password" placeholder="mot de passe" v-model="password" />
			</div>
			<button @click="login">connection</button>
		</div>
		<div class="inscription">
			<button id="show-modal" @click="showModal = true">Inscription</button>
		</div>
		<Teleport to="body">
			<inscription :show="showModal" @close="showModal = false" />
		</Teleport>
		{{status}}
	</div>
</div>

</template>

<style scoped>

.connection {
	min-height: 350px;

	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;

}
.co-42 {
	width:350px;
	height: 350px;

	padding: 40px 30px;

	background: inear-gradient(32deg,#03a8f4,#f441a6,#ffeb3b,#03a8f4);
	border-radius: 10px;
	box-shadow:  4px 4px 10px #474747,
             -4px -4px 10px #eaeaea;
}

.co-42 .logo42 {
	height: 160x;
	width: 160px;

	display: block;
	margin-left: auto;
	margin-right: auto;
}

.co-email {
	display: flex;
	flex-direction: column;
	width:450px;
	height: auto;
	padding: 40px 30px;
	gap: 20px;

	border-radius: 10px;
	box-shadow:  4px 4px 4px #474747,
             -4px -4px 4px #eaeaea;
}

.co-email .text {
	font-size: 33px;
	font-weight: 600;
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-bottom: 35px;
	color: #595959;
}

.btn42 {
	color: #595959;
	display: block;
	margin-top: 20px;
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

.btn42:focus {
	color: black;
;

}

.form button {
	margin: 15px 0;
	width: 100%;
	height: 50px;
	font-size: 18px;
	line-height: 50px;
	font-weight: 600;
	background: #dde1e7;
	border-radius: 25px;
	border: none;
	outline: none;
	cursor: pointer;
	color: #595959;
	box-shadow:  4px 4px 4px #616161,
             -4px -4px 4px #eaeaea;
}
.form button:focus {
	color: #3498db;
	box-shadow:  4px 4px 4px #606060,
             -4px -4px 4px #c9c9c9;
}

.form {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: center;
	align-content: center;
	gap: 20px;
}

.form .field input{ 
	padding-left: 25px;
	padding-right: 25px;
	height: 50px;
	width: 300px;
	outline: none;
	border: none;
	font-size: 18px;
	background: #dde1e7;
	color: #595959;
	border-radius: 25px;
	box-shadow: inset 2px 2px 5px #BABECC,
				inset -5px -5px 10px #ffffff73;
}
.field input:focus{
	box-shadow: inset 1px 1px 2px #BABECC,
				inset -1px -1px 2px #ffffff73;
}
.field span {
	position: absolute;
	color: #595959;
	width: 50px;
	line-height: 50px;
}
.field label {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 25px;
	pointer-events: none;
	color: #666666;
}

.field button {
	margin: 15px 0;
	width: 100%;
	height: 50px;
	font-size: 18px;
	line-height: 50px;
	font-weight: 600;
	background: #dde1e7;
	border-radius: 25px;
	border: none;
	outline: none;
	cursor: pointer;
	color: #595959;
	box-shadow:  4px 4px 4px #616161,
             -4px -4px 4px #eaeaea;
}
.field button:focus {
	color: #3498db;
	box-shadow:  4px 4px 4px #606060,
             -4px -4px 4px #c9c9c9;
}

</style>

