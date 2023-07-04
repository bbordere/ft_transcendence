<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent ({
	data() {
		return ({
			channel_name: '' as string,
			channel_password: '' as string,
		});
	},
	
	props: {
		show: Boolean,
	},

	methods: {
		async addChannel() {
			if (this.channel_name === '')
				return ;
			if (Array.from(this.channel_name)[0] === '#')
				this.channel_name.split('#').join('');
			const response_json = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/create', {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.channel_name,
				}),
			})).json();
			if (response_json['channel'] !== null)
				this.$emit('newChannel', response_json['channel']);
			else {
				let response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + encodeURIComponent(this.channel_name), { credentials: 'include' });
				let channel = await (response.json());
				this.$emit('newChannel', channel);
			}
			this.$emit('close');
			this.channel_name = '';
			this.channel_password = '';
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
					<h1>Nom du Channel</h1>
					<input v-model="channel_name" class="entry" type="text" placeholder="Mon Channel"/>
				</div>
				<div class="field">
					<h1>Mot de Passe</h1>
					<input class="entry" type="password" placeholder="Champ optionnel" v-model="channel_password"/>
				</div>
				<div class="choice">
					<button @click="addChannel()">Confirmer</button>
				</div>
			</div>
		</div>
	</div>
	</Transition>
</template>

<style scoped>

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
	width: 40%;
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

@media screen and (max-width: 1150px) {
	.modal {
		width: 75%;
	}
}

</style>