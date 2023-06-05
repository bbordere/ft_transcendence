<script lang="ts">

import Image from '@/components/image.vue'
import ModalSettings from '@/components/ModalSettings.vue';
import BlueButton from './BlueButton.vue';
import router from '../router';

export default{
	components: {
		Image,
		ModalSettings,
		BlueButton
	},
	data(){
		return ({user: "", showModal: false});
	},
	methods: {
		logout(){
			router.push("/auth/logout");
		},
		getUser(){
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", {credentials: 'include'})
			.then(res => res.json())
			.then(data => {this.user = data;});
		}
	},
	beforeMount(){
        this.getUser();
    },
}

</script>

<template>
	<div class="card">
		<Image :path="user.pictureLink" ></Image>
		<div class="userInfos">
			<h1>{{ user.name }}</h1>
		</div>
		<div class="buttons">
			<Teleport to="body">
				<transition name="slide-fade" mode="out-in">
					<ModalSettings v-show="showModal" @close-modal="showModal = false" @updated="getUser"></ModalSettings>
				</transition>
			</Teleport>
			<BlueButton text="Parametres" icon="fa-solid fa-gear" @click="showModal = true"></BlueButton>
			<BlueButton text="Deconnection" icon="fa-solid fa-right-from-bracket" @click="logout"></BlueButton>
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
	width: 15%;
}

</style>
