<template>
	<!-- <img src="@/../../backend/qrcode/bastien.bordereau@gmail.com.png"> -->
	<div class="auth">
		<div class="auth-card">
			<div class="title">2FA</div>
			<div class="auth-container">
				<img v-if="generated === true" src="http://localhost:3000/auth/2fa/qrcode" class="code" :class="[blur  ? 'blur' : ' ']" @click="toggleBlur">
				<img v-else src="@/assets/img/lock.png" class="code">
				<div class="info-box">
					<button class="card-button" v-if="!generated" @click="generate2fa">ACTIVATE</button>
					<button class="card-button" v-else-if="activated === false">ENABLE</button>
					<button class="card-button" v-else>DISABLE</button>
				</div>
				<!-- <img src="@/../../backend/qrcode/bastien.bordereau@gmail.com.png" class="code"> -->
			</div>
			<div v-if="generated === true" class="message">
				This code is strictly personal. Do not share it !
			</div>
		</div>
	</div>
</template>

<script lang="ts">

import { ref } from 'vue';
import router from '@/router';

	export default{
		data(){
			return {user: Promise<any>, "activated": false, "generated": false, blur: ref(true), path: ""};
		},
		methods:{
			getStatus: async(vm: any) => {
				const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/2fa/completeStatus", {method: "get", credentials: "include"});
				const text = (await res.json());
				vm.activated = text["activated"];
				vm.generated = text["generated"];
			},
			getUser: async(vm: any) => {
				const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", {credentials: 'include'});
				const user = await res.json();
				vm.user = user;
			},

			toggleBlur(){
				this.blur = !this.blur;
			},

			generate2fa(){
				router.push('/auth/2fa/generate')
			},
		},
		async mounted(){
			await this.getUser(this);
			await this.getStatus(this);
			this.path = "../../../../backend/qrcode/" + this.user.email + ".png";
			console.log("GENERATED = " + this.generated);
			console.log("ACTIVATED = " + this.activated);
			console.log("PATH: " + this.path);
		}
	}
</script>

<style>

.auth{
	margin-top: 3%;
	display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
}

.auth-card{
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 50px;
	justify-content: space-evenly;
	background-color: aliceblue;
	width: 50vw;
	height: 50vh;
}

.title{
	font-family: 'Baloo Tamma', cursive;
	text-align: center;
	color: #FFFFFF;
	text-shadow: 0 1px 0 #CCCCCC, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
	color: #FFFFFF;
	width: 100%;
	font-size: 60px;
}

.auth-container{
	display: flex;
	background-color: rgb(217, 226, 233);
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 80%;
	height: 80%;
	border-radius: 60px;
	margin-bottom: 30px;
}

.info-box{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
}

.code{
	width: 50%;
	margin-left: 30px;
	height: 70%;
}

card-button{
	position: relative;
	background-color: rgb(34, 158, 230);
	border-radius: 10px;
	box-shadow: rgb(37, 18, 121) 0px 4px 0px 0px;
	padding: 15px;
	background-repeat: no-repeat;
	box-sizing: border-box;
	width: 154px;
	height: 49px;
	color: #fff;
	border: none;
	font-size: 20px;
	transition: all .3s ease-in-out;
	overflow: hidden;
	margin-top: 15px;
	margin-bottom: 15px;
	cursor: pointer;

}


.card-button::before{
	content: "";
	background-color: rgb(255, 255, 255);
	width: 0;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	transition: width 700ms ease-in-out;
	display: inline-block;
	opacity: 50%;
}

.card-button:hover::before {
	width: 100%;
	opacity: 50%;
}

img { 
    image-rendering: optimizeSpeed;             /* STOP SMOOTHING, GIVE ME SPEED  */
    image-rendering: -moz-crisp-edges;          /* Firefox                        */
    image-rendering: -o-crisp-edges;            /* Opera                          */
    image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
    image-rendering: pixelated;                 /* Universal support since 2021   */
    image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
    -ms-interpolation-mode: nearest-neighbor;   /* IE8+                           */
	transition: filter 0.5s ease-in-out;

}

.qrcode{
	position: relative;
	display: inline-block;
}

.blur{
	filter: blur(10px);
	/* filter: opacity(0%); */
	transition: filter 0.5s ease-in-out;
}

</style>