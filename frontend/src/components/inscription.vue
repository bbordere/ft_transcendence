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
			<field str="pseudo" @updateInput = "speudo => display(speudo)" />
			<field str="password" @updateInput = "password => display(password)" />
			<btn @updateInput = "co => connection(input)" />
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
  top: 80px;
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
	height: 400px;
	padding: 40px 30px;

	border-radius: 10px;
	box-shadow:  4px 4px 4px #47474780,
             -4px -4px 4px #eaeaea80;
			 transition: all 0.3s ease;
}

.modal-footer {

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

