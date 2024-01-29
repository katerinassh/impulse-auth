import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDTO } from './dto/createCustomer.dto';
import { RolesEnum } from './enum/roles.enum';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {
    super(repository);
  }

  async getByEmail(email: string, loadPassword?: boolean): Promise<User> {
    if (!email) {
      throw new BadRequestException('Invalid input, email is not provided');
    }

    return this.repository
      .createQueryBuilder('user')
      .where(`user.email = :email`, { email })
      .addSelect(loadPassword ? 'user.password' : '')
      .getOne();
  }

  async getById(id: number, loadWords?: boolean): Promise<User> {
    if (!id) {
      throw new BadRequestException('Invalid input, id is not provided');
    }

    const relations = loadWords ? { words: true } : {};
    const user = await this.repository.findOne({
      relations,
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found`);
    }
    return user;
  }

  async createCustomer(createCustomerDto: CreateCustomerDTO): Promise<User> {
    return this.repository.save({
      ...createCustomerDto,
      role: RolesEnum.Customer,
    });
  }

  async createBlankAdmin(email: string): Promise<User> {
    return this.repository.save({
      email,
      password: (Math.random() + 1).toString(36).substring(10),
      firstName: 'blank',
      lastName: 'blank',
      role: RolesEnum.Admin,
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    return this.repository.save({ ...user, ...updateUserDto });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
