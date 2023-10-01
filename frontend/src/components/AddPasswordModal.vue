<script lang="ts">
import { defineComponent } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';

export default defineComponent({
	data() {
		return ({
			password: '' as string,
		});
	},

	props: ['show', 'channelId', 'sender'],

	methods: {
		async addPassword() {
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + this.$props.channelId + "/" + this.$props.sender.id + '/changePassword', {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'password': this.password,
				}),
			});
			const response_json = await response.json();
			const notif = useNotification();
			this.password = '';
			if (!response_json['ok']) {
				notif.notify({
					title: 'Erreur',
					text: response_json['message'],
					type: 'error',
					group: 'notif-center',
				});
				return ;
			}
			else {
				notif.notify({
					title: 'Nouveau mot de passe',
					text: response_json['message'],
					type: 'success',
					group: 'notif-center',
				});
				this.$emit('updateButton');
			}
			this.$emit('close');
		}
	},
});

</script>

<template>
	<Transition name="slide-fade" mode="out-in">
		<div v-if="show" class="modal_overlay" @click="$emit('close')">
			<div class="modal" @click.stop>
				<div class="form">
					<div class="field">
						<h1>Ajouter/changer le mot de passe</h1>
						<input v-model="password" class="entry" type="text" placeholder="Mot de passe" />
					</div>
					<div class="choice">
						<button @click="addPassword()">Confirmer</button>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style scoped>
h1 {
	width: 100%;
	text-align: center;
}

.modal_overlay {
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

.modal {
	display: flex;
	flex-direction: column;
	align-items: end;
	width: 75%;
	max-width: 500px;
	height: 70%;
	background-color: #DBEFFC;
	border-radius: 20px;
}

.modal button {
	display: flex;
	background-color: #DBEFFC;
	height: 6%;
	width: 6%;
	align-items: center;
	justify-content: center;
	border: none;
	font-size: 1.3em;
	border-radius: 20px;
}

.modal button:hover {
	background-color: rgb(182, 227, 238);
}

.form {
	display: flex;
	border-radius: 20px;
	width: 100%;
	height: 80%;
	flex-direction: column;
	align-items: center;
	padding-top: 5%;
}

.field {
	display: flex;
	flex-direction: column;
	width: 70%;
	height: 70%;
	gap: 12%;
	align-items: center;
	padding-top: 2%;
}

.entry {
	display: flex;
	border-radius: 20px;
	width: 100%;
	height: 30%;
	outline: none;
	border: none;
	text-align: center;
	font-size: larger;
}

.choice {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 25%;
}

.choice button {
	display: flex;
	width: 25%;
	height: 80%;
	background-color: #036280;
	;
	border: 1px solid #000000;
	border-radius: 20px;
}

</style>