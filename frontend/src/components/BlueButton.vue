<template>
	<button class="blue-button"><font-awesome-icon :icon="this.icon"/> {{ this.text }}</button>
</template>

<script lang="ts">

export default{
	props: ["text", "icon"],
}

</script>

<style>

.blue-button{
	position: relative;
	font-family: 'Poppins';
    font-weight: bold;
	background-color: rgb(34, 158, 230);
	border-radius: 10px;
	box-shadow: rgb(37, 18, 121) 0px 4px 0px 0px;
	padding: 10px;
	background-repeat: no-repeat;
	box-sizing: border-box;
	color: #fff;
	width: 90%;
	border: none;
	transition: all .3s ease-in-out;
	overflow: hidden;
	cursor: pointer;
}

.blue-button::before{
	content: "";
	background-color: rgb(255, 255, 255);
	width: 0;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	transition: width 700ms ease-in-out;
	/* display: inline-block; */
	opacity: 50%;
}

.blue-button:hover::before {
	width: 100%;
	opacity: 50%;
}

</style>