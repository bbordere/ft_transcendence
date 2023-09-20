<script lang="ts">

import { useNotification } from "@kyvg/vue3-notification";

export default {
	props: {
		show: Boolean
	},
	data() {
		return {
			username: '' as string,
			sender: -1 as number,
			textNotif: '' as string,
		}
	},
	methods: {
		async addUser() {
			this.sender = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json())['id'];
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/friend/add',{
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.username,
					sender: this.sender,
				})
			})
			const ret = await response.json();
			if (ret.length() == 0)
				this.addFriendNotif("Demande d'ami envoyé", "sucess");
			else
				this.addFriendNotif(ret["datawefw"], "error");
		},

		addFriendNotif (text: string, status: string) {
			const notification = useNotification()
			notification.notify({
				title: text,
				text: text,
				type: status,
				group: 'notif-center'
			});
		}
	}
}
</script>

<!-- getInfos(){
	fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", { credentials: 'include' })
	.then(res => res.json())
	.then((data) => {
		this.name = data["name"];
		this.avatar = data["avatarLink"];
	})
}, -->

<template>
	<Transition name="slide-fade" mode="out-in">
	<div v-if="show" class="modal_overlay_friend" @click="$emit('close')">
		<div class="modal_friend" @click.stop>
				<div class="addami">
					Nom de l'ami
				</div>
				<div class="non">
					<input class="entry_friend" type="text" placeholder="Username" v-model="username">
					<button v-on:click="addUser(); $emit('close')">Ajouter</button>
				</div>
		</div>
	</div>
	</Transition>
</template>

<style scoped>

.non {
	display: flex;
	margin-top: 5%;
	width: 100%;
	height: 40%;
	justify-content: center;
	align-items: center;
	gap: 15px;
	font-size: larger;
}
.entry_friend {
	display: flex;
	border-radius: 20px;
	height: 50%;
	width: 50%;
	outline: none;
	border: none;
	text-align: center;
	font-size: larger;
}

.non button:hover {
	background-color: rgb(182, 227, 238);
}
.non button {
	font-size: larger;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50%;
	width: 25%;
	background-color: #036280;;
	border: 1px solid #000000;
	border-radius: 20px;
}
.addami {
	display: flex;
	height: 15%;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-size: 2em;
	padding-top: 5%;
}

.modal_overlay_friend {
	position: fixed;
	display: flex;
	z-index: 9998;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	transition: opacity 0.4s ease;
	transition: all 0.4s ease;
	min-height: 600px;
	min-width: 500px;
}

.modal_friend {
	display: flex;
	flex-direction: column;
	width: 40%;
	height: 30%;
	background-color: #DBEFFC;
	border-radius: 20px;
}

@media screen and (max-width: 1150px) {
	.modal_friend {
		width: 75%;
	}
}

</style>