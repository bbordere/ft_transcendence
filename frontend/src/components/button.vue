<script setup lang="ts">
import {ref} from 'vue'

const getStr = defineProps(['str'])
const input = ref('')

const emit = defineEmits(['updateInput'])

const handleUpdate = (event) => {
	emit('updateInput', event.target.value)
}

</script>

<template>

<div class="field">
	<button class="btn" @click="handleUpdate">connection</button>
</div>

</template>

<style>

.btn{
	margin: 15px 0;
	width: 100%;
	height: 50px;
	font-size: 18px;
	line-height: 50px;
	font-weight: 600;
	background: #dde1e7;
	border-radius: 25px;
	border: none;
	outline: none;
	cursor: pointer;
	color: #595959;
	box-shadow:  4px 4px 4px #616161,
             -4px -4px 4px #eaeaea;
}
.btn:focus{
	color: #3498db;
	box-shadow:  4px 4px 4px #606060,
             -4px -4px 4px #c9c9c9;
}

</style>