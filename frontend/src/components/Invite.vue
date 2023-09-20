<script lang="ts">

import BlueButton from './BlueButton.vue';

export default {
	components: {
		BlueButton,
	},
	props: {
		myId: Number,
		friendId: Number,
		show: Boolean,
	},

	methods: {
		goToPong(mode: string){
			this.$router.push({ path: '/pong', query: { mode: mode, id: this.myId}});
		}
	}
}

</script>

<template>
	<transition name="slide-fade" mode="out-in">
	<div v-if="show" class="play-modal-overlay" @click="$emit('close')">
		<div class="modal" @click.stop>
			<div class="play-modal-title">Choix du mode de jeu</div>
			<div class="buttons-play-modal">
				<BlueButton class="button-play-modal" text="Classique" @click="goToPong('duelClassic')"></BlueButton>
				<BlueButton class="button-play-modal" text="Arcade" @click="goToPong('duelArcade')"></BlueButton>
			</div>
			
		</div>
	</div>
	</transition>
</template>

<style></style>



