<script lang="ts">
export default {
	props: {
		id1: Number,
		id2: Number,
		username: String,
		show: Boolean
	},

	methods: {
		async deleteFriend() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/friend/delete?id1=${this.id1}&id2=${this.id2}`,{
				credentials: 'include',
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
			});
		},

		async blockUser() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/user/block/blocked`,{
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: this.id1,
					blockId: this.id2,
				}),
			});
		},
	}
}
</script>

<template>
	<Transition name="slide-fade" mode="out-in">
		<div v-if="show" class="modal_overlay" @click="$emit('close')">
			<div class="modal_friend" @click.stop>
				<p>Attention, <b> {{ username }}</b> va être :</p>
				<div class="button_box">
					<button v-on:click="blockUser">Bloquer</button>
					<button v-on:click="deleteFriend">Supprimer</button>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style scoped>

.button_box {
	display: flex;
	height: 40%;
	justify-content: space-around;
	align-items: center;
	font-size: larger;
}

.button_box button:hover {
	background-color: rgb(182, 227, 238);
}
.button_box button {
	font-size: larger;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50%;
	width: 30%;
	background-color: #036280;;
	border: 1px solid #000000;
	border-radius: 20px;
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

.modal_friend {
	display: flex;
	flex-direction: column;
	justify-content: center;
	right: 70%;
	width: 30%;
	height: 30%;
	background-color: #DBEFFC;
	border-radius: 20px;
}

.modal_friend p {
	text-align: center;
	font-size: 1.3em;
}

@media screen and (max-width: 1150px) {
	.modal_friend {
		width: 75%;
	}
}

</style>
