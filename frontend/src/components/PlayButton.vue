<template>
	<button v-if="!recoButton" class="play_button" @click="showModalPlay = true">Jouer</button>
	<button v-else class="play_button" @click="reconnectToRoom">Reco</button>
	<Teleport to="body">
		<transition name="slide-fade" mode="out-in">
			<PlayModal v-show="showModalPlay" @close-modal="showModalPlay = false"></PlayModal>
		</transition>
	</Teleport>
</template>
<script lang="ts">
import PlayModal from './PlayModal.vue';

export default {
	components: {
		PlayModal,
	},

	data() {
		return {
			recoButton: false as Boolean,
			recoMode: -1 as number,
			showModalPlay: false as boolean,
		}
	},

	async mounted() {
		const disconnectObject = await ((await fetch("http://" + import.meta.env.VITE_HOST + ":3000/pong/status", { credentials: 'include' })).json());
		this.recoButton = disconnectObject["disconnect"];
		this.recoMode = disconnectObject["mode"];
		if (!this.recoButton)
			return;
		let timer: number = 0;
		const it = setInterval(async () => {
			const disconnectObject = await ((await fetch("http://" + import.meta.env.VITE_HOST + ":3000/pong/status", { credentials: 'include' })).json());
			this.recoButton = disconnectObject["disconnect"];
			timer++;
			if (timer === 8 || !this.recoButton)
				clearInterval(it);
		}, 500);
	},

	methods: {
		reconnectToRoom(){
			const mode = ["classic", "arcade", "ranked"][this.recoMode];
			this.$router.push({ path: '/pong', query: { mode: mode }});
		},
	}
}
</script>
<style>
.play_button {
	display: flex;
	width: 100%;
	height: 20%;
	justify-content: center;
	align-items: center;
	background: #036280;
	border: 3px solid #BC0002;
	border-radius: 25px;
	text-decoration: none;
	color: black;
	font-size: 3em;
}
</style>