import AxiosService from '@/models/classes/AxiosService';
import { AuthRoles } from '@/models/enums/auth';

const guestAxiosInstance = new AxiosService(AuthRoles.GUEST);
const adminAxiosInstance = new AxiosService(AuthRoles.ADMIN);
const userAxiosInstance = new AxiosService(AuthRoles.USER);

export { guestAxiosInstance, adminAxiosInstance, userAxiosInstance };
