<script lang="ts">

import Image from '@/components/image.vue'
import Modal from '@/components/Modal.vue';
import router from '../router';

export default{
	components: {
		Image,
		Modal,
	},
	props: ['user'],
	data(){
		return ({showModal: false});
	},
	methods: {
		logout(){
			router.push("/auth/logout");
		}
	}
}

</script>

<template>
	<div class="card">
		<Image :path="this.user.pictureLink" ></Image>
		<div class="userInfos">
			<h1>{{ this.user.name }}</h1>
		</div>
		<div class="buttons">
			<Teleport to="body">
				<transition name="slide-fade" mode="out-in">
					<Modal v-show="showModal" @close-modal="showModal = false"></Modal>
				</transition>
			</Teleport>

			<button class="card-button" @click="showModal = true"><font-awesome-icon icon="fa-solid fa-gear"/> Settings</button>
			<button class="card-button" @click="logout"><font-awesome-icon icon="fa-solid fa-right-from-bracket"/> Logout</button>
		</div>
	</div>

</template>

<style>
	.card{
		display: flex;
		justify-content: space-between;
		padding: 2%;
		align-items: center;
		align-content: center;
		background-color: aliceblue;
		flex-direction: row;
		border-radius: 50px;
	}

	.buttons{
		display: flex;
		flex-direction: column;
	}

	.slide-fade-default-button {
	float: right;
}

.slide-fade-enter-from {
	opacity: 0;
}

.slide-fade-leave-to {
	opacity: 0;
}

.slide-fade-enter-from .modal-container,
.slide-fade-leave-to .modal-container {
	-webkit-transform: scale(1.5);
	transform: scale(1.5);
}

.buttons{
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 250px;
}

.card-button{
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

</style>
