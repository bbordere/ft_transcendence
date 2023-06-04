<template>
	<div class="modal-overlay" @click="$emit('close-modal')">
	  <div class="modal-username" @click.stop>
		<div class="title">Change Username</div>
		<input v-model="username">
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
		username: ""
	  }),
	  methods:{
		  async changeUsername(){
		  const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/setname",
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