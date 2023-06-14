<template>
	<div class="modal-overlay" @click="closeModal">
		<div class="modal-username" @click.stop>
			<SlidingTitle text="Changer Pseudo"/>
			<div class="username-items">
				<div class="input-field">
					<input class="username-field" type="text" v-model="username" maxlength="20" placeholder="Nouveau pseudo">
					<div class="line"></div>
				</div>
				<BlueButton text="Confirmer " icon="fa-solid fa-pen" @click="changeUsername" />
			</div>
	  </div>
	</div>
</template>

<script lang="ts">

import SlidingTitle from './SlidingTitle.vue';
import BlueButton from './BlueButton.vue';

export default{
	components: {
		SlidingTitle,
		BlueButton
	},
	data: () => ({
		username: "",
	}),
	methods: {
		closeModal(){
			this.$emit('close-modal');
			this.username = "";
		},

		handleResponse(res: Response){
			if (res.status != 201)
				this.$emit('already-exist');
			else {
				this.$emit('updated');
				this.closeModal();
			}
		},

		changeUsername(){
			if (!this.username)
				return;
			if (!this.username.match(/^[\p{L}\p{N}_]+$/u)) {
				this.$emit('bad-format');
				return;
			}
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/setname",
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.username,
				})
			})
			.then(res => this.handleResponse(res));
		}
	},
}
</script>

<style scoped>
.modal-username {
	text-align: center;
	background-color: white;
	height: 20%;
	width: 60%;
	margin-top: auto;
	margin-bottom: auto;
	padding: 60px 0;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.username-items{
	/* background-color: aquamarine; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	row-gap: 30px;
	height: 70%;
}

.input-field{
	justify-content: center;
	align-items: center;
}

.username-field{
	width: 100%;
	margin: auto;
}

.line{
	width: 102%;
	height: 3px;
	position: relative;
	top: 0;
	background: red;
	
}

</style>