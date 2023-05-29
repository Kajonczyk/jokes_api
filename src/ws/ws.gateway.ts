import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { JokeService } from '../joke/joke.service';

@WebSocketGateway()
export class WsGateway {

  @WebSocketServer() wss: Server
  connectedClients: Set<string> = new Set();



  constructor(private roomService: RoomService, private jokeService: JokeService) {
  }

  @SubscribeMessage("test")
  onTest(@ConnectedSocket() client: Socket, @MessageBody() body: any){

    console.log("test", this.connectedClients.size)
  }


  @SubscribeMessage("onRoomJoined")
  async onJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any){
    const payload = JSON.parse(body)

    console.log(payload.roomId)
    this.wss.to(body.roomId).emit("joinedRoom", body.userId)
    this.roomService.joinRoom(payload.roomId, payload.userId)
  }

  @SubscribeMessage("onRoomLeft")
  async onJoinDisconnectFromRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any){
    const payload = JSON.parse(body)
    this.wss.to(body.roomId).emit("roomleft", body.userId)
    await this.roomService.disconnectFromRoom(payload.roomId, payload.userId)
  }

  @SubscribeMessage("onJokeTold")
  async onJokeTold(@ConnectedSocket() client: Socket, @MessageBody() body: any){
    const payload = JSON.parse(body)

    const joke = await this.jokeService.create(payload.gameId, payload.content, payload.userId)
    this.wss.emit("jokeTold", joke)

  }

}

