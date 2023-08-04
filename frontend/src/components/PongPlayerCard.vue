<template>
	<div class="pongPlayerCard">
		<img :src="user.avatarLink" class="image" id="PongCardAvatar"/>
		<div class="pongPlayerCardText">
			{{ user.name }}
		</div>
	</div>
</template>

<script lang="ts">

export default {
	props: ["id"],
	data() {
		return {user: Object};
	},
	components: {
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
	margin-top: -80%;
	border-radius: 10px;
}

.pongPlayerCardText {
	margin-top: 15px;
	font-size: 1.5vh;
}

</style>

