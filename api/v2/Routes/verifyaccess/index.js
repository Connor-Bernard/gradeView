import { Router } from 'express';

const router = Router();

router.get('/verifyaccess', async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(200).send(false);
    }
    const auth = authorization.split(' ');
    try {
        await getStudent(await getEmailFromAuth(auth));
        return res.status(200).send(true);
    } catch (e) {
        console.error(e);
        return res.status(200).send(false);
    }
});

export default router;