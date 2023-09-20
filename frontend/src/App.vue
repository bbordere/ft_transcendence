<template>
	<body>
		<Head v-if="!$route.fullPath.includes('auth') && $route.fullPath.length !== 1" :updateTimestamp="timestampRef"></Head>
		<div v-if="displayModalInvite" class="invite_modal">
			<div class="invite_modal_content">
				Invitation de {{ senderName }}
				<div>
					<button>Accepter</button>
					<button>Refuser</button>
				</div>
			</div>
		</div>
		<div v-if="displayModalSend" class="invite_modal">
			EN ATTENTE
		</div>
		<notifications position="top center" group="notif-center" max="2"/>
		<notifications position="top right" group="friend"/>
		<router-view v-slot="{ Component }" appear>
			<transition name="grow-in" mode="out-in">
				<Component :key="$route.fullPath" :is="Component" @update="test" @socketReady="socketReady"/>
			</transition>
		</router-view>
	</body>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import Head from './components/Head.vue';
import { SocketService } from './services/SocketService';

const isSocketReady = ref(false);

const timestampRef = ref()

const displayModalInvite = ref(false)
const displayModalSend = ref(false)
const senderName = ref("");
// const displayModalInvite = ref(false)

function socketReady(){
	isSocketReady.value = true;
	SocketService.getInstance.on('displayInvite', (isSender: boolean, name: string) =>{
		console.log(name);
		senderName.value = name;
		const ref = isSender ? displayModalSend : displayModalInvite;
		ref.value = true;
		setTimeout(() =>{
			ref.value = false;
		}, 5000);
	})
}

function test(){
	timestampRef.value = Date.now();
}



</script>

<style scoped lang="scss">

@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

.anim-enter-from,
.anim-leave-to {
	opacity: 0;
}

.anim-enter-active,
.anim-leave-active {
	transition: opacity 0.3s ease-out;
}

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
//   --sinus:0.57357643635;
//   --d:50000px;
//   background-color: #000;
//   background: repeating-linear-gradient(35deg,	#c4e8f6e0,
// 												#9ccef2e0,
// 												#c4e8f6e0,
// 												#509ac9e0,
// 												#206fade0,
// 												#c4e8f6e0 var(--d));
//   background-size: calc(var(--d)/var(--sinus)) 100%;
//   animation: AnimationName 10s linear infinite reverse;
  overflow: scroll;

  background: linear-gradient(125deg, #c4e8f6e0, #509ac9e0, #2a8cd8e0,);
    background-size: 600% 600%;
    -webkit-animation: AnimationName 10s ease infinite;
    -moz-animation: AnimationName 10s ease infinite;
    -o-animation: AnimationName 10s ease infinite;
    animation: AnimationName 10s ease infinite;


}

// .css-selector {
//     background: linear-gradient(125deg, #f9c683, #ecead5, #8edae6);
//     background-size: 600% 600%;
//     -webkit-animation: AnimationName 27s ease infinite;
//     -moz-animation: AnimationName 27s ease infinite;
//     -o-animation: AnimationName 27s ease infinite;
//     animation: AnimationName 27s ease infinite;
// }
@-webkit-keyframes AnimationName {
    0%{background-position:0% 52%}
    50%{background-position:100% 49%}
    100%{background-position:0% 52%}
}
@-moz-keyframes AnimationName {
    0%{background-position:0% 52%}
    50%{background-position:100% 49%}
    100%{background-position:0% 52%}
}
@-o-keyframes AnimationName {
    0%{background-position:0% 52%}
    50%{background-position:100% 49%}
    100%{background-position:0% 52%}
}
@keyframes AnimationName {
    0%{background-position:0% 52%}
    50%{background-position:100% 49%}
    100%{background-position:0% 52%}
}


body::-webkit-scrollbar{
	display: none;
}

// @keyframes AnimationName {
//   0% {
//     background-position: calc(var(--d)/var(--sinus)) 0;
//   }
// }

.grow-in-enter-from{
	opacity: 0;
	transform: scale(0.3);
}

.grow-in-enter-active,
.grow-in-leave-active {
	transition: 0.2s ease-out;
}

.invite_modal{
	position: absolute;
	height: 10vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	z-index: 5;
}

.invite_modal_content{
	text-align: center;
	background: pink;
	border-radius: 10px;
	height: 100%;
}

</style>

<style>

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
	opacity: 0;
	transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
	transition: 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
	opacity: 0;
	transform: translateY(300px);
}

.slide-down-enter-active,
.slide-down-leave-active {
	transition: 0.3s ease-out;
}




.grow-out-enter-from,
.grow-out-leave-to {
	opacity: 0;
	transform: scale(1.5);
}

.grow-out-enter-active,
.grow-out-leave-active {
	transition: 0.3s ease-out;
}
</style>