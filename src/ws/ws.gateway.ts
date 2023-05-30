import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {RoomService} from '../room/room.service';
import {JokeService} from '../joke/joke.service';
import {TurnsService} from '../game/turns/turns.service';
import {UsersService} from '../users/users.service';

@WebSocketGateway()
export class WsGateway {

	@WebSocketServer() wss: Server;
	connectedClients: Set<string> = new Set();

	constructor(private roomService: RoomService, private jokeService: JokeService, private turnsService: TurnsService, private usersService: UsersService) {
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

		const userToJoin = await this.usersService.findOne({id: payload.userId});
		await this.roomService.joinRoom(payload.roomId, payload.userId);

		this.wss.to(payload.roomId).emit('joinedRoom', userToJoin);

	}

	@SubscribeMessage('onRoomLeft')
	async onJoinDisconnectFromRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		const payload = JSON.parse(body);

		client.leave(payload.roomId);

		this.wss.to(payload.roomId).emit('roomleft', payload.userId);
		this.roomService.disconnectFromRoom(payload.roomId, payload.userId);

	}

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
		this.wss.to(payload.roomId).emit('nextTurn', turn);

	}

}

