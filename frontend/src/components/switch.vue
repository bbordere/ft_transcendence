<template>
	<label class="switch">
		<input type="checkbox" v-model="checkbox" @click="clickAction">
		<div class="slider round"></div>
	</label>
</template>

<script lang="ts">

	import router from '../router'

	function booleanize(str: string): boolean{
		return (str === "true");
	}

	export default{
		data() {
			return {checkbox: false};
		},
		methods: {
			clickAction() {
				if (!this.checkbox){
					router.push('/auth/2fa/home');
				}
				else
					this.checkbox = !this.checkbox;
			},

			getStatus: async(vm: any) => {
				const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/2fa/status", {method: "get", credentials: "include"});
				const text = await (await res.blob()).text();
				vm.checkbox = booleanize(text);
			}

		},
		mounted(){
			this.getStatus(this);
		},
	}

</script>

<style>

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2bb81e;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2bb81e;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>