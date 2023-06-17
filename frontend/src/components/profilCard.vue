<script lang="ts">

import Avatar from '@/components/Avatar.vue'
import ModalSettings from '@/components/ModalSettings.vue';
import BlueButton from './BlueButton.vue';
import router from '../router';
import { useNotification } from "@kyvg/vue3-notification";

export default{
	components: {
		Avatar,
		ModalSettings,
		BlueButton
	},
	props: ["editable", "username"],
	data(){
		return ({user: "", showModal: false, isMyPage: false});
	},
	methods: {
		logout(){
			router.push("/auth/logout");
		},
		getUser(){
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/" + this.username, {credentials: 'include'})
			.then(res => res.json())
			.then(data => {this.user = data;})
			.then(() => this.$emit('update', this.user.name));
		},
		isMe(){
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", {credentials: 'include'})
			.then(res => res.json())
			.then(res => {this.isMyPage = (res["name"] === this.user["name"])});
		},
		failure(){
			const notification = useNotification()
			notification.notify({
				title: "Erreur",
				text: "Mauvais format d'image !",
				type: 'error',
				group: 'notif-center'
			});
		}

	},
	beforeMount(){
		this.getUser();
		this.isMe();
    },
}

</script>

<template>
	<div class="card">
		<Avatar :editable="editable" :path="user.avatarLink" @updated="getUser" @failure="failure" ></Avatar>
		<div class="userInfos">
			<h1>{{ user.name }}</h1>
		</div>
		<div class="buttons">
			<Teleport to="body">
				<transition name="slide-fade" mode="out-in">
					<ModalSettings v-show="showModal" @close-modal="showModal = false" @updated="getUser"></ModalSettings>
				</transition>
			</Teleport>
			<div v-if="editable != 0"> 
				<BlueButton class="button-profile" text="Paramètres" icon="fa-solid fa-gear" @click="showModal = true"></BlueButton>
				<BlueButton class="button-profile"  text="Déconnection" icon="fa-solid fa-right-from-bracket" @click="logout"></BlueButton>
			</div>
			<div v-else-if="!isMyPage">
				<BlueButton text="Ajouter en ami " icon="fa-solid fa-user-group"></BlueButton>
			</div>
		</div>
	</div>

</template>

<style>
	.card{
		display: flex;
		justify-content: space-between;
		padding: 2%;
		align-items: center;
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

.button-profile{
	margin: 10px;
}

.buttons{
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 15%;
}

@media screen and (max-width: 950px) {
	
}

</style>
