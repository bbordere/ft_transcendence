<template>
	<div class="verify">
		<h4>Enter OTP Code</h4>
		<div class="input-field">
			<form>
			<input
			  v-for="(n, index) in codeArr"
			  :key="index"
			  type="number"
			  pattern="\d*"
			  :id="'input_' + index"
			  maxlength="1"
			  v-model="codeArr[index]"
			  @input="handleInput"
			  @keypress="isKeyNumeric"
			  @keydown.delete="handleDelete"
			  @paste="onPaste"
			/>
		  </form>
		</div>
		<div class="status" :class="[status === 'Success' ? 'text-green' : 'text-red']">{{ status }}</div>
	</div>
	</template>
	
	
	
	
	<script setup lang="ts">
	
	import { ref } from 'vue';
	let status = ref("");
	
	let codeArr: string[] = ["", "", "", "", "", ""];
	let inputData: string[] | undefined;
	
	function isNumeric(str: string){
		const isNumeric = /^[0-9]+$/.test(str);
		return (isNumeric);
	}
	
	function isKeyNumeric(event: Event){
		(event.currentTarget as HTMLInputElement).value = "";
		const keyPressed: string = (event as KeyboardEvent).key;
		if (!isNumeric(keyPressed))
			event.preventDefault();
	}
	
	function handleInput(event: Event){
		const inputType = (event as InputEvent).inputType;
		let currentActiveElement = event.target as HTMLInputElement;
	
		if (inputType === "insertText")
			(currentActiveElement.nextElementSibling as HTMLElement)?.focus();
		if (inputType === "insertFromPaste" && inputData) {
			for (const n of inputData){
				let i: number = parseInt(currentActiveElement.id.split("_")[1]);
				currentActiveElement.value = n;
				codeArr[i] = n;
				if (currentActiveElement.nextElementSibling) {
					currentActiveElement = currentActiveElement.nextElementSibling as HTMLInputElement;
					(currentActiveElement.nextElementSibling as HTMLElement)?.focus();
				}
			}
		}
		if (!codeArr.includes('')){
			sendCode(codeArr.join(''));
		}
		else
			status.value = "";
	}
	
	function handleDelete(event: Event) {
	  //keydown event = move to previous element then only delete number
	
		let value = (event.target as HTMLInputElement).value;
		let currentActiveElement = event.target as HTMLInputElement;
		if (!value)
			(currentActiveElement.previousElementSibling as HTMLElement)?.focus();
	}
	
	async function sendCode(code: string){
		const res = await fetch("http://localhost:3000/auth/2fa/verify",
				{
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJib3JkZXJlIiwiZW1haWwiOiJiYm9yZGVyZUBzdHVkZW50LjQyLmZyIiwiaWF0IjoxNjg0NzQ2MjQxfQ.-2WscK6hWEQAZjNzs3SU94o0Mi72Z4TGEzZaXWdS9yw' // to do changer pour recuperer le bon
					},
					body: JSON.stringify({
						code: code,
					})
				})
				status.value = await (await res.blob()).text();
	}
	
	function onPaste(event: Event) {
		inputData = (event as ClipboardEvent).clipboardData
			?.getData("text")
			.trim()
			.split("");
	
		if (inputData) {
			for (const num of inputData) {
				if (!isNumeric(num))
					event.preventDefault();
			}
			if (!inputData.includes('')){
				sendCode(codeArr.join(''));
			}
		}
	}
	
	</script>
	
	
	
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
		form {
		display: flex;
		flex-direction: row;
	}
	
		.verify {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 300px;
			height: 150px;
			margin: auto;
			background: rgb(255, 255, 255);
			border-radius: 50px;
			box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		}
		.verify h4 {
			font-size: 1.25rem;
			color: #333;
			font-weight: 500;
		}
	
		.input-field input {
			width: 10%;
			margin: auto;
			border-radius: 6px;
			margin-left: 10px;
			margin-right: 10px;
			outline: none;
			font-size: 1.125rem;
			text-align: center;
			border: 1px solid #ddd;
		}
		.input-field input:focus {
			box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
		}
	
		.input-field input::-webkit-outer-spin-button,
		.input-field input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	
		.text-red{
			color: rgb(172, 42, 42);
		}
	
		.text-green{
			color: rgb(12, 167, 12);
		}
	
	</style>