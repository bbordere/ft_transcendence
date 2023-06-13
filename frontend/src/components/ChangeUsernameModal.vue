<template>
	<div class="modal-overlay" @click="closeModal">
	  <div class="modal-username" @click.stop>
		<div class="title">Change Username</div>
		<input ref="input" type="text" v-model="username" maxlength="20" placeholder="Saisissez un pseudo">
		<button @click="changeUsername">Change Username</button>

	  </div>
	</div>
</template>

<script lang="ts">
  import Switch from '@/components/switch.vue';
  import FileUpload from '@/components/FileUpload.vue'

  export default{
	  components: {
		  Switch,
		  FileUpload,
	  },
	  data: () => ({
		username: "",
	  }),
	  methods:{
		closeModal(){
			this.$emit('close-modal');
		},
		handleResponse(res: Response){
			if (res.status != 201)
				this.$emit('already-exist');
			else{
				this.$emit('updated');
				this.$emit('close-modal');
			}
		},

		changeUsername(){
			if (!this.username)
				return;
			if (!this.username.match(/^[\p{L}\p{N}_]+$/u)) {
				this.$emit('bad-format');
				return;
			}
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/setname",
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.username,
				})
			})
			.then(res => this.handleResponse(res));
		}
	},
}
</script>

<style scoped>
.modal-username {
	text-align: center;
	background-color: white;
	height: 400px;
	width: 800px;
	margin-top: auto;
	margin-bottom: auto;
	padding: 60px 0;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

 .buttons{
	  display: flex;
	  flex-direction: column;
	  margin-top: 40px;
  }

.buttons button{
  margin-top: 15%;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
</style>