import AppDataSource from '../ormconfig';
import { User } from './user/user.entity';

AppDataSource.initialize()
  .then(async () => {
    const res = await AppDataSource.manager.find(User);
    console.log('res: ', res);
  })
  .catch((error) => console.error(error));
