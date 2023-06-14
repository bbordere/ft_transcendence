<template>
	<div class="modal-overlay" @click="$emit('close-modal')">
		<div class="modal" @click.stop>
			<SlidingTitle text="Paramètres"></SlidingTitle>
		  	<div class="buttons-parameters">
				<div class="tfa">
					<font-awesome-icon icon="fa-solid fa-lock"/>
					Authentification
					<Switch/>
				</div>

				<BlueButton text="Changer Nom " icon="fa-solid fa-pen" @click="showModal = true"></BlueButton>
				<Teleport to="body">
					<transition name="slide-fade" mode="out-in">
						<ChangeUsernameModal v-show="showModal" @close-modal="showModal = false"
											@updated="updateNotif" @already-exist="alreadyExistNotif"
											@bad-format="badFormatNotif"></ChangeUsernameModal>
					</transition>
				</Teleport>
			</div>
		</div>
	  </div>
</template>
  
<script lang="ts">
	import Switch from '@/components/switch.vue';
	import FileUpload from '@/components/FileUpload.vue'
	import ChangeUsernameModal from '@/components/ChangeUsernameModal.vue'
	import BlueButton from './BlueButton.vue';
	import SlidingTitle from './SlidingTitle.vue';
	import { useNotification } from "@kyvg/vue3-notification";



	export default{
		components: {
			Switch,
			FileUpload,
			ChangeUsernameModal,
			BlueButton,
			SlidingTitle
		},
		data(){
			return ({showModal: false});
		},
		methods:{
			updateNotif(){
				this.$emit('updated');
				const notification = useNotification()
				notification.notify({
					title: "Nom d'utilisateur changé !",
					type: 'success',
					group: 'notif-center'
				});
			},
			alreadyExistNotif(){
				const notification = useNotification()
				notification.notify({
					title: "Erreur",
					text: "Ce nom d'utilisateur existe déjà !",
					type: 'error',
					group: 'notif-center'
				});
			},
			badFormatNotif(){
				const notification = useNotification()
				notification.notify({
					title: "Erreur",
					text: "Veuillez entrer un format valide !",
					type: 'error',
					group: 'notif-center'
				});
			}
		}
	}
</script>
  
  <style scoped>
  .modal-overlay {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	background-color: #242424d0;
	transition: opacity 0.3s ease;
	transition: all 0.3s ease;
  }
  
  .modal {
	text-align: center;
	background-color: white;
	height: 500px;
	width: 500px;
	margin-top: auto;
	margin-bottom: auto;
	padding: 60px 0;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
  }
 
  .title-parameters {
	font-size: 50px;
	font-family: 'poppins'
  }
	.tfa{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		font-size: 30px;
	}
	
	.buttons-parameters{
		display: flex;
		gap: 10px;
		flex-direction: column;
		margin-top: 40px;
		width: 80%;
	}

  .buttons button{
	margin-top: 15%;
	margin-left: auto;
	margin-right: auto;
	width: 40%;
  }
  </style>