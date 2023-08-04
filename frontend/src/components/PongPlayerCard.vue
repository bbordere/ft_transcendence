<template>
	<div class="pongPlayerCard">
		<div class="emote">
				{{ emote }}
		</div>
		<img :src="user.avatarLink" class="image" id="PongCardAvatar"/>
		<div class="pongPlayerCardText">
			{{ user.name }}
		</div>
	</div>
</template>

<script lang="ts">

export default {
	props: ["id", "emote", "side"],
	data() {
		return {user: Object};
	},
	mounted() {
		fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/id/" + this.id, {credentials: 'include'})
		.then(res => res.json())
		.then(data => {this.user = data;});
	}
}

</script>

<style>

#PongCardAvatar{
	width: 50%;
}

.pongPlayerCard {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	border-radius: 10px;
}

.pongPlayerCardText {
	margin-top: 15px;
	font-size: 1.5vw;
}

.emote {
	position: absolute;
	margin-left: 50px;
	margin-top: 10px;
	z-index: 1;
	font-size: 3vw;
	text-align: center;
}

</style>

