import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {RoomService} from '../room/room.service';
import {JokeService} from '../joke/joke.service';
import {TurnsService} from '../game/turns/turns.service';
import {UsersService} from '../users/users.service';
import {GameService} from '../game/game.service';

@WebSocketGateway({
	cors: true
})
export class WsGateway {

	@WebSocketServer() wss: Server;
	connectedClients: Set<string> = new Set();

	constructor(private roomService: RoomService, private jokeService: JokeService, private turnsService: TurnsService, private usersService: UsersService, private gameService: GameService) {
	}

	@SubscribeMessage('testowa')
	onTest(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		this.wss.emit('test', {hello: 'World'});

	}

	@SubscribeMessage('testowaPokojowa')
	onTestPokoj(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		this.wss.to('2ecaef45-c807-470d-b9af-03831cfd84ae').emit('test', {hello: 'World testowaPokojowa'});
	}

	@SubscribeMessage('onRoomJoined')
	async onJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const payload = JSON.parse(body);

		client.join(payload.roomId);

		const rawUser = await this.usersService.findOne({id: payload.userId});
		const {password, ...userToJoin} = rawUser

		console.log("-----")
		console.log(client.id)


		await this.roomService.joinRoom(payload.roomId, payload.userId);

		//@ts-ignore
		// this.wss.to(payload.roomId).except(client.id).emit('joinedRoom', userToJoin);
		this.wss.to(payload.roomId).emit('joinedRoom', userToJoin);

	}

	@SubscribeMessage('onRoomLeft')
	async onJoinDisconnectFromRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const payload = JSON.parse(body);

		client.leave(payload.roomId);

		this.wss.to(payload.roomId).emit('roomleft', payload.userId);
		this.roomService.disconnectFromRoom(payload.roomId, payload.userId);

	}


	//@@@@@
	//@@@@@
	//@@@@@
	@SubscribeMessage('onGameStarted')
	async onGameStarted(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const {roomId, rounds, userId} = JSON.parse(body);

		const game = await this.gameService.startGame({roomId, rounds}, userId)

		console.log("GAME FROM WS", game)

		this.wss.to(roomId).emit('startGame', game);
	}
	//@@@@@
	//@@@@@
	//@@@@@

	@SubscribeMessage('onJokeTold')
	async onJokeTold(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const payload = JSON.parse(body);

		const joke = await this.jokeService.create(payload.gameId, payload.content, payload.userId);
		this.wss.emit('jokeTold', joke);

	}

	@SubscribeMessage('onNextTurn')
	async onNextTurn(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const payload = JSON.parse(body);

		const turn = await this.turnsService.nextTurn(payload.gameId, payload.userId, payload.roomId);
		console.log("TURN Z WS", turn)
		this.wss.to(payload.roomId).emit('nextTurn', turn);
		this.wss.to(payload.roomId).emit('nextTurn', turn);
	}

	@SubscribeMessage('onScoreAdded')
	async onScoreAdded(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const payload = JSON.parse(body);

		const score = await this.gameService.addGamePoints(payload.gameId, payload.userId, payload.amount, payload.turnId);
		console.log("Score Z WS", score)

		this.wss.to(payload.roomId).emit('addScore', score);
	}

	@SubscribeMessage('onScoreUpdated')
	async onScoreUpdated(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const payload = JSON.parse(body);

		const turn = await this.gameService.getGamePoints(payload.gameId);
		this.wss.to(payload.roomId).emit('updateScore', turn);
	}

}

