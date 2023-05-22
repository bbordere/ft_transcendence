<script setup>
import { ref } from 'vue'
import field from "@/components/field.vue"
import btn from "@/components/button.vue"

const props = defineProps({show: Boolean})
</script>

<template>
<Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-body">
			<span class="text">inscription</span>
			<form action="/aled">
				<field str="email" @updateInput = "email => display(email)" />
				<field str="pseudo" @updateInput = "pseudo => display(pseudo)" />
				<field str="mot de passe" @updateInput = "password => display(password)" />
				<btn type="submit" @updateInput = "co => connection(input)" />
			</form>
			<div class="modal-footer">
				<button class="btn-fermer" @click="$emit('close')">fermer</button>
			</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
	margin: auto;
	background-color: #B4CFECD0;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);

	width:550px;
	height: auto;
	padding: 40px 30px;
	display: flex;
	flex-direction: column;

	border-radius: 10px;
	box-shadow:  4px 4px 4px #47474780,
             -4px -4px 4px #eaeaea80;
			 transition: all 0.3s ease;
}

.modal-body .text { 
font-size: 33px;
	font-weight: 600;
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-bottom: 35px;
	color: #595959;
}
.modal-footer {
padding-top: 40px;
}

.modal-default-button {
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.5);
  transform: scale(1.5);
}
</style>

