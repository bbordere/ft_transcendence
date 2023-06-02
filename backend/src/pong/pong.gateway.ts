import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: true,
	}
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	afterInit(server: any) {
		console.log("serveur init");
	}

	// Implémente les méthodes de l'interface OnGatewayConnection
	handleConnection(client: Socket) {
		console.log(`Un joueur s'est connecté : ${client.id}`);

		// Événement lorsqu'un joueur rejoint le jeu
		client.on('joinGame', (data: any) => {
		  console.log(`Le joueur ${client.id} a rejoint le jeu`);
		  
		  // Logique pour gérer l'ajout du joueur au jeu
		  // Par exemple, attribuer un identifiant unique au joueur, initialiser sa position, etc.
	  
		  // Envoyer un message de confirmation au joueur
		  client.emit('gameJoined', { playerId: client.id });
		  
		  // Diffuser un message à tous les autres joueurs pour informer qu'un nouveau joueur a rejoint le jeu
		  client.broadcast.emit('playerJoined', { playerId: client.id });
		});	}
  
	// Implémente les méthodes de l'interface OnGatewayDisconnect
	handleDisconnect(client: Socket) {
	  // Code exécuté lorsqu'un joueur se déconnecte
	}
}