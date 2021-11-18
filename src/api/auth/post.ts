import { Request, Response } from 'express';
import { assign, pick } from 'lodash';
import { UserEntity } from '../../db/entities/user.entity';
import JwtService from '../../services/jwt.service';
import { HttpError, wrapper } from '../../tools/wrapper.helpers';

export const registration = wrapper(async (req: Request, res: Response) => {
  const data = pick(req.body, 'login', 'password', 'role');

  const isLoginInUse = !!(await UserEntity.findOne({ login: data.login }));

  if (isLoginInUse) {
    throw new HttpError('Aaaa');
  }

  const user = new UserEntity();
  assign(user, data);

  await user.save();
  res.status(201).send(`User with id ${user.id} created!`);
});

export const login = async (req: Request, res: Response) => {
  const { password, login } = pick(req.body, 'password', 'login');
  const user = await UserEntity.findOne(
    { login },
    { select: ['password', 'id', 'role', 'login'] }
  );

  if (!user || !user.verifyPassword(password)) {
    return res.status(400).send('I dont know you bro');
  }
  const token = JwtService.encode(user);
  return res.send({ token });
};
