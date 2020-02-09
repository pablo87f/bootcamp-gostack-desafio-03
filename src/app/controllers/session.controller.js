import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth.config';
import User from '../models/user.model';

class SessionController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email()
                    .required(),
                password: Yup.string().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) return res.status(401).json({ error: 'User not found' });
            if (!user.admin) {
                return res
                    .status(401)
                    .json({ error: "User don't have admin permition" });
            }

            if (!(await user.checkPassword(password))) {
                return res
                    .status(401)
                    .json({ error: 'Password dos not match' });
            }

            const { id, name } = user;

            return res.json({
                user: { id, name, email },
                token: jwt.sign({ id }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                }),
            });
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new SessionController();
