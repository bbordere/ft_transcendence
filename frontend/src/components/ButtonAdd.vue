<template>
	<button class="add-button"><font-awesome-icon :icon="this.icon"/> {{ this.text }}</button>
</template>

<script lang="ts">

export default{
	props: ["text", "icon"],
}

</script>

<style>

.add-button{
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 120px;
	background-color: #046280;
	height: 75%;
	width: 25%;;
	color: white;
	border: none;
	font-size: 1em;
	overflow: hidden;
	cursor: pointer;
}

.add-button:hover {
	background-color: #032f3d;
}

</style>