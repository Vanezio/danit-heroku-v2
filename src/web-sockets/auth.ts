import { UserEntity } from '../db/entities/user.entity';
import JwtService from '../services/jwt.service';

export const authSocketMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error('No token');
    }
    const { id } = JwtService.decode(token);
    const user = await UserEntity.findOne(id);
    socket.user = user;

    next();
  } catch (error) {
    socket.disconnect();
  }
};
