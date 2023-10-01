<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';
import { SocketService } from '@/services/SocketService';

export default defineComponent ({
	data() {
		return ({
			time: undefined as number | undefined,
		});
	},

	props: {
		show: Boolean,
		channelId: Number,
		username: String,
	},

	methods: {
		async MuteUser() {
			const user_resp = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.$props.username, {credentials: 'include'});
			if (!user_resp['ok'] || this.$props.username == '') {
				this.$emit('close');
				return ;
			}
			const user = (await user_resp.json())['id'];
			const data = {
				userId: user,
				channelId: this.$props.channelId,
				time: this.time,
			};
			SocketService.getInstance.emit('mute', data);
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
					<h1>Mute un utilisateur</h1>
					<input v-model="time" class="entry" type="text" placeholder="Temps (en secondes)">
				</div>
				<div class="choice">
					<button @click="MuteUser()">Confirmer</button>
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
	background-color: #036280;;
	border: 1px solid #000000;
	border-radius: 20px;
}

</style>