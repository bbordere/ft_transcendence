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
						<h1>Nom du channel</h1>
						<input type="email" placeholder="@ email"/>
					</div>
					<div class="field">
						<h1>Nom du channel</h1>
						<input type="text" placeholder="pseudo"/>
					</div>
					<div class="field">
						<h1>Nom du channel</h1>
						<input type="text" placeholder="mot de passe"/>
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
}

.modal {
	display: flex;
	flex-direction: row-reverse;
	width: 40%;
	height: 70%;
	background-color: white;
	border-radius: 20px;
}
.modal button {
	display: flex;
	background-color: white;
	height: 6%;
	width: 6%;
	font-size: 100%;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 20px;
}

.modal button:hover {
	background-color: rgb(222, 226, 228);
	border-radius: 360px;
}
.form {
	display: flex;
	height: 100%;
	width: 100%;
	border-radius: 20px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-right: 30%;
	background-color: red;
	gap: 3%;
}

</style>