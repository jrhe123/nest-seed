import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Log } from 'src/log/log.entity';
import { Role } from 'src/role/role.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];

  @ManyToMany(() => Role, (roles) => roles.users)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
