<script lang="ts">

import Avatar from '@/components/Avatar.vue'
import ModalSettings from '@/components/ModalSettings.vue';
import ChangeUsernameModal from './ChangeUsernameModal.vue';
import BlueButton from './BlueButton.vue';
import router from '../router';
import { useNotification } from "@kyvg/vue3-notification";
import Switch from './switch.vue';

export default{
	components: {
		Avatar,
		ModalSettings,
		BlueButton,
		ChangeUsernameModal,
		Switch,
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
		},
		updateNotif(){
				this.getUser();
				const notification = useNotification()
				notification.notify({
					title: "Nom d'utilisateur changé !",
					type: 'success',
					group: 'notif-center'
				});
			},
			alreadyExistNotif(){
				const notification = useNotification()
				notification.notify({
					title: "Erreur",
					text: "Ce nom d'utilisateur existe déjà !",
					type: 'error',
					group: 'notif-center'
				});
			},
			badFormatNotif(){
				const notification = useNotification()
				notification.notify({
					title: "Erreur",
					text: "Veuillez entrer un format valide !",
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
					<ChangeUsernameModal v-show="showModal" @close-modal="showModal = false"
											@updated="updateNotif" @already-exist="alreadyExistNotif"
											@bad-format="badFormatNotif">
					</ChangeUsernameModal>
				</transition>
			</Teleport>
			<div class="buttons-items" v-if="editable != 0"> 
				<BlueButton class="button-profile" text="Changer Nom " icon="fa-solid fa-pen" @click="showModal = true"></BlueButton>
				<div class="tfa">
						<div class="tfa-extra">
							<font-awesome-icon icon="fa-solid fa-lock"/>
							2FA
						</div>
						<Switch/>
				</div>
				<BlueButton class="button-profile"  text="Déconnection " icon="fa-solid fa-right-from-bracket" @click="logout"></BlueButton>
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
	width: 15%;
}

.tfa {
	background: rgb(34, 158, 230);
	border-radius: 10px;
	box-shadow: rgb(37, 18, 121) 0px 4px 0px 0px;
	padding: 10px;
	margin: 10px;
	display: flex;
	font-family: 'Poppins';
	font-weight: bold;
	color: white;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	font-size: 1em;
}

.tfa-extra{
	display: flex;
	gap: 30px;
	align-items: center;
}

@media (max-width: 500px) {
	.tfa-extra{
		display: none;
	}
}

.buttons-items {
	display: flex;
	flex-direction: column;
}

</style>
