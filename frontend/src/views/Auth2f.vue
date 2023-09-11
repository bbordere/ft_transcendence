<template>
	<div class="auth">
		<div class="auth-card">
			<h1 class="title">Double Authentification</h1>
			<div class="auth-container">
				<img v-if="generated === true" :src="getUrl()" :class="[blur  ? 'blur' : ' ']" @click="toggleBlur" class="img-2fa">
				<img v-else src="@/assets/img/lock.png" class="img-2fa">
				<div class="info-box">
					<BlueButton v-if="!generated" text="Activer" icon="fa-solid fa-check" class="card-button" @click="redirect({ path: '/auth/2fa/generate'})"/>

					<BlueButton v-else-if="activated === false" text="Activer" icon="fa-solid fa-check" class="card-button"
						@click="redirect({ path: '/auth/2fa/verif', query: { plan: 'on' }})"/>

					<BlueButton v-else-if="activated === true" text="Désactiver" icon="fa-solid fa-xmark" class="card-button"
						@click="redirect({ path:'/auth/2fa/off', query: { plan: 'off' }})"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

import { ref } from 'vue';
import BlueButton from '@/components/BlueButton.vue';
import router from '@/router';

export default{
    data() {
        return { user: Promise<any>, "activated": false, "generated": false, blur: ref(true), };
    },
    methods: {
        getStatus: async (vm: any) => {
            const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/2fa/completeStatus", { method: "get", credentials: "include" });
            const text = (await res.json());
            vm.activated = text["activated"];
            vm.generated = text["generated"];
        },
        getUser: async (vm: any) => {
            const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", { credentials: "include" });
            const user = await res.json();
            vm.user = user;
        },
        toggleBlur() {
            this.blur = !this.blur;
        },
		getUrl(){
			return ("http://" + import.meta.env.VITE_HOST + ":3000/auth/2fa/qrcode")
		},
		redirect(redirectObject: any){
			router.push(redirectObject);
		}
    },
    mounted() {
        this.getUser(this);
        this.getStatus(this);
    },
    components: { BlueButton }
}
</script>

<style>

.auth{
	height: 100%;
	display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
	/* background-color: rebeccapurple; */
}

.auth-card{
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 50px;
	justify-content: space-evenly;
	background-color: aliceblue;
	width: 60vw;
	height: 60vh;
}

.title{
	font-size: clamp(0.625rem, -0.2083rem + 2.6667vw, 1.375rem);
	/* font-family: 'Baloo Tamma', cursive;
	text-align: center;
	color: #FFFFFF;
	text-shadow: 0 1px 0 #CCCCCC, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
	color: #FFFFFF;
	width: 100%;
	font-size: 60px; */
}

.auth-container{
	display: flex;
	background-color: rgba(34, 158, 230, 0.103);
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 90%;
	height: 90%;
	border-radius: 60px;
	margin-bottom: 30px;
}

.card-button{
	font-size: clamp(0.625rem, 0.0694rem + 1.7778vw, 1.125rem);
	width: 50%;
	margin: 20%;
}

.info-box{
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	width: 50%;
	/* width: 30%; */
	/* margin-right: 10%; */
}

.img-2fa { 
    image-rendering: optimizeSpeed;             /* STOP SMOOTHING, GIVE ME SPEED  */
    image-rendering: -moz-crisp-edges;          /* Firefox                        */
    image-rendering: -o-crisp-edges;            /* Opera                          */
    image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
    image-rendering: pixelated;                 /* Universal support since 2021   */
    image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
    -ms-interpolation-mode: nearest-neighbor;   /* IE8+                           */
	transition: filter 0.5s ease-in-out;
	width: clamp(100px, 40%, 400px);
	margin-left: 30px;
	aspect-ratio: 1;
}

.qrcode{
	position: relative;
	display: inline-block;
}

.blur{
	filter: blur(10px);
	transition: filter 0.5s ease-in-out;
}

</style>