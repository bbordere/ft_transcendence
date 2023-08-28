<template>
	<body>
		<Head v-if="!$route.fullPath.includes('auth') && $route.fullPath.length !== 1" :updateTimestamp="timestampRef"></Head>
		<notifications position="top center" group="notif-center" max="2"/>
		<notifications position="top right" group="friend"/>
		<router-view v-slot="{ Component }" appear>
			<transition name="grow-in" mode="out-in">
				<Component :key="$route.fullPath" :is="Component" @update="test"/>
			</transition>
		</router-view>

	</body>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import Head from './components/Head.vue';

const timestampRef = ref('me')

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
//   overflow: scroll;
}

body::-webkit-scrollbar{
	display: none;
}

@keyframes AnimationName {
  0% {
    background-position: calc(var(--d)/var(--sinus)) 0;
  }
}

.grow-in-enter-from,
.grow-in-leave-to {
	opacity: 0;
	transform: scale(0.3);
}

.grow-in-enter-active,
.grow-in-leave-active {
	transition: 0.2s ease-out;
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