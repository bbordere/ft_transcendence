<script lang="ts">
export default {
	props: {
		show: Boolean
	}
}

</script>

<template>
	<Transition name="slide-fade" mode="out-in">
	<div v-if="show" class="modal_overlay" @click="$emit('close')">
		<div class="modal" @click.stop>
			<button @click="$emit('close')">&times;</button>
			<div class="form">
				<div class="field">
					<h1>Nom du Channel</h1>
					<input class="entry" type="text" placeholder="Mon Channel"/>
				</div>
				<div class="field">
					<h1>Mot de Passe</h1>
					<input class="entry" type="password" placeholder="Champ optionnel"/>
				</div>
				<div class="choice">
					<button type="button">Privé</button>
					<button type="button">Public</button>
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
	font-size: 100%;
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
}

.field {
	display: flex;
	flex-direction: column;
	width: 70%;
	height: 50%;
	gap: 10%;
	align-items: center;
}
.entry {
	display: flex;
	border-radius: 20px;
	width: 100%;
	height: 25%;
	outline: none;
	border: none;
	text-align: center;
	font-size: larger;
}

.choice {
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	height: 15%;
}

.choice button {
	display: flex;
	width: 25%;
	height: 80%;
	background-color: #036280;;
	border: 1px solid #000000;
	border-radius: 360px;
}

@media screen and (max-width: 1150px) {
	.modal {
		width: 75%;
	}
}

</style>